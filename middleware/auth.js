const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;

  // Debug: log incoming auth header and cookies
  console.log('verifyToken: Authorization header=', authHeader);
  console.log('verifyToken: cookies=', req.cookies);

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verifyToken: token valid, decoded=', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('verifyToken: jwt.verify error=', error.message || error);
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
};