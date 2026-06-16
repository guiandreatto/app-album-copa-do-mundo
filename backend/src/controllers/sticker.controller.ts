import { Request, Response } from 'express';
import { StickerService } from '../services/sticker.service';

const stickerService = new StickerService();

/**
 * Controller de figurinhas do álbum.
 */
export class StickerController {
  /**
   * GET /api/stickers
   */
  getAll(req: Request, res: Response): void {
    try {
      const { filter, search, country } = req.query;
      const stickers = stickerService.getAll(
        filter as string,
        search as string,
        country as string
      );
      res.json(stickers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/stickers/search
   */
  search(req: Request, res: Response): void {
    try {
      const { term } = req.query;
      if (!term) {
        res.status(400).json({ error: 'Termo de busca é obrigatório.' });
        return;
      }
      const stickers = stickerService.search(term as string);
      res.json(stickers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/stickers/countries
   */
  getCountries(req: Request, res: Response): void {
    try {
      const countries = stickerService.getCountries();
      res.json(countries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
