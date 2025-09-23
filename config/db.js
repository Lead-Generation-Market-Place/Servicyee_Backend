import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URL;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("✅ Connected to MongoDB successfully!");

    console.log(
      "MongoDB connection ready state:",
      mongoose.connection.readyState
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
