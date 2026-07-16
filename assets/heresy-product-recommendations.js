(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyRecommendationsReady === 'true' || !root.dataset.url) return;
    root.dataset.heresyRecommendationsReady = 'true';
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
