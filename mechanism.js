/* مشغّل مخطّطات الآليات.

   الفكرة: كل مشروع هنا يُباع بجملة عن أمان أو صحّة. والجملة وحدها لا تُصدَّق،
   والكود وحده لا يُقرأ في ستّ ثوانٍ. فالمخطّط يُري **العطل يقع أولاً**، ثم
   الآلية التي تمنعه. من رأى الفشل يحدث يفهم لماذا الحارس موجود؛ ومن قرأ
   «محميّ بقيد مؤجَّل» لم يفهم شيئاً.

   البنية: كل مخطّط دالةٌ خالصة من رقم الخطوة. لا مؤقّت فيه ولا حالة — المشغّل
   وحده يملك التوقيت. ولذلك تتصرّف المخطّطات الستّة تصرّفاً واحداً ولا تختلف
   إلا في محتواها، ويمكن تقديمها وإرجاعها وإيقافها بلا أن يعرف المخطّط شيئاً.

   ولا مكتبة: SVG خام وانتقالات CSS. المخطّط الواحد أقلّ من عشرة كيلوبايتات،
   ومكتبة رسوم متحرّكة لهذا العمل تكلّف أضعافه على صفحة أطروحتها أن لا شيء
   بلا مبرَّر.

   التسجيل:
     __mech.register('slug', {
       title:  { ar, en },
       steps:  [ { caption:{ar,en}, ms, fails? }, … ],
       svg:    '<svg …>…</svg>',      // ثابت، يُبنى مرّة
       render: function (root, step) { … }   // يضبط الحالة لهذه الخطوة
     });

   التركيب: <figure data-mechanism="slug"></figure>
*/
(function () {
  "use strict";

  var REG = {};
  var VIEWBOX = "0 0 520 230";

  window.__mech = {
    register: function (slug, def) { REG[slug] = def; },
    // منفذ فحص. الخلوص هنا شرطٌ لا تفصيل: المشغّل يعيد step إلى صفر عند
    // الإعادة، فمخطّطٌ يقرأ ما رسمه سابقاً يعرض إطاراً لا يوافق خطوته.
    // وقد وقع هذا فعلاً في سُلَّم التاجر. tools/check_mechanisms.py يفحصه.
    _slugs: function () { return Object.keys(REG); },
    _get: function (slug) { return REG[slug]; }
  };

  function lang() {
    return document.documentElement.lang === "ar" ? "ar" : "en";
  }

  function pick(bi) {
    return bi && (bi[lang()] !== undefined ? bi[lang()] : bi.en) || "";
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  var motionOK = true;
  try {
    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionOK = !mq.matches;
    if (mq.addEventListener) mq.addEventListener("change", function (e) { motionOK = !e.matches; });
  } catch (e) {}

  function mount(host) {
    var slug = host.getAttribute("data-mechanism");
    var def = REG[slug];
    // مخطّط غير مسجَّل: لا هيكل فارغ ولا زرّ لا يفعل شيئاً. الغياب يُترك غياباً.
    if (!def) { host.remove(); return; }

    host.classList.add("mech");
    host.innerHTML = "";

    var head = el("div", "mech-head");
    var title = el("b", null, pick(def.title));
    var btn = el("button", "mech-btn");
    btn.type = "button";
    head.appendChild(title);
    head.appendChild(btn);

    var stage = el("div", "mech-stage");
    stage.innerHTML = def.svg;
    var svg = stage.querySelector("svg");
    if (svg) {
      svg.setAttribute("viewBox", VIEWBOX);
      svg.setAttribute("role", "img");
      // المخطّط دائماً LTR: تسلسل الآلية ليس نصّاً ولا ينقلب مع اللغة.
      // السهم فيه يعني «ثم»، لا «إلى اليمين».
      svg.setAttribute("dir", "ltr");
    }

    var bar = el("div", "mech-bar");
    var segs = def.steps.map(function (s) {
      var seg = el("i", s.fails ? "fails" : null);
      bar.appendChild(seg);
      return seg;
    });

    var cap = el("p", "mech-cap");
    cap.setAttribute("aria-live", "polite");

    host.appendChild(head);
    host.appendChild(stage);
    host.appendChild(bar);
    host.appendChild(cap);

    var step = 0;
    var timer = null;
    var playing = false;
    var last = def.steps.length - 1;

    function paint() {
      if (def.render) def.render(stage, step);
      segs.forEach(function (seg, i) { seg.classList.toggle("on", i <= step); });
      cap.textContent = pick(def.steps[step].caption);
      if (svg) svg.setAttribute("aria-label", pick(def.title) + " — " + pick(def.steps[step].caption));
    }

    function stop() {
      playing = false;
      clearTimeout(timer);
      timer = null;
      setBtn();
    }

    function tick() {
      if (step >= last) { stop(); return; }
      step++;
      paint();
      // لا يعيد نفسه إلى الأبد: مخطّطٌ دائرٌ يسرق الانتباه من النصّ المجاور،
      // ومن أراد الإعادة فالزرّ أمامه.
      timer = setTimeout(tick, def.steps[step].ms || 1600);
    }

    function play() {
      if (step >= last) { step = 0; paint(); }
      playing = true;
      setBtn();
      timer = setTimeout(tick, def.steps[step].ms || 1600);
    }

    function setBtn() {
      var ar = lang() === "ar";
      var label = playing ? (ar ? "إيقاف" : "Pause")
        : step >= last ? (ar ? "إعادة" : "Replay")
          : (ar ? "تشغيل" : "Play");
      btn.textContent = label;
      btn.setAttribute("aria-label", label + " — " + pick(def.title));
    }

    btn.addEventListener("click", function () {
      if (playing) stop(); else play();
    });

    // الحركة هنا توضيح لا محتوى: من أوقف الحركة يرى الإطار الأخير وكل
    // الخطوات مكتوبةً بالترتيب، فلا يفقد شيئاً من المعنى.
    if (!motionOK) {
      step = last;
      paint();
      btn.remove();
      var ol = el("ol", "mech-steps");
      def.steps.forEach(function (s) { ol.appendChild(el("li", null, pick(s.caption))); });
      host.appendChild(ol);
      cap.remove();
      return;
    }

    paint();
    setBtn();

    var started = false;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) { started = true; play(); io.disconnect(); }
        });
      }, { rootMargin: "-15% 0px -15% 0px" });
      io.observe(host);
    }

    host.__mechRelabel = function () { paint(); setBtn(); title.textContent = pick(def.title); };
  }

  function boot() {
    var hosts = document.querySelectorAll("[data-mechanism]");

    // التأجيل بُني لستّ مخطّطات على صفحة واحدة: ستّ شجرات SVG وستّ رسمات
    // أولى في مسار حرج لا يرى الزائر منه شيئاً — قِيس TBT عند 240ms، وهو
    // الرقم نفسه الذي أسقط بوابة الإطلاق في «وين».
    //
    // وذلك التجمّع لم يعد قائماً: كل صفحة مشروع تحمل مخطّطها وحده. والتأجيل
    // على صفحةٍ واحدةِ المخطّط يقلب نفسه عيباً: الـfigure فارغةٌ عند أول
    // رسمة ثم تتمدّد عند التركيب، فتدفع كل ما تحتها. مقيسٌ على الحيّ:
    // CLS صار 0.054 على «وين» و0.200 على المكتبتين بعد أن كان صفراً — ولم
    // يظهر قبلها إلا لأن المخطّط كان بعيداً تحت الطيّة فلا يُركَّب أصلاً.
    //
    // فيُركَّب فوراً حين يكون واحداً أو اثنين، ويبقى التأجيل للتجمّع.
    if (!("IntersectionObserver" in window) || hosts.length <= 2) {
      Array.prototype.forEach.call(hosts, mount);
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        mount(en.target);
      });
    }, { rootMargin: "300px 0px" });
    Array.prototype.forEach.call(hosts, function (h) { io.observe(h); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // اللغة تتبدّل بلا إعادة تحميل، فالنصّ داخل المخطّطات يتبدّل معها.
  document.addEventListener("i18n:changed", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".mech"), function (h) {
      if (h.__mechRelabel) h.__mechRelabel();
    });
  });
})();
