# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 12 critic reviews · 49 claims · 157 verdicts.

## unassigned — re-scored ?

### `NF-A/web-focus-meter-constants-diverge-and-the-recharge-is-plus-one` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus/crit gating rule closes, but on WEB constants that differ from android on three of five terms, and the per-tick recharge is +1, not +6, in BOTH builds. WEB v0.717: maxreload = 8*24 = 192 frames (§1t99s0§.as:249) against android's 5*24 = 120 (MCSPlayer.as:239). Recharge is +1 per tick while reload < maxreload (web §1t99s0§.as:1203-1205; android MCSPlayer.as:1158-1160); the +6 is bonusReload(), whose only caller is NPCManager.as:1711 inside `if(deathCount > 0)` — a KILL bonus (web twin §1t99s0§.as:3320-3323). In-battle stance switch costs a FLAT -48 in web (§1t99s0§.as:3162, inside §1t3489s0§ under the isBattle guard) where android collapses reload>max/2 to max/3 else -max/6 (MCSPlayer.as:3098-3104, inside setStance which opens at :3019). The stance gate is reload >= 48 in web (§1t99s0§.as:3050, :3060) vs reload < maxreload/6 = 20 in android (MCSPlayer.as:2977). Identical in both: zero-at-full on a slash, and the x0.5 / x1 / x1.5 per-stance drain. Nothing about this system needs measuring — but the android numbers are the wrong build's.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3050, :3060, :3162, :3295-3310, :3320-3323 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :1158-1160, :2977, :3098-3104, :3242-3272 and NPCManager.as:1711`
- **Quote:** web §1t99s0§.as:249 `this.§1t4415s0§ = 8 * 24;` · :1205 `++this.§1t4414s0§;` · :3162 `this.§1t4414s0§ -= 48;` · :3060 `if(this.§1t4414s0§ < 48)` ‖ android MCSPlayer.as:239 `this.maxreload = 5 * 24;` · :1160 `++this.reload;` · :3104 `this.reload -= this.maxreload / 6;` · NPCManager.as:1711 `StatsManager.getPlayer().bonusReload();`
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 combat-core ⑤ and skills-meters ③ close on WEB numbers: max 192, +1/tick, +6 per kill, -48 per in-battle stance switch, gate at 48, x0.5/x1/x1.5 slash drain, crit at full.

### `NF-A/web-stance-triangle-has-a-second-0p9-arm` — HELD [A2] ⚑ OVERTURNS LEDGER

The stance counter-triangle has TWO arms in web v0.717, not one. Winning matchups (Light vs Balanced, Balanced vs Heavy, Heavy vs Light) take damage x1.2; LOSING matchups (Light vs Heavy, Balanced vs Light, Heavy vs Balanced) take damage x0.9. Android v0.682 has only the x1.2 arm - grep for '*= 0.9' across MCSPlayer.as returns zero hits. Both arms are applied before the defense subtraction and before the min-damage floor. REBUILD_READINESS.md:74 carries neither term; a Sim written from that bullet is wrong by 20% on countered matchups and by 10% on countering ones.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3798 and :4379-4389 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3707`
- **Quote:** §1t99s0§.as:3788 `if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§ || this.stance == §1t12221s0§ && _loc11_ == §1t12222s0§ || this.stance == §1t12222s0§ && _loc11_ == §1t12220s0§)` :3790 `_loc5_ *= 1.2;` :3796 `else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || this.stance == §1t12221s0§ && _loc11_ == §1t12220s0§ || this.stance == §1t12222s0§ && _loc11_ == §1t12221s0§)` :3798 `_loc5_ *= 0.9;`
- **Overturns:** "**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);"
- **Lane impact:** L1/L5 combat-core: RR:74 needs both triangle arms added, and the pair must be applied pre-defense, pre-floor.

### `NF-B/stance-triangle-is-defender-keyed-and-web-adds-a-losing-side` — HELD [A2] ⚑ OVERTURNS LEDGER

The stance counter-triangle runs in the DEFENDER's frame, and the web build has a losing side android lacks. Both x1.2 branches sit inside gotHit (android MCSPlayer.as:3580; web §1t99s0§ — _loc11_ is assigned param2.stance at :3754, param2 being the Damage object), so `this.stance` is the defender and the attacker's stance is the operand. The shipped rule is: Balanced beats Light, Heavy beats Balanced, Light beats Heavy — confirmed independently by the game's own copy, strings.json["6001"]/["6003"]/["6005"]. The WEB build additionally applies x0.9 on each reversed matchup (§1t99s0§.as:3796-3798), which android has no counterpart for: six ordered outcomes, not three. Both terms land BEFORE the DEF subtraction and the min-damage floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3754, :3788-3794, :3796-3798, :3800-3804 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3580, :3654, :3701-3709 + docs/gauntlet/L0/index/strings.json["6001"], ["6003"], ["6005"]`
- **Quote:** web §1t99s0§.as:3754 `_loc11_ = param2.stance;` · :3790 `_loc5_ *= 1.2;` · :3796 `else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || …)` :3798 `_loc5_ *= 0.9;` ‖ android MCSPlayer.as:3580 `override public function gotHit(target:MovieClip, damageObj:Damage) : Boolean` · :3654 `var enemyStance:int = damageObj.stance;` ‖ strings.json["6003"] 'Balanced stance.\nEffective against Light Stance.'
- **Overturns:** "**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way);"
- **Lane impact:** L1 combat-core: the :74 KNOWN-KNOWN damage line is missing a rock-paper-scissors term entirely, and the web build's version is a 6-way table (x1.2 / x0.9 / x1.0), not the 3-way the android decompile shows.

### `NF-B/web-focus-numerics-diverge-from-android-on-four-constants` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus/reload model differs between builds on four constants, and the web values are the ones a v0.717 target needs. maxreload is 8*24 = 192 in web (§1t99s0§.as:249) against 5*24 = 120 in android (MCSPlayer.as:239). The stance-switch cost is a FLAT -48 in web (§1t99s0§.as:3162-3165) against 'reload > max/2 -> max/3, else -= max/6' in android (MCSPlayer.as:3098-3105). The stance-switch gate is 'reload >= 48' in web (§1t99s0§.as:3050 and :3060) against 'reload < max/6' in android (MCSPlayer.as:2977). The HUD normalisation is (reload-48)/(max-48) in web (§1t113s0§.as:326-328) against (reload-24)/(max-24) in android (MCSPlayer.as:3272). Unchanged across builds: +1 fill per tick, the per-stance slash drain (x0.5 light / x1 balanced+reversed / x1.5 heavy+dual), zero-on-crit-slash, and the +6 kill bonus. This closes RR:195 (3) 'Focus numerics (max/fill/switch-cost)' and RR:190 (5) on WEB constants.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3050, :3060, :3162-3165, :3295-3314, :3318-3325 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-328 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :1158-1168, :2977, :3098-3105, :3240-3272`
- **Quote:** web §1t99s0§.as:249 'this.§1t4415s0§ = 8 * 24;' · :3060 'if(this.§1t4414s0§ < 48)' · :3162 'this.§1t4414s0§ -= 48;' · §1t113s0§.as:328 'var _loc3_:Number = (param1 - 48) / (param2 - 48);'  ||  android MCSPlayer.as:239 'this.maxreload = 5 * 24;' · :2977 'if(this.reload < this.maxreload / 6)' · :3098 'if(this.reload > this.maxreload / 2)' · :3100 'this.reload = this.maxreload / 3;' · :3272 'StageManager.getBattleUI().updateReload((this.reload - 24) / (this.maxreload - 24));'
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 skills-meters + L5 combat-core: the blocker closes, but only on the WEB constants. Porting the android Focus model to a v0.717 target is wrong on max, switch-cost, gate and HUD scale simultaneously.

### `NF-C/web-spd-to-cooldown-saturates-at-600-not-300` — HELD [A2] ⚑ OVERTURNS LEDGER

The SPEED-stat → skill-cooldown transfer function exists in the WEB build too, and its saturation point is 600, not the android build's 300: cooldownModifier = 1 - min(speed, 600) / 600 * 0.5. It is reached from §1t1523s0§.as:2279-2286 (STAT_SPEED = §1t9410s0§ = 8, x1.5 while the speed buff is up) and consumed at §1t105s0§.as:318, where a skill's cooldown is levelList[level].cooldown * 24 multiplied by the modifier. Porting the android constant halves the benefit at any given SPD (at SPD 300 android is already at the 0.5 floor while web is at 0.75).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296 and :2279-2286 · reference/decompiled/shs3_payload/scripts/§1t105s0§.as:297-319 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
- **Quote:** web §1t1523s0§.as:2291 `if(param1 > 600)` :2293 `param1 = 600;` :2295 `return 1 - param1 / 600 * 0.5;` · §1t105s0§.as:308 `_loc2_ = this.levelList[this.levelList.length - 1].cooldown * 24;` :318 `return _loc2_ * §1t1523s0§.§1t9589s0§();` ‖ android StatsManager.as:1856 `if(speed > 300)` :1860 `return 1 - speed / 300 * 0.5;`
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters ④ closes at the TARGET build — and closes with 600, not the 300 an android-sourced claim would write into a v0.717 config.

### `NF-D/web-spd-to-cooldown-saturates-at-600-not-300` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 SPEED-to-skill-cooldown transfer function saturates at SPD 600, not SPD 300: cooldownModifier = 1 - min(speed, 600) / 600 * 0.5. The shape is the same linear halving as android's, but the knee is at twice the speed, so at any given SPD below 300 the web build gives HALF the cooldown reduction the android formula does (e.g. SPD 150 -> 0.875 web vs 0.75 android). The wrapper is the structural twin of android getSkillCooldownModifier: it reads stat §1t9410s0§ = 8 (= STAT_SPEED, android StatsManager.as:186) and applies the same *= 1.5 buff branch before delegating.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2296, :220 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1845-1861, :186`
- **Quote:** §1t1523s0§.as:2289 `internal static function §1t9590s0§(param1:int) : Number` :2291 `if(param1 > 600)` :2293 `param1 = 600;` :2295 `return 1 - param1 / 600 * 0.5;`  ||  StatsManager.as:1856 `if(speed > 300)` :1858 `speed = 300;` :1860 `return 1 - speed / 300 * 0.5;`
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters: the blocker closes, but the ledger must carry the WEB constant 600. NF-4-spd-to-cooldown-formula-recovered supplies the correct android formula and honestly flagged web parity as unchecked - this discharges that flag, and it diverges.

### `NF-E/bindata-parity-map-21-of-27-identical-and-a-spider-only-in-web` — HELD [A3] ⚑ OVERTURNS LEDGER

md5 census of all 27 web bindata blobs against all 42 android blobs: 21 are BYTE-IDENTICAL, including 108_1t4635s0.bin == 99_MCSCharacter_HumanAnimationData.bin (so the severed-limb deaths deathnohand/deathnohead/deathinhalf are v0.717, not android-only) and 103_1t4630s0.bin == 94_MCSCharacter_Human2AnimationData.bin (so the two 8-frame flinch clips are provably shared). Six differ: ogre (100, 184,193 vs 184,120), skills (102, 333,768 vs 338,096), guardian (111, 117,638 vs 117,596), spear (113, 153,258 vs 132,270), survivalmodedata (119) — and 114_1t4641s0.bin, a SPIDER animation set of 10 anims (spider_idle, spider_walk, spider_attackstart, spider_attackend, spider_lunge, spider_death, spider_flinch, spider_descend, spider_dig, spider_death2) with NO android counterpart at all. An enemy type that exists only in the target build.

- **Cite:** `reference/extracted/bindata/ (27 files) hashed against reference/extracted/android/ (42 files) + docs/gauntlet/L0/index/bindata.json child_ids for 114_1t4641s0.bin`
- **Quote:** 108_1t4635s0.bin 977277 md5=bcfd658e79 -> android twin: 99_MCSCharacter_HumanAnimationData.bin · 103_1t4630s0.bin 135328 md5=6852a591ab -> android twin: 94_MCSCharacter_Human2AnimationData.bin · 114_1t4641s0.bin 90473 md5=7bb9f40339 -> android twin: None · exact md5 matches: 21 of 27
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim ⑤ closes at the TARGET build, not merely at v0.682; enemies-ai gains an unlisted enemy (spider) that no ledger system mentions; and the lane gets a hard parity map saying which animation assets may be ported from android and which may not.

### `NF-E/survival-mode-content-diverges-14-of-87-rows` — HELD [A2] ⚑ OVERTURNS LEDGER

Survival-mode authored content is NOT the same in the two builds. Web bindata/119_1t4646s0.bin is 11,721 bytes against android 109_WarHexUI_SurvivalModeData.bin's 11,553. Both hold 39 <wave> and 87 <enemy> rows with the same spawn-x histogram {-50: 49, 1650: 37, -1650: 1}, but 14 of the 87 enemy rows differ: web rows 73-76 read id '449|454|449|454|443' where android reads '449|454', rows 77-80 read '450|455|450|455|443' vs '450|455', and rows 81-84 read '451|456|451|456|443' vs '451|456'. The web build adds enemy 443 to three late-wave alternation pools. The unique-id sets are unequal in both directions. Survival mode IS in the target build and can be specified from it - but from the WEB blob, not the android one.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both parsed; all 87 <enemy> rows diffed pairwise)`
- **Quote:** web `<enemy><id>449|454|449|454|443</id><qty>3</qty><x>-50</x></enemy>` vs android `<enemy><id>449|454</id><qty>3</qty><x>-50</x></enemy>`; sizes 11,721 B vs 11,553 B; differing enemy rows 14/87
- **Overturns:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: the S0-1 gap can be closed from the TARGET build, and NF-8-survival-mode-is-byte-identical-in-both-builds must not be absorbed as filed - its identity claim is false and would smuggle mobile wave content into a v0.717 target.

### `NF-F/audio-recovered-13-waveforms-against-43-web-cue-names` — HELD [A2] ⚑ OVERTURNS LEDGER

The SFX side of the audio blocker is closed on both halves, with a precise residual. The DECRYPT is not a whole-file XOR — ResourceManager.decryptByteArray touches only bytes 3..255, swapping ba[i] with ba[i+256] when i%11==0 and then XORing with charCodeAt(1) of the resource name, which is why the raw blob already reads 'CWS' and a naive XOR fails. For Mobile_SoundResource the key is 'o' = 111; the result is a valid CWS v17 SWF (filelen 29,631, inflate 29,623) carrying 13 DefineSound tags and a SymbolClass table naming every one: punch, fart, hitmetal, goodkoto, slash1, slash2, die1, refund, die3, slash3, sumo, die2, deflect. Separately, the WEB payload's own source names 43 distinct "Snd_*" cues at live call sites. So the residual is exact: 13 waveforms recovered, 43 cue names known, 30 cues with no PCM in blob 122.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin decoded per reference/decompiled/shs3_android/scripts/ResourceManager.as:200-217 and Mobile.as:352 + my grep over reference/decompiled/shs3_payload/scripts/ with call sites at reference/decompiled/shs3_payload/scripts/§1t113s0§.as:472 and :478`
- **Quote:** ResourceManager.as:205 `for(var i:int = 3; i < 256; i++)` :207 `if(i % 11 == 0)` :213 `ba[i] ^= key;` ‖ decoded header b'CWS\x11' ver 17, DefineSound(14) x 13, SymbolClass ['punch','fart','hitmetal','goodkoto','slash1','slash2','die1','refund','die3','slash3','sumo','die2','deflect'] ‖ §1t113s0§.as:472 `§1t88s0§.instance.§1t1516s0§("Snd_smallClick");` :478 `…("Snd_error");`
- **Overturns:** "- **Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel ①: 'every SFX is INFERRED' is false twice over — 13 SFX exist as real PCM and 43 are named with trigger points in web source. The honest remaining gap is 30 named cues without waveforms, not 'all audio'.

### `NF-F/two-animation-blobs-are-md5-identical-web-to-android` — HELD [A3] ⚑ OVERTURNS LEDGER

Two of the animation blobs are byte-identical between builds, which promotes two art-anim findings from v0.682 to the target build. md5(reference/extracted/bindata/108_1t4635s0.bin) == md5(reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin) == bcfd658e79fafb41f52431afb7d10622 (977,277 bytes each) - so the 158 human anims, including deathnohand/deathnohead/deathinhalf, ship in web v0.717. md5(reference/extracted/bindata/103_1t4630s0.bin) == md5(reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin) == 6852a591ab2d5895090b3d37ccec9ba2 (135,328 bytes each) - so the 8-frame flinch and flinch_weapon clips ship in web v0.717. Note this is NOT the circular diff C2 forbids: bindata/ is extracted from the WEB payload, not from the android blobs.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin vs reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin; reference/extracted/bindata/103_1t4630s0.bin vs reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin`
- **Quote:** $ md5 -q reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin reference/extracted/bindata/108_1t4635s0.bin -> bcfd658e79fafb41f52431afb7d10622 / bcfd658e79fafb41f52431afb7d10622 ; $ md5 -q reference/extracted/bindata/103_1t4630s0.bin reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin -> 6852a591ab2d5895090b3d37ccec9ba2 / 6852a591ab2d5895090b3d37ccec9ba2
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel + enemies-ai: RR:240 (5) and the stagger half of RR:220 (3) close at the TARGET build, not merely at v0.682. Also a reusable method - the bindata/ <-> android/ md5 join is the one legitimate way to discharge the S0-3 parity caveat per asset.

### `NF-G/43-web-sfx-cues-refiled-without-the-dead-s0-5-clause` — HELD [A2] ⚑ OVERTURNS LEDGER

Re-filing the SFX cue inventory stripped of the superseded audio-encryption claim that auto-refuted its parent. The web v0.717 payload's decompiled classes carry exactly 43 distinct "Snd_*" string literals, each at a live call site, so the cue set and its trigger map are HELD from primary web source: Snd_addStat, Snd_back, Snd_birds1/2/3, Snd_bowFire, Snd_bowFireMany, Snd_challenge, Snd_click, Snd_criticalDamage, Snd_deflect, Snd_die1/2/3, Snd_drop, Snd_equip, Snd_error, Snd_fart, Snd_goodKoto, Snd_hitMetal, Snd_jump, Snd_mail, Snd_menu, Snd_menuClose, Snd_mining, Snd_ninja, Snd_notification, Snd_punch, Snd_put, Snd_refund, Snd_rimshot, Snd_sadTrombone, Snd_slash1/2/3, Snd_smallClick, Snd_smokebomb, Snd_sumo, Snd_upgradeSkill, Snd_wrAttack, Snd_wrDeploy, Snd_wrMove, Snd_wrScout. Trigger example verified: §1t113s0§.as:472 fires Snd_smallClick on a legal stance switch and :478 fires Snd_error on a refused one; §1t113s0§.as:352 fires Snd_criticalDamage the tick the Focus bar reaches full. Per correction C3 the waveforms are recovered separately, so this is a manifest, not a consolation prize.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (own grep -rhoE '"Snd_[A-Za-z0-9_]+"' | sort -u | wc -l -> 43) + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:472, :478, :352`
- **Quote:** §1t113s0§.as:472 '§1t88s0§.instance.§1t1516s0§("Snd_smallClick");' · :478 '§1t88s0§.instance.§1t1516s0§("Snd_error");' · :352 '§1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");' · count: grep -rhoE '"Snd_[A-Za-z0-9_]+"' over the payload scripts, sort -u, wc -l -> 43
- **Overturns:** "- **Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L6 art-anim-audio-feel: 'every SFX is INFERRED' is false. A 43-cue manifest with real trigger points exists in the target build and can be authored against directly.

### `hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

The offline SharedObject save is not one field, it is the whole player. QueryManagerBase.as:2903 opens SharedObject.getLocal(cookieName + '_' + charname); :2910-2930 is the offlineMode branch and it writes NINETEEN fields, each with a matching StatsManager get*String/parse*String pair: nextAPUpdate, nextDTUpdate, lastUpdate, playerlevel, playerStats, equipment, skillStats, skillSlots, inventory, stash, questItems, intStats, achievementStats, booleanStats, activeQuestList, completedQuestList, playerlocation, taunt, friends. The WEB build carries the same path: §1t1832s0§.as:2797-2800 writes data.equipment and data.playerlevel to the same per-character SharedObject, and the reset function at :2813-2825 enumerates the same field set (playerLevel, equipment, inventory, stash, ...).

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2903-2932 + reference/decompiled/shs3_payload/scripts/§1t1832s0§.as:2797-2800 and :2813-2825`
- **Quote:** QueryManagerBase.as:2916-2926 'sharedObject.data.playerStats = StatsManager.getPlayerStatsString(); sharedObject.data.equipment = StatsManager.getEquipmentString(); sharedObject.data.skillStats = StatsManager.getSkillStatsString(); sharedObject.data.skillSlots = StatsManager.getSkillSlotsString(); sharedObject.data.inventory = StatsManager.getInventoryString(); sharedObject.data.stash = StatsManager.getStashString(); sharedObject.data.questItems = StatsManager.getQuestItemsString(); sharedObject.data.intStats = StatsManager.getIntStatsString(); sharedObject.data.achievementStats = StatsManager
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 persistence. hunter05/offline-sharedobject-save-path-exists named ONE field and hedged 'web parity not checked'; the real artifact is a 19-field schema present in both builds. §6 :351 does not merely bend, it inverts - the schema is already written and does not need designing.

### `hunter-s26a/per-enemy-xp-formula-is-lvl-times-2-plus-20` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-kill XP formula is on disk and nobody claimed it: NPC.setLevel sets this.xp = lvl * 2 + 20, three lines below a quote npcdata/spawn-level-comes-from-the-quest-wave already made. Combined with NPCManager passing the quest-wave <lvl> into setLevel, every combat NPC's XP award is fully determined by its spawn level.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:239-259 (key line :252)`
- **Quote:** NPC.as:252 'this.xp = lvl * 2 + 20;' in context :241 'var factor:Number = lvl / this.level;' :244 'factor *= 0.9;' :247-249 'this.damage *= factor; this.defense *= factor; maxhp *= factor;' :253-258 'if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }'
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L4 economy + L-progression. The 'no XP formula' half of :215 (1) is dead, and :200 (4) 'full XP-income model' gains its kill term. Note the clause survives on coins-per-kill, which this does not touch.

### `hunter-s26a/web-kanji-dan-display-path` — HELD [A2] ⚑ OVERTURNS LEDGER

The kanji dan-rank display path is in the WEB build and clamps at ten, proving what hunter/ten-kanji-dan-ranks-in-string-table only asserted ('the inventory/panel path prints kanji'). §1t5957s0§.as:3067-3102 sets danfield.text from getString(456) through getString(464), with the dan>=9 and default cases BOTH resolving to 464 = 十段.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3067-3102 + docs/gauntlet/L0/index/strings.json["456"]-["464"]`
- **Quote:** §1t5957s0§.as:3067 'this.danfield.text = §1t1521s0§.getString(456);' … :3098 'this.danfield.text = §1t1521s0§.getString(464);' :3102 'this.danfield.text = §1t1521s0§.getString(464);' · strings.json["464"] = '(十段)'
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th)"
- **Lane impact:** ui-hud + rebirth-elements. A THIRD independent artifact for a ten-rung ladder, and the first one that is web-side and consumes the kanji table. MAX_DAN_RANK=10 is CONTRACT from three artifacts, not one garbled wiki line.

### `hunter-s26a/web-sound-resource-decrypts-to-13-mp3-sfx` — HELD [A2] ⚑ OVERTURNS LEDGER

The audio is not merely 'named' - 13 SFX waveforms are RECOVERED. reference/extracted/android/122_Mobile_SoundResource.bin decrypts by the game's own routine (ResourceManager.as:200-217 decryptByteArray: XOR bytes 3..255 with key, swapping ba[i]<->ba[i+256] where i%11==0; key = 'soundresource.swf'.charCodeAt(1) = 111 per ResourceManager.as:41) into a CWS v17 SWF of 29,631 bytes that inflates to 29,623 bytes containing 13 DefineSound tags - every one format 2 (MP3), rate 1 (11 kHz), 16-bit, mono - plus a SymbolClass table naming all 13: deflect, die2, sumo, slash3, die3, refund, die1, slash2, slash1, goodkoto, hitmetal, fart, punch. Sample counts: 8700, 7264, 31928, 2976, 9545, 8033, 5290, 6130, 3809, 17331, 5717, 4608, 3456.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin (my own decrypt + inflate + SWF tag walk) + reference/decompiled/shs3_android/scripts/ResourceManager.as:41 and :200-217`
- **Quote:** ResourceManager.as:200 'internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray' · :205-213 'for(var i:int = 3; i < 256; i++) { if(i % 11 == 0) { temp = int(ba[i]); ba[i] = ba[i + 256]; ba[i + 256] = temp; } ba[i] ^= key; }' · :41 'internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];' · decrypted header 43 57 53 11 bf 73 00 00 = CWS v17, 29,631 B
- **Overturns:** "Exact original SFX & music synthesis params — the *character* is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L7 audio + §6. Nobody in this packet aimed at REBUILD_READINESS.md:348, and it is the sentence that actually falls: the exact waveforms ARE recoverable for 13 named SFX. :240's 'every SFX param is INFERRED' falls with it. This also independently re-verifies brief correction C3 first-hand rather than on trust.

### `hunter-s26a/web-stance-ceilings-are-mastery-10-not-9` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The web mastery coefficients hit the ledger's 0.9 / 1.2 / 1.4 stance table EXACTLY at mastery 10, not mastery 9. §1t99s0§.as:3262 gives LIGHT = base * (0.5 + 0.4*lightMastery*0.1) and :3265 BALANCED = base * (1 + 0.2*balancedMastery*0.1); at mastery 10 those are 0.90 and 1.20 exactly, with HEAVY fixed at 1.4 (:3270). At mastery 9 they are 0.86 and 1.18. REBUILD_READINESS.md:155 labels 0.9/1.2/1.4 'MASTERY-9 CEILING values'; for the web build the exact-fit ceiling is mastery 10. The same *0.1 scale appears in the reach switch (:3105, :3116), so the correction propagates to reach as well.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262, :3265, :3270, :3105, :3116 + docs/research/REBUILD_READINESS.md:155`
- **Quote:** §1t99s0§.as:3262 '_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);' · :3265 '_loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);' · :3270 '_loc2_ = _loc1_ * 1.4;'
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L-combat-core. PARTIAL, not HELD: the arithmetic is certain but I did not locate the mastery CAP, so 'mastery-9' may still be right about the reachable maximum while being wrong about which mastery reproduces the table. The rewrite should state the coefficient, not the label.

### `meta-social/war-room-frame-carries-rank-moves-and-clan-numbers` — HELD [A1] ⚑ OVERTURNS LEDGER

The same War Room frame the packet cites for the map also carries meta-social numbers nobody has claimed. Reading the full 1024x576 frame: 'ALLEGIANCE: CLAN AKA RYU', 'RANK: RECRUIT (3 MOVES A TURN)', 'MOVES MADE: 0/36', '3 MOVE(S) LEFT', 'CLAN CROPS: 402 (+2 HQ)', 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN', and a 'SHOW CLAN MSG' button. The rank line settles the ledger's own open question at RR:246 in favour of a per-turn cap that the UI states in words - Recruit gets 3 moves a turn - while 36 is a separate cumulative counter, not the cap. The board is also confirmed as a uniform square grid over a vector coastline, at 10 px per territory per WarSelectUI.as:233-234.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (full-frame read at 1024x576 plus crop 20,30-720,420 @2x LANCZOS) + reference/decompiled/shs3_android/scripts/WarSelectUI.as:233-234`
- **Quote:** On screen: 'ALLEGIANCE: CLAN AKA RYU' / 'RANK: RECRUIT (3 MOVES A TURN)' / 'MOVES MADE: 0/36' / '3 MOVE(S) LEFT' / 'CLAN CROPS: 402 (+2 HQ)' / 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN' / 'SHOW CLAN MSG'.
- **Overturns:** ""moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap)"
- **Lane impact:** L11 meta-social: RR:246's reconciliation is contradicted on camera - the UI says 'RECRUIT (3 MOVES A TURN)' in so many words, and 36 is the denominator of a separate MOVES MADE counter. Also closes part of RR:245 (2) War-Room map topology when read with world/map-bitmap-is-held-byte-exact.

### `meta-social/war-room-frame-says-moves-a-turn-not-per-hour` — HELD [A1] ⚑ OVERTURNS LEDGER

The War Room frame nobody mined carries four unclaimed meta-social numbers, and one of them contests the ledger. reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg reads, along its bottom rail: 'ALLEGIANCE: CLAN AKA RYU', 'RANK: RECRUIT (3 MOVES A TURN)', 'MOVES MADE: 0/36', and on the right '3 MOVE(S) LEFT', with 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN' and a 'SHOW CLAN MSG' button; the header reads 'CLAN CROPS: 402 (+2 HQ)'. The shipped UI says A TURN, in the game's own copy, and pairs a per-turn allowance of 3 with a 0/36 running counter - so 36 is a counter denominator sitting beside a 3-per-turn allowance, not evidence that 'moves per turn' means 'per hour'.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (full frame, my own 2x LANCZOS render)`
- **Quote:** On screen: 'RANK: RECRUIT (3 MOVES A TURN)' / 'MOVES MADE: 0/36' / '3 MOVE(S) LEFT'
- **Overturns:** "- **Surface:** War-Room numbers already in config are now primary-confirmed (upgrade citations); "moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap);"
- **Lane impact:** L12 meta-social - RR:247's 'reconciles as per hour' is contradicted by the shipped UI copy; the frame wins and the reconciliation needs redoing.

### `payload/reinforce-has-three-material-tiers-not-two` — HELD [A2] ⚑ OVERTURNS LEDGER

Reinforce-Weapon is flat 5000 coins across three material tiers, not two. InteractUI.as:657-673 reads the equipped weapon's level (with itemID 13022 forced to 59) and branches <30 / <60 / else onto strings 850 / 851 / 852, which read 'Cost: 5000 coins / Materials needed: 1 Silver Ore', '... 1 Titanium Ore' and '... 1 Uncut Diamond'. A weapon with no valid item (itemID 0 or 13000) gets string 849, which carries no cost line at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:649-674 + docs/gauntlet/L0/index/strings.json["849"],["850"],["851"],["852"]`
- **Quote:** InteractUI.as:670-672 `else { this.detailstext.text = LangManager.getString(852); }` · strings.json["852"] = 'Reinforce your currently equipped weapon to make it unbreakable?\nCost: 5000 coins\nMaterials needed: 1 Uncut Diamond'
- **Overturns:** "- **Economy statics:** ... Forge 700c+2 ore, Reinforce 5000c+1 silver ore;"
- **Lane impact:** L7 economy / L6 items-equipment - RR:79-80's 'Reinforce 5000c+1 silver ore' is only the lowest of three tiers, and the tier key is WEAPON level, not node level.

### `progression/mastery-ceiling-is-10-not-9` — HELD [A2] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md:155-157 labels 0.9/1.2/1.4 'MASTERY-9 CEILING values' and offers a decide-and-flag 'the build targets mastery-9'. The ceiling is 10. Each of the three stance-mastery skills declares exactly ten <level> rows: skilldata.xml:4 is <id>1000</id> and its tenth level value is at :74, :83 is <id>1001</id> with its tenth at :153, and skill 1002's tenth is at :232. The achievement copy says it in words: strings.json["8131"] = 'Light Stance Mastery Level 10.', ["8132"] and ["8133"] the same for Balanced and Heavy. Put mastery = 10 into the web formulas (1t99s0.as:3262/:3265) and you get exactly 0.5 + 0.4*10*0.1 = 0.9 and 1 + 0.2*10*0.1 = 1.2, i.e. the ledger's own ceiling numbers. At mastery 9 they would be 0.86 and 1.18.

- **Cite:** `reference/extracted/skilldata.xml:4,:74,:83,:153,:232 + docs/gauntlet/L0/index/strings.json["8131"],["8132"],["8133"] + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262,:3265`
- **Quote:** strings.json["8131"] = 'Light Stance Mastery Level 10.'   ///   §1t99s0§.as:3262  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L5 combat-core + L2 skills-meters: the ledger's numbers are right and its LABEL is off by one. Anywhere the corpus says 'mastery-9', read mastery-10, and the decide-and-flag at RR:157 evaporates.

### `progression/per-stat-caps-are-a-level-formula-and-they-prove-the-build-split` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stat CEILINGS are on disk in both builds as level formulas, and they arithmetically corroborate the per-point tables. WEB v0.717 (§1t5957s0§.as:3341-3346): MAXHP < 10+(level+10)*10, MAXCHI < 10+(level+10)*5, MAXAP < 30+(level+10)*5, ATK/DEF/SPD < 1+(level+10)*3. ANDROID v0.682 (InventoryUI.as:2407-2412): MAXHP < 10+(level+10)*5, MAXCHI < 10+(level+10)*5, MAXAP < 20+(level+10), ATK/DEF/SPD < level+10. Each build's caps are exactly its per-point grant times the point budget, which independently confirms web = 10/5/5/3/3/3 and android = 5/5/1/1/1/1. The web bases 10 / 10 / 30 also match the ledger's recorded start pools HP10 / Chi10 / AP30.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346 + reference/decompiled/shs3_android/scripts/InventoryUI.as:2406-2412`
- **Quote:** §1t5957s0§.as:3343 `var _loc5_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) < 30 + (_loc2_ + 10) * 5;`
- **Overturns:** "- **Surface:** the per-point stat table + `atkPlusWeapon` term are solved but scattered; ... The "271 cap" is gear/rebirth-inclusive ..."
- **Lane impact:** L4 progression - RR:201's '271 cap' surface note can be replaced by an exact per-stat cap formula per build; no arithmetic reconstruction needed.

### `progression/plus1ap-is-androids-manual-panel-not-a-typo` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's '+1AP per stat point' has a specific, citable android source, and it is NOT the auto-allocator the packet blamed. Android v0.682's manual stat panel InventoryUI.as:2429-2434 is `APaddHandle` -> `StatsManager.addMaxAP(1)`, with siblings +5 MAXHP (:2417), +5 MAXCHI (:2424), +1 ATK (:2439), +1 DEF (:2446), +1 SPD (:2453). The android auto-allocator at StatsManager.as:1669-1683 independently reads +5/+5/+1/+1. The web v0.717 twin (§1t5957s0§ binds the identical `this.statsPanel.HPadd` member at :3334) grants 10/5/5/3/3/3. So RR:77 and RR:199's '+10HP/+5Chi/+1AP/+3-stat' is a TWO-BUILD HYBRID: +10HP and +3-stat are web values, +1AP is the android value, and no single build ever shipped that line.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2415-2455 + reference/decompiled/shs3_android/scripts/StatsManager.as:1660-1687 + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3334 and :3390-3445`
- **Quote:** InventoryUI.as:2429-2432 `public function APaddHandle(event:MouseEvent) : void { StatsManager.changeStat(StatsManager.STAT_STATPOINTS,-1); StatsManager.addMaxAP(1);`
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; ..."
- **Lane impact:** L4 progression - gives the '+5AP vs +1AP' correction a build-attributed source instead of a guess, so the ledger line can be rewritten as two labelled rows rather than one contested number.

### `progression/web-per-point-table-is-confirmed-on-camera-L3-to-L4` — HELD [A1] ⚑ OVERTURNS LEDGER

The WEB per-point stat table is confirmed by film, not only by decompile. In reference/videos/zFtCaTO0_1M.mp4 the character screen at -ss 653.0 reads level 3 with HP 20/20, CHI 10/10, AP 30/30, ATK 7, DEF 7, SPD 4 and AVAILABLE STAT POINTS: 0; at -ss 1600 it reads level 4 with HP 20/20, CHI 9/15, AP 15/30, ATK 10, DEF 10, SPD 4 and again 0 points available. The level-up therefore spent exactly three points and bought MAXCHI +5, ATK +3 and DEF +3 - matching the web handlers (§1t5957s0§.as:3406 +5 CHI, :3422 +3 ATK, :3434 +3 DEF) and matching the ledger's '+3 stat points per level'. It also rules android's +5/+1/+1 out on camera. HP 20 against a base of 10 needs a single +10 web point; android's +5 would need two.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 and @ -ss 1600 (crop=iw*0.55:ih*0.35:iw*0.42:ih*0.12, x2 lanczos, my own ffmpeg extraction) + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445`
- **Quote:** On screen at -ss 653.0: badge 3, 'HP 20/20', 'CHI 10/10', 'AP 30/30', ATK 7, DEF 7, SPD 4, 'AVAILABLE STAT POINTS: 0'. At -ss 1600: badge 4, 'HP 20/20', 'CHI 9/15', 'AP 15/30', ATK 10, DEF 10, SPD 4, 'AVAILABLE STAT POINTS: 0'.
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; ..."
- **Lane impact:** L4 progression - promotes CHI +5 and ATK/DEF +3 per point from decompile-only to frame-plus-payload agreement, the same standard the XP-array claim reached.

### `rebirth/reach-dan-10-is-a-shipped-achievement-string` — HELD [A2] ⚑ OVERTURNS LEDGER

Independent corroboration that Dan 10 is a real, reachable rank rather than a garbled wiki reading: the shipped string table carries an achievement description reading exactly 'Reach Dan 10.', alongside 'Reach Dan 2.', 'Reach Dan 3.' and 'Reach Dan 6.'. That is four rank milestones with 10 as the top one, which matches the web rebirth code paying +100 heavenly gold and announcing rank '10' at STAT_DAN == 8 while capping DAN at 9.

- **Cite:** `docs/gauntlet/L0/index/strings.json["8121"],["8122"],["8123"],["8124"] + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2659`
- **Quote:** strings.json["8124"] = 'Reach Dan 10.'   (with ["8121"] 'Reach Dan 2.', ["8122"] 'Reach Dan 3.', ["8123"] 'Reach Dan 6.')
- **Overturns:** "7. **`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled"
- **Lane impact:** rebirth-elements: RR:164-165's demotion to INFERRED is unsupportable - MAX_DAN_RANK=10 is named in the game's own achievement copy AND in the rebirth announcement's literal "10".

### `skills-meters/stance-mastery-ceiling-is-10-not-9` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger calls 0.9 / 1.2 / 1.4 the 'MASTERY-9 CEILING'. The web formula does not reach 0.9 at mastery 9: §1t99s0§.as:3262 is base * (0.5 + 0.4 * lightMastery * 0.1), which gives 0.86 at m=9 and exactly 0.90 at m=10; balanced at :3265 is base * (1 + 0.2 * balancedMastery * 0.1), giving 1.18 at m=9 and exactly 1.20 at m=10. The string table independently names the ceiling: strings.json["8131"], ["8132"] and ["8133"] are the achievements 'Light Stance Mastery Level 10.', 'Balanced Stance Mastery Level 10.' and 'Heavy Stance Mastery Level 10.'

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3261-3266 + docs/gauntlet/L0/index/strings.json["8131"],["8132"],["8133"]`
- **Quote:** §1t99s0§.as:3262 `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);` · strings.json["8131"] = 'Light Stance Mastery Level 10.'
- **Overturns:** "3. **The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L2 skills-meters + L5 combat-core - a one-word ledger fix (9 -> 10) that changes the whole mastery curve's domain.

### `ui-hud/cannot-change-stance-is-the-reload-meter-low-end-readout` — HELD [A2] ⚑ OVERTURNS LEDGER

The single sentence RR:158 rests on - the on-screen 'CANNOT CHANGE STANCE' - is not a lock notice, it is the reload/crit meter's own low-end label, and the web build shows it switching. 1t113s0.as:110-111 builds two htmlText strings: a black one from getString(175) ('Critical Hit') and a GREY (#BBBBBB) one from getString(960). :328-358 computes ratio = (reload-48)/(maxreload-48) clamped at 0, then shows the grey label exactly when ratio == 0, HIDES it while 0 < ratio < 1, and swaps to the black 'Critical Hit' plus Snd_criticalDamage at ratio >= 1. The gate the stance button asks (1t99s0.as:3048-3051) is the same threshold, reload >= 48. String 960 does not exist in the v0.682 table (docs/gauntlet/L0/index/strings.json has no key 960), i.e. it is a v0.717 addition - which is also why the label has never been sourced. So one bar drives three states: below 48 'cannot change stance', above 48 stance switching is legal, at max the crit fires.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111,:326-360 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3043-3051 + docs/gauntlet/L0/index/strings.json["175"] (present) and ["960"] (absent)`
- **Quote:** §1t113s0§.as:110-111  this.§1t5203s0§ = "<font color='#000000'>" + §1t1521s0§.getString(175) + "</font>";  this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";   ///  :328  var _loc3_:Number = (param1 - 48) / (param2 - 48);   ///  :336-342  if(_loc3_ == 0) { ... this.§1t5169s0§.htmlText = this.§1t5204s0§; this.§1t5169s0§.visible = true; }
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L2/L5/L8: this is the artifact that kills RR:158 at its own evidence rather than around it - the label the ledger read as a lock is the gate's 'not yet'. Ship: one meter, threshold 48 for stance, max for crit, grey label below 48, 'Critical Hit' + Snd_criticalDamage at max.

### `ui-hud/nameplate-level-suffix-is-gated-on-level-greater-than-zero-web-only` — HELD [A2] ⚑ OVERTURNS LEDGER

The real web v0.717 nameplate rule, which the packet's nameplate finding states as a colour split. 1t122s0.as (the web EnemyPlayer) has an if/else at every plate write: :92-99, :802-809, :917/:921 and :1418/:1422, all of the form `if(level > 0 && !this.1t4895s0()) { name + " (" + level + ")" } else { name }`. Android v0.682 EnemyPlayer.as:84, :776 and :881 have NO else branch - they always format the level in. Meanwhile the RED overworld aggro plate carries the same lvl==0 split in BOTH builds (1t8638s0.as:79-86 / Obj_NPCAggro.as:74-81). So the rule is 'append (N) iff level > 0', not 'red carries it, white does not', and the change is a v0.717 addition on the duelist/boss path only. 1t4895s0 (:1763-1766) is a spectator-mode predicate, not a level predicate.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:82-99,:794-809,:915-921,:1413-1422,:1763-1771 + reference/decompiled/shs3_android/scripts/EnemyPlayer.as:78-90,:766-777,:879-882 + reference/decompiled/shs3_payload/scripts/§1t8638s0§.as:79-86 + reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:73-81`
- **Quote:** §1t122s0§.as:92-99  if(param1 > 0 && !this.§1t4895s0§()) { mcs.§1t6287s0§(this.charname + " (" + param1 + ")",_loc6_); } else { mcs.§1t6287s0§(this.charname,_loc6_); }
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: RR:219's blanket rule is wrong, but so is the colour-based replacement in the packet. Code it as `suffix = level > 0 ? " (" + level + ")" : ""` and it matches both the FUKUSHIMA CHIKO frame and every red BANDIT (4) plate in the same corpus.

### `ui-hud/the-cannot-change-stance-label-is-the-focus-gate-readout` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The film evidence the ledger's hard-lock sentence rests on is reconcilable with the live stance switch, and the reconciliation is in the web BattleUI. §1t113s0§.as:326-343 draws the reload/crit bar as (reload - 48) / (maxreload - 48) - the bar only begins to fill ABOVE 48, the exact stance-switch threshold - and drives one text field off that value: at bar == 0 it shows §1t5204s0§, a GREY (#BBBBBB) label built at :111 from getString(960); between 0 and 1 the label is hidden; at bar >= 1 it swaps to §1t5203s0§ = getString(175) = 'Critical Hit' and fires Snd_criticalDamage. String 960 is used at exactly one site in the whole web payload and does NOT exist in the android v0.682 table, so it is a web-only string I cannot resolve to text - but its slot is precisely where a 'CANNOT CHANGE STANCE' readout would live, and the label is BAR-STATE driven, not battle-state driven. That is a Focus-insufficiency indicator, not a hard lock.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111 and :326-361 + docs/gauntlet/L0/index/strings.json["175"] + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051`
- **Quote:** §1t113s0§.as:328 `var _loc3_:Number = (param1 - 48) / (param2 - 48);` · :111 `this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";` · :336-342 shows §1t5204s0§ when _loc3_ == 0
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")."
- **Lane impact:** L8 ui-hud + L5 combat - removes the last defence of RR:158. PARTIAL because string 960's text is web-only and unresolved; resolving it would close the sentence outright.

### `world-exploration/farm-yield-and-whiff-are-on-disk-too` — HELD [A2] ⚑ OVERTURNS LEDGER

The farm yield and whiff rows the packet's farming finding says still need a read-out are in the same file, 150 lines below the timers. InteractUI_crops.as:607 is the whiff gate: `if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - StatsManager.getStat(1020))) == 0)` - stat 1020 is the Farming skill (skilldata id 1020 = 'Farming'), so the proc chance is 1/(10 - farmingLevel), and the very first harvest on a patch is a guaranteed drop. :609-610 then rolls `dice = Math.random() * getPatchLevel(harvestedTimes)`, i.e. the six-rank patch ladder IS the yield table's index, and :611-646 map dice 0..5 onto items 2115 / 2116 / 2117 / 2118 / 2140 / 2141, each also bumping a counter stat (30008-30011) and achievement 60002. Also: gracePeriod is a flat 900 s (:55), and the 12-hour crop (case 4, :160-169) has no rot branch at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:55,:160-170,:455-482,:598-648 + reference/extracted/skilldata.xml (skill id 1020 = 'Farming' via docs/gauntlet/L0/index/strings.json)`
- **Quote:** InteractUI_crops.as:607  if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - StatsManager.getStat(1020))) == 0)   ///  :609-610  patchlevel = this.getPatchLevel(StatsManager.getStat(this.startingIndex + 2));  dice = Math.random() * patchlevel;   ///  :613  OverworldHUD.instance.lootDialog.addLootItemBasic(2115,1);
- **Overturns:** "(2) gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L10 world-exploration + L7 economy: with the packet's mining finding (yield/gates), the ore-respawn finding (respawn) and this (farm yield + whiff), RR:225 blocker (2) is closed end to end and needs no measurement pass. The Farming skill level feeds the whiff denominator directly, so farming.ts needs the skill level as an input.

### `world/war-map-renders-at-10px-per-territory` — HELD [A2] ⚑ OVERTURNS LEDGER

The rendering constant that turns the 63x72 land mask into the board seen on film. WarSelectUI.as:233-234 places a war flag at `(terrx + TERRSHIFTX) * 10 + 4.5` , `(terry + TERRSHIFTY) * 10 + 8.8`, and :253-254 places the player marker at the same *10 pitch with +5 / +8.5 offsets. So one territory is a 10 x 10 px cell and the whole 63 x 72 mask draws as a 630 x 720 board - which is why the on-film War Room shows a uniform square grid ruled over a vector coastline. Together with the 735-pixel mask and the 21/51/8 shifts this is a complete, buildable specification of the board.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarSelectUI.as:15,:17,:19,:233-234,:253-254 + reference/extracted/bindata/92_1t4648s0.bin (63x72 GIF, 735 land pixels, md5 13068dfa1a5cc5628720a25782f93fed)`
- **Quote:** WarSelectUI.as:233-234  warFlag.x = (terrx + TERRSHIFTX) * 10 + 4.5;  warFlag.y = (terry + TERRSHIFTY) * 10 + 8.8;
- **Overturns:** "(1) **world bounds + geography** (sparse Japan-outline, not a WxH grid) - *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L10 world-exploration: with the mask, the shifts and this 10 px pitch, the board can be rendered pixel-for-pixel without touching Fandom or tracing anything.

### `NF-C/focus-fills-plus-one-per-tick-plus-six-per-kill` — HELD [A2]

The Focus meter fills +1 per tick, not +6. In android the per-tick fill is 'if(this.reload < this.maxreload) { ++this.reload; }' (MCSPlayer.as:1158-1160) and the web twin is identical (§1t99s0§.as:1203-1205). The +6 lives in bonusReload() (MCSPlayer.as:3265-3272; web twin §1t99s0§.as:3318-3325), whose only call site in the entire android bundle is NPCManager.as:1709-1711 'if(deathCount > 0) { StatsManager.getPlayer().bonusReload(); }' - i.e. a bonus granted once per batch of enemy deaths, not a tick rate. A full census of every write to reload in MCSPlayer.as (:240, :1160, :3100, :3108, :3244, :3261, :3267) shows no other fill path. Combined with NF-B's maxreload, the web bar takes 192 ticks (8 s at 24 fps) to fill from empty with no kills.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1158-1160, :3265-3272 + NPCManager.as:1709-1711 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1203-1205, :3318-3325`
- **Quote:** MCSPlayer.as:1158 'if(this.reload < this.maxreload)' :1160 '++this.reload;' · :3267 'this.reload += 6;' · NPCManager.as:1709 'if(deathCount > 0)' :1711 'StatsManager.getPlayer().bonusReload();' · web twin §1t99s0§.as:1203 'if(this.§1t4414s0§ < this.§1t4415s0§)' :1205 '++this.§1t4414s0§;' :3320 'this.§1t4414s0§ += 6;'
- **Overturns:** "(no ledger sentence yet - this corrects combat-core/focus-crit-gating-rule-is-held before it enters)"
- **Lane impact:** L5: prevents a 6x-too-fast Focus fill from being written into the Sim, and identifies the kill-bonus as a distinct reward mechanic.

### `NF-D/survival-mode-is-in-the-web-build-but-its-last-seven-waves-differ` — HELD [A2]

Survival mode — the game mode S0-1 flags as absent from all 12 ledger systems — IS in the web v0.717 payload with its authored content: 39 <wave>, 87 <enemy>, spawn-x histogram {-50: 49, 1650: 37, -1650: 1}. It is NOT byte-identical to the android blob (11,721 B vs 11,553 B, different md5) and waves 33-39 are differently authored: android spawns '449|454' / '450|455' / '451|456' where the web build spawns '449|454|449|454|443' / '450|455|450|455|443' / '451|456|451|456|443', adding enemy id 443 to every late pool and reweighting the base pair from 1/2 to 2/5 each. Waves 1-32 are identical. The spawn x values sit just off both edges of XMLBG's contentWidth = 1600.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both parsed and diffed wave-by-wave) + reference/decompiled/shs3_android_payload/scripts/XMLBG.as:14`
- **Quote:** web wave 33 `<id>449|454|449|454|443</id><qty>3</qty><x>-50</x>` ‖ android wave 33 `<id>449|454</id><qty>3</qty><x>-50</x>` ‖ XMLBG.as:14 `internal var contentWidth:int = 1600;`
- **Overturns:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: the mode can be specified from the TARGET build's own wave table — and anyone who ports the android blob ships the wrong late-game enemy mix.

### `NF-G/web-side-cite-for-800x480-and-a-second-800x690-layout` — HELD [A2]

The 800x480 native resolution has a WEB-side cite, so it no longer rests on an android file: §1t1540s0§.as:271-273 declares baseW 800, baseH 480 and an ALTERNATE height of 690, and :277-289 selects the 690 layout whenever the viewport is narrower than 800/690. The fit at :294-307 is a single UNIFORM scale with centring — scale = stageWidth/800 with letterbox when the viewport is narrower than 5:3, scale = stageHeight/480 with pillarbox when wider — and :388 hides the four blocker bars when the stage is exactly 800x480 or 800x690. Consequence for film measurement: the shipped renderer never stretches, so horizontal and vertical scales in a longplay frame are equal by construction, and the 1816-vs-1800 px gap in video A is a recording/re-encode artifact, not a game-side anisotropy.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273, :274-289, :294-307, :388`
- **Quote:** :271 `var _loc2_:int = 800;` :272 `var _loc3_:int = 480;` :273 `var _loc4_:int = 690;` · :297 `_loc8_ = §1t9973s0§.stageWidth / _loc2_;` :304 `_loc8_ = §1t9973s0§.stageHeight / _loc3_;` :305 `_loc9_ = (§1t9973s0§.stageWidth - _loc2_ * _loc8_) / 2;` · :388 `… || §1t9973s0§.stageWidth == 800 && (§1t9973s0§.stageHeight == 480 || §1t9973s0§.stageHeight == 690)`
- **Overturns:** "12. **Native resolution is 800×480 (5:3)**, not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** UI-HUD ① ('aspect-ratio truth — read stage.stageWidth in a build') closes from source with no build needed; ledger item 12 is CONFIRMED, not overturned, and gains a second supported layout (800x690) it never mentions.

### `NF-I/def-subtraction-is-floored-by-the-attackers-min-damage` — HELD [A2]

Every DEF subtraction in both builds is immediately floored by the ATTACKER's minimum damage, so defence can never reduce a hit below that floor — a term the 'DEF is flat subtraction' statement omits. All three web damage paths do `_loc5_ -= getDefense();` then `if(_loc5_ < param2.getMinDamage()) { _loc5_ = param2.getMinDamage(); }`, and android does the same at MCSPlayer.as:3709-3713. A Sim that subtracts DEF without the floor will produce zero-damage hits the original never produces.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484-3488, :3800-3804, :4391-4395 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3709-3713`
- **Quote:** web §1t99s0§.as:3800 `_loc5_ -= this.§1t4477s0§();` :3801 `if(_loc5_ < param2.§1t1088s0§())` :3803 `_loc5_ = param2.§1t1088s0§();` ‖ android MCSPlayer.as:3709 `damage -= this.getDefense();` :3710 `if(damage < damageObj.getMinDamage())` :3712 `damage = damageObj.getMinDamage();`
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L-progression ① / L1 combat-core: completes the DEF model — flat subtraction, floored at the attacker's minDamage, with the defender-in-Heavy x0.8 as the only conditional.

### `audio/all-43-sfx-names-are-on-one-line-in-the-web-soundmanager` — HELD [A2]

The web build's SoundManager declares the complete 43-name SFX inventory on a single line - no scraping of scattered call sites needed. Thirteen of those names have recovered waveforms via the android 122_Mobile_SoundResource decode (deflect, die1-3, slash1-3, punch, fart, hitmetal, goodkoto, refund, sumo), so the remaining 30 are the honest synth-target list.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t88s0§.as:56 (and :328 for the hitMetal playback path)`
- **Quote:** §1t88s0§.as:56  var _loc1_:Array = ["Snd_punch","Snd_addStat","Snd_birds1","Snd_birds2","Snd_birds3","Snd_bowFire","Snd_bowFireMany","Snd_challenge","Snd_criticalDamage","Snd_drop","Snd_equip","Snd_error","Snd_fart","Snd_hitMetal","Snd_goodKoto","Snd_jump","Snd_slash1","Snd_slash2","Snd_die1","Snd_mail","Snd_menu","Snd_menuClose","Snd_mining","Snd_ninja","Snd_notification","Snd_put","Snd_refund","Snd_rimshot","Snd_sadTrombone","Snd_wrScout","Snd_die3","Snd_slash3","Snd_smallClick","Snd_smokebomb","Snd_sumo","Snd_die2","Snd_upgradeSkill","Snd_wrAttack","Snd_wrDeploy","Snd_back","Snd_click","Snd
- **Lane impact:** L7 audio: gives the art-anim-audio-feel lane a single authoritative cite for the event vocabulary and, joined to correction C3, an exact split between the 13 SFX with recovered audio and the 30 that must still be synthesized.

### `combat-core/max-focus-differs-192-web-vs-120-android` — HELD [A2]

The Focus meter's maximum is not the same in the two builds: 192 in web v0.717, 120 in android v0.682, and each build assigns it exactly once. That reframes the stance-switch numbers - the flat 48 the web build charges is maxreload/4, while android's graded cost is maxreload/6 (=20) with a maxreload/3 reset. So the two builds do not even share the same FRACTION of the bar, and any Focus config for v0.717 must use 192, not 120, and not a fraction ported from android.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:239`
- **Quote:** §1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;   (web maxreload = 192)  ·  MCSPlayer.as:239  this.maxreload = 5 * 24;   (android maxreload = 120)
- **Lane impact:** L-combat-core + L-skills-meters: skills-meters blocker (3) 'Focus numerics (max/fill/switch-cost)' closes on TWO of its three axes for v0.717 - max = 192 and switch-cost = 48 - leaving only the fill rate open. Nobody in this packet claimed the max.

### `hunter-s26a/five-web-animdata-blobs-have-no-android-twin` — PARTIAL [A3]

CORRECTION to parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android. The 21/27 count and its enumerated list are exact, but the character-animation layer is NOT entirely byte-identical: five of the nineteen web animdata blobs have no android byte-twin, and they differ in ANIMATION COUNT, not just bytes. Web 100_1t4627s0.bin (ogre) = 20 <anim> / 184,193 B vs android 91_Ogre = 18 / 184,120 B. Web 102_1t4629s0.bin (skills: shunpo, deathtouch, fireball, spartakick) = 51 / 333,768 B vs android 93_Skills = 51 / 338,096 B. Web 111_1t4638s0.bin = 17 vs android 102_Guardian = 16. Web 113_1t4640s0.bin = 26 / 153,258 B vs android 104_HumanSpear = 23 / 132,270 B. Web 114_1t4641s0.bin (10 anims) has no android counterpart at all. So the parity hedge lifts for the 21 named files and MUST NOT lift for these five.

- **Cite:** `md5 over reference/extracted/bindata/*.bin vs reference/extracted/android/*.bin (my own run: 27 web, 42 android, 21 matches) + my ElementTree child counts on reference/extracted/bindata/100_1t4627s0.bin, 102_1t4629s0.bin, 111_1t4638s0.bin, 113_1t4640s0.bin, 114_1t4641s0.bin and reference/extracted/android/91_MCSCharacter_OgreAnimationData.bin, 93_MCSCharacter_SkillsAnimationData.bin, 102_MCSCharacter_GuardianAnimationData.bin, 104_MCSCharacter_HumanSpearAnimationData.bin`
- **Quote:** unmatched web blobs: 100_1t4627s0.bin, 102_1t4629s0.bin, 111_1t4638s0.bin, 113_1t4640s0.bin, 119_1t4646s0.bin, 114_1t4641s0.bin · web 100 animdata child_count 20 vs android 91_Ogre 18 · web 113 animdata child_count 26 / 153,258 B vs android 104_HumanSpear 23 / 132,270 B
- **Overturns:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** L0 art-anim. The hedge comes off 21 files (incl. flinch, which lives in the matched Human2 blob) and stays on the ogre and skills animation sets — exactly the two most gameplay-load-bearing. Any 'the animation layer needs no build hedge' line in the rewrite would be wrong.

### `hunter-s26a/war-room-battlefield-board-is-server-dimensioned` — STILL_UNHELD [A2]

The half of REBUILD_READINESS.md:245 ② that survives every map finding in this packet: the War-Room BATTLEFIELD board is a separate object from the world map. WarHexUI builds hexArray as a wt x ht array of WarHex from a pipe-delimited server state string, so its dimensions and therefore its adjacency graph do not come from the 63x72 territory mask and are not recoverable from the shipped blobs.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:226-232, :252, :418-428`
- **Quote:** WarHexUI.as:226-230 'this.hexArray = new Array(); for(i = 0; i < this.wt; i++) { this.hexArray.push(new Array(this.ht)); }' :231 'var hexList:Array = str.split("|");' :252 'this.hexArray[xpos][ypos] = hex;'
- **Overturns:** "② War-Room **map topology** (board/adjacency)"
- **Lane impact:** L0 meta-social. Two findings in this packet (world-map-topology-is-a-bitmap-mask, territory-owners-are-open-ended) both claim to kill :245 ② and both miss: one closes the world/territory map (:225 ① and :115), the other addresses ownership. The battlefield board's dimensions stay a blocker. Keep :245 ② open, narrowed to 'battlefield sector board dimensions + adjacency'.

### `hunter-s26a/web-elemental-def-pipeline-confirms-both-builds` — HELD [A2]

The elemental ATK-vs-DEF pipeline is in the WEB player class too, so hunter/elemental-atk-vs-def-formula-held's 'both' label is now proven rather than asserted (it cited only android artifacts).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3391-3394, :3395-3422, :3489`
- **Quote:** §1t99s0§.as:3391-3394 'var _loc7_:int = param2.§1t1062s0§ - §1t1239s0§; var _loc8_:int = param2.§1t1063s0§ - §1t1241s0§; var _loc9_:int = param2.§1t1064s0§ - §1t1240s0§; var _loc10_:int = param2.§1t1065s0§ - §1t1242s0§;' · :3395 'if(param2.§1t1062s0§ > 0 && _loc7_ < 1)' (the 1-floor, repeated at :3403, :3411, :3419) · :3489 '_loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_;' (physical + four element channels summed)
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** L-combat-core / rebirth-elements. Removes the android hedge from the one blocker that closes outright.

### `hunter-s26a/web-twins-of-the-four-elemental-ultimate-projectiles` — HELD [A2]

The four elemental-ultimate projectile constructors exist in the WEB v0.717 payload with the same damage*1.5 in the same element channel, closing the build hole in hunter/all-24-elemental-skills-fully-specced (which labelled itself web v0.717 while citing only android artifacts).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t8341s0§.as:24 + §1t8334s0§.as:27 + §1t8338s0§.as:23 + §1t8343s0§.as:24`
- **Quote:** §1t8341s0§.as:24 '§1t8103s0§ = new §1t67s0§(0,0,§1t67s0§.§1t9117s0§,-1,0,0,param3 * 1.5);' (wind, 7th arg — twin of BigTornadoProjectile.as:24) · §1t8334s0§.as:27 '... §1t9118s0§,-1,0,0,0,param3 * 1.5);' (earth, 8th arg) · §1t8338s0§.as:23 '... §1t9118s0§,-1,param3 * 1.5);' (fire, 5th arg) · §1t8343s0§.as:24 '... §1t9118s0§,-1,0,param3 * 1.5);' (water, 6th arg)
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements. Makes the 150%-of-element-ATK damage of the four ultimates a WEB-build fact, not an android-only one. The <chi>/<cooldown> half stays v0.682 — skilldata.xml is android-sourced and there is no <skilldata> root in any web bindata blob.

### `parity/animation-layer-is-not-byte-parity-five-blobs-differ` — HELD [A3]

The animation-data layer is NOT parity-clean. Fourteen of the nineteen web animdata blobs are byte-identical to an android twin; five are not - ogre, skills, guardian, spear and spider. The skills blob (which holds shunpo, flurry, deathtouch, spartakick, chargedshot) differs by 4.3 KB and the spear blob by 21 KB, so these are content differences, not padding. Any <anim d="N"> duration read from those five android blobs still needs a build hedge; only the fourteen matched blobs earn an unqualified web-build CONTRACT.

- **Cite:** `md5 + byte-size census over reference/extracted/bindata/*.bin vs reference/extracted/android/*.bin, joined to docs/gauntlet/L0/index/bindata.json for the animdata roots and child ids`
- **Quote:** web 100_1t4627s0.bin (animdata, ogre_*) 184,193 B vs android 91_MCSCharacter_OgreAnimationData.bin 184,120 B; web 102_1t4629s0.bin (chargedshot/flurry/deathtouch/shunpo/spartakick, 51 children) 333,768 B vs android 93_MCSCharacter_SkillsAnimationData.bin 338,096 B (delta 4,328); web 111_1t4638s0.bin (guardian_*) 117,638 B vs android 102_MCSCharacter_GuardianAnimationData.bin 117,596 B; web 113_1t4640s0.bin (spear_*) 153,258 B vs android 104_MCSCharacter_HumanSpearAnimationData.bin 132,270 B (delta 20,988)
- **Lane impact:** L0 art-anim: the cheap machine-checkable parity instrument is real and worth keeping, but it must be run PER FILE. A blanket 'the animation layer is parity' licence would silently import android skill-animation timings into v0.717.

### `parity/web-build-ships-a-spider-animation-set-android-lacks` — HELD [A3]

The web v0.717 bindata set contains a 10-animation spider creature set that has no counterpart anywhere in the 42 android blobs. The web build has 19 animdata blobs against android's 18 MCSCharacter_* blobs, and the spider is the extra one. A roster or enemy taxonomy built from the android blobs alone is missing a creature the target build ships.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin (90,473 B) + docs/gauntlet/L0/index/bindata.json; negative check 'grep -rl spider_idle reference/extracted/android/' returns no files, and reference/extracted/android/ carries exactly 18 MCSCharacter_*AnimationData.bin blobs, none named Spider`
- **Quote:** docs/gauntlet/L0/index/bindata.json 114_1t4641s0.bin: root 'animdata', child_count 10, child_ids ['spider_idle','spider_walk','spider_attackstart','spider_attackend', ...]
- **Lane impact:** L8 enemies-ai + L0 art-anim: the enemy taxonomy in REBUILD_READINESS.md:231 ('Humans/Undead/Oni/Animals + Tengu/Guardian') has no spider. Worth a targeted look at npcdata for spider-ai rows before the roster is called complete.

### `parity/writ-of-release-is-25g-in-web-and-5g-in-android` — HELD [A1]

A fourth hard, enumerable v0.682<->v0.717 divergence: the Writ of Release costs 25 gold in the shipped web client and 5 heavenly gold in the android data. The same 5x gap applies to the whole premium scroll tier - Amnesia Scroll (2200), Name Change Scroll (2207) and Clan Deed (2212) are all heavenlyprice 5 in android itemdata while the web shop grid badges its scrolls at 25. This CONFIRMS REBUILD_READINESS.md:216 rather than overturning it, and it is the concrete demonstration that C2's undischarged parity caveat has teeth on ECONOMY numbers, not just UI copy.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg (1024x576; detail-panel crop (330,95)-(1000,230) x3 LANCZOS, grid crop (330,55)-(620,300) x5 LANCZOS) vs reference/extracted/itemdata.xml:2328-2335`
- **Quote:** ON SCREEN in v0.717: BUY detail panel 'WRIT OF RELEASE' / 'OWNED: 0' with a '25' badge beside the gold-coin glyph on its icon; both scroll tiles in the grid also badged '25'. ANDROID DATA: itemdata.xml:2328-2335 '<id>2203</id><type>10</type><name>4156</name><unique>1</unique><baseprice>0</baseprice><heavenlyprice>5</heavenlyprice>'. THE FRAME WINS.
- **Lane impact:** L4/L0 economy + all lanes citing the four XMLs: any price ported from reference/extracted/{itemdata,skilldata,npcdata,questdata}.xml is v0.682-grade and may be off by a whole tuning pass. This is the first measured case where an android XML value would have corrupted a correct web-build CONTRACT.

### `persistence/offline-save-schema-is-fourteen-fields-already-written` — HELD [A2]

Beyond the equipment string the packet's own finding names, the client's offlineMode branch serialises the ENTIRE player record to a local SharedObject keyed by cookieName + '_' + charname: fourteen fields covering timers, level, stats, equipment, skills, skill slots, inventory, stash, quest items, int stats, achievement stats and boolean stats. A matching parse* method exists for each on the read side.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2903, :2910-2925`
- **Quote:** QueryManagerBase.as:2903  var sharedObject:SharedObject = SharedObject.getLocal(StatsManager.cookieName + "_" + StatsManager.charname);  ·  :2912-2925 (offlineMode branch) writes nextAPUpdate, nextDTUpdate, lastUpdate, playerlevel, playerStats, equipment, skillStats, skillSlots, inventory, stash, questItems, intStats, achievementStats, booleanStats
- **Lane impact:** L10 persistence: REBUILD_READINESS.md:351's 'design a single-player persistence schema from the observed field set' is not a design task - the field set and its serializer/parser pair are both shipped. The schema can be transcribed rather than invented.

### `progression/level-3-to-4-on-film-buys-plus3-atk-plus3-def-plus5-chi` — HELD [A1]

An A1 confirmation of the web per-point stat magnitudes that nobody has claimed. In reference/videos/zFtCaTO0_1M.mp4 the player sheet at -ss 653.0 reads level badge 3, ATK 7, DEF 7 (+2), SPD 4, HP 20/20, CHI 10/10, AP 30/30, AVAILABLE STAT POINTS: 0. At -ss 1600 the same sheet reads level badge 4, ATK 10, DEF 10 (+13), SPD 4, HP 20/20, CHI 9/15, AP 15/30, AVAILABLE STAT POINTS: 0. Between them the player gained exactly one level and spent all three of that level's stat points: ATK +3, DEF +3, CHI max +5, AP max unchanged. Those are precisely the web handler magnitudes (1t5957s0.as:3422 ATK+3, :3434 DEF+3, :3406 MAXCHI+5) and they are NOT the android manual-panel magnitudes (InventoryUI.as:2439/:2446 +1, :2424 +5). It also confirms '+3 stat points per level' directly.

- **Cite:** `my own ffmpeg single-frame extractions from reference/videos/zFtCaTO0_1M.mp4 at -ss 653.0 and -ss 1600 (1920x1080, read at 960x540 LANCZOS) + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3402-3445`
- **Quote:** On screen at -ss 653.0: badge 3, 'ATK 7', 'DEF 7 +2', 'SPD 4', 'CHI 10 / 10', 'AP 30 / 30', 'AVAILABLE STAT POINTS: 0'. At -ss 1600: badge 4, 'ATK 10', 'DEF 10 +13', 'SPD 4', 'CHI 9 / 15', 'AP 15 / 30', 'AVAILABLE STAT POINTS: 0'.
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point"
- **Lane impact:** L4 progression: promotes the web per-point table from decompile-only to frame-plus-payload agreement for ATK/DEF/CHI. AP is still decompile-only, because the filmed player never spent a point on it - which is exactly why the ledger's +1AP survived this long.

### `ui-hud/800x690-is-the-embed-stage-800x480-is-the-viewport` — HELD [A2]

The 800x690 vs 800x480 conflict resolves cleanly and neither number is wrong. BOTH the outer loader the browser embeds (reference/preservation/shs3.swf) and the decoded payload (reference/decrypted/shs3_payload_decoded.swf) declare an identical stage RECT of 800.0 x 690.0 at 24.000 fps - I parsed both headers. The GAME VIEWPORT is 800 x 480: the full-screen hurt vignette art inside the payload measures exactly 800x480, the BattleUI's skill-slot row sits at y=450, and the filmed content region is 1816 x 1080 = 1.681 aspect = 5:3. So 690 is the embed/authoring stage that carries chrome outside the play area, and RR:117 / RR:171's 800x480 native canvas stands as the viewport.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/preservation/shs3.swf (my own zlib+RECT header parses) + reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1.png + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171`
- **Quote:** shs3.swf header: CWS v17, RECT 0,16000,0,13800 twips = 800.0 x 690.0, frameRate 0x1800 = 24.0, frameCount 2. shs3_payload_decoded.swf header: CWS v17, same RECT, 24.0 fps, 6 frames. §1t113s0§.as:170-171 `_loc1_.x = 760 - _loc2_ * 60; _loc1_.y = 450;`
- **Lane impact:** L8 ui-hud - settles the 800x690 challenge without discarding the 800x480 canvas; both go in the ledger with their scopes named.

### `ui-hud/web-resize-handler-names-800x480-and-690-is-the-friend-bar-variant` — HELD [A2]

The WEB v0.717 build carries the whole stage-fit model on disk, and it names all three numbers the ui-hud lane has been arguing about. 1t1540s0.as:271-273 declares originalWidth 800, originalHeight 480, originalHeightWithBar 690 - so the 690 in the payload SWF header is the FRIEND-BAR stage variant, taken only when the browser viewport aspect is <= 800/690 = 1.1594 (:277), and the game canvas is 800 x 480. :295-307 then picks fit-width (offsetX 0, letterbars) or fit-height (offsetX = (stageWidth - 800*scale)/2, pillarbars) and writes scale/offsetX/offsetY/fitWidth into 1t1523s0.1t9358s0/9359/9360/9361, which 1t113s0.as:375 consumes to convert mouse coords into game space. This CONFIRMS REBUILD_READINESS.md:117 and :171 from a web artifact, kills the 800x690 overturn, and supplies the mechanism the aspect-ratio blocker asked for. The only thing still per-video is the BRANCH, since the viewport aspect is not recorded anywhere.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:269-314 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:375 + reference/decompiled/shs3_android/scripts/GameEngine.as:267-312`
- **Quote:** §1t1540s0§.as:271-273  var _loc2_:int = 800;  var _loc3_:int = 480;  var _loc4_:int = 690;   ///  :304-306  _loc8_ = §1t9973s0§.stageHeight / _loc3_;  _loc9_ = (§1t9973s0§.stageWidth - _loc2_ * _loc8_) / 2;  _loc10_ = 0;
- **Overturns:** "**Aspect-ratio truth** - native canvas is **800x480 (5:3)**"
- **Lane impact:** L8 ui-hud: RR:117/:171/:235-(1) are VINDICATED, not overturned, and the close-path 'read stage.stageWidth in a build' is discharged from source. The per-video calibration finding 9 prescribes is still needed because the branch depends on the viewport.

### `world-exploration/depleted-ore-is-redrawn-not-suppressed` — HELD [A2]

The room-object dead list does not delete ore deposits, it re-creates them depleted. GameStage.as:633 exempts six object ids from suppression, and ore is one of them: GameStage.as:792-793 is `case 30: obj = new Obj_OreDeposit(objProperty,objName);`, and :647-650 re-creates a dead id-30 object with ',1' appended to its property string. Obj_OreDeposit.as:19-24 reads that flag and does gotoAndStop(1) with canInteract=false and buttonMode=false. So the mined-out rock is still drawn, in its spent frame, and simply cannot be interacted with. Ids 18, 19, 22 and 58 get the same ',1' treatment and id 33 (lever) gets property[1]='2'.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameStage.as:633-670 and :792-794 + reference/decompiled/shs3_android/scripts/Obj_OreDeposit.as:18-24`
- **Quote:** GameStage.as:647-650 `else if(skipFlag && xml.id == 30) { this.createRoomObject(xml.id,xml.x,ypos,xml.property + ",1",xml.name); }` · Obj_OreDeposit.as:19-23 `if(strArray.length > 1 && strArray[1] == "1") { gotoAndStop(1); canInteract = false;`
- **Lane impact:** L10 world-exploration - a recreation coded from 'suppress objects in the dead list' would render a missing rock instead of a spent one.

### `world-exploration/the-twelve-hour-crop-never-rots` — HELD [A2]

Three of the four crop tiers can rot; the fourth cannot. InteractUI_crops.as:55 declares `internal var gracePeriod:int = 900;` (15 minutes). The 15-minute (:116-128), 1-hour (:131-143) and 6-hour (:146-158) crops each run PLANTED / READYFORHARVEST-within-grace / ROTTED. The 12-hour crop at :161-169 has only PLANTED else READYFORHARVEST - no grace term and no ROTTED arm at all. A recreation that applies a uniform 900-second spoil window to all four crops is wrong on the highest tier.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:55 and :110-170`
- **Quote:** InteractUI_crops.as:161-169 `case 4: this.timePeriod = 12 * 60 * 60; if(QueryManager.instance.getServerTime() - this.plantTime < this.timePeriod) { this.vegState = this.PLANTED; } else { this.vegState = this.READYFORHARVEST; }`
- **Lane impact:** L10 world-exploration - corrects the farm-timer finding in this same packet before it reaches config.
