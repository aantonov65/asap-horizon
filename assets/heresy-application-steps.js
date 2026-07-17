(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyApplicationReady === 'true') return;
    root.dataset.heresyApplicationReady = 'true';
    const triggers = [...root.querySelectorAll('[data-heresy-application-go]')];
    const content = [...root.querySelectorAll('[data-heresy-application-content]')];
    const images = [...root.querySelectorAll('[data-heresy-application-image]')];
    const thumbnails = root.querySelector('.mod_slider_content_ZWt2zW_Content-slider-thumbnails');
    let active = 0;
    let inView = false;

    const show = (index, hydrate = false) => {
      if (!triggers.length) return;
      active = (index + triggers.length) % triggers.length;
      if (inView || hydrate) window.HeresyMedia?.hydrateWithin(images[active]);
      root.style.setProperty('--heresy-application-index', active);
      content.forEach((slide, slideIndex) => {
        slide.classList.toggle('heresy-is-active', slideIndex === active);
        slide.setAttribute('aria-hidden', String(slideIndex !== active));
      });
      images.forEach((slide, slideIndex) => {
        slide.classList.toggle('heresy-is-active', slideIndex === active);
        slide.setAttribute('aria-hidden', String(slideIndex !== active));
      });
      triggers.forEach((trigger, triggerIndex) => trigger.setAttribute('aria-current', triggerIndex === active ? 'true' : 'false'));
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => show(index, true));
      trigger.addEventListener('pointerenter', () => show(index, true));
      trigger.addEventListener('focus', () => show(index, true));
    });
    root.querySelector('[data-heresy-application-next]')?.addEventListener('click', () => show(active + 1, true));
    show(0);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) return;
        window.HeresyMedia?.hydrateWithin(thumbnails);
        window.HeresyMedia?.hydrateWithin(images[active]);
      }, { rootMargin: '700px 0px' });
      observer.observe(root);
    } else {
      inView = true;
      window.HeresyMedia?.hydrateWithin(thumbnails);
      window.HeresyMedia?.hydrateWithin(images[active]);
    }
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-application]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
