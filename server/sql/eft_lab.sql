-- Laboratorio EFT (MKA1213 Inbound Marketing II) — softwarespectra.cl/eft-lab
-- El servidor crea esta tabla solo al arrancar; este archivo sirve para
-- correrla a mano en la base de datos (es idempotente).

CREATE TABLE IF NOT EXISTS eft_lab_entregas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,                 -- users.id del estudiante
  lab TEXT NOT NULL DEFAULT 'eje1',         -- eje1 (luego eje2, eje3)
  group_id INTEGER,                         -- grupo del estudiante al guardar
  data JSONB NOT NULL DEFAULT '{}'::jsonb,  -- todo el avance del lab
  pieza_imagen BYTEA,                       -- pieza gráfica subida (comprimida)
  pieza_mime TEXT,
  submitted_at TIMESTAMP,                   -- última vez que la envió al profesor
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, lab)
);
CREATE INDEX IF NOT EXISTS idx_eft_lab_entregas_lab ON eft_lab_entregas(lab, group_id);

-- Consultas útiles para revisar
-- Quién envió y cuándo:
-- SELECT u.full_name, u.email, g.name AS grupo, e.submitted_at, e.updated_at
-- FROM eft_lab_entregas e JOIN users u ON u.id = e.user_id LEFT JOIN groups g ON g.id = u.group_id
-- WHERE e.lab = 'eje1' ORDER BY g.name, u.full_name;
--
-- Clasificación del Flywheel de un estudiante:
-- SELECT u.full_name, e.data->'clasif' FROM eft_lab_entregas e JOIN users u ON u.id = e.user_id
-- WHERE u.email = 'correo@duocuc.cl';
