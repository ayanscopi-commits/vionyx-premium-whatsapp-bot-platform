import { api } from "encore.dev/api";
import db from "../db";

export interface ListBotsRequest {
  userId: number;
}

export interface Bot {
  id: number;
  name: string;
  type: string;
  groupsCount: number;
  price: number;
  expiresAt: Date;
  createdAt: Date;
  status: string;
}

export interface ListBotsResponse {
  bots: Bot[];
}

// Retrieves all bots owned by the user.
export const listBots = api<ListBotsRequest, ListBotsResponse>(
  { expose: true, method: "GET", path: "/bot/list/:userId" },
  async (req) => {
    const rows = await db.queryAll<{
      id: number;
      name: string;
      type: string;
      groups_count: number;
      price: number;
      expires_at: Date;
      created_at: Date;
      status: string;
    }>`
      SELECT id, name, type, groups_count, price, expires_at, created_at, status
      FROM bots
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;

    return {
      bots: rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        groupsCount: row.groups_count,
        price: row.price,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
        status: row.status,
      })),
    };
  }
);
