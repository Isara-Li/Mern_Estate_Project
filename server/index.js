import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB!", err);
  });
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});

app.use("/users", userRouter);
app.use("/auth", authRouter);
