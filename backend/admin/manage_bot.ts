import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface ManageBotRequest {
  botId: number;
  action: string;
  days?: number;
}

export interface ManageBotResponse {
  success: boolean;
}

// Manages a bot (extend, deactivate) from admin panel.
export const manageBot = api<ManageBotRequest, ManageBotResponse>(
  { expose: true, method: "POST", path: "/admin/manage-bot" },
  async (req) => {
    if (req.action === "extend" && req.days !== undefined) {
      const bot = await db.queryRow<{ expires_at: Date }>`
        SELECT expires_at FROM bots WHERE id = ${req.botId}
      `;

      if (!bot) {
        throw APIError.notFound("bot not found");
      }

      const newExpiresAt = new Date(bot.expires_at);
      newExpiresAt.setDate(newExpiresAt.getDate() + req.days);

      await db.exec`
        UPDATE bots
        SET expires_at = ${newExpiresAt}
        WHERE id = ${req.botId}
      `;
    } else if (req.action === "deactivate") {
      await db.exec`
        UPDATE bots
        SET status = 'inactive'
        WHERE id = ${req.botId}
      `;
    } else if (req.action === "activate") {
      await db.exec`
        UPDATE bots
        SET status = 'active'
        WHERE id = ${req.botId}
      `;
    } else {
      throw APIError.invalidArgument("invalid action");
    }

    return { success: true };
  }
);
