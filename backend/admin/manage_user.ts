import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface ManageUserRequest {
  userId: number;
  action: string;
  coins?: number;
}

export interface ManageUserResponse {
  success: boolean;
}

// Manages a user's account (edit coins, delete, etc).
export const manageUser = api<ManageUserRequest, ManageUserResponse>(
  { expose: true, method: "POST", path: "/admin/manage-user" },
  async (req) => {
    if (req.action === "add-coins" && req.coins !== undefined) {
      await db.exec`
        UPDATE users
        SET coins = coins + ${req.coins}
        WHERE id = ${req.userId}
      `;
    } else if (req.action === "subtract-coins" && req.coins !== undefined) {
      await db.exec`
        UPDATE users
        SET coins = GREATEST(0, coins - ${req.coins})
        WHERE id = ${req.userId}
      `;
    } else if (req.action === "delete") {
      await db.exec`
        DELETE FROM users WHERE id = ${req.userId}
      `;
    } else {
      throw APIError.invalidArgument("invalid action");
    }

    return { success: true };
  }
);
