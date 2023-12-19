const express = require("express");
const User = require("../../models/User");
const { GENDER } = require("../../config/constant");
const jwToken = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET;
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { body } = req;
    const user = new User({
      password: body.password,
      email: body.email,
      fullName: body.fullName,
    });
    await user.save();
    res.json({ msg: "Success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});



router.post("/login", async (req, res,    next) => {
  const { body } = req;
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({ error: "Username/password is incorrect" });
    }
    user.comparePassword(req.body.password, async function (err, isMatch) {
      if (err)
        return res
          .status(400)
          .json({ error: "Username/password is incorrect" });
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Username/password is incorrect" });
      }

      let payload = {
        id: user._id,
        name: user.fullName ? user.fullName : "",
        email: user.email,
      };
      const token = jwToken.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "300d",
      });

      res.json({ accessToken: token, userId: user._id });
    });
  } catch (e) {
    next(e);
  }
});

router.get("/logout", async (req, res, next) => {
  res.status(200).end();
  return "lg";
});


module.exports = router;
