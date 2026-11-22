const feed = document.querySelector('.publication-feed');
const feedStatus = feed.querySelector('.publication-feed-status');
const list = feed.querySelector('.publication-feed-list');
const orcid = feed.querySelector('a').pathname.split('/').at(-1);
const source = new URL('https://api.crossref.org/works');
source.search = new URLSearchParams({
  filter: `orcid:${orcid},type:journal-article`,
  sort: 'published',
  order: 'desc',
  rows: '25',
  select: 'DOI,title,author,published,container-title',
});

function publicationEntry(work, doi, title) {
  const entry = document.createElement('li');
  const year = work.published?.['date-parts']?.[0]?.[0];
  if (Number.isInteger(year) && year >= 1000 && year < 10000) {
    const date = document.createElement('time');
    date.dateTime = String(year);
    date.textContent = year;
    entry.append(date);
  } else {
    entry.classList.add('undated-entry');
  }

  const details = document.createElement('div');
  const heading = document.createElement('h3');
  heading.textContent = title;
  const citation = document.createElement('p');
  const authors = (work.author ?? []).map(({given, family, name}) => name || [given, family].filter(Boolean).join(' ')).filter(Boolean);
  citation.textContent = authors.join(', ');
  const journal = work['container-title']?.[0];
  if (journal) {
    const name = document.createElement('cite');
    name.textContent = journal;
    if (authors.length) citation.append(' · ');
    citation.append(name);
  }
  details.append(heading);
  if (citation.textContent) details.append(citation);

  const link = document.createElement('a');
  link.className = 'paper-link';
  link.href = `https://doi.org/${encodeURI(doi).replaceAll('?', '%3F').replaceAll('#', '%23')}`;
  link.textContent = 'Read article';
  link.setAttribute('aria-label', `Read article, ${title}`);
  entry.append(details, link);
  return entry;
}

async function loadPublications() {
  feedStatus.textContent = 'Checking Crossref for articles…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(source, { credentials: 'omit', signal: controller.signal });
    if (!response.ok) throw new Error('Crossref request failed');
    const data = await response.json();
    if (!Array.isArray(data.message?.items)) throw new Error('Crossref returned an unexpected response');

    const seen = new Set([...document.querySelectorAll('#publications a[href^="https://doi.org/"]')]
      .map(link => link.pathname.slice(1).toLowerCase()));
    const entries = document.createDocumentFragment();
    for (const work of data.message.items) {
      const doi = work.DOI?.trim();
      const title = work.title?.[0]?.trim();
      if (!doi || !/^10\.\d+\/\S+$/i.test(doi) || !title || seen.has(doi.toLowerCase())) continue;
      entries.append(publicationEntry(work, doi, title));
      seen.add(doi.toLowerCase());
    }

    list.hidden = entries.childElementCount === 0;
    list.append(entries);
    feedStatus.textContent = list.hidden ? 'Crossref has no additional articles to show right now.' : '';
  } catch {
    feedStatus.textContent = 'The live publication list is temporarily unavailable.';
  } finally {
    clearTimeout(timeout);
  }
}

loadPublications();
