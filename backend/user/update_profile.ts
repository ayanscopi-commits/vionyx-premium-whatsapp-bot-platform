import { api, APIError } from "encore.dev/api";
import db from "../db";
import * as bcrypt from "bcryptjs";

export interface UpdateProfileRequest {
  userId: number;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
}

// Updates the user's profile information.
export const updateProfile = api<UpdateProfileRequest, UpdateProfileResponse>(
  { expose: true, method: "PUT", path: "/user/:userId" },
  async (req) => {
    const user = await db.queryRow`
      SELECT id FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    if (req.email) {
      const existingEmail = await db.queryRow`
        SELECT id FROM users WHERE email = ${req.email} AND id != ${req.userId}
      `;
      if (existingEmail) {
        throw APIError.alreadyExists("email already in use");
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (req.name) {
      updates.push("name = $" + (values.length + 1));
      values.push(req.name);
    }

    if (req.email) {
      updates.push("email = $" + (values.length + 1));
      values.push(req.email);
    }

    if (req.password) {
      const hashedPassword = await bcrypt.hash(req.password, 10);
      updates.push("password = $" + (values.length + 1));
      values.push(hashedPassword);
    }

    if (req.avatar !== undefined) {
      updates.push("avatar = $" + (values.length + 1));
      values.push(req.avatar);
    }

    if (updates.length > 0) {
      values.push(req.userId);
      const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length}`;
      await db.rawExec(query, ...values);
    }

    return { success: true };
  }
);
