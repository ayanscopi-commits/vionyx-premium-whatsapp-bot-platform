import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface PurchaseRequest {
  userId: number;
  name: string;
  type: string;
  groupsCount: number;
  days: number;
}

export interface PurchaseResponse {
  id: number;
  name: string;
  expiresAt: Date;
}

// Purchases a new bot subscription for the user.
export const purchase = api<PurchaseRequest, PurchaseResponse>(
  { expose: true, method: "POST", path: "/bot/purchase" },
  async (req) => {
    const pricePerGroup = 10;
    const totalPrice = req.groupsCount * pricePerGroup * (req.days / 7);

    const user = await db.queryRow<{ coins: number }>`
      SELECT coins FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    if (user.coins < totalPrice) {
      throw APIError.failedPrecondition("insufficient coins");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + req.days);

    const bot = await db.queryRow<{
      id: number;
      name: string;
      expires_at: Date;
    }>`
      INSERT INTO bots (user_id, name, type, groups_count, price, expires_at, status)
      VALUES (${req.userId}, ${req.name}, ${req.type}, ${req.groupsCount}, ${totalPrice}, ${expiresAt}, 'active')
      RETURNING id, name, expires_at
    `;

    if (!bot) {
      throw APIError.internal("failed to create bot");
    }

    await db.exec`
      UPDATE users
      SET coins = coins - ${totalPrice}
      WHERE id = ${req.userId}
    `;

    return {
      id: bot.id,
      name: bot.name,
      expiresAt: bot.expires_at,
    };
  }
);
