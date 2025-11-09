import createError from 'http-errors';
import * as authService from '../services/auth.js';
import User from '../models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers?.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw createError(401, 'No authorization header');
    }
    const token = header.split(' ')[1];
    const payload = await authService.verifyAccessToken(token); // throws on invalid/expired
    const user = await User.findById(payload.id).lean();
    if (!user) throw createError(401, 'User not found');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;