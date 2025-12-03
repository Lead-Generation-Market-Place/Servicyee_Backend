import { User } from "../models/user.js";
import RefreshToken from "../models/refreshToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
} from "../utils/token.js";

export async function registerUserService({ email, username, password }) {
  if (!email || !username || !password) {
    throw new Error("Email, username, and password are required");
  }

  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password.trim(), 12);

  const user = new User({
    email: normalizedEmail,
    username: normalizedUsername,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  const { password: _, ...userData } = savedUser.toObject();
  return userData;
}

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
      user: null,
      tokens: null,
    };
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        user: null,
        tokens: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password
    );
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
        user: null,
        tokens: null,
      };
    }

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });

    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return {
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      user: null,
      tokens: null,
    };
  }
};

export async function refreshTokenService(oldToken, ip, userAgent) {
  if (!oldToken) throw new Error("No refresh token provided");

  const payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);

  const stored = await RefreshToken.findOne({
    userId: payload.id,
    tokenHash: hashToken(oldToken),
    revoked: false,
  });

  if (!stored || stored.expiresAt < Date.now())
    throw new Error("Invalid refresh token");

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

export async function getCurrentUserServices(userId) {
  return User.findById(userId).select("-password").exec();
}

export async function getAllUsersService() {
  return User.find().select("-password").exec();
}
