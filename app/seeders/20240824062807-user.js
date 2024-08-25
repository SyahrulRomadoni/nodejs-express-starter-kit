// app/seeders

'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */

        return queryInterface.bulkInsert('Users', [
            {
                uuid: uuidv4(),
                uuid_role: 'ae0role1-5f16-4313-8dc8-b31709516641',
                name: 'Admin',
                email: 'admin@example.com',
                password: await bcrypt.hash('password', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                uuid_role: 'ae0role2-5f16-4313-8dc8-b31709516642',
                name: 'User',
                email: 'user@example.com',
                password: await bcrypt.hash('password', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    async down (queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('Users', null, {});
    }
};
