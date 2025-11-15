import mongoose from "mongoose";
const { Schema, model, Types, models } = mongoose;
const ObjectId = Types.ObjectId;

const ProfessionalLicenseSchema = new Schema(
  {
    professional_id: {
      type: ObjectId,
      ref: "Professional",
      required: true
    },
    license_type_id: {
      type: ObjectId,
      ref: "LicenseType",
      required: true
    },
    zipcode_id: {
      type: ObjectId,
      ref: "Zipcode",
      required: true
    },
    license_owner_name: {
      type: String,
      required: true
    },
    license_expiration: {
      type: Date,
      required: true
    },
    link_to_licensing_agency: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ["pending", "active", "approved"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "professional_licenses"
  }
);

// Indexes for better query performance
ProfessionalLicenseSchema.index({ professional_id: 1 });
ProfessionalLicenseSchema.index({ license_type_id: 1 });
ProfessionalLicenseSchema.index({ zipcode_id: 1 });
ProfessionalLicenseSchema.index({ license_expiration: 1 });
ProfessionalLicenseSchema.index({ status: 1 });

const ProfessionalLicense = 
  models.ProfessionalLicense || model("ProfessionalLicense", ProfessionalLicenseSchema);

export default ProfessionalLicense;