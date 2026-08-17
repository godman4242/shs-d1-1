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
