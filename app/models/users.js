// app/

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('Users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        id_role: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        // uuid: {
        //     type: Sequelize.UUID,
        //     primaryKey: true,
        //     allowNull: false,
        //     defaultValue: Sequelize.UUIDV4
        // },
        // uuid_role: {
        //     type: Sequelize.UUID,
        //     allowNull: false
        // },
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
        tableName: 'users',
        underscored: true,
        timestamps: true,
    });

    Users.associate = function(models) {
        Users.belongsTo(models.Roles, {
            foreignKey: 'id_role',
            as: 'roles'
        });
    };

    return Users;
};
