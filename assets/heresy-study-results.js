(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyResultsReady === 'true') return;
    root.dataset.heresyResultsReady = 'true';
    let group = 'immediate';
    let type = 'consumer';
    const groupButtons = [...root.querySelectorAll('[data-heresy-results-group]')];
    const typeButtons = [...root.querySelectorAll('[data-heresy-results-type]')];
    const panels = [...root.querySelectorAll('[data-heresy-results-panel]')];

    const render = () => {
      groupButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.heresyResultsGroup === group)));
      typeButtons.forEach((button) => {
        const active = button.dataset.heresyResultsType === type;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('Tabbed-content-multi-toggle__active', active);
      });
      panels.forEach((panel) => panel.classList.toggle('heresy-is-active', panel.dataset.heresyResultsPanel === `${group}-${type}`));
    };

    groupButtons.forEach((button) => button.addEventListener('click', () => { group = button.dataset.heresyResultsGroup; render(); }));
    typeButtons.forEach((button) => button.addEventListener('click', () => { type = button.dataset.heresyResultsType; render(); }));
    render();
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-results]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
