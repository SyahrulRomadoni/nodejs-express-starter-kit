// app/controllers

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Users } = require('../models');
const { addToBlacklist, isBlacklisted } = require('../middlewares/tokenBlackList');

exports.register = async (req, res) => {
    const { uuid_role, name, email, password } = req.body;

    try {
        const existingUser = await Users.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const users = await Users.create({
            uuid: uuidv4(),
            uuid_role,
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: users
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
        const users = await Users.findOne({ where: { email } });
        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password'
            });
        }

        const accessToken = jwt.sign(
            {
                uuid: users.uuid,
                uuid_role: users.uuid_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRESIN + 'm' || '1440m' }
        );

        res.json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                expired: process.env.JWT_EXPIRESIN || '1440m',
                token: accessToken
            }
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

exports.checkToken = (req, res) => {
    const { token } = req.body;
    
    if (isBlacklisted(token)) {
        return res.status(400).json({
            status: 'error',
            message: 'Token expired'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is not valid'
            });
        }
        
        return res.status(200).json({
            status: 'success',
            message: 'Token is valid',
            // data: decoded
        });
    });
};