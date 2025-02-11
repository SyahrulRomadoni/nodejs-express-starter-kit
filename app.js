const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const routes = require('./app/routes');

dotenv.config();

const app = express();

// Aktifkan middleware CORS untuk semua rute
app.use(cors());

// Atur limit payload JSON
app.use(express.json({ limit: '50mb' }));
// Atur limit payload form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Atau jika ingin menggunakan konfigurasi khusus:
// const corsOptions = {
//   origin: 'http://localhost:3000', // Ganti dengan domain yang diizinkan
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));

app.use(express.json());

// Definisikan semua routes
app.use(routes);
// Membuat route public untuk bisa mengakses file semua yang ada di folder public
app.use('/public', express.static(path.join(__dirname, 'public')));
// Route default Welcome
app.get('/', (req, res) => {
    res.send('Welcome to the API Nodejs Express Starter Kit');
});

const APP_PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL || "//localhost:";
app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_URL}:${APP_PORT}`);
});
