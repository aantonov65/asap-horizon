(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyCreatorsReady === 'true') return;
    root.dataset.heresyCreatorsReady = 'true';
    const panels = [...root.querySelectorAll('[data-heresy-creator-panel]')];
    const controls = [...root.querySelectorAll('[data-heresy-creator-go]')];
    const show = (index) => {
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === index;
        panel.classList.toggle('heresy-is-active', active);
        if (!active) panel.querySelector('video')?.pause();
      });
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle('heresy-is-selected', active);
        control.setAttribute('aria-pressed', String(active));
      });
    };
    controls.forEach((control, index) => control.addEventListener('click', () => show(index)));
    root.querySelectorAll('[data-heresy-creator-play]').forEach((button) => button.addEventListener('click', () => {
      const panel = button.closest('[data-heresy-creator-panel]');
      const video = panel?.querySelector('video');
      if (!video) return;
      button.closest('[data-heresy-creator-poster]')?.classList.add('heresy-is-hidden');
      video.play();
    }));
    show(0);
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-creators]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
