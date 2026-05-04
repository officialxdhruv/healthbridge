import { env } from "@/env";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${env.MONGODB_URI}/healthbridge`);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
