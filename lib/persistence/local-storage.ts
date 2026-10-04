import type { AppState } from "@/types";
import type { AppStateRepository, AuthRepository, StoredCredentials } from "./repository";

export const STATE_VERSION = 1;

const STATE_PREFIX = "kompas.state.";
const ACCOUNTS_KEY = "kompas.accounts";
const SESSION_KEY = "kompas.session";
/** Single-document layout used before accounts could coexist on one device. */
const LEGACY_KEY = "kompas.state";

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function read<T>(key: string): T | null {
  const raw = storage()?.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the session keeps working in memory.
  }
}

function remove(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // nothing to remove
  }
}

/** Moves the old single-account document into the per-account layout, once. */
function migrateLegacy(): void {
  const legacy = read<AppState>(LEGACY_KEY);
  if (!legacy) return;
  remove(LEGACY_KEY);
  if (legacy.version !== STATE_VERSION || !legacy.account) return;
  const accounts = read<Record<string, StoredCredentials>>(ACCOUNTS_KEY) ?? {};
  if (accounts[legacy.account.email]) return;
  accounts[legacy.account.email] = { account: legacy.account, salt: legacy.account.id, passwordHash: null };
  write(ACCOUNTS_KEY, accounts);
  write(STATE_PREFIX + legacy.account.id, legacy);
  write(SESSION_KEY, legacy.account.id);
}

/** Browser localStorage implementation. Safe to construct on the server. */
export class LocalStorageStateRepository implements AppStateRepository {
  async load(accountId: string): Promise<AppState | null> {
    migrateLegacy();
    const parsed = read<AppState>(STATE_PREFIX + accountId);
    // Unknown or older shape: start clean rather than crash on missing fields.
    return parsed && parsed.version === STATE_VERSION ? parsed : null;
  }

  async save(accountId: string, state: AppState): Promise<void> {
    write(STATE_PREFIX + accountId, state);
  }

  async clear(accountId: string): Promise<void> {
    remove(STATE_PREFIX + accountId);
  }
}

export class LocalStorageAuthRepository implements AuthRepository {
  async getSession(): Promise<string | null> {
    migrateLegacy();
    return read<string>(SESSION_KEY);
  }

  async setSession(accountId: string | null): Promise<void> {
    if (accountId) write(SESSION_KEY, accountId);
    else remove(SESSION_KEY);
  }

  async findCredentials(email: string): Promise<StoredCredentials | null> {
    migrateLegacy();
    return read<Record<string, StoredCredentials>>(ACCOUNTS_KEY)?.[email] ?? null;
  }

  async saveCredentials(credentials: StoredCredentials): Promise<void> {
    const accounts = read<Record<string, StoredCredentials>>(ACCOUNTS_KEY) ?? {};
    accounts[credentials.account.email] = credentials;
    write(ACCOUNTS_KEY, accounts);
  }
}
