"""
TRACING CALIBRATION (SESSION 18, for SESSION 19) — how faithfully can a garment
be recovered from video? BUILD-TIME ONLY; never shipped, never imported by src/.

THE PROBLEM: the clothing art is gone with the CDN, so a traced garment cannot be
checked against an original. THE TRICK: a traced BODY PART can be, because we
already hold its exact vector data. So this takes a real OG shape, shrinks it to
the size a garment appears at in the videos, puts it through the same lossy
squeeze, traces it back, and scores the result against the truth we started with.

RESULT, 2026-07-27 — four real OG shapes, at video scale, JPEG q95 and q70:

     shape   world px   video px   jpeg           method     IoU  verts
      2664  12.8x15.3      32x39     95  potrace polygon   0.964     27
      2664  12.8x15.3      32x39     95   potrace curves   0.973     59
      2653  20.4x17.1      52x43     70  potrace polygon   0.947     39
      2646  19.4x23.7      49x60     70  potrace polygon   0.970     53
      2670  14.2x15.0      36x38     70  potrace polygon   0.931     47

  - potrace recovers a KNOWN OG shape to 93-97% area agreement at video scale.
  - JPEG QUALITY BARELY MATTERS: q95 and q70 agree to 3 decimal places.
    Compression is NOT the limiting factor; on-screen SIZE is.
  - POLYGON MODE (-a 0) scores within 1% of curve mode using HALF the vertices,
    and emits `M L L Z`, which is exactly what scripts/art/svgShape.ts accepts.
    Curve mode emits cubic `C`, which that converter THROWS on.

  Size sweep (traceSizeSweep.py): >=20 px tall on screen -> 0.93-0.99, trustworthy.
  ~12 px -> 0.80-0.84, marginal: label INFERRED rather than pretending.

TWO BUGS THIS HARNESS HIT, BOTH SILENT, BOTH WORTH KNOWING:
  1. potrace traces BLACK on WHITE. Feeding it a white shape on black traces the
     BACKGROUND — scores looked like 0.07-0.37 and nothing errored.
  2. potrace emits y UP from the bottom-left; PIL is y DOWN from the top-left.
     Without the flip, scores were 0.15-0.75 and varied with how y-symmetric the
     shape happened to be, which is exactly what a plausible-but-wrong result
     looks like.

CAVEAT, and it bounds every number above: this degrades a CLEAN render. A real
frame adds background clutter, overlapping fighters and motion blur, and the
garment must be separated by colour first. 96% is the CEILING, not the forecast.

Run:  python3 scripts/art/traceCalibration.py     (needs potrace, PIL, numpy)
"""

import json, subprocess, math, os, sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SB = "/private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/6ac0ff27-50b6-4812-94fa-16f9e9f687bc/scratchpad/bakeoff"
SUPER = 8            # supersample factor for the "truth" raster
# The fighter is ~270 px tall in a 1080p frame and ~107 world px tall in the art,
# so one world px is ~2.52 video px. That is the scale a garment is traced at.
VIDEO_PX_PER_WORLD_PX = 270.0 / 107.0

truth = {s["id"]: s for s in json.load(open(f"{SB}/truth.json"))}

def rings_of(shape):
    out = []
    for p in shape["paints"]:
        if p["kind"] == "fill":
            for r in p["rings"]:
                pts = [(r["points"][i], r["points"][i+1]) for i in range(0, len(r["points"]), 2)]
                out.append((pts, r["hole"]))
    return out

def bbox(rings):
    xs = [x for pts,_ in rings for x,_ in pts]; ys = [y for pts,_ in rings for _,y in pts]
    return min(xs), min(ys), max(xs), max(ys)

def rasterise(rings, scale, pad_px, size=None, origin=None):
    """Fill the shape's rings into a 1-bit mask. Holes are punched out."""
    x0,y0,x1,y1 = bbox(rings)
    if origin is None: origin = (x0, y0)
    if size is None:
        size = (int(math.ceil((x1-x0)*scale)) + 2*pad_px, int(math.ceil((y1-y0)*scale)) + 2*pad_px)
    im = Image.new("L", size, 0)
    d = ImageDraw.Draw(im)
    for pts, hole in sorted(rings, key=lambda r: r[1]):     # solids first, holes after
        poly = [((x-origin[0])*scale + pad_px, (y-origin[1])*scale + pad_px) for x,y in pts]
        if len(poly) >= 3: d.polygon(poly, fill=0 if hole else 255)
    return im

def degrade(mask_hi, target_w, target_h, jpeg_q):
    """Shrink to video size and put it through the same lossy squeeze YouTube does."""
    small = mask_hi.resize((target_w, target_h), Image.LANCZOS)
    rgb = Image.merge("RGB", (small, small, small))
    p = f"{SB}/_deg.jpg"; rgb.save(p, "JPEG", quality=jpeg_q); rgb = Image.open(p).convert("L")
    return rgb

def trace_potrace(mask, alphamax, turdsize):
    H = mask.size[1]
    """potrace: bitmap -> polygon. -a 0 forces straight segments, which is what
    our converter accepts (M L Z). Returns rings in mask-pixel coordinates."""
    pbm = f"{SB}/_in.pbm"; svg = f"{SB}/_out.svg"
    # potrace traces BLACK on WHITE — invert, or it traces the background.
    mask.point(lambda v: 0 if v >= 128 else 255).convert("1").save(pbm)
    subprocess.run(["potrace", pbm, "-b", "geojson", "-a", str(alphamax),
                    "-t", str(turdsize), "-o", svg], check=True, capture_output=True)
    gj = json.load(open(svg))
    rings = []
    for feat in gj.get("features", []):
        g = feat["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            for i, ring in enumerate(poly):
                # potrace emits y UP from the bottom-left; PIL is y DOWN from top-left.
                rings.append(([(float(x), H - float(y)) for x, y in ring], i > 0))
    return rings

def iou(a, b):
    A = np.asarray(a, dtype=bool); B = np.asarray(b, dtype=bool)
    inter = np.logical_and(A, B).sum(); union = np.logical_or(A, B).sum()
    return inter / union if union else 0.0

print(f"{'shape':>6} {'world px':>12} {'video px':>10} {'jpeg':>5} {'method':>18} {'IoU':>7} {'verts':>6}")
print("-" * 78)
for sid in [2664, 2653, 2646, 2670]:
    rings = rings_of(truth[sid])
    x0,y0,x1,y1 = bbox(rings)
    w_world, h_world = x1-x0, y1-y0
    vw = max(4, int(round(w_world * VIDEO_PX_PER_WORLD_PX)))
    vh = max(4, int(round(h_world * VIDEO_PX_PER_WORLD_PX)))

    # ground truth, rendered big so the comparison grid is not itself the limit
    PAD = 4
    hi = rasterise(rings, SUPER * VIDEO_PX_PER_WORLD_PX, PAD*SUPER)
    truth_grid = np.asarray(hi.resize((vw + 2*PAD, vh + 2*PAD), Image.LANCZOS)) >= 128

    for jq in (95, 70):
        deg = degrade(hi, vw + 2*PAD, vh + 2*PAD, jq)
        for label, a, t in (("potrace polygon", 0.0, 2), ("potrace curves", 1.0, 2)):
            try:
                tr = trace_potrace(deg, a, t)
            except subprocess.CalledProcessError as e:
                print(f"{sid:>6} {'':>12} {'':>10} {jq:>5} {label:>18}  potrace failed"); continue
            if not tr:
                print(f"{sid:>6} {w_world:>6.1f}x{h_world:<5.1f} {vw:>4}x{vh:<5} {jq:>5} {label:>18} {'EMPTY':>7}"); continue
            re_img = Image.new("L", (vw + 2*PAD, vh + 2*PAD), 0); d = ImageDraw.Draw(re_img)
            for pts, hole in sorted(tr, key=lambda r: r[1]):
                if len(pts) >= 3: d.polygon(pts, fill=0 if hole else 255)
            score = iou(truth_grid, np.asarray(re_img) >= 128)
            nv = sum(len(p) for p,_ in tr)
            print(f"{sid:>6} {w_world:>6.1f}x{h_world:<5.1f} {vw:>4}x{vh:<5} {jq:>5} {label:>18} {score:>7.3f} {nv:>6}")
