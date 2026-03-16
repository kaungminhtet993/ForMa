/* ═══════════════════════════════════════════════════
   script.js — Romantic Website for Ma 💞
   ═══════════════════════════════════════════════════ */

/* ══ CONFIG ══════════════════════════════════════════
   Only edit this section to customise the site
══════════════════════════════════════════════════ */
const CORRECT_DATE = '2026-03-11'; // YYYY-MM-DD

const SURROUNDING_PHOTOS = Array.from({ length: 19 }, (_, i) =>
  `images/photo${String(i + 1).padStart(2, '0')}.jpg`
);
const CENTER_PHOTO = 'images/center.jpg';

/* ══ HEART POSITIONS (normalised 0–1) ════════════════
   19 points sampled from a classic heart curve
══════════════════════════════════════════════════ */
const HEART_POSITIONS = [
  { x: 0.50, y: 0.05 }, // top centre
  { x: 0.35, y: 0.08 }, { x: 0.20, y: 0.17 }, { x: 0.11, y: 0.30 }, // upper-left lobe
  { x: 0.08, y: 0.43 }, { x: 0.12, y: 0.56 }, { x: 0.21, y: 0.67 }, // left side
  { x: 0.32, y: 0.76 }, { x: 0.41, y: 0.83 }, { x: 0.50, y: 0.89 }, // bottom tip
  { x: 0.59, y: 0.83 }, { x: 0.68, y: 0.76 }, { x: 0.79, y: 0.67 }, // right side
  { x: 0.88, y: 0.56 }, { x: 0.92, y: 0.43 }, { x: 0.89, y: 0.30 }, // upper-right lobe
  { x: 0.80, y: 0.17 }, { x: 0.65, y: 0.08 }, // upper-right
  { x: 0.50, y: 0.27 }, // inner upper centre
];

const PHOTO_SIZE_FRAC = 0.155;

/* ══ SVG HEART CLIP-PATH ══════════════════════════════
   Inject a real SVG heart <clipPath> into the DOM
   so the centre photo is clipped to a true heart shape
══════════════════════════════════════════════════ */
function injectHeartClipPath() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

  const defs = document.createElementNS(svgNS, 'defs');
  const clip = document.createElementNS(svgNS, 'clipPath');
  clip.setAttribute('id', 'heartClip');
  clip.setAttribute('clipPathUnits', 'objectBoundingBox');

  const path = document.createElementNS(svgNS, 'path');
  // Heart path normalised to a 0–1 bounding box
  path.setAttribute('d',
    'M0.5,0.25 C0.5,0.25 0.1,-0.1 0.1,0.3 C0.1,0.6 0.5,0.9 0.5,0.95 ' +
    'C0.5,0.9 0.9,0.6 0.9,0.3 C0.9,-0.1 0.5,0.25 0.5,0.25 Z'
  );

  clip.appendChild(path);
  defs.appendChild(clip);
  svg.appendChild(defs);
  document.body.appendChild(svg);
}

/* ══ BUILD HEART PHOTO GRID ══════════════════════════ */
function buildHeartGrid() {
  const grid = document.getElementById('heart-grid');
  grid.innerHTML = '';

  const W  = grid.offsetWidth;
  const H  = W * 0.95;
  const sz = W * PHOTO_SIZE_FRAC;

  // Set explicit pixel height so absolute children are visible
  grid.style.height = H + 'px';

  HEART_POSITIONS.forEach((pos, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'heart-photo';
    wrap.style.cssText = `
      width:  ${sz}px;
      height: ${sz}px;
      left:   ${pos.x * W - sz / 2}px;
      top:    ${pos.y * H - sz / 2}px;
      animation-delay: ${idx * 0.07}s;
    `;

    const img = document.createElement('img');
    img.src     = SURROUNDING_PHOTOS[idx];
    img.alt     = `Our memory ${idx + 1}`;
    img.loading = 'lazy';
    img.onerror = function () {
      this.style.display   = 'none';
      wrap.style.background = `hsl(${340 + idx * 4}, 65%, ${83 + (idx % 5) * 2}%)`;
    };

    wrap.appendChild(img);
    grid.appendChild(wrap);
  });

  // Centre heart photo
  const cWrap = document.createElement('div');
  cWrap.className = 'heart-center';

  // Position & size centre piece
  const cSize = sz * 2.2;
  cWrap.style.cssText = `
    width:  ${cSize}px;
    height: ${cSize}px;
    left:   ${W * 0.5  - cSize / 2}px;
    top:    ${H * 0.48 - cSize / 2}px;
  `;

  const cImg = document.createElement('img');
  cImg.src = CENTER_PHOTO;
  cImg.alt = 'Our special photo';
  cImg.style.cssText = `
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    clip-path: url(#heartClip);
    filter: drop-shadow(0 6px 22px rgba(192,57,79,0.45));
    animation: heartPulse 2.5s ease-in-out infinite;
  `;
  cImg.onerror = function () {
    cWrap.style.background   = 'linear-gradient(135deg,#f9a8b8,#e8637a)';
    cWrap.style.clipPath      = 'url(#heartClip)';
    cWrap.style.borderRadius  = '0';
    this.style.display        = 'none';
  };

  // Rose-gradient heart border behind the image
  const border = document.createElement('div');
  border.className = 'heart-center-border';
  border.style.cssText = `
    position: absolute;
    inset: -5px;
    background: linear-gradient(135deg, #e8637a, #c0394f);
    clip-path: url(#heartClip);
    z-index: -1;
  `;

  cWrap.style.position = 'absolute';
  cWrap.style.zIndex   = '5';
  cWrap.appendChild(border);
  cWrap.appendChild(cImg);
  grid.appendChild(cWrap);
}

/* ══ FALLING HEARTS RAIN ══════════════════════════════ */
const EMOJI_SET = ['💗', '💕', '🌸', '💞', '❤️', '🌹', '💓', '✿', '💝'];

function spawnHeart() {
  const container = document.getElementById('hearts-container');
  const heart     = document.createElement('span');
  heart.className  = 'rain-heart';
  heart.textContent = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
  const dur = 4 + Math.random() * 6;
  heart.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${0.9 + Math.random() * 1.2}rem;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * 2}s;
  `;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (dur + 3) * 1000);
}

function startRain() {
  for (let i = 0; i < 14; i++) spawnHeart();
  setInterval(() => { spawnHeart(); spawnHeart(); }, 700);
}

/* ══ DATE CHECK ══════════════════════════════════════ */
function checkDate() {
  const val = document.getElementById('date-input').value;
  const err = document.getElementById('error-msg');

  if (!val) {
    err.textContent = 'Please pick a date, my love 🌸';
    err.classList.add('visible');
    return;
  }
  if (val === CORRECT_DATE) {
    err.classList.remove('visible');
    unlockMain();
  } else {
    err.textContent = "Hmm… that's not our special day. Try again my love 💭";
    err.classList.add('visible');
    shake(document.querySelector('.opening-card'));
  }
}

function shake(el) {
  el.style.transition = 'transform 0.08s ease';
  [-8, 8, -6, 6, -3, 3, 0].forEach((x, i) => {
    setTimeout(() => { el.style.transform = `translateX(${x}px)`; }, i * 70);
  });
  setTimeout(() => { el.style.transform = ''; el.style.transition = ''; }, 560);
}

/* ══ UNLOCK TRANSITION ════════════════════════════════ */
function unlockMain() {
  const opening = document.getElementById('opening-page');
  const main    = document.getElementById('main-page');

  main.classList.remove('hidden');
  main.style.overflowY = 'auto';

  setTimeout(() => { buildHeartGrid(); startRain(); playMusic(); }, 300);
  setTimeout(() => {
    opening.classList.add('hidden');
    setTimeout(() => opening.remove(), 1000);
  }, 120);
}

/* ══ BACKGROUND MUSIC ════════════════════════════════ */
function playMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(v + 0.02, 0.45);
      audio.volume = v;
      if (v >= 0.45) clearInterval(t);
    }, 120);
  }).catch(() => {
    const banner = document.createElement('div');
    banner.innerHTML = '🎵 Tap anywhere to play music';
    banner.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:rgba(232,99,122,0.92); color:#fff; padding:10px 26px;
      border-radius:50px; font-family:'Dancing Script',cursive; font-size:1.05rem;
      cursor:pointer; z-index:9999; box-shadow:0 4px 16px rgba(192,57,79,0.3);
      white-space:nowrap;
    `;
    document.body.appendChild(banner);
    const go = () => { audio.volume = 0.4; audio.play(); banner.remove(); document.removeEventListener('click', go); };
    document.addEventListener('click', go);
  });
}

/* ══ INIT ════════════════════════════════════════════ */
injectHeartClipPath();

document.getElementById('date-input')
  .addEventListener('keydown', e => { if (e.key === 'Enter') checkDate(); });

let _rt;
window.addEventListener('resize', () => {
  clearTimeout(_rt);
  _rt = setTimeout(() => {
    const g = document.getElementById('heart-grid');
    if (g && g.children.length) buildHeartGrid();
  }, 250);
});
