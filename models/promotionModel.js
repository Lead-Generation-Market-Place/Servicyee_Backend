import mongoose, { Schema } from "mongoose";
import services from "../models/servicesModel.js";

const promotionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount_value: {
      type: Number,
      required: false,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: services,
      required: true,
    },
    valid_from: {
      type: Date,
      required: true,
    },
    valid_to: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    promo_code: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Promotion", promotionSchema);
