"""
FRAME INDEX (SESSION 18, for SESSION 19) — where is the fighter, in which frame?
BUILD-TIME ONLY; writes to reference/ (gitignored), never read at runtime.

WHY: finding "a frame where the trousers are unoccluded, and where in the picture"
was done by cropping and guessing, and got it wrong three times in a row. The
fighters are the only hard-edged, high-contrast objects in a scene whose
background is deliberately blurred, so they can be located automatically.

METHOD: the background is deliberately DEPTH-BLURRED and the fighters are not,
so SHARPNESS separates them — darkness does not (tree trunks and fence posts are
just as dark, which made a first attempt report the full frame width). Score each
column by how much high-frequency detail it holds, keep the columns well above the
frame's own median, and report a bounding box per run. Deliberately crude — this
is an INDEX to point a human at a frame, never a measurement. Eyeball what it says.

ACCURACY, measured by cropping what it reports and looking (2026-07-27):
  - it is a SHORTLIST GENERATOR, not a locator. On the frame checked it returned
    two boxes: one was a fence post (false positive), the other landed squarely on
    the fighters — but on BOTH of them, merged into one box.
  - so: trust the RANKING, crop what it points at, and look before believing it.
    That is still the difference between "here are eight ranked candidates" and
    the guess-and-crop it replaced, which got it wrong three times running.
  - 448 full-res frames indexed, including a session11/ tree an earlier manual
    census missed entirely — which is itself an argument for indexing.

Run:  python3 scripts/art/frameIndex.py
Out:  reference/frames/INDEX.json   +  a printed summary
"""
import json, glob, os
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRAMES = os.path.join(ROOT, "reference", "frames")
FULL_RES = (1920, 1080)
# The play area: HUD lives top and bottom, so restrict to the middle band.
BAND_TOP, BAND_BOTTOM = 0.50, 0.88
SHARP_MULT = 3.0   # a figure column is this many times the frame's median detail
MIN_WIDTH = 25     # narrower than this is scenery, not a fighter
MERGE_GAP = 12     # runs closer than this are one figure (a limb gap, not two people)

def figures(path):
    im = Image.open(path).convert("L")
    if im.size != FULL_RES:
        return None
    a = np.asarray(im).astype(np.int16)
    y0, y1 = int(a.shape[0] * BAND_TOP), int(a.shape[0] * BAND_BOTTOM)
    band = a[y0:y1]

    # Local detail = absolute horizontal + vertical gradient. Blurred scenery has
    # almost none; a hard black outline has a lot.
    gx = np.abs(np.diff(band, axis=1)); gy = np.abs(np.diff(band, axis=0))
    detail = np.zeros_like(band)
    detail[:, :-1] += gx; detail[:-1, :] += gy
    strong = detail > 40
    cols = strong.sum(axis=0)
    med = max(1.0, float(np.median(cols)))
    hits = cols >= med * SHARP_MULT

    runs, start = [], None
    for x, on in enumerate(hits):
        if on and start is None: start = x
        elif not on and start is not None:
            runs.append((start, x)); start = None
    if start is not None: runs.append((start, len(hits)))

    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] <= MERGE_GAP: merged[-1] = (merged[-1][0], r[1])
        else: merged.append(list(r) if False else (r[0], r[1]))
    merged = [(a_, b_) for a_, b_ in merged if b_ - a_ >= MIN_WIDTH]

    out = []
    for x0, x1 in merged:
        rows = np.where(strong[:, x0:x1].any(axis=1))[0]
        if rows.size == 0: continue
        out.append({"x0": int(x0), "x1": int(x1),
                    "y0": int(y0 + rows[0]), "y1": int(y0 + rows[-1]),
                    "w": int(x1 - x0), "h": int(rows[-1] - rows[0])})
    return out

def main():
    files = sorted(f for f in glob.glob(f"{FRAMES}/**/*", recursive=True)
                   if f.lower().endswith((".png", ".jpg")))
    index, full = {}, 0
    for f in files:
        figs = figures(f)
        if figs is None: continue
        full += 1
        rel = os.path.relpath(f, ROOT)
        gap = None
        if len(figs) == 2:
            gap = figs[1]["x0"] - figs[0]["x1"]
        index[rel] = {"figures": figs, "count": len(figs), "gapPx": gap,
                      "separated": bool(gap is not None and gap > 0)}
    out = os.path.join(FRAMES, "INDEX.json")
    with open(out, "w") as fh: json.dump(index, fh, indent=1)

    sep = {k: v for k, v in index.items() if v["separated"]}
    solo = {k: v for k, v in index.items() if v["count"] == 1}
    print(f"indexed {full} full-res frames -> {os.path.relpath(out, ROOT)}")
    print(f"  {len(solo)} with ONE figure · {len(sep)} with TWO, separated by a gap")
    print("\nBEST TRACING CANDIDATES — one figure, tallest first:")
    for k, v in sorted(solo.items(), key=lambda kv: -kv[1]["figures"][0]["h"])[:8]:
        f = v["figures"][0]
        print(f"  {f['h']:>4}px tall  crop ({f['x0']},{f['y0']})-({f['x1']},{f['y1']})  {k}")
    print("\nTWO FIGURES, WIDEST GAP FIRST (both traceable):")
    for k, v in sorted(sep.items(), key=lambda kv: -(kv[1]["gapPx"] or 0))[:6]:
        print(f"  gap {v['gapPx']:>4}px  {k}")

if __name__ == "__main__":
    main()
