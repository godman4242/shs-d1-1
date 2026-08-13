# GAUNTLET L0 — RE-SURVEY · run journal

> Written **as each stage lands**, never held in context (`GAUNTLET.md` §3.4).
> A run that dies mid-flight is salvageable from this file + `index/` + `systems/`.

- **Lane:** L0 — RE-SURVEY (12 systems)
- **Model:** Opus 5 · **Scale:** ~85 agents (two orthogonal sweeps)
- **Baseline:** `e97f91f` · 56 test files / 894 tests green
- **Started:** 2026-08-13

---

## STAGE 0 — the evidence index (script, 0 agents)

### ⚑ FINDING S0-1 — `GAUNTLET.md` §2.1 is WRONG about `bindata/`, disproven by direct inspection

**§2.1 claims:** *"candidate homes are the remaining `bindata/*.bin` (the largest is
animation XML, so the others are unsurveyed)"* — i.e. 1 known, 26 unknown.

**Reality (A2, `file` + head of every one of the 27 files, this run):** 26 of 27 are
**plain XML**, and every single one is now identified. Nothing in `bindata/` is
unsurveyed any more.

| Files | Root | Contents |
|---|---|---|
| `100`–`118` (**19 files**, 2.35 MB) | `<animdata>` | **19 animation sets**, not 1 — `ogre_idle`, `bear_idle`, `chargedshot_start`, `mining`, `reversed_stance`, `horse_idle`, `balanced_stance`, `zom_idle`, `idle`, `deer_idle`, `dual_stance`, `guardian_idle`, `wolf_idle`, `spear_idle`, `spider_idle`, `gob_idle`, `heavy_stance`, `boar_idle`, `light_stance` |
| `119_1t4646s0.bin` | `<survivalmodedata>` | **A whole game mode nobody has surveyed** — `<wave>`/`<enemy>` with id-alternates (`400\|401\|402\|403\|404`), `<qty>`, `<x>` spawn coords |
| `93_1t4647s0.bin` | comment-wrapped `<obj>` | **Room-object definitions** — `Obj_FloorSwitch`, `Obj_Lever`, `<x>`, `<property>triggered object</property>` |
| `94`, `95`, `96`, `97`, `98` | plain text lists | **Five name-generator tables** — male given · court/noble · clan/family · female given · place names |
| `92_1t4648s0.bin` | GIF89a 63×72 | a raster image asset |

**Consequences, each landing on a different lane:**

1. **L6 (art-anim):** the animation corpus is **19 files / 2.35 MB**, including
   `light_stance` / `balanced_stance` / `heavy_stance` / `reversed_stance` / `dual_stance`
   as first-class animation sets. `REBUILD_READINESS.md` §4 art-anim scores 56 without
   knowing these exist.
2. **`world-exploration` (scored 35, *"ZERO world numbers in config"*)** — room objects
   with coordinates and trigger semantics are **held**, in `93_1t4647s0.bin`.
3. **`enemies-ai` (scored 34)** — survival-mode wave composition + spawn x-coords are
   **held**, in `119_1t4646s0.bin`. Also 8 non-human idle rigs (ogre/bear/horse/zom/deer/
   guardian/wolf/spider/gob/boar) confirm the taxonomy from the payload, not from video.
4. **A game mode absent from the entire ledger:** `<survivalmodedata>` is not mentioned
   anywhere in `REBUILD_READINESS.md`'s 12 systems.
5. **L1b (string table):** `bindata/` is now **exhausted as a candidate home** — every
   file is accounted for and none is a string table. L1b's search space shrinks to
   `payload.xml` + the 1,079 decompiled AS3 files. This is a *negative* result and it
   is worth as much as a positive one.

**Artifact class:** A2 (payload rows, quoted from the files themselves).

**This is exactly the finding the 85-agent plan was sized to catch** — the 45-agent
shape left `bindata/` unassigned and would have inherited §2.1's wrong premise.

---
