import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const RESET_TOKEN_EXPIRES = '15m'; // token süresi
const SALT_ROUNDS = 10;

/**
 * SMTP transporter oluşturur
 */
const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw createHttpError(500, 'SMTP yapılandırması eksik (.env dosyanızı kontrol edin)');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // 465 = SSL, 587 = TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

/**
 * Şifre sıfırlama e-postası gönderir
 */
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw createHttpError(400, 'E-posta adresi gerekli');

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'Bu e-posta adresiyle kullanıcı bulunamadı');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES });
    const resetLink = `${process.env.APP_DOMAIN || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <h2>Şifre Sıfırlama Talebi</h2>
        <p>Merhaba ${user.name || 'Kullanıcı'},</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın. Bu bağlantı ${RESET_TOKEN_EXPIRES} içinde geçerlidir.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;margin:10px 0;background:#007bff;color:#fff;border-radius:6px;text-decoration:none;">Şifreyi Sıfırla</a>
        <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı dikkate almayın.</p>
      </div>
    `;

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Şifre sıfırlama bağlantınız',
      html: htmlContent,
    });

    res.status(200).json({
      status: 200,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Yeni şifre belirleme işlemi (token doğrulama + parola güncelleme)
 */
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token) throw createHttpError(400, 'Token gerekli');
    if (!password) throw createHttpError(400, 'Yeni şifre gerekli');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;
    if (!email) throw createHttpError(400, 'Token geçersiz');

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'Kullanıcı bulunamadı');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Şifre başarıyla güncellendi.',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Token süresi dolmuş.'));
    } else if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Geçersiz token.'));
    } else {
      next(error);
    }
  }
};