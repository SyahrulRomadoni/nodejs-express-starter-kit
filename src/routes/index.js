const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const routesPath = __dirname; // Folder routes

fs.readdirSync(routesPath).forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const route = require(path.join(routesPath, file));

        // Gunakan customRoute jika tersedia
        const routeName = route.routeName
            ? `/api${route.routeName}` // tambahkan prefix /api
            : `/api/${file.replace('Routes.js', '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;

        // console.log(`Registering route: ${routeName} → ${file}`);
        router.use(routeName, route);
    }
});

module.exports = router;
