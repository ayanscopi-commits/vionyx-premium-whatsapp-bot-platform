import { api, APIError } from "encore.dev/api";
import db from "../db";
import * as bcrypt from "bcryptjs";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  coins: number;
}

// Registers a new user account.
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    const existingUser = await db.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("email already registered");
    }

    const hashedPassword = await bcrypt.hash(req.password, 10);

    const user = await db.queryRow<{
      id: number;
      email: string;
      name: string;
      coins: number;
    }>`
      INSERT INTO users (email, password, name, role, coins)
      VALUES (${req.email}, ${hashedPassword}, ${req.name}, 'user', 0)
      RETURNING id, email, name, coins
    `;

    if (!user) {
      throw APIError.internal("failed to create user");
    }

    return user;
  }
);
