const { validationResult } = require('express-validator');
const { findAll, findById, create, update, remove } = require('../models/Player');

const getAllPlayers = async (req, res) => {
    try {
        const players = await findAll();
        res.status(200).json(players);
    } catch(error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to get players' });
    }
};

const getPlayerById = async (req, res) => {
    try {
        const id = req.params.id;
        const player = await findById(id);

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(player);
    } catch(error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ error: 'Failed to fetch player' });
    }
};

const createPlayer = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const { name, age, position, team, physical, stats } = req.body;

        const newPlayer = {
            name: name,
            age: parseInt(age),
            position: position,
            team: team,
            physical: {
                height: parseInt(physical.height),
                weight: parseInt(physical.weight),
                preferredFoot: physical.preferredFoot
            }, 
            stats: {
                matchesPlayed: parseInt(stats.matchesPlayed),
                goalsScored: parseInt(stats.goalsScored),
                assists: parseInt(stats.assists),
                skillRatings: stats.skillRatings || {}
            },
            createdBy: req.user.userId,
            createdAt: new Date().toISOString()
        };

        const playerId = await create(newPlayer);

        res.status(201).json({ id: playerId });
    } catch(error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Failed to add player' });
    }
};

const updatePlayer = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const id = req.params.id;
        const { name, age, position, team, physical, stats } = req.body;

        const player = await findById(id);

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        if (player.createdBy !== req.user.userId) {
            return res.status(403).json({ error: 'You can only edit players you created' });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (age !== undefined) updateData.age = parseInt(age);
        if (position !== undefined) updateData.position = position;
        if (team !== undefined) updateData.team = team;
        if (physical !== undefined) updateData.physical = {
                height: parseInt(physical.height),
                weight: parseInt(physical.weight),
                preferredFoot: physical.preferredFoot
            };
        if (stats !== undefined) updateData.stats = {
                matchesPlayed: parseInt(stats.matchesPlayed),
                goalsScored: parseInt(stats.goalsScored),
                assists: parseInt(stats.assists),
                skillRatings: stats.skillRatings || {}
            };

        const updatedPlayer = await update(id, updateData);

        res.status(200).json(updatedPlayer);
    } catch(error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Failed to update player' });
    }
};

const deletePlayer = async (req, res) => {
    try {
        const id = req.params.id;

        const player = await findById(id);

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        if (player.createdBy !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete players you created' });
        }

        await remove(id);

        res.status(200).json({ message: 'Player deleted successfully' });
    } catch(error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Failed to delete player' });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
};
