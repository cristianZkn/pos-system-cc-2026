const router = require('express').Router();
const ctrl = require('../controllers/saleController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const saleValidations = [
  body('cliente_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('cliente_id debe ser un entero válido si se proporciona'),
  body('metodo_pago').optional().isIn(['efectivo', 'debito', 'credito', 'transferencia']).withMessage('metodo_pago inválido'),
  body('items').isArray({ min: 1 }).withMessage('items debe ser un arreglo con al menos un producto'),
  body('items.*.producto_id').isInt({ min: 1 }).withMessage('Cada item debe tener un producto_id entero'),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('Cada item debe tener una cantidad entera mayor a 0'),
  body('items.*.precio_unitario').isInt({ min: 0 }).withMessage('Cada item debe tener un precio_unitario mayor o igual a 0')
];

router.get('/',           authMiddleware, ctrl.getAll);
router.get('/:id',        authMiddleware, ctrl.getById);
router.post('/',          authMiddleware, saleValidations, validate, ctrl.create);
router.put('/:id/cancel', authMiddleware, requireRole(['admin']), ctrl.cancel);

module.exports = router;
