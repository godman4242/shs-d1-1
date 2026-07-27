"""
PROPORTIONS (SESSION 19 A5.5) — one rule, applied to BOTH the source frames and
our own render, so the comparison is like-for-like.

BUILD-TIME ONLY. Reads gitignored `reference/`; imported by nothing in `src/`.

WHY THIS EXISTS RATHER THAN REUSING `combat_idle_measurements.md`:
A5.1 showed that document's landmark rows are HUD-CONTAMINATED — it calls rows
616-638 "Kasa (hat)" on a frame where those rows are the green health bar and the
watermark, and the fighter's topmost pixel is y641. Every landmark below inherits
the shift, so its "head, ~55 px" is the kasa BRIM and its "shoulders ~80 px at
row 683" is still hat. Its widths cannot be used as targets.

⛔ THE ORDERING RULE (kickoff D1): TRACE, THEN MEASURE — NEVER MEASURE, THEN
ADJUST. The targets are produced from the frames FIRST and committed, and only
then is our fighter measured against them. A target set derived after seeing the
result is a mirror, not a test.

⭐ WHY A PROFILE AND NOT FOUR LANDMARKS: "shoulder width" needs a rule for WHICH
row is the shoulder, and picking that row by eye on a blurred frame is exactly
how the old numbers went wrong. So the primary comparison is the whole
width-vs-height profile, normalised to the figure's own height — objective, and
it cannot be gamed by choosing a flattering row. The four landmark widths are
reported too, from ONE stated automatic rule, so A5-C stays gradeable.

Run:
  python3 scripts/art/proportions.py frames          # the target set
  python3 scripts/art/proportions.py image <png>     # one rendered image
"""
import glob
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DECILES = [i / 20.0 for i in range(1, 20)]      # 5 % .. 95 % of the height


def hud_mask(a):
    """The HUD is SHARP, so a sharpness mask keeps it and a closing welds it to
    the kasa — the exact mechanism that made the old height 30 px too tall."""
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    return ndimage.binary_dilation(
        ((r > 150) & (g > 105) & (b < 110) & (r > b + 70))
        | ((g > 95) & (g > r + 35) & (g > b + 35))
        | ((r > 140) & (r > g + 80) & (r > b + 80)),
        np.ones((7, 7)),
    )


def silhouette_from_frame(a):
    """The fighter is the only object in a video frame that is not depth-blurred."""
    lum = a.mean(axis=2)
    gx = np.zeros_like(lum)
    gy = np.zeros_like(lum)
    gx[:, :-1] = np.abs(np.diff(lum, axis=1))
    gy[:-1, :] = np.abs(np.diff(lum, axis=0))
    strong = ((gx + gy) > 34) & ~hud_mask(a)
    mx = np.maximum(np.maximum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    mn = np.minimum(np.minimum(a[:, :, 0], a[:, :, 1]), a[:, :, 2])
    bright = (mn > 140) & ((mx - mn) < 45)
    grey = (mn > 95) & (mn <= 140) & ((mx - mn) < 40)
    lab_b, nb = ndimage.label(bright)
    if nb == 0:
        return None
    sizes = ndimage.sum(bright, lab_b, range(1, nb + 1))
    ys, xs = ndimage.find_objects(lab_b)[int(np.argmax(sizes))]
    sy, sx = (ys.start + ys.stop) // 2, (xs.start + xs.stop) // 2
    lab, _ = ndimage.label(ndimage.binary_closing(strong | bright | grey, np.ones((9, 9))), np.ones((3, 3)))
    if lab[sy, sx] == 0:
        return None
    fig = ndimage.binary_fill_holes(lab == lab[sy, sx])
    return ndimage.binary_fill_holes(ndimage.binary_erosion(fig, np.ones((5, 5))))


def silhouette_from_render(a, backdrop=None, tol=48):
    """
    Our canvas is TRANSPARENT, so the figure is "anything that is not the
    backdrop" — but the screenshot is JPEG, so the backdrop is not one exact
    value and a naive threshold marks the WHOLE IMAGE as figure. Two guards:
    the backdrop colour is taken from the image's own corners rather than
    assumed, and any component touching the border is background by definition.
    """
    a = a.astype(int)
    if backdrop is None:
        corners = np.concatenate([a[:6, :6].reshape(-1, 3), a[:6, -6:].reshape(-1, 3),
                                  a[-6:, :6].reshape(-1, 3), a[-6:, -6:].reshape(-1, 3)])
        backdrop = np.median(corners, axis=0)
    d = np.abs(a - np.array(backdrop)).sum(axis=2)
    m = ndimage.binary_closing(d > tol, np.ones((3, 3)))
    lab, n = ndimage.label(m)
    if n == 0:
        return None
    border = set(lab[0].tolist()) | set(lab[-1].tolist()) | set(lab[:, 0].tolist()) | set(lab[:, -1].tolist())
    best, best_size = None, 0
    for i in range(1, n + 1):
        if i in border:
            continue
        sz = int((lab == i).sum())
        if sz > best_size:
            best, best_size = i, sz
    if best is None:
        return None
    return ndimage.binary_fill_holes(lab == best)


def profile(fig):
    """Normalised width profile + the four landmark widths, as FRACTIONS of the
    figure's own height — so two figures at different scales compare directly."""
    rows = np.where(fig.any(axis=1))[0]
    y0, y1 = rows[0], rows[-1]
    h = y1 - y0 + 1
    w = fig.sum(axis=1).astype(float)
    prof = [w[int(round(y0 + f * (h - 1)))] / h for f in DECILES]

    # ONE stated rule for the landmarks, applied identically to every image:
    #   kasa/head band = the top 25 % of the figure; the hat's brim is its widest
    #   row, and the head is the NARROWEST row below that brim.
    #   shoulder  = widest row in 25-40 %      mid-torso = width at 50 %
    #   pelvis    = widest row in 55-70 %
    band = lambda lo, hi: w[int(round(y0 + lo * (h - 1))): int(round(y0 + hi * (h - 1))) + 1]
    top = band(0.0, 0.25)
    brim = int(np.argmax(top))
    head = float(np.min(top[brim:])) if brim < len(top) - 1 else float(top[-1])
    return {
        "h": int(h), "profile": prof,
        "head": head / h, "shoulder": float(band(0.25, 0.40).max()) / h,
        "midTorso": float(w[int(round(y0 + 0.50 * (h - 1)))]) / h,
        "pelvis": float(band(0.55, 0.70).max()) / h,
    }


def show(tag, p):
    print("%-34s h=%3d  head %.3f  shoulder %.3f  mid %.3f  pelvis %.3f"
          % (tag, p["h"], p["head"], p["shoulder"], p["midTorso"], p["pelvis"]))


def frames():
    """The target set: the GREY outfit, lone and standing, HUD suppressed."""
    picks = sorted(glob.glob(os.path.join(ROOT, "reference/frames/s19_trace/zFt_00[567]*.png")))
    boxes = {}
    out, rejected = [], []
    for p in picks:
        a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)[560:900]
        fig = silhouette_from_frame(a)
        if fig is None:
            continue
        pr = profile(fig)
        # TWO STATED REJECTIONS, both applied before any number is read:
        #  (1) height outside 200-280 video px — the mask merged with scenery;
        #  (2) head wider than 0.30 of the figure's height — physically
        #      impossible under a hat, so the segmentation failed. Two frames of
        #      fifteen fail this (head 1.556 and 0.577); leaving them in moved
        #      the head mean from 0.16 to 0.30 and its sd to 0.35.
        if not (200 <= pr["h"] <= 280) or pr["head"] > 0.30:
            rejected.append((os.path.basename(p), pr["h"], pr["head"]))
            continue
        out.append(pr)
        show(os.path.basename(p), pr)
        boxes[p] = pr["h"]
    if not out:
        print("no usable frames")
        return
    print("-" * 86)
    for name, h, hd in rejected:
        print("REJECTED %-22s h=%d head=%.3f  (segmentation failed — stated rule)" % (name, h, hd))
    if rejected:
        print("-" * 86)
    keys = ["head", "shoulder", "midTorso", "pelvis"]
    print("TARGETS from %d frames — as a FRACTION of the figure's own height" % len(out))
    for k in keys:
        v = np.array([o[k] for o in out])
        print("  %-9s mean %.4f   sd %.4f   range %.4f .. %.4f" % (k, v.mean(), v.std(), v.min(), v.max()))
    prof = np.array([o["profile"] for o in out])
    print("  height in video px: mean %.1f  range %d .. %d"
          % (np.mean([o["h"] for o in out]), min(o["h"] for o in out), max(o["h"] for o in out)))
    print("\n  normalised width profile (width / height), by %% of height:")
    for i, f in enumerate(DECILES):
        print("    %3d%%  mean %.4f  sd %.4f" % (round(f * 100), prof[:, i].mean(), prof[:, i].std()))


def image(path):
    a = np.asarray(Image.open(path).convert("RGB"))
    fig = silhouette_from_render(a)
    if fig is None:
        print("nothing found")
        return
    pr = profile(fig)
    show(os.path.basename(path), pr)
    print("\n  normalised width profile (width / height), by %% of height:")
    for f, v in zip(DECILES, pr["profile"]):
        print("    %3d%%  %.4f" % (round(f * 100), v))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "frames":
        frames()
    elif len(sys.argv) > 2 and sys.argv[1] == "image":
        image(sys.argv[2])
    else:
        print(__doc__)
