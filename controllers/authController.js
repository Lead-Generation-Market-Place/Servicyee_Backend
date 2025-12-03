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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUserService({ email, password });

    if (!result.success) {
      console.log("the result is ",result.message)
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
      user: null,
      tokens: null,
    });
  }
};



















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
