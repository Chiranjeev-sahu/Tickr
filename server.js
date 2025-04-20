const express=require("express");
const app=express();
const connectDB=require('./src/config/db.js')

const port=3000;

connectDB();
app.get("/",(req,res)=>{
    res.send("hello");
})

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:${port}`);
});