const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const roleRoutes = require('./app/routes/roleRoutes');

dotenv.config();

const app = express();

// Aktifkan middleware CORS untuk semua rute
app.use(cors()); 

// Atau jika ingin menggunakan konfigurasi khusus:
// const corsOptions = {
//   origin: 'http://localhost:3000', // Ganti dengan domain yang diizinkan
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));

app.use(express.json());

// Definisikan routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API Nodejs Express Starter Kit');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});
