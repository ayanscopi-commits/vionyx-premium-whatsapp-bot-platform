import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface GetProfileRequest {
  userId: number;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  coins: number;
  createdAt: Date;
}

// Retrieves the user's profile information.
export const getProfile = api<GetProfileRequest, UserProfile>(
  { expose: true, method: "GET", path: "/user/:userId" },
  async (req) => {
    const user = await db.queryRow<{
      id: number;
      email: string;
      name: string;
      avatar: string | null;
      role: string;
      coins: number;
      created_at: Date;
    }>`
      SELECT id, email, name, avatar, role, coins, created_at
      FROM users
      WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      coins: user.coins,
      createdAt: user.created_at,
    };
  }
);
