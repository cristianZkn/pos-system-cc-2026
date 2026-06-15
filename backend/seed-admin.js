require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

const run = async () => {
  try {
    const hashAdmin = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES ('Administrador', 'admin@pos.cl', $1, 1) ON CONFLICT (email) DO NOTHING`,
      [hashAdmin]
    );
    console.log('✅ Administrador creado exitosamente !');

    const hashCajero = await bcrypt.hash('cajero123', 10);
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES ('Cajero', 'cajero@pos.cl', $1, 2) ON CONFLICT (email) DO NOTHING`,
      [hashCajero]
    );
    console.log('✅ Cajero creado exitosamente !');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    process.exit(0);
  }
};
run();
