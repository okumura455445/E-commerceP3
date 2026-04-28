// middleware/validateProduct.js
/**
 * Valida los datos para creación (POST) y actualización (PUT).
 * POST -> todos los campos obligatorios.
 * PUT  -> todos los campos obligatorios (reemplazo completo).
 */
function validateProduct(req, res, next) {
  const { name, price, stock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('El campo "name" es obligatorio y debe ser un string no vacío.');
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.push('El campo "price" es obligatorio y debe ser un número mayor a 0.');
  }

  const parsedStock = parseInt(stock, 10);
  if (isNaN(parsedStock) || parsedStock < 0) {
    errors.push('El campo "stock" es obligatorio y debe ser un entero >= 0.');
  }

  // Campos opcionales: description y category pueden ser strings o vacíos
  if (req.body.description !== undefined && typeof req.body.description !== 'string') {
    errors.push('El campo "description" debe ser un string.');
  }
  if (req.body.category !== undefined && typeof req.body.category !== 'string') {
    errors.push('El campo "category" debe ser un string.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  next();
}

module.exports = validateProduct;