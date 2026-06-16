import db from '../database/db';
import { StickerWithQuantity } from '../models/interfaces';

/**
 * Service de figurinhas do usuário.
 * Gerencia a coleção pessoal do usuário.
 */
export class UserStickerService {
  /**
   * Lista todas as figurinhas do usuário com quantidades.
   * Permite filtros: 'all', 'obtained', 'missing'
   */
  getUserStickers(userId: number, filter?: string, search?: string): StickerWithQuantity[] {
    let query = `
      SELECT s.*, COALESCE(us.quantity, 0) as quantity, us.id as user_sticker_id
      FROM stickers s
      LEFT JOIN user_stickers us ON s.id = us.sticker_id AND us.user_id = ?
      WHERE 1=1
    `;
    const params: any[] = [userId];

    if (filter === 'obtained') {
      query += ' AND COALESCE(us.quantity, 0) >= 1';
    } else if (filter === 'missing') {
      query += ' AND COALESCE(us.quantity, 0) = 0';
    }

    if (search) {
      query += ' AND (s.player_name LIKE ? OR s.country LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY s.sticker_number ASC';

    return db.prepare(query).all(...params) as StickerWithQuantity[];
  }

  /**
   * Atualiza a quantidade de uma figurinha do usuário.
   */
  updateQuantity(userId: number, stickerId: number, quantity: number): StickerWithQuantity {
    if (quantity < 0) {
      throw new Error('A quantidade não pode ser negativa.');
    }

    // Verifica se a figurinha existe
    const sticker = db.prepare('SELECT id FROM stickers WHERE id = ?').get(stickerId);
    if (!sticker) {
      throw new Error('Figurinha não encontrada.');
    }

    // Verifica se já existe o registro user_sticker
    const existing = db.prepare(
      'SELECT id FROM user_stickers WHERE user_id = ? AND sticker_id = ?'
    ).get(userId, stickerId) as { id: number } | undefined;

    if (existing) {
      db.prepare('UPDATE user_stickers SET quantity = ? WHERE id = ?').run(quantity, existing.id);
    } else {
      db.prepare(
        'INSERT INTO user_stickers (user_id, sticker_id, quantity) VALUES (?, ?, ?)'
      ).run(userId, stickerId, quantity);
    }

    // Retorna a figurinha atualizada
    const result = db.prepare(`
      SELECT s.*, us.quantity, us.id as user_sticker_id
      FROM stickers s
      JOIN user_stickers us ON s.id = us.sticker_id
      WHERE us.user_id = ? AND s.id = ?
    `).get(userId, stickerId) as StickerWithQuantity;

    return result;
  }

  /**
   * Lista apenas figurinhas repetidas (quantity > 1).
   */
  getRepeated(userId: number): StickerWithQuantity[] {
    return db.prepare(`
      SELECT s.*, us.quantity, us.id as user_sticker_id
      FROM stickers s
      JOIN user_stickers us ON s.id = us.sticker_id
      WHERE us.user_id = ? AND us.quantity > 1
      ORDER BY s.sticker_number ASC
    `).all(userId) as StickerWithQuantity[];
  }
}
