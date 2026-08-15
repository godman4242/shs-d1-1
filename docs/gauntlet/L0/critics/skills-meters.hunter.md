# skills-meters — HUNTER CRITIC (blind)

Reviewed: `docs/gauntlet/L0/systems/skills-meters.md` output, new_score 86.
Every verdict below rests on an artifact **I** opened this session. Commands re-run, not trusted.

---

## HEADLINE

**Two claims REFUTED as WRONG. Two STILL_UNHELDs REFUTED as FOUND. One PARTIAL REFUTED as fully held.**

The survey is strong — 15 of 21 claims survived contact with the artifacts, several
reproduced exactly (the SPD 6-10 reconstruction is genuinely excellent work). But it
carries one **fatal** transplanted-Android constant and one **material** over-count, and
it left three things on the table that were sitting decoded on disk.

---

## R1 — FATAL. `focus-meter-numerics-web`: the meter max is 192 frames, not 120.

The claim says *"max 120 frames (5s)"* citing `§1t99s0§.as:55`.

`§1t99s0§.as:55` is **not the reload meter**. It is:

```
 55:      internal static var §1t12234s0§:int = 5 * 24;
```

and `§1t12234s0§` is consumed at `§1t99s0§.as:266` (`this.§1t4440s0§ = §1t12234s0§;`) and
`§1t122s0§.as:950` — an unrelated field. The reload maximum is `§1t4415s0§`, the same var
the crit equality at `:3272` tests, and it is set in exactly two places in the whole web
bundle, both to **8 × 24 = 192**:

```
§1t99s0§.as:249:         this.§1t4415s0§ = 8 * 24;
§1t4904s0§.as:77:         §1t4415s0§ = 8 * 24;
```

(`grep -rn '4415s0§ =' .` returns those two lines and nothing else.)

**120 is the ANDROID number** — `shs3_android_payload/scripts/MCSPlayer.as:239: this.maxreload = 5 * 24;`.
This is precisely the failure the survey accuses the previous pass of ("banked the Android
numbers"). It fixed the 24→48 dead zone, the gate and the switch cost, then carried the
Android max through unchanged.

Everything else in that claim reproduces: `(reload-48)/(max-48)` mapping at `§1t113s0§.as:328`,
flat 48 switch charge at `§1t99s0§.as:3162`, `slashUsage` × 0.5 / 1.0 / 1.5 at `:3302/3306/3310`,
`+6` at `:3320`.

**Downstream corrections the lane must take:**
- Usable meter range is **144 frames (6 s)**, not 72.
- A stance switch costs **one third** of the usable range, not two thirds.
- Full refill from empty is **192 frames = 8 s** at the `+1`/frame regen (`§1t99s0§.as:1203-1205`).
- The android bar divides by `maxreload-24` (`MCSPlayer.as:1168`); the web divides by
  `max-48`. Both the numerator offset **and** the max differ. Do not mix them.

---

## R2 — MATERIAL. `per-level-effect-numbers`: 83 numeric rows, not 135.

The claim: *"135 of the 182 level rows carry a verbatim **numeric** effect string … so no
projectile-class reading is needed for them."*

135 rows carry a resolvable `<desc>` (I confirm: 182 levels, 47 empty, 0 unresolved ids).
But only **83** of those 135 strings contain a digit. The other **52 are qualitative** and
still need the code read:

| skill | rows | text |
|---|---|---|
| 1000 Light Stance Mastery | 10 | "Increased damage" |
| 1001 Balanced Stance Mastery | 10 | "Increased damage and slash range" |
| 1002 Heavy Stance Mastery | 10 | "Increased slash range" |
| 1005 Focus | 2 | "Reduced cooldown" |
| 1010 Smoke Bomb | 2 | "Reduced cooldown" / "…can now be used when you are launched or downed." |
| 1020 Farming | 5 | "Increases your chances of harvesting rare crops" |
| 1021 Scavenging | 5 | "Increases your chances of finding hidden items…" |
| 1022 Mining | 5 | "Allows you to mine coal and iron deposits." (5 tiers) |
| 1053 Shadow Clone | 1 | "Clone can damage enemy." |
| 1069 Chi Charge | 2 | "Increases the chi charging rate" |

The three stance masteries alone are **30 of the 52** — and those are exactly the rows whose
numbers this same survey had to derive from AS3 (`0.5+0.4M·0.1` etc). So the claim's own
sibling claim disproves its "no code reading needed" clause.

The finding is real and valuable at **83 rows**. It is over-claimed by 52.

---

## R3 — `shunpo-effect` is not PARTIAL. The 250 px / 3 s geometry is in the WEB bundle.

The survey hedged: *"its 250px/3s teleport geometry is Android-only and I will not promote
it to web fact."* It is not Android-only. `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`:

```
1765:               this.§1t4432s0§ = 3 * 24;          <- Shunpo charge window, web
1810:                     this.§1t4468s0§(250);        <- movePlayer(+250), web
1811:  §1t1712s0§.§1t4568s0§(§1t1712s0§.§1t11301s0§, …, this.§1t4476s0§() * this.§1t4492s0§() / 2, level, this);
1815:                     this.§1t4468s0§(-250);
```

Line-for-line the Android `MCSPlayer.as:1706/1751/1752/1756`. Damage = `getBaseDamage() × getChargingTime() ÷ 2`,
where the web `§1t4476s0§()` is `minDamage + random*damageRange` (`:3279-3282`) and
`§1t4492s0§()` is `floor(chargeFrames/24)` capped at 10 (`:4713-4721`), with the counter
incremented per frame at `:2080`. Verdict should be **HELD**.

Bonus, same switch, same file, both web: **Thousand Stabs charges 3 × 24** (`:1777`) and
**Deadly Cleave charges 4 × 24** (`:1789`).

---

## R4 — `ultimates-and-elemental-projectile-constants` is NOT still-unheld.

The survey says the constants "are computed in projectile classes, not tabled", that the
`*Projectile.as` files are Android, and that each "must then be located in the obfuscated
web bundle by constant-pattern grep". That grep works and takes one command. **34 web classes**
carry the projectile signature `override public function init(param1:int, param2:int, param3:int, param4:int, param5:§1t68s0§ = null)`,
and **12 carry hard-coded per-skill-level damage tables**, in the shipped web build:

```
§1t8381s0§.as : 25 / 50 / 75      (= SlashWaveProjectile)   + scale 1 / 1.2 / 1.3
§1t8399s0§.as : 40 / 80 / 120     (= WindmillProjectile)
§1t8350s0§.as : 50 / 70 / 100 / 1 (= ChiBurstProjectile)
§1t8392s0§.as : 10 / 20 / 30      (= ChiPunchProjectile)
§1t8356s0§.as : 10 / 20 / 30
§1t8404s0§.as : 50 / 100 / 150
§1t8402s0§.as : 50 / 100 / 150
§1t8353s0§.as : 50 / 75 / 100
§1t8390s0§.as :  5 / 10 / 15
§1t8366s0§.as : 500      §1t8369s0§.as : 500      §1t8347s0§.as : 10
```

Sample proof, `reference/decompiled/shs3_payload/scripts/§1t8381s0§.as:22-36`:
```
22:         if(param4 == 1)
25:            param3 = 25;
30:            param3 = 50;
35:            param3 = 75;
```
against `shs3_android_payload/scripts/SlashWaveProjectile.as:25/30/35` — **identical**.
Class identification is by damage-signature match (the tables are unique), not by symbol id;
the embed symbols differ between builds so that route is closed.

This also contradicts the survey's blanket rule *"Android projectile code is proven-retuned
so it cannot be trusted for v0.717."* The retuning it proved is in `MCSPlayer` (crit, SPD cap,
mastery scale). Every projectile table I could check is **unchanged** across builds. The
correct rule is narrower: *Android **player-stat** code is retuned; Android projectile
constants check out so far.*

---

## R5 — `skill-vfx-anim-audio` is NOT still-unheld. The web build's own skill animdata is on disk.

The survey: *"nothing in this pass touches how a skill looks or sounds … 93_MCSCharacter_SkillsAnimationData.bin
is the likely home … and is unopened."*

It never needed the Android blob. **`reference/extracted/bindata/102_1t4629s0.bin`** — from the
**web** payload — is plain UTF-8 XML `<animdata>`, already extracted, no encryption:

- **50 named animation sets · 547 frames · 8,351 skeletal nodes**
- includes `shunpo_start` / `shunpo_end`, `cleave_start` / `cleave_end` / `cleave_pose`,
  `flurry_parta..partd` + `flurry_pose` (Thousand Stabs), `focus_start` / `focus_end`,
  `chicharge_start/end/fly`, `deathtouch_parta..partd`, `airstab_start/mid/stab/end`,
  `backthrow` + `backthrow_victim`, `bullcharge_start`, `punchlunge_start/mid/end`,
  `chargedshot_start/end`, `spartakick_start/end`, `enchantweapon`, `buffarmor_*`, `warcry_*`,
  `dash_start/end`, `backstep_start/end`, `fireball`, `frontspin`, `backspin`
- node rows carry per-part transforms: `<n i="20" x="9" y="-44" r="-54"></n>`
- diffed against the Android `93_` blob: **identical names, identical durations, identical
  547 frames / 8,351 nodes, zero web-only, zero android-only** — so the Android caveat does
  not even apply here.

And the audio half is understated too. The web bundle carries **43 distinct `Snd_*` event
names**, not one — including a per-skill one:

```
Snd_smokebomb · Snd_slash1/2/3 · Snd_deflect · Snd_punch · Snd_jump · Snd_hitMetal
Snd_bowFire · Snd_bowFireMany · Snd_mining · Snd_criticalDamage · Snd_die1/2/3 · …
```

What is genuinely still unheld is only the **waveforms** (CWS-encrypted, Stage-0b S0-5).
The event map and the animation skeletons are held, from the web build.

---

## MINOR — cite hygiene (not refutations)

1. **`kunai-chi-is-a-phantom` and `150pct-damage-is-a-food-buff` are cited Android-only for
   mechanics claims**, which the survey's own rule ("Android AS3 is not [web-true]") forbids.
   Both are true and both have web cites:
   - ammo: `§1t120s0§.as:259-270` (skills 1007/1029/1030/1031/1032, **−1** ammo of stat 2501)
     and `:503-514` (traps 1024/1025/1026/1027/1028, also −1). Two more the survey missed:
     `:316-323` skill **1051 Windmill Shuriken costs 4**, `:344-351` skill **1077 costs 8**
     (card copy 1051: *"Uses 4 kunai."*). Ammo cost is **not** a flat 1.
   - food buff: `§1t99s0§.as:209-224` — `if(hasBuff(§1t9453s0§)) this.minDamage *= 1.5;`,
     with `§1t9453s0§ = 1` at `§1t1523s0§.as:328`. Web, not Android.
2. **`ten-categories-all-named`** is web-confirmable: `§1t6474s0§.as:104` carries the identical
   `[6024,6025,…,6033]`. Category-11 membership checks out exactly (7 skills, all missing
   `<order>` and `<lvlreq>`).
3. **`stance-damage-ceiling-is-mastery-10`** cites Android `StatsManager.as:1834` for the
   mastery source; the web equivalent is `§1t1523s0§.as:2268`, args 12-14 =
   `§1t9714s0§(1000/1001/1002)`.
4. **`spd-cooldown-cap-600`** omits a step: `§1t9589s0§` (`§1t1523s0§.as:2279-2287`) multiplies
   SPD by **1.5 under BUFF_SPEED** *before* the 600 cap.
5. **`per-stance-reach-formula`** omits `§1t99s0§.as:219-223`: **BUFF_INJURED halves
   baseSlashLength** (and minDamage and defense). That same line is how I independently
   confirmed `§1t4420s0§` = `baseSlashLength` — Android `MCSPlayer.as:222` is
   `this.baseSlashLength *= 0.5;` at the identical position in the identical else-if chain.
6. **`focus-meter-numerics-web`** does not say where `slashUsage` comes from. It is a
   **per-weapon item stat**: `§1t1523s0§.as:2350-2357` reads `itemdata.slashusage` with a
   floor of 48. Per-slash meter cost is weapon-dependent — a config-shape fact for L2/L3.
   Related: the `+6` refill fires **on kill** (`§1t1543s0§.as:2047-2049`, guarded by a
   kill count > 0; Android names it `bonusReload`, `NPCManager.as:1709-1711`).
7. **`blocker1-costs-cooldowns`** is loosely worded: 101/182 `<chi>` and 84/182 `<cooldown>`
   cells are **empty**. It survives only because all 29 skills with no cooldown anywhere are
   `<passive>1</passive>` (27) or category-11 NPC-only (1500, 1501), and
   `§1t105s0§.as:300-303` returns 0 for passives. State it as "empty means passive/none",
   not "every skill has a number".
8. **`frame-crit-appears-at-exactly-full`**: my re-measure gives track 736→1540 = 805 px,
   TOP white 736→1526 = **791 px = 98.3 %**, BOT 736→1540 = 805 px = 100 %. The survey said
   789 px / 98.0 %. Threshold difference, immaterial — the conclusion stands.

---

## CONFIRMED-AND-REPRODUCED (I re-ran these end to end)

- **SPD 6-10 reconstruction.** Reproduced exactly, including the integer frame quantisation
  the survey did not spell out: `int(sec·24·mod)/24` to 2 dp gives `4.96 / 9.92 / 8.92` for
  **SPD 6,7,8,9,10** and nothing outside that band (SPD 5 → `4.96/9.96/8.96`, SPD 11 →
  `4.92/9.88/8.92`). The `toFixed(2)` display is confirmed at `XMLSkill.as:123`.
- **Byte-check.** `android 39045 / web 39003 / delta 42`; with the android read at offset 40
  the common prefix is the full **39,003** bytes. Reproduced.
- **Both A1 frames.** Cropped and upscaled myself; both render exactly what was claimed.
- **`crit == maxreload`, `1.3` flat, `+STAT_CRITICALDMG` gear-only** (`§1t1523s0§.as:296`
  `= 204`; `:2269` passes `§1t7358s0§` — findBonusStat — with no base term).
- **Stance ladder** 1014/1036/1015/1039 · 1016/1037/1017/1040 · 1018/1038/1019/1041 at
  mastery 3/4/5/10, and element gating at item 28 qty **10/10/10/30/30/60**. Exact.
- **Roll 60/80/100 %**, **chi ladder 0,2,3,5,6,7,8,10,20,50,100**, **73/73 names resolved**,
  **string 960 absent from the Android table**. All exact.
- **Stance switching is real and the key is SPACE** — `§1t1541s0§.as:605-611` calls the
  cycle `§1t99s0§.as:3058` when `§1t99s0§.as:3050` (`reload >= 48`) passes, else `Snd_error`.
  Also bound to a HUD button at `§1t113s0§.as:468-479`. Strengthens the claim.
- **`§1t12222s0§` is provably Heavy** — `§1t99s0§.as:3286-3290` returns `defense * 0.8` for it,
  and string 6002 (Heavy Stance Mastery) ends "Defense -20%". The stance-constant mapping
  the whole reach/damage argument rests on is anchored, not assumed.

---

## SCORE

86 is roughly two points generous on the evidence as filed and roughly six points **stingy**
on the evidence actually available. Netting R1+R2 against R3+R4+R5, the system is nearer
**88-90** once the animation set, the projectile tables and the web Shunpo geometry are
banked — but **not until the 192-frame correction lands**, because 120 would mistune every
crit window, every stance switch and every slash in the game.
