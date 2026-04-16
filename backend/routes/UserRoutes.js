const express = require('express');
const { getUsers, getUsersById, createUsers } = require('../controllers/Users.js');
const { verifyToken } = require('../middleware/AuthUser.js');
const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.get('/users/:id', verifyToken, getUsersById);
router.post('/users', createUsers);
// router.patch('/users/:id', verifyToken, updateUsers);
// router.delete('/users/:id', verifyToken, deleteUsers);

module.exports = router;