const productService = require('../services/productService');

const getAll = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'El ID debe ser un número válido.' });
    }

    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: `Producto con id ${id} no encontrado.` });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newProduct = await productService.create({
      name: req.body.name.trim(),
      description: req.body.description?.trim() || '',
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      category: req.body.category?.trim() || '',
      image: req.file ? req.file.filename : ''
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'El ID debe ser un número válido.' });
    }

    const updatedProduct = await productService.update(id, {
      name: req.body.name.trim(),
      description: req.body.description?.trim() || '',
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      category: req.body.category?.trim() || '',
      image: req.file ? req.file.filename : undefined
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: `Producto con id ${id} no encontrado.` });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'El ID debe ser un número válido.' });
    }

    const deleted = await productService.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Producto con id ${id} no encontrado.` });
    }

    res.json({ success: true, message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
