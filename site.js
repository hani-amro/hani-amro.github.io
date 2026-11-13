/* Language and colour theme for every page. No dependencies.

   Arabic is the deliverable, so Arabic lives in the HTML: crawlers, readers
   without JS and the accessibility gate all get the real page. English lives
   in a per-page table (window.__EN, i18n/en-<page>.js), generated with the
   page by tools/build_site.py. At load the Arabic is captured from the DOM,
   so the two versions cannot drift apart silently. What switches:

     data-i18n="k"        the element's content     (table key  k)
     data-i18n-alt="k"    an image's alt text       (table key "@k")
     data-i18n-aria="k"   an element's aria-label   (table key "@k")
     data-i18n-href="k"   a link that has an English version, e.g. Wain's /en
                                                    (table key "href:k")

   No flash of Arabic: a tiny script in <head> sets lang/dir from the saved
   choice before the first paint and hides the body (class i18n-wait) until
   this file has applied the table; it lets go by itself after 300 ms, so the
   text can never stay hidden. The saved theme is applied there too.

   The language button shows the language you would switch TO, so it is
   readable to someone who cannot read the current one.

   The page is complete without this file: only the two toggles need it. */

(function () {
  "use strict";

  var root = document.documentElement;
  var DEFAULT = root.getAttribute("data-default-lang") || "ar";
  var EN = window.__EN || {};
  var hasEN = Object.keys(EN).length > 0;
  var meta = document.querySelector('meta[name="description"]');
  var AR = { __title: document.title, __desc: meta ? meta.getAttribute("content") : null };

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  // What the HTML says is the Arabic; capture it before anything is swapped.
  each("[data-i18n]", function (el) { AR[el.getAttribute("data-i18n")] = el.innerHTML; });
  each("[data-i18n-alt]", function (el) { AR["@" + el.getAttribute("data-i18n-alt")] = el.getAttribute("alt"); });
  each("[data-i18n-aria]", function (el) { AR["@" + el.getAttribute("data-i18n-aria")] = el.getAttribute("aria-label"); });
  each("[data-i18n-href]", function (el) { AR["href:" + el.getAttribute("data-i18n-href")] = el.getAttribute("href"); });

  function swap(table, sel, attr, prefix) {
    each(sel, function (el) {
      var v = table[prefix + el.getAttribute(sel.slice(1, -1))];
      if (v != null) el.setAttribute(attr, v);
    });
  }

  function apply(lang, initial) {
    var table = lang === "en" ? EN : AR;
    each("[data-i18n]", function (el) {
      var v = table[el.getAttribute("data-i18n")];
      if (v == null) return;
      el.innerHTML = v;
      // Content swapped in after the entrance animation is shown as it is.
      if (!initial) Array.prototype.forEach.call(el.querySelectorAll("[data-reveal]"), function (r) { r.classList.add("in"); });
    });
    swap(table, "[data-i18n-alt]", "alt", "@");
    swap(table, "[data-i18n-aria]", "aria-label", "@");
    swap(table, "[data-i18n-href]", "href", "href:");
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    if (table.__title) document.title = table.__title;
    if (meta && table.__desc) meta.setAttribute("content", table.__desc);
    var btn = document.getElementById("lang-toggle");
    if (btn) {
      var to = lang === "ar" ? "en" : "ar";
      btn.textContent = to === "en" ? "English" : "العربية";
      btn.setAttribute("lang", to);
      btn.setAttribute("aria-label", to === "en" ? "Switch to English" : "التبديل إلى العربية");
    }
    if (!initial) { try { localStorage.setItem("lang", lang); } catch (e) { /* private mode */ } }
  }

  var savedLang = null;
  try { savedLang = localStorage.getItem("lang"); } catch (e) {}
  if (savedLang === "en" && !hasEN) savedLang = null;   // no table: stay in the HTML's language
  if ((savedLang === "en" || savedLang === "ar") && savedLang !== DEFAULT) {
    apply(savedLang, true);
  } else {
    // The head script may have set lang/dir from a saved choice this page cannot honour.
    root.setAttribute("lang", DEFAULT);
    root.setAttribute("dir", DEFAULT === "ar" ? "rtl" : "ltr");
  }
  root.classList.remove("i18n-wait");

  var langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      apply(root.getAttribute("lang") === "ar" ? "en" : "ar", false);
    });
  }

  // ---------------------------------------------------------------- theme --
  var KEY = "theme";
  try {
    var savedTheme = localStorage.getItem(KEY);
    if (savedTheme === "dark" || savedTheme === "light") root.setAttribute("data-theme", savedTheme);
  } catch (e) {}

  // the theme flips at once and is remembered, as the button always did
  function flipTheme() {
    var current = root.getAttribute("data-theme");
    if (!current) {
      current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  }

  // With motion (html.motion: the head script sets it, craft.js keeps it) and where the browser has
  // view transitions, the new theme is cut in like a fresh sheet laid over the page (motion idea
  // «theme»): the page as it was is held still, and the new one is laid over
  // it from the button's side (the header's inline end: left in Arabic, right in English), its edge
  // cut with pinking shears, the teeth pointing the way it goes and its top a little ahead.
  // site.css (@idea:theme) runs the clip between the two polygons set here on <html>, --vt-from and
  // --vt-to; they and html.vt-theme exist only while it runs. Without motion, without view
  // transitions, or after the first error: the theme flips at once, as it always did.
  var cutting = null, cutOff = false;
  var TOOTH = 12, PITCH = 28, LEAD = 0.08;   // a tooth's depth and length (px); the top's lead, by the height
  function cutClear() {
    cutting = null;
    root.classList.remove("vt-theme");
    root.style.removeProperty("--vt-from");
    root.style.removeProperty("--vt-to");
    if (!root.getAttribute("style")) root.removeAttribute("style");
  }
  // The clip: the near side's two corners and, between them, the cut edge from top to bottom. Both
  // polygons have the same points; at the start every point of the edge is past the near side (none
  // of the new page shows), at the end every one, the teeth's roots too, is past the far side (all
  // of it shows, so the last frame is exactly the page the transition hands back).
  function shears(fromLeft, end) {
    var h = window.innerHeight || 800, n = Math.max(6, Math.round(h / PITCH)), lead = h * LEAD;
    var x = function (pct, px) {   // px past pct% of the way across, counted from the near side
      if (!fromLeft) { pct = 100 - pct; px = -px; }
      return "calc(" + pct + "% " + (px < 0 ? "- " : "+ ") + Math.abs(px).toFixed(1) + "px)";
    };
    var pts = [x(0, 0) + " 0%"];
    for (var k = 0; k <= 2 * n; k++) {
      var y = k / (2 * n), d = lead * (1 - y) + (k % 2 ? TOOTH : 0);
      pts.push((end ? x(100, d + 2) : x(0, d - lead - TOOTH - 2)) + " " + (100 * y).toFixed(2) + "%");
    }
    pts.push(x(0, 0) + " 100%");
    return "polygon(" + pts.join(",") + ")";
  }
  // true when the cut took the flip over (it flips the theme itself, even if it is skipped). While a
  // page transition is still bringing the page in (html.vt, the head script) the theme flips at once:
  // a second transition would only cut it short, and the browser skips this one anyway.
  function cutTheme(btn) {
    if (cutOff || !document.startViewTransition || !root.classList.contains("motion") || root.classList.contains("vt") ||
        !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return false;
    var vt = null;
    try {
      // which side the button is on now (switching the language mirrors the header)
      var r = btn.getBoundingClientRect();
      var fromLeft = r.width ? r.left + r.right < window.innerWidth : root.getAttribute("dir") !== "ltr";
      root.style.setProperty("--vt-from", shears(fromLeft, false));
      root.style.setProperty("--vt-to", shears(fromLeft, true));
      root.classList.add("vt-theme");
      vt = document.startViewTransition(function () { try { flipTheme(); } catch (e) {} });
      cutting = vt;
      // a second click skips this cut for its own: the theme still flips, and the class and the
      // polygons stay for the newer cut, which clears them when it ends
      vt.ready.catch(function () {});
      vt.finished.finally(function () { if (cutting === vt) cutClear(); }).catch(function () {});
    } catch (e) {
      cutOff = true;
      cutClear();
    }
    return !!vt;
  }
  // back from the back/forward cache: nothing of a cut is left (on a first load nothing can be, and
  // a cut started before the load event must keep its class)
  addEventListener("pageshow", function (e) { if (e.persisted) cutClear(); });

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    var onTheme = function () { if (!cutTheme(themeBtn)) flipTheme(); };
    themeBtn.addEventListener("click", onTheme);
    // While a cut runs the browser draws it over the page and sends every click to <html> (whatever
    // pointer-events says): one that lands on the button is passed on, so a second click turns back,
    // and so is one on the language button beside it.
    var under = function (el, e) {
      var r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    root.addEventListener("click", function (e) {
      if (!cutting || e.target !== root) return;
      if (under(themeBtn, e)) onTheme();
      else if (langBtn && under(langBtn, e)) langBtn.click();
    });
  }
})();
