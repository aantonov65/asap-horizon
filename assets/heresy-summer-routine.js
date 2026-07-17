(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyRoutineReady === 'true') return;
    root.dataset.heresyRoutineReady = 'true';
    const controls = [...root.querySelectorAll('[data-heresy-routine-go]')];
    const swatches = [...root.querySelectorAll('[data-heresy-routine-swatch]')];
    const models = [...root.querySelectorAll('[data-heresy-routine-model]')];
    if (!controls.length || !swatches.length || !models.length) return;
    let activeIndex = 0;
    let inView = false;
    const hydrate = (index) => {
      if (!controls.length) return;
      const target = (index + controls.length) % controls.length;
      window.HeresyMedia?.hydrateWithin(swatches[target]);
      window.HeresyMedia?.hydrateWithin(models[target]);
    };
    const show = (index, hydrateNow = true) => {
      activeIndex = (index + controls.length) % controls.length;
      if (inView || hydrateNow) {
        hydrate(activeIndex);
        hydrate(activeIndex + 1);
      }
      root.style.setProperty('--heresy-routine-index', activeIndex);
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === activeIndex;
        control.classList.toggle('Slider-with-navigation-content-navigation-item__active', active);
        control.setAttribute('aria-pressed', String(active));
      });
      swatches.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)));
      models.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)));
    };
    controls.forEach((control, index) => {
      control.addEventListener('click', () => show(index));
      control.addEventListener('pointerenter', () => show(index));
      control.addEventListener('focus', () => show(index));
    });
    show(0, false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          hydrate(activeIndex);
          hydrate(activeIndex + 1);
        }
      }, { rootMargin: '20% 0px', threshold: 0.12 });
      observer.observe(root);
    } else {
      inView = true;
    }
  };
  const initAll = (scope = document) => scope.querySelectorAll('.heresy-summer-routine[data-heresy-routine]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
