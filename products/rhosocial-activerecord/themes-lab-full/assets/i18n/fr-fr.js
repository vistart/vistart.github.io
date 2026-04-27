/**
 * i18n · fr-fr · Français
 */
window.I18N = window.I18N || {};
window.I18N['fr-fr'] = {
  meta: { name: 'Français' },
  control: { theme_label: 'Thème', font_label: 'Police', lang_label: 'Langue', font_auto: 'Auto (par défaut du thème)' },
  brand: { subtitle: 'Theme Lab' },
  hero: {
    eyebrow: 'v1.0 · Apache 2.0 · Pure Python',
    title:   'rhosocial ActiveRecord,<br>repensé pour <em>Python</em>.',
    sub:     '<strong>rhosocial-activerecord</strong> définit les modèles avec les annotations de type natives de Python et les interroge via un enchaînement <code>query().where(...).all()</code>. Synchrone et asynchrone dès le départ. Aucune dépendance ORM externe — SQLite est intégré, les autres bases de données sont des paquets séparés, et vous pouvez écrire votre propre backend en quelques dizaines de lignes.',
    cta_secondary: 'Voir les fonctionnalités →'
  },
  features: {
    label: 'Pourquoi · six promesses',
    title: 'Pourquoi <em>rhosocial ActiveRecord</em>.',
    f1: { num: '01 / Type = champ',           title: '<em>Typé</em> par construction',                 desc: 'Un champ, c\'est <code>name: str</code> — stockage, validation et auto-complétion IDE réunis.' },
    f2: { num: '02 / Async en premier',       title: 'Sync &amp; async, <em>une seule API</em>',       desc: '<code>ActiveRecord</code> / <code>AsyncActiveRecord</code>, forme identique.' },
    f3: { num: '03 / Backends enfichables',   title: 'Backends <em>modulaires</em>',                   desc: 'SQLite inclus ; Postgres/MySQL/MSSQL/Oracle en paquets séparés ; ou le vôtre.' },
    f4: { num: '04 / Relations explicites',   title: 'Des <em>relations</em> explicites',              desc: 'has_many / belongs_to déclarés sur le modèle ; les relations sont elles-mêmes des <code>QuerySet</code>.' },
    f5: { num: '05 / Transactions atomiques', title: 'Transactions <em>correctement imbriquées</em>',  desc: 'Gestionnaire de contexte + savepoints ; rollback propre sur exception.' },
    f6: { num: '06 / Pythonique',             title: 'Se lit comme de l\'<em>anglais</em>',            desc: '<code>User.query().where(...).all()</code> — pas de DSL, juste Python.' }
  },
  practice: {
    label: 'En pratique · code réel',
    title: 'De 3.8 à 3.12, <em>une étape à la fois</em>.',
    intro: 'Correspond aux fixtures <code>models_py38.py</code> … <code>models_py312.py</code> du dépôt testsuite.',
    p1: '<b>3.8 → 3.9</b> : <code>list[str]</code> remplace <code>List[str]</code> (PEP 585).',
    p2: '<b>3.9 → 3.10</b> : <code>int | None</code> remplace <code>Optional[int]</code> (PEP 604).',
    p3: '<b>3.10 → 3.11</b> : le type <code>Self</code> (PEP 673).',
    p4: '<b>3.11 → 3.12</b> : <code>@override</code> et les génériques PEP 695 <code>class Result[T]:</code>.'
  },
  split_sync:    { label: 'Côte à côte', title: 'Sync = async, <em>même sémantique</em>.', intro: 'Remplacez <code>for</code> par <code>async for</code> et c\'est tout. L\'inférence de types parcourt toute la chaîne.', cta: 'Lire le guide async →' },
  split_backend: { label: 'Liberté de backend', title: 'Votre propre <em>backend</em>, en quelques dizaines de lignes.', intro: 'Héritez de <code>Backend</code>, implémentez quelques crochets de dialecte. DuckDB et libSQL ont déjà fait leurs preuves.', cta: 'Guide de dev backend →' },
  pricing: {
    label: 'Plans · illustratif', title: 'Choisissez votre <em>niveau</em>.',
    intro: '(Cartes exemples — le projet OSS reste gratuit à vie. Ici pour prévisualiser les cartes de pricing sur chaque thème.)',
    badge: 'Most Popular',
    c1: { tier: 'Community',  desc: 'Développeurs solo et contributeurs OSS. Fonctionnalités complètes, sans limite.',
          f1: 'SQLite / PostgreSQL / MySQL', f2: 'API sync &amp; async complète', f3: 'Support via forum communautaire',
          f4: 'Tableau de bord d\'équipe', f5: 'Garantie SLA de réponse', cta: 'Commencer' },
    c2: { tier: 'Team',       desc: 'Équipes en croissance. Backends entreprise plus audit.',
          f1: 'Tout Community', f2: 'Backends MSSQL / Oracle', f3: 'Journal d\'audit &amp; lecture/écriture séparées',
          f4: 'Support Discord privé prioritaire', f5: 'SSO / SAML', cta: 'Essai 14 jours' },
    c3: { tier: 'Enterprise', desc: 'Grandes organisations. On-prem, conformité, formation.', price_label: 'Nous contacter',
          f1: 'Tout Team', f2: 'Backends sur mesure (DuckDB / libSQL / interne)', f3: 'SSO / SAML / LDAP',
          f4: 'SLA 4 heures', f5: 'Formations sur site et solutions dédiées', cta: 'Contacter les ventes' }
  },
  compare: {
    label: 'Comparer', title: 'Comparé aux autres ORMs Python.', col_feature: 'Fonctionnalité',
    row1: 'Motif de conception', row1r: 'ActiveRecord', row1sa: 'Data Mapper', row1dj: 'ActiveRecord', row1sm: 'Hybrid', row1pw: 'ActiveRecord', row1to: 'ActiveRecord',
    row2: 'Backend utilisable indépendamment',
    row3: 'Pas de concept de session',
    row4: 'API sync / async cohérente',
    row5: 'Intégration Pydantic native',
    row6: 'Validation des données à l\'exécution',
    row7: 'Expressivité SQL complète',
    row8: 'Déclaration de capacités',
    row9: 'Transparence SQL <code>.to_sql()</code>',
    row10: 'Pas d\'outil de migration forcé',
    row11: 'Dépendances minimales',
    row12: 'Définition de relations explicite'
  },
  gallery: {
    label: 'Galerie de composants · primitives', title: 'Comment chaque thème gère les <em>primitives UI</em>.',
    c_buttons: 'Boutons', c_btngroup: 'Groupe de boutons', c_form: 'Contrôles de formulaire',
    c_radio: 'Groupe radio', c_multi: 'Sélection multiple', c_dropdown: 'Liste déroulante',
    c_alerts: 'Alertes', c_badges: 'Badges', c_progress: 'Progression',
    c_grid: 'Démo grille (12 col)', c_rtl: 'Aperçu RTL', c_table: 'Tableau rayé',
    form_email: 'Adresse e-mail', form_note: 'Notes',
    form_preload: 'Précharger', form_async: 'Async',
    radio_sync: 'Sync (mode synchrone)', radio_async: 'Async (mode asynchrone)', radio_both: 'Les deux (double pile, modèles partagés)',
    alert_info:    '<b>Astuce.</b> Le backend SQLite est inclus avec le paquet principal.',
    alert_success: '<b>Prêt.</b> <code>User.configure(...)</code> a été appelé.',
    alert_warn:    '<b>Attention.</b> SQLite ≥ 3.25 est requis pour les fonctions de fenêtrage.',
    prog_coverage: 'Couverture des tests', prog_backend: 'Avancement backend', prog_locale: 'Localisation de la doc',
    backend_note:  'Même composant que la barre de contrôle supérieure.',
    multi1_t: 'PostgreSQL', multi1_d: 'Production principale',
    multi2_t: 'MySQL',      multi2_d: 'Services hérités',
    multi3_t: 'SQLite',     multi3_d: 'Tests &amp; prototypes'
  },
  album: {
    label: 'Galerie · bibliothèque', title: 'Apprendre par l\'<em>exemple</em>.',
    a1: 'Votre premier modèle', a2: 'Async dans FastAPI', a3: 'has_many en profondeur',
    a4: 'Écrire un backend', a5: 'Détection auto des N+1', a6: 'Transactions imbriquées &amp; savepoints'
  },
  voices: {
    label: 'Voix · témoignages', title: 'Ce qu\'<em>ils disent</em>.',
    q1: 'rhosocial-activerecord m\'a enfin évité de me battre avec un ORM. Les annotations de type sont le modèle — exactement juste.',
    q1_role: 'Ingénieur Backend · Kyoto',
    q2: 'Sync et async partagent une seule API, le refactoring est quasi gratuit. Migrer mon projet FastAPI : deux lignes.',
    q2_role: 'Staff Engineer · Berlin',
    q3: 'J\'ai écrit un backend DuckDB. Lu le Backend ABC à midi, en production l\'après-midi. Voilà l\'extensibilité.',
    q3_role: 'Data Platform · Singapour',
    q4: 'Chaque étape de la chaîne fluide a le bon type inféré dans mon IDE. Pydantic, utilisé à bon escient.',
    q4_role: 'Senior Python · São Paulo',
    q5: 'Zéro dépendance runtime, c\'est la clé. Pour l\'embarqué, on ne s\'inquiète plus de la taille de SQLAlchemy.',
    q5_role: 'Ingénieur IoT · Shenzhen'
  },
  auth: {
    label: 'Auth · démo de connexion', title: 'Se connecter à <em>rhosocial</em>.',
    welcome: 'Bon retour', sub: 'Continuer avec votre compte rhosocial.',
    email: 'E-mail', password: 'Mot de passe', remember: 'Se souvenir de moi', forgot: 'Mot de passe oublié ?',
    login: 'Se connecter', or: 'OU', github: 'Continuer avec GitHub', twitter: 'Continuer avec Twitter',
    no_account: 'Pas encore de compte ?', register: 'S\'inscrire'
  },
  stats: {
    label: 'En chiffres', title: 'Quelques <em>chiffres</em>.',
    s1: 'Dialectes de BDD disponibles', s2: 'Couverture des annotations', s3: 'Python minimum', s4: 'Dépendances ORM externes'
  },
  install: {
    label: 'Démarrer', title: 'Installation en une ligne, <em>dix minutes</em> pour la première requête.',
    sub: 'Publié sur PyPI. Le backend SQLite est inclus ; les autres s\'installent à la demande.',
    docs: 'Lire la doc →'
  },
  footer: {
    hotkeys: '23 themes × 24 font packs · <span class="kbd">Ctrl</span>+<span class="kbd">letter</span> theme / <span class="kbd">Shift</span>+<span class="kbd">letter</span> font / <span class="kbd">Alt</span>+<span class="kbd">letter</span> language'
  }
};
