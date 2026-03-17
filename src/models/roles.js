// src/models

module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define('Roles', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        uuid: {
            type: Sequelize.UUID,
            // defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: 'roles',
        underscored: true, // Mengubah camelCase jadi snake_case (createdAt -> created_at)
        timestamps: true,  // Mengaktifkan created_at & updated_at
    });

    // Relasi to users
    Roles.associate = (models) => {
        Roles.hasMany(models.Users, {
            foreignKey: 'uuid_role',
            sourceKey: 'uuid',
            as: 'users'
        });
    };

    return Roles;
};
