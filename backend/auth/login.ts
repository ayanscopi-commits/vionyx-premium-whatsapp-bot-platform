import { api, APIError } from "encore.dev/api";
import db from "../db";
import * as bcrypt from "bcryptjs";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  coins: number;
  avatar: string | null;
  token: string;
}

// Authenticates a user and returns their information.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    const user = await db.queryRow<{
      id: number;
      email: string;
      name: string;
      password: string;
      role: string;
      coins: number;
      avatar: string | null;
    }>`
      SELECT id, email, name, password, role, coins, avatar
      FROM users
      WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.unauthenticated("invalid email or password");
    }

    const validPassword = await bcrypt.compare(req.password, user.password);
    if (!validPassword) {
      throw APIError.unauthenticated("invalid email or password");
    }

    const token = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString("base64");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      coins: user.coins,
      avatar: user.avatar,
      token,
    };
  }
);
