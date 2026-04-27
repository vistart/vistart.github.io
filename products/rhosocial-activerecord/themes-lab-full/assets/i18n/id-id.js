/**
 * i18n · id · Bahasa Indonesia
 */
window.I18N = window.I18N || {};
window.I18N['id-id'] = {
  meta: { name: 'Bahasa Indonesia' },
  control: { theme_label: 'Tema', font_label: 'Font', lang_label: 'Bahasa', font_auto: 'Otomatis (bawaan tema)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>dirancang ulang untuk <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> mendefinisikan model dengan anotasi tipe native Python dan memanggil query berantai <code>query().where(...).all()</code>. Sync dan async sejak hari pertama. Tanpa dependensi ORM eksternal — SQLite terpasang, database lain paket terpisah, dan Anda bisa menulis backend sendiri dalam beberapa puluh baris.',
    cta_secondary: 'Lihat fitur →'
  },
  features: {
    label: 'Mengapa · enam janji inti',
    title: 'Mengapa <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tipe = field',          title: '<em>Aman tipe</em> secara konstruksi',           desc: 'Sebuah field cukup <code>name: str</code> — penyimpanan, validasi, dan autocomplete IDE jadi satu.' },
    f2: { num: '02 / Async kelas satu',      title: 'Sync &amp; async, <em>satu API</em>',             desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, bentuk identik.' },
    f3: { num: '03 / Backend bisa diganti',  title: 'Backend <em>yang bisa dipasang</em>',             desc: 'SQLite bawaan; Postgres/MySQL/MSSQL/Oracle sebagai paket terpisah; atau tulis sendiri.' },
    f4: { num: '04 / Relasi eksplisit',      title: '<em>Relasi</em> dibuat eksplisit',                desc: 'has_many / belongs_to dideklarasikan pada model; relasi itu sendiri adalah <code>QuerySet</code>.' },
    f5: { num: '05 / Transaksi atomik',      title: 'Transaksi, <em>bersarang dengan benar</em>',      desc: 'Context manager plus savepoints; exception memicu rollback bersih.' },
    f6: { num: '06 / Pythonic',              title: 'Dibaca seperti <em>bahasa Inggris</em>',          desc: '<code>User.query().where(...).all()</code> — tanpa DSL, cukup Python.' }
  },
  practice: {
    label: 'Dalam praktik · kode nyata',
    title: 'Dari 3.8 ke 3.12, <em>selangkah demi selangkah</em>.',
    intro: 'Mencerminkan fixture <code>models_py38.py</code> … <code>models_py312.py</code> di repo testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> menggantikan <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> menggantikan <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: tipe <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> dan generik PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Berdampingan', title: 'Sync = async, <em>semantik sama</em>.', intro: 'Tukar <code>for</code> dengan <code>async for</code>, sudah. Inferensi tipe mengalir di seluruh rantai.', cta: 'Baca panduan async →' },
  split_backend: { label: 'Kebebasan backend', title: 'Tulis <em>backend</em> Anda sendiri dalam satu sore.', intro: 'Subclass <code>Backend</code>, implementasikan beberapa hook dialek. DuckDB dan libSQL sudah terbukti.', cta: 'Panduan pengembang backend →' },
  pricing: {
    label: 'Paket · ilustratif', title: 'Pilih <em>tingkat</em> Anda.',
    intro: '(Kartu contoh — proyek OSS sendiri gratis selamanya. Ditampilkan agar kartu pricing dapat dilihat pada setiap tema.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Pengembang solo dan kontributor OSS. Fitur lengkap, tanpa batasan.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async lengkap', f3: 'Dukungan forum komunitas',
          f4: 'Dasbor kolaborasi tim', f5: 'Garansi respons SLA', cta: 'Mulai' },
    c2: { tier: 'Team',       desc: 'Tim yang berkembang. Backend enterprise plus audit.',
          f1: 'Semua di Community', f2: 'Backend MSSQL / Oracle', f3: 'Log audit &amp; pemisahan baca/tulis',
          f4: 'Discord privat prioritas', f5: 'SSO / SAML', cta: 'Coba 14 hari' },
    c3: { tier: 'Enterprise', desc: 'Organisasi besar. On-prem, kepatuhan, pelatihan.', price_label: 'Hubungi kami',
          f1: 'Semua di Team', f2: 'Backend kustom (DuckDB / libSQL / internal)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 jam', f5: 'Pelatihan di tempat dan solusi khusus', cta: 'Hubungi sales' }
  },
  compare: {
    label: 'Bandingkan', title: 'Dibandingkan dengan ORM Python lainnya.', col_feature: 'Fitur',
    row1: 'Pola desain', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend dapat digunakan sendiri',
    row3: 'Tanpa konsep session',
    row4: 'API sync / async yang konsisten',
    row5: 'Integrasi Pydantic native',
    row6: 'Validasi data saat runtime',
    row7: 'Ekspresivitas SQL penuh',
    row8: 'Deklarasi kapabilitas',
    row9: 'Transparansi SQL <code>.to_sql()</code>',
    row10: 'Tanpa alat migrasi wajib',
    row11: 'Dependensi minimal',
    row12: 'Definisi relasi eksplisit'
  },
  gallery: {
    label: 'Galeri Komponen · primitif', title: 'Bagaimana setiap tema memperlakukan <em>primitif UI</em>.',
    c_buttons: 'Tombol', c_btngroup: 'Grup tombol', c_form: 'Kontrol formulir',
    c_radio: 'Grup radio', c_multi: 'Daftar pilihan ganda', c_dropdown: 'Dropdown',
    c_alerts: 'Peringatan', c_badges: 'Badge', c_progress: 'Progres',
    c_grid: 'Demo grid (12 kolom)', c_rtl: 'Pratinjau RTL', c_table: 'Tabel berjalur',
    form_email: 'Alamat email', form_note: 'Catatan',
    form_preload: 'Pra-muat', form_async: 'Async',
    radio_sync: 'Sync (mode sinkron)', radio_async: 'Async (mode asinkron)', radio_both: 'Keduanya (dual stack, model berbagi)',
    alert_info:    '<b>Catatan.</b> Backend SQLite disertakan dalam paket inti.',
    alert_success: '<b>Siap.</b> <code>User.configure(...)</code> telah dipanggil.',
    alert_warn:    '<b>Perhatian.</b> Fungsi window membutuhkan SQLite ≥ 3.25.',
    prog_coverage: 'Cakupan tes', prog_backend: 'Kemajuan backend', prog_locale: 'Pelokalan dokumentasi',
    backend_note:  'Komponen yang sama dengan bilah kontrol atas.',
    multi1_t: 'PostgreSQL', multi1_d: 'Produksi utama',
    multi2_t: 'MySQL',      multi2_d: 'Layanan legacy',
    multi3_t: 'SQLite',     multi3_d: 'Tes &amp; prototipe'
  },
  album: {
    label: 'Galeri · perpustakaan', title: 'Belajar dari <em>contoh</em>.',
    a1: 'Model pertama Anda', a2: 'Async di FastAPI', a3: 'has_many mendalam',
    a4: 'Menulis backend', a5: 'Deteksi otomatis N+1', a6: 'Transaksi bersarang &amp; savepoints'
  },
  voices: {
    label: 'Suara · testimoni', title: 'Apa yang <em>mereka katakan</em>.',
    q1: 'Dengan rhosocial-activerecord saya akhirnya berhenti berkelahi dengan ORM. Anotasi tipe adalah modelnya — tepat sekali.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync dan async berbagi satu API, refaktor hampir gratis. Migrasi FastAPI saya cukup dua baris.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Saya menulis backend DuckDB. Baca Backend ABC saat makan siang, sore sudah di produksi. Ini ekstensibilitas sejati.',
    q3_role: 'Data Platform · Singapura',
    q4: 'Setiap langkah rantai memiliki tipe yang diinferensi benar di IDE saya. Pydantic, dipakai di tempat yang tepat.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Nol dependensi runtime adalah kuncinya. Untuk deployment embedded kami tidak perlu khawatir tentang ukuran SQLAlchemy lagi.',
    q5_role: 'Insinyur IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo masuk', title: 'Masuk ke <em>rhosocial</em>.',
    welcome: 'Selamat datang kembali', sub: 'Lanjutkan dengan akun rhosocial Anda.',
    email: 'Email', password: 'Kata sandi', remember: 'Ingat saya', forgot: 'Lupa kata sandi?',
    login: 'Masuk', or: 'ATAU', github: 'Lanjutkan dengan GitHub', twitter: 'Lanjutkan dengan Twitter',
    no_account: 'Belum punya akun?', register: 'Daftar'
  },
  stats: {
    label: 'Dalam angka', title: 'Beberapa <em>angka</em>.',
    s1: 'Dialek DB yang tersedia', s2: 'Cakupan anotasi tipe', s3: 'Python minimum', s4: 'Dependensi ORM eksternal'
  },
  install: {
    label: 'Mulai', title: 'Instal satu baris, <em>sepuluh menit</em> ke query pertama.',
    sub: 'Dipublikasikan di PyPI. Backend SQLite ikut paket inti; backend lain diinstal sesuai kebutuhan.',
    docs: 'Baca dokumentasi →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
