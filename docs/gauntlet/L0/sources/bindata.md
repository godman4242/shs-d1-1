# GAUNTLET L0 — SOURCE SURVEY: `bindata` (all 27 web-payload DefineBinaryData blobs)

**Unit:** `reference/extracted/bindata/` — 19 `<animdata>`, 1 `<survivalmodedata>`,
1 `<traproomdata>`, 5 name-generator tables, 1 GIF.
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42).
**Sweep type:** ORTHOGONAL (by source, not by system).
**Date:** 2026-08-15.

## Headline

Three of the ledger's named blockers are **not blockers**: the world map is a
63×72 bitmap sitting in `bindata/92`, the War-Room board is 6×6, and the
"severed-limb death variant" is four separate authored animations. One §3
correction (native resolution) is **confirmed by a frame while the SWF header
disagrees — the frame wins**. And the ledger's whole art-anim readiness score
rests on video measurement when the payload holds **487 animations / 5,596
keyframes / 81,706 joint transforms** verbatim.

Counter-weight, stated up front so nothing here reads as triumphalism:
**4 of those 487 animations are ported** (`src/config/ogAnims.ts`). The data is
held; the work is not done.

---

## C1 — `bindata/92` IS THE WORLD MAP. The "world bounds + geography" blocker is dead.

- **Artifact:** A2 · `reference/extracted/bindata/92_1t4648s0.bin`
- **Quote / what is in it:**
  `file` → `GIF image data, version 89a, 63 x 72`.
  Decoded (LZW, global colour table `[(0,0,0),(255,255,255),(102,102,102),(153,153,153)]`):
  only 2 indices are used — **735 white cells of 4,536**. The white cells draw
  Hokkaido, Honshu, Shikoku and Kyushu. It is a boolean land mask of Japan.
- **Cross-check:** byte-identical to the class-named Android blob
  `reference/extracted/android/110_Mobile_MapBitmapData.bin`
  (`md5 13068dfa1a5cc5628720a25782f93fed` for both, 272 bytes each) — the
  Android build names the file `Mobile_MapBitmapData`.
- **Self-verification:** the ledger's own documented start coordinate **(21,51)**
  decodes to colour index **1 = land**. Row 51 reads
  `.............###########################.##....................`.
  A coordinate system the ledger already recorded lands on a land cell in this
  bitmap. That is not a coincidence.
- **Overturns:** §4 world-exploration blocker ① — *"**world bounds + geography**
  (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via
  API; trace the map image."* Also §1 unknown-unknowns *"World-map
  topology/projection (sparse geographic Japan outline, not a grid you can
  generate from W×H)."*
- **Verdict: HELD.** World grid = **63 × 72, 735 traversable cells**. No wiki
  mining, no image tracing. `src/config/` has no world module at all today.

## C2 — Aspect ratio: THE FRAME WINS over the SWF header (and it quantifies the pillarbox)

- **Artifact:** A1 · `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
- **Crop used:** none needed for the bar — a full-frame per-column scan of the
  1920×1080 PNG, testing every 7th row, treating a column as letterbox when
  every sampled pixel has `R+G+B ≤ 18`. I also looked at the frame at full size
  to confirm the black bands are pillars, not scene content.
- **Measured:** live canvas occupies **x = 52 … 1867 (1816 px)** and
  **y = 0 … 1079 (1080 px)** → **aspect 1.6815**.
  vs 800×480 = 1.6667 · vs 800×690 = 1.1594 · vs 16:9 = 1.7778.
- **The disagreement, said out loud:** the WEB payload's own SWF header declares
  a stage RECT of **800 × 690** (`reference/decrypted/shs3_payload_decoded.swf`,
  `CWS`, twips `xmin,xmax,ymin,ymax = [0,16000,0,13800]`), while the ANDROID
  payload declares **800 × 480** (`[0,16000,0,9600]`). **THE FRAME WINS**: the
  played canvas is ~5:3, so the SWF RECT is an authoring rect, not the runtime
  viewport, and "800×480" is only literally true of the Android binary.
- **Ledger sentence:** §3.12 — *"**Native resolution is 800×480 (5:3)**, not 16:9
  — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed.
  Verify before trusting horizontal coords."*
- **Verdict: HELD, and the "verify" is now done.** ui-hud blocker ① is closed
  with a number: every HUD x-fraction taken off the full 1920 is wrong by
  **5.42 %**. Correct conversion: `frac = (x_px − 52) / 1816`.

## C3 — The engine ticks at 24 fps, one authored pose per tick. "15 fps pose latch" is a sampling artifact.

- **Artifact:** A2 · SWF header of `reference/decrypted/shs3_payload_decoded.swf`
  → `framerate = 24.0` (Android payload: also 24.0) ·
  `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:442`
- **Quote:** `stageMC.addEventListener(Event.ENTER_FRAME,gameloop);`
  and `MCSCharacter.updateAnimation()` advances `++this.frameCounter` by exactly
  one keyframe per call, called once per actor update.
- **Corroboration from bindata itself:** every trap duty cycle in
  `93_1t4647s0.bin` is a multiple of 24 — `<property>0,24,24,0,1</property>`
  (:36), `0,24,36,0,1,1,1` (:451). Designers were authoring in 24ths of a second.
- **Consequence:** every `d=` attribute in every animdata blob is **ticks at 24 Hz**,
  i.e. `d="12"` = 0.5 s. `1638` keyframes in file 108 = 68.25 s of authored human motion.
- **Ledger sentence:** §1 KNOWN-KNOWNS / §2 art-anim ready column — *"Motion &
  palette (best-evidenced slice): **15fps pose latch**, two gaits, per-stance
  slash frames…"*
- **Verdict: HELD (overturns).** The pose-latch mechanism is real; the **rate is
  24, not 15**. 15 was the video sampling floor (already flagged in the SESSION 11
  memory) mistaken for the engine rate.

## C4 — There are FIVE stances, not three. `dual` and `reversed` are complete movesets.

- **Artifact:** A2 · `reference/extracted/bindata/110_1t4637s0.bin:3`,
  `104_1t4631s0.bin:3`, and
  `reference/decompiled/shs3_android_payload/scripts/AnimData.as:38-41`
- **Quote:**
  `<anim i="dual_stance" d="1">` · `<anim i="reversed_stance" d="1">`
  and in AnimData.as the engine's own stance-pose switch:
  `case MCSActor.DUALSLASH_POSE:` / `case MCSActor.DUALSLASHDOWN_POSE:` /
  `case MCSActor.DUALSLASHUP_POSE:` / `case MCSActor.REVERSEDSLASH_POSE:`
- Both files carry the full 21-animation stance kit that light/balanced/heavy
  carry — stance, run, hor/down/up/fall/jump slash × 4 parts. Android names them
  `101_MCSCharacter_DualStanceAnimationData.bin` and
  `95_MCSCharacter_ReversedStanceAnimationData.bin`.
- **Ledger sentence:** §3.3 — *"The stance tables (dmg 0.9/1.2/1.4, reach
  300/200/100) are MASTERY-9 CEILING values, not base."* The entire ledger
  (§1, §2, §3.3, §3.4, §4 combat-core, §4 skills-meters) models exactly three
  stances; `src/config/stances.ts` `STANCE_TABLE` is `Record<StanceId, …>` with
  three keys.
- **Verdict: HELD (overturns).** Two whole movesets are missing from the model.

## C5 — Every slash is a FOUR-part state machine whose middle part LOOPS. That is the hold-and-draw mechanic, in data.

- **Artifact:** A2 · `reference/extracted/bindata/118_1t4645s0.bin:217, 492, 683, 811`
- **Quote (verbatim, consecutive):**
  ```
  217:<anim i="light_horslash_parta" d="13">
  492:<anim i="light_horslash_partb" d="9" l="1">
  683:<anim i="light_horslash_partc" d="6">
  811:<anim i="light_horslash_partd" d="1">
  ```
  `l="1"` = `AnimData.looping`. The **b** part of *every* slash in *every* stance
  loops; the a/c/d parts do not. Windup → **hold (looping) while the line is
  drawn** → strike → settle.
- **The frame counts contradict the config's ordering.** At 24 Hz:

  | attack | parta | partb (loop) | partc | partd |
  |---|---:|---:|---:|---:|
  | `light_horslash` (118:217) | 13 | 9 | 6 | 1 |
  | `balanced_horslash` (106:217) | 12 | 9 | 4 | 1 |
  | `heavy_horslash` (116:217) | **5** | 8 | 7 | 1 |

  `src/config/timing.ts` `SLASH_FRAMES` (labelled **MEASURED**) says
  `light {4,4,4} · balanced {4,4,8} · heavy {4,4,12}` — a constant 4-frame windup
  rising monotonically in recovery. The payload says the windup **varies 5→13**
  and is **longest on Light, shortest on Heavy** — the opposite ordering — and
  the recovery is non-monotone (6/4/7).
- **Ledger sentence:** §2 art-anim ready column — *"motion (15fps latch, gaits,
  **slash frames**, death), byte-exact palette"*; §4 art-anim *"Ready (strongest
  slice): … per-stance slash frames"*.
- **Verdict: HELD (overturns).** The slash-frame slice is not "ready" — the
  shipped numbers are wrong in shape, not just in magnitude.

## C6 — The engine adds fixed post-animation HOLDS. This is the exact recovery timing the ledger calls uncatalogued.

- **Artifact:** A2 · `reference/decompiled/shs3_android_payload/scripts/AnimData.as:24-141`
- **Quote:**
  ```
  case "light_afterslashpose":
     this.duration += 10;
  ...
  case MCSActor.LIGHTJUMPSLASH_LAND: ... this.duration += 15;
  case "sheathesword": case "sheathesword3": this.duration += 24;
  case "death": ... this.duration += 6;
  case MCSActor.DEATHTOUCH_PARTA: this.duration += 50;
  case MCSActor.GUARDIAN_STOMPFREEZE: this.duration += 24;
  case "ogre_nap1_mid": this.duration += 48;
  ```
  `duration` (not `frameList.length`) is what `updateAnimation()` compares
  against, so the extra ticks are a **freeze on the last pose**.
- **Lane:** combat-core (per-stance slash recovery), art-anim (the "feel" the
  ledger says was never catalogued), enemies-ai (boss freeze frames).
- **Ledger sentence:** §4 art-anim blocker ④ — *"**screen-shake** +
  **hitstop-on-landed-hit** (never catalogued)"*.
- **Verdict: PARTIAL.** These are authored animation holds, **not** hitstop and
  **not** screen-shake — I am not claiming those. But the "afterslash pose holds
  10 ticks" number is exactly the class of feel-timing the ledger lists as absent,
  and it is exact.

## C7 — The sprite-compositing contract (slot map + z-order + per-frame visibility) is fully specified.

- **Artifact:** A2 · `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:10-62`,
  `FrameData.as` (`reorderLayers`, `setVisible`), `FrameNodeData.as` (`setPosition`)
- **Quote (the slot map that decodes every `<n i="…">` in all 19 animdata blobs):**
  ```
  PART_l_hand 0 · l_uparm 1 · l_lowarm 2 · weapon 3 · prop 4 · l_foot 5 ·
  l_thigh 6 · l_calf 7 · crotch 8 · r_foot 9 · r_thigh 10 · r_calf 11 ·
  neck 12 · stomach 13 · pelvic 14 · torso 15 · head 16 · hat 17 ·
  r_hand 18 · r_uparm 19 · r_lowarm 20 · prop2 21 · prop3 22 ·
  l_shoulder 23 · r_shoulder 24 · l_knee 25 · r_knee 26
  ```
  Transform semantics, verbatim from `FrameNodeData.setPosition`:
  `mc.x = this.x; mc.y = this.y; mc.rotation = this.rotation;` when `r` is
  present, else `m.a = this.matA / 100; …` — so **x/y are plain pixels, r is
  degrees, a/b/c/d are fixed-point ×100**. Z-order: `reorderLayers` runs **only**
  on frames carrying `r="1"` (89 such frames in file 108), and re-stacks in node
  order; `hat` always follows `head`, `crotch` always follows `l_calf`.
  Per-frame visibility: a part is visible iff a node for it is present that frame.
- **Ledger sentence:** §4 items-equipment blocker ⑤ — *"**sprite-compositing
  contract** (layer order, per-slot body render — a from-scratch-art blocker) +
  item **icon manifest**."*
- **Verdict: HELD (overturns) for the layer-order half.** The icon manifest is
  a separate question I did not open. Supporting: the web payload's own script
  bundle exports the matching art symbols by slot —
  `reference/decompiled/shs3_payload/scripts/` contains `torso4000.as`,
  `uparm4000.as`, `lowarm4000.as`, `hand5000.as`, `hair6000.as`, `hat7000.as`,
  `head8000.as`, `mask9000.as`, `neck10000.as`, `thigh11000.as`, `calf11000.as`,
  `crotch11000.as`, `foot12000.as`, `weapon13000.as`, `prop13000.as`.

## C8 — `bindata/93` is a whole TRAP-DUNGEON system that appears in none of the 12 ledger systems.

- **Artifact:** A2 · `reference/extracted/bindata/93_1t4647s0.bin`
- **Quote:** root is `<traproomdata>` (:21) with four authored difficulty tiers —
  `<easy>` :32 · `<medium>` :126 · `<hard>` :309 · `<veryhard>` :446 —
  **70 `<room>` blocks**, room widths 800 / 1000 / 1100 / 1150 / 1400.
  A verbatim room (:34-37):
  ```
  <room>
  <!-- 1x sawblade -->
     <width>800</width>
     <obj><id>43</id><name>Trap_SawBladesAuto</name><x>400</x><property>0,24,24,0,1</property></obj>
  </room>
  ```
  The commented-out header block (:6-18) is the **object schema**, verbatim:
  `Trap_Kunai (angle, speed, kunaicount, spread, bigdamage)`,
  `Trap_KunaiAuto (… onDuration, offDuration, startInterval, active, bigDamage)`,
  `Trap_SawBladesAuto`, `Trap_CrushingBlockAuto`, `Trap_CrushingColumnAuto`,
  `Trap_ElementAuto (direction, elementType, …)`, `Trap_Jump`, `Trap_SpikesAuto`,
  `Trap_Boulder`, `Trap_SpikeBallAuto`, `Obj_FloorSwitch`, `Obj_Lever`,
  `Obj_LowCeiling` (+ `Obj_BonePile` used in-body). 14 object types, every
  property named.
- **Ownership:** the Android build class-names this blob
  `84_QuestEngine_TrapRoomData.bin` — it belongs to the **quest engine**.
- **Ledger:** no system ledger mentions traps, hazards, levers or floor switches.
  Nearest text, §4 world-exploration ready column: *"node-based room graph +
  signposts; AP cost table … 4 travel methods"*.
- **Verdict: HELD (overturns by omission).** A 70-room, 4-tier, 14-object hazard
  system with a fully documented property schema, absent from a 12-system ledger
  that claims to cover the game.

## C9 — `bindata/119` is not "a survival mode". It is the WAR-ROOM battle content, remapped per clan.

- **Artifact:** A2 · `reference/extracted/bindata/119_1t4646s0.bin` +
  `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1719-1762`
- **Quote (the blob):** `<survivalmodedata>` root, **39 `<wave>`, 87 `<enemy>`
  groups**, each `<id>|<qty>|<x>`; e.g. :4-8
  ```
  <enemy>
    <id>400|401|402|403|404</id>
    <qty>4</qty>
    <x>-50</x>
  </enemy>
  ```
- **Quote (the consumer):** `WarHexUI.createWarRoomWaveList(targetside:int)`:
  ```
  var xml:XML = XML(new SurvivalModeData());
  ...
  if(tempid >= 200 && tempid < 600) {
     remainder = tempid % 100;
     if(targetside == 1)      { strArray[k] = remainder + 200; }
     else if(targetside == 2) { strArray[k] = remainder + 400; }
     else if(targetside == 3) { strArray[k] = remainder + 300; }
     else if(targetside == 4) { strArray[k] = remainder + 500; }
     else if(targetside == 0 || targetside == 5 || StatsManager.isCustomClan(targetside))
                              { strArray[k] = remainder + 600; }
  }
  ```
  So the wave list is authored **once** in the 400-block and re-based per clan
  side into the 200/300/400/500/600 NPC blocks. That is exactly why
  `npcdata.xml` carries five parallel Soldier rosters (200-256, 300-356,
  400-456, 500-556, 600-656), each `Soldier / Elite Soldier / Heavy Soldier /
  Castle Guard` (names resolved via `docs/gauntlet/L0/index/resolved_names.json`).
  The Android blob is class-named `109_WarHexUI_SurvivalModeData.bin` — the
  ownership is not my inference.
- **Ledger sentence:** §4 meta-social blocker ① — *"**server-authoritative
  simulation** (24h tick, matchmaking, live population) — **unrecoverable at
  1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled)."*
- **Verdict: PARTIAL.** The live population and 24h tick remain unrecoverable —
  I am not disputing that. But the **battle content** of the clan war (39 waves,
  the clan-side id remap, the roster tiering) is HELD verbatim, and the ledger
  files it under "unrecoverable".

## C10 — The War-Room board is 6 × 6. Blocker ② closed.

- **Artifact:** A2 · `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:175-176, 253`
- **Quote:** `this.ht = 6;` · `this.wt = 6;` · `hex.x = 90 + xpos * 55;`
  Hex types enumerated in the same method: `HEX_POTENTIALSPAWNPOINT`,
  `HEX_UPCOMINGSPAWNPOINT`, `HEX_SPAWNPOINT`, `HEX_DISABLEDSPAWNPOINT`,
  `HEX_DEMOLISHEDSPAWNPOINT`, `HEX_CONTROLPOINT`, `HEX_VILLAGE`.
- **Ledger sentence:** §4 meta-social blocker ② — *"War-Room **map topology**
  (board/adjacency)."*
- **Verdict: HELD (overturns).** 6×6 hex board, 55 px pitch, 7 hex states,
  adjacency via `getExitOwner(xpos,ypos)`.

## C11 — Spawn geometry is literal: off-screen at x = −50 and x = 1650.

- **Artifact:** A2 · `reference/extracted/bindata/119_1t4646s0.bin:7, 12`
- **Quote:** `<x>-50</x>` and `<x>1650</x>` — 49 and 37 occurrences respectively
  (plus one `-1650` at wave 6, evidently an authoring typo for the right-side
  spawn). Enemies walk in from **both** sides of a ~1600 px arena, 50 px
  off-screen.
- **Ledger sentence:** §4 enemies-ai blocker ④ — *"aggro/leash/**spawn
  geometry**."*
- **Verdict: PARTIAL.** Spawn geometry is held for war/survival battles. Aggro
  radius and leash distance are **not** in bindata — STILL_UNHELD from this source.

## C12 — Boss telegraph → hit → recovery is authored as three separate clips with exact tick counts.

- **Artifact:** A2 · `reference/extracted/bindata/100_1t4627s0.bin:901, 1223, 1325`
  and `111_1t4638s0.bin:892, 1174, 1316`
- **Quote:**
  ```
   901:<anim i="ogre_swingdown" d="16">
  1223:<anim i="ogre_swingdownhit" d="5">
  1325:<anim i="ogre_swingdownend" d="11">
  ```
  ```
   892:<anim i="guardian_swingdown" d="14">
  1174:<anim i="guardian_swingdownhit" d="7">
  1316:<anim i="guardian_swingdownend" d="11">
  ```
  Same triad for `swingup` and `stomp` on both bosses (Guardian's stomp adds
  `stompfreeze` d=1 **+24 hold** from C6, then `stompreturn` d=7).
  `ogre_death` d=54, `guardian_death` d=54. Stagger: `flinch` d=8 and
  `flinch_weapon` d=8 (`103_1t4630s0.bin:2798, 2646`).
- **Ledger sentence:** §4 enemies-ai blocker ③ — *"telegraph/active/recovery +
  stagger frames."*
- **Verdict: HELD (overturns).** At 24 Hz the Ogre's overhead is
  **0.67 s telegraph / 0.21 s active / 0.46 s recovery**.

## C13 — Paired GRAB/THROW animations with a synchronized victim track. A combat category in no ledger.

- **Artifact:** A2 · `reference/extracted/bindata/102_1t4629s0.bin:3143, 3577, 7570, 8319`
- **Quote:**
  ```
  3143:<anim i="kneegroin" d="30">
  3577:<anim i="kneegroin_victim" d="41">
  7570:<anim i="backthrow" d="39">
  8319:<anim i="backthrow_victim" d="36">
  ```
  `AnimData.as` special-cases `MCSActor.KNEEGROIN_VICTIM` with `duration += 6`,
  so the victim track is engine-known, not leftover art.
- **Ledger:** the combat model in §1/§3/§4 is entirely "draw a line, the blade
  path cuts". Nothing anywhere describes a grab, a throw, or a second actor
  driven by the attacker's animation.
- **Verdict: HELD (overturns by omission).**

## C14 — Shunpo, Focus, Cleave, Chi-charge: 51 skill animations exist. The *form* of every skill is held.

- **Artifact:** A2 · `reference/extracted/bindata/102_1t4629s0.bin` (Android class
  name: `93_MCSCharacter_SkillsAnimationData.bin`)
- **Quote (selected, verbatim with line numbers):**
  ```
  4242:<anim i="shunpo_start" d="4">
  4328:<anim i="shunpo_end" d="1">
  5978:<anim i="focus_start" d="8">
  6148:<anim i="focus_end" d="13">
  6333:<anim i="cleave_start" d="9">
  9204:<anim i="chicharge_start" d="14">
  9556:<anim i="chicharge_fly" d="5">
  4351:<anim i="enchantweapon" d="8">
  4840:<anim i="warcry_start" d="4">
  4521:<anim i="buffarmor_start" d="8">
   938:<anim i="fireball" d="12">
  2038:<anim i="deathtouch_partb" d="12">
  ```
  51 animations total in the blob.
- **Shunpo specifically:** `shunpo_start` is **4 ticks** and `shunpo_end` is a
  **single pose** — there is no travel animation between them. That is the
  signature of an instantaneous displacement (vanish → arrival pose), not a dash.
- **Ledger sentence:** §4 skills-meters blocker ② — *"Shunpo's real effect (Light
  L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."*
  Also §4 rebirth-elements blocker ① — *"what each element **does** (24 skills'
  damage/cost/AoE/status — **names only**)."*
- **Verdict: PARTIAL.** "Names only" is wrong — we hold the motion for 51 skills.
  But `bindata` carries **no damage, cost, AoE or status value**; those live in
  `skilldata.xml`. I am explicitly not claiming Shunpo's numbers.

## C15 — The "severed-limb death variant" is four authored animations, not a gap.

- **Artifact:** A2 · `reference/extracted/bindata/108_1t4635s0.bin:11953, 12402, 18132`
  and `103_1t4630s0.bin:2950`
- **Quote:**
  ```
  11953:<anim i="deathnohand" d="25">
  12402:<anim i="deathnohead" d="31">
  18132:<anim i="deathinhalf" d="28">
   2950:<anim i="seppuku_nohead" d="26">
  ```
  Plus the rest of the death family in 108: `death` d=38,
  `defeatedanimationv1` d=34, `defeatedanimationv2` d=35, `deathenemy` d=23,
  `deathwitharrow` d=23, `deathbyarrow` d=21, `deathdowned` d=7 — and
  `corpse1`…`corpse5` static poses in 103 (:979-1067).
- **Ledger sentence:** §4 art-anim blocker ⑤ — *"severed-limb death variant."*
- **Verdict: HELD (overturns).**

## C16 — NPC and place names are PROCEDURALLY GENERATED. Two "missing bosses" are probably generated names.

- **Artifact:** A2 · `reference/extracted/bindata/94_1t4651s0.bin` (398 male given
  names), `97_1t4650s0.bin` (291 female), `95_1t4649s0.bin` (33 noble/court family),
  `96_1t4652s0.bin` (36 samurai family), `98_1t4653s0.bin` (677 place names).
  Android class names confirm the roles: `85_NameGenerator_MaleNames`,
  `86_NameGenerator_NobleFamilyNames`, `87_NameGenerator_SamuraiFamilyNames`,
  `88_NameGenerator_FemaleNames`, `89_NameGenerator_PlaceNames`.
- **Quote:** `96_1t4652s0.bin:7` → `Hachisuka` · `96_1t4652s0.bin:11` → `Honda` ·
  `94_1t4651s0.bin:80` → `Kano` · `97_1t4650s0.bin:226` → `Shizuka`.
- **Ledger sentence:** §4 enemies-ai surface note — *"Boss table omits Hachisuka
  Kano, Honda Shizuka, Zabuza, Tengu Hotaru."*
- **Verdict: HELD.** Both "Hachisuka Kano" and "Honda Shizuka" decompose exactly
  into `samurai-family-name + given-name` from these two pools. Treating them as
  authored bosses to be recovered is very likely chasing the name generator.
  (I did **not** find Zabuza or Tengu Hotaru in these pools — those two remain
  open.) Secondary: **677 place names** is a free, verbatim answer to the
  world-exploration territory-naming problem.

## C17 — Volume, and the honest counter-weight: 487 animations held, 4 ported.

- **Artifact:** A3 · `npx vitest run tests/a11AnimData.test.ts`
  ```
  Test Files  1 passed (1)
       Tests  12 passed (12)
  ```
  and `src/config/ogAnims.ts:39`:
  ```
  export type OgAnimName = 'walk' | 'balancedhorizontalslash_parta' | 'balancedhorizontalslash_partb' | 'balancedhorizontalslash_partc';
  ```
- **Measured over all 19 animdata blobs** (`grep -c '<anim '` / `'<f '` / `'<n '`):
  **487 animations · 5,596 keyframes · 81,706 joint transforms.**
  Largest: `108` (human) 158 anims / 1,638 frames / 24,502 nodes.
  `src/config/poses.ts` ships **6 hand-authored poses** (`IDLE_POSE`,
  `SLASH_WINDUP`, `SLASH_FOLLOW`, `GUARD_POSE`, `HIT_RECOIL`, `DEAD`), all
  labelled MEASURED/INFERRED from video.
- **Ledger sentence:** §2 — *"| **art-anim-audio-feel** | 56 | motion (15fps
  latch, gaits, slash frames, death), byte-exact palette |"* and §7 *"~Half the
  load-bearing numbers are in hand."*
- **Verdict: HELD (overturns), with the caveat stated.** The motion score is
  scored against video measurement when the authored source is on disk. But the
  byte-check gate that exists (`tests/a11AnimData.test.ts`, 12 green) guards only
  **4 of 487** animations, and only from file 108. The other 18 blobs are
  referenced by nothing in `src/`, `scripts/` or `tests/`.

## C18 — Per-stance idle poses are held and are materially different from each other; `poses.ts` has one idle for all stances.

- **Artifact:** A2 · `reference/extracted/bindata/108_1t4635s0.bin:8002, 8025, 8048`
- **Quote:** `<anim i="lightstanceidle" d="1" l="1">` /
  `<anim i="balancedstanceidle" d="1" l="1">` / `<anim i="heavystanceidle" d="1" l="1">`,
  each a full 19-node pose. Head node (slot 16) and weapon node (slot 3),
  verbatim:
  | stance | head (slot 16) | weapon (slot 3) |
  |---|---|---|
  | light | `x="29" y="-59" r="12"` | `x="24" y="-44" r="177"` |
  | balanced | `x="-7" y="-92" r="9"` | `x="14" y="-46" r="44"` |
  | heavy | `x="3" y="-78" r="9"` | `x="14" y="-100" r="-170"` |
  Per C7 these are plain pixels and degrees. The three stances differ by up to
  **33 px of head height** and carry the weapon at three different angles
  (177° / 44° / −170°).
- **Config:** `src/config/poses.ts` exports a single `IDLE_POSE` used for all
  stances, documented as *"MEASURED — semi-crouch combat idle … measured off the
  duel-spawn frame."*
- **Verdict: HELD.** Stance idle is per-stance in the original and single in the
  build. I deliberately do **not** convert these to interior joint angles here —
  part art has its own baked rest orientation, and I have not established it, so
  a "knee = N°" claim from this data would be unfounded. The x/y joint positions
  are the safe, exact quantity.

## C19 — STILL_UNHELD: the war/survival waves reference 11 boss NPCs that exist in neither npcdata.

- **Artifact:** STILL_UNHELD (cite shows where the hole is) ·
  `reference/extracted/bindata/119_1t4646s0.bin:18`
- **Quote:** `<id>700</id>` — and ids `701`–`710` appear once each as the wave
  boss slots.
- **Checked:** `reference/extracted/npcdata.xml` has 495 `<npc>` blocks, ids
  0–819, **none in 700–710**. The Android `125_Mobile_NpcData.bin` has 1,273
  `<id>` entries, max 20028, **also none in 700–710**. The `WarHexUI` clan remap
  only rewrites ids in `[200,600)`, so 700–710 are used literally.
- **Verdict: STILL_UNHELD.** Eleven survival/war boss definitions are referenced
  and absent from both builds we hold. This is a real, newly-located hole — it is
  not in any ledger, because the ledger never opened this file.

---

## Lane-impact summary

| Claim | Lane(s) | Direction |
|---|---|---|
| C1 world map bitmap | world-exploration | **under-claim** — blocker ① dead |
| C2 pillarbox measured | ui-hud | **confirms §3.12, closes blocker ①** (frame beat the SWF header) |
| C3 24 fps tick | art-anim, combat-core | **over-claim** — "15fps latch" is wrong |
| C4 five stances | combat-core, skills-meters | **over-claim** — model is 3-stance |
| C5 4-part looping slash | combat-core, art-anim | **over-claim** — SLASH_FRAMES wrong in shape |
| C6 animation holds | combat-core, art-anim | under-claim (partial) |
| C7 slot map + z-order | items-equipment | **under-claim** — blocker ⑤ half dead |
| C8 trap rooms | world-exploration, quests-story | **omission** — system absent from ledger |
| C9 survival = war waves | meta-social, enemies-ai | **under-claim** — "unrecoverable" content is held |
| C10 6×6 hex board | meta-social | **under-claim** — blocker ② dead |
| C11 spawn x | enemies-ai | under-claim (partial) |
| C12 telegraph triads | enemies-ai | **under-claim** — blocker ③ dead |
| C13 grab/throw + victim | combat-core | **omission** |
| C14 51 skill anims | skills-meters, rebirth-elements | under-claim (partial) |
| C15 severed-limb deaths | art-anim | **under-claim** — blocker ⑤ dead |
| C16 name generator | enemies-ai, world-exploration, quests-story | **over-claim** — two "bosses" are generated |
| C17 487 anims / 4 ported | art-anim, progression(scope) | under-claim + honest counter-weight |
| C18 per-stance idles | art-anim, combat-core | under-claim |
| C19 boss ids 700–710 | enemies-ai | **STILL_UNHELD (new hole)** |

## Standing caveats carried

- All AS3 logic cites in this file come from **`shs3_android_payload`**
  (clientVersion 0.682) — the web build is v0.717 and its script bundle is
  obfuscated. Per S0-3, data-XML row counts match exactly, but tuning parity is
  **not** established. Every AS3-derived claim above is a claim about the
  *engine's data contract* (formats, slot indices, loop flags, hold lengths,
  board size), not about a tuned combat number.
- The two SWF-header numbers (framerate 24, stage rect) were read from the **web**
  payload directly and need no Android caveat.
- C2 is the only A1 claim here. Where a doc and a frame disagreed, the frame won,
  and I said so.
