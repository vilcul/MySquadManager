const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } = require('../controllers/players');
const { validateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);

// Protected routes
router.post('/', validateToken, createPlayer);
router.put('/:id', validateToken, updatePlayer);
router.delete('/:id', validateToken, deletePlayer);

module.exports = router;