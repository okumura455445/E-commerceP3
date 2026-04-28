// controllers/productController.js
const productService = require('./productService');

// GET /api/products
const getAll = (req, res) => {
  const products = productService.getAll();
  res.json({
    success: true,
    data: products,
  });
};

// GET /api/products/:id
const getById = (req, res) => {
  const id = parseInt(req.params.id); // asumimos IDs numéricos
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido.',
    });
  }

  const product = productService.getById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Producto con id ${id} no encontrado.`,
    });
  }

  res.json({
    success: true,
    data: product,
  });
};

// POST /api/products
const create = (req, res) => {
  try {
    const newProduct = productService.create({
      name: req.body.name.trim(),
      description: req.body.description?.trim() || '',
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category?.trim() || '',
      image: req.file ? req.file.filename : '',
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto.',
      error: error.message,
    });
  }
};

// PUT /api/products/:id
const update = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido.',
    });
  }

  const updated = productService.update(id, {
    name: req.body.name.trim(),
    description: req.body.description?.trim() || '',
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category?.trim() || '',
    image: req.file ? req.file.filename : req.body.image || '',
  });

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Producto con id ${id} no encontrado.`,
    });
  }

  res.json({
    success: true,
    message: 'Producto actualizado exitosamente.',
    data: updated,
  });
};

// DELETE /api/products/:id
const remove = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido.',
    });
  }

  const deleted = productService.delete(id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Producto con id ${id} no encontrado.`,
    });
  }

  res.json({
    success: true,
    message: 'Producto eliminado exitosamente.',
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};