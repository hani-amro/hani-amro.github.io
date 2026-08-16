/* Theme, scroll reveal, and card tilt. No dependencies.

   The page is complete and correct without this file: content is in the HTML,
   the hero figures are static, and every reveal target is visible by default
   unless this script marks the document as JS-capable. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------------------------------------------------------------- theme ---
  var KEY = "theme";
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) { /* private mode: fall back to the OS preference */ }

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  // ------------------------------------------------------------- reveal ---
  var sections = document.querySelectorAll("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    // No animation available or wanted: show everything immediately.
    Array.prototype.forEach.call(sections, function (s) { s.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);   // reveal once, never re-hide on scroll back
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(sections, function (s) { io.observe(s); });

    // Safety net: if something goes wrong with the observer, never leave the
    // page permanently blank.
    setTimeout(function () {
      Array.prototype.forEach.call(sections, function (s) { s.classList.add("in"); });
    }, 3500);
  }

  // --------------------------------------------------------------- tilt ---
  if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var tiltables = document.querySelectorAll(".card, .repo");
  var frame = null;

  Array.prototype.forEach.call(tiltables, function (el) {
    el.addEventListener("mousemove", function (ev) {
      if (frame) return;                     // one write per animation frame
      frame = requestAnimationFrame(function () {
        frame = null;
        var r = el.getBoundingClientRect();
        el.style.setProperty("--rx", ((ev.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--ry", ((ev.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    }, { passive: true });

    el.addEventListener("mouseleave", function () {
      el.style.setProperty("--rx", "0");
      el.style.setProperty("--ry", "0");
    });
  });
})();
