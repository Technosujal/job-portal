import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/career_connect";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error details:");
    console.log(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    // Wait a bit to ensure logs are flushed
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(1);
  }
};

export const db = mongoose.connection;
