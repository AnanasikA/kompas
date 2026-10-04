import type { AppState } from "@/types";
import { DEMO_PASSWORD } from "@/data/demo/accounts";
import type { AppStateRepository, AuthRepository } from "@/lib/persistence";
import { hashPassword } from "@/lib/services/hash";
import { uid } from "@/lib/utils";
import { initialState } from "@/lib/store/initial";
import { buildDemoState, findDemoByEmail, findDemoById } from "./demo";

/**
 * ACCOUNTS ON THIS DEVICE
 *
 * Several accounts can live side by side; each keeps its own document, and
 * signing out never deletes anything. The functions take the repositories as
 * arguments, so the same rules run against localStorage today and against a
 * server later (where the password check moves to the backend).
 */

export type AuthFailure = "EMAIL_TAKEN" | "UNKNOWN_ACCOUNT" | "WRONG_PASSWORD";
export type AuthResult = { ok: true; state: AppState } | { ok: false; reason: AuthFailure };

export interface AuthDeps {
  auth: AuthRepository;
  states: AppStateRepository;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function signUp(deps: AuthDeps, emailInput: string, password: string, now: Date): Promise<AuthResult> {
  const email = normalizeEmail(emailInput);
  if (findDemoByEmail(email) || (await deps.auth.findCredentials(email))) return { ok: false, reason: "EMAIL_TAKEN" };
  const account = { id: uid("acc"), email, role: "LEARNER" as const, createdAt: now.toISOString() };
  const state: AppState = { ...initialState, account };
  await deps.auth.saveCredentials({ account, salt: account.id, passwordHash: hashPassword(password, account.id) });
  await deps.states.save(account.id, state);
  await deps.auth.setSession(account.id);
  return { ok: true, state };
}

export async function signIn(deps: AuthDeps, emailInput: string, password: string, now: Date): Promise<AuthResult> {
  const email = normalizeEmail(emailInput);

  const demo = findDemoByEmail(email);
  if (demo) {
    if (password !== DEMO_PASSWORD) return { ok: false, reason: "WRONG_PASSWORD" };
    const state = (await deps.states.load(demo.id)) ?? buildDemoState(demo, now);
    await deps.states.save(demo.id, state);
    await deps.auth.setSession(demo.id);
    return { ok: true, state };
  }

  const credentials = await deps.auth.findCredentials(email);
  if (!credentials) return { ok: false, reason: "UNKNOWN_ACCOUNT" };
  if (credentials.passwordHash === null) {
    // Account from before passwords were kept: the first login sets it.
    await deps.auth.saveCredentials({ ...credentials, passwordHash: hashPassword(password, credentials.salt) });
  } else if (credentials.passwordHash !== hashPassword(password, credentials.salt)) {
    return { ok: false, reason: "WRONG_PASSWORD" };
  }
  const state = (await deps.states.load(credentials.account.id)) ?? { ...initialState, account: credentials.account };
  await deps.auth.setSession(credentials.account.id);
  return { ok: true, state };
}

/** The signed-in account's document, or `null` when nobody is signed in. */
export async function restoreSession(deps: AuthDeps, now: Date): Promise<AppState | null> {
  const accountId = await deps.auth.getSession();
  if (!accountId) return null;
  const saved = await deps.states.load(accountId);
  if (saved) return saved;
  const demo = findDemoById(accountId);
  if (demo) return buildDemoState(demo, now);
  await deps.auth.setSession(null);
  return null;
}

export async function signOut(deps: AuthDeps): Promise<void> {
  await deps.auth.setSession(null);
}
