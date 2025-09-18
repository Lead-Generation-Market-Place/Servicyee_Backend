import { expressjwt } from 'express-jwt';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Protect routes middleware
export const authenticateJWT = expressjwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth', // attaches decoded token to req.auth
});
