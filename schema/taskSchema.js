const mongoose = require("mongoose");

// create schema
const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    taskBody: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

// create a model
const taskCollection = mongoose.model("tasks", taskSchema);

module.exports = {
  taskCollection,
};
