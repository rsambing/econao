import bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';
import prisma from '../lib/prisma.js';

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const { currentPassword, ...data } = req.body;

      // Alterar email ou senha exige confirmar a senha atual.
      if (data.email !== undefined || data.password !== undefined) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Indica a senha atual para alterar email ou senha.' });
        }
        const me = await prisma.user.findUnique({ where: { id: req.user.id } });
        const valid = await bcrypt.compare(currentPassword, me.password);
        if (!valid) {
          return res.status(401).json({ error: 'Senha atual incorreta.' });
        }
      }

      const user = await userService.updateUser(req.user.id, data);
      res.status(200).json(user);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Esse email já está em uso.' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      // Resposta genérica — não revela se o email existe.
      res.status(200).json({ message: 'Se o email existir, foi enviado um link de recuperação.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
