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
    // category: {  // Commented out category
    //   type: String,
    //   trim: true,
    //   default: "others",
    // },
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
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'completed', 'overdue'],
      default: 'todo',
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema, "todos");
module.exports = Todo;
