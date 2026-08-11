import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Stethoscope,
  Building2,
  ClipboardList,
  HeartPulse,
  UserCheck,
  Monitor,
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
  FolderOpen
} from 'lucide-react';

/**
 * Briefing para el sitio web de una clínica nueva.
 * Ruta pública: /formulario-clinica-conectamedica
 *
 * Lo responde un médico, no un encargado de marketing: preguntas concretas,
 * mayoría de selección, sin jerga publicitaria y sin dar por hecho un historial
 * que una clínica recién abierta todavía no tiene.
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
  { id: 'equipo', label: 'Fotos del equipo', hint: 'Suya y de quienes trabajarán con usted' },
  { id: 'videos', label: 'Videos', hint: 'Cualquier video que tenga' },
  { id: 'documentos', label: 'Documentos', hint: 'Aranceles, títulos, convenios, textos' },
  { id: 'otros', label: 'Otros', hint: 'Lo que no calce en las anteriores' }
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
          'Odontología',
          'Medicina estética',
          'Toma de exámenes',
          'Imagenología / ecografía'
        ]
      },
      { key: 'specialties_other', label: '¿Alguna otra que no esté en la lista?', type: 'text' },
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
      }
    ]
  },
  {
    id: 'prestaciones',
    title: 'Qué se va a atender',
    subtitle: 'Qué resuelve usted en su box y qué deriva.',
    icon: ClipboardList,
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
      { key: 'derive', label: '¿Qué va a derivar a otro centro?', type: 'text', placeholder: 'Ej: resonancias, cirugías mayores' },
      {
        key: 'ages',
        label: '¿Qué edades va a atender?',
        type: 'checkbox',
        required: true,
        options: ['Lactantes', 'Niños', 'Adolescentes', 'Adultos', 'Adultos mayores']
      },
      {
        key: 'urgency',
        label: '¿Va a atender sin hora?',
        type: 'radio',
        required: true,
        options: [
          'Sí, atendemos espontáneos todos los días',
          'Sí, pero solo en horarios acotados',
          'No, solo con hora agendada',
          'Aún no lo decidimos'
        ]
      },
      {
        key: 'appointment_length',
        label: '¿Cuánto va a durar una consulta?',
        type: 'radio',
        options: ['15 minutos', '20 minutos', '30 minutos', '45 minutos o más', 'Depende de la especialidad'],
        help: 'Si dura más que el promedio, es un argumento fuerte y conviene decirlo en la web.'
      },
      {
        key: 'extra_modes',
        label: '¿Va a ofrecer alguna de estas modalidades?',
        type: 'checkbox',
        options: ['Telemedicina', 'Visita domiciliaria', 'Atención a empresas', 'Convenios con colegios', 'Atención de fin de semana']
      },
      { key: 'price_consult', label: '¿Cuánto va a costar una consulta particular?', type: 'text', placeholder: 'Ej: $30.000' },
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
    id: 'pacientes',
    title: 'Sus pacientes',
    subtitle: 'A quién va a atender y cómo va a llegar a usted.',
    icon: HeartPulse,
    fields: [
      {
        key: 'first_patients',
        label: '¿De dónde cree que van a llegar sus primeros pacientes?',
        type: 'checkbox',
        required: true,
        options: [
          'Pacientes que ya me siguen de otro centro',
          'Derivaciones de colegas',
          'Vecinos del sector',
          'Convenios con empresas',
          'Redes sociales',
          'Google',
          'Partimos de cero'
        ]
      },
      {
        key: 'patient_type',
        label: '¿Qué tipo de paciente espera atender más?',
        type: 'checkbox',
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
      { key: 'area', label: '¿De qué comunas espera que vengan?', type: 'text' },
      {
        key: 'patient_questions',
        label: '¿Qué le preguntan siempre sus pacientes en la consulta?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Las dudas que repiten todos. Si las dejamos respondidas en la web, le ahorra explicarlas cien veces.'
      },
      {
        key: 'why_delay',
        label: 'Por su experiencia, ¿por qué la gente posterga ir al médico?',
        type: 'checkbox',
        options: [
          'Miedo a que le encuentren algo',
          'Por plata',
          'No consigue hora a tiempo',
          'No sabe a qué especialista ir',
          'Malas experiencias anteriores',
          'No tiene tiempo por el trabajo',
          'Piensa que se le va a pasar solo'
        ],
        help: 'Cada uno de estos motivos se puede desarmar con lo que ponemos en la web.'
      },
      {
        key: 'who_books',
        label: '¿Quién va a pedir la hora normalmente?',
        type: 'radio',
        options: [
          'El propio paciente',
          'Un familiar (hijo, pareja, cuidador)',
          'La secretaria de una empresa',
          'De todo un poco'
        ],
        help: 'Si agenda la hija para la madre, la web le tiene que hablar a la hija.'
      }
    ]
  },
  {
    id: 'atencion',
    title: 'Su forma de atender',
    subtitle: 'Esto es lo que va a diferenciar a su clínica. Responda como se lo diría a un colega.',
    icon: UserCheck,
    fields: [
      {
        key: 'why_opened',
        label: '¿Por qué decidió abrir su propia clínica?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Con sus palabras. Esta respuesta suele terminar siendo el texto que más conecta con el paciente.'
      },
      {
        key: 'what_annoys',
        label: '¿Qué le molesta de cómo se atiende a los pacientes en otros centros?',
        type: 'textarea',
        required: true,
        rows: 4,
        help: 'Sea directo. Lo que a usted le molesta como médico suele ser exactamente lo que al paciente le molesta como paciente.'
      },
      {
        key: 'what_different',
        label: '¿Qué va a hacer distinto?',
        type: 'checkbox',
        required: true,
        options: [
          'Consultas más largas, sin apurar',
          'Dar hora para el mismo día o el siguiente',
          'Que siempre lo vea el mismo médico',
          'Explicar en palabras simples, sin tecnicismos',
          'Entregar resultados rápido',
          'Precios claros desde el principio',
          'Responder dudas por WhatsApp',
          'No pedir exámenes que no se necesitan',
          'Atender con puntualidad',
          'Acompañar todo el tratamiento, no solo la consulta'
        ]
      },
      {
        key: 'commitment',
        label: '¿Con qué se compromete siempre, pase lo que pase?',
        type: 'text',
        placeholder: 'Ej: nunca atender con más de 20 minutos de atraso',
        help: 'Una sola cosa que pueda cumplir el 100% de las veces vale más que una lista de buenas intenciones.'
      },
      {
        key: 'wont_do',
        label: '¿Qué no va a hacer nunca en su clínica?',
        type: 'text',
        placeholder: 'Ej: vender tratamientos que el paciente no necesita'
      },
      {
        key: 'credentials',
        label: 'Su formación y la del equipo',
        type: 'textarea',
        rows: 3,
        help: 'Universidad, especialidad, años de experiencia, dónde trabajó antes, sociedades a las que pertenece.'
      },
      {
        key: 'nearby_centers',
        label: '¿Qué otros centros hay cerca?',
        type: 'text',
        help: 'Para saber contra qué compite en el sector.'
      }
    ]
  },
  {
    id: 'web',
    title: 'Cómo quiere la web',
    subtitle: 'Lo último antes del material.',
    icon: Monitor,
    fields: [
      {
        key: 'main_action',
        label: 'Cuando alguien entre a la web, ¿qué quiere que haga?',
        type: 'radio',
        required: true,
        options: [
          'Que pida hora ahí mismo',
          'Que escriba por WhatsApp',
          'Que llame por teléfono',
          'Que deje sus datos y lo contactamos',
          'Que conozca la clínica y decida después'
        ]
      },
      {
        key: 'booking_system',
        label: '¿Cómo va a manejar la agenda?',
        type: 'radio',
        required: true,
        options: [
          'Con un sistema de agenda (Reservo, Agendapro, Medilink u otro)',
          'Por WhatsApp',
          'Por teléfono con una secretaria',
          'Con una planilla propia',
          'Todavía no lo defino'
        ]
      },
      { key: 'booking_detail', label: 'Si usa un sistema, ¿cuál?', type: 'text' },
      { key: 'whatsapp', label: '¿Qué número va a recibir los WhatsApp de pacientes?', type: 'text' },
      { key: 'lead_email', label: '¿A qué correo quiere que lleguen las solicitudes de hora?', type: 'text' },
      {
        key: 'sections',
        label: '¿Qué quiere que tenga la web?',
        type: 'checkbox',
        required: true,
        options: [
          'Inicio',
          'Especialidades',
          'Quién soy / el equipo',
          'Pedir hora',
          'Precios y convenios',
          'Preguntas frecuentes',
          'Cómo llegar y estacionamiento',
          'Contacto',
          'Blog de salud',
          'Trabaja con nosotros'
        ]
      },
      {
        key: 'style',
        label: '¿Cómo quiere que se vea?',
        type: 'radio',
        required: true,
        options: [
          'Limpia y sobria: blanco, azul, ordenada',
          'Cálida y cercana: fotos de personas, colores suaves',
          'Moderna: colores fuertes, movimiento',
          'Elegante y seria: tonos oscuros, tipografía fina'
        ]
      },
      { key: 'references', label: '¿Alguna web que le guste? Pegue el link', type: 'textarea', rows: 3 },
      { key: 'dislikes', label: '¿Algo que no quiera ver en su web?', type: 'text', placeholder: 'Ej: fotos de bancos de imágenes, imágenes de sangre' },
      {
        key: 'logo_status',
        label: '¿Tiene logo?',
        type: 'radio',
        required: true,
        options: ['Sí, con manual de marca', 'Sí, solo el logo', 'Lo están haciendo', 'No tengo, hay que crearlo']
      },
      { key: 'colors', label: '¿Colores que quiera usar?', type: 'text' },
      {
        key: 'domain',
        label: '¿Ya compró el dominio (la dirección .cl)?',
        type: 'radio',
        required: true,
        options: ['Sí, ya lo tengo', 'No, necesito que lo compren', 'No sé qué es eso']
      },
      { key: 'domain_name', label: 'Si lo tiene, ¿cuál es?', type: 'text' },
      {
        key: 'sensitive_data',
        label: '¿La web va a pedirle al paciente que cuente sus síntomas o antecedentes?',
        type: 'radio',
        options: ['Sí, en el formulario de hora', 'No, solo nombre y teléfono', 'Aún no lo defino'],
        help: 'Los datos de salud son datos sensibles por ley y hay que resguardarlos de otra forma. Conviene saberlo desde ahora.'
      },
      {
        key: 'deadline',
        label: '¿Para cuándo la necesita?',
        type: 'radio',
        required: true,
        options: ['Lo antes posible', 'Para la apertura', 'En 1 mes', 'En 2 o 3 meses', 'Sin apuro']
      },
      {
        key: 'who_updates',
        label: '¿Quién va a actualizar la web después?',
        type: 'radio',
        options: ['Prefiero poder editarla yo', 'Prefiero que ustedes la mantengan', 'Todavía no lo pienso']
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
      {
        key: 'final_comments',
        label: '¿Algo más que quiera decirnos?',
        type: 'textarea',
        rows: 4
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
          addFiles(e.dataTransfer.files);
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

  // Los datos de contacto no se preguntan: llegan en el link de invitación y se
  // guardan junto al briefing sin ocupar tiempo del médico.
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
      const empty = f.type === 'checkbox' ? !Array.isArray(v) || v.length === 0 : !v || !String(v).trim();
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
            Gracias por el tiempo, doctor. Con esto ya podemos proponerle la estructura de su sitio. Le escribimos en
            los próximos días.
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
              <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-600">
                Conecta Médica · Sitio web
              </p>
              <h1 className="text-lg font-bold leading-tight text-slate-900">
                {contact.name ? `Cuestionario para ${contact.name}` : 'Cuestionario para su clínica'}
              </h1>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
            Son 6 secciones y la mayoría se responde marcando opciones. Toma unos 10 minutos. Puede cerrar y volver
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

export default ClinicaBriefingForm;
