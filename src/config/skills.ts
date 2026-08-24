/**
 * SKILL CONSTANTS — pure data, no logic (Stage 2 M3; re-sourced in lane L2).
 *
 * These are the duel prototype's three hotbar verbs, in MILLISECONDS. The full
 * table — all 75 skills × 182 level rows, in the source's own SECONDS — lives in
 * `ogSkills.ts`, transcribed by `scripts/payload/transcribeSkills.py` and
 * byte-checked against the payload by `tests/ogSkillData.test.ts`.
 *
 * The values below are NOT hand-picked: `tests/ogSkillData.test.ts` asserts each
 * one equals its `OG_SKILLS` level-1 `cooldownS` × 1000, so drift fails the suite.
 * They are literals here only because `src/config/` may hold no logic.
 *
 * Chi COSTS still live in `ogSkills.ts` alone — the Chi meter is not wired to the
 * duel yet, so importing costs here would imply a system that does not exist.
 */
import type { SkillVerb } from './combat-sim';

export const SKILL_COOLDOWN_MS: Record<SkillVerb, number> = {
  /**
   * CONTRACT-SRC — Chi Punch (skill 1042), every level: `<cooldown>5</cooldown>`.
   * Was 4960, read off-screen at A-02 t=7:05 and labelled CONTRACT. The payload
   * states 5 s outright, and GAUNTLET.md §1 is explicit that a frame-counted
   * number loses to one the payload states. 4.96 s is what a 5.00 s timer looks
   * like quantized to the HUD's frame cadence.
   */
  chiPunch: 5000,
  /**
   * CONTRACT-SRC — Smoke Bomb (skill 1010) level 1: `<cooldown>6</cooldown>`.
   * Was an INFERRED 7960 from a ".96 pattern" that had no source basis.
   * ⚠️ The OG's cooldown DROPS with skill level (6 / 6 / 5); the duel has no
   * skill levels yet, so this is level 1. See `OG_SKILLS` for the full curve.
   */
  smokeBomb: 6000,
  /**
   * ⚠️ DIVERGENCE (authored) — NOT an original value, and no longer INFERRED.
   * The original's Stab (skill 1018) is a PASSIVE Heavy-stance skill with no
   * cooldown at all, and its Deflect skills (1036/1037/1038) are passives too.
   * Our `stab` is a cooldown-gated deflect window that swats kunai — a mechanic
   * the OG does not have, so there is no OG number to source. 920 ms is ours.
   * Logged in DIVERGENCES.md. Veto = drop the verb and model Stab as a passive,
   * which is an L5 change to Sim, not a config edit.
   */
  stab: 920,
};
