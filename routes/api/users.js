var express = require("express");
const User = require("../../models/User");
const isAuthorized = require("../../middleware/isAuthorized");
const { upload } = require("../../config/upload-image");
var router = express.Router();
const multer = require("multer");
const fileUpload = multer();
router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const users = await User.create({ username: body.username });
    res.json({ msg: "Success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", isAuthorized, async (req, res, next) => {
  const { token } = req;
  try {
    const user = await User.findOne({ _id: token._id }).select("-_id");
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.put("/", isAuthorized, async (req, res, next) => {
  try {
    const { body, token } = req;
    const user = await User.updateOne(
      { _id: token._id },
      {
        $set: {
          fullName: body.fullName,
          email: body.email,
          phoneNumber: body.phoneNumber,
          address: body.address,
          gender: body.gender,
        },
      }
    );
    if (user.nModified == 1) {
      res.json({ msg: "Success" });
    } else {
      res.status(404).json({ msg: "User Not Foound" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/profpic",
  isAuthorized,
  fileUpload.single("image"),
  async (req, res, next) => {
    const { body, token } = req;

    try {
      let result;

      if (req.file) {
        result = await upload(req);
      }

      const existingUser = await User.findOne({});

      const user = await User.findOne({ _id: token._id });

      user.imageUrl = result.secure_url;
      await user.save();
      res.json({});
    } catch (e) {
      next(e);
    }
  }
);


module.exports = router;
