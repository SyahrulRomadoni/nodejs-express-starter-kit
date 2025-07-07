// Cegah nodemon di production
// nodemon auto reload and run kalo ada perubahan kode disetiap file yang kita rubah
if (process.env.APP_NODE_ENV === 'production' && process.argv[1].includes('nodemon')) {
    console.warn('Jangan gunakan nodemon di production!');
    process.exit(1);
}

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const path = require('path');

// Import routes
const routes = require('./app/routes');

const app = express();

// Aktifkan middleware CORS untuk semua rute
app.use(cors());

// Atur limit payload JSON & form-urlencoded
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Jika ingin konfigurasi CORS manual (opsional)
/*
const corsOptions = {
    origin: 'http://localhost:3000', // Ganti sesuai kebutuhan
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
*/

// Definisikan semua routes
app.use(routes);

// Public folder untuk akses file statis
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route default welcome
app.get('/', (req, res) => {
    res.send('Welcome to the API Nodejs Express Starter Kit');
});

// Konfigurasi port & URL dari .env
const APP_PORT = process.env.APP_PORT || 3001;
const APP_HOST = process.env.APP_HOST || "localhost";

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`✅ Server listening on http://${APP_HOST}:${APP_PORT}`);
});