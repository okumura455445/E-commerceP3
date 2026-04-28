var express = require('express');
var router = express.Router();
const productService = require('../public/javascripts/productService');

router.get('/', (req, res) => {
  res.render('index', { products: productService.getAll() });
});


module.exports = router;
