const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const categoryValidations = [
  body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio')
];

router.get('/',       authMiddleware, ctrl.getAll);
router.post('/',      authMiddleware, requireRole(['admin']), categoryValidations, validate, ctrl.create);
router.put('/:id',    authMiddleware, requireRole(['admin']), categoryValidations, validate, ctrl.update);
router.delete('/:id', authMiddleware, requireRole(['admin']), ctrl.remove);

module.exports = router;
