import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface DeactivateBotRequest {
  botId: number;
  userId: number;
}

export interface DeactivateBotResponse {
  success: boolean;
}

// Deactivates a bot subscription.
export const deactivateBot = api<DeactivateBotRequest, DeactivateBotResponse>(
  { expose: true, method: "POST", path: "/bot/deactivate" },
  async (req) => {
    const bot = await db.queryRow<{ user_id: number }>`
      SELECT user_id FROM bots WHERE id = ${req.botId}
    `;

    if (!bot) {
      throw APIError.notFound("bot not found");
    }

    if (bot.user_id !== req.userId) {
      throw APIError.permissionDenied("not your bot");
    }

    await db.exec`
      UPDATE bots
      SET status = 'inactive'
      WHERE id = ${req.botId}
    `;

    return { success: true };
  }
);
