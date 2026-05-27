const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

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
router.post('/', verifyToken, authorize('admin'), validateProduct, controller.create);
router.put('/:id', verifyToken, authorize('admin'), validateProduct, controller.update);
router.delete('/:id', verifyToken, authorize('admin'), controller.remove);

module.exports = router;
