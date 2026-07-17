(() => {
  const bindControls = (root) => {
    if (root.dataset.heresyRecommendationsControlsReady === 'true') return;
    root.dataset.heresyRecommendationsControlsReady = 'true';
    const track = root.querySelector('[data-heresy-recommendations-track]');
    if (!track) return;
    const move = (direction) => {
      const card = track.querySelector('.heresy-product-recommendations__card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };
    root.querySelector('[data-heresy-recommendations-previous]')?.addEventListener('click', () => move(-1));
    root.querySelector('[data-heresy-recommendations-next]')?.addEventListener('click', () => move(1));
  };

  const init = (root) => {
    if (!root || root.dataset.heresyRecommendationsReady === 'true') return;
    root.dataset.heresyRecommendationsReady = 'true';
    bindControls(root);
    if (!root.dataset.url) return;
    fetch(root.dataset.url)
      .then((response) => {
        if (!response.ok) throw new Error(`Recommendations request failed: ${response.status}`);
        return response.text();
      })
      .then((html) => {
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const loaded = parsed.querySelector('[data-heresy-recommendations]');
        if (!loaded) return;
        root.innerHTML = loaded.innerHTML;
        root.removeAttribute('data-url');
        root.removeAttribute('data-heresy-recommendations-controls-ready');
        bindControls(root);
      })
      .catch(() => {
        root.hidden = true;
      });
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-recommendations]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
