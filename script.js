/* ═══════════════════════════════════════════════════
   script.js — Romantic Website for Ma 💞
   ═══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   CONFIG — edit these values to customise the site
══════════════════════════════════════════════════ */

// The correct unlock date in YYYY-MM-DD format
const CORRECT_DATE = '2026-03-11';

// Surrounding photos: place as images/photo01.jpg … images/photo19.jpg
const SURROUNDING_PHOTOS = Array.from({ length: 19 }, (_, i) =>
  `images/photo${String(i + 1).padStart(2, '0')}.jpg`
);

// Center special photo: place as images/center.jpg
const CENTER_PHOTO = 'images/center.jpg';

/* ══════════════════════════════════════════════════
   HEART LAYOUT
   19 points following the classic heart parametric
   curve (normalised 0–1), hand-tuned for balance.
══════════════════════════════════════════════════ */
const HEART_POSITIONS = [
  { x: 0.50, y: 0.06 }, // top centre
  { x: 0.34, y: 0.09 }, { x: 0.21, y: 0.17 }, { x: 0.12, y: 0.29 }, // upper-left lobe
  { x: 0.09, y: 0.42 }, { x: 0.13, y: 0.54 }, { x: 0.22, y: 0.65 }, // left side
  { x: 0.33, y: 0.74 }, { x: 0.42, y: 0.81 }, { x: 0.50, y: 0.87 }, // bottom-left → tip
  { x: 0.58, y: 0.81 }, { x: 0.67, y: 0.74 }, { x: 0.78, y: 0.65 }, // bottom-right → tip
  { x: 0.87, y: 0.54 }, { x: 0.91, y: 0.42 }, { x: 0.88, y: 0.29 }, // right side
  { x: 0.79, y: 0.17 }, { x: 0.66, y: 0.09 },                        // upper-right lobe
  { x: 0.50, y: 0.25 },                                                // inner upper
];

// Photo width as a fraction of the container width
const PHOTO_SIZE_FRAC = 0.155;

/* ══════════════════════════════════════════════════
   BUILD HEART PHOTO GRID
══════════════════════════════════════════════════ */
function buildHeartGrid() {
  const grid = document.getElementById('heart-grid');
  grid.innerHTML = '';

  const W  = grid.offsetWidth;
  const H  = W * 0.95;
  const sz = W * PHOTO_SIZE_FRAC;

  // Surrounding 19 photos
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
      this.style.display = 'none';
      wrap.style.background = `hsl(${340 + idx * 4}, 65%, ${83 + (idx % 5) * 2}%)`;
    };

    wrap.appendChild(img);
    grid.appendChild(wrap);
  });

  // Centre special heart-shaped photo
  const cWrap = document.createElement('div');
  cWrap.className = 'heart-center';

  const cImg = document.createElement('img');
  cImg.src = CENTER_PHOTO;
  cImg.alt = 'Our special photo';
  cImg.onerror = function () {
    this.style.clipPath     = 'none';
    this.style.borderRadius = '50%';
    this.style.background   = 'linear-gradient(135deg, #f9a8b8, #e8637a)';
  };

  cWrap.appendChild(cImg);
  grid.appendChild(cWrap);
}

/* ══════════════════════════════════════════════════
   FALLING HEARTS RAIN
══════════════════════════════════════════════════ */
const EMOJI_SET = ['💗', '💕', '🌸', '💞', '❤️', '🌹', '💓', '✿', '💝'];

function spawnHeart() {
  const container = document.getElementById('hearts-container');
  const heart     = document.createElement('span');

  heart.className  = 'rain-heart';
  heart.textContent = EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)];

  const duration = 4 + Math.random() * 6;

  heart.style.cssText = `
    left:               ${Math.random() * 100}%;
    font-size:          ${0.9 + Math.random() * 1.2}rem;
    animation-duration: ${duration}s;
    animation-delay:    ${Math.random() * 2}s;
  `;

  container.appendChild(heart);
  setTimeout(() => heart.remove(), (duration + 3) * 1000);
}

function startRain() {
  // Initial burst
  for (let i = 0; i < 14; i++) spawnHeart();
  // Continuous stream
  setInterval(() => { spawnHeart(); spawnHeart(); }, 700);
}

/* ══════════════════════════════════════════════════
   DATE CHECK
══════════════════════════════════════════════════ */
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

/* Card shake animation on wrong date */
function shake(el) {
  el.style.transition = 'transform 0.08s ease';
  const moves = [-8, 8, -6, 6, -3, 3, 0];
  moves.forEach((x, i) => {
    setTimeout(() => { el.style.transform = `translateX(${x}px)`; }, i * 70);
  });
  setTimeout(() => {
    el.style.transform  = '';
    el.style.transition = '';
  }, moves.length * 70 + 80);
}

/* ══════════════════════════════════════════════════
   UNLOCK TRANSITION
══════════════════════════════════════════════════ */
function unlockMain() {
  const opening = document.getElementById('opening-page');
  const main    = document.getElementById('main-page');

  // Reveal main page
  main.classList.remove('hidden');
  main.style.overflowY = 'auto';

  // Build grid, start rain, play music after a short delay
  setTimeout(() => {
    buildHeartGrid();
    startRain();
    playMusic();
  }, 200);

  // Fade out & remove opening page
  setTimeout(() => {
    opening.classList.add('hidden');
    setTimeout(() => opening.remove(), 1000);
  }, 120);
}

/* ══════════════════════════════════════════════════
   BACKGROUND MUSIC
   Place your file at: audio/music.mp3
══════════════════════════════════════════════════ */
function playMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.volume = 0;

  audio.play()
    .then(() => {
      // Gentle volume fade-in
      let v = 0;
      const ticker = setInterval(() => {
        v = Math.min(v + 0.02, 0.45);
        audio.volume = v;
        if (v >= 0.45) clearInterval(ticker);
      }, 120);
    })
    .catch(() => {
      // Autoplay blocked — show a tap-to-play banner
      const banner = document.createElement('div');
      banner.innerHTML = '🎵 Tap anywhere to play music';
      banner.style.cssText = `
        position:    fixed;
        bottom:      24px;
        left:        50%;
        transform:   translateX(-50%);
        background:  rgba(232, 99, 122, 0.92);
        color:       #fff;
        padding:     10px 26px;
        border-radius: 50px;
        font-family: 'Dancing Script', cursive;
        font-size:   1.05rem;
        cursor:      pointer;
        z-index:     9999;
        box-shadow:  0 4px 16px rgba(192, 57, 79, 0.3);
        white-space: nowrap;
      `;
      document.body.appendChild(banner);

      const startAudio = () => {
        audio.volume = 0.4;
        audio.play();
        banner.remove();
        document.removeEventListener('click', startAudio);
      };
      document.addEventListener('click', startAudio);
    });
}

/* ══════════════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════════════ */

// Allow Enter key to confirm the date
document.getElementById('date-input')
  .addEventListener('keydown', e => {
    if (e.key === 'Enter') checkDate();
  });

// Rebuild photo grid on window resize
let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    const grid = document.getElementById('heart-grid');
    if (grid && grid.children.length) buildHeartGrid();
  }, 250);
});
