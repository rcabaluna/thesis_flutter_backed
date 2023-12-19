const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

let OrderDetailsSchema = new Schema({

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

const OrderDetails = mongoose.model("Orders", OrderDetailsSchema);
module.exports = OrderDetails;
