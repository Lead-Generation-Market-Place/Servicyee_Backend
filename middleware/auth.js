// middleware/auth.js

export function authenticateJWT(req, res, next) {
  // For testing purposes, we hardcode the authenticated user
  req.user = {
    id: '68cee65d0cc10d7c38193f16',
  };
  next();
}
