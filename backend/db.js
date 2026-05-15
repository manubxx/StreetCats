const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.puelayozbqpbyeerypel:webtech2025@aws-0-eu-west-1.pooler.supabase.com:5432/postgres", 
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("ERRORE SUPABASE:", err.message);
  } else {
    console.log("CONNESSIONE AL DB RIUSCITA");
  }
});

module.exports = pool;