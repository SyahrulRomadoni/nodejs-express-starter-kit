// app/seeders

'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('roles', [
            {
                uuid: uuidv4(),
                name: 'Admin',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'User',
                created_at: new Date(),
                updated_at: new Date()
            },
        ]);
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
