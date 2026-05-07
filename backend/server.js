const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Assicurati che db.js sia configurato con la stringa di Supabase
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET: Recupera i gatti (usata per la mappa/lista)
app.get('/api/cats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST: Aggiunge un gatto (Questa è l'API richiesta dal professore)
app.post('/api/cats', async (req, res) => {
  const { title, description, lat, lng, image_url, user_id } = req.body;
  try {
    const newCat = await pool.query(
      'INSERT INTO cats (title, description, lat, lng, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, lat, lng, image_url, user_id]
    );
    res.status(201).json(newCat.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il salvataggio' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server API attivo sulla porta ${PORT}`);
});