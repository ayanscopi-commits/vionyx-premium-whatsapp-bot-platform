import { api } from "encore.dev/api";
import db from "../db";

export interface GetHistoryRequest {
  userId: number;
}

export interface TopUpHistory {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
}

export interface GetHistoryResponse {
  topups: TopUpHistory[];
}

// Retrieves the user's top-up history.
export const getHistory = api<GetHistoryRequest, GetHistoryResponse>(
  { expose: true, method: "GET", path: "/coin/history/:userId" },
  async (req) => {
    const rows = await db.queryAll<{
      id: number;
      amount: number;
      method: string;
      status: string;
      created_at: Date;
    }>`
      SELECT id, amount, method, status, created_at
      FROM topups
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;

    return {
      topups: rows.map((row) => ({
        id: row.id,
        amount: row.amount,
        method: row.method,
        status: row.status,
        createdAt: row.created_at,
      })),
    };
  }
);
