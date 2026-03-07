const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userValidation = require("../validation/userValidation");
const userModel = require("../Model/UserModel");
const genrateToken = require("../utills/genratetoken");

// Signup
router.post("/signup", async (req, res, next) => {
  try {
    const { error } = userValidation.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: "Enter the data correctly" });

    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashpassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashpassword });
    await user.save();

    const token = genrateToken(user._id);

    res.status(200).json({
      success: true,
      message: "User is created",
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = genrateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;