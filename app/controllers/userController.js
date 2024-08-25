// app/config

const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

exports.getCurrent = async (req, res) => {
    const { uuid } = req.user;

    if (!uuid) {
        return res.status(400).json({
            status: 'error',
            message: 'User UUID is required'
        });
    }

    try {
        const users = await User.findOne({
            where: { uuid, deletedAt: null },
            attributes: ['name', 'email',],
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }
            ],
        });

        console.log('User:', users);

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.index = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: users } = await User.findAndCountAll({
            where: { deletedAt: null },
            attributes: ['name', 'email',],
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }
            ],
            limit: limit,
            offset: offset
        });

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                users: users,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.read = async (req, res) => {
    const { uuid } = req.params;

    try {
        const users = await User.findOne({
            where: { uuid, deletedAt: null },
            attributes: ['name', 'email',],
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }
            ],
        });

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.updated = async (req, res) => {
    const { uuid } = req.params;
    const { name, email, password } = req.body;

    try {
        const users = await User.findOne({
            where: { uuid, deletedAt: null },
        });

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        users.name = name || users.name;
        users.email = email || users.email;
        if (password) {
            users.password = await bcrypt.hash(password, 10);
        }

        await users.save();

        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.deleted = async (req, res) => {
    const { uuid } = req.params;

    try {
        const users = await User.findOne({ where: { uuid, deletedAt: null } });

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        await users.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Data deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};