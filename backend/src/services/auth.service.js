import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from './user.service.js';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

const userService = new UserService();

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
