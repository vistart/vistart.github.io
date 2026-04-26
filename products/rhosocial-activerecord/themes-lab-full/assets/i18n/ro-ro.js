/**
 * i18n · ro-ro · Română
 */
window.I18N = window.I18N || {};
window.I18N['ro-ro'] = {
  meta: { name: 'Română' },
  control: { theme_label: 'Temă', font_label: 'Font', lang_label: 'Limbă', font_auto: 'Automat (implicit temă)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title: 'rhosocial ActiveRecord,<br><em>redesignat</em> pentru Python.',
    sub: '<strong>rhosocial-activerecord</strong> definește modelele folosind adnotări de tip native din Python și le interoghează cu lanțul <code>query().where(...).all()</code>. Sincron și asincron din prima zi. Fără dependențe ORM externe — SQLite inclus, alte baze de date în pachete separate, backend propriu în câteva zeci de linii.',
    cta_secondary: 'Vezi funcționalitățile →'
  },
  features: {
    label: 'De ce · 6 promisiuni',
    title: 'De ce <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tip = câmp', title: '<em>Type-safe</em> din construcție', desc: '<code>name: str</code> — stocare, validare și sugestii IDE într-o singură expresie.' },
    f2: { num: '02 / Async de primă clasă', title: 'Sync &amp; async, <em>un singur API</em>', desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code> — formă identică.' },
    f3: { num: '03 / Backend-uri interschimbabile', title: 'Backend-uri <em>interschimbabile</em>', desc: 'SQLite inclus; Postgres/MySQL/MSSQL/Oracle pachete separate; sau propriu.' },
    f4: { num: '04 / Relații explicite', title: '<em>Relații</em> declarate explicit', desc: 'has_many / belongs_to declarate pe model; relațiile sunt <code>QuerySet</code>.' },
    f5: { num: '05 / Tranzacții atomice', title: 'Tranzacții, <em>corect imbricate</em>', desc: 'Context manager + savepoint; excepțiile declanșează rollback curat.' },
    f6: { num: '06 / Pythonic', title: 'Se citește ca <em>engleza</em>', desc: '<code>User.query().where(...).all()</code> — fără DSL, doar Python.' }
  },
  practice: {
    label: 'În practică · cod real',
    title: 'De la 3.8 la 3.12, <em>pas cu pas</em>.',
    intro: 'Corespunde fișierelor <code>models_py38.py</code> … <code>models_py312.py</code> din repo-ul testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> în loc de <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> în loc de <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: tipul <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> și generice PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync: {
    label: 'Comparare',
    title: 'Sync = async, <em>aceeași semantică</em>.',
    intro: 'Înlocuiți <code>for</code> cu <code>async for</code> — gata. Inferența tipurilor traversează tot lanțul.',
    cta: 'Citiți ghidul async →'
  },
  split_backend: {
    label: 'Libertatea backend-ului',
    title: 'Scrieți un <em>backend</em> propriu într-o după-amiază.',
    intro: 'Moșteniți <code>Backend</code>, implementați câteva hook-uri de dialect. DuckDB și libSQL sunt deja verificate.',
    cta: 'Ghid dezvoltator backend →'
  },
  pricing: {
    label: 'Planuri · exemplu',
    title: 'Alegeți <em>planul</em> dumneavoastră.',
    intro: '(Carduri de exemplu — proiectul OSS în sine este gratuit pentru totdeauna. Cardurile pricing sunt afișate pentru a testa componenta pe fiecare temă.)',
    badge: 'Cel mai popular',
    c1: {
      tier: 'Community', desc: 'Pentru dezvoltatori individuali și contributori OSS. Funcționalitate completă, fără limite.',
      f1: 'SQLite / PostgreSQL / MySQL', f2: 'API complet sync &amp; async', f3: 'Suport pe forum comunitate',
      f4: 'Dashboard colaborativ', f5: 'Garanție răspuns SLA', cta: 'Începeți'
    },
    c2: {
      tier: 'Team', desc: 'Echipe în creștere. Backend-uri enterprise și audit.',
      f1: 'Tot ce e în Community', f2: 'Backend-uri MSSQL / Oracle', f3: 'Jurnal audit &amp; separare citire/scriere',
      f4: 'Discord privat cu prioritate', f5: 'SSO / SAML', cta: 'Testați 14 zile'
    },
    c3: {
      tier: 'Enterprise', desc: 'Organizații mari. On-prem, conformitate, training.',
      price_label: 'Contactați-ne',
      f1: 'Tot ce e în Team', f2: 'Backend-uri custom (DuckDB / libSQL / interne)', f3: 'SSO / SAML / LDAP',
      f4: 'SLA 4 ore', f5: 'Training onsite și soluții dedicate', cta: 'Contactați vânzările'
    }
  },
  compare: {
    label: 'Comparare', title: 'Compararea <em>funcționalităților</em> pe planuri.',
    col_feature: 'Funcționalitate',
    row1: 'SQLite / Postgres / MySQL', row2: 'Backend-uri MSSQL / Oracle', row3: 'Backend-uri custom',
    row4: 'API complet sync / async', row5: 'Jurnal audit', row6: 'Separare citire/scriere',
    row7: 'SSO / SAML / LDAP', row8: 'Răspuns SLA', row8c: '— comunitate', row8t: '24 ore', row8e: '4 ore',
    row9: 'Preț anual'
  },
  gallery: {
    label: 'Galerie componente · primitive UI', title: 'Cum tratează fiecare temă <em>primitivele UI</em>.',
    c_buttons: 'Butoane', c_btngroup: 'Grup de butoane', c_form: 'Controale formular', c_radio: 'Grup radio',
    c_multi: 'Listă selecție multiplă', c_dropdown: 'Listă derulantă', c_alerts: 'Alerte',
    c_badges: 'Insigne', c_progress: 'Progres', c_grid: 'Demo grid (12 coloane)',
    c_rtl: 'Previzualizare RTL', c_table: 'Tabel cu dungi',
    form_email: 'Adresă email', form_note: 'Notițe', form_preload: 'Preîncărcare', form_async: 'Async',
    radio_sync: 'Sync (mod sincron)', radio_async: 'Async (mod asincron)', radio_both: 'Ambele (modele partajate)',
    alert_info: '<b>Sfat.</b> Backend-ul SQLite vine cu pachetul de bază.',
    alert_success: '<b>Gata.</b> <code>User.configure(...)</code> apelat.',
    alert_warn: '<b>Atenție.</b> Funcțiile fereastră necesită SQLite ≥ 3.25.',
    prog_coverage: 'Acoperire teste', prog_backend: 'Completare backend', prog_locale: 'Localizare documentație',
    backend_note: 'Aceeași componentă ca bara de control de sus.',
    multi1_t: 'PostgreSQL', multi1_d: 'Producție principală', multi2_t: 'MySQL', multi2_d: 'Servicii legacy', multi3_t: 'SQLite', multi3_d: 'Teste &amp; prototipuri'
  },
  album: {
    label: 'Galerie · bibliotecă', title: 'Învățați din <em>exemple</em>.',
    a1: 'Primul dumneavoastră model', a2: 'Async cu FastAPI', a3: 'has_many în profunzime',
    a4: 'Scrierea unui backend', a5: 'Detectare automată N+1', a6: 'Tranzacții imbricate &amp; savepoint'
  },
  voices: {
    label: 'Voci · opinii', title: 'Ce <em>spun</em>.',
    q1: 'Cu rhosocial-activerecord în sfârșit am încetat să mai lupt cu ORM-ul. Adnotările de tip sunt modelul — exact așa.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync și async au un singur API, refactor-ul e aproape gratuit. Migrarea pe FastAPI a fost două linii.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Am scris un backend DuckDB. Am citit Backend ABC la prânz, după-amiază era pe producție. Asta e extensibilitate reală.',
    q3_role: 'Data Platform · Singapore',
    q4: 'Fiecare pas din lanț are inferență de tip corectă în IDE. Pydantic folosit unde trebuie.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Zero dependențe la runtime — cheia. În embedded nu mai suferim din cauza dimensiunii SQLAlchemy.',
    q5_role: 'Inginer IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo autentificare', title: 'Autentificați-vă în <em>rhosocial</em>.',
    welcome: 'Bine ați revenit', sub: 'Continuați cu contul dumneavoastră rhosocial.',
    email: 'Email', password: 'Parolă', remember: 'Ține-mă minte', forgot: 'Ați uitat parola?',
    login: 'Autentificare', or: 'SAU', github: 'Continuă cu GitHub', twitter: 'Continuă cu Twitter',
    no_account: 'Nu aveți cont?', register: 'Înregistrare'
  },
  stats: {
    label: 'În cifre', title: 'Câteva <em>cifre</em>.',
    s1: 'Dialecte DB disponibile', s2: 'Acoperire adnotări de tip', s3: 'Python minim', s4: 'Dependențe ORM externe'
  },
  install: {
    label: 'Începeți', title: 'Instalare într-o linie, <em>zece minute</em> până la prima interogare.',
    sub: 'Publicat pe PyPI. Backend-ul SQLite este inclus; restul le instalați după nevoie.',
    docs: 'Citiți documentația →'
  },
  footer: {
    hotkeys: '25 themes × 26 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">key</span> theme / <span class="kbd">Shift</span>+<span class="kbd">key</span> font / <span class="kbd">Alt</span>+<span class="kbd">key</span> language'
  }
};