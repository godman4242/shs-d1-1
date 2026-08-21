# t1-overturns-02 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened myself**. Where a citelint status
(`QUOTE_UNVERIFIED` / `UNCHECKABLE`) disagrees with my hand check, I say which won.

**Headline: 3 refuted (1 fatal, 2 material), 21 upheld.** The three refutations are all
cases where the *conclusion* was defensible but the *stated measurement* is false — and one
of them (`audio-inventory-is-held`) is false in a direction that has been suppressing a
recoverable asset set for the whole project.

---

## 0. Tooling I built to judge this packet (reproducible)

* `swfwalk.py` — recursive SWF tag walker that **descends into every `DefineSprite` body**
  and reads the `PlaceObject3` flag pair (byte1 bit1 = `PlaceFlagHasBlendMode`,
  bit0 = `HasFilterList`, bit2 = `HasCacheAsBitmap`).
* `filters.py` — full `PlaceObject3` field parser (MATRIX / CXFORMWITHALPHA bit-readers,
  FILTERLIST with per-filter-id sizes) so filter *types* can be counted, not just presence.
* Resource-blob decoder — the transform is already committed in this repo at
  `reference/tools/payload_decode.py` (swap `b[i]`↔`b[i+256]` when `i%11==0` for `i` in 3..255,
  then `b[i] ^= key`, key only over the first 512 bytes). **The key is recoverable from the file
  itself: `key = byte[3] XOR 0x11`,** because every one of these blobs is CWS v17.

Measured, whole-file, no sampling:

| container | body bytes | total tags | DefineSprite | PlaceObject2 | **PlaceObject3** | **blend-flag set** | filter lists | cacheAsBitmap |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `reference/decrypted/shs3_payload_decoded.swf` (WEB) | 11,892,053 | 17,523 | 827 | 7,196 | **304** | **0** | 263 | 54 |
| `reference/decrypted/shs3_android_payload_decoded.swf` | 21,688,584 | 14,727 | 675 | 6,010 | **248** | **0** | 214 | 47 |
| `115_Mobile_SHS3Resource` (k=104) | 1,040,849 | 9,698 | 1,949 | 2,032 | **12** | **0** | 12 | 0 |
| `120_Mobile_BGResource` (k=103) | 4,412,340 | 4,497 | 552 | 2,105 | **54** | **0** | 37 | 53 |
| `124_Mobile_ImageResource` (k=109) | 1,908,229 | 10,096 | 94 | 4,653 | **1,473** | **0** | 1,473 | 0 |
| `113_Mobile_MusicResource` (k=117) | 1,402,677 | 22 | 0 | 0 | 0 | 0 | 0 | 0 |
| `122_Mobile_SoundResource` (k=111) | 29,623 | 22 | 0 | 0 | 0 | 0 | 0 | 0 |

304 + 248 + 12 + 54 + 1,473 = **2,091 PlaceObject3 tags, zero with a blend mode.**

---

## 1. REFUTED

### R1 (FATAL) — `art-anim-audio-feel/hold-frames-are-authored-in-data`
Claim: "96 of 385 `<anim>` rows across the 19 web-payload animdata blobs have `@d` greater
than their `<f>` count."

**Every number in that sentence is wrong, and all three named examples are wrong.**

My scan of all 27 files in `reference/extracted/bindata/`, keeping the 19 whose root is
`<animdata>`, splitting on `<anim …>` headers and counting `<f ` children per row:

```
animdata files: 19
TOTAL <anim tags: 487
mismatches (d != len(f)): 0    (d > f: 0   d < f: 0)
per-file 100:20 101:7 102:51 103:25 104:13 105:8 106:21 107:20 108:158
         109:8 110:21 111:17 112:16 113:26 114:10 115:16 116:21 117:8 118:21
```

The three cited rows, read directly:

| cite | claimed | **actual** |
|---|---|---|
| `reference/extracted/bindata/116_1t4643s0.bin` `heavy_horslash_parta` | d=5, 2 `<f>` | **d=5, 5 `<f>`** (`<f i="0..4">`) |
| `reference/extracted/bindata/118_1t4645s0.bin` `light_horslash_parta` | d=13, 11 `<f>` | **d=13, 13 `<f>`** |
| `reference/extracted/bindata/108_1t4635s0.bin` `heavyhorizontalslash_parta` | d=6, 4 `<f>` | **d=6, 6 `<f>`** |

Raw first line of the 116 row: `<anim i="heavy_horslash_parta" d="5">` followed by `<f i="0">`
… `<f i="4">`. There is no authored hold anywhere in the data.

Worse for the claim, the artifact it cites *contains the real answer and contradicts it*:
`reference/decompiled/shs3_android/scripts/AnimData.as:15` reads `this.duration = xml.@d;`
and then a hard-coded switch **adds** the tail in code —
`:26 this.duration += 10;` (`"light_afterslashpose"`), `:41 += 10` (every
`*SLASH_POSE`), `:53 += 15` (every `*FALLSLASH_END` / `*JUMPSLASH_LAND`),
`:57 += 24` (`"sheathesword"`), `:66 += 6` (`"deathenemy"`/`"death"`/`"gob_death"`…),
and 25 more cases through `:141`. The hold table is **code**, not data. Refuted.

### R2 (MATERIAL) — `art-anim-audio-feel/zero-placeobject3-tags`
Claim: "across every decoded container … there is not a single PlaceObject3 tag."

**False. There are 2,091** (table above). The claim's own tag totals give the mistake away:
its 4,051 / 3,311 / 3,756 / 330 are exactly my **top-level-only** counts —

```
shs3_payload_decoded.swf         toplevel tags 4051  PO3@top 0  sprites@top 827
shs3_android_payload_decoded.swf toplevel tags 3311  PO3@top 0  sprites@top 675
115_Mobile_SHS3Resource          toplevel tags 3756  PO3@top 0  sprites@top 1949
124_Mobile_ImageResource         toplevel tags  330  PO3@top 0  sprites@top  94
```

— i.e. the scan never descended into `DefineSprite` bodies, which is the only place
`PlaceObject3` ever appears in these files. The conclusion ("no blend modes") is correct and
is carried by five other claims in this same packet with real recursive scans; this one's
evidence is an artifact of a broken walker and it directly contradicts its siblings
(`zero-blendmode-byte-proof` says 124 has PO3=1473; this says 0). Refuted as stated.

### R3 (MATERIAL) — `bindata/audio-inventory-is-held`
Claim: "The audio **WAVEFORMS are lost** … `113_Mobile_MusicResource.bin` and
`122_Mobile_SoundResource.bin` remain unopenable … zlib and raw-deflate both fail."

**The inventory half is exactly right. The waveform half is false — I opened both.**

`zlib` fails only if you skip the 11-byte-swap step; with the repo's own committed transform
(`reference/tools/payload_decode.py`) both inflate on the first try:

```
113_Mobile_MusicResource k=117 ver 17 declen 1402685 actual 1340647  INFLATES -> 1402677
122_Mobile_SoundResource k=111 ver 17 declen 1869552848->29631 actual 23928  INFLATES -> 29623
```

(The claim's own "declared length 1,969,230,408" for 113 is the *encrypted* header read; after
the transform it is 1,402,685, and the body inflates to 1,402,677.)

Both are ordinary SWFs holding **13 `DefineSound` tags each, MP3, 11,025 Hz, mono:**

* `122_Mobile_SoundResource` → `slash1 slash2 slash3 die1 die2 die3 punch hitmetal deflect fart goodkoto sumo refund` — the exact 13 the claim names.
* `113_Mobile_MusicResource` → `battlechants battledrums flutes safeambience safekoto safepercussion` (all 882,144 samples = **79.872 s**), `dungeonambience dungeonflute dungeonpiano dungeonpercussion` (504,288 samples = 45.7 s), `bgm_gangnam bgm_levelup bgm_lose`.

Written out and probed: `ffprobe battledrums.mp3 → format_name=mp3 duration=79.872000
bit_rate=16000`; `ffprobe slash1.mp3 → format_name=mp3 duration=0.572000`.

So the claim's proposed ledger split ("waveforms lost / inventory recovered") is the **wrong
split**, and it is the load-bearing half of the finding. Refuted; see N1/N2 for the replacement.

---

## 2. UPHELD — with what I opened

* **`blend-modes-none-at-byte-level-web`** — every figure reproduced exactly (827/304/263/54,
  675/248/214/47, 1949/12, 552/54/53, 2,091 total, zero blend flags). HELD.
* **`glow-filters-are-the-real-fx-answer`** — my full `PlaceObject3` filter parse of the web
  payload: `{'Glow': 205, 'Blur': 57, 'DropShadow': 2}` across 263 filter placements,
  **205 glows over 71 sprites**. Top sprites: 2250 ×50 (anonymous), 3110 ×47, and sprite
  **1624 = `shs3_fla.InteractUI_chikako_portrait_610`** — I resolved that name out of the
  SymbolClass table myself. HELD. *(Two wobbles worth logging: the cite says "262 filter
  placements" — it is 263; the quote says "203 glow placements" — it is 205, which is the
  number the claim TEXT gets right.)*
* **`no-blendmode-holds-for-timeline-tags-too`** — full 329,520,665-byte streaming scan of
  `reference/extracted/payload.xml`: `194 buttonHasBlendMode="false"` + `304
  placeFlagHasBlendMode="false"`, **zero `"true"`, 498/498**. The 304 is a clean cross-check:
  it is exactly the web payload's PlaceObject3 count. HELD.
* **`no-blendmode-in-authored-data`** (citelint UNCHECKABLE) — verified by hand across all
  five decoded containers; 113 and 122 hold 0 PlaceObject3, the other three hold 12/54/1473,
  all blend-free. **My check beats the linter here.** HELD.
* **`no-blendmode-in-swf-tags-either`** (citelint UNCHECKABLE) — 115 `PO2=2032 PO3=12
  sprites=1949`, 120 `PO2=2105 PO3=54 sprites=552`, 124 `PO2=4653 PO3=1473 sprites=94`,
  total **1,539**. Every single number exact. HELD.
* **`zero-blendmode-byte-proof`** — 12 / 1473 / 54 / 304 / 248 = 2,091, all blendmodes={}. HELD.
* **`hit-reaction-is-a-ladder`** — `MCSPlayer.as:1455-1466` (DOWNSTAB→24, `controlledBy==0`→84,
  else 12) and `:1762-1768` (THOUSANDSTABS→26, DEADLYCLEAVE→16) read verbatim;
  `EnemyShield.as:331-334` `PART_weapon → gotHitFlag=false; damage=0; return false` and
  `:335-340` `PART_prop → damage=0; gotHitCounter=24; playHitMetal()`. Census reproduced
  **exactly**: `12 ×23 · 0 ×3 · 24 ×2 · 84 ×1 · 26 ×1 · 16 ×1 · -1 ×1 = 32`. HELD.
* **`hud-150-is-a-potato-buff`** and **`hud-150-is-potato-buff`** — `itemdata.xml:237-249`
  is item 2115 `<type>10</type><name>4125</name><desc>4132</desc><modifier><id>38</id>`;
  `strings.json["4125"]="Potato Dog"`, `["4132"]="Eat this potato to get the 150% Damage
  buff.\n\nNote: Only one buff may be active at a time."`, plus 4133/4134/4135/4229/4230 and
  the six potato names and `["125"]="Stance Restriction"` — all read verbatim.
  `MCSPlayer.as:3701-3703` is the stance triangle with **`damage *= 1.2;`**, then `:3705
  damage -= this.getDefense();`. **I then closed it independently:
  `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1404` literally reads
  `buffstr = "150% DAMAGE";` inside `updateBuff(bufftype, duration)` under
  `StatsManager.BUFF_ATTACK`.** The HUD line *is* the buff readout. Both HELD.
* **`killbeat-6000ms-pins-24hz-tick`** — I re-measured the video myself. `ffmpeg -ss 512 -t 18
  -i reference/videos/Nr4fQstqHDM.mp4 -vf fps=60,scale=64:36`, red = `R>G+30 & R>B+30`,
  run = frac > 0.65:
  `run t=516.683..522.667 frames=360 dur=6.000s` and, from the second window,
  `run t=587.683..593.667 frames=360 dur=6.000s`. Both **exactly 360 frames @ 60 fps = 6.000 s**.
  Against `StageManager.as:1101 redFreezeCounter = 24 * 6;` (144 ticks) ⇒ **24.0 Hz**; a 15 Hz
  sim needs 9.6 s. `:916` reads exactly as quoted, so the SHEATHESWORDCHIBURI branch is the
  common case. HELD — **and I closed the build-parity hole the claim left open**: see N6. HELD.
* **`no-hold-frames-across-all-487`** — reproduced exactly, including all 19 per-file counts
  and `checked 487 mismatches 0`. HELD (and it is the claim R1 collides with; R1 loses).
* **`npc-death-dice-is-seven-way`** — `NPC.as:898 override public function die()`,
  `:1005 dice = Math.random() * 7;`, branches `<=1 ENEMYDEATH`, `==2 DEATH_FORWARD`,
  `==3 DEFEATED2 && !StageManager.isRedFreeze()`, `==4 ENEMYDEATHNOHAND`, `==5 DEATHINHALF`,
  `else` → `ENEMYDEATH` + `mcs.hair.visible = true; mcs.hatHair.visible = false;
  mcs.createFlyingWeapon(); mcs.createFlyingHat();` — all verbatim. `EnemyGoblin.as:386` is
  indeed `Math.random() * 5`, and greps 0 hits for `DEATH_FORWARD|DEFEATED2` and for
  `createFlyingWeapon` in that file. HELD. **But see N4 — the finding's lane-impact line
  "only EnemyGoblin, EnemyGoblinThrower and EnemyZombie override" is false.**
* **`predecessor-sfx-lineage`** — I extracted the DefineSound sets myself. **SHS1 = 10,
  SHS2 = 20 → 30**, and SHS2 carries `SoundStreamHead ×1 + SoundStreamBlock ×310` — the
  "310-block streamed music track", exact. `shs2_kon.swf` SymbolClass does contain
  `com.kongregate.as3.client.KongregateAPI`. The identity relations reproduce:
  `punch` md5 `2db351a0…` is **the same bytes in Duels, SHS1 and SHS2**; Duels `slash1` md5
  `322f92e4…` is **the same bytes as SHS2 `slash1` and SHS1 `sword1`**. And exactly **seven**
  more match on both sample count and byte length while differing in bytes —
  slash2 (6130/1562), slash3 (2976/1042), die1 (5290/1458), die2 (7264/1770), die3
  (9545/2186), deflect (8700/2082), hitmetal (5717/1562). HELD. *(The claim's md5 strings are
  a different digest convention from mine — its `cfd26c81…` for punch is not the md5 of the
  DefineSound payload — but the equality relations it asserts are the substance and they
  reproduce exactly, so this is a notation gripe, not an over-claim. One nit: SHS1 `sword3`
  is 6314/1666 and does NOT size-match Duels `slash3`; the 7-way size match is against SHS2,
  which is what the claim actually says.)*
* **`rig-is-27-parts`** (citelint QUOTE_NOT_LOCATED — **I located all of it**) —
  `MCSCharacter.as:10-62` declares PART_l_hand=0 … PART_r_knee=26 exactly as quoted.
  My census: 108's distinct `<n i=>` = `[0..7, 9..16, 18..21]` = **20**; across all 19 blobs
  `0-26` with **25 in use**, missing exactly **8 (crotch) and 17 (hat)**; 108 node attrs =
  **24,502 with i/x/y, 24,010 with r, 492 with a/b/c/d** (492/24502 = **2.0 %**). Sentinel
  confirmed at `FrameNodeData.as:17 public var rotation:int = 999;` and `:53 if(this.rotation
  != 999)`. Every figure exact. HELD.
* **`screen-shake-amplitude-is-inert`** (citelint QUOTE_NOT_LOCATED — **located**) —
  `StageManager.as:1200 startShake(shakeDuration:int, shakeAmt:int = 30)`, `:1211
  --screenShakeCounter;`, `:1225 shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);`,
  `:1226-1227 gameStage.x/y = start + (-shakeAmount/2 + Math.random()*shakeAmount)`.
  `grep startShake(` returns **exactly the 8 call sites cited and no others**:
  HeavenlySwordProjectile.as:76 (12), MCSPlayer.as:911 (12) / :946 (24) / :4180 (12),
  Trap_CrusherBlockAuto.as:88 (6), Trap_CrusherColumnAuto.as:90 (6), StatsManager.as:3535
  (data), Marker_RumbleTrigger.as:44 (data). Every hard-coded duration ≤ 24 < 30, so the
  amplitude arg never binds and the recommended `uniform(-t/2, +t/2)` is literally the source
  line. HELD.
* **`second-layout-mode-800x690`** — `GameEngine.as:269 originalWidth=800`, `:270
  originalHeight=480`, `:271 originalHeightWithBar:int = 690`, `:273 originalWithBarAspectRatio
  = originalWidth / originalHeightWithBar`, `:275 if(newAspectRatio <=
  originalWithBarAspectRatio)`, `:277-282` incl. `StatsManager.stageShowingFriendBar = true;`
  and `OverworldHUD.instance.friendpanel.init();` — **every line number exact.**
  I also decoded the stage RECTs myself: **web `shs3_payload_decoded.swf` = 800×690**,
  android payload = 800×480, `reference/preservation/shs3.swf` = 800×690. The claim's
  "which is why the SWF document rect decodes to 800×690" is confirmed at byte level. HELD.
* **`sfx-contract-ten-routines`** (citelint QUOTE_NOT_LOCATED — **located, all ten**) —
  `SoundManager.as:187 playSlash · 221 playDie · 255 playHit · 268 playHurt · 281 playHitMetal
  · 294 playDeflect · 307 playFart · 320 playGoodKoto · 333 playSumo · 346 playRefund`, with
  `getSound(...)` at :197/:205/:213, :231/:239/:247, :261, :274, :287, :300, :313, :326, :339,
  :352. All ten line numbers exact, and the 13 names they request are **exactly** the 13
  `DefineSound` names I extracted from `122_Mobile_SoundResource`. HELD.
* **`bindata/NEW-70th-trap-room-is-commented-out`** (citelint QUOTE_NOT_LOCATED —
  **located**) — `93_1t4647s0.bin` line 22 is `\t<!--<default>`, line 29 `</room>`, line 30
  `\t</default>-->`, and the block holds one `<room>` with **four** `Trap_ElementAuto` objects
  (lines 25-28). Counting: **70 `<room>` raw, 69 after stripping XML comments**; tiers
  **easy 13 / medium 21 / hard 15 / veryhard 20 = 69**. And the dead branch is real:
  `shs3_android_payload/scripts/RoomGenNode.as:2437
  if(QuestEngine.trapRoomData.§default§.toString() != "")` → `:2439 trapRoom =
  …§default§.room;`. HELD.
* **`bindata/NEW-setvisible-partmax-22-leaves-5-slots-unhidden`** — `FrameData.as:74-89`
  verbatim: `var partMax:int = 22; for(i = 0; i < partMax; i++){ mcs.getPart(i).visible =
  false; }` then re-show from nodeList then force `PART_hat` and `PART_crotch` visible.
  Nothing else in the file touches 22-26. `MCSCharacter.as:54/56/58/60/62` declares
  prop3=22 … r_knee=26. Corroborated: those five slots are referenced **only** by
  `MCSWolf.as:148/184/188/193/197`, i.e. creature rigs. HELD.
  *(Nit: the cite says `MCSCharacter.as:56-62`; `PART_prop3 = 22` is at :54, one line above
  the range. Content is verbatim correct.)*
* **`bindata/NEW-trap-name-suffix-is-the-trigger-wiring`** — `93_1t4647s0.bin:51`
  `<obj><id>7</id><name>Obj_FloorSwitch</name><x>200</x><property>Trap_Kunai</property></obj>`
  paired with `:52 <obj><id>32</id><name>Trap_Kunai</name>…`, schema at `:6`
  `…<property>triggered object,triggered object...</property>` and `:7` Obj_Lever with the
  pipe form. Census reproduced: **297 objects, 47 distinct raw names, 14 base types**
  (FloorSwitch 0-5, Kunai 0-5, KunaiAuto 0-3, …), and the medium tier does carry
  `Obj_FloorSwitch1 → property Trap_Kunai1` at x=300 next to `Trap_Kunai1` at x=300. HELD.
* **`bindata/NEW-warhex-has-14-states-not-7`** (citelint QUOTE_NOT_LOCATED — **located, all
  fourteen**) — `shs3_android_payload/scripts/WarHex.as` lines 11,13,15,17,19,21,23,25,27,29,
  31,33,35,37 = NOTHING 0 · SPAWNPOINT 1 · FORWARDBASE 2 · CONTROLPOINT 3 · TOWN 4 ·
  POTENTIALSPAWNPOINT 5 · UPCOMINGSPAWNPOINT 6 · LADDER 7 · DEFENSE 8 · VILLAGE 9 · CITY 11 ·
  CASTLE 12 · DISABLEDSPAWNPOINT 13 · DEMOLISHEDSPAWNPOINT 15. **Gaps at 10 and 14 confirmed.**
  Every line number exact. HELD.

---

## 3. NEW FINDINGS (nobody in this packet holds these)

**N1 — THE AUDIO IS RECOVERED, NOT ENCRYPTED. This overturns the §0 preamble S0-5 and
`docs/research/REBUILD_READINESS.md:348`.**
S0-5 says "audio is HELD but ENCRYPTED (nested 'CWS' SWFs ffdec cannot open) … You may NOT
claim audio is recovered." ffdec cannot; **this repo's own committed decoder can.** Applying
`reference/tools/payload_decode.py`'s transform with `key = byte[3] XOR 0x11`,
`122_Mobile_SoundResource.bin` and `113_Mobile_MusicResource.bin` both inflate to valid
CWS v17 SWFs holding **13 `DefineSound` MP3 tags each** — 26 real waveforms. Written to disk
and confirmed by `ffprobe` (`battledrums.mp3` 79.872 s, `slash1.mp3` 0.572 s). Ledger line 348
("the exact waveforms/envelopes are not [study-able]") **falls**, and blocker ① "ALL AUDIO —
every SFX + music param is INFERRED" collapses to "held, extractable, byte-exact". I flag the
tension with S0-5 out loud, per the standing invariant: the byte-check beats the doc.

**N2 — the music is a LAYERED STEM system, not a track list.** `113_Mobile_MusicResource`
holds six stems all at exactly 882,144 samples / 11,025 Hz = **79.872 s**
(`battlechants battledrums flutes safeambience safekoto safepercussion`) and four at 504,288
samples = **45.7 s** (`dungeonambience dungeonflute dungeonpiano dungeonpercussion`), plus
three one-shots (`bgm_lose` 3.5 s, `bgm_levelup` 29.8 s, `bgm_gangnam` 3.6 s). Identical
sample counts within a family means these are **co-mixed layers**, which is what
`MusicManager`'s `TRACK_BATTLECHANTS`-style track indices are for. Nothing in the 12-system
ledger holds a layered-music model.

**N3 — the real per-animation hold table is `AnimData.as`'s constructor switch, not the XML.**
`AnimData.as:15` copies `@d`, then `:25-141` adds a hard-coded tail: **+10** for
`"light_afterslashpose"` and for all twelve `*SLASH_POSE` variants, **+15** for the five
`*FALLSLASH_END` and five `*JUMPSLASH_LAND`, **+24** for `"sheathesword"`/`"sheathesword3"`
and `"gotlauncheddownedend"`, **+6** for the death set
(`deathenemy · deathnohand · deathnohead · defeatedanimationv2 · death · gob_death ·
KNEEGROIN_VICTIM`), plus ~25 more single cases up to **+50**. This is the table a motion
rebuild actually needs, and it is code, so no data extraction will ever find it.

**N4 — `NPC.die()` is overridden by 18 of 34 `Enemy*` classes, not 3.**
`grep -l "override public function die"` over `reference/decompiled/shs3_android/scripts/Enemy*.as`
returns 18 files (Archer, Bear, Boar, Clone, Deer, Elite, Goblin, GoblinThrower, Horse,
KanjiGuardian, NianMonster, Ogre, Stag, TrainingDummy, VegePatch, Wolf, WolfAlpha, Zombie),
and only 3 of those (Archer, Elite, TrainingDummy) call `super.die()`. The seven-way dice
governs the **humanoid** enemies (Katana, Knife, Ninja, Shield, Spear, SpearElite, Civilian×3,
Player, PlayerGiant, SorcererBoss …), which is what the claim's TEXT says — but its
lane-impact figure "31 of 34 inherit it" is wrong and must not enter the ledger.

**N5 — the two payloads ship different stage RECTs.** Byte-read of the SWF header RECT:
web `shs3_payload_decoded.swf` = **800×690**, `shs3_android_payload_decoded.swf` = **800×480**,
`reference/preservation/shs3.swf` = 800×690. The "800×480 vs 800×690" question is not a
measurement dispute at all — the two builds literally ship different document rects.

**N6 — the 24 Hz kill-beat is WEB-PARITY CLOSED, not Android-only.** The obfuscated web
payload carries the identical constants: `reference/decompiled/shs3_payload/scripts/§1t1525s0§.as:1230
§1t9905s0§ = 24 * 6;`, `:1225 = 24 * 3 + 6;`, `:1026 if(§1t9905s0§ == 24 * 5)`,
`:1049 else if(§1t9905s0§ == 24 * 3)` — a line-for-line structural match with
`StageManager.as:1101 / :1096 / :903 / :926`. The v0.717-vs-v0.682 caveat on the
`killbeat-6000ms` claim can be struck.

**N7 — the HUD buff line is literally hard-coded.** `OverworldHUD.as:1404
buffstr = "150% DAMAGE";` under `StatsManager.BUFF_ATTACK`, inside
`updateBuff(bufftype:int, duration:int)`, alongside `"150% XP" · "150% DEFENSE" ·
"150% SPEED" · "200% AP REGEN" · "200% DUEL TOKEN REGEN"` and four non-potato buff strings
(`BUFF_COINS`, `BUFF_RARELOOT`, `BUFF_MUTE`, `BUFF_FULLMUTE`, `BUFF_HELL`). The HUD
"150% DAMAGE" question is closed on a string literal, not an inference.

---

## 4. Accounting

* packet_size 24 · judged 24 · **skipped 0**
* refuted 3 (`hold-frames-are-authored-in-data` FATAL, `zero-placeobject3-tags` MATERIAL,
  `audio-inventory-is-held` MATERIAL) · upheld 21
* citelint disagreements: 8 claims were flagged `QUOTE_UNVERIFIED`/`UNCHECKABLE`
  (`rig-is-27-parts`, `screen-shake-amplitude-is-inert`, `sfx-contract-ten-routines`,
  `NEW-warhex-has-14-states-not-7`, `NEW-70th-trap-room-is-commented-out`,
  `no-blendmode-in-authored-data`, `no-blendmode-in-swf-tags-either`, and `audio-inventory-is-held`) — **I located every
  quote by hand; seven of the eight survive** (only `audio-inventory-is-held` fails, and it
  fails on a fact, not on its quote). The linter's misses were binary-file line addressing
  and cites that name a method rather than a line.
* Conversely, **two claims the linter passed as RESOLVES are false**
  (`hold-frames-are-authored-in-data`, `zero-placeobject3-tags`) — both had well-formed paths
  and wrong measurements, which is exactly the part a script cannot see.
