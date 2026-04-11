const express = require('express');
const { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } = require('../controllers/Products.js');
const { verifyUser, adminOnly } = require('../middleware/AuthUser.js');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductsById);
router.post('/products', verifyUser, createProducts);
router.patch('/products/:id', verifyUser, adminOnly, updateProducts);
router.delete('/products/:id', verifyUser, adminOnly, deleteProducts);

module.exports = router;