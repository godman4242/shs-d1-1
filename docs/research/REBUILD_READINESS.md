# REBUILD READINESS — the complete gap ledger for *Straw Hat Samurai: Duels*

> **What this is.** One authoritative answer to the owner's question: *"what are we
> missing to rebuild the game 1:1, and how do we close every gap?"* — organized in the
> four-quadrant (known-known / known-unknown / unknown-known / unknown-unknown) frame he
> asked for. Produced 2026-07-20 by a **24-agent research + adversarial-critique workflow**
> (`wf_9a832906-822`, 12 game-systems × research→critic, 2.2M tokens) built ON TOP of the
> existing corpus (`SHSD_MASTER_REFERENCE.md`, `video-study/SYNTHESIS.md`, 60 segment
> notes, two v0.717 longplays), plus first-hand frame verification of the combat crux.
>
> **Precedence.** This doc is a *research consolidation*, not a config or a ruling. On any
> conflict, the live `src/config/*.ts`, the fidelity ledgers, and owner rulings still win.
> Where it says "the project's own doc is wrong," that is a flagged correction for the next
> build session to act on — the code was **not** changed by this pass.
>
> **The honest headline.** The blocker on a 1:1 recreation is **information about a dead
> game, not model capability.** No model can reproduce a damage number, a reach in pixels,
> or a sound effect it has never observed. Every remaining gap below is *measurable or
> researchable* — and this pass shows the frontier is closable, not mysterious.

---

## 0. TL;DR — read this, skip the rest if you're busy

- **Overall rebuild-readiness: ~42 / 100** (weighted average of 12 systems). Translation:
  **we know the SHAPE of nearly everything and the load-bearing NUMBERS of about half.**
  A builder could prototype the whole game's *structure* today; they could not ship a
  *tuned 1:1* without a measurement pass.
- **Readiest:** UI/HUD (57), art+motion (56), progression (55), economy (48).
  **Thinnest:** rebirth/elements (30), meta-social (31), skills/meters (33), enemy-AI (34).
- **The single biggest lever is disputed and must be tested first:** *is a playable build
  preserved?* ~Half the research says yes (Ruffle/Flashpoint via explosivebarrel.net/duels
  or Snokido), one lane says no (server-backed, not archived). **If a solo build runs, it
  collapses ~40 inferred values — crit ×, reach px, movement, damage, audio — into
  measurable ones in a few sittings.** If it doesn't, those become original-authored design.
- **This pass already CLOSED several headline gaps and CORRECTED the project's own docs**
  (movement is *hold-to-run*, not click-to-target; the "iaido-duel 3× crit" evidence is a
  **different game**; the stance tables are **mastery-9 ceilings**, not base; Season 1 is
  **14 chapters**, not 4). See §3.
- **Some things are structurally unrecoverable** and must become honest, labeled deviations:
  verbatim dialogue (if the server is dead), exact original SFX/music params, the live
  clan-war population, and the L11–80 XP curve. See §6.

---

## 1. The four quadrants, at a glance

The owner asked for all four Rumsfeld quadrants filled. Here is the whole game sorted into them.

### ✅ KNOWN-KNOWNS — sourced, a builder can code these today
- **Core loop & controls:** draw-a-line-to-slash; line SHAPE picks the attack (horizontal=slash,
  up=jump, up-vertical=launch, down=stab); **the line is a BLADE PATH with finite reach** that
  cuts everything along it (own-eyes verified, §3); **movement = hold mouse to run toward cursor**.
- **Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);
  Critical = 1.3 × Physical; Chi-skill damage is a **flat per-level constant** that ignores defense
  (except Undead/Red Oni).
- **Progression spine:** XP caps L1–L10 (550…31 400), +3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat
  per point, level cap 80, 80 SP first run, skills unlock at levels ending 0 (Ninja) / 5 (Chi).
- **Economy statics:** 100c/3g guest start; inn 8c, toll 7c, stable 14c+5AP, fast-travel 5g, rebirth
  scroll 1000c (+25g), Forge 700c+2 ore, Reinforce 5000c+1 silver ore; War Room structures 10k/10k/5k.
- **Content skeletons:** full enemy taxonomy + movesets (incl. the archer, previously "never captured"),
  4 clans (heraldry/masks/daimyo/capitals), 9-slot paperdoll + affix prefix pool + soul-infusion rules,
  the full 24-skill elemental set NAMES, the Season-1 quest-step chains, all 11 War-Room ranks.
- **Motion & palette (best-evidenced slice):** 15fps pose latch, two gaits, per-stance slash frames,
  hit-stagger 12f, death collapse 333ms, fighter proportions, byte-exact HUD/result-card hex.

### ❓ KNOWN-UNKNOWNS — we know we don't know these; each has a close-path (§5)
- **Combat numbers:** reach cap in **px** per stance; crit ×1.3 vs ×3 final read; early-mob HP + starter
  weapon DMG + hits-to-kill; the Focus/crit **gating rule** (fill trigger/amount/consumption); AUTO SLASH cadence.
- **Skills:** every Chi/Ninja skill **cost + cooldown** except Chi Punch/Replenish Focus; Shunpo's real effect;
  Smoke Bomb/Deflect numbers; the SPEED-stat→cooldown formula.
- **Systems formulas:** DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula;
  condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math.
- **Content depth:** Ep4–12 + epilogue (10 undocumented chapters); verbatim dialogue; per-quest
  trigger types + coords; the full territory map/geography; elemental-skill effect values.

### 🔷 UNKNOWN-KNOWNS — the project already solved these but they're buried/mislabeled (surface, don't re-research)
- `DASH_SLASH_PX=127`, `SLASH_FRAMES` 12/16/20, walk stride 72 — all **already MEASURED** and in config;
  reuse as the in-reach lunge, don't re-measure.
- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and
  mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120).
- Frame-read **Chi costs are single-digit** (Chi Punch 2, Replenish Focus 5) — config's 30/25/10 on a
  fabricated 100-max meter never got the real numbers.
- Config walk bob/armSwing (1/0, MEASURED) and idle knee ~155° are **correct in code but stale in
  `MASTER_REFERENCE`** (§5.2/§7.6 still print old inferred values).
- The AP third resource, the 8-item overworld menu ribbon, the stance-colored portrait ring, the full
  measured weight table, the War-Room numbers — all sit in segment notes / code but never made the digest.

### ⚠️ UNKNOWN-UNKNOWNS — surfaced by the adversarial critics (things a builder only hits when coding)
- **Multi-target damage rule** (one arc hits N enemies — full damage each? falloff toward the tip?).
- **The reach-cap ↔ 127px-dash relationship** (pass-through vs stop-within-reach — possibly two stacked motions).
- **Hit-registration window** (instant at release vs an active sweep an enemy can dodge into/out of).
- **Compositing/blend modes** for tint/vignette/trail/blood; **screen-shake** and **hitstop-on-landed-hit** (never catalogued).
- **Save/serialization schema** for every system (the original was server-side, so there's nothing to copy — must be designed).
- **World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H).
- **The real-world "day" length** governing quest expiry, farming, AP regen, and the War-Room 24h tick.
- **Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong.

---

## 2. Readiness scorecard (per system)

| System | Score | Rebuild-ready now | The thing blocking a 1:1 |
|---|---:|---|---|
| **ui-hud** | 57 | combat-HUD geometry, VS/FIGHT/result cards, chrome family | aspect-ratio truth; dynamic HUD "feel" (bar tween, combo pop); off-screen screens (pause/options/dialogue metrics) |
| **art-anim-audio-feel** | 56 | motion (15fps latch, gaits, slash frames, death), byte-exact palette | **all audio** (SFX + music params); font; FX blend modes; screen-shake/hitstop |
| **progression** | 55 | level-up spine, L1–L10 XP, stat-point effects, unlock cadence | DEF/SPD transfer functions; L11–80 curve (likely unrecoverable); post-rebirth SP economy |
| **economy** | 48 | prices, services, currencies, war-room costs | sell-price + prosperity formulas; coins-per-kill reality; server-sim economy |
| **combat-core** | 42 | gesture map, damage formula, blade-path model, combo rules | **reach cap in px**; crit final read; early TTK numbers; Focus/crit gating rule |
| **items-equipment** | 42 | paperdoll, affix prefixes, rarity, condition tiers, soul-infusion rules | stat-vs-level curve; condition→DMG multiplier; sprite-compositing contract; icon manifest |
| **quests-story** | 42 | quest-log model, archetypes, reward tuples, Season-1 step chains | **verbatim dialogue**; Ep4–12 (10 chapters); per-quest trigger types; choice consequence |
| **world-exploration** | 35 | coord system, room graph, AP costs, travel methods, mining ladder | world map/geography; gather/farm yield tables; "day" length; save model |
| **enemies-ai** | 34 | full taxonomy + movesets, boss roster, projectile set | enemy level→stat formula; per-enemy HP; telegraph/stagger frames; aggro/spawn geometry |
| **skills-meters** | 33 | Chi Punch, skill tree structure, crit formula, stance scaling | per-skill costs/cooldowns; Focus numerics; Shunpo effect; SPD→cooldown formula |
| **meta-social** | 31 | clan facts, 11-rank ladder, structure costs, Ninja-Services prices | server-sim topology; map board; achievements/daily/token numbers; offline gold faucet |
| **rebirth-elements** | 30 | rebirth trigger (scroll/L80/+25g), 4 elements × 6-skill names | what each element DOES; per-skill values; Dan-rank count; Dragon Dance input |
| **Average** | **~42** | *structure of everything* | *the load-bearing numbers of ~half* |

---

## 3. Corrections this pass forced on the project's own docs

These are the highest-value output — they change what the *next build session should code*. The
recreation had drifted on several of these; the research (with sources) sets them straight.

1. **Movement is HOLD-mouse-to-run-toward-cursor, not click-to-destination.** In-game Tip #27 is explicit.
   → **The SESSION11 "hybrid" is half-wrong:** the drawn line is the blade path (correct), but there is *no*
   "tap/click = move-to-target" gesture. The distance-closing the owner saw is the **hold-run + the drawn-line
   dash-step**. Replace A/D keyboard movement with hold-mouse.
2. **The "iaido-duel MEASURED 3.0× crit" is a DIFFERENT GAME** and is *not* evidence about SHS:Duels.
   `MECHANICS_GAP_ANALYSIS #5` treats it as a data point — **that's an error.** SHS:Duels' own wiki (2016 + 2025)
   states the formula "Critical = **1.3× Physical**." Keep `CRIT_MULT=1.3`. The "3×" folklore is best explained as
   1.3× compounded with the per-stance crit-damage **stat** (Heavy ×1.82) + item crit-damage. (Read a real OG crit
   popup to fully seal it.)
3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1
   Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's *reach* also scales ×0.5→×0.9.
   → Either model the mastery curve or **decide-and-flag "the build targets mastery-9"** and label accordingly.
4. **In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat
   switch models **removed 2014 behavior**. The *out-of-combat* switch costing Focus IS real; the *in-combat* switch is
   a recreation divergence — label it, don't present it as original.
5. **Chi is a ~10-based pool with single-digit costs** (Chi Punch **2**, Replenish Focus **5**), frame-read.
   Config's 30/25/10 on a fabricated 100-max meter is a prototype rescale — fix the scale or scale *all* costs consistently.
6. **AP is a real third on-screen resource** (base 30, +1/point) that the "HP/Focus/Shunpo/Chi 100-meter family" drops entirely.
7. **`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled
   ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier.
8. **Season 1 is Prologue + 12 episodes + epilogue = 14 chapters**, not 4. Only Prologue–Ep3 are documented/reachable;
   Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped.
9. **Sell price is NOT flat per item** — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type.
10. **Portrait ring is stance-colored** (Light blue / Balanced brown / Heavy red), not fixed red. `palette.ts ringRed` is only the Heavy ring.
11. **Stat-point +3 is confirmed** (wiki: "+3 to any of ATK/DEF/SPD") — closes the +3-vs-+1 contradiction; the A-21 "+1" was a misread.
12. **Native resolution is 800×480 (5:3)**, not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords.
13. **Stale digest values** (already correct in code, wrong in `MASTER_REFERENCE`): walk bob 3→**1**, armSwing 7→**0**, idle knee 157°→**~155°**.

### First-hand crux confirmation (own eyes, not agent-reported)
Reading `reference/frames/duel_dense/Nr4fQstqHDM_428.0 → 431.5` directly: one **blue (Light-stance) blade arc
reaches across a horizontal gap and bloodies 2–3 strung-out enemies at once while the body stays put**; the arc
**retracts** (no teleport to the far enemy); combat frames later the body has **closed distance and struck again**
(combo 3→5). Also visible: player HP **20/20**, **"150% DAMAGE"** buff (Potato Dog), **"CANNOT CHANGE STANCE"**, a
thrown pouch mid-air. → **Blade-path-with-finite-reach is HIGH confidence.** Still not visible in these frames:
exact reach px, the movement gesture, the crit multiplier.

---

## 4. Per-system gap ledgers (condensed; full detail in the run journal)

For each system: **ready** = codeable now · **blockers** = must-measure, with close-path · **surface** = buried win.

### combat-core — 42
- **Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads).
- **Blockers:** ① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.* ② crit 1.3 vs 3 final — *read one crit popup.* ③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.* ④ multi-target per-hit rule (full vs falloff). ⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*
- **Surface:** `DASH_SLASH_PX=127`, `SLASH_FRAMES`, `STANCE_TABLE` reach — already measured; **wire reach into `resolveSlash`** (today it gets no player pos and no reach gate).

### skills-meters — 33
- **Ready:** Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s); full 6-category tree structure + per-stance unlock levels; crit = 1.3× formula.
- **Blockers:** ① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.* ② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels). ③ Focus numerics (max/fill/switch-cost). ④ SPD→cooldown formula. ⑤ crit **proc** rule (chance vs deterministic) — entirely absent.
- **Surface:** real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale. "Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill.

### progression — 55
- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30).
- **Blockers:** ① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.* ② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED. ③ post-rebirth SP economy; ④ full XP-income model (quest/gather/dungeon, not just kills).
- **Surface:** the per-point stat table + `atkPlusWeapon` term are solved but scattered; promote to a `STAT_GROWTH` config const. The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now.

### rebirth-elements — 30
- **Ready:** rebirth trigger (1000c scroll, L80, +25g, "next Dan rank + specialize in an element"); 4 elements × 6 named skills; Undead/Red-Oni damage floor; carry-items-reset-level.
- **Blockers:** ① what each element **does** (24 skills' damage/cost/AoE/status — names only). ② elemental ATK-vs-DEF **formula**. ③ Dan-rank count/titles (garbled source). ④ Dragon Dance **input** + Kanji-statue bonus. ⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth).
- **Surface:** elements are TWO systems (rebirth skills **and** gear ATK/DEF typing) — the gear side is measured (A-17) but never linked to the rebirth domain. Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters.

### items-equipment — 42
- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4).
- **Blockers:** ① item stat-magnitude **vs level** curve. ② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap). ③ sell-price formula. ④ affix **suffix** pool + per-rarity affix count. ⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**.
- **Surface:** measured weight table + named-item blocks exist in segment notes but **no items config file exists yet** — entirely un-ported.

### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting).
- **Blockers:** ① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either). ② sell-price + prosperity-daily-sim formulas. ③ Repair-Weapon cost (never captured). ④ token/tournament economy numbers.
- **Surface:** Forge 700c (the −70 HUD read is a capture artifact); Writ of Release 25g now double-confirmed; War-Room structure coin costs absent from config.

### enemies-ai — 34
- **Ready:** full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster; projectile set (arrows arc, oni rocks, bandit hammer); independent-aggro (no coordination — closed); nameplate (N)=level.
- **Blockers:** ① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP. ③ telegraph/active/recovery + stagger frames. ④ aggro/leash/spawn geometry. ⑤ Undead damage-reflect probability; arrow arc physics.
- **Surface:** the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes. Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru.

### world-exploration — 35
- **Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder.
- **Blockers:** ① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.* ② gather/mine/farm **yield + whiff + respawn** tables. ③ real-world **"day" length** (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap. ⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector).
- **Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules. Mining ore ladder + far-territory coords are sourced but missing from the digest.

### quests-story — 42
- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed).
- **Blockers:** ① **verbatim dialogue — captured NOWHERE** (study policy + no wiki transcripts) — *transcribe from a preserved build, IF it loads offline; else original-author to the summaries.* ② **Ep4–12 + epilogue** (10 undocumented chapters). ③ per-quest trigger types + coords + rewards (sampled, not tabled). ④ are player choices consequential?
- **Surface:** the +3-stat and "player named Satoshi" contradictions are already resolvable; QUEST_LOG_CAP = 7 (1 story + 6 side).

### ui-hud — 57
- **Ready:** combat-HUD geometry (frame-measured fractions); two-beat VS→FIGHT intro; result cards; overworld HUD layout; 8-icon menu ribbon; minimap; (EQ:n) UX; parchment chrome family; login + character-creation screens; transition timings.
- **Blockers:** ① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.* ② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued. ③ floating damage/crit **popups** (absent from the ledger, confirmed to exist). ④ the "3 skill slots" is really ~2 abilities + a stance up-arrow. ⑤ pause/options/dialogue-box exact metrics.
- **Surface:** overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red.

### art-anim-audio-feel — 56
- **Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors; kill-beat.
- **Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced. *But not unclosable:* ≥3 isolated music-bed rips exist on YouTube (menu/battle/mine) + a 2012 dev trailer — a **listen-pass (watch skill) on the longplay audio + rips** characterizes them (study-only, legal). ② font (unidentified). ③ FX **blend modes**; ④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued); ⑤ severed-limb death variant.
- **Surface:** hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5.

### meta-social — 31
- **Ready:** 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only; War-Room 6 actions + 11-rank ladder (moves/hr + thresholds); structure costs; terrain deploy mods; kill cap 350; flag +120%; 24h resolution; Ninja-Services prices; daily-login structure; two token types.
- **Blockers (mostly structural):** ① **server-authoritative simulation** (24h tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled). ② War-Room **map topology** (board/adjacency). ③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.* ④ offline gold faucet rate (primary source was dead IAP).
- **Surface:** War-Room numbers already in config are now primary-confirmed (upgrade citations); "moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap); Golden Token reads as a **quest item** in v0.717 vs a spendable currency in the wiki — version-check needed.

---

## 5. The close-path plan — ranked by leverage

### ⚑ Priority 0 — resolve the disputed linchpin (do this first; it re-orders everything else)
- **Is a solo build actually playable?** The research **contradicts itself**: combat/rebirth/meta lanes say a
  runnable SWF is preserved (explosivebarrel.net/duels, Snokido, Ruffle/Flashpoint); the audio lane says it is
  **not** (server-backed, not archived, portal pages are login stubs). **This is not resolvable from documents —
  someone must try to load it.** If a solo campaign runs offline, ~40 inferred values become a few measuring
  sessions. If it doesn't, they become original-authored, labeled deviations. *Everything below is conditioned on this.*

> **UPDATE 2026-07-23 — P0 PROBED** (4-agent audit `wf_9fabb0ed-304`: live Chrome test +
> HTTP HEAD evidence; no game files downloaded). **No turnkey playable build exists:**
> explosivebarrel.net/duels is a REAL Ruffle embed that renders the title screen, then
> stalls forever at "Loading game files..." — its 6.9MB payload fetch hits the dead
> strawhatsamuraiduels.com (503). Snokido serves only a ~160KB (2020-04) preloader/login
> stub. **Flashpoint has NO Duels entry** (only SHS 1+2 — the "Flashpoint has it" lane is
> wrong). Kongregate's game page is deleted; Armor Games says "no longer available";
> strawhatsamuraiduels.com is DNS-dead (2024+ Wayback "200s" are a domain squatter).
> **BUT the client is NOT lost:** Player.IO's CDN still publicly serves the full chain
> TODAY — shs3preloader.swf, shs3.swf, and the complete **6,880,328-byte
> shs3_payload.swf** (all 2016-dated ⇒ an EARLY build, likely not final v0.717; a
> 2016-11-30 payload capture also sits in Wayback) — and playerio.com, the platform that
> ran the game's entire backend, still operates.
>
> **P0 EXPERIMENT RUN 2026-07-23 — DEFINITIVE: NO OFFLINE PLAYABLE BUILD, and the wall
> is ARCHITECTURAL, not missing files.** Set-up: staged the three live-CDN client SWFs
> into a Flashpoint 11 Infinity install's PHP-router `htdocs` under their real domain
> paths (`www.strawhatsamuraiduels.com/shs3_payload.swf`, etc.), started the router +
> QEMU proxy, and loaded the preloader through the proxy. Flashpoint's own Waterfox
> won't launch on this macOS (Intel min-OS gate), so the harness was **Ruffle desktop
> nightly** with `--proxy 127.0.0.1:22500`. Result (screenshot:
> `reference/preservation/p0_ruffle_titlescreen.png`): **the real v0.717 Duels title
> screen renders** ("FIGHT PVP DUELS! AMASS LOOT! WAGE WAR!", Explosive Barrel barrel),
> the router log shows the **6.88 MB `shs3_payload.swf` served 200** (so the binary is
> complete and reachable — NOT a file problem), then it **hangs forever at "Loading game
> files…"** — identical to the live official embed. Cause: once the payload initializes
> it must reach the **Player.IO game server** (`shsd-server1` auth + BigDB save-state +
> socket rooms) to boot, and that server-side deployment died with the studio; Ruffle
> also cannot open Player.IO's raw sockets. The tinyloader version file even points the
> payload at the dead `strawhatsamuraiduels.com` and reports `version=0.706` (older than
> the preloader's baked "v0.717") — consistent with a 2016-era client. **Strategic
> conclusion: the ~40 INFERRED feel/number values will NOT be measured from a live build
> — this game has no offline path (even single-player campaign state was server-side
> BigDB).** The project pivots to the forum trove + footage + the playable predecessors
> as the measurement/feel sources. *Remaining low-value refinement (optional, NOT
> pursued — stuck-stop):* a Windows standalone Flash projector under Wine CAN open real
> sockets and might reach a login prompt, but login would then hit the same dead game
> server, so it cannot change this verdict. Study-only lane — RECREATE-NEVER-RIP governs;
> client SWFs live gitignored in `reference/preservation/`.
>
> **Tier-1 additions found by the same audit (each verified to exist):**
> ① **~127 archived Kongregate forum threads for THIS game** (Wayback CDX, mostly
> July-2020 captures) — titles map 1:1 onto the weakest ledgers: equipment mechanics,
> elemental atk/def, the SPEED stat, weapon condition/break, soul-infusion×rebirth,
> AUTO SLASH, badges, the L28 difficulty curve, mines, fast travel, World Battle.
> Harvest via a CDX prefix query on kongregate.com/forums/ — closable today, no build
> needed. **This is the single highest-leverage addition to Tier 1.**
> ② **Playable predecessors as the feel-fallback P0 lacked:** SHS1 runs via Ruffle on
> Armor Games today; SHS 1+2 are in Flashpoint — same dev, same line-slash core.
> ③ **Straw Hat Samurai: Slasher** (© Explosive Barrel) is a LIVE installable mobile
> game (App Store id1530388066, v1.0.5, 2022) — first-hand slash-feel study on hardware.
> ④ IndieDB/ModDB devlog + media tabs (Wayback captures; live pages 403 bots).
> ⑤ Archived Kongregate game page + comments (+ 2018 metrics.json).
> ⑥ Official Facebook photo albums (dev-posted screenshots; needs a logged-in browser).
> ⑦ Extra YouTube: playlist `PLCW-27wgrMisYxxK4BqMzd3-BPwmh86BO`, `iPNADWP1RlI`,
> `vn3ecRI9aNc`, `HPBZqMsOduE`, `ZIFXRWOGlqs` (music theme — check vs the held rips).
> **Dead end (log, don't re-chase):** the official Explosive Barrel forums (SHSD board
> fid=21) died ~May 2025 essentially unarchived — one off-topic thread survives.

### Tier 1 — free wins from material we ALREADY hold (no playable build needed)
1. **Wire what's already measured** into combat: pass player pos into `resolveSlash`, gate by `STANCE_TABLE.reach`,
   fix Heavy reach 120→100, relabel mastery-9. (Code task, not research.)
2. **Frame-measure combat numbers from existing footage:** blade-FX reach span per stance; L1 bandit-fight damage
   popups + HP-bar fractions; blade-trail width/fade; blood droplet count/spread; whether there's screen-shake / hitstop.
3. **Listen-pass on existing audio** (watch skill on the two longplays + the 3 music rips + 2012 trailer) to characterize
   music beds (BPM/scale/instruments) and impact SFX — the deepest gap, and closable without the SWF.
4. **Deeper wiki/Wayback mining** (MediaWiki API works): full territory list + geography; Ep4–12 stubs; achievements;
   condition/suffix pools; prosperity thresholds; the old official-wiki Map/Farming pages the Fandom lacks.
5. **Corpus reconciliation:** promote the stale corrections in §3 into `MASTER_REFERENCE` + config; consolidate the
   buried unknown-knowns (AP resource, weight table, war-room numbers) into config modules.

### Tier 2 — one focused session per cluster IF a build is playable
- **Combat session:** slash a distant dummy (reach whiff), land a Focus-full crit (1.3 vs 3 + proc rule), read early-mob
  HP + hits-to-kill, toggle AUTO SLASH, test hold-run-in-combat.
- **Skills session:** open every skill card (costs/cooldowns), watch Focus fill/consume, reach Shunpo.
- **Items/economy session:** degrade one weapon through condition tiers; sell a rarity/level spread; read Repair cost; sample stat-vs-level.
- **Rebirth session (needs L80):** the element picker, Dan-rank titles, per-element skill values, elemental damage formula, Dragon Dance.
- **Meta session:** Ninja-Services Achievements + Daily Prize + token costs + the full War-Room map grid.

### Tier 3 — denser video re-passes (the 28 skipped slices + full-fps clips)
- Archer moveset at full fps; VS/FIGHT exact ms; damage-popup animation; dialogue-box metrics; overworld HUD pixel geometry.

---

## 6. What is structurally UNRECOVERABLE (make these honest, labeled deviations)

A faithful *feel* recreation can absorb these; a literal byte-1:1 cannot. Flag each as recreation-authored, never as original fidelity.

- **Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway).
- **Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not.
- **The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim.
- **L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED.
- **Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set.
- **The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this.

---

## 7. The verdict — do we have everything to rebuild the game again?

**Not for a pixel-and-number-perfect 1:1 — but yes for a faithful-in-feel single-player recreation of the campaign
core, plus a precise, ranked list of exactly what to measure to close the rest.**

- The **structure** of the entire game is known and sourced.
- **~Half the load-bearing numbers** are in hand; the other half are *measurable*, not mysterious, and mostly funnel
  through one question (is a build playable?) plus free wins from footage/wiki we already own.
- A handful of things are **genuinely lost** and become honest, labeled design decisions.

And on the owner's meta-question — *"are you (Fable) worse than Opus, what are you missing?"* — this pass is itself the
answer: it's **Opus 4.8** (not Fable; that window closed 2026-07-12), and 24 Opus agents just produced adversarial,
well-sourced research that **closed multiple headline gaps and corrected the project's own docs.** The bottleneck was
never the model. It was information about a dead game — and this ledger is how much of it we now have, and exactly how
to get the rest.

---

*Sources: `wf_9a832906-822` run journal (24 agents, per-domain 4-quadrant ledgers + adversarial critiques);
`SHSD_MASTER_REFERENCE.md`; `video-study/SYNTHESIS.md` + 60 segment notes; `original-game-facts.md`;
`MECHANICS_GAP_ANALYSIS.md` + `SESSION11_KICKOFF.md`; the Fandom wiki (MediaWiki API), the archived official
strawhatsamuraiduels.com wiki (Wayback), portal/preservation listings; and first-hand inspection of
`reference/frames/duel_dense/`. Every web claim in the run journal carries a source URL.*
