const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const routesPath = __dirname; // Folder routes

// Baca semua file di dalam folder routes
fs.readdirSync(routesPath).forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const route = require(path.join(routesPath, file));
        // Buat path berdasarkan nama file
        // const routeName = `/api/${file.replace('Routes.js', '').toLowerCase()}`;
        const routeName = `/api/${file.replace('Routes.js', '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;

        router.use(routeName, route);
    }
});

module.exports = router;
