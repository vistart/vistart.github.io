/**
 * i18n · tr-tr · Türkçe
 */
window.I18N = window.I18N || {};
window.I18N['tr-tr'] = {
  meta: { name: 'Türkçe' },
  control: { theme_label: 'Tema', font_label: 'Yazı tipi', lang_label: 'Dil', font_auto: 'Otomatik (tema varsayılanı)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>Python için <em>yeniden tasarlandı</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> modelleri Python\'un yerel tip açıklamalarıyla tanımlar ve bunları <code>query().where(...).all()</code> zinciriyle sorgular. Senkron ve asenkron ilk günden itibaren. Harici ORM bağımlılığı yok — SQLite yerleşik gelir, diğer veritabanları ayrı paketlerdir ve kendi arka ucunuzu birkaç düzine satırla yazabilirsiniz.',
    cta_secondary: 'Özellikleri gör →'
  },
  features: {
    label: 'Neden · altı temel söz',
    title: 'Neden <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tip = alan',            title: 'Doğası gereği <em>tip güvenli</em>',             desc: 'Bir alan sadece <code>name: str</code> — depolama, doğrulama ve IDE tamamlama bir arada.' },
    f2: { num: '02 / Asenkron birinci sınıf', title: 'Sync &amp; async, <em>tek API</em>',             desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, aynı biçim.' },
    f3: { num: '03 / Değiştirilebilir arka uç', title: 'Takılabilir <em>arka uçlar</em>',              desc: 'SQLite yerleşik; Postgres/MySQL/MSSQL/Oracle ayrı paket; kendi arka ucunuzu da yazın.' },
    f4: { num: '04 / Açık ilişkiler',        title: '<em>İlişkiler</em> açıkça belirtilir',            desc: 'has_many / belongs_to modelde bildirilir; ilişkilerin kendisi <code>QuerySet</code>.' },
    f5: { num: '05 / Atomik işlemler',       title: 'İşlemler, <em>düzgün iç içe</em>',                desc: 'Bağlam yöneticisi + savepoint; istisna geri alımla temizlenir.' },
    f6: { num: '06 / Pythonic',             title: '<em>İngilizce</em> gibi okunur',                   desc: '<code>User.query().where(...).all()</code> — DSL yok, sadece Python.' }
  },
  practice: {
    label: 'Uygulamada · gerçek kod',
    title: '3.8\'den 3.12\'ye, <em>adım adım</em>.',
    intro: 'testsuite deposundaki <code>models_py38.py</code> … <code>models_py312.py</code> fikstürlerine karşılık gelir.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code>, <code>List[str]</code> yerine (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code>, <code>Optional[int]</code> yerine (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: <code>Self</code> tipi (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> ve PEP 695 generikleri <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Yan yana', title: 'Sync = async, <em>anlam aynı</em>.', intro: '<code>for</code>\'u <code>async for</code> ile değiştirin, gerisi aynı. Tip çıkarımı tüm zinciri dolaşır.', cta: 'Async kılavuzunu oku →' },
  split_backend: { label: 'Arka uç özgürlüğü', title: 'Kendi <em>arka ucunuzu</em> bir öğleden sonrada yazın.', intro: '<code>Backend</code>\'i türetin, birkaç lehçe kancası uygulayın. DuckDB ve libSQL zaten kanıtlandı.', cta: 'Arka uç geliştirici kılavuzu →' },
  pricing: {
    label: 'Planlar · örnek', title: '<em>Seviyenizi</em> seçin.',
    intro: '(Örnek kartlar — OSS projesi sonsuza dek ücretsizdir. Burada her temada pricing kartlarını görebilmek için gösteriliyor.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Bireysel geliştiriciler ve OSS katkıcıları. Tam özellikler, sınırsız.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'Tam sync &amp; async API', f3: 'Topluluk forumu desteği',
          f4: 'Takım işbirliği paneli', f5: 'SLA yanıt garantisi', cta: 'Başla' },
    c2: { tier: 'Team',       desc: 'Büyüyen takımlar. Kurumsal arka uçlar ve denetim.',
          f1: 'Community\'nin tamamı', f2: 'MSSQL / Oracle arka uçları', f3: 'Denetim günlüğü &amp; okuma/yazma ayrımı',
          f4: 'Özel Discord öncelikli destek', f5: 'SSO / SAML', cta: '14 günlük deneme' },
    c3: { tier: 'Enterprise', desc: 'Büyük kuruluşlar. On-prem, uyumluluk, eğitim.', price_label: 'Bize ulaşın',
          f1: 'Team\'in tamamı', f2: 'Özel arka uçlar (DuckDB / libSQL / dahili)', f3: 'SSO / SAML / LDAP',
          f4: '4 saat SLA', f5: 'Yerinde eğitim ve özel çözümler', cta: 'Satışa ulaşın' }
  },
  compare: {
    label: 'Karşılaştır', title: 'Diğer Python ORM\'leriyle karşılaştırma.', col_feature: 'Özellik',
    row1: 'Tasarım deseni', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend bağımsız kullanılabilir',
    row3: 'Session kavramı yok',
    row4: 'Tutarlı sync / async API',
    row5: 'Yerel Pydantic entegrasyonu',
    row6: 'Çalışma zamanı veri doğrulama',
    row7: 'Tam SQL ifade gücü',
    row8: 'Kapasite bildirimi',
    row9: 'SQL şeffaflığı <code>.to_sql()</code>',
    row10: 'Zorunlu geçiş aracı yok',
    row11: 'Minimum bağımlılık',
    row12: 'Açık ilişki tanımı'
  },
  gallery: {
    label: 'Bileşen Galerisi · ilkeller', title: 'Her tema <em>UI ilkellerini</em> nasıl ele alır.',
    c_buttons: 'Düğmeler', c_btngroup: 'Düğme grubu', c_form: 'Form kontrolleri',
    c_radio: 'Radyo grubu', c_multi: 'Çoklu seçim listesi', c_dropdown: 'Açılır liste',
    c_alerts: 'Uyarılar', c_badges: 'Rozetler', c_progress: 'İlerleme',
    c_grid: 'Izgara demosu (12 sütun)', c_rtl: 'RTL önizleme', c_table: 'Çizgili veri tablosu',
    form_email: 'E-posta adresi', form_note: 'Notlar',
    form_preload: 'Ön yükleme', form_async: 'Async',
    radio_sync: 'Sync (senkron mod)', radio_async: 'Async (asenkron mod)', radio_both: 'İkisi birden (çift yığın, paylaşımlı modeller)',
    alert_info:    '<b>İpucu.</b> SQLite arka ucu çekirdek pakette gelir.',
    alert_success: '<b>Hazır.</b> <code>User.configure(...)</code> çağrıldı.',
    alert_warn:    '<b>Dikkat.</b> Pencere fonksiyonları için SQLite ≥ 3.25 gerekir.',
    prog_coverage: 'Test kapsamı', prog_backend: 'Arka uç tamamlanma', prog_locale: 'Dokümantasyon yerelleştirme',
    backend_note:  'Üst kontrol çubuğuyla aynı bileşen.',
    multi1_t: 'PostgreSQL', multi1_d: 'Ana üretim',
    multi2_t: 'MySQL',      multi2_d: 'Eski servisler',
    multi3_t: 'SQLite',     multi3_d: 'Testler &amp; prototipler'
  },
  album: {
    label: 'Galeri · kütüphane', title: '<em>Örneklerden</em> öğren.',
    a1: 'İlk modeliniz', a2: 'FastAPI\'de async', a3: 'has_many derinlemesine',
    a4: 'Kendi arka ucunuzu yazın', a5: 'N+1 otomatik tespit', a6: 'İç içe işlemler &amp; savepoint\'ler'
  },
  voices: {
    label: 'Sesler · referanslar', title: 'Onların <em>dediği</em>.',
    q1: 'rhosocial-activerecord sayesinde sonunda ORM ile kavga etmiyorum. Tip açıklamaları modelin kendisi — tam yerinde.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync ve async tek API paylaşıyor, yeniden düzenleme neredeyse bedava. FastAPI projemi taşımak iki satır oldu.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Kendi DuckDB arka ucumu yazdım. Backend ABC\'yi öğle yemeğinde okudum, öğleden sonra yayındaydı. Gerçek genişletilebilirlik.',
    q3_role: 'Data Platform · Singapur',
    q4: 'Zincirin her adımı IDE\'de doğru tip çıkarımına sahip. Pydantic, doğru yerde kullanılmış.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Sıfır çalışma zamanı bağımlılığı anahtar. Gömülü dağıtımlarda SQLAlchemy boyutundan artık endişelenmiyoruz.',
    q5_role: 'IoT Mühendisi · Shenzhen'
  },
  auth: {
    label: 'Auth · giriş demosu', title: '<em>rhosocial</em>\'a giriş yap.',
    welcome: 'Tekrar hoş geldin', sub: 'rhosocial hesabınla devam et.',
    email: 'E-posta', password: 'Şifre', remember: 'Beni hatırla', forgot: 'Şifreni mi unuttun?',
    login: 'Giriş yap', or: 'VEYA', github: 'GitHub ile devam et', twitter: 'Twitter ile devam et',
    no_account: 'Hesabın yok mu?', register: 'Kaydol'
  },
  stats: {
    label: 'Sayılarla', title: 'Birkaç <em>sayı</em>.',
    s1: 'Kullanılabilir DB lehçeleri', s2: 'Tip açıklaması kapsamı', s3: 'Minimum Python', s4: 'Harici ORM bağımlılığı'
  },
  install: {
    label: 'Başlayın', title: 'Tek satırda kurulum, ilk sorguya <em>on dakika</em>.',
    sub: 'PyPI\'de yayımlandı. SQLite arka ucu çekirdek pakette gelir; diğerleri talep üzerine kurulur.',
    docs: 'Dokümantasyonu oku →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
