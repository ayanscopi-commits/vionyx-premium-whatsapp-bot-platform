import { api } from "encore.dev/api";
import db from "../db";

export interface AdminBot {
  id: number;
  userId: number;
  userName: string;
  name: string;
  type: string;
  groupsCount: number;
  expiresAt: Date;
  status: string;
}

export interface ListAllBotsResponse {
  bots: AdminBot[];
}

// Retrieves all bots for admin monitoring.
export const listAllBots = api<void, ListAllBotsResponse>(
  { expose: true, method: "GET", path: "/admin/bots" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      user_id: number;
      user_name: string;
      name: string;
      type: string;
      groups_count: number;
      expires_at: Date;
      status: string;
    }>`
      SELECT b.id, b.user_id, u.name as user_name, b.name, b.type, b.groups_count, b.expires_at, b.status
      FROM bots b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `;

    return {
      bots: rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        name: row.name,
        type: row.type,
        groupsCount: row.groups_count,
        expiresAt: row.expires_at,
        status: row.status,
      })),
    };
  }
);
