"""
THE RE-AUTHORING TOOL (SESSION22 A9.2+) — rebuilds a traced garment's SVG in the
ORIGINAL's own art grammar: a flat BASE fill on the traced silhouette, ONE
hard-edged SHADOW fill measured from the frame, and an ink STROKE of stated
width along the contour. BUILD-TIME ONLY; reads gitignored `reference/`,
writes `reference/traced/<id>.svg` (then `generate.ts` commits the result).

⛔ RISK 2's LINE, ENFORCED BY CONSTRUCTION (kickoff §6): the OUTLINE comes from
the trace (the exact `garment_masks` silhouette the committed blob was traced
from, through the exact same potrace+rdp+to_local pipeline — same geometry, to
the millipixel), the GRAMMAR comes from the OG's own shapes (base + one shadow
+ stroked contour, widths in the OG's own set), and the TONES come from
measurement (`sourceColour.ts`'s committed p25/p75, with kickoff D4's SWF
preference). Nothing here is drawn from imagination.

⚠️ WHY THE STROKE SITS ON THE SILHOUETTE RING (decision D-A9.2a): the stroke is
centred on the traced contour, so the silhouette grows by width/2 ≈ 0.2 world
px. The alternative (insetting the centreline) preserves the silhouette exactly
but adds an offsetting step that can self-intersect on concave rings. Simplest
change first; GATE A9-G (held-out floor) is the check that decides if the
simple way is good enough. Veto = a floor drop, which switches this to inset.

Usage:
  python3 scripts/art/reauthorGarment.py 9012 9001     # emit authored SVGs
  npx vite-node scripts/art/generate.ts -- 9012 9001   # commit the .ts
  SSHD_STROKE_9012=1.5  overrides a stroke width (OG-quantised values only)
"""
import os
import re
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from traceGarment import (  # noqa: E402
    BRIM_DOWN_HEAD, FRAME, GARMENTS, HAKAMA_TOP, INK_MAX, OUT_DIR, VIDEO_TO_WORLD,
    garment_masks, potrace_polygon,
)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SOURCE_COLOUR_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sourceColour.ts")

# The marker traceGarment.py refuses to clobber. One string, defined here,
# imported there — a drifting second copy is how a guard stops guarding.
AUTHORED_MARK = "AUTHORED (SESSION22 A9)"

# D4: the SWF's own recorded colours (shapes 2653 / 2646), byte-exact. A video
# sample within 12 levels of one of these is the lossy copy of an exact value
# we already hold, so the exact value wins.
SWF_PALETTE = [0xDCD9D4, 0x9E9A97, 0xFECA98, 0xB78F6C]
D4_TOLERANCE = 12

# Stroke widths the OG itself uses on the fighter (measured, tests/a9Grammar):
# {0.5, 1, 1.5, 2}. Per-garment choice is by measurement against GATE A9-B —
# the smallest garments carry the narrowest ink, exactly as the OG's parts do.
OG_WIDTHS = (0.5, 1.0, 1.5, 2.0)
STROKE_W = {
    9012: 1.0,  # collar/juban, 21x23 local px — was 75.9% ink as a blob
    9001: 1.0,  # far sleeve, 12x20 local px — was 70.6% ink as a blob
    9011: 1.5,  # hakama, the largest garment
    9014: 1.0,  # obi
    9015: 1.5,  # gi body
    9017: 1.5,  # kasa
    9019: 1.5,  # gi sleeve, near
}

# rec601 — the same luma the paint-grammar ruler uses (grammar.ts).
LUMA = (0.299, 0.587, 0.114)


def committed_targets():
    """GATE A9-D's committed p25/p75 pairs, read from sourceColour.ts — the
    single committed source; re-measuring here would let the tool and the gate
    disagree about what the target is."""
    src = open(SOURCE_COLOUR_TS).read()
    out = {}
    for m in re.finditer(
        r"shapeId:\s*(\d+).*?p25:\s*\[(\d+),\s*(\d+),\s*(\d+)\].*?p75:\s*\[(\d+),\s*(\d+),\s*(\d+)\]",
        src, re.S,
    ):
        sid = int(m.group(1))
        out[sid] = (
            tuple(int(m.group(i)) for i in (2, 3, 4)),
            tuple(int(m.group(i)) for i in (5, 6, 7)),
        )
    if not out:
        raise SystemExit("reauthorGarment: no p25/p75 targets found in sourceColour.ts")
    return out


def pick_tone(target):
    """D4: prefer the SWF's byte-exact colour when the measured target is within
    12 levels/channel of one; otherwise the measured target itself."""
    for c in SWF_PALETTE:
        rgb = ((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF)
        if all(abs(rgb[i] - target[i]) <= D4_TOLERANCE for i in range(3)):
            return c, "SWF #%06x (D4: measured %s within %d)" % (c, tuple(target), D4_TOLERANCE)
    c = (target[0] << 16) | (target[1] << 8) | target[2]
    return c, "measured %s (no SWF colour within %d)" % (tuple(target), D4_TOLERANCE)


def to_local_fn(g, sil):
    """EXACTLY trace_one's anchor mathematics (traceGarment.py) — the authored
    geometry must land in the same shape-local space as the committed outline,
    or the garment moves on the fighter. Kept in lockstep by the byte-identity
    check reauthor() performs on the silhouette ring."""
    ys, xs = np.where(sil)
    vx0, vx1 = g["crop"][0] + xs.min(), g["crop"][0] + xs.max()
    vy0, vy1 = g["crop"][1] + ys.min(), g["crop"][1] + ys.max()
    px0, px1, py0, py1 = g["part"]
    anchor = os.environ.get("SSHD_ANCHOR_%d" % g["id"], g["anchor"])
    if anchor == "kasa":
        ax = (px0 + px1) / 2.0
        ay = py0 + BRIM_DOWN_HEAD * (py1 - py0)
        ref_y = vy1
    elif anchor in ("sleeve", "top"):
        ax = (px0 + px1) / 2.0
        ay = py0
        ref_y = vy0
    elif anchor == "hakama":
        ax = (px0 + px1) / 2.0
        ay = HAKAMA_TOP
        ref_y = vy0
    else:
        ax = (px0 + px1) / 2.0
        ay = (py0 + py1) / 2.0
        ref_y = (vy0 + vy1) / 2.0
    ref_x = (vx0 + vx1) / 2.0

    def to_local(px, py):
        vxx, vyy = g["crop"][0] + px, g["crop"][1] + py
        return ((vxx - ref_x) / VIDEO_TO_WORLD + ax, (vyy - ref_y) / VIDEO_TO_WORLD + ay)

    return to_local


def shadow_mask(a, interior, p25, p75):
    """The ONE hard-edged shadow, measured: interior pixels darker than the
    midpoint between the two committed targets, cleaned to solid regions. The
    5x5 median filter first — raw JPEG noise would speckle the split."""
    med5 = np.dstack([ndimage.median_filter(a[:, :, c], size=5) for c in range(3)])
    luma = sum(med5[:, :, i] * LUMA[i] for i in range(3))
    mid = (sum(p25[i] * LUMA[i] for i in range(3)) + sum(p75[i] * LUMA[i] for i in range(3))) / 2.0
    core = ndimage.binary_erosion(interior, np.ones((3, 3)))
    dark = core & (luma < mid)
    dark = ndimage.binary_opening(dark, np.ones((3, 3)))
    dark = ndimage.binary_closing(dark, np.ones((3, 3)))
    # Components below ~2% of the interior are JPEG shimmer, not a shadow shape.
    lab, n = ndimage.label(dark)
    if n == 0:
        return dark
    keep = np.zeros_like(dark)
    floor = max(30, 0.02 * interior.sum())
    for i in range(1, n + 1):
        comp = lab == i
        if comp.sum() >= floor:
            keep |= comp
    return keep


def tone_regions(a, interior, k):
    """
    THE TONES A GARMENT ACTUALLY HAS (LANE L3B) — the 2-tone grammar above,
    generalised, and OPT-IN so every garment that does not ask for it keeps its
    committed bytes.

    ⛔ WHY. `sourceColour.ts` warns in its own header: *"a garment with a wide
    spread is NOT one flat colour in the source, so matching its median exactly
    still will not make it look right — its real defect is missing interior
    structure."* The gi is that case and so is the kasa. Measured on the tracing
    frame, the gi's interior is FOUR things — a dark back panel, the mid body, a
    lighter front panel, and the white juban lapel and obi showing beside it —
    and `p25/p75` can only ever describe two of them. Painting it in two greys is
    why our obi/waist band reads 3.9 % white where the source reads 20.9 %.

    ⚠️ THE CLUSTERS ARE FOUND, NOT CHOSEN. 1-D k-means over the interior's own
    rec601 luma, seeded at evenly-spaced quantiles and run to a fixed iteration
    count, so it is deterministic and reproducible. Nobody picks a threshold;
    the garment's own histogram does. Clusters whose emitted colours land within
    `D4_TOLERANCE` of one already taken are MERGED and reported, never emitted
    twice — the same rule that makes a genuinely flat garment stay flat.

    Returns [(mask, colour, note)], darkest first, over the whole interior.
    """
    med5 = np.dstack([ndimage.median_filter(a[:, :, c], size=5) for c in range(3)])
    luma = sum(med5[:, :, i] * LUMA[i] for i in range(3))
    # ⛔ THE OUTLINE IS NOT A TONE. Clustering the raw interior spends two of
    # four clusters on ink bleeding in past the erosion, and then paints a black
    # REGION under a black STROKE — the same ink counted twice, which GATE A9-B
    # reads as an inkier garment than the OG has. `INK_MAX` is `traceGarment`'s
    # own committed definition of "this pixel is outline, not scenery"; reusing
    # it means the tone split and the trace agree about where the cloth starts.
    mx = np.maximum(np.maximum(med5[:, :, 0], med5[:, :, 1]), med5[:, :, 2])
    core = ndimage.binary_erosion(interior, np.ones((3, 3))) & (mx >= INK_MAX)
    values = luma[core]
    if values.size == 0:
        return []

    # Deterministic seeding + a fixed iteration budget: no RNG, no convergence
    # test whose tie-breaking could differ between runs.
    centres = np.percentile(values, np.linspace(100.0 / (2 * k), 100.0 - 100.0 / (2 * k), k))
    for _ in range(40):
        assign = np.abs(values[:, None] - centres[None, :]).argmin(axis=1)
        moved = np.array([values[assign == i].mean() if np.any(assign == i) else centres[i] for i in range(k)])
        if np.allclose(moved, centres):
            break
        centres = moved
    edges = [(centres[i] + centres[i + 1]) / 2.0 for i in range(k - 1)]

    out, taken = [], []
    floor = max(30, 0.02 * interior.sum())
    for i in range(k):
        lo = -np.inf if i == 0 else edges[i - 1]
        hi = np.inf if i == k - 1 else edges[i]
        band = core & (luma >= lo) & (luma < hi)
        band = ndimage.binary_closing(ndimage.binary_opening(band, np.ones((3, 3))), np.ones((3, 3)))
        lab, n = ndimage.label(band)
        keep = np.zeros_like(band)
        for j in range(1, n + 1):
            comp = lab == j
            if comp.sum() >= floor:
                keep |= comp
        if not keep.any():
            continue
        median = tuple(int(np.median(a[:, :, c][keep])) for c in range(3))
        col, note = pick_tone(median)
        if col in taken:
            print("       tone %d merged: #%06x is already painted (D4 within %d)" % (i, col, D4_TOLERANCE))
            continue
        taken.append(col)
        out.append((keep, col, "%s, %.1f%% of the interior" % (note, 100.0 * keep.sum() / interior.sum())))
    return out


def guard_regression(gid, out_path, svg):
    """
    ⛔ REFUSE TO REGENERATE A GARMENT INTO A SMALLER ONE (LANE L3B).

    Every `shape90NN.ts` says *"GENERATED — DO NOT EDIT. Regenerate with the
    command below."* AUDITED 2026-09-06, and for three of the seven that promise
    is FALSE — re-running this tool over the committed art SILENTLY DELETES work
    that is not in any script:

        9001 · 9011 · 9012 · 9014   reproduce, path for path          ✅
        9017  6 paths -> 3   the kasa's 6 radial weave ribs and 13 fringe ticks
        9019  6 paths -> 3   the near sleeve's own detail paths
        9015  4 paths -> 3   AND THE OUTER RING MOVES — the SESSION 22 balloon
              repair is gone, GATE A9-E goes from 0.44 to 3.50 local px, and the
              defect that took an owner ruling to close is back

    That is how this guard was found: it happened, to this lane, and only the
    suite's own A9-E caught it. Detail geometry that exists in exactly one
    gitignored file is one careless rerun from gone.

    THE RULE: a regeneration may ADD paths and may change them, but it may not
    reduce the count. Losing one is a deliberate act — delete the SVG first, and
    say in the commit what detail is being dropped and why.
    """
    if not os.path.exists(out_path):
        return
    before = len(re.findall(r'\sd="', open(out_path).read()))
    after = len(re.findall(r'\sd="', svg))
    if after < before:
        raise SystemExit(
            "reauthorGarment: %d would go from %d paths to %d — regenerating would DELETE %d path(s) "
            "this tool cannot rebuild (the kasa's ribs and fringe, the gi's balloon repair). "
            "Refusing. Delete reference/traced/%d.svg first if the loss is intended, and say so in "
            "the commit." % (gid, before, after, before - after, gid)
        )


def ring_path(rings, to_local):
    return " ".join(
        "M" + " L".join("%.3f %.3f" % to_local(x, y) for x, y in ring) + " Z" for ring in rings
    )


def reauthor(im, g, targets):
    gid = g["id"]
    if gid not in targets:
        raise SystemExit("reauthorGarment: %d has no committed p25/p75 in sourceColour.ts" % gid)
    p25, p75 = targets[gid]
    a = np.asarray(im.crop(g["crop"])).astype(np.int16)
    sil, interior, colour_from = garment_masks(a, g)
    to_local = to_local_fn(g, sil)

    outer = potrace_polygon(sil)
    w = float(os.environ.get("SSHD_STROKE_%d" % gid, STROKE_W[gid]))
    if w not in OG_WIDTHS:
        raise SystemExit("reauthorGarment: width %s is not an OG width %s" % (w, OG_WIDTHS))

    # ⚠️ TWO GRAMMARS, AND THE DEFAULT IS UNCHANGED. A garment that does not
    # declare `tones` takes the SESSION22 path byte for byte — base p75 over the
    # silhouette, one measured shadow on top. `tones: N` opts into the measured
    # N-tone split (LANE L3B), for the garments whose interior structure is the
    # defect rather than their outline.
    tones = int(os.environ.get("SSHD_TONES_%d" % gid, g.get("tones", 0)))
    if tones:
        regions = tone_regions(a, interior, tones)
        if len(regions) < 2:
            raise SystemExit(
                "reauthorGarment: %d asked for %d tones and the frame yields %d — the garment "
                "may be genuinely flat; drop `tones` rather than painting a split the source "
                "does not show" % (gid, tones, len(regions))
            )
        # The LARGEST region becomes the base under the whole silhouette; the
        # others paint on top. Base-by-area, never base-by-brightness: a garment
        # whose biggest tone is its highlight would otherwise be painted dark and
        # then almost entirely repainted, which reads as a hole if a region's
        # potrace ring drops a component.
        base_i = max(range(len(regions)), key=lambda i: regions[i][0].sum())
        base_col, base_note = regions[base_i][1], regions[base_i][2]
        shadow_col, shadow_note = regions[0][1], regions[0][2]
        paths = ['<path d="%s" fill="#%06x" />' % (ring_path(outer, to_local), base_col)]
        for i, (mask, col, _note) in enumerate(regions):
            if i == base_i:
                continue
            rings = potrace_polygon(mask)
            if rings:
                paths.append('<path d="%s" fill="#%06x" />' % (ring_path(rings, to_local), col))
        tone_notes = [n for _m, _c, n in regions]
    else:
        shadow = potrace_polygon(shadow_mask(a, interior, p25, p75))
        base_col, base_note = pick_tone(p75)
        shadow_col, shadow_note = pick_tone(p25)
        if base_col == shadow_col:
            raise SystemExit(
                "reauthorGarment: %d base and shadow resolve to the same colour #%06x — "
                "the garment may be genuinely flat; that is a MEASURED_FLAT decision, "
                "not a silent merge" % (gid, base_col)
            )
        paths = ['<path d="%s" fill="#%06x" />' % (ring_path(outer, to_local), base_col)]
        if shadow:
            paths.append('<path d="%s" fill="#%06x" />' % (ring_path(shadow, to_local), shadow_col))
        tone_notes = [base_note, shadow_note]

    paths.append(
        '<path d="%s" fill="none" stroke="#000000" stroke-width="%s" />'
        % (ring_path(outer, to_local), ("%g" % w))
    )

    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        "<!-- %s: OG grammar over the SESSION19 trace outline.\n"
        "     tones (darkest first):\n%s\n"
        "     stroke #000000 w %g (OG-quantised)\n"
        "     Regenerate with scripts/art/reauthorGarment.py — traceGarment.py now\n"
        "     REFUSES to clobber this file. -->\n"
        '<svg xmlns="http://www.w3.org/2000/svg">\n'
        '<g transform="matrix(1,0,0,1,0,0)">\n'
        % (AUTHORED_MARK, "\n".join("       %s" % n for n in tone_notes), w)
        + "\n".join(paths)
        + "\n</g>\n</svg>\n"
    )
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, "%d.svg" % gid)
    guard_regression(gid, out_path, svg)
    open(out_path, "w").write(svg)

    return dict(
        outer_rings=len(outer), fills=len(paths) - 1, tones=tone_notes,
        base=base_note, shadow=shadow_note, width=w,
    )


def main():
    ids = [int(x) for x in sys.argv[1:]]
    if not ids:
        raise SystemExit("usage: reauthorGarment.py <id> [<id> ...]")
    targets = committed_targets()
    im = Image.open(os.path.join(ROOT, FRAME)).convert("RGB")
    by_id = {g["id"]: g for g in GARMENTS}
    for gid in ids:
        if gid not in by_id:
            raise SystemExit("reauthorGarment: %d is not a traced garment" % gid)
        r = reauthor(im, by_id[gid], targets)
        print("%5d  %d fill(s), stroke w %g, outer rings %d" % (gid, r["fills"], r["width"], r["outer_rings"]))
        for n in r["tones"]:
            print("       %s" % n)
        print("       -> reference/traced/%d.svg   (next: npx vite-node scripts/art/generate.ts -- %d)"
              % (gid, gid))


if __name__ == "__main__":
    main()
