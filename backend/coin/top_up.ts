import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface TopUpRequest {
  userId: number;
  amount: number;
  method: string;
}

export interface TopUpResponse {
  id: number;
  amount: number;
  status: string;
}

// Creates a new top-up request for the user.
export const topUp = api<TopUpRequest, TopUpResponse>(
  { expose: true, method: "POST", path: "/coin/top-up" },
  async (req) => {
    if (req.amount <= 0) {
      throw APIError.invalidArgument("amount must be positive");
    }

    const topup = await db.queryRow<{
      id: number;
      amount: number;
      status: string;
    }>`
      INSERT INTO topups (user_id, amount, method, status)
      VALUES (${req.userId}, ${req.amount}, ${req.method}, 'success')
      RETURNING id, amount, status
    `;

    if (!topup) {
      throw APIError.internal("failed to create top-up");
    }

    await db.exec`
      UPDATE users
      SET coins = coins + ${req.amount}
      WHERE id = ${req.userId}
    `;

    return topup;
  }
);
