import { api, APIError } from "encore.dev/api";
import db from "../db";
import * as bcrypt from "bcryptjs";

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

// Resets the user's password.
export const resetPassword = api<ResetPasswordRequest, ResetPasswordResponse>(
  { expose: true, method: "POST", path: "/auth/reset-password" },
  async (req) => {
    const user = await db.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    const hashedPassword = await bcrypt.hash(req.newPassword, 10);

    await db.exec`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE email = ${req.email}
    `;

    return { success: true };
  }
);
