/* «الصفر الصامت» — حقلُ قيمٍ في العمق، وفيه عطل.
 *
 * هذه أكثر جملة تتكرّر في عملي: **الصفر الصامت أسوأ فشل ممكن**. وهي على
 * الصفحة مكتوبةٌ في ثلاثة مواضع، فليكن أوّل ما يُرى منها أنها **تحدث**.
 *
 * الحقلان في المفتاحين يحملان العطل نفسه. في «صامت» يعود الحساب الفاشل صفراً
 * لا يميّزه شيء عن جاره، ويبقى حيث سقط — بعيداً، صغيراً، بين ثمانية وأربعين
 * رقماً. وفي «عالي الصوت» يخرج إلى المقدّمة ويصفرّ، ويغور كل ما عداه.
 * والفرق ليس في وجود العطل بل في أن أحدهما يُريكه.
 *
 * ولماذا العمق تحديداً: البُعد الثالث هنا ليس تجميلاً — هو **مقدار ما دُفن
 * فيه العطل**. رقمٌ عند z = -340 لا يُقرأ أصلاً، وهذا هو المعنى بالضبط.
 *
 * وبـCSS لا WebGL: ثمانية وأربعون عنصراً بتحويلات ثلاثية، وما يبيع العمق هو
 * الكثافة وتدرّج الحجم والشفافية مع البُعد — لا شدّة الميلان. (محاولةٌ سابقة
 * بأربع شرائح فشلت لهذا السبب بالذات.)
 */
(function () {
  "use strict";

  var host = document.getElementById("silent-zero");
  if (!host) return;

  var VALUES = [1240, 860, 412, 97, 1105, 88, 640, 233, 71, 519, 1832, 304,
                126, 745, 268, 953, 61, 1470, 389, 208];

  var T = {
    silent: { ar: "صامت", en: "Silent" },
    loud:   { ar: "عالي الصوت", en: "Loud" },
    capS:   { ar: "الحساب فشل، فصار صفراً. الصفر يشبه أي رقم آخر، فلا شيء يدلّ عليه — ولا تعرف أن شيئاً وقع أصلاً.",
              en: "A computation failed, so it became zero. A zero looks like any other number, so nothing points at it — and you never learn anything went wrong." },
    capL:   { ar: "العطل نفسه، معلَناً: يخرج إلى المقدّمة ويحمل لونه، ويغور كل ما عداه.",
              en: "The same failure, declared: it comes to the front carrying its colour, and everything else recedes." },
    both:   { ar: "الحقلان فيهما العطل نفسه. أحدهما يُريك إيّاه.",
              en: "Both fields contain the same error. One of them shows it." },
    aria:   { ar: "بدّل بين حقلٍ يُخفي العطل وحقلٍ يُعلنه",
              en: "Switch between a field that hides the failure and one that declares it" }
  };

  function lang() { return document.documentElement.lang === "ar" ? "ar" : "en"; }
  function t(k) { return T[k][lang()] !== undefined ? T[k][lang()] : T[k].en; }

  /* بذرة ثابتة: الحقل نفسه في كل زيارة. توزيعٌ يتغيّر مع كل تحميل يجعل
     الصورة مزاجاً لا شكلاً مقصوداً — والعشوائية هنا وسيلة توزيع لا مفاجأة. */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var v = Math.imul(a ^ (a >>> 15), 1 | a);
      v = (v + Math.imul(v ^ (v >>> 7), 61 | v)) ^ v;
      return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
    };
  }

  var rand = mulberry32(20260905);
  var reduced = false;
  try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  host.classList.add("sz");
  host.innerHTML = "";

  var stage = document.createElement("div");
  stage.className = "sz-stage";
  stage.setAttribute("aria-hidden", "true");
  var field = document.createElement("div");
  field.className = "sz-field";
  stage.appendChild(field);

  /* توزيعٌ على شبكة مهزوزة لا عشوائيةٌ حرّة.
     العشوائية الحرّة تُنتج تراكماً: رقمان يقعان فوق بعضهما فيُقرأ الحقل
     إهمالاً لا عمقاً. والشبكة تضمن ألّا يتصادم جاران، والهزّة تمنعها من أن
     تبدو جدولاً. */
  var COLS = 7, ROWS = 6;
  var SPAN_X = 250, SPAN_Y = 132;
  var cells = [];
  var badCol = 3, badRow = 3;          // خانة العطل، محجوزة فلا يزاحمه أحد

  for (var r = 0; r < ROWS; r++) {
    for (var col = 0; col < COLS; col++) {
      if (col === badCol && r === badRow) continue;
      var c = document.createElement("i");
      c.className = "sz-cell";
      var gx = (col / (COLS - 1) - 0.5) * 2 * SPAN_X;
      var gy = (r / (ROWS - 1) - 0.5) * 2 * SPAN_Y;
      var x = gx + (rand() * 2 - 1) * 15;
      var y = gy + (rand() * 2 - 1) * 11;
      var z = -330 + rand() * 350;
      c.style.setProperty("--x", x.toFixed(1) + "px");
      c.style.setProperty("--y", y.toFixed(1) + "px");
      c.style.setProperty("--z", z.toFixed(1) + "px");
      var depth = (z + 330) / 350;               // 0 = الأبعد، 1 = الأقرب
      c.style.setProperty("--o", (0.15 + depth * 0.7).toFixed(2));
      c.textContent = VALUES[Math.floor(rand() * VALUES.length)].toLocaleString("en-US");
      field.appendChild(c);
      cells.push(c);
    }
  }

  /* العطل: يأخذ خانته من الشبكة نفسها فلا يزاحمه جار، ويُدفَن في العمق.
     وما يجعل الصفر الصامت خطيراً ليس أنه صفر، بل أنه يشبه جيرانه تماماً. */
  var bad = document.createElement("i");
  bad.className = "sz-cell sz-bad";
  bad.style.setProperty("--x", ((badCol / (COLS - 1) - 0.5) * 2 * SPAN_X).toFixed(1) + "px");
  bad.style.setProperty("--y", ((badRow / (ROWS - 1) - 0.5) * 2 * SPAN_Y).toFixed(1) + "px");
  bad.style.setProperty("--z", "-235px");
  bad.style.setProperty("--o", "0.4");
  bad.textContent = "0";
  field.appendChild(bad);

  var sw = document.createElement("div");
  sw.className = "sz-switch";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sz-btn";
  btn.setAttribute("aria-pressed", "false");
  var track = document.createElement("span");
  track.className = "sz-track";
  var lblS = document.createElement("span");
  lblS.className = "sz-lbl sz-lbl-s";
  var lblL = document.createElement("span");
  lblL.className = "sz-lbl sz-lbl-l";
  btn.appendChild(lblS); btn.appendChild(track); btn.appendChild(lblL);
  sw.appendChild(btn);

  var cap = document.createElement("p");
  cap.className = "sz-cap";
  cap.setAttribute("aria-live", "polite");
  var both = document.createElement("p");
  both.className = "sz-both";

  host.appendChild(sw);
  host.appendChild(stage);
  host.appendChild(cap);
  host.appendChild(both);

  var loud = false;

  function paint() {
    host.classList.toggle("is-loud", loud);
    btn.setAttribute("aria-pressed", loud ? "true" : "false");
    btn.setAttribute("aria-label", t("aria"));
    lblS.textContent = t("silent");
    lblL.textContent = t("loud");
    bad.textContent = loud ? "0" : "0";
    cap.textContent = loud ? t("capL") : t("capS");
    both.textContent = t("both");
  }

  btn.addEventListener("click", function () { loud = !loud; paint(); });
  paint();

  /* المنظور يتبع الفأرة قليلاً. هذا ما يجعل CSS ثلاثيّ الأبعاد يُقرأ بُعداً
     لا ميلاناً: العين تصدّق العمق حين يتغيّر التزاحم مع الحركة. */
  if (!reduced) {
    var rx = 0, ry = 0, tx = 0, ty = 0, raf = null;
    function loop() {
      rx += (tx - rx) * 0.06;
      ry += (ty - ry) * 0.06;
      field.style.transform = "rotateX(" + ry.toFixed(2) + "deg) rotateY(" + rx.toFixed(2) + "deg)";
      raf = (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01)
        ? requestAnimationFrame(loop) : null;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 13;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 9;
      kick();
    });
    stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
  }

  host.__relabel = paint;
  document.addEventListener("i18n:changed", function () { paint(); });
})();
