# t1-overturns-02 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — 24 claims, all claiming a ledger overturn.
**Judged: 24/24. Skipped: 0.**

Every verdict below rests on an artifact I opened myself. Where I re-ran a parse or a
byte-check, the command and its output are pasted.

RESULT: **20 upheld · 4 refuted** — but of the 20 upheld, **4 are TRUE claims aimed at a
ledger sentence that does not fall** (`overturn_upheld=false`).

---

## REFUTED (4)

### R1 — `hunter/audio-blocker-is-the-right-target-for-the-sfx-names` — REFUTED (material)
The 43 `Snd_*` names are real. I confirmed all three call sites verbatim:

```
§1t113s0§.as:352                  §1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");
§1t406s0§.as:1226            §1t88s0§.instance.§1t1516s0§("Snd_ninja");
§1t99s0§.as:3379               §1t88s0§.instance.§1t1516s0§("Snd_jump");
$ grep -rho 'Snd_[A-Za-z0-9_]*' reference/decompiled/shs3_payload/scripts/ | sort -u | wc -l
      43
```

Two things kill it:

1. **It repeats the superseded S0-5 line.** The finding asserts "the waveforms remain
   CWS-encrypted per Stage-0b S0-5". Correction **C3** retired that. I did not take C3 on
   trust — I decoded the blob myself. `ResourceManager.as:200-216` XORs bytes 3..255 with
   `resourceFileNameArray[num].charCodeAt(1)`; `resourceFileNameArray` at `ResourceManager.as:41`
   is `["shs3resource.swf","musicresource.swf","soundresource.swf",...]`, so the sound key is
   `'o'` = 111. Running that transform on `reference/extracted/android/122_Mobile_SoundResource.bin`:

   ```
   b'CWS\x11\xbfs\x00\x00'   sig b'CWS' ver 17 len 29631   inflated 29623
   tag histogram {69:1, 77:1, 9:1, 86:1, 45:1, 14:13, 82:1, 76:1, 1:1, 0:1}
   DefineSound(14) count 13
   SymbolClass names: ['punch','fart','hitmetal','goodkoto','slash1','slash2','die1',
                       'refund','die3','slash3','sumo','die2','deflect']
   ```
   The waveforms are **not** encrypted-and-lost. They decode.

2. **The ledger line is mis-cited by one.** The finding names `REBUILD_READINESS.md:241`.
   `:241` is the `- **Surface:** hit-tint scaling (7/12/16f), death sword-detach…` line.
   The `① ALL AUDIO` blocker is at **`:240`**.

What survives, and should be re-entered by the board: *43 named SFX triggers with call sites
exist in the web payload; blocker `:240` ① loses its "no SFX identified" half; the SFX
**parameters** are still INFERRED, but the **waveforms are recovered**, not encrypted.*

### R2 — `hunter05/writ-of-release-is-5-gold-not-25` — REFUTED (material). THE FRAME WINS.
The data cite is exact — `reference/extracted/itemdata.xml:2328-2335` really is
`<id>2203</id> … <baseprice>0</baseprice><heavenlyprice>5</heavenlyprice> … <desc>4157</desc>`,
and `strings.json["4156"]` really is `'Writ of Release'`.

The **conclusion** is wrong for the target build. `itemdata.xml` is an **ANDROID v0.682**
artifact (correction **C2**: the web payload carries zero `<itemdata>` roots), so the
finding's build label `both (itemdata id sets identical across builds)` is exactly the
circular comparison C2 forbids — there is no web-side itemdata to compare against.

I went to the film. `docs/research/video-study/B-MAP.md:1` fixes video **B** = `Nr4fQstqHDM`.
Extracted the Ninja-Services shop at the timecode the segment doc names:

```
ffmpeg -ss 2884 -t 14 -vf fps=2  reference/videos/Nr4fQstqHDM.mp4   # 48:04 → 48:18
frame 018 ≈ t=48:12.5
```

Crop `(1050,150)-(1750,450)` @2× LANCZOS — the detail panel reads, unambiguously:

> **WRIT OF RELEASE** · **OWNED: 0** · price badge on the item icon: **25** with the gold-coin glyph.

Crop `(300,100)-(1100,900)` @2× — the selected (highlighted) grid cell is the white scroll
carrying badge **25**, in a row of three purple-rarity scrolls all badged 25.

**STANDING INVARIANT FIRES: the measurement (android XML, 5 HGold) and the frame (web
v0.717 shop, 25 gold) DISAGREE — THE FRAME WINS.** `REBUILD_READINESS.md:216`'s
"Writ of Release 25g now double-confirmed" is CORRECT for v0.717. What the finding actually
discovered is a **build-parity price divergence**, not a ledger error.

### R3 — `parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android` — REFUTED (material)
The headline census is **exactly right** — I reproduced it independently:

```
web files 27  android files 42
web files with an android md5 twin: 21
   103_1t4630s0.bin == 94_MCSCharacter_Human2AnimationData.bin  6852a591ab2d5895090b3d37ccec9ba2
   … (all 21 pairs matched the finding's list, name for name)
```

It falls on a false universal. The claim is "…including the **ENTIRE** character-animation
layer", and the lane_impact draws the operational conclusion "the animation data layer needs
**NO** build hedge at all" / "every `<anim … d="N">` duration an unqualified web-build
CONTRACT". That is not true. **Five web animdata blobs have no byte-identical android twin**,
and I opened each one to confirm it is animdata:

```
100_1t4627s0.bin  <animdata><anim i="ogre_idle"        d="1" l="1">
102_1t4629s0.bin  <animdata><anim i="chargedshot_start" d="4">
111_1t4638s0.bin  <animdata><anim i="guardian_idle"    d="1" l="1">
113_1t4640s0.bin  <animdata><anim i="spear_idle"       d="1">
114_1t4641s0.bin  <animdata><anim i="spider_idle"      d="1">
```

On the android side the unmatched animation blobs are `91_Ogre`, `93_Skills`, `102_Guardian`,
`104_HumanSpear` — and there is **no android spider set at all**. So the parity is **14 of 18**
android animdata blobs, not the layer.

Salvageable and correct: *those 21 named files carry no hedge; `99_HumanAnimationData`
(== web `108_1t4635s0.bin`) is among them, so a flinch `d=8` read out of THAT file is safe;
the animation layer as a whole still needs a hedge.* Lifting the hedge wholesale is precisely
the fail-open this lane exists to stop.

### R4 — see `overturn_upheld=false` rulings below — those are NOT refutations.

---

## UPHELD, but the named ledger sentence does NOT fall (4)

### `enemies-ai/shielder-prop-block-is-a-second-block-mechanic` — claim TRUE, overturn FALSE
Cite is exact. `EnemyShield.as:331-340`:
```
331            case mcs.partList[MCSCharacter.PART_weapon]:
332               gotHitFlag = false;
333               damage = 0;
334               return false;
335            case mcs.partList[MCSCharacter.PART_prop]:
336               gotHitFlag = true;
337               damage = 0;
338               gotHitCounter = 24;
339               SoundManager.instance.playHitMetal();
340               return false;
353               damage *= 1.5;      (behead)
362            gotHitCounter = 12;    (normal landed hit)
```
And `gotHitCounter` really is an i-frame counter — `NPC.as:388` `if(this.gotHitCounter > 0) { return false; }`
at the top of `gotHit()`, `NPC.as:298` `canHit()` returns `gotHitCounter == 0`. So 24 vs 12 is a
genuinely doubled invulnerability window. The five supporting cites resolve too
(`EnemyOgre.as:333`, `EnemyJiangSi.as:294`, `EnemyNianMonster.as:374`, `EnemyWolfAlpha.as:470`,
`CutsceneActor.as:303` are all the `PART_weapon` case — note Nian and WolfAlpha treat a weapon
hit as `damage *= 2` + behead, not a whiff).

**But the ledger sentence it names is `SOURCE_CONSTANTS.md:258` — "`COUNTER_BONUS` ❌ NOT FOUND —
there is no counter/parry/riposte mechanic at all."** A shield that zeroes damage and grants
i-frames is a **block**, not a counter/parry/riposte: nothing is returned to the attacker and
no bonus multiplier fires. It is also an **enemy** property, not a player mechanic. `:258` stands.
(The finding's own lane_impact quotes `:258` as saying "no block at all" — `:258` does not say that.)

### `frames/v0717-war-room-rules-are-seven-pages` — claim TRUE, overturn FALSE
I cropped all three frames myself, `(30,20)-(1000,420)` @1.6× LANCZOS on the 1024×576 source:
- `Nr4fQstqHDM/seg-20/frames/frame_0011.jpg` → **"WAR ROOM RULES 1/7  (JOINING A BATTLE)"**
- `…/frame_0012.jpg` → **"WAR ROOM RULES 3/7  (ATTACKING AND DEFENDING)"**
- `…/frame_0013.jpg` → **"WAR ROOM RULES 6/7  (BUILDING STRUCTURES)"**

Against `strings.json["369"…"379"]` = `1/6 … 6/6 (building structures)` and
`ui_strings.txt:189-194` = `1/6 … 5/6 (WINNING AND LOSING) · 6/6 (rank)`. Three-way divergence,
frame vs android table vs extracted web strings. **THE FRAME WINS** — v0.717 renders seven pages.
The "ui_strings.txt is not runtime copy" rider is also correct: the web table has no
"building structures" page at all, and the frame shows one.

**But the named sentence is the S0-3 caveat "UI copy … parity is NOT established."** Proving a
divergence **confirms** that sentence; it does not overturn it. What it earns is a hard,
enumerable entry in the parity ledger, not a deletion.

### `hunter04/territory-owners-are-open-ended-not-four` — claim TRUE, overturn FALSE
All twelve string ids resolve verbatim (`["275"]`='Clan Aka Ryu' … `["278"]`='Clan Ki Sensu',
`["491"]`='Neutral', `["816"]`='Clan Color', `["818"]`='Clan Acronym',
`["834"]`='Minor Clan  ( [0] territories owned )', `["4400"]`='Clan Deed',
`["4401"]`/`["4405"]` as quoted). I opened
`reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg` and cropped `(700,160)-(780,230)`
@15× LANCZOS: a castle-town tile flying a **black banner with a white circular mon** — a fifth
heraldry distinct from the red/green/blue/gold of the four named clans. The open-ended
`(colour, banner, acronym)` + Neutral-sentinel model is well grounded.

**But the named sentence is "(2) War-Room map topology (board/adjacency)."** This evidence says
nothing about topology or adjacency. The sentence it should have named is `:244`'s Ready entry
"4 clans (heraldry/masks/daimyo/capitals)". Right finding, wrong target.

### (the fourth is R2 above, which is a full refutation, not this category)

---

## UPHELD AND THE OVERTURN LANDS (16)

Compressed — each line is a cite I opened and confirmed.

| id | what I checked | result |
|---|---|---|
| `hunter/all-24-elemental-skills-fully-specced` | ElementTree over `skilldata.xml`: **all 24** of {1013, 1025-1035, 1056-1063, 1070-1073} present; 1029 'Fire Kunai' chi 3 cd 2 · 1025 'Fire Element Trap' chi 3 cd 6 · 1013 'Fire Breath' chi 5 cd 15 · 1033 'Ground Punch' chi 5 cd 15 · 1070 'Inferno' chi 50 cd 60 desc `'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'` · 1056 `<passive>1</passive>` — every quoted value exact. `BigTornadoProjectile.as:24` verbatim. **I also found the WEB twins** at `§1t8343s0§.as:24`, `§1t8341s0§.as:24`, `§1t8338s0§.as:23`, `§1t8334s0§.as:27` — same `param3 * 1.5` in the same element slot — so the 150 % holds in v0.717 too. | ① "names only" **falls**. Caveat: the chi/cooldown rows are android-sourced per C2; the `web v0.717` build label overstates that half. |
| `hunter/dragon-dance-input-rule-held` | `§1t5495s0§.as:382` and `DragonDanceUI.as:367`/`:369` verbatim; `:70` = `["sky","wind","water","mountain","earth","thunder","fire","lake"]` so indices 1,2,4,6 = wind/water/earth/fire ✓; read `setLaterHeaven()` — it flips `earlierHeaven=false`, swaps the node art to red and clears `clickedArray` ✓ | ④ loses its **input** half |
| `hunter/elemental-atk-vs-def-formula-held` | `MCSPlayer.as:3347`, `:3351`, `:3420` verbatim; `StatsManager.as:1836` verbatim; signature at `MCSPlayer.as:260` `initElementDefenseStats(FIREDEF, WINDDEF, WATERDEF, EARTHDEF)` proves the wheel: FIREDEF←WATERATK, WINDDEF←EARTHATK, WATERDEF←WINDATK, EARTHDEF←FIREATK. Build label `both` checked: web `§1t99s0§.as:4400` has the identical 5-term `- (_loc5_+_loc7_+_loc9_+_loc8_+_loc10_)` sum | ② **closes outright** |
| `hunter/ten-kanji-dan-ranks-in-string-table` | (citelint QUOTE_UNVERIFIED — **false alarm**, it cannot do `["455"]` lookups). `strings.json["455"…"464"]` = 初段 弐段 参段 四段 五段 六段 七段 八段 九段 十段, and `["465"-"467"]` = Renshi/Kyoshi/Hanshi, so the ladder is closed at 464. `§1t408s0§.as:532-565` is the romaji switch, dan 0→"" … dan 9→"(judan)". **I found the display path the finding only asserted**: `InventoryUI.as:2280-2315` sets `danfield.text = LangManager.getString(456…464)` | MAX_DAN_RANK=10 is code-grade from two independent artifacts; "the only wiki datum" **falls** |
| `hunter04/full-xp-table-l1-to-l80-is-in-both-builds` | (QUOTE_UNVERIFIED — false alarm). Parsed both arrays: **99 entries each, `A == B` exactly**. idx1-10 = 550,1450,2950,5150,8350,12150,16350,20900,25900,31400 — identical to `REBUILD_READINESS.md:77`. idx79 = 4,025,800; idx98 = 29,395,800 | `:200` ② and `:350` **fall outright** |
| `hunter04/rebirth-payout-is-25-and-100-hgold-in-v0717` | `§1t1523s0§.as:2644/:2646/:2650/:2652` and `:228` all verbatim; android `StatsManager.as:194` STAT_HGOLD=12 and `:2201-2207` = 20/5 ✓ | item 7 **falls**; DAN<9 ⇒ ranks 0-9 = exactly 10 |
| `hunter04/v0717-stance-switch-is-focus-gated-at-48-not-hard-locked` | `§1t99s0§.as:3050`, `:3060`, `:3162` verbatim. Checked the predicate the claim leans on: `§1t1525s0§.§1t9948s0§()` at `§1t1525s0§.as:1152-1154` = `return actionState == §1t9903s0§;` — structurally identical to `StageManager.as:1025-1028` `isBattle()`. So the `-= 48` **is** inside the battle branch. Android contrast confirmed at `MCSPlayer.as:2977` (`maxreload/6`) and `:3096-3105`. Frame: cropped `duel_dense/Nr4fQstqHDM_428.0.png` `(230,960)-(560,1070)` @4× — HP 20/20, Chi 26/26, third bar reads **CANNOT CHANGE STANCE** with no bright fill, exactly the `(reload-48)/(max-48) ≤ 0` state that `§1t113s0§.as:328` computes | `§3` item 4 at `:158` **falls**. Note the frame and the code agree; it was the ledger's *reading* of the frame that was wrong |
| `hunter04/web-v0717-crit-is-flat-1_3-vindicating-the-ledger` | `§1t99s0§.as:3274` = `return _loc2_ * 1.3 + this.§1t1243s0§;` under `:3272 if(reload == maxreload)`, **no Light special case**; `:3270` HEAVY/DUAL/REVERSED `* 1.4`. Android `MCSPlayer.as:3198-3223` uses ×1.2 / ×1.5-Light and stance ×1.5 ✓ | `:190` ② and `:195` ⑤ **fall**; crit is deterministic on a full bar. Minor: the mastery-9 ceilings are 0.86/1.18/1.40; the ledger's 0.9/1.2/1.4 is the mastery-**10** ceiling |
| `hunter04/web-v0717-per-stance-reach-coefficients-differ` | `§1t99s0§.as:3094` (LIGHT ×1.4), `:3116-3120` (HEAVY `(0.5+0.4·m·0.1)` floored 100), `:3131` (REVERSED ×1.4), `:3142-3146` (DUAL floored 100) all verbatim. `§1t1523s0§.as:2346-2347` = `_loc2_ = 90 + getStat(DAN)*5; return int(120 + Math.floor(_loc2_*param1/(20+param1)));`, `:104` stageWidth 800 ✓. Worked example reproduces: SPD1/DAN0 → 124 stage px; Light 173, Bal 124, Heavy max(62,100)=100; 1920/800 = 2.4 ✓ | `:190` ① **closes for the right build**. Minor cite drift: BALANCED is at `:3105` not `:3104`, and the android contrast lines are `:3030 / :3041 / :3052`, not `:3029 / :3042 / :3053` — values confirmed regardless |
| `hunter05/offline-sharedobject-save-path-exists` | (QUOTE_UNVERIFIED — false alarm). `QueryManagerBase.as:2907` and `:2917` both verbatim `sharedObject.data.equipment = StatsManager.getEquipmentString();`; `:2980` verbatim `StatsManager.parseEquipmentString(sharedObject.data.equipment);`. **Stronger than claimed**: `:2905 if(!this.offlineMode)` gates a *full* offline schema at `:2912-2929` — playerStats, skillStats, skillSlots, inventory, stash, questItems, intStats, achievementStats, booleanStats, activeQuestList, completedQuestList, playerlocation, taunt | `:351` "nothing to copy" **falls** on the save-format half |
| `hunter05/war-wave-table-is-340-plus-11-equals-351` | Parsed both blobs myself: **39 waves, 87 `<enemy>` rows, Σqty 351, buckets {400: 340, 700: 11}, ids 700-710** — identical result for web `bindata/119_1t4646s0.bin` and android `109_WarHexUI_SurvivalModeData.bin` | "kill cap 350" **falls**. Minor: "agree to the row" is loose — the files differ in md5 (11721 vs 11553 bytes) and in three `<id>` lists |
| `meta-social/achievements-list-is-on-disk` | Parsed `114_Mobile_AchievementData.bin` myself: plain UTF-8, `<achievementdata>`, **61 rows**; row 0 matches the quote character-for-character; **`desc == name + 80` holds for all 61**; `8058` 'Warrior III' / 'Defeat 340 in a war room attack.' (stat 60018, val 340) ✓; `8060` 'Be Awesome' / 'Completed Season 1' ✓ | `:245` ③ **closes on the achievements third** |
| `meta-social/kill-cap-is-351-not-350` | Same parse. `SHSD_MASTER_REFERENCE.md:170` verbatim `\| Kill cap (troops) \| 350 (= 340 troops + 10 samurai) \|`; `REBUILD_READINESS.md:244` carries "kill cap 350". The quoted web/android id-list difference is **exactly right** — web `449\|454\|449\|454\|443`, android `449\|454` (and likewise for 450/455 and 451/456). `npcdata.xml` has **no rows for 700-710**, consistent with live-player slots | decomposition corrected to **340 + 11** |
| `meta-social/world-board-is-a-coordinate-grid-not-a-japan-outline` | Opened `zFtCaTO0_1M/map/frames/frame_0025.jpg` (512×288) at 3× LANCZOS: header **"NAGANO (26,52) LEVEL: 9"**, uniform rounded-square tiles on a strict pitch (13 columns × 5 visible rows), one tile white-outlined, brown landmass painted *under* the tiles and bleeding across their borders, legend "VILLAGE TOWN CITY CASTLE TOWN DESTROYED QUEST" — every element of the quote is on screen | `:115` **falls**: it IS a lattice with integer coords. "Sparse" survives — you still need the mask |
| `meta-social/world-map-topology-is-a-bitmap-mask` | **The strongest claim in the packet.** `110_Mobile_MapBitmapData.bin` = GIF 63×72 P-mode, **735 non-black px**, `pixel(18,52) = (255,255,255)` — all three numbers reproduced exactly, and at 8× nearest-neighbour it is unmistakably Japan (Hokkaido, Honshu, Shikoku, Kyushu, Ryukyus). `WorldMapUI.as:208`, `WarSelectUI.as:15/17/19` verbatim. **I re-derived the transform the finding only asserted**: `WorldMapUI.as:440` prints `(terrX + DTERRSHIFTX, terrY + DTERRSHIFTY)` and `:21/:23` set `DTERRSHIFTX = TERRSHIFTX`, `DTERRSHIFTY = TERRSHIFTY` — so displayed→pixel collapses to `getPixel(x − WARMARKERSHIFTX, y) = getPixel(x−8, y)`. Displayed (26,52) → `getPixel(18,52)` → white. The shorthand is algebraically exact | `:245` ② **closes**; `:115` falsified; `:225` ①'s "trace the map image" close-path is moot |
| `meta/interactui-uidata-blob-is-utf8-not-utf16le` | First 38 bytes are literally `<?xml version="1.0" encoding="UTF-8"?>`; line 97 is verbatim the quoted `<option>…firerebirth…` row with its `<!-- "yes" useicon >=10 dan, no element boost-->` comment. UTF-16LE decode yields unusable garbage | the blanket UTF-16LE warning **falls** — already banked as correction **C1**. Minor: the garbage is 1 line by `\n`, not 3 |
| `npcdata/five-stances-are-in-the-web-build-too` | (QUOTE_UNVERIFIED — false alarm). All three web lines verbatim: `§1t4906s0§.as:90`, `§1t4907s0§.as:157`, `§1t122s0§.as:862`. Read the full web branch at `§1t4906s0§.as:90-97`: `getMastery(1500)→setStance(§1t12224s0§)` / `getMastery(1501)→setStance(§1t12223s0§)`, the exact shape of android `EnemyElite.as:160-167`. `MCSPlayer.as:33/:35` DUAL=3, REVERSED=4 ✓. `src/config/stances.ts:7` is verbatim `export type StanceId = 'light' \| 'balanced' \| 'heavy';` | "3 stances" **falls in the WEB build**, no parity hedge |
| `npcdata/spawn-level-comes-from-the-quest-wave` | (QUOTE_UNVERIFIED — false alarm). `NPCManager.as:131` verbatim `enemyWave[i].push(new NPCHolder(id,fatal,xpos,lvl));`; `:407` verbatim; `:877-879` and `:931-934` = `if(lvl != 0) { actor.setLevel(lvl); }`; `:608-621` ai30=FriendlyElite, ai34=FriendlyArcher ✓; `FriendlyElite.as:70` and `FriendlyArcher.as:58` both `this.setLevel(StatsManager.getLevel());` ✓. `NPC.as:241/:249` verbatim; `:253-259` is the `lvl<=10` clamp. **questdata line numbers are exact**: `:26101` `<id>190</id>` / `:26105` `<lvl>25</lvl>`; `:25862` `<id>191</id>` / `:25866` `<lvl>35</lvl>`. My own regex count: **169 `<enemy>` blocks, 160 carrying `<lvl>`** — the finding's number to the unit | ① "level→stat formula … absent" **falls**. Minor: `lvl = wave[i].enemy[j].lvl` is at `:114`, not `:113` |

---

## Machine-audit reconciliation
`citelint` flagged 5 claims `QUOTE_UNVERIFIED`. **All five were false alarms** — every quote
located. The pattern: the linter cannot resolve `strings.json["NNN"]` id lookups, cannot
grep XML fragments inside `.bin` blobs, and cannot match a quote that collapses a multi-line
AS3 block onto one line. It caught nothing here. Conversely, `citelint` returned `RESOLVES`
on all four claims I refuted — the failures were semantic, not mechanical, which is the
half a script cannot do.

## Cite-hygiene note for the board
Two systematic patterns worth a standing rule:
- **Ledger lines cited off by one.** `REBUILD_READINESS.md:241` (should be `:240`) in R1.
  A ledger cite that lands on the neighbouring bullet reads as RESOLVES to the linter.
- **Case-label vs assignment-line drift** in AS3 switch blocks (`:3104`/`:3105`,
  `:3029`/`:3030`, `:3042`/`:3041`, `:3053`/`:3052`, `:113`/`:114`). Harmless individually,
  but it is 6 occurrences across 3 claims.
