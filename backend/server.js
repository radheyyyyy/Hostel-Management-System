// server.js (Hostel Management - simplified spec)
// Run: npm i express cors body-parser mysql2

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== DB CONFIG =====
const dbConfig = {
  host: 'localhost',
  user: 'root',                // <- change if needed
  password: '',   // <- your password
  database: '', // <- NEW DB NAME
  port: 3306
};
async function getConn() { return mysql.createConnection(dbConfig); }

// ===== Helper: get hostel_id for a student_id =====
async function getHostelIdByStudent(conn, student_id) {
  const [rows] = await conn.execute('SELECT hostel_id FROM students WHERE student_id=?', [student_id]);
  return rows.length ? rows[0].hostel_id : null;
}

// ================== AUTH ==================

// Admin login (demo: plain text)
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(
      'SELECT id FROM admins WHERE username=? AND password=?',
      [username, password]
    );
    if (rows.length) return res.json({ success: true, token: 'ADMIN-DEMO' });
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  } finally { await conn.end(); }
});

// Student login (by Student ID)
app.post('/api/student/login', async (req, res) => {
  const { student_id } = req.body || {};
  if (!student_id) return res.status(400).json({ error: 'student_id required' });
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT s.student_id, s.name, s.phone, s.room_number,
             h.id AS hostel_id, h.name AS hostel_name
      FROM students s
      JOIN hostels h ON h.id = s.hostel_id
      WHERE s.student_id = ?
    `, [student_id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found' });
    return res.json({ success: true, student: rows[0] });
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  } finally { await conn.end(); }
});

// ================== HOSTELS ==================

// List hostels
app.get('/api/hostels', async (_req, res) => {
  const conn = await getConn();
  try {
    const [rows] = await conn.execute('SELECT id, name, address FROM hostels ORDER BY name');
    res.json({ hostels: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Add hostel
app.post('/api/hostels', async (req, res) => {
  const { name, address } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const conn = await getConn();
  try {
    await conn.execute('INSERT INTO hostels(name, address) VALUES (?, ?)', [name, address || null]);
    res.json({ success: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Hostel already exists' });
    console.error(e); res.status(500).json({ error: e.message });
  } finally { await conn.end(); }
});

// ================== STUDENTS (direct entry) ==================

// List students
app.get('/api/students', async (_req, res) => {
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT s.student_id, s.name, s.phone, s.room_number,
             h.id AS hostel_id, h.name AS hostel_name
      FROM students s
      JOIN hostels h ON h.id = s.hostel_id
      ORDER BY h.name, s.room_number, s.name
    `);
    res.json({ students: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Add student
app.post('/api/students', async (req, res) => {
  const { student_id, name, phone, hostel_id, room_number } = req.body || {};
  if (!student_id || !name || !hostel_id) {
    return res.status(400).json({ error: 'student_id, name, hostel_id required' });
  }
  const conn = await getConn();
  try {
    await conn.execute(
      'INSERT INTO students (student_id, name, phone, hostel_id, room_number) VALUES (?, ?, ?, ?, ?)',
      [student_id, name, phone || '', hostel_id, room_number || '']
    );
    res.json({ success: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'student_id already exists' });
    console.error(e); res.status(500).json({ error: e.message });
  } finally { await conn.end(); }
});

// Update student (optional for admin)
app.put('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  const { name, phone, hostel_id, room_number } = req.body || {};
  const conn = await getConn();
  try {
    const [r] = await conn.execute(
      'UPDATE students SET name=?, phone=?, hostel_id=?, room_number=? WHERE student_id=?',
      [name || '', phone || '', hostel_id, room_number || '', id]
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Delete student (optional)
app.delete('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  const conn = await getConn();
  try {
    const [r] = await conn.execute('DELETE FROM students WHERE student_id=?', [id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// ================== NOTICES ==================
// Post notice (audience: 'all' or 'hostel')
app.post('/api/notices', async (req, res) => {
  const { title, body, audience, hostel_id } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'title & body required' });
  const aud = audience === 'hostel' ? 'hostel' : 'all';
  const conn = await getConn();
  try {
    await conn.execute(
      'INSERT INTO notices (title, body, audience, hostel_id) VALUES (?, ?, ?, ?)',
      [title, body, aud, aud === 'hostel' ? hostel_id || null : null]
    );
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// List notices (optionally filter by hostel)
app.get('/api/notices', async (req, res) => {
  const { hostel_id } = req.query || {};
  const conn = await getConn();
  try {
    let rows;
    if (hostel_id) {
      [rows] = await conn.execute(`
        SELECT n.id, n.title, n.body, n.audience, n.hostel_id, h.name AS hostel_name, n.created_at
        FROM notices n
        LEFT JOIN hostels h ON h.id = n.hostel_id
        WHERE n.audience='all' OR (n.audience='hostel' AND n.hostel_id=?)
        ORDER BY n.created_at DESC
      `, [hostel_id]);
    } else {
      [rows] = await conn.execute(`
        SELECT n.id, n.title, n.body, n.audience, n.hostel_id, h.name AS hostel_name, n.created_at
        FROM notices n
        LEFT JOIN hostels h ON h.id = n.hostel_id
        ORDER BY n.created_at DESC
      `);
    }
    res.json({ notices: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// ================== MAINTENANCE ==================
// Create maintenance ticket (hostel derived from student_id)
app.post('/api/maintenance', async (req, res) => {
  const { student_id, category, description } = req.body || {};
  if (!student_id || !category || !description)
    return res.status(400).json({ error: 'student_id, category, description required' });
  const conn = await getConn();
  try {
    const hostel_id = await getHostelIdByStudent(conn, student_id);
    if (!hostel_id) return res.status(404).json({ error: 'Student not found' });
    await conn.execute(
      'INSERT INTO maintenance_requests (student_id, hostel_id, category, description) VALUES (?, ?, ?, ?)',
      [student_id, hostel_id, category, description]
    );
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Admin: list all maintenance tickets
app.get('/api/maintenance', async (_req, res) => {
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT m.id, m.student_id, s.name AS student_name, h.name AS hostel_name,
             m.category, m.description, m.status, m.created_at
      FROM maintenance_requests m
      JOIN students s ON s.student_id = m.student_id
      JOIN hostels h ON h.id = m.hostel_id
      ORDER BY m.created_at DESC
    `);
    res.json({ tickets: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Student: my maintenance tickets
app.get('/api/maintenance/mine/:student_id', async (req, res) => {
  const { student_id } = req.params;
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT m.id, m.category, m.description, m.status, m.created_at
      FROM maintenance_requests m
      WHERE m.student_id = ?
      ORDER BY m.created_at DESC
    `, [student_id]);
    res.json({ tickets: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Admin: update ticket status
app.put('/api/maintenance/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!['open','in_progress','closed'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const conn = await getConn();
  try {
    const [r] = await conn.execute('UPDATE maintenance_requests SET status=? WHERE id=?', [status, id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'ticket not found' });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// ================== LEAVES ==================
// Create leave (hostel derived from student_id)
app.post('/api/leaves', async (req, res) => {
  const { student_id, from_date, to_date, reason } = req.body || {};
  if (!student_id || !from_date || !to_date || !reason)
    return res.status(400).json({ error: 'student_id, from_date, to_date, reason required' });
  const conn = await getConn();
  try {
    const hostel_id = await getHostelIdByStudent(conn, student_id);
    if (!hostel_id) return res.status(404).json({ error: 'Student not found' });
    await conn.execute(
      'INSERT INTO leave_applications (student_id, hostel_id, from_date, to_date, reason) VALUES (?, ?, ?, ?, ?)',
      [student_id, hostel_id, from_date, to_date, reason]
    );
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Admin: list all leaves
app.get('/api/leaves', async (_req, res) => {
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT l.id, l.student_id, s.name AS student_name, h.name AS hostel_name,
             l.from_date, l.to_date, l.reason, l.status, l.applied_at
      FROM leave_applications l
      JOIN students s ON s.student_id = l.student_id
      JOIN hostels h ON h.id = l.hostel_id
      ORDER BY l.applied_at DESC
    `);
    res.json({ leaves: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Student: my leaves
app.get('/api/leaves/mine/:student_id', async (req, res) => {
  const { student_id } = req.params;
  const conn = await getConn();
  try {
    const [rows] = await conn.execute(`
      SELECT id, from_date, to_date, reason, status, applied_at
      FROM leave_applications
      WHERE student_id = ?
      ORDER BY applied_at DESC
    `, [student_id]);
    res.json({ leaves: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// Admin: update leave status
app.put('/api/leaves/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!['pending','approved','rejected'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const conn = await getConn();
  try {
    const [r] = await conn.execute('UPDATE leave_applications SET status=? WHERE id=?', [status, id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'leave not found' });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
  finally { await conn.end(); }
});

// ================ START SERVER ================
app.get('/', (req, res) => {
  res.send('Hostel Management API is running');
});
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
