const ProductModel = require('../models/productModel');

class ProductService {
  async getAll() {
    return await ProductModel.getAll();
  }

  async getById(id) {
    return await ProductModel.getById(id);
  }

  async create(data) {
    const id = await ProductModel.create(data);
    return await ProductModel.getById(id);
  }

  async update(id, data) {
    const existing = await ProductModel.getById(id);
    if (!existing) {
      return null;
    }

    const updatedPayload = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      image: data.image !== undefined ? data.image : existing.image
    };

    const success = await ProductModel.update(id, updatedPayload);
    if (!success) {
      return null;
    }

    return await ProductModel.getById(id);
  }

  async delete(id) {
    return await ProductModel.delete(id);
  }
}

module.exports = new ProductService();
