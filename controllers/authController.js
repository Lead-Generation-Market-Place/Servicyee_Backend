import * as authService from "../services/authService.js";

export async function register(req, res) {
  try {
    const user = await authService.registerUserService(req.body);
    res.status(201).json({ user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    console.log('[loginController] Login request body:', req.body);
    const { user, accessToken, refreshToken } = await authService.loginUserService(
      req.body,
      req.ip,
      req.get("User-Agent")
    );

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 15 * 60 * 1000, path: "/" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" });

    res.json({ user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    console.log('[loginController] Login error:', err.message);
    res.status(401).json({ message: err.message });
  }
}

export async function refresh(req, res) {
  try {
    const { accessToken, refreshToken } = await authService.refreshTokenService(
      req.cookies.refreshToken,
      req.ip,
      req.get("User-Agent")
    );

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 15 * 60 * 1000, path: "/" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" });

    res.json({ message: "Token rotated" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function logout(req, res) {
  await authService.logoutService(req.cookies.refreshToken);
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  const user = await authService.getUserByIdService(req.user.id);
  res.json({ user });
}
