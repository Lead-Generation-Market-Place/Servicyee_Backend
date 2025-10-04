

import jwt from 'jsonwebtoken';
// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN


  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Access denied, no token provided" 
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};

// Optional: Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: "Admin access required" 
    });
  }
};