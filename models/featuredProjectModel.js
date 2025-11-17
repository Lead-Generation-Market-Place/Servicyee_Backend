import mongoose from "mongoose";
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

const FeaturedProjectSchema = new Schema(
  {
    serviceId: { type: ObjectId, ref: "Service", required: true },
    cityname: { type: String, required: true },
    projectTitle: { type: String, required: true },
    approximate_total_price: { type: Number, required: true },
    duration: {
      type: {
        type: String,
        enum: ["hours", "day", "week", "months", "year"],
        
      },
      value: { type: Number },
    },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    fileIds: [{ type: ObjectId, ref: "File" }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "featured_projects",
  }
);

const FeaturedProject = models.FeaturedProject || model("FeaturedProject", FeaturedProjectSchema);
export default FeaturedProject;