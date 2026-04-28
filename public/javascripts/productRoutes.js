// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('./productController');
const validate = require('./validateProduct');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate, controller.create);
router.put('/:id', validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;