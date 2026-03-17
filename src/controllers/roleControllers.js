// src/controllers

const { Roles } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.index = async (req, res) => {
    // Config Pagination
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        // Model
        const { count, rows: models } = await Roles.findAndCountAll({
            where: { deleted_at: null },
            order: [['id', 'DESC']],
            limit: limit !== null ? limit : undefined,
            offset: offset
        });

        // Respponse Data
        const responseData = models.map((model) => ({
            // id   : model.id,
            uuid : model.uuid,
            name : model.name
        }));

        // Return Json
        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                data: responseData,
                total_all_data: count,
                limit: limit !== null ? limit : undefined,
                current_page: page,
                total_pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.created = async (req, res) => {
    // Get Request Body
    const { name } = req.body;

    // Validation Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }
    
    try {
        // Check unique name
        const nameCheck = await Roles.findOne({ where: { name: name } });
        if (nameCheck) {
            return res.json({
                status: 'error',
                message: 'Role already exists'
            });
        }
        
        // New Data
        const models = new Roles();
        models.uuid = uuidv4();
        models.name = name;
        await models.save();

        // Data yang akan di tampilkan
        const responseData = {
            // id   : models.id,
            uuid : models.uuid,
            name : models.name
        };

        // Return Json
        res.json({
            status: 'success',
            message: 'Data created successfully',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.read = async (req, res) => {
    // Get Request Param
    const { uuid } = req.params;

    // Validation Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    try {
        // Cari data berdasarkan ID
        const models = await Roles.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            }
        });

        // Validation Models
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Response Data
        const responseData = {
            // id   : models.id,
            uuid : models.uuid,
            name : models.name
        };

        // Return Json
        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.updated = async (req, res) => {
    // Get Request Parameter
    const { uuid } = req.params;

    // Get Request Body 
    const { name } = req.body;

    // Validation id
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    // Validation Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }
    
    try {
        // Check unique name
        const nameCheck = await Roles.findOne({ where: { name: name } });
        if (nameCheck) {
            return res.json({
                status: 'error',
                message: "The role name cannot be the same as the current name"
            });
        }
        // Carikan data yang akan diupdate
        const models = await Roles.scope('defaultScope').findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            }
        });

        // Validation Models
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Update data
        models.name = name || models.name;
        await models.save();

        // Resnponse Json
        const responseData = {
            // id   : models.id,
            uuid : models.uuid,
            name : models.name
        };

        // Return Json
        res.json({
            status: 'success',
            message: 'Data updated successfully',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.deleted = async (req, res) => {
    // Get Request Param
    const { uuid } = req.params;

    // Validation Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'User UUID is required'
        });
    }

    try {
        // Cari data berdasarkan ID
        const models = await Roles.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            }
        });

        // Validation Models
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Soft Delete
        models.deleted_at = new Date();
        await models.save();
        // await models.destroy();

        // Return Json
        res.json({
            status: 'success',
            message: 'Data deleted successfully'
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};