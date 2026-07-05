import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

/**
 * Como `authenticate`, mas nunca bloqueia o pedido.
 * Se houver um token válido define `req.user`; caso contrário segue em frente
 * sem utilizador. Usado em rotas públicas que precisam de saber se o
 * visitante tem conta (ex.: conteúdo Jindungo/exclusivo).
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      req.user = authService.verifyToken(token);
    }
  } catch {
    // Token ausente/inválido — segue como visitante anónimo.
  }
  next();
};
