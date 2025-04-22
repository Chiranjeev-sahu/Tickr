const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "others",
    },
    priority: {
      type: String,
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dueDate: { 
      type: Date,
      required: false, 
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", "todos", TodoSchema);
module.exports = Todo;
