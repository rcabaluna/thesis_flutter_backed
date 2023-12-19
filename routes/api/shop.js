const express = require("express");
const router = express.Router();
const multer = require("multer");
const isAuthorized = require("../../middleware/isAuthorized");
const Seller = require("../../models/Seller");
const { upload } = require("../../config/upload-image");
const ProductBySeller = require("../../models/ProductBySeller");
const Product = require("../../models/Product");
const OrdersSummary = require("../../models/OrdersSummary");

const fileUpload = multer();

router.get("/", isAuthorized, async (req, res, next) => {
  const { token } = req;

  try {
    const seller = await Seller.findOne({ userId: token._id });
    if (!seller) {
      return res
        .status(400)
        .json({ error: "No seller connected for this account" });
    }
    res.json(seller);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  fileUpload.single("image"),
  isAuthorized,
  async (req, res, next) => {
    const { body, token } = req;

    try {
      let result;

      if (req.file) {
        result = await upload(req);
      }

      const seller = new Seller({
        shopName: body.shopName,
        address: body.address,
        email: body.email,
        phoneNumber: body.phoneNumber,
        userId: token._id,
        imageUrl: result?.secure_url,
      });

      await seller.save();

      res.json();
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/add-product",
  fileUpload.array("image"),
  isAuthorized,
  async (req, res, next) => {
    const { files, token, body } = req;
    try {
      const seller = await Seller.findOne({ userId: token._id });
      const product = await Product.findOne({ _id: body.productId });

      if (product.price < body.price) {
        return res
          .status(400)
          .json({ error: `Cannot set price greater than ${product.price}` });
      }
      const urls = [];
      for (const file of files) {
        let result = await upload({ file });
        urls.push(result.secure_url);
      }

      const productBySeller = new ProductBySeller({
        sellerId: seller._id,
        productId: body.productId,
        imageUrls: urls,
        quantity: body.quantity,
        tags: body.tags,
        price: body.price,
      });

      await productBySeller.save();

      res.json({});
    } catch (e) {
      next(e);
    }
  }
);

router.get("/all-products", async (req, res, next) => {
  try {
    const products = await ProductBySeller.find({
      quantity: { $gt: 0 },
    }).populate("productId sellerId");
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get("/product-live", isAuthorized, async (req, res, next) => {
  const { token } = req;

  try {
    const seller = await Seller.findOne({ userId: token._id });
    if (!seller) {
      return res.json([]);
    }
    const products = await ProductBySeller.find({
      sellerId: seller._id,
      quantity: { $gt: 0 },
    }).populate("productId sellerId");
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get("/product-sold", isAuthorized, async (req, res, next) => {
  const { token } = req;

  try {
    const seller = await Seller.findOne({ userId: token._id });

    if (!seller) {
      return res.json([]);
    }

    const products = await ProductBySeller.find({
      sellerId: seller._id,
      quantity: 0,
    }).populate("productId sellerId");

    res.json(products);
  } catch (e) {
    next(e);
  }
});


router.get("/my-shop-orders", isAuthorized, async (req, res, next) => {
  const { token } = req;
  try {
    const orders = await OrdersSummary.find({}).populate("userId");

    res.json(orders);
  } catch (e) {
    next(e);
  }
});



module.exports = router;
