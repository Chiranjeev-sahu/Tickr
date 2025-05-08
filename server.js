const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const authRoutes = require('./src/routes/auth');
const todoRoutes = require('./src/routes/todos');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
}));
const port = process.env.PORT || 3000;

app.use(express.json());
express.urlencoded({ extended: true });

connectDB();

app.use('/api/auth', authRoutes); // Corrected to use /api
app.use('/api/todos', todoRoutes); // Corrected to use /api

app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:\${port}`);
});
