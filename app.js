const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const roleRoutes = require('./app/routes/roleRoutes');

dotenv.config();

const app = express();
app.use(express.json());

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