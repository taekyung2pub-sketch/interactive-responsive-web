import { initHeroStagger, initReveal, initCountUp, initCursor, initNav } from './utils.js';

initNav();

// 글자별 stagger
initHeroStagger('.page-hero-title');

// scroll reveal — 그룹 stagger
initReveal({
  targets:       '.strength-item, .direction-item, .career-item, .stats-item',
  groupSelector: '.strength-list, .direction-grid, .career-list, .stats-row',
});

// 카운트업
initCountUp('.stats-num');

// 커서
initCursor('a, button, .strength-item, .career-item, .direction-item');