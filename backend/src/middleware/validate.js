const { validationResult } = require('express-validator');

/**
 * Middleware para procesar las validaciones de express-validator.
 * 
 * ─── IMPLEMENTACIÓN CLOUD: Ahorro y Seguridad ──────────────────────────────
 * En la nube, cada petición a la base de datos (ej. Amazon RDS) cuesta dinero
 * y recursos. Además, la capa de aplicación debe estar protegida contra inyecciones.
 * Este middleware detiene peticiones malformadas o maliciosas devolviendo un
 * HTTP 400 antes de que lleguen a los controladores.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Retorna HTTP 400 Bad Request y detiene el flujo
    return res.status(400).json({ 
      error: 'Error de validación en los datos enviados.',
      detalles: errors.array() 
    });
  }
  next();
};

module.exports = validate;
