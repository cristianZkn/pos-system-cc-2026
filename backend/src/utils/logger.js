const winston = require('winston');

// Configuración para Logging Estructurado (Ideal para Azure Log Analytics)
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json() // Esto hace que el output sea JSON en lugar de texto plano
  ),
  defaultMeta: { service: 'pos-backend-api' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV !== 'production'
        ? winston.format.combine(winston.format.colorize(), winston.format.simple())
        : winston.format.json()
    })
  ]
});

module.exports = logger;
