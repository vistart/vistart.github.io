/**
 * i18n · en-us · English (United States)
 */
window.I18N = window.I18N || {};
window.I18N['en-us'] = {
  meta: { name: 'English' },
  control: { theme_label: 'Theme', font_label: 'Font', lang_label: 'Language', font_auto: 'Auto (theme default)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>redesigned for <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> defines models with Python type annotations and queries them with a fluent <code>query().where(...).all()</code>. Sync and async ship from day one. Zero external ORM dependencies — SQLite is built in, other databases ship as separate packages, and you can write your own backend in a few dozen lines.',
    cta_secondary: 'See features →'
  },
  features: {
    label: 'Why · six core promises',
    title: 'Why <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Types ARE fields', title: '<em>Type-safe</em> by construction',     desc: 'A field is just <code>name: str</code> — storage, validation, and IDE completion in one.' },
    f2: { num: '02 / Async first-class', title: 'Sync &amp; async, <em>one API</em>',     desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, identical shape.' },
    f3: { num: '03 / Pluggable backends', title: 'Pluggable <em>backends</em>',           desc: 'SQLite built in; Postgres/MySQL/MSSQL/Oracle as independent packages; or write your own.' },
    f4: { num: '04 / Explicit relations', title: '<em>Relations</em> made explicit',      desc: 'has_many / belongs_to declared on the model; relations are themselves <code>QuerySet</code>s.' },
    f5: { num: '05 / Atomic transactions', title: 'Transactions, <em>properly nested</em>', desc: 'Context-manager transactions with savepoints; exceptions roll back cleanly.' },
    f6: { num: '06 / Pythonic',  title: 'Reads like <em>English</em>',                    desc: '<code>User.query().where(...).all()</code> — no DSL, just Python.' }
  },
  practice: {
    label: 'In Practice · real code',
    title: 'From 3.8 to 3.12, <em>one step at a time</em>.',
    intro: 'Mirrors testsuite fixtures <code>models_py38.py</code> … <code>models_py312.py</code>.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> replaces <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> replaces <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: the <code>Self</code> type (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> and PEP 695 generics <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Side by side', title: 'Sync = async, <em>one shape</em>.', intro: 'Swap <code>for</code> for <code>async for</code> and move on. Type inference rides the whole chain.', cta: 'Read the async guide →' },
  split_backend: { label: 'Backend freedom', title: 'Write your own <em>backend</em> in an afternoon.', intro: 'Subclass <code>Backend</code>, implement a few dialect hooks, and you&apos;re live. DuckDB and libSQL are already proven.', cta: 'Backend dev guide →' },
  pricing: {
    label: 'Plans · illustrative', title: 'Pick your <em>tier</em>.',
    intro: '(Sample cards — the OSS project itself is free forever. Shown here so pricing cards can be previewed on every theme.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Solo builders and open-source contributors. Full features, no limits.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Full async &amp; sync API', f3: 'Community forum support',
          f4: 'Team collaboration dashboard', f5: 'SLA response guarantee', cta: 'Get Started' },
    c2: { tier: 'Team',       desc: 'Growing teams. Enterprise backends plus audit.',
          f1: 'Everything in Community', f2: 'MSSQL / Oracle backends', f3: 'Audit log &amp; read-write splitting',
          f4: 'Private Discord priority support', f5: 'SSO / SAML', cta: 'Start 14-day trial' },
    c3: { tier: 'Enterprise', desc: 'Large organizations. On-prem, compliance, training.', price_label: 'Contact us',
          f1: 'Everything in Team', f2: 'Custom backends (DuckDB / libSQL / in-house)', f3: 'SSO / SAML / LDAP',
          f4: '4-hour SLA response', f5: 'On-site training and dedicated solutions', cta: 'Contact Sales' }
  },
  compare: {
    label: 'Compare', title: 'Feature <em>comparison</em>.', col_feature: 'Feature',
    row1: 'SQLite / Postgres / MySQL', row2: 'MSSQL / Oracle backends', row3: 'Custom backends',
    row4: 'Full async / sync API', row5: 'Audit log', row6: 'Read-write splitting', row7: 'SSO / SAML / LDAP',
    row8: 'SLA response', row8c: '— community', row8t: '24 hours', row8e: '4 hours',
    row9: 'Annual price'
  },
  gallery: {
    label: 'Component Gallery · primitives', title: 'How each theme handles <em>UI primitives</em>.',
    c_buttons: 'Buttons', c_btngroup: 'Button group', c_form: 'Form controls',
    c_radio: 'Radio group', c_multi: 'Multi-select list', c_dropdown: 'Dropdown',
    c_alerts: 'Alerts', c_badges: 'Badges', c_progress: 'Progress',
    c_grid: 'Grid showcase (12 col)', c_rtl: 'RTL preview', c_table: 'Striped data table',
    form_email: 'Email address', form_note: 'Notes',
    form_preload: 'Preload', form_async: 'Async',
    radio_sync: 'Sync (synchronous mode)', radio_async: 'Async (asynchronous mode)', radio_both: 'Both (dual stack, shared models)',
    alert_info:    '<b>Tip.</b> The SQLite backend ships with the core package.',
    alert_success: '<b>Ready.</b> <code>User.configure(...)</code> has been called.',
    alert_warn:    '<b>Note.</b> SQLite ≥ 3.25 is required for window functions.',
    prog_coverage: 'Test coverage', prog_backend: 'Backend completion', prog_locale: 'Docs localization',
    backend_note:  'Same component as the top control bar.',
    multi1_t: 'PostgreSQL', multi1_d: 'Main production',
    multi2_t: 'MySQL',      multi2_d: 'Legacy services',
    multi3_t: 'SQLite',     multi3_d: 'Tests &amp; prototypes'
  },
  album: {
    label: 'Gallery · library', title: 'Learn from <em>examples</em>.',
    a1: 'Your first model', a2: 'Async in FastAPI', a3: 'has_many in depth',
    a4: 'Writing a backend', a5: 'N+1 auto-detection', a6: 'Nested transactions &amp; savepoints'
  },
  voices: {
    label: 'Voices · testimonials', title: 'What <em>they say</em>.',
    q1: 'rhosocial-activerecord finally stopped me fighting with an ORM. Type annotations are the model — exactly right.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync and async share one API, so refactoring is nearly free. Migrating my FastAPI project took two lines.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'I wrote a DuckDB backend. Read the Backend ABC over lunch, shipped it that afternoon. Real extensibility.',
    q3_role: 'Data Platform · Singapore',
    q4: 'Every step of the fluent chain has the right inferred type in my IDE. Pydantic, put to the proper use.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Zero runtime deps is the key. For embedded deployments we are done worrying about SQLAlchemy&apos;s footprint.',
    q5_role: 'IoT Engineer · Shenzhen'
  },
  auth: {
    label: 'Auth · sign-in demo', title: 'Sign in to <em>rhosocial</em>.',
    welcome: 'Welcome back', sub: 'Continue with your rhosocial account.',
    email: 'Email', password: 'Password', remember: 'Remember me', forgot: 'Forgot password?',
    login: 'Sign in', or: 'OR', github: 'Continue with GitHub', twitter: 'Continue with Twitter',
    no_account: 'No account yet?', register: 'Sign up'
  },
  stats: {
    label: 'By the numbers', title: 'A few <em>numbers</em>.',
    s1: 'Database backends', s2: 'Type-annotation coverage', s3: 'Minimum Python', s4: 'External ORM deps'
  },
  install: {
    label: 'Get started', title: 'Install in one line, <em>ten minutes</em> to first query.',
    sub: 'Published to PyPI. The SQLite backend ships with the core package; other backends are installed on demand.',
    docs: 'Read the docs →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
