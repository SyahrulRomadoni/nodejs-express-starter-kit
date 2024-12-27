// app/controllers

const { Roles } = require('../models');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: models } = await Roles.scope('defaultScope').findAndCountAll({
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

exports.create = async (req, res) => {
    const { name } = req.body;

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.status(400).json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    try {
        // Carikan data yang akan diupdate
        const models = new Roles();

        models.name = name || models.name;
        await models.save();

        const responseData = { uuid: models.uuid, name: models.name };
        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: responseData
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
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        const responseData = { uuid: models.uuid, name: models.name };
        res.status(200).json({
            status: 'success',
            message: 'Data successfully found',
            data: responseData
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

    // Validasi uuid
    if (!uuid) {
        return res.status(400).json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.status(400).json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    try {
        // Carikan data yang akan diupdate
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.status(404).json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        models.name = name || models.name;
        await models.save();

        const responseData = { uuid: models.uuid, name: models.name };
        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully',
            data: responseData
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
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

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