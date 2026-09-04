/* «التاجر» — سُلَّم قراءة الربح المفتوح، ولماذا تنتهي الدرجة الأخيرة إلى null.

   ما يُريه: أربع درجات مرتَّبة، كلٌّ منها تُصرِّح بمصدرها. الأولى والثانية
   رقمٌ صادق (مُرسَل أو مشتقٌّ بهوية تعريفية)، والثالثة رقمٌ لا يجيب على
   السؤال — التراكمي بدل العائم — فتمرّ موسومةً بتحذير مرئي لا مخفيّ.
   والرابعة لا رقم فيها أصلًا، فتُرجع null لا صفرًا: «لا نعرف» ليست «لا شيء».

   ولماذا Number.isFinite حصرًا بلا ‎|| 0‎: المصيدة في الأسفل تُري أن ‎|| 0‎
   يفشل مرّتين — يبتلع null فيصير صفراً كاذباً، ويبتلع الصفر الحقيقي عند
   نقطة التعادل فيستبدله بصفرٍ آخر لا يُميَّز عنه. الصفر الصامت هنا هو العطل
   نفسه، لا علاجه. */
(function () {
  "use strict";

  var RUNGS = [
    { n: "①", cond: "unrealizedProfit", source: "unrealized", warn: false },
    { n: "②", cond: "profit − realizedProfit", source: "derived", warn: false },
    { n: "③", cond: "profit (cumulative)", source: "cumulative", warn: true },
    { n: "④", cond: { ar: "— لا شيء —", en: "— nothing —" }, source: "none", warn: true }
  ];

  var RESULTS = [
    { value: "−1.34", source: "unrealized", warn: false },
    { value: "−1.34", source: "derived", warn: false },
    { value: "+5.91", source: "cumulative", warn: true },
    { value: "null", source: "none", warn: true }
  ];

  var ROW_X = 14, ROW_W = 286, ROW_H = 34;

  function rowY(i) { return 30 + i * 42; }

  function rungMarkup(i) {
    var y = rowY(i);
    return '<g class="rung">' +
      '<rect class="rung-bg" x="' + ROW_X + '" y="' + y + '" width="' + ROW_W +
        '" height="' + ROW_H + '" rx="7"/>' +
      '<text class="rung-n" x="30" y="' + (y + 22) + '" font-size="13" font-weight="600"></text>' +
      '<text class="m-t rung-cond" x="50" y="' + (y + 21) + '" font-size="10.5"></text>' +
      '<text class="rung-src" x="290" y="' + (y + 21) +
        '" font-size="9.5" text-anchor="end"></text>' +
      '<text class="rung-x" x="308" y="' + (y + 21) +
        '" font-size="10" fill="var(--ink-3)" opacity="0">✕</text>' +
      "</g>";
  }

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      rungMarkup(0) + rungMarkup(1) + rungMarkup(2) + rungMarkup(3) +

      // سهم النزول: يُري أن الدرجات تُجرَّب بالترتيب، لا أنها خيارات متوازية.
      '<path id="a-drop" class="m-dash" d="M157 ' + (rowY(0) + ROW_H) + ' L157 ' + rowY(1) +
        '" stroke="var(--ink-3)" stroke-width="1.2" fill="none" opacity="0"/>' +

      // المخرَج المصرَّح: القيمة لا تُعاد وحدها، بل ومعها مصدرها وحال تحذيرها.
      '<rect id="a-out" x="336" y="42" width="170" height="104" rx="9"/>' +
      '<text x="421" y="60" font-size="9" text-anchor="middle" ' +
        'fill="var(--ink-3)">{ value, source, warn }</text>' +
      '<text id="a-val" x="421" y="90" font-size="24" text-anchor="middle" font-weight="700"></text>' +
      '<text id="a-src" class="m-t" x="421" y="110" font-size="10" text-anchor="middle"></text>' +
      '<text id="a-warn" x="421" y="128" font-size="10" text-anchor="middle" font-weight="600"></text>' +

      // المصيدة المرفوضة: ما كان ‎|| 0‎ سيفعله بالـnull وبالصفر المشروع معاً.
      '<rect id="a-trap" x="336" y="160" width="170" height="52" rx="9"/>' +
      '<text id="a-trapa" x="421" y="177" font-size="9.5" text-anchor="middle">Number(x) || 0</text>' +
      '<text id="a-trapb" x="421" y="192" font-size="9" text-anchor="middle"></text>' +
      '<text id="a-trapc" x="421" y="205" font-size="9" text-anchor="middle" font-weight="600"></text>' +

      // الحدّ الفاصل الذي كشف العطل: الشاشة موجبة والرِّجل المفتوحة خاسرة.
      '<text id="a-note" x="157" y="212" font-size="9.5" text-anchor="middle" ' +
        'fill="var(--amber)" opacity="0"></text>' +
    "</svg>";

  var EM = "var(--emerald)", AM = "var(--amber)";
  var EMS = "var(--emerald-soft)", AMS = "var(--amber-soft)";
  var FAINT = "var(--ink-3)";

  /** النصوص الثنائية تُختار هنا؛ ما كان معرِّفاً برمجياً يبقى لاتينياً في اللغتين. */
  function say(v, ar) {
    return typeof v === "string" ? v : (ar ? v.ar : v.en);
  }

  __mech.register("altajir-position-pnl", {
    title: {
      ar: "سُلَّم مصدر الربح — ولماذا null لا صفر",
      en: "The profit-source ladder — and why null, not zero"
    },
    svg: SVG,
    steps: [
      { ms: 2000, caption: {
        ar: "البروكر أرسل unrealizedProfit. الدرجة ① تأخذه مباشرةً — عائم الجزء الباقي وحده، بلا اشتقاق وبلا تحذير.",
        en: "The broker sent unrealizedProfit. Rung ① takes it directly — the floating P&L of the remaining leg alone, no derivation and no warning." } },
      { ms: 2300, caption: {
        ar: "لم يرسله. الدرجة ② تشتقّ profit − realizedProfit — هوية تعريفية لا تخمين، فلا تستحق تحذيرًا.",
        en: "It was not sent. Rung ② derives profit − realizedProfit — a definitional identity, not a guess, so it earns no warning." } },
      { ms: 2400, fails: true, caption: {
        ar: "لا تفصيل إطلاقًا. الدرجة ③ تعرض التراكمي — وهو ما كان يُعرض دائمًا — لكن موسومًا بتحذير مرئي. إخفاء الوسم هنا يعيد العطل صامتًا.",
        en: "No breakdown at all. Rung ③ shows the cumulative figure — which is what was always shown — but tagged with a visible warning. Hiding the tag here brings the silent defect straight back." } },
      { ms: 2400, fails: true, caption: {
        ar: "لا رقم أصلًا. الدرجة ④ تُرجع null لا صفرًا: «لا نعرف» ليست «لا شيء».",
        en: "No number at all. Rung ④ returns null, not zero: “we do not know” is not “nothing”." } },
      { ms: 2600, fails: true, caption: {
        ar: "ولهذا الفحص Number.isFinite حصرًا بلا ‎|| 0‎: عند نقطة التعادل الربح صفر مشروع، و‎|| 0‎ يبتلعه ويستبدله — فيفشل مرتين، مرّة يخفي المجهول ومرّة يمسح الصفر الحقيقي.",
        en: "Which is why the check is Number.isFinite only, with no `|| 0`: at break-even the profit is a legitimate zero, and `|| 0` swallows and replaces it — failing twice, once hiding the unknown and once erasing the real zero." } }
    ],

    render: function (root, step) {
      // الخطوة الأخيرة تشرح المصيدة ولا تنزل درجةً جديدة، فتبقى عند الرابعة.
      var active = Math.min(step, 3);
      var trap = step >= 4;
      var res = RESULTS[active];
      var ar = document.documentElement.lang === "ar";

      root.querySelectorAll(".rung").forEach(function (g, i) {
        var r = RUNGS[i];
        var on = i === active;
        var passed = i < active;
        var tone = r.warn ? AM : EM;

        g.classList.toggle("m-dim", passed);

        var bg = g.querySelector(".rung-bg");
        bg.setAttribute("fill", on ? (r.warn ? AMS : EMS) : "var(--surface)");
        bg.setAttribute("stroke", on ? tone : "var(--line)");

        var n = g.querySelector(".rung-n");
        n.textContent = r.n;
        n.setAttribute("fill", on ? tone : FAINT);

        g.querySelector(".rung-cond").textContent = say(r.cond, ar);

        var src = g.querySelector(".rung-src");
        src.textContent = r.source;
        src.setAttribute("fill", on ? tone : FAINT);

        g.querySelector(".rung-x").setAttribute("opacity", passed ? "1" : "0");
      });

      var drop = root.querySelector("#a-drop");
      drop.setAttribute("opacity", active > 0 ? "1" : "0");
      if (active > 0) {
        drop.setAttribute("d", "M157 " + (rowY(0) + ROW_H) + " L157 " + rowY(active));
      }

      var out = root.querySelector("#a-out");
      out.setAttribute("fill", res.warn ? AMS : EMS);
      out.setAttribute("stroke", res.warn ? AM : EM);

      var val = root.querySelector("#a-val");
      val.textContent = res.value;
      val.setAttribute("fill", res.warn ? AM : EM);

      root.querySelector("#a-src").textContent = "source: " + res.source;

      var warn = root.querySelector("#a-warn");
      warn.textContent = res.warn ? "⚠ warn: true" : "warn: false";
      warn.setAttribute("fill", res.warn ? AM : FAINT);

      var box = root.querySelector("#a-trap");
      box.setAttribute("fill", trap ? AMS : "var(--surface)");
      box.setAttribute("stroke", trap ? AM : "var(--line)");
      box.classList.toggle("m-dash", !trap);

      var tcol = trap ? AM : FAINT;
      root.querySelector("#a-trapa").setAttribute("fill", tcol);

      var tb = root.querySelector("#a-trapb");
      tb.textContent = trap ? "null → 0  ·  0 → 0" : "";
      tb.setAttribute("fill", tcol);

      var tc = root.querySelector("#a-trapc");
      tc.textContent = trap
        ? (ar ? "الصفر الصامت — مرفوض" : "the silent zero — rejected")
        : (ar ? "الإصلاح الساذج" : "the naive fix");
      tc.setAttribute("fill", tcol);

      var note = root.querySelector("#a-note");
      note.setAttribute("opacity", active === 2 ? "1" : "0");
      note.textContent = ar
        ? "الشاشة عرضت +5.91 · المفتوح كان −1.34"
        : "screen said +5.91 · open leg was −1.34";
    }
  });
})();
