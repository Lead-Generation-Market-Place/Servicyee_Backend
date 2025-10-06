


import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
