/**
 * i18n · ja-jp · 日本語
 */
window.I18N = window.I18N || {};
window.I18N['ja-jp'] = {
  meta: { name: '日本語' },
  control: { theme_label: 'テーマ', font_label: 'フォント', lang_label: '言語', font_auto: '自動（テーマ既定）' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord、<br>Python のために<em>再設計</em>。',
    sub:     '<strong>rhosocial-activerecord</strong> は Python の型アノテーションでモデルを定義し、<code>query().where(...).all()</code> のチェーンで問い合わせます。同期と非同期をネイティブに両立。外部 ORM 依存ゼロ、SQLite はコアに同梱、他データベースは独立パッケージ、自前バックエンドは数十行で書けます。',
    cta_secondary: '機能を見る →'
  },
  features: {
    label: 'Why · 6 つの約束',
    title: 'なぜ <em>rhosocial ActiveRecord</em> なのか。',
    f1: { num: '01 / 型 = フィールド',   title: '構築段階から<em>型安全</em>',                  desc: '<code>name: str</code> で保存・検証・IDE 補完を同時に表現。' },
    f2: { num: '02 / 非同期ファースト', title: '同期 &amp; 非同期、<em>同一 API</em>',          desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>、形が一致。' },
    f3: { num: '03 / 差し替え可能',     title: '差し替え可能な<em>バックエンド</em>',           desc: 'SQLite は同梱、Postgres/MySQL/MSSQL/Oracle は別パッケージ、独自も可。' },
    f4: { num: '04 / 明示的な関連',     title: '<em>リレーション</em>は明示的に',               desc: 'has_many / belongs_to をモデルに宣言、関連自体が <code>QuerySet</code>。' },
    f5: { num: '05 / 原子的トランザクション', title: 'トランザクションは<em>適切にネスト</em>', desc: 'コンテキストマネージャ＋セーブポイント、例外で自動ロールバック。' },
    f6: { num: '06 / Pythonic',      title: '<em>英語</em>のように読める',                    desc: '<code>User.query().where(...).all()</code> ── DSL なし、ただの Python。' }
  },
  practice: {
    label: 'In Practice · 実コード',
    title: '3.8 から 3.12 へ、<em>段階的に進化</em>。',
    intro: 'testsuite リポジトリ <code>models_py38.py</code> … <code>models_py312.py</code> に対応。',
    p1: '<b>3.8 → 3.9</b>：<code>list[str]</code>（PEP 585）。',
    p2: '<b>3.9 → 3.10</b>：<code>int | None</code>（PEP 604）。',
    p3: '<b>3.10 → 3.11</b>：<code>Self</code> 型（PEP 673）。',
    p4: '<b>3.11 → 3.12</b>：<code>@override</code> と <code>class Result[T]:</code>。'
  },
  split_sync:    { label: 'Side by side', title: '同期 = 非同期、<em>意味論は同一</em>。', intro: '<code>for</code> を <code>async for</code> に替えるだけ。型推論は最後まで途切れません。', cta: 'async ガイドを読む →' },
  split_backend: { label: 'Backend freedom', title: '自前の<em>バックエンド</em>も数十行。', intro: '<code>Backend</code> を継承し、方言フックを実装すれば動きます。DuckDB や libSQL はすでに実証済み。', cta: 'バックエンド開発ガイド →' },
  pricing: {
    label: 'Plans · 料金例', title: '<em>プラン</em>を選ぶ。',
    intro: '（サンプルカード—OSS 本体は永年無料。pricing コンポーネントの表示確認用です。）',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: '個人開発者と OSS コントリビューター向け。機能制限なし。',
          f1: 'SQLite / PostgreSQL / MySQL', f2: '同期 &amp; 非同期 API 完全版', f3: 'コミュニティフォーラム',
          f4: 'チームダッシュボード', f5: 'SLA 応答保証', cta: 'はじめる' },
    c2: { tier: 'Team',       desc: '成長中のチーム。エンタープライズ向けバックエンドと監査付き。',
          f1: 'Community のすべて', f2: 'MSSQL / Oracle バックエンド', f3: '監査ログ &amp; 読み書き分離',
          f4: '専用 Discord 優先サポート', f5: 'SSO / SAML', cta: '14 日間トライアル' },
    c3: { tier: 'Enterprise', desc: '大規模組織向け。オンプレ・コンプライアンス・研修。', price_label: 'お問い合わせ',
          f1: 'Team のすべて', f2: 'カスタム（DuckDB / libSQL / 内製）', f3: 'SSO / SAML / LDAP',
          f4: '4 時間 SLA', f5: '訪問研修と専任ソリューション', cta: '営業へ連絡' }
  },
  compare: {
    label: 'Compare', title: '他の Python ORM と<em>比較</em>。', col_feature: '機能',
    row1: '設計パターン', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'バックエンド単体利用可',
    row3: 'Session 概念なし',
    row4: '同期 / 非同期 API の一貫性',
    row5: 'ネイティブ Pydantic 統合',
    row6: '実行時データ検証',
    row7: '完全な SQL 表現力',
    row8: 'Capability 宣言機構',
    row9: 'SQL 透過性 <code>.to_sql()</code>',
    row10: '移行ツール強制なし',
    row11: '最小依存',
    row12: '明示的なリレーション定義'
  },
  gallery: {
    label: 'Component Gallery · UI 部品', title: '各テーマ下の<em>コントロール表現</em>。',
    c_buttons: 'Buttons', c_btngroup: 'Button group', c_form: 'Form controls',
    c_radio: 'Radio group', c_multi: 'Multi-select list', c_dropdown: 'Dropdown',
    c_alerts: 'Alerts', c_badges: 'Badges', c_progress: 'Progress',
    c_grid: 'Grid showcase (12 col)', c_rtl: 'RTL preview', c_table: 'Striped data table',
    form_email: 'メールアドレス', form_note: 'メモ',
    form_preload: 'プリロード', form_async: '非同期',
    radio_sync: 'Sync（同期モード）', radio_async: 'Async（非同期モード）', radio_both: 'Both（両対応・モデル共有）',
    alert_info:    '<b>ヒント。</b> SQLite バックエンドはコアに同梱されています。',
    alert_success: '<b>準備完了。</b> <code>User.configure(...)</code> 実行済み。',
    alert_warn:    '<b>注意。</b> ウィンドウ関数には SQLite ≥ 3.25 が必要です。',
    prog_coverage: 'テストカバレッジ', prog_backend: 'バックエンド完成度', prog_locale: 'ドキュメント国際化',
    backend_note:  '上部コントロールバーと同じコンポーネントです。',
    multi1_t: 'PostgreSQL', multi1_d: '本番メイン',
    multi2_t: 'MySQL',      multi2_d: '既存サービス',
    multi3_t: 'SQLite',     multi3_d: 'テスト &amp; プロトタイプ'
  },
  album: {
    label: 'Gallery · ライブラリ', title: '<em>実例</em>から学ぶ。',
    a1: '最初のモデル', a2: 'FastAPI での async', a3: 'has_many を深掘り',
    a4: 'バックエンドを書く', a5: 'N+1 自動検出', a6: 'ネストしたトランザクション &amp; savepoint'
  },
  voices: {
    label: 'Voices · ユーザーの声', title: '彼らの<em>声</em>。',
    q1: 'rhosocial-activerecord でようやく ORM と戦わずに済みました。型アノテーションがモデル、正解です。',
    q1_role: 'Backend Engineer · 京都',
    q2: '同期と非同期が同じ API なので、リファクタはほぼゼロコスト。FastAPI 移行は 2 行でした。',
    q2_role: 'Staff Engineer · ベルリン',
    q3: '自前で DuckDB バックエンドを書きました。Backend ABC を読んでから午後には動作。これが拡張性。',
    q3_role: 'Data Platform · シンガポール',
    q4: 'IDE でチェーンの各段階が正しく推論されます。Pydantic の力が正しい場所に使われています。',
    q4_role: 'Senior Python · サンパウロ',
    q5: 'ランタイム依存ゼロが鍵。組込用途で SQLAlchemy のサイズに悩まなくなりました。',
    q5_role: 'IoT エンジニア · 深圳'
  },
  auth: {
    label: 'Auth · サインインデモ', title: '<em>rhosocial</em> にサインイン。',
    welcome: 'おかえりなさい', sub: 'rhosocial アカウントで続行します。',
    email: 'メール', password: 'パスワード', remember: '記憶する', forgot: 'パスワードを忘れた？',
    login: 'サインイン', or: 'OR', github: 'GitHub で続行', twitter: 'Twitter で続行',
    no_account: 'アカウントがない？', register: '新規登録'
  },
  stats: {
    label: 'By the numbers', title: 'いくつかの<em>数字</em>。',
    s1: '利用可能なデータベース方言', s2: '型アノテーション率', s3: '最低 Python バージョン', s4: '外部 ORM 依存数'
  },
  install: {
    label: 'Get started', title: '1 行でインストール、<em>10 分</em>で始動。',
    sub: 'PyPI で公開中。SQLite バックエンドはコアに同梱、他はオンデマンドで。',
    docs: 'ドキュメントを読む →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
