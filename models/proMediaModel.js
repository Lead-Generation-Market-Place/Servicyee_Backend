import mongoose from "mongoose";
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

const ProMediaSchema = new Schema(
  {
    professionalId: { type: ObjectId, ref: "Professional", required: true },

    // IMAGE
    fileName: { type: String },
    fileUrl: { type: String, required: function () { return !this.youtubeEmbed; } },
    fileSize: { type: Number },

    // YOUTUBE EMBED LINK
    youtubeEmbed: {
      type: String,
      required: function () { return !this.fileUrl; },
    },


    // Optional — assign media to a featured project
    projectId: { type: ObjectId, ref: "FeaturedProject", default: null },

    // Source: gallery, featured project, or both
    source: {
      type: String,
      enum: ["gallery", "featured", "both"],
      default: "gallery",
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "promedia",
  }
);

export default models.ProMedia || model("ProMedia", ProMediaSchema);
