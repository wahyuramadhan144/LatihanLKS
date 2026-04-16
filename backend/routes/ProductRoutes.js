const express = require('express');
const { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } = require('../controllers/Products.js');
const { verifyToken, allowRole } = require('../middleware/AuthUser.js');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductsById);
router.post('/products', verifyToken, createProducts);
router.patch('/products/:id', verifyToken, allowRole, updateProducts);
router.delete('/products/:id', verifyToken, allowRole, deleteProducts);

module.exports = router;