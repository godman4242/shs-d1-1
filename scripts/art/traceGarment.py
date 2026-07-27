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
import math
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
INK_MAX = 78                          # a pixel this dark is outline, not scenery

# ── the garments, and the SLOT each one replaces ─────────────────────────────
# A garment is located by a SEED POINT inside it, never by "the biggest region":
# the biggest region in a crop is regularly the blurred background (A5.1 F6), and
# a seed says exactly which enclosed area is meant.
#
# ⚠️ THE SLOT IS CHOSEN BY Z-ORDER, NOT BY ANATOMY. z-order is CREATION order, so
# a higher slot draws IN FRONT. The hakama covers the whole leg, so it goes on
# the CALF (7/11) — which draws in front of the thigh (6/10) and the foot (5/9)
# — and not on the thigh, where the bare calf would draw straight over it.
#
# `part` is the target part's own local bbox (x0, x1, y0, y1), read out of the
# committed shapes. The garment is centred on it — see PLACEMENT below.
GARMENTS = [
    dict(id=9017, slot=17, name="kasa (conical straw hat)",
         crop=(762, 638, 900, 702), seed=(831, 671),
         part=(-4.463, 9.750, -13.500, 4.350), anchor="kasa"),
    dict(id=9012, slot=12, name="collar / juban",
         crop=(806, 688, 858, 742), seed=(841, 702),
         part=(-4.000, 6.350, -11.700, 4.350), anchor="centre"),
    # ⛔ SESSION20 A6.5 — THE OVERSIZE IS NOT THE DEFECT; THE ANCHOR WAS.
    # §P7 read slot 15's 41.1 x 50.4 stage px against a torso of 23.3 x 28.4 and
    # concluded the gi was "1.76x oversized", prescribing a torso-sized panel.
    # MEASURED, that prescription makes the fighter WORSE: carving the sleeve's
    # own region back out (via `isolate` at the same seed) leaves a narrow front
    # STRIP, not a body panel — the torso renders nearly bare — and the sealed
    # score fell 0.8597 -> 0.8010 (held-out 0.8197 -> 0.7963), IoU 0.7160 ->
    # 0.6617. The outer silhouette is correct and deliberate: the near sleeve
    # hides the body, so slot 15 wears the whole outline and slot 19 draws over
    # it. What was actually wrong was `anchor="centre"` — see PLACEMENT below.
    dict(id=9015, slot=15, name="gi body (outer silhouette)",
         crop=(806, 700, 886, 796), seed=(851, 759), mode="outer", grey=(75, 165),
         part=(-9.600, 9.816, -21.550, 2.150), anchor="top"),
    dict(id=9019, slot=19, name="gi sleeve, near arm",
         crop=(826, 704, 878, 792), seed=(851, 759),
         part=(-6.391, 5.802, -5.700, 20.450), anchor="sleeve"),
    dict(id=9001, slot=1, name="gi sleeve, far arm",
         crop=(856, 724, 886, 770), seed=(874, 752),
         part=(-6.391, 5.802, -5.700, 20.450), anchor="sleeve"),
    dict(id=9014, slot=14, name="obi (waist sash)",
         crop=(808, 764, 836, 790), seed=(821, 776),
         part=(-12.500, 7.950, -10.700, 6.450), anchor="centre"),
    dict(id=9011, slot=11, name="hakama leg (drawn at slots 11 AND 7)",
         crop=(789, 778, 860, 894), seed=(825, 848), dropSaya=True,
         part=(-7.150, 4.080, 0.050, 26.600), anchor="hakama"),
    # ⛔ NO FAR-LEG TRACE. The far leg's region is NOT bounded by ink on its
    # right: the outline there IS the scabbard, so `fill_holes` leaks into the
    # background and the silhouette comes back wider than the hakama. Two
    # attempts at excluding the saya by hue both failed the same way, so the far
    # calf REUSES 9011 instead — which is what the OG itself does, drawing shape
    # 2678 at slots 7 and 11 and 2648 at 6 and 10. A frame where the scabbard
    # hangs clear would let this be traced properly; see A5.3 in DIVERGENCES.
]

# ── scale: video px -> stage px is /1.875, stage -> world is /1.2 ────────────
VIDEO_TO_WORLD = 1.875 * 1.2          # = 2.25

# ── tracing fidelity: CHOSEN BY MEASUREMENT, not by eye ──────────────────────
# Kheshav's read of the first traced kasa was "the hat is a bit pointier" and
# "the red does not really match" — both edge-localisation complaints, and both
# answerable with SESSION18's ground-truth trick: take four shapes whose exact
# vector data we hold, shrink them to video scale, degrade them, trace them back
# and score against the truth. Mean IoU over 2664/2670/2646/2653:
#
#     base (threshold at 1x, what shipped first)   0.9735
#     up4  (bicubic 4x, then threshold)            0.9825
#     up8                                          0.9822   <- plateaus, 2x verts
#     up4 + Douglas-Peucker 0.10                   0.9831   <- best, verts ~= base
#
# Upscaling before thresholding does not invent detail; it puts the boundary
# nearer the true 50 % crossing, which is exactly what a sharp corner needs.
# up4+dp.10 cuts the remaining error by 36 % against base for ~20 % more
# vertices. Re-run the A/B before changing either number.
UPSCALE = 4
RDP_EPS = 0.10                        # in 1x mask (video) px

# ── PLACEMENT IS INFERRED, FOR EVERY GARMENT. See D-A5.2b / D-A5.3a ──────────
# A garment's OUTLINE is measured; where it sits on the skeleton is not, and it
# cannot be registered from the frame: that fighter wears different head art (its
# hair mass measures 20.4x24.0 world px against our shape 2670's 14.2x15.0) and
# stands in a different pose from our recorded idle. So each garment is placed
# against OUR OWN part instead — centred on that part's local bbox, at the fixed
# video->world scale. The kasa keeps its own rule, the one ratio the frame gives.
# ⛔ RE-DERIVED IN A5.5, and it moved. The first value (0.40) was a guess at
# where the brim sits on a head the frame does not show. Measured properly from
# zFt_0061: the brim's lowest point is y692, and the wearer's head spans roughly
# y668-718 (its top is occluded by the hat, so it is placed from the visible
# collar upward by our own head+hair height of 40.2 video px). That puts the brim
# 0.60 down the head, not 0.40 — the hat sits DEEPER than I first assumed, which
# is why the dressed figure first measured 14.7 % taller than any source frame.
# NOTE THE ORDERING: this is a frame-derived correction to an INFERRED placement,
# not a nudge to make a height target pass. The resulting height is reported
# below whether it passes or not (kickoff D1).
# ⚙️ SESSION20 A6.4 — SWEEPABLE. `scripts/art/tuneAnchors.py` overrides these
# through the environment so the loop can retrace/rescore without editing source.
# The DEFAULTS below are what ships; an override is a experiment, not a commit.
BRIM_DOWN_HEAD = float(os.environ.get("SSHD_BRIM_DOWN_HEAD", 0.60))

# The hakama covers the WHOLE leg but is drawn from the CALF slot, so centring it
# on the calf's own bbox hangs it ~18 world px too low — measured on screen, the
# skirts float below the hips with bare skin above them. The correction comes out
# of the OG's OWN node data, not off the screen: OG_IDLE_NODES puts the near
# thigh at y -55 and the near calf at y -29, so the hip sits 26 world px ABOVE
# the calf's origin, and the thigh's art starts a further 4.75 px above that.
HIP_ABOVE_CALF = -55.0 - -29.0        # = -26.0, calf-local
THIGH_TOP = -4.750                    # shape 2648's own bbox top
# ⭐ SESSION20 A6.4 — +6 WORLD PX, FITTED BY THE LOOP, AND THE ONLY VARIANT OF
# TWELVE THAT SURVIVED BOTH GUARDS. The node data says where the HIP is; it does
# not say where the WAISTBAND is, and the fabric's top edge hangs below the
# thigh's art top. The loop searched -6..+24:
#     +3  held-out +0.0005      +6  held-out +0.0146  <- taken, height UNCHANGED
#     +15 held-out +0.0309 but the figure GREW 140.5 -> 148.2 stage px, the
#         trousers slid down the thighs and the feet vanished under the hem.
#         The profile score is scale-free and could not see any of it.
# ⚠️ FITTED, not derived — the term above it IS derived from the OG's own nodes.
# Veto: set SSHD_HAKAMA_ADJ=0 and re-run `tuneAnchors.py` to see the trade.
HAKAMA_FIT = 6.0
HAKAMA_TOP = HIP_ABOVE_CALF + THIGH_TOP + HAKAMA_FIT + float(os.environ.get("SSHD_HAKAMA_ADJ", 0.0))


def reject_occluder(a, sil):
    """
    Drop the SAYA from a garment silhouette.

    The sheathed sword crosses the far leg, and it is enclosed by the same ink,
    so "the region inside the outline" swallows it and the traced hakama grows a
    stick-shaped bulge. The scabbard is the only strongly WARM thing touching the
    white hakama, so it separates by hue where nothing else in this frame does.
    Applied only where a garment declares it, never globally.
    """
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    # The scabbard runs from a mid brown into a near-black lacquer, so the
    # threshold has to reach DOWN as well: a first pass at r > 55 left the dark
    # end of it inside the far leg and the bulge survived.
    warm = (r > g + 6) & (g >= b) & (r > 28) & (r < 190) & (r < 255)
    warm = ndimage.binary_closing(warm, np.ones((3, 3)))
    keep = sil & ~warm
    lab, n = ndimage.label(keep, np.ones((3, 3)))
    if n == 0:
        return sil
    sizes = ndimage.sum(keep, lab, range(1, n + 1))
    return ndimage.binary_fill_holes(lab == (int(np.argmax(sizes)) + 1))


def outer_silhouette(a, seed_xy, lo, hi):
    """
    The garment's OUTER boundary, for a part the source cannot show whole.

    The near sleeve hangs over the torso, so the gi BODY is never fully visible
    and "the region enclosed by ink" returns only the strip beside the sleeve.
    The gi's outer edge IS visible, though, so the torso garment is taken as
    (garment-grey OR ink) flood-filled from a seed: that yields the whole gi
    silhouette, which slot 15 wears and the sleeve on slot 19 then draws over —
    exactly the layering the frame shows.
    """
    mx = np.maximum(np.maximum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    mn = np.minimum(np.minimum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    grey = (mn >= lo) & (mx <= hi) & ((mx - mn) < 30)
    m = ndimage.binary_closing(grey | (mx < INK_MAX), np.ones((3, 3)))
    lab, n = ndimage.label(m, np.ones((3, 3)))
    sx, sy = seed_xy
    if lab[sy, sx] == 0:
        raise SystemExit(f"outer seed {seed_xy} is outside the garment mask")
    return ndimage.binary_fill_holes(lab == lab[sy, sx])


def isolate(a, seed_xy):
    """
    Garment silhouette + its enclosed interior, found by INK and named by a SEED.

    `seed_xy` is crop-local. Picking "the biggest enclosed region" chose the
    blurred BACKGROUND on the very first garment (A5.1 F6) — the scenery is the
    same warm family as straw and, in this frame, brighter than the hat.
    """
    mx = np.maximum(np.maximum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    ink = ndimage.binary_closing(mx < INK_MAX, np.ones((3, 3)))
    interiors = ndimage.binary_fill_holes(ink) & ~ink
    lab, n = ndimage.label(interiors, np.ones((3, 3)))
    sx, sy = seed_xy
    which = lab[sy, sx]
    if which == 0:
        raise SystemExit(f"seed {seed_xy} landed on INK, not inside a region — move it")
    best = lab == which
    if best.sum() < 120:
        raise SystemExit(f"seed {seed_xy} found only {int(best.sum())} px — wrong region")
    sil = best.copy()
    for _ in range(8):
        sil = ndimage.binary_dilation(sil, np.ones((3, 3))) & (best | ink)
    return ndimage.binary_fill_holes(sil), best


def rdp(pts, eps):
    """
    Douglas-Peucker on a closed ring: drop any vertex within `eps` of the chord
    it sits on. UPSCALE buys edge accuracy and pays for it in vertices; this
    hands most of them back without moving the boundary — measured below, it
    actually scores HIGHER than the unsimplified upscale, because it also
    removes the single-pixel staircase the upscale introduces.
    """
    if len(pts) < 4 or eps <= 0:
        return pts

    def simplify(seq):
        if len(seq) < 3:
            return list(seq)
        (ax, ay), (bx, by) = seq[0], seq[-1]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy)
        worst, wi = -1.0, 0
        for i in range(1, len(seq) - 1):
            px, py = seq[i]
            d = abs(dx * (ay - py) - (ax - px) * dy) / n if n else math.hypot(px - ax, py - ay)
            if d > worst:
                worst, wi = d, i
        if worst <= eps:
            return [seq[0], seq[-1]]
        return simplify(seq[: wi + 1])[:-1] + simplify(seq[wi:])

    xs = [q[0] for q in pts]
    i0, i1 = sorted((xs.index(min(xs)), xs.index(max(xs))))
    return simplify(pts[i0 : i1 + 1])[:-1] + simplify(pts[i1:] + pts[: i0 + 1])[:-1]


def potrace_polygon(mask):
    """1-bit mask -> list of closed rings, in MASK pixel coords (y down)."""
    img = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8), "L")
    if UPSCALE > 1:
        img = img.resize((img.width * UPSCALE, img.height * UPSCALE), Image.BICUBIC)
    h = img.height
    with tempfile.TemporaryDirectory() as td:
        pbm, svg = os.path.join(td, "m.pbm"), os.path.join(td, "m.svg")
        # BLACK subject on WHITE ground — silent-bug #1.
        img.point(lambda v: 0 if v < 128 else 255).convert("1").save(pbm)
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
    # Divide by UPSCALE on the way out so callers always see 1x mask pixels.
    out = [[(x / UPSCALE, (h - y) / UPSCALE) for x, y in r] for r in rings]
    return [rdp(r, RDP_EPS) for r in out]


def trace_one(im, g):
    a = np.asarray(im.crop(g["crop"])).astype(np.int16)
    cx, cy = g["seed"][0] - g["crop"][0], g["seed"][1] - g["crop"][1]
    colour_from = None
    if g.get("mode") == "outer":
        sil = outer_silhouette(a, (cx, cy), *g["grey"])
        interior = ndimage.binary_erosion(sil, np.ones((5, 5)))
        # Sample the fill from the GARMENT pixels only. Sampling `interior` here
        # averages the heavy black outline in with the cloth and emitted a fill
        # ~20 levels too dark.
        lo, hi = g["grey"]
        mxx = np.maximum(np.maximum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
        mnn = np.minimum(np.minimum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
        colour_from = interior & (mnn >= lo) & (mxx <= hi) & ((mxx - mnn) < 30)
    else:
        sil, interior = isolate(a, (cx, cy))
    if g.get("subtractSeed"):
        # Carve another garment's own enclosed region out of this one — the gi
        # body minus the sleeve that hangs over it (SESSION20 A6.5). Both are
        # found by the SAME `isolate` rule at the SAME seed the sleeve is traced
        # from, so the two shapes cannot disagree about where the sleeve is.
        sx = g["subtractSeed"][0] - g["crop"][0]
        sy = g["subtractSeed"][1] - g["crop"][1]
        lobe, _ = isolate(a, (sx, sy))
        carved = sil & ~ndimage.binary_dilation(lobe, np.ones((3, 3)))
        lab, n = ndimage.label(carved, np.ones((3, 3)))
        if n == 0:
            raise SystemExit(f"{g['id']}: carving the sleeve out left nothing")
        sizes = ndimage.sum(carved, lab, range(1, n + 1))
        sil = ndimage.binary_fill_holes(lab == (int(np.argmax(sizes)) + 1))
        interior = interior & sil
    if g.get("dropSaya"):
        sil = reject_occluder(a, sil)
        interior = interior & sil
    ys, xs = np.where(sil)
    vx0, vx1 = g["crop"][0] + xs.min(), g["crop"][0] + xs.max()
    vy0, vy1 = g["crop"][1] + ys.min(), g["crop"][1] + ys.max()

    med = np.dstack([ndimage.median_filter(a[:, :, c], size=5) for c in range(3)])
    core = ndimage.binary_erosion(colour_from if colour_from is not None else interior, np.ones((3, 3)))
    if core.sum() < 30:
        core = colour_from if colour_from is not None else interior
    fillcol = tuple(int(v) for v in med[core].mean(axis=0).round())

    px0, px1, py0, py1 = g["part"]
    anchor = os.environ.get("SSHD_ANCHOR_%d" % g["id"], g["anchor"])
    if anchor == "kasa":
        ax = (px0 + px1) / 2.0
        ay = py0 + BRIM_DOWN_HEAD * (py1 - py0)
        ref_y = vy1                                   # brim (bottom) anchors
    elif anchor in ("sleeve", "top"):
        # ⛔ CLOTH HANGS FROM THE SHOULDER — IT IS NOT CENTRED ON THE PART.
        # The sleeve's TOP anchors to the upper arm's top; centring would ride it
        # down the forearm. SESSION20 A6.5 found the gi BODY has exactly the same
        # geometry and was centred anyway: the jacket runs shoulder-to-hip, so it
        # is TALLER than the torso part it replaces, and centring a taller shape
        # on a shorter one pushes half the excess UPWARD — which is why the gi's
        # top sat 13 stage px INSIDE the head. Anchoring the top instead puts the
        # whole excess where the garment actually goes: downward, over the hips.
        ax = (px0 + px1) / 2.0
        ay = py0
        ref_y = vy0
    elif anchor == "hakama":
        ax = (px0 + px1) / 2.0
        ay = HAKAMA_TOP
        ref_y = vy0                                   # the waistband anchors
    else:
        ax = (px0 + px1) / 2.0
        ay = (py0 + py1) / 2.0
        ref_y = (vy0 + vy1) / 2.0                     # centre anchors
    ref_x = (vx0 + vx1) / 2.0

    def to_local(px, py):
        vxx, vyy = g["crop"][0] + px, g["crop"][1] + py
        return ((vxx - ref_x) / VIDEO_TO_WORLD + ax, (vyy - ref_y) / VIDEO_TO_WORLD + ay)

    paths, nv = [], 0
    for mask, colour in ((sil, (0, 0, 0)), (interior, fillcol)):
        for ring in potrace_polygon(mask):
            pts = [to_local(x, y) for x, y in ring]
            d = "M" + " L".join("%.3f %.3f" % p for p in pts) + " Z"
            paths.append('<path d="%s" fill="#%02x%02x%02x" />' % (d, *colour))
            nv += len(pts)

    svg = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<svg xmlns="http://www.w3.org/2000/svg">\n'
           '<g transform="matrix(1,0,0,1,0,0)">\n' + "\n".join(paths) + "\n</g>\n</svg>\n")
    os.makedirs(OUT_DIR, exist_ok=True)
    open(os.path.join(OUT_DIR, "%d.svg" % g["id"]), "w").write(svg)
    return dict(vx0=vx0, vx1=vx1, vy0=vy0, vy1=vy1, colour=fillcol, paths=len(paths), verts=nv)


def main():
    im = Image.open(os.path.join(ROOT, FRAME)).convert("RGB")
    print("%5s %-34s %-22s %-9s %6s %6s" % ("id", "garment -> slot", "silhouette (video px)", "fill", "paths", "verts"))
    for g in GARMENTS:
        r = trace_one(im, g)
        print("%5d %-34s x%4d-%4d y%4d-%4d  #%02x%02x%02x %6d %6d"
              % (g["id"], "%s -> %d" % (g["name"][:26], g["slot"]),
                 r["vx0"], r["vx1"], r["vy0"], r["vy1"], *r["colour"], r["paths"], r["verts"]))
        print("      %5.2f x %5.2f world px   -> reference/traced/%d.svg"
              % ((r["vx1"] - r["vx0"] + 1) / VIDEO_TO_WORLD, (r["vy1"] - r["vy0"] + 1) / VIDEO_TO_WORLD, g["id"]))


if __name__ == "__main__":
    main()
