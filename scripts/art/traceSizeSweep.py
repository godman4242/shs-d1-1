"""At what on-screen size does automated tracing stop being trustworthy?
Same real OG shape, rendered at a range of video sizes. Answers: which garments
can we trace, and which are below the resolution of the source."""
import json, sys
sys.path.insert(0, "/private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/6ac0ff27-50b6-4812-94fa-16f9e9f687bc/scratchpad/bakeoff")
from bakeoff import rings_of, bbox, rasterise, degrade, trace_potrace, iou, truth, SUPER
from PIL import Image, ImageDraw
import numpy as np, math

print(f"{'shape':>6} {'video px (w x h)':>18} {'IoU':>7}   trustworthy?")
print("-"*54)
for sid in (2664, 2646):
    rings = rings_of(truth[sid]); x0,y0,x1,y1 = bbox(rings)
    w,h = x1-x0, y1-y0
    for target_h in (12, 20, 30, 45, 60, 90, 140):
        s = target_h / h
        vw, vh = max(4,int(round(w*s))), target_h
        PAD=4
        hi = rasterise(rings, SUPER*s, PAD*SUPER)
        tgrid = np.asarray(hi.resize((vw+2*PAD, vh+2*PAD), Image.LANCZOS)) >= 128
        deg = degrade(hi, vw+2*PAD, vh+2*PAD, 70)
        tr = trace_potrace(deg, 0.0, 2)
        if not tr:
            print(f"{sid:>6} {f'{vw}x{vh}':>18} {'EMPTY':>7}   no"); continue
        im = Image.new("L",(vw+2*PAD,vh+2*PAD),0); d=ImageDraw.Draw(im)
        for pts,hole in sorted(tr,key=lambda r:r[1]):
            if len(pts)>=3: d.polygon(pts, fill=0 if hole else 255)
        sc = iou(tgrid, np.asarray(im)>=128)
        verdict = "YES" if sc>=0.90 else ("marginal" if sc>=0.80 else "NO — label INFERRED")
        print(f"{sid:>6} {f'{vw}x{vh}':>18} {sc:>7.3f}   {verdict}")
    print()
