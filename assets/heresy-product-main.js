(() => {
  const money = (cents, format) => {
    const amount = Number(cents || 0) / 100;
    if (format === 'EUR') return `€${amount.toFixed(2).replace('.', ',')}`;
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
    const mobileMedia = window.matchMedia('(max-width: 749px)');
    let activeMediaIndex = 0;
    const showMedia = (index) => {
      activeMediaIndex = index;
      media.forEach((item, itemIndex) => {
        item.classList.toggle('heresy-is-active', itemIndex === index);
        const videos = [...item.querySelectorAll('video')];
        videos.forEach((video) => video.pause());
        if (itemIndex !== index || document.hidden) return;
        const preferredVideo = item.querySelector(mobileMedia.matches ? '.heresy-product-main__video--mobile' : '.heresy-product-main__video--desktop');
        preferredVideo?.play().catch(() => {});
      });
      mediaButtons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle('Product-slider-thumbnail__active', selected);
        button.setAttribute('aria-current', String(selected));
      });
    };
    mediaButtons.forEach((button, index) => button.addEventListener('click', () => showMedia(index)));
    mobileMedia.addEventListener?.('change', () => showMedia(activeMediaIndex));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) media.forEach((item) => item.querySelectorAll('video').forEach((video) => video.pause()));
      else showMedia(activeMediaIndex);
    });
    showMedia(0);

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

    const routine = root.querySelector('[data-heresy-routine]');
    if (routine) {
      const cards = [...routine.querySelectorAll('[data-heresy-routine-card]')];
      const routineButton = routine.querySelector('[data-heresy-routine-add]');
      const updateRoutine = () => {
        const selected = cards.filter((card) => card.querySelector('[data-heresy-routine-checkbox]')?.checked);
        cards.forEach((card) => card.classList.toggle('heresy-is-selected', selected.includes(card)));
        const total = selected.reduce((sum, card) => sum + Number(card.dataset.priceCents || 0), 0);
        if (routineButton) {
          routineButton.disabled = selected.length === 0;
          routineButton.textContent = selected.length ? `ADD - ${money(total, currency)}` : (routineButton.dataset.defaultLabel || routineButton.textContent);
          if (!routineButton.dataset.defaultLabel) routineButton.dataset.defaultLabel = routineButton.textContent;
        }
      };

      cards.forEach((card) => {
        const checkbox = card.querySelector('[data-heresy-routine-checkbox]');
        checkbox?.addEventListener('change', updateRoutine);
        card.addEventListener('click', (event) => {
          if (event.target.closest('button, a, label, input')) return;
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            updateRoutine();
          }
        });

        const dropdown = card.querySelector('[data-heresy-routine-dropdown]');
        const panel = card.querySelector('[data-heresy-routine-variant-panel]');
        if (panel) {
          panel.hidden = false;
          dropdown?.addEventListener('click', () => {
            const opening = !panel.classList.contains('heresy-is-open');
            root.querySelectorAll('[data-heresy-routine-variant-panel].heresy-is-open').forEach((other) => other.classList.remove('heresy-is-open'));
            root.querySelectorAll('[data-heresy-routine-dropdown][aria-expanded="true"]').forEach((other) => other.setAttribute('aria-expanded', 'false'));
            panel.classList.toggle('heresy-is-open', opening);
            dropdown.setAttribute('aria-expanded', String(opening));
          });
          panel.querySelectorAll('[data-heresy-routine-variant]').forEach((option) => {
            option.addEventListener('click', () => {
              card.dataset.variantId = option.dataset.heresyRoutineVariant || '';
              card.dataset.priceCents = option.dataset.priceCents || '0';
              const label = dropdown?.querySelector('span');
              const price = card.querySelector('.heresy-complete-routine__card-price');
              if (label) label.textContent = option.textContent.trim();
              if (price) price.textContent = option.dataset.price || money(option.dataset.priceCents, currency);
              panel.classList.remove('heresy-is-open');
              dropdown?.setAttribute('aria-expanded', 'false');
              updateRoutine();
            });
          });
        }
      });

      document.addEventListener('click', (event) => {
        if (routine.contains(event.target) && event.target.closest('[data-heresy-routine-dropdown], [data-heresy-routine-variant-panel]')) return;
        routine.querySelectorAll('[data-heresy-routine-variant-panel].heresy-is-open').forEach((panel) => panel.classList.remove('heresy-is-open'));
        routine.querySelectorAll('[data-heresy-routine-dropdown][aria-expanded="true"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
      });

      routineButton?.addEventListener('click', async () => {
        const items = cards
          .filter((card) => card.querySelector('[data-heresy-routine-checkbox]')?.checked && card.dataset.variantId)
          .map((card) => ({ id: Number(card.dataset.variantId), quantity: 1 }));
        if (!items.length) return;
        routineButton.disabled = true;
        try {
          await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ items }),
          });
          document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
        } finally {
          updateRoutine();
        }
      });
      if (routineButton) routineButton.dataset.defaultLabel = routineButton.textContent;
      updateRoutine();
    }

    const upsells = root.querySelector('[data-heresy-upsells]');
    if (upsells) {
      const tabs = [...upsells.querySelectorAll('[data-heresy-upsell-tab]')];
      const panels = [...upsells.querySelectorAll('[data-heresy-upsell-panel]')];
      const indicator = upsells.querySelector('[data-heresy-upsell-indicator]');
      const setUpsell = (index) => {
        tabs.forEach((tab, tabIndex) => {
          const selected = tabIndex === index;
          tab.classList.toggle('Product__upsell__header__toggle__active', selected);
          tab.setAttribute('aria-selected', String(selected));
        });
        panels.forEach((panel, panelIndex) => panel.classList.toggle('heresy-is-hidden', panelIndex !== index));
        const activeTab = tabs[index];
        if (indicator && activeTab) {
          indicator.style.width = `${activeTab.offsetWidth}px`;
          indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
        }
      };
      tabs.forEach((tab, index) => tab.addEventListener('click', () => setUpsell(index)));
      requestAnimationFrame(() => setUpsell(0));
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-heresy-accordion]').forEach((details) => {
      const summary = details.querySelector('summary');
      const content = details.querySelector('.Product-tab-content-container');
      if (!summary || !content) return;
      content.style.height = details.open ? `${content.scrollHeight}px` : '0px';
      summary.setAttribute('aria-expanded', String(details.open));
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        if (details.dataset.animating === 'true') return;
        const opening = !details.open;
        if (reduceMotion) {
          details.open = opening;
          content.style.height = opening ? 'auto' : '0px';
          summary.setAttribute('aria-expanded', String(opening));
          return;
        }
        details.dataset.animating = 'true';
        if (opening) {
          details.open = true;
          content.style.height = '0px';
          summary.setAttribute('aria-expanded', 'true');
          requestAnimationFrame(() => {
            content.style.height = `${content.scrollHeight}px`;
          });
        } else {
          content.style.height = `${content.scrollHeight}px`;
          summary.setAttribute('aria-expanded', 'false');
          requestAnimationFrame(() => {
            content.style.height = '0px';
          });
        }
        const finish = (transitionEvent) => {
          if (transitionEvent.propertyName !== 'height') return;
          content.removeEventListener('transitionend', finish);
          if (opening) content.style.height = 'auto';
          else details.open = false;
          details.dataset.animating = 'false';
        };
        content.addEventListener('transitionend', finish);
      });
    });
  };

  const initAll = (scope = document) => scope.querySelectorAll('[data-heresy-product]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
