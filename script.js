/* ===========================================================
   0. REDUCED MOTION GATE
   =========================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===========================================================
   1. HERO CHARACTER TYPING GRAPHICS ENGINE
   =========================================================== */
const nameString = "Aniruththen";
const nameWrap = document.getElementById('nameWrap');

if (nameWrap) {
  [...nameString].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'letter';
    s.textContent = ch;
    s.style.display = 'inline-block';
    s.style.transition = `transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.03}s`;
    nameWrap.appendChild(s);
  });
  nameWrap.addEventListener('mouseenter', () => {
    [...nameWrap.children].forEach((el) => { el.style.transform = 'translate3d(0, -4px, 0) scale(1.05)'; });
  });
  nameWrap.addEventListener('mouseleave', () => {
    [...nameWrap.children].forEach((el) => { el.style.transform = 'translate3d(0,0,0) scale(1)'; });
  });
}

/* ===========================================================
   2. SMOOTH CURSOR TRACKER
   =========================================================== */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
let isMoving = false;

if (!prefersReducedMotion) {
  window.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(() => {
        if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate3d(-50%, -50%, 0)`;
        isMoving = false;
      });
    }
  }, { passive: true });

  (function cursorLoop() {
    rx += (mx - rx) * 0.12; 
    ry += (my - ry) * 0.12;
    if (ring && !ring.classList.contains('cursor-invert-active')) {
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate3d(-50%, -50%, 0)`;
    } else if (ring) {
      ring.style.transform = `translate3d(${mx}px, ${my}px, 0) translate3d(-50%, -50%, 0)`;
    }
    requestAnimationFrame(cursorLoop);
  })();
}

function refreshCursorTriggers() {
  const invertTargets = document.querySelectorAll('a, button, input[type="submit"], .theme-toggle-node');
  const normalInputs = document.querySelectorAll('input:not([type="submit"]), textarea');

  invertTargets.forEach(el => {
    el.addEventListener('mouseenter', () => { if(ring) ring.classList.add('cursor-invert-active'); });
    el.addEventListener('mouseleave', () => { if(ring) ring.classList.remove('cursor-invert-active'); });
  });

  normalInputs.forEach(el => {
    el.addEventListener('mouseenter', () => { if(ring) ring.style.opacity = '0'; });
    el.addEventListener('mouseleave', () => { if(ring) ring.style.opacity = '1'; });
  });
}
window.addEventListener('DOMContentLoaded', refreshCursorTriggers);

/* ===========================================================
   3. ACCELERATED MAGNETIC SCRIPT
   =========================================================== */
function magnetize(el, strength) {
  let bx = 0, by = 0, tx = 0, ty = 0;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    tx = (e.clientX - cx) * strength;
    ty = (e.clientY - cy) * strength;
  }, { passive: true });
  el.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  (function magnetLoop() {
    bx += (tx - bx) * 0.1; by += (ty - by) * 0.1;
    el.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
    requestAnimationFrame(magnetLoop);
  })();
}
if (!prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(el => magnetize(el, 0.18));
}

/* ===========================================================
   4. ADVANCED 3D INTERACTIVE HERO TILT SCRIPT
   =========================================================== */
(() => {
  const container = document.querySelector('.hero-png-container');
  const wrapper = document.querySelector('.image-float-wrapper');
  
  if (!container || !wrapper || prefersReducedMotion) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    
    const xRotation = -12 * ((y - rect.height / 2) / (rect.height / 2));
    const yRotation = 12 * ((x - rect.width / 2) / (rect.width / 2));
    
    wrapper.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.04, 1.04, 1.04)`;
  });

  container.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
})();

/* ===========================================================
   5. ACTIVE NAV SCROLLSPY
   =========================================================== */
const navLinks = [...document.querySelectorAll('nav a')];
const pill = document.getElementById('navPill');
const themeToggleBtn = document.getElementById('themeToggleBtn');
let isScrollingManual = false;

function movePill(el) {
  if (!pill || !el) return;
  pill.style.width = el.offsetWidth + 'px';
  pill.style.transform = `translate3d(${el.offsetLeft}px, 0, 0)`;
  navLinks.forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function initScrollspy() {
  const sections = document.querySelectorAll('section, .scd-stick, footer');
  window.addEventListener('scroll', () => {
    if (isScrollingManual) return;
    let currentId = "";
    const scrollPos = window.scrollY + window.innerHeight * 0.4; 
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) { currentId = sec.getAttribute('id'); }
    });
    if (currentId) {
      const activeTarget = document.querySelector(`nav a[href="#${currentId}"]`);
      if (activeTarget && !activeTarget.classList.contains('active')) { movePill(activeTarget); }
    }
  }, { passive: true });
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('portfolio-theme', targetTheme);
    setTimeout(() => {
      const currentActive = document.querySelector('nav a.active') || navLinks[0];
      movePill(currentActive);
    }, 60);
  });
}

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) { document.documentElement.setAttribute('data-theme', savedTheme); }
  setTimeout(() => { movePill(document.querySelector('nav a.active') || navLinks[0]); }, 100);
  initScrollspy();
});

if (navLinks.length > 0) {
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      isScrollingManual = true; movePill(a);
      setTimeout(() => { isScrollingManual = false; }, 1000);
    });
  });
}

/* ===========================================================
   6. PARALLAX DESKTOP CONTROLLER
   =========================================================== */
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    if (window.innerWidth < 900) return;
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  }, { passive: true });
}

/* ===========================================================
   7. SCROLL DRIVEN TEXT REVEAL FILL
   =========================================================== */
const fillEl = document.querySelector('.fill-word');

function updateFill() {
  if (!fillEl || prefersReducedMotion) return;

  const rect = fillEl.getBoundingClientRect();
  const vh = window.innerHeight;

  // Visual Bounds: Begin execution at 85% depth viewport frame, conclude when base approaches top 20%
  const triggerStart = vh * 0.85;
  const triggerEnd = vh * 0.20;

  const totalRange = triggerStart - triggerEnd;
  const currentScrollPosition = triggerStart - rect.top;

  // Process mapping over height coordinates to yield an elegantly weighted reveal cadence
  let progress = currentScrollPosition / (totalRange + rect.height * 0.5);
  progress = Math.min(Math.max(progress, 0), 1);

  // Directly adjust our CSS variable matrix logic 
  fillEl.style.setProperty('--progress', `${progress * 100}%`);
}

window.addEventListener('scroll', updateFill, { passive: true });
window.addEventListener('resize', updateFill, { passive: true });
updateFill();

/* ===========================================================
   8. REVIEWS SLIDER CAROUSEL ENGINE
   =========================================================== */
(() => {
  const stage = document.querySelector('.tm-carousel__stage');
  const track = document.querySelector('.tm-carousel__track');
  const cards = [...document.querySelectorAll('.tm-carousel__card')];
  const dotsContainer = document.querySelector('.tm-carousel__dots');
  
  if (!stage || !track || !cards.length) return;
  let currentIndex = 0;
  let loopTimer = null;
  const loopIntervalDuration = 5000;

  function createNavigationDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `tm-carousel__dot ${index === 0 ? 'tm-carousel__dot--active' : ''}`;
      dot.addEventListener('click', () => { currentIndex = index; updateCarouselLayout(); });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarouselLayout() {
    const stageWidth = stage.offsetWidth;
    const currentCard = cards[currentIndex];
    const cardWidth = currentCard.offsetWidth;
    const gapWidth = 32;

    let accumulatedOffset = 0;
    for (let i = 0; i < currentIndex; i++) { accumulatedOffset += cards[i].offsetWidth + gapWidth; }

    const calculatedTranslation = (stageWidth / 2) - (cardWidth / 2) - accumulatedOffset;
    track.style.transform = `translate3d(${calculatedTranslation}px, 0, 0)`;

    cards.forEach((card, idx) => { card.classList.toggle('tm-active', idx === currentIndex); });
    const dots = [...dotsContainer.children];
    if (dots.length) {
      dots.forEach((dot, idx) => { dot.classList.toggle('tm-carousel__dot--active', idx === currentIndex); });
    }
  }

  function advanceCarousel() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarouselLayout();
  }

  function startAutoLoop() {
    if (prefersReducedMotion) return;
    if (!loopTimer) {
      loopTimer = setInterval(advanceCarousel, loopIntervalDuration);
    }
  }

  function stopAutoLoop() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  window.addEventListener('resize', updateCarouselLayout);
  stage.addEventListener('mouseenter', stopAutoLoop);
  stage.addEventListener('mouseleave', startAutoLoop);

  createNavigationDots();
  updateCarouselLayout();
  startAutoLoop();
})();

/* ===========================================================
   9. PERFORMANCE-TUNED STACKING DECK ENGINE
   =========================================================== */
(() => {
  const root = document.querySelector('.scd-stick');
  if (!root) return;
  const steps = [...root.querySelectorAll('.scd-stick__step')];
  const pips = [...root.querySelectorAll('.scd-stick__pip')];
  const rail = root.querySelector('.scd-stick__rail');
  if (!steps.length) return;

  function updateCardStack() {
    let activeIndex = 0;
    const vh = window.innerHeight;
    const rootRect = root.getBoundingClientRect();

    if (rail) {
      if (rootRect.top <= 0 && rootRect.bottom >= vh) {
        rail.style.position = 'fixed';
        rail.style.top = '50%';
        rail.style.opacity = '1';
      } else if (rootRect.bottom < vh) {
        rail.style.position = 'absolute';
        rail.style.top = 'auto';
        rail.style.bottom = '40px';
        rail.style.opacity = '0';
      } else {
        rail.style.position = 'absolute';
        rail.style.top = '40px';
        rail.style.bottom = 'auto';
        rail.style.opacity = '0';
      }
    }

    steps.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const targetStickyLine = vh * (0.12 + i * 0.02);
      const nextCard = steps[i + 1];

      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const cardRealHeight = card.offsetHeight; 
        const progress = Math.min(Math.max((targetStickyLine + cardRealHeight - nextRect.top) / cardRealHeight, 0), 1);
        card.style.transform = `translate3d(0, ${progress * -8}px, 0) scale(${1 - progress * 0.03})`;
        card.style.filter = `brightness(${1 - progress * 0.08})`;
        const progressFill = card.querySelector('.scd-stick__bar i');
        if (progressFill) progressFill.style.width = (progress * 100) + '%';
      } else {
        const progressFill = card.querySelector('.scd-stick__bar i');
        if (progressFill) progressFill.style.width = '100%';
      }
      if (rect.top <= targetStickyLine + 30) { activeIndex = i; }
    });

    if (pips.length) { pips.forEach((pip, i) => { pip.classList.toggle('scd-stick__pip--on', i === activeIndex); }); }
  }
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', updateCardStack, { passive: true });
    window.addEventListener('resize', updateCardStack);
    updateCardStack();
  } else {
    const progressFills = root.querySelectorAll('.scd-stick__bar i');
    progressFills.forEach(fill => { fill.style.width = '100%'; });
    if (pips.length) pips[0].classList.add('scd-stick__pip--on');
  }
})();

/* ===========================================================
   10. INTERSECTION OBSERVER BATCH REVEALS
   =========================================================== */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}