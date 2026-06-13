require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

const run = async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES ('Administrador', 'admin@pos.cl', $1, 1) ON CONFLICT (email) DO NOTHING`,
      [hash]
    );
    console.log('✅ Administrador creado exitosamente !');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    process.exit(0);
  }
};
run();
