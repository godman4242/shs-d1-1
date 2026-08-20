# CRITIC — CITE LENS — packet `src-npcdata.claims.json`

Reviewer: blind critic (LENS 1, over-claiming).
Packet size: **35**. Judged: **35** (no skips, no silent cap).
Verdict split: **32 stand · 3 refuted** (`npcdata/build-parity`, `npcdata/per-enemy-hp`,
`npcdata/unresolved-name-5017`).
New findings the surveyor missed: **5** (one of them upgrades a packet claim from
"implying" to HELD).

Every verdict below names an artifact **I** opened this turn. No verdict rests on the
surveyor's prose (`docs/gauntlet/L0/sources/npcdata.md` was NOT read, per §3.2).

---

## 0. Lane-wide provenance note (applies to 10 claims, refutes none)

`reference/decompiled/shs3_payload/scripts/` — the **web** v0.717 decompile — holds 652
files and **zero** gameplay classes (`ls … | grep -ci enemy` → `0`; the directory is
skins, `torso4000.as`, `hair6000.as`, `ColorPicker_*`). Every gameplay class in this repo
lives in the **Android v0.682** bundles (`shs3_android/scripts` 559 files, 34 `Enemy*`;
`shs3_android_payload/scripts`). So every code-grounded claim in this packet is
Android-only **by construction** — there is no web AS3 to cross-check against. That is a
lane fact, not a per-claim defect, and I refuse to refute ten claims for it. It is
recorded here so the ledger inherits the caveat.

The **data** side is different and better: `npcdata/build-parity` (claim 6) shows the NPC
table itself is content-identical across builds, so every A2 claim reading
`reference/extracted/npcdata.xml` is build-agnostic.

⚠ Correction to a §0 warning: `reference/extracted/android/125_Mobile_NpcData.bin` is
**NOT UTF-16LE**. Its first bytes are `<?xml version="1.0" encoding="utf-8"?>\r\n` —
plain UTF-8. A UTF-16 decode of it raises
`'utf-16-le' codec can't decode byte 0x0a in position 228454`. The blanket "the Android
blobs are UTF-16LE" rule holds for `118_Mobile_Lang_EN.bin`, not for this one.

---

## 1. REFUTED (3)

### R1 — `npcdata/build-parity` (A3, citelint QUOTE_UNVERIFIED) — **REFUTED, minor**

Claim: "byte-identical after CRLF and XML-declaration normalisation".
Pasted evidence: `web bytes 218792 android(no decl) bytes 218793 / IDENTICAL: True`.

I re-ran the comparison first-hand:

```
raw web 228413  raw android 228455  diff 42
android after decl strip 228415   (declaration = 40 bytes)
norm web 218792   norm android 218793
IDENTICAL: False
common prefix identical; tail web: b''   tail android: b'\n'
```

The two byte counts the claim itself pastes **differ by one**, and it then reports
`IDENTICAL: True` — the pasted A3 evidence contradicts itself, which is exactly the
defect this lens exists to catch. After *exactly* the two normalisations the claim names,
the files are **not** identical: the Android file carries one extra trailing `LF`.

*What survives, and should be re-entered verbatim:* **the web `npcdata.xml` and the
Android `125_Mobile_NpcData.bin` are identical after CRLF, XML-declaration and
trailing-newline normalisation (218,792 vs 218,793 bytes, the whole 218,792-byte common
prefix matching)** — which does close the S0-3 Android caveat for this file. The finding
is real; the stated normalisation set is one item short.

### R2 — `npcdata/per-enemy-hp` (A2, citelint RESOLVES) — **REFUTED, material**

The numbers and the nine cited lines are all exact — I checked every one:
403 of 495 `<npc>` blocks carry `<hp>`, 92 do not; npc 144 Hiroshi `<lvl>80</lvl>
<hp>1000</hp>` at :3124-3125, npc 800 Mad Cultist :4075-4076 `800`, npc 186 Amaya
:3845-3846 `600`, npc 165 Tadao :3445-3446 `200`, Wolf :1848, Bear :1951,
Bandit Leader :499, Guardian :4115, Training Dummy :2689 — all correct.

Two sub-assertions are **false**:

**(a) "including every named boss."** Named bosses with **no** `<hp>` at all:
Gojo Takamori (npc 190 @3917, npc 191 @3939), Magoichi (188 @3884, 810 @4275),
Yohei (187 @3863), Satoshi (161 @3365), Fumio (164 @3424), Hachimaru (181 @3760),
Shou (182 @3777), Mitsuo (197 @4021, 809 @4256), Chikako (811 @4293).
Gojo Takamori is `<ai>29</ai>` (EnemyElite) with a fourteen-skill loadout including
Undying — a boss by any reading — and ships no HP.

**(b) "the 92 hp-less rows being non-combat NPCs."** **22** of the 92 carry an `<ai>`
— ai7 ×6, **ai29 ×5** (`EnemyElite`), ai30 ×5, ai32 ×2, ai33 ×2, ai34 ×2 — and **12 carry
a full `<skills>` block**. They are combat actors with no authored HP.

Why it is material, not cosmetic: `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:143-149`
reads `if(xml.hp.toString() != ""){ this.hp = xml.hp; } else { this.hp = 1; }` — so those
22 combat rows enter the parser at **hp = 1**, and where their HP really comes from is an
open question the claim's wording closes prematurely. A rebuilder trusting "every named
boss has authored HP" would ship Gojo Takamori at 1 HP and never notice.

*What survives:* "Per-enemy HP is authored for 403 of 495 NPCs, including Hiroshi L80
hp1000, Mad Cultist L23 hp800, Amaya L30 hp600, Tadao L10 hp200" — all verified. Drop
"every named boss" and drop the characterisation of the 92.

### R3 — `npcdata/unresolved-name-5017` (STILL_UNHELD, citelint RESOLVES) — **REFUTED, minor**

Almost all of it is exact. `grep -n "<name>5017</name>"` returns precisely
`1560, 1576, 1592, 1608, 1624, 1640`; `<ai>` at 1561/1577/1593/1609 is `7` on all four,
1625 is `32`, 1641 is `33`; `strings.json` has no key `"5017"`; `resolved_names.json`
`npcdata.xml` reports `misses: 6`, all six of them id `5017` — so "the only unresolved NPC
name" is right; npc 55's `<head>8500,…,8506</head>` sits at :1646 and `<pants>11503</pants>`
at :1648.

The final sub-clause is **wrong**: "a 500-offset head/pants body sub-band that **no other
NPC touches**." I enumerated every `<mcs>` slot value in the file. `head` ids in
8500-8599 also appear at lines **3147, 3323, 3564, 3585, 3854**; `pants` ids in
11500-11599 also appear at **3325, 3566, 3588, 3856, 3910, 4124, 4304, 4378, 4397, 4416**.
`11503` specifically — the exact id cited — is also worn by npc 189 Lady Oiwa (:3910) and
by the npc at :3325. The 500-band is the named-character wardrobe band, used widely.

*Re-enter without that clause* and the claim is a clean, useful STILL_UNHELD.

---

## 2. STANDING — with corrections noted (12)

These are **not** refuted. Each is grounded, each cite resolved when I opened it, and the
load-bearing content reproduced. The notes are precision fixes for the ledger text.

| id | correction |
|---|---|
| `frames/pillarbox-confirmed` | Gives content `x≈53…1866`, width 1814. My own per-column scan of the same frame at a >3 threshold gives `52…1867`, width **1816**, aspect 1.6815 — a 2 px edge-antialias difference, and the claim's own `≈` covers it. Its mean-RGB profile reproduces to ±0.1 ((48,1.1)(50,0.5)(52,36.7)(54,78.4)(1864,87.2)(1866,68.9)(1868,1.1)). Separately: the figure at the bottom-left of crop (960,300)-(1920,760) is **bare-headed with black hair**, not "kasa-wearing" — the kasa corpse is at x≈600-700, outside that crop. Incidental, not load-bearing. |
| `npcdata/ai-taxonomy` | `NPCManager.as:516-634` is **38 cases** but only **35 distinct classes** — `EnemyPlayer` serves cases 0, 9 and 14 (different ctor args) and `EnemySpearElite` serves 28 and 37. "maps one-to-one onto 38 named actor classes" should read "38 cases over 35 classes". Everything else verbatim, including the three `Friendly*` and `EnemyVegePatch` at case 20. |
| `npcdata/ai-profile-table` | Distribution reproduced **exactly** (425 rows, 34 distinct, 10/15/16 unused, ai1 56 · ai2 48 · ai3 52 · ai4 47 · ai5 48 · ai6 3 · ai9 73 · ai13 1 · ai14 15 · ai26 8 · ai28 24). "boss-unique profiles ai29–ai37" is loose: ai29 ×10, ai30 ×8, ai34 ×3, ai32/ai33/ai37 ×2. ai26's eight are all named `Undead` ✓; ai13's one is `Training Dummy` ✓. |
| `npcdata/enemy-skill-loadouts` | 96 / 647 / 39 all exact; Gojo Takamori's 1039/1047@3/1044/1068 and Aboshi's 1010@2/1012@2/1053 all resolve as stated. "drawn from the SAME pool as the player" holds for 37 of 39 — 1500 and 1501 are enemy-only (see N1). |
| `npcdata/five-clan-armies` | Every one of the ten cited lines is exact, and the `(lvl,hp,attack,defense,ai)` ladder is **identical at all 57 offsets across all five blocks** — I diffed them. 285 rows, 0 `<reward>`. But "differing only by armour and hat item id" is not quite true: the 400-block also differs by `<name>` at offsets 53-56 — 453 **Santa**, 454 **Blacksmith**, 455 **Nian Monster**, 456 **Bear**, where the other four blocks all read Heavy Soldier. Name-only deviation; stats identical. |
| `npcdata/heavy-stance-def-penalty` | **Build-parity hole, material.** The string is verbatim and the ring closes (1000 "Effective against Heavy Stance", 1001 "…Light Stance", 1002 "…Balanced Stance / Defense -20%"), and 79 NPCs carry 1002 — all confirmed. But it exists **only** in the Android v0.682 EN table. `LC_ALL=C grep -c -a` over the 329 MB `reference/extracted/payload.xml` returns **0** for each of `Defense -20`, `Heavy Stance Mastery`, `Effective against Balanced Stance`, and none of the 27 web bindata files is a lang table. **Closing test:** recover the web build's skill-description text (SWF `DefineText`/`DefineEditText` assets, or a web-side Lang blob) and match the −20% literal; until then the number is "Android v0.682 says −20%", not "v0.717 does". |
| `npcdata/level-stat-formula` | Re-derived independently: **225** army NPCs at lvl≥11, **0** violations, exactly as pasted. lvl 1-5 hp pinned to 1 ✓; lvl 6-10 flat ✓; 45/50/55/60 DEF = 2.8·L exact ✓; 70 → 175/175/175 ✓. One nit: the fields sit at block-start +3 (lvl), +4 (hp), +5 (ai), +6 (attack), **+7 (defense)** — "block-start+3…+6" is one short. |
| `npcdata/loot-enum-and-coins-per-kill` | `NPC.as` `internal function createLoot()` at :777, and :805-806 / :837-856 are verbatim. I computed expected coins over all 66 reward blocks: Mercenery Captain **10.0 is the maximum expected** ✓. Note the maximum *possible* is 15 (Bandit Leader, npc 17/18, three rows summing 15 face value at expectation 1.5) — read "max 10" as max **expected**, which is what the data says. |
| `npcdata/paperdoll-12-slots` | The `<mcs>` tag histogram over the whole file is exactly the 12 named tags and nothing else (pants 489, armor 479, shoes 472, weapon 470, hair 462, hat 287, prop1 217, mask 131, head 115, gloves 58, neck 29, **prop2 1**). The itemdata band↔`<type>` histogram reproduces **every number in the quote**. "with zero ambiguity" is 2 rows out of 982 too strong: one 7000-band item carries no `<type>`, and one 2000-band item carries `<type>12`. |
| `npcdata/procgen-town` | `initProcGenNPC` at :403, seed at :415, `rng.rand(8)` at :418, the six archetypes at :419-442 (COMMONER weighted 2/8 via dice 0|6, SAMURAI 2/8 via 5|7), name calls at :296/:458/:484/:529 — all verbatim. Nit: of the five bindata name tables, `89_NameGenerator_PlaceNames.bin` is a place table, not an NPC-name table; four are NPC-name tables. |
| `npcdata/shipped-bugs` | All three defects confirmed and `6015.6017` really is in the shipped ActionScript at `XMLNpc.as:460`, **:486, :497, :531** — all four exact. Nit: the quote labels `npcdata.xml:4386-4387` for `<name>5001</name> <attack>7076</attack>`; those sit at **4388-4389** (4386 is `<npc>`, 4387 is `<id>816</id>`). The claim's formal cite range `:4368-4430` does cover them, so this is a label slip inside the quote, not a broken cite. |
| `npcdata/stance-mastery-rank-10` | skilldata gives 1000/1001/1002 **categories 1/2/3 with exactly 10 `<level>` rows each** ✓, and :535 is verbatim. Nit: ":535 and 75 sibling rows" — 76 blocks carry skill 1000, but only **74** carry all three at `<lvl>10</lvl>`; Hachimaru (:3760) and Shou (:3777) carry 1000@3 alone. The rank-10 cap itself is exact. |

---

## 3. STANDING CLEAN (20)

Verified first-hand, no correction needed.

- `frames/pillarbox-52px` — I reproduced the per-column luminance scan on
  `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`: cols 0-51 ≤1.1, col 52 = **40.8**,
  col 53 = **86.5**, col 1866 = **72.9**, col 1867 = **33.1**, col 1868 = **1.3**, cols
  1869-1919 ≤1.1 — matching the pasted figures to ±0.1. Content = cols 52…1867 = **1816 ×
  1080 = 1.6815**, 0.89 % off 5:3, scale 1816/1920 = **0.94583**. Identical on
  `_431.5.png` and `_432.0.png`. I also opened the frame and looked: black pillars both
  sides, yellow `SOUND360TM` watermark mid-frame, orange coin-pouch projectile in mid-air.
  **THE FRAME WINS** over any HUD doc that took x/1920. Its PARTIAL scoping — the frame
  cannot separate a Flash-stage pillarbox from recorder letterboxing, and the watermark
  proves an overlay was present — is the honest call and I endorse it.
- `npcdata/absent-boss-names` — all nine terms return **0** hits across `strings.json`
  (2,533 entries), the 484 resolved npcdata names (109 distinct), and a literal
  `grep -ic` of `npcdata.xml` itself (**0**). The 27-name payload boss roster it lists is
  present in `resolved_names.json` as stated.
- `npcdata/boss-movesets` — 96 `<skills>` blocks, 647 rows, **16 distinct movesets**, and
  the "standard elite kit" string at :535 occurs exactly **73** times. `skilldata.xml:1948-1956`
  is verbatim (`<id>1500</id>`, `<category>11</category>`, empty chi/cooldown/desc), same
  at :1960 for 1501. Named skills all resolve (1039 Shunpo, 1068 Undying, 1053 Shadow
  Clone, 1040 Thousand Stabs, 1047 Heavenly Sword). Its "five stance masteries" inference
  is now **upgraded to held** — see N1.
- `npcdata/compositing-contract` — head z-order verbatim at :682-683 (index 0),
  :754-755 (headMask 1), :705-706 (hatHair 2), :723-724 (hair 3). Bone attach points span
  :832-1265 and confirm one slot painting several bones (shoes → `foottop` onto l_calf,
  r_calf, l_foot, r_foot at :851-880). Art indirection verbatim at :585-592. All six named
  web classes exist: `torso4000.as pelvic4000.as thigh11000.as foottop12000.as
  neck10000.as prop13000.as`.
- `npcdata/damage-is-a-range` — `XMLNpc.as:358-364` verbatim; the cite range :352-364 also
  covers the null-weapon branch (`minDamage = attack; damageRange = 0; slashUsage = 48`).
  Its own caveat is correct and important: this is `initDuelist`, the PvP path.
- `npcdata/elemental-roster-empty` — `<fire>` ×1 (line **3380**), `<earth>` ×3 (**3439,
  4039, 4272**), `<water>` **0**, `<wind>` **0**. All four are ai30/ai34 → `FriendlyElite` /
  `FriendlyArcher`. No enemy in the shipped roster is elemental.
- `npcdata/elemental-wheel` — `XMLNpc.as:194-213` verbatim, and the player restatement at
  :330-337 verbatim (`STAT_FIREDEF = stats[STAT_WATERATK]`, `STAT_EARTHDEF =
  stats[STAT_FIREATK]`). There is indeed no separate elemental-defence stat to find.
- `npcdata/enemy-render-scale` — exactly **16** NPCs carry scale, domain exactly
  `{0.95, 0.99, 1, 1.1, 1.3, 2}`, and the non-uniform set is exactly Inokichi 1.3/1.1
  (:3408-3409), Fumio 1/0.95 (:3437-3438), Mitsuo 1/0.95 (:4037-4038 and :4270-4271).
  Guardian 2/2 at :4136-4137 ✓, Yohei 1.3/1.3 at :3880-3881 ✓.
- `npcdata/friendly-npcs` — ai30 ×8 + ai31 ×1 + ai34 ×3 = **12** ✓. All nine cited offsets
  are genuine `<npc>` block starts with the stated ally ai: 3365 Satoshi/30, 3424 Fumio/30,
  4021 Mitsuo/34, 4256 Mitsuo/34, 3760 Hachimaru/30, 3777 Shou/30, 4313 Scout/30,
  2418 Old Guard/30, 3506 Yuudai/**31**. `NPCManager.as:608-622` verbatim.
- `npcdata/high-band-coefficients` — :5318-5324 (npc 248, lvl 45 → 113/113/126) and
  :5393-5399 (npc 252, lvl 70 → 175/175/175) are exact to the line. 2.8·L is exact at
  45→126, 50→140, 55→154, 60→168.
- `npcdata/loot-drop-tables` — **66** `<reward>`, **131** `<loot>`, chance domain exactly
  `{0.05, 0.1, 0.3, 0.4, 0.5, 1}`, qty exactly `{1,2,3,5}`. The butchery pattern is real
  and I traced every leg: Boar (73) and Deer (74) → Meat 2113 @0.3 + Small Meat 2112 @0.3;
  Stag (75) → Large Meat 2114 @0.4 (the file's **only** 0.4); Wolf (67) → Animal Fang
  20028 @0.5. Boss pattern id=2/qty=1/chance=1 at :530-532 ✓.
- `npcdata/named-boss-hp-authored` — the `src/config/combat-sim.ts` `ENEMY_BASE` comment is
  verbatim ("Named-enemy HP is not authored at all — it is recomputed at spawn as
  `effPlayerDmg × K`…"), and the payload does contradict it: 403 rows carry `<hp>`, 42 of
  them are `1`, so **361** are non-1 — the claim's ":3125 and 360 further" is exact.
- `npcdata/no-kill-xp` — `<exp>` count **0**. `XMLReward.as:6` `public var exp:int;` and
  :20-22 `if(xml.exp.toString() == "") { this.exp = 0; }` verbatim. 495 − 66 = **429**
  reward-less, and **0** of the 285 army rows carry a reward ✓. (Where kill-XP actually
  lives: N4.)
- `npcdata/no-speed-no-chi` — `<speed>` **0**, `<chi>` **0**. `XMLNpc.as:151-158` and
  :175-182 verbatim, both defaulting to 1.
- `npcdata/npc-elemental-typing` — the four elemental NPCs and their matching skills check
  out: npc 161 Satoshi carries `<id>1013</id>` = **Fire Breath** "Close-ranged fire attack";
  npcs 164 / 197 / 809 each carry `<id>1033</id>` = **Ground Punch** "Close-ranged earth
  attack."
- `npcdata/one-hp-field-trash` — census reproduces **exactly**: 42 rows at `<hp>1</hp>`,
  breakdown Soldier 25 · Ruffian 5 · Elite Soldier 5 · Novice Swordsman 3 · Thug 1 ·
  Deer 1 · Fox 1 · Training Dummy 1. All eight cited lines land on the right `<hp>`:
  26, 4455, 4542, 1659, 149, 1991, 2087, 2710.
- `npcdata/paperdoll-13-slots` — `XMLNpc.as:36` `DEFAULT_EQSTRING = "4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0"`
  (13 fields) and :705 `var equipment:Vector.<Item> = new Vector.<Item>(13);` — both
  verbatim. Colour tags at `MCSCharacter.as:524-549` (armor/pants/hat p+s colour, mask at
  :551-558).
- `npcdata/random-appearance-weighting` — `MCSCharacter.as:574-579` verbatim. Applied to
  `npcdata.xml:155`, npc 6 is `<lvl>2</lvl>` name 5010 = **Thug**, hat pool
  `0,0,0,0,0,7003,…,7020` = 5 zeros of 17 entries → bald **5/17**. Exact.
- `npcdata/shipped-data-defects` — :1644 `<hair>6.5006501650265E+47</hair>`; :4371 npc 815
  `<attack>7092</attack>` with `<hat>7093</hat>` and no lvl/hp/defense/ai; :4389, :4408,
  :4425 likewise (7076/7077/7040). `grep -c "6015\.6017"` → **355** exactly. And
  `docs/gauntlet/L0/index/npcdata.json` really does report
  `"npcdata/npc/attack": … "numeric_range": [1.0, 7092.0]` — 7092 comes from npc 815 alone.
- `npcdata/wardrobe-randomiser` — **741 of 3210** `<mcs>` slot rows are comma pools =
  **23.1 %**, to the decimal. npc 17's hat pool at :506 is 9 zeros + 11 hats = 20 entries →
  45 % bare-headed. npc 1's hair pool at :31 verbatim.

---

## 4. NEW FINDINGS (5)

### N1 — skills 1500/1501 are REVERSED and DUAL stance; the game ships FIVE stances (HELD, A2)

`npcdata/boss-movesets` said the unnamed category-11 skills imply "five stance masteries
rather than three". It is not an implication — the code names them:

```
reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:160-167
   if(xml.getMastery(1500) > 0)
   {
      setStance(REVERSED_STANCE);
   }
   else if(xml.getMastery(1501) > 0)
   {
      setStance(DUAL_STANCE);
   }
```

Same dispatch at `EnemyPlayer.as:836-840` and `FriendlyElite.as:83-87`. And the art
shipped: `reference/extracted/android/95_MCSCharacter_ReversedStanceAnimationData.bin` and
`101_MCSCharacter_DualStanceAnimationData.bin` sit alongside
`108_…LightStance…`, `97_…BalancedStance…`, `106_…HeavyStance…`.
Carriers in the payload: 1500 → Aboshi (:3662), Magoichi (:3898); 1501 → Gojo Takamori
(:3934, :3956).
**Lane impact:** any stance model with three states is short two. Reversed and Dual are
enemy-only (no string-table name, empty chi/cooldown) but have full animation payloads.

### N2 — kill-XP is computed from level in code, not authored anywhere (HELD, A2)

```
reference/decompiled/shs3_android_payload/scripts/NPC.as:252
   this.xp = lvl * 2 + 20;
```
inside `public function setLevel(lvl:int)` (:239-260). This completes
`npcdata/no-kill-xp`, which correctly found `<exp>` absent from the data but stopped
there. XP per kill = **2·level + 20**.

### N3 — `setLevel` hard-pins everything to 1 below level 11 (HELD, A2)

Same function, `NPC.as:241-259`:
```
var factor:Number = lvl / this.level;
if(lvl <= 20) { factor *= 0.9; }
…
this.damage *= factor; this.defense *= factor; maxhp *= factor; setHP(maxhp);
this.xp = lvl * 2 + 20;
if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }
```
This is the code-side twin of the packet's `one-hp-field-trash` A2 census: sub-11 enemies
are forced to 1 damage / 1 defense / 1 HP **regardless of what the XML authored**, and a
0.9 penalty rides on everything at lvl ≤ 20. It also means the 42 `<hp>1</hp>` rows are not
a data quirk — they agree with a hard rule in the engine.

### N4 — the hp-less combat rows enter at hp = 1 (PARTIAL, A2)

`XMLNpc.as:143-149` defaults `hp` to 1 when the element is absent. Combined with R2's
census, 22 combat-`ai` NPCs — including Gojo Takamori and Magoichi — reach the actor with
hp = 1 unless `setLevel` overrides, and they carry no `<lvl>` either, so `setLevel` may
never fire with a real level. **STILL_UNHELD:** what the spawn path actually passes for
these rows. This is a live blocker, and R2's "the 92 are non-combat" wording was hiding it.

### N5 — the web build has no recovered gameplay code and no recovered string table

Two negative results, both first-hand, both worth banking so nobody re-derives them:
`ls reference/decompiled/shs3_payload/scripts/ | grep -ci enemy` → **0** (652 files, all
skins/asset classes); and `LC_ALL=C grep -c -a` over the 329 MB
`reference/extracted/payload.xml` returns **0** for `Defense -20`, `Heavy Stance Mastery`
and `Effective against Balanced Stance`. Every code claim and every UI-copy claim in this
lane is therefore Android v0.682 until a web text asset is recovered.

---

## 5. Accounting

packet_size 35 · judged_count 35 · skipped 0 · VOID 0.
Refuted 3 (1 material, 2 minor). Standing-with-correction 12. Standing clean 20.
New findings 5.
