const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  isDone: {
    type: Boolean,
    default: false,
  },
  todoInfo: {
    type: String,
    required: true,
  },
});

// 改變 isDone （true <-> false）
todoSchema.methods.changeStatus = function () {
  this.isDone = !this.isDone;
  this.save();
};

module.exports = mongoose.model("Todo", todoSchema);
