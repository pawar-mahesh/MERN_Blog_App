import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
app.use(express.json());

// mongoose connection
mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// middleware to handle the errors
app.use((err, req, res, next) => {
  res.json({
    success: false,
    status: err.status || 500,
    message: err.message || "Internal server error",
  });
});

// app start
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
