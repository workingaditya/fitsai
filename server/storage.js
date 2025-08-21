import { profiles, userRoles } from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

export class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(profiles).where(eq(profiles.id, id));
    return user || undefined;
  }

  async getUserByEmail(email) {
    const [user] = await db.select().from(profiles).where(eq(profiles.userId, email));
    return user || undefined;
  }

  async createUser(insertUser) {
    const [user] = await db
      .insert(profiles)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserRoles(userId) {
    const roles = await db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
    return roles.map(r => r.role);
  }
}

export const storage = new DatabaseStorage();