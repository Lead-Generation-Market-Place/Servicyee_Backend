import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  }
}, { 
  timestamps: true 
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model('User', UserSchema);


// import { Schema, model, Types } from 'mongoose';
// import bcrypt from 'bcrypt';

// const { ObjectId } = Types;


// const UserSchema = new Schema({
//   username: { type: String, required: true, index: true },
//   email: { type: String, required: true, unique: true, index: true },
//   phone: { type: String },
//   status: { type: String, enum: UserStatus, default: 'active' },
//   isEmailVerified: { type: Boolean, default: false },
//   account_type: { type: String, enum: AccountType, default: 'free' },
//   verification_status: { type: Boolean, default: false },
//   password: { type: String, required: true },
//   two_factor_authentication: { type: Boolean, default: false },
//   last_login: { type: Date },
//   login_ip_address: { type: String },
//   profile_image_url: { type: String },
//   login_attempts: { type: Number, default: 0 },
//   timezone: { type: String },
//   roles: [{ type: ObjectId, ref: 'Role', index: true }]
// }, { timestamps: true });

// // Hash password before save
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// export const User = model('User', UserSchema);
