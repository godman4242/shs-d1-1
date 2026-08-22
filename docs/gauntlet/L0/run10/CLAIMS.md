# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 8 critic reviews · 27 claims · 73 verdicts.

## unassigned — re-scored ?

### `combat-core/in-combat-stance-cycling-is-live-code-in-v0717` — HELD [A2] ⚑ OVERTURNS LEDGER

RR:158's hard-lock sentence is not merely reinterpretable, it is contradicted by executable code. §1t99s0§.as:3058-3081 is a stance CYCLER: it returns early iff reload < 48 (:3060), then steps -1 -> light, light -> balanced, balanced -> heavy, heavy -> light and pushes the new stance to §1t251s0§. Its gate §1t4470s0§ at :3048-3051 is 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;'. It has exactly two callers, both in-combat: §1t113s0§.as:468-479, the battle HUD's own button handler (Snd_smallClick on success, Snd_error on refusal), and §1t1541s0§.as:607, the SPACE key. §1t113s0§ is the battle HUD - :117 sets a field to getString(45) = 'Hit Combo'. So the switch is not removed 2014 behaviour; it shipped in v0.717, Focus-gated at the same threshold 48 that the meter's low-end label reports on.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051,:3058-3081 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:117,:468-479 + reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:607`
- **Quote:** §1t99s0§.as:3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;' · :3060 'if(this.§1t4414s0§ < 48)' then 'return;' · §1t113s0§.as:473-474 '§1t1523s0§.§1t9586s0§().§1t4472s0§(); §1t1523s0§.stance = §1t1523s0§.§1t9586s0§().§1t4473s0§();'
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**."
- **Lane impact:** L5 combat-core. The recreation's Focus-gated in-combat switch is NOT a divergence - it is the original. Strike RR:158 and the matching rows at docs/research/SHSD_MASTER_REFERENCE.md:388 and :2099, both of which are labelled [CONTRACT] on a false premise. Implement: cycle light->balanced->heavy->light, gated reload >= 48, Snd_error on refusal.

### `combat-core/the-game-ships-a-loading-tip-telling-you-to-change-stance-in-battle` — HELD [A2] ⚑ OVERTURNS LEDGER

The single most direct refutation of the in-combat stance lock is the game's own loading-screen copy. GameEngine.as:584 sets the tip string to 'Tip: In battle, you can use spacebar to change stance.' The matching web v0.717 input handler is §1t1541s0§.as:605-611: Keyboard.SPACE calls §1t4470s0§() and, if it passes, §1t4472s0§() to cycle the stance plus Snd_smallClick, else Snd_error. The gate §1t4470s0§ (§1t99s0§.as:3048-3051) is `§1t4469s0§() && this.§1t4414s0§ >= 48` — an action-state check AND the reload meter, no battle-state flag anywhere.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:584 + reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:605-611 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051,:3058-3075`
- **Quote:** GameEngine.as:584  str = "Tip: In battle, you can use spacebar to change stance.";
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L5 combat-core: bind SPACE to a stance cycle gated on reload>=48, error SFX below threshold. Kills RR:158 and SHSD_MASTER_REFERENCE.md:388's [CONTRACT] hard-lock row.

### `hunter-s26c/deathnohead-is-31-frames-of-bone-transforms-not-a-name` — HELD [A2] ⚑ OVERTURNS LEDGER

Raises the severed-limb overturn from 'the name exists' to 'the animation is fully specified', which is what RR:240's blocker (5) actually asks for. reference/extracted/bindata/108_1t4635s0.bin — the WEB blob, md5-identical to android 99_MCSCharacter_HumanAnimationData.bin — stores '<anim i="deathnohead" d="31">' followed by thirty-one <f> frames, each carrying about seventeen '<n i= x= y= r=>' node records, i.e. per-frame x / y / rotation for every bone. The blob holds 158 <anim> rows in total, among them death, deathenemy, deathnohand, deathnohead, deathwitharrow, deathbyarrow, deathdowned and deathinhalf. There is nothing left to catalogue for the severed-limb variants; the keyframes are on disk in the target build.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin (own decode + <anim>/<f>/<n> walk; 158 <anim> rows) · docs/research/REBUILD_READINESS.md:240`
- **Quote:** '<anim i="deathnohead" d="31">' then '<f i="0">' '<n i="16" x="-18" y="-88" r="-83"></n>' '<n i="20" x="-18" y="-61" r="-104"></n>' ... 17 node records per frame, 31 frames
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** L6 art-anim: RR:240 (5) closes with keyframe data, not just an inventory line; the same walk gives frame counts for every one of the 158 human anims.

### `hunter-s26c/tenthgold-100-is-contract-and-the-dan-ladder-is-hard-capped` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md:164-165 says MAX_DAN_RANK=10 and tenthGold=100 'should be INFERRED, not CONTRACT', and that 'film shows a flat +25 gold every rebirth, no 10th-rebirth tier.' The web rebirth function falsifies the whole sentence, tenthGold included. §1t1523s0§.as:2638 opens the rebirth routine; :2644-2648 read 'if(§1t7356s0§(§1t9426s0§) == 8) { §1t9713s0§(§1t9413s0§,100); ... getString(864,[...,"10"]) }' and :2649-2651 'else { §1t9713s0§(§1t9413s0§,25); }'. §1t9413s0§ = 12, which is STAT_HGOLD in the android constant table (StatsManager.as:194). So the web build pays 25 hard-gold per rebirth and 100 on the rebirth that promotes you to the tenth dan — tenthGold=100 exactly, and a 10th-rebirth tier that the ledger says does not exist. :2653-2655 then hard-caps the ladder: 'if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }' — the dan stat can never exceed 9, i.e. ten rungs ending at 十段. The android twin at StatsManager.as:2195-2212 has the identical shape with different money (20 vs 5 STAT_HGOLD), so the 25/100 pair is specifically a v0.717 web datum and must not be ported from mobile.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2659, :254 · reference/decompiled/shs3_android/scripts/StatsManager.as:194, :2195-2212 · docs/gauntlet/L0/index/strings.json["464"] · docs/research/REBUILD_READINESS.md:164-165`
- **Quote:** §1t1523s0§.as:2644 'if(§1t7356s0§(§1t9426s0§) == 8)' :2646 '§1t9713s0§(§1t9413s0§,100);' :2651 '§1t9713s0§(§1t9413s0§,25);' :2653 'if(§1t7356s0§(§1t9426s0§) < 9)' ‖ android StatsManager.as:2201 'if(getPlayerStats(STAT_DAN) == 8)' :2203 'changeStat(STAT_HGOLD,20);' :2207 'changeStat(STAT_HGOLD,5);' :2209 'if(getPlayerStats(STAT_DAN) < 9)'
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** ... film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + ui-hud: MAX_DAN_RANK=10 AND tenthGold=100 both promote to CONTRACT from web source; the 'no 10th-rebirth tier' clause is false; RR:245's blocker (3) 'Dan-rank count/titles (garbled source)' closes at ten rungs named 456-464 in the string table.

### `hunter-s26c/the-271-cap-is-the-web-per-stat-cap-at-level-80` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md:201 says the "271 cap" is gear/rebirth-inclusive and that a 237-point first-run budget makes 271 impossible in one stat, then files it as 'resolvable by arithmetic now'. It is not an arithmetic puzzle and it is not gear-inclusive: 271 is the literal hard-coded per-stat ceiling of the WEB build at the level cap. §1t5957s0§.as:3340 reads the character level into _loc2_ and :3344-3346 gate the ATK / DEF / SPD add buttons on 'stat < 1 + (_loc2_ + 10) * 3'. At level 80 that is 1 + 90*3 = 271 EXACTLY. The same block gives the other three ceilings for free: MAXHP < 10 + (level+10)*10 = 910 at L80, MAXCHI < 10 + (level+10)*5 = 460, MAXAP < 30 + (level+10)*5 = 480. Android's numbers are different (5 / 5 / 1 / 1 coefficients, InventoryUI.as:2407-2412) and do NOT produce 271, which is a second confirmation that 271 is a v0.717 web datum. No reconstruction needed, and the 237-point-budget reasoning in the ledger is answering a question the code never asked.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3340-3346 · reference/decompiled/shs3_android/scripts/InventoryUI.as:2406-2412 · docs/research/REBUILD_READINESS.md:201`
- **Quote:** §1t5957s0§.as:3340 'var _loc2_:int = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9411s0§);' · :3344 'var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;'  ->  level 80: 1 + 90*3 = 271
- **Overturns:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L4 progression: replace RR:201's surface note with four exact cap formulas, ATK/DEF/SPD 1+(lvl+10)*3, MAXHP 10+(lvl+10)*10, MAXCHI 10+(lvl+10)*5, MAXAP 30+(lvl+10)*5, and delete the gear/rebirth explanation of 271.

### `hunter-s26c/web-19-field-save-schema-is-a-positional-twin` — HELD [A2] ⚑ OVERTURNS LEDGER

Strengthens hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds from 'web uses the same SharedObject path' to 'web enumerates the same nineteen fields in the same order'. Android QueryManagerBase.as:2941-2959 (deleteCharCookieData) clears saved + nineteen named fields. Web §1t1832s0§.as:2815-2833 clears saved + nineteen fields in the IDENTICAL positions, four of which survived obfuscation and pin the alignment absolutely: playerLevel at slot 4, equipment at slot 6, inventory at 9, stash at 10, then playerlocation, taunt, friends as the last three on both sides. That fixes §1t9386s0§=nextAPUpdate, §1t9387s0§=nextDTUpdate, §1t1838s0§=lastUpdate, §1t7315s0§=playerStats, §1t9367s0§=skillStats, §1t6928s0§=skillSlots, §1t9369s0§=questItems, §1t9370s0§=intStats, §1t9372s0§=achievementStats, §1t9371s0§=booleanStats, §1t9373s0§=activeQuestList, §1t9374s0§=completedQuestList. The persistence schema is not something to design; it is something to transcribe.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1832s0§.as:2811-2833 · reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2936-2960 · docs/research/REBUILD_READINESS.md:351`
- **Quote:** web §1t1832s0§.as:2818 '_loc2_.data.playerLevel = "";' :2820 '_loc2_.data.equipment = "";' :2823 '_loc2_.data.inventory = "";' :2831-2833 'playerlocation / taunt / friends' ‖ android QueryManagerBase.as:2944 'sharedObject.data.playerLevel = "";' :2946 'equipment' :2949 'inventory' :2957-2959 'playerlocation / taunt / friends'
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence: the save-format half of RR:351 is recovered verbatim in the target build and leaves §6. The server-sim-topology half of that sentence still stands and should be split out rather than deleted with it.

### `hunter-s26c/web-crit-is-flat-1p3-and-the-proc-rule-is-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Two listed blockers close at once from one web function, and nobody in this packet aimed at either. §1t99s0§.as:3255-3277 is the outgoing-damage routine: :3258 rolls the base 'minDamage + Math.random() * damageRange', :3259-3271 applies the per-stance coefficient, then :3272-3274 'if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }'. So (a) RR:190's blocker (2) 'crit 1.3 vs 3 final read' resolves at 1.3 in the target build — flat multiplier plus an ADDITIVE crit-damage stat, which is exactly the mechanism RR:151-154 hypothesised for the '3x' folklore — and (b) RR:195's blocker (5) 'crit proc rule (chance vs deterministic) — entirely absent' resolves DETERMINISTIC: the only RNG in the function is the base-damage roll, and the crit branch is gated purely on Focus == maxFocus. Note this is a build divergence: android MCSPlayer.as:3215-3221 pays 1.2 for non-Light and 1.5 for Light at full reload, so a v0.717 target must take 1.3, not either android number.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:3195-3224 · docs/research/REBUILD_READINESS.md:190, :195`
- **Quote:** §1t99s0§.as:3272 'if(this.§1t4414s0§ == this.§1t4415s0§)' :3274 'return _loc2_ * 1.3 + this.§1t1243s0§;' ‖ android MCSPlayer.as:3215 'if(this.reload == this.maxreload)' :3219 'return maxDamage * 1.2 + this.STAT_CRITICALDMG;' :3221 'return maxDamage * 1.5 + this.STAT_CRITICALDMG;'
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.* ... ⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5 combat-core (2) and L2 skills-meters (5) both close from primary web source: CRIT_MULT = 1.3 with an additive crit-damage stat, proc is deterministic at Focus == max, no roll.

### `hunter-s26c/web-parity-for-the-per-kill-xp-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Discharges the 'web parity not checked' hedge on hunter-s26a/per-enemy-xp-formula-is-lvl-times-2-plus-20. The WEB payload carries the same formula in the same place: §1t68s0§.as:237 'this.xp = this.level * 2 + 20;' inside init, and :271 'this.xp = param1 * 2 + 20;' inside a setLevel (:258-276) that mirrors android NPC.as:239-259 statement for statement, including the 'if(param1 <= 20) _loc2_ *= 0.9;' pre-scale at :261-264 and the 'if(param1 <= 10)' one-HP floor at :272-276. Six further web classes repeat the literal (§1t4574s0§.as:39, §1t4570s0§.as:34, §1t4555s0§.as:62, §1t4523s0§.as:66, §1t122s0§.as:103). Per-kill XP is a target-build fact, not a mobile one.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:237, :258-276 · reference/decompiled/shs3_payload/scripts/§1t4574s0§.as:39 · reference/decompiled/shs3_android/scripts/NPC.as:239-259`
- **Quote:** §1t68s0§.as:271 'this.xp = param1 * 2 + 20;' · §1t68s0§.as:237 'this.xp = this.level * 2 + 20;' ‖ android NPC.as:252 'this.xp = lvl * 2 + 20;'
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L4 economy: the 'no XP formula either' clause of RR:215 (1) dies at the TARGET build, not merely at v0.682. The coins-per-kill half of the same sentence still stands.

### `hunter-s26c/web-parity-for-the-three-tier-reinforce` — HELD [A2] ⚑ OVERTURNS LEDGER

Discharges the 'android v0.682' build limitation on payload/reinforce-has-three-material-tiers-not-two. §1t401s0§.as:664-688 is the web twin of android InteractUI.as:649-673, line for line: :667 bails to getString(849) when the equipped weapon is null or itemID 0 or 13000; :672 takes getLevel(); :673-676 force 59 for itemID 13022; :677/:681/:685 branch <30 / <60 / else onto getString(850) / (851) / (852) — Silver Ore, Titanium Ore, Uncut Diamond, all three at a flat 5000 coins. The neighbouring menu state also matches (:662 getString(848,[_loc1_ * 10])). So RR:80's 'Reinforce 5000c+1 silver ore' is the lowest of three tiers IN v0.717, keyed on weapon level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:660-689 · reference/decompiled/shs3_android/scripts/InteractUI.as:645-676 · docs/gauntlet/L0/index/strings.json["849"], ["850"], ["851"], ["852"]`
- **Quote:** §1t401s0§.as:677 'if(_loc4_ < 30)' :679 'this.detailstext.text = §1t1521s0§.getString(850);' :681 'else if(_loc4_ < 60)' :683 '...getString(851);' :687 '...getString(852);' · strings.json["851"] = 'Reinforce your currently equipped weapon to make it unbreakable?\nCost: 5000 coins\nMaterials needed: 1 Titanium Ore'
- **Overturns:** "- **Economy statics:** ... Forge 700c+2 ore, Reinforce 5000c+1 silver ore;"
- **Lane impact:** L7 economy / items-equipment: RR:80 must carry three weapon-level tiers at a flat 5000c, in the target build, plus the 13022 -> level-59 special case.

### `s26c/the-271-cap-IS-the-shipped-level-80-base-stat-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

RR:201's explanation of the '271 cap' is wrong, and the web build says so in one line of arithmetic. §1t5957s0§.as:3344-3346 gate the ATK/DEF/SPD add-buttons on 'stat < 1 + (level + 10) * 3'. At the level cap of 80 that is 1 + 90 * 3 = 271 EXACTLY. So 271 is not a gear/rebirth-inclusive total that a 237-point first-run budget makes unreachable in one stat — it is the shipped per-stat hard ceiling for ATK, DEF and SPD, straight from the target build, and it is unreachable in one stat for a much simpler reason: the panel stops granting. The companion web ceilings from the same block are MAXHP 10 + (level + 10) * 10 = 910 at L80, MAXCHI 10 + (level + 10) * 5 = 460, MAXAP 30 + (level + 10) * 5 = 480. This is a strict strengthening of progression/per-stat-caps-are-a-level-formula, which noticed the formulas but never substituted the level cap and so never saw the 271 identity.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3340-3346`
- **Quote:** §1t5957s0§.as:3344 'var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;' with _loc2_ = the level read at :3340 — at level 80, 1 + 90 * 3 = 271
- **Overturns:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L4 progression — RR:201's surface note is not merely replaceable, it is factually wrong about what 271 is. Ship STAT_CAP_ATK/DEF/SPD = 1 + (level + 10) * 3 as CONTRACT and delete the gear/rebirth reconciliation.

### `s26c/web-offline-save-reset-enumerates-the-same-nineteen-fields` — HELD [A2] ⚑ OVERTURNS LEDGER

hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds proves 19 fields on the ANDROID side and then supports 'both' with only four plain-named web members. The web side actually carries the full count, which is what closes the build-parity hole: §1t1832s0§.as:2811 'internal function §1t2002s0§(param1:String) : *' opens the per-character SharedObject at :2813 and blanks :2815 through :2833 — exactly NINETEEN fields — whose plain-named members and tail ORDER match android one for one: playerLevel (:2818), equipment (:2820), inventory (:2823), stash (:2824), then playerlocation (:2831), taunt (:2832), friends (:2833), which is android QueryManagerBase.as's :2928, :2929, :2930 in the same sequence. The remaining thirteen web members are obfuscated but positionally aligned with android's thirteen. So the 19-field offline persistence schema is HELD at v0.717, not inherited from v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1832s0§.as:2811-2833 + reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2912-2930`
- **Quote:** §1t1832s0§.as:2813 'var _loc2_:SharedObject = SharedObject.getLocal(§1t1523s0§.§1t2501s0§ + "_" + param1);' · :2831-2833 '_loc2_.data.playerlocation = ""; _loc2_.data.taunt = ""; _loc2_.data.friends = "";' || android QueryManagerBase.as:2928-2930 'sharedObject.data.playerlocation = StatsManager.getLocationString(); sharedObject.data.taunt = StatsManager.getTaunt(); sharedObject.data.friends = StatsManager.getFriendListString();'
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence — the 'save format' clause of §6 :351 falls at the TARGET build with no android hand-wave. The 'server-sim topology' clause of the same sentence is untouched and still stands.

### `s26c/web-payload-carries-the-same-xp-lvl-times-2-plus-20-setLevel` — HELD [A2] ⚑ OVERTURNS LEDGER

hunter-s26a/per-enemy-xp-formula-is-lvl-times-2-plus-20 hedged 'android v0.682 (web parity not checked)'. I checked it, and the hedge is dischargeable: the WEB payload carries a line-for-line twin of android NPC.setLevel. §1t68s0§.as:258 'public function setLevel(param1:int) : *' -> :260 'var _loc2_:Number = param1 / this.level;' -> :261 'if(param1 <= 20)' -> :263 '_loc2_ *= 0.9;' -> :266-268 the damage/defense/hp scaling -> :271 'this.xp = param1 * 2 + 20;' -> :272-277 'if(param1 <= 10)' clamping damage, defense and hp to 1. My grep for '* 2 + 20' across reference/decompiled/shs3_payload/scripts/ returns SEVEN web sites (§1t68s0§.as:237 and :271, §1t122s0§.as:103, §1t4523s0§.as:66, §1t4555s0§.as:62, §1t4570s0§.as:34, §1t4574s0§.as:39). The per-kill XP award and the sub-level-10 one-hit-kill clamp are both CONTRACT at the TARGET build, not just at v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:258-279 (key line :271) + reference/decompiled/shs3_android/scripts/NPC.as:239-260 (key line :252)`
- **Quote:** §1t68s0§.as:271 'this.xp = param1 * 2 + 20;' · §1t68s0§.as:272-276 'if(param1 <= 10) { this.damage = 1; this.defense = 1; this.§1t3257s0§ = 1;' || android NPC.as:252 'this.xp = lvl * 2 + 20;'
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L4 economy + enemies-ai — removes the build-parity hole from the XP-per-kill close, and the same twin function supplies RR:220 ①'s enemy level→stat scaling (factor = lvl / baseLevel, x0.9 below level 21) and ② per-enemy HP (=1 at or below level 10).

### `skills-meters/heavy-stance-damage-is-flat-and-only-heavy-reach-scales` — HELD [A2] ⚑ OVERTURNS LEDGER

RR:155 packs two different formulas into one sentence and gets the pairing backwards. In web v0.717 DAMAGE (§1t99s0§.as:3255-3271) light scales with light mastery (0.5 -> 0.9), balanced with balanced mastery (1.0 -> 1.2), and heavy is FLAT x1.4 with no mastery term at all - :3267-3270 fall through three cases to '_loc2_ = _loc1_ * 1.4;'. REACH (§1t99s0§.as:3091-3121) is the mirror image: light is FLAT x1.4 of base (:3094), balanced scales with balanced mastery (:3105), and heavy scales with heavy mastery (:3116) AND is clamped to a floor of 100 at :3117-3119. So exactly one of the three stances is mastery-flat in each table, and it is a different stance in each. The ledger's '(Heavy is fixed)' is true for damage only, and its 'Heavy's reach also scales x0.5 -> x0.9' is right but is the ONLY reach term it names.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3121 and :3255-3271`
- **Quote:** §1t99s0§.as:3270 '_loc2_ = _loc1_ * 1.4;' (heavy damage, no mastery term) · :3094 'this.§1t4417s0§ = this.§1t4420s0§ * 1.4;' (light reach, no mastery term) · :3116-3119 'this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }'
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's *reach* also scales ×0.5→×0.9."
- **Lane impact:** L2 skills-meters + L5 combat-core. Model two separate 3-entry tables with a mastery term on a DIFFERENT stance in each, plus a hard reach floor of 100 on heavy. The ledger's reach triple 300/200/100 is not reproducible from these multipliers at any single base.

### `skills-meters/stance-mastery-domain-is-1-to-10-in-skilldata` — HELD [A2] ⚑ OVERTURNS LEDGER

The mastery ceiling question is closed by data, not arithmetic alone. skilldata.xml skill id 1000 has displayname 6000, which strings.json resolves to 'Light Stance Mastery', is marked <passive>1</passive>, and carries exactly ten <level> blocks with <value> 1 through 10 (required 1..9). StatsManager.as:740-742 seeds skillStats with IntStat(1000,1)/(1001,1)/(1002,1), so mastery is 1-indexed with floor 1 and cap 10. Feeding 10 into §1t99s0§.as:3262 gives exactly 0.90 and into :3265 exactly 1.20 — the ledger's own ceiling numbers. There is no off-by-one here, unlike the DAN stat which really is stored 0-indexed.

- **Cite:** `reference/extracted/skilldata.xml:3-79 + docs/gauntlet/L0/index/strings.json["6000"] + reference/decompiled/shs3_android/scripts/StatsManager.as:740-742 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262,:3265`
- **Quote:** skilldata.xml: <id>1000</id><displayname>6000</displayname><passive>1</passive> ... <level><value>10</value><required>9</required>
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L2 skills-meters: MASTERY domain is [1,10]; the stance curve's endpoints are m=1 (Light 0.54, Balanced 1.02) and m=10 (0.90 / 1.20).

### `ui-hud/battleui-carries-its-own-change-stance-button-in-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

The in-battle stance switch is a first-class UI affordance, not just a hotkey. Web §1t113s0§ (BattleUI) declares the button §1t5158s0§ at :22, gives it buttonMode at :149, labels it §1t5161s0§.text = getString(208) = 'Change Stance' at :146, and hit-tests it at :379-381 into §1t5207s0§ (:468-480), which cycles the stance when §1t4470s0§() passes and plays Snd_error when it does not. Android BattleUI.as:109-110 carries the same `changestancelabel.text = LangManager.getString(208)`, so the button is in BOTH builds — this is not a v0.717 addition. The android twin also decodes three obfuscated web fields: BattleUI.as:101-102 `crittext.text = getString(175)` == §1t113s0§.as:120-121 (field declared :44), so §1t5169s0§ = crittext, §1t5161s0§ = changestancelabel, and §1t5182s0§ = reloadbar (declared BattleUI.as:60).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:22,:44,:64,:120-121,:146,:148-149,:379-381,:468-480 + reference/decompiled/shs3_android/scripts/BattleUI.as:60,:101-102,:109-110 + docs/gauntlet/L0/index/strings.json["208"]='Change Stance', ["175"]='Critical Hit'`
- **Quote:** §1t113s0§.as:381  this.§1t5207s0§();   //  :470-479  if(...§1t4470s0§()) { Snd_smallClick; ...§1t4472s0§(); } else { Snd_error; }
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L8 ui-hud: the combat HUD needs a Change Stance button next to the portrait, and the obfuscated-to-readable map (crittext / changestancelabel / reloadbar) unblocks the rest of the BattleUI port.

### `ui-hud/frame-proof-the-stance-label-hides-when-the-third-bar-fills` — HELD [A1] ⚑ OVERTURNS LEDGER

First-hand frame proof for the reload-meter reading of 'CANNOT CHANGE STANCE'. In reference/frames/duel_dense/Nr4fQstqHDM_428.0.png the bottom-left cluster is THREE bars — green HP 20/20, blue Chi 26/26, and a third EMPTY brown bar with 'CANNOT CHANGE STANCE' lettered across it. In Nr4fQstqHDM_432.5.png and Nr4fQstqHDM_432.9.png, same duel, that third bar carries a fill block at its left end and the label is ABSENT. That is §1t113s0§.as:336-342 (show the grey label at ratio==0) and :344-347 (hide it while 0<ratio<1) rendered on film. The label is a meter-state readout, not a battle-state lock notice.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, _432.5.png, _432.9.png — crop (240,1018)-(540,1052) of the 1920x1080 frame, upscaled 3x LANCZOS`
- **Quote:** t=428.0 third bar empty + 'CANNOT CHANGE STANCE'; t=432.5 and t=432.9 third bar has left-edge fill and NO label
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L8 ui-hud + L5 combat-core: ship one reload/crit meter with threshold 48 for the stance switch and max for the crit, a grey label ON the empty bar, no label while filling.

### `ui-hud/string-960-is-cannot-change-stance-frame-resolved` — HELD [A1] ⚑ OVERTURNS LEDGER

The web-only string 960, unresolvable from the android v0.682 table, is resolved by film. Crop (0,820)-(660,1080) of reference/frames/session11/crit-focus/t1003.000.png upscaled 3x shows the combat HUD as portrait + THREE stacked bars: green HP 14/20, blue Chi 31/31, and a third bar whose track is EMPTY, with the words CANNOT CHANGE STANCE centred on that empty track in pale grey. The same crop of t1082.100.png shows HP 11/20, Chi 31/47, and the third bar about 28% filled with NO text on it. That is exactly §1t113s0§.as:336-342 (show the #BBBBBB getString(960) label when (reload-48)/(max-48) == 0) and :343-346 (hide it while 0 < ratio < 1). getString(960) = 'CANNOT CHANGE STANCE'. The label is a meter readout, not a battle-state lock.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png + reference/frames/session11/crit-focus/t1082.100.png, crop (0,820)-(660,1080) of 1920x1080, 3x LANCZOS; read against reference/decompiled/shs3_payload/scripts/§1t113s0§.as:111,:328,:336-346`
- **Quote:** t1003.000.png: third bar track empty, pale-grey 'CANNOT CHANGE STANCE' centred on it, yellow '150% DAMAGE' on the line below. t1082.100.png: third bar ~28% filled, no text on it.
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L8 ui-hud + L5 combat. Ship the label as a third bar under HP/Chi: empty track -> grey 'CANNOT CHANGE STANCE'; partially filled -> no label; full -> black 'Critical Hit' + Snd_criticalDamage.

### `ui-hud/the-video-study-notes-misread-the-cannot-change-stance-slot` — HELD [A1] ⚑ OVERTURNS LEDGER

THE FRAME WINS, AND IT OVERTURNS A MEASUREMENT DOC. Three video-study segment notes describe this HUD element wrongly and the ledger inherited the error. docs/research/video-study/segments/B-11-castle-gate-lever-puzzle.md:7 calls the label 'Yellow text'; :45 and :71 read the slot as 'a green X/20 bar (stance-lock resource, label CANNOT CHANGE STANCE)' fluctuating 4/20 -> 2/20 -> 3/20; docs/research/video-study/segments/A-16-beach-fights-named-enemy-jinbei-archer.md:23 calls it a 'blue bar ... 20/20'. The frame shows otherwise: in t1003.000.png the CANNOT CHANGE STANCE label is PALE GREY, distinctly not the saturated yellow of the '150% DAMAGE' line directly beneath it, and its bar carries NO numerals at all - the numeric bars are the green HP (14/20) and blue Chi (31/31) ABOVE it. The notes conflated the third bar with the HP bar and the label colour with the buff banner's. The code agrees with the frame: §1t113s0§.as:111 builds the label at '#BBBBBB', and §1t5205s0§ sets only bar.scaleX with no text, while the numeric bars are set by §1t5202s0§ at :319-324.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png, crop (0,820)-(660,1080), 3x LANCZOS; against docs/research/video-study/segments/B-11-castle-gate-lever-puzzle.md:7,:45,:71 and reference/decompiled/shs3_payload/scripts/§1t113s0§.as:111,:319-324,:326-346`
- **Quote:** B-11:71 'the small green "X/20" bar (stance-lock resource, label "CANNOT CHANGE STANCE")' - the frame shows the label sits on a SEPARATE, numeral-free third bar, grey, below the green 14/20 HP bar and the blue 31/31 Chi bar.
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L8 ui-hud. Do not port the 'green X/20 stance-lock resource' from the segment notes into config - it does not exist. There are three bars: HP (numeric), Chi (numeric), crit/reload (no numerals).

### `world/the-war-map-mask-and-pitch-are-web-side-too-parity-closed` — HELD [A2] ⚑ OVERTURNS LEDGER

The war-map board specification is NOT android-only, which was the one real hole in the packet's world finding. Web v0.717 §1t7934s0§.as:15/:17/:19 declare 8 / 21 / 51 — byte-identical to WarSelectUI.as — :232 is the land test `getPixel(param1 + §1t12536s0§ - §1t12535s0§, param2 + §1t12537s0§) != 0`, and :299-300 place the war flag at `(x + 21) * 10 + 4.5` / `(y + 51) * 10 + 8.8`. §1t6481s0§.as:17/:19/:21 repeats the same three constants for the world map. The 63x72 mask itself is web bindata 92 (reference/extracted/bindata/92_1t4648s0.bin), not an android blob. So the C2 build-parity caveat does not apply to the war map: geography, bounds, offsets and pitch are all attested on the WEB side.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7934s0§.as:15,:17,:19,:232,:299-300,:320-321 + reference/decompiled/shs3_payload/scripts/§1t6481s0§.as:17,:19,:21,:263 + reference/extracted/bindata/92_1t4648s0.bin`
- **Quote:** §1t7934s0§.as:15 public static var §1t12535s0§:int = 8;  :17 §1t12536s0§:int = 21;  :19 §1t12537s0§:int = 51;  ///  :299 _loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;
- **Overturns:** "(1) **world bounds + geography** (sparse Japan-outline, not a WxH grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L10 world-exploration: world.ts can be written from the payload alone — 63x72 cell space, land = mask non-black, mapid = (x+341)<<12 | (y+341), flag at (x+21)*10+4.5 / (y+51)*10+8.8.

### `world/the-war-map-mask-is-byte-identical-across-web-and-android` — HELD [A2] ⚑ OVERTURNS LEDGER

A genuine, non-circular web/android parity datum - rare in this corpus, and it survives correction C2. reference/extracted/bindata/92_1t4648s0.bin (a WEB payload bindata file) and reference/extracted/android/110_Mobile_MapBitmapData.bin (the ANDROID blob) have the identical md5 13068dfa1a5cc5628720a25782f93fed. Both are a GIF89a 63x72 with exactly 735 white and 3801 black pixels. C2's circularity warning does not apply here, because 92 is a web-side artifact and 110 is android-side - this is not a file diffed against itself. Android WarSelectUI.as:153 wires it to the war board via QuestEngine.getMapBitmapData(), and Mobile_MapBitmapData.as:5 embeds 110 by name, so the file's role is named by the game, not inferred.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin + reference/extracted/android/110_Mobile_MapBitmapData.bin (both md5 13068dfa1a5cc5628720a25782f93fed) + reference/decompiled/shs3_android/scripts/WarSelectUI.as:153 + reference/decompiled/shs3_android/scripts/Mobile_MapBitmapData.as:5`
- **Quote:** Mobile_MapBitmapData.as:5 '[Embed(source="/_assets/110_Mobile_MapBitmapData.bin", mimeType="application/octet-stream")]' · WarSelectUI.as:153 'this.mapBitmapData = QuestEngine.getMapBitmapData();'
- **Overturns:** "(1) **world bounds + geography** (sparse Japan-outline, not a W×H grid) - *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L10 world-exploration. The world geography is a shipped 63x72 bitmap with 735 land cells, identical in both builds. No Fandom mining and no tracing. Also: bindata file 92 now has a role, closing part of S0-1's '92 a GIF'.

### `combat-core/crit-multiplier-1-3-is-in-the-web-damage-function` — HELD [A2]

Found while judging, unclaimed by anyone in this packet: the 1.3x crit multiplier is not wiki folklore, it is in the shipped web damage function. §1t99s0§.as:3272-3274 reads `if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }` — i.e. when the reload meter is at maximum, post-stance damage is multiplied by exactly 1.3 and a flat bonus is added. Same meter as the stance gate (>=48 at :3050) and the same meter the BattleUI crit label watches (§1t113s0§.as:348-358 fires Snd_criticalDamage at ratio>=1). This makes CRIT_MULT=1.3 CONTRACT from the payload, independent of the wiki.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274 + §1t99s0§.as:3048-3051 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:348-358`
- **Quote:** §1t99s0§.as:3272-3274  if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }
- **Overturns:** "SHS:Duels' own wiki (2016 + 2025) states the formula "Critical = **1.3x Physical**." Keep `CRIT_MULT=1.3`."
- **Lane impact:** L5 combat-core: CRIT_MULT=1.3 upgrades from wiki-sourced to payload CONTRACT, and the crit trigger is 'meter at max', not a random roll.

### `hunter-s26c/survival-mode-enemy-id-sets-are-equal-not-unequal` — HELD [A3]

A correction that must ride along with NF-E/survival-mode-content-diverges-14-of-87-rows so a false line does not enter the ledger with a true one. That finding asserts 'The unique-id sets are unequal in both directions.' I computed both differences over reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin by splitting every <id> on '|': web-minus-android is EMPTY and android-minus-web is EMPTY. Enemy 443 is already present elsewhere in the android blob. What actually differs is the alternation POOL of fourteen late-wave rows (0-indexed 73-86, not the twelve the finding enumerates), where web appends '|443' — a re-authored wave composition, not a roster change. Everything else in that finding reproduces exactly: 11,721 vs 11,553 bytes, 39 waves, 87 enemy rows, identical spawn-x histogram {-50:49, 1650:37, -1650:1}.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (own pairwise <enemy> diff + both unique-id set differences)`
- **Quote:** web-only ids: [] · android-only ids: [] · differing rows (0-indexed): [73,74,75,76,77,78,79,80,81,82,83,84,85,86] · row 85 web '<id>451|456|451|456|443</id><qty>6</qty>' vs android '<id>451|456</id><qty>6</qty>'
- **Overturns:** "(no REBUILD_READINESS.md sentence — this corrects a packet finding before it is absorbed)"
- **Lane impact:** Cross-cutting: absorb the 14/87 divergence, drop the 'unequal id sets' clause, and widen the enumerated rows from 73-84 to 73-86.

### `hunter-s26c/war-room-10px-territory-pitch-is-web-side-too` — HELD [A2]

Repairs the build label on meta-social/war-room-frame-carries-rank-moves-and-clan-numbers, which is filed as 'web v0.717' but cites the ANDROID WarSelectUI.as for its 10-px territory pitch — exactly the kind of cross-build slip correction C2 warns about. The web payload carries the same transform: §1t7934s0§.as:299 '_loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;', the twin of android WarSelectUI.as:233 'warFlag.x = (terrx + TERRSHIFTX) * 10 + 4.5;'. So the pitch claim survives at the target build and the frame cite and the code cite are now the same build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7934s0§.as:299 · reference/decompiled/shs3_android/scripts/WarSelectUI.as:225-236`
- **Quote:** web §1t7934s0§.as:299 '_loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;' ‖ android WarSelectUI.as:233 'warFlag.x = (terrx + TERRSHIFTX) * 10 + 4.5;' :234 'warFlag.y = (terry + TERRSHIFTY) * 10 + 8.8;'
- **Lane impact:** L11/L12 meta-social: the War-Room board pitch is target-build evidence, contributing to RR:245's blocker (2) map topology rather than sitting on a mobile-only cite.

### `s26c/survival-mode-id-sets-are-IDENTICAL-across-builds` — HELD [A3]

Correction to NF-E/survival-mode-content-diverges-14-of-87-rows, which is otherwise HELD. Its sentence 'The unique-id sets are unequal in both directions' is FALSE. I extracted every <id> token from both blobs: web reference/extracted/bindata/119_1t4646s0.bin and android reference/extracted/android/109_WarHexUI_SurvivalModeData.bin each carry the SAME 62 distinct enemy ids (400-429, 435-451, 453-456, 700-710), web-only set empty and android-only set empty. Enemy 443 is present in the android file too — what the web build changed is the alternation POOL of 14 late-wave rows (73-86), not the roster. Also, the differing block runs rows 73-86 inclusive, not 73-84 as enumerated; the stated total of 14 is correct but rows 85-86 ('451|456|451|456|443', qty 6) were left out of the list. Strike the id-set sentence before this enters the ledger, or the rewrite will assert a roster difference that does not exist.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Quote:** my own parse: web ids == android ids == {400..429, 435..451, 453..456, 700..710}, 62 each; set difference empty in both directions; differing <enemy> row indices = 73,74,75,76,77,78,79,80,81,82,83,84,85,86
- **Overturns:** "n/a — corrects a packet claim, not a ledger sentence"
- **Lane impact:** Cross-cutting: keeps the survival-mode overturn honest. The mode's ROSTER is shared; only 14 late-wave spawn pools diverge, and the web blob is the one to author from.

### `strings/the-android-lang-table-skips-ids-881-999-entirely` — HELD [A2]

A false-negative trap of the same family as correction C1, for the string table this time. 'String N is absent from strings.json' does NOT imply 'N is a v0.717 addition'. Parsing the raw UTF-16LE XLIFF in reference/extracted/android/118_Mobile_Lang_EN.bin yields 2555 trans-unit ids, and in the range 850-1010 they run 850..865, 867..880, then jump straight to 1000. The whole block 881-999 is missing from the android v0.682 table - 119 consecutive ids, not one. So string 960's absence is a block gap, and any claim that infers 'web-only addition' from a single absent id in that range is resting on a hole, not on evidence. There are 20 such gaps in the table (largest: 1044->2000).

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin (UTF-16LE XLIFF, 2555 trans-unit ids parsed) + docs/gauntlet/L0/index/strings.json (2533 entries, same gaps)`
- **Quote:** ids present in 850..1010: 850,851,...,865,867,868,...,880,1000,1001,...,1010 - nothing in 881..999. Gap list over the whole table: (211,222) (356,366) (664,666) (819,821) (865,867) (880,1000) (1044,2000) (2014,3000) (3018,4000) (4427,5000) (5001,5003) (5016,5018) (5021,5026) (5033,5035) (5122,6000) (6146,7000) (7002,7004) (7040,7042) (7095,8000) (8159,9001).
- **Lane impact:** Cross-lane evidence hygiene. Two claims in this packet inferred 'v0.717 addition' from id 960's absence. The inference happens to be harmless there (the frame resolved 960 directly), but as a rule it is unsound and should not be reused.

### `ui-hud/the-stance-label-is-grey-not-yellow-the-frame-wins` — HELD [A1]

THE FRAME WINS over the measurement docs. SYNTHESIS.md:45 and the B-11, B-24 and A-16 segment notes all describe the in-combat stance label as YELLOW. Measured off the frame, the label's bright pixels average #B3AA9C — a neutral light grey consistent with §1t113s0§.as:111 `<font color='#BBBBBB'>` — while the '150% DAMAGE' buff line directly beneath it averages #EDBD1F. The study docs read the buff line's colour onto the label above it. White HP digits in the same crop measure #DCE7DE, so the label is demonstrably darker and un-tinted.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — pixel census over crops (260,1025)-(520,1048) label, (260,1050)-(520,1075) buff line, (300,975)-(420,1000) HP digits`
- **Quote:** label mean #B3AA9C (n=1307) | '150% DAMAGE' mean #EDBD1F (n=678) | HP digits mean #DCE7DE (n=481)
- **Overturns:** "**Stance lock in combat:** the label swaps to **"CANNOT CHANGE STANCE"**"
- **Lane impact:** L8 ui-hud: palette the label grey #BBBBBB, not yellow. Corrects SYNTHESIS.md:45 and three segment docs.

### `world/the-hud-prints-territory-21-51-on-film` — HELD [A1]

Frame-side confirmation of the two shift constants the war-map finding rests on. reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png shows the overworld minimap panel top-right with 'TERRITORY (21,51)' and 'SECTOR (4,3)' printed beneath it. TERRSHIFTX=21 and TERRSHIFTY=51 are therefore not merely code constants — they are the start territory the ledger already records as 'start 21,51 / 0,3', now seen on film. The same frame also shows a red overworld nameplate reading 'GUESTDIT (3)', which is independent frame evidence for the (N)=level plate.

- **Cite:** `reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png — full 1920x1080 frame downscaled to 960x540; minimap panel occupies roughly x 760-930, y 70-280`
- **Quote:** on-screen: 'TERRITORY (21,51)' / 'SECTOR (4,3)'; red plate 'GUESTDIT (3)'
- **Overturns:** "- **Ready:** territory/sector coord system (start 21,51 / 0,3)"
- **Lane impact:** L10 world-exploration + L0 ui-hud: the minimap prints TERRITORY (x,y) and SECTOR (x,y) verbatim, and the coordinate origin matches the payload's TERRSHIFTX/Y.
