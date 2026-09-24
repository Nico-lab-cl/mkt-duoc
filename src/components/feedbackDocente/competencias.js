/**
 * Taxonomía compartida por el formulario docente y el panel de resultados.
 *
 * Los ids se guardan en la base de datos: se pueden cambiar las etiquetas y
 * agregar competencias nuevas, pero un id ya usado no debe renombrarse o se
 * pierde el conteo histórico.
 */

export const PROGRAM = {
  slug: 'marketing',
  label: 'Marketing',
  publicPath: '/feedback-docente-mkt',
  panelPath: '/feedback-docente-mkt/resultados'
};

// Fija por ahora: el piloto es solo en Valparaíso
export const CAMPUS = 'Duoc UC · Sede Valparaíso';

export const SEMESTERS = [
  { id: 1, label: 'Primer semestre' },
  { id: 2, label: 'Segundo semestre' }
];

/** Años académicos para elegir: desde 2024 hasta el próximo año, el más reciente primero. */
export const academicYears = (now = new Date()) => {
  const years = [];
  for (let y = now.getFullYear() + 1; y >= 2024; y--) years.push(y);
  return years;
};

export const currentSemester = (date = new Date()) => (date.getMonth() < 7 ? 1 : 2);

/** "2026-2" → "2026 · Segundo semestre" */
export const periodLabel = (period) => {
  const [year, sem] = String(period || '').split('-');
  const semester = SEMESTERS.find((s) => String(s.id) === sem);
  return semester ? `${year} · ${semester.label}` : period || '';
};

export const CAREER_YEARS = [
  { id: 1, label: '1° año' },
  { id: 2, label: '2° año' },
  { id: 3, label: '3° año' },
  { id: 4, label: '4° año' }
];

export const DIMENSIONS = [
  {
    id: 'comunicacion',
    label: 'Comunicación',
    color: '#0284c7',
    competencies: [
      { id: 'com_oral', label: 'Expresión oral y presentaciones' },
      { id: 'com_escrita', label: 'Redacción y ortografía' },
      { id: 'com_argumentar', label: 'Defender sus ideas ante preguntas' },
      { id: 'com_escucha', label: 'Escucha activa y recibir feedback' }
    ]
  },
  {
    id: 'pensamiento_critico',
    label: 'Pensamiento crítico',
    color: '#7c3aed',
    competencies: [
      { id: 'pc_lectura', label: 'Comprensión lectora' },
      { id: 'pc_analisis', label: 'Análisis de información y datos' },
      { id: 'pc_cuestionar', label: 'Cuestionar fuentes y supuestos' },
      { id: 'pc_problemas', label: 'Resolución de problemas' },
      { id: 'pc_criterio', label: 'Tomar decisiones con fundamento' }
    ]
  },
  {
    id: 'proactividad',
    label: 'Proactividad y autonomía',
    color: '#059669',
    competencies: [
      { id: 'pro_iniciativa', label: 'Iniciativa (ir más allá de lo pedido)' },
      { id: 'pro_autonomia', label: 'Trabajar sin instrucciones paso a paso' },
      { id: 'pro_curiosidad', label: 'Curiosidad e investigación propia' },
      { id: 'pro_preguntar', label: 'Preguntar y pedir ayuda a tiempo' }
    ]
  },
  {
    id: 'caracter',
    label: 'Carácter y personalidad',
    color: '#d97706',
    competencies: [
      { id: 'car_frustracion', label: 'Tolerancia a la frustración y al error' },
      { id: 'car_seguridad', label: 'Seguridad y confianza en sí mismo' },
      { id: 'car_perseverancia', label: 'Perseverancia' },
      { id: 'car_adaptabilidad', label: 'Adaptación al cambio' }
    ]
  },
  {
    id: 'trabajo_equipo',
    label: 'Trabajo con otros',
    color: '#db2777',
    competencies: [
      { id: 'eq_colaboracion', label: 'Colaboración en equipo' },
      { id: 'eq_liderazgo', label: 'Liderazgo' },
      { id: 'eq_conflictos', label: 'Manejo de conflictos' },
      { id: 'eq_compromiso', label: 'Cumplir con su parte del trabajo' }
    ]
  },
  {
    id: 'profesionalismo',
    label: 'Responsabilidad y profesionalismo',
    color: '#475569',
    competencies: [
      { id: 'prof_plazos', label: 'Cumplimiento de plazos' },
      { id: 'prof_asistencia', label: 'Puntualidad y asistencia' },
      { id: 'prof_formalidad', label: 'Formalidad (correos, trato, presentación)' },
      { id: 'prof_etica', label: 'Ética e integridad (plagio, uso de IA)' }
    ]
  }
];

export const OTHER_ID = 'otra';

// Cuántos estudiantes del curso muestran la brecha
export const FREQUENCIES = [
  { id: 'pocos', label: 'Algunos', hint: 'Menos de un cuarto del curso', weight: 1 },
  { id: 'varios', label: 'Varios', hint: 'Cerca de la mitad', weight: 2 },
  { id: 'mayoria', label: 'La mayoría', hint: 'Es la tónica del curso', weight: 3 }
];

// Cuánto afecta el desempeño en la asignatura
export const SEVERITIES = [
  { id: 'leve', label: 'Leve', hint: 'Se nota, pero no frena el trabajo', weight: 1 },
  { id: 'moderado', label: 'Moderado', hint: 'Baja la calidad de las entregas', weight: 2 },
  { id: 'critico', label: 'Crítico', hint: 'Impide lograr los aprendizajes', weight: 3 }
];

const COMPETENCY_INDEX = Object.fromEntries(
  DIMENSIONS.flatMap((d) => d.competencies.map((c) => [c.id, { ...c, dimension: d }]))
);

/** Etiqueta y dimensión de una competencia; las "otra" usan el texto libre del docente. */
export const competencyOf = (id, customLabel) => {
  if (COMPETENCY_INDEX[id]) return COMPETENCY_INDEX[id];
  return {
    id: id || OTHER_ID,
    label: customLabel ? `Otra: ${customLabel}` : 'Otra',
    dimension: { id: OTHER_ID, label: 'Otras', color: '#94a3b8' }
  };
};

export const frequencyOf = (id) => FREQUENCIES.find((f) => f.id === id);
export const severityOf = (id) => SEVERITIES.find((s) => s.id === id);

/** Puntaje 1–9: una brecha crítica en la mayoría del curso pesa 9, una leve en pocos pesa 1. */
export const scoreOf = (obs) => (frequencyOf(obs.frequency)?.weight || 1) * (severityOf(obs.severity)?.weight || 1);
