import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, '../dist')));

// Configuración de PostgreSQL
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable',
  ssl: false
});

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
    `);
    console.log('🚀 Tablas de base de datos verificadas/creadas');
  } catch (dbErr) {
    console.error('❌ Error inicializando tablas:', dbErr);
  } finally {
    release();
  }
});

// --- API ENDPOINTS ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, group_id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

app.post('/api/select-group', async (req, res) => {
  const { userId, groupId } = req.body;
  try {
    await pool.query('UPDATE users SET group_id = $1 WHERE id = $2', [groupId, userId]);
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    res.json({ success: true, user: userResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar grupo' });
  }
});

app.post('/api/campaigns', async (req, res) => {
  const { id, name, userId, groupId, data } = req.body;
  try {
    let result;
    if (id) {
      result = await pool.query(
        'UPDATE campaigns SET name = $1, data = $2 WHERE id = $3 RETURNING *',
        [name, data, id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO campaigns (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, userId, groupId, data]
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
    if (id) {
      result = await pool.query(
        'UPDATE chatflows SET name = $1, data = $2 WHERE id = $3 RETURNING *',
        [name, data, id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO chatflows (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, userId, groupId, data]
      );
    }
    res.json({ success: true, chatflow: result.rows[0] });
  } catch (err) {
    console.error('DATABASE ERROR (Chatflow Save):', err);
    res.status(500).json({ error: 'Error al guardar chatflow: ' + err.message });
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
    res.json({ campaigns: campaigns.rows, chatflows: chatflows.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos de admin' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.group_id, g.name as group_name 
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
  const { full_name, email, role, group_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET full_name = $1, email = $2, role = $3, group_id = $4 WHERE id = $5 RETURNING *',
      [full_name, email, role, group_id, id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { full_name, email, password, role, group_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, role, group_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, email, password || 'duoc2024', role || 'student', group_id || null]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
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
    res.json({ campaigns: campaigns.rows, chatflows: chatflows.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos del grupo' });
  }
});

// ESTO ES EL FALLBACK: Captura todo lo que no sea API
// Usamos un middleware genérico para evitar errores de sintaxis en rutas de Express 5
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${port}`);
});
