/**
 * i18n · es-es · Español
 */
window.I18N = window.I18N || {};
window.I18N['es-es'] = {
  meta: { name: 'Español' },
  control: { theme_label: 'Tema', font_label: 'Fuente', lang_label: 'Idioma', font_auto: 'Automático (por defecto del tema)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>rediseñado para <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> define modelos con anotaciones de tipo nativas de Python y los consulta con una cadena <code>query().where(...).all()</code>. Síncrono y asíncrono desde el primer día. Sin dependencias externas de ORM — SQLite viene integrado, otras bases de datos se distribuyen como paquetes separados, y puedes escribir tu propio backend en unas pocas decenas de líneas.',
    cta_secondary: 'Ver características →'
  },
  features: {
    label: 'Por qué · seis promesas fundamentales',
    title: 'Por qué <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Tipo = campo',             title: '<em>Tipo-seguro</em> por construcción',        desc: 'Un campo es simplemente <code>name: str</code> — almacenamiento, validación y autocompletado IDE en uno.' },
    f2: { num: '02 / Async de primera clase',   title: 'Sync y async, <em>una sola API</em>',           desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, con forma idéntica.' },
    f3: { num: '03 / Backends intercambiables', title: 'Backends <em>intercambiables</em>',             desc: 'SQLite integrado; Postgres/MySQL/MSSQL/Oracle como paquetes separados; o escribe el tuyo.' },
    f4: { num: '04 / Relaciones explícitas',    title: '<em>Relaciones</em> hechas explícitas',         desc: 'has_many / belongs_to declaradas en el modelo; las relaciones son <code>QuerySet</code>.' },
    f5: { num: '05 / Transacciones atómicas',   title: 'Transacciones <em>correctamente anidadas</em>', desc: 'Gestor de contexto + savepoints; las excepciones hacen rollback limpio.' },
    f6: { num: '06 / Pythonic',                 title: 'Se lee como <em>inglés</em>',                   desc: '<code>User.query().where(...).all()</code> — sin DSL, solo Python.' }
  },
  practice: {
    label: 'En la práctica · código real',
    title: 'De 3.8 a 3.12, <em>paso a paso</em>.',
    intro: 'Corresponde a las fixtures <code>models_py38.py</code> … <code>models_py312.py</code> del repositorio testsuite.',
    p1: '<b>3.8 → 3.9</b>: <code>list[str]</code> sustituye a <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b>: <code>int | None</code> sustituye a <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b>: el tipo <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b>: <code>@override</code> y genéricos PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Lado a lado', title: 'Sync = async, <em>misma semántica</em>.', intro: 'Cambia <code>for</code> por <code>async for</code> y listo. La inferencia de tipos recorre toda la cadena.', cta: 'Leer la guía async →' },
  split_backend: { label: 'Libertad de backend', title: 'Escribe tu propio <em>backend</em> en una tarde.', intro: 'Hereda de <code>Backend</code>, implementa unos cuantos ganchos de dialecto. DuckDB y libSQL ya están probados.', cta: 'Guía de desarrollador de backend →' },
  pricing: {
    label: 'Planes · ilustrativos', title: 'Elige tu <em>nivel</em>.',
    intro: '(Tarjetas de ejemplo — el proyecto OSS es gratuito para siempre. Aquí para previsualizar las tarjetas de pricing en cada tema.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Desarrolladores individuales y contribuidores OSS. Funcionalidad completa, sin límites.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync y async completa', f3: 'Soporte en foro de la comunidad',
          f4: 'Panel de colaboración en equipo', f5: 'Garantía de respuesta SLA', cta: 'Empezar' },
    c2: { tier: 'Team',       desc: 'Equipos en crecimiento. Backends empresariales más auditoría.',
          f1: 'Todo lo de Community', f2: 'Backends MSSQL / Oracle', f3: 'Registro de auditoría y separación lectura/escritura',
          f4: 'Discord privado con prioridad', f5: 'SSO / SAML', cta: 'Prueba de 14 días' },
    c3: { tier: 'Enterprise', desc: 'Grandes organizaciones. On-prem, cumplimiento, formación.', price_label: 'Contactar',
          f1: 'Todo lo de Team', f2: 'Backends a medida (DuckDB / libSQL / internos)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA de 4 horas', f5: 'Formación in situ y soluciones dedicadas', cta: 'Contactar ventas' }
  },
  compare: {
    label: 'Comparar', title: 'Comparación de <em>funciones</em>.', col_feature: 'Función',
    row1: 'SQLite / Postgres / MySQL', row2: 'Backends MSSQL / Oracle', row3: 'Backends a medida',
    row4: 'API sync / async completa', row5: 'Registro de auditoría', row6: 'Separación lectura/escritura', row7: 'SSO / SAML / LDAP',
    row8: 'Respuesta SLA', row8c: '— comunidad', row8t: '24 horas', row8e: '4 horas', row9: 'Precio anual'
  },
  gallery: {
    label: 'Galería de componentes · primitivas', title: 'Cómo cada tema trata las <em>primitivas UI</em>.',
    c_buttons: 'Botones', c_btngroup: 'Grupo de botones', c_form: 'Controles de formulario',
    c_radio: 'Grupo radio', c_multi: 'Lista de selección múltiple', c_dropdown: 'Lista desplegable',
    c_alerts: 'Alertas', c_badges: 'Etiquetas', c_progress: 'Progreso',
    c_grid: 'Demo de rejilla (12 col)', c_rtl: 'Vista previa RTL', c_table: 'Tabla con rayas',
    form_email: 'Correo electrónico', form_note: 'Notas',
    form_preload: 'Precargar', form_async: 'Async',
    radio_sync: 'Sync (modo síncrono)', radio_async: 'Async (modo asíncrono)', radio_both: 'Ambos (doble pila, modelos compartidos)',
    alert_info:    '<b>Consejo.</b> El backend SQLite viene incluido en el paquete principal.',
    alert_success: '<b>Listo.</b> <code>User.configure(...)</code> ha sido llamado.',
    alert_warn:    '<b>Atención.</b> Se requiere SQLite ≥ 3.25 para funciones de ventana.',
    prog_coverage: 'Cobertura de tests', prog_backend: 'Avance del backend', prog_locale: 'Localización de documentación',
    backend_note:  'Mismo componente que la barra de control superior.',
    multi1_t: 'PostgreSQL', multi1_d: 'Producción principal',
    multi2_t: 'MySQL',      multi2_d: 'Servicios heredados',
    multi3_t: 'SQLite',     multi3_d: 'Tests y prototipos'
  },
  album: {
    label: 'Galería · biblioteca', title: 'Aprender de los <em>ejemplos</em>.',
    a1: 'Tu primer modelo', a2: 'Async en FastAPI', a3: 'has_many a fondo',
    a4: 'Escribir un backend', a5: 'Detección automática de N+1', a6: 'Transacciones anidadas y savepoints'
  },
  voices: {
    label: 'Voces · testimonios', title: 'Lo que <em>dicen</em>.',
    q1: 'Con rhosocial-activerecord por fin dejé de pelear con un ORM. Las anotaciones de tipo son el modelo — exactamente correcto.',
    q1_role: 'Backend Engineer · Kyoto',
    q2: 'Sync y async comparten una API, el refactor casi no cuesta. Migrar mi FastAPI fueron dos líneas.',
    q2_role: 'Staff Engineer · Berlín',
    q3: 'Escribí un backend de DuckDB. Leí el Backend ABC durante el almuerzo, estaba en producción por la tarde. Esto sí es extensibilidad.',
    q3_role: 'Data Platform · Singapur',
    q4: 'Cada paso de la cadena tiene el tipo inferido correctamente en mi IDE. Pydantic, usado donde debe.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Cero dependencias en runtime es la clave. En despliegues embebidos ya no nos preocupa el tamaño de SQLAlchemy.',
    q5_role: 'Ingeniero IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · demo de inicio de sesión', title: 'Iniciar sesión en <em>rhosocial</em>.',
    welcome: 'Bienvenido de nuevo', sub: 'Continúa con tu cuenta de rhosocial.',
    email: 'Correo', password: 'Contraseña', remember: 'Recuérdame', forgot: '¿Olvidaste la contraseña?',
    login: 'Iniciar sesión', or: 'O', github: 'Continuar con GitHub', twitter: 'Continuar con Twitter',
    no_account: '¿Aún no tienes cuenta?', register: 'Registrarse'
  },
  stats: {
    label: 'En números', title: 'Algunos <em>números</em>.',
    s1: 'Dialectos de BD disponibles', s2: 'Cobertura de anotaciones', s3: 'Python mínimo', s4: 'Dependencias externas de ORM'
  },
  install: {
    label: 'Empezar', title: 'Instala en una línea, <em>diez minutos</em> hasta la primera consulta.',
    sub: 'Publicado en PyPI. El backend SQLite viene en el paquete principal; los demás se instalan bajo demanda.',
    docs: 'Leer la documentación →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
