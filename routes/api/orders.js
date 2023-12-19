const express = require("express");
const isAuthorized = require("../../middleware/isAuthorized");
const OrdersSummary = require("../../models/OrdersSummary");
const ProductBySeller = require("../../models/ProductBySeller");
const Orders = require("../../models/Orders");
const Order = require("../../models/Order");
const Seller = require("../../models/Seller");
const { ObjectId } = require('mongodb');

const router = express.Router();



router.post("/", isAuthorized, async (req, res, next) => {
    const { body, token } = req;
    try {
        const createdOrderSummary = await OrdersSummary.create({
            userId: token._id,
            deliveryType: body.summary.deliverytype,
            address: body.summary.address,
            notes: body.summary.notes,
            status: 'Pending',
            statusCode: 0
        });

        const summaryOrderId = createdOrderSummary._id;

        const orders = body.orders;
        let newOrder = [];

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const productBySeller = await ProductBySeller.findOne({
                _id: order.productBySellerId,
            });
            let orderModel = new Order({
                sellerId: productBySeller.sellerId,
                orderId: summaryOrderId,
                productBySellerId: order.productBySellerId,
                quantity: order.quantity,
                userId: token._id,
                total: productBySeller.price * order.quantity,
            });
            newOrder.push(orderModel);
        }

        await Order.create(newOrder);
        res.json({});
    } catch (e) {
        next(e);
    }

});

router.get("/", async (req, res, next) => {
    const { body, token } = req;
    try {
        const ordersSummary = await OrdersSummary.find({});

        res.json(ordersSummary);
    } catch (e) {
        next(e);
    }

});

router.get("/order-details/:id", async (req, res, next) => {
    const orderId = req.params.id;
    const objOrderId = new ObjectId(orderId);

    try {

        // Find order details based on orderId and sellerId (token)
        const result = await Order.find({
            orderId: objOrderId,
        })
            .populate('userId', 'email phoneNumber address imageUrl')
            .populate('sellerId', 'shopName address email phoneNumber')
            .populate('productBySellerId', 'price productId')
            .exec();
        res.json(result);

    } catch (e) {
        next(e);
    }
});

module.exports = router;
