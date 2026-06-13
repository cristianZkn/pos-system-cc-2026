const router = require('express').Router();
const { body } = require('express-validator');
const { login, me, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Reglas de validación para el inicio de sesión
const loginValidations = [
  body('email').isEmail().withMessage('Debe proporcionar un email válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.')
];

router.post('/login', loginValidations, validate, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

module.exports = router;
