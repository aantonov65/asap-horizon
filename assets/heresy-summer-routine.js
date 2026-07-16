(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyRoutineReady === 'true') return;
    root.dataset.heresyRoutineReady = 'true';
    const controls = [...root.querySelectorAll('[data-heresy-routine-go]')];
    const swatches = [...root.querySelectorAll('[data-heresy-routine-swatch]')];
    const models = [...root.querySelectorAll('[data-heresy-routine-model]')];
    if (!controls.length || !swatches.length || !models.length) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer;
    let hoverTimer;
    let inView = false;
    const hydrate = (index) => {
      if (!controls.length) return;
      const target = (index + controls.length) % controls.length;
      window.HeresyMedia?.hydrateWithin(swatches[target]);
      window.HeresyMedia?.hydrateWithin(models[target]);
    };
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      if (inView && !reducedMotion && controls.length > 1) timer = window.setInterval(() => show(activeIndex + 1, false), 5200);
    };
    const show = (index, restart = true) => {
      activeIndex = (index + controls.length) % controls.length;
      hydrate(activeIndex);
      hydrate(activeIndex + 1);
      root.style.setProperty('--heresy-routine-index', activeIndex);
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === activeIndex;
        control.classList.toggle('Slider-with-navigation-content-navigation-item__active', active);
        control.setAttribute('aria-pressed', String(active));
      });
      swatches.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)));
      models.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)));
      if (restart) start();
    };
    controls.forEach((control, index) => {
      control.addEventListener('click', () => show(index));
      control.addEventListener('pointerenter', () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => show(index), 180);
      });
    });
    root.addEventListener('pointerenter', stop);
    root.addEventListener('pointerleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    show(0, false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          hydrate(activeIndex);
          hydrate(activeIndex + 1);
          start();
        } else stop();
      }, { rootMargin: '20% 0px', threshold: 0.12 });
      observer.observe(root);
    } else {
      inView = true;
      start();
    }
  };
  const initAll = (scope = document) => scope.querySelectorAll('.heresy-summer-routine[data-heresy-routine]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
