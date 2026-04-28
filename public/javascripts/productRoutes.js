// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('./productController');
const validate = require('./validateProduct');

// Configurar multer (igual que en app.js)
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('image'), validate, controller.create);
router.put('/:id', upload.single('image'), validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;