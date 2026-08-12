import "server-only";

import { DEFAULT_ROLE, isRole, type Role } from "@/lib/auth/roles";
import { UsersRepository } from "./users.repository";

/**
 * Business logic for the users domain — the entry point the app layer uses.
 *
 * Like its repository, a service instance is bound to a single user, so the
 * caller's identity is fixed for the lifetime of the object and every call on
 * it is scoped to that person.
 *
 * The repository is constructed here and kept private: nothing outside this
 * folder should reach the data layer directly.
 */
export class UserService {
  private readonly repository: UsersRepository;

  constructor(private readonly userId: string) {
    this.repository = new UsersRepository(userId);
  }

  /**
   * Resolves the user's role.
   *
   * Two things can leave the stored value unusable, and both fall back to the
   * base role rather than throwing:
   *
   * - No `user_role` row at all — the normal state for a new sign-up, which is
   *   why sign-up needs no provisioning webhook.
   * - A value that is not in `ROLES` — possible if a row is added to `app_role`
   *   without adding it to the union in `lib/auth/roles.ts`.
   *
   * Failing closed is the right call for both: an unrecognised role grants
   * nothing rather than being treated as privileged.
   */
  async getRole(): Promise<Role> {
    const role = await this.repository.findRole();
    return isRole(role) ? role : DEFAULT_ROLE;
  }

  /** The user's profile, or `null` if they have not created one yet. */
  async getProfile() {
    return this.repository.findProfile();
  }
}
