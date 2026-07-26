# ART EXTRACTION — the OG's own vector art is recoverable (2026-07-26)

> **Status: PROVEN, 1,822 shapes on disk. Not yet used by the build.**
> Owner question that prompted it: *"I just want a byte-by-byte pixel-by-pixel
> copy of the OG game, the art doesn't even look the same."*

## The headline

`Straw Hat Samurai: Duels` is a **Flash** game, so its art is **vector**, not
pixels. Our renderer (Phaser `Graphics`) is **also** vector. The two formats are
the same kind of thing — which means a genuine 1:1 art match is not an
approximation problem, it is an **import** problem.

And the import works:

```
reference/tools/ffdec/ffdec.sh -export shape \
  reference/extracted/shapes \
  reference/decrypted/shs3_payload_decoded.swf
```

→ **1,822 `.svg` files, 54 MB, in 8.0 seconds, exit 0.**

Visually confirmed by contact sheet: town buildings, roofs, shopfronts, torii
gates, stone walls, a dragon statue, cherry-blossom branches, bamboo, a cart,
katana wall-mounts, framed UI plates, blood-splatter shapes, a mace, and **a
full standing character figure** (`1813.svg`, 64×225).

## Why nobody had this before

The **source dive (2026-07-25) exported ActionScript only** — 1,079 `.as` files,
zero shapes. It was a *code* dive, and it succeeded completely at being one. The
art was always sitting in the same decrypted payload it read the code from; no
one ran the shape exporter.

⚠️ **`docs/OWNER_PERMISSION_RULING.md`'s practical note is now OUT OF DATE.** It
says *"the surviving client SWFs are encrypted … so asset extraction stays
impractical regardless — the working method remains tracing from the frame
corpus."* That was true when written (2026-07-24). The source dive cracked the
three-layer protection the next day, and `shs3_payload_decoded.swf` (6.88 MB,
the real v0.717 client) has been on disk since. Extraction is not impractical;
it takes eight seconds.

## Licensing

Covered by the owner ruling: *"Art may now be copied 1:1 … the fidelity target
moves from 'measured ceiling with original drawings' to **direct frame-match**."*

- Extracted art lives under `reference/` and is **gitignored** — verified:
  `git check-ignore -v reference/extracted/shapes` → `.gitignore:9:reference/`.
- The grant is to **recreate**, not to redistribute Lut's original files. So
  these SVGs are a *reference to trace/convert from*, exactly like the frame
  corpus — they are never committed and never shipped.
- The stack invariant is untouched: `src/` still contains **no image files**.
  Vector paths become `Graphics` draw calls, which is procedural vector art.
- Third-party assets are still excluded (fonts, music).

## UPDATE, same day: the animation question is ANSWERED

The gap flagged below ("does character animation come out, or only static
shapes?") was resolved before `SESSION15_KICKOFF.md` was written.

```
FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -swf2xml \
  reference/decrypted/shs3_payload_decoded.swf reference/extracted/payload.xml
```
→ **314 MB XML, exit 0.** (`FFDEC_MEMORY=12g` is required — the default heap dies
with `OutOfMemoryError` on this payload.)

| tag | count | what it is |
|---|---:|---|
| `PlaceObject2Tag` | 7,196 | a shape placed at a **transform matrix** |
| `ShowFrameTag` | 4,347 | frame boundaries |
| `DefineSpriteTag` | 827 | **animation timelines** |
| shape tags (all 4 kinds) | **1,822** | reconciles exactly with the SVG export ✓ |
| `DefineBitsLossless2Tag` | **20** | the *only* bitmaps in the game |

⇒ **Animation = play these vector shapes, at these matrices, one `ShowFrame` at a
time.** Reconstructible with no raster step.

**Fill-style census** over all 12,142 fill styles: **93.1 % solid colour**, 4.8 %
linear gradient, 1.6 % radial, 0.4 % bitmap. Phaser's `Graphics.fillPoints` draws
flat polygons natively, so 93 % of the art needs no new rendering capability.

⚠️ **`-export sprite` works but MUST NOT be used:** it rasterises to **3,013 PNGs**
(35 MB). That violates the "procedural vector art only, no image files"
invariant, discards resolution independence, and could not be committed anyway.
**The XML route above is the one.**

⚠️ **Still open, and flagged honestly:** 1,336 distinct instance names exist but
skew heavily to UI (`button`, `label`, `form`), with only `playercanvas`,
`samurai`, `ninja`, `farmer` standing out. **The fighting character may be
assembled in ActionScript at runtime rather than authored as one timeline
sprite.** SESSION 15 A1 settles that by reading the 1,079 decompiled `.as` files
rather than guessing at shape IDs.

⚠️ **A constraint that reshapes the architecture:** `reference/` is gitignored, so
a shipped build can **never** read these files. Converted path data has to be
emitted as **committed TypeScript**. A runtime loader is impossible, not merely
unwise.

**→ The plan is now `docs/sessions/SESSION15_KICKOFF.md`.**

---

## What was proven vs. not, at first extraction (kept for the record)

| | Status |
|---|---|
| Shapes export from the decrypted payload | ✅ 1,822 files, verified by eye |
| Output is gitignored | ✅ `git check-ignore` |
| Shapes include environment art + at least one character figure | ✅ contact sheet |
| **Sprite / timeline export** (animation frames, per-limb pieces) | ✅ **answered above** |
| Mapping shape IDs → named game entities | ⚠️ partially — see the naming caveat above |
| SVG path → Phaser `Graphics` conversion pipeline | ❌ does not exist |
| Any of it used by the build | ❌ nothing wired |

⚠️ **The known gap at the time:** `-export shape` yields STATIC shapes. A Flash
character's poses live in **sprites/timelines**, not individual shapes, so the
walk cycle and stance poses probably need `-export sprite` / `-export frame` as
well. That was the first thing to test — and it was tested; see the update above.

## Suggested next step (a session of its own, not a bolt-on)

1. ~~`-export sprite,frame,morphshape` and see what character animation comes
   out.~~ ✅ **DONE** — see the update above.
2. Pick ONE high-value target (the player samurai idle) and build the
   SVG-path → `Graphics` converter for it end to end.
3. Re-grade against the study frames using the existing fidelity-gate protocol,
   which the permission ruling already allows to assert exact frame matches.

Do **not** convert 1,822 shapes speculatively. One target, end to end, graded —
then decide.
