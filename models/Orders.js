const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

let OrdersSchema = new Schema({

    userId: {
        type: ObjectId,
        ref: "User",
    },

    status: {
        type: String
    },
    statusCode: {
        type: Number
    },

    deliveryType: {
        type: String
    },
    address: {
        type: String
    },
    notes: {
        type: String
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

const Orders = mongoose.model("Orders", OrdersSchema);
module.exports = Orders;
