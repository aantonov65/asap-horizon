(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyCreatorsReady === 'true') return;
    root.dataset.heresyCreatorsReady = 'true';
    const panels = [...root.querySelectorAll('[data-heresy-creator-panel]')];
    const controls = [...root.querySelectorAll('[data-heresy-creator-go]')];
    let activeIndex = 0;
    let inView = false;

    const hydrate = (index) => {
      if (!panels.length) return;
      window.HeresyMedia?.hydrateWithin(panels[(index + panels.length) % panels.length]);
    };

    const show = (index, hydrateNow = true) => {
      activeIndex = (index + panels.length) % panels.length;
      if (inView || hydrateNow) {
        hydrate(activeIndex);
        hydrate(activeIndex + 1);
      }
      root.style.setProperty('--heresy-creator-index', activeIndex);
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeIndex;
        panel.classList.toggle('heresy-is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
        if (!active) panel.querySelector('video')?.pause();
      });
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === activeIndex;
        control.classList.toggle('heresy-is-selected', active);
        control.setAttribute('aria-pressed', String(active));
      });
    };

    controls.forEach((control, index) => {
      control.addEventListener('click', () => show(index));
      control.addEventListener('pointerenter', () => show(index));
      control.addEventListener('focus', () => show(index));
    });
    root.querySelectorAll('[data-heresy-creator-play]').forEach((button) => button.addEventListener('click', () => {
      const panel = button.closest('[data-heresy-creator-panel]');
      const video = panel?.querySelector('video');
      if (!video) return;
      button.closest('[data-heresy-creator-poster]')?.classList.add('heresy-is-hidden');
      video.preload = 'auto';
      video.play().catch(() => {});
    }));
    show(0, false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          window.HeresyMedia?.hydrateWithin(root.querySelector('.mod_before_after_AAAprW_Navigation'));
          hydrate(activeIndex);
          hydrate(activeIndex + 1);
        }
      }, { rootMargin: '20% 0px', threshold: 0.12 });
      observer.observe(root);
    } else {
      inView = true;
    }
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-creators]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
