import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

const profileService = new ProfileService();

/**
 * Controller de Perfil.
 */
export class ProfileController {
  /**
   * GET /api/profile
   */
  getProfile(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const profile = profileService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * PUT /api/profile
   */
  updateName(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Nome é obrigatório.' });
        return;
      }

      const profile = profileService.updateName(userId, name);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * PUT /api/profile/password
   */
  changePassword(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
        return;
      }

      profileService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
