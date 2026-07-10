# Original-game fact verification — Straw Hat Samurai: Duels

Three independent research agents (2026-07-11) verified the kickoff spec's CONTRACT
claims against real sources — never memory. Source landscape: the official wiki
(`strawhatsamuraiduels.com/wiki`, domain dead → Wayback captures 2014–2020), the
Fandom wiki (live site Cloudflare-blocked → Wayback captures + MediaWiki API), portal
pages, and YouTube metadata. Everything below is paraphrased; per-claim source URLs
are in the workflow transcript (`docs/sessions/-SESSION-LOG.md` links the run).

Scoreboard: **11 confirmed · 4 partial · 3 unverifiable · 2 contradicted.**

## Contradicted → action taken / queued

| Spec claim | Finding | Action |
|---|---|---|
| `CRIT_MULT = 3` (CONTRACT) | Fandom Stances page: crit = **1.3×** physical, with a per-stance crit column exactly 1.3 × our dmgMults (1.17/1.56/1.82). The 3× figure appears only on a 2014 official-wiki tips page; patch notes say the multiplier changed across versions. | **Changed to 1.3** in `combat.ts` + pinned test (Stage 0). Veto = revert both. Stage 2 gate items reading "crit 3×" should be read as "crit ×CRIT_MULT". |
| `MAX_DAN_RANK = 5` | Official wiki's player guide lists rebirth titles Shodan → **Jūdan (10th, marked final)**. The "dan rank 5 (kyudan)" line elsewhere is self-contradictory (kyudan = 9th dan). Spec's own `REBIRTH.tenthGold` corroborates 10. | Queued: set 10 at Stage 3 unless vetoed. |

## Partial (right idea, details off) → Stage landmines

- **Rebirth bonus**: not flat +10 Attack. Forum-thread evidence: rebirths 1–9 grant
  25 gold + **10 elemental skill points (Fire/Water/Earth/Wind, chosen, stacking if
  re-picked)**; 10th grants 100 gold + 20; 11+ grant 25 gold. Spec's gold schedule
  (25/100/25) matches exactly — only the "+10 Attack" label is wrong. → Stage 3.
- **Heavy defensive penalty**: real, but framed as **defense stat ×0.8**, not bonus
  damage taken. Spec has BOTH `HEAVY_DEF_PENALTY=0.2` and `damageTakenMult:1.25` —
  apply one, never both. → Stage 2 landmine (noted in `combat.ts`).
- **Clans**: names real, details off. **Four** joinable Great Clans (Aka Ryu,
  Midori Ken, **Aoi Hoiru, Ki Sensu**); Shira Tancho is story-only. Heraldry: Aka Ryu
  = yellow dragon on red field; Midori Ken = encircled yellow fist on green field.
  Invaders/defenders framing unverified. → Stage 4/5.
- **Shunpo**: exists by name (Light stance L10 "Ultimate Technique") but no source
  describes hold-key slow-mo draining a meter — that part is our interpretation,
  keep labeled INFERRED. → Stage 2.
- **War Room framings**: numbers all confirmed (L10 unlock; 350 = 340 troops + 10
  samurai; deploy 60/100/75 by terrain; flag = 120% troop-deploy boost, v0.712) but
  75 is a deploy *amount* not a bonus, and 500 is the per-turn build *donation
  amount* (v0.49), not a cap. → Stage 5 wording.
- **Characters**: all six exist. Ito = dojo instructor ✓, Takahasi = mining tutor ✓,
  Hiroshi opens the Prologue tutorial (an Old Guard warrior/blacksmith, "master" is
  loose), Masahiro is the Shogun whose assassination plot drives Season 1. → Stage 4.

## Confirmed (build on these with confidence)

- Chi Punch = 10 damage at L1 (two independent wikis; exceptions: Undead/Red Oni).
- Spawn invulnerability: 5 s after entering PvP/war-room, OR until first slash,
  **with a blinking indicator** — straight from v0.715 patch notes.
- Level-up = +1 skill point, +3 stat points, full HP/Chi/AP refill. 80 SP first run
  (level cap 80, 1 SP/level). Rebirth resets to L1.
- Stance triangle exactly as specced: Light>Heavy>Balanced>Light.
- Gestures: horizontal = slash · up = jump · vertical-up = launch (skill-gated per
  stance) · down = stab (Heavy skill). Matches spec's gesture map.
- Smoke Bomb dodges stabs; Stab + Deflect skill parries kunai/arrows.
- Reach direction: Light ~300 > Balanced ~200 > Heavy ~100 slash-distance units
  (spec's heavy 120 is close; wiki says ~100 at mastery 9 — kept 120 as INFERRED).
- Player starts as a Shugyosha in torn garments wielding a branch.
- Currencies: coins grindable; gold was **sold for real money** in the original
  ("Ninja Services" / "Heavenly Gold"). Our `HAS_CASH_PURCHASE=false` is therefore a
  deliberate deviation, not fidelity — tell #32 is a design choice.

## Unverifiable (keep INFERRED, tune by feel)

- 10 XP / 8 coins per foe level (kills rewarding XP+coins is confirmed; formula isn't).
- Typical duel length 20–60 s (weak support: standalone duel clips run 21–24 s —
  consistent with the spec harness's ~24.7 s median).
- A hard dan-rank cap of 5 (see contradicted row — 10 is better supported).
