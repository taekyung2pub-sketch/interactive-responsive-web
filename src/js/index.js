import { initNav } from './utils.js';

initNav();

// index 페이지는 body overflow: hidden 고정이므로 LNB 닫을 때 복원하지 않음
document.getElementById('navOverlay')?.addEventListener('click', () => {
  document.body.style.overflow = 'hidden';
});

// =========================
// Data
// =========================

const SLIDES = [
  { num: '(01)', title: 'React Component System', href: '/work/react-component-system.html' },
  { num: '(02)', title: 'React App',               href: '/work/react-app.html' },
  { num: '(03)', title: 'Vue Component System',    href: '/work/vue-component-system.html' },
  { num: '(04)', title: 'Portfolio',               href: '/work/portfolio.html' },
];

const TOTAL  = SLIDES.length;
const realIdx = (n) => ((n % TOTAL) + TOTAL) % TOTAL;


// =========================
// Elements
// =========================

const featuredSlides    = document.querySelectorAll('.featured-slide');
const featuredNum       = document.getElementById('featuredNum');
const featuredTitle     = document.getElementById('featuredTitle');
const featuredTitleInner = document.getElementById('featuredTitleInner');
const featuredPrev      = document.getElementById('featuredPrev');
const featuredNext      = document.getElementById('featuredNext');
const layout            = document.getElementById('layout');
const toggleBtn         = document.getElementById('toggleBtn');
const btnIcon           = document.getElementById('btnIcon');
const indexTrackEl      = document.getElementById('indexTrack');
const indexSlides       = document.querySelectorAll('.index-slide');


// =========================
// Featured swiper
// =========================

let current     = 0;
let isAnimating = false;
let isIndex     = false;

const TITLE_DURATION = 300;
const TITLE_EASE     = 'cubic-bezier(0.4,0,0.2,1)';

const animateTitle = (idx) => {
  featuredTitleInner.style.transition = `transform ${TITLE_DURATION}ms ${TITLE_EASE}, opacity ${TITLE_DURATION}ms ${TITLE_EASE}`;
  featuredTitleInner.style.transform  = 'translateY(-60%)';
  featuredTitleInner.style.opacity    = '0';

  setTimeout(() => {
    featuredNum.textContent   = SLIDES[idx].num;
    featuredTitle.textContent = SLIDES[idx].title;
    featuredTitle.href        = SLIDES[idx].href;

    featuredTitleInner.style.transition = 'none';
    featuredTitleInner.style.transform  = 'translateY(60%)';
    featuredTitleInner.style.opacity    = '0';

    featuredTitleInner.offsetHeight; // reflow

    featuredTitleInner.style.transition = `transform ${TITLE_DURATION}ms ${TITLE_EASE}, opacity ${TITLE_DURATION}ms ${TITLE_EASE}`;
    featuredTitleInner.style.transform  = 'translateY(0)';
    featuredTitleInner.style.opacity    = '1';
  }, TITLE_DURATION + 20);
};

const goTo = (next) => {
  if (isAnimating || isIndex) return;
  isAnimating = true;

  const prevIdx = realIdx(current);
  current = next;
  const nextIdx = realIdx(current);

  featuredSlides[prevIdx].classList.remove('is-active');
  featuredSlides[prevIdx].classList.add('is-out');
  featuredSlides[nextIdx].classList.add('is-active');

  animateTitle(nextIdx);

  setTimeout(() => {
    featuredSlides[prevIdx].classList.remove('is-out');
    isAnimating = false;
  }, 900);
};

// init
featuredTitleInner.style.transform = 'translateY(60%)';
featuredTitleInner.style.opacity   = '0';
setTimeout(() => {
  featuredTitleInner.style.transition = `transform 0.5s ${TITLE_EASE}, opacity 0.5s ${TITLE_EASE}`;
  featuredTitleInner.style.transform  = 'translateY(0)';
  featuredTitleInner.style.opacity    = '1';
}, 400);

featuredPrev?.addEventListener('click', () => goTo(current - 1));
featuredNext?.addEventListener('click', () => goTo(current + 1));

// wheel
let wheelLock = false;
window.addEventListener('wheel', (e) => {
  if (isIndex) return;
  e.preventDefault();
  if (wheelLock) return;
  wheelLock = true;
  setTimeout(() => { wheelLock = false; }, 950);
  if (e.deltaY > 0) goTo(current + 1);
  else              goTo(current - 1);
}, { passive: false });

// touch
let touchY = 0;
window.addEventListener('touchstart', e => { if (!isIndex) touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', e => {
  if (isIndex) return;
  const diff = touchY - e.changedTouches[0].clientY;
  if (diff > 50)       goTo(current + 1);
  else if (diff < -50) goTo(current - 1);
}, { passive: true });


// =========================
// Index track — 무한루프
// =========================

const originalCount = indexSlides.length;

const cloneAppend = () => {
  for (let i = originalCount - 1; i >= 0; i--) {
    const clone = indexSlides[i].cloneNode(true);
    clone.classList.add('is-clone');
    indexTrackEl.insertBefore(clone, indexTrackEl.firstChild);
  }
  for (let i = 0; i < originalCount; i++) {
    const clone = indexSlides[i].cloneNode(true);
    clone.classList.add('is-clone');
    indexTrackEl.appendChild(clone);
  }
};

cloneAppend();

const slideW = () => indexTrackEl.querySelector('.index-slide').offsetWidth;

const initIndexScroll = () => {
  indexTrackEl.scrollLeft = slideW() * originalCount;
};

let isJumping = false;
indexTrackEl?.addEventListener('scroll', () => {
  if (isJumping) return;

  const sw            = slideW();
  const totalOriginalW = sw * originalCount;
  const scrollL       = indexTrackEl.scrollLeft;

  if (scrollL < sw * (originalCount - 1)) {
    isJumping = true;
    indexTrackEl.scrollLeft = scrollL + totalOriginalW;
    setTimeout(() => { isJumping = false; }, 50);
  }

  if (scrollL > sw * (originalCount * 2 - 1)) {
    isJumping = true;
    indexTrackEl.scrollLeft = scrollL - totalOriginalW;
    setTimeout(() => { isJumping = false; }, 50);
  }
}, { passive: true });


// =========================
// View toggle
// =========================

toggleBtn?.addEventListener('click', () => {
  isIndex = !isIndex;

  if (isIndex) {
    layout.classList.add('is-index');
    setTimeout(() => { initIndexScroll(); }, 50);
  } else {
    layout.classList.remove('is-index');
  }
});