require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./Router/AuthRouter");
const GoalRouter = require("./Router/GoalRouter");
const errormiddleware = require("./Middlewares/errormiddleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Home route
app.get("/", (req, res) => res.send("Backend server running"));

// Routes
app.use("/auth", authRoute);
app.use("/goals", GoalRouter);

// Error handler
app.use(errormiddleware);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);