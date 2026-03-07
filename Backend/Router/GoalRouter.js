const express = require("express");
const router = express.Router();
const goalModel = require("../Model/GoalModel");
const authmiddleware = require("../Middlewares/authMiddleware");

// Create goal
router.post("/", authmiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const goal = new goalModel({
      title,
      user: req.user, // Use userId from middleware
    });

    await goal.save();

    res.status(200).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (err) {
    next(err);
  }
});

// Protected test route
router.get("/protected", authmiddleware, (req, res) => {
  res.status(200).json({ message: "You accessed a protected route!", user: req.user });
});

module.exports = router;