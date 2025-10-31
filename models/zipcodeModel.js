import { Schema, model } from "mongoose";

const zipcodeSchema = new Schema({
  zip: { type: String, required: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  city: { type: String, required: true },
  state_id: { type: String },
  state_name: { type: String },
  zcta: { type: Boolean },
  parent_zcta: { type: String },
  population: { type: Number },
  density: { type: Number },
  county_fips: { type: Number },
  county_name: { type: String },
  county_weights: { type: Schema.Types.Mixed },
  county_names_all: { type: String },
  county_fips_all: { type: String },
  imprecise: { type: Boolean },
  military: { type: Boolean },
  timezone: { type: String },

  // GeoJSON coordinates for geospatial queries
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
      index: "2dsphere", // Important for geo queries
    },
  },
}, {
  timestamps: true,
  versionKey: false,
  collection: "zipcodes",
});

zipcodeSchema.index({ coordinates: "2dsphere" });


export default model("Zipcode", zipcodeSchema);
