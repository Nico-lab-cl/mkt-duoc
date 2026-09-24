-- =============================================================================
-- Feedback docente / Observatorio de competencias — /feedback-docente-mkt
-- El servidor también crea esta tabla al arrancar.
-- =============================================================================

-- Un registro = un curso (asignatura + año) evaluado por un docente
CREATE TABLE IF NOT EXISTS docente_feedback (
  id                SERIAL PRIMARY KEY,
  program           TEXT NOT NULL DEFAULT 'marketing',   -- carrera; permite sumar Logística, Comercio Exterior...
  teacher_name      TEXT NOT NULL,
  subject           TEXT NOT NULL,
  career_year       SMALLINT NOT NULL,                    -- 1 a 4
  period            TEXT,                                 -- semestre, ej. 2026-2
  observations      JSONB NOT NULL DEFAULT '[]'::jsonb,   -- [{competency, custom_label, frequency, severity, example, suggestion}]
  strengths         JSONB NOT NULL DEFAULT '[]'::jsonb,   -- ids de competencias destacadas
  strengths_comment TEXT,
  general_comment   TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_docente_feedback_program ON docente_feedback(program, career_year);

-- =============================================================================
-- CONSULTAS ÚTILES
-- =============================================================================

-- Ranking de brechas por año (conteo de cursos que la reportan)
-- SELECT f.career_year, o->>'competency' AS competencia, COUNT(*) AS cursos
-- FROM docente_feedback f, jsonb_array_elements(f.observations) o
-- WHERE f.program = 'marketing'
-- GROUP BY 1, 2
-- ORDER BY 1, 3 DESC;
