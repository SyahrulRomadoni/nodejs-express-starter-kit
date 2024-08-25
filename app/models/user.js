// app/models

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // id: {
        //     type: DataTypes.INTEGER,
        //     autoIncrement: true,
        //     allowNull: false,
        //     // primaryKey: true
        // },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        uuid_role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        defaultScope: {
            attributes: { exclude: [
                // 'id',
                // 'uuid',
                // 'uuid_role',
                // 'password'
            ] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        },
        sequelize,
        modelName: 'User',
        paranoid: true // Soft Delete
    });

    User.associate = function(models) {
        User.belongsTo(models.Role, { foreignKey: 'uuid_role', as: 'role' });
    };

    return User;
};
