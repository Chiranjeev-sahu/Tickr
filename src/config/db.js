const mongoose=require('mongoose');
require('dotenv').config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection successful")
    }catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
      }

};

module.exports = connectDB;
