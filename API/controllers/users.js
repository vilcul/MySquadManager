const { validationResult } = require('express-validator')
const { findByEmail, verifyPassword, checkEmailExists, create, findById, update, remove } = require('../models/User')
const Player = require('../models/Player'); 
const { generateToken, hashPassword } = require('../auth')

const login = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        })
    }
    
    try {
        const { email, password } = req.body;

        const user = await findByEmail(email)

        if(!user) {
            return res.status(401).json({
                error: "Invalid login"
            })
        }

        const passIsValid = await verifyPassword(password, user.password)

        if (!passIsValid) {
            return res.status(401).json({
                error: "Invalid login"
            })
        }

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

const register = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const { name, email, password } = req.body;

        const userExists = await checkEmailExists(email);

        if (userExists) {
            return res.status(409).json({
                error: 'User with this email already exists'
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = {
            name: name || email.split('@')[0],
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        const userId = await create(newUser);

        const token = generateToken({
            id: userId,
            email: email
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email: email,
                name: newUser.name
            }
        });
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.params.id || req.user.userId;
        
        const user = await findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user.userId !== user.id.toString()) {
             return res.status(403).json({ error: 'Access denied' });
        }

        const { password, ...userData } = user;
        res.status(200).json(userData);
    } catch(error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

const updateUser = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const id = req.params.id;
        const { name, email, password } = req.body;

        const user = await findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (id !== req.user.userId) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const updateData = {};

        if (email !== undefined) {
            const emailExists = await checkEmailExists(email);
            const existingUser = await findByEmail(email);
            if (emailExists && existingUser && existingUser.id !== id) {
                return res.status(409).json({ error: 'Email already in use' });
            }
            updateData.email = email;
        }

        if (password !== undefined) {
            updateData.password = await hashPassword(password);
        }

        if (name !== undefined) {
            updateData.name = name;
        }

        const updatedUser = await update(id, updateData);

        res.status(200).json(updatedUser);
    } catch(error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (id !== req.user.userId) {
            return res.status(403).json({ error: 'You can only delete your own account' });
        }

        if (Player && Player.deleteMany) {
            await Player.deleteMany({ createdBy: id });
        } else {
            console.warn("Could not delete associated players: Player model missing deleteMany");
        }

        await remove(id);

        res.status(200).json({ message: 'User and associated players deleted successfully' });
    } catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { login, register, getCurrentUser, updateUser, deleteUser };