/* «ياسمين» — لماذا لا يُقاس الامتناع بمطابقة نصّية.

   ما يُريه: المنتج المُباع هنا هو الامتناع نفسه، والكشف القديم مطابقةٌ على
   أول ١٥ حرفًا من جملةٍ يحرّرها المستأجر من لوحته. فتعديل كلمة واحدة يجعل
   تقرير الفجوات يقول «صفر فجوة» وهي مئة — بلا خطأ ولا تحذير ولا سطر سجل.

   ثم الإصلاح، وهو إضافة لا استبدال: علامة بنيوية يُصدرها النموذج تحسم أولًا
   وتوسم sentinel، والمطابقة القديمة تبقى ارتدادًا موسومًا legacy — لأن امتثال
   النموذج غير مضمون، واستبدال هشاشة بهشاشة ليس إصلاحًا.

   ولماذا عمودٌ في قاعدة البيانات لا عدّادٌ في الذاكرة: ما لا يُكتب مع كل ردّ
   لا يُستعلَم عنه بعد شهر. الخطوة الأخيرة تُري ثمن ذلك بالضبط — ٩ من ٢٣
   امتناعًا مرّت عبر الارتداد بينما كل مؤشر ظاهر أخضر. */
(function () {
  "use strict";

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +

      // مخرَج النموذج الخام: المدخل الذي تتنازعه الطبقتان.
      '<rect x="12" y="86" width="104" height="40" rx="7" ' +
        'fill="var(--surface-solid)" stroke="var(--line)"/>' +
      '<text id="y-raw1" class="m-t" x="64" y="103" font-size="9.5" text-anchor="middle"></text>' +
      '<text id="y-raw2" class="m-t" x="64" y="116" font-size="9.5" text-anchor="middle"></text>' +

      // الطبقة ① — العلامة البنيوية
      '<rect id="y-sentbox" x="150" y="34" width="180" height="46" rx="7"/>' +
      '<text x="240" y="52" font-size="9" text-anchor="middle" fill="var(--ink-3)">' +
        '① raw.includes(NO_SOURCE)</text>' +
      '<text id="y-sentvia" x="240" y="69" font-size="10.5" text-anchor="middle" ' +
        'font-weight="600">via: "sentinel"</text>' +

      // الطبقة ② — المطابقة النصّية القديمة
      '<rect id="y-oldbox" x="150" y="100" width="180" height="52" rx="7"/>' +
      '<text id="y-oldhead" x="240" y="117" font-size="9" text-anchor="middle" fill="var(--ink-3)"></text>' +
      '<text id="y-oldcall" x="240" y="132" font-size="9" text-anchor="middle">raw.includes(marks)</text>' +
      '<text id="y-oldvia" x="240" y="146" font-size="10.5" text-anchor="middle" font-weight="600"></text>' +

      // من يملك الجملة: المستأجر. وهذا هو مصدر العطل كلّه.
      '<g id="y-tenant">' +
        '<path d="M240 176 L240 158" stroke="var(--amber)" stroke-width="1.2" fill="none"/>' +
        '<text id="y-tenanttext" x="240" y="190" font-size="9" text-anchor="middle" ' +
          'fill="var(--amber)"></text>' +
      "</g>" +
      '<text id="y-gap" x="240" y="204" font-size="9.5" text-anchor="middle" ' +
        'font-weight="600" fill="var(--amber)"></text>' +

      '<path class="m-line" d="M116 100 L150 60"/>' +
      '<path class="m-line" d="M116 112 L150 122"/>' +

      // العمود في قاعدة البيانات: الفرق بين وسمٍ في الذاكرة ووسمٍ يبقى.
      '<rect id="y-colbox" x="352" y="60" width="156" height="46" rx="7"/>' +
      '<text x="430" y="78" font-size="9" text-anchor="middle" fill="var(--ink-3)">' +
        "messages.refusal_via</text>" +
      '<text id="y-coltext" x="430" y="94" font-size="9" text-anchor="middle"></text>' +
      '<path class="m-line" d="M330 62 L352 76"/>' +
      '<path class="m-line" d="M330 126 L352 96"/>' +

      // القياس: استعلام على قاعدة البيانات، لا طباعةَ سكربت.
      '<rect id="y-measbox" x="352" y="122" width="156" height="62" rx="7"/>' +
      '<text x="430" y="139" font-size="9" text-anchor="middle" fill="var(--ink-3)">' +
        "GROUP BY refusal_via</text>" +
      '<text id="y-measnum" x="430" y="161" font-size="19" text-anchor="middle" ' +
        'font-weight="700"></text>' +
      '<text id="y-measnote" x="430" y="176" font-size="9" text-anchor="middle"></text>' +
      '<text id="y-measfoot" x="430" y="202" font-size="9" text-anchor="middle" ' +
        'fill="var(--ink-3)"></text>' +
    "</svg>";

  /** الحالة عند كل خطوة — دالة خالصة، لا مؤقّت ولا ذاكرة. */
  function frame(step) {
    return {
      oldOnly: step >= 1 && step < 3,
      broken: step === 2,
      sentinel: step >= 3,
      fallback: step >= 4,
      column: step >= 5,
      measured: step >= 6
    };
  }

  var EM = "var(--emerald)", AM = "var(--amber)";
  var EMS = "var(--emerald-soft)", AMS = "var(--amber-soft)";
  var RAISED = "var(--surface-solid)", LINE = "var(--line)";
  var SOFT = "var(--ink-2)", FAINT = "var(--ink-3)";

  __mech.register("yasmin-salla-cx", {
    title: {
      ar: "لماذا لا يُقاس الامتناع بمطابقة نصّية",
      en: "Why refusal cannot be measured by a text match"
    },
    svg: SVG,
    steps: [
      { ms: 2100, caption: {
        ar: "المنتج المُباع هنا ليس الجواب بل الامتناع: أن يقول «لا أعرف» ويحوّل، بدل أن يخترع. فقياس الامتناع هو قياس المنتج نفسه.",
        en: "What is sold here is not the answer but the refusal: saying “I don’t know” and handing off, rather than inventing. So measuring refusal is measuring the product itself." } },
      { ms: 2400, fails: true, caption: {
        ar: "والكشف القديم مطابقة نصّية على أول ١٥ حرفًا من جملة الرفض — وهي جملة يحرّرها المستأجر من لوحته.",
        en: "And the old detection was a text match on the first 15 characters of the refusal sentence — a sentence the tenant edits from their own panel." } },
      { ms: 2600, fails: true, caption: {
        ar: "تعديل كلمة واحدة يجعل تقرير الفجوات يقول «صفر فجوة» وهي مئة — بلا خطأ ولا تحذير ولا سطر سجل.",
        en: "Change one word and the gap report reads “zero gaps” when there are a hundred — with no error, no warning, and no log line." } },
      { ms: 2200, caption: {
        ar: "الإصلاح إضافة لا استبدال: علامة بنيوية يُصدرها النموذج تحسم أولًا وتوسم sentinel — لأن استبدال هشاشة بهشاشة ليس إصلاحًا.",
        en: "The fix adds a layer rather than replacing one: a structural sentinel from the model decides first and tags it `sentinel` — because trading one fragility for another is not a fix." } },
      { ms: 2300, caption: {
        ar: "وعند غياب العلامة يرتدّ الكشف إلى المطابقة القديمة حرفيًا — لكنه يوسمها legacy. امتثال النموذج غير مضمون، فالارتداد يبقى.",
        en: "When the sentinel is absent, detection falls back to the old match verbatim — but tags it `legacy`. Model compliance is not guaranteed, so the fallback stays." } },
      { ms: 2400, caption: {
        ar: "والخطوة الحاسمة: الوسم لم يبقَ في الذاكرة. عمود messages.refusal_via يُكتب مع كل ردّ — فصارت نسبة الارتداد استعلامًا على قاعدة البيانات لا طباعةَ سكربت.",
        en: "And the decisive step: the tag did not stay in memory. The messages.refusal_via column is written with every reply — so the fallback rate became a database query, not a script’s printout." } },
      { ms: 2800, fails: true, caption: {
        ar: "والقياس كشف أن ٩ من ٢٣ امتناعًا مرّت عبر الارتداد لا عبر العلامة — ٣٩٪ — بينما كل مؤشر ظاهر أخضر. لا اختبار سلوكي كان ليكشف هذا.",
        en: "And the measurement showed 9 of 23 refusals passed through the fallback rather than the sentinel — 39% — while every visible signal was green. No behavioural test would have caught it." } }
    ],

    render: function (root, step) {
      var f = frame(step);
      var ar = document.documentElement.lang === "ar";

      root.querySelector("#y-raw1").textContent = ar ? "مخرَج النموذج" : "raw model";
      root.querySelector("#y-raw2").textContent = ar ? "الخام" : "output";

      var sent = root.querySelector("#y-sentbox");
      sent.setAttribute("fill", f.sentinel ? EMS : RAISED);
      sent.setAttribute("stroke", f.sentinel ? EM : LINE);
      // متقطّع ما دامت الطبقة غير موجودة بعد: الحدّ المصمت يعني «قائم».
      sent.setAttribute("stroke-dasharray", f.sentinel ? "none" : "4 3");
      root.querySelector("#y-sentvia").setAttribute("fill", f.sentinel ? EM : FAINT);

      var old = root.querySelector("#y-oldbox");
      old.setAttribute("fill", f.broken ? AMS : f.fallback ? EMS : RAISED);
      old.setAttribute("stroke", f.broken ? AM : (f.oldOnly || f.fallback) ? EM : LINE);

      root.querySelector("#y-oldhead").textContent = f.fallback
        ? (ar ? "② الارتداد — محفوظ حرفيًا" : "② fallback — kept verbatim")
        : (ar ? "مطابقة نصّية · أول ١٥ حرفًا" : "text match · first 15 chars");
      root.querySelector("#y-oldcall").setAttribute("fill", f.broken ? AM : SOFT);

      var oldvia = root.querySelector("#y-oldvia");
      oldvia.textContent = f.fallback ? 'via: "legacy"'
        : f.broken ? (ar ? "لا مطابقة · أُجيب ✗" : "no match → answered ✗")
          : (ar ? "أُجيب / امتنع" : "answered / refused");
      oldvia.setAttribute("fill", f.broken ? AM : f.fallback ? EM : FAINT);

      var tenant = root.querySelector("#y-tenant");
      tenant.setAttribute("class", f.oldOnly || f.broken ? "" : "m-hide");
      root.querySelector("#y-tenanttext").textContent = ar
        ? "المستأجر يحرّر هذه الجملة من لوحته"
        : "tenant edits this sentence from their panel";

      var gap = root.querySelector("#y-gap");
      gap.setAttribute("class", f.broken ? "" : "m-hide");
      gap.textContent = ar
        ? "تقرير الفجوات: «صفر فجوة» · الحقيقة: ١٠٠"
        : "gap report: “0 gaps” · truth: 100";

      var col = root.querySelector("#y-colbox");
      col.setAttribute("fill", f.column ? EMS : RAISED);
      col.setAttribute("stroke", f.column ? EM : LINE);
      col.setAttribute("stroke-dasharray", f.column ? "none" : "4 3");
      var coltext = root.querySelector("#y-coltext");
      coltext.textContent = f.column
        ? (ar ? "يُكتب مع كل ردّ" : "written with every reply")
        : (ar ? "غير مخزَّن" : "not stored");
      coltext.setAttribute("fill", f.column ? EM : FAINT);

      // القياس يخرج كهرماريًّا لا أخضر: الرقم صحيح، وما كشفه لم يصمد.
      var meas = root.querySelector("#y-measbox");
      meas.setAttribute("fill", f.measured ? AMS : RAISED);
      meas.setAttribute("stroke", f.measured ? AM : LINE);
      meas.setAttribute("stroke-dasharray", f.measured ? "none" : "4 3");

      var num = root.querySelector("#y-measnum");
      num.textContent = f.measured ? "9 / 23" : "— / —";
      num.setAttribute("fill", f.measured ? AM : FAINT);

      var note = root.querySelector("#y-measnote");
      note.textContent = f.measured ? "39% via legacy" : (ar ? "لا يُقاس" : "unmeasurable");
      note.setAttribute("fill", f.measured ? AM : FAINT);

      var foot = root.querySelector("#y-measfoot");
      foot.setAttribute("class", f.measured ? "" : "m-hide");
      foot.textContent = ar
        ? "البوّابة ٢٤/٢٤ خضراء · صفر تكرار"
        : "gate 24/24 green · 0 duplicates";
    }
  });
})();
