const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser, updateUser, deleteUser } = require('../controllers/users')
const { loginValidation, registerValidation } = require('../validators/authValidator')
const { validateToken } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/:id', validateToken, getCurrentUser);
router.put('/:id', validateToken, updateUser);
router.delete('/:id', validateToken, deleteUser);

module.exports = router;