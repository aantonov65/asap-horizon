(() => {
  const init = (root) => {
    if (!root || root.dataset.heresyUgcReady === 'true') return;
    root.dataset.heresyUgcReady = 'true';
    root.querySelectorAll('[data-heresy-ugc-play]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.heresy-ugc-video__card');
        const video = card?.querySelector('video');
        if (!video) return;
        card.querySelector('[data-heresy-ugc-poster]')?.classList.add('heresy-is-hidden');
        video.play().catch(() => {});
      });
    });
  };
  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-ugc]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
