const express = require('express');
const {login, logout, Me} = require('../controllers/Auth.js');
const { verifyUser } = require('../middleware/AuthUser.js');

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyUser, logout);
router.get('/users', verifyUser, Me);

module.exports = router;