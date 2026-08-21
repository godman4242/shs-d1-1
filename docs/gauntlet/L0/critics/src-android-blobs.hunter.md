# CRITIC — src-android-blobs — LENS 2 (HUNTER)

Packet: `docs/gauntlet/L0/worklist/src-android-blobs.claims.json` — **15 claims, 15 judged, 0 skipped.**
Source: `reference/extracted/android/` (42 class-named blobs, v0.682).
Surveyor prose NOT read (§3.2). Every verdict below rests on an artifact I opened myself.

## METHOD — what I actually did

1. **Magic-byte census over all 42 blobs** (`xxd -p -l 2` each) — settles the UTF-16 question empirically.
2. **Implemented the shipped decryptor** from `reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:206-217`
   (swap `ba[i]`/`ba[i+256]` when `i%11==0` for `i` in 3..255, then `ba[i] ^= key`) with the key schedule at
   `Mobile.as:352` — `resourceFileNameArray[resourceIndex].charCodeAt(1)`, i.e. `'h'/'u'/'o'/'m'/'g'` = 104/117/111/109/103.
   All five CWS resource blobs decrypt to valid SWF v17 and zlib-inflate cleanly.
3. **Wrote a SWF tag walker + SymbolClass reader + DefineShape fill-style parser** and ran it on the decrypted
   `115_Mobile_SHS3Resource`, `120_Mobile_BGResource`, `124_Mobile_ImageResource`, `113_Mobile_MusicResource`, `122_Mobile_SoundResource`.
4. **Cross-build anim diff**: every `<anim i= d=>` in the 19 web `reference/extracted/bindata/*.bin` vs the 18 android `*AnimationData.bin`.
5. **Root-tag census** of both inflated payloads (`reference/decrypted/shs3_payload_decoded.swf`, `…android_payload_decoded.swf`).
6. **Opened the frame** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, cropped/upscaled, and then measured
   edge-gradient statistics rather than trusting my eye.

---

## VERDICTS

| # | claim | packet verdict | mine |
|---|---|---|---|
| 0 | all-thirteen-episode-cards-shipped | HELD | **SURVIVES** |
| 1 | bgdata-is-a-parallax-spec | HELD | **SURVIVES** (2 numeric nits) |
| 2 | blobs-are-utf8-not-utf16 | HELD | **REFUTED — material** |
| 3 | boss-timings-recut-across-builds | HELD | **SURVIVES** (exact) |
| 4 | comp-rand-is-the-encounter-roll | PARTIAL | **SURVIVES** (exact) |
| 5 | data-xml-parity-proofs-are-circular | HELD | **SURVIVES** (exact) |
| 6 | foreground-layer-occludes-the-fighters | PARTIAL | **REFUTED — material** (frame wins) |
| 7 | item-and-skill-icon-art-is-held | HELD | **REFUTED — material** (coverage ~2× overstated) |
| 8 | mapdata-has-no-web-counterpart | PARTIAL | **SURVIVES** + strengthened |
| 9 | nothing-was-rendered | STILL_UNHELD | **REFUTED — minor** (I rendered the fills) |
| 10 | parallax-and-dof-contract | HELD | **SURVIVES** + strengthened |
| 11 | portraits-decrypted-and-one-dead-reference | HELD | **SURVIVES** (exact, incl. the typo) |
| 12 | spider-is-web-only-enemy | HELD | **SURVIVES** (exact) |
| 13 | web-is-an-animation-superset | HELD | **SURVIVES** (exact) |
| 14 | web-payload-holds-zero-data-roots | HELD | **SURVIVES** (exact) |

### 0 — episode cards — SURVIVES
My decrypt of `124_Mobile_ImageResource.bin` yields 85 SymbolClass entries; the `image_*` set is exactly the 16 quoted
(`image_episode0`…`image_episode12`, `image_exposition`, `image_exposition_epilogue`, `image_epilogue`). Nit: there are
**0 ExportAssets tags** in the file — the names come from SymbolClass alone, so the cite's "SymbolClass/ExportAssets" is
half wrong in wording, not in substance. **Independent strengthening:** `116_Mobile_QuestData.bin` emits 68 distinct
`<img>` values, of which 16 begin `_`; `"image"+value` (`ResourceManager.as:277`) maps them **one-for-one onto the 16
shipped cards, with zero misses in either direction**. So Ep4–12 art is not merely present, it is *wired into shipped
quest rows*. §3.8's cut is dead twice over.

### 1 — bgdata parallax spec — SURVIVES
Reproduced exactly: 623 lines, 49 `<bg>`, lines 4–13 verbatim, layer sums **147/211/311/92/113 = 874**, ids 0–54 with
exactly {4,19,23,24,25,43} unused, `contentwidth` 17 rows spanning 800–5000 with `BG_NinjaVillage` = 5000, `wrap` 17 rows
all `0`, and the 49 `<name>` values ↔ the 49 `BG_*` SymbolClass names in decrypted `120_Mobile_BGResource` **as a bijection
(set difference empty both directions)**.
Two nits that do not touch the headline: `<ffwrap>` is **8 rows, not 6** (lines 12, 23, 259, 330, 356, 370, 514, 530 —
values 1670/1640/2000/1750/2000/1770/2000/2000); `<ffscroll>` is 14 rows but its range is 0.05–**1.0**, not 0.05–0.27.

### 2 — "41 of 42 blobs are UTF-8" — REFUTED (material)
The *useful* half is right and I confirm it: over all 42 blobs, **exactly one carries the UTF-16LE BOM** —
`118_Mobile_Lang_EN.bin` (`fffe`). 18 anim blobs are UTF-8-BOM (`efbb`), 11 data blobs are bare ASCII `<?`, questdata is
bare `<q`.
But the claim's universal form is false and its operational advice is unsafe: **6 of the 42 are not text at all** —
`113`, `115`, `120`, `122`, `124` are XOR-obfuscated, zlib-compressed SWFs (magic `4357` = `CW`… after decrypt) and
`110_Mobile_MapBitmapData.bin` is a **GIF89a, 63×72, 272 bytes** (magic `4749`). A plain grep of those six returns 0 hits
for content that *is* there — which is exactly the false-negative trap the lane's standing warning exists to prevent.
Corrected rule: **36 of 42 are greppable text; 1 needs a UTF-16LE decode; 5 need the ResourceManager XOR + inflate; 1 is a GIF.**

### 3 — boss timings re-cut — SURVIVES, exact
Every cited line reads back verbatim. My independent whole-corpus diff finds **exactly 7 duration divergences and no
others**: `ogre_swingdown` 16/14 · `ogre_swingdownhit` 5/18 · `ogre_swingup` 13/11 · `ogre_swinguphit` 5/7 ·
`ogre_stomp` 10/9 · `ogre_stomphit` 4/14 · `guardian_swingdownhit` 7/18 (web/android). Skills blob (51 anims) and spear
blob: zero divergence, as claimed. `ogre_swingdownend` is absent from the android blob. Nothing to refute.

### 4 — `<comp>rand</comp>` — SURVIVES, exact
`112_Mobile_NodeData.bin:117-118` verbatim. `StatsManager.as:4222` `if(comparison == "rand")` → `:4224`
`return Math.random() * id <= val;`; default `gte` at `:4173`. id=100/qty=50 ⇒ 50%. And it is genuinely **the only one**:
across all 42 blobs `<comp>rand</comp>` occurs exactly once.

### 5 — parity proofs are circular — SURVIVES, exact
`diff reference/extracted/skilldata.xml reference/extracted/android/117_Mobile_SkillData.bin` differs only by the XML
prolog and the trailing newline; same for item/npc/quest. Sizes reproduce to the byte: 184,002/184,044 · 39,003/39,045 ·
228,413/228,455 · 796,383/796,384. And the web payload carries none of those roots (see 14). The banked
"android-web-byte-identical" proof is indeed a file compared with itself.

### 6 — foreground occludes the fighters — REFUTED (material). **THE FRAME WINS.**
I opened `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080) and cropped
**(900,560)-(1180,960) upscaled ×3 NEAREST** and **(760,780)-(1240,1010) ×3**, plus a tight
**(950,840)-(1090,930) ×8** on the leg line.
- **The occlusion is REAL.** A green band is painted *over* the tan fighter's hakama and over the purple fighter's lower
  body; grass edge crosses the tan garment at y≈870-880, head crown y≈687. That half holds.
- **The outline description is FALSE.** The claim says the grass "carries the same outline weight as the fighters — it is
  not the blurred far layer." Measured luminance-gradient statistics on that same frame:

  | region (source px) | p99 local gradient | max |
  |---|---|---|
  | grass band, left of fighters (780,885)-(850,955) | **3.0** | 5 |
  | grass band, right of fighters (1100,885)-(1230,955) | **3.0** | 29 |
  | grass band, far left (300,885)-(560,955) | **3.4** | 7 |
  | far rock background (1300,300)-(1500,450) | 7.0 | 11 |
  | tree trunk (1380,150)-(1500,700) | 7.0 | 12 |
  | tan fighter torso/arm (960,700)-(1080,840) | **82.0** | 154 |
  | purple fighter shoulder (820,830)-(900,880) | **101.6** | 139 |

  The foreground grass is the **softest element in the frame** — softer than the far rock layer, ~30× softer than the
  fighters, and it contains no near-black outline pixels. There is no "hard-black-outlined grass blade" in this frame.
- **The correct reading is better than the claim.** `XMLBG.as:46` sets `foregroundLayerBlur = 8`, tied with
  `farthestLayerBlur = 8` for the hardest blur in the ladder. The frame *is* that constant. A builder following the
  claim would draw crisp foreground grass and break the 1:1.

### 7 — item/skill icon art is held — REFUTED (material)
The **symbol inventory is exact** and I confirm every number: 1,912 SymbolClass entries; torso/uparm/lowarm/pelvic/stomach
151 each · item 112 · weapon 109 · hat 96 · calf/crotch/thigh 85 · skill 79 · hair 73 · prop 60 · mask 59 · foot/foottop 44
· head 38 · hand/neck 33 · acc 8 · achievement 5. `MCSItem.as:203` `setConsumable` → `getMCSComponent("item",id)` confirms
art-id = item-id, so the join is legitimate.
**The coverage fractions are wrong, roughly by 2×**, and they are the part a builder plans on:

| band | claim | measured |
|---|---|---|
| items 2000–2999 | 94/99 | **50/99** (49 missing) |
| accessories 3000–3999 | 8/9 | **8/9** ✓ (missing 3007) |
| quest items 20000–29999 | 67/79 | **58/79** (21 missing) |

The claim's "residual named exactly: 2000, 2001, 2500, 2502, 2503" omits the entire contiguous **2131–2175 block plus
2142, 2144, 2204, 2206** — 44 further consumables with no icon. Corrected missing quest-item list:
20005, 20009–20012, 20017, 20023, 20054–20058, 20100–20107, 20111.
Bonus (not in the claim): skills — 68 of the 75 `<skill>` rows have a `skill####` icon; **7 do not** (1064, 1065, 1066,
1067, 1068, 1500, 1501), and 11 skill symbols have no skilldata row.
**Keep** the headline (the icon art *is* on disk, and the banked web-payload STILL_UNHELDs are correctly retired).
**Do not bank** the fractions.

### 8 — mapdata has no web counterpart — SURVIVES + strengthened
`119_Mobile_MapData.bin` is 65 bytes, entire content = prolog + `<mapdata>` + blank + `</mapdata>` (CRLF). Web inflated
payload: `<mapdata>` = 0. Also 0 in the 329 MB `reference/extracted/payload.xml`.
**Strengthening:** `ResourceManager.as:318-332` `getMap(num)` builds `"Map"+num` from RESOURCE_BASE and falls back to
`"CloudsMap"`. My decrypted `115_Mobile_SHS3Resource` symbol list contains **neither any `Map*` symbol nor `CloudsMap`**.
So the map is missing in art as well as in data on this build — not merely an empty XML.

### 9 — "nothing was rendered" — REFUTED (minor; honest claim, closed lead)
The claim is honest about its own pass, and its tag histograms reproduce exactly (115: 3,756 tags / 1,949 DefineSprite /
1,594 DefineShape4 / 127 DefineShape / 4 DefineFont3; 120: 1,124 tags / 552 sprites / 370 shapes; 124: 330 tags;
113 & 122: 22 tags each). But the lane's job is to hunt under-claiming, and this lead is now **closed**: with the same key
already in hand I parsed the FILLSTYLEARRAY of **2,423 shape records** and have real hues. See NEW-4.

### 10 — parallax + DoF contract — SURVIVES + strengthened
`XMLBG.as:10-58` verbatim: `groundY=400`, `flatGround=true`, `contentWidth=1600`, `wrapAround=true`; blur 8/4/0/4/8;
scroll 0.25/0.3333…/0.5/1/2. **Strengthening:** the constructor (`XMLBG.as:58-140`) overrides each field only when the
matching tag is present, and across all 49 `<bg>` rows there is **no `<groundy>` and no `<flatground>` tag at all** —
so groundY=400 and flatGround=true are not defaults, they are **global constants for every location in the game**.

### 11 — portraits + dead reference — SURVIVES, exact
66 `portrait_*` symbols. Questdata references 52 portrait names; **51 present, 1 absent — `chikako_maked`**, against a
shipped `portrait_chikako_mask`. `ResourceManager.as:286-300` `getPortrait` returns **null** when the definition is
missing, so "resolves to nothing" is literal, not inferred. 15 shipped-but-unreferenced, of which 12 are exactly the
{blue,green,red,yellow}×{sergeant,captain,general} grid; the other three are `ladyoiwa_snake2`, `takamori_masked`,
`takamori_standmask`. Every particular reproduced.

### 12 — spider is web-only — SURVIVES, exact
All ten `114_1t4641s0.bin` lines verbatim; `§1t1544s0§.as:480` and `:498` verbatim. Android side: `npcdata` 0 hits;
android AS3 0 files; and **I decoded `118_Mobile_Lang_EN.bin` as UTF-16LE before searching** (the trap in the standing
warning) — `'pider'` occurs 0 times in the decoded text and 0 times in `strings.json`. The negative is real, not an
encoding artefact.

### 13 — web is an animation superset — SURVIVES, exact
487 web / 471 android. Web-only names = **exactly 16**: the 10 `spider_*` plus `ogre_stompend`, `ogre_swingdownend`,
`guardian_swingdownend`, `spear_flourish`, `spear_relax2`, `spear_relax3`. **Android-only = 0.** Per-blob web counts match
the quoted list item for item. Minor note for whoever banks it: the web corpus has 487 `<anim>` *tags* but 482 distinct
*names* — `mining`, `walkwithspear`, `spearbowjump`, `spearbowdropdown`, `chargewithspear` each appear twice; the delta
arithmetic is unaffected.

### 14 — web payload holds zero data roots — SURVIVES, exact
Independent census of both inflated payloads (web CWS v17 → 11,892,053 B body; android CWS v26 → 21,688,584 B body):
questdata 0/1 · itemdata 0/1 · skilldata 0/1 · npcdata 0/1 · nodedata 0/1 · achievementdata 0/1 · uidata 0/1 · bgdata 0/1
· premiumdata 0/1 · mapdata 0/1 · survivalmodedata 1/1 · traproomdata 1/1 · animdata 19/18. All thirteen match.

---

## HUNTING THE SILENCE — what is in this source that no claim mentions

The packet touches 12 of the 42 blobs. Ten blobs holding shipped, structured game content are named by **no claim at all**.

**NEW-1 · THE AUDIO IS NOT A WALL. (contests Stage-0 S0-5)**
S0-5 says audio is "HELD but ENCRYPTED (nested CWS SWFs ffdec cannot open)". ffdec cannot open them because they are
XOR-obfuscated *before* the SWF header; applying the shipped `ResourceManager.decryptByteArray` schedule
(`ResourceManager.as:206-217`, key from `Mobile.as:352`) turns both containers into ordinary CWS v17 SWFs that inflate
and parse. `113_Mobile_MusicResource.bin` (key `'u'`=117) → 13 `DefineSound`; `122_Mobile_SoundResource.bin` (key `'o'`=111)
→ 13 `DefineSound`. **All 26 are MP3, 11025 Hz, 16-bit, mono**, each bound to a SymbolClass name:

  music: `bgm_lose` 3.53s · `safepercussion`/`safekoto`/`safeambience` 80.01s each · `bgm_levelup` 29.78s ·
  `bgm_gangnam` 3.63s · `flutes` 80.01s · `dungeonpiano`/`dungeonpercussion`/`dungeonflute`/`dungeonambience` 45.74s each ·
  `battledrums` 80.01s · `battlechants` 80.01s
  sfx: `deflect` 0.79s · `die1` 0.48s · `die2` 0.66s · `die3` 0.87s · `slash1` 0.35s · `slash2` 0.56s · `slash3` 0.27s ·
  `hitmetal` 0.52s · `punch` 0.31s · `sumo` 2.90s · `refund` 0.73s · `goodkoto` 1.57s · `fart` 0.42s

The stem structure is itself a design fact: the "safe" and "dungeon" beds are **4 and 4 co-length stems** (80.01s and
45.74s) — layered adaptive music, not single tracks. I did **not** listen to or grade any of it; I read tag headers.
That is enough to retire "ffdec cannot open" and to replace "audio is a black box" with a named, timed manifest.

**NEW-2 · `90_InteractUI_UIData.bin` — the entire town-interaction spec, unmentioned.**
314 lines, root `<uidata>`, **19 `<ui>` screens · 47 `<menu>` · 139 `<option>` · 28 `<condition>`**. Titles at :5, :14,
:47, :66 …: peddler, market, vegpatch, stables, merchant, inn, rebirth, barber, bank, gambling den, getcoins, getap,
leaveclan, blacksmith, recentevents, playerpanel, joincustomclanrecruit, joincustomclangeneral, towntoll.
A **46-verb action vocabulary** (goto ×34, close ×24, sellgoods, buygoods, sellcrop, plant, harvest, withdraw, deposit,
bet, chohan, redeem, nameweapon, forgeweapon, repairweapon, reinforceweapon, crafting, fullhpchi, firerebirth/
windrebirth/waterrebirth/earthrebirth, dailyprize, convertgold, buypremium, achievement, duelreplay, challenge,
addfriend, bankstorage, innrest, innbuy, barberbuy, paytowntoll, entertown, giveitem, givecoins, …). Labels are
string-table ids that resolve today: `strings.json["83"]`="Buy", `["84"]`="Sell", `["85"]`="Leave", `["269"]`="Sell crops".
Options carry conditions **and** per-action conditions with `<errormsg>`. Nothing in the packet mentions this file.

**NEW-3 · `84_QuestEngine_TrapRoomData.bin` — 70 rooms in four difficulty tiers, unmentioned.**
622 lines. `<traproomdata>` at :21, tiers `<easy>` :32, `<medium>` :126, `<hard>` :309, `<veryhard>` :446.
**70 `<room>` · 314 `<obj>` · 70 `<width>`.** The commented header block (:5-20) is a shipped authoring legend giving the
**property signature of every trap type**, e.g. `Trap_KunaiAuto` → `angle, speed, kunaicount, spread, onDuration,
offDuration, startInterval, active, bigDamage`; also Obj_FloorSwitch, Obj_Lever, Obj_LowCeiling, Trap_Kunai,
Trap_SawBladesAuto, Trap_CrushingBlockAuto, Trap_CrushingColumnAuto, Trap_ElementAuto, Trap_Jump, Trap_SpikesAuto,
Trap_Boulder, Trap_SpikeBallAuto. First authored room (:33-37) is `width 800` with one `Trap_SawBladesAuto` at x=400,
property `0,24,24,0,1`. This is a whole level-generation system with named, typed parameters.

**NEW-4 · The vector art IS decodable — first real hues out of the shipped art. (closes claim 9)**
Parsing FILLSTYLEARRAY across the decrypted resources: **1,755 shape records in `115_Mobile_SHS3Resource`, 562 in
`120_Mobile_BGResource`, 106 in `124_Mobile_ImageResource`.** Most-used solid fills:
  115 (fighter parts + icons): `#000000` ×225 · `#FFFFFF` ×224 · `#333333` ×160 · `#CCCCCC` ×147 · **`#FECA98` ×127** ·
  **`#B78F6C` ×120** · `#222222` ×100 · `#666666` ×59 · `#999999` ×55 · `#111111` ×46
  120 (backgrounds): `#000000` ×45 · `#30291D` ×35 · `#5A4D2E` ×33 · `#3A3323` ×23 · `#251F16` ×21 · `#453929` ×21 ·
  `#6B5B36` ×20 · `#3A3523` ×20
  124 (portraits/cards): **`#DF9671` ×52 · `#FCC6A6` ×51** · `#000000` ×39 · `#9E6750` ×31 · `#0D0D0D` ×28
Per-symbol resolution works too — `torso4000` → charId 1195 → shape 1194 (DefineShape4) with fills `#FECA98`, `#B78F6C`;
`skill1000` → shape 144 fill `#C0AC4B`; `acc3000` → shape 3725 fill `#ABABAB`. The semantic sanity check passes in both
directions (skin tones dominate the portrait file, earth tones the background file). **Caveat I insist on:** these are
first-fill-style-array reads, not a full render — no edge records, no strokes (my LINESTYLE2 parse is not trustworthy and
I am not reporting outline weights from it). But "no fill colour is held" is no longer true.

**NEW-5 · `114_Mobile_AchievementData.bin` — 61 achievements, fully resolvable, unmentioned.**
553 lines. **61 `<achievement>`**, each id/img/name/desc/stat/val. Row 0 (:4-11): `<name>8000</name><desc>8080</desc>
<stat>60000</stat><val>1</val>` → `strings.json["8000"]`="Duelist I", `["8080"]`="Win an online duel." Unlocks are
stat-threshold driven (stat ids 25, 1000-1022, 60000-600xx). Icon art is complete: `<img>` takes only values 1-4 and
`achievement0`-`achievement4` all ship in 115.

**NEW-6 · `109_WarHexUI_SurvivalModeData.bin` — the survival mode's actual wave content, unmentioned.**
555 lines, **39 `<wave>` · 87 `<enemy>`**. Enemy ids are alternation lists (`400|401|402|403|404`) — a spawn-table
primitive nothing else in the corpus uses. Spawn x is **-50 (49×), 1650 (37×), -1650 (1×)**: enemies enter just off both
edges of a **1600-wide** stage, which independently corroborates `XMLBG.as:14` `contentWidth = 1600`. S0-1 flagged
survivalmodedata as a whole mode missing from all 12 ledger systems; this is its content, and `<survivalmodedata>` is one
of only two data roots present in **both** payloads (see claim 14), so it is not an Android-only mode.

**NEW-7 · `121_Mobile_PremiumData.bin` — the premium shop rotation, unmentioned.**
257 lines. `<default>` at :3 · `<special>` at :22 · `<rotation>` at :35 with **23 `<set>`** (first at :37) and
**176 `<item>` refs** total, all of them ids that exist in itemdata. This is the live-ops offer schedule.

**NEW-8 · The `<comp>` comparison enum is 7 operators, not 2.**
`StatsManager.as:4279-4295` is a full switch: `eq`, `gte`, `gt`, `lt`, `lte`, `not`, default→false, with `rand`
special-cased earlier at `:4222`. Authored usage across the whole android corpus is 13 sites:
nodedata `rand`×1 · achievementdata `not`×1 · questdata `eq`×5, `gt`×1, `gte`×2, `not`×1 · uidata `gte`×1, `lt`×1, `not`×1.
Every `<condition>` in nodedata, questdata, uidata and achievementdata draws on the same evaluator.

**NEW-9 · `85`-`89_NameGenerator_*.bin` — 1,430 authored proper nouns, unmentioned.**
Plain newline-delimited lists: MaleNames 397 · FemaleNames 290 · PlaceNames 676 · SamuraiFamilyNames 35 ·
NobleFamilyNames 32. (Akeno/Akifusa/Akihide…, Ai/Aiko/Akane…, Anjo/Chiryu/Chita…, Asai/Askikaga/Chosokabe…,
Konoe/Takashi/Kujo…) This is the procedural-NPC naming corpus for a world with 495 npcdata rows.

**NEW-10 · bgdata's per-bg override vocabulary is 22 tags, not the 4 the claim lists.**
Measured over the 49 rows: id 49 · name 49 · ffcount/fcount/ppcount/gcount/fgcount 49 each · **wrap 17 · contentwidth 17 ·
fscroll 16 · ffscroll 14 · fblur 11 · fwrap 11 · ppwrap 9 · ppblur 9 · ffwrap 8 · ppscroll 6 · fgscroll 3 · ffblur 3 ·
gscroll 2 · fgblur 2 · gblur 1.** Two rows set `<gscroll>0</gscroll>` — a **locked ground plane** (interior scenes), which
no reading of the defaults would predict; three rows set `<fgscroll>1.2</fgscroll>`, overriding the 2.0 foreground ladder
value; one row sets `<ffscroll>1</ffscroll>`, collapsing the farthest plane onto the camera. `gwrap`/`fgwrap` are never
authored. Any recreation that implements only the five defaults will render 49 backgrounds and get ~20 of them wrong.

---

## Bottom line
12 of 15 claims survive, and the ones that survive are unusually exact — 3, 4, 5, 11, 12, 13, 14 reproduced to the digit.
Three fall: an unsafe method rule (2), a frame description the frame itself contradicts (6), and icon-coverage fractions
overstated ~2× (7). The bigger prize is the silence: **ten blobs the survey never named**, one of which retires the audio
blocker and another of which (`90_InteractUI_UIData`) is the only spec in the corpus for how the player interacts with a
town at all.
