import { Schema, model } from "mongoose";

const Locationtype = ["user", "service", "lead", "project", "professional"];

const locationSchema = new Schema({
  type: {
    type: String,
    enum: Locationtype,
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
  
  }, 
  minute_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Minute",
  
  },
   vehicle_type_id: { 
    type: Schema.Types.ObjectId, 
    ref: "VehicleType",
   
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "locations"
});


export default model("Location", locationSchema);
