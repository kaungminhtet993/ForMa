/* ═══════════════════════════════════════════════════
   script.js — Romantic Website for Ma 💞
   ═══════════════════════════════════════════════════ */

const CORRECT_DATE = '2026-03-11';

const SURROUNDING_PHOTOS = Array.from({ length: 19 }, (_, i) =>
  `images/photo${String(i + 1).padStart(2, '0')}.jpg`
);
const CENTER_PHOTO = 'images/center.jpg';

/* ══════════════════════════════════════════════════
   HEART POSITIONS
   Using the parametric heart equation:
     x(t) = 16·sin³(t)
     y(t) = 13·cos(t) − 5·cos(2t) − 2·cos(3t) − cos(4t)
   19 points sampled evenly, then normalised to 0–1
══════════════════════════════════════════════════ */
function getHeartPoints(n) {
  const raw = [];
  // Sample t from -π to π, skip the very bottom tip for balance
  for (let i = 0; i < n; i++) {
    const t = -Math.PI + (2 * Math.PI * i) / n;
    const x =  16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    raw.push({ x, y });
  }
  // Normalise to 0–1
  const xs = raw.map(p => p.x);
  const ys = raw.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return raw.map(p => ({
    x: (p.x - minX) / (maxX - minX),
    y: (p.y - minY) / (maxY - minY),
  }));
}

/* ══ INJECT SVG HEART CLIP-PATH FOR CENTRE PHOTO ════ */
function injectHeartClipPath() {
  const existing = document.getElementById('heartClipSVG');
  if (existing) existing.remove();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'heartClipSVG';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
  svg.innerHTML = `
    <defs>
      <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
        <path d="M0.5,0.25 C0.5,0.1 0.35,0.02 0.22,0.02 C0.05,0.02 0.05,0.22 0.05,0.28
                 C0.05,0.5  0.28,0.70 0.5,0.95
                 C0.72,0.70 0.95,0.5  0.95,0.28
                 C0.95,0.22 0.95,0.02 0.78,0.02
                 C0.65,0.02 0.5,0.1  0.5,0.25 Z"/>
      </clipPath>
    </defs>`;
  document.body.insertBefore(svg, document.body.firstChild);
}

/* ══ BUILD HEART PHOTO GRID ══════════════════════════ */
function buildHeartGrid() {
  const section = document.getElementById('heart-section');
  const grid    = document.getElementById('heart-grid');
  grid.innerHTML = '';

  // Size the canvas
  const maxW = Math.min(section.clientWidth - 48, 720);
  const W    = maxW;
  const H    = W; // square canvas — heart fills it
  const sz   = Math.round(W * 0.13); // circle diameter
  const r    = sz / 2;

  grid.style.width    = W + 'px';
  grid.style.height   = H + 'px';
  grid.style.position = 'relative';
  grid.style.margin   = '0 auto';
  grid.style.display  = 'block';

  const points = getHeartPoints(19);

  const pinkShades = [
    '#f9b8c8','#f7a8ba','#f5c0cc','#fbd0d8','#f9c4d0',
    '#f7b0c0','#f5a0b4','#fbc8d4','#f9bcc8','#f7acbc',
    '#f5bcca','#f9c8d2','#f7b8c4','#f5a8b8','#fbd4dc',
    '#f9c0cc','#f7b0c2','#f5a4b6','#fbbcc8',
  ];

  points.forEach((pos, idx) => {
    // Map 0–1 to pixel, with padding so circles don't clip the edge
    const pad  = sz * 0.6;
    const cx   = pad + pos.x * (W - pad * 2);
    const cy   = pad + pos.y * (H - pad * 2);

    const wrap = document.createElement('div');
    wrap.className = 'heart-photo';
    wrap.style.cssText = `
      width:            ${sz}px;
      height:           ${sz}px;
      border-radius:    50%;
      left:             ${Math.round(cx - r)}px;
      top:              ${Math.round(cy - r)}px;
      animation-delay:  ${(idx * 0.06).toFixed(2)}s;
      background:       ${pinkShades[idx]};
    `;

    const img = document.createElement('img');
    img.src   = SURROUNDING_PHOTOS[idx];
    img.alt   = `Our memory ${idx + 1}`;
    img.loading = 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;';
    img.onerror = () => { img.style.display = 'none'; };
    wrap.appendChild(img);
    grid.appendChild(wrap);
  });

  /* ── Centre heart photo ── */
  const cSize = Math.round(sz * 2.2);
  const cX    = Math.round(W / 2 - cSize / 2);
  const cY    = Math.round(H * 0.47 - cSize / 2);

  const cWrap = document.createElement('div');
  cWrap.style.cssText = `
    position: absolute;
    width:    ${cSize}px;
    height:   ${cSize}px;
    left:     ${cX}px;
    top:      ${cY}px;
    z-index:  6;
  `;

  // gradient border
  const border = document.createElement('div');
  border.style.cssText = `
    position:   absolute;
    inset:      -6px;
    background: linear-gradient(135deg,#e8637a,#c0394f);
    clip-path:  url(#heartClip);
  `;
  cWrap.appendChild(border);

  // soft pink placeholder fill
  const fill = document.createElement('div');
  fill.style.cssText = `
    position:   absolute;
    inset:      0;
    background: linear-gradient(135deg,#fbd0d8,#f5a8ba);
    clip-path:  url(#heartClip);
  `;
  cWrap.appendChild(fill);

  const cImg = document.createElement('img');
  cImg.src = CENTER_PHOTO;
  cImg.alt = 'Our special photo';
  cImg.style.cssText = `
    position:   absolute;
    inset:      0;
    width:      100%;
    height:     100%;
    object-fit: cover;
    display:    block;
    clip-path:  url(#heartClip);
    filter:     drop-shadow(0 6px 22px rgba(192,57,79,0.45));
    animation:  heartPulse 2.5s ease-in-out infinite;
  `;
  cImg.onerror = () => { cImg.style.display = 'none'; };
  cWrap.appendChild(cImg);

  grid.appendChild(cWrap);
}

/* ══ FALLING HEARTS ══════════════════════════════════ */
const EMOJI_SET = ['💗','💕','🌸','💞','❤️','🌹','💓','✿','💝'];
function spawnHeart() {
  const c = document.getElementById('hearts-container');
  const h = document.createElement('span');
  const dur = 4 + Math.random() * 6;
  h.className   = 'rain-heart';
  h.textContent = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];
  h.style.cssText = `
    left:${Math.random()*100}%;
    font-size:${0.9+Math.random()*1.2}rem;
    animation-duration:${dur}s;
    animation-delay:${Math.random()*2}s;
  `;
  c.appendChild(h);
  setTimeout(() => h.remove(), (dur+3)*1000);
}
function startRain() {
  for (let i=0;i<14;i++) spawnHeart();
  setInterval(()=>{ spawnHeart(); spawnHeart(); }, 700);
}

/* ══ DATE CHECK ══════════════════════════════════════ */
function checkDate() {
  const val = document.getElementById('date-input').value;
  const err = document.getElementById('error-msg');
  if (!val) { err.textContent='Please pick a date, my love 🌸'; err.classList.add('visible'); return; }
  if (val === CORRECT_DATE) { err.classList.remove('visible'); unlockMain(); }
  else { err.textContent="Hmm… that's not our special day. Try again my love 💭"; err.classList.add('visible'); shake(document.querySelector('.opening-card')); }
}
function shake(el) {
  [-8,8,-6,6,-3,3,0].forEach((x,i)=>{ setTimeout(()=>{ el.style.transform=`translateX(${x}px)`; },i*70); });
  setTimeout(()=>{ el.style.transform=''; }, 560);
}

/* ══ UNLOCK ══════════════════════════════════════════ */
function unlockMain() {
  const opening = document.getElementById('opening-page');
  const main    = document.getElementById('main-page');
  main.classList.remove('hidden');
  main.style.overflowY = 'auto';
  // Double rAF ensures layout is complete before we measure
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    buildHeartGrid();
    startRain();
    playMusic();
  }));
  setTimeout(()=>{
    opening.classList.add('hidden');
    setTimeout(()=>opening.remove(), 1000);
  }, 150);
}

/* ══ MUSIC ═══════════════════════════════════════════ */
function playMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;
  audio.volume = 0;
  audio.play().then(()=>{
    let v=0;
    const t=setInterval(()=>{ v=Math.min(v+0.02,0.45); audio.volume=v; if(v>=0.45)clearInterval(t); },120);
  }).catch(()=>{
    const b=document.createElement('div');
    b.innerHTML='🎵 Tap anywhere to play music';
    b.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(232,99,122,0.92);color:#fff;padding:10px 26px;border-radius:50px;font-family:\'Dancing Script\',cursive;font-size:1.05rem;cursor:pointer;z-index:9999;box-shadow:0 4px 16px rgba(192,57,79,0.3);white-space:nowrap;';
    document.body.appendChild(b);
    const go=()=>{ audio.volume=0.4; audio.play(); b.remove(); document.removeEventListener('click',go); };
    document.addEventListener('click',go);
  });
}

/* ══ INIT ════════════════════════════════════════════ */
injectHeartClipPath();
document.getElementById('date-input').addEventListener('keydown',e=>{ if(e.key==='Enter')checkDate(); });
let _rt;
window.addEventListener('resize',()=>{
  clearTimeout(_rt);
  _rt=setTimeout(()=>{ const g=document.getElementById('heart-grid'); if(g&&g.children.length)buildHeartGrid(); },250);
});
