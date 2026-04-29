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
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, '../dist')));

// Configuración de PostgreSQL
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable',
  ssl: false // Ajustar según necesidad del servidor
});

// --- API ENDPOINTS ---

// 1. Login
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

// 2. Obtener Grupos
app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

// 3. Seleccionar/Cambiar Grupo
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

// 4. Guardar Campaña (Meta Ads)
app.post('/api/campaigns', async (req, res) => {
  const { name, userId, groupId, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO campaigns (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, userId, groupId, data]
    );
    res.json({ success: true, campaign: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar campaña' });
  }
});

// 5. Guardar Chatflow
app.post('/api/chatflows', async (req, res) => {
  const { name, userId, groupId, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chatflows (name, user_id, group_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, userId, groupId, data]
    );
    res.json({ success: true, chatflow: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar chatflow' });
  }
});

// 6. Obtener todo (Vista Admin)
app.get('/api/admin/all', async (req, res) => {
  try {
    const campaigns = await pool.query(`
      SELECT c.*, u.full_name as student_name, g.name as group_name 
      FROM campaigns c 
      JOIN users u ON c.user_id = u.id 
      JOIN groups g ON c.group_id = g.id
    `);
    const chatflows = await pool.query(`
      SELECT ch.*, u.full_name as student_name, g.name as group_name 
      FROM chatflows ch 
      JOIN users u ON ch.user_id = u.id 
      JOIN groups g ON ch.group_id = g.id
    `);
    res.json({ campaigns: campaigns.rows, chatflows: chatflows.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos de admin' });
  }
});

// 7. Obtener datos por Grupo (Vista Estudiante)
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

// Manejar cualquier otra ruta enviando el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
