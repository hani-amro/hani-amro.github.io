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
    /* ---------- البوّابة ---------- */
    "g-eyebrow": "مهندس أنظمة · بالعربية والإنجليزية",
    "g-lede": "ببني أنظمة بتمسك مصاري وطلبات وبيانات زباين — وبتضلّ شغّالة لما ما يكون في حدا مراقبها. وفي مدخلان، حسب ليش إجيت.",
    "g-d1-h": "عندي شركة",
    "g-d1-p": "إنت بتعرف شو لسّا فريقك بيعمله بالإيد. هالجهة فيها شو بقدر أبنيلك، وكيف بيمشي الشغل من أول مكالمة لتسليم، وقدّيش بيكلّف — وشو ما بستلمه.",
    "g-d1-go": "شو بقدر أبنيلك",
    "g-d2-h": "أنا تقني",
    "g-d2-p": "ستّة أنظمة، ومعها الآلية بالضبط اللي بتخلّي كل واحد آمن، والكود اللي بيفرضها، وأشياء حيّة بتقدر تفتحها هلق، وكل رقم جنبه الأمر اللي أنتجه — بما فيها الأرقام اللي صفر.",
    "g-d2-go": "الهندسة",
    "g-rule": "قاعدة واحدة بتحكم الصفحتين: رقمٌ بلا أمر يُنتجه مش موجود على الصفحة.",
    "g-back": "المدخلان",

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
    "c3": "اختباراً يمرّ على «وين»، وتغطية فروع ⁦100%⁩ على حزمة المال مفروضةً بوابةَ بناء",
    "c4": "أداء Lighthouse على النشر الحيّ — وصولية 1.00 · SEO 1.00",
    "foot": "كل رقم هنا يُنتجه أمر أستطيع تشغيله أمامك، وما لا يُنتجه أمر ليس على هذه الصفحة. بما فيه الرقم الأهم: خارج هذين المشترِكَين، لا نظام من هذه الأنظمة له زبون يدفع.",

    "ow-mine": "لي",
    "ow-model": "للنموذج",
    "wb-q": "«بتعرف تكتب كود على السبورة؟»",
    "wb-a": "لن أكتب على سبورة شيفرةً أدّعي أنني أكتبها هكذا في عملي؛ أنا لا أكتبها هكذا، وتمثيلُ ذلك أمامكم يخفي عنكم ما أُجيده فعلاً. والبديل أقوى وأقرب لما ستشترونه: أعطوني عطلاً حقيقياً من نظامكم — سجلّاً، أثرَ خطأ، استعلاماً بطيئاً — وسأشخّصه أمامكم بصوت مسموع: الفرضية، والأمر الذي يقطع فيها، وما الذي ينفيها لو كانت خاطئة. أو اعكسوا الاتجاه: افتحوا أي ملف من أنظمتي واسألوني عن أي سطر — لماذا هذا العمود varchar لا enum، ولماذا هذا الحارس في قاعدة البيانات لا في مراجعة الشيفرة، وأيّ حدٍّ منها مُثبَت باختبار وأيّه مكتوب فقط. وإن كان السطر خطأً سأقول إنه خطأ وأقول ماذا كان يجب أن يكون. أمّا خوارزمية اللوح، فإن كان اجتيازها شرطاً عندكم فسأحضّر لها كما يحضّر أي أحدٍ لامتحان — لكن نتيجتها لن تخبركم شيئاً عمّا سأسلّمه في الأسبوع الأول.",
    "ow1-h": "تعريف «صحيح»",
    "ow1-m": "أنا أحدّد الثابت الذي لا يجوز كسره، وأفرضه في أدنى طبقة تستطيع فرضه — قاعدة البيانات — لا في تعليق ولا في مراجعة شيفرة.",
    "ow1-a": "النموذج يكتب الهجرة والقيد والاختبار الذي يترجم هذا الحدّ إلى شيفرة تعمل.",
    "ow2-h": "ما الذي يستحق أن يُقاس",
    "ow2-m": "أنا من قرّر أن ادّعاء الأمان لا يُصدَّق حتى يقيس نفسه، فأضفتُ عموداً يعدّ مسار الارتداد بدل الثقة بلوحة مؤشّرات كلّها خضراء.",
    "ow2-a": "النموذج كتب الهجرة والحساب والاختبار في دقائق — لكنه لم يكن ليطرح السؤال الذي كشف تسعة امتناعات من ثلاثة وعشرين.",
    "ow3-h": "قرار الإطلاق",
    "ow3-m": "قول «هذا لا يُطلَق» وظيفتي أنا: بوابة من 57 بنداً حكمت على مشروعي بـ⁦26٪⁩ أخضر، وسبب فشل 401 اختبار مكتوب في رسالة الـcommit لا مدفوناً.",
    "ow3-a": "النموذج ينتج السرعة — 137 commit في سبعة أيام — وأنا من يضع أمامها بوابة CI من سبع وظائف و323 اختباراً ووثيقة قرارات تشرح لماذا هذا المسار دون غيره.",

    /* ---------- case studies ---------- */
    "k2-go": "افتح العرض الحيّ",
    "k4-go": "افتحه",
    "k5-h": "ياسمين — مساعد يَعُدّ إخفاقاته بنفسه",
    "k5-t": "مبني ومقيس · اتصال النموذج متوقّف",
    "k5-p": "المساعد المقيَّد بصفحات العميل له إخفاق واحد يهمّ: أن يجيب بما لا يوجد في المصدر. وفحصُ هذا الإخفاق كان هو نفسه مطابقةَ نصٍّ على أول خمسة عشر حرفاً من جملة يستطيع المستأجر تعديلها من لوحته — فينكسر الفحص بمجرّد إعادة صياغتها، وينكسر صامتاً.",
    "k5-a": "حارس رفض لا يعتمد على الصياغة، والمطابقة القديمة تبقى ارتداداً حرفياً، وعمود <code>refusal_via</code> يسجّل أيّ مسار أنتج كل رفض — فيصير النظام يَعُدّ إخفاقاته بدل أن يفترض أن لا إخفاق عنده.",
    "k5-r": "تسعة رفوض من ثلاثة وعشرين كانت تمرّ عبر الارتداد — ⁦39%⁩ — وكل مؤشّر ظاهر أخضر والبوّابة تقول لا فجوات. و198 اختباراً تعمل داخل بيئة Cloudflare Workers الحقيقية.",
    "k5-n": "<b>محكيّة ضدّ مصلحتي:</b> القياس الذي كشف هذا هو القياس الذي بنيتُه أنا، وما كشفه أن ادّعائي عن الأمان كان خاطئاً. واتصال النموذج في العرض العام متوقّف اليوم، فلا رابط هنا — ورابطٌ إلى شيء لن يجيب أسوأ من لا رابط. صفر مستخدم، وصفر دافع.",
    "k5-s": "TypeScript · Cloudflare Workers · Hono · D1 · KV · Claude API مع تخزين مؤقّت للسياق · Vitest",
    "k6-h": "tenant-guard — تسريبٌ لا يراه الاختبار البديهي",
    "k6-t": "عيّنة كود لا منتَج · صفر مستخدم",
    "k6-p": "ذاكرة lambda في SQLAlchemy تُفهرِس على كائن الكود وتتعقّب متغيّرات الإغلاق وحدها. اكتب مرشِّح المستأجر وسيطاً افتراضياً فلا تراه الذاكرة، فيُخدَم المستأجر الثاني صفوفَ الأول — بلا خطأ يُرفَع.",
    "k6-a": "المرشِّح إغلاقاً حقيقياً كي تعيد الذاكرة ربطه، واختبارٌ يشترط أن تكون نتيجتا المستأجرَين <em>متباينتين</em>. أما الاختبار المغري، <code>len(rows) &gt; 0</code>، فيمرّ راضياً على بيانات مسرَّبة — وهكذا ينجو تسريبٌ كهذا من لوحة اختبارات خضراء.",
    "k6-r": "20 اختباراً يمرّ، وتبعية تشغيل واحدة، ونسبة أسطر اختبار إلى مصدر 0.89. ومعها overfit-stats بـ41 اختباراً، ترفض أن تشهد لاستراتيجية تداول لا يمكن تمييزها إحصائياً عن الحظّ.",
    "k6-n": "<b>وما هما ليستا:</b> لا واحدة منهما على PyPI، فـ<code>pip install</code> لا يعمل. ولا يوجد CI — الشارات في الـREADME صور ثابتة كتبتُها بيدي. خمسة commits لكل واحدة، نزلت كلها خلال ساعة واحدة يوم 16 آب 2026، ولا شيء بعدها. هما كود يُقرأ، لا منتَج.",
    "k6-go": "اقرأ الكود",
    "k6-s": "Python 3.10+ · SQLAlchemy 2.0 · numpy · scipy · pytest · MIT",
    "cs-h": "أعمال مختارة",
    "cs-l": "ستّة أنظمة. كلٌّ منها يُري العطل يقع أولاً، ثم الآلية التي تجعله مستحيلاً.",
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
    "k2-r": "323 اختباراً يمرّ، وتغطية فروع ⁦100%⁩ على حزمة المال بوابةَ بناء، و57 قيد CHECK عبر ستة عشر ملف ترحيل. وإعادةُ اشتقاق هامش المنصّة من الأصل أمسكت خطأ 1.90 درهم لكل طلب في موجز مشروعي أنا — كان يعدّ ضريبةً محصَّلة ربحاً للمنصّة.",
    "k2-n": "<b>وما هو ليس:</b> عرض تجريبي، عن قصد. صفر مستخدم حقيقي، وبوابة الدفع محاكاة كاملة، والبريد يُكتب في ملف ولا يُرسَل، وبيانات العرض يمحوها cron ويعيد بذرها كل يوم 03:00 UTC. والمستودع يبقى خاصاً لأن تاريخه يحمل جرد خادم يستضيف ستة مواقع عملاء ليست لي.",
    "k2-s": "TypeScript · Next.js 16 · NestJS 11 · PostgreSQL 18 · Drizzle · Valkey · Flutter · Docker",

    "k3-h": "QuickDrop — نظام طلبات وتوصيل عبر WhatsApp",
    "k3-t": "مكتمل البناء · قبل الإطلاق",
    "k3-p": "المتاجر الصغيرة توزّع طلباتها بين الدردشة والورق والمكالمات. الأخطاء تتراكم، ولا أحد يعرف أين السائق.",
    "k3-a": "الزبون يطلب عبر WhatsApp ويدفع، فيُعيَّن له سائق تلقائياً. المتجر يحصل على لوحة تحكم بالعربية أو الإنجليزية أو الملايوية، والسائق على تطبيق، والزبون على رابط تتبع. مع كتالوج وتسعير وكوبونات ونقاط ولاء وتسويات مالية.",
    "k3-r": "44,205 سطر TypeScript، و434 اختباراً يمرّ من 567 حالة — 132 منها خلف حرّاس بيئة ولم تعمل. ولا يمكن لأي متجر أن يرى طلبات متجر آخر، تمنعه قاعدة البيانات نفسها (PostgreSQL Row-Level Security). ولا طلب واحد وصل التسليم: أربعة طلبات تجريبية في 20 تموز 2026، ما زالت كلها عند <em>confirmed</em>‏.",
    "k3-s": "TypeScript · NestJS · PostgreSQL (RLS, PostGIS) · Redis · WhatsApp Business API · Docker",

    "k4-h": "أتمتة دورة حياة الاشتراكات",
    "k4-t": "3 حسابات فعّالة · دفع منها اثنان · ⁦240$⁩ حتى اليوم",
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

    "ai-h": "مبنيٌّ بالذكاء الاصطناعي، ومملوكٌ لي",
    "ai-p": "القرار المعماري لي، والمواصفة لي، وحدّ القبول الذي يُسقِط العمل أو يُمرّره لي؛ والنموذج يكتب التنفيذ داخل هذه الثلاثة. وهذا ليس تفويضاً للثقة: حين شككتُ في آلية الامتناع في مساعدٍ بنيتُه، أضفتُ عموداً في قاعدة البيانات (<code>messages.refusal_via</code>) يقيس الآلية على نفسها بدل أن يصفها، فظهر أن تسعة امتناعات من ثلاثة وعشرين مرّت عبر مسار الارتداد القديم بينما كل مؤشّر آخر أخضر — عطلٌ ما كان أي اختبار سلوكي ليكشفه. وأقسى وثيقة كتبتُها هي بوابة إطلاق من 57 بنداً حكمت على مشروعي أنا بـ⁦26٪⁩ أخضر فقط، ولكل بندٍ ناقصٍ فيها الأمرُ الذي أثبت نقصه مكتوباً بجانبه. وحين فشل 401 اختبار في كشف عطل إنتاجي كامل في بوت الذهب — الاختبارات على SQLite والإنتاج على PostgreSQL — كتبتُ سبب فشلها في رسالة الـcommit نفسها بدل أن أُصلحه بصمت. والسرعة حقيقية: 137 commit في سبعة أيام على «وين»، لكن خلف بوابة CI من سبع وظائف و323 اختباراً ووثيقة قرارات معمارية تشرح لماذا اختير كل مسار. وأنا أُقاس بما يعمل: النظام يُنشر ويُشغَّل ويُراقَب، وأنا من يستلم العطل في الثالثة فجراً ومن يوقّع على الإصلاح.",

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


  /* الإنجليزية لصفحة «أبني لك» وحدها.

     بقيّة الصفحات مكتوبة بالإنجليزية في الـHTML وتُترجَم إلى العربية عند
     الطلب. وهذه الصفحة معكوسة: قارئها صاحب شركة عربي، فالعربية هي المكتوبة
     في الملف — لا لتفضيل، بل لأن البديل عيبان: وميضٌ إنجليزي قبل أن يعمل
     الـJS، وزاحفُ بحث لا يرى إلا الإنجليزية على صفحة موجَّهة لقارئ عربي. */
  var EN_BUILD = {
    "b7-g1": "Nadim Studio — three rooms, three rendering techniques",
    "b7-g2": "Jeel Mutawazin — Arabic learning for children",
    "g-back": "Both ways in",
    "b-eyebrow": "For a business owner",
    "b-h1": "What I can build for you",
    "b-lede": "Tell me what your team still does by hand &mdash; and I will tell you honestly whether it is worth automating at all. Sometimes the answer is no, and that answer is free.",
    "b-wa": "Tell me what is done by hand",
    "b-see-limits": "Read what I will not take on first",
    "b-can-h": "What I build",
    "b-can-l": "Seven things. Behind each one is something I actually built, and where it is running you can open it yourself.",
    "b1-h": "A site or a shop &mdash; front and back",
    "b1-t": "Proof: a live ticketing platform",
    "b1-p": "A site people actually buy from: catalogue, cart, payment, an emailed receipt, two languages, and a phone layout that is not an afterthought. The part that matters is underneath &mdash; on every sale the money has to split correctly between you, the platform and tax, and stay correct when two people buy the last item at the same second.",
    "b1-n": "<b>You can open it:</b> a ticketing platform for events in the UAE, Arabic and English, running now. It is a demo with no real customers and simulated payment &mdash; but every screen and every calculation in it is real.",
    "b1-go": "Open it",
    "b2-h": "A dashboard that tells you where the money is",
    "b2-t": "Proof: the organizer panel, open to try",
    "b2-p": "Sales as they happen, what you are owed, what has been paid out, refunds and cancellations &mdash; and every figure showing the arithmetic that produced it, so you can argue with a number instead of quietly deciding not to trust it. Each client sees only their own data, and that is enforced by the database, not by a checkbox someone can forget.",
    "b2-n": "<b>You can open it:</b> the organizer panel on the same platform has a published demo account on its sign-in screen. Half of any real product is the screen the owner logs into, and hiding it behind a password means nobody ever sees that half.",
    "b2-go": "Take the tour",
    "b3-h": "A Telegram bot with subscriptions and payments",
    "b3-t": "Proof: running, and it has taken real money",
    "b3-p": "A subscriber pays, you approve, the bot sends a one-time invite, reminds them before expiry and removes them on the day &mdash; without anyone watching a calendar. Payment proof, approval, invitation, reminders, removal, and a record of every step.",
    "b3-n": "<b>The honest figure:</b> three active accounts, two of which actually paid, and $240 taken in total. That is small &mdash; and it is the only money any system on this site has taken, so you are seeing it rather than being told about volume.",
    "b3-go": "Open it",
    "b4-h": "Connecting the tools you already pay for",
    "b4-t": "n8n where it fits, code where it must",
    "b4-p": "One WhatsApp message becomes an order, an invoice, a delivery and a receipt, with nobody retyping anything between screens. For plumbing between services I use n8n, because it is quick to build and you can see the flow. For anything that touches money I write code, because a visual tool cannot be tested and cannot be reasoned about when it silently skips a step.",
    "b4-n": "<b>Learned the hard way:</b> the first version of a trading platform I co-founded ran on a drag-and-drop automation tool. After 22 attempts to make it fast enough, the tool itself turned out to be the ceiling &mdash; so I rebuilt the core in code.",
    "b5-h": "A small phone app for the people doing the work",
    "b5-t": "Proof: a ticket scanner that works offline",
    "b5-p": "Not an app store product &mdash; the narrow tool your staff actually need: scan this, confirm that, record what happened. The one on the ticketing platform scans tickets at the door <em>with no internet</em> and syncs when the signal comes back, because a door at 2 a.m. with no coverage is exactly when an app that needs a connection is useless.",
    "b6-h": "An AI assistant that answers only from your own material",
    "b6-t": "Built and measured &middot; demo currently down",
    "b6-p": "It answers customers from your published pages and names the page it read. If you never published the answer, it says so and offers a human instead of inventing one. It works in Arabic and English, and one client can never see another client's material.",
    "b6-n": "<b>Told against my own interest:</b> I built a check to count how often it refuses to answer &mdash; and that check found the refusal detection was passing through a fallback 9 times out of 23, while every visible indicator was green. That is why it is worth measuring rather than trusting a dashboard. The public demo's model connection is down today; I am not going to link you to something that will not answer.",
    "b7-h": "Design, when the look is the product",
    "b7-t": "Two builds, both live &mdash; open them",
    "b7-p": "Some sites are a form and a table. Others have to be felt &mdash; a gallery, a showroom, something a visitor remembers. I build those too, and I keep them fast and usable with a keyboard, because an experience that only works for a mouse on a fast laptop is a demo, not a product.",
    "b7-n": "<b>Being straight with you:</b> both are my own builds, not commissioned client work, and neither has a real customer behind it. The gallery says so on its own first line &mdash; it is a demo and the artist is invented &mdash; because a gallery pretending to be real, linked from a site whose whole argument is honesty, would contradict itself.",
    "b-how-h": "How the work runs",
    "b-s1-h": "1 &middot; Half an hour on a call, free",
    "b-s1-p": "You describe what is done by hand. I come back with a straight answer: worth automating, or not worth it. If it is not, I say so and we stop there.",
    "b-s2-h": "2 &middot; A written brief before any code",
    "b-s2-p": "Exactly what gets built, exactly what does <em>not</em>, and the measure of success as a number &mdash; \"an order takes 3 minutes instead of 20\", not \"it will be better\". Without a number, nobody can say afterwards whether it worked.",
    "b-s3-h": "3 &middot; Built in slices you can use",
    "b-s3-p": "Each slice works and gets tried by a real person before the next one starts. Not one delivery at the end, where the first time anyone sees it is also the first time anyone can object.",
    "b-s4-h": "4 &middot; Handover means a running system",
    "b-s4-p": "Hosted, monitored, backed up &mdash; with the backups tested by actually restoring them, not by trusting that they exist. And I am the one who answers when something breaks afterwards.",
    "b-lim-h": "What I will not take on",
    "b-lim-l": "This section exists because it is the one that makes the rest believable.",
    "b-l1": "I do not promise sales or marketing results. I build the tool; whether it earns is not in my hands, and anyone who promises you otherwise is selling something.",
    "b-l2": "I cannot guarantee anything that depends on somebody else's platform. WhatsApp, Telegram and payment providers change their terms, and when they do the work changes with them.",
    "b-l3": "The team is one person. A project that genuinely needs five people working at once is not a project I should take.",
    "b-l4": "Nothing touching health or safety without a qualified specialist alongside me who owns that judgment.",
    "b-l5": "<b>And the one that costs me most to write:</b> two paying subscribers is the entire commercial history of everything on this site. The work is built, deployed and open for you to try &mdash; but I cannot hand you a client reference, and when you are choosing who to trust with your business, that absence is a real thing to weigh.",
    "b-ct-h": "Let us talk",
    "b-ct-l": "Tell me what your team still does by hand, and I will tell you honestly whether it is worth automating.",
    "b-wa2": "Message me on WhatsApp",
    "h1b": "Hani Amro",
    "loc2": "Malaysia",
    "footer": "Written in English and Arabic &mdash; both by hand."
  };

  var root = document.documentElement;
  var KEY = "lang";
  var btn = document.getElementById("lang-toggle");
  var nodes = document.querySelectorAll("[data-i18n]");

  // لغة ما هو مكتوب فعلاً في هذه الصفحة.
  var domLang = root.getAttribute("data-default-lang") || "en";

  // اللغة المكتوبة تُلتقط من الصفحة نفسها لا تُكرَّر هنا: نسختان لنصٍّ واحد
  // تفترقان بأول تعديل يُنسى في إحداهما. أما اللغة الأخرى فمن الجداول أدناه.
  var captured = {};
  Array.prototype.forEach.call(nodes, function (el) {
    captured[el.dataset.i18n] = el.innerHTML;
  });

  var LITERAL = { ar: AR, en: EN_BUILD };

  function tableFor(lang) {
    return lang === domLang ? captured : LITERAL[lang];
  }

  function apply(lang) {
    var table = tableFor(lang) || {};
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
    if (missing.length) console.warn("i18n: no " + lang + " for", missing);
    // ما لا يعيش في الـDOM لا تصله الترجمة أعلاه — المخطّطات تبني نصّها
    // بنفسها، فتُخطَر لتعيد رسم عناوينها وتعليقاتها باللغة الجديدة.
    document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: lang } }));
  }

  // كل صفحة تعلن لغتها الافتراضية (data-default-lang): البوّابة والصفحة
  // التقنية بالإنجليزية، وصفحة «أبني لك» بالعربية — لأن قارئها عربي.
  // والاختيار المحفوظ يعلو على الافتراضي: من بدّل اللغة مرّة لا يُبدَّل له
  // عند كل انتقال.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var initial = saved || root.getAttribute("data-default-lang") || "en";
  if (initial === "ar") apply("ar");

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
