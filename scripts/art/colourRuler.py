"""
THE COLOUR RULER (SESSION21 A8.1) — per garment, the SOURCE's own colour taken
from that garment's own traced mask, against the fill we actually committed.
BUILD-TIME ONLY; reads gitignored `reference/`, imported by nothing in `src/`.

⛔ WHY IT EXISTS. SESSION 20 closed with the silhouette score at 0.9006 against a
source frame while the source's own two frames agree at only 0.8808 — we scored
ABOVE the ceiling, and the fighter still plainly did not look like the source. A
width profile is blind to colour. It cannot see a robe 20 levels too dark or
straw 25 too dark, so those errors cost nothing and survived three sessions.

⭐ IT SHARES ITS MASKS WITH THE TRACER, IT DOES NOT RE-SEGMENT. Every region
below comes from `traceGarment.garment_masks` — the same function that decides
which pixels get traced into an outline. A second opinion about "which pixels are
the hakama" is how a ruler and the thing it measures silently end up describing
different regions (SESSION16 R2 finding 3: one drifting copy of a containment
test produced 24 wrong verdicts across 19 shapes).

⛔ AND WHY THE PIXELS ARE NOT HAND-PICKED. The kickoff's §P4.12 sampled seven
7x7 medians by eye and TWO OF THE SEVEN landed on the wrong garment (the collar
sample and the scabbard sample), so two of its numbers described something else
entirely. A mask cannot land on the wrong garment: it is the garment.

⚠️ WHAT A SINGLE MEDIAN CANNOT SAY. The source garments are NOT flat — the kasa
is woven and two-toned, the gi has a lighter front panel over a darker back. The
`spread` column is how far from flat each one is, and a garment with a wide
spread is one whose real defect is missing INTERIOR STRUCTURE, not hue. Read
that column before believing the delta.

Run:
  python3 scripts/art/colourRuler.py                 # the table
  python3 scripts/art/colourRuler.py --emit          # + rewrite sourceColour.ts
"""
import argparse
import json
import os
import re
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from traceGarment import FRAME, FRAME_T, FRAME_VIDEO, GARMENTS, garment_masks  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GENERATED = os.path.join(ROOT, "src", "game", "art", "generated")
EMIT_TO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sourceColour.ts")

# A median over a handful of pixels is noise wearing a number's clothes. Below
# this the erosion is backed off a step rather than the sample being trusted.
MIN_SAMPLES = 40
# GATE A8-D's bar, quoted here so the table can mark its own failures.
A8_D_TOLERANCE = 12


def our_fill(shape_id):
    """
    The fill WE committed, read out of the generated TypeScript.

    Deliberately the committed artifact and not `trace_one`'s return value: the
    question this file answers is whether the art the GAME DRAWS matches the
    source, and the only art the game draws is what is on disk.
    """
    path = os.path.join(GENERATED, "shape%d.ts" % shape_id)
    if not os.path.exists(path):
        raise SystemExit("colourRuler: %s has no generated shape" % shape_id)
    fills = [int(m, 16) for m in re.findall(r"color:\s*0x([0-9a-fA-F]{6})", open(path).read())]
    interior = [c for c in fills if c != 0x000000]
    if not interior:
        raise SystemExit("colourRuler: shape%d has no non-black fill" % shape_id)
    if len(set(interior)) != 1:
        raise SystemExit("colourRuler: shape%d has %d different interior fills — which one is "
                         "'our colour'? Refusing to guess." % (shape_id, len(set(interior))))
    c = interior[0]
    return ((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF)


def core_of(region):
    """
    The garment's INTERIOR, backed away from its own outline.

    A traced region runs right up to the heavy black outline, and video is
    JPEG-compressed: the pixels within a step or two of that edge are part
    outline. Sampling them is precisely how a light garment reads dark. So the
    region is eroded as far as it will go while still leaving a real sample, and
    the number of steps taken is REPORTED rather than fixed — the obi is 26 video
    px across and the hakama 63, and one erosion budget cannot fit both.
    """
    cur, steps = region, 0
    while True:
        nxt = ndimage.binary_erosion(cur, np.ones((3, 3)))
        if nxt.sum() < MIN_SAMPLES:
            return cur, steps
        cur, steps = nxt, steps + 1
        if steps >= 6:
            return cur, steps


def measure(im, g):
    a = np.asarray(im.crop(g["crop"])).astype(np.int16)
    sil, interior, colour_from = garment_masks(a, g)
    region = colour_from if colour_from is not None else interior
    if region.sum() < MIN_SAMPLES:
        raise SystemExit("colourRuler: %d's fill region is only %d px" % (g["id"], region.sum()))
    core, steps = core_of(region)
    px = a[core]

    median = tuple(int(v) for v in np.median(px, axis=0).round())
    q1 = np.percentile(px, 25, axis=0)
    q3 = np.percentile(px, 75, axis=0)
    iqr = tuple(int(v) for v in (q3 - q1).round())

    # ⭐ THE SUSPECT, MEASURED BESIDE THE TRUTH. §P4.12 suspected `trace_one`'s
    # own recipe — a 5x5 median filter, then the MEAN over a once-eroded core —
    # of dragging light garments dark. Both numbers are printed so the guess
    # becomes an observation: if `asTraced` sits below `median`, that is the
    # recipe doing it, and A8.4 has its target.
    med5 = np.dstack([ndimage.median_filter(a[:, :, c], size=5) for c in range(3)])
    tr_core = ndimage.binary_erosion(region, np.ones((3, 3)))
    if tr_core.sum() < 30:
        tr_core = region
    as_traced = tuple(int(v) for v in med5[tr_core].mean(axis=0).round())

    # The outline's own colour, for the "we are too inky" question (§P4.13).
    # Reported, never gated: an anti-aliased edge has no single true colour.
    edge = sil & ~ndimage.binary_dilation(interior, np.ones((3, 3)))
    ink = tuple(int(v) for v in np.median(a[edge], axis=0).round()) if edge.sum() >= 20 else None

    return dict(
        shapeId=g["id"], slot=g["slot"], garment=g["name"],
        median=median, iqr=iqr, samples=int(core.sum()), erosions=steps,
        asTraced=as_traced, ink=ink, ours=our_fill(g["id"]),
    )


def hexs(rgb):
    return "#%02x%02x%02x" % rgb


def emit(rows):
    """Write the committed, portable half — the same pattern as sourceProfile.ts."""
    body = []
    for r in rows:
        body.append(
            "  {\n"
            "    shapeId: %d,\n    slot: %d,\n    garment: %s,\n"
            "    median: [%d, %d, %d],\n    iqr: [%d, %d, %d],\n"
            "    samples: %d,\n    erosions: %d,\n  }," % (
                r["shapeId"], r["slot"], "'%s'" % r["garment"].replace("'", "\\'"),
                *r["median"], *r["iqr"], r["samples"], r["erosions"]))
    src = HEADER + "\n".join(body) + "\n];\n"
    open(EMIT_TO, "w").write(src)
    print("\n  emitted %s  (%d garments)" % (os.path.relpath(EMIT_TO, ROOT), len(rows)))


HEADER = '''/**
 * THE SOURCE FIGHTER'S OWN GARMENT COLOURS (SESSION21 A8.1) — MEASURED, and
 * committed as derived data so the suite can grade against them with no
 * `reference/`. BUILD-TIME ONLY. **GENERATED — regenerate, do not hand-edit.**
 *
 * ⛔ WHY NUMBERS AND NOT THE FRAMES. `reference/` is gitignored — the videos and
 * their stills are study-only and never distributed — and a runtime read of it
 * is the bug that once broke every fresh clone (SESSION16 finding 4). Seven
 * medians are derived data about colour, the same kind of committed target
 * `sourceProfile.ts` already holds for proportion.
 *
 * PROVENANCE — reproduce with:
 *   python3 scripts/art/colourRuler.py --emit
 *
 * MEASUREMENT RULE: for each garment, `traceGarment.garment_masks` builds the
 * SAME region the outline is traced from; that region is eroded away from its
 * own outline while it still holds >= 40 pixels; the median is taken per channel
 * over the raw frame pixels inside it. Masks are shared with the tracer on
 * purpose — a second opinion about which pixels are the hakama is how a ruler
 * and the thing it measures end up describing different regions.
 *
 * ⚠️ `iqr` IS PART OF THE MEASUREMENT, NOT DECORATION. It is the interquartile
 * spread per channel. A garment with a wide spread is NOT one flat colour in the
 * source, so matching its median exactly still will not make it look right — its
 * real defect is missing interior structure. The kasa is the clear case.
 *
 * ⚠️ SAMPLED FROM LOSSY VIDEO, never read from the SWF — INFERRED targets, never
 * CONTRACT (SESSION19 §P7).
 */

/** One garment's colour, as the source frame actually shows it. */
export interface SourceFill {
  /** The traced shape this measures — >= 9000, always. */
  readonly shapeId: number;
  /** The pose slot the garment is drawn at. */
  readonly slot: number;
  readonly garment: string;
  /** Per-channel median inside the garment's own traced mask, 0-255. */
  readonly median: readonly [number, number, number];
  /** Per-channel interquartile spread — how far from flat the garment is. */
  readonly iqr: readonly [number, number, number];
  /** How many source pixels the median was taken over. */
  readonly samples: number;
  /** 3x3 erosion steps applied before sampling, to clear the outline. */
  readonly erosions: number;
}

/** The still every median below was measured from. */
export const COLOUR_FRAME = '%FRAME%';
/** Seconds into `%VIDEO%.mp4`, the watermark-free longplay. */
export const COLOUR_FRAME_T = %FRAME_T%;

export const SOURCE_FILLS: readonly SourceFill[] = [
'''.replace("%FRAME%", FRAME).replace("%VIDEO%", FRAME_VIDEO).replace("%FRAME_T%", repr(FRAME_T))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--emit", action="store_true", help="rewrite scripts/art/sourceColour.ts")
    ap.add_argument("--json", default=None)
    args = ap.parse_args()

    im = Image.open(os.path.join(ROOT, FRAME)).convert("RGB")
    rows = [measure(im, g) for g in GARMENTS]

    print("THE COLOUR RULER — source median inside each garment's own traced mask")
    print("frame %s  (t=%.1fs, %s)\n" % (FRAME, FRAME_T, FRAME_VIDEO))
    print("%5s %-26s %-17s %-17s %14s %6s %5s  %s"
          % ("id", "garment", "SOURCE median", "OURS (committed)", "delta r,g,b", "worst", "n", "spread"))
    for r in rows:
        d = [o - s for o, s in zip(r["ours"], r["median"])]
        worst = max(abs(v) for v in d)
        flag = "  " if worst <= A8_D_TOLERANCE else " ⛔"
        print("%5d %-26s %-7s %-9s %-7s %-9s %+5d%+5d%+5d %5d%s %5d  %s"
              % (r["shapeId"], r["garment"][:26],
                 hexs(r["median"]), "(%d,%d,%d)" % r["median"],
                 hexs(r["ours"]), "(%d,%d,%d)" % r["ours"],
                 d[0], d[1], d[2], worst, flag, r["samples"],
                 "%d,%d,%d" % r["iqr"]))

    print("\n  ⇒ GATE A8-D wants every `worst` <= %d. ⛔ marks the ones that fail." % A8_D_TOLERANCE)

    print("\n  IS IT THE SAMPLING RECIPE? (§P4.12's suspicion, measured)")
    print("  %5s %-20s %-11s %-11s %s" % ("id", "garment", "true median", "as traced", "recipe error"))
    for r in rows:
        drift = [t - m for t, m in zip(r["asTraced"], r["median"])]
        print("  %5d %-20s %-11s %-11s %+4d%+4d%+4d"
              % (r["shapeId"], r["garment"][:20], hexs(r["median"]), hexs(r["asTraced"]), *drift))

    print("\n  THE OUTLINE'S OWN COLOUR (§P4.13 'we are too inky') — reported, NOT gated")
    for r in rows:
        print("  %5d %-20s source ink %s   ours 0x000000"
              % (r["shapeId"], r["garment"][:20], hexs(r["ink"]) if r["ink"] else "  —  (too thin to sample)"))

    if args.json:
        open(os.path.join(ROOT, args.json), "w").write(json.dumps(rows, indent=2))
        print("\n  wrote %s" % args.json)
    if args.emit:
        emit(rows)


if __name__ == "__main__":
    main()
