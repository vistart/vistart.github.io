/**
 * i18n · zh-cn · 简体中文  (source-of-truth)
 * ═══════════════════════════════════════════════════════════════════════
 * Structure: window.I18N['<code>'][<section>][<key>] = 'text (HTML allowed)'
 *
 * To add a new language:
 *   1. copy this file to assets/i18n/<code>.js
 *   2. change the key on line `window.I18N['zh-cn']` to your code
 *   3. translate each string in place — HTML (<em>, <code>, <br>, <strong>)
 *      must be preserved; don't translate tag names, code, or brand.
 *   4. add a <script src="assets/i18n/<code>.js"> to themes.html
 *   5. add a <button class="dropdown-item"> to the Language dropdown
 *   6. append '<code>' to the LANGS array in the bottom <script>
 */
window.I18N = window.I18N || {};
window.I18N['zh-cn'] = {
  meta: { name: '简体中文' },

  control: {
    theme_label: '主题',
    font_label:  '字体',
    lang_label:  '语言',
    font_auto:   '自动（跟随主题）'
  },

  brand: { subtitle: 'Theme Lab' },

  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>为 Python <em>重新设计</em>。',
    sub:     '<strong>rhosocial-activerecord</strong> 用 Python 原生类型注解定义模型，用链式 <code>query().where(...).all()</code> 表达查询，原生支持同步与异步。无外部 ORM 依赖，后端可插拔——SQLite 内置，其它数据库以独立包发布，你也可以几十行代码自己写一个。',
    cta_secondary: '查看特性 →'
  },

  features: {
    label: 'Why · 六个核心承诺',
    title: '为什么是 <em>rhosocial ActiveRecord</em>。',
    f1: { num: '01 / 类型即字段',  title: '<em>Type-safe</em> by construction',       desc: '字段就是 <code>name: str</code>，存储、校验、IDE 补全合而为一。' },
    f2: { num: '02 / 异步一等',    title: 'Sync &amp; async, <em>one API</em>',       desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>，语义一致。' },
    f3: { num: '03 / 后端可插拔',  title: 'Pluggable <em>backends</em>',              desc: 'SQLite 内置；Postgres/MySQL/MSSQL/Oracle 独立包；可自写后端。' },
    f4: { num: '04 / 关系显式',    title: '<em>Relations</em> made explicit',         desc: 'has_many / belongs_to 显式声明，关系即 <code>QuerySet</code>。' },
    f5: { num: '05 / 事务原子',    title: 'Transactions, <em>properly nested</em>',   desc: '上下文管理器 + savepoint，异常即回滚。' },
    f6: { num: '06 / Pythonic',   title: 'Reads like <em>English</em>',              desc: '<code>User.query().where(...).all()</code>——就是 Python。' }
  },

  practice: {
    label: 'In Practice · 实际代码',
    title: '从 3.8 到 3.12，<em>一路升级</em>。',
    intro: '对应 testsuite 仓库 <code>models_py38.py</code> … <code>models_py312.py</code>。',
    p1: '<b>3.8 → 3.9</b>：<code>list[str]</code>（PEP 585）。',
    p2: '<b>3.9 → 3.10</b>：<code>int | None</code>（PEP 604）。',
    p3: '<b>3.10 → 3.11</b>：<code>Self</code> 类型（PEP 673）。',
    p4: '<b>3.11 → 3.12</b>：<code>@override</code> 与 <code>class Result[T]:</code>。'
  },

  split_sync: {
    label: 'Side by side',
    title: '同步 = 异步，<em>语义一致</em>。',
    intro: '把 <code>for</code> 换成 <code>async for</code>，其他什么都不变。IDE 的类型推导一路到底。',
    cta:   '阅读 async 指南 →'
  },

  split_backend: {
    label: 'Backend freedom',
    title: '写你自己的<em>后端</em>，也就几十行。',
    intro: '继承 <code>Backend</code>，实现几个方言钩子即可。DuckDB、libSQL 已被社区证明可行。',
    cta:   '后端开发指南 →'
  },

  pricing: {
    label:  'Plans · 商业化示例',
    title:  '选择你的<em>档位</em>。',
    intro:  '（示例卡片——开源本身永远免费。用于演示 pricing 组件在不同主题下的表现。）',
    badge:  'Most Popular',
    c1: { tier: 'Community',  desc: '个人项目和开源贡献者。完整功能无限制。',
          f1: 'SQLite / PostgreSQL / MySQL', f2: '完整 async &amp; sync API', f3: '社区论坛支持',
          f4: '团队协作仪表盘', f5: 'SLA 响应保证', cta: 'Get Started' },
    c2: { tier: 'Team',       desc: '成长中的团队。含企业级后端 + 审计。',
          f1: '全部 Community 特性', f2: 'MSSQL / Oracle 后端', f3: '审计日志 &amp; 读写分离',
          f4: '私有 Discord 优先支持', f5: 'SSO / SAML', cta: 'Start 14-day trial' },
    c3: { tier: 'Enterprise', desc: '大型组织。私有化部署、合规与培训。', price_label: '联系我们',
          f1: '全部 Team 特性', f2: '自定义后端（DuckDB / libSQL / 自研）', f3: 'SSO / SAML / LDAP',
          f4: '4 小时 SLA 响应', f5: '上门培训与专属解决方案', cta: 'Contact Sales' }
  },

  compare: {
    label: 'Compare',
    title: '各档位<em>特性对比</em>。',
    col_feature:  '功能',
    row1: 'SQLite / Postgres / MySQL',
    row2: 'MSSQL / Oracle 后端',
    row3: '自定义后端',
    row4: '完整 async / sync API',
    row5: '审计日志',
    row6: '读写分离',
    row7: 'SSO / SAML / LDAP',
    row8: 'SLA 响应保证',  row8c: '— 社区', row8t: '24 小时', row8e: '4 小时',
    row9: '每年价格'
  },

  gallery: {
    label: 'Component Gallery · UI 基元',
    title: '每种主题下的<em>控件表现</em>。',
    c_buttons: 'Buttons', c_btngroup: 'Button group', c_form: 'Form controls',
    c_radio:   'Radio group', c_multi: 'Multi-select list', c_dropdown: 'Dropdown',
    c_alerts:  'Alerts', c_badges: 'Badges', c_progress: 'Progress',
    c_grid:    'Grid showcase (12 col)', c_rtl: 'RTL preview', c_table: 'Striped data table',
    form_email: '邮箱地址', form_note: '备注',
    form_preload: '预加载', form_async: '异步',
    radio_sync:  'Sync（同步模式）', radio_async: 'Async（异步模式）', radio_both: 'Both（双栈，共享模型）',
    alert_info:    '<b>提示。</b> SQLite 后端随核心包一起。',
    alert_success: '<b>已就绪。</b> <code>User.configure(...)</code> 完成。',
    alert_warn:    '<b>注意。</b> SQLite ≥ 3.25 才支持窗口函数。',
    prog_coverage: '测试覆盖率', prog_backend: '后端完成度', prog_locale: '文档本地化',
    backend_note:  '这个下拉与顶部控件栏使用同一组件。',
    multi1_t: 'PostgreSQL', multi1_d: '主生产',
    multi2_t: 'MySQL',      multi2_d: '旧服务',
    multi3_t: 'SQLite',     multi3_d: '测试与原型'
  },

  album: {
    label: 'Gallery · 相册',
    title: '从<em>案例</em>学起。',
    a1: '第一个 Model', a2: 'FastAPI 中的 async', a3: 'has_many 深入',
    a4: '写自己的后端', a5: 'N+1 自动检测',        a6: '嵌套事务与 savepoint'
  },

  voices: {
    label: 'Voices · 用户之声',
    title: '他们<em>这样说</em>。',
    q1: 'rhosocial-activerecord 终于让我不再和 ORM 搏斗了。类型注解就是模型定义，太对了。',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Async 和 sync 共用一套 API，重构时几乎零成本。我的 FastAPI 项目整个迁移只改了两行。',
    q2_role: 'Staff Engineer · Berlin',
    q3: '我自己接了 DuckDB 后端，看了 Backend ABC 不到一个下午就跑通了。这才是可扩展。',
    q3_role: 'Data Platform · Singapore',
    q4: 'IDE 里每一步链式调用都有正确的类型推导。Pydantic 的力量用在了刀刃上。',
    q4_role: 'Senior Python · São Paulo',
    q5: '零运行时依赖是关键。嵌入式部署场景里我们再也不用为 SQLAlchemy 的体积头疼了。',
    q5_role: 'IoT 工程师 · 深圳'
  },

  auth: {
    label:      'Auth · 登录演示',
    title:      '登录到 <em>rhosocial</em>。',
    welcome:    '欢迎回来',
    sub:        '使用你的 rhosocial 账号继续。',
    email:      '邮箱',
    password:   '密码',
    remember:   '记住我',
    forgot:     '忘记密码？',
    login:      '登录',
    or:         'OR',
    github:     'Continue with GitHub',
    twitter:    'Continue with Twitter',
    no_account: '还没有账号？',
    register:   '注册'
  },

  stats: {
    label: 'By the numbers',
    title: '一些<em>数字</em>。',
    s1: '可选数据库方言', s2: '类型注解覆盖', s3: '最低 Python 版本', s4: '外部 ORM 依赖'
  },

  install: {
    label: 'Get started',
    title: '一行安装，<em>十分钟</em>上手。',
    sub:   '已在 PyPI 发布。SQLite 后端随核心包一起。其他后端按需安装对应包即可。',
    docs:  '阅读文档 →'
  },

  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
