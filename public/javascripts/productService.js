// services/productService.js
const Product = require('./product');

class ProductService {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  getAll() {
    return this.products.map(p => p.toJSON());
  }

  getById(id) {
    const product = this.products.find(p => p.id === id);
    return product ? product.toJSON() : null;
  }

  create({ name, description, price, stock, category }) {
    const newProduct = new Product(this.nextId++, name, description, price, stock, category);
    this.products.push(newProduct);
    return newProduct.toJSON();
  }

  update(id, { name, description, price, stock, category }) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Actualiza los campos
    const product = this.products[index];
    product.name = name;
    product.description = description || '';
    product.price = price;
    product.stock = stock;
    product.category = category || '';

    return product.toJSON();
  }

  delete(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}

// Singleton para toda la aplicación
const productService = new ProductService();
module.exports = productService;