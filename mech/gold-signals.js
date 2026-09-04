/* «إشارات الذهب» — لماذا لا يكفي فلتر مكتوب باليد.

   ما يُريه: الاستعلام الجذر مفلتَر صحيحًا، ثم سطرٌ واحد لا يبدو استعلامًا
   (rec.events) يجعل SQLAlchemy تُصدر استعلامًا ثانيًا لم يكتبه أحد — وفلترٌ
   يدويّ لا يصل إلى استعلام لم يُكتب. فتعود صفوف مستأجرين آخرين بلا خطأ ولا
   استثناء ولا سطر سجل، وعدد الصفوف يبدو معقولًا. هذا هو العطل الذي لا يُرى.

   ثم الحلّ: مستمع على do_orm_execute يحقن الشرط في كل SELECT، وinclude_aliases
   هو الفرق العملي لا تفصيلة إعداد — بدونه يُفلتَر الجذر وحده ويبقى المنفذ نفسه
   مفتوحًا. ولذلك تُفرد له الخطوة الخامسة وحدها.

   ولماذا تُختم بخطوة فاشلة: الحارس fail-open، و١٦ موضعًا تتجاوزه. حدٌّ مذكور
   في المخطّط أصدقُ من ادّعاء حماية كاملة — ومن أخفى حدّه خسر الثقة عند أول
   ثغرة يجدها القارئ بنفسه. */
(function () {
  "use strict";

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      // ثلاثة أعمدة: ما كتبتَه، وما صدر فعلًا، وما عاد. الفجوة بين الأول
      // والثاني هي كل الحكاية.
      '<text id="g-h1" x="14" y="16" font-size="9" fill="var(--ink-3)"></text>' +
      '<text id="g-h2" x="196" y="16" font-size="9" fill="var(--ink-3)"></text>' +
      '<text id="g-h3" x="416" y="16" font-size="9" fill="var(--ink-3)"></text>' +

      // الاستعلام الجذر — ثابت في كل الخطوات: هو الجزء الذي لم يعطب قطّ.
      '<rect class="m-box m-fill" x="14" y="26" width="164" height="36" rx="7"/>' +
      '<text class="m-t" x="24" y="48" font-size="9.5">session.query(Rec)</text>' +
      '<rect class="m-box m-fill m-ok m-f" x="196" y="26" width="212" height="36" rx="7"/>' +
      '<text class="m-t" x="206" y="42" font-size="9">SELECT … FROM recs</text>' +
      '<text class="m-ok" x="206" y="55" font-size="9">WHERE tenant_id = 1 ✓</text>' +
      '<text class="m-ok" x="416" y="48" font-size="10">t1 ✓</text>' +

      // قراءة العلاقة الكسولة: سطرٌ في العمود الأيسر، واستعلامٌ كامل في الأوسط.
      '<g id="g-lazy">' +
        '<rect class="m-box m-fill" x="14" y="86" width="164" height="36" rx="7"/>' +
        '<text class="m-t" x="24" y="108" font-size="9.5">rec.events</text>' +
        '<text id="g-hint" x="96" y="132" font-size="8.5" text-anchor="middle" ' +
          'fill="var(--ink-3)"></text>' +
        '<rect id="g-lazysql" class="m-box m-fill" x="196" y="86" width="212" height="36" rx="7"/>' +
        '<text class="m-t" x="206" y="102" font-size="9">SELECT … FROM events</text>' +
        '<text id="g-lazywhere" x="206" y="115" font-size="9" fill="var(--ink-3)"></text>' +
        '<text id="g-lazyrows" x="416" y="108" font-size="9.5" fill="var(--ink-3)"></text>' +
      "</g>" +
      // العطل الصامت يحتاج أن يُكتب صراحةً، وإلا قرأه الناظر نجاحًا.
      '<text id="g-noerr" class="m-warn" x="416" y="122" font-size="8.5"></text>' +

      // الطبقة المحقونة داخل المحرّك — تحت عمود الـSQL لأنها تعمل عليه.
      // والمُزخرِف مقطوع سطرين لا سطراً واحداً مصغَّراً: اسم الحدث هو المقصود،
      // وتصغيره حتى يتّسع كان سيجعله أصغر من كل نصّ آخر في المخطّط.
      '<rect id="g-listen" class="m-box m-fill m-dash" x="196" y="136" width="212" ' +
        'height="44" rx="7"/>' +
      '<text class="m-t" x="302" y="149" font-size="8.5" text-anchor="middle">' +
        '@listens_for(Session,</text>' +
      '<text class="m-t" x="302" y="161" font-size="8.5" text-anchor="middle">' +
        '"do_orm_execute")</text>' +
      '<text id="g-alias" x="302" y="174" font-size="9" text-anchor="middle" ' +
        'fill="var(--ink-3)">include_aliases=True</text>' +

      // طبقة الكتابة تحت عمود الكود: الكتابة العابرة ضرر لا يُلغى، فتُرفَض لا تُفلتَر.
      '<rect id="g-write" class="m-box m-fill m-dash" x="14" y="146" width="164" ' +
        'height="34" rx="7"/>' +
      '<text class="m-t" x="96" y="161" font-size="9" text-anchor="middle">before_flush</text>' +
      '<text id="g-raise" x="96" y="174" font-size="9" text-anchor="middle" ' +
        'fill="var(--ink-3)">raise CrossTenantWrite</text>' +

      // شريط الحدّ: يظهر أخيرًا ليقول إنّ الحماية ليست تامّة. وسطران لا سطر:
      // «يفشل مفتوحاً» و«١٦ موضعاً تتجاوزه» حدّان مختلفان لا جملة واحدة.
      '<rect id="g-limitbox" class="m-box m-fill m-hide" x="14" y="186" width="394" ' +
        'height="34" rx="6"/>' +
      '<text id="g-limit1" class="m-warn" x="211" y="199" font-size="8.5" ' +
        'text-anchor="middle"></text>' +
      '<text id="g-limit2" class="m-warn" x="211" y="212" font-size="8.5" ' +
        'text-anchor="middle"></text>' +
    "</svg>";

  /** الحالة عند كل خطوة — دالة خالصة، لا مؤقّت ولا ذاكرة. */
  function frame(step) {
    return {
      lazy: step >= 1,
      leak: step === 2,
      guard: step >= 3,
      alias: step >= 4,
      write: step >= 5,
      limit: step >= 6
    };
  }

  var NEUTRAL = "m-box m-fill";

  __mech.register("gold-signals", {
    title: {
      ar: "لماذا لا يكفي فلتر مكتوب باليد",
      en: "Why a hand-written filter is not enough"
    },
    svg: SVG,
    steps: [
      { ms: 2000, caption: {
        ar: "الاستعلام الجذر مفلتَر صحيحًا: توصيات العميل ١ وحدها. حتى هنا كل شيء سليم.",
        en: "The root query is filtered correctly: tenant 1’s recommendations only. So far, all is well." } },
      { ms: 2400, caption: {
        ar: "ثم يقرأ الكود rec.events — سطر لا يبدو استعلامًا. وSQLAlchemy تُصدر له استعلامًا ثانيًا لم يكتبه أحد.",
        en: "Then the code reads rec.events — a line that does not look like a query. SQLAlchemy issues a second query for it that nobody wrote." } },
      { ms: 2600, fails: true, caption: {
        ar: "والفلتر اليدوي لا يصل إلى استعلام لم يُكتب. تعود أحداث كل العملاء — بلا خطأ ولا استثناء ولا سطر سجل، وعدد الصفوف يبدو معقولًا تمامًا.",
        en: "And a hand-written filter cannot reach a query nobody wrote. Every tenant’s events come back — no error, no exception, no log line, and the row count looks perfectly reasonable." } },
      { ms: 2300, caption: {
        ar: "الحل ينقل الفلتر من انضباط الكاتب إلى محرّك الـORM: مستمع على do_orm_execute يحقن الشرط في كل SELECT قبل تنفيذه.",
        en: "The fix moves the filter out of the writer’s discipline and into the ORM engine: a listener on do_orm_execute injects the condition into every SELECT before it runs." } },
      { ms: 2400, caption: {
        ar: "و include_aliases=True هو الفرق العملي: بدونه يُفلتَر الجذر وحده وتُفلت العلاقات الكسولة — أي المنفذ نفسه يبقى مفتوحًا.",
        en: "And include_aliases=True is what makes it real: without it only the root is filtered and the lazy relationships slip through — the very same hole, still open." } },
      { ms: 2200, caption: {
        ar: "وطبقة ثانية على الكتابة: كتابة عابرة للمستأجرين ترفع CrossTenantWrite بدل أن تُمرَّر — لأن نشر بيانات عميل في قناة عميل آخر ضرر لا يُلغى.",
        en: "And a second layer on writes: a cross-tenant write raises CrossTenantWrite instead of being let through — because publishing one client’s data into another’s channel cannot be undone." } },
      { ms: 2400, fails: true, caption: {
        ar: "والحدّ مذكور لا مخفيّ: جلسة بلا مستأجر مضبوط تخرج بلا فلترة، و١٦ موضعًا في ٧ ملفات تفتح جلسة مباشرةً خارج هذه الحماية.",
        en: "And the limit is stated, not hidden: a session with no tenant set exits unfiltered, and 16 call sites across 7 files open a session directly, outside this protection." } }
    ],

    render: function (root, step) {
      var f = frame(step);
      var ar = document.documentElement.lang === "ar";

      root.querySelector("#g-h1").textContent = ar ? "كودك" : "your code";
      root.querySelector("#g-h2").textContent = ar ? "ما صدر فعلًا" : "SQL actually emitted";
      root.querySelector("#g-h3").textContent = ar ? "الصفوف العائدة" : "rows back";

      // العلاقة الكسولة باهتة قبل أن تُقرأ: الخطوة الأولى عن الجذر وحده.
      root.querySelector("#g-lazy").setAttribute("class", f.lazy ? "" : "m-dim");
      root.querySelector("#g-hint").textContent =
        f.lazy ? (ar ? "لا يبدو استعلامًا" : "does not look like a query") : "";

      // صندوق الاستعلام الثاني: محايد قبل القراءة، محذِّر عند التسرّب،
      // أخضر حين يصله الشرط المحقون.
      root.querySelector("#g-lazysql").setAttribute(
        "class", NEUTRAL + (f.leak ? " m-warn m-f" : f.alias ? " m-ok m-f" : ""));

      var where = root.querySelector("#g-lazywhere");
      if (f.leak) {
        where.setAttribute("class", "m-warn");
        where.textContent = "WHERE rec_id = 7   ← " + (ar ? "بلا مستأجر" : "no tenant");
      } else if (f.alias) {
        where.setAttribute("class", "m-ok");
        where.textContent = "WHERE tenant_id = 1 ← " + (ar ? "محقون" : "injected");
      } else {
        where.setAttribute("class", "");
        where.textContent = "WHERE rec_id = 7";
      }

      var rows = root.querySelector("#g-lazyrows");
      if (f.leak) {
        rows.setAttribute("class", "m-warn");
        rows.textContent = "t1 ✓  t2 ✗  t3 ✗";
      } else if (f.alias) {
        rows.setAttribute("class", "m-ok");
        rows.textContent = "t1 ✓";
      } else {
        rows.setAttribute("class", "");
        rows.textContent = f.lazy ? "…" : "";
      }

      var noerr = root.querySelector("#g-noerr");
      noerr.textContent = f.leak ? (ar ? "لا خطأ ولا سجل" : "no error raised") : "";

      // المستمع مرسوم متقطّعًا قبل أن يوجد: مكانٌ محجوز لا حارس قائم.
      root.querySelector("#g-listen").setAttribute(
        "class", NEUTRAL + (f.guard ? " m-ok m-f" : " m-dash"));
      var alias = root.querySelector("#g-alias");
      alias.setAttribute("class", f.alias ? "m-ok" : "");
      alias.setAttribute("font-weight", f.alias ? "700" : "400");

      root.querySelector("#g-write").setAttribute(
        "class", NEUTRAL + (f.write ? " m-ok m-f" : " m-dash"));
      root.querySelector("#g-raise").setAttribute("class", f.write ? "m-ok" : "");

      root.querySelector("#g-limitbox").setAttribute(
        "class", NEUTRAL + (f.limit ? " m-warn m-f" : " m-hide"));
      root.querySelector("#g-limit1").textContent = f.limit
        ? (ar ? "جلسة بلا مستأجر تخرج بلا فلترة" : "no tenant on session → fail-open")
        : "";
      root.querySelector("#g-limit2").textContent = f.limit
        ? (ar ? "١٦ موضعًا في ٧ ملفات تتجاوز هذه الحماية"
          : "16 call sites in 7 files bypass this")
        : "";
    }
  });
})();
