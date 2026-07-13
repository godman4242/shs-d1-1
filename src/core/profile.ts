/**
 * profile.ts (Stage 3 M4) — the profile seam's core half: XP accrual that
 * drives levelUp through the M2 curve, and the strict validator that is the
 * ONLY door back into core for persisted data. Pure, zero literals; the
 * game/ boundary (game/profileStore.ts) owns localStorage and must route
 * every load through sanitizeProgression.
 *
 * Validator policy (M1-review deferral, flagged): REJECT, don't repair — a
 * save that fails any check returns null and the boundary starts a fresh
 * profile. Includes the cross-field invariants a hand-edited save breaks:
 * level must equal levelForXp(xp) (veto = re-derive level instead), and a
 * first-run (danRank 0) save can't exceed the SP cap.
 */
import { FIRST_RUN_SP_CAP, MAX_DAN_RANK } from '../config/economy';
import { ONE, ZERO } from '../config/nums';
import {
  ELEMENTS,
  levelUp,
  type ElementId,
  type Pool,
  type Progression,
} from './progression';
import { levelForXp } from './xp';

/**
 * Accrue cumulative XP and apply one levelUp per threshold crossed (the
 * original's per-level modal: +1 SP, +3 stat, full refill — M1). Junk is
 * ignored, never thrown: non-integer/negative amounts and overflow past
 * Number range leave the record unchanged (same policy as accrueCoins).
 */
export const accrueXp = (p: Progression, amount: number): Progression => {
  if (!Number.isInteger(amount) || amount < ZERO) return p;
  const xp = p.xp + amount;
  // SAFE-integer bound, not just finite: exactness dies past MAX_SAFE_INTEGER,
  // and levelForXp's incremental walk must stay bounded (an unbounded total
  // hung the suite — the walk is O(√xp)).
  if (!Number.isSafeInteger(xp)) return p;
  const target = levelForXp(xp); // computed ONCE — not per levelUp iteration
  let out: Progression = { ...p, xp };
  while (out.level < target) out = levelUp(out);
  return out;
};

/** A finite number (narrowing helper for unknown JSON). */
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
/** A non-negative SAFE integer — unsafe totals (e.g. a hostile save's
 * xp: 1e300) would both lose exactness and unbound levelForXp's walk. */
const isCount = (v: unknown): v is number => isNum(v) && Number.isSafeInteger(v) && v >= ZERO;

/** Validate one pool shape: finite numbers, positive ceiling, current in range. */
const readPool = (v: unknown): Pool | null => {
  if (typeof v !== 'object' || v === null) return null;
  const { current, max } = v as Record<string, unknown>;
  if (!isNum(current) || !isNum(max)) return null;
  if (max <= ZERO || current < ZERO || current > max) return null;
  return { current, max };
};

/**
 * Rebuild a Progression from untrusted data (a localStorage read). Returns a
 * NEW object built field-by-field — unknown keys are stripped, nothing from
 * the input is referenced — or null if ANY check fails.
 */
export const sanitizeProgression = (raw: unknown): Progression | null => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;

  const { level, danRank, skillPoints, statPoints, xp, coins, gold } = r;
  if (!isCount(level) || level < ONE) return null;
  if (!isCount(danRank) || danRank > MAX_DAN_RANK) return null;
  if (!isCount(skillPoints) || !isCount(statPoints)) return null;
  if (!isCount(xp) || !isCount(coins) || !isCount(gold)) return null;

  if (typeof r.elemental !== 'object' || r.elemental === null) return null;
  const rawElemental = r.elemental as Record<string, unknown>;
  const elemental = {} as Record<ElementId, number>;
  for (const el of ELEMENTS) {
    const points = rawElemental[el];
    if (!isCount(points)) return null;
    elemental[el] = points;
  }

  const hp = readPool(r.hp);
  const chi = readPool(r.chi);
  const ap = readPool(r.ap);
  if (hp === null || chi === null || ap === null) return null;

  // Cross-field invariants no transition sequence can violate.
  if (level !== levelForXp(xp)) return null;
  if (danRank === ZERO && skillPoints > FIRST_RUN_SP_CAP) return null;

  return { level, danRank, skillPoints, statPoints, xp, coins, gold, elemental, hp, chi, ap };
};
