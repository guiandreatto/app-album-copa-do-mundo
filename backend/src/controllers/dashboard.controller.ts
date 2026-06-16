import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

/**
 * Controller do Dashboard.
 */
export class DashboardController {
  /**
   * GET /api/dashboard
   */
  getStats(req: Request, res: Response): void {
    try {
      const userId = req.userId!;
      const stats = dashboardService.getStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
