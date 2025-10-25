import mongoose, { Schema, Types } from "mongoose";

const AnswerSchema = new Schema({
  question_id: { type: Types.ObjectId, ref: "Question", required: true },
  answer: Schema.Types.Mixed // can be string, boolean, number, array
}, { _id: false });

const FileSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "file", "video"], default: "image" }
}, { _id: false });

const LocationSchema = new Schema({
  city: String,
  state: String,
  postcode: String,
}, { _id: false });

const LeadSchema = new Schema({
  service_id: { type: Types.ObjectId, ref: "Service", required: true },
  user_id: { type: Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, // e.g. "Home Cleaning"
  answers: [AnswerSchema],
  note: { type: String },
  files: [FileSchema],
  user_location: LocationSchema,
  professionals: [{ type: Types.ObjectId, ref: "Professional" }],
  send_option: { type: String, enum: ["top5", "selected"], default: "selected" },
  description: {type: String},
  created_at: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false, collection: "leads" });

export default mongoose.model("Lead", LeadSchema);


// import mongoose, { Schema, Types } from "mongoose";

// const AnswerSchema = new Schema({
//   question_id: { type: Types.ObjectId, ref: "Question", required: true },
//   answer: Schema.Types.Mixed // can be string, boolean, number, array
// }, { _id: false });

// const FileSchema = new Schema({
//   url: { type: String, required: true },
//   type: { type: String, enum: ["image", "file", "video"], default: "image" }
// }, { _id: false });

// const LeadSchema = new Schema({
//   service_id: { type: Types.ObjectId, ref: "Service", required: true },
//   user_id: { type: Types.ObjectId, ref: "User", required: true },
//   title: { type: String, required: true }, // store service name
//   answers: [AnswerSchema],
//   note: { type: String }, 
//   files: [FileSchema],
//   created_at: { type: Date, default: Date.now }
// }, { timestamps: true, versionKey: false, collection: "leads" });

// export default mongoose.model("Lead", LeadSchema);
