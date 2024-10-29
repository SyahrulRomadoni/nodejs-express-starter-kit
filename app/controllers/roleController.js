// app/controllers

const bcrypt = require('bcryptjs');
const { Roles } = require('../models');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: roles } = await Roles.findAndCountAll({
            where: { deletedAt: null },
            attributes: ['name'],
            limit: limit,
            offset: offset
        });

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                roles: roles,
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
        const roles = await Roles.findOne({
            where: { uuid, deletedAt: null },
            attributes: ['name'],
        });

        if (!roles) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: roles
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
        const roles = await Roles.findOne({
            where: { uuid, deletedAt: null },
        });

        if (!roles) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        roles.name = name || roles.name;
        if (password) {
            roles.password = await bcrypt.hash(password, 10);
        }

        await roles.save();

        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: roles
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
        const roles = await Roles.findOne({ where: { uuid, deletedAt: null } });

        if (!roles) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        await roles.destroy();

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