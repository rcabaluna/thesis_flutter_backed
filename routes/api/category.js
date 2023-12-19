const express = require("express");
const Category = require("../../models/Category");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { body } = req;

  try {
    await Category.create({ name: body.name, description: body.description });

    res.json({});
  } catch (e) {
    next(e);
  }
});

router.put("/", async (req, res, next) => {
  const { body } = req;

  try {
    await Category.updateOne(
      { _id: body._id },
      {
        $set: { name: body.name, description: body.description },
      }
    );

    res.json({});
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await Category.find({});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
