// models/Product.js
import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: String,
  zipcode: { type: Number, required:true }
});

export default model("Location", productSchema);
