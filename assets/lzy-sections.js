(() => {
    function initializeBundleCard(root) {
      if (!root || root.dataset.lzyInitialized === 'true') return;
      root.dataset.lzyInitialized = 'true';

      const bundleState = {
        purchaseMode: root.dataset.defaultMode || 'subscribe',
        selectedPack: root.dataset.defaultPack || '',
      };

      const bundleData = JSON.parse(root.dataset.bundleData || '{"packs":[]}');
      if (!bundleState.selectedPack && bundleData.packs[0]) {
        bundleState.selectedPack = bundleData.packs[0].quantity;
      }

      function getSelectedPack() {
        return bundleData.packs.find((pack) => pack.quantity === bundleState.selectedPack) ?? bundleData.packs[0];
      }

      function syncBundleCard() {
        const pack = getSelectedPack();
        if (!pack) return;

        const subscribePricing = pack.pricing.subscribe;
        const onetimePricing = pack.pricing.onetime;
        const purchaseButtons = root.querySelectorAll('.lzy-purchase-toggle__button');
        const packButtons = root.querySelectorAll('[data-pack-option]');
        const bundleImage = root.querySelector('[id^="lzyBundleImage-"]');
        const bundleBadge = root.querySelector('[id^="lzyBundleBadge-"]');
        const unitPrice = root.querySelector('[id^="lzyUnitPrice-"]');
        const totalPrice = root.querySelector('[id^="lzyTotalPrice-"]');
        const comparePrice = root.querySelector('[id^="lzyComparePrice-"]');
        const unitPriceSecondary = root.querySelector('[id^="lzyUnitPriceSecondary-"]');
        const totalPriceSecondary = root.querySelector('[id^="lzyTotalPriceSecondary-"]');
        const comparePriceSecondary = root.querySelector('[id^="lzyComparePriceSecondary-"]');
        const subscribeButton = root.querySelector('[data-purchase="subscribe"]');
        const checkoutButton = root.querySelector('[id^="lzyCheckoutButton-"]');

        if (bundleState.purchaseMode === 'subscribe' && !pack.subscribeSupported) {
          bundleState.purchaseMode = 'onetime';
        }

        if (bundleImage) bundleImage.src = pack.image || '';
        if (bundleImage) bundleImage.alt = pack.alt || 'Selected Goli bundle';
        if (bundleBadge) bundleBadge.src = pack.discount[bundleState.purchaseMode] || '';
        if (unitPrice) unitPrice.textContent = subscribePricing.unit;
        if (totalPrice) totalPrice.textContent = subscribePricing.total;
        if (comparePrice) comparePrice.textContent = subscribePricing.compare;
        if (unitPriceSecondary) unitPriceSecondary.textContent = onetimePricing.unit;
        if (totalPriceSecondary) totalPriceSecondary.textContent = onetimePricing.total;
        if (comparePriceSecondary) comparePriceSecondary.textContent = onetimePricing.compare;

        purchaseButtons.forEach((button) => {
          const isActive = button.dataset.purchase === bundleState.purchaseMode;
          button.classList.toggle('lzy-is-active', isActive);
          button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        packButtons.forEach((button) => {
          const isActive = button.dataset.packQuantity === bundleState.selectedPack;
          button.classList.toggle('lzy-is-active', isActive);
          button.disabled = !button.dataset.packQuantity || !bundleData.packs.find((item) => item.quantity === button.dataset.packQuantity && item.variantId);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        if (subscribeButton) {
          subscribeButton.disabled = !pack.subscribeSupported;
        }

        if (checkoutButton) {
          checkoutButton.disabled = !pack.variantId;
        }
      }

      const subscribeButton = root.querySelector('[data-purchase="subscribe"]');
      const onetimeButton = root.querySelector('[data-purchase="onetime"]');
      const checkoutButton = root.querySelector('[id^="lzyCheckoutButton-"]');
      const packButtons = root.querySelectorAll('[data-pack-option]');

      if (subscribeButton) {
        subscribeButton.addEventListener('click', () => {
          if (subscribeButton.disabled) return;
          bundleState.purchaseMode = 'subscribe';
          syncBundleCard();
        });
      }

      if (onetimeButton) {
        onetimeButton.addEventListener('click', () => {
          bundleState.purchaseMode = 'onetime';
          syncBundleCard();
        });
      }

      packButtons.forEach((button) => {
        button.addEventListener('click', () => {
          if (button.disabled) return;
          bundleState.selectedPack = button.dataset.packQuantity || bundleState.selectedPack;
          syncBundleCard();
        });
      });

      if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
          const pack = getSelectedPack();
          if (!pack || !pack.variantId) return;

          const payload = {
            items: [
              {
                id: Number(pack.variantId),
                quantity: 1,
              },
            ],
          };

          if (bundleState.purchaseMode === 'subscribe' && pack.sellingPlanId) {
            payload.items[0].selling_plan = Number(pack.sellingPlanId);
          }

          checkoutButton.disabled = true;

          try {
            await fetch(root.dataset.cartAddUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify(payload),
            });

            window.location.href = root.dataset.checkoutUrl;
          } catch (error) {
            checkoutButton.disabled = false;
          }
        });
      }

      syncBundleCard();
    }

    document.querySelectorAll('[data-lzy-bundle-builder]').forEach((root) => initializeBundleCard(root));
  })();

(() => {
  function initProductCardSliders(root = document) {
    if (typeof Swiper === 'undefined') return;
    root.querySelectorAll('[class*="product-card-slider-"]').forEach((slider) => {
      if (slider.dataset.lzySwiperInit === 'true') return;
      slider.dataset.lzySwiperInit = 'true';
      const suffix = [...slider.classList].find((name) => name.startsWith('product-card-slider-'))?.replace('product-card-slider-', '');
      new Swiper(slider, {
        slidesPerView: 1,
        pagination: { el: '.product-card-pagination-' + suffix, clickable: true },
        navigation: { nextEl: '.slide-arrow-' + suffix + '.swiper-button-next', prevEl: '.slide-arrow-' + suffix + '.swiper-button-prev' }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', () => initProductCardSliders());
  document.addEventListener('shopify:section:load', (event) => initProductCardSliders(event.target));
})();
