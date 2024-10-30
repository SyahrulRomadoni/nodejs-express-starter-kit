// app/controllers

const bcrypt = require('bcryptjs');
const { Roles } = require('../models');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: models } = await Roles.findAndCountAll({
            where: { deletedAt: null },
            // attributes: ['uuid', 'name'],
            limit: limit,
            offset: offset
        });

        const responseData = models.map(({ uuid, name }) => ({ uuid, name }));
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
        const models = await Roles.findOne({ where: { uuid, deletedAt: null } });

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
                name: models.name
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
    const { name } = req.body;

    try {
        const models = await Roles.findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        models.name = name || models.name;
        await models.save();

        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: {
                uuid: models.uuid,
                name: models.name
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
        const models = await Roles.findOne({ where: { uuid, deletedAt: null } });

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