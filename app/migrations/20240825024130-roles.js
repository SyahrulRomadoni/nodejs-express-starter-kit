// app/migrations

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('roles', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // uuid: {
            //     type: Sequelize.UUID,
            //     defaultValue: Sequelize.UUIDV4,
            //     allowNull: false,
            //     unique: true,
            //     primaryKey: true
            // },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('Roles');
    }
};
