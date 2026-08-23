# t1-overturns-01 — LENS 3 (CONTRADICTION), blind judge s27e

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` · 7 findings · **7 judged, 0 skipped**
Result: **7 upheld (refuted=false), 0 refuted** — but three carry material corrections, and the
lens turned up **one surviving banked finding that is flatly wrong** plus five other cross-cuts.

I opened, first-hand: four 1080p stills (cropped and upscaled), one skill-card still, ten
ActionScript files across both builds, `reference/extracted/skilldata.xml`, the string index,
`REBUILD_READINESS.md`, `SHSD_MASTER_REFERENCE.md`, and `LEDGER_EVIDENCE.md`. No verdict below
rests on another agent's prose; I opened none of `critics/*.md` or `sources/*.md`.

---

## The headline: two banked findings say opposite things about the stance-switch cost

`LEDGER_EVIDENCE.md:942-945` — **`[[combat-core/the-in-combat-stance-gate-is-reload-48-of-a-192-max]]`**,
A2, **four critics, surviving** — ends:

> "So the in-combat stance switch costs **no Focus and no Chi**: it needs the reload meter at 48/192 = 25%."

Packet claim `cite-s27d/stance-switch-in-battle-costs-48-focus-flat-in-web-v0717` says it costs a flat 48.
**Both cannot be true.** I read `§1t3489s0§` end to end, `§1t99s0§.as:3083` → `:3177`:

```
3160          if(§1t1525s0§.§1t9948s0§())
3161          {
3162             this.§1t4414s0§ -= 48;
3163             if(this.§1t4414s0§ < 0)
3165                this.§1t4414s0§ = 0;
3169                §1t1525s0§.§1t9941s0§().§1t5205s0§(this.§1t4414s0§,this.§1t4415s0§);
```

**It costs 48.** The mechanism of the error is legible in the wrong finding's own cite line,
`LEDGER_EVIDENCE.md:944`: `§1t99s0§.as:249-250,:3043-3045,:3048-3051,:3058-3080`. The window stops at
**:3080** — eighty-two lines short of the debit. The charge was never in view.

Three other banked findings side with the packet: `:935` ("costing a flat 48 Focus"), `:710`
("In-battle stance switch costs a FLAT -48 in web (§1t99s0§.as:3162 … under the isBattle guard)"),
`:724` ("a flat -48 cost"). **`:943` is the wrong one.** This is not cosmetic: its lane_impact at `:945`
is a ship instruction ("replace the Focus gate with RELOAD_STANCE_THRESHOLD=48 on a RELOAD_MAX=192
meter"), which combined with "costs no Focus" builds a meter that is drained by slashing but never by
switching — and so can never produce the on-screen state the film shows.

**Build parity checked first (§3(c)):** this is *not* a web/android false contradiction. Both findings
describe the WEB build, both cite the same web file, and the android twin diverges separately —
`MCSPlayer.as:3096 'if(StageManager.isBattle())'` then `:3098-3105` collapses `reload > maxreload/2` to
`maxreload/3`, else `-= maxreload/6`, with an entry gate at `:2977` of `maxreload/6`. Different rule,
correctly labelled on both sides of the packet claim.

---

## The second contradiction: "crit meter" vs "evade gate" — both were right

- `LEDGER_EVIDENCE.md:713` **`[[combat-core/crit-meter-exists-in-web-build]]`** [A1, **8 critics**]: the third bar
  IS the crit meter, "CRITICAL HIT" printed at full.
- `LEDGER_EVIDENCE.md:726` **`[[frames/critical-evade-states-the-focus-gate]]`** [A1, 2 critics]: a full Focus bar
  is "an evade gate, **not** a crit meter".

Ten critics between them and nobody put them side by side. Packet claim `NF-S27D-4` resolves it, and I
verified the resolution myself. **The web code carries both, on the same predicate `reload == maxreload`:**

- crit — `§1t99s0§.as:3272` `if(this.§1t4414s0§ == this.§1t4415s0§)` → `:3274` `return _loc2_ * 1.3 + this.§1t1243s0§;`
- evade — `§1t99s0§.as:3383` `if(this.§1t4465s0§() && this.§1t4414s0§ == this.§1t4415s0§ && (this.stance == §1t12220s0§ && this.§1t4491s0§(§1t120s0§.§1t10173s0§) > 0 || …))` → `:3385` `§1t3246s0§ = 12;` `:3386` `Snd_jump` `:3387` `return true;`

That `return true` means *evaded*, not *hit*: the branch immediately above it, `:3376-3381`, is a plain
random dodge roll (`if(int(Math.random() * 100) < _loc16_)`) with a byte-for-byte identical body, and the
damage block only opens at `:3389`. `§1t4491s0§` (`:4673-4676`) routes through `§1t1523s0§.as:4622-4628`, the
skill branch for ids 1000-1999 — so `> 0` really is "the player owns this skill". `§1t120s0§.as:108/110/112`
give the three ids: **1074 / 1075 / 1076**, one per core stance.

And the card says so in the game's own words. `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg`,
crop (20,190)-(400,400) at 5× LANCZOS:

> **(PASSIVE SKILL) / ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL. / NEXT LEVEL (LEVEL 1)**

"while slashing" is `§1t4465s0§` (`:2963-2966`, `return actionState == §1t11149s0§`). "in **this** stance" is the
three-way branch. **Strike only the "not a crit meter" clause of `:726`** — the rest of it is correct.

---

## The frames: I looked, and the frame wins

All four crops opened at the stated geometry, from 1920×1080 sources.

| frame | crop | what is visibly there |
|---|---|---|
| `duel_dense/Nr4fQstqHDM_429.0.png` | (0,920)-(620,1080) 3× | HP 20/20 green · Chi 26/26 blue · third bar **EMPTY brown track** with **"CANNOT CHANGE STANCE"** in grey across it · yellow "150% DAMAGE" below |
| `combat_frames/Nr4fQstqHDM_t0430s.png` | (150,930)-(620,1080) 3× | HP 20/20 · Chi 26/26 · **thin white sliver** at the left of the third bar · **no caption** |
| `combat_frames/Nr4fQstqHDM_t0435s.png` | (150,930)-(620,1080) 3× | HP 19/20 · Chi 26/26 · third bar **~42% white** · **no caption** · screen flashed red |
| `combat_frames/Nr4fQstqHDM_t0425s.png` | (150,930)-(620,1080) 3× | **NO third bar at all** — the slot prints **"HEAVY STANCE"** · no buff banner |

That sequence *is* `§1t113s0§.as:326-361` executing:

```
328    var _loc3_:Number = (param1 - 48) / (param2 - 48);
336    if(_loc3_ == 0)                → show §1t5204s0§ = #BBBBBB getString(960)
344    else if(_loc3_ > 0 && _loc3_ < 1) → HIDE the label
348    else if(_loc3_ >= 1)           → §1t5203s0§ = getString(175) = "Critical Hit" + Snd_criticalDamage
```

`getString(175)` resolves in `strings.json` to **"Critical Hit"**; `960` is absent from the v0.682 table
(no ids at all in 940-980), which is why the label was never sourced — the **frame** supplies it.

A caption that is on at 429 s and gone at 430 s inside one fight cannot be "appears the instant a fight
starts". **REBUILD_READINESS.md:158** and its two `[CONTRACT]` mirrors fall — I read them:

- `SHSD_MASTER_REFERENCE.md:388` — `| **In combat** | **Hard lock** — "CANNOT CHANGE STANCE" appears the instant a fight starts | [CONTRACT] |`
- `SHSD_MASTER_REFERENCE.md:2099` — `| In-combat stance switching: Focus-gated vs hard-lock | Original **hard-locks** …; recreation implements Focus-gated switching as an inferred design decision | [CONTRACT/CONTRADICTION] |`

**THE FRAME WINS, and it wins against a measurement doc that was graded CONTRACT twice.**

---

## Corrections carried against the packet

**1. `NF-S27D-3` — "out-of-combat stance change free and *unrestricted*" is wrong on the last word.**
The 48 *debit* is battle-gated. The *entry gate* is not: `§1t4470s0§` (`:3050`) is
`return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` and `§1t4472s0§` opens (`:3060`)
`if(this.§1t4414s0§ < 48) { return; }` — neither inside `§1t9948s0§()`. The caller that reaches them outside a
fight is the **global** key handler `§1t1541s0§.as:605-615` (SPACE → `§1t4470s0§` → `§1t4472s0§`, `Snd_smallClick`
on pass / `Snd_error` on refusal), *not* the battle-only BattleUI button at `§1t113s0§.as:468-480`.
Correct rule: **canSwitch = actionState-whitelist && focus ≥ 48 always; cost 48 only in battle.**

Everything else in that claim is exact. I re-ran its enumeration: `grep -n '§1t4414s0§'` over `§1t99s0§.as`
returns precisely `93 250 256 1203 1205 1208 3050 3060 3162 3163 3165 3169 3272 3295 3297 3302 3306 3310
3312 3314 3320 3321 3323 3325 3383 3707 4890 4897` — the claimed list, complete, and `:3162` is the sole
stance-switch debit and the sole one under the battle guard. Its one other slip: "'RR:159' returns zero
hits" is false; it returns 1, at `LEDGER_EVIDENCE.md:1510`, which is itself a mis-cite (blocker ⑤ lives at
`REBUILD_READINESS.md:195`, not `:159`).

**2. `cite-s27d/dan-titles` — the MAX_DAN_RANK clause is wrong and must be struck.**
The primary claim is verified line-for-line: `§1t5957s0§.as:3061-3103` and android `InventoryUI.as:2274-2315`
both render dan 0 → `""` and dan 1..9 → `getString(456)`..`getString(464)`, with a shogo overlay in `#7D5500`
(465 Renshi at 3-5, 466 Kyoshi at 6-7, 467 Hanshi at 8/9/default). `grep -rn "getString(455)"` over the
**whole** `reference/decompiled/` tree returns **zero hits** — `(初段)` is in the table and never fetched.
Nine displayed titles over ten dan states. That settles the tension with `LEDGER_EVIDENCE.md:1204` (4 critics)
and `:1900` (2 critics), which say "ten titles, ids 455-464": true of the **string table**, false of the
**displayed ladder**.

But its lane_impact — "the `< 9` cap means MAX_DAN_RANK is **9 rebirths, not 10**" — collides with a
five-finding cluster topped by `[[rebirth/tenth-gold-is-100]]` at **nine critics**, and the packet is the
wrong side. Displayed rank = STAT_DAN + 1: `§1t1523s0§.as:2659` announces `(§1t7356s0§(§1t9426s0§) + 1).toString()`
and `§1t5957s0§.as:3098` prints `(十段)` — *tenth* dan — at STAT_DAN 9. **MAX_DAN_RANK = 10 stands.**
In the claim's favour: its android-only cap cite (`StatsManager.as:2209`) looked like a C2 hole and is not —
the web carries the identical guard at `§1t1523s0§.as:2653`. Add the web cite and the caveat discharges.

**3. `cite-s27d/crit-proc` — minor: `:3295-3297` fires on the *same* swing, not the next.**
`§1t4478s0§` is charged at slash resolution (`LEDGER_EVIDENCE.md:1590` banks "deductReloadBar() is charged in
the same call"). "A full bar buys exactly one crit" is unaffected. Its live conflict is with `:1510`'s residual
"the crit PROC rule … is still open — `:3272` tests an equality between two obfuscated members": the android
twin *names* those members (`MCSPlayer.as:3215 'if(this.reload == this.maxreload)'`), so that clause is dead.

**4. `cite-s27d/focus-fill` — minor: the skill is shipped as "Focus", not "Replenish Focus".**
`resolved_names.json` skilldata `1005` → displayname **"Focus"**, desc *"Instantly recharges your focus bar."*
"Replenish Focus" is the ledger's own name at `REBUILD_READINESS.md:194`. Note the shipped description
**overstates**: `§1t120s0§.as:231` sets `reload = maxreload - 1`, one short of the crit.

---

## What I compared each finding against (an empty result is only credible if this list is full)

Searched by **artifact**, not by words: `4414s0`, `4415s0`, `3383`, `10173`, `4491s0`, `bonusReload`,
`maxreload - 1`, `SKILL_FOCUS`, `combat_frames`, `t0435`/`t435`, `HEAVY STANCE`, `CANNOT CHANGE STANCE`,
`getString(45x)`/`(46x)`, `Renshi`/`Kyoshi`/`Hanshi`, `MAX_DAN`, `1.3`, `evade`/`evasion`/`dodge`, `RR:159`,
`overworld` — across all 3,688 lines of `LEDGER_EVIDENCE.md`.

Live neighbours found and settled: `:610`, `:622`, `:710`, `:713`, `:721-724`, `:726`, `:935`, `:942-945`,
`:947`, `:1204`, `:1506`, `:1510`, `:1590`, `:1883`, `:1896`, `:1900`, `:1984`, `:1993`, `:2029-2030`,
`:3352`, `:3451`, `:3626`, `:3644`, plus the rebirth cluster `:697 :701 :998 :1012 :1898`.

Confirmed **zero** hits (so the novelty claims that rest on them hold): `3383`, `10173`, `4491s0`,
`HEAVY STANCE`.

Duplicates, not rivals — worth saying plainly so the rewrite does not double-count:
`cite-s27d/focus-fill` restates `:710` + `:610` + `:3626`; `cite-s27d/crit-proc` restates `:1984` + `:1506`
+ `:398-421`; `cite-s27d/stance-switch-48` restates `:710` + `:935` + `:724` — its value is not the number,
it is that it **breaks the tie against `:943`**.

---

## Six new findings (in the structured file)

1. **NF-L3-1** — `LEDGER_EVIDENCE.md:943`'s "costs no Focus and no Chi" is false; its cite window ends 82 lines short of the debit. *A2, web v0.717.*
2. **NF-L3-2** — the out-of-combat switch is free but **not ungated**; the ≥48 gate has no battle predicate and the SPACE handler is global. *A2, web v0.717.*
3. **NF-L3-3** — MAX_DAN_RANK is **10 displayed** (STAT_DAN + 1); and the web carries the same `< 9` cap, so that row's C2 caveat discharges. *A2, both.*
4. **NF-L3-4** — `LEDGER_EVIDENCE.md:3644`'s "below a sixth of max" is the **android** rule (`maxreload/6` of 120) inside a **web** HUD description; web is 48 of 192, a **quarter**. Build-unlabelled ⇒ the defective side under §3(c). *A2.*
5. **NF-L3-5** — `combat_frames/Nr4fQstqHDM_t0435s.png` and `duel_frames/Nr4fQstqHDM_t435.0s.png` are **byte-identical** (md5 `5f55476bd80d4b448a26fae015b93b42`). Path-based frame-novelty tests are unsound; hash instead. *A3.*
6. **NF-L3-6** — skill ids **1074/1075/1076** (the evade passives) do **not** exist in `reference/extracted/skilldata.xml` (ids stop at 1073). Per C2 that file is android v0.682 — a second, independent instance of the S0-3 parity hole, in the **skill** table this time. Their costs/cooldowns are unrecoverable from it. *A2.*
