/**
 * i18n · ko-kr · 한국어
 */
window.I18N = window.I18N || {};
window.I18N['ko-kr'] = {
  meta: { name: '한국어' },
  control: { theme_label: '테마', font_label: '글꼴', lang_label: '언어', font_auto: '자동 (테마 기본값)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>Python을 위해 <em>다시 설계</em>했습니다.',
    sub:     '<strong>rhosocial-activerecord</strong>는 Python의 네이티브 타입 어노테이션으로 모델을 정의하고, <code>query().where(...).all()</code> 체인으로 질의합니다. 동기와 비동기를 처음부터 지원합니다. 외부 ORM 의존성이 없으며, SQLite는 기본 내장, 다른 DB는 별도 패키지로 제공되고, 자체 백엔드는 수십 줄로 작성할 수 있습니다.',
    cta_secondary: '기능 보기 →'
  },
  features: {
    label: 'Why · 여섯 가지 핵심 약속',
    title: '왜 <em>rhosocial ActiveRecord</em>인가.',
    f1: { num: '01 / 타입 = 필드',       title: '구조적으로 <em>타입 안전</em>',               desc: '필드는 곧 <code>name: str</code> — 저장, 검증, IDE 자동완성이 한 곳에.' },
    f2: { num: '02 / 비동기 우선',       title: '동기 &amp; 비동기, <em>같은 API</em>',         desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, 형태는 동일.' },
    f3: { num: '03 / 플러그형 백엔드',   title: '플러그형 <em>백엔드</em>',                     desc: 'SQLite 내장, Postgres/MySQL/MSSQL/Oracle는 별도 패키지, 자체 작성도 가능.' },
    f4: { num: '04 / 명시적 관계',       title: '<em>관계</em>는 명시적으로',                   desc: 'has_many / belongs_to를 모델에 선언, 관계 자체가 <code>QuerySet</code>.' },
    f5: { num: '05 / 원자적 트랜잭션',   title: '<em>중첩 가능한</em> 트랜잭션',                desc: '컨텍스트 매니저 + savepoint, 예외 시 자동 롤백.' },
    f6: { num: '06 / 파이썬답게',        title: '<em>영어</em>처럼 읽힘',                       desc: '<code>User.query().where(...).all()</code> — DSL 없음, 그냥 Python.' }
  },
  practice: {
    label: 'In Practice · 실전 코드',
    title: '3.8부터 3.12까지, <em>한 단계씩</em>.',
    intro: 'testsuite 저장소의 <code>models_py38.py</code> … <code>models_py312.py</code>에 대응.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: <code>Self</code> 타입 (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code>와 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Side by side', title: '동기 = 비동기, <em>의미는 같다</em>.', intro: '<code>for</code>를 <code>async for</code>로 바꾸기만 하면 됩니다. 타입 추론은 체인 끝까지 이어집니다.', cta: 'async 가이드 읽기 →' },
  split_backend: { label: 'Backend freedom', title: '나만의 <em>백엔드</em>, 수십 줄이면 충분.', intro: '<code>Backend</code>를 상속하고 방언 훅만 구현하면 됩니다. DuckDB와 libSQL은 이미 검증되었습니다.', cta: '백엔드 개발 가이드 →' },
  pricing: {
    label: 'Plans · 예시', title: '<em>플랜</em> 선택.',
    intro: '(예시 카드 — OSS 자체는 영구 무료입니다. pricing 컴포넌트를 각 테마에서 미리 볼 수 있도록 표시.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: '개인 개발자와 OSS 기여자용. 기능 제한 없음.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: '전체 동기 &amp; 비동기 API', f3: '커뮤니티 포럼 지원',
          f4: '팀 협업 대시보드', f5: 'SLA 응답 보장', cta: '시작하기' },
    c2: { tier: 'Team',       desc: '성장 중인 팀. 엔터프라이즈 백엔드와 감사 포함.',
          f1: 'Community 전체', f2: 'MSSQL / Oracle 백엔드', f3: '감사 로그 &amp; 읽기/쓰기 분리',
          f4: '전용 Discord 우선 지원', f5: 'SSO / SAML', cta: '14일 체험' },
    c3: { tier: 'Enterprise', desc: '대규모 조직. 온프레미스·컴플라이언스·교육.', price_label: '문의하기',
          f1: 'Team 전체', f2: '커스텀 백엔드 (DuckDB / libSQL / 자체)', f3: 'SSO / SAML / LDAP',
          f4: '4시간 SLA', f5: '방문 교육 및 전담 솔루션', cta: '영업 문의' }
  },
  compare: {
    label: 'Compare', title: '플랜별 <em>기능 비교</em>.', col_feature: '기능',
    row1: 'SQLite / Postgres / MySQL', row2: 'MSSQL / Oracle 백엔드', row3: '커스텀 백엔드',
    row4: '전체 동기 / 비동기 API', row5: '감사 로그', row6: '읽기/쓰기 분리', row7: 'SSO / SAML / LDAP',
    row8: 'SLA 응답', row8c: '— 커뮤니티', row8t: '24시간', row8e: '4시간', row9: '연간 가격'
  },
  gallery: {
    label: 'Component Gallery · UI 프리미티브', title: '각 테마에서의 <em>컨트롤 표현</em>.',
    c_buttons: 'Buttons', c_btngroup: 'Button group', c_form: 'Form controls',
    c_radio: 'Radio group', c_multi: 'Multi-select list', c_dropdown: 'Dropdown',
    c_alerts: 'Alerts', c_badges: 'Badges', c_progress: 'Progress',
    c_grid: 'Grid showcase (12 col)', c_rtl: 'RTL preview', c_table: 'Striped data table',
    form_email: '이메일 주소', form_note: '메모',
    form_preload: '프리로드', form_async: '비동기',
    radio_sync: 'Sync (동기 모드)', radio_async: 'Async (비동기 모드)', radio_both: 'Both (듀얼 스택, 모델 공유)',
    alert_info:    '<b>참고.</b> SQLite 백엔드는 코어 패키지에 포함되어 있습니다.',
    alert_success: '<b>준비 완료.</b> <code>User.configure(...)</code> 호출됨.',
    alert_warn:    '<b>주의.</b> 윈도우 함수에는 SQLite ≥ 3.25가 필요합니다.',
    prog_coverage: '테스트 커버리지', prog_backend: '백엔드 완성도', prog_locale: '문서 현지화',
    backend_note:  '상단 컨트롤 바와 동일한 컴포넌트입니다.',
    multi1_t: 'PostgreSQL', multi1_d: '메인 프로덕션',
    multi2_t: 'MySQL',      multi2_d: '레거시 서비스',
    multi3_t: 'SQLite',     multi3_d: '테스트 &amp; 프로토타입'
  },
  album: {
    label: 'Gallery · 도서관', title: '<em>사례</em>에서 배우기.',
    a1: '첫 모델', a2: 'FastAPI의 async', a3: 'has_many 심화',
    a4: '직접 백엔드 작성', a5: 'N+1 자동 감지', a6: '중첩 트랜잭션 &amp; savepoint'
  },
  voices: {
    label: 'Voices · 사용자 후기', title: '그들이 <em>이렇게 말합니다</em>.',
    q1: 'rhosocial-activerecord 덕분에 드디어 ORM과 싸우지 않아도 됩니다. 타입 어노테이션이 곧 모델, 정답입니다.',
    q1_role: 'Backend Engineer · 교토',
    q2: '동기와 비동기가 같은 API라 리팩토링 비용이 거의 0. FastAPI 프로젝트 전체 마이그레이션이 두 줄이었습니다.',
    q2_role: 'Staff Engineer · 베를린',
    q3: '직접 DuckDB 백엔드를 작성했습니다. Backend ABC 읽고 오후에 바로 동작. 진짜 확장성입니다.',
    q3_role: 'Data Platform · 싱가포르',
    q4: 'IDE에서 체인의 매 단계가 올바르게 추론됩니다. Pydantic의 힘이 제대로 쓰였습니다.',
    q4_role: 'Senior Python · 상파울루',
    q5: '런타임 의존성 0이 핵심입니다. 임베디드 배포에서 SQLAlchemy 크기 걱정을 더 이상 하지 않습니다.',
    q5_role: 'IoT 엔지니어 · 선전'
  },
  auth: {
    label: 'Auth · 로그인 데모', title: '<em>rhosocial</em>에 로그인.',
    welcome: '다시 오신 것을 환영합니다', sub: 'rhosocial 계정으로 계속하세요.',
    email: '이메일', password: '비밀번호', remember: '기억하기', forgot: '비밀번호를 잊으셨나요?',
    login: '로그인', or: 'OR', github: 'GitHub로 계속', twitter: 'Twitter로 계속',
    no_account: '계정이 없으신가요?', register: '가입하기'
  },
  stats: {
    label: 'By the numbers', title: '몇 가지 <em>숫자</em>.',
    s1: '사용 가능한 DB 방언', s2: '타입 어노테이션 커버리지', s3: '최소 Python 버전', s4: '외부 ORM 의존성'
  },
  install: {
    label: 'Get started', title: '한 줄 설치, <em>10분</em> 만에 첫 쿼리.',
    sub: 'PyPI에 공개. SQLite 백엔드는 코어에 포함, 다른 백엔드는 필요 시 설치.',
    docs: '문서 읽기 →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
