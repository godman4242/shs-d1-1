# L0 SOURCE SURVEY — unit: **actionscript**

Surveyor: orthogonal (by-source) sweep. Target document: `docs/research/REBUILD_READINESS.md`
(2026-07-20, avg ~42). Date of sweep: 2026-08-15.

Index consulted first: `docs/gauntlet/L0/index/actionscript.json` — 2,768 classes / 8 bundles.
**The index's per-bundle class counts are correct but structurally misleading**; see S-AS-01.
Everything below was then read first-hand in the `.as` files and is quoted verbatim with real
line numbers.

---

## THE HEADLINE OF THIS LANE

Two separate ActionScript bodies are on disk and **they are not the same game build**:

| | `reference/decompiled/shs3_payload/` | `reference/decompiled/shs3_android/` |
|---|---|---|
| build | web **v0.717** (the 1:1 target) | Android **v0.682** |
| identifiers | **obfuscated** (`§1t99s0§`, `§1t4475s0§`) | **plain** (`MCSPlayer`, `getDamage`) |
| numeric constants | intact | intact |

The Android export is the *readable* copy, and every by-system agent will reach for it. **Its
combat tuning is a different retune from v0.717's.** Six load-bearing constants differ. Porting
the readable build's numbers into a v0.717-faithful recreation silently ships the wrong game.
That is claim `as/build-divergence` and it is the most important line in this file.

The correct method, demonstrated below, is: **read the Android build to learn the SHAPE of a
formula, then re-verify the CONSTANTS in the obfuscated web payload before using them.**

---

## CLAIMS

### as/web-payload-obfuscated — HELD (A2)
**Claim.** The web v0.717 payload's game logic survives only as identifier-obfuscated
ActionScript; the index's "385 shs3_payload classes" are almost entirely PlayerIO SDK, Google
Analytics, Flash UI components and asset-symbol stubs, not game code.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255`
**Quote.** `      internal function §1t4475s0§() : int`
Directory evidence: `reference/decompiled/shs3_payload/scripts/` holds 645 top-level `.as`
files of which the overwhelming majority are named `§1t<N>s0§.as`, plus an obfuscated package
`scripts/§1t51s0§/§1t51s1§/`. `reference/decompiled/shs3_android/scripts/` holds the same code
with real names (`MCSPlayer.as`, `StatsManager.as`, `NPCManager.as`, …).

**Consequence.** The 970-file Android tree is the readable index into the 1,079-file web tree.
Every web finding in this file was located by first finding the Android shape and then
grepping the web tree for the surviving numeric literal.

**Lane impact.** all 12 — it is the method note for the whole payload-era corpus.

---

### as/xp-curve-l11-80 — HELD (A2) — **OVERTURNS §6 AND §0**
**Claim.** The complete XP threshold table for **levels 1 through 98** is a literal array in
the source. It is not extrapolated, not partial, and it is **byte-identical in the web v0.717
payload and the Android v0.682 build**.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
**Quote (head and tail of the literal).**
`      public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550, … ,22095800,25395800,29395800];`
99 entries. `expArray[1..10]` = 550…31,400 — exactly the L1–L10 caps the ledger already
carries, which proves the indexing. `expArray[11] = 37400`, `expArray[80] = 4285800`.
Semantics fixed by `StatsManager.as:1586` `getLevel()`: `if(expArray[q] > currentXP) return q;`
Level cap fixed by `StatsManager.as:76` `public static var levelCap:int = 80;`

**Web-build parity, verified.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
`      public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350, … ,29395800];`
Programmatic compare of the two arrays: `entries 99 / android entries 99 / IDENTICAL: True`.

**Ledger text overturned.** §6: *"**L11–80 XP curve** — no table published; a solo build likely
can't reach L11+; keep the extrapolation labeled INFERRED."* Also §0: *"Some things are
structurally unrecoverable … the L11–80 XP curve."* Also §4 progression blocker ②:
*"**L11–80 XP curve — likely unrecoverable**."*
All three are **FALSE**. The table is on disk, in both builds, and agrees with itself.

**Lane impact.** L-progression: blocker ② deleted; the system's score floor rises materially.

---

### as/save-schema — HELD (A2) — **OVERTURNS §6**
**Claim.** The complete client-side save schema exists: 20 data slots plus 4 timer slots, each
with a named serializer, a pipe-delimited string format and a checksum — **and the client ships
its own offline persistence path** (`SharedObject` cookie), so a single-player save model does
not have to be invented from scratch.

**Cites.**
`reference/decompiled/shs3_android/scripts/QueryManagerBase.as:15`
`      internal static var DATASLOTS:int = 20;`
`reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187` — the slot map, verbatim:
```
1047:  saveUpdate(0,  StatsManager.getPlayerLevelString());
1056:  saveUpdate(1,  StatsManager.getPlayerStatsString());
1057:  saveUpdate(103,StatsManager.getBattleStatsString());
1066:  saveUpdate(2,  StatsManager.getEquipmentString());
1075:  saveUpdate(3,  StatsManager.getSkillStatsString());
1084:  saveUpdate(4,  StatsManager.getInventoryString());
1089:  saveUpdate(5,  StatsManager.getQuestItemsString());
1094:  saveUpdate(6,  StatsManager.getIntStatsString());
1099:  saveUpdate(7,  StatsManager.getBooleanStatsString());
1104:  saveUpdate(8,  StatsManager.getActiveQuestString());
1109:  saveUpdate(9,  StatsManager.getCompletedQuestString());
1114:  saveUpdate(10, StatsManager.getLocationString());
1123:  saveUpdate(11, StatsManager.getTaunt());
1132:  saveUpdate(12, StatsManager.getFriendListString());
1137:  saveUpdate(14, StatsManager.getSkillSlotsString());
1142:  saveUpdate(15, StatsManager.getSide().toString());
1151:  saveUpdate(16, StatsManager.getPlayerDanString());
1160:  saveUpdate(17, StatsManager.getStashString());
1165:  saveUpdate(18, StatsManager.getOptionsString());
1170:  saveUpdate(19, StatsManager.getAchievementStatsString());
1175:  saveUpdate(100,StatsManager.nextAPUpdate.toString());
1181:  saveUpdate(101,StatsManager.nextDTUpdate.toString());
1187:  saveUpdate(102,StatsManager.nextWarTurn.toString());
```
Wire format, verbatim (`StatsManager.as:4362-4381`): values joined by `"|"`, trailing checksum
`checksum %= 54321;` → `return str + "|" + checksum.toString();`
Offline path, verbatim (`QueryManagerPIO.as:1024-1029`): `saveCharCookieData();` then
`if(offlineMode) { trace("offline save user data complete."); resetDataModified(); }`, mirrored
by `loadCharCookieData()` at `QueryManagerPIO.as:1218`. The cookie is a real `SharedObject`
(`QueryManagerBase.as:97` `SharedObject.getLocal(StatsManager.cookieName)`).

**Ledger text overturned.** §6: *"**Server-sim topology & save format** — nothing to copy;
design a single-player persistence schema from the observed field set."* There **is** something
to copy: the exact field set, the slot numbering, the delimiter, the checksum, and a working
offline serializer. Also §1 unknown-unknowns: *"**Save/serialization schema** for every system
(the original was server-side, so there's nothing to copy — must be designed)"* — false.

**Lane impact.** L-meta-social (blocker ①/② partially), L-progression, L-world-exploration —
and it removes an entire unknown-unknown.

---

### as/build-divergence — HELD (A2) — **REFINES STAGE-0 FINDING S0-3'S CAVEAT FROM "NOT ESTABLISHED" TO "DISPROVEN"**
**Claim.** Android v0.682 and web v0.717 do **not** share combat tuning. Six constants differ.
S0-3 warned "combat tuning parity is NOT established"; it is now positively **disproven**, and
the direction matters — **v0.717 is the build that matches the wiki numbers**, so the readable
Android build is the *wrong* one to copy from.

| quantity | web **v0.717** | Android **v0.682** |
|---|---|---|
| crit multiplier | `× 1.3` uniform | `× 1.2` (`× 1.5` in Light) |
| Heavy/Dual/Reversed damage | `× 1.4` | `× 1.5` |
| Light damage curve | `0.5 + 0.4·m·0.1` (m = 0–10) | `0.5 + 0.5·m·0.01` |
| Balanced damage curve | `1 + 0.2·m·0.1` | `1 + 0.5·m·0.01` |
| Light reach multiplier | `× 1.4` | `× 1.5` |
| Focus ("reload") bar max | `8 * 24` = 192 | `5 * 24` = 120 |
| stance-change Focus cost | flat `-48` | `maxreload/6` or reset to `maxreload/3` |

**Cites.** web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277` and `:3083-3150`
and `:249`; android `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`,
`:3019-3084`, `:239`.
**Quote (web crit).** `§1t99s0§.as:3272-3274`
```
         if(this.§1t4414s0§ == this.§1t4415s0§)
         {
            return _loc2_ * 1.3 + this.§1t1243s0§;
```
**Quote (android crit).** `MCSPlayer.as:3215-3221`
```
         if(this.reload == this.maxreload)
         {
            if(this.stance != LIGHT_STANCE)
            {
               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
            }
            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
```

**Counter-evidence that the split is not universal.** Non-combat data is shared verbatim:
`expArray` is identical (above), and `Item.getSellAmt()` is identical
(`shs3_android/scripts/Item.as:1582-1593` vs `shs3_payload/scripts/§1t17s0§.as:1977-1988`).
So the correct rule is **per-value**, not per-file: XP/economy/serialization port cleanly;
**combat tuning does not**.

**Lane impact.** all 12 — this is a governing rule for every payload-derived number.

---

### as/crit-is-focus-gated-deterministic — HELD (A2) — **CLOSES combat-core ⑤ AND skills-meters ⑤**
**Claim.** Critical hits in v0.717 are **not probabilistic**. A slash crits **iff the Focus
("reload") bar is exactly full**, the multiplier is a flat `× 1.3`, the item/gear
`STAT_CRITICALDMG` is added as a **flat addend after** the multiply, and landing the crit
**zeroes the bar**.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277` (crit read) and
`:3293-3316` (consumption).
**Quote (consumption).**
```
3295:         if(this.§1t4414s0§ == this.§1t4415s0§)
3296:         {
3297:            this.§1t4414s0§ = 0;
3298:         }
```

**Ledger text corrected.** §4 skills-meters blocker ⑤: *"crit **proc** rule (chance vs
deterministic) — entirely absent."* Answered: deterministic, Focus-gated.
§4 combat-core blocker ⑤: *"Focus/crit gating rule — watch the Focus bar fill/consume."*
Answered without needing a build.
§3 item 2 (*"Keep `CRIT_MULT=1.3`"*) is **CONFIRMED for v0.717** — and the mechanism explains
the "3×" folklore honestly: `1.3 × 1.4 (Heavy) = 1.82`, then `+ STAT_CRITICALDMG` flat from
gear, which on a geared character reads as a far larger jump than 1.3.

**Lane impact.** L-combat-core (blocker ② and ⑤ closed), L-skills-meters (blocker ⑤ closed).

---

### as/focus-meter-numerics — HELD (A2) — **CLOSES skills-meters ③**
**Claim.** The Focus meter's full numeric model for v0.717: **max 192** (`8 * 24` = 8 s at
24 fps), **+1 per game frame**, **+6 when a slash lands on ≥1 enemy**, **−`slashUsage`** per
slash (halved in Light, ×1.5 in Heavy/Dual), **−48 flat** for an in-battle stance change, and
**zeroed** by spending a crit. `slashUsage` comes from the equipped weapon with a floor of 48.

**Cites.**
`§1t99s0§.as:249` — `         this.§1t4415s0§ = 8 * 24;`
`§1t99s0§.as:1203-1205` — `if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§;`
`§1t99s0§.as:3318-3320` — `public function §1t4479s0§() : * { this.§1t4414s0§ += 6;`
  …called from `§1t1543s0§.as:2047-2050` guarded by `if(_loc4_ > 0)` where `_loc4_` is the
  count of enemies the slash hit.
`§1t99s0§.as:3300-3311` — `-= slashUsage / 2` (Light) · `-= slashUsage` (Balanced/Reversed)
  · `-= slashUsage * 1.5` (Heavy/Dual)
`§1t99s0§.as:3162` — `            this.§1t4414s0§ -= 48;`
Weapon floor: `shs3_android/scripts/StatsManager.as:1921-1927`
`if(itemdata == null || itemdata.slashusage < 48) { … return 48; }`
UI mapping (android, same shape): `MCSPlayer.as:1163-1168` — the displayed bar is
`(reload - 24) / (maxreload - 24)`, i.e. the first 24 units are a hidden dead zone.

**Ledger text corrected.** §4 skills-meters blocker ③: *"Focus numerics (max/fill/switch-cost)."*
All three are now measured. Also §2 art/ui *"dynamic HUD feel (bar tween vs snap)"* — the bar
is driven by a per-frame integer, so it is a **snap-per-frame**, not a tween.

**Lane impact.** L-skills-meters (blocker ③ closed), L-combat-core, L-ui-hud.

---

### as/stance-damage-is-mastery-10 — HELD (A2) — **CORRECTS §3 item 3**
**Claim.** The ledger's stance damage triple **0.9 / 1.2 / 1.4 is exactly right, and it is a
mastery-10 ceiling, not mastery-9.** Stance mastery is skill 1000/1001/1002 and each has **10
levels**, so the ceiling is m = 10.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271`
**Quote.**
```
3261:            case §1t12220s0§:              // LIGHT
3262:               _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3264:            case §1t12221s0§:              // BALANCED
3265:               _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3267:            case §1t12222s0§:              // HEAVY
3268:            case §1t12223s0§:              // DUAL
3269:            case §1t12224s0§:              // REVERSED
3270:               _loc2_ = _loc1_ * 1.4;
```
m = 10 ⇒ Light `0.5 + 0.4 = 0.9`; Balanced `1 + 0.2 = 1.2`; Heavy fixed `1.4`. Exact.
Mastery cap corroborated in the payload data: `reference/extracted/skilldata.xml` skills
1000/1001/1002 each carry 10 `<level><value>` rows (values 1…10) — counted programmatically:
`skill 1000 levels 10 max 10 · skill 1001 levels 10 max 10 · skill 1002 levels 10 max 10`.
Stance-id mapping proved by the Heavy defense penalty landing on `§1t12222s0§`
(`§1t99s0§.as:3284-3288` `if(this.stance == §1t12222s0§) { return defense * 0.8;`), which also
matches the string table: `strings.json` id 6005 = *"Slow but powerful stance… **Defense -20%**"*.

**Ledger text corrected.** §3 item 3: *"The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100)
are **MASTERY-9 CEILING** values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0
/ Heavy ×1.4 (Heavy is fixed)."* — the base row and "Heavy is fixed ×1.4" are **CONFIRMED
exactly**; the ceiling is **mastery-10**, and the steps are linear (+0.04/level Light,
+0.02/level Balanced). The decide-and-flag in §3 ("model the mastery curve or target
mastery-9") can now be resolved properly: the curve is trivially cheap to model.

**Lane impact.** L-combat-core, L-skills-meters, L-progression.

---

### as/reach-formula — HELD (A2) — **CLOSES combat-core blocker ①, "the one value the whole model needs"**
**Claim.** The blade-path reach cap is fully specified in code, in **stage pixels**, as a
function of the SPEED stat and Dan rank, with per-stance multipliers and a hard 100 px floor;
and the drawn line is hard-capped to it at input time.

**Cite (base length).** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919`
**Quote.**
```
      internal static function getBaseSlashLengthVal(speed:int) : int
      {
         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
      }
```
Same literal present in the web payload — `§1t1523s0§.as:2347`
`         return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`
SPEED buff: `StatsManager.as:1908-1911` `if(hasBuff(BUFF_SPEED)) { speed *= 1.5; }`.
Injured debuff halves it: `MCSPlayer.as:222` `this.baseSlashLength *= 0.5;`.

**Cite (per-stance multiplier, v0.717).** `shs3_payload/scripts/§1t99s0§.as:3083-3150`
```
3094  LIGHT     §1t4417s0§ = §1t4420s0§ * 1.4
3105  BALANCED  §1t4417s0§ = §1t4420s0§ * (1 + 0.2 * balancedMastery * 0.1)
3116  HEAVY     §1t4417s0§ = §1t4420s0§ * (0.5 + 0.4 * heavyMastery * 0.1) ; 3119 if < 100 → 100
3131  REVERSED  §1t4417s0§ = §1t4420s0§ * 1.4
3142  DUAL      §1t4417s0§ = §1t4420s0§                                    ; 3145 if < 100 → 100
```
**Cite (the cap is enforced on the drawn line).** `§1t99s0§.as:3158`
`            §1t1541s0§.§1t10094s0§(this.§1t4417s0§);` — the InputManager
`setMaxDistance()` call; android plain-text equivalent `MCSPlayer.as:3094`
`InputManager.setMaxDistance(this.slashLength);` and `InputManager.as:106-109`
`public static function setMaxDistance(num:int) : * { maxDistance = num; }`.

**Numbers a builder can use immediately (v0.717, Dan 0):** SPEED 0 → base **120 px** ⇒ Light
168 / Balanced 120 / Heavy 100(floor). SPEED 100 → base 195 ⇒ Light 273 / Balanced 195–234 /
Heavy 97→168 (floor 100). Asymptote SPEED→∞ → base 210 ⇒ Light **294 px** maximum.

**Ledger text closed.** §4 combat-core blocker ①: *"reach cap in **stage px** per stance (the
one value the whole model needs; wiki gives 'units' of unknown scale) — measure blade-FX
tip-to-body span … or slash a dummy in a preserved build."* No measurement pass needed; no
build needed. The unit **is** stage px, and stage px are unambiguous because
`StatsManager.as:80-82` fixes `stageWidth = 800 / stageHeight = 480`.

**Lane impact.** L-combat-core — the highest-weight blocker in the system, closed.

---

### as/reach-300-200-100-refuted — HELD (A2) — **OVERTURNS the reach half of §3 item 3 and §1's `STANCE_TABLE` note**
**Claim.** The reach triple **300 / 200 / 100 cannot be produced by v0.717 at any mastery**,
so it is not a "mastery-9 ceiling". In v0.717 Light reach is a **fixed** `× 1.4` of base while
Balanced is `≥ 1.0 ×` base, so the Light : Balanced ratio can never exceed **1.4** — but
300 : 200 = **1.5**. The one part of the triple the code does confirm literally is Heavy's
**100**, which is a hard floor.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094` and `:3105` and `:3115-3119`
**Quote.**
```
3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;              // LIGHT, no mastery term
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3115:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117:               if(this.§1t4417s0§ < 100)
3119:                  this.§1t4417s0§ = 100;
```
Note the 1.5 ratio **is** reachable in the *Android* v0.682 formula (`MCSPlayer.as:3030`
`this.slashLength = this.baseSlashLength * 1.5;`) at mastery 0 with base 200 — which would give
exactly 300 / 200 / 100. That is a plausible provenance for the wiki row, and it is more
evidence for `as/build-divergence`: the wiki triple, if it is real, describes the **mobile**
tuning, not v0.717.

**Ledger text overturned.** §1 unknown-knowns: *"`STANCE_TABLE` already carries reach
300/200/120 … mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and
Heavy should be 100, not 120)."* The "Heavy should be 100" half is **CONFIRMED** (it is a
literal floor in both builds). The "mastery-9 values" half is **REFUTED** for v0.717.

**Lane impact.** L-combat-core — retires a planned code change (`fix Heavy reach 120→100,
relabel mastery-9`) into "fix the 120→100, do NOT relabel as mastery-9; replace the whole table
with the formula".

---

### as/in-combat-stance-not-hard-locked — HELD (A2) — **OVERTURNS §3 item 4**
**Claim.** v0.717 does **not** hard-lock stance in combat. The in-combat switch is alive and is
**gated on Focus ≥ 48 and costs a flat 48 Focus**. "CANNOT CHANGE STANCE" is the *insufficient
Focus / wrong action-state* message, not a version removal.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3050` (the gate),
`:3058-3062` (the early-out), `:3160-3167` (the in-battle cost).
**Quote.**
```
3048:      public function §1t4470s0§() : Boolean
3049:      {
3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
…
3058:      public function §1t4472s0§() : *
3059:      {
3060:         if(this.§1t4414s0§ < 48)
3061:         {
3062:            return;
…
3160:         if(§1t1525s0§.§1t9948s0§())        // if StageManager.isBattle()
3161:         {
3162:            this.§1t4414s0§ -= 48;
```
`§1t4469s0§` (line 3043) is the pure action-state predicate — identical in shape to the
plain-named `MCSPlayer.canChangeStance()` at `shs3_android/scripts/MCSPlayer.as:2965`, which
lists IDLE / POSE / RUN / WALK / CHICHARGE / FLINCH-from-those.

**Ledger text overturned.** §3 item 4: *"**In-combat stance is HARD-LOCKED in v0.717**
('CANNOT CHANGE STANCE'). The recreation's Focus-gated in-combat switch models **removed 2014
behavior**. … the *in-combat* switch is a recreation divergence — label it, don't present it as
original."* This is **backwards**. The recreation's Focus-gated in-combat switch is *original
v0.717 behaviour*, down to the mechanism; the only thing to fix is the price (a flat 48 of a
192-unit bar) and the eligible action-states.

**Frame-vs-doc note.** A frame in `reference/frames/duel_dense/` shows "CANNOT CHANGE STANCE"
during combat and §3 read that as a hard lock. **THE FRAME STILL WINS on what was on screen** —
the message was genuinely displayed. What the code overturns is the *inference* drawn from it:
the message is a per-moment gate, not a permanent lock. Any lane wanting certainty should
re-crop that frame and check the Focus bar level at that instant; the prediction is that it
reads below 48/192 (i.e. under 25%).

**Lane impact.** L-combat-core, L-skills-meters, L-ui-hud.

---

### as/multi-target-full-damage — HELD (A2) — **CLOSES an §1 UNKNOWN-UNKNOWN**
**Claim.** One arc hitting N enemies deals the **same full `Damage` object to every one of
them** — no falloff toward the tip, no split. Each enemy can be hit **at most once per slash**
(`gotHitFlag`). Broad phase is a ±200 px horizontal window. The **combo counter increments by
the number of distinct enemies hit**, not by hits.

**Cite.** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295`
**Quote.**
```
1220:               j = 0;
1221:               while(j < slashMax && !enemy.gotHitFlag)
1222:               {
1223:                  dist = enemy.mcs.x - slashArray[j].x + offset;
…
1230:                  if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false))
1231:                  {
1232:                     if(enemy.checkHit(scaledX,scaledY,damage))
…
1251:               if(enemy.gotHitFlag)
1252:               {
1253:                  comboCount++;
…
1283:         if(comboCount > 0)
1284:         {
1285:            StatsManager.addCombo(comboCount);
```
`dist * dist < 40000` ⇒ |Δx| < 200 px. Neutrals (`neutralList`) are swept by the same loop, so
civilians/animals are cuttable by a stray arc.

**Ledger text closed.** §1 unknown-unknowns: *"**Multi-target damage rule** (one arc hits N
enemies — full damage each? falloff toward the tip?)"* → full damage each, no falloff.
§4 combat-core blocker ④: *"multi-target per-hit rule (full vs falloff)"* → closed.

**Lane impact.** L-combat-core (blocker ④ closed), L-ui-hud (combo semantics).

---

### as/hit-registration-window — HELD (A2) — **CLOSES an §1 UNKNOWN-UNKNOWN**
**Claim.** Hit registration is **instantaneous at slash resolution**, evaluated by walking the
released polyline point-by-point — there is **no swept active window** an enemy can dodge into
or out of. Resolution is two-stage: a container `hitTestPoint` bounding-box test, then a
**front-to-back walk of the paperdoll part list**, and the **first (topmost in z-order) part
struck decides the hit**.

**Cite.** `reference/decompiled/shs3_android/scripts/NPC.as:301-321`
**Quote.**
```
301:      public function checkHit(hitX:int, hitY:int, damage:Damage) : Boolean
302:      {
304:         var max:int = mcs.getPartListLength();
305:         var partList:Vector.<MovieClip> = mcs.partList;
306:         var i:* = int(max - 1);
307:         while(i >= 0 && !gotHitFlag)
308:         {
309:            mc = partList[i];
310:            if(mc.hitTestPoint(hitX,hitY))
311:            {
312:               if(this.gotHit(mc,damage))
```
The loop runs `max-1 → 0`, i.e. **descending z-index**, which is why "shielder legs / undead
heads" weak points work: the part that is visually in front is the part that takes the hit.

**Ledger text closed.** §1 unknown-unknowns: *"**Hit-registration window** (instant at release
vs an active sweep an enemy can dodge into/out of)."* → instant at release.

**Lane impact.** L-combat-core, L-enemies-ai, L-items-equipment (weak points are literally
paperdoll slots).

---

### as/sell-price-formula — HELD (A2) — **OVERTURNS §3 item 9; CLOSES economy ② and items ③**
**Claim.** Sell price is **`(1 + affixModifierCount) × 10`** for items of weight ≥ 10 and
**`× 5`** below that; anything with `itemID < 3000` sells for a flat **1**. It does **not**
scale with rarity or level. This is **identical in both builds**.

**Cite (Android, readable).** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593`
**Quote.**
```
1582:      public function getSellAmt() : int
1583:      {
1584:         if(this.itemID < 3000)
1585:         {
1586:            return 1;
1587:         }
1588:         if(this.getWeight() >= 10)
1589:         {
1590:            return (1 + this.getModifierCount()) * 10;
1591:         }
1592:         return (1 + this.getModifierCount()) * 5;
1593:      }
```
**Cite (web v0.717, parity).** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
— same three branches, same `3000`, same `10`, same `* 10` / `* 5`.
`getModifierCount()` is literally the affix count on the item instance — `Item.as:307-310`
`public function getModifierCount() : int { return this.modifiers.length; }`
Shop side: `ShopUI.as:58` `internal var sellPercentage:Number = 0.5;`

**Ledger text overturned.** §3 item 9: *"**Sell price is NOT flat per item** — it scales with
**rarity/level** (same sword 5c and 25c). Don't encode flat-per-type."* The observation is
right; the *explanation* is wrong. `5c` = a light item with **0** modifiers `(1+0)×5`; `25c` =
the same light item with **4** modifiers `(1+4)×5`. It scales with **affix count and weight
class**, and it is exactly flat-per-(affixcount, weightclass).
Also closes §4 economy blocker ② *"sell-price … formulas"* and items blocker ③
*"sell-price formula."*

**Lane impact.** L-economy (blocker ② half-closed), L-items-equipment (blocker ③ closed).

---

### as/spd-to-cooldown — HELD (A2) — **CLOSES skills-meters ④**
**Claim.** The SPEED→cooldown transfer function is linear and hard-capped: cooldowns are
multiplied by `1 − min(SPD,300)/300 × 0.5`, i.e. **SPEED 300 is the cap and buys exactly a 50 %
cooldown reduction**; the SPEED buff multiplies SPD by 1.5 before the clamp.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
**Quote.**
```
1854:      internal static function getSkillCooldownModifierVal(speed:int) : Number
1855:      {
1856:         if(speed > 300)
1857:         {
1858:            speed = 300;
1859:         }
1860:         return 1 - speed / 300 * 0.5;
1861:      }
```
Related, same file `:1839-1842`: `getBaseReload() { return 48 + (STAT_SPEED + bonus) * 6; }`
— SPEED also feeds the Focus/reload economy for NPC-instantiated fighters.

**Ledger text closed.** §4 skills-meters blocker ④: *"SPD→cooldown formula."*
Also part of §4 progression blocker ①: *"SPD range/cooldown scaling (wiki gives only
direction)"* — direction and magnitude now both held.

**⚠ Not yet parity-checked in the web payload** — I could not locate the obfuscated twin by
literal search (`300 * 0.5` returns nothing in `shs3_payload/`). Treat the **shape** as solid
and the **constants** as Android-sourced pending a web confirm. Flagged honestly per
`as/build-divergence`.

**Lane impact.** L-skills-meters (blocker ④), L-progression (blocker ① half).

---

### as/paperdoll-compositing-contract — HELD (A2) — **CLOSES items-equipment blocker ⑤**
**Claim.** The sprite-compositing contract is fully specified: **27 named body slots in an
explicit back-to-front z-order**, and the art class for any slot is resolved by **string
concatenation of the part name and the item's `art` id**, with a `<partType>0` fallback. This
is why the payload's asset classes are named `head8000`, `torso4000`, `weapon13000`, `item0`.

**Cite (z-order).** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:9-62`
**Quote (verbatim order, index 0 = backmost).**
```
PART_l_hand 0 · PART_l_uparm 1 · PART_l_lowarm 2 · PART_weapon 3 · PART_prop 4 ·
PART_l_foot 5 · PART_l_thigh 6 · PART_l_calf 7 · PART_crotch 8 · PART_r_foot 9 ·
PART_r_thigh 10 · PART_r_calf 11 · PART_neck 12 · PART_stomach 13 · PART_pelvic 14 ·
PART_torso 15 · PART_head 16 · PART_hat 17 · PART_r_hand 18 · PART_r_uparm 19 ·
PART_r_lowarm 20 · PART_prop2 21 · PART_prop3 22 · PART_l_shoulder 23 ·
PART_r_shoulder 24 · PART_l_knee 25 · PART_r_knee 26
```
**Cite (class resolution).** `MCSCharacter.as:581-612`
**Quote.**
```
         var xmlItem:XMLItem = QuestEngine.getItemData(id);
…
            art = xmlItem.art;
…
            if(getDefinitionByName(partType + art.toString()))
            {
               ClassDefinition = Class(getDefinitionByName(partType + art.toString()));
            }
            else
            {
               ClassDefinition = Class(getDefinitionByName(partType + "0"));
            }
```
Head sub-stack — z-order **inside** the head slot is set explicitly, not by insertion order,
back (0) to front (3): `head.setChildIndex(componentObject,0)` base head (`:683`),
`head.setChildIndex(this.headMask,1)` (`:755`), `head.setChildIndex(this.hatHair,2)` (`:706`),
`head.setChildIndex(this.hair,3)` (`:724`). So the **mask renders behind the hat-hair and the
hair**, which is a non-obvious ordering a from-scratch renderer would get wrong.
Corroborating asset classes really on disk: `reference/decompiled/shs3_payload/scripts/head8000.as`,
`torso4000.as`, `weapon13000.as`, `item0.as`, `mask9000.as`, `hair6000.as`, `foottop12000.as`.

**Ledger text closed.** §4 items-equipment blocker ⑤: *"**sprite-compositing contract** (layer
order, per-slot body render — a from-scratch-art blocker)."* Not a blocker any more — the layer
order is a 27-entry literal and the naming rule is deterministic.

**Lane impact.** L-items-equipment (blocker ⑤ closed), L-art-anim-audio-feel, L-enemies-ai.

---

### as/anim-format — HELD (A2)
**Claim.** The animation system is a **keyframe transform-matrix format**, not sprite sheets:
each `<anim>` has a duration `d` and loop flag `l`; each `<f>` frame holds per-part nodes with
either a rotation `r` **or** a full 2×2 matrix `a b c d`, plus `x y`, keyed to the part index
`i`. Slash **pose** anims get a hard-coded **+10 frame** hold appended at parse time.

**Cite.** `reference/decompiled/shs3_android/scripts/FrameNodeData.as:11-43` and
`AnimData.as:12-42`
**Quote (AnimData).**
```
13:         this.duration = xml.@d;
14:         this.looping = xml.@l == 1;
…
24:         switch(xml.@i.toString())
25:         {
26:            case "light_afterslashpose":
27:               this.duration += 10;
…
30:            case MCSActor.LIGHTSLASH_POSE:
…                (all 13 stance slash POSE anims)
41:               this.duration += 10;
```
**Quote (FrameNodeData).**
```
30:         this.x = xml.@x;
31:         this.y = xml.@y;
32:         if(xml.@r.toString() == "")
33:         {
34:            this.matA = xml.@a;  …  this.matD = xml.@d;
38:         else
40:            this.rotation = xml.@r;
43:         this.id = xml.@i;
```

**Consequence.** The 19 `<animdata>` bindata blobs identified in Stage-0 finding S0-1 and the
~450 animations counted in S0-4 are **directly consumable** — this file is their schema. The
"+10 frame pose hold" is the code-side origin of the observed pose latch.

**Lane impact.** L-art-anim-audio-feel — converts a pile of unlabelled bindata into a parseable
animation library.

---

### as/screenshake-and-killbeat — HELD (A2) — **CLOSES art-anim blocker ④**
**Claim.** Screen-shake exists, is parameterised, and **decays**; the "kill beat" is a distinct
global **redFreeze** state with an explicit frame budget.

**Cite (shake).** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1228`
**Quote.**
```
1200:      public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *
…
1225:            shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
1226:            gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
1227:            gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
```
Default amplitude **30 px**, uniform-random offset in ±amp/2 on **both axes**, amplitude
tapering as `min(amt, remaining frames)` so the last 30 frames self-decay to zero.
**Call sites and durations (frames @ 24 fps):** `MCSPlayer.as:4180` **12** (heavy landed hit),
`MCSPlayer.as:911` **12** (cleave release), `MCSPlayer.as:946` **24** (earthquake skill),
`Trap_CrusherBlockAuto.as:88` / `Trap_CrusherColumnAuto.as:90` **6**,
`HeavenlySwordProjectile.as:76` **12**, `Marker_RumbleTrigger.as:44` designer-authored.

**Cite (kill beat).** `StageManager.as:1075-1106`
**Quote.** `1101:            redFreezeCounter = 24 * 6;` (144 frames = **6 s**), with the
skip path `1096: redFreezeCounter = 24 * 3 + 6;` and stepped release points at
`24 * 5`, `24 * 3` and `24` (`:903`, `:916`, `:926`). The freeze fans out to
`gameStage`, `NPCManager`, `ProjectileManager`, `ParticleSystemManager` and the player.

**Ledger text closed.** §4 art-anim blocker ④: *"**screen-shake** + **hitstop-on-landed-hit**
(never catalogued)."* Screen-shake is now fully catalogued. **Hitstop is a separate honest
answer: there is no per-hit hitstop** — the only global time-stop is the kill-beat redFreeze.

**Lane impact.** L-art-anim-audio-feel (blocker ④), L-combat-core (feel).

---

### as/ap-and-war-clocks — HELD (A2) — **CLOSES world-exploration ③/④ and confirms meta-social's "per hour"**
**Claim.** All the real-time clocks are explicit, and **server time is counted in whole
seconds**. AP regenerates **1 per 60 s** (doubled by the AP buff), the second timed resource
("DT") **1 per 120 s**, and a war move accrues **1 per 3600 s**.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:158-162`
**Quote.**
```
158:      internal static var APINTERVAL:int = 60;
160:      internal static var DTINTERVAL:int = 2 * 60;
162:      internal static var WARMOVEINTERVAL:int = 60 * 60;
```
Units proved by `QueryManagerBase.as:39` `internal var serverTimer:Timer = new Timer(1000);` +
`:111` `this.serverTime += 1;` + `:105` `new Date(this.serverTime * 1000)` ⇒ **seconds**.
Regen is offline-accruing, not tick-based: `StatsManager.as:1099-1100`
`timeDiff = timeVariable - nextAPUpdate; diff = Math.floor(timeDiff / APINTERVAL) + 1;` and
the buff doubling at `:1101-1104` `if(hasBuff(BUFF_AP)) { diff *= 2; }`. Start AP is 30
(`StatsManager.as:707` `setPlayerStats(STAT_AP,30);`), matching the ledger.

**Ledger text closed.** §4 world-exploration blockers ③ *"real-world **'day' length**"* and ④
*"AP regen rate + cap"* — the AP cap is `STAT_MAXAP + bonus` and the rate is 1/min.
§4 meta-social surface note *"'moves per turn' reconciles as 'per hour'"* is **CONFIRMED
literally** by `WARMOVEINTERVAL = 60 * 60`.

**Lane impact.** L-world-exploration (blockers ③④), L-meta-social, L-economy.

---

### as/war-board-is-a-hex-grid — HELD (A2) — **CLOSES meta-social blocker ②**
**Claim.** The War-Room board is a **hexagonal** grid whose cells carry one of **14 typed
roles**, not an abstract adjacency list and not a square grid.

**Cite.** `reference/decompiled/shs3_android/scripts/WarHex.as:10-40`
**Quote.**
```
      public static var HEX_NOTHING:int = 0;
      public static var HEX_SPAWNPOINT:int = 1;
      public static var HEX_FORWARDBASE:int = 2;
      public static var HEX_CONTROLPOINT:int = 3;
      public static var HEX_TOWN:int = 4;
      public static var HEX_POTENTIALSPAWNPOINT:int = 5;
      public static var HEX_UPCOMINGSPAWNPOINT:int = 6;
      public static var HEX_LADDER:int = 7;
      public static var HEX_DEFENSE:int = 8;
      public static var HEX_VILLAGE:int = 9;
      public static var HEX_CITY:int = 11;
      public static var HEX_CASTLE:int = 12;
      public static var HEX_DISABLEDSPAWNPOINT:int = 13;
      public static var HEX_DEMOLISHEDSPAWNPOINT:int = 15;
```
The class carries six directional arrow children (`narrow`, `sarrow`, `earrow`, `warrow`, …) —
hex adjacency, rendered. Supporting cast on disk: `WarHexUI.as`, `WarHexUIAttackChoice.as`,
`WarHexUIBuildMenu.as`, `WarTerrain.as`, `WarSpawnPoint.as`, `WarTroopsMarker.as`, `WarFlag.as`,
`WarActiveBattle.as`, `WarRules.as` (a **6-page** in-game rules screen: `WarRules.as:23`
`internal var max:int = 6;`).

**Ledger text closed.** §4 meta-social blocker ②: *"War-Room **map topology** (board/adjacency)."*

**Also refines Stage-0 finding S0-1.** S0-1 called bindata 119 `<survivalmodedata>` "an ENTIRE
GAME MODE absent from all 12 ledger systems". The owning class is
`WarHexUI_SurvivalModeData.as` — verbatim
`[Embed(source="/_assets/109_WarHexUI_SurvivalModeData.bin", mimeType="application/octet-stream")]`
— so Survival Mode is **a mode of the War system**, not a standalone mode, and it lands in
**meta-social**, not nowhere. (Blob index differs between builds: 109 on Android, 119 on web.)

**Lane impact.** L-meta-social (blocker ② closed, plus Survival Mode correctly homed).

---

### as/auto-slash-is-the-enemy-ai — HELD (A2) — **CLOSES the §1 "AUTO SLASH cadence" unknown**
**Claim.** AUTO SLASH is not a separate autoswing routine — the toggle simply **routes the
player's own character through the enemy AI function**. Its cadence is therefore the AI tick:
a decision **every 12 frames (0.5 s)** for the player and elites, **every 24 frames (1 s)** for
ordinary NPCs.

**Cite (routing).** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1149`
**Quote.**
```
         if((this.controlledBy == 1 || this.controlledBy == 3 || this.autoSlash) && !dead && checkAITrigger() && !GameEngine.isAdventureMode() && !NetworkManager.instance.playBack)
         {
            this.AI();
         }
```
**Cite (cadence).** `NPC.as:22` `internal var aiCounterMax:int = 24;` overridden to **12** in
`MCSPlayer.as:165`, `EnemyElite.as:18`, `EnemyPlayer.as:52`, `FriendlySpearElite`/`FriendlyElite.as:18`.
**Cite (the decision itself).** `MCSPlayer.as:4426` (`internal function AI() : *`), rolls at
`:4520-4556` — a `Math.random()*4` reposition roll
while the Focus bar is below a randomised `doReload` target
(`this.doReload = 24 + Math.random() * (this.maxreload - 24)`), otherwise a
`Math.random()*3` roll between `launchTarget()` and `slashTarget()` on the nearest enemy.

**Ledger text closed.** §1 known-unknowns: *"AUTO SLASH cadence."* Also explains the observed
"AI backs off to recharge" behaviour: the AI deliberately disengages to refill Focus for a crit.

**Lane impact.** L-combat-core, L-enemies-ai.

---

### as/damage-is-a-random-roll — HELD (A2) — **CORRECTS §0/§1's damage formula**
**Claim.** Physical damage is **not** deterministic. The pre-stance base is a **uniform random
roll between the weapon's `mindamage` and `maxdamage`**, offset by ATK; a **broken** weapon
collapses the roll to `ATK + 1` with **zero** range.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258`
**Quote.** `         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;`
Inputs, plain-named: `shs3_android/scripts/StatsManager.as:1863-1888`
`basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;`
and `:1890-1903` `getDamageRange() { … return itemdata.maxdamage - itemdata.mindamage; }`,
with the broken-weapon branch `:1871-1877`
`if(itemdata == null || equipment[EQ_WEAPON].isBroken()) { … basedamage = ATK + bonus + 1; }`
and `:1892` `if(equipment[EQ_WEAPON].itemID == 0 || equipment[EQ_WEAPON].isBroken()) return 0;`

**Full v0.717 chain, assembled:**
`roll = ATK + bonusATK + weapon.mindamage + rand()·(weapon.maxdamage − weapon.mindamage)`
→ `× stanceMult(stance, mastery)`
→ if Focus full: `× 1.3 + STAT_CRITICALDMG`
→ defender: Heavy stance defends at `defense × 0.8`.

**Ledger text corrected.** §0/§1: *"**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult;
Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical."* The stance multiplier,
the ×0.8 and the 1.3 are all **confirmed**; the missing term is the **random weapon range**,
which is why TTK observations from video never reproduced a clean integer.
Partially addresses items blocker ② *"condition→DMG multiplier"*: the **broken** end of the
condition ladder is not a multiplier at all — it **replaces** the weapon contribution with +1.

**Lane impact.** L-combat-core, L-items-equipment (blocker ② partial).

---

### as/stance-counter-triangle — PARTIAL (A2)
**Claim.** A stance rock-paper-scissors relationship is asserted by the shipped in-game text —
Light beats Heavy, Balanced beats Light, Heavy beats Balanced — and it appears in **no** ledger
system. The **−20 % Heavy defense** half of that text is confirmed in code; **I could not locate
a code path that applies the counter bonus**, so the triangle may be advisory flavour text
rather than a mechanic.

**Cite.** `docs/gauntlet/L0/index/strings.json` ids 6001 / 6003 / 6005 (resolved from
`reference/extracted/android/118_Mobile_Lang_EN.bin` per Stage-0 finding S0-3).
**Quote.**
- 6001 — *"Swift but light stance. Slash range is longer but damage inflicted is lower.\n**Effective against Heavy Stance.**"*
- 6003 — *"Balanced stance.\n**Effective against Light Stance.**"*
- 6005 — *"Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\n**Effective against Balanced Stance.**\n**Defense -20%**"*

Code half confirmed: `shs3_payload/scripts/§1t99s0§.as:3286-3289`
`if(this.stance == §1t12222s0§) { return defense * 0.8; }` — the literal −20 %.
Code half NOT found: `Damage.as` carries an attacker `stance` field
(`shs3_android/scripts/Damage.as:28` `internal var stance:int;`) but the only reader of
`getStance()` in the whole Android tree is `BattleUI.as:368`, a HUD write-back. I did not find a
stance-vs-stance multiplier.

**Verdict.** PARTIAL. The text is an artifact; the mechanic is not yet grounded. Do not encode a
counter bonus. **This is a live lead, not a finding** — the honest next step is to grep the
obfuscated web tree for a read of `Damage.stance`.

**Lane impact.** L-combat-core, L-skills-meters (a whole relationship absent from both ledgers).

---

### as/three-shipped-languages — HELD (A2)
**Claim.** The game shipped **three** localisations — English, Simplified Chinese and Japanese —
each as its own resource file in a fixed 18-file resource manifest.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:62-68`
**Quote.**
```
62:      public static var FILE_LANG_EN:int = 15;
64:      public static var FILE_LANG_ZHCN:int = 16;
66:      public static var FILE_LANG_JA:int = 17;
68:      public static var TOTALFILECOUNT:int = 18;
```
Same file `:32-56` names the other 15 slots (MAPDATA, ACHIEVEMENTDATA, NODEDATA, QUESTDATA,
ITEMDATA, NPCDATA, SKILLDATA, BGDATA, PREMIUMDATA, MAPBITMAPDATA, BGRESOURCE, IMAGERESOURCE,
MUSICRESOURCE, SOUNDRESOURCE).

**Consequence.** Stage-0 finding S0-3 resolved names from `118_Mobile_Lang_EN.bin` alone; two
more complete string tables of the same 2,533 entries exist and can cross-check any ambiguous
English row. Also: `LangManager.as:131/135` sets `textfield.embedFonts = false` on those
paths — a device-font fallback, relevant to the "font" blocker (S0-2 already settled the face
as `Edo SZ`).

**Lane impact.** L-ui-hud, L-quests-story.

---

### as/native-resolution — HELD (A2) — **CONFIRMS §3 item 12 and resolves ui-hud blocker ①'s premise**
**Claim.** Native stage is **800 × 480** and it is a code constant, not an inference — and the
engine carries an explicit letterbox/scale transform (`stageScale`, `stageOffsetX/Y`) that is
applied to **hit-test coordinates**, so any HUD fraction measured off a 1920×1080 capture is
suspect exactly as §3 warned.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:80-98`
**Quote.**
```
80:      public static var stageWidth:int = 800;
82:      public static var stageHeight:int = 480;
86:      public static var stageScale:Number = 1;
88:      public static var stageOffsetX:Number = 0;
90:      public static var stageOffsetY:Number = 0;
96:      public static var stageBaseWidth:int = 800;
98:      public static var stageBaseHeight:int = 480;
```
Applied to hit tests at `NPCManager.as:1226-1227`
`scaledX = (slashArray[j].x - offset) * StatsManager.stageScale + StatsManager.stageOffsetX;`

**Ledger text confirmed.** §3 item 12: *"**Native resolution is 800×480 (5:3)**, not 16:9."*
Now A2-cited rather than inferred. §4 ui-hud blocker ① (*"aspect-ratio truth … read
`stage.stageWidth` in a build"*) no longer needs a build — but note `stageBaseWidth` is the
**base** and `stageScale`/`stageOffset` are runtime-set, so the letterboxing question is a
render-time question and is **not** fully answered by these literals.

**Lane impact.** L-ui-hud (blocker ① premise settled), L-combat-core (px units are stage px).

---

### as/repair-cost — STILL_UNHELD
**Claim attempted.** §4 economy blocker ③: *"Repair-Weapon cost (never captured)."*
I found the condition/broken machinery (`Item.as:714-756` condition tiers at 0 / <25 / <50 /
<75 / else, `Item.as:1467` `isBroken()`) but **did not locate a repair-cost formula** in either
tree within this sweep. Reporting honestly rather than guessing.

**Verdict.** STILL_UNHELD. Next actor should grep `shs3_android/scripts/` for the repair action
icon / `InteractUI` shop branch rather than `StatsManager`.

**Lane impact.** L-economy — blocker ③ stands.

---

## SUMMARY OF LEDGER DAMAGE

**§6 "structurally UNRECOVERABLE" — 2 of its 6 bullets are dead.**
- *L11–80 XP curve* → the full 99-entry table is on disk in **both** builds, identical.
- *Server-sim topology & save format ("nothing to copy")* → 24 named save slots, wire format,
  checksum, and a shipped offline serializer.
(The other four — verbatim dialogue [already killed by the staleness banner], exact SFX/music
synthesis params [S0-5: held-but-encrypted], the live clan-war, the dead IAP economy — are not
touched by this lane.)

**§3 corrections that this lane reverses or repairs.**
- item 3 (stance tables) — damage triple is a **mastery-10** ceiling, exact; the **reach** triple
  is *not* a mastery ceiling and is unreachable in v0.717.
- item 4 (in-combat stance hard-locked) — **backwards**; the Focus-gated switch is original.
- item 9 (sell price scales with rarity/level) — **wrong mechanism**; it is affix count × weight
  class, and that reproduces the ledger's own 5c/25c observation exactly.
- item 12 (800×480) — **confirmed**, promoted from inference to A2 cite.

**Blockers closed outright by this lane:** combat-core ①④⑤ · skills-meters ③④⑤ ·
items-equipment ③⑤ · economy ② · world-exploration ③④ · meta-social ② · art-anim ④ ·
progression ② · plus the §1 unknown-unknowns *multi-target rule*, *hit-registration window* and
*save/serialization schema*.

**The new blocker this lane creates:** every combat number sourced from the readable Android
export must be re-verified against the obfuscated web payload before use. See
`as/build-divergence`.

---
---

# RUN 3 — SECOND ORTHOGONAL PASS (2026-08-17)

Everything above is the RUN-2 survey and is **preserved verbatim**. This section is a
second, deeper sweep of the same unit. It does three things:

1. **Resolves RUN-2's two open items** — `as/repair-cost` (was STILL_UNHELD) and
   `as/stance-counter-triangle` (was PARTIAL). Both are now HELD, and the counter
   triangle turned out to be a *real mechanic with a v0.717-only second branch*.
2. **Opens files RUN-2 never opened** — `ItemGenerator.as`, `LootDialog.as`, `NPC.as`,
   `MusicManager.as`, `SoundManager.as`, `InputManager.as`, `InteractUI_crops.as`,
   `TerritoryData.as`, `HistoryItem.as`, `Damage.as`, `MCSActor.as`. Each closes at
   least one named ledger blocker.
3. **Runs one A1 frame test** to check a code-derived model against the video, per §0's
   standing invariant. The frame **agrees** with the code — said out loud below.

RUN-2's governing rule still holds and is reinforced twice more here: **read the Android
build for SHAPE, re-verify CONSTANTS in the obfuscated web payload.** Two new divergences
found (`stance counter 0.9 branch`, `behead 1.5 → 1.3`). Every claim below states whether
web parity was checked.

Engine frame rate is **24 fps**, cited: `shs3_android/scripts/Mobile.as:117`
`            GameEngine.getStageMC().frameRate = 24;`

---

## CLAIMS — RUN 3

### as/affix-generator-complete — HELD (A2) — **CLOSES items-equipment ① AND ④**
**Claim.** The whole random-item system is on disk: the **stat-vs-level curve** is five
generated progression arrays, the **per-rarity affix count** is an explicit dice table, and
the **suffix pool** (which the ledger calls a blocker) is a 16 × 8 verbatim string table
sitting next to the prefix pool the ledger already has.

**Cite (curves).** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183`
```
150:         var maxtier:int = MAXINDEX + 1;          // MAXINDEX = 79  → 80 tiers
151:         var base:int = 1;
152:         var inc:Number = 3 / 3;
155:            this.prog1[i] = Math.floor(base + inc * i);      // ATTACK / DEFENSE
157:         this.prog1[MAXINDEX] += 10;
158:         base = 5;   inc = 5 / 3;                             // prog2  MAXHP / MAXCHI
165:         base = 1;   inc = 1 / 3;                             // prog3  elemental atk/def,
                                                                 //        HP/Chi regen, CRITICALDMG
172:         base = 1;   inc = 2 / 3;                             // prog4  SPEED
178:         base = 1;   inc = 1 / 5;                             // prog5  PIERCINGDMG
```
**Cite (affix count).** `ItemGenerator.as:206-252`
```
206:      internal function getEnchantmentCount(isRareItem:Boolean) : int
209:         if(isRareItem)
211:            dice = this.rng.rand(11);
212:            if(dice <= 3) return 2;      //  4/11 → 2 affixes
215:            if(dice <= 6) return 3;      //  3/11 → 3
218:            if(dice <= 9) return 4;      //  3/11 → 4
224:            if(dice == 10) return 5;     //  1/11 → 5
230:         dice = this.rng.rand(100);
231:         if(dice <= 84) return 0;        // 85 % → plain
233:         if(dice <= 89) return 1;
236:         if(dice <= 93) return 2;
239:         if(dice <= 96) return 3;
242:         if(dice <= 98) return 4;
251:         return 5;
```
**Cite (tier from level).** `ItemGenerator.as:321-347` — `tier = nodelvl + 1` clamped
0…79, then the **first** (highest) affix rolls `rng.rand(4) + tier - 3` and every later
affix rolls `rng.rand(10) + tier - 9`; value = `prog[tier-1] + rand(prog[tier] - prog[tier-1])`.
Weapon ATK and armour DEF subtract the item's own `levelrestriction` first (`:464-472`).

**Cite (the suffix pool the ledger says is missing).** `ItemGenerator.as:102-127`, e.g.
```
110:         var attack_pre:Array  = ["Sharp","Fierce","Vicious","Savage","Brutal","Deadly","Fine","Warrior's"];
111:         var attack_suf:Array  = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];
113:         var defense_suf:Array = ["of Defense","of Blocking","of Guarding","of Protection","of Absorption","of Warding","of the Shield","of the Titan"];
115:         var speed_suf:Array   = ["of Speed","of Alacrity","of Haste","of Velocity","of Acceleration","of Sleight","of Swiftness","of Quickness"];
```
16 attributes × 8 tiers, selected by `num = Math.floor(i / 10)` (`:130`) — so the affix
word advances one step every **10** modifier-value tiers.
Name template (`:720-749`): 0 affixes = bare name · 1 = prefix · 2 = prefix + suffix ·
3 = two prefixes + suffix · 4+ = **three prefixes + one suffix**.

**Web v0.717 parity — CHECKED and IDENTICAL for the numerics.**
`shs3_payload/scripts/§1t1644s0§.as:169,178,187,196,204` carry the same
`3 / 3`, `5 / 3`, `1 / 3`, `2 / 3`, `1 / 5` and the same `+= 10` on the last tier;
`:255-282` is the same dice table verbatim. **One real difference:** the web build does
not hardcode the words — it pulls them from the string table
(`§1t1644s0§.as:108-130`, `§1t1657s0§(10029,7)` … `(10197,7)`, i.e. ids **10029–10212**,
8 per array via the inclusive helper at `:227-238`). Those ids are **not present** in the
Android `118_Mobile_Lang_EN.bin` table (`strings.json` tops out at numeric id 9010), so the
Android hardcoded English pool is the *only* verbatim source and its wording is
v0.682's. Label ported affix words as Android-sourced.

**Ledger text overturned.** §4 items-equipment blockers ① *"item stat-magnitude **vs level**
curve"* and ④ *"affix **suffix** pool + per-rarity affix count"*. Both closed.
Also §1 known-unknowns *"item stat-vs-level curve"*.

**New fact absent from all 12 ledgers.** `PIERCINGDMG` (`ItemGenerator.as:56`) is a
17th gear stat nothing in the ledger mentions; `Damage.getMinDamage()` shows what it does
(see `as/defense-is-flat-subtraction`).

**Lane impact.** L-items-equipment (①④ closed), L-economy, L-rebirth-elements (the four
elemental ATK/DEF gear stats are generated here).

---

### as/repair-cost-is-two-consumables — HELD (A2) — **CLOSES economy ③, WAS STILL_UNHELD IN RUN 2**
**Claim.** Weapon repair is **not a service with a fee**. It is two shop consumables
carrying modifier id 82, and their prices and repair amounts are literal payload rows.

**Cite (the mechanic).** `reference/decompiled/shs3_android/scripts/InventoryUI.as:992-994`
```
992:                     else if(modid == 82)
993:                     {
994:                        StatsManager.repairEquippedWeapon(item.modifierXML[i].value);
```
→ `StatsManager.as:2615-2617` `public static function repairEquippedWeapon(num:int) : *
{ equipment[EQ_WEAPON].repair(num); }` → `Item.as:1440` `public function repair(num:int)`.

**Cite (the two items).** `reference/extracted/itemdata.xml:293` and `:306`
```
id=2119  name→"Whet Stone"        baseprice=20  weight=1  modifier id=82 value=10
id=2120  name→"Sword Repair Kit"  baseprice=40  weight=1  modifier id=82 value=25
```
Names resolved through Stage-0 finding S0-3's table. Corroborated verbatim by the shipped
UI copy, `strings.json` id **393**: *"Your weapon is broken!\n\nBuy **whet stones and sword
repair kits from peddlers** to repair your weapon, or use ninja services to make your weapon
unbreakable and give it a name."*

**Ledger text overturned.** §4 economy blocker ③: *"Repair-Weapon cost (**never captured**)."*
It is captured: **20 c for 10 uses, 40 c for 25 uses** — and the same string proves the
Ninja-Services "unbreakable + name" upgrade is the alternative, which the ledger lists under
meta-social without connecting it to repair.

**Lane impact.** L-economy (③ closed), L-items-equipment, L-meta-social.

---

### as/durability-and-slashusage-tables — HELD (A2) — **RESOLVES items ② IN THE NEGATIVE**
**Claim.** There is **no condition→damage multiplier at all**. Condition is (a) a display
string on a 5-band ladder and (b) a binary `isBroken()` that replaces the weapon's whole
damage contribution with `+1`. The durability budget and the per-slash Focus cost are both
weapon-only data tables with three or four discrete tiers.

**Cite (the ladder).** `shs3_android/scripts/Item.as:714-744` — bands at `uses == 0`,
`uses == 1`, `condition == 0`, `< 25`, `< 50`, `< 75`, else; strings resolved:
`639 "Unbreakable" · 392 "Condition: Well-Maintained" · 387 "Condition: Broken" ·
388 "Condition: Poor" · 389 "Condition: Used" · 390 "Condition: Usable" · 391 "Condition: Good"`.
`Item.as:1481-1490` `getCondition()` = `(maxDurability - uses) / maxDurability * 100`.
The **only** reader of `getCondition()` in the entire Android tree is `Item.as:714` — the
tooltip. Grep: `grep -rn "getCondition()" .` → 2 hits, both in `Item.as`.

**Cite (the data).** `reference/extracted/itemdata.xml`, measured programmatically:
```
items carrying <uses> (→ XMLItem.durability, XMLItem.as:186 this.durability = xml.uses):
  115 items, ALL in id range 13014–13227 (weapons only)
  values: 100 ×46 · 80 ×34 · 60 ×34 · 50 ×1
items carrying <slashusage>: 106, same id range
  values: 72 ×70 · 96 ×35 · 24 ×1        (code floors at 48 — StatsManager.as:1921-1927)
```
Verified identical in the Android item table (`reference/extracted/android/111_Mobile_ItemData.bin`,
982 `<item>` rows, same schema).

**Consequence for the Focus economy.** On the 192-unit bar, a 72-cost weapon gives 2.67
Balanced slashes, a 96-cost weapon exactly 2; Light halves it (36 / 48) and Heavy/Dual
multiply by 1.5 (108 / 144). That is the whole slash-rate budget, in integers.

**Ledger text corrected.** §4 items-equipment blocker ②: *"condition→DMG **multiplier**
(current 'evidence' confounds condition with a 2-level gap)."* The ledger is right that the
evidence was confounded and wrong that a multiplier exists. Do not encode one.

**Lane impact.** L-items-equipment (② resolved), L-skills-meters, L-combat-core.

---

### as/enemy-level-scaling-and-1hp-trash — HELD (A2) — **CLOSES enemies-ai ① AND ②**
**Claim.** The enemy level→stat formula is a **linear rescale of the NPC's own XML row**,
with a sub-20 penalty and a **hard floor that makes every level-≤10 enemy 1 HP / 1 damage /
1 defense**. That floor is the code cause of the "field trash dies in one hit" observation.

**Cite (web v0.717, so no parity caveat).** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:258-278`
```
258:      public function setLevel(param1:int) : *
260:         var _loc2_:Number = param1 / this.level;
261:         if(param1 <= 20)
263:            _loc2_ *= 0.9;
265:         this.level = param1;
266:         this.damage *= _loc2_;
267:         this.defense *= _loc2_;
268:         this.§1t3257s0§ *= _loc2_;            // maxhp
271:         this.xp = param1 * 2 + 20;
272:         if(param1 <= 10)
274:            this.damage = 1;
275:            this.defense = 1;
276:            this.§1t3257s0§ = 1;               // maxhp = 1
```
Plain-named twin: `shs3_android/scripts/NPC.as:241-259` — **identical**, so this is a
per-value port-clean case.
Base stats come from data, not code: `NPC.as:214-218`
`this.damage = xml.attack; this.defense = xml.defense; maxhp = xml.hp; this.level = xml.lvl;`

**Cite (per-enemy HP is DATA, blocker ② closed).** `reference/extracted/npcdata.xml`,
counted programmatically over its 495 `<npc>` blocks:
```
403 npcs carry <hp>; range 1…1000; levels 1…80 on 414 npcs
HP histogram head: 1 ×42 · 15 ×32 · 30 ×26 · 10 ×23 · 40 ×19 · 20 ×13 · 150 ×11
```
Worked row, `npcdata.xml` npc id 1: `<lvl>3</lvl> <hp>1</hp> <ai>1</ai> <attack>3</attack>
<defense>0</defense>` — the first bandit is literally a 1-HP mob in the shipped table.

**Ledger text overturned.** §4 enemies-ai blocker ①: *"enemy **level→stat formula** (governs
the whole roster's balance — **absent, not just inferred**)"* — it is on disk in both builds.
Blocker ②: *"per-enemy HP"* — 403 rows of it.
§4 enemies-ai **surface** note *"the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy**
(hp 150), not the ~1-HP-chip field trash the video shows"* is **CONFIRMED IN CODE** — and
note `hp 150` appears 11 times in `npcdata.xml`, so the recreation copied a real row, just
the wrong one.

**Lane impact.** L-enemies-ai (①② closed), L-combat-core (TTK), L-progression.

---

### as/xp-income-model — HELD (A2) — **CLOSES progression ④**
**Claim.** The full XP-per-kill model — base, grey-level cutoff, over-level decay,
under-level bonus and the elite multiplier — is a pair of literal step tables plus a
six-line function.

**Cite (web v0.717).** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208`
```
185:      public static function §1t12070s0§(param1:int, param2:int, param3:int, param4:Boolean) : *
187:         if(param2 <= §1t12068s0§())   return 0;        // mob at/below grey level → 0
191:         if(param2 - param1 > 3)       return 0;        // mob >3 levels above you → 0
196:         if(param1 < param2)  _loc5_ = param3 * (1 + 0.05 * (param2 - param1));
200:         else if(param1 > param2) _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§());
204:         if(param4)  _loc5_ *= 2;                       // elite
```
Base XP: `§1t68s0§.as:237` `this.xp = this.level * 2 + 20;`
Plain-named tables, `shs3_android/scripts/NPC.as:94-110` (`getGreyLevel`):
`lvl<6 → 0 · lvl<40 → lvl − floor(lvl/10) − 5 · lvl<60 → lvl − floor(lvl/5) − 1 · else lvl − 9`
and `NPC.as:112-161` (`getZeroDifference`), the full ladder:
`<8→5 · <10→6 · <12→7 · <16→8 · <20→9 · <30→11 · <40→12 · <45→13 · <50→14 · <55→15 · <60→16 · else 17`.

**Ledger text closed.** §4 progression blocker ④: *"full XP-income model (quest/gather/
dungeon, not just kills)"* — the kill half is now exact, including the anti-farming cutoffs.
This also explains, without any measurement, why the ledger's video samples *"20+ samples show
no XP formula"*: XP per kill depends on the **player's** level as well as the mob's, so a
fixed-mob sample set legitimately produces no constant.

**Lane impact.** L-progression (④), L-enemies-ai, L-economy.

---

### as/coins-per-kill-is-data-not-a-constant — HELD (A2) — **OVERTURNS economy ①**
**Claim.** There is no coins-per-kill constant. Coin drops are **rows in each NPC's
`<reward><loot>` block**, rolled independently: loot id **0 pays 1 coin per qty**, loot id
**1 pays 5 coins per qty**, and `<chance>` is a 0–1 probability.

**Cite (the payout).** `shs3_android/scripts/NPC.as:837-843`
```
837:               if(lootType == 0)
839:                  OverworldHUD.instance.lootDialog.addLootCoins(1 * qty);
841:               else if(lootType == 1)
843:                  OverworldHUD.instance.lootDialog.addLootCoins(5 * qty);
```
**Cite (the roll).** `NPC.as:803-806`
```
803:            lootType = int(loot.id);
804:            qty = loot.qty;
805:            chance = loot.chance * 100;
806:            if(chance == 100 || Math.random() * 100 < chance)
```
**Cite (the data).** `reference/extracted/npcdata.xml` — 131 `<loot>` rows across the roster;
id histogram `0 ×77 · 3 ×28 · 2 ×10 · 1 ×10 · 2113 ×2 · 2112 ×2 · 20028 ×1 · 2114 ×1`.
npc id 1 (the first bandit): `<loot><id>0</id><qty>2</qty><chance>0.5</chance></loot>`
→ **0 or 2 coins, expected 1**.

**Ledger text overturned.** §4 economy blocker ①: *"coins-per-kill reality (`=8` is an
**unconfirmed INFERRED seed**)."* `COINS_PER_KILL = 8` is not merely unconfirmed, it is the
wrong *shape* — there is no such scalar. The early game pays ~1 coin per kill on average.
Loot id 3 (28 rows) is not currency at all — it routes to `addRandomLootItem` (`NPC.as:851`).

**Lane impact.** L-economy (① overturned), L-enemies-ai, L-items-equipment.

---

### as/loot-tables-held — HELD (A2) — **CLOSES a §1 known-unknown**
**Claim.** The drop tables are literal item-ID arrays banded by player level, with an
explicit 50 % no-drop gate, a 4-attempt level-restriction retry and a consolation list.

**Cite (the algorithm).** `shs3_android/scripts/LootDialog.as:448-495`
```
448:      public function addRandomLootItem(playerlevel:int, isRareItem:Boolean = false, alwaysGive:Boolean = false, isLegendaryItem:Boolean = false) : *
456:         if(!alwaysGive && int(Math.random() * 2) == 0)  return;       // 50 % nothing
461:         while(counter < 5)
467:               if(playerlevel < 30)       reward = randomItemList1[…]
471:               else if(playerlevel < 60)  reward = randomItemList2[…]
475:               else                       reward = randomItemList3[…]
478:               if(QuestEngine.getItemData(reward).levelrestriction <= playerlevel + 3)
493:               this.lootList.push(new Item(this.consolationPrizeList[…],1));   // 5th try
```
**Cite (the tables).** `LootDialog.as:67-85` — `ironWeaponList` (38 ids, 13100–13208),
`bronzeItemList` (33 ids, 13130–13216), `steelItemList` (33 ids, 13156–13227),
`randomItemList1/2/3` (~118 ids each), `consolationPrizeList = [2103,2104,2106,2107,20054,20055]`.
**Web v0.717 parity — CHECKED and byte-identical**: `shs3_payload/scripts/§1t6172s0§.as:82`
holds `randomItemList1` with the same 118 ids ending `…,4062,4077,11040,20054,20055];`, and
`:605` holds the same `if(!param3 && int(Math.random() * 2) == 0)` gate.
Rare/legendary loot re-enters `ItemGenerator.generateItem(reward, playerlevel, isRare, isLegendary)`,
tying the drop table to `as/affix-generator-complete`.

**Ledger text closed.** §1 known-unknowns: *"Systems formulas: … **loot/drop tables**."*
The iron / bronze / steel weapon ladder the ledger knows by name is literally these three
arrays with a **level 30 / 60** band boundary.

**Lane impact.** L-items-equipment, L-economy, L-enemies-ai, L-world-exploration.

---

### as/defense-is-flat-subtraction — HELD (A2) — **RESHAPES progression ① AND CLOSES rebirth ②**
**Claim.** DEF is **not a curve**. Mitigation is flat integer subtraction, floored by an
attacker-level ladder that `PIERCINGDMG` adds to. Elemental damage is a set of **four
independent additive channels**, each `attackerElemATK − defenderElemDEF` with a floor of 1,
added *after* physical mitigation — not a multiplier and not a resistance percentage.

**Cite (the whole defender chain, web v0.717).** `shs3_payload/scripts/§1t99s0§.as:3736-3808`
```
3736:            switch(param1)                       // which paperdoll part was struck
3738-3740:          hat / head / neck  →  behead flag
3750:            _loc5_ = param2.damage;              // physical
3751-…:           _loc7_ = param2.fireDamage - STAT_FIREDEF;   (+ wind / water / earth)
3763-3777:        each elemental channel: if attack had it and result < 1 → 1, else if < 0 → 0
3787:            if(counter-favourable matchup)  _loc5_ *= 1.2;
3796:            else if(counter-unfavourable)   _loc5_ *= 0.9;
3800:            _loc5_ -= this.§1t4477s0§();         // ← FLAT defense subtraction
3801:            if(_loc5_ < param2.§1t1088s0§())     // ← getMinDamage() floor
3803:               _loc5_ = param2.§1t1088s0§();
3805:            if(behead)  _loc5_ *= 1.3;
3808:            totalDamage = physical + fire + wind + water + earth
```
**Cite (the floor).** `shs3_android/scripts/Damage.as:150-172`
```
150:      public function getMinDamage() : int
152:         if(this.damage == 0)        return 0;
156:         if(this.attackerlvl == 0)   return this.damage;
160:         if(this.attackerlvl <= 10)  return 1 + this.piercingDamage;
164:         if(this.attackerlvl <= 20)  return this.attackerlvl / 8 + this.piercingDamage;
167:         if(this.attackerlvl <= 30)  return this.attackerlvl / 6 + this.piercingDamage;
171:         return this.attackerlvl / 4 + this.piercingDamage;
```
Plain-named defender twin for the elemental block: `shs3_android/scripts/NPC.as:393-428`.

**Ledger text corrected.** §4 progression blocker ①: *"DEF mitigation **curve** + SPD scaling
(wiki gives only direction)"* — there is no curve; it is `damage − defense`, floored.
§4 rebirth-elements blocker ②: *"elemental ATK-vs-DEF **formula**"* — closed: subtractive,
per-element, floor 1, additive to physical.
§4 items-equipment "Ready" line *"defense min-floor (**EnemyLevel/4**)"* is the **top band
only** and names the wrong actor — it is the **attacker's** level, on a four-band ladder,
plus `piercingDamage`. That also finally gives `PIERCINGDMG` its meaning: **damage that is
immune to defense subtraction.**

**Lane impact.** L-progression (①), L-rebirth-elements (②), L-items-equipment, L-combat-core.

---

### as/stance-counter-triangle-CONFIRMED — HELD (A2) — **UPGRADES RUN-2's ONLY `PARTIAL`; NEW BUILD DIVERGENCE**
**Claim.** RUN 2 could not find a code path for the stance rock-paper-scissors and correctly
reported PARTIAL. **The path exists.** It lives on the *defender* side, and v0.717 carries a
**second branch the Android build does not have**: the favourable matchup also *reduces*
incoming damage by 10 %.

**Cite (web v0.717, MCSPlayer as defender).** `shs3_payload/scripts/§1t99s0§.as:3786-3799`
```
3786:            if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§
                 || this.stance == §1t12221s0§ && _loc11_ == §1t12222s0§
                 || this.stance == §1t12222s0§ && _loc11_ == §1t12220s0§)
3788:               _loc5_ *= 1.2;
3789:               if(controlledBy != 0)
3791:                  _loc12_ = 16777215;          // WHITE damage popup
3795:            else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§
                 || this.stance == §1t12221s0§ && _loc11_ == §1t12220s0§
                 || this.stance == §1t12222s0§ && _loc11_ == §1t12221s0§)
3797:               _loc5_ *= 0.9;
```
Same block, same constants, in the web `EnemyPlayer` class at `§1t4904s0§.as:419-430`.
`§1t12220s0§ / §1t12221s0§ / §1t12222s0§` are LIGHT / BALANCED / HEAVY, fixed by RUN-2's
Heavy-defense mapping (`§1t99s0§.as:3286-3289`).

**Cite (Android v0.682 — the 0.9 branch is ABSENT).**
`shs3_android/scripts/MCSPlayer.as:3701-3707`
```
3701:            if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE
                 || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE
                 || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)
3703:               damage *= 1.2;
3705:               if(this.controlledBy != 0)
3707:                  damagetextcol = 16777215;
```
…and nothing else. `shs3_android/scripts/NPC.as:444-460` has **no** counter branch at all,
whereas the web `NPC`-family twin does — so v0.717 both **added** the mitigation half and
**widened the scope** to ordinary NPC defenders.

**The v0.717 matrix, complete** (defender stance × attacker stance, applied *before* the
flat defense subtraction):

| defender ↓ / attacker → | Light | Balanced | Heavy |
|---|---|---|---|
| **Light**    | ×1.0 | **×1.2** | ×0.9 |
| **Balanced** | ×0.9 | ×1.0 | **×1.2** |
| **Heavy**    | **×1.2** | ×0.9 | ×1.0 |

This matches the shipped tooltips exactly — `strings.json` 6001 *"…Effective against **Heavy**
Stance."* · 6003 *"…Effective against **Light** Stance."* · 6005 *"…Effective against
**Balanced** Stance.\nDefense -20%"*.

**Ledger impact.** A **whole combat relationship that appears in none of the 12 ledgers**,
now specified to the constant. RUN 2's advice "do not encode a counter bonus" is **withdrawn**:
encode ×1.2 / ×0.9, defender-side, pre-defense.

**Lane impact.** L-combat-core, L-skills-meters, L-ui-hud (the white popup), L-enemies-ai.

---

### as/behead-and-weapon-parry — HELD (A2)
**Claim.** Two part-based rules the ledger only gestures at: striking **hat, head or neck**
sets a decapitation flag and multiplies damage; striking the **weapon part** does **zero
damage and does not even consume the hit** — a free parry surface.

**Cite (weapon parry).** `shs3_android/scripts/NPC.as:437-440`
```
437:            case mcs.partList[MCSCharacter.PART_weapon]:
438:               gotHitFlag = false;
439:               damage = 0;
440:               return false;
```
**Cite (behead multiplier — AND a build divergence).**
Android `NPC.as:451-453` and `MCSPlayer.as:3714-3716`: `if(behead) { damage *= 1.5; }`,
applied **after** the defense subtraction.
Web v0.717 `§1t99s0§.as:3805-3806`: `if(§1t1071s0§) { _loc5_ *= 1.3; }` — **×1.3, not ×1.5**,
also after the floor. Per `as/build-divergence`, **use 1.3**.

**Consequence.** The ledger's *"part-based weak points (shielder legs, undead heads)"* is a
description of emergent behaviour; the actual rule is universal — z-order-topmost part wins
(RUN 2's `as/hit-registration-window`), head-group parts multiply, weapon part is immune.
A recreation that draws the sword in front of the torso will make enemies *harder* to hit,
exactly as the original does.

**Lane impact.** L-combat-core, L-enemies-ai, L-items-equipment.

---

### as/damage-popup-colors — HELD (A2) — **CLOSES ui-hud ③**
**Claim.** Floating damage popups are real, are one text object per damage channel, spawn at
**(actor.x, actor.y − 100)**, and carry five fixed colours plus a sixth for a countered hit.

**Cite (web v0.717).** `shs3_payload/scripts/§1t68s0§.as:518-534`
```
518:  createFloatingText(mcs.x, mcs.y - 100, physical, 10027008);   // 0xA30000 dark red
522:  createFloatingText(mcs.x, mcs.y - 100, fire,     16737792);   // 0xFF6600 orange
526:  createFloatingText(mcs.x, mcs.y - 100, wind,     13421772);   // 0xCCCCCC light grey
530:  createFloatingText(mcs.x, mcs.y - 100, water,       26367);   // 0x0066FF blue
534:  createFloatingText(mcs.x, mcs.y - 100, earth,    6697728);    // 0x663300 brown
```
Plain-named twin `shs3_android/scripts/NPC.as:497-513`. Counter-hit colour
**16777215 = 0xFFFFFF** (`§1t99s0§.as:3791`).

**Ledger text closed.** §4 ui-hud blocker ③: *"floating damage/crit **popups** (absent from
the ledger, confirmed to exist)."* Now byte-exact, and it reveals that a multi-element hit
stacks **five** popups at the same anchor point.

**Lane impact.** L-ui-hud (③ closed), L-art-anim-audio-feel, L-combat-core.

---

### as/adaptive-music-system — HELD (A2) — **MATERIALLY OVERTURNS art-anim blocker ①**
**Claim.** Music is **not a set of linear tracks**. It is a **13-stem adaptive layer system**
driven by **18 named states**, with a preset matrix, **phase-locked stem entry** and a fixed
fade rate. The stem and SFX **names** are held verbatim in both builds. (The audio *bytes*
remain encrypted — Stage-0 S0-5 stands.)

**Cite (the 13 stems, web v0.717).** `shs3_payload/scripts/§1t133s0§.as:115-127`
```
115:  getMusic("battlechants")      121:  getMusic("dungeonambience")
116:  getMusic("battledrums")       122:  getMusic("dungeonflute")
117:  getMusic("flutes")            123:  getMusic("dungeonpercussion")
118:  getMusic("safeambience")      124:  getMusic("dungeonpiano")
119:  getMusic("safekoto")          125:  getMusic("bgm_gangnam")
120:  getMusic("safepercussion")    126:  getMusic("bgm_levelup")
                                    127:  getMusic("bgm_lose")
```
**Cite (the state→stem matrix).** `shs3_android/scripts/MusicManager.as:12-46` (18 states) and
`:133-187` (the presets), e.g.
```
MUSIC_EXPLORESAFE          = flutes + safeambience
MUSIC_EXPLOREDANGER        = flutes + safeambience + safepercussion
MUSIC_EXPLORETOWN          = flutes + safeambience + safekoto
MUSIC_DOJO                 = flutes + safeambience + safekoto + safepercussion
MUSIC_EXPLOREBATTLE        = flutes + battledrums
MUSIC_TOUGHBATTLE          = flutes + battledrums + battlechants
MUSIC_PVP                  = battledrums + battlechants
MUSIC_DUNGEON              = dungeonambience + dungeonflute
MUSIC_DUNGEONCREEPY        = dungeonpiano
MUSIC_DUNGEONCREEPYDANGER  = dungeonambience + dungeonflute + dungeonpercussion + dungeonpiano
MUSIC_QUIET                = flutes
```
**Cite (phase lock).** `MusicManager.as:204-224` — an entering stem starts at the *current
playhead position* of whichever of flutes / battledrums / safepercussion / dungeonpiano /
dungeonambience / dungeonflute is already running (`playPosition %= trackArray[i].length`),
so layers stay in sync; the flutes↔dungeonflute swap explicitly resets to 0 (`:230-233`).
**Cite (fade rate).** `MusicManager.as:301` `sndTransform.volume -= 0.05;` and `:329`
`+= 0.05;` — **±0.05 per frame at 24 fps = a 20-frame (0.833 s) crossfade**.
Web parity **CHECKED**: `§1t133s0§.as:306` `-= 0.05;` and `:334` `+= 0.05;`.

**Cite (the SFX manifest).** `shs3_android/scripts/SoundManager.as` —
`slash1/2/3` (`:197,205,213`), `die1/2/3` (`:231,239,247`), `punch` (`:261,274`),
`hitmetal` (`:287`), `deflect` (`:300`), `fart` (`:313`), `goodkoto` (`:326`),
`sumo` (`:339`), `refund` (`:352`). Thirteen cues; slash and death are 3-way randomised.

**Ledger text overturned.** §2/§4 art-anim blocker ①: *"**ALL AUDIO** — every SFX + music
param is INFERRED, no composer sourced."* The *waveforms* are still unrecovered, but the
**architecture, the stem inventory, the state machine, the mixing rule and the fade constant
are all held** — and that is most of what "music params" means for a recreation. The ledger's
proposed close-path (a listen-pass on three YouTube rips) is now a *validation* step against a
known 13-stem structure rather than a blind characterisation.

**Lane impact.** L-art-anim-audio-feel (① materially reduced), L-world-exploration (the
state list is a room-type taxonomy), L-enemies-ai (TOUGHBATTLE vs EXPLOREBATTLE).

---

### as/animation-manifest-with-durations — HELD (A2)
**Claim.** The complete animation manifest survives as **442 verbatim name constants in the
WEB v0.717 payload** (un-obfuscated strings inside an obfuscated class), and **482 of those
animations carry an exact frame duration** in the already-extracted animation XML. Every
slash is a **four-part** clip whose second part **loops**.

**Cite (names, web).** `shs3_payload/scripts/§1t1544s0§.as` — 442 lines matching
`internal static var §1t…s0§:String = "…";`, e.g.
```
698:      internal static var §1t10947s0§:String = "light_stance";
702:      internal static var §1t10951s0§:String = "light_horslash_parta";
704:      internal static var §1t10953s0§:String = "light_horslash_partb";
1144 lines total; families: light_ · balanced_ · heavy_ · dual_ · reversed_ ·
spear_ · ogre_ · guardian_ · zom_ · wolf_ · gob_ · spider_ · deer_ · boar_ ·
horse_ · bear_ · jutsu_ · nodepose_1…10
```
**Cite (durations).** `reference/extracted/anim_xml.txt` — 482 `<anim …>` rows, e.g.
```
<anim i="balanced_horslash_parta" d="12">
<anim i="balanced_horslash_partb" d="9" l="1">
<anim i="balanced_horslash_partc" d="4">
<anim i="balanced_horslash_partd" d="1">
```
Schema is RUN-2's `as/anim-format` (`AnimData.as:13-14` `duration = xml.@d; looping = xml.@l == 1;`).
`l="1"` on **partb only** — the windup runs once, the hold loops, the finish runs once.

**Consequence.** Stage-0 S0-4 estimated "~450 animations, L6 is ~3× the board's assumption".
That is now exact on both sides: **442 named states, 482 timed clips**, and they are
*parseable today* — name manifest + duration table + `FrameNodeData` matrix schema.

**Lane impact.** L-art-anim-audio-feel, L-enemies-ai (creature move sets), L-combat-core.

---

### as/slash-frames-conflict — HELD (A2) — **OVERTURNS §2's "per-stance slash frames" READY CLAIM**
**Claim.** The shipped per-stance slash timings **contradict the project's `SLASH_FRAMES`
config in both magnitude and ordering**. The config makes Heavy the slowest stance; the
original's Heavy horizontal slash is the **shortest** clip and has the **shortest windup**.

**Cite (the shipped table).** `reference/extracted/anim_xml.txt`, horizontal slash, all parts:

| stance | parta (windup) | partb (looping hold) | partc | partd | total |
|---|---:|---:|---:|---:|---:|
| light    | **13** | 9 | 6 | 1 | **29 f** |
| balanced | 12 | 9 | 4 | 1 | 26 f |
| dual     | 12 | 9 | 6 | 1 | 28 f |
| heavy    | **5**  | 8 | 7 | 1 | **21 f** |

At the engine's 24 fps (`Mobile.as:117`) that is light 1.21 s · balanced 1.08 s · heavy 0.88 s.

**Cite (the config it contradicts).** `src/config/timing.ts:37-41`
```
export const SLASH_FRAMES: Record<StanceId, SlashPhaseFrames> = {
  light:    { windup: 4, active: 4, recovery: 4 },   // 12 f @60Hz = 0.200 s
  balanced: { windup: 4, active: 4, recovery: 8 },   // 16 f       = 0.267 s
  heavy:    { windup: 4, active: 4, recovery: 12 },  // 20 f       = 0.333 s
};
```
whose header says *"MEASURED … Strike-to-strike intervals: 12f / 16f / 20f … only recovery
varies."*

**Honest reading of the conflict.** These measure different things: the config measured
**strike-to-strike cadence** off 60 fps video; the payload gives **clip durations** with a
looping hold whose length depends on how long the player draws the line. So the *magnitudes*
can legitimately differ. What cannot be reconciled is the **ordering**: the config's stated
rationale ("only recovery varies", Heavy slowest) is contradicted by a shipped table in which
Heavy has the shortest windup (5 f vs light's 13 f) and light has the *longest* clip. §2 lists
per-stance slash frames under art-anim's *"Ready (strongest slice)"* — that status is not
supportable as stated.
**Per §0's invariant I say it out loud: this is payload-vs-video, not frame-vs-doc, so the
frame does not automatically win here — but the ordering claim needs a fresh frame test
before either number is trusted.** The cheap test: measure light vs heavy *windup* (mouse-down
to first blade motion) on the two longplays; the payload predicts heavy is ~2.6× faster to
commit than light.

**Lane impact.** L-art-anim-audio-feel (a READY claim demoted), L-combat-core.

---

### as/drawn-line-render-contract — HELD (A2)
**Claim.** The drawn slash line — the game's signature visual — has a fully specified render
contract, identical in both builds: **one** stroke, base thickness **8 px**, colour
**0xA30000**, round caps and joins, tapering **linearly to zero** as the reach budget is
spent, resampled to a **20 px** unit, with a **2 px** minimum sample step; the AI's line is
drawn in **black**.

**Cite (constants).** `shs3_android/scripts/InputManager.as:51-59`
```
51:      internal static var maxDistance:int = 200;      // overwritten per stance by setMaxDistance()
53:      internal static var lengthThreshhold:int = 4;
55:      internal static var distThreshhold:int = 400;
57:      internal static var thickness:int = 8;
59:      internal static var largestUnit:int = 20;
```
**Cite (the taper).** `InputManager.as:360` and web `§1t1541s0§.as:361` (identical expression)
```
canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance),
                          10027008, 1, false, LineScaleMode.NONE,
                          CapsStyle.ROUND, JointStyle.ROUND, 3);
```
**Cite (two line colours).** web `§1t1541s0§.as:174` `…lineStyle(thickness, 39168, …)`
(0x009900 green) vs `:179` `…lineStyle(thickness, 10027008, …)` (0xA30000).
Enemy line: `InputManager.as:492` `…lineStyle(scaledThickness - …, 0, …)` — **black**.
**Cite (resampling).** `InputManager.as:356-359` `if(distanceTravelledSQ < 4) return;`
(2 px minimum) and `:370-380` — any move longer than `largestUnit` is subdivided into
**20 px** steps pushed into `drawArray`, which becomes the `slashArray` the hit test walks.

**Ledger/config impact.** `src/config/combat.ts:125` `RESAMPLE_SPACING = 20` is **exactly
right and can be promoted to CONTRACT**. `BLADE_CORE_WIDTH = 7` / `BLADE_EDGE_WIDTH = 13`
(both INFERRED) model a **two-layer** ribbon the original does not have — the original is one
8 px stroke — and `BLADE_MIN_TAPER = 0.12` is wrong in kind: the original tapers to **0**.
Also note the widths are declared "stage-space native" on a 1024×576 canvas while the original
stage is 800×480 (RUN-2 `as/native-resolution`), so they are not directly comparable without
the ×1.28 scale.

**Lane impact.** L-art-anim-audio-feel, L-combat-core, L-ui-hud.

---

### as/shunpo-is-teleport-plus-double-damage — HELD (A2) — **CLOSES skills-meters ②**
**Claim.** Shunpo is a **charged teleport**: it moves the player **250 px** in the facing
direction, spawns a hit projectile scaled by charge time, and — on the slash path — **teleports
the fighter to the end of the drawn blade path and doubles the slash damage**. It is not
slow-motion.

**Cite (the dash + projectile).** `shs3_android/scripts/MCSPlayer.as:1747-1758`
```
1747:               if(prevActionState == SKILL_SHUNPO_STATE)
1749:                  if(getMCS().isFacingRight())
1751:                     this.movePlayer(250);
1752:                     ProjectileManager.createProjectile(ProjectileManager.PROJ_SHUNPOHIT,
                              getMapPosition(), getMCS().y - 44, 0, 0,
                              this.getDamage() * this.getChargingTime() / 2, level, this);
1755:                  else
1756:                     this.movePlayer(-250);
```
**Cite (the slash form).** `MCSPlayer.as:2700-2705`
```
2700:         if(this.doShunpo)
2702:            setPosition(this.destX,this.destY);      // teleport to the end of the line
2703:            this.slashDamage *= 2;
2704:            this.endSlash();
```
**Cite (charge budget).** `MCSPlayer.as:1706` `this.chargingTime = 3 * 24;` (Shunpo),
`:1718` `3 * 24` (Thousand Stabs), `:1730` `4 * 24` (Deadly Cleave);
`:4344-4351` `getChargingTime()` = `chargingTime / 24`, **capped at 10**.
Post-skill invulnerability: `:1764` `gotHitCounter = 26;` (Thousand Stabs),
`:1768` `gotHitCounter = 16;` (Deadly Cleave).
Stance lock on the three ultimates: `SkillSlotButton.as:153` — Shunpo requires LIGHT,
Thousand Stabs BALANCED, Deadly Cleave HEAVY.

**Web v0.717 parity — CHECKED.** `shs3_payload/scripts/§1t99s0§.as:1810`
`this.§1t4468s0§(250);` and `:2775` `this.§1t4410s0§ *= 2;` — both constants present.

**Ledger text closed.** §4 skills-meters blocker ②: *"Shunpo's real effect (Light L10
ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."* The ledger's
negative claim is confirmed and the positive answer supplied.

**Lane impact.** L-skills-meters (② closed), L-combat-core, L-art-anim-audio-feel.

---

### as/dan-cap-and-post-rebirth-sp — HELD (A2) — **CLOSES rebirth ③ AND progression ③**
**Claim.** The Dan stat **caps at 9** and is displayed **+1**, i.e. **ten ranks** — so the
project's `MAX_DAN_RANK=10` is correct and belongs as CONTRACT, not INFERRED. And the
post-rebirth skill-point economy is one line: **SP = (level − 1) + Dan × (levelCap − 1)**.

**Cite (the cap).** `shs3_android/scripts/StatsManager.as:2201-2214`
```
2201:         if(getPlayerStats(STAT_DAN) == 8)      …
2209:         if(getPlayerStats(STAT_DAN) < 9)
2211:            changeStat(STAT_DAN,1);
2214:         NetworkManager.instance.globalAnnouncement("",
                 LangManager.getString(864,[getChatDisplayCharname(),
                 (getPlayerStats(STAT_DAN) + 1).toString()]));
```
**Cite (the SP formula).** `StatsManager.as:2156`
```
setPlayerStats(STAT_SKILLPOINTS, getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
```
with `levelCap = 80` (`StatsManager.as:76`) ⇒ **+79 SP per rebirth**, exactly.
Dan also feeds reach: `StatsManager.as:1917` `var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;`
so a Dan-9 character's base slash length asymptote rises from 210 px to **255 px**.

**Ledger text corrected.** §3 item 7: *"`MAX_DAN_RANK=10` and `tenthGold=100` should be
**INFERRED**, not CONTRACT. The only wiki datum is garbled."* The **10** half is now A2-cited
and should be CONTRACT. (`tenthGold` is untouched by this lane — the flat +25 g reading stands.)
§4 rebirth blocker ③ *"Dan-rank count/titles (garbled source)"* — the **count** is closed;
the **titles** remain unheld from this lane.
§4 progression blocker ③ *"post-rebirth SP economy"* — closed.

**Lane impact.** L-rebirth-elements (③ half), L-progression (③), L-combat-core (reach).

---

### as/farming-and-prosperity-numbers — HELD (A2) — **CLOSES world-exploration ② (farm half) AND economy ② (prosperity half)**
**Claim.** Farming is a four-tier real-time crop system with a rot window and a levelling
plot; town prosperity is a five-band step function on a raw point score.

**Cite (crops).** `shs3_android/scripts/InteractUI_crops.as`
```
55:      internal var gracePeriod:int = 900;          // 15 min before ROTTED
61-69:   cols = 3 · rows = 2 · totalSlots = 6 · maxItem = 6
41-47:   NOTPLANTED 0 · PLANTED 1 · READYFORHARVEST 2 · ROTTED 3
548-558: plantType 1 → timePeriod = 15 * 60          //  15 minutes
         plantType 2 → timePeriod = 60 * 60          //   1 hour
         plantType 3 → timePeriod = 6 * 60 * 60      //   6 hours
         plantType 4 → timePeriod = 12 * 60 * 60     //  12 hours
105-107: if(this.harvestedTimes > 50) this.harvestedTimes = 50;
457-479: getPatchLevel(): <10 → 1 · <20 → 2 · <30 → 3 · <40 → 4 · <50 → 5
```
Times are **server seconds** — same clock RUN-2 pinned via `QueryManagerBase.as:39/111`.
**Cite (prosperity).** `shs3_android/scripts/TerritoryData.as:782-805`
```
782:      public function getTownLevel() : int
784:         if(this.townProsperity == 0)    return 0;
788:         if(this.townProsperity < 500)   return 1;
792:         if(this.townProsperity < 1000)  return 2;
796:         if(this.townProsperity < 2000)  return 3;
800:         if(this.townProsperity < 4000)  return 4;
804:         return 5;
```
Prosperity level then drives town generation directly — `DungeonGenerator.as:1363-1555`
branches on it for building count, shop tier and layout.

**Ledger text closed.** §4 world-exploration blocker ② *"gather/mine/farm **yield + whiff +
respawn** tables"* — the farm branch is closed (grow times, rot window, plot size, patch
levelling); gather/mine remain open from this lane.
§4 economy blocker ② *"…**prosperity** formulas"* — the thresholds are closed.
§4 world-exploration blocker ③ *"real-world 'day' length"* — 12 h is the longest single
timer in the game; there is no abstract "day".

**Lane impact.** L-world-exploration (②③), L-economy (②), L-meta-social.

---

### as/territory-daily-sim-vocabulary — PARTIAL (A2) — **MOVES meta-social ① OFF "UNRECOVERABLE"**
**Claim.** The daily territory simulation's **entity set and complete event vocabulary** are
held client-side, because the client has to render the log. The *coefficients* are not.

**Cite.** `shs3_android/scripts/HistoryItem.as:137-300` — the decoder, verbatim samples:
```
151: "ronin attacked " + getAttackerName(val2) + ": " + val1 + " … killed"
158: val1 + " wildlife immigrated here from the " + getDirStr(val2)
176: "wildlife: underpopulation (too many oni killing wildlife)"
188: "wildlife: overpopulation"
200: val1 + " mercenaries arrived from the " + getDirStr(val2)
219: "bandit group \"" + getBanditGroupName(val3) + "\" arrived from the " + getDirStr(val2)
223: "bandit group \"" + … + "\" took over bandit group \"" + val4 + "\""
239: "merchants robbed by bandits: prosperity -" + val1
249: "bandits are preparing to attack the town"
271: "Oni population: Too high"
283: getAttackerName(val2) + " attacked town: prosperity -" + val1
287: val1 + " villager(s) killed"
295: val1 + " crops eaten by " + getAttackerName(val2)
299: "mercenaries upkeep cost: prosperity -" + val1
```
plus `HistoryItem.as:42` `internal static var TYPE_PROSPERITY:int = 14;` — a numbered event
type table.

**Why PARTIAL.** This gives the sim's **agents** (villagers, wildlife, mercenaries, bandit
groups with names and takeovers, oni, ronin, players), its **state variables** (populations,
prosperity), its **transitions** (immigration, migration, starvation, over/under-population,
upkeep, raids, takeovers) and its **directional topology** (`getDirStr` — territories have
compass neighbours). It does **not** give the rates. Anyone rebuilding it is authoring the
numbers, not the design.

**Ledger text moved.** §4 meta-social blocker ①: *"**server-authoritative simulation** (24h
tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt
as a *new* offline AI sim."* The *tick* is held (RUN-2: `WARMOVEINTERVAL = 60*60`), the
*board* is held (RUN-2: `as/war-board-is-a-hex-grid`), and now the *ecology* is held. What
remains genuinely unrecoverable is the live player population and the tuning constants — a
much smaller claim than §4/§6 make.

**Lane impact.** L-meta-social (① narrowed), L-world-exploration, L-economy.

---

### as/focus-bar-is-the-third-hud-bar — HELD (A1) — **FRAME TEST OF A CODE MODEL; THEY AGREE**
**Claim.** The third bottom-left HUD bar **is** the Focus/"reload" meter, "CANNOT CHANGE
STANCE" is drawn **in that same slot** (occluding it), and when the message clears the meter
is visible refilling **linearly from zero** at the rate the code predicts.

**Cite.** `reference/frames/duel_dense/Nr4fQstqHDM_432.5.png` → `_433.0.png`.
**Crop used:** `(x 230–560, y 960–1070)` of the 1920×1080 frame, upscaled 4× (LANCZOS);
the bar trough spans x ≈ 246–514 (268 px). Fill measured by counting the leading run of
pixels with R,G,B all > 170 along three rows (y = 1032 / 1036 / 1040).

**What is visibly in the frames.**
- `428.0`: portrait, green bar **20/20**, blue bar **26/26**, and in the third slot a brown
  plate reading **"CANNOT CHANGE STANCE"**, with **"150% DAMAGE"** in gold beneath. There is
  **no fourth bar** — the message and the meter share one slot.
- `432.5 → 433.0`: the message is **gone** and a clean white fill appears at the left of the
  brown trough. Measured leading-run, all three rows in agreement:

| frame | fill px | % of bar |
|---|---:|---:|
| 432.5 | 2 | 1 % |
| 432.6 | 6 | 2 % |
| 432.7 | 10 | 4 % |
| 432.8 | 15 | 6 % |
| 432.9 | 19 | 7 % |
| 433.0 | 19 | 7 % |

**The test.** RUN-2 derived, from code alone, `max = 8 * 24 = 192`, `+1 per frame`, displayed
as `(reload − 24)/(maxreload − 24)` (`MCSPlayer.as:1163-1168`). That predicts a refill rate of
`24 units/s ÷ 168 units × 268 px = 38.3 px/s`. Measured over 432.5→432.9:
`(19 − 2) px ÷ 0.4 s = 42.5 px/s`. **Agreement within ~10 %**, and the rise is monotonic and
linear from ≈0 — i.e. the meter had just been **zeroed**, exactly as the crit-consumption path
(`§1t99s0§.as:3295-3297`) requires.

**Frame-vs-doc, stated out loud per §0.** In this instance the frame and the code **agree**,
so no override is needed — but the frame does settle RUN-2's open prediction. RUN-2 wrote:
*"the honest next step is to re-crop that frame and check the Focus bar level; the prediction
is that it reads below 48/192 (i.e. under 25 %)."* Across every frame where the message is
displayed (427.0–432.4) the visible fill sits at **7–22 %**, always under 25 %. The message is
the **insufficient-Focus gate**, not a version hard-lock. RUN-2's `as/in-combat-stance-not-hard-locked`
is therefore corroborated by the video, and §3 item 4 stays overturned.

**Second observation from the same crop.** The blue bar reads **26/26**. The 100-max Chi meter
in the recreation's config is wrong in scale (already known), but so is a naive "Chi is 10-based"
read: 26 is only reachable with gear `MAXCHI` modifiers (`ItemGenerator.as` prog2), which is
itself evidence the filmed character is wearing generated affix gear.

**Lane impact.** L-ui-hud, L-skills-meters, L-combat-core.

---

## RUN-3 SUMMARY OF LEDGER DAMAGE

**Blockers closed outright by RUN 3:**
items-equipment ①②④ · enemies-ai ①② · economy ①②(prosperity)③ · progression ①(reshaped)③④ ·
skills-meters ② · rebirth-elements ②③(count) · ui-hud ③ · world-exploration ②(farm)③ ·
art-anim ①(architecture) · plus the §1 known-unknown *loot/drop tables*.

**RUN-2 items resolved:**
- `as/repair-cost` STILL_UNHELD → **HELD** (two consumables, 20 c / 40 c).
- `as/stance-counter-triangle` PARTIAL → **HELD**, and richer than the tooltips said
  (×1.2 **and** ×0.9, v0.717 only).

**New build divergences (add to `as/build-divergence`'s table):**

| quantity | web **v0.717** | Android **v0.682** |
|---|---|---|
| stance counter, favourable matchup | `× 0.9` | *branch absent* |
| stance counter scope | MCSPlayer **and** NPC defenders | MCSPlayer only |
| behead (head/neck/hat) multiplier | `× 1.3`, after the min-damage floor | `× 1.5`, after defense |
| affix word source | string table ids 10029–10212 (**not held**) | hardcoded English arrays (**held**) |

**Things RUN 3 could not ground (honest):** Dan-rank *titles*; gather/mine yield tables;
the daily-sim *coefficients*; the web build's affix wording; whether the 24 fps clip table or
the 60 Hz video cadence is the right basis for `SLASH_FRAMES`.
