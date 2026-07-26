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

## What is proven vs. what is not

| | Status |
|---|---|
| Shapes export from the decrypted payload | ✅ 1,822 files, verified by eye |
| Output is gitignored | ✅ `git check-ignore` |
| Shapes include environment art + at least one character figure | ✅ contact sheet |
| **Sprite / timeline export** (animation frames, per-limb pieces) | ❌ **not attempted** |
| Mapping shape IDs → named game entities | ❌ not attempted |
| SVG path → Phaser `Graphics` conversion pipeline | ❌ does not exist |
| Any of it used by the build | ❌ nothing wired |

⚠️ **The known gap:** `-export shape` yields STATIC shapes. A Flash character's
poses live in **sprites/timelines**, not individual shapes, so the walk cycle and
stance poses probably need `-export sprite` / `-export frame` as well. That is
the first thing a follow-up session should test — before assuming the character
art is as available as the scenery clearly is.

## Suggested next step (a session of its own, not a bolt-on)

1. `-export sprite,frame,morphshape` and see what character animation comes out.
2. Pick ONE high-value target (the player samurai idle) and build the
   SVG-path → `Graphics` converter for it end to end.
3. Re-grade against the study frames using the existing fidelity-gate protocol,
   which the permission ruling already allows to assert exact frame matches.

Do **not** convert 1,822 shapes speculatively. One target, end to end, graded —
then decide.
