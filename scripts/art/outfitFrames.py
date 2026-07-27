"""
OUTFIT FRAMES (SESSION 19 A5.1) — find the clothed fighter, measure it, and split
its garments by colour, so a tracing frame is CHOSEN on evidence and the numbers
it implies can be re-derived instead of transcribed.

BUILD-TIME ONLY. Reads `reference/` (gitignored, study-only) and writes nothing
into the game. Nothing in `src/` may ever import this — a runtime read of
`reference/` is the bug SESSION16 finding 4 caught.

WHY IT EXISTS, given `frameIndex.py` already ranks frames:
  frameIndex ranks by SHARPNESS, which cannot tell the player from the enemy,
  from a fence post, or from a slash VFX. Tracing needs one specific fighter,
  unoccluded. This finds it by COLOUR and then verifies by rendering.

THREE THINGS IT DOES, and the bug each one exists to have caught:

  scan     rank frames by "the player's outfit is present, large and alone".
           v1 of this used per-column runs and reported the full 500-row band,
           because one stray white pixel at the top of a column set y0. Connected
           components fixed it.

  measure  silhouette + row-by-row width profile, in VIDEO px, plus a rendered
           mask overlay. ⛔ SEGMENT ON SHARPNESS, NOT COLOUR: the blurred
           background is the same olive/tan family as a straw kasa and the grass
           is the same family as a black outline, so a colour mask leaks into
           both. ⛔ AND SUPPRESS THE HUD: the yellow nameplate, the watermark and
           the green health bar are all SHARP, so a sharpness mask keeps them and
           a closing then welds them onto the kasa — which is how a fighter
           measured 269 px tall when it is 233. ALWAYS LOOK AT THE OVERLAY.

  clusters garment colours derived from the mask by quantising its interior,
           rendered as a colour-keyed map. Hand-picked sample windows are how
           three "garment" colours came back as the background.

Run:
  python3 scripts/art/outfitFrames.py scan     reference/frames
  python3 scripts/art/outfitFrames.py measure  <frame> x0 y0 x1 y1 <out.png>
  python3 scripts/art/outfitFrames.py clusters <frame> x0 y0 x1 y1 <out.png>

Video px -> stage px is /1.875 (1920 wide video, 1024 wide OG stage).
"""
import glob
import os
import sys
from collections import Counter

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

FULL_RES = (1920, 1080)
VIDEO_TO_STAGE = 1.875
BAND = (480, 1000)          # rows the fighter lives in; HUD above, ground below


# ---------------------------------------------------------------- shared masks

def _hud(a):
    """The HUD is sharp, so a sharpness mask keeps it. Kill it by colour."""
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    yellow = (r > 150) & (g > 105) & (b < 110) & (r > b + 70)   # nameplate/watermark
    green = (g > 95) & (g > r + 35) & (g > b + 35)              # health bar
    red = (r > 140) & (r > g + 80) & (r > b + 80)               # damage numbers
    return ndimage.binary_dilation(yellow | green | red, np.ones((7, 7)))


def silhouette(a):
    """Fighter mask: the only object in the scene that is not depth-blurred."""
    lum = a.mean(axis=2)
    gx = np.zeros_like(lum)
    gy = np.zeros_like(lum)
    gx[:, :-1] = np.abs(np.diff(lum, axis=1))
    gy[:-1, :] = np.abs(np.diff(lum, axis=0))
    strong = ((gx + gy) > 34) & ~_hud(a)

    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    bright = (mn > 140) & ((mx - mn) < 45)      # hakama / collar interior
    grey = (mn > 95) & (mn <= 140) & ((mx - mn) < 40)   # gi interior

    lab_b, nb = ndimage.label(bright)
    if nb == 0:
        return None
    sizes = ndimage.sum(bright, lab_b, range(1, nb + 1))
    ys, xs = ndimage.find_objects(lab_b)[int(np.argmax(sizes))]
    sy, sx = (ys.start + ys.stop) // 2, (xs.start + xs.stop) // 2

    lab, _ = ndimage.label(ndimage.binary_closing(strong | bright | grey, np.ones((9, 9))),
                           np.ones((3, 3)))
    if lab[sy, sx] == 0:
        return None
    fig = ndimage.binary_fill_holes(lab == lab[sy, sx])
    # shave the closing's dilation back off, or every width is inflated by it
    return ndimage.binary_fill_holes(ndimage.binary_erosion(fig, np.ones((5, 5))))


# ------------------------------------------------------------------------ scan

def scan(root):
    rows = []
    for p in sorted(glob.glob(os.path.join(root, "**", "*.png"), recursive=True)):
        try:
            im = Image.open(p).convert("RGB")
        except Exception:
            continue
        if im.size != FULL_RES:
            continue
        a = np.asarray(im).astype(np.int16)[BAND[0]:BAND[1]]
        r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
        mx = np.maximum(np.maximum(r, g), b)
        mn = np.minimum(np.minimum(r, g), b)
        white = (mn > 140) & ((mx - mn) < 45)
        lab, n = ndimage.label(ndimage.binary_closing(white, np.ones((5, 5))))
        if n == 0:
            continue
        sizes = ndimage.sum(white, lab, range(1, n + 1))
        i = int(np.argmax(sizes))
        if sizes[i] < 900:
            continue
        ys, xs = ndimage.find_objects(lab)[i]
        rows.append({
            "rel": os.path.relpath(p), "px": int(sizes[i]),
            "x0": int(xs.start), "x1": int(xs.stop),
            "y0": int(BAND[0] + ys.start), "y1": int(BAND[0] + ys.stop),
            "others": int((sizes > 700).sum() - 1),
        })
    rows.sort(key=lambda d: (d["others"], -d["px"]))
    print("%-62s %7s %7s %6s %6s" % ("frame", "hakama", "others", "x0", "y0"))
    for d in rows[:40]:
        print("%-62s %7d %7d %6d %6d" % (d["rel"], d["px"], d["others"], d["x0"], d["y0"]))
    print("\n%d frames hold a large white-hakama blob. 'others' = other such blobs;"
          " 0-1 means the fighter is alone. CROP AND LOOK before believing a row." % len(rows))


# --------------------------------------------------------------------- measure

def measure(path, x0, y0, x1, y1, out):
    im = Image.open(path).convert("RGB")
    sub = im.crop((x0, y0, x1, y1))
    a = np.asarray(sub).astype(np.int16)
    fig = silhouette(a)
    if fig is None:
        print("no fighter in that crop")
        return
    ov = np.asarray(sub).copy()
    ov[fig ^ ndimage.binary_erosion(fig, np.ones((3, 3)))] = [255, 30, 30]
    canvas = Image.new("RGB", ((x1 - x0) * 4 + 118, (y1 - y0) * 4), (16, 16, 16))
    canvas.paste(Image.fromarray(ov).resize(((x1 - x0) * 4, (y1 - y0) * 4), Image.NEAREST), (118, 0))
    d = ImageDraw.Draw(canvas)
    for yy in range(0, y1 - y0):
        if (y0 + yy) % 10:
            continue
        d.line([(112, yy * 4), (canvas.width, yy * 4)], fill=(70, 70, 70))
        d.text((3, max(0, yy * 4 - 5)), "y%4d w%3d" % (y0 + yy, int(fig[yy].sum())),
               fill=(255, 235, 120))
    canvas.save(out)

    rows = np.where(fig.any(axis=1))[0]
    cols = np.where(fig.any(axis=0))[0]
    h = rows[-1] - rows[0] + 1
    print("frame  %s" % path)
    print("crop   (%d,%d)-(%d,%d)     overlay -> %s   LOOK AT IT" % (x0, y0, x1, y1, out))
    print("bbox   x %d..%d  y %d..%d" % (x0 + cols[0], x0 + cols[-1], y0 + rows[0], y0 + rows[-1]))
    print("HEIGHT %d video px = %.1f stage px" % (h, h / VIDEO_TO_STAGE))
    print("\n  y(video)  w_video  w_stage   x-extent")
    for yy in range(rows[0], rows[-1] + 1, 3):
        xs = np.where(fig[yy])[0]
        if xs.size:
            w = int(fig[yy].sum())
            print("  %8d %8d %8.1f   %d..%d" % (y0 + yy, w, w / VIDEO_TO_STAGE, x0 + xs[0], x0 + xs[-1]))


# -------------------------------------------------------------------- clusters

KEYCOLS = [(255, 60, 60), (60, 200, 255), (255, 220, 60), (120, 255, 120),
           (255, 130, 240), (255, 160, 40), (150, 150, 255), (0, 255, 190), (200, 200, 200)]


def clusters(path, x0, y0, x1, y1, out):
    im = Image.open(path).convert("RGB")
    sub = im.crop((x0, y0, x1, y1))
    a = np.asarray(sub).astype(np.int16)
    fig = silhouette(a)
    if fig is None:
        print("no fighter in that crop")
        return
    core = ndimage.binary_erosion(fig, np.ones((3, 3)))   # drop the anti-aliased rim
    q = (a // 16).astype(np.int32)
    key = q[:, :, 0] * 4096 + q[:, :, 1] * 64 + q[:, :, 2]
    vals, counts = np.unique(key[core], return_counts=True)
    tot = int(core.sum())
    picked = []
    print("frame %s   interior %d px" % (path, tot))
    print("%-9s %6s   centroid       y-extent" % ("mode", "share"))
    for i in np.argsort(counts)[::-1]:
        sel = core & (key == vals[i])
        n = int(sel.sum())
        if n < tot * 0.02:
            continue
        mode = Counter(map(tuple, a[sel])).most_common(1)[0][0]
        ys, xs = np.where(sel)
        picked.append((mode, sel, n))
        print("#%02x%02x%02x %5.1f%%   (%4d,%4d)     y %d..%d" % (
            mode[0], mode[1], mode[2], 100.0 * n / tot,
            x0 + int(xs.mean()), y0 + int(ys.mean()), y0 + ys.min(), y0 + ys.max()))
        if len(picked) == len(KEYCOLS):
            break

    Z, W, H = 5, x1 - x0, y1 - y0
    canvas = Image.new("RGB", (W * Z * 2 + 12, H * Z), (16, 16, 16))
    canvas.paste(sub.resize((W * Z, H * Z), Image.NEAREST), (0, 0))
    cm = np.zeros((H, W, 3), np.uint8)
    for i, (_, sel, _) in enumerate(picked):
        cm[sel] = KEYCOLS[i]
    canvas.paste(Image.fromarray(cm).resize((W * Z, H * Z), Image.NEAREST), (W * Z + 12, 0))
    d = ImageDraw.Draw(canvas)
    for i, (mode, _, n) in enumerate(picked):
        d.rectangle([W * Z + 18, 8 + i * 22, W * Z + 40, 26 + i * 22], fill=KEYCOLS[i])
        d.text((W * Z + 46, 10 + i * 22), "#%02x%02x%02x  %.1f%%" %
               (mode[0], mode[1], mode[2], 100.0 * n / tot), fill=(255, 255, 255))
    canvas.save(out)
    print("wrote %s   LOOK AT IT — name each cluster by where it sits on the body." % out)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "scan":
        scan(sys.argv[2])
    elif cmd in ("measure", "clusters"):
        fn = measure if cmd == "measure" else clusters
        fn(sys.argv[2], *map(int, sys.argv[3:7]), sys.argv[7])
    else:
        print(__doc__)
