/**
 * i18n · de-de · Deutsch
 */
window.I18N = window.I18N || {};
window.I18N['de-de'] = {
  meta: { name: 'Deutsch' },
  control: { theme_label: 'Design', font_label: 'Schrift', lang_label: 'Sprache', font_auto: 'Automatisch (Design-Vorgabe)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>für Python <em>neu gedacht</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> definiert Modelle über native Python-Typannotationen und fragt sie per Kette <code>query().where(...).all()</code> ab. Sync und Async gehören ab Werk dazu. Keine externen ORM-Abhängigkeiten — SQLite ist integriert, andere Datenbanken als separate Pakete, und ein eigenes Backend schreibt man in wenigen Dutzend Zeilen.',
    cta_secondary: 'Funktionen ansehen →'
  },
  features: {
    label: 'Warum · sechs Kernversprechen',
    title: 'Warum <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Typ = Feld',          title: 'Von Natur aus <em>typsicher</em>',                desc: 'Ein Feld ist schlicht <code>name: str</code> — Speicherung, Validierung und IDE-Ergänzung in einem.' },
    f2: { num: '02 / Async erstklassig',   title: 'Sync &amp; Async, <em>eine API</em>',             desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, identische Form.' },
    f3: { num: '03 / Austauschbare Backends', title: 'Einsteckbare <em>Backends</em>',               desc: 'SQLite integriert; Postgres/MySQL/MSSQL/Oracle als eigenständige Pakete; oder eigenes schreiben.' },
    f4: { num: '04 / Explizite Relationen', title: '<em>Relationen</em> explizit gemacht',           desc: 'has_many / belongs_to am Modell deklariert; Relationen sind selbst <code>QuerySet</code>s.' },
    f5: { num: '05 / Atomare Transaktionen', title: 'Transaktionen, <em>sauber verschachtelt</em>',  desc: 'Context-Manager plus Savepoints; Ausnahmen führen zum Rollback.' },
    f6: { num: '06 / Pythonisch',          title: 'Liest sich wie <em>Englisch</em>',                desc: '<code>User.query().where(...).all()</code> — keine DSL, nur Python.' }
  },
  practice: {
    label: 'In der Praxis · echter Code',
    title: 'Von 3.8 bis 3.12, <em>Schritt für Schritt</em>.',
    intro: 'Entspricht den Fixtures <code>models_py38.py</code> … <code>models_py312.py</code> im testsuite-Repo.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> statt <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> statt <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: der <code>Self</code>-Typ (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> und PEP-695-Generics <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Side by side', title: 'Sync = async, <em>gleiche Form</em>.', intro: '<code>for</code> gegen <code>async for</code> tauschen, fertig. Typinferenz läuft die Kette bis zum Ende durch.', cta: 'Async-Leitfaden lesen →' },
  split_backend: { label: 'Backend-Freiheit', title: 'Schreib dein eigenes <em>Backend</em> in wenigen Zeilen.', intro: '<code>Backend</code> erben, ein paar Dialekt-Hooks implementieren, fertig. DuckDB und libSQL sind bereits erprobt.', cta: 'Backend-Entwicklerleitfaden →' },
  pricing: {
    label: 'Pläne · beispielhaft', title: 'Wähle deine <em>Stufe</em>.',
    intro: '(Beispielkarten — das OSS-Projekt selbst bleibt für immer kostenlos. Gezeigt, damit Pricing-Karten in jedem Design geprüft werden können.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Einzelentwickler und OSS-Beitragende. Voller Funktionsumfang, keine Limits.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Vollständige Sync- &amp; Async-API', f3: 'Community-Forum-Support',
          f4: 'Team-Kollaborations-Dashboard', f5: 'SLA-Antwortgarantie', cta: 'Loslegen' },
    c2: { tier: 'Team',       desc: 'Wachsende Teams. Enterprise-Backends mit Audit.',
          f1: 'Alles aus Community', f2: 'MSSQL / Oracle Backends', f3: 'Audit-Log &amp; Read-Write-Splitting',
          f4: 'Privater Discord mit Vorrang', f5: 'SSO / SAML', cta: '14 Tage testen' },
    c3: { tier: 'Enterprise', desc: 'Großorganisationen. On-Prem, Compliance, Schulungen.', price_label: 'Kontakt',
          f1: 'Alles aus Team', f2: 'Eigene Backends (DuckDB / libSQL / intern)', f3: 'SSO / SAML / LDAP',
          f4: '4-Stunden-SLA', f5: 'Vor-Ort-Schulungen und dedizierte Lösungen', cta: 'Vertrieb kontaktieren' }
  },
  compare: {
    label: 'Vergleich', title: 'Im Vergleich zu anderen Python ORMs.', col_feature: 'Merkmal',
    row1: 'Entwurfsmuster', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend unabhängig nutzbar',
    row3: 'Kein Session-Konzept',
    row4: 'Konsistente Sync-/Async-API',
    row5: 'Native Pydantic-Integration',
    row6: 'Laufzeitdatenvalidierung',
    row7: 'Volle SQL-Ausdrucksfähigkeit',
    row8: 'Capability-Deklaration',
    row9: 'SQL-Transparenz <code>.to_sql()</code>',
    row10: 'Kein erzwungenes Migrations-Tool',
    row11: 'Minimale Abhängigkeiten',
    row12: 'Explizite Relationsdefinition'
  },
  gallery: {
    label: 'Component Gallery · Primitive', title: 'Wie jedes Design mit <em>UI-Primitiven</em> umgeht.',
    c_buttons: 'Buttons', c_btngroup: 'Button-Gruppe', c_form: 'Formularelemente',
    c_radio: 'Radio-Gruppe', c_multi: 'Mehrfachauswahl', c_dropdown: 'Dropdown',
    c_alerts: 'Hinweise', c_badges: 'Badges', c_progress: 'Fortschritt',
    c_grid: 'Raster-Demo (12-Spalten)', c_rtl: 'RTL-Vorschau', c_table: 'Gestreifte Tabelle',
    form_email: 'E-Mail-Adresse', form_note: 'Anmerkungen',
    form_preload: 'Vorladen', form_async: 'Async',
    radio_sync: 'Sync (synchroner Modus)', radio_async: 'Async (asynchroner Modus)', radio_both: 'Beide (geteilte Modelle)',
    alert_info:    '<b>Hinweis.</b> Das SQLite-Backend ist im Kernpaket enthalten.',
    alert_success: '<b>Bereit.</b> <code>User.configure(...)</code> wurde aufgerufen.',
    alert_warn:    '<b>Achtung.</b> Für Fensterfunktionen ist SQLite ≥ 3.25 erforderlich.',
    prog_coverage: 'Testabdeckung', prog_backend: 'Backend-Fortschritt', prog_locale: 'Dokumentations-Lokalisierung',
    backend_note:  'Dieselbe Komponente wie in der oberen Steuerleiste.',
    multi1_t: 'PostgreSQL', multi1_d: 'Hauptproduktion',
    multi2_t: 'MySQL',      multi2_d: 'Altsysteme',
    multi3_t: 'SQLite',     multi3_d: 'Tests &amp; Prototypen'
  },
  album: {
    label: 'Galerie · Bibliothek', title: 'Von <em>Beispielen</em> lernen.',
    a1: 'Dein erstes Modell', a2: 'Async in FastAPI', a3: 'has_many im Detail',
    a4: 'Eigenes Backend schreiben', a5: 'N+1-Autoerkennung', a6: 'Verschachtelte Transaktionen &amp; Savepoints'
  },
  voices: {
    label: 'Stimmen · Referenzen', title: 'Was sie <em>sagen</em>.',
    q1: 'Mit rhosocial-activerecord kämpfe ich endlich nicht mehr gegen ein ORM. Typannotationen sind das Modell — genau richtig.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync und Async teilen sich eine API, Refactoring kostet nichts. Die FastAPI-Migration waren zwei Zeilen.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Ich habe ein DuckDB-Backend geschrieben. Backend-ABC gelesen, am Nachmittag lief es. Echte Erweiterbarkeit.',
    q3_role: 'Data Platform · Singapur',
    q4: 'Jeder Schritt der Kette wird in der IDE korrekt inferiert. Pydantic, am richtigen Ort eingesetzt.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Null Runtime-Dependencies sind der Schlüssel. Für Embedded-Deployments müssen wir uns um SQLAlchemys Größe nicht mehr sorgen.',
    q5_role: 'IoT-Ingenieur · Shenzhen'
  },
  auth: {
    label: 'Auth · Anmelde-Demo', title: 'Bei <em>rhosocial</em> anmelden.',
    welcome: 'Willkommen zurück', sub: 'Fahre mit deinem rhosocial-Konto fort.',
    email: 'E-Mail', password: 'Passwort', remember: 'Angemeldet bleiben', forgot: 'Passwort vergessen?',
    login: 'Anmelden', or: 'ODER', github: 'Mit GitHub fortfahren', twitter: 'Mit Twitter fortfahren',
    no_account: 'Noch kein Konto?', register: 'Registrieren'
  },
  stats: {
    label: 'In Zahlen', title: 'Ein paar <em>Zahlen</em>.',
    s1: 'Verfügbare DB-Dialekte', s2: 'Typannotations-Abdeckung', s3: 'Minimales Python', s4: 'Externe ORM-Deps'
  },
  install: {
    label: 'Loslegen', title: 'Eine Zeile installieren, <em>zehn Minuten</em> zur ersten Query.',
    sub: 'Auf PyPI veröffentlicht. Das SQLite-Backend kommt mit dem Kernpaket; weitere Backends nach Bedarf.',
    docs: 'Dokumentation lesen →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
