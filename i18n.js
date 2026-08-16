/* Arabic / English, including direction.

   The Arabic below is a transcreation, not a translation: the meaning was
   rewritten in natural Arabic rather than mapped word for word, so a sentence
   will often be shaped differently from its English counterpart. That is
   deliberate -- a literal rendering of idiomatic English reads as machine output
   and costs the credibility the page is trying to build.

   Three rules run through it:
     - Technical terms stay Latin inside Arabic prose (API, WhatsApp, uptime,
       backups). Arabised equivalents read as amateur to the audience.
     - Numerals stay Western (1, 2, 3), which is the norm in Gulf business
       writing.
     - The language button shows the language you would switch TO, so it is
       readable to someone who cannot read the current one.

   The English copy lives in the HTML, so crawlers and JS-disabled visitors get
   real text; the English table is captured from the DOM at load, which means the
   two versions cannot drift apart.

   window.__i18nAudit() reports any visible text with no key. */

(function () {
  "use strict";

  var AR = {
    /* ---------- hero ---------- */
    "eyebrow": "مهندس أتمتة بالذكاء الاصطناعي",
    "h1": "هاني عمرو",
    "h1b": "هاني عمرو",
    "lede": "أساعد الشركات على استبدال العمل اليدوي المتكرر بأنظمة تعمل من تلقاء نفسها — طلبات WhatsApp، وفواتير، ومدفوعات، وتقارير — وأتولّى تشغيل هذه الأنظمة بعد إطلاقها، لا تسليمها والاختفاء.",
    "loc": "مقيم في ماليزيا (UTC+8)",
    "open": "جاهز للانتقال إلى الإمارات",
    "rem": "متاح للعمل عن بُعد",
    "wa": "راسلني على WhatsApp",
    "cv": "حمّل السيرة الذاتية",
    "see": "شاهد الأنظمة تعمل",
    "viz": "طلب يصل، يُقرأ، ثم يمرّ على فحص. وما يرسب في الفحص يتوقّف هناك بدل أن يكمل طريقه.",

    /* ---------- what I do ---------- */
    "w-h": "ماذا أقدّم",
    "w1-h": "أربط أدواتك في مسار واحد",
    "w1-p": "رسالة WhatsApp واحدة تتحوّل تلقائياً إلى طلب، ففاتورة، فتوصيل، فإيصال. أربط الأدوات التي تستخدمها شركتك أصلاً بحيث لا يعيد أحد إدخال أي بيانات يدوياً.",
    "w2-h": "أستخدم الذكاء الاصطناعي حيث يكون آمناً — وأبعده عن أموالك",
    "w2-p": "الذكاء الاصطناعي يقرأ ويصنّف ويصوغ المسودات. أما الأسعار والمدفوعات فتحسبها برمجة تقليدية دقيقة لها الكلمة الأخيرة فوق الذكاء الاصطناعي. تحصل على سرعته دون المراهنة بإيراداتك عليه.",
    "w3-h": "أشغّل ما أبنيه",
    "w3-p": "استضافة، ومراقبة، ونسخ احتياطي، وتنبيهات — وأنا من يتلقّى الاتصال عندما يتعطّل شيء. التسليم عندي يعني نظاماً يعمل، لا مجلد ملفات.",

    /* ---------- proof bar ---------- */
    "pr-h": "أرقام أستطيع إثباتها",
    "c1": "أمر تداول نُفّذ على حسابات وساطة حقيقية — أموال فعلية، مطابِقة لكشف الوسيط",
    "c2": "خدمات في بيئة إنتاج فعلية، بنيتُها وأشغّلها كاملةً بنفسي",
    "c3": "يوماً من التشغيل المتواصل على بنية تحتية أديرها بنفسي، دون أي إعادة تشغيل غير مخطّطة",
    "c4": "حدثاً عالجتها أتمتة تداول واحدة — كل حدث منها مسجّل وقابل للتدقيق",
    "foot": "قياسات آب 2026. اسألني عن مصدر أي رقم في هذه الصفحة وسأريك إيّاه.",

    /* ---------- case studies ---------- */
    "cs-h": "أعمال مختارة",
    "cs-l": "أربعة أنظمة، مع المشكلة التي حلّها كلٌّ منها والنتيجة التي حقّقها.",
    "lbl-p": "المشكلة",
    "lbl-a": "ما بنيته",
    "lbl-r": "النتيجة",

    "k1-h": "ALTAJIR — منصّة نسخ صفقات",
    "k1-t": "شريك مؤسس ومهندس النظام · تعمل الآن · أموال حقيقية",
    "k1-p": "المحلّل يرسل توصياته في مجموعة دردشة، وكل مشترك عليه أن يقرأها ويفسّرها وينفّذها يدوياً — بطء، وأخطاء، واستحالة تدقيق.",
    "k1-a": "منصّة تستقبل تعليمة واحدة من المحلّل، تُخضعها لثمانية فحوصات آلية، ثم تنفّذها على حساب كل مشترك لدى الوسيط. وتقارير الأداء اليومية والشهرية تصدر تلقائياً.",
    "k1-r": "913 أمراً و110 صفقات مكتملة على حسابات حقيقية. أرقام الأرباح مطابِقة تماماً لأرقام الوسيط، متحقَّقٌ منها على ثلاثة حسابات فعلية.",
    "k1-n": "<b>قرار يُسأل عنه كثيراً:</b> النسخة الأولى بُنيت على أداة أتمتة بلا كود. بعد 22 محاولة لجعلها سريعة بما يكفي، تبيّن أن الأداة نفسها هي الحد الأقصى — فأعدت بناء النواة بالكود.",
    "k1-s": "Node.js · PostgreSQL · MetaApi · Telegram Bot API · nginx · PM2",

    "k2-h": "Gold-AI — نظام تداول ذاتي",
    "k2-t": "يعمل الآن",
    "k2-p": "الأسواق تتحرك على مدار الساعة، ولا يمكن لإنسان أن يراقب ويقيّم ويتصرّف كل ثلاثين ثانية — ولا يجوز الاعتماد عليه في ذلك باستمرار.",
    "k2-a": "حلقة من خمس خطوات تعمل كل 30 ثانية: راقِب، قيّم، وازن المخاطرة، نفّذ، تابع. الذكاء الاصطناعي يتولّى القراءة والتقييم، أما الخطوتان اللتان تمسّان المال فكود خالص تحكمه ست قواعد صارمة لا يستطيع الذكاء الاصطناعي تجاوزها. وفي نهاية كل يوم يراجع النظام ما ربح وما خسر ويعيد كتابة تعليماته بنفسه.",
    "k2-r": "378,110 حدثاً معالَجاً · 3,144 قراراً · 323 صفقة بنتائج موثّقة.",
    "k2-s": "Python · Claude API · MetaTrader 5 · SQLite · Flask",

    "k3-h": "QuickDrop — نظام طلبات وتوصيل عبر WhatsApp",
    "k3-t": "مكتمل البناء · قبل الإطلاق",
    "k3-p": "المتاجر الصغيرة توزّع طلباتها بين الدردشة والورق والمكالمات. الأخطاء تتراكم، ولا أحد يعرف أين السائق.",
    "k3-a": "الزبون يطلب عبر WhatsApp ويدفع، فيُعيَّن له سائق تلقائياً. المتجر يحصل على لوحة تحكم بالعربية أو الإنجليزية أو الملايوية، والسائق على تطبيق، والزبون على رابط تتبع. مع كتالوج وتسعير وكوبونات ونقاط ولاء وتسويات مالية.",
    "k3-r": "44,205 سطراً من الكود، و571 اختباراً آلياً. ولا يمكن لأي متجر أن يرى طلبات متجر آخر — قاعدة البيانات نفسها تمنع ذلك (PostgreSQL Row-Level Security).",
    "k3-s": "TypeScript · NestJS · PostgreSQL (RLS, PostGIS) · Redis · WhatsApp Business API · Docker",

    "k4-h": "أتمتة دورة حياة الاشتراكات",
    "k4-t": "نسخة تجريبية",
    "k4-p": "إدارة الاشتراكات المدفوعة يدوياً — التحقق من إثباتات الدفع، وإرسال الدعوات، وملاحقة تواريخ الانتهاء — تستهلك ساعات، ويتسرّب الوصول عندما ينسى أحدهم.",
    "k4-a": "إثبات دفع يصل، فموافقة، فدعوة لمرة واحدة، فتذكير قبل الانتهاء بثلاثة أيام ثم بيوم، فإزالة في اليوم المحدد. ولا أحد يراقب تقويماً.",
    "k4-r": "173 فحصاً آلياً، بينها فحص يثبت أنّه لا يمكن لأي عميل أن يرى بيانات عميل آخر. وبيانات اعتماد كل عميل مشفّرة في مكان تخزينها.",
    "k4-s": "Python · aiogram · SQLAlchemy · PostgreSQL · Alembic · Docker",

    /* ---------- live demos ---------- */
    "d-h": "جرّبها بنفسك",
    "d-l": "هذه أنظمة تعمل الآن فعلاً — لا لقطات شاشة.",
    "d1-t": "تجربة تفاعلية",
    "d1-h": "مساعد متجر ذكي يذكر مصادره",
    "d1-p": "اسأله عن أي منتج فيجيبك من صفحات المتجر الفعلية — ويُسمّي الصفحة التي قرأ منها. وإذا سألته عمّا لم ينشره المتجر أصلاً، يقول لك ذلك بوضوح ويعرض تحويلك إلى إنسان. يعمل بالعربية والإنجليزية.",
    "go1": "افتح التجربة",
    "d2-t": "خدمة تجارية",
    "d2-h": "26 أداة PDF مع OCR عربي",
    "d2-p": "دمج، تقسيم، ضغط، حماية، واستخراج النص — حتى من المستندات العربية الممسوحة ضوئياً. الملفات تُعالج في الذاكرة ولا تُخزَّن أبداً. تُباع تجارياً عبر RapidAPI.",
    "go2": "افتح التوثيق",

    /* ---------- how I work ---------- */
    "p-h": "كيف أعمل",
    "p1-h": "الأخطاء تُعلن عن نفسها",
    "p1-p": "إذا عجز النظام عن حساب شيء، يقوله في مكان تراه. <em>الصفر الصامت يتحوّل إلى عرض سعر منخفض لا ينتبه له أحد إلا بعد أن يكلّف مالاً.</em>",
    "p2-h": "الذكاء الاصطناعي يقترح، والكود يقرّر",
    "p2-p": "الذكاء الاصطناعي يقرأ ويصنّف ويصوغ. أما الأسعار والمدفوعات فيحسبها كود دقيق حتمي — وللكود الكلمة الأخيرة فوق الذكاء الاصطناعي، في كل مرة.",
    "p3-h": "كل رقم يُظهر تفاصيله",
    "p3-p": "كل قيمة تأتي معها مكوّناتها، ليستطيع العميل أن يناقش الرقم بدل أن يقرّر في صمت أنّه لا يثق به.",
    "p4-h": "كل نظام يصرّح بحدوده",
    "p4-p": "ما لا يستطيع النظام فعله موثّق إلى جانب ما يستطيعه — وهذا ما يجعل الباقي قابلاً للتصديق.",

    "ai-h": "مبنيّ بالذكاء الاصطناعي، ومسؤوليتي عنه",
    "ai-p": "أبني باستخدام مساعدات البرمجة بالذكاء الاصطناعي — وأتحمّل مسؤولية كل سطر يصل إلى الإنتاج. أنا من يحدّد المعمارية، ويراجع ويصحّح كل ما ينتجه الذكاء الاصطناعي، ويقرّر ما يُنشر، ويشغّله بعد ذلك. الحكم والقرارات وإصلاحات الثالثة فجراً كلها عليّ. وكل قرار تقني في هذه الصفحة قرارٌ اتخذته وأستطيع شرحه — بما فيها القرارات التي تبيّن خطؤها.",

    "rel-h": "الموثوقية عملياً",
    "o1-t": "التشغيل", "o1-d": "<b>+64 يوماً</b> دون إعادة تشغيل غير مخطّطة",
    "o2-t": "النسخ الاحتياطي", "o2-d": "يومي، ويُختبر بالاستعادة الفعلية لا بالافتراض",
    "o3-t": "الوصول", "o3-d": "كل الخدمات خلف مدخل مشفّر واحد",
    "o4-t": "التعافي", "o4-d": "تلقائي، بحدّ ثلاث محاولات بدل الدوران إلى ما لا نهاية",
    "o5-t": "التنبيهات", "o5-d": "تصلني قبل أن يلاحظ العميل",

    /* ---------- tech stack ---------- */
    "ts-h": "الأدوات التي أعمل بها",
    "ts1-t": "اللغات", "ts1-d": "Python · TypeScript / Node.js · SQL",
    "ts2-t": "الخلفية", "ts2-d": "FastAPI · NestJS · Express · Hono · SQLAlchemy · Drizzle · aiogram",
    "ts3-t": "البيانات", "ts3-d": "PostgreSQL (Row-Level Security, PostGIS) · Redis · SQLite · Cloudflare D1 · Alembic migrations",
    "ts4-t": "التكامل", "ts4-d": "WhatsApp Business API · Telegram Bot API · MetaApi · Stripe · Billplz · REST APIs · webhooks · n8n",
    "ts5-t": "الذكاء الاصطناعي", "ts5-d": "تكامل LLM (RAG، وكلاء، حواجز أمان) · Claude API · إصدارات prompts · OCR بالعربية والإنجليزية · PyTorch",
    "ts6-t": "الواجهات", "ts6-d": "React · Next.js · Vite · Tailwind · PWA · واجهات عربية RTL وثنائية الاتجاه",
    "ts7-t": "التشغيل", "ts7-d": "إدارة خوادم Linux · Docker · nginx · systemd · PM2 · GitHub Actions · Cloudflare Workers · نسخ احتياطي مُختبَر · مراقبة وتنبيهات",

    /* ---------- code ---------- */
    "code-h": "كود يمكنك قراءته",
    "code-l": "لمن يفضّل فحص العمل بنفسه بدل أخذ كلامي على عِلّاته.",
    "r1": "منصّة التوصيل المذكورة أعلاه. 44,205 سطراً، و571 اختباراً آلياً، TypeScript مع PostgreSQL RLS.",
    "r2": "دعم قرار لفحص تخطيط القلب (12-lead): نموذج تعلّم عميق معايَر مع محرك قواعد سريرية من 1,234 سطراً. ويأتي مع بطاقة نموذج صادقة تبدأ بنقاط ضعفه — ففي الطب، معرفة متى <em>لا</em> تثق بالنموذج هي جوهر الأمر.",
    "r3": "يجعل تسريب البيانات بين العملاء مستحيل الكتابة حتى بالخطأ، في SQLAlchemy 2.0.",
    "r4": "اختبارات إحصائية (Deflated Sharpe، PBO/CSCV، اختبار التبديل) تكشف ما إذا كانت استراتيجية التداول وجدت ميزة حقيقية أم أن الحظ حالفها فقط.",
    "r5": "يحوّل المخططات الإنشائية إلى عرض سعر عربي مسعّر، مع بيان كامل خلف كل رقم.",
    "r6": "خدمة الـPDF أعلاه: 26 أداة، OCR عربي وإنجليزي، ولا شيء يُخزَّن.",

    /* ---------- contact ---------- */
    "ct-h": "لنتحدث",
    "ct-l": "متاح لأعمال الأتمتة والتكامل — بعقد، عمل حر، أو دوام كامل.",
    "ct-l2": "أخبرني ما الذي لا يزال فريقك ينجزه يدوياً، وسأخبرك بصراحة إن كان يستحق الأتمتة أم لا.",
    "wa2": "راسلني على WhatsApp",
    "cv2": "حمّل السيرة الذاتية",

    /* ---------- footer ---------- */
    "loc2": "ماليزيا",
    "footer": "هذه النسخة العربية كُتبت بالعربية أصلاً — لم تُترجم آلياً."
  };

  var root = document.documentElement;
  var KEY = "lang";
  var btn = document.getElementById("lang-toggle");
  var nodes = document.querySelectorAll("[data-i18n]");
  var EN = {};

  Array.prototype.forEach.call(nodes, function (el) {
    EN[el.dataset.i18n] = el.innerHTML;
  });

  function apply(lang) {
    var table = lang === "ar" ? AR : EN;
    var missing = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var v = table[el.dataset.i18n];
      if (v === undefined) missing.push(el.dataset.i18n);
      else el.innerHTML = v;
    });
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (btn) {
      // Show the language you would switch TO, so the button is readable to
      // someone who cannot read the language currently on screen.
      btn.textContent = lang === "ar" ? "English" : "العربية";
      btn.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    }
    if (missing.length) console.warn("i18n: no Arabic for", missing);
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "ar") apply("ar");

  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.lang === "ar" ? "en" : "ar";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  /* Audit: find visible text that no key covers, and keys nothing uses. Run
     window.__i18nAudit() after adding copy -- an untagged paragraph would
     otherwise stay English forever without anyone noticing. */
  window.__i18nAudit = function () {
    var skip = { SCRIPT: 1, STYLE: 1, CANVAS: 1, SVG: 1, BUTTON: 1, DEFS: 1 };
    var loose = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var text = node.nodeValue.trim();
      if (text.length < 3) continue;
      var el = node.parentElement;
      if (!el || skip[el.tagName]) continue;
      if (el.closest("[data-i18n]")) continue;
      loose.push({
        text: text.slice(0, 70),
        where: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : "")
      });
    }
    var unused = Object.keys(AR).filter(function (k) {
      return !document.querySelector('[data-i18n="' + k + '"]');
    });
    console.table(loose);
    console.log("untranslated text nodes:", loose.length, "| unused keys:", unused);
    return { loose: loose, unused: unused };
  };
})();
