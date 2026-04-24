/**
 * i18n · ru-ru · Русский
 */
window.I18N = window.I18N || {};
window.I18N['ru-ru'] = {
  meta: { name: 'Русский' },
  control: { theme_label: 'Тема', font_label: 'Шрифт', lang_label: 'Язык', font_auto: 'Авто (по теме)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br><em>переосмыслен</em> для Python.',
    sub:     '<strong>rhosocial-activerecord</strong> описывает модели через нативные аннотации типов Python и запрашивает их цепочкой <code>query().where(...).all()</code>. Синхронный и асинхронный режимы из коробки. Никаких внешних ORM-зависимостей — SQLite встроен, прочие СУБД идут отдельными пакетами, а свой бэкенд пишется в несколько десятков строк.',
    cta_secondary: 'Посмотреть возможности →'
  },
  features: {
    label: 'Почему · шесть ключевых обещаний',
    title: 'Почему <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Тип = поле',        title: '<em>Типобезопасно</em> по построению',           desc: 'Поле — это просто <code>name: str</code>: хранение, валидация и IDE-подсказки в одном.' },
    f2: { num: '02 / Async первого класса', title: 'Sync и async — <em>одно API</em>',              desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, форма одинаковая.' },
    f3: { num: '03 / Сменные бэкенды',   title: 'Подключаемые <em>бэкенды</em>',                   desc: 'SQLite встроен; Postgres/MySQL/MSSQL/Oracle — отдельные пакеты; или свой.' },
    f4: { num: '04 / Явные связи',       title: '<em>Связи</em> делаются явными',                  desc: 'has_many / belongs_to объявляются на модели; связи сами являются <code>QuerySet</code>.' },
    f5: { num: '05 / Атомарные транзакции', title: 'Транзакции, <em>корректно вложенные</em>',      desc: 'Контекстные менеджеры и savepoint-ы; исключения откатываются чисто.' },
    f6: { num: '06 / Pythonic',         title: 'Читается как <em>английский</em>',                 desc: '<code>User.query().where(...).all()</code> — никакого DSL, просто Python.' }
  },
  practice: {
    label: 'На практике · реальный код',
    title: 'От 3.8 до 3.12, <em>шаг за шагом</em>.',
    intro: 'Соответствует фикстурам <code>models_py38.py</code> … <code>models_py312.py</code> в репозитории testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> вместо <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> вместо <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: тип <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> и дженерики PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Рядом', title: 'Sync = async, <em>семантика одна</em>.', intro: 'Замените <code>for</code> на <code>async for</code> — и всё. Вывод типов проходит всю цепочку.', cta: 'Читать async-гайд →' },
  split_backend: { label: 'Свобода бэкенда', title: 'Свой <em>бэкенд</em> — дело одного вечера.', intro: 'Унаследуйтесь от <code>Backend</code>, реализуйте несколько диалектных хуков. DuckDB и libSQL уже проверены сообществом.', cta: 'Гайд для разработчика бэкенда →' },
  pricing: {
    label: 'Тарифы · иллюстративные', title: 'Выберите <em>тариф</em>.',
    intro: '(Пример карточек — OSS-проект бесплатен навсегда. Показано, чтобы проверить pricing-компонент во всех темах.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Одиночные разработчики и OSS-контрибьюторы. Полный функционал без ограничений.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Полный sync и async API', f3: 'Поддержка на форуме сообщества',
          f4: 'Дашборд командной работы', f5: 'Гарантия SLA', cta: 'Начать' },
    c2: { tier: 'Team',       desc: 'Растущие команды. Корпоративные бэкенды и аудит.',
          f1: 'Всё из Community', f2: 'Бэкенды MSSQL / Oracle', f3: 'Журнал аудита и разделение чтения/записи',
          f4: 'Приоритет в приватном Discord', f5: 'SSO / SAML', cta: 'Пробный период 14 дней' },
    c3: { tier: 'Enterprise', desc: 'Крупные организации. On-prem, комплаенс, обучение.', price_label: 'Связаться с нами',
          f1: 'Всё из Team', f2: 'Свои бэкенды (DuckDB / libSQL / внутренние)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 часа', f5: 'Обучение на месте и индивидуальные решения', cta: 'Связаться с продажами' }
  },
  compare: {
    label: 'Сравнение', title: 'Сравнение <em>возможностей</em>.', col_feature: 'Функция',
    row1: 'SQLite / Postgres / MySQL', row2: 'Бэкенды MSSQL / Oracle', row3: 'Свои бэкенды',
    row4: 'Полный sync / async API', row5: 'Журнал аудита', row6: 'Разделение чтения/записи', row7: 'SSO / SAML / LDAP',
    row8: 'Реакция по SLA', row8c: '— сообщество', row8t: '24 часа', row8e: '4 часа', row9: 'Годовая цена'
  },
  gallery: {
    label: 'Галерея компонентов · примитивы', title: 'Как каждая тема отображает <em>UI-примитивы</em>.',
    c_buttons: 'Buttons', c_btngroup: 'Button group', c_form: 'Form controls',
    c_radio: 'Radio group', c_multi: 'Multi-select list', c_dropdown: 'Dropdown',
    c_alerts: 'Alerts', c_badges: 'Badges', c_progress: 'Progress',
    c_grid: 'Grid showcase (12 col)', c_rtl: 'RTL preview', c_table: 'Striped data table',
    form_email: 'Адрес электронной почты', form_note: 'Заметки',
    form_preload: 'Предзагрузка', form_async: 'Async',
    radio_sync: 'Sync (синхронный режим)', radio_async: 'Async (асинхронный режим)', radio_both: 'Оба (двойной стек, общие модели)',
    alert_info:    '<b>Подсказка.</b> Бэкенд SQLite входит в основной пакет.',
    alert_success: '<b>Готово.</b> <code>User.configure(...)</code> вызван.',
    alert_warn:    '<b>Внимание.</b> Для оконных функций требуется SQLite ≥ 3.25.',
    prog_coverage: 'Покрытие тестами', prog_backend: 'Готовность бэкенда', prog_locale: 'Локализация документации',
    backend_note:  'Тот же компонент, что и в верхней панели управления.',
    multi1_t: 'PostgreSQL', multi1_d: 'Основной прод',
    multi2_t: 'MySQL',      multi2_d: 'Легаси-сервисы',
    multi3_t: 'SQLite',     multi3_d: 'Тесты и прототипы'
  },
  album: {
    label: 'Галерея · библиотека', title: 'Учиться на <em>примерах</em>.',
    a1: 'Первая модель', a2: 'Async в FastAPI', a3: 'has_many подробно',
    a4: 'Свой бэкенд', a5: 'Автодетекция N+1', a6: 'Вложенные транзакции и savepoint'
  },
  voices: {
    label: 'Голоса · отзывы', title: 'Что <em>говорят</em>.',
    q1: 'С rhosocial-activerecord я наконец перестал воевать с ORM. Аннотации типов и есть модель — абсолютно верно.',
    q1_role: 'Backend Engineer · Киото',
    q2: 'Sync и async — одно API, рефакторинг почти бесплатный. Миграция моего FastAPI заняла две строчки.',
    q2_role: 'Staff Engineer · Берлин',
    q3: 'Написал бэкенд для DuckDB. Прочитал Backend ABC за обедом, к вечеру уже работал. Вот это расширяемость.',
    q3_role: 'Data Platform · Сингапур',
    q4: 'Каждый шаг цепочки в IDE выводится правильно по типам. Pydantic — на своём месте.',
    q4_role: 'Senior Python · Сан-Паулу',
    q5: 'Ноль runtime-зависимостей — ключевая вещь. В embedded-деплоях о размере SQLAlchemy больше не переживаем.',
    q5_role: 'IoT-инженер · Шэньчжэнь'
  },
  auth: {
    label: 'Auth · демо входа', title: 'Войти в <em>rhosocial</em>.',
    welcome: 'С возвращением', sub: 'Продолжите со своей учётной записью rhosocial.',
    email: 'Эл. почта', password: 'Пароль', remember: 'Запомнить меня', forgot: 'Забыли пароль?',
    login: 'Войти', or: 'ИЛИ', github: 'Продолжить через GitHub', twitter: 'Продолжить через Twitter',
    no_account: 'Нет учётной записи?', register: 'Зарегистрироваться'
  },
  stats: {
    label: 'В цифрах', title: 'Несколько <em>цифр</em>.',
    s1: 'Доступные диалекты БД', s2: 'Покрытие аннотациями типов', s3: 'Минимальный Python', s4: 'Внешние ORM-зависимости'
  },
  install: {
    label: 'Начать', title: 'Установка одной строкой, <em>десять минут</em> до первого запроса.',
    sub: 'Опубликован в PyPI. Бэкенд SQLite идёт в основном пакете; другие — по необходимости.',
    docs: 'Читать документацию →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
