/* The paper-cut motion of the home page, the project pages and 404
   («من القصاصة للشبّاك»).

   Library: motion.min.js, a minimal build of Motion 12.23.12 holding only the
   four functions used here (animate, inView, stagger, hover), 11 KB instead
   of the 81 KB full build (tools/motion). Its animate is Motion's WAAPI-only
   one, so everything here is opacity, transform strings, clip-path and
   stroke-dashoffset, which the browser's own animation engine runs.

   Every piece is pasted once: headline words drop like cut letters; the hero
   artwork tells its story (paper dots, the idea sketched stroke by stroke, the
   cut line, the real pieces flying in from the scrap, the phone, the sticker,
   the signature); service cards are dealt, the garland swings, section
   headings are pasted on word by word, every picture is printed onto its paper
   from the top down and then its paper corners or its tape land, the two
   sheets of the shared card are taped together, the drawings are stuck on as
   they appear. A project page tells the same story about one project: its
   scrap, its title dropping word by word, its stamp landing, then every picture
   printed on its paper and every note laid down as it arrives.

   Around that, four quiet things: the hero's paper layers drift apart a little
   as the page scrolls; the drawings float a few pixels while they are on
   screen (site.css); the hero's WhatsApp button lifts once when the story
   ends; and between pages the browser carries a project's picture from its
   card into its page and back (site.css @view-transition, build_site.py).

   After the story comes the interactive layer, each
   idea in its own marked block, here and in site.css: the flags swing
   with the scroll (garland), the service icons act out what they do (icons),
   the WhatsApp buttons lean toward the pointer (magnet), the hero sways and
   breathes twice and then rests while its loose layers move away from a mouse
   (idle), the theme is cut in like a fresh sheet (theme, site.js), a pencil
   line shows how far the page has been read (pencil, site.css only), a
   project's picture tips toward the pointer (lean), and a flag's project peeks
   out beside it (peek).

   Rules: resting tilts live in site.css (the `rotate` property). The entrances
   here animate only `transform`, `clip-path` (the print) and `translate` (the
   depth), so every end state is the stylesheet's, and anything that enters in
   the page flow only moves vertically or stays inside its box, so nothing ever
   pokes out of the screen mid-entrance (tools/check_motion.py samples every
   page every ~50 ms while it moves to hold that). The interactive layer moves
   more than that (a flag's and a picture's `transform`, the hero's sway on
   `rotate`, CSS variables and a few classes), but each idea starts only once its
   own pieces have entered, keeps inside caps measured on the page (the magnet's
   paper alone reaches past its button: 8px across, about 9 on the spring's
   overshoot), stops off screen, and leaves nothing behind at rest. Elements start hidden only under
   html.motion, which the head script sets when reduced motion is off; each one
   gets .in the moment its animation starts and is never animated again, and
   keyboard focus finishes at once the entrance of whatever it lands in.
   Reduced motion, a missing library or any error: nothing is hidden and
   nothing here runs. */
(function () {
  "use strict";
  var root = document.documentElement;
  var M = window.Motion;
  function ready() { window.__craftReady = true; }
  if (!root.classList.contains("motion")) return ready();
  if (!M || !M.animate || !M.inView || !M.stagger) {
    root.classList.remove("motion");
    return ready();
  }
  var animate = M.animate, inView = M.inView, stagger = M.stagger;
  var EASE = [0.22, 1, 0.36, 1];
  var PASTE = [0.34, 1.45, 0.64, 1];
  var THUMP = [0.55, 0, 0.75, 0.2];
  // Reduced motion switched on while the page is open (the head script only read it at load): every
  // piece that keeps moving after its entrance (the hero's depth, and the ideas below) asks isCalm()
  // before it writes anything, and goes back to rest (its onCalm) the moment it changes. Chrome sends
  // no change event when .matches was read after the change and before the event would go (a loop
  // reading it every frame), so whichever comes first, the event or a read, tells every piece once.
  var calm = matchMedia("(prefers-reduced-motion: reduce)"), calmWas = calm.matches, calmFns = [];
  var isCalm = function () {
    var m = calm.matches;
    if (m !== calmWas) {
      calmWas = m;
      calmFns.forEach(function (fn) { try { fn(); } catch (err) { /* its own guard has reported it */ } });
    }
    return m;
  };
  var onCalm = function (fn) { calmFns.push(fn); };
  if (calm.addEventListener) calm.addEventListener("change", isCalm); else if (calm.addListener) calm.addListener(isCalm);
  // The hero's pieces fly from the idea scrap, which sits at the inline start.
  var X = root.getAttribute("dir") === "ltr" ? -1 : 1;
  function all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function one(sel, ctx) { return (ctx || document).querySelector(sel); }
  function list(el) { return !el ? [] : (el.length != null ? Array.prototype.slice.call(el) : [el]); }
  function seen(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  // once: what is already shown (.in) is left as it is
  function fresh(el) { return list(el).filter(function (e) { return !e.classList.contains("in"); }); }
  // returns the animation's controls (their .finished says the entrance is done), or nothing
  function play(el, kf, opt) {
    var els = fresh(el);
    if (!els.length) return;
    els.forEach(function (e) { e.classList.add("in"); });
    return animate(els, kf, opt);
  }
  // from: the starting transform; the end is always "none", the stylesheet's own state
  function t(from) { return [from, "none"]; }
  // shown at rest at once: a picture the page transition is carrying, or whatever focus lands in
  function rest(els) {
    els.forEach(function (e) {
      e.classList.add("in", "taped");
      e.getAnimations().forEach(function (a) { try { a.finish(); } catch (x) { /* an endless one */ } });
    });
  }
  // A picture is printed onto its paper from the top down. The clip reaches past its edges, so its
  // shadow is printed with it and nothing jumps when the clip goes; then its paper corners, its tape
  // and its zoom badge land (.taped, site.css). The browser's own animation, with no fill after
  // its end: the clip is gone the moment it is printed.
  var PRINT = [{ clipPath: "inset(-30px -30px 100% -30px)" }, { clipPath: "inset(-30px -30px -40px -30px)" }];
  function print(els, delay, step) {
    fresh(els).forEach(function (el, i) {
      el.classList.add("in");
      var a = el.animate(PRINT, { duration: 650, delay: (delay + i * step) * 1000, easing: "cubic-bezier(.45,0,.25,1)", fill: "backwards" });
      a.onfinish = a.oncancel = function () { el.classList.add("taped"); };
    });
  }

  try {
    // a vertical shear, not a rotation: the word tips as it drops but never gets wider
    play(all(".cut-title .w"), { opacity: [0, 1], transform: t("translateY(-42px) skewY(-7deg)") },
      { duration: 0.65, delay: stagger(0.09, { startDelay: 0.1 }), ease: PASTE });
    play(all(".hero-copy .lede, .hero-copy .hero-act, .nf-copy .lede, .nf-copy .hero-act, .pg-copy .line, .pg-copy .status-row"),
      { opacity: [0, 1], transform: t("translateY(16px)") }, { duration: 0.6, delay: stagger(0.12, { startDelay: 0.55 }), ease: EASE });
    // a project page: the idea's scrap is dropped first (straight down: it sits in the text flow)
    play(all(".pg-copy .kicker"), { opacity: [0, 1], transform: t("translateY(-16px)") }, { duration: 0.45, ease: EASE });

    var art = one(".stage");
    if (art) {
      // The real pieces fly in from the idea's scrap: each one starts at the scrap's middle (half
      // its size), so every frame of the flight is inside the artwork. Measured before anything
      // in it moves. (A fixed offset sent pieces off the side of a phone's screen.)
      var idea = one(".idea", art).getBoundingClientRect();
      var from = all(".win [data-reveal]", art).map(function (pc) {
        var r = pc.getBoundingClientRect();
        return "translate(" + (idea.left + idea.width / 2 - r.left - r.width / 2).toFixed(1) + "px," +
          (idea.top + idea.height / 2 - r.top - r.height / 2).toFixed(1) + "px) rotate(" + 24 * X + "deg) scale(.5)";
      });
      // the strokes start undrawn (pathLength=1); the mask circle starts at nothing
      all(".sk, .flow-m", art).forEach(function (p) { p.setAttribute("stroke-dasharray", "1"); p.setAttribute("stroke-dashoffset", "1"); });
      var at = function (sel, kf, delay, o) {
        var opt = { duration: 0.6, delay: delay, ease: PASTE };
        for (var k in o) opt[k] = o[k];
        play(all(sel, art), kf, opt);
      };
      // every piece lands from a little above or from inside: none starts outside the artwork
      at(".dot", { opacity: [0, 1], transform: t("scale(.55) rotate(-30deg)") }, stagger(0.12, { startDelay: 0.1 }), { duration: 0.7 });
      at(".idea", { opacity: [0, 1], transform: t("translateY(-8px) rotate(-9deg) scale(.92)") }, 0.3, { duration: 0.5 });
      at(".sk", { strokeDashoffset: [1, 0] }, stagger(0.06, { startDelay: 0.5 }), { duration: 0.28, ease: "easeInOut" });
      at(".flow-m", { strokeDashoffset: [1, 0] }, 1.2, { duration: 0.4, ease: EASE });
      at(".flow-c", { transform: ["scale(0)", "scale(1)"] }, 1.55, { duration: 0.25 });
      at(".win", { opacity: [0, 1], transform: t("translateY(22px) scale(.94)") }, 1.25, { duration: 0.55 });
      all(".win [data-reveal]", art).forEach(function (pc, i) {
        play(pc, { opacity: [0, 1], transform: t(from[i]) }, { duration: 0.6, delay: 1.4 + 0.08 * i, ease: PASTE });
      });
      at(".phone", { opacity: [0, 1], transform: t("translateY(-30px) rotate(-12deg) scale(.9)") }, 1.75);
      at(".dd", { opacity: [0, 1], transform: t("translateY(-20px) rotate(-10deg) scale(.7)") }, 1.95);
      at(".sig", { opacity: [0, 1], transform: t("translateY(-14px) rotate(8deg)") }, 2.45, { duration: 0.5 });

      // Depth: as the page scrolls, the artwork's paper layers drift apart a little, the far ones
      // (the dots, the idea) down and the near ones (the window, the phone, the signature, the
      // sticker) up, by at most 5% of its height, reached as it leaves the screen. `translate`,
      // so it adds to the entrance; each layer only drifts the way it has room in the artwork.
      // After the story a mouse over the artwork moves the loose layers too, away from it (the idle
      // idea, below, sets `aim`: where the mouse is, -1..1 from the middle, 0 once it has gone):
      // each by its own cap in px (the third number) on a 600px artwork, less on a smaller one, so
      // always inside the room it has. `cur` eases to `aim` a frame at a time, and the frames stop
      // once it is there. The flat pieces (the idea, the phone, the signature) only drift with the scroll.
      var layers = [];
      [[".d1", 0.7, 6], [".d2", 1, 6], [".d3", 0.9, 2.5], [".idea", 0.4, 0], [".win", -0.2, 4], [".phone", -0.55, 0], [".sig", -0.4, 0], [".dd-hero", -0.7, 3]]
        .forEach(function (d) { var el = one(d[0], art); if (el) layers.push([el, d[1], d[2]]); });
      var aim = [0, 0], cur = [0, 0], was = 0, last = "", queued = false, mouse = true;
      var depth = function (now) {
        queued = false;
        if (isCalm()) return;
        // The mouse's share is the idle idea's: an error in it switches only that share (and that
        // idea) off, and the layers go on drifting with the scroll alone.
        if (mouse) try {
          // the same pace at any frame rate; close enough is exactly there
          var e = was && now ? 1 - Math.pow(0.86, Math.min(4, (now - was) / 16.7)) : 0.14;
          for (var i = 0; i < 2; i++) cur[i] = Math.abs(aim[i] - cur[i]) < 0.003 ? aim[i] : cur[i] + (aim[i] - cur[i]) * e;
          var on = cur[0] !== aim[0] || cur[1] !== aim[1];
          was = on && now || 0;
          if (on) tick();
        } catch (err) {
          mouse = false; aim[0] = aim[1] = cur[0] = cur[1] = 0; was = 0;
          try { off.idle = true; } catch (x) { /* before the guards exist */ }
          if (window.console) console.warn("motion idea off: idle", err);
        }
        var r = art.getBoundingClientRect(), p = Math.min(1, Math.max(0, scrollY / (r.bottom + scrollY)));
        var k = Math.min(1, r.width / 600), key = p + " " + cur;
        if (key === last) return;
        last = key;
        // where neither moves it, nothing is written: the stylesheet's own place. The mouse's share
        // goes to a tenth of a px toward 0, so it never passes its cap
        layers.forEach(function (l) {
          var x = mouse ? Math.trunc(-cur[0] * l[2] * k * 10) / 10 : 0, m = mouse ? Math.trunc(-cur[1] * l[2] * k * 10) / 10 : 0;
          var y = (l[1] * p * 0.05 * r.height).toFixed(1);
          l[0].style.translate = p || x || m ? (x ? x.toFixed(1) + "px " : "0 ") + (m ? (+y + m).toFixed(1) : y) + "px" : "";
        });
      };
      var tick = function () { if (!queued && !isCalm()) { queued = true; requestAnimationFrame(depth); } };
      addEventListener("scroll", tick, { passive: true });
      depth();
      // reduced motion: every layer back where the stylesheet puts it, at once (and back to the
      // scroll's place when it is switched off again)
      onCalm(function () {
        aim[0] = aim[1] = cur[0] = cur[1] = 0; was = 0; last = "";
        if (isCalm()) layers.forEach(function (l) { l[0].style.translate = ""; }); else depth();
      });

      // When the story ends (the signature lands at about 3 s) the WhatsApp button lifts once
      // (site.css .cue), if it is on screen and nobody is pointing at it already: not under the
      // pointer or keyboard focus, and not leaning toward a pointer near it (.magnet, the magnet idea
      // below), so the lift never plays on top of the lean.
      var wa = one(".hero-act .btn");
      if (wa) setTimeout(function () {
        if (document.hidden || !seen(wa) || wa.matches(":hover, :focus-visible") || wa.classList.contains("magnet")) return;
        wa.addEventListener("animationend", function end(e) {
          if (e.animationName !== "cue") return;
          wa.classList.remove("cue");
          wa.removeEventListener("animationend", end);
        });
        wa.classList.add("cue");
      }, 3100);
    }

    // a section heading: its words are pasted on one after another, each from a little above
    var PASTED = { opacity: [0, 1], transform: t("translateY(-16px) skewY(-6deg)") };
    // (a long heading is pasted faster, so every heading settles in about a second)
    var pasted = function (h, delay) {
      var w = all(".pw", h);
      play(w, PASTED, { duration: 0.5, delay: stagger(Math.min(0.08, 0.48 / w.length), { startDelay: delay || 0 }), ease: PASTE });
    };
    inView(".sec-title", function (h) { pasted(h); }, { amount: 0.5 });

    inView(".svc-grid", function (g) {
      play(all(".svc", g), { opacity: [0, 1], transform: t("translateY(28px)") },
        { duration: 0.55, delay: stagger(0.06), ease: EASE });
    }, { amount: 0.15 });

    // the drawings outside the hero: stuck on as they come into view (they are aria-hidden decoration)
    inView(".dd-svc, .dd-works, .dd-cta, .dd-float, .dd-nf", function (d) {
      play(d, { opacity: [0, 1], transform: t("translateY(-30px) rotate(-12deg) scale(.7)") }, { duration: 0.6, delay: 0.25, ease: PASTE });
    }, { amount: 0.3 });
    // and every drawing floats only while it is on screen
    inView(".dd", function (d) {
      d.classList.add("afloat");
      return function () { d.classList.remove("afloat"); };
    });

    // The flags unfold down from the string (rotateX only squashes them vertically, so a
    // label never gets wider than its flag while it moves).
    inView(".garland", function (g) {
      // once every flag hangs still the garland is .settled, and only then do they swing (@idea:garland)
      var unfold = play(all("a", g), { transform: t("rotateX(80deg)") }, { duration: 0.9, delay: stagger(0.05), ease: PASTE });
      if (unfold) unfold.then(function () { g.classList.add("settled"); }); else g.classList.add("settled");
    }, { amount: 0.6 });

    // A stamp lands from a little above and a little smaller, accelerating into the paper:
    // smaller than its resting size the whole way, so its word never leaves its frame.
    var THUMPED = { opacity: [0, 1], transform: t("translateY(-18px) scale(.86)") };
    play(all(".pg-copy .stamp"), THUMPED, { duration: 0.3, delay: 1.05, ease: THUMP });
    // A project card on the home page, or a picture on a project page: the paper, then the print,
    // then the stamp on it (the hero's picture waits for its title to land). The picture a page
    // transition is carrying arrives as it is.
    inView(".proj-vis, .pg-vis", function (v) {
      var hero = v.closest(".pg-hero");
      if (root.classList.contains("vt") && one(hero ? "[data-vt]" : ".vt-on", v)) return rest(all("[data-reveal], .print, .phone-card", v));
      var d = hero ? 0.35 : 0, prints = all(".print, .phone-card", v);
      // the paper turns a little as it lands, and is smaller the whole way than it rests: a tall
      // paper on a phone never pokes past the screen's edge
      play(one(".backing", v), { opacity: [0, 1], transform: t("rotate(-3deg) scale(.9)") }, { duration: 0.6, delay: d, ease: EASE });
      print(prints, d + 0.12, 0.14);
      play(one(".scrap", v), { opacity: [0, 1], transform: t("translateY(-20px) rotate(9deg)") }, { duration: 0.5, delay: 0.45, ease: PASTE });
      play(one(".stamp", v), THUMPED, { duration: 0.3, delay: d + 0.75 + 0.14 * (prints.length - 1), ease: THUMP });
    }, { amount: 0.3 });
    // a section of a project page: its heading pasted on, then its line laid down under it
    inView(".pg-text", function (n) {
      pasted(one("h3", n));
      play(one(".line", n), { opacity: [0, 1], transform: t("translateY(16px)") }, { duration: 0.6, delay: 0.2, ease: EASE });
    }, { amount: 0.3 });
    inView(".note-card", function (n) {
      play(n, { opacity: [0, 1], transform: t("translateY(24px)") }, { duration: 0.6, ease: EASE });
    }, { amount: 0.3 });

    inView(".pair", function (p) {
      play(all(".sheet", p), { opacity: [0, 1], transform: t("translateY(40px)") },
        { duration: 0.6, delay: stagger(0.12), ease: EASE });
      print(all(".print", p), 0.15, 0.12);
      // the tape is pulled out to its length (never past it: no overshoot), once both are printed
      play(one(".pair-tape", p), { opacity: [0, 1], transform: t("scaleX(.25)") }, { duration: 0.45, delay: 0.8, ease: EASE });
      play(one(".stamp", p), THUMPED, { duration: 0.3, delay: 1.05, ease: THUMP });
    }, { amount: 0.25 });

    inView(".bubble", function (b) {
      play(b, { opacity: [0, 1], transform: t("scale(.92)") }, { duration: 0.7, ease: EASE });
      pasted(one("h2", b), 0.3);
    }, { amount: 0.3 });

    // Keyboard focus is never hidden by an entrance: what it lands in is finished at once.
    var MOVES = "[data-reveal], .print, .phone-card, .garland a";
    document.addEventListener("focusin", function (e) {
      var el = e.target, els = el.querySelectorAll ? all(MOVES, el) : [];
      for (; el && el.nodeType === 1; el = el.parentElement) if (el.matches(MOVES)) els.push(el);
      rest(els);
    });

    // A page transition: the card whose page is opening names its picture, so the browser carries
    // it into that page's hero (site.css), but only from the screen, never from off it.
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a[href]") : null, card = a && a.closest(".proj");
      if (!card || !/(^|\/)work\/[\w-]+\.html$/.test(a.getAttribute("href"))) return;
      var s = one("[data-vt]", card), o = one(".vt-on");
      if (o) o.classList.remove("vt-on");
      if (s && seen(s)) s.classList.add("vt-on");
    });

    // ── After the story: the interactive layer. Each idea owns one block
    // below and starts only once its own pieces have entered; pointer ideas run only on
    // (hover:hover) and (pointer:fine); reduced motion at load never reaches this file, and switched
    // on later stops each of them at once (calm, above). An error in one
    // idea switches that idea off, never the rest of the page: run it through idea(), and wrap
    // every handler it adds in guard(). ──
    var off = {};
    var guard = function (name, fn) {
      return function () {
        if (off[name]) return;
        try { return fn.apply(this, arguments); }
        catch (err) { off[name] = true; if (window.console) console.warn("motion idea off: " + name, err); }
      };
    };
    var idea = function (name, fn) { guard(name, fn)(); };

    // @idea:garland
    // The flags swing on their string as the page scrolls. One hand-written spring per flag, its
    // angle a and speed v (each 60 Hz frame: v += -k*a, v *= damping, a += v), pushed by how far the
    // page scrolled since the last frame, as a wave along the string in reading order: flag i feels
    // each push i*40 ms late. It writes only `transform: rotate()`, which adds to the flag's resting
    // tilt (`rotate`, site.css). A fine pointer gives the flag it enters a push of its own (and
    // site.css lifts it 2px). A flag turns at most as far as its box stays inside the garland's
    // padding box (or no further out than it already hangs at rest): 8°, less at the ends of a row,
    // measured again whenever the garland or a flag changes size (a new width, the other language).
    // Starts once the flags have unfolded (.settled), leaves a flag with keyboard focus still, stops
    // off screen, and once every flag is still again nothing it wrote is left on them.
    idea("garland", function () {
      var nav = one(".garland"), flags = nav ? all("a", nav) : [];
      if (!flags.length) return;
      var K = 0.06, DAMP = 0.9, STILL = 0.02, CAP = 8, GAIN = 0.015, KICK = 0.4, NUDGE = 1, WAVE = 40;
      var FRAME = 1000 / 60, DEG = Math.PI / 180, RO = window.ResizeObserver;
      var fine = matchMedia("(hover:hover) and (pointer:fine)");
      // per flag: the spring (a, v), its limit, what it shows now, and the next scroll push it takes
      var st = flags.map(function () { return { a: 0, v: 0, cap: 0, x: 0, css: "", next: 0 }; });
      var q = [], q0 = 0;   // the scroll's pushes, oldest first: push number q0 + k is q[k]
      var on = false, vis = false, dirty = true, raf = 0, last = 0, lastY = 0;

      var clear = function (f, s) {
        s.x = 0; s.css = "";
        f.style.transform = ""; f.style.willChange = "";
      };
      var halt = function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0; last = 0; q = [];
        st.forEach(function (s, i) { s.a = s.v = 0; s.next = q0; if (on) clear(flags[i], s); });
      };
      // every handler goes through guard(); an error also puts every flag back at rest first
      var safe = function (fn) {
        return guard("garland", function () {
          try { return fn.apply(this, arguments); }
          catch (err) { try { halt(); } catch (x) { /* keep the first error */ } throw err; }
        });
      };
      // the flags swing only once they have unfolded; the unfold leaves `transform: none` inline, and
      // from here on `transform` is the swing's
      var live = function () {
        if (!on && nav.classList.contains("settled")) {
          on = true; dirty = true; lastY = scrollY;
          flags.forEach(function (f) { if (f.style.transform === "none") f.style.transform = ""; });
        }
        return on;
      };
      // How far each flag may turn either way: its box, turned about its origin (50% 8px), stays inside
      // the garland's padding box, and a side already past it at rest gets no further. Read off the
      // turned box itself (offsetLeft rounds to whole pixels), so it holds mid-swing too.
      var measure = function () {
        dirty = false;
        var nb = nav.getBoundingClientRect(), L = nb.left + nav.clientLeft, W = nav.clientWidth;
        flags.forEach(function (f, i) {
          var s = st[i], cs = getComputedStyle(f), b = f.getBoundingClientRect(), o = cs.transformOrigin.split(" ");
          var ox = parseFloat(o[0]) || 0, oy = parseFloat(o[1]) || 0, r = (parseFloat(cs.rotate) || 0) * DEG;
          var p = r + s.x * DEG, c = Math.abs(Math.cos(p)), n = Math.abs(Math.sin(p)), det = c * c - n * n;
          var w = (b.width * c - b.height * n) / det, h = (b.height * c - b.width * n) / det;
          var X = (b.left + b.right) / 2 - L - (w / 2 - ox) * Math.cos(p) + (h / 2 - oy) * Math.sin(p);
          var sides = function (t) {
            var tc = Math.cos(t), ts = Math.sin(t), lo = Infinity, hi = -Infinity;
            [-ox, w - ox].forEach(function (x) {
              [-oy, h - oy].forEach(function (y) { var u = X + x * tc - y * ts; lo = Math.min(lo, u); hi = Math.max(hi, u); });
            });
            return [lo, hi];
          };
          var rest = sides(r), minL = Math.min(0, rest[0]), maxR = Math.max(W, rest[1]);
          var room = function (dir) {
            for (var e = 0; e < CAP; e += 0.25) {
              var t = sides(r + dir * (e + 0.25) * DEG);
              if (t[0] < minL || t[1] > maxR) return e;
            }
            return CAP;
          };
          s.cap = Math.min(room(1), room(-1));
        });
      };
      var show = function (f, s, x) {
        var css = x ? "rotate(" + x.toFixed(2) + "deg)" : "";
        s.x = x;
        if (css === s.css) return;
        if (!s.css) f.style.willChange = "transform";   // only while it moves (its paper has a drop-shadow)
        s.css = css;
        f.style.transform = css;
      };
      var tick = function (now) {
        raf = 0;
        if (!vis || isCalm()) return halt();
        if (dirty) measure();
        // the step in 60 Hz frames, so a 120 Hz screen swings at the same speed
        var hz = last ? Math.min(3, Math.max(0.25, (now - last) / FRAME)) : 1;
        last = now;
        // the page's scroll since the last frame is one push (capped: a phone flings fast), signed
        // so that it runs the way the string reads
        var y = scrollY, d = y - lastY;
        lastY = y;
        if (d) q.push({ t: now, v: (root.getAttribute("dir") === "ltr" ? -1 : 1) * Math.max(-KICK * hz, Math.min(KICK * hz, d * GAIN)) });
        var busy = false, focus = document.activeElement, low = Infinity;
        flags.forEach(function (f, i) {
          var s = st[i], due = now - i * WAVE;
          for (; s.next - q0 < q.length && q[s.next - q0].t <= due; s.next++) s.v += q[s.next - q0].v;
          if (!s.cap || (f === focus && f.matches(":focus-visible"))) s.a = s.v = 0;
          else {
            s.v += -K * s.a * hz;
            s.v *= Math.pow(DAMP, hz);
            s.a += s.v * hz;
            // shown through a soft limit (below), so past 2.5x its limit a flag only leans on it
            var m = 2.5 * s.cap;
            if (s.a > m) { s.a = m; s.v = Math.min(s.v, 0); } else if (s.a < -m) { s.a = -m; s.v = Math.max(s.v, 0); }
            if (Math.abs(s.a) < STILL && Math.abs(s.v) < STILL) s.a = s.v = 0; else busy = true;
          }
          low = Math.min(low, s.next);
          show(f, s, s.a && s.cap * Math.tanh(s.a / s.cap));
        });
        // forget the pushes every flag has felt
        if (low > q0) { q.splice(0, low - q0); q0 = low; }
        if (busy || q.length) raf = requestAnimationFrame(loop);
        else halt();
      };
      var loop = safe(tick);
      var wake = function () {
        if (raf) return;
        if (!RO) dirty = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      };

      // only while the garland is on screen
      inView(nav, safe(function () {
        vis = true; lastY = scrollY;
        return safe(function () { vis = false; halt(); });
      }));
      addEventListener("scroll", safe(function () { if (vis && !isCalm() && live()) wake(); }), { passive: true });
      flags.forEach(function (f, i) {
        f.addEventListener("pointerenter", safe(function (e) {
          if (e.pointerType === "touch" || !fine.matches || isCalm() || !vis || !live()) return;
          // pushed away from the side the pointer comes in from
          var b = f.getBoundingClientRect();
          st[i].v += (e.clientX < (b.left + b.right) / 2 ? -1 : 1) * NUDGE;
          wake();
        }));
      });
      if (RO) {
        var ro = new RO(safe(function () { dirty = true; }));
        ro.observe(nav);
        flags.forEach(function (f) { ro.observe(f); });
      }
      // back from the back/forward cache: everything at rest (a first load's pageshow, which comes
      // after a late load event, leaves a swing that has started alone)
      addEventListener("pageshow", safe(function (e) { if (!e.persisted) return; halt(); lastY = scrollY; }));
      // reduced motion switched on: every flag still at once
      onCalm(safe(function () { if (isCalm()) halt(); }));
    });
    // @end:garland

    // @idea:icons
    // Each service icon acts out what it does, once (site.css @idea:icons runs while its card has
    // .wave), and only after the cards have been dealt: on a mouse whenever a card is pointed at
    // (it plays to its end even if the pointer leaves); on a touch screen once for each icon as it
    // comes on screen, the ones that come together 120 ms apart. The class goes the moment the
    // icon's last animation ends, so nothing is left on the card at rest.
    idea("icons", function () {
      var grid = one(".svc-grid");
      if (!grid) return;
      var cards = all(".svc", grid), fine = matchMedia("(hover:hover) and (pointer:fine)");
      var dealt = false, slot = 0;
      var mine = function (c) {
        return c.getAnimations({ subtree: true }).filter(function (a) { return /^ico-/.test(a.animationName || ""); });
      };
      var wave = function (c) {
        if (c.classList.contains("wave")) return;
        c.classList.add("wave");
        if (!mine(c).length) c.classList.remove("wave"); // nothing to play: leave nothing behind
      };
      var done = guard("icons", function (e) {
        if (/^ico-/.test(e.animationName) && !mine(this).length) this.classList.remove("wave");
      });
      var point = guard("icons", function (e) {
        if (dealt && e.pointerType !== "touch" && fine.matches) wave(this);
      });
      cards.forEach(function (c) {
        c.addEventListener("animationend", done);
        c.addEventListener("animationcancel", done);
        c.addEventListener("pointerenter", point);
      });
      var queue = function (c) {
        var now = performance.now(), at = Math.max(now, slot);
        slot = at + 120;
        setTimeout(guard("icons", function () { wave(c); }), at - now);
      };
      inView(grid, guard("icons", function () {
        // the cards are dealt in this same moment (above): wait until every one has landed
        setTimeout(guard("icons", function () {
          var landing = [];
          cards.forEach(function (c) {
            c.getAnimations().forEach(function (a) { landing.push(a.finished.catch(function () {})); });
          });
          Promise.all(landing).then(guard("icons", function () {
            dealt = true;
            if (fine.matches) return;
            cards.forEach(function (c) {
              inView(one(".ico", c) || c, guard("icons", function () { queue(c); }), { amount: 0.9 });
            });
          }));
        }), 50);
      }), { amount: 0.15 });
      addEventListener("pageshow", guard("icons", function (e) {
        if (e.persisted) cards.forEach(function (c) { c.classList.remove("wave"); });
      }));
    });
    // @end:icons

    // @idea:magnet
    // The WhatsApp buttons lean toward the pointer.
    // While a fine pointer is within REACH px of one, its paper (::before), its
    // words and its icon follow the pointer, at most 8px across and 6px up or down (the spring
    // overshoots that by up to a pixel on a jump from corner to corner), and the sheet under it
    // (::after) shifts half as far the other way; the link's own box never moves (site.css
    // .magnet: this only writes --mx/--my and that class). It starts once the block the button
    // enters with has landed, and stops off screen. When the pointer leaves, the paper eases back
    // to the middle, then the class and the inline style go: at rest the page is exactly as before.
    // (The pointer and the offsets are both on the screen's own axes: the language's direction
    // never enters into it.)
    idea("magnet", function () {
      var S = all('a[href^="https://wa.me/"]').map(function (a) {
        return { a: a, vis: false, ready: false, on: false, t: 0, mx: "", my: "" };
      });
      if (!S.length) return;
      var fine = matchMedia("(hover:hover) and (pointer:fine)");
      var REACH = 40;
      // the way back is a --dur-hover transition (site.css): the class goes once it is over
      var dur = getComputedStyle(root).getPropertyValue("--dur-hover").trim();
      var BACK = (parseFloat(dur) * (/ms$/.test(dur) ? 1 : 1000) || 250) + 50;
      var px = 0, py = 0, has = false;
      var clear = function (s) {
        clearTimeout(s.t);
        s.t = 0; s.on = false; s.mx = s.my = "";
        s.a.classList.remove("magnet");
        s.a.style.removeProperty("--mx");
        s.a.style.removeProperty("--my");
        // nothing else is inline: the attribute goes too. (Set first: Chrome writes .style back to
        // the attribute only when someone reads it, and removing one it never wrote left style="".)
        if (!s.a.style.length) { s.a.setAttribute("style", ""); s.a.removeAttribute("style"); }
      };
      // every handler goes through guard(); an error also puts every button back at rest
      var g = function (fn) {
        return guard("magnet", function () {
          try { return fn.apply(this, arguments); } catch (err) { S.forEach(clear); throw err; }
        });
      };
      var put = function (s, mx, my) {
        if (mx !== s.mx) { s.mx = mx; s.a.style.setProperty("--mx", mx); }
        if (my !== s.my) { s.my = my; s.a.style.setProperty("--my", my); }
      };
      var release = function (s) {
        if (!s.on) return;
        s.on = false;
        put(s, "0px", "0px");
        s.t = setTimeout(g(function () { clear(s); }), BACK);
      };
      // the block the button enters with (its [data-reveal]: the hero's line, the closing bubble)
      // is shown, and no entrance is left running on it
      var landed = function (e) {
        return e.classList.contains("in") && !e.getAnimations().some(function (x) {
          return x.playState !== "finished" && x.effect && isFinite(x.effect.getComputedTiming().endTime);
        });
      };
      var entered = function (s) {
        if (!s.ready) {
          for (var e = s.a; e; e = e.parentElement) if (e.hasAttribute("data-reveal") && !landed(e)) return false;
          s.ready = true;
        }
        return true;
      };
      var near = function (r) {
        return r.bottom > 0 && r.top < innerHeight &&
          px > r.left - REACH && px < r.right + REACH && py > r.top - REACH && py < r.bottom + REACH;
      };
      var cap = function (v, m) { return Math.max(-m, Math.min(m, v)).toFixed(1) + "px"; };
      // measured afresh at every move: from the middle of the button to the pointer
      var update = function () {
        S.forEach(function (s) {
          if (!s.vis) return;
          var r = s.a.getBoundingClientRect();
          if (!has || !fine.matches || !near(r) || !entered(s)) return release(s);
          clearTimeout(s.t);
          put(s, cap((px - r.left - r.width / 2) * 0.18, 8), cap((py - r.top - r.height / 2) * 0.25, 6));
          if (!s.on) { s.on = true; s.a.classList.add("magnet"); }
        });
      };
      S.forEach(function (s) {
        inView(s.a, g(function () {
          s.vis = true;
          update();
          return g(function () { s.vis = false; release(s); });
        }));
      });
      document.addEventListener("pointermove", g(function (e) {
        if (e.pointerType === "touch") return;
        px = e.clientX; py = e.clientY; has = true;
        update();
      }));
      // the page scrolls under a still pointer
      addEventListener("scroll", g(function () { if (has) update(); }), { passive: true });
      // the pointer left the window, or the window lost focus
      var away = g(function () { has = false; S.forEach(release); });
      document.addEventListener("pointerout", g(function (e) { if (!e.relatedTarget) away(); }));
      addEventListener("blur", away);
      // back from the bfcache: every button at rest
      addEventListener("pageshow", g(function (e) { if (e.persisted) { has = false; S.forEach(clear); } }));
    });
    // @end:magnet

    // @idea:idle
    // The hero after its story (.stage.idle): the big rhombus sways a degree either way and the
    // small pen dots breathe (site.css), twice each and then they rest, once a visit; and while it is
    // on screen a mouse over it moves its loose paper layers away from it, a few px at most (depth(),
    // above), for as long as the visitor moves it. It starts once every entrance in the artwork has
    // finished (the signature lands at about 3 s, as the button's cue). Off screen the sway and the
    // breath hold where they are (.idle-off) and go on when it is back; once they have all ended,
    // .idle goes for good (a dot shown again after display:none would start over otherwise).
    idea("idle", function () {
      if (!art) return;
      var fine = matchMedia("(hover:hover) and (pointer:fine)"), live = false, tired = false;
      // where the scroll alone puts the layers, at once: off screen, for print, back from the cache
      var still = function () { aim[0] = aim[1] = cur[0] = cur[1] = 0; depth(); };
      setTimeout(guard("idle", function () {
        var story = art.getAnimations({ subtree: true }).filter(function (a) {
          return a.effect && isFinite(a.effect.getComputedTiming().endTime);
        });
        Promise.all(story.map(function (a) { return a.finished.catch(function () {}); })).then(guard("idle", function () {
          inView(art, guard("idle", function () {
            live = true;
            if (!tired) art.classList.add("idle");
            art.classList.remove("idle-off");
            return guard("idle", function () { live = false; if (!tired) art.classList.add("idle-off"); still(); });
          }));
        }));
      }), 3100);
      art.addEventListener("pointermove", guard("idle", function (e) {
        if (!live || e.pointerType === "touch" || !fine.matches || isCalm()) return;
        var r = art.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width * 2 - 1, y = (e.clientY - r.top) / r.height * 2 - 1;
        // a piece poking out of the artwork counts as its edge; a corner as far as an edge
        var d = Math.max(1, Math.sqrt(x * x + y * y));
        aim[0] = x / d; aim[1] = y / d;
        tick();
      }));
      art.addEventListener("pointerleave", guard("idle", function () { aim[0] = aim[1] = 0; tick(); }));
      // the last sway or breath has ended: at rest for the rest of the visit
      art.addEventListener("animationend", guard("idle", function (e) {
        if (tired || !/^idle-/.test(e.animationName)) return;
        if (art.getAnimations({ subtree: true }).some(function (a) { return /^idle-/.test(a.animationName || ""); })) return;
        tired = true;
        art.classList.remove("idle", "idle-off");
      }));
      addEventListener("beforeprint", guard("idle", still));
      addEventListener("pageshow", guard("idle", function (e) { if (e.persisted) still(); }));
    });
    // @end:idle

    // @idea:lean
    // A project's picture leans toward the pointer: it lifts the same 7px it always did and tips at
    // most 3° toward where the pointer is on it (the side under the pointer dips, as under a
    // fingertip), easing in on hover and back to rest when the pointer leaves; then its inline
    // transform is cleared, so at rest the stylesheet owns it again. The one owner of `transform` on
    // .print and .phone-card, and only once a picture is printed (.taped). The tilt follows the
    // pointer on the screen, so English needs no mirroring here; the paper corner that grows with it
    // is site.css's. Each picture's tilt is capped so that, tipped toward any corner, it stays inside
    // its parent's padding box (a phone card's row clips, and hugs its cards on a project page), and
    // inside a row that clips it top and bottom, with its tape, tipped either way (cap, below).
    // A click lays it flat at once, before the page transition names it (this listener captures,
    // so it runs before the one above), and it stays flat until the pointer leaves it; leaving the
    // page any other way (pageswap) lays it flat too.
    idea("lean", function () {
      var fine = matchMedia("(hover:hover) and (pointer:fine)");
      var LIFT = 7, TILT = 3, IN = 300, OUT = 350, FOLLOW = 100;
      var act = [], raf = 0, held = null;
      // the curve the lift has always eased on (EASE), at p
      var ease = function (p) {
        var lo = 0, hi = 1, u = p;
        for (var n = 0; n < 20; n++) {
          u = (lo + hi) / 2;
          if (3 * (1 - u) * (1 - u) * u * EASE[0] + 3 * (1 - u) * u * u * EASE[2] + u * u * u < p) lo = u; else hi = u;
        }
        return 3 * (1 - u) * (1 - u) * u * EASE[1] + 3 * (1 - u) * u * u * EASE[3] + u * u * u;
      };
      // x, y: where the pointer is on it (-.5 to .5); k: how far it is lifted (0 to 1); c: its caps
      // (cap, below): x for rotateY, up and down for rotateX on each side, and its lift in px
      var tf = function (x, y, k, c) {
        return "perspective(900px) translateY(" + (-c.lift * k).toFixed(2) + "px) rotateX(" +
          (-2 * TILT * (y > 0 ? c.up : c.down) * y).toFixed(2) + "deg) rotateY(" + (2 * TILT * c.x * x).toFixed(2) + "deg)";
      };
      var FULL = { x: 1, up: 1, down: 1, lift: LIFT };
      // The geometry the browser draws with, for the rotateX caps below. A px length or a % of `of`:
      var num = function (v, of) { return /%$/.test(v) ? parseFloat(v) / 100 * of : parseFloat(v); };
      // a box's border-box size from its computed style (offsetWidth rounds it to whole px)
      var size = function (cs) {
        var w = parseFloat(cs.width), h = parseFloat(cs.height);
        if (cs.boxSizing !== "border-box") {
          w += parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
          h += parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        }
        return [w, h];
      };
      // a box's own transforms as one matrix about its transform-origin: `translate`, `rotate`, `scale`,
      // then `transform` (or tr in its place), the order the browser applies them in
      var mat = function (cs, w, h, tr) {
        var o = cs.transformOrigin.split(" "), ox = num(o[0], w), oy = num(o[1], h), fn = "", v;
        if ((v = cs.translate) && v !== "none") fn += " translate3d(" + (v + " 0px 0px").split(" ").slice(0, 3).join(",") + ")";
        if ((v = cs.rotate) && v !== "none") {
          v = v.split(" ");
          fn += v.length === 1 ? " rotate(" + v[0] + ")" : v.length === 2 ? " rotate" + v[0].toUpperCase() + "(" + v[1] + ")" : " rotate3d(" + v.join(",") + ")";
        }
        if ((v = cs.scale) && v !== "none") { v = v.split(" "); fn += " scale3d(" + v[0] + "," + (v[1] || v[0]) + "," + (v[2] || 1) + ")"; }
        v = tr == null ? cs.transform : tr;
        if (v && v !== "none") fn += " " + v;
        return new DOMMatrix().translate(ox, oy).multiply(fn ? new DOMMatrix(fn) : new DOMMatrix()).translate(-ox, -oy);
      };
      // points through a matrix (perspective divided out), then moved by x, y
      var map = function (m, x, y, pts) {
        return pts.map(function (q) {
          var p = m.transformPoint(new DOMPoint(q[0], q[1], 0, 1));
          return [x + p.x / p.w, y + p.y / p.w];
        });
      };
      // the outline a box draws: its clip-path polygon if it has one (the phone card's torn tape), else its corners
      var shape = function (cs, w, h) {
        var cp = cs.clipPath || "", pts = [[0, 0], [w, 0], [0, h], [w, h]];
        if (/^polygon\(/.test(cp)) {
          var poly = cp.replace(/^polygon\(\s*((nonzero|evenodd)\s*,)?|\)$/g, "").split(",").map(function (s) {
            s = s.trim().split(/\s+/);
            return [num(s[0], w), num(s[1], h)];
          });
          if (poly.length > 2 && poly.every(function (q) { return isFinite(q[0]) && isFinite(q[1]); })) pts = poly;
        }
        return pts;
      };
      // Everything the picture draws, as points in its own border box's px as laid out: its corners,
      // its ::before and ::after (the phone card's tape sits 11px above it), and any child that reaches
      // out of it (a project page's zoom badge), each by its own place, size and transforms. Its
      // shadow is not counted.
      var drawn = function (el, w, h) {
        var pts = [[0, 0], [w, 0], [0, h], [w, h]], bl = el.clientLeft, bt = el.clientTop;
        var add = function (cs, x, y) {
          var d = size(cs);
          pts = pts.concat(map(mat(cs, d[0], d[1]), x, y, shape(cs, d[0], d[1])));
        };
        ["::before", "::after"].forEach(function (ps) {
          var cs = getComputedStyle(el, ps);
          if (cs.content === "none" || cs.content === "normal" || cs.display === "none") return;
          add(cs, bl + parseFloat(cs.left), bt + parseFloat(cs.top));
        });
        Array.prototype.forEach.call(el.children, function (ch) {
          if (ch.offsetParent !== el) return;
          var cs = getComputedStyle(ch), x = ch.offsetLeft, y = ch.offsetTop, d;
          if (cs.position === "absolute" && isFinite(parseFloat(cs.left)) && isFinite(parseFloat(cs.top))) {
            x = bl + parseFloat(cs.left); y = bt + parseFloat(cs.top);
          }
          d = size(cs);
          if (x < 0 || y < 0 || x + d[0] > w || y + d[1] > h) add(cs, x, y);
        });
        return pts.filter(function (q) { return isFinite(q[0]) && isFinite(q[1]); });
      };
      // the bounds of a list of points: [left, top, right, bottom]
      var span = function (pts) {
        var b = [Infinity, Infinity, -Infinity, -Infinity];
        pts.forEach(function (q) {
          b[0] = Math.min(b[0], q[0]); b[1] = Math.min(b[1], q[1]); b[2] = Math.max(b[2], q[0]); b[3] = Math.max(b[3], q[1]);
        });
        return b;
      };
      // the largest v in [0, hi] that ok() takes: hi itself when it does, else found by halving
      var most = function (hi, ok) {
        if (ok(hi)) return hi;
        for (var lo = 0, n = 0; n < 24; n++) { var mid = (lo + hi) / 2; if (ok(mid)) lo = mid; else hi = mid; }
        return lo;
      };
      // Measured on the picture itself, at rest, before it moves (no frame is drawn in between): lifted,
      // then tipped all the way toward each corner, how far it reaches past its lifted box on each side,
      // against the room its parent's padding box leaves there. That one cap is rotateY's (x).
      // Then rotateX, when an ancestor clips the picture top and bottom (a phone card's row scrolls
      // sideways, so it clips every way): its own cap for each side, so that nothing it draws comes
      // within half a px of the clip, the tape above the card included (the card's own box missed
      // it, and the tilt toward the lower half cut the tape's top). It is worked out with the
      // browser's own geometry from the computed styles (perspective included), once that geometry
      // has drawn the four corner boxes the browser just measured; where the lift alone already
      // reaches past the clip, that picture lifts only as far as there is room. A picture no ancestor
      // clips that way (one on its paper), or one that fits anyway, keeps the one cap on both axes.
      var cap = function (el) {
        var p = el.parentElement, pr = p.getBoundingClientRect(), l = pr.left + p.clientLeft, r = l + p.clientWidth, c = 1, b;
        var rest = el.getBoundingClientRect(), at = [];
        el.style.transform = tf(0, 0, 1, FULL);
        b = el.getBoundingClientRect();
        [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].forEach(function (q) {
          el.style.transform = tf(q[0], q[1], 1, FULL);
          var t = el.getBoundingClientRect();
          at.push([q, t]);
          if (t.left < b.left) c = Math.min(c, (b.left - l - 0.5) / (b.left - t.left));
          if (t.right > b.right) c = Math.min(c, (r - b.right - 0.5) / (t.right - b.right));
        });
        el.style.transform = "";
        c = Math.max(0, c);
        var s = { x: c, up: c, down: c, lift: LIFT };
        // the nearest ancestor that clips it top and bottom
        for (var a = p; a && a !== document.body && a !== root; a = a.parentElement) if (getComputedStyle(a).overflowY !== "visible") break;
        if (!a || a === document.body || a === root) return s;
        try {
          var ar = a.getBoundingClientRect(), top = ar.top + a.clientTop + 0.5, bot = ar.top + a.clientTop + a.clientHeight - 0.5;
          var cs = getComputedStyle(el), d = size(cs), w = d[0], h = d[1], box = [[0, 0], [w, 0], [0, h], [w, h]];
          var on = function (tr, pts) { return map(mat(cs, w, h, tr), 0, 0, pts); };
          // where its laid-out box sits on the screen: the browser's box at rest against the model's
          var r0 = span(on("none", box)), dx = rest.left - r0[0], dy = rest.top - r0[1], off = 0;
          at.forEach(function (v) {
            var m = span(on(tf(v[0][0], v[0][1], 1, FULL), box));
            off = Math.max(off, Math.abs(m[0] + dx - v[1].left), Math.abs(m[1] + dy - v[1].top),
              Math.abs(m[2] + dx - v[1].right), Math.abs(m[3] + dy - v[1].bottom));
          });
          if (!(off < 0.25)) throw new Error("the tilt model is " + off.toFixed(2) + "px off the browser's");
          var pts = drawn(el, w, h);
          // everything it draws inside the clip, lifted by lift and tipped toward y by cy, at x = -.5, 0 and .5
          var fits = function (y, cy, lift) {
            var t = { x: c, up: cy, down: cy, lift: lift };
            return [-0.5, 0, 0.5].every(function (x) {
              var q = span(on(tf(x, y, 1, t), pts));
              return q[1] + dy >= top && q[3] + dy <= bot;
            });
          };
          var lift = most(LIFT, function (v) { return fits(0, c, v); });
          return {
            x: c, lift: lift,
            up: most(c, function (v) { return fits(0.25, v, lift) && fits(0.5, v, lift); }),
            down: most(c, function (v) { return fits(-0.25, v, lift) && fits(-0.5, v, lift); })
          };
        } catch (err) {
          // the one cap on both axes, as before, and said out loud
          if (window.console) console.warn("lean: rotateX keeps the one cap on this picture", el, err);
          return s;
        }
      };
      var find = function (el) {
        for (var i = 0; i < act.length; i++) if (act[i].el === el) return act[i];
      };
      // (hasAttribute first: the browser writes the style attribute out lazily, and removing one it
      // has not written yet removes nothing, so an empty style="" would turn up later)
      var flat = function (s) {
        s.el.style.transform = "";
        if (!s.el.style.length && s.el.hasAttribute("style")) s.el.removeAttribute("style");
        act.splice(act.indexOf(s), 1);
      };
      var reset = function () {
        while (act.length) flat(act[0]);
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };
      // an error anywhere here lays everything flat before the guard switches this idea off
      var safe = function (fn) {
        return guard("lean", function () {
          try { return fn.apply(this, arguments); } catch (err) { reset(); throw err; }
        });
      };
      // one frame of one picture; false once it rests (or holds still under a still pointer)
      var step = function (s, now) {
        var r = s.el.getBoundingClientRect();
        // scrolled off the screen under a pointer at rest: straight back to rest
        if (!r.width || r.bottom <= 0 || r.top >= innerHeight) { flat(s); return false; }
        if (s.t0 < 0) s.t0 = now;
        var dt = s.at ? Math.min(100, now - s.at) : 0, p = Math.min(1, (now - s.t0) / (s.on ? IN : OUT)),
          e = p < 1 ? ease(p) : 1, still = false;
        s.at = now;
        if (s.on) {
          var f = 1 - Math.exp(-dt / FOLLOW),
            tx = Math.max(-0.5, Math.min(0.5, (s.cx - r.left) / r.width - 0.5)),
            ty = Math.max(-0.5, Math.min(0.5, (s.cy - r.top) / r.height - 0.5));
          s.k = s.k0 + (1 - s.k0) * e;
          s.x += (tx - s.x) * f;
          s.y += (ty - s.y) * f;
          if (Math.abs(tx - s.x) < 1e-3 && Math.abs(ty - s.y) < 1e-3) { s.x = tx; s.y = ty; still = p === 1; }
        } else {
          if (p === 1) { flat(s); return false; }
          s.k = s.k0 * (1 - e); s.x = s.x0 * (1 - e); s.y = s.y0 * (1 - e);
        }
        s.el.style.transform = tf(s.x, s.y, s.k, s.c);
        return !still;
      };
      var tick = safe(function (now) {
        if (isCalm()) return reset();
        var more = false;
        act.slice().forEach(function (s) { if (step(s, now)) more = true; });
        raf = more ? requestAnimationFrame(tick) : 0;
      });
      // the loop runs only while something moves: nothing at rest, nothing off the screen
      var kick = function () {
        if (raf) return;
        act.forEach(function (s) { s.at = 0; });
        raf = requestAnimationFrame(tick);
      };
      var aim = function (el, e) {
        if (e.pointerType === "touch" || !fine.matches || isCalm() || el === held || !el.classList.contains("taped")) return;
        var s = find(el);
        if (!s) act.push(s = { el: el, x: 0, y: 0, k: 0, c: cap(el) });
        s.cx = e.clientX;
        s.cy = e.clientY;
        if (!s.on) { s.on = true; s.k0 = s.k; s.t0 = -1; }
        kick();
      };
      var drop = function (el) {
        var s = find(el);
        if (held === el) held = null;
        if (!s || !s.on) return;
        s.on = false; s.k0 = s.k; s.x0 = s.x; s.y0 = s.y; s.t0 = -1;
        kick();
      };
      all(".print, .phone-card").forEach(function (el) {
        var over = safe(function (e) { aim(el, e); });
        el.addEventListener("pointerenter", over);
        el.addEventListener("pointermove", over);
        el.addEventListener("pointerleave", safe(function () { drop(el); }));
      });
      // the page scrolls under a pointer at rest: the picture leans to where the pointer is now
      addEventListener("scroll", safe(function () { if (act.length) kick(); }), { passive: true });
      // a click: flat at once, before anything names it for the page transition, until the pointer leaves
      document.addEventListener("click", safe(function () {
        act.forEach(function (s) { if (s.on) held = s.el; });
        reset();
      }), true);
      // leaving without a click (the browser's back button, Alt+Left, a mouse's back button): flat
      // before the browser captures the page for its transition (a project page's hero is always named)
      addEventListener("pageswap", safe(function () { held = null; reset(); }));
      // back from the next page (bfcache): everything at rest (not on a first load's pageshow)
      addEventListener("pageshow", safe(function (e) { if (!e.persisted) return; held = null; reset(); }));
      // reduced motion switched on: every picture flat at once
      onCalm(safe(function () { if (isCalm()) reset(); }));
    });
    // @end:lean

    // @idea:peek
    // A flag's project peeks out beside it: hovering a flag of «أعمالي» shows that project's first
    // picture as a small polaroid (site.css .peek), on whichever side of the flag has more room,
    // tilted toward that side and always inside the screen. A desktop with a mouse only (checked
    // again on resize), and a flag only once it has unfolded. One figure for the page, made on the
    // first hover; it fades and shrinks away when the pointer leaves, and between hovers it is
    // display:none, with no inline style and no class but its own. It comes out only once the
    // pointer has stayed on a flag for INTENT ms (leaving it, a click, Escape or a scroll that takes
    // the flag from under the pointer calls it off), and never fades in again sooner than GAP ms after
    // it last began to (a request in between waits for its turn): a pointer run quickly along the
    // flags shows nothing, a slower one at most two in any second (WCAG 2.3.1: no flashing).
    idea("peek", function () {
      var flags = all(".garland a");
      if (!flags.length) return;
      var nav = flags[0].parentNode;
      var mq = matchMedia("(hover:hover) and (pointer:fine)");
      var fits = function () { return mq.matches && !isCalm() && innerWidth >= 960; };
      var fit = fits();
      var fig = null, img = null, cur = null, quiet = null, at = null, done = [];
      var px = 0, py = 0, ticket = 0, tidyT = 0, queued = false;
      var INTENT = 150, GAP = 500, want = null, wantT = 0, ins = [-Infinity, -Infinity];
      // every handler goes through guard(); an error also takes the polaroid away first, so it is
      // never left over the flags once the guard has switched this idea off
      var safe = function (fn) {
        return guard("peek", function () {
          try { return fn.apply(this, arguments); }
          catch (err) { try { cancel(); hide(true); } catch (x) { /* keep the first error */ } throw err; }
        });
      };

      // the project the flag points to (#slug), and its first picture
      var shot = function (a) {
        var h = a.getAttribute("href") || "";
        var p = h.charAt(0) === "#" ? document.getElementById(h.slice(1)) : null;
        return p ? one(".proj-vis img", p) || one(".print img, .phone-card img", p) : null;
      };
      // its 640px copy where it has one (the <picture>'s phone source); a phone's screen is small already
      var small = function (im) {
        var sets = [[im.getAttribute("srcset"), im.getAttribute("width")]], pic = im.parentElement;
        if (pic && pic.tagName === "PICTURE") all("source", pic).forEach(function (s) { sets.push([s.getAttribute("srcset"), s.getAttribute("width")]); });
        for (var i = 0; i < sets.length; i++) {
          var cs = (sets[i][0] || "").split(",");
          for (var j = 0; j < cs.length; j++) {
            var c = cs[j].trim().split(/\s+/);
            if (c[0] && (c[1] === "640w" || (!c[1] && sets[i][1] === "640"))) return c[0];
          }
        }
        return im.currentSrc || im.src;
      };
      // a flag still unfolding (its entrance above) is left alone; once it has rested it is done
      var busy = function (a) {
        if (done.indexOf(a) >= 0 || nav.classList.contains("settled")) return false;
        if (!a.classList.contains("in") || a.getAnimations().some(function (x) {
          return !(window.CSSTransition && x instanceof CSSTransition) && !(window.CSSAnimation && x instanceof CSSAnimation);
        })) return true;
        done.push(a);
        return false;
      };

      var tidy = function () {
        clearTimeout(tidyT);
        if (cur || !fig) return;
        fig.className = "peek";
        // (read first: Chrome writes a changed inline style back lazily, and removing an unread
        // one leaves style="" behind)
        if (fig.getAttribute("style") != null) fig.removeAttribute("style");
      };
      var hide = function (now) {
        cur = null;
        if (!fig) return;
        fig.classList.remove("on");
        clearTimeout(tidyT);
        // tidied when its fade ends (transitionend below), or by this at the latest
        if (now) tidy(); else tidyT = setTimeout(safe(tidy), 700);
      };
      // Beside the flag, 14px off it, on the side with more room (the inline end when even); the
      // whole polaroid, turned (3.4deg: its 3deg and the spring's overshoot), 12px inside the screen.
      // Positioned by `translate` from wherever its own corner is, so either direction and either
      // scrollbar side come out the same.
      var place = function (r) {
        var vw = root.clientWidth, vh = root.clientHeight, w = fig.offsetWidth, h = fig.offsetHeight;
        var c = Math.cos(0.06), s = Math.sin(0.06), ex = 0.51 * (w * c + h * s), ey = 0.51 * (w * s + h * c);
        var right = vw - r.right > r.left || (vw - r.right === r.left && root.dir === "ltr");
        var x = right ? r.right + 14 + ex : r.left - 14 - ex, y = r.top + r.height / 2;
        x = Math.max(12 + ex, Math.min(x, vw - 12 - ex));
        y = Math.max(12 + ey, Math.min(y, vh - 12 - ey));
        fig.style.setProperty("--tilt", (right ? 3 : -3) + "deg");
        fig.style.translate = "";
        var b = fig.getBoundingClientRect();
        fig.style.translate = (x - b.left - b.width / 2).toFixed(1) + "px " + (y - b.top - b.height / 2).toFixed(1) + "px";
      };
      var show = function (a) {
        var im = shot(a);
        if (!im) return;
        if (!fig) {
          fig = document.createElement("figure");
          fig.className = "peek";
          fig.setAttribute("aria-hidden", "true");
          fig.setAttribute("data-mc-strict", "");
          img = document.createElement("img");
          img.alt = "";
          img.decoding = "async";
          fig.appendChild(img);
          document.body.appendChild(fig);
          fig.addEventListener("transitionend", safe(function (e) {
            if (e.target === fig && e.propertyName === "opacity" && !cur) tidy();
          }));
        }
        clearTimeout(tidyT);
        // still showing (straight from another flag) or fading: it starts again from nothing, so it
        // grows in beside every flag instead of jumping across to it
        if (fig.classList.contains("live")) {
          fig.style.transition = "none";
          fig.classList.remove("on");
          void fig.offsetWidth;
          fig.style.transition = "";
        }
        cur = a;
        at = { r: a.getBoundingClientRect(), x: scrollX, y: scrollY };
        var src = small(im), w = +im.getAttribute("width"), h = +im.getAttribute("height"), mine = ++ticket;
        // a phone's screen (taller than wide) is cut from its top to a 4:3 print
        fig.style.setProperty("--ar", (w && h ? h > w : !!im.closest(".phone-card")) ? "4/3" : "16/10");
        if (img.getAttribute("src") !== src) img.setAttribute("src", src);
        // the paper stays blank until this picture is decoded: never the last project's picture
        if (img.complete && img.naturalWidth) fig.classList.remove("wait");
        else if (img.decode) {
          fig.classList.add("wait");
          img.decode().then(safe(function () { if (mine === ticket) fig.classList.remove("wait"); }), function () { /* broken or replaced: stays blank */ });
        }
        fig.classList.add("live");
        place(at.r);
        ins = [ins[1], performance.now()];
        fig.classList.add("on");
      };
      // the flag the pointer rests on, waiting for INTENT ms and for its turn after the last fade-in
      var cancel = function () { clearTimeout(wantT); wantT = 0; want = null; };
      var fire = function () {
        wantT = 0;
        // GAP after the last one, and (by a frame or three more) never a third inside one second
        var a = want, wait = Math.max(ins[1] + GAP, ins[0] + 2 * GAP + 50) - performance.now();
        if (!a || !fit || cur === a || quiet === a) return cancel();
        if (wait > 0) { wantT = setTimeout(safe(fire), wait); return; }
        want = null;
        show(a);
      };

      var enter = function (e) {
        var a = e.currentTarget;
        px = e.clientX; py = e.clientY;
        if (e.pointerType === "touch" || !fit || cur === a || quiet === a || want === a || busy(a)) return;
        cancel();
        want = a;
        wantT = setTimeout(safe(fire), INTENT);
      };
      flags.forEach(function (a) {
        a.addEventListener("pointerenter", safe(enter));
        // (and a flag that was still unfolding when the pointer came in, once it rests)
        a.addEventListener("pointermove", safe(enter));
        a.addEventListener("pointerleave", safe(function () {
          if (quiet === a) quiet = null;
          if (want === a) cancel();
          if (cur === a) hide(false);
        }));
        // a click jumps to the project itself
        a.addEventListener("click", safe(function () { quiet = a; cancel(); hide(true); }));
      });
      document.addEventListener("keydown", safe(function (e) {
        if (e.key !== "Escape") return;
        if (want) { quiet = want; cancel(); }
        if (cur) { quiet = cur; hide(false); }
      }));
      // keyboard focus moving anywhere but the flag it belongs to (Tab to the next flag) takes it
      // away at once, so it never sits over what focus lands on; it stays away until the pointer leaves
      document.addEventListener("focusin", safe(function (e) {
        if (want && e.target !== want) { quiet = want; cancel(); }
        if (cur && e.target !== cur) { quiet = cur; hide(true); }
      }));
      // it stays with its flag while the page scrolls under a still pointer, and goes once the
      // flag has left the pointer (one frame per scroll, and only while it shows or waits)
      var follow = function () {
        queued = false;
        if (want) {
          var w = want.getBoundingClientRect();
          if (px < w.left || px > w.right || py < w.top || py > w.bottom) cancel();
        }
        if (!cur) return;
        var dx = scrollX - at.x, dy = scrollY - at.y, r = at.r;
        var box = { left: r.left - dx, right: r.right - dx, top: r.top - dy, bottom: r.bottom - dy, height: r.height };
        if (px < box.left || px > box.right || py < box.top || py > box.bottom) hide(false);
        else place(box);
      };
      addEventListener("scroll", safe(function () {
        if ((cur || want) && !queued) { queued = true; requestAnimationFrame(safe(follow)); }
      }), { passive: true });
      var refit = safe(function () { fit = fits(); cancel(); hide(true); });
      addEventListener("resize", refit);
      if (mq.addEventListener) mq.addEventListener("change", refit);
      onCalm(refit);
      // back from the bfcache: nothing showing (not on a first load's pageshow)
      addEventListener("pageshow", safe(function (e) { if (!e.persisted) return; quiet = null; cancel(); hide(true); }));
    });
    // @end:peek
  } catch (e) {
    root.classList.remove("motion");
  }
  ready();
})();
