/* «حارس المستأجر» — لماذا نجح الاختبار والعطب قائم.

   ما يُريه: ذاكرة SQLAlchemy للدوال المجهولة تُفهرِس على جسم الدالة وحده،
   ولا تتتبّع إلا متغيّرات الإغلاق. فصياغة المعامل الافتراضي _tid=tenant_id —
   وهي التي يعدّها أغلب مبرمجي بايثون الأسلم — غير مرئية لها إطلاقًا، فتُخبَز
   قيمة المستأجر الأول في الشرط ويقرأ الثاني صفوف الأول، بلا استثناء ولا
   تحذير. وصياغة الإغلاق متتبَّعة فيُعاد ربطها بكل استدعاء، والفرق سطر واحد.

   ولماذا يُختم بتصميم الاختبار لا بالإصلاح: السطر الذي يصلح العطل رخيص،
   والصعب أن تكتب تأكيدًا يسقط عند التسرّب. len(rows) > 0 ينجح على بيانات
   مسرَّبة لأن العدد اثنان في الحالتين؛ a.isdisjoint(b) وحده يفشل. */
(function () {
  "use strict";

  var EM = "var(--emerald)", AM = "var(--amber)";
  var EMS = "var(--emerald-soft)", AMS = "var(--amber-soft)";
  var INK2 = "var(--ink-2)", LINE = "var(--line)", SURF = "var(--surface-solid)";

  /* جدول ثابت: كل نصّ مرئيّ داخل الرسم له مقابلٌ بالعربية، والمعرّفات
     البرمجية وحدها تبقى لاتينية في اللغتين — اسم الدالة ليس كلمة تُترجَم.
     ولا علامة ترقيم ولا سهم في طرف نصٍّ عربيّ هنا: نصّ المخطّط مقلوبٌ إلى
     LTR بصفحة الأنماط، والمحايد الطرفيّ ينقلب معه فيظهر في الحافة الخطأ. */
  var LABELS = {
    key:      { ar: "المفتاح: جسم الدالة", en: "keys on: code object" },
    track1:   { ar: "يتتبّع ويعيد الربط", en: "tracks & rebinds:" },
    track2:   { ar: "متغيّرات الإغلاق فقط", en: "closure vars only" },
    badCap:   { ar: "معامل افتراضي", en: "default argument" },
    badNote:  { ar: "غير مرئية للذاكرة", en: "invisible to cache" },
    goodCap:  { ar: "إغلاق", en: "closure" },
    goodNote: { ar: "متتبَّعة · يُعاد ربطها", en: "tracked · rebound" },
    seesCap:  { ar: "ما يراه كل مستأجر", en: "what each tenant sees" },
    leak:     { ar: "تسرّب", en: "→ LEAK" },
    ok:       { ar: "عزل صحيح", en: "→ ok" },
    count:    { ar: "العدد اثنان في الحالتين", en: "count is 2 either way" },
    tempting: { ar: "التأكيد المُغري", en: "the tempting assertion" }
  };

  function txt(key) {
    var bi = LABELS[key];
    return document.documentElement.lang === "ar" ? bi.ar : bi.en;
  }

  /* الورقة كلّها مقيسة على 11px: صفحة الأنماط تفرض حجماً واحداً على كل نصّ
     داخل المخطّطات (‎.mech svg text‎)، وقاعدة CSS تغلب سمة font-size دائماً.
     فلا سمة حجم هنا — الإحداثيات نفسها هي التي تضمن ألّا يتراكب سطران، وكل
     سطر مقيس على 6.6 وحدة للحرف في الخطّ الأحادي. */
  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +

      /* الذاكرة: هنا أصل العطل كلّه — المفتاح جسم الدالة لا قيمها. */
      '<rect x="166" y="6" width="188" height="66" rx="8" fill="' + SURF +
        '" stroke="' + LINE + '"/>' +
      '<text x="260" y="23" text-anchor="middle" fill="var(--ink-3)">' +
        'SQLAlchemy lambda cache</text>' +
      '<text id="tg-key" class="m-t" x="260" y="37" text-anchor="middle"></text>' +
      '<text id="tg-track1" class="m-t" x="260" y="50" text-anchor="middle"></text>' +
      '<text id="tg-track2" class="m-t" x="260" y="63" text-anchor="middle"></text>' +

      /* الصياغة الأولى: معامل افتراضي — والمسافة البادئة رُسمت بإزاحة x
         لأن SVG يطوي الفراغ في مقدّمة النصّ. وحكم كل صياغة فوق صندوقها،
         لأن السطر الواحد لا يتّسع للاسم والحكم معاً بحجم 11px. */
      '<text id="tg-bad-note" x="244" y="88" text-anchor="end" font-weight="600"></text>' +
      '<rect id="tg-bad-box" x="14" y="92" width="230" height="52" rx="7"/>' +
      '<text id="tg-bad-cap" x="24" y="109" fill="var(--ink-3)"></text>' +
      '<text id="tg-bad-1" x="24" y="124">lambda cls, _tid=tenant_id:</text>' +
      '<text id="tg-bad-2" x="50" y="139">cls.tenant_id == _tid</text>' +

      /* الصياغة الثانية: إغلاق. تبقى باهتةً حتى تُذكر، فالفرق بينهما سطر. */
      '<g id="tg-good">' +
        '<text id="tg-good-note" x="244" y="158" text-anchor="end" font-weight="600"></text>' +
        '<rect id="tg-good-box" x="14" y="164" width="230" height="52" rx="7"/>' +
        '<text id="tg-good-cap" x="24" y="181" fill="var(--ink-3)"></text>' +
        '<text id="tg-good-1" x="24" y="196">lambda cls:</text>' +
        '<text id="tg-good-2" x="50" y="211">cls.tenant_id == tenant_id</text>' +
      "</g>" +

      '<path id="tg-arrow-bad" d="M244 118 L280 72" stroke-width="1.2" fill="none"/>' +
      '<path id="tg-arrow-good" d="M244 190 L280 72" stroke-width="1.2" fill="none"/>' +

      /* ما يراه كل مستأجر: العدد نفسه في الحالتين، وهذا بيت القصيد. */
      '<text id="tg-sees-cap" x="350" y="100" fill="var(--ink-3)"></text>' +
      '<rect id="tg-sees-box" x="350" y="108" width="162" height="60" rx="7"/>' +
      '<text class="m-t" x="362" y="127">tenant1 → [1, 1]</text>' +
      '<text id="tg-t2" x="362" y="143" font-weight="600"></text>' +
      '<text id="tg-verdict" x="362" y="160" font-weight="700"></text>' +
      '<text id="tg-count" x="431" y="182" text-anchor="middle"></text>' +

      /* تصميم الاختبار: التأكيد الذي يسقط عند التسرّب، لا الذي يطمئن. */
      '<g id="tg-test" class="m-hide">' +
        '<rect id="tg-test-box" x="350" y="176" width="162" height="44" rx="7"/>' +
        '<text id="tg-test-cap" x="431" y="194" text-anchor="middle" fill="var(--ink-3)"></text>' +
        '<text id="tg-test-assert" x="431" y="211" text-anchor="middle" font-weight="600"></text>' +
      "</g>" +
    "</svg>";

  /** الحالة عند كل خطوة — دالة خالصة، لا مؤقّت ولا ذاكرة. */
  function frame(step) {
    return {
      badForm: step >= 1 && step <= 2,
      leak: step === 2,
      good: step >= 3,
      test: step === 4 ? "bad" : step >= 5 ? "good" : "none"
    };
  }

  __mech.register("tenant-guard-overfit-stats", {
    title: {
      ar: "لماذا نجح الاختبار والتسرّب قائم",
      en: "Why the test passed while the leak was live"
    },
    svg: SVG,
    steps: [
      { ms: 2100, caption: {
        ar: "المستأجر الأول يطلب. الدالة المجهولة تُترجَم مرّة وتُخزَّن في ذاكرة SQLAlchemy — والمفتاح هو جسم الدالة، لا قيمها.",
        en: "Tenant 1 makes a request. The lambda is compiled once and stored in SQLAlchemy’s cache — keyed on the lambda’s code object, not on its values." } },
      { ms: 2600, fails: true, caption: {
        ar: "صياغة المعامل الافتراضي ‎_tid=tenant_id‎ — وهي ما يعتبره أغلب مبرمجي بايثون الأسلم لتفادي الإغلاق المتأخر — غير مرئية للذاكرة إطلاقًا.",
        en: "The default-argument form `_tid=tenant_id` — the one most Python developers consider the safer way to avoid late binding — is completely invisible to that cache." } },
      { ms: 2800, fails: true, caption: {
        ar: "فيصل المستأجر الثاني، وتصيب الذاكرة، وقيمة الأول ما زالت مخبوزةً في الشرط. المستأجر الثاني يقرأ صفوف الأول — بلا استثناء ولا تحذير.",
        en: "So tenant 2 arrives, the cache hits, and tenant 1’s value is still baked into the criteria. Tenant 2 reads tenant 1’s rows — with no exception and no warning." } },
      { ms: 2400, caption: {
        ar: "وصياغة الإغلاق ‎lambda cls: cls.tenant_id == tenant_id‎ متتبَّعة: الذاكرة ترى متغيّر الإغلاق وتعيد ربطه بكل استدعاء. العزل صحيح. الفرق سطر واحد.",
        en: "The closure form `lambda cls: cls.tenant_id == tenant_id` is tracked: the cache sees the closure variable and rebinds it per call. Isolation holds. The difference is one line." } },
      { ms: 2600, fails: true, caption: {
        ar: "والأصعب ليس التشخيص بل تصميم اختبار يكشفه: اختبار «كل مستأجر يرى بعض الصفوف» ينجح والعطب قائم — لأن العدد اثنان في الحالتين.",
        en: "And the hard part is not the diagnosis but designing a test that catches it: “each tenant sees some rows” passes while the leak is live — because the count is two either way." } },
      { ms: 2600, caption: {
        ar: "فاختير أن يُثبَت انفصال المجموعتين تمامًا isdisjoint، ويسبقه تأكيد أرضي بوجود صفوف الطرفين — وإلا نجح اختبار العزل على قاعدة فارغة.",
        en: "So the assertion became full set disjointness, `isdisjoint`, preceded by a ground-truth check that both tenants’ rows exist — otherwise the isolation test passes on an empty database." } }
    ],

    render: function (root, step) {
      var f = frame(step);

      root.querySelector("#tg-key").textContent = txt("key");
      root.querySelector("#tg-track1").textContent = txt("track1");
      root.querySelector("#tg-track2").textContent = txt("track2");
      root.querySelector("#tg-bad-cap").textContent = txt("badCap");
      root.querySelector("#tg-good-cap").textContent = txt("goodCap");
      root.querySelector("#tg-sees-cap").textContent = txt("seesCap");

      // الصياغة الخاطئة: تُحدَّد بالكهرماني حين تُذكر، وتُملأ به حين يقع التسرّب.
      var badBox = root.querySelector("#tg-bad-box");
      badBox.setAttribute("fill", f.leak ? AMS : SURF);
      badBox.setAttribute("stroke", f.badForm ? AM : LINE);
      var badInk = f.badForm ? AM : INK2;
      root.querySelector("#tg-bad-1").setAttribute("fill", badInk);
      root.querySelector("#tg-bad-2").setAttribute("fill", badInk);
      var badNote = root.querySelector("#tg-bad-note");
      badNote.textContent = f.badForm ? txt("badNote") : "";
      badNote.setAttribute("fill", AM);

      var goodG = root.querySelector("#tg-good");
      // لا classList.toggle على عنصر بلا صنف أصلي: نزعُ الصنف يترك
      // class="" بينما المسار المباشر لا يترك السمة إطلاقاً. الشكل واحد
      // والـHTML مختلف — ويكفي ذلك لكسر الخلوص. الكتابة الصريحة تحسمه.
      goodG.setAttribute("class", f.good ? "" : "m-dim");
      var goodBox = root.querySelector("#tg-good-box");
      goodBox.setAttribute("fill", f.good ? EMS : SURF);
      goodBox.setAttribute("stroke", f.good ? EM : LINE);
      var goodInk = f.good ? EM : INK2;
      root.querySelector("#tg-good-1").setAttribute("fill", goodInk);
      root.querySelector("#tg-good-2").setAttribute("fill", goodInk);
      var goodNote = root.querySelector("#tg-good-note");
      goodNote.textContent = f.good ? txt("goodNote") : "";
      goodNote.setAttribute("fill", EM);

      root.querySelector("#tg-arrow-bad").setAttribute("stroke", f.badForm ? AM : LINE);
      root.querySelector("#tg-arrow-good").setAttribute("stroke", f.good ? EM : LINE);

      // صفوف المستأجر الثاني: [1, 1] تعني أنه يقرأ صفوف الأول.
      var seesBox = root.querySelector("#tg-sees-box");
      seesBox.setAttribute("fill", f.leak ? AMS : f.good ? EMS : SURF);
      seesBox.setAttribute("stroke", f.leak ? AM : f.good ? EM : LINE);
      var t2 = root.querySelector("#tg-t2");
      t2.textContent = "tenant2 → " + (f.leak ? "[1, 1]" : f.good ? "[2, 2]" : "[?, ?]");
      t2.setAttribute("fill", f.leak ? AM : f.good ? EM : INK2);
      var verdict = root.querySelector("#tg-verdict");
      verdict.textContent = f.leak ? txt("leak") : f.good ? txt("ok") : "";
      verdict.setAttribute("fill", f.leak ? AM : EM);
      var count = root.querySelector("#tg-count");
      count.textContent = f.leak ? txt("count") : "";
      count.setAttribute("fill", AM);

      var testG = root.querySelector("#tg-test");
      testG.classList.toggle("m-hide", f.test === "none");
      var passes = f.test === "good";
      var testBox = root.querySelector("#tg-test-box");
      testBox.setAttribute("fill", passes ? EMS : AMS);
      testBox.setAttribute("stroke", passes ? EM : AM);
      root.querySelector("#tg-test-cap").textContent =
        passes ? "test_read_scoping.py:46" : txt("tempting");
      var assertion = root.querySelector("#tg-test-assert");
      assertion.textContent = passes ? "a.isdisjoint(b) ✓" : "len(rows) > 0  ✗";
      assertion.setAttribute("fill", passes ? EM : AM);
    }
  });
})();
