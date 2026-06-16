import { Request, Response } from 'express';
import { UserStickerService } from '../services/user-sticker.service';

const userStickerService = new UserStickerService();

/**
 * Controller de figurinhas do usuário.
 */
export class UserStickerController {
  /**
   * GET /api/user-stickers
   */
  getUserStickers(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const { filter, search } = req.query;
      const stickers = userStickerService.getUserStickers(
        userId,
        filter as string,
        search as string
      );
      res.json(stickers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/user-stickers/:stickerId
   */
  updateQuantity(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const stickerId = parseInt(req.params.stickerId as string);
      const { quantity } = req.body;

      if (isNaN(stickerId)) {
        res.status(400).json({ error: 'ID da figurinha inválido.' });
        return;
      }

      if (quantity === undefined || quantity === null) {
        res.status(400).json({ error: 'Quantidade é obrigatória.' });
        return;
      }

      const result = userStickerService.updateQuantity(userId, stickerId, quantity);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /api/user-stickers/repeated
   */
  getRepeated(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const repeated = userStickerService.getRepeated(userId);
      res.json(repeated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
