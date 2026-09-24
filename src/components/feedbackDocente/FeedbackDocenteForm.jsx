import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  Sparkles,
  Check,
  Plus,
  X,
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import {
  PROGRAM,
  CAREER_YEARS,
  DIMENSIONS,
  OTHER_ID,
  FREQUENCIES,
  SEVERITIES,
  competencyOf,
  currentPeriod
} from './competencias';
import usePageScroll from './usePageScroll';

/**
 * Formulario para que los docentes registren las brechas de competencias
 * transversales (habilidades blandas, pensamiento crítico, proactividad...)
 * que observan en un curso. Ruta pública: /feedback-docente-mkt
 *
 * Un envío = un curso (asignatura + año). El docente puede registrar varios
 * cursos seguidos; su nombre queda recordado en el navegador.
 */

const DRAFT_KEY = 'feedback_docente_mkt_draft';
const TEACHER_KEY = 'feedback_docente_mkt_teacher';

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStorage = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el borrador simplemente no se guarda
  }
};

const emptyForm = (teacherName = '') => ({
  teacher_name: teacherName,
  subject: '',
  career_year: null,
  period: currentPeriod(),
  observations: [],
  strengths: [],
  strengths_comment: '',
  general_comment: ''
});

const loadDraft = () => {
  try {
    const saved = JSON.parse(readStorage(DRAFT_KEY) || 'null');
    if (saved && Array.isArray(saved.observations)) return { ...emptyForm(), ...saved };
  } catch {
    // Borrador corrupto: se parte de cero
  }
  return emptyForm(readStorage(TEACHER_KEY) || '');
};

const newObservation = (competency, customLabel = '') => ({
  key: competency === OTHER_ID ? `${OTHER_ID}-${Date.now().toString(36)}` : competency,
  competency,
  custom_label: customLabel,
  frequency: null,
  severity: null,
  example: '',
  suggestion: ''
});

// --- Piezas de UI --------------------------------------------------------------

const Section = ({ number, icon: Icon, title, subtitle, children }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
        <Icon size={19} />
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

const Label = ({ children, optional }) => (
  <p className="mb-2 text-[14px] font-semibold text-slate-800">
    {children}
    {optional && <span className="ml-1.5 text-[12px] font-medium text-slate-400">(opcional)</span>}
  </p>
);

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50';

const Segmented = ({ options, value, onChange, tone }) => (
  <div className="grid grid-cols-3 gap-2">
    {options.map((opt) => {
      const active = value === opt.id;
      return (
        <button
          type="button"
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-xl border px-3 py-2.5 text-left transition ${
            active
              ? tone === 'rose'
                ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-100'
                : 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className={`block text-[13.5px] font-bold ${active ? 'text-slate-900' : 'text-slate-700'}`}>
            {opt.label}
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-tight text-slate-500">{opt.hint}</span>
        </button>
      );
    })}
  </div>
);

const Chip = ({ active, onClick, children, tone = 'sky' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition ${
      active
        ? tone === 'emerald'
          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
          : 'border-sky-500 bg-sky-50 text-sky-800'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    {active && <Check size={13} />}
    {children}
  </button>
);

// --- Formulario ----------------------------------------------------------------

const FeedbackDocenteForm = () => {
  usePageScroll();
  const [form, setForm] = useState(loadDraft);
  const [otherText, setOtherText] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (!sent) writeStorage(DRAFT_KEY, JSON.stringify(form));
  }, [form, sent]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const selectedKeys = useMemo(() => new Set(form.observations.map((o) => o.key)), [form.observations]);

  const toggleGap = (competencyId) =>
    setForm((f) => ({
      ...f,
      observations: selectedKeys.has(competencyId)
        ? f.observations.filter((o) => o.key !== competencyId)
        : [...f.observations, newObservation(competencyId)]
    }));

  const addOther = () => {
    const label = otherText.trim();
    if (!label) return;
    setForm((f) => ({ ...f, observations: [...f.observations, newObservation(OTHER_ID, label)] }));
    setOtherText('');
  };

  const updateObs = (key, patch) =>
    setForm((f) => ({ ...f, observations: f.observations.map((o) => (o.key === key ? { ...o, ...patch } : o)) }));

  const removeObs = (key) => setForm((f) => ({ ...f, observations: f.observations.filter((o) => o.key !== key) }));

  const toggleStrength = (id) =>
    setForm((f) => ({
      ...f,
      strengths: f.strengths.includes(id) ? f.strengths.filter((s) => s !== id) : [...f.strengths, id]
    }));

  const errors = useMemo(() => {
    const e = {};
    if (!form.teacher_name.trim()) e.teacher_name = 'Escriba su nombre';
    if (!form.subject.trim()) e.subject = 'Indique la asignatura';
    if (!form.career_year) e.career_year = 'Elija el año del curso';
    if (form.observations.length === 0) e.observations = 'Seleccione al menos una brecha';
    form.observations.forEach((o) => {
      if (!o.frequency || !o.severity) e[`obs_${o.key}`] = 'Indique a cuántos afecta y qué tanto';
    });
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async () => {
    setShowErrors(true);
    setSubmitError('');
    if (hasErrors) {
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        program: PROGRAM.slug,
        teacher_name: form.teacher_name.trim(),
        subject: form.subject.trim(),
        career_year: form.career_year,
        period: form.period.trim(),
        observations: form.observations.map(({ competency, custom_label, frequency, severity, example, suggestion }) => ({
          competency,
          custom_label: competency === OTHER_ID ? custom_label : '',
          frequency,
          severity,
          example: example.trim(),
          suggestion: suggestion.trim()
        })),
        // Una competencia marcada como brecha no puede quedar también como fortaleza
        strengths: form.strengths.filter((s) => !selectedKeys.has(s)),
        strengths_comment: form.strengths_comment.trim(),
        general_comment: form.general_comment.trim()
      };
      const res = await fetch('/api/feedback-docente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'No se pudo enviar. Intente nuevamente.');

      writeStorage(TEACHER_KEY, payload.teacher_name);
      writeStorage(DRAFT_KEY, null);
      setSent(payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startAnother = () => {
    setForm(emptyForm(sent?.teacher_name || ''));
    setSent(null);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const err = (key) => showErrors && errors[key];

  // --- Pantalla de agradecimiento ---
  if (sent) {
    const year = CAREER_YEARS.find((y) => y.id === sent.career_year)?.label;
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={28} />
          </span>
          <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">¡Gracias, {sent.teacher_name.split(' ')[0]}!</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
            Quedaron registradas {sent.observations.length} brecha{sent.observations.length === 1 ? '' : 's'} de{' '}
            <strong className="text-slate-700">{sent.subject}</strong> ({year}, {sent.period}).
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-1.5 text-left">
            {sent.observations.map((o, i) => (
              <li key={i} className="flex items-center gap-2 text-[13.5px] text-slate-600">
                <AlertTriangle size={13} className="shrink-0 text-amber-500" />
                {competencyOf(o.competency, o.custom_label).label}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[14px] text-slate-500">¿Hace clases en otro curso o en otro año?</p>
          <button
            onClick={startAnother}
            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-slate-700"
          >
            <RotateCcw size={16} /> Registrar otro curso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Encabezado */}
        <header className="px-1 pb-2">
          <p className="text-[12px] font-black uppercase tracking-widest text-sky-600">
            Observatorio de competencias · {PROGRAM.label}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            ¿Qué les está faltando a nuestros estudiantes?
          </h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-slate-600">
            Registre las brechas que observa en sus cursos: habilidades blandas, pensamiento crítico, carácter,
            proactividad. Con el aporte de todos los docentes vamos a ver qué se repite en cada año de la carrera y
            diseñar actividades o asignaturas que lo trabajen.
          </p>
          <p className="mt-2 text-[13px] text-slate-400">Toma unos 5 minutos por curso. Complete un formulario por cada asignatura.</p>
        </header>

        {/* 1. Curso */}
        <Section number={1} icon={GraduationCap} title="Su curso">
          <div className="grid gap-5 sm:grid-cols-2">
            <div data-error={!!err('teacher_name')}>
              <Label>Nombre del docente</Label>
              <input
                className={inputClass}
                value={form.teacher_name}
                onChange={(e) => set({ teacher_name: e.target.value })}
                placeholder="Ej: María González"
              />
              {err('teacher_name') && <p className="mt-1.5 text-[12.5px] font-semibold text-rose-600">{errors.teacher_name}</p>}
            </div>
            <div data-error={!!err('subject')}>
              <Label>Asignatura</Label>
              <input
                className={inputClass}
                value={form.subject}
                onChange={(e) => set({ subject: e.target.value })}
                placeholder="Ej: Marketing Digital"
              />
              {err('subject') && <p className="mt-1.5 text-[12.5px] font-semibold text-rose-600">{errors.subject}</p>}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_160px]">
            <div data-error={!!err('career_year')}>
              <Label>Año de la carrera</Label>
              <div className="grid grid-cols-4 gap-2">
                {CAREER_YEARS.map((y) => (
                  <button
                    type="button"
                    key={y.id}
                    onClick={() => set({ career_year: y.id })}
                    className={`rounded-xl border py-3 text-[14px] font-bold transition ${
                      form.career_year === y.id
                        ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {y.label}
                  </button>
                ))}
              </div>
              {err('career_year') && <p className="mt-1.5 text-[12.5px] font-semibold text-rose-600">{errors.career_year}</p>}
            </div>
            <div>
              <Label>Semestre</Label>
              <input className={inputClass} value={form.period} onChange={(e) => set({ period: e.target.value })} />
            </div>
          </div>
        </Section>

        {/* 2. Brechas */}
        <Section
          number={2}
          icon={AlertTriangle}
          title="Brechas que observa"
          subtitle="Marque las competencias que le cuestan a este curso. Luego indique a cuántos afecta, qué tanto y, si puede, un ejemplo concreto."
        >
          <div className="space-y-5" data-error={!!err('observations')}>
            {DIMENSIONS.map((dim) => (
              <div key={dim.id}>
                <p className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dim.color }} />
                  {dim.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dim.competencies.map((c) => (
                    <Chip key={c.id} active={selectedKeys.has(c.id)} onClick={() => toggleGap(c.id)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-slate-500">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Otra que no esté en la lista
              </p>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOther();
                    }
                  }}
                  placeholder="Ej: Manejo de Excel básico"
                />
                <button
                  type="button"
                  onClick={addOther}
                  disabled={!otherText.trim()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-[13.5px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-30"
                >
                  <Plus size={15} /> Agregar
                </button>
              </div>
            </div>

            {err('observations') && <p className="text-[12.5px] font-semibold text-rose-600">{errors.observations}</p>}
          </div>

          {form.observations.length > 0 && (
            <div className="mt-8 space-y-4 border-t border-slate-100 pt-8">
              <p className="text-[13px] font-bold text-slate-500">
                Detalle de {form.observations.length} brecha{form.observations.length === 1 ? '' : 's'} seleccionada
                {form.observations.length === 1 ? '' : 's'}
              </p>
              {form.observations.map((o) => {
                const comp = competencyOf(o.competency, o.custom_label);
                const invalid = err(`obs_${o.key}`);
                return (
                  <div
                    key={o.key}
                    data-error={!!invalid}
                    className={`rounded-2xl border bg-slate-50/60 p-5 ${invalid ? 'border-rose-300' : 'border-slate-200'}`}
                    style={{ borderLeft: `4px solid ${comp.dimension.color}` }}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{comp.dimension.label}</p>
                        <p className="text-[16px] font-bold text-slate-900">{comp.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObs(o.key)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-rose-600"
                        title="Quitar"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>¿A cuántos estudiantes del curso?</Label>
                        <Segmented options={FREQUENCIES} value={o.frequency} onChange={(v) => updateObs(o.key, { frequency: v })} />
                      </div>
                      <div>
                        <Label>¿Qué tanto afecta su desempeño?</Label>
                        <Segmented
                          options={SEVERITIES}
                          value={o.severity}
                          onChange={(v) => updateObs(o.key, { severity: v })}
                          tone="rose"
                        />
                      </div>
                      {invalid && <p className="text-[12.5px] font-semibold text-rose-600">{errors[`obs_${o.key}`]}</p>}
                      <div>
                        <Label optional>Ejemplo concreto de lo que observa</Label>
                        <textarea
                          rows={2}
                          className={inputClass}
                          value={o.example}
                          onChange={(e) => updateObs(o.key, { example: e.target.value })}
                          placeholder="Ej: En las presentaciones leen la diapositiva y no logran responder preguntas del cliente."
                        />
                      </div>
                      <div>
                        <Label optional>
                          <Lightbulb size={14} className="-mt-0.5 mr-1 inline text-amber-500" />
                          ¿Qué actividad o asignatura podría ayudar?
                        </Label>
                        <textarea
                          rows={2}
                          className={inputClass}
                          value={o.suggestion}
                          onChange={(e) => updateObs(o.key, { suggestion: e.target.value })}
                          placeholder="Ej: Simulaciones de pitch con preguntas sorpresa desde 1° año."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* 3. Fortalezas */}
        <Section
          number={3}
          icon={Sparkles}
          title="Fortalezas del curso"
          subtitle="Opcional, pero ayuda a tener el panorama completo: ¿en qué destaca este grupo?"
        >
          <div className="space-y-4">
            {DIMENSIONS.map((dim) => (
              <div key={dim.id} className="flex flex-wrap gap-2">
                {dim.competencies
                  .filter((c) => !selectedKeys.has(c.id))
                  .map((c) => (
                    <Chip key={c.id} tone="emerald" active={form.strengths.includes(c.id)} onClick={() => toggleStrength(c.id)}>
                      {c.label}
                    </Chip>
                  ))}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Label optional>Algo más que destaque</Label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.strengths_comment}
              onChange={(e) => set({ strengths_comment: e.target.value })}
              placeholder="Ej: Muy creativos en redes sociales y manejan bien herramientas de diseño."
            />
          </div>
          <div className="mt-5">
            <Label optional>Comentario general</Label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.general_comment}
              onChange={(e) => set({ general_comment: e.target.value })}
              placeholder="Cualquier observación sobre el curso, su contexto o lo que cree que falta en la malla."
            />
          </div>
        </Section>

        {/* Envío */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {showErrors && hasErrors && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[13.5px] font-semibold text-rose-700">
              <AlertCircle size={16} className="shrink-0" /> Faltan algunos datos. Revise los campos marcados en rojo.
            </div>
          )}
          {submitError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[13.5px] font-semibold text-rose-700">
              <AlertCircle size={16} className="shrink-0" /> {submitError}
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-[15px] font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
            {submitting ? 'Enviando...' : 'Enviar feedback de este curso'}
          </button>
          <p className="mt-3 text-center text-[12.5px] text-slate-400">
            Su avance se guarda en este navegador mientras completa el formulario.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDocenteForm;
