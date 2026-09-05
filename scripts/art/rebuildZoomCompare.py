"""
THE LOOK IMAGE (lane L3B) — our dressed render beside the source frame, at MATCHED
HEIGHT and 4x-ish zoom, plus the band measurements the eye cannot take by itself.

⛔ WHY IT EXISTS. SESSION 29 shipped a render that passed every aggregate it had —
silhouette 0.9185 against a 0.9005 floor, aspect within 0.009, white coverage within
0.8pp, dark ink within 0.6pp — and the owner looked at it and said "it didn't look
like the video". `compareToSource.py` had predicted exactly that in its own docstring:
"a silhouette score is blind to colour, to paint order, and to a garment on the wrong
slot ... the loop is a net, not a judge — look at the overlay."

So this script does the two things that were being done by hand:
  1. writes ONE image, both fighters at the same height, so a human comparison is not
     also a mental rescale;
  2. prints the per-band colour + width table, which is where the defects the
     aggregates missed actually show up (the hem 24% too wide, the grey obi that
     should be white, the red-dark kasa that should be golden straw).

⚠️ IT IS NOT A GATE AND MUST NOT BE READ AS ONE. It has no pass/fail, on purpose —
the gate for this lane is the owner's LOOK (§0 artifact A5). This prepares that look
and gives it numbers to argue with. Building an automatic gate that CAN see these
defects is L3B's own design decision, deliberately left open here.

BUILD-TIME ONLY: reads gitignored `reference/`, writes gitignored `renders/`,
imported by nothing in `src/`.

Run:
  npx vite-node scripts/art/renderPose.ts -- dressed \
      --out renders/L3_dressed.png --json renders/L3_dressed.json --supersample 4
  python3 scripts/art/rebuildZoomCompare.py
  python3 scripts/art/rebuildZoomCompare.py --frame reference/frames/s19_trace/zFt_0071.png
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from compareToSource import (  # noqa: E402
    FRAME_BAND,
    TRACING_FRAME,
    bbox,
    figure_of_frame,
    figure_of_render,
)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Fractions of FIGURE HEIGHT. Chosen to isolate the garments the LOOK rejected, not
# to be anatomically tidy — each band is one thing a human can name in the image.
BANDS = (
    (0.00, 0.18, "kasa"),
    (0.18, 0.30, "head/collar"),
    (0.30, 0.52, "gi body"),
    (0.52, 0.62, "obi/waist"),
    (0.62, 0.88, "hakama"),
    (0.88, 1.00, "hem/feet"),
)

MATCH_HEIGHT = 900


def cropped(img, mask):
    y0, y1, x0, x1 = bbox(mask)
    return img[y0:y1, x0:x1], mask[y0:y1, x0:x1], (y0, y1, x0, x1)


def band_stats(img, mask, lo, hi):
    """Mean in-figure colour and mean filled width over a horizontal band."""
    h = img.shape[0]
    m = mask[int(h * lo) : int(h * hi)]
    px = img[int(h * lo) : int(h * hi)][m]
    colour = px.mean(axis=0) if len(px) else np.zeros(3)
    return colour, m.sum(axis=1).mean()


def coverage(img, mask):
    mx, mn = img.max(axis=2), img.min(axis=2)
    white = ((mn > 150) & ((mx - mn) < 45) & mask).sum() / mask.sum()
    dark = ((mx < 90) & mask).sum() / mask.sum()
    return 100 * white, 100 * dark


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--render", default="renders/L3_dressed.png")
    ap.add_argument("--frame", default=TRACING_FRAME)
    ap.add_argument("--out", default="renders/L3_zoom_compare.png")
    args = ap.parse_args()

    frame_path = os.path.join(ROOT, args.frame)
    render_path = os.path.join(ROOT, args.render)
    for p in (frame_path, render_path):
        if not os.path.exists(p):
            raise SystemExit(
                f"rebuildZoomCompare: missing {p}\n"
                "  render first:  npx vite-node scripts/art/renderPose.ts -- dressed "
                "--out renders/L3_dressed.png --json renders/L3_dressed.json --supersample 4"
            )

    # THEIRS. `figure_of_frame` slices rows FRAME_BAND first, so its bbox is band-local
    # and must be lifted back into absolute frame coordinates before cropping the PNG.
    # Getting that wrong crops a patch of blurred background with subtitles on it, which
    # is exactly what happened the first time this was done by hand.
    tfig = figure_of_frame(args.frame)
    ty0, ty1, tx0, tx1 = bbox(tfig)
    ay0, ay1 = ty0 + FRAME_BAND[0], ty1 + FRAME_BAND[0]
    theirs_rgb = np.asarray(
        Image.open(frame_path).convert("RGB").crop((tx0, ay0, tx1, ay1))
    ).astype(int)
    theirs_mask = tfig[ty0:ty1, tx0:tx1]

    # OURS.
    ofig = figure_of_render(args.render)
    ours_rgb, ours_mask, (oy0, oy1, ox0, ox1) = cropped(
        np.asarray(Image.open(render_path).convert("RGB")).astype(int), ofig
    )

    oh, ow = ours_rgb.shape[:2]
    th, tw = theirs_rgb.shape[:2]
    print(f"{'':22} {'OURS':>18}   {'OG':>18}")
    print(f"{'figure w x h':22} {f'{ow} x {oh}':>18}   {f'{tw} x {th}':>18}")
    print(f"{'aspect w/h':22} {ow / oh:>18.3f}   {tw / th:>18.3f}")

    print()
    print("PER-BAND — mean in-figure colour, and mean filled width in the OG's own px")
    print(f"{'band':22} {'OURS rgb':>18} {'w':>7}   {'OG rgb':>18} {'w':>7}   {'width Δ':>8}")
    for lo, hi, name in BANDS:
        c1, w1 = band_stats(ours_rgb, ours_mask, lo, hi)
        c2, w2 = band_stats(theirs_rgb, theirs_mask, lo, hi)
        w1 = w1 * th / oh  # ours, expressed at the OG's scale — heights are matched
        f1 = f"({c1[0]:3.0f},{c1[1]:3.0f},{c1[2]:3.0f})"
        f2 = f"({c2[0]:3.0f},{c2[1]:3.0f},{c2[2]:3.0f})"
        pct = (w1 - w2) / w2 * 100 if w2 else 0.0
        print(f"{name:22} {f1:>18} {w1:7.1f}   {f2:>18} {w2:7.1f}   {pct:+7.1f}%")

    print()
    ow_, od = coverage(ours_rgb, ours_mask)
    tw_, td = coverage(theirs_rgb, theirs_mask)
    print(f"{'white coverage':22} {ow_:17.1f}%   {tw_:17.1f}%")
    print(f"{'dark-ink coverage':22} {od:17.1f}%   {td:17.1f}%")
    print()
    print("⚠️ These aggregates ALL agreed on the render the owner rejected. Read the")
    print("   per-band widths and colours above, and then LOOK AT THE IMAGE.")

    # THE IMAGE. Matched on height — the comparator's own reliable axis.
    def fit(path, box, nearest):
        im = Image.open(os.path.join(ROOT, path)).convert("RGB").crop(box)
        w = max(1, round(im.width * MATCH_HEIGHT / im.height))
        return im.resize((w, MATCH_HEIGHT), Image.NEAREST if nearest else Image.LANCZOS)

    a = fit(args.render, (ox0 - 6, oy0 - 6, ox1 + 6, oy1 + 6), True)
    b = fit(args.frame, (tx0 - 10, ay0 - 10, tx1 + 10, ay1 + 10), False)
    gap = 24
    out = Image.new("RGB", (a.width + gap + b.width, MATCH_HEIGHT), (18, 18, 18))
    out.paste(a, (0, 0))
    out.paste(b, (a.width + gap, 0))
    out.save(os.path.join(ROOT, args.out))
    print(f"\nwrote {args.out}  {out.size}  (ours LEFT, source RIGHT, matched height)")


if __name__ == "__main__":
    main()
