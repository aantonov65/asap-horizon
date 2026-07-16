(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyRecyclingReady === 'true') return;
    root.dataset.heresyRecyclingReady = 'true';
    const slides = [...root.querySelectorAll('[data-heresy-recycling-slide]')];
    const controls = [...root.querySelectorAll('[data-heresy-recycling-go]')];
    const show = (index) => {
      slides.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === index));
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle('heresy-is-selected', active);
        control.setAttribute('aria-pressed', String(active));
      });
    };
    controls.forEach((control, index) => control.addEventListener('click', () => show(index)));
    show(0);
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-recycling]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
