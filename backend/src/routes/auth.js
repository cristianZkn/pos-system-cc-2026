const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { login, me, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Reglas de validación para el inicio de sesión
const loginValidations = [
  body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.')
];

// Limitador exclusivo para intentos fallidos de inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 peticiones fallidas por IP en la ventana de tiempo
  skipSuccessfulRequests: true, // ¡Clave! No cuenta si el login es exitoso
  message: { error: 'Demasiados intentos fallidos de inicio de sesión. Por favor, inténtelo de nuevo después de 15 minutos.' }
});

router.post('/login', loginLimiter, loginValidations, validate, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

module.exports = router;
