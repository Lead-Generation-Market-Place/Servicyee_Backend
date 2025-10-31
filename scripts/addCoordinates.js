import mongoose from "mongoose";
import zipcodeModel from "../models/zipcodeModel.js";

// 1️⃣ Connect to MongoDB
const mongoURI =
  "mongodb+srv://liaqatpaindah266_db_user:aqHKBYr0kFcI4bVk@cluster0.vgiebup.mongodb.net/ServicyeeDB?retryWrites=true&w=majority&appName=Cluster0"; // replace with your DB URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// 2️⃣ Add coordinates
async function addCoordinates() {
  try {
    // const missing = await zipcodeModel.find({ coordinates: { $exists: false } });
    //console.log("ZIP codes missing coordinates:", missing.length);

    const zipcodes = await zipcodeModel.find();

    for (const zip of zipcodes) {
      zip.coordinates = {
        type: "Point",
        coordinates: [zip.lng, zip.lat],
      };
      await zip.save();
    }

    console.log("All ZIP codes now have coordinates!");
    mongoose.connection.close(); // close connection when done
  } catch (err) {
    console.error("Error adding coordinates:", err);
    mongoose.connection.close();
  }
}

addCoordinates();
