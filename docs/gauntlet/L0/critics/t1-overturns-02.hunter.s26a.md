# t1-overturns-02 — BLIND CRITIC (Lens 2, hunter) — s26a

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — **24 findings, all 24 judged, none skipped.**
Every verdict below rests on an artifact I opened myself. I did not read any `critics/*.md` or `sources/*.md`.

**Headline:** 21 of 24 survive as claims. **3 are REFUTED** — one of them *fatally*, because a
frame contradicts it. Separately, **5 of the 24 claimed overturns do NOT hold** and three more only
hold with a material narrowing: the finding is true but the ledger sentence it points at is
still standing, wholly or in part.

---

## THE FRAME WINS — the fatal one

**IDX 15 `hunter05/writ-of-release-is-5-gold-not-25` — REFUTED (fatal).**

The finding says `REBUILD_READINESS.md:216`'s "Writ of Release 25g now double-confirmed" is
"contradicted by the shipped data" and "the ledger's banked price is 5x too high", citing
`reference/extracted/itemdata.xml:2328-2335` `<heavenlyprice>5</heavenlyprice>`.

I opened the XML — the quote is verbatim-exact. Then I opened a **frame**:

> `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg`, crop (570,150)-(1000,230)
> @4x LANCZOS — the web v0.717 BUY screen, detail panel: item icon with a gold-coin price
> badge reading **25**, label **WRIT OF RELEASE**, **OWNED: 0**.

**A measurement doc and a frame disagree. THE FRAME WINS.** The shipped web price is 25 gold.

And the mechanism is *already in this packet*. IDX 8 proves — and I re-verified it — that the
Android build divides Heavenly-Gold amounts by exactly five relative to web:

| | web v0.717 | android v0.682 |
|---|---|---|
| rebirth payout | `§1t1523s0§.as:2650` → **25** | `StatsManager.as:2205` → **5** |
| 10th-rebirth payout | `§1t1523s0§.as:2646` → **100** | `StatsManager.as:2201` → **20** |
| Writ of Release | **frame: 25** | `itemdata.xml:2333` → **5** |

5 x 5 = 25. The android `heavenlyprice` is the android-nerfed number, and IDX 15 ported it into
a web-build ledger.

Its build label — `both (itemdata id sets identical across builds)` — is also unsupported. I
enumerated every web bindata root from `docs/gauntlet/L0/index/bindata.json`: 19 `animdata`,
1 `survivalmodedata`, 1 `obj`, 5 plain-text name tables, 1 GIF. **There is no `itemdata` root
on the web side at all**, so no id-set comparison was possible (this is exactly the C2 hole).

Two independent web-side corroborations of 25g that IDX 15 did not consult:
`docs/research/video-study/segments/B-17-ninja-services-hidden-vendor.md:31` (the same shop
scroll, t=48:12) and `docs/research/KONGREGATE_FORUM_FINDINGS.md:385` (2015-16 threads about
the live web game). **Ledger :216 is correct and must not be edited.**

---

## The other two refutations, and one refuted overturn

**IDX 3 `hunter/audio-blocker-is-the-right-target-for-the-sfx-names` — REFUTED (material).**
Its downgrade to PARTIAL rests entirely on "the waveforms remain CWS-encrypted per Stage-0b
S0-5". **S0-5 is dead** (brief correction C3), and I re-proved it by hand rather than taking C3
on trust. `ResourceManager.as:200-217` is `decryptByteArray(source, key)`: XOR bytes 3..255 with
`key`, swapping `ba[i] <-> ba[i+256]` where `i % 11 == 0`; `ResourceManager.as:41` gives the key
as `"soundresource.swf".charCodeAt(1)` = **111**. Applying that to
`reference/extracted/android/122_Mobile_SoundResource.bin` yields `43 57 53 11 bf 73 00 00` — a
**CWS v17 SWF, 29,631 bytes**, inflating to 29,623 bytes containing:

- **13 `DefineSound` tags (0x0E)**, all format 2 (**MP3**), rate 1 (11 kHz), 16-bit, mono
- a `SymbolClass` table (0x4C) naming every one:
  `deflect, die2, sumo, slash3, die3, refund, die1, slash2, slash1, goodkoto, hitmetal, fart, punch`

So 13 of the 43 named triggers have **recovered waveforms**, not inferred params. The finding's
"even there the overturn is PARTIAL ... not a single SFX or music PARAMETER" is false.
It also mis-cites the ledger: it names `:241`, which is the art-anim **Surface** bullet; the
"ALL AUDIO" blocker is `:240`. The sentence at :240 does fall — harder than the finding allows.

**IDX 23 `parity/21-of-27-web-bindata-blobs-are-byte-identical-to-android` — REFUTED (material).**
I re-ran the md5 cross-product myself: 27 web files, 42 android files, **21 exact matches**, and
the enumerated list in the quote is correct to the file — including
`6852a591ab2d5895090b3d37ccec9ba2` for both `bindata/103_1t4630s0.bin` and
`android/94_MCSCharacter_Human2AnimationData.bin`. **That much is exactly right.**

What is wrong is "including the **ENTIRE** character-animation layer", and the lane_impact
conclusion "the animation data layer needs **NO** build hedge at all". Five web `animdata`
blobs have **no** android byte-twin, and they differ in *content*, not just bytes:

| web blob | anims / bytes | nearest android | anims / bytes |
|---|---|---|---|
| `100_1t4627s0.bin` (ogre) | 20 / 184,193 | `91_..._OgreAnimationData.bin` | **18** / 184,120 |
| `102_1t4629s0.bin` (skills) | 51 / 333,768 | `93_..._SkillsAnimationData.bin` | 51 / **338,096** |
| `111_1t4638s0.bin` | 17 / 117,638 | `102_..._GuardianAnimationData.bin` | **16** / 117,596 |
| `113_1t4640s0.bin` | 26 / 153,258 | `104_..._HumanSpearAnimationData.bin` | **23** / 132,270 |
| `114_1t4641s0.bin` | 10 / 90,473 | — | no match |

The animation layer is **14 of 19**, not "entire". The skills set (shunpo, deathtouch, fireball)
and the ogre set are exactly the two most gameplay-load-bearing exceptions. The hedge may be
lifted for the 21 named files and **must not** be lifted for these five. Corrected version is in
`new_findings`.

**IDX 0 `enemies-ai/shielder-prop-block-is-a-second-block-mechanic` — HELD, but its overturn is REFUTED.**
The mechanics are verbatim-exact and I confirmed the i-frame semantics the finding only asserted:
`NPC.as:296-298` `canHit() { return this.gotHitCounter == 0; }`, `EnemyShield.as:282` returns
false from `gotHit` while the counter is up, `:123-125` decrements it once per tick. So
`gotHitCounter = 24` on the shield vs `= 12` on a landed hit really is a doubled invulnerability
window, with `SoundManager.instance.playHitMetal()`. **True.**

But `SOURCE_CONSTANTS.md:258` says *"there is no counter/parry/riposte mechanic at all ... our
`COUNTER_BONUS = 1.25` models something the original does not have."* A shield absorbing a hit is
not a counter (no damage returned), not a parry (no timing window — the finding concedes this),
and not a riposte. Nothing here gives an **attacker** a stance-triangle damage bonus, which is
what `COUNTER_BONUS` is. Worse, the same document **already concedes the block** at
`SOURCE_CONSTANTS.md:365`: *"mobs can block with the weapon hitbox (part 3 -> 0 damage);
duelists cannot"*. The finding paraphrases :258 into "no block at all" and then refutes the
paraphrase. Genuinely new: the `PART_prop` shield case, the 24-frame window, the clang SFX.
Those belong at :365, not at :258.

---

## The five failed overturns, and three that need narrowing

| # | finding | what still survives |
|---|---|---|
| 0 | shielder prop-block | `SOURCE_CONSTANTS.md:258` (COUNTER_BONUS) untouched — see above |
| 1 | war room rules are 7 pages | the S0-3 caveat says parity is **NOT** established; a copy divergence **corroborates** it, it cannot overturn it |
| 9 | territory owners open-ended | `:245` (2) names **board/adjacency**; ownership is a different axis. The sentence it actually falsifies is `:244` "Ready: **4 clans**" |
| 15 | writ of release | `:216` is correct — refuted above |
| 19 | world-map bitmap mask | `:245` (2) names the War-Room **board**; that board is `WarHexUI.as:226-229` `hexArray[wt][ht]`, a separate hex grid sized from server state. The mask closes `:225` (1) and `:115`, not `:245` (2) |
| 20 | UIData is UTF-8 | true, but the §0 brief's own **C1** already retired that warning across all 42 blobs; subsumed, not new |
| 21 | five stances in web too | true, but "Stance system = 3 stances (light / balanced / heavy)" is **not in REBUILD_READINESS.md** — I grepped. It is `src/config/stances.ts:7` |
| 23 | 21/27 byte-identical | overturn holds for the 21 named files only — refuted above for the other five |

**IDX 1's second error.** The claim "a page was inserted and the numbering **shifted**, so any
android war-room rule text ported by page number lands on the wrong page" is refuted by the very
frames it cites. I cropped all three at (30,20)-(1000,420) @1.6x LANCZOS and read them:

- `frame_0011.jpg` -> `WAR ROOM RULES 1/7 (JOINING A BATTLE)` = android `["369"]` **1/6** joining a battle
- `frame_0012.jpg` -> `WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)` = android `["373"]` **3/6** attacking and defending
- `frame_0013.jpg` -> `WAR ROOM RULES 6/7 (BUILDING STRUCTURES)` = android `["379"]` **6/6** building structures

Pages 1, 3 and 6 hold their *exact* positions and titles. No shift occurred anywhere in 1-6; the
seventh page is **appended**. The headline (v0.717 renders seven pages, both android tables say
six) is confirmed by my own eyes and stands.

**IDX 19's frame cross-validation is weaker than presented.** `WorldMapUI.as:208` is
`getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX, territoryy + TERRSHIFTY)` = `getPixel(tx+13, ty+51)`,
and the displayed "(26,52)" is in a *different* space (`:723` shows `territoryx = i +
topLeftWorldMapMarkerTerrX - TERRSHIFTX + 8`). The two plausible transforms give `getPixel(18,52)`
and `getPixel(26,52)` — **I read both, both are pure white**, so the test cannot discriminate, and
735/4536 = 16% of the mask is white anyway. Everything *else* in IDX 19 I reproduced exactly:
GIF89a 63x72, **735 non-black pixels**, a legible pixel Japan (Hokkaido, Honshu, Shikoku, Kyushu,
Ryukyus) at 8x nearest-neighbour, `WarSelectUI.as:15/17/19` = 8/21/51, `WorldMapUI.as:377`
`mapid = territoryx + 341 << 12 | territoryy + 341`, and `QuestEngine.as:1206` reusing the mask.

---

## The strong survivors (verified first-hand, no notes)

- **IDX 7 — the full XP table.** I regex-extracted both arrays: `StatsManager.as:78` and
  `§1t1523s0§.as:364` are **99 entries and byte-for-byte identical**, indices 1-10 are
  550/1450/2950/5150/8350/12150/16350/20900/25900/31400 (= the ledger's own trusted L1-L10 caps),
  index 79 = 4,025,800, index 98 = 29,395,800. And it really is the level table:
  `StatsManager.as:1591` derives level from XP against it, `:1601` is xp-to-next, `:1606` is
  xp-for-level. **`:200` (2) and §6 `:350` both die outright.** Best finding in the packet.
- **IDX 8 — rebirth payout.** `§1t1523s0§.as:2644/2646/2650/2652` and `:228` verbatim; android
  `StatsManager.as:194/2201/2205/2207` verbatim. A 10th-rebirth tier exists, `DAN < 9` caps the
  ladder at ten rungs, `tenthGold=100` and `+25g` are both exactly right.
- **IDX 10 — the 48-Focus in-combat stance switch.** `§1t99s0§.as:3050`, `:3060`, `:3162` verbatim;
  the charge sits inside the battle predicate at `:3160`. `§3` item 4 ("HARD-LOCKED... models
  removed 2014 behavior") is simply wrong and must be reversed.
- **IDX 11 / IDX 12 — the web damage and reach switches.** `§1t99s0§.as:3255-3276` and `:3091-3150`
  read exactly as quoted; android `MCSPlayer.as:3198-3223` and `:3027-3090` are the contrast.
  I confirmed the stance-enum mapping independently: web `§1t12224s0§` = REVERSED (x1.4,
  `setStanceColor(2)`), `§1t12223s0§` = DUAL (base, floor 100) — matching android `:3066-3090`.
  Worked example reproduces: SPD 1, DAN 0 -> `120 + floor(90*1/21)` = **124**; LIGHT 173,
  BALANCED 124, HEAVY max(62,100) = 100; 1920/800 = 2.4 screen px per stage px.
- **IDX 13 — the offline SharedObject.** Verbatim, **and badly under-claimed** — see new_findings.
- **IDX 14 / IDX 17 — 340 + 11 = 351.** My own parse of both blobs: 87 `<enemy>` rows, sum 351,
  non-700 block 340, and exactly eleven single-id rows 700..710 at qty 1. `npcdata.xml` has 495
  NPCs spanning ids 0-819 with **nothing** in 690-730, so the 700-block really is a set of
  non-authored slots. `SHSD_MASTER_REFERENCE.md:170` "350 (= 340 troops + 10 samurai)" and
  `REBUILD_READINESS.md:244` "kill cap 350" are both off by one on the samurai half.
- **IDX 16 — achievements.** 61 rows, first row verbatim, `desc = name + 80` holds,
  `["8058"]` Warrior III / `["8138"]` "Defeat 340 in a war room attack." — which independently
  cross-checks the 340 above. (Android-only blob; no web byte-twin. Hedge it.)
- **IDX 18 — the board is a lattice.** Own eyes on `zFtCaTO0_1M/map/frames/frame_0025.jpg` @3x:
  header `NAGANO (26,52) LEVEL: 9`, 13 uniform rounded-square tiles per row in strict columns,
  landmass painted *under* and bleeding across borders, one white selection outline, legend
  `VILLAGE TOWN CITY CASTLE TOWN DESTROYED QUEST` — plus a line the finding missed:
  `GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH`. `:115` falls.
  *Residue:* you still cannot generate the territory **set** from W x H alone — you need the mask.
- **IDX 22 — spawn level from the quest wave.** Every line checks out; `169` `<enemy>` blocks with
  `160` carrying `<lvl>`, and `questdata.xml:26101/:26105` = npc 190 @ lvl 25 and `:25862/:25866`
  = npc 191 @ lvl 35, exactly as stated. Only nit: the quote labels `:113` for
  `lvl = wave[i].enemy[j].lvl;`, which is `:114` (`:113` is the `xpos` line); the cited range
  `:110-131` covers it.
- **IDX 2 / 4 / 5 / 6** all verbatim. Two overstatements worth carrying: in IDX 2, only the
  **four ultimates** carry a damage-scaling description ("150% Fire ATK") — the other twelve
  actives say only "deals fire damage", and `<value>` is the **level index**, not a damage number;
  the 8 Dragon-Dance rows are `<passive>1</passive>` with **empty** `<chi>`/`<cooldown>`. And its
  build label "web v0.717" is wrong for the `skilldata.xml` half (android-sourced, C2) — though I
  closed that hole myself, see new_findings.

---

## Where the packet UNDER-claimed (Lens 2a)

Eight things I found while judging that nobody in this packet claimed — all in `new_findings`:

1. **The audio is recovered, first-hand** — 13 MP3 `DefineSound` tags + their SymbolClass names.
   This kills a §6 "structurally unrecoverable" line nobody targeted: `:348` *"the exact
   waveforms/envelopes are not [study-able]"*.
2. **The full offline save schema** — IDX 13 named one field. The android `offlineMode` branch
   (`QueryManagerBase.as:2912-2930`) writes **nineteen**: nextAPUpdate, nextDTUpdate, lastUpdate,
   playerlevel, playerStats, equipment, skillStats, skillSlots, inventory, stash, questItems,
   intStats, achievementStats, booleanStats, activeQuestList, completedQuestList, playerlocation,
   taunt, friends — each with a matching `get*String`/`parse*String` pair. And the web build has
   the same path (`§1t1832s0§.as:2797-2800`, field list at `:2813-2825`).
3. **`NPC.as:252` `this.xp = lvl * 2 + 20;`** — the per-enemy XP-income formula, sitting three
   lines from a quote IDX 22 already made. `:215` *"20+ samples show no XP formula either"* dies.
4. **The web twins of the four elemental-ultimate projectiles** — closes IDX 2's build hole.
5. **The web elemental-DEF pipeline** — closes IDX 5's unproven "both" label.
6. **The web kanji dan-rank consumer** — proves IDX 6's asserted second display format.
7. **The five non-parity animdata blobs** — corrects IDX 23.
8. **The mastery-10 arithmetic** — the ledger's 0.9/1.2/1.4 is hit *exactly* at mastery 10, not 9.

---

*Judged 24 / 24. Skipped: none.*
