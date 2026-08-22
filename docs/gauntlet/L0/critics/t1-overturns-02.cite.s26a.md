# BLIND CITE REVIEW — packet `t1-overturns-02` — reviewer s26a

Packet size 24. Judged 24. Skipped 0.
Every verdict below rests on an artifact **I opened myself** in this session.
Lens: over-claiming. Default was refute; three findings earned it.

**Headline:** 21 of 24 survive, most of them with exact verbatim cites. Three are refuted:

| id | why |
|---|---|
| `hunter05/writ-of-release-is-5-gold-not-25` | **THE FRAME WINS.** The v0.717 shop screen reads **25 gold**. |
| `parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android` | the 21/27 census is exact; "the ENTIRE character-animation layer" is false — 5 animdata blobs differ. |
| `hunter/audio-blocker-is-the-right-target-for-the-sfx-names` | repeats the dead S0-5 "waveforms remain CWS-encrypted" line, which correction **C3** killed and which I re-disproved by decoding the blob. |

Two more findings hold factually but **do not overturn the sentence they name**
(`shielder-prop-block`, `territory-owners-are-open-ended`), and one *confirms*
rather than overturns its named sentence (`war-room-rules-are-seven-pages`).

---

## 1. THE BIG REFUTE — `hunter05/writ-of-release-is-5-gold-not-25`

The finding says `REBUILD_READINESS.md:216`'s *"Writ of Release 25g now double-confirmed"*
is "contradicted by the shipped data" and that "the ledger's banked price is **5× too high**",
on the strength of `reference/extracted/itemdata.xml:2328-2335`
(`<id>2203</id> … <baseprice>0</baseprice><heavenlyprice>5</heavenlyprice>`).

I verified the datum. It is exactly there, and the four 5-gold items are exactly the ones named:

```
2200 'Amnesia Scroll'      base 0  hgold 5
2203 'Writ of Release'     base 0  hgold 5
2207 'Name Change Scroll'  base 0  hgold 5
2212 'Clan Deed'           base -  hgold 5
```

**Then I opened a frame.** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg`
(1024×576; crop **(330,95)–(1000,230)** upscaled ×3 LANCZOS) is the Ninja-Services BUY
screen. The detail panel reads, in the game's own type:

> **WRIT OF RELEASE** · OWNED: 0 — item icon carrying a **`25`** badge beside the gold-coin glyph

and the two scroll tiles in the grid (crop **(330,55)–(620,300)** ×5 LANCZOS) both carry
**`25`** price badges. Corroborated at `docs/research/video-study/segments/B-17-…md:31`
("price 25 gold") and by two archived Kongregate threads
(`docs/research/KONGREGATE_FORUM_FINDINGS.md:385`).

**STANDING INVARIANT INVOKED — THE MEASUREMENT DOC AND THE FRAME DISAGREE, AND THE FRAME WINS.**
`itemdata.xml` is an **android v0.682** artifact (correction **C2**: the web payload carries
zero `<itemdata>` root anywhere). The finding's build label —
*"both (itemdata id sets identical across builds)"* — is precisely the circular parity
claim C2 forbids, and it is wrong here in a way that is now measurable: **web v0.717
charges 25 gold, android v0.682 charges 5.** The ledger sentence stands; the finding
would have written a 5×-wrong CONTRACT price into it.

The android number is still worth banking — as a **v0.682 divergence**, not a ledger correction.

## 2. `parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android` — REFUTED on the over-claim

I ran the census myself. The headline is **exactly right**: 27 web files, 42 android files,
**21 md5 matches**, and the finding's 21-item list is correct to the filename, including
`md5 6852a591ab2d5895090b3d37ccec9ba2` for both `reference/extracted/bindata/103_1t4630s0.bin`
and `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin`. Bank that.

What is false is *"including the **ENTIRE** character-animation layer"* and the
lane conclusion *"this makes **every** `<anim … d="N">` duration an unqualified
web-build CONTRACT"*. Five of the nineteen web `animdata` blobs have **no** byte-identical
android twin, and they are not near-misses:

| web blob (root `animdata`) | bytes | nearest android | bytes | Δ |
|---|---|---|---|---|
| `100_1t4627s0.bin` (ogre_*) | 184,193 | `91_MCSCharacter_OgreAnimationData.bin` | 184,120 | −73 |
| `102_1t4629s0.bin` (skills: shunpo/flurry/deathtouch…) | 333,768 | `93_MCSCharacter_SkillsAnimationData.bin` | 338,096 | **+4,328** |
| `111_1t4638s0.bin` (guardian_*) | 117,638 | `102_MCSCharacter_GuardianAnimationData.bin` | 117,596 | −42 |
| `113_1t4640s0.bin` (spear_*) | 153,258 | `104_MCSCharacter_HumanSpearAnimationData.bin` | 132,270 | **−20,988** |
| `114_1t4641s0.bin` (spider_*) | 90,473 | *none* — `grep -rl spider_idle reference/extracted/android/` returns nothing | — | — |

14 of android's 18 `MCSCharacter_*` blobs match; four do not, and the web build carries a
**spider** animation set the android bindata set does not have at all. `flinch d=8`
happens to live in `103` (matched), so that specific example survives — but the general
licence the finding hands out does not.

## 3. `hunter/audio-blocker-is-the-right-target-for-the-sfx-names` — REFUTED

The SFX-name half is **better than claimed**. `§1t113s0§.as:352`, `§1t406s0§.as:1226` and
`§1t99s0§.as:3379` are verbatim correct, my own count of unique `"Snd_*"` literals across
`reference/decompiled/shs3_payload/scripts/` is **43**, and I found the whole inventory on a
single line — `reference/decompiled/shs3_payload/scripts/§1t88s0§.as:56` declares all 43 names
in one array (a much cleaner cite than three scattered call sites).

But the finding's load-bearing corrective is dead. It asserts *"the waveforms remain
CWS-encrypted per Stage-0b S0-5"* and prescribes the ledger edit *"event names HELD,
**params still INFERRED**, not audio closed"*. Correction **C3** killed S0-5, and I
re-killed it first-hand rather than take it on trust. Implementing
`ResourceManager.decryptByteArray` (`reference/decompiled/shs3_android/scripts/ResourceManager.as:200-217`
— bytes 3..255 only, swap `ba[i]`↔`ba[i+256]` when `i%11==0`, then `^= key`, key `'o'`=111
from `:186`) over `reference/extracted/android/122_Mobile_SoundResource.bin` yields:

```
magic b'CWS\x11\xbfs\x00\x00'   ver 17   declared len 29631
inflated 29623
tags [(1,1),(9,1),(14,13),(45,1),(69,1),(76,1),(77,1),(82,1),(86,1)]
DefineSound ids [1..13]  (13 tags)
SymbolClass: deflect die2 sumo slash3 die3 refund die1 slash2 slash1 goodkoto hitmetal fart punch
```

Thirteen real waveforms with names attached. The finding also mis-cites its ledger target:
the *"① **ALL AUDIO** — every SFX + music param is INFERRED"* sentence is
`REBUILD_READINESS.md:240`, not `:241` (`:241` is that section's `**Surface:**` line).

The named sentence **does** fall — harder than the finding allows — but not for the reason it gives.

---

## 4. Findings that hold but MISS THE SENTENCE THEY NAME

**`enemies-ai/shielder-prop-block-is-a-second-block-mechanic`** — code verbatim, exact.
`EnemyShield.as:331-340` is character-for-character what the finding quotes, `:353`
`damage *= 1.5;` under `behead`, `:362` `gotHitCounter = 12;`. The `PART_prop` branch
(zero damage + `gotHitFlag = true` + `gotHitCounter = 24` + `SoundManager.instance.playHitMetal()`)
is real and is genuinely new. But:
- the named ledger sentence, `SOURCE_CONSTANTS.md:258`, reads *"there is no **counter/parry/riposte**
  mechanic at all"*, and `COUNTER_BONUS` is a **stance-triangle damage multiplier**
  (`MASTER_SPEC.md:148`: *"if `STANCE_BEATS[attacker]===defender`, ×COUNTER_BONUS"*). A shield
  that eats damage is not a counter. **The sentence does not fall.**
- the finding paraphrases `:258` as *"no block at all"*. It does not say that, and
  `SOURCE_CONSTANTS.md:365` already banks *"mobs can block with the weapon hitbox (part 3 → 0 damage)"*.
- two of its supporting cites are the **opposite** case: `EnemyNianMonster.as:374` and
  `EnemyWolfAlpha.as:470` group `PART_weapon` with `PART_head`/`PART_neck` under
  `damage *= 2; behead = true;`. The "weapon whiff" rule is not universal.

**`hunter04/territory-owners-are-open-ended-not-four`** — all twelve string ids verified
verbatim (`["275"]`–`["278"]` the four clans, `["491"]` `'Neutral'`, `["4400"]` `'Clan Deed'`,
`["4405"]` `"Edit your Clan's name, acronym, color and banner"`, `["834"]`/`["835"]` the
Minor/Major Clan territory-count strings). The frame holds too: I opened
`reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg` at ×2 whole-frame and at the
finding's own crop **(700,160)–(780,230)** ×8 — the castle-town tile flies a **black** banner
with a white circular mon, and red/green/blue/gold banners are all visible elsewhere in the
same frame. Five banner colours on one screen. But the named sentence is `:245 ②`
*"War-Room **map topology** (board/adjacency)"*, which is about the **board**, not the
**owners**. The sentence that actually falls is `:244`'s Ready-column *"4 clans"*.

**`frames/v0717-war-room-rules-are-seven-pages`** — the strongest A1 in the packet, and its
named sentence *confirms* rather than falls. I opened all three frames at the finding's own
crop **(30,20)–(1000,420)** ×1.6 LANCZOS:

- `frame_0011.jpg` → **WAR ROOM RULES 1/7 (JOINING A BATTLE)**
- `frame_0012.jpg` → **WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)**
- `frame_0013.jpg` → **WAR ROOM RULES 6/7 (BUILDING STRUCTURES)**

against `strings.json["369"]`…`["379"]` (`1/6`…`6/6`) and `ui_strings.txt:189-194`
(`1/6`…`6/6`, with `5/6 (WINNING AND LOSING)` / `6/6 (rank)` — itself a third ordering).
Three sources, three page counts. **THE FRAME WINS: seven pages.**
The named target is the S0-3 caveat *"UI copy … parity is NOT established"* — this is
**evidence for** that caveat, not an overturn of it. Discharging it into an enumerated diff
is valuable; calling it an overturn is not. One small over-reach in the text: pages 1–3
line up by number, so "any android rule text ported by page number lands on the wrong page"
only bites from page 4 or 5 onward.

---

## 5. The eighteen clean survivors — what I actually opened

- **`hunter/all-24-elemental-skills-fully-specced`** — ElementTree parse of `skilldata.xml`
  found **24 of 24** ids present. `1029` Fire Kunai chi 3 cd 2 · `1013` Fire Breath chi 5 cd 15 ·
  `1070` Inferno `<chi>50</chi><cooldown>60</cooldown>`, `desc` → `strings.json["6143"]` =
  `'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'` · `1056`/`1060` `<passive>1</passive>`.
  All four `Big*Projectile` constructors carry `damage * 1.5` with physical 0, **and I found the
  web twins**: `§1t8338s0§.as:23`, `§1t8343s0§.as:24`, `§1t8341s0§.as:24`, `§1t8334s0§.as:27`.
  *Caveat:* the eight Dragon-Dance rows are passives with empty `<chi/>`/`<cooldown/>`, so
  "a full level row … with `<chi>`, `<cooldown>`" is loose for 8 of 24; and `skilldata.xml`
  is android-sourced per C2, so the chi/cd numbers are v0.682-grade even though the ×1.5
  is web-confirmed.
- **`hunter/dragon-dance-input-rule-held`** — `§1t5495s0§.as:382` and `:70`, and the
  deobfuscated twin `DragonDanceUI.as:367`/`:369`, verbatim. Node array index 1/2/4/6 =
  wind/water/earth/fire. Exact.
- **`hunter/elemental-atk-vs-def-formula-held`** — `MCSPlayer.as:3347`, `:3351`, `:3420` and
  `StatsManager.as:1836` all verbatim; `initElementDefenseStats`'s signature
  (`MCSPlayer.as:260`) confirms the argument order, so `earthDef ← FIREATK` really is the
  code-side element wheel. **I additionally confirmed the build label "both"** — the web
  payload carries the identical structure at `§1t99s0§.as:4336-4339` (four channels minus
  four def stats), the same 1-floor at `:4346-4352`, and the same five-term
  `setHP` at `:4400`. Closes `:205 ②` outright.
- **`hunter/ten-kanji-dan-ranks-in-string-table`** — citelint's `QUOTE_UNVERIFIED` is a
  false alarm: `strings.json["455"]`–`["464"]` are `(初段)(弐段)(参段)(四段)(五段)(六段)(七段)(八段)(九段)(十段)`,
  ten and then it stops (`["465"]` is `'Renshi'`). The romaji ladder at `§1t408s0§.as:532-565`
  runs `case 0:""` → `case 9: "(judan)"`, ten cases. Two independent artifacts.
- **`hunter04/full-xp-table-l1-to-l80-is-in-both-builds`** — parsed both arrays:
  `StatsManager.as:78` and `§1t1523s0§.as:364` are **99 entries and element-for-element
  identical**. idx1-10 = 550…31400 (matches `REBUILD_READINESS.md:77`), idx79 = 4,025,800,
  idx98 = 29,395,800. Blocker `:200 ②` dies.
- **`hunter04/rebirth-payout-is-25-and-100-hgold-in-v0717`** — `§1t1523s0§.as:2644/2646/2651/2653`
  and `:228` (`= 12`) verbatim; android `StatsManager.as:194` (`STAT_HGOLD:int = 12`) and
  `:2201-2211` (20 / 5) verbatim. The `DAN < 9` cap independently fixes the ladder at ten.
- **`hunter04/v0717-stance-switch-is-focus-gated-at-48-not-hard-locked`** — `§1t99s0§.as:3050`,
  `:3060`, `:3162` verbatim; android `MCSPlayer.as:2977` (`maxreload / 6`) and `:3098-3105`
  verbatim, and android `maxreload = 5 * 24` = 120 makes the finding's "= 20" exact. The frame
  holds: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` crop **(230,960)–(560,1070)** ×4
  shows HP 20/20, Chi 26/26, and a **third, unfilled** bar captioned `CANNOT CHANGE STANCE`
  over `150% DAMAGE`. `REBUILD_READINESS.md:158-160` item 4 is reversed — and note
  `SOURCE_CONSTANTS.md:261` already said "costs 48 focus", so the ledger was self-contradictory.
- **`hunter04/web-v0717-crit-is-flat-1_3`** — `§1t99s0§.as:3272-3275` verbatim; android
  `MCSPlayer.as:3215-3221` (×1.2 non-Light / ×1.5 Light) verbatim. Deterministic on a full
  bar, no proc roll anywhere. `:190 ②` and `:195 ⑤` both close.
- **`hunter04/web-v0717-per-stance-reach-coefficients-differ`** — every **web** line exact
  (`:3094`, `:3105`, `:3116-3120`, `:3131`, `:3142-3146`), plus `§1t1523s0§.as:104`
  (`stageWidth:int = 800`) and `:2347` (`return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`,
  with `:2346` `_loc2_ = 90 + dan*5`) — the worked example 120+floor(90/21)=124 is right, and
  1920/800 = ×2.4 is right. *Minor:* two android contrast lines are off by one — the BALANCED
  formula is `:3041` not `:3042`, the HEAVY formula `:3052` not `:3053`. Substance unaffected;
  android REVERSED ×1.5 confirmed at `:3067`.
- **`hunter05/offline-sharedobject-save-path-exists`** — `QueryManagerBase.as:2907`, `:2917`,
  `:2980` verbatim. **Understated:** the `offlineMode` branch at `:2912-2925` writes fourteen
  fields — the entire persistence schema, not just equipment. `:351` falls on its save-format half.
- **`hunter05/war-wave-table-is-340-plus-11-equals-351`** and **`meta-social/kill-cap-is-351-not-350`**
  — I parsed both blobs. Both: root `survivalmodedata`, **39 waves, 87 `<enemy>` rows,
  Σ`<qty>` = 351, non-700 block = 340, 700-block = 11, ids 700–710**. `SHSD_MASTER_REFERENCE.md:170`
  reads `Kill cap (troops) | 350 (= 340 troops + 10 samurai)` — the troop half right, the
  samurai half off by one. Finding 17's id quote is verbatim: web `<id>449|454|449|454|443</id>`
  vs android `<id>449|454</id>`. *Caveat on finding 14:* "Identical in both files" is true of
  the counts and sums only — the blobs are **not** byte-identical (11,721 vs 11,553 bytes),
  as finding 17's own quote shows.
- **`meta-social/achievements-list-is-on-disk`** — `114_Mobile_AchievementData.bin` is plain
  UTF-8, root `achievementdata`, **61 rows**, and the quoted row is byte-for-byte right.
  The `desc = name + 80` rule holds for **all 61** rows (zero exceptions). `["8058"]`/`["8138"]`
  = `'Warrior III'` / `'Defeat 340 in a war room attack.'` — which independently corroborates
  the 340 in the two findings above.
- **`meta-social/world-board-is-a-coordinate-grid-not-a-japan-outline`** — opened
  `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg` whole-frame ×3 LANCZOS as
  specified. Header `NAGANO (26,52)  LEVEL: 9`; uniform rounded-square tiles on a strict
  pitch (I count ~13 columns × 5–6 visible rows); one white selection outline; painted
  landmass bleeding across tile borders; legend `VILLAGE TOWN CITY CASTLE TOWN DESTROYED QUEST`
  (plus, unquoted, `GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH`).
  `:115` falls.
- **`meta-social/world-map-topology-is-a-bitmap-mask`** — the best finding in the packet.
  `110_Mobile_MapBitmapData.bin` is `GIF89a`, **63×72**, **735 non-black pixels**, and at ×8
  nearest-neighbour it is an unmistakable Japan: Hokkaido, Honshu, Shikoku, Kyushu, Ryukyu chain.
  `WorldMapUI.as:208`, `WarSelectUI.as:15/17/19`, `getHexOwner` `:377`
  (`territoryx + 341 << 12 | territoryy + 341`) and `QuestEngine.as:1206` all verbatim.
  **I re-derived the transform rather than trust it:** `WorldMapUI.as:440` prints
  `(terrX + DTERRSHIFTX, terrY + DTERRSHIFTY)` and `WarSelectUI.as:21/23` set
  `DTERRSHIFTX = TERRSHIFTX = 21`, `DTERRSHIFTY = TERRSHIFTY = 51`. So displayed `(26,52)`
  → internal `(5,1)` → `getPixel(5+21−8, 1+51) = getPixel(18,52)`, which I read as
  `(255,255,255)`. The finding's compact "26−8" is algebraically correct. `:245 ②` and `:115` both die.
- **`meta/interactui-uidata-blob-is-utf8-not-utf16le`** — bytes 0..37 are
  `<?xml version="1.0" encoding="UTF-8"?>\r\n`; line 97 is the `firerebirth` option verbatim,
  comment and all (`<!-- "yes" useicon >=10 dan, no element boost-->`, whose `>=10 dan` with
  `<qty>9</qty><comp>gte</comp>` independently corroborates the 0–9 dan ladder). Correct —
  though correction **C1** already establishes this, so it is a duplicate of standing law
  rather than a new overturn.
- **`npcdata/five-stances-are-in-the-web-build-too`** — `§1t4906s0§.as:90`, `§1t4907s0§.as:157`,
  `§1t122s0§.as:862` all carry the `(1500)→§1t12224s0§ / (1501)→§1t12223s0§` branch verbatim;
  android `EnemyElite.as:160-167` and `MCSPlayer.as:33/35` verbatim. Cross-checks against the
  stance switch I read for finding 12: `§1t12222s0§`=HEAVY, `§1t12223s0§`=DUAL, `§1t12224s0§`=REVERSED.
  `src/config/stances.ts:7` is exactly `export type StanceId = 'light' | 'balanced' | 'heavy';`
  — two states short in the target build. *Note:* the named "ledger" sentence lives in config,
  not in `REBUILD_READINESS.md`; it still falls.
- **`npcdata/spawn-level-comes-from-the-quest-wave`** — every line verbatim: `NPCManager.as:114`
  (`lvl = wave[i].enemy[j].lvl;`), `:131`, `:407`/`411`/`433`/`437`, `:877-879`, `:932-934`,
  `NPC.as:241/247-249/253-258` (`factor = lvl/this.level`, `*= 0.9` when `lvl <= 20`, hard clamp
  to 1 when `lvl <= 10`), `FriendlyElite.as:70` and `FriendlyArcher.as:58`
  (`setLevel(StatsManager.getLevel())`), `NPCManager.as:609`/`621` (ai 30 = FriendlyElite,
  ai 34 = FriendlyArcher). `questdata.xml:26101`/`:26105` = npc 190 `<lvl>25</lvl>`;
  `:25862`/`:25866` = npc 191 `<lvl>35</lvl>`. My own count: **169 `<enemy>` blocks, 160 with
  `<lvl>`** — the finding said 160 of 169. npcdata confirms 190/191 = Gojo Takamori,
  188/810 = Magoichi. Blocker `:232 ①` gets a real formula.

---

## 6. What I found that nobody claimed

1. **Writ of Release is a fourth hard v0.682↔v0.717 diff: 25 gold web, 5 gold android** (A1 frame, above).
   It does not overturn the ledger — it *vindicates* `:216` and adds a fourth enumerable
   build divergence after arrow gravity, war-room page count and the daily-streak rewording.
2. **The animation layer is NOT parity-clean.** Five web `animdata` blobs have no
   byte-identical android twin, and `102_1t4629s0.bin` (shunpo/flurry/deathtouch/spartakick…)
   differs from `93_MCSCharacter_SkillsAnimationData.bin` by **4,328 bytes**. Any skill-animation
   duration ported from the android blob needs a hedge.
3. **The web build ships a `spider_*` animation set the android bindata does not have at all**
   (`114_1t4641s0.bin`, 10 anims, 90,473 B; `grep -rl spider_idle reference/extracted/android/`
   returns nothing). A whole creature absent from the android side.
4. **Max Focus differs between builds:** web `§1t99s0§.as:249` `= 8 * 24` (192) vs android
   `MCSPlayer.as:239` `= 5 * 24` (120). So the flat 48-cost stance switch is `maxreload/4`
   in web and `maxreload/6` in android — the same *fraction* story does not survive the port,
   and any Focus-meter config must use 192 for v0.717.
5. **The 43 SFX names live on one line:** `§1t88s0§.as:56` declares the entire `Snd_*` array.
   Cheaper and safer than three scattered call sites.
6. **The offline save schema is fourteen fields, already written:** `QueryManagerBase.as:2912-2925`.

## 7. Process note for the board

The `QUOTE_UNVERIFIED` flag misfired on **all five** claims that carried it
(`ten-kanji-dan-ranks`, `full-xp-table`, `offline-sharedobject`, `kill-cap-is-351`,
`five-stances`, `spawn-level`). In each case the quote was present and exact — the machine
could not match CJK, a JSON key-lookup form, an elided long array, or a pipe-delimited id
string. `QUOTE_UNVERIFIED` should be read as *"a human must look"*, never as evidence against.
The three real defects in this packet were all found by **RESOLVES**-flagged claims saying
something their artifact does not support — which is exactly where a script cannot help.
