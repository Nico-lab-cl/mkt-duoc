import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Stethoscope,
  Briefcase,
  Users,
  Search,
  ShieldAlert,
  Award,
  Star,
  Megaphone,
  Target,
  Palette,
  Settings,
  UploadCloud,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Trash2,
  AlertCircle,
  Send,
  Save,
  FolderOpen,
  Lightbulb
} from 'lucide-react';

/**
 * Briefing estratégico para el sitio web de Clínica Conecta Médica.
 * Ruta pública: /formulario-clinica-conectamedica
 *
 * El cuestionario no levanta requerimientos técnicos, levanta insights: por qué
 * compra el paciente, qué lo frena y qué hace distinta a la clínica. Esas
 * respuestas son las que definen después el copy, la estructura y la jerarquía
 * del sitio.
 *
 * Admite prellenado por URL para no repreguntar lo que ya se supo en entrevista:
 *   /formulario-clinica-conectamedica?clinica=Conecta%20Medica&nombre=Juan&email=juan@clinica.cl
 */

const MAX_FILE_MB = 50;
const MAX_PARALLEL_UPLOADS = 2;
const DRAFT_KEY = 'briefing_clinica_conectamedica';

const makeToken = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase().slice(0, 32);

const FILE_CATEGORIES = [
  { id: 'logo', label: 'Logo e identidad', hint: 'Logo en alta, manual de marca, tipografías' },
  { id: 'instalaciones', label: 'Fotos de la clínica', hint: 'Fachada, recepción, boxes, equipamiento' },
  { id: 'equipo', label: 'Fotos del equipo', hint: 'Médicos y personal, retratos' },
  { id: 'videos', label: 'Videos', hint: 'Institucional, testimonios, procedimientos' },
  { id: 'documentos', label: 'Documentos', hint: 'Precios, textos, certificados, convenios' },
  { id: 'otros', label: 'Otros', hint: 'Cualquier material adicional' }
];

// --- Cuestionario ------------------------------------------------------------

const STEPS = [
  {
    id: 'negocio',
    title: 'El negocio detrás del sitio',
    subtitle: 'Un sitio web es una inversión comercial. Primero hay que saber qué debe mover.',
    icon: Briefcase,
    fields: [
      { key: 'clinic_name', label: 'Nombre comercial de la clínica', type: 'text', required: true },
      { key: 'contact_name', label: 'Nombre de quien responde', type: 'text' },
      { key: 'contact_email', label: 'Correo de contacto', type: 'email' },
      { key: 'contact_phone', label: 'Teléfono / WhatsApp', type: 'tel' },
      {
        key: 'one_liner',
        label: 'Complete esta frase: "Somos la clínica que ______ para ______"',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Sin adornos ni palabras de folleto. Si le cuesta, es la señal de que hay que trabajar el posicionamiento antes que el diseño.'
      },
      {
        key: 'profit_services',
        label: '¿Qué 3 servicios les dejan MÁS rentabilidad?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Estos son los que van a ocupar el lugar privilegiado en la home. No siempre son los más conocidos.'
      },
      {
        key: 'entry_services',
        label: '¿Qué servicio trae más pacientes nuevos, aunque deje menos margen?',
        type: 'textarea',
        rows: 2,
        help: 'Es la puerta de entrada: se usa para captar y después el paciente conoce el resto.'
      },
      {
        key: 'idle_capacity',
        label: '¿Qué horarios, boxes o especialidades están hoy con capacidad ociosa?',
        type: 'textarea',
        rows: 2,
        help: 'Llenar huecos existentes es la forma más rápida de que el sitio se pague solo.'
      },
      { key: 'ticket_avg', label: 'Ticket promedio de una primera consulta', type: 'text', placeholder: 'Ej: $35.000' },
      {
        key: 'patient_recurrence',
        label: '¿El paciente vuelve? ¿Cuántas veces al año en promedio?',
        type: 'text',
        help: 'Define cuánto se puede invertir en captar a cada paciente nuevo.'
      },
      {
        key: 'growth_target',
        label: '¿Cuántos pacientes nuevos al mes harían que esta inversión valga la pena?',
        type: 'text',
        required: true,
        help: 'Un número concreto. Es la meta contra la que vamos a medir el proyecto.'
      },
      {
        key: 'capacity_limit',
        label: 'Si mañana llegaran 100 pacientes nuevos, ¿podrían atenderlos?',
        type: 'radio',
        options: [
          'Sí, tenemos capacidad de sobra',
          'Sí, pero con esfuerzo',
          'No, colapsaríamos la agenda',
          'No, y ese es justamente el problema a resolver'
        ],
        help: 'Atraer más demanda de la que se puede atender destruye la reputación más rápido que no tener web.'
      }
    ]
  },
  {
    id: 'paciente',
    title: 'Quién es realmente su paciente',
    subtitle: 'No la descripción demográfica: la persona concreta, con nombre y situación.',
    icon: Users,
    fields: [
      {
        key: 'best_patient',
        label: 'Piense en el mejor paciente que han tenido este año. Descríbalo.',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Edad, con quién vive, en qué trabaja, cómo llegó, por qué volvió. Mientras más concreto, mejor sale el copy.'
      },
      {
        key: 'worst_patient',
        label: '¿Qué tipo de paciente NO quieren atraer?',
        type: 'textarea',
        rows: 3,
        help: 'Tan importante como atraer: el sitio también sirve para filtrar y no perder tiempo del equipo.'
      },
      {
        key: 'decision_maker',
        label: '¿Quién decide y quién agenda? ¿Es la misma persona?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Muchas veces la hija agenda para la madre, o la empresa decide por el trabajador. Si le hablamos a la persona equivocada, no convierte.'
      },
      {
        key: 'trigger_moment',
        label: '¿Qué le pasó al paciente el día exacto en que decidió buscar una clínica?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'El detonante. No "necesitaba un médico", sino "se despertó sin poder mover el cuello". Ese momento es el que hay que reflejar en la web.'
      },
      {
        key: 'emotional_state',
        label: '¿Cómo llega emocionalmente el paciente?',
        type: 'checkbox',
        options: [
          'Con dolor o molestia física',
          'Con miedo a un diagnóstico',
          'Con frustración por no haber sido atendido en otra parte',
          'Con urgencia, necesita hoy',
          'Tranquilo, es un control o trámite',
          'Escéptico, ya lo estafaron antes',
          'Confundido, no sabe qué especialista necesita'
        ],
        help: 'El tono de todo el sitio depende de esto. No se le habla igual a alguien asustado que a alguien haciendo un trámite.'
      },
      {
        key: 'alternatives',
        label: 'Si no van a ustedes, ¿qué hacen en la práctica?',
        type: 'textarea',
        rows: 3,
        help: 'Su competencia real quizás no es otra clínica: puede ser aguantar el dolor, el consultorio, la urgencia o automedicarse.'
      },
      { key: 'geo_area', label: '¿De qué comunas viene su paciente hoy y cuáles quieren sumar?', type: 'text' },
      {
        key: 'insurance_mix',
        label: '¿Qué proporción es Fonasa, Isapre y particular?',
        type: 'text',
        placeholder: 'Ej: 60% Fonasa, 30% Isapre, 10% particular'
      }
    ]
  },
  {
    id: 'busqueda',
    title: 'Cómo busca y qué pregunta',
    subtitle: 'Las palabras exactas del paciente valen más que cualquier redacción publicitaria.',
    icon: Search,
    fields: [
      {
        key: 'search_terms',
        label: '¿Qué cree que escribe literalmente su paciente en Google?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Textual, como lo diría él: "traumatologo viña del mar sin espera", "por qué me duele el hombro". Esto define el SEO.'
      },
      {
        key: 'first_questions',
        label: 'Las 3 primeras preguntas que hacen al llamar o escribir por WhatsApp',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Copie las palabras reales. Si esas 3 preguntas se responden en la home, el sitio convierte solo.'
      },
      {
        key: 'faq_exhausting',
        label: '¿Qué pregunta se repite tanto que ya agota al equipo?',
        type: 'textarea',
        rows: 2,
        help: 'Cada una de estas resuelta en el sitio es tiempo del mesón que se recupera.'
      },
      {
        key: 'info_missing',
        label: '¿Qué información buscan los pacientes y no encuentran hoy en ninguna parte?',
        type: 'textarea',
        rows: 3,
        help: 'Ahí suele estar la oportunidad más grande frente a la competencia.'
      },
      {
        key: 'comparison_criteria',
        label: 'Cuando el paciente compara entre una clínica y otra, ¿con qué criterio decide?',
        type: 'checkbox',
        options: [
          'Precio',
          'Rapidez para conseguir hora',
          'Cercanía y estacionamiento',
          'Prestigio del médico',
          'Que le tomen su previsión',
          'Recomendación de un conocido',
          'Reseñas en Google',
          'Que la clínica se vea seria y limpia'
        ]
      }
    ]
  },
  {
    id: 'objeciones',
    title: 'Miedos, dudas y objeciones',
    subtitle: 'Una web que no responde objeciones es un folleto caro. Aquí está la conversión.',
    icon: ShieldAlert,
    fields: [
      {
        key: 'objections',
        label: '¿Por qué alguien que ya los conoce termina NO agendando?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Las razones reales que escuchan por teléfono. Cada una debe quedar resuelta en alguna parte del sitio.'
      },
      {
        key: 'price_position',
        label: 'Frente a la competencia, sus precios son…',
        type: 'radio',
        required: true,
        options: [
          'Más caros, y lo justificamos con calidad',
          'Similares al promedio',
          'Más convenientes',
          'Variables según el servicio',
          'No sabemos con certeza'
        ]
      },
      {
        key: 'price_justification',
        label: 'Si son más caros, ¿qué recibe el paciente que justifique la diferencia?',
        type: 'textarea',
        rows: 3,
        help: 'Sin una respuesta clara aquí, el sitio va a competir solo por precio, que es la peor cancha.'
      },
      {
        key: 'specific_fear',
        label: '¿Qué miedo concreto tiene el paciente sobre la atención o el procedimiento?',
        type: 'textarea',
        rows: 3,
        help: 'Ej: que duela, que lo deriven, que le descubran algo grave, que sea una pérdida de tiempo.'
      },
      {
        key: 'trust_breakers',
        label: '¿Qué haría que un paciente desconfíe al entrar a la web?',
        type: 'textarea',
        rows: 3,
        help: 'Precios ocultos, fotos genéricas, no saber quién atiende. Lo evitamos desde el diseño.'
      },
      {
        key: 'real_wait',
        label: '¿Cuánto se demora hoy en conseguir hora, de verdad?',
        type: 'text',
        help: 'Si es rápido, es un argumento potente. Si es lento, hay que manejar la expectativa en el sitio.'
      }
    ]
  },
  {
    id: 'posicionamiento',
    title: 'Diferenciación y promesa',
    subtitle: 'Qué los hace elegibles cuando el paciente tiene cinco pestañas abiertas.',
    icon: Award,
    fields: [
      {
        key: 'disappear_test',
        label: 'Si la clínica cerrara mañana, ¿qué perdería su paciente que no encuentra en otra parte?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'La prueba más dura de diferenciación. Si la respuesta es "nada", el trabajo parte por construirla.'
      },
      {
        key: 'why_competitors_win',
        label: '¿Por qué un paciente elige a la competencia en lugar de a ustedes?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'La honestidad aquí vale oro. Nadie pierde pacientes por casualidad.'
      },
      {
        key: 'brand_promise',
        label: '¿Qué promesa pueden cumplir SIEMPRE, sin excepción?',
        type: 'textarea',
        rows: 3,
        help: 'Ej: "nunca lo atendemos con más de 15 minutos de atraso". Una promesa que se cumple siempre vale más que diez que a veces.'
      },
      {
        key: 'unfair_advantage',
        label: '¿Qué tienen que la competencia no pueda copiar en seis meses?',
        type: 'textarea',
        rows: 3,
        help: 'Equipamiento, un médico específico, una alianza, una ubicación, un método propio.'
      },
      {
        key: 'category_enemy',
        label: '¿Qué está mal en cómo se atiende la salud hoy, y que ustedes hacen distinto?',
        type: 'textarea',
        rows: 3,
        help: 'Tener un "enemigo común" con el paciente construye identificación inmediata.'
      },
      {
        key: 'competitors',
        label: 'Nombre 2 o 3 competidores directos y qué hacen bien',
        type: 'textarea',
        rows: 4,
        placeholder: 'Clínica X (web) — su agenda online es muy simple\nCentro Y — están mejor posicionados en Google'
      }
    ]
  },
  {
    id: 'prueba',
    title: 'Prueba social y autoridad',
    subtitle: 'En salud nadie compra por diseño bonito. Compra por confianza demostrada.',
    icon: Star,
    fields: [
      {
        key: 'google_reviews',
        label: '¿Tienen ficha en Google con reseñas? ¿Qué puntaje?',
        type: 'text',
        required: true,
        placeholder: 'Ej: 4,6 con 180 reseñas / No tenemos ficha'
      },
      {
        key: 'testimonials',
        label: '¿Pueden conseguir testimonios de pacientes reales?',
        type: 'radio',
        options: [
          'Sí, escritos y en video',
          'Sí, pero solo escritos',
          'Sí, pero anónimos',
          'No, por confidencialidad',
          'No lo hemos intentado'
        ]
      },
      {
        key: 'patient_faces',
        label: '¿Pueden mostrar rostros de pacientes con consentimiento firmado?',
        type: 'radio',
        options: ['Sí, tenemos consentimientos', 'Podríamos gestionarlos', 'No, preferimos no exponerlos'],
        help: 'Sin consentimiento escrito no se publica ninguna imagen de paciente. Es un riesgo legal, no un detalle.'
      },
      {
        key: 'hard_numbers',
        label: 'Cifras duras que respalden la trayectoria',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Años operando, pacientes atendidos, procedimientos realizados, número de especialistas. Los números concretos convierten más que los adjetivos.'
      },
      {
        key: 'credentials',
        label: 'Certificaciones, acreditaciones, tecnología y universidades del equipo',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'star_doctors',
        label: '¿Hay médicos con reputación propia que traigan pacientes por su nombre?',
        type: 'textarea',
        rows: 2,
        help: 'Si los hay, conviene darles página propia: la gente busca por nombre de médico.'
      },
      { key: 'press', label: '¿Han salido en prensa, radio, TV o convenios reconocibles?', type: 'textarea', rows: 2 }
    ]
  },
  {
    id: 'canales',
    title: 'Qué han hecho en marketing',
    subtitle: 'Para no repetir lo que ya falló y aprovechar lo que sí funcionó.',
    icon: Megaphone,
    fields: [
      {
        key: 'current_channels',
        label: '¿Por dónde llegan hoy la mayoría de sus pacientes?',
        type: 'checkbox',
        required: true,
        options: [
          'Recomendación boca a boca',
          'Google (búsqueda)',
          'Instagram / Facebook',
          'WhatsApp',
          'Pasan por fuera y entran',
          'Convenios con empresas',
          'Derivación de otros médicos',
          'Publicidad pagada'
        ]
      },
      {
        key: 'tried_failed',
        label: '¿Qué han probado en marketing que NO funcionó?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Agencias, pauta, volantes, influencers. Saber qué falló y por qué evita repetir el gasto.'
      },
      {
        key: 'ad_budget',
        label: '¿Invierten en publicidad hoy? ¿Cuánto al mes?',
        type: 'text',
        placeholder: 'Ej: $200.000 en Meta Ads / No invertimos'
      },
      {
        key: 'who_answers',
        label: '¿Quién contesta los WhatsApp y llamadas, y en cuánto tiempo?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'El mejor sitio del mundo no sirve si el contacto se responde al día siguiente. En salud, después de 30 minutos el paciente ya agendó en otra parte.'
      },
      {
        key: 'lost_leads',
        label: '¿Qué pasa con quien pregunta y no agenda? ¿Alguien lo vuelve a contactar?',
        type: 'radio',
        options: [
          'Sí, hacemos seguimiento sistemático',
          'A veces, sin método',
          'No, se pierde',
          'Ni siquiera sabemos cuántos son'
        ]
      },
      {
        key: 'measuring',
        label: '¿Miden algo hoy? ¿Saben de dónde viene cada paciente?',
        type: 'radio',
        options: [
          'Sí, registramos el origen de cada paciente',
          'Preguntamos "¿cómo nos conoció?" pero no lo registramos',
          'No medimos nada',
          'Tenemos Google Analytics pero nadie lo revisa'
        ]
      },
      { key: 'social_links', label: 'Enlaces a sus redes sociales', type: 'textarea', rows: 3 }
    ]
  },
  {
    id: 'conversion',
    title: 'Qué debe lograr el sitio',
    subtitle: 'Un sitio con cinco objetivos no cumple ninguno.',
    icon: Target,
    fields: [
      {
        key: 'main_action',
        label: 'Si el visitante hiciera UNA sola cosa en el sitio, ¿cuál sería?',
        type: 'radio',
        required: true,
        options: [
          'Agendar su hora directamente online',
          'Escribir por WhatsApp',
          'Dejar sus datos en un formulario',
          'Llamar por teléfono',
          'Conocer la clínica y confiar antes de decidir'
        ],
        help: 'Todo el diseño se va a jerarquizar en torno a esta acción.'
      },
      {
        key: 'secondary_actions',
        label: 'Acciones secundarias que también deben estar disponibles',
        type: 'checkbox',
        options: [
          'Ver precios y convenios',
          'Conocer al equipo médico',
          'Descargar indicaciones o preparaciones de examen',
          'Consultar resultados',
          'Postular a trabajar con nosotros',
          'Solicitar convenio para empresa',
          'Suscribirse a contenido de salud'
        ]
      },
      {
        key: 'lead_destination',
        label: '¿A dónde debe llegar cada contacto que entre por el sitio?',
        type: 'textarea',
        required: true,
        rows: 2,
        help: 'Correos concretos, un WhatsApp específico, un CRM. Si no hay destino claro, se pierden.'
      },
      {
        key: 'response_commitment',
        label: '¿En cuánto tiempo se comprometen a responder un contacto del sitio?',
        type: 'radio',
        options: ['Menos de 15 minutos', 'Dentro de la hora', 'El mismo día', 'Al día hábil siguiente', 'No podemos comprometer un plazo']
      },
      {
        key: 'success_6m',
        label: '¿Cómo sabremos en 6 meses que el sitio fue un éxito?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'En números. "Que se vea bonito" no es medible ni defendible.'
      },
      {
        key: 'must_not_do',
        label: '¿Qué NO debe hacer el sitio bajo ninguna circunstancia?',
        type: 'textarea',
        rows: 3,
        help: 'Ej: prometer resultados médicos, mostrar imágenes fuertes, publicar precios, parecer un hospital frío.'
      }
    ]
  },
  {
    id: 'marca',
    title: 'Marca, tono y estética',
    subtitle: 'Cómo se debe ver y, sobre todo, cómo se debe sentir.',
    icon: Palette,
    fields: [
      {
        key: 'brand_personality',
        label: 'Si la clínica fuera una persona, ¿cómo sería?',
        type: 'textarea',
        required: true,
        rows: 3,
        help: 'Ej: "un médico de familia de 50 años, tranquilo, que explica sin apuro". Esto define el tono de todos los textos.'
      },
      {
        key: 'tone',
        label: '¿Cómo le habla la clínica al paciente?',
        type: 'radio',
        options: ['Formal y profesional (de usted)', 'Cercano y humano (de tú)', 'Mixto según la sección']
      },
      {
        key: 'style_preference',
        label: 'Dirección visual preferida',
        type: 'radio',
        required: true,
        options: [
          'Clínico y sobrio: blanco, azul, mucho aire',
          'Cálido y humano: fotos de personas, tonos suaves',
          'Moderno y tecnológico: alto contraste, movimiento',
          'Premium: tipografía elegante, tonos profundos'
        ]
      },
      {
        key: 'references',
        label: 'Pegue 2 o 3 sitios que les gusten y diga exactamente qué les gusta',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'De cualquier rubro. "Me gusta cómo se ve" no sirve: diga si es el orden, los colores, la simpleza del agendamiento.'
      },
      {
        key: 'dislikes',
        label: '¿Qué NO quieren ver en su sitio bajo ninguna circunstancia?',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'brandbook',
        label: '¿Tienen identidad visual definida?',
        type: 'radio',
        required: true,
        options: [
          'Sí, manual de marca completo',
          'Tenemos logo y colores, sin manual',
          'Solo el logo',
          'No tenemos nada, hay que crearlo'
        ]
      },
      { key: 'brand_colors', label: 'Colores corporativos (código HEX si lo conoce)', type: 'text' },
      {
        key: 'accessibility',
        label: '¿Su público incluye adultos mayores o personas con baja visión?',
        type: 'radio',
        options: [
          'Sí, es parte importante de nuestros pacientes',
          'Algunos, conviene considerarlo',
          'No es nuestro público principal'
        ],
        help: 'Cambia tamaños de texto, contraste y tamaño de los botones en todo el sitio.'
      }
    ]
  },
  {
    id: 'operacion',
    title: 'Operación, plazos y accesos',
    subtitle: 'Lo práctico: sin esto el proyecto se traba a mitad de camino.',
    icon: Settings,
    fields: [
      {
        key: 'booking_system',
        label: '¿Qué sistema de agenda usan hoy?',
        type: 'text',
        required: true,
        placeholder: 'Ej: Reservo, Agendapro, Medilink, planilla Excel, agenda en papel'
      },
      {
        key: 'booking_integration',
        label: '¿La reserva online debe conectarse a ese sistema?',
        type: 'radio',
        options: [
          'Sí, debe integrarse con el actual',
          'No, basta con que el contacto llegue por correo o WhatsApp',
          'Queremos que ustedes propongan la mejor opción',
          'No habrá reserva online'
        ]
      },
      {
        key: 'specialties_list',
        label: 'Liste todas las especialidades y servicios que ofrecen',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Una por línea. Cada una puede ser una página que capte búsquedas propias.'
      },
      { key: 'branches', label: 'Direcciones y horarios de cada sede', type: 'textarea', required: true, rows: 4 },
      {
        key: 'domain',
        label: '¿Tienen el dominio comprado y a nombre de quién está?',
        type: 'text',
        required: true,
        help: 'Si está a nombre de un tercero o de una agencia anterior, hay que resolverlo antes de publicar.'
      },
      { key: 'hosting', label: '¿Dónde está alojado el sitio actual? ¿Tienen los accesos?', type: 'textarea', rows: 2 },
      {
        key: 'sensitive_data',
        label: '¿El sitio va a recoger datos de salud del paciente (síntomas, exámenes, diagnósticos)?',
        type: 'radio',
        required: true,
        options: [
          'Sí, en la reserva o en una pre-consulta',
          'Sí, en un área privada de pacientes',
          'No, solo datos de contacto básicos',
          'Aún no lo definimos'
        ],
        help: 'Los datos de salud son datos sensibles bajo la Ley 19.628 y exigen resguardos adicionales de almacenamiento y consentimiento.'
      },
      {
        key: 'legal_docs',
        label: '¿Qué documentos legales tienen ya redactados?',
        type: 'checkbox',
        options: ['Política de privacidad', 'Términos y condiciones', 'Política de cookies', 'Consentimiento informado', 'Ninguno']
      },
      {
        key: 'who_updates',
        label: '¿Quién va a actualizar el sitio después de publicado?',
        type: 'radio',
        options: [
          'Nosotros, necesitamos panel autoadministrable',
          'Ustedes, con plan de mantención',
          'Mixto',
          'Aún no lo definimos'
        ]
      },
      { key: 'deadline', label: '¿Para cuándo lo necesitan publicado y por qué esa fecha?', type: 'text', required: true },
      {
        key: 'budget_range',
        label: 'Rango de presupuesto considerado',
        type: 'radio',
        options: [
          'Menos de $500.000',
          '$500.000 – $1.000.000',
          '$1.000.000 – $2.500.000',
          '$2.500.000 – $5.000.000',
          'Más de $5.000.000',
          'Prefieren que propongamos según alcance'
        ]
      },
      {
        key: 'maintenance_budget',
        label: '¿Contemplan presupuesto mensual de mantención y contenidos?',
        type: 'radio',
        options: ['Sí', 'No', 'Depende de la propuesta']
      }
    ]
  },
  {
    id: 'material',
    title: 'Carga de material',
    subtitle: 'Suba todo de una vez: puede seleccionar carpetas completas o arrastrar decenas de archivos.',
    icon: UploadCloud,
    fields: [
      { key: 'files', type: 'files' },
      {
        key: 'files_pending',
        label: '¿Hay material que no pudo subir? Indique dónde está',
        type: 'textarea',
        rows: 2,
        placeholder: 'Enlace a Drive, WeTransfer, se envía por correo…'
      },
      {
        key: 'final_comments',
        label: '¿Algo más que debamos saber antes de empezar?',
        type: 'textarea',
        rows: 5,
        help: 'El espacio para todo lo que no calzó en las preguntas anteriores.'
      }
    ]
  }
];

// --- Utilidades --------------------------------------------------------------

const formatBytes = (bytes) => {
  const n = Number(bytes) || 0;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = (mime = '') => {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return Video;
  return FileText;
};

// --- Campos ------------------------------------------------------------------

const FieldLabel = ({ field }) => (
  <div className="mb-2">
    <label className="block text-[15px] font-semibold leading-snug text-slate-800">
      {field.label}
      {field.required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    {field.help && (
      <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-relaxed text-slate-500">
        <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-500" />
        <span>{field.help}</span>
      </p>
    )}
  </div>
);

const baseInput =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const ErrorMsg = ({ text }) => (
  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-600">
    <AlertCircle size={14} /> {text}
  </p>
);

const Field = ({ field, value, onChange, error }) => {
  const invalid = Boolean(error);
  const inputClass = `${baseInput} ${invalid ? 'border-rose-400 ring-4 ring-rose-50' : ''}`;

  if (field.type === 'textarea') {
    return (
      <div>
        <FieldLabel field={field} />
        <textarea
          rows={field.rows || 3}
          className={`${inputClass} resize-y leading-relaxed`}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
        {invalid && <ErrorMsg text={error} />}
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <div>
        <FieldLabel field={field} />
        <div className="space-y-2">
          {field.options.map((opt) => {
            const selected = value === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => onChange(field.key, opt)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}
                >
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className={`text-[15px] ${selected ? 'font-medium text-sky-900' : 'text-slate-700'}`}>{opt}</span>
              </button>
            );
          })}
        </div>
        {invalid && <ErrorMsg text={error} />}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (opt) => onChange(field.key, arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt]);
    return (
      <div>
        <FieldLabel field={field} />
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((opt) => {
            const selected = arr.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => toggle(opt)}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    selected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}
                >
                  {selected && <Check size={13} className="text-white" strokeWidth={3} />}
                </span>
                <span className={`text-[14px] ${selected ? 'font-medium text-sky-900' : 'text-slate-700'}`}>{opt}</span>
              </button>
            );
          })}
        </div>
        {invalid && <ErrorMsg text={error} />}
      </div>
    );
  }

  return (
    <div>
      <FieldLabel field={field} />
      <input
        type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
        className={inputClass}
        placeholder={field.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {invalid && <ErrorMsg text={error} />}
    </div>
  );
};

// --- Carga masiva de archivos ------------------------------------------------

const uploadWithProgress = (payload, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/briefing-files');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.success) resolve(json);
        else reject(new Error(json.error || `Error ${xhr.status}`));
      } catch {
        reject(new Error('El servidor respondió de forma inesperada'));
      }
    };
    xhr.onerror = () => reject(new Error('Error de conexión'));
    xhr.send(JSON.stringify(payload));
  });

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });

const BulkUploader = ({ token, files, setFiles }) => {
  const fileRef = useRef(null);
  const folderRef = useRef(null);
  const [category, setCategory] = useState('instalaciones');
  const [dragOver, setDragOver] = useState(false);
  const [queue, setQueue] = useState([]);
  const [errors, setErrors] = useState([]);

  // webkitdirectory no se puede declarar como prop de React en JSX
  useEffect(() => {
    if (folderRef.current) {
      folderRef.current.setAttribute('webkitdirectory', '');
      folderRef.current.setAttribute('directory', '');
    }
  }, []);

  const totalBytes = useMemo(() => files.reduce((sum, f) => sum + Number(f.file_size || 0), 0), [files]);

  const processQueue = useCallback(
    async (items) => {
      let index = 0;
      const worker = async () => {
        while (index < items.length) {
          const item = items[index++];
          try {
            const base64 = await readAsBase64(item.file);
            const json = await uploadWithProgress(
              {
                token,
                category: item.category,
                file_name: item.file.name,
                mime_type: item.file.type || 'application/octet-stream',
                file_size: item.file.size,
                data_base64: base64
              },
              (ratio) => setQueue((prev) => prev.map((q) => (q.tempId === item.tempId ? { ...q, progress: ratio } : q)))
            );
            setFiles((prev) => [...prev, json.file]);
          } catch (err) {
            setErrors((prev) => [...prev, `${item.file.name}: ${err.message}`]);
          } finally {
            setQueue((prev) => prev.filter((q) => q.tempId !== item.tempId));
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(MAX_PARALLEL_UPLOADS, items.length) }, worker));
    },
    [token, setFiles]
  );

  const addFiles = (list) => {
    const incoming = Array.from(list);
    if (incoming.length === 0) return;

    const tooBig = incoming.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    const valid = incoming.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024 && f.size > 0);

    if (tooBig.length > 0) {
      setErrors((prev) => [
        ...prev,
        ...tooBig.map((f) => `${f.name} pesa ${formatBytes(f.size)} y supera el máximo de ${MAX_FILE_MB} MB`)
      ]);
    }
    if (valid.length === 0) return;

    const items = valid.map((file) => ({
      tempId: `${file.name}-${file.size}-${Math.random()}`,
      file,
      category,
      progress: 0
    }));
    setQueue((prev) => [...prev, ...items]);
    processQueue(items);
  };

  const removeFile = async (id) => {
    try {
      await fetch(`/api/briefing-files/${id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' });
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setErrors((prev) => [...prev, 'No se pudo eliminar el archivo']);
    }
  };

  const grouped = useMemo(() => {
    const map = {};
    files.forEach((f) => {
      const cat = f.category || 'otros';
      (map[cat] = map[cat] || []).push(f);
    });
    return map;
  }, [files]);

  return (
    <div>
      {/* Selector de categoría */}
      <p className="mb-2 text-[15px] font-semibold text-slate-800">1. ¿Qué tipo de material va a subir ahora?</p>
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {FILE_CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                active
                  ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`block text-[14px] font-semibold ${active ? 'text-sky-900' : 'text-slate-700'}`}>
                {cat.label}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-tight text-slate-500">{cat.hint}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-2 text-[15px] font-semibold text-slate-800">2. Suéltelos aquí</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'
        }`}
      >
        <UploadCloud size={36} className="mx-auto text-sky-500" />
        <p className="mt-3 text-[15px] font-semibold text-slate-800">
          Arrastre aquí todos los archivos que quiera
        </p>
        <p className="mt-1 text-[13px] text-slate-500">
          Puede seleccionar decenas a la vez. Fotos, videos, PDF, Word, Excel. Máximo {MAX_FILE_MB} MB por archivo.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-lg bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white">
            Seleccionar archivos
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              folderRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FolderOpen size={15} /> Subir una carpeta completa
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={folderRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <div className="flex items-start gap-2 text-[13px] text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              {errors.slice(-4).map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setErrors([])}
              className="text-[12px] font-semibold text-rose-600 underline"
            >
              ocultar
            </button>
          </div>
        </div>
      )}

      {/* Cola de subida */}
      {queue.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[13px] font-semibold text-slate-600">Subiendo {queue.length} archivo(s)…</p>
          {queue.map((q) => (
            <div key={q.tempId} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="shrink-0 animate-spin text-sky-500" />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-700">{q.file.name}</span>
                <span className="text-[12px] text-slate-500">{Math.round(q.progress * 100)}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${Math.max(q.progress * 100, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archivos ya cargados, agrupados por categoría */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-slate-700">
              {files.length} archivo{files.length !== 1 ? 's' : ''} cargado{files.length !== 1 ? 's' : ''}
            </p>
            <span className="text-[13px] text-slate-500">{formatBytes(totalBytes)} en total</span>
          </div>

          <div className="space-y-4">
            {FILE_CATEGORIES.filter((c) => grouped[c.id]?.length).map((cat) => (
              <div key={cat.id}>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-400">
                  {cat.label} · {grouped[cat.id].length}
                </p>
                <ul className="space-y-2">
                  {grouped[cat.id].map((f) => {
                    const Icon = fileIcon(f.mime_type);
                    return (
                      <li
                        key={f.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-slate-800">{f.file_name}</p>
                          <p className="text-[11.5px] text-slate-500">{formatBytes(f.file_size)}</p>
                        </div>
                        <Check size={15} className="text-emerald-500" />
                        <button
                          type="button"
                          onClick={() => removeFile(f.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Componente principal ----------------------------------------------------

const ClinicaBriefingForm = () => {
  const [token] = useState(() => {
    const saved = localStorage.getItem(`${DRAFT_KEY}_token`);
    if (saved) return saved;
    const fresh = makeToken();
    localStorage.setItem(`${DRAFT_KEY}_token`, fresh);
    return fresh;
  });

  const [answers, setAnswers] = useState(() => {
    let draft = {};
    try {
      draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch {
      draft = {};
    }
    // Prellenado desde la URL: lo que ya se supo en la entrevista no se vuelve a preguntar
    const params = new URLSearchParams(window.location.search);
    const prefill = {
      clinic_name: params.get('clinica'),
      contact_name: params.get('nombre'),
      contact_email: params.get('email'),
      contact_phone: params.get('telefono')
    };
    Object.entries(prefill).forEach(([k, v]) => {
      if (v && !draft[k]) draft[k] = v;
    });
    return draft;
  });

  const [files, setFiles] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const topRef = useRef(null);

  const step = STEPS[stepIndex];
  const progress = useMemo(() => Math.round((stepIndex / STEPS.length) * 100), [stepIndex]);

  // El simulador aplica `overflow-hidden` al body porque es de pantalla fija.
  // Este formulario es una página larga, así que devolvemos el scroll mientras
  // está montado y restauramos el estado original al salir.
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    fetch(`/api/briefing-files?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setFiles(data))
      .catch(() => {});
  }, [token]);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validateStep = () => {
    const stepErrors = {};
    step.fields.forEach((f) => {
      if (!f.required) return;
      const v = answers[f.key];
      const empty = f.type === 'checkbox' ? !Array.isArray(v) || v.length === 0 : !v || !String(v).trim();
      if (empty) stepErrors[f.key] = 'Esta pregunta es obligatoria.';
    });
    // El correo es opcional, pero si lo escriben debe ser válido
    if (answers.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.contact_email)) {
      if (step.fields.some((f) => f.key === 'contact_email')) {
        stepErrors.contact_email = 'Ingrese un correo electrónico válido.';
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const scrollTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => {
    if (!validateStep()) return scrollTop();
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    scrollTop();
  };

  const back = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  };

  const submit = async () => {
    if (!validateStep()) return scrollTop();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          form_slug: 'clinica-conectamedica',
          clinic_name: answers.clinic_name || '',
          contact_name: answers.contact_name || '',
          contact_email: answers.contact_email || '',
          contact_phone: answers.contact_phone || '',
          answers
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'No se pudo enviar el formulario');
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(`${DRAFT_KEY}_token`);
      setSubmitted(true);
      scrollTop();
    } catch (err) {
      setSubmitError(err.message || 'Ocurrió un error al enviar. Intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Check size={30} className="text-emerald-600" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Briefing recibido</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Gracias. Con esto ya tenemos el material y, más importante, entendemos el negocio de{' '}
            <strong>{answers.clinic_name || 'su clínica'}</strong>. El próximo paso es la propuesta de estructura y
            estrategia de contenidos.
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-500">
            Código de seguimiento: <span className="font-mono font-semibold text-slate-700">{token}</span>
          </div>
        </div>
      </div>
    );
  }

  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <div ref={topRef} />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Stethoscope size={22} />
            </span>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-600">Briefing estratégico</p>
              <h1 className="text-lg font-bold leading-tight text-slate-900">Sitio web · Clínica Conecta Médica</h1>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
            Este cuestionario no busca definir cómo se ve el sitio, sino entender su negocio y a su paciente. Con eso
            decidimos qué decir, en qué orden y a quién. Responda con honestidad y en las palabras que usa su equipo
            todos los días: las respuestas incómodas suelen ser las más útiles.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 py-3 sm:px-8">
          <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
            <span>
              Paso {stepIndex + 1} de {STEPS.length} · {step.title}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-500"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-8 flex items-start gap-4 border-b border-slate-100 pb-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <StepIcon size={23} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
              <p className="mt-1 text-[14px] text-slate-500">{step.subtitle}</p>
            </div>
          </div>

          <div className="space-y-7">
            {step.fields.map((field) =>
              field.type === 'files' ? (
                <BulkUploader key={field.key} token={token} files={files} setFiles={setFiles} />
              ) : (
                <Field
                  key={field.key}
                  field={field}
                  value={answers[field.key]}
                  onChange={handleChange}
                  error={errors[field.key]}
                />
              )
            )}
          </div>

          {submitError && (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[14px] text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="mt-9 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} /> Anterior
            </button>

            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Siguiente <ChevronRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Enviando…' : 'Enviar briefing'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
          <Save size={13} /> Sus respuestas se guardan solas. Puede cerrar y continuar después en este mismo navegador.
        </p>
      </main>
    </div>
  );
};

export default ClinicaBriefingForm;
