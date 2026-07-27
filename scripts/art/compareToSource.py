"""
THE COMPARATOR (SESSION 20 A6.2) — our headless render vs a source video frame,
scored whole AND attributed per slot. BUILD-TIME ONLY; reads gitignored
`reference/`, imported by nothing in `src/`.

⛔ WHY IT EXISTS. Every defect in SESSION 19's outfit was found by a human eye,
never by a gate, while the suite sat at 750 green — because nothing in the repo
compared the rendered fighter to the source. A6.1 made the render a file. This
turns two files into a number, and says WHICH GARMENT the error is in.

⭐ IT REUSES `proportions.py` RATHER THAN RE-SEGMENTING. The whole-figure score
here must be comparable with the 0.8294 / 0.8742 / 0.8808 that SESSION 19 A5-E
committed, and those came from that file's two rules — `silhouette_from_frame`
for a video frame, `silhouette_from_render` for one of ours. Writing a second
segmentation would produce a number that looks like A5-E's and is not.

⚠️ REGISTRATION IS THE HARD PART AND IT HAS ALREADY FAILED THREE TIMES. The
source fighter wears DIFFERENT HEAD ART (its hair mass measures 20.4 x 24.0 world
px against our shape 2670's 14.2 x 15.0) and stands in a different pose, so
registering on the head is hopeless. Two axes are reliable and they are the two
used here:
    VERTICAL  — the ground line (the silhouette's lowest row)
    SCALE     — the figure's own height
The THIRD axis has no reliable landmark: horizontal placement uses the figure's
own horizontal centroid, which is a CHOICE, not a measurement, and it is the
weakest link in every number below. It is reported so it can be argued with.

⛔ WHAT A SILHOUETTE CANNOT GRADE. A slot only gets a verdict if its art actually
reaches the figure's outer boundary. The obi and the collar sit INSIDE the
outline; a silhouette says nothing about them, and this reports them as
`interior` rather than inventing a score. §6 Risk 1 of the kickoff is the same
point: the loop is a net, not a judge — look at the overlay.

Run:
  npx vite-node scripts/art/renderPose.ts -- dressed \
      --out renders/dressed.png --mask renders/dressed-mask.png --json renders/dressed.json
  python3 scripts/art/compareToSource.py renders/dressed.json
  python3 scripts/art/compareToSource.py renders/dressed.json --frame reference/frames/s19_trace/zFt_0071.png
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from proportions import DECILES, profile, silhouette_from_frame, silhouette_from_render  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# The frame A5.1 chose by LOOKING: t=590.0s of the watermark-free zFtCaTO0_1M,
# lone fighter, clean side profile — the rig's own view, every garment unoccluded.
TRACING_FRAME = "reference/frames/s19_trace/zFt_0061.png"
# Held out for grading, never traced from (t=595.0s).
HELDOUT_FRAME = "reference/frames/s19_trace/zFt_0071.png"
# The band of a 1080p frame the fighter stands in — the same crop proportions.py
# uses to build its target set, so the segmentation sees the same pixels.
FRAME_BAND = (560, 900)


def figure_of_frame(path):
    a = np.asarray(Image.open(os.path.join(ROOT, path)).convert("RGB")).astype(np.int16)[FRAME_BAND[0]:FRAME_BAND[1]]
    fig = silhouette_from_frame(a)
    if fig is None:
        raise SystemExit(f"compareToSource: no fighter found in {path}")
    return fig


def figure_of_render(path):
    a = np.asarray(Image.open(os.path.join(ROOT, path)).convert("RGB"))
    fig = silhouette_from_render(a)
    if fig is None:
        raise SystemExit(f"compareToSource: no fighter found in {path}")
    return fig


def bbox(fig):
    rows = np.where(fig.any(axis=1))[0]
    cols = np.where(fig.any(axis=0))[0]
    return rows[0], rows[-1], cols[0], cols[-1]


def agreement(a_prof, b_prof):
    """
    Width-profile agreement over the 19 sample heights, 1.000 = identical.

    Per-sample ratio min/max, averaged — the SAME statistic SESSION 19 A5-E
    reported, so 0.8294 here means what 0.8294 meant there. A sample where both
    are zero-width counts as agreement; one where only one is counts as total
    disagreement, which is what a missing limb should score.
    """
    total = 0.0
    for x, y in zip(a_prof, b_prof):
        if x <= 0 and y <= 0:
            total += 1.0
        elif x <= 0 or y <= 0:
            total += 0.0
        else:
            total += min(x, y) / max(x, y)
    return total / len(a_prof)


class Registration:
    """
    Our render placed into the source frame's pixel space.

    ⚠️ The scale is derived from HEIGHT ALONE, so a fighter that is the right
    height and the wrong width scores badly on width — which is the point. Using
    a per-axis scale would hide exactly the error this is built to find.
    """

    def __init__(self, ours, theirs):
        oy0, oy1, ox0, ox1 = bbox(ours)
        ty0, ty1, tx0, tx1 = bbox(theirs)
        self.our_h = oy1 - oy0 + 1
        self.their_h = ty1 - ty0 + 1
        self.scale = self.their_h / self.our_h
        self.our_ground = oy1
        self.their_ground = ty1
        # THE WEAK AXIS, stated: no landmark registers x reliably across a pose
        # change, so the figures are centred on their own horizontal centroids.
        self.our_cx = float(np.average(np.where(ours.any(axis=0))[0], weights=ours.sum(axis=0)[ours.any(axis=0)]))
        self.their_cx = float(np.average(np.where(theirs.any(axis=0))[0], weights=theirs.sum(axis=0)[theirs.any(axis=0)]))

    def to_theirs(self, x, y):
        """A pixel in OUR render -> the pixel in THEIR frame it corresponds to."""
        return (
            self.their_cx + (x - self.our_cx) * self.scale,
            self.their_ground + (y - self.our_ground) * self.scale,
        )

    def describe(self):
        return (
            f"  scale       {self.scale:.4f}  (their {self.their_h} px / our {self.our_h} px, HEIGHT only)\n"
            f"  ground line ours row {self.our_ground}  ->  theirs row {self.their_ground}\n"
            f"  centroid x  ours {self.our_cx:.1f}  ->  theirs {self.their_cx:.1f}   <- the WEAK axis"
        )


def row_extent(fig, row):
    """Leftmost and rightmost ink on one row, or None if the row is empty."""
    if row < 0 or row >= fig.shape[0]:
        return None
    cols = np.where(fig[row])[0]
    return None if cols.size == 0 else (int(cols[0]), int(cols[-1]))


def slot_verdicts(meta, ours, theirs, reg, world_per_px):
    """
    Per-slot signed error, in WORLD px — gate A6-B.

    For each slot, its footprint's own vertical band is walked; on every row the
    figure's outer edges are compared, ours against theirs. A slot is graded only
    where its art IS the outer edge — otherwise the silhouette is describing some
    other garment and the number would be noise wearing a slot's name.
    """
    rx, ry = meta["region"]["x"], meta["region"]["y"]
    out = []
    for entry in meta["slots"]:
        b = entry["bounds"]
        # Stage px -> our render's pixel coordinates (the crop's own origin).
        x0, x1 = b["minX"] - rx, b["maxX"] - rx
        y0, y1 = b["minY"] - ry, b["maxY"] - ry
        rows = range(max(0, int(round(y0))), min(ours.shape[0], int(round(y1)) + 1))

        dl, dr, samples, edge_rows = [], [], 0, 0
        for row in rows:
            ours_e = row_extent(ours, row)
            if ours_e is None:
                continue
            samples += 1
            # Is THIS slot what makes the silhouette's edge on this row? Only
            # then does a source edge on the same row say anything about it.
            on_left = abs(ours_e[0] - x0) <= 1.5
            on_right = abs(ours_e[1] - x1) <= 1.5
            if not (on_left or on_right):
                continue
            tx0, ty0 = reg.to_theirs(ours_e[0], row)
            tx1, _ = reg.to_theirs(ours_e[1], row)
            theirs_e = row_extent(theirs, int(round(ty0)))
            if theirs_e is None:
                continue
            edge_rows += 1
            if on_left:
                dl.append((tx0 - theirs_e[0]) * world_per_px / reg.scale)
            if on_right:
                dr.append((tx1 - theirs_e[1]) * world_per_px / reg.scale)

        left = float(np.mean(dl)) if dl else None
        right = float(np.mean(dr)) if dr else None
        out.append({
            "slot": entry["slot"],
            "shapeIds": entry["shapeIds"],
            "rows": samples,
            "edgeRows": edge_rows,
            # Signed, in world px. + means OUR edge sits further RIGHT than the
            # source's on that side.
            "leftErr": left,
            "rightErr": right,
            # THE TWO NUMBERS GATE A6-B ASKS FOR, and they answer different
            # questions. Both edges pushed the same way is the garment sitting in
            # the wrong PLACE (which D1 lets the loop fix); edges pushed apart is
            # the garment being the wrong SIZE (which it may not).
            "sizeErr": (right - left) if (left is not None and right is not None) else None,
            "offsetErr": ((right + left) / 2) if (left is not None and right is not None) else None,
        })

    # ⛔ THE ABSOLUTE HORIZONTAL OFFSET IS NOT A MEASUREMENT — IT IS THE ANCHOR
    # CHOICE, MEASURED. Re-running this with four different x-anchors (centroid,
    # feet band, pelvis band, bbox centre) moves every slot's `offsetErr` over a
    # 20 world px range. What does NOT move is the DIFFERENCE between slots:
    # kasa-minus-hakama came out 14.40, 14.40, 14.41, 14.40 — identical to two
    # decimals under all four. A whole-figure translation cancels in a
    # difference, and the x-anchor is exactly a whole-figure translation.
    #
    # ⇒ `relOffsetErr` re-expresses every offset against the median slot, so it
    # is invariant to the anchor. **This is the only horizontal placement number
    # A6.4's loop may tune against.** Chasing `offsetErr` would fit the anchor.
    offsets = [v["offsetErr"] for v in out if v["offsetErr"] is not None]
    median = float(np.median(offsets)) if offsets else 0.0
    for v in out:
        v["relOffsetErr"] = None if v["offsetErr"] is None else v["offsetErr"] - median
    return out, median


def overlay(ours, theirs, reg, path):
    """
    ⭐ THE PICTURE. §6 Risk 1: a silhouette score is blind to colour, to paint
    order, and to a garment on the wrong slot — SESSION 19's sleeve-on-the-torso
    would have scored fine. So every run writes an image and a human looks.

    Theirs in RED, ours in CYAN, the agreement in WHITE.
    """
    h, w = theirs.shape
    ours_in_theirs = np.zeros_like(theirs)
    ys, xs = np.where(ours)
    tx, ty = reg.to_theirs(xs, ys)
    tx, ty = np.round(tx).astype(int), np.round(ty).astype(int)
    keep = (tx >= 0) & (tx < w) & (ty >= 0) & (ty < h)
    ours_in_theirs[ty[keep], tx[keep]] = True
    # A nearest-neighbour warp leaves 1px holes when scaling up; close them so
    # the overlay shows shape disagreement rather than resampling lace.
    ours_in_theirs = ndimage.binary_closing(ours_in_theirs, np.ones((3, 3)))

    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    rgb[..., 0] = np.where(theirs, 255, 0)
    rgb[..., 1] = np.where(ours_in_theirs, 255, 0)
    rgb[..., 2] = np.where(ours_in_theirs, 255, 0)
    y0, y1, x0, x1 = bbox(theirs | ours_in_theirs)
    pad = 12
    crop = rgb[max(0, y0 - pad):y1 + pad, max(0, x0 - pad):x1 + pad]
    img = Image.fromarray(crop).resize((crop.shape[1] * 3, crop.shape[0] * 3), Image.NEAREST)
    img.save(os.path.join(ROOT, path))
    return path, int((theirs & ours_in_theirs).sum()), int((theirs | ours_in_theirs).sum())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("meta", help="the --json written by renderPose.ts")
    ap.add_argument("--frame", default=None, help="source frame (default: BOTH the tracing and held-out frames)")
    ap.add_argument("--overlay", default="renders/overlay.png")
    ap.add_argument("--side", default="renders/side_by_side.png",
                    help="ours beside the source at matched height, IN COLOUR")
    args = ap.parse_args()

    meta = json.load(open(os.path.join(ROOT, args.meta) if not os.path.isabs(args.meta) else args.meta))
    png = os.path.join(os.path.dirname(args.meta), f"{meta['variant']}.png")
    ours = figure_of_render(png)
    our_prof = profile(ours)

    # Stage px -> world px: the viewport is a uniform x1.2 (src/core/viewport.ts).
    world_per_px = 1 / 1.2

    frames = [args.frame] if args.frame else [TRACING_FRAME, HELDOUT_FRAME]
    print(f"OURS  {meta['variant']}: {meta['parts']} parts, {meta['ops']} ops, "
          f"render {meta['region']['width']}x{meta['region']['height']}, digest {meta['rasterDigest'][:16]}")
    print(f"      segmented height {our_prof['h']} px   head {our_prof['head']:.3f}  "
          f"shoulder {our_prof['shoulder']:.3f}  mid {our_prof['midTorso']:.3f}  pelvis {our_prof['pelvis']:.3f}")

    results = {}
    for fpath in frames:
        theirs = figure_of_frame(fpath)
        their_prof = profile(theirs)
        reg = Registration(ours, theirs)
        score = agreement(our_prof["profile"], their_prof["profile"])
        results[os.path.basename(fpath)] = score

        print(f"\n=== vs {os.path.basename(fpath)} " + "=" * 46)
        print(reg.describe())
        print(f"  profile agreement  {score:.4f}   (1.000 = identical)")
        print(f"  their landmarks    head {their_prof['head']:.3f}  shoulder {their_prof['shoulder']:.3f}  "
              f"mid {their_prof['midTorso']:.3f}  pelvis {their_prof['pelvis']:.3f}")

        if fpath == frames[0]:
            path, inter, union = overlay(ours, theirs, reg, args.overlay)
            print(f"  overlay            {path}   IoU {inter / union:.4f}   <- LOOK AT IT")
            sp, ow, sw = side_by_side(meta, png, fpath, reg, args.side)
            print(f"  side by side       {sp}   ours {ow}px | theirs {sw}px, matched height")
            verdicts, median = slot_verdicts(meta, ours, theirs, reg, world_per_px)
            print("\n  PER-SLOT SIGNED ERROR, in WORLD px  (+ = our edge is further RIGHT than the source's)")
            print(f"  whole-figure x shift {median:+.2f} — THE ANCHOR CHOICE, NOT A MEASUREMENT. Do not tune against it.")
            print("    slot shapes        rows  edge   leftErr  rightErr   sizeErr   relOffset  <- tune on these two")
            for v in verdicts:
                if v["edgeRows"] == 0:
                    print(f"    {v['slot']:>4} {'+'.join(map(str, v['shapeIds'])):<12} "
                          f"{v['rows']:>4}  {v['edgeRows']:>4}   interior — a silhouette cannot grade it")
                    continue
                fmt = lambda x: "     -  " if x is None else f"{x:+8.2f}"
                print(f"    {v['slot']:>4} {'+'.join(map(str, v['shapeIds'])):<12} "
                      f"{v['rows']:>4}  {v['edgeRows']:>4}  {fmt(v['leftErr'])}  {fmt(v['rightErr'])}  "
                      f"{fmt(v['sizeErr'])}  {fmt(v['relOffsetErr'])}")

    if len(results) > 1:
        print("\n" + "=" * 66)
        for name, score in results.items():
            print(f"  {name}: {score:.4f}")




def side_by_side(meta, ours_png, frame_path, reg, out_path):
    """
    ⭐ THE PICTURE, NOT THE SILHOUETTE — SESSION 21's primary instrument.

    The A6 gate compares WIDTH PROFILES, which are blind to colour, to interior
    detail and to anything inside the outline. This puts our render beside the
    source at MATCHED HEIGHT, in colour, so the two can be judged as pictures.
    Nearest-neighbour on our side (no invented detail), Lanczos on the source
    (it is being enlarged from video).
    """
    src = Image.open(os.path.join(ROOT, frame_path)).convert("RGB")
    theirs = figure_of_frame(frame_path)
    ty0, ty1, tx0, tx1 = bbox(theirs)
    pad = 10
    scrop = src.crop((tx0 - pad, FRAME_BAND[0] + ty0 - pad, tx1 + pad, FRAME_BAND[0] + ty1 + pad))

    ours = Image.open(os.path.join(ROOT, ours_png)).convert("RGB")
    om = silhouette_from_render(np.asarray(ours))
    if om is None:
        raise SystemExit("side_by_side: no fighter found in " + ours_png)
    oy0, oy1, ox0, ox1 = bbox(om)
    opad = max(1, int(round(pad / reg.scale)))
    ocrop = ours.crop((ox0 - opad, oy0 - opad, ox1 + opad, oy1 + opad))

    # Match on HEIGHT, the axis registration trusts.
    target_h = scrop.height * 3
    ow = max(1, int(round(ocrop.width * target_h / ocrop.height)))
    ocrop = ocrop.resize((ow, target_h), Image.NEAREST)
    scrop = scrop.resize((scrop.width * 3, target_h), Image.LANCZOS)

    gap = 16
    canvas = Image.new("RGB", (ocrop.width + gap + scrop.width, target_h), (24, 24, 24))
    canvas.paste(ocrop, (0, 0))
    canvas.paste(scrop, (ocrop.width + gap, 0))
    canvas.save(os.path.join(ROOT, out_path))
    return out_path, ocrop.width, scrop.width

if __name__ == "__main__":
    main()
