// app/models

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('users', {
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
        uuid_role: {
            type: Sequelize.UUID,
            allowNull: false
        },
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
        defaultScope: {
            attributes: { exclude: [
                // 'id',
                // 'uuid',
                // 'uuid_role',
                // 'password',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        },
        sequelize,
        modelName: 'Users',
        // paranoid: true
    });

    Users.associate = function(models) {
        Users.belongsTo(models.Roles, { foreignKey: 'uuid_role', as: 'roles' });
    };

    return Users;
};
