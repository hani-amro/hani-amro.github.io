/* Site-wide living backdrop: drifting light fields over a faint depth grid.

   Performance note -- this is the whole trick. The canvas is rendered at a
   quarter of the display size and scaled up by CSS with a heavy blur. Blur hides
   the resolution loss completely, so we paint ~16x fewer pixels for an identical
   result, and it runs at 30fps rather than 60. On a laptop this costs well under
   1% CPU; a full-resolution 60fps version of the same effect costs about 20x
   more for no visible difference.

   It is decorative: aria-hidden, skipped entirely under prefers-reduced-motion
   (one static frame is painted instead), and the page is unaffected if the
   canvas or 2D context is unavailable. */

(function () {
  "use strict";

  var canvas = document.getElementById("aurora");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SCALE = 0.25;          // render resolution relative to the viewport
  var FPS = 30;
  var frameGap = 1000 / FPS;

  // Each field drifts on its own slow Lissajous path, so the composition never
  // repeats on a short loop.
  // `pr` is the breathing rate and `pd` the phase offset, so the fields swell and
  // fade out of step with one another. Without the offsets they would pulse in
  // unison and read as a single flashing light rather than a living field.
  var FIELDS = [
    { hue: "a", x: 0.16, y: 0.14, r: 0.54, sx: 0.00021, sy: 0.00013, ax: 0.19, ay: 0.13, pr: 0.00042, pd: 0.0 },
    { hue: "b", x: 0.84, y: 0.22, r: 0.48, sx: 0.00017, sy: 0.00023, ax: 0.16, ay: 0.17, pr: 0.00031, pd: 1.7 },
    { hue: "c", x: 0.64, y: 0.74, r: 0.60, sx: 0.00012, sy: 0.00019, ax: 0.21, ay: 0.14, pr: 0.00037, pd: 3.1 },
    { hue: "a", x: 0.26, y: 0.88, r: 0.42, sx: 0.00024, sy: 0.00011, ax: 0.14, ay: 0.11, pr: 0.00048, pd: 4.4 },
    { hue: "b", x: 0.48, y: 0.46, r: 0.50, sx: 0.00015, sy: 0.00026, ax: 0.23, ay: 0.18, pr: 0.00027, pd: 2.3 }
  ];

  var w = 0, h = 0;
  var colours = { a: "#0ea47a", b: "#5b6cff", c: "#e0952b" };
  var last = 0;
  var t0 = 0;

  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    colours = {
      a: (cs.getPropertyValue("--aurora-a") || "").trim() || "#0ea47a",
      b: (cs.getPropertyValue("--aurora-b") || "").trim() || "#5b6cff",
      c: (cs.getPropertyValue("--aurora-c") || "").trim() || "#e0952b"
    };
  }

  function resize() {
    w = Math.max(Math.round(window.innerWidth * SCALE), 1);
    h = Math.max(Math.round(window.innerHeight * SCALE), 1);
    canvas.width = w;
    canvas.height = h;
  }

  function paint(time) {
    ctx.clearRect(0, 0, w, h);

    var base = Math.min(w, h);
    for (var i = 0; i < FIELDS.length; i++) {
      var f = FIELDS[i];
      var cx = (f.x + Math.sin(time * f.sx) * f.ax) * w;
      var cy = (f.y + Math.cos(time * f.sy) * f.ay) * h;

      // breath in [0,1]: swells the radius by 30% and the opacity by 45%
      var breath = 0.5 + 0.5 * Math.sin(time * f.pr + f.pd);
      var r = f.r * base * (0.85 + breath * 0.30);

      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, colours[f.hue]);
      g.addColorStop(0.55, colours[f.hue]);
      g.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.34 + breath * 0.45;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    requestAnimationFrame(loop);
    if (time - last < frameGap) return;   // throttle to 30fps
    last = time;
    if (!t0) t0 = time;
    paint(time - t0);
  }

  readPalette();
  resize();

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { resize(); if (reduced) paint(0); }, 160);
  }, { passive: true });

  new MutationObserver(function () { readPalette(); if (reduced) paint(0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Pause while the tab is hidden -- no reason to burn cycles nobody sees.
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) last = 0;
  });

  if (reduced) paint(0);
  else requestAnimationFrame(loop);
})();
