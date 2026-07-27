/**
 * THE RENDER CLI'S ARGUMENTS (SESSION20 A6.1) — a gate on the guard that the
 * whole headless render exists to keep.
 *
 * ⛔ WHY THIS FILE EXISTS AT ALL. An adversarial review of A6.1 found that
 * `--backdrop ff00ff` — the same value with the `0x` dropped — parsed to `NaN`,
 * which then walked straight past `assertBackdropIsNotArt` (nothing equals NaN),
 * and `Uint32Array.fill(NaN)` coerced to 0, so the fighter rendered on PURE
 * BLACK: the fighter's own outline colour, and the exact case the explicit
 * `--backdrop 0x000000` correctly refuses. A comparator segmenting "everything
 * that is not the backdrop" would have deleted the outline and reported an
 * improvement. That is a defect that reads as progress, which this project has
 * paid for before.
 *
 * The parsing was inside `poseRaster.ts`, which imports `src/game/art/…` and so
 * is unreachable from any test (`tests/no-game-imports.test.ts`). Splitting it
 * out is what makes the guard gateable — a validator nothing can test is not a
 * validator.
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_BACKDROP, DEFAULT_SUPERSAMPLE, parseArgs } from '../scripts/art/renderPoseArgs';

describe('parseArgs — defaults', () => {
  it('defaults to the dressed fighter on the stated magenta backdrop', () => {
    const args = parseArgs([]);
    expect(args.variant).toBe('dressed');
    expect(args.backdrop).toBe(DEFAULT_BACKDROP);
    expect(args.supersample).toBe(DEFAULT_SUPERSAMPLE);
    expect(args.full).toBe(false);
    expect(args.slots).toBe(false);
    expect(args.mask).toBeNull();
  });

  it('reads the variant, the paths and the boolean flags', () => {
    const args = parseArgs(['idle', '--out', 'a.png', '--mask', 'b.png', '--full', '--slots']);
    expect(args.variant).toBe('idle');
    expect(args.out).toBe('a.png');
    expect(args.mask).toBe('b.png');
    expect(args.full).toBe(true);
    expect(args.slots).toBe(true);
  });
});

describe('parseArgs — fails closed', () => {
  it('REJECTS a backdrop that is not a number, instead of rendering on black', () => {
    // The exact typo that got through review: the 0x dropped.
    expect(() => parseArgs(['--backdrop', 'ff00ff'])).toThrow(/--backdrop/);
    expect(() => parseArgs(['--backdrop', 'magenta'])).toThrow(/--backdrop/);
  });

  it('rejects a backdrop outside 0x000000..0xffffff, or a fractional one', () => {
    expect(() => parseArgs(['--backdrop', '0x1000000'])).toThrow(/--backdrop/);
    expect(() => parseArgs(['--backdrop', '-1'])).toThrow(/--backdrop/);
    expect(() => parseArgs(['--backdrop', '1.5'])).toThrow(/--backdrop/);
  });

  it('accepts both 0x-prefixed and plain decimal backdrops', () => {
    expect(parseArgs(['--backdrop', '0xff00ff']).backdrop).toBe(0xff00ff);
    expect(parseArgs(['--backdrop', '0']).backdrop).toBe(0);
  });

  it('rejects a supersample that is not a positive integer', () => {
    expect(() => parseArgs(['--supersample', 'lots'])).toThrow(/--supersample/);
    expect(() => parseArgs(['--supersample', '0'])).toThrow(/--supersample/);
    expect(() => parseArgs(['--supersample', '2.5'])).toThrow(/--supersample/);
  });

  it('rejects a value-taking flag that swallowed the NEXT flag', () => {
    // `--out --slots` would otherwise write a file literally named "--slots"
    // and silently turn the footprint table off.
    expect(() => parseArgs(['--out', '--slots'])).toThrow(/--out/);
  });

  it('rejects a value-taking flag with no value at all', () => {
    expect(() => parseArgs(['--out'])).toThrow(/--out/);
  });

  it('rejects an unknown flag rather than ignoring it', () => {
    expect(() => parseArgs(['--scale', '2'])).toThrow(/--scale/);
  });

  it('rejects a variant that is neither idle nor dressed', () => {
    expect(() => parseArgs(['naked'])).toThrow(/idle.*dressed|dressed.*idle/);
  });

  it('rejects a SECOND positional instead of silently dropping it', () => {
    // `renderPose -- idle dressed` should not quietly render one of the two.
    expect(() => parseArgs(['idle', 'dressed'])).toThrow(/one variant/);
  });
});
