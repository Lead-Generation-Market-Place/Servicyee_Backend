import { Schema, model } from "mongoose";

const LocationTypes = ["user", "service", "lead", "project", "professional"];

const locationSchema = new Schema({
  type: {
    type: String,
    enum: LocationTypes,
    required: true
  },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  professional_id: { type: Schema.Types.ObjectId, ref: "Professional" },
  service_id: { type: Schema.Types.ObjectId, ref: "Service" },
  lead_id: { type: Schema.Types.ObjectId, ref: "Lead" },
  project_id: { type: Schema.Types.ObjectId, ref: "FeaturedProject" },

  country: { type: String, required: true, default: "USA" },
  state: { type: String },
  city: { type: String, index: true },
  zipcode: { type: String, index: true },
  address_line: { type: String },
  mile_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Mile",
    required: false 
  }, 
  minute_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Minute",
    required: false 
  },
   vehicle_type_id: { 
    type: Schema.Types.ObjectId, 
    ref: "VehicleType",
    required: false 
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0,0]

    }
  },
  serviceRadiusMiles: { type: Number, default: 0 } // optional
}, {
  timestamps: true,
  versionKey: false,
  collection: "locations"
});
locationSchema.index({ coordinates: "2dsphere" });

export default model("Location", locationSchema);
