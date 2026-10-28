import { useState, useEffect, useMemo } from 'react';
import {
  FlaskConical,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  ExternalLink,
  ArrowLeft,
  FileText,
  MessageCircle,
  Trash2,
  Flame
} from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import { checkFormEmbed, checkHeadCode } from './hubspotCode';

/**
 * Editor del equipo: /lab/:slug/editar
 *
 * Protegido con el PIN que el equipo eligió al crear su espacio (o la clave del
 * profesor). Aquí pegan los dos códigos de HubSpot; /lab/:slug los publica.
 */

const pinKey = (slug) => `lab_pin_${slug}`;
const readPin = (slug) => {
  try {
    return sessionStorage.getItem(pinKey(slug)) || '';
  } catch {
    return '';
  }
};
const writePin = (slug, value) => {
  try {
    if (value) sessionStorage.setItem(pinKey(slug), value);
    else sessionStorage.removeItem(pinKey(slug));
  } catch {
    // Sin almacenamiento: habrá que ingresar el PIN en cada visita
  }
};

const codeClass =
  'h-44 w-full resize-y rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-emerald-200 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const NOTE_STYLE = {
  ok: { icon: CheckCircle2, cls: 'text-emerald-700 bg-emerald-50' },
  warn: { icon: AlertTriangle, cls: 'text-amber-700 bg-amber-50' },
  error: { icon: XCircle, cls: 'text-rose-700 bg-rose-50' }
};

const Notes = ({ notes }) =>
  notes.length > 0 && (
    <ul className="mt-3 space-y-1.5">
      {notes.map((n, i) => {
        const { icon: Icon, cls } = NOTE_STYLE[n.level];
        return (
          <li key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold ${cls}`}>
            <Icon size={15} className="mt-0.5 shrink-0" />
            {n.text}
          </li>
        );
      })}
    </ul>
  );

const Where = ({ steps }) => (
  <ol className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
    {steps.map((s, i) => (
      <li key={i} className="flex items-center gap-1.5">
        {i > 0 && <span className="text-slate-300">›</span>}
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{s}</span>
      </li>
    ))}
  </ol>
);

const Section = ({ icon: Icon, number, title, subtitle, children }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Paso {number}</p>
        <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[14px] leading-relaxed text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const PinGate = ({ slug, error, loading, onSubmit }) => {
  const [pin, setPin] = useState('');
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(pin);
        }}
        className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Lock size={22} />
        </span>
        <h1 className="mt-4 text-xl font-black text-slate-900">Editor del equipo</h1>
        <p className="mt-1 text-[14px] text-slate-500">/lab/{slug} · Ingresa el PIN del equipo</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-[16px] tracking-widest outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
        />
        {error && <p className="mt-3 text-[13px] font-semibold text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={!pin || loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-[14px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          {loading && <Loader2 size={16} className="animate-spin" />} Entrar
        </button>
        <a href="/lab" className="mt-4 inline-block text-[13px] font-semibold text-slate-400 hover:text-slate-600">
          ← Volver a los equipos
        </a>
      </form>
    </div>
  );
};

export default function LabEditor({ slug }) {
  usePageScroll();
  const [pin, setPin] = useState(() => readPin(slug));
  const [space, setSpace] = useState(null);
  const [draft, setDraft] = useState({ form_embed: '', head_code: '', members: '' });
  const [status, setStatus] = useState({ loading: !!readPin(slug), saving: false, error: '', savedAt: null });

  const request = (method, body, withPin = pin) =>
    fetch(`/api/lab/spaces/${slug}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-lab-pin': withPin },
      body: body ? JSON.stringify(body) : undefined
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.error || 'Error del servidor'), { status: res.status });
      return data;
    });

  const unlock = async (candidate) => {
    setStatus((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await request('GET', null, candidate);
      writePin(slug, candidate);
      setPin(candidate);
      setSpace(data.space);
      setDraft({ form_embed: data.space.form_embed, head_code: data.space.head_code, members: data.space.members || '' });
      setStatus((s) => ({ ...s, loading: false }));
    } catch (err) {
      writePin(slug, '');
      setPin('');
      setStatus((s) => ({ ...s, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    // Solo al montar, con el PIN guardado en la sesión
    if (pin) unlock(pin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formNotes = useMemo(() => checkFormEmbed(draft.form_embed), [draft.form_embed]);
  const headNotes = useMemo(() => checkHeadCode(draft.head_code, draft.form_embed), [draft.head_code, draft.form_embed]);
  const dirty =
    space &&
    (draft.form_embed !== space.form_embed || draft.head_code !== space.head_code || draft.members !== (space.members || ''));

  const save = async () => {
    setStatus((s) => ({ ...s, saving: true, error: '' }));
    try {
      const data = await request('PUT', draft);
      setSpace(data.space);
      setDraft({ form_embed: data.space.form_embed, head_code: data.space.head_code, members: data.space.members || '' });
      setStatus((s) => ({ ...s, saving: false, savedAt: new Date() }));
    } catch (err) {
      setStatus((s) => ({ ...s, saving: false, error: err.message }));
    }
  };

  const remove = async () => {
    if (!window.confirm(`¿Eliminar el espacio de ${space.team_name}? Su página /lab/${slug} dejará de existir.`)) return;
    try {
      await request('DELETE');
      writePin(slug, '');
      window.location.assign('/lab');
    } catch (err) {
      setStatus((s) => ({ ...s, error: err.message }));
    }
  };

  if (!space) {
    if (status.loading && pin) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
          <Loader2 className="animate-spin" />
        </div>
      );
    }
    return <PinGate slug={slug} error={status.error} loading={status.loading} onSubmit={unlock} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="px-1 pb-2">
          <a href="/lab" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-slate-600">
            <ArrowLeft size={14} /> Todos los equipos
          </a>
          <p className="mt-5 flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-sky-600">
            <FlaskConical size={14} /> Laboratorio Martech
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">{space.team_name}</h1>
          <p className="mt-2 text-[15px] text-slate-600">
            Su página pública:{' '}
            <a href={`/lab/${slug}`} target="_blank" rel="noreferrer" className="font-bold text-sky-700 underline">
              softwarespectra.cl/lab/{slug}
            </a>
          </p>
          <input
            value={draft.members}
            onChange={(e) => setDraft({ ...draft, members: e.target.value })}
            placeholder="Integrantes del equipo"
            maxLength={300}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 outline-none focus:border-sky-500"
          />
        </header>

        <Section
          icon={FileText}
          number={1}
          title="Formulario de captura"
          subtitle="Creen el formulario (Nombre, Email, Carrera de Interés), activen el correo de seguimiento automático y copien su código de inserción."
        >
          <Where steps={['Marketing', 'Formularios', 'su formulario', 'Compartir', 'Insertar código']} />
          <textarea
            className={codeClass}
            value={draft.form_embed}
            onChange={(e) => setDraft({ ...draft, form_embed: e.target.value })}
            placeholder={'<script src="https://js.hsforms.net/forms/embed/…" defer></script>\n<div class="hs-form-frame" data-region="na1" data-form-id="…" data-portal-id="…"></div>'}
            spellCheck={false}
          />
          <Notes notes={formNotes} />
        </Section>

        <Section
          icon={MessageCircle}
          number={2}
          title="Código de seguimiento (activa el chatbot)"
          subtitle="El chatbot de HubSpot se muestra en las páginas que tienen el código de seguimiento de su cuenta. Este código va en el <head> de su página."
        >
          <Where steps={['⚙ Configuración', 'Seguimiento y análisis', 'Código de seguimiento', 'Copiar']} />
          <textarea
            className={codeClass}
            value={draft.head_code}
            onChange={(e) => setDraft({ ...draft, head_code: e.target.value })}
            placeholder={'<!-- Start of HubSpot Embed Code -->\n<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/….js"></script>\n<!-- End of HubSpot Embed Code -->'}
            spellCheck={false}
          />
          <Notes notes={headNotes} />
          <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
            El bot se arma en <strong className="text-slate-700">Conversaciones › Chatflows</strong>. En la pestaña de
            orientación del chatflow, dejen que se muestre en todas las páginas (o en la URL de su página del laboratorio)
            y publíquenlo.
          </p>
        </Section>

        <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <button
            onClick={save}
            disabled={!dirty || status.saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-[14px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            {status.saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar y publicar
          </button>
          <a
            href={`/lab/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-[14px] font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <ExternalLink size={15} /> Ver mi página
          </a>
          <span className="text-[13px] font-semibold">
            {status.error ? (
              <span className="flex items-center gap-1.5 text-rose-600">
                <AlertCircle size={14} /> {status.error}
              </span>
            ) : dirty ? (
              <span className="text-amber-600">Cambios sin guardar</span>
            ) : status.savedAt ? (
              <span className="text-emerald-600">Publicado · recarguen su página para verlo</span>
            ) : null}
          </span>
        </div>

        <section className="rounded-3xl border border-orange-200 bg-orange-50/60 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <Flame size={18} className="text-orange-500" /> La prueba de fuego
          </h2>
          <p className="mt-1 text-[14px] text-slate-600">
            Otro equipo abre su página, completa el formulario o conversa con el bot. Proyecten su HubSpot y muestren:
          </p>
          <ol className="mt-4 space-y-2 text-[14px] text-slate-700">
            <li>1. El mensaje de agradecimiento aparece en la página.</li>
            <li>2. El contacto nuevo está en <strong>CRM › Contactos</strong> con su Carrera de Interés.</li>
            <li>3. La lista activa de la clase anterior lo sumó.</li>
            <li>4. El correo de seguimiento llegó a la bandeja de entrada.</li>
            <li>5. En <strong>Marketing › Formularios › Análisis</strong> ven las visitas y los envíos.</li>
          </ol>
        </section>

        <button
          onClick={remove}
          className="inline-flex items-center gap-1.5 px-1 text-[13px] font-semibold text-slate-400 transition hover:text-rose-600"
        >
          <Trash2 size={14} /> Eliminar el espacio del equipo
        </button>
      </div>
    </div>
  );
}
