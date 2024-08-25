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

        return queryInterface.bulkInsert('Roles', [
            {
                uuid: 'ae0role1-5f16-4313-8dc8-b31709516641',
                name: 'Admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: 'ae0role2-5f16-4313-8dc8-b31709516642',
                name: 'User',
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
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
