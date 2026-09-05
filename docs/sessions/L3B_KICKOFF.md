# L3B KICKOFF — MAKE THE FIGHTER LOOK LIKE THE VIDEO

**Written 2026-09-05, after the owner's LOOK rejected L3's render.** Paste the `text`
block below as the FIRST message of a fresh session. It carries the verdict, the
measurements, the traps and the gate.

**Why this lane exists, in one line:** four independent aggregate measures said the
fighter matched, and the owner looked at it and said it didn't. The lane is to close
that gap and to build the check that would have caught it.

---

## text

```
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me your plan before you write anything:
- RESUME_HERE.md            <- top block is SESSION 29; L3 data + contract CLOSED, ART is OPEN
- docs/GAUNTLET.md          <- §0 the law (A1..A5), §2 lane board, §2.2 the paperdoll numbers
- docs/DIVERGENCES.md       <- the FOUR "LANE L3" sections at the end; the last one is the
                               owner's REJECT and the measurements that go with it
- renders/L3_zoom_compare.png  <- ours (left) vs the OG frame (right), matched height. LOOK AT IT.
  ⚠️ renders/ is GITIGNORED, so that file may not exist in your checkout. Rebuild it —
  and rebuild it again after every change, because it IS the gate:
    npm run dev >/dev/null 2>&1 &
    npx vite-node scripts/art/renderPose.ts -- dressed --out renders/L3_dressed.png \
        --json renders/L3_dressed.json --supersample 4
    python3 scripts/art/rebuildZoomCompare.py

THE VERDICT THAT OPENED THIS LANE (owner, 2026-09-05, logged as A5):
  "to be fair it ddint lok liek the video i sent"

⚠️ THE FINDING THAT MATTERS MORE THAN THE VERDICT. Every aggregate measure PASSED:
  silhouette 0.9185 (floor 0.9005) · aspect 0.521 vs 0.530 · white coverage 31.0% vs
  31.8% · dark-ink 32.2% vs 31.6%.
compareToSource.py's own docstring predicted it — "a silhouette score is blind to
colour, to paint order, and to a garment on the wrong slot... the loop is a net, not a
judge". The net caught nothing. SO: a gate four aggregates pass while the owner rejects
the render is not measuring the thing this lane is for. Building a check that CAN see
what the eye sees is half this lane's job — not an optional extra.

GOAL: the dressed fighter reads as the video's fighter at 4x zoom, and a committed gate
fails when it doesn't.

THE MEASURED GAP LIST — all from zFt_0061.png this session, ranked by how much each
one costs the read. Bands are fractions of figure height; widths are mean filled px at
the OG's own scale.

  1. HAKAMA SILHOUETTE — the biggest single defect.
     hem/feet band (0.88-1.00): ours width 85.3 vs OG 69.0 — ours is 24% TOO WIDE.
     Ours splits into two bulbous separated legs and shows both sandals; the OG is ONE
     tapering column to the ground with a thin centre seam and NO visible feet.
     Slots 7 and 11 carry shape 9011 (the traced hakama), drawn twice.
  2. THE WHITE JUBAN / OBI IS MISSING.
     obi/waist band (0.52-0.62): ours rgb (89,69,74) vs OG (100,95,95). The OG has a
     bright WHITE panel running from the collar down the front to the waist, plus a
     white obi band. Ours renders that whole block grey. Slot 12 is shape 9012 (collar)
     and slot 14 is 9014 (obi).
  3. THE GI IS TOO SHORT AND SINGLE-TONE.
     The OG's haori hangs lower and is TWO-TONE (a lighter front panel against the
     darker body), and carries TWO black crest marks — one at the chest, one lower.
     Ours is uniform mid-grey with no marks. Slot 15 is 9015, sleeves 9001 / 9019.
  4. THE KASA IS THE WRONG COLOUR AND HAS NO TEXTURE.
     kasa band (0.00-0.18): ours rgb (91,60,40) vs OG (105,82,43) — ours reads
     red-dark, the OG reads golden straw. The OG also has straw lines radiating from
     the apex and a FRINGED / serrated brim underside. Ours has neither. Slot 17, 9017.
  5. THE HAIR MASS IS TOO SMALL. The OG hangs a black mass behind and below the neck
     that covers most of the jaw; ours exposes far more tan face. Slot 16 is 2664+2670.

⚠️ TWO THINGS I GOT WRONG LAST SESSION — do not inherit them:
  - I reported the SCABBARD as missing. It is NOT. At matched scale it is drawn, thinner
    and shorter than the OG's, at both the upper-left butt and the lower-right tip.
  - I reported "the layer order is correct" as though it settled the visual question. The
    order IS correct and the render still reads wrong. The gap is garment SHAPE, COLOUR
    BLOCKING and DETAIL. Do not re-litigate z-order looking for the cause.

DON'T BREAK — and here the floors are the live risk, not a formality:
- §4's no-touch list. Sim.ts and the duel-baseline move only in L5.
- THE FLOORS: tracing >= 0.9005 · held-out >= 0.8490 · height <= 140.5. They go UP or
  they stay. ⚠️ Re-authoring a garment moves them; SESSION 22 needed an owner ruling to
  re-base one ONCE. If your change lowers a floor, STOP and take a ruling — do not
  re-base to fit.
- GOLDEN_DRESSED / GOLDEN_IDLE in tests/poseRender.test.ts are pixel gates. Moving one is
  a DELIBERATE act, in the same commit as the change, with the reason in-file.
- The anim-key pins, src/core/'s zero numeric literals, render-only scenes.
- src/config/ogItems.ts, src/config/ogCompositing.ts and their transcribers are CLOSED
  evidence. Re-run a transcriber; never hand-edit its output.

⚠️ TRACING IS PERMITTED AND THE PALETTE IS NOT A GUESS. The owner-attested Lut Games
grant (docs/OWNER_PERMISSION_RULING.md, 2026-07-24) makes direct frame-matching of art
and exact OG hues the TARGET, not a compromise. reference/ stays local-only.

DESIGN FIRST (~20 min, no code until these are decided and logged with vetoes):
1. THE GATE. What check would have failed on this render? A silhouette score cannot see
   items 2, 3 and 4. Options include a per-band colour-block comparison, a region-labelled
   mask diff, or a per-slot ink-share check. Pick one, say why, and say what it CANNOT
   see — every gate has a blind spot and the last one's was undeclared.
2. ORDER OF ATTACK. Recommend hakama (1) first: it is the biggest silhouette error, it is
   the one item that also moves the aggregate score, and it is a single shape (9011) drawn
   at two slots.
3. RE-AUTHOR vs RE-TRACE. 9011 is a traced shape; is this a repair of the existing trace
   or a fresh trace from the frame? Say which per garment and why.
4. THE DETAIL ITEMS (crests, straw texture, brim fringe) are NEW shapes, not repairs.
   Decide whether they are in scope for this lane or belong to L6, and say so up front
   rather than discovering it at the gate.

DONE (measurable — all four, or the lane is open and you say so):
- The owner LOOKS at renders/L3_zoom_compare.png regenerated after your changes and says
  it reads as the video's fighter. His words logged verbatim. Nothing else closes this.
- A committed gate FAILS on the pre-change render and PASSES on the post-change one —
  red-proofed by running it against the old shapes, output pasted.
- Floors held or raised, with the numbers pasted. No floor re-based without a ruling.
- Gate green with PASTED output: typecheck 0 · lint 0 · vitest · fidelity gate.

Never soften a gate to fit a result — re-author, or come to me for a ruling.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 67 files / 1059), open
renders/L3_zoom_compare.png AND reference/frames/s19_trace/zFt_0061.png and tell me in
your own words what differs, then give me your four design decisions with veto notes.
Don't write code until I ok it.

Start command:

cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -3 && npx vitest run 2>&1 | tail -4

Session settings: Claude Code CLI · Opus 5 at xhigh (§2 routes visual-grade lanes to
Opus) · fresh context · Ultracode OFF — this is trace-and-grade work, not a fan-out.
```

---

## Why this kickoff is shaped the way it is

- **It leads with the verdict and the measurements, not with a task list.** The previous
  kickoff's gap list came from my reading; this one's comes from numbers taken off the
  frame, so the next session can argue with them.
- **It names my two wrong calls explicitly.** A kickoff that hides the outgoing session's
  errors makes the incoming one re-derive them.
- **It makes the GATE a design decision, not an afterthought.** The whole reason this lane
  exists is that the last gate passed a render the owner rejected.
- **It states the floor risk up front.** Re-authoring garments is exactly what moves the
  tracing/held-out floors, and the repo has needed an owner ruling for that once already.
- **It refuses to pre-decide the scope of the detail items** (crests, texture, fringe) and
  instead forces that call into the design phase, where it is cheap.
