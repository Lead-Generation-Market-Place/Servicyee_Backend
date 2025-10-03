import * as authService from "../services/authService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await authService.login({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 24 hours
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log("Login error: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error?.message || "An unexpected error occurred"
        });
    }
}

export async function register(req, res) {
  try {
    const data = await authService.register(req.body);

    const { password, ...userWithoutPassword } = data.toObject();

    // Generate JWT
    const token = jwt.sign(
      { id: data._id, email: data.email },
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Unable to register user",
      error: error?.message || "An unexpected error occurred"
    });
  }
}

export async function getAllusers(req, res) {
  try {
    const users = await authService.getAllUserService();
    if (!users) {
      res.status(401).json({message:"Unable to get all users"});
    }
    return res.status(201).json({users});
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Unable to get all users",
      error:error?.message || "An unexpected error occured"
    });
  }
}