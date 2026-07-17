(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyCreatorsReady === 'true') return;
    root.dataset.heresyCreatorsReady = 'true';
    const mediaSlides = [...root.querySelectorAll('[data-heresy-creator-media]')];
    const contentSlides = [...root.querySelectorAll('[data-heresy-creator-content]')];
    const controls = [...root.querySelectorAll('[data-heresy-creator-go]')];
    const slideCount = Math.min(mediaSlides.length, contentSlides.length, controls.length);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer = 0;
    let inView = false;

    const hydrate = (index) => {
      if (!slideCount) return;
      window.HeresyMedia?.hydrateWithin(mediaSlides[(index + slideCount) % slideCount]);
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    const start = () => {
      stop();
      if (!inView || reducedMotion || slideCount < 2) return;
      timer = window.setInterval(() => show(activeIndex + 1, false), 6000);
    };

    const show = (index, hydrateNow = true) => {
      if (!slideCount) return;
      activeIndex = (index + slideCount) % slideCount;
      if (inView || hydrateNow) {
        hydrate(activeIndex);
        hydrate(activeIndex + 1);
      }
      root.style.setProperty('--heresy-creator-index', activeIndex);
      mediaSlides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('heresy-is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        if (!active) slide.querySelector('video')?.pause();
      });
      contentSlides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('heresy-is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === activeIndex;
        control.classList.toggle('heresy-is-selected', active);
        control.setAttribute('aria-pressed', String(active));
      });
    };

    controls.forEach((control, index) => {
      control.addEventListener('click', () => show(index));
      control.addEventListener('pointerenter', () => {
        stop();
        show(index);
      });
      control.addEventListener('focus', () => show(index));
    });
    root.querySelectorAll('[data-heresy-creator-play]').forEach((button) => button.addEventListener('click', () => {
      const panel = button.closest('[data-heresy-creator-media]');
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
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) start();
    });
    show(0, false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          window.HeresyMedia?.hydrateWithin(root.querySelector('.mod_before_after_AAAprW_Navigation'));
          hydrate(activeIndex);
          hydrate(activeIndex + 1);
          start();
        } else {
          stop();
        }
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
