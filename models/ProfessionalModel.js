import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Enums
const UserStatus = ['active', 'inactive', 'suspended'];
const AccountType = ['free', 'premium', 'enterprise'];

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  status: { type: String, enum: UserStatus, default: 'active' },
  isEmailVerified: { type: Boolean, default: false },
  account_type: { type: String, enum: AccountType, default: 'free' },
  verification_status: { type: Boolean, default: false },
  password: { type: String, required: true },
  two_factor_authentication: { type: Boolean, default: false },
  last_login: { type: Date },
  login_ip_address: { type: String },
  profile_image_url: { type: String },
  login_attempts: { type: Number, default: 0 },
  timezone: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', index: true }]
}, { timestamps: true, versionKey: false, collection: 'users' });

// Compound index for username + email
UserSchema.index({ username: 1, email: 1 });

// Password hashing before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
