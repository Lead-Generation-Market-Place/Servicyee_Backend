import { User } from "../models/user.js";
import RefreshToken from "../models/refreshToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken, hashToken } from "../utils/token.js";



export async function registerUserService({ email, username, password }) {
  if (!email || !username || !password) {
    throw new Error("Email, username, and password are required");
  }

  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.trim();

  console.log("[registerUserService] Incoming data:", { email, username, password });

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new Error("Email already exists");

  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) throw new Error("Username already exists");

  const hashedPassword = await bcrypt.hash(password.trim(), 12);
  console.log("[registerUserService] Hashed password:", hashedPassword);

  const user = new User({
    email: normalizedEmail,
    username: normalizedUsername,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  // Remove password from returned object
  const { password: _, ...userData } = savedUser.toObject();
  return userData;
}

export async function loginUserService({ email, password }, ip, userAgent) {
  const normalizedEmail = email.toLowerCase();
  console.log('[loginUserService] Attempt login:', { email: normalizedEmail });
  const user = await User.findOne({ email: normalizedEmail });

  const isMatch = await bcrypt.compare(password.trim(), user.password);
 console.log('The password comparison result is:', password);
 console.log('The password comparison result is:', user.password);
await bcrypt.compare(password, user.password).then(console.log);


  if (!isMatch) {
    console.log('[loginUserService] Password mismatch for user:', normalizedEmail);
    throw new Error("Invalid credentials");
  }
  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id });
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    ip,
    userAgent,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  console.log('[loginUserService] Login successful for:', normalizedEmail);
  return { user, accessToken, refreshToken };
}


export async function refreshTokenService(oldToken, ip, userAgent) {
  if (!oldToken) throw new Error("No refresh token provided");

  const payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);

  const stored = await RefreshToken.findOne({
    userId: payload.id,
    tokenHash: hashToken(oldToken),
    revoked: false,
  });

  if (!stored || stored.expiresAt < Date.now()) throw new Error("Invalid refresh token");

  const newRefreshToken = signRefreshToken({ id: payload.id });
  stored.revoked = true;
  stored.replacedByTokenHash = hashToken(newRefreshToken);
  await stored.save();

  await RefreshToken.create({
    userId: payload.id,
    tokenHash: hashToken(newRefreshToken),
    ip,
    userAgent,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const newAccessToken = signAccessToken({ id: payload.id });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}


export async function logoutService(token) {
  if (!token) return;

  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(token) },
    { revoked: true }
  );
}


export async function getUserByIdService(userId) {
  return User.findById(userId).select("-password").exec();
}

export async function getAllUsersService() {
  return User.find().select("-password").exec();
}
