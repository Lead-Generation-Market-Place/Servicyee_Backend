// models/Product.js
import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  country: { type: String, },
  state: { type: String, },
  city: String,
  zipcode: { type: Number, },
  longtitude:{type:String},
  latitude:{type:String}
});

export default model("Location", locationSchema);
