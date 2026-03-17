// src/controllers

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Users, Roles } = require('../models');
const { addToBlacklist, isBlacklisted } = require('../middlewares/tokenBlackList');

exports.register = async (req, res) => {
    // Get Request Body
    const {
        uuid_role,
        name,
        email,
        password
    } = req.body;

    // Validasi body
    const fields = {
        uuid_role,
        name,
        email,
        password
    };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Validasi email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validasi password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
    if (!passwordRegex.test(password)) {
        return res.json({
            status: 'error',
            message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
        });
    }

    try {
        // Check Email
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        // New Data
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await Users.create({
            uuid: uuidv4(),
            uuid_role,
            name,
            email,
            password: hashedPassword
        });

        // Response Json
        const response = {
            id: users.id,
            uuid_role: users.uuid_role,
            name: users.name,
            email: users.email
        };

        // Return Json
        res.json({
            status: 'success',
            message: 'User registered successfully',
            data: response
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    // Get Request Body
    const {
        email,
        password
    } = req.body;

    // Validasi body
    const fields = {
        email,
        password
    };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Validasi email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validasi password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
    if (!passwordRegex.test(password)) {
        return res.json({
            status: 'error',
            message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
        });
    }

    try {
        // Check user
        const users = await Users.scope('defaultScope').findOne({
            where: {
                email: email,
                deleted_at: null
            }
        });
        if (!users) {
            return res.json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.json({
                status: 'error',
                message: 'Incorrect password'
            });
        }

        // JWT SIGN
        const accessToken = jwt.sign(
            {
                uuid      : users.uuid,
                uuid_role : users.uuid_role,
                name      : users.name,
                email     : users.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRESIN + 'm' || '1440m' }
        );

        // Return Json
        res.json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                expired: process.env.JWT_EXPIRESIN || '1440m',
                token: accessToken
            }
        });
    } catch (error) {
        res.json({
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
        return res.json({
            status: 'error',
            message: 'Token expired'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({
                status: 'error',
                message: 'Token is not valid'
            });
        }
        
        return res.json({
            status: 'success',
            message: 'Token is valid',
            // data: decoded
        });
    });
};