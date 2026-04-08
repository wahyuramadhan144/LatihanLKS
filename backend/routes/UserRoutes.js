const express = require('express');
const { getUsers, getUsersById, createUsers, updateUsers, deleteUsers } = require('../controllers/Users.js');
const { verifyUser } = require('../middleware/AuthUser.js');
const router = express.Router();

router.get('/users', verifyUser, getUsers);
router.get('/users/:id', verifyUser, getUsersById);
router.post('/users', verifyUser, createUsers);
router.patch('/users/:id', verifyUser, updateUsers);
router.delete('/users/:id', verifyUser, deleteUsers);

module.exports = router;