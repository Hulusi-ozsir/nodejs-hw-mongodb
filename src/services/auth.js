import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const {
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRES_MINUTES = '15',
  REFRESH_TOKEN_EXPIRES_DAYS = '30'
} = process.env;

if (!JWT_SECRET) {
  // Uyarı: prod ortamında kesin tanımlı olmalı
  // eslint-disable-next-line no-console
  console.warn('JWT_SECRET not set in env!');
}

/**
 * helper: create JWT access token
 */
const createAccessToken = (payload) => {
  // sign with secret, expiration handled by exp claim
  const expiresInSeconds = Number(ACCESS_TOKEN_EXPIRES_MINUTES) * 60;
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_TOKEN_EXPIRES_MINUTES}m` });
  const validUntil = new Date(Date.now() + expiresInSeconds * 1000);
  return { token, validUntil };
};

const createRefreshToken = () => {
  const token = uuidv4();
  const validUntil = new Date(Date.now() + Number(REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000);
  return { token, validUntil };
};

/**
 * register user
 */
export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createError(409, 'Email in use');
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashed });

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * login user -> create session, return access token and set refresh cookie value internally
 * returns { accessToken, refreshToken } but controller handles cookie
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }
  const passOk = await bcrypt.compare(password, user.password);
  if (!passOk) throw createError(401, 'Invalid credentials');

  // Delete previous sessions for this user (as required)
  await Session.deleteMany({ userId: user._id });

  const { token: accessToken, validUntil: accessTokenValidUntil } = createAccessToken({ id: user._id.toString() });
  const { token: refreshToken, validUntil: refreshTokenValidUntil } = createRefreshToken();

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil
  });

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};

/**
 * refresh session using refreshToken from cookie
 */
export const refreshSession = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) throw createError(401, 'No refresh token');

  const existing = await Session.findOne({ refreshToken: refreshTokenFromCookie });
  if (!existing) throw createError(401, 'Invalid refresh token');

  if (existing.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: existing._id });
    throw createError(401, 'Refresh token expired');
  }

  // Delete old session
  const userId = existing.userId;
  await Session.deleteMany({ userId });

  // Create new tokens
  const { token: accessToken, validUntil: accessTokenValidUntil } = createAccessToken({ id: userId.toString() });
  const { token: refreshToken, validUntil: refreshTokenValidUntil } = createRefreshToken();

  const newSession = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil
  });

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};

/**
 * logout - remove session by refreshToken cookie (or session id)
 */
export const logoutSession = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) return false;
  const deleted = await Session.findOneAndDelete({ refreshToken: refreshTokenFromCookie });
  return !!deleted;
};

/**
 * helper: verify accessToken and session existence + expiry
 */
export const verifyAccessToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload should contain { id } as set on sign
    const session = await Session.findOne({ userId: payload.id, accessToken: token });
    if (!session) throw createError(401, 'Session not found');
    if (session.accessTokenValidUntil < new Date()) {
      // remove session
      await Session.deleteOne({ _id: session._id });
      throw createError(401, 'Access token expired');
    }
    return payload; // { id: ... }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw createError(401, 'Access token expired');
    }
    throw createError(401, 'Invalid access token');
  }
};