# t1-overturns-07 — HUNTER LENS review (blind critic, LENS 2)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-07.json` — **24 findings, 24 judged, 0 skipped.**
Every finding in this packet is stamped `verdict: HELD`; 22 of 24 also claim `overturns_ledger: true`.

**Headline result**

| | count |
|---|---:|
| findings judged | 24 |
| **REFUTED** | **4** (idx 0, 4, 5, 10) |
| survived | 20 |
| overturn claims checked | 22 |
| **overturn UPHELD** | **10** |
| **overturn REFUTED (inflated)** | **12** |

Twelve of the twenty-two claimed ledger overturns do not survive. Most are true statements
pointed at the wrong sentence: they answer a neighbouring question, or they restate something
`REBUILD_READINESS.md` already concedes in its own staleness banner (line 29), or — in three
cases — they **confirm** the ledger sentence they claim to kill.

---

## 0. Method

Every verdict below rests on an artifact I opened myself. Where a finding gave a formula I
re-implemented it and ran it; where it gave a count I re-counted; where it gave an image I
opened the image. Three findings were re-derived from scratch (the place-name LCG, the
dialogue display-list walker, the XP-curve extrapolation error).

---

## 1. REFUTED (4)

### idx 0 — `progression/stance-reach-multipliers-held` — REFUTED (material)
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116`

The finding's structure is right and its android quotes are verbatim
(`shs3_android/scripts/MCSPlayer.as:3030/3041/3052-3055/3078/3094` all confirmed, and
`StatsManager.as:1915-1918` really is `120 + Math.floor((90 + Dan*5) * spd / (20 + spd))`).

**But the constants it publishes as "the COMPLETE reach model" are ANDROID v0.682 numbers and
the WEB v0.717 build is tuned differently.** The web twin of `MCSPlayer.setStance` is
`§1t99s0§.§1t3489s0§`:

```
§1t99s0§.as:3094   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                              (Light)
§1t99s0§.as:3105   this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1); (Balanced)
§1t99s0§.as:3116   this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); floor 100 (Heavy)
```

| stance | android v0.682 | **web v0.717** |
|---|---|---|
| Light | ×1.5 | **×1.4** |
| Balanced | ×(1 + 0.005·mastery) | **×(1 + 0.02·mastery)** |
| Heavy | ×(0.5 + 0.005·mastery) | **×(0.5 + 0.04·mastery)** |

The web form is also the one that reconciles with `REBUILD_READINESS.md:155-156` ("Heavy's
*reach* also scales ×0.5→×0.9") and with the wiki's 300/200/100 shape. The finding carries
`build: None` and presents the android tuning unqualified — exactly the parity hole §0 warns
about. A recreation that ports these numbers ships the mobile build's reach.

Second correction: `slashLength` is **not a radial reach**. `InputManager` decrements
`distanceLeft` by the incremental arc length of the drawn polyline
(`InputManager.as:198, :353-367`), so `setMaxDistance` caps the **total drawn blade-path
length** in stage space, not tip-to-body span. The ledger's close-path ("measure blade-FX
tip-to-body span") was asking for a different quantity.

**overturn_upheld: TRUE.** Blocker ① at `REBUILD_READINESS.md:190` genuinely dies — reach is
now code-derived in stage px rather than footage-measured. It dies on the *web* cite above,
not on the android cite the finding supplied.

---

### idx 4 — `questdata-critic/overworld-is-generated` — REFUTED (material)
**own cite:** `reference/extracted/bindata/92_1t4648s0.bin` — 63×72 GIF89a, **735 non-black
pixels forming the Japanese archipelago** (opened and rendered to ASCII; Honshu, Hokkaido
top-right, Kyushu/Shikoku bottom-left are unmistakable)

The NodeGenerator half is exact and I confirmed all of it: `generateNode(nodex,nodey)` :330,
`generateRooms` :566, `getLocationType` :1539, `getRoomBG` :1570, `getNodeName` :1637;
`getNodeLevel` = `|terr.x-341| + |terr.y-341| + LEVELSTART(3)`, capped 200, at :385; room
backgrounds from a seeded `RNG.getRandAfterXTimes(groupid,0,4)` at :1548-1567. And the node
file really does hold **44 `<node>` of which 30 carry a `<name>`** — I re-measured both.
Web parity, which the finding flagged open, is now **closed**: `§1t70s0§.as:399` carries the
identical `Math.abs(x-341)+Math.abs(y-341)+LEVELSTART`.

**What is false is the headline and the lane impact.** "The overworld is PROCEDURALLY
GENERATED, **not authored**" and "there is **no finite authored geography** to recover beyond
44 story nodes" are both wrong. The set of territories that exist at all is an **authored
63×72 land-mask bitmap** shipped in the client:

* web v0.717 — `reference/extracted/bindata/92_1t4648s0.bin`, embedded at
  `§1t4648s0§.as:5`, loaded at `§1t1524s0§.as:698-702`, enumerated into territory ids at
  `§1t1524s0§.as:716-739` (`push(x + 341 << 12 | y + 341)` for every non-zero pixel).
* android v0.682 — `reference/extracted/android/110_Mobile_MapBitmapData.bin`, embedded at
  `Mobile_MapBitmapData.as:5`, enumerated at `QuestEngine.as:514-529`.
* **md5 `13068dfa1a5cc5628720a25782f93fed` on both — byte-identical. No parity hole.**
* The world-bounds predicate is `QuestEngine.hasTerritory(x,y)` at `QuestEngine.as:1204-1207`,
  using `WarSelectUI.TERRSHIFTX = 21`, `TERRSHIFTY = 51`, `WARMARKERSHIFTX = 8` — the same
  21/51 origin `REBUILD_READINESS.md:224` already records.

So it is a generator **seeded by node id inside an authored coastline**, not a generator
instead of a map.

**overturn_upheld: FALSE.** The sentence is `REBUILD_READINESS.md:225` blocker ①: *"world
bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories
via API; trace the map image."* The land mask **confirms** the parenthetical rather than
refuting it, and the finding supplies neither bounds nor geography. What actually kills that
sentence is the GIF — which this finding never cites. See §4, new finding NF-1.

---

### idx 5 — `questdata-critic/placename-generator-held` — REFUTED (minor)
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:148-151`

I re-implemented the generator from scratch (677-entry table from
`reference/extracted/bindata/98_1t4653s0.bin`, the 78-entry `namestarting` and 37-entry
`nameending` arrays from `NameGenerator.as:40/42`, and the LCG at `RNG.as:66-70` **including
the constructor's priming `rnd()` call at `RNG.as:18`**) and reproduced the finding's three
worked names exactly: **1405270 → Chikada, 1409366 → Kakuchi, 1397077 → Kasuta.** The
mechanism claim is fully sound.

**The override enumeration is wrong for the build the finding names.** The WEB v0.717 file it
cites has **three** hard-coded territory ids, not two:

```
§1t136s0§.as:140   if(param1 == 1405272)  return "Ibamaya";
§1t136s0§.as:144   if(param1 == 1524045)  return "Gokura";
§1t136s0§.as:148   if(param1 == 1519945)  return "Iwakuni";      <-- WEB ONLY
```

`shs3_android/scripts/NameGenerator.as:137-144` has only the first two. So the finding's
explicit "**no parity hole**" is false, and a recreation built to this recipe renders
territory 1519945 with a generated name instead of *Iwakuni*.

**overturn_upheld: FALSE.** Target is again `REBUILD_READINESS.md:225` blocker ① (world bounds
+ geography). Place naming is a neighbouring question — the finding's own text concedes it
("closed **for place naming**"). Nothing about bounds or geography follows from it.

---

### idx 10 — `questdata/placename-generator-DECODED` — REFUTED (minor)
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:148-151`

Same defect, worse provenance. This one asserts **"The v0.717 wilderness place-name
generator"** and labels `build: both`, but every cite is `shs3_android/scripts/`. v0.717 has
three overrides (above), so the stated recipe is wrong for the named build off android-only
evidence — the precise §0 build-parity failure.

Everything else in it I verified and it is excellent: `namestarting` = 78, `nameending` = 37,
78×37 = **2,886** ✓; all six decompositions present in the arrays ✓; and the brute-force
confirmations reproduce exactly — Chikada ← 736/1318/5590/6172, Kakuchi ←
9104/9686/10268/15122, Kasuta ← 2833/3415/3997/4579, all four each ✓.

**overturn_upheld: FALSE.** Same reason as idx 5.

---

## 2. SURVIVED but the OVERTURN is INFLATED (8 more)

### idx 8 — `questdata/dialogue-is-a-branching-VM` — claim HELD, overturn FALSE
**own cite:** `reference/extracted/questdata.xml:146-185`

Every count reproduced **exactly**: 715 `<goto>`, 163 `<label>` (label1×87, label2×38,
label3×25, label4×10, label5×2, label6×1), 196 `<option>`, 471 `<choice>`, 386 `<outcome>`,
194 `<set>`, 74 `<modify>` (69×'0', 3×'1', 1×'5', 1×'-1'), 386 `<end>`, 62 `<condition>`,
54 `<startin>`, 14 `<teleportnode>` + 14 `<teleportposx>`, 5 `<ending>`, 32
`<completedquest>`, 9 `<has>` / 9 `<comp>`. Outstanding work.

*Cite nit:* the outcome block quoted as ":164-167" is actually at **:162-166**.

**overturn_upheld: FALSE — `ledger_text` is empty.** No `REBUILD_READINESS.md` sentence is
named, so there is nothing to overturn. This is an **addition** to the ledger, not a
correction of it, and it should enter as one.

### idx 9 — `questdata/node-name-pipeline-END-TO-END` — claim HELD, overturn FALSE
**own cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:1637-1694`

I reimplemented the whole pipeline and it lands byte-exact. Node **8382465** → sector
(2046,2049) → territory (341,341) → tid 1397077 → `Kasuta`; terrSector (0,3), x≤1 → `W`;
bg 4 → `Forest`; result **"W Kasuta Forest" = `strings.json["1037"]`** ✓. Bonus check the
finding didn't run: node **8554512** → terrSector (0,0) → `NW` + `Kuniwashi` = **"NW Kuniwashi
Ruins" = `strings.json["1030"]`** ✓. Node 8726547 → `Yasuoka` ✓. The direction rule, the
seven bg nouns and `:1694 return dir + territoryName + " " + bgString` are all verbatim.

*Cite nit:* the quote labels `:314` as `var sectorx …`; :314 is the `getTerritorySector`
header and the assignment is at **:316**.

**overturn_upheld: FALSE — `ledger_text` is empty.** Addition, not overturn.

### idx 11 — `questdata/wave-encounter-table-and-pipe-grammar` — claim HELD, overturn FALSE
**own cite:** `reference/extracted/questdata.xml:11713-11719`

118 `<wave>` ✓, 169 `<enemy>` ✓, **36 distinct id specs** ✓, `19|20|21|22|23|24` ×74 ✓,
`86` ×24 ✓, `151` present ✓, 4 `<endless>` ✓, enemy `<lvl>` 2..35 ✓ and `<qty>` 1..10 ✓
(measured *inside* `<enemy>` blocks — measured over the whole file they read 1..80 / 0..1042,
so the scoping matters).

*Nit:* "70 `<friend>` blocks … **each** with `<fatal>0</fatal>`" — 70 `<friend>` ✓ but only
**59** carry a `<fatal>`; 16 more `<fatal>` tags sit outside friend blocks. All 75 values are
`0`, so the substantive half ("always 0 in shipped content") holds.

**overturn_upheld: FALSE — `ledger_text` is empty.** Addition, not overturn.

### idx 15 — `quests-story/payload-provenance-is-android` — claim HELD, overturn FALSE
**own cite:** `reference/decrypted/shs3_payload_decoded.swf` vs
`reference/decrypted/shs3_android_payload_decoded.swf` (both zlib-inflated by me)

```
web     11,892,053 inflated -> <questdata> 0 · <quest> 0 · <itemdata> 0 · <npcdata> 0 · <skilldata> 0
android 21,688,584 inflated -> <questdata> 1 · <quest> 61 · <itemdata> 1 · <npcdata> 1 · <skilldata> 1
web has <survivalmodedata> x1 and <animdata> x19  (the known 27 web blobs)
```
(My inflated sizes are 8 bytes under the finding's — header handling — immaterial.) The
provenance call is **correct and important**: `reference/extracted/{questdata,itemdata,
npcdata,skilldata}.xml` are **android v0.682** files.

**overturn_upheld: FALSE.** It names `REBUILD_READINESS.md:347*, the *Verbatim dialogue*
bullet. That sentence is a conditional — *"if the story is server-fetched and the server is
dead, the actual script is gone"* — and this finding **proves its antecedent**. Meanwhile the
"but we hold 3,307 verbatim lines" half is already conceded by the document's own staleness
banner at **`REBUILD_READINESS.md:29`**. So the finding restores the ledger's caution rather
than falsifying it. It belongs in the ledger as a *label* ("all four data XMLs are v0.682"),
not as an overturn.

### idx 16 — `quests-story/portraits-held-but-encrypted` — claim HELD, overturn FALSE
**own cite:** `reference/extracted/android/124_Mobile_ImageResource.bin` — 1,734,935 bytes,
opens `CWS|` followed by an encrypted body (`ResourceManager.as:186` runs
`decryptByteArray(ba, resourceFileNameArray[num].charCodeAt(1))`)

Verified: `QuestDialogueUI.as:46` and `:67-75` verbatim including `x = 800; y = 0` ✓;
`RESOURCE_IMAGE = 3` at `:37` ✓; `resourceFileNameArray` including `imageresource.swf` at
`:41` ✓; `PortraitBust.as:14 this.bust.scaleX = 2` ✓; `portrait_kojuro.as` present in
**exactly three** bundles (`shs3_payload`, `shs3_android`, `shs3_android_payload`) ✓.

The two asset families are **exactly right** — I counted the distinct `<img>` tokens in
`questdata.xml`: 68 distinct, of which **52 portraits** and **16 underscore-prefixed
splashes** (`_episode0`..`_episode12`, `_epilogue`, `_exposition`, `_exposition_epilogue`).

*Cite nit:* `mcname = "image" + id` is at **:277**, `mcname = "portrait_" + id` is at
**:293** — not :270/:286. Both resolve, both are 7 lines off.

**overturn_upheld: FALSE.** It names the staleness-banner row at `REBUILD_READINESS.md:29`,
which is about **dialogue** and which the document **already marks DISPROVEN**. Portrait art
is a neighbouring subject; and "held-but-encrypted" is by the finding's own admission still
**not recovered**, so it cannot falsify an unrecoverability claim in any case.

### idx 17 — `quests-story/questdata-is-live-updated` — claim HELD, overturn FALSE
**own cite:** `reference/decompiled/shs3_android_payload/scripts/Mobile.as:216, :244`

All six cite lines verbatim: `StatsManager.as:479 embeddedVersionArray[FILE_QUESTDATA] = 1`
(one of 18 such lines, :476-493), `:70 xmlFileIdArray = [0..9]`, `Mobile.as:216` the
`r.playerio.com/…/liveupdate/shs3_data_version.swf` URL, `:244`, `QuestEngine.as:281`,
`QueryManagerPIO.as:124`.

**overturn_upheld: FALSE.** Same sentence and same shape as idx 15: it strengthens
`REBUILD_READINESS.md:347`'s conditional; the half that would overturn it is already conceded
at `:29`.

### idx 18 — `quests-story/questitem-archetype-templates` — claim HELD, overturn FALSE
**own cite:** `reference/decompiled/shs3_android_payload/scripts/QuestItem.as:26-58`

17 `QUEST_*` templates at :26-58 ✓ and 20 `REASON_*` at :60-98 ✓, both exactly as listed.
`QuestType.as` really does carry 9 values with `length:int = 9` ✓. `QuestGenerator.as` writes
`questData.type = 3` in seven places ✓ and the runtime rewrites are at `QuestEngine.as:736`
(OngoingQuest) / `:752` (NormalSideQuest) / `:756` (HighLvlQuest) / `:760` (LowLvlQuest) ✓.

**overturn_upheld: FALSE.** The sentence it names — *"archetype taxonomy (story/normal/trade
+ bounty/escort/gather/timed)"*, `REBUILD_READINESS.md:229` — sits in the quests-story
**Ready** column, and the finding's own headline **confirms** it ("are **not invented** — they
are a second, real enum"). What the finding changes is *implementation strategy* (port a
generator, not a table), which that sentence never asserted.

### idx 21 — `quests-story/web-build-fetches-questdata` — claim HELD, overturn FALSE
**own cite:** `reference/extracted/payload.xml` (`grep -c binaryData` → **27**) +
`reference/decompiled/shs3_payload/scripts/§1t3318s0§.as:157`

Verified: the web payload's `[Embed(source="/_assets/…bin")]` set is exactly **92-98 and
100-119** — 19 animdata + 1 survivalmodedata + 1 room-object XML + 5 name lists + 1 GIF, and
**no** quest/item/npc/skill data. `§1t1524s0§.as:330-658` is a block of ~10 loaders that all
route through `§1t3318s0§.§1t3331s0§ → gameFS(gameid).getUrl("/data/" + name)` (`:157`).
`Mobile_QuestData.as:5` embeds `116_Mobile_QuestData.bin` on android only ✓.

**overturn_upheld: FALSE — the finding says so itself.** Its own text: *"the ledger's
antecedent is TRUE, not false: the script IS server-fetched on the shipped build."* A finding
that confirms a sentence cannot overturn it.

### idx 23 — `rebirth/dragon-dance-ui-art-is-held` — claim HELD, overturn FALSE
**own cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png` — 819×500,
**opened whole and looked at** (no crop needed; the ring fills the frame)

What is visibly in it, exactly as described: a **dark-red double outer ring**; **eight
green-outlined white kanji nodes** on that ring (all parked on 天 in this static export,
consistent with the word MC sitting at frame 1); an **inner dark-red bagua trigram ring** of
eight three-bar figures; a **black/white taiji centre** with the word **FIRE** across it; and
a red **X close button** top-right. Sizes confirmed: 1800 = 437×437, 1802 = 437×437, 1808 =
242×242, 1798 = 64×64, and `DefineSprite_1797_shs3_fla.dragondancewords_235` holds exactly
**58** frames. `§1t5495s0§.as:70-71` carries both element orders verbatim, and
`DragonDanceUI.as:359 / :364` are `word.gotoAndStop(num + 11)` / `(num + 31)` ✓.

**overturn_upheld: FALSE.** Blocker ④ at `REBUILD_READINESS.md:205` reads *"Dragon Dance
**input** + Kanji-statue bonus."* Art is neither. The finding concedes the input half was
closed by a different unit, and the **Kanji-statue bonus is untouched by anything here** — so
that sentence still names a live blocker.

---

## 3. SURVIVED with the OVERTURN UPHELD (10)

### idx 1 — `progression/unlock-rule-ends-in-0-or-5-false` — HELD, overturn UPHELD
**own cite:** `reference/extracted/skilldata.xml:255-257`
`<id>1004</id> / <displayname>6007</displayname> / <lvlreq>3</lvlreq>` verbatim, and
`strings.json["6007"] = 'Roll'` ✓. Full `<lvlreq>` domain measured: {3, 5×7, 10, 15×2, 20×5,
25, 30, 35, 40, 45, 50×6, 55, 60, 65, 70, 75, 80}.
`REBUILD_READINESS.md:77-78`'s *"skills unlock at levels ending 0 (Ninja) / 5 (Chi)"* is false.
**I found two counterexamples stronger than the one the finding used** (see NF-3): the
finding's *Roll* is `<category>5</category>`, a general skill, so a strict reading of the
Ninja/Chi rule could survive it. `Lay Trap` (cat 6 = Ninja) at lvlreq **15** and `Chi Charge`
(cat 4 = Chi) at lvlreq **50** break the rule inside its own two named families.
*Caveat to carry:* `skilldata.xml` is android v0.682 (idx 15).

### idx 2 — `progression/xp-curve-kills-three-more-docs` — HELD, overturn UPHELD
**own cite:** `docs/CALIBRATION.md:38` (opened) + `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
`docs/GAUNTLET.md:373-374` ✓, `docs/CALIBRATION.md:38` ✓ (real row-17 tail reads
`INFERRED (Stage-3 M2; the table itself is CONTRACT)` — the quote truncates the parenthetical,
substance intact), `REBUILD_READINESS.md:62` ✓ and `:93` ✓.
**I reproduced the −61.3 % figure exactly.** Extrapolating from `src/config/xp.ts`
(`XP_THRESHOLDS` L1-L10 + `XP_DELTA_STEP = 500`) against the shipped array: L20 +5.5 %,
L40 −15.5 %, L60 −37.4 %, **L80 −61.3 %**. Row 17's ±5 % gate would indeed have green-lit a
model that is off by a factor of 2.6.
*Class nit:* labelled A2, but these are project documents, not payload rows.

### idx 3 — `progression/xp-income-web-parity` — HELD (no overturn claimed)
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208`
Web `calcXP` (:185-208), grey-level (:115-129) and zero-difference (:131-183) are verbatim as
quoted, and I diffed them against android `NPC.as:94-112` / `:166-190` — **identical logic**.
`§1t4574s0§.as:39 xp = level * 2 + 20` ✓ and `§1t4902s0§.as:26 xp = level * 5 + 45` ✓.
(For the record, android's histogram puts `level*5+45` on Fox/Wolf/Bear/Stag/Deer/Civilian/
NianMonster/**EnemyPlayer**, and `level*2+20` on e.g. SorcererBoss — the "mob base / duellist
base" glosses are looser than the code, but the parity claim is what matters and it holds.)

### idx 6 — `questdata-critic/xp-curve-held-web` — HELD, overturn UPHELD
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
The array is real and I parsed it: **99 entries**, `[0,550,1450,2950,5150,8350,12150,16350,
20900,25900,31400,37400,…]`, tail `…,22095800,25395800,29395800`. Index 7 = **16350** ✓,
confirming the 16550 frame-read was wrong. Android twin at `StatsManager.as:78` ✓.
`REBUILD_READINESS.md:200` ② and `:350` both fall outright. (citelint's `QUOTE_NOT_LOCATED` is
an artifact of the quote's `…` ellipsis.)
*Aside:* the array runs to index 98 while the cap constant two lines up (`:362`) is 80.

### idx 7 — `questdata/archer-ai-firing-rule-and-gravity` — HELD, overturn UPHELD (one clause)
**own cite:** `reference/decompiled/shs3_android/scripts/EnemyArcher.as:271-300`
Every quoted line verbatim: `Projectile.as:8 GRAVITY:Number = 3` ✓, `:277` the
`GRAVITY*|dx|/0.866` solve ✓, `:281` the `velYa` solve ✓, `:286 velYa += Math.random()*8-4` ✓,
`ArrowProjectile.as:53/:56` ✓. **Web parity established** (the finding didn't claim it):
`§1t128s0§.as:8 = 3`, `§1t4539s0§.as:554-563` identical solve and identical jitter,
`§1t4545s0§.as:466` the KanjiGuardian's flatter `/(0.866/3)` ✓.
Two corrections: the finding names only the `level > 50` knockdown flip — `EnemyArcher.as:292/
:296` also give `level > 20` → 1/3 and `level > 10` → 1/4; and **the whole knockdown
mechanism is android-only** — the web archer's create-arrow call takes six args with no
`doLaunch`.
**overturn_upheld: TRUE for the "arrow arc physics" clause of `REBUILD_READINESS.md:220` ⑤.**
The same sentence's first clause, *"Undead damage-reflect probability"*, is untouched and
still a live blocker — the edit must be surgical.

### idx 12 — `quests-story/choices-are-consequential` — HELD, overturn UPHELD
**own cite:** `reference/extracted/questdata.xml:814-882`
`CutsceneManager.as:202-205` (`outcome.applyOutcome()`) ✓, `:93 this.currentDisplayNo = goto`
✓, `XMLQuestStep.as:193-201` (option pushes itself + one `null` per choice, so `<goto>`
indices address positions) ✓. `XMLQuestOutcome.applyOutcome` confirms the terminals:
`end == -1 → leaveCancel`, `end == 1 → leaveOK`, else `nextStep`.
**I built the display list myself and ran it.** There are exactly **195** `<option>` under
`<intro>` (plus 1 under `<ending>` = 196 in the file), and under a walk-to-terminal criterion
**85** of them reach differing (writes, terminal) — a superset of the finding's stricter 54.
Direction and conclusion confirmed. Web parity also confirmed: `§1t85s0§.as:196-206` has the
same null-padding and `§1t126s0§.as:198-217` the same dispatch.
**overturn_upheld: TRUE** — `REBUILD_READINESS.md:230` ④ *"are player choices consequential?"*
is answered YES from shipped data.

### idx 13 — `quests-story/choices-are-consequential-via-goto` — HELD, overturn UPHELD
**own cite:** `reference/extracted/questdata.xml:814-882`
I indexed that step's display list; it lands exactly where the finding says:
`goto 14` → index 14 (*"You said before that I'd be able to practice…"*) → outcomes at 16/17/18
(`113←8402944`, `114←4`, `102←0` + `end 1`); sibling `goto 19` → index 19 (*"I'll leave you to
your business."*) → outcome 20 (`modify 0`, `end 1`, **no writes**). "Zero choices carry an
`<outcome>` child" verified: **0 of 471**.
**overturn_upheld: TRUE** (same sentence as idx 12). *Note for the board:* idx 12 and idx 13
are the same finding from two critics; merge them, don't count the overturn twice.

### idx 14 — `quests-story/maxquests-cap-is-real` — HELD, overturn UPHELD
**own cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:164, :1262, :1291-1294`
`MAXQUESTS:int = 7` ✓; `addActiveQuests` gates on `activeQuestList.length < MAXQUESTS ||
forceAdd` and `return false` ✓; `addProcGenDailyQuest` gates at `:1313` and returns `-1` ✓;
**`setActiveQuest` (:1276-1301) pushes with no cap check at all** ✓. Identical line numbers in
`shs3_android/scripts/StatsManager.as` ✓. `QuestLogUI.as:89-93` really is `for(i=0;i<7;i++)`
with `x = 60, y = 73 + i*55` ✓.
**overturn_upheld: TRUE.** `REBUILD_READINESS.md:231`'s *"QUEST_LOG_CAP = 7 (1 story + 6
side)"* is false as written: the 7 is right, the parenthetical is not — there is no reserved
story slot, story steps **bypass** the pool.

### idx 19 — `quests-story/step-action-enum-closed` — HELD, overturn UPHELD (one third)
**own cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109`
All 15 `ACTION_*` constants verbatim at :81-109 (declared `internal static var`, which is why
citelint flagged the quote). Namespace confirmed at `QuestEngine.as:1214` and `:1239`;
`QuestAction.as:49 this.action = stepData.action` ✓.
**I recounted the domain over the file: 225 `<step>`, of which 215 carry an `<action>` —
`0`×169, `1`×37, `6`×5, `14`×3, `4`×1 — exactly as claimed** (the remaining 10 steps omit
`<action>` entirely and default to 0).
**overturn_upheld: TRUE, but only for one third of `REBUILD_READINESS.md:230` ③.** That
sentence reads *"per-quest trigger types + coords + rewards (sampled, not tabled)"* — the
trigger types are now enumerated **and** tabled per step; **coords and rewards are untouched**
and still sampled-not-tabled.

### idx 20 — `quests-story/step-action-is-gameengine-action-enum` — HELD (no overturn claimed)
**own cite:** `reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:1214-1219`
`if(questStepData.action == 6) { startingPosX = 150; }` at :1214-1216 ✓ against a default of
400 at :1213 ✓; `initBattleMode(quest, actionType, …)` at `GameEngine.as:990` ✓;
`Obj_NPCAggro.as:139` (`action == 6` → `putInDuelistHolder`) and `:214` (`action == 0` →
`interact()`) ✓. Same histogram as idx 19.
*Note:* duplicate of idx 19 — merge.

### idx 22 — `rebirth/dan-romaji-ladder` — HELD, overturn UPHELD
**own cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565`
The full ladder is a hardcoded ASCII switch in the WEB build: `0 → ""`, 1 nidan, 2 sandan,
3 yondan, 4 godan, 5 rokudan, 6 nanadan, 7 hachidan, **8 kyudan**, 9 judan, `default` judan —
with shogo suffixes `getString(465) = Renshi` (dan 3-5), `(466) = Kyoshi` (6-7),
`(467) = Hanshi` (8-9). Android twin at `PlayerPanel.as:381-414` is character-identical.
The kanji ladder is separately in the string table, `455 = 初段 … 464 = 十段` ✓ — so the
finding's "romaji in the inspect panel, kanji in the inventory sheet" split is real, and the
romaji really are **not** in `strings.json`.
**overturn_upheld: TRUE.** `REBUILD_READINESS.md:205` ③ *"Dan-rank count/titles (garbled
source)"* dies: 10 ranks, all titles held in two writing systems. It also settles §3 item 7 —
`kyudan` is `STAT_DAN 8` = displayed Dan 9, exactly as the finding says.

---

## 4. NEW FINDINGS (things I found while judging that nobody has claimed)

### NF-1 — **THE WORLD MAP IS HELD, BYTE-EXACT, IN BOTH BUILDS.** (HELD — overturns the ledger)
`reference/extracted/bindata/92_1t4648s0.bin` is a **63×72 GIF89a land mask with 735 non-black
pixels in the unmistakable shape of the Japanese archipelago.** I decoded and rendered it.
It is byte-identical to `reference/extracted/android/110_Mobile_MapBitmapData.bin`
(**md5 `13068dfa1a5cc5628720a25782f93fed` on both**). Every non-zero pixel *is* a territory:

* web:     `§1t4648s0§.as:5` embed → `§1t1524s0§.as:698-702` load →
  `§1t1524s0§.as:716-739` enumerate (`push(x + 341 << 12 | y + 341)`)
* android: `Mobile_MapBitmapData.as:5` embed → `QuestEngine.as:514-529` enumerate
* bounds predicate: `QuestEngine.as:1204-1207 hasTerritory(x,y)` using
  `WarSelectUI.TERRSHIFTX = 21`, `TERRSHIFTY = 51`, `WARMARKERSHIFTX = 8`

**This kills `REBUILD_READINESS.md:225` blocker ① outright** — *"① **world bounds +
geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via
API; trace the map image.*"* The parenthetical was right; the close-path is obsolete. We do
not need to mine the wiki and we do not need to trace anything: **we hold the map image.**
735 land territories, origin at territory 341 with the 21/51 display shift the ledger already
records at `:224`. This is the single largest unheld item this packet touches, and none of the
four world-exploration findings in it cites the file.

### NF-2 — **The stance reach multipliers differ between builds.** (HELD)
Web v0.717 `§1t99s0§.as:3094/:3105/:3116` = ×1.4 / ×(1+0.2·m·0.1) / ×(0.5+0.4·m·0.1);
android v0.682 `MCSPlayer.as:3030/:3041/:3052` = ×1.5 / ×(1+0.5·m·0.01) / ×(0.5+0.5·m·0.01).
The web form is the one that matches `REBUILD_READINESS.md:155-156` and the wiki's 300/200/100
shape. **Port the web numbers.** See idx 0.

### NF-3 — **The unlock rule breaks inside its own two named families.** (HELD)
`reference/extracted/skilldata.xml` — with categories resolved through `strings.json`:
`Lay Trap`, `<category>6</category>` (Ninja), `<lvlreq>15</lvlreq>`; and `Chi Charge`,
`<category>4</category>` (Chi), `<lvlreq>50</lvlreq>`. These falsify
*"skills unlock at levels ending 0 (Ninja) / 5 (Chi)"* (`REBUILD_READINESS.md:77-78`) without
relying on a general-category skill, closing the loophole in idx 1's argument.

### NF-4 — **A third hard-coded place-name override exists in v0.717.** (HELD)
`§1t136s0§.as:148-151` → `1519945 → "Iwakuni"`, absent from android
`NameGenerator.as:137-144`. See idx 5 / idx 10.

### NF-5 — **The archer's knockdown roll is android-only.** (HELD)
`EnemyArcher.as:288-300` builds a `doLaunch` flag and passes it to `createArrow`; the web twin
`§1t4539s0§.as:563` calls its create-arrow with **six** arguments and no such flag. Web
archers never knock down. Also `EnemyArcher.as:292/:296` add `level>20` → 1/3 and `level>10`
→ 1/4 tiers that idx 7 omits.

### NF-6 — **`slashLength` is an arc-length budget, not a radial reach.** (HELD)
`InputManager.as:198` seeds `distanceLeft = maxDistance`; `:353-367` subtracts the incremental
`Math.sqrt` length of each mouse-move segment along the drawn polyline. So the stance
"reach cap" caps **how long a line you may draw**, in stage space
(`(stageX - stageOffsetX) / stageScale`), not how far the blade extends from the body. Any
recreation that models it as a radius will feel wrong on curved slashes.

### NF-7 — **Web parity for `NodeGenerator` is closed.** (HELD)
idx 4 flagged it open. `§1t70s0§.as:399` carries
`Math.abs(_loc2_.x - 341) + Math.abs(_loc2_.y - 341) + this.§1t1138s0§` — the same
`getNodeLevel`. The overworld generator ships in both builds.

### NF-8 — **The XP array outruns the level cap.** (minor)
`§1t1523s0§.as:362` sets the cap constant to **80**; `:364`'s array has **99** entries
(indices 0-98). Either the cap was lowered without trimming the table, or ranks past 80 exist
in some mode. Worth a note before anyone hard-codes 99 levels.

---

## 5. What the board should do with this packet

1. **Do not let the four refuted findings enter as written.** idx 0 needs its constants
   swapped to the web values; idx 4 needs its "not authored / no finite geography" claim
   struck; idx 5 and idx 10 need the third override added and their parity claims removed.
2. **Twelve of twenty-two overturns must be downgraded to additions or labels** (idx 4, 5, 8,
   9, 10, 11, 15, 16, 17, 18, 21, 23). Three of them (15, 17, 21) actually *support* the
   sentence they were filed against; two (8, 9, 11) name no sentence at all.
3. **Merge the duplicate pairs** before counting overturns: idx 12 ≡ idx 13, idx 19 ≡ idx 20,
   idx 5 ≈ idx 10.
4. **NF-1 is the biggest single result in this review.** `REBUILD_READINESS.md:225` ① should
   be struck and replaced with a pointer to `reference/extracted/bindata/92_1t4648s0.bin`.
