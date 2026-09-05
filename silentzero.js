/* «الصفر الصامت» — حقلُ قيمٍ في العمق، وفيه عطل.
 *
 * هذه أكثر جملة تتكرّر في عملي: **الصفر الصامت أسوأ فشل ممكن**. وهي على
 * الصفحة مكتوبةٌ في ثلاثة مواضع، فليكن أوّل ما يُرى منها أنها **تحدث**.
 *
 * الحقلان في المفتاحين يحملان العطل نفسه. في «صامت» يعود الحساب الفاشل صفراً
 * لا يميّزه شيء عن جاره، ويبقى حيث سقط — بعيداً، صغيراً، بين واحدٍ وأربعين
 * رقماً. وفي «عالي الصوت» يخرج إلى المقدّمة ويصفرّ، ويغور كل ما عداه.
 * والفرق ليس في وجود العطل بل في أن أحدهما يُريكه.
 *
 * ولماذا العمق تحديداً: البُعد الثالث هنا ليس تجميلاً — هو **مقدار ما دُفن
 * فيه العطل**. رقمٌ عند z = -340 لا يُقرأ أصلاً، وهذا هو المعنى بالضبط.
 *
 * **وهذا الملفّ لا يكتب نصّاً ولا يبني هيكلاً.** الزرّ والتعليقان والسطر
 * الأخير مكتوبةٌ في `engineer.html`، وترجمتها في `i18n.js` كبقيّة الصفحة.
 * كانت تُبنى هنا، فكان الشكل صفرَ الارتفاع عند أول رسمة ثم يقفز إلى نحو
 * خمسمئة بكسل، فيدفع الصفحة كلَّها تحته: 0.0773 من CLS قاسها Lighthouse على
 * الحيّ. وما لا يكتبه الـJS لا يحتاج جدول ترجمةٍ ثانياً يفترق عن الأوّل.
 *
 * وبـCSS لا WebGL: واحدٌ وأربعون عنصراً بتحويلات ثلاثية، وما يبيع العمق هو
 * الكثافة وتدرّج الحجم وعمق الميدان مع البُعد — لا شدّة الميلان.
 */
(function () {
  "use strict";

  var host = document.getElementById("silent-zero");
  if (!host) return;
  var field = host.querySelector(".sz-field");
  var stage = host.querySelector(".sz-stage");
  var btn = host.querySelector(".sz-btn");
  if (!field || !stage || !btn) return;

  var VALUES = [1240, 860, 412, 97, 1105, 88, 640, 233, 71, 519, 1832, 304,
                126, 745, 268, 953, 61, 1470, 389, 208];


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

  /* توزيعٌ على شبكة مهزوزة لا عشوائيةٌ حرّة.
     العشوائية الحرّة تُنتج تراكماً: رقمان يقعان فوق بعضهما فيُقرأ الحقل
     إهمالاً لا عمقاً. والشبكة تضمن ألّا يتصادم جاران، والهزّة تمنعها من أن
     تبدو جدولاً. */
  var COLS = 7, ROWS = 6;
  var SPAN_X = 250, SPAN_Y = 132;
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
      /* العمق بالحجم والتمويه، لا بالشفافية.
         الشفافية تُنتج نصّاً ضعيف التباين، فيسقط في كل فاحص وصولية — ويبقى
         الدفاع عنه استثناءً يُشرَح. والبُعد البصري لا يحتاجه أصلاً: عمق
         الميدان (blur) أصدق منه، والحجم يكفي. فاللون ثابتٌ مارّ، والبُعد
         مقروء، ولا استثناء يُدافَع عنه. */
      var depth = (z + 330) / 350;               // 0 = الأبعد، 1 = الأقرب
      c.style.setProperty("--fs", (10.5 + depth * 6).toFixed(1) + "px");
      c.style.setProperty("--bl", ((1 - depth) * 1.9).toFixed(2) + "px");
      c.textContent = VALUES[Math.floor(rand() * VALUES.length)].toLocaleString("en-US");
      field.appendChild(c);
    }
  }

  /* العطل: يأخذ خانته من الشبكة نفسها فلا يزاحمه جار، ويُدفَن في العمق.
     وما يجعل الصفر الصامت خطيراً ليس أنه صفر، بل أنه يشبه جيرانه تماماً. */
  var bad = document.createElement("i");
  bad.className = "sz-cell sz-bad";
  bad.style.setProperty("--x", ((badCol / (COLS - 1) - 0.5) * 2 * SPAN_X).toFixed(1) + "px");
  bad.style.setProperty("--y", ((badRow / (ROWS - 1) - 0.5) * 2 * SPAN_Y).toFixed(1) + "px");
  bad.style.setProperty("--z", "-235px");
  bad.style.setProperty("--fs", "12.1px");
  bad.style.setProperty("--bl", "1.03px");
  bad.textContent = "0";
  field.appendChild(bad);

  var loud = false;

  function paint() {
    host.classList.toggle("is-loud", loud);
    btn.setAttribute("aria-pressed", loud ? "true" : "false");
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

})();
