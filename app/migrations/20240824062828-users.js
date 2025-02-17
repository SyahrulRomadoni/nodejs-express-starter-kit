'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(sequelize, Sequelize) {
        await sequelize.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_role: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            // uuid: {
            //     type: Sequelize.UUID,
            //     defaultValue: Sequelize.UUIDV4,
            //     allowNull: false,
            //     unique: true,
            //     primaryKey: true
            // },
            // uuid_role: {
            //     type: Sequelize.UUID,
            //     allowNull: false
            // },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down(sequelize, Sequelize) {
        await sequelize.dropTable('users');
    }
};
