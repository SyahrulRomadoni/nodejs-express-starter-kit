// app/config

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const { addToBlacklist } = require('../middlewares/tokenBlacklist');

exports.register = async (req, res) => {
    const { uuid_role, name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            uuid: uuidv4(),
            uuid_role,
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.scope('withPassword').findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password'
            });
        }

        const accessToken = jwt.sign(
            {
                uuid: user.uuid,
                uuid_role: user.uuid_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1440m' }
        );

        res.json({
            status: 'success',
            message: 'Logged in successfully',
            token: accessToken
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        addToBlacklist(token);
    }

    res.json({
        status: 'success',
        message: 'Logged out successfully'
    });
};