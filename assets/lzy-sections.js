class LzyGoliBundlesProducts extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;

      this.modeButtons = Array.from(this.querySelectorAll('[data-mode-button]'));
      this.subscribeModeButton = this.querySelector('[data-mode-button="subscribe"]');
      this.onetimeModeButton = this.querySelector('[data-mode-button="onetime"]');
      this.packButtons = Array.from(this.querySelectorAll('[data-pack-button]'));
      this.visuals = Array.from(this.querySelectorAll('[data-pack-visual]'));
      this.checkoutButton = this.querySelector('[data-checkout-button]');

      this.subscribeUnit = this.querySelector('[data-price-unit]');
      this.subscribeTotal = this.querySelector('[data-price-total]');
      this.subscribeCompare = this.querySelector('[data-price-compare]');
      this.onetimeUnit = this.querySelector('[data-onetime-unit]');
      this.onetimeTotal = this.querySelector('[data-onetime-total]');
      this.onetimeCompare = this.querySelector('[data-onetime-compare]');

      this.mode = this.dataset.defaultMode || 'subscribe';
      this.packIndex = Number.parseInt(this.dataset.defaultPack || '0', 10);

      this.modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.mode = button.dataset.modeButton;
          this.render();
        });
      });

      this.packButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.packIndex = Number.parseInt(button.dataset.packButton || '0', 10);
          this.render();
        });
      });

      if (this.checkoutButton) {
        this.checkoutButton.addEventListener('click', async () => {
          const selectedPack = this.packButtons[this.packIndex];
          if (!selectedPack) return;

          const variantId = selectedPack.dataset.packVariantId;
          if (!variantId) return;

          const payload = {
            items: [
              {
                id: Number(variantId),
                quantity: 1
              }
            ]
          };

          if (this.mode === 'subscribe' && selectedPack.dataset.packSubscribeSellingPlanId) {
            payload.items[0].selling_plan = Number(selectedPack.dataset.packSubscribeSellingPlanId);
          }

          this.checkoutButton.disabled = true;

          try {
            await fetch(this.dataset.cartAddUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify(payload)
            });

            window.location.href = this.dataset.checkoutUrl;
          } catch (error) {
            this.checkoutButton.disabled = false;
          }
        });
      }

      this.render();
    }

    render() {
      const selectedPack = this.packButtons[this.packIndex];

      if (selectedPack && this.mode === 'subscribe' && selectedPack.dataset.packSubscribeEnabled !== 'true') {
        this.mode = 'onetime';
      }

      this.modeButtons.forEach((button) => {
        const isActive = button.dataset.modeButton === this.mode;
        button.classList.toggle('lzy-is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      this.packButtons.forEach((button, index) => {
        button.classList.toggle('lzy-is-active', index === this.packIndex);
      });

      this.visuals.forEach((visual, index) => {
        visual.classList.toggle('lzy-is-active', index === this.packIndex);
      });

      if (!selectedPack) {
        if (this.subscribeModeButton) this.subscribeModeButton.disabled = true;
        if (this.onetimeModeButton) this.onetimeModeButton.disabled = true;
        if (this.checkoutButton) this.checkoutButton.disabled = true;
        return;
      }

      if (this.subscribeModeButton) {
        this.subscribeModeButton.disabled = selectedPack.dataset.packSubscribeEnabled !== 'true';
      }

      if (this.onetimeModeButton) {
        this.onetimeModeButton.disabled = !selectedPack.dataset.packVariantId;
      }

      this.subscribeUnit.textContent = selectedPack.dataset.packSubscribeUnit || '';
      this.subscribeTotal.textContent = selectedPack.dataset.packSubscribeTotal || '';
      this.subscribeCompare.textContent = selectedPack.dataset.packSubscribeCompare || '';
      this.onetimeUnit.textContent = selectedPack.dataset.packOnetimeUnit || '';
      this.onetimeTotal.textContent = selectedPack.dataset.packOnetimeTotal || '';
      this.onetimeCompare.textContent = selectedPack.dataset.packOnetimeCompare || '';

      if (this.checkoutButton) {
        this.checkoutButton.disabled = !selectedPack.dataset.packVariantId;
      }
    }
  }

  if (!customElements.get('lzy-goli-bundles-products')) {
    customElements.define('lzy-goli-bundles-products', LzyGoliBundlesProducts);
  }