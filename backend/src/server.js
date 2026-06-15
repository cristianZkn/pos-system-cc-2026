const app = require('./app');
const pool = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Esperar a que la base de datos responda (resiliencia)
  await pool.connectWithRetry();

  app.listen(PORT, () => {
    logger.info(`Servidor POS corriendo en puerto ${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
