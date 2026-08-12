import "server-only";

import type {
  NeonQueryFunctionInTransaction,
  NeonQueryInTransaction,
} from "@neondatabase/serverless";

import { sql } from "@/config/db";

/** Tagged-template function scoped to an open transaction. */
export type Txn = NeonQueryFunctionInTransaction<false, false>;

/**
 * Base class for every domain repository.
 *
 * A repository is constructed bound to exactly one user, and every query it
 * issues runs with `app.user_id` set to that user — which is what the RLS
 * policies key on. Binding at construction rather than per call means no
 * method can forget to scope itself.
 *
 * Neon's HTTP driver is stateless: each tagged-template call is a separate
 * HTTP request, so a bare `SET` would not survive to the next query. Batching
 * into a single `transaction()` gives one connection for the whole unit, and
 * `set_config(..., true)` scopes the setting to that transaction so it cannot
 * leak into a later request on a reused connection.
 *
 * Subclasses live in their domain folder (`server/users/users.repository.ts`)
 * and are internal to it; the app layer talks to that domain's service.
 */
export abstract class BaseRepository {
  protected constructor(protected readonly userId: string) {}

  /**
   * Runs several queries in one transaction with `app.user_id` bound.
   *
   * @example
   * const [profiles, applications] = await this.transaction((txn) => [
   *   txn`select * from user_profile`,
   *   txn`select * from application`,
   * ]);
   */
  protected async transaction(
    build: (txn: Txn) => NeonQueryInTransaction[]
  ): Promise<Record<string, unknown>[][]> {
    const results = await sql.transaction((txn) => [
      txn`select set_config('app.user_id', ${this.userId}, true)`,
      ...build(txn as Txn),
    ]);

    // Drop the set_config result; callers only care about their own queries.
    return results.slice(1) as Record<string, unknown>[][];
  }

  /** Runs a single query and returns its rows. */
  protected async query<T>(build: (txn: Txn) => NeonQueryInTransaction): Promise<T[]> {
    const [rows] = await this.transaction((txn) => [build(txn)]);
    return (rows ?? []) as T[];
  }

  /** Runs a single query and returns its first row, or `null` if there is none. */
  protected async queryOne<T>(build: (txn: Txn) => NeonQueryInTransaction): Promise<T | null> {
    const rows = await this.query<T>(build);
    return rows[0] ?? null;
  }
}
