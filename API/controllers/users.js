const { validationResult } = require('express-validator')
const { findByEmail, verifyPassword, checkEmailExists, create, findById, update, remove } = require('../models/User')
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

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email
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
        const { email, password } = req.body;

        // Check if user already exists
        const userExists = await checkEmailExists(email);

        if (userExists) {
            return res.status(409).json({
                error: 'User with this email already exists'
            });
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const newUser = {
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        const userId = await create(newUser);

        // Generate JWT token for automatic login
        const token = generateToken({
            id: userId,
            email: email
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email: email
            }
        });
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
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
        const { email, password } = req.body;

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

        await remove(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { login, register, getCurrentUser, updateUser, deleteUser };