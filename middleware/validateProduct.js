function validateProduct(req, res, next) {
  const { name, price, stock, description, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('El campo "name" es obligatorio y debe ser un string no vacío.');
  }

  const parsedPrice = parseFloat(price);
  if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.push('El campo "price" es obligatorio y debe ser un número mayor a 0.');
  }

  const parsedStock = parseInt(stock, 10);
  if (Number.isNaN(parsedStock) || parsedStock < 0) {
    errors.push('El campo "stock" es obligatorio y debe ser un entero >= 0.');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('El campo "description" debe ser un string.');
  }

  if (category !== undefined && typeof category !== 'string') {
    errors.push('El campo "category" debe ser un string.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Error de validación', errors });
  }

  next();
}

module.exports = validateProduct;
