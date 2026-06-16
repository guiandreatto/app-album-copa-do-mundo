import db from '../database/db';
import { Sticker } from '../models/interfaces';

/**
 * Service de figurinhas do álbum.
 */
export class StickerService {
  /**
   * Lista todas as figurinhas com filtros opcionais.
   */
  getAll(filter?: string, search?: string, country?: string): Sticker[] {
    let query = 'SELECT * FROM stickers WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (player_name LIKE ? OR country LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (country) {
      query += ' AND country = ?';
      params.push(country);
    }

    query += ' ORDER BY sticker_number ASC';

    return db.prepare(query).all(...params) as Sticker[];
  }

  /**
   * Busca figurinhas por nome ou país.
   */
  search(term: string): Sticker[] {
    return db.prepare(
      'SELECT * FROM stickers WHERE player_name LIKE ? OR country LIKE ? ORDER BY sticker_number ASC'
    ).all(`%${term}%`, `%${term}%`) as Sticker[];
  }

  /**
   * Lista todos os países disponíveis.
   */
  getCountries(): string[] {
    const result = db.prepare(
      'SELECT DISTINCT country FROM stickers ORDER BY country ASC'
    ).all() as { country: string }[];

    return result.map((r) => r.country);
  }
}
