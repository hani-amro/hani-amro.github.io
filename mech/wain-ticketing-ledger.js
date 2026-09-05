/* «وين» — لماذا لا يستطيع نصفُ قيدٍ أن يمرّ.

   ما يُريه: المعاملة تُكتب صفًّا صفًّا، والفرق ينزل 1000 ← 300 ← 0، والقيد
   المؤجَّل يفحص مرّة واحدة عند COMMIT فتمرّ. ثم مسارٌ جديد يكتب نصف قيد وينسى
   مقابله — وهو ما كان سينجح صامتًا لو كان الفحص في كود التطبيق — فيسقط عند
   COMMIT وتعود صفر صفوف لا نصف قيد.

   ولماذا مؤجَّل لا فوري: فحصٌ على كل صفّ كان سيرفض الصفّ الأول من كل مجموعة
   صحيحة أيضًا. الخطوة الثانية في المخطّط تُري هذا بالضبط — الفرق 1000 على
   مجموعة سليمة. */
(function () {
  "use strict";

  var SALE = [
    { label: "ticket_sale", amount: 1000, debit: true },
    { label: "organizer_payable", amount: 700, debit: false },
    { label: "platform_fee + tax", amount: 300, debit: false }
  ];
  var HALF = { label: "refund_debit", amount: 1000, debit: true };

  var BOX = { x: 14, y: 44, w: 300, h: 116 };
  var ROW_H = 30;

  function rowMarkup(i) {
    var y = BOX.y + 10 + i * ROW_H;
    return '<g class="row" data-row="' + i + '" opacity="0">' +
      '<rect x="' + (BOX.x + 10) + '" y="' + y + '" width="' + (BOX.w - 20) +
      '" height="' + (ROW_H - 6) + '" rx="5" class="row-bg"/>' +
      '<text class="m-t row-label" x="' + (BOX.x + 20) + '" y="' + (y + 17) + '"></text>' +
      '<text class="row-amt" x="' + (BOX.x + BOX.w - 20) + '" y="' + (y + 17) +
      '" text-anchor="end" font-weight="600"></text>' +
      "</g>";
  }

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<text class="m-t" x="' + (BOX.x + 10) + '" y="' + (BOX.y - 10) + '" font-size="10">BEGIN … COMMIT</text>' +
      '<rect class="m-box m-fill" x="' + BOX.x + '" y="' + BOX.y + '" width="' + BOX.w +
        '" height="' + BOX.h + '" rx="8"/>' +
      rowMarkup(0) + rowMarkup(1) + rowMarkup(2) +

      '<text class="m-t" x="360" y="60" font-size="10">SUM(debit − credit)</text>' +
      '<rect id="w-diffbox" x="360" y="70" width="140" height="46" rx="8"/>' +
      '<text id="w-diff" x="430" y="101" font-size="22" text-anchor="middle" font-weight="700"></text>' +
      '<text id="w-note" class="m-t" x="430" y="140" font-size="10.5" text-anchor="middle"></text>' +

      '<line class="m-line m-dash" x1="' + (BOX.x + BOX.w / 2) + '" y1="' + (BOX.y + BOX.h) +
        '" x2="' + (BOX.x + BOX.w / 2) + '" y2="186"/>' +
      '<rect id="w-gate" x="' + (BOX.x + BOX.w / 2 - 92) + '" y="186" width="184" height="30" rx="15"/>' +
      '<text id="w-gatetext" x="' + (BOX.x + BOX.w / 2) + '" y="205" font-size="11" ' +
        'text-anchor="middle" font-weight="600"></text>' +
    "</svg>";

  /** الحالة عند كل خطوة — دالة خالصة، لا مؤقّت ولا ذاكرة. */
  function frame(step) {
    if (step <= 4) {
      var visible = Math.max(0, Math.min(3, step));
      var diff = 0;
      for (var i = 0; i < visible; i++) {
        diff += SALE[i].debit ? SALE[i].amount : -SALE[i].amount;
      }
      return { rows: SALE.slice(0, visible), diff: diff,
               gate: step === 4 ? "ok" : "idle", half: false };
    }
    return { rows: [HALF], diff: 1000, gate: step === 6 ? "fail" : "idle", half: true };
  }

  var EM = "var(--emerald)", AM = "var(--amber)";
  var EMS = "var(--emerald-soft)", AMS = "var(--amber-soft)";

  __mech.register("wain-ticketing-ledger", {
    title: {
      ar: "لماذا لا يستطيع نصفُ قيدٍ أن يمرّ",
      en: "Why half a ledger entry cannot pass"
    },
    svg: SVG,
    steps: [
      { ms: 1100, caption: {
        ar: "تبدأ معاملة لتسجيل بيع تذكرة. القيود تُكتب صفًّا صفًّا داخلها.",
        en: "A transaction opens to record a ticket sale. Entries are written row by row inside it." } },
      { ms: 2100, caption: {
        ar: "أول صفّ: مدين 1000. الفرق الآن 1000 — ولو كان الفحص فوريًّا لرفض هنا، ورفض كل مجموعة صحيحة معه. هذا سبب التأجيل.",
        en: "First row: debit 1000. The difference is now 1000 — a per-row check would reject right here, and reject every correct group with it. That is why the check is deferred." } },
      { ms: 1300, caption: {
        ar: "دائن 700 لصاحب الفعالية. الفرق ينزل إلى 300.",
        en: "Credit 700 to the organizer. The difference drops to 300." } },
      { ms: 1300, caption: {
        ar: "دائن 300 للمنصّة والضريبة. الفرق صار صفرًا.",
        en: "Credit 300 to the platform and tax. The difference is now zero." } },
      { ms: 2200, caption: {
        ar: "عند COMMIT يعمل المحفّز المؤجَّل مرّة واحدة على المجموعة مكتملةً: الفرق صفر ← تمرّ.",
        en: "At COMMIT the deferred trigger runs once against the completed group: the difference is zero, so it passes." } },
      { ms: 2100, fails: true, caption: {
        ar: "الآن مسار جديد — استرداد مثلًا — يكتب نصف قيد وينسى مقابله. لو كان الفحص في كود التطبيق لنجح هذا صامتًا.",
        en: "Now a new path — a refund, say — writes half an entry and forgets its counterpart. Enforced in application code, this would have succeeded silently." } },
      { ms: 2400, fails: true, caption: {
        ar: "المحفّز يحسب الفرق 1000 ويُسقط المعاملة كلّها بـ ck_ledger_group_balances. النتيجة صفر صفّ، لا نصف قيد.",
        en: "The trigger computes a difference of 1000 and kills the whole transaction with ck_ledger_group_balances. The result is zero rows, not half an entry." } }
    ],

    render: function (root, step) {
      var f = frame(step);
      var ar = document.documentElement.lang === "ar";

      // كل سمة تُكتب في كل خطوة، ولو كان الصفّ مخفياً. الخروج المبكر كان
      // يترك الصفّ يحمل نصّ الخطوة السابقة تحت شفافية صفر — فيختلف الشكل
      // باختلاف الطريق إلى الخطوة نفسها، وهو ما يمسكه tools/check_mechanisms.py.
      root.querySelectorAll(".row").forEach(function (g, i) {
        var r = f.rows[i];
        g.setAttribute("opacity", r ? "1" : "0");
        g.querySelector(".row-label").textContent = r ? r.label : "";
        var amt = g.querySelector(".row-amt");
        amt.textContent = r ? (r.debit ? "+" : "−") + r.amount : "";
        amt.setAttribute("fill", r && r.debit ? EM : "var(--ink)");
        var bg = g.querySelector(".row-bg");
        bg.setAttribute("fill", r && r.debit ? EMS : "var(--surface)");
        bg.setAttribute("stroke", "var(--line)");
      });

      var zero = f.diff === 0;
      var box = root.querySelector("#w-diffbox");
      box.setAttribute("fill", zero ? EMS : AMS);
      box.setAttribute("stroke", zero ? EM : AM);
      var diff = root.querySelector("#w-diff");
      diff.textContent = zero ? "0" : "+" + f.diff;
      diff.setAttribute("fill", zero ? EM : AM);

      var gate = root.querySelector("#w-gate");
      var gt = root.querySelector("#w-gatetext");
      if (f.gate === "ok") {
        gate.setAttribute("fill", EM); gate.setAttribute("stroke", "none");
        gt.setAttribute("fill", "var(--accent-ink)"); gt.textContent = "COMMIT ✓";
      } else if (f.gate === "fail") {
        gate.setAttribute("fill", AM); gate.setAttribute("stroke", "none");
        gt.setAttribute("fill", "var(--accent-ink)"); gt.textContent = "ck_ledger_group_balances ✗";
      } else {
        gate.setAttribute("fill", "var(--surface-solid)");
        gate.setAttribute("stroke", "var(--line-strong)");
        gt.setAttribute("fill", "var(--ink-3)");
        gt.textContent = ar ? "مؤجَّل — يُفحَص عند COMMIT" : "DEFERRED — checked at COMMIT";
      }

      // اللون يُكتب في الفروع الثلاثة. الفرع الفارغ كان لا يكتبه، فيبقى النصّ
      // الفارغ حاملاً لون التحذير من زيارة سابقة — فرقٌ لا يُرى ويكفي لكسر الخلوص.
      var note = root.querySelector("#w-note");
      if (f.gate === "fail") {
        note.textContent = "ROLLBACK → 0 rows";
        note.setAttribute("fill", AM);
      } else if (f.half) {
        note.textContent = ar ? "نصف قيد" : "half an entry";
        note.setAttribute("fill", "var(--ink-3)");
      } else {
        note.textContent = "";
        note.setAttribute("fill", "var(--ink-3)");
      }
    }
  });
})();
