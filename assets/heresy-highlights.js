(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyHighlightsReady === 'true') return;
    root.dataset.heresyHighlightsReady = 'true';

    const toggles = [...root.querySelectorAll('[data-heresy-highlight-toggle]')];
    const panels = [...root.querySelectorAll('[data-heresy-highlight-panel]')];
    const drawer = root.querySelector('[data-heresy-ingredients-drawer]');

    const activate = (index) => {
      toggles.forEach((toggle, toggleIndex) => {
        const active = toggleIndex === index;
        toggle.classList.toggle('Highlights-toggle__active', active);
        toggle.setAttribute('aria-pressed', String(active));
      });
      panels.forEach((panel, panelIndex) => panel.classList.toggle('Highlights-image-dot__active', panelIndex === index));
    };

    toggles.forEach((toggle, index) => {
      toggle.addEventListener('click', () => activate(index));
      toggle.addEventListener('pointerenter', () => activate(index));
      toggle.addEventListener('focus', () => activate(index));
    });
    root.querySelector('[data-heresy-ingredients-open]')?.addEventListener('click', () => {
      drawer?.classList.add('Highlights-ingredients-wrapper__active');
      drawer?.focus();
    });
    root.querySelector('[data-heresy-ingredients-close]')?.addEventListener('click', () => {
      drawer?.classList.remove('Highlights-ingredients-wrapper__active');
    });
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-highlights]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
