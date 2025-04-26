const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js'); 
const authRoutes = require('./src/routes/auth'); 
const todoRoutes = require('./src/routes/todos'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; 
// 
app.use(cors()); 
app.use(express.json()); 

connectDB();

// Mount route handlers
app.use('/api/auth', authRoutes); 
app.use('/api/todos', todoRoutes); 


app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
