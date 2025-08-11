// app/controllers

const { Roles } = require('../models');

exports.index = async (req, res) => {
    // kalau mau pake limit data
    // const limit = parseInt(req.query.limit, 10) || 100;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    // Kalo mau pake pagination
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        // Buat data model untuk menampilkan data berdasarkan limit dan offset
        const { count, rows: models } = await Roles.scope('defaultScope').findAndCountAll({
            where: { deleted_at: null },
            // attributes: ['id', 'name'],
            order: [['id', 'DESC']],

            // kalau mau pake limit data
            limit: limit !== null ? limit : undefined,
            
            // kalau mau pake pagination
            offset: offset
        });

        // const responseData = models.map(({ id, name }) => ({ id, name }));
        const responseData = models.map((model, index) => ({
            // ID berurutan (Dummy ID) tapi bisa pakai langsung id dari column di database kalo mau (soal disini saya pakai id tidak ada pakai id)
            // id: offset + index + 1,
            
            // Data yang diambil dari model database
            id   : model.id,
            name : model.name
        }));

        // Kalo mau pake pagination
        const totalPages = Math.ceil(count / limit);

        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                data: responseData,
                total_all_data: count,

                // kalau mau pake limit data
                // limit_data: limit,
                limit: limit !== null ? limit : undefined,

                // kalau mau pake pagination
                current_page: page,
                total_pages: totalPages
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
    // Ambil data dari request
    const { name } = req.body;

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Cek role apakah data sudah ada
    const nameCheck = await Roles.findOne({ where: { name } });
    if (nameCheck) {
        return res.json({
            status: 'error',
            message: 'Role already exists'
        });
    }

    try {
        // Bikin data baru
        const models = new Roles();
        models.name = name || models.name;
        await models.save();

        // Data yang akan di tampilkan
        const responseData = {
            id   : models.id,
            name : models.name
        };

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
    const { id } = req.params;

    // Validasi Parameter
    if (!id) {
        return res.json({
            status: 'error',
            message: 'ID is required'
        });
    }

    try {
        // Cari data berdasarkan ID
        const models = await Roles.scope('defaultScope').findOne({
            where: {
                id,
                deleted_at: null
            }
        });
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Data yang akan di tampilkan
        const responseData = {
            id   : models.id,
            name : models.name
        };

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
    // Ambil parameter dari request
    const { id } = req.params;
    // Ambil data dari request
    const { name } = req.body;

    // Validasi id
    if (!id) {
        return res.json({
            status: 'error',
            message: 'ID is required'
        });
    }

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Cek role apakah data sudah ada
    const nameCheck = await Roles.findOne({ where: { name } });
    if (nameCheck) {
        return res.json({
            status: 'error',
            message: "The role name cannot be the same as the current name"
        });
    }

    try {
        // Carikan data yang akan diupdate
        const models = await Roles.scope('defaultScope').findOne({
            where: {
                id,
                deleted_at: null
            }
        });

        // Validasi Data ada atau tidak
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // Update data
        models.name = name || models.name;
        await models.save();

        // Data yang akan di tampilkan
        const responseData = {
            id   : models.id,
            name : models.name
        };

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
    // Ambil parameter dari request
    const { id } = req.params;

    // Validasi Parameter
    if (!id) {
        return res.json({
            status: 'error',
            message: 'User ID is required'
        });
    }

    try {
        // Cari data berdasarkan ID
        const models = await Roles.scope('defaultScope').findOne({
            where: {
                id,
                deleted_at: null
            }
        });

        // Validasi Data ada atau tidak
        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        // await models.destroy();
        models.deleted_at = new Date();
        await models.save();

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