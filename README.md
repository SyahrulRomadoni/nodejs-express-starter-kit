# NodeJs Express Starter Kit
Node Js Express Starter Kit is perfect for developers who have previously used the Laravel Framework or similar Framework models ORM and MVC, and is easy to modify according to the developer's wishes and needs.

## Run App ##
node app.js / npm run dev

## Install Library ##
npm install

## Structure ##
```plaintext
Project/
├── app/
│   ├── config/
│   │   └── config.js
│   ├── controller/
│   │   ├── authController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── tokenBlackList.js
│   ├── models/
│   │   ├── index.js
│   │   ├── roles.js
│   │   └── users.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roleRoutes.js
│   │   └── userRoutes.js
│   └── seeders/
│       ├── 20240824062807-users.js
│       └── 20240825024126-roles.js
├── .env.example
├── app.js
├── generate-secret.js
└── package.json
```

## Sequelize ##
// Make Migration
npx sequelize-cli migration:generate --name users
// Run Migration
npx sequelize-cli db:migrate

// Make Seeder
npx sequelize-cli seed:generate --name users
// Run Seeder
npx sequelize-cli db:seed:all

//Sedeer One Run
npx sequelize-cli db:seed --seed 20240825024126-roles.js
npx sequelize-cli db:seed --seed 20240824062807-users.js

// Make Model and Migration
npx sequelize-cli model:generate --name users --attributes name:string,email:string,password:string,role:string

# Make JWT Secret
node generate-secret.js

## Library ##
- express untuk membuat server web.
- jsonwebtoken untuk otentikasi JWT.
- bcryptjs untuk hashing password.
- dotenv untuk memuat variabel lingkungan.
- sequelize untuk ORM.
- sequelize-cli untuk migrasi dan seeder.
- mysql2 atau pg dan pg-hstore untuk koneksi MySQL atau PostgreSQL.
- CORS
