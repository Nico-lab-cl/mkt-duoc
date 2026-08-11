-- =============================================================================
-- Briefing de proyecto web — /formulario-clinica-conectamedica
-- Ejecutar una sola vez sobre la base de datos `duoc1`.
-- El servidor también crea estas tablas al arrancar, pero conviene ejecutarlo
-- a mano para tener control del momento del cambio.
-- =============================================================================

-- Respuestas del cuestionario
CREATE TABLE IF NOT EXISTS briefings (
  id            SERIAL PRIMARY KEY,
  token         VARCHAR(40) UNIQUE NOT NULL,           -- identificador que genera el navegador del cliente
  form_slug     TEXT NOT NULL DEFAULT 'clinica-conectamedica',
  clinic_name   TEXT,
  contact_name  TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status        TEXT NOT NULL DEFAULT 'completed',
  answers       JSONB NOT NULL DEFAULT '{}'::jsonb,    -- todas las respuestas del cuestionario
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Archivos adjuntos (fotos, videos, logos, PDF) guardados como binario
CREATE TABLE IF NOT EXISTS briefing_files (
  id             SERIAL PRIMARY KEY,
  briefing_token VARCHAR(40) NOT NULL,                 -- permite subir archivos antes de enviar el formulario
  briefing_id    INTEGER REFERENCES briefings(id) ON DELETE CASCADE,
  file_name      TEXT NOT NULL,
  mime_type      TEXT,
  file_size      BIGINT,
  file_data      BYTEA NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_briefing_files_token    ON briefing_files(briefing_token);
CREATE INDEX IF NOT EXISTS idx_briefing_files_briefing ON briefing_files(briefing_id);
CREATE INDEX IF NOT EXISTS idx_briefings_slug          ON briefings(form_slug);

-- =============================================================================
-- CONSULTAS ÚTILES
-- =============================================================================

-- Ver los formularios recibidos (sin el binario de los archivos)
-- SELECT b.id, b.clinic_name, b.contact_name, b.contact_email, b.contact_phone,
--        b.created_at, COUNT(f.id) AS archivos,
--        pg_size_pretty(COALESCE(SUM(f.file_size), 0)) AS peso_total
-- FROM briefings b
-- LEFT JOIN briefing_files f ON f.briefing_id = b.id
-- GROUP BY b.id
-- ORDER BY b.created_at DESC;

-- Leer una respuesta puntual del cuestionario
-- SELECT clinic_name, answers->>'main_goal' AS objetivo_principal,
--        answers->'features' AS funcionalidades
-- FROM briefings;

-- Listar los archivos de un formulario (nunca hacer SELECT * : trae el binario)
-- SELECT id, file_name, mime_type, pg_size_pretty(file_size) AS peso, created_at
-- FROM briefing_files WHERE briefing_id = 1;
