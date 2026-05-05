const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('image'), validateProduct, controller.create);
router.put('/:id', upload.single('image'), validateProduct, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
