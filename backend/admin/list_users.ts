import { api } from "encore.dev/api";
import db from "../db";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  coins: number;
  createdAt: Date;
}

export interface ListUsersResponse {
  users: AdminUser[];
}

// Retrieves all users for admin management.
export const listUsers = api<void, ListUsersResponse>(
  { expose: true, method: "GET", path: "/admin/users" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      email: string;
      name: string;
      role: string;
      coins: number;
      created_at: Date;
    }>`
      SELECT id, email, name, role, coins, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return {
      users: rows.map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        coins: row.coins,
        createdAt: row.created_at,
      })),
    };
  }
);
