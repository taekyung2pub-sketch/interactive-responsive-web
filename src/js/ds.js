import { initNav } from './utils.js';

initNav();

// design-system 페이지 전용
// 공통 utils 와 별개로 이 페이지 고유 동작만 담당합니다.

// =========================
// Scroll reveal (inline style 방식 — ds 페이지 전용)
// =========================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.spec-card, .component-item, .typo-item, .swatch-item, .spacing-item, .size-item, .radius-item'
).forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(16px)';
  el.style.transition = `opacity 0.5s ease ${i % 8 * 60}ms, transform 0.5s ease ${i % 8 * 60}ms`;
  observer.observe(el);
});

// revealed 시 리셋
const style = document.createElement('style');
style.textContent = `.is-revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);


// =========================
// Swatch — scale hover
// =========================

document.querySelectorAll('.swatch-block').forEach(el => {
  el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.12)'; });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});