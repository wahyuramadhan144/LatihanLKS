const express = require('express');
const {login, logout, getUsers} = require('../controllers/Auth.js');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getUsers);

module.exports = router;