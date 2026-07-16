(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyLayerReady === 'true') return;
    root.dataset.heresyLayerReady = 'true';
    const toggles = [...root.querySelectorAll('[data-heresy-layer-toggle]')];
    const slides = [...root.querySelectorAll('[data-heresy-layer-slide]')];
    const show = (index) => {
      toggles.forEach((toggle, toggleIndex) => {
        const active = toggleIndex === index;
        toggle.classList.toggle('Highlights-toggle__active', active);
        toggle.setAttribute('aria-pressed', String(active));
      });
      slides.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === index));
    };
    toggles.forEach((toggle, index) => toggle.addEventListener('click', () => show(index)));
    show(0);
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-layer-lips]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
