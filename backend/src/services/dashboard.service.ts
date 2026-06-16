import db from '../database/db';
import { DashboardStats, CountryProgress } from '../models/interfaces';

/**
 * Service do Dashboard.
 * Calcula estatísticas e progresso do álbum.
 */
export class DashboardService {
  /**
   * Retorna as estatísticas completas do álbum do usuário.
   */
  getStats(userId: number): DashboardStats {
    // Total de figurinhas do álbum
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM stickers').get() as { count: number };
    const total = totalResult.count;

    // Figurinhas obtidas (quantity >= 1)
    const obtainedResult = db.prepare(
      'SELECT COUNT(*) as count FROM user_stickers WHERE user_id = ? AND quantity >= 1'
    ).get(userId) as { count: number };
    const obtained = obtainedResult.count;

    // Figurinhas faltantes
    const missing = total - obtained;

    // Figurinhas repetidas (soma das quantidades excedentes)
    const repeatedResult = db.prepare(
      'SELECT COALESCE(SUM(quantity - 1), 0) as count FROM user_stickers WHERE user_id = ? AND quantity > 1'
    ).get(userId) as { count: number };
    const repeated = repeatedResult.count;

    // Percentual de conclusão
    const completionPercentage = total > 0 ? parseFloat(((obtained / total) * 100).toFixed(1)) : 0;

    // Progresso por seleção
    const countryProgress = this.getCountryProgress(userId);

    return {
      total,
      obtained,
      missing,
      repeated,
      completionPercentage,
      countryProgress,
    };
  }

  /**
   * Calcula o progresso de cada seleção.
   */
  private getCountryProgress(userId: number): CountryProgress[] {
    const progress = db.prepare(`
      SELECT
        s.country,
        COUNT(s.id) as total,
        SUM(CASE WHEN COALESCE(us.quantity, 0) >= 1 THEN 1 ELSE 0 END) as obtained
      FROM stickers s
      LEFT JOIN user_stickers us ON s.id = us.sticker_id AND us.user_id = ?
      GROUP BY s.country
      ORDER BY s.country ASC
    `).all(userId) as { country: string; total: number; obtained: number }[];

    return progress.map((p) => ({
      country: p.country,
      obtained: p.obtained,
      total: p.total,
      completed: p.obtained === p.total,
    }));
  }
}
