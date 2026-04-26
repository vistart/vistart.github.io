/**
 * i18n · uk-ua · Українська
 */
window.I18N = window.I18N || {};
window.I18N['uk-ua'] = {
  meta: { name: 'Українська' },
  control: { theme_label: 'Тема', font_label: 'Шрифт', lang_label: 'Мова', font_auto: 'Авто (типова для теми)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title: 'rhosocial ActiveRecord,<br><em>перероблений</em> для Python.',
    sub: '<strong>rhosocial-activerecord</strong> визначає моделі за допомогою нативних анотацій типів Python та опитує їх ланцюжком <code>query().where(...).all()</code>. Синхронно та асинхронно з першого дня. Без зовнішніх ORM-залежностей — SQLite вбудовано, інші бази даних — окремими пакетами, власний backend — за кілька десятків рядків.',
    cta_secondary: 'Переглянути можливості →'
  },
  features: {
    label: 'Чому · 6 обіцянок',
    title: 'Чому <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Тип = поле', title: '<em>Типобезпека</em> від самого початку', desc: '<code>name: str</code> — це збереження, валідація та підказки IDE в одному.' },
    f2: { num: '02 / Async першого класу', title: 'Sync &amp; async, <em>один API</em>', desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code> — однакова форма.' },
    f3: { num: '03 / Замінні backend\'и', title: 'Замінні <em>backend\'и</em>', desc: 'SQLite вбудовано; Postgres/MySQL/MSSQL/Oracle — окремими пакетами; або власний.' },
    f4: { num: '04 / Явні зв\'язки', title: '<em>Зв\'язки</em> оголошені явно', desc: 'has_many / belongs_to оголошуються на моделі; самі зв\'язки — це <code>QuerySet</code>.' },
    f5: { num: '05 / Атомарні транзакції', title: 'Транзакції, <em>правильно вкладені</em>', desc: 'Контекстний менеджер + savepoint; винятки викликають чистий rollback.' },
    f6: { num: '06 / Pythonic', title: 'Читається як <em>англійська</em>', desc: '<code>User.query().where(...).all()</code> — жодного DSL, просто Python.' }
  },
  practice: {
    label: 'На практиці · реальний код',
    title: 'Від 3.8 до 3.12, <em>крок за кроком</em>.',
    intro: 'Відповідає файлам <code>models_py38.py</code> … <code>models_py312.py</code> з репозиторію testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> замість <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> замість <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: тип <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> та генерики PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync: {
    label: 'Порівняння',
    title: 'Sync = async, <em>одна семантика</em>.',
    intro: 'Замініть <code>for</code> на <code>async for</code> — і готово. Виведення типів проходить через весь ланцюжок.',
    cta: 'Прочитати посібник async →'
  },
  split_backend: {
    label: 'Свобода backend\'у',
    title: 'Напишіть власний <em>backend</em> за один вечір.',
    intro: 'Успадкуйте <code>Backend</code>, реалізуйте кілька хуків діалекту. DuckDB та libSQL вже перевірені.',
    cta: 'Посібник розробника backend\'у →'
  },
  pricing: {
    label: 'Плани · приклад',
    title: 'Оберіть свій <em>план</em>.',
    intro: '(Прикладові картки — сам OSS-проєкт безкоштовний назавжди. Картки pricing показані для перевірки відображення на кожній темі.)',
    badge: 'Найпопулярніший',
    c1: {
      tier: 'Community', desc: 'Для індивідуальних розробників та OSS-контриб\'юторів. Повна функціональність, без обмежень.',
      f1: 'SQLite / PostgreSQL / MySQL', f2: 'Повне API sync &amp; async', f3: 'Підтримка на форумі спільноти',
      f4: 'Панель командної роботи', f5: 'Гарантія відповіді SLA', cta: 'Почати'
    },
    c2: {
      tier: 'Team', desc: 'Команди, що ростуть. Enterprise-бекенди та аудит.',
      f1: 'Усе з Community', f2: 'Backend\'и MSSQL / Oracle', f3: 'Аудит-журнал &amp; розділ читання/запису',
      f4: 'Приватний Discord з пріоритетом', f5: 'SSO / SAML', cta: 'Спробувати 14 днів'
    },
    c3: {
      tier: 'Enterprise', desc: 'Великі організації. On-prem, compliance, навчання.',
      price_label: 'Зв\'язатися з нами',
      f1: 'Усе з Team', f2: 'Кастомні backend\'и (DuckDB / libSQL / власні)', f3: 'SSO / SAML / LDAP',
      f4: 'SLA 4 години', f5: 'Навчання на місці та виділені рішення', cta: 'Зв\'язатися з відділом продажів'
    }
  },
  compare: {
    label: 'Порівняти', title: 'Порівняння <em>функцій</em> за планами.',
    col_feature: 'Функція',
    row1: 'SQLite / Postgres / MySQL', row2: 'Backend\'и MSSQL / Oracle', row3: 'Кастомні backend\'и',
    row4: 'Повне API sync / async', row5: 'Аудит-журнал', row6: 'Розділ читання/запису',
    row7: 'SSO / SAML / LDAP', row8: 'Відповідь SLA', row8c: '— спільнота', row8t: '24 години', row8e: '4 години',
    row9: 'Ціна за рік'
  },
  gallery: {
    label: 'Галерея компонентів · примітиви', title: 'Як кожна тема обробляє <em>примітиви UI</em>.',
    c_buttons: 'Кнопки', c_btngroup: 'Група кнопок', c_form: 'Елементи форми', c_radio: 'Група radio',
    c_multi: 'Список множинного вибору', c_dropdown: 'Випадаючий список', c_alerts: 'Сповіщення',
    c_badges: 'Бейджі', c_progress: 'Прогрес', c_grid: 'Демо сітки (12 колонок)',
    c_rtl: 'Перегляд RTL', c_table: 'Таблиця з смугами',
    form_email: 'Електронна пошта', form_note: 'Нотатки', form_preload: 'Попереднє завантаження', form_async: 'Async',
    radio_sync: 'Sync (синхронний режим)', radio_async: 'Async (асинхронний режим)', radio_both: 'Обидва (спільні моделі)',
    alert_info: '<b>Підказка.</b> Backend SQLite постачається з основним пакетом.',
    alert_success: '<b>Готово.</b> <code>User.configure(...)</code> викликано.',
    alert_warn: '<b>Увага.</b> віконні функції потребують SQLite ≥ 3.25.',
    prog_coverage: 'Покриття тестами', prog_backend: 'Готовність backend\'у', prog_locale: 'Локалізація документації',
    backend_note: 'Той самий компонент, що й верхня панель керування.',
    multi1_t: 'PostgreSQL', multi1_d: 'Основна продакшн', multi2_t: 'MySQL', multi2_d: 'Застарілі сервіси', multi3_t: 'SQLite', multi3_d: 'Тести &amp; прототипи'
  },
  album: {
    label: 'Галерея · бібліотека', title: 'Вчіться з <em>прикладів</em>.',
    a1: 'Ваша перша модель', a2: 'Async з FastAPI', a3: 'has_many детально',
    a4: 'Написання backend\'у', a5: 'Автовиявлення N+1', a6: 'Вкладені транзакції &amp; savepoint'
  },
  voices: {
    label: 'Голоси · відгуки', title: 'Що <em>кажуть</em>.',
    q1: 'З rhosocial-activerecord я нарешті перестав боротися з ORM. Анотації типів — це модель, саме так.',
    q1_role: 'Backend Engineer · Кіото',
    q2: 'Sync та async мають один API, рефактор майже безкоштовний. Міграція на FastAPI — два рядки.',
    q2_role: 'Staff Engineer · Берлін',
    q3: 'Я написав DuckDB backend. Прочитав Backend ABC за обідом, після обіду вже на продакшені. Це справжня розширюваність.',
    q3_role: 'Data Platform · Сінгапур',
    q4: 'Кожен крок ланцюжка має коректне виведення типів в IDE. Pydantic використаний там, де потрібно.',
    q4_role: 'Senior Python · Сан-Паулу',
    q5: 'Нуль runtime-залежностей — це ключ. В embedded більше не страждаємо від розміру SQLAlchemy.',
    q5_role: 'IoT-інженер · Шеньчжень'
  },
  auth: {
    label: 'Auth · демо входу', title: 'Увійти в <em>rhosocial</em>.',
    welcome: 'З поверненням', sub: 'Продовжіть з вашим акаунтом rhosocial.',
    email: 'Електронна пошта', password: 'Пароль', remember: 'Запам\'ятати мене', forgot: 'Забули пароль?',
    login: 'Увійти', or: 'АБО', github: 'Продовжити з GitHub', twitter: 'Продовжити з Twitter',
    no_account: 'Немає акаунта?', register: 'Зареєструватися'
  },
  stats: {
    label: 'У цифрах', title: 'Кілька <em>цифр</em>.',
    s1: 'Доступні діалекти БД', s2: 'Покриття анотаціями типів', s3: 'Мінімальний Python', s4: 'Зовнішні ORM-залежності'
  },
  install: {
    label: 'Почніть', title: 'Встановлення одним рядком, <em>десять хвилин</em> до першого запиту.',
    sub: 'Опубліковано на PyPI. Backend SQLite вбудовано; інші встановлюєте за потреби.',
    docs: 'Прочитати документацію →'
  },
  footer: {
    hotkeys: '25 themes × 26 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">key</span> theme / <span class="kbd">Shift</span>+<span class="kbd">key</span> font / <span class="kbd">Alt</span>+<span class="kbd">key</span> language'
  }
};