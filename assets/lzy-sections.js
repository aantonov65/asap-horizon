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

      function renderBundlePackOptions() {
        const packGrid = root.querySelector('[id^="lzyPackGrid-"]');
        if (!packGrid) return;
        packGrid.innerHTML = '';

        bundleData.packs.forEach((pack) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `lzy-pack-option${pack.quantity === bundleState.selectedPack ? ' lzy-is-active' : ''}`;
          button.textContent = `${pack.quantity}-PACK`;
          button.disabled = !pack.variantId;
          button.addEventListener('click', () => {
            bundleState.selectedPack = pack.quantity;
            syncBundleCard();
          });
          packGrid.appendChild(button);
        });
      }

      function syncBundleCard() {
        const pack = getSelectedPack();
        if (!pack) return;

        const subscribePricing = pack.pricing.subscribe;
        const onetimePricing = pack.pricing.onetime;
        const purchaseButtons = root.querySelectorAll('.lzy-purchase-toggle__button');
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

        if (subscribeButton) {
          subscribeButton.disabled = !pack.subscribeSupported;
        }

        if (checkoutButton) {
          checkoutButton.disabled = !pack.variantId;
        }

        renderBundlePackOptions();
      }

      const subscribeButton = root.querySelector('[data-purchase="subscribe"]');
      const onetimeButton = root.querySelector('[data-purchase="onetime"]');
      const checkoutButton = root.querySelector('[id^="lzyCheckoutButton-"]');

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