(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyApplicationReady === 'true') return;
    root.dataset.heresyApplicationReady = 'true';
    const triggers = [...root.querySelectorAll('[data-heresy-application-go]')];
    const content = [...root.querySelectorAll('[data-heresy-application-content]')];
    const images = [...root.querySelectorAll('[data-heresy-application-image]')];
    let active = 0;

    const show = (index) => {
      if (!triggers.length) return;
      active = (index + triggers.length) % triggers.length;
      content.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === active));
      images.forEach((slide, slideIndex) => slide.classList.toggle('heresy-is-active', slideIndex === active));
      triggers.forEach((trigger, triggerIndex) => trigger.setAttribute('aria-current', triggerIndex === active ? 'true' : 'false'));
    };

    triggers.forEach((trigger, index) => trigger.addEventListener('click', () => show(index)));
    root.querySelector('[data-heresy-application-next]')?.addEventListener('click', () => show(active + 1));
    show(0);
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-application]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
