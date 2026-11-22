# Ridoscope

This static portfolio works on GitHub Pages without a build step.

## Update the site

Extract the ZIP. Upload `index.html`, `about.html`, `research.html`, `teaching.html`, `media.html`, `reflections.html`, and the entire `assets/` folder to the root of `ridoscope/Ridwanullah-Abdulhameed`. Upload this README if you want to keep the editing guide in the repository. Commit the upload to the branch configured under **Settings → Pages**.

The live site is <https://ridoscope.github.io/Ridwanullah-Abdulhameed/>.

## Edit the content

Each page is a standalone HTML file. Open the file in GitHub and select the pencil icon to edit it. All pages share `assets/site.css`. Relative links support both the GitHub Pages project URL and local previews. To preview locally, open `index.html` after extracting the ZIP.

## Publish a reflection

Open `reflections.html` in GitHub and select the pencil icon. Find the comment that says `Add the newest article here`. Paste this block directly below it and above any earlier reflections:

```html
<article class="reflection-post" id="your-reflection-title">
  <time datetime="2026-11-21">November 21, 2026</time>
  <h3><a href="#your-reflection-title">Your title</a></h3>
  <p>Write your first paragraph here.</p>
  <p>Add another paragraph as needed.</p>
</article>
```

Use a distinct lowercase ID with hyphens for every reflection and use the same ID after `#` in the title link. Replace both date formats with the date you want displayed. Write `&amp;` for a literal ampersand. Commit changes to publish. The title link is the direct address visitors can share for that reflection.

## Automatic journal articles

The Research page queries [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) on page load for journal articles associated with ORCID `0000-0002-1211-8335`. It displays matching articles under **More journal articles** and skips DOIs already in **Selected publications**. This works on GitHub Pages without a build step, an API key, or an Actions workflow. The selected list is always available, including when the live request fails. For future papers, make sure the publisher includes your ORCID in its Crossref deposit. Newspaper articles and posts for outlets that don't register the work with that ORCID still need to be added to News & Media by hand.
