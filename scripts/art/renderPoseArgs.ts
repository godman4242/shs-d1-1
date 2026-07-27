/**
 * THE RENDER CLI'S ARGUMENTS (SESSION20 A6.1) — parsed and VALIDATED, in a file
 * a test can reach. BUILD-TIME ONLY.
 *
 * ⛔ WHY IT IS ITS OWN FILE. This started inside `poseRaster.ts`, which imports
 * `src/game/art/fighterShapes.ts` and is therefore unreachable from any test
 * (`tests/no-game-imports.test.ts`). An adversarial review then found the exact
 * defect that placement hides: `--backdrop ff00ff` — the same value with the
 * `0x` dropped — became `NaN`, walked past `assertBackdropIsNotArt` (nothing
 * equals NaN), and `Uint32Array.fill(NaN)` coerced to 0, so the fighter rendered
 * on PURE BLACK. That is the fighter's own outline colour, and it is the one
 * case the explicit `--backdrop 0x000000` correctly refuses; a comparator
 * segmenting "everything that is not the backdrop" would have deleted the
 * outline and scored it as an improvement.
 *
 * ⇒ Every value is range-checked, and nothing is guessed. `tests/renderPoseArgs.test.ts`
 * is the gate — a validator nothing can test is not a validator.
 */

/** `idle` is the BARE doll — the unequipped fighter, which is a real game state. */
export type PoseVariant = 'idle' | 'dressed';

/**
 * Magenta. Absent from all 14 colours the committed art uses (black, five tans,
 * eight greys), maximally far from every one of them, and unmistakable in a
 * screenshot — nobody will confuse this render for a game frame.
 */
export const DEFAULT_BACKDROP = 0xff00ff;
/** 4x4 sub-pixels per pixel: 17 coverage levels, and the whole fighter in ~50 ms. */
export const DEFAULT_SUPERSAMPLE = 4;

const MAX_RGB = 0xffffff;

export interface RenderPoseArgs {
  readonly variant: PoseVariant;
  readonly out: string;
  readonly mask: string | null;
  /** Where to write the render's metadata — what the A6.2 comparator reads. */
  readonly json: string | null;
  readonly supersample: number;
  readonly backdrop: number;
  readonly full: boolean;
  readonly slots: boolean;
}

const VALUE_FLAGS = ['--out', '--mask', '--json', '--supersample', '--backdrop'] as const;
const BOOL_FLAGS = ['--full', '--slots'] as const;

/**
 * A whole number in `[min, max]`, or a thrown error naming the flag.
 *
 * `Number('ff00ff')` is `NaN` and `Number('')` is `0` — both would sail through
 * a bare `Number(...)`, and the second is worse than the first because it looks
 * like a deliberate black.
 */
function integerFlag(flag: string, raw: string, min: number, max: number): number {
  const value = Number(raw);
  if (raw.trim() === '' || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(
      `renderPose: ${flag} must be a whole number between ${String(min)} and ${String(max)} — got '${raw}'` +
        (flag === '--backdrop' ? " (a colour needs its 0x prefix: --backdrop 0xff00ff, not 'ff00ff')" : ''),
    );
  }
  return value;
}

/** Read `--flag value` pairs and bare flags. Throws on anything unrecognised. */
export function parseArgs(argv: readonly string[]): RenderPoseArgs {
  const positional: string[] = [];
  const flags = new Map<string, string>();
  const boolNames: readonly string[] = BOOL_FLAGS;
  const valueNames: readonly string[] = VALUE_FLAGS;

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === undefined) continue;
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    if (boolNames.includes(token)) {
      flags.set(token, 'true');
      continue;
    }
    if (!valueNames.includes(token)) throw new Error(`renderPose: unknown flag ${token}`);

    const value = argv[i + 1];
    if (value === undefined) throw new Error(`renderPose: ${token} needs a value`);
    // `--out --slots` would otherwise write a file literally named "--slots"
    // AND silently turn the footprint table off.
    if (value.startsWith('--')) {
      throw new Error(`renderPose: ${token} needs a value, but the next token is the flag ${value}`);
    }
    flags.set(token, value);
    i += 1;
  }

  const variant = positional[0] ?? 'dressed';
  if (variant !== 'idle' && variant !== 'dressed') {
    throw new Error(`renderPose: variant must be 'idle' or 'dressed' — got '${variant}'`);
  }
  if (positional.length > 1) {
    throw new Error(`renderPose: expected one variant, got ${positional.length}: ${positional.join(' ')}`);
  }

  const ss = flags.get('--supersample');
  const backdrop = flags.get('--backdrop');
  return {
    variant,
    out: flags.get('--out') ?? `renders/${variant}.png`,
    mask: flags.get('--mask') ?? null,
    json: flags.get('--json') ?? null,
    supersample: ss === undefined ? DEFAULT_SUPERSAMPLE : integerFlag('--supersample', ss, 1, 16),
    backdrop: backdrop === undefined ? DEFAULT_BACKDROP : integerFlag('--backdrop', backdrop, 0, MAX_RGB),
    full: flags.has('--full'),
    slots: flags.has('--slots'),
  };
}
