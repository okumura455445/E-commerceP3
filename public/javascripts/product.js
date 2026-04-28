// models/Product.js
class Product {
  constructor(id, name, description, price, stock, category = '') {
    this.id = id;
    this.name = name;
    this.description = description || '';
    this.price = price;
    this.stock = stock;
    this.category = category || '';
  }

  // Retorna una copia segura del producto (sin exponer datos internos si los hubiera)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      category: this.category,
    };
  }
}

module.exports = Product;