/* «كويك‑دروب» — لماذا لا يصل الطلب إلى سائقَين.

   ما يُريه: التاجر من الداشبورد والبوت من واتساب يضغطان «تأكيد» على الطلب
   نفسه في اللحظة نفسها. القفل على رأس الانتقال يحوّل المتسابقَين إلى صفّ،
   ثم UPDATE مشروط بـ isNull(dispatchRequestedAt) يُعيد صفًّا واحدًا للأول
   وصفر صفوف للثاني. والسطر الحاسم أن writeOutbox يُكتب داخل الترانزاكشن
   نفسها: الختم والحدث معًا أو لا شيء.

   ولماذا لا يكفي فحصٌ في كود التطبيق: «اقرأ ثم قرّر ثم اكتب» يترك فجوة بين
   القراءة والكتابة يدخل منها المتسابق الثاني. الشرط هنا داخل جملة الكتابة
   نفسها، فقاعدة البيانات هي التي تحسم السباق لا الترتيب الزمني للطلبات.

   وأثر ذلك أن الحدث المُثبَّت مع الختم يبقى حتى لو مات الـprocess بعد
   الـcommit، فيلتقطه العامل لاحقًا بـ FOR UPDATE SKIP LOCKED. */
(function () {
  "use strict";

  var EM = "var(--emerald)", AM = "var(--amber)";
  var EMS = "var(--emerald-soft)", AMS = "var(--amber-soft)";
  var RAISED = "var(--surface-solid)", LINE = "var(--line)", FAINT = "var(--ink-3)";

  /** الفاعلان صندوقان متطابقان — يفترقان بالحالة لا بالشكل. */
  function actorMarkup(id, y, name) {
    return '<g>' +
      '<rect id="q-a' + id + '" x="10" y="' + y + '" width="112" height="34" rx="7"/>' +
      '<text class="m-t" x="66" y="' + (y + 15) + '" font-size="10.5" text-anchor="middle">' +
        name + "</text>" +
      '<text id="q-s' + id + '" x="66" y="' + (y + 27) + '" font-size="9" text-anchor="middle"></text>' +
      "</g>";
  }

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      actorMarkup("A", 24, "dashboard") +
      actorMarkup("B", 150, "whatsapp bot") +

      // القفل: صندوق واحد يمرّ منه الاثنان بالتتابع لا بالتوازي
      '<rect id="q-lock" x="150" y="86" width="86" height="52" rx="8"/>' +
      '<text x="193" y="106" font-size="9.5" text-anchor="middle" fill="' + FAINT + '">SELECT … FOR</text>' +
      '<text x="193" y="119" font-size="9.5" text-anchor="middle" fill="' + FAINT + '">UPDATE</text>' +
      '<text id="q-lockstate" x="193" y="132" font-size="9" text-anchor="middle"></text>' +

      '<path class="m-line" d="M122 41 L150 100"/>' +
      '<path class="m-line" d="M122 167 L150 124"/>' +

      // الـUPDATE المشروط: الشرط داخل جملة الكتابة، لا قبلها
      '<rect id="q-upd" x="262" y="70" width="150" height="52" rx="8"/>' +
      '<text class="m-t" x="337" y="87" font-size="9" text-anchor="middle">UPDATE … WHERE</text>' +
      '<text class="m-t" x="337" y="99" font-size="8.5" text-anchor="middle">dispatchRequestedAt IS NULL</text>' +
      '<text id="q-rows" x="337" y="114" font-size="11" text-anchor="middle" font-weight="700"></text>' +
      '<path class="m-line" d="M236 108 L262 100"/>' +

      // صفّ الـoutbox داخل الترانزاكشن ذاتها
      '<rect id="q-outbox" x="262" y="150" width="150" height="46" rx="8"/>' +
      '<text class="m-t" x="337" y="168" font-size="9.5" text-anchor="middle">writeOutbox(tx, …)</text>' +
      '<text id="q-outstate" x="337" y="183" font-size="9.5" text-anchor="middle" font-weight="600"></text>' +
      '<path class="m-line m-dash" d="M337 122 L337 150"/>' +

      // إطار الترانزاكشن الواحدة: الختم والحدث داخله معًا
      '<rect x="250" y="58" width="174" height="150" rx="10" fill="none" stroke="' + EM +
        '" stroke-width="1" stroke-dasharray="5 4" opacity="0.45"/>' +
      '<text id="q-txlabel" x="337" y="52" font-size="9" text-anchor="middle" fill="' + EM + '"></text>' +

      // النتيجة: كم سائقًا أُخطر
      '<text id="q-drivers" x="440" y="100" font-size="10" fill="' + FAINT + '"></text>' +
      '<text id="q-count" x="440" y="120" font-size="24" font-weight="700"></text>' +
      '<text id="q-not2" x="440" y="136" font-size="9" fill="' + FAINT + '"></text>' +
    "</svg>";

  /** الحالة عند كل خطوة — دالة خالصة، لا مؤقّت ولا ذاكرة. */
  function frame(step) {
    return {
      holder: step === 0 ? "none" : step >= 4 ? "B" : "A",
      claimed: step >= 2,
      outbox: step >= 3,
      rejected: step >= 4,
      waiting: step >= 1 && step < 4
    };
  }

  function paintActor(root, id, active, waiting, ar) {
    var box = root.querySelector("#q-a" + id);
    box.setAttribute("fill", active ? EMS : RAISED);
    box.setAttribute("stroke", active ? EM : LINE);
    var st = root.querySelector("#q-s" + id);
    st.textContent = waiting ? (ar ? "ينتظر القفل" : "waiting on lock")
      : active ? (ar ? "يملك القفل" : "holds lock") : "";
    st.setAttribute("fill", waiting ? AM : FAINT);
  }

  __mech.register("quickdrop", {
    title: {
      ar: "لماذا لا يصل الطلب إلى سائقَين",
      en: "Why one order never reaches two drivers"
    },
    svg: SVG,
    steps: [
      { ms: 1900, caption: {
        ar: "التاجر يؤكّد من الداشبورد، والبوت يؤكّد من واتساب — في اللحظة نفسها، على الطلب نفسه.",
        en: "The merchant confirms from the dashboard and the bot confirms from WhatsApp — same instant, same order." } },
      { ms: 2000, caption: {
        ar: "قفل الصفّ ‎.for(\"update\")‎ على رأس الانتقال: الأول يدخل، والثاني ينتظر. المتسابقان صاروا صفًّا.",
        en: "The row lock `.for(\"update\")` at the head of the transition: the first enters, the second waits. Racers become a queue." } },
      { ms: 2000, caption: {
        ar: "الأول ينفّذ UPDATE مشروطًا بـ isNull(dispatchRequestedAt) مع ‎.returning()‎ — فيعرف أنه أصاب صفًّا واحدًا فعلًا.",
        en: "The first runs an UPDATE conditional on isNull(dispatchRequestedAt) with `.returning()` — so it knows it actually claimed exactly one row." } },
      { ms: 2200, caption: {
        ar: "وهنا السطر الحاسم: صفّ الـoutbox يُكتب داخل if (claimed.length === 1) وداخل الترانزاكشن ذاتها — الختم والحدث معًا أو لا شيء.",
        en: "And here is the load-bearing line: the outbox row is written inside `if (claimed.length === 1)` and inside the same transaction — the stamp and the event together, or neither." } },
      { ms: 2200, fails: true, caption: {
        ar: "الثاني يدخل بعد تحرّر القفل. شرط isNull لم يعد يتحقّق، فـ UPDATE يصيب صفر صفّ — ولا outbox. الازدواجية ماتت.",
        en: "The second enters once the lock frees. The isNull condition no longer holds, so the UPDATE matches zero rows — and no outbox. Duplication is dead." } },
      { ms: 2000, caption: {
        ar: "ولو مات الـprocess بعد الـcommit، الحدث مثبَّت مع الختم فيلتقطه العامل لاحقًا بـ FOR UPDATE SKIP LOCKED. الفقدان مات بالآلية نفسها.",
        en: "And if the process dies after commit, the event is committed with the stamp and the worker picks it up later with FOR UPDATE SKIP LOCKED. Loss dies by the same mechanism." } }
    ],

    render: function (root, step) {
      var f = frame(step);
      var ar = document.documentElement.lang === "ar";

      paintActor(root, "A", f.holder === "A", false, ar);
      paintActor(root, "B", f.holder === "B", f.waiting, ar);

      var open = f.holder === "none";
      var lock = root.querySelector("#q-lock");
      lock.setAttribute("fill", RAISED);
      lock.setAttribute("stroke", open ? LINE : EM);
      var ls = root.querySelector("#q-lockstate");
      ls.textContent = open ? (ar ? "مفتوح" : "open")
        : (ar ? "بيد " : "held by ") + f.holder;
      ls.setAttribute("fill", open ? FAINT : EM);

      var upd = root.querySelector("#q-upd");
      upd.setAttribute("fill", f.rejected ? AMS : f.claimed ? EMS : RAISED);
      upd.setAttribute("stroke", f.rejected ? AM : f.claimed ? EM : LINE);
      // المؤشّر الوحيد الذي يحسم السباق: عدد الصفوف العائدة من الكتابة نفسها.
      var rows = root.querySelector("#q-rows");
      rows.textContent = f.rejected ? "returning → 0 rows"
        : f.claimed ? "returning → 1 row" : "returning → ?";
      rows.setAttribute("fill", f.rejected ? AM : f.claimed ? EM : FAINT);

      var out = root.querySelector("#q-outbox");
      out.setAttribute("fill", f.outbox ? EMS : RAISED);
      out.setAttribute("stroke", f.outbox ? EM : LINE);
      out.setAttribute("stroke-dasharray", f.outbox ? "none" : "4 3");
      var os = root.querySelector("#q-outstate");
      if (!f.outbox) {
        os.textContent = ar ? "لم يُكتب" : "not written";
      } else if (f.rejected) {
        os.textContent = ar ? "كُتب مرّة واحدة — لا مرّتين" : "written once — not twice";
      } else {
        os.textContent = ar ? "كُتب · داخل الترانزاكشن نفسها" : "written · same tx";
      }
      os.setAttribute("fill", f.outbox ? EM : FAINT);

      root.querySelector("#q-txlabel").textContent = ar ? "ترانزاكشن واحدة" : "one transaction";
      root.querySelector("#q-drivers").textContent = ar ? "السائقون" : "drivers";
      var count = root.querySelector("#q-count");
      count.textContent = f.outbox ? "1" : "0";
      count.setAttribute("fill", f.rejected ? EM : FAINT);
      root.querySelector("#q-not2").textContent = f.rejected ? (ar ? "وليس 2" : "not 2") : "";
    }
  });
})();
