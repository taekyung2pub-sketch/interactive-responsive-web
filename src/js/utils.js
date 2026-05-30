// =========================
// Scroll reveal
// =========================
// 사용법: initReveal('.strength-item, .career-item')
// 또는:   initReveal({ targets: '...', groupSelector: '.strength-list' })

export const initReveal = (options) => {
  const isString = typeof options === 'string';
  const targets       = isString ? options : options.targets;
  const groupSelector = isString ? null    : options.groupSelector;
  const delay         = isString ? 80      : (options.delay ?? 80);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (groupSelector) {
        // 그룹 컨테이너 관찰 → 내부 아이템 stagger
        const items = entry.target.querySelectorAll(targets);
        items.forEach((el, i) => {
          setTimeout(() => el.classList.add('is-revealed'), i * delay);
        });
      } else {
        entry.target.classList.add('is-revealed');
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  const roots = groupSelector
      ? document.querySelectorAll(groupSelector)
      : document.querySelectorAll(targets);

  roots.forEach(el => observer.observe(el));
};


// =========================
// Count up
// =========================
// 사용법: initCountUp('.stats-num')

export const initCountUp = (selector, duration = 1200) => {
  const countUp = (el, target, suffix) => {
    const isDecimal = target % 1 !== 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = isDecimal
          ? (target * ease).toFixed(1)
          : Math.floor(target * ease);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const nums = entry.target.querySelectorAll(selector);
      nums.forEach(el => {
        const raw    = el.textContent.trim();
        const num    = parseFloat(raw);
        const suffix = raw.replace(/[\d.]/g, '');
        countUp(el, num, suffix);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  // stats-num 의 부모 컨테이너를 관찰
  document.querySelectorAll(selector).forEach(el => {
    const parent = el.closest('.stats-row') || el.parentElement;
    observer.observe(parent);
  });
};


// =========================
// Hero title — 글자별 stagger
// =========================
// 사용법: initHeroStagger('.page-hero-title')

export const initHeroStagger = (selector, charDelay = 40, startDelay = 200) => {
  const el = document.querySelector(selector);
  if (!el) return;

  const text = el.textContent;
  el.innerHTML = text.split('').map((char, i) => {
    if (char === '\n') return '<br>';
    return `<span class="char" style="transition-delay:${i * charDelay}ms">${char === ' ' ? '&nbsp;' : char}</span>`;
  }).join('');

  setTimeout(() => {
    el.querySelectorAll('.char').forEach(c => c.classList.add('is-in'));
  }, startDelay);
};


// =========================
// Cursor dot
// =========================
// 사용법: initCursor('a, button, .strength-item')

export const initCursor = (hoverTargets = 'a, button') => {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  document.body.appendChild(cursor);

  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  const move = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(move);
  };
  move();

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-expand'));
  });
};


// =========================
// Nav LNB (모바일 햄버거 메뉴)
// =========================
// 사용법: initNav()
// 모든 페이지 공통 — body에 script type="module" 로 import 후 호출

export const initNav = () => {
  const nav      = document.querySelector('.nav');
  const btn      = document.getElementById('navMenuBtn');
  const closeBtn = document.getElementById('navLnbClose');
  const lnb      = document.getElementById('navLnb');
  const overlay  = document.getElementById('navOverlay');
  if (!btn || !lnb || !overlay) return;

  // 스크롤 배경
  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const isMobile = () => window.innerWidth <= 768;

  const open = () => {
    if (!isMobile()) return;
    lnb.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lnb.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) close();
  });
};