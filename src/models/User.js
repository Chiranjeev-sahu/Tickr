const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { 
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
  }
  },
  { timestamps: true }
);

const User = mongoose.model("User", "users", UserSchema);
module.exports = User;
