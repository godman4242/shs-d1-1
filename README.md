# Straw Hat Samurai: Duels — 1:1 Recreation

[![CI](https://github.com/godman4242/shs-d1-1/actions/workflows/ci.yml/badge.svg)](https://github.com/godman4242/shs-d1-1/actions/workflows/ci.yml)

A from-scratch remake of [*Straw Hat Samurai: Duels*](https://www.kongregate.com/games/lutgames/straw-hat-samurai-duels) — the Flash-era side-scrolling samurai MMO by LutGames / Explosive Barrel. Web in 2015, Android in 2016, servers gone since around 2016.

Everything in here is written from scratch. No decompiled code, no ripped art, no ripped audio.

> *Straw Hat Samurai: Duels* is © LutGames / Explosive Barrel. This is a private, non-commercial study project, and none of the original game's content is redistributed here.

## Where it stands (2026-10-29)

The combat and behaviour core is done and self-contained — 2,602 unit tests green, zero external assets.

- **Fixed-timestep combat math** in `src/core/` — draw-a-line slashing, damage, stamina and chi, launch/fly/knockdown reactions, flinching, evasion (dash, roll, jump, smoke), death animations. All of it ticking at a strict 60 Hz.
- **Enemy AI** — 16 enemy archetypes in `src/config/ogEnemy*.ts`, each behaviour number traced back to a decompiled line or a video frame, with the citation in the config comments and the tests.
- **Animation system** — 429 animation labels in `src/config/ogActor.ts`, stance and pose composition, clip-end bookkeeping.
- **An evidence trail for every claim** — anything asserted about the original is cited to an exact file+line or a specific video frame, and it all lives in `docs/`.

Still to come: scenes and rendering, story and quests, items, multiplayer. The porting order and where the frontier currently sits are tracked in `RESUME_HERE.md`.

## Running it

Node 22.18 or newer. The simulation core runs headless, so there's no browser involved:

```bash
npm install
npm test        # 2,602 tests, ~10 s
npm run build   # typecheck + vite build
```

The tests are self-contained. A fresh clone passes without any access to original-game material — the few tests that would need it are gated behind `describe.skipIf` on `reference/` being present.

## How the original got reverse-engineered

The original is dead: server gone, client SWFs encrypted, no source anywhere. So the behaviour was reconstructed from three things:

1. **Decompiled AS3 clients** (web v0.717 and Android v0.682) — the source of truth for behaviour
2. **Decrypted game data** — quests, items, skills, NPCs, animations. This is where the numbers came from.
3. **Two 1080p longplay videos** — 2,675 frames studied, used as the visual and audio ground truth

The archaeology is written up in `docs/RECOVERY.md`: source URLs, decode recipes, verification commands. Per-system write-ups live in `docs/research/`. If you're doing the same thing, there's a [companion reference corpus](https://github.com/godman4242/shs-d1-1-reference) with the decompiled AS3 clients, the decrypted game data, 13 recovered music stems and 44 web SFX (pulled live off the dead game's CDN on 2026-10-29), the full 3,165-entry web string table, recovered portraits and splash art, and 12 system specs where every number was measured rather than guessed.

## Why 2,602 tests?

Each one pins a measured behaviour — a number or a reaction the original verifiably has, transcribed from decompiled code or measured off frames, with the citation sitting in a comment next to it. If the port drifts away from the original, tests go red. The rules that keep that honest:

- No numeric literal in core code. There's a test that enforces config purity.
- Every divergence from the original gets logged in `docs/DIVERGENCES.md` with the measured evidence attached.
- Chaos plants — deliberately broken copies of the source that the suite has to catch — get planted by an unattended loop (`docs/loop/CYCLE.md`). Every plant has to go red, and every one has to be restored byte-identical afterwards.
- The pinned chaos suite currently stands at **502 plants, all 502 red, all 502 restored byte-identical** (`npm run chaos`).

## FAQ

**Can I play it?** Not yet. The simulation core is finished; the Phaser rendering layer and the story content are next in the queue (`RESUME_HERE.md`).

**Can I use the original's art or music?** No. That content belongs to LutGames / Explosive Barrel, and this repo contains none of it. One correction worth making: the music's composer is unsourced in our evidence. The Kevin MacLeod credit belongs to *Straw Hat Samurai 1*, the predecessor, not to this game. Wiki text is CC-BY-SA, so cite it rather than pasting it.

**Who owns what?** The recreation code here is © 2026 godman4242 and MIT-licensed below. The game design and IP of *Straw Hat Samurai: Duels* stay with LutGames / Explosive Barrel. If you build on this, keep the credit and keep it non-commercial.

**Where's the reference corpus?** Over at [godman4242/shs-d1-1-reference](https://github.com/godman4242/shs-d1-1-reference). It's a separate repo and it isn't vendored into this one.

**Where do I report bugs or ask questions?** Open a GitHub issue. The repo also carries its internal working docs (`docs/`, `RESUME_HERE.md`) — these are working documents of an in-progress project, kept honest rather than kept pretty.

## License

MIT © 2026 godman4242, covering the code written for this recreation. It doesn't cover *Straw Hat Samurai: Duels* itself, which belongs to LutGames / Explosive Barrel.
