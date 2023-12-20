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
            deliveryType: body.summary.deliveryType,
            address: body.summary.address,
            notes: body.summary.notes,
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
                status: 'Pending'
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

router.get("/order-details/:id", isAuthorized, async (req, res, next) => {
    const orderId = req.params.id;
    const objOrderId = new ObjectId(orderId);

    try {
        // Find order details based on orderId and sellerId (userId)
        const result = await Order.find({
            orderId: objOrderId,

        })
            .populate('userId', 'email phoneNumber address imageUrl')
            .populate('sellerId', 'shopName imageUrl address email phoneNumber')
            .populate('productBySellerId', 'price productId')
            .exec();
        res.json(result);

    } catch (e) {
        next(e);
    }
});


router.put("/accept-order/:orderId", isAuthorized, async (req, res, next) => {

    const { body, token } = req;
    const orderId = req.params.orderId;

    const objsellerId = new ObjectId(token._id);

    try {

        const order = await Order.find
            ({ orderId });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const userIdFromToken = token._id;

        if (order.sellerId.toString() === userIdFromToken.toString()) {
            order.status = 'Accepted';
            order.updatedAt = new Date();

            // Save the updated order
            await order.save();
            return res.status(200).json({ message: 'Order status updated successfully' });
        } else {
            return res.status(403).json({ error: 'Unauthorized to update this order' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }

});



// MY ORDERS
router.get("/my-orders", isAuthorized, async (req, res, next) => {
    const { token } = req;
    const objectUserID = new ObjectId(token._id);
    try {
        const orders = await OrdersSummary.find({ userId: objectUserID });
        res.json(orders);
    } catch (e) {
        next(e);
    }
});

router.get("/get-order-summary/:orderid", isAuthorized, async (req, res, next) => {
    const { token } = req;
    const orderId = req.params.orderid;
    const objectUserID = token._id;
    const objectOrderID = new ObjectId(orderId);

    try {
        const orders = await OrdersSummary.find({ _id: objectOrderID, userId: token._id }).populate('userId');
        res.json(orders);
    } catch (e) {
        next(e);
    }
});


router.put("/receive-order/:orderId", isAuthorized, async (req, res, next) => {

    const { body, token } = req;
    const orderId = req.params.orderId;

    const objsellerId = new ObjectId(token._id);

    try {

        const order = await Order.findOne
            ({ orderId });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const userIdFromToken = token._id;

        if (order.userId.toString() == userIdFromToken.toString()) {
            order.status = 'Received';
            order.updatedAt = new Date();

            await order.save();
            return res.status(200).json({ message: 'Order status updated successfully' });
        } else {
            return res.status(403).json({ error: 'Unauthorized to update this order' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }

});

module.exports = router;
