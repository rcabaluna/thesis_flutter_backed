const { SELLER_TYPE, LABEL, USER_TYPE } = require("../config/constant");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;
// const bcrypt = require("bcryptjs");

let SellerSchema = new Schema({
  shopName: {
    type: String,
  },

  email: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },


  address: {
    type: String,
    require: false,
  },


  imageUrl: {
    type: String,
  },

  userId: {
    type: ObjectId,
    ref: "User",
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

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;
