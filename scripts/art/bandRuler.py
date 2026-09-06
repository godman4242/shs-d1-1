"""
THE BAND RULER (LANE L3B) — measures the source fighter's PAINT LEDGER and emits
it as committed, portable data. BUILD-TIME ONLY; reads gitignored `reference/`,
writes `scripts/art/sourceBands.ts`.

⛔ WHY IT EXISTS. SESSION 29 shipped a render that passed every aggregate the repo
had — silhouette 0.9185 against a 0.9005 floor, aspect within 0.009, white
coverage within 0.8 pp, dark ink within 0.6 pp — and the owner looked at it and
said it did not look like the video. `compareToSource.py` had predicted exactly
that: "a silhouette score is blind to colour, to paint order, and to a garment on
the wrong slot ... the loop is a net, not a judge."

The reason all four aggregates agreed is measured, not guessed: **the errors
cancel over the whole figure.** Our render has NO white above the hip (the juban
and obi are painted, in the right white, and then covered by the gi's silhouette)
and TOO MUCH white below it (one leg shape drawn twice, splayed). Summed over the
figure those two defects very nearly annihilate — 31.0 % against 31.8 %. Split
into bands they do not:

    whole-figure class shares   max |delta|   2.5 pp     <- the aggregate that PASSED
    per-band class shares       max |delta|  25.3 pp     <- what this file measures

⭐ WHERE THE TOLERANCE COMES FROM, AND IT IS NOT A JUDGEMENT CALL. Both source
frames are measured, five seconds apart, same fighter, same outfit. Their
disagreement per cell IS the measurement's noise floor — the same argument
`sourceProfile.ts` makes with `FRAME_TO_FRAME_CEILING = 0.8808`. A gate that
demands agreement closer than the source agrees with itself is measuring codec
noise and a pose change. So the emitted `spread` is not decoration: it is what
GATE A13-A divides by.

⚠️ THE CLASSIFIER IS NOT MINE. Every anchor below is a colour some COMMITTED shape
actually paints — the SWF's own bytes for the extracted parts, `sourceColour.ts`'s
measured p25/p75 for the traced garments. Hand-picked thresholds are how a gate
becomes a rubber stamp; nearest-anchor over evidence colours is a function of the
repo's own data. An earlier ad-hoc "saturation and brightness" cut sorted the OG's
bright straw into SKIN, which is exactly the drift this avoids.

Run:
  python3 scripts/art/bandRuler.py              # print the ledger + the spread
  python3 scripts/art/bandRuler.py --emit       # + rewrite sourceBands.ts
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from compareToSource import (  # noqa: E402
    FRAME_BAND,
    HELDOUT_FRAME,
    TRACING_FRAME,
    bbox,
    figure_of_frame,
)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EMIT_TO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sourceBands.ts")

# Seconds into `zFtCaTO0_1M.mp4`, the watermark-free longplay — carried into the
# emitted file so a reader never has to go looking for which still this is.
TRACING_T = 590.0
HELDOUT_T = 595.0

# ── THE BANDS ────────────────────────────────────────────────────────────────
# Fractions of FIGURE HEIGHT. Deliberately the SAME six `rebuildZoomCompare.py`
# already draws, so the number that fails a gate and the number under the LOOK
# image are the same number. Each band is one thing a human can name.
BANDS = (
    (0.00, 0.18, "kasa"),
    (0.18, 0.30, "head/collar"),
    (0.30, 0.52, "gi body"),
    (0.52, 0.62, "obi/waist"),
    (0.62, 0.88, "hakama"),
    (0.88, 1.00, "hem/feet"),
)

# ── THE ANCHORS ──────────────────────────────────────────────────────────────
# (r, g, b, class, where it comes from). Nearest anchor in squared RGB wins.
# TWO anchors per cloth class on purpose: the original paints every garment as a
# base tone plus one hard-edged shadow (SESSION22 A9's grammar finding), so one
# anchor per class would put every shadow pixel on the wrong side of a boundary.
ANCHORS = (
    (0x00, 0x00, 0x00, "ink", "outline — every shape's stroke colour"),
    (0xdc, 0xd9, 0xd4, "white", "hakama base — shape9011 fill (SWF #dcd9d4)"),
    (0xc4, 0xc1, 0xc4, "white", "collar shadow — shape9012, sourceColour p25"),
    (0x69, 0x65, 0x68, "grey", "gi base — shape9015, sourceColour p75"),
    (0x67, 0x64, 0x67, "grey", "gi shadow — shape9015, sourceColour p25"),
    (0xfe, 0xca, 0x98, "skin", "flesh base — shape2674 (SWF, extracted)"),
    (0xb7, 0x8f, 0x6c, "skin", "flesh shadow — shape2667 (SWF, extracted)"),
    (0x9a, 0x77, 0x39, "straw", "kasa base — shape9017, sourceColour p75"),
    (0x74, 0x54, 0x21, "straw", "kasa shadow — shape9017, sourceColour p25"),
)
CLASSES = ("ink", "white", "grey", "skin", "straw")

_A = np.array([[a[0], a[1], a[2]] for a in ANCHORS], dtype=np.int64)
_L = np.array([a[3] for a in ANCHORS])


def classify(px):
    """Nearest anchor in squared RGB. `px` is (N, 3); returns (N,) of class names."""
    d = ((px[:, None, :].astype(np.int64) - _A[None, :, :]) ** 2).sum(axis=2)
    return _L[d.argmin(axis=1)]


def ledger(img, mask):
    """Per band, each paint class's share of that band's in-figure pixels, in %."""
    rows = []
    height = img.shape[0]
    for lo, hi, name in BANDS:
        band_mask = mask[int(height * lo): int(height * hi)]
        px = img[int(height * lo): int(height * hi)][band_mask]
        labels = classify(px.astype(np.int64))
        n = max(1, len(labels))
        rows.append({
            "band": name,
            "pixels": int(len(labels)),
            "share": {c: 100.0 * float(np.sum(labels == c)) / n for c in CLASSES},
        })
    return rows


def frame_figure(path):
    """The fighter's own pixels and mask, cropped to its bounding box."""
    whole = np.asarray(Image.open(os.path.join(ROOT, path)).convert("RGB")).astype(np.int16)[FRAME_BAND[0]:FRAME_BAND[1]]
    mask = figure_of_frame(path)
    y0, y1, x0, x1 = bbox(mask)
    return np.asarray(whole)[y0:y1 + 1, x0:x1 + 1], mask[y0:y1 + 1, x0:x1 + 1]


def witnesses(img, mask):
    """
    The hardest pixel per class — the one nearest a tie between its winning
    anchor and the runner-up. A witness set of easy pixels proves nothing; these
    are the ones a transcription typo in the TypeScript twin would sort wrongly.
    """
    px = img[mask].astype(np.int64)
    d = ((px[:, None, :] - _A[None, :, :]) ** 2).sum(axis=2)
    order = np.sort(d, axis=1)
    gap = order[:, 1] - order[:, 0]
    labels = _L[d.argmin(axis=1)]
    out = []
    for c in CLASSES:
        where = np.where(labels == c)[0]
        if len(where) == 0:
            continue
        i = int(where[np.argmin(gap[where])])
        out.append((int(px[i][0]), int(px[i][1]), int(px[i][2]), c, int(gap[i])))
    return out


def report(tracing, heldout):
    print(f"{'band':<13} {'class':<6} {'0061':>7} {'0071':>7} {'spread':>8}")
    worst = 0.0
    for t, h in zip(tracing, heldout):
        for c in CLASSES:
            spread = abs(t["share"][c] - h["share"][c])
            worst = max(worst, spread)
            print(f"{t['band']:<13} {c:<6} {t['share'][c]:7.2f} {h['share'][c]:7.2f} {spread:8.2f}")
        print()
    print(f"in-figure pixels: 0061 {sum(r['pixels'] for r in tracing)}  "
          f"0071 {sum(r['pixels'] for r in heldout)}")
    print(f"WORST frame-to-frame spread over the 30 cells: {worst:.2f} pp")
    print("⚠️ That spread is the noise floor GATE A13-A divides by. A cell with a")
    print("   wide spread is one this measurement cannot resolve — not one we pass.")


def ts_bands():
    return "\n".join(
        "  { name: '%s', lo: %.2f, hi: %.2f }," % (name, lo, hi) for lo, hi, name in BANDS
    )


def ts_anchors():
    # ⚠️ ESCAPE THE APOSTROPHES. "every shape's stroke colour" closes a
    # single-quoted TypeScript string mid-sentence and the emitted file will not
    # parse — caught the first time this ran, and the reason `from` is prose
    # rather than an enum is that the prose is the provenance.
    return "\n".join(
        "  { rgb: [%d, %d, %d], paint: '%s', from: '%s' }," % (r, g, b, cls, src.replace("'", "\\'"))
        for r, g, b, cls, src in ANCHORS
    )


def ts_ledger(rows):
    return "\n".join(
        "  { band: '%s', pixels: %d, share: { %s } }," % (
            r["band"], r["pixels"],
            ", ".join("%s: %.3f" % (c, r["share"][c]) for c in CLASSES),
        )
        for r in rows
    )


def ts_witnesses(rows):
    return "\n".join(
        "  { rgb: [%d, %d, %d], paint: '%s', margin: %d }," % w for w in rows
    )


def emit(tracing, heldout, wit):
    src = HEADER % {
        "bands": ts_bands(),
        "anchors": ts_anchors(),
        "tracing_frame": TRACING_FRAME,
        "tracing_t": TRACING_T,
        "tracing": ts_ledger(tracing),
        "heldout_frame": HELDOUT_FRAME,
        "heldout_t": HELDOUT_T,
        "heldout": ts_ledger(heldout),
        "witnesses": ts_witnesses(wit),
    }
    with open(EMIT_TO, "w") as fh:
        fh.write(src)
    print("\n  emitted %s  (%d bands x %d classes, %d witnesses)"
          % (os.path.relpath(EMIT_TO, ROOT), len(BANDS), len(CLASSES), len(wit)))


HEADER = '''/**
 * THE SOURCE FIGHTER'S PAINT LEDGER (LANE L3B) — MEASURED, and committed as
 * derived data so the suite can grade against it with no `reference/`.
 * BUILD-TIME ONLY. **GENERATED — regenerate, do not hand-edit.**
 *
 * ⛔ WHY NUMBERS AND NOT THE FRAMES. `reference/` is gitignored — the videos and
 * their stills are study-only and never distributed — and a runtime read of it is
 * the bug that once broke every fresh clone (SESSION16 finding 4). Sixty shares
 * are derived data about colour blocking, the same kind of committed target
 * `sourceProfile.ts` holds for proportion and `sourceColour.ts` for tone.
 *
 * PROVENANCE — reproduce with:
 *   python3 scripts/art/bandRuler.py --emit
 *
 * WHAT A CELL IS: within one horizontal band of the figure (bands are fractions
 * of its OWN height, so scale cancels), the share of in-figure pixels whose
 * nearest ANCHOR colour belongs to that paint class. Anchors are colours
 * committed shapes actually paint — never hand-picked thresholds.
 *
 * ⭐ `spread` IS THE POINT OF THE HELD-OUT ROW. Two frames of the same fighter,
 * five seconds apart, disagree by this much per cell. That is the measurement's
 * own noise, and GATE A13-A tolerates it rather than pretending to resolve
 * through it — the same argument `sourceProfile.ts` makes with its
 * `FRAME_TO_FRAME_CEILING`.
 *
 * ⛔ WHAT THIS LEDGER CANNOT SEE, stated because the last gate did not state its
 * blind spot and the owner found it instead:
 *   1. LEFT-RIGHT ARRANGEMENT. A band integrates across the row, so white at the
 *      front and white at the back score identically.
 *   2. THE SHAPE OF A REGION. Two crisp crests and one black smear of equal area
 *      are the same number. It grades an ink BUDGET, never a mark's placement.
 *   3. THE OG's OWN MASK. `silhouette_from_frame` includes the grass the fighter
 *      stands in; part of the hem band's non-white share is scenery, not cloth.
 *      That is why the hem band's spread is the widest in the table, and why the
 *      gate goes correctly blind there rather than confidently wrong.
 *   4. A GARMENT ON THE WRONG SLOT, when both slots fall inside one band.
 *   5. One frame, one pose, one outfit.
 */

/** One horizontal band of the figure, as fractions of its own height. */
export interface SourceBand {
  readonly name: string;
  readonly lo: number;
  readonly hi: number;
}

/** A paint class, named by the shapes that paint it. */
export type PaintClass = 'ink' | 'white' | 'grey' | 'skin' | 'straw';

/** One classifier anchor: a colour a COMMITTED shape actually paints. */
export interface PaintAnchor {
  readonly rgb: readonly [number, number, number];
  readonly paint: PaintClass;
  /** Which committed shape or measurement this colour is, verbatim. */
  readonly from: string;
}

/** Every class's share of one band's in-figure pixels, in percent. */
export interface BandShare {
  readonly band: string;
  readonly pixels: number;
  readonly share: Readonly<Record<PaintClass, number>>;
}

export const SOURCE_BANDS: readonly SourceBand[] = [
%(bands)s
];

export const PAINT_ANCHORS: readonly PaintAnchor[] = [
%(anchors)s
];

/**
 * The frame SESSION 19 traced the outfit from, and the one this gate grades
 * against. A5.1 chose it by LOOKING: lone fighter, clean side profile.
 */
export const TRACING_BAND_FRAME = '%(tracing_frame)s';
export const TRACING_BAND_FRAME_T = %(tracing_t)s;
export const TRACING_BANDS: readonly BandShare[] = [
%(tracing)s
];

/**
 * HELD OUT — never traced from. Here it does one job and it is not "a second
 * target": it supplies the NOISE FLOOR. Measuring how far the source drifts from
 * itself in five seconds is what stops the gate demanding a precision the source
 * does not have.
 */
export const HELDOUT_BAND_FRAME = '%(heldout_frame)s';
export const HELDOUT_BAND_FRAME_T = %(heldout_t)s;
export const HELDOUT_BANDS: readonly BandShare[] = [
%(heldout)s
];

/**
 * The hardest pixel per class in the tracing frame — the one nearest a TIE
 * between its winning anchor and the runner-up (`margin` is the gap in squared
 * RGB). The TypeScript classifier must sort every one of these the way the
 * Python that emitted them did; a witness set of easy pixels would prove
 * nothing, and a transcription typo in the anchor table is exactly the failure
 * two implementations of one rule invite.
 */
export interface PaintWitness {
  readonly rgb: readonly [number, number, number];
  readonly paint: PaintClass;
  readonly margin: number;
}

export const PAINT_WITNESSES: readonly PaintWitness[] = [
%(witnesses)s
];
'''


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--emit", action="store_true", help="rewrite scripts/art/sourceBands.ts")
    args = ap.parse_args()

    tracing = ledger(*frame_figure(TRACING_FRAME))
    heldout = ledger(*frame_figure(HELDOUT_FRAME))
    report(tracing, heldout)
    if args.emit:
        emit(tracing, heldout, witnesses(*frame_figure(TRACING_FRAME)))


if __name__ == "__main__":
    main()
