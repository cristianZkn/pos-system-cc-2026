require('dotenv').config();
const express = require('express');
const cors = require('cors');
//importar helmet para mejorar la seguridad de la aplicacion
const helmet = require('helmet');
//importar rate-limit para limitar el numero de peticiones que llegan a la API
const rateLimit = require('express-rate-limit');
//importar cookie-parser para manejar las cookies
const cookieParser = require('cookie-parser');
const path = require('path');
//importar la conexion a la base de datos
const pool = require('./config/database');
const promBundle = require('express-prom-bundle');
const logger = require('./utils/logger');
const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const clientRoutes   = require('./routes/clients');
const saleRoutes     = require('./routes/sales');
const reportRoutes   = require('./routes/reports');
const userRoutes     = require('./routes/users');
const evalRoutes     = require('./routes/eval');

const app = express();

// ─── MÉTRICAS (Prometheus) ───────────────────────────────────────────────────
const metricsMiddleware = promBundle({
  includeMethod: true, 
  includePath: true, 
  includeStatusCode: true, 
  includeUp: true,
  customLabels: { project_name: 'pos_system' },
  promClient: {
    collectDefaultMetrics: {
    }
  }
});
app.use(metricsMiddleware);

// ─── SEGURIDAD (Helmet) ──────────────────────────────────────────────────────
// Helmet protege la aplicación configurando múltiples cabeceras HTTP de seguridad.
// Previene ataques comunes como Cross-Site Scripting (XSS), Clickjacking y 
// oculta la cabecera 'X-Powered-By' para no revelar que usamos Express.
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
// Configuración estricta de CORS:
// Se restringe el acceso únicamente al dominio del frontend configurado en las
// variables de entorno. Esto previene que otros sitios web hagan peticiones a la API.
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ─── PARSERS ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── ARCHIVOS ESTÁTICOS (imágenes) ───────────────────────────────────────────
// TODO: Eliminar cuando se migre a almacenamiento en la nube (S3, GCS, etc.)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
// Endpoint de health check para monitoreo y load balancers
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' });
  }
});

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
// Limitador de peticiones para prevenir ataques de fuerza bruta en los inicios de sesión.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 peticiones por IP en la ventana de tiempo
  message: { error: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo después de 15 minutos.' }
});

// ─── RUTAS ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes); // Ruta de autenticación (requiere LOGIN_RATE_LIMIT)
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients',    clientRoutes);
app.use('/api/sales',      saleRoutes);
app.use('/api/reports',    reportRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/eval',       evalRoutes);  // Ruta de evaluación docente (requiere EVAL_SECRET)

// ─── MANEJO DE ERRORES GLOBAL ────────────────────────────────────────────────
// TODO: Reemplazar console.error con logging estructurado (Winston, Pino, etc.)
//       e integrar con servicio de monitoreo (CloudWatch, Datadog, Sentry, etc.)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  logger.error(`[ERROR] ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
