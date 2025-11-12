import mongoose from "mongoose";
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

const FileSchema = new Schema(
  {
  
    userId: { type: ObjectId, ref: "User" },
    professionalId: { type: ObjectId, ref: "Professional" },

    relatedModel: {
      type: String,
      enum: ["Professional", "FeaturedProject"],
      required: true,
    },

    relatedModelId: { type: ObjectId },

    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["photo", "video"],
      required: true,
    },
    fileSize: { type: Number },

    metaData: { type: Object },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "files",
  }
);

const File = models.File || model("File", FileSchema);
export default File;
