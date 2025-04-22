const express = require("express");
const app = express();
const connectDB = require('./src/config/db.js');
const cors = require('cors'); // Import cors

const port = 3000;

connectDB();
app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});