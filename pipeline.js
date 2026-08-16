/* A 3D automation pipeline, rendered on a 2D canvas with a hand-written projection.
   No libraries: ~7KB, one draw loop, no layout thrash.

   What it shows is the real thing this site is about -- a signal entering a pipeline,
   being parsed, validated, executed and monitored. Packets that fail validation are
   dropped at the gate rather than passed downstream, which is the same rule the
   production systems follow: the model proposes, deterministic code decides.

   Accessibility: it is decorative and aria-hidden. Under prefers-reduced-motion it
   renders one static frame instead of animating. If the canvas or 2D context is
   unavailable the hero is unaffected -- the element simply stays empty. */

(function () {
  "use strict";

  var canvas = document.getElementById("pipeline");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- scene ------------------------------------------------------------
  // Five stages, laid out along z so they recede from the camera.
  var STAGES = [
    { label: "signal",   x: -2.45, y:  0.00, z:  0.55 },
    { label: "parse",    x: -1.22, y:  0.40, z:  0.05 },
    { label: "validate", x:  0.00, y: -0.18, z: -0.30 },
    { label: "execute",  x:  1.22, y:  0.34, z: -0.05 },
    { label: "monitor",  x:  2.45, y: -0.10, z:  0.45 }
  ];

  var EDGES = [[0, 1], [1, 2], [2, 3], [3, 4]];

  // A packet travels edge by edge. ~1 in 5 is malformed and is dropped at
  // `validate` -- the gate is the point of the whole picture.
  var packets = [];
  var PACKET_COUNT = 7;

  for (var i = 0; i < PACKET_COUNT; i++) {
    packets.push({
      edge: i % EDGES.length,
      t: i / PACKET_COUNT,
      speed: 0.0022 + (i % 3) * 0.0006,
      valid: i % 5 !== 0,
      dying: 0
    });
  }

  var w = 0, h = 0, dpr = 1, cx = 0, cy = 0, scale = 1;
  var tilt = 0, targetTilt = 0;
  var t0 = 0;

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    return {
      node: cs.getPropertyValue("--accent").trim() || "#0f5c4a",
      line: cs.getPropertyValue("--line").trim() || "#e3e1dd",
      ink: cs.getPropertyValue("--ink-3").trim() || "#7b8189",
      bad: cs.getPropertyValue("--pilot").trim() || "#8a5a12"
    };
  }
  var C = palette();

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(rect.width, 1);
    h = Math.max(rect.height, 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    // Keep the whole pipeline inside narrow viewports.
    scale = Math.min(w / 6.6, 96);
  }

  // Weak perspective: a point further away (larger z toward the camera) is
  // drawn larger. Cheap, stable, and enough to read as depth.
  function project(p) {
    var a = tilt;
    var xr = p.x * Math.cos(a) - p.z * Math.sin(a);
    var zr = p.x * Math.sin(a) + p.z * Math.cos(a);
    var depth = 1 / (2.6 - zr * 0.55);
    return {
      x: cx + xr * scale * depth * 2.6,
      y: cy + p.y * scale * depth * 2.6,
      d: depth
    };
  }

  function lerp(a, b, k) { return a + (b - a) * k; }

  function drawFrame(time) {
    ctx.clearRect(0, 0, w, h);

    tilt = lerp(tilt, targetTilt, 0.06);
    var wave = reduced ? 0 : time * 0.00035;

    // stage positions, with a slow bob so the scene never looks frozen
    var pts = STAGES.map(function (s, i) {
      return project({
        x: s.x,
        y: s.y + (reduced ? 0 : Math.sin(wave + i * 1.1) * 0.07),
        z: s.z
      });
    });

    // ---- edges ----
    ctx.lineCap = "round";
    EDGES.forEach(function (e) {
      var a = pts[e[0]], b = pts[e[1]];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // ---- packets ----
    packets.forEach(function (p) {
      if (!reduced) {
        if (p.dying > 0) {
          p.dying -= 0.02;
          if (p.dying <= 0) {           // respawn at the head of the pipeline
            p.dying = 0;
            p.edge = 0;
            p.t = 0;
            p.valid = Math.random() > 0.2;
          }
        } else {
          p.t += p.speed * 60 / 60;
          if (p.t >= 1) {
            p.t = 0;
            // A malformed packet is stopped at `validate` (end of edge index 1)
            if (!p.valid && p.edge === 1) {
              p.dying = 1;
            } else {
              p.edge = (p.edge + 1) % EDGES.length;
              if (p.edge === 0) p.valid = Math.random() > 0.2;
            }
          }
        }
      }

      var e = EDGES[p.edge];
      var a = pts[e[0]], b = pts[e[1]];
      var x = a.x + (b.x - a.x) * p.t;
      var y = a.y + (b.y - a.y) * p.t;
      var d = a.d + (b.d - a.d) * p.t;

      if (p.dying > 0) {
        // dropped at the gate: fades and falls, never reaches `execute`
        ctx.globalAlpha = p.dying * 0.85;
        ctx.fillStyle = C.bad;
        ctx.beginPath();
        ctx.arc(x, y + (1 - p.dying) * 26, 3.1 * d * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return;
      }

      ctx.fillStyle = C.node;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(x, y, 3.4 * d * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // ---- nodes ----
    pts.forEach(function (pt, i) {
      var r = 7.5 * pt.d * 2.4;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r + 5, 0, Math.PI * 2);
      ctx.fillStyle = C.node;
      ctx.globalAlpha = 0.10;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = i === 2 ? C.node : "transparent";
      ctx.strokeStyle = C.node;
      ctx.lineWidth = 2;
      if (i === 2) ctx.fill();          // the validation gate is the solid one
      ctx.stroke();

      ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = C.ink;
      ctx.fillText(STAGES[i].label, pt.x, pt.y + r + 17);
    });
  }

  function loop(time) {
    if (!t0) t0 = time;
    drawFrame(time - t0);
    requestAnimationFrame(loop);
  }

  // ---- wiring ------------------------------------------------------------
  resize();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); if (reduced) drawFrame(0); }, 120);
  });

  // Pointer nudges the camera. Touch devices get the idle sway instead.
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (ev) {
      targetTilt = (ev.clientX / window.innerWidth - 0.5) * 0.5;
    }, { passive: true });
  }

  // Repaint on theme change so the scene follows the palette.
  new MutationObserver(function () { C = palette(); if (reduced) drawFrame(0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (reduced) {
    drawFrame(0);
  } else {
    requestAnimationFrame(loop);
  }
})();
