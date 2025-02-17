// app/models

module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        // uuid: {
        //     type: Sequelize.UUID,
        //     defaultValue: Sequelize.UUIDV4,
        //     allowNull: false,
        //     primaryKey: true
        // },
        name: {
            type: Sequelize.STRING,
            allowNull: false
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
        underscored: true,
        timestamps: true,
    });

    Roles.associate = function(models) {
        Roles.hasMany(models.Users, {
            foreignKey: 'id_role',
            as: 'users'
        });
    };

    return Roles;
};
