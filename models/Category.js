const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;
// const bcrypt = require("bcryptjs");

let CategorySchema = new Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
