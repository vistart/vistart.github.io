/**
 * i18n · ar · العربية (Modern Standard Arabic) [RTL]
 * When selected, themes.html sets <html dir="rtl"> and <html lang="ar">.
 */
window.I18N = window.I18N || {};
window.I18N['ar'] = {
  meta: { name: 'العربية' },
  control: { theme_label: 'السمة', font_label: 'الخط', lang_label: 'اللغة', font_auto: 'تلقائي (افتراضي السمة)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord،<br>أُعيد تصميمها من أجل <em>Python</em>.',
    sub:     'يعرّف <strong>rhosocial-activerecord</strong> النماذج عبر تعليقات الأنواع الأصلية في Python ويستعلم عنها بسلسلة <code>query().where(...).all()</code>. متزامن وغير متزامن منذ اليوم الأول. بلا أي اعتمادات ORM خارجية — SQLite مدمج، وقواعد البيانات الأخرى حزم مستقلة، ويمكنك كتابة الواجهة الخلفية الخاصة بك في بضع عشرات من الأسطر.',
    cta_secondary: 'عرض الميزات ←'
  },
  features: {
    label: 'لماذا · ستة وعود أساسية',
    title: 'لماذا <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / النوع = الحقل',      title: '<em>آمن الأنواع</em> بالبناء',                       desc: 'الحقل ببساطة <code>name: str</code> — التخزين والتحقق وإكمال IDE في سطر واحد.' },
    f2: { num: '02 / غير متزامن من الدرجة الأولى', title: 'sync و async، <em>واجهة واحدة</em>',         desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>، بنفس الشكل.' },
    f3: { num: '03 / خلفيات قابلة للإضافة', title: 'خلفيات <em>قابلة للإضافة</em>',                     desc: 'SQLite مدمج، وPostgres/MySQL/MSSQL/Oracle حزم منفصلة، أو اكتب خلفيتك.' },
    f4: { num: '04 / علاقات صريحة',       title: '<em>العلاقات</em> صريحة',                            desc: 'يُصرَّح عن has_many / belongs_to في النموذج، والعلاقات نفسها <code>QuerySet</code>.' },
    f5: { num: '05 / معاملات ذرية',       title: 'معاملات <em>متداخلة بشكل صحيح</em>',                 desc: 'مدير سياق + savepoints، والاستثناءات تُرجِع كلَّ شيء نظيفاً.' },
    f6: { num: '06 / بايثوني',             title: 'يُقرأ كأنه <em>إنجليزية</em>',                      desc: '<code>User.query().where(...).all()</code> — لا DSL، مجرد Python.' }
  },
  practice: {
    label: 'في الممارسة · كود حقيقي',
    title: 'من 3.8 إلى 3.12، <em>خطوة بخطوة</em>.',
    intro: 'يقابل fixtures <code>models_py38.py</code> … <code>models_py312.py</code> في مستودع testsuite.',
    p1: '<b>3.8 ← 3.9</b>: <code>list[str]</code> بدل <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 ← 3.10</b>: <code>int | None</code> بدل <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 ← 3.11</b>: النوع <code>Self</code> (PEP 673).',
    p4: '<b>3.11 ← 3.12</b>: <code>@override</code> وأنواع PEP 695 العامة <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'جنباً إلى جنب', title: 'sync = async، <em>نفس الدلالة</em>.', intro: 'استبدل <code>for</code> بـ <code>async for</code> وانتهى الأمر. استنتاج الأنواع يسير عبر السلسلة كاملة.', cta: 'اقرأ دليل async ←' },
  split_backend: { label: 'حرية الخلفية', title: 'اكتب <em>خلفيتك</em> خلال أمسية.', intro: 'ورّث <code>Backend</code>، ونفّذ بضعة خطافات للهجة. DuckDB و libSQL مُثبتتان فعلاً.', cta: 'دليل مطور الخلفية ←' },
  pricing: {
    label: 'الخطط · توضيحية', title: 'اختر <em>مستواك</em>.',
    intro: '(بطاقات توضيحية — مشروع OSS نفسه مجاني للأبد. تُعرض هنا لمعاينة بطاقات التسعير في كل سمة.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'المطورون الفرديون ومساهمو OSS. ميزات كاملة بلا حدود.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'واجهة sync و async كاملة', f3: 'دعم عبر منتدى المجتمع',
          f4: 'لوحة تعاون فريق', f5: 'ضمان استجابة SLA', cta: 'ابدأ' },
    c2: { tier: 'Team',       desc: 'الفرق المتنامية. خلفيات مؤسسية مع التدقيق.',
          f1: 'كل ما في Community', f2: 'خلفيات MSSQL / Oracle', f3: 'سجل تدقيق وفصل قراءة/كتابة',
          f4: 'Discord خاص بأولوية', f5: 'SSO / SAML', cta: 'تجربة 14 يوم' },
    c3: { tier: 'Enterprise', desc: 'المنظمات الكبرى. داخل المباني، الامتثال، التدريب.', price_label: 'اتصل بنا',
          f1: 'كل ما في Team', f2: 'خلفيات مخصصة (DuckDB / libSQL / داخلية)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 ساعات', f5: 'تدريب في الموقع وحلول مخصصة', cta: 'تواصل مع المبيعات' }
  },
  compare: {
    label: 'قارن', title: 'مقارنة <em>الميزات</em>.', col_feature: 'الميزة',
    row1: 'SQLite / Postgres / MySQL', row2: 'خلفيات MSSQL / Oracle', row3: 'خلفيات مخصصة',
    row4: 'واجهة sync / async كاملة', row5: 'سجل التدقيق', row6: 'فصل قراءة/كتابة', row7: 'SSO / SAML / LDAP',
    row8: 'استجابة SLA', row8c: '— المجتمع', row8t: '24 ساعة', row8e: '4 ساعات', row9: 'السعر السنوي'
  },
  gallery: {
    label: 'معرض المكونات · الأوليات', title: 'كيف تتعامل كل سمة مع <em>أوليات الواجهة</em>.',
    c_buttons: 'الأزرار', c_btngroup: 'مجموعة أزرار', c_form: 'عناصر النموذج',
    c_radio: 'مجموعة radio', c_multi: 'قائمة اختيار متعدد', c_dropdown: 'قائمة منسدلة',
    c_alerts: 'تنبيهات', c_badges: 'شارات', c_progress: 'تقدّم',
    c_grid: 'عرض شبكة (12 عمود)', c_rtl: 'معاينة RTL', c_table: 'جدول مخطط',
    form_email: 'البريد الإلكتروني', form_note: 'ملاحظات',
    form_preload: 'تحميل مسبق', form_async: 'Async',
    radio_sync: 'Sync (وضع متزامن)', radio_async: 'Async (وضع غير متزامن)', radio_both: 'كلاهما (مكدسان، نماذج مشتركة)',
    alert_info:    '<b>تنبيه.</b> خلفية SQLite مضمّنة في الحزمة الأساسية.',
    alert_success: '<b>جاهز.</b> تم استدعاء <code>User.configure(...)</code>.',
    alert_warn:    '<b>انتبه.</b> تتطلب دوال النوافذ SQLite ≥ 3.25.',
    prog_coverage: 'تغطية الاختبارات', prog_backend: 'اكتمال الخلفية', prog_locale: 'تعريب التوثيق',
    backend_note:  'نفس المكون الموجود في شريط التحكم العلوي.',
    multi1_t: 'PostgreSQL', multi1_d: 'الإنتاج الرئيسي',
    multi2_t: 'MySQL',      multi2_d: 'الخدمات القديمة',
    multi3_t: 'SQLite',     multi3_d: 'الاختبارات والنماذج الأولية'
  },
  album: {
    label: 'معرض · مكتبة', title: 'تعلَّم من <em>الأمثلة</em>.',
    a1: 'أول نموذج لك', a2: 'Async في FastAPI', a3: 'has_many بعمق',
    a4: 'اكتب خلفية', a5: 'اكتشاف N+1 التلقائي', a6: 'معاملات متداخلة وsavepoints'
  },
  voices: {
    label: 'أصوات · شهادات', title: 'ما <em>يقولونه</em>.',
    q1: 'مع rhosocial-activerecord توقفت أخيراً عن مصارعة ORM. تعليقات الأنواع هي النموذج — هذا هو الصواب.',
    q1_role: 'مهندس خلفية · كيوتو',
    q2: 'يتشارك sync و async واجهة واحدة، وإعادة الهيكلة شبه مجانية. ترحيل مشروع FastAPI خاصتي استغرق سطرين.',
    q2_role: 'Staff Engineer · برلين',
    q3: 'كتبت خلفية لـ DuckDB. قرأت Backend ABC خلال الغداء، وكانت في الإنتاج بعد الظهر. هذه قابلية التوسعة الحقيقية.',
    q3_role: 'Data Platform · سنغافورة',
    q4: 'كل خطوة في السلسلة يُستنتج نوعها بشكل صحيح في الـ IDE. Pydantic، موظَّف في مكانه الصحيح.',
    q4_role: 'Senior Python · ساو باولو',
    q5: 'صفر اعتمادات وقت التشغيل هو المفتاح. في النشر المدمج لم نعد قلقين بشأن حجم SQLAlchemy.',
    q5_role: 'مهندس إنترنت الأشياء · شنتشن'
  },
  auth: {
    label: 'Auth · عرض تسجيل الدخول', title: 'تسجيل الدخول إلى <em>rhosocial</em>.',
    welcome: 'مرحباً بعودتك', sub: 'تابع باستخدام حساب rhosocial الخاص بك.',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', remember: 'تذكّرني', forgot: 'هل نسيت كلمة المرور؟',
    login: 'تسجيل الدخول', or: 'أو', github: 'المتابعة عبر GitHub', twitter: 'المتابعة عبر Twitter',
    no_account: 'ليس لديك حساب؟', register: 'إنشاء حساب'
  },
  stats: {
    label: 'بالأرقام', title: 'بعض <em>الأرقام</em>.',
    s1: 'لهجات قواعد البيانات المتاحة', s2: 'تغطية تعليقات الأنواع', s3: 'أدنى إصدار Python', s4: 'اعتمادات ORM الخارجية'
  },
  install: {
    label: 'ابدأ', title: 'تثبيت بسطر واحد، <em>عشر دقائق</em> للاستعلام الأول.',
    sub: 'منشور على PyPI. خلفية SQLite مضمّنة مع الحزمة الأساسية؛ تُثبَّت الخلفيات الأخرى عند الطلب.',
    docs: 'اقرأ التوثيق ←'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
