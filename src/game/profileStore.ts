/**
 * profileStore (Stage 3 M4) — the ONLY place in the codebase that touches
 * localStorage. Every load routes through core's sanitizeProgression
 * (reject-don't-repair: a corrupt save silently starts a fresh profile).
 * Profile pool maxes come from config/profile (A-00 guest-start CONTRACT).
 * DEV-clearable: `localStorage.removeItem('sshd.profile.v1')` in DevTools,
 * or clearProfile() via the dev seam.
 */
import { PROFILE_START_POOLS } from '../config/profile';
import { sanitizeProgression } from '../core/profile';
import { initProgression, type Progression } from '../core/progression';

/** Versioned storage key — bump the suffix on breaking schema changes. */
const STORAGE_KEY = 'sshd.profile.v1';

export const freshProfile = (): Progression => initProgression(PROFILE_START_POOLS);

/** Load the saved profile, or a fresh one if absent/corrupt/unreadable. */
export const loadProfile = (): Progression => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return freshProfile();
    return sanitizeProgression(JSON.parse(raw)) ?? freshProfile();
  } catch {
    // Unavailable storage (privacy mode) or unparseable JSON → fresh run.
    return freshProfile();
  }
};

export const saveProfile = (p: Progression): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Storage full/unavailable: the run simply won't persist — never crash.
  }
};

/** DEV verification hook — wipes the save (used by the browser gate). */
export const clearProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
};
