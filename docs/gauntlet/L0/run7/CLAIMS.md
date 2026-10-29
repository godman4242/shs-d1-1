# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 19 critic reviews · 136 claims · 448 verdicts.

## unassigned — re-scored ?

### `NF-1/ledger-rebirth-25-is-code-sourced-not-film` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md contradicts itself on rebirth sourcing, and the fix is a re-tag, not a deletion: :165 claims 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' while :205 concedes '⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)'. The +25 VALUE is correct — it is banked at :79-80 ('rebirth scroll 1000c (+25g)') and is now CONFIRMED by shipped web code — but its film provenance is fictitious and the 'no 10th-rebirth tier' half is disproven by the Dan-8 100-Gold arm. Re-tag the row A2/code-sourced.

- **Cite:** `docs/research/REBUILD_READINESS.md:79-80, :165, :205 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`
- **Quote:** :165 '("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier.'  ·  :205 '⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth).'  ·  §1t1523s0§.as:2644 `if(§1t7356s0§(§1t9426s0§) == 8)` :2646 `§1t9713s0§(§1t9413s0§,100);` :2651 `§1t9713s0§(§1t9413s0§,25);`
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** ledger hygiene + rebirth-elements + economy — stop citing film for a number no camera ever saw; the value survives on an A2 cite.

### `NF-3-def-mitigation-is-flat-subtraction-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

DEF mitigation is FLAT SUBTRACTION in both builds and no curve exists. Damage is reduced by `damage -= getDefense()`, and getDefense returns `defense * 0.8` only when the DEFENDER is in Heavy stance, otherwise `defense`. This closes the DEF half of REBUILD_READINESS.md:200 progression blocker ① ('DEF mitigation curve … measure per-point deltas in a build') — there is no build to measure and no curve to find. It corroborates docs/research/fidelity/SOURCE_CONSTANTS.md:149 ('defence SUBTRACTS, it never divides'), a ruling the ledger never absorbed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484, :3800, :4391 and :3284-3290 (android twins: reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415, :3709, :3231-3238)`
- **Quote:** web §1t99s0§.as:3484 `_loc5_ -= this.§1t4477s0§();` (also :3800, :4391)  ·  :3284-3290 `internal function §1t4477s0§() : int { if(this.stance == §1t12222s0§) { return defense * 0.8; } return defense; }`  ·  android MCSPlayer.as:3415 `damage -= this.getDefense();`
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L-progression + L1 combat-core: blocker ① at :200 closes in FULL when combined with the SPD formulas (NF-4 and stance-modifier-table-in-payload). Nothing about DEF needs measuring.

### `NF-3/web-twin-of-repair-and-reinforce` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 twin of the repair/reinforce block exists and carries identical numbers, so the repair economy needs no Android caveat: repair costs currentNodeLevel * 10 (coins), clamps a worn weapon's uses down to 1, refuses an empty slot or item 13000, and reports achievement 60005; reinforce costs a flat 5000.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1057-1087`
- **Quote:** :1058 `cost = §1t1525s0§.§1t9936s0§() * 10;` :1068 `if(weapon == null || weapon.§1t483s0§() == 0 || weapon.§1t483s0§() == 13000)` :1076 `§1t1523s0§.§1t9619s0§(-cost);` :1077-1080 `if(weapon.uses > 1) { weapon.uses = 1; }` :1081 `§1t1523s0§.§1t1684s0§(60005,1);` :1086-1087 `case ...§1t9093s0§: cost = 5000;`
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L4 economy — closes REBUILD_READINESS.md:215 ③ on a WEB cite, and shows the repair block was ported verbatim between builds.

### `NF-4-spd-to-cooldown-formula-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The SPEED-stat → skill-cooldown transfer function is a shipped two-line formula: cooldownModifier = 1 - min(speed, 300) / 300 * 0.5, i.e. a linear halving that saturates at SPD 300. It is consumed by the character sheet at InventoryUI.as:1937 and printed to the player at :2233 ('skill cooldown modifier: 0.' + int(mod*1000)). This closes skills-meters blocker ④ at REBUILD_READINESS.md:195 and the SPD half of progression blocker ① at :200.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860, consumed at InventoryUI.as:1937 and printed at :2233`
- **Quote:** internal static function getSkillCooldownModifierVal(speed:int) : Number { if(speed > 300) { speed = 300; } return 1 - speed / 300 * 0.5;
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters: 'the SPEED-stat→cooldown formula' stops being a known-unknown. Cross-check: the payload's own placeholder character sheet prints 0.75, which back-solves to SPD 150.

### `NF-4/premium-ladder-has-a-2-gold-tier` — HELD [A2] ⚑ OVERTURNS LEDGER

The premium (Ninja Services) price ladder is 1/2/3/5/12 Gold, not 1/3/5/12: a 2-Gold tier exists holding 2101 'Medium Soldier Pill' and 2126 '25 Duel Tokens'. Measured tier counts over the 143 unique SKUs: 1 Gold x20, 2 Gold x2, 3 Gold x94, 5 Gold x4, 12 Gold x23. The 12-Gold outfit tier is 23 bundles, not 30.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice> and docs/gauntlet/L0/index/strings.json`
- **Quote:** heavenlyprice histogram over the 143 unique premium ids: {'1': 20, '2': 2, '3': 94, '5': 4, '12': 23}. Price-2 rows: 2101 'Medium Soldier Pill', 2126 '25 Duel Tokens'. Price-12 rows: 2130 'Assassin Outfit' … 2171 'Swords of the Mist', 23 rows total.
- **Overturns:** "Ninja-Services prices"
- **Lane impact:** L4 economy + L-items-equipment — two SKUs would be mispriced by a 1/3/5/12 ladder, and the outfit-bundle count is off by seven.

### `NF-5/stance-mastery-caps-at-10-not-9` — HELD [A2] ⚑ OVERTURNS LEDGER

Stance mastery caps at level 10, not 9. The three stance-mastery skills each enumerate levels 1..10, which is why the web damage curve only reaches Light x0.9 / Balanced x1.2 / Heavy x1.4 at mastery 10. Every 'mastery-9 ceiling' label in the project docs is off by one.

- **Cite:** `reference/extracted/skilldata.xml (skills 1000, 1001, 1002) + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262, :3265, :3270 + docs/research/REBUILD_READINESS.md:155`
- **Quote:** skilldata.xml skill 1000 <level><value> = [1,2,3,4,5,6,7,8,9,10]; likewise 1001 and 1002.  ·  §1t99s0§.as:3262 `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);` at m=10 -> 0.9 ; :3265 `* (1 + 0.2 * this.§1t4422s0§ * 0.1)` at m=10 -> 1.2 ; :3270 `* 1.4`.
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L5 combat-core — if the build 'targets mastery-9' as REBUILD_READINESS.md:157 offers, the correct ceiling is 0.86/1.18/1.4, not 0.9/1.2/1.4; the published table is the mastery-10 row.

### `NF-6-web-payload-carries-no-data-xml` — HELD [A3] ⚑ OVERTURNS LEDGER

The WEB v0.717 payload contains NO itemdata, skilldata, npcdata or questdata. Its 27 embedded bindata blobs are 19 animdata, 1 survivalmodedata, 1 room-object table, 5 name tables and a GIF — no data XML and no lang table. All four reference/extracted/*.xml files are the ANDROID blobs with the XML declaration and CRLFs stripped (skilldata.xml 39,003 B vs android/117_Mobile_SkillData.bin 39,045 B; itemdata 184,002/184,044; npcdata 228,413/228,455 — the same 42-byte delta). Streaming the 329 MB payload.xml finds 'skilldata' 0 times and '<npcdata' 0 times (the two 'itemdata'/'questdata' hits are BigDB table-name string constants at bytes 19,503,638 and 19,502,309). The web build fetched these from the dead CDN.

- **Cite:** `docs/gauntlet/L0/index/bindata.json (all 27 web blob roots) + reference/extracted/skilldata.xml vs reference/extracted/android/117_Mobile_SkillData.bin + reference/extracted/payload.xml (streamed)`
- **Quote:** web bindata roots: 100-118 animdata (19) · 119 survivalmodedata · 93 obj · 94-98 text · 92 image/gif — no data XML.  ·  android/117_Mobile_SkillData.bin head: '<?xml version="1.0" encoding="utf-8"?>\r\n<skilldata>\r\n\r\n\t<skill>\r\n\t\t<id>1000</id>…' identical to reference/extracted/skilldata.xml after strip.  ·  grep -c skilldata payload.xml → 0
- **Overturns:** "S0-3 CAVEAT: Data-XML row counts match exactly; UI copy and combat tuning parity is NOT established."
- **Lane impact:** Cross-cutting, and it qualifies gauntlet §0 itself: the 'Data-XML row counts match exactly' premise cannot be checked, because there is no web data XML to compare against. Every skilldata/itemdata/npcdata/questdata claim in this lane carries the v0.682 caveat — including NEW-6-shunpo-effect-recovered, stance-damage-mastery10-ceiling and v0717-stance-multipliers.

### `NF-8-survival-mode-is-byte-identical-in-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

Survival mode — the game mode S0-1 flags as absent from all 12 ledger systems — is not merely present in both payloads, its authored content is IDENTICAL. I parsed the WEB blob directly: 39 <wave>, 87 <enemy>, spawn-x histogram {-50: 49, 1650: 37, -1650: 1}, and the same enemy-id alternation lists '400|401|402|403|404'. Every figure matches the android 109_WarHexUI_SurvivalModeData blob exactly. The spawn x values sit just off both edges of XMLBG's default contentWidth = 1600.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin (web, parsed by me) vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin; default at reference/decompiled/shs3_android_payload/scripts/XMLBG.as:14`
- **Quote:** WEB survivalmodedata: <wave> 39 · <enemy> 87 · x histogram {-50: 49, 1650: 37, -1650: 1} · id alternation ['400|401|402|403|404', …]  ·  XMLBG.as:14 internal var contentWidth:int = 1600;
- **Overturns:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: the gap S0-1 flagged now has its authored wave content in hand IN THE TARGET BUILD, so it can be specified rather than merely noted. Upgrades survival-achievement-premium-namegen-blobs-unread from 'android v0.682' to 'both'.

### `art-anim/43-named-sfx-cues-held-in-web-v0717` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The SFX CUE INVENTORY and its trigger map are held for web v0.717 even though the audio bytes are encrypted: 43 distinct "Snd_*" string literals appear across the web payload's decompiled classes, each at a live call site, so which sound fires on which event is recoverable today. Examples: Snd_smallClick on a legal stance switch and Snd_error on a refused one (§1t113s0§.as:472/:478); Snd_slash1/2/3, Snd_deflect, Snd_hitMetal, Snd_criticalDamage, Snd_die1/2/3, Snd_smokebomb, Snd_bowFire, Snd_punch, Snd_jump, Snd_mining.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ — 43 distinct "Snd_*" literals (my own grep -rhoE over the directory); representative call sites at reference/decompiled/shs3_payload/scripts/§1t113s0§.as:472 and :478`
- **Quote:** $ grep -rhoE '"Snd_[A-Za-z0-9_]+"' reference/decompiled/shs3_payload/scripts/ | sort -u | wc -l  ->  43
Snd_addStat Snd_back Snd_birds1..3 Snd_bowFire Snd_bowFireMany Snd_challenge Snd_click Snd_criticalDamage Snd_deflect Snd_die1..3 Snd_drop Snd_equip Snd_error Snd_fart Snd_goodKoto Snd_hitMetal Snd_jump Snd_mail Snd_menu Snd_menuClose Snd_mining Snd_ninja Snd_notification Snd_punch Snd_put Snd_refund Snd_rimshot Snd_sadTrombone Snd_slash1..3 Snd_smallClick Snd_smokebomb Snd_sumo Snd_upgradeSkill Snd_wrAttack
- **Overturns:** "- **Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel: RR:240 blocker ① is overstated. The WAVEFORMS remain unrecovered (S0-5: nested CWS SWFs ffdec cannot open) and that half stands, but 'every SFX ... is INFERRED' is now false — the cue set and its trigger map are HELD from web source. A WebAudio recreation can be authored against a real 43-cue manifest with correct trigger points instead of guessed ones.

### `art-anim/severed-limb-death-variant-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

Art-anim blocker ⑤, 'severed-limb death variant', is dead. The Human animation blob authors three dismemberment-specific deaths alongside the ordinary ones: deathnohand (25 frames), deathnohead (31), deathinhalf (28), plus deathbyarrow (21) and deathwitharrow (23). The packet's animation claim aimed at blocker ③ and therefore left ⑤ standing by mis-aiming.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin — decoded utf-8-sig (NOT utf-16le) and regex-scanned for `<anim i="…" d="…">`; 158 anims total`
- **Quote:** <anim i="deathnohand" d="25"> · <anim i="deathnohead" d="31"> · <anim i="deathinhalf" d="28"> · <anim i="deathbyarrow" d="21"> · <anim i="deathwitharrow" d="23"> · <anim i="death" d="38"> · <anim i="deathenemy" d="23"> · <anim i="deathdowned" d="7">
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel: blocker ⑤ closes outright. Also a standing correction to the gauntlet's own §0 note — 99_ and 94_ are UTF-8-with-BOM, not UTF-16LE; the UTF-16LE instruction produces mojibake and zero hits on these two files and will cause false refutations.

### `cite04/android-string-table-has-no-900-block` — HELD [A2] ⚑ OVERTURNS LEDGER

The android v0.682 language table has NO entries at all in the 900-999 range - the highest ID below 900 is 880, and IDs resume at 1000. Yet the web v0.717 client renders getString(960) as the greyed label beneath the Focus bar (the 'CANNOT CHANGE STANCE' text visible on film). That is machine-checkable proof that the web language table carries string IDs the android table does not, which is the hardest evidence yet for the S0-3 parity caveat: the android table cannot be used as a complete stand-in for v0.717 UI copy, because some v0.717 strings have no android row to read at all.

- **Cite:** `docs/gauntlet/L0/index/strings.json (per-century census over all 2,533 numeric IDs); reference/decompiled/shs3_payload/scripts/§1t113s0§.as:111; reference/frames/duel_dense/Nr4fQstqHDM_428.0.png crop (230,960)-(560,1070) @4x LANCZOS`
- **Quote:** census: 0-99 → 100 entries · 100-199 → 100 · 200-299 → 90 · 300-399 → 91 · 400-499 → 100 · 500-599 → 100 · 600-699 → 99 · 700-799 → 100 · 800-899 → 79 (highest = 880) · 900-999 → 0 · 1000-1099 → 45. Web §1t113s0§.as:111 'this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";' — and the frame shows that field reading 'CANNOT CHANGE STANCE'.
- **Overturns:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** All lanes porting UI copy: the android table is not merely reworded relative to v0.717, it is INCOMPLETE — the whole 900-999 block is missing, so any v0.717 string in that range must come from film, never from strings.json.

### `cite04/longplay-frames-are-pillarboxed-scale-is-2.27` — HELD [A1] ⚑ OVERTURNS LEDGER

Every 1920x1080 longplay still is PILLARBOXED: 52 px of true black on the left and 52 px on the right, leaving a 1816x1080 game area. The game-px-to-screen-px scale for measuring anything off film is therefore 2.27 (1816/800), or 2.25 vertically (1080/480) - NOT 1920/800 = 2.4. Any reach, stroke-length or HUD-width figure converted at 2.4 is inflated ~6%. This upgrades ledger item 12 from a warning ('may be pillarbox-compressed') to a measured constant, and it directly corrects the conversion note appended to itemdata-hunter/reach-is-per-stance.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png - horizontal row scan at y=540 for pixels with R+G+B < 25; vertical column scan at x=960; cross-checked against reference/decompiled/shs3_android/scripts/StatsManager.as:80-82 (stageWidth 800, stageHeight 480)`
- **Quote:** measured: size 1920x1080 · left bar 52 px · right bar 52 px · content width 1816 · top bar 0 · bottom bar 0 · content height 1080. StatsManager.as:80 'public static var stageWidth:int = 800;' :82 'public static var stageHeight:int = 480;'
- **Overturns:** "12. **Native resolution is 800×480 (5:3)**, not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** Every video-measurement lane: fix the px conversion at 2.27 and subtract a 52-px left offset before converting any x coordinate. L5 combat-core reach figures taken at 2.4 must be re-scaled.

### `cite04/web-rebirth-pays-25-and-100-heavenly-gold` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 rebirth payout is 25 Heavenly Gold normally and 100 Heavenly Gold at STAT_DAN == 8 - NOT the android build's 5/20. This is the correct overturn of ledger item 7: 'tenthGold=100' and the film's '+25' are both the RIGHT v0.717 numbers and become CONTRACT for the web build, while the clause 'no 10th-rebirth tier' is false (a Dan-8 tier pays 4x). The only thing the film got wrong is the currency label - it is Heavenly Gold (the premium currency, stat slot 12), not coins. This simultaneously refutes hunter/tenth-rebirth-tier-exists, which would have written android's 5/20 into a web-target ledger.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 and :228; reference/decompiled/shs3_android/scripts/StatsManager.as:194 and :2201-2207`
- **Quote:** §1t1523s0§.as:2644 'if(§1t7356s0§(§1t9426s0§) == 8)' · :2646 '§1t9713s0§(§1t9413s0§,100);' · :2647 announces getString(864,[name,"10"]) · :2651 '§1t9713s0§(§1t9413s0§,25);'  ||  §1t1523s0§.as:228 'internal static const §1t9413s0§:int = 12;'  ||  android StatsManager.as:194 'internal static var STAT_HGOLD:int = 12;'
- **Overturns:** "7. `MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT. … film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements and L-economy: rebirth payout becomes CONTRACT for v0.717 (25/100 HGold), and ledger item 7 flips from 'should be INFERRED' to 'sourced from code', minus its final clause.

### `combat-core/damage-triple-crit-1p3-and-heavy-def-confirmed-in-web-source` — HELD [A2] ⚑ OVERTURNS LEDGER

The damage half of the stance model and the crit multiplier are held from WEB source, not inferred: damage is dmg x (0.5 + 0.04·lightMastery) for Light, x (1 + 0.02·balancedMastery) for Balanced, and a FLAT x1.4 for Heavy/Dual/Reversed; at reload == maxreload the result is x1.3 plus an item crit-damage add; and Heavy stance takes defense x0.8. This confirms REBUILD_READINESS.md:189 and the damage half of RR:155 from primary source and closes combat-core blocker ② ('crit 1.3 vs 3 final').

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 and :3284-3290`
- **Quote:** 3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
3262:                _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3265:                _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3270:                _loc2_ = _loc1_ * 1.4;
3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
---
3286:         if(this.stance == §1t12222s0§)
3288:            return defense * 0.8;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 combat-core: blocker ② is CLOSED from source — crit is 1.3x and it is DETERMINISTIC, fired by reload == maxreload (i.e. a full Focus bar), not by a chance roll. That also answers skills-meters blocker ⑤ ('crit proc rule (chance vs deterministic) — entirely absent'): it is deterministic, and the spend at §1t99s0§.as:3297 zeroes the bar on the critting slash.

### `combat-core/flinch-is-nested-inside-the-iframe-window` — HELD [A2] ⚑ OVERTURNS LEDGER

The 8-frame flinch clip and the 12-frame gotHitCounter start on the SAME tick and run on the SAME clock, so the flinch is nested inside the invulnerability window (ticks 0-7 flinch, ticks 0-11 invulnerable). There is no held pose before it and no lockout after it. Any port that plays the flinch after a hold, or that reads 12 = 4 + 8 as a sequence, is wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:39 and :123-125 + MCSCharacter.as:1309-1329 + EnemyZombie.as:522 and :544`
- **Quote:** EnemyShield.as:39 `var finishedAnimation:String = mcs.updateAnimation();` then :123-125 `if(gotHitCounter > 0) { --gotHitCounter; }` — one call each per NPC update. MCSCharacter.as:1315 `++this.frameCounter;` — exactly one pose per call. EnemyZombie.as:522 `gotHitCounter = 12;` and :544 `this.startAction(FLINCH_STATE);` are in the SAME gotHit() call.
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 combat-core + art-anim: fixes the shape of the hit reaction that blocker (3) asks for. It also supplies the frame-unit discipline that killed enemies-ai/hit-lockout-decomposes-exactly — game ticks, animation poses (15fps latch) and 60fps video frames are three different clocks and must never be added together.

### `combat-core/focus-crit-gating-rule-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus/crit gating rule that REBUILD_READINESS.md lists as ABSENT in two separate blockers is fully specified in the source. The reload meter is 5*24 = 120 frames (5 s at 24 fps). It recharges +6 per tick, drains by slashUsage (x0.5 light / x1 / x1.5 heavy) per slash, is zeroed when a slash fires at full, is penalised on being hit (reload > max/2 collapses to max/3, else -max/6), gates stance switching below max/6, and drives the HUD bar by scaleX with the crit text appearing only at percentage >= 1.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:239,1158-1168,2977,3098-3112,3242-3272 + BattleUI.as:261-262`
- **Quote:** MCSPlayer.as:239 `this.maxreload = 5 * 24;`  ·  :2977 `if(this.reload < this.maxreload / 6) { return; }`  ·  :3098-3104 `if(this.reload > this.maxreload / 2) { this.reload = this.maxreload / 3; } else { this.reload -= this.maxreload / 6; }`  ·  :3242-3244 `if(this.reload == this.maxreload) { this.reload = 0; }`  ·  :3249-3257 `this.reload -= this.slashUsage / 2; ... this.reload -= this.slashUsage; ... this.reload -= this.slashUsage * 1.5;`  ·  :3267 `this.reload += 6;`  ·  :3272 `StageManager.getBattleUI().updateReload((this.reload - 24) / (this.maxreload - 24));`  ·  BattleUI.as:261-262 `this
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 combat-core blocker 5 and L5 skills-meters blocker 3 both close: max 120 frames, +6/tick recharge, per-stance slash drain, on-hit penalty, stance gate at 1/6, crit unlocked at 100%. Web-parity not yet checked by value - apply the shs3_payload grep rule before promoting to CONTRACT.

### `combat-core/mastery-caps-at-10-per-the-string-table` — HELD [A2] ⚑ OVERTURNS LEDGER

Mastery caps at level 10, stated in the game's own strings — which independently settles the 'mastery-9 ceiling vs mastery-10' argument the ledger's §3 item 3 raises, and confirms Heavy's defence penalty as -20% (x0.8).

- **Cite:** `docs/gauntlet/L0/index/strings.json entries strings.json["8131"], ["8132"], ["8133"] and ["6005"]`
- **Quote:** strings.json["8131"] = 'Light Stance Mastery Level 10.'  ·  ["8132"] = 'Balanced Stance Mastery Level 10.'  ·  ["8133"] = 'Heavy Stance Mastery Level 10.'  ·  ["6005"] = 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%'
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L5 — every 'mastery-9' label in the ledger should read mastery-10. Evaluate the web curves at m=10: damage light 0.9, balanced 1.2, heavy 1.4 — the wiki triple exactly. Caveat: this is the ANDROID string table, so the ceiling is CONTRACT-SRC (0.682) until a web string source is found.

### `combat-core/stance-counter-triangle-x1.2` — HELD [A2] ⚑ OVERTURNS LEDGER

There is a three-way stance counter-triangle worth x1.2 that the ledger's damage math does not carry. MCSPlayer.as:3701-3707: if (attacker Light vs defender Balanced) or (Balanced vs Heavy) or (Heavy vs Light), damage *= 1.2 — and it is applied BEFORE the physical defense subtraction at :3709 and before the min-damage floor at :3710-3713, so it compounds with everything downstream including the behead x1.5 at :3716. The ledger records only 'Heavy defender Defense x0.8 (one way)', which is a different mechanic on the defender's DEF stat.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3718`
- **Quote:** MCSPlayer.as:3701 `if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)` :3703 `damage *= 1.2;`
- **Overturns:** "**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);"
- **Lane impact:** L1 combat-core — a missing rock-paper-scissors term in the core damage pipeline, sitting in a KNOWN-KNOWN bullet the ledger says a builder can code today. Any Sim written from :74 alone would be wrong by 20% on every countered stance matchup.

### `combat/stance-reach-multipliers-diverge-web-vs-android` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance reach multipliers are NOT the same in the two builds, so any port must take the WEB numbers. WEB v0.717 (§1t99s0§.§1t3489s0§, the MCSPlayer twin): Light x1.4 (:3094), Balanced x(1 + 0.2*balancedMastery*0.1) (:3105), Heavy x(0.5 + 0.4*heavyMastery*0.1) with floor 100 (:3116), Reversed x1.4 (:3131), Dual x1.0 floor 100 (:3142). ANDROID v0.682 (MCSPlayer.as): Light x1.5, Balanced x(1 + 0.5*m*0.01), Heavy x(0.5 + 0.5*m*0.01). The mastery scale differs too — android is 0..100, web is 0..10. The WEB form is the one that reconciles with REBUILD_READINESS.md:155-156 ('Heavy's reach also scales x0.5 -> x0.9': web gives 0.9 at mastery 10, 0.86 at mastery 9) and with the wiki's 300/200/100 stance-reach shape. The shared base is identical in both builds: 120 + floor((90 + Dan*5) * spd / (20 + spd)), web §1t1523s0§.as:2347, android StatsManager.as:1915-1918.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116, :3142 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
§1t99s0§.as:3105  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
§1t99s0§.as:3116  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);  if(... < 100) = 100;
vs MCSPlayer.as:3030  this.slashLength = this.baseSlashLength * 1.5;
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L1 combat-core: blocker ① closes, but with the WEB constants, not the android ones the packet supplied. Any config written from progression/stance-reach-multipliers-held as filed would ship the mobile build's reach.

### `combat/web-stance-reach-multipliers-diverge-from-android` — HELD [A2] ⚑ OVERTURNS LEDGER

The WEB v0.717 build uses DIFFERENT per-stance reach multipliers from Android v0.682, so the reach model L1 must port is not the one the android decompile gives. Web: Light = base x1.4, Balanced = base x(1 + 0.2*balancedMastery*0.1), Heavy = base x(0.5 + 0.4*heavyMastery*0.1) with a hard floor of 100, Reversed = base x1.4, Dual = base x1.0 floor 100. Android: 1.5 / (1+0.5*m*0.01) / (0.5+0.5*m*0.01) / 1.5 / 1.0. At mastery 9 the balanced multiplier is 1.18 web against 1.045 android and heavy is 0.86 against 0.545. The SPD base term 120 + floor((90 + Dan*5)*spd/(20+spd)) IS identical in both builds (§1t1523s0§.as:2346-2347 vs StatsManager.as:1917-1918), and both feed InputManager.setMaxDistance, so only the multipliers diverge. Class identity is not guessed: §1t99s0§ is the MCSPlayer twin by its 15-arg initPlayer at :183-199 (param10 -> §1t4420s0§, declared = 10 exactly like baseSlashLength:int = 10 at MCSPlayer.as:107; param13/14 -> balanced/heavy mastery) and by :3158 calling §1t1541s0§.§1t10094s0§(this.§1t4417s0§), the setMaxDistance(slashLength) twin.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119, :3131, :3142-3145, :183-199, :3158; reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:106-108; reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2347`
- **Quote:** 3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117-3119  if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
3131  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3142  this.§1t4417s0§ = this.§1t4420s0§;
3158  §1t1541s0§.§1t10094s0§(this.§1t4417s0§);
2346  var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
2347  return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L1 combat-core blocker ① dies — but on THESE constants. Any port of the android multipliers will miss the filmed build's reach on three of five stances. Also a general warning for this lane: combat tuning is exactly where v0.682 and v0.717 drift, so every combat number cited from shs3_android/ needs its web twin located before it is promoted to CONTRACT.

### `economy/repair-weapon-cost-was-captured-on-film` — HELD [A1] ⚑ OVERTURNS LEDGER

Economy blocker ③, 'Repair-Weapon cost (never captured)', is dead. The blacksmith dialog prints the price on screen: 'REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS', at a node the forge dialog independently labels '(LEVEL 7)' — i.e. repair = nodeLevel × 10, frame-confirmed against the source formula.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 at t=21:26 (repair dialog, wallet 531) and t=21:23 (forge dialog 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS'), extracted at 1920×1080 with ffmpeg and read from a 640×360 contact sheet; formula at reference/decompiled/shs3_android/scripts/InteractUI.as:1058`
- **Quote:** t=21:26 crop: 'BLACKSMITH / REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS' with YES / NO, wallet 531 COINS · t=21:27 wallet 461 COINS · t=21:23: 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE' · InteractUI.as:1058 — 'cost = StageManager.getCurrentNodeLevel() * 10;'
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10 ECONOMY: blocker ③ closes from footage already in the repo. It rides on the same 21:23-21:27 sequence that kills the '−70 is a capture artifact' parenthetical, so both ledger corrections land in one edit.

### `economy/tournament-payout-formula-is-client-side` — HELD [A2] ⚑ OVERTURNS LEDGER

The tournament economy numbers ARE in the web client, in the CREATE panel — not in the details panel the packet nominated. Prize unit = floor((entryFee × playerCount + 5) × 0.75 / 7), paid out 4u / 2u / 1u to 1st/2nd/3rd. Player count ladder 2/4/8/16 (2 gated on a premium flag), entry fee clamped 0…100, level range clamped 5…80, round duration ladder 0.5/1/2/24/48 h. Creating a tournament costs 5 of currency-stat 20112 (waived on the premium flag); joining costs `entryfee` of the same stat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7091s0§.as:406-412 (prize formula), :147-180 (player-count ladder), :183-200 (entry-fee 0…100), :203-300 (level clamps 5…80), :303-360 (round-duration ladder); reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:572 and :585 (create charges 5 of stat 20112), :600 and :610 (join charges entryfee of stat 20112)`
- **Quote:** §1t7091s0§.as:408-412  var _loc1_:int = Math.floor((this.§1t7121s0§ * this.§1t7120s0§ + 5) * 0.75 / 7); var _loc2_:int = _loc1_ * 4; var _loc3_:int = _loc1_ * 2; var _loc4_:int = _loc1_; this.prizefield.text = _loc2_ + " / " + _loc3_ + " / " + _loc4_;   ///   §1t7144s0§.as:585  this.goldtext.text = §1t1523s0§.§1t9713s0§(20112,-5).toString();   ///   §1t7144s0§.as:610  this.goldtext.text = §1t1523s0§.§1t9713s0§(20112,-this.§1t7159s0§.entryfee).toString();
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** L10/L11 ECONOMY — blocker ④'s tournament half closes from the client with no build needed. The pot is NOT redistributed whole: 0.75/7 × (fee×players+5) is the unit and 7 units are paid, so the house rake is exactly 25%. Note §1t7144s0§.as itself contains NO literals — it only reads server-supplied fields — so the packet's stated close-path would have found nothing. Residual STILL_UNHELD: currency stat 20112 has no name (absent from itemdata.xml and from the v0.682 string table).

### `enemies-ai/boss-rubber-band-is-in-the-web-build` — HELD [A2] ⚑ OVERTURNS LEDGER

The elite/boss rubber-band level->stat formula is present in the shipped web v0.717 build, not only in android v0.682 — so the enemies-ai blocker closes at the TARGET build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4523s0§.as:77, :83, :84`
- **Quote:** :77  xp = param1 * 5 + 45;   ///   :83  _loc9_ = 10 + _loc8_;   ///   :84  _loc10_ = 18 - _loc8_;   (with _loc8_ = param1 - playerLevel at :82, and the <=3 / <=0 clamps at :85-92)
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai — src/config/combat-sim.ts:110-113's INFERRED comment can be promoted to CONTRACT (0.717), not merely CONTRACT-SRC (0.682) as the packet's two claims conservatively propose.

### `enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717` — HELD [A2] ⚑ OVERTURNS LEDGER

The FLINCH mechanism is not android-only: the web v0.717 payload carries the identical save-and-restore flinch state machine and the same 8-frame authored clip, so the S0-3 android-parity hedge lifts for this mechanism specifically.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:769-786 + §1t99s0§.as:4679-4703 + §1t1544s0§.as:170,172 + reference/extracted/bindata/103_1t4630s0.bin`
- **Quote:** §1t68s0§.as:770-778 `if(this.actionState == §1t11169s0§ || this.actionState == §1t11149s0§) { return; } this.§1t3251s0§ = this.actionState; this.§1t3252s0§ = mcs.animation; this.§1t3253s0§ = mcs.§1t6269s0§; this.actionState = §1t11169s0§; §1t1557s0§(§1t10421s0§);` · :783-785 `this.actionState = this.§1t3251s0§; §1t1557s0§(this.§1t3252s0§); mcs.§1t6269s0§ = this.§1t3253s0§;` · §1t99s0§.as:4688-4695 the player override branching FLINCH vs FLINCH_WEAPON on sheathed anims · §1t1544s0§.as:170 `internal static var §1t10421s0§:String = "flinch_weapon";` :172 `... = "flinch";` · bindata/103_1t4630s0.b
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** enemies-ai + art-anim: the stagger half of blocker ③ closes at the TARGET build, not just at v0.682. Port from the web constants.

### `enemies-ai/shielder-prop-block-is-a-second-block-mechanic` — HELD [A2] ⚑ OVERTURNS LEDGER

A second, richer block-like mechanic exists and is the shielder's defining behaviour: a blade that lands on the shield (PART_prop) deals zero damage, still sets the hit flag, grants a DOUBLED 24-frame invulnerability window, and plays a metal-clang SFX.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:323-343 (key lines :331-340) + EnemyOgre.as:333 + EnemyJiangSi.as:294 + EnemyNianMonster.as:374 + EnemyWolfAlpha.as:470 + CutsceneActor.as:303`
- **Quote:** EnemyShield.as:331-340 `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false; case mcs.partList[MCSCharacter.PART_prop]: gotHitFlag = true; damage = 0; gotHitCounter = 24; SoundManager.instance.playHitMetal(); return false;` · same file :351-353 `if(behead) { damage *= 1.5; }` · :362 `gotHitCounter = 12;` on a normal landed hit
- **Overturns:** "**`COUNTER_BONUS`** | ❌ **NOT FOUND — there is no counter/parry/riposte mechanic at all.**"
- **Lane impact:** combat-core + enemies-ai: SOURCE_CONSTANTS.md:258's 'no block at all' needs qualifying. There is no TIMED block, but there is a geometric one with two distinct outcomes (weapon whiff vs shield clang), and the shield case is the one with an audible tell and a doubled i-frame window. It also gives the clang SFX the packet went looking for.

### `frames/v0717-war-room-rules-are-seven-pages` — HELD [A1] ⚑ OVERTURNS LEDGER

The shipped v0.717 web client renders SEVEN War Room rules pages; the android v0.682 string table and the extracted web ui_strings.txt both say six. A page was inserted and the numbering shifted, so any android war-room rule text ported by page number lands on the wrong page.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg (1024x576; crop (30,20)-(1000,420) @1.6x LANCZOS) vs docs/gauntlet/L0/index/strings.json["369"],["371"],["373"],["375"],["377"],["379"] and reference/extracted/ui_strings.txt:189-194`
- **Quote:** ON SCREEN in v0.717: frame_0011 'WAR ROOM RULES 1/7 (JOINING A BATTLE)' · frame_0012 'WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)' · frame_0013 'WAR ROOM RULES 6/7 (BUILDING STRUCTURES)'. ANDROID table: ["369"] 'War room rules 1/6 (joining a battle)' … ["377"] '5/6 (rank)' ["379"] '6/6 (building structures)'. ui_strings.txt:189 'War room rules 1/6 &nbsp;(joining a battle)' … :193 '5/6 (WINNING AND LOSING)' :194 '6/6 (rank)'. THE FRAME WINS.
- **Overturns:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** meta-social + ui-hud: hard, enumerable v0.682↔v0.717 diff #2 (arrow gravity is #1, the daily-streak rewording #3). It also proves reference/extracted/ui_strings.txt is NOT runtime copy — see the next finding.

### `hunter/all-24-elemental-skills-fully-specced` — HELD [A2] ⚑ OVERTURNS LEDGER

Rebirth-elements blocker ① is not 'names only' by any reading: skilldata.xml carries a full level row for every one of the 24 element-gated skills, with <chi>, <cooldown> and a string-table description that states the damage scaling. The four ultimates are chi 50 / cooldown 60 with descriptions reading 'Area of Effect Fire Attack — Fire Damage: 150% Fire ATK', and the projectile classes construct exactly that (damage*1.5 in the element channel, physical damage 0).

- **Cite:** `reference/extracted/skilldata.xml (ElementTree parse of skills 1013, 1025-1035, 1056-1063, 1070-1073, joined to docs/gauntlet/L0/index/strings.json) + reference/decompiled/shs3_android_payload/scripts/BigTornadoProjectile.as:24, BigEarthquakeProjectile.as:27, BigFireBreathProjectile.as:23, BigWaveProjectile.as:24`
- **Quote:** 1029 'Fire Kunai' chi 3 cd 2 · 1025 'Fire Element Trap' chi 3 cd 6 · 1013 'Fire Breath' chi 5 cd 15 · 1033 'Ground Punch' chi 5 cd 15 · 1070 'Inferno' chi 50 cd 60 desc 'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK' · 1056 'Dragon Dance Step: Fire' <passive>1</passive> · 1060 'Dragon Dance Step: Fire II' desc '…for Fire (Later Heaven) and gives you the ability to teach it to others.'
BigTornadoProjectile.as:24  damageObj = new Damage(0,0,Damage.LAUNCH_AIR,-1,0,0,damage * 1.5);
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① closes on all four of its named axes at once — damage (150% of the element stat, verified in the projectile constructors), cost (chi + 1 kunai ammo where applicable), AoE (the four ultimates are the AoE tier) and status (none — see the packet's two no-status findings). The ledger's staleness banner concedes the equivalent point for skills-meters at :31 but never propagated it to :205.

### `hunter/audio-blocker-is-the-right-target-for-the-sfx-names` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The 43-name SFX finding is true but aimed at the wrong sentence. The ledger sentence its evidence actually bears on is art-anim-audio-feel blocker ①, and even there the overturn is PARTIAL: the finding recovers the audio EVENT VOCABULARY (43 named triggers with call sites) but not a single SFX or music PARAMETER, and the waveforms remain CWS-encrypted per Stage-0b S0-5. The honest ledger edit is 'event names HELD, params still INFERRED', not 'audio closed'.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:352, §1t406s0§.as:1226, §1t99s0§.as:3379 (43 unique "Snd_*" literals across the bundle) + docs/research/REBUILD_READINESS.md:241`
- **Quote:** §1t113s0§.as:352  §1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");
§1t406s0§.as:1226 §1t88s0§.instance.§1t1516s0§("Snd_ninja");
§1t99s0§.as:3379  §1t88s0§.instance.§1t1516s0§("Snd_jump");
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L7 audio: 43 synth targets with named triggers — three slash variants, three death variants, deflect vs hitMetal as separate impacts, Snd_jump reused for both dodge paths. 'Every SFX param is INFERRED' survives; 'no SFX is identified' does not.

### `hunter/dragon-dance-input-rule-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance INPUT rule is held in the target build, which is the half of rebirth-elements blocker ④ the packet's art finding does not reach. In Earlier Heaven the sequence completes when the player has made exactly four clicks and those four are nodes 1, 2, 4 and 6 — wind, water, earth and fire in the Earlier-Heaven node array — at which point the wheel flips to Later Heaven and the second node array becomes active.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:382 (web v0.717, symbol1810) and :70-71; deobfuscated twin at reference/decompiled/shs3_android/scripts/DragonDanceUI.as:367 and :369`
- **Quote:** §1t5495s0§.as:382  if(Boolean(this.§1t5519s0§ && this.§1t5518s0§.length == 4) && Boolean(this.§1t5512s0§[1]) && Boolean(this.§1t5512s0§[2]) && Boolean(this.§1t5512s0§[4]) && Boolean(this.§1t5512s0§[6]))
DragonDanceUI.as:367  if(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean(this.clickedArray[6]))
DragonDanceUI.as:369     this.setLaterHeaven();
§1t5495s0§.as:70  this.§1t5516s0§ = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ loses its INPUT half, in the WEB build with no android-parity caveat. Only the Kanji-statue bonus remains open. This also explains the packet's 100-point budget finding: the four nodes the flip demands map to all four elements, which one player's 100-point budget cannot buy.

### `hunter/elemental-atk-vs-def-formula-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The elemental ATK-vs-DEF formula is fully recovered, and nobody in this packet claimed it. Each element channel is mitigated independently by the matching elemental DEF, floored at 1 whenever the attacker carried any of that element (so an elemental hit always chips at least 1 per channel) and at 0 otherwise; the four channels are then summed with the physical damage into a single HP deduction. The defender's elemental DEF stats are themselves derived from the COUNTER element's ATK stat, which is the code-side form of the element wheel.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3350, :3351-3381 and :3420 + reference/decompiled/shs3_android/scripts/StatsManager.as:1836`
- **Quote:** MCSPlayer.as:3347  var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;
MCSPlayer.as:3351  if(damageObj.fireDamage > 0 && fireDamage < 1) { fireDamage = 1; } else if(fireDamage < 0) { fireDamage = 0; }
MCSPlayer.as:3420  setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
StatsManager.as:1836  player.initElementDefenseStats(getPlayerStats(STAT_WATERATK)+findBonusStat(STAT_FIREDEF), getPlayerStats(STAT_EARTHATK)+findBonusStat(STAT_WINDDEF), getPlayerStats(STAT_WINDATK)+findBonusStat(STAT_WATERDEF), getPlayerStats(STAT_FIREATK)+findBonusStat(STAT_EARTHDEF));
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements blocker ② closes OUTRIGHT — subtractive per-channel mitigation with a 1-point floor, plus the rule that your FIRE stat is what defends you against EARTH. That last line independently reproduces the artwork's clockwise wheel (fire counters earth, earth counters wind, wind counters water, water counters fire) with no measurement doc in between.

### `hunter/ten-kanji-dan-ranks-in-string-table` — HELD [A2] ⚑ OVERTURNS LEDGER

An independent A2 source for MAX_DAN_RANK=10 that nobody has cited: the string table carries exactly ten kanji dan ranks, ids 455 through 464, 初段 (1st) through 十段 (10th) — a closed, complete ladder. This corroborates the hard-coded romaji ladder in the desktop PlayerPanel from a completely separate artifact, and it identifies the SECOND display format: the inventory/panel path prints kanji, the versus panel prints romaji.

- **Cite:** `docs/gauntlet/L0/index/strings.json["455"] through ["464"]; consumed alongside the romaji path at reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565`
- **Quote:** strings.json["455"]='(初段)' ["456"]='(弐段)' ["457"]='(参段)' ["458"]='(四段)' ["459"]='(五段)' ["460"]='(六段)' ["461"]='(七段)' ["462"]='(八段)' ["463"]='(九段)' ["464"]='(十段)'
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th)"
- **Lane impact:** rebirth-elements blocker ③ + ui-hud: the ladder has TEN entries and stops, so MAX_DAN_RANK=10 is CONTRACT from two independent artifacts (string table and hard-coded romaji switch). 'The only wiki datum' is no longer the only datum.

### `hunter04/full-xp-table-l1-to-l80-is-in-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete XP curve is a hard-coded 99-entry array in BOTH builds, so the ledger's 'L11-80 XP curve - likely unrecoverable' call is dead. reference/decompiled/shs3_android/scripts/StatsManager.as:78 declares 'public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,...]' and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 declares the identical 99-entry array. Indices 1-10 are 550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400 - EXACTLY the ledger's own 'XP caps L1-L10 (550...31 400)' at :77, which authenticates the array against a value the ledger already trusts. Index 79 = 4,025,800; the array runs to index 98 (29,395,800), well past the level cap of 80. Nothing needs extrapolating and nothing needs to stay labelled INFERRED.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78 · reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **Quote:** StatsManager.as:78 — 'public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,...];' (99 entries) · §1t1523s0§.as:364 — 'public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,...];' (99 entries, identical prefix)
- **Overturns:** "(2) **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L-progression: blocker (2) closes outright and §6's 'structurally unrecoverable' list loses an entry. The XP curve becomes CONTRACT for the whole 1-80 range in the target build.

### `hunter04/rebirth-payout-is-25-and-100-hgold-in-v0717` — HELD [A2] ⚑ OVERTURNS LEDGER

What actually falls in ledger item 7. reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 is 'if(getStat(DAN) == 8) { changeStat(§1t9413s0§,100); announce(...,"10"); } else { changeStat(§1t9413s0§,25); } if(getStat(DAN) < 9) { changeStat(DAN,1); }'. §1t9413s0§ is declared = 12 at §1t1523s0§.as:228 and android's STAT_HGOLD is 12 at StatsManager.as:194, so the currency is Heavenly Gold - which the game's own UI calls simply 'Gold'. Therefore: (a) a tenth-rebirth tier DOES exist, so 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' is false; (b) the DAN < 9 cap means dan ranks 0-9, i.e. exactly 10, so MAX_DAN_RANK=10 is now code-grade; (c) both config VALUES the ledger wanted demoted - tenthGold=100 and +25g - are exactly correct and should be promoted to CONTRACT, not demoted to INFERRED. Android v0.682 nerfs the same payout to 5 / 20 HGold (StatsManager.as:2201-2207) - do not carry those numbers over.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:228, :2644-2652 · contrast reference/decompiled/shs3_android/scripts/StatsManager.as:194, :2201-2211`
- **Quote:** §1t1523s0§.as:2644 — 'if(§1t7356s0§(§1t9426s0§) == 8)' · :2646 — '§1t9713s0§(§1t9413s0§,100);' · :2650 — '§1t9713s0§(§1t9413s0§,25);' · :2652 — 'if(§1t7356s0§(§1t9426s0§) < 9)' · :228 — 'internal static const §1t9413s0§:int = 12;'
- **Overturns:** "7. `MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT. The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements and L-economy: ledger item 7 flips - MAX_DAN_RANK=10 and tenthGold=100 become CONTRACT, and the 'no 10th-rebirth tier' clause is deleted. Blocker (3) 'Dan-rank count/titles (garbled source)' closes on the count.

### `hunter04/territory-owners-are-open-ended-not-four` — HELD [A2] ⚑ OVERTURNS LEDGER

Rider on the fifth-banner finding: the world-map ownership layer is OPEN-ENDED, not four owners and not five. The four canonical clans are named in the string table - docs/gauntlet/L0/index/strings.json["275"]-["278"] = 'Clan Aka Ryu' / 'Clan Midori Ken' / 'Clan Aoi Hoiru' / 'Clan Ki Sensu' (red / green / blue / gold, matching the banners I read off reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg). But ["491"] is 'Neutral', and the game ships player-founded clans that choose their own heraldry: ["4400"] 'Clan Deed', ["4401"] 'Form your own clan.\nWar Hero rank required.', ["4405"] "Edit your Clan's name, acronym, color and banner", ["816"] 'Clan Color', ["818"] 'Clan Acronym', and ["834"]/["835"] 'Minor Clan ( [0] territories owned )' / 'Major Clan ( [0] territories owned )' - i.e. custom clans own territory. A rebuild must model territory ownership as an arbitrary (colour, banner, name) tuple with a Neutral sentinel, not an enum of four or five.

- **Cite:** `docs/gauntlet/L0/index/strings.json["275"]-["278"], ["491"], ["816"], ["818"], ["4400"], ["4401"], ["4405"], ["834"], ["835"] · reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (crop 700,160-780,230 @15x LANCZOS)`
- **Quote:** ["4405"] — "Edit your Clan's name, acronym, color and banner" · ["4401"] — 'Form your own clan.\nWar Hero rank required.\n\nIncludes:\n1 Clan General Invitations\n3 Clan Invitations' · ["834"] — 'Minor Clan  ( [0] territories owned )' · ["491"] — 'Neutral'
- **Overturns:** "(2) War-Room **map topology** (board/adjacency)."
- **Lane impact:** L-meta-social and L-world-exploration: territory ownership is a data-driven (colour, banner, acronym) record plus a Neutral sentinel, so the four-clan enum in any rebuild is wrong in kind. The black-banner tile on the world map is consistent with a custom clan or the neutral/shogunate side; either way ≥5 is a floor.

### `hunter04/v0717-stance-switch-is-focus-gated-at-48-not-hard-locked` — HELD [A2] ⚑ OVERTURNS LEDGER

In-combat stance switching in web v0.717 is FOCUS-GATED at a flat 48, not hard-locked - ledger §3 item 4 is wrong and the recreation's Focus-gated in-combat switch was right. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050 returns 'canChangeStance() && reload >= 48'; :3060 opens nextStance with 'if(reload < 48) return;'; and :3160-3162, inside the StageManager battle predicate (structurally aligned with android's 'if(StageManager.isBattle())' at MCSPlayer.as:3096), charges 'reload -= 48'. So the switch IS permitted in battle, at a price of 48 Focus, and the 'CANNOT CHANGE STANCE' HUD text is that Focus threshold firing - not an unconditional lock. Android uses a different rule entirely: gate at maxreload/6 = 20 (MCSPlayer.as:2977) and a graded cost (reload > max/2 -> set to max/3, else -= max/6; :3098-3105). Corroborated on film: the third bar in reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x LANCZOS) reads CANNOT CHANGE STANCE with no visible fill, which is exactly the reload <= 48 state that §1t113s0§.as:328 renders as scaleX 0.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050, :3060, :3160-3162 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:2977, :3096-3105 · corroborated reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x)`
- **Quote:** §1t99s0§.as:3050 — 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;' · :3060 — 'if(this.§1t4414s0§ < 48) { return; }' · :3162 — 'this.§1t4414s0§ -= 48;'
- **Overturns:** "4. **In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**. The *out-of-combat* switch costing Focus IS real; the *in-combat* switch is a recreation divergence — label it, don't present it as original."
- **Lane impact:** L-combat-core and L-skills-meters: the switch-cost third of blocker (3) 'Focus numerics (max/fill/switch-cost)' CLOSES at 48 for v0.717, and ledger §3 item 4 must be reversed - stop labelling the in-combat Focus switch a recreation divergence.

### `hunter04/web-v0717-crit-is-flat-1_3-vindicating-the-ledger` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 damage function diverges from android and CONFIRMS the ledger's CRIT_MULT=1.3. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 rolls baseDamage = minDamage + random()*damageRange, then applies LIGHT x(0.5 + 0.4*lightMastery*0.1), BALANCED x(1 + 0.2*balancedMastery*0.1), HEAVY/DUAL/REVERSED x1.4 - and then, only when reload == maxreload, returns 'dmg * 1.3 + STAT_CRITICALDMG' for EVERY stance, with no Light special case. Android (MCSPlayer.as:3198-3223) instead uses x1.2 non-Light / x1.5 Light and stance factor x1.5. Two consequences: the crit is DETERMINISTIC on a full Focus bar (no proc chance anywhere), and the ledger's wiki-sourced 'Critical = 1.3 x Physical' is now a CONTRACT code fact for the target build. At mastery 9 the web stance ceilings compute to 0.86 / 1.18 / 1.40, matching the ledger's §3.3 'the stance tables (dmg 0.9/1.2/1.4) are MASTERY-9 CEILING values'.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`
- **Quote:** §1t99s0§.as:3272-3275 — 'if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }' · :3261 'case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);' · :3270 'case §1t12222s0§: case §1t12223s0§: case §1t12224s0§: _loc2_ = _loc1_ * 1.4;'
- **Overturns:** "(2) crit 1.3 vs 3 final — *read one crit popup.* … (5) crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L-combat-core and L-skills-meters: combat-core blocker (2) and skills-meters blocker (5) both close. CRIT_MULT=1.3 stays and is promoted from wiki-INFERRED to CONTRACT; the stance damage table for v0.717 must use x1.4 Heavy and the ·0.1 mastery scale, NOT android's x1.5 and ·0.01.

### `hunter04/web-v0717-per-stance-reach-coefficients-differ` — HELD [A2] ⚑ OVERTURNS LEDGER

Rider on the reach-per-stance close: use the WEB coefficients, not android's. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094 sets LIGHT slashLength = baseSlashLength * 1.4; :3104 BALANCED = base * (1 + 0.2 * balancedMastery * 0.1); :3116-3120 HEAVY = base * (0.5 + 0.4 * heavyMastery * 0.1) floored at 100; :3131 REVERSED = base * 1.4; :3142-3146 DUAL = base floored at 100. Android instead uses x1.5 for LIGHT and REVERSED and a ·0.01 mastery scale (MCSPlayer.as:3029, :3042, :3053). The base function and stage are parity, so the SHAPE of the close is safe: §1t1523s0§.as:2347 'return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));' and §1t1523s0§.as:104 'public static var stageWidth:int = 800;'. Worked example for a fresh v0.717 character (SPD 1, DAN 0): base = 120 + floor(90*1/21) = 124 stage px, so LIGHT 173, BALANCED 124, HEAVY max(62,100) = 100 - and at 1920-wide capture that is x2.4 screen px per stage px.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3104, :3116-3120, :3131, :3142-3146 · reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104, :2347 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:3029, :3042, :3053`
- **Quote:** §1t99s0§.as:3094 — 'this.§1t4417s0§ = this.§1t4420s0§ * 1.4;' (LIGHT) · :3104 — 'this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);' (BALANCED) · :3116 — 'this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);' with 'if(... < 100) { ... = 100; }' (HEAVY)
- **Overturns:** "(1) reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L-combat-core: closes combat-core blocker (1) for the RIGHT build. Also kills STANCE_TABLE's fixed reach 300/200/120 in kind - reach is a computed function of SPEED and DAN, not a constant, and its unit is the 800-px stage.

### `hunter05/offline-sharedobject-save-path-exists` — HELD [A2] ⚑ OVERTURNS LEDGER

The game has a LOCAL, server-free persistence path: the equipment string is written to and read back from a Flash SharedObject, so §6's 'Server-sim topology & save format — nothing to copy' is wrong twice over (a serializer exists AND an offline save path exists).

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2907, :2917, :2980`
- **Quote:** QueryManagerBase.as:2907 and :2917 `sharedObject.data.equipment = StatsManager.getEquipmentString();` · :2980 `StatsManager.parseEquipmentString(sharedObject.data.equipment);`
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence — a single-player schema does not have to be designed from scratch; the client already ships one, including its offline storage target.

### `hunter05/war-wave-table-is-340-plus-11-equals-351` — HELD [A2] ⚑ OVERTURNS LEDGER

Measured, not inferred: the war-room wave table sums to 340 rank-and-file troops plus exactly 11 id-700..710 live-player slots = 351, and the android and web blobs agree to the row.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Quote:** Both decode (UTF-8) to <survivalmodedata> with 39 <wave> and 87 <enemy>. My sum: qty over enemies whose id list excludes 700-710 = 340; eleven single-id 700..710 entries at qty 1 each; total 351. Identical in both files.
- **Overturns:** "kill cap 350"
- **Lane impact:** L0 meta-social — the ledger's 'kill cap 350' is wrong in both directions. An offline war-room battle should spawn 340.

### `hunter05/writ-of-release-is-5-gold-not-25` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md:216's 'Writ of Release 25g now double-confirmed' is contradicted by the shipped data: item 2203 'Writ of Release' carries <baseprice>0</baseprice> and <heavenlyprice>5</heavenlyprice>, and the premium catalogue lists it in the 5-Gold tier alongside Amnesia Scroll, Name Change Scroll and Clan Deed. The ledger's banked price is 5x too high.

- **Cite:** `reference/extracted/itemdata.xml:2328-2339 + reference/extracted/android/121_Mobile_PremiumData.bin`
- **Quote:** itemdata.xml:2328-2335 — `<id>2203</id><type>10</type><name>4156</name><unique>1</unique><baseprice>0</baseprice><heavenlyprice>5</heavenlyprice><weight>0</weight><desc>4157</desc>`; strings.json["4156"] = 'Writ of Release'.
- **Overturns:** "Writ of Release 25g now double-confirmed"
- **Lane impact:** L4/L0 economy — a banked KNOWN-KNOWN price is wrong. Nobody in this packet noticed it while claiming to overturn 'Ninja-Services prices'.

### `meta-social/achievements-list-is-on-disk` — HELD [A2] ⚑ OVERTURNS LEDGER

The achievements list is HELD, not a blocker. reference/extracted/android/114_Mobile_AchievementData.bin is plain UTF-8 XML: <achievementdata> with 61 <achievement> rows, each carrying <id>/<img>/<name>/<desc>/<stat>/<val>. Names and descriptions resolve straight through the string table (desc id = name id + 80): 8000 'Duelist I' (stat 60000, val 1), 8003 'Killer I' / 'Defeat 100 enemies.' (60017, 100), 8006 'Eye of the Beheader I', 8058 'Warrior III' / 'Defeat 340 in a war room attack.', 8060 'Be Awesome' / 'Completed Season 1'. The full list, its tracked stat ids and its thresholds are all already extracted.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (61 <achievement> rows, my own parse) + docs/gauntlet/L0/index/strings.json["8000"]-["8060"] and ["8080"]-["8140"]`
- **Quote:** <achievement><id>0</id><img>1</img><name>8000</name><desc>8080</desc><stat>60000</stat><val>1</val></achievement> … strings.json["8058"]='Warrior III', ["8138"]='Defeat 340 in a war room attack.'
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — the achievements third of blocker ③ closes from a file already on disk. With the daily-reward third closed by the packet's own finding, only 'token costs' survives, and the 'one Ruffle session closes all' close-path is moot given the P0 no-build verdict.

### `meta-social/kill-cap-is-351-not-350` — HELD [A3] ⚑ OVERTURNS LEDGER

The War-Room kill cap is 351, not 350, and the master reference's decomposition is off by one on the samurai half. Both survival-wave tables (web bindata/119 and Android 109) contain 39 waves and 87 <enemy> rows summing to 351: the 400-id block sums to 340 and the 700-id block to 11 (ids 700 through 710, one each). SHSD_MASTER_REFERENCE.md:170 records 'Kill cap (troops) | 350 (= 340 troops + 10 samurai)' and REBUILD_READINESS.md:244 carries it forward as 'kill cap 350'. The troop half is exactly right; the samurai half is 11, not 10. Corroborated from the other side by achievement 8058 'Warrior III' = 'Defeat 340 in a war room attack.'

- **Cite:** `my own parse of reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both: 39 waves, 87 enemy rows, sum qty 351, buckets {400: 340, 700: 11}, distinct 700-block ids 700-710); docs/research/SHSD_MASTER_REFERENCE.md:170`
- **Quote:** web `<id>449|454|449|454|443</id>` / android `<id>449|454</id>`; both files Σ<qty> = 351, block 400 = 340, block 700 = 11 (ids 700-710)
- **Overturns:** "kill cap 350"
- **Lane impact:** L0 meta-social / L8 enemies-ai — a one-number correction to a CONTRACT-grade value that is already in the ledger's 'Ready' column, so it would have shipped wrong. Both builds agree, so there is no parity hole.

### `meta-social/world-board-is-a-coordinate-grid-not-a-japan-outline` — HELD [A1] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md:115 says the world map is a 'sparse geographic Japan outline, not a grid you can generate from W×H'. The rendered board contradicts that: it is a regular rectangular lattice of uniform rounded-square tiles, and territories carry integer (x,y) coordinates — 'NAGANO (26,52)' — printed in the header. The Japan outline is a background painting drawn UNDER the lattice, not the board's geometry.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg — whole frame 512x288 upscaled x3 LANCZOS`
- **Quote:** Header reads 'NAGANO (26,52)  LEVEL: 9'. Below it, uniform rounded-square tiles in strict rows and columns (I count 13-14 columns across five visible rows), each tile the same size and pitch, with a soft brown landmass shape painted behind and bleeding across tile borders — i.e. the coastline is wallpaper, the tiles are the board. One tile is highlighted with a white selection outline. Legend: 'VILLAGE  TOWN  CITY  CASTLE TOWN  DESTROYED  QUEST'.
- **Overturns:** "- **World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** L10 world-exploration + L11 meta-social — a (26,52) coordinate label means the board IS addressable as a lattice, so War-Room adjacency is almost certainly 4- or 8-neighbour on integer coordinates rather than a hand-authored graph. Nobody in this packet claimed this; the world-map finding I judged claims only the tile vocabulary and level gating. This is the sentence that should actually fall, and :245 ② (board/adjacency) should be narrowed to 'adjacency rule unconfirmed' rather than 'topology unknown'.

### `meta-social/world-map-topology-is-a-bitmap-mask` — HELD [A2] ⚑ OVERTURNS LEDGER

The world-map / War-Room board topology is HELD and it is a bitmap, not a mystery. reference/extracted/android/110_Mobile_MapBitmapData.bin is a 63x72 two-colour GIF with 735 white pixels on black — a pixel silhouette of Japan (Hokkaido, Honshu, Shikoku, Kyushu and the Ryukyu chain all legible at x8 nearest-neighbour). White = a territory exists. WorldMapUI.as:206-208 hasTerritory() is mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX, territoryy + TERRSHIFTY) != 0, with WarSelectUI.as:15/17/19 giving WARMARKERSHIFTX=8, TERRSHIFTX=21, TERRSHIFTY=51; getHexOwner keys ownership by mapid = (x+341) << 12 | (y+341); QuestEngine.as:1206 uses the same mask. CROSS-VALIDATED AGAINST A FRAME: the displayed 'NAGANO (26,52)' in frame_0025.jpg maps to getPixel(26-8, 52) = getPixel(18,52), which I read as pure white — land. So the board is 735 territories on a W x H grid with holes, and adjacency is grid-neighbour.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (63x72 GIF, 735 non-black pixels, my own PIL read incl. pixel(18,52) = (255,255,255)); reference/decompiled/shs3_android/scripts/WorldMapUI.as:206-208, :371-390 and WarSelectUI.as:15, :17, :19; frame reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg`
- **Quote:** WorldMapUI.as:208 `return this.mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX,territoryy + TERRSHIFTY) != 0;` · WarSelectUI.as:15 `WARMARKERSHIFTX:int = 8;` :17 `TERRSHIFTX:int = 21;` :19 `TERRSHIFTY:int = 51;`
- **Overturns:** "② War-Room **map topology** (board/adjacency)"
- **Lane impact:** L0 meta-social + L10 world-exploration. Kills :245 ② outright, and also falsifies :115's unknown-unknown ('sparse geographic Japan outline, not a grid you can generate from W×H' — it IS a W×H grid plus a mask) and makes :225 ①'s close-path ('trace the map image') redundant, since the image is already extracted. This is the correct evidence for the sentence that meta-social/world-map-tiers-and-level-gating was pointed at and missed.

### `meta/interactui-uidata-blob-is-utf8-not-utf16le` — HELD [A2] ⚑ OVERTURNS LEDGER

reference/extracted/android/90_InteractUI_UIData.bin is UTF-8, not UTF-16LE — its first bytes are literally the XML declaration naming UTF-8. Decoding it by the §0 briefing's blanket UTF-16LE rule yields 3 lines of garbage and zero hits, which would have produced a wrong REFUTED on rebirth/element-atk-budget-is-100.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:1 (and :97 for the payload line the mis-decode hides)`
- **Quote:** byte 0..37  <?xml version="1.0" encoding="UTF-8"?>\r\n
:97  <option><label>1</label><icon>12</icon><condition><has><id>25</id><qty>9</qty><comp>gte</comp></has></condition><action><id>firerebirth</id></action></option> <!-- "yes" useicon >=10 dan, no element boost-->
- **Overturns:** "⚠ THE ANDROID BLOBS ARE UTF-16LE. A byte-level grep returns 0 hits and WILL fool you into wrongly refuting a sound claim. Decode before you judge."
- **Lane impact:** Process, all lanes: the §0 briefing's warning is not true of every blob. Encoding must be sniffed per-file before any grep-based refutation. As written the warning is itself a fail-open trap — it tells a critic that a zero-hit grep is expected, which is exactly when a wrong REFUTED gets waved through.

### `npcdata/five-stances-are-in-the-web-build-too` — HELD [A2] ⚑ OVERTURNS LEDGER

The five-stance dispatch is NOT android-only. The same getMastery(1500) -> REVERSED / getMastery(1501) -> DUAL branch exists in the WEB v0.717 payload in three classes, so the packet's five-stance finding carries no build-parity caveat and its 'android v0.682' build label understates it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4907s0§.as:157, §1t4906s0§.as:90 and §1t122s0§.as:862; android original at reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:160-167`
- **Quote:** §1t4906s0§.as:90 `if(param1.§1t1255s0§(1500) > 0)` · §1t4907s0§.as:157 `else if(param1.§1t1255s0§(1500) > 0)` · §1t122s0§.as:862 `else if(param1.§1t1255s0§(1500) > 0)` — the obfuscated twins of android `if(xml.getMastery(1500) > 0) { setStance(REVERSED_STANCE); }`, with the stance enum fixed by MCSPlayer.as:33 `DUAL_STANCE:int = 3;` and :35 `REVERSED_STANCE:int = 4;`.
- **Overturns:** "Stance system = 3 stances (light / balanced / heavy)"
- **Lane impact:** Removes the S0-3 build-parity hedge from npcdata/five-stances-reversed-and-dual. src/config/stances.ts:7 (`export type StanceId = 'light' | 'balanced' | 'heavy'`) is short two states in the target build, not merely in the Android port.

### `npcdata/spawn-level-comes-from-the-quest-wave` — HELD [A2] ⚑ OVERTURNS LEDGER

The open question behind the packet's hp-less-combat-rows claim is answerable and I answered it. Spawn level for combat NPCs comes from the QUEST WAVE, not from npcdata. NPCManager.as:110-131 reads wave[i].enemy[j].lvl into new NPCHolder(id,fatal,xpos,lvl); :407/411/433/437 pass npcHolder.getLvl() into createEnemy/createObjective, which call actor.setLevel(lvl) when lvl != 0 (:877-879, :931-934). 160 of the 169 <enemy> blocks in questdata.xml carry <lvl>. Concretely: Gojo Takamori npc 190 spawns at lvl 25 (questdata.xml:26101 id, :26105 lvl) and npc 191 at 35 (:25862 / :25866); Magoichi npc 188 at 35, npc 810 at 27. Friendlies never need one — FriendlyElite.as:70 and FriendlyArcher.as:58 call setLevel(StatsManager.getLevel()), so allies scale to the player, and 7 of the 12 skill-carrying hp-less rows are ai 30 / ai 34 = FriendlyElite / FriendlyArcher (NPCManager.as:608-621). NPC.setLevel at :239-259 then rescales damage, defense and maxhp by lvl/level and hard-clamps all three to 1 when lvl <= 10.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:110-131, :407, :877-879, :931-934 and NPC.as:239-259, FriendlyElite.as:70, FriendlyArcher.as:58; reference/extracted/questdata.xml:26101 and :26105 (npc 190 at <lvl>25</lvl>), :25862 and :25866 (npc 191 at <lvl>35</lvl>)`
- **Quote:** NPCManager.as:113 `lvl = wave[i].enemy[j].lvl;` :131 `enemyWave[i].push(new NPCHolder(id,fatal,xpos,lvl));` · NPC.as:241 `var factor:Number = lvl / this.level;` :249 `maxhp *= factor;` :256 `if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; }`
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP."
- **Lane impact:** L8 enemies-ai — the level→stat transfer function is NOT absent: it is NPC.setLevel's factor = lvl/level (x0.9 below level 21), applied to damage, defense and maxhp, plus EnemyElite.init's boss/level bands (x1.4 above 70, x1.3 above 50, x1.2 above 30, x0.8 below 10). Combined with the quest-wave <lvl> rows this closes the spawn side of blocker ② for the 22 hp-less combat NPCs and gives blocker ① a real formula to test.

### `parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android` — HELD [A3] ⚑ OVERTURNS LEDGER

21 of the 27 web v0.717 bindata blobs are BYTE-IDENTICAL (md5) to android v0.682 blobs, including the ENTIRE character-animation layer and all five NameGenerator tables. The S0-3 android-parity hedge can be lifted outright for those 21 files: they are the same bytes in both builds. It says nothing about UI copy, which demonstrably does drift.

- **Cite:** `md5 over reference/extracted/bindata/*.bin vs reference/extracted/android/*.bin (27 web files, 42 android files, 21 exact matches)`
- **Quote:** md5 6852a591ab2d5895090b3d37ccec9ba2 for BOTH reference/extracted/bindata/103_1t4630s0.bin and reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin. Full identical set: 101==92_Bear, 103==94_Human2, 104==95_ReversedStance, 105==96_Horse, 106==97_BalancedStance, 107==98_Undead, 108==99_Human, 109==100_Deer, 110==101_DualStance, 112==103_Wolf, 115==105_Goblin, 116==106_HeavyStance, 117==107_Boar, 118==108_LightStance, 92==110_MapBitmap, 93==84_TrapRoom, 94==85_MaleNames, 95==86_NobleFamilyNames, 96==87_SamuraiFamilyNames, 97==88_FemaleNames, 98==89_PlaceNames.
- **Overturns:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** L0 art-anim + every lane that has been hedging android cites: the animation data layer needs NO build hedge at all — it is byte-identical. This makes every <anim ... d="N"> duration an unqualified web-build CONTRACT, including flinch d=8. It also gives the board a cheap, machine-checkable parity instrument to run before hedging any future android cite.

### `payload/repair-cost-formula-is-node-level-times-10` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon cost is not merely a template — the formula is on disk. InteractUI.as:620-621 sets level = StageManager.getCurrentNodeLevel() capped at 80, then :647 renders getString(848,[level * 10]). Repair = nodeLevel x 10 coins. The same block gives Forge = nodeLevel x 100 (:634 iron below 30, :638 bronze 30-59, :642 steel 60+) and Reinforce = flat 5000 (:649-668, 1 Silver Ore under weapon level 30, 1 Titanium Ore at 30+). FRAME VALIDATION: frame_0040.jpg renders 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS' — 7 x 100 = 700 exactly, from the line immediately above the repair line, so the same `level` variable feeds both. Repair at a level-7 node is 70 coins.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:620-621, :634, :638, :642, :647, :649-668; validated against reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,370-1024,576 @1.46x, reads 'FORGE AN IRON SWORD (LEVEL 7)? COST: 700 COINS')`
- **Quote:** InteractUI.as:647 `this.detailstext.text = LangManager.getString(848,[level * 10]);` with :621 `level = StageManager.getCurrentNodeLevel();`
- **Overturns:** "③ Repair-Weapon cost (never captured)"
- **Lane impact:** L7 economy / L6 items-equipment — blocker ③ dies with a number, not a re-statement, and :334's close-path ('read Repair cost') is already done. Also upgrades the ledger's Forge 700c from a single-frame constant to f(nodeLevel) = nodeLevel x 100, and confirms Reinforce 5000 is genuinely flat.

### `progression/expArray-validated-on-camera` — HELD [A1] ⚑ OVERTURNS LEDGER

The recovered 99-entry XP table is not merely on disk — its low end is confirmed by the primary reference three separate times, so frame and payload AGREE rather than merely not contradicting. Video A at -ss 653.0 renders '2098 / 2950 EXPERIENCE POINTS' beside a level-3 badge, and expArray[3] = 2950. At -ss 1600 it renders '5110 / 5150' beside a level-4 badge, and expArray[4] = 5150. Segment B-18 records the XP bar reading 24881/25900 then 25354/25900, and expArray[9] = 25900. All three thresholds match the array exactly, and all three are consistent with the game's own getLevel() (StatsManager.as:1586-1596, first q where expArray[q] > XP).

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 ('2098 / 2950', badge 3) and @ -ss 1600 ('5110 / 5150', badge 4), crop=iw*0.55:ih*0.35:iw*0.42:ih*0.12 x2 lanczos — my own extraction; checked against reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 and docs/research/video-study/segments/B-18-turn-in-and-hattori-kazushi-bounty-accep.md:32`
- **Quote:** On-screen at -ss 653.0: level badge 3, '2098 / 2950 EXPERIENCE POINTS'. expArray[3] = 2950. On-screen at -ss 1600: level badge 4, '5110 / 5150'. expArray[4] = 5150.
- **Overturns:** "- **L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L4 progression — this is the piece the five duplicate XP-curve claims all lacked: an A1 confirmation that the payload array is the array the shipped game actually rendered. src/config/xp.ts can move to CONTRACT on frame-plus-payload agreement, not on a decompiled array alone. Nothing of :350 survives.

### `progression/per-point-ap-is-plus-5-not-plus-1` — HELD [A2] ⚑ OVERTURNS LEDGER

Per stat point the WEB build grants +5 max AP, not +1. §1t5957s0§.as:3413-3414 spends one stat point and calls §1t1523s0§.§1t9609s0§(5); §1t1523s0§.as:2807-2810 is changeStat(§1t9415s0§, param1) with §1t9415s0§:int = 14 (:232) = STAT_MAXAP. Reading all six allocation buttons directly, the complete web per-point table is: MAXHP +10 (:3394), MAXCHI +5 (:3406), MAXAP +5 (:3414), ATK +3 (:3422), DEF +3 (:3434), SPD +3 (:3443). The ledger's '+1AP' looks like an Android value that leaked into a web line — Android's auto-allocator at StatsManager.as:1669-1683 is +5 HP / +5 Chi / +1 AP / +1 everything-else.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3394, :3406, :3413-3414, :3422, :3434, :3443 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2807-2810, :232`
- **Quote:** §1t5957s0§.as:3413 `§1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9419s0§,-1);` :3414 `§1t1523s0§.§1t9609s0§(5);` → §1t1523s0§.as:2809 `§1t9713s0§(§1t9415s0§,param1);` with :232 `internal static const §1t9415s0§:int = 14;`
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4 progression — one wrong term inside a line the ledger lists as READY, i.e. a value that would have been coded as CONTRACT without challenge. The rest of the line (+3 stat/level, +10HP, +5Chi, +3-stat) is confirmed by the same six lines.

### `progression/unlock-rule-breaks-inside-ninja-and-chi` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's unlock rule breaks inside its own two NAMED families, not just on a general skill. Resolving <category> through the string table: category 6 = Ninja and category 4 = Chi. Ninja ladder measured: Throw Kunai 10, Lay Trap 15, Smoke Bomb 20, Windmill Shuriken 30, Flashbang 40, Shadow Clone 50, Stealth 60, Substitution Jutsu 70, Mass Shadow Clone 80 — Lay Trap at lvlreq 15 ends in 5, not 0. Chi ladder measured: Focus 5, Slash Wave 15, Chi Kick 25, Spirit Thief 35, Chi Burst 45, Chi Charge 50, Charged Shot 55, Heavenly Sword 65, Deadly Touch 75 — Chi Charge at lvlreq 50 ends in 0, not 5. This closes the loophole in the packet's own counterexample, which used Roll (category 5, a general skill neither Ninja nor Chi).

- **Cite:** `reference/extracted/skilldata.xml:255-257 (the Roll row the packet used) — full <lvlreq> and <category> table re-parsed from reference/extracted/skilldata.xml, ids resolved via docs/gauntlet/L0/index/strings.json`
- **Overturns:** "- **Progression spine:** XP caps L1–L10 (550…31 400), +3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat per point, level cap 80, 80 SP first run, skills unlock at levels ending 0 (Ninja) / 5 (Chi)."
- **Lane impact:** L4: strengthens the existing overturn of REBUILD_READINESS.md:77-78 so it cannot be rescued by reading the rule as family-specific.

### `progression/web-ap-per-point-is-5-not-1` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's '+1AP per stat point' is wrong for the WEB v0.717 build: one stat point buys +5 max AP, not +1. The stat-panel click handlers spend one point each and grant MAXHP +10, MAXCHI +5, ATK +3, DEF +3, SPD +3 — and AP +5 via a helper. This is the only per-point magnitude in the ledger's 'Ready' line that is wrong, and it is wrong in both places the ledger states it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3414 with reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2807-2814 and :232; android cross-check reference/decompiled/shs3_android/scripts/StatsManager.as:198`
- **Quote:** §1t5957s0§.as:3412-3415 `§1t88s0§.instance.§1t1516s0§("Snd_addStat"); §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9419s0§,-1); §1t1523s0§.§1t9609s0§(5); this.§1t6041s0§();` — and §1t1523s0§.as:2807-2809 `public static function §1t9609s0§(param1:int) : * { §1t9713s0§(§1t9415s0§,param1);` with :232 `internal static const §1t9415s0§:int = 14;` = STAT_MAXAP (android StatsManager.as:198 `internal static var STAT_MAXAP:int = 14;`). Sibling handlers in the same block: :3394 §1t9403s0§(MAXHP)+10, :3406 §1t9406s0§(MAXCHI)+5, :3422 §1t9408s0§(ATK)+3, :3434 §1t9409s0§(DEF)+3, :3443 §1t9410s0§(SPD)+3.
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4 progression — REBUILD_READINESS.md:199 and :77 both carry '+1AP' and both must change to '+5AP'. src/config's per-point AP value needs the same correction. Found while adjudicating progression/second-frame-confirms-plus3-per-point, which asserts the +1AP figure is wrong but supplies no cite for it; this is that cite.

### `rebirth/tenth-dan-tier-is-real` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md's 'no 10th-rebirth tier' is FALSE in the shipped web build. Rebirth pays +25 heavenly gold normally and +100 when STAT_DAN == 8, and DAN increments only while < 9 — so the ceiling is DAN 9, which the game announces as rank DAN+1 = 10. MAX_DAN_RANK=10 (as displayed) and tenthGold=100 are therefore CONTRACT on v0.717, not INFERRED, and the wiki's 'kyudan/9th' datum was never garbled — it is the raw DAN ceiling. The film's flat +25 is true only because the player never reached DAN 8. The android build pays 5/20 instead, so 25/100 must be taken from the WEB file.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2659, with the stat-id map at :226-256 (§1t9413s0§ = 12 = STAT_HGOLD, §1t9426s0§ = 25 = STAT_DAN); android contrast reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2201-2214`
- **Quote:** §1t1523s0§.as:2644-2652  if(§1t7356s0§(§1t9426s0§) == 8) { §1t9713s0§(§1t9413s0§,100); ... } else { §1t9713s0§(§1t9413s0§,25); }   ///   :2653-2656  if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }   ///   android StatsManager.as:2201-2208  if(getPlayerStats(STAT_DAN) == 8) { changeStat(STAT_HGOLD,20); } else { changeStat(STAT_HGOLD,5); }
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy: §3.7's demotion of MAX_DAN_RANK and tenthGold to INFERRED should be reversed to CONTRACT (v0.717), and the wiki's kyudan reading rehabilitated. The currency is HGOLD (stat 12), so it still must not feed the coin purse.

### `skills-meters/web-stance-damage-ladder-and-crit-are-fully-transcribable` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete web v0.717 per-stance damage ladder, the crit rule and the Heavy defence penalty are all in one function and none of them are inferred: Light = base x (0.5 + 0.4 x lightMastery x 0.1) i.e. 0.5 -> 0.9; Balanced = base x (1 + 0.2 x balancedMastery x 0.1) i.e. 1.0 -> 1.2; Heavy, Dual and Reversed = base x 1.4 flat; at reload == maxreload the result is x1.3 plus the flat critical-damage stat; Heavy defence is x0.8. So 0.9/1.2/1.4 is the MASTERY-10 damage ceiling and the mastery curve is a transcription, not research.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 and :3284-3290`
- **Quote:** 3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
3262:                _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3265:                _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3270:                _loc2_ = _loc1_ * 1.4;
3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
3286:         if(this.stance == §1t12222s0§)
3288:            return defense * 0.8;
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** … → Either model the mastery curve or **decide-and-flag "the build targets mastery-9"** and label accordingly."
- **Lane impact:** L5 combat-core + L2 skills-meters: RR:157's fork is dead — there is no decision to make, the mastery curve is written down and should simply be transcribed. It also settles RR:190 blocker ② (crit 1.3 vs 3) from the web source rather than from the wiki: the multiplier is a literal 1.3 and it is DETERMINISTIC (fires iff reload == maxreload), which also answers RR:195 blocker ⑤ 'crit proc rule (chance vs deterministic) — entirely absent'. Note the Android ladder is DIFFERENT (0.5->1.0 / 1.0->1.5 / 1.5 flat, crit x1.5 or x1.2, mastery on a 0-100 scale) — do not seed config from the Android decompile.

### `stance/in-combat-switch-is-live-in-web-battleui` — HELD [A2] ⚑ OVERTURNS LEDGER

In-combat stance switching is LIVE in web v0.717 and wired in the BattleUI itself, not merely permitted by the player class: the battle HUD's stance-button handler calls canChangeStance() (reload >= 48), plays Snd_smallClick and calls nextStance(), and plays Snd_error on refusal — and the 48-frame Focus charge is deducted only inside if(isBattle()). None of the four stance claims in this packet cited the BattleUI half, which is the artifact that actually kills the ledger sentence.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479, with reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3160-3166 and the version stamp at §1t1523s0§.as:36`
- **Quote:** 468:      internal function §1t5207s0§() : *
470:         if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
472:            §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
473:            §1t1523s0§.§1t9586s0§().§1t4472s0§();
478:            §1t88s0§.instance.§1t1516s0§("Snd_error");
---
3162:            this.§1t4414s0§ -= 48;   // inside if(§1t1525s0§.§1t9948s0§())  == isBattle()
---
36:      public static var §1t9323s0§:Number = 0.717;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L2/L5: REBUILD_READINESS.md:158 must be rewritten, not softened. Ship the Focus-gated in-combat switch as ORIGINAL behaviour: gate reload >= 48, cost a flat 48, cycle Light->Balanced->Heavy->Light only, Snd_smallClick on success and Snd_error on refusal.

### `ui-hud/blocker-2-falls-entirely-no-pop-no-ramp` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker (2) 'dynamic HUD feel (bar tween vs snap, combo pop, vignette ramp) — uncatalogued' falls in all three parts. Bars SNAP (direct scaleX). The combo does NOT pop: the web payload's combo container is DefineSprite 3611 with ONE declared frame and four non-sprite children (shape 74 + DefineEditText 3608/3609/3610), so the widget is a static composition toggled by `visible`. The hit vignette does NOT ramp: DefineSprite 3607 (hurtred, 800x480) declares 7 frames and its timeline is PlaceObject2, five bare ShowFrames, then RemoveObject2 — a 6-frame flat hold = 0.25 s at 24 fps, then removed.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — my own tag walk of DefineSprite id 3611 and id 3607; playback calls at reference/decompiled/shs3_payload/scripts/§1t113s0§.as:498-500, :505 and :534-537; bar writes at §1t113s0§.as:320-323 and :326-333; art on disk at reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1-7.png`
- **Quote:** sprite 3611 frames 1 | Place depth 1 charid 74 (shape) | Place depth 2 charid 3608 (comboshadow) | Place depth 3 charid 3609 | Place depth 4 charid 3610 | ShowFrame | End
sprite 3607 frames 7 | Place tag 26 flags 0b110 | ShowFrame x5 | tag 28 (RemoveObject2) | ShowFrame
534:      public function §1t5214s0§() : *
536:         this.§1t5173s0§.visible = true;
537:         this.§1t5173s0§.gotoAndPlay(1);
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud + L6 art-anim-audio-feel: blocker (2) should be STRUCK. Config: bars are untweened continuous scaleX; combo number+shadow snap on/off with no scale or alpha motion; the hurt vignette is a 6-frame (0.25 s) flat flash whose art is already on disk at 800x480, then removed. No easing curves need to be invented for any of the three.

### `ui-hud/filmed-session-scale-is-2.27-not-2.25-THE-FRAME-WINS` — HELD [A1] ⚑ OVERTURNS LEDGER

The stage scale for the filmed session in reference/frames/duel_dense/ is 2.27-2.28 (FIT-WIDTH), not the 2.25 (fit-height + 8 px engine inset) that a code-only reading predicts. BattleUI.as:133 fixes the skill-slot pitch at exactly 60 game px, which makes the HUD its own ruler: the three slot centres measure 1503.5 / 1640.0 / 1777.0, a pitch of 136.5-137.0 frame px. The width-fit model (s=2.27, x0=52) predicts slot i=0 at 1777.2 against a measured 1777.0 — 0.2 px. The height-fit model (s=2.25, x0=60) predicts 1770.0 — 7.0 px out. The correct conversion is x_game = (x_frame - 52) / 2.27.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — pillarbox measured at x 52..1867 (content 1816x1080); slot-box dark runs measured in the band y 965..980, x 1400..1880 at luminance < 70 over >80% of the band; ruler from reference/decompiled/shs3_android/scripts/BattleUI.as:133`
- **Quote:** BattleUI.as:133:            skillSlotButton.x = 760 - i * 60;
--- measured in the frame ---
left (empty)  x 1457..1550  centre 1503.5
middle ('2')  x 1589..1691  centre 1640.0
right  ('3')  x 1726..1828  centre 1777.0
pitch 136.5 and 137.0 frame px for 60 game px  =>  s = 2.275..2.283
predicted i=0 centre: s=2.27,x0=52 -> 1777.2 (0.2 px)   s=2.25,x0=60 -> 1770.0 (7.0 px)
- **Overturns:** "① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.*"
- **Lane impact:** L8 ui-hud and every lane holding frame-measured coordinates. STANDING INVARIANT SAID OUT LOUD: the code-derived model and the frame disagree and THE FRAME WINS. resizeHandler gives the MECHANISM but not the BRANCH — the branch depends on the browser viewport aspect, which no artifact records, so it must be recovered per-video from an in-HUD ruler. BattleUI.as:133's 60-px slot pitch is that ruler and should become the standard calibration for every frame pass. Blocker ① is therefore answerable per-video, not closable from source alone.

### `ui-hud/longplay-frames-are-pillarboxed` — HELD [A1] ⚑ OVERTURNS LEDGER

The longplay frames ARE pillarboxed, which answers ledger blocker 1 outright: HUD x-fractions measured over the full 1920 px ARE wrong. On Nr4fQstqHDM_428.0.png (1920x1080) the non-black columns run 52..1867 while the rows run 0..1079, so the content is roughly 1815 x 1080 = 1.68 aspect, i.e. 5:3 - an 800x480 stage scaled by 2.25 with ~58 px black bars each side. The mapping game_x = (screen_x - 57) / 2.264 checks out against a known source constant: the three visible skill slots measure to game x 760.8 / 701.2 / 641.6, and the code says x = 760 - 60i.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, full-frame column/row luminance scan (max over RGB, threshold 18) plus slot-centre measurement at screen x 1777.5 / 1642.5 / 1507.5; cross-checked against reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170`
- **Quote:** non-black cols 52..1867, non-black rows 0..1079; column max luminance goes 0,0,0,2,0,0,0,0,4,2,8,151,153,... across x=0..75 and 184,197,178,177,173,148,10,4,2,... across x=1840..1880. §1t113s0§.as:170 `_loc1_.x = 760 - _loc2_ * 60;`
- **Overturns:** "① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.*"
- **Lane impact:** L-ui-hud: every HUD x-fraction in the corpus measured as x/1920 is compressed by ~5.5% and must be re-derived as (x-57)/1811. Blocker 1 is closed without a build.

### `ui-hud/payload-swf-stage-is-800x690` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md asserts twice that the native canvas is 800×480 (5:3). The only header we actually hold says otherwise: the decoded payload SWF declares a stage of 800 × 690 at 24.0 fps. Which stage the game VIEW uses is STILL_UNHELD — 690 may include HUD chrome the combat view does not — but the flat '800×480' assertion is unsupported by the artifact, and the ui-hud aspect-ratio blocker is reasoning from an unverified height.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — my own header parse: signature CWS, version 17, declared length 11,892,061, file 6,880,328 bytes; RECT → 800.0 × 690.0 twips/20; frameRate field 0x1800 → 24.0; frameCount 6. Contradicts docs/research/REBUILD_READINESS.md:117 and :171.`
- **Quote:** REBUILD_READINESS.md:117 — '**Aspect-ratio truth** — native canvas is **800×480 (5:3)**' · :171 — '**Native resolution is 800×480 (5:3)**, not 16:9'. Parsed header: CWS v17, stage 800.0 x 690.0, frameRate 24.000, 6,880,328 bytes.
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L8 UI-HUD blocker ①: the close-path 'read stage.stageWidth in a build' is already answerable from the header — width 800 is confirmed, height 480 is not. The 24.0 fps in the same header is what makes the 192-tick crit meter resolve to 6.000 s, so the header is load-bearing for combat too.

### `ui-hud/v0717-duel-nameplate-has-no-level` — HELD [A1] ⚑ OVERTURNS LEDGER

In the shipped web v0.717 build a duel opponent's nameplate is WHITE with NO level suffix — 'FUKUSHIMA CHIKO', not 'FUKUSHIMA CHIKO (N)'. Every android v0.682 white-plate call site formats a level in. The ledger's 'nameplate (N)=level' is right for overworld aggro plates (BANDIT (4), same corpus) and WRONG for web duel plates. THE FRAME WINS.

- **Cite:** `reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (1920x1080), crop (520,580)-(840,650) LANCZOS x4; contrast reference/decompiled/shs3_android/scripts/EnemyPlayer.as:776 and :881, EnemyElite.as:114, EnemyKanjiGuardian.as:59`
- **Quote:** On screen in v0.717: the opponent plate reads 'FUKUSHIMA CHIKO' in white over a green/red health bar — no parentheses, no digits anywhere in the crop. In the android payload: EnemyPlayer.as:776 `mcs.setDisplayName(xml.name + " (" + level + ")",namecolor);` · EnemyPlayer.as:881 `mcs.setDisplayName(this.charname + " (" + charlvl + ")",namecolor);` · EnemyElite.as:114 `mcs.setDisplayName(xml.name + " (" + level + ")",16777215);` · EnemyKanjiGuardian.as:59 `mcs.setDisplayName(this.charname + " (" + lvl + ")",16777215);`
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: kills the '(lvl)' clause in three of this packet's four nameplate claims for the web target, and gives the format rule a build split — red overworld plates carry the level, white duel plates do not. A recreation that appends '(N)' to a duel opponent's plate is visibly wrong against film.

### `ui-hud/web-battleui-is-1t113s0-and-owns-the-in-combat-stance-switch` — HELD [A2] ⚑ OVERTURNS LEDGER

§1t113s0§ is the web v0.717 BattleUI, and its handler at :468-478 is the in-combat stance switch: gated on §1t4470s0§(), it plays Snd_smallClick and calls nextStance on success and Snd_error on refusal. A hard lock does not ship an error beep on its refusal branch.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:293, :326, :468-478 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3175`
- **Quote:** §1t113s0§.as:468  internal function §1t5207s0§() : *
§1t113s0§.as:470     if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
§1t113s0§.as:472        §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
§1t113s0§.as:473        §1t1523s0§.§1t9586s0§().§1t4472s0§();
§1t113s0§.as:476     else
§1t113s0§.as:478        §1t88s0§.instance.§1t1516s0§("Snd_error");
§1t113s0§.as:293  public function §1t5198s0§() : *   (= android BattleUI.setStanceColor)
§1t113s0§.as:326  public function §1t5205s0§(param1:int, param2:int) : *   (= android BattleUI.updateReload)
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L2/L5/L7 ui-hud: this is the artifact that actually kills the HARD-LOCK line, independent of the mis-named §1t4470s0§ claim. The recreation's Focus-gated in-combat switch is FAITHFUL, not a 2014 throwback. Two documents must be struck: REBUILD_READINESS.md:158 and SHSD_MASTER_REFERENCE.md:388, the latter graded [CONTRACT].

### `ui-hud/web-battleui-stance-button-plays-an-error-sound-when-the-gate-refuses` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 BattleUI ships a stance button whose handler branches on canChangeStance(): on success it plays Snd_smallClick and runs the stance cycle, on failure it plays Snd_error. A build in which in-combat stance were hard-locked would not ship a refusal sound. This is the most direct available proof that the ledger's 'HARD-LOCKED / removed 2014 behavior' sentence is dead.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479, with the button binding at §1t406s0§.as:944 and the gate at §1t99s0§.as:3048-3051`
- **Quote:** 468:      internal function §1t5207s0§() : *
470:         if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
472:            §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
473:            §1t1523s0§.§1t9586s0§().§1t4472s0§();
474:            §1t1523s0§.stance = §1t1523s0§.§1t9586s0§().§1t4473s0§();
478:            §1t88s0§.instance.§1t1516s0§("Snd_error");
- **Overturns:** "4. **In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**."
- **Lane impact:** L5/L2: RR:158 must be struck, not softened. The recreation's Focus-gated in-combat switch is ORIGINAL behaviour, and it ships with two audio cues the rebuild should reproduce — Snd_smallClick on a legal switch, Snd_error on a refusal. Cross-lane to art-anim-audio-feel: these are two named SFX keys nobody has claimed.

### `world-exploration/farm-timers-and-patch-ladder` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The farming side of the gather blocker is also on disk. InteractUI_crops.as:116, :131, :146, :161 give four crop growth periods — 15 * 60, 60 * 60, 6 * 60 * 60 and 12 * 60 * 60 seconds, i.e. 15 minutes, 1 hour, 6 hours and 12 hours — each followed by a gracePeriod window before the crop is lost (:117-121, :132-136, :147-151, :162-166), with the same four values repeated in the planting path at :549-558. getPatchLevel() at :457-479 is a six-rank patch ladder that steps at 10, 20, 30, 40 and 50 cumulative harvests, and harvestedTimes is capped at 50 (:105-107). Yield rows per crop remain to be read out, but there is nothing structural left to guess.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:105-107, :116, :131, :146, :161, :457-479, :549-558`
- **Quote:** InteractUI_crops.as:116 `this.timePeriod = 15 * 60;` :131 `= 60 * 60;` :146 `= 6 * 60 * 60;` :161 `= 12 * 60 * 60;` · :459-479 patch level 1..6 at harvestedTimes < 10/20/30/40/50
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L10 world-exploration + L7 economy — the ledger treats farm tables as unmeasured. The timers, the grace window and the patch-level progression are all recoverable statically; only the per-crop yield rows still need a read-out. Also bears on :225 ③ (the real-world 'day' length), since 12h and 24h windows are hard-coded rather than server-defined here.

### `world-exploration/ore-node-respawn-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

The respawn third of the gather blocker is closed. Obj_OreDeposit.as:80-87 clearOre() calls StageManager.addToDeadList(objectName); StageManager.as:621-625 pushes the name onto roomDeadList, and GameStage.as:602-630 createRoomObjects suppresses any object whose name is in that list when the room is built. roomDeadList is emptied at StageManager.as:249 (initRooms) and :366 (node change). So a mined-out deposit repopulates the next time the node is entered — the respawn rule is 'per node visit', with the AP cost per swing as the only throttle. There is no timer and no server tick involved.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_OreDeposit.as:80-87; StageManager.as:249, :366, :621-625, :633-636; GameStage.as:602-630`
- **Quote:** Obj_OreDeposit.as:82 `StageManager.addToDeadList(objectName);` · StageManager.as:249 `roomDeadList.length = 0;` (in initRooms) and :366 `roomDeadList.length = 0;` (on node change)
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L10 world-exploration — with the packet's mining finding supplying yield, whiff and gates, this supplies respawn. Blocker ② is now closed for mining end to end and needs no measurement pass.

### `world/map-bitmap-is-held-byte-exact` — HELD [A2] ⚑ OVERTURNS LEDGER

THE WORLD MAP IS HELD, BYTE-EXACT, IN BOTH BUILDS. reference/extracted/bindata/92_1t4648s0.bin is a 63x72 GIF89a land mask with 735 non-black pixels in the unmistakable shape of the Japanese archipelago (Honshu, Hokkaido top-right, Kyushu/Shikoku bottom-left) — I decoded it with Pillow and rendered every pixel. It is byte-identical to the android blob reference/extracted/android/110_Mobile_MapBitmapData.bin: md5 13068dfa1a5cc5628720a25782f93fed on BOTH. Every non-zero pixel IS a territory. web: embedded at §1t4648s0§.as:5, loaded at §1t1524s0§.as:697-702, enumerated into territory ids at §1t1524s0§.as:716-739 ('push(x + 341 << 12 | y + 341)' for every non-zero pixel). android: embedded at Mobile_MapBitmapData.as:5, enumerated at QuestEngine.as:514-529. The world-bounds predicate is QuestEngine.as:1204-1207 hasTerritory(x,y), using WarSelectUI.TERRSHIFTX=21, TERRSHIFTY=51, WARMARKERSHIFTX=8 — the same 21/51 origin the ledger already records at REBUILD_READINESS.md:224. So the map spans display territory x in [-13,49], y in [-51,20], 735 land territories. This is the single largest unheld item this packet touches and none of its four world-exploration findings cites the file.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin + reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:716-739 + reference/decompiled/shs3_android/scripts/QuestEngine.as:1204-1207`
- **Quote:** §1t1524s0§.as:721  §1t7958s0§ = Bitmap(LoaderInfo(param1.target).content).bitmapData;  ||  :731 if(§1t7958s0§.getPixel(_loc6_,_loc7_) != 0)  ||  :734 _loc3_ = _loc7_ - §1t6481s0§.§1t12537s0§;  ||  QuestEngine.as:522 if(mapBitmapData.getPixel(i,j) != 0)  :526 warMarkerList.push(terrX + 341 << 12 | terrY + 341);  ||  QuestEngine.as:1206 return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L8 world-exploration blocker ① at REBUILD_READINESS.md:225 dies OUTRIGHT. The parenthetical was right — it IS a sparse Japan outline, not a WxH grid — but the close-path is obsolete: we do not need to mine the Fandom API and we do not need to trace anything, because we hold the map image itself, in both builds, byte-identical. Recreation needs: the 735-pixel mask, the 21/51/8 shift constants, the id packing (x+341 << 12 | y+341), and hasTerritory() as the bounds test. This also finally reconciles with the ledger's own :224 'territory/sector coord system (start 21,51 / 0,3)'.

### `world/war-map-is-already-on-film` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The War Room / SELECT TERRITORY world map is already captured in the repo: a flat-vector sparse Japan outline under a uniform grid overlay, with a clan flag marker — which is precisely the artifact the ledger's world-exploration blocker ① sends someone to Fandom to find.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (1024x576; crop (20,30)-(720,420) @2x LANCZOS)`
- **Quote:** On screen: 'SELECT TERRITORY' with 'ZOOM IN' and 'HELP' buttons, 'CLAN CROPS: 402 (+2 HQ)', a brown flat-vector coastline of Honshu / Shikoku / Kyushu with Sado and the Izu island chain rendered as separate blobs, a regular square GRID ruled over the whole board, and a single red clan flag planted mid-Honshu. The right rail reads 'WAR ROOM'.
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** world-exploration ① and meta-social ② (:245 'War-Room map topology (board/adjacency)'): the close-path both blockers prescribe — go find and trace the map image — is already satisfiable from held material. PARTIAL because the capture is 1024x576, so the grid resolution is readable but the per-sector labels are not; a ZOOM IN frame would close it outright.

### `NF-1-layered-music-is-both-builds` — HELD [A2]

The 13-stem / 18-layer-mask adaptive music system is WEB v0.717 parity, not android-only. The web payload's MusicManager loads the identical 13 stem names in the identical TRACK order (battlechants, battledrums, flutes, safeambience, safekoto, safepercussion, dungeonambience, dungeonflute, dungeonpercussion, dungeonpiano, bgm_gangnam, bgm_levelup, bgm_lose), declares TOTALTRACKS = 13, and builds 18 boolean preset arrays over them. This upgrades music-is-13-stems-and-18-layer-presets and NEW-music-is-layered-stems-not-tracks from 'android v0.682' to 'both builds' — the ARCHITECTURE is target-build fact even though the waveforms are v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t133s0§.as:115-127 (stem loads), :76 (§1t1730s0§:int = 13), :135-184 (18 preset arrays)`
- **Quote:** §1t133s0§.as:115 this.§1t1735s0§[this.§1t1717s0§] = §1t1522s0§.§1t9319s0§("battlechants"); … :127 …("bgm_lose");  ·  :76 internal var §1t1730s0§:int = 13;  ·  grep -c "= new Array(this.§1t1730s0§)" → 18
- **Lane impact:** L6 art-anim-audio-feel: removes the v0.682 caveat from the music-system claims. A WebAudio recreation should crossfade 13 loop-locked layers under an 18-state mask, and that is now a WEB-build fact.

### `NF-1-web-gameplay-canvas-really-is-800x480` — HELD [A2]

The web v0.717 build's own code sets the gameplay canvas to 800x480, so the 800x690 SWF document rect is chrome, not canvas. §1t1523s0§.as:104 `public static var stageWidth:int = 800;` and :106 `public static var stageHeight:int = 480;` (a second 800/480 pair at :120/:122). This BLOCKS any rewrite of REBUILD_READINESS.md:117 ('native canvas is 800x480 (5:3)') and separately ANSWERS ui-hud blocker 1 at :235 ('read stage.stageWidth in a build') in the ledger's favour. The extra 210 px in the document rect is the Kongregate friend-bar band.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104, :106`
- **Quote:** public static var stageWidth:int = 800;   /   public static var stageHeight:int = 480;
- **Overturns:** "- **Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud: blocker 1 is CLOSED in the ledger's favour rather than overturned. Also corrects the over-reach in art-anim-audio-feel/web-swf-header-is-24fps-and-800x690's lane_impact.

### `NF-10-no-web-audio-is-held` — STILL_UNHELD [A3]

No WEB audio exists in this repo, so the 26 recovered waveforms cannot be claimed as v0.717 assets. reference/preservation/ holds only shs3.swf, shs3preloader.swf, shs3_payload.swf, shs3_android_payload.swf and shs3_payload_version.swf — no soundresource.swf and no musicresource.swf, the two CDN files ResourceManager names. Neither decoded payload embeds a single sound: I parsed both tag streams (web 4,051 tags, android 3,311 tags) and DefineSound(14) = 0 in each. The web build streamed its audio from the dead strawhatsamuraiduels.com CDN.

- **Cite:** `reference/preservation/ (directory listing) + my tag histogram of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf + reference/decompiled/shs3_android/scripts/ResourceManager.as:41`
- **Quote:** shs3_payload_decoded.swf ntags 4051 DefineSound(14): 0 · shs3_android_payload_decoded.swf ntags 3311 DefineSound(14): 0  ·  ResourceManager.as:41 resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"]
- **Lane impact:** L6 art-anim-audio-feel: the caveat that must ride with every audio overturn, and the wording S0-5 should have had instead of 'you may not claim audio is recovered'. Same caveat applies to shipped-vector-art-yields-solid-fill-palettes — 115/120/124 are v0.682 resource files.

### `NF-11-negative-grep-in-v0717-stance-slash-multipliers-is-false` — HELD [A2]

A load-bearing negative grep in one packet finding is itself wrong. combat-core/v0717-stance-slash-multipliers dismisses another survey on the grounds that its grep terms '0.005' and '0.5 + 0.5 *' 'exist in neither build'. The second term occurs FOUR TIMES in the android build. Only '0.005' is genuinely absent from both. A dismissal built on a false negative grep is the same error twice, and the survey it kills should be re-opened.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3052, :3205 and InventoryUI.as:1945, :1966`
- **Quote:** MCSPlayer.as:3052 `this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);` · :3205 `maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01);` · InventoryUI.as:1945 `dmgModifier = 0.5 + 0.5 * mastery * 0.01;` · :1966 `slashModifier = 0.5 + 0.5 * mastery * 0.01;`
- **Lane impact:** L1 combat-core: reinstates rebirth/stance-slash-multipliers-parity's PARTIAL rather than letting it be killed. (Note: v0717-stance-slash-multipliers rotated OUT of this packet mid-review; I had already judged it HELD with this defect.)

### `NF-12-shape-fill-histogram-is-slot-frequency-not-area` — HELD [A3]

A limit the vector-art finding does not state, which would mislead a builder. Its fill histograms count entries in each shape's FILLSTYLEARRAY, so '#000000 x243' means 243 shape records DECLARE a black fill slot — not that black covers the most pixels. Rendered-area ranking would need edge records and shape geometry, which neither of us parsed. My independent parse of the same three files reproduces the ranking exactly and the mid-table counts exactly (#333333 x160, #CCCCCC x147, #FECA98 x127, #B78F6C x120 in 115; #30291D x35, #5A4D2E x33, #3A3323 x23, #251F16 x21, #453929 x21 in 120), which is why I judged the finding HELD — but the label matters.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin, 120_Mobile_BGResource.bin, 124_Mobile_ImageResource.bin decrypted (keys 104/103/109) — my own DefineShape/2/3/4 FILLSTYLEARRAY parse`
- **Quote:** 115: 1755 shape records (2:127, 22:26, 32:8, 83:1594), 1669 with solid fills, 1912 SymbolClass names · 120: 562 records, 516 with solid fills · 124: 106 records, 99 with solid fills · torso4000 → charId 1195 → shape 1194 fills ['#FECA98','#B78F6C']
- **Lane impact:** L6 art-anim: these ARE exact OG hues and are far better than eyedropper reads off compressed video — but harvest them per-symbol (torso4000, skill1000, acc3000 all resolve cleanly), never as a global 'most-used colour' ranking.

### `NF-2-animdata-hold-table-is-both-builds` — HELD [A2]

The hard-coded per-animation duration-tail table is in the WEB payload too, so the pose-latch spec is a both-builds fact rather than an android inference. Same tail groups: 13 *SLASH_POSE at +10, 10 *FALLSLASH_END/*JUMPSLASH_LAND at +15, the sheathesword pair at +24, the six-death-anim set at +6, +48, +50, and the five +24 skill poses. The web build states the latch even more cleanly than android: its frame getter CLAMPS to the last frame rather than guarding on length. Web adds one tail entry android lacks and drops 'light_afterslashpose'.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t783s0§.as:17, :27-146, :149-156 (vs reference/decompiled/shs3_android/scripts/AnimData.as:15, :23-141)`
- **Quote:** §1t783s0§.as:17 this.duration = param1.@d;  ·  :27 switch(param1.@i.toString())  ·  :29-42 thirteen cases → this.duration += 10;  ·  :44-54 ten cases → += 15;  ·  :56-58 §1t10261s0§/§1t10263s0§ ("sheathesword"/"sheathesword3") → += 24;  ·  :149-156 if(param1 >= this.§1t787s0§) { param1 = this.§1t787s0§ - 1; } return this.§1t784s0§[param1];
- **Lane impact:** L6 art-anim: the recovery-window spec for every slash is (@d from data) + (this table's tail), ticked at 24 Hz, in the TARGET build. Bank it as the pose-latch row REBUILD_READINESS.md:239 asserts is Ready but never contains.

### `NF-2-recovered-audio-is-android-only-web-audio-still-unheld` — HELD [A3]

The 26 byte-exact waveforms recovered by the ResourceManager decrypt are ANDROID v0.682 assets only. My own tag walk of the decoded WEB payload returns DefineSound (tag 14) = 0 and DefineBinaryData (tag 87) = 27 — the 27 matching S0-1's count of web bindata files, which validates the parser. A filesystem sweep of reference/ finds no web-side *SoundResource* or *MusicResource* container at all. So S0-5 falls, but only for Android; web v0.717 audio parity is STILL_UNHELD and every audio claim must carry that caveat.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf (my own SWF tag walk: DefineSound=0, DefineBinaryData=27)`
- **Quote:** web payload tag histogram: DefineSound(14) count: 0 · DefineBinaryData(87): 27
- **Lane impact:** L6 art-anim-audio-feel: blocker 1 closes for the ANDROID build's waveforms. The web build's own audio containers are not in this repo, so a 1:1 web-audio claim remains unheld.

### `NF-2/coins-and-gold-are-two-onscreen-currencies` — HELD [A1]

COINS and GOLD are two distinct on-screen readouts and the mapping is now pinned: STAT id 11 renders as COINS, STAT id 12 (HGOLD) renders as GOLD. A frame shows both side by side with a GET GOLD button, and character creation sets stat 11 = 100 / stat 12 = 3, which is the ledger's own '100c/3g guest start'. Any 'gold' figure taken from StatsManager.getGold()/changeGold() is therefore a COIN figure.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0027.jpg (1024x576, top strip x2 LANCZOS) + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1023-1024 + reference/decompiled/shs3_android/scripts/StatsManager.as:192, :2627-2664 + docs/research/REBUILD_READINESS.md:79-80`
- **Quote:** Visibly in the crop: a silver coin icon with '480' over the label 'COINS', a '+' button, a gold coin icon with '2' over the label 'GOLD', a red 'GET GOLD' button, and at right a level badge '7' beside '14901 / 16350 EXPERIENCE POINTS'.  ·  §1t1523s0§.as:1023 `§1t7357s0§(§1t9412s0§,100);` :1024 `§1t7357s0§(§1t9413s0§,3);` (§1t9412s0§=11, §1t9413s0§=12)  ·  StatsManager.as:2651 `public static function isCoinPurseFull() : Boolean` :2653 `return getPlayerStats(STAT_GOLD) >= getMaxCoins();`
- **Lane impact:** L4 economy + ui-hud — every service price sourced from getGold()/changeGold() must be encoded in COINS, not premium Gold; only STAT_HGOLD is the premium currency.

### `NF-3-obfuscated-web-payload-is-symbol-mappable-by-call-signature` — HELD [A2]

The obfuscated web payload can be symbol-mapped against the Android build by matching call signatures, which is what makes the whole combat-core cluster admissible instead of inferred. §1t99s0§.as:183-199 assigns fifteen params in the order controlledBy, hp, maxhp, chi, maxchi, defense, baseReload, minDamage, damageRange, §1t4420s0§, slashUsage, §1t4421s0§, §1t4422s0§, §1t4423s0§, level — param-for-param identical to shs3_android_payload/scripts/StatsManager.as:1834 `player.initPlayer(0,…,getBaseSlashLength(),getSlashUsage(),getStat(1000),getStat(1001),getStat(1002),getLevel())`. That pins §1t4420s0§ = baseSlashLength and §1t4421/4422/4423s0§ = light/balanced/heavy mastery. §1t99s0§ is further identified as the desktop MCSPlayer because it defines §1t4446s0§, the initElementDefenseStats callee at §1t1523s0§.as:2270.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:183-199 against reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1834`
- **Quote:** this.§1t4420s0§ = param10; this.slashUsage = param11; this.§1t4421s0§ = param12; this.§1t4422s0§ = param13; this.§1t4423s0§ = param14; this.level = param15;   ||   player.initPlayer(0,…,getBaseSlashLength(),getSlashUsage(),getStat(1000),getStat(1001),getStat(1002),getLevel());
- **Lane impact:** Method note for the whole gauntlet: Android-derived constants can be CHECKED IN THE WEB BUILD by structural/signature match even with the symbol names gone. Every combat-core verdict in this packet rests on it.

### `NF-4-live-bug-launch-unlock-level-heavy` — HELD [A2]

LIVE CONFIG BUG. src/config/stances.ts:61 sets LAUNCH_UNLOCK_LEVEL.heavy = 5, but BOTH builds gate the heavy launch at mastery 3. Web §1t99s0§.as:3239 `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` (heavy canLaunch) and android MCSPlayer.as:3182 `this.canLaunch = this.heavyMastery >= 3;`. Balanced is >= 5 in both (:3233 / :3176) and light >= 3 in both (:3223 / :3166), so only the heavy row is wrong — and the whole table can be promoted INFERRED -> CONTRACT-SRC in the same edit. No packet claim's text asserts this; it appears only inside one lane_impact, so it is currently un-banked.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3239 and reference/decompiled/shs3_android/scripts/MCSPlayer.as:3182`
- **Quote:** WEB §1t99s0§.as:3239 `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` · ANDROID MCSPlayer.as:3182 `this.canLaunch = this.heavyMastery >= 3;` · src/config/stances.ts:61 `heavy: 5,`
- **Lane impact:** L5 combat-core: one-line config fix plus a label promotion. This lane is NO-TOUCH for source, so it is a queued code task, not an edit.

### `NF-5-v0682-charsheet-contradicts-its-own-crit` — HELD [A2]

v0.682's character sheet displays a crit multiplier its own combat code does not produce. InventoryUI sets critModifier Light 1.2 / Balanced 1.5 / Heavy 1.5, but MCSPlayer.getDamage applies x1.2 to every stance EXCEPT Light and x1.5 to Light — exactly inverted. This makes the crit column of the stance-modifier table unusable as a source, in either build. (Moot for the target build: v0.717 is a flat x1.3 with no stance branch at §1t99s0§.as:3272-3276.)

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1946, :1955, :1964 vs MCSPlayer.as:3215-3221`
- **Quote:** InventoryUI.as:1946 critModifier = 1.2; (LIGHT) · :1955 critModifier = 1.5; (BALANCED) · :1964 critModifier = 1.5; (HEAVY)   ||   MCSPlayer.as:3215-3221 if(this.reload == this.maxreload) { if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; } return maxDamage * 1.5 + this.STAT_CRITICALDMG; }
- **Lane impact:** L1 combat-core: a guard-rail on combat-core/stance-modifier-table-in-payload. Ship its dmg/def/slash columns, never its crit column.

### `NF-5-v0717-crit-is-flat-do-not-port-android-crit-column` — HELD [A2]

Any per-stance crit table sourced from the Android InventoryUI is v0.682-only and must not be shipped against a v0.717 target. Web: the character sheet sets crit 1.3 in all three stance branches (§1t5957s0§.as:2727, :2736, :2745) and getDamage applies `_loc2_ * 1.3 + <flat crit-dmg stat>` with no stance branch (§1t99s0§.as:3274). Android: MCSPlayer.as:3215-3222 returns `maxDamage * 1.2 + STAT_CRITICALDMG` for non-Light and `* 1.5` for Light, and InventoryUI.as:1946/1955/1964 set critModifier 1.2 / 1.5 / 1.5. Android also uses Heavy dmgModifier 1.5 vs web 1.4.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2727, :2736, :2745 against reference/decompiled/shs3_android/scripts/InventoryUI.as:1946, :1955, :1964`
- **Quote:** WEB _loc42_ = 1.3; (all three stance branches)  ||  ANDROID critModifier = 1.2; (light) / 1.5; (balanced) / 1.5; (heavy)
- **Lane impact:** L5 combat-core: hard guard-rail on combat-core/stance-modifier-table-in-payload. src/config/combat.ts:17 CRIT_MULT = 1.3 is already correct for the target build.

### `NF-6-xp-array-runs-past-the-level-cap` — HELD [A2]

The recovered XP table is 99 entries (indices 0..98, last 29,395,800) but the level cap is 80 in both builds: §1t1523s0§.as:362 `public static const §1t9470s0§:int = 80;` and android StatsManager.as:76 `public static var levelCap:int = 80;`. Indices 81..98 are shipped-but-unreachable tail data. A rebuild should paste the whole array for fidelity but cap progression at 80 rather than treating 98 as the cap.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362, :364 and reference/decompiled/shs3_android/scripts/StatsManager.as:76, :78`
- **Quote:** public static const §1t9470s0§:int = 80;  ·  expArray = [0,550,…] len 99, idx80 = 4285800, idx98 = 29395800  ·  public static var levelCap:int = 80;
- **Lane impact:** L-progression: rides with NEW-3. Do not let the 99-entry array be read as a level-98 cap when the ledger's 'cap 80' Ready item at :199 is correct.

### `NF-7-800x690-is-the-friend-bar-layout` — HELD [A2]

The web SWF's 800x690 document rect is the friend-bar layout, NOT a second native canvas, so REBUILD_READINESS.md:117's 'native canvas is 800×480 (5:3)' SURVIVES. The web payload carries the same resize handler as the android build, naming 690 explicitly as height-with-bar, and its own stage constants are 800 x 480. What IS new is that a second layout mode exists, gated by a stageShowingFriendBar flag.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273 and §1t1523s0§.as:104, :106 (android twin: reference/decompiled/shs3_android/scripts/GameEngine.as:269-271)`
- **Quote:** web §1t1540s0§.as:271-273 `var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690;`  ·  android GameEngine.as:269-271 `var originalWidth:int = 800; var originalHeight:int = 480; var originalHeightWithBar:int = 690;`  ·  web §1t1523s0§.as:104 `stageWidth:int = 800;` :106 `stageHeight:int = 480;`
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-compressed."
- **Lane impact:** L10 ui-hud: this REFUSES half of web-swf-header-is-24fps-and-800x690's overturn. Do not delete the 800×480 line; add a friend-bar layout mode beside it. The x dimension is 800 in both modes, so the pillarbox worry about x-fractions is untouched.

### `NF-9-345-and-200-are-already-ruled-placeholders` — HELD [A4]

Both of the reach numbers this lane keeps re-litigating were ruled inadmissible on 2026-07-25 by the repo's own fidelity ledger, which outranks REBUILD_READINESS.md under that document's own precedence clause (:11-14). 'slash distance: 345 (heavy)' is named as Flash-IDE dummy text beside 'physical dmg: 1234 - 1235', 'hp: 123 / 123' and 'chi: 123 / 434'; and the wiki's 'Balanced reach = 200' is traced to a static initialiser that setStance overwrites on every call. I verified the initialiser exists.

- **Cite:** `docs/research/fidelity/SOURCE_CONSTANTS.md:31-40 (which itself cites the payload), carrying reference/decompiled/shs3_android/scripts/InputManager.as:51 and :108`
- **Quote:** SOURCE_CONSTANTS.md:33-36 '1. **Static UI mockup text.** The payload contains Flash-IDE dummy strings: `slash distance: 345 (heavy)` · `physical dmg: 1234 - 1235` · `hp: 123 / 123` · `chi: 123 / 434`. A naive read hands you "Balanced reach = 345". **Nothing sourced from a static text field is admissible.**' · :37-40 '**`maxDistance = 200`, the static initialiser.** … **It is almost certainly the origin of the wiki's "Balanced reach = 200"**'  ·  InputManager.as:51 `internal static var maxDistance:int = 200;` :108 `maxDistance = num;`
- **Lane impact:** L1 combat-core: kills slash-distance-is-player-visible's 'open discrepancy' framing, and caveats the POSITIVE half of the three mastery-zero findings — write the ledger fix as 'the reach table is not a mastery-9 ceiling; reach is a formula', not as '300/200/100 = mastery-0'.

### `cite04/bar-equals-stance-gate-is-web-only` — HELD [A2]

The identity 'the Focus bar reads zero exactly when the stance change is refused' is a WEB-ONLY property and is an eighth android-vs-web divergence row. Web v0.717 uses a hard 48 in three places - the bar's render dead zone, the canChangeStance predicate and the nextStance early-return. Android v0.682 uses 24 for the bar's dead zone but gates nextStance at maxreload/6 = 20 of 120, so on android the bar can read zero while the stance change is still legal (reload 20-23) and vice versa. A recreation that ports the android numbers will produce a HUD that lies about the gate.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3050, :3060; reference/decompiled/shs3_android/scripts/MCSPlayer.as:1163, :1168, :2977`
- **Quote:** web §1t113s0§.as:328 'var _loc3_:Number = (param1 - 48) / (param2 - 48);' · §1t99s0§.as:3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;' · :3060 'if(this.§1t4414s0§ < 48)' then 'return;'  ||  android MCSPlayer.as:1163 'this.tempreload = this.reload - 24;' :1168 'updateReload(this.tempreload / (this.maxreload - 24))' · :2977 'if(this.reload < this.maxreload / 6)' then :2979 'return;'
- **Lane impact:** L-ui-hud and L-skills-meters: one predicate, value 48, drives the bar fill, the stance gate and the CANNOT CHANGE STANCE label in v0.717. Add as a build-divergence row.

### `cite04/buff-attack-scales-mindamage-only` — HELD [A2]

BUFF_ATTACK does not multiply damage by 1.5 - it multiplies the minDamage FLOOR by 1.5 and leaves damageRange untouched. Damage rolls as minDamage + random()*damageRange, so under the buff the expected damage rises by 1.5*minDamage - minDamage, i.e. strictly LESS than a 1.5x total unless damageRange is zero. Consequence for the contaminated duel_dense footage: it is inflated, but 'divide by 1.5' is the wrong correction and would under-report the true TTK. The same is true of BUFF_INJURED (x0.5 on minDamage and defense and baseSlashLength) and BUFF_DEFENSE (x1.5 on defense only).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:191-192, :208-223, :3201; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:209-224`
- **Quote:** MCSPlayer.as:210 'if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK))' :212 'this.minDamage *= 1.5;' · :191 'this.minDamage = minDamage;' :192 'this.damageRange = damageRange;' · :3201 'var baseDamage:int = this.minDamage + Math.random() * this.damageRange;'  ||  web §1t99s0§.as:211-213 same three lines under the obfuscated buff test
- **Lane impact:** All video-measurement lanes: the duel_dense contamination correction is NOT a flat /1.5. It cannot be applied at all until minDamage and damageRange for that loadout are known.

### `cite04/three-war-room-decks-disagree` — HELD [A2]

There are THREE different war-room rules decks in the evidence, and only aligning them licenses reading the 24-hour tick onto the web build. (a) android v0.682 string table: SIX pages, 5/6 = rank, 6/6 = building structures. (b) web v0.717 on film: SEVEN pages. (c) reference/extracted/ui_strings.txt: a six-page deck whose 5/6 is 'WINNING AND LOSING' and 6/6 is 'rank' - and the phrase 'winning and losing' appears NOWHERE in the 2,533-entry android table. Because web pages 1/7, 3/7 and 6/7 carry the android 1, 3 and 6 bodies in the same positions, the extra web page must sit at position 7, so android page 4 ('Troops will advance on enemy sectors every 24 hours') is web page 4/7. The extra page is most likely WINNING AND LOSING.

- **Cite:** `docs/gauntlet/L0/index/strings.json["369"],["371"],["373"],["375"],["377"],["379"]; reference/extracted/ui_strings.txt:189-194; reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg (each @2x LANCZOS, whole frame)`
- **Quote:** strings.json["377"] = 'War room rules 5/6  (rank)' · ["379"] = 'War room rules 6/6  (building structures)'  ||  ui_strings.txt:193 'War room rules 5/6 &nbsp;(WINNING AND LOSING)' :194 'War room rules 6/6 &nbsp;(rank)'  ||  on film: frame_0011 'WAR ROOM RULES 1/7 (JOINING A BATTLE)', frame_0012 'WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)', frame_0013 'WAR ROOM RULES 6/7 (BUILDING STRUCTURES)'
- **Lane impact:** L-meta-social: the war-room rules deck is 7 pages in v0.717, page 7 is unfilmed and unnamed in the android table, and the deck alignment is what makes android string bodies safe to port for pages 1-6.

### `cite04/web-crit-label-and-sfx-symbol` — HELD [A2]

The full-bar crit has a named readout and a named sound in the web build: the label under the Focus bar switches to getString(175) = 'Critical Hit' the moment the bar reaches 1.0, and the client plays the sound symbol 'Snd_criticalDamage' on that same transition. This corroborates itemdata-hunter/full-bar-is-the-crit (which is android-only) for the build we are recreating, and it names an audio symbol - useful given S0-5 says the audio is held but encrypted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111, :348-358; docs/gauntlet/L0/index/strings.json["175"]`
- **Quote:** §1t113s0§.as:110 'this.§1t5203s0§ = "<font color=\'#000000\'>" + §1t1521s0§.getString(175) + "</font>";' · :348 'else if(_loc3_ >= 1)' :352 '§1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");' · strings.json["175"] = 'Critical Hit'
- **Lane impact:** L-ui-hud and L-art-anim-audio-feel: the third-bar label has three states (CANNOT CHANGE STANCE / blank / Critical Hit) and the crit transition carries an SFX cue with a known symbol name.

### `combat-core/stance-constant-identity-is-pinned-by-hud-colour` — HELD [A2]

The web build's five obfuscated stance constants can be identified without guessing, by matching each case's HUD stance-colour argument against the android build's named cases. §1t12220s0§=LIGHT (colour 1), §1t12221s0§=BALANCED (colour 2), §1t12222s0§=HEAVY (colour 3), §1t12223s0§=DUAL (base ×1, floor 100, colour 3), §1t12224s0§=REVERSED (base ×1.4, colour 2).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3093-3155 (each case's §1t113s0§.instance.§1t5208s0§(n) argument) against reference/decompiled/shs3_android/scripts/MCSPlayer.as:3027-3091 (each named case's BattleUI.instance.setStanceColor(n))`
- **Quote:** web :3142 case §1t12223s0§ → this.§1t4417s0§ = this.§1t4420s0§; floor 100; §1t5208s0§(3)   ≡   android :3077 case DUAL_STANCE → this.slashLength = this.baseSlashLength; floor 100; setStanceColor(3)   ///   web :3131 case §1t12224s0§ → ... * 1.4; §1t5208s0§(2)   ≡   android :3066 case REVERSED_STANCE → this.slashLength = this.baseSlashLength * 1.5; setStanceColor(2)
- **Lane impact:** L5 combat-core: this is the method that makes any web-bundle stance claim checkable rather than asserted, and it is what let me confirm the packet's Dual/Reversed assignment independently. Generalisable — the HUD-argument fingerprint pins obfuscated enum constants wherever a named android twin exists.

### `combat-core/stance-gate-is-a-flat-48-tick-toll` — HELD [A2]

Changing stance is gated and paid in the SAME meter as the crit: it requires reload >= 48 and deducts a flat 48 ticks — and 48 is exactly the number the HUD bar hides, so 'bar reads zero' and 'cannot change stance' are the same condition by construction.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :3050, :3060, :3162 + §1t113s0§.as:328 and :336-342`
- **Quote:** :103  internal var §1t4419s0§:int = 48;   ///   :3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;   ///   :3060  if(this.§1t4414s0§ < 48)   ///   :3162  this.§1t4414s0§ -= 48;   ///   §1t113s0§.as:328  var _loc3_:Number = (param1 - 48) / (param2 - 48);   ///   :336-342  if(_loc3_ == 0) { ... this.§1t5169s0§.htmlText = this.§1t5204s0§; this.§1t5169s0§.visible = true; }
- **Lane impact:** L5 + L8 — explains COMBAT_MEASUREMENTS f-7's 'the message replaces the bar in the same slot' from the source side, and gives the exact Focus economy: 192-tick meter, 144 shown, 48-tick stance toll.

### `combat-core/web-android-combat-tuning-diverges-on-four-constants` — HELD [A2]

Web v0.717 and android v0.682 differ on FOUR independently-read combat constants, not one: crit meter length (192 vs 120), crit multiplier (flat 1.3 vs split 1.2/1.5), heavy damage (1.4 vs 1.5) and light reach (1.4 vs 1.5). Plus a fifth outside combat: the duel-token cap constant (40 vs 30).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :3274, :3270, :3094 and §1t1523s0§.as:200 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :3215-3221, :3213, :3030 and StatsManager.as:166`
- **Quote:** web §1t99s0§.as:249 `this.§1t4415s0§ = 8 * 24;` vs android MCSPlayer.as:239 `this.maxreload = 5 * 24;`   ///   web :3274 `return _loc2_ * 1.3 + this.§1t1243s0§;` vs android :3219/:3221 `return maxDamage * 1.2 + this.STAT_CRITICALDMG;` / `return maxDamage * 1.5 + this.STAT_CRITICALDMG;`   ///   web :3270 `_loc2_ = _loc1_ * 1.4;` vs android :3213 `maxDamage = baseDamage * 1.5;`   ///   web :3094 `* 1.4` vs android :3030 `* 1.5`   ///   web §1t1523s0§.as:200 `= 40` vs android StatsManager.as:166 `MAXDUELTOKENS:int = 30`
- **Lane impact:** L5 + every lane citing android source — the S0 caveat's 'combat tuning parity is NOT established' is now positively DISPROVEN, with five counted counterexamples. Any android combat constant must be re-read in shs3_payload before it ships.

### `combat-core/web-calcxp-is-verbatim-in-v0717` — HELD [A2]

The XP model is NOT android-only: the web v0.717 build carries calcXP, getGreyLevel and getZeroDifference verbatim, so the two zero cut-offs, the +5%-per-level-under bonus, the zero-difference decay and the elite x2 doubler are all CONTRACT at the target build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (greyLevel), :131-183 (zeroDifference), :185-209 (calcXP) vs reference/decompiled/shs3_android/scripts/NPC.as:94-110, :112-164, :166-190`
- **Quote:** §1t68s0§.as:187-194  if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; }   ///   :198  _loc5_ = param3 * (1 + 0.05 * (param2 - param1));   ///   :202  _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§());   ///   :204-207  if(param4) { _loc5_ *= 2; }
- **Lane impact:** L4/L10 — closes the build-parity hole on economy/calcxp-hard-cutoffs. The XP law can be labelled CONTRACT (0.717), not CONTRACT-SRC (0.682).

### `combat/projectile-gravity-has-web-parity` — HELD [A2]

The projectile gravity constant and the archer/thrower ballistic solve are NOT android-only: the WEB v0.717 build carries GRAVITY = 3 and the identical solve, including the same fire height (y-60), the same 0.866 factor and the same uniform +-4 aim jitter. The android-only build caveat on the archer-physics claim can be retired for the gravity constant and the trajectory maths.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t128s0§.as:8; reference/decompiled/shs3_payload/scripts/§1t4539s0§.as:551-565 (and the twin at §1t4545s0§.as:470)`
- **Quote:** §1t128s0§.as:8   internal static var §1t12543s0§:Number = 3;
§1t4539s0§.as:552  var _loc2_:int = mcs.y - 60;
:555  var _loc5_:Number = §1t128s0§.§1t12543s0§ * Math.abs(_loc3_ - _loc1_) / 0.866;
:557  var _loc6_:Number = _loc5_ * 0.866;
:559  var _loc8_:Number = (_loc4_ - _loc2_ - 0.5 * §1t128s0§.§1t12543s0§ * _loc7_ * _loc7_) / _loc7_;
:564  _loc8_ += Math.random() * 8 - 4;
- **Lane impact:** L7 enemies-ai / L1 combat-core: the gravity constant 3 px/frame^2 and the ballistic solve can be promoted to CONTRACT from the filmed build rather than carried as an android-only inference. One thing NOT established: the web call at :565 passes five args plus this, with no doLaunch flag, so the level>50 knockdown coin flip has not been shown to have web parity.

### `combat/slashlength-is-arc-length-not-radius` — HELD [A2]

slashLength / InputManager.maxDistance is an ARC-LENGTH budget for the drawn line, not a radial reach. InputManager.as:198 seeds distanceLeft = maxDistance on mouse-down; :353-367 subtracts Math.sqrt of each mouse-move segment's squared displacement along the drawn polyline, and the trail's line thickness tapers as ((maxDistance - distanceLeft) / maxDistance). Coordinates are game-stage space: (args.stageX - StatsManager.stageOffsetX) / StatsManager.stageScale. So the stance 'reach cap' caps HOW LONG A LINE YOU MAY DRAW in stage px, not how far the blade extends from the body. Any recreation that models it as a radius will feel wrong on curved and zig-zag slashes, and the ledger's close-path ('measure blade-FX tip-to-body span from footage') was asking for a different quantity from the one the code caps.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:106-108, :198, :353-367`
- **Quote:** InputManager.as:198  distanceLeft = maxDistance;  ||  :353 if(mousePressed && distanceLeft > 0 && !BattleUI.instance.isDraggingSkill())  ||  :362 distanceTravelled = Math.sqrt(distanceTravelledSQ);  ||  :363-367 if(distanceTravelled > distanceLeft) { distanceTravelled = distanceLeft; } ... distanceLeft -= distanceTravelled;
- **Lane impact:** L1 combat-core: the reach model is a path-length budget consumed along the gesture, plus a per-stance cap. This changes what 'reach' means in resolveSlash.

### `economy/calcxp-has-a-web-v0717-twin` — HELD [A2]

The kill-XP model is not android-only: the identical getGreyLevel / getZeroDifference / calcXP trio exists in the shipped web v0.717 bundle, byte-for-byte the same bands and the same two hard zero cut-offs. The build-parity caveat that would otherwise attach to the calcXP claim is closed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (grey level), :131-183 (zero-difference ladder), :185-209 (calcXP) — twin of reference/decompiled/shs3_android/scripts/NPC.as:94-110, :112-164, :166-190`
- **Quote:** §1t68s0§.as:116-128  if(_loc1_ < 6) { return 0; } if(_loc1_ < 40) { return _loc1_ - Math.floor(_loc1_ / 10) - 5; } if(_loc1_ < 60) { return _loc1_ - Math.floor(_loc1_ / 5) - 1; } return _loc1_ - 9;   ///   :187-207  if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } ... _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); ... _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); ... if(param4) { _loc5_ *= 2; }
- **Lane impact:** L4 ENEMIES + L10 ECONOMY: the XP-per-kill model is portable as plain CONTRACT (both builds agree), including the grey-out floor, the +3 over-level ceiling and the elite ×2. Also corrects a detail: getZeroDifference has 12 branches, not the 'eleven bands' the packet states.

### `economy/reinforce-weapon-cost-is-a-held-constant-5000` — HELD [A1]

While judging the repair-cost finding: the Reinforce-Weapon cost is the opposite case and is fully HELD as a constant — 5000 coins plus 1 Silver Ore, hard-coded in the confirmation string with no substitution slot, and confirmed on camera. The economy lane can take it as CONTRACT.

- **Cite:** `docs/gauntlet/L0/index/strings.json["850"] plus reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg (1024x576, crop y=370-576 full width, x1.8 LANCZOS)`
- **Quote:** strings.json["850"] = 'Reinforce your currently equipped weapon to make it unbreakable?\nCost: 5000 coins\nMaterials needed: 1 Silver Ore' — no [n] slot anywhere in the string. Read off frame_0042 verbatim: 'REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE'.
- **Lane impact:** L7 economy / items-equipment — a second blacksmith service priced and witnessed by both payload and frame. It is also the control that makes payload/repair-weapon-cost-is-a-template-not-a-constant airtight: the authors baked the number in wherever a constant existed, so string 848's bare '[0]' is positive evidence of a formula, not a gap in the extract.

### `enemies-ai/android-ai-dispatch-is-38-cases-35-classes` — HELD [A2]

Measured, not hand-counted: the android v0.682 AI dispatch is 38 cases instantiating 35 unique classes (32 Enemy* + 3 Friendly*), against the web v0.717 build's 39 cases / 36 unique classes. v0.717 therefore adds exactly ONE ai id and ONE behaviour class — not two.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-634 vs reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:615-733`
- **Quote:** NPCManager.as:516 `switch(xml.ai)` cases 0..37; parsed: 38 cases, 38 `new` sites, 35 distinct class names — Friendly* are FriendlyElite (case 30), FriendlySpearElite (31), FriendlyArcher (34); EnemyPlayer is reused at cases 0/9/14 and EnemySpearElite at 28/37, which is where a hand count loses one. §1t1543s0§.as:615 `switch(_loc6_.ai)` cases 0..38; parsed: 39 cases, 39 `new` sites, 36 distinct classes; the extra id is `case 38: _loc5_ = new §1t4551s0§();`
- **Lane impact:** enemies-ai: the corrected baseline for any roster/dispatch table. A build made from the android decompile is short exactly one enemy class and one ai id for the v0.717 target.

### `enemies-ai/flinch-duration-is-per-family-not-8` — HELD [A2]

There is no universal 8-frame flinch. The 8-frame flinch/flinch_weapon clips belong to the human paperdoll; the undead family plays a 39-frame zom_stumble for the same FLINCH_STATE, so any recreation that hard-codes an 8-frame stagger is wrong on every undead enemy.

- **Cite:** `reference/extracted/android/98_MCSCharacter_UndeadAnimationData.bin + reference/decompiled/shs3_android/scripts/EnemyZombie.as:285-286 + reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin`
- **Quote:** 98_Undead blob: `<anim i="zom_stumble" d="39">` · EnemyZombie.as:285-286 `case FLINCH_STATE: startAnim(ZOM_STUMBLE);` · MCSActor.as:518 `internal static var ZOM_STUMBLE:String = "zom_stumble";` · 94_Human2 blob: `<anim i="flinch" d="8">`, `<anim i="flinch_weapon" d="8">`
- **Lane impact:** enemies-ai + art-anim: the stagger frame count is a per-character-family table, not a constant. It also kills the 12 = 4 + 8 decomposition outright.

### `enemies-ai/hitstokillplayer-has-three-bands` — HELD [A2]

The player-relative boss autobalance uses three distinct hitsToKillPlayer constants, not one — a recreation that ports 16 - lvldiff universally mis-tunes every Elite, SpearElite and Wolf Alpha encounter.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:97-98 + EnemyElite.as:40-41 + EnemySpearElite.as:84-85 + EnemyWolfAlpha.as:86-87 + EnemyKanjiGuardian.as:65-66`
- **Quote:** EnemyPlayer.as:97-98 `hitsToKillBoss = 8 + lvldiff; hitsToKillPlayer = 16 - lvldiff;` · EnemyElite.as:40-41 `var hitsToKillBoss:int = 10 + lvldiff; var hitsToKillPlayer:int = 18 - lvldiff;` · EnemySpearElite.as:84-85 `hitsToKillBoss = 10 + lvldiff; hitsToKillPlayer = 18 - lvldiff;` · EnemyWolfAlpha.as:86-87 `hitsToKillBoss = 10 + lvldiff; hitsToKillPlayer = 15 - lvldiff;` · EnemyKanjiGuardian.as:65-66 `var hitsToKillBoss:int = 5 + 8 + lvldiff; var hitsToKillPlayer:int = 16 - lvldiff;` · floors differ too: Elite clamps hitsToKillBoss to 3, KanjiGuardian to 5, EnemyPlayer/WolfAlpha to 1
- **Lane impact:** enemies-ai + progression: completes the setLevel picture the three packet claims each got partly right. Three hitsToKillBoss bands (8/10/13 + lvldiff), three hitsToKillPlayer bands (15/16/18 - lvldiff), and three different lower clamps (1/3/5).

### `enemies-ai/npc77-resolves-to-oni-and-never-scales` — HELD [A2]

The 'ogres never level-scale' reading is now name-resolved end to end: npcdata id 77 is the Oni, ships at level 80 with 40 hp and attack 2000, routes to ai 23, and ai 23 constructs EnemyOgre — whose setLevel override is an empty body.

- **Cite:** `reference/extracted/npcdata.xml (npc id 77) + docs/gauntlet/L0/index/strings.json["5071"] + reference/decompiled/shs3_android/scripts/NPCManager.as:587-588 + EnemyOgre.as:51-53`
- **Quote:** npcdata.xml: `<id>77</id><name>5071</name><lvl>80</lvl><hp>40</hp><ai>23</ai><attack>2000</attack>` · strings.json["5071"] = 'Oni' · NPCManager.as:587-588 `case 23: actor = new EnemyOgre(MCSPool.getMCS());` · EnemyOgre.as:51-53 `override public function setLevel(lvl:int) : * { }`
- **Lane impact:** enemies-ai: closes the id-77 loop the setLevel claims left as a parenthetical, and confirms S0-3's claim that npcdata name ids resolve (484/6). The Oni's 40 hp is authored, not derived, because nothing ever calls a scaling function on it.

### `enemies/archer-knockdown-is-android-only` — HELD [A2]

The archer's arrow-knockdown roll does not exist in the shipped web build. Android EnemyArcher.as:287-300 builds a doLaunch flag (level>50 -> 1/2, level>20 -> 1/3, level>10 -> 1/4) and passes it as the 6th argument of ProjectileManager.createArrow(fireX,fireY,velXa,velYa,damage,doLaunch,this). The web twin §1t4539s0§.as:563 calls its create-arrow with SIX arguments and no such flag: (x, y, velX, velY, damage, this). Web archers therefore never set LAUNCH_KNOCKDOWN. The ballistic core is identical in both builds — GRAVITY = 3 at §1t128s0§.as:8, the same /0.866 solve at §1t4539s0§.as:554-558, the same 'velY += Math.random()*8 - 4' jitter at :563 — and the KanjiGuardian's flatter /(0.866/3) arc is at §1t4545s0§.as:466.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4539s0§.as:548-564 vs reference/decompiled/shs3_android/scripts/EnemyArcher.as:287-300`
- **Lane impact:** L7 enemies-ai: the arrow-arc physics port is build-safe, but the knockdown-above-50 rule is NOT — do not ship it in a v0.717-targeted recreation. Also adds the two tiers (level>20 -> 1/3, level>10 -> 1/4) the packet's finding omitted.

### `frames/39-tip-ladder-is-android-only` — PARTIAL [A2]

The 39-tip GameEngine ladder exists only in the android v0.682 build. Not one of its 39 strings appears anywhere in the web v0.717 payload, its 27 bindata blobs, or the 329 MB payload.xml — so every mechanic sourced to a tip (rarity colour enum, SPD→cooldown+reach, hold-run, the keyboard/gesture map, undead heads, the settlement ladder) is v0.682-attested only.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:530-697 vs reference/decompiled/shs3_payload/scripts/ + reference/extracted/bindata/ + reference/extracted/payload.xml`
- **Quote:** android: `grep -c '"Tip: ' GameEngine.as` → 39; GameEngine.as:533 `var dice:int = Math.random() * 39;` ladder runs dice 0..38 closing at :695. web: `grep -rn '"Tip: ' reference/decompiled/shs3_payload/scripts/*.as` → 0 hits; 'green border indicates' → 0 across all 27 reference/extracted/bindata/*.bin; `grep -c 'green border indicates' reference/extracted/payload.xml` → 0. Also note GameEngine.as:668-675, dice==33, DOES route through LangManager.getString(723) — the one tip that lives in the string table.
- **Lane impact:** items-equipment / combat-core / ui-hud / world-exploration: keep the tips, but stamp them v0.682. The hold-run rule at GameEngine.as:640 does restore REBUILD_READINESS.md:146 — for the android build. A web cite is still owed.

### `frames/ui-strings-txt-is-placeholder-not-runtime-copy` — STILL_UNHELD [A1]

reference/extracted/ui_strings.txt is the SWF's authored TextField DEFAULT text, not the game's runtime strings — so every number in it is design-time filler and none of it may be cited as tuning.

- **Cite:** `reference/extracted/ui_strings.txt:100, :189, :214 vs reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg`
- **Quote:** ui_strings.txt:100 'physical dmg: 1234 - 1235 (heavy) critical dmg: 1234-1235 *(heavy) piercing dmg: 20' — 1234/1235 is obvious filler · :189 'War room rules 1/6' vs frame_0011 'WAR ROOM RULES 1/7' — THE FRAME WINS · :314 'hp: 123 / 123 (hp regen 12 ) chi: 123 / 434 (chi regen 13)' · :197 'Weight: 50/50'
- **Lane impact:** ALL LANES citing ui_strings.txt: the FIELD NAMES and LAYOUT are A2-grade evidence (a three-way damage taxonomy, hp/chi regen as displayed stats, an odds-based betting system, a tournament template). The NUMBERS are not: ':214 level requirement: 10 - 30 … round duration: 30 min' and ':100 piercing dmg: 20' are STILL_UNHELD as tuning.

### `hunter/android-rebirth-pays-20-5-hgold-vs-web-100-25` — HELD [A2]

A real build-tuning divergence in the rebirth payout that the packet's two rebirth-gold findings both miss: the WEB v0.717 build pays 100 Heavenly Gold at the DAN-8 rebirth and 25 otherwise, while the ANDROID v0.682 build pays 20 and 5 for the same two branches — a 5x difference. Both builds cap the dan stat at 9 identically. Anyone porting the payout must take the web numbers, and any 'the wiki says 25' reasoning is build-specific.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 (web, §1t9413s0§ = 12 = STAT_HGOLD at :228) vs reference/decompiled/shs3_android/scripts/StatsManager.as:2201-2207 and :194`
- **Quote:** §1t1523s0§.as:2644  if(§1t7356s0§(§1t9426s0§) == 8) { §1t9713s0§(§1t9413s0§,100); } … :2651 §1t9713s0§(§1t9413s0§,25);
StatsManager.as:2201  if(getPlayerStats(STAT_DAN) == 8) { changeStat(STAT_HGOLD,20); } else { changeStat(STAT_HGOLD,5); }
StatsManager.as:194  internal static var STAT_HGOLD:int = 12;
- **Lane impact:** rebirth-elements + economy: tenthGold=100 is correct for the target build, but only for the target build. Also a general warning for this lane — the two bundles diverge on tuning constants even where the data XMLs match row-for-row, exactly the S0-3 caveat.

### `hunter/traps-cost-one-kunai-not-four` — HELD [A2]

CORRECTION to the packet's two ammo findings: all five trap skills (Lay Trap 1024 plus the four Element Traps 1025-1028) cost exactly ONE unit of kunai ammo, the same as a kunai throw. The '/4' that both findings read as a trap cost belongs solely to SKILL_WINDMILL — skill 1051 'Windmill Shuriken', a ninja-tree skill gated on Smoke Bomb, whose own in-game description says 'Uses 4 kunai.'

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillManager.as:467-479 + reference/decompiled/shs3_payload/scripts/§1t120s0§.as:503-514 + reference/decompiled/shs3_android_payload/scripts/SkillSlotButton.as:118-120 and :170-172 + reference/extracted/skilldata.xml (skill 1051 displayname/desc via docs/gauntlet/L0/index/strings.json)`
- **Quote:** SkillManager.as:467  case SKILL_TRAP: case SKILL_TRAPFIRE: case SKILL_TRAPWATER: case SKILL_TRAPWIND: case SKILL_TRAPEARTH:
SkillManager.as:479     StatsManager.changeStat(2501,-1);
SkillSlotButton.as:170  else if(this._skillId == SkillManager.SKILL_WINDMILL)
SkillSlotButton.as:172     ammo = Math.floor(StatsManager.getStat(2501) / 4);
skilldata skill 1051 = 'Windmill Shuriken' — 'Throws a giant boomerang shuriken that is able to hits multiple enemies.\n\nUses 4 kunai.'
- **Lane impact:** skills-meters + rebirth-elements: the elemental kit's ammo economy is 1 per cast across kunai AND traps. Coding traps at 4 would quarter the player's elemental uptime.

### `hunter/web-only-skills-1074-1077` — HELD [A2]

The WEB v0.717 SkillManager defines four skill ids — 1074, 1075, 1076, 1077 — that exist NOWHERE else: no row in skilldata.xml's 75 skills, and no constant in the android v0.682 SkillManager. Skill 1077 is a live case in the web dispatcher and costs 8 units of kunai ammo (stat 2501), the only 8-cost in either build. These are four web-build skills the data XML never describes, and they are the reason the 'kunai 1/4/8 ladder' reading of the ammo costs is wrong.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:108, :110, :112, :114 and :344-351; contrast reference/decompiled/shs3_android/scripts/SkillManager.as (50 SKILL_* constants, none >= 1074) and reference/extracted/skilldata.xml (75 <skill> rows, max id below 1074)`
- **Quote:** §1t120s0§.as:108  public static var §1t10173s0§:int = 1074;
§1t120s0§.as:110  public static var §1t10174s0§:int = 1075;
§1t120s0§.as:112  public static var §1t10175s0§:int = 1076;
§1t120s0§.as:114  public static var §1t10176s0§:int = 1077;
§1t120s0§.as:347  if(§1t1523s0§.§1t9714s0§(2501) < 8)
§1t120s0§.as:351  §1t1523s0§.§1t9713s0§(2501,-8);
- **Lane impact:** skills-meters + the L0 survey method: skilldata.xml is NOT a complete inventory of the web build's skills. Any lane treating '75 skills' as the closed set will miss four. Whoever greps §1t120s0§.as next should resolve what 1074-1077 do — the -8 ammo cost suggests a heavier thrown-weapon tier.

### `hunter/web-stance-refusal-is-flat-48` — HELD [A2]

CORRECTION to the packet's Focus-meter finding: in the WEB v0.717 build the 'CANNOT CHANGE STANCE' refusal fires below a FLAT 48 frames of reload — a quarter of the 192-frame bar — not below maxreload/6. The maxreload/6 rule is android-only, where the bar is 120 frames so the threshold is 20. Both the gate predicate and the stance-cycler use the same literal 48, and the setter charges the same flat 48.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :3050, :3060 and :3162; contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:239 and :2977`
- **Quote:** §1t99s0§.as:249   this.§1t4415s0§ = 8 * 24;                      // maxreload = 192
§1t99s0§.as:3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
§1t99s0§.as:3060  if(this.§1t4414s0§ < 48) { return; }
§1t99s0§.as:3162  this.§1t4414s0§ -= 48;
(android MCSPlayer.as:239 this.maxreload = 5 * 24;  :2977 if(this.reload < this.maxreload / 6) { return; })
- **Lane impact:** L5 combat-core: the filmed build refuses a stance switch below 48/192 = 25% of the bar. Porting the android fraction would let the player switch at 16.7%, which is a visibly different feel and would not reproduce the 'CANNOT CHANGE STANCE' caption timing in the longplay.

### `hunter04/blade-stroke-tapers-8px-to-zero-across-the-reach-cap` — HELD [A2]

The live blade stroke's render contract is a TAPER, and it is a free on-screen readout of the reach cap. reference/decompiled/shs3_android/scripts/InputManager.as:360 and reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:360 are byte-identical: 'canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance), 10027008, 1, false, LineScaleMode.NONE, CapsStyle.ROUND, JointStyle.ROUND, 3);' with 'internal static var thickness:int = 8;' at :57 in both files. distanceLeft starts at maxDistance and counts down, so the stroke is drawn at 8 px where the player starts the line and thins linearly to 0 px exactly at the reach cap. The two NAMED styles greenLine() (0x009900) and redLine() (0x990000) are NOT the blade - my grep shows their only callers anywhere are SkillUI.as:75 and SkillUI.as:136, i.e. the vestigial gesture pad.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:57, :360 · reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:57, :360 · grep -rn "redLine()|greenLine()" reference/decompiled/shs3_android/scripts/`
- **Quote:** InputManager.as:360 — 'canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance),10027008,1,false,LineScaleMode.NONE,CapsStyle.ROUND,JointStyle.ROUND,3);' · :57 — 'internal static var thickness:int = 8;'
- **Lane impact:** L-art-anim-audio-feel and L-combat-core: the blade stroke is 8 px at the origin tapering to 0 px at the reach cap, colour 0x990000, ROUND caps and joins, miter 3 - a full render contract in one line, and a visual way to measure the reach cap off any longplay frame that shows a full-length stroke.

### `hunter04/buff-attack-scales-minDamage-only` — HELD [A2]

Corrected replacement for the refuted contamination claim. The 13-entry buff table is real and verifies exactly (reference/decompiled/shs3_android/scripts/StatsManager.as:288-312; labels at OverworldHUD.as:1388-1425 - XP/DAMAGE/DEFENSE/SPEED 150%, AP-regen and duel-token-regen 200%), and the duel_dense footage IS buffed: I read reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x LANCZOS) and saw gold '150% DAMAGE' under the HUD bars. But the buff is applied as 'this.minDamage *= 1.5;' ONLY - reference/decompiled/shs3_android/scripts/MCSPlayer.as:210-212, and web §1t99s0§.as:211-213 identical - while damageRange is untouched and getDamage rolls 'minDamage + Math.random() * damageRange' (MCSPlayer.as:3201). So the buff lifts the FLOOR of the damage roll, not the roll; dividing a measured damage or TTK by 1.5 is a systematic over-correction. The branches are an else-if chain, so exactly ONE buff is ever active. BUFF_INJURED is the mirror and has never been recorded anywhere: ':218-221 this.minDamage *= 0.5; this.defense *= 0.5; this.baseSlashLength *= 0.5;' - it halves REACH too.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:210-212, :218-221, :3201 · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:211-213 · reference/decompiled/shs3_android/scripts/StatsManager.as:288-312 · reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1425 · reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x)`
- **Quote:** MCSPlayer.as:210-212 — 'if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK)) { this.minDamage *= 1.5; }' · :3201 — 'var baseDamage:int = this.minDamage + Math.random() * this.damageRange;' · :218-221 — 'else if(StatsManager.hasBuff(StatsManager.BUFF_INJURED)) { this.minDamage *= 0.5; this.defense *= 0.5; this.baseSlashLength *= 0.5;'
- **Lane impact:** All video-measurement lanes: flag reference/frames/duel_dense/ as BUFF_ATTACK-active, but do NOT divide by 1.5 - only minDamage is inflated, so a measured hit is (1.5*minDamage + roll), and the unbuffed floor is recoverable only if damageRange is known. L-items-equipment gains the 13-buff consumable layer plus the previously unrecorded BUFF_INJURED reach penalty.

### `hunter05/premium-ladder-is-1-2-3-5-12` — HELD [A2]

The premium Gold ladder has FIVE tiers, not four: 1g=20 SKUs, 2g=2 SKUs (2101 'Medium Soldier Pill', 2126 '25 Duel Tokens'), 3g=94, 5g=4, 12g=23 — total 143 unique. The 12-Gold outfit tier is 23 unique SKUs (24 raw rows), not 30.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice>`
- **Quote:** My count over the blob's 176 <item> rows (143 unique ids, 0 unresolved): unique-id ladder {1: 20, 2: 2, 3: 94, 5: 4, 12: 23}; raw-row ladder {1: 23, 2: 2, 3: 123, 5: 4, 12: 24}; the 12g ids are 2130,2131,2132,2133,2135-2139,2146,2151-2162,2171.
- **Lane impact:** L0/L6 — corrects meta-social/premium-catalogue-is-143-skus, whose headline is right but whose ladder omits a whole price tier and overstates the outfit tier by 7.

### `hunter05/repair-and-reinforce-are-priced-in-coins` — HELD [A2]

StatsManager.getGold()/changeGold() are the COIN purse, not the premium currency: STAT_GOLD=11 (clamped by getMaxCoins(), local var 'newCoins', seeded to 100 at character creation) while the premium currency is STAT_HGOLD=12 (getHeavenlyGold), which the HUD prints as 'GOLD'. Therefore Repair-Weapon costs currentNodeLevel x 10 COINS and Reinforce costs 5000 COINS — matching the ledger's own ':80 Reinforce 5000c' and the on-screen '259 COINS' readout.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194, :705-706, :2627-2630`
- **Quote:** StatsManager.as:192 `internal static var STAT_GOLD:int = 11;` · :194 `internal static var STAT_HGOLD:int = 12;` · :2629 `return getPlayerStats(STAT_GOLD);` inside `public static function getGold() : int` · changeGold: `var maxCoins:int = getMaxCoins(); var newCoins:int = changeStat(11,num); if(newCoins > maxCoins) { newCoins = setStat(11,maxCoins); }` · :705-706 `setPlayerStats(STAT_GOLD,100); setPlayerStats(STAT_HGOLD,0);`
- **Lane impact:** L4 economy — corrects items-equipment/repair-weapon-cost-held, which asserts 'a gold currency (not coins)'. Every InteractUI service that calls getGold()/changeGold() is coin-priced.

### `hunter05/seg05-frame0025-is-a-you-win-card` — HELD [A1]

reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg is a full-screen crimson 'YOU WIN' result card, not an overworld HUD. It contains no level badge, no experience readout, no coins/gold readout and no Dan field — so it cannot support any claim about a level-8 HUD or about two on-screen currencies.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg (1024x576, whole frame, x2 LANCZOS; I also cropped the top 22% at x3 and it is solid red)`
- **Quote:** Visibly in the frame: a blood-splatter wordmark reading 'YOU WIN' in red-on-white outline, a flat crimson background, a black grass silhouette across the lower fifth, and two black silhouettes at right — a straw-hat samurai with a sheathed sword and an archer drawing a bow. No HUD chrome of any kind.
- **Lane impact:** Ledger hygiene — this is the frame that refutes ledger/film-shows-rebirth-is-unsourced. THE FRAME WINS: the A1 quote filed against it describes a HUD that is not there.

### `hunter05/third-baseprice-exception-item-11037` — HELD [A2]

There is a THIRD exception to 'every Gold item writes <baseprice>0</baseprice>', beyond items 2212 and 7049: item 11037 carries a literal period as its baseprice.

- **Cite:** `reference/extracted/itemdata.xml:6897-6902`
- **Quote:** itemdata.xml:6898-6902 — `<id>11037</id><type>7</type><name>4204</name><unique>1</unique><baseprice>.</baseprice>`
- **Lane impact:** L6 economy — an XMLItem parse edge case (`xml.baseprice.toString() != ""` is true for '.', so gvalue coerces to 0 rather than firing the 1-coin default). Completes the counterexample census to 303 = 300 + 1 + 2.

### `hunter05/wear-gates-damage-as-a-binary-cliff` — HELD [A2]

Weapon wear DOES reach the damage path — not as the phantom condition multiplier, but as a binary broken/not-broken cliff. isBroken() is read by the web getMinDamage/getDamageRange twins, and the android original shows the effect: a broken weapon contributes ATK+1 instead of the item's mindamage.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1854-1865 and §1t1523s0§.as:2306, :2322; reference/decompiled/shs3_android/scripts/StatsManager.as (getMinDamage)`
- **Quote:** §1t17s0§.as:1865 `return this.uses >= _loc1_.durability + this.§1t523s0§(83);` · §1t1523s0§.as:2306 `if(_loc2_ == null || §1t7316s0§[§1t9448s0§].§1t535s0§())` · android StatsManager.getMinDamage: `if(itemdata == null || equipment[EQ_WEAPON].isBroken()) { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1; } else { basedamage = ... + itemdata.mindamage; }`
- **Lane impact:** L1/L2 — qualifies items-equipment/condition-blocker-dead-in-both-builds. The rewrite must say 'no condition MULTIPLIER; a broken-weapon damage cliff instead', not 'condition has no damage effect'.

### `hunter05/web-references-item-2218-that-no-held-table-contains` — STILL_UNHELD [A2]

The web v0.717 soul-infusion UI branches on item id 2218 at ten separate sites, but 2218 exists in neither reference/extracted/itemdata.xml nor reference/extracted/android/111_Mobile_ItemData.bin — I diffed them and their 982-id sets are identical, with ids running 2200…2216 in that block. Either the held 'web' item table is actually the Android one, or 2218 is a hard-coded sentinel; from the artifacts alone I cannot tell which.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:368, :385, :430, :465, :609, :644, :664, :681, :746, :893`
- **Quote:** §1t5374s0§.as:609 `return !this.§1t5385s0§ || param1 >= 3000 && param1 < 6000 || ... || param1 == 2218;` · :681 `if(this.§1t5384s0§.§1t483s0§() == 2218)` · my diff: android item ids 982, extracted item ids 982, symmetric difference empty, 2218 in neither.
- **Lane impact:** L6/L3 integrity — S0-3's 'Data-XML row counts match exactly' parity story has a hole on the item table that anything citing 'the WEB itemdata.xml' inherits.

### `meta-social/only-3-of-7-war-room-pages-were-ever-filmed` — PARTIAL [A1]

Only 3 of the 7 War Room rules pages exist on film (1/7, 3/7, 6/7). Page 6/7 renders the android string table word for word in v0.717, which is real copy-parity evidence — but the 24-hour war-tick page is NOT among them, so that number is android-sourced only and cannot be called frame-confirmed.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/ — 20 files total; frame_0011.jpg, frame_0012.jpg, frame_0013.jpg read at x2 LANCZOS, plus a title-bar contact sheet over frames 0008-0020`
- **Quote:** frame_0011 'WAR ROOM RULES 1/7  (JOINING A BATTLE)' · frame_0012 'WAR ROOM RULES 3/7  (ATTACKING AND DEFENDING)' · frame_0013 'WAR ROOM RULES 6/7  (BUILDING STRUCTURES)' rendering strings.json["380"] verbatim down to 'CONTRIBUTING 500 COINS TO THE SECTOR' and the five structure names. No other rules page appears in seg-20.
- **Overturns:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L0 meta-social: bounds how far the war-tick claim can be pushed. The 24h number is A2-held on the v0.682 string table and NOT corroborated on film, so it keeps the S0-3 hedge — while the structure/contribution page is now confirmed identical across builds and can drop its hedge.

### `progression/player-stance-cycle-is-three` — HELD [A2]

Reversed and Dual stance are not reachable by a normal player. MCSPlayer.as:2975-3016 nextStance() branches on StatsManager.consoleEnabled: with the dev console on it cycles all five (Light→Balanced→Heavy→Dual→Reversed→Light, :2982-3002); without it, :3004-3014 cycles Light→Balanced→Heavy→Light. So the shipped game has five stance STATES with five renderable animation blobs, but a three-state PLAYER stance cycle. Any config must model both facts: enemy/NPC stance has five values, player stance selection has three.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2975-3016 (nextStance), :27-35 (five stance ids)`
- **Quote:** MCSPlayer.as:3004 `else if(this.stance == LIGHT_STANCE) { this.setStance(BALANCED_STANCE); } else if(this.stance == BALANCED_STANCE) { this.setStance(HEAVY_STANCE); } else if(this.stance == HEAVY_STANCE) { this.setStance(LIGHT_STANCE); }`
- **Lane impact:** L1 combat-core / L8 enemies-ai — this is the boundary condition that the packet's five-stances finding needed and did not state. Without it, 'any stance model with three states is short two' would push a wrong player-facing model into the build.

### `progression/setlevel-debug-command-is-a-14th-xp-write-site` — HELD [A2]

There is a fourteenth XP write site that the addLootXP enumeration misses by construction: OverworldHUD's /setlevel developer chat command writes STAT_XP directly and then nudges changeXP(1) to trigger the level-up path. It is a GM cheat, not a gameplay faucet, so it does not weaken the no-gather-XP negative — but any future exhaustive XP census must grep changeXP as well as addLootXP or it will miss it.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:2132-2138`
- **Quote:** 2132: `if(strArray[0] == "/setlevel")` 2134: `if(strArray.length == 2)` 2136: `StatsManager.setStat(9,StatsManager.expArray[int(strArray[1]) - 1] - 1);` 2137: `StatsManager.changeXP(1);` — sitting beside sibling cheats /giverandomlegendaryitem (:2115) and /changestat (:2142).
- **Lane impact:** L4 progression, methodological. Confirms rather than dents progression/no-gather-xp-path-exists: the full changeXP census is 6 sites — LootDialog.as:251 (the loot pipe), StatsManager.as:1609/1621/1627 (definition + two reportHack guards), InventoryUI.as:906 (item modifier id 9), and this debug command. No gameplay path outside the 13 addLootXP sites survives the wider grep. It also incidentally proves expArray is the live level ladder, since the cheat indexes it to fabricate a level.

### `progression/xp-array-outruns-level-cap` — PARTIAL [A2]

The shipped XP table has 99 entries (indices 0-98) while the level-cap constant two lines above it is 80. §1t1523s0§.as:362 'public static const §1t9470s0§:int = 80;' immediately precedes §1t1523s0§.as:364's 99-entry array. Either the cap was lowered without trimming the table, or thresholds past 80 are reachable in some mode (rebirth/Dan?). Worth resolving before anyone hard-codes a 99-level ladder off the array.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 and :364`
- **Quote:** §1t1523s0§.as:362  public static const §1t9470s0§:int = 80;
§1t1523s0§.as:364  public static const §1t5923s0§:Array = [0,550,...,25395800,29395800];   // 99 entries
- **Lane impact:** L3 progression: promote L1-L80 to CONTRACT from the array, but flag indices 81-98 as unexplained rather than silently shipping a level cap of 98.

### `provenance/extracted-sprites-and-shapes-are-web-v0717` — HELD [A2]

reference/extracted/sprites/ (827 DefineSprite render dirs) and reference/extracted/shapes/ (1,822 SVGs) come from the WEB v0.717 payload, not the Android build — proved by tag count rather than assumed from file location. Every art claim resting on that corpus is therefore free of the §0 Android build-parity caveat.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf — my own tag-stream scan`
- **Quote:** shs3_payload_decoded.swf          DefineSprite(39) = 827   DefineShape(2/22/32/83) = 1822   max sprite id 3641
shs3_android_payload_decoded.swf  DefineSprite(39) = 675   DefineShape(2/22/32/83) = 1557   max sprite id 2953
$ ls reference/extracted/sprites | wc -l -> 827 ; $ ls reference/extracted/shapes | wc -l -> 1822
- **Lane impact:** Cross-lane: settles the provenance question for ui-hud, art-anim-audio-feel and world-exploration in one line. The 827/1822 corpus is web v0.717 art at 1:1 game-pixel scale and can be cited without a build qualifier.

### `questdata/extracted-xml-is-verbatim-the-android-embed` — HELD [A3]

reference/extracted/questdata.xml is not merely 'android-provenanced by inference' — it is byte-for-byte the payload of reference/extracted/android/116_Mobile_QuestData.bin. The blob is 796,384 bytes and contains the 796,383-byte XML verbatim (one trailing byte difference). This is the single cleanest proof of the provenance claim and nobody in the packet gave it.

- **Cite:** `byte-compare of reference/extracted/questdata.xml (796,383 B) against reference/extracted/android/116_Mobile_QuestData.bin (796,384 B); both begin '<questdata>\n<quest>\n  <id>0</id>\n  <startin>0</startin>'`
- **Quote:** $ python3 -c "q=open('reference/extracted/android/116_Mobile_QuestData.bin','rb').read(); x=open('reference/extracted/questdata.xml','rb').read(); print(len(q), len(x), q.find(x[:200])!=-1)"
796384 796383 True
- **Lane impact:** Hardens quests-story/payload-provenance-is-android from a size/absence argument to an identity argument. Every quest/dialogue measurement in this run is a v0.682 measurement and must carry that label.

### `questdata/fatal-tag-census-correction` — HELD [A2]

The <fatal> flag is not carried by every <friend> block. questdata.xml holds 75 <fatal> tags against 70 <friend> blocks; only 59 of the friends carry one, and 16 <fatal> tags sit outside any <friend>. Every one of the 75 is the value 0, so the 'always 0 in shipped content' half is correct.

- **Cite:** `reference/extracted/questdata.xml — census over the whole file; representative instance at :11710 (<fatal>0</fatal> inside the <friend> closing at :11711)`
- **Quote:** $ python3 census -> friend blocks 70 | fatal values Counter({'0': 75}) | friends containing <fatal> 59
- **Lane impact:** L7 enemies-ai: a per-ally death flag must be modelled as optional, defaulting to absent, not as a required field on every allied spawn.

### `rebirth/romaji-dan-ladder-is-cross-build-not-desktop-only` — HELD [A2]

The hard-coded romaji Dan ladder is not a v0.717 desktop addition — the android v0.682 PlayerPanel carries the identical switch with the identical string ids. §1t408s0§.as is simply the web PlayerPanel.

- **Cite:** `reference/decompiled/shs3_android/scripts/PlayerPanel.as:388, :406, :409, :412, :415 vs reference/decompiled/shs3_payload/scripts/§1t408s0§.as:538, :556, :559, :562, :565`
- **Quote:** PlayerPanel.as:388               dantext = "(nidan)";
PlayerPanel.as:406               dantext = "(hachidan) " + LangManager.getString(466);
PlayerPanel.as:409               dantext = "(kyudan) " + LangManager.getString(467);
PlayerPanel.as:412               dantext = "(judan) " + LangManager.getString(467);
- **Lane impact:** rebirth-elements ③: good news for parity — the Dan ladder is identical across both builds, so there is no build-parity caveat on it at all. It is also what refutes rebirth/romaji-dan-ladder's 'absent from ... the android build'.

### `skilldata/skill-1077-missing-from-extract` — HELD [A2]

Skill id 1077 is live in the shipped web bundle — it has a cast branch that spends 8 kunai ammo — but has no <skill> block anywhere in reference/extracted/skilldata.xml. Either the extract is short a row or the id is dead code.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:114 and :344-351, against reference/extracted/skilldata.xml (75 <skill> blocks, none with <id>1077</id>)`
- **Quote:** §1t120s0§.as:114       public static var §1t10176s0§:int = 1077;
§1t120s0§.as:344             case §1t10176s0§:
§1t120s0§.as:347                  if(§1t1523s0§.§1t9714s0§(2501) < 8)
§1t120s0§.as:351                  §1t1523s0§.§1t9713s0§(2501,-8);
- **Lane impact:** skills-meters: the verified count '75 <skill>' in skilldata.xml is not the full shipped skill roster. Any lane treating skilldata.xml as the closed set of skills needs this caveat.

### `skills-meters/mastery-scale-differs-between-builds` — HELD [A2]

Mastery is on a 0-10 scale in the web build and a 0-100 scale in Android, and the Light multipliers differ outright. Web reach: Light x1.4 flat, Balanced (1 + 0.2 x m x 0.1), Heavy (0.5 + 0.4 x m x 0.1). Android reach: Light x1.5 flat, Balanced (1 + 0.5 x m x 0.01), Heavy (0.5 + 0.5 x m x 0.01). Any config seeded from the Android decompile will be wrong for v0.717 in both the multiplier and the stat scale.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116 against reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052`
- **Quote:** web  3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
web  3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
web  3116:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
and 3117-3119 clamp slashLength up to 100
android 3030:                this.slashLength = this.baseSlashLength * 1.5;
android 3041:                this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);
android 3052:                this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);
- **Lane impact:** L2/L5: this is the third confirmed web-vs-Android tuning split in this packet (after maxreload 192 vs 120 and the stance gate 48 vs maxreload/6). It also explains the wiki's 300/200/100 exactly: Android mastery-0 multipliers 1.5/1.0/0.5 against a base of 200. Standing rule for the lane: quote the WEB class for any v0.717 combat number and use Android only to de-obfuscate the symbol.

### `skills/traps-cost-one-kunai-ammo` — HELD [A2]

Lay Trap and all four elemental Element Traps deduct exactly ONE unit of kunai ammo (stat 2501), not four. The four-kunai cost belongs to Windmill Shuriken (skill 1051) alone, which says so in its own shipped description.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:503-514 (web v0.717) + reference/decompiled/shs3_android/scripts/SkillManager.as:468, :474, :479`
- **Quote:** §1t120s0§.as:503-507  case §1t10134s0§: case §1t10135s0§: case §1t10136s0§: case §1t10137s0§: case §1t10138s0§:   (= skills 1024, 1025, 1026, 1027, 1028)
§1t120s0§.as:510   if(§1t1523s0§.§1t9714s0§(2501) == 0)
§1t120s0§.as:514   §1t1523s0§.§1t9713s0§(2501,-1);
SkillManager.as:474   if(StatsManager.getStat(2501) == 0)
SkillManager.as:479   StatsManager.changeStat(2501,-1);
- **Lane impact:** skills-meters + economy: the kunai-ammo curve is flat at 1 for every kunai and every trap; only Windmill Shuriken (4) and skill 1077 (8) cost more. Two claims in this packet got this backwards and nobody cites this block.

### `stage/web-payload-has-its-own-800-480-690-resize-handler` — HELD [A2]

The WEB v0.717 payload carries its OWN resize handler with the identical three constants as the Android build — originalWidth 800, originalHeight 480, originalHeightWithBar 690. Every aspect-ratio claim in this packet cited the ANDROID GameEngine and left a build-parity hole; the hole is closed, and the answer is that the two builds share the layout model exactly. This is also what refutes 'that is the ANDROID figure': 800x480 is the web build's own base canvas.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-314`
- **Quote:** 269:      internal static function §1t10021s0§(param1:Event) : void
271:         var _loc2_:int = 800;
272:         var _loc3_:int = 480;
273:         var _loc4_:int = 690;
277:         if(_loc7_ <= _loc6_)
280:            _loc3_ = _loc4_;
281:            §1t1523s0§.§1t9362s0§ = true;
295:         if(_loc5_ >= _loc7_)
297:            _loc8_ = §1t9973s0§.stageWidth / _loc2_;
304:            _loc8_ = §1t9973s0§.stageHeight / _loc3_;
- **Overturns:** "- **Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L8 ui-hud + every lane holding frame-derived coordinates: RR:117 stands, and it stands for BOTH builds. The friend-bar mode is real but conditional (viewport narrower than 800/690 = 1.159:1), which neither longplay is. Cite this file, not the Android GameEngine, for any web-build layout claim.

### `stage0/android-lang-table-cannot-serve-web-ui` — HELD [A2]

The parsed Android string table cannot resolve the web build's UI copy at all: it tops out at string id 9010, while the web payload calls getString(960), getString(11005), getString(11006) and getString(11018). Any WEB UI-copy claim resting on 118_Mobile_Lang_EN.bin has a hard, measurable hole — this is the concrete shape of the S0 build-parity caveat.

- **Cite:** `docs/gauntlet/L0/index/strings.json (1,893 numeric ids, max id 9010, zero entries containing 'tournament') vs reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:80, :82, :84 and §1t113s0§.as:111`
- **Quote:** §1t7144s0§.as:82  this.notournamenttext.text = §1t1521s0§.getString(11018);   ///   §1t113s0§.as:111  this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";
- **Lane impact:** All lanes — narrows S0-3's caveat from a vague warning to a testable rule: an id >= 9011 (and id 960) is unresolvable from the held table, so the string is web-only content.

### `stage0/anim-blobs-are-utf8-bom-not-utf16le` — HELD [A3]

The MCSCharacter_*AnimationData blobs are UTF-8 WITH BOM, not UTF-16LE. Following the standing S0 warning and decoding them as UTF-16LE returns ZERO <anim> matches and will produce a false refutation of any animation claim.

- **Cite:** `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin and 99_MCSCharacter_HumanAnimationData.bin — first bytes are EF BB BF, and utf-8-sig decoding yields 25 and 158 <anim> tags respectively while utf-16-le yields 0 and 0`
- **Quote:** b'\xef\xbb\xbf<?xml version="1.0"?>\r\n<animdata>\r\n<anim i="mining" d="15" l="1">'   ///   utf-16-le decode of the same bytes: '路㲿...' — 0 regex hits for <anim i="..." d="...">
- **Lane impact:** All lanes — the S0 header's UTF-16LE warning is correct for 118_Mobile_Lang_EN.bin but WRONG for the animation blobs. Applying it blindly is a live false-refutation risk; three sound claims in this packet would have died on it.

### `string-table/the-CANNOT-CHANGE-STANCE-string-id-960-is-absent-from-the-parsed-table` — PARTIAL [A2]

The web build paints the CANNOT CHANGE STANCE caption from LangManager.getString(960), and id 960 does NOT exist in docs/gauntlet/L0/index/strings.json (2,533 Android entries). The companion CRITICAL HIT caption is getString(175) and resolves fine ('Critical Hit'). So S0-3's 'the string blocker is dead' holds for the DATA tables but not universally for web UI copy: at least one web UI string id has no Android counterpart, which is exactly the build-parity gap the S0 caveat warns about.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111, checked against docs/gauntlet/L0/index/strings.json["960"] (absent) and ["175"] ('Critical Hit')`
- **Quote:** 110:         this.§1t5203s0§ = "<font color=\'#000000\'>" + §1t1521s0§.getString(175) + "</font>";
111:         this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";
--- lookups I ran ---
strings.json["175"] -> 'Critical Hit'
strings.json["960"] -> KeyError (absent)
nearest Android entry: strings.json["125"] -> 'Stance Restriction'
- **Lane impact:** L8 ui-hud + string-table lane: the exact on-screen wording 'CANNOT CHANGE STANCE' is held by the FRAME (reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, bottom-left crop) and not by the string table — THE FRAME WINS and is the only source for it. Flag: any web UI string whose id exceeds the Android table's range needs a frame or a web-side text source, and the id range where this starts has never been surveyed.

### `tooling/source-constants-mined-the-0682-decompile` — HELD [A2]

docs/research/fidelity/SOURCE_CONSTANTS.md states its 189 constants come from a build 'identified as v0.717', but it never cites a single web-bundle class and the decompile it names stamps clientVersion 0.682. Given that crit, per-stance reach, per-stance damage, mastery coefficients, maxreload, behead and rebirth payout ALL differ between the two builds, every constant in that file needs a build audit before promotion.

- **Cite:** `docs/research/fidelity/SOURCE_CONSTANTS.md:3-5 ('Build identified as v0.717 … 189 constants extracted') with my own `grep -c '§1t' docs/research/fidelity/SOURCE_CONSTANTS.md` = 0; reference/decompiled/shs3_android_payload/scripts/StatsManager.as:30 (`public static var clientVersion:Number = 0.682;`) vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (`public static var §1t9323s0§:Number = 0.717;`); `diff -q reference/decompiled/shs3_android/scripts/StatsManager.as reference/decompiled/shs3_android_payload/scripts/StatsManager.as` is silent (identical)`
- **Quote:** SOURCE_CONSTANTS.md:3-5  '**Status: CRACKED AND MINED (2026-07-25).** … **Build identified as v0.717 — the same build our video measurements came from.** 189 constants extracted' — yet StatsManager.as:30 reads `clientVersion:Number = 0.682` and the file cites no §1t…s0§ class anywhere.
- **Lane impact:** Cross-lane, and the real unclaimed force behind the packet's three 'web AS3 is readable' claims. This is a SOURCE_CONSTANTS.md defect, not a REBUILD_READINESS.md one — which is precisely why those three claims' ledger overturns do not hold. Measured divergences to re-audit: crit 1.3 vs 1.2/1.5 · light reach 1.4 vs 1.5 · heavy damage 1.4 vs 1.5 · mastery coefficient 0.02/0.04 vs 0.005 · maxreload 192/48 vs 120/24 · behead 1.3 vs 1.5 · rebirth 25/100 vs 5/20. Identical in both: base slash length 120 + floor((90 + DAN×5)·SPD/(20+SPD)), Heavy defence ×0.8, the stat-id table, the quest coin/prosperity literals, calcXP.

### `ui-hud/combat-keeps-the-player-nameplate` — HELD [A1]

Combat does not suppress all nameplates. In a live fight the enemies lose their plates and gain green health bars, but the PLAYER's gold nameplate is still rendered above the character.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg (1024x576) read whole at x2 LANCZOS`
- **Quote:** Green health bars over five enemies, zero enemy nameplates, and the player's gold 'GUEST' plate still drawn above the fighter — alongside 'AUTO SLASH OFF', HP 16/20, CHI 15/15 and 'CANNOT CHANGE STANCE'.
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud: corrects the 'combat shows zero plates' simplification carried in the spawner-split claim. The recreation must keep the player's own gold plate on screen during a fight.

### `ui-hud/interactui-has-six-buttons` — HELD [A2]

InteractUI's panel is a SIX-button menu, not five. The packet's geometry quote stops one line short of button6: payload.xml:626602-626603 carry name="button6" translateX="200" translateY="6100" -> (10, 305) px, holding the same 39 px row pitch, and :626605-626606 carry name="npcname" translateX="220" translateY="6514" -> (11, 325.7) px. Confirmed in code in BOTH builds. A rebirth/element picker laid out from the five-button quote will be one row short and will have no NPC-name field.

- **Cite:** `reference/extracted/payload.xml:626602-626606 + reference/decompiled/shs3_payload/scripts/§1t401s0§.as:67,133-135 + reference/decompiled/shs3_android/scripts/InteractUI.as:57,131-133`
- **Quote:** <item type="PlaceObject2Tag" characterId="1663" depth="106" ... name="button6" ...
  <matrix type="MATRIX" ... translateX="200" translateY="6100"/>
<item type="PlaceObject2Tag" characterId="1666" depth="116" ... name="npcname" ...
  <matrix type="MATRIX" ... translateX="220" translateY="6514"/>
§1t401s0§.as:133-135  this.button6.x = this.§1t5878s0§; this.button6.y = this.§1t5879s0§ + 5 * this.§1t5880s0§; this.buttons.push(this.button6);
- **Lane impact:** ui-hud + rebirth-elements: the InteractUI layout table must carry six rows (y = 109/148/187/226/265/305 px) plus npcname at (11, 325.7).

### `ui-hud/tan-reload-bar-is-static-across-427-432` — HELD [A1]

The in-combat reload/Focus bar does NOT change length anywhere in the duel_dense window, contrary to the packet's claim that it visibly varies across 427.0 / 429.0 / 431.0. Its top-strip column profile is identical to within compression noise across 427.0, 427.5, 428.0, 428.5, 429.0, 431.0, 431.5 and 432.0, and its right edge measures 509 / 509 / 511 for the three frames the packet contrasts. Anyone re-deriving Focus timing from these frames will get nothing; the meter's behaviour has to come from the source.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, _429.0.png, _431.0.png and 5 more, column-mean profile of rows 1030-1032 over x 250-525, plus right-edge tracking over band y1029-1047 (threshold: >35% of the band's rows above luminance 45)`
- **Quote:** 427.0  20  23 167 182 168 124  47 112 135  83 131 144  51 ...
429.0  20  22 166 182 176 127  47 107 136  75 126 146  56 ...
431.0  22  22 162 181 173 128  41 105 132  82 123 141  54 ...
right edge: 427.0 -> 509, 429.0 -> 509, 431.0 -> 511
- **Lane impact:** L7 ui-hud: strikes the 'fill length changes' evidence from ui-hud/in-combat-hud-is-three-bars. The bar IS a meter, but only BattleUI.as:261 proves it. THE FRAME WINS over the packet's measurement.

### `warroom/troop-advance-is-24-hours` — HELD [A2]

The game's own War Room rules screen states the 24-hour tick verbatim, so REBUILD_READINESS.md's 'War-Room 24h tick' is CORRECT and the three hourly-tick claims in this packet are wrong. WARMOVEINTERVAL (3600 s) is a different clock: it refreshes the player's per-turn MOVE allotment, surfaced as 'Next turn in ...' / '... Move(s) Left'.

- **Cite:** `docs/gauntlet/L0/index/strings.json["376"] and strings.json["307"], strings.json["308"] + reference/decompiled/shs3_android/scripts/WarUI.as:525-541 + StatsManager.as:162,782`
- **Quote:** strings.json["376"] = '- use the "deploy troops" action to increase the number of troops in a sector.\n\n- Troops will advance on enemy sectors every 24 hours.\n\n- If a sector has more attacking troops than defending troops, the sector will be captured by the attackers.'  ·  strings.json["307"] = 'Next turn in '  ·  strings.json["308"] = ' Move(s) Left'  ·  WarUI.as:533-539 `maxmoves = StatsManager.getMaxWarMoves(); ... StatsManager.setStat(StatsManager.STAT_WARMOVES,maxmoves); this.movesleftlabel.text = warmoves + LangManager.getString(308);`
- **Overturns:** "- **The real-world "day" length** governing quest expiry, farming, AP regen, and the War-Room 24h tick."
- **Lane impact:** L11 meta-social and L1 world-exploration: the war carries TWO clocks - a 1 h per-player move-turn (WARMOVEINTERVAL, already in the ledger as 'moves/hr') and a 24 h troop-advance resolution (strings.json["376"], server-side). Do not collapse them. Build-parity caveat: this string is from the android lang table; the web build's copy is unverified, but the 24 h figure is corroborated by the ledger's independent wiki/forum sourcing.

### `world/nodegenerator-web-parity-closed` — HELD [A2]

The web-parity hole that questdata-critic/overworld-is-generated flagged open for NodeGenerator is now closed. The web v0.717 twin is §1t70s0§.as, and §1t70s0§.as:399 carries the identical node-level formula: Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + LEVELSTART. The overworld generator ships in both builds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t70s0§.as:399 vs reference/decompiled/shs3_android/scripts/NodeGenerator.as:385`
- **Quote:** §1t70s0§.as:399  var _loc3_:int = Math.abs(_loc2_.x - 341) + Math.abs(_loc2_.y - 341) + this.§1t1138s0§;  ||  NodeGenerator.as:385  var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART;
- **Lane impact:** L8: the generator may be ported as CONTRACT against the filmed build, not labelled android-only.

### `world/third-hardcoded-placename-override-web-only` — HELD [A2]

getPlaceName in the WEB v0.717 build special-cases THREE territory ids, not two: 1405272 -> 'Ibamaya', 1524045 -> 'Gokura', and 1519945 -> 'Iwakuni'. The android v0.682 NameGenerator has only the first two. Every place-name claim in this lane that enumerates 'two hard-coded overrides' is therefore an android reading applied to the web build, and a recreation built to that spec will render territory 1519945 with a generated syllable name instead of Iwakuni.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:140-150; contrasted with reference/decompiled/shs3_android/scripts/NameGenerator.as:135-144`
- **Quote:** §1t136s0§.as:140  if(param1 == 1405272)
:142     return "Ibamaya";
:144  if(param1 == 1524045)
:146     return "Gokura";
:148  if(param1 == 1519945)
:150     return "Iwakuni";
  -- android NameGenerator.as:137 if(territoryID == 1405272) / :141 if(territoryID == 1524045) and then straight to the split at :145
- **Lane impact:** L8 world-exploration: the place-name generator port needs all three overrides. Also a live parity hole in two claims already in this packet (questdata-critic/placename-generator-held asserts 'no parity hole' at exactly this spot; questdata/placename-generator-DECODED labels itself build 'both').

### `world/third-placename-override-is-web-only` — HELD [A2]

The v0.717 place-name generator special-cases THREE territory ids, not two. §1t136s0§.as:140 -> 1405272 = 'Ibamaya', :144 -> 1524045 = 'Gokura', :148 -> 1519945 = 'Iwakuni'. The android twin NameGenerator.as:137-144 carries only the first two, so this is a genuine web/android divergence and the packet's two findings that assert 'no parity hole' are wrong. Everything else in the generator reproduces exactly — I re-implemented it (677-entry table from bindata/98_1t4653s0.bin, 78 namestarting, 37 nameending, LCG seed*9301+49297 mod 233280 with the constructor's priming rnd() at RNG.as:18) and got Chikada / Kakuchi / Kasuta for 1405270 / 1409366 / 1397077.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:148-151 vs reference/decompiled/shs3_android/scripts/NameGenerator.as:137-144`
- **Quote:** §1t136s0§.as:148  if(param1 == 1519945)
§1t136s0§.as:149  {
§1t136s0§.as:150     return "Iwakuni";
§1t136s0§.as:151  }
- **Lane impact:** L8: a recreation built to the packet's recipe renders territory 1519945 with a generated name instead of Iwakuni.
