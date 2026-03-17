// src/controllers

const bcrypt = require('bcryptjs');
const { Users, Roles } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getCurrent = async (req, res) => {
    // Get Request User
    const { uuid } = req.user;

    // Validation Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    try {
        // Models
        const models = await Users.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name'],
                    required: false
                }
            ]
        });

        // Validation Models
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Response Json
        const responseData = {
            // id        : models.id,
            uuid      : models.uuid,
            uuid_role : models.uuid_role,
            name      : models.name,
            role      : models.roles ? models.roles.name : null,
            email     : models.email
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

exports.index = async (req, res) => {
    // Config Pagination
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        // Models
        const { count, rows: models } = await Users.scope('defaultScope').findAndCountAll({
            where: { deleted_at: null },
            order: [['id', 'DESC']],
            limit: limit !== null ? limit : undefined,
            offset: offset,
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name'],
                    required: false
                }
            ]
        });

        // Response Data
        const responseData = models.map((model, index) => ({
            // id        : model.id,
            uuid      : model.uuid,
            uuid_role : model.uuid_role,
            name      : model.name,
            role        : model.roles ? model.roles.name : null,
            email     : model.email,
        }));

        // Return Json
        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                data: responseData,
                total_all_data: count,
                limit_data: limit,
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
    const {
        uuid_role,
        name,
        email,
        password
    } = req.body;

    // Validation Body
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

    // Validation email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validation password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
    if (!passwordRegex.test(password)) {
        return res.json({
            status: 'error',
            message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
        });
    }

    try {
        // Check Role on DB
        const role = await Roles.findOne({ where: { uuid: uuid_role } });
        if (!role) {
            return res.json({
                status: 'error',
                message: 'Role not found'
            });
        }
        
        // Check Email Already on DB
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.json({
                status: 'error',
                message: 'Email already exists'
            });
        }
        
        // New Data
        const models     = new Users();
        models.uuid      = uuidv4();
        models.uuid_role = uuid_role;
        models.name      = name;
        models.email     = email;
        models.password  = await bcrypt.hash(password, 10);
        await models.save();

        // Response Data
        const responseData = {
            // id        : models.id,
            uuid      : models.uuid,
            uuid_role : models.uuid_role,
            name      : models.name,
            email     : models.email,
            roles     : models.roles
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
    // Ambil parameter dari request
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
        const models = await Users.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            },
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
            // id        : models.id,
            uuid      : models.uuid,
            uuid_role : models.uuid_role,
            name      : models.name,
            email     : models.email,
            roles     : models.roles
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
    const {
        uuid_role,
        name,
        email,
        password
    } = req.body;

    // Validation Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    // Validation Body
    const fields = {
        uuid_role,
        name,
        email
    };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Validation email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validation password
    if (password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
        if (!passwordRegex.test(password)) {
            return res.json({
                status: 'error',
                message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
            });
        }
    }

    try {

        // Check Role on DB
        const role = await Roles.findOne({ where: { uuid: uuid_role } });
        if (!role) {
            return res.json({
                status: 'error',
                message: 'Role not found'
            });
        }
        
        // Models
        const models = await Users.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            },
        });

        // Check Email and same old email and Skip
        if (models.email !== email) {
            // Check Email on DB
            const existingUser = await Users.findOne({ where: { email: email } });
            if (existingUser) {
                return res.json({
                    status: 'error',
                    message: 'Email already exists'
                });
            }
        }

        // Validation Data ada atau tidak
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Update data
        models.uuid_role = uuid_role || models.uuid_role;
        models.name      = name      || models.name;
        models.email     = email     || models.email;
        if (password) {
            models.password = await bcrypt.hash(password, 10);
        }
        await models.save();

        // Response Json
        const responseData = {
            // id: models.id,
            uuid: models.uuid,
            id_role: models.id_role,
            name: models.name,
            email: models.email,
            roles: models.roles
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
    // Get Request Parameter
    const { uuid } = req.params;

    // Validation Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'ID is required'
        });
    }

    try {
        // Cari data berdasarkan ID
        const models = await Users.findOne({
            where: {
                uuid: uuid,
                deleted_at: null
            }
        });

        // Validation jika data tidak ditemukan
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Response Json
        // await models.destroy();
        models.deleted_at = new Date();
        await models.save();

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