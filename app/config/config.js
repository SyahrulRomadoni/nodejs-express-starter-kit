// app/config

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV || 'root',
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_NAME_DEV     || 'nodejs_express_db',
    host: process.env.DB_HOST_DEV         || '127.0.0.1',
    dialect: process.env.DB_DIALECT_DEV   || 'mysql',
  },
  staging: {
    username: process.env.DB_USERNAME_STG || 'root',
    password: process.env.DB_PASSWORD_STG || null,
    database: process.env.DB_NAME_STG     || 'nodejs_express_db_test',
    host: process.env.DB_HOST_STG         || '127.0.0.1',
    dialect: process.env.DB_DIALECT_STG   || 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME_PRO || 'root',
    password: process.env.DB_PASSWORD_PRO || null,
    database: process.env.DB_NAME_PRO     || 'nodejs_express_db_prod',
    host: process.env.DB_HOST_PRO         || '127.0.0.1',
    dialect: process.env.DB_DIALECT_PRO   || 'mysql',
  },
};
