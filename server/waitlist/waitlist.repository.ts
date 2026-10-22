import "server-only";

import { BaseRepository } from "@/server/shared/base.repository";

/**
 * Data access for the public waitlist.
 *
 * The request role cannot read or write the table directly. It can only call
 * `join_waitlist`, which returns whether an insert occurred without exposing
 * existing subscriber data.
 */
export class WaitlistRepository extends BaseRepository {
  constructor() {
    // Public submissions do not have an authenticated user identity.
    super("");
  }

  /** Insert an address once and keep duplicate detection inside the server. */
  async insertIfNew(email: string): Promise<boolean> {
    const row = await this.queryOne<{ inserted: boolean }>(
      (txn) => txn`
        select join_waitlist(${email}) as inserted`
    );

    return row?.inserted ?? false;
  }
}
