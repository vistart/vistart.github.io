/**
 * i18n · el-gr · Ελληνικά
 */
window.I18N = window.I18N || {};
window.I18N['el-gr'] = {
  meta: { name: 'Ελληνικά' },
  control: { theme_label: 'Θέμα', font_label: 'Γραμματοσειρά', lang_label: 'Γλώσσα', font_auto: 'Αυτόματη (προεπιλογή θέματος)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>επανασχεδιασμένο για <em>Python</em>.',
    sub:     'Το <strong>rhosocial-activerecord</strong> ορίζει μοντέλα με τις εγγενείς σημειώσεις τύπων της Python και τα ερωτά με αλυσίδα <code>query().where(...).all()</code>. Σύγχρονο και ασύγχρονο από την πρώτη μέρα. Καμία εξωτερική εξάρτηση ORM — το SQLite είναι ενσωματωμένο, άλλες βάσεις δεδομένων είναι ξεχωριστά πακέτα, και μπορείτε να γράψετε το δικό σας backend σε λίγες δεκάδες γραμμές.',
    cta_secondary: 'Δείτε τα χαρακτηριστικά →'
  },
  features: {
    label: 'Γιατί · έξι βασικές υποσχέσεις',
    title: 'Γιατί <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Τύπος = πεδίο',         title: 'Από κατασκευής <em>τυπικά ασφαλές</em>',          desc: 'Ένα πεδίο είναι απλώς <code>name: str</code> — αποθήκευση, επικύρωση και συμπλήρωση IDE σε ένα.' },
    f2: { num: '02 / Ασύγχρονο πρώτης τάξης', title: 'Sync &amp; async, <em>ένα API</em>',              desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, ίδιος σχηματισμός.' },
    f3: { num: '03 / Αντικαταστάσιμα backends', title: 'Αντικαταστάσιμα <em>backends</em>',            desc: 'SQLite ενσωματωμένο· Postgres/MySQL/MSSQL/Oracle ως ξεχωριστά πακέτα· ή γράψτε το δικό σας.' },
    f4: { num: '04 / Ρητές σχέσεις',         title: '<em>Σχέσεις</em> δηλωμένες ρητά',                 desc: 'has_many / belongs_to δηλώνονται στο μοντέλο· οι ίδιες οι σχέσεις είναι <code>QuerySet</code>.' },
    f5: { num: '05 / Ατομικές συναλλαγές',   title: 'Συναλλαγές, <em>σωστά ένθετες</em>',              desc: 'Διαχειριστής πλαισίου + savepoints· οι εξαιρέσεις επαναφέρουν καθαρά.' },
    f6: { num: '06 / Pythonic',              title: 'Διαβάζεται σαν <em>αγγλικά</em>',                  desc: '<code>User.query().where(...).all()</code> — χωρίς DSL, απλώς Python.' }
  },
  practice: {
    label: 'Στην πράξη · πραγματικός κώδικας',
    title: 'Από το 3.8 στο 3.12, <em>βήμα-βήμα</em>.',
    intro: 'Αντιστοιχεί στα fixtures <code>models_py38.py</code> … <code>models_py312.py</code> του αποθετηρίου testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> αντί για <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> αντί για <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: ο τύπος <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> και γενικοί τύποι PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Δίπλα-δίπλα', title: 'Sync = async, <em>ίδια σημασιολογία</em>.', intro: 'Αντικαταστήστε το <code>for</code> με <code>async for</code> και τελειώσατε. Η εξαγωγή τύπων διατρέχει όλη την αλυσίδα.', cta: 'Διαβάστε τον οδηγό async →' },
  split_backend: { label: 'Ελευθερία backend', title: 'Γράψτε το δικό σας <em>backend</em> σε ένα απόγευμα.', intro: 'Κληρονομήστε το <code>Backend</code>, υλοποιήστε μερικά hooks διαλέκτου. DuckDB και libSQL έχουν ήδη δοκιμαστεί.', cta: 'Οδηγός ανάπτυξης backend →' },
  pricing: {
    label: 'Πλάνα · ενδεικτικά', title: 'Επιλέξτε το <em>επίπεδό σας</em>.',
    intro: '(Δείγμα καρτών — το ίδιο το έργο OSS είναι δωρεάν για πάντα. Εμφανίζεται για προεπισκόπηση των pricing σε κάθε θέμα.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Μεμονωμένοι προγραμματιστές και συνεισφέροντες OSS. Πλήρη χαρακτηριστικά, χωρίς όρια.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Πλήρες sync &amp; async API', f3: 'Υποστήριξη στο φόρουμ της κοινότητας',
          f4: 'Πίνακας συνεργασίας ομάδας', f5: 'Εγγύηση απόκρισης SLA', cta: 'Ξεκινήστε' },
    c2: { tier: 'Team',       desc: 'Αναπτυσσόμενες ομάδες. Εταιρικά backends και έλεγχος.',
          f1: 'Όλα του Community', f2: 'Backends MSSQL / Oracle', f3: 'Αρχείο ελέγχου &amp; διαχωρισμός ανάγνωσης/εγγραφής',
          f4: 'Ιδιωτικό Discord με προτεραιότητα', f5: 'SSO / SAML', cta: 'Δοκιμή 14 ημερών' },
    c3: { tier: 'Enterprise', desc: 'Μεγάλοι οργανισμοί. On-prem, συμμόρφωση, εκπαίδευση.', price_label: 'Επικοινωνία',
          f1: 'Όλα του Team', f2: 'Προσαρμοσμένα backends (DuckDB / libSQL / εσωτερικά)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 ωρών', f5: 'Επιτόπια εκπαίδευση και αφιερωμένες λύσεις', cta: 'Επικοινωνία πωλήσεων' }
  },
  compare: {
    label: 'Σύγκριση', title: 'Σύγκριση με άλλα Python ORM.', col_feature: 'Χαρακτηριστικό',
    row1: 'Μοτίβο σχεδίασης', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend αυτόνομα χρησιμοποιήσιμο',
    row3: 'Χωρίς έννοια session',
    row4: 'Συνεπές sync / async API',
    row5: 'Εγγενής ενσωμάτωση Pydantic',
    row6: 'Επικύρωση δεδομένων κατά την εκτέλεση',
    row7: 'Πλήρης εκφραστικότητα SQL',
    row8: 'Δήλωση δυνατοτήτων',
    row9: 'Διαφάνεια SQL <code>.to_sql()</code>',
    row10: 'Χωρίς υποχρεωτικό εργαλείο μετεγκατάστασης',
    row11: 'Ελάχιστες εξαρτήσεις',
    row12: 'Ρητός ορισμός σχέσεων'
  },
  gallery: {
    label: 'Γκαλερί συστατικών · πρωτογενή', title: 'Πώς κάθε θέμα χειρίζεται τα <em>πρωτογενή UI</em>.',
    c_buttons: 'Κουμπιά', c_btngroup: 'Ομάδα κουμπιών', c_form: 'Στοιχεία φόρμας',
    c_radio: 'Ομάδα radio', c_multi: 'Λίστα πολλαπλής επιλογής', c_dropdown: 'Αναπτυσσόμενη λίστα',
    c_alerts: 'Ειδοποιήσεις', c_badges: 'Σήματα', c_progress: 'Πρόοδος',
    c_grid: 'Επίδειξη πλέγματος (12 στήλες)', c_rtl: 'Προεπισκόπηση RTL', c_table: 'Ριγωτός πίνακας',
    form_email: 'Διεύθυνση email', form_note: 'Σημειώσεις',
    form_preload: 'Προφόρτωση', form_async: 'Async',
    radio_sync: 'Sync (σύγχρονη λειτουργία)', radio_async: 'Async (ασύγχρονη λειτουργία)', radio_both: 'Και τα δύο (διπλή στοίβα, κοινά μοντέλα)',
    alert_info:    '<b>Συμβουλή.</b> Το backend SQLite συνοδεύει το βασικό πακέτο.',
    alert_success: '<b>Έτοιμο.</b> Η <code>User.configure(...)</code> κλήθηκε.',
    alert_warn:    '<b>Προσοχή.</b> Για window functions απαιτείται SQLite ≥ 3.25.',
    prog_coverage: 'Κάλυψη τεστ', prog_backend: 'Ολοκλήρωση backend', prog_locale: 'Τοπικοποίηση τεκμηρίωσης',
    backend_note:  'Το ίδιο συστατικό με την επάνω μπάρα ελέγχου.',
    multi1_t: 'PostgreSQL', multi1_d: 'Κύρια παραγωγή',
    multi2_t: 'MySQL',      multi2_d: 'Παλαιές υπηρεσίες',
    multi3_t: 'SQLite',     multi3_d: 'Τεστ &amp; πρωτότυπα'
  },
  album: {
    label: 'Γκαλερί · βιβλιοθήκη', title: 'Μάθετε από <em>παραδείγματα</em>.',
    a1: 'Το πρώτο σας μοντέλο', a2: 'Async στο FastAPI', a3: 'has_many σε βάθος',
    a4: 'Γράψτε ένα backend', a5: 'Αυτόματη ανίχνευση N+1', a6: 'Ένθετες συναλλαγές &amp; savepoints'
  },
  voices: {
    label: 'Φωνές · μαρτυρίες', title: 'Τι <em>λένε</em>.',
    q1: 'Χάρη στο rhosocial-activerecord δεν παλεύω πια με ORM. Οι σημειώσεις τύπων είναι το μοντέλο — ακριβώς σωστό.',
    q1_role: 'Backend Engineer · Κιότο',
    q2: 'Sync και async μοιράζονται ένα API, το refactoring είναι σχεδόν δωρεάν. Η μετάβαση του FastAPI μου έγινε σε δύο γραμμές.',
    q2_role: 'Staff Engineer · Βερολίνο',
    q3: 'Έγραψα ένα backend DuckDB. Διάβασα το Backend ABC στο μεσημέρι, το απόγευμα ήταν στην παραγωγή. Αυτό είναι επεκτασιμότητα.',
    q3_role: 'Data Platform · Σιγκαπούρη',
    q4: 'Κάθε βήμα της αλυσίδας έχει σωστά εξαγόμενο τύπο στο IDE. Το Pydantic, χρησιμοποιημένο σωστά.',
    q4_role: 'Senior Python · Σάο Πάολο',
    q5: 'Μηδέν εξαρτήσεις runtime είναι το κλειδί. Σε embedded δεν ανησυχούμε πια για το μέγεθος του SQLAlchemy.',
    q5_role: 'Μηχανικός IoT · Σενζέν'
  },
  auth: {
    label: 'Auth · επίδειξη σύνδεσης', title: 'Συνδεθείτε στο <em>rhosocial</em>.',
    welcome: 'Καλώς ήρθατε ξανά', sub: 'Συνεχίστε με τον λογαριασμό σας rhosocial.',
    email: 'Email', password: 'Κωδικός', remember: 'Να με θυμάσαι', forgot: 'Ξεχάσατε τον κωδικό;',
    login: 'Σύνδεση', or: 'Ή', github: 'Συνέχεια με GitHub', twitter: 'Συνέχεια με Twitter',
    no_account: 'Δεν έχετε λογαριασμό;', register: 'Εγγραφή'
  },
  stats: {
    label: 'Σε αριθμούς', title: 'Μερικοί <em>αριθμοί</em>.',
    s1: 'Διαθέσιμοι διάλεκτοι DB', s2: 'Κάλυψη σημειώσεων τύπων', s3: 'Ελάχιστη Python', s4: 'Εξωτερικές εξαρτήσεις ORM'
  },
  install: {
    label: 'Ξεκινήστε', title: 'Εγκατάσταση σε μία γραμμή, <em>δέκα λεπτά</em> για το πρώτο ερώτημα.',
    sub: 'Δημοσιεύτηκε στο PyPI. Το backend SQLite συνοδεύει το βασικό πακέτο· τα υπόλοιπα εγκαθίστανται κατά απαίτηση.',
    docs: 'Διαβάστε την τεκμηρίωση →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
