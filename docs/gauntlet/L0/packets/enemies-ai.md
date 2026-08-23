# LEDGER PACKET — `enemies-ai`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**46 surviving overturns · 7 true-but-rejected · 46 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **enemies-ai** | 34 | full taxonomy + movesets, boss roster, projectile set | enemy level→stat formula; per-enemy HP; telegraph/stagger frames; aggro/spawn geometry |
### enemies-ai — 34
- **Ready:** full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster; projectile set (arrows arc, oni rocks, bandit hammer); independent-aggro (no coordination — closed); nameplate (N)=level.
- **Blockers:** ① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP. ③ telegraph/active/recovery + stagger frames. ④ aggro/leash/spawn geometry. ⑤ Undead damage-reflect probability; arrow arc physics.
- **Surface:** the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes. Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-6-web-payload-carries-no-data-xml]]` — UPHELD [A3] (3 critics)

The WEB v0.717 payload contains NO itemdata, skilldata, npcdata or questdata. Its 27 embedded bindata blobs are 19 animdata, 1 survivalmodedata, 1 room-object table, 5 name tables and a GIF — no data XML and no lang table. All four reference/extracted/*.xml files are the ANDROID blobs with the XML declaration and CRLFs stripped (skilldata.xml 39,003 B vs android/117_Mobile_SkillData.bin 39,045 B; itemdata 184,002/184,044; npcdata 228,413/228,455 — the same 42-byte delta). Streaming the 329 MB payload.xml finds 'skilldata' 0 times and '<npcdata' 0 times (the two 'itemdata'/'questdata' hits are BigDB table-name string constants at bytes 19,503,638 and 19,502,309). The web build fetched these from the dead CDN.

- **Cite:** `docs/gauntlet/L0/index/bindata.json (all 27 web blob roots) + reference/extracted/skilldata.xml vs reference/extracted/android/117_Mobile_SkillData.bin + reference/extracted/payload.xml (streamed)`
- **Build:** web v0.717
- **KILLS this line:** "S0-3 CAVEAT: Data-XML row counts match exactly; UI copy and combat tuning parity is NOT established."
- **Lane impact:** Cross-cutting, and it qualifies gauntlet §0 itself: the 'Data-XML row counts match exactly' premise cannot be checked, because there is no web data XML to compare against. Every skilldata/itemdata/npcdata/questdata claim in this lane carries the v0.682 caveat — including NEW-6-shunpo-effect-recovered, stance-damage-mastery10-ceiling and v0717-stance-multipliers.

### `[[NF-level10-clamp]]` — UPHELD [A2] (2 critics)

Every enemy spawned with an explicit level <= 10 is FORCED to 1 HP / 1 damage / 1 defense regardless of authored values, and levels 11-20 are damped by x0.9. This is the mechanism behind the '~1-HP-chip field trash' the videos show.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-260 (clamp at :253-259) and EnemyPlayer.as:138-142`
- **Build:** both
- **KILLS this line:** "the shipped AITIERS/ENEMYBASE are a PvP-duel dummy (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L-enemies-ai + L-combat-core: the ledger's Surface suspicion is now mechanised, not just censused. It also means the authored lvl 1-10 rows of the five clan armies are moot at runtime.

### `[[NF-melee-ai-geometry]]` — UPHELD [A2] (2 critics)

The enemy melee AI bodies ARE readable and carry the aggro/trigger geometry that packet claims 3 and 22 both left STILL_UNHELD — approach speed, attack-trigger box, downed-target multiplier, retarget cadence and knockdown pushes, all as literals.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyKnife.as:64, :68, :104, :108, :113-115, :127, :140, :181, :200; NPC.as:285-294; EnemyPlayer.as:52`
- **Build:** both
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames. ④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: blocker ④ is HELD for one class (nearest-enemy targeting, retarget every 12 frames, no leash term, attack trigger a 50x50 px box) and blocker ③'s trigger half likewise. PARTIAL because I read one of 35 classes; the other 34 follow the same startAction/doAction shape and are equally readable. Bonus: a 2x damage multiplier on downed targets appears nowhere in the ledger.

### `[[NF-procgen-surnames]]` — UPHELD [A2] (2 critics)

'Hachisuka Kano' and 'Honda Shizuka' are PROCEDURALLY GENERATED names, not missing bosses: Hachisuka and Honda are rows in the SamuraiFamilyNames table, Kano is a male given name and Shizuka a female given name.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin (offsets 51, 84), reference/extracted/bindata/94_1t4651s0.bin (offset 692), reference/extracted/bindata/97_1t4650s0.bin (offset 1620); consumer at reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:529`
- **Build:** both
- **KILLS this line:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L-enemies-ai + L-quests-story: two of the four 'omitted bosses' are dissolved — they are RNG name draws from the procgen tables, so the boss table omits nothing. Zabuza, Tengu and Hotaru remain genuinely unfound across all extracted XML, all 27 bindata blobs, all 42 android blobs and reference/decompiled/.

### `[[actionscript/enemy-level-scaling-and-1hp-trash]]` — UPHELD [A2] (2 critics)

The enemy level→stat formula is a linear rescale of the NPC's own XML row with a sub-20 penalty and a hard floor that sets every level-≤10 enemy to 1 HP / 1 damage / 1 defense — the code cause of one-hit-kill field trash — and it is present verbatim in the web v0.717 build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:258-278 (web v0.717) · plain-named twin reference/decompiled/shs3_android/scripts/NPC.as:241-259`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP."
- **Lane impact:** L-enemies-ai: blockers ① and ② both closed (403 of 495 npcdata rows carry <hp>, range 1–1000); confirms in code the ledger's own surface note that the shipped AI_TIERS hp-150 dummy is the wrong row.

### `[[android-blobs/spider-is-web-only-enemy]]` — UPHELD [A2] (2 critics)

A complete 10-animation SPIDER enemy ships ONLY in the web v0.717 build — engine-known in the web AS3 — and appears nowhere in the Android npcdata, string table or ActionScript, so the Android corpus every survey reads is blind to a whole creature.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin:3,24,503,614,745,909,1357,1566,1755,2106 + reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:480-498`
- **Build:** web v0.717 (absent from android v0.682)
- **KILLS this line:** "Ready: full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. the archer (closed this pass); boss roster; projectile set"
- **Lane impact:** L4 enemies-ai: an enemy outside the ledger's taxonomy, with two entry behaviours (spider_descend = drop-in, spider_dig = burrow, both looping) that no other creature has. The blob's EXISTENCE is already catalogued (docs/gauntlet/L0/journal.md:26 lists spider_idle among the 19 web sets); what is new is that it is web-ONLY, which means the only npcdata we hold carries no spider row, no stats, no AI id and no name — a permanent, now-localised hole.

### `[[bindata/boss-telegraph-triads]]` — UPHELD [A2] (2 critics)

Boss attacks are authored as explicit telegraph / hit / recovery clip triads with exact tick counts, and stagger is an 8-tick flinch clip — the ledger's 'telegraph/active/recovery + stagger frames' blocker.

- **Cite:** `reference/extracted/bindata/100_1t4627s0.bin:901,1223,1325 (ogre); 111_1t4638s0.bin:892,1174,1316 (guardian); 103_1t4630s0.bin:2646,2798 (flinch)`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L-enemies-ai: blocker ③ is dead for the Ogre and Guardian, and the same triad naming (swingdown/swingdownhit/swingdownend, swingup/…, stomp/stomphit/stompend) is structural across creature sets. At 24Hz the Ogre overhead is 0.67s telegraph / 0.21s active / 0.46s recovery. Note the ledger's separately-measured 'hit-stagger 12f' is not directly comparable — the flinch CLIP is 8 ticks; I am not asserting a contradiction without knowing whether 12f was measured at 60Hz.

### `[[bindata/clan-band-tail-holds-seasonal-event-enemies]]` — UPHELD [A2] (2 critics)

The five parallel 100-wide clan bands in npcdata are not perfectly parallel: the 4xx band's tail carries seasonal event enemies (Santa, Blacksmith, Nian Monster, Bear) where the 3xx band carries Heavy Soldiers.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json (npcdata.xml) cross-read with reference/extracted/bindata/119_1t4646s0.bin:440,453,466,479,492,505,518,531,544 + WarHexUI.as:1732-1750`
- **KILLS this line:** "| enemies-ai | 34 | full taxonomy + movesets, boss roster, projectile set | enemy level→stat formula; per-enemy HP; telegraph/stagger frames; aggro/spawn geometry |"
- **Lane impact:** enemies-ai + meta-social. Two consequences the taxonomy work missed: (a) the '495 NPCs' headline overstates roster VARIETY — roughly 285 rows are five re-skins of ~57 archetypes; (b) the game shipped seasonal live-ops enemies (Christmas Santa, Lunar New Year Nian Monster) occupying clan-band slots, which no ledger system records at all.

### `[[bindata/mounted-shield-archer-poses-eggs]]` — UPHELD [A2] (2 critics)

bindata/108 also holds mounted movement on the human rig, a seven-clip shield-user kit with an explicit block pose, the archer's full draw chain, ten authored posing slots, and two shipped easter eggs.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin:8071,13327,24123,24919,26860`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames. ④ aggro/leash/spawn geometry."
- **Lane impact:** enemies-ai (the shielder's holdshield_defend is a distinct BLOCK pose from holdshield_crouch — the pose set for blocker ③ is held even where AI timing is not; the archer's draw chain is exact), world-exploration (mounted_idle/walk/run on the human rig plus the 8-clip horse blob 105 means riding is an animated player state, not just a fast-travel menu), art-anim (two undocumented shipped easter eggs).

### `[[bindata/procedural-name-generator]]` — UPHELD [A2] (2 critics)

NPC and place names are procedurally generated from five payload tables (398 male, 291 female, 33 noble, 36 samurai family, 677 place), and the ledger's two 'omitted bosses' Hachisuka Kano and Honda Shizuka decompose exactly into samurai-surname + given-name from those pools.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin:7 and :11; 94_1t4651s0.bin:80; 97_1t4650s0.bin:226 — Android class names 85_NameGenerator_MaleNames, 86_NameGenerator_NobleFamilyNames, 87_NameGenerator_SamuraiFamilyNames, 88_NameGenerator_FemaleNames, 89_NameGenerator_PlaceNames`
- **KILLS this line:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L-enemies-ai (stop chasing two generated names as authored bosses — Zabuza and Tengu Hotaru are NOT in these pools and remain open) + L-world-exploration (677 verbatim place names answer territory naming for free) + L-quests-story (character rosters may contain generated, not authored, names).

### `[[bindata/six-ledger-names-decompose]]` — UPHELD [A2] (2 critics)

SIX of the ledger's named NPCs decompose from the five bindata name tables, not two — and they exercise all THREE generators, proving getCommonerName, getNobleName and getSamuraiName are all live in the shipped game. Hachisuka Kano = samurai 96:7 + male 94:80. Honda Shizuka = samurai 96:11 + female 97:226. Honda Gin = 96:11 + female 97:38. Hojo Taka = samurai 96:10 + female 97:236. Inokuma Kinkiyo = NOBLE 95:11 + male 94:107 (getNobleName, not getSamuraiName). Niji = bare female 97:170 (getCommonerName). Zabuza, Tengu and Hotaru appear in NONE of the tables, so those are authored npcdata NPCs and must be sourced differently.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin:7,10,11 · 95_1t4649s0.bin:11 · 94_1t4651s0.bin:80,107 · 97_1t4650s0.bin:38,170,226,236 + docs/research/video-study/SYNTHESIS.md:429 + docs/research/REBUILD_READINESS.md:221`
- **Build:** both
- **Lane impact:** L-content: triples the recovered coverage of bindata/procedural-name-generator and separates procedural NPCs from authored ones, which tells the port which names to generate and which to transcribe.

### `[[bindata/spawn-geometry]]` — UPHELD [A2] (2 critics)

Wave spawn geometry is literal in the data: enemies enter 50px off-screen from both sides of a ~1600px arena, at x=-50 and x=1650.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:7 and :12`
- **KILLS this line:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: the spawn-geometry third of blocker ④ is held for war/survival battles, with an implied ~1600px arena width (consistent with traproomdata room widths 800-1400). Aggro radius and leash distance are NOT in bindata — those stay open from this source.

### `[[combat-core/flinch-is-nested-inside-the-iframe-window]]` — UPHELD [A2] (2 critics)

The 8-frame flinch clip and the 12-frame gotHitCounter start on the SAME tick and run on the SAME clock, so the flinch is nested inside the invulnerability window (ticks 0-7 flinch, ticks 0-11 invulnerable). There is no held pose before it and no lockout after it. Any port that plays the flinch after a hold, or that reads 12 = 4 + 8 as a sequence, is wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:39 and :123-125 + MCSCharacter.as:1309-1329 + EnemyZombie.as:522 and :544`
- **Build:** android v0.682 (animation half also confirmed byte-identical in web v0.717 — see the bindata md5 finding)
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 combat-core + art-anim: fixes the shape of the hit reaction that blocker (3) asks for. It also supplies the frame-unit discipline that killed enemies-ai/hit-lockout-decomposes-exactly — game ticks, animation poses (15fps latch) and 60fps video frames are three different clocks and must never be added together.

### `[[enemies-ai/boss-names-are-procgen]]` — UPHELD [A2] (8 critics)

Two of the four 'missing bosses' the ledger flags are not bosses at all — "Hachisuka Kano" and "Honda Shizuka" are procedurally generated bounty-target names assembled from the shipped name tables; "Zabuza" and "Hotaru" appear nowhere in the payload or the 559-class decompile.

- **Cite:** `reference/extracted/android/87_NameGenerator_SamuraiFamilyNames.bin, 85_NameGenerator_MaleNames.bin, 88_NameGenerator_FemaleNames.bin + XMLNpc.as:527,581-594`
- **KILLS this line:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L0 enemies-ai: prevents a real authoring error — a recreation that hard-codes these as named bosses would be wrong. The correct port is a bounty-target generator: random surname + given name wearing NPC 18's statline.

### `[[enemies-ai/boss-rubber-band-hits-to-kill]]` — UPHELD [A2] (2 critics)

Bosses and elites do not use the base level→stat formula at all: 11 subclasses override setLevel, and the boss path solves the statline backwards from a target hit count against the player's LIVE stats — bossHP = playerhit × (10 + lvldiff) and bossATK = playerHP/(18 − lvldiff) + playerDEF, taken as the max against the authored XML row.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyElite.as (setLevel override) + EnemyKanjiGuardian.as:48 + EnemyWolfAlpha.as:52 + EnemyOgre.as:51 + EnemySpearElite.as:32 + EnemyPlayer.as:57 + EnemyStag.as:48 + EnemyTrainingDummy.as:23; web parity at §1t4523s0§.as:77-80`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai blocker ① and cross-lane into combat-core/progression. Variants: KanjiGuardian 5+8+lvldiff / 16−lvldiff; WolfAlpha 15−lvldiff; SpearElite and EnemyPlayer branch on isBoss/isDuelist and fall back to super.setLevel(); EnemyOgre.setLevel is an EMPTY override so the Ogre never rescales; EnemyTrainingDummy repurposes lvl as a tutorial step index (lvl==3 → maxhp = 8). Authored boss <hp> rows are FLOORS, not effective stats — the game is tuned to a number of hits, not to absolute numbers.

### `[[enemies-ai/boss-rubber-band-is-in-the-web-build]]` — UPHELD [A2] (2 critics)

The elite/boss rubber-band level->stat formula is present in the shipped web v0.717 build, not only in android v0.682 — so the enemies-ai blocker closes at the TARGET build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4523s0§.as:77, :83, :84`
- **Build:** web v0.717
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai — src/config/combat-sim.ts:110-113's INFERRED comment can be promoted to CONTRACT (0.717), not merely CONTRACT-SRC (0.682) as the packet's two claims conservatively propose.

### `[[enemies-ai/elite-boss-second-level-formula-rubber-band]]` — UPHELD [A2] (2 critics)

There is a SECOND level->stat formula: EnemyElite.setLevel overrides NPC.setLevel entirely for elites and bosses, dropping the 0.9 factor and the lvl<=10 clamp, using xp = lvl*5+45, and rubber-banding boss HP and ATK off the PLAYER's live stats -- which is the missing A2 source for the repo's INFERRED 'enemyHP = effPlayerDmg x K' derivation.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyElite.as:22-75 (and :105-120); cross-referenced to src/config/combat-sim.ts:110-130`
- **KILLS this line:** "(1) enemy level->stat formula (governs the whole roster's balance -- absent, not just inferred)."
- **Lane impact:** L0 enemies-ai, and the biggest thing this unit missed. Blocker (1) is closed for trash but only half-closed for bosses: there are TWO formulas and the surveyor found one, so the 78 is over-scored on that axis. Boss HP is set so the player needs 10 + lvlDiff hits (floor 3) and boss ATK so the player dies in 18 - lvlDiff hits (floor 1); authored <hp> is only a floor, which qualifies the roster claim. Critically, src/config/combat-sim.ts documents ENEMY_BASE as INFERRED with 'B4 makes hp and minDamage DERIVED at spawn from the player's own stats (enemyHP = effPlayerDmg x K) ... the pre-scale floor the source's max(scaledBase, ...) compares against' -- bossHP = playerhit * hitsToKillBoss IS that formula and if(bossHP > maxhp) IS that max(). K = 10 + (enemyLvl - playerLvl), floored at 3. That INFERRED comment can be promoted to A2, labelled v0.682-ANDROID.

### `[[enemies-ai/flinch-is-8-frames]]` — UPHELD [A2] (2 critics)

The hit reaction the survey called nonexistent is an authored 8-frame interruptible flinch: `flinch` and `flinch_weapon` both d=8, FLINCH_STATE = 28, and NPC.doFlinch() saves prevActionState/prevAnim/prevFrameCounter before playing it so endFlinch() resumes the interrupted animation mid-frame.

- **Cite:** `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin + reference/decompiled/shs3_android/scripts/MCSActor.as:170,172,922 + NPC.as:747-763`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: closes the SECOND half of blocker ③ outright, which the survey wrongly declared unimplementable. Stagger = 8 frames, and the resume-mid-animation behaviour is a feel-critical detail. It also removes cap reason (4) from the 78 score rationale.

### `[[enemies-ai/flinch-is-a-real-8-frame-state]]` — UPHELD [A2] (2 critics)

The stagger the ledger asks for is fully implemented: an 8-frame flinch animation in the Human2 anim blob plus FLINCH_STATE 28 and a doFlinch/endFlinch pair that saves and restores the interrupted animation's frame offset.

- **Cite:** `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin + reference/decompiled/shs3_android/scripts/MCSActor.as:170,172,922 + NPC.as:747-765`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: blocker ③ is now dead in BOTH halves, not just the telegraph half. The surveyor searched only 99_MCSCharacter_HumanAnimationData.bin and concluded absence; the flinch is in the Human2 blob. Note the mechanic for the port: flinch does NOT interrupt SLASH_STATE (an attack in progress is armoured), and it resumes the prior animation at the exact frame it was cut off.

### `[[enemies-ai/flinch-is-build-parity-confirmed-in-web-v0717]]` — UPHELD [A2] (2 critics)

The FLINCH mechanism is not android-only: the web v0.717 payload carries the identical save-and-restore flinch state machine and the same 8-frame authored clip, so the S0-3 android-parity hedge lifts for this mechanism specifically.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:769-786 + §1t99s0§.as:4679-4703 + §1t1544s0§.as:170,172 + reference/extracted/bindata/103_1t4630s0.bin`
- **Build:** both
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** enemies-ai + art-anim: the stagger half of blocker ③ closes at the TARGET build, not just at v0.682. Port from the web constants.

### `[[enemies-ai/flinch-state-exists]]` — UPHELD [A2] (2 critics)

The stagger mechanic blocker ③ asks for is fully implemented: FLINCH_STATE (id 28) with a base-class doFlinch/endFlinch pair that saves and restores animation + frameCounter, driving an authored 8-frame flinch / flinch_weapon animation — a mechanism entirely separate from the 12-frame gotHitCounter i-frame lockout.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:747-764 + MCSActor.as:922,170,172 + reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin + EnemyZombie.as:544 + EnemyShield.as:117-119 + MCSPlayer.as:4309-4326`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: blocker ③'s stagger half is CLOSED, not absent, and the survey's score cap built on 'a counter with no stagger animation' must be dropped. The port is: on hit, save actionState/anim/frameCounter, enter FLINCH_STATE, play flinch_weapon (8 frames), then restore the exact prior frame. It is guard-interrupted by SLASH_STATE and SKILL_CHICHARGE_STATE (NPC.as:749, MCSPlayer.as:4311) and stacks on top of, not instead of, the 12-frame gotHitCounter i-frame window. Note the animation lives in the 94_Human2 blob, not the 99_Human blob the survey searched.

### `[[enemies-ai/nameplate-colour-is-five-valued]]` — UPHELD [A2] (2 critics)

The nameplate colour rule is five-valued, not the two the claim adds, and gold does not mean 'player' — it means player OR friendly.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:1533 + MCSPlayer.as:245 + FriendlyElite.as:64 + FriendlyArcher.as:57 + Obj_NPCAggro.as:76,79 + EnemyPlayer.as:83,771,774,880 + EnemyClone.as:81,85 + Obj_NPCProcGen.as:51,60`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: the single ledger bullet flattens FIVE states, not two. A recreation shipping only hostile-red / player-gold gets the friendly, neutral-procgen and quest-marker nameplates wrong — and the quest-marker colour is one of only two overworld quest indicators.

### `[[enemies-ai/nameplate-is-a-spawner-split-with-hex-colours]]` — UPHELD [A2] (2 critics)

The overworld-vs-combat enemy readout is not a HUD mode switch but two spawner wrappers, and every nameplate colour is an exact literal: Obj_NPCAggro hides the health bar and paints NAME (lvl) in 0x990000 dark red; the player gets a bare charname in 0xFFCC00 gold with no level; friendlies share the gold, name-only; elites, guardians and duel opponents use 0xFFFFFF white WITH a level; procgen townsfolk use 0x0099FF and 0xC0AC4B.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:73,76,80 + MCSPlayer.as:245 + FriendlyArcher.as:57 / FriendlySpearElite.as:55 / FriendlyElite.as:64 + EnemyElite.as:114 + EnemyKanjiGuardian.as:59 + Obj_NPCProcGen.as:51,60 + MCSCharacter.as:258,1533`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: supersedes the survey's mode-switch claim with the real mechanism and turns an A1-only colour observation into exact hex CONTRACT values. Both cited frames corroborate it: seg-10/frame_0013 overworld shows red plates and ZERO health bars (Obj_NPCAggro calls hideHealthBar first), seg-11/frame_0020 combat shows health bars and zero plates. A recreation must NOT suppress nameplates in combat -- elites and guardians keep a white NAME (lvl).

### `[[enemies-ai/npcs-run-on-skilldata]]` — UPHELD [A2] (2 critics)

Enemy AI is driven by skilldata: NPCs pull their per-skill cooldowns from this file via getSkillData().getCooldown(), and their usage policy is four hard-coded range buckets containing the category-11 skills that appear in no player tree.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:825-829, :30/:32/:34/:36, :1079; EnemyElite.as:197-203; reference/extracted/skilldata.xml:1842-1847 (skill 1068)`
- **KILLS this line:** "① enemy level→stat formula… absent"
- **Lane impact:** L4 enemies-ai — the level->stat half is npcdata's to close, but the MOVESET + per-skill cooldown half is already held in skilldata (bucket sizes: veryClose 16, close 13, mid 22, long 16). Category 11's Back Throw / Air Stab / Bull Charge / Punch Lunge / Undying are enemy-only and appear in no ledger system.

### `[[enemies-ai/per-enemy-hp]]` — UPHELD [A2] (8 critics)

Per-enemy HP is fully authored: 403 <hp> rows spanning 1..1000, alongside 406 <attack> and 394 <defense> rows.

- **Cite:** `reference/extracted/npcdata.xml:3121-3128 (index: docs/gauntlet/L0/index/npcdata.json, npcdata/npc/hp count 403, range [1.0, 1000.0])`
- **KILLS this line:** "② per-enemy HP."
- **Lane impact:** L0 enemies-ai: kills blocker ②. Measured HP histogram top: 1×42, 15×32, 30×26, 10×23, 40×19, 20×13, 150×11.

### `[[enemies-ai/setlevel-has-11-overrides]]` — UPHELD [A2] (2 critics)

NPC.setLevel() is the trash-mob curve only: 11 classes override it, EnemyOgre's override is EMPTY (the Ogre never scales, which is why id 77 ships lvl 80 with hp 40), and the elite/boss/alpha branch drops both the x0.9 and the <=10 clamp and uses xp = lvl*5 + 45 plus a player-relative hitsToKillBoss re-derivation.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyOgre.as:51-53, EnemyKanjiGuardian.as:48-59, EnemyElite.as:23-40, EnemyWolfAlpha.as:52+ (11 files total via grep -l "override public function setLevel")`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai + progression: blocker ① needs TWO formulas plus an opt-out, not one. Shipping only NPC.setLevel() would clamp every boss below level 11 to 1/1/1 HP and give every elite the wrong XP award. This is the correct reason to cap the re-score, replacing the survey's refuted stagger caveat.

### `[[enemies-ai/setlevel-is-eleven-formulas]]` — UPHELD [A2] (2 critics)

There is no single enemy level→stat formula: NPC.setLevel is overridden in 11 subclasses, and the elite/boss family does not scale off its own statline at all — it inverse-solves HP and damage from the LIVE player's stats via hitsToKillBoss = 10 + lvldiff and hitsToKillPlayer = 18 - lvldiff.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyElite.as:23-52 (plus EnemyOgre.as:51-53, EnemyWolfAlpha.as:52-78, EnemyPlayer.as:57-86, EnemySpearElite.as:32-78, EnemyTrainingDummy.as:23-47, EnemyKanjiGuardian.as:48, EnemyStag.as:48-70, FriendlyArcher.as:21, FriendlyElite.as:23, FriendlySpearElite.as:19)`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: blocker ① dies, but as >=5 distinct formulas rather than one, and it drags in a system the board has never scoped — a live-player-relative boss balancer. Field trash uses NPC.setLevel (×0.9 sub-21, 1/1/1 clamp at lvl<=10, xp lvl*2+20); the Oni ignores level entirely; the training dummy's setLevel is a tutorial script; every Elite/Boss/duelist derives its numbers from the player's current MAXHP/DEFENSE/damage at spawn. A recreation that ports only NPC.setLevel gets 100% of bosses wrong. It also means ENEMY_BASE.hp = 1 is retro-justified for TRASH ONLY.

### `[[enemies-ai/setlevel-is-twelve-formulas]]` — UPHELD [A2] (2 critics)

Enemy level scaling is not one formula but twelve: NPC.setLevel is overridden by eleven subclasses, EnemyOgre's override is EMPTY (ogres never level-scale), EnemyPlayer / EnemyElite / EnemyKanjiGuardian drop both the x0.9 sub-21 factor and the 1/1/1 clamp and pay xp = lvl*5 + 45, and the elite/boss variants additionally run a player-relative autobalance (hitsToKillBoss = 8 or 10 or 13 + lvldiff, hitsToKillPlayer = 16 - lvldiff) that rewrites minDamage and maxhp against the live player's stats.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:57-100, EnemyElite.as:23-40, EnemyKanjiGuardian.as:48-65, EnemyOgre.as:51-53, EnemyWolfAlpha.as:52-70 (plus EnemySpearElite.as:32, EnemyStag.as:48, EnemyTrainingDummy.as:23, FriendlyArcher.as:21, FriendlyElite.as:23, FriendlySpearElite.as:19)`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: blocker ① is advanced but NOT dead, and the shape is different from what the surveyor banked. A recreation needs a scaling POLICY per AI class (base / player-mirror / elite-with-autobalance / none), not one function. The empty EnemyOgre override plus the fact that ai 9 (73 of 425 npcdata rows, the largest bucket) skips the clamp means the '1-HP field trash' story cannot be sourced to this code — it has to come back from the frames.

### `[[enemies-ai/shipped-config-hp150-is-stale]]` — UPHELD [A3] (8 critics)

The ledger's Surface bullet that the shipped ENEMY_BASE is a PvP-duel dummy at hp 150 was true when written (2026-07-20) and is false now — the 150 was removed in commit 335e615 on 2026-07-26 and ENEMY_BASE.hp is 1, asserted green in the suite.

- **Cite:** `tests/config-values.test.ts (57 passed) + tests/enemyModel.test.ts (14 passed); assertion at tests/config-values.test.ts:466-474`
- **KILLS this line:** "the shipped AITIERS/ENEMYBASE are a PvP-duel dummy (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L0 enemies-ai: the Surface bullet is stale on both halves — the hp 150 is gone, and 'every PvE number lives only in notes' is refuted by 403 hp / 406 attack / 394 defense rows. The code comment that guessed at the 1 now has its source: NPC.as:253 clamps to 1 below level 11.

### `[[enemies-ai/spawn-geometry]]` — UPHELD [A2] (8 critics)

Spawn geometry is fully authored: 118 <wave> blocks carrying 160 <x> spawn coordinates (range -400..2000), 171 <lvl> overrides (1..80), 75 <fatal> flags, 169 <enemy> / 70 <friend> / 2 <neutral>; the spawn rule is wave 0 on the ground and waves 1+ dropping in from above at posY - random*200, with the next wave gated on every enemy in enemyList being dead.

- **Cite:** `reference/extracted/questdata.xml:77-88 + reference/decompiled/shs3_android/scripts/NPCManager.as:300-320,374-412`
- **KILLS this line:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: kills the spawn half of blocker ④, so ④ is dead in both halves. Also explains the FALL_STATE→LAND_STATE branch every Enemy class opens with (EnemyArcher.as:49-52 catches ENEMYLAND).

### `[[enemies-ai/tengu-absent-from-resolved-strings]]` — UPHELD [A2] (2 critics)

Tengu is absent from the RESOLVED string table as well as the raw XML, which closes the 'it is hidden behind a numeric id' escape hatch that a raw-XML grep alone leaves open.

- **Cite:** `grep -ic tengu over docs/gauntlet/L0/index/strings.json and docs/gauntlet/L0/index/resolved_names.json -> 0 and 0`
- **KILLS this line:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)"
- **Lane impact:** L0 enemies-ai: the Ready-taxonomy bullet over-claims an entire faction, and this closes the last defence of it. Either a v0.717-only addition or a ledger invention. Do not build a Tengu.

### `[[enemies-ai/tengu-is-not-in-the-payload]]` — UPHELD [A2] (8 critics)

"Tengu", listed in the ledger's Ready taxonomy, greps to zero across payload.xml, questdata.xml, npcdata.xml, itemdata.xml, skilldata.xml, ui_strings.txt and the entire Android script tree. "Guardian" is held.

- **Cite:** `grep -c -i "tengu" over reference/extracted/*.xml + ui_strings.txt → 0 each; Guardian at reference/decompiled/shs3_android/scripts/NPCManager.as:628 and reference/extracted/npcdata.xml:4111`
- **KILLS this line:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)"
- **Lane impact:** L0 enemies-ai: Guardian HELD, Tengu STILL_UNHELD. The Ready bullet over-claims one whole faction — either a v0.717-only addition or a ledger invention. This is one of the four things capping the re-score.

### `[[enemies-ai/undead-rule-is-not-reflect]]` — UPHELD [A2] (8 critics)

The Undead blocker is wrong in kind, not merely unmeasured: grep 'reflect' over all 559 Android classes returns zero hits. The actual Undead-specific rule is a head-gate — a zombie takes HALF damage unless the hit lands on hat/head/neck — inverting the base class, which instead rewards a behead with ×1.5. JiangSi uses the standard ×1.5 and does not halve.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:493-518 (contrast NPC.as:451-453 and EnemyJiangSi.as:308-311)`
- **KILLS this line:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: kills the undead half of blocker ⑤ by refuting its premise. There is no reflect mechanic and therefore no reflect probability to measure — planning a measurement pass for it would have been wasted work.

### `[[enemies-ai/web-arrow-dual-gravity]]` — UPHELD [A2] (2 critics)

In the shipped web v0.717 build knockdown arrows fly on HALF gravity (1.5) while normal arrows use 3 — the launch roll happens before the ballistic solve and feeds it — whereas the Android v0.682 decompile every cited number came from has a single unconditional GRAVITY.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4542s0§.as:275-305 + §1t137s0§.as:64-71 + §1t128s0§.as:8; contrast reference/decompiled/shs3_android/scripts/ArrowProjectile.as:55-56`
- **KILLS this line:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: blocker ⑤'s arrow half is closed, but with a version-specific answer. Porting a fixed GRAVITY=3 is wrong on exactly the arrows the player is meant to read and dodge. This is also the first CONCRETE v0.682-vs-v0.717 behavioural difference found, which turns 'build parity is an unknown risk' into 'build parity is a known, enumerable diff'.

### `[[npcdata/ai-profile-table]]` — UPHELD [A2] (2 critics)

A 34-profile AI archetype assignment table is held: 425 NPCs carry <ai> spanning ids 1–37 with 10, 15 and 16 never used, five generic soldier profiles (ai1–ai5), an elite profile (ai9, ×73), one-off creature profiles (Wolf/Horse/Bear/Boar/Deer/Stag/Oni/Fox), and boss-unique profiles ai29–ai37.

- **Cite:** `reference/extracted/npcdata.xml:27 (npc 1) and 424 sibling <ai> rows; distribution re-derived first-hand, sums to 425 matching docs/gauntlet/L0/index/npcdata.json`
- **KILLS this line:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: blocker ④ HALF closed — which behaviour each of 425 NPCs runs is now a table, not a guess. PARTIAL and deliberately so: <ai> is an index only; the behaviour bodies (aggro radius, leash, spawn geometry) are in the AS3 bundles and remain STILL_UNHELD from this file.

### `[[npcdata/enemy-skill-loadouts]]` — UPHELD [A2] (2 critics)

Enemy movesets are a per-NPC, per-rank data table, not notes: 96 NPCs carry 647 <skill> rows using 39 distinct skill ids drawn from the SAME pool as the player, with individually authored boss loadouts (Gojo Takamori carries Shunpo, Heavenly Sword@3, Spirit Thief and "Undying"; Aboshi carries Smoke Bomb@2, Substitution Jutsu@2 and Shadow Clone).

- **Cite:** `reference/extracted/npcdata.xml:535 (npc 17), :3898 (npc 188 Magoichi), :3934 (npc 190 Gojo Takamori), :3662 (npc 175 Aboshi), :3436 (npc 164 Fumio)`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L-enemies-ai: the 'taxonomy + movesets from notes' framing is replaced by an authored table (blocker ③'s frame-timing half is still STILL_UNHELD — npcdata carries no timing field of any kind). L-skills-meters blocker ②: Shunpo is real, is skill 1039, is carried by 6 NPCs, and its description is held verbatim — "Ultimate Light Stance technique. Hold down the skill icon to increase the damage it inflicts. This skill can only be used when in Light Stance."

### `[[npcdata/five-stances-are-in-the-web-build-too]]` — UPHELD [A2] (3 critics)

The five-stance dispatch is NOT android-only. The same getMastery(1500) -> REVERSED / getMastery(1501) -> DUAL branch exists in the WEB v0.717 payload in three classes, so the packet's five-stance finding carries no build-parity caveat and its 'android v0.682' build label understates it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4907s0§.as:157, §1t4906s0§.as:90 and §1t122s0§.as:862; android original at reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:160-167`
- **Build:** both
- **KILLS this line:** "Stance system = 3 stances (light / balanced / heavy)"
- **Lane impact:** Removes the S0-3 build-parity hedge from npcdata/five-stances-reversed-and-dual. src/config/stances.ts:7 (`export type StanceId = 'light' | 'balanced' | 'heavy'`) is short two states in the target build, not merely in the Android port.

### `[[npcdata/five-stances-reversed-and-dual]]` — UPHELD [A2] (2 critics)

Skills 1500 and 1501 are not merely unnamed enemy-only entries — they are two additional STANCES. EnemyElite.init dispatches getMastery(1500) > 0 to setStance(REVERSED_STANCE) and getMastery(1501) > 0 to setStance(DUAL_STANCE), with the same dispatch in EnemyPlayer and FriendlyElite, and the build ships dedicated animation payloads for both. The shipped game therefore has FIVE stances (light, balanced, heavy, reversed, dual), not three. Carriers in npcdata: 1500 -> Aboshi (:3662) and Magoichi (:3898); 1501 -> Gojo Takamori (:3934 and :3956).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:160-167; same dispatch at EnemyPlayer.as:836-840 and FriendlyElite.as:83-87; art at reference/extracted/android/95_MCSCharacter_ReversedStanceAnimationData.bin and 101_MCSCharacter_DualStanceAnimationData.bin; carriers at reference/extracted/npcdata.xml:3662, :3898, :3934, :3956`
- **Build:** android v0.682
- **KILLS this line:** "Stance system = 3 stances (light / balanced / heavy)"
- **Lane impact:** Any stance model with three states is short two. Reversed and Dual are enemy-only (no string-table name, empty chi/cooldown in skilldata) but ship full animation blobs alongside 108_LightStance, 97_BalancedStance and 106_HeavyStance — so they are renderable, not vestigial. This upgrades the packet's npcdata/boss-movesets hedge ('implying five stance masteries') from an inference to a held fact.

### `[[npcdata/friendly-npcs]]` — UPHELD [A2] (2 critics)

Twelve npcdata rows use ally AI ids (30 FriendlyElite, 31 FriendlySpearElite, 34 FriendlyArcher) — named campaign allies who fight beside the player, an actor category the ledger's enemies-ai section never mentions.

- **Cite:** `reference/extracted/npcdata.xml:3365 (Satoshi), :3424 (Fumio), :4021 and :4256 (Mitsuo), :3760 (Hachimaru), :3777 (Shou), :4313 (Scout), :2418 (Old Guard), :3506 (Yuudai); classes at NPCManager.as:608-622`
- **KILLS this line:** "- Ready: full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. the archer (closed this pass); boss roster; projectile set (arrows arc, oni rocks, bandit hammer); independent-aggro (no coordination — closed); nameplate (N)=level."
- **Lane impact:** enemies-ai + quests-story — the 'full taxonomy' is not full: it omits allied combatants entirely, which changes escort-quest design and the combat sim's faction model.

### `[[npcdata/hp-less-combat-rows-default-to-1]]` — UPHELD [A2] (2 critics)

XMLNpc defaults hp to 1 whenever the <hp> element is absent. Combined with the census behind my refutation of npcdata/per-enemy-hp, that means 22 combat-<ai> NPCs — including bosses Gojo Takamori (ai29 EnemyElite, 14-skill loadout with Undying) and Magoichi — reach the parser at 1 HP, and they carry no <lvl> either, so NPC.setLevel may never fire with a real level for them. Where their real HP and level come from at spawn is not established by anything I opened.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:143-149; hp-less combat rows at reference/extracted/npcdata.xml blocks 3365, 3424, 3760, 3777, 3863, 3884, 3917, 3939, 4021, 4256, 4275, 4293`
- **Build:** android v0.682
- **KILLS this line:** "per-enemy HP authored for all combat NPCs"
- **Lane impact:** A live blocker the packet's per-enemy-hp claim was hiding behind 'the 92 hp-less rows are non-combat NPCs'. Twelve of them carry full <skills> loadouts. Closing it needs the quest/wave spawn path (QuestEngine / NPCManager.createNPC callers) to show what lvl and hp these rows are handed.

### `[[npcdata/level-stat-formula]]` — UPHELD [A2] (2 critics)

The enemy level→stat formula the ledger calls "absent, not just inferred" is authored in the payload and reproduces exactly: for lvl 11–40 hp=ceil(2.5·lvl) and attack=defense=ceil(2.4·lvl); for lvl 45–60 hp=attack=ceil(2.5·lvl) and defense=ceil(2.8·lvl); for lvl 70 all three = 2.5·lvl; lvl 1–5 hp is pinned to 1 with attack=defense=lvl, and lvl 6–10 has hp=attack=defense=lvl.

- **Cite:** `reference/extracted/npcdata.xml — <npc> blocks starting at lines 4665 (npc 212), 4861 (npc 223), 5298 (npc 247), 5317 (npc 248), 5392 (npc 252); fields at block-start+3…+6`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L-enemies-ai: blocker ① CLOSED outright; the score of 34 is wrong, not merely stale. Also L-progression: this 2.4/2.5/2.8-per-level shape is the only observed stat-vs-level transfer function anywhere in the payload, and is a candidate answer to progression blocker ① (DEF/SPD transfer functions).

### `[[npcdata/spawn-level-comes-from-the-quest-wave]]` — UPHELD [A2] (2 critics)

The open question behind the packet's hp-less-combat-rows claim is answerable and I answered it. Spawn level for combat NPCs comes from the QUEST WAVE, not from npcdata. NPCManager.as:110-131 reads wave[i].enemy[j].lvl into new NPCHolder(id,fatal,xpos,lvl); :407/411/433/437 pass npcHolder.getLvl() into createEnemy/createObjective, which call actor.setLevel(lvl) when lvl != 0 (:877-879, :931-934). 160 of the 169 <enemy> blocks in questdata.xml carry <lvl>. Concretely: Gojo Takamori npc 190 spawns at lvl 25 (questdata.xml:26101 id, :26105 lvl) and npc 191 at 35 (:25862 / :25866); Magoichi npc 188 at 35, npc 810 at 27. Friendlies never need one — FriendlyElite.as:70 and FriendlyArcher.as:58 call setLevel(StatsManager.getLevel()), so allies scale to the player, and 7 of the 12 skill-carrying hp-less rows are ai 30 / ai 34 = FriendlyElite / FriendlyArcher (NPCManager.as:608-621). NPC.setLevel at :239-259 then rescales damage, defense and maxhp by lvl/level and hard-clamps all three to 1 when lvl <= 10.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:110-131, :407, :877-879, :931-934 and NPC.as:239-259, FriendlyElite.as:70, FriendlyArcher.as:58; reference/extracted/questdata.xml:26101 and :26105 (npc 190 at <lvl>25</lvl>), :25862 and :25866 (npc 191 at <lvl>35</lvl>)`
- **Build:** android v0.682
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP."
- **Lane impact:** L8 enemies-ai — the level→stat transfer function is NOT absent: it is NPC.setLevel's factor = lvl/level (x0.9 below level 21), applied to damage, defense and maxhp, plus EnemyElite.init's boss/level bands (x1.4 above 70, x1.3 above 50, x1.2 above 30, x0.8 below 10). Combined with the quest-wave <lvl> rows this closes the spawn side of blocker ② for the 22 hp-less combat NPCs and gives blocker ① a real formula to test.

### `[[questdata/archer-ai-firing-rule-and-gravity]]` — UPHELD [A2] (2 critics)

The live archer AI firing rule and the global projectile gravity constant are both held, closing the ledger's 'arrow arc physics' item outright. Projectile.GRAVITY = 3 (px/frame^2), applied as velY += GRAVITY every update. EnemyArcher.fireArrow() fires from (mcs.x, mcs.y-60) at a target sampled at (target.mcs.x, target.mcs.y-60), solving a fixed-45-degree-ish ballistic: velA = sqrt(GRAVITY*|dx|/0.866), velXa = velA*0.866, t = |dx|/velXa, velYa = (dy - 0.5*GRAVITY*t*t)/t, sign-flipped when firing left, then a uniform aim jitter velYa += Math.random()*8 - 4. Above level 50 a coin flip sets Damage.LAUNCH_KNOCKDOWN on the arrow. EnemyGoblinThrower uses the identical solve; EnemyKanjiGuardian divides by 0.866/3 for a flatter arc.

- **Cite:** `reference/decompiled/shs3_android/scripts/Projectile.as:8, ArrowProjectile.as:56, EnemyArcher.as:271, :277, :281, :286, EnemyGoblinThrower.as:555, EnemyKanjiGuardian.as:464`
- **Build:** android v0.682
- **KILLS this line:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L7 enemies-ai blocker ⑤ ('arrow arc physics') closes. L1 combat-core gains a hard gravity constant for every ballistic projectile. Directly refutes the stated honest-limit in questdata/projectile-launch-params.

### `[[questdata/generated-npc-names]]` — UPHELD [A1] (2 critics)

Ambient overworld NPC names are procedurally generated by pairing a family-name table with a given-name table, so the ledger's demand for boss-table entries for 'Hachisuka Kano' and 'Honda Shizuka' is an OVER-CLAIM — both decompose into shipped generator tables and are not authored bosses.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-24/frames/frame_0003.jpg (1024x576, read full-frame; NPC caption at ~x310-420, y330-345), decomposed against reference/extracted/android/86_NameGenerator_NobleFamilyNames.bin:5, 85_NameGenerator_MaleNames.bin:267 / :80, 87_NameGenerator_SamuraiFamilyNames.bin:7 / :11, 88_NameGenerator_FemaleNames.bin:226`
- **KILLS this line:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L7 enemies-ai: remove Hachisuka Kano and Honda Shizuka from the blocker list — they are runtime-generated, not authored (Zabuza and Tengu Hotaru do NOT decompose and stay open). L12 meta-social: PvP/bounty opponent naming is a 5-table generator (397 male / 290 female / 32 noble / 35 samurai / 676 place). Corroborated by only 16 of 535 nodes in 112_Mobile_NodeData.bin carrying an authored <name>.

### `[[questdata/wave-encounter-table-and-pipe-grammar]]` — UPHELD [A2] (2 critics)

questdata carries a complete combat-encounter table nobody in the packet decoded: 118 <wave> blocks holding 169 <enemy> entries across 36 distinct id specs. The <id> field uses a pipe-delimited random-pick grammar - '19|20|21|22|23|24' (74 uses) picks one of six Soldier variants, '40|41|42|43|44|45' Cultists, '11|12|13|14|15|16' Bandits, '86' (24 uses) Undead, '151' the named boss Jinbei. <lvl> spans 2..35 and <qty> 1..10. Four waves carry <endless>1</endless>. 70 <friend> blocks spawn allied NPCs inside waves, each with <fatal>0</fatal> (a per-ally death flag, always 0 in shipped content).

- **Cite:** `reference/extracted/questdata.xml:11713-11720 (wave with <id>86</id><qty>10</qty><lvl>18</lvl> and <endless>1</endless>), :77, :217, :229 (first waves), :11719, :18120, :25350, :26107 (the four <endless>); ids resolved via docs/gauntlet/L0/index/resolved_names.json npcdata.xml resolved["86"]='Undead', ["19"]='Soldier', ["40"]='Cultist', ["11"]='Bandit', ["151"]='Jinbei'`
- **Build:** web v0.717
- **Lane impact:** L7 enemies-ai gains 118 authored encounters with exact rosters, levels and counts - a ready-made encounter ladder. L2/L3 gain a real level curve reference (waves span lvl 2..35 across the campaign). The pipe grammar also means npcdata ids come in variant runs of 5-7, which the enemy-roster models should mirror.

### `[[ui-hud/v0717-duel-nameplate-has-no-level]]` — UPHELD [A1] (2 critics)

In the shipped web v0.717 build a duel opponent's nameplate is WHITE with NO level suffix — 'FUKUSHIMA CHIKO', not 'FUKUSHIMA CHIKO (N)'. Every android v0.682 white-plate call site formats a level in. The ledger's 'nameplate (N)=level' is right for overworld aggro plates (BANDIT (4), same corpus) and WRONG for web duel plates. THE FRAME WINS.

- **Cite:** `reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (1920x1080), crop (520,580)-(840,650) LANCZOS x4; contrast reference/decompiled/shs3_android/scripts/EnemyPlayer.as:776 and :881, EnemyElite.as:114, EnemyKanjiGuardian.as:59`
- **Build:** web v0.717 frame vs android v0.682 decompile
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: kills the '(lvl)' clause in three of this packet's four nameplate claims for the web target, and gives the format rule a build split — red overworld plates carry the level, white duel plates do not. A recreation that appends '(N)' to a duel opponent's plate is visibly wrong against film.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[NF-38-cases-35-classes]]` — NOT-UPHELD [A2] (2 critics)

The ai switch has 38 case arms but only 35 DISTINCT actor classes: EnemyPlayer serves ai 0/9/14 via (isDuelist, isBoss) flags and EnemySpearElite serves ai 28/37. Consequence: ai 9 — the single most common elite profile, 73 NPCs — runs the PLAYER rig, which is why exactly those 73 rows carry the full stance-mastery kit.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:516-634 (all 38 arms parsed) and EnemyPlayer.as:40`
- **Build:** both
- **Lane impact:** L-enemies-ai: read 35 class files, not 38, and treat ai 0/9/14 as one class with two booleans. It also explains claim 5's '73 NPCs share the standard elite kit' — those are exactly the ai 9 rows.

### `[[NF-ai0-duel-opponent-absent]]` — NOT-UPHELD [A2] (2 critics)

ai 0 — the DUEL opponent, new EnemyPlayer(mcs, isDuelist=true, isBoss=false) — has ZERO npcdata rows, and BOTH packet claims about the ai enum silently drop it (claim 3 scopes to '1-37', claim 4 lists only 10/15/16). The entire Duels roster lives outside npcdata: it is built by XMLNpc.initDuelist() from an equipment string plus a stats string. For a project recreating Duels this is the most consequential absence in this file.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:517-519, XMLNpc.as:36, :346-365 and :703-712; unused-ai census over reference/extracted/npcdata.xml`
- **Build:** both
- **aimed at this line, which SURVIVES:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai + L-combat-core: stop looking for the duel opponent in npcdata. It is a paperdoll-string + stats-string construction, which is also why packet claim 8's damage math sits on initDuelist().

### `[[NF-four-faction-spawn-model]]` — NOT-UPHELD [A2] (2 critics)

The spawn layer is a FOUR-faction model, not two, and objective NPCs change faction by quest action type — a combat-sim faction model no ledger system carries. There is also a separate network-player spawn path.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:869-937 and :939`
- **Build:** both
- **aimed at this line, which SURVIVES:** "Ready: full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. the archer; boss roster; independent-aggro (no coordination — closed)."
- **Lane impact:** L-enemies-ai + L-quests-story: escort/assassinate quest design needs all four lists. Also note setLevel is applied only when a spawn passes lvl != 0, so npcdata's authored lvl/hp is a BASE the wave data rescales.

### `[[enemies-ai/eight-death-animations-by-killing-blow]]` — NOT-UPHELD [A2] (2 critics)

The death system is eight distinct animations keyed to how the killing blow landed -- cut in half, beheaded, disarmed, arrow-killed -- not the single deathdowned the surveyor reported.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (my grep of <anim i="(got|downed|death)..." d="..."> tags)`
- **aimed at this line, which SURVIVES:** "(3) telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim-audio-feel. The render-side partner of the behead damage *= 1.5 rule (claim 12) and the archer knockdown gate (claim 11): the game selects a dismemberment-specific death by how the fighter died. Blocker (3)'s 'stagger' half resolves as no-stagger-but-eight-deaths, which is a much richer answer than the claim's single deathdowned 7 and directly shapes what the recreation must animate.

### `[[enemies-ai/gothitcounter-is-iframes]]` — NOT-UPHELD [A2] (2 critics)

gotHitCounter = 12 is invulnerability, not an action lockout: canHit() is called only from NPCManager's hit-detection, so the counter gates whether the enemy CAN BE HIT for 12 frames.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:296-299 + every call site: NPCManager.as:1222,1263,1325,1414,1434,1454,1494,1513,1534,1564,1579`
- **aimed at this line, which SURVIVES:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + combat-core: the 12 frames are i-frames, so the ledger's 'stagger' question is genuinely STILL_UNHELD - the source implements no hit-reaction at all, neither a stagger animation nor an action lock. A recreation that locks the enemy out of acting for 12 frames is wrong.

### `[[enemies-ai/shielder-prop-block-is-a-second-block-mechanic]]` — NOT-UPHELD [A2] (2 critics)

A second, richer block-like mechanic exists and is the shielder's defining behaviour: a blade that lands on the shield (PART_prop) deals zero damage, still sets the hit flag, grants a DOUBLED 24-frame invulnerability window, and plays a metal-clang SFX.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:323-343 (key lines :331-340) + EnemyOgre.as:333 + EnemyJiangSi.as:294 + EnemyNianMonster.as:374 + EnemyWolfAlpha.as:470 + CutsceneActor.as:303`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "COUNTERBONUS | ❌ NOT FOUND — there is no counter/parry/riposte mechanic at all."
- **Lane impact:** combat-core + enemies-ai: SOURCE_CONSTANTS.md:258's 'no block at all' needs qualifying. There is no TIMED block, but there is a geometric one with two distinct outcomes (weapon whiff vs shield clang), and the shield case is the one with an audible tell and a doubled i-frame window. It also gives the clang SFX the packet went looking for.

### `[[ui-hud/nameplate-level-suffix-is-gated-on-level-greater-than-zero-web-only]]` — NOT-UPHELD [A2] (3 critics)

The real web v0.717 nameplate rule, which the packet's nameplate finding states as a colour split. 1t122s0.as (the web EnemyPlayer) has an if/else at every plate write: :92-99, :802-809, :917/:921 and :1418/:1422, all of the form `if(level > 0 && !this.1t4895s0()) { name + " (" + level + ")" } else { name }`. Android v0.682 EnemyPlayer.as:84, :776 and :881 have NO else branch - they always format the level in. Meanwhile the RED overworld aggro plate carries the same lvl==0 split in BOTH builds (1t8638s0.as:79-86 / Obj_NPCAggro.as:74-81). So the rule is 'append (N) iff level > 0', not 'red carries it, white does not', and the change is a v0.717 addition on the duelist/boss path only. 1t4895s0 (:1763-1766) is a spectator-mode predicate, not a level predicate.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:82-99,:794-809,:915-921,:1413-1422,:1763-1771 + reference/decompiled/shs3_android/scripts/EnemyPlayer.as:78-90,:766-777,:879-882 + reference/decompiled/shs3_payload/scripts/§1t8638s0§.as:79-86 + reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:73-81`
- **Build:** web v0.717 vs android v0.682
- **aimed at this line, which SURVIVES:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: RR:219's blanket rule is wrong, but so is the colour-based replacement in the packet. Code it as `suffix = level > 0 ? " (" + level + ")" : ""` and it matches both the FUKUSHIMA CHIKO frame and every red BANDIT (4) plate in the same corpus.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NF-D/survival-mode-is-in-the-web-build-but-its-last-seven-waves-differ]]` — UPHELD [A2] (1 critic)

Survival mode — the game mode S0-1 flags as absent from all 12 ledger systems — IS in the web v0.717 payload with its authored content: 39 <wave>, 87 <enemy>, spawn-x histogram {-50: 49, 1650: 37, -1650: 1}. It is NOT byte-identical to the android blob (11,721 B vs 11,553 B, different md5) and waves 33-39 are differently authored: android spawns '449|454' / '450|455' / '451|456' where the web build spawns '449|454|449|454|443' / '450|455|450|455|443' / '451|456|451|456|443', adding enemy id 443 to every late pool and reweighting the base pair from 1/2 to 2/5 each. Waves 1-32 are identical. The spawn x values sit just off both edges of XMLBG's contentWidth = 1600.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both parsed and diffed wave-by-wave) + reference/decompiled/shs3_android_payload/scripts/XMLBG.as:14`
- **Build:** both (content diverges)
- **KILLS this line:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: the mode can be specified from the TARGET build's own wave table — and anyone who ports the android blob ships the wrong late-game enemy mix.

### `[[NF-string-5017-empty-by-design]]` — UPHELD [A2] (1 critic)

String 5017 is NOT missing from the EN table — it is present with a deliberately EMPTY <source>, one of 21 empty-source trans-units. NPCs 50-55 are nameless by design (blank nameplate), not a data gap.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin — decoded UTF-16LE, lines 4162-4164`
- **Build:** android v0.682
- **Lane impact:** L-art-anim + L-enemies-ai: closes the one 'unresolved NPC name' in the file. A recreation must render these six townsfolk with NO nameplate. Note the S0 UTF-16LE trap — a raw byte grep for 5017 in this file returns zero hits.

### `[[android-blobs/boss-timings-recut-across-builds]]` — UPHELD [A2] (2 critics)

Ogre and Guardian attack timing was re-cut between v0.682 and v0.717: the Android build ships NO *end recovery clip and folds recovery into a *hit clip up to 3.6x longer, so the telegraph/active/recovery triad that closes enemies-ai blocker ③ is a web-only fact.

- **Cite:** `reference/extracted/bindata/100_1t4627s0.bin:901,1223,1325 and 111_1t4638s0.bin:1174,1316 vs reference/extracted/android/91_MCSCharacter_OgreAnimationData.bin:901,1183 and 102_MCSCharacter_GuardianAnimationData.bin:1174`
- **Build:** both (values differ)
- **Lane impact:** L4 enemies-ai blocker ③ + L6 art-anim. bindata.md C12 closed the blocker with the WEB numbers (0.67s telegraph / 0.21s active / 0.46s recovery at 24Hz) and is correct — but the Android bundle, which the corpus routinely uses as the readable stand-in, says 0.58 / 0.75 / none, an active window 3.6x too long. Where the builds differ, v0.717 is the 1:1 target.

### `[[android-blobs/comp-rand-is-the-encounter-roll]]` — UPHELD [A2] (2 critics)

The condition system carries a probability primitive — <comp>rand</comp> evaluates Math.random()*id <= qty — and the one authored use in the world data is a flat 50% random-encounter roll on an aggro spawn.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:117-118 + reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4222-4225`
- **Build:** android v0.682
- **Lane impact:** L4 enemies-ai blocker ④ + L1 world-exploration. This is spawn PROBABILITY, not aggro radius or leash distance — neither of which is in this blob, and I claim nothing about them. But it is the first authored encounter-rate number in the corpus, and the primitive generalises: any <condition> in nodedata, questdata or uidata can be made probabilistic by the same three tags.

### `[[android-blobs/web-is-an-animation-superset]]` — UPHELD [A3] (2 critics)

The web build is a strict animation superset of the Android build — 487 vs 471 animations, delta exactly 16, zero Android-only animations — which reconciles bindata C17's 487 against Stage-0b S0-4's 471 and proves that absence in the Android build never proves absence in the shipped game.

- **Cite:** `<anim  count over reference/extracted/bindata/*.bin (19 blobs) vs reference/extracted/android/*AnimationData.bin (18 blobs); md5 sweep + per-blob name diff`
- **Build:** both
- **Lane impact:** L6 art-anim + L4 enemies-ai. Both banked counts were right and nobody had reconciled them; the difference is content the Android port dropped, not a counting error. Methodological consequence for the whole corpus: every 'X does not exist' claim resting on an Android grep is provisional.

### `[[enemies-ai/allies-level-match-the-player]]` — UPHELD [A2] (1 critic)

Friendly NPCs are level-matched to the player at spawn rather than using their authored <lvl>.

- **Cite:** `reference/decompiled/shs3_android/scripts/FriendlyElite.as:70, FriendlyArcher.as:58, FriendlySpearElite.as:56`
- **Lane impact:** L0 enemies-ai: explains the 70 <friend> entries in questdata's wave blocks — escorts and allied troops scale with you, so their authored <lvl> rows are inert. Also the most likely explanation for the seg-10 frame showing roaming BANDIT (4) while the player badge reads level 4.

### `[[enemies-ai/allies-scale-to-player-level-enemies-do-not]]` — UPHELD [A2] (1 critic)

Friendly NPCs scale to the PLAYER's level at spawn while enemies take an authored per-wave <lvl> override — two different scaling rules by side, which the ledger and the survey both treat as one formula.

- **Cite:** `reference/decompiled/shs3_android/scripts/FriendlyArcher.as:58, FriendlyElite.as:70, FriendlySpearElite.as:56 (contrast NPCManager.as:868-881)`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: completes blocker ①. setLevel is the shared mechanism but the INPUT differs by faction — allies read StatsManager.getLevel(), enemies read the wave's <lvl> (171 such overrides authored, range 1..80) and fall through to the authored statline when it is 0. Note the consequence: an ally at player level <=10 also hits the 1/1/1 clamp.

### `[[enemies-ai/android-ai-dispatch-is-38-cases-35-classes]]` — UPHELD [A2] (1 critic)

Measured, not hand-counted: the android v0.682 AI dispatch is 38 cases instantiating 35 unique classes (32 Enemy* + 3 Friendly*), against the web v0.717 build's 39 cases / 36 unique classes. v0.717 therefore adds exactly ONE ai id and ONE behaviour class — not two.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-634 vs reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:615-733`
- **Build:** both
- **Lane impact:** enemies-ai: the corrected baseline for any roster/dispatch table. A build made from the android decompile is short exactly one enemy class and one ai id for the v0.717 target.

### `[[enemies-ai/category-11-skills-are-in-npcdata]]` — UPHELD [A2] (1 critic)

All seven category-11 skills DO appear in npcdata rows, contrary to the packet's claim that they appear in zero. The counts are Back Throw 1064 x4, Air Stab 1065 x4, Bull Charge 1066 x1, Punch Lunge 1067 x1, Undying 1068 x2, and the two stance-selector flags 1500 x5 and 1501 x2. The reason a text grep misses them is schema: npcdata writes <skill><id>N</id><lvl>L</lvl></skill>, so the pattern <skill>N</skill> can never match.

- **Cite:** `reference/extracted/npcdata.xml:3898 and :3934 (647 <skill> occurrences across the file, 39 distinct ids)`
- **Build:** both
- **Lane impact:** L4 enemies-ai — the enemy-only move set is fully authored per-NPC and can be read straight out of npcdata; no code archaeology needed to know which enemies throw, air-stab, bull-charge or resurrect. It also confirms the reversed/dual stance flags are assigned to specific NPCs (5 and 2 rows) with <lvl>3</lvl>, which is what EnemyPlayer.as:836-843 branches on.

### `[[enemies-ai/drop-in-spawn-is-on-film]]` — UPHELD [A1] (1 critic)

The drop-in-from-above wave-spawn rule, asserted from AS3 only, is directly visible in a frame: a wave-2 enemy descends through the air with its HP bar already tracking it.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0020.jpg - crop (400,150)->(1024,470), LANCZOS x2`
- **KILLS this line:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: promotes NPCManager's posY - Math.random()*200 drop-in rule from A2-only to A2+A1, so it is safe to stamp. Also independently corroborates the combat-readout rule in a second scene (outdoor field, not the dungeon the surveyor cited).

### `[[enemies-ai/endless-wave-flag-is-the-survival-engine]]` — UPHELD [A2] (1 critic)

The wave engine carries an `endless` flag that rewinds the wave counter by 2 and recurses instead of ending the fight — the runtime behind the survivalmodedata blob that Stage-0 flagged as an entire game mode absent from all 12 ledger systems.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:381-388`
- **Lane impact:** Cross-lane: connects Stage-0 finding S0-1 (bindata 119 = <survivalmodedata>, plus the Android 109_WarHexUI_SurvivalModeData.bin) to executable behaviour. Survival mode is not a separate system to reverse-engineer — it is the existing wave spawner with one boolean and a -2 rewind.

### `[[enemies-ai/flinch-duration-is-per-family-not-8]]` — UPHELD [A2] (1 critic)

There is no universal 8-frame flinch. The 8-frame flinch/flinch_weapon clips belong to the human paperdoll; the undead family plays a 39-frame zom_stumble for the same FLINCH_STATE, so any recreation that hard-codes an 8-frame stagger is wrong on every undead enemy.

- **Cite:** `reference/extracted/android/98_MCSCharacter_UndeadAnimationData.bin + reference/decompiled/shs3_android/scripts/EnemyZombie.as:285-286 + reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin`
- **Build:** android v0.682
- **Lane impact:** enemies-ai + art-anim: the stagger frame count is a per-character-family table, not a constant. It also kills the 12 = 4 + 8 decomposition outright.

### `[[enemies-ai/floating-damage-numeral-measures-the-clamp]]` — UPHELD [A1] (1 critic)

Floating black damage numerals are a real HUD element the ledger and the surveyor both miss, and a web-build v0.717 frame measures a level-4 Bandit's damage at exactly 1 -- the first frame-side corroboration of NPC.as:253's lvl<=10 clamp.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0018.jpg -- crop (450,300)->(900,470) LANCZOS x4; HUD strip crop (30,480)->(330,560) x4 across frames 0013/0016/0017/0018/0019/0020`
- **KILLS this line:** "(1) enemy level->stat formula (governs the whole roster's balance -- absent, not just inferred)."
- **Lane impact:** L0 enemies-ai + ui-hud. Two things. (1) Floating damage numerals exist -- black, above the damaged actor -- and appear in no ledger row and no claim; a recreation without them is visibly wrong. (2) This is a v0.717 WEB frame measuring an ANDROID v0.682 constant and finding it correct, which is precisely the unlock condition claim 20 set for discharging the parity risk. It also does honestly what claim 2 tried to do rhetorically: supply real frame evidence for the lvl<=10 clamp.

### `[[enemies-ai/hitstokillplayer-has-three-bands]]` — UPHELD [A2] (1 critic)

The player-relative boss autobalance uses three distinct hitsToKillPlayer constants, not one — a recreation that ports 16 - lvldiff universally mis-tunes every Elite, SpearElite and Wolf Alpha encounter.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:97-98 + EnemyElite.as:40-41 + EnemySpearElite.as:84-85 + EnemyWolfAlpha.as:86-87 + EnemyKanjiGuardian.as:65-66`
- **Build:** android v0.682
- **Lane impact:** enemies-ai + progression: completes the setLevel picture the three packet claims each got partly right. Three hitsToKillBoss bands (8/10/13 + lvldiff), three hitsToKillPlayer bands (15/16/18 - lvldiff), and three different lower clamps (1/3/5).

### `[[enemies-ai/light-stance-has-no-telegraph]]` — UPHELD [A2] (1 critic)

The three-part telegraph/active/recovery structure is per-move, not universal: lighthorizontalslash is a SINGLE 3-frame animation with no parts and therefore no telegraph phase at all, while the jump slashes ship five parts (parta..parte).

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (own regex dump of all 158 <anim> names + durations)`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + combat-core + art-anim: a rebuild that assumes 3 parts per attack invents a telegraph for the light stance that the original does not have -- the 3-frame single anim IS the mechanical reason light stance reads as instant. Port the part counts per move from the anim table, never from a rule.

### `[[enemies-ai/nameplate-colour-system-is-five-colours]]` — UPHELD [A1] (1 critic)

The nameplate colour rule is five colours, not the two claim 2 offers, and three of them are confirmed frame-side -- which independently corroborates web/Android parity on the UI constants.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-18/frames/frame_0006.jpg -- crop (230,320)->(470,400) LANCZOS x6; peak-saturation sampling on seg-18 f0006, seg-10 f0013; + reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:78,81, MCSPlayer.as:245, Obj_NPCProcGen.as:51,60, EnemyElite.as:26,114, EnemyKanjiGuardian.as:59, EnemyClone.as:81`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai + ui-hud. Claim 2's 'hostile red / player gold' would have a recreation paint townsfolk hostile-red. The real rule is five-way: #990000 aggro hostile, #FFCC00 player, #0099FF procgen civilian, #FFFFFF elite/boss, #C0AC4B quest-marked. Also a second independent web/Android parity corroboration -- v0.717 frames match v0.682 constants to within JPEG error.

### `[[enemies-ai/nameplate-healthbar-coupling-and-60px-bar]]` — UPHELD [A2] (1 critic)

The nameplate and health bar are one coupled widget gated on the name STRING, not a combat mode -- and the enemy HP bar is 60 px wide at full health, a hard number in no claim and no ledger row.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:1419-1447 and :1533-1556; NPC.as:1182-1194; Obj_NPCAggro.as:74-82; Obj_NPCProcGen.as:49-51`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai + ui-hud. This is the mechanism behind both frames, and it is not the 'mode switch' claim 3 asserts: wave trash never has setDisplayName called, so text stays "" and showHealthBar's guard leaves the plate hidden; overworld roamers call hideHealthBar then setDisplayName, giving name-and-no-bar. Also supplies the 60 px full-width bar and the +10 px vertical offset when no bar is present -- both needed to lay the widget out correctly.

### `[[enemies-ai/nameplate-is-cosmetic-override]]` — UPHELD [A2] (1 critic)

The overworld nameplate's parenthesised level is a cosmetic per-placement display string read from the room-object property, not a stat: it never reaches setLevel(), so the enemy keeps its authored npcdata statline.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:34-37,62,73-80 + NPCManager.as:671`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai + ui-hud: refutes the surveyor's 'frame wins over npcdata, therefore HP 1' chain. There is no frame-vs-doc conflict - the level is authored per placement. Also code-holds the plate colour as 10027008 (0x990000, dark red), which the ledger omits.

### `[[enemies-ai/no-per-enemy-chi-or-speed]]` — UPHELD [A2] (8 critics)

Enemy Chi and SPD are not authored anywhere: npcdata.xml contains zero <chi> and zero <speed> tags, so XMLNpc's parse defaults every NPC to chi = 1 and speed = 1 (other defaults on the same path: ai→1, hp→1, attack→1, defense→0).

- **Cite:** `grep -c "<chi>\|<speed>" reference/extracted/npcdata.xml → 0; reference/decompiled/shs3_android/scripts/XMLNpc.as:150-182`
- **KILLS this line:** "enemies-ai | 34 | full taxonomy + movesets, boss roster, projectile set"
- **Lane impact:** L0 enemies-ai: a positive answer, not a gap. Any recreation that gives enemies a Chi pool or a per-enemy speed stat is inventing a system the original does not have — this deletes work rather than adding it.

### `[[enemies-ai/no-squad-coordination]]` — UPHELD [A2] (8 critics)

There is no squad coordination anywhere: every NPC independently re-queries the nearest live target within the stage bounds ±10px, with no shared aggro table, no formation and no flanking assignment in NPCManager.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1360-1390`
- **KILLS this line:** "independent-aggro (no coordination — closed)"
- **Lane impact:** L0 enemies-ai: promotes a research-closed Ready bullet to an A2 cite. Corroborated by the seg-11 frame, where five hostiles converge from both sides with no formation.

### `[[enemies-ai/npc-die-has-four-paths-before-the-seven-way-dice]]` — UPHELD [A2] (1 critic)

The 7-way human death dice is the LAST of five branches in NPC.die(), and the four ahead of it are unheld by any claim in this packet. NPC.as:909-913 returns bare dead=true from GOTLAUNCHED_STATE with no animation at all; :914-925 handles isDowned() with DEATHDOWNED plus a 90-degree torso emitter at variance 15; :926-954 handles SEPPUKU_START, splitting into SEPPUKU_MID or, when behead is set and censorship is off, SEPPUKU_NOHEAD with its own 3-way emitter dice over PART_neck at 130 degrees and the detached head at 180; and :1084+ handles a plain behead. Only if none of those fire does :1005 roll Math.random()*7.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:898-1005 read in full`
- **Build:** android v0.682
- **Lane impact:** L2 enemies-ai + L6 art-anim: a rebuild wiring only the 7-way dice loses the launched, downed and seppuku deaths entirely, and StatsManager.censored gates the emitters on every one of them.

### `[[enemies-ai/npc77-resolves-to-oni-and-never-scales]]` — UPHELD [A2] (1 critic)

The 'ogres never level-scale' reading is now name-resolved end to end: npcdata id 77 is the Oni, ships at level 80 with 40 hp and attack 2000, routes to ai 23, and ai 23 constructs EnemyOgre — whose setLevel override is an empty body.

- **Cite:** `reference/extracted/npcdata.xml (npc id 77) + docs/gauntlet/L0/index/strings.json["5071"] + reference/decompiled/shs3_android/scripts/NPCManager.as:587-588 + EnemyOgre.as:51-53`
- **Build:** android v0.682
- **Lane impact:** enemies-ai: closes the id-77 loop the setLevel claims left as a parenthetical, and confirms S0-3's claim that npcdata name ids resolve (484/6). The Oni's 40 hp is authored, not derived, because nothing ever calls a scaling function on it.

### `[[enemies-ai/one-statline-six-movesets]]` — UPHELD [A2] (8 critics)

The authoring rule is one archetype × N AI classes: NPC ids 11-16 are identical statlines (name 5011 "Bandit", lvl 10, hp 15, attack 24, defense 20) differing in exactly one field, <ai> = 1,2,3,4,5,9 — knife / archer / katana / spear / shield / player-mirror.

- **Cite:** `reference/extracted/npcdata.xml:273-465`
- **KILLS this line:** "full taxonomy … with movesets"
- **Lane impact:** L0 enemies-ai: this is the real 'moveset' model and it is absent from the ledger entirely. It also means the roster is far cheaper to build than 495 rows suggests — 38 behaviours × a paperdoll/statline table.

### `[[enemies-ai/part-decomposition-is-variable]]` — UPHELD [A2] (1 critic)

The parta/partb/partc attack decomposition is neither universal nor uniformly three-part: only 16 of 158 human anim families use it, with 2, 3, 4 or 5 parts, and most attacks have no decomposition at all.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (my own parse of all 158 <anim> blocks)`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: corrects the surveyor's 'every stance attack ships as three named parts'. A port following that rule would invent a three-phase light-stance slash and three-phase katana/stab attacks that do not exist. The durations themselves are authored and correct - it is the generalisation that fails.

### `[[enemies-ai/part-specific-death-animations]]` — UPHELD [A2] (1 critic)

Death animation is part-specific, not a single clip: the human anim set ships deathnohead, deathnohand, deathinhalf, deathwitharrow and deathbyarrow alongside plain death — the visual half of the behead x1.5 and zombie head-gate mechanics.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (parsed: 158 <anim> blocks)`
- **KILLS this line:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: the survey establishes the behead DAMAGE rule (NPC.as x1.5, EnemyZombie half-unless-behead) but never connects it to the authored dismemberment ART. deathnohead is the behead death, deathnohand the disarm death, deathinhalf the bisection death — all with frame durations. A recreation that plays one generic death clip loses a visibly authored feature.

### `[[enemies-ai/readout-split-is-two-spawn-paths]]` — UPHELD [A2] (1 critic)

The nameplate-vs-HP-bar split is not a HUD mode switch but two different spawn paths: overworld Obj_NPCAggro roamers get hideHealthBar() plus a permanent display name, while wave-spawned combat NPCs get the inverse - a bar and no name.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:38-41,73-80 vs NPCManager.as:869-882 (createEnemy)`
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: model it as two spawn paths, not one HUD that toggles. The aggro object carries its own waveXML, so on trigger the billboard enemy is replaced by a real wave - which is exactly what the seg-10 0013->0021 footage shows.

### `[[enemies-ai/roster-display-names-differ-from-class-names]]` — UPHELD [A2] (1 critic)

Three roster entries the survey names after their AI class carry different display names in the shipped string table — npc 67 is "Wolf" (not Wolf Alpha), npc 77 is "Oni" (not Ogre), npc 89 is "Undead" (not Zombie) — which matters because the nameplate displays this string.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json → npcdata.xml.resolved (484 rows): '67' {'name':'Wolf'}, '77' {'name':'Oni'}, '89' {'name':'Undead'}, '11' {'name':'Bandit'}, '144' {'name':'Hiroshi'}, '165' {'name':'Tadao'}, '186' {'name':'Amaya'}, '800' {'name':'Mad Cultist'}, '802' {'name':'Guardian'}`
- **KILLS this line:** "boss roster"
- **Lane impact:** L0 enemies-ai + ui-hud: the OG's nameplate prints the string-table name, not the class name — proved by the seg-10 frame in claim 2, where npc 11 renders as "BANDIT (4)". Any roster table for the recreation must be keyed on resolved_names.json, with the class name used only as the behaviour selector. Cheap to fix now, expensive after the nameplate ships.

### `[[enemies-ai/seg10-wave-spawn-is-witnessed-across-three-frames]]` — UPHELD [A1] (1 critic)

The seg-10 drop-in is not a single ambiguous airborne pose: across three consecutive extracted frames the wave materialises. At frame_0019 none of the three hostiles is on screen; at frame_0020 all three are present with one still fully airborne and its HP bar already tracking it; at frame_0021 all three are grounded and engaging the player. That sequence excludes a jump-attack reading and makes NPCManager's posY - Math.random()*200 spawn offset a filmed behaviour rather than a code-only one.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0019.jpg, frame_0020.jpg, frame_0021.jpg — identical crop (400,150)-(1024,470) 2x LANCZOS on all three; rule at reference/decompiled/shs3_android/scripts/NPCManager.as:411,424,437`
- **Lane impact:** L0 enemies-ai — the drop-in spawn can be stamped A1+A2 on a three-frame witness rather than a single still, and the same sequence shows the HP bar is attached at spawn, before the actor lands.

### `[[enemies-ai/setlevel-is-plural]]` — UPHELD [A2] (1 critic)

There is no single enemy level-to-stat formula: 11 classes override NPC.setLevel(), and the boss branch drops both the x0.9 factor and the level-10 clamp and awards a different XP curve.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemySpearElite.as:32-70 + EnemyPlayer.as:777-790 (full list from `grep -rln "override public function setLevel"`: EnemySpearElite, EnemyPlayer, EnemyElite, EnemyOgre, EnemyWolfAlpha, EnemyStag, EnemyKanjiGuardian, EnemyTrainingDummy, FriendlyArcher, FriendlyElite, FriendlySpearElite)`
- **KILLS this line:** "① enemy level→stat formula (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: blocker (1) still dies, but the port needs the base formula PLUS 11 overrides. Bosses are not 0.9-scaled, are never clamped to 1 HP, give xp = lvl*5 + 45, and run a hitsToKillBoss/hitsToKillPlayer solve against the live player's stats — a whole balancing routine the claim does not mention. Also: setLevel only fires when a <lvl> override is supplied (NPCManager.as:877-880 gates it `if(lvl != 0)`), so the ordinary spawn path uses the authored statline unrescaled.

### `[[enemies-ai/web-archer-halves-gravity-on-knockdown]]` — UPHELD [A2] (1 critic)

The web v0.717 archer overrides the ballistic gravity term from 3 to 1.5 for shots that rolled a knockdown, producing a flatter, faster arc — a branch that does not exist in the Android v0.682 build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4542s0§.as:287-299 (contrast reference/decompiled/shs3_android/scripts/EnemyArcher.as:277-281)`
- **Lane impact:** L0 enemies-ai: the first PROVEN v0.682-vs-v0.717 behavioural divergence. It lands inside the very claim the survey marked HELD, and it vindicates the parity caveat while showing the risk is specific and fixable rather than diffuse. Port the web value: gravity 3 normally, 1.5 on knockdown shots.

### `[[enemies-ai/web-gameplay-code-is-obfuscated-not-absent]]` — UPHELD [A2] (1 critic)

The web v0.717 gameplay code is on disk as 612 symbol-obfuscated §1tNNNsN§ classes; §1t68s0§.as is the web NPC class and eight enemy-behaviour constants are byte-equivalent to the Android decompile, so build parity is directly checkable rather than unestablished.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:14,16,26,28,258-278,483`
- **Lane impact:** L0 enemies-ai and every lane that deferred to 'v0.682-ANDROID only'. The surveyor's non-recursive `ls | grep -ci enemy\|npc` returned 0 because symbols were renamed, not because the code is missing. Any lane that capped its score on 'web parity unestablished' should re-check against the obfuscated bundle: numeric literals and standard-library calls survive obfuscation intact.

### `[[enemies-ai/web-payload-is-obfuscated-not-absent]]` — UPHELD [A2] (1 critic)

The web v0.717 build's gameplay code is present on disk under obfuscated identifiers, not missing: 667 §1t…s0§-named files, with the version constant at §1t1523s0§.as:36 in the same structural slot Android's StatsManager.as:30 holds 0.682 — so §1t1523s0§ is the web StatsManager and a name mapping between the two decompiles is achievable.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (plus `find reference/decompiled/shs3_payload -name "§*" -type f | wc -l` → 667; scripts/§1t51s0§/ is an obfuscated package dir)`
- **Lane impact:** L0 enemies-ai and every lane that cites the Android decompile: the survey's dominant residual risk is mis-framed. Web parity is NOT unestablishable — it is a name-recovery job on 667 obfuscated classes with at least one anchor constant already matched (0.717 ↔ 0.682, same slot). That is schedulable verification work and should be opened as a lane, rather than treating AS3-sourced numbers as permanently un-CONTRACT-able. The caution itself still stands: keep labelling ported values v0.682-ANDROID until the mapping is done.

### `[[enemies-ai/web-v0717-gameplay-code-is-on-disk]]` — UPHELD [A2] (1 critic)

The web v0.717 gameplay code is NOT missing — it is name-obfuscated into 667 `§...§.as` classes in the web payload decompile, and §1t68s0§.as is the web NPC class carrying setLevel, the 24-frame AI cadence and the 12-frame hit lockout.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:258-279, :22, :483`
- **Lane impact:** L0 enemies-ai (and every AS3-sourced lane): the survey's only STILL_UNHELD is refuted. Parity between v0.682 and v0.717 is now directly checkable by constant-matching against obfuscated classes, and it CONFIRMS the unit's core numbers. Cap-reason (1) on the 78 score should be struck. This also unblocks every other lane that deferred an AS3 number as 'Android-only'.

### `[[enemies-ai/zombie-weapon-hit-deals-zero]]` — UPHELD [A2] (1 critic)

Striking a zombie's weapon part deals exactly zero damage and aborts the hit entirely, a third branch alongside the behead gate and the half-damage rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:494-508`
- **KILLS this line:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai + combat-core: the blade-path/part-collision model needs a per-part damage verdict, not just a hit/miss boolean. Undead have three outcomes on a connect (behead full, body half, weapon zero-and-abort), which is a stronger reason than the ledger's 'reflect' guess for why zombies feel spongy.

### `[[enemies-ai/zombie-weapon-parry]]` — UPHELD [A2] (1 critic)

EnemyZombie has a weapon-part parry the survey missed: a hit landing on PART_weapon deals zero damage and returns false, eating the hit entirely.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:502-505`
- **KILLS this line:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai + combat-core: sits alongside the half-damage-unless-behead gate in the same switch. Blade-path hits that intersect the enemy's weapon are nullified, which is a real feel mechanic and is not in any ledger system.

### `[[gauntlet-s26b/createnpc-switch-is-35-distinct-classes]]` — UPHELD [A2] (1 critic)

The android createNPC switch resolves 38 cases to 35 DISTINCT classes - 32 Enemy* plus 3 Friendly* - not 34. EnemyWolf (case 8) and EnemyWolf2 (case 10) are separate classes, not one class used twice; only EnemyPlayer (x3, cases 0/9/14) and EnemySpearElite (x2, cases 28/37) actually repeat. 3 + 2 + 33 = 38. Separately, 34 Enemy*.as files exist on disk, so two Enemy* classes are never reached by this switch.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-636 + reference/decompiled/shs3_android/scripts/EnemyWolf2.as:3`
- **Build:** android v0.682
- **Lane impact:** L-enemies-ai: the corrected form of packet claim 5, which I refuted for shipping 34/31+3 as a lane correction. The error came from a `grep -oE 'new [A-Za-z_]*'` character class that silently ate the trailing digit of EnemyWolf2. Claim 5's true half - that createRoomNPC at NPCManager.as:671-700 is a SECOND, independent ai dispatch and the path every overworld object takes (Obj_NPCAggro.as:63, Obj_NPCCivilian.as:24, Obj_Corpse.as:28) - stands and should enter the ledger in this corrected form.

### `[[kh-base-aicountermax-is-24-not-12]]` — UPHELD [A2] (1 critic)

The default enemy retarget cadence is 24 frames, not 12. NPC.as:22 declares 'internal var aiCounterMax:int = 24;' and only EnemyPlayer overrides it (EnemyPlayer.as:52, to 12). EnemyKnife and the other melee Enemy* classes inherit 24, so the melee-AI geometry claim's '12 frames' is a cross-class conflation.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:22 and :285-294, plus EnemyPlayer.as:52`
- **Build:** both
- **Lane impact:** L-enemies-ai: two retarget cadences, not one -- 24 frames for the ordinary melee roster and 12 for the EnemyPlayer rig (ai 0/9/14). A rebuild using 12 everywhere makes every mob twice as reactive as the original.

### `[[npcdata/enemy-render-scale]]` — UPHELD [A2] (2 critics)

Per-NPC render scale is authored on 16 NPCs over the domain {0.95, 0.99, 1, 1.1, 1.3, 2}, including a 2.0× double-height Guardian and non-uniform x≠y entries (Inokichi 1.3/1.1, Fumio and Mitsuo 1.0/0.95) that force independent axis scaling in the renderer.

- **Cite:** `reference/extracted/npcdata.xml:4136-4137 (npc 802 Guardian), :3880-3881 (npc 187 Yohei), :3408-3409 (npc 162 Inokichi), :3437-3438 (npc 164 Fumio)`
- **Lane impact:** L-art-anim-audio-feel: the ledger's Ready column ('proportions', 'fighter proportions') assumes a single fighter size. It is not one size — the same rig is scaled per NPC, non-uniformly, up to 2×. L-enemies-ai: boss silhouette scale is a codeable value today.

### `[[npcdata/high-band-coefficients]]` — UPHELD [A2] (2 critics)

The stat coefficient is per-tier, not global: levels 45–60 use HP=ATK=ceil(2.5·L) with DEF = 2.8·L exactly, and level 70 uses 2.5·L for all three — so extrapolating the 2.5/2.4 pair past L40 is wrong.

- **Cite:** `reference/extracted/npcdata.xml:5318-5324 (Heavy Soldier id 248, lvl 45) and :5393-5399 (Castle Guard id 252, lvl 70)`
- **Lane impact:** enemies-ai — refines claim 1; a builder who fits one global line to the roster will over-tune every L45+ enemy's defence by ~12%.

### `[[npcdata/no-speed-no-chi]]` — UPHELD [A2] (2 critics)

Every NPC in the game ships with speed 1 and chi 1 — the file contains zero <speed> and zero <chi> tags, and the parser defaults both to 1 — so enemy cadence and cooldowns are not data-driven per NPC and blocker ③ must be read out of the 38 AI classes instead.

- **Cite:** `tag census over all 495 <npc> blocks in reference/extracted/npcdata.xml (no speed/chi paths in docs/gauntlet/L0/index/npcdata.json either); defaults at reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:151-182`
- **Lane impact:** enemies-ai — honest negative: blocker ③ (telegraph/active/recovery + stagger frames) is NOT closable from npcdata; it is localised to the 38 named actor classes. Blockers ④ (aggro/leash/spawn geometry) and ⑤ (Undead damage-reflect) are likewise absent from this file and remain STILL_UNHELD here.

### `[[npcdata/one-hp-field-trash]]` — UPHELD [A2] (2 critics)

The "~1-HP-chip field trash" reading is confirmed at payload level with an exact census: 42 NPCs carry <hp>1</hp> — Soldier ×25, Ruffian ×5, Elite Soldier ×5, Novice Swordsman ×3, Thug, Deer, Fox and one Training Dummy.

- **Cite:** `reference/extracted/npcdata.xml:26 (npc 1 Ruffian), :4455 (npc 200 Soldier), :4542 (npc 205 Elite Soldier), :1659 (npc 56), :149 (npc 6), :1991 (npc 74 Deer), :2087 (npc 78 Fox), :2710 (npc 118 Training Dummy)`
- **KILLS this line:** "the shipped AITIERS/ENEMYBASE are a PvP-duel dummy (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L-enemies-ai: upgrades the ledger's own Surface suspicion from 'notes' to A2 payload evidence, with an exact 42-row census. src/config/combat-sim.ts already ships hp:1, so no code change is implied — only the ledger's provenance label changes.

### `[[npcdata/random-appearance-weighting]]` — UPHELD [A2] (2 critics)

The comma lists in <mcs> are a uniform random pick made at spawn, and repeated `0` entries are a shipped probability weighting for 'wear nothing' — so a level-2 Thug is bald 5/17 of the time.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:574-579 applied to reference/extracted/npcdata.xml:155`
- **Lane impact:** art-anim-audio-feel + enemies-ai — enemy visual variety is a per-spawn RNG roll off weighted pools, not fixed per-enemy art; a recreation that hard-codes one look per enemy type will read wrong immediately.

### `[[parity/web-build-ships-a-spider-animation-set-android-lacks]]` — UPHELD [A3] (1 critic)

The web v0.717 bindata set contains a 10-animation spider creature set that has no counterpart anywhere in the 42 android blobs. The web build has 19 animdata blobs against android's 18 MCSCharacter_* blobs, and the spider is the extra one. A roster or enemy taxonomy built from the android blobs alone is missing a creature the target build ships.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin (90,473 B) + docs/gauntlet/L0/index/bindata.json; negative check 'grep -rl spider_idle reference/extracted/android/' returns no files, and reference/extracted/android/ carries exactly 18 MCSCharacter_*AnimationData.bin blobs, none named Spider`
- **Build:** web v0.717
- **Lane impact:** L8 enemies-ai + L0 art-anim: the enemy taxonomy in REBUILD_READINESS.md:231 ('Humans/Undead/Oni/Animals + Tengu/Guardian') has no spider. Worth a targeted look at npcdata for spider-ai rows before the roster is called complete.

### `[[questdata-critic/namegen-table-sizes-corrected]]` — UPHELD [A2] (1 critic)

Name-generator table sizes are 398 male / 291 female / 33 noble / 36 samurai / 677 place — one more each than the packet's 397/290/32/35/676. All five .bin files end WITHOUT a trailing newline, so wc -l undercounts by one, while NameGenerator.as:50 splits on /\n/ and therefore sees the higher count as the array length used by rng.rand(arrayLength).

- **Cite:** `reference/decompiled/shs3_android/scripts/NameGenerator.as:50 joined to reference/extracted/android/85_NameGenerator_MaleNames.bin (tail has no newline: ends `sada\r\nYutaka`)`
- **Build:** android v0.682 tables; the web build carries the same arrays (grep -l '"Kitsu"' hits reference/decompiled/shs3_payload/scripts/§1t136s0§.as)
- **Lane impact:** L12 meta-social / L7 enemies-ai: the generator's index space is 398/291/33/36/677, which matters if anyone reproduces the RNG draw exactly.

### `[[questdata/fatal-tag-census-correction]]` — UPHELD [A2] (1 critic)

The <fatal> flag is not carried by every <friend> block. questdata.xml holds 75 <fatal> tags against 70 <friend> blocks; only 59 of the friends carry one, and 16 <fatal> tags sit outside any <friend>. Every one of the 75 is the value 0, so the 'always 0 in shipped content' half is correct.

- **Cite:** `reference/extracted/questdata.xml — census over the whole file; representative instance at :11710 (<fatal>0</fatal> inside the <friend> closing at :11711)`
- **Build:** android v0.682 embed (the file labelled questdata.xml)
- **Lane impact:** L7 enemies-ai: a per-ally death flag must be modelled as optional, defaulting to absent, not as a required field on every allied spawn.

### `[[ui-hud/combat-keeps-the-player-nameplate]]` — UPHELD [A1] (1 critic)

Combat does not suppress all nameplates. In a live fight the enemies lose their plates and gain green health bars, but the PLAYER's gold nameplate is still rendered above the character.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg (1024x576) read whole at x2 LANCZOS`
- **Build:** web v0.717
- **KILLS this line:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud: corrects the 'combat shows zero plates' simplification carried in the spawner-split claim. The recreation must keep the player's own gold plate on screen during a fight.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
