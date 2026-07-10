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
- [~] A map · B map · dense segments — RUNNING in workflow `wf_8bebd64e-7ff`
      (script: `~/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/3adeef1f-4b61-459f-8736-56bc9cbb264a/workflows/scripts/video-study-sweep-wf_8bebd64e-7ff.js`;
      if a fresh session finds this unfinished: re-invoke Workflow with that
      scriptPath + resumeFromRunId "wf_8bebd64e-7ff" — completed agents replay
      from cache; or just check segments/ against the Resume rule above)
- [ ] SYNTHESIS.md + RESUME_HERE update
(Ground truth of progress = files in `segments/`, per Resume rule — this checklist is a courtesy.)
