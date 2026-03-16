/* ═══════════════════════════════════════════════════
   script.js — Romantic Website for Ma 💞
   ═══════════════════════════════════════════════════ */

/* ══ CONFIG ══════════════════════════════════════════ */
const CORRECT_DATE = '2026-03-11';

const SURROUNDING_PHOTOS = Array.from({ length: 19 }, (_, i) =>
  `images/photo${String(i + 1).padStart(2, '0')}.jpg`
);
const CENTER_PHOTO = 'images/center.jpg';

/* ══ HEART POSITIONS (normalised 0–1) ════════════════ */
const HEART_POSITIONS = [
  { x: 0.50, y: 0.05 },
  { x: 0.35, y: 0.08 }, { x: 0.20, y: 0.17 }, { x: 0.11, y: 0.30 },
  { x: 0.08, y: 0.43 }, { x: 0.12, y: 0.56 }, { x: 0.21, y: 0.67 },
  { x: 0.32, y: 0.76 }, { x: 0.41, y: 0.83 }, { x: 0.50, y: 0.89 },
  { x: 0.59, y: 0.83 }, { x: 0.68, y: 0.76 }, { x: 0.79, y: 0.67 },
  { x: 0.88, y: 0.56 }, { x: 0.92, y: 0.43 }, { x: 0.89, y: 0.30 },
  { x: 0.80, y: 0.17 }, { x: 0.65, y: 0.08 },
  { x: 0.50, y: 0.27 },
];

const PHOTO_SIZE_FRAC = 0.14;

/* ══ INJECT SVG HEART CLIP-PATH ══════════════════════ */
function injectHeartClipPath() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';

  svg.innerHTML = `
    <defs>
      <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
        <path d="
          M 0.5 0.25
          C 0.5 0.25, 0.42 0.10, 0.27 0.10
          C 0.08 0.10, 0.08 0.35, 0.08 0.35
          C 0.08 0.55, 0.28 0.72, 0.5  0.92
          C 0.72 0.72, 0.92 0.55, 0.92 0.35
          C 0.92 0.35, 0.92 0.10, 0.73 0.10
          C 0.58 0.10, 0.5  0.25, 0.5  0.25
          Z
        "/>
      </clipPath>
    </defs>
  `;
  document.body.insertBefore(svg, document.body.firstChild);
}

/* ══ BUILD HEART PHOTO GRID ══════════════════════════ */
function buildHeartGrid() {
  const grid = document.getElementById('heart-grid');
  grid.innerHTML = '';

  // Use clientWidth; fall back to a sensible default
  const W  = grid.clientWidth || 700;
  const H  = Math.round(W * 0.95);
  const sz = Math.round(W * PHOTO_SIZE_FRAC);

  // CRITICAL: set explicit pixel height so children are visible
  grid.style.width  = '100%';
  grid.style.height = H + 'px';
  grid.style.position = 'relative';
  grid.style.display  = 'block';

  // Blush tones for placeholders
  const placeholderColors = [
    '#f9c8d2','#f7b8c6','#f5a8ba','#f9d4dc','#fbe0e6',
    '#f7c0cc','#f5b0be','#f9ccd4','#f7bcca','#f5acba',
    '#f9c4ce','#f7b4c2','#f5a4b6','#f9d0d8','#fbdce4',
    '#f7c8d0','#f5b8c4','#f9c0ca','#f7b0be'
  ];

  HEART_POSITIONS.forEach((pos, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'heart-photo';
    wrap.style.cssText = `
      width:  ${sz}px;
      height: ${sz}px;
      left:   ${Math.round(pos.x * W - sz / 2)}px;
      top:    ${Math.round(pos.y * H - sz / 2)}px;
      animation-delay: ${(idx * 0.07).toFixed(2)}s;
      background: ${placeholderColors[idx]};
    `;

    const img = document.createElement('img');
    img.src     = SURROUNDING_PHOTOS[idx];
    img.alt     = `Our memory ${idx + 1}`;
    img.loading = 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function () { this.style.display = 'none'; };

    wrap.appendChild(img);
    grid.appendChild(wrap);
  });

  /* ── Centre heart ── */
  const cSize = Math.round(sz * 2.4);
  const cLeft = Math.round(W * 0.50 - cSize / 2);
  const cTop  = Math.round(H * 0.47 - cSize / 2);

  const cWrap = document.createElement('div');
  cWrap.className = 'heart-center';
  cWrap.style.cssText = `
    position: absolute;
    width:  ${cSize}px;
    height: ${cSize}px;
    left:   ${cLeft}px;
    top:    ${cTop}px;
    z-index: 6;
  `;

  // Rose gradient border layer (same heart clip)
  const border = document.createElement('div');
  border.style.cssText = `
    position: absolute;
    inset: -6px;
    background: linear-gradient(135deg, #e8637a, #c0394f);
    clip-path: url(#heartClip);
  `;
  cWrap.appendChild(border);

  // Placeholder fill (visible when image not yet loaded)
  const fill = document.createElement('div');
  fill.style.cssText = `
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fbd0d8, #f5a8ba);
    clip-path: url(#heartClip);
  `;
  cWrap.appendChild(fill);

  // Actual photo
  const cImg = document.createElement('img');
  cImg.src = CENTER_PHOTO;
  cImg.alt = 'Our special photo';
  cImg.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    clip-path: url(#heartClip);
    filter: drop-shadow(0 6px 22px rgba(192,57,79,0.45));
    animation: heartPulse 2.5s ease-in-out infinite;
  `;
  cImg.onerror = function () { this.style.display = 'none'; }; // placeholder fill shows instead
  cWrap.appendChild(cImg);

  grid.appendChild(cWrap);
}

/* ══ FALLING HEARTS ══════════════════════════════════ */
const EMOJI_SET = ['💗','💕','🌸','💞','❤️','🌹','💓','✿','💝'];

function spawnHeart() {
  const c   = document.getElementById('hearts-container');
  const h   = document.createElement('span');
  const dur = 4 + Math.random() * 6;
  h.className   = 'rain-heart';
  h.textContent = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
  h.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${0.9 + Math.random() * 1.2}rem;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * 2}s;
  `;
  c.appendChild(h);
  setTimeout(() => h.remove(), (dur + 3) * 1000);
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
  [-8,8,-6,6,-3,3,0].forEach((x, i) => {
    setTimeout(() => { el.style.transform = `translateX(${x}px)`; }, i * 70);
  });
  setTimeout(() => { el.style.transform = ''; }, 560);
}

/* ══ UNLOCK ══════════════════════════════════════════ */
function unlockMain() {
  const opening = document.getElementById('opening-page');
  const main    = document.getElementById('main-page');

  main.classList.remove('hidden');
  main.style.overflowY = 'auto';

  // Wait for main page to be laid out before measuring grid width
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      buildHeartGrid();
      startRain();
      playMusic();
    });
  });

  setTimeout(() => {
    opening.classList.add('hidden');
    setTimeout(() => opening.remove(), 1000);
  }, 150);
}

/* ══ MUSIC ═══════════════════════════════════════════ */
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
    const b = document.createElement('div');
    b.innerHTML = '🎵 Tap anywhere to play music';
    b.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:rgba(232,99,122,0.92); color:#fff; padding:10px 26px;
      border-radius:50px; font-family:'Dancing Script',cursive; font-size:1.05rem;
      cursor:pointer; z-index:9999; box-shadow:0 4px 16px rgba(192,57,79,0.3);
      white-space:nowrap;
    `;
    document.body.appendChild(b);
    const go = () => { audio.volume=0.4; audio.play(); b.remove(); document.removeEventListener('click',go); };
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
