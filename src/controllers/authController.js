import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js'; // Kullanıcı modelinizin yolu

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 5 minutes.</p>`
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {}
    });
  } catch (err) {
    next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, 'User not found!');

    user.password = password; // hashleme gerekiyorsa burada yapılmalı
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {}
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }
    next(err);
  }
};