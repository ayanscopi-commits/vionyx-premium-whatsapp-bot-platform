import { api } from "encore.dev/api";
import db from "../db";

export interface Statistics {
  totalUsers: number;
  totalTopUps: number;
  totalActiveBots: number;
  totalRevenue: number;
}

// Retrieves platform statistics for the admin dashboard.
export const getStatistics = api<void, Statistics>(
  { expose: true, method: "GET", path: "/admin/statistics" },
  async () => {
    const userCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM users
    `;

    const topUpCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM topups WHERE status = 'success'
    `;

    const activeBotCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM bots WHERE status = 'active'
    `;

    const revenue = await db.queryRow<{ sum: number | null }>`
      SELECT SUM(amount) as sum FROM topups WHERE status = 'success'
    `;

    return {
      totalUsers: userCount?.count || 0,
      totalTopUps: topUpCount?.count || 0,
      totalActiveBots: activeBotCount?.count || 0,
      totalRevenue: revenue?.sum || 0,
    };
  }
);
