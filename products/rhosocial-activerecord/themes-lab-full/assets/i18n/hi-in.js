/**
 * i18n · hi · हिन्दी
 */
window.I18N = window.I18N || {};
window.I18N['hi-in'] = {
  meta: { name: 'हिन्दी' },
  control: { theme_label: 'थीम', font_label: 'फ़ॉन्ट', lang_label: 'भाषा', font_auto: 'स्वचालित (थीम डिफ़ॉल्ट)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>Python के लिए <em>फिर से डिज़ाइन किया गया</em>।',
    sub:     '<strong>rhosocial-activerecord</strong> Python के नेटिव टाइप एनोटेशन से मॉडल परिभाषित करता है और एक चेन <code>query().where(...).all()</code> से क्वेरी करता है। पहले दिन से सिंक और एसिंक दोनों। कोई बाहरी ORM डिपेंडेंसी नहीं — SQLite अंदर से आता है, बाक़ी डेटाबेस अलग-अलग पैकेज हैं, और आप अपना बैकेंड कुछ दर्जन लाइनों में लिख सकते हैं।',
    cta_secondary: 'फ़ीचर देखें →'
  },
  features: {
    label: 'क्यों · छह मूल वादे',
    title: 'क्यों <em>rhosocial ActiveRecord</em>।',
    f1: { num: '01 / टाइप ही फील्ड',           title: 'कंस्ट्रक्शन से <em>टाइप-सुरक्षित</em>',         desc: 'फील्ड बस <code>name: str</code> है — स्टोरेज, वैलिडेशन और IDE सजेशन एक साथ।' },
    f2: { num: '02 / एसिंक फ़र्स्ट-क्लास',       title: 'सिंक और एसिंक, <em>एक ही API</em>',                desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, एक ही आकार।' },
    f3: { num: '03 / प्लग करने योग्य बैकएंड',   title: 'प्लग करने योग्य <em>बैकएंड</em>',                 desc: 'SQLite बिल्ट-इन; Postgres/MySQL/MSSQL/Oracle अलग पैकेज; या अपना लिखें।' },
    f4: { num: '04 / स्पष्ट रिलेशन',            title: '<em>रिलेशन</em> स्पष्ट रूप से',                   desc: 'has_many / belongs_to मॉडल पर घोषित, रिलेशन स्वयं <code>QuerySet</code> हैं।' },
    f5: { num: '05 / एटॉमिक ट्रांज़ैक्शन',     title: 'ट्रांज़ैक्शन, <em>सही तरह नेस्टेड</em>',           desc: 'कॉन्टेक्स्ट मैनेजर और savepoints; exception पर साफ़-सुथरा rollback।' },
    f6: { num: '06 / Pythonic',                title: '<em>अंग्रेज़ी</em> की तरह पढ़ा जाता है',            desc: '<code>User.query().where(...).all()</code> — कोई DSL नहीं, बस Python।' }
  },
  practice: {
    label: 'व्यवहार में · असली कोड',
    title: '3.8 से 3.12 तक, <em>एक-एक क़दम</em>।',
    intro: 'testsuite रेपो की <code>models_py38.py</code> … <code>models_py312.py</code> फ़िक्स्चर्स के अनुरूप।',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code>, <code>List[str]</code> की जगह (PEP 585)।',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code>, <code>Optional[int]</code> की जगह (PEP 604)।',
    p3: '<b>3.10 → 3.11</b>: <code>Self</code> टाइप (PEP 673)।',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> और PEP 695 जेनेरिक्स <code>class Result[T]:</code>।'
  },
  split_sync:    { label: 'साथ-साथ', title: 'सिंक = एसिंक, <em>सेमेंटिक्स एक</em>।', intro: '<code>for</code> को <code>async for</code> से बदलें, बाक़ी वैसा ही। टाइप इनफ़रेंस पूरी चेन भर चलती है।', cta: 'async गाइड पढ़ें →' },
  split_backend: { label: 'बैकएंड की आज़ादी', title: 'अपना <em>बैकएंड</em>, एक शाम में।', intro: '<code>Backend</code> को subclass करें, कुछ डायलेक्ट हुक लागू करें। DuckDB और libSQL पहले से साबित हैं।', cta: 'बैकएंड डेवलपर गाइड →' },
  pricing: {
    label: 'प्लान · उदाहरण', title: 'अपना <em>स्तर</em> चुनें।',
    intro: '(नमूना कार्ड — OSS प्रोजेक्ट स्वयं हमेशा मुफ़्त है। यह हर थीम पर pricing कार्ड देखने के लिए दिखाया गया है।)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'एकल डेवलपर और OSS कंट्रीब्यूटर। पूर्ण फ़ीचर, बिना सीमा।',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'पूर्ण sync और async API', f3: 'कम्युनिटी फ़ोरम सपोर्ट',
          f4: 'टीम कोलैबोरेशन डैशबोर्ड', f5: 'SLA प्रतिक्रिया गारंटी', cta: 'शुरू करें' },
    c2: { tier: 'Team',       desc: 'बढ़ती टीमें। एंटरप्राइज़ बैकएंड और ऑडिट।',
          f1: 'Community का सब कुछ', f2: 'MSSQL / Oracle बैकएंड', f3: 'ऑडिट लॉग और read/write विभाजन',
          f4: 'प्राइवेट Discord प्राथमिकता सपोर्ट', f5: 'SSO / SAML', cta: '14 दिन का ट्रायल' },
    c3: { tier: 'Enterprise', desc: 'बड़े संगठन। ऑन-प्रेम, अनुपालन, प्रशिक्षण।', price_label: 'संपर्क करें',
          f1: 'Team का सब कुछ', f2: 'कस्टम बैकएंड (DuckDB / libSQL / इन-हाउस)', f3: 'SSO / SAML / LDAP',
          f4: '4 घंटे SLA', f5: 'ऑन-साइट प्रशिक्षण और समर्पित समाधान', cta: 'सेल्स से संपर्क करें' }
  },
  compare: {
    label: 'तुलना', title: 'फ़ीचर <em>तुलना</em>।', col_feature: 'फ़ीचर',
    row1: 'SQLite / Postgres / MySQL', row2: 'MSSQL / Oracle बैकएंड', row3: 'कस्टम बैकएंड',
    row4: 'पूर्ण sync / async API', row5: 'ऑडिट लॉग', row6: 'read/write विभाजन', row7: 'SSO / SAML / LDAP',
    row8: 'SLA प्रतिक्रिया', row8c: '— कम्युनिटी', row8t: '24 घंटे', row8e: '4 घंटे', row9: 'वार्षिक क़ीमत'
  },
  gallery: {
    label: 'कंपोनेंट गैलरी · प्रिमिटिव', title: 'हर थीम <em>UI प्रिमिटिव</em> को कैसे दिखाती है।',
    c_buttons: 'बटन', c_btngroup: 'बटन समूह', c_form: 'फ़ॉर्म कंट्रोल',
    c_radio: 'रेडियो समूह', c_multi: 'मल्टी-सेलेक्ट सूची', c_dropdown: 'ड्रॉपडाउन',
    c_alerts: 'अलर्ट', c_badges: 'बैज', c_progress: 'प्रगति',
    c_grid: 'ग्रिड डेमो (12 कॉलम)', c_rtl: 'RTL पूर्वावलोकन', c_table: 'स्ट्राइप्ड टेबल',
    form_email: 'ईमेल पता', form_note: 'नोट्स',
    form_preload: 'प्रीलोड', form_async: 'Async',
    radio_sync: 'Sync (सिंक्रनस मोड)', radio_async: 'Async (एसिंक्रनस मोड)', radio_both: 'दोनों (डुअल स्टैक, साझा मॉडल)',
    alert_info:    '<b>सूचना।</b> SQLite बैकएंड कोर पैकेज में आता है।',
    alert_success: '<b>तैयार।</b> <code>User.configure(...)</code> कॉल किया गया।',
    alert_warn:    '<b>ध्यान दें।</b> window functions के लिए SQLite ≥ 3.25 चाहिए।',
    prog_coverage: 'टेस्ट कवरेज', prog_backend: 'बैकएंड पूर्णता', prog_locale: 'डॉक्यूमेंटेशन स्थानीयकरण',
    backend_note:  'यह वही कंपोनेंट है जो ऊपर की बार में है।',
    multi1_t: 'PostgreSQL', multi1_d: 'मुख्य प्रोडक्शन',
    multi2_t: 'MySQL',      multi2_d: 'लेगसी सर्विस',
    multi3_t: 'SQLite',     multi3_d: 'टेस्ट और प्रोटोटाइप'
  },
  album: {
    label: 'गैलरी · लाइब्रेरी', title: '<em>उदाहरणों</em> से सीखें।',
    a1: 'आपका पहला मॉडल', a2: 'FastAPI में async', a3: 'has_many गहराई में',
    a4: 'अपना बैकएंड लिखें', a5: 'N+1 स्वचालित पहचान', a6: 'नेस्टेड ट्रांज़ैक्शन और savepoints'
  },
  voices: {
    label: 'आवाज़ें · प्रशंसापत्र', title: 'वे <em>यह कहते</em> हैं।',
    q1: 'rhosocial-activerecord के बाद आख़िरकार मैं ORM से नहीं लड़ रहा। टाइप एनोटेशन ही मॉडल है — एकदम सही।',
    q1_role: 'Backend Engineer · क्योटो',
    q2: 'Sync और async एक ही API साझा करते हैं, रीफ़ैक्टरिंग लगभग मुफ़्त है। मेरा FastAPI migration दो लाइनों में हो गया।',
    q2_role: 'Staff Engineer · बर्लिन',
    q3: 'मैंने DuckDB बैकेंड लिखा। Backend ABC दोपहर को पढ़ा, शाम तक प्रोडक्शन में। यही असली विस्तार-योग्यता है।',
    q3_role: 'Data Platform · सिंगापुर',
    q4: 'IDE में चेन का हर क़दम सही टाइप इनफ़र करता है। Pydantic का सही इस्तेमाल।',
    q4_role: 'Senior Python · साओ पाउलो',
    q5: 'ज़ीरो रनटाइम डिपेंडेंसी ही कुंजी है। एम्बेडेड डिप्लॉयमेंट में SQLAlchemy के आकार की चिंता ख़त्म।',
    q5_role: 'IoT इंजीनियर · शेनज़ेन'
  },
  auth: {
    label: 'Auth · लॉगिन डेमो', title: '<em>rhosocial</em> में लॉग इन करें।',
    welcome: 'वापसी पर स्वागत है', sub: 'अपने rhosocial खाते से जारी रखें।',
    email: 'ईमेल', password: 'पासवर्ड', remember: 'मुझे याद रखें', forgot: 'पासवर्ड भूल गए?',
    login: 'लॉग इन', or: 'या', github: 'GitHub से जारी रखें', twitter: 'Twitter से जारी रखें',
    no_account: 'अभी खाता नहीं है?', register: 'साइन अप'
  },
  stats: {
    label: 'संख्याओं में', title: 'कुछ <em>आँकड़े</em>।',
    s1: 'उपलब्ध DB डायलेक्ट', s2: 'टाइप एनोटेशन कवरेज', s3: 'न्यूनतम Python', s4: 'बाहरी ORM डिपेंडेंसी'
  },
  install: {
    label: 'शुरू करें', title: 'एक लाइन में इंस्टॉल, पहली क्वेरी तक <em>दस मिनट</em>।',
    sub: 'PyPI पर प्रकाशित। SQLite बैकेंड कोर पैकेज के साथ; बाक़ी ज़रूरत पर इंस्टॉल करें।',
    docs: 'डॉक्यूमेंटेशन पढ़ें →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
