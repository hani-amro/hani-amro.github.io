/* A rotating 3D hub: the services I connect, and the traffic moving between them.

   Nine nodes on a tilted ring around a centre. Each is a real 3D point rotated
   about Y and projected with weak perspective, so nodes at the back are drawn
   smaller and dimmer and are painted first -- a painter's-algorithm depth sort
   is enough here because nothing intersects.

   Packets travel along the spokes in both directions, because integration work
   is not one-way: a webhook arrives, a call goes out.

   Decorative: aria-hidden, one static frame under prefers-reduced-motion, and
   the animation only runs while the canvas is on screen. */

(function () {
  "use strict";

  var canvas = document.getElementById("hub");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var NODES = [
    { label: "Telegram",  tone: "b" },
    { label: "WhatsApp",  tone: "a" },
    { label: "MetaApi",   tone: "a" },
    { label: "Claude",    tone: "c" },
    { label: "Postgres",  tone: "b" },
    { label: "Stripe",    tone: "b" },
    { label: "n8n",       tone: "c" },
    { label: "Webhooks",  tone: "a" },
    { label: "S3",        tone: "b" }
  ];

  var W = 0, H = 0, dpr = 1;
  var spin = 0, target = 0;
  var tone = { a: "#0a7f5f", b: "#4457d6", c: "#9a6410", ink: "#6d777f", line: "#dfe3e1" };

  var packets = NODES.map(function (_, i) {
    return { node: i, t: Math.random(), speed: 0.004 + (i % 4) * 0.0016, out: i % 2 === 0 };
  });

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
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(r.width, 1);
    H = Math.max(r.height, 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    spin += (target - spin) * 0.05;
    var a = spin + (reduced ? 0 : time * 0.00016);

    var cx = W / 2;
    var cy = H / 2;
    var R = Math.min(W * 0.36, H * 0.62);
    var tilt = 0.40;                      // ring tilt: 0 is edge-on, 1 is flat

    // project every node once, then sort back-to-front
    var pts = NODES.map(function (nd, i) {
      var ang = (i / NODES.length) * Math.PI * 2 + a;
      var x = Math.cos(ang);
      var z = Math.sin(ang);
      var depth = (z + 1) / 2;            // 0 = far, 1 = near
      return {
        i: i,
        label: nd.label,
        col: tone[nd.tone],
        x: cx + x * R,
        y: cy + z * R * tilt,
        d: depth
      };
    }).sort(function (p, q) { return p.d - q.d; });

    // spokes
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = tone.line;
      ctx.globalAlpha = 0.35 + p.d * 0.4;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // packets in flight
    if (!reduced) {
      packets.forEach(function (pk) {
        pk.t += pk.speed;
        if (pk.t >= 1) { pk.t = 0; pk.out = !pk.out; }
      });
    }
    packets.forEach(function (pk) {
      var p = pts[pk.node % pts.length];
      var t = pk.out ? pk.t : 1 - pk.t;
      ctx.beginPath();
      ctx.arc(cx + (p.x - cx) * t, cy + (p.y - cy) * t, 2.3 + p.d * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = 0.45 + p.d * 0.5;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // nodes, back to front
    pts.forEach(function (p) {
      var r = 5 + p.d * 5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = 0.10 + p.d * 0.10;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = 0.25 + p.d * 0.5;
      ctx.fill();
      ctx.globalAlpha = 0.5 + p.d * 0.5;
      ctx.strokeStyle = p.col;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (W > 320) {
        ctx.font = (p.d > 0.55 ? "600 " : "500 ") + (10 + p.d * 2).toFixed(1) +
                   "px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = tone.ink;
        ctx.globalAlpha = 0.45 + p.d * 0.55;
        ctx.fillText(p.label, p.x, p.y + r + 15);
        ctx.globalAlpha = 1;
      }
    });

    // the hub itself, always on top
    var beat = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(time * 0.0022);
    ctx.beginPath();
    ctx.arc(cx, cy, 20 + beat * 5, 0, Math.PI * 2);
    ctx.fillStyle = tone.a;
    ctx.globalAlpha = 0.10 + beat * 0.10;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fillStyle = tone.a;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
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
      target = (ev.clientX / window.innerWidth - 0.5) * 1.4;
    }, { passive: true });
  }

  new MutationObserver(function () { palette(); if (reduced) draw(0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (reduced) {
    draw(0);
  } else if ("IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !started) { started = true; requestAnimationFrame(loop); }
    }, { threshold: 0.1 }).observe(canvas);
  } else {
    requestAnimationFrame(loop);
  }
})();
