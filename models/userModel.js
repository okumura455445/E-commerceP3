const pool = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, role, provider, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password, role = 'user', provider = 'local', provider_id = null }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, role, provider, provider_id]
    );
    return this.findById(result.insertId);
  }

  static async findOrCreateSocial(profile) {
    // profile: { provider, provider_id, name, email }
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      [profile.provider, profile.provider_id]
    );
    if (rows.length > 0) return rows[0];

    const [existingEmailRows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [profile.email]
    );

    if (existingEmailRows.length > 0) {
      const existingUser = existingEmailRows[0];
      await pool.query(
        'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
        [profile.provider, profile.provider_id, existingUser.id]
      );
      return existingUser;
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)',
      [profile.name, profile.email, '', 'user', profile.provider, profile.provider_id]
    );
    return this.findById(result.insertId);
  }
}

module.exports = UserModel;