"use client";

import { useEffect } from "react";

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, string>>;
};

export default function SiteInteractions() {
  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const navToggle = document.getElementById("navToggle");
    const navClose = document.getElementById("navClose");
    const navDrawer = document.getElementById("navDrawer");
    const main = document.getElementById("main");
    const heroVisual = document.getElementById("heroVisual");
    const conversionLinks = document.querySelectorAll<HTMLElement>("[data-conversion]");

    const trackConversion = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      const conversion = element.dataset.conversion;
      if (!conversion) return;

      (window as DataLayerWindow).dataLayer?.push({
        event: "bezdna_conversion",
        conversion,
      });
      window.dispatchEvent(new CustomEvent("bezdna:conversion", { detail: { conversion } }));
    };

    conversionLinks.forEach((link) => link.addEventListener("click", trackConversion));

    if (!header || !navToggle || !navClose || !navDrawer || !main || !heroVisual) {
      return () => conversionLinks.forEach((link) => link.removeEventListener("click", trackConversion));
    }

    const drawerLinks = navDrawer.querySelectorAll<HTMLAnchorElement>("a");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");
    const menuLinks = document.querySelectorAll<HTMLAnchorElement>(".menu-nav a");
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    let lastFocused: HTMLElement | null = null;
    let hideDrawerTimer: ReturnType<typeof setTimeout> | undefined;

    const setHeaderState = () => header.classList.toggle("scrolled", window.scrollY > 24);
    const setParallax = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      heroVisual.style.transform = `translate3d(0, ${window.scrollY * 0.08}px, 0)`;
    };
    const closeDrawer = () => {
      navDrawer.classList.remove("open");
      navDrawer.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      main.inert = false;
      hideDrawerTimer = setTimeout(() => {
        navDrawer.hidden = true;
      }, 320);
      lastFocused?.focus();
    };
    const openDrawer = () => {
      if (hideDrawerTimer) clearTimeout(hideDrawerTimer);
      lastFocused = document.activeElement as HTMLElement | null;
      navDrawer.hidden = false;
      requestAnimationFrame(() => navDrawer.classList.add("open"));
      navDrawer.setAttribute("aria-hidden", "false");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      main.inert = true;
      navClose.focus();
    };
    const toggleDrawer = () => navDrawer.classList.contains("open") ? closeDrawer() : openDrawer();
    const closeOnBackdrop = (event: Event) => {
      if (event.target === navDrawer) closeDrawer();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && navDrawer.classList.contains("open")) closeDrawer();
    };

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
    window.addEventListener("scroll", setParallax, { passive: true });
    navToggle.addEventListener("click", toggleDrawer);
    navClose.addEventListener("click", closeDrawer);
    navDrawer.addEventListener("click", closeOnBackdrop);
    drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));
    document.addEventListener("keydown", closeOnEscape);

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 });
    sections.forEach((section) => navObserver.observe(section));

    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0.01 });
    document.querySelectorAll<HTMLElement>(".menu-category").forEach((section) => menuObserver.observe(section));

    return () => {
      if (hideDrawerTimer) clearTimeout(hideDrawerTimer);
      window.removeEventListener("scroll", setHeaderState);
      window.removeEventListener("scroll", setParallax);
      navToggle.removeEventListener("click", toggleDrawer);
      navClose.removeEventListener("click", closeDrawer);
      navDrawer.removeEventListener("click", closeOnBackdrop);
      drawerLinks.forEach((link) => link.removeEventListener("click", closeDrawer));
      document.removeEventListener("keydown", closeOnEscape);
      conversionLinks.forEach((link) => link.removeEventListener("click", trackConversion));
      navObserver.disconnect();
      menuObserver.disconnect();
    };
  }, []);

  return null;
}
