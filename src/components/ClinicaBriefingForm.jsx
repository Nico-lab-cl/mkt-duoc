import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Stethoscope,
  Building2,
  Target,
  Users,
  LayoutGrid,
  Plug,
  Palette,
  ShieldCheck,
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
  Save
} from 'lucide-react';

/**
 * Briefing web para Clínica Conecta Médica.
 * Ruta pública: /formulario-clinica-conectamedica
 * Las respuestas se guardan en la tabla `briefings` y los archivos (fotos,
 * videos, documentos) en `briefing_files` como BYTEA.
 */

const MAX_FILE_MB = 50;
const DRAFT_KEY = 'briefing_clinica_conectamedica';

const makeToken = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase().slice(0, 32);

// --- Definición declarativa del cuestionario ---------------------------------

const STEPS = [
  {
    id: 'contacto',
    title: 'Datos de contacto',
    subtitle: 'Para saber con quién coordinamos el proyecto.',
    icon: Building2,
    fields: [
      { key: 'clinic_name', label: '¿Cuál es el nombre comercial de la clínica?', type: 'text', required: true, placeholder: 'Ej: Clínica Conecta Médica' },
      { key: 'legal_name', label: 'Razón social y RUT (para facturación y aviso legal)', type: 'text', placeholder: 'Ej: Conecta Médica SpA — 76.123.456-7' },
      { key: 'contact_name', label: 'Nombre de quien responde este formulario', type: 'text', required: true },
      { key: 'contact_role', label: '¿Qué cargo ocupa dentro de la clínica?', type: 'text', placeholder: 'Ej: Directora comercial' },
      { key: 'contact_email', label: 'Correo electrónico de contacto', type: 'email', required: true },
      { key: 'contact_phone', label: 'Teléfono / WhatsApp de contacto', type: 'tel', required: true, placeholder: '+56 9 ...' },
      { key: 'decision_maker', label: '¿Quién aprueba finalmente el diseño y los textos del sitio?', type: 'text', help: 'Nombre y cargo de la persona que da el visto bueno final.' },
      { key: 'current_website', label: '¿Tienen sitio web actualmente? Indique la URL', type: 'text', placeholder: 'https:// … o escriba "No tenemos"' },
      { key: 'social_networks', label: 'Redes sociales activas (pegue los enlaces)', type: 'textarea', rows: 3, placeholder: 'Instagram: …\nFacebook: …\nLinkedIn: …\nTikTok: …' }
    ]
  },
  {
    id: 'clinica',
    title: 'Sobre la clínica',
    subtitle: 'Qué hacen, dónde y con quién. Esto define el contenido del sitio.',
    icon: Stethoscope,
    fields: [
      { key: 'years_operating', label: '¿Hace cuántos años opera la clínica?', type: 'text', placeholder: 'Ej: 8 años' },
      { key: 'specialties', label: 'Liste TODAS las especialidades y servicios que ofrecen', type: 'textarea', required: true, rows: 5, help: 'Una por línea. Serán las páginas de servicio del sitio.', placeholder: 'Medicina general\nTraumatología\nKinesiología\nExámenes de laboratorio\n…' },
      { key: 'star_services', label: '¿Cuáles son los 3 servicios que más quieren vender o potenciar?', type: 'textarea', rows: 3, help: 'Estos tendrán prioridad en la home y en la estrategia SEO.' },
      { key: 'branches', label: 'Direcciones de cada sede o sucursal', type: 'textarea', required: true, rows: 4, placeholder: 'Sede 1: Av. … , comuna, ciudad\nSede 2: …' },
      { key: 'schedules', label: 'Horarios de atención por sede', type: 'textarea', rows: 3, placeholder: 'Lun a Vie 08:00–20:00 / Sáb 09:00–14:00' },
      { key: 'staff_count', label: '¿Cuántos profesionales trabajan en la clínica?', type: 'text', placeholder: 'Ej: 12 médicos y 6 profesionales de apoyo' },
      { key: 'doctors_profiles', label: '¿Quieren una ficha individual por cada médico?', type: 'radio', options: ['Sí, con foto, especialidad y currículum', 'Sí, pero solo nombre y especialidad', 'No, solo un listado general', 'Aún no lo definimos'] },
      { key: 'insurances', label: '¿Con qué previsiones y seguros trabajan?', type: 'checkbox', options: ['Fonasa', 'Isapres (todas)', 'Isapres (algunas)', 'Seguros complementarios', 'Convenios con empresas', 'Solo particular'] },
      { key: 'insurances_detail', label: 'Detalle de convenios (si corresponde)', type: 'textarea', rows: 2 },
      { key: 'differentiators', label: '¿Qué los hace diferentes de otras clínicas de la zona?', type: 'textarea', required: true, rows: 4, help: 'Sea concreto: tecnología, tiempos de espera, atención, precios, equipo médico.' },
      { key: 'competitors', label: 'Nombre 2 o 3 competidores directos (con su web si la tienen)', type: 'textarea', rows: 3 }
    ]
  },
  {
    id: 'objetivos',
    title: 'Objetivos y público',
    subtitle: 'Para qué sirve el sitio y a quién le habla.',
    icon: Target,
    fields: [
      { key: 'main_goal', label: '¿Cuál es el objetivo PRINCIPAL del sitio web?', type: 'radio', required: true, options: ['Que los pacientes agenden hora online', 'Generar contactos / consultas por WhatsApp o formulario', 'Dar a conocer la clínica y sus especialidades', 'Entregar información y reducir llamadas telefónicas', 'Posicionarnos en Google frente a la competencia'] },
      { key: 'secondary_goals', label: 'Objetivos secundarios', type: 'checkbox', options: ['Vender exámenes o paquetes de salud', 'Captar convenios con empresas', 'Publicar contenido educativo / blog', 'Reclutar profesionales', 'Mostrar resultados y testimonios', 'Entregar resultados de exámenes online'] },
      { key: 'success_metric', label: '¿Cómo sabremos en 6 meses que el sitio fue un éxito?', type: 'textarea', required: true, rows: 3, help: 'Ej: "recibir 60 solicitudes de hora al mes", "bajar 30% las llamadas".' },
      { key: 'target_audience', label: 'Describa a su paciente ideal', type: 'textarea', required: true, rows: 4, help: 'Edad, género, comuna donde vive, situación previsional, qué lo preocupa.' },
      { key: 'geo_area', label: '¿Qué comunas o ciudades quieren cubrir?', type: 'text', placeholder: 'Ej: Viña del Mar, Valparaíso, Quilpué' },
      { key: 'patient_pain', label: '¿Cuál es la principal duda o miedo que tiene el paciente antes de contactarlos?', type: 'textarea', rows: 3, help: 'Esto se resuelve directo en el sitio y evita perder pacientes.' },
      { key: 'monthly_patients', label: '¿Cuántos pacientes atienden al mes aproximadamente?', type: 'text' },
      { key: 'current_channel', label: '¿Por dónde llegan hoy la mayoría de sus pacientes?', type: 'checkbox', options: ['Teléfono', 'WhatsApp', 'Instagram / Facebook', 'Recomendación boca a boca', 'Convenios con empresas o seguros', 'Pacientes que llegan directo al mesón', 'Google'] }
    ]
  },
  {
    id: 'estructura',
    title: 'Estructura y contenidos',
    subtitle: 'Qué páginas tendrá el sitio y quién escribe los textos.',
    icon: LayoutGrid,
    fields: [
      { key: 'pages_needed', label: '¿Qué secciones necesita el sitio?', type: 'checkbox', required: true, options: ['Inicio', 'Quiénes somos', 'Especialidades (una página por cada una)', 'Equipo médico', 'Agenda tu hora', 'Convenios y previsiones', 'Precios / aranceles', 'Exámenes y procedimientos', 'Blog / noticias de salud', 'Preguntas frecuentes', 'Testimonios de pacientes', 'Trabaja con nosotros', 'Contacto y ubicación', 'Resultados de exámenes online'] },
      { key: 'extra_pages', label: '¿Alguna otra sección que no esté en la lista?', type: 'textarea', rows: 2 },
      { key: 'content_owner', label: '¿Quién entrega los textos de cada página?', type: 'radio', required: true, options: ['Nosotros entregamos todos los textos ya redactados', 'Entregamos información base y ustedes la redactan', 'Necesitamos que ustedes redacten todo desde cero'] },
      { key: 'has_photos', label: '¿Tienen fotografías profesionales de la clínica y del equipo?', type: 'radio', required: true, options: ['Sí, tenemos banco de fotos propio', 'Tenemos algunas, faltan varias', 'No tenemos, se necesita sesión fotográfica', 'Preferimos usar banco de imágenes'] },
      { key: 'has_video', label: '¿Tienen videos institucionales o de procedimientos?', type: 'radio', options: ['Sí, tenemos videos listos', 'Tenemos material sin editar', 'No tenemos', 'Queremos producir videos nuevos'] },
      { key: 'prices_public', label: '¿Los precios se publican en el sitio?', type: 'radio', options: ['Sí, precios visibles', 'Solo rangos referenciales', 'No, se cotiza por contacto', 'Solo para convenios'] },
      { key: 'blog_frequency', label: 'Si habrá blog, ¿con qué frecuencia publicarán?', type: 'radio', options: ['Semanal', 'Quincenal', 'Mensual', 'Esporádico', 'No tendremos blog'] },
      { key: 'languages', label: '¿El sitio debe estar en más de un idioma?', type: 'radio', options: ['Solo español', 'Español e inglés', 'Otro (especificar en comentarios)'] }
    ]
  },
  {
    id: 'funcionalidades',
    title: 'Funcionalidades e integraciones',
    subtitle: 'Lo que el sitio debe hacer, no solo mostrar.',
    icon: Plug,
    fields: [
      { key: 'features', label: '¿Qué funcionalidades necesita el sitio?', type: 'checkbox', required: true, options: ['Reserva de hora online', 'Botón flotante de WhatsApp', 'Formulario de contacto', 'Chat en vivo o chatbot', 'Mapa con ubicación de cada sede', 'Pago online de la consulta', 'Descarga de documentos / órdenes médicas', 'Área privada para pacientes', 'Newsletter / suscripción por correo', 'Buscador de médicos por especialidad', 'Calculadoras o test de autoevaluación', 'Integración con Google Analytics', 'Integración con Meta Pixel'] },
      { key: 'booking_system', label: '¿Qué sistema de agenda usan hoy?', type: 'text', required: true, placeholder: 'Ej: Reservo, Agendapro, Medilink, planilla Excel, agenda en papel…' },
      { key: 'booking_integration', label: '¿La reserva online debe conectarse a ese sistema o ser independiente?', type: 'radio', options: ['Debe integrarse con nuestro sistema actual', 'Puede ser un formulario que llegue por correo/WhatsApp', 'Queremos que ustedes propongan la mejor opción', 'No aplica'] },
      { key: 'crm_tools', label: '¿Usan CRM, ERP o software clínico que deba conectarse?', type: 'textarea', rows: 2, placeholder: 'Ej: HubSpot, Salesforce, Rayen, ficha clínica propia…' },
      { key: 'whatsapp_number', label: 'Número de WhatsApp que recibirá las consultas', type: 'text' },
      { key: 'form_recipients', label: '¿A qué correos deben llegar los formularios?', type: 'textarea', rows: 2, help: 'Puede indicar más de uno, separados por coma.' },
      { key: 'who_updates', label: '¿Quién actualizará el sitio una vez publicado?', type: 'radio', options: ['Nosotros, necesitamos un panel autoadministrable', 'Ustedes, con un plan de mantención mensual', 'Mixto: nosotros el blog, ustedes lo técnico', 'Aún no lo definimos'] }
    ]
  },
  {
    id: 'diseno',
    title: 'Diseño e identidad',
    subtitle: 'Cómo se debe ver y sentir el sitio.',
    icon: Palette,
    fields: [
      { key: 'has_brandbook', label: '¿Tienen manual de marca o identidad visual definida?', type: 'radio', required: true, options: ['Sí, tenemos manual de marca completo', 'Tenemos logo y colores, sin manual', 'Solo tenemos el logo', 'No tenemos nada, hay que crearlo'] },
      { key: 'brand_colors', label: 'Colores corporativos (si los conoce, indique el código HEX)', type: 'text', placeholder: 'Ej: #0070BA / azul institucional y blanco' },
      { key: 'style_preference', label: '¿Qué estilo visual prefieren?', type: 'radio', required: true, options: ['Clínico y sobrio: blanco, azul, mucho aire', 'Cálido y cercano: fotos de personas, tonos suaves', 'Moderno y tecnológico: alto contraste, animaciones', 'Premium: tipografía elegante, tonos oscuros'] },
      { key: 'reference_sites', label: 'Pegue 2 o 3 sitios web que les gusten y diga por qué', type: 'textarea', required: true, rows: 4, help: 'Pueden ser de cualquier rubro. Indique qué les gusta de cada uno.' },
      { key: 'dislikes', label: '¿Qué NO quieren ver en su sitio bajo ninguna circunstancia?', type: 'textarea', rows: 3, placeholder: 'Ej: fotos de banco genéricas, carruseles, imágenes de sangre…' },
      { key: 'tone_of_voice', label: '¿Cómo le habla la clínica al paciente?', type: 'radio', options: ['Formal y profesional (usted)', 'Cercano y humano (tú)', 'Mixto según la sección'] },
      { key: 'accessibility', label: '¿Necesitan considerar accesibilidad para adultos mayores o personas con discapacidad?', type: 'radio', options: ['Sí, es prioritario (texto grande, alto contraste)', 'Sí, lo básico', 'No es prioridad ahora'] }
    ]
  },
  {
    id: 'legal',
    title: 'Legal, dominio y plazos',
    subtitle: 'Datos sensibles de salud, accesos técnicos y tiempos.',
    icon: ShieldCheck,
    fields: [
      { key: 'domain_owner', label: '¿Tienen el dominio comprado y a nombre de quién está?', type: 'text', required: true, placeholder: 'Ej: conectamedica.cl, a nombre de la sociedad' },
      { key: 'hosting', label: '¿Dónde está alojado el sitio actual? ¿Tienen los accesos?', type: 'textarea', rows: 2, placeholder: 'Proveedor de hosting, panel, correos corporativos…' },
      { key: 'corporate_email', label: '¿Necesitan correos corporativos (@sudominio.cl)?', type: 'radio', options: ['Sí, hay que crearlos', 'Ya los tenemos funcionando', 'Queremos migrarlos'] },
      { key: 'sensitive_data', label: '¿El sitio recogerá datos de salud del paciente (síntomas, exámenes, diagnósticos)?', type: 'radio', required: true, options: ['Sí, en formularios de reserva o pre-consulta', 'Sí, en un área privada de pacientes', 'No, solo datos de contacto básicos', 'Aún no lo definimos'], help: 'Los datos de salud son datos sensibles según la Ley 19.628 y exigen resguardos adicionales.' },
      { key: 'legal_docs', label: '¿Tienen políticas legales redactadas?', type: 'checkbox', options: ['Política de privacidad', 'Términos y condiciones', 'Política de cookies', 'Consentimiento informado', 'No tenemos ninguna'] },
      { key: 'health_authority', label: '¿La clínica cuenta con autorización sanitaria vigente que deba mostrarse en el sitio?', type: 'radio', options: ['Sí, la publicaremos', 'Sí, pero no queremos publicarla', 'No aplica'] },
      { key: 'deadline', label: '¿Para cuándo necesitan el sitio publicado?', type: 'text', required: true, placeholder: 'Ej: primera semana de octubre / no hay fecha límite' },
      { key: 'deadline_reason', label: '¿Hay algún hito que obligue esa fecha?', type: 'text', placeholder: 'Ej: apertura de nueva sede, campaña de invierno…' },
      { key: 'budget_range', label: 'Rango de presupuesto considerado para el proyecto', type: 'radio', options: ['Menos de $500.000', '$500.000 – $1.000.000', '$1.000.000 – $2.500.000', '$2.500.000 – $5.000.000', 'Más de $5.000.000', 'Preferimos que nos propongan según el alcance'] },
      { key: 'maintenance_budget', label: '¿Consideran un presupuesto mensual de mantención y contenidos?', type: 'radio', options: ['Sí', 'No', 'Depende de la propuesta'] }
    ]
  },
  {
    id: 'archivos',
    title: 'Material y archivos',
    subtitle: 'Suba logos, fotos, videos y documentos. Todo queda guardado con su formulario.',
    icon: UploadCloud,
    fields: [
      { key: 'files', label: 'Adjunte aquí todo el material disponible', type: 'files', help: `Logos, manual de marca, fotos de la clínica y del equipo, videos, listado de precios, textos ya redactados. Máximo ${MAX_FILE_MB} MB por archivo.` },
      { key: 'files_note', label: '¿Hay material que no pudo subir? Indique dónde está', type: 'textarea', rows: 2, placeholder: 'Ej: enlace a Drive, WeTransfer, se envía por correo…' },
      { key: 'final_comments', label: '¿Algo más que debamos saber antes de empezar?', type: 'textarea', rows: 5, help: 'Este es el espacio para todo lo que no calzó en las preguntas anteriores.' }
    ]
  }
];

// --- Utilidades --------------------------------------------------------------

const formatBytes = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = (mime = '') => {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return Video;
  return FileText;
};

// --- Campos ------------------------------------------------------------------

const FieldLabel = ({ field }) => (
  <div className="mb-2">
    <label className="block text-[15px] font-semibold text-slate-800 leading-snug">
      {field.label}
      {field.required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    {field.help && <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{field.help}</p>}
  </div>
);

const baseInput =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

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
                className={`w-full flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition ${
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
                <span className={`text-[15px] ${selected ? 'text-sky-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
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
    const toggle = (opt) =>
      onChange(field.key, arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt]);
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
                className={`flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition ${
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
                <span className={`text-[14px] ${selected ? 'text-sky-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
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

const ErrorMsg = ({ text }) => (
  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-600">
    <AlertCircle size={14} /> {text}
  </p>
);

// --- Subida de archivos ------------------------------------------------------

const FileUploader = ({ token, files, setFiles }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState([]);
  const [uploadError, setUploadError] = useState('');

  const readAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadOne = async (file) => {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`"${file.name}" pesa ${formatBytes(file.size)} y supera el máximo de ${MAX_FILE_MB} MB.`);
      return;
    }
    const tempId = `${file.name}-${file.size}-${Math.random()}`;
    setUploading((prev) => [...prev, { tempId, name: file.name, size: file.size }]);
    try {
      const base64 = await readAsBase64(file);
      const res = await fetch('/api/briefing-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          file_name: file.name,
          mime_type: file.type || 'application/octet-stream',
          file_size: file.size,
          data_base64: base64
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al subir el archivo');
      setFiles((prev) => [...prev, json.file]);
    } catch (err) {
      setUploadError(`No se pudo subir "${file.name}": ${err.message}`);
    } finally {
      setUploading((prev) => prev.filter((u) => u.tempId !== tempId));
    }
  };

  const handleFiles = async (list) => {
    setUploadError('');
    for (const file of Array.from(list)) {
      await uploadOne(file);
    }
  };

  const removeFile = async (id) => {
    try {
      await fetch(`/api/briefing-files/${id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' });
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setUploadError('No se pudo eliminar el archivo.');
    }
  };

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
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'
        }`}
      >
        <UploadCloud size={34} className="mx-auto text-sky-500" />
        <p className="mt-3 text-[15px] font-semibold text-slate-800">Arrastre sus archivos aquí o haga clic para buscarlos</p>
        <p className="mt-1 text-[13px] text-slate-500">
          Fotos, videos, PDF, Word, Excel, logos. Máximo {MAX_FILE_MB} MB por archivo.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {uploadError && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {(files.length > 0 || uploading.length > 0) && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => {
            const Icon = fileIcon(f.mime_type);
            return (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-slate-800">{f.file_name}</p>
                  <p className="text-[12px] text-slate-500">{formatBytes(f.file_size)}</p>
                </div>
                <Check size={16} className="text-emerald-500" />
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
          {uploading.map((u) => (
            <li
              key={u.tempId}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                <Loader2 size={17} className="animate-spin" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-slate-700">{u.name}</p>
                <p className="text-[12px] text-slate-500">Subiendo… {formatBytes(u.size)}</p>
              </div>
            </li>
          ))}
        </ul>
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
  const progress = useMemo(() => Math.round(((stepIndex) / STEPS.length) * 100), [stepIndex]);

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

  // Guardar borrador local para que el cliente no pierda lo escrito
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  }, [answers]);

  // Recuperar archivos ya subidos con este token (si recarga la página)
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
      if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        stepErrors[f.key] = 'Ingrese un correo electrónico válido.';
      }
    });
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Check size={30} className="text-emerald-600" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Formulario recibido</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Gracias. Ya tenemos toda la información y el material de <strong>{answers.clinic_name || 'su clínica'}</strong>.
            Nuestro equipo la revisará y le escribirá a <strong>{answers.contact_email}</strong> para coordinar la propuesta.
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

      {/* Encabezado */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Stethoscope size={22} />
            </span>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-600">Briefing de proyecto web</p>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Clínica Conecta Médica</h1>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
            Este cuestionario define exactamente qué debe tener su sitio web. Tómese el tiempo necesario: mientras más
            precisas sean sus respuestas, menos correcciones tendremos después. Sus respuestas se guardan
            automáticamente en este navegador.
          </p>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 py-3 sm:px-8">
          <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
            <span>
              Paso {stepIndex + 1} de {STEPS.length} · {step.title}
            </span>
            <span>{progress}% completado</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-500"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido del paso */}
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
                <div key={field.key}>
                  <FieldLabel field={field} />
                  <FileUploader token={token} files={files} setFiles={setFiles} />
                </div>
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

          {/* Navegación */}
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
                {submitting ? 'Enviando…' : 'Enviar formulario'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
          <Save size={13} /> Sus respuestas se guardan en este navegador mientras completa el formulario.
        </p>
      </main>
    </div>
  );
};

export default ClinicaBriefingForm;
