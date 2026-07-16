(() => {
  const money = (cents, format) => {
    const amount = Number(cents || 0) / 100;
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en', {
        style: 'currency',
        currency: format || 'USD',
      }).format(amount);
    } catch (_error) {
      return `$${amount.toFixed(2)}`;
    }
  };

  const init = (root) => {
    if (!root || root.dataset.heresyProductReady === 'true') return;
    root.dataset.heresyProductReady = 'true';

    const media = [...root.querySelectorAll('[data-heresy-media]')];
    const mediaButtons = [...root.querySelectorAll('[data-heresy-media-button]')];
    const showMedia = (index) => {
      media.forEach((item, itemIndex) => {
        item.classList.toggle('heresy-is-active', itemIndex === index);
        const video = item.querySelector('video');
        if (!video) return;
        if (itemIndex === index) video.play().catch(() => {});
        else video.pause();
      });
      mediaButtons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle('Product-slider-thumbnail__active', selected);
        button.setAttribute('aria-current', String(selected));
      });
    };
    mediaButtons.forEach((button, index) => button.addEventListener('click', () => showMedia(index)));

    const variantsScript = root.querySelector('[data-heresy-product-variants]');
    const variants = variantsScript ? JSON.parse(variantsScript.textContent || '[]') : [];
    const optionGroups = [...root.querySelectorAll('[data-heresy-option]')];
    const variantInput = root.querySelector('[data-heresy-variant-id]');
    const mainButton = root.querySelector('[data-heresy-add-button]');
    const stickyButton = root.querySelector('[data-heresy-sticky-add]');
    const availableLabel = root.dataset.addLabel || 'ADD TO BAG';
    const soldOutLabel = root.dataset.soldOutLabel || 'SOLD OUT';
    const currency = root.dataset.currency || window.Shopify?.currency?.active || 'USD';

    const selectedOptions = () => optionGroups.map((group) => group.querySelector('.heresy-is-selected')?.dataset.heresyOptionValue || '');
    const applyVariant = (variant) => {
      if (!variant) {
        [mainButton, stickyButton].forEach((button) => { if (button) button.disabled = true; });
        return;
      }
      if (variantInput) variantInput.value = variant.id;
      root.querySelectorAll('[data-heresy-product-price]').forEach((node) => { node.textContent = variant.formatted_price || money(variant.price, currency); });
      const compare = root.querySelector('[data-heresy-product-compare]');
      if (compare) {
        compare.hidden = !(variant.compare_at_price > variant.price);
        compare.textContent = variant.formatted_compare_at_price || (variant.compare_at_price ? money(variant.compare_at_price, currency) : '');
      }
      [mainButton, stickyButton].forEach((button) => { if (button) button.disabled = !variant.available; });
      const mainLabel = root.querySelector('[data-heresy-add-label]');
      const stickyLabel = root.querySelector('[data-heresy-sticky-label]');
      if (mainLabel) mainLabel.textContent = variant.available ? availableLabel : soldOutLabel;
      if (stickyLabel) stickyLabel.textContent = variant.available ? availableLabel : soldOutLabel;
      const stickyVariant = root.querySelector('[data-heresy-sticky-variant]');
      if (stickyVariant) stickyVariant.textContent = variant.title;
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    };

    optionGroups.forEach((group) => {
      group.querySelectorAll('[data-heresy-option-value]').forEach((button) => {
        button.addEventListener('click', () => {
          group.querySelectorAll('[data-heresy-option-value]').forEach((item) => {
            item.classList.toggle('heresy-is-selected', item === button);
            item.setAttribute('aria-pressed', String(item === button));
          });
          const label = root.querySelector(`[data-heresy-option-label="${group.dataset.heresyOption}"]`);
          if (label) label.textContent = button.dataset.heresyOptionValue;
          const selected = selectedOptions();
          applyVariant(variants.find((variant) => variant.options.every((option, index) => option === selected[index])));
        });
      });
    });

    const quantityInput = root.querySelector('[data-heresy-quantity-input]');
    const quantityOutput = root.querySelector('[data-heresy-quantity-output]');
    root.querySelectorAll('[data-heresy-quantity-change]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = Math.max(1, Number(quantityInput?.value || 1) + Number(button.dataset.heresyQuantityChange));
        if (quantityInput) quantityInput.value = next;
        if (quantityOutput) quantityOutput.textContent = next;
      });
    });

    const stickyBar = root.querySelector('[data-heresy-sticky-bar]');
    if (stickyBar && mainButton && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        stickyBar.classList.toggle('Product-sticky-bar__sticky', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      observer.observe(mainButton);
    }
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-product]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
