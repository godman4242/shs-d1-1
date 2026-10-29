# Straw Hat Samurai: Duels — 1:1 Recreation

[![CI](https://github.com/godman4242/shs-d1-1/actions/workflows/ci.yml/badge.svg)](https://github.com/godman4242/shs-d1-1/actions/workflows/ci.yml)

**A from-scratch, clean-room recreation of [*Straw Hat Samurai: Duels*](https://www.kongregate.com/games/lutgames/straw-hat-samurai-duels)** — the Flash-era side-scrolling samurai MMORPG by LutGames / Explosive Barrel (web 2015, Android 2016, servers dead ~2016). Everything here is written from scratch: no decompiled code, no ripped art, no ripped audio.

> **Rights & scope.** *Straw Hat Samurai: Duels* is © LutGames / Explosive Barrel. This recreation is a private, non-commercial study project made under the rights holder's written permission (owner-attested; see `docs/OWNER_PERMISSION_RULING.md` for the grant's history and scope). **No content from the original game is redistributed in this repo** — see the FAQ.

## What is done (2026-10-29)

A self-contained combat/behaviour core, 2,602 unit tests green, no external assets:

- **Fixed-timestep combat math** (`src/core/`) — draw-a-line slashing, damage/stamina/chi, launch/fly/knockdown reactions, flinch, evasion (dash/roll/jump/smoke), death animations, all at a strict 60 Hz
- **Every AI behaviour measured from the original** — 20+ enemy archetypes (`src/config/`), each behaviour number traced to a decompiled line or a video frame (citations inline in config comments and tests)
- **Animation system** — 146 animation labels transcribed, stance/pose composition, clip-end bookkeeping
- **The full evidence trail** — every claim about the original is cited to exact file+line or video frame (`docs/`)

The rest (Scenes/rendering, story/quests, items, multiplayer) is queued — the porting order and current frontier are tracked in `RESUME_HERE.md` (the per-slice handoff doc).

## Run it

Node ≥ 22.18. The simulation core runs headless (no browser needed):

```bash
npm install
npm test        # 2,602 tests, ~10 s
npm run build   # typecheck + vite build
```

Tests are self-contained: a fresh clone of this repo passes with **no access to any original-game material**. Tests that would need private study material are `describe.skipIf`-gated on `reference/` being present.

## How the original was reverse-engineered

The original is dead — server gone, client SWFs encrypted, no source available. This project reconstructed it from:

1. **Decompiled AS3 clients** (web v0.717 + Android v0.682) — the behaviour source of truth
2. **Decrypted game data** (quests, items, skills, NPCs, animations) — the numbers
3. **Two 1080p longplay videos** — the visual/audio ground truth (2,675 frames studied)

The archaeology (source URLs, decode recipes, verification commands) is written up in `docs/RECOVERY.md`; the per-system write-ups live in `docs/research/`. If you are recreating this game yourself, the **companion reference corpus** (decompiled sources, decrypted data, recovered audio, 12 system specs with every number measured) is described in `docs/RECOVERY.md` §1 — it is a separate private repo, offered on request to serious recreators (see FAQ).

## Why 2,602 tests?

Every test is a **measured behaviour pin**: a number or reaction the original verifiably has, transcribed from decompiled code or measured from frames, with the citation in a comment. Tests fail if the port drifts from the original. The porting discipline:

- No numeric literal in core code (config purity enforced by test)
- Every divergence from the original is logged in `docs/DIVERGENCES.md` with measured evidence
- Chaos plants — deliberately broken copies of the source that the suite must catch — are planted weekly by an unattended loop (`docs/loop/CYCLE.md`), and every plant must go red
- **502 plants were planted against the latest slice; 501 caught.** The 1 that stayed green was a real bug in the test suite (two copies of a guard, only one tested) — fixed today in 3d5a1c2

## FAQ

**Can I play it?** Not yet. The core simulation is done; the Phaser rendering layer and story content are next in the queue (`RESUME_HERE.md`).

**Can I use the original's art/music?** No — that content belongs to LutGames / Explosive Barrel. This repo contains zero original assets. The original's music was Kevin MacLeod (separate license), and its wiki text is CC-BY-SA (cite, don't paste).

**Who owns what?** The recreation code in this repo is © 2026 godman4242, MIT-licensed below — but the *game design and IP of Straw Hat Samurai: Duels* remain LutGames' / Explosive Barrel's. If you build on this: keep the credit, keep it non-commercial until you have your own permission.

**Where is the reference corpus?** The decompiled clients/decrypted data/audio are study material held under the rights holder's grant; they are **not** distributed here (the grant covers recreation, not redistribution). `docs/RECOVERY.md` explains exactly what exists and how it was obtained. If you're a serious recreator, open an issue and ask.

**Where do I report bugs / ask questions?** Open a GitHub issue. The repo also carries its internal working docs (`docs/`, `RESUME_HERE.md`) — these are working documents of an in-progress project, kept honest rather than kept pretty.

## License

MIT © 2026 godman4242 — applies to the code written for this recreation. It does not cover *Straw Hat Samurai: Duels* IP, which belongs to LutGames / Explosive Barrel.
