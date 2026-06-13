const router = require('express').Router();
const ctrl = require('../controllers/clientController');
const { authMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const clientValidations = [
  body('rut').notEmpty().withMessage('El RUT es obligatorio').isString().withMessage('El RUT debe ser texto'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Formato de email inválido')
];

router.get('/',       authMiddleware, ctrl.getAll);
router.get('/:id',    authMiddleware, ctrl.getById);
router.post('/',      authMiddleware, clientValidations, validate, ctrl.create);
router.put('/:id',    authMiddleware, clientValidations, validate, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

module.exports = router;
