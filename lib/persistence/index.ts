import { LocalStorageAuthRepository, LocalStorageStateRepository } from "./local-storage";
import type { AppStateRepository, AuthRepository } from "./repository";

export type { AppStateRepository, AuthRepository, StoredCredentials } from "./repository";
export { STATE_VERSION } from "./local-storage";

/** The one place that decides where learner data and accounts live. */
export const appStateRepository: AppStateRepository = new LocalStorageStateRepository();
export const authRepository: AuthRepository = new LocalStorageAuthRepository();
