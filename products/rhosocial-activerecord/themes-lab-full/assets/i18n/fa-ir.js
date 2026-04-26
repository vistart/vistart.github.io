/**
 * i18n · fa-ir · فارسی
 */
window.I18N = window.I18N || {};
window.I18N['fa-ir'] = {
  meta: { name: 'فارسی' },
  control: { theme_label: 'تم', font_label: 'فونت', lang_label: 'زبان', font_auto: 'خودکار (پیش‌فرض تم)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title: 'rhosocial ActiveRecord،<br>برای Python <em>از نو طراحی شده</em>.',
    sub: '<strong>rhosocial-activerecord</strong> مدل‌ها را با type annotation بومی Python تعریف می‌کند و با زنجیره <code>query().where(...).all()</code> پرس‌وجو می‌کند. هم sync و هم async از روز اول. بدون وابستگی ORM خارجی — SQLite داخلی است، سایر پایگاه‌داده‌ها بسته‌های جداگانه، بک‌اند اختصاصی در چند ده خط.',
    cta_secondary: 'مشاهده ویژگی‌ها ←'
  },
  features: {
    label: 'چرا · ۶ وعده',
    title: 'چرا <em>rhosocial ActiveRecord</em>.',
    f1: { num: '۰۱ / نوع = فیلد', title: '<em>ایمن‌نوع</em> از پایه', desc: '<code>name: str</code> یعنی ذخیره، اعتبارسنجی و پیشنهاد IDE در یک عبارت.' },
    f2: { num: '۰۲ / Async درجه یک', title: 'Sync &amp; async, <em>یک API</em>', desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code> — شکل یکسان.' },
    f3: { num: '۰۳ / بک‌اند قابل تعویض', title: 'بک‌اند‌های <em>قابل تعویض</em>', desc: 'SQLite داخلی؛ Postgres/MySQL/MSSQL/Oracle بسته جدا؛ یا بک‌اند اختصاصی.' },
    f4: { num: '۰۴ / روابط صریح', title: '<em>روابط</em> به‌صراحت اعلام‌شده', desc: 'has_many / belongs_to روی مدل اعلام می‌شود؛ خود رابطه یک <code>QuerySet</code> است.' },
    f5: { num: '۰۵ / تراکنش اتمیک', title: 'تراکنش‌ها, <em>درست تودرتو</em>', desc: 'context manager + savepoint؛ استثناها rollback خودکار ایجاد می‌کنند.' },
    f6: { num: '۰۶ / Pythonic', title: 'مثل <em>انگلیسی</em> خوانده می‌شود', desc: '<code>User.query().where(...).all()</code> — بدون DSL، فقط Python.' }
  },
  practice: {
    label: 'در عمل · کد واقعی',
    title: 'از ۳.۸ تا ۳.۱۲, <em>گام‌به‌گام</em>.',
    intro: 'مطابق فایل‌های <code>models_py38.py</code> … <code>models_py312.py</code> در مخزن testsuite.',
    p1: '<b>۳.۸ → ۳.۹</b>: <code>list[str]</code> به‌جای <code>List[str]</code> (PEP 585).',
    p2: '<b>۳.۹ → ۳.۱۰</b>: <code>int | None</code> به‌جای <code>Optional[int]</code> (PEP 604).',
    p3: '<b>۳.۱۰ → ۳.۱۱</b>: نوع <code>Self</code> (PEP 673).',
    p4: '<b>۳.۱۱ → ۳.۱۲</b>: <code>@override</code> و جنریک‌های PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync: {
    label: 'کنار هم',
    title: 'Sync = async, <em>یک معناشناسی</em>.',
    intro: '<code>for</code> را به <code>async for</code> تغییر دهید — تمام. استنتاج نوع تا آخرین حلقه قطع نمی‌شود.',
    cta: 'خواندن راهنمای async ←'
  },
  split_backend: {
    label: 'آزادی بک‌اند',
    title: 'بک‌اند <em>اختصاصی</em> در یک بعدازظهر.',
    intro: 'از <code>Backend</code> ارث‌برید و چند dialect hook پیاده کنید. DuckDB و libSQL قبلاً تأیید شده‌اند.',
    cta: 'راهنمای توسعه بک‌اند ←'
  },
  pricing: {
    label: 'طرح‌ها · نمونه',
    title: 'طرح <em>خود</em> را انتخاب کنید.',
    intro: '(کارت‌های نمونه — خود پروژه OSS برای همیشه رایگان است. کارت‌های pricing برای بررسی نمایش در هر تم نشان داده شده‌اند.)',
    badge: 'محبوب‌ترین',
    c1: {
      tier: 'Community', desc: 'برای توسعه‌دهندگان فردی و مشارکت‌کنندگان OSS. قابلیت کامل، بدون محدودیت.',
      f1: 'SQLite / PostgreSQL / MySQL', f2: 'API کامل sync &amp; async', f3: 'پشتیبانی انجمن',
      f4: 'داشبورد تیمی', f5: 'تضمین پاسخ SLA', cta: 'شروع'
    },
    c2: {
      tier: 'Team', desc: 'تیم‌های در حال رشد. بک‌اند enterprise و حسابرسی.',
      f1: 'همه امکانات Community', f2: 'بک‌اند MSSQL / Oracle', f3: 'حسابرسی &amp; جداسازی خواندن/نوشتن',
      f4: 'Discord اختصاصی با اولویت', f5: 'SSO / SAML', cta: '۱۴ روز آزمایش'
    },
    c3: {
      tier: 'Enterprise', desc: 'سازمان‌های بزرگ. on-prem، انطباق، آموزش.',
      price_label: 'تماس با ما',
      f1: 'همه امکانات Team', f2: 'بک‌اند اختصاصی (DuckDB / libSQL / داخلی)', f3: 'SSO / SAML / LDAP',
      f4: 'SLA ۴ ساعته', f5: 'آموزش حضوری و راه‌حل اختصاصی', cta: 'تماس با فروش'
    }
  },
  compare: {
    label: 'مقایسه', title: 'مقایسه <em>ویژگی‌ها</em> بر اساس طرح.',
    col_feature: 'ویژگی',
    row1: 'SQLite / Postgres / MySQL', row2: 'بک‌اند MSSQL / Oracle', row3: 'بک‌اند اختصاصی',
    row4: 'API کامل sync / async', row5: 'حسابرسی', row6: 'جداسازی خواندن/نوشتن',
    row7: 'SSO / SAML / LDAP', row8: 'پاسخ SLA', row8c: '— انجمن', row8t: '۲۴ ساعت', row8e: '۴ ساعت',
    row9: 'قیمت سالانه'
  },
  gallery: {
    label: 'گالری مؤلفه · عناصر UI', title: 'نحوه رفتار هر تم با <em>عناصر UI</em>.',
    c_buttons: 'دکمه‌ها', c_btngroup: 'گروه دکمه', c_form: 'عناصر فرم', c_radio: 'گروه radio',
    c_multi: 'لیست انتخاب چندگانه', c_dropdown: 'لیست کشویی', c_alerts: 'هشدارها',
    c_badges: 'نشان‌ها', c_progress: 'پیشرفت', c_grid: 'نمایش Grid (۱۲ ستون)',
    c_rtl: 'پیش‌نمایش RTL', c_table: 'جدول راه‌راه',
    form_email: 'ایمیل', form_note: 'یادداشت', form_preload: 'بارگذاری قبلی', form_async: 'Async',
    radio_sync: 'Sync (حالت همگام)', radio_async: 'Async (حالت ناهمگام)', radio_both: 'هر دو (مدل مشترک)',
    alert_info: '<b>نکته.</b> بک‌اند SQLite با بسته اصلی ارائه می‌شود.',
    alert_success: '<b>آماده.</b> <code>User.configure(...)</code> فراخوانی شد.',
    alert_warn: '<b>هشدار.</b> توابع پنجره‌ای نیازمند SQLite ≥ 3.25 هستند.',
    prog_coverage: 'پوشش تست', prog_backend: 'تکمیل بک‌اند', prog_locale: 'بومی‌سازی مستندات',
    backend_note: 'همان مؤلفه نوار کنترل بالا.',
    multi1_t: 'PostgreSQL', multi1_d: 'تولید اصلی', multi2_t: 'MySQL', multi2_d: 'سرویس‌های قدیمی', multi3_t: 'SQLite', multi3_d: 'تست &amp; نمونه‌اولیه'
  },
  album: {
    label: 'گالری · کتابخانه', title: 'از <em>مثال‌ها</em> بیاموزید.',
    a1: 'اولین مدل شما', a2: 'Async با FastAPI', a3: 'has_many عمیق',
    a4: 'نوشتن بک‌اند', a5: 'تشخیص خودکار N+1', a6: 'تراکنش تودرتو &amp; savepoint'
  },
  voices: {
    label: 'صداها · نظرات', title: 'آنچه <em>می‌گویند</em>.',
    q1: 'با rhosocial-activerecord بالاخره از مبارزه با ORM خلاص شدم. type annotation همان مدل است، دقیقاً همین.',
    q1_role: 'Backend Engineer · کیوتو',
    q2: 'sync و async یک API دارند، refactor تقریباً بدون هزینه. مهاجرت FastAPI دو خط بود.',
    q2_role: 'Staff Engineer · برلین',
    q3: 'بک‌اند DuckDB را خودم نوشتم. Backend ABC را در ناهار خواندم، بعدازظهر روی prod بود. این expansibility واقعی است.',
    q3_role: 'Data Platform · سنگاپور',
    q4: 'هر مرحله از زنجیره type inference صحیح در IDE دارد. Pydantic در جای درست استفاده شده.',
    q4_role: 'Senior Python · سائوپائولو',
    q5: 'صفر وابستگی runtime کلید است. در embedded دیگر از حجم SQLAlchemy رنج نمی‌بریم.',
    q5_role: 'مهندس IoT · شنژن'
  },
  auth: {
    label: 'Auth · دمو ورود', title: 'ورود به <em>rhosocial</em>.',
    welcome: 'خوش آمدید', sub: 'با حساب rhosocial خود ادامه دهید.',
    email: 'ایمیل', password: 'رمز عبور', remember: 'مرا به‌خاطر بسپار', forgot: 'رمز عبور را فراموش کرده‌اید؟',
    login: 'ورود', or: 'یا', github: 'ادامه با GitHub', twitter: 'ادامه با Twitter',
    no_account: 'حساب ندارید؟', register: 'ثبت‌نام'
  },
  stats: {
    label: 'به اعداد', title: 'چند <em>عدد</em>.',
    s1: 'لهجه‌های DB موجود', s2: 'نرخ پوشش type annotation', s3: 'حداقل Python', s4: 'وابستگی ORM خارجی'
  },
  install: {
    label: 'شروع', title: 'نصب در یک خط, <em>ده دقیقه</em> تا اولین پرس‌وجو.',
    sub: 'منتشرشده در PyPI. بک‌اند SQLite داخلی؛ بقیه را بنا بر نیاز نصب کنید.',
    docs: 'خواندن مستندات ←'
  },
  footer: {
    hotkeys: '25 themes × 26 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">key</span> theme / <span class="kbd">Shift</span>+<span class="kbd">key</span> font / <span class="kbd">Alt</span>+<span class="kbd">key</span> language'
  }
};