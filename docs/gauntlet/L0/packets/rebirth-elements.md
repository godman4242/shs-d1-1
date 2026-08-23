# LEDGER PACKET — `rebirth-elements`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**32 surviving overturns · 4 true-but-rejected · 33 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **rebirth-elements** | 30 | rebirth trigger (scroll/L80/+25g), 4 elements × 6-skill names | what each element DOES; per-skill values; Dan-rank count; Dragon Dance input |
### rebirth-elements — 30
- **Ready:** rebirth trigger (1000c scroll, L80, +25g, "next Dan rank + specialize in an element"); 4 elements × 6 named skills; Undead/Red-Oni damage floor; carry-items-reset-level.
- **Blockers:** ① what each element **does** (24 skills' damage/cost/AoE/status — names only). ② elemental ATK-vs-DEF **formula**. ③ Dan-rank count/titles (garbled source). ④ Dragon Dance **input** + Kanji-statue bonus. ⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth).
- **Surface:** elements are TWO systems (rebirth skills **and** gear ATK/DEF typing) — the gear side is measured (A-17) but never linked to the rebirth domain. Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-9-dragon-dance-input-recovered]]` — UPHELD [A2] (2 critics)

The Dragon Dance INPUT is fully held in a 650-line UI class nobody in this packet opened. DragonDanceUI builds an eight-node ring (node0..node7) labelled with the eight trigrams in two arrangements — Earlier Heaven ['sky','wind','water','mountain','earth','thunder','fire','lake'] and Later Heaven ['fire','earth','lake','sky','water','mountain','thunder','wind']. The player's input is a DIGIT STRING of clicked node indices. Earlier Heaven completes on a 4-length sequence containing nodes 1, 2, 4 and 6, which promotes the ring to Later Heaven. Validation is a string equality against the target object's sequence. The Kanji statue is Obj_DragonDanceStatue, whose Later-Heaven target sequence is drawn from five fixed permutations by a node-seeded deterministic RNG.

- **Cite:** `reference/decompiled/shs3_android/scripts/DragonDanceUI.as:68, :70, :71, :355, :367, :447; Obj_DragonDanceStatue.as:38-64`
- **Build:** android v0.682
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** L11 meta+rebirth blocker ④ largely CLOSED. Supporting objects also recovered: Obj_DragonDancePath.as, Obj_DragonDanceLoot.as, DragonDanceInteractiveStageObject.as, Obj_HiddenTemple.as and shs3_android_fla/dragondancewords_212.as (the kanji word clip, symbol1534). Each node click also plays a POSE animation on the player character (MCSActor.POSE4 etc.) gated on canChangeStance(), so the dance is physically performed — an L6 art-anim requirement nobody has recorded. Refutes skilldata/input-field-empty's conclusion that blocker ④'s most likely home was eliminated.

### `[[bindata/51-skill-animations]]` — UPHELD [A2] (2 critics)

bindata/102 is the skills animation set: 51 authored skill animations including shunpo_start/end, focus_start/end, cleave, chicharge, warcry, buffarmor, enchantweapon, fireball and deathtouch — so 'names only' is wrong, though no damage/cost/AoE value lives here.

- **Cite:** `reference/extracted/bindata/102_1t4629s0.bin:938,2038,4242,4328,4351,4521,4840,5978,6148,6333,9204,9556 — Android class name 93_MCSCharacter_SkillsAnimationData.bin`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L-skills-meters + L-rebirth-elements: 'names only' is false — the MOTION of 51 skills is held. Shunpo specifically is a 4-tick start plus a single arrival pose with NO travel clip, i.e. the signature of an instantaneous displacement rather than a dash, which bears on skills-meters blocker ② ('Shunpo's real effect'). I explicitly do NOT claim Shunpo's numbers: bindata carries no damage, cost, AoE or status value — those are in skilldata.xml.

### `[[frames/HUNT-rebirth-picker-recoverable-from-strings]]` — UPHELD [A2] (4 critics)

The rebirth/element picker is unfilmable (see the level-80 gate) but its CONTENT is A2-recoverable: the picker's own prompt string, a closed four-element set, a hard level gate and the full effect list. Ledger blocker (5) 'rebirth/element-picker UI (never filmed)' is mostly closable without a picture.

- **Cite:** `strings.json["611"], ["4155"], ["610"], ["6030"]-["6033"], ["507"]-["510"], ["6058"]-["6061"], ["4154"], ["864"]`
- **Build:** android v0.682
- **KILLS this line:** "(5) rebirth/element-picker UI (never filmed - both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: prompt, four-element enum, level-80 gate and effect list all become buildable; only the picker's visual layout stays unheld

### `[[hunter/all-24-elemental-skills-fully-specced]]` — UPHELD [A2] (2 critics)

Rebirth-elements blocker ① is not 'names only' by any reading: skilldata.xml carries a full level row for every one of the 24 element-gated skills, with <chi>, <cooldown> and a string-table description that states the damage scaling. The four ultimates are chi 50 / cooldown 60 with descriptions reading 'Area of Effect Fire Attack — Fire Damage: 150% Fire ATK', and the projectile classes construct exactly that (damage*1.5 in the element channel, physical damage 0).

- **Cite:** `reference/extracted/skilldata.xml (ElementTree parse of skills 1013, 1025-1035, 1056-1063, 1070-1073, joined to docs/gauntlet/L0/index/strings.json) + reference/decompiled/shs3_android_payload/scripts/BigTornadoProjectile.as:24, BigEarthquakeProjectile.as:27, BigFireBreathProjectile.as:23, BigWaveProjectile.as:24`
- **Build:** web v0.717
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① closes on all four of its named axes at once — damage (150% of the element stat, verified in the projectile constructors), cost (chi + 1 kunai ammo where applicable), AoE (the four ultimates are the AoE tier) and status (none — see the packet's two no-status findings). The ledger's staleness banner concedes the equivalent point for skills-meters at :31 but never propagated it to :205.

### `[[hunter/dragon-dance-input-rule-held]]` — UPHELD [A2] (2 critics)

The Dragon Dance INPUT rule is held in the target build, which is the half of rebirth-elements blocker ④ the packet's art finding does not reach. In Earlier Heaven the sequence completes when the player has made exactly four clicks and those four are nodes 1, 2, 4 and 6 — wind, water, earth and fire in the Earlier-Heaven node array — at which point the wheel flips to Later Heaven and the second node array becomes active.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:382 (web v0.717, symbol1810) and :70-71; deobfuscated twin at reference/decompiled/shs3_android/scripts/DragonDanceUI.as:367 and :369`
- **Build:** both
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ loses its INPUT half, in the WEB build with no android-parity caveat. Only the Kanji-statue bonus remains open. This also explains the packet's 100-point budget finding: the four nodes the flip demands map to all four elements, which one player's 100-point budget cannot buy.

### `[[hunter/elemental-atk-vs-def-formula-held]]` — UPHELD [A2] (2 critics)

The elemental ATK-vs-DEF formula is fully recovered, and nobody in this packet claimed it. Each element channel is mitigated independently by the matching elemental DEF, floored at 1 whenever the attacker carried any of that element (so an elemental hit always chips at least 1 per channel) and at 0 otherwise; the four channels are then summed with the physical damage into a single HP deduction. The defender's elemental DEF stats are themselves derived from the COUNTER element's ATK stat, which is the code-side form of the element wheel.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3350, :3351-3381 and :3420 + reference/decompiled/shs3_android/scripts/StatsManager.as:1836`
- **Build:** both
- **KILLS this line:** "② elemental ATK-vs-DEF formula."
- **Lane impact:** rebirth-elements blocker ② closes OUTRIGHT — subtractive per-channel mitigation with a 1-point floor, plus the rule that your FIRE stat is what defends you against EARTH. That last line independently reproduces the artwork's clockwise wheel (fire counters earth, earth counters wind, wind counters water, water counters fire) with no measurement doc in between.

### `[[itemdata/dragon-dance-input]]` — UPHELD [A2] (2 critics)

The Dragon Dance input is an item: itemdata row 2211 'Dragon Dance Scroll' carries modifier id 122, and the inventory's use-handler maps modifier 122 straight to OverworldHUD.onShowDragonDanceUI().

- **Cite:** `reference/extracted/itemdata.xml:2430-2443 and reference/decompiled/shs3_android/scripts/InventoryUI.as:1071-1076; reward shape at Obj_DragonDanceLoot.as:328-330`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** L4 rebirth-elements blocker ④ half-closed (the input is a soulbound weightless quest scroll opened from the inventory; what the UI contains is still unheld); L5 items-equipment; L10 ui-hud gains a named screen.

### `[[meta-social/four-dan-achievement-rows]]` — UPHELD [A2] (2 critics)

There are four Dan achievements, not one, and together they pin the display offset at exactly +1 across four points — with a shipped off-by-one between the shogo-named achievements and the shogo titles themselves.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin:436-470 (ids 48/49/50/51) joined to strings 8041-8044 / 8121-8124 and InventoryUI.as:2285-2317`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** meta-social blocker 3 gets four concrete rows; rebirth-elements gets a four-point proof that displayed Dan = STAT_DAN + 1. Reproduce the quirk: the achievement NAMED 'Renshi' fires at STAT_DAN 2 while the Renshi title is only awarded from STAT_DAN 3, and 'Kyoshi' fires at STAT_DAN 5 while the Kyoshi title starts at STAT_DAN 6.

### `[[npcdata/elemental-wheel]]` — UPHELD [A2] (2 critics)

The elemental ATK-vs-DEF formula is not missing: each element tag sets an attack stat AND the defence stat of a different element as a hard identity (fire→FIREATK+EARTHDEF, wind→WINDATK+WATERDEF, water→WATERATK+FIREDEF, earth→EARTHATK+WINDDEF), so there is no separate elemental-defence stat to find.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:194-213, restated for players at :334-337`
- **KILLS this line:** "- Blockers: ① what each element does (24 skills' damage/cost/AoE/status — names only). ② elemental ATK-vs-DEF formula."
- **Lane impact:** rebirth-elements — kills blocker ②; also gives combat-core the exact elemental mitigation term.

### `[[progression/elemental-def-crosswheel]]` — UPHELD [A2] (2 critics)

Elemental damage bypasses the DEF stat entirely and runs a parallel four-channel pipeline whose per-element defense is CROSS-WIRED to the opposite element's ATK stat — fireDef=waterAtk, windDef=earthAtk, waterDef=windAtk, earthDef=fireAtk — which is the elemental ATK-vs-DEF formula the rebirth-elements ledger lists as blocker ②.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3347-3357, :3415, :3420 and StatsManager.as:1836; web parity reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270 with constants §1t1235s0§..§1t1242s0§ at :260-294`
- **KILLS this line:** "② elemental ATK-vs-DEF formula."
- **Lane impact:** L5 rebirth-elements blocker ② dies outright — the formula is held in BOTH builds with identical argument order, and it is a counter-wheel (Water beats Fire, Earth beats Wind, Wind beats Water, Fire beats Earth) rather than a curve. L1 combat-core: the damage pipeline is two-stage, physical DEF then four channels DEF never touches. L4 progression: completes progression/def-mitigation-is-flat, whose 'exactly one modifier' is true of physical damage only.

### `[[rebirth-elements/24-elemental-skills-with-numbers]]` — UPHELD [A2] (2 critics)

The 24 elemental skills the ledger has as 'names only' carry full numbers: 6 per element in categories 7-10, with exact chi, cooldown and per-level damage stated as a percentage of that element's ATK stat (80/90/100/110/120% for the close-range attack, 150% for the AoE ultimate).

- **Cite:** `reference/extracted/skilldata.xml:607-650 (1013 Fire Breath, 5 levels, chi 5/6/7/8/10, cd 15, descs 7034-7038) and :1879-1894 (1070 Inferno, chi 50, cd 60, desc 6143); strings 7034-7038 / 6143 via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L11 meta+rebirth — blocker ① dead; blocker ② ('elemental ATK-vs-DEF formula') half-dead, the ATK side is a straight percentage of the element ATK stat. Also L2: these 4 categories are 24 of the 75 skills and were never counted in skills-meters' '6-category tree'.

### `[[rebirth-elements/dragon-dance-is-eight-and-teachable]]` — UPHELD [A2] (2 critics)

There are EIGHT Dragon Dance Steps, not four — each element has an Early-Heaven step (qty 30) and a 'II (Later Heaven)' step (qty 60), all passive, and every one of them is described as granting the ability to TEACH it to other players.

- **Cite:** `reference/extracted/skilldata.xml:1654-1669 (1056), :1722-1737 (1060) and the six parallel rows 1057-1059 / 1061-1063; strings 6117/6119/6121/6123/6125/6127/6129/6131`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** L11 meta+rebirth — the unlock structure and a player-to-player TEACHING mechanic are now held (and the teaching mechanic is absent from the ledger's meta-social section entirely). The Dragon Dance INPUT itself and the Kanji-statue bonus remain unheld; skilldata says nothing about either.

### `[[rebirth-elements/element-gate-is-a-stat-threshold]]` — UPHELD [A2] (2 critics)

The elemental-skill gate is a STAT threshold, not a rebirth count: req/has/id 28/29/30/31 are STAT_FIREATK/WINDATK/WATERATK/EARTHATK and the qty is a >= comparison, giving thresholds of 10 (kunai/trap/close-range), 30 (Dragon Dance Step + AoE ultimate) and 60 (Step II) — reachable through gear bonuses as well as rebirths.

- **Cite:** `reference/extracted/skilldata.xml:1658 (Dragon Dance Step: Fire) resolved via StatsManager.as:226-232 and StatsManager.as:4152-4177 (checkConditions defaults comp to "gte")`
- **KILLS this line:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L11 meta+rebirth — port the stat threshold, not the rebirth count (the 3x/6x reading is consistent only if a rebirth grants exactly +10 element ATK, and StatsManager.as:1835 adds findBonusStat(STAT_FIREATK) from equipment, so gear can also open these skills).

### `[[rebirth/aoe-radii-per-element]]` — UPHELD [A2] (9 critics)

The four ultimates have different AoE radii and different launch types, so they are not reskins of each other.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BigFireBreathProjectile.as:32, BigWaveProjectile.as:34, BigTornadoProjectile.as:33, BigEarthquakeProjectile.as:68, BigTornadoProjectile.as:24`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (AoE half). Inferno 600 / Tsunami 400 / Tornado 200 / Earthquake 50-per-rock; Tornado is LAUNCH_AIR while the other three are LAUNCH_KNOCKDOWN. Carried from PASS 1 and re-verified verbatim.

### `[[rebirth/dan-romaji-ladder]]` — UPHELD [A2] (2 critics)

The v0.717 client hardcodes the full romaji Dan ladder in the player-inspect panel — nidan, sandan, yondan, godan, rokudan, nanadan, hachidan, kyudan, judan — with the shogo suffix appended.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:531-564 (android twin at PlayerPanel.as:380-415)`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements 3 closed a second, independent way, and it is the PROOF for what the survey only asserted about the wiki garble: kyudan is STAT_DAN 8 = displayed Dan 9. These romaji strings are hardcoded ASCII, NOT in the string table, so a recreation cannot get them from strings.json. Also ui-hud: the inspect panel renders romaji while the inventory sheet renders kanji (455-464) — two different presentations of the same value.

### `[[rebirth/dragon-dance-bagua-input]]` — UPHELD [A2] (9 critics)

The Dragon Dance input is an 8-node bagua click ring with two named arrangements, and clicking the four elemental nodes {1,2,4,6} is what flips Earlier Heaven to Later Heaven.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:70-71, :354-355, :367-369, :302-334, :447`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ (input half). The four tier-3 passives 1056/1057/1058/1059 teach precisely nodes 6/2/1/4 — exactly the set that opens Later Heaven — which is the whole design rationale for rebirthing into all four elements. Carried from PASS 1, re-verified.

### `[[rebirth/dragon-dance-teachable]]` — UPHELD [A2] (9 critics)

Dragon Dance steps are a player-to-player transmission mechanic, and the game's own name for the second bagua arrangement is 'Later Heaven' — neither fact appears anywhere in the ledger.

- **Cite:** `docs/gauntlet/L0/index/strings.json["6117"] + docs/gauntlet/L0/index/strings.json["6125"] + docs/gauntlet/L0/index/strings.json["750"]`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ + meta-social: the Dragon Dance is a social propagation system, not a solo unlock, so a single-player recreation must decide how to substitute the teaching loop.

### `[[rebirth/dragon-dance-ui-art-is-held]]` — UPHELD [A2] (2 critics)

The Dragon Dance ritual UI art is fully on disk: a dark-red double outer ring, eight green-outlined white kanji nodes, an inner dark-red bagua trigram ring, a black/white taiji centre carrying the element name, and an X close button.

- **Cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png (819x500, viewed whole) + DefineSprite_1800/1.png (green bagua ring 437x437), DefineSprite_1802/1.png (dark-red bagua ring 437x437), DefineSprite_1808/1.png (taiji 242x242), DefineSprite_1797_shs3_fla.dragondancewords_235 (39x40, 58 frames), DefineSprite_1798_1t5501s0 (64x64); class link via reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** L rebirth-elements blocker (4): the survey closed the INPUT half only and left the art unmentioned. The art half is held too. The 58-frame dragondancewords strip is exactly what DragonDanceUI.as:359 and :364 index (word.gotoAndStop(num + 11) for Earlier Heaven, (num + 31) for Later Heaven), so the glyph-per-node mapping is reproducible frame-for-frame.

### `[[rebirth/element-circle-art-FOUND]]` — UPHELD [A2] (2 critics)

The rebirth element-picker circle's art is fully recovered on disk: DefineSprite 1650, a four-node clockwise counter ring in FIRE #FF3300 / EARTH #7D5500 / WIND #BBBBBB / WATER #0099FF on #333333 discs.

- **Cite:** `reference/extracted/payload.xml:626581 -> reference/extracted/sprites/DefineSprite_1650/1.png (808x480; crop (500,60)-(800,370), LANCZOS x3)`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** L-rebirth blocker 5 closed OUTRIGHT (data + flow + copy + icons + art), not reduced to 'art unknown'. Also ui-hud: the InteractUI parent symbol is DefineSprite_1691_1t401s0 and every named child is enumerable from payload.xml PlaceObject2Tag `name=` attributes — a general close-path for every remaining 'UI art never filmed' blocker on the board.

### `[[rebirth/element-circle-art-is-held]]` — UPHELD [A2] (2 critics)

The rebirth element-picker circle's art, layout and colours are fully recovered from the exported asset set: an 808x480 panel with FIRE (red) / EARTH (dark gold) / WIND (white-grey) / WATER (blue) kanji badges on a ring, joined by grey 'STRONG AGAINST' arrows running FIRE->EARTH->WIND->WATER->FIRE.

- **Cite:** `reference/extracted/sprites/DefineSprite_1650/1.png (808x480; viewed whole, then crop (230,80)-(620,420) upscaled x3 LANCZOS); parent symbol reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png (crop (520,250)-(860,470) x4) linked by reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9 [Embed symbol="symbol1691"] and :77 elementCircle:MovieClip`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** L rebirth-elements blocker (5) closed OUTRIGHT, art half included - it is not merely 'data held, art unheld'. The arrow direction independently corroborates the code wheel at StatsManager.as:1836, so art and AS3 agree with no measurement doc in between. The 808x480 sprite size is also fresh corroboration of ledger §3 #12's 800x480 native stage. Prompt copy recovered too: string 611 = 'Choose an element to specialize in.' (InteractUI.as:556-559).

### `[[rebirth/element-circle-art-recovered]]` — UPHELD [A2] (2 critics)

The rebirth element-picker circle's art, layout, colours and copy are fully recovered from the WEB v0.717 payload: sprite 1650 'elementCircle' inside InteractUI's symbol 1691, already rendered to PNG on disk.

- **Cite:** `reference/extracted/sprites/DefineSprite_1650/1.png (opened; crop (510,50)-(808,370) upscaled 3x to 894x960, Lanczos) + reference/extracted/payload.xml:626581 + reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤ is now CLOSED OUTRIGHT - data, flow, copy, geometry AND art. Also feeds ui-hud: the four element hexes are the OG's canonical element palette, and #7D5500 is the same gold InventoryUI.as:2286 draws the shogo title in. Also art-anim: this is v0.717 web art, so no build-parity caveat applies.

### `[[rebirth/element-counter-wheel]]` — UPHELD [A2] (9 critics)

Your ATK in one element IS your defence against another — a rock-paper-scissors wheel that makes choosing a rebirth element simultaneously a choice of what you become immune to.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1836, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270; parameter order from MCSPlayer.as:260`
- **KILLS this line:** "② elemental ATK-vs-DEF formula."
- **Lane impact:** rebirth-elements blocker ② (the DEF half) and the Surface bullet's 'elements are TWO systems' note — the gear side and the rebirth side are the SAME stat ids (28-31 ATK, 200-203 DEF gear affixes), which is the link the ledger says was never made. Carried from PASS 1, re-verified in both bundles.

### `[[rebirth/element-picker-uidata]]` — UPHELD [A2] (9 critics)

The rebirth/element-picker UI is held as shipped DATA — a two-menu flow whose second menu is four buttons labelled 'Fire ATK' / 'Earth ATK' / 'Wind ATK' / 'Water ATK' in that on-screen order with icons 24/27/25/26, plus a Dan-10 short-circuit that skips the element menu entirely.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:94-105 (labels resolved via strings.json 507-510)`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤ reduced from 'unknown UI' to 'unknown ART only'. The shipped dev comment '>=10 dan, no element boost' is a fourth independent confirmation of the 10-rank ladder.

### `[[rebirth/elemental-damage-ladder]]` — UPHELD [A2] (9 critics)

Elemental skill damage is the caster's element ATK stat scaled by skill level {0.8, 0.9, 1.0, 1.1, 1.2} with a zero physical component, and ultimates deal x1.5.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FireBreathProjectile.as:15-52 and :51; Damage.as:50; BigFireBreathProjectile.as:23`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (damage half). Carried from the PASS-1 journal and re-read line by line this pass; independently corroborated by the shipped tooltip '150% Fire ATK'. The FX sprite scale 1.0→1.4 moves in lockstep with the damage ladder.

### `[[rebirth/elemental-skill-tooltips]]` — UPHELD [A2] (9 critics)

The 24 elemental skills are not 'names only' — the shipped tooltips state their AoE nature and damage magnitude in words, and skilldata.xml carries every Chi cost and cooldown.

- **Cite:** `docs/gauntlet/L0/index/strings.json["6143"] + docs/gauntlet/L0/index/strings.json["6146"] + reference/extracted/skilldata.xml:1880-1893`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① closed for damage/cost/AoE. Also closes skills-meters blocker ① for the elemental branch ('read skill cards in a preserved build' — no build needed). Tooltips also reveal traps/kunai consume kunai AMMO on top of Chi, a cost the ledger never records.

### `[[rebirth/mitigation-flat-min1]]` — UPHELD [A2] (9 critics)

Elemental mitigation is flat subtraction with a hard min-1 floor per channel, summed with physical damage into a single HP loss.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3357 and :3420`
- **KILLS this line:** "② elemental ATK-vs-DEF formula."
- **Lane impact:** rebirth-elements blocker ② (the ATK-vs-DEF half) closed. Note the elemental floor is a hard 1, distinct from the physical getMinDamage() ladder — so the ledger's Ready bullet 'Undead/Red-Oni damage floor' is a different mechanism and should not be conflated. Carried from PASS 1, re-verified.

### `[[rebirth/no-elemental-status-effects]]` — UPHELD [A2] (2 critics)

No per-element status effect exists anywhere in the shipped damage pipeline; elements differ only by damage channel, launch type and AoE radius.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:26-63 + StatsManager.as:288-312 + MCSPlayer.as:3347-3420; negative grep for BUFF_/burn/poison/freeze across all *Projectile*.as`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements 1 fully closed INCLUDING the 'status' clause — the honest answer is a bounded NEGATIVE, not an unknown. The BUFF_* table is a meta/out-of-combat system (XP, ATK, DEF, SPEED, AP, tokens, coins, loot, mute, hell, injured, moderator) with zero projectile references. Also skills-meters: that BUFF_* enum is the shipped buff roster that lane's blocker asks for.

### `[[rebirth/no-elemental-status-effects-exist]]` — UPHELD [A2] (2 critics)

Elemental skills apply no status effect at all - no burn, slow, root or DoT - because the Damage packet has no field to carry one and every BUFF_* constant is a meta/economy buff.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:26-48 (complete field list) and :6-24 (launchType enum) + StatsManager.as:288-312 (complete BUFF_* list)`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L rebirth-elements blocker (1): the 'status' clause resolves to a clean NEGATIVE rather than staying open. Build the elemental kit statusless and label it. The only per-hit reaction is launchType (Tornado = LAUNCH_AIR, the other three ultimates = LAUNCH_KNOCKDOWN).

### `[[rebirth/string-table-resolved]]` — UPHELD [A2] (9 critics)

Every display string this system needs — Dan titles, shogo suffixes, rebirth prompts, all 24 elemental skill names and descriptions, the element-button labels — is resolved on disk, so the PASS-1 journal's claim that the table is missing is retracted.

- **Cite:** `docs/gauntlet/L0/index/strings.json (from reference/extracted/android/118_Mobile_Lang_EN.bin, 2533 entries)`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: dissolves the PASS-1 survey's own stated blocker ('all display TEXT … NOT on disk'), which was auto-REFUTED by Stage-0b finding S0-3. Also feeds ui-hud and quests-story.

### `[[skilldata/element-stat-is-one-system]]` — UPHELD [A2] (2 critics)

The elemental skill-tree gate and the elemental gear ATK stat are literally the same stat id: req/has/id 28/29/30/31 are STAT_FIREATK / STAT_WINDATK / STAT_WATERATK / STAT_EARTHATK, shown to the player as 'Fire/Wind/Water/Earth Specialization' — and the id order is Fire, WIND, WATER, Earth, not Fire/Water/Wind/Earth.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:226-232 and :4230; reference/extracted/skilldata.xml:924; docs/gauntlet/L0/index/strings.json ids 726-729`
- **KILLS this line:** "elements are TWO systems (rebirth skills and gear ATK/DEF typing) — the gear side is measured (A-17) but never linked to the rebirth domain."
- **Lane impact:** rebirth-elements — kills the 'never linked' surface verdict and supplies the join; items-equipment — elemental gear ATK now has a named consumer; skills-meters.

### `[[skilldata/elemental-values-held]]` — UPHELD [A2] (2 critics)

Every elemental skill's damage, chi cost and cooldown is on disk: the close-range elemental attacks scale 80/90/100/110/120% of their element's ATK stat across 5 levels at chi 5-10 and 15s cooldown, and the four AoE ultimates (Inferno/Tsunami/Tornado/Earthquake) do 150% element ATK at chi 50 / 60s / lvlreq 50.

- **Cite:** `reference/extracted/skilldata.xml:615-650 (skill 1013 Fire Breath) and :1879-1894 (skill 1070 Inferno); level-desc string ids 7034-7038, 7043-7057 and skill-desc 6143-6146 in docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements — blocker ① dead outright, blocker ② (ATK-vs-DEF formula) half closed on the ATK side; combat-core — 24 skills gain exact damage/cost/cooldown.

### `[[ui-hud/interactui-panel-geometry]]` — UPHELD [A2] (1 critic)

InteractUI's panel geometry is held in stage pixels straight from the payload placement matrices, so the rebirth menu can be laid out without guessing.

- **Cite:** `reference/extracted/payload.xml:626573-626600 (DefineSpriteTag spriteId=1691, the symbol §1t401s0§/InteractUI embeds)`
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** ui-hud + rebirth-elements: twips/20 = px, so titleText sits at (10.3, 70) px, buttons share x = 10 px at y = 109 / 148 / 187 / 226 / 265 px — a uniform 39 px row pitch — and elementCircle anchors at the sprite origin. Same technique opens every other named UI sprite in payload.xml.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[rebirth/dragon-dance-ui-art-recovered]]` — NOT-UPHELD [A2] (2 critics)

The entire Dragon Dance bagua UI art is also on disk and rendered - the 8-node click ring with taijitu centre, trigram glyphs and close button - class-linked to the v0.717 DragonDanceUI.

- **Cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png (opened, 813x480) + reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:7 and :70-71; second variant at reference/extracted/sprites/DefineSprite_3555_1t6980s0/1.png`
- **aimed at this line, which SURVIVES:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ loses its art half too, which nobody in this unit claimed. The node `word` sub-clip frame map is also held (DragonDanceUI.as:358 gotoAndStop(num+11) Earlier Heaven / :362 num+31 Later Heaven), so the per-node kanji swap is reproducible. Feeds ui-hud.

### `[[rebirth/element-atk-budget-is-100]]` — NOT-UPHELD [A2] (2 critics)

A character's lifetime base element-ATK budget is exactly 100 points, so it is arithmetically impossible for one player to unlock all four Dragon Dance Steps (4 x 30 = 120) — which is why the Steps are a teachable, player-to-player mechanic.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InteractUI.as:848-880 (only writes to base STAT_FIREATK/WIND/WATER/EARTH in either bundle; desktop twin §1t401s0§.as:873-895) + reference/extracted/android/90_InteractUI_UIData.bin:97 + StatsManager.as:2209`
- **aimed at this line, which SURVIVES:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements + meta-social: rebirths at STAT_DAN>=9 hit NEITHER grant branch (the shipped dev comment says 'no element boost'), so the budget is DAN 0..7 at +10 plus DAN 8 at +20 = 100 points. Best solo outcome is one element at 60 + one at 30, or three at 30. The Later Heaven flip needs nodes {1,2,4,6} = {wind,water,earth,fire}, i.e. all four Steps — unreachable solo. A single-player recreation must substitute the teaching loop or Later Heaven is unreachable by design. Also refutes the survey's stated rationale 'the whole design rationale for rebirthing into all four elements'.

### `[[rebirth/elemental-gate-roster]]` — NOT-UPHELD [A2] (2 critics)

The full elemental unlock roster splits 12 / 8 / 4 across the 10 / 30 / 60 element-ATK thresholds, and the four ultimates sit at the 30 (3x rebirth) tier rather than the first tier.

- **Cite:** `reference/extracted/skilldata.xml, all 24 skills carrying <req><has><id>28|29|30|31</id>, names resolved via docs/gauntlet/L0/index/strings.json`
- **aimed at this line, which SURVIVES:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements: confirms the survey's 1x/3x/6x correction and adds the exact roster, with the correction that the AoE ultimates are 3x-tier, so the first rebirth into an element yields Breath/Trap/Kunai/tier-2 melee only.

### `[[rebirth/elemental-gate-table]]` — NOT-UPHELD [A2] (2 critics)

The complete elemental unlock table is recoverable by name: qty 10 opens Fire Breath, the four Element Traps, the four Kunai, Ground Punch, Wind Combo and Water Stomp; qty 30 opens the four Dragon Dance Steps AND the four ultimates Inferno/Tsunami/Tornado/Earthquake; qty 60 opens the four Dragon Dance Step II passives.

- **Cite:** `reference/extracted/skilldata.xml — every <req><has><id>28|29|30|31</id><qty>…</qty> block, names joined through docs/gauntlet/L0/index/strings.json (anchors verified at :988, :1726, :1884)`
- **aimed at this line, which SURVIVES:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L-rebirth-elements + L-skills-meters: the ledger's Dragon Dance sentence is correct as written; what it omits is the 1x tier (breath/traps/kunai/stomps) and the fact that the four ultimates share the 3x gate with the Dragon Dance Steps. This is the table that refutes the rebirth lane's 'entire usable elemental kit lands on the FIRST rebirth'.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-8-dragon-dance-web-parity]]` — UPHELD [A2] (1 critic)

The Dragon Dance ring is in the WEB v0.717 build too, so NF-9's android-only scoping is unnecessarily conservative. §1t5495s0§ is the web DragonDanceUI twin and carries both trigram label arrays verbatim; §1t8695s0§ carries the same five target permutations ('1246','4216','1642','1426','6241') the Kanji statue draws from.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71`
- **Build:** both
- **Lane impact:** L11 meta+rebirth: blocker ④'s input half closes for the TARGET build, not just for Android — no parity flag needed on the Dragon Dance input contract.

### `[[frames/rebirth-element-picker-still-unfilmed]]` — UPHELD [STILL_UNHELD] (2 critics)

After sweeping every chapter directory of both longplays plus both 100-frame map segments and broad_survey, there is no rebirth screen, no element circle and no Dan-rank UI anywhere in the frame corpus — the ledger's 'never filmed' stands.

- **Build:** both — the gap is in the film, not in a build difference
- **KILLS this line:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: blocker ⑤ remains open; no frame-side path to close it

### `[[hunter-s26a/web-elemental-def-pipeline-confirms-both-builds]]` — UPHELD [A2] (1 critic)

The elemental ATK-vs-DEF pipeline is in the WEB player class too, so hunter/elemental-atk-vs-def-formula-held's 'both' label is now proven rather than asserted (it cited only android artifacts).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3391-3394, :3395-3422, :3489`
- **Build:** web v0.717
- **KILLS this line:** "② elemental ATK-vs-DEF formula."
- **Lane impact:** L-combat-core / rebirth-elements. Removes the android hedge from the one blocker that closes outright.

### `[[hunter-s26a/web-twins-of-the-four-elemental-ultimate-projectiles]]` — UPHELD [A2] (1 critic)

The four elemental-ultimate projectile constructors exist in the WEB v0.717 payload with the same damage*1.5 in the same element channel, closing the build hole in hunter/all-24-elemental-skills-fully-specced (which labelled itself web v0.717 while citing only android artifacts).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t8341s0§.as:24 + §1t8334s0§.as:27 + §1t8338s0§.as:23 + §1t8343s0§.as:24`
- **Build:** web v0.717
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements. Makes the 150%-of-element-ATK damage of the four ultimates a WEB-build fact, not an android-only one. The <chi>/<cooldown> half stays v0.682 — skilldata.xml is android-sourced and there is no <skilldata> root in any web bindata blob.

### `[[hunter/android-rebirth-pays-20-5-hgold-vs-web-100-25]]` — UPHELD [A2] (1 critic)

A real build-tuning divergence in the rebirth payout that the packet's two rebirth-gold findings both miss: the WEB v0.717 build pays 100 Heavenly Gold at the DAN-8 rebirth and 25 otherwise, while the ANDROID v0.682 build pays 20 and 5 for the same two branches — a 5x difference. Both builds cap the dan stat at 9 identically. Anyone porting the payout must take the web numbers, and any 'the wiki says 25' reasoning is build-specific.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 (web, §1t9413s0§ = 12 = STAT_HGOLD at :228) vs reference/decompiled/shs3_android/scripts/StatsManager.as:2201-2207 and :194`
- **Build:** both
- **Lane impact:** rebirth-elements + economy: tenthGold=100 is correct for the target build, but only for the target build. Also a general warning for this lane — the two bundles diverge on tuning constants even where the data XMLs match row-for-row, exactly the S0-3 caveat.

### `[[hunter05/seg05-frame0025-is-a-you-win-card]]` — UPHELD [A1] (1 critic)

reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg is a full-screen crimson 'YOU WIN' result card, not an overworld HUD. It contains no level badge, no experience readout, no coins/gold readout and no Dan field — so it cannot support any claim about a level-8 HUD or about two on-screen currencies.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg (1024x576, whole frame, x2 LANCZOS; I also cropped the top 22% at x3 and it is solid red)`
- **Build:** web v0.717 longplay B
- **Lane impact:** Ledger hygiene — this is the frame that refutes ledger/film-shows-rebirth-is-unsourced. THE FRAME WINS: the A1 quote filed against it describes a HUD that is not there.

### `[[itemdata/consumable-effect-table]]` — UPHELD [A2] (2 critics)

Every consumable's effect is exactly decodable: modifier ids 0-16 are the stat enum, and ids 25/78/79/82/84/90/97/98/99/101/102/103 each dispatch to a named engine action in InventoryUI.onUseItem.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:219-298 (determineAttributes) + StatsManager.as:170-202 (STAT_* enum) + InventoryUI.as:901-1010 (inside onUseItem at :854) + docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L3 for the items themselves; L10 for the rebirth scroll trigger; L11 for Writ of Release / clan deeds; L9 (WORLD) gets free node ids out of modifier 102 (e.g. 8382465 as the dojo/home teleport target, 9902095 for the wedding venue).

### `[[kh-dragondance-is-in-the-web-build-too]]` — UPHELD [A2] (1 critic)

The Dragon Dance input is NOT android-only. The web v0.717 payload carries the same class at the same line numbers: §1t5495s0§.as:70-71 are the Earlier Heaven and Later Heaven trigram label arrays verbatim, and §1t8695s0§.as:172/176/188 hold the same statue target sequences '1246', '4216' and '6241'. So packet claim NF-9's 'build: android v0.682' can be upgraded to 'both' and the meta+rebirth blocker closes without any parity caveat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71 and §1t8695s0§.as:172, :176, :188`
- **Build:** both
- **Lane impact:** L11 meta+rebirth: removes the S0-3 android-parity caveat from the Dragon Dance recovery.

### `[[npcdata/elemental-roster-empty]]` — UPHELD [A2] (2 critics)

Only 4 of 495 NPCs carry any elemental value at all (three earth=10, one fire=10) and all four are player ALLIES — no enemy in the shipped roster is elemental, and <water>/<wind> appear zero times in the file.

- **Cite:** `reference/extracted/npcdata.xml:3380 (Satoshi, fire), :3439 (Fumio, earth), :4039 and :4272 (Mitsuo, earth); counts from docs/gauntlet/L0/index/npcdata.json (earth count 3, fire count 1, no water/wind paths)`
- **Lane impact:** rebirth-elements + enemies-ai — elemental combat in v0.717 data is a player/ally-side system, not enemy typing; any 'elemental enemy' design would be recreation-authored, and must be labelled.

### `[[progression/web-rebirth-gold-25-not-5]]` — UPHELD [A2] (2 critics)

The WEB build grants +25 hard gold per rebirth and +100 at Dan 8 — not the Android build's +5/+20 that the surveyor shipped as a cross-lane gift; the ledger's '+25g' was right all along.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 (stat id resolved via :228 '§1t9413s0§:int = 12' against StatsManager.as:194 'STAT_HGOLD:int = 12')`
- **KILLS this line:** "- Ready: rebirth trigger (1000c scroll, L80, +25g, "next Dan rank + specialize in an element"); 4 elements × 6 named skills; Undead/Red-Oni damage floor; carry-items-reset-level."
- **Lane impact:** L4/L5: kills the surveyor's cross-lane gift to rebirth-elements blocker ③ and VINDICATES the ledger's +25g. The Dan-cap half of that gift survives — web §1t1523s0§.as:2653 'if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }' ⇒ Dan maxes at 9, 10 ranks. Port the Dan cap, discard the gold figure.

### `[[rebirth/damage-has-no-status-field]]` — UPHELD [A2] (1 critic)

The Damage class carries no status, buff, DoT or duration field at all, and it is the only payload an elemental projectile hands to the hit check — strong negative evidence that elemental skills apply no status beyond their launch type.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:1-60 (complete field list) + FireBreathProjectile.as:51-58, BigFireBreathProjectile.as:23-38`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual, moved from STILL_UNHELD to PARTIAL. Not conclusive because checkHitObject also receives the projectile itself, so a receiver could branch on its type; but no status channel exists on the damage payload. Close-path unchanged: read NPCManager.checkHitObject and the BUFF_* constants end to end.

### `[[rebirth/damage-packet-has-no-status-field]]` — UPHELD [A2] (1 critic)

The Damage packet carries no status, buff or DoT field at all, so any elemental status effect would have to be applied outside it.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:26-47 (complete instance-field list) plus grep 'buff' over FireBreathProjectile.as and BigFireBreathProjectile.as = no hits`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual shrinks from a system-wide unknown to one function: NPCManager.checkHitObject. PARTIAL because absence in the packet is not proof of absence in the game; the STUN/DEATHTOUCH launch types (Damage.as:18,20) show status-like effects do exist, just not on any elemental construction site.

### `[[rebirth/dan-1-has-no-kanji]]` — UPHELD [A2] (2 critics)

A Dan-1 character (STAT_DAN 0) displays no kanji badge at all - the dan field is set to the empty string - and string 455 '(初段)' is never referenced anywhere in the decompiled tree.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2280; negative grep 'getString(455' over reference/decompiled/ returns zero hits`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L-rebirth-elements / L-ui-hud: the used kanji range is 456-464 over STAT_DAN 1-9 (nine badges), not 455-464 over 0-9. A recreation that paints 初段 on a fresh character contradicts the shipped build.

### `[[rebirth/dan-zero-has-no-title]]` — UPHELD [A2] (1 critic)

Dan title string 455 (初段) is dead copy — it is never fetched in either build, and a STAT_DAN-0 character renders an empty dan field.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2274-2277; reference/decompiled/shs3_payload/scripts/§1t408s0§.as:533-534; grep -rn 'getString(455' over both script trees returns no hits`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements / ui-hud: the displayed title map is 0->blank, 1->456 (弐段) … 9->464 (十段), default->464. A recreation that renders 初段 at the first rank is wrong on screen.

### `[[rebirth/dan-zero-shows-no-title]]` — UPHELD [A2] (1 critic)

A Dan-1 (STAT_DAN 0) character displays a BLANK dan field, so the kanji title string 455 exists in the table but is never shown in game; the displayed ladder runs 456..464 for STAT_DAN 1..9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2312`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L rebirth-elements + ui-hud: a recreation that renders 初段 for a fresh character diverges from the original on the most common screen state in the game. The shogo suffix bands the survey reported are exactly right (465 at cases 3/4/5, 466 at 6/7, 467 at 8/9, default 467+464).

### `[[rebirth/dan0-renders-no-kanji]]` — UPHELD [A2] (1 critic)

STAT_DAN 0 renders an EMPTY dan field — string 455 (first-dan kanji) is never displayed by the client, so the kanji ladder actually shown runs 456..464 for STAT_DAN 1..9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2274-2282, desktop confirm reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3060-3070`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: corrects the survey's own claim. A recreation that maps 455..464 onto STAT_DAN 0..9 paints a first-dan title on a brand-new character, which the OG never does. String 455 exists in the table but is dead copy.

### `[[rebirth/dan1-has-no-kanji-title]]` — UPHELD [A2] (1 critic)

Dan 1 displays NO kanji title — string 455 (初段) is never shown — so the live map is STAT_DAN n → string 455+n for n≥1 only.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2316`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: a recreation that prints 初段 at Dan 1 renders something the OG never renders. Ten ranks, nine kanji labels (456 弐段 … 464 十段), blank at rank 1. The shogo bands are separately correct: 465 Renshi at STAT_DAN 3-5, 466 Kyoshi at 6-7, 467 Hanshi at 8-9 and default.

### `[[rebirth/dan1-renders-blank]]` — UPHELD [A2] (1 critic)

String 455 '(初段)' is never displayed: at STAT_DAN 0 both builds set the Dan field to an empty string, so a Dan-1 character shows NO rank text at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2275-2277 and desktop twin reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3063-3065`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: corrects the surveyor's claim rebirth/dan-ladder-titles. The display mapping is STAT_DAN n → string 456+(n-1) for n>=1 and BLANK at n=0, not 455..464 across the board. A recreation copying the survey verbatim would render '(初段)' where the OG renders nothing — and every HUD frame in both longplays shows exactly that empty field, so this is frame-consistent too.

### `[[rebirth/dan1-shows-no-kanji]]` — UPHELD [A2] (1 critic)

Dan 1 displays no kanji rank at all - string 455 (初段) ships in the table but is never rendered by either display path.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2278 and PlayerPanel.as:384-386`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: a recreation must leave the dan field blank at Dan 1 and start printing kanji at Dan 2 (弐段). Both display paths agree, and PlayerPanel.as additionally gives the romaji ladder the wiki garbled - nidan, sandan, yondan, godan, rokudan, nanadan, hachidan, kyudan, judan for STAT_DAN 1..9.

### `[[rebirth/dragon-dance-tier-ids]]` — UPHELD [A2] (1 critic)

The Dragon Dance Step skills 1056-1059 are the qty-30 (3x) tier, not tier 3; the qty-60 (6x) tier is 1060-1063, the '... II' skills whose tooltips alone say '(Later Heaven)'.

- **Cite:** `reference/extracted/skilldata.xml, ids 1050-1075 parsed with displaynames resolved via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements + skills-meters: the ledger's '3x/6x' line is EXACTLY right (Step at 3x, Step II / Later Heaven at 6x) and needs only the addition of the 1x tier, not correction. Full per-element census from the same file: 3 skills at qty10 (Breath, Elemental Trap, Kunai), 2 at qty30 (Dragon Dance Step, AoE ultimate), 1 at qty60 (Step II) — 24 elemental skills total, matching the ledger's '4 elements x 6 named skills'.

### `[[rebirth/dragon-dance-v0717-parity]]` — UPHELD [A2] (1 critic)

The Dragon Dance input logic has full v0.717 parity — the label arrays and the {1,2,4,6} Later-Heaven trigger are byte-identical to android, at the same line numbers — so the S0-3 build caveat does not apply to this mechanic.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71, :382 vs reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:70-71, :367`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements: promote the Dragon Dance input from android-only to build-agnostic CONTRACT. Contrast with the statue (diverges) and the stance multipliers (diverge) — parity must be checked per-mechanic, never assumed either way.

### `[[rebirth/entry-is-scroll-of-rebirth-item-2202]]` — UPHELD [A2] (1 critic)

Rebirth is triggered by consuming inventory item 2202 'Scroll of Rebirth' at EXACTLY level 80, with a one-per-session anti-cheat lock — not by talking to an NPC.

- **Cite:** `reference/extracted/itemdata.xml:2311-2325 (strings 4154/4155) + reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:911-923, desktop confirm reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:1261-1276; levelCap 80 at §1t1523s0§.as:362`
- **KILLS this line:** "Ready: rebirth trigger (1000c scroll, L80, +25g, "next Dan rank + specialize in an element")"
- **Lane impact:** rebirth-elements: the ledger had this at prose level; what is new is the exact ids and semantics for a 1:1 build — item 2202, baseprice 1000 COINS (STAT_GOLD), modifier id 25 as the 'opens rebirth UI' marker, and the gate is `== levelCap`, not `>= levelCap`. The item's second modifier (id 12, value 5) is DEAD DATA in both builds: the modifier loop returns inside the id-25 branch before reaching it. Also items-equipment: modifier ids 25/90/97 are UI-trigger modifiers, not stat grants — that pattern needs its own row.

### `[[rebirth/gear-affixes-do-not-unlock]]` — UPHELD [A2] (1 critic)

Gear affixes on element ATK raise elemental damage but can never satisfy a skill unlock requirement — the requirement evaluator reads the base player stat only.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4216-4232, :2926-2940, :3937-3953; desktop twin at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:4906`
- **KILLS this line:** "elements are TWO systems (rebirth skills and gear ATK/DEF typing) — the gear side is measured (A-17) but never linked to the rebirth domain."
- **Lane impact:** rebirth-elements + items-equipment: the link between the two element systems is ONE-WAY. Gear feeds combat (findBonusStat is added only in initAttackStats, StatsManager.as:1835) but is invisible to the 10/30/60 unlock gate. Refutes the survey's lane_impact assertion that affixes count toward the threshold; a rebuild that wires them in lets a player skip rebirths.

### `[[rebirth/no-elemental-buff-channel]]` — UPHELD [A2] (1 critic)

The game's buff system provably carries no elemental status effect: the BUFF_* enum has thirteen entries and not one is burn, slow, root, freeze or damage-over-time.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:288-312`
- **KILLS this line:** "① what each element does (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual, narrowed. Every BUFF_* is a meta/economy/moderation buff; none is a combat status. So elemental skills cannot apply a status via the buff system, and the only remaining place a burn/slow could live is an ad-hoc per-projectile effect. A grep for setOnFire|burning|poison|slowed|frozen over the android tree returns only background-art redFreeze() and a guardian stomp animation constant, so the residual is close to empty — but I did not read NPCManager.checkHitObject end to end, so PARTIAL not HELD.

### `[[rebirth/romaji-dan-ladder-is-cross-build-not-desktop-only]]` — UPHELD [A2] (2 critics)

The hard-coded romaji Dan ladder is not a v0.717 desktop addition — the android v0.682 PlayerPanel carries the identical switch with the identical string ids. §1t408s0§.as is simply the web PlayerPanel.

- **Cite:** `reference/decompiled/shs3_android/scripts/PlayerPanel.as:388, :406, :409, :412, :415 vs reference/decompiled/shs3_payload/scripts/§1t408s0§.as:538, :556, :559, :562, :565`
- **Build:** both
- **Lane impact:** rebirth-elements ③: good news for parity — the Dan ladder is identical across both builds, so there is no build-parity caveat on it at all. It is also what refutes rebirth/romaji-dan-ladder's 'absent from ... the android build'.

### `[[rebirth/shogo-threshold-off-by-one]]` — UPHELD [A2] (1 critic)

Two shipped artifacts disagree by one Dan on when a kendo shogo title is earned: the achievement table awards 'Renshi' at STAT_DAN 2 and 'Kyoshi' at STAT_DAN 5, while the nameplate code appends those suffixes from STAT_DAN 3 and 6.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (achievements 48-51, stat 25) vs reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2285-2316`
- **KILLS this line:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + meta-social: blocker ③ is closed on the count (10 ranks) and the kanji ladder, but the shogo AWARD THRESHOLD is genuinely ambiguous between two shipped tables. A rebuild must pick one and label the choice rather than average them. Both artifacts are android v0.682, so a desktop check could still settle it.

### `[[rebirth/statue-rng-only-later-heaven]]` — UPHELD [A2] (1 critic)

The statue's deterministic RNG permutation applies only to Later-Heaven statues (props >= 8); Earlier-Heaven statues take their required sequence straight from the props string, i.e. a single node.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-42 and :65-68`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④: two statue behaviours, not one. The 4-node RNG permutation the survey describes is the Later-Heaven case only; the eight Earlier-Heaven statues teach one node each with no randomisation.

### `[[rebirth/statue-two-sequence-modes]]` — UPHELD [A2] (1 critic)

Dragon Dance statues have TWO sequence modes, not one: the RNG permutation only applies to Later-Heaven statues (prop >= 8); Earlier-Heaven statues take their sequence verbatim from the room-object property.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-42 and :65-66`
- **KILLS this line:** "④ Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④, statue half — refines the surveyor's claim rebirth/kanji-statue-bonus, which presents the RNG permutation as THE sequence rule. A recreation must implement both branches: authored sequence straight off the room prop for Earlier Heaven, node-id-seeded permutation of '1246' for Later Heaven. Both are reproducible offline; the prop values come from the room-object defs in bindata 93 / 84_QuestEngine_TrapRoomData.

### `[[rebirth/string-455-never-displayed]]` — UPHELD [A2] (1 critic)

String 455 '(初段)' is shipped-but-dead — Dan 0 renders a BLANK dan field, and getString(455) has zero call sites anywhere in the android tree.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2278 + grep -rn 'getString(455)' over reference/decompiled/shs3_android_payload/scripts/ (zero hits)`
- **KILLS this line:** "n/a — peripheral correction to the surveyor's claim rebirth/dan-ladder-titles"
- **Lane impact:** rebirth-elements + ui-hud: the displayed kanji set is 456-464 for STAT_DAN 1..9 with a BLANK field at Dan 0, not 455-464. A recreation that renders 初段 at first rank would diverge from the original. The ladder and shogo mapping in that claim are otherwise exactly right.

### `[[rebirth/unlock-gate-ignores-gear-affixes]]` — UPHELD [A2] (1 critic)

Gear affixes on the four element-ATK stats do NOT count toward the 10/30/60 skill-unlock thresholds - only the rebirth-granted base stat does.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4216-4233 (checkCondition) vs :1835 (initAttackStats), reached from XMLSkill.as:133/:321 -> StatsManager.checkConditions(:4152-4183)`
- **KILLS this line:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L rebirth-elements: corrects the survey's own lane_impact on rebirth/unlock-gate-is-stat-threshold, which asserts the opposite. The unlock cadence therefore IS a clean function of rebirth count (1x/3x/6x, with the Dan-8 rebirth granting +20 instead of +10), because nothing else feeds stats 28-31. Shipping the gear-inclusive rule would let a player buy their way past the gate.

### `[[skills-meters/elemental-per-level-numbers-are-blank]]` — UPHELD [A2] (1 critic)

Only 4 of the 24 elemental skills carry per-level numbers; the 8 elemental kunai/traps, the 8 Dragon Dance Steps and the 4 AoE ultimates each have a single level row whose <desc> is blank.

- **Cite:** `reference/extracted/skilldata.xml categories 7/8/9/10, parsed against docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "### rebirth-elements"
- **Lane impact:** L11/rebirth-elements: its blocker ① 'what each element does' is only partly closed — names, chi costs, cooldowns and the {10,10,10,30,30,60} item gates are held, but 20 of 24 effect magnitudes still live in projectile classes that exist only in the retuned Android bundle. The survey's lane_impact claimed all 24 were per-level-numbered; do not act on that.

### `[[string-table/weight-gate-is-a-travel-guard-in-code]]` — UPHELD [A2] (1 critic)

The carry-weight gate is enforced in code as a travel/interact guard at eight movement objects — `findWeight() > getCarryingWeight()` aborts interact() — and it is exempted inside PvP rooms; the bank's container cap is a separate, independent limit.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_TownSign.as:44-48 + Obj_DirectionSign.as:161 + Obj_Hut.as:72 + Obj_PathBush.as:112 + Obj_HiddenTemple.as:189 + Obj_DragonDancePath.as:277 + NodeUI.as:381 + InteractUI.as:1732 + BankUI.as:641`
- **Build:** android v0.682
- **Lane impact:** items-equipment + world-exploration — upgrades string-table/carry-weight-gates-travel from one prose string to eight code call sites, and adds the PvP-room exemption (weight is not enforced inside duel rooms). It also separates the two weight systems the claim conflated: carry weight gates travel, bank storageMaxWeight gates deposits (that second one is already banked at rebirth-elements.md:293).

### `[[tooling/source-constants-mined-the-0682-decompile]]` — UPHELD [A2] (1 critic)

docs/research/fidelity/SOURCE_CONSTANTS.md states its 189 constants come from a build 'identified as v0.717', but it never cites a single web-bundle class and the decompile it names stamps clientVersion 0.682. Given that crit, per-stance reach, per-stance damage, mastery coefficients, maxreload, behead and rebirth payout ALL differ between the two builds, every constant in that file needs a build audit before promotion.

- **Cite:** `docs/research/fidelity/SOURCE_CONSTANTS.md:3-5 ('Build identified as v0.717 … 189 constants extracted') with my own `grep -c '§1t' docs/research/fidelity/SOURCE_CONSTANTS.md` = 0; reference/decompiled/shs3_android_payload/scripts/StatsManager.as:30 (`public static var clientVersion:Number = 0.682;`) vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (`public static var §1t9323s0§:Number = 0.717;`); `diff -q reference/decompiled/shs3_android/scripts/StatsManager.as reference/decompiled/shs3_android_payload/scripts/StatsManager.as` is silent (identical)`
- **Build:** both
- **Lane impact:** Cross-lane, and the real unclaimed force behind the packet's three 'web AS3 is readable' claims. This is a SOURCE_CONSTANTS.md defect, not a REBUILD_READINESS.md one — which is precisely why those three claims' ledger overturns do not hold. Measured divergences to re-audit: crit 1.3 vs 1.2/1.5 · light reach 1.4 vs 1.5 · heavy damage 1.4 vs 1.5 · mastery coefficient 0.02/0.04 vs 0.005 · maxreload 192/48 vs 120/24 · behead 1.3 vs 1.5 · rebirth 25/100 vs 5/20. Identical in both: base slash length 120 + floor((90 + DAN×5)·SPD/(20+SPD)), Heavy defence ×0.8, the stat-id table, the quest coin/prosperity literals, calcXP.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
