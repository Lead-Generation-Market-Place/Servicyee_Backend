import * as authService from "../services/authService.js";

// Register user
export async function register(req, res) {
  try {
    const user = await authService.registerUserService(req.body);
    const { accessToken, refreshToken } = await authService.loginUserService(
      { email: req.body.email, password: req.body.password },
      req.ip,
      req.get("User-Agent")
    );

    res.status(201).json({
      user: { id: user._id, email: user.email, username: user.username },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Login user
export async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUserService(
      req.body,
      req.ip,
      req.get("User-Agent")
    );

    res.json({
      user: { id: user._id, email: user.email, username: user.username },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}
export async function refresh(req, res) {
  try {
    const { accessToken, refreshToken } = await authService.refreshTokenService(
      req.body.refreshToken, 
      req.ip,
      req.get("User-Agent")
    );

    res.json({
      message: "Token rotated",
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

export async function logout(req, res) {
  try {
    await authService.logoutService(req.body.refreshToken); // mobile sends refreshToken in body
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await authService.getCurrentUserServices(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
