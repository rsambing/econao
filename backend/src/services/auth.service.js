import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { UserService } from './user.service.js';
import { EmailService } from './email.service.js';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

const userService = new UserService();
const emailService = new EmailService();

export class AuthService {
  async register(name, email, password) {
    const user = await userService.createUser({ name, email, password, role: 'USER' });
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { token, user };
  }

  async login(email, password) {
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Credenciais inválidas');
    }

    const normalizedEmail = email.toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: this.getSafeUser(user)
    };
  }

  generateToken(payload) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido');
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
  }

  verifyToken(token) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido');
    }

    return jwt.verify(token, jwtSecret);
  }

  async forgotPassword(email) {
    const normalizedEmail = (email || '').toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);

    // Não revela se o email existe ou não — apenas envia se existir.
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpiresAt: expiresAt }
    });

    await emailService.sendPasswordResetEmail(user.email, user.name, token);
  }

  async resetPassword(token, newPassword) {
    if (!token) {
      throw new Error('Token inválido');
    }

    const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } });

    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      throw new Error('Link de recuperação inválido ou expirado');
    }

    const hashedPassword = await userService.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null
      }
    });
  }

  async getUserById(id) {
    const user = await userService.getUserById(id);
    if (!user) {
      throw new Error('Utilizador não encontrado');
    }
    return user;
  }

  getSafeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
