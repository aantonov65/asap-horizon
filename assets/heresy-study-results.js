(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyResultsReady === 'true') return;
    root.dataset.heresyResultsReady = 'true';
    let group = 'immediate';
    let type = 'consumer';
    const groupButtons = [...root.querySelectorAll('[data-heresy-results-group]')];
    const typeButtons = [...root.querySelectorAll('[data-heresy-results-type]')];
    const panels = [...root.querySelectorAll('[data-heresy-results-panel]')];
    const indicator = root.querySelector('.Tabbed-content-multi-group__toggles__indicator');

    const render = () => {
      const activeKey = `${group}-${type}`;
      root.style.setProperty('--heresy-results-group-index', group === 'four_week' ? 1 : 0);
      groupButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.heresyResultsGroup === group)));
      const activeGroupButton = groupButtons.find((button) => button.dataset.heresyResultsGroup === group);
      if (indicator && activeGroupButton) {
        indicator.style.left = `${activeGroupButton.offsetLeft}px`;
        indicator.style.maxWidth = `${activeGroupButton.offsetWidth}px`;
        indicator.dataset.active = 'true';
      }
      typeButtons.forEach((button) => {
        const active = button.dataset.heresyResultsType === type;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('Tabbed-content-multi-toggle__active', active);
      });
      panels.forEach((panel) => {
        const active = panel.dataset.heresyResultsPanel === activeKey;
        panel.classList.toggle('heresy-is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
    };

    groupButtons.forEach((button) => {
      const activate = () => { group = button.dataset.heresyResultsGroup; render(); };
      button.addEventListener('click', activate);
      button.addEventListener('pointerenter', activate);
      button.addEventListener('focus', activate);
    });
    typeButtons.forEach((button) => {
      const activate = () => { type = button.dataset.heresyResultsType; render(); };
      button.addEventListener('click', activate);
      button.addEventListener('keyup', (event) => { if (event.key === 'Enter') activate(); });
    });
    render();
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-results]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
