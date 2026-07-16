(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyShadesReady === 'true') return;
    root.dataset.heresyShadesReady = 'true';
    const track = root.querySelector('[data-heresy-shade-track]');
    const cards = [...root.querySelectorAll('[data-heresy-shade-card]')];
    const swatches = [...root.querySelectorAll('[data-heresy-shade-go]')];
    const progress = root.querySelector('[data-heresy-shades-progress]');
    const previousButtons = [...root.querySelectorAll('[data-heresy-shades-prev]')];
    const nextButtons = [...root.querySelectorAll('[data-heresy-shades-next]')];
    let active = Math.max(0, swatches.findIndex((swatch) => swatch.getAttribute('aria-pressed') === 'true'));
    let inView = false;

    const contentOffset = () => window.innerWidth >= 861 ? 175 : 92;

    const setActive = (index, scroll = true) => {
      if (!cards.length) return;
      active = Math.max(0, Math.min(index, cards.length - 1));
      if (inView || scroll === 'smooth') for (let offset = 0; offset < 3; offset += 1) {
        window.HeresyMedia?.hydrateWithin(cards[Math.min(active + offset, cards.length - 1)]);
      }
      swatches.forEach((swatch, swatchIndex) => {
        const selected = swatchIndex === active;
        swatch.classList.toggle('heresy-is-selected', selected);
        swatch.setAttribute('aria-pressed', String(selected));
      });
      if (scroll && track) {
        const left = Math.max(0, cards[active].offsetLeft - contentOffset());
        if (scroll === 'instant' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) track.scrollLeft = left;
        else track.scrollTo({ left, behavior: 'smooth' });
      }
      if (progress) progress.style.maxWidth = `${cards.length > 1 ? (active / (cards.length - 1)) * 100 : 100}%`;
      previousButtons.forEach((button) => { button.disabled = active === 0; });
      nextButtons.forEach((button) => { button.disabled = active === cards.length - 1; });
    };

    swatches.forEach((swatch, index) => swatch.addEventListener('click', () => setActive(index)));
    previousButtons.forEach((button) => button.addEventListener('click', () => setActive(active - 1)));
    nextButtons.forEach((button) => button.addEventListener('click', () => setActive(active + 1)));
    track?.addEventListener('scroll', () => {
      const target = track.scrollLeft + contentOffset();
      const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - target) < Math.abs(cards[best].offsetLeft - target) ? index : best, 0);
      if (nearest !== active) setActive(nearest, false);
    }, { passive: true });
    requestAnimationFrame(() => setActive(active, 'instant'));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) return;
        for (let offset = 0; offset < 3; offset += 1) {
          window.HeresyMedia?.hydrateWithin(cards[Math.min(active + offset, cards.length - 1)]);
        }
      }, { rootMargin: '700px 0px' });
      observer.observe(root);
    } else {
      inView = true;
      setActive(active, false);
    }
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-shades]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
