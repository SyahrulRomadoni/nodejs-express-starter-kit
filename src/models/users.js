module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('Users', {
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
            unique: true,
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

    // Relasi to Roles
    Users.associate = (models) => {
        Users.belongsTo(models.Roles, {
            foreignKey: 'uuid_role',
            targetKey: 'uuid',
            as: 'roles'
        });
    };

    return Users;
};