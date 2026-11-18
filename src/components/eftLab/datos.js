/**
 * Contenido del Laboratorio EFT · Eje 1 (MKA1213 Inbound Marketing II).
 * Basado en la pauta oficial de la Evaluación Final Transversal:
 * caso «empresa líder en electrodomésticos» que lanza una línea Smart Home.
 * La pauta no le da nombre a la empresa: usamos la marca ficticia MARCA.
 */

export const MARCA = 'Hogara';

export const CASO = {
  contexto:
    'Una empresa líder en electrodomésticos lanza en Chile una nueva línea de productos inteligentes conectados (IoT): refrigerador con pantalla, horno inteligente, lavadora programable y enchufes y ampolletas para domótica.',
  problema: [
    'Desconfían o no conocen la domótica: no saben qué gana su casa con ella.',
    'Creen que los productos inteligentes son caros y difíciles de usar.',
    'No conocen el impacto en el ahorro de energía.'
  ],
  desafio:
    'Diseñar un ecosistema Inbound que eduque al consumidor con el Flywheel, posicione la solución en Google con Pillar y Cluster Pages, y capture leads con una landing y un lead magnet conectados a una automatización.'
};

export const EXAMEN = {
  ponderacion: '40 % de la nota final',
  partes: [
    { nombre: 'Informe escrito grupal', peso: '30 %', detalle: 'PDF o Word, hasta 8 páginas, 6 apartados + anexos, normas APA.' },
    { nombre: 'Video individual (elevator pitch)', peso: '70 %', detalle: 'MP4 de hasta 5 minutos, como si presentaras ante la gerencia.' }
  ]
};

// Indicadores del Eje 1 (25 % del examen)
export const INDICADORES = [
  {
    id: 'IE1.1.2',
    donde: 'Informe',
    peso: 2,
    texto: 'Clasifica al menos 5 tipos de contenido en las etapas del Flywheel orientados al buyer persona.',
    muyBien: 'Clasifica 5 o más formatos, cubre las tres etapas y explica por qué cada uno le sirve al buyer persona.',
    incipiente: 'Lista formatos sin etapa, o los ubica sin explicar para quién son.',
    estacion: 'flywheel'
  },
  {
    id: 'IE1.2.2',
    donde: 'Informe',
    peso: 3,
    texto: 'Justifica una pieza de contenido visual aplicando principios de diseño.',
    muyBien: 'Nombra los principios aplicados (contraste, jerarquía, alineación…) y muestra en la pieza dónde y para qué.',
    incipiente: '«Quedó bonita» o «usé colores llamativos», sin principios ni relación con el objetivo.',
    estacion: 'pieza'
  },
  {
    id: 'IE1.1.1',
    donde: 'Video',
    peso: 10,
    texto: 'Describe con claridad los formatos de contenido del Flywheel con ejemplos reales.',
    muyBien: 'Explica cada etapa con un ejemplo concreto del caso (tema, canal, a quién va dirigido).',
    incipiente: 'Define las etapas de memoria, sin ejemplos o con ejemplos genéricos.',
    estacion: 'flywheel'
  },
  {
    id: 'IE1.2.1',
    donde: 'Video',
    peso: 10,
    texto: 'Compara funciones, ventajas y limitaciones de herramientas de diseño digital para marketing.',
    muyBien: 'Compara al menos dos herramientas en funciones, ventajas y limitaciones, y dice cuál eligió y por qué.',
    incipiente: 'Menciona una sola herramienta o solo dice cuál le gusta más.',
    estacion: 'herramientas'
  }
];

export const ESCALA = [
  { id: 100, label: 'Muy buen desempeño', color: 'bg-emerald-600' },
  { id: 80, label: 'Buen desempeño', color: 'bg-emerald-400' },
  { id: 60, label: 'Desempeño aceptable', color: 'bg-amber-400' },
  { id: 30, label: 'Desempeño incipiente', color: 'bg-orange-500' },
  { id: 0, label: 'No logrado', color: 'bg-rose-600' }
];

export const PERSONAS = [
  {
    id: 'carolina',
    nombre: 'Carolina, 34',
    rol: 'Ingeniera, mamá de dos niños, vive en Viña del Mar',
    quiere: 'Ahorrar tiempo y controlar la casa desde el celular mientras trabaja.',
    objecion: '«No tengo tiempo para aprender a usar otra app.»',
    canales: 'Instagram, Google, grupos de WhatsApp del colegio',
    emoji: '👩‍💻'
  },
  {
    id: 'jorge',
    nombre: 'Don Jorge, 62',
    rol: 'Jubilado, vive con su señora en Quilpué',
    quiere: 'Bajar la cuenta de la luz y sentir que la casa es segura.',
    objecion: '«Eso es caro y seguro que es complicado.»',
    canales: 'Facebook, YouTube, recomendaciones de sus hijos',
    emoji: '👴'
  },
  {
    id: 'matias',
    nombre: 'Matías, 27',
    rol: 'Diseñador, arrienda su primer departamento en Valparaíso',
    quiere: 'Conectar todo con su asistente de voz y ver los consumos en gráficos.',
    objecion: '«¿Será compatible con Google Home o Alexa? ¿Vale lo que cuesta?»',
    canales: 'TikTok, YouTube, foros y reseñas',
    emoji: '🧑‍🎨'
  }
];

export const ETAPAS = [
  {
    id: 'atraer',
    nombre: 'Atraer',
    color: 'sky',
    meta: 'Que desconocidos lleguen a ti porque les resuelves una duda.',
    ejemplo: 'Contenido útil y gratuito: blog, redes, video, infografías.'
  },
  {
    id: 'interactuar',
    nombre: 'Interactuar',
    color: 'amber',
    meta: 'Convertir visitas en leads y acompañarlos hasta la compra.',
    ejemplo: 'Lead magnets a cambio de datos, webinars, emails, chatbot, calculadoras.'
  },
  {
    id: 'deleitar',
    nombre: 'Deleitar',
    color: 'emerald',
    meta: 'Que el cliente quede feliz, vuelva a comprar y te recomiende.',
    ejemplo: 'Onboarding, tutoriales de uso, comunidad, encuestas, referidos.'
  },
  {
    id: 'no',
    nombre: 'No es Inbound',
    color: 'rose',
    meta: 'Interrumpe o molesta: es outbound o mala práctica.',
    ejemplo: 'Llamadas en frío, bases compradas, spam.'
  }
];

/**
 * Formatos para clasificar. `etapa` es la respuesta principal; `tambien`
 * agrupa etapas aceptables con matiz. `ejemplo` es una idea concreta para
 * el caso, útil para IE1.1.1 («con ejemplos reales»).
 */
export const FORMATOS = [
  {
    id: 'blog',
    nombre: 'Artículo de blog SEO',
    ejemplo: '«¿Cuánta luz gasta un refrigerador inteligente? Comparamos con uno normal»',
    etapa: 'atraer',
    tambien: [],
    porque: 'Responde una búsqueda en Google de alguien que todavía no conoce la marca. Es la puerta de entrada (y la base del Eje 2: SEO).'
  },
  {
    id: 'reel',
    nombre: 'Reel / TikTok corto',
    ejemplo: '«3 cosas que tu lavadora hace sola mientras estás en la pega»',
    etapa: 'atraer',
    tambien: [],
    porque: 'Formato de descubrimiento: llega a personas que no te buscan y rompe el mito de que es complicado.'
  },
  {
    id: 'infografia',
    nombre: 'Infografía',
    ejemplo: '«Mito vs realidad: cuánto ahorras al año con enchufes inteligentes»',
    etapa: 'atraer',
    tambien: ['interactuar'],
    porque: 'Se comparte fácil en redes y atrae. También sirve en Interactuar si se usa dentro de un email de nutrición.'
  },
  {
    id: 'mito',
    nombre: 'Carrusel de Instagram',
    ejemplo: '«5 mitos de la domótica que te están haciendo pagar de más»',
    etapa: 'atraer',
    tambien: [],
    porque: 'Educa y genera alcance orgánico; ataca directamente la desconfianza del público.'
  },
  {
    id: 'ebook',
    nombre: 'Ebook / guía descargable',
    ejemplo: '«Guía para armar tu casa inteligente con menos de $300.000»',
    etapa: 'interactuar',
    tambien: [],
    porque: 'Es el lead magnet clásico: se entrega a cambio del email en la landing. Convierte una visita en lead.'
  },
  {
    id: 'calculadora',
    nombre: 'Calculadora de ahorro',
    ejemplo: '«Ingresa tu cuenta de luz y te decimos cuánto ahorrarías con Hogara»',
    etapa: 'interactuar',
    tambien: [],
    porque: 'Herramienta interactiva que pide datos para mostrar el resultado: genera leads calificados y responde la objeción del precio.'
  },
  {
    id: 'webinar',
    nombre: 'Webinar en vivo',
    ejemplo: '«Domótica sin miedo: configura tu casa en 20 minutos»',
    etapa: 'interactuar',
    tambien: ['deleitar'],
    porque: 'Requiere inscripción (lead) y resuelve dudas en vivo antes de comprar. Si es solo para clientes, pasa a Deleitar.'
  },
  {
    id: 'nutricion',
    nombre: 'Secuencia de emails de nutrición',
    ejemplo: '3 correos: ahorro → compatibilidad → oferta, según lo que descargó el lead',
    etapa: 'interactuar',
    tambien: [],
    porque: 'Acompaña al lead hasta la compra con contenido personalizado. Es la base de la automatización del Eje 3.'
  },
  {
    id: 'chatbot',
    nombre: 'Chatbot recomendador',
    ejemplo: '«¿Qué producto Hogara es para ti?» en 4 preguntas',
    etapa: 'interactuar',
    tambien: ['deleitar'],
    porque: 'Conversa, califica y captura datos. Si se usa para soporte post-venta también deleita.'
  },
  {
    id: 'caso',
    nombre: 'Caso de éxito / testimonio',
    ejemplo: '«La familia Rojas bajó 18 % su cuenta de luz en 3 meses»',
    etapa: 'interactuar',
    tambien: ['atraer'],
    porque: 'Prueba social para quien ya está evaluando comprar. Publicado en redes también atrae.'
  },
  {
    id: 'tutorial',
    nombre: 'Video tutorial de configuración',
    ejemplo: '«Conecta tu horno Hogara a la app en 2 minutos»',
    etapa: 'deleitar',
    tambien: ['atraer'],
    porque: 'Ayuda al que ya compró a sacarle partido. Como contenido público en YouTube también atrae a quien busca «cómo se usa».'
  },
  {
    id: 'onboarding',
    nombre: 'Email de bienvenida post-compra',
    ejemplo: '«Bienvenida a Hogara: tus primeros 3 pasos»',
    etapa: 'deleitar',
    tambien: [],
    porque: 'Primer contacto después de la compra: reduce la frustración y la tasa de devoluciones.'
  },
  {
    id: 'nps',
    nombre: 'Encuesta de satisfacción (NPS)',
    ejemplo: '«Del 0 al 10, ¿recomendarías Hogara a un amigo?»',
    etapa: 'deleitar',
    tambien: [],
    porque: 'Escucha al cliente, detecta fricción y encuentra promotores para el programa de referidos.'
  },
  {
    id: 'comunidad',
    nombre: 'Comunidad de clientes',
    ejemplo: 'Grupo «Recetas con mi horno Hogara»',
    etapa: 'deleitar',
    tambien: [],
    porque: 'Los clientes se ayudan entre ellos y generan contenido: el volante gira solo.'
  },
  {
    id: 'referidos',
    nombre: 'Programa de referidos',
    ejemplo: '«Invita a un amigo y ambos reciben una ampolleta inteligente»',
    etapa: 'deleitar',
    tambien: [],
    porque: 'Convierte clientes felices en promotores: la fuerza que mueve el Flywheel.'
  },
  {
    id: 'frio',
    nombre: 'Llamada en frío',
    ejemplo: 'Llamar a una base de datos comprada para ofrecer el refrigerador',
    etapa: 'no',
    tambien: [],
    porque: 'Interrumpe a quien no pidió nada. Es outbound y además genera fricción.'
  },
  {
    id: 'spam',
    nombre: 'Email masivo a base comprada',
    ejemplo: 'Mandar la oferta a 50.000 correos sin consentimiento',
    etapa: 'no',
    tambien: [],
    porque: 'Sin permiso no es Inbound, daña la reputación del dominio y en Chile choca con la ley de protección de datos.'
  }
];

/**
 * Herramientas de diseño. Las funciones y los planes cambian seguido:
 * la vista le recuerda al alumno que lo verifique antes de citarlo.
 */
export const formatoById = (id) => FORMATOS.find((f) => f.id === id);
export const etapaById = (id) => ETAPAS.find((e) => e.id === id);
export const personaById = (id) => PERSONAS.find((p) => p.id === id) || PERSONAS[0];
/**
 * 'otra' es la herramienta que propone el propio estudiante; su nombre se
 * guarda aparte (estado.herrOtra) y se pasa como segundo argumento.
 */
export const herramientaById = (id, otraNombre = '') =>
  id === 'otra'
    ? { id: 'otra', nombre: otraNombre.trim() || 'Otra herramienta', tipo: 'Elegida por ti', funciones: '', ventajas: '', limitaciones: '' }
    : HERRAMIENTAS.find((h) => h.id === id);

/** 'ok' si es la etapa principal, 'parcial' si es aceptable con matiz, 'mal' si no. */
export const evaluarFormato = (formatoId, etapaId) => {
  const f = formatoById(formatoId);
  if (!f) return 'mal';
  if (f.etapa === etapaId) return 'ok';
  return f.tambien.includes(etapaId) ? 'parcial' : 'mal';
};

export const HERRAMIENTAS = [
  {
    id: 'canva',
    nombre: 'Canva (Magic Studio)',
    tipo: 'Plantillas + IA',
    funciones: 'Plantillas para cada red social, redimensionar a varios formatos, kit de marca, funciones de IA para generar y editar.',
    ventajas: 'Muy rápido, colaborativo en tiempo real, curva de aprendizaje mínima.',
    limitaciones: 'Los diseños tienden a parecerse entre sí; el kit de marca y varias funciones de IA son del plan pago.'
  },
  {
    id: 'express',
    nombre: 'Adobe Express (Firefly)',
    tipo: 'Plantillas + IA',
    funciones: 'Plantillas, generación de imágenes y efectos de texto con Firefly, quitar fondos, integración con Photoshop.',
    ventajas: 'Calidad visual alta y conexión con el ecosistema Adobe.',
    limitaciones: 'Créditos de generación limitados en el plan gratis; algunas funciones requieren cuenta Adobe paga.'
  },
  {
    id: 'designer',
    nombre: 'Microsoft Designer',
    tipo: 'IA desde texto',
    funciones: 'Genera diseños completos a partir de una descripción y edita imágenes con IA.',
    ventajas: 'Rápido para salir del paso; se usa con una cuenta Microsoft.',
    limitaciones: 'Menos control fino del diseño y de la marca; uso limitado por créditos.'
  },
  {
    id: 'gemini',
    nombre: 'Gemini (imágenes)',
    tipo: 'Chat con IA',
    funciones: 'Crea y edita imágenes conversando: cambiar fondo, mantener el producto, variar estilos.',
    ventajas: 'Iterar es fácil («ahora más luz, ahora en una cocina chilena»).',
    limitaciones: 'El texto dentro de la imagen puede salir mal; no hay capas ni plantillas de marca.'
  },
  {
    id: 'chatgpt',
    nombre: 'ChatGPT (imágenes)',
    tipo: 'Chat con IA',
    funciones: 'Genera imágenes desde texto y las ajusta conversando; también ayuda a escribir copys.',
    ventajas: 'Sirve para idear y producir en el mismo lugar.',
    limitaciones: 'Límites de uso en el plan gratis; sin capas, cuesta mantener una marca idéntica entre piezas.'
  },
  {
    id: 'ideogram',
    nombre: 'Ideogram',
    tipo: 'IA de imagen',
    funciones: 'Generación de imágenes con buen manejo de tipografía y texto dentro de la imagen.',
    ventajas: 'Titulares legibles en la imagen, útil para posts y afiches.',
    limitaciones: 'Créditos limitados; poco control de la identidad de marca.'
  },
  {
    id: 'recraft',
    nombre: 'Recraft',
    tipo: 'IA vectorial',
    funciones: 'Genera ilustraciones, íconos y vectores con un estilo consistente; exporta SVG.',
    ventajas: 'Ideal para íconos y sets coherentes (ej. íconos del mapa de contenidos).',
    limitaciones: 'Más técnico; menos plantillas listas para redes.'
  },
  {
    id: 'figma',
    nombre: 'Figma',
    tipo: 'Diseño profesional',
    funciones: 'Diseño con componentes, prototipos de landing y apps, trabajo en equipo.',
    ventajas: 'Control total y estándar de la industria para web y UX.',
    limitaciones: 'Curva de aprendizaje alta; exagerado para un post rápido.'
  },
  {
    id: 'claude',
    nombre: 'Claude',
    tipo: 'Asistente de IA',
    funciones: 'Redacta y mejora copys, analiza una pieza subida como imagen y arma páginas web o prototipos interactivos a partir de una descripción.',
    ventajas: 'Muy bueno para textos y para criticar un diseño con argumentos; permite prototipar una landing sin saber programar.',
    limitaciones: 'No genera imágenes tipo foto: hay que combinarlo con otra herramienta. Tiene límites de uso en el plan gratis.'
  },
  {
    id: 'codex',
    nombre: 'ChatGPT Codex',
    tipo: 'Agente de código',
    funciones: 'Agente de OpenAI que escribe y modifica código: puede construir una landing, un formulario o una calculadora a partir de instrucciones.',
    ventajas: 'Entrega páginas que funcionan de verdad, no solo maquetas.',
    limitaciones: 'Está pensado para programar: hay que revisar el código y publicarlo en un hosting; el acceso depende del plan de ChatGPT.'
  },
  {
    id: 'antigravity',
    nombre: 'Google Antigravity',
    tipo: 'Agente de código',
    funciones: 'Entorno de desarrollo de Google donde agentes de IA (Gemini) construyen y prueban aplicaciones web a partir de instrucciones.',
    ventajas: 'Puede armar y probar en el navegador una landing o una calculadora completa.',
    limitaciones: 'Es un programa de escritorio para desarrollo: curva de aprendizaje mayor y exagerado para una pieza gráfica.'
  }
];

export const ESCENARIOS_HERRAMIENTA = [
  {
    id: 'titular',
    texto: 'Necesitas una imagen generada con IA que lleve el titular «Ahorra hasta 30 % en tu cuenta de luz» bien escrito.',
    correctas: ['ideogram', 'canva', 'express'],
    explica: 'Las IA de chat suelen deformar el texto. Ideogram maneja bien la tipografía; o generas la imagen y pones el texto encima en Canva o Adobe Express.'
  },
  {
    id: 'formatos',
    texto: 'Tienes un post listo y necesitas la versión para historia, feed y LinkedIn en 5 minutos.',
    correctas: ['canva', 'express'],
    explica: 'Redimensionar automáticamente es justo el punto fuerte de las herramientas de plantillas.'
  },
  {
    id: 'foto',
    texto: 'Quieres una foto realista de una cocina chilena con el refrigerador Hogara.',
    correctas: ['gemini', 'chatgpt', 'express', 'designer'],
    explica: 'Generadores de imagen por texto. Ojo: declara el uso de IA en el informe (la pauta lo permite si es transparente y citado).'
  },
  {
    id: 'iconos',
    texto: 'Necesitas 8 íconos del mismo estilo para el mapa de la Pillar Page y sus clusters.',
    correctas: ['recraft', 'figma'],
    explica: 'Para un set coherente conviene vector: Recraft los genera con estilo fijo y Figma te da control total.'
  },
  {
    id: 'landing',
    texto: 'Debes mostrar a la gerencia un prototipo de la landing con el formulario.',
    correctas: ['figma', 'canva', 'claude', 'antigravity', 'codex'],
    explica: 'Figma es el estándar para prototipos de diseño y Canva sirve para una maqueta simple. Si quieres que se pueda usar de verdad, Claude, Antigravity o Codex la construyen como página web.'
  },
  {
    id: 'calculadora',
    texto: 'Quieres construir la calculadora de ahorro de energía (el lead magnet interactivo) y que funcione en la web.',
    correctas: ['antigravity', 'codex', 'claude'],
    explica: 'Una calculadora necesita lógica, no solo diseño: los agentes de código (Antigravity, Codex) o Claude la construyen a partir de instrucciones. Las herramientas de plantillas solo la dibujan.'
  },
  {
    id: 'copys',
    texto: 'Necesitas 10 variantes del titular que respondan a la objeción «es caro» y que alguien critique tu pieza antes de entregarla.',
    correctas: ['claude', 'chatgpt', 'gemini'],
    explica: 'Los asistentes de IA conversacionales sirven para generar variantes de texto y para revisar una imagen con argumentos. Tú decides cuál queda: la pauta pide criterio propio.'
  },
  {
    id: 'carrusel',
    texto: 'Debes armar un carrusel de 5 láminas para Instagram con la misma plantilla de marca.',
    correctas: ['canva', 'express', 'figma'],
    explica: 'Para repetir una plantilla en varias láminas sirven las herramientas con páginas y estilos: Canva, Adobe Express o Figma.'
  }
];

export const PRINCIPIOS = [
  {
    id: 'contraste',
    nombre: 'Contraste',
    problema: 'Texto claro sobre fondo claro: casi no se lee, menos en el celular al sol.',
    regla: 'Fondo y texto deben diferenciarse fuerte. Lo importante, con más contraste.',
    pregunta: '¿Se lee el titular a un brazo de distancia?'
  },
  {
    id: 'jerarquia',
    nombre: 'Jerarquía',
    problema: 'Todo tiene el mismo tamaño: el ojo no sabe qué leer primero.',
    regla: 'Un elemento protagonista (titular), uno secundario y el resto pequeño.',
    pregunta: '¿Qué se ve primero, segundo y tercero?'
  },
  {
    id: 'alineacion',
    nombre: 'Alineación',
    problema: 'Cada bloque está alineado distinto: se ve desordenado y poco profesional.',
    regla: 'Elige un eje (izquierda o centro) y respétalo en todos los elementos.',
    pregunta: '¿Puedes trazar una línea recta por el borde de los textos?'
  },
  {
    id: 'espacio',
    nombre: 'Espacio y proximidad',
    problema: 'Todo amontonado, sin aire y con demasiado texto.',
    regla: 'Agrupa lo que va junto, separa lo distinto y deja espacio en blanco.',
    pregunta: '¿Hay aire alrededor del mensaje principal?'
  },
  {
    id: 'marca',
    nombre: 'Consistencia de marca',
    problema: 'Tres tipografías, colores al azar y sin logo: no se sabe de quién es.',
    regla: 'Repite la paleta, la tipografía y el logo en todas las piezas.',
    pregunta: '¿Sabrías de qué marca es sin leer el nombre?'
  },
  {
    id: 'cta',
    nombre: 'Llamado a la acción',
    problema: 'Tres botones que compiten y uno dice «Más info aquí».',
    regla: 'Un solo CTA, visible, con verbo y beneficio, coherente con la etapa del Flywheel.',
    pregunta: '¿Qué tiene que hacer la persona después de ver la pieza?'
  }
];

export const QUIZ = [
  {
    q: 'Un ebook que se descarga dejando el email en una landing pertenece a la etapa…',
    ops: ['Atraer', 'Interactuar', 'Deleitar', 'No es Inbound'],
    ok: 1,
    exp: 'Es un lead magnet: convierte una visita en lead. Esa conversión ocurre en Interactuar.'
  },
  {
    q: '¿Por qué HubSpot propone el Flywheel en vez del embudo?',
    ops: [
      'Porque el embudo es más caro',
      'Porque los clientes satisfechos se convierten en la fuerza que trae nuevos clientes',
      'Porque el Flywheel no necesita contenido',
      'Porque elimina la etapa de venta'
    ],
    ok: 1,
    exp: 'En el embudo el cliente es el final; en el volante es la energía que lo hace girar (recomendaciones, reseñas, referidos).'
  },
  {
    q: 'En el Flywheel, la «fricción» es…',
    ops: [
      'El presupuesto en anuncios',
      'Todo lo que frena el volante: procesos lentos, mala atención, datos que no se traspasan',
      'La competencia directa',
      'El número de seguidores'
    ],
    ok: 1,
    exp: 'El volante gira más rápido si aumentas la fuerza (deleite, referidos) y reduces la fricción.'
  },
  {
    q: 'Un webinar de recetas exclusivo para quienes ya compraron el horno es…',
    ops: ['Atraer', 'Interactuar', 'Deleitar', 'No es Inbound'],
    ok: 2,
    exp: 'Está dirigido a clientes actuales para que saquen más partido a su compra: Deleitar.'
  },
  {
    q: 'El botón «Descargar guía» tiene el mismo color que el fondo. ¿Qué principio falla?',
    ops: ['Alineación', 'Contraste', 'Proximidad', 'Repetición'],
    ok: 1,
    exp: 'Si el CTA no se distingue del fondo, falla el contraste y nadie lo ve.'
  },
  {
    q: '¿Cuál es una limitación válida de los generadores de imagen con IA para marketing?',
    ops: [
      'No sirven para redes sociales',
      'El texto dentro de la imagen puede salir deformado y cuesta mantener la marca idéntica entre piezas',
      'Son ilegales en Chile',
      'Solo generan imágenes en blanco y negro'
    ],
    ok: 1,
    exp: 'Es la limitación típica que puedes comparar en el video (IE1.2.1), junto con créditos y control de marca.'
  },
  {
    q: 'Para justificar tu pieza visual en el informe (IE1.2.2), ¿qué NO sirve?',
    ops: [
      '«Usé alto contraste en el titular para que se lea en el celular»',
      '«El CTA es único y está abajo a la derecha, donde termina la lectura»',
      '«Quedó bonita y a mi grupo le gustó»',
      '«Repetí la paleta de la marca para que se reconozca»'
    ],
    ok: 2,
    exp: 'La justificación debe nombrar un principio, dónde se aplica y para qué. El gusto personal no es un argumento.'
  },
  {
    q: '¿Qué dice la pauta sobre usar IA en la EFT?',
    ops: [
      'Está prohibida',
      'Se permite con uso ético, transparente, crítico y citado, sin reemplazar el criterio propio',
      'Solo se puede usar para el video',
      'Se permite sin declararla'
    ],
    ok: 1,
    exp: 'Úsala como apoyo y declárala: qué herramienta, para qué y qué decidiste tú.'
  },
  {
    q: '¿Cuántos tipos de contenido debes clasificar como mínimo en el informe?',
    ops: ['3', '5', '8', '10'],
    ok: 1,
    exp: 'IE1.1.2 pide al menos 5, orientados al buyer persona. Lo ideal es cubrir las tres etapas.'
  }
];

export const PREGUNTAS_GERENCIA = [
  {
    q: '¿Por qué partir con contenido educativo y no con una oferta de precio?',
    claves: [
      'El público desconfía y no conoce la domótica: primero hay que educar (Atraer).',
      'Una oferta a quien no entiende el producto no convierte.',
      'El contenido educativo trae tráfico orgánico y alimenta el SEO del Eje 2.'
    ]
  },
  {
    q: 'Dame un ejemplo concreto de contenido para cada etapa.',
    claves: [
      'Atraer: un artículo o reel que responda una duda real (ahorro de luz).',
      'Interactuar: un lead magnet (guía, calculadora) a cambio del email.',
      'Deleitar: tutorial de configuración o comunidad de clientes.'
    ]
  },
  {
    q: '¿Qué herramienta de diseño usaron y por qué no otra?',
    claves: [
      'Nombra al menos dos herramientas comparadas.',
      'Una función, una ventaja y una limitación de cada una.',
      'La decisión: cuál elegiste para qué pieza y por qué.'
    ]
  },
  {
    q: '¿Cómo responde tu pieza gráfica a la objeción del cliente?',
    claves: [
      'Nombra la objeción (caro, difícil, compatibilidad).',
      'Muestra el mensaje que la responde y el principio que lo destaca (jerarquía, contraste).',
      'Conecta con el CTA y la etapa del Flywheel.'
    ]
  },
  {
    q: '¿Cómo sabrías si el contenido está funcionando?',
    claves: [
      'Atraer: visitas orgánicas, alcance, guardados.',
      'Interactuar: tasa de conversión de la landing, leads.',
      'Deleitar: NPS, referidos, recompra.'
    ]
  }
];

/** Baraja estable: el mismo estudiante ve siempre el mismo orden. */
export const barajar = (lista, semilla) => {
  let s = (Number(semilla) || 1) >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CAMPOS_HERR = ['funciones', 'ventajas', 'limitaciones'];

/** Todo lo que el entregable y el panel docente calculan a partir del avance. */
export const resumenEntrega = (e) => {
  const clasif = e.clasif || {};
  const ejemplos = e.ejemplos || {};
  const herrSel = e.herrSel || [];
  const herrNotas = e.herrNotas || {};
  const autoeval = e.autoeval || {};
  const brief = e.brief || {};
  const quiz = e.quiz || {};

  const filas = ETAPAS.filter((x) => x.id !== 'no').flatMap((et) =>
    Object.entries(clasif)
      .filter(([fid, et2]) => et2 === et.id && evaluarFormato(fid, et2) !== 'mal' && formatoById(fid))
      .map(([fid]) => ({ etapa: et.nombre, formato: formatoById(fid).nombre, ejemplo: (ejemplos[fid] || '').trim() }))
  );
  const etapasCubiertas = new Set(filas.map((f) => f.etapa)).size;
  const conEjemplo = filas.filter((f) => f.ejemplo).length;

  const resultados = Object.entries(clasif).map(([fid, et]) => evaluarFormato(fid, et));
  const flywheel = {
    total: resultados.length,
    ok: resultados.filter((r) => r === 'ok').length,
    parcial: resultados.filter((r) => r === 'parcial').length,
    mal: resultados.filter((r) => r === 'mal').length
  };

  const herrCompletas = herrSel.filter((id) => CAMPOS_HERR.every((c) => (herrNotas[id]?.[c] || '').trim()));
  const elegida = herramientaById(e.herrElegida, e.herrOtra);
  const porque = (herrNotas.__porque || '').trim();
  const evidencias = PRINCIPIOS.filter((p) => (autoeval[p.id]?.evidencia || '').trim());

  const quizRes = {
    respondidas: Object.keys(quiz).length,
    buenas: QUIZ.filter((q, i) => quiz[i] === q.ok).length,
    total: QUIZ.length
  };

  const checks = [
    {
      id: 'IE1.1.2',
      ok: filas.length >= 5 && etapasCubiertas === 3,
      texto: `${filas.length} formatos bien ubicados en ${etapasCubiertas} de 3 etapas (mínimo 5 y las 3 etapas)`,
      ir: 'flywheel'
    },
    {
      id: 'IE1.1.1',
      ok: filas.length >= 5 && conEjemplo === filas.length,
      texto: `${conEjemplo} de ${filas.length} formatos con ejemplo real`,
      ir: 'flywheel'
    },
    {
      id: 'IE1.2.1',
      ok: herrCompletas.length >= 2 && !!elegida && !!porque,
      texto: `${herrCompletas.length} herramientas comparadas completas (mínimo 2) · elección ${elegida && porque ? 'justificada' : 'pendiente'}`,
      ir: 'herramientas'
    },
    {
      id: 'IE1.2.2',
      ok: evidencias.length >= 4 && !!brief.etapa && !!brief.mensaje,
      texto: `${evidencias.length} de ${PRINCIPIOS.length} principios con evidencia (mínimo 4) · brief ${brief.etapa && brief.mensaje ? 'completo' : 'pendiente'}`,
      ir: 'pieza'
    }
  ];

  const escenarios = e.escenarios || {};
  const escRes = {
    respondidos: Object.keys(escenarios).length,
    buenas: ESCENARIOS_HERRAMIENTA.filter((x) => x.correctas.includes(escenarios[x.id])).length,
    abiertas: Object.values(escenarios).filter((v) => v === 'otra').length,
    total: ESCENARIOS_HERRAMIENTA.length
  };

  return { filas, etapasCubiertas, conEjemplo, flywheel, herrCompletas, elegida, porque, evidencias, quiz: quizRes, escenarios: escRes, checks, CAMPOS_HERR };
};
