var express = require('express');
var router = express.Router();
const productService = require('../services/productService');

router.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.render('index', { products });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
