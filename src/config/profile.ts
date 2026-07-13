/**
 * PROFILE CONSTANTS — pure data, no logic (Stage 3 M4). Double-entered in
 * tests/config-values.test.ts.
 *
 * CONTRACT (A-00 guest start, frame-backed): a fresh Level-1 character reads
 * HP 10, CHI 10, AP 30 on the Player sheet. These are the PROFILE pool maxes
 * (overworld/UI state, Stage 4+) — the duel prototype's in-fight pools stay
 * the combat-sim seeds (PLAYER_BASE hp 100, CHI_MAX 100), which are
 * prototype-scaled and separately flagged. The A-00 guest currencies
 * (100 coins / 3 gold) are deliberately NOT seeded here — they belong to the
 * Stage-4 login/guest flow, not the duel accrual seam (session log
 * 2026-07-13; veto = seed them in freshProfile now).
 */

/** CONTRACT (A-00) — fresh-profile pool maxes: HP / CHI / AP. */
export const PROFILE_START_POOLS = { hp: 10, chi: 10, ap: 30 };
