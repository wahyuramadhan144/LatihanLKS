const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders } = require('../controllers/Orders.js');
const router = express.Router();
const { verifyUser, adminOnly} = require('../middleware/AuthUser.js');

router.post('/orders', verifyUser, createOrder);
router.get('/orders', verifyUser, getMyOrders);
router.get('/orders/:id', verifyUser, getOrderById);
router.get('/admin/orders', verifyUser, adminOnly, getAllOrders);

exports.router = router;