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
- [ ] Follow-up tranche — 12 dropped-slice segments (A-25…A-30, B-24…B-29) holding new
      mechanics the 24/video cap cut (AP costs, timed quest, archer, ladder, key pickup,
      Recent Happenings Board…) — workflow `wf_c73bc346-e75` running. The other 28
      dropped slices are documented grind/travel/outros — deliberately skipped;
      skip list goes in SYNTHESIS.md.
- [ ] SYNTHESIS.md + RESUME_HERE update

## ⚡ RESUME THE SWEEP (repeat this after EVERY quota reset until done)
Invoke the Workflow tool with:
  scriptPath: "/Users/kheshav/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/3adeef1f-4b61-459f-8736-56bc9cbb264a/workflows/scripts/video-study-sweep-wf_8bebd64e-7ff.js"
  resumeFromRunId: "wf_8bebd64e-7ff"
Both maps replay instantly from cache; dense segments run live. The script is now
tuned for quota survival (2026-07-11 15:20 edits, all dense-phase-only = cache-safe):
  - dense agents run on model 'sonnet' effort 'medium' (≈5-10× cheaper than Fable-tier;
    observational transcription work — quality fine)
  - HIGH-priority segments execute first, so a mid-run wall costs the least
  - ≤60 frames/segment at 1024px (1 per ~2.5s — still catches every screen)
THE LOOP: run → some dense agents complete (each writes its notes file + is cached) →
if the window dies, wait for the printed reset time → re-invoke the SAME command →
completed agents replay free, the rest continue. Repeat until failures = 0.
Then: write SYNTHESIS.md from segments/ + both maps, cross-check against
docs/research/original-game-facts.md, update RESUME_HERE, commit.
DO NOT run other heavy Claude work while a tranche is running (shared quota).
(Ground truth of progress = files in `segments/`, per Resume rule — this checklist is a courtesy.)
