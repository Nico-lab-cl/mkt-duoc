import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Lock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
  Trash2,
  X,
  Users,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Lightbulb,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Inbox,
  PieChart,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import {
  PROGRAM,
  CAMPUS,
  CAREER_YEARS,
  DIMENSIONS,
  FREQUENCIES,
  SEVERITIES,
  periodLabel,
  OTHER_ID,
  competencyOf,
  frequencyOf,
  severityOf,
  scoreOf
} from './competencias';
import usePageScroll from './usePageScroll';
import Donut from './Donut';

/**
 * Panel de resultados del feedback docente: /feedback-docente-mkt/resultados
 *
 * Protegido con una clave compartida (FEEDBACK_PANEL_KEY en el servidor) para
 * poder mostrarlo a coordinación sin crearles un usuario admin del simulador.
 * Todo el conteo se hace aquí: el volumen esperado son decenas de registros.
 */

const KEY_STORAGE = 'feedback_docente_panel_key';

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
};
const writeKey = (value) => {
  try {
    if (value) sessionStorage.setItem(KEY_STORAGE, value);
    else sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    // Sin almacenamiento: habrá que ingresar la clave en cada visita
  }
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

const yearLabel = (id) => CAREER_YEARS.find((y) => y.id === Number(id))?.label || `${id}°`;

// Las brechas "otra" se agrupan por su texto para que dos docentes que escriben lo mismo sumen
const groupKey = (o) =>
  o.competency === OTHER_ID ? `${OTHER_ID}:${(o.custom_label || '').trim().toLowerCase()}` : o.competency;

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'brechas', label: 'Brechas', icon: AlertTriangle },
  { id: 'anio', label: 'Por año', icon: GraduationCap },
  { id: 'fortalezas', label: 'Fortalezas', icon: Sparkles },
  { id: 'propuestas', label: 'Propuestas y comentarios', icon: Lightbulb },
  { id: 'registros', label: 'Registros', icon: ClipboardList }
];

// Escala ordinal de un solo tono (claro → oscuro) para leve/moderado/crítico,
// algunos/varios/mayoría y 1° a 4° año: el orden se lee en la intensidad.
const ORDINAL_3 = ['#86b6ef', '#2a78d6', '#104281'];
const ORDINAL_4 = ['#9ec5f4', '#5598e7', '#256abf', '#104281'];
const OTHER_COLOR = '#94a3b8';

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// --- Pantalla de clave ---------------------------------------------------------

const KeyGate = ({ onSubmit, error, loading }) => {
  const [value, setValue] = useState('');
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onSubmit(value.trim());
        }}
        className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <img src="/logo-duoc-uc.png" alt="Duoc UC" className="mb-6 h-8 w-auto" />
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 text-xl font-black tracking-tight text-slate-900">Resultados del feedback docente</h1>
        <p className="mt-1 text-[14px] text-slate-500">{PROGRAM.label} · Ingresa la clave del panel</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] outline-none focus:border-sky-400 focus:bg-white"
          placeholder="Clave"
        />
        {error && <p className="mt-2 text-[13px] font-semibold text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-[14px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />} Entrar
        </button>
      </form>
    </div>
  );
};

// --- Piezas del panel ----------------------------------------------------------

const Card = ({ title, icon: Icon, subtitle, children, action }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="flex items-center gap-2 text-[13px] font-black uppercase tracking-wider text-slate-800">
          {Icon && <Icon size={16} className="text-sky-600" />} {title}
        </h3>
        {subtitle && <p className="mt-1 text-[12.5px] text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Stat = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-1 truncate text-3xl font-black tracking-tight text-slate-900">{value}</p>
    {hint && <p className="mt-0.5 truncate text-[12.5px] text-slate-500">{hint}</p>}
  </div>
);

const Select = ({ value, onChange, options, allLabel }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13.5px] font-semibold text-slate-700 outline-none focus:border-sky-400"
  >
    <option value="">{allLabel}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

// --- Panel ---------------------------------------------------------------------

const FeedbackDocentePanel = () => {
  usePageScroll();
  const [panelKey, setPanelKey] = useState(readKey);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyError, setKeyError] = useState('');

  const [filterYear, setFilterYear] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [focusGap, setFocusGap] = useState(null);
  const [tab, setTab] = useState('resumen');
  const [dimFilter, setDimFilter] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async (key) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/feedback-docente/resultados', { headers: { 'x-panel-key': key } });
      if (res.status === 401) {
        writeKey('');
        setPanelKey('');
        setRows(null);
        setKeyError('Clave incorrecta');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudieron cargar los resultados');
      writeKey(key);
      setPanelKey(key);
      setKeyError('');
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Solo al montar, con la clave de la sesión: después la carga la disparan el
    // formulario de clave o el botón actualizar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (panelKey) load(panelKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/feedback-docente/${id}`, { method: 'DELETE', headers: { 'x-panel-key': panelKey } });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'No se pudo eliminar');
      setConfirmDelete(null);
      setRows((r) => r.filter((row) => row.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Agregaciones ---

  const all = useMemo(() => rows || [], [rows]);

  const periods = useMemo(() => [...new Set(all.map((r) => r.period).filter(Boolean))].sort().reverse(), [all]);
  const subjects = useMemo(() => [...new Set(all.map((r) => r.subject).filter(Boolean))].sort(), [all]);

  const filtered = useMemo(
    () =>
      all.filter(
        (r) =>
          (!filterYear || String(r.career_year) === filterYear) &&
          (!filterPeriod || r.period === filterPeriod) &&
          (!filterSubject || r.subject === filterSubject)
      ),
    [all, filterYear, filterPeriod, filterSubject]
  );

  // Una fila por brecha, con el contexto del curso que la reportó
  const observations = useMemo(
    () =>
      filtered.flatMap((r) =>
        (r.observations || []).map((o) => ({
          ...o,
          key: groupKey(o),
          score: scoreOf(o),
          row: r
        }))
      ),
    [filtered]
  );

  const ranking = useMemo(() => {
    const map = new Map();
    observations.forEach((o) => {
      if (!map.has(o.key)) {
        map.set(o.key, { key: o.key, comp: competencyOf(o.competency, o.custom_label), count: 0, score: 0, critical: 0, items: [] });
      }
      const g = map.get(o.key);
      g.count += 1;
      g.score += o.score;
      if (o.severity === 'critico') g.critical += 1;
      g.items.push(o);
    });
    return [...map.values()].sort((a, b) => b.score - a.score || b.count - a.count);
  }, [observations]);

  const maxScore = ranking[0]?.score || 1;

  // Matriz competencia × año sobre todo el set (ignora el filtro de año para poder comparar)
  const matrix = useMemo(() => {
    const base = all.filter(
      (r) => (!filterPeriod || r.period === filterPeriod) && (!filterSubject || r.subject === filterSubject)
    );
    const coursesPerYear = Object.fromEntries(CAREER_YEARS.map((y) => [y.id, 0]));
    const cells = new Map();
    base.forEach((r) => {
      coursesPerYear[r.career_year] = (coursesPerYear[r.career_year] || 0) + 1;
      (r.observations || []).forEach((o) => {
        const k = groupKey(o);
        if (!cells.has(k)) cells.set(k, { key: k, comp: competencyOf(o.competency, o.custom_label), byYear: {}, total: 0 });
        const c = cells.get(k);
        c.byYear[r.career_year] = (c.byYear[r.career_year] || 0) + 1;
        c.total += 1;
      });
    });
    return { coursesPerYear, rows: [...cells.values()].sort((a, b) => b.total - a.total).slice(0, 15) };
  }, [all, filterPeriod, filterSubject]);

  // El color sigue a la dimensión (orden fijo de la taxonomía), nunca a su posición en el ranking
  const countByDimension = (ids) => {
    const counts = {};
    ids.forEach((dimId) => (counts[dimId] = (counts[dimId] || 0) + 1));
    return [
      ...DIMENSIONS.map((d) => ({ id: d.id, label: d.label, color: d.color, value: counts[d.id] || 0 })),
      { id: OTHER_ID, label: 'Otras', color: OTHER_COLOR, value: counts[OTHER_ID] || 0 }
    ];
  };

  const dimensionSlices = useMemo(
    () => countByDimension(observations.map((o) => competencyOf(o.competency, o.custom_label).dimension.id)),
    [observations]
  );

  const severitySlices = useMemo(
    () =>
      SEVERITIES.map((sv, i) => ({
        id: sv.id,
        label: sv.label,
        color: ORDINAL_3[i],
        value: observations.filter((o) => o.severity === sv.id).length
      })),
    [observations]
  );

  const frequencySlices = useMemo(
    () =>
      FREQUENCIES.map((f, i) => ({
        id: f.id,
        label: f.label,
        color: ORDINAL_3[i],
        value: observations.filter((o) => o.frequency === f.id).length
      })),
    [observations]
  );

  const yearSlices = useMemo(
    () =>
      CAREER_YEARS.map((y, i) => ({
        id: String(y.id),
        label: y.label,
        color: ORDINAL_4[i],
        value: observations.filter((o) => Number(o.row.career_year) === y.id).length
      })),
    [observations]
  );

  const visibleRanking = useMemo(
    () => (dimFilter ? ranking.filter((g) => g.comp.dimension.id === dimFilter) : ranking),
    [ranking, dimFilter]
  );

  const strengths = useMemo(() => {
    const counts = {};
    filtered.forEach((r) => (r.strengths || []).forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
    return Object.entries(counts)
      .map(([id, count]) => ({ comp: competencyOf(id), count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const strengthSlices = useMemo(
    () =>
      countByDimension(
        filtered.flatMap((r) => (r.strengths || []).map((id) => competencyOf(id).dimension.id))
      ),
    [filtered]
  );

  const suggestions = useMemo(() => observations.filter((o) => o.suggestion), [observations]);

  const teachers = new Set(filtered.map((r) => r.teacher_name.trim().toLowerCase())).size;

  const exportCsv = () => {
    const header = [
      'Fecha', 'Sede', 'Docente', 'Asignatura', 'Año de carrera', 'Semestre', 'Dimensión', 'Competencia',
      'Frecuencia', 'Impacto', 'Puntaje', 'Ejemplo', 'Propuesta'
    ];
    const lines = observations.map((o) => {
      const comp = competencyOf(o.competency, o.custom_label);
      return [
        formatDate(o.row.created_at), o.row.campus || CAMPUS, o.row.teacher_name, o.row.subject, yearLabel(o.row.career_year),
        periodLabel(o.row.period),
        comp.dimension.label, comp.label, frequencyOf(o.frequency)?.label, severityOf(o.severity)?.label,
        o.score, o.example, o.suggestion
      ].map(csvCell).join(';');
    });
    // BOM para que Excel abra bien las tildes
    const blob = new Blob(['﻿' + [header.map(csvCell).join(';'), ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-docente-${PROGRAM.slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Render ---

  if (!rows) {
    if (panelKey && loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      );
    }
    return <KeyGate onSubmit={load} error={keyError || error} loading={loading} />;
  }

  const focused = focusGap && ranking.find((g) => g.key === focusGap);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Encabezado */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <img src="/logo-duoc-uc.png" alt="Duoc UC" className="mb-5 h-8 w-auto" />
            <p className="text-[12px] font-black uppercase tracking-widest text-sky-600">
              Observatorio de competencias · {PROGRAM.label} · {CAMPUS.replace('Duoc UC · ', '')}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Resultados del feedback docente</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={PROGRAM.publicPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold text-sky-700 hover:bg-sky-50"
            >
              Ver formulario <ExternalLink size={13} />
            </a>
            <button
              onClick={() => load(panelKey)}
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-white hover:text-sky-600"
              title="Actualizar"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={exportCsv}
              disabled={observations.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-30"
            >
              <Download size={14} /> Exportar a Excel
            </button>
            <button
              onClick={() => {
                writeKey('');
                setPanelKey('');
                setRows(null);
              }}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
              title="Salir"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3">
            <AlertCircle size={17} className="shrink-0 text-rose-500" />
            <p className="flex-1 text-[13.5px] font-semibold text-rose-700">{error}</p>
            <button onClick={() => setError('')} className="text-[12px] font-bold text-rose-500 underline">
              cerrar
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filterYear}
            onChange={setFilterYear}
            allLabel="Todos los años"
            options={CAREER_YEARS.map((y) => ({ value: String(y.id), label: y.label }))}
          />
          <Select
            value={filterPeriod}
            onChange={setFilterPeriod}
            allLabel="Todos los semestres"
            options={periods.map((p) => ({ value: p, label: periodLabel(p) }))}
          />
          <Select
            value={filterSubject}
            onChange={setFilterSubject}
            allLabel="Todas las asignaturas"
            options={subjects.map((s) => ({ value: s, label: s }))}
          />
          {(filterYear || filterPeriod || filterSubject) && (
            <button
              onClick={() => {
                setFilterYear('');
                setFilterPeriod('');
                setFilterSubject('');
              }}
              className="inline-flex items-center gap-1 px-2 text-[13px] font-bold text-slate-500 hover:text-slate-800"
            >
              <X size={14} /> Limpiar
            </button>
          )}
        </div>

        {all.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
            <Inbox size={40} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[15px] font-bold text-slate-500">Todavía no llega ningún registro</p>
            <p className="mt-1 text-[13.5px] text-slate-400">
              Comparte con los docentes el link{' '}
              <span className="font-mono text-slate-600">{window.location.origin + PROGRAM.publicPath}</span>
            </p>
          </div>
        ) : (
          <>
            {/* Pestañas */}
            <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-bold transition ${
                    tab === t.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </div>

            {tab === 'resumen' && (
              <>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Stat label="Cursos registrados" value={filtered.length} hint={`${subjects.length} asignaturas en total`} />
                  <Stat label="Docentes" value={teachers} />
                  <Stat label="Brechas reportadas" value={observations.length} hint={`${suggestions.length} con propuesta`} />
                  <Stat label="Brecha #1" value={ranking[0] ? ranking[0].count : '—'} hint={ranking[0]?.comp.label || 'Sin datos'} />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card title="Brechas por dimensión" icon={PieChart}>
                    <Donut data={dimensionSlices} centerLabel="brechas" />
                  </Card>
                  <Card title="Impacto en el desempeño" icon={AlertTriangle}>
                    <Donut data={severitySlices} centerLabel="brechas" />
                  </Card>
                  <Card title="Alcance en el curso" icon={Users}>
                    <Donut data={frequencySlices} centerLabel="brechas" />
                  </Card>
                </div>
              </>
            )}

            {tab === 'brechas' && (
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <Card title="Por dimensión" icon={PieChart} subtitle="Haz clic en una porción para ver solo esa dimensión.">
                  <Donut data={dimensionSlices} centerLabel="brechas" selected={dimFilter} onSelect={setDimFilter} />
                </Card>
                <Card
                  title={dimFilter ? `Brechas · ${dimensionSlices.find((d) => d.id === dimFilter)?.label || ''}` : 'Ranking de brechas'}
                  icon={TrendingUp}
                  subtitle="Puntaje = alcance × impacto (1 a 9 por reporte). Haz clic para ver ejemplos."
                  action={
                    dimFilter && (
                      <button onClick={() => setDimFilter(null)} className="shrink-0 text-[12px] font-bold text-sky-600 hover:underline">
                        Ver todas
                      </button>
                    )
                  }
                >
                  {visibleRanking.length === 0 ? (
                    <p className="py-8 text-center text-[13.5px] text-slate-400">Sin brechas para este filtro</p>
                  ) : (
                    <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
                      {visibleRanking.map((g, i) => (
                        <button
                          key={g.key}
                          onClick={() => setFocusGap(g.key)}
                          className="group w-full rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="truncate text-[13.5px] font-semibold text-slate-800">
                              <span className="mr-2 inline-block w-5 text-right text-slate-400">{i + 1}</span>
                              {g.comp.label}
                            </p>
                            <p className="shrink-0 text-[12px] text-slate-500">
                              <strong className="text-slate-800">{g.count}</strong> reporte{g.count === 1 ? '' : 's'}
                              {g.critical > 0 && (
                                <span className="ml-2 font-bold text-rose-600">
                                  {g.critical} crítico{g.critical === 1 ? '' : 's'}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="ml-7 mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(g.score / maxScore) * 100}%`, backgroundColor: g.comp.dimension.color }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {tab === 'anio' && (
              <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <Card title="Brechas por año" icon={PieChart}>
                  <Donut data={yearSlices} centerLabel="brechas" />
                </Card>
            <Card
              title="Evolución por año de la carrera"
              icon={Users}
              subtitle="Cuántos cursos de cada año reportan la brecha. Si una brecha sigue presente en 4° año, la carrera no la está corrigiendo."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-separate border-spacing-1 text-[13px]">
                  <thead>
                    <tr>
                      <th className="text-left font-bold text-slate-500">Competencia</th>
                      {CAREER_YEARS.map((y) => (
                        <th key={y.id} className="w-24 text-center font-bold text-slate-500">
                          {y.label}
                          <span className="block text-[11px] font-medium text-slate-400">
                            {matrix.coursesPerYear[y.id] || 0} curso{matrix.coursesPerYear[y.id] === 1 ? '' : 's'}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.rows.map((r) => (
                      <tr key={r.key}>
                        <td className="truncate pr-3 font-semibold text-slate-700">{r.comp.label}</td>
                        {CAREER_YEARS.map((y) => {
                          const n = r.byYear[y.id] || 0;
                          const courses = matrix.coursesPerYear[y.id] || 0;
                          const share = courses ? n / courses : 0;
                          return (
                            <td
                              key={y.id}
                              className="rounded-lg py-2 text-center font-bold"
                              style={{
                                backgroundColor: n ? `rgba(225, 29, 72, ${0.12 + share * 0.7})` : '#f8fafc',
                                color: share > 0.5 ? '#fff' : n ? '#881337' : '#cbd5e1'
                              }}
                              title={courses ? `${n} de ${courses} cursos` : 'Sin cursos registrados'}
                            >
                              {n || '·'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

              </div>
            )}

            {tab === 'fortalezas' && (
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <Card title="Fortalezas por dimensión" icon={PieChart} subtitle="Lo que los docentes destacan de sus cursos">
                  <Donut data={strengthSlices} centerLabel="menciones" emptyText="Nadie ha marcado fortalezas todavía" />
                </Card>
                <Card title="Detalle" icon={Sparkles}>
                  {strengths.length === 0 ? (
                    <p className="text-[13px] text-slate-400">Nadie ha marcado fortalezas todavía</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {strengths.map(({ comp, count }) => (
                        <span
                          key={comp.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12.5px] font-semibold text-emerald-800"
                        >
                          {comp.label} <strong className="text-emerald-600">{count}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {tab === 'propuestas' && (
              <>
            <Card
              title="Propuestas de los docentes"
              icon={Lightbulb}
              subtitle="Ideas de actividades o asignaturas complementarias para trabajar cada brecha"
            >
              {suggestions.length === 0 ? (
                <p className="text-[13px] text-slate-400">Todavía no hay propuestas</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {suggestions.map((o, i) => {
                    const comp = competencyOf(o.competency, o.custom_label);
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        style={{ borderLeft: `3px solid ${comp.dimension.color}` }}
                      >
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{comp.label}</p>
                        <p className="mt-1 text-[14px] leading-relaxed text-slate-800">{o.suggestion}</p>
                        <p className="mt-2 text-[12px] text-slate-500">
                          {o.row.teacher_name} · {o.row.subject} · {yearLabel(o.row.career_year)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {filtered.some((r) => r.general_comment || r.strengths_comment) && (
              <Card title="Comentarios de los docentes" icon={MessageSquareQuote}>
                <div className="grid gap-3 md:grid-cols-2">
                  {filtered
                    .filter((r) => r.general_comment || r.strengths_comment)
                    .map((r) => (
                      <div key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[12px] font-bold text-slate-500">
                          {r.teacher_name} · {r.subject} · {yearLabel(r.career_year)}
                        </p>
                        {r.general_comment && (
                          <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-slate-800">{r.general_comment}</p>
                        )}
                        {r.strengths_comment && (
                          <p className="mt-2 flex gap-2 text-[13.5px] leading-relaxed text-emerald-800">
                            <Sparkles size={14} className="mt-0.5 shrink-0 text-emerald-500" /> {r.strengths_comment}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            )}

              </>
            )}

            {tab === 'registros' && (
              <>
            <Card title={`Registros (${filtered.length})`} icon={ClipboardList}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-slate-500">
                      <th className="py-2 font-bold">Fecha</th>
                      <th className="py-2 font-bold">Docente</th>
                      <th className="py-2 font-bold">Asignatura</th>
                      <th className="py-2 font-bold">Año</th>
                      <th className="py-2 font-bold">Semestre</th>
                      <th className="py-2 font-bold">Brechas</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 align-top">
                        <td className="py-2.5 text-slate-500">{formatDate(r.created_at)}</td>
                        <td className="py-2.5 font-semibold text-slate-800">{r.teacher_name}</td>
                        <td className="py-2.5 text-slate-700">{r.subject}</td>
                        <td className="py-2.5 text-slate-700">{yearLabel(r.career_year)}</td>
                        <td className="py-2.5 text-slate-500">{periodLabel(r.period)}</td>
                        <td className="py-2.5 text-slate-700">
                          {(r.observations || []).length}
                          {r.general_comment && (
                            <span title={r.general_comment}>
                              <MessageSquareQuote size={13} className="ml-2 inline text-slate-400" />
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right">
                          {confirmDelete === r.id ? (
                            <span className="inline-flex gap-1">
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[12px] font-bold text-white"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="rounded-lg px-2.5 py-1 text-[12px] font-bold text-slate-500 hover:bg-slate-100"
                              >
                                No
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(r.id)}
                              className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                              title="Eliminar registro"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
              </>
            )}

          </>
        )}
      </div>

      {/* Detalle de una brecha */}
      {focused && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={() => setFocusGap(null)}>
          <aside
            className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: focused.comp.dimension.color }}>
                  {focused.comp.dimension.label}
                </p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{focused.comp.label}</h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  {focused.count} reporte{focused.count === 1 ? '' : 's'} · {focused.score} pts · {focused.critical} crítico
                  {focused.critical === 1 ? '' : 's'}
                </p>
              </div>
              <button onClick={() => setFocusGap(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {focused.items.map((o, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="font-bold text-slate-800">{o.row.subject}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{yearLabel(o.row.career_year)}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{o.row.teacher_name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11.5px] font-bold text-sky-700">
                      {frequencyOf(o.frequency)?.label}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11.5px] font-bold ${
                        o.severity === 'critico' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {severityOf(o.severity)?.label}
                    </span>
                  </div>
                  {o.example && (
                    <p className="mt-3 flex gap-2 text-[14px] leading-relaxed text-slate-700">
                      <AlertTriangle size={14} className="mt-1 shrink-0 text-amber-500" /> {o.example}
                    </p>
                  )}
                  {o.suggestion && (
                    <p className="mt-2 flex gap-2 text-[14px] leading-relaxed text-slate-700">
                      <Lightbulb size={14} className="mt-1 shrink-0 text-emerald-500" /> {o.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default FeedbackDocentePanel;
