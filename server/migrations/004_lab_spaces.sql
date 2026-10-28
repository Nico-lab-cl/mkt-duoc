-- =============================================================================
-- Laboratorio Martech — /lab
-- Cada equipo pega aquí el código de su formulario y su código de seguimiento
-- de HubSpot; /lab/:slug los publica en una página propia.
-- El servidor también crea esta tabla al arrancar.
-- =============================================================================

CREATE TABLE IF NOT EXISTS lab_spaces (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,      -- dirección pública: /lab/<slug>
  team_name   TEXT NOT NULL,
  members     TEXT,                      -- integrantes, texto libre
  pin_hash    TEXT NOT NULL,             -- "salt:scrypt" del PIN del equipo
  form_embed  TEXT DEFAULT '',           -- código de inserción del formulario (va en el <body>)
  head_code   TEXT DEFAULT '',           -- código de seguimiento / chat (va en el <head>)
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
