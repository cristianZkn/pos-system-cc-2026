const { Pool } = require('pg');

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ ERROR CRÍTICO: Faltan variables de entorno para la base de datos: ${missing.join(', ')}`);
  console.error('⚠️ Por seguridad (implementación Cloud), no se utilizarán credenciales por defecto. El servidor se detendrá.');
  process.exit(1);
}

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Soporte SSL dinámico para bases de datos Cloud (RDS, Cloud SQL)
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err.message);
});

// Función de reconexión automática (Resiliencia Cloud)
pool.connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Conexión a la base de datos establecida con éxito.');
      client.release();
      return true;
    } catch (err) {
      console.error(`⚠️ Intento de conexión BD ${i}/${retries} fallido: ${err.message}`);
      if (i === retries) {
        console.error('❌ No se pudo conectar a la base de datos tras múltiples intentos. Deteniendo servidor.');
        process.exit(1);
      }
      console.log(`⏳ Reintentando en ${delay / 1000} segundos...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = pool;
