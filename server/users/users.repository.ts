import "server-only";

import { BaseRepository } from "@/server/shared/base.repository";

/** Row shape of `user_role`. */
interface UserRoleRow {
  role: string;
}

/** Row shape of `user_profile`. */
interface UserProfileRow {
  user_id: string;
  school: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Data access for the users domain.
 *
 * Internal to this folder — the app layer goes through `users.service.ts`.
 * Returns raw records and primitives; validation and fallbacks belong in the
 * service.
 *
 * Every query here is constrained by RLS to the user this instance was
 * constructed with, so `where user_id = …` predicates are belt-and-braces
 * rather than the thing keeping other users' rows out.
 */
export class UsersRepository extends BaseRepository {
  constructor(userId: string) {
    super(userId);
  }

  /**
   * The user's role as stored, or `null` when they have no `user_role` row.
   *
   * The absent case is normal: rows are only written when someone is promoted,
   * so every new sign-up has none.
   */
  async findRole(): Promise<string | null> {
    const row = await this.queryOne<UserRoleRow>(
      (txn) => txn`select role from user_role where user_id = ${this.userId}::uuid`
    );

    return row?.role ?? null;
  }

  /** The user's profile row, or `null` if they have not created one yet. */
  async findProfile(): Promise<UserProfileRow | null> {
    return this.queryOne<UserProfileRow>(
      (txn) => txn`select user_id, school, created_at, updated_at from user_profile`
    );
  }
}
