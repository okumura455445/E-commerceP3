// services/productService.js
const Product = require('./product');

class ProductService {
  constructor() {
    this.products = [
      new Product(1, 'Monitor Gaming 27"', 'Monitor 4K UHD de 27 pulgadas con 144Hz', 299.99, 10, 'Monitores', 'monitor.jpg'),
      new Product(2, 'Teclado Mecánico RGB', 'Teclado mecánico con switches rojos y iluminación RGB', 89.99, 15, 'Periféricos', 'keyboard.jpg'),
      new Product(3, 'Mouse Gamer Óptico', 'Mouse óptico de alta precisión con 16000 DPI', 49.99, 20, 'Periféricos', 'mouse.jpg'),
      new Product(4, 'Auriculares Inalámbricos', 'Auriculares con cancelación de ruido y batería de 30h', 129.99, 8, 'Audio', 'earphon.jpg')
    ];
    this.nextId = 5;
  }

  getAll() {
    return this.products.map(p => p.toJSON());
  }

  getById(id) {
    const product = this.products.find(p => p.id === id);
    return product ? product.toJSON() : null;
  }

  create({ name, description, price, stock, category, image }) {
    const newProduct = new Product(this.nextId++, name, description, price, stock, category, image);
    this.products.push(newProduct);
    return newProduct.toJSON();
  }

  update(id, { name, description, price, stock, category, image }) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Actualiza los campos
    const product = this.products[index];
    product.name = name;
    product.description = description || '';
    product.price = price;
    product.stock = stock;
    product.category = category || '';
    product.image = image || '';

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

// services/productService.js
const ProductModel = require('../models/productModel');

class ProductService {
  async getAll() { return await ProductModel.getAll(); }
  async getById(id) { return await ProductModel.getById(id); }
  async create(data) {
    const id = await ProductModel.create(data);
    return await ProductModel.getById(id);  // retorna el producto completo
  }
  async update(id, data) {
    const success = await ProductModel.update(id, data);
    if (!success) return null;
    return await ProductModel.getById(id);
  }
  async delete(id) { return await ProductModel.delete(id); }
}

const productService = new ProductService();
module.exports = productService;