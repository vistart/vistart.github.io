/**
 * i18n · it-it · Italiano
 */
window.I18N = window.I18N || {};
window.I18N['it-it'] = {
  meta: { name: 'Italiano' },
  control: { theme_label: 'Tema', font_label: 'Carattere', lang_label: 'Lingua', font_auto: 'Auto (predefinito del tema)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>ripensato per <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> definisce i modelli con le annotazioni di tipo native di Python e li interroga con una catena <code>query().where(...).all()</code>. Sync e async dal primo giorno. Nessuna dipendenza ORM esterna — SQLite è integrato, altri database in pacchetti separati, e puoi scrivere il tuo backend in poche decine di righe.',
    cta_secondary: 'Vedi le funzionalità →'
  },
  features: {
    label: 'Perché · sei promesse fondamentali',
    title: 'Perché <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tipo = campo',          title: '<em>Type-safe</em> per costruzione',            desc: 'Un campo è semplicemente <code>name: str</code> — memorizzazione, validazione e autocompletamento IDE in uno.' },
    f2: { num: '02 / Async di prima classe', title: 'Sync &amp; async, <em>una sola API</em>',       desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, forma identica.' },
    f3: { num: '03 / Backend modulari',      title: 'Backend <em>modulari</em>',                     desc: 'SQLite integrato; Postgres/MySQL/MSSQL/Oracle come pacchetti separati; o scrivi il tuo.' },
    f4: { num: '04 / Relazioni esplicite',   title: '<em>Relazioni</em> rese esplicite',             desc: 'has_many / belongs_to dichiarate sul modello; le relazioni sono esse stesse <code>QuerySet</code>.' },
    f5: { num: '05 / Transazioni atomiche',  title: 'Transazioni, <em>nidificate correttamente</em>', desc: 'Context manager + savepoint; le eccezioni fanno rollback pulito.' },
    f6: { num: '06 / Pythonic',              title: 'Si legge come l\'<em>inglese</em>',             desc: '<code>User.query().where(...).all()</code> — niente DSL, solo Python.' }
  },
  practice: {
    label: 'In pratica · codice reale',
    title: 'Da 3.8 a 3.12, <em>un passo alla volta</em>.',
    intro: 'Corrisponde alle fixture <code>models_py38.py</code> … <code>models_py312.py</code> nel repo testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> sostituisce <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> sostituisce <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: il tipo <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> e i generici PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Fianco a fianco', title: 'Sync = async, <em>stessa semantica</em>.', intro: 'Sostituisci <code>for</code> con <code>async for</code> e basta. L\'inferenza di tipi attraversa tutta la catena.', cta: 'Leggi la guida async →' },
  split_backend: { label: 'Libertà di backend', title: 'Scrivi il tuo <em>backend</em> in poche decine di righe.', intro: 'Estendi <code>Backend</code>, implementa alcuni hook di dialetto. DuckDB e libSQL sono già stati provati.', cta: 'Guida sviluppatore backend →' },
  pricing: {
    label: 'Piani · illustrativi', title: 'Scegli il tuo <em>livello</em>.',
    intro: '(Cartellini di esempio — il progetto OSS è gratuito per sempre. Qui per verificare i pricing card in ogni tema.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Sviluppatori indipendenti e contributori OSS. Funzionalità complete, senza limiti.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async completa', f3: 'Supporto forum community',
          f4: 'Dashboard di collaborazione', f5: 'Garanzia SLA di risposta', cta: 'Inizia' },
    c2: { tier: 'Team',       desc: 'Team in crescita. Backend enterprise e audit.',
          f1: 'Tutto di Community', f2: 'Backend MSSQL / Oracle', f3: 'Log di audit &amp; separazione read/write',
          f4: 'Discord privato con priorità', f5: 'SSO / SAML', cta: 'Prova di 14 giorni' },
    c3: { tier: 'Enterprise', desc: 'Grandi organizzazioni. On-prem, compliance, formazione.', price_label: 'Contattaci',
          f1: 'Tutto di Team', f2: 'Backend personalizzati (DuckDB / libSQL / interno)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA di 4 ore', f5: 'Formazione on-site e soluzioni dedicate', cta: 'Contatta le vendite' }
  },
  compare: {
    label: 'Confronta', title: 'Confronto <em>funzionalità</em>.', col_feature: 'Funzionalità',
    row1: 'SQLite / Postgres / MySQL', row2: 'Backend MSSQL / Oracle', row3: 'Backend personalizzati',
    row4: 'API sync / async completa', row5: 'Log di audit', row6: 'Separazione read/write', row7: 'SSO / SAML / LDAP',
    row8: 'Risposta SLA', row8c: '— community', row8t: '24 ore', row8e: '4 ore', row9: 'Prezzo annuale'
  },
  gallery: {
    label: 'Galleria componenti · primitivi', title: 'Come ogni tema gestisce i <em>primitivi UI</em>.',
    c_buttons: 'Pulsanti', c_btngroup: 'Gruppo pulsanti', c_form: 'Controlli modulo',
    c_radio: 'Gruppo radio', c_multi: 'Lista multiselezione', c_dropdown: 'Menu a tendina',
    c_alerts: 'Avvisi', c_badges: 'Etichette', c_progress: 'Avanzamento',
    c_grid: 'Demo griglia (12 col)', c_rtl: 'Anteprima RTL', c_table: 'Tabella a righe',
    form_email: 'Indirizzo e-mail', form_note: 'Note',
    form_preload: 'Precarica', form_async: 'Async',
    radio_sync: 'Sync (modalità sincrona)', radio_async: 'Async (modalità asincrona)', radio_both: 'Entrambi (doppio stack, modelli condivisi)',
    alert_info:    '<b>Suggerimento.</b> Il backend SQLite è incluso nel pacchetto principale.',
    alert_success: '<b>Pronto.</b> <code>User.configure(...)</code> è stato chiamato.',
    alert_warn:    '<b>Attenzione.</b> Per le funzioni finestra serve SQLite ≥ 3.25.',
    prog_coverage: 'Copertura test', prog_backend: 'Completamento backend', prog_locale: 'Localizzazione documentazione',
    backend_note:  'Stesso componente della barra di controllo superiore.',
    multi1_t: 'PostgreSQL', multi1_d: 'Produzione principale',
    multi2_t: 'MySQL',      multi2_d: 'Servizi legacy',
    multi3_t: 'SQLite',     multi3_d: 'Test &amp; prototipi'
  },
  album: {
    label: 'Galleria · biblioteca', title: 'Imparare dagli <em>esempi</em>.',
    a1: 'Il tuo primo modello', a2: 'Async in FastAPI', a3: 'has_many in profondità',
    a4: 'Scrivere un backend', a5: 'Rilevamento automatico N+1', a6: 'Transazioni annidate &amp; savepoint'
  },
  voices: {
    label: 'Voci · testimonianze', title: 'Cosa <em>dicono</em>.',
    q1: 'Con rhosocial-activerecord non combatto più con l\'ORM. Le annotazioni di tipo sono il modello — giustissimo.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync e async condividono un\'unica API, il refactoring costa quasi zero. Migrare il mio FastAPI sono state due righe.',
    q2_role: 'Staff Engineer · Berlino',
    q3: 'Ho scritto un backend DuckDB. Letto Backend ABC a pranzo, in produzione al pomeriggio. Questa è vera estensibilità.',
    q3_role: 'Data Platform · Singapore',
    q4: 'Ogni passo della catena ha il tipo correttamente inferito nell\'IDE. Pydantic, usato al posto giusto.',
    q4_role: 'Senior Python · San Paolo',
    q5: 'Zero dipendenze runtime è la chiave. Per il deployment embedded non ci preoccupiamo più della dimensione di SQLAlchemy.',
    q5_role: 'Ingegnere IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo di accesso', title: 'Accedi a <em>rhosocial</em>.',
    welcome: 'Bentornato', sub: 'Continua con il tuo account rhosocial.',
    email: 'E-mail', password: 'Password', remember: 'Ricordami', forgot: 'Password dimenticata?',
    login: 'Accedi', or: 'OPPURE', github: 'Continua con GitHub', twitter: 'Continua con Twitter',
    no_account: 'Non hai un account?', register: 'Registrati'
  },
  stats: {
    label: 'In numeri', title: 'Alcuni <em>numeri</em>.',
    s1: 'Dialetti DB disponibili', s2: 'Copertura annotazioni di tipo', s3: 'Python minimo', s4: 'Dipendenze ORM esterne'
  },
  install: {
    label: 'Inizia', title: 'Installa in una riga, <em>dieci minuti</em> alla prima query.',
    sub: 'Pubblicato su PyPI. Il backend SQLite è incluso; gli altri si installano a richiesta.',
    docs: 'Leggi la documentazione →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
