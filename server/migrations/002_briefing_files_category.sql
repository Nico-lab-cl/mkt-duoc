-- =============================================================================
-- Categoría del material subido en el formulario de briefing.
-- Permite separar logos / fotos de instalaciones / equipo médico / videos /
-- documentos al momento de revisar lo que envió el cliente.
-- =============================================================================

ALTER TABLE briefing_files ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'otros';

CREATE INDEX IF NOT EXISTS idx_briefing_files_category ON briefing_files(category);

-- Ver el material agrupado por categoría
-- SELECT category, COUNT(*) AS archivos, pg_size_pretty(SUM(file_size)) AS peso
-- FROM briefing_files WHERE briefing_id = 1
-- GROUP BY category ORDER BY archivos DESC;
