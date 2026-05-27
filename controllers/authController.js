const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const result = await authService.register({ name, email, password });
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax'
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
    }
    const result = await authService.login({ email, password, rememberMe });
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60,
      sameSite: 'lax'
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.auth0Login = async (req, res, next) => {
  try {
    const { sub, email, name, nickname, picture, email_verified } = req.body;
    if (!sub || !email) {
      return res.status(400).json({ success: false, message: 'sub y email son obligatorios' });
    }

    const profile = {
      provider: 'auth0',
      provider_id: sub,
      name: name || nickname || email,
      email
    };

    const result = await authService.socialLogin(profile);
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Callbacks sociales
exports.googleCallback = async (req, res) => {
  // req.user viene de Passport
  try {
    const profile = {
      provider: 'google',
      provider_id: req.user.id,
      name: req.user.displayName,
      email: req.user.emails?.[0]?.value || ''
    };
    const result = await authService.socialLogin(profile);
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });
    res.redirect('/products');
  } catch (error) {
    res.redirect('/login?error=auth_failed');
  }
};

exports.facebookCallback = async (req, res) => {
  try {
    const profile = {
      provider: 'facebook',
      provider_id: req.user.id,
      name: req.user.displayName,
      email: req.user.emails?.[0]?.value || ''
    };
    const result = await authService.socialLogin(profile);
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });
    res.redirect('/products');
  } catch (error) {
    res.redirect('/login?error=auth_failed');
  }
};

// Apple no tiene estrategia oficial sencilla sin configuración adicional
exports.logout = async (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
};

exports.appleCallback = async (req, res) => {
  res.status(501).send('Apple login no implementado. Configura Apple OAuth con credenciales de Apple Developer.');
};