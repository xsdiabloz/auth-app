import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes/authRouter.js";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use("/auth", router);

const start = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    const conn = await mongoose.connect(MONGO_URI as string);
    app.listen(PORT, () => {
      console.log(`server starts on port: ${PORT}`);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
