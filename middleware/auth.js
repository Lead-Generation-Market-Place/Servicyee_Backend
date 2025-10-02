// middleware/auth.js

export function authenticateJWT(req, res, next) {
  // For testing purposes, we hardcode the authenticated user
  req.user = {
    id: '68d6aca9df0080a85e3fa284',
  };
  next();
}
