# GAUNTLET L0 — CRITIC (LENS 3: PRECEDENCE / STALE-CLAIMING) — unit: **skills-meters**

Reviewer: blind critic. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened this pass. Frames were cropped and upscaled before grading (crops stated).

**Headline: 21 of 22 claims survive. ONE is REFUTED, and it is a load-bearing constant.**

> `skills-meters/focus-meter-numerics-web` says the reload/Focus meter's max is **120 frames (5 s)**
> and cites `§1t99s0§.as:55`. **The max is 192 frames (8 s)**, assigned at `§1t99s0§.as:249`.
> Line 55 holds a *different* variable. The surveyor picked up the wrong `5 * 24`.

Everything else in this survey stood up to first-hand re-checking, including all four of its
cross-build precedence catches (crit 1.3 not 1.5/1.2 · SPD cap 600 not 300 · web focus constants
not Android's · skilldata byte-identical). That is a genuinely strong precedence record; this lane
usually finds the opposite.

---

## THE REFUTATION — maxreload is 192, not 120, and `:55` is the wrong line

`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`, inside the player/actor init
`§1t4443s0§` (declared `:183`):

```
248:         this.§1t3269s0§(§1t11141s0§);
249:         this.§1t4415s0§ = 8 * 24;
250:         this.§1t4414s0§ = 0;
```

`§1t4415s0§` is maxreload — it is the `param2` fed to `BattleUI.§1t5205s0§(reload, maxreload)`
(`:256`, `:3169`, `:3325`) and the right-hand side of the crit equality at `:3272`, `:3295`.

Every assignment of it in the whole web bundle:

```
$ grep -n "§1t4415s0§" '…/shs3_payload/scripts/§1t99s0§.as'
95:      internal var §1t4415s0§:int;
249:         this.§1t4415s0§ = 8 * 24;      <-- the ONLY assignment
```

What is at line 55 is a **different variable**:

```
55:      internal static var §1t12234s0§:int = 5 * 24;
```

and its only consumer is `§1t4440s0§`, a per-frame countdown unrelated to the meter:

```
147:      internal var §1t4440s0§:int = 0;
266:            this.§1t4440s0§ = §1t12234s0§;      (inside §1t4444s0§)
1244:         if(this.§1t4440s0§ > 0)
1246:            --this.§1t4440s0§;
```

**Consequences the survey's lane_impact gets backwards:**

| quantity | survey | truth (web v0.717) |
|---|---|---|
| meter max | 120 frames / 5 s | **192 frames / 8 s** |
| usable range above the 48 dead zone | 72 frames | **144 frames / 6 s** |
| a stance switch (48) costs | "two-thirds of it" | **one-third of it** |
| 0 → crit-ready | 5 s | **8 s** |

The dead zone (48), the switch charge (48), the per-stance slash cost (`slashUsage` ×0.5/×1.0/×1.5)
and the +6 bonus refill are all **correct** — I re-read `:326-333`, `:3160-3166`, `:3299-3311`,
`:3318-3324` and they match the survey verbatim. So the meter *model* is recovered; the meter's
*size* is not. A coder implementing this claim as written would run the game's entire crit tempo
60 % fast and price stance-switching at double.

**Ledger blocker ③ is "max / fill / switch-cost". Switch-cost: closed. Max: closed only after this
correction. Fill: the survey never states it.** The fill rate is `+1 per frame` —
`§1t99s0§.as:1203-1205`:

```
1203:         if(this.§1t4414s0§ < this.§1t4415s0§)
1204:         {
1205:            ++this.§1t4414s0§;
```

Also worth banking: `§1t4419s0§` (= `48 + SPD*6`, passed in as param7 from `§1t4906s0§.as:53`) is
**assigned and never read** anywhere in `§1t99s0§.as` — dead code in the web build. Anyone who
assumes it is the fill rate will be wrong twice.

---

## WHAT I RE-OPENED AND WHAT HELD

### The four cross-build precedence catches — all confirmed, all correctly ordered

- **crit 1.3 (web) vs 1.5 Light / 1.2 other (Android).** Web `§1t99s0§.as:3272-3276` reads exactly
  as quoted; Android `MCSPlayer.as:3215-3221` reads
  `if(reload==maxreload){ if(stance!=LIGHT_STANCE) return maxDamage*1.2+STAT_CRITICALDMG; return maxDamage*1.5+STAT_CRITICALDMG; }`.
  The stance coefficients diverge too (Android Light `0.5+0.5*M*0.01`, Heavy `1.5`; web
  `0.5+0.4*M*0.1`, Heavy `1.4`). The survey has the web/Android direction right. **The ledger's
  `CRIT_MULT=1.3` is vindicated; the previous L0 survey's 1.5/1.2 was an Android import.**
- **SPD→cooldown cap 600 (web) vs 300 (Android).** Web `§1t1523s0§.as:2289-2296` verbatim as quoted;
  Android `StatsManager.as:1856-1860` is the 300 version. Correctly superseded.
- **Focus constants are web-read, not Android-read.** Confirmed — `(r-48)/(max-48)` and the flat 48
  switch charge exist in `§1t113s0§.as` / `§1t99s0§.as` as claimed.
- **skilldata byte-identity.** I re-ran the byte diff myself:
  `android len 39045 · web len 39003 · delta 42 · common prefix after the 40-byte decl = 39003 bytes ·
  android tail b'…</skilldata>\r\n' · web tail b'…</skilldata>'`. **A3 HELD.** The rule the survey
  derives — *Android XML is web-true, Android AS3 is not* — is sound and is the single most useful
  thing in this file for other lanes.

### Frames — I opened both, cropped, upscaled, and measured

- `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780 montage), crops
  `(640,0)-(1800,390)` and `(640,390)-(1800,780)`, 2× Lanczos. Visible: top = green `11/20`,
  blue `47/47`, a plain white third bar **with no text**, yellow `150% DAMAGE`; bottom = identical
  bars, third bar now carrying **black `CRITICAL HIT`**. My own pixel scan of the *original*:
  blue track `x736→1540 = 805 px`; top white `x737→1525 = 789 px` (**98.0 %**); bottom white
  `x736/737→1540 = 804 px` (**99.9 % ≈ 100 %**). The survey's measurement reproduces exactly.
- `reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png` (1920×1080), crop `(60,880)-(1020,1080)`,
  3× Lanczos. Visible: red portrait ring, green `20/20`, blue `26/26`, an **empty brown third bar
  carrying light-grey `CANNOT CHANGE STANCE`**, yellow `150% DAMAGE` beneath. `§1t113s0§.as:110-111`
  reads exactly as quoted (`getString(175)` black / `getString(960)` `#BBBBBB`), and `960` is
  genuinely **absent** from `docs/gauntlet/L0/index/strings.json` — the Android-table caveat is real.
  The frame renders ALL CAPS where table row 175 is `Critical Hit`: **the frame wins, ship the caps.**

### The in-combat stance question — the survey is right, and there is a much better cite

The survey overturns ledger §3 item 4 ("in-combat stance is HARD-LOCKED") from the three-state
caption plus "a hard lock would have nothing to charge". That inference is sound but soft. The hard
evidence is in the stance-cycle function itself, `§1t99s0§.as:3058-3061`:

```
3058:      public function §1t4472s0§() : *
3059:      {
3060:         if(this.§1t4414s0§ < 48)
3061:         {
3062:            return;
```

…which then cycles Light→Balanced→Heavy→Light, and a companion predicate at `:3049-3051`:

```
3049:      public function §1t4470s0§() : Boolean
3050:      {
3051:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
```

`§1t4469s0§` is "actor is in an idle/move/interruptible state". And the 48-frame charge in
`setStance` sits inside `if(§1t1525s0§.§1t9948s0§())`, where `§1t9948s0§()` is
`actionState == §1t9903s0§` (`§1t1525s0§.as:1152-1155`) — the state entered one second into a
battle (`§1t1525s0§.as:985-988`). So the switch is **combat-scoped, Focus-gated at 48, and charged
48**. Ledger §3 item 4 is dead. The recreation's Focus-gated in-combat switch is **faithful** and
should come off the labelled-deviation list.

### Data cites — all line numbers exact

I re-printed `skilldata.xml` at every cited range: `500-513` (1010 Smoke Bomb, chi 5 / cd 6),
`345-358` (1007 Throw Kunai, `<chi></chi>`, cd 2), `889-902` (1024 Lay Trap, `<chi></chi>`, cd 5),
`292-311` (Focus cd 10/9/8 — three levels, ledger truncated to two), `1290-1308` (Chi Punch cd 5×3),
`721-727` (1018 Stab: `<passive>1</passive>`, `req has 1002 qty 3`, category 3),
`1234-1246` (1039 Shunpo: `req has 1000 qty 10`, chi 50, cd 60, no `<lvlreq>`),
`1638-1649` (1055, lvlreq 80, chi 100, cd 30). **Every one matches verbatim.**
Totals I re-derived: **75 `<skill>`, 182 `<level>`, 135 non-blank level `<desc>`, 47 blank** —
the survey's counts exactly. Chi domain re-derived: `{0,2,3,5,6,7,8,10,20,50,100}` + empty; the
ledger's "single-digit" line is genuinely wrong.

I re-checked the string joins: `7064/7065/7066` = `10/20/30 damage`, `7072/7074` = `Steal 20/50 chi`,
`7075` = `20 damage/sec, max 200 damage`, `7078` = `500 damage, 5 sec delay`,
`7004` = `60% chance to dodge enemy attacks when rolling`, `7013` = `8 skill slots`,
`6047` = the Stab card, `175` = `Critical Hit`, `4132` = the Potato Dog copy.
`resolved_names.json → skilldata.xml` really is `{"misses": 0, "rows_resolved": 73}`.

### The two Android-only cites that the web bundle happens to confirm

The survey's own rule is "Android AS3 is not web-true", yet four claims are cited to Android AS3
where the web file exists. I checked each; **all four are true in the web build too**, so none is
refuted — but the cites should be re-pointed:

| claim | Android cite used | web cite that settles it |
|---|---|---|
| kunai burns stat 2501, not chi | `SkillManager.as:252-259` | `§1t120s0§.as:266-270` |
| ten skill categories 6024-6033 | `SkillScreenUI.as:84,103-104` | `§1t6474s0§.as:104` (same 10-id array) |
| passives can't be equipped / chi empty = 0 | `XMLSkill.as:268-277,345-348` | `§1t105s0§.as:276-284` |
| `150% DAMAGE` = BUFF_ATTACK, minDamage ×1.5, mutually exclusive | `OverworldHUD.as:1402-1404`, `MCSPlayer.as:210-223` | `§1t99s0§.as:209-222` (`minDamage *= 1.5` / `defense *= 1.5` / halving debuff, an else-if chain) |

One real precedence wrinkle inside that last row: the web build does **not** hard-code the words —
it calls `getString(11120)` (`§1t113s0§.as:1276-1278`), and `11119`–`11122` are **all missing from
the recovered Android string table**. So the exact wording `150% DAMAGE` is held by **the frame
alone**, not by the Android literal the survey cited. The frame does show it, so the claim stands —
by A1, not by A2.

---

## WHAT THE SURVEY MISSED (new findings)

1. **maxreload = 192 and fill = +1/frame** — see the refutation above. This is what actually closes
   ledger blocker ③.
2. **The ledger's reach triple `300/200/100` is a MASTERY-0 read, not a "mastery-9 ceiling".**
   The survey corrects the *damage* half of §3 item 3 to mastery-10 and leaves the *reach* half of
   the same sentence standing — but its own reconciliation ("1.4×210 = 294 / 210 / 105") uses
   Balanced ×1.0 and Heavy ×0.5, i.e. **mastery 0**. At mastery 10 the triple is ~294/252/189.
   So §3 item 3 is half-right and half-backwards: damage 0.9/1.2/1.4 is a ceiling (at M=10),
   reach 300/200/100 is a floor (at M=0). Nobody has said this out loud yet.
3. **The SPD fed to both formulas is buffable.** `§1t1523s0§.as:2279-2286` (cooldown) and
   `:2334-2341` (base slash length) both compute
   `SPD = getStat(9410) + bonus(9410)`, then `if(hasBuff(9455)) SPD *= 1.5`. Both of the survey's
   formulas omit the ×1.5 speed-buff term.
4. **Elemental kunai ammo costs 1 / 4 / 8.** `§1t120s0§.as:266` (`-1`), `:319` (`< 4` / `-4`),
   `:347` (`< 8` / `-8`). Three of the "elemental" numbers the survey files under STILL_UNHELD are
   already on disk in the *web* bundle.
5. **DAN caps at 9 internally (displayed 10), and the 100-gold rebirth tier is REAL.**
   `§1t1523s0§.as:2644-2655`: `if(getStat(9426)==8){ addStat(9413,100); … "10" } else { addStat(9413,25) }`
   then `if(getStat(9426) < 9) addStat(9426,1)`. Stat 25 is dan (`§1t1832s0§.as:2787`
   `data.dan = getStat(9426)`). This **overturns ledger §3 item 7**, which says "film shows a flat
   +25 gold every rebirth, **no 10th-rebirth tier**" and demotes `tenthGold=100` to INFERRED.
   Cross-lane to rebirth-elements — not this unit's claim, but found from this unit's evidence.
6. **Precision on "every cost and cooldown is on disk":** 101 of 182 `<chi>` cells and 84 of 182
   `<cooldown>` cells are literally empty. That is still fine — every empty-cooldown row belongs to a
   `<passive>1</passive>` skill (which `§1t105s0§.as:297-302` short-circuits to 0) except two
   NPC-only rows, ids **1500 and 1501**. Worth stating so a transcription script doesn't treat 84
   blanks as data loss.
7. **Passive skills return cooldown 0 by code, before the SPD modifier** (`§1t105s0§.as:299-303`),
   and `getCooldown` returns an **int** (`_loc2_:int = cooldown * 24`, then `* modifier`), which is
   why the ledger's 4.96/9.92/8.92 reproduce with truncation. I re-derived the reader's SPD band
   independently and get **exactly 6–10**, matching the survey.

---

## VERDICT TABLE

| claim | refuted | severity |
|---|---|---|
| `focus-meter-numerics-web` | **YES** | fatal |
| all other 21 claims | no | — (4 carry minor cite-hygiene notes) |

Score comment: 86 is defensible on volume of held evidence, but blocker ③ is not closed as claimed.
With the max/fill correction folded in it genuinely is. I would not move the number.
