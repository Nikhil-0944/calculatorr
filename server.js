require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection pool (reused across requests, more efficient than one-off connections)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

// Test the DB connection on startup
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        conn.release();
    } catch (err) {
        console.error('❌ Could not connect to MySQL:', err.message);
    }
})();

// Save a calculation to history
app.post('/api/history', async (req, res) => {
    const { expression, result } = req.body;

    if (!expression || result === undefined || result === null) {
        return res.status(400).json({ error: 'expression and result are required' });
    }

    try {
        const [dbResult] = await pool.query(
            'INSERT INTO history (expression, result) VALUES (?, ?)',
            [expression, String(result)]
        );
        res.status(201).json({ id: dbResult.insertId, expression, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save history' });
    }
});

// Get all past calculations (most recent first)
app.get('/api/history', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, expression, result, created_at FROM history ORDER BY id DESC LIMIT 50'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Clear all history
app.delete('/api/history', async (req, res) => {
    try {
        await pool.query('DELETE FROM history');
        res.json({ message: 'History cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
