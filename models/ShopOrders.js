const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

let ShopOrdersSchema = new Schema({
    sellerId: {
        type: ObjectId,
        ref: "Seller",
    },

    productId: {
        type: ObjectId,
        ref: "Product",
    },

    quantity: {
        type: Number,
    },

    tags: [String],

    imageUrls: [String],

    price: {
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
const ShopOrders = mongoose.model(
    "Orders",
    ShopOrdersSchema
);
module.exports = ShopOrders;
