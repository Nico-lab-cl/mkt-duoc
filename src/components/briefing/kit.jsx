import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
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
  Paperclip,
  Eye,
  List,
  Layers
} from 'lucide-react';

/**
 * Motor de formularios de briefing.
 *
 * El cuestionario de la clínica nació como un componente cerrado. Al aparecer el
 * segundo cliente (campaña política) se extrajo aquí todo lo que no cambia entre
 * un formulario y otro: pasos, validación, borrador local, subida de archivos y
 * navegación. Lo único que define cada formulario es su configuración.
 *
 * El color no viaja en clases de Tailwind sino en variables CSS, así cada
 * cliente lleva su propia paleta sin tener que duplicar el motor ni pelear con
 * el purgado de clases dinámicas.
 */

export const MAX_FILE_MB = 50;
const MAX_PARALLEL_UPLOADS = 2;

export const makeToken = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase().slice(0, 32);

export const formatBytes = (bytes) => {
  const n = Number(bytes) || 0;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = (mime = '') => {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return Video;
  return FileText;
};

// --- Color -------------------------------------------------------------------

const hexToRgb = (hex) => {
  const clean = String(hex || '#000000').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0
  };
};

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;

const mix = (hex, targetHex, ratio) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(targetHex);
  return toHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio
  });
};

/** Variables CSS derivadas de un solo color de acento. */
export const themeVars = (accent) => ({
  '--bf-accent': accent,
  '--bf-accent-strong': mix(accent, '#000000', 0.16),
  '--bf-accent-soft': mix(accent, '#FFFFFF', 0.93),
  '--bf-accent-ring': mix(accent, '#FFFFFF', 0.8),
  '--bf-accent-line': mix(accent, '#FFFFFF', 0.62),
  '--bf-accent-text': mix(accent, '#000000', 0.38)
});

// --- Subida de archivos ------------------------------------------------------

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
            <Loader2 size={14} className="shrink-0 animate-spin" style={{ color: 'var(--bf-accent)' }} />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-700">{q.file.name}</span>
            <span className="text-[12px] text-slate-500">{Math.round(q.progress * 100)}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.max(q.progress * 100, 3)}%`, backgroundColor: 'var(--bf-accent)' }}
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
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'var(--bf-accent-soft)', color: 'var(--bf-accent)' }}
      >
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

/** Adjuntar archivos dentro de una pregunta puntual (retratos, logo, etc.) */
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
        className="flex cursor-pointer flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-6 text-center transition"
        style={
          dragOver
            ? { borderColor: 'var(--bf-accent)', backgroundColor: 'var(--bf-accent-soft)' }
            : { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }
        }
      >
        <Paperclip size={17} style={{ color: 'var(--bf-accent)' }} />
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

/** Carga masiva con categorías (sección final) */
const BulkUploader = ({ token, files, setFiles, categories }) => {
  const fileRef = useRef(null);
  const folderRef = useRef(null);
  const [category, setCategory] = useState(categories[0]?.id || 'otros');
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
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="rounded-xl border px-3 py-2.5 text-left transition"
              style={
                active
                  ? {
                      borderColor: 'var(--bf-accent)',
                      backgroundColor: 'var(--bf-accent-soft)',
                      boxShadow: '0 0 0 2px var(--bf-accent-ring)'
                    }
                  : { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }
              }
            >
              <span
                className="block text-[14px] font-semibold"
                style={{ color: active ? 'var(--bf-accent-text)' : '#334155' }}
              >
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
        className="cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition"
        style={
          dragOver
            ? { borderColor: 'var(--bf-accent)', backgroundColor: 'var(--bf-accent-soft)' }
            : { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }
        }
      >
        <UploadCloud size={36} className="mx-auto" style={{ color: 'var(--bf-accent)' }} />
        <p className="mt-3 text-[15px] font-semibold text-slate-800">Arrastre aquí todos los archivos que quiera</p>
        <p className="mt-1 text-[13px] text-slate-500">
          Puede subir muchos a la vez. Fotos, videos, PDF, Word. Máximo {MAX_FILE_MB} MB por archivo.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: 'var(--bf-accent)' }}
          >
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
            {categories.filter((c) => grouped[c.id]?.length).map((cat) => (
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
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-[var(--bf-accent)] focus:ring-4 focus:ring-[var(--bf-accent-ring)]';

const ErrorMsg = ({ text }) => (
  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-600">
    <AlertCircle size={14} /> {text}
  </p>
);

const OptionButton = ({ selected, onClick, children, shape = 'circle' }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition"
    style={
      selected
        ? {
            borderColor: 'var(--bf-accent)',
            backgroundColor: 'var(--bf-accent-soft)',
            boxShadow: '0 0 0 2px var(--bf-accent-ring)'
          }
        : { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }
    }
  >
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
        shape === 'circle' ? 'rounded-full' : 'rounded-md'
      }`}
      style={
        selected
          ? { borderColor: 'var(--bf-accent)', backgroundColor: 'var(--bf-accent)' }
          : { borderColor: '#CBD5E1' }
      }
    >
      {selected &&
        (shape === 'circle' ? (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ) : (
          <Check size={13} className="text-white" strokeWidth={3} />
        ))}
    </span>
    <span
      className="text-[14.5px]"
      style={selected ? { color: 'var(--bf-accent-text)', fontWeight: 500 } : { color: '#334155' }}
    >
      {children}
    </span>
  </button>
);

/** Lista dinámica: el cliente va agregando ítems uno por uno, en orden */
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
          placeholder={field.placeholder || 'Escriba uno y presione Agregar'}
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
          className="inline-flex shrink-0 items-center gap-1 rounded-xl px-4 py-3 text-[14px] font-semibold text-white transition"
          style={{ backgroundColor: 'var(--bf-accent)' }}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {items.length > 0 && (
        <ol className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl border px-4 py-2.5"
              style={{ borderColor: 'var(--bf-accent-line)', backgroundColor: 'var(--bf-accent-soft)' }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ backgroundColor: 'var(--bf-accent)' }}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-[14.5px]" style={{ color: 'var(--bf-accent-text)' }}>
                {item}
              </span>
              <button
                type="button"
                onClick={() => remove(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-rose-600"
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
          <p className="mb-2 text-[12.5px] font-semibold text-slate-500">O toque uno de estos para agregarlo:</p>
          <div className="flex flex-wrap gap-2">
            {pending.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => add(s)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[13px] text-slate-600 transition hover:bg-slate-50"
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

/** Selector de paleta cromática */
const PaletteField = ({ field, value, onChange, error, palettes }) => (
  <div>
    <FieldLabel field={field} />
    <div className="grid gap-3 sm:grid-cols-2">
      {palettes.map((p) => {
        const selected = value === p.name;
        return (
          <button
            type="button"
            key={p.id}
            onClick={() => onChange(field.key, p.name)}
            className="overflow-hidden rounded-2xl border text-left transition"
            style={
              selected
                ? { borderColor: 'var(--bf-accent)', boxShadow: '0 0 0 2px var(--bf-accent-ring)' }
                : { borderColor: '#E2E8F0' }
            }
          >
            <div className="flex h-16">
              {p.colors.map((c) => (
                <span key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                  style={
                    selected
                      ? { borderColor: 'var(--bf-accent)', backgroundColor: 'var(--bf-accent)' }
                      : { borderColor: '#CBD5E1' }
                  }
                >
                  {selected && <Check size={10} className="text-white" strokeWidth={4} />}
                </span>
                <span
                  className="text-[14.5px] font-semibold"
                  style={{ color: selected ? 'var(--bf-accent-text)' : '#1E293B' }}
                >
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

/** Estilo visual, mostrado sobre la paleta que el cliente ya eligió */
const StylePaletteField = ({ field, value, onChange, error, paletteName, palettes }) => {
  const palette = palettes.find((p) => p.name === paletteName) || palettes[0];
  return (
    <div>
      <FieldLabel field={field} />
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5">
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

// --- Runner ------------------------------------------------------------------

/**
 * Renderiza un cuestionario completo a partir de su configuración.
 *
 * config = {
 *   slug, draftKey, brand: { accent, eyebrow, title(contact), intro, icon, successTitle, successText },
 *   steps, palettes, fileCategories, subjectKey
 * }
 *
 * `subjectKey` indica qué respuesta identifica al cliente en el panel de
 * administración (se guarda en la columna `clinic_name`, que es genérica pese
 * al nombre que arrastra desde el primer formulario).
 */
export const BriefingRunner = ({ config }) => {
  const { slug, draftKey, brand, steps, palettes = [], fileCategories = [], subjectKey } = config;

  // Modo revisión: el equipo entra con ?revisar=1 para recorrer el cuestionario
  // completo sin que la validación lo frene y sin ensuciar el borrador ni la
  // base de datos. Se puede ver sección por sección o todo de corrido.
  const review = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return ['revisar', 'preview', 'admin'].some((k) => {
      const v = params.get(k);
      return v !== null && v !== '0' && v !== 'false';
    });
  }, []);

  const storageKey = review ? `${draftKey}_preview` : draftKey;
  const [showAll, setShowAll] = useState(false);

  const [token] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_token`);
    if (saved) return saved;
    const fresh = makeToken();
    localStorage.setItem(`${storageKey}_token`, fresh);
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
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
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

  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round((stepIndex / steps.length) * 100), [stepIndex, steps.length]);
  const totalQuestions = useMemo(
    () => steps.reduce((sum, s) => sum + s.fields.filter((f) => f.type !== 'files').length, 0),
    [steps]
  );

  // Una vez que el cliente elige su paleta, el formulario se viste con ella.
  const chosenPalette = palettes.find((p) => p.name === answers.palette);
  const accent = chosenPalette && !chosenPalette.neutral ? chosenPalette.colors[0] : brand.accent;
  const theme = useMemo(() => themeVars(accent), [accent]);

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
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

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
    if (review) return true; // en revisión se navega libre, sin campos obligatorios
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
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    scrollTop();
  };

  const back = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  };

  const submit = async () => {
    if (review) {
      setSubmitError('Está en modo revisión: el envío está desactivado a propósito para no crear un briefing de prueba.');
      return;
    }
    if (!validateStep()) return scrollTop();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          form_slug: slug,
          clinic_name: (subjectKey && answers[subjectKey]) || contact.name || '',
          contact_name: contact.name,
          contact_email: contact.email,
          contact_phone: contact.phone,
          answers
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'No se pudo enviar el formulario');
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_token`);
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16" style={theme}>
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          {brand.portrait ? (
            <div className="relative mx-auto h-24 w-24">
              <img
                src={brand.portrait}
                alt={brand.portraitAlt || ''}
                className="h-24 w-24 rounded-full object-cover"
                style={{ boxShadow: '0 0 0 4px #FFFFFF, 0 0 0 7px var(--bf-accent)' }}
              />
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white">
                <Check size={16} className="text-white" strokeWidth={3} />
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Check size={30} className="text-emerald-600" strokeWidth={2.5} />
            </div>
          )}
          <h1 className="mt-6 text-2xl font-bold text-slate-900">{brand.successTitle}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{brand.successText}</p>
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-500">
            Código de seguimiento: <span className="font-mono font-semibold text-slate-700">{token}</span>
          </div>
        </div>
      </div>
    );
  }

  const StepIcon = step.icon;
  const BrandIcon = brand.icon;

  const renderField = (field) => {
    if (field.type === 'files') {
      return (
        <BulkUploader key={field.key} token={token} files={files} setFiles={setFiles} categories={fileCategories} />
      );
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
          palettes={palettes}
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
          palettes={palettes}
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
    <div className="min-h-screen bg-slate-50" style={theme}>
      <div ref={topRef} />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            {brand.portrait ? (
              <img
                src={brand.portrait}
                alt={brand.portraitAlt || ''}
                className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-[72px] sm:w-[72px]"
                style={{ boxShadow: '0 0 0 3px #FFFFFF, 0 0 0 5px var(--bf-accent)' }}
              />
            ) : (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: 'var(--bf-accent)' }}
              >
                <BrandIcon size={22} />
              </span>
            )}
            <div className="min-w-0">
              <p
                className="text-[13px] font-semibold uppercase tracking-wide"
                style={{ color: 'var(--bf-accent-text)' }}
              >
                {brand.eyebrow}
              </p>
              <h1 className="text-lg font-bold leading-tight text-slate-900">{brand.title(contact)}</h1>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-5">
            <p className="flex-1 text-[14px] leading-relaxed text-slate-600">{brand.intro}</p>
            {brand.hero && stepIndex === 0 && !showAll && (
              <img
                src={brand.hero}
                alt={brand.portraitAlt || ''}
                className="hidden h-36 w-28 shrink-0 rounded-2xl object-cover object-top sm:block"
                style={{ boxShadow: '0 0 0 1px var(--bf-accent-ring)' }}
              />
            )}
          </div>
        </div>
      </header>

      {review && (
        <div className="border-b" style={{ borderColor: 'var(--bf-accent-line)', backgroundColor: 'var(--bf-accent-soft)' }}>
          <div className="mx-auto max-w-3xl px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <Eye size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--bf-accent)' }} />
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wide" style={{ color: 'var(--bf-accent-text)' }}>
                    Modo revisión · {steps.length} secciones · {totalQuestions} preguntas
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-slate-600">
                    Navegue libre, sin campos obligatorios. Nada se envía ni se guarda en el briefing real.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAll((v) => !v);
                  scrollTop();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition"
                style={{ backgroundColor: 'var(--bf-accent)' }}
              >
                {showAll ? <Layers size={15} /> : <List size={15} />}
                {showAll ? 'Ver sección por sección' : 'Ver todas las preguntas'}
              </button>
            </div>

            {!showAll && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {steps.map((s, i) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => {
                      setStepIndex(i);
                      setErrors({});
                      scrollTop();
                    }}
                    className="rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition"
                    style={
                      i === stepIndex
                        ? { borderColor: 'var(--bf-accent)', backgroundColor: 'var(--bf-accent)', color: '#FFFFFF' }
                        : { borderColor: 'var(--bf-accent-line)', backgroundColor: '#FFFFFF', color: 'var(--bf-accent-text)' }
                    }
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!showAll && (
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-3xl px-5 py-3 sm:px-8">
            <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-slate-500">
              <span className="truncate">
                Sección {stepIndex + 1} de {steps.length} · {step.title}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress, 4)}%`, backgroundColor: 'var(--bf-accent)' }}
              />
            </div>
          </div>
        </div>
      )}

      {showAll && (
        <main className="mx-auto max-w-3xl space-y-6 px-5 py-8 sm:px-8">
          {steps.map((s, si) => {
            const SIcon = s.icon;
            const visible = s.fields.filter((f) => f.type !== 'files');
            return (
              <section key={s.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="mb-8 flex items-start gap-4 border-b border-slate-100 pb-6">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'var(--bf-accent-soft)', color: 'var(--bf-accent)' }}
                  >
                    <SIcon size={23} />
                  </span>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      Sección {si + 1} de {steps.length} · {visible.length} pregunta{visible.length !== 1 ? 's' : ''}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
                    <p className="mt-1 text-[14px] text-slate-500">{s.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-7">{s.fields.map(renderField)}</div>
              </section>
            );
          })}
          <p className="pb-4 text-center text-[12px] text-slate-400">
            Fin del cuestionario · {steps.length} secciones · {totalQuestions} preguntas
          </p>
        </main>
      )}

      {!showAll && (
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-8 flex items-start gap-4 border-b border-slate-100 pb-6">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'var(--bf-accent-soft)', color: 'var(--bf-accent)' }}
            >
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

            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition"
                style={{ backgroundColor: 'var(--bf-accent)' }}
              >
                Siguiente <ChevronRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting || review}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                {review ? 'Enviar (desactivado en revisión)' : submitting ? 'Enviando…' : 'Enviar'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-slate-400">
          <Save size={13} /> Se guarda solo. Puede cerrar y continuar después en este mismo navegador.
        </p>
      </main>
      )}
    </div>
  );
};

/**
 * Estructura de un cuestionario sin iconos ni componentes, para que el panel de
 * administración muestre la pregunta completa en lugar de la clave técnica.
 */
export const sectionsOf = (steps) =>
  steps.map((s) => ({
    id: s.id,
    title: s.title,
    fields: s.fields
      .filter((f) => f.type !== 'files' && f.type !== 'upload')
      .map((f) => ({ key: f.key, label: f.label, type: f.type }))
  }));

export default BriefingRunner;
