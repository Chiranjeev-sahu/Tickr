const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js'); 
const authRoutes = require('./src/routes/auth'); 
const todoRoutes = require('./src/routes/todos'); 
require('dotenv').config();

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500","http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
  }));
const port = process.env.PORT || 3000; 

app.use(express.json()); 

connectDB();

// mount handlers
app.use('/api/auth', authRoutes); 
app.use('/api/todos', todoRoutes); 


app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
