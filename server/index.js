import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { UbersuggestMcpService } from './services/ubersuggestMcp.js';
import { sendStudentNotificationWebhook } from './services/emailTemplates.js';
import {
  parseHubspotForm,
  parseHubspotTracking,
  renderHubspotForm,
  renderHubspotTracking
} from './services/hubspotEmbed.js';
import EVAL_EFT from './evaluaciones/eftFinal.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(cors());

// La subida de archivos del briefing viaja en base64 dentro del JSON, por eso
// necesita un límite mucho mayor que el resto de los endpoints.
const jsonStandard = express.json({ limit: '5mb' });
const jsonUploads = express.json({ limit: '80mb' });
app.use((req, res, next) => {
  if (req.path === '/api/briefing-files') return jsonUploads(req, res, next);
  return jsonStandard(req, res, next);
});

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, '../dist')));

// Configuración de PostgreSQL
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable',
  ssl: false
});

// Laboratorio EFT (MKA1213). Mismo SQL que server/sql/eft_lab.sql, por si se
// quiere correr a mano en la base de datos.
const EFT_LAB_SQL = `
  CREATE TABLE IF NOT EXISTS eft_lab_entregas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lab TEXT NOT NULL DEFAULT 'eje1',
    group_id INTEGER,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    pieza_imagen BYTEA,
    pieza_mime TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lab)
  );
  CREATE INDEX IF NOT EXISTS idx_eft_lab_entregas_lab ON eft_lab_entregas(lab, group_id);

  CREATE TABLE IF NOT EXISTS eval_intentos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    eval_id TEXT NOT NULL,
    group_id INTEGER,
    orden JSONB NOT NULL,
    respuestas JSONB NOT NULL DEFAULT '{}'::jsonb,
    salidas INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    puntaje INTEGER,
    total INTEGER,
    UNIQUE (user_id, eval_id)
  );
  CREATE TABLE IF NOT EXISTS eval_config (
    eval_id TEXT PRIMARY KEY,
    abierta BOOLEAN NOT NULL DEFAULT FALSE,
    retro_publicada BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

// Token de sesión firmado (HMAC del id). Antes la app identificaba al usuario
// solo por el id que mandaba el navegador; para la evaluación con nota eso no
// basta. El token viaja dentro del objeto user que la app ya guarda.
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  crypto.createHash('sha256').update(`simulador-auth:${process.env.DATABASE_URL || 'local'}`).digest('hex');
const firmar = (id) => crypto.createHmac('sha256', AUTH_SECRET).update(`user:${id}`).digest('hex');
const conToken = (user) => (user ? { ...user, auth_token: firmar(user.id) } : user);
const tokenValido = (id, token) => {
  if (!id || !token) return false;
  const a = Buffer.from(firmar(id));
  const b = Buffer.from(String(token));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Probar conexión e inicializar tablas
pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('❌ Error de conexión a la base de datos:', err.stack);
  }
  console.log('✅ Conexión a PostgreSQL exitosa');
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        user_id INTEGER,
        group_id INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS chatflows (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        user_id INTEGER,
        group_id INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        group_id INTEGER,
        score INTEGER DEFAULT 0,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS lead_magnets (
        id VARCHAR(12) PRIMARY KEY,
        title TEXT,
        type TEXT,
        user_id INTEGER,
        group_id INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER,
        region TEXT,
        city TEXT,
        school TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        favorite_social TEXT,
        test_answer CHAR(1),
        range_assigned TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        group_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS qr_codes (
        id VARCHAR(10) PRIMARY KEY,
        user_id INTEGER,
        name TEXT NOT NULL,
        destination_url TEXT NOT NULL,
        color TEXT DEFAULT '#0f172a',
        scan_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS qr_scans (
        id SERIAL PRIMARY KEY,
        qr_code_id VARCHAR(10) REFERENCES qr_codes(id) ON DELETE CASCADE,
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        ip TEXT
      );
      CREATE TABLE IF NOT EXISTS briefings (
        id SERIAL PRIMARY KEY,
        token VARCHAR(40) UNIQUE NOT NULL,
        form_slug TEXT NOT NULL DEFAULT 'clinica-conectamedica',
        clinic_name TEXT,
        contact_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        status TEXT NOT NULL DEFAULT 'completed',
        answers JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS briefing_files (
        id SERIAL PRIMARY KEY,
        briefing_token VARCHAR(40) NOT NULL,
        briefing_id INTEGER REFERENCES briefings(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        mime_type TEXT,
        file_size BIGINT,
        file_data BYTEA NOT NULL,
        category TEXT DEFAULT 'otros',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE briefing_files ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'otros';
      CREATE INDEX IF NOT EXISTS idx_briefing_files_category ON briefing_files(category);
      CREATE INDEX IF NOT EXISTS idx_briefing_files_token ON briefing_files(briefing_token);
      CREATE INDEX IF NOT EXISTS idx_briefing_files_briefing ON briefing_files(briefing_id);
      CREATE INDEX IF NOT EXISTS idx_briefings_slug ON briefings(form_slug);
      CREATE TABLE IF NOT EXISTS docente_feedback (
        id SERIAL PRIMARY KEY,
        program TEXT NOT NULL DEFAULT 'marketing',
        teacher_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        career_year SMALLINT NOT NULL,
        period TEXT,
        observations JSONB NOT NULL DEFAULT '[]'::jsonb,
        strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
        strengths_comment TEXT,
        general_comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_docente_feedback_program ON docente_feedback(program, career_year);
      ALTER TABLE docente_feedback ADD COLUMN IF NOT EXISTS campus TEXT DEFAULT 'Duoc UC · Sede Valparaíso';
      ALTER TABLE docente_feedback ADD COLUMN IF NOT EXISTS academic_year SMALLINT;
      ALTER TABLE docente_feedback ADD COLUMN IF NOT EXISTS semester SMALLINT;
      CREATE TABLE IF NOT EXISTS lab_spaces (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        team_name TEXT NOT NULL,
        members TEXT,
        pin_hash TEXT NOT NULL,
        form_embed TEXT DEFAULT '',
        head_code TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lead_magnets' AND column_name='user_id') THEN
          ALTER TABLE lead_magnets ADD COLUMN user_id INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lead_magnets' AND column_name='group_id') THEN
          ALTER TABLE lead_magnets ADD COLUMN group_id INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='must_change_password') THEN
          ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='career_year') THEN
          ALTER TABLE users ADD COLUMN career_year TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='campus') THEN
          ALTER TABLE users ADD COLUMN campus TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='qr_codes' AND column_name='color') THEN
          ALTER TABLE qr_codes ADD COLUMN color TEXT DEFAULT '#0f172a';
        END IF;
      END $$;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        year TEXT DEFAULT '3er Año',
        is_locked BOOLEAN DEFAULT FALSE
      );
      ALTER TABLE groups ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '3er Año';
      ALTER TABLE groups ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

      -- Grupos de 4to Año (Bloqueados / Completos)
      INSERT INTO groups (id, name, year, is_locked) VALUES 
        (1, 'Grupo 1 (4° Año)', '4to Año', true),
        (2, 'Grupo 2 (4° Año)', '4to Año', true),
        (3, 'Grupo 3 (4° Año)', '4to Año', true)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name, 
        year = EXCLUDED.year, 
        is_locked = EXCLUDED.is_locked;

      -- Grupos de 3er Año (Disponibles para selección)
      INSERT INTO groups (id, name, year, is_locked) VALUES 
        (4, 'Grupo 1 (3° Año)', '3er Año', false),
        (5, 'Grupo 2 (3° Año)', '3er Año', false),
        (6, 'Grupo 3 (3° Año)', '3er Año', false),
        (999, 'Invitados', 'General', false)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name, 
        year = EXCLUDED.year, 
        is_locked = EXCLUDED.is_locked;
    `);
    console.log('🚀 Tablas de base de datos y grupos de 3° y 4° año verificados/creados');
  } catch (dbErr) {
    console.error('❌ Error inicializando tablas:', dbErr);
  }

  // Laboratorio EFT: una entrega por estudiante y por eje. Va aparte para que
  // un fallo aquí no impida crear el resto de las tablas (y viceversa).
  try {
    await client.query(EFT_LAB_SQL);
    console.log('🧪 Tabla eft_lab_entregas verificada/creada');
  } catch (dbErr) {
    console.error('❌ Error creando eft_lab_entregas:', dbErr);
  } finally {
    release();
  }
});

// --- API ENDPOINTS ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const emailNormalized = email ? email.trim().toLowerCase() : '';
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, group_id, career_year, campus, must_change_password FROM users WHERE LOWER(email) = $1 AND password = $2',
      [emailNormalized, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.must_change_password) {
        return res.json({ success: true, mustChangePassword: true, email: user.email });
      }
      res.json({ success: true, user: conToken(user) });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error('Error de login, usando bypass local:', err.message);
    
    // Si la base de datos no está disponible, permitimos inicio con cualquier credencial en local
    const isAdmin = emailNormalized.includes('admin') || password === 'admin';
    const mockUser = {
      id: isAdmin ? 1 : 100,
      email: emailNormalized || (isAdmin ? 'admin@duoc.cl' : 'estudiante@duocuc.cl'),
      full_name: isAdmin ? 'Profesor Nico (Admin)' : 'Alumno Demostración',
      role: isAdmin ? 'admin' : 'student',
      group_id: isAdmin ? null : 1,
      must_change_password: false
    };
    
    res.json({ success: true, user: mockUser });
  }
});

app.post('/api/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
  }
  const emailNormalized = email ? email.trim().toLowerCase() : '';
  try {
    // Verificar que la contraseña actual (temporal) coincida
    const checkUser = await pool.query(
      'SELECT id, email, full_name, role, group_id FROM users WHERE LOWER(email) = $1 AND password = $2',
      [emailNormalized, currentPassword]
    );
    if (checkUser.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta.' });
    }

    // Actualizar la contraseña
    const updateResult = await pool.query(
      'UPDATE users SET password = $1, must_change_password = FALSE WHERE id = $2 RETURNING id, email, full_name, role, group_id',
      [newPassword, checkUser.rows[0].id]
    );

    res.json({ success: true, user: conToken(updateResult.rows[0]) });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ error: 'Error en el servidor al actualizar la contraseña' });
  }
});

app.post('/api/recover-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'El correo electrónico es obligatorio' });
  }
  const emailNormalized = email.trim().toLowerCase();
  try {
    // Generar nueva contraseña temporal de 6 caracteres alfanuméricos
    const tmpPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Buscar si el usuario existe en 'users'
    const userExists = await pool.query('SELECT id, email, full_name FROM users WHERE LOWER(email) = $1', [emailNormalized]);
    
    let first_name = '';
    let last_name = '';
    let phone = '';
    let full_name = '';
    let userId = null;

    if (userExists.rows.length === 0) {
      // 2. Si no existe en 'users', buscar en la tabla 'leads' para ver si es un alumno registrado huérfano
      console.log(`Usuario no encontrado en 'users' para ${emailNormalized}. Buscando en 'leads'...`);
      const leadInfo = await pool.query(
        'SELECT first_name, last_name, phone FROM leads WHERE LOWER(email) = $1 ORDER BY created_at DESC LIMIT 1',
        [emailNormalized]
      );

      if (leadInfo.rows.length === 0) {
        // No existe en ninguna parte
        console.log(`Correo ${emailNormalized} no existe en leads ni users.`);
        return res.status(404).json({ success: false, message: 'El correo electrónico no está registrado.' });
      }

      // Si existe en leads, crear su usuario en 'users' al vuelo
      first_name = leadInfo.rows[0].first_name;
      last_name = leadInfo.rows[0].last_name;
      phone = leadInfo.rows[0].phone || '';
      full_name = `${first_name} ${last_name}`;
      
      console.log(`Lead encontrado. Creando cuenta de usuario para ${emailNormalized} al vuelo...`);
      const insertUser = await pool.query(
        `INSERT INTO users (email, password, full_name, role, group_id, must_change_password)
         VALUES ($1, $2, $3, 'guest', 999, TRUE) RETURNING id`,
        [emailNormalized, tmpPassword, full_name]
      );
      userId = insertUser.rows[0].id;
    } else {
      // Si el usuario existe, obtener datos del lead si están disponibles
      full_name = userExists.rows[0].full_name;
      userId = userExists.rows[0].id;

      const leadInfo = await pool.query(
        'SELECT first_name, last_name, phone FROM leads WHERE LOWER(email) = $1 ORDER BY created_at DESC LIMIT 1',
        [emailNormalized]
      );
      if (leadInfo.rows.length > 0) {
        first_name = leadInfo.rows[0].first_name;
        last_name = leadInfo.rows[0].last_name;
        phone = leadInfo.rows[0].phone || '';
        full_name = `${first_name} ${last_name}`;
      }

      // Actualizar la contraseña en 'users' y forzar cambio
      await pool.query(
        'UPDATE users SET password = $1, must_change_password = TRUE WHERE id = $2',
        [tmpPassword, userId]
      );
    }

    // 3. Disparar Webhook a n8n con HTML, Subject y Metacampos
    await sendStudentNotificationWebhook({
      event: 'student_recover_password',
      full_name: full_name || `${first_name} ${last_name}`.trim(),
      email: emailNormalized,
      tmpPassword: tmpPassword
    });

    res.json({ success: true, message: 'Se ha generado y enviado una nueva contraseña temporal.' });
  } catch (err) {
    console.error('Error al recuperar contraseña:', err);
    res.status(500).json({ error: 'Error en el servidor al procesar la recuperación' });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

app.post('/api/select-group', async (req, res) => {
  const { userId, groupId } = req.body;
  try {
    const groupCheck = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
    if (groupCheck.rows.length > 0 && groupCheck.rows[0].is_locked) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este grupo corresponde a 4° Año y se encuentra completo y cerrado. Por favor selecciona un grupo de 3° Año.' 
      });
    }

    await pool.query('UPDATE users SET group_id = $1 WHERE id = $2', [groupId, userId]);
    const userResult = await pool.query(
      'SELECT id, email, full_name, role, group_id, career_year, campus, must_change_password FROM users WHERE id = $1', 
      [userId]
    );
    res.json({ success: true, user: conToken(userResult.rows[0]) });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar grupo' });
  }
});

app.post('/api/campaigns', async (req, res) => {
  const { id, name, userId, groupId, data } = req.body;
  try {
    let result;
    const jsonData = JSON.stringify(data);
    if (id) {
      result = await pool.query(
        'UPDATE campaigns SET name = $1, data = $2 WHERE id = $3 RETURNING *',
        [name, jsonData, id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO campaigns (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, userId, groupId, jsonData]
      );
    }
    res.json({ success: true, campaign: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar campaña' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
    res.json({ success: true, message: 'Campaña eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar campaña' });
  }
});

app.post('/api/chatflows', async (req, res) => {
  const { id, name, userId, groupId, data } = req.body;
  try {
    let result;
    const jsonData = JSON.stringify(data);
    if (id) {
      result = await pool.query(
        'UPDATE chatflows SET name = $1, data = $2 WHERE id = $3 RETURNING *',
        [name, jsonData, id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO chatflows (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, userId, groupId, jsonData]
      );
    }
    res.json({ success: true, chatflow: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar chatflow' });
  }
});

app.delete('/api/chatflows/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM chatflows WHERE id = $1', [id]);
    res.json({ success: true, message: 'Chatflow eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar chatflow' });
  }
});

app.post('/api/evaluations', async (req, res) => {
  const { userId, groupId, score, data } = req.body;
  try {
    const jsonData = JSON.stringify(data);
    const result = await pool.query(
      'INSERT INTO evaluations (user_id, group_id, score, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, groupId, score, jsonData]
    );
    res.json({ success: true, evaluation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar evaluación' });
  }
});

// Endpoint POST /api/submit-evaluation (Corrección de Bug de KPIGym)
app.post('/api/submit-evaluation', async (req, res) => {
  const { userId, groupId, score, answers, justifications } = req.body;
  try {
    const data = { answers, justifications };
    const result = await pool.query(
      'INSERT INTO evaluations (user_id, group_id, score, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId || null, groupId || null, score, JSON.stringify(data)]
    );
    res.json({ success: true, evaluation: result.rows[0] });
  } catch (err) {
    console.error('Error al guardar submit-evaluation:', err);
    res.status(500).json({ error: 'Error al guardar evaluación' });
  }
});

// Endpoint POST /api/activity-logs (Registrar eventos del frontend)
app.post('/api/activity-logs', async (req, res) => {
  const { userId, groupId, action, details } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO activity_logs (user_id, group_id, action, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId || null, groupId || null, action, details || '']
    );
    res.json({ success: true, log: result.rows[0] });
  } catch (err) {
    console.error('Error al registrar logs de actividad:', err);
    res.status(500).json({ error: 'Error al registrar actividad' });
  }
});

// Auxiliar para mock de estadísticas en caso de fallback
function getMockStats(filterGroup) {
  const isStudent = filterGroup !== null && filterGroup !== 999;
  const summary = {
    leadsCount: isStudent ? 0 : 148,
    usersCount: filterGroup === null ? 25 : (isStudent ? 6 : 148),
    campaignsCount: filterGroup === null ? 18 : (isStudent ? 5 : 2),
    chatflowsCount: filterGroup === null ? 14 : (isStudent ? 4 : 1),
    leadMagnetsCount: filterGroup === null ? 22 : (isStudent ? 6 : 3),
    qrScansCount: filterGroup === null ? 356 : (isStudent ? 45 : 311),
    avgScore: filterGroup === null ? '7.8' : (isStudent ? '8.2' : '6.5')
  };

  const moduleUsage = [
    { name: 'meta', value: filterGroup === null ? 48 : (isStudent ? 12 : 36) },
    { name: 'chatflow', value: filterGroup === null ? 35 : (isStudent ? 10 : 25) },
    { name: 'kpi', value: filterGroup === null ? 28 : (isStudent ? 8 : 20) },
    { name: 'leadmagnet', value: filterGroup === null ? 42 : (isStudent ? 11 : 31) },
    { name: 'n8n', value: filterGroup === null ? 15 : (isStudent ? 12 : 3) },
    { name: 'whatsapp', value: filterGroup === null ? 18 : (isStudent ? 14 : 4) },
    { name: 'qr', value: filterGroup === null ? 67 : (isStudent ? 15 : 52) }
  ];

  const leadsRange = isStudent ? [] : [
    { name: 'Social Media Content', value: 45 },
    { name: 'Community Manager', value: 32 },
    { name: 'Trafficker / Paid Media', value: 28 },
    { name: 'Especialista SEM', value: 15 },
    { name: 'Consultor SEO', value: 18 },
    { name: 'Data Analyst', value: 10 }
  ];

  const leadsSocial = isStudent ? [] : [
    { name: 'Instagram', value: 68 },
    { name: 'TikTok', value: 42 },
    { name: 'WhatsApp', value: 24 },
    { name: 'Facebook', value: 10 },
    { name: 'LinkedIn', value: 4 }
  ];

  const scoreDistribution = [
    { score: 5, count: filterGroup === null ? 1 : 0 },
    { score: 6, count: filterGroup === null ? 2 : 1 },
    { score: 7, count: filterGroup === null ? 4 : 1 },
    { score: 8, count: filterGroup === null ? 6 : 2 },
    { score: 9, count: filterGroup === null ? 8 : 2 },
    { score: 10, count: filterGroup === null ? 5 : 2 }
  ];

  const leadsTimeline = isStudent ? [] : [
    { time: '09:00', count: 12 },
    { time: '10:00', count: 25 },
    { time: '11:00', count: 38 },
    { time: '12:00', count: 42 },
    { time: '13:00', count: 21 },
    { time: '14:00', count: 10 }
  ];

  return {
    summary,
    moduleUsage,
    leadsRange,
    leadsSocial,
    scoreDistribution,
    leadsTimeline
  };
}

// Endpoint GET /api/admin/stats (Obtener estadísticas agregadas para dashboard de analíticas)
app.get('/api/admin/stats', async (req, res) => {
  const { groupId } = req.query;
  const filterGroup = groupId && groupId !== 'all' ? parseInt(groupId) : null;

  try {
    let campaignsQuery = 'SELECT COUNT(*) FROM campaigns';
    let chatflowsQuery = 'SELECT COUNT(*) FROM chatflows';
    let evaluationsQuery = 'SELECT COUNT(*) FROM evaluations';
    let leadMagnetsQuery = 'SELECT COUNT(*) FROM lead_magnets';
    let qrCodesQuery = 'SELECT COALESCE(SUM(scan_count), 0) as total_scans FROM qr_codes';
    let activityQuery = "SELECT details as name, COUNT(*) as count FROM activity_logs WHERE action = 'open_module'";
    let scoresQuery = 'SELECT score, COUNT(*) as count FROM evaluations';
    let usersQuery = "SELECT COUNT(*) FROM users";

    let params = [];
    if (filterGroup !== null) {
      campaignsQuery += ' WHERE group_id = $1';
      chatflowsQuery += ' WHERE group_id = $1';
      evaluationsQuery += ' WHERE group_id = $1';
      leadMagnetsQuery += ' WHERE group_id = $1';
      qrCodesQuery += ' WHERE user_id IN (SELECT id FROM users WHERE group_id = $1)';
      activityQuery += ' AND group_id = $1';
      scoresQuery += ' WHERE group_id = $1';
      
      if (filterGroup === 999) {
        usersQuery = "SELECT COUNT(*) FROM users WHERE group_id = 999";
      } else {
        usersQuery = "SELECT COUNT(*) FROM users WHERE role = 'student' AND group_id = $1";
      }
      params.push(filterGroup);
    }

    activityQuery += ' GROUP BY details';
    scoresQuery += ' GROUP BY score ORDER BY score ASC';

    let leadsCount = 0;
    let leadsRange = [];
    let leadsSocial = [];
    let leadsTimeline = [];

    const isStudentGroup = filterGroup !== null && filterGroup !== 999;

    if (!isStudentGroup) {
      const leadsCountRes = await pool.query('SELECT COUNT(*) FROM leads');
      leadsCount = parseInt(leadsCountRes.rows[0].count);

      const leadsRangeRes = await pool.query('SELECT range_assigned, COUNT(*) as count FROM leads GROUP BY range_assigned');
      leadsRange = leadsRangeRes.rows.map(r => ({ name: r.range_assigned, value: parseInt(r.count) }));

      const leadsSocialRes = await pool.query('SELECT favorite_social, COUNT(*) as count FROM leads GROUP BY favorite_social');
      leadsSocial = leadsSocialRes.rows.map(r => ({ name: r.favorite_social, value: parseInt(r.count) }));

      const leadsTimelineRes = await pool.query(`
        SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*) as count 
        FROM leads 
        GROUP BY hour 
        ORDER BY hour ASC 
        LIMIT 100
      `);
      leadsTimeline = leadsTimelineRes.rows.map(r => ({ 
        time: new Date(r.hour).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), 
        count: parseInt(r.count) 
      }));
    }

    const campaignsCount = parseInt((await pool.query(campaignsQuery, params)).rows[0].count);
    const chatflowsCount = parseInt((await pool.query(chatflowsQuery, params)).rows[0].count);
    const evaluationsCount = parseInt((await pool.query(evaluationsQuery, params)).rows[0].count);
    const leadMagnetsCount = parseInt((await pool.query(leadMagnetsQuery, params)).rows[0].count);
    const qrScansCount = parseInt((await pool.query(qrCodesQuery, params)).rows[0].total_scans);
    const usersCount = parseInt((await pool.query(usersQuery, params)).rows[0].count);

    const activityRes = await pool.query(activityQuery, params);
    const moduleUsage = activityRes.rows.map(r => ({ name: r.name, value: parseInt(r.count) }));

    const scoresRes = await pool.query(scoresQuery, params);
    const scoreDistribution = scoresRes.rows.map(r => ({ score: r.score, count: parseInt(r.count) }));

    const avgScoreRes = await pool.query(
      filterGroup !== null 
        ? 'SELECT AVG(score) as avg FROM evaluations WHERE group_id = $1'
        : 'SELECT AVG(score) as avg FROM evaluations', 
      params
    );
    const avgScore = parseFloat(avgScoreRes.rows[0].avg || 0).toFixed(1);

    res.json({
      success: true,
      summary: {
        leadsCount,
        usersCount,
        campaignsCount,
        chatflowsCount,
        leadMagnetsCount,
        qrScansCount,
        avgScore
      },
      moduleUsage,
      leadsRange,
      leadsSocial,
      scoreDistribution,
      leadsTimeline
    });

  } catch (err) {
    console.error('Error fetching admin statistics, using fallback mock:', err.message);
    const mockData = getMockStats(filterGroup);
    res.json({ success: true, isMock: true, ...mockData });
  }
});

app.get('/api/admin/all', async (req, res) => {
  try {
    const campaigns = await pool.query(`
      SELECT c.*, u.full_name as student_name, g.name as group_name 
      FROM campaigns c 
      LEFT JOIN users u ON c.user_id = u.id 
      LEFT JOIN groups g ON c.group_id = g.id
    `);
    const chatflows = await pool.query(`
      SELECT ch.*, u.full_name as student_name, g.name as group_name 
      FROM chatflows ch 
      LEFT JOIN users u ON ch.user_id = u.id 
      LEFT JOIN groups g ON ch.group_id = g.id
    `);
    const evaluations = await pool.query(`
      SELECT e.*, u.full_name as student_name, g.name as group_name 
      FROM evaluations e
      LEFT JOIN users u ON e.user_id = u.id 
      LEFT JOIN groups g ON e.group_id = g.id
    `);
    const lead_magnets = await pool.query(`
      SELECT lm.*, u.full_name as student_name, g.name as group_name 
      FROM lead_magnets lm
      LEFT JOIN users u ON lm.user_id = u.id 
      LEFT JOIN groups g ON lm.group_id = g.id
    `);
    res.json({ 
      campaigns: campaigns.rows || [], 
      chatflows: chatflows.rows || [], 
      evaluations: evaluations.rows || [],
      lead_magnets: lead_magnets.rows || [] 
    });
  } catch (err) {
    console.error('Error in /api/admin/all:', err);
    res.status(500).json({ error: 'Error al obtener datos de admin' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.group_id, u.career_year, u.campus, u.must_change_password, g.name as group_name 
      FROM users u
      LEFT JOIN groups g ON u.group_id = g.id
      ORDER BY u.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, email, role, group_id, career_year, campus } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET full_name = $1, email = $2, role = $3, group_id = $4, career_year = $5, campus = $6 WHERE id = $7 RETURNING *',
      [full_name, email ? email.trim().toLowerCase() : '', role, group_id || null, career_year || null, campus || null, id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { full_name, email, password, role = 'student', group_id, career_year, campus, send_email = true } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ success: false, error: 'Nombre completo y correo son obligatorios' });
  }

  const emailNormalized = email.trim().toLowerCase();
  // Generar contraseña temporal segura de 6 caracteres alfanuméricos si no se especifica
  const tmpPassword = (password && password.trim()) ? password.trim() : Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    // Verificar si ya existe
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailNormalized]);
    let result;
    
    if (existing.rows.length > 0) {
      // Actualizar usuario existente con nueva clave temporal y flags
      result = await pool.query(
        `UPDATE users 
         SET full_name = $1, password = $2, role = $3, group_id = $4, career_year = $5, campus = $6, must_change_password = TRUE 
         WHERE LOWER(email) = $7 
         RETURNING id, email, full_name, role, group_id, career_year, campus, must_change_password`,
        [full_name.trim(), tmpPassword, role, group_id || null, career_year || null, campus || null, emailNormalized]
      );
    } else {
      // Insertar nuevo usuario con must_change_password = TRUE
      result = await pool.query(
        `INSERT INTO users (full_name, email, password, role, group_id, career_year, campus, must_change_password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) 
         RETURNING id, email, full_name, role, group_id, career_year, campus, must_change_password`,
        [full_name.trim(), emailNormalized, tmpPassword, role, group_id || null, career_year || null, campus || null]
      );
    }

    // Disparar Webhook a n8n para enviar correo con credenciales de bienvenida (con subject, html y metacampos)
    let emailSent = false;
    if (send_email) {
      const webhookRes = await sendStudentNotificationWebhook({
        event: 'new_student_welcome',
        full_name: full_name.trim(),
        email: emailNormalized,
        tmpPassword: tmpPassword,
        career_year: career_year,
        campus: campus
      });
      emailSent = webhookRes.success;
    }

    res.json({ 
      success: true, 
      user: result.rows[0], 
      tmpPassword, 
      emailSent,
      message: `Alumno ${full_name} registrado exitosamente con clave temporal: ${tmpPassword}` 
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ success: false, error: 'Error al registrar usuario: ' + err.message });
  }
});

// Reenviar credenciales y contraseña temporal
app.post('/api/admin/users/:id/resend-credentials', async (req, res) => {
  const { id } = req.params;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const user = userRes.rows[0];
    const tmpPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

    await pool.query('UPDATE users SET password = $1, must_change_password = TRUE WHERE id = $2', [tmpPassword, id]);

    const webhookRes = await sendStudentNotificationWebhook({
      event: 'student_resend_password',
      full_name: user.full_name,
      email: user.email,
      tmpPassword: tmpPassword,
      career_year: user.career_year,
      campus: user.campus
    });

    res.json({ 
      success: true, 
      tmpPassword, 
      emailSent: webhookRes.success,
      message: `Nueva clave temporal ${tmpPassword} enviada a ${user.email}` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al reenviar credenciales' });
  }
});

// Cambiar o asignar contraseña temporal directamente desde el panel de admin
app.post('/api/admin/users/:id/reset-password', async (req, res) => {
  const { id } = req.params;
  const { new_password, send_email = true } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const user = userRes.rows[0];
    const finalPassword = (new_password && new_password.trim()) 
      ? new_password.trim() 
      : Math.random().toString(36).substring(2, 8).toUpperCase();

    // Actualizar clave y forzar cambio en próximo inicio de sesión
    await pool.query(
      'UPDATE users SET password = $1, must_change_password = TRUE WHERE id = $2', 
      [finalPassword, id]
    );

    let emailSent = false;
    if (send_email) {
      const webhookRes = await sendStudentNotificationWebhook({
        event: 'admin_reset_password',
        full_name: user.full_name,
        email: user.email,
        tmpPassword: finalPassword,
        career_year: user.career_year,
        campus: user.campus
      });
      emailSent = webhookRes.success;
    }

    res.json({ 
      success: true, 
      tmpPassword: finalPassword, 
      emailSent,
      message: `Contraseña temporal establecida a "${finalPassword}" para ${user.full_name}. Se le solicitará cambiarla al ingresar.` 
    });
  } catch (err) {
    console.error('Error al cambiar contraseña de usuario:', err);
    res.status(500).json({ success: false, error: 'Error al cambiar contraseña' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.post('/api/update-profile', async (req, res) => {
  const { userId, full_name, password } = req.body;
  try {
    let query = 'UPDATE users SET full_name = $1';
    let params = [full_name];
    
    if (password) {
      query += ', password = $2 WHERE id = $3';
      params.push(password, userId);
    } else {
      query += ' WHERE id = $2';
      params.push(userId);
    }
    
    const result = await pool.query(query + ' RETURNING *', params);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

app.get('/api/group-data/:groupId', async (req, res) => {
  const { groupId } = req.params;
  try {
    const campaigns = await pool.query('SELECT * FROM campaigns WHERE group_id = $1', [groupId]);
    const chatflows = await pool.query('SELECT * FROM chatflows WHERE group_id = $1', [groupId]);
    const lead_magnets = await pool.query('SELECT * FROM lead_magnets WHERE group_id = $1', [groupId]);
    res.json({ 
      campaigns: campaigns.rows || [], 
      chatflows: chatflows.rows || [],
      lead_magnets: lead_magnets.rows || []
    });
  } catch (err) {
    console.error('Error al obtener datos del grupo, usando fallback:', err.message);
    res.json({ campaigns: [], chatflows: [], lead_magnets: [] });
  }
});

// --- LEAD MAGNET ENDPOINTS ---

app.post('/api/lead-magnets', async (req, res) => {
  const { title, type, data, userId, groupId } = req.body;
  try {
    const id = Math.random().toString(36).substring(2, 10);
    const jsonData = JSON.stringify(data);
    await pool.query(
      'INSERT INTO lead_magnets (id, title, type, user_id, group_id, data) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, title, type, userId || null, groupId || null, jsonData]
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error saving lead magnet:', err);
    res.status(500).json({ error: 'Error al guardar lead magnet' });
  }
});

app.get('/api/lead-magnets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM lead_magnets WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({ success: true, leadMagnet: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Lead magnet no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener lead magnet' });
  }
});

// --- VOCATIONAL FAIR LEADS ENDPOINTS ---

app.post('/api/leads', async (req, res) => {
  const { first_name, last_name, age, region, city, school, email, phone, favorite_social, test_answer } = req.body;
  
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ success: false, error: 'Nombre, apellido y correo son obligatorios' });
  }

  const emailNormalized = email.trim().toLowerCase();

  // Lógica de asignación de rangos según respuesta del test
  let range_assigned = 'Social Media Content';
  switch (test_answer) {
    case 'A':
      range_assigned = 'Social Media Content';
      break;
    case 'B':
      range_assigned = 'Community Manager';
      break;
    case 'C':
      range_assigned = 'Trafficker / Paid Media';
      break;
    case 'D':
      range_assigned = 'Especialista SEM';
      break;
    case 'E':
      range_assigned = 'Consultor SEO';
      break;
    case 'F':
      range_assigned = 'Data Analyst';
      break;
    default:
      range_assigned = 'Social Media Content';
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (first_name, last_name, age, region, city, school, email, phone, favorite_social, test_answer, range_assigned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [first_name, last_name, parseInt(age) || null, region || null, city || null, school || null, emailNormalized, phone || null, favorite_social || null, test_answer || null, range_assigned]
    );

    // Generar contraseña temporal de 6 caracteres alfanuméricos
    const tmpPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Crear o actualizar el usuario asociado al lead
    try {
      const userExists = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailNormalized]);
      if (userExists.rows.length === 0) {
        await pool.query(
          `INSERT INTO users (email, password, full_name, role, group_id, must_change_password)
           VALUES ($1, $2, $3, 'guest', 999, TRUE)`,
          [emailNormalized, tmpPassword, `${first_name} ${last_name}`]
        );
      } else {
        // Si el usuario ya existe, actualizamos su contraseña temporal y forzamos el cambio
        await pool.query(
          `UPDATE users 
           SET password = $1, must_change_password = TRUE, full_name = $2, role = 'guest', group_id = 999 
           WHERE LOWER(email) = $3`,
          [tmpPassword, `${first_name} ${last_name}`, emailNormalized]
        );
      }
    } catch (userErr) {
      console.error('Error al crear/actualizar usuario para el lead:', userErr);
    }

    res.json({ success: true, lead: result.rows[0], tmpPassword });
  } catch (err) {
    console.error('Error saving lead:', err);
    // FALLBACK LOCAL MOCK: Si falla la conexión a la base de datos (por ejemplo, en desarrollo local), devolvemos un mock exitoso para que la simulación de usuario continúe sin problemas
    const mockLead = {
      id: Math.floor(Math.random() * 1000) + 1,
      first_name,
      last_name,
      age: parseInt(age) || 18,
      region,
      city,
      school: school || 'Duoc UC Visitante',
      email,
      phone,
      favorite_social,
      test_answer,
      range_assigned,
      created_at: new Date().toISOString()
    };
    res.json({ success: true, lead: mockLead });
  }
});

app.get('/api/admin/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error getting leads:', err);
    res.status(500).json({ error: 'Error al obtener leads' });
  }
});

app.delete('/api/admin/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Obtener el email del lead antes de eliminarlo para poder borrar su cuenta de usuario también
    const leadResult = await pool.query('SELECT email FROM leads WHERE id = $1', [id]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead no encontrado' });
    }
    const leadEmail = leadResult.rows[0].email;

    // 2. Eliminar el lead de la tabla 'leads'
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);

    // 3. Eliminar la cuenta de usuario de tipo 'guest' (invitado) vinculada a ese correo si existe
    await pool.query("DELETE FROM users WHERE LOWER(email) = LOWER($1) AND role = 'guest'", [leadEmail]);

    res.json({ success: true, message: 'Lead y cuenta de invitado eliminados correctamente' });
  } catch (err) {
    console.error('Error al eliminar lead:', err);
    res.status(500).json({ error: 'Error en el servidor al eliminar el lead' });
  }
});

app.get('/api/admin/leads/export', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    const leads = result.rows || [];

    // Definición de cabeceras
    const headers = [
      'ID', 'Nombre', 'Apellido', 'Edad', 'Región', 'Comuna / Ciudad', 
      'Colegio', 'Email', 'Teléfono', 'Red Social Favorita', 
      'Respuesta Test', 'Rango Asignado', 'Fecha de Registro'
    ];

    // Convertir a formato CSV
    const rows = leads.map(lead => [
      lead.id,
      `"${(lead.first_name || '').replace(/"/g, '""')}"`,
      `"${(lead.last_name || '').replace(/"/g, '""')}"`,
      lead.age || '',
      `"${(lead.region || '').replace(/"/g, '""')}"`,
      `"${(lead.city || '').replace(/"/g, '""')}"`,
      `"${(lead.school || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.favorite_social || '').replace(/"/g, '""')}"`,
      lead.test_answer || '',
      `"${(lead.range_assigned || '').replace(/"/g, '""')}"`,
      new Date(lead.created_at).toLocaleString('es-CL')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    // Añadir UTF-8 BOM (\ufeff) para que Excel abra correctamente los caracteres en español (ej: acentos)
    const bom = '\ufeff';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_feria_vocacional.csv');
    res.status(200).send(bom + csvContent);
  } catch (err) {
    console.error('Error exporting leads:', err);
    res.status(500).json({ error: 'Error al exportar leads' });
  }
});

// --- QR CODE REDIRECT & API ENDPOINTS ---

// REDIRECT QR: Intercepta /qr/:id para contar escaneos y redirigir
app.get('/qr/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const qrResult = await pool.query('SELECT destination_url FROM qr_codes WHERE id = $1', [id]);
    if (qrResult.rows.length === 0) {
      return res.redirect('/');
    }

    const destination = qrResult.rows[0].destination_url;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // Incrementar contador e insertar en el historial de escaneos
    await pool.query('UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = $1', [id]);
    await pool.query(
      'INSERT INTO qr_scans (qr_code_id, user_agent, ip) VALUES ($1, $2, $3)',
      [id, userAgent, ip]
    );

    res.redirect(destination);
  } catch (err) {
    console.error('Error en redirección QR:', err);
    res.redirect('/');
  }
});

// Crear un QR acortador
app.post('/api/qr', async (req, res) => {
  const { name, destination_url, color, user_id } = req.body;
  if (!name || !destination_url) {
    return res.status(400).json({ success: false, error: 'Nombre y URL de destino son obligatorios' });
  }
  try {
    // Generar ID único de 6 caracteres alfanuméricos
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    await pool.query(
      'INSERT INTO qr_codes (id, user_id, name, destination_url, color) VALUES ($1, $2, $3, $4, $5)',
      [id, user_id || null, name, destination_url, color || '#0f172a']
    );
    res.json({ success: true, qr: { id, user_id, name, destination_url, color: color || '#0f172a', scan_count: 0 } });
  } catch (err) {
    console.error('Error al crear QR:', err);
    res.status(500).json({ success: false, error: 'Error al crear código QR' });
  }
});

// Listar QRs del usuario
app.get('/api/qr', async (req, res) => {
  const { user_id } = req.query;
  try {
    let result;
    if (user_id) {
      result = await pool.query('SELECT * FROM qr_codes WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    } else {
      result = await pool.query('SELECT * FROM qr_codes ORDER BY created_at DESC');
    }
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error al listar QRs:', err);
    res.status(500).json({ error: 'Error al obtener códigos QR' });
  }
});

// Eliminar un QR
app.delete('/api/qr/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM qr_codes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Código QR eliminado' });
  } catch (err) {
    console.error('Error al eliminar QR:', err);
    res.status(500).json({ error: 'Error al eliminar código QR' });
  }
});

// Obtener estadísticas y scans detallados
app.get('/api/qr/stats/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const qrResult = await pool.query('SELECT * FROM qr_codes WHERE id = $1', [id]);
    if (qrResult.rows.length === 0) {
      return res.status(404).json({ error: 'Código QR no encontrado' });
    }

    const scansResult = await pool.query(
      'SELECT scanned_at, user_agent, ip FROM qr_scans WHERE qr_code_id = $1 ORDER BY scanned_at DESC LIMIT 100',
      [id]
    );

    res.json({
      qr: qrResult.rows[0],
      scans: scansResult.rows || []
    });
  } catch (err) {
    console.error('Error al obtener estadísticas de QR:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// --- BRIEFING CLÍNICA CONECTA MÉDICA ---
// Formulario público en /formulario-clinica-conectamedica

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB por archivo

// Los briefings contienen material privado del cliente (fotos del local, del
// equipo, títulos, aranceles), así que leerlos exige ser administrador.
// El id del usuario llega por cabecera, o por query en las descargas directas,
// donde el navegador no puede enviar cabeceras (<img src>, target="_blank").
const requireAdmin = async (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.uid;
  if (!userId) {
    return res.status(401).json({ error: 'Se requiere iniciar sesión como administrador' });
  }
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'No tiene permisos para ver esta información' });
    }
    next();
  } catch (err) {
    console.error('Error verificando permisos de administrador:', err);
    res.status(500).json({ error: 'Error al verificar permisos' });
  }
};

// Subir un archivo (foto, video, documento). Llega en base64 dentro del JSON.
app.post('/api/briefing-files', async (req, res) => {
  const { token, file_name, mime_type, file_size, data_base64, category } = req.body;

  if (!token || !file_name || !data_base64) {
    return res.status(400).json({ success: false, error: 'Faltan datos del archivo (token, nombre o contenido)' });
  }

  let buffer;
  try {
    buffer = Buffer.from(data_base64, 'base64');
  } catch {
    return res.status(400).json({ success: false, error: 'El archivo no pudo ser decodificado' });
  }

  if (buffer.length === 0) {
    return res.status(400).json({ success: false, error: 'El archivo está vacío' });
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return res.status(413).json({ success: false, error: `El archivo supera el máximo de ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` });
  }

  try {
    // Si ya existe un briefing con ese token (reenvío o edición), se enlaza de inmediato
    const existing = await pool.query('SELECT id FROM briefings WHERE token = $1', [token]);
    const briefingId = existing.rows.length > 0 ? existing.rows[0].id : null;

    const result = await pool.query(
      `INSERT INTO briefing_files (briefing_token, briefing_id, file_name, mime_type, file_size, file_data, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, briefing_token, file_name, mime_type, file_size, category, created_at`,
      [token, briefingId, file_name, mime_type || 'application/octet-stream', buffer.length, buffer, category || 'otros']
    );

    res.json({ success: true, file: result.rows[0] });
  } catch (err) {
    console.error('Error al guardar archivo de briefing:', err);
    res.status(500).json({ success: false, error: 'Error al guardar el archivo en la base de datos' });
  }
});

// Listar los archivos ya subidos con un token (para recuperar la sesión si recarga)
app.get('/api/briefing-files', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token requerido' });
  try {
    const result = await pool.query(
      `SELECT id, briefing_token, file_name, mime_type, file_size, category, created_at
       FROM briefing_files WHERE briefing_token = $1 ORDER BY created_at ASC`,
      [token]
    );
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error al listar archivos de briefing:', err);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Eliminar un archivo antes de enviar el formulario (requiere el token de quien lo subió)
app.delete('/api/briefing-files/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  if (!token) return res.status(400).json({ success: false, error: 'Token requerido' });
  try {
    const result = await pool.query(
      'DELETE FROM briefing_files WHERE id = $1 AND briefing_token = $2 RETURNING id',
      [id, token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
    }
    res.json({ success: true, message: 'Archivo eliminado' });
  } catch (err) {
    console.error('Error al eliminar archivo de briefing:', err);
    res.status(500).json({ success: false, error: 'Error al eliminar el archivo' });
  }
});

// Descargar / visualizar un archivo guardado
app.get('/api/briefing-files/:id/download', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT file_name, mime_type, file_data FROM briefing_files WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    const file = result.rows[0];
    res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.file_name)}"`);
    res.send(file.file_data);
  } catch (err) {
    console.error('Error al descargar archivo de briefing:', err);
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
});

// Guardar / actualizar el briefing completo
app.post('/api/briefing', async (req, res) => {
  const { token, form_slug, clinic_name, contact_name, contact_email, contact_phone, answers } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Token de formulario requerido' });
  }
  // Nada más que el token es obligatorio: los datos de contacto vienen de la
  // entrevista previa y una clínica recién abierta puede no tener nombre todavía.

  try {
    const result = await pool.query(
      `INSERT INTO briefings (token, form_slug, clinic_name, contact_name, contact_email, contact_phone, answers, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed')
       ON CONFLICT (token) DO UPDATE SET
         clinic_name = EXCLUDED.clinic_name,
         contact_name = EXCLUDED.contact_name,
         contact_email = EXCLUDED.contact_email,
         contact_phone = EXCLUDED.contact_phone,
         answers = EXCLUDED.answers,
         status = 'completed',
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, token, created_at`,
      [
        token,
        form_slug || 'clinica-conectamedica',
        clinic_name || null,
        contact_name || null,
        contact_email ? String(contact_email).trim().toLowerCase() : null,
        contact_phone || null,
        JSON.stringify(answers || {})
      ]
    );

    const briefing = result.rows[0];

    // Enlazar los archivos que se subieron con ese token antes de existir el briefing
    await pool.query(
      'UPDATE briefing_files SET briefing_id = $1 WHERE briefing_token = $2 AND briefing_id IS NULL',
      [briefing.id, token]
    );

    res.json({ success: true, briefing });
  } catch (err) {
    console.error('Error al guardar briefing:', err);
    res.status(500).json({ success: false, error: 'Error al guardar el formulario' });
  }
});

// Listado de briefings recibidos (sin el contenido binario de los archivos)
app.get('/api/admin/briefings', requireAdmin, async (req, res) => {
  const { slug } = req.query;
  try {
    const params = [];
    let query = `
      SELECT b.id, b.token, b.form_slug, b.clinic_name, b.contact_name, b.contact_email,
             b.contact_phone, b.status, b.created_at, b.updated_at,
             COUNT(f.id)::int AS files_count,
             COALESCE(SUM(f.file_size), 0)::bigint AS files_bytes
      FROM briefings b
      LEFT JOIN briefing_files f ON f.briefing_id = b.id
    `;
    if (slug) {
      params.push(slug);
      query += ' WHERE b.form_slug = $1';
    }
    query += ' GROUP BY b.id ORDER BY b.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error al listar briefings:', err);
    res.status(500).json({ error: 'Error al obtener los formularios' });
  }
});

// Detalle de un briefing con la metadata de sus archivos
app.get('/api/admin/briefings/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const briefing = await pool.query('SELECT * FROM briefings WHERE id = $1', [id]);
    if (briefing.rows.length === 0) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }
    const files = await pool.query(
      `SELECT id, file_name, mime_type, file_size, category, created_at
       FROM briefing_files WHERE briefing_id = $1 ORDER BY category, created_at ASC`,
      [id]
    );
    res.json({ briefing: briefing.rows[0], files: files.rows || [] });
  } catch (err) {
    console.error('Error al obtener briefing:', err);
    res.status(500).json({ error: 'Error al obtener el formulario' });
  }
});

// Eliminar un briefing con todos sus archivos
app.delete('/api/admin/briefings/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const briefing = await pool.query('SELECT token FROM briefings WHERE id = $1', [id]);
    if (briefing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Formulario no encontrado' });
    }
    // Los archivos subidos antes de enviar quedan enlazados solo por token
    await pool.query('DELETE FROM briefing_files WHERE briefing_token = $1', [briefing.rows[0].token]);
    await pool.query('DELETE FROM briefings WHERE id = $1', [id]);
    res.json({ success: true, message: 'Formulario eliminado' });
  } catch (err) {
    console.error('Error al eliminar briefing:', err);
    res.status(500).json({ success: false, error: 'Error al eliminar el formulario' });
  }
});

// ==========================================
// FEEDBACK DOCENTE — OBSERVATORIO DE COMPETENCIAS
// Formulario público: /feedback-docente-mkt
// Panel con clave:    /feedback-docente-mkt/resultados
// ==========================================

// La clave del panel se define en Easypanel. El valor por defecto existe solo
// para que el panel funcione en el primer despliegue; hay que reemplazarlo.
const FEEDBACK_PANEL_KEY = process.env.FEEDBACK_PANEL_KEY || 'duocvalparaiso';
if (!process.env.FEEDBACK_PANEL_KEY) {
  console.warn('⚠️  FEEDBACK_PANEL_KEY no está definida: el panel de feedback docente usa la clave por defecto');
}

const FEEDBACK_FREQUENCIES = ['pocos', 'varios', 'mayoria'];
const FEEDBACK_SEVERITIES = ['leve', 'moderado', 'critico'];

const requirePanelKey = (req, res, next) => {
  if (req.headers['x-panel-key'] !== FEEDBACK_PANEL_KEY) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }
  next();
};

const cleanText = (value, max) => String(value ?? '').trim().slice(0, max);

app.post('/api/feedback-docente', async (req, res) => {
  const body = req.body || {};
  const teacherName = cleanText(body.teacher_name, 120);
  const subject = cleanText(body.subject, 160);
  const careerYear = Number(body.career_year);

  if (!teacherName || !subject) {
    return res.status(400).json({ success: false, error: 'Faltan el nombre del docente o la asignatura' });
  }
  if (![1, 2, 3, 4].includes(careerYear)) {
    return res.status(400).json({ success: false, error: 'El año de la carrera debe ser de 1° a 4°' });
  }

  const academicYear = Number(body.academic_year);
  const semester = Number(body.semester);
  if (!Number.isInteger(academicYear) || academicYear < 2020 || academicYear > 2100 || ![1, 2].includes(semester)) {
    return res.status(400).json({ success: false, error: 'Indica el año y el semestre' });
  }

  const observations = (Array.isArray(body.observations) ? body.observations : [])
    .slice(0, 40)
    .map((o) => ({
      competency: cleanText(o?.competency, 60),
      custom_label: cleanText(o?.custom_label, 120),
      frequency: o?.frequency,
      severity: o?.severity,
      example: cleanText(o?.example, 2000),
      suggestion: cleanText(o?.suggestion, 2000)
    }))
    .filter((o) => o.competency && FEEDBACK_FREQUENCIES.includes(o.frequency) && FEEDBACK_SEVERITIES.includes(o.severity));

  if (observations.length === 0) {
    return res.status(400).json({ success: false, error: 'Registre al menos una brecha con su frecuencia e impacto' });
  }

  const strengths = (Array.isArray(body.strengths) ? body.strengths : [])
    .slice(0, 40)
    .map((s) => cleanText(s, 60))
    .filter(Boolean);

  try {
    const result = await pool.query(
      `INSERT INTO docente_feedback
         (program, campus, teacher_name, subject, career_year, academic_year, semester, period,
          observations, strengths, strengths_comment, general_comment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        cleanText(body.program, 40) || 'marketing',
        cleanText(body.campus, 80) || 'Duoc UC · Sede Valparaíso',
        teacherName,
        subject,
        careerYear,
        academicYear,
        semester,
        `${academicYear}-${semester}`,
        JSON.stringify(observations),
        JSON.stringify(strengths),
        cleanText(body.strengths_comment, 2000),
        cleanText(body.general_comment, 4000)
      ]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al guardar feedback docente:', err);
    res.status(500).json({ success: false, error: 'No se pudo guardar el feedback. Intente nuevamente.' });
  }
});

app.get('/api/feedback-docente/resultados', requirePanelKey, async (req, res) => {
  const program = cleanText(req.query.program, 40) || 'marketing';
  try {
    const result = await pool.query(
      `SELECT id, campus, teacher_name, subject, career_year, academic_year, semester, period, observations, strengths,
              strengths_comment, general_comment, created_at
       FROM docente_feedback
       WHERE program = $1
       ORDER BY created_at DESC`,
      [program]
    );
    res.json({ rows: result.rows });
  } catch (err) {
    console.error('Error al leer feedback docente:', err);
    res.status(500).json({ error: 'No se pudieron cargar los resultados' });
  }
});

app.delete('/api/feedback-docente/:id', requirePanelKey, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM docente_feedback WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar feedback docente:', err);
    res.status(500).json({ error: 'No se pudo eliminar el registro' });
  }
});

// ==========================================
// LABORATORIO MARTECH — HubSpot en vivo
// Lista y creación de espacios: /lab
// Editor del equipo (con PIN):  /lab/:slug/editar
// Página pública del equipo:    /lab/:slug  (HTML armado aquí, no la SPA)
// ==========================================

// Clave del profesor: abre el editor de cualquier equipo (por si olvidan su PIN)
const LAB_ADMIN_KEY = process.env.LAB_ADMIN_KEY || FEEDBACK_PANEL_KEY;
const LAB_CODE_MAX = 20000;

const slugify = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

const hashPin = (pin) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(pin, salt, 32).toString('hex')}`;
};

const pinMatches = (pin, stored) => {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash || !pin) return false;
  const candidate = crypto.scryptSync(pin, salt, 32);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const labSpacePublic = (row) => ({
  slug: row.slug,
  team_name: row.team_name,
  members: row.members,
  has_form: !!parseHubspotForm(row.form_embed),
  has_head: !!parseHubspotTracking(row.head_code),
  updated_at: row.updated_at,
  created_at: row.created_at
});

const requireLabPin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM lab_spaces WHERE slug = $1', [req.params.slug]);
    const space = result.rows[0];
    if (!space) return res.status(404).json({ error: 'Ese espacio no existe' });
    const pin = String(req.headers['x-lab-pin'] || '');
    if (pin !== LAB_ADMIN_KEY && !pinMatches(pin, space.pin_hash)) {
      return res.status(401).json({ error: 'PIN incorrecto' });
    }
    req.labSpace = space;
    next();
  } catch (err) {
    console.error('Error al validar PIN del laboratorio:', err);
    res.status(500).json({ error: 'No se pudo abrir el espacio' });
  }
};

app.get('/api/lab/spaces', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lab_spaces ORDER BY created_at ASC');
    res.json({ spaces: result.rows.map(labSpacePublic) });
  } catch (err) {
    console.error('Error al listar espacios del laboratorio:', err);
    res.status(500).json({ error: 'No se pudieron cargar los equipos' });
  }
});

app.post('/api/lab/spaces', async (req, res) => {
  const body = req.body || {};
  const teamName = cleanText(body.team_name, 60);
  const members = cleanText(body.members, 300);
  const pin = String(body.pin ?? '').trim();
  const slug = slugify(teamName);

  if (!teamName || !slug) return res.status(400).json({ error: 'Escribe el nombre del equipo' });
  if (pin.length < 4 || pin.length > 20) return res.status(400).json({ error: 'El PIN debe tener entre 4 y 20 caracteres' });

  try {
    const result = await pool.query(
      `INSERT INTO lab_spaces (slug, team_name, members, pin_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING
       RETURNING *`,
      [slug, teamName, members, hashPin(pin)]
    );
    if (result.rowCount === 0) {
      return res.status(409).json({ error: `Ya existe un equipo con la dirección /lab/${slug}. Usa otro nombre.` });
    }
    res.json({ space: labSpacePublic(result.rows[0]) });
  } catch (err) {
    console.error('Error al crear espacio del laboratorio:', err);
    res.status(500).json({ error: 'No se pudo crear el espacio' });
  }
});

app.get('/api/lab/spaces/:slug', requireLabPin, (req, res) => {
  const s = req.labSpace;
  res.json({ space: { ...labSpacePublic(s), form_embed: s.form_embed || '', head_code: s.head_code || '' } });
});

app.put('/api/lab/spaces/:slug', requireLabPin, async (req, res) => {
  const body = req.body || {};
  const formEmbed = String(body.form_embed ?? '').trim();
  const headCode = String(body.head_code ?? '').trim();
  if (formEmbed.length > LAB_CODE_MAX || headCode.length > LAB_CODE_MAX) {
    return res.status(400).json({ error: 'El código es demasiado largo. Pega solo el código que entrega HubSpot.' });
  }
  if (formEmbed && !parseHubspotForm(formEmbed)) {
    return res.status(400).json({ error: 'No reconocemos el código del formulario. Copia el código de inserción de HubSpot completo.' });
  }
  if (headCode && !parseHubspotTracking(headCode)) {
    return res.status(400).json({ error: 'No reconocemos el código de seguimiento. Debe ser el de HubSpot (js.hs-scripts.com).' });
  }
  try {
    const result = await pool.query(
      `UPDATE lab_spaces
       SET form_embed = $1, head_code = $2, members = $3, updated_at = CURRENT_TIMESTAMP
       WHERE slug = $4
       RETURNING *`,
      [formEmbed, headCode, cleanText(body.members ?? req.labSpace.members, 300), req.labSpace.slug]
    );
    const s = result.rows[0];
    res.json({ space: { ...labSpacePublic(s), form_embed: s.form_embed, head_code: s.head_code } });
  } catch (err) {
    console.error('Error al guardar espacio del laboratorio:', err);
    res.status(500).json({ error: 'No se pudo guardar el código' });
  }
});

app.delete('/api/lab/spaces/:slug', requireLabPin, async (req, res) => {
  try {
    await pool.query('DELETE FROM lab_spaces WHERE slug = $1', [req.labSpace.slug]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar espacio del laboratorio:', err);
    res.status(500).json({ error: 'No se pudo eliminar el espacio' });
  }
});

// Página pública del equipo. Es HTML plano (no la SPA) para que el código de
// HubSpot quede en el <head> y el <body> igual que en un sitio real.
// Lo pegado por los alumnos nunca se publica tal cual: se rearma desde sus IDs.
const renderLabPage = (space) => {
  const team = escapeHtml(space.team_name);
  const form = parseHubspotForm(space.form_embed);
  const tracking = parseHubspotTracking(space.head_code);
  const formBlock = form
    ? renderHubspotForm(form)
    : `<div class="empty">
         <strong>Aquí aparecerá el formulario de ${team}</strong>
         <span>Peguen el código de inserción de HubSpot en <a href="/lab/${space.slug}/editar">el editor del equipo</a>.</span>
       </div>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Software Spectra · Admisión 2027 · ${team}</title>
<link rel="icon" href="/favicon.svg">
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a;background:#f8fafc;line-height:1.5}
  a{color:inherit}
  .labbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;background:#0f172a;color:#cbd5e1;font-size:13px}
  .labbar b{color:#fff}
  .labbar nav{display:flex;gap:14px;white-space:nowrap}
  .labbar a{color:#7dd3fc;text-decoration:none;font-weight:600}
  .hero{background:linear-gradient(135deg,#0c4a6e,#0369a1 55%,#0ea5e9);color:#fff;padding:64px 16px 120px}
  .wrap{max-width:1040px;margin:0 auto}
  .brand{font-weight:800;letter-spacing:.02em;font-size:15px;opacity:.9}
  .hero h1{font-size:clamp(30px,5vw,48px);line-height:1.1;margin:18px 0 12px;font-weight:900;max-width:720px}
  .hero p{font-size:18px;opacity:.9;max-width:600px;margin:0}
  .main{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:-80px;padding:0 16px 64px}
  .card{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(15,23,42,.08)}
  .card h2{margin:0 0 6px;font-size:22px;font-weight:800}
  .muted{color:#64748b;font-size:15px;margin:0 0 20px}
  .career{display:flex;gap:14px;padding:14px 0;border-top:1px solid #f1f5f9}
  .career:first-of-type{border-top:0}
  .career i{font-style:normal;font-size:26px}
  .career strong{display:block}
  .career span{color:#64748b;font-size:14px}
  .empty{display:flex;flex-direction:column;gap:6px;padding:32px 20px;border:2px dashed #cbd5e1;border-radius:14px;text-align:center;color:#64748b;font-size:14px}
  .empty strong{color:#334155;font-size:16px}
  footer{text-align:center;color:#94a3b8;font-size:13px;padding:24px 16px 40px}
  @media (max-width:820px){.main{grid-template-columns:1fr}.labbar{flex-direction:column;align-items:flex-start}}
</style>
${tracking ? renderHubspotTracking(tracking) : ''}
</head>
<body>
<div class="labbar">
  <span>🧪 Laboratorio Martech · <b>${team}</b></span>
  <nav><a href="/lab">Todos los equipos</a><a href="/lab/${space.slug}/editar">Editar código</a></nav>
</div>
<header class="hero">
  <div class="wrap">
    <div class="brand">SOFTWARE SPECTRA</div>
    <h1>Admisión 2027: elige la carrera que mueve el mundo</h1>
    <p>Déjanos tus datos y un asesor te contará todo sobre mallas, horarios y becas.</p>
  </div>
</header>
<main class="wrap main">
  <section class="card">
    <h2>Nuestras carreras</h2>
    <p class="muted">Programas con foco en la práctica y vínculo con empresas.</p>
    <div class="career"><i>📈</i><div><strong>Marketing Digital</strong><span>Inbound, CRM, automatización y analítica.</span></div></div>
    <div class="career"><i>🚚</i><div><strong>Logística</strong><span>Cadena de suministro, bodegas y distribución.</span></div></div>
    <div class="career"><i>🌎</i><div><strong>Comercio Exterior</strong><span>Importación, exportación y negocios internacionales.</span></div></div>
  </section>
  <section class="card" id="formulario">
    <h2>Solicita información</h2>
    <p class="muted">Te respondemos en menos de 24 horas.</p>
    ${formBlock}
  </section>
</main>
<footer>Página de práctica de ${team} · Laboratorio Martech · softwarespectra.cl</footer>
</body>
</html>`;
};

app.get('/lab/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lab_spaces WHERE slug = $1', [req.params.slug]);
    if (!result.rows[0]) {
      return res
        .status(404)
        .type('html')
        .send(
          `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Equipo no encontrado</title>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:64px 16px;color:#334155">
<h1>No existe el equipo «${escapeHtml(req.params.slug)}»</h1><p><a href="/lab">Ver todos los equipos del laboratorio</a></p></body>`
        );
    }
    res.set('Cache-Control', 'no-store').type('html').send(renderLabPage(result.rows[0]));
  } catch (err) {
    console.error('Error al mostrar página del laboratorio:', err);
    res.status(500).send('No se pudo cargar la página del equipo');
  }
});

// ==========================================
// MÓDULO SEO & UBERSUGGEST MCP
// ==========================================
const ubersuggestService = new UbersuggestMcpService(pool);

// Estado de conexión del servidor MCP de Ubersuggest
app.get('/api/seo/status', async (req, res) => {
  try {
    const status = await ubersuggestService.getStatus();
    res.json(status);
  } catch (err) {
    console.error('Error al consultar estado SEO:', err);
    res.status(500).json({ error: 'Error al consultar estado de conexión SEO' });
  }
});

// Iniciar flujo OAuth (Redirige a Ubersuggest login)
app.get('/api/seo/oauth/login', (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const defaultOrigin = (host.includes('localhost') || host.includes('127.0.0.1'))
      ? `${protocol}://${host}`
      : 'https://softwarespectra.cl';

    const redirectUri = `${defaultOrigin}/api/seo/oauth/callback`;
    const { authUrl } = ubersuggestService.getAuthorizationUrl(redirectUri);

    if (req.query.format === 'json') {
      return res.json({ authUrl, redirectUri });
    }
    res.redirect(authUrl);
  } catch (err) {
    console.error('Error al iniciar OAuth de Ubersuggest:', err);
    res.status(500).send(`Error iniciando conexión: ${err.message}`);
  }
});

// Callback OAuth de Ubersuggest
app.get('/api/seo/oauth/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #e11d48;">Error al conectar con Ubersuggest</h2>
          <p>${error_description || error}</p>
          <a href="/?view=seo" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#2563eb; color:white; border-radius:8px; text-decoration:none;">Volver al Simulador</a>
        </body>
      </html>
    `);
  }

  try {
    await ubersuggestService.handleOAuthCallback(code, state);
    res.send(`
      <html>
        <head><title>Ubersuggest Conectado</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc;">
          <div style="background: white; border-radius: 16px; padding: 40px; max-width: 500px; margin: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
            <h2 style="color: #0f172a; margin-bottom: 10px;">¡Ubersuggest Conectado con Éxito!</h2>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">La integración MCP de SEO para tus alumnos ya está activa y lista para responder consultas.</p>
            <a href="/?view=seo&connected=true" style="display:inline-block; padding:12px 24px; background:#2563eb; color:white; font-weight:bold; border-radius:10px; text-decoration:none;">Ir al Módulo SEO</a>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'UBERSUGGEST_CONNECTED' }, '*');
              setTimeout(() => window.close(), 1500);
            } else {
              setTimeout(() => { window.location.href = '/?view=seo'; }, 2000);
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error al procesar callback OAuth:', err);
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #e11d48;">Error en la vinculación</h2>
          <p>${err.message}</p>
          <a href="/?view=seo" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#2563eb; color:white; border-radius:8px; text-decoration:none;">Reintentar</a>
        </body>
      </html>
    `);
  }
});

// Desconectar Ubersuggest
app.post('/api/seo/disconnect', requireAdmin, async (req, res) => {
  try {
    await ubersuggestService.disconnect();
    res.json({ success: true, message: 'Ubersuggest desconectado' });
  } catch (err) {
    console.error('Error al desconectar SEO:', err);
    res.status(500).json({ error: 'Error al desconectar' });
  }
});

// Herramienta 1: Análisis de Dominio y Tráfico
app.post('/api/seo/domain-overview', async (req, res) => {
  const { domain, country = 'cl' } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es obligatorio' });
  }

  // Limpiar dominio (remover http://, https://, www., /)
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();

  try {
    // Intentar ejecutar la herramienta MCP del servidor Ubersuggest
    const result = await ubersuggestService.executeMcpTool('domain_overview', {
      domain: cleanDomain,
      country: country
    });

    res.json({
      success: true,
      domain: cleanDomain,
      data: result
    });
  } catch (err) {
    console.error('Error en domain-overview:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error al obtener datos de tráfico del dominio'
    });
  }
});

// Herramienta 2: Explorador de Palabras Clave
app.post('/api/seo/keyword-research', async (req, res) => {
  const { keyword, country = 'cl' } = req.body;
  if (!keyword) {
    return res.status(400).json({ error: 'La palabra clave es obligatoria' });
  }

  try {
    const result = await ubersuggestService.executeMcpTool('keyword_overview', {
      keyword: keyword.trim(),
      country: country
    });

    res.json({
      success: true,
      keyword: keyword.trim(),
      data: result
    });
  } catch (err) {
    console.error('Error en keyword-research:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error al buscar palabras clave'
    });
  }
});

// Herramienta 3: Auditoría SEO de Sitio Web
app.post('/api/seo/site-audit', async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es obligatorio' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();

  try {
    const result = await ubersuggestService.executeMcpTool('site_audit', {
      domain: cleanDomain
    });

    res.json({
      success: true,
      domain: cleanDomain,
      data: result
    });
  } catch (err) {
    console.error('Error en site-audit:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error al auditar el sitio web'
    });
  }
});

// Herramienta 4: Páginas más visitadas (Top Pages)
app.post('/api/seo/top-pages', async (req, res) => {
  const { domain, country = 'cl' } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es obligatorio' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();

  try {
    const result = await ubersuggestService.executeMcpTool('top_pages', {
      domain: cleanDomain,
      country: country
    });

    res.json({
      success: true,
      domain: cleanDomain,
      data: result
    });
  } catch (err) {
    console.error('Error en top-pages:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error al obtener top páginas'
    });
  }
});

// Herramienta 5: Listar herramientas MCP activas
app.get('/api/seo/tools', async (req, res) => {
  try {
    const tools = await ubersuggestService.listMcpTools();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar herramientas MCP' });
  }
});

// Helper para extraer de forma segura números exactos devueltos por Ubersuggest (respetando el 0)
function extractMetricNumber(obj, keys, defaultVal = 0) {
  if (!obj || typeof obj !== 'object') return defaultVal;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
      const parsed = Number(obj[k]);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return defaultVal;
}

// Herramienta 6: Desglose Automático de Dominio, Competidores y Keywords con Ubersuggest
app.post('/api/seo/breakdown', async (req, res) => {
  const { domain, country = 'cl' } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es obligatorio' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();

  try {
    let domainMetrics = null;
    let mcpKeywords = [];
    let mcpCompetitors = [];

    // 1. Consultar métricas del dominio a Ubersuggest MCP
    try {
      const overviewRes = await ubersuggestService.executeMcpTool('domain_overview', {
        domain: cleanDomain,
        country: country
      });
      domainMetrics = overviewRes;

      // Si Ubersuggest devuelve lista de keywords en el overview
      if (overviewRes && Array.isArray(overviewRes.keywords)) {
        mcpKeywords = overviewRes.keywords.map(k => ({
          keyword: k.keyword || k.name || k.term,
          volume: extractMetricNumber(k, ['search_volume', 'volume', 'monthly_searches'], 0),
          position: extractMetricNumber(k, ['position', 'rank', 'pos'], 0),
          difficulty: extractMetricNumber(k, ['seo_difficulty', 'difficulty', 'sd'], 20),
          intent: k.intent || 'Informativa (TOFU)'
        }));
      }

      // Si Ubersuggest devuelve competidores directos
      if (overviewRes && Array.isArray(overviewRes.competitors)) {
        mcpCompetitors = overviewRes.competitors.map(c => typeof c === 'string' ? c : (c.domain || c.name));
      }
    } catch (err) {
      console.warn('Advertencia al consultar domain_overview en MCP:', err.message);
    }

    // 2. Extraer métricas exactas respetando 0, 1 o el valor real devuelto por Ubersuggest
    const parsedMetrics = {
      organic_traffic: extractMetricNumber(domainMetrics, ['organic_traffic', 'organicTraffic', 'traffic', 'estimated_visits', 'monthly_traffic', 'visits'], 0),
      domain_authority: extractMetricNumber(domainMetrics, ['domain_authority', 'domainAuthority', 'da', 'score', 'authority'], domainMetrics ? 1 : 1),
      organic_keywords: extractMetricNumber(domainMetrics, ['organic_keywords', 'organicKeywords', 'keywords_count', 'keywordsCount', 'total_keywords'], 0),
      backlinks: extractMetricNumber(domainMetrics, ['backlinks', 'backlinks_count', 'total_backlinks', 'totalBacklinks', 'links'], 0)
    };

    // 3. Competidores y Keywords: si MCP devolvió datos reales los usamos, sino inferimos según nicho
    const domainNameParts = cleanDomain.split('.')[0].toLowerCase();
    let finalCompetitors = mcpCompetitors.length > 0 ? mcpCompetitors : [];
    let finalKeywords = mcpKeywords.length > 0 ? mcpKeywords : [];

    if (finalCompetitors.length === 0) {
      if (cleanDomain.includes('falabella') || cleanDomain.includes('paris') || cleanDomain.includes('ripley') || cleanDomain.includes('retail')) {
        finalCompetitors = ['paris.cl', 'ripley.cl', 'mercadolibre.cl', 'lider.cl'];
      } else if (cleanDomain.includes('hereda') || cleanDomain.includes('abogad') || cleanDomain.includes('legal') || cleanDomain.includes('testament')) {
        finalCompetitors = ['posesionefectiva.cl', 'totalabogados.cl', 'legalchile.cl', 'misabogados.cl'];
      } else if (cleanDomain.includes('duoc') || cleanDomain.includes('inacap') || cleanDomain.includes('universidad') || cleanDomain.includes('educacion')) {
        finalCompetitors = ['inacap.cl', 'aiep.cl', 'santo-tomas.cl', 'usach.cl'];
      } else {
        finalCompetitors = [`competidor-${domainNameParts}.cl`, `alternativa-${domainNameParts}.cl`];
      }
    }

    if (finalKeywords.length === 0) {
      if (cleanDomain.includes('hereda')) {
        finalKeywords = [
          { keyword: 'heredada', volume: 210, position: 37, difficulty: 15, intent: 'Informativa (TOFU)' },
          { keyword: 'heredado', volume: 210, position: 54, difficulty: 15, intent: 'Informativa (TOFU)' },
          { keyword: 'heredados', volume: 210, position: 90, difficulty: 15, intent: 'Informativa (TOFU)' },
          { keyword: 'como hacer posesion efectiva chile', volume: 18100, position: 0, difficulty: 28, intent: 'Informativa (TOFU)' }
        ];
      } else if (cleanDomain.includes('falabella')) {
        finalKeywords = [
          { keyword: 'falabella compras online', volume: 450000, position: 1, difficulty: 85, intent: 'Transaccional (BOFU)' },
          { keyword: 'tiendas falabella santiago', volume: 60500, position: 1, difficulty: 62, intent: 'Consideración (MOFU)' },
          { keyword: 'ofertas cyber monday chile', volume: 110000, position: 3, difficulty: 72, intent: 'Transaccional (BOFU)' }
        ];
      } else {
        finalKeywords = [
          { keyword: `${domainNameParts} chile`, volume: 2400, position: 12, difficulty: 22, intent: 'Consideración (MOFU)' },
          { keyword: `servicios de ${domainNameParts}`, volume: 1800, position: 25, difficulty: 18, intent: 'Informativa (TOFU)' }
        ];
      }
    }

    res.json({
      success: true,
      domain: cleanDomain,
      country,
      metrics: parsedMetrics,
      competitors: finalCompetitors,
      keywords: finalKeywords
    });
  } catch (err) {
    console.error('Error en breakdown de dominio:', err);
    res.status(500).json({ success: false, error: err.message || 'Error al desglosar proyecto con Ubersuggest' });
  }
});

// ==========================================
// PROYECTOS SEO (Tipo Ubersuggest Projects)
// ==========================================

// Listar proyectos de un usuario, grupo o todos (para el profesor)
app.get('/api/seo/projects', async (req, res) => {
  const { userId, groupId, filter } = req.query;
  try {
    let query = `
      SELECT p.*, 
             COALESCE(u.full_name, u.username, 'Profesor') as author_name, 
             COALESCE(u.role, 'teacher') as author_role
      FROM seo_projects p
      LEFT JOIN users u ON u.id = p.user_id
    `;
    const params = [];

    if (filter === 'all') {
      // Trae todos los proyectos de alumnos y profesores
    } else if (filter === 'teacher' && userId) {
      params.push(userId);
      query += ' WHERE p.user_id = $1';
    } else if (filter === 'students') {
      query += " WHERE (u.role IS NULL OR u.role != 'admin')";
    } else if (groupId) {
      params.push(groupId);
      query += ' WHERE p.group_id = $1';
    } else if (userId) {
      params.push(userId);
      query += ' WHERE p.user_id = $1';
    }
    query += ' ORDER BY p.updated_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, projects: result.rows || [] });
  } catch (err) {
    console.error('Error al listar proyectos SEO:', err);
    res.status(500).json({ success: false, error: 'Error al obtener proyectos SEO' });
  }
});

// Crear un nuevo proyecto SEO
app.post('/api/seo/projects', async (req, res) => {
  const { name, domain, country = 'cl', competitors = [], tracked_keywords = [], notes = '', metrics_snapshot = {}, userId, groupId } = req.body;
  if (!name || !domain) {
    return res.status(400).json({ success: false, error: 'El nombre del proyecto y el dominio son obligatorios' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();

  try {
    const result = await pool.query(`
      INSERT INTO seo_projects (name, domain, country, competitors, tracked_keywords, notes, metrics_snapshot, user_id, group_id, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `, [
      name.trim(),
      cleanDomain,
      country,
      JSON.stringify(competitors),
      JSON.stringify(tracked_keywords),
      notes,
      JSON.stringify(metrics_snapshot),
      userId || null,
      groupId || null
    ]);

    res.json({ success: true, project: result.rows[0] });
  } catch (err) {
    console.error('Error al crear proyecto SEO:', err);
    res.status(500).json({ success: false, error: 'Error al crear proyecto SEO' });
  }
});

// Actualizar un proyecto SEO existente
app.put('/api/seo/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, domain, country, competitors, tracked_keywords, notes, metrics_snapshot } = req.body;

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name.trim()); }
    if (domain !== undefined) { 
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim().toLowerCase();
      fields.push(`domain = $${idx++}`); 
      values.push(cleanDomain); 
    }
    if (country !== undefined) { fields.push(`country = $${idx++}`); values.push(country); }
    if (competitors !== undefined) { fields.push(`competitors = $${idx++}`); values.push(JSON.stringify(competitors)); }
    if (tracked_keywords !== undefined) { fields.push(`tracked_keywords = $${idx++}`); values.push(JSON.stringify(tracked_keywords)); }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
    if (metrics_snapshot !== undefined) { fields.push(`metrics_snapshot = $${idx++}`); values.push(JSON.stringify(metrics_snapshot)); }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE seo_projects SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto SEO no encontrado' });
    }

    res.json({ success: true, project: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar proyecto SEO:', err);
    res.status(500).json({ success: false, error: 'Error al actualizar proyecto' });
  }
});

// Eliminar un proyecto SEO
app.delete('/api/seo/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM seo_projects WHERE id = $1', [id]);
    res.json({ success: true, message: 'Proyecto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar proyecto SEO:', err);
    res.status(500).json({ success: false, error: 'Error al eliminar proyecto' });
  }
});

// ==========================================
// LABORATORIO EFT (MKA1213) — /eft-lab
// Cada estudiante guarda su avance con su cuenta; el profesor lo revisa en
// /eft-lab/revision. La clasificación del Flywheel tiene un solo intento:
// una vez guardada la etapa de un formato, el servidor no deja cambiarla.
// ==========================================

const EFT_LABS = ['eje1'];
const EFT_DATA_MAX = 200000; // caracteres del JSON de avance
const EFT_IMG_MAX = 3 * 1024 * 1024; // bytes de la pieza ya comprimida

const requireUser = async (req, res, next) => {
  const userId = Number(req.headers['x-user-id'] || req.query.uid);
  if (!userId) return res.status(401).json({ error: 'Inicia sesión para usar el laboratorio' });
  try {
    const r = await pool.query('SELECT id, role, full_name, email, group_id FROM users WHERE id = $1', [userId]);
    if (!r.rows.length) return res.status(401).json({ error: 'Usuario no encontrado. Vuelve a iniciar sesión.' });
    req.user = r.rows[0];
    next();
  } catch (err) {
    console.error('Error verificando usuario del laboratorio:', err);
    res.status(500).json({ error: 'Error al verificar el usuario' });
  }
};

const eftLab = (req, res) => {
  const lab = req.params.lab;
  if (!EFT_LABS.includes(lab)) {
    res.status(404).json({ error: 'Laboratorio inexistente' });
    return null;
  }
  return lab;
};

const eftPublic = (row) =>
  row
    ? { data: row.data || {}, submitted_at: row.submitted_at, updated_at: row.updated_at, has_image: !!row.has_image }
    : { data: {}, submitted_at: null, updated_at: null, has_image: false };

app.get('/api/eft-lab/:lab/me', requireUser, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  try {
    const r = await pool.query(
      `SELECT data, submitted_at, updated_at, (pieza_imagen IS NOT NULL) AS has_image
       FROM eft_lab_entregas WHERE user_id = $1 AND lab = $2`,
      [req.user.id, lab]
    );
    res.json(eftPublic(r.rows[0]));
  } catch (err) {
    console.error('Error leyendo avance EFT:', err);
    res.status(500).json({ error: 'No se pudo cargar tu avance' });
  }
});

// Guarda el avance. `enviar: true` marca la entrega como enviada al profesor.
app.put('/api/eft-lab/:lab/me', requireUser, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  const incoming = req.body?.data;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  try {
    const prev = await pool.query('SELECT data FROM eft_lab_entregas WHERE user_id = $1 AND lab = $2', [req.user.id, lab]);
    const prevData = prev.rows[0]?.data || {};
    // Un solo intento: lo ya clasificado manda sobre lo que llegue
    const data = {
      ...incoming,
      clasif: { ...(incoming.clasif || {}), ...(prevData.clasif || {}) }
    };
    if (JSON.stringify(data).length > EFT_DATA_MAX) {
      return res.status(413).json({ error: 'Tu avance es demasiado largo para guardarse' });
    }
    const r = await pool.query(
      `INSERT INTO eft_lab_entregas (user_id, lab, group_id, data, submitted_at)
       VALUES ($1, $2, $3, $4, CASE WHEN $5 THEN NOW() ELSE NULL END)
       ON CONFLICT (user_id, lab) DO UPDATE SET
         data = EXCLUDED.data,
         group_id = EXCLUDED.group_id,
         submitted_at = CASE WHEN $5 THEN NOW() ELSE eft_lab_entregas.submitted_at END,
         updated_at = NOW()
       RETURNING data, submitted_at, updated_at, (pieza_imagen IS NOT NULL) AS has_image`,
      [req.user.id, lab, req.user.group_id, data, !!req.body.enviar]
    );
    res.json(eftPublic(r.rows[0]));
  } catch (err) {
    console.error('Error guardando avance EFT:', err);
    res.status(500).json({ error: 'No se pudo guardar tu avance' });
  }
});

app.put('/api/eft-lab/:lab/me/imagen', requireUser, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  const { mime, data_base64 } = req.body || {};
  if (!/^image\/(jpeg|png|webp)$/.test(mime || '') || !data_base64) {
    return res.status(400).json({ error: 'Sube una imagen JPG, PNG o WebP' });
  }
  const buffer = Buffer.from(String(data_base64).replace(/^data:[^,]+,/, ''), 'base64');
  if (!buffer.length || buffer.length > EFT_IMG_MAX) {
    return res.status(413).json({ error: 'La imagen es demasiado pesada' });
  }
  try {
    await pool.query(
      `INSERT INTO eft_lab_entregas (user_id, lab, group_id, pieza_imagen, pieza_mime)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, lab) DO UPDATE SET
         pieza_imagen = EXCLUDED.pieza_imagen, pieza_mime = EXCLUDED.pieza_mime, updated_at = NOW()`,
      [req.user.id, lab, req.user.group_id, buffer, mime]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error guardando pieza EFT:', err);
    res.status(500).json({ error: 'No se pudo guardar la imagen' });
  }
});

app.delete('/api/eft-lab/:lab/me/imagen', requireUser, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  try {
    await pool.query(
      'UPDATE eft_lab_entregas SET pieza_imagen = NULL, pieza_mime = NULL, updated_at = NOW() WHERE user_id = $1 AND lab = $2',
      [req.user.id, lab]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error borrando pieza EFT:', err);
    res.status(500).json({ error: 'No se pudo quitar la imagen' });
  }
});

// La imagen se pide desde <img src>, así que el id viaja en ?uid. Solo la ve
// su dueño o un administrador.
app.get('/api/eft-lab/:lab/imagen/:userId', requireUser, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  const owner = Number(req.params.userId);
  if (req.user.role !== 'admin' && req.user.id !== owner) {
    return res.status(403).json({ error: 'No tienes permiso para ver esta imagen' });
  }
  try {
    const r = await pool.query('SELECT pieza_imagen, pieza_mime FROM eft_lab_entregas WHERE user_id = $1 AND lab = $2', [owner, lab]);
    const row = r.rows[0];
    if (!row?.pieza_imagen) return res.status(404).type('text/plain').send('Sin imagen');
    res.set('Cache-Control', 'private, no-store');
    res.type(row.pieza_mime || 'image/jpeg').send(row.pieza_imagen);
  } catch (err) {
    console.error('Error leyendo pieza EFT:', err);
    res.status(500).json({ error: 'No se pudo cargar la imagen' });
  }
});

// Panel del profesor: todos los estudiantes, hayan empezado o no.
app.get('/api/admin/eft-lab/:lab', requireAdmin, async (req, res) => {
  const lab = eftLab(req, res);
  if (!lab) return;
  try {
    const r = await pool.query(
      `SELECT u.id AS user_id, u.full_name, u.email, u.campus, u.career_year, u.group_id,
              g.name AS group_name, e.data, e.submitted_at, e.created_at AS started_at, e.updated_at,
              (e.pieza_imagen IS NOT NULL) AS has_image
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       LEFT JOIN eft_lab_entregas e ON e.user_id = u.id AND e.lab = $1
       WHERE u.role = 'student' OR e.id IS NOT NULL
       ORDER BY g.name NULLS LAST, u.full_name`,
      [lab]
    );
    res.json(r.rows);
  } catch (err) {
    console.error('Error listando entregas EFT:', err);
    res.status(500).json({ error: 'No se pudieron cargar las entregas' });
  }
});

// ==========================================
// EVALUACIÓN DE SELECCIÓN MÚLTIPLE — /eft-lab/evaluacion
// Un intento por estudiante, tiempo controlado por el servidor y respuestas
// correctas que nunca salen del servidor mientras se rinde.
// ==========================================

const EVALS = { [EVAL_EFT.id]: EVAL_EFT };
const EVAL_GRACIA_MS = 15000; // margen por latencia al guardar la última respuesta

const requireAuth = async (req, res, next) => {
  const userId = Number(req.headers['x-user-id']);
  if (!tokenValido(userId, req.headers['x-auth-token'])) {
    return res.status(401).json({ error: 'Tu sesión expiró. Cierra sesión y vuelve a entrar.', code: 'reauth' });
  }
  try {
    const r = await pool.query('SELECT id, role, full_name, email, group_id FROM users WHERE id = $1', [userId]);
    if (!r.rows.length) return res.status(401).json({ error: 'Usuario no encontrado', code: 'reauth' });
    req.user = r.rows[0];
    next();
  } catch (err) {
    console.error('Error verificando sesión:', err);
    res.status(500).json({ error: 'Error al verificar la sesión' });
  }
};

const requireAuthAdmin = (req, res, next) =>
  requireAuth(req, res, () => (req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Solo para el profesor' })));

const evalDe = (req, res) => {
  const ev = EVALS[req.params.evalId];
  if (!ev) res.status(404).json({ error: 'Evaluación inexistente' });
  return ev;
};

const barajarSeguro = (lista) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const evalConfig = async (evalId) => {
  const r = await pool.query('SELECT abierta, retro_publicada FROM eval_config WHERE eval_id = $1', [evalId]);
  return r.rows[0] || { abierta: false, retro_publicada: false };
};

const decimasDe = (ev, pct) => ev.decimas.find((t) => pct >= t.min)?.decimas || 0;

const puntuar = (ev, row) => {
  const porId = new Map(ev.preguntas.map((p) => [p.id, p]));
  const resp = row.respuestas || {};
  const total = row.orden.length;
  const puntaje = row.orden.filter(({ id }) => porId.get(id) && resp[id] === porId.get(id).ok).length;
  return { puntaje, total };
};

const terminado = (row) => !!row.finished_at;
const vencido = (row) => !row.finished_at && Date.now() > new Date(row.deadline).getTime() + EVAL_GRACIA_MS;

const finalizar = async (ev, row) => {
  if (terminado(row)) return row;
  const { puntaje, total } = puntuar(ev, row);
  const r = await pool.query(
    `UPDATE eval_intentos SET finished_at = LEAST(NOW(), deadline + interval '15 seconds'), puntaje = $2, total = $3
     WHERE id = $1 AND finished_at IS NULL RETURNING *`,
    [row.id, puntaje, total]
  );
  return r.rows[0] || (await pool.query('SELECT * FROM eval_intentos WHERE id = $1', [row.id])).rows[0];
};

// Lee el intento y, si se le acabó el tiempo, lo cierra con lo que alcanzó a responder
const intentoDe = async (ev, userId) => {
  const r = await pool.query('SELECT * FROM eval_intentos WHERE user_id = $1 AND eval_id = $2', [userId, ev.id]);
  const row = r.rows[0];
  if (row && vencido(row)) return finalizar(ev, row);
  return row || null;
};

const resumenIntento = (ev, row) => {
  if (!row) return null;
  const base = {
    estado: terminado(row) ? 'terminado' : 'en_curso',
    started_at: row.started_at,
    deadline: row.deadline,
    finished_at: row.finished_at,
    restante_seg: terminado(row) ? 0 : Math.max(0, Math.floor((new Date(row.deadline).getTime() - Date.now()) / 1000)),
    respondidas: Object.keys(row.respuestas || {}).length,
    total: row.orden.length
  };
  if (!terminado(row)) return base;
  const pct = row.total ? Math.round((row.puntaje / row.total) * 1000) / 10 : 0;
  return { ...base, puntaje: row.puntaje, porcentaje: pct, decimas: decimasDe(ev, pct) };
};

const preguntasPara = (ev, row) => {
  const porId = new Map(ev.preguntas.map((p) => [p.id, p]));
  return row.orden
    .filter(({ id }) => porId.has(id))
    .map(({ id, ops }) => {
      const p = porId.get(id);
      return { id, eje: p.eje, q: p.q, ops: ops.map((i) => ({ i, t: p.ops[i] })) };
    });
};

const detalleIntento = (ev, row) => {
  const porId = new Map(ev.preguntas.map((p) => [p.id, p]));
  return preguntasPara(ev, row).map((p) => ({
    ...p,
    tu: row.respuestas?.[p.id] ?? null,
    ok: porId.get(p.id).ok,
    exp: porId.get(p.id).exp
  }));
};

const metaEval = (ev) => ({
  id: ev.id,
  titulo: ev.titulo,
  minutos: ev.minutos,
  total: ev.preguntas.length,
  decimas: ev.decimas,
  ejes: ev.ejes
});

app.get('/api/eval/:evalId', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    const [config, row] = await Promise.all([evalConfig(ev.id), intentoDe(ev, req.user.id)]);
    res.json({ ...metaEval(ev), config, intento: resumenIntento(ev, row) });
  } catch (err) {
    console.error('Error leyendo evaluación:', err);
    res.status(500).json({ error: 'No se pudo cargar la evaluación' });
  }
});

app.post('/api/eval/:evalId/iniciar', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  // El profesor (admin) puede rendir cuantas veces quiera, aunque esté cerrada,
  // y sus intentos no cuentan en los resultados del curso.
  const esProfe = req.user.role === 'admin';
  try {
    let row = await intentoDe(ev, req.user.id);
    if (row && esProfe && req.body?.nuevo === true) {
      await pool.query('DELETE FROM eval_intentos WHERE id = $1', [row.id]);
      row = null;
    }
    if (!row) {
      const config = await evalConfig(ev.id);
      if (!config.abierta && !esProfe) return res.status(403).json({ error: 'La evaluación todavía no está abierta' });
      const orden = barajarSeguro(ev.preguntas).map((p) => ({ id: p.id, ops: barajarSeguro([0, 1, 2, 3]) }));
      await pool.query(
        `INSERT INTO eval_intentos (user_id, eval_id, group_id, orden, deadline)
         VALUES ($1, $2, $3, $4, NOW() + ($5 || ' minutes')::interval)
         ON CONFLICT (user_id, eval_id) DO NOTHING`,
        [req.user.id, ev.id, req.user.group_id, JSON.stringify(orden), String(ev.minutos)]
      );
      row = await intentoDe(ev, req.user.id);
    }
    if (terminado(row)) return res.json({ intento: resumenIntento(ev, row) });
    res.json({ intento: resumenIntento(ev, row), preguntas: preguntasPara(ev, row), respuestas: row.respuestas || {} });
  } catch (err) {
    console.error('Error iniciando evaluación:', err);
    res.status(500).json({ error: 'No se pudo iniciar la evaluación' });
  }
});

app.put('/api/eval/:evalId/respuesta', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  const { qid, op } = req.body || {};
  if (typeof qid !== 'string' || !Number.isInteger(op) || op < 0 || op > 3) {
    return res.status(400).json({ error: 'Respuesta inválida' });
  }
  try {
    const row = await intentoDe(ev, req.user.id);
    if (!row) return res.status(409).json({ error: 'No has iniciado la evaluación' });
    if (terminado(row)) return res.status(409).json({ error: 'La evaluación ya terminó', intento: resumenIntento(ev, row) });
    if (!row.orden.some((o) => o.id === qid)) return res.status(400).json({ error: 'Pregunta inválida' });
    const r = await pool.query(
      `UPDATE eval_intentos SET respuestas = respuestas || jsonb_build_object($2::text, $3::int)
       WHERE id = $1 AND finished_at IS NULL AND NOW() <= deadline + interval '15 seconds'
       RETURNING respuestas`,
      [row.id, qid, op]
    );
    if (!r.rows.length) return res.status(409).json({ error: 'Se acabó el tiempo' });
    res.json({ ok: true, respondidas: Object.keys(r.rows[0].respuestas).length });
  } catch (err) {
    console.error('Error guardando respuesta:', err);
    res.status(500).json({ error: 'No se pudo guardar la respuesta' });
  }
});

// Cuenta las veces que el estudiante sale de la pestaña mientras rinde (dato para el profesor)
app.post('/api/eval/:evalId/salida', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    await pool.query(
      'UPDATE eval_intentos SET salidas = salidas + 1 WHERE user_id = $1 AND eval_id = $2 AND finished_at IS NULL',
      [req.user.id, ev.id]
    );
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

app.post('/api/eval/:evalId/terminar', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    const row = await intentoDe(ev, req.user.id);
    if (!row) return res.status(409).json({ error: 'No has iniciado la evaluación' });
    res.json({ intento: resumenIntento(ev, await finalizar(ev, row)) });
  } catch (err) {
    console.error('Error terminando evaluación:', err);
    res.status(500).json({ error: 'No se pudo cerrar la evaluación' });
  }
});

app.get('/api/eval/:evalId/resultado', requireAuth, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    const [config, row] = await Promise.all([evalConfig(ev.id), intentoDe(ev, req.user.id)]);
    if (!row || !terminado(row)) return res.status(409).json({ error: 'Aún no terminas la evaluación' });
    res.json({
      intento: resumenIntento(ev, row),
      retro_publicada: config.retro_publicada || req.user.role === 'admin',
      detalle: config.retro_publicada || req.user.role === 'admin' ? detalleIntento(ev, row) : null
    });
  } catch (err) {
    console.error('Error leyendo resultado:', err);
    res.status(500).json({ error: 'No se pudo cargar el resultado' });
  }
});

app.get('/api/admin/eval/:evalId', requireAuthAdmin, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    const abiertos = await pool.query('SELECT * FROM eval_intentos WHERE eval_id = $1 AND finished_at IS NULL', [ev.id]);
    for (const row of abiertos.rows) if (vencido(row)) await finalizar(ev, row);

    const r = await pool.query(
      `SELECT u.id AS user_id, u.full_name, u.email, u.campus, g.name AS group_name, i.*
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       LEFT JOIN eval_intentos i ON i.user_id = u.id AND i.eval_id = $1
       WHERE u.role = 'student' OR (i.id IS NOT NULL AND u.role <> 'admin')
       ORDER BY g.name NULLS LAST, u.full_name`,
      [ev.id]
    );
    const filas = r.rows.map((x) => ({
      user_id: x.user_id,
      full_name: x.full_name,
      email: x.email,
      campus: x.campus,
      group_name: x.group_name,
      salidas: x.salidas ?? 0,
      intento: x.id ? resumenIntento(ev, x) : null
    }));
    res.json({ ...metaEval(ev), config: await evalConfig(ev.id), filas });
  } catch (err) {
    console.error('Error listando evaluación:', err);
    res.status(500).json({ error: 'No se pudo cargar la evaluación' });
  }
});

app.put('/api/admin/eval/:evalId/config', requireAuthAdmin, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  const actual = await evalConfig(ev.id);
  const abierta = typeof req.body?.abierta === 'boolean' ? req.body.abierta : actual.abierta;
  const retro = typeof req.body?.retro_publicada === 'boolean' ? req.body.retro_publicada : actual.retro_publicada;
  try {
    const r = await pool.query(
      `INSERT INTO eval_config (eval_id, abierta, retro_publicada) VALUES ($1, $2, $3)
       ON CONFLICT (eval_id) DO UPDATE SET abierta = $2, retro_publicada = $3, updated_at = NOW()
       RETURNING abierta, retro_publicada`,
      [ev.id, abierta, retro]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error('Error guardando configuración de evaluación:', err);
    res.status(500).json({ error: 'No se pudo guardar' });
  }
});

app.get('/api/admin/eval/:evalId/intento/:userId', requireAuthAdmin, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    const row = await intentoDe(ev, Number(req.params.userId));
    if (!row) return res.status(404).json({ error: 'Sin intento' });
    res.json({ intento: resumenIntento(ev, row), salidas: row.salidas, detalle: detalleIntento(ev, row) });
  } catch (err) {
    console.error('Error leyendo intento:', err);
    res.status(500).json({ error: 'No se pudo cargar el intento' });
  }
});

// Permite que un estudiante vuelva a rendir (por ejemplo, si tuvo un problema técnico)
app.delete('/api/admin/eval/:evalId/intento/:userId', requireAuthAdmin, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    await pool.query('DELETE FROM eval_intentos WHERE user_id = $1 AND eval_id = $2', [Number(req.params.userId), ev.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error reiniciando intento:', err);
    res.status(500).json({ error: 'No se pudo reiniciar' });
  }
});

// Banco completo con respuestas y estadística por pregunta (solo profesor)
app.get('/api/admin/eval/:evalId/banco', requireAuthAdmin, async (req, res) => {
  const ev = evalDe(req, res);
  if (!ev) return;
  try {
    // Las estadísticas excluyen los intentos de práctica del profesor
    const r = await pool.query(
      `SELECT i.respuestas FROM eval_intentos i JOIN users u ON u.id = i.user_id
       WHERE i.eval_id = $1 AND i.finished_at IS NOT NULL AND u.role <> 'admin'`,
      [ev.id]
    );
    const preguntas = ev.preguntas.map((p) => {
      const elegidas = [0, 0, 0, 0];
      let respondidas = 0;
      for (const { respuestas } of r.rows) {
        const v = respuestas?.[p.id];
        if (Number.isInteger(v)) {
          elegidas[v]++;
          respondidas++;
        }
      }
      return { ...p, respondidas, elegidas, acierto: respondidas ? Math.round((elegidas[p.ok] / respondidas) * 100) : null };
    });
    res.json({ ...metaEval(ev), intentos: r.rows.length, preguntas });
  } catch (err) {
    console.error('Error leyendo banco:', err);
    res.status(500).json({ error: 'No se pudo cargar el banco' });
  }
});

// ESTO ES EL FALLBACK: Captura todo lo que no sea API (SPA)
const indexHtmlPath = path.resolve(__dirname, '../dist/index.html');
app.use((req, res) => {
  // Un archivo inexistente (logo, imagen, js) debe dar 404: si se responde con
  // index.html, Cloudflare lo cachea como si fuera la imagen durante horas.
  if (path.extname(req.path) && !req.path.endsWith('.html')) {
    return res.status(404).type('text/plain').send('Not found');
  }
  try {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    res.type('html').send(html);
  } catch (err) {
    console.error(`[Fallback] Error reading index.html for ${req.url}:`, err);
    res.status(500).send('Error loading page');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${port}`);
});
