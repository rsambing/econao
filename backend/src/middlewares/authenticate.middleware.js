import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token ausente ou formato inválido' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
