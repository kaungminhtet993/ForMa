/* ═══════════════════════════════════════
   script.js  —  For Ma 💞
   ═══════════════════════════════════════ */

/* ── CONFIG ── */
const CORRECT_DATE = '2026-03-11';

const PHOTOS = Array.from({length:19},(_,i)=>
  `images/photo${String(i+1).padStart(2,'0')}.jpg`
);
const CENTER_PHOTO = 'images/center.jpg';

/* Soft blush placeholder colours (used when images not yet uploaded) */
const BLUSH = [
  '#f9b8c8','#f7a8ba','#f5c0cc','#fbd0d8','#f9c4d0',
  '#f7b0c0','#f5a0b4','#fbc8d4','#f9bcc8','#f7acbc',
  '#f5bcca','#f9c8d2','#f7b8c4','#f5a8b8','#fbd4dc',
  '#f9c0cc','#f7b0c2','#f5a4b6','#fbbcc8'
];

/* ══════════════════════════════════════
   SVG HEART CLIP-PATH
   Injected once into <body> so the centre
   photo can be clipped to a real heart shape
   ══════════════════════════════════════ */
function injectSVG() {
  if (document.getElementById('ma-svg')) return;
  const el = document.createElementNS('http://www.w3.org/2000/svg','svg');
  el.id = 'ma-svg';
  el.setAttribute('width','0');
  el.setAttribute('height','0');
  el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  /* Heart path in objectBoundingBox coords (0–1) */
  el.innerHTML = `<defs>
    <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
      <path d="M0.5,0.93
               C0.5,0.93 0.05,0.60 0.05,0.32
               C0.05,0.12 0.18,0.02 0.32,0.02
               C0.41,0.02 0.50,0.10 0.50,0.10
               C0.50,0.10 0.59,0.02 0.68,0.02
               C0.82,0.02 0.95,0.12 0.95,0.32
               C0.95,0.60 0.50,0.93 0.50,0.93Z"/>
    </clipPath>
  </defs>`;
  document.body.insertBefore(el, document.body.firstChild);
}

/* ══════════════════════════════════════
   PARAMETRIC HEART POINTS
   x(t) = 16·sin³(t)
   y(t) = 13·cos(t) − 5·cos(2t) − 2·cos(3t) − cos(4t)
   Returns 19 {x,y} normalised to 0–1
   ══════════════════════════════════════ */
function heartPoints(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = -Math.PI + (2 * Math.PI * i) / n;
    pts.push({
      x:  16 * Math.pow(Math.sin(t), 3),
      y: -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t))
    });
  }
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  const x0=Math.min(...xs), x1=Math.max(...xs);
  const y0=Math.min(...ys), y1=Math.max(...ys);
  return pts.map(p=>({
    x:(p.x-x0)/(x1-x0),
    y:(p.y-y0)/(y1-y0)
  }));
}

/* ══════════════════════════════════════
   BUILD GRID
   ══════════════════════════════════════ */
function buildGrid() {
  const section = document.getElementById('heart-section');
  const grid    = document.getElementById('heart-grid');
  grid.innerHTML = '';

  /* Canvas size: fit inside the section with padding */
  const avail = section.clientWidth - 48;
  const SIZE  = Math.min(avail, 680);   /* max 680 px square */
  const DIAM  = Math.round(SIZE * 0.13);/* circle diameter   */
  const R     = DIAM / 2;
  const PAD   = DIAM * 0.55;           /* edge padding so circles don't clip */

  /* Set grid to an explicit square */
  grid.style.width    = SIZE + 'px';
  grid.style.height   = SIZE + 'px';
  grid.style.position = 'relative';

  const points = heartPoints(19);

  points.forEach((p, i) => {
    /* Map 0–1 → pixel centre within padded area */
    const cx = PAD + p.x * (SIZE - PAD * 2);
    const cy = PAD + p.y * (SIZE - PAD * 2);

    const div = document.createElement('div');
    div.className = 'hp';
    div.style.cssText = `
      width:           ${DIAM}px;
      height:          ${DIAM}px;
      left:            ${Math.round(cx - R)}px;
      top:             ${Math.round(cy - R)}px;
      background:      ${BLUSH[i]};
      animation-delay: ${(i * 0.06).toFixed(2)}s;
    `;

    const img = document.createElement('img');
    img.src     = PHOTOS[i];
    img.alt     = `Memory ${i+1}`;
    img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    div.appendChild(img);
    grid.appendChild(div);
  });

  /* ── Centre heart photo ── */
  const CS   = Math.round(DIAM * 2.3);  /* heart size */
  const left = Math.round(SIZE / 2 - CS / 2);
  const top  = Math.round(SIZE * 0.46 - CS / 2);

  const hc = document.createElement('div');
  hc.className = 'hc';
  hc.style.cssText = `width:${CS}px;height:${CS}px;left:${left}px;top:${top}px;`;

  /* border glow */
  const border = document.createElement('div');
  border.className = 'hc-border';
  hc.appendChild(border);

  /* placeholder fill */
  const fill = document.createElement('div');
  fill.className = 'hc-fill';
  hc.appendChild(fill);

  /* actual photo */
  const cImg = document.createElement('img');
  cImg.src = CENTER_PHOTO;
  cImg.alt = 'Our special photo';
  cImg.onerror = () => { cImg.style.display = 'none'; };
  hc.appendChild(cImg);

  grid.appendChild(hc);
}

/* ══════════════════════════════════════
   FALLING HEARTS
   ══════════════════════════════════════ */
const EMOJIS = ['💗','💕','🌸','💞','❤️','🌹','💓','✿','💝'];

function spawnHeart() {
  const c = document.getElementById('hearts-container');
  const h = document.createElement('span');
  const d = 4 + Math.random() * 6;
  h.className   = 'rain-heart';
  h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  h.style.cssText = `left:${Math.random()*100}%;font-size:${.9+Math.random()*1.2}rem;animation-duration:${d}s;animation-delay:${Math.random()*2}s;`;
  c.appendChild(h);
  setTimeout(()=>h.remove(),(d+3)*1000);
}
function startRain(){
  for(let i=0;i<14;i++) spawnHeart();
  setInterval(()=>{ spawnHeart(); spawnHeart(); },700);
}

/* ══════════════════════════════════════
   DATE CHECK
   ══════════════════════════════════════ */
function checkDate(){
  const val = document.getElementById('date-input').value;
  const err = document.getElementById('error-msg');
  if(!val){ err.textContent='Please pick a date, my love 🌸'; err.classList.add('visible'); return; }
  if(val===CORRECT_DATE){ err.classList.remove('visible'); unlockMain(); }
  else { err.textContent="Hmm… that's not our special day. Try again my love 💭"; err.classList.add('visible'); shake(document.querySelector('.opening-card')); }
}
function shake(el){
  [-8,8,-6,6,-3,3,0].forEach((x,i)=>setTimeout(()=>{ el.style.transform=`translateX(${x}px)`; },i*70));
  setTimeout(()=>{ el.style.transform=''; },560);
}

/* ══════════════════════════════════════
   UNLOCK
   ══════════════════════════════════════ */
function unlockMain(){
  const opening = document.getElementById('opening-page');
  const main    = document.getElementById('main-page');
  main.classList.remove('hidden');
  main.style.overflowY = 'auto';
  /* Wait two frames so the browser lays out #heart-section before we measure it */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    buildGrid();
    startRain();
    playMusic();
  }));
  setTimeout(()=>{ opening.classList.add('hidden'); setTimeout(()=>opening.remove(),1000); },150);
}

/* ══════════════════════════════════════
   MUSIC
   ══════════════════════════════════════ */
function playMusic(){
  const a = document.getElementById('bg-music');
  if(!a) return;
  a.volume = 0;
  a.play().then(()=>{
    let v=0;
    const t=setInterval(()=>{ v=Math.min(v+.02,.45); a.volume=v; if(v>=.45)clearInterval(t); },120);
  }).catch(()=>{
    const b=document.createElement('div');
    b.innerHTML='🎵 Tap anywhere to play music';
    b.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(232,99,122,.92);color:#fff;padding:10px 26px;border-radius:50px;font-family:\'Dancing Script\',cursive;font-size:1.05rem;cursor:pointer;z-index:9999;white-space:nowrap;box-shadow:0 4px 16px rgba(192,57,79,.3);';
    document.body.appendChild(b);
    const go=()=>{ a.volume=.4; a.play(); b.remove(); document.removeEventListener('click',go); };
    document.addEventListener('click',go);
  });
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
injectSVG();

document.getElementById('date-input')
  .addEventListener('keydown',e=>{ if(e.key==='Enter') checkDate(); });

let _rt;
window.addEventListener('resize',()=>{
  clearTimeout(_rt);
  _rt=setTimeout(()=>{ const g=document.getElementById('heart-grid'); if(g&&g.children.length) buildGrid(); },250);
});
