(() => {
  function init(root) {
    if (!root || root.dataset.lzyInit === 'true') return;
    root.dataset.lzyInit = 'true';
    const image = root.querySelector('.lzy-goli-bundle__preview');
    const sub = root.querySelector('[data-lzy-subscribe-price]');
    const one = root.querySelector('[data-lzy-onetime-price]');
    root.querySelectorAll('[data-lzy-pack]').forEach((button) => {
      button.addEventListener('click', () => {
        root.querySelectorAll('[data-lzy-pack]').forEach((item) => item.classList.remove('lzy-is-active'));
        button.classList.add('lzy-is-active');
        if (image && button.dataset.image) {
          image.src = button.dataset.image;
          image.alt = button.dataset.title || image.alt;
        }
        if (sub) sub.textContent = button.dataset.subscribePrice || sub.textContent;
        if (one) one.textContent = button.dataset.onetimePrice || one.textContent;
      });
    });
    root.querySelectorAll('[data-lzy-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        root.querySelectorAll('[data-lzy-mode]').forEach((item) => item.classList.remove('lzy-is-active'));
        button.classList.add('lzy-is-active');
      });
    });
  }
  document.querySelectorAll('[data-lzy-section="goli-bundle"]').forEach(init);
  document.addEventListener('shopify:section:load', (event) => event.target.querySelectorAll('[data-lzy-section="goli-bundle"]').forEach(init));
})();