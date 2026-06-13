const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const userValidationsCreate = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Formato de email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol_id').isInt({ min: 1 }).withMessage('rol_id debe ser un entero')
];

const userValidationsUpdate = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Formato de email inválido'),
  body('rol_id').isInt({ min: 1 }).withMessage('rol_id debe ser un entero')
];

router.get('/',       authMiddleware, requireRole(['admin']), ctrl.getAll);
router.post('/',      authMiddleware, requireRole(['admin']), userValidationsCreate, validate, ctrl.create);
router.put('/:id',    authMiddleware, requireRole(['admin']), userValidationsUpdate, validate, ctrl.update);
router.delete('/:id', authMiddleware, requireRole(['admin']), ctrl.remove);

module.exports = router;
