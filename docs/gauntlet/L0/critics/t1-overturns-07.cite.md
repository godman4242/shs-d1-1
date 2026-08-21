# t1-overturns-07 — CITE LENS review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-07.json` — 24 claims, all ledger-overturn class.
Judged: 24/24. Skipped: 0.

Method: every cite opened by hand. Where the claim carried a measurable number I RE-MEASURED it
rather than reading the claimant's number. Three claims were tested by independent re-implementation
(the place-name LCG, the CutsceneManager display-walker, the payload zlib byte-check). One visual
claim was tested by opening the PNG and looking.

**Headline: 23 survive, 1 falls.** The one that falls (`progression/stance-reach-multipliers-held`)
falls on a build-parity hole I opened the WEB artifact to find — the numbers it hands L1 are the
Android v0.682 tuning and the shipped WEB v0.717 build measurably disagrees.

---

## REFUTED

### [0] progression/stance-reach-multipliers-held — REFUTED (material)

Its own cite is verbatim-perfect. `reference/decompiled/shs3_android/scripts/MCSPlayer.as` lines
3030 / 3041 / 3052-3055 / 3078-3081 / 3094 say exactly what the quote says, and I confirmed the base
term at `StatsManager.as:1915-1919`:

```
1917:  var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
1918:  return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
```

The problem is the build. The finding carries **no build label at all** and hands the ledger
"the COMPLETE reach model". I opened the WEB v0.717 twin — `§1t99s0§.as`, identified as MCSPlayer by
its 15-arg initPlayer at `:183-199` mapping param10 → `§1t4420s0§` (declared `= 10` at `:105`, the
`baseSlashLength:int = 10` of `MCSPlayer.as:107`), param13/14 → balanced/heavy mastery, and by
`:3158  §1t1541s0§.§1t10094s0§(this.§1t4417s0§)` = `InputManager.setMaxDistance(slashLength)`.

The multipliers are DIFFERENT:

| stance   | android v0.682 (claimed)            | **web v0.717 (measured)**            |
|----------|-------------------------------------|--------------------------------------|
| Light    | `base * 1.5`                        | `base * 1.4`            (`:3094`)    |
| Balanced | `base * (1 + 0.5*bMastery*0.01)`    | `base * (1 + 0.2*bMastery*0.1)` (`:3105`) |
| Heavy    | `base * (0.5 + 0.5*hMastery*0.01)`  | `base * (0.5 + 0.4*hMastery*0.1)` (`:3116`), floor 100 (`:3117-3119`) |
| Reversed | `base * 1.5`                        | `base * 1.4`            (`:3131`)    |
| Dual     | `base`, floor 100                   | same                    (`:3142-3145`) |

At mastery 9 the balanced multiplier is 1.045 (android) vs **1.18** (web); heavy is 0.545 vs **0.86**.
A recreation built to the claimed table will not match the filmed build. The BASE term does have web
parity — `§1t1523s0§.as:2346-2347` is byte-identical — so only the multiplier half fails.

Two smaller defects: `:3078` is `case DUAL_STANCE`, not "default"; and `REVERSED_STANCE` (`:3067`,
×1.5) is missing from a model advertised as complete.

The ledger blocker it targets (`REBUILD_READINESS.md:190` ①) **does** still die — the reach cap in
stage px per stance is fully recoverable — but on the WEB constants, not these.

---

## SURVIVING — with corrections that must ride along

### [5] questdata-critic/placename-generator-held — HELD, material correction
Mechanism reproduced from scratch. I re-implemented `RNG.rnd()` (`RNG.as:68`,
`seed*9301+49297 mod 233280`) and the two-array compose, and got **Chikada** from tid 1405270,
**Kakuchi** from 1409366, **Kasuta** from 1397077 — the three names the claim predicts, exactly.
`89_NameGenerator_PlaceNames.bin` is **677** entries; `namestarting` **78**, `nameending` **37**.

**BUT the web build has THREE hard-coded overrides, not two.** `§1t136s0§.as`:
```
140:  if(param1 == 1405272) { return "Ibamaya"; }
144:  if(param1 == 1524045) { return "Gokura";  }
148:  if(param1 == 1519945) { return "Iwakuni"; }   <-- unmentioned
```
Android `NameGenerator.as:135-144` has only the first two. So the claim's build line
*"web v0.717 (identical logic in android v0.682) — no parity hole"* is **false** — the parity hole is
precisely here. Build to the stated spec and territory 1519945 renders the wrong name.

### [10] questdata/placename-generator-DECODED — HELD, minor mis-cites
Same mechanism, brute-force list confirmed: 736/1318/5590/6172 → Chikada, 9104/9686/10268/15122 →
Kakuchi, 2833/3415/3997/4579 → Kasuta. All twelve reproduce.
Mis-cites: `NameGenerator.as:152` is `}` (the split is at **145**) and `:169` is the blank last line
(the compose-return is at **165**). And `build: both` is wrong for the same override reason as [5];
"special-cases two territory ids" is true of android only.

### [11] questdata/wave-encounter-table-and-pipe-grammar — HELD, one number wrong
Census reproduced exactly: 118 `<wave>`, 169 `<enemy>`, **36** distinct id specs,
`19|20|21|22|23|24` ×74, `86` ×24, lvl 2..35, qty 1..10, 4 `<endless>` at 11719 / 18120 / 25350 /
26107, 70 `<friend>`. Ids resolve exactly (`resolved_names.json` npcdata 86 Undead · 19 Soldier ·
40 Cultist · 11 Bandit · 151 Jinbei).
Correction: **59 of 70** `<friend>` blocks carry `<fatal>`, not all 70. There are 75 `<fatal>` in the
file (16 sit outside `<friend>`); every one of them is `0`, so "always 0 in shipped content" holds.

### [12] quests-story/choices-are-consequential — HELD, count off by 2
I built the display list per `XMLQuestStep.getXMLIntroList` (`:160-213`) and walked it under
`CutsceneManager.gotoStep` (`:80-101`, `this.currentDisplayNo = goto` at `:93`). My walker over the
218 `<intro>` blocks finds **195 multi-choice options, 56 divergent** — the claim says 54. Same
magnitude, mechanism confirmed. Cite line drift: the `case "outcome"` block is 202-205, cited 203-206.

### [3] progression/xp-income-web-parity — HELD, glosses unsupported
`§1t68s0§.as:185-208` is verbatim exact. `§1t4574s0§.as:39` = `xp = level * 2 + 20` and
`§1t4902s0§.as:26` = `xp = level * 5 + 45` are exact. But the labels "(mob base)" / "(duellist base)"
do not survive contact with the android names: `*5+45` is used by 13 classes (Fox, Deer, Wolf, Bear,
Civilian, **EnemyPlayer** …) and `*2+20` by two (Zombie, SorcererBoss). Also the grey-level range
`:120-128` is really 122-130. The web-parity thesis itself is sound.

### [4] questdata-critic/overworld-is-generated — HELD
`NodeGenerator.as` 330 / 566 / 1539 / 1570 / 1637 all resolve verbatim.
`112_Mobile_NodeData.bin` (decode **UTF-8**, not UTF-16LE) holds exactly **44** `<node>`.
"30 carry a `<name>`" is true under *any* `<name>` in the block; only **16** carry a node-level one.

---

## SURVIVING CLEAN

- **[1] unlock-rule-ends-in-0-or-5-false** — `skilldata.xml:255-257` exact; `strings.json["6007"]='Roll'`.
  Measured lvlreq ladder is 3,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80 — one skill at **3**,
  which breaks the rule at `REBUILD_READINESS.md:78`. The bullet starts at :77, so ":77" is fine.
- **[2] xp-curve-kills-three-more-docs** — `GAUNTLET.md:373`, `CALIBRATION.md:38` (row 17),
  `REBUILD_READINESS.md:62` and `:93` all carry the dead statement. I recomputed row 17's own
  extrapolation (+500/level from the 5500 tail): **1,658,900 at L80 vs a real 4,285,800 = −61.3%**,
  the exact figure claimed. The ±5% gate would have green-lit a refuted model.
- **[6] xp-curve-held-web** — `§1t1523s0§.as:364` holds a **99-entry** array, `[0,550,1450,2950,5150,
  8350,12150,16350,20900,25900,31400,…,25395800,29395800]`, named `expArray` in the android twin at
  `StatsManager.as:78` and consumed at `:1591` (`if(expArray[q] > currentXP)`). index 7 = **16350**.
  The QUOTE_UNVERIFIED flag is an artifact of the ellipsis; the quote is exact.
- **[7] archer-ai-firing-rule-and-gravity** — `Projectile.as:8 GRAVITY:Number = 3`, `EnemyArcher.as`
  277/281/286 and `ArrowProjectile.as:56` all verbatim; `EnemyGoblinThrower.as:555` identical solve;
  `EnemyKanjiGuardian.as:464` divides by `(0.866 / 3)`. `Damage.LAUNCH_KNOCKDOWN` real
  (`ArrowProjectile.as:39`). Its android-only build label is *understated*: web `§1t128s0§.as:8` is
  also `= 3` and `§1t4539s0§.as:551-565` is the same solve with the same ±4 jitter.
- **[8] dialogue-is-a-branching-VM** — every count reproduced: 715 goto, 163 label
  (label1×87 label2×38 label3×25 label4×10 label5×2 label6×1), 196 option, 471 choice, 386 outcome,
  194 set, 74 modify (0×69, 1×3, 5×1, −1×1), 386 end, 62 condition, 54 startin, 14 teleportnode,
  14 teleportposx, 5 ending, 32 completedquest, 9 has/comp. Cite lines 146/148/152/150/154/161/178/185
  are exact; only the `:164-167` outcome range drifts (real 162-166).
- **[9] node-name-pipeline-END-TO-END** — the strongest claim in the packet. `questdata.xml:15` is
  `<node>8382465</node>`; `112_Mobile_NodeData.bin:5-6` is `<id>8382465</id>` / `<name>1037</name>`;
  and `strings.json["1037"]` is literally **`W Kasuta Forest`**. I re-derived it: sector (2046,2049) →
  territory (341,341) → tid 1397077 → my LCG gives `Kasuta`; terrSector.x = 0 → `W` (`:1651-1655`);
  bg 4 → string 1003 `Forest`; `:1694 return dir + territoryName + " " + bgString`. Exact match.
  Direction ids 398 N / 399 S / 400 E / 401 W and bg nouns 1002/1003/1006/1015/1020/1021/1022 all
  confirmed. Inner quote line refs run 1-2 lines early (`:314` is the signature; the split is 315-318).
  This also closes ledger blocker `:225` ⑤ (sector↔room), which the finding did not name.
- **[13] choices-are-consequential-via-goto** — cite is exact to the line, typo and all
  (`:820-822`, `:824-826`, `:860`, `:865`, `:870`, `:879`). I rebuilt the display list for that intro:
  index 14 = "You said before that I'd be able to practice…" → outcomes 113/114/102, index 19 =
  "I'll leave you to your business." → `<modify>0</modify><end>1</end>`. The gotos land exactly.
  "zero choices carry an `<outcome>` child" — measured 0. Correct.
- **[14] maxquests-cap-is-real** — `StatsManager.as:164/1252/1262/1273/1313/1323` verbatim in BOTH
  android bundles at identical line numbers. `setActiveQuest` (`:1276-1301`) pushes with no
  MAXQUESTS check, so the ledger's "(1 story + 6 side)" gloss at `:231` is wrong — no reserved slot.
  `QuestLogUI.as:89-93` confirms the 7-row scroller at x=60, y=73+55i.
- **[15] payload-provenance-is-android** — I re-ran the byte-check. Inflating both SWFs:
  web body 11,892,053 B → `<questdata>` 0, `<quest>` 0, `<itemdata>` 0, `<npcdata>` 0, `<skilldata>` 0,
  `'A new face in this territory'` 0 (utf-8 AND utf-16le); android body 21,688,584 B → 1/61/1/1/1/1.
  Validity holds: web blobs are stored uncompressed (first 200 B of `119_1t4646s0.bin` and
  `94_1t4651s0.bin` both found inside the inflated web SWF). Hardest proof, which the claim did not
  give: **`reference/extracted/questdata.xml` (796,383 B) is the payload of
  `reference/extracted/android/116_Mobile_QuestData.bin` (796,384 B)** — the blob contains it verbatim.
  mtimes as stated: XMLs 18:27, web SWF decoded 18:33, android decoded 17:38.
- **[16] portraits-held-but-encrypted** — `QuestDialogueUI.as:46` and `:67-75` verbatim (x=800, y=0).
  `ResourceManager.as:37 RESOURCE_IMAGE:int = 3`; the `"image"+id` / `"portrait_"+id` statements are
  at 277 / 293 inside the cited 270 / 286 functions. `PortraitBust.as:14 bust.scaleX = 2`.
  `portrait_kojuro.as` exists in exactly three bundles. And the counts are exactly right: the
  `<img>` domain in questdata.xml is 68 tokens = **52** portraits + **16** leading-underscore splashes
  (`_episode0.._episode12`, `_epilogue`, `_exposition`, `_exposition_epilogue`).
  `124_Mobile_ImageResource.bin` opens `43 57 53 7c` — `CWS|`, the S0-5 nested-CWS class. The claim
  correctly says held-but-encrypted, not recovered.
- **[17] questdata-is-live-updated** — `StatsManager.as:479` and `:70`, `Mobile.as:216` and `:244`,
  `QuestEngine.as:281`, `QueryManagerPIO.as:124` — all six verbatim exact. Embedded version = 1 for
  all ten files (`:476-488`).
- **[18] questitem-archetype-templates** — `QuestItem.as:26-58` = 17 `QUEST_*`, `:60-98` = 20
  `REASON_*`, every value verbatim. `QuestType.as` really is 9 (`length:int = 9`). `QuestGenerator.as`
  writes `questData.type = 3` at ten sites; rewrites at `QuestEngine.as:752/756/760`.
  Mild stretch: only TRADE and BOUNTYBOARD map cleanly to the ledger's taxonomy; escort/gather/timed
  are the claimant's reading.
- **[19] step-action-enum-closed** and **[20] step-action-is-gameengine-action-enum** — near-duplicates,
  both hold. `GameEngine.as:81-109` is the 15-value `ACTION_*` enum, values 0-14 exactly as quoted
  (modifier is `internal static var`, which neither quote misstates). I censused step-level `<action>`
  myself: **169×0, 37×1, 5×6, 3×14, 1×4** — exactly the claimed domain, over 215 of the 225 steps
  (10 steps carry no step-level `<action>`; "the 225 shipped steps use five" is loose by that much).
  `QuestEngine.as:1214/1216/1239/1243`, `GameEngine.as:990`, `QuestAction.as:49`,
  `Obj_NPCAggro.as:139/214` all verbatim (initBattleMode call is at 1218, cited 1219).
- **[21] web-build-fetches-questdata** — `QuestEngine.as:281-291`, `Mobile_QuestData.as:5`,
  `QueryManagerPIO.as:124` verbatim; `grep -c binaryData payload.xml` = **27**; 'Jinbei the Bandit
  King' in exactly 2 files. I closed the web half the claim only gestured at: `§1t3318s0§.as:151-158`
  is `getDataXML` byte-for-byte (`getUrl("/data/" + param1)`), and `§1t1524s0§.as:328-658` is the run
  of URLLoader fetchers that call it — the web twin of `loadExternalXML` (`QuestEngine.as:215-223`).
- **[22] dan-romaji-ladder** — `§1t408s0§.as` switch at 532-566 (cited 531-564) with `:558-562`
  verbatim; android twin `PlayerPanel.as:382-416`. The suffix is the shogo: `strings.json` 465
  **Renshi**, 466 **Kyoshi**, 467 **Hanshi**; 455-464 are the kanji ladder (初段…十段). kyudan at
  case 8 → displayed Dan 9, as claimed. The romaji really are ASCII literals, not table entries.
- **[23] dragon-dance-ui-art-is-held** — **I opened the PNG and looked.**
  `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png`, 819×500, viewed whole at native
  size. Visibly present: two concentric dark-red outer rings; eight green-outlined white circular
  kanji nodes; an inner dark-red bagua trigram ring between two thin dark-red circles; a black/white
  taiji centre with `FIRE` set across it; a red X close button top-right. Every element of the
  description is there. Companion sprites all match their stated sizes (1800 437×437, 1802 437×437,
  1808 242×242, 1797 39×40 ×**58** frames, 1798 64×64). `§1t5495s0§.as:70-71` verbatim;
  `DragonDanceUI.as:359 gotoAndStop(num + 11)` / `:364 gotoAndStop(num + 31)` verbatim — frames
  11-18 and 31-38, both inside the 58-frame strip.

---

## NEW — found while judging, unclaimed by anyone

1. **WEB v0.717 stance reach multipliers diverge from Android v0.682.** Full table above.
   `§1t99s0§.as:3094, :3105, :3116-3119, :3131, :3142-3145`. This is the correct reach model for
   the filmed build and it is what L1 should port.
2. **A THIRD hard-coded place-name override exists in web v0.717:** `§1t136s0§.as:148-150`,
   `1519945 -> "Iwakuni"`. Absent from android. Any port of the generator needs all three.
3. **Projectile gravity and the ballistic solve have web parity.** `§1t128s0§.as:8` = `3`;
   `§1t4539s0§.as:551-565` reproduces the archer solve with the same ±4 jitter. #7's android-only
   caveat can be retired for the gravity constant and the trajectory.
4. **`<fatal>` census:** 75 tags in questdata.xml, all `0`; only 59 of the 70 `<friend>` blocks
   carry one.
5. **`reference/extracted/questdata.xml` is the verbatim payload of
   `reference/extracted/android/116_Mobile_QuestData.bin`** (796,383 of 796,384 bytes) — the single
   cleanest proof of the android provenance in [15].
