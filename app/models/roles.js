// app/models

module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define('roles', {
        // id: {
        //     type: Sequelize.INTEGER,
        //     autoIncrement: true,
        //     allowNull: false,
        //     // primaryKey: true
        // },
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: 'roles',
        defaultScope: {
            attributes: { exclude: [
                // 'id',
                // 'uuid',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ] }
        },
        // sequelize,
        // modelName: 'Roles',
        // paranoid: true
    });

    Roles.associate = function(models) {
        Roles.hasMany(models.Users, { foreignKey: 'uuid_role', as: 'users' });
    };

    return Roles;
};
