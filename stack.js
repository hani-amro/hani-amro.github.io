/* An isometric server stack, rotating slowly. One canvas, no libraries.

   Eight slabs, one per service actually running on the box. Each is drawn as a
   real 3D quad: four corners rotated about the Y axis, projected, then painted
   top face first, then the two visible side faces, so the stack occludes itself
   correctly without a z-buffer -- painting bottom-to-top is enough because the
   slabs never intersect.

   The activity dot on each slab pulses on its own phase, so the tower reads as
   running rather than as a static diagram.

   Decorative: aria-hidden. Under prefers-reduced-motion one static frame is
   painted at a fixed angle instead of animating. */

(function () {
  "use strict";

  var canvas = document.getElementById("stack");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bottom to top, as they sit on the machine.
  var SLABS = [
    { label: "nginx  ·  TLS", tone: "b" },
    { label: "PostgreSQL 16", tone: "a" },
    { label: "Redis  ·  MinIO", tone: "a" },
    { label: "Docker Compose", tone: "b" },
    { label: "PM2  ·  5 apps", tone: "a" },
    { label: "systemd  ·  PDF API", tone: "c" },
    { label: "n8n", tone: "b" },
    { label: "cron  ·  backups", tone: "c" }
  ];

  var W = 0, H = 0, dpr = 1;
  var angle = 0.72;
  var targetAngle = 0.72;
  var tone = { a: "#0a7f5f", b: "#4457d6", c: "#9a6410", ink: "#6d777f", line: "#dfe3e1" };

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    tone = {
      a: (cs.getPropertyValue("--emerald") || "").trim() || "#0a7f5f",
      b: (cs.getPropertyValue("--indigo") || "").trim() || "#4457d6",
      c: (cs.getPropertyValue("--amber") || "").trim() || "#9a6410",
      ink: (cs.getPropertyValue("--ink-3") || "").trim() || "#6d777f",
      line: (cs.getPropertyValue("--line") || "").trim() || "#dfe3e1"
    };
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(rect.width, 1);
    H = Math.max(rect.height, 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Rotate about Y, then project isometrically.
  function project(x, y, z, a, scale, ox, oy) {
    var xr = x * Math.cos(a) - z * Math.sin(a);
    var zr = x * Math.sin(a) + z * Math.cos(a);
    return {
      x: ox + (xr - zr) * scale * 0.86,
      y: oy + (xr + zr) * scale * 0.42 - y * scale
    };
  }

  function shade(hex, amount) {
    // amount < 1 darkens, > 1 lightens. Faces need to differ or the solid reads flat.
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return hex;
    var c = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)].map(function (v) {
      return Math.max(0, Math.min(255, Math.round(v * amount)));
    });
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    angle += (targetAngle - angle) * 0.05;
    var a = angle + (reduced ? 0 : time * 0.00013);

    // Slabs are stacked upward (y grows toward the top of the screen), so the
    // origin has to sit near the FOOT of the canvas or the tower climbs out of frame.
    var scale = Math.min(W / 6.4, H / 12.2, 34);
    var ox = W * 0.68;                   // shifted right: labels need room on the left
    var oy = H * 0.84;

    var labels = [];
    var hw = 1.42;                       // half width / depth of a slab
    var th = 0.46;                       // slab thickness -- thin slabs read as flat
    var gap = 1.02;                      // vertical spacing

    for (var i = 0; i < SLABS.length; i++) {
      var s = SLABS[i];
      var y = i * gap;
      var col = tone[s.tone];

      var t = [
        project(-hw, y + th, -hw, a, scale, ox, oy),
        project( hw, y + th, -hw, a, scale, ox, oy),
        project( hw, y + th,  hw, a, scale, ox, oy),
        project(-hw, y + th,  hw, a, scale, ox, oy)
      ];
      var b = [
        project(-hw, y, -hw, a, scale, ox, oy),
        project( hw, y, -hw, a, scale, ox, oy),
        project( hw, y,  hw, a, scale, ox, oy),
        project(-hw, y,  hw, a, scale, ox, oy)
      ];

      // two front-facing sides
      ctx.beginPath();
      ctx.moveTo(t[1].x, t[1].y); ctx.lineTo(t[2].x, t[2].y);
      ctx.lineTo(b[2].x, b[2].y); ctx.lineTo(b[1].x, b[1].y);
      ctx.closePath();
      ctx.fillStyle = shade(col, 0.62);
      ctx.globalAlpha = 0.92; ctx.fill();

      ctx.beginPath();
      ctx.moveTo(t[2].x, t[2].y); ctx.lineTo(t[3].x, t[3].y);
      ctx.lineTo(b[3].x, b[3].y); ctx.lineTo(b[2].x, b[2].y);
      ctx.closePath();
      ctx.fillStyle = shade(col, 0.46);
      ctx.fill();

      // top face
      ctx.beginPath();
      ctx.moveTo(t[0].x, t[0].y);
      for (var k = 1; k < 4; k++) ctx.lineTo(t[k].x, t[k].y);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.30; ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = col; ctx.lineWidth = 1.35; ctx.stroke();
      ctx.globalAlpha = 1;

      // activity dot on the leading corner, each on its own phase
      var pulse = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(time * 0.0018 + i * 0.9);
      ctx.beginPath();
      ctx.arc(t[2].x, t[2].y, 2.4 + pulse * 1.7, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.45 + pulse * 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Anchor on the top face's centre, and remember this slab's leftmost point.
      var cxs = (t[0].x + t[1].x + t[2].x + t[3].x) / 4;
      var cys = (t[0].y + t[1].y + t[2].y + t[3].y) / 4;
      var lx = Math.min(t[0].x, t[1].x, t[2].x, t[3].x);
      labels.push({ x: cxs, y: cys, left: lx, text: s.label, col: col });
    }

    // Labels last: drawn inside the slab loop they get painted over by whichever
    // slab is stacked above them.
    if (W > 340 && labels.length) {
      // One shared gutter, taken from the leftmost point of the whole tower, so
      // the labels stay in a straight column and never ride over a slab as the
      // stack rotates.
      var gutter = labels[0].left;
      for (var m = 1; m < labels.length; m++) gutter = Math.min(gutter, labels[m].left);
      gutter -= 14;

      ctx.font = "500 11.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.textAlign = "right";
      for (var j = 0; j < labels.length; j++) {
        var L = labels[j];
        ctx.beginPath();
        ctx.moveTo(gutter + 4, L.y);
        ctx.lineTo(L.left - 3, L.y);
        ctx.strokeStyle = L.col;
        ctx.globalAlpha = 0.45; ctx.lineWidth = 1; ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = tone.ink;
        ctx.fillText(L.text, gutter, L.y + 4);
      }
    }
  }

  var t0 = 0;
  function loop(time) {
    requestAnimationFrame(loop);
    if (!t0) t0 = time;
    draw(time - t0);
  }

  palette();
  resize();

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { resize(); if (reduced) draw(0); }, 150);
  }, { passive: true });

  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (ev) {
      targetAngle = 0.72 + (ev.clientX / window.innerWidth - 0.5) * 0.9;
    }, { passive: true });
  }

  new MutationObserver(function () { palette(); if (reduced) draw(0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Only animate while on screen.
  if (reduced) {
    draw(0);
  } else if ("IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) { started = true; requestAnimationFrame(loop); }
    }, { threshold: 0.1 }).observe(canvas);
  } else {
    requestAnimationFrame(loop);
  }
})();
