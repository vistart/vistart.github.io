/**
 * i18n · nl-nl · Nederlands
 */
window.I18N = window.I18N || {};
window.I18N['nl-nl'] = {
  meta: { name: 'Nederlands' },
  control: { theme_label: 'Thema', font_label: 'Lettertype', lang_label: 'Taal', font_auto: 'Automatisch (thema-standaard)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>opnieuw ontworpen voor <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> definieert modellen met Python-type-annotaties en bevraagt ze via een keten <code>query().where(...).all()</code>. Sync en async vanaf dag één. Geen externe ORM-afhankelijkheden — SQLite is ingebouwd, andere databases zijn aparte pakketten, en een eigen backend schrijf je in enkele tientallen regels.',
    cta_secondary: 'Functies bekijken →'
  },
  features: {
    label: 'Waarom · zes kernbeloftes',
    title: 'Waarom <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Type = veld',         title: 'Van nature <em>type-safe</em>',                   desc: 'Een veld is simpelweg <code>name: str</code> — opslag, validatie en IDE-aanvulling in één.' },
    f2: { num: '02 / Async eersterangs',   title: 'Sync &amp; async, <em>één API</em>',              desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, dezelfde vorm.' },
    f3: { num: '03 / Verwisselbare backends', title: 'Inwisselbare <em>backends</em>',              desc: 'SQLite ingebouwd; Postgres/MySQL/MSSQL/Oracle als losse pakketten; of schrijf je eigen.' },
    f4: { num: '04 / Expliciete relaties', title: '<em>Relaties</em> expliciet gemaakt',             desc: 'has_many / belongs_to gedeclareerd op het model; relaties zijn zelf <code>QuerySet</code>.' },
    f5: { num: '05 / Atomaire transacties', title: 'Transacties, <em>netjes genest</em>',            desc: 'Contextmanager + savepoints; uitzonderingen rollen netjes terug.' },
    f6: { num: '06 / Pythonic',            title: 'Leest als <em>Engels</em>',                       desc: '<code>User.query().where(...).all()</code> — geen DSL, gewoon Python.' }
  },
  practice: {
    label: 'In de praktijk · echte code',
    title: 'Van 3.8 tot 3.12, <em>stap voor stap</em>.',
    intro: 'Spiegelt de fixtures <code>models_py38.py</code> … <code>models_py312.py</code> in de testsuite-repo.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> in plaats van <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> in plaats van <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: het <code>Self</code>-type (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> en PEP 695-generics <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Zij aan zij', title: 'Sync = async, <em>zelfde vorm</em>.', intro: 'Vervang <code>for</code> door <code>async for</code> en klaar. Type-inferentie loopt de hele keten door.', cta: 'Lees de async-gids →' },
  split_backend: { label: 'Backend-vrijheid', title: 'Schrijf je eigen <em>backend</em> in een middag.', intro: 'Subclass <code>Backend</code>, implementeer enkele dialect-hooks. DuckDB en libSQL zijn al bewezen.', cta: 'Backend-ontwikkelgids →' },
  pricing: {
    label: 'Plannen · illustratief', title: 'Kies je <em>niveau</em>.',
    intro: '(Voorbeeldkaarten — het OSS-project zelf is voor altijd gratis. Hier om pricing-kaarten op elk thema te bekijken.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Solo-ontwikkelaars en OSS-bijdragers. Volledige functies, geen limieten.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Volledige sync &amp; async API', f3: 'Community-forumsupport',
          f4: 'Team-samenwerkingsdashboard', f5: 'SLA-responsgarantie', cta: 'Aan de slag' },
    c2: { tier: 'Team',       desc: 'Groeiende teams. Enterprise-backends plus audit.',
          f1: 'Alles uit Community', f2: 'MSSQL / Oracle backends', f3: 'Auditlogboek &amp; read-write splitsing',
          f4: 'Privé Discord met voorrang', f5: 'SSO / SAML', cta: 'Start 14-daagse proef' },
    c3: { tier: 'Enterprise', desc: 'Grote organisaties. On-prem, compliance, training.', price_label: 'Neem contact op',
          f1: 'Alles uit Team', f2: 'Eigen backends (DuckDB / libSQL / intern)', f3: 'SSO / SAML / LDAP',
          f4: '4 uur SLA', f5: 'Training op locatie en toegewijde oplossingen', cta: 'Contact verkoop' }
  },
  compare: {
    label: 'Vergelijken', title: 'Vergeleken met andere Python ORM\'s.', col_feature: 'Functie',
    row1: 'Ontwerppatroon', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend zelfstandig bruikbaar',
    row3: 'Geen session-concept',
    row4: 'Consistente sync / async API',
    row5: 'Native Pydantic-integratie',
    row6: 'Runtime datavalidatie',
    row7: 'Volledige SQL-expressiviteit',
    row8: 'Capaciteitsdeclaratie',
    row9: 'SQL-transparantie <code>.to_sql()</code>',
    row10: 'Geen verplichte migratietool',
    row11: 'Minimale afhankelijkheden',
    row12: 'Explliciete relationsdefinitie'
  },
  gallery: {
    label: 'Componentgalerij · primitieven', title: 'Hoe elk thema omgaat met <em>UI-primitieven</em>.',
    c_buttons: 'Knoppen', c_btngroup: 'Knoppengroep', c_form: 'Formulierelementen',
    c_radio: 'Radiogroep', c_multi: 'Multiselect-lijst', c_dropdown: 'Uitklaplijst',
    c_alerts: 'Meldingen', c_badges: 'Badges', c_progress: 'Voortgang',
    c_grid: 'Rasterdemo (12 kol)', c_rtl: 'RTL-voorbeeld', c_table: 'Gestreepte tabel',
    form_email: 'E-mailadres', form_note: 'Notities',
    form_preload: 'Vooraf laden', form_async: 'Async',
    radio_sync: 'Sync (synchrone modus)', radio_async: 'Async (asynchrone modus)', radio_both: 'Beide (dubbele stack, gedeelde modellen)',
    alert_info:    '<b>Tip.</b> De SQLite-backend zit in het kernpakket.',
    alert_success: '<b>Klaar.</b> <code>User.configure(...)</code> is aangeroepen.',
    alert_warn:    '<b>Let op.</b> Voor vensterfuncties is SQLite ≥ 3.25 nodig.',
    prog_coverage: 'Testdekking', prog_backend: 'Backend-voortgang', prog_locale: 'Documentatielokalisatie',
    backend_note:  'Zelfde component als de bovenste balk.',
    multi1_t: 'PostgreSQL', multi1_d: 'Hoofdproductie',
    multi2_t: 'MySQL',      multi2_d: 'Legacy-services',
    multi3_t: 'SQLite',     multi3_d: 'Tests &amp; prototypes'
  },
  album: {
    label: 'Galerij · bibliotheek', title: 'Leer uit <em>voorbeelden</em>.',
    a1: 'Je eerste model', a2: 'Async in FastAPI', a3: 'has_many uitgediept',
    a4: 'Een backend schrijven', a5: 'N+1 auto-detectie', a6: 'Geneste transacties &amp; savepoints'
  },
  voices: {
    label: 'Stemmen · ervaringen', title: 'Wat <em>zij zeggen</em>.',
    q1: 'Dankzij rhosocial-activerecord vecht ik eindelijk niet meer met een ORM. Type-annotaties zijn het model — precies goed.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync en async delen één API, refactoren kost bijna niets. Mijn FastAPI-migratie was twee regels.',
    q2_role: 'Staff Engineer · Berlijn',
    q3: 'Ik schreef een DuckDB-backend. Backend-ABC gelezen tijdens de lunch, \'s middags in productie. Echte uitbreidbaarheid.',
    q3_role: 'Data Platform · Singapore',
    q4: 'Elke stap in de keten heeft het juiste afgeleide type in mijn IDE. Pydantic, op de juiste plek ingezet.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Nul runtime-dependencies is de sleutel. Voor embedded deployments maken we ons niet meer druk om de grootte van SQLAlchemy.',
    q5_role: 'IoT-ingenieur · Shenzhen'
  },
  auth: {
    label: 'Auth · aanmelddemo', title: 'Aanmelden bij <em>rhosocial</em>.',
    welcome: 'Welkom terug', sub: 'Ga verder met je rhosocial-account.',
    email: 'E-mail', password: 'Wachtwoord', remember: 'Onthoud mij', forgot: 'Wachtwoord vergeten?',
    login: 'Aanmelden', or: 'OF', github: 'Doorgaan met GitHub', twitter: 'Doorgaan met Twitter',
    no_account: 'Nog geen account?', register: 'Registreren'
  },
  stats: {
    label: 'In cijfers', title: 'Wat <em>cijfers</em>.',
    s1: 'Beschikbare DB-dialecten', s2: 'Dekking van type-annotaties', s3: 'Minimaal Python', s4: 'Externe ORM-deps'
  },
  install: {
    label: 'Aan de slag', title: 'Installeer in één regel, <em>tien minuten</em> tot je eerste query.',
    sub: 'Gepubliceerd op PyPI. De SQLite-backend zit in het kernpakket; andere backends installeer je op verzoek.',
    docs: 'Lees de docs →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
