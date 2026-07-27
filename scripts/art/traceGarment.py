"""
TRACE ONE GARMENT (SESSION 19 A5.2) — a video frame → an SVG the existing
`scripts/art/svgShape.ts` converter accepts unchanged.

BUILD-TIME ONLY. Reads gitignored `reference/`, writes `reference/traced/<id>.svg`.
Nothing in `src/` may import this.

⛔ THE THREE THINGS THAT SILENTLY PRODUCE A PLAUSIBLE WRONG ANSWER
  1. potrace traces BLACK on WHITE. Hand it white-on-black and it traces the
     BACKGROUND, with no error (SESSION19 §P9 measured 0.07-0.37 IoU that way).
  2. potrace emits y UP from the bottom-left; PIL is y-down. Without the flip the
     shape is mirrored vertically and still looks like a hat.
  3. ISOLATING BY COLOUR PICKS THE BACKGROUND. The blurred scenery is the same
     warm family as straw, and in the chosen frame it is BRIGHTER than the hat.
     Every OG part is bounded by a CLOSED heavy black outline, so the garment is
     found as "the region enclosed by ink", never as "pixels of the right hue".
     This is A5.1's finding F6 arriving on the first garment.

OUTPUT SHAPE — two nested fills, deliberately, not fill+stroke:
  the kasa's dark band is THIN along the top edges and THICK under the brim, and
  a constant-width stroke cannot express that. So the silhouette is emitted as a
  black fill and the enclosed straw as a second fill painted over it. Paint order
  is load-bearing (`ShapeArt.paints`), and back-to-front here means black first.

Run:  python3 scripts/art/traceGarment.py
"""
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(ROOT, "reference", "traced")

# ── the source, fixed by A5.1's ledger ───────────────────────────────────────
FRAME = "reference/frames/s19_trace/zFt_0061.png"
FRAME_T = 590.0
FRAME_VIDEO = "zFtCaTO0_1M"
CROP = (762, 638, 900, 702)          # video px, generous box round the kasa
INK_MAX = 78                          # a pixel this dark is outline, not scenery

# ── scale: video px -> stage px is /1.875, stage -> world is /1.2 ────────────
VIDEO_TO_WORLD = 1.875 * 1.2          # = 2.25

# ── placement: INFERRED. See D-A5.2a in the ledger ───────────────────────────
# Slot 17 is aliased to slot 16, so the kasa's (0,0) must be the HEAD's joint
# pivot. It cannot be registered from the frame: that fighter wears different
# head art (its hair mass measures 20.4x24.0 world px against our shape 2670's
# 14.2x15.0) and stands in a different pose. So the placement is derived from
# OUR OWN head instead, using the one ratio the frame does give.
HEAD_LOCAL_X0, HEAD_LOCAL_X1 = -4.463, 9.750     # shapes 2664 + 2670, union
HEAD_LOCAL_Y0, HEAD_LOCAL_Y1 = -13.500, 4.350
BRIM_DOWN_HEAD = 0.40                 # frame: the brim's lowest point sits ~40%
                                      # down the wearer's head height


def isolate(a):
    """Garment silhouette + its enclosed interior, found by ink, not by hue."""
    mx = np.maximum(np.maximum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    ink = ndimage.binary_closing(mx < INK_MAX, np.ones((3, 3)))
    interiors = ndimage.binary_fill_holes(ink) & ~ink
    lab, n = ndimage.label(interiors, np.ones((3, 3)))
    best, best_area = None, 0
    for i in range(1, n + 1):
        sel = lab == i
        ys, xs = np.where(sel)
        if sel.sum() < 200:
            continue
        if xs.min() == 0 or ys.min() == 0 or xs.max() == sel.shape[1] - 1 or ys.max() == sel.shape[0] - 1:
            continue          # an "interior" that reaches the crop edge is scenery
        if sel.sum() > best_area:
            best, best_area = sel, sel.sum()
    if best is None:
        raise SystemExit("no enclosed region — the outline is not closed in this crop")
    sil = best.copy()
    for _ in range(8):
        sil = ndimage.binary_dilation(sil, np.ones((3, 3))) & (best | ink)
    return ndimage.binary_fill_holes(sil), best


def potrace_polygon(mask):
    """1-bit mask -> list of closed rings, in MASK pixel coords (y down)."""
    h = mask.shape[0]
    with tempfile.TemporaryDirectory() as td:
        pbm, svg = os.path.join(td, "m.pbm"), os.path.join(td, "m.svg")
        # BLACK subject on WHITE ground — silent-bug #1.
        Image.fromarray(np.where(mask, 0, 255).astype(np.uint8), "L").convert("1").save(pbm)
        subprocess.run(["potrace", "-b", "svg", "-a", "0", "-u", "1", pbm, "-o", svg], check=True)
        text = open(svg).read()
    rings, cur, pos, cmd = [], [], (0.0, 0.0), None
    # Tokenise with a regex, not str.split(): potrace writes the close command
    # hard against the last number ("-1z"), so splitting on whitespace hands
    # float() the string "-1z" and the trace dies half way round the outline.
    body = "".join(re.findall(r'\sd="([^"]*)"', text))
    tokens = re.findall(r"[MmLlZz]|-?\d*\.?\d+", body)
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t in "MmLlZz":
            cmd = t
            i += 1
            if cmd in "zZ":
                if len(cur) >= 3:
                    rings.append(cur)
                cur = []
            continue
        if cmd is None:
            raise SystemExit("potrace path data began with a number — refusing to guess")
        x, y = float(tokens[i]), float(tokens[i + 1])
        i += 2
        if cmd in "mM":
            if len(cur) >= 3:
                rings.append(cur)
            cur = []
        pos = (x, y) if cmd in "ML" else (pos[0] + x, pos[1] + y)
        cur.append(pos)
        cmd = "L" if cmd == "M" else "l" if cmd == "m" else cmd
    if len(cur) >= 3:
        rings.append(cur)
    # silent-bug #2: potrace is y-UP from the bottom-left, PIL is y-down.
    return [[(x, h - y) for x, y in r] for r in rings]


def main():
    im = Image.open(os.path.join(ROOT, FRAME)).convert("RGB")
    a = np.asarray(im.crop(CROP)).astype(np.int16)
    sil, interior = isolate(a)
    ys, xs = np.where(sil)
    vx0, vx1 = CROP[0] + xs.min(), CROP[0] + xs.max()
    vy0, vy1 = CROP[1] + ys.min(), CROP[1] + ys.max()
    print("silhouette  x %d..%d  y %d..%d  = %d x %d video px = %.2f x %.2f world px"
          % (vx0, vx1, vy0, vy1, vx1 - vx0 + 1, vy1 - vy0 + 1,
             (vx1 - vx0 + 1) / VIDEO_TO_WORLD, (vy1 - vy0 + 1) / VIDEO_TO_WORLD))

    # colours, measured — median first, or compression speckle wins the vote
    med = np.dstack([ndimage.median_filter(a[:, :, c], size=5) for c in range(3)])
    core = ndimage.binary_erosion(interior, np.ones((3, 3)))
    straw = tuple(int(v) for v in med[core].mean(axis=0).round())
    band = ndimage.binary_erosion(sil & ~interior, np.ones((3, 3)))
    ink_mode = Counter(map(tuple, med[band])).most_common(1)[0][0] if band.sum() > 20 else (0, 0, 0)
    print("straw fill  #%02x%02x%02x (interior MEAN — the mode holds only 1.3%%, so the"
          " interior is not one flat colour; two-tone shading and texture streaks are"
          " flattened and declared)" % straw)
    print("ink   band  measured #%02x%02x%02x -> emitted as #000000" % ink_mode)

    # placement (INFERRED — see the header)
    head_cx = (HEAD_LOCAL_X0 + HEAD_LOCAL_X1) / 2.0
    brim_y = HEAD_LOCAL_Y0 + BRIM_DOWN_HEAD * (HEAD_LOCAL_Y1 - HEAD_LOCAL_Y0)
    sil_cx_video = (vx0 + vx1) / 2.0

    def to_local(px, py):
        vxx, vyy = CROP[0] + px, CROP[1] + py
        return ((vxx - sil_cx_video) / VIDEO_TO_WORLD + head_cx,
                (vyy - vy1) / VIDEO_TO_WORLD + brim_y)

    paths = []
    for mask, colour in ((sil, (0, 0, 0)), (interior, straw)):
        rings = potrace_polygon(mask)
        for ring in rings:
            pts = [to_local(x, y) for x, y in ring]
            d = "M" + " L".join("%.3f %.3f" % p for p in pts) + " Z"
            paths.append('<path d="%s" fill="#%02x%02x%02x" />' % (d, *colour))
        print("  %-9s %d ring(s), %d vertices"
              % ("ink" if colour == (0, 0, 0) else "straw", len(rings), sum(len(r) for r in rings)))

    svg = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<svg xmlns="http://www.w3.org/2000/svg">\n'
           '<g transform="matrix(1,0,0,1,0,0)">\n' + "\n".join(paths) + "\n</g>\n</svg>\n")
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, "9017.svg")
    open(out, "w").write(svg)
    print("wrote %s  (%d paths)" % (os.path.relpath(out, ROOT), len(paths)))


if __name__ == "__main__":
    main()
