import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface ExtendBotRequest {
  botId: number;
  userId: number;
  days: number;
}

export interface ExtendBotResponse {
  success: boolean;
  newExpiresAt: Date;
}

// Extends the expiration date of a bot subscription.
export const extendBot = api<ExtendBotRequest, ExtendBotResponse>(
  { expose: true, method: "POST", path: "/bot/extend" },
  async (req) => {
    const bot = await db.queryRow<{
      user_id: number;
      groups_count: number;
      expires_at: Date;
    }>`
      SELECT user_id, groups_count, expires_at
      FROM bots
      WHERE id = ${req.botId}
    `;

    if (!bot) {
      throw APIError.notFound("bot not found");
    }

    if (bot.user_id !== req.userId) {
      throw APIError.permissionDenied("not your bot");
    }

    const pricePerGroup = 10;
    const totalPrice = bot.groups_count * pricePerGroup * (req.days / 7);

    const user = await db.queryRow<{ coins: number }>`
      SELECT coins FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    if (user.coins < totalPrice) {
      throw APIError.failedPrecondition("insufficient coins");
    }

    const newExpiresAt = new Date(bot.expires_at);
    newExpiresAt.setDate(newExpiresAt.getDate() + req.days);

    await db.exec`
      UPDATE bots
      SET expires_at = ${newExpiresAt}
      WHERE id = ${req.botId}
    `;

    await db.exec`
      UPDATE users
      SET coins = coins - ${totalPrice}
      WHERE id = ${req.userId}
    `;

    return { success: true, newExpiresAt };
  }
);
