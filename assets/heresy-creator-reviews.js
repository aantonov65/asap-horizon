(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyCreatorsReady === 'true') return;
    root.dataset.heresyCreatorsReady = 'true';
    const panels = [...root.querySelectorAll('[data-heresy-creator-panel]')];
    const controls = [...root.querySelectorAll('[data-heresy-creator-go]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer;
    let hoverTimer;
    let inView = false;

    const hydrate = (index) => {
      if (!panels.length) return;
      window.HeresyMedia?.hydrateWithin(panels[(index + panels.length) % panels.length]);
    };

    const show = (index, restart = true) => {
      activeIndex = (index + panels.length) % panels.length;
      hydrate(activeIndex);
      hydrate(activeIndex + 1);
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
      if (restart) start();
    };
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      if (inView && !reducedMotion && panels.length > 1) timer = window.setInterval(() => show(activeIndex + 1, false), 5800);
    };

    controls.forEach((control, index) => {
      control.addEventListener('click', () => show(index));
      control.addEventListener('pointerenter', () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => show(index), 180);
      });
    });
    root.querySelectorAll('.mod_before_after_AAAprW_Video').forEach((media) => media.addEventListener('click', (event) => {
      if (event.target.closest('[data-heresy-creator-play]')) return;
      const bounds = media.getBoundingClientRect();
      show(event.clientX < bounds.left + bounds.width / 2 ? activeIndex - 1 : activeIndex + 1);
    }));
    root.querySelectorAll('[data-heresy-creator-play]').forEach((button) => button.addEventListener('click', () => {
      const panel = button.closest('[data-heresy-creator-panel]');
      const video = panel?.querySelector('video');
      if (!video) return;
      stop();
      button.closest('[data-heresy-creator-poster]')?.classList.add('heresy-is-hidden');
      video.preload = 'auto';
      video.play().catch(() => {});
    }));
    root.addEventListener('pointerenter', stop);
    root.addEventListener('pointerleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    show(0, false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          hydrate(activeIndex);
          hydrate(activeIndex + 1);
          start();
        } else stop();
      }, { rootMargin: '20% 0px', threshold: 0.12 });
      observer.observe(root);
    } else {
      inView = true;
      start();
    }
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-creators]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
