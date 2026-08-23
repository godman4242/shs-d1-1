# LEDGER PACKET — `frame`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**48 surviving overturns · 6 true-but-rejected · 37 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
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
>
> ## ⛔ STALENESS BANNER — 2026-08-13: THIS DOC IS WRONG ON ITS BIGGEST CALLS
>
> **This pass predates the payload extraction and was never reconciled with it.**
> Verified first-hand 2026-08-13 against `reference/extracted/` — the following
> claims below are **DISPROVEN** and must not be planned against:
>
> | Claim in this doc | Reality in the payload we already hold |
> |---|---|
> | §4 quests-story: *"verbatim dialogue — captured NOWHERE"*; §6: *"structurally unrecoverable"* | `questdata.xml` — **2,771 `<dialogue>` blocks, 3,307 verbatim `<text>` lines, 471 `<choice>`**, full `<cutscene>` direction |
> | §3.8: *"Ep4–12 were likely never shipped… faithful campaign = Prologue–Ep3"* | **61 quests: Prologue → Episodes 1–12 → Epilogue → a Season 2 hook.** The campaign is complete |
> | §2 skills-meters **33/100**, blocker ① *"every other skill's Chi cost + cooldown"* | `skilldata.xml` — **75 skills × 182 level rows** with exact `<chi>`, `<cooldown>`, `<value>` |
> | §2 enemies-ai **34/100**, blocker ① *"enemy level→stat formula… absent"* | `npcdata.xml` — **495 NPCs**, full paperdoll + `<lvl>` + `<ai>` + `<skill>` |
> | §2 items-equipment **42/100** | `itemdata.xml` — **982 items** with type/price/weight/modifiers/defense |
>
> **The scores in §2 are therefore stale, not merely conservative.** `docs/GAUNTLET.md`
> **lane L0 owns the re-survey** and will rewrite §2/§4/§6 with A2 (payload) cites.
> Until L0 lands, treat §2's numbers as a floor and §6's "unrecoverable" list as
> unproven. *Everything else in this doc — the P0 verdict, the four-quadrant frame,
> the §3 corrections, the close-paths — still stands.*

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
| **Average** | **~42** | *structure of everything* | *the load-bearing numbers of ~half* |

---

## 4. Per-system gap ledgers (condensed; full detail in the run journal)

For each system: **ready** = codeable now · **blockers** = must-measure, with close-path · **surface** = buried win.

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
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-A/web-stance-triangle-has-a-second-0p9-arm]]` — UPHELD [A2] (3 critics)

The stance counter-triangle has TWO arms in web v0.717, not one. Winning matchups (Light vs Balanced, Balanced vs Heavy, Heavy vs Light) take damage x1.2; LOSING matchups (Light vs Heavy, Balanced vs Light, Heavy vs Balanced) take damage x0.9. Android v0.682 has only the x1.2 arm - grep for '*= 0.9' across MCSPlayer.as returns zero hits. Both arms are applied before the defense subtraction and before the min-damage floor. REBUILD_READINESS.md:74 carries neither term; a Sim written from that bullet is wrong by 20% on countered matchups and by 10% on countering ones.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3798 and :4379-4389 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3707`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);"
- **Lane impact:** L1/L5 combat-core: RR:74 needs both triangle arms added, and the pair must be applied pre-defense, pre-floor.

### `[[NF-B/stance-triangle-is-defender-keyed-and-web-adds-a-losing-side]]` — UPHELD [A2] (2 critics)

The stance counter-triangle runs in the DEFENDER's frame, and the web build has a losing side android lacks. Both x1.2 branches sit inside gotHit (android MCSPlayer.as:3580; web §1t99s0§ — _loc11_ is assigned param2.stance at :3754, param2 being the Damage object), so `this.stance` is the defender and the attacker's stance is the operand. The shipped rule is: Balanced beats Light, Heavy beats Balanced, Light beats Heavy — confirmed independently by the game's own copy, strings.json["6001"]/["6003"]/["6005"]. The WEB build additionally applies x0.9 on each reversed matchup (§1t99s0§.as:3796-3798), which android has no counterpart for: six ordered outcomes, not three. Both terms land BEFORE the DEF subtraction and the min-damage floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3754, :3788-3794, :3796-3798, :3800-3804 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3580, :3654, :3701-3709 + docs/gauntlet/L0/index/strings.json["6001"], ["6003"], ["6005"]`
- **Build:** both
- **KILLS this line:** "Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);"
- **Lane impact:** L1 combat-core: the :74 KNOWN-KNOWN damage line is missing a rock-paper-scissors term entirely, and the web build's version is a 6-way table (x1.2 / x0.9 / x1.0), not the 3-way the android decompile shows.

### `[[actionscript/auto-slash-is-the-enemy-ai]]` — UPHELD [A2] (2 critics)

AUTO SLASH is not a separate autoswing routine — the toggle routes the player's own character through the enemy AI function — so its cadence is the AI tick: a decision every 12 frames (0.5s) for the player and elites, every 24 frames (1s) for ordinary NPCs.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1149 (routing), NPC.as:22 with overrides at MCSPlayer.as:165 / EnemyElite.as:18 / EnemyPlayer.as:52 / FriendlyElite.as:18 (cadence), MCSPlayer.as:4426 with rolls at :4520-4556 (the decision)`
- **KILLS this line:** "AUTO SLASH cadence."
- **Lane impact:** L-combat-core (the §1 known-unknown 'AUTO SLASH cadence' closed), L-enemies-ai (the AI's randomised doReload target explains the observed 'enemy backs off to recharge' behaviour — it is deliberately disengaging to refill Focus for a crit).

### `[[actionscript/damage-is-a-random-roll]]` — UPHELD [A2] (2 critics)

Physical damage is NOT deterministic — the pre-stance base is a uniform random roll between the weapon's mindamage and maxdamage offset by ATK — and a BROKEN weapon collapses the roll to ATK + 1 with zero range.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258; inputs at reference/decompiled/shs3_android/scripts/StatsManager.as:1863-1888 (getMinDamage, broken branch :1871-1877) and :1890-1903 (getDamageRange, broken branch :1892)`
- **KILLS this line:** "Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical"
- **Lane impact:** L-combat-core (the stance mult, the x0.8 and the 1.3 are all confirmed; the MISSING term is the random weapon range, which is why TTK reads off video never resolved to clean integers) and L-items-equipment (blocker ② partial: the broken end of the condition ladder is not a multiplier at all — it REPLACES the weapon contribution with +1). Full v0.717 chain: roll = ATK+bonus+wpn.min + rand*(wpn.max-wpn.min) → x stanceMult(stance,mastery) → if Focus full x1.3 + STAT_CRITICALDMG → defender Heavy defends at defense*0.8.

### `[[actionscript/hit-registration-window]]` — UPHELD [A2] (2 critics)

Hit registration is instantaneous at slash resolution, evaluated by walking the released polyline point-by-point — there is no swept active window an enemy can dodge into or out of — and resolution walks the paperdoll part list FRONT-to-BACK so the topmost part struck decides the hit (which is the actual mechanism behind 'shielder legs / undead heads' weak points).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:301-321`
- **KILLS this line:** "Hit-registration window (instant at release vs an active sweep an enemy can dodge into/out of)."
- **Lane impact:** L-combat-core, L-enemies-ai, L-items-equipment (weak points are literally paperdoll slots, so the weak-point table and the equipment layer table are the same table).

### `[[actionscript/loot-tables-held]]` — UPHELD [A2] (2 critics)

The drop tables are literal item-ID arrays banded at player level 30 and 60, behind a 50% no-drop gate, with a 4-attempt level-restriction retry and a 6-item consolation list — and the web v0.717 arrays are byte-identical to the Android ones.

- **Cite:** `reference/decompiled/shs3_android/scripts/LootDialog.as:448-495 and :67-85 · web parity reference/decompiled/shs3_payload/scripts/§1t6172s0§.as:82 and :605`
- **KILLS this line:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L-items-equipment / L-economy: the §1 known-unknown 'loot/drop tables' is closed; the iron/bronze/steel weapon ladder the ledger knows by name is literally these three arrays.

### `[[actionscript/multi-target-full-damage]]` — UPHELD [A2] (2 critics)

One arc hitting N enemies deals the same full Damage object to every one of them — no falloff toward the tip and no split — each enemy hit at most once per slash (gotHitFlag), broad-phased by a ±200 px horizontal window, and the combo counter increments by the number of DISTINCT enemies hit, not by hits.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295`
- **KILLS this line:** "Multi-target damage rule (one arc hits N enemies — full damage each? falloff toward the tip?)."
- **Lane impact:** L-combat-core (§4 blocker ④ 'multi-target per-hit rule (full vs falloff)' closed and the §1 unknown-unknown deleted), L-ui-hud (combo semantics = distinct enemies). Note the neutralList is swept by the same loop, so civilians/animals are cuttable by a stray arc.

### `[[actionscript/reach-300-200-100-refuted]]` — UPHELD [A2] (2 critics)

The reach triple 300/200/100 cannot be produced by v0.717 at any mastery, so it is not a mastery-9 ceiling: Light reach is a FIXED x1.4 of base while Balanced is >= 1.0x base, capping the Light:Balanced ratio at 1.4 — but 300:200 = 1.5. The only part the code confirms literally is Heavy's 100, which is a hard floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119 (and the 1.5 ratio IS reachable in the Android build at mastery 0: reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030)`
- **KILLS this line:** "STANCETABLE already carries reach 300/200/120 + speed — but never wired into resolveSlash and mislabeled INFERRED when they're actually the wiki's mastery-9 values (and Heavy should be 100, not 120)."
- **Lane impact:** L-combat-core — 'Heavy should be 100 not 120' is CONFIRMED as a literal code floor; 'they're mastery-9 values' is REFUTED for v0.717. Retires the planned Tier-1 code task from 'relabel mastery-9' to 'replace the whole table with the formula'. The 300/200/100 row, if real, describes the mobile v0.682 tuning.

### `[[android-blobs-hunter/foreground-plane-is-the-most-blurred-element]]` — UPHELD [A1] (1 critic)

Corrected frame reading. In the cited longplay frame the foreground plane does occlude both fighters' lower legs, but it is the SOFTEST element in the frame, not the sharpest: p99 local luminance gradient measures 3.0 / 3.0 / 3.4 across three grass boxes clear of the fighters, versus 7.0 for the far rock background, 7.0 for the tree trunk, 82.0 for the tan fighter's torso and 101.6 for the purple fighter's shoulder. The grass carries no near-black outline pixels. This is exactly what XMLBG.as:46 predicts - foregroundLayerBlur = 8, tied with farthestLayerBlur = 8 for the hardest blur in the ladder - so the frame and the AS3 agree, and a recreation must blur its foreground scenery as hard as its farthest layer.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png - crops (900,560)-(1180,960) x3 NEAREST, (760,780)-(1240,1010) x3, (950,840)-(1090,930) x8; gradient boxes (780,885)-(850,955), (1100,885)-(1230,955), (300,885)-(560,955) vs (1300,300)-(1500,450) and (960,700)-(1080,840) - cross-checked to reference/decompiled/shs3_android_payload/scripts/XMLBG.as:46`
- **Build:** web v0.717 (longplay footage)
- **KILLS this line:** "android-blobs/foreground-layer-occludes-the-fighters: 'a sharply-outlined grass band ... The grass carries the same outline weight as the fighters - it is not the blurred far layer'"
- **Lane impact:** L6 art-anim. THE FRAME WINS over the measurement claim. The occlusion survives; the outline characterisation is inverted. Building crisp foreground grass from the original wording would be a visible 1:1 miss on every one of the 49 backgrounds that declares an <fgcount>.

### `[[android-blobs-hunter/shipped-vector-art-yields-solid-fill-palettes]]` — UPHELD [A2] (1 critic)

The shipped vector art is decodable, which closes the packet's own 'nothing was rendered' lead. Parsing FILLSTYLEARRAY across the three decrypted resource SWFs yields 2,423 shape records with solid fills. Most-used: 115_Mobile_SHS3Resource (fighter parts + icons) #000000 x225, #FFFFFF x224, #333333 x160, #CCCCCC x147, #FECA98 x127, #B78F6C x120, #222222 x100; 120_Mobile_BGResource #000000 x45, #30291D x35, #5A4D2E x33, #3A3323 x23, #251F16 x21, #453929 x21; 124_Mobile_ImageResource (portraits/cards) #DF9671 x52, #FCC6A6 x51, #000000 x39, #9E6750 x31. Per-symbol resolution works: torso4000 -> charId 1195 -> shape 1194 (DefineShape4) fills #FECA98 and #B78F6C; skill1000 -> shape 144 fill #C0AC4B; acc3000 -> shape 3725 fill #ABABAB. Semantic sanity check passes both ways - skin tones dominate the portrait file, earth tones the background file.

- **Cite:** `decrypted reference/extracted/android/115_Mobile_SHS3Resource.bin (1,755 shape records), 120_Mobile_BGResource.bin (562), 124_Mobile_ImageResource.bin (106) - DefineShape/2/3/4 FILLSTYLEARRAY parse; decrypt per reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:206-217`
- **Build:** android v0.682
- **KILLS this line:** "android-blobs/nothing-was-rendered: 'not one DefineShape record was decoded, so no fill colour, outline weight, silhouette or per-slot geometry is held by this pass.'"
- **Lane impact:** L6 art-anim. Under the 2026-07-24 owner permission ruling, exact OG hues are now permitted targets, and these are exact OG hues from the shipped art rather than eyedropper reads off a compressed video frame. HONEST LIMIT: first-fill-array reads only - no edge records, no silhouettes, and my LINESTYLE2 parse is not trustworthy, so I report NO outline weights.

### `[[art-anim-audio-feel/690-is-the-friend-bar]]` — UPHELD [A2] (2 critics)

The 800x690 document rect is not unspecified 'container chrome' — GameEngine names it originalHeightWithBar and the extra 210 px is the FRIEND BAR, a selectable canvas mode entered when the window is taller-relative-to-width than 800/690; and 800x480 is independently attested by two SWF document rects.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:267-310; SWF header rects of reference/decrypted/shs3_android_payload_decoded.swf and my k=109 decode of 124_Mobile_ImageResource.bin`
- **KILLS this line:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L6 art-anim-audio-feel and L8 ui-hud: removes the need to invoke 'the frame wins' at all — two byte-checks agree with 800x480 outright. The 210 px band is a named friend-bar mode with its own HUD init call, which is a L11 meta-social finding (an overworld friend panel) the ledger does not hold. NOTE: the frame's measured content box is 1816x1080 (aspect 1.6815), 0.89% wider than the 1800 px that 800x480 predicts — the capture is not pixel-exact, so do not treat frame-derived HUD fractions as exact against the 800x480 grid.

### `[[art-anim-audio-feel/690-is-the-friend-panel]]` — UPHELD [A2] (2 critics)

The 800x690 rect is not container chrome: GameEngine.resizeHandler names the extra 210 px as originalHeightWithBar and switches to it with StatsManager.stageShowingFriendBar = true plus OverworldHUD.instance.friendpanel.init() - an in-game friend panel that is a second, unbuilt UI surface.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-306, and :190 for the fullscreen path`
- **KILLS this line:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud gains a whole layout mode and a friend panel it does not hold; world-exploration/meta-social gain the social strip. art-anim-audio-feel: the claimed doc-vs-frame conflict never existed - the code holds 800x480 AND 800x690 with an explicit aspect branch, and the videos read 5:3 only because they were captured in fullscreen where fullScreenSourceRect clips to 800x480.

### `[[art-anim-audio-feel/800x690-is-the-friend-bar-layout]]` — UPHELD [A2] (2 critics)

800x690 is not container chrome — it is `originalHeightWithBar`, a named second canvas the engine switches to when the window is narrower than 800/690, which also turns the friend panel on.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:267-312`
- **KILLS this line:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** art-anim-audio-feel and ui-hud: the ledger's open item closes as TWO payload contracts, not one. 800x480 is the play-field canvas; 800x690 is the friend-bar layout, and the 210 px difference is a social panel, which is why the web SWF document rect is authored at 690. HUD fractions must be re-based on 800x480 AND the recreation must decide whether it ships the friend bar at all. There is no frame-vs-doc conflict to invoke the FRAME-WINS invariant over. Caveat: this formula exists only in the Android bundle — grep over reference/decompiled/shs3_payload/scripts/ for originalWidth/originalHeight returns zero hits — so it inherits the S0-3 Android-parity caveat.

### `[[art-anim-audio-feel/blood-vfx-exact]]` — UPHELD [A2] (8 critics)

Blood VFX numbers are exact constants, not something to frame-measure: 20 particles, angle variance 10°, velocity 6 ±2, gravity 0.6, time-to-live 24 ticks (~1.0 s at 24 fps), with per-death-variant emitter overrides naming the exact body part and spray angle.

- **Cite:** `reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26; per-death overrides at EnemyGoblin.as:367-432`
- **KILLS this line:** "Frame-measure combat numbers from existing footage: blade-FX reach span per stance; L1 bandit-fight damage popups + HP-bar fractions; blade-trail width/fade; blood droplet count/spread; whether there's screen-shake / hitstop."
- **Lane impact:** art-anim-audio-feel: §5 Tier-1 item 2 loses three of its five sub-tasks (blood droplet count/spread, screen-shake, hitstop) — they are payload constants now, not video measurements.

### `[[art-anim-audio-feel/second-layout-mode-800x690]]` — UPHELD [A2] (2 critics)

The client ships a SECOND layout mode - 800x690 with a friend bar - entered whenever the window aspect drops to 800/690 or below, which is why the SWF document rect decodes to 800x690.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-288`
- **KILLS this line:** "Aspect-ratio truth - native canvas is 800x480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** art-anim-audio-feel and ui-hud: the ledger's aspect-ratio item has TWO answers, not one - 800x480 when window aspect > 1.1594, and 800x690 (480 play area plus a friend bar) otherwise, with StatsManager.stageBaseHeight switching between them. This dissolves the doc-vs-frame conflict that claim art-anim-audio-feel/aspect-ratio-frame-wins invokes the standing frame-wins invariant to settle, and it hands ui-hud a friend-panel layout (OverworldHUD.instance.friendpanel.init()) that no ledger holds.

### `[[art-anim-audio-feel/web-swf-header-is-24fps-and-800x690]]` — UPHELD [A3] (2 critics)

The WEB v0.717 payload's own SWF header settles two ledger bullets at the byte level, with no video and no Android-parity caveat: frameRate = 24.0 and stage rect = 800 x 690. The Android payload header reads frameRate = 24.0 and stage 800 x 480. So the simulation tick is 24 Hz (not the ledger's 15fps), and the web build's document rect really is the friend-bar layout size.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf — my own SWF header parse (RECT bit-reader then UI16 frameRate as 8.8 fixed)`
- **Build:** both
- **KILLS this line:** "Ready (strongest slice): 15fps pose latch; ... · Aspect-ratio truth — native canvas is 800×480 (5:3)"
- **Lane impact:** Gives claims killbeat-6000ms-pins-24hz-tick and second-layout-mode-800x690 the WEB-side evidence neither had — both previously rested on Android v0.682 ActionScript plus a video measurement. Any recreation ticking at 15 Hz or assuming a single 800x480 canvas is wrong.

### `[[bindata/NEW-70th-trap-room-is-commented-out]]` — UPHELD [A2] (2 critics)

The trap-dungeon file's 70th <room> is inside a commented-out <default> template block and is never shipped — the real count is 69, matching the per-tier split 13+21+15+20. The engine branch that would have consumed a live <default> is consequently dead code.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:22-30 + reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2437`
- **Build:** both
- **KILLS this line:** "Trap-dungeon system ships 69 rooms across 4 tiers (easy 13 / medium 21 / hard 15 / veryhard 20) and 297 placed objects across 14 base object types. A 70th room exists only inside an XML comment."
- **Lane impact:** Corrects the room count in two separate claims and flags a dead engine branch that a reimplementation would otherwise waste time supporting.

### `[[bindata/NEW-setvisible-partmax-22-leaves-5-slots-unhidden]]` — UPHELD [A2] (2 critics)

The sprite-compositing contract has a gap the packet's own claim does not mention: the per-frame visibility pass only clears part slots 0..21, so slots 22-26 (prop3, both shoulders, both knees) are never hidden and persist from the previous frame.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FrameData.as (setVisible)`
- **Build:** android v0.682
- **KILLS this line:** "Per-frame visibility resets only part slots 0-21; slots 22-26 (prop3, l/r shoulder, l/r knee) are never auto-hidden and carry over between frames."
- **Lane impact:** A faithful renderer must reproduce this or the shoulder/knee overlays will disappear where the original keeps them — a visible-feel difference that no test currently guards.

### `[[bindata/NEW-trap-name-suffix-is-the-trigger-wiring]]` — UPHELD [A2] (2 critics)

Trap object <name> values carry instance suffixes — 47 distinct raw strings collapsing to 14 base types — and the suffix is the trigger-wiring id: a floor switch's <property> holds the NAME of the object it fires. This is how switches, levers and traps are linked, and the packet never states it.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:51 and the Obj_FloorSwitch1/Trap_Kunai1 pairing in the medium tier`
- **Build:** both
- **KILLS this line:** "Trap rooms are a wired graph, not a flat object list: ObjFloorSwitch / ObjLever carry a pipe- or comma-separated list of TARGET NAMES in <property>, and numeric name suffixes (TrapKunai1, ObjFloorSwitch3, TrapSawBladesAuto10) exist solely to make those references unique within a room."
- **Lane impact:** Any trap-room reimplementation needs the name-reference resolver; without it switches do nothing. Also explains why a naive <name> census returns 47 types instead of 14.

### `[[bindata/NEW-warhex-has-14-states-not-7]]` — UPHELD [A2] (2 critics)

WarHex.as carries the canonical hex-state enumeration with numeric values: fourteen states, not the seven the packet reports. Values 10 and 14 are unused, which is itself evidence the enum was edited over the game's life.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37`
- **Build:** android v0.682
- **KILLS this line:** "War-Room board: 6x6 hex grid, 55 px pitch on BOTH axes (x = 90 + xpos55, y = 92 + ypos55), with FOURTEEN enumerated hex states carrying explicit numeric ids (10 and 14 unused)."
- **Lane impact:** The board-topology blocker can be closed properly rather than with 7 of 14 states; the numeric ids also mean saved war state can be decoded.

### `[[bindata/paired-grab-throw-victim-anims]]` — UPHELD [A2] (2 critics)

The skills animation set contains paired attacker/victim animations (kneegroin + kneegroin_victim, backthrow + backthrow_victim) — a grab-and-throw combat category that appears in none of the 12 ledger systems.

- **Cite:** `reference/extracted/bindata/102_1t4629s0.bin:3143, 3577, 7570, 8319 + AnimData.as case MCSActor.KNEEGROIN_VICTIM`
- **KILLS this line:** "- Core loop & controls: draw-a-line-to-slash; line SHAPE picks the attack (horizontal=slash, up=jump, up-vertical=launch, down=stab); the line is a BLADE PATH with finite reach that cuts everything along it (own-eyes verified, §3); movement = hold mouse to run toward cursor."
- **Lane impact:** L-combat-core: overturn by OMISSION. The ledger's combat model is entirely 'draw a line, the blade path cuts'. Nothing anywhere describes a grab, a throw, or a second actor whose animation is driven in lockstep by the attacker's — yet the engine ships four such clips and special-cases the victim track.

### `[[bindata/trap-duty-cycle-domain-measured]]` — UPHELD [A2] (2 critics)

CORRECTED replacement for the false 'every trap duty cycle is a multiple of 24' corroboration. The 24 Hz engine tick is right (web SWF header framerate 24.0 + ENTER_FRAME gameloop + one keyframe per updateAnimation call), but the trap timings do NOT corroborate it. Measured over every live <property> in 93_1t4647s0.bin against the file's own schema comment: onDuration in {0,24,48}; offDuration in {0,24,36,48,60,96,1000}; startInterval in {0,6,8,12,16,18,24,30,32,36,42,48,54,64,72}. 75 values are not multiples of 24 and the gcd of the whole domain is 2. Trap timings are authored in raw ticks at 1/24 s, not in whole seconds.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:6-18 (schema) and :92-94,:131,:176-177,:183-184,:233-235,:243-245,:404-406,:451 (counter-examples) + reference/decrypted/shs3_payload_decoded.swf header`
- **Build:** web v0.717
- **Lane impact:** L-motion/L-traps: preserves the 24 Hz result while removing a false universal that two packet claims were resting on.

### `[[combat-core/five-stances-not-three]]` — UPHELD [A2] (2 critics)

The game shipped FIVE stances, not three: skills 1500 and 1501 are NPC-only stance selectors for REVERSED_STANCE and DUAL_STANCE, and the ledger contains zero occurrences of either word.

- **Cite:** `reference/extracted/skilldata.xml:1947-1957 and :1959-1969 (category 11, no displayname/desc/order/lvlreq); EnemyPlayer.as:836-843, EnemyElite.as:161-167, FriendlyElite.as:84-90`
- **KILLS this line:** "- STANCETABLE already carries reach 300/200/120 + speed — but never wired into resolveSlash and mislabeled INFERRED when they're actually the wiki's mastery-9 values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 combat-core (the damage/reach model is 3-stance and must become 5), L4 enemies-ai (two boss/elite stances with their own AI), L6 art-anim (S0-1's 'reversed' and 'dual_stance' bindata sets and android blobs 95_MCSCharacter_ReversedStanceAnimationData.bin / 101_MCSCharacter_DualStanceAnimationData.bin are these two).

### `[[combat-core/hit-registration-instant-at-endslash]]` — UPHELD [A2] (8 critics)

The hit-registration window is answered: there is no active sweep and no per-frame hitbox — the entire polyline resolves in one instant inside endSlash(), against wherever enemies stand at that moment.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2766-2814 (the only call sites of NPCManager.checkHit / checkPlayerHit)`
- **KILLS this line:** "Hit-registration window (instant at release vs an active sweep an enemy can dodge into/out of)."
- **Lane impact:** L5 — an enemy cannot dodge into or out of a stroke mid-sweep; deductReloadBar() is charged in the same call, so the meter cost lands at resolution, not at input.

### `[[combat-core/multi-target-full-damage]]` — UPHELD [A2] (8 critics)

Blocker ④ is dead: one slash tests the whole enemyList and neutralList, each enemy can be hit at most once, and every victim takes the SAME Damage object — full damage each, no falloff toward the tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295 (damage rolled once at MCSPlayer.as:2699); combo cap StatsManager.as:4298-4306`
- **KILLS this line:** "Multi-target damage rule (one arc hits N enemies — full damage each? falloff toward the tip?)."
- **Lane impact:** L5 — also yields the cheap pre-filter |Δx| < 200 world units, and grounds the 'combo rules' Ready bullet: combo = count of DISTINCT enemies hit per stroke, accumulated into a persistent counter capped at 999.

### `[[combat-core/pass-through-dash]]` — UPHELD [A2] (8 critics)

The reach-cap ↔ dash relationship is answered: there is NO fixed dash constant — the player runs to the stroke's first point only if it is ≥ standingRange 50 away, then passes THROUGH to the stroke's last point at a per-stance slashSpeed of 50/40/30 world units per frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2408, :2476, :2676-2705; constants at :9 (standingRange=50) and :15-19 (slash speeds)`
- **KILLS this line:** "The reach-cap ↔ 127px-dash relationship (pass-through vs stop-within-reach — possibly two stacked motions)."
- **Lane impact:** L5 — it IS two stacked motions (approach, then pass-through), but the travel distance is the stroke's own span, itself bounded by the arc-length reach budget. src/config/combat-sim.ts's 'fixed 105.9 px pass-through' and the ledger's DASH_SLASH_PX=127 both need replacing with the derivation. Bonus (L2): Shunpo is setPosition(destX,destY) + slashDamage *= 2 + endSlash() at MCSPlayer.as:2700-2705.

### `[[combat-core/reach-ts-was-right]]` — UPHELD [A2] (2 critics)

src/config/reach.ts's lightMult 1.4, balancedPerMastery 0.02 and heavyPerMastery 0.04 are the CORRECT v0.717 values read out of the web payload; the survey's prescription to replace them with 1.5/0.005/0.005 would have broken three correct CONTRACT-SRC constants.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120`
- **KILLS this line:** "- STANCETABLE already carries reach 300/200/120 + speed — but never wired into resolveSlash and mislabeled INFERRED when they're actually the wiki's mastery-9 values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — reach.ts needs no change; promote its five multiplier constants from CONTRACT-SRC to CONTRACT-SRC-v0.717 with file/line. The reach<->damage permutation its comment documents is real in the web build (reach light 1.4 flat / damage heavy 1.4 flat, sharing the same two mastery curves).

### `[[combat-core/web-reach-and-damage-curves-match-repo]]` — UPHELD [A2] (2 critics)

The shipped web build's per-stance reach AND damage multipliers are exactly the values already in src/config — light reach ×1.4, balanced ×(1+0.02·m), heavy ×(0.5+0.04·m) floored at 100; damage light ×(0.5+0.04·m), balanced ×(1+0.02·m), heavy/dual/reversed ×1.4.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120, :3262-3270`
- **KILLS this line:** "- STANCETABLE already carries reach 300/200/120 + speed — but never wired into resolveSlash and mislabeled INFERRED when they're actually the wiki's mastery-9 values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — the reach/damage curve family is now CONTRACT (shipped-build source), not CONTRACT-SRC-guessed. It also promotes reach.ts's 'one mastery drives both tables' permutation from an observation to a source fact, in the correct build. The 300/200/120 ledger triple is dead, but so is the survey's replacement.

### `[[frames/forge-cost-is-level-parameterised]]` — UPHELD [A1] (2 critics)

The ledger banks 'Forge 700c+2 ore' as an economy static a builder can code today; the frame shows 700 is the level-7 instance of a level-parameterised string, so the constant is wrong as a constant.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,380-1024,576 @3x)`
- **Build:** web v0.717 frame; android v0.682 template
- **KILLS this line:** "Economy statics: 100c/3g guest start; inn 8c, toll 7c, stable 14c+5AP, fast-travel 5g, rebirth scroll 1000c (+25g), Forge 700c+2 ore, Reinforce 5000c+1 silver ore; War Room structures 10k/10k/5k."
- **Lane impact:** economy, items-equipment: 'Forge 700c' must be re-labelled as f(weapon level), not a price

### `[[frames/pillarbox-confirmed]]` — UPHELD [A1] (2 critics)

The longplay frames ARE pillarboxed — game content occupies x≈53…1866 of 1920 with ~53 px black bars both sides, measured aspect 1.680 (5:3, not 16:9) — so every HUD x-fraction taken as x/1920 is wrong by about 5.5%. THE FRAME WINS over any doc that assumed a full-width 16:9 canvas.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — crop (960,300)-(1920,760) upscaled ×2 (black band plainly visible down the right edge against the stone wall); column-brightness profile of the full 1920×1080 frame; identical result on Nr4fQstqHDM_431.5.png`
- **KILLS this line:** "- Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud — closes blocker ① and the matching UNKNOWN-UNKNOWN: re-base every measured x-fraction as (x − 53) / 1814. Also gives art-anim a visual confirmation of the loot-pouch projectile from the createLoot code path.

### `[[itemdata/frame-validates-the-payload]]` — UPHELD [A1] (2 critics)

A 1080p frame of the PLAYER screen shows item numbers that match itemdata.xml exactly on three independent fields, which validates the extracted XML against the v0.717 video build and settles the starter-weapon damage the ledger lists as unknown.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1310,235)-(1780,320) upscaled 3x, and crop (1420,545)-(1780,600) upscaled 3x; cross-checked against reference/extracted/itemdata.xml:7907`
- **KILLS this line:** "- Combat numbers: reach cap in px per stance; crit ×1.3 vs ×3 final read; early-mob HP + starter weapon DMG + hits-to-kill; the Focus/crit gating rule (fill trigger/amount/consumption); AUTO SLASH cadence."
- **Lane impact:** L5 (COMBAT CORE): starter weapon DMG is 1-2 (Branch, id 13002), no longer an unknown feeding TTK work. L3: the frame is a byte-check target for the ported item table. Also retires the Stage-0b S0-3 Android-vs-web caveat for item numbers.

### `[[itemdata/loot-tables-held]]` — UPHELD [A2] (2 critics)

The loot/drop tables are held in full and are global level-banded pools, not per-enemy tables: base 50% drop chance, a 1-in-4 Rare-Loot-buff upgrade, pool chosen by player level bands 0-29/30-59/60+, a minlvl <= playerLevel+3 filter with 4 retries then a consolation prize — and the union of every random pool is only 188 of 982 items (19.1% of the catalogue).

- **Cite:** `reference/decompiled/shs3_android/scripts/LootDialog.as:67-85 (ten literal arrays) and :448-496 (addRandomLootItem); web parity reference/decompiled/shs3_payload/scripts/§1t6172s0§.as:76 and :82 (identical arrays)`
- **KILLS this line:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L5 items-equipment and L6 economy both gain the whole drop economy; L7 enemies-ai and L8 world-exploration inherit it (Obj_Chest*, Obj_Bush, Obj_Corpse, Obj_DragonDanceLoot all call the same entry point with this.lvl). Also overturns Pass 1's own STILL_UNHELD line on loot tables.

### `[[measurement/stage-scale-is-2p25-not-1p875]]` — UPHELD [A2] (2 critics)

EVERY 'stage px' NUMBER IN docs/research/fidelity/COMBAT_MEASUREMENTS.md THAT WAS CONVERTED AT /1.875 IS 20% TOO LARGE. The correct 1080p divisor is 2.25. The web build's letterbox routine sets base 800x480 and, for a viewport wider than 800/480 = 1.6667, takes the fit-height branch: scale = stageHeight/480 and offsetX = (stageWidth - 800*scale)/2. At 1920x1080 that is scale 2.25 with 60 px pillarbox bars. Three independent confirmations: (1) source, §1t1540s0§.as:271-307 plus §1t1523s0§.as:104/106 (stageWidth 800, stageHeight 480); (2) frames -- I measured the pillarbox on four session11 frames (first/last column with any pixel >12): damage-ttk/t125.350.png 54->1862, gap-focus-trigger/t1747.000.png 48->1867, stance-reach/B_t783.400_LIGHT_stroke-anchored-at-body_farGap436px.png 52->1868, stance-reach/A_t117.400_BALANCED_lvl1_stroke235px.png 54->1863, i.e. content ~1810-1820 px = 800x2.25 = 1800 plus compression bleed, whereas /1.875 demands 210 px black bars that are simply not present; (3) reductio -- the HUD reload bar sits at row y=1036 (I measured it), which at /1.875 maps to stage y ~504, off the bottom of a 480-tall stage, physically impossible, while at /2.25 it maps to stage y ~460 of 480, i.e. the bottom HUD strip. Corrected c-2 reach bands: LIGHT 233-241 -> 194-201 (max 303 -> 252); BALANCED 116-131 -> 97-109; HEAVY 97-103 -> 81-86 (max 121 -> 101). Note the corrected Heavy MAX of 101 now kisses the source's hard 100-px floor, and every band sits at or below its source cap, which is what a body-to-endpoint distance should do against a path-length budget.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-307 + §1t1523s0§.as:104,106 + reference/frames/session11/gap-focus-trigger/t1747.000.png`
- **Build:** web v0.717
- **KILLS this line:** "c-2 stage-px conversion: 'at 1920x1080 then converted at /1.875'"
- **Lane impact:** L5 + L8 + every MEASURED row that carries a stage-px conversion. Re-derive COMBAT_MEASUREMENTS.md and MOTION_MEASUREMENTS.md at /2.25 and offsetX=60 before any of those numbers become CONTRACT. It also gives the port an exact viewport contract: logical stage 800x480, uniform fit-height scaling, horizontal pillarbox.

### `[[meta-social/world-board-is-a-coordinate-grid-not-a-japan-outline]]` — UPHELD [A1] (2 critics)

REBUILD_READINESS.md:115 says the world map is a 'sparse geographic Japan outline, not a grid you can generate from W×H'. The rendered board contradicts that: it is a regular rectangular lattice of uniform rounded-square tiles, and territories carry integer (x,y) coordinates — 'NAGANO (26,52)' — printed in the header. The Japan outline is a background painting drawn UNDER the lattice, not the board's geometry.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg — whole frame 512x288 upscaled x3 LANCZOS`
- **Build:** web v0.717
- **KILLS this line:** "- World-map topology/projection (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** L10 world-exploration + L11 meta-social — a (26,52) coordinate label means the board IS addressable as a lattice, so War-Room adjacency is almost certainly 4- or 8-neighbour on integer coordinates rather than a hand-authored graph. Nobody in this packet claimed this; the world-map finding I judged claims only the tile vocabulary and level gating. This is the sentence that should actually fall, and :245 ② (board/adjacency) should be narrowed to 'adjacency rule unconfirmed' rather than 'topology unknown'.

### `[[meta/interactui-uidata-blob-is-utf8-not-utf16le]]` — UPHELD [A2] (2 critics)

reference/extracted/android/90_InteractUI_UIData.bin is UTF-8, not UTF-16LE — its first bytes are literally the XML declaration naming UTF-8. Decoding it by the §0 briefing's blanket UTF-16LE rule yields 3 lines of garbage and zero hits, which would have produced a wrong REFUTED on rebirth/element-atk-budget-is-100.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:1 (and :97 for the payload line the mis-decode hides)`
- **Build:** android v0.682
- **KILLS this line:** "⚠ THE ANDROID BLOBS ARE UTF-16LE. A byte-level grep returns 0 hits and WILL fool you into wrongly refuting a sound claim. Decode before you judge."
- **Lane impact:** Process, all lanes: the §0 briefing's warning is not true of every blob. Encoding must be sniffed per-file before any grep-based refutation. As written the warning is itself a fail-open trap — it tells a critic that a zero-hit grep is expected, which is exactly when a wrong REFUTED gets waved through.

### `[[newfind/mastery-ceiling-is-10-not-9]]` — UPHELD [A2] (2 critics)

The mastery domain's ceiling is 10, not 9, so the ledger's 'mastery-9 ceilings' phrase is off by one — the stance tables are MASTERY-10 ceiling values. Three independent artifacts: skilldata.xml:73-79 gives skill 1000 (displayname 6000 = 'Light Stance Mastery') a top <value>10</value>; strings.json["8131"] is the achievement 'Light Stance Mastery Level 10.' (so 10 is reachable); and only m=10 substituted into the v0.717 damage switch reproduces the ledger's own 0.9 / 1.2 / 1.4 table — m=9 yields 0.86 / 1.18 and reproduces nothing. getStat(1000/1001/1002) routes through StatsManager.as:3956-3962 to skillStat.getValue(), returning 0 when unlearned, so the full domain is 0 / 1-10. The 'ceiling, not base' half of the ledger sentence survives; only its number falls.

- **Cite:** `reference/extracted/skilldata.xml:73-79 · docs/gauntlet/L0/index/strings.json (entry ["8131"]) · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262 and :3265 · reference/decompiled/shs3_android/scripts/StatsManager.as:3956-3962`
- **Build:** both — web v0.717 coefficients, android v0.682 data tables
- **KILLS this line:** "the stance tables are mastery-9 ceilings, not base"
- **Lane impact:** L5 combat-core — replace 'mastery-9' with 'mastery-10' wherever it appears, and ship the domain as 0/1-10. This is also why I refuted combat-core/mastery-is-0-to-9 and combat-core/mastery-is-single-digit.

### `[[npcdata/damage-is-a-range]]` — UPHELD [A2] (2 critics)

Weapon damage is a RANGE, not a single WeaponDMG term: minDamage = attack + item.mindamage with damageRange = maxdamage − mindamage, and slashUsage is clamped to a floor of 48 — but this is the PvP duelist init path, so whether the PvE NPC path applies the same rule is not established here.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:352-364`
- **KILLS this line:** "- Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical; Chi-skill damage is a flat per-level constant that ignores defense (except Undead/Red Oni)."
- **Lane impact:** combat-core — the KNOWN-KNOWN damage formula is at best incomplete: weapon contribution is a min/max roll and there is a hard slashUsage floor of 48; no stance multiplier appears in this function. PARTIAL because the PvE damage path was not read.

### `[[npcdata/loot-drop-tables]]` — UPHELD [A2] (2 critics)

Drop tables with exact probabilities are held: 66 NPCs carry <reward> holding 131 <loot> rows, <chance> domain exactly {0.05, 0.1, 0.3, 0.4, 0.5, 1} and <qty> ∈ {1,2,3,5}, with a visible boss pattern (id=2, qty=1, chance=1 guaranteed) and an animal-butchery pattern (Meat 0.3 / Small Meat 0.3 / Large Meat 0.4 / Animal Fang 0.5).

- **Cite:** `reference/extracted/npcdata.xml:530-532 (npc 17 Bandit Leader), :39-42 (npc 1), :1859-1861 (npc 67 Wolf), :1975-1982 (npc 73 Boar)`
- **KILLS this line:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L-items-equipment / L-economy / L-enemies-ai: the §1 known-unknown 'loot/drop tables' is overturned as to STRUCTURE and PROBABILITIES. PARTIAL because loot <id> 0/1/2/3 are table references, not item ids (real item ids in the same field are 4–5 digit: 2112/2113/2114/20028) — what tables 0–3 resolve to is STILL_UNHELD from this file. Separately and importantly for L-economy: <reward> contains ONLY <loot>. There is no <xp> and no <coins> tag anywhere in npcdata.xml, so the 'coins-per-kill =8 unconfirmed INFERRED seed' gets no help here.

### `[[progression/required-is-skill-points]]` — UPHELD [A2] (2 critics)

The <required> field is the skill-point PRICE of that level, not a character level (that is the separate <lvlreq>), and each stance mastery is a 10-level ladder costing 1,1,2,3,4,5,6,7,8,9 SP = 46 SP to max.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:253-263 with strings.json["158"]; ladder at reference/extracted/skilldata.xml:10-79`
- **KILLS this line:** "the stance tables are mastery-9 ceilings, not base; Season 1 is 14 chapters, not 4"
- **Lane impact:** L10 progression — makes the whole SP economy computable (ledger blocker ③ 'post-rebirth SP economy' still needs the post-rebirth grant, but the SPEND side is fully priced). Because levels 1 AND 2 both cost 1 SP, the ladder tops out 9 above its start, which is the likely origin of the wiki's 'mastery-9' framing the ledger repeats at :58 and :155 — the data says TEN levels.

### `[[progression/unlock-rule-breaks-inside-ninja-and-chi]]` — UPHELD [A2] (2 critics)

The ledger's unlock rule breaks inside its own two NAMED families, not just on a general skill. Resolving <category> through the string table: category 6 = Ninja and category 4 = Chi. Ninja ladder measured: Throw Kunai 10, Lay Trap 15, Smoke Bomb 20, Windmill Shuriken 30, Flashbang 40, Shadow Clone 50, Stealth 60, Substitution Jutsu 70, Mass Shadow Clone 80 — Lay Trap at lvlreq 15 ends in 5, not 0. Chi ladder measured: Focus 5, Slash Wave 15, Chi Kick 25, Spirit Thief 35, Chi Burst 45, Chi Charge 50, Charged Shot 55, Heavenly Sword 65, Deadly Touch 75 — Chi Charge at lvlreq 50 ends in 0, not 5. This closes the loophole in the packet's own counterexample, which used Roll (category 5, a general skill neither Ninja nor Chi).

- **Cite:** `reference/extracted/skilldata.xml:255-257 (the Roll row the packet used) — full <lvlreq> and <category> table re-parsed from reference/extracted/skilldata.xml, ids resolved via docs/gauntlet/L0/index/strings.json`
- **Build:** android v0.682 (the web build fetches skilldata.xml from the Player.IO CDN and embeds no copy)
- **KILLS this line:** "- Progression spine: XP caps L1–L10 (550…31 400), +3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat per point, level cap 80, 80 SP first run, skills unlock at levels ending 0 (Ninja) / 5 (Chi)."
- **Lane impact:** L4: strengthens the existing overturn of REBUILD_READINESS.md:77-78 so it cannot be rescued by reading the rule as family-specific.

### `[[progression/unlock-rule-ends-in-0-or-5-false]]` — UPHELD [A2] (2 critics)

The ledger's stated unlock rule 'skills unlock at levels ending 0 (Ninja) / 5 (Chi)' is falsified on the first row of the lvlreq table.

- **Cite:** `reference/extracted/skilldata.xml:255-257 (id 1004, displayname 6007, lvlreq 3) with strings.json 6007 → 'Roll'`
- **KILLS this line:** "- Progression spine: XP caps L1–L10 (550…31 400), +3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat per point, level cap 80, 80 SP first run, skills unlock at levels ending 0 (Ninja) / 5 (Chi)."
- **Lane impact:** L4: REBUILD_READINESS.md:77 carries THREE errors in one sentence — '+1AP' (really +5), '80 SP first run' (really 79), and the 'levels ending 0/5' rule (broken at L3 by Roll). The unit overturned the first two but did not mark line 77 itself, only the line-199 Ready bullet. Both lines need the edit.

### `[[quests-story/frame-beats-payload-dialogue-rewritten]]` — UPHELD [A1] (6 critics)

FRAME BEATS PAYLOAD: the shipped build's Prologue dialogue is REWRITTEN relative to questdata.xml — of six comparable strings in one scene, 1 is exact, 1 near-exact and 4 are different wording, while the structure (speakers, beat order, exactly two choice rows, reconvergence) matches perfectly. questdata.xml is a script-COMPLETE, near-verbatim source, not a byte-verbatim one, and I say so out loud: where the frame and the payload disagree, THE FRAME WINS.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=62/66/68/72/76 s, 1920x1080 frames, crop (0,700)-(1400,1060) [bottom parchment dialogue box + nameplate tab], 5-up sheet at 640x360/panel — scratch: /private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/qframes/sheet.png`
- **KILLS this line:** "| §4 quests-story: "verbatim dialogue — captured NOWHERE"; §6: "structurally unrecoverable" | questdata.xml — 2,771 <dialogue> blocks, 3,307 verbatim <text> lines, 471 <choice>, full <cutscene> direction |"
- **Lane impact:** L1 CAMPAIGN — its done-criterion 'all 3,307 lines present byte-exact' is now known to NOT equal on-screen fidelity for at least the Prologue. L1 must add a frame-reconciliation pass for every scene visible in the two longplays, and must label the rest 'payload wording, may differ from shipped build'.

### `[[quests-story/portraits-held-but-encrypted]]` — UPHELD [A2] (2 critics)

Dialogue portrait art is not a separate unrecovered problem — it is held-but-encrypted in the same nested-CWS blob as the audio, behind a fully-specified two-mode renderer, with one portrait class already decompiled.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestDialogueUI.as:46,67-75 + ResourceManager.as:37,270,286 + PortraitBust.as + reference/decompiled/shs3_payload/scripts/portrait_kojuro.as`
- **KILLS this line:** "| §4 quests-story: "verbatim dialogue — captured NOWHERE"; §6: "structurally unrecoverable" |"
- **Lane impact:** L6 ART — corrects the survey's own score rationale ('the art itself is a separate recovery problem'). RESOURCE_IMAGE is 124_Mobile_ImageResource, a nested-CWS blob = Stage-0 finding S0-5's held-but-encrypted class, NOT a fresh recovery problem; and portrait_kojuro.as is already decompiled in three bundles, proving the class shape. Two asset families, not one: 52 NPC portraits (class portrait_<token>) and 16 full-screen chapter splashes (class image<token>: _episode0.._episode12, _epilogue, _exposition, _exposition_epilogue). Placement is exact (x=800, y=0), and the no-<img> fallback is the 2x-scaled MCS paperdoll bust built from the NPC's equipment — so most speakers need no bespoke art at all.

### `[[skilldata/51-skill-animations]]` — UPHELD [A2] (2 critics)

51 skill animations with full per-bone keyframes are on disk (51 <anim>, 547 keyframes, 8,351 bone transform rows), including paired attacker/victim rigs of DIFFERENT lengths — backthrow d=39 with backthrow_victim d=36, kneegroin d=30 with kneegroin_victim d=41 — and explicit _pose holds.

- **Cite:** `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin (tag census animdata 1 / anim 51 / f 547 / n 8351)`
- **KILLS this line:** "Some things are structurally unrecoverable and must become honest, labeled deviations"
- **Lane impact:** art-anim-audio-feel — skill animation is HELD with exact bone translation+rotation and 24fps timings; combat-core — per-skill startup/active/recovery is derivable from the d= frame counts.

### `[[skilldata/enemy-range-bands]]` — UPHELD [A2] (2 critics)

Enemy AI selects skills from four hard-coded distance bands declared verbatim in EnemyPlayer.as — veryClose (16 skills), close (13), mid (22), long (16) — a large, exact piece of enemy behaviour the ledger scores as absent; Heavenly Sword appears in all four bands, Throw Kunai only in mid and long.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:30-36`
- **KILLS this line:** "§2 enemies-ai 34/100, blocker ① "enemy level→stat formula… absent""
- **Lane impact:** enemies-ai — the skill-selection policy is HELD (the level→stat formula genuinely is not, so blocker ① itself stands); combat-core.

### `[[skilldata/unlock-cadence-and-stance-sp-cost]]` — UPHELD [A2] (2 critics)

The 'unlock at levels ending 0 (Ninja) / 5 (Chi)' cadence holds for 17 of 19 gated skills with two exceptions (Lay Trap at 15 in Ninja, Chi Charge at 50 in Chi), and the stance trees have NO character-level gate at all — they are gated purely by mastery level, which runs to 10 and costs 46 SP per stance, so 80 SP on a first run cannot max even two of the three stances.

- **Cite:** `reference/extracted/skilldata.xml — every <lvlreq> in the file (max 80); :656 (qty 3), :673 (qty 5), :1187 (qty 4), :1238 (qty 10) for the Light tree; skill 1000's ten <required> values 1,1,2,3,4,5,6,7,8,9 at :12-:75`
- **KILLS this line:** "skills unlock at levels ending 0 (Ninja) / 5 (Chi)"
- **Lane impact:** progression — the SP budget versus tree cost is a hard, previously-unstated constraint and the real economic argument for rebirth; it also explains the ledger's §3 'mastery-9 ceilings' correction (the level-10 row's <required> is 9 while <value> is 10 — the ceiling is 10). rebirth-elements; skills-meters.

### `[[world-exploration/is-a-wxh-grid]]` — UPHELD [A2] (6 critics)

§1's unknown-unknown "World-map topology/projection ... not a grid you can generate from W×H" is wrong — it is precisely a W×H grid, 63 wide by 72 tall, carrying a 1-bit land mask and rendered at 10 px per cell.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72) + WorldMapUI.as:230`
- **KILLS this line:** "- World-map topology/projection (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** L1 world-exploration: retires one of §1's eight unknown-unknowns. The 'sparse geographic outline' intuition was right about the shape and wrong about the representation — which is exactly what made it look unrecoverable. Two lines of code plus one 272-byte GIF reproduce the whole projection.

### `[[world-exploration/secret-areas-behind-bushes]]` — UPHELD [A2] (2 critics)

Overworld rooms have a hidden-passage layer: Scavenging level 5 highlights in red the bushes that conceal paths to secret areas.

- **Cite:** `reference/extracted/skilldata.xml:835-841 (skill 1021 Scavenging, level 5, <desc>7094</desc>) resolved via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "- Content depth: Ep4–12 + epilogue (10 undocumented chapters); verbatim dialogue; per-quest trigger types + coords; the full territory map/geography; elemental-skill effect values."
- **Lane impact:** L9 world — a room-content mechanic (concealed exits + a skill-driven reveal) that appears in no ledger system; world-exploration's known-unknowns list only trigger types, coords and geography. Pairs with S0-4's 112_Mobile_NodeData (535 ids, 372 <x>, 343 <obj>).

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[NF-E/survival-mode-content-diverges-14-of-87-rows]]` — NOT-UPHELD [A2] (2 critics)

Survival-mode authored content is NOT the same in the two builds. Web bindata/119_1t4646s0.bin is 11,721 bytes against android 109_WarHexUI_SurvivalModeData.bin's 11,553. Both hold 39 <wave> and 87 <enemy> rows with the same spawn-x histogram {-50: 49, 1650: 37, -1650: 1}, but 14 of the 87 enemy rows differ: web rows 73-76 read id '449|454|449|454|443' where android reads '449|454', rows 77-80 read '450|455|450|455|443' vs '450|455', and rows 81-84 read '451|456|451|456|443' vs '451|456'. The web build adds enemy 443 to three late-wave alternation pools. The unique-id sets are unequal in both directions. Survival mode IS in the target build and can be specified from it - but from the WEB blob, not the android one.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both parsed; all 87 <enemy> rows diffed pairwise)`
- **Build:** web v0.717 vs android v0.682 - real content divergence
- **aimed at this line, which SURVIVES:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: the S0-1 gap can be closed from the TARGET build, and NF-8-survival-mode-is-byte-identical-in-both-builds must not be absorbed as filed - its identity claim is false and would smuggle mobile wave content into a v0.717 target.

### `[[NF-boss-hp-derivation]]` — NOT-UPHELD [A2] (2 critics)

The boss HP/ATK derivation is real shipped code, which vindicates the max() reasoning that packet claim 20 says rests on a false premise. maxhp = max(levelScaledAuthoredHP, playerhit x hitsToKillBoss), and the same shape for attack.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:73-77 and :90-137`
- **Build:** both
- **aimed at this line, which SURVIVES:** "Damage math: Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical."
- **Lane impact:** L-combat-core: the whole boss-scaling model is now codeable exactly — including the level-banded playerhit floors at :108-123 (lvl<=10 -> 1, <=20 -> L/8, <=30 -> L/6, else L/4). src/config/combat-sim.ts's comment needs one clause fixed ('not authored at all'), not a rewrite.

### `[[combat-core/v0717-stance-curves-are-already-in-config]]` — NOT-UPHELD [A2] (1 critic)

The v0.717 web payload gives light reach ×1.4, balanced ×(1+0.02·mastery), heavy ×(0.5+0.04·mastery) floored at 100, and damage light ×(0.5+0.04·m) / balanced ×(1+0.02·m) / heavy ×1.4 — i.e. src/config/reach.ts is already correct and the survey's 'three wrong constants' would regress it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119 (reach) and :3258-3271 (damage); build stamped 0.717 at §1t1523s0§.as:36`
- **aimed at this line, which SURVIVES:** "- STANCETABLE already carries reach 300/200/120 + speed — but never wired into resolveSlash and mislabeled INFERRED when they're actually the wiki's mastery-9 values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — do NOT touch src/config/reach.ts. lightMult 1.4, balancedPerMastery 0.02, heavyPerMastery 0.04, heavyFloor 100 are the target build's own numbers and were read from this file on 2026-07-25 (SOURCE_CONSTANTS.md:193, 204-206). The android 1.5/0.005/0.005 values are v0.682 and must never be quoted as 0.717.

### `[[hunter/interactui-service-cost-table]]` — NOT-UPHELD [A2] (2 critics)

InteractUI.as holds the complete town-service action table — roughly 40 named verbs, most with an explicit cost — and no claim in the packet mentions it. Costs I read directly: repairweapon nodeLevel x 10, reinforceweapon 5000 coins, nameweapon 2 Heavenly Gold, fullhpchi 1 Heavenly Gold, convertgold 1 Heavenly Gold -> 1000 coins. The rest of the verb set: goto, close, innrest, peddlerbuy/sell, merchantbuy/sell, barberbuy, innbuy, sellcrop, travel, plant, harvest, buygoods, sellgoods, fire/wind/water/earthrebirth, deposit, withdraw, bet, chohan, buypremium, leaveclan, joincustomclanrecruit/general, forgeweapon, dailyprize, redeem, bankstorage, crafting, achievement, paytowntoll.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:783-1405`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L-economy and L-world-exploration: most of the open service/pricing surface in one file, and it fixes the premium-currency exchange rate (1 HGold = 1000 coins).

### `[[ui-hud/NEW-web-and-android-payloads-ship-different-stage-rects]]` — NOT-UPHELD [A3] (2 critics)

The 800x480-vs-800x690 question is not a measurement dispute — the two builds literally ship different SWF document rects. The WEB payload's header RECT decodes to 800x690; the ANDROID payload's decodes to 800x480; reference/preservation/shs3.swf is 800x690.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf, reference/preservation/shs3.swf — my own SWF header RECT bit-decode (nbits = byte[0]>>3, four signed twips fields, /20)`
- **Build:** both
- **aimed at this line, which SURVIVES:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L8 ui-hud and L6 art-anim-audio-feel: corroborates art-anim-audio-feel/second-layout-mode-800x690 at byte level rather than from code alone. The web build reserves the extra 210 px for the friend bar in its document rect; the android build does not ship the bar at all. HUD x-fractions read off the longplay are against a 800x480 PLAY AREA inside a 800x690 stage, which is a different correction from a simple pillarbox.

### `[[ui-hud/friend-bar-690]]` — NOT-UPHELD [A2] (2 critics)

The 690-px stage height is not container chrome: it is originalHeightWithBar, a viewport-driven in-game friend panel the engine lays out itself, and the web build shipped the 690 stage while the Android build shipped the 480 one.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:271, :277-283; SWF headers of reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf`
- **aimed at this line, which SURVIVES:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud and meta-social, not art: the ledger's aspect-ratio unknown resolves to a TWO-MODE layout — 800x480 with the friend bar off (wide viewports, which is what both longplays record) and 800x690 with a game-drawn friendpanel on (narrow viewports). Neither ui-hud nor meta-social holds a friend panel. Also retires the false frame-vs-doc conflict in art-anim-audio-feel/aspect-ratio-frame-wins.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-10-obfuscated-bundle-grep-method]]` — UPHELD [A2] (1 critic)

METHOD FINDING for every remaining L0 lane: absence in reference/decompiled/shs3_payload/ cannot be concluded from grepping an identifier. That bundle renames classes, members AND locals (§1t…§ / _loc*). Numeric and string LITERALS survive intact. Two claims in this packet reached wrong conclusions from identifier greps. The reliable technique — which established every web twin used in this review — is to search for the numeric literals and then confirm by function ORDER and body shape. Twins established this session: §1t99s0§ = MCSPlayer, §1t1523s0§ = StatsManager (version 0.717 at :36), §1t1540s0§ = GameEngine, §1t1541s0§ = InputManager, §1t5495s0§ = DragonDanceUI, §1t4906s0§ = EnemyPlayer-init path.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:812`
- **Build:** web v0.717
- **Lane impact:** All lanes: re-run any STILL_UNHELD verdict that rests on a shs3_payload identifier grep. Two in this packet alone were wrong (the friend-bar 'android-only' caveat) or needed literal-level confirmation (the repair-cost parity hole, which I confirmed IS real).

### `[[NF-1-web-gameplay-canvas-really-is-800x480]]` — UPHELD [A2] (1 critic)

The web v0.717 build's own code sets the gameplay canvas to 800x480, so the 800x690 SWF document rect is chrome, not canvas. §1t1523s0§.as:104 `public static var stageWidth:int = 800;` and :106 `public static var stageHeight:int = 480;` (a second 800/480 pair at :120/:122). This BLOCKS any rewrite of REBUILD_READINESS.md:117 ('native canvas is 800x480 (5:3)') and separately ANSWERS ui-hud blocker 1 at :235 ('read stage.stageWidth in a build') in the ledger's favour. The extra 210 px in the document rect is the Kongregate friend-bar band.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104, :106`
- **Build:** web v0.717
- **KILLS this line:** "- Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud: blocker 1 is CLOSED in the ledger's favour rather than overturned. Also corrects the over-reach in art-anim-audio-feel/web-swf-header-is-24fps-and-800x690's lane_impact.

### `[[NF-12-shape-fill-histogram-is-slot-frequency-not-area]]` — UPHELD [A3] (1 critic)

A limit the vector-art finding does not state, which would mislead a builder. Its fill histograms count entries in each shape's FILLSTYLEARRAY, so '#000000 x243' means 243 shape records DECLARE a black fill slot — not that black covers the most pixels. Rendered-area ranking would need edge records and shape geometry, which neither of us parsed. My independent parse of the same three files reproduces the ranking exactly and the mid-table counts exactly (#333333 x160, #CCCCCC x147, #FECA98 x127, #B78F6C x120 in 115; #30291D x35, #5A4D2E x33, #3A3323 x23, #251F16 x21, #453929 x21 in 120), which is why I judged the finding HELD — but the label matters.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin, 120_Mobile_BGResource.bin, 124_Mobile_ImageResource.bin decrypted (keys 104/103/109) — my own DefineShape/2/3/4 FILLSTYLEARRAY parse`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim: under the 2026-07-24 permission ruling these ARE exact OG hues and are far better than eyedropper reads off compressed video — but harvest them per-symbol (torso4000, skill1000, acc3000 all resolve cleanly), never as a global 'most-used colour' ranking.

### `[[NF-2-animdata-hold-table-is-both-builds]]` — UPHELD [A2] (1 critic)

The hard-coded per-animation duration-tail table is in the WEB payload too, so the pose-latch spec is a both-builds fact rather than an android inference. Same tail groups: 13 *SLASH_POSE at +10, 10 *FALLSLASH_END/*JUMPSLASH_LAND at +15, the sheathesword pair at +24, the six-death-anim set at +6, +48, +50, and the five +24 skill poses. The web build states the latch even more cleanly than android: its frame getter CLAMPS to the last frame rather than guarding on length. Web adds one tail entry android lacks and drops 'light_afterslashpose'.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t783s0§.as:17, :27-146, :149-156 (vs reference/decompiled/shs3_android/scripts/AnimData.as:15, :23-141)`
- **Build:** both
- **Lane impact:** L6 art-anim: the recovery-window spec for every slash is (@d from data) + (this table's tail), ticked at 24 Hz, in the TARGET build. Bank it as the pose-latch row REBUILD_READINESS.md:239 asserts is Ready but never contains.

### `[[NF-7-800x690-is-the-friend-bar-layout]]` — UPHELD [A2] (1 critic)

The web SWF's 800x690 document rect is the friend-bar layout, NOT a second native canvas, so REBUILD_READINESS.md:117's 'native canvas is 800×480 (5:3)' SURVIVES. The web payload carries the same resize handler as the android build, naming 690 explicitly as height-with-bar, and its own stage constants are 800 x 480. What IS new is that a second layout mode exists, gated by a stageShowingFriendBar flag.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273 and §1t1523s0§.as:104, :106 (android twin: reference/decompiled/shs3_android/scripts/GameEngine.as:269-271)`
- **Build:** both
- **KILLS this line:** "Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-compressed."
- **Lane impact:** L10 ui-hud: this REFUSES half of web-swf-header-is-24fps-and-800x690's overturn. Do not delete the 800×480 line; add a friend-bar layout mode beside it. The x dimension is 800 in both modes, so the pillarbox worry about x-fractions is untouched.

### `[[NF-C/focus-fills-plus-one-per-tick-plus-six-per-kill]]` — UPHELD [A2] (1 critic)

The Focus meter fills +1 per tick, not +6. In android the per-tick fill is 'if(this.reload < this.maxreload) { ++this.reload; }' (MCSPlayer.as:1158-1160) and the web twin is identical (§1t99s0§.as:1203-1205). The +6 lives in bonusReload() (MCSPlayer.as:3265-3272; web twin §1t99s0§.as:3318-3325), whose only call site in the entire android bundle is NPCManager.as:1709-1711 'if(deathCount > 0) { StatsManager.getPlayer().bonusReload(); }' - i.e. a bonus granted once per batch of enemy deaths, not a tick rate. A full census of every write to reload in MCSPlayer.as (:240, :1160, :3100, :3108, :3244, :3261, :3267) shows no other fill path. Combined with NF-B's maxreload, the web bar takes 192 ticks (8 s at 24 fps) to fill from empty with no kills.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1158-1160, :3265-3272 + NPCManager.as:1709-1711 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1203-1205, :3318-3325`
- **Build:** both
- **KILLS this line:** "(no ledger sentence yet - this corrects combat-core/focus-crit-gating-rule-is-held before it enters)"
- **Lane impact:** L5: prevents a 6x-too-fast Focus fill from being written into the Sim, and identifies the kill-bonus as a distinct reward mechanic.

### `[[actionscript/build-divergence]]` — UPHELD [A2] (2 critics)

Android v0.682 and web v0.717 do NOT share combat tuning — six constants differ (crit 1.2/1.5 vs 1.3; Heavy damage 1.5 vs 1.4; mastery scale x0.01 vs x0.1; Light reach 1.5 vs 1.4; Focus max 120 vs 192; stance-change cost maxreload/6 vs flat 48) — while non-combat data (expArray, sell formula) is byte-identical, so Stage-0 finding S0-3's caveat moves from 'parity NOT established' to 'parity DISPROVEN, per-value'.

- **Cite:** `web reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277, :3083-3150, :249 vs android reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223, :3019-3084, :239`
- **Lane impact:** All lanes L1..L11 — a governing rule for every payload-derived number. The readable build is the WRONG one to copy combat numbers from; v0.717 is the build that matches the wiki.

### `[[actionscript/web-payload-obfuscated]]` — UPHELD [A2] (2 critics)

The web v0.717 payload's game logic survives only as identifier-obfuscated ActionScript, so the readable 970-file Android v0.682 export is the only plain-named index into it — the index's 385 'shs3_payload classes' are almost entirely PlayerIO SDK, Google Analytics, Flash UI and asset-symbol stubs, not game code.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255 (plus the directory: 645 top-level .as files named §1t<N>s0§.as and an obfuscated package scripts/§1t51s0§/§1t51s1§/)`
- **Lane impact:** All lanes L1..L11 — this is the method note for the whole payload-era corpus: find the shape in the Android tree, then re-verify the constant in the web tree.

### `[[android-blobs/farthest-plane-also-has-a-blur-cutoff]]` — UPHELD [A2] (1 critic)

The ground plane is not the only plane with a per-layer blur exception. BG_Loader.as:186 wraps the farthest-plane blur in `if(!(this.bgType == BG_FORESTSPOOKY && i > 2))`, so BG_ForestSpooky's farthest layers 3 and 4 render sharp. Separately, FIVE bgdata records carry gcount=4, not four: id 6 BG_ForestSpooky, 32 BG_Graveyard, 48 BG_TempleExteriorFog, 49 BG_TempleRuinsFog, 51 BG_DungeonFog.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:186-191 + reference/extracted/android/123_Mobile_BGData.bin (gcount census)`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim: bounds android-blobs/ground-blur-applies-to-two-layers-only. The depth-of-field rule is per-plane AND per-background, not a single ladder with one exception.

### `[[android-blobs/ground-blur-applies-to-two-layers-only]]` — UPHELD [A2] (1 critic)

The ground plane is the one exception to the blur ladder: groundLayerBlur is applied only to ground layers 1 and 2, while farthest, far, playerPlane and foreground blur every layer they own — so a recreation that blurs all ground layers at 4 is wrong.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BG_Loader.as:248-252, contrasted with :188-191, :209-212, :229-232 and :260-263`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim. STRENGTHENS android-blobs/parallax-and-dof-contract, which reads the declaration site only and therefore reports groundLayerBlur=4 as a uniform plane property. It is not: it is a per-layer rule with an index cutoff, and four of the 49 backgrounds have ground layers past the cutoff. Also note only those two layers get cacheAsBitmap, so the blur is baked once and the sharp ground layers stay live.

### `[[bindata/NEW-swf-690-is-480-plus-bar]]` — UPHELD [A2] (1 critic)

The apparent contradiction between the web SWF header's 800x690 stage rect and the 800x480 gameplay canvas is not a contradiction — the engine declares both, with 690 being the stage height WITH the bar. This reconciles the frame measurement (1816x1080 pillarboxed, aspect 1.6815) with the payload header without anyone having to lose.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:269-271`
- **Build:** android v0.682
- **KILLS this line:** "Stage is 800x480 gameplay; 800x690 is the stage including the bar. The SWF header rect (twips [0,16000,0,13800]) is the with-bar figure, not a conflicting stage size."
- **Lane impact:** Closes the open conflict carried by bindata/aspect-frame-beats-swf-header without weakening the frame-wins invariant — the frame and the header were measuring different rectangles.

### `[[bindata/NEW-web-android-survival-data-differ-in-14-lines]]` — UPHELD [A2] (1 critic)

The web survival/war wave table and its Android counterpart are not identical: exactly 14 lines differ, all in the late 449/450/451 waves, where the web build repeats the enemy pair and appends a 443 (Soldier). Wave count, enemy count, spawn geometry and the 700-710 slots are identical.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:466,471,479,484,492,497,505,510,518,523,531,536,544,549 vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (same lines)`
- **Build:** both
- **KILLS this line:** "Web v0.717 war waves are denser than Android v0.682 in the final nine waves (pair repeated + one Soldier appended). Use the web file (bindata/119) for v0.717 tuning."
- **Lane impact:** Gives a concrete, bounded measurement of web-vs-android data drift instead of a blanket caveat: 14 lines out of 556, all late-wave density.

### `[[bindata/NEW-web-payload-is-decompiled-parity-is-checkable]]` — UPHELD [A2] (1 critic)

The WEB v0.717 payload is decompiled and on disk at reference/decompiled/shs3_payload/scripts/ — 1,079 .as files with obfuscated identifiers (§1t58s0§.as etc.). Every Android-v0.682 cite in this packet is therefore parity-checkable against the actual web build, and the gauntlet's standing 'android string while asserting web behaviour' hole is narrower than assumed. I used it twice: the RNG LCG is identical in both builds, and the AnimData post-clip hold table carries the same value sequence.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84-85 and :12-20; reference/decompiled/shs3_payload/scripts/§1t783s0§.as:42-145`
- **Build:** web v0.717
- **KILLS this line:** "Web v0.717 code IS recovered (obfuscated). RNG and animation hold-table are byte-equivalent across builds; other android-only cites can and should be parity-checked here before being marked as parity holes."
- **Lane impact:** Removes the blanket build-parity caveat from every AS3-sourced claim in this lane; each one is now individually checkable rather than presumptively android-only.

### `[[bindata/default-block-overrides-all-traps]]` — UPHELD [A2] (1 critic)

The trap system ships with a debug override the packet never mentions, and it is the source of the census inflation in bindata/trap-census-and-800-is-one-screen. RoomGenNode checks for a <default> element in traproomdata BEFORE any tier selection and, if present, replaces every trap room in the game with it. 93_1t4647s0.bin:22-30 is exactly that block, shipped commented out — which is why raw greps of the file return 70 rooms and 314 objects instead of the live 69 and 297.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2437-2440 + reference/extracted/bindata/93_1t4647s0.bin:22-30`
- **Build:** both
- **Lane impact:** L-traps: explains a live counting trap in this source and documents a shipped dev switch.

### `[[bindata/matrix-nodes-and-reorder-frames]]` — UPHELD [A2] (1 critic)

Two measured coverage numbers nobody in the packet states. (1) Of the 81,706 <n> nodes across the 19 animdata blobs, 79,867 use the plain rotation form and 1,839 (2.25%) use the a/b/c/d 2x2 matrix form — concentrated in 114 (spider, 817) and 108 (human, 492), spread over 15 of the 19 blobs. matA spans -101..150 in fixed-point x100, so parts are mirrored and scaled up to 1.5x, not merely rotated. (2) There are 258 <f r="1"> layer-reorder frames across all 19 blobs; claim bindata/sprite-compositing-contract's '89 in file 108' is exact but is only a third of the total. Also: FrameData.setVisible hides only slots 0..21, so prop3(22), l_shoulder(23), r_shoulder(24), l_knee(25) and r_knee(26) are never hidden, then hat and crotch are force-shown.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin and 108_1t4635s0.bin (regex census over 1[01][0-9]_*.bin) + reference/decompiled/shs3_android_payload/scripts/FrameData.as:74-89`
- **Build:** web v0.717
- **Lane impact:** L-art-anim: sizes the remaining transcription work honestly (src/config/ogAnims.ts already models the matrix quad, so this is coverage, not a bug) and names an engine asymmetry a faithful renderer must reproduce.

### `[[bindata/stage-letterbox-algorithm]]` — UPHELD [A2] (1 critic)

The engine's own letterbox/pillarbox algorithm, which resolves the apparent 800x690-vs-800x480 contradiction between the web SWF header and the longplay frames. The base canvas is 800x480; 690 is 800x480 plus a 210px friend bar that is only shown when the window is TALLER than 800/690. The engine fits width or height, centres with an offset, and publishes stageScale / stageOffsetX / stageOffsetY / stageFitWidth / stageBaseWidth / stageBaseHeight — the same values InputManager uses to convert mouse coordinates back into stage space.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:267-312 + InputManager.as:185-186`
- **Build:** android v0.682
- **Lane impact:** L-render/L-input: the frame still wins on what the playfield is (1816x1080 measured, 5:3), and this is the code that produces those pillars. It also gives the exact screen-to-stage mapping any input port needs.

### `[[bindata/two-more-trap-placement-rules]]` — UPHELD [A2] (1 critic)

Trap-room placement has FIVE paths, not the three in bindata/trap-room-placement-and-level-gate. A fourth converts key rooms into ROOM_TRAPKEY, and a fifth places the veryhard tier as a dedicated 6-room route — which is exactly why veryhard alone gets the daily reroll.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:78,1978-1981,2378 + DungeonGenerator.as:967`
- **Build:** android v0.682
- **Lane impact:** L-traps: completes the placement model that bindata/trap-room-placement-and-level-gate started.

### `[[bindata/veryhard-rooms-rotate-daily]]` — UPHELD [A2] (2 critics)

The veryhard trap-room set alone is seeded by room-id × server-date, so it re-rolls once per real-world day; the same day-index multiplies into quest expiry, dungeon loot and enemy-player placement.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2445`
- **KILLS this line:** "The real-world "day" length governing quest expiry, farming, AP regen, and the War-Room 24h tick."
- **Lane impact:** world-exploration. The day LENGTH is still unheld — I claim nothing there. The MECHANISM is now exact: a single integer day-index multiplied into every procedural seed. That is enough to build the system and leave one number labelled INFERRED, instead of leaving the whole item as an unknown-unknown.

### `[[bindata/web-build-owns-the-bindata-map]]` — UPHELD [A2] (1 critic)

The web bindata -> consumer mapping is provable FROM THE WEB BUILD, without relying on Android class names, which closes the S0 build-parity hole for the structural claims. The web AS3 is symbol-obfuscated (which is why the Android decompile was necessary at all), but the ByteArrayAsset bindings survive: NameGenerator §1t136s0§ binds 94/97/95/96/98 in male/female/noble/samurai/place order; QuestEngine §1t1524s0§ owns 93 (traproomdata) and 92 (map bitmap); WarHexUI §1t7785s0§ owns 119 (survivalmodedata); MCSCharacter §1t75s0§ owns all 19 animdata blobs.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:10-18 · §1t1524s0§.as:83,87 · §1t7785s0§.as:13 · §1t75s0§.as:79-103`
- **Build:** web v0.717
- **Lane impact:** Cross-cutting: upgrades bindata/procedural-name-generator, bindata/trap-dungeon-system and bindata/survival-is-warroom-content from Android-inferred to web-proven.

### `[[cite04/buff-attack-scales-mindamage-only]]` — UPHELD [A2] (1 critic)

BUFF_ATTACK does not multiply damage by 1.5 - it multiplies the minDamage FLOOR by 1.5 and leaves damageRange untouched. Damage rolls as minDamage + random()*damageRange, so under the buff the expected damage rises by 1.5*minDamage - minDamage, i.e. strictly LESS than a 1.5x total unless damageRange is zero. Consequence for the contaminated duel_dense footage: it is inflated, but 'divide by 1.5' is the wrong correction and would under-report the true TTK. The same is true of BUFF_INJURED (x0.5 on minDamage and defense and baseSlashLength) and BUFF_DEFENSE (x1.5 on defense only).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:191-192, :208-223, :3201; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:209-224`
- **Build:** both — android v0.682 and web v0.717, identical structure
- **Lane impact:** All video-measurement lanes: the duel_dense contamination correction is NOT a flat /1.5. It cannot be applied at all until minDamage and damageRange for that loadout are known.

### `[[frames/ui-strings-txt-is-placeholder-not-runtime-copy]]` — UPHELD [A1] (1 critic)

reference/extracted/ui_strings.txt is the SWF's authored TextField DEFAULT text, not the game's runtime strings — so every number in it is design-time filler and none of it may be cited as tuning.

- **Cite:** `reference/extracted/ui_strings.txt:100, :189, :214 vs reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg`
- **Build:** web v0.717
- **Lane impact:** ALL LANES citing ui_strings.txt: the FIELD NAMES and LAYOUT are A2-grade evidence (a three-way damage taxonomy, hp/chi regen as displayed stats, an odds-based betting system, a tournament template). The NUMBERS are not: ':214 level requirement: 10 - 30 … round duration: 30 min' and ':100 piercing dmg: 20' are STILL_UNHELD as tuning.

### `[[gauntlet-s26b/web-npcmanager-switch-is-the-name-mapping-anchor]]` — UPHELD [A2] (1 critic)

The web NPCManager is §1t1543s0§.as and its ai switch has 38 cases in the SAME ORDER as the android createNPC switch, which turns the obfuscated enemy roster into a one-pass name-recovery job. Confirmed pairs: ai 0 -> §1t122s0§ = EnemyPlayer (same `,true,false` args), ai 2 -> §1t4542s0§ = EnemyArcher, ai 25 -> §1t4539s0§ = EnemyGoblinThrower, ai 36 -> §1t4545s0§ = EnemyKanjiGuardian, ai 37 -> §1t4523s0§ = EnemySpearElite(boss, same trailing `true`).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:615-730 vs reference/decompiled/shs3_android/scripts/NPCManager.as:516-636`
- **Build:** web v0.717
- **Lane impact:** ALL AS3-SOURCED LANES: this is the schedulable anchor claim 9 asked for, already half-built. It is also the artifact that refutes claim 14 - without the case map, §1t4539s0§ looks like the archer and the knockdown mechanic gets deleted from the port.

### `[[gauntlet/android-string-table-has-gaps]]` — UPHELD [A2] (1 critic)

The android v0.682 EN string table does not cover every id the v0.717 desktop client calls — ids 960-999 are entirely absent, yet v0.717 calls getString(979/980/981) for the three stance names.

- **Cite:** `docs/gauntlet/L0/index/strings.json (no numeric keys in 960..999) vs reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2724, :2733, :2742`
- **KILLS this line:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** ALL LANES — sharpens Stage-0b finding S0-3 from a warning into a measured fact: the v0.682 table has real holes relative to v0.717's id space. Any lane reporting '0 unresolved' should note that unresolved-in-data is not the same as covers-every-id-the-client-calls.

### `[[hunter-s26c/survival-mode-enemy-id-sets-are-equal-not-unequal]]` — UPHELD [A3] (1 critic)

A correction that must ride along with NF-E/survival-mode-content-diverges-14-of-87-rows so a false line does not enter the ledger with a true one. That finding asserts 'The unique-id sets are unequal in both directions.' I computed both differences over reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin by splitting every <id> on '|': web-minus-android is EMPTY and android-minus-web is EMPTY. Enemy 443 is already present elsewhere in the android blob. What actually differs is the alternation POOL of fourteen late-wave rows (0-indexed 73-86, not the twelve the finding enumerates), where web appends '|443' — a re-authored wave composition, not a roster change. Everything else in that finding reproduces exactly: 11,721 vs 11,553 bytes, 39 waves, 87 enemy rows, identical spawn-x histogram {-50:49, 1650:37, -1650:1}.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (own pairwise <enemy> diff + both unique-id set differences)`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "(no REBUILDREADINESS.md sentence — this corrects a packet finding before it is absorbed)"
- **Lane impact:** Cross-cutting: absorb the 14/87 divergence, drop the 'unequal id sets' clause, and widen the enumerated rows from 73-84 to 73-86.

### `[[itemdata/android-vs-web-constants-diverge]]` — UPHELD [A1] (2 critics)

The Android v0.682 bundle and the web v0.717 bundle demonstrably disagree on tuning constants — rebirth gold is 5/20 on Android vs 25/100 on web, and a new character starts with 0 heavenly gold on Android vs 3 on web — and a frame settles the third: the shipped build gives 3.

- **Cite:** `reference/frames/s21_weapon/t655.0.png, header crop (150,120)-(860,215) of the 1920x1080 frame, read at x0.5 — reads 'COINS 122' / 'GOLD 3' on a GUEST character; code sides at reference/decompiled/shs3_android/scripts/StatsManager.as:706 vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1024`
- **Lane impact:** Methodological, hits every lane (L1-L12): Stage-0b S0-3's caveat is now proven live for numeric constants. Pass 1's C16 ('any itemdata-derived claim may be ported without the S0-3 build caveat') is correct for itemdata field semantics and wrong for AS3 tuning constants — every ported number must name its build.

### `[[itemdata/baseprice-dot-data-bug]]` — UPHELD [A2] (2 critics)

itemdata.xml contains a genuine authoring bug — one item's baseprice is a bare '.' — which the parser silently turns into a free item; a 1:1 recreation has to decide to reproduce or deviate, not silently fix.

- **Cite:** `reference/extracted/itemdata.xml item 11037 'Santa Pants' + docs/gauntlet/L0/index/itemdata.json (baseprice: count 550, numeric_count 549, sample_values includes ".") + XMLItem.as:86-93`
- **Lane impact:** L3: the byte-exact port gate will trip on this row unless it is expected. Log it in DIVERGENCES either way.

### `[[newfind/heavy-defence-penalty-is-in-the-string-table]]` — UPHELD [A2] (1 critic)

The game's own tooltip copy sources two combat constants the lane has only ever read out of AS3. strings.json["6005"] (heavy stance description) ends 'Defense -20%', which is the player-facing statement of getDefense()'s 'return defense * 0.8'. And strings.json["IDS_Q50S3NODE2"] states the stance triangle in words — 'Balanced is effective against Light. Heavy is effective against Balanced. Light is effective against Heavy.' — which is the artifact that fixed the triangle's DIRECTION and refuted combat-core/stance-triangle-1.2-and-damage-order. strings.json["IDS_Q50S3NODE1"] additionally fixes the HUD ring colours: 'Light stance - blue, Balanced stance - brown, Heavy stance - red', matching setStanceColor 1/2/3.

- **Cite:** `docs/gauntlet/L0/index/strings.json (entries ["6005"], ["IDS_Q50S3NODE1"], ["IDS_Q50S3NODE2"]) · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3286-3288`
- **Build:** android v0.682 string table; the AS3 it corroborates is web v0.717
- **Lane impact:** L5 + L8 — a second, player-facing source for the heavy defence penalty and the stance triangle direction, and a check on the stance ring colours the frames show (t1003.000.png's ring is red = heavy).

### `[[newfind/stance-enum-pinned-by-declared-value]]` — UPHELD [A2] (1 critic)

The five obfuscated stance constants are pinned by their DECLARED INTEGER VALUE, not by a HUD-colour fingerprint, and the value proof is strictly stronger. §1t99s0§.as and MCSPlayer.as declare them at IDENTICAL line numbers with IDENTICAL values: 27 -> 0, 29 -> 1, 31 -> 2, 33 -> 3, 35 -> 4, against LIGHT/BALANCED/HEAVY/DUAL/REVERSED. setStanceColor cannot separate them on its own — it emits 2 for BOTH BALANCED and REVERSED and 3 for BOTH HEAVY and DUAL — so any claim resting on colour alone is under-determined. This is the artifact that settles §1t12223s0§ = DUAL and §1t12224s0§ = REVERSED, and it is what killed combat-core/reversed-and-dual-reach. Generalises: for any obfuscated enum with a named android twin, compare the declaration block first.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:27-35`
- **Build:** both — web v0.717 and android v0.682
- **Lane impact:** L5 + every lane reading the obfuscated web bundle — a general de-obfuscation method, and the decisive evidence for the DUAL/REVERSED reach rows.

### `[[npcdata/setlevel-pins-everything-to-1-below-11]]` — UPHELD [A2] (1 critic)

NPC.setLevel rescales damage, defense and maxhp by lvl/oldLevel, applies an extra 0.9 penalty at lvl <= 20, and then HARD-PINS damage = 1, defense = 1 and maxhp = 1 for any enemy at lvl <= 10 — overriding whatever the XML authored. This is the engine-side twin of the packet's 42-row <hp>1</hp> census: sub-11 trash dying in one hit is a coded rule, not a data quirk.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-260`
- **Build:** android v0.682
- **KILLS this line:** "enemy level scaling INFERRED"
- **Lane impact:** Gives the combat lane a measured level-scaling rule it did not have: a 0.9 multiplier below level 21, and a hard 1/1/1 floor at or below level 10. It also corroborates SESSION 11's measured 'mobs die in ONE hit' from the code side.

### `[[persistence/offline-save-schema-is-fourteen-fields-already-written]]` — UPHELD [A2] (1 critic)

Beyond the equipment string the packet's own finding names, the client's offlineMode branch serialises the ENTIRE player record to a local SharedObject keyed by cookieName + '_' + charname: fourteen fields covering timers, level, stats, equipment, skills, skill slots, inventory, stash, quest items, int stats, achievement stats and boolean stats. A matching parse* method exists for each on the read side.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2903, :2910-2925`
- **Build:** android v0.682 (web parity not checked)
- **Lane impact:** L10 persistence: REBUILD_READINESS.md:351's 'design a single-player persistence schema from the observed field set' is not a design task - the field set and its serializer/parser pair are both shipped. The schema can be transcribed rather than invented.

### `[[s26c/survival-mode-id-sets-are-IDENTICAL-across-builds]]` — UPHELD [A3] (1 critic)

Correction to NF-E/survival-mode-content-diverges-14-of-87-rows, which is otherwise HELD. Its sentence 'The unique-id sets are unequal in both directions' is FALSE. I extracted every <id> token from both blobs: web reference/extracted/bindata/119_1t4646s0.bin and android reference/extracted/android/109_WarHexUI_SurvivalModeData.bin each carry the SAME 62 distinct enemy ids (400-429, 435-451, 453-456, 700-710), web-only set empty and android-only set empty. Enemy 443 is present in the android file too — what the web build changed is the alternation POOL of 14 late-wave rows (73-86), not the roster. Also, the differing block runs rows 73-86 inclusive, not 73-84 as enumerated; the stated total of 14 is correct but rows 85-86 ('451|456|451|456|443', qty 6) were left out of the list. Strike the id-set sentence before this enters the ledger, or the rewrite will assert a roster difference that does not exist.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "n/a — corrects a packet claim, not a ledger sentence"
- **Lane impact:** Cross-cutting: keeps the survival-mode overturn honest. The mode's ROSTER is shared; only 14 late-wave spawn pools diverge, and the web blob is the one to author from.

### `[[stage/web-payload-has-its-own-800-480-690-resize-handler]]` — UPHELD [A2] (1 critic)

The WEB v0.717 payload carries its OWN resize handler with the identical three constants as the Android build — originalWidth 800, originalHeight 480, originalHeightWithBar 690. Every aspect-ratio claim in this packet cited the ANDROID GameEngine and left a build-parity hole; the hole is closed, and the answer is that the two builds share the layout model exactly. This is also what refutes 'that is the ANDROID figure': 800x480 is the web build's own base canvas.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-314`
- **Build:** web v0.717
- **KILLS this line:** "- Aspect-ratio truth — native canvas is 800×480 (5:3), so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L8 ui-hud + every lane holding frame-derived coordinates: RR:117 stands, and it stands for BOTH builds. The friend-bar mode is real but conditional (viewport narrower than 800/690 = 1.159:1), which neither longplay is. Cite this file, not the Android GameEngine, for any web-build layout claim.

### `[[stage0/android-lang-table-cannot-serve-web-ui]]` — UPHELD [A2] (1 critic)

The parsed Android string table cannot resolve the web build's UI copy at all: it tops out at string id 9010, while the web payload calls getString(960), getString(11005), getString(11006) and getString(11018). Any WEB UI-copy claim resting on 118_Mobile_Lang_EN.bin has a hard, measurable hole — this is the concrete shape of the S0 build-parity caveat.

- **Cite:** `docs/gauntlet/L0/index/strings.json (1,893 numeric ids, max id 9010, zero entries containing 'tournament') vs reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:80, :82, :84 and §1t113s0§.as:111`
- **Build:** both
- **Lane impact:** All lanes — narrows S0-3's caveat from a vague warning to a testable rule: an id >= 9011 (and id 960) is unresolvable from the held table, so the string is web-only content.

### `[[strings/the-android-lang-table-skips-ids-881-999-entirely]]` — UPHELD [A2] (1 critic)

A false-negative trap of the same family as correction C1, for the string table this time. 'String N is absent from strings.json' does NOT imply 'N is a v0.717 addition'. Parsing the raw UTF-16LE XLIFF in reference/extracted/android/118_Mobile_Lang_EN.bin yields 2555 trans-unit ids, and in the range 850-1010 they run 850..865, 867..880, then jump straight to 1000. The whole block 881-999 is missing from the android v0.682 table - 119 consecutive ids, not one. So string 960's absence is a block gap, and any claim that infers 'web-only addition' from a single absent id in that range is resting on a hole, not on evidence. There are 20 such gaps in the table (largest: 1044->2000).

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin (UTF-16LE XLIFF, 2555 trans-unit ids parsed) + docs/gauntlet/L0/index/strings.json (2533 entries, same gaps)`
- **Build:** android v0.682
- **Lane impact:** Cross-lane evidence hygiene. Two claims in this packet inferred 'v0.717 addition' from id 960's absence. The inference happens to be harmless there (the frame resolved 960 directly), but as a rule it is unsound and should not be reused.

### `[[warroom/troop-advance-is-24-hours]]` — UPHELD [A2] (2 critics)

The game's own War Room rules screen states the 24-hour tick verbatim, so REBUILD_READINESS.md's 'War-Room 24h tick' is CORRECT and the three hourly-tick claims in this packet are wrong. WARMOVEINTERVAL (3600 s) is a different clock: it refreshes the player's per-turn MOVE allotment, surfaced as 'Next turn in ...' / '... Move(s) Left'.

- **Cite:** `docs/gauntlet/L0/index/strings.json["376"] and strings.json["307"], strings.json["308"] + reference/decompiled/shs3_android/scripts/WarUI.as:525-541 + StatsManager.as:162,782`
- **Build:** android v0.682
- **KILLS this line:** "- The real-world "day" length governing quest expiry, farming, AP regen, and the War-Room 24h tick."
- **Lane impact:** L11 meta-social and L1 world-exploration: the war carries TWO clocks - a 1 h per-player move-turn (WARMOVEINTERVAL, already in the ledger as 'moves/hr') and a 24 h troop-advance resolution (strings.json["376"], server-side). Do not collapse them. Build-parity caveat: this string is from the android lang table; the web build's copy is unverified, but the 24 h figure is corroborated by the ledger's independent wiki/forum sourcing.

### `[[world/nodegenerator-web-parity-closed]]` — UPHELD [A2] (1 critic)

The web-parity hole that questdata-critic/overworld-is-generated flagged open for NodeGenerator is now closed. The web v0.717 twin is §1t70s0§.as, and §1t70s0§.as:399 carries the identical node-level formula: Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + LEVELSTART. The overworld generator ships in both builds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t70s0§.as:399 vs reference/decompiled/shs3_android/scripts/NodeGenerator.as:385`
- **Build:** both
- **Lane impact:** L8: the generator may be ported as CONTRACT against the filmed build, not labelled android-only.

### `[[world/third-placename-override-is-web-only]]` — UPHELD [A2] (1 critic)

The v0.717 place-name generator special-cases THREE territory ids, not two. §1t136s0§.as:140 -> 1405272 = 'Ibamaya', :144 -> 1524045 = 'Gokura', :148 -> 1519945 = 'Iwakuni'. The android twin NameGenerator.as:137-144 carries only the first two, so this is a genuine web/android divergence and the packet's two findings that assert 'no parity hole' are wrong. Everything else in the generator reproduces exactly — I re-implemented it (677-entry table from bindata/98_1t4653s0.bin, 78 namestarting, 37 nameending, LCG seed*9301+49297 mod 233280 with the constructor's priming rnd() at RNG.as:18) and got Chikada / Kakuchi / Kasuta for 1405270 / 1409366 / 1397077.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:148-151 vs reference/decompiled/shs3_android/scripts/NameGenerator.as:137-144`
- **Build:** web v0.717 only — android v0.682 lacks it
- **Lane impact:** L8: a recreation built to the packet's recipe renders territory 1519945 with a generated name instead of Iwakuni.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
