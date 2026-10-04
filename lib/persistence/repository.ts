import type { Account, AppState } from "@/types";

/**
 * Persistence boundary.
 *
 * The store only talks to these two interfaces. Today both are backed by
 * localStorage; moving to a real backend means writing other implementations
 * (e.g. `ApiStateRepository` calling /api/state, `ApiAuthRepository` calling
 * the auth provider) and changing `lib/persistence/index.ts`. All methods are
 * async for that reason.
 */

/** One document per account: profile, progress, reviews, activity. */
export interface AppStateRepository {
  load(accountId: string): Promise<AppState | null>;
  save(accountId: string, state: AppState): Promise<void>;
  clear(accountId: string): Promise<void>;
}

export interface StoredCredentials {
  account: Account;
  salt: string;
  /** `null` for accounts created before passwords were kept: set on next login. */
  passwordHash: string | null;
}

/** Who exists and who is signed in. A backend replaces this with real sessions. */
export interface AuthRepository {
  /** Account id of the learner signed in on this device, if any. */
  getSession(): Promise<string | null>;
  setSession(accountId: string | null): Promise<void>;
  findCredentials(email: string): Promise<StoredCredentials | null>;
  saveCredentials(credentials: StoredCredentials): Promise<void>;
}
