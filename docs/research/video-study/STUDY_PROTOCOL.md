# Video study protocol — SHS:Duels longplays (crash-resilient)

**Purpose:** extract every game mechanic, UI screen, story beat, and feel detail from
two reference longplays into committed notes, so ANY future session can resume
mechanically after a cutoff. Notes are our own words; short quotes only. Videos and
frames live under `reference/` (gitignored, study-only, never distributed).

## Sources (download from 0:00 — deep-link timestamps deliberately stripped)
- **A** = `zFtCaTO0_1M` — "Straw Hat Samurai Duels - PART 1", 69m45s, FlashGamesArchive™, 2020-03-08
- **B** = `Nr4fQstqHDM` — "Straw Hat Samurai Duels - PART 2", 65m51s, FlashGamesArchive™, 2020-03-09
- Local copies: `reference/videos/<id>.mp4` (gitignored). No commentary → frames-only study (`--no-whisper`).

## Pipeline (watch skill, `~/.claude/plugins/cache/claude-video/watch/0.1.3`)
1. ✅ when checked — download both videos to `reference/videos/`.
2. Dense pass A 0:00–3:00 (loading screen, login page, title, menus) — read inline,
   notes → `segments/A-00-boot-login.md`. Commit.
3. Sparse chapter maps (100 frames/video) → `A-MAP.md`, `B-MAP.md`. Commit.
4. Dense segment passes (workflow agents, parallel). Each agent:
   `python3 <skill>/scripts/watch.py reference/videos/<id>.mp4 --start S --end E --no-whisper --resolution 1024 --out-dir reference/frames/<id>/seg-<n>` → Read every frame → write `docs/research/video-study/segments/<A|B>-<n>-<topic>.md`.
5. Synthesis → `SYNTHESIS.md` (mechanics catalogue · story · UI inventory · feel notes),
   cross-checked against `docs/research/original-game-facts.md`. Update RESUME_HERE.

## Resume rule (for a fresh session)
- A segment is DONE iff its notes file exists in `segments/` AND ends with `## VERIFIED`.
- The chapter maps define the segment list; anything in the maps without a notes file
  is the remaining work. Re-running a segment is safe (idempotent, frames cached on disk).
- If videos are missing (machine change), re-download via the IDs above — same content.

## Segment note template
```
# <A|B>-<n> <topic> (<start>–<end>)
## Screens & layout   (positions, colors, typography, exact HUD contents)
## Mechanics observed (rules, numbers, timings — cite frame t=MM:SS)
## Story/dialogue     (own-words summary; names/quest titles OK; no long verbatim text)
## Feel               (pacing, camera, animation weight, FX)
## Recreation notes   (config values to add/adjust, stage mapping, contradictions with spec/research)
## VERIFIED
```

## Status
- [x] Downloads (A, B) — reference/videos/, 2026-07-11
- [x] A-00 boot/login dense pass — segments/A-00-boot-login.md (login page at t=0:00
      + loading screen at t=0:03 both captured; game version v0.717 on login footer)
- [x] B map — DONE (salvaged → `B-MAP.md`, 32 chapters; map frames on disk)
- [x] A map — DONE on 2nd run (salvaged → `A-MAP.md`, 41 chapters; NO War Room in PART 1)
- [x] Dense segments A + B — 48/48 written + VERIFIED (sweep `wf_8bebd64e-7ff` completed
      2026-07-11 ~17:00 after the 3:50pm reset; 0 failures)
- [x] Follow-up tranche — 12/12 dropped-slice segments (A-25…A-30, B-24…B-29) written +
      VERIFIED (workflow `wf_c73bc346-e75`, 0 failures). The other 28 dropped slices
      are deliberately skipped grind — list + rationale in `SYNTHESIS.md` §8.
- [x] SYNTHESIS.md — written from all 61 segments + both maps, cross-checked against
      `../original-game-facts.md` (§5 table), adversarially verified by 4 audit agents
      (workflow `wf_f8211741-fb4`), RESUME_HERE updated. **STUDY COMPLETE.**

## ⚡ SWEEP COMPLETE (2026-07-11) — nothing to resume
The loop below ran to 0 failures on 2026-07-11 (main sweep `wf_8bebd64e-7ff`,
48/48; follow-up `wf_c73bc346-e75`, 12/12) and `SYNTHESIS.md` is written.
**Do not re-run the sweep.** If a build Stage later needs a denser look at a
specific moment, run ONE targeted pass instead (frames stay cached on disk):
  python3 ~/.claude/plugins/cache/claude-video/watch/0.1.3/scripts/watch.py \
    "reference/videos/<id>.mp4" --start S --end E --max-frames 60 \
    --resolution 1024 --no-whisper --out-dir reference/frames/<id>/adhoc-<topic>
then append findings to the relevant `segments/` file (keep `## VERIFIED` last).
Candidate moments worth such a pass are listed in `SYNTHESIS.md` §9.
