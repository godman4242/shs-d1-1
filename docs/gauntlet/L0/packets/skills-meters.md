# LEDGER PACKET — `skills-meters`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**25 surviving overturns · 5 true-but-rejected · 47 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **skills-meters** | 33 | Chi Punch, skill tree structure, crit formula, stance scaling | per-skill costs/cooldowns; Focus numerics; Shunpo effect; SPD→cooldown formula |
### skills-meters — 33
- **Ready:** Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s); full 6-category tree structure + per-stance unlock levels; crit = 1.3× formula.
- **Blockers:** ① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.* ② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels). ③ Focus numerics (max/fill/switch-cost). ④ SPD→cooldown formula. ⑤ crit **proc** rule (chance vs deterministic) — entirely absent.
- **Surface:** real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale. "Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NEW-6-shunpo-effect-recovered]]` — UPHELD [A2] (2 critics)

Shunpo's real effect is held, closing skills-meters blocker ②. Skill 1039 'Shunpo' is the Light-stance ultimate and is a HOLD-TO-CHARGE damage skill, not the SHS2 spacebar-slowmo: 'Ultimate Light Stance technique. Hold down the skill icon to increase the damage it inflicts. This skill can only be used when in Light Stance.' The same shape holds for its two siblings, 1040 'Thousand Stabs' (Balanced) and 1041 'Deadly Cleave' (Heavy), and all three sit at the level-70 rung of the enemy skill ladder.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json — skilldata.xml resolved["1039"], resolving reference/extracted/skilldata.xml's <displayname>/<desc> ids against docs/gauntlet/L0/index/strings.json`
- **Build:** android v0.682 string table; skilldata row ids identical in the web payload
- **KILLS this line:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** L2 skills-meters: blocker ② closes — and the ledger's own suspicion (that the slowmo belongs to SHS2) is vindicated. Carries the S0-3 Android-string caveat for the COPY, but the skill id and category are identical in both builds' skilldata.

### `[[NF-4-spd-to-cooldown-formula-recovered]]` — UPHELD [A2] (3 critics)

The SPEED-stat → skill-cooldown transfer function is a shipped two-line formula: cooldownModifier = 1 - min(speed, 300) / 300 * 0.5, i.e. a linear halving that saturates at SPD 300. It is consumed by the character sheet at InventoryUI.as:1937 and printed to the player at :2233 ('skill cooldown modifier: 0.' + int(mod*1000)). This closes skills-meters blocker ④ at REBUILD_READINESS.md:195 and the SPD half of progression blocker ① at :200.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860, consumed at InventoryUI.as:1937 and printed at :2233`
- **Build:** android v0.682 (web parity not separately checked; the sibling getBaseSlashLengthVal IS identical in both builds)
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters: 'the SPEED-stat→cooldown formula' stops being a known-unknown. Cross-check: the payload's own placeholder character sheet prints 0.75, which back-solves to SPD 150.

### `[[NF-B/web-focus-numerics-diverge-from-android-on-four-constants]]` — UPHELD [A2] (2 critics)

The Focus/reload model differs between builds on four constants, and the web values are the ones a v0.717 target needs. maxreload is 8*24 = 192 in web (§1t99s0§.as:249) against 5*24 = 120 in android (MCSPlayer.as:239). The stance-switch cost is a FLAT -48 in web (§1t99s0§.as:3162-3165) against 'reload > max/2 -> max/3, else -= max/6' in android (MCSPlayer.as:3098-3105). The stance-switch gate is 'reload >= 48' in web (§1t99s0§.as:3050 and :3060) against 'reload < max/6' in android (MCSPlayer.as:2977). The HUD normalisation is (reload-48)/(max-48) in web (§1t113s0§.as:326-328) against (reload-24)/(max-24) in android (MCSPlayer.as:3272). Unchanged across builds: +1 fill per tick, the per-stance slash drain (x0.5 light / x1 balanced+reversed / x1.5 heavy+dual), zero-on-crit-slash, and the +6 kill bonus. This closes RR:195 (3) 'Focus numerics (max/fill/switch-cost)' and RR:190 (5) on WEB constants.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3050, :3060, :3162-3165, :3295-3314, :3318-3325 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-328 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :1158-1168, :2977, :3098-3105, :3240-3272`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 skills-meters + L5 combat-core: the blocker closes, but only on the WEB constants. Porting the android Focus model to a v0.717 target is wrong on max, switch-cost, gate and HUD scale simultaneously.

### `[[NF-C/web-spd-to-cooldown-saturates-at-600-not-300]]` — UPHELD [A2] (2 critics)

The SPEED-stat → skill-cooldown transfer function exists in the WEB build too, and its saturation point is 600, not the android build's 300: cooldownModifier = 1 - min(speed, 600) / 600 * 0.5. It is reached from §1t1523s0§.as:2279-2286 (STAT_SPEED = §1t9410s0§ = 8, x1.5 while the speed buff is up) and consumed at §1t105s0§.as:318, where a skill's cooldown is levelList[level].cooldown * 24 multiplied by the modifier. Porting the android constant halves the benefit at any given SPD (at SPD 300 android is already at the 0.5 floor while web is at 0.75).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296 and :2279-2286 · reference/decompiled/shs3_payload/scripts/§1t105s0§.as:297-319 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters ④ closes at the TARGET build — and closes with 600, not the 300 an android-sourced claim would write into a v0.717 config.

### `[[NF-D/web-spd-to-cooldown-saturates-at-600-not-300]]` — UPHELD [A2] (2 critics)

The web v0.717 SPEED-to-skill-cooldown transfer function saturates at SPD 600, not SPD 300: cooldownModifier = 1 - min(speed, 600) / 600 * 0.5. The shape is the same linear halving as android's, but the knee is at twice the speed, so at any given SPD below 300 the web build gives HALF the cooldown reduction the android formula does (e.g. SPD 150 -> 0.875 web vs 0.75 android). The wrapper is the structural twin of android getSkillCooldownModifier: it reads stat §1t9410s0§ = 8 (= STAT_SPEED, android StatsManager.as:186) and applies the same *= 1.5 buff branch before delegating.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2296, :220 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1845-1861, :186`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters: the blocker closes, but the ledger must carry the WEB constant 600. NF-4-spd-to-cooldown-formula-recovered supplies the correct android formula and honestly flagged web parity as unchecked - this discharges that flag, and it diverges.

### `[[actionscript/shunpo-is-teleport-double-damage]]` — UPHELD [A2] (2 critics)

Shunpo is a charged teleport, not slow-motion: it moves the player 250 px in the facing direction with a charge-scaled hit projectile, and on the slash path it teleports the fighter to the end of the drawn blade path and doubles the slash damage.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1747-1758, :2700-2705, :1706, :4344-4351 · web parity reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1810 and :2775`
- **KILLS this line:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** L-skills-meters: blocker ② closed — the ledger's negative claim is confirmed and the positive answer supplied, with the charge budgets for all three stance ultimates (Shunpo 3s, Thousand Stabs 3s, Deadly Cleave 4s) and their post-skill invulnerability windows (26 / 16 frames).

### `[[hunter/focus-plus6-is-a-kill-bonus]]` — UPHELD [A2] (2 critics)

The +6 Focus reward fires on a KILL, not on a landed slash. Both builds gate bonusReload() behind a count of enemies that just died this resolution pass. This inverts the meter economy the packet describes: connecting gives nothing back, so a long single-target duel drains Focus monotonically until the enemy dies.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1685-1712 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:3265-3272 · reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:2035-2049`
- **Build:** both
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L-skills-meters and L-combat-core: the Focus income model changes shape — +1/frame plus a per-kill +6, with no reward for merely connecting.

### `[[hunter/web-focus-bar-dead-zone-is-48]]` — UPHELD [A2] (2 critics)

The web v0.717 Focus bar's hidden dead zone is 48, not the 24 the packet reports from the Android build. Displayed fill = (reload - 48) / (192 - 48), so the bar reads exactly zero precisely while reload <= 48, which is exactly when the stance change is refused: the bar and the CANNOT CHANGE STANCE gate are the same predicate. This is also the constant that makes the longplay measurement come out right — 44.7 px/s predicted vs 42.5 px/s measured, against 38.3 px/s from the Android-24 model.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-333 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:1163-1168 and :3272`
- **Build:** web v0.717
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L-ui-hud and L-skills-meters: the Focus bar render contract for v0.717. Corrects claim/focus-meter-numerics and claim/focus-bar-is-the-third-hud-bar, and adds an eighth row to the build-divergence table.

### `[[hunter/web-speed-cooldown-cap-is-600]]` — UPHELD [A2] (2 critics)

Seventh build-divergence row: the SPEED-to-cooldown transfer function is capped at 600 in web v0.717 and 300 in Android v0.682, so the web build needs twice the SPEED to reach the same 50% cooldown reduction. The surveyor marked this PARTIAL because a literal search for '300 * 0.5' found nothing in the web tree — which is exactly what a doubled constant does to that search.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2296 · contrast reference/decompiled/shs3_android/scripts/StatsManager.as:1844-1860`
- **Build:** web v0.717
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L-skills-meters blocker ④ and L-progression blocker ① close for the RIGHT build. Also confirms getBaseReload = 48 + SPEED*6 is identical in both (StatsManager.as:1841 = §1t1523s0§.as:2276).

### `[[npcdata/boss-movesets]]` — UPHELD [A2] (2 critics)

96 NPCs carry <skills> (647 skill rows, 16 distinct movesets) resolvable to named skills including Shunpo, Undying, Shadow Clone, Thousand Stabs and Heavenly Sword — and skill category 11 is an enemy-only bucket whose ids 1500/1501 have no string-table entry at all, implying five stance masteries in the shipped data rather than three.

- **Cite:** `reference/extracted/npcdata.xml:535 (standard elite kit, 73 NPCs), :3917 (Gojo Takamori), :3573 (Chikako), :3365 (Satoshi); reference/extracted/skilldata.xml:1948 and :1960 for the unnamed category-11 skills`
- **KILLS this line:** "- Blockers: ① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — read skill cards in a preserved build. ② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** skills-meters + enemies-ai — Shunpo is an assignable skill with a skilldata row, so blocker ② no longer needs a preserved build; and the boss-only category-11 set (incl. two unnamed stance masteries matching the bindata dual_stance/reversed_stance animation sets) is content no system lane has catalogued.

### `[[skilldata/chi-costs-not-single-digit]]` — UPHELD [A2] (2 critics)

The ledger's claim that real chi costs are single-digit is an over-claim: across the 81 non-empty <chi> rows the costs are 10 (x18), 50 (x14), 20 (x9) and 100 (x1) as well as 2/3/5-8, with Mass Shadow Clone at 100 chi — so a ~100-point chi pool is implied by the data, not a fabricated rescale.

- **Cite:** `reference/extracted/skilldata.xml:1648 (skill 1055 Mass Shadow Clone) and :1353 (skill 1044, an explicit <chi>0</chi>); full distribution counted over all 182 level rows, journal SK-7`
- **KILLS this line:** "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."
- **Lane impact:** skills-meters — surface verdict refuted and the config re-scale ruling needs re-opening; combat-core; progression — a 100-chi skill forces >=18 stat points into Chi at +5/point from a base of 10.

### `[[skilldata/shunpo-effect]]` — UPHELD [A2] (2 critics)

Shunpo's real effect is held: a hold-to-charge damage-scaling ultimate hard-locked to Light Stance, one level only, 50 chi, 60s cooldown, gated on Light Stance Mastery level 10 — with Thousand Stabs and Deadly Cleave identical in shape for Balanced and Heavy.

- **Cite:** `reference/extracted/skilldata.xml:1235-1247 (skill 1039); skill-desc string 6085; reference/decompiled/shs3_android/scripts/SkillManager.as:54`
- **KILLS this line:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** skills-meters — blocker ② closed; combat-core — a third hold-to-charge input alongside Charged Shot (1046).

### `[[skills-meters/chi-cooldown-table-held]]` — UPHELD [A2] (2 critics)

All 182 level rows carry verbatim <chi> and <cooldown>, including every skill the ledger's blocker ① names by name (Smoke Bomb, Kunai, Lay Trap, elemental), so zero INFERRED cooldowns need remain in config.

- **Cite:** `reference/extracted/skilldata.xml:508-514 (Smoke Bomb 1010 L1), :897-903 (Lay Trap 1024 L1), :927-933 (Fire Trap 1025 L1), :991-997 (Fire Kunai 1029 L1)`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — read skill cards in a preserved build."
- **Lane impact:** L2 skills-meters — blocker ① dead. L2's gate ('zero INFERRED cooldowns remain') is now a transcription loop, not research.

### `[[skills-meters/chi-costs-are-not-single-digit]]` — UPHELD [A2] (6 critics)

The Surface bullet is wrong: chi costs run 0, 2, 3, 5, 6, 7, 8, 10, 20, 50, 100 — double digits are the norm above level ~30 and the ladder tops out at exactly 100.

- **Cite:** `docs/gauntlet/L0/index/skilldata.json -> skilldata/skill/level/chi (distinct_values 11, numeric_range [0,100]); reference/extracted/skilldata.xml:1638-1649 (Mass Shadow Clone, id 1055)`
- **KILLS this line:** "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."
- **Lane impact:** L2: chi is an absolute integer pool that grows with level (BattleUI.as:252-256 prints chi + '/' + maxchi; frames show 26/26 and 47/47), starting 10/10 with regen +maxchi/10 per tick. 'Single-digit vs fabricated-100-meter' is the wrong axis — config's 30/25/10 is wrong for a different reason than the ledger gives.

### `[[skills-meters/crit-is-deterministic]]` — UPHELD [A2] (6 critics)

Ledger blocker ⑤ is dead: crit is not a proc at all — it fires on the exact equality reload == maxreload and costs the whole meter, in the shipped web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (getDamage) and :3295-3298 (deductReloadBar zeroes a full meter)`
- **KILLS this line:** "⑤ crit proc rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5 (COMBAT CORE): removes the crit-chance RNG question entirely — no roll, no seed, no variance. L2: the meter is the crit resource, so Focus/crit are one system not two.

### `[[skills-meters/crit-is-deterministic-at-full-reload-bar]]` — UPHELD [A2] (2 critics)

The crit proc rule is NOT missing. Criticals are deterministic, not a chance roll: a slash crits exactly when the reload/Focus bar is full (reload == maxreload). WEB v0.717 multiplies by a flat 1.3 and adds the gear stat STAT_CRITICALDMG; ANDROID v0.682 retuned this to x1.5 in Light Stance and x1.2 in every other stance. The UI confirms it — the 'Critical Hit' text is bound to the reload bar being at 100%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3275 (web v0.717); reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215-3222 (android v0.682); reference/decompiled/shs3_android/scripts/BattleUI.as:262 and :102; docs/gauntlet/L0/index/strings.json["175"]`
- **Build:** both
- **KILLS this line:** "⑤ crit proc rule (chance vs deterministic) — entirely absent. [REBUILDREADINESS.md:195]"
- **Lane impact:** L5 combat-core and skills-meters — closes ledger blocker ⑤ outright. Crit is a skill-expression mechanic, not RNG: hold the Focus bar at max and your next slash crits. Port the WEB value x1.3 flat; the ledger's existing 'crit = 1.3× formula' (REBUILD_READINESS.md:194) was RIGHT and must not be overturned. Also gives the Focus meter its purpose, which the ledger had as a blocker.

### `[[skills-meters/focus-fill-rate-plus-one-per-frame]]` — UPHELD [A2] (2 critics)

The Focus/reload meter fills at exactly +1 per frame while below max, so 0 -> crit-ready is 192 frames = 8 s and 48 (bar first becomes visible) -> full is 144 frames = 6 s; the 48+SPD*6 value passed into the actor is dead code, assigned and never read.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1203-1205 (fill); §1t99s0§.as:103 and :191 are the only two occurrences of §1t4419s0§ (the 48+SPD*6 seed) in the file; seed source at §1t4906s0§.as:53`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: closes the 'fill' third of blocker ③, which the survey left unstated. Crucially the fill is FLAT — SPD does NOT speed up the crit meter in v0.717, even though the engine computes a SPD-scaled seed (48+SPD*6) and passes it in. Anyone who wires that seed as the fill rate ships a stat effect the original does not have.

### `[[skills-meters/kunai-chi-is-a-phantom]]` — UPHELD [A2] (6 critics)

The ledger's 'Kunai chi' blocker names a cost that does not exist: Throw Kunai and Lay Trap have an empty <chi> element (cost 0) and spend an ammo counter, stat id 2501, instead.

- **Cite:** `reference/extracted/skilldata.xml:355 and :900; reference/decompiled/shs3_android_payload/scripts/SkillManager.as:252-259`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: kunai/trap skills must be wired to an ammo stat (2501), not to the chi pool; the shipped card copy confirms it in words ('Throws a kunai.\n\nRequires kunai ammo.').

### `[[skills-meters/ledger-decimals-are-display-artefacts]]` — UPHELD [A2] (6 critics)

The ledger's 4.96 / 9.92 / 8.92 cooldowns are not contract values — they are one reader's SPD applied to the raw integers 5 / 10 / 9, and under the web formula that reader's SPD was 6-10.

- **Cite:** `reference/extracted/skilldata.xml:1292/1299/1306 (Chi Punch cd 5) and :295/302/309 (Focus cd 10/9/8), run through §1t1523s0§.as:2289-2296`
- **KILLS this line:** "Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s)"
- **Lane impact:** L2: config must encode the integers 5/10/9 and compute the display, not hard-code the decimals. Also shows the ledger truncated Focus to two levels — it has three (cd 8 at L3).

### `[[skills-meters/maxreload-is-192]]` — UPHELD [A2] (2 critics)

The reload/Focus meter's maximum is 192 frames (8 s) — 'this.§1t4415s0§ = 8 * 24;' — and it is the ONLY assignment of maxreload in the web bundle, so the usable range above the 48-frame dead zone is 144 frames (6 s) and a stance switch costs one-third of it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (assignment) with :95 (declaration) and :3323 (clamp); contrast :55 '§1t12234s0§:int = 5 * 24' -> §1t4440s0§ at :147/:266/:1244-1246`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 (SKILLS + METERS): this is what actually closes the 'max' third of blocker ③. Config must encode MAX_RELOAD = 192 frames, DEAD_ZONE = 48, usable = 144. The surveyed value (120) would run the crit meter 60% fast and price a stance switch at 2x its real cost. L5 inherits the tempo: 8 s from empty to a guaranteed crit.

### `[[skills-meters/maxreload-is-192-not-120]]` — UPHELD [A2] (2 critics)

The web v0.717 Focus/reload meter maxes at 8*24 = 192 frames (8.00 s), of which the first 48 frames render as a zero-width bar, leaving exactly 6.000 s of visible travel — which is what the frame-derived fill measurement has been reporting all along.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (inside §1t4443s0§, declared :183) with §1t113s0§.as:328; corroborated by docs/research/fidelity/COMBAT_MEASUREMENTS.md:101 and rows f-5/f-6 (:589-590)`
- **KILLS this line:** "Focus empty→full ≈ 5.9 s (268 px ÷ 45.5 px/s) … rate MEASURED; total INFERRED — the observed ramps only span 0→49 % of the track, so the full time extrapolates a constant rate; no full-fill or consumption event was captured"
- **Lane impact:** L2: this UPGRADES COMBAT_MEASUREMENTS f-6 from 'total INFERRED' to CONTRACT — the extrapolation was right and no longer needs to be an extrapolation. Config: RELOAD_MAX = 192 frames, dead zone 48, usable 144, stance switch 48 = one third of usable (not two thirds). Also the standing rule to carry: the frame and the web code agree here and both refute a doc-derived number, so cite the code AND the measurement together.

### `[[skills-meters/shunpo-effect]]` — UPHELD [A2] (6 critics)

Ledger blocker ② is half closed: Shunpo is the Light-stance capstone at mastery 10, costs 50 chi on a 60s cooldown, and is a hold-to-charge damage skill — but its 250px/3s teleport geometry is Android-only and I will not promote it to web fact.

- **Cite:** `reference/extracted/skilldata.xml:1234-1246 with strings 6082/6085; Android-only mechanics at shs3_android_payload/scripts/MCSPlayer.as:1705-1706, 1747-1753`
- **KILLS this line:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** L2: gating, cost, cooldown and the charge-to-increase-damage rule are codeable now; the 250 px flash-step and 3s charge window need a web-bundle cross-check first, because the crit/stance/SPD constants all diverge between builds. The ledger's negative half (no spacebar slow-mo) stands — there is no slow-motion in any Shunpo path in either bundle.

### `[[skills-meters/slashusage-is-weapon-derived]]` — UPHELD [A2] (2 critics)

slashUsage — the multiplicand in the whole Focus-spend model — is read off the equipped weapon with a hard floor of 48, and itemdata carries 106 <slashusage> rows.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2350-2358 (param 11 of the init call at :2268); reference/extracted/itemdata.xml:8044`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2/L10: this is the number that makes the meter simulable and the survey left it an opaque symbol. With max 192 / usable 144 and a 72-usage weapon: Light slash = 36, Balanced = 72, Heavy = 108 focus. Weapon choice therefore controls crit cadence — a cross-lane hook into items-equipment that no lane has claimed.

### `[[skills-meters/spd-cooldown-cap-600]]` — UPHELD [A2] (6 critics)

Ledger blocker ④ is dead — and the cap is 600, not the 300 that the readable Android build shows: web cooldownModifier = 1 - min(SPD,600)/600 x 0.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296; call chain via §1t105s0§.as:297-318 (XMLSkill.getCooldown)`
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2: cooldown pipeline is XML seconds -> x24 frames -> x SPD modifier -> /24 -> 2dp for display. Also corrects the previous (UNVERIFIED) L0 survey, which banked the Android cap of 300.

### `[[skills-meters/string-table-resolves-all-73]]` — UPHELD [A2] (6 critics)

GAUNTLET §2.1's string-table blocker is dead for this system: all 73 skills that carry a <displayname> resolve, with 0 misses, and their descriptions come with them.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> skilldata.xml -> misses: 0, rows_resolved: 73, miss_sample: []; source blob reference/extracted/android/118_Mobile_Lang_EN.bin`
- **KILLS this line:** "### skills-meters — 33"
- **Lane impact:** L1b is DONE for L2 — the lane's blocking dependency ('needs L1b for names') is satisfied. Caveat that survives: the table is the ANDROID one, it is not identical to the web build's (web string 960 is absent from it), and some phrasing is touch-specific ('Hold down the skill icon'); label ported UI copy as Android-sourced. This also corrects the previous UNVERIFIED survey, which graded the table PARTIAL and said it was 'not on disk here'.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[actionscript/build-divergence-7-cooldown-cap]]` — NOT-UPHELD [A2] (2 critics)

A seventh combat-tuning divergence the build-divergence claim missed: the SPEED-to-skill-cooldown clamp is 300 in Android v0.682 but 600 in web v0.717. Both give a 50% maximum cooldown reduction and both apply the SPEED buff x1.5 before the clamp, so only the cap constant moved — but it halves the effective value of SPEED for cooldowns in the build this project targets.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2295 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
- **Build:** both
- **aimed at this line, which SURVIVES:** "SPEED 300 is the cooldown cap"
- **Lane impact:** L-skills-meters / L-progression: any SPEED-scaling CONTRACT must be tagged per build; add this row to the build-divergence table before any of it is marked CONTRACT.

### `[[hunter/skillui-gesture-input-mode]]` — NOT-UPHELD [A2] (2 critics)

A gesture-drawn skill input mode exists in both builds and no claim mentions it: an 8-node pad (node0..node7) where the stroke's crossing order concatenates into a skill string, with green/red circle status art, per-node 4-frame states, clear / doSkill / close buttons, and the fighter posing per node crossed. It is vestigial in the shipped builds (only the invalid case '012' and one wired case '345'), but it is a whole input surface and a whole render surface absent from all 12 ledger systems.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillUI.as:6-58, :75, :117-183 · reference/decompiled/shs3_payload/scripts/§1t6980s0§.as:61-193`
- **Build:** both
- **Lane impact:** L-ui-hud and L-skills-meters: an undocumented input surface. PARTIAL because the skill-string vocabulary is stubbed in both builds, so what a completed gesture would have done is not recoverable from code.

### `[[skills-meters/43-sfx-event-names-in-web-bundle]]` — NOT-UPHELD [A2] (2 critics)

The web bundle names 43 distinct SFX events, not one — the audio EVENT VOCABULARY is fully held even though the waveforms stay CWS-encrypted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ — 43 unique "Snd_*" string literals; call sites incl. §1t113s0§.as:352, §1t5045s0§.as:1263, §1t24s0§.as:849, §1t406s0§.as:1226/1245/1264/1289, §1t99s0§.as:3379/3386`
- **aimed at this line, which SURVIVES:** "### skills-meters — 33"
- **Lane impact:** L7 (AUDIO): 43 synth targets with named triggers — three slash variants, three death variants, deflect vs hitMetal as separate impacts, Snd_smokebomb tied to skill 1010, Snd_jump reused for both dodge paths. Stage-0b S0-5 still holds for waveforms; it never covered the event table.

### `[[skills-meters/focus-skill-web-effect]]` — NOT-UPHELD [A2] (2 critics)

The 'Focus' skill (id 1005, the ledger's 'Replenish Focus') sets reload to maxreload - 1 in the WEB build — one frame short of crit, deliberately.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:230-231, with the id at §1t120s0§.as:18`
- **aimed at this line, which SURVIVES:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: the survey had this only from Android (SkillManager.as:218-219); here is the web cite, so it is v0.717 fact. Design consequence worth stating: the skill never grants the crit itself — it puts you one frame away, so a crit always costs one more tick of natural refill. Note also the string table names skill 1005 simply 'Focus', not 'Replenish Focus'.

### `[[skills-meters/skill-animation-data-is-plain-xml]]` — NOT-UPHELD [A2] (2 critics)

reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin is unencrypted plain XML holding 50 named skill animations with full skeletal keyframes — it was never opened.

- **Cite:** `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin (opened this session; 338,096 bytes, UTF-8 with BOM; 50 <anim>, 547 <f>, 8,351 <n>, 19 distinct bone ids)`
- **aimed at this line, which SURVIVES:** "### skills-meters — 33"
- **Lane impact:** L6 (ART/ANIM): every skill animation in the game is transcribable to config today — bone id, x, y, rotation, per frame. The `d=` attribute equals the frame count in every anim checked, so durations are held too. Two-actor moves (backthrow/backthrow_victim, kneegroin/kneegroin_victim) confirm paired-animation grabs exist. Caveat: this is the Android blob; the web equivalent should be diffed, but the XML-vs-AS3 rule says data blobs port.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-5-skill-1500-reversed-1501-dual]]` — UPHELD [A2] (1 critic)

Skill 1500 is REVERSED-stance mastery and 1501 is DUAL-stance mastery — a direct functional identification, in both builds, replacing the positional inference NF-category-11 had to rely on. Any npcdata row whose skills carry 1500 at any level spawns in REVERSED_STANCE; 1501 spawns DUAL_STANCE; only if neither is present does the actor pick a stance from the light/balanced/heavy mastery comparison. The two extra stances are therefore real and NPC-only in the data (npcdata carries 1500 on 5 rows and 1501 on 2, all ai 29 = EnemyElite), and their combat identity is settled even though their display NAMES remain unheld (1500/1501 have no string-table entry — resolved_names resolves 73 of 75 skilldata rows and these are the two misses).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:836-843`
- **Build:** both
- **Lane impact:** L-skills-meters + L-enemies-ai: upgrades NF-category-11-decoded from PARTIAL to functionally HELD. Both extra stances take the flat Heavy multiplier in getDamage (×1.4 web / ×1.5 android) and REVERSED groups with BALANCED for reload cost while DUAL groups with HEAVY (×1.5 slashUsage).

### `[[NF-18-full-skill-prerequisite-dag-unenumerated]]` — UPHELD [A2] (1 critic)

skilldata.xml carries the complete skill-tree unlock graph as 52 <req><has><id>N</id><qty>Q</qty></has></req> edges, and no claim in the packet enumerates it as a structure. The edges split three ways: 24 element-stat gates (6 per element on ids 28/29/30/31 at qty 10/30/60), 12 stance-mastery gates (4 per stance on ids 1000/1001/1002 at qty 3/4/5/10), and 16 skill-to-skill chain edges forming the Chi and Ninja ladders (1042->1005, 1005->1006, 1006->1043, 1043->1044, 1044->1045, 1045->1046, 1046->1047; 1007->1024, 1024->1010, 1051->1052, 1052->1053, 1053->1054, 1054->1012, 1012->1055).

- **Cite:** `reference/extracted/skilldata.xml — my own extraction of all 52 <req><has> edges; StatsManager.as:4152-4177 (checkConditions, comp defaults to 'gte')`
- **Build:** android v0.682 (skilldata byte-identical to web v0.717)
- **Lane impact:** L10 progression and L2 skills-meters — the entire unlock DAG is portable as data today, with no research left. Combined with the <required> SP column and the <lvlreq> ladder, the whole skill-tree economy (what unlocks what, at which character level, for how many SP) is fully specified. Nothing in the 12-system ledger currently holds this graph.

### `[[NF-2-crittext-gated-on-full-reload-bar]]` — UPHELD [A2] (1 critic)

The on-screen 'Critical Hit' label is a pure function of the reload bar being at 100%: BattleUI.updateReload sets crittext.visible = percentage >= 1 && reloadbar.visible, and the text is LangManager.getString(175) = 'Critical Hit'. This is the HUD half of the crit rule and gives a cheap A1 verification target for a future frame pass.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:262 and :102; docs/gauntlet/L0/index/strings.json["175"]`
- **Build:** android v0.682
- **Lane impact:** L8 ui-hud — the crit indicator is a discrete label above the reload bar, not a floating popup, and it appears the instant the bar fills rather than on hit. L2 skills-meters corroboration for NF-1.

### `[[android-blobs/data-xml-parity-proofs-are-circular]]` — UPHELD [A3] (2 critics)

The banked 'Android blob and web v0.717 XML are byte-identical, so the parity caveat is discharged' proof is CIRCULAR: reference/extracted/{item,skill,npc,quest}data.xml ARE the Android blobs with the XML prolog stripped, and the web payload holds no such root at all.

- **Cite:** `diff reference/extracted/skilldata.xml reference/extracted/android/117_Mobile_SkillData.bin (exit 1); same shape for itemdata.xml/111_Mobile_ItemData.bin, npcdata.xml/125_Mobile_NpcData.bin, questdata.xml/116_Mobile_QuestData.bin`
- **Build:** android v0.682
- **Lane impact:** L2 skills-meters, L3 items-equipment, L4 enemies-ai, L-quests-story. CONTRADICTS the banked claim skilldata/android-web-byte-identical ('...which discharges the S0-3 parity NOT established caveat for this unit'). There is no web v0.717 skilldata.xml — comparing a file to itself proves nothing. I explicitly do NOT dispute itemdata/web-android-schema-parity (two AS3 parser classes, a real cross-build comparison) or world-exploration/21-of-27-blobs-are-cross-build-identical (27 web bindata vs android, also real). The S0-3 caveat stands undischarged for questdata/itemdata/skilldata/npcdata.

### `[[cite04/bar-equals-stance-gate-is-web-only]]` — UPHELD [A2] (1 critic)

The identity 'the Focus bar reads zero exactly when the stance change is refused' is a WEB-ONLY property and is an eighth android-vs-web divergence row. Web v0.717 uses a hard 48 in three places - the bar's render dead zone, the canChangeStance predicate and the nextStance early-return. Android v0.682 uses 24 for the bar's dead zone but gates nextStance at maxreload/6 = 20 of 120, so on android the bar can read zero while the stance change is still legal (reload 20-23) and vice versa. A recreation that ports the android numbers will produce a HUD that lies about the gate.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050, :3060; reference/decompiled/shs3_android/scripts/MCSPlayer.as:1163, :1168, :2977`
- **Build:** both — 48/48/48 on web v0.717, 24/20 on android v0.682
- **Lane impact:** L-ui-hud and L-skills-meters: one predicate, value 48, drives the bar fill, the stance gate and the CANNOT CHANGE STANCE label in v0.717. Add as a build-divergence row.

### `[[hunter/traps-cost-one-kunai-not-four]]` — UPHELD [A2] (1 critic)

CORRECTION to the packet's two ammo findings: all five trap skills (Lay Trap 1024 plus the four Element Traps 1025-1028) cost exactly ONE unit of kunai ammo, the same as a kunai throw. The '/4' that both findings read as a trap cost belongs solely to SKILL_WINDMILL — skill 1051 'Windmill Shuriken', a ninja-tree skill gated on Smoke Bomb, whose own in-game description says 'Uses 4 kunai.'

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillManager.as:467-479 + reference/decompiled/shs3_payload/scripts/§1t120s0§.as:503-514 + reference/decompiled/shs3_android_payload/scripts/SkillSlotButton.as:118-120 and :170-172 + reference/extracted/skilldata.xml (skill 1051 displayname/desc via docs/gauntlet/L0/index/strings.json)`
- **Build:** both
- **Lane impact:** skills-meters + rebirth-elements: the elemental kit's ammo economy is 1 per cast across kunai AND traps. Coding traps at 4 would quarter the player's elemental uptime.

### `[[hunter/web-only-skills-1074-1077]]` — UPHELD [A2] (1 critic)

The WEB v0.717 SkillManager defines four skill ids — 1074, 1075, 1076, 1077 — that exist NOWHERE else: no row in skilldata.xml's 75 skills, and no constant in the android v0.682 SkillManager. Skill 1077 is a live case in the web dispatcher and costs 8 units of kunai ammo (stat 2501), the only 8-cost in either build. These are four web-build skills the data XML never describes, and they are the reason the 'kunai 1/4/8 ladder' reading of the ammo costs is wrong.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:108, :110, :112, :114 and :344-351; contrast reference/decompiled/shs3_android/scripts/SkillManager.as (50 SKILL_* constants, none >= 1074) and reference/extracted/skilldata.xml (75 <skill> rows, max id below 1074)`
- **Build:** web v0.717
- **Lane impact:** skills-meters + the L0 survey method: skilldata.xml is NOT a complete inventory of the web build's skills. Any lane treating '75 skills' as the closed set will miss four. Whoever greps §1t120s0§.as next should resolve what 1074-1077 do — the -8 ammo cost suggests a heavier thrown-weapon tier.

### `[[kh-1500-1501-are-reversed-and-dual-stance]]` — UPHELD [A2] (1 critic)

The two unnamed category-11 skills, 1500 and 1501, are named by CODE even though neither carries a <displayname> or a string-table entry: EnemyPlayer.init() reads them as masteries and uses them to set the stance. 1500 = REVERSED_STANCE (reversed grip), 1501 = DUAL_STANCE (dual wield). This settles the two extra stances far more directly than any category or positional argument. The same block also holds an unbanked enemy-behaviour rule: with neither flag set, the enemy's stance is the argmax of light/balanced/heavy mastery, and a uniform random pick among the three when all are equal.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:836-859`
- **Build:** both
- **Lane impact:** L-skills-meters + L-enemies-ai: the two boss-only extra stances are now code-held, not inferred, and their skill ids are fixed at 1500/1501. Their DISPLAY names remain genuinely unheld (no string entry exists), which is the honest STILL_UNHELD residue. The stance-selection rule is new to every ledger system.

### `[[npcdata-category11-grant-census-corrected]]` — UPHELD [A2] (1 critic)

Corrected grant census for the category-11 (NPC-only) skills in npcdata.xml, replacing the numbers in NF-11-category-11-skills-are-in-npcdata. Measured by raw occurrence of `<skill><id>NNNN</id><lvl>` over the whole file: 1500 (Reversed-stance mastery) 5 rows at lines 3662, 3683, 3898, 4290, 4349, all <lvl>3</lvl>; 1501 (Dual-stance mastery) 2 rows at 3934, 3956, both <lvl>3</lvl>; 1064 4 rows (3898, 3934, 3956, 4290); 1065 4 rows (same four); 1066 1 row (3879); 1067 1 row (3879); 1068 (SkillManager.SKILL_UNDYING) 2 rows — 3934 at <lvl>1</lvl> and 4349 at <lvl>2</lvl>. Category 11 holds exactly seven skilldata rows: 1064, 1065, 1066, 1067, 1068, 1500, 1501. The encoding point stands: npcdata nests these as `<skill><id>N</id><lvl>N</lvl></skill>`, which is why a `<skill>NNNN</skill>` grep finds nothing.

- **Cite:** `reference/extracted/npcdata.xml:3662, :3683, :3879, :3898, :3934, :3956, :4290, :4349 + reference/extracted/skilldata.xml (category-11 rows) + reference/decompiled/shs3_android/scripts/SkillManager.as:96`
- **Build:** android v0.682
- **Lane impact:** L2 skills-meters / L2 enemies-ai: replaces a peer claim's overstated census. Anyone sizing the elite-enemy skill grants from the old numbers would over-provision 1064/1065 by 25%, 1066/1067 by 100% and 1068 by 150%.

### `[[skilldata/category-to-tree-names]]` — UPHELD [A2] (2 critics)

The bare integer <category> resolves 1:1 to a ten-tab skill screen — Light/Balanced/Heavy Stance, Chi, Survival, Ninja, Fire, Water, Wind, Earth — with <order> giving the within-tab row position; category 11 alone has no header string because it is not a player tab.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 6024-6033, cross-checked against the <category> value of all 75 rows in reference/extracted/skilldata.xml`
- **Lane impact:** ui-hud — the skill screen's tab set, tab copy and ordering key are now fully specified; skills-meters; progression.

### `[[skilldata/skill-1077-missing-from-extract]]` — UPHELD [A2] (1 critic)

Skill id 1077 is live in the shipped web bundle — it has a cast branch that spends 8 kunai ammo — but has no <skill> block anywhere in reference/extracted/skilldata.xml. Either the extract is short a row or the id is dead code.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:114 and :344-351, against reference/extracted/skilldata.xml (75 <skill> blocks, none with <id>1077</id>)`
- **Build:** web v0.717
- **Lane impact:** skills-meters: the verified count '75 <skill>' in skilldata.xml is not the full shipped skill roster. Any lane treating skilldata.xml as the closed set of skills needs this caveat.

### `[[skills-meters/baseReload-is-a-dead-stat]]` — UPHELD [A2] (1 critic)

SPD does NOT accelerate the Focus meter: getBaseReload() = 48 + SPD*6 is computed, passed into the player and stored, then never read anywhere in either bundle — the meter fills at a flat +1 per tick.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :191, :1203-1205 (grep over the whole web bundle returns only :103 and :191 for §1t4419s0§); reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1839-1842 and MCSPlayer.as:105/:182/:190`
- **Lane impact:** L2: do not wire SPD to meter fill in config — fill is a constant +1/frame regardless of stats, so empty->full is always 8.000 s. This also independently corroborates COMBAT_MEASUREMENTS f-5 ('fills PASSIVELY and LINEARLY with time … no event-driven jumps') against gap-F's 'charge begins on holding the slash input': the web code has no input term in the charge path at all. L5 should re-open gap-F on that basis.

### `[[skills-meters/basereload-is-48-plus-spd6]]` — UPHELD [A2] (1 critic)

Param 7 of the player init is baseReload = 48 + SPD*6 — a field distinct from maxreload, and the likely source of the survey's 120/192 confusion.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2274-2276 -> §1t99s0§.as:183/191; Android name at StatsManager.as:1839-1841 / MCSPlayer.as:182`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: the meter system has THREE reload-family numbers, not one — baseReload (48 + SPD*6, param 7), maxreload (192, hard-coded), and the 48-frame dead zone. Any config that collapses them will mis-simulate. The Android parameter names at MCSPlayer.as:182 are the Rosetta stone for the whole obfuscated web init signature and should be banked for every downstream lane.

### `[[skills-meters/blank-cells-are-passives-plus-two-npc-rows]]` — UPHELD [A2] (1 critic)

101 of 182 <chi> cells and 84 of 182 <cooldown> cells in skilldata.xml are literally empty; every empty-cooldown row belongs to a <passive>1</passive> skill except exactly two NPC-only rows, ids 1500 and 1501.

- **Cite:** `reference/extracted/skilldata.xml — per-skill blank scan run this session; short-circuit at reference/decompiled/shs3_payload/scripts/§1t105s0§.as:299-303 and :276-284`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: a transcription script must treat an empty cell as a semantic 0, not as missing data, or it will report 84 phantom gaps. It also gives an independent confirmation of the survey's category-11 finding: 1500/1501 are the only non-passive rows in the file with no cooldown, consistent with them being enemy moveset entries that belong to L4, not L2.

### `[[skills-meters/cooldowns-are-not-all-integers]]` — UPHELD [A2] (1 critic)

Cooldown is not an integer field — the domain includes 3.5 — so the survey's 'config must encode the integers' guidance would truncate a real value.

- **Cite:** `docs/gauntlet/L0/index/skilldata.json -> skilldata/skill/level/cooldown (count 182, distinct_values 14, numeric_range [2.0, 70.0], sample_values include '3.5')`
- **Lane impact:** L2: the config cooldown field must be Number, not int. Note the pipeline still truncates downstream — §1t105s0§.as:297 is declared ': int', so 3.5 s becomes int(3.5*24*mod) frames — but the source value itself must survive transcription intact.

### `[[skills-meters/crit-mult-is-1.3-ledger-vindicated]]` — UPHELD [A2] (6 critics)

The ledger's CRIT_MULT=1.3 is CORRECT for the shipped web build v0.717 — and the previous UNVERIFIED L0 survey was wrong to overturn it, because it read the Android build (which was retuned to 1.5 Light / 1.2 other).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 (web getDamage), vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3219-3221 (android)`
- **KILLS this line:** "crit = 1.3× formula."
- **Lane impact:** L5: keep CRIT_MULT=1.3, flat across stances, plus an ADDITIVE gear term STAT_CRITICALDMG (stat 204, gear-only via findBonusStat). Coding the previous survey's 1.5/1.2 would have mistuned every critical hit in the game.

### `[[skills-meters/damage-roll-still-uses-rng]]` — UPHELD [A2] (1 critic)

Only the crit trigger is deterministic — base damage is still a random roll every swing, so the lane_impact phrase 'no roll, no seed, no variance' is misleading.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258 and :3281`
- **KILLS this line:** "⑤ crit proc rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5: the crit-chance RNG question is closed, but Sim still needs the injected mulberry32 stream for the per-swing damage roll. Read literally the survey's lane_impact invites dropping it.

### `[[skills-meters/dual-reversed-swapped]]` — UPHELD [A2] (1 critic)

The two off-stances are inverted in the survey: Reversed gets reach x1.4 and Dual gets x1.0 floored at 100, not the other way round.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:27-35 and :3066-3081, matched to reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35 and :3130-3145`
- **Lane impact:** L5/L2: config must map stance 3 = Dual (reach x1.0 floored 100, slash cost x1.5, damage x1.4) and stance 4 = Reversed (reach x1.4, slash cost x1.0, damage x1.4). The same inversion sits in the slash-cost buckets at §1t99s0§.as:3305/:3309. Also useful: the obfuscated web class declares the five constants in the same order with the same values as the named Android class, so the Android names are a safe decoder ring for stance ids specifically.

### `[[skills-meters/frame-cracks-web-string-960]]` — UPHELD [A1] (6 critics)

A1 cracks a web-only string the recovered table does not contain: string 960 = 'CANNOT CHANGE STANCE', rendered light-grey in the empty focus bar.

- **Cite:** `reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png — crop (60,880)-(1020,1080) upscaled 3x Lanczos; paired with reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111`
- **KILLS this line:** "### skills-meters — 33"
- **Lane impact:** L2/L8: one text field, three states of the same bar (empty = refusal caption grey #BBBBBB, partial = hidden, full = crit caption black #000000). The frame renders ALL CAPS while table row 175 is 'Critical Hit' — the field uppercases, so THE FRAME WINS: ship the caps. Bonus for L7: §1t113s0§.as:352 fires a named SFX event 'Snd_criticalDamage' on the same transition.

### `[[skills-meters/frame-crit-appears-at-exactly-full]]` — UPHELD [A1] (6 critics)

A1, measured: the crit caption is absent when the third bar reads 98.0% full and present when it reads 100% — the on-screen proof that crit is an exactly-full equality, not a probability.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — crops (640,0)-(1800,390) and (640,390)-(1800,780), each upscaled 2x Lanczos; fill widths then measured in the original`
- **KILLS this line:** "⑤ crit proc rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2's done-condition 'meters on-screen match A1' now has its reference measurement. Frame and payload agree here; had they disagreed the frame would win.

### `[[skills-meters/full-focus-negates-a-hit]]` — UPHELD [A2] (1 critic)

A full Focus meter buys evasion in the web build: with reload == maxreload and the current stance's ultimate skill owned, an incoming attack is fully negated with 12 frames of immunity.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3383-3388 (duplicated at §1t4909s0§.as:74 and :311); skill ids at §1t120s0§.as:108-112`
- **KILLS this line:** "### skills-meters — 33"
- **Lane impact:** L2/L5: directly contradicts the survey's 'Roll is what buys evasion, not Focus' and restores project memory's 'Focus buys evasion' as at least half right. PARTIAL because ids 1074/1075/1076 do NOT exist in skilldata.xml (real ids stop at 1068, then 1500/1501), so getStat on them likely returns 0 and the branch may be unreachable in shipped data — verify before coding, do not delete.

### `[[skills-meters/full-meter-buys-evasion-web-only]]` — UPHELD [A2] (1 critic)

A full Focus meter DOES buy evasion in v0.717: owning skill 1074/1075/1076 while in Light/Balanced/Heavy negates an incoming hit outright when reload == maxreload — a mechanic absent from the Android build and from every ledger system.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3383-3388 (inside the take-damage override §1t3274s0§ at :3328), duplicated at :3707; no Android equivalent`
- **KILLS this line:** "⑤ crit proc rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2/L5: the full meter has FIVE consequences, not four — crit ×1.3, zeroed on the next slash, the 'CRITICAL HIT' caption, Snd_criticalDamage, and this per-stance auto-evade with 12 frames of invulnerability. It also partly reinstates project memory's 'Focus buys evasion', which the survey moved to correct.

### `[[skills-meters/kunai-ammo-is-web-and-tiered]]` — UPHELD [A2] (1 critic)

The kunai ammo stat 2501 is present in the WEB v0.717 bundle, and skills spend 1, 4 or 8 ammo — the 8-cost tier does not exist in the Android build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:266-270, :319-323, :347-351 and §1t5184s0§.as:109-113; vs reference/decompiled/shs3_android_payload/scripts/SkillManager.as:254/259, 308/313, 474/479`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2/L8: the ammo mechanic needs no Android caveat — cite the web bundle. Costs are tiered 1/4/8, and the hotbar slot renders floor(ammo/4) for the 4-cost skill, so the HUD shows 'charges' not raw ammo. Android has no 8-cost case, one more datapoint that Android AS3 is a different tuning.

### `[[skills-meters/mastery-scale-differs-between-builds]]` — UPHELD [A2] (1 critic)

Mastery is on a 0-10 scale in the web build and a 0-100 scale in Android, and the Light multipliers differ outright. Web reach: Light x1.4 flat, Balanced (1 + 0.2 x m x 0.1), Heavy (0.5 + 0.4 x m x 0.1). Android reach: Light x1.5 flat, Balanced (1 + 0.5 x m x 0.01), Heavy (0.5 + 0.5 x m x 0.01). Any config seeded from the Android decompile will be wrong for v0.717 in both the multiplier and the stat scale.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116 against reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052`
- **Build:** both
- **Lane impact:** L2/L5: this is the third confirmed web-vs-Android tuning split in this packet (after maxreload 192 vs 120 and the stance gate 48 vs maxreload/6). It also explains the wiki's 300/200/100 exactly: Android mastery-0 multipliers 1.5/1.0/0.5 against a base of 200. Standing rule for the lane: quote the WEB class for any v0.717 combat number and use Android only to de-obfuscate the symbol.

### `[[skills-meters/maxreload-is-192-frames]]` — UPHELD [A2] (2 critics)

The web v0.717 crit/Focus meter holds 192 frames (8 s), not the 120 (5 s) the survey banked — 120 is the Android v0.682 value.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (only other assignment §1t4904s0§.as:77); Android at reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 (SKILLS + METERS): MAX_RELOAD = 192 frames; usable range after the 48-frame dead zone is 144 frames, not 72; a stance switch costs one third of the bar, not two-thirds. Coding 120 fills the crit bar 60% too fast — the single most visible timing error available in this lane.

### `[[skills-meters/only-83-level-rows-carry-a-number]]` — UPHELD [A2] (1 critic)

83 of the 182 skill level rows carry a digit, not 135; 52 of the resolved level descriptions are purely qualitative, including all 30 stance-mastery rows.

- **Cite:** `reference/extracted/skilldata.xml level <desc> ids joined to docs/gauntlet/L0/index/strings.json (my parse: 182 rows / 47 blank / 135 resolved / 83 containing a digit)`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — read skill cards in a preserved build."
- **Lane impact:** L2: the transcribable numeric surface is 83 rows, not 135. Crucially the mastery ladder carries no numbers at all in the card text, so the 0.9/1.2/1.4 and reach ceilings rest entirely on §1t99s0§.as — there is no second, independent source for them.

### `[[skills-meters/only-83-numeric-level-rows]]` — UPHELD [A2] (1 critic)

Only 83 of the 182 skill level rows carry a number in their effect string; 135 merely resolve, and the 30 stance-mastery rows carry no number at all.

- **Cite:** `reference/extracted/skilldata.xml <level><desc> joined to docs/gauntlet/L0/index/strings.json (my parse this session)`
- **Lane impact:** L2: the transcribable-with-numbers set is 83 rows, not 135. The 0.9/1.2/1.4 mastery ceiling is held ONLY by the AS3 (§1t99s0§.as:3262-3270) and never by card text, so the stance-damage claim is load-bearing rather than corroborated.

### `[[skills-meters/roll-cooldown-is-a-float]]` — UPHELD [A2] (1 critic)

At least one cooldown in skilldata.xml is not an integer: Roll (1004) level 2 is 3.5 seconds.

- **Cite:** `reference/extracted/skilldata.xml:264,271,278`
- **Lane impact:** L2: the config cooldown field must be a float. The survey's lane_impact 'config must encode the integers 5/10/9' is right for Chi Punch and Focus but would truncate Roll level 2 from 3.5s to 3s.

### `[[skills-meters/roll-cooldown-is-fractional]]` — UPHELD [A2] (1 critic)

At least one cooldown in skilldata.xml is fractional — Roll (1004) reads 4 / 3.5 / 3 — so the config field cannot be an integer.

- **Cite:** `reference/extracted/skilldata.xml:264, :271, :278; corroborated by docs/gauntlet/L0/index/skilldata.json cooldown distinct_values 14 with sample value "3.5"`
- **Lane impact:** L2: minor but concrete correction to the ledger-decimals claim's instruction that 'config must encode the integers 5/10/9' — the cooldown column is a float column. 3.5 s x 24 = 84 frames, so it is still frame-exact.

### `[[skills-meters/roll-dodge-is-75-85-95-in-web]]` — UPHELD [A2] (1 critic)

Roll's dodge chance in the shipped web build is 75/85/95 % — the Android card copy (60/80/100) and the Android code (80/85/90) both disagree with it, proving the recovered STRING TABLE is not web-true either.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3361-3381 (skill const §1t120s0§.§1t10127s0§ = 1004 at §1t120s0§.as:16); vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3302-3313; vs strings.json 7004/7005/7006`
- **Lane impact:** L2/L5: ship 75/85/95. Board-wide rule change — the standing 'Android XML is web-true, Android AS3 is not' needs a third line: the ANDROID STRING TABLE IS NOT WEB-TRUE EITHER. Any lane transcribing card copy from 118_Mobile_Lang_EN.bin as gameplay numbers must cross-check the web bundle first.

### `[[skills-meters/shunpo-damage-ignores-stance-and-crit-in-web]]` — UPHELD [A2] (1 critic)

Web Shunpo deals raw base damage × chargingTime/2, ignoring both the stance multiplier and the crit bonus — Android's uses the stance/crit-multiplied getDamage().

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1811 calling §1t4476s0§ (defined :3279-3282) vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:1752 calling getDamage() (defined :3198-3223); hit projectile web §1t8380s0§.as:19,:42`
- **KILLS this line:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the predecessor SHS2, not Duels)."
- **Lane impact:** L2/L5: Shunpo damage = (minDamage + rand*damageRange) * chargingTime / 2, capped by the 3 s (72-frame) charge window — so max ~= base x 36. Do NOT apply the Light x(0.5+0.04M) multiplier or the x1.3 crit to it. The Shunpo hit projectile is web class §1t8380s0§ (ttl 3, radius 250, LAUNCH_AIR, tagged LIGHT_STANCE).

### `[[skills-meters/skill-slot-base-is-web-sourced]]` — UPHELD [A2] (1 critic)

The 3-slot hotbar base is a web-build fact, not a string-table inference: getSkillSlotCount returns 3 + getStat(1008), and the Skill Slots+ skill's five levels read 4/5/6/7/8.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2742 (web) and reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2295 (android twin); reference/extracted/skilldata.xml skill 1008 level descs 7009-7013`
- **Lane impact:** L8/ui-hud blocker ④: the hotbar is 3 slots at start, 8 fully invested, and the constant is identical in both builds so it carries no Android caveat. The survey reached the right answer from an Android-labelled string; this gives it a web cite.

### `[[skills-meters/skill-vfx-anim-audio]]` — UPHELD [STILL_UNHELD] (6 critics)

Still unheld: nothing in this pass touches how a skill looks or sounds — cast poses, charge tells, hit sparks, screen-shake, the Shunpo streak, per-skill SFX.

- **Lane impact:** L6/L7: reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin is the likely home of the animation sets and is unopened; the audio resource blobs are CWS-encrypted (Stage-0b S0-5). One SFX EVENT NAME was recovered ('Snd_criticalDamage', §1t113s0§.as:352) — the event and its exact trigger are held, the waveform is not.

### `[[skills-meters/skilldata-byte-identical-across-builds]]` — UPHELD [A3] (6 critics)

Byte-check: the Android v0.682 skilldata blob is the web v0.717 skilldata.xml byte-for-byte across all 39,003 bytes, plus only a 40-byte XML declaration and one trailing CRLF — so every id, cost, cooldown, lvlreq, order, category and prerequisite edge in this survey is web-build fact.

- **Cite:** `byte comparison of reference/extracted/android/117_Mobile_SkillData.bin against reference/extracted/skilldata.xml (python3 prefix/suffix diff, run this session)`
- **KILLS this line:** "### skills-meters — 33"
- **Lane impact:** L2: kills the standing Stage-0b S0-3 caveat ('combat tuning parity is NOT established') for this system's DATA. It emphatically survives for this system's CODE — see the crit, stance and SPD-cap divergences. Rule for every downstream lane: Android XML is web-true, Android AS3 is not.

### `[[skills-meters/slashusage-is-a-weapon-stat]]` — UPHELD [A2] (2 critics)

The meter's slash cost is a per-weapon itemdata field floored at 48, with an effective domain of {48, 72, 96} — so Light slashes cost {24, 36, 48} frames against a 144-frame visible bar.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2350-2358; reference/extracted/itemdata.xml:8044; docs/gauntlet/L0/index/itemdata.json -> itemdata/item/slashusage (count 106, distinct_values 3, numeric_range [24,96], sample_values ['24','72','96'])`
- **Lane impact:** L2/L9: the crit economy is weapon-dependent and codeable today — slashUsage comes from the equipped weapon, is clamped up to 48, and is then scaled x0.5 (Light) / x1.0 (Balanced, Reversed) / x1.5 (Heavy, Dual). Cross-lane hand-off to items-equipment: 106 items carry the field and it takes only three values.

### `[[skills-meters/spd-dead-in-web-meter]]` — UPHELD [A2] (1 critic)

baseReload (48 + SPD*6) is passed into the web player and never read again — SPD has zero effect on the Focus/crit meter in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276; §1t99s0§.as:103,191; only other reference is the copy-constructor §1t4904s0§.as:49`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: do NOT port an SPD-scaled reload. Combined with the flat ++ fill and the flat 8*24 max, the meter is stat-independent; SPD touches only cooldowns (cap 600) and slash reach.

### `[[skills-meters/spd-does-not-touch-the-meter-in-web]]` — UPHELD [A2] (1 critic)

SPD has zero effect on the Focus/crit meter in v0.717: the 48 + SPD*6 base-reload value is computed and passed into the player but never read, and the meter fills a flat +1 per tick.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2274-2276 and §1t99s0§.as:103, :191, :1203-1205 (grep -rn '§1t4419s0§' over shs3_payload/scripts returns only those three sites plus §1t4904s0§.as:49)`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: do NOT port Android's SPD-scaled reload. Fill rate is a constant 1 frame per tick to a constant 192 ceiling; SPD only affects skill cooldowns (cap 600) and slash reach. This closes the 'fill' third of ledger blocker ③, which no claim in the survey addressed.

### `[[skills-meters/spd-inputs-are-buffable]]` — UPHELD [A2] (1 critic)

Both the SPD->cooldown modifier and the base slash length take SPD = getStat(9410) + bonus(9410), multiplied by 1.5 when speed-buff 9455 is active — a term both of the survey's formulas omit.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2286 (cooldown path) and :2334-2341 (slash-length path)`
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2/L5: the speed buff is not a separate cooldown multiplier — it inflates the SPD term BEFORE the 600 cap and before the reach asymptote, so it shortens cooldowns and lengthens reach at once, with diminishing returns near the cap. Two formulas in the survey need this term appended before they are coded.

### `[[skills-meters/speed-buff-premultiplies-spd]]` — UPHELD [A2] (1 critic)

The SPEED buff multiplies SPD by 1.5 BEFORE both the cooldown modifier and the base slash length are computed — so it silently moves the 600 cooldown cap and lengthens reach.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2287 (cooldown) and :2334-2341 (reach)`
- **KILLS this line:** "④ SPD→cooldown formula."
- **Lane impact:** L2/L5/L10: the '150% SPEED' food buff is not cosmetic — it shortens every skill cooldown AND extends slash reach through the same SPD term, and under it the 600 cap bites at SPD 400. The buff family is an else-if chain (§1t99s0§.as:209-223), so exactly one is ever active.

### `[[skills-meters/stab-is-a-passive-tree-node]]` — UPHELD [A2] (6 critics)

The Surface bullet survives contact with the payload intact: 'Stab' (id 1018) is Heavy category, prerequisite Heavy Stance Mastery 3, marked <passive>1</passive>, and canEquip() returns false for passives so it can never occupy a hotbar slot.

- **Cite:** `reference/extracted/skilldata.xml:721-727; reference/decompiled/shs3_android_payload/scripts/XMLSkill.as:345-348 and MCSPlayer.as:3147-3151`
- **KILLS this line:** ""Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill."
- **Lane impact:** L2: the full per-stance capability ladder falls out — Light 1014/1036/1015/1039-Shunpo, Balanced 1016/1037/1017/1040-Thousand-Stabs, Heavy 1018-Stab/1038/1019/1041-Deadly-Cleave at mastery 3/4/5/10. One disambiguation the ledger misses: Thousand Stabs (1040) is the BALANCED capstone, a different node from the Heavy canStab.

### `[[skills-meters/ultimates-and-elemental-projectile-constants]]` — UPHELD [STILL_UNHELD] (6 critics)

Still unheld: 47 of 182 level rows resolve to an empty effect string, clustered on the three stance ultimates, Mass Shadow Clone, the four elemental AoEs' level rows, the eight elemental kunai/traps and both dashes — their damage is computed in projectile classes, not tabled.

- **Lane impact:** L2: this is now a TWO-step gap, not the one-step 'read 40 projectile files' a prior pass assumed — the ~40 *Projectile.as classes are Android, and this survey proves Android combat constants are retuned, so each must then be located in the obfuscated web bundle by constant-pattern grep (the method that found getDamage this pass). Four of the blanks are partly covered by their skill-level <desc> ('150% Fire ATK', Deadly Touch's '10 damage for each chi point').

### `[[skills-meters/web-kunai-ammo-gate-1-4-8]]` — UPHELD [A2] (1 critic)

The kunai/trap ammo mechanic on stat 2501 is present in the WEB bundle, not just Android, and the web build has an 8-ammo cost tier that Android lacks.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:266,270,319,323,347,351; hotbar display at §1t5184s0§.as:113; android has only two tiers at SkillManager.as:254/259, 308/313, 474/479`
- **KILLS this line:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: the ammo mechanic can be promoted from Android-caveated to web-v0.717 fact, and needs three cost tiers (1/4/8) rather than the one the survey cites. The hotbar shows floor(ammo/4) for the 4-cost skill.

### `[[skills-meters/web-maxreload-is-192]]` — UPHELD [A2] (1 critic)

The web v0.717 Focus/crit meter maximum is 192 frames (8 seconds), not the 120 frames (5s) the survey banked; 120 is the Android value.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249; corroborated at §1t4904s0§.as:77; android reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239`
- **KILLS this line:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: encode MAX_RELOAD = 192 frames. Usable range is 192-48 = 144 frames, a stance switch (48) costs one-third of it, and with the flat ++ fill at §1t99s0§.as:1203-1205 a cold-to-crit cycle is 192 ticks = 8s at 24fps. Blocker ③ is still closed, but with different numbers than the survey reports.

### `[[skills-meters/web-only-skills-1074-1077]]` — UPHELD [A2] (1 critic)

skilldata.xml is NOT a complete inventory of v0.717: the web SkillManager declares four skill ids (1074, 1075, 1076, 1077) that exist in neither skilldata.xml nor the Android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:108-114, diffed against reference/decompiled/shs3_android_payload/scripts/SkillManager.as and reference/extracted/skilldata.xml (measured this session)`
- **Lane impact:** L2: the survey's headline ('the system is essentially solved on paper: 75 skills') is 4 short, and those 4 have runtime behaviour but no data row and no name string. Also caps the byte-identity claim: skilldata.xml being byte-identical proves what IS in it is web-true, not that it is exhaustive.

### `[[skills/traps-cost-one-kunai-ammo]]` — UPHELD [A2] (1 critic)

Lay Trap and all four elemental Element Traps deduct exactly ONE unit of kunai ammo (stat 2501), not four. The four-kunai cost belongs to Windmill Shuriken (skill 1051) alone, which says so in its own shipped description.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:503-514 (web v0.717) + reference/decompiled/shs3_android/scripts/SkillManager.as:468, :474, :479`
- **Build:** both
- **Lane impact:** skills-meters + economy: the kunai-ammo curve is flat at 1 for every kunai and every trap; only Windmill Shuriken (4) and skill 1077 (8) cost more. Two claims in this packet got this backwards and nobody cites this block.

### `[[string-table/no-chi-cost-or-cooldown-numbers-in-prose]]` — UPHELD [STILL_UNHELD] (2 critics)

The string table contains NO Chi cost and NO cooldown number for any skill: the 7000-block gives per-level effects only (7067 is literally the words 'Reduced cooldown' with no number) and 167/647/648 are bare labels — the values live in skilldata.xml's <chi>/<cooldown> tags, so this source cannot close skills-meters blocker ①.

- **Build:** android v0.682
- **Lane impact:** skills-meters — blocker ① stands as written from this source; I pattern-hunted every %, digit, 'sec', 'chi', 'cooldown' and 'per' in all 2,555 records and found no cost or cooldown value.

### `[[string-table/target-mode-strings-161-166-are-dead]]` — UPHELD [A2] (1 critic)

The six 'Target: ...' strings (161-166) are dead design copy, not a shipped skill-card row: they have ZERO call sites in either build, skilldata carries no <target> tag, and the actual skill-card composer XMLSkill.as renders no targeting row at all — so there is no evidence of an ally-targeting branch in the skill schema.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:101,110,119,123,131,183,192,196,263 + grep of reference/decompiled/shs3_android and shs3_payload for getString(161..166) + reference/extracted/skilldata.xml`
- **Build:** both — checked in shs3_android v0.682 and shs3_payload v0.717
- **Lane impact:** skills-meters + ui-hud — refutes the headline of string-table/skill-card-field-set-six-target-modes and stops a phantom ally-targeting branch entering the skill model. It also supplies the CORRECT skill-card contract, which is a better artifact than the string list: field order comes from XMLSkill.getDescription, cooldown renders as toFixed(2) seconds, and chi cost and cooldown are read per level from skilldata.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
