
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); 


const app = express();
app.use(cors());
app.use(express.json());


const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware per verificare il token
const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }

  // Sovrascriviamo lo user_id proveniente dal body con quello del token
  req.user = user; 
  next();
};

// GET: Recupera i gatti (usata per la mappa)
app.get('/api/cats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST: Aggiunge un gatto con Validazione
app.post('/api/cats', authenticateJWT, async (req, res) => {
  const { title, description, lat, lng, image_url } = req.body;
  const user_id = req.user.id;

  if (!title || title.trim().length < 2) {
    return res.status(400).json({ error: 'Il titolo è obbligatorio e deve essere valido' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (isNaN(latitude) || latitude < -90 || latitude > 90 || 
      isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Coordinate geografiche non valide' });
  }

  try {
    const newCat = await pool.query(
      'INSERT INTO cats (title, description, lat, lng, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, latitude, longitude, image_url, user_id]
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

// GET: Recupera i commenti per un gatto specifico
app.get('/api/cats/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE cat_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero commenti' });
  }
});

// POST: Aggiunge un commento 
app.post('/api/comments', authenticateJWT, async (req, res) => {
  const { cat_id, content } = req.body;
  const user_id = req.user.id;      // Presi dal Token verificato
  const user_email = req.user.email; //

  try {
    const newComment = await pool.query(
      'INSERT INTO comments (cat_id, user_id, user_email, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [cat_id, user_id, user_email, content]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});