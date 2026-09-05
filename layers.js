/* مجسّم الطبقات — القيد في القاع.

   المجسّم يترجم جملة الافتتاح حرفياً: الثابت الذي لا يجوز كسره موضوع في
   الطبقة السفلى لا العليا. وما يُفرَض في الأعلى وحده يستطيع مسارٌ جديد أن
   يتجاوزه دون أن يلاحظ أحد — وهذه بالضبط هي العائلة التي تنتمي إليها
   المخطّطات الستّة أسفل الصفحة.

   بـCSS ثلاثي الأبعاد لا WebGL. المحرّك هنا أربع شرائح وتحويلات — وthree.js
   لهذا العمل ستّمئة كيلوبايت في مسار حرج على صفحة حجّتها أن لا شيء بلا
   مبرَّر. والنصّ يبقى في الـDOM: محرّكات النصّ في WebGL لا تشكّل الحروف
   العربية ولا تعكس اتجاهها، فتخرج مفكوكة — والمتصفّح يفعلها صحيحة.
*/
(function () {
  "use strict";

  var LAYERS = [
    { id: "ui",  name: { ar: "الواجهة", en: "Interface" },
      enforces: { ar: "تحقّق من المدخلات · يمنع الخطأ الشائع، ولا يمنع المسار الجديد",
                  en: "Input validation · stops the common mistake, not the new code path" } },
    { id: "api", name: { ar: "الخدمة", en: "Service" },
      enforces: { ar: "صلاحيات ومخطّطات · يعتمد على أن كل مسار يتذكّر أن يستدعيه",
                  en: "Authorization and schemas · relies on every path remembering to call it" } },
    { id: "tx",  name: { ar: "المعاملة", en: "Transaction" },
      enforces: { ar: "قفل صفّ وذرّية · يحلّ التزامن، ولا يحرس المعنى",
                  en: "Row locks and atomicity · solves concurrency, does not guard meaning" } },
    { id: "db",  guard: true, name: { ar: "قاعدة البيانات", en: "Database" },
      enforces: { ar: "محفّز مؤجَّل و RLS مُجبَر · لا يستطيع أي مسار — قديم أو جديد — أن يتجاوزه",
                  en: "Deferred constraint trigger and FORCEd RLS · no path, old or new, can route around it" } }
  ];

  var HINT = { ar: "اضغط طبقة", en: "Select a layer" };
  var GUARD = { ar: "هنا يقع الحارس", en: "the guard lives here" };

  function lang() { return document.documentElement.lang === "ar" ? "ar" : "en"; }
  function pick(b) { return b[lang()] !== undefined ? b[lang()] : b.en; }

  function build(host) {
    host.innerHTML = "";
    host.classList.add("stack3d");

    var scene = document.createElement("div");
    scene.className = "stack3d-scene";

    var slabs = LAYERS.map(function (l, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "slab" + (l.guard ? " slab-guard" : "");
      b.style.setProperty("--i", String(i));
      b.setAttribute("data-layer", l.id);
      b.setAttribute("aria-pressed", "false");
      var s = document.createElement("span");
      s.textContent = pick(l.name);
      b.appendChild(s);
      scene.appendChild(b);
      return b;
    });

    var note = document.createElement("figcaption");
    note.className = "stack3d-note";
    var nm = document.createElement("b");
    var en = document.createElement("span");
    en.className = "stack3d-enforces";
    var gd = document.createElement("span");
    gd.className = "stack3d-guard";
    var hint = document.createElement("span");
    hint.className = "stack3d-hint";
    note.appendChild(nm); note.appendChild(en); note.appendChild(gd);

    host.appendChild(scene);
    host.appendChild(note);
    host.appendChild(hint);

    // القاع مختارٌ ابتداءً: هو الجواب، لا مكافأةٌ لمن يستكشف.
    var active = LAYERS.length - 1;

    function paint() {
      var l = LAYERS[active];
      slabs.forEach(function (b, i) {
        b.classList.toggle("on", i === active);
        b.setAttribute("aria-pressed", i === active ? "true" : "false");
        b.firstChild.textContent = pick(LAYERS[i].name);
      });
      nm.textContent = pick(l.name);
      en.textContent = pick(l.enforces);
      gd.textContent = l.guard ? pick(GUARD) : "";
      gd.hidden = !l.guard;
      hint.textContent = pick(HINT);
    }

    slabs.forEach(function (b, i) {
      b.addEventListener("click", function () { active = i; paint(); });
      b.addEventListener("focus", function () { active = i; paint(); });
    });

    host.__relabel = paint;
    paint();
  }

  function boot() {
    var host = document.getElementById("layer-stack");
    if (host) build(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("i18n:changed", function () {
    var host = document.getElementById("layer-stack");
    if (host && host.__relabel) host.__relabel();
  });
})();
