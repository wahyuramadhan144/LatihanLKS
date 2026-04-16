const express = require('express');
const {Login, register, registerAdmin} = require('../controllers/Auth.js');
const { verifyToken } = require('../middleware/AuthUser.js');

const router = express.Router();

router.post('/login', Login);
router.post('/daftar', register);
router.post('/daftarAdmin', registerAdmin);
// router.get('/users', verifyToken, Me);

module.exports = router;