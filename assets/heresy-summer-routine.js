(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyRoutineReady === 'true') return;
    root.dataset.heresyRoutineReady = 'true';
    const controls = [...root.querySelectorAll('[data-heresy-routine-go]')];
    const swatches = [...root.querySelectorAll('[data-heresy-routine-swatch]')];
    const models = [...root.querySelectorAll('[data-heresy-routine-model]')];
    const show = (index) => {
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle('Slider-with-navigation-content-navigation-item__active', active);
        control.setAttribute('aria-pressed', String(active));
      });
      swatches.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === index));
      models.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === index));
    };
    controls.forEach((control, index) => control.addEventListener('click', () => show(index)));
    show(0);
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-routine]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
