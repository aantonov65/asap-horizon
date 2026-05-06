(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();

(() => {
  const activeClass = "lzy-is-active";
  const openClass = "lzy-is-open";
  const expandedClass = "lzy-is-expanded";

  const initNavigation = (root) => {
    if (root.dataset.lzyInitializedNav === "true") return;
    root.dataset.lzyInitializedNav = "true";
    const menuButton = root.querySelector(".lzy-goli-mobile-menu");
    const navLinks = root.querySelector(".lzy-goli-nav-links");
    const productButton = root.querySelector(".lzy-goli-nav-button");
    const productGroup = root.querySelector(".lzy-goli-menu-group");

    menuButton?.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle(openClass) || false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    productButton?.addEventListener("click", () => {
      productGroup?.classList.toggle(openClass);
    });

    root.querySelectorAll(".lzy-goli-cart-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const purchaseRoot = document.querySelector('[data-lzy-section="bundle-purchase"]');
        const drawer = purchaseRoot?.querySelector(".lzy-goli-cart-drawer");
        const overlay = purchaseRoot?.querySelector(".lzy-goli-cart-overlay");
        drawer?.classList.add(openClass);
        drawer?.setAttribute("aria-hidden", "false");
        if (overlay) overlay.hidden = false;
      });
    });
  };

  const initBundleOptions = (root) => {
    if (root.dataset.lzyInitializedBundle === "true") return;
    root.dataset.lzyInitializedBundle = "true";
    const plans = [...root.querySelectorAll(".lzy-goli-plan")];
    const packs = [...root.querySelectorAll(".lzy-goli-pack")];
    const productImage = root.querySelector("[data-lzy-bundle-product-image]");
    const cartPlan = root.querySelector("[data-lzy-cart-plan]");
    const cartPack = root.querySelector("[data-lzy-cart-pack]");
    const cartPrice = root.querySelector("[data-lzy-cart-price]");
    const cartTotal = root.querySelector("[data-lzy-cart-total]");

    const updateBundle = () => {
      const activePlan = root.querySelector(".lzy-goli-plan." + activeClass);
      const activePack = root.querySelector(".lzy-goli-pack." + activeClass);
      const isSubscribe = activePlan?.dataset.plan === "subscribe";
      const eachPrice = isSubscribe ? activePack?.dataset.subscribeEach : activePack?.dataset.onetimeEach;
      const totalPrice = isSubscribe ? activePack?.dataset.subscribeTotal : activePack?.dataset.onetimeTotal;
      const comparePrice = activePack?.dataset.comparePrice || "";

      plans.forEach((plan) => {
        const each = plan.querySelector("[data-lzy-plan-each]");
        const total = plan.querySelector("[data-lzy-plan-total]");
        const compare = plan.querySelector("[data-lzy-plan-compare]");
        const planSubscribe = plan.dataset.plan === "subscribe";
        if (each) each.textContent = planSubscribe ? activePack?.dataset.subscribeEach || "" : activePack?.dataset.onetimeEach || "";
        if (total) total.textContent = planSubscribe ? activePack?.dataset.subscribeTotal || "" : activePack?.dataset.onetimeTotal || "";
        if (compare) compare.textContent = comparePrice;
      });

      if (productImage && activePack?.dataset.packImage) productImage.src = activePack.dataset.packImage;
      if (cartPlan) cartPlan.textContent = isSubscribe ? "Subscribe & Save" : "One-time Purchase";
      if (cartPack) cartPack.textContent = activePack?.dataset.pack || "3-PACK";
      if (cartPrice) cartPrice.textContent = totalPrice || "$30.38";
      if (cartTotal) cartTotal.textContent = totalPrice || "$30.38";
    };

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((item) => item.classList.remove(activeClass));
        plan.classList.add(activeClass);
        updateBundle();
      });
    });

    packs.forEach((pack) => {
      pack.addEventListener("click", () => {
        packs.forEach((item) => item.classList.remove(activeClass));
        pack.classList.add(activeClass);
        updateBundle();
      });
    });

    const drawer = root.querySelector(".lzy-goli-cart-drawer");
    const overlay = root.querySelector(".lzy-goli-cart-overlay");
    const closeButton = root.querySelector(".lzy-goli-cart-close");
    const empty = root.querySelector(".lzy-goli-cart-empty");
    const item = root.querySelector(".lzy-goli-cart-item");

    const open = (withItem) => {
      if (withItem) {
        if (empty) empty.hidden = true;
        if (item) item.hidden = false;
      }
      drawer?.classList.add(openClass);
      drawer?.setAttribute("aria-hidden", "false");
      if (overlay) overlay.hidden = false;
    };

    const close = () => {
      drawer?.classList.remove(openClass);
      drawer?.setAttribute("aria-hidden", "true");
      if (overlay) overlay.hidden = true;
    };

    root.querySelectorAll(".lzy-goli-main-checkout").forEach((button) => {
      button.addEventListener("click", () => open(true));
    });
    closeButton?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    updateBundle();
  };

  const initProductSliders = (root) => {
    root.querySelectorAll("[data-lzy-product-slider]").forEach((slider) => {
      if (slider.dataset.lzyInitializedSlider === "true") return;
      slider.dataset.lzyInitializedSlider = "true";
      const image = slider.querySelector("img[data-images]");
      const prev = slider.querySelector(".lzy-goli-slider-prev");
      const next = slider.querySelector(".lzy-goli-slider-next");
      const dots = slider.querySelector(".lzy-goli-slider-dots");
      if (!image || !dots) return;

      const images = image.dataset.images.split(",").map((item) => item.trim()).filter(Boolean);
      let index = 0;

      const setSlide = (nextIndex) => {
        index = (nextIndex + images.length) % images.length;
        image.style.opacity = "0";
        window.setTimeout(() => {
          image.src = images[index];
          image.style.opacity = "1";
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle(activeClass, dotIndex === index);
          });
        }, 140);
      };

      images.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show image " + (dotIndex + 1));
        dot.classList.toggle(activeClass, dotIndex === 0);
        dot.addEventListener("click", () => setSlide(dotIndex));
        dots.append(dot);
      });

      prev?.addEventListener("click", () => setSlide(index - 1));
      next?.addEventListener("click", () => setSlide(index + 1));
    });
  };

  const initClinicianReviews = (root) => {
    root.querySelectorAll("[data-lzy-expand-review]").forEach((button) => {
      if (button.dataset.lzyInitializedReview === "true") return;
      button.dataset.lzyInitializedReview = "true";
      button.addEventListener("click", () => {
        const copy = button.closest(".lzy-goli-review-copy");
        copy?.classList.toggle(expandedClass);
        button.textContent = copy?.classList.contains(expandedClass) ? "Show less" : "Show more";
      });
    });
  };

  const initNewsletter = (root) => {
    const form = root.querySelector("[data-lzy-newsletter]");
    if (!form || form.dataset.lzyInitializedNewsletter === "true") return;
    form.dataset.lzyInitializedNewsletter = "true";
    const message = root.querySelector(".lzy-goli-newsletter-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (message) message.textContent = "Thank you for subscribing.";
      form.reset();
    });
  };

  const init = (scope = document) => {
    scope.querySelectorAll('[data-lzy-section="announcement-header"]').forEach(initNavigation);
    scope.querySelectorAll('[data-lzy-section="bundle-purchase"]').forEach(initBundleOptions);
    scope.querySelectorAll('[data-lzy-section="product-cards"]').forEach(initProductSliders);
    scope.querySelectorAll('[data-lzy-section="clinician-reviews"]').forEach(initClinicianReviews);
    scope.querySelectorAll('[data-lzy-section="footer"]').forEach(initNewsletter);
  };

  document.addEventListener("DOMContentLoaded", () => init());
  document.addEventListener("shopify:section:load", (event) => init(event.target));
})();
