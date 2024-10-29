// app/models

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
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
                // 'uuid'
            ] }
        },
        sequelize,
        modelName: 'Role',
        paranoid: true // Soft Delete
    });

    Role.associate = function(models) {
        Role.hasMany(models.User, { foreignKey: 'uuid_role', as: 'users' });
    };

    return Role;
};
