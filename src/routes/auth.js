import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /auth/send-reset-email
 * @desc    Şifre sıfırlama bağlantısını e-posta olarak gönderir
 * @access  Public
 */
router.post(
  '/send-reset-email',
  asyncHandler(sendResetEmailController)
);

/**
 * @route   POST /auth/reset-pwd
 * @desc    Token doğrulaması yaparak şifreyi sıfırlar
 * @access  Public
 */
router.post(
  '/reset-pwd',
  asyncHandler(resetPasswordController)
);

export default router;