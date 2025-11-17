import mongoose from "mongoose";

const licenseTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'license_types'
});

export default mongoose.model('LicenseType', licenseTypeSchema);