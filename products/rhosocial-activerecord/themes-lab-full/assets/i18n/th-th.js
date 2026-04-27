/**
 * i18n · th-th · ไทย
 */
window.I18N = window.I18N || {};
window.I18N['th-th'] = {
  meta: { name: 'ไทย' },
  control: { theme_label: 'ธีม', font_label: 'ฟอนต์', lang_label: 'ภาษา', font_auto: 'อัตโนมัติ (ค่าเริ่มต้นของธีม)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title: 'rhosocial ActiveRecord,<br><em>ออกแบบใหม่</em>สำหรับ Python',
    sub: '<strong>rhosocial-activerecord</strong> กำหนดโมเดลด้วย type annotation ของ Python และสอบถามด้วยลูกโซ่ <code>query().where(...).all()</code> ทั้ง sync และ async ตั้งแต่วันแรก ไม่พึ่ง ORM ภายนอก — SQLite มาในตัว ฐานข้อมูลอื่นเป็นแพ็กเกจแยก เขียน backend เองได้ในไม่กี่สิบบรรทัด',
    cta_secondary: 'ดูฟีเจอร์ →'
  },
  features: {
    label: 'ทำไม · สัญญา 6 ข้อ',
    title: 'ทำไมต้อง <em>rhosocial ActiveRecord</em>',
    f1: { num: '01 / ประเภท = ฟิลด์', title: '<em>Type-safe</em> ตั้งแต่ก่อสร้าง', desc: '<code>name: str</code> คือการเก็บ ตรวจสอบ และ IDE แนะนำในคำเดียว' },
    f2: { num: '02 / Async ชั้นหนึ่ง', title: 'Sync &amp; async, <em>API เดียวกัน</em>', desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code> รูปแบบเหมือนกัน' },
    f3: { num: '03 / สลับได้', title: 'Backend <em>สลับได้</em>', desc: 'SQLite มาในตัว Postgres/MySQL/MSSQL/Oracle เป็นแพ็กเกจแยก หรือเขียนเอง' },
    f4: { num: '04 / ความสัมพันธ์ชัดเจน', title: '<em>Relations</em> ประกาศชัดเจน', desc: 'has_many / belongs_to ประกาศบนโมเดล ความสัมพันธ์เองก็เป็น <code>QuerySet</code>' },
    f5: { num: '05 / ธุรกรรมเป็นอะตอม', title: 'ธุรกรรม, <em>ซ้อนกันได้อย่างถูกต้อง</em>', desc: 'context manager + savepoint ข้อยกเว้นทำให้ rollback อัตโนมัติ' },
    f6: { num: '06 / Pythonic', title: 'อ่านเหมือน<em>ภาษาอังกฤษ</em>', desc: '<code>User.query().where(...).all()</code> — ไม่มี DSL เป็น Python เท่านั้น' }
  },
  practice: {
    label: 'ในทางปฏิบัติ · โค้ดจริง',
    title: 'จาก 3.8 ถึง 3.12, <em>พัฒนาทีละก้าว</em>',
    intro: 'ตรงกับไฟล์ <code>models_py38.py</code> … <code>models_py312.py</code> ใน repo testsuite',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> แทน <code>List[str]</code> (PEP 585)',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> แทน <code>Optional[int]</code> (PEP 604)',
    p3: '<b>3.10 → 3.11</b>: ประเภท <code>Self</code> (PEP 673)',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> และ generic PEP 695 <code>class Result[T]:</code>'
  },
  split_sync: {
    label: 'เทียบกัน',
    title: 'Sync = async, <em>ความหมายเหมือนกัน</em>',
    intro: 'เปลี่ยน <code>for</code> เป็น <code>async for</code> เท่านั้น type inference ไม่ขาดตอน',
    cta: 'อ่านคู่มือ async →'
  },
  split_backend: {
    label: 'อิสระของ backend',
    title: 'เขียน backend <em>เอง</em> ในไม่กี่ชั่วโมง',
    intro: 'สืบทอด <code>Backend</code> ใช้ dialect hooks ไม่กี่ตัว DuckDB และ libSQL พิสูจน์แล้ว',
    cta: 'คู่มือพัฒนา backend →'
  },
  pricing: {
    label: 'แผน · ตัวอย่าง',
    title: 'เลือก<em>แพ็กเกจ</em>ของคุณ',
    intro: '(ตัวอย่างการ์ด — ตัวโปรเจกต์ OSS เองฟรีตลอดกาล แสดงเพื่อทดสอบ pricing component บนทุกธีม)',
    badge: 'ยอดนิยม',
    c1: {
      tier: 'Community', desc: 'สำหรับนักพัฒนาส่วนบุคคลและ contributor ของ OSS ฟังก์ชันเต็ม ไม่จำกัด',
      f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async เต็มรูปแบบ', f3: 'ฟอรั่มชุมชน',
      f4: 'แดชบอร์ดทำงานร่วมกัน', f5: 'การรับประกัน SLA', cta: 'เริ่มต้น'
    },
    c2: {
      tier: 'Team', desc: 'ทีมที่กำลังเติบโต backend ระดับ enterprise และ audit',
      f1: 'ทุกอย่างจาก Community', f2: 'backend MSSQL / Oracle', f3: 'audit log &amp; แยกอ่าน/เขียน',
      f4: 'Discord ส่วนตัว priority support', f5: 'SSO / SAML', cta: 'ทดลอง 14 วัน'
    },
    c3: {
      tier: 'Enterprise', desc: 'องค์กรขนาดใหญ่ on-prem, compliance, การอบรม',
      price_label: 'ติดต่อเรา',
      f1: 'ทุกอย่างจาก Team', f2: 'backend แบบกำหนดเอง (DuckDB / libSQL / ภายใน)',
      f3: 'SSO / SAML / LDAP', f4: 'SLA 4 ชั่วโมง', f5: 'อบรม onsite และ solution แบบเฉพาะ', cta: 'ติดต่อฝ่ายขาย'
    }
  },
  compare: {
    label: 'เปรียบเทียบ',
    title: 'เปรียบเทียบกับ ORM ของ Python อื่นๆ',
    col_feature: 'คุณลักษณะ',
    row1: 'รูปแบบการออกแบบ',
    row1r: 'ActiveRecord',
    row1sa: 'Data Mapper',
    row1dj: 'ActiveRecord',
    row1sm: 'Hybrid',
    row1pw: 'ActiveRecord',
    row1to: 'ActiveRecord',
    row2: 'Backend ใช้แยกอิสระ',
    row3: 'ไม่มีแนวคิด Session',
    row4: 'API sync / async สอดคล้องกัน',
    row5: 'การรวม Pydantic แบบ native',
    row6: 'การตรวจสอบข้อมูลขณะทำงาน',
    row7: 'พลัง SQL ครบถ้วน',
    row8: 'กลไกประกาศความสามารถ',
    row9: 'ความโปร่งใส SQL <code>.to_sql()</code>',
    row10: 'ไม่บังคับเครื่องมือย้ายข้อมูล',
    row11: 'การพึ่งพาขั้นต่ำ',
    row12: 'การกำหนดความสัมพันธ์ชัดเจน'
  },
  gallery: {
    label: 'คลัง component · ส่วน UI', title: 'ลักษณะ<em>ตัวควบคุม</em>ภายใต้แต่ละธีม',
    c_buttons: 'ปุ่ม', c_btngroup: 'กลุ่มปุ่ม', c_form: 'ตัวควบคุมฟอร์ม', c_radio: 'กลุ่ม radio',
    c_multi: 'รายการเลือกหลาย', c_dropdown: 'เมนูแบบเลื่อน', c_alerts: 'การแจ้งเตือน',
    c_badges: 'ป้าย', c_progress: 'ความคืบหน้า', c_grid: 'ตัวอย่าง Grid (12 คอลัมน์)',
    c_rtl: 'ตัวอย่าง RTL', c_table: 'ตารางแถบสลับ',
    form_email: 'อีเมล', form_note: 'หมายเหตุ', form_preload: 'โหลดล่วงหน้า', form_async: 'Async',
    radio_sync: 'Sync (โหมดซิงค์)', radio_async: 'Async (โหมดอะซิงค์)', radio_both: 'ทั้งคู่ (โมเดลร่วม)',
    alert_info: '<b>เคล็ดลับ</b> backend SQLite มาพร้อมกับแพ็กเกจหลัก',
    alert_success: '<b>พร้อม</b> เรียก <code>User.configure(...)</code> แล้ว',
    alert_warn: '<b>ระวัง</b> ฟังก์ชันหน้าต่างต้องการ SQLite ≥ 3.25',
    prog_coverage: 'ความครอบคลุมการทดสอบ', prog_backend: 'ความสมบูรณ์ของ backend', prog_locale: 'การแปลเอกสาร',
    backend_note: 'component เดียวกับแถบควบคุมด้านบน',
    multi1_t: 'PostgreSQL', multi1_d: 'ผลิตภัณฑ์หลัก', multi2_t: 'MySQL', multi2_d: 'ระบบเก่า', multi3_t: 'SQLite', multi3_d: 'ทดสอบ &amp; ต้นแบบ'
  },
  album: {
    label: 'คลัง · ไลบรารี', title: 'เรียนรู้จาก<em>ตัวอย่าง</em>',
    a1: 'โมเดลแรกของคุณ', a2: 'Async กับ FastAPI', a3: 'has_many เชิงลึก',
    a4: 'เขียน backend', a5: 'ตรวจจับ N+1 อัตโนมัติ', a6: 'ธุรกรรมซ้อน &amp; savepoint'
  },
  voices: {
    label: 'เสียง · ความคิดเห็น', title: 'สิ่งที่<em>พวกเขาพูด</em>',
    q1: 'ด้วย rhosocial-activerecord ผมเลิกต่อสู้กับ ORM ได้ทีสุด type annotation คือโมเดล นี่คือคำตอบ',
    q1_role: 'วิศวกร Backend · เกียวโต',
    q2: 'sync และ async ใช้ API เดียวกัน refactor แทบไม่เสียค่าใช้จ่าย ย้าย FastAPI แค่สองบรรทัด',
    q2_role: 'Staff Engineer · เบอร์ลิน',
    q3: 'ผมเขียน backend DuckDB เอง อ่าน Backend ABC ตอนกลางวัน บ่ายวันนั้นก็ขึ้น production นี่คือ extensibility ตัวจริง',
    q3_role: 'Data Platform · สิงคโปร์',
    q4: 'ทุกขั้นตอนของลูกโซ่มี type inference ถูกต้องใน IDE Pydantic ใช้ในที่ที่เหมาะสม',
    q4_role: 'Senior Python · เซาเปาโล',
    q5: 'Zero runtime dependency คือหัวใจ งาน embedded ไม่ต้องทนขนาด SQLAlchemy อีกต่อไป',
    q5_role: 'วิศวกร IoT · เซิ้นเจิ้น'
  },
  auth: {
    label: 'Auth · demo ล็อกอิน', title: 'ล็อกอินเข้า <em>rhosocial</em>',
    welcome: 'ยินดีต้อนรับกลับ', sub: 'ดำเนินการต่อด้วยบัญชี rhosocial ของคุณ',
    email: 'อีเมล', password: 'รหัสผ่าน', remember: 'จดจำฉัน', forgot: 'ลืมรหัสผ่าน?',
    login: 'ล็อกอิน', or: 'หรือ', github: 'ดำเนินการต่อด้วย GitHub', twitter: 'ดำเนินการต่อด้วย Twitter',
    no_account: 'ยังไม่มีบัญชี?', register: 'ลงทะเบียน'
  },
  stats: {
    label: 'ตัวเลข', title: 'บาง<em>ตัวเลข</em>',
    s1: 'dialect ฐานข้อมูลที่ใช้ได้', s2: 'อัตราครอบคลุม type annotation', s3: 'เวอร์ชัน Python ขั้นต่ำ', s4: 'dependency ORM ภายนอก'
  },
  install: {
    label: 'เริ่มต้น', title: 'ติดตั้งหนึ่งบรรทัด, <em>สิบนาที</em>เริ่มได้',
    sub: 'เผยแพร่บน PyPI backend SQLite มาในตัว อื่นติดตั้งตามต้องการ',
    docs: 'อ่านเอกสาร →'
  },
  footer: {
    hotkeys: '25 themes × 26 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">key</span> theme / <span class="kbd">Shift</span>+<span class="kbd">key</span> font / <span class="kbd">Alt</span>+<span class="kbd">key</span> language'
  }
};