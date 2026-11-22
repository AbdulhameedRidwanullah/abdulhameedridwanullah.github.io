const interests = document.querySelector('.interests-strip');
const track = interests.querySelector('.interests-track');
const toggle = interests.querySelector('.motion-toggle');
const focusTopic = document.querySelector('.hero-focus-topic');
const interestsList = track.firstElementChild;
const focusTopics = [...interestsList.children].map(item => item.textContent.trim());
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
let focusIndex = 0;
let focusTimer;
let focusTransition;

const repeat = interestsList.cloneNode(true);
repeat.setAttribute('aria-hidden', 'true');
repeat.classList.add('interests-repeat');
track.append(repeat);

function setMotion() {
  const allowsMotion = !motionPreference.matches;
  interests.classList.toggle('has-motion', allowsMotion);
  interests.classList.toggle('is-paused', paused);
  toggle.hidden = !allowsMotion;
  toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
  clearInterval(focusTimer);
  focusTransition?.cancel();

  if (allowsMotion && !paused) {
    focusTimer = setInterval(() => {
      focusIndex = (focusIndex + 1) % focusTopics.length;
      focusTopic.textContent = focusTopics[focusIndex];
      focusTransition = focusTopic.animate([
        { opacity: 0, transform: 'translateY(.28rem)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 360, easing: 'ease-out' });
    }, 2900);
  }
}

toggle.addEventListener('click', () => {
  paused = !paused;
  setMotion();
});
motionPreference.addEventListener('change', setMotion);
setMotion();

const network = document.querySelector('.research-map-network');
const center = network.querySelector('.research-map-center');
const topics = [...network.querySelectorAll('.theme-node')];
const canvas = network.querySelector('.research-map-lines');
const context = canvas.getContext('2d');
const heading = document.querySelector('.theme-title');
const question = document.querySelector('.theme-question');
const detailLink = document.querySelector('.theme-link');
let selected = network.querySelector('[aria-current]');

function drawConnections() {
  if (!context) return;

  const viewport = network.getBoundingClientRect();
  const pixelRatio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(viewport.width * pixelRatio);
  canvas.height = Math.round(viewport.height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  function midpoint(element) {
    const bounds = element.getBoundingClientRect();
    return {
      x: bounds.left - viewport.left + bounds.width / 2,
      y: bounds.top - viewport.top + bounds.height / 2,
    };
  }

  const start = midpoint(center);
  const narrow = matchMedia('(max-width: 37.5rem)').matches;
  for (const topic of topics) {
    const end = midpoint(topic);
    const active = topic === selected;
    context.beginPath();
    context.moveTo(start.x, start.y);
    if (narrow) {
      const bend = (start.y + end.y) / 2;
      context.bezierCurveTo(start.x, bend, end.x, bend, end.x, end.y);
    } else {
      const bend = (start.x + end.x) / 2;
      context.bezierCurveTo(bend, start.y, bend, end.y, end.x, end.y);
    }
    context.strokeStyle = active ? '#99dcfb' : '#5b7d8b';
    context.lineWidth = active ? 2 : 1;
    context.setLineDash(active ? [] : [2, 5]);
    context.stroke();
  }
}

for (const topic of topics) {
  topic.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (topic === selected) return;
    selected.removeAttribute('aria-current');
    selected = topic;
    selected.setAttribute('aria-current', 'true');
    heading.textContent = topic.textContent;
    question.textContent = topic.dataset.description;
    detailLink.href = topic.href;
    drawConnections();
  });
}

const networkObserver = new ResizeObserver(drawConnections);
networkObserver.observe(network);
for (const node of [center, ...topics]) networkObserver.observe(node);
