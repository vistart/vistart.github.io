/**
 * i18n · vi · Tiếng Việt
 */
window.I18N = window.I18N || {};
window.I18N['vi-vn'] = {
  meta: { name: 'Tiếng Việt' },
  control: { theme_label: 'Chủ đề', font_label: 'Phông chữ', lang_label: 'Ngôn ngữ', font_auto: 'Tự động (mặc định của chủ đề)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>được <em>thiết kế lại</em> cho Python.',
    sub:     '<strong>rhosocial-activerecord</strong> định nghĩa mô hình bằng chú thích kiểu gốc của Python và truy vấn chúng bằng chuỗi <code>query().where(...).all()</code>. Đồng bộ và bất đồng bộ từ ngày đầu. Không phụ thuộc ORM bên ngoài — SQLite được tích hợp sẵn, các cơ sở dữ liệu khác là các gói riêng, và bạn có thể tự viết backend trong vài chục dòng.',
    cta_secondary: 'Xem tính năng →'
  },
  features: {
    label: 'Vì sao · sáu cam kết cốt lõi',
    title: 'Vì sao <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Kiểu = trường',         title: '<em>An toàn kiểu</em> từ gốc',                     desc: 'Một trường chỉ là <code>name: str</code> — lưu trữ, xác thực và gợi ý IDE gộp làm một.' },
    f2: { num: '02 / Async là công dân bậc nhất', title: 'Sync &amp; async, <em>một API</em>',            desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, hình dạng giống hệt.' },
    f3: { num: '03 / Backend có thể thay',   title: 'Backend <em>có thể cắm vào</em>',                 desc: 'SQLite tích hợp; Postgres/MySQL/MSSQL/Oracle là các gói riêng; hoặc viết của riêng bạn.' },
    f4: { num: '04 / Quan hệ tường minh',    title: '<em>Quan hệ</em> được khai báo rõ ràng',           desc: 'has_many / belongs_to khai báo trên model; các quan hệ tự thân là <code>QuerySet</code>.' },
    f5: { num: '05 / Giao dịch nguyên tử',   title: 'Giao dịch, <em>lồng nhau đúng cách</em>',          desc: 'Context manager và savepoints; ngoại lệ tự rollback sạch sẽ.' },
    f6: { num: '06 / Pythonic',              title: 'Đọc như <em>tiếng Anh</em>',                      desc: '<code>User.query().where(...).all()</code> — không DSL, chỉ là Python.' }
  },
  practice: {
    label: 'Trong thực tế · mã thật',
    title: 'Từ 3.8 đến 3.12, <em>từng bước một</em>.',
    intro: 'Tương ứng với các fixture <code>models_py38.py</code> … <code>models_py312.py</code> trong repo testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> thay cho <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> thay cho <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: kiểu <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> và generic PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Song song', title: 'Sync = async, <em>cùng ngữ nghĩa</em>.', intro: 'Đổi <code>for</code> thành <code>async for</code> là xong. Suy luận kiểu đi dọc toàn bộ chuỗi.', cta: 'Đọc hướng dẫn async →' },
  split_backend: { label: 'Tự do backend', title: 'Viết <em>backend</em> của bạn trong một buổi chiều.', intro: 'Kế thừa <code>Backend</code>, cài vài hook phương ngữ. DuckDB và libSQL đã được chứng minh.', cta: 'Hướng dẫn phát triển backend →' },
  pricing: {
    label: 'Gói · minh họa', title: 'Chọn <em>cấp</em> của bạn.',
    intro: '(Thẻ mẫu — dự án OSS miễn phí mãi mãi. Ở đây để xem trước thẻ pricing trên từng chủ đề.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Nhà phát triển cá nhân và người đóng góp OSS. Đủ tính năng, không giới hạn.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async đầy đủ', f3: 'Hỗ trợ diễn đàn cộng đồng',
          f4: 'Bảng điều khiển cộng tác nhóm', f5: 'Bảo đảm phản hồi SLA', cta: 'Bắt đầu' },
    c2: { tier: 'Team',       desc: 'Nhóm đang phát triển. Backend doanh nghiệp kèm kiểm toán.',
          f1: 'Toàn bộ của Community', f2: 'Backend MSSQL / Oracle', f3: 'Nhật ký kiểm toán &amp; tách đọc/ghi',
          f4: 'Discord riêng ưu tiên', f5: 'SSO / SAML', cta: 'Dùng thử 14 ngày' },
    c3: { tier: 'Enterprise', desc: 'Tổ chức lớn. On-prem, tuân thủ, đào tạo.', price_label: 'Liên hệ',
          f1: 'Toàn bộ của Team', f2: 'Backend tùy biến (DuckDB / libSQL / nội bộ)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 giờ', f5: 'Đào tạo tại chỗ và giải pháp chuyên biệt', cta: 'Liên hệ bán hàng' }
  },
  compare: {
    label: 'So sánh', title: 'So sánh với các ORM Python khác.', col_feature: 'Tính năng',
    row1: 'Mẫu thiết kế', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend dùng độc lập',
    row3: 'Không khái niệm session',
    row4: 'API sync / async nhất quán',
    row5: 'Tích hợp Pydantic native',
    row6: 'Xác thực dữ liệu runtime',
    row7: 'Khả năng biểu đạt SQL đầy đủ',
    row8: 'Khai báo khả năng',
    row9: 'Minh bạch SQL <code>.to_sql()</code>',
    row10: 'Không công cụ di chuyển bắt buộc',
    row11: 'Phụ thuộc tối thiểu',
    row12: 'Định nghĩa quan hệ rõ ràng'
  },
  gallery: {
    label: 'Thư viện thành phần · nguyên tố', title: 'Mỗi chủ đề xử lý <em>nguyên tố UI</em> như thế nào.',
    c_buttons: 'Nút', c_btngroup: 'Nhóm nút', c_form: 'Điều khiển biểu mẫu',
    c_radio: 'Nhóm radio', c_multi: 'Danh sách chọn nhiều', c_dropdown: 'Danh sách thả xuống',
    c_alerts: 'Cảnh báo', c_badges: 'Huy hiệu', c_progress: 'Tiến độ',
    c_grid: 'Demo lưới (12 cột)', c_rtl: 'Xem trước RTL', c_table: 'Bảng sọc',
    form_email: 'Địa chỉ email', form_note: 'Ghi chú',
    form_preload: 'Tải trước', form_async: 'Async',
    radio_sync: 'Sync (chế độ đồng bộ)', radio_async: 'Async (chế độ bất đồng bộ)', radio_both: 'Cả hai (ngăn xếp kép, chung mô hình)',
    alert_info:    '<b>Gợi ý.</b> Backend SQLite đi kèm gói lõi.',
    alert_success: '<b>Sẵn sàng.</b> Đã gọi <code>User.configure(...)</code>.',
    alert_warn:    '<b>Lưu ý.</b> Hàm window cần SQLite ≥ 3.25.',
    prog_coverage: 'Độ phủ kiểm thử', prog_backend: 'Hoàn thành backend', prog_locale: 'Bản địa hóa tài liệu',
    backend_note:  'Cùng một thành phần với thanh điều khiển phía trên.',
    multi1_t: 'PostgreSQL', multi1_d: 'Sản xuất chính',
    multi2_t: 'MySQL',      multi2_d: 'Dịch vụ cũ',
    multi3_t: 'SQLite',     multi3_d: 'Kiểm thử &amp; nguyên mẫu'
  },
  album: {
    label: 'Thư viện · ví dụ', title: 'Học từ <em>ví dụ</em>.',
    a1: 'Mô hình đầu tiên của bạn', a2: 'Async trong FastAPI', a3: 'has_many chuyên sâu',
    a4: 'Viết một backend', a5: 'Phát hiện N+1 tự động', a6: 'Giao dịch lồng &amp; savepoints'
  },
  voices: {
    label: 'Tiếng nói · nhận xét', title: 'Họ <em>nói vậy</em>.',
    q1: 'Nhờ rhosocial-activerecord, cuối cùng tôi không còn vật lộn với ORM. Chú thích kiểu chính là mô hình — đúng y như vậy.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync và async dùng chung một API, refactor gần như miễn phí. Di chuyển dự án FastAPI của tôi chỉ tốn hai dòng.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'Tôi tự viết backend DuckDB. Đọc Backend ABC lúc ăn trưa, chiều đã chạy production. Đây mới là khả năng mở rộng thực sự.',
    q3_role: 'Data Platform · Singapore',
    q4: 'Mỗi bước của chuỗi đều được suy luận đúng kiểu trong IDE. Pydantic, được dùng đúng chỗ.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Không phụ thuộc runtime là then chốt. Với triển khai nhúng, chúng tôi không còn lo về kích thước SQLAlchemy nữa.',
    q5_role: 'Kỹ sư IoT · Thâm Quyến'
  },
  auth: {
    label: 'Auth · demo đăng nhập', title: 'Đăng nhập vào <em>rhosocial</em>.',
    welcome: 'Chào mừng trở lại', sub: 'Tiếp tục với tài khoản rhosocial của bạn.',
    email: 'Email', password: 'Mật khẩu', remember: 'Ghi nhớ tôi', forgot: 'Quên mật khẩu?',
    login: 'Đăng nhập', or: 'HOẶC', github: 'Tiếp tục với GitHub', twitter: 'Tiếp tục với Twitter',
    no_account: 'Chưa có tài khoản?', register: 'Đăng ký'
  },
  stats: {
    label: 'Theo con số', title: 'Vài <em>con số</em>.',
    s1: 'Phương ngữ DB khả dụng', s2: 'Độ phủ chú thích kiểu', s3: 'Python tối thiểu', s4: 'Phụ thuộc ORM bên ngoài'
  },
  install: {
    label: 'Bắt đầu', title: 'Cài đặt một dòng, <em>mười phút</em> đến truy vấn đầu tiên.',
    sub: 'Đã phát hành trên PyPI. Backend SQLite đi cùng gói lõi; các backend khác cài theo nhu cầu.',
    docs: 'Đọc tài liệu →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
