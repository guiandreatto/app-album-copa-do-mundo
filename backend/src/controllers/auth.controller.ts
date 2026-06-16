import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

/**
 * Controller de autenticação.
 */
export class AuthController {
  /**
   * POST /api/auth/register
   */
  register(req: Request, res: Response): void {
    try {
      const { name, email, password } = req.body;

      // Validações
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      const result = authService.register(name, email, password);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/auth/login
   */
  login(req: Request, res: Response): void {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        return;
      }

      const result = authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * PUT /api/auth/reset-password
   */
  resetPassword(req: Request, res: Response): void {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        res.status(400).json({ error: 'Email e nova senha são obrigatórios.' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      authService.resetPassword(email, newPassword);
      res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
