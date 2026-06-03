const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');

// Reglas de validación para la creación y edición de productos
const productValidations = [
  body('nombre').notEmpty().withMessage('El nombre del producto es requerido.'),
  body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor a 0.'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero válido (mínimo 0).'),
  body('categoria_id').isInt({ min: 1 }).withMessage('ID de categoría inválido.')
];

router.get('/',    authMiddleware, ctrl.getAll);
router.get('/:id', authMiddleware, ctrl.getById);
router.post('/',   authMiddleware, requireRole(['admin']), upload.single('imagen'), productValidations, validate, ctrl.create);
router.put('/:id', authMiddleware, requireRole(['admin']), upload.single('imagen'), productValidations, validate, ctrl.update);
router.delete('/:id', authMiddleware, requireRole(['admin']), ctrl.remove);

module.exports = router;
