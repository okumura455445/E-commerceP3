// models/productModel.js
const pool = require('../config/db');

class ProductModel {
  // Obtener todos los productos
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
    return rows;
  }

  // Obtener uno por ID
  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // Crear nuevo producto
  static async create({ name, description, price, stock, category, image }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, image]
    );
    return result.insertId;
  }

  // Actualizar producto existente
  static async update(id, { name, description, price, stock, category, image }) {
    const [result] = await pool.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=? WHERE id=?',
      [name, description, price, stock, category, image, id]
    );
    return result.affectedRows > 0;
  }

  // Eliminar producto
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id=?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductModel;