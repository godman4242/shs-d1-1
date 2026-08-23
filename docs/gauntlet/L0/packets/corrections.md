# LEDGER PACKET — `corrections`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**59 surviving overturns · 1 true-but-rejected · 13 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
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
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-1/ledger-rebirth-25-is-code-sourced-not-film]]` — UPHELD [A2] (3 critics)

REBUILD_READINESS.md contradicts itself on rebirth sourcing, and the fix is a re-tag, not a deletion: :165 claims 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' while :205 concedes '⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)'. The +25 VALUE is correct — it is banked at :79-80 ('rebirth scroll 1000c (+25g)') and is now CONFIRMED by shipped web code — but its film provenance is fictitious and the 'no 10th-rebirth tier' half is disproven by the Dan-8 100-Gold arm. Re-tag the row A2/code-sourced.

- **Cite:** `docs/research/REBUILD_READINESS.md:79-80, :165, :205 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`
- **Build:** web v0.717
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** ledger hygiene + rebirth-elements + economy — stop citing film for a number no camera ever saw; the value survives on an A2 cite.

### `[[NF-5/stance-mastery-caps-at-10-not-9]]` — UPHELD [A2] (3 critics)

Stance mastery caps at level 10, not 9. The three stance-mastery skills each enumerate levels 1..10, which is why the web damage curve only reaches Light x0.9 / Balanced x1.2 / Heavy x1.4 at mastery 10. Every 'mastery-9 ceiling' label in the project docs is off by one.

- **Cite:** `reference/extracted/skilldata.xml (skills 1000, 1001, 1002) + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262, :3265, :3270 + docs/research/REBUILD_READINESS.md:155`
- **Build:** web v0.717
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 combat-core — if the build 'targets mastery-9' as REBUILD_READINESS.md:157 offers, the correct ceiling is 0.86/1.18/1.4, not 0.9/1.2/1.4; the published table is the mastery-10 row.

### `[[actionscript/dan-cap-and-post-rebirth-sp]]` — UPHELD [A2] (2 critics)

The Dan stat caps at 9 and is displayed +1, i.e. ten ranks — so MAX_DAN_RANK=10 is correct and belongs as CONTRACT — and the post-rebirth skill-point economy is one line: SP = (level − 1) + Dan × (levelCap − 1), i.e. +79 SP per rebirth.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2201-2214, :2156, :76, :1917`
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements: the rank COUNT half of blocker ③ closed (titles still unheld); L-progression: blocker ③ 'post-rebirth SP economy' closed exactly; L-combat-core: Dan raises the base-slash-length asymptote from 210 px to 255 px.

### `[[actionscript/in-combat-stance-not-hard-locked]]` — UPHELD [A2] (2 critics)

v0.717 does NOT hard-lock stance in combat — the in-combat switch is alive, gated on Focus >= 48 and costing a flat 48 Focus; 'CANNOT CHANGE STANCE' is the insufficient-Focus / wrong-action-state message, not a version removal.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3050 (gate), :3058-3062 (early-out), :3160-3162 (in-battle cost); state predicate at :3043, mirrored plain-named at reference/decompiled/shs3_android/scripts/MCSPlayer.as:2965`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior."
- **Lane impact:** L-combat-core, L-skills-meters, L-ui-hud — this is backwards in the ledger: the recreation's Focus-gated in-combat switch is ORIGINAL v0.717 behaviour, down to the mechanism. FRAME-vs-DOC: the frame showing 'CANNOT CHANGE STANCE' still WINS on what was on screen — the message was displayed; what the code overturns is the inference that it means a permanent lock. Predicted re-crop check: the Focus bar in that frame reads under 48/192 (~25%).

### `[[actionscript/sell-price-formula]]` — UPHELD [A2] (2 critics)

Sell price is (1 + affixModifierCount) x 10 for items of weight >= 10 and x 5 below that, with anything itemID < 3000 selling for a flat 1 — it does NOT scale with rarity or level, and it is identical in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 (affix count at Item.as:307-310); web parity reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
- **KILLS this line:** "Sell price is NOT flat per item — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L-economy (blocker ② half-closed) and L-items-equipment (blocker ③ closed). The ledger's own observation is reproduced exactly by the true mechanism: 5c = a light item with 0 modifiers (1+0)x5; 25c = the same item with 4 modifiers (1+4)x5. The mechanism is affix count x weight class, not rarity/level.

### `[[actionscript/stance-damage-is-mastery-10]]` — UPHELD [A2] (2 critics)

The ledger's stance damage triple 0.9/1.2/1.4 is exactly right but it is a MASTERY-10 ceiling, not mastery-9: Light = base x (0.5 + 0.4*m*0.1), Balanced = base x (1 + 0.2*m*0.1), Heavy/Dual/Reversed = base x 1.4 fixed, and skills 1000/1001/1002 each have exactly 10 levels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3261-3270; mastery cap from reference/extracted/skilldata.xml (skills 1000/1001/1002 each carry 10 <level><value> rows, values 1..10, counted programmatically)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed)"
- **Lane impact:** L-combat-core, L-skills-meters, L-progression — the base row and 'Heavy is fixed x1.4' are confirmed exactly; the ceiling is mastery-10 with linear +0.04/level (Light) and +0.02/level (Balanced), so §3's decide-and-flag ('model the curve or target mastery-9') resolves to 'model it, it's two lines'.

### `[[android-blobs/all-thirteen-episode-cards-shipped]]` — UPHELD [A2] (2 critics)

Bespoke full-screen splash art for every one of episodes 0 through 12 plus the exposition and epilogue cards shipped in the binary — so §3.8's scope decision to cut Ep4-12 as 'canonical-but-unshipped' must be withdrawn, not footnoted.

- **Cite:** `reference/extracted/android/124_Mobile_ImageResource.bin — decrypted SymbolClass/ExportAssets name list (16 story-card symbols)`
- **Build:** android v0.682
- **KILLS this line:** "Season 1 is Prologue + 12 episodes + epilogue = 14 chapters, not 4. Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. Scope decision: faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L-quests-story. The staleness banner already killed §3.8 with questdata's 61 quests, but 'the quest rows exist' is weaker than 'the bespoke chapter art for every episode was drawn, exported and shipped'. Nobody ships 13 chapter cards for 4 chapters. §3.8 contains the one line in the ledger that tells a builder what to CUT, and that line rests on a falsehood.

### `[[bindata/pillarbox-independently-reverified]]` — UPHELD [A1] (2 critics)

Independent re-measurement on three frames confirms the 1080p longplay is pillarboxed: the live canvas is x=52..1867 (1816×1080), so any HUD x-fraction taken off the full 1920 width is wrong.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png (also _427.0.png, _433.0.png) — full-height per-column scan, every 3rd row, max/median channel per column; no sub-crop needed, the bars span the full 1080 px height`
- **KILLS this line:** "Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** ui-hud blocker ①. Reproduces this lane's prior run-3 C2 exactly, on three frames rather than one — worth recording because C2 is the lane's only A1 claim and it now has independent confirmation. THE FRAME WINS and I say so out loud: the correct conversion is (x_px - 52) / 1816, not x_px / 1920; §3.12's 'verify before trusting' came out AGAINST the raw measurements. Corroborated at source by GameEngine.as:269-297 (originalWidth 800 / originalHeight 480, height-fit and horizontally centred), which also reveals a second native layout at 800x690 that no ledger records.

### `[[cite04/longplay-frames-are-pillarboxed-scale-is-2.27]]` — UPHELD [A1] (3 critics)

Every 1920x1080 longplay still is PILLARBOXED: 52 px of true black on the left and 52 px on the right, leaving a 1816x1080 game area. The game-px-to-screen-px scale for measuring anything off film is therefore 2.27 (1816/800), or 2.25 vertically (1080/480) - NOT 1920/800 = 2.4. Any reach, stroke-length or HUD-width figure converted at 2.4 is inflated ~6%. This upgrades ledger item 12 from a warning ('may be pillarbox-compressed') to a measured constant, and it directly corrects the conversion note appended to itemdata-hunter/reach-is-per-stance.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png - horizontal row scan at y=540 for pixels with R+G+B < 25; vertical column scan at x=960; cross-checked against reference/decompiled/shs3_android/scripts/StatsManager.as:80-82 (stageWidth 800, stageHeight 480)`
- **Build:** web v0.717
- **KILLS this line:** "12. Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** Every video-measurement lane: fix the px conversion at 2.27 and subtract a 52-px left offset before converting any x coordinate. L5 combat-core reach figures taken at 2.4 must be re-scaled.

### `[[cite04/web-rebirth-pays-25-and-100-heavenly-gold]]` — UPHELD [A2] (3 critics)

The web v0.717 rebirth payout is 25 Heavenly Gold normally and 100 Heavenly Gold at STAT_DAN == 8 - NOT the android build's 5/20. This is the correct overturn of ledger item 7: 'tenthGold=100' and the film's '+25' are both the RIGHT v0.717 numbers and become CONTRACT for the web build, while the clause 'no 10th-rebirth tier' is false (a Dan-8 tier pays 4x). The only thing the film got wrong is the currency label - it is Heavenly Gold (the premium currency, stat slot 12), not coins. This simultaneously refutes hunter/tenth-rebirth-tier-exists, which would have written android's 5/20 into a web-target ledger.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 and :228; reference/decompiled/shs3_android/scripts/StatsManager.as:194 and :2201-2207`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. … film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements and L-economy: rebirth payout becomes CONTRACT for v0.717 (25/100 HGold), and ledger item 7 flips from 'should be INFERRED' to 'sourced from code', minus its final clause.

### `[[combat-core/300-200-100-is-base-not-ceiling]]` — UPHELD [A2] (2 critics)

The wiki's 300/200/100 stance reach numbers reproduce exactly as the shipped default slash budget (200) times the mastery-ZERO multipliers {1.5, 1.0, 0.5}, which contradicts the ledger's reading of them as mastery-9 ceiling values.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InputManager.as:51 + MCSPlayer.as:3030, 3041, 3052 (arithmetic over the two quoted lines, offered as a lead)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** combat-core L2: 300/200/100 should be re-labelled BASE (mastery 0) rather than ceiling. PARTIAL because it is arithmetic over two quoted lines, not a single line that states it, and because the v0.717 multipliers give 280/200/100 for the same base.

### `[[combat-core/mastery-caps-at-10-per-the-string-table]]` — UPHELD [A2] (3 critics)

Mastery caps at level 10, stated in the game's own strings — which independently settles the 'mastery-9 ceiling vs mastery-10' argument the ledger's §3 item 3 raises, and confirms Heavy's defence penalty as -20% (x0.8).

- **Cite:** `docs/gauntlet/L0/index/strings.json entries strings.json["8131"], ["8132"], ["8133"] and ["6005"]`
- **Build:** android v0.682
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 — every 'mastery-9' label in the ledger should read mastery-10. Evaluate the web curves at m=10: damage light 0.9, balanced 1.2, heavy 1.4 — the wiki triple exactly. Caveat: this is the ANDROID string table, so the ceiling is CONTRACT-SRC (0.682) until a web string source is found.

### `[[combat-core/mastery-caps-at-ten]]` — UPHELD [A2] (2 critics)

Stance mastery is a 0-10 skill level, not 0-9 and not a 0-100 percentage, so the wiki's stance-damage table 0.9/1.2/1.4 is the mastery-TEN ceiling, and the v0.717 stance damage roll is Light x(0.5+0.4*m*0.1), Balanced x(1+0.2*m*0.1), Heavy/Dual/Reversed x1.4 flat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 joined to reference/extracted/skilldata.xml skills 1000 (lines 3-80), 1001 (82-159), 1002 (161-238), each carrying exactly ten <level><value> rows 1..10; param binding at §1t99s0§.as:183-199`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L combat-core: 'mastery-9' becomes 'mastery-10' everywhere, and 0.5+0.4*10*0.1 = 0.9, 1+0.2*10*0.1 = 1.2, Heavy 1.4 reproduces the wiki table exactly. The ledger's 'level-1 Shugyosha does Light x0.5 / Balanced x1.0 / Heavy x1.4' is confirmed as the mastery-0 row.

### `[[combat-core/mastery-is-ten-level-skill]]` — UPHELD [A2] (2 critics)

Stance mastery is a skill level with exactly ten levels (skills 1000/1001/1002 have 10 <level> blocks, max value 10), not a 0-100 percentage, and both builds gate FlipUp/Deflect/Launch/Stab on it at 3/4/5.

- **Cite:** `reference/extracted/skilldata.xml skill 1000 (10 <level> blocks, max <value>10); reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3174-3176 and 3182-3184; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3231-3233 and 3239-3241`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** combat-core L2: fixes the scale the whole stance table is expressed in. Ten levels (1..10), so 'mastery-9' is at most the 9th of ten levels, and the technique unlocks (FlipUp 3, Deflect 4, Launch/Stab 5) are a second, independent use of the same ladder.

### `[[combat-core/reach-table-is-mastery-zero]]` — UPHELD [A2] (2 critics)

The stance REACH table is the mastery-ZERO case, not a ceiling: the v0.717 multipliers at mastery 0 are 1.4 : 1.0 : 0.5 = 2.8 : 2 : 1, which is the ledger's 300/200/100; at mastery 10 they become 1.4 : 1.2 : 0.9, which is nothing like 3:2:1.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: the ledger's §3 correction is HALF wrong. Damage 0.9/1.2/1.4 is a mastery ceiling (see combat-core/mastery-is-small-integer) but reach 300/200/100 is the mastery-0 ratio. Treating reach as a ceiling would shrink every low-mastery stance reach in the rebuild.

### `[[combat-core/reach-table-is-mastery-zero-not-a-ceiling]]` — UPHELD [A2] (2 critics)

The wiki reach table 300/200/100 is the mastery-ZERO base at high speed, not a mastery ceiling: base slash length asymptotes to 210 stage px at Dan 0, and the mastery-0 stance multipliers 1.4/1.0/0.5 give 294/210/105.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348 (base) combined with §1t99s0§.as:3094/3105/3116 (mastery-0 multipliers); android confirm StatsManager.as:1915-1919`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L combat-core blocker (1): the damage table and the reach table are read off DIFFERENT rows of the mastery curve - damage at mastery 10, reach at mastery 0. The ledger sweeps both into one claim. At mastery 10 the reaches are 294/252/189, nothing like 300/200/100. Note the crossover the ledger misses: the mastery-scaled term is each stance's WEAK axis (Light's damage, Heavy's reach); its strong axis is a fixed 1.4.

### `[[combat-core/stance-damage-mastery10-ceiling]]` — UPHELD [A2] (2 critics)

The wiki's stance damage triple 0.9 / 1.2 / 1.4 is not a mystery table - it is the v0.717 desktop's own per-stance damage function evaluated at mastery 10, and the ledger's 'mastery-9 ceiling' framing is off by one.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276, joined to reference/extracted/skilldata.xml skills 1000/1001/1002 (10 <level> rows each)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** combat-core: the damage multipliers become CONTRACT from the shipped v0.717 client rather than a wiki reading. Light scales 0.54 -> 0.9 across mastery 1-10, Balanced 1.02 -> 1.2, Heavy/Dual/Reversed a flat 1.4 with no mastery term at all. The ceiling is mastery 10 (skilldata gives skills 1000/1001/1002 exactly ten levels), so every 'mastery-9' label in the ledger should read mastery-10. It also means Heavy is the only stance whose damage does NOT improve with mastery - a design fact absent from the board.

### `[[combat-core/stance-reach-is-mastery-zero-base]]` — UPHELD [A2] (2 critics)

The wiki stance reach table 300/200/100 records MASTERY-ZERO BASE values, not mastery-9 ceilings — Light-stance reach carries no mastery term at all in either build, so it cannot be a mastery-9 ceiling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094 (Light, constant), :3105, :3116; android MCSPlayer.as:3030; StatsManager.as:1915-1919 (base tops out at 210 px at Dan 0)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** combat-core: structural argument is decisive on its own — a bare constant cannot be a mastery-9 ceiling. Numerically, desktop multipliers at mastery 0 give 1.4 : 1.0 : 0.5 = 2.8 : 2.0 : 1.0, matching the wiki's 3 : 2 : 1; at mastery 9 they give 1.63 : 1.37 : 1.0, which does not. Heavy also lands on the shipped floor exactly (210 x 0.5 = 105, clamped to 100). The remediation at REBUILD_READINESS.md:320 ('relabel mastery-9') is backwards — label the tables mastery-0 BASE, with mastery a modest additive bonus on Balanced/Heavy only.

### `[[combat-core/v0717-stance-slash-multipliers]]` — UPHELD [A2] (1 critic)

The v0.717 desktop build's per-stance slash-length multipliers are on disk and differ from the android v0.682 set the survey adopted: Light and Reversed are x1.4 (not x1.5), Balanced is base*(1 + 0.2*balancedMastery*0.1), Heavy is base*(0.5 + 0.4*heavyMastery*0.1) floored at 100 px, Dual is base floored at 100 px.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3155 (desktop MCSPlayer; identified because it defines §1t4446s0§, the initElementDefenseStats callee at §1t1523s0§.as:2270), param order pinned at :183-199`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's reach also scales ×0.5→×0.9."
- **Lane impact:** L combat-core: the reach multipliers stop being android-only guesses. Also kills the survey's PARTIAL on rebirth/stance-slash-multipliers-parity - the surveyor's grep terms ('0.005', '0.5 + 0.5 *') exist in neither build, so its negative grep proved nothing.

### `[[combat-core/v0717-stance-table]]` — UPHELD [A2] (1 critic)

The complete v0.717 stance table is recovered — Light dmg (0.5+0.04m)/reach x1.4, Balanced dmg and reach (1+0.02m), Heavy dmg x1.4/reach (0.5+0.04m) floored at 100, Heavy defence x0.8 — and it differs from the android v0.682 numbers on every row.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2721-2747 (character sheet), corroborated by §1t99s0§.as:3083-3155 (setStance) and :3255-3276 (getDamage)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** combat-core: the mastery curve no longer has to be modelled or decide-and-flagged — it is an exact formula in both damage and reach. At mastery 9 the damage row is 0.86/1.18/1.4, i.e. the wiki's 0.9/1.2/1.4 rounded, which CONFIRMS the ledger's mastery-9 reading rather than overturning it. Heavy's 100 floor is the literal constant the ledger's line-101 correction asked for. The android v0.682 values (x1.5, 0.005m) must not be shipped.

### `[[economy/rebirth-pays-heavenly-gold]]` — UPHELD [A2] (2 critics)

Rebirth pays HEAVENLY GOLD (stat 12, the PayVault-backed premium currency), not gold/coins (stat 11) — the desktop doRebirth never touches the coin purse at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192, 194, 2668-2698 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2660 + OverworldHUD.as:1333`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** economy + rebirth-elements: config REBIRTH.earlyGold/tenthGold currently feed p.gold (tests/progression.test.ts:183,192), i.e. coins — the wrong purse. The 25/100 numbers and MAX_DAN_RANK=10 are sound and can be promoted, but the currency must be modelled as a separate premium resource or the mapping relabelled. Corroboration that stat 12 is the rebirth currency: the android anti-cheat trips at HGOLD>60 while DAN<9, and android pays 8x5+20 = exactly 60. The same line shows desktop's 25/100 (8x25+100 = 300) could not run against a >60 check — further evidence the two builds' rebirth economies genuinely diverge.

### `[[hunter-s26a/web-kanji-dan-display-path]]` — UPHELD [A2] (2 critics)

The kanji dan-rank display path is in the WEB build and clamps at ten, proving what hunter/ten-kanji-dan-ranks-in-string-table only asserted ('the inventory/panel path prints kanji'). §1t5957s0§.as:3067-3102 sets danfield.text from getString(456) through getString(464), with the dan>=9 and default cases BOTH resolving to 464 = 十段.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3067-3102 + docs/gauntlet/L0/index/strings.json["456"]-["464"]`
- **Build:** web v0.717
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th)"
- **Lane impact:** ui-hud + rebirth-elements. A THIRD independent artifact for a ten-rung ladder, and the first one that is web-side and consumes the kanji table. MAX_DAN_RANK=10 is CONTRACT from three artifacts, not one garbled wiki line.

### `[[hunter-s26a/web-stance-ceilings-are-mastery-10-not-9]]` — UPHELD [A2] (2 critics)

The web mastery coefficients hit the ledger's 0.9 / 1.2 / 1.4 stance table EXACTLY at mastery 10, not mastery 9. §1t99s0§.as:3262 gives LIGHT = base * (0.5 + 0.4*lightMastery*0.1) and :3265 BALANCED = base * (1 + 0.2*balancedMastery*0.1); at mastery 10 those are 0.90 and 1.20 exactly, with HEAVY fixed at 1.4 (:3270). At mastery 9 they are 0.86 and 1.18. REBUILD_READINESS.md:155 labels 0.9/1.2/1.4 'MASTERY-9 CEILING values'; for the web build the exact-fit ceiling is mastery 10. The same *0.1 scale appears in the reach switch (:3105, :3116), so the correction propagates to reach as well.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262, :3265, :3270, :3105, :3116 + docs/research/REBUILD_READINESS.md:155`
- **Build:** web v0.717
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core. PARTIAL, not HELD: the arithmetic is certain but I did not locate the mastery CAP, so 'mastery-9' may still be right about the reachable maximum while being wrong about which mastery reproduces the table. The rewrite should state the coefficient, not the label.

### `[[hunter/elemental-rebirth-reward-table]]` — UPHELD [A2] (2 critics)

The four elemental rebirths each grant +10 to the matching elemental ATK stat, DOUBLED to +20 when the player is at Dan 8 (the tenth and final rebirth), and consume one unit of stat 2202. This is the elemental-rebirth reward table and it appears in no claim in the packet.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:848-899`
- **Build:** android v0.682
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT."
- **Lane impact:** L-rebirth-elements: the reward half of the rebirth loop closes exactly. L-progression: rebirth is now fully specified — SP formula, elemental grant, currency payout.

### `[[hunter/ten-kanji-dan-ranks-in-string-table]]` — UPHELD [A2] (2 critics)

An independent A2 source for MAX_DAN_RANK=10 that nobody has cited: the string table carries exactly ten kanji dan ranks, ids 455 through 464, 初段 (1st) through 十段 (10th) — a closed, complete ladder. This corroborates the hard-coded romaji ladder in the desktop PlayerPanel from a completely separate artifact, and it identifies the SECOND display format: the inventory/panel path prints kanji, the versus panel prints romaji.

- **Cite:** `docs/gauntlet/L0/index/strings.json["455"] through ["464"]; consumed alongside the romaji path at reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565`
- **Build:** both
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th)"
- **Lane impact:** rebirth-elements blocker ③ + ui-hud: the ladder has TEN entries and stops, so MAX_DAN_RANK=10 is CONTRACT from two independent artifacts (string table and hard-coded romaji switch). 'The only wiki datum' is no longer the only datum.

### `[[hunter04/rebirth-payout-is-25-and-100-hgold-in-v0717]]` — UPHELD [A2] (3 critics)

What actually falls in ledger item 7. reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 is 'if(getStat(DAN) == 8) { changeStat(§1t9413s0§,100); announce(...,"10"); } else { changeStat(§1t9413s0§,25); } if(getStat(DAN) < 9) { changeStat(DAN,1); }'. §1t9413s0§ is declared = 12 at §1t1523s0§.as:228 and android's STAT_HGOLD is 12 at StatsManager.as:194, so the currency is Heavenly Gold - which the game's own UI calls simply 'Gold'. Therefore: (a) a tenth-rebirth tier DOES exist, so 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' is false; (b) the DAN < 9 cap means dan ranks 0-9, i.e. exactly 10, so MAX_DAN_RANK=10 is now code-grade; (c) both config VALUES the ledger wanted demoted - tenthGold=100 and +25g - are exactly correct and should be promoted to CONTRACT, not demoted to INFERRED. Android v0.682 nerfs the same payout to 5 / 20 HGold (StatsManager.as:2201-2207) - do not carry those numbers over.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:228, :2644-2652 · contrast reference/decompiled/shs3_android/scripts/StatsManager.as:194, :2201-2211`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements and L-economy: ledger item 7 flips - MAX_DAN_RANK=10 and tenthGold=100 become CONTRACT, and the 'no 10th-rebirth tier' clause is deleted. Blocker (3) 'Dan-rank count/titles (garbled source)' closes on the count.

### `[[hunter04/v0717-stance-switch-is-focus-gated-at-48-not-hard-locked]]` — UPHELD [A2] (2 critics)

In-combat stance switching in web v0.717 is FOCUS-GATED at a flat 48, not hard-locked - ledger §3 item 4 is wrong and the recreation's Focus-gated in-combat switch was right. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050 returns 'canChangeStance() && reload >= 48'; :3060 opens nextStance with 'if(reload < 48) return;'; and :3160-3162, inside the StageManager battle predicate (structurally aligned with android's 'if(StageManager.isBattle())' at MCSPlayer.as:3096), charges 'reload -= 48'. So the switch IS permitted in battle, at a price of 48 Focus, and the 'CANNOT CHANGE STANCE' HUD text is that Focus threshold firing - not an unconditional lock. Android uses a different rule entirely: gate at maxreload/6 = 20 (MCSPlayer.as:2977) and a graded cost (reload > max/2 -> set to max/3, else -= max/6; :3098-3105). Corroborated on film: the third bar in reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x LANCZOS) reads CANNOT CHANGE STANCE with no visible fill, which is exactly the reload <= 48 state that §1t113s0§.as:328 renders as scaleX 0.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050, :3060, :3160-3162 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:2977, :3096-3105 · corroborated reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x)`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "4. In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior. The out-of-combat switch costing Focus IS real; the in-combat switch is a recreation divergence — label it, don't present it as original."
- **Lane impact:** L-combat-core and L-skills-meters: the switch-cost third of blocker (3) 'Focus numerics (max/fill/switch-cost)' CLOSES at 48 for v0.717, and ledger §3 item 4 must be reversed - stop labelling the in-combat Focus switch a recreation divergence.

### `[[itemdata/rebirth-gold-25-and-100]]` — UPHELD [A2] (2 critics)

Rebirth gold in the shipped web v0.717 build is +25 heavenly gold normally and +100 on the rebirth that reaches Dan 10, and the Dan counter saturates at 9 (ten displayed ranks) — so §3 correction 7 is wrong in both halves: MAX_DAN_RANK=10 and tenthGold=100 are CONTRACT, not INFERRED, and the '+25 flat, no 10th-rebirth tier' reading is wrong.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2657 (web v0.717 doRebirth), name-mapped against reference/decompiled/shs3_android/scripts/StatsManager.as:2195-2214 with STAT_HGOLD=12 (:194) and STAT_DAN=25 (:220)`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L4 rebirth-elements blocker ③ (Dan-rank count) closed at 10 ranks and the rebirth reward tuple fixed; L6 economy gains the gold faucet's real rate; L12 meta-social gains the Dan-10 global announcement.

### `[[itemdata/sell-price-formula]]` — UPHELD [A2] (2 critics)

The sell-price formula is held, and it is NOT level-scaled: sell = (1 + modifierCount) x 10 if weight >= 10, else x 5, with everything below id 3000 selling for 1 — confirmed independently in the web v0.717 bundle as well as Android.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 + reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web v0.717) + ShopUI.as:58`
- **KILLS this line:** "9. Sell price is NOT flat per item — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L10 (PROGRESSION + ECONOMY): closes items blocker ③ and economy blocker ②, and corrects §3 correction 9 — the observed 5c vs 25c is 0 modifiers vs 4 modifiers ((1+4)x5), there is no level term. The level term lives on the BUY side instead: XMLShopItem.as:68,86 'this.value = itemData.gvalue + this.item.getLevel() * 100;'.

### `[[items-equipment/sell-price-corrects-section3-item9]]` — UPHELD [A2] (12 critics)

The same formula corrects §3 correction #9: sell price scales with MODIFIER COUNT and a single weight>=10 step — it does NOT scale with level at all (5c = 0 mods weight<10; 25c = 4 mods weight<10).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593`
- **KILLS this line:** "Sell price is NOT flat per item — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L4 (economy) — a builder encoding a level term implements a different curve; the observed 5c/25c pair is fully explained by modifier count alone.

### `[[kh-web-getdamage-twin-crit-is-1.3]]` — UPHELD [A2] (2 critics)

The damage and crit formula is a BUILD DIVERGENCE, and the ledger had the web numbers right all along. The web v0.717 twin of MCSPlayer.getDamage() is §1t99s0§.as:3255-3277 (identifiable beyond doubt: same 'minDamage + Math.random() * damageRange' opener at :3258, same getBaseDamage at :3281, same Heavy-defender 'defense * 0.8' at :3286-3290, same reload-reset-on-full at :3295-3297, stance constants 0..4 at :27-35). Its numbers are Light *(0.5 + 0.4*m*0.1), Balanced *(1 + 0.2*m*0.1), Heavy/Dual/Reversed FLAT *1.4, and a SINGLE crit arm '*1.3 + STAT_CRITICALDMG' on reload == maxreload. Android v0.682 carries 0.005/0.005/1.5 and a two-arm 1.5x-Light / 1.2x-other crit. Two consequences: REBUILD_READINESS.md:152's 'Keep CRIT_MULT=1.3' is VINDICATED by shipped web code, and the ledger's stance table at :155 (0.9 / 1.2 / 1.4) reproduces to the digit from the web expression at mastery 10 -- so those numbers are web-build truth, not folklore. The ledger's own label is off by one: they are mastery-10 values, not mastery-9.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3290 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3198-3224`
- **Build:** both (divergent)
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 combat-core: this is the single most load-bearing formula in the project and it must be tagged per build. Tag the WEB row CONTRACT for v0.717 (0.04/0.02/1.4, crit 1.3x, Heavy-def 0.8) and the android row as a divergence. It also kills packet claim NF-1's demanded rewrite and confirms REBUILD_READINESS.md:152 and :189. Add it to the build-divergence table as divergence #8.

### `[[meta-social/v0717-rebirth-gold-25-100-300]]` — UPHELD [A2] (2 critics)

The v0.717 offline Gold faucet is 25 Gold per rebirth and 100 at the Dan-8 rebirth — a 300-Gold lifetime ceiling the client itself enforces — which restores the Kongregate forum finding and the ledger's own film-sourced +25, and upgrades tenthGold=100 from INFERRED to CONTRACT.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638,2646,2651 + §1t406s0§.as:1544`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled … film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L0 meta-social + L-rebirth/economy — closes blocker ④ at 25/100/300 instead of 5/20/60; makes tenthGold=100 CONTRACT; and re-validates KONGREGATE_FORUM_FINDINGS.md:308 rather than retiring it.

### `[[npcdata/stance-mastery-rank-10]]` — UPHELD [A2] (2 critics)

Stance mastery caps at rank 10, not 9: every elite NPC ships skills 1000/1001/1002 at <lvl>10</lvl>, and skilldata.xml gives each of the three masteries exactly 10 <level> rows.

- **Cite:** `reference/extracted/npcdata.xml:535 (npc 17) and 75 sibling rows; cross-checked in reference/extracted/skilldata.xml (skills 1000/1001/1002, 10 <level> rows each)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core + L-skills-meters: §3 correction #3's 'mastery-9 ceiling' label is wrong on the rank cap — the ceiling is 10. PARTIAL and deliberately so: I hold the rank cap, I do NOT hold which rank the wiki's 300/200/100 reach figures belong to. That still needs skilldata's <value> rows read against the wiki, and it changes whether STANCE_TABLE should be relabelled 'mastery-10' or treated as a mid-curve row.

### `[[progression/mastery-ceiling-is-10-not-9]]` — UPHELD [A2] (2 critics)

REBUILD_READINESS.md:155-157 labels 0.9/1.2/1.4 'MASTERY-9 CEILING values' and offers a decide-and-flag 'the build targets mastery-9'. The ceiling is 10. Each of the three stance-mastery skills declares exactly ten <level> rows: skilldata.xml:4 is <id>1000</id> and its tenth level value is at :74, :83 is <id>1001</id> with its tenth at :153, and skill 1002's tenth is at :232. The achievement copy says it in words: strings.json["8131"] = 'Light Stance Mastery Level 10.', ["8132"] and ["8133"] the same for Balanced and Heavy. Put mastery = 10 into the web formulas (1t99s0.as:3262/:3265) and you get exactly 0.5 + 0.4*10*0.1 = 0.9 and 1 + 0.2*10*0.1 = 1.2, i.e. the ledger's own ceiling numbers. At mastery 9 they would be 0.86 and 1.18.

- **Cite:** `reference/extracted/skilldata.xml:4,:74,:83,:153,:232 + docs/gauntlet/L0/index/strings.json["8131"],["8132"],["8133"] + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262,:3265`
- **Build:** web v0.717 formulas + android v0.682 skilldata/strings
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 combat-core + L2 skills-meters: the ledger's numbers are right and its LABEL is off by one. Anywhere the corpus says 'mastery-9', read mastery-10, and the decide-and-flag at RR:157 evaporates.

### `[[questdata/five-stances]]` — UPHELD [A2] (2 critics)

The game ships FIVE stances, not the three the ledger models everywhere: reversed_stance and dual_stance are used as boss movesets in shipped campaign content, and one companion class (spear_*) sits outside the stance system entirely.

- **Cite:** `reference/extracted/questdata.xml:11787 and :26029 (also :26078, :12101, :12107, :12113)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's reach also scales ×0.5→×0.9."
- **Lane impact:** L1 combat-core (+L2 skills-meters, L11 art-anim): STANCE_TABLE must carry 5 entries, not 3. Corroborates STAGE-0 S0-1's bindata animation-set list with content that actually uses reversed/dual. Companions have fixed stances (Satoshi=balanced, Fumio=heavy), which no ledger system models.

### `[[quests-story/ep4-12-epilogue-shipped]]` — UPHELD [A2] (6 critics)

Blocker (2) is dead: Episodes 4-12 and the Epilogue all ship with full step chains, cutscenes, waves and rewards; the ONLY unshipped chapter is Season 2, and the payload says so in its own words.

- **Cite:** `reference/extracted/questdata.xml:8521, :24869, :27347, :27697, :27710, :27726`
- **KILLS this line:** "Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. Scope decision: faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L1 CAMPAIGN — scope is Prologue -> Ep1-12 -> Epilogue (14 chapters), tripling the campaign the ledger planned to build.

### `[[rebirth/dan-achievements-prove-ten]]` — UPHELD [A2] (9 critics)

The achievement table independently proves the ladder tops out at a displayed Dan 10: achievement 51 fires at STAT_DAN==9 with the description 'Reach Dan 10.'

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin:463-470 + strings 8044/8124`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + meta-social: MAX_DAN_RANK=10 becomes CONTRACT; the four Dan achievement rows also drop straight into meta-social blocker ③.

### `[[rebirth/hgold-is-premium-currency]]` — UPHELD [A2] (2 critics)

The rebirth payout is Heavenly Gold, the real-money PayVault currency, not the coin economy - so a 'tenthGold' config key modelled as coins would be wrong even with the right number.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2669-2682 and :2684-2711; desktop thresholds at reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544 and :1581`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** economy + rebirth-elements: rebirth is a premium-currency faucet, which is why the desktop anti-cheat tolerates 300 of it only once DAN >= 9 (§1t406s0§.as:1544) while capping coins separately (OverworldHUD.as:1338, STAT_GOLD > 10000). The ledger's film-derived '+25 gold' was reading the Heavenly Gold counter, not the coin counter. For a single-player recreation with no PayVault this reward has no destination and should be flagged as a design decision, not ported.

### `[[rebirth/ledger-film-phantom-source]]` — UPHELD [A2] (2 critics)

REBUILD_READINESS.md §3 #7's 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' is a phantom source — the same ledger says the rebirth flow was never filmed, and a pre-rebirth longplay could not film a Dan 8->9 payout in any case.

- **Cite:** `docs/research/REBUILD_READINESS.md:165 vs :205, adjudicated by reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + the ledger's own credibility: this is the Tip-#27 failure mode (a confident sourced-sounding sentence with nothing behind it). §3 #7 should be STRUCK, not merely corrected — an unsourced 'film shows' assertion that contradicts its own document two lines away is worse than a gap. Flag any other §3 item that cites 'film' without a frame path.

### `[[rebirth/reach-dan-10-is-a-shipped-achievement-string]]` — UPHELD [A2] (3 critics)

Independent corroboration that Dan 10 is a real, reachable rank rather than a garbled wiki reading: the shipped string table carries an achievement description reading exactly 'Reach Dan 10.', alongside 'Reach Dan 2.', 'Reach Dan 3.' and 'Reach Dan 6.'. That is four rank milestones with 10 as the top one, which matches the web rebirth code paying +100 heavenly gold and announcing rank '10' at STAT_DAN == 8 while capping DAN at 9.

- **Cite:** `docs/gauntlet/L0/index/strings.json["8121"],["8122"],["8123"],["8124"] + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2659`
- **Build:** android v0.682 string table; the web rebirth code that pays the tier is web v0.717
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled"
- **Lane impact:** rebirth-elements: RR:164-165's demotion to INFERRED is unsupportable - MAX_DAN_RANK=10 is named in the game's own achievement copy AND in the rebirth announcement's literal "10".

### `[[rebirth/romaji-dan-ladder-in-v0717]]` — UPHELD [A2] (2 critics)

The v0.717 desktop client hardcodes the full romaji Dan ladder in ASCII — dan 0 blank, then nidan, sandan, yondan, godan, rokudan, nanadan, hachidan, kyudan, judan — with Renshi at 3-5, Kyoshi at 6-7 and Hanshi at 8-9, so the Dan ladder is held in the target build with no android-parity caveat and the wiki's 'kyudan' garble is settled outright.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565`
- **KILLS this line:** "7. MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th)"
- **Lane impact:** rebirth-elements blocker ③ closes in the TARGET build, not just the android port: '(kyudan)' is STAT_DAN 8 = displayed Dan 9, proving rather than inferring the two-layer numbering the wiki collapsed. Corollary for the S0-3 caveat: the desktop calls getString(458)/(465) at §1t5957s0§.as:3073-3074 with the same ids as 118_Mobile_Lang_EN.bin, the strongest string-table parity evidence produced so far.

### `[[rebirth/tenth-dan-tier-is-real]]` — UPHELD [A2] (2 critics)

REBUILD_READINESS.md's 'no 10th-rebirth tier' is FALSE in the shipped web build. Rebirth pays +25 heavenly gold normally and +100 when STAT_DAN == 8, and DAN increments only while < 9 — so the ceiling is DAN 9, which the game announces as rank DAN+1 = 10. MAX_DAN_RANK=10 (as displayed) and tenthGold=100 are therefore CONTRACT on v0.717, not INFERRED, and the wiki's 'kyudan/9th' datum was never garbled — it is the raw DAN ceiling. The film's flat +25 is true only because the player never reached DAN 8. The android build pays 5/20 instead, so 25/100 must be taken from the WEB file.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2659, with the stat-id map at :226-256 (§1t9413s0§ = 12 = STAT_HGOLD, §1t9426s0§ = 25 = STAT_DAN); android contrast reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2201-2214`
- **Build:** web v0.717 (android v0.682 contrast)
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy: §3.7's demotion of MAX_DAN_RANK and tenthGold to INFERRED should be reversed to CONTRACT (v0.717), and the wiki's kyudan reading rehabilitated. The currency is HGOLD (stat 12), so it still must not feed the coin purse.

### `[[rebirth/tenth-gold-is-100]]` — UPHELD [A2] (9 critics)

The real v0.717 desktop client pays +25 gold on every rebirth and +100 on the Dan 8→9 (displayed 9→10) rebirth, so both MAX_DAN_RANK=10 and tenthGold=100 are CONTRACT, not INFERRED.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 (§1t9426s0§=25=STAT_DAN at :254, §1t9413s0§=12=STAT_HGOLD at :228)`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy: promotes two config values from INFERRED to CONTRACT. Also the concrete evidence for the S0-3 build-parity caveat — the android v0.682 bundle uses 5/20 for the same two branches (StatsManager.as:2201-2207), so one in six checked numbers moved between 0.682 and 0.717; the desktop value wins.

### `[[skills-meters/canchangestance-is-a-named-gate]]` — UPHELD [A2] (2 critics)

In-combat stance switching has a named public gate in the web build: canChangeStance() = valid action state AND reload >= 48 — the ledger's HARD-LOCK line is dead code-level, not just caption-level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3063`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L2/L5: the recreation's Focus-gated switch is FAITHFUL. The gate value and the charge value are the same 48, so the rule is simply 'costs 48, refused below 48'. Two documents must be struck, not one: REBUILD_READINESS.md:158 and SHSD_MASTER_REFERENCE.md:388, which grades the hard lock [CONTRACT].

### `[[skills-meters/dan-caps-at-9-and-the-100-gold-tier-is-real]]` — UPHELD [A2] (2 critics)

CROSS-LANE: the web build caps the dan stat at 9 internally (displayed +1 = 10) and pays 100 gold — not 25 — on the rebirth that takes dan 8 to 9, so the ledger's 'no 10th-rebirth tier, flat +25' is wrong.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2655 (rebirth payout + cap), with :254 (§1t9426s0§ = stat 25) and §1t1832s0§.as:2787 (data.dan = getStat(9426))`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L11 (REBIRTH + ELEMENTS): MAX_DAN_RANK=10 and tenthGold=100 can both be promoted from INFERRED to CONTRACT with an A2 cite. The ledger's 'film shows flat +25, no 10th tier' is a negative inference from footage that never reached dan 8 — the payload says otherwise. Found from this unit's evidence while tracing the reach formula's DAN term.

### `[[skills-meters/in-combat-stance-switch-is-real]]` — UPHELD [A2] (6 critics)

§3.4 is wrong: in-combat stance switching is real in v0.717. 'CANNOT CHANGE STANCE' is a transient caption shown only when the focus bar reads exactly 0, hidden at any partial fill — and setStance charges a flat 48 frames, which a hard lock would have nothing to charge.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:336-347 (three-state caption) with §1t99s0§.as:3160-3166 (the charge)`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L5/L2: the recreation's Focus-gated in-combat switch is FAITHFUL, not a divergence — it should be presented as original behaviour and the cost set to a flat 48 frames. This REMOVES an entry from the project's labelled-deviation list rather than adding one.

### `[[skills-meters/reach-triple-is-a-floor-not-a-ceiling]]` — UPHELD [A2] (2 critics)

THE FRAME/PAYLOAD ORDERING THE SURVEY MISSED: the ledger's reach triple 300/200/100 is a MASTERY-0 read, the opposite of its own label — at mastery 10 the triple is ~294/252/189. Only the damage triple 0.9/1.2/1.4 is a ceiling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116 (reach multipliers) with §1t1523s0§.as:2344-2348 (base, asymptote 210 at DAN 0)`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 (COMBAT CORE) / L2: the ledger sentence is half-right and half-backwards, and the survey corrected only the half it noticed. 1.4x210=294 / 1.0x210=210 / 0.5x210=105 reproduces the wiki triple ONLY at mastery 0; the survey's own reconciliation quietly assumes that while its sibling claim leaves the ledger's 'ceiling' framing intact. Config must model reach as base-at-M0 growing with mastery, not as a ceiling to be walked back.

### `[[skills-meters/stance-damage-ceiling-is-mastery-10]]` — UPHELD [A2] (6 critics)

§3.3's stance damage table 0.9/1.2/1.4 is exactly right and is the web build's per-stance damage multiplier — but the ceiling index is mastery 10, not 9; the coefficient is x0.1 per level and the mastery skills have ten levels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3259-3271; mastery source at shs3_android_payload/scripts/StatsManager.as:1834 (getStat(1000)/(1001)/(1002))`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5/L2: Light = 0.5 + 0.04*M, Balanced = 1.0 + 0.02*M, Heavy/Dual/Reversed = flat 1.4, M in 0..10. Coding a mastery-9 ceiling ships Light at 0.86 and Balanced at 1.18 — both wrong.

### `[[skills-meters/stance-mastery-ceiling-is-10-not-9]]` — UPHELD [A2] (3 critics)

The ledger calls 0.9 / 1.2 / 1.4 the 'MASTERY-9 CEILING'. The web formula does not reach 0.9 at mastery 9: §1t99s0§.as:3262 is base * (0.5 + 0.4 * lightMastery * 0.1), which gives 0.86 at m=9 and exactly 0.90 at m=10; balanced at :3265 is base * (1 + 0.2 * balancedMastery * 0.1), giving 1.18 at m=9 and exactly 1.20 at m=10. The string table independently names the ceiling: strings.json["8131"], ["8132"] and ["8133"] are the achievements 'Light Stance Mastery Level 10.', 'Balanced Stance Mastery Level 10.' and 'Heavy Stance Mastery Level 10.'

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3261-3266 + docs/gauntlet/L0/index/strings.json["8131"],["8132"],["8133"]`
- **Build:** web v0.717
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L2 skills-meters + L5 combat-core - a one-word ledger fix (9 -> 10) that changes the whole mastery curve's domain.

### `[[skills-meters/stance-switch-gate-and-cycle]]` — UPHELD [A2] (2 critics)

The stance-switch gate is a hard reload >= 48 and the button cycles only Light -> Balanced -> Heavy -> Light; Dual and Reversed are unreachable from it, and the switch unlocks at the exact reload value where the bar still displays 0%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3079, read against §1t113s0§.as:328-343`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L2/L5: this is the direct proof the ledger's §3.4 is dead — the survey argued it indirectly from caption states. Also an authenticity detail worth reproducing rather than fixing: bar% = (reload-48)/144, so at reload exactly 48 the bar reads 0% and the CANNOT CHANGE STANCE caption is on screen for the frame in which switching first becomes legal.

### `[[skills-meters/stance-switch-gate-is-48]]` — UPHELD [A2] (2 critics)

In-combat stance switching is hard-gated on reload >= 48 by an explicit early-return, so 'CANNOT CHANGE STANCE' is a literally true refusal rather than an inference from the switch cost.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3063`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L5/L2: §1t4472s0§ is the whole stance cycle (-1 -> Light -> Balanced -> Heavy -> Light, :3064-3079) and it refuses below 48. Since the bar reads 0 iff reload <= 48, the caption fires exactly when the cycle refuses. Ship a Focus-gated switch with gate 48 and cost 48 — and note only THREE stances are player-cyclable; Dual and Reversed are never reached by §1t4472s0§.

### `[[skills-meters/stance-switch-gate-is-reload-48]]` — UPHELD [A2] (2 critics)

The in-combat stance-switch gate is an explicit `reload >= 48` check written down twice — it did not need to be inferred from the 48-frame charge.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 (canChangeStance) and :3058-3080 (cycleStance)`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L2/L5: gate = reload >= 48; cost = flat 48; cycle order is strictly Light -> Balanced -> Heavy -> Light (only the three core stances are reachable by the cycle key). Also disproves the previous survey's Android-derived 'maxreload/6' gate — that constant does not exist in the web player class.

### `[[skills-meters/stance-switch-hard-gate-48]]` — UPHELD [A2] (2 critics)

In-combat stance switching is gated by a hard reload >= 48 check, and the switch button cycles only Light -> Balanced -> Heavy -> Light; Dual and Reversed are unreachable from it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3050 and :3058-3078`
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE")"
- **Lane impact:** L2/L5: settles the survey's claim outright with a direct gate instead of an inference from caption states. Note the off-by-one to reproduce faithfully: the gate opens at raw reload 48, which is exactly where the displayed bar still reads 0 ((48-48)/(192-48)=0), so the refusal caption is on screen for the first frame the switch is legal.

### `[[skills-meters/web-stance-damage-ladder-and-crit-are-fully-transcribable]]` — UPHELD [A2] (2 critics)

The complete web v0.717 per-stance damage ladder, the crit rule and the Heavy defence penalty are all in one function and none of them are inferred: Light = base x (0.5 + 0.4 x lightMastery x 0.1) i.e. 0.5 -> 0.9; Balanced = base x (1 + 0.2 x balancedMastery x 0.1) i.e. 1.0 -> 1.2; Heavy, Dual and Reversed = base x 1.4 flat; at reload == maxreload the result is x1.3 plus the flat critical-damage stat; Heavy defence is x0.8. So 0.9/1.2/1.4 is the MASTERY-10 damage ceiling and the mastery curve is a transcription, not research.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 and :3284-3290`
- **Build:** web v0.717
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base. … → Either model the mastery curve or decide-and-flag "the build targets mastery-9" and label accordingly."
- **Lane impact:** L5 combat-core + L2 skills-meters: RR:157's fork is dead — there is no decision to make, the mastery curve is written down and should simply be transcribed. It also settles RR:190 blocker ② (crit 1.3 vs 3) from the web source rather than from the wiki: the multiplier is a literal 1.3 and it is DETERMINISTIC (fires iff reload == maxreload), which also answers RR:195 blocker ⑤ 'crit proc rule (chance vs deterministic) — entirely absent'. Note the Android ladder is DIFFERENT (0.5->1.0 / 1.0->1.5 / 1.5 flat, crit x1.5 or x1.2, mastery on a 0-100 scale) — do not seed config from the Android decompile.

### `[[stance/in-combat-switch-is-live-in-web-battleui]]` — UPHELD [A2] (2 critics)

In-combat stance switching is LIVE in web v0.717 and wired in the BattleUI itself, not merely permitted by the player class: the battle HUD's stance-button handler calls canChangeStance() (reload >= 48), plays Snd_smallClick and calls nextStance(), and plays Snd_error on refusal — and the 48-frame Focus charge is deducted only inside if(isBattle()). None of the four stance claims in this packet cited the BattleUI half, which is the artifact that actually kills the ledger sentence.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479, with reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3160-3166 and the version stamp at §1t1523s0§.as:36`
- **Build:** web v0.717
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L2/L5: REBUILD_READINESS.md:158 must be rewritten, not softened. Ship the Focus-gated in-combat switch as ORIGINAL behaviour: gate reload >= 48, cost a flat 48, cycle Light->Balanced->Heavy->Light only, Snd_smallClick on success and Snd_error on refusal.

### `[[ui-hud/cannot-change-stance-is-the-reload-meter-low-end-readout]]` — UPHELD [A2] (4 critics)

The single sentence RR:158 rests on - the on-screen 'CANNOT CHANGE STANCE' - is not a lock notice, it is the reload/crit meter's own low-end label, and the web build shows it switching. 1t113s0.as:110-111 builds two htmlText strings: a black one from getString(175) ('Critical Hit') and a GREY (#BBBBBB) one from getString(960). :328-358 computes ratio = (reload-48)/(maxreload-48) clamped at 0, then shows the grey label exactly when ratio == 0, HIDES it while 0 < ratio < 1, and swaps to the black 'Critical Hit' plus Snd_criticalDamage at ratio >= 1. The gate the stance button asks (1t99s0.as:3048-3051) is the same threshold, reload >= 48. String 960 does not exist in the v0.682 table (docs/gauntlet/L0/index/strings.json has no key 960), i.e. it is a v0.717 addition - which is also why the label has never been sourced. So one bar drives three states: below 48 'cannot change stance', above 48 stance switching is legal, at max the crit fires.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111,:326-360 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3043-3051 + docs/gauntlet/L0/index/strings.json["175"] (present) and ["960"] (absent)`
- **Build:** web v0.717
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE")"
- **Lane impact:** L2/L5/L8: this is the artifact that kills RR:158 at its own evidence rather than around it - the label the ledger read as a lock is the gate's 'not yet'. Ship: one meter, threshold 48 for stance, max for crit, grey label below 48, 'Critical Hit' + Snd_criticalDamage at max.

### `[[ui-hud/the-cannot-change-stance-label-is-the-focus-gate-readout]]` — UPHELD [A2] (4 critics)

The film evidence the ledger's hard-lock sentence rests on is reconcilable with the live stance switch, and the reconciliation is in the web BattleUI. §1t113s0§.as:326-343 draws the reload/crit bar as (reload - 48) / (maxreload - 48) - the bar only begins to fill ABOVE 48, the exact stance-switch threshold - and drives one text field off that value: at bar == 0 it shows §1t5204s0§, a GREY (#BBBBBB) label built at :111 from getString(960); between 0 and 1 the label is hidden; at bar >= 1 it swaps to §1t5203s0§ = getString(175) = 'Critical Hit' and fires Snd_criticalDamage. String 960 is used at exactly one site in the whole web payload and does NOT exist in the android v0.682 table, so it is a web-only string I cannot resolve to text - but its slot is precisely where a 'CANNOT CHANGE STANCE' readout would live, and the label is BAR-STATE driven, not battle-state driven. That is a Focus-insufficiency indicator, not a hard lock.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111 and :326-361 + docs/gauntlet/L0/index/strings.json["175"] + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051`
- **Build:** web v0.717
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE")."
- **Lane impact:** L8 ui-hud + L5 combat - removes the last defence of RR:158. PARTIAL because string 960's text is web-only and unresolved; resolving it would close the sentence outright.

### `[[ui-hud/web-battleui-is-1t113s0-and-owns-the-in-combat-stance-switch]]` — UPHELD [A2] (2 critics)

§1t113s0§ is the web v0.717 BattleUI, and its handler at :468-478 is the in-combat stance switch: gated on §1t4470s0§(), it plays Snd_smallClick and calls nextStance on success and Snd_error on refusal. A hard lock does not ship an error beep on its refusal branch.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:293, :326, :468-478 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3175`
- **Build:** web v0.717
- **KILLS this line:** "In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior"
- **Lane impact:** L2/L5/L7 ui-hud: this is the artifact that actually kills the HARD-LOCK line, independent of the mis-named §1t4470s0§ claim. The recreation's Focus-gated in-combat switch is FAITHFUL, not a 2014 throwback. Two documents must be struck: REBUILD_READINESS.md:158 and SHSD_MASTER_REFERENCE.md:388, the latter graded [CONTRACT].

### `[[ui-hud/web-battleui-stance-button-plays-an-error-sound-when-the-gate-refuses]]` — UPHELD [A2] (2 critics)

The web v0.717 BattleUI ships a stance button whose handler branches on canChangeStance(): on success it plays Snd_smallClick and runs the stance cycle, on failure it plays Snd_error. A build in which in-combat stance were hard-locked would not ship a refusal sound. This is the most direct available proof that the ledger's 'HARD-LOCKED / removed 2014 behavior' sentence is dead.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479, with the button binding at §1t406s0§.as:944 and the gate at §1t99s0§.as:3048-3051`
- **Build:** web v0.717
- **KILLS this line:** "4. In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models removed 2014 behavior."
- **Lane impact:** L5/L2: RR:158 must be struck, not softened. The recreation's Focus-gated in-combat switch is ORIGINAL behaviour, and it ships with two audio cues the rebuild should reproduce — Snd_smallClick on a legal switch, Snd_error on a refusal. Cross-lane to art-anim-audio-feel: these are two named SFX keys nobody has claimed.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[NF-category-11-decoded]]` — NOT-UPHELD [A2] (2 critics)

Skill category 11 is the enemy-only special-move bucket with SEVEN members, not a mastery bucket — so the packet's 'category 11 therefore stance mastery' inference is a non-sequitur. The right evidence for two extra stances is positional plus the animation blobs.

- **Cite:** `reference/extracted/skilldata.xml (category-11 census; skill 1500 at :1948, 1501 at :1960) resolved through docs/gauntlet/L0/index/strings.json, plus reference/extracted/npcdata.xml:3662, :3898, :3934 and reference/extracted/android/101_MCSCharacter_DualStanceAnimationData.bin, /95_MCSCharacter_ReversedStanceAnimationData.bin`
- **Build:** both
- **aimed at this line, which SURVIVES:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-skills-meters: the conclusion (two boss-only extra stances, dual-wield and reversed-grip, backed by named animation blobs in both builds) survives; the category argument does not. PARTIAL because 1500/1501 have no string entry at all, so their names are still unheld.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-1-web-crit-is-flat-1.3]]` — UPHELD [A2] (1 critic)

The WEB v0.717 crit multiplier is a FLAT 1.3× with no stance split — the ledger's 'Keep CRIT_MULT=1.3' ruling is CONFIRMED by shipped code, not killed. Deterministic in both builds (fires exactly when reload == maxreload, no random term), but the 1.5×Light / 1.2×other split cited by NF-1 is android v0.682 only. §1t99s0§.as is the web MCSPlayer twin: same four functions in the same order with identical bodies (getDamage/getDefense/deductReloadBar/bonusReload), same BALANCED+REVERSED vs HEAVY+DUAL reload grouping, same 5*24 constant; bundle version pinned at §1t1523s0§.as:36 = 0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **Build:** web v0.717
- **KILLS this line:** "2. The "iaido-duel MEASURED 3.0× crit" is a DIFFERENT GAME … Keep CRITMULT=1.3."
- **Lane impact:** L5 combat-core / L2 skills-meters: CRIT_MULT=1.3 graduates from wiki-sourced to A2-CONTRACT for v0.717, and the crit proc rule (deterministic, consumes a full Focus/reload bar — deductReloadBar zeroes it at §1t99s0§.as:3295-3298) closes skills-meters blocker ⑤ and combat-core blocker ⑤ together. Any android-sourced combat constant must now be diffed against the web twin before banking.

### `[[NEW-2-web-per-stance-damage-and-mastery-10-ceiling]]` — UPHELD [A2] (1 critic)

The WEB v0.717 per-stance damage multipliers are Light ×(0.5 + 0.04·lightMastery), Balanced ×(1 + 0.02·balancedMastery), Heavy/Dual/Reversed a flat ×1.4 — and at maximum mastery they reproduce the ledger's stance table EXACTLY. skilldata skill 1000 (Light Stance Mastery) carries ten <level> rows, value 1…10, with <required>9</required> on the level-10 row. At mastery 10: Light 0.5+0.4 = 0.90, Balanced 1+0.2 = 1.20, Heavy 1.40 — i.e. the '0.9/1.2/1.4 MASTERY-9 CEILING' table, confirmed to three decimals by shipped code. The android v0.682 curve (0.005 per point, flat 1.5) is a different, later re-tune and must not be coded for this recreation.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277`
- **Build:** web v0.717
- **KILLS this line:** "3. The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L5 combat-core: the '×stance' term is now an exact three-way expression for the target build, base damage is minDamage + Math.random()*damageRange, and Heavy/Dual/Reversed do not scale with mastery at all. Confirms REBUILD_READINESS.md:155 rather than overturning it, and supplies the mastery curve the ledger asked to be modelled or flagged.

### `[[NF-G/web-side-cite-for-800x480-and-a-second-800x690-layout]]` — UPHELD [A2] (1 critic)

The 800x480 native resolution has a WEB-side cite, so it no longer rests on an android file: §1t1540s0§.as:271-273 declares baseW 800, baseH 480 and an ALTERNATE height of 690, and :277-289 selects the 690 layout whenever the viewport is narrower than 800/690. The fit at :294-307 is a single UNIFORM scale with centring — scale = stageWidth/800 with letterbox when the viewport is narrower than 5:3, scale = stageHeight/480 with pillarbox when wider — and :388 hides the four blocker bars when the stage is exactly 800x480 or 800x690. Consequence for film measurement: the shipped renderer never stretches, so horizontal and vertical scales in a longplay frame are equal by construction, and the 1816-vs-1800 px gap in video A is a recording/re-encode artifact, not a game-side anisotropy.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273, :274-289, :294-307, :388`
- **Build:** web v0.717
- **KILLS this line:** "12. Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** UI-HUD ① ('aspect-ratio truth — read stage.stageWidth in a build') closes from source with no build needed; ledger item 12 is CONFIRMED, not overturned, and gains a second supported layout (800x690) it never mentions.

### `[[actionscript/native-resolution]]` — UPHELD [A2] (2 critics)

Native stage is 800 x 480 as a code constant, not an inference, and the engine carries an explicit letterbox/scale transform (stageScale, stageOffsetX/Y) that is applied to hit-test coordinates — so HUD fractions measured off a 1920x1080 capture are suspect exactly as the ledger warned.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:80-98; transform applied at NPCManager.as:1226-1227`
- **KILLS this line:** "Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed."
- **Lane impact:** L-ui-hud (blocker ① 'read stage.stageWidth in a build' no longer needs a build) and L-combat-core (all reach px in as/reach-formula are stage px, and stage px are now unambiguous). Honest limit: stageScale/stageOffset are runtime-set, so the letterboxing question is a render-time question these literals do not fully answer.

### `[[bindata/aspect-frame-beats-swf-header]]` — UPHELD [A1] (2 critics)

The live canvas in the longplay measures 1816x1080 (aspect 1.6815 ≈ 5:3) with 52px pillars each side, confirming §3.12's 800x480 read and quantifying the pillarbox — even though the web payload's own SWF header declares an 800x690 stage rect. THE FRAME WINS and I say so.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — full-frame 1920x1080 per-column scan, column counted as letterbox when every 7th-row pixel has R+G+B <= 18; frame also viewed at full size to confirm the bands are pillars, not scene content`
- **KILLS this line:** "Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** L-ui-hud: blocker ① 'aspect-ratio truth' is CLOSED with a number. Every HUD x-fraction taken off the full 1920 width is wrong by 5.42%; correct conversion is frac = (x_px - 52) / 1816. Also flags that '800x480' is literally only the ANDROID binary's rect — the web SWF rect is 800x690 and the frame overrules it.

### `[[combat-core/mastery-is-small-integer]]` — UPHELD [A2] (1 critic)

Stance mastery is a small integer (roughly 0-10), not a 0-100 percentage: abilities are gated at mastery >= 3 / 4 / 5, and substituting mastery=10 into the v0.717 damage switch reproduces the ledger's stance damage table 0.9 / 1.2 / 1.4 exactly.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 + reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3166-3184 and StatsManager.as:1834`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: CONFIRMS the ledger's mastery-ceiling reading for the damage table and refutes the rebirth lane's counter-assertion that mastery is a 0-100 percentage. Also gives the recreation the ability-unlock ladder for free: light 3/4/5 = launch/deflect/air-combo, balanced 3/4/5 = flip-up/deflect/launch, heavy 3/4/5 = launch/deflect/stab; reversed and dual grant all five unconditionally (MCSPlayer.as:3188-3195).

### `[[economy/rebirth-pays-premium-currency]]` — UPHELD [A2] (1 critic)

The rebirth payout is Heavenly Gold (STAT_HGOLD = 12, the PayVault premium currency), not the soft coin purse (STAT_GOLD = 11), so any tenthGold config value must be wired to the premium wallet.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, :2627-2677 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 and :228; docs/gauntlet/L0/index/strings.json keys 63/64`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-economy + L-rebirth-elements: the rebirth reward touches the premium wallet, which also means it is entangled with the dead Player.IO PayVault backend and needs an offline substitute. If the ledger's filmed '+25 gold' was read off the Coins counter, the film and the code describe different currencies - and per the standing invariant the frame wins, so that reading needs re-checking against the frame.

### `[[economy/rebirth-pays-premium-gold]]` — UPHELD [A2] (1 critic)

The rebirth reward is written to STAT_HGOLD (id 12, the premium Gold wallet), not STAT_GOLD (id 11, the coin wallet).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192, 194, 2201-2207; desktop reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:228 (=12), 2644-2652`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** economy + rebirth-elements: the +25/+100 is premium currency, which changes what the reward is worth and which wallet the recreation must credit. Two separate currencies exist and the ledger's single word 'gold' does not distinguish them.

### `[[items-equipment/section3-item9-rarity-half-survives]]` — UPHELD [A2] (1 critic)

§3 correction #9's 'scales with rarity' half is correct by construction and must not be struck with the 'level' half, because rarity is DEFINED as modifier count and sell price is (1 + modifierCount) x {5,10} — the two are the same variable under different names.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:382-405 and :1582-1593 and :307-309`
- **KILLS this line:** "Sell price is NOT flat per item — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L4 (economy) - strike only the '/level' half of §3 #9. The survey's claim that price 'does NOT scale with level at all' is right, but its framing invites deleting the correct rarity half too.

### `[[rebirth/gold-is-premium-hgold]]` — UPHELD [A2] (1 critic)

The rebirth payout is written to STAT_HGOLD (id 12), the premium currency the UI calls 'Gold' — not STAT_GOLD (id 11), which is the coin currency.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192, :194, :705-706, :2203, :2207 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:228, :2646, :2651 + docs/gauntlet/L0/index/strings.json key 100`
- **KILLS this line:** "MAXDANRANK=10 and tenthGold=100 should be INFERRED, not CONTRACT."
- **Lane impact:** economy: tenthGold=100 and the flat +25 belong to the PREMIUM currency config, not the coin config. The ledger's Economy 'gold has legit non-cash faucets (rebirth/tournament/betting)' line is therefore about hard currency specifically, which is the whole point of that bullet — bind it to the right stat id or the faucet model is wrong by a factor of the coin/gold exchange.

### `[[rebirth/payout-is-the-premium-gold-purse]]` — UPHELD [A2] (1 critic)

The rebirth payout (+25, +100 at Dan 8) lands in STAT_HGOLD=12, the IAP-linked premium purse the HUD labels 'GOLD', not in STAT_GOLD=11, the coin purse the HUD labels 'MONEDAS'.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, 2669-2675 + OverworldHUD.as:1567-1569 + reference/extracted/sprites/DefineSprite_1671/1.png ('100000 MONEDAS') and DefineSprite_1674/1.png ('100000 GOLD')`
- **KILLS this line:** "film shows a flat +25 gold every rebirth, no 10th-rebirth tier."
- **Lane impact:** L economy + rebirth-elements: refines the survey's tenth-gold claim rather than refuting it (the game itself calls HGOLD 'gold', so the film's '+25 gold' is consistent). But REBIRTH.earlyGold/tenthGold must be wired to the premium currency, and a recreation that omits IAP has to decide what that purse becomes. Also resolves the ledger's currency naming: 'coins' = STAT_GOLD = MONEDAS, 'gold' = STAT_HGOLD = the cash-purchasable one.

### `[[rebirth/v717-stance-multipliers]]` — UPHELD [A2] (1 critic)

The v0.717 desktop client's per-stance slash multipliers are on disk and differ from the android build: Light x1.4, Balanced x(1 + 0.2*mastery*0.1), Heavy x(0.5 + 0.4*mastery*0.1) floored at 100, Reversed x1.4, Dual x1.0 — and the *0.1 scaling means mastery is a 0-10 domain, giving Heavy reach exactly 0.5 -> 0.9.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083-3153, with symbol binding at :182-197 (param10=baseSlashLength, param11=slashUsage unobfuscated, param12/13/14=light/balanced/heavy mastery) and :222`
- **KILLS this line:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's reach also scales ×0.5→×0.9."
- **Lane impact:** combat-core L1: the reach multipliers are RECOVERED for the real client, and REBUILD_READINESS §3 #3's 'Heavy's reach also scales x0.5->x0.9' is CONFIRMED verbatim by v0.717 rather than needing re-checking. Combined with the Dan-scaled base (120 + floor((90+DAN*5)*speed/(20+speed))), on-screen Light reach is 294 px at Dan 0 rising to 357 px at Dan 9. Supersedes the survey's android-only figures.

### `[[skills-meters/150pct-damage-is-a-food-buff]]` — UPHELD [A2] (6 critics)

Correction to the previous UNVERIFIED survey: the frames' yellow '150% DAMAGE' is the BUFF_ATTACK food buff (minDamage x1.5), not evidence of a Heavy-stance multiplier — and the ledger's own §3 crux note (Potato Dog) was right all along.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/OverworldHUD.as:1402-1404 and MCSPlayer.as:210-223; item copy string 4132`
- **KILLS this line:** "Also visible: player HP 20/20, "150% DAMAGE" buff (Potato Dog), "CANNOT CHANGE STANCE""
- **Lane impact:** L5/L10: the buff multiplies minDamage ONLY (not damageRange), and buffs are mutually exclusive (an else-if chain, and the item copy says so). Under the web build Heavy is x1.4 anyway, so the coincidence the previous survey rested on does not exist in v0.717.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
