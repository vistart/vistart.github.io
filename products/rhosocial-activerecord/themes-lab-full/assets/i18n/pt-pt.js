/**
 * i18n · pt-pt · Português (Portugal)
 */
window.I18N = window.I18N || {};
window.I18N['pt-pt'] = {
  meta: { name: 'Português' },
  control: { theme_label: 'Tema', font_label: 'Tipo de letra', lang_label: 'Idioma', font_auto: 'Automático (predefinição do tema)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>repensado para <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> define modelos com anotações de tipo nativas do Python e consulta-os com uma cadeia <code>query().where(...).all()</code>. Síncrono e assíncrono desde o primeiro dia. Sem dependências externas de ORM — SQLite está incluído, outras bases de dados são pacotes separados, e pode escrever o seu próprio backend em poucas dezenas de linhas.',
    cta_secondary: 'Ver funcionalidades →'
  },
  features: {
    label: 'Porquê · seis promessas centrais',
    title: 'Porquê <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tipo = campo',         title: 'Com <em>tipagem</em> por construção',           desc: 'Um campo é apenas <code>name: str</code> — armazenamento, validação e IDE numa só linha.' },
    f2: { num: '02 / Assíncrono primário',  title: 'Sync &amp; async, <em>uma API</em>',            desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, com a mesma forma.' },
    f3: { num: '03 / Backends intercambiáveis', title: 'Backends <em>intercambiáveis</em>',          desc: 'SQLite incluído; Postgres/MySQL/MSSQL/Oracle como pacotes; ou escreva o seu.' },
    f4: { num: '04 / Relações explícitas',  title: '<em>Relações</em> tornadas explícitas',         desc: 'has_many / belongs_to declarados no modelo; as relações são <code>QuerySet</code>.' },
    f5: { num: '05 / Transações atómicas',  title: 'Transações <em>devidamente encaixadas</em>',    desc: 'Gestor de contexto + savepoints; exceções provocam rollback.' },
    f6: { num: '06 / Pythonic',             title: 'Lê-se como <em>inglês</em>',                    desc: '<code>User.query().where(...).all()</code> — sem DSL, apenas Python.' }
  },
  practice: {
    label: 'Na prática · código real',
    title: 'De 3.8 a 3.12, <em>um passo de cada vez</em>.',
    intro: 'Corresponde às fixtures <code>models_py38.py</code> … <code>models_py312.py</code> do repositório testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> substitui <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> substitui <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: o tipo <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> e genéricos PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Lado a lado', title: 'Sync = async, <em>mesma semântica</em>.', intro: 'Troque <code>for</code> por <code>async for</code> e pronto. A inferência de tipos percorre toda a cadeia.', cta: 'Ler o guia async →' },
  split_backend: { label: 'Liberdade de backend', title: 'Escreva o seu <em>backend</em> em poucas dezenas de linhas.', intro: 'Herde de <code>Backend</code>, implemente uns quantos ganchos de dialecto. DuckDB e libSQL já estão comprovados.', cta: 'Guia de dev de backend →' },
  pricing: {
    label: 'Planos · ilustrativos', title: 'Escolha o seu <em>plano</em>.',
    intro: '(Cartões de exemplo — o projeto OSS é gratuito para sempre. Aqui para pré-visualizar os cartões em cada tema.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Programadores solo e contribuidores OSS. Funcionalidades completas, sem limites.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async completa', f3: 'Apoio via fórum da comunidade',
          f4: 'Painel de colaboração em equipa', f5: 'Garantia de resposta SLA', cta: 'Começar' },
    c2: { tier: 'Team',       desc: 'Equipas em crescimento. Backends empresariais e auditoria.',
          f1: 'Tudo do Community', f2: 'Backends MSSQL / Oracle', f3: 'Registo de auditoria &amp; separação leitura/escrita',
          f4: 'Discord privado com prioridade', f5: 'SSO / SAML', cta: 'Teste de 14 dias' },
    c3: { tier: 'Enterprise', desc: 'Grandes organizações. On-prem, conformidade, formação.', price_label: 'Contactar',
          f1: 'Tudo do Team', f2: 'Backends à medida (DuckDB / libSQL / interno)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA de 4 horas', f5: 'Formação presencial e soluções dedicadas', cta: 'Contactar vendas' }
  },
  compare: {
    label: 'Comparar', title: 'Comparação de <em>funcionalidades</em>.', col_feature: 'Funcionalidade',
    row1: 'SQLite / Postgres / MySQL', row2: 'Backends MSSQL / Oracle', row3: 'Backends à medida',
    row4: 'API sync / async completa', row5: 'Registo de auditoria', row6: 'Separação leitura/escrita', row7: 'SSO / SAML / LDAP',
    row8: 'Resposta SLA', row8c: '— comunidade', row8t: '24 horas', row8e: '4 horas', row9: 'Preço anual'
  },
  gallery: {
    label: 'Galeria de componentes · primitivos', title: 'Como cada tema trata <em>primitivos UI</em>.',
    c_buttons: 'Botões', c_btngroup: 'Grupo de botões', c_form: 'Controlos de formulário',
    c_radio: 'Grupo radio', c_multi: 'Lista de seleção múltipla', c_dropdown: 'Lista pendente',
    c_alerts: 'Alertas', c_badges: 'Etiquetas', c_progress: 'Progresso',
    c_grid: 'Demo de grelha (12 col)', c_rtl: 'Pré-visualização RTL', c_table: 'Tabela às riscas',
    form_email: 'Endereço de e-mail', form_note: 'Notas',
    form_preload: 'Pré-carregar', form_async: 'Async',
    radio_sync: 'Sync (modo síncrono)', radio_async: 'Async (modo assíncrono)', radio_both: 'Ambos (pilha dupla, modelos partilhados)',
    alert_info:    '<b>Dica.</b> O backend SQLite vem incluído no pacote principal.',
    alert_success: '<b>Pronto.</b> <code>User.configure(...)</code> foi chamado.',
    alert_warn:    '<b>Atenção.</b> É necessário SQLite ≥ 3.25 para funções de janela.',
    prog_coverage: 'Cobertura de testes', prog_backend: 'Conclusão do backend', prog_locale: 'Localização da documentação',
    backend_note:  'Mesmo componente que a barra de controlo superior.',
    multi1_t: 'PostgreSQL', multi1_d: 'Produção principal',
    multi2_t: 'MySQL',      multi2_d: 'Serviços legados',
    multi3_t: 'SQLite',     multi3_d: 'Testes &amp; protótipos'
  },
  album: {
    label: 'Galeria · biblioteca', title: 'Aprender por <em>exemplos</em>.',
    a1: 'O seu primeiro modelo', a2: 'Async no FastAPI', a3: 'has_many em profundidade',
    a4: 'Escrever um backend', a5: 'Deteção automática de N+1', a6: 'Transações encaixadas &amp; savepoints'
  },
  voices: {
    label: 'Vozes · testemunhos', title: 'O que <em>dizem</em>.',
    q1: 'rhosocial-activerecord acabou com as lutas contra o ORM. As anotações de tipo são o modelo — exatamente certo.',
    q1_role: 'Backend Engineer · Quioto',
    q2: 'Sync e async partilham uma API, o refactoring é praticamente gratuito. Migrar o meu FastAPI foram duas linhas.',
    q2_role: 'Staff Engineer · Berlim',
    q3: 'Escrevi um backend DuckDB. Li o Backend ABC ao almoço, estava em produção à tarde. Isto é extensibilidade.',
    q3_role: 'Data Platform · Singapura',
    q4: 'Cada passo da cadeia tem o tipo inferido corretamente na IDE. Pydantic, usado da forma certa.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Zero dependências de runtime é a chave. Em embedded, deixámos de nos preocupar com o tamanho do SQLAlchemy.',
    q5_role: 'Engenheiro IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo de início de sessão', title: 'Iniciar sessão no <em>rhosocial</em>.',
    welcome: 'Bem-vindo de volta', sub: 'Continue com a sua conta rhosocial.',
    email: 'E-mail', password: 'Palavra-passe', remember: 'Lembrar-me', forgot: 'Esqueceu-se da palavra-passe?',
    login: 'Iniciar sessão', or: 'OU', github: 'Continuar com GitHub', twitter: 'Continuar com Twitter',
    no_account: 'Ainda sem conta?', register: 'Registar'
  },
  stats: {
    label: 'Em números', title: 'Alguns <em>números</em>.',
    s1: 'Dialectos de BD disponíveis', s2: 'Cobertura de anotações', s3: 'Python mínimo', s4: 'Dependências externas de ORM'
  },
  install: {
    label: 'Começar', title: 'Instalar numa linha, <em>dez minutos</em> para a primeira consulta.',
    sub: 'Publicado no PyPI. O backend SQLite vem no pacote principal; os outros instalam-se a pedido.',
    docs: 'Ler a documentação →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
