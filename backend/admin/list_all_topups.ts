import { api } from "encore.dev/api";
import db from "../db";

export interface AdminTopUp {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
}

export interface ListAllTopUpsResponse {
  topups: AdminTopUp[];
}

// Retrieves all top-ups for admin monitoring.
export const listAllTopUps = api<void, ListAllTopUpsResponse>(
  { expose: true, method: "GET", path: "/admin/topups" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      user_id: number;
      user_name: string;
      amount: number;
      method: string;
      status: string;
      created_at: Date;
    }>`
      SELECT t.id, t.user_id, u.name as user_name, t.amount, t.method, t.status, t.created_at
      FROM topups t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;

    return {
      topups: rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        amount: row.amount,
        method: row.method,
        status: row.status,
        createdAt: row.created_at,
      })),
    };
  }
);
