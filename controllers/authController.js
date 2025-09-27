import * as authService from "../services/authService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({message:"Email and password are required"});
        }
        const user = await authService.login({email});
        if (!user) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 * 24 } 
        );
        return res.json({
            message:"login successful",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            },
        });
    } catch (error) {
        console.log("Login error: ", error);
        res.status(500).json({
            message:"Server error"
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