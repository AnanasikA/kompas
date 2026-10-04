import { describe, expect, it } from "vitest";
import type { AppState } from "@/types";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/data/demo/accounts";
import { getCourse } from "@/data/curriculum";
import type { AppStateRepository, AuthRepository, StoredCredentials } from "@/lib/persistence";
import { sha256 } from "@/lib/services/hash";
import { buildDemoState } from "@/features/auth/demo";
import { restoreSession, signIn, signOut, signUp } from "@/features/auth/service";
import { nextLesson, unitStates } from "@/features/progress/units";

const now = new Date("2026-10-04T10:00:00");

function memoryDeps() {
  const docs = new Map<string, AppState>();
  const creds = new Map<string, StoredCredentials>();
  let session: string | null = null;
  const states: AppStateRepository = {
    load: async (id) => docs.get(id) ?? null,
    save: async (id, state) => void docs.set(id, state),
    clear: async (id) => void docs.delete(id),
  };
  const auth: AuthRepository = {
    getSession: async () => session,
    setSession: async (id) => void (session = id),
    findCredentials: async (email) => creds.get(email) ?? null,
    saveCredentials: async (c) => void creds.set(c.account.email, c),
  };
  return { auth, states, docs, creds };
}

describe("password hashing", () => {
  it("matches the SHA-256 reference vectors", () => {
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).toBe(
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
    );
  });
});

describe("accounts on one device", () => {
  it("keeps the password out of storage and checks it on login", async () => {
    const deps = memoryDeps();
    const created = await signUp(deps, " Anna.Nowak@Poczta.pl ", "kompas2026", now);
    expect(created.ok).toBe(true);
    expect(JSON.stringify([...deps.creds.values()])).not.toContain("kompas2026");

    expect(await signIn(deps, "anna.nowak@poczta.pl", "zle-haslo", now)).toEqual({ ok: false, reason: "WRONG_PASSWORD" });
    expect((await signIn(deps, "ANNA.NOWAK@poczta.pl", "kompas2026", now)).ok).toBe(true);
    expect(await signIn(deps, "ktos@poczta.pl", "kompas2026", now)).toEqual({ ok: false, reason: "UNKNOWN_ACCOUNT" });
  });

  it("does not let a second sign-up replace an existing account", async () => {
    const deps = memoryDeps();
    await signUp(deps, "anna@poczta.pl", "kompas2026", now);
    expect(await signUp(deps, "anna@poczta.pl", "inne-haslo", now)).toEqual({ ok: false, reason: "EMAIL_TAKEN" });
    expect(await signUp(deps, DEMO_ACCOUNTS[0].email, "kompas2026", now)).toEqual({ ok: false, reason: "EMAIL_TAKEN" });
  });

  it("signing out keeps each account's progress separate and intact", async () => {
    const deps = memoryDeps();
    const a = await signUp(deps, "a@poczta.pl", "haslo-a1", now);
    if (!a.ok) throw new Error("sign-up failed");
    await deps.states.save(a.state.account!.id, { ...a.state, onboardingCompleted: true, skippedUnitIds: ["x"] });
    await signOut(deps);
    expect(await restoreSession(deps, now)).toBeNull();

    await signUp(deps, "b@poczta.pl", "haslo-b1", now);
    expect((await restoreSession(deps, now))?.account?.email).toBe("b@poczta.pl");
    await signOut(deps);

    const back = await signIn(deps, "a@poczta.pl", "haslo-a1", now);
    expect(back.ok && back.state.skippedUnitIds).toEqual(["x"]);
    expect((await restoreSession(deps, now))?.account?.email).toBe("a@poczta.pl");
  });
});

describe("test accounts", () => {
  it("cover the three age modes with unique e-mails", () => {
    expect(DEMO_ACCOUNTS.map((d) => d.ageGroup).sort()).toEqual(["ADULT", "CHILD", "TEEN"]);
    expect(new Set(DEMO_ACCOUNTS.map((d) => d.email)).size).toBe(3);
  });

  it.each(DEMO_ACCOUNTS)("$email opens ready to learn, with a lesson to start", async (demo) => {
    const deps = memoryDeps();
    expect(await signIn(deps, demo.email, "nie-to-haslo", now)).toEqual({ ok: false, reason: "WRONG_PASSWORD" });
    const result = await signIn(deps, demo.email, DEMO_PASSWORD, now);
    if (!result.ok) throw new Error("demo login failed");
    const { state } = result;
    expect(state.onboardingCompleted).toBe(true);
    expect(state.user?.ageGroup).toBe(demo.ageGroup);
    expect(state.user?.currentCEFR).toBe(demo.level);
    expect(state.account?.role).toBe(demo.ageGroup === "CHILD" ? "PARENT" : "LEARNER");

    const states = unitStates(getCourse(demo.ageGroup), state.lessons, state.skippedUnitIds);
    const next = nextLesson(states);
    expect(next, "a fresh test account must have a lesson to continue").toBeTruthy();
    expect(next?.lesson.status).toBe("AVAILABLE");
  });

  it("keep their progress between logins instead of resetting", async () => {
    const deps = memoryDeps();
    const demo = DEMO_ACCOUNTS[0];
    const first = await signIn(deps, demo.email, DEMO_PASSWORD, now);
    if (!first.ok) throw new Error("demo login failed");
    await deps.states.save(demo.id, { ...first.state, user: { ...first.state.user!, xp: 120, level: 2 } });
    await signOut(deps);
    const again = await signIn(deps, demo.email, DEMO_PASSWORD, now);
    expect(again.ok && again.state.user?.xp).toBe(120);
    expect(buildDemoState(demo, now).user?.xp).toBe(0);
  });
});
