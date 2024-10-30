// app/config

const bcrypt = require('bcryptjs');
const { Users, Roles } = require('../models');
const roles = require('../models/roles');

exports.getCurrent = async (req, res) => {
    const { uuid } = req.user;

    if (!uuid) {
        return res.status(400).json({
            status: 'error',
            message: 'User UUID is required'
        });
    }

    try {
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ]
        });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                uuid: models.uuid,
                uuid_role: models.uuid_role,
                name: models.name,
                email: models.email,
                roles: models.roles
            }
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
        const { count, rows: models } = await Users.scope('defaultScope').findAndCountAll({
            where: { deletedAt: null },
            // attributes: ['uuid', 'uuid_role', 'name', 'email'],
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ],
            limit: limit,
            offset: offset
        });

        const responseData = models.map(({ uuid, uuid_role, name, email, roles }) => ({ uuid, uuid_role, name, email, roles }));
        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                data: responseData,
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
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ],
        });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                uuid: models.uuid,
                uuid_role: models.uuid_role,
                name: models.name,
                email: models.email,
                roles: models.roles
            }
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
    const { uuid_role, name, email, password } = req.body;

    try {
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ]
        });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        models.uuid_role = uuid_role || models.uuid_role;
        models.name = name || models.name;
        models.email = email || models.email;
        if (password) {
            models.password = await bcrypt.hash(password, 10);
        }
        await models.save();

        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: {
                uuid: models.uuid,
                uuid_role: models.uuid_role,
                name: models.name,
                email: models.email,
                roles: models.roles
            }
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
        const models = await Users.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        await models.destroy();

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