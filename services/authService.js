const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class AuthService {
  async register({ name, email, password }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) throw { status: 400, message: 'El email ya está registrado' };

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await UserModel.create({ name, email, password: hashed });
    return this.generateToken(user, false);
  }

  async login({ email, password, rememberMe = false }) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw { status: 401, message: 'Credenciales inválidas' };

    if (user.provider !== 'local') throw { status: 401, message: 'Esta cuenta usa inicio social' };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 401, message: 'Credenciales inválidas' };

    return this.generateToken(user, rememberMe);
  }

  async socialLogin(profile) {
    const user = await UserModel.findOrCreateSocial(profile);
    return this.generateToken(user, false);  // recordarme no aplica para social
  }

  generateToken(user, rememberMe) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const expiresIn = rememberMe
      ? process.env.JWT_REMEMBER_EXPIRES_IN || '7d'
      : process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  async getProfile(userId) {
    return await UserModel.findById(userId);
  }
}

module.exports = new AuthService();