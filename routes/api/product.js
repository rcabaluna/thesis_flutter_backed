const express = require("express");
const Product = require("../../models/Product");
const router = express.Router();
const multer = require("multer");
const { upload } = require("../../config/upload-image");
const ProductBySeller = require("../../models/ProductBySeller");
const fileUpload = multer();
const { ObjectId } = require('mongodb');
const { exists } = require("../../models/User");

router.post("/", fileUpload.single("image"), async (req, res, next) => {
  const { body } = req;

  try {
    let result;

    if (req.file) {
      result = await upload(req);
    }
    await Product.create({
      name: body.name,
      price: body.price,
      imageUrl: result?.secure_url,
      categoryId: body.categoryId,
      unit: body.unit,
    });

    res.json({});
  } catch (e) {
    next(e);
  }
});

router.put("/", fileUpload.single("image"), async (req, res, next) => {
  const { body } = req;

  try {
    let result;

    if (req.file) {
      result = await upload(req);
    }

    let toSet = {
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
    };

    if (result) {
      toSet.imageUrl = result?.secure_url;
    }

    await Product.updateOne(
      { _id: body._id },
      {
        $set: toSet,
      }
    );

    res.json({});
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductBySeller.find({
      quantity: { $gt: 0 },
    }).populate("productId sellerId");

    res.json(products);
  } catch (e) {
    next(e);
  }

});


router.get("/name/:name", async (req, res, next) => {
  var product_name = req.params.name;

  try {
    const matchingProducts = await Product.find({ name: { $regex: product_name, $options: 'i' } }).exec();


    const result = await ProductBySeller.find({ productId: { $in: matchingProducts.map(p => p._id) }, quantity: { $gt: 0 } })
      .populate('sellerId')
      .populate('productId');

    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/categoryId/:id", async (req, res, next) => {
  var category_id = req.params.id;

  try {
    // Find products from products collection with the given categoryId
    const matchingProducts = await Product.find({ categoryId: category_id }).exec();

    // Search for matching products in productsbyseller collection
    const result = await ProductBySeller.find({ productId: { $in: matchingProducts.map(p => p._id) }, quantity: { $gt: 0 } })
      .populate('sellerId')
      .populate('productId');

    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/productId/:id", async (req, res, next) => {

  const product_id = req.params.id;
  const objectIdProductId = new ObjectId(product_id);

  try {


    const result = await ProductBySeller.find({ productId: objectIdProductId }).populate("productId sellerId");;
    res.json(result);

  } catch (e) {
    if (e instanceof Error && e.name === 'CastError') {
      // Handle invalid ObjectId format
      return res.status(400).json({ error: 'Invalid ObjectId format' });
    }
    next(e); // Forward other errors to the error handler
  }
});


module.exports = router;
