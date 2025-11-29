import mongoose from "mongoose";
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

  const FeaturedProjectSchema = new Schema(
    {
      professional_id: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true, index: true },
      service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
      cityname: { type: String, required: true },
      projectTitle: { type: String, required: true },
      approximate_total_price: { type: Number, required: true },
      duration: {
        type: {
          type: String,
          enum: ["hours", "days", "weeks", "months", "years"],
          
        },
        value: { type: Number },
      },
      year: { type: Number, required: true },
      description: { type: String, required: true },
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