const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser, updateUser, deleteUser } = require('../controllers/users')
const { authValidation } = require('../validators/authValidator')
const { validateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authValidation, register);
router.post('/login', authValidation, login);

// Protected routes
router.get('/me', validateToken, getCurrentUser);
router.put('/me', validateToken, updateUser);
router.delete('/me', validateToken, deleteUser);

module.exports = router;