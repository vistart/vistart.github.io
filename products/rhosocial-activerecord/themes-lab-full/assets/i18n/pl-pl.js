/**
 * i18n · pl-pl · Polski
 */
window.I18N = window.I18N || {};
window.I18N['pl-pl'] = {
  meta: { name: 'Polski' },
  control: { theme_label: 'Motyw', font_label: 'Czcionka', lang_label: 'Język', font_auto: 'Automatyczna (domyślna dla motywu)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br><em>zaprojektowany od nowa</em> dla Pythona.',
    sub:     '<strong>rhosocial-activerecord</strong> definiuje modele za pomocą natywnych adnotacji typów Pythona i odpytuje je łańcuchem <code>query().where(...).all()</code>. Synchronicznie i asynchronicznie od pierwszego dnia. Bez zewnętrznych zależności ORM — SQLite jest wbudowany, inne bazy danych to osobne pakiety, a własny backend napiszesz w kilkudziesięciu liniach.',
    cta_secondary: 'Zobacz funkcje →'
  },
  features: {
    label: 'Dlaczego · sześć kluczowych obietnic',
    title: 'Dlaczego <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Typ = pole',               title: '<em>Bezpieczny typowo</em> z konstrukcji',           desc: 'Pole to po prostu <code>name: str</code> — przechowywanie, walidacja i podpowiedzi IDE w jednym.' },
    f2: { num: '02 / Async pierwszej klasy',    title: 'Sync &amp; async, <em>jedno API</em>',               desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, identyczna forma.' },
    f3: { num: '03 / Wymienne backendy',        title: 'Wymienne <em>backendy</em>',                          desc: 'SQLite wbudowany; Postgres/MySQL/MSSQL/Oracle jako osobne pakiety; lub własny.' },
    f4: { num: '04 / Jawne relacje',            title: '<em>Relacje</em> zadeklarowane jawnie',               desc: 'has_many / belongs_to deklarowane na modelu; relacje same są <code>QuerySet</code>.' },
    f5: { num: '05 / Atomowe transakcje',       title: 'Transakcje, <em>poprawnie zagnieżdżane</em>',         desc: 'Menedżer kontekstu + savepointy; wyjątki powodują czysty rollback.' },
    f6: { num: '06 / Pythonowe',                title: 'Czyta się jak <em>angielski</em>',                    desc: '<code>User.query().where(...).all()</code> — żadnego DSL, po prostu Python.' }
  },
  practice: {
    label: 'W praktyce · prawdziwy kod',
    title: 'Od 3.8 do 3.12, <em>krok po kroku</em>.',
    intro: 'Odpowiada fixture\'om <code>models_py38.py</code> … <code>models_py312.py</code> z repozytorium testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> zamiast <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> zamiast <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: typ <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> i generyki PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Obok siebie', title: 'Sync = async, <em>ta sama forma</em>.', intro: 'Zamień <code>for</code> na <code>async for</code> i gotowe. Wnioskowanie typów przechodzi przez cały łańcuch.', cta: 'Przeczytaj przewodnik async →' },
  split_backend: { label: 'Wolność backendu', title: 'Napisz własny <em>backend</em> w jedno popołudnie.', intro: 'Odziedzicz po <code>Backend</code>, zaimplementuj kilka haków dialektu. DuckDB i libSQL są już sprawdzone.', cta: 'Przewodnik dewelopera backendu →' },
  pricing: {
    label: 'Plany · poglądowe', title: 'Wybierz swój <em>poziom</em>.',
    intro: '(Przykładowe karty — sam projekt OSS jest darmowy na zawsze. Pokazano, aby zobaczyć karty pricing na każdym motywie.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Pojedynczy twórcy i kontrybutorzy OSS. Pełna funkcjonalność, bez limitów.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Pełne API sync &amp; async', f3: 'Wsparcie na forum społeczności',
          f4: 'Panel współpracy zespołowej', f5: 'Gwarancja odpowiedzi SLA', cta: 'Zacznij' },
    c2: { tier: 'Team',       desc: 'Rosnące zespoły. Backendy enterprise i audyt.',
          f1: 'Wszystko z Community', f2: 'Backendy MSSQL / Oracle', f3: 'Dziennik audytu &amp; podział odczyt/zapis',
          f4: 'Prywatny Discord z priorytetem', f5: 'SSO / SAML', cta: 'Wypróbuj 14 dni' },
    c3: { tier: 'Enterprise', desc: 'Duże organizacje. On-prem, zgodność, szkolenia.', price_label: 'Skontaktuj się',
          f1: 'Wszystko z Team', f2: 'Niestandardowe backendy (DuckDB / libSQL / wewnętrzne)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4-godzinne', f5: 'Szkolenia na miejscu i dedykowane rozwiązania', cta: 'Skontaktuj się ze sprzedażą' }
  },
  compare: {
    label: 'Porównaj', title: 'W porównaniu z innymi ORM-ami Pythona.', col_feature: 'Cecha',
    row1: 'Wzorzec projektowy', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend do samodzielnego użytku',
    row3: 'Brak koncepcji sesji',
    row4: 'Spójne API sync / async',
    row5: 'Natywna integracja z Pydantic',
    row6: 'Walidacja danych w czasie wykonania',
    row7: 'Pełna ekspresywność SQL',
    row8: 'Deklaracja możliwości',
    row9: 'Przejrzystość SQL <code>.to_sql()</code>',
    row10: 'Brak narzuconego narzędzia migracji',
    row11: 'Minimalne zależności',
    row12: 'Jawna definicja relacji'
  },
  gallery: {
    label: 'Galeria komponentów · prymitywy', title: 'Jak każdy motyw traktuje <em>prymitywy UI</em>.',
    c_buttons: 'Przyciski', c_btngroup: 'Grupa przycisków', c_form: 'Kontrolki formularza',
    c_radio: 'Grupa radio', c_multi: 'Lista wielokrotnego wyboru', c_dropdown: 'Lista rozwijana',
    c_alerts: 'Powiadomienia', c_badges: 'Odznaki', c_progress: 'Postęp',
    c_grid: 'Demo siatki (12 kol.)', c_rtl: 'Podgląd RTL', c_table: 'Tabela w paski',
    form_email: 'Adres e-mail', form_note: 'Notatki',
    form_preload: 'Wstępne ładowanie', form_async: 'Async',
    radio_sync: 'Sync (tryb synchroniczny)', radio_async: 'Async (tryb asynchroniczny)', radio_both: 'Oba (podwójny stos, współdzielone modele)',
    alert_info:    '<b>Wskazówka.</b> Backend SQLite jest dostarczany wraz z pakietem podstawowym.',
    alert_success: '<b>Gotowe.</b> Wywołano <code>User.configure(...)</code>.',
    alert_warn:    '<b>Uwaga.</b> Funkcje okna wymagają SQLite ≥ 3.25.',
    prog_coverage: 'Pokrycie testami', prog_backend: 'Ukończenie backendu', prog_locale: 'Lokalizacja dokumentacji',
    backend_note:  'Ten sam komponent co górny pasek sterowania.',
    multi1_t: 'PostgreSQL', multi1_d: 'Główna produkcja',
    multi2_t: 'MySQL',      multi2_d: 'Usługi starsze',
    multi3_t: 'SQLite',     multi3_d: 'Testy &amp; prototypy'
  },
  album: {
    label: 'Galeria · biblioteka', title: 'Ucz się z <em>przykładów</em>.',
    a1: 'Twój pierwszy model', a2: 'Async w FastAPI', a3: 'has_many dogłębnie',
    a4: 'Pisanie backendu', a5: 'Automatyczne wykrywanie N+1', a6: 'Zagnieżdżone transakcje &amp; savepointy'
  },
  voices: {
    label: 'Głosy · opinie', title: 'Co <em>mówią</em>.',
    q1: 'Dzięki rhosocial-activerecord w końcu przestałem walczyć z ORM-em. Adnotacje typów to model — dokładnie tak.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync i async dzielą jedno API, refaktor jest prawie darmowy. Migracja mojego FastAPI to dwie linijki.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Napisałem backend DuckDB. Przeczytałem Backend ABC przy obiedzie, po południu było na produkcji. To jest prawdziwa rozszerzalność.',
    q3_role: 'Data Platform · Singapur',
    q4: 'Każdy krok łańcucha ma poprawnie wnioskowany typ w IDE. Pydantic, użyty tam, gdzie trzeba.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Zero zależności w runtime to klucz. W embeddedzie nie martwimy się już rozmiarem SQLAlchemy.',
    q5_role: 'Inżynier IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo logowania', title: 'Zaloguj się do <em>rhosocial</em>.',
    welcome: 'Witamy ponownie', sub: 'Kontynuuj ze swoim kontem rhosocial.',
    email: 'E-mail', password: 'Hasło', remember: 'Zapamiętaj mnie', forgot: 'Nie pamiętasz hasła?',
    login: 'Zaloguj się', or: 'LUB', github: 'Kontynuuj z GitHub', twitter: 'Kontynuuj z Twitter',
    no_account: 'Nie masz jeszcze konta?', register: 'Zarejestruj się'
  },
  stats: {
    label: 'W liczbach', title: 'Kilka <em>liczb</em>.',
    s1: 'Dostępne dialekty DB', s2: 'Pokrycie adnotacjami typów', s3: 'Minimalny Python', s4: 'Zewnętrzne zależności ORM'
  },
  install: {
    label: 'Zacznij', title: 'Instalacja w jednej linii, <em>dziesięć minut</em> do pierwszego zapytania.',
    sub: 'Opublikowane w PyPI. Backend SQLite jest dostarczany z pakietem podstawowym; pozostałe instalujesz według potrzeb.',
    docs: 'Przeczytaj dokumentację →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
