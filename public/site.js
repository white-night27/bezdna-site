(() => {
  const init = () => {
    const header = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const navClose = document.getElementById("navClose");
    const navDrawer = document.getElementById("navDrawer");
    const main = document.getElementById("main");

    document.addEventListener("click", (event) => {
      const element = event.target instanceof Element ? event.target.closest("[data-conversion]") : null;
      if (!(element instanceof HTMLElement)) return;
      const conversion = element.dataset.conversion;
      if (!conversion) return;
      window.dataLayer?.push?.({ event: "bezdna_conversion", conversion });
      window.dispatchEvent(new CustomEvent("bezdna:conversion", { detail: { conversion } }));
    }, { passive: true });

    if (!header || !navToggle || !navClose || !navDrawer || !main) return;

    const drawerLinks = navDrawer.querySelectorAll("a");
    const navLinks = document.querySelectorAll(".nav-links a");
    const menuLinks = document.querySelectorAll(".menu-nav a");
    const sections = document.querySelectorAll("main section[id]");
    let lastFocused = null;
    let hideDrawerTimer;
    let scrollFrame = 0;

    const updateScrollEffects = () => {
      scrollFrame = 0;
      header.classList.toggle("scrolled", window.scrollY > 24);
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
    };

    const closeDrawer = () => {
      navDrawer.classList.remove("open");
      navDrawer.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      main.inert = false;
      clearTimeout(hideDrawerTimer);
      hideDrawerTimer = setTimeout(() => { navDrawer.hidden = true; }, 320);
      lastFocused?.focus?.();
    };

    const openDrawer = () => {
      clearTimeout(hideDrawerTimer);
      lastFocused = document.activeElement;
      navDrawer.hidden = false;
      requestAnimationFrame(() => navDrawer.classList.add("open"));
      navDrawer.setAttribute("aria-hidden", "false");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      main.inert = true;
      navClose.focus();
    };

    const toggleDrawer = () => navDrawer.classList.contains("open") ? closeDrawer() : openDrawer();

    updateScrollEffects();
    window.addEventListener("scroll", onScroll, { passive: true });
    navToggle.addEventListener("click", toggleDrawer);
    navClose.addEventListener("click", closeDrawer);
    navDrawer.addEventListener("click", (event) => {
      if (event.target === navDrawer) closeDrawer();
    });
    drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navDrawer.classList.contains("open")) closeDrawer();
    });

    if ("IntersectionObserver" in window) {
      const navObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      }, { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 });
      sections.forEach((section) => navObserver.observe(section));

      if (menuLinks.length) {
        const menuObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            menuLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
          }
        }, { rootMargin: "-25% 0px -65% 0px", threshold: 0.01 });
        document.querySelectorAll(".menu-category").forEach((section) => menuObserver.observe(section));
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* Depth upgrade: scroll reveal + decorative depth gauge (no dependencies). */
(() => {
  const start = () => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce && "IntersectionObserver" in window) {
      const targets = document.querySelectorAll(
        "main section:not(.hero) .section-head, .about-grid, .menu-note, .menu-category-cards li, .food-card, .atmos-row, .feature-tags, .impression, .contact-block"
      );
      const viewportBottom = window.innerHeight;
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      const groups = new Map();
      targets.forEach((el) => {
        el.classList.add("reveal");
        if (el.getBoundingClientRect().top < viewportBottom) { el.classList.add("is-in"); return; }
        const parent = el.parentElement;
        const index = groups.get(parent) || 0;
        groups.set(parent, index + 1);
        el.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 90}ms`);
        io.observe(el);
      });
      root.classList.add("js-reveal");
      window.addEventListener("beforeprint", () => targets.forEach((el) => el.classList.add("is-in")));
    }

    const gauge = document.getElementById("depthGauge");
    const value = document.getElementById("depthValue");
    if (!gauge || !value) return;
    const maxDepth = 1000;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      gauge.style.setProperty("--depth", progress.toFixed(4));
      gauge.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.35);
      value.textContent = `${Math.round(progress * maxDepth)} м`;
    };
    window.addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
