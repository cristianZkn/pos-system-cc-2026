const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Esperar a que la base de datos responda (resiliencia)
  await pool.connectWithRetry();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor POS corriendo en http://localhost:${PORT}`);
    console.log(`☁️  Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
