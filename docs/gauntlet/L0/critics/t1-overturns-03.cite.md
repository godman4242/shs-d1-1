# t1-overturns-03 — CITE LENS review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` · 24 claims · 24 judged · 0 skipped.
Every verdict below rests on an artifact I opened myself in this run.

Headline: **19 survive, 5 fall.** All four `enemies-ai/setlevel-*` claims hold. All four
`nameplate-*` claims cite REAL constants but two of them mis-assign those constants and are
refuted. The `hit-lockout-decomposes-exactly` triangulation is a unit-mismatch and falls.

---

## Method

I opened every cited AS3 file with `sed -n` and printed real line numbers, decoded every
`.bin` (they are **UTF-8 with BOM**, not UTF-16LE — the §0 warning does not apply to
`reference/extracted/android/*.bin`), resolved every `strings.json[...]` key with a Python
lookup, and cropped/upscaled every cited frame with PIL LANCZOS before grading it.

---

## VERDICTS

### 0. `enemies-ai/flinch-state-exists` — **HELD** (overturn upheld)

Every one of the six cites resolves verbatim at the exact line:

- `NPC.as:747-758` `doFlinch()` — saves `prevActionState`/`prevAnim`/`prevFrameCounter`,
  sets `actionState = FLINCH_STATE`, `startAnim(FLINCH_WEAPON)`; guard at `:749` is
  `FLINCH_STATE || SLASH_STATE`.
- `NPC.as:760-764` `endFlinch()` restores all three. Exact.
- `MCSActor.as:922` `internal static var FLINCH_STATE:int = 28;` — exact.
- `MCSActor.as:170` `FLINCH_WEAPON:String = "flinch_weapon"` / `:172` `FLINCH:String = "flinch"` — exact.
- `MCSPlayer.as:4309` override, `:4311` adds `SKILL_CHICHARGE_STATE` to the guard — exact.
- `EnemyZombie.as:542-544` `else if(!this.isDowned() && !isAirborne()) { this.startAction(FLINCH_STATE); }` — exact.
- `EnemyShield.as:117-119` `case FLINCH_WEAPON: case FLINCH: endFlinch();` — exact.
- `94_MCSCharacter_Human2AnimationData.bin` → `<anim i="flinch_weapon" d="8">` and
  `<anim i="flinch" d="8">`, 8 `<f>` children each. Confirmed absent from `99_Human`, so the
  claim's own "the survey searched the wrong blob" note is right.

**Strengthened beyond what the claim asked for:** `reference/extracted/bindata/103_1t4630s0.bin`
(the **web v0.717** Human2 animdata) is **byte-identical** to the android blob —
`md5 6852a591ab2d5895090b3d37ccec9ba2` for both. The build-parity caveat does not apply to this
animation. Ledger `enemies-ai ③` loses its stagger half.

### 1. `enemies-ai/gothitcounter-is-iframes` — **fact HELD, overturn NOT upheld** (material)

The narrow claim is true and exactly cited. `canHit()` is defined once (`NPC.as:296-299`) and
`grep -rn "canHit("` over all 559 android scripts returns exactly the 11 `NPCManager` lines the
claim names — 1222, 1263, 1325, 1414, 1434, 1454, 1494, 1513, 1534, 1564, 1579. Nothing else
calls it. `gotHitCounter` also early-returns `gotHit()` at `NPC.as:388`, and the per-tick
decrement (e.g. `EnemyZombie.as:212-214`) sits *after* `this.doAction()`, so it is not an
action gate. All correct.

**But its stated consequence is false.** The lane_impact reads "the source implements no
hit-reaction at all, neither a stagger animation nor an action lock." `NPC.as:747-757` — in the
same file, 450 lines below `canHit()` — sets `actionState = FLINCH_STATE` and plays an authored
8-frame clip. That is both. The ledger sentence ③ does not stay STILL_UNHELD; it falls in the
opposite direction (claim #0).

### 2. `enemies-ai/hit-lockout-decomposes-exactly` — **REFUTED** (material)

All three cites resolve. `MOTION_MEASUREMENTS.md:24` is exactly the `| Hit stagger | **12
frames total: 4 upright + 8 bent-forward** | duel-strike-A: frames 036–047 after streak |` row.
`SOURCE_CONSTANTS.md:261` is the poise row verbatim. `NPC.as:462` is `this.gotHitCounter = 12;`.

The claim is wrong anyway, on two independent grounds.

**(a) Ordering.** In `EnemyZombie.gotHit()` the counter is set at `:522` and the flinch fires at
`:544` — the *same call*. The flinch clip starts on the hit frame. And both advance on the same
per-NPC tick: `EnemyShield.as:39` `mcs.updateAnimation()` then `:123-125` `--gotHitCounter`.
`MCSCharacter.updateAnimation()` (`:1315`) advances exactly one pose per call. So the 8-pose
flinch is **nested inside** the 12-tick window (0→7 of 0→11), never "4 frames held **then** the
8-frame clip." The recreation recipe the claim writes down is not what the source does.

**(b) Units.** The "12" in `MOTION_MEASUREMENTS.md:24` is **video** frames at 60 fps — the same
table's `Death collapse ... settled 20f ≈ 333ms` pins the rate — while `:18` measures the pose
latch at **15 fps, strict, every 4th video frame**. An 8-pose clip therefore spans 32 video
frames ≈ 533 ms, not the 8 bent-forward video frames (133 ms) the claim matches it to.
`12 = 4 + 8` is arithmetic across three incommensurate clocks. "Triangulated across three
independent artifacts" is exactly what it is not.

The stagger half of ③ does die — but by claim #0, not by this decomposition.

### 3. `enemies-ai/nameplate-colour-is-five-valued` — **HELD** (overturn upheld; minor mis-cite)

I opened every call site. Five distinct constants, confirmed:
`16763904` at `MCSPlayer.as:245`, `FriendlyElite.as:64`, `FriendlyArcher.as:57`,
`FriendlySpearElite.as:55` · `10027008` at `Obj_NPCAggro.as:76` and `:80`, `EnemyPlayer.as:774` ·
`16777215` at `EnemyPlayer.as:83`/`:771`/`:880`, `EnemyClone.as:81`/`:85`, `EnemyElite.as:114`,
`EnemyKanjiGuardian.as:59` · `39423` at `Obj_NPCProcGen.as:51` · `12627019` at `:60` with
`showIcon(2)` at `:61`. `MCSCharacter.as:1533` is the `setDisplayName(str, color:uint = 0)`
signature. "Gold means player OR friendly" is right.

Off-by-one: the quote attributes `setDisplayName(npcname + " (" + lvl + ")", 10027008)` to
`Obj_NPCAggro.as:79`; line 79 is `{` and the call is at `:80`. `:76` is also cited and carries
the same constant, so the substance stands. Minor.

### 4. `enemies-ai/nameplate-colour-table` — **REFUTED** (material)

The pixel work is impeccable — I reproduced it. In
`reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg` (1024×576), crop (340,315)-(480,350)
LANCZOS×6 reads **"BANDIT (4)"** in dark red and its most-saturated pixels include exactly
`(138,3,0)` and `(133,4,0)`; crop (180,315)-(240,350) reads **"GUEST"** in gold, containing
exactly `(244,213,61)` and `(240,208,48)`. Every AS3 literal quoted also resolves.

The **rule** built on top of that is wrong, and its own frame is what kills it.

1. "the plain mob classes get no plate at all" and "dark red 0x990000 for an **opposing-side
   duelist or boss**" — the cited frame shows a roaming field BANDIT, a plain mob, wearing a
   dark-red plate in the overworld. That is `Obj_NPCAggro.as:73/80` (hide health bar, then
   `npcname + " (" + lvl + ")"` at `10027008`), which the claim never cites. **The frame wins.**
2. "the format is literally `name + " (" + lvl + ")"`" — false for the web target. See NEW-1:
   `session11/stance-reach/B_t785.200_...png` shows the duel opponent's white plate reading
   **"FUKUSHIMA CHIKO"** with no level at all.

Claim #5 states the same evidence correctly. The five-value core survives there.

### 5. `enemies-ai/nameplate-is-a-spawner-split-with-hex-colours` — **HELD** (overturn upheld; minor)

The mechanism is right and it is the one the frames actually show.
`Obj_NPCAggro.as:73` `this.npc.mcs.hideHealthBar();` then `:80` the red `NAME (lvl)` — and
`zFtCaTO0_1M/seg-10/frame_0013` is precisely that: BANDIT (4) in red, **zero health bars** on
screen. `zFtCaTO0_1M/seg-11/frame_0020` is the complement: green enemy health bars, no enemy
plates. `MCSCharacter.as:258` `this.setDisplayName("");` is the default-blank, exact.
`MCSCharacter.as:1533-1545` including `if(this.healthBar.visible) { this.displayName.y =
this.healthBar.y; }` — exact.

Two imprecisions, neither fatal: seg-11/frame_0020 is not "zero plates" — the player's gold
`GUEST` plate is still rendered in combat; and "duel opponents use white **WITH a level**" is
contradicted on a v0.717 frame (NEW-1). The spawner split and the hex constants stand.

### 6. `enemies-ai/nameplate-is-per-entity-with-exact-hues` — **REFUTED** (material)

`EnemyPlayer.as:768-810` is quoted verbatim — I checked it line by line, including the
`1.25/1.2/1.1/0.8` bands and `damageRange = 0` at `:810`. The cite is clean.

The claim generalises one class's branch into the game-wide rule: "only bosses and duelists get
one, everyone else is **explicitly blanked**." Four counter-sites in the same directory:
`FriendlyArcher.as:57` (extends `EnemyArcher`, no `isBoss`), `FriendlySpearElite.as:55`
(extends `EnemySpearElite`), `Obj_NPCAggro.as:76`/`:80`, `Obj_NPCProcGen.as:51`/`:60` — all
paint plates on entities that are neither boss nor duelist. And the overworld frame shows a
plain BANDIT wearing one. The "white `name (level)`" format is separately contradicted on film
(NEW-1). Its two "unreported combat facts" are genuine but scoped to `EnemyPlayer`, not to
"field trash" generally.

### 7. `enemies-ai/setlevel-has-11-overrides` — **HELD** (overturn upheld)

`grep -l "override public function setLevel" *.as` returns **exactly 11** files, and exactly the
11 the claim lists. `EnemyOgre.as:51-53` is an empty body. `EnemyKanjiGuardian.as:48-58` and
`EnemyElite.as:23-40` match the quoted text line for line, `xp = lvl * 5 + 45` at `:58`/`:34`,
`hitsToKillBoss = 10 + lvldiff` at `EnemyElite.as:40`.

The causal claim checks out too: `npcdata.xml` npc **id 77** is `<lvl>80</lvl> <hp>40</hp>
<ai>23</ai>`, and `NPCManager.as:587-588` `case 23: actor = new EnemyOgre(...)`. The Ogre really
does ship at level 80 with 40 HP because its `setLevel` does nothing.

### 8. `enemies-ai/setlevel-is-eleven-formulas` — **HELD** (overturn upheld)

`EnemyElite.as:34-41` verbatim, including `playerATK = getMinDamage() + getDamageRange() / 2`,
`hitsToKillBoss = 10 + lvldiff`, `hitsToKillPlayer = 18 - lvldiff`.
`EnemyWolfAlpha.as:73-78` verbatim — `xp = lvl*5+45` then `if(lvl <= 5) { damage = 1; defense =
1; }`, and I confirmed there is no `maxhp` clamp and no `×0.9` in it.
`EnemyTrainingDummy.as:36-41` verbatim, `maxhp = 8` at `:39`.
Base `NPC.as:239-259`: `if(lvl <= 20) factor *= 0.9`, `xp = lvl*2+20`, `if(lvl <= 10) damage =
1; defense = 1; maxhp = 1;`. The elite family genuinely inverse-solves off `StatsManager`
live-player stats. Blocker ① is not "absent" — it is a policy per AI class.

### 9. `enemies-ai/setlevel-is-twelve-formulas` — **HELD** (overturn upheld; minor)

Same body of code, counted as 1 base + 11 overrides = 12. `EnemyPlayer.as:73-88` verbatim.
The three autobalance constants all resolve: `EnemyPlayer.as:97` `hitsToKillBoss = 8 + lvldiff`,
`EnemyElite.as:40` `= 10 + lvldiff`, `EnemyKanjiGuardian.as:65` `= 5 + 8 + lvldiff` (13).
The npcdata bucket claim is exact: `<ai>` histogram over `reference/extracted/npcdata.xml` gives
**ai 9 = 73** out of 425, the largest bucket, and `NPCManager.as:545-546` `case 9:` is
`new EnemyPlayer(...,false,false)` — whose override skips both the `×0.9` and the 1/1/1 clamp.
The "1-HP field trash" story genuinely cannot be sourced to this code.

Minor: `hitsToKillPlayer` is `16 - lvldiff` in `EnemyPlayer`/`KanjiGuardian` but `18 - lvldiff`
in `EnemyElite`; the claim reports only 16.

### 10. `enemies-ai/tengu-absent-from-resolved-strings` — **HELD** (overturn upheld)

I re-ran it and went further than the claim.
`grep -ic tengu` → `strings.json` **0**, `resolved_names.json` **0**, `npcdata.json` **0**.
A UTF-8 **and** UTF-16LE decode sweep of every file under `reference/extracted/` → **no hit**.
`grep -ril tengu reference/decompiled/` (2,768 classes) → **no hit**.

Meanwhile `REBUILD_READINESS.md:219` lists "Tengu/Guardian" under **Ready** and `:221` names a
boss "Tengu Hotaru". Under §0 that is a claim with no artifact behind it. The Ready bullet falls
to STILL_UNHELD for its Tengu element. The claim's own hedge — v0.717-only addition, or ledger
invention — is the honest one.

### 11. `enemies-ai/weapon-part-hit-deals-zero` — **HELD as a fact, NOT an overturn** (minor)

`EnemyZombie.as:502-505` is verbatim (`case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag =
false; damage = 0; return false;`); `MCSCharacter.as:16` `PART_weapon:int = 3`. The cite range
starts one line early (`:501` is `break;`) — trivial. The mechanic is real and **general**, not
zombie-only: `grep -rln "partList\[MCSCharacter.PART_weapon\]"` hits 20+ classes including
`NPC.as` and `MCSPlayer.as`. And the `return false` fires *before* `gotHitCounter = 12` at
`:522`, so "triggers no lockout" is right.

It does not overturn the sentence it names. `ledger_text` points at the `AI_TIERS`/`ENEMY_BASE`
hp-150 surface line, which this leaves untouched. The claim itself says it "appears in no ledger
bullet" — that is an ADDITION. Real, well-cited, mis-filed as an overturn.

### 12. `enemies-ai/web-arrow-dual-gravity` — **HELD** (overturn upheld) — strongest in the packet

- `shs3_payload/scripts/§1t128s0§.as:8` `internal static var §1t12543s0§:Number = 3;` — exact.
- `§1t4542s0§.as:290-299`: `_loc6_ = §1t128s0§.§1t12543s0§; if(_loc1_) { _loc6_ = 1.5; }` and
  the solve `(_loc5_ - _loc3_ - 0.5 * _loc6_ * _loc9_ * _loc9_) / _loc9_`. The knockdown roll
  (`:276/:280/:284`, level-banded 1/2, 1/3, 1/4) is computed **before** the solve and feeds it,
  exactly as claimed. Quoted range label is 2 lines early; the primary cite `:275-305` covers it.
- `§1t137s0§.as:64-72`: `if(this.§1t4425s0§) { velY += 1.5; } else { velY += §1t12543s0§; }` —
  exact. `§1t4425s0§` is set from the constructor's `param4` at `:40`.
- `shs3_android/scripts/ArrowProjectile.as:55-56`: `velY += GRAVITY;` unconditional.
  `grep -c "1\.5" ArrowProjectile.as` → **0**. Confirmed.
  I also checked the android solve — `EnemyArcher.as:277/281` uses `Projectile.GRAVITY`
  unconditionally there too — and `ArrowProjectile.as:14` `initArrow(..., canLaunch:Boolean, ...)`
  with `Damage.LAUNCH_KNOCKDOWN` at `:39`, which identifies `§1t4425s0§` as the knockdown flag.

A real, enumerable v0.717-vs-v0.682 behavioural diff. Blocker ⑤'s arrow half closes, with a
version-specific answer.

### 13. `enemies-ai/web-has-39-ai-cases-not-38` — **HELD** (overturn upheld)

citelint could not verify the quote because the quote *is* a shell command. I ran it.
Web `§1t1543s0§.as:615-732`: `grep -o "case [0-9]*:" | sort -u | wc -l` → **39** (0..38);
`grep -o "new §[^(]*" | sort -u | wc -l` → **36**.
Android `NPCManager.as:516-634`: **38** cases (0..37), **34** unique (31 `Enemy*` + 3 `Friendly*`).
Both switch heads are real (`switch(_loc6_.ai)` / `switch(xml.ai)`). Numbers exact.

### 14. `frames/HUNT-39-hardcoded-tips-in-GameEngine` — **HELD** (overturn upheld)

Every one of the 17 named lines printed the exact quoted string — `:564` green/special,
`:568` blue/rare, `:572` purple/unique, `:584` spacebar-stance, `:588` number-keys,
`:592` drag-and-drop-to-aim, `:612` undead heads, `:616/:620/:624` village→town→city→castle,
`:640` **hold-mouse-to-run**, `:644` 12-hour seeds, `:679` Scavenging L5 hidden paths,
`:683` SPD → cooldown + slash line, `:695` AP from duels/war room.
Block is `dice == 0..38`, `grep -c 'str = "Tip:'` → **39**, and `shs3_android_payload/scripts/
GameEngine.as` carries the identical 39. Only 3 `Tip:` hits exist in `strings.json` — these 39
are hardcoded, as claimed.

Ledger effect: the memory line "**it was never sourced**" falls — `GameEngine.as:640` is the
source. The *measurement* half is untouched; on behaviour a v0.717 frame still outranks a
v0.682 tip string.

### 15. `frames/HUNT-combat-corpus-never-opened` — **HELD as a coverage finding, no ledger overturn** (minor)

Arithmetic reproduced from `frames.json` exactly: 7,365 indexed files in 112 dirs + 16 at root =
**7,381**. `Nr4fQstqHDM/seg-*` + `zFtCaTO0_1M/seg-*` = 2,475; plus the two `map/frames` dirs
(100 + 100) = **2,675**. 4,256 / 7,381 = **57.7% ≈ 58%**. Every named directory count is right
to the file: `session24/svm-B05-mountain-duel/fight15` **480**, `svm-A16-beach-duel` **406**,
`reach-A28-forest-duel` **372**, `reach-B-dojo` **342**, `reach-B-honda-duel` **248**,
`gait-duel-speeds` **194**.

Both A1 quotes verified by opening the PNGs at 1920×1080:
`session11/lead/t396.0_counter-triangle.png` — "TRAINING HALL", "STORY QUEST: ATTACK TRAINING
DUMMY USING HEAVY STANCE", articulated wooden dummy, "1257 / 1450 EXPERIENCE POINTS",
"BALANCED STANCE" with a **tan/brown** portrait ring (crop 60,930-260,1080 ×4).
`session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png` — "AUTO SLASH OFF",
"1 HIT COMBO", "FUKUSHIMA CHIKO" over a red/green HP bar, "SOUND360TM", red slash line
end-to-end with a steel blade at its head, **blue** ring, 14/20, 26/31, "150% DAMAGE",
slots 2 and 3. All present.

Not an overturn: it names no ledger sentence. It indicts a *survey's* coverage. The claim
"every one of the packet's 21 cites points at a seg-NN directory" is about a packet I am blind
to and I did not grade it.

### 16. `frames/HUNT-gold-to-resource-exchange-rate` — **HELD** (overturn upheld)

`strings.json["61"]` and `["100"]` resolve verbatim: 1 Gold → 10 Duel Tokens / 10 AP.
`["122"] = 'Max Duel Tokens'`, `["4173"/"4174"/"4175"] = '10/25/40 Duel Tokens'`.
Frame `Nr4fQstqHDM/seg-10/frames/frame_0048.jpg`, crop (0,400)-(700,576) ×2, reads
**"STABLEHAND / WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE? / COST: 14
COINS"** and nothing else — no AP line. `REBUILD_READINESS.md:79` says "stable 14c+5AP". The
coins half is confirmed on film; the +5AP half has no cite on this frame and the claim asks for
one rather than asserting its absence. Correctly hedged.

### 17. `frames/HUNT-player-screen-stat-contract` — **frame HELD, overturn NOT upheld** (material)

I opened `zFtCaTO0_1M/seg-00/frames/frame_0051.jpg` at ×1.9 and every single element is there:
PLAYER, 114 COINS, 3 GOLD, level badge 2, 787 / 1450 EXPERIENCE POINTS, AVAILABLE STAT POINTS: 3,
HP 10/10 green, CHI 10/10 blue, AP 30/30 light-blue with a bare "30" beneath, ATK 1,
**DEF "1 +2"** with the bonus in gold, SPD 1, an ADD HP affordance, **WEIGHT: 14 / 100**, and a
9-slot doll (hat, mask · torso, gloves · legs, weapon · ring, boots, ring).
`ui_strings.txt:197` `Weight: 50/50` and `:314` `hp: 123 / 123 (hp regen 12 ) chi: 123 / 434
(chi regen 13)` both resolve. Flawless A1 work.

The overturn does not hold. "the ledger records nowhere" / "Weight appears nowhere in any of the
twelve ledger systems" is false: `REBUILD_READINESS.md:209` lists under **Ready** for
items-equipment — "9-slot paperdoll; … **weight cap 100**; … measured weight table", and `:33`
records `itemdata.xml` carrying per-item weight. The genuinely new parts (AP as a third displayed
meter, the base-vs-bonus split rendered separately) survive as additions.

### 18. `frames/HUNT-rebirth-picker-recoverable-from-strings` — **HELD** (overturn upheld)

citelint said UNCHECKABLE (`NO_PARSEABLE_PATH`) because the cite is bare `strings.json[...]`
keys. I resolved all 17 by hand and every one is verbatim:
`["611"] 'Choose an element to specialize in.'` ·
`["4155"] 'New Game +\nProgress on to the next Dan Rank and specialize in an element. \nLevel 80
required.'` · `["610"]` the full rebirth terms including "Slash length and bank storage is
increased with each dan rank." · `["6030"]-["6033"]` Fire/Water/Wind/Earth Element Skills — a
closed four-set, corroborated by `["507"]-["510"]` Fire/Wind/Water/Earth ATK and
`["6058"]-["6061"]` the four elemental traps · `["4154"] 'Scroll of Rebirth'` ·
`["864"] '[0] has rebirthed and is now Dan [1]!'`.
`REBUILD_READINESS.md:205` blocker ⑤ "rebirth/element-picker UI (never filmed)" is mostly
closable without a picture. The claim concedes the visual layout stays unheld — correct.

### 19. `frames/HUNT-repair-cost-is-runtime-parameterised` — **HELD** (overturn upheld)

`["848"] 'Repair your currently equipped weapon?\nCost: [0] coins'` — the `[0]` runtime fill is
the whole point, and it is there. `["850"]/["851"]/["852"]` are three otherwise-identical
Reinforce prompts at 5000 coins differing only in `1 Silver Ore` / `1 Titanium Ore` / `1 Uncut
Diamond` (plus `["849"]`, a fourth with no cost line). `["636"]` name+unbreakable for 2 Gold,
`["669"]` the on-break offer, `["393"]` whet stones / repair kits / ninja services,
`["4143"] 'Sword Repair Kit'`, `["7042"]` the repair-effectiveness skill.
`ui_strings.txt:257` `condition: well-maintained23`.
`REBUILD_READINESS.md:215` blocker ③ "Repair-Weapon cost (never captured)" is mis-specified:
no frame can ever capture a constant that does not exist.

### 20. `frames/HUNT-stance-triangle-and-ring-colours` — **HELD** (overturn upheld)

All six string keys verbatim. The triangle is closed and consistent:
`["6001"]` Light "Effective against Heavy Stance", `["6003"]` Balanced "Effective against Light
Stance", `["6005"]` Heavy "Effective against Balanced Stance.\n**Defense -20%**".
`["IDS_Q50S3NODE1"]` "Light stance - blue, Balanced stance - brown, Heavy stance - red."
`["6085"]-["6087"]` the three hold-to-charge per-stance ultimates.

Frame corroboration on **web v0.717**, done myself: `t396.0_counter-triangle.png` HUD reads
BALANCED with a tan/brown ring; `B_t785.200_LIGHT_...png` reads a blue ring. String and film
agree.
`grep -rn "Defense -20"` over `docs/` (excluding gauntlet) returns nothing — the −20% is new to
the ledger, and `REBUILD_READINESS.md:241` only had "portrait ring is stance-colored, not fixed
red" with no enum.

### 21. `frames/HUNT-ui-strings-txt-is-unmined` — **HELD** (overturn upheld)

`wc -l` → **471** lines, as claimed. Every cited line printed verbatim: `:7` the odds worked
example, `:26` odds finalised at close, `:100` `physical dmg / critical dmg / piercing dmg: 20`,
`:193` `War room rules 5/6 (WINNING AND LOSING)`, `:197` `Weight: 50/50`, `:212` `next level
damage: 10 def: 20`, `:214` the tournament template (`level requirement: 10 - 30`, `autostarts
upon full roster`, `round duration: 30 min`), `:215` clan/rank/moves, `:257` condition, `:314`
hp/chi regen.
Its build inference is confirmed on film: this file says **5/6**, and
`Nr4fQstqHDM/seg-20/frame_0011` reads **"WAR ROOM RULES 1/7"**. Genuinely a pre-v0.717 snapshot.

### 22. `frames/HUNT-war-tick-is-24-hours` — **HELD** (overturn upheld; build caveat stands)

`["376"]` contains, verbatim, "- Troops will advance on enemy sectors every 24 hours." plus the
capture rule and win condition. `["372"]` carries "mountains have the highest tactical
advantage, followed by forests and fields" and "the clan will pay the player 5 coins per move
made". `["380"]` names Command HQ / Forward base / Barricades / Tunnels / Towns and the 500-coin
contribution. `["378"]` the rank ladder. All exact.
`REBUILD_READINESS.md` world-exploration blocker ③ is quoted correctly.

Caveat I verified rather than assumed: `seg-20` holds only **20** frames and the rules deck
appears only as pages **1/7, 3/7, 6/7**. Page 6/7 (`frame_0013`) renders `["380"]` verbatim in
v0.717 — good parity evidence — but the **24-hour page was never filmed**. The number stands on
the android v0.682 string alone. "Closes outright" is a shade strong; the claim's own build
field says so honestly.

### 23. `frames/v0717-rewords-the-daily-streak-ladder` — **HELD** (overturn upheld)

`Nr4fQstqHDM/seg-00/frames/frame_0001.jpg`, crop (0,380)-(700,576) ×2.14 LANCZOS, reads:
"CLAIM YOUR DAILY PRIZE NOW! / YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE DAYS. /
**AFTER** EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE! / **AFTER** EVERY 30 CONSECUTIVE DAYS: SUPER
BONUS PRIZE!!!"
`strings.json["843"] = 'Every 10 consecutive days: bonus prize!'`,
`["844"] = 'Every 30 consecutive days: super bonus prize!!!'`.
**THE FRAME WINS.** v0.717 prepends "AFTER". Together with the 5/6 → 1/7 page-count shift this
is a second independent rewording class, and the S0-3 parity hedge can only be lifted string by
string, on film.

---

## NEW FINDINGS (nobody has claimed these)

**NEW-1 · A1 · the v0.717 duel nameplate carries NO level.**
`reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png`, crop
(520,580)-(840,650) ×4 LANCZOS: the opponent plate reads **"FUKUSHIMA CHIKO"** in white over a
green health bar — no `(N)`, no parentheses anywhere. Every android v0.682 white-plate call site
formats a level in: `EnemyPlayer.as:776` and `:881`, `EnemyElite.as:114`,
`EnemyKanjiGuardian.as:59`. **THE FRAME WINS.** `REBUILD_READINESS.md:219` "nameplate (N)=level"
is right for overworld aggro plates (BANDIT (4)) and wrong for web duel plates.

**NEW-2 · A3 · 21 of the 27 web v0.717 bindata blobs are byte-identical to android v0.682 blobs.**
md5 over `reference/extracted/bindata/*.bin` vs `reference/extracted/android/*.bin`: 21 exact
matches, including the **entire animation layer** — Human (`108`≡`99`), Human2 (`103`≡`94`,
md5 `6852a591…`), Undead, Bear, Wolf, Goblin, Boar, Deer, Horse, and the Light/Balanced/Heavy/
Reversed/Dual stance sets — plus all five NameGenerator tables and the trap-room data. The S0-3
parity hedge can be **lifted outright for those 21 blobs**: they are the same bytes in both
builds. It says nothing about UI copy (NEW-1 and claim #23 show copy does drift).

**NEW-3 · A2 · the flinch clip is nested inside the i-frame window, not appended to it.**
`EnemyShield.as:39` calls `mcs.updateAnimation()` and `:123-125` decrements `gotHitCounter` in
the same per-NPC tick; `MCSCharacter.updateAnimation()` (`:1309-1329`) advances exactly one pose
per call. `EnemyZombie.gotHit()` sets the counter at `:522` and enters `FLINCH_STATE` at `:544`
in one call. So on a hit: ticks 0–7 flinch, ticks 0–11 invulnerable. Any port that plays the
flinch after a hold is wrong.

**NEW-4 · A1 · combat does not suppress the player's nameplate.**
`reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg` ×2: green health bars over five
enemies, zero enemy plates, and the player's gold **GUEST** plate still rendered mid-fight,
above "AUTO SLASH OFF" / 16 20 HP / 15 15 CHI / "CANNOT CHANGE STANCE".

**NEW-5 · A1 · only 3 of the 7 War-Room rules pages were ever filmed.**
`Nr4fQstqHDM/seg-20/frames/` holds 20 frames; the deck appears as 1/7, 3/7 and 6/7 only. Page
6/7 renders `strings.json["380"]` word for word in v0.717. The 24-hour tick page is not among
them — so that number is android-sourced only, and the copy-parity evidence for the deck is
three pages wide.

---

## Scoreboard

| verdict | ids |
|---|---|
| **REFUTED (3)** | `hit-lockout-decomposes-exactly`, `nameplate-colour-table`, `nameplate-is-per-entity-with-exact-hues` |
| **fact holds, overturn fails (4)** | `gothitcounter-is-iframes`, `weapon-part-hit-deals-zero`, `HUNT-combat-corpus-never-opened`, `HUNT-player-screen-stat-contract` |
| **HELD, overturn upheld (17)** | the rest |

Judged 24 / 24. Skipped 0.
