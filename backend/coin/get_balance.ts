import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface GetBalanceRequest {
  userId: number;
}

export interface GetBalanceResponse {
  coins: number;
}

// Retrieves the user's current coin balance.
export const getBalance = api<GetBalanceRequest, GetBalanceResponse>(
  { expose: true, method: "GET", path: "/coin/balance/:userId" },
  async (req) => {
    const user = await db.queryRow<{ coins: number }>`
      SELECT coins FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return { coins: user.coins };
  }
);
