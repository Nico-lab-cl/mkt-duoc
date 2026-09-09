import {
  Vote,
  BookOpen,
  Megaphone,
  Users,
  Swords,
  ShieldAlert,
  Palette as PaletteIcon,
  Clapperboard,
  MapPin,
  Scale,
  UploadCloud
} from 'lucide-react';

/**
 * Briefing de campaña política — Stephany Valdez
 * Ruta pública: /formulario-campana-stephany-valdez
 *
 * Toma como base el cuestionario que se le envió a Lupe Negrete (accesos,
 * branding, contenido, aprobaciones, requisitos legales, competencia,
 * información electoral y geolocalización) y lo lleva un paso más allá: además
 * de recolectar material, busca el insight con el que después se arma la
 * estrategia. Por eso hay secciones que el original no traía —votantes y sus
 * objeciones, fortalezas y debilidades del contrincante, ataques esperados con
 * su respuesta, vulnerabilidades propias, capacidad real de grabar y
 * presupuesto de pauta—: sin eso el contenido se queda en folleto.
 *
 * Contexto electoral: Estados Unidos (precinto/distrito, early voting, ZIP
 * codes, comité que paga la pauta y disclaimer obligatorio), igual que Lupe.
 *
 * Los datos de contacto no se preguntan: viajan en el link y quedan guardados.
 *   /formulario-campana-stephany-valdez?nombre=Stephany%20Valdez&email=...&telefono=...
 */

export const SLUG = 'campana-stephany-valdez';
export const PUBLIC_PATH = '/formulario-campana-stephany-valdez';
export const DRAFT_KEY = 'briefing_campana_stephany_valdez';

/** Color con el que arranca el formulario, antes de que ella elija su paleta. */
export const BRAND_ACCENT = '#7C1D3F';

/**
 * Fotos de la candidata, servidas desde `public/`. El retrato va en la cabecera
 * y en la pantalla de agradecimiento; la de cuerpo entero acompaña la portada.
 * Para cambiarlas basta reemplazar los archivos con el mismo nombre.
 */
export const PORTRAIT = '/stephany-retrato.jpg';
export const HERO = '/stephany-completa.jpg';

export const FILE_CATEGORIES = [
  { id: 'identidad', label: 'Logo y colores', hint: 'Logo, manual de marca, tipografías' },
  { id: 'retratos', label: 'Fotos de Stephany', hint: 'Retrato formal y fotos actuales' },
  { id: 'comunidad', label: 'Terreno y comunidad', hint: 'Recorridos, vecinos, familia, trabajo' },
  { id: 'videos', label: 'Videos', hint: 'Cualquier video que ya tengan' },
  { id: 'documentos', label: 'Documentos y datos', hint: 'Propuestas, CV, mapas, listas de votantes' },
  { id: 'previo', label: 'Material previo', hint: 'Volantes, lonas, prensa, diseños anteriores' },
  { id: 'otros', label: 'Otros', hint: 'Lo que no calce en las anteriores' }
];

/**
 * Paletas pensadas para campaña. En Estados Unidos el color tiene lectura
 * partidaria, por eso la nota de cada una lo advierte: la elección de color no
 * es estética, comunica bando antes de que se lea una sola palabra.
 */
export const PALETTES = [
  {
    id: 'azul-civico',
    name: 'Azul cívico',
    colors: ['#0B2E59', '#2563EB', '#DCE9FB', '#FFFFFF'],
    note: 'Institucional y confiable. En EE.UU. se lee como demócrata.'
  },
  {
    id: 'rojo-decidido',
    name: 'Rojo decidido',
    colors: ['#8E1519', '#DC2626', '#FDE4E4', '#FFFFFF'],
    note: 'Fuerza y urgencia. En EE.UU. se lee como republicano.'
  },
  {
    id: 'tricolor',
    name: 'Azul, rojo y blanco',
    colors: ['#0A2A66', '#C8102E', '#F1F4F9', '#FFFFFF'],
    note: 'Patriótico y clásico. Sirve para una candidatura no partidista.'
  },
  {
    id: 'verde-comunidad',
    name: 'Verde comunidad',
    colors: ['#14532D', '#22C55E', '#E4F7E9', '#FFFFFF'],
    note: 'Renovación, parques y barrio. Sin carga de partido.'
  },
  {
    id: 'morado-renovacion',
    name: 'Morado renovación',
    colors: ['#4C1D95', '#A855F7', '#F1E9FE', '#FFFFFF'],
    note: 'Cambio y liderazgo femenino. Se distingue de todos los demás.'
  },
  {
    id: 'vino-dorado',
    name: 'Vino y dorado',
    colors: ['#7C1D3F', '#D4A017', '#FBF1DC', '#FFFFFF'],
    note: 'Cálida, con raíz latina y sensación de solidez.'
  },
  {
    id: 'teal-naranja',
    name: 'Turquesa y naranja',
    colors: ['#0F766E', '#F97316', '#FFEEDF', '#FFFFFF'],
    note: 'Cercana y con energía. Muy visible en el feed.'
  },
  {
    id: 'negro-amarillo',
    name: 'Negro y amarillo',
    colors: ['#111827', '#FACC15', '#FEF6D3', '#FFFFFF'],
    note: 'Máxima visibilidad en la calle: lonas, letreros y volantes.'
  },
  {
    id: 'propia',
    name: 'Ya tenemos nuestros colores',
    colors: ['#94A3B8', '#CBD5E1', '#E2E8F0', '#FFFFFF'],
    neutral: true,
    note: 'Los subo junto con el logo más adelante.'
  }
];

const PROBLEM_SUGGESTIONS = [
  'Calles y baches',
  'Alumbrado público',
  'Inundaciones y drenaje',
  'Inseguridad',
  'Basura y limpieza',
  'Falta de parques',
  'Agua potable',
  'Transporte público',
  'Vivienda cara',
  'Escuelas',
  'Falta de clínicas cercanas',
  'Empleo',
  'Trámites lentos en la ciudad',
  'Impuestos a la propiedad',
  'Perros callejeros',
  'Tráfico y velocidad en calles residenciales'
];

const OBJECTION_SUGGESTIONS = [
  'Todos los políticos son iguales',
  'No sirve de nada votar',
  'No la conozco',
  'Es muy joven',
  'No tiene experiencia',
  'Mi voto no cambia nada',
  'No tengo tiempo de ir a votar',
  'No sé dónde se vota',
  'Prefiero al otro candidato',
  'Prometen y nunca vuelven'
];

export const STEPS = [
  {
    id: 'candidata',
    title: 'La candidata y la elección',
    subtitle: 'Lo básico para abrir los perfiles y saber contra qué reloj corremos.',
    icon: Vote,
    fields: [
      {
        key: 'legal_name',
        label: 'Nombre legal completo, tal como aparece en la boleta',
        type: 'text',
        required: true
      },
      {
        key: 'public_name',
        label: 'Nombre público: ¿cómo quiere que la nombren?',
        type: 'text',
        required: true,
        help: 'El que va en redes, en los letreros y en los videos. Puede ser más corto que el legal.'
      },
      {
        key: 'handle',
        label: '¿Qué nombre de usuario quiere en redes?',
        type: 'text',
        placeholder: '@StephanyPara...',
        help: 'Buscamos que sea el mismo en Facebook, Instagram, TikTok y YouTube. Dénos una primera opción y una alternativa.'
      },
      {
        key: 'office',
        label: '¿A qué cargo postula?',
        type: 'radio',
        required: true,
        options: [
          'Concejo municipal (City Council)',
          'Alcaldía (Mayor)',
          'Junta escolar (School Board)',
          'Comisionado del condado',
          'Juez de paz o constable',
          'Cámara estatal',
          'Otro cargo'
        ]
      },
      { key: 'office_other', label: 'Si marcó "Otro cargo", ¿cuál es?', type: 'text' },
      {
        key: 'jurisdiction',
        label: '¿Cuál es el distrito, precinto o ciudad donde se vota?',
        type: 'text',
        required: true,
        placeholder: 'Ej: Precinto 4, Condado de ...'
      },
      {
        key: 'party',
        label: '¿Cómo se presenta?',
        type: 'radio',
        required: true,
        options: [
          'Partido Demócrata',
          'Partido Republicano',
          'Independiente',
          'No partidista (nonpartisan)',
          'Otro'
        ],
        help: 'Define el color, el tono y hasta a quién podemos mencionar en los videos.'
      },
      {
        key: 'incumbency',
        label: '¿Es la primera vez que postula?',
        type: 'radio',
        required: true,
        options: [
          'Sí, es la primera vez',
          'Ya postuló antes y no ganó',
          'Ya postuló antes y ganó',
          'Está en el cargo y busca la reelección'
        ]
      },
      {
        key: 'previous_result',
        label: 'Si ya postuló antes, ¿con cuántos votos quedó y qué cree que faltó?',
        type: 'textarea',
        rows: 3,
        help: 'Saber por cuántos votos se perdió cambia por completo dónde ponemos el dinero.'
      },
      { key: 'election_date', label: 'Fecha oficial de la elección', type: 'text', required: true },
      {
        key: 'early_voting',
        label: 'Fechas de votación temprana (early voting)',
        type: 'text',
        help: 'En muchas elecciones locales la mitad de los votos se emite antes del día oficial.'
      },
      { key: 'registration_deadline', label: 'Fecha límite para registrarse para votar', type: 'text' },
      {
        key: 'runoff',
        label: '¿Hay primaria o segunda vuelta (runoff)?',
        type: 'radio',
        options: ['Sí, hay primaria', 'Sí, puede haber runoff', 'No, es una sola elección', 'No estoy segura']
      },
      {
        key: 'languages',
        label: '¿En qué idiomas se va a comunicar la campaña?',
        type: 'checkbox',
        required: true,
        options: ['Español', 'Inglés', 'Ambos por igual']
      },
      {
        key: 'accounts_status',
        label: '¿Qué cuentas ya existen?',
        type: 'checkbox',
        required: true,
        options: [
          'Página de Facebook',
          'Instagram',
          'TikTok',
          'YouTube',
          'X (Twitter)',
          'WhatsApp de campaña',
          'Meta Business Suite',
          'Sitio web',
          'Todavía ninguna'
        ]
      },
      {
        key: 'accounts_links',
        label: 'Pegue los enlaces de las cuentas que ya existan',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'access_owner',
        label: '¿Quién tiene hoy las claves y los accesos?',
        type: 'text',
        help: 'Nombre y rol. Si fue alguien que ya no está en el equipo, avísenos ahora.'
      },
      {
        key: 'access_ready',
        label: '¿Nos puede dar acceso como administradores esta semana?',
        type: 'radio',
        required: true,
        options: [
          'Sí, sin problema',
          'Sí, pero necesito que me guíen paso a paso',
          'Todavía no, hay que recuperar accesos'
        ]
      }
    ]
  },
  {
    id: 'historia',
    title: 'Su historia y su porqué',
    subtitle: 'La gente vota a una persona antes que a un programa. Esto es lo que más se comparte.',
    icon: BookOpen,
    fields: [
      {
        key: 'bio',
        label: 'Cuéntenos su historia',
        type: 'textarea',
        required: true,
        rows: 6,
        help: 'Dónde nació, cómo llegó aquí, a qué se ha dedicado, qué le costó. Escriba sin ordenar, nosotros le damos forma.'
      },
      {
        key: 'roots',
        label: '¿Qué la conecta con este distrito?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Cuántos años lleva viviendo aquí, en qué calle, dónde estudian sus hijos, dónde trabaja, en qué iglesia o liga participa. Un candidato "de aquí" gana antes de hablar.'
      },
      {
        key: 'career',
        label: 'Trayectoria laboral, comunitaria y política',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Trabajos, negocios, juntas de vecinos, comités escolares, voluntariados, cargos anteriores.'
      },
      {
        key: 'why_running',
        label: '¿Por qué busca este cargo?',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'La razón real, no la de folleto. Si suena a discurso, la gente lo nota.'
      },
      {
        key: 'turning_point',
        label: '¿Hubo un momento concreto que la decidió a postular?',
        type: 'textarea',
        rows: 4,
        help: 'Un día, un lugar, una persona. Una historia real y fechada vale más que diez propuestas.'
      },
      {
        key: 'personal_facts',
        label: '¿Cuáles de estas la describen?',
        type: 'checkbox',
        options: [
          'Madre',
          'Migrante o hija de migrantes',
          'Primera generación en la universidad',
          'Dueña de un pequeño negocio',
          'Trabajadora de la salud',
          'Docente o trabajadora escolar',
          'Veterana o familiar de veterano',
          'Líder de iglesia',
          'Voluntaria comunitaria',
          'Trabajadora sindicalizada',
          'Cuida a un familiar mayor o enfermo',
          'Sobreviviente de algo que quiere contar'
        ],
        help: 'Cada una abre una puerta con un grupo distinto de votantes.'
      },
      {
        key: 'family_public',
        label: '¿Su familia va a aparecer en el contenido?',
        type: 'radio',
        required: true,
        options: [
          'Sí, sin problema',
          'Sí, pero solo mi pareja',
          'Sí, pero sin los niños',
          'No, prefiero mantenerla fuera'
        ]
      },
      {
        key: 'credentials',
        label: 'Reconocimientos, membresías y respaldos (endorsements) que ya tenga',
        type: 'textarea',
        rows: 4,
        help: 'Sindicatos, asociaciones, líderes, pastores, medios, otros electos. Y cuáles está gestionando.'
      }
    ]
  },
  {
    id: 'propuestas',
    title: 'Problemas y propuestas',
    subtitle: 'Lo que va a atacar, con evidencia. Aquí sale la mitad del contenido del año.',
    icon: Megaphone,
    fields: [
      {
        key: 'top_problems',
        label: 'Los problemas del distrito que quiere atacar, en orden de importancia',
        type: 'list',
        required: true,
        suggestions: PROBLEM_SUGGESTIONS,
        placeholder: 'Escriba un problema y presione Agregar',
        help: 'Agréguelos de a uno. El orden importa: el primero va a ser el eje de la campaña.'
      },
      {
        key: 'problem_evidence',
        label: 'Por cada problema, ¿qué caso concreto ha visto?',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Nombres de calles, colonias, fechas, nombres de vecinos dispuestos a hablar. Esto es lo que convierte una promesa en un video que la gente cree.'
      },
      {
        key: 'proposals',
        label: 'Sus propuestas prioritarias (máximo 5)',
        type: 'list',
        required: true,
        placeholder: 'Escriba una propuesta y presione Agregar',
        help: 'Con cinco alcanza. Más de cinco no se recuerda ninguna.'
      },
      {
        key: 'first_100',
        label: 'Si gana, ¿qué hace en los primeros 100 días?',
        type: 'textarea',
        rows: 4,
        help: 'Tres o cuatro acciones concretas. Sirve para cerrar la campaña con algo verificable.'
      },
      {
        key: 'measurable_promise',
        label: '¿Qué promesa concreta y medible está dispuesta a firmar?',
        type: 'textarea',
        rows: 3,
        help: 'Con número y plazo. Ej: "responder cada reporte de vecino en 72 horas". Una sola promesa medible pesa más que veinte generales.'
      },
      {
        key: 'no_promise',
        label: '¿Qué NO va a prometer, aunque se lo pidan?',
        type: 'textarea',
        rows: 3,
        help: 'Nos evita comprometerla por escrito con algo que después no se puede cumplir.'
      },
      {
        key: 'wins',
        label: '¿Qué ya logró antes?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Logros previos verificables, por chicos que parezcan: una colecta, un semáforo conseguido, un programa que organizó. Esto es lo que separa a una candidata de una promesa.'
      },
      {
        key: 'power_reality',
        label: 'El cargo al que postula, ¿tiene poder real sobre esos problemas?',
        type: 'radio',
        required: true,
        options: [
          'Sí, decide directamente',
          'En parte, hay que coordinar con otras autoridades',
          'Poco, pero puede presionar y fiscalizar',
          'No lo tengo claro'
        ],
        help: 'Preferimos saberlo ahora. Prometer lo que el cargo no puede cumplir es el error que más caro cobra el contrincante.'
      }
    ]
  },
  {
    id: 'votantes',
    title: 'A quién le habla',
    subtitle: 'Sin esto la pauta se gasta en gente que ni siquiera vota en su distrito.',
    icon: Users,
    fields: [
      {
        key: 'voter_segments',
        label: '¿Quiénes son sus votantes?',
        type: 'checkbox',
        required: true,
        options: [
          'Familias jóvenes',
          'Adultos mayores',
          'Madres',
          'Hombres trabajadores',
          'Dueños de negocios pequeños',
          'Docentes y personal escolar',
          'Trabajadores de la construcción',
          'Personal de salud',
          'Votantes de iglesia',
          'Latinos de primera generación',
          'Jóvenes de 18 a 29',
          'Empleados públicos',
          'Gente que nunca ha votado en una elección local'
        ]
      },
      {
        key: 'priority_segment',
        label: 'Si tuviera que ganar solo un grupo, ¿cuál sería?',
        type: 'text',
        required: true,
        help: 'Ese grupo se lleva la mitad del presupuesto. Elija uno.'
      },
      {
        key: 'voter_language',
        label: '¿En qué idioma prefieren informarse ellos?',
        type: 'radio',
        required: true,
        options: [
          'Sobre todo español',
          'Sobre todo inglés',
          'Mezcla de los dos',
          'Depende de la edad: mayores en español, jóvenes en inglés'
        ]
      },
      {
        key: 'where_they_are',
        label: '¿Dónde se enteran de las cosas?',
        type: 'checkbox',
        required: true,
        options: [
          'Facebook',
          'Grupos de Facebook del barrio',
          'WhatsApp',
          'Instagram',
          'TikTok',
          'YouTube',
          'Radio local en español',
          'Iglesia',
          'Volantes en la puerta',
          'Puerta a puerta',
          'Periódico local',
          'Nextdoor',
          'Boca a boca en la escuela'
        ]
      },
      {
        key: 'community_hubs',
        label: '¿En qué lugares concretos se junta la gente del distrito?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Iglesias, canchas, tiendas, escuelas, mercados, lavanderías, taquerías, paradas de bus. Con nombre y dirección: ahí grabamos y ahí se reparte.'
      },
      {
        key: 'voter_pain',
        label: 'Cuando conversa en la calle, ¿de qué se queja la gente primero?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Textual, con sus palabras. Esas frases se convierten en los titulares de los videos.'
      },
      {
        key: 'objections',
        label: '¿Qué le dicen cuando no la quieren apoyar?',
        type: 'list',
        required: true,
        suggestions: OBJECTION_SUGGESTIONS,
        placeholder: 'Escriba una objeción y presione Agregar',
        help: 'Cada objeción es un video. Si sabemos la excusa, escribimos la respuesta.'
      },
      {
        key: 'turnout_problem',
        label: '¿Cuál es su mayor problema con el voto?',
        type: 'radio',
        required: true,
        options: [
          'Que no la conocen',
          'Que la conocen pero no van a votar',
          'Que van a votar por otro',
          'Que ni siquiera saben que hay elección',
          'No lo tengo claro'
        ],
        help: 'La estrategia cambia por completo según cuál sea: no es lo mismo darse a conocer que arrastrar gente a la urna.'
      }
    ]
  },
  {
    id: 'competencia',
    title: 'La competencia y el entorno',
    subtitle: 'Contra quién compite, qué le van a decir y quién manda la conversación local.',
    icon: Swords,
    fields: [
      {
        key: 'opponents',
        label: '¿Quiénes son sus contrincantes?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Nombre y una línea de cada uno: qué hace, cuánto lleva, a quién representa.'
      },
      {
        key: 'opponent_links',
        label: 'Enlaces a sus perfiles y páginas oficiales',
        type: 'textarea',
        rows: 4,
        help: 'Facebook, Instagram, TikTok y sitio web de cada uno. Los seguimos para saber qué están diciendo.'
      },
      {
        key: 'opponent_strengths',
        label: '¿Qué hacen bien? ¿Por qué la gente los apoya?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Sea honesta. Si no sabemos por qué los prefieren, no podemos ofrecer algo mejor.'
      },
      {
        key: 'opponent_weaknesses',
        label: '¿Dónde están débiles?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Lo que prometieron y no cumplieron, lo que la gente les reclama, lo que no aparecen a resolver. Con hechos verificables, no rumores: publicamos solo lo que se puede probar.'
      },
      {
        key: 'opponent_money',
        label: '¿Tienen más recursos que ustedes?',
        type: 'radio',
        options: ['Mucho más', 'Algo más', 'Parecido', 'Nosotros tenemos más', 'No lo sé'],
        help: 'Si tienen mucho más, no competimos en volumen: competimos en cercanía y en territorio.'
      },
      {
        key: 'attack_expected',
        label: '¿Qué le van a atacar a usted?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Piense como ellos: qué usarían en su contra si quisieran hacerle daño.'
      },
      {
        key: 'attack_response',
        label: '¿Cómo quiere responder a cada uno de esos ataques?',
        type: 'textarea',
        rows: 4,
        help: 'Dejamos las respuestas grabadas antes de que pasen. Improvisar en medio de una crisis es lo que hunde campañas.'
      },
      {
        key: 'local_media',
        label: 'Medios y páginas locales que cubren esta elección',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'influencers',
        label: 'Líderes comunitarios, pastores, locutores o cuentas locales con influencia',
        type: 'textarea',
        rows: 3,
        help: 'Y díganos con cuáles ya tiene relación y con cuáles no.'
      },
      {
        key: 'content_references',
        label: 'Campañas o publicaciones que le gusten como referencia',
        type: 'textarea',
        rows: 3,
        help: 'Pegue links. Sirve tanto lo que le gusta como lo que le parece pésimo.'
      }
    ]
  },
  {
    id: 'riesgos',
    title: 'Temas sensibles y riesgos',
    subtitle: 'Lo que no se toca, y lo que la oposición podría usar en su contra.',
    icon: ShieldAlert,
    fields: [
      {
        key: 'avoid_topics',
        label: '¿Qué temas NO quiere abordar?',
        type: 'checkbox',
        options: [
          'Aborto',
          'Armas',
          'Inmigración',
          'Religión',
          'Política nacional o presidencial',
          'Partidos nacionales',
          'Temas LGBTQ+',
          'Vacunas y salud pública',
          'Ninguno, quiero poder hablar de todo'
        ]
      },
      { key: 'avoid_other', label: '¿Algún otro tema que prefiera evitar?', type: 'text' },
      {
        key: 'red_lines',
        label: '¿Qué es lo que jamás debe publicarse en su nombre?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Fotos, apellidos, direcciones, opiniones, personas. Esto queda como regla fija del equipo.'
      },
      {
        key: 'vulnerabilities',
        label: '¿Hay algo de su pasado que la oposición pueda usar en su contra?',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Dígalo ahora aunque incomode: deudas, un juicio, una multa, un negocio que cerró, una publicación vieja, un familiar con problemas. Todo lo público se encuentra. Si lo sabemos antes, preparamos la respuesta; si nos enteramos por un post del contrincante, ya es tarde. Esta respuesta la ve solo el equipo de campaña.'
      },
      {
        key: 'past_crisis',
        label: '¿Ha tenido alguna polémica o mala experiencia en redes?',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'tone_limits',
        label: '¿Qué tono NO quiere usar?',
        type: 'checkbox',
        options: [
          'Atacar por nombre al contrincante',
          'Ironía o burla',
          'Memes y humor',
          'Lenguaje religioso',
          'Mencionar partidos nacionales',
          'Bailes o trends de TikTok',
          'Ninguno, estoy abierta a todo'
        ]
      },
      {
        key: 'comment_policy',
        label: '¿Qué hacemos con los comentarios agresivos?',
        type: 'radio',
        required: true,
        options: [
          'Responder con calma siempre',
          'Responder solo si es una duda real',
          'Ocultar los insultos y seguir',
          'Bloquear a quien insulte',
          'Que el equipo decida caso a caso'
        ]
      }
    ]
  },
  {
    id: 'identidad',
    title: 'Identidad visual',
    subtitle: 'Los colores, el logo y las fotos con las que la van a reconocer.',
    icon: PaletteIcon,
    fields: [
      {
        key: 'palette',
        label: 'Elija la paleta cromática de la campaña',
        type: 'palette',
        required: true,
        help: 'Estos colores van a estar en todo: redes, letreros, volantes, camisetas y lonas. Al elegirla, este formulario se pinta con ella para que vea cómo se siente. Ojo: en EE.UU. el color comunica bando antes que las palabras.'
      },
      {
        key: 'style',
        label: '¿Cómo quiere que se vea el material con esos colores?',
        type: 'style-palette',
        required: true,
        options: [
          'Institucional y sobria: fondo blanco, poco color, se ve seria y confiable',
          'Cercana y humana: fotos grandes de ella con la gente, el color solo de apoyo',
          'De calle: letras enormes y alto contraste, se lee desde un auto en movimiento',
          'Moderna y limpia: mucho espacio, tipografía fuerte, se ve nueva y distinta'
        ]
      },
      {
        key: 'slogan_status',
        label: '¿Ya tiene un lema?',
        type: 'radio',
        required: true,
        options: ['Sí, ya está definido', 'Tengo ideas pero no lo decido', 'No, hay que crearlo']
      },
      {
        key: 'slogan',
        label: '¿Cuál es, o cuáles son las ideas?',
        type: 'text',
        placeholder: 'Ej: Nuestro barrio, nuestra voz'
      },
      {
        key: 'logo_status',
        label: '¿Tiene logo de campaña?',
        type: 'radio',
        required: true,
        options: ['Sí, con manual de marca', 'Sí, solo el logo', 'Lo están haciendo', 'No, hay que crearlo']
      },
      {
        key: 'identity_files',
        label: 'Adjunte aquí el logo, los colores y las tipografías que ya tenga',
        type: 'upload',
        category: 'identidad',
        help: 'Suba el archivo original si lo tiene (.ai, .eps, .svg, .psd). Si no, la imagen más grande que encuentre.'
      },
      {
        key: 'portrait_files',
        label: 'Adjunte fotos de Stephany',
        type: 'upload',
        category: 'retratos',
        help: 'Una foto formal para el perfil y al menos diez actuales: distintas ropas, buena luz, verticales, algunas mirando a la cámara y otras trabajando o conversando. Es el insumo que más se agota en una campaña.'
      },
      {
        key: 'photo_comfort',
        label: '¿Qué tan cómoda se siente frente a la cámara?',
        type: 'radio',
        required: true,
        options: [
          'Muy cómoda, hablo sin problema',
          'Normal, con un guion me sale bien',
          'Me cuesta, pero lo hago',
          'Prefiero voz en off y fotos'
        ],
        help: 'De esto depende el formato de casi todo el contenido. No hay respuesta mala.'
      },
      {
        key: 'dress_code',
        label: '¿Con qué colores o ropa quiere que se la vea siempre?',
        type: 'text',
        help: 'Repetir un color propio hace que la reconozcan sin leer el nombre.'
      },
      {
        key: 'visual_dislikes',
        label: '¿Algo que NO quiera ver en su material?',
        type: 'text',
        placeholder: 'Ej: fotos de bancos de imágenes, banderas de partido, filtros'
      }
    ]
  },
  {
    id: 'contenido',
    title: 'Voz, contenido y ritmo',
    subtitle: 'Cómo suena, qué está dispuesta a grabar y cada cuánto publicamos.',
    icon: Clapperboard,
    fields: [
      {
        key: 'voice',
        label: '¿Cómo quiere sonar?',
        type: 'checkbox',
        required: true,
        options: [
          'Cercana y directa',
          'Firme y decidida',
          'Maternal y protectora',
          'Técnica y bien informada',
          'Alegre y positiva',
          'Combativa',
          'Espiritual',
          'Humilde, de trabajo'
        ],
        help: 'Marque dos o tres. Diez tonos distintos es no tener ninguno.'
      },
      {
        key: 'talk_style',
        label: '¿Cómo habla usted naturalmente?',
        type: 'radio',
        options: [
          'Español neutro',
          'Español con modismos locales',
          'Spanglish',
          'Cambio según con quién esté hablando'
        ],
        help: 'Escribimos los guiones con sus palabras, no con las nuestras.'
      },
      {
        key: 'formats',
        label: '¿Qué formatos está dispuesta a grabar?',
        type: 'checkbox',
        required: true,
        options: [
          'Videos a cámara hablando (30 a 60 segundos)',
          'Videos caminando por la calle',
          'Videos en vivo (Facebook / Instagram Live)',
          'Videos con vecinos contando su caso',
          'Solo fotos con texto',
          'Audios para WhatsApp',
          'Entrevistas con medios locales'
        ]
      },
      {
        key: 'recording_capacity',
        label: '¿Cuántos videos puede grabar por semana?',
        type: 'radio',
        required: true,
        options: ['1', '2 o 3', '4 a 6', 'Todos los días', 'Depende de la semana'],
        help: 'Nosotros escribimos el guion, editamos, diseñamos y publicamos. De su parte solo necesitamos que grabe siguiendo las indicaciones y nos mande el material original.'
      },
      {
        key: 'who_records',
        label: '¿Quién graba?',
        type: 'radio',
        options: [
          'Ella misma con el teléfono',
          'Alguien del equipo',
          'Un camarógrafo contratado',
          'Todavía no lo definimos'
        ]
      },
      {
        key: 'posting_freq',
        label: '¿Con qué frecuencia quiere publicar?',
        type: 'radio',
        required: true,
        options: ['Todos los días', '4 o 5 veces por semana', '3 veces por semana', 'Lo que aguante el presupuesto']
      },
      {
        key: 'content_pillars',
        label: '¿De qué quiere que hablemos?',
        type: 'checkbox',
        required: true,
        options: [
          'Propuestas',
          'Su historia personal',
          'Problemas del distrito con evidencia',
          'Testimonios de vecinos',
          'Eventos y recorridos',
          'Cómo, cuándo y dónde votar',
          'Respuesta a ataques',
          'Logros previos',
          'Vida cotidiana y familia',
          'Agradecimientos y equipo de voluntarios'
        ]
      },
      {
        key: 'events',
        label: '¿Qué eventos o recorridos tiene agendados?',
        type: 'textarea',
        rows: 4,
        help: 'Fecha, hora y lugar. Un evento avisado con tiempo rinde tres semanas de contenido; avisado el mismo día, ninguna.'
      },
      {
        key: 'calendar_owner',
        label: '¿Quién nos avisa de los eventos y con cuánta anticipación?',
        type: 'text'
      }
    ]
  },
  {
    id: 'territorio',
    title: 'Territorio, votación y pauta',
    subtitle: 'Dónde se pone el dinero y a quién se le habla en cada zona.',
    icon: MapPin,
    fields: [
      {
        key: 'zips_include',
        label: 'Códigos postales (ZIP) que SÍ deben recibir la publicidad',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Sepárelos por coma. Con esto la pauta se limita a quienes pueden votar por usted.'
      },
      {
        key: 'zips_exclude',
        label: 'Códigos postales, colonias o zonas que hay que EXCLUIR',
        type: 'textarea',
        rows: 3,
        help: 'Todo lo que quede fuera del distrito es dinero perdido.'
      },
      {
        key: 'strong_areas',
        label: 'Zonas donde ya la conocen y la respaldan',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Ahí no gastamos en presentarla: ahí empujamos para que vayan a votar.'
      },
      {
        key: 'weak_areas',
        label: 'Zonas donde hay más molestia o donde no la conocen',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Ahí va el contenido de presentación y el que responde reclamos.'
      },
      {
        key: 'precincts',
        label: 'Lista o mapa de los precincts / secciones dentro del distrito',
        type: 'textarea',
        rows: 3,
        help: 'Si tiene el mapa en archivo, súbalo en la última sección.'
      },
      {
        key: 'polling_places',
        label: 'Lugares oficiales de votación y de votación temprana',
        type: 'textarea',
        rows: 4,
        help: 'Con dirección. Publicamos recordatorios geolocalizados cerca de cada uno.'
      },
      {
        key: 'voter_id',
        label: 'Requisitos de identificación para votar en su estado',
        type: 'textarea',
        rows: 3,
        help: 'Muchos no votan solo porque creen que no pueden. Aclararlo suma votos reales.'
      },
      {
        key: 'official_links',
        label: 'Enlaces oficiales que podamos incluir en las publicaciones',
        type: 'textarea',
        rows: 3,
        help: 'Registro de votantes, dónde votar, sitio del condado, calendario electoral.'
      },
      {
        key: 'voter_file',
        label: '¿Tienen la lista de votantes (voter file) del distrito?',
        type: 'radio',
        required: true,
        options: [
          'Sí, ya la tenemos',
          'La estamos consiguiendo',
          'No, no sabemos cómo se pide',
          'No sé qué es eso'
        ],
        help: 'Es la lista pública de quienes están registrados para votar. Con ella podemos mostrar los anuncios solo a esas personas: baja mucho el costo y sube el resultado.'
      },
      {
        key: 'ad_budget',
        label: '¿Cuánto puede invertir en publicidad al mes?',
        type: 'radio',
        required: true,
        options: [
          'Menos de $300',
          'Entre $300 y $800',
          'Entre $800 y $2.000',
          'Entre $2.000 y $5.000',
          'Más de $5.000',
          'Todavía no lo definimos'
        ],
        help: 'No hay monto malo. Con el monto real decidimos si se pelea todo el distrito o solo las zonas que deciden la elección.'
      },
      {
        key: 'budget_priority',
        label: 'Si el presupuesto alcanzara para una sola cosa, ¿qué prefiere?',
        type: 'radio',
        required: true,
        options: [
          'Que la conozcan (alcance)',
          'Juntar contactos: WhatsApp y teléfonos',
          'Que la gente efectivamente vaya a votar',
          'Responder a los ataques del contrincante'
        ]
      }
    ]
  },
  {
    id: 'equipo',
    title: 'Equipo, legal y aprobaciones',
    subtitle: 'Quién firma, quién aprueba y qué exige la ley en la publicidad.',
    icon: Scale,
    fields: [
      {
        key: 'committee_name',
        label: 'Nombre del comité de campaña o del responsable que paga la publicidad',
        type: 'text',
        required: true
      },
      {
        key: 'treasurer',
        label: 'Nombre y datos del tesorero o responsable de campaña',
        type: 'text',
        required: true
      },
      {
        key: 'disclaimer',
        label: 'Leyenda legal obligatoria que debe ir en la publicidad (disclaimer)',
        type: 'text',
        required: true,
        placeholder: 'Pol. Adv. Paid for by ...',
        help: 'Va en piezas y anuncios pagados. Escríbala tal cual debe aparecer: si está mal, Meta rechaza los anuncios.'
      },
      {
        key: 'ad_account_status',
        label: '¿Ya tienen la cuenta publicitaria autorizada para anuncios políticos en Meta?',
        type: 'radio',
        required: true,
        options: ['Sí, ya está autorizada', 'En proceso', 'No, hay que hacerlo', 'No sé qué es'],
        help: 'Para anuncios electorales Meta exige verificar identidad y domicilio del responsable. El trámite toma días y sin él no se puede pautar nada. Conviene iniciarlo esta semana.'
      },
      {
        key: 'approver',
        label: '¿Quién aprueba los textos, diseños y videos?',
        type: 'text',
        required: true,
        help: 'Una sola persona. Dos aprobadores es no tener ninguno.'
      },
      {
        key: 'approval_time',
        label: '¿En cuánto tiempo puede aprobar?',
        type: 'radio',
        required: true,
        options: ['El mismo día', 'En 24 horas', 'En 2 o 3 días', 'Depende de la semana'],
        help: 'En campaña una aprobación lenta mata la oportunidad: la noticia pasa y el contenido ya no sirve.'
      },
      {
        key: 'dm_owner',
        label: '¿Quién responde los mensajes de redes y WhatsApp?',
        type: 'text',
        required: true,
        help: 'Nombre y horario. Un mensaje sin responder en una campaña es un voto que se va.'
      },
      { key: 'whatsapp', label: 'Número de WhatsApp público de la campaña', type: 'text' },
      {
        key: 'volunteers',
        label: '¿Cuántos voluntarios activos tienen hoy?',
        type: 'radio',
        options: ['Ninguno todavía', 'Entre 1 y 5', 'Entre 6 y 15', 'Más de 15']
      },
      {
        key: 'donations',
        label: '¿Va a recibir donaciones por internet?',
        type: 'radio',
        options: ['Sí, ya tenemos el link', 'Sí, hay que crearlo', 'No']
      },
      { key: 'donation_link', label: 'Si ya lo tiene, pegue el link', type: 'text' },
      {
        key: 'authorizations',
        label: 'Confirme qué está autorizado a publicarse',
        type: 'checkbox',
        required: true,
        options: [
          'Fotos de la candidata',
          'Fotos de su pareja',
          'Fotos de sus hijos',
          'Fotos con su familia extendida',
          'Testimonios de vecinos con nombre y cara',
          'Fotos dentro de la iglesia',
          'Fotos en su lugar de trabajo',
          'Su número de teléfono personal'
        ],
        help: 'Marque solo lo que tenga autorización real. De los vecinos que aparezcan necesitamos su permiso por escrito.'
      },
      {
        key: 'legal_reviewer',
        label: '¿Hay abogado o asesor legal que deba revisar la publicidad?',
        type: 'text'
      }
    ]
  },
  {
    id: 'material',
    title: 'Material',
    subtitle: 'Suba todo lo que tenga. Puede arrastrar muchos archivos o una carpeta completa.',
    icon: UploadCloud,
    fields: [
      { key: 'files', type: 'files' },
      {
        key: 'files_pending',
        label: '¿Hay material que no pudo subir? Díganos dónde está',
        type: 'text',
        placeholder: 'Un link de Drive, o "lo envío por WhatsApp"'
      },
      {
        key: 'final_comments',
        label: '¿Algo más que quiera decirnos?',
        type: 'textarea',
        rows: 4,
        help: 'Cualquier cosa que no haya cabido en las preguntas anteriores.'
      }
    ]
  }
];

export const CONFIG = {
  slug: SLUG,
  draftKey: DRAFT_KEY,
  subjectKey: 'public_name',
  steps: STEPS,
  palettes: PALETTES,
  fileCategories: FILE_CATEGORIES,
  brand: {
    accent: BRAND_ACCENT,
    icon: Vote,
    portrait: PORTRAIT,
    hero: HERO,
    portraitAlt: 'Stephany Valdez, candidata',
    eyebrow: 'Campaña Stephany Valdez · Redes sociales',
    title: (contact) =>
      contact.name ? `Cuestionario de campaña para ${contact.name}` : 'Cuestionario para iniciar su campaña',
    intro:
      'Son 11 secciones y la mayoría se responde marcando opciones. Toma unos 25 minutos y no hace falta terminarlo de una vez: lo que responda queda guardado y puede volver después. Con esto abrimos los perfiles oficiales, definimos su imagen y armamos el plan de contenido, videos y pauta del distrito. De su parte solo necesitamos que después grabe los videos siguiendo las indicaciones que le enviemos.',
    successTitle: 'Listo, recibimos todo',
    successText:
      'Gracias, Stephany. Con esto ya podemos abrir los perfiles, proponerle la línea gráfica y armar el primer calendario de contenido. Le escribimos en los próximos días con la propuesta.'
  }
};

export default CONFIG;
