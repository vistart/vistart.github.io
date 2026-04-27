/**
 * i18n · bn-bd · বাংলা
 */
window.I18N = window.I18N || {};
window.I18N['bn-bd'] = {
  meta: { name: 'বাংলা' },
  control: { theme_label: 'থিম', font_label: 'ফন্ট', lang_label: 'ভাষা', font_auto: 'স্বয়ংক্রিয় (থিমের ডিফল্ট)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title: 'rhosocial ActiveRecord,<br>Python-এর জন্য <em>নতুন করে ডিজাইন</em>।',
    sub: '<strong>rhosocial-activerecord</strong> Python-এর নেটিভ টাইপ অ্যানোটেশন দিয়ে মডেল সংজ্ঞায়িত করে এবং <code>query().where(...).all()</code> চেইন দিয়ে কোয়েরি করে। প্রথম দিন থেকে sync ও async। কোনো বাহ্যিক ORM নির্ভরতা শূন্য — SQLite বিল্ট-ইন, অন্য ডাটাবেস আলাদা প্যাকেজ, নিজস্ব backend কয়েক ডজন লাইনে লেখা যায়।',
    cta_secondary: 'ফিচার দেখুন →'
  },
  features: {
    label: 'কেন · ৬টি প্রতিশ্রুতি',
    title: 'কেন <em>rhosocial ActiveRecord</em>।',
    f1: { num: '০১ / টাইপ = ফিল্ড', title: 'গঠন থেকেই <em>টাইপ-সেফ</em>', desc: '<code>name: str</code> — সংরক্ষণ, ভ্যালিডেশন ও IDE পরামর্শ একসাথে।' },
    f2: { num: '০২ / Async প্রথম শ্রেণি', title: 'Sync &amp; async, <em>একটি API</em>', desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code> — আকৃতি অভিন্ন।' },
    f3: { num: '০৩ / বিনিময়যোগ্য backend', title: 'বিনিময়যোগ্য <em>backend</em>', desc: 'SQLite বিল্ট-ইন; Postgres/MySQL/MSSQL/Oracle আলাদা প্যাকেজ; বা নিজস্ব।' },
    f4: { num: '০৪ / স্পষ্ট সম্পর্ক', title: '<em>সম্পর্ক</em> স্পষ্টভাবে ঘোষিত', desc: 'has_many / belongs_to মডেলে ঘোষণা; সম্পর্ক নিজেই <code>QuerySet</code>।' },
    f5: { num: '০৫ / পারমাণবিক ট্রানজাকশন', title: 'ট্রানজাকশন, <em>সঠিকভাবে নেস্টেড</em>', desc: 'context manager + savepoint; ব্যতিক্রম স্বয়ংক্রিয় rollback ঘটায়।' },
    f6: { num: '০৬ / Pythonic', title: '<em>ইংরেজি</em> পড়ার মতো পড়ুন', desc: '<code>User.query().where(...).all()</code> — কোনো DSL নেই, শুধু Python।' }
  },
  practice: {
    label: 'ব্যবহারে · বাস্তব কোড',
    title: '৩.৮ থেকে ৩.১২, <em>ধাপে ধাপে</em>।',
    intro: 'testsuite রিপোজিটরির <code>models_py38.py</code> … <code>models_py312.py</code> ফাইলের সাথে সামঞ্জস্যপূর্ণ।',
    p1: '<b>৩.৮ → ৩.৯</b>: <code>list[str]</code> <code>List[str]</code>-এর বদলে (PEP 585)।',
    p2: '<b>৩.৯ → ৩.১০</b>: <code>int | None</code> <code>Optional[int]</code>-এর বদলে (PEP 604)।',
    p3: '<b>৩.১০ → ৩.১১</b>: <code>Self</code> টাইপ (PEP 673)।',
    p4: '<b>৩.১১ → ৩.১২</b>: <code>@override</code> এবং PEP 695 জেনেরিক <code>class Result[T]:</code>।'
  },
  split_sync: {
    label: 'পাশাপাশি',
    title: 'Sync = async, <em>একই শব্দার্থবিদ্যা</em>।',
    intro: '<code>for</code> কে <code>async for</code> দিয়ে প্রতিস্থাপন করুন — ব্যস। টাইপ ইনফারেন্স পুরো চেইনে অব্যাহত থাকে।',
    cta: 'async গাইড পড়ুন →'
  },
  split_backend: {
    label: 'Backend স্বাধীনতা',
    title: 'নিজস্ব <em>backend</em> এক বিকেলে।',
    intro: '<code>Backend</code> থেকে উত্তরাধিকার নিন, কয়েকটি dialect hook বাস্তবায়ন করুন। DuckDB ও libSQL ইতিমধ্যে প্রমাণিত।',
    cta: 'Backend ডেভেলপার গাইড →'
  },
  pricing: {
    label: 'প্ল্যান · উদাহরণ',
    title: 'আপনার <em>প্ল্যান</em> বেছে নিন।',
    intro: '(নমুনা কার্ড — OSS প্রজেক্ট নিজে চিরকাল বিনামূল্যে। pricing কম্পোনেন্ট প্রতিটি থিমে পরীক্ষা করতে দেখানো হয়েছে।)',
    badge: 'সবচেয়ে জনপ্রিয়',
    c1: {
      tier: 'Community', desc: 'ব্যক্তিগত ডেভেলপার এবং OSS কন্ট্রিবিউটরদের জন্য। সম্পূর্ণ ফাংশনালিটি, কোনো সীমাবদ্ধতা নেই।',
      f1: 'SQLite / PostgreSQL / MySQL', f2: 'সম্পূর্ণ sync &amp; async API', f3: 'কমিউনিটি ফোরাম সাপোর্ট',
      f4: 'টিম ড্যাশবোর্ড', f5: 'SLA প্রতিক্রিয়া গ্যারান্টি', cta: 'শুরু করুন'
    },
    c2: {
      tier: 'Team', desc: 'বর্ধমান টিম। Enterprise backend এবং audit।',
      f1: 'Community-এর সবকিছু', f2: 'MSSQL / Oracle backend', f3: 'Audit log &amp; পড়া/লেখা বিভাজন',
      f4: 'ব্যক্তিগত Discord প্রায়রিটি সাপোর্ট', f5: 'SSO / SAML', cta: '১৪ দিনের ট্রায়াল'
    },
    c3: {
      tier: 'Enterprise', desc: 'বড় প্রতিষ্ঠান। On-prem, compliance, প্রশিক্ষণ।',
      price_label: 'যোগাযোগ করুন',
      f1: 'Team-এর সবকিছু', f2: 'কাস্টম backend (DuckDB / libSQL / ইন-হাউস)', f3: 'SSO / SAML / LDAP',
      f4: 'SLA ৪ ঘণ্টা', f5: 'অনসাইট প্রশিক্ষণ ও বিশেষ সমাধান', cta: 'সেলস-এ যোগাযোগ'
    }
  },
  compare: {
    label: 'তুলনা',
    title: 'অন্যান্য Python ORM-এর সাথে <em>তুলনা</em>।',
    col_feature: 'বৈশিষ্ট্য',
    row1: 'ডিজাইন প্যাটার্ন',
    row1r: 'ActiveRecord',
    row1sa: 'Data Mapper',
    row1dj: 'ActiveRecord',
    row1sm: 'Hybrid',
    row1pw: 'ActiveRecord',
    row1to: 'ActiveRecord',
    row2: 'ব্যাকএন্ড স্বাধীনভাবে ব্যবহারযোগ্য',
    row3: 'Session ধারণা নেই',
    row4: 'সামঞ্জস্যপূর্ণ sync / async API',
    row5: 'নেটিভ Pydantic ইন্টিগ্রেশন',
    row6: 'রানটাইম ডেটা যাচাইকরণ',
    row7: 'সম্পূর্ণ SQL এক্সপ্রেসিভনেস',
    row8: 'ক্ষমতা ঘোষণা প্রক্রিয়া',
    row9: 'SQL স্বচ্ছতা <code>.to_sql()</code>',
    row10: 'বাধ্যতামূলক মাইগ্রেশন টুল নেই',
    row11: 'ন্যূনতম নির্ভরতা',
    row12: 'স্পষ্ট সম্পর্ক সংজ্ঞা'
  },
  gallery: {
    label: 'কম্পোনেন্ট গ্যালারি · UI উপাদান', title: 'প্রতিটি থিমে <em>UI উপাদান</em> কেমন দেখায়।',
    c_buttons: 'বাটন', c_btngroup: 'বাটন গ্রুপ', c_form: 'ফর্ম কন্ট্রোল', c_radio: 'রেডিও গ্রুপ',
    c_multi: 'মাল্টি-সিলেক্ট তালিকা', c_dropdown: 'ড্রপডাউন', c_alerts: 'সতর্কতা',
    c_badges: 'ব্যাজ', c_progress: 'অগ্রগতি', c_grid: 'Grid ডেমো (১২ কলাম)',
    c_rtl: 'RTL প্রিভিউ', c_table: 'স্ট্রাইপড টেবিল',
    form_email: 'ইমেইল', form_note: 'নোট', form_preload: 'প্রিলোড', form_async: 'Async',
    radio_sync: 'Sync (সিঙ্ক মোড)', radio_async: 'Async (অ্যাসিঙ্ক মোড)', radio_both: 'উভয় (শেয়ার্ড মডেল)',
    alert_info: '<b>টিপ।</b> SQLite backend মূল প্যাকেজের সাথে আসে।',
    alert_success: '<b>প্রস্তুত।</b> <code>User.configure(...)</code> কল হয়েছে।',
    alert_warn: '<b>সতর্কতা।</b> উইন্ডো ফাংশনের জন্য SQLite ≥ 3.25 প্রয়োজন।',
    prog_coverage: 'টেস্ট কভারেজ', prog_backend: 'Backend সম্পূর্ণতা', prog_locale: 'ডকুমেন্ট লোকালাইজেশন',
    backend_note: 'উপরের কন্ট্রোল বারের একই কম্পোনেন্ট।',
    multi1_t: 'PostgreSQL', multi1_d: 'মূল প্রোডাকশন', multi2_t: 'MySQL', multi2_d: 'লেগেসি', multi3_t: 'SQLite', multi3_d: 'টেস্ট ও প্রোটোটাইপ'
  },
  album: {
    label: 'গ্যালারি · লাইব্রেরি', title: '<em>উদাহরণ</em> থেকে শিখুন।',
    a1: 'আপনার প্রথম মডেল', a2: 'FastAPI-তে async', a3: 'has_many গভীরে',
    a4: 'Backend লেখা', a5: 'স্বয়ংক্রিয় N+1 সনাক্তকরণ', a6: 'নেস্টেড ট্রানজাকশন &amp; savepoint'
  },
  voices: {
    label: 'মতামত · ব্যবহারকারীদের কথা', title: 'তারা <em>কী বলে</em>।',
    q1: 'rhosocial-activerecord-এর সাহায্যে অবশেষে ORM-এর সাথে লড়াই থেকে মুক্তি পেলাম। টাইপ অ্যানোটেশনই মডেল, ঠিক এটাই।',
    q1_role: 'Backend Engineer · কিয়োটো',
    q2: 'Sync ও async এক API শেয়ার করে, refactor প্রায় বিনামূল্যে। FastAPI মাইগ্রেশন দুই লাইনের।',
    q2_role: 'Staff Engineer · বার্লিন',
    q3: 'DuckDB backend নিজে লিখলাম। দুপুরে Backend ABC পড়লাম, বিকেলে প্রোডাকশন-এ। এটাই আসল extensibility।',
    q3_role: 'Data Platform · সিঙ্গাপুর',
    q4: 'চেইনের প্রতিটি ধাপে IDE-তে টাইপ ইনফারেন্স সঠিক। Pydantic সঠিক জায়গায় ব্যবহৃত।',
    q4_role: 'Senior Python · সাও পাওলো',
    q5: 'শূন্য runtime নির্ভরতাই মূল। embedded-এ SQLAlchemy-এর আকার নিয়ে আর ভাবতে হবে না।',
    q5_role: 'IoT ইঞ্জিনিয়ার · শেনজেন'
  },
  auth: {
    label: 'Auth · লগইন ডেমো', title: '<em>rhosocial</em>-এ লগইন।',
    welcome: 'ফিরে স্বাগতম', sub: 'আপনার rhosocial অ্যাকাউন্ট দিয়ে চালিয়ে যান।',
    email: 'ইমেইল', password: 'পাসওয়ার্ড', remember: 'আমাকে মনে রাখুন', forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
    login: 'লগইন', or: 'অথবা', github: 'GitHub দিয়ে চালিয়ে যান', twitter: 'Twitter দিয়ে চালিয়ে যান',
    no_account: 'অ্যাকাউন্ট নেই?', register: 'নিবন্ধন'
  },
  stats: {
    label: 'সংখ্যায়', title: 'কিছু <em>সংখ্যা</em>।',
    s1: 'উপলব্ধ DB dialect', s2: 'টাইপ অ্যানোটেশন কভারেজ', s3: 'সর্বনিম্ন Python', s4: 'বাহ্যিক ORM নির্ভরতা'
  },
  install: {
    label: 'শুরু করুন', title: 'এক লাইনে ইনস্টল, <em>দশ মিনিটে</em> শুরু।',
    sub: 'PyPI-তে প্রকাশিত। SQLite backend বিল্ট-ইন; বাকিগুলো চাহিদামতো ইনস্টল করুন।',
    docs: 'ডকুমেন্টেশন পড়ুন →'
  },
  footer: {
    hotkeys: '25 themes × 26 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">key</span> theme / <span class="kbd">Shift</span>+<span class="kbd">key</span> font / <span class="kbd">Alt</span>+<span class="kbd">key</span> language'
  }
};