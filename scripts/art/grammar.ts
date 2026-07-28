/**
 * THE PAINT-GRAMMAR RULER (SESSION22 A9.1) — reads a shape's committed paint
 * list and reports HOW it is drawn: how many real stroke passes, how many
 * all-ink fill rings, which interior tones. BUILD-TIME + SUITE; reads nothing
 * from `reference/`, so it runs in a clean clone.
 *
 * ⛔ WHY IT EXISTS. The original is cel-shaded Flash vector art: a flat base
 * tone plus ONE hard-edged shadow tone per part, a stroked contour of stated
 * width, thin detail lines. The traced garments are a silhouette with a hole
 * punched in it — one all-ink fill ring as an "outline", one flat tone, no
 * strokes. Every earlier gate graded pixels or colours; none could see the
 * difference, because the difference is in the PAINT LIST. This file reads
 * the paint list.
 *
 * ⚠️ "INK" HAS ONE DEFINITION, HERE. `inkShareLib.ts` imports INK_CHANNEL for
 * its pixel test, and this file uses it for paint colours — one threshold, two
 * instruments. A drifting second copy is how two answers about "what is
 * outline" silently disagree (SESSION16 R2 finding 3).
 */
import type { ArtShape } from '../../src/game/art/types';

/**
 * A channel below this is outline-dark. 40 is SESSION21 A8.3's committed BLACK
 * threshold — dark enough to admit the OG's own near-black outline colours
 * (#180e06, #140e0e, #0d080c — measured, colourRuler §P4.13) and nothing else.
 */
export const INK_CHANNEL = 40;

/** True when every channel is outline-dark — pure black and the OG's near-blacks. */
export function isInk(color: number): boolean {
  return (
    ((color >> 16) & 0xff) < INK_CHANNEL &&
    ((color >> 8) & 0xff) < INK_CHANNEL &&
    (color & 0xff) < INK_CHANNEL
  );
}

/** How one shape is painted — the facts GATE A9-A/C grade, nothing decided here. */
export interface PaintGrammar {
  readonly id: number;
  /** Every stroke pass, ink or not — detail lines may be coloured (2641's is). */
  readonly strokeCount: number;
  /** Stroke passes whose colour is ink — the OG's contour outlines. */
  readonly inkStrokes: number;
  /** Ink-stroke widths, for the [0.5, 2.5] bar. */
  readonly inkStrokeWidths: readonly number[];
  /** Rings inside all-ink FILLS — the traced-blob outline. A9-A wants ZERO. */
  readonly inkFillRings: number;
  /** Distinct non-ink fill colours, darkest → lightest by luma. The tones. */
  readonly tones: readonly number[];
}

const luma = (rgb: number): number =>
  0.299 * ((rgb >> 16) & 0xff) + 0.587 * ((rgb >> 8) & 0xff) + 0.114 * (rgb & 0xff);

export function grammarOf(shape: ArtShape): PaintGrammar {
  const inkStrokeWidths: number[] = [];
  let strokeCount = 0;
  let inkFillRings = 0;
  const toneSet = new Set<number>();
  for (const p of shape.paints) {
    if (p.kind === 'stroke') {
      strokeCount += 1;
      if (isInk(p.color)) inkStrokeWidths.push(p.width);
    } else if (isInk(p.color)) {
      inkFillRings += p.rings.length;
    } else {
      toneSet.add(p.color);
    }
  }
  return {
    id: shape.id,
    strokeCount,
    inkStrokes: inkStrokeWidths.length,
    inkStrokeWidths,
    inkFillRings,
    tones: [...toneSet].sort((a, b) => luma(a) - luma(b)),
  };
}

/** GATE A9-D's committed colour targets — sourceColour.ts's p25/p75 pair. */
export interface ToneTargets {
  /** The SHADOW tone's target — the source distribution's dark quartile. */
  readonly p25: readonly [number, number, number];
  /** The BASE tone's target — the light quartile. */
  readonly p75: readonly [number, number, number];
}

/** The bar the SESSION22 kickoff §2 fixed before any re-authored art existed. */
export interface GrammarBar {
  readonly strokeWidthMin: number;
  readonly strokeWidthMax: number;
  /** A9-D: every graded tone within this many levels per channel of its target. */
  readonly channelTolerance: number;
  /** A9-B: the OG's own worst non-hair ink share, percent. */
  readonly maxInkShare: number;
}

const channels = (rgb: number): [number, number, number] => [
  (rgb >> 16) & 0xff,
  (rgb >> 8) & 0xff,
  rgb & 0xff,
];

const hex = (rgb: number): string => `#${rgb.toString(16).padStart(6, '0')}`;

const worstChannel = (rgb: number, target: readonly [number, number, number]): number => {
  const c = channels(rgb);
  return Math.max(Math.abs(c[0] - target[0]), Math.abs(c[1] - target[1]), Math.abs(c[2] - target[2]));
};

/**
 * Every way `shape` breaks the OG grammar, as human-readable findings — empty
 * means GATES A9-A/B/C/D all hold. The caller supplies the measured ink share
 * (`inkShareLib.inkShareOf`) so this stays a pure paint-list judgement.
 *
 * ⚠️ A9-D grades the DARKEST tone against p25 and the LIGHTEST against p75.
 * Tones between them are detail accents and deliberately ungraded — the OG's
 * own parts carry up to three fills (2650) and the middle one has no target.
 * A measured-flat garment (`measuredFlat`) keeps ONE tone, graded against both
 * ends — which only a genuinely tight distribution can satisfy.
 */
export function violationsOf(
  g: PaintGrammar,
  inkShare: number,
  targets: ToneTargets,
  measuredFlat: boolean,
  bar: GrammarBar,
): readonly string[] {
  const v: string[] = [];
  if (g.inkStrokes < 1) {
    v.push('A9-A: no ink stroke — the contour must be a stroked outline, not a filled ring');
  }
  for (const w of g.inkStrokeWidths) {
    if (w < bar.strokeWidthMin || w > bar.strokeWidthMax) {
      v.push(
        `A9-A: ink stroke width ${String(w)} outside ` +
          `[${String(bar.strokeWidthMin)}, ${String(bar.strokeWidthMax)}]`,
      );
    }
  }
  if (g.inkFillRings > 0) {
    v.push(`A9-A: ${String(g.inkFillRings)} all-ink fill ring(s) — the traced blob outline must go`);
  }
  if (measuredFlat) {
    if (g.tones.length !== 1) {
      v.push(`A9-C: measured-flat garment holds ${String(g.tones.length)} tones, expected exactly 1`);
    }
  } else if (g.tones.length < 2) {
    v.push(
      `A9-C: ${String(g.tones.length)} tone(s) — the OG paints a base + one hard-edged shadow`,
    );
  }
  if (inkShare > bar.maxInkShare) {
    v.push(
      `A9-B: ink share ${inkShare.toFixed(1)}% over the OG's own worst ${bar.maxInkShare.toFixed(1)}%`,
    );
  }
  const darkest = g.tones[0];
  const lightest = g.tones[g.tones.length - 1];
  if (darkest !== undefined && lightest !== undefined) {
    const shadowErr = worstChannel(darkest, targets.p25);
    if (shadowErr > bar.channelTolerance) {
      v.push(
        `A9-D: shadow tone ${hex(darkest)} is ${String(shadowErr)} levels off its p25 target ` +
          `rgb(${targets.p25.join(',')})`,
      );
    }
    const baseErr = worstChannel(lightest, targets.p75);
    if (baseErr > bar.channelTolerance) {
      v.push(
        `A9-D: base tone ${hex(lightest)} is ${String(baseErr)} levels off its p75 target ` +
          `rgb(${targets.p75.join(',')})`,
      );
    }
  }
  return v;
}
