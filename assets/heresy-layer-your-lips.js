(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyLayerReady === 'true') return;
    root.dataset.heresyLayerReady = 'true';
    const toggles = [...root.querySelectorAll('[data-heresy-layer-toggle]')];
    const slides = [...root.querySelectorAll('[data-heresy-layer-slide]')];
    let inView = false;
    const show = (index, hydrate = false) => {
      if (inView || hydrate) window.HeresyMedia?.hydrateWithin(slides[index]);
      root.style.setProperty('--heresy-layer-index', index);
      toggles.forEach((toggle, toggleIndex) => {
        const active = toggleIndex === index;
        toggle.classList.toggle('Highlights-toggle__active', active);
        toggle.setAttribute('aria-pressed', String(active));
      });
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle('heresy-is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
    };
    toggles.forEach((toggle, index) => {
      toggle.addEventListener('click', () => show(index, true));
      toggle.addEventListener('pointerenter', () => show(index, true));
      toggle.addEventListener('focus', () => show(index, true));
    });
    show(0);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) window.HeresyMedia?.hydrateWithin(slides[0]);
      }, { rootMargin: '700px 0px' });
      observer.observe(root);
    } else {
      inView = true;
      window.HeresyMedia?.hydrateWithin(slides[0]);
    }
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-layer-lips]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
