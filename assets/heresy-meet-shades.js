(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyShadesReady === 'true') return;
    root.dataset.heresyShadesReady = 'true';
    const track = root.querySelector('[data-heresy-shade-track]');
    const cards = [...root.querySelectorAll('[data-heresy-shade-card]')];
    const swatches = [...root.querySelectorAll('[data-heresy-shade-go]')];
    const progress = root.querySelector('[data-heresy-shades-progress]');
    let active = 0;

    const setActive = (index, scroll = true) => {
      if (!cards.length) return;
      active = Math.max(0, Math.min(index, cards.length - 1));
      swatches.forEach((swatch, swatchIndex) => {
        const selected = swatchIndex === active;
        swatch.classList.toggle('heresy-is-selected', selected);
        swatch.setAttribute('aria-pressed', String(selected));
      });
      if (scroll) cards[active].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      if (progress) progress.style.width = `${((active + 1) / cards.length) * 100}%`;
    };

    swatches.forEach((swatch, index) => swatch.addEventListener('click', () => setActive(index)));
    root.querySelectorAll('[data-heresy-shades-prev]').forEach((button) => button.addEventListener('click', () => setActive(active - 1)));
    root.querySelectorAll('[data-heresy-shades-next]').forEach((button) => button.addEventListener('click', () => setActive(active + 1)));
    track?.addEventListener('scroll', () => {
      const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[best].offsetLeft - track.scrollLeft) ? index : best, 0);
      if (nearest !== active) setActive(nearest, false);
    }, { passive: true });
    setActive(0, false);
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-shades]').forEach(init);
  document.addEventListener('DOMContentLoaded', () => initAll());
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
