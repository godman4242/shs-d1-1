# src/game/ — Phaser scenes, render-only

**Purpose:** the only folder that may import Phaser. Scenes build `PlayerIntent`
from input, call `Sim.advance`, drain `SimEvent[]` into FX/SFX, and copy sim state
onto render puppets. **Scenes never own gameplay state.**

## Invariants
- May import from `src/core/` and `src/config/`; nothing may import from here.
- All art is procedural vector (Graphics), all audio is WebAudio-synthesized.
  No image/audio asset files, ever.
- Numeric literals are tolerated until Stage 2, then ratcheted against a committed
  per-file value multiset (new/substituted values fail; removals pass).
- Slow-mo must set `time.timeScale` and `tweens.timeScale` together, and restore
  both on kill beat, scene shutdown, AND in `create()` — a stuck timescale on
  restart is a known failure class (chaos-test it).

## Landmines
- If a scene starts accumulating HP/meters/cooldowns locally, that's the bug —
  move it into `Sim` and re-render from state.
