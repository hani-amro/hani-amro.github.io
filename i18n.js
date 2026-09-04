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
    "c1": "دخلاً مؤكَّداً مدى الحياة عبر ستّة أنظمة — خمس دفعات من مشترِكَين. هذا كل ما باعته هذه الأنظمة.",
    "c2": "أمر تنفيذ سجّلته منصّة نسخ الصفقات، 175 منها ما زال مرتبطاً بمشترك قائم",
    "c3": "اختباراً يمرّ على «وين»، وتغطية فروع 100% على حزمة المال مفروضةً بوابةَ بناء",
    "c4": "أداء Lighthouse على النشر الحيّ — وصولية 1.00 · SEO 1.00",
    "foot": "كل رقم هنا يُنتجه أمر أستطيع تشغيله أمامك، وما لا يُنتجه أمر ليس على هذه الصفحة. بما فيه الرقم الأهم: خارج هذين المشترِكَين، لا نظام من هذه الأنظمة له زبون يدفع.",

    /* ---------- case studies ---------- */
    "cs-h": "أعمال مختارة",
    "cs-l": "أربعة أنظمة، مع المشكلة التي حلّها كلٌّ منها والنتيجة التي حقّقها.",
    "lbl-p": "المشكلة",
    "lbl-a": "ما بنيته",
    "lbl-r": "النتيجة",

    "k1-h": "ALTAJIR — منصّة نسخ صفقات",
    "k1-t": "شريك مؤسس ومهندس النظام · التنفيذ متوقّف منذ آب 2026",
    "k1-p": "المحلّل يرسل توصياته في مجموعة دردشة، وكل مشترك عليه أن يقرأها ويفسّرها وينفّذها يدوياً — بطء، وأخطاء، واستحالة تدقيق.",
    "k1-a": "منصّة تستقبل تعليمة واحدة من المحلّل، تُخضعها لثمانية فحوصات آلية، ثم تنفّذها على حساب كل مشترك لدى الوسيط. وتقارير الأداء اليومية والشهرية تصدر تلقائياً.",
    "k1-r": "998 أمر تنفيذ مسجَّل — 175 منها ما زال مرتبطاً بمشترك قائم، والباقي فقد ارتباطه حين حُذفت تلك الحسابات. وهوية الربح تحقّقتُ منها على ثلاثة حسابات اسمها Demo وDemo2 وDemo10. لم يُقرأ رصيد أي مشترك بنجاح قط، وآخر أمر تنفيذ كان في 24 آب 2026‏.",
    "k1-n": "<b>قرار يُسأل عنه كثيراً:</b> النسخة الأولى بُنيت على أداة أتمتة بلا كود. بعد 22 محاولة لجعلها سريعة بما يكفي، تبيّن أن الأداة نفسها هي الحد الأقصى — فأعدت بناء النواة بالكود.",
    "k1-s": "Node.js · PostgreSQL · MetaApi · Telegram Bot API · nginx · PM2",

    "k2-h": "وين — منصة اكتشاف فعاليات وحجز تذاكر في الإمارات",
    "k2-t": "عرض تجريبي حيّ · صفر مستخدم حقيقي · الدفع محاكاة",
    "k2-p": "في كل تذكرة تُباع، ثلاثة أطراف تُدفع من مبلغ واحد: صاحب الفعالية، والمنصّة، والضريبة. وإذا اختلّ هذا التقسيم بصمت، لا ينتبه أحد إلا بعد أن يكون المال قد خرج.",
    "k2-a": "كل عملية بيع تكتب قيودها داخل معاملة واحدة، وزنادُ قيدٍ مؤجَّل يفحص عند COMMIT أن مجموعها صفر بالضبط. فنصفُ قيدٍ لا يستطيع أن يمرّ — ترفضه القاعدة نفسها، لا مراجعُ شيفرة. وحجز التذكرة تحديثٌ شرطي ذرّي واحد، فعشرون مشترياً متزامناً على مقعدين يعطون فائزَين اثنين بالضبط، بلا بيع زائد.",
    "k2-r": "323 اختباراً يمرّ، وتغطية فروع 100% على حزمة المال بوابةَ بناء، و57 قيد CHECK عبر ستة عشر ملف ترحيل. وإعادةُ اشتقاق هامش المنصّة من الأصل أمسكت خطأ 1.90 درهم لكل طلب في موجز مشروعي أنا — كان يعدّ ضريبةً محصَّلة ربحاً للمنصّة.",
    "k2-n": "<b>وما هو ليس:</b> عرض تجريبي، عن قصد. صفر مستخدم حقيقي، وبوابة الدفع محاكاة كاملة، والبريد يُكتب في ملف ولا يُرسَل، وبيانات العرض يمحوها cron ويعيد بذرها كل يوم 03:00 UTC. والمستودع يبقى خاصاً لأن تاريخه يحمل جرد خادم يستضيف ستة مواقع عملاء ليست لي.",
    "k2-s": "TypeScript · Next.js 16 · NestJS 11 · PostgreSQL 18 · Drizzle · Valkey · Flutter · Docker",

    "k3-h": "QuickDrop — نظام طلبات وتوصيل عبر WhatsApp",
    "k3-t": "مكتمل البناء · قبل الإطلاق",
    "k3-p": "المتاجر الصغيرة توزّع طلباتها بين الدردشة والورق والمكالمات. الأخطاء تتراكم، ولا أحد يعرف أين السائق.",
    "k3-a": "الزبون يطلب عبر WhatsApp ويدفع، فيُعيَّن له سائق تلقائياً. المتجر يحصل على لوحة تحكم بالعربية أو الإنجليزية أو الملايوية، والسائق على تطبيق، والزبون على رابط تتبع. مع كتالوج وتسعير وكوبونات ونقاط ولاء وتسويات مالية.",
    "k3-r": "44,205 سطر TypeScript، و434 اختباراً يمرّ من 567 حالة — 132 منها خلف حرّاس بيئة ولم تعمل. ولا يمكن لأي متجر أن يرى طلبات متجر آخر، تمنعه قاعدة البيانات نفسها (PostgreSQL Row-Level Security). ولا طلب واحد وصل التسليم: أربعة طلبات تجريبية في 20 تموز 2026، ما زالت كلها عند <em>confirmed</em>‏.",
    "k3-s": "TypeScript · NestJS · PostgreSQL (RLS, PostGIS) · Redis · WhatsApp Business API · Docker",

    "k4-h": "أتمتة دورة حياة الاشتراكات",
    "k4-t": "3 حسابات فعّالة · دفع منها اثنان · 240$ حتى اليوم",
    "k4-p": "إدارة الاشتراكات المدفوعة يدوياً — التحقق من إثباتات الدفع، وإرسال الدعوات، وملاحقة تواريخ الانتهاء — تستهلك ساعات، ويتسرّب الوصول عندما ينسى أحدهم.",
    "k4-a": "إثبات دفع يصل، فموافقة، فدعوة لمرة واحدة، فتذكير قبل الانتهاء بثلاثة أيام ثم بيوم، فإزالة في اليوم المحدد. ولا أحد يراقب تقويماً.",
    "k4-r": "401 اختبار يمرّ، 27 منها وُجدت خصّيصاً لتثبت أن مستأجراً لا يقرأ صفوف غيره. وبيانات اعتماد كل عميل مشفّرة في مكان تخزينها. والتحفّظ الصادق: هذه الاختبارات كلها تعمل على SQLite بينما الإنتاج PostgreSQL — وهذه الفجوة بالذات أخفت مرّةً ميزةً مرّت على لوحة خضراء وكانت مستحيلة على الإنتاج.",
    "k4-s": "Python · aiogram · SQLAlchemy · PostgreSQL · Alembic · Docker",

    /* ---------- live demos ---------- */
    "d-h": "جرّبها بنفسك",
    "d-l": "هذه أنظمة تعمل الآن فعلاً — لا لقطات شاشة.",
    "d1-t": "تجربة تفاعلية",
    "d1-h": "مساعد متجر ذكي يذكر مصادره",
    "d1-p": "اسأله عن أي منتج فيجيبك من صفحات المتجر الفعلية — ويُسمّي الصفحة التي قرأ منها. وإذا سألته عمّا لم ينشره المتجر أصلاً، يقول لك ذلك بوضوح ويعرض تحويلك إلى إنسان. يعمل بالعربية والإنجليزية.",
    "go1": "افتح التجربة",
    "d2-t": "واجهة منشورة · بلا استعمال مدفوع بعد",
    "d2-h": "26 أداة PDF مع OCR عربي",
    "d2-p": "دمج، تقسيم، ضغط، حماية، واستخراج النص — حتى من المستندات العربية الممسوحة ضوئياً. الملفات تُعالج في الذاكرة ولا تُخزَّن أبداً. منشورة على RapidAPI، ولم تخدم بعدُ طلباً ناجحاً واحداً.",
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
    "o1-t": "إعادات التشغيل", "o1-d": "<b>صفر</b> إعادة تشغيل آلية على أربع حاويات منذ 28 تموز 2026 — تاريخ، لا رصيد متراكم",
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
    "r1": "منصّة التوصيل المذكورة أعلاه. 44,205 سطر TypeScript، و434 اختباراً يمرّ من 567، وعزل على مستوى الصف في 39 جدولاً.",
    "r2": "دعم قرار لفحص تخطيط القلب (12-lead): نموذج تعلّم عميق معايَر (macro-AUROC 0.9335 للنموذج المخدوم) مع محرك قواعد سريرية من 1,234 سطراً. ويأتي مع بطاقة نموذج صادقة تبدأ بنقاط ضعفه — ففي الطب، معرفة متى <em>لا</em> تثق بالنموذج هي جوهر الأمر.",
    "r3": "يجعل تسريب البيانات بين العملاء مستحيل الكتابة حتى بالخطأ، في SQLAlchemy 2.0‏.",
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
