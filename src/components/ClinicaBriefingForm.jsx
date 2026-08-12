import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Stethoscope,
  Building2,
  CalendarClock,
  BookOpen,
  Award,
  HeartPulse,
  Palette as PaletteIcon,
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
  Plus,
  X,
  Paperclip
} from 'lucide-react';

/**
 * Briefing para el sitio web de una clínica nueva.
 * Ruta pública: /formulario-clinica-conectamedica
 *
 * Lo responde un médico: preguntas concretas, mayoría de selección y sin dar por
 * hecho un historial que una clínica recién abierta no tiene. El foco está en la
 * identidad de marca (historia, misión, valores, diferenciador, paleta), que es
 * lo que después alimenta el "Quiénes somos" y la línea gráfica del sitio.
 *
 * Los datos de contacto no se preguntan: viajan en el link y quedan guardados.
 *   /formulario-clinica-conectamedica?nombre=Dr.%20Perez&email=...&telefono=...
 */

const MAX_FILE_MB = 50;
const MAX_PARALLEL_UPLOADS = 2;
const DRAFT_KEY = 'briefing_clinica_conectamedica';

const makeToken = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase().slice(0, 32);

const FILE_CATEGORIES = [
  { id: 'logo', label: 'Logo e identidad', hint: 'Logo, colores, manual de marca' },
  { id: 'instalaciones', label: 'Fotos del local', hint: 'Fachada, espera, boxes, equipos' },
  { id: 'equipo', label: 'Equipo y títulos', hint: 'Fotos, certificados, diplomas' },
  { id: 'videos', label: 'Videos', hint: 'Cualquier video que tenga' },
  { id: 'documentos', label: 'Documentos', hint: 'Aranceles, convenios, textos' },
  { id: 'otros', label: 'Otros', hint: 'Lo que no calce en las anteriores' }
];

// Paletas pensadas para el rubro salud. La elegida define después el estilo.
const PALETTES = [
  {
    id: 'azul-clinico',
    name: 'Azul clínico',
    colors: ['#0B4F8A', '#2E90D9', '#DCEBF7', '#FFFFFF'],
    note: 'Confianza y limpieza. Es el estándar en salud y el más seguro.'
  },
  {
    id: 'verde-salud',
    name: 'Verde salud',
    colors: ['#0F766E', '#34D399', '#E6FAF3', '#FFFFFF'],
    note: 'Bienestar y prevención. Más cálido que el azul.'
  },
  {
    id: 'turquesa',
    name: 'Turquesa moderno',
    colors: ['#0E7490', '#22D3EE', '#E0FAFE', '#FFFFFF'],
    note: 'Se ve actual y tecnológico. Bueno para clínicas nuevas.'
  },
  {
    id: 'azul-coral',
    name: 'Azul con coral',
    colors: ['#1E3A8A', '#FB7185', '#FFE9EC', '#FFFFFF'],
    note: 'Serio pero cercano. Funciona bien en pediatría y salud familiar.'
  },
  {
    id: 'neutro-dorado',
    name: 'Neutro elegante',
    colors: ['#1F2937', '#C0A062', '#F5F2EC', '#FFFFFF'],
    note: 'Se percibe premium. Para consulta privada de mayor valor.'
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    colors: ['#6D28D9', '#A78BFA', '#F1ECFE', '#FFFFFF'],
    note: 'Transmite calma. Habitual en salud mental y bienestar.'
  },
  {
    id: 'verde-natural',
    name: 'Verde natural',
    colors: ['#3F6212', '#84CC16', '#F0FBE0', '#FFFFFF'],
    note: 'Natural e integrativo. Nutrición, kinesiología, medicina integrativa.'
  },
  {
    id: 'propia',
    name: 'Ya tengo mis colores',
    colors: ['#94A3B8', '#CBD5E1', '#E2E8F0', '#FFFFFF'],
    note: 'Los subo junto con el logo en la última sección.'
  }
];

const COMMITMENT_SUGGESTIONS = [
  'Atender con puntualidad',
  'Dar hora en menos de 48 horas',
  'Explicar el diagnóstico en palabras simples',
  'Entregar los resultados dentro de 24 horas',
  'Responder las dudas por WhatsApp',
  'No indicar exámenes innecesarios',
  'Que siempre lo atienda el mismo médico',
  'Precios claros antes de atender'
];

// --- Cuestionario ------------------------------------------------------------

const STEPS = [
  {
    id: 'clinica',
    title: 'La clínica',
    subtitle: 'Lo básico para armar la ficha: dónde, cuándo y con quién.',
    icon: Building2,
    fields: [
      {
        key: 'name_status',
        label: '¿Ya tiene nombre la clínica?',
        type: 'radio',
        required: true,
        options: ['Sí, ya está definido', 'Tengo una idea pero no lo decido', 'Todavía no']
      },
      { key: 'clinic_name', label: 'Si ya lo tiene, ¿cuál es?', type: 'text' },
      {
        key: 'slogan',
        label: '¿Tiene alguna frase o eslogan en mente?',
        type: 'text',
        placeholder: 'Ej: Salud cerca de usted'
      },
      {
        key: 'opening',
        label: '¿Cuándo abre?',
        type: 'radio',
        required: true,
        options: ['Ya estamos atendiendo', 'En menos de un mes', 'En 1 a 3 meses', 'En 3 a 6 meses', 'Aún sin fecha']
      },
      {
        key: 'specialties',
        label: '¿Qué especialidades se van a atender?',
        type: 'checkbox',
        required: true,
        options: [
          'Medicina general / familiar',
          'Pediatría',
          'Ginecología y obstetricia',
          'Traumatología',
          'Kinesiología',
          'Nutrición',
          'Psicología',
          'Psiquiatría',
          'Dermatología',
          'Cardiología',
          'Broncopulmonar',
          'Otorrinolaringología',
          'Oftalmología',
          'Urología',
          'Endocrinología / diabetes',
          'Gastroenterología',
          'Neurología',
          'Reumatología',
          'Odontología',
          'Medicina estética',
          'Toma de exámenes',
          'Imagenología / ecografía',
          'Otra'
        ]
      },
      {
        key: 'specialties_other',
        label: 'Si marcó "Otra", ¿cuál o cuáles?',
        type: 'text',
        placeholder: 'Escriba aquí las especialidades que no aparecen en la lista'
      },
      { key: 'address', label: 'Dirección de la clínica', type: 'text', required: true, placeholder: 'Calle, número, comuna' },
      { key: 'schedule', label: 'Horario de atención', type: 'text', placeholder: 'Ej: Lun a Vie 09:00–19:00, Sáb 09:00–13:00' },
      {
        key: 'team_size',
        label: '¿Cuántos profesionales van a atender?',
        type: 'radio',
        options: ['Solo yo', '2 o 3', '4 a 8', 'Más de 8']
      },
      { key: 'boxes', label: '¿Cuántos boxes de atención tiene?', type: 'text' },
      {
        key: 'insurance',
        label: '¿Con qué previsiones va a trabajar?',
        type: 'checkbox',
        required: true,
        options: [
          'Fonasa (libre elección)',
          'Fonasa (modalidad institucional)',
          'Isapre con bono',
          'Isapre por reembolso',
          'Seguros complementarios',
          'Convenios con empresas',
          'Solo particular'
        ]
      },
      {
        key: 'facilities',
        label: '¿Qué tiene el local que valga la pena mencionar?',
        type: 'checkbox',
        options: [
          'Estacionamiento propio',
          'Acceso para silla de ruedas',
          'Cerca de locomoción / metro',
          'Sala de espera amplia',
          'Espacio para niños',
          'Baño accesible',
          'Atención sin escaleras'
        ],
        help: 'Suena menor, pero para un paciente mayor o con dolor esto decide dónde se atiende.'
      },
      {
        key: 'social_networks',
        label: '¿Ya tienen redes sociales creadas?',
        type: 'checkbox',
        options: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'WhatsApp Business', 'Ficha en Google', 'Todavía ninguna']
      },
      { key: 'social_links', label: 'Pegue los enlaces de las que ya tenga', type: 'text' }
    ]
  },
  {
    id: 'atencion',
    title: 'Atención y agenda',
    subtitle: 'Qué se resuelve en la clínica y qué tan rápido consigue hora un paciente.',
    icon: CalendarClock,
    fields: [
      {
        key: 'services',
        label: '¿Qué se va a poder hacer en la clínica?',
        type: 'checkbox',
        required: true,
        options: [
          'Consulta médica',
          'Controles de pacientes crónicos',
          'Exámenes de sangre',
          'Electrocardiograma',
          'Ecografías',
          'Radiografías',
          'Curaciones',
          'Procedimientos menores / cirugía menor',
          'Infiltraciones',
          'Vacunas',
          'Certificados médicos',
          'Licencias médicas',
          'Chequeo preventivo',
          'Control sano del niño',
          'Salud ocupacional / preocupacional'
        ]
      },
      {
        key: 'ages',
        label: '¿Qué edades va a atender?',
        type: 'checkbox',
        required: true,
        options: ['Lactantes', 'Niños', 'Adolescentes', 'Adultos', 'Adultos mayores']
      },
      {
        key: 'appointment_wait',
        label: '¿En cuánto tiempo va a poder conseguir hora un paciente que llame hoy?',
        type: 'radio',
        required: true,
        options: [
          'El mismo día',
          'Al día siguiente',
          'Dentro de 2 a 3 días',
          'Dentro de la semana',
          'Más de una semana',
          'Va a depender de la especialidad'
        ],
        help: 'Es el dato más valioso que puede tener una clínica nueva. En los grandes centros la espera es de semanas: si usted da hora en 48 horas, eso va en primera línea de la web.'
      },
      {
        key: 'availability',
        label: '¿Cómo va a estar disponible la agenda?',
        type: 'checkbox',
        required: true,
        options: [
          'Cupos reservados para atención del mismo día',
          'Reserva online abierta con semanas de anticipación',
          'Sobrecupos para casos urgentes',
          'Horario extendido después de las 18:00',
          'Atención los sábados',
          'Lista de espera para avisar si se libera una hora'
        ],
        help: 'Marque todo lo que vaya a ofrecer. Cada una de estas es una razón concreta para elegirlos por sobre otro centro.'
      },
      {
        key: 'extra_modes',
        label: '¿Va a ofrecer alguna de estas modalidades?',
        type: 'checkbox',
        options: [
          'Telemedicina',
          'Visita domiciliaria',
          'Atención a empresas',
          'Convenios con colegios',
          'Atención de fin de semana'
        ]
      },
      {
        key: 'ticket_avg',
        label: '¿Cuál será el valor de una atención particular? (ticket promedio proyectado)',
        type: 'text',
        placeholder: 'Ej: $35.000',
        help:
          'El ticket promedio es lo que en promedio va a dejar cada paciente que pasa por la clínica, no solo el valor de la consulta. Como la clínica es nueva no hay historial, así que se estima: tome el valor de la consulta y súmele lo que habitualmente se agrega (un examen, una curación, un control) según cuántos pacientes lo pidan. Por ejemplo, si la consulta vale $30.000 y uno de cada tres suma un examen de $15.000, el ticket promedio proyectado bordea los $35.000. Este número nos permite calcular cuánto se puede invertir en atraer a cada paciente nuevo sin perder plata.'
      },
      {
        key: 'price_public',
        label: '¿Publicamos los precios en la web?',
        type: 'radio',
        options: ['Sí, todos', 'Solo el valor de la consulta', 'Solo rangos', 'No, que consulten'],
        help: 'Publicarlos filtra a quien no puede pagar y evita llamadas que no llegan a nada.'
      }
    ]
  },
  {
    id: 'identidad',
    title: 'Quiénes somos',
    subtitle: 'De aquí sale la página que más leen los pacientes antes de decidir.',
    icon: BookOpen,
    fields: [
      {
        key: 'history',
        label: '¿Cómo nace la clínica? Cuéntenos la historia',
        type: 'textarea',
        required: true,
        rows: 6,
        help: 'Cómo surgió la idea, qué los llevó a abrirla, qué querían resolver, cómo eligieron el lugar. Escriba sin ordenar, nosotros le damos forma. Esta es la base del "Quiénes somos" y suele ser lo que más conecta con el paciente.'
      },
      {
        key: 'founders',
        label: '¿Quiénes son los fundadores?',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Nombre, especialidad y una línea de la trayectoria de cada uno. Si son varios socios, cuente qué aporta cada uno.'
      },
      {
        key: 'mission',
        label: 'Misión: ¿para qué existe la clínica?',
        type: 'textarea',
        rows: 3,
        help: 'Lo que hacen todos los días y para quién. Una o dos frases bastan, no tiene que sonar corporativo.'
      },
      {
        key: 'vision',
        label: 'Visión: ¿dónde quieren estar en 5 años?',
        type: 'textarea',
        rows: 3,
        help: 'Adónde quieren llegar: más sedes, más especialidades, ser referentes en algo puntual de la zona.'
      },
      {
        key: 'values',
        label: 'Valores de la clínica',
        type: 'checkbox',
        required: true,
        options: [
          'Empatía',
          'Puntualidad',
          'Honestidad',
          'Excelencia clínica',
          'Cercanía',
          'Confidencialidad',
          'Respeto',
          'Transparencia en los precios',
          'Trabajo en equipo',
          'Vocación de servicio',
          'Innovación',
          'Compromiso con la comunidad',
          'Atención humanizada',
          'Prevención por sobre tratamiento'
        ],
        help: 'Marque los que de verdad los representen. Tres o cuatro bien elegidos valen más que diez genéricos.'
      },
      { key: 'values_other', label: '¿Algún otro valor que no esté en la lista?', type: 'text' }
    ]
  },
  {
    id: 'diferenciacion',
    title: 'Diferenciación y equipo',
    subtitle: 'Por qué elegirlos a ustedes y no a la clínica de al lado.',
    icon: Award,
    fields: [
      {
        key: 'differentiator',
        label: '¿Cuál es el diferenciador de su clínica frente a otras de las mismas especialidades?',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Qué ofrecen que los demás no: equipamiento, tiempos de espera, un profesional en particular, la forma de atender, la ubicación, el precio, un método propio. Sea concreto.'
      },
      {
        key: 'differentiator_tags',
        label: '¿Cuáles de estas ventajas van a tener?',
        type: 'checkbox',
        options: [
          'Consultas más largas que el promedio',
          'Hora para el mismo día o el siguiente',
          'Siempre lo atiende el mismo médico',
          'Equipamiento nuevo o de última generación',
          'Exámenes y consulta en el mismo lugar',
          'Resultados entregados rápido',
          'Precios más convenientes',
          'Especialistas con trayectoria reconocida',
          'Trato cercano, sin lenguaje técnico',
          'Ubicación con fácil acceso y estacionamiento'
        ]
      },
      {
        key: 'commitments',
        label: '¿Cuál es el compromiso de la clínica con sus pacientes?',
        type: 'list',
        required: true,
        suggestions: COMMITMENT_SUGGESTIONS,
        help: 'Agregue uno por uno los compromisos que van a cumplir siempre. Puede usar los sugeridos o escribir los suyos. Estos se van a publicar en la web, así que ponga solo los que pueda sostener el 100% de las veces.'
      },
      {
        key: 'team_credentials',
        label: 'Formación del equipo profesional',
        type: 'textarea',
        required: true,
        rows: 5,
        help: 'Por cada profesional: nombre, universidad, especialidad, años de experiencia, dónde trabajó antes y sociedades médicas a las que pertenece. Esto es lo que respalda la confianza cuando el paciente todavía no los conoce.'
      },
      {
        key: 'team_files',
        label: 'Adjunte aquí fotos de los profesionales, títulos y certificados',
        type: 'upload',
        category: 'equipo',
        help: 'Fotos de cada profesional, diplomas, certificados de especialidad, acreditaciones. Puede subir varios a la vez.'
      },
      {
        key: 'nearby_centers',
        label: '¿Qué otros centros médicos hay cerca?',
        type: 'text',
        help: 'Para saber contra quién compite en el sector.'
      }
    ]
  },
  {
    id: 'pacientes',
    title: 'Sus pacientes',
    subtitle: 'A quién le vamos a hablar en la web.',
    icon: HeartPulse,
    fields: [
      {
        key: 'patient_type',
        label: '¿Qué tipo de paciente espera atender más?',
        type: 'checkbox',
        required: true,
        options: [
          'Familias completas',
          'Adultos mayores',
          'Trabajadores con poco tiempo',
          'Pacientes crónicos en control',
          'Embarazadas',
          'Niños',
          'Deportistas',
          'Pacientes de empresas en convenio'
        ]
      },
      { key: 'area', label: '¿De qué comunas espera que vengan?', type: 'text', required: true },
      {
        key: 'patient_questions',
        label: '¿Qué le preguntan siempre sus pacientes en la consulta?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Las dudas que repiten todos. Si las dejamos respondidas en la web, le ahorra explicarlas cien veces y le quita trabajo al teléfono.'
      }
    ]
  },
  {
    id: 'imagen',
    title: 'Imagen y web',
    subtitle: 'Los colores, el logo y cómo va a funcionar el sitio.',
    icon: PaletteIcon,
    fields: [
      {
        key: 'palette',
        label: 'Elija la paleta de colores de la clínica',
        type: 'palette',
        required: true,
        help: 'Estos colores se van a usar en toda la web, y después en tarjetas, letreros y redes. Elija la que mejor represente el trato que quiere dar.'
      },
      {
        key: 'style',
        label: '¿Cómo quiere que se vea la web con esos colores?',
        type: 'style-palette',
        required: true,
        options: [
          'Limpia y ordenada: mucho blanco, el color solo en botones y títulos',
          'Con más color: fondos en el tono elegido, se ve más vivo',
          'Cálida: fotos grandes de personas, colores suaves de apoyo',
          'Elegante: fondos oscuros, tipografía fina, poco color'
        ]
      },
      {
        key: 'logo_status',
        label: '¿Tiene logo?',
        type: 'radio',
        required: true,
        options: ['Sí, con manual de marca', 'Sí, solo el logo', 'Lo están haciendo', 'No tengo, hay que crearlo']
      },
      {
        key: 'logo_files',
        label: 'Si ya lo tiene, adjúntelo aquí',
        type: 'upload',
        category: 'logo',
        help: 'Suba el logo en la mejor calidad que tenga. Si tiene el archivo original (.ai, .eps, .svg, .psd) suba ese; si no, la imagen de mayor tamaño que encuentre.'
      },
      { key: 'references', label: '¿Alguna web que le guste? Pegue el link', type: 'textarea', rows: 3 },
      {
        key: 'dislikes',
        label: '¿Algo que no quiera ver en su web?',
        type: 'text',
        placeholder: 'Ej: fotos de bancos de imágenes, imágenes de sangre'
      },
      {
        key: 'sections',
        label: '¿Qué quiere que tenga la web?',
        type: 'checkbox',
        required: true,
        options: [
          'Inicio',
          'Especialidades',
          'Quiénes somos',
          'Equipo médico',
          'Agendar hora',
          'Precios y convenios',
          'Preguntas frecuentes',
          'Cómo llegar y estacionamiento',
          'Contacto',
          'Blog de salud',
          'Trabaja con nosotros'
        ]
      },
      {
        key: 'whatsapp',
        label: '¿Qué número va a recibir los WhatsApp de pacientes?',
        type: 'text',
        placeholder: '+56 9 ...'
      },
      {
        key: 'lead_email',
        label: '¿A qué correo quiere que lleguen las solicitudes de hora?',
        type: 'text',
        placeholder: 'Por ejemplo, contacto@conectamedica.com'
      },
      {
        key: 'domain_type',
        label: '¿Qué tipo de dominio quiere para la clínica?',
        type: 'radio',
        required: true,
        options: [
          '.cl — recomendado, sus pacientes están en Chile',
          '.com — si apunta también a público de otros países',
          'Ambos, para proteger el nombre',
          'Prefiero que me recomienden'
        ],
        help: 'El .cl le dice al paciente y a Google que usted atiende en Chile, y por eso posiciona mejor en las búsquedas del país. El .com es más internacional y conviene solo si apunta a pacientes fuera de Chile. Para una clínica que atiende presencialmente, la recomendación es .cl. Si el presupuesto lo permite, lo ideal es comprar ambos y redirigir uno al otro para que nadie más registre su nombre.'
      },
      {
        key: 'domain_owned',
        label: '¿Ya lo compró?',
        type: 'radio',
        options: ['Sí, ya lo tengo', 'No, necesito que lo compren', 'No sé si está disponible']
      },
      { key: 'domain_name', label: '¿Qué dirección le gustaría?', type: 'text', placeholder: 'Ej: conectamedica.cl' },
      {
        key: 'sensitive_data',
        label: '¿La web va a pedirle al paciente que cuente sus síntomas o antecedentes?',
        type: 'radio',
        options: ['Sí, en el formulario de hora', 'No, solo nombre y teléfono', 'Aún no lo defino'],
        help: 'Los datos de salud son datos sensibles por ley y hay que resguardarlos de otra forma. Conviene definirlo desde ahora.'
      },
      {
        key: 'deadline',
        label: '¿Para cuándo la necesita?',
        type: 'radio',
        required: true,
        options: ['Lo antes posible', 'Para la apertura', 'En 1 mes', 'En 2 o 3 meses', 'Sin apuro']
      }
    ]
  },
  {
    id: 'material',
    title: 'Material',
    subtitle: 'Suba lo que tenga. Puede arrastrar muchos archivos o una carpeta completa.',
    icon: UploadCloud,
    fields: [
      { key: 'files', type: 'files' },
      {
        key: 'files_pending',
        label: '¿Hay material que no pudo subir? Díganos dónde está',
        type: 'text',
        placeholder: 'Un link de Drive, o "lo envío por correo"'
      },
      { key: 'final_comments', label: '¿Algo más que quiera decirnos?', type: 'textarea', rows: 4 }
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

// --- Lógica de subida compartida ---------------------------------------------

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

const useUploader = (token, setFiles) => {
  const [queue, setQueue] = useState([]);
  const [errors, setErrors] = useState([]);

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

  const addFiles = useCallback(
    (list, category) => {
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
    },
    [processQueue]
  );

  const removeFile = useCallback(
    async (id) => {
      try {
        await fetch(`/api/briefing-files/${id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' });
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } catch {
        setErrors((prev) => [...prev, 'No se pudo eliminar el archivo']);
      }
    },
    [token, setFiles]
  );

  return { queue, errors, setErrors, addFiles, removeFile };
};

const UploadErrors = ({ errors, setErrors }) =>
  errors.length === 0 ? null : (
    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
      <div className="flex items-start gap-2 text-[13px] text-rose-700">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          {errors.slice(-4).map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
        <button type="button" onClick={() => setErrors([])} className="text-[12px] font-semibold text-rose-600 underline">
          ocultar
        </button>
      </div>
    </div>
  );

const UploadQueue = ({ queue }) =>
  queue.length === 0 ? null : (
    <div className="mt-3 space-y-2">
      {queue.map((q) => (
        <div key={q.tempId} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
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
  );

const FileRow = ({ file, onRemove }) => {
  const Icon = fileIcon(file.mime_type);
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-slate-800">{file.file_name}</p>
        <p className="text-[11.5px] text-slate-500">{formatBytes(file.file_size)}</p>
      </div>
      <Check size={15} className="text-emerald-500" />
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
};

// Adjuntar archivos dentro de una pregunta puntual (títulos, logo, etc.)
const InlineUploader = ({ token, files, setFiles, category }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const { queue, errors, setErrors, addFiles, removeFile } = useUploader(token, setFiles);
  const mine = files.filter((f) => (f.category || 'otros') === category);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files, category);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${
          dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'
        }`}
      >
        <Paperclip size={17} className="text-sky-500" />
        <span className="text-[14px] font-semibold text-slate-700">Adjuntar archivos</span>
        <span className="text-[13px] text-slate-500">o arrástrelos aquí</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files, category);
            e.target.value = '';
          }}
        />
      </div>

      <UploadErrors errors={errors} setErrors={setErrors} />
      <UploadQueue queue={queue} />

      {mine.length > 0 && (
        <ul className="mt-3 space-y-2">
          {mine.map((f) => (
            <FileRow key={f.id} file={f} onRemove={removeFile} />
          ))}
        </ul>
      )}
    </div>
  );
};

// Carga masiva con categorías (sección final)
const BulkUploader = ({ token, files, setFiles }) => {
  const fileRef = useRef(null);
  const folderRef = useRef(null);
  const [category, setCategory] = useState('instalaciones');
  const [dragOver, setDragOver] = useState(false);
  const { queue, errors, setErrors, addFiles, removeFile } = useUploader(token, setFiles);

  useEffect(() => {
    if (folderRef.current) {
      folderRef.current.setAttribute('webkitdirectory', '');
      folderRef.current.setAttribute('directory', '');
    }
  }, []);

  const totalBytes = useMemo(() => files.reduce((sum, f) => sum + Number(f.file_size || 0), 0), [files]);

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
      <p className="mb-2 text-[15px] font-semibold text-slate-800">1. ¿Qué va a subir ahora?</p>
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
          addFiles(e.dataTransfer.files, category);
        }}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'
        }`}
      >
        <UploadCloud size={36} className="mx-auto text-sky-500" />
        <p className="mt-3 text-[15px] font-semibold text-slate-800">Arrastre aquí todos los archivos que quiera</p>
        <p className="mt-1 text-[13px] text-slate-500">
          Puede subir muchos a la vez. Fotos, videos, PDF, Word. Máximo {MAX_FILE_MB} MB por archivo.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-lg bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white">
            Buscar en mi computador
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
            addFiles(e.target.files, category);
            e.target.value = '';
          }}
        />
        <input
          ref={folderRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files, category);
            e.target.value = '';
          }}
        />
      </div>

      <UploadErrors errors={errors} setErrors={setErrors} />
      <UploadQueue queue={queue} />

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
                  {grouped[cat.id].map((f) => (
                    <FileRow key={f.id} file={f} onRemove={removeFile} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Campos ------------------------------------------------------------------

const FieldLabel = ({ field }) => (
  <div className="mb-2">
    <label className="block text-[15px] font-semibold leading-snug text-slate-800">
      {field.label}
      {field.required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    {field.help && <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{field.help}</p>}
  </div>
);

const baseInput =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const ErrorMsg = ({ text }) => (
  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-600">
    <AlertCircle size={14} /> {text}
  </p>
);

const OptionButton = ({ selected, onClick, children, shape = 'circle' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
      selected
        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
        shape === 'circle' ? 'rounded-full' : 'rounded-md'
      } ${selected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}
    >
      {selected &&
        (shape === 'circle' ? (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ) : (
          <Check size={13} className="text-white" strokeWidth={3} />
        ))}
    </span>
    <span className={`text-[14.5px] ${selected ? 'font-medium text-sky-900' : 'text-slate-700'}`}>{children}</span>
  </button>
);

// Lista dinámica: el cliente va agregando ítems uno por uno
const ListField = ({ field, value, onChange, error }) => {
  const items = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState('');

  const add = (text) => {
    const clean = String(text || '').trim();
    if (!clean || items.includes(clean)) return;
    onChange(field.key, [...items, clean]);
    setDraft('');
  };

  const remove = (item) => onChange(field.key, items.filter((i) => i !== item));
  const pending = (field.suggestions || []).filter((s) => !items.includes(s));

  return (
    <div>
      <FieldLabel field={field} />

      <div className="flex gap-2">
        <input
          type="text"
          className={`${baseInput} ${error ? 'border-rose-400 ring-4 ring-rose-50' : ''}`}
          placeholder="Escriba un compromiso y presione Agregar"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-sky-600 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-sky-700"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {items.length > 0 && (
        <ol className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <span className="flex-1 text-[14.5px] text-sky-900">{item}</span>
              <button
                type="button"
                onClick={() => remove(item)}
                className="rounded-lg p-1.5 text-sky-400 transition hover:bg-white hover:text-rose-600"
                title="Quitar"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ol>
      )}

      {pending.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[12.5px] font-semibold text-slate-500">
            O toque uno de estos para agregarlo:
          </p>
          <div className="flex flex-wrap gap-2">
            {pending.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => add(s)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[13px] text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
              >
                <Plus size={13} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <ErrorMsg text={error} />}
    </div>
  );
};

// Selector de paleta cromática
const PaletteField = ({ field, value, onChange, error }) => (
  <div>
    <FieldLabel field={field} />
    <div className="grid gap-3 sm:grid-cols-2">
      {PALETTES.map((p) => {
        const selected = value === p.name;
        return (
          <button
            type="button"
            key={p.id}
            onClick={() => onChange(field.key, p.name)}
            className={`overflow-hidden rounded-2xl border text-left transition ${
              selected
                ? 'border-sky-500 ring-2 ring-sky-200'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex h-16">
              {p.colors.map((c) => (
                <span key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}
                >
                  {selected && <Check size={10} className="text-white" strokeWidth={4} />}
                </span>
                <span className={`text-[14.5px] font-semibold ${selected ? 'text-sky-900' : 'text-slate-800'}`}>
                  {p.name}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-slate-500">{p.note}</p>
            </div>
          </button>
        );
      })}
    </div>
    {error && <ErrorMsg text={error} />}
  </div>
);

// Estilo visual, mostrado sobre la paleta que el cliente ya eligió
const StylePaletteField = ({ field, value, onChange, error, paletteName }) => {
  const palette = PALETTES.find((p) => p.name === paletteName) || PALETTES[0];
  return (
    <div>
      <FieldLabel field={field} />
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5">
        <span className="text-[12.5px] font-medium text-slate-500">
          {paletteName ? 'Sobre su paleta:' : 'Elija primero una paleta arriba. Referencia:'}
        </span>
        <span className="flex overflow-hidden rounded-md border border-slate-200">
          {palette.colors.map((c) => (
            <span key={c} className="h-5 w-7" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span className="text-[12.5px] font-semibold text-slate-700">{palette.name}</span>
      </div>
      <div className="space-y-2">
        {field.options.map((opt) => (
          <OptionButton key={opt} selected={value === opt} onClick={() => onChange(field.key, opt)}>
            {opt}
          </OptionButton>
        ))}
      </div>
      {error && <ErrorMsg text={error} />}
    </div>
  );
};

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
          {field.options.map((opt) => (
            <OptionButton key={opt} selected={value === opt} onClick={() => onChange(field.key, opt)}>
              {opt}
            </OptionButton>
          ))}
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
          {field.options.map((opt) => (
            <OptionButton key={opt} shape="square" selected={arr.includes(opt)} onClick={() => toggle(opt)}>
              {opt}
            </OptionButton>
          ))}
        </div>
        {invalid && <ErrorMsg text={error} />}
      </div>
    );
  }

  return (
    <div>
      <FieldLabel field={field} />
      <input
        type="text"
        className={inputClass}
        placeholder={field.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {invalid && <ErrorMsg text={error} />}
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

  // Los datos de contacto no se preguntan: llegan en el link de invitación.
  const contact = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      name: params.get('nombre') || '',
      email: params.get('email') || '',
      phone: params.get('telefono') || ''
    };
  }, []);

  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch {
      return {};
    }
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
      const isMulti = f.type === 'checkbox' || f.type === 'list';
      const empty = isMulti ? !Array.isArray(v) || v.length === 0 : !v || !String(v).trim();
      if (empty) stepErrors[f.key] = 'Falta responder esta pregunta.';
    });
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
          contact_name: contact.name,
          contact_email: contact.email,
          contact_phone: contact.phone,
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
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Listo, recibimos todo</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Gracias por el tiempo, doctor. Con esto ya podemos proponerle la estructura y la línea gráfica de su sitio.
            Le escribimos en los próximos días.
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-500">
            Código de seguimiento: <span className="font-mono font-semibold text-slate-700">{token}</span>
          </div>
        </div>
      </div>
    );
  }

  const StepIcon = step.icon;

  const renderField = (field) => {
    if (field.type === 'files') {
      return <BulkUploader key={field.key} token={token} files={files} setFiles={setFiles} />;
    }
    if (field.type === 'upload') {
      return (
        <div key={field.key}>
          <FieldLabel field={field} />
          <InlineUploader token={token} files={files} setFiles={setFiles} category={field.category} />
        </div>
      );
    }
    if (field.type === 'list') {
      return (
        <ListField
          key={field.key}
          field={field}
          value={answers[field.key]}
          onChange={handleChange}
          error={errors[field.key]}
        />
      );
    }
    if (field.type === 'palette') {
      return (
        <PaletteField
          key={field.key}
          field={field}
          value={answers[field.key]}
          onChange={handleChange}
          error={errors[field.key]}
        />
      );
    }
    if (field.type === 'style-palette') {
      return (
        <StylePaletteField
          key={field.key}
          field={field}
          value={answers[field.key]}
          onChange={handleChange}
          error={errors[field.key]}
          paletteName={answers.palette}
        />
      );
    }
    return (
      <Field
        key={field.key}
        field={field}
        value={answers[field.key]}
        onChange={handleChange}
        error={errors[field.key]}
      />
    );
  };

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
              <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-600">
                Conecta Médica · Sitio web
              </p>
              <h1 className="text-lg font-bold leading-tight text-slate-900">
                {contact.name ? `Cuestionario para ${contact.name}` : 'Cuestionario para su clínica'}
              </h1>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
            Son 7 secciones y la mayoría se responde marcando opciones. Toma unos 15 minutos. Puede cerrar y volver
            después: lo que responda queda guardado.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 py-3 sm:px-8">
          <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
            <span>
              Sección {stepIndex + 1} de {STEPS.length} · {step.title}
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

          <div className="space-y-7">{step.fields.map(renderField)}</div>

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
              <ChevronLeft size={17} /> Atrás
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
                {submitting ? 'Enviando…' : 'Enviar'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
          <Save size={13} /> Se guarda solo. Puede cerrar y continuar después en este mismo navegador.
        </p>
      </main>
    </div>
  );
};

/**
 * Estructura del cuestionario sin iconos ni componentes, para que el panel de
 * administración muestre la pregunta completa en lugar de la clave técnica.
 */
export const BRIEFING_SECTIONS = STEPS.map((s) => ({
  id: s.id,
  title: s.title,
  fields: s.fields
    .filter((f) => f.type !== 'files' && f.type !== 'upload')
    .map((f) => ({ key: f.key, label: f.label, type: f.type }))
}));

export { FILE_CATEGORIES, PALETTES };

export default ClinicaBriefingForm;
