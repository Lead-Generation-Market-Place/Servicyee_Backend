import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const { ObjectId } = Types;


const UserSchema = new Schema({
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
  roles: [{ type: ObjectId, ref: 'Role', index: true }]
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model('User', UserSchema);
