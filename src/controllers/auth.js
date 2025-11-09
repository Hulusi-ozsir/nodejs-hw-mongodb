import createError from 'http-errors';
import * as authService from '../services/auth.js';

const cookieOptions = () => ({
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true' || true,
  secure: process.env.COOKIE_SECURE === 'true' || false,
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30) * 24 * 60 * 60 * 1000
});

/**
 * POST /auth/register
 */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser({ name, email, password });
  return res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user
  });
};

/**
 * POST /auth/login
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.loginUser({ email, password });

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, cookieOptions());

  return res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken }
  });
};

/**
 * POST /auth/refresh
 */
export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefresh } = await authService.refreshSession(refreshToken);

  // set new cookie
  res.cookie('refreshToken', newRefresh, cookieOptions());

  return res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken }
  });
};

/**
 * POST /auth/logout
 */
export const logout = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logoutSession(refreshToken);

  // clear cookie
  res.clearCookie('refreshToken', cookieOptions());
  return res.status(204).send();
};