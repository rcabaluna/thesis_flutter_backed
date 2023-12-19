const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;
// const bcrypt = require("bcryptjs");

let ProductSchema = new Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
  },

  imageUrl: {
    type: String,
  },

  price: {
    type: Number,
  },

  unit: {
    type: String,
  },

  categoryId: {
    type: ObjectId,
    ref: "Category",
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

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
