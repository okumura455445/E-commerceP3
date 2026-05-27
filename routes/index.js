var express = require('express');
var router = express.Router();
const productService = require('../services/productService');
const { verifyToken } = require('../middleware/auth');

// Redirigir la raíz a login
router.get('/', (req, res) => {
  // Si Auth0 devuelve un callback a la raíz, mantenemos la vista de login para procesar code/state.
  if (req.query.code && req.query.state) {
    return res.render('login');
  }
  res.redirect('/login');
});

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Página de productos protegida
router.get('/products', verifyToken, async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.render('index', { products });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
