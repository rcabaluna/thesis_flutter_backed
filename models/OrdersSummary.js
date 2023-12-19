const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

let OrdersSummarySchema = new Schema({

    userId: {
        type: ObjectId,
        ref: "User",
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

const OrdersSummary = mongoose.model("OrdersSummary", OrdersSummarySchema);
module.exports = OrdersSummary;
