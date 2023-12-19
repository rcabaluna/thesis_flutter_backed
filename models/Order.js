const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

let OrderSchema = new Schema({
  sellerId: {
    type: ObjectId,
    ref: "Seller",
  },

  orderId: {
    type: ObjectId,
    ref: "OrdersSummary",
  },

  userId: {
    type: ObjectId,
    ref: "User",
  },

  productBySellerId: {
    type: ObjectId,
    ref: "ProductBySeller",
  },

  quantity: {
    type: Number,
  },

  option: {
    type: String,
    enum: ["delivery", "pickup"],
  },

  total: {
    type: Number,
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

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
