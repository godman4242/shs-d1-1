# t1-overturns-01 — BLIND CRITIC, HUNTER LENS (s27b)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **7 findings, 7 judged, 0 skipped.**
Verdict: **0 refuted, 7 upheld, 7 overturns upheld.** Plus **6 new findings** nobody has claimed.

I did not open any file under `docs/gauntlet/L0/critics/` or `docs/gauntlet/L0/sources/`.

---

## Headline

This is an unusually clean packet. All seven findings are A2 claims resting on decompiled
ActionScript with explicit line numbers, and every line number I checked resolved to exactly
the text quoted. That is rare, and it is why nothing was refuted.

The important work this review adds is **not** the seven verdicts. It is what I found while
verifying finding #1 and #2 — the ledger's own primary evidence for the in-combat stance
lock, when actually opened and cropped, **argues the opposite way**, and the third HUD bar
it sits on turns out to specify the entire Focus system that three separate ledger blockers
say is missing.

---

## 1 & 2 — the stance lock. RR:158 falls, and it falls on a FRAME.

The finding pair claims that `§1t99s0§.as:3058-3081` is a live stance cycler gated on
`reload >= 48`, called from the battle HUD button and from SPACE. Verified:

- `§1t99s0§.as:3048` `public function §1t4470s0§() : Boolean` → `:3050`
  `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;`
- `§1t99s0§.as:3058` `public function §1t4472s0§() : *` → `:3060` `if(this.§1t4414s0§ < 48)` → `return;`
- Cycle order confirmed against the android twin: `MCSPlayer.as:27,29,31` name 0/1/2
  `LIGHT_STANCE / BALANCED_STANCE / HEAVY_STANCE`; web `§1t99s0§.as:27,29,31` are the same 0/1/2.
- `grep §1t4472s0§` over the whole payload returns exactly two callers, both in-combat:
  `§1t113s0§.as:470,473` (battle HUD button, `Snd_smallClick` / `Snd_error`) and
  `§1t1541s0§.as:607,609` (`case Keyboard.SPACE`).
- `GameEngine.as:584` really does read
  `str = "Tip: In battle, you can use spacebar to change stance.";`

**Then I went after the ledger's evidence rather than the claim's.** RR:178 is Kheshav's own
LOOK verdict recording `"CANNOT CHANGE STANCE"` on screen in `duel_dense/Nr4fQstqHDM_428.0`.
I opened that frame (crop `x40-760, y920-1080`, 2× LANCZOS): the label is not floating text,
it sits **inside a third meter track** directly under the green 20/20 HP bar and the blue
26/26 bar, and that track is **empty**.

`§1t113s0§.as:326-359` is that bar's updater:

```
:328   var _loc3_:Number = (param1 - 48) / (param2 - 48);   // clamped to 0
:333   this.§1t5182s0§.bar.scaleX = _loc3_;
:336   if(_loc3_ == 0)          -> show grey  getString(960)
:344   else if(0 < _loc3_ < 1)  -> HIDE the label
:348   else if(_loc3_ >= 1)     -> show black getString(175) "Critical Hit" + Snd_criticalDamage
```

`getString(960)` has **no entry** in the v0.682 string table — it is a web-only string.
So the prediction is: same fight, more Focus, label gone.

`reference/frames/duel_frames/Nr4fQstqHDM_t435.0s.png` — same fighter, same run, seven
seconds later, HP 19/20 — shows that third bar **~40% filled white with no stance text on it
at all.**

**The frame and the code agree.** There is no frame-vs-doc conflict to adjudicate here; what
fails is the *inference* RR:158 drew from the frame. "CANNOT CHANGE STANCE" is the Focus
meter's zero-fill readout, shown exactly while `reload <= 48` — the same 48 the cycler gates
on — and the footage itself shows it clearing mid-combat.

Calibration note on finding #2: its **headline** artifact (`GameEngine.as:584`) is v0.682, and
under S0-3 an android UI string cannot by itself settle web v0.717 behaviour. It survives
because the *second half* of its own cite — the web SPACE handler and the web gate — is
genuine web source. Marked `minor` for that reason, not refuted.

---

## 3 — `deathnohead`. citeLint's QUOTE_UNVERIFIED was a false alarm.

The linter could not locate the quote because it spans a CRLF binary blob. My own decode of
`reference/extracted/bindata/108_1t4635s0.bin` finds at byte 434948, character for character:

```
<anim i="deathnohead" d="31">\r\n<f i="0">\r\n<n i="16" x="-18" y="-88" r="-83"></n>\r\n<n i="20" x="-18" y="-61" r="-104"></n>
```

Measured: 158 `<anim>` roots (matches S0-4), 31 `<f>` and 399 `<n>` inside `deathnohead`,
death family = death / deathenemy / deathnohand / deathnohead / deathwitharrow / deathbyarrow
/ deathdowned / deathinhalf. md5 `bcfd658e79fafb41f52431afb7d10622` — identical to
`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin`.

**This is not the circular C2 diff.** `108_1t4635s0.bin` carries the *obfuscated web symbol
name* and is indexed as a web bindata file, so md5 equality here is real cross-build parity,
not a file compared with itself.

Residual defect (minor): "each carrying about seventeen node records" is true for frames 0–22;
frames 23–30 carry **one** node each, always node 16. "Nothing left to catalogue" is a touch
hot — the bone track is complete, the node-index→limb-sprite mapping is not in this blob.

---

## 4 — tenthGold. RR:164-165 falls whole.

`§1t1523s0§.as:2638` opens the rebirth routine; `:2644` `if(§1t7356s0§(§1t9426s0§) == 8)`,
`:2646` `§1t9713s0§(§1t9413s0§,100);`, `:2651` `…,25);`, `:2653` `if(… < 9)`. I resolved the
ids rather than trusting them: `§1t1523s0§.as:228` `§1t9413s0§:int = 12` and `:254`
`§1t9426s0§:int = 25`, against `StatsManager.as:194 STAT_HGOLD:int = 12` and
`:220 STAT_DAN:int = 25`. Android's twin `doRebirth` at `:2195` pays 20/5 — so 25/100 is
specifically a v0.717 datum.

Minor defect, in the lane_impact rather than the overturn: the dan titles are strings
**455–464**, not 456–464. `455` is `(初段)`. A rewrite that copies "456-464" ships a
nine-rung ladder.

---

## 5 — the 271 cap. RR:201 falls, but keep its parenthetical.

`§1t5957s0§.as:3340-3346` is verbatim as quoted. I resolved all six stat ids myself from
`§1t1523s0§.as:206-234` (`§1t9403s0§=1, §1t9406s0§=4, §1t9408s0§=6, §1t9409s0§=7,
§1t9410s0§=8, §1t9411s0§=10, §1t9415s0§=14`) against `StatsManager.as:170-200` — MAXHP /
MAXCHI / ATTACK / DEFENSE / SPEED / LEVEL / MAXAP, one-for-one with
`InventoryUI.as:2407-2412` in the same order. Android's coefficients give **90**, not 271.

**Hunter note.** The finding says the ledger "is answering a question the code never asked."
Half true. `gear/rebirth-inclusive` is false — 271 is a pure level function on the base stat.
But `(237-point first-run budget makes it impossible in one stat)` is **still true and still
useful**: `StatsManager.as:2156` accrues skill points as `level-1 + DAN*(levelCap-1)`, so
reaching 271 genuinely requires rebirths. The rewrite should replace the causal story and
**keep** the parenthetical.

---

## 6 — the 19-field save schema. Correctly calibrated by its own author.

Counted both sides myself. Web `§1t1832s0§.as:2811` … `:2814` clears `saved`, `:2815-2833`
clear exactly **nineteen** named fields, flush `:2836`. Android
`QueryManagerBase.as:2936` … `:2940` `saved`, `:2941-2959` exactly nineteen, flush `:2960`.
Seven unobfuscated anchors land in identical slots — playerLevel 4, equipment 6, inventory 9,
stash 10, playerlocation/taunt/friends 17–19. With seven anchors in a nineteen-slot ordered
list the alignment is forced.

Two calibrations. (i) The finding's prose says "four of which survived obfuscation … then
playerlocation, taunt, friends as the last three" — that is seven anchors described as four.
Sloppy, not wrong. (ii) The finding **refuses to inflate**, saying only the save-format half
of RR:351 falls and the server-sim-topology half stands. Agreed, and I would add one guardrail:
the **nineteen-slot schema** is web-verified; the **twelve obfuscated field names** are v0.682
labels inferred by position — transcribable-with-a-label, not web-attested identifiers.

---

## 7 — crit 1.3, deterministic. Both RR:190(2) and RR:195(5) close.

`§1t99s0§.as:3255` opens `§1t4475s0§():int`; `:3258` is the only `Math.random` in the
function; `:3272` `if(this.§1t4414s0§ == this.§1t4415s0§)`; `:3274`
`return _loc2_ * 1.3 + this.§1t1243s0§;`. The android twin `MCSPlayer.as:3198-3224` is the
same function with readable names, which is what fixes `§1t4414s0§=reload`,
`§1t4415s0§=maxreload`, `§1t1243s0§=STAT_CRITICALDMG` without guessing.

I added the check the finding did not make: `§1t99s0§.as:3293-3298` **zeroes the meter the
instant a full-meter slash lands**, so the crit cannot re-trigger next swing. There is no
hidden roll in the consume path either. "Deterministic" is safe.

---

## NEW FINDINGS (6) — see the JSON for full cites

1. **`CANNOT CHANGE STANCE` is the Focus bar's low-end label** and the footage shows it
   clearing. A1 + A2. Overturns RR:158 *and* the corresponding clause of RR:178.
2. **The whole Focus contract is recovered.** `maxreload = 48 + (SPD+gear)*6`
   (`§1t1523s0§.as:2276`); regen `+6` clamped (`§1t99s0§.as:3318-3326`); spend =
   `slashUsage × {0.5, 1, 1.5}` by stance with the full meter zeroed first
   (`§1t99s0§.as:3293-3316`). Closes RR:195(3) *and* RR:190(5). Stance switch costs **nothing**
   — it only requires ≥ 48.
3. **The reach cap in stage px — "the one value the whole model needs" — is in the payload.**
   `slashLength = baseSlashLength × {1.4 Light, 1+0.02m Balanced, max(100, 0.5+0.04m) Heavy}`
   (`§1t99s0§.as:3094, :3105, :3116-3119`), `baseSlashLength = 120 + floor((90+DAN*5)·SPD/(20+SPD))`
   (`§1t1523s0§.as:2346-2347`), and it is spent as a **blade-path length budget**
   (`InputManager.as:51 maxDistance:int = 200`, `:198`, `:360`). RR:190(1)'s "measure it from
   footage" instruction should be struck. It also re-reads the ledger's 300/200/100 row:
   those are Light-at-max, Balanced-at-base, and the Heavy **floor** of 100.
4. **The mastery curve is linear** — `§1t99s0§.as:3262,3265,3270`: Light `0.5+0.04m`,
   Balanced `1+0.02m`, Heavy flat `1.4`. At m=0 that is exactly the ledger's level-1 row
   (0.5/1.0/1.4); at m=10 exactly its ceiling row (0.9/1.2/1.4). **Confirms** RR:161-163 item 3
   and removes its fork — model the curve, don't flag a mastery-9 target.
5. **SPD→cooldown is a web formula and diverges.** `§1t1523s0§.as:2289-2296`:
   `1 - min(SPD,600)/600 × 0.5`. Android caps at **300** (`StatsManager.as:1854-1860`).
   Closes RR:195(4) and the cooldown half of RR:200(1).
6. **Dan rank is mechanical, not cosmetic** — `§1t1523s0§.as:2346` makes the reach asymptote
   `90 + DAN*5`, so every rebirth is a permanent **+5 px** of blade path. Ten titles, ids
   **455–464**, `(初段)`…`(十段)`. Closes RR:245(3) and adds a mechanic the ledger has nowhere.

---

## Standing-invariant statement

No frame-vs-measurement-doc conflict arose in this packet. The one case that looked like one
— RR:158/RR:178's `"CANNOT CHANGE STANCE"` — resolved the other way: **the frame supports the
code.** I said so out loud above, and I cropped and upscaled before grading, as required.
