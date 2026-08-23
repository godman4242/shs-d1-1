# t1-overturns-03 — HUNTER LENS review (s27b)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` · 7 findings · **7 judged, 0 skipped**
Structured verdicts (written FIRST, before this file): `docs/gauntlet/L0/critics/t1-overturns-03.hunter.s27b.json`

**Result: 7 upheld, 0 refuted, 7 overturns upheld — but one of them (`the-video-study-notes-misread…`)
survives only narrowly, on evidence it shares with a sibling rather than on its own distinctive content.**
Plus **7 new findings** the packet under-claimed, including two hard CONTRACT numbers and a sealed
crit multiplier the ledger currently treats as unsealed.

This packet is unusually strong. That is not a compliment I hand out on plausibility — every cite
in it opened, and the four that make the big claim (in-combat stance is not hard-locked) are
corroborated by *two independent artifact classes*: decompiled AS3 and film, agreeing.

---

## 1. The headline: ledger §3 item 4 falls

> **In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's
> Focus-gated in-combat switch models **removed 2014 behavior**. — `REBUILD_READINESS.md:158`

Four findings in this packet target that sentence. All four hold, and the sentence is **false**.

**The code.** `§1t113s0§.as` (web BattleUI) declares `§1t5158s0§:MovieClip` at `:22`, sets
`§1t5161s0§.text = getString(208)` = "Change Stance" at `:146`, gives it `buttonMode` at `:149`,
hit-tests it at `:379-381` and dispatches to `§1t5207s0§` at `:468-480`:

```
:470   if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
:472      §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
:473      §1t1523s0§.§1t9586s0§().§1t4472s0§();
:478   else §1t88s0§.instance.§1t1516s0§("Snd_error");
```

The packet names `§1t4470s0§` but never opens it. I did. `§1t99s0§.as:3048-3051`:

```
public function §1t4470s0§() : Boolean
{
   return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
}
```

`§1t4469s0§` (`:3043-3045`) is an `actionState` test, so this is an **in-combat** gate.
`§1t4472s0§` (`:3058-3080`) cycles `-1→Light→Balanced→Heavy→Light` and returns early below 48.
The meter's max is `this.§1t4415s0§ = 8 * 24;` = **192** (`:249`), starting at 0 (`:250`).

**So the stance switch is not locked. It costs 48 of a 192 reload meter — 25%.**

**The film.** Three frames, cropped `(200,940)-(700,1080)` at 3× LANCZOS (wider than the finding's
strip, same content), and two more at `(0,820)-(660,1080)`:

| frame | HP | Chi | third bar | label |
|---|---|---|---|---|
| `duel_dense/Nr4fQstqHDM_428.0.png` | 20/20 green | 26/26 blue | empty brown track | **CANNOT CHANGE STANCE** |
| `duel_dense/Nr4fQstqHDM_432.5.png` | 20/20 | 26/26 | thin white block, left edge | *none* |
| `duel_dense/Nr4fQstqHDM_432.9.png` | 20/20 | 26/26 | wider white block | *none* |
| `session11/crit-focus/t1003.000.png` | 14/20 green | 31/31 blue | empty | **CANNOT CHANGE STANCE** |
| `session11/crit-focus/t1082.100.png` | 11/20 green | 31/47 blue | ~¼ filled white | *none* |

A hard lock does not un-post its own notice 4.5 seconds into a duel while the fighters keep
swinging. This is `§1t113s0§.as:336-342` (show `#BBBBBB` `getString(960)` at ratio 0) and
`:344-347` (hide it while `0 < ratio < 1`) rendered on film — and I counted those lines myself,
they are byte-exact as cited.

**What survives.** The paragraph's second half. The recreation's **Focus**-gating is still a
divergence, because the real gate is the reload/crit meter, not Focus. The correct rewrite is
*"in-combat stance switching is REAL in v0.717 and costs 48/192 reload; the recreation's Focus
gate is the wrong resource"* — not *"it's real, ship as-is."*

---

## 2. Verdicts, one by one

### ① `skills-meters/stance-mastery-domain-is-1-to-10-in-skilldata` — UPHELD, overturn UPHELD
Every element opened. `skilldata.xml` skill 1000 is `<passive>1</passive>` with exactly ten
`<level>` blocks, `<value>` 1..10. (The finding's "required 1..9" is loose — the column is
1,1,2,3,4,5,6,7,8,9 — and `XMLSkill.as:253-263` shows `<required>` is the **skill-point cost**,
not the level, which actually strengthens the claim: `<value>` is the mastery number.)
`§1t99s0§.as:3262` = `0.5 + 0.04m`, `:3265` = `1 + 0.02m`. m=1 → 0.54/1.02; m=10 → 0.90/1.20.

I closed the off-by-one question the finding *asserts* rather than proves. `StatsManager.as:1834`
passes `getStat(1000)/getStat(1001)/getStat(1002)` as args 12/13/14 of `initPlayer`; the web ctor
`§1t99s0§.as:196-198` assigns `param12/13/14` straight through, unmodified; `:740-742` seeds all
three at 1. Domain **[1,10]**, no offset.

**Overturn:** the ledger says "MASTERY-**9** CEILING". Mastery 9 gives 0.86/1.18, not 0.9/1.2.
The label is wrong by one, and "A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0" is wrong too —
×0.5/×1.0 need m=0, which the seeding forbids. **What survives:** the bolded substance ("ceiling
values, not base") and "Heavy is fixed" (`:3270` is a flat `* 1.4`).

### ② `ui-hud/battleui-carries-its-own-change-stance-button-in-both-builds` — UPHELD, overturn UPHELD (fatal)
Every line verified in both builds. The obfuscation map holds three-for-three:
`§1t5169s0§` ↔ `crittext` (`BattleUI.as:48`, both set to `getString(175)`),
`§1t5182s0§` ↔ `reloadbar` (`:60`), `§1t5161s0§` ↔ `changestancelabel` (`:36`).
`strings.json["208"]` = 'Change Stance', `["175"]` = 'Critical Hit'.

**One correction to its lane_impact:** the button is not "next to the portrait" — it **is** the
portrait. `BattleUI.as:275-277` hit-tests `battlemodebust` itself into `stanceButtonClick()`.
See new finding N7.

### ③ `ui-hud/frame-proof-the-stance-label-hides-when-the-third-bar-fills` — UPHELD, overturn UPHELD (fatal)
Frame-accurate, see the table above. `:336-342` / `:344-347` are byte-exact.

### ④ `ui-hud/string-960-is-cannot-change-stance-frame-resolved` — UPHELD, overturn UPHELD (fatal)
Both frames as described. `:111` is the `#BBBBBB` `getString(960)` build, `:110` its black
`getString(175)` twin. The finding's `:343-346` is one line adrift of the real hide-branch
(`:344-347`) — a bracket-boundary slip, not a mis-cite; the block it names is the right one.
I confirmed independently that `strings.json["960"]` really returns nothing, so "web-only,
unresolvable from android" is **verified, not assumed**.

### ⑤ `ui-hud/the-video-study-notes-misread-the-cannot-change-stance-slot` — UPHELD, overturn upheld NARROWLY
**THE FRAME WINS, and I proved it with numbers instead of adjectives.** Pixel census on the
original `t1003.000.png`:

| band (original coords) | peak glyph RGB | reading |
|---|---|---|
| CANNOT CHANGE STANCE, y 1030-1046 | **(196,187,180)** / (190,184,174) | desaturated near-grey, ≈ `#BBBBBB` = (187,187,187) |
| 150% DAMAGE, y 1050-1075 | **(255,194,0)** | saturated gold |
| HP numerals, y 970-995 | (255,255,255) | pure white |

Two different colours. `B-11:7` merged them ("Yellow text under the bars: CANNOT CHANGE STANCE
and 150% DAMAGE") and the notes are wrong. All four quoted note lines are transcribed accurately —
I opened them: `B-11:7`, `:45`, `:71`, `A-16:23`, including `A-16:23`'s conclusion
*"confirms stance-switching is locked once a duel starts"*, which is exactly the error that
propagated into the ledger.

The notes also have **HP and Chi backwards**. Web ctor maps `param3=MAXHP`, `param5=MAXCHI`
(`§1t99s0§.as:226-227` feeds `§1t5201s0§` the HP pair and `§1t5202s0§` the Chi pair) against
`initPlayer(hp,maxhp,chi,maxchi,defense,…)` at `StatsManager.as:1834`. So the green X/20 bar is
**HP**, not a "stance-lock resource" — and the ledger's own §3 crux read at `:178` already calls it
"player HP 20/20".

**Why "narrowly":** I nearly marked the overturn false. This finding's *distinctive* content
(label colour, absent numerals, which bar is HP) overturns the **segment notes**, not the ledger
sentence it names. It survives only because it also carries `§1t113s0§.as:326-346` in its own cite,
and that state machine is what makes the sentence false. Upheld — but its real, valuable target is
`B-11:71` and `A-16:23`, which should be struck from the study docs.

### ⑥ `world/the-war-map-mask-and-pitch-are-web-side-too-parity-closed` — UPHELD, overturn UPHELD
All cited lines verbatim. I also verified the two lane_impact items the finding states without
citing: `mapid = (x+341)<<12 | (y+341)` at `§1t7934s0§.as:591` and `:618` (inverse at `:296-297`),
and the full web-side asset chain — `:168` `§1t7958s0§ = §1t1524s0§.§1t9892s0§()`;
`§1t1524s0§.as:87` binds that to `§1t4648s0§`; `:701` `loadBytes(new §1t9847s0§())`;
`§1t4648s0§.as:5` embeds `/_assets/92_1t4648s0.bin`. **C2's circularity caveat genuinely does not
reach this.**

### ⑦ `world/the-war-map-mask-is-byte-identical-across-web-and-android` — UPHELD, overturn UPHELD
Re-measured every number:

```
$ md5 -q reference/extracted/bindata/92_1t4648s0.bin reference/extracted/android/110_Mobile_MapBitmapData.bin
13068dfa1a5cc5628720a25782f93fed
13068dfa1a5cc5628720a25782f93fed
$ file …  → GIF image data, version 89a, 63 x 72   (both, 272 bytes)
PIL census → 2 distinct colours: (255,255,255)×735, (0,0,0)×3801, total 4536 = 63×72
```

735 land of 4536 cells = **16.2 %**.

### The world overturn, stated honestly
Blocker ① (`REBUILD_READINESS.md:225`) prescribes *"mine Fandom Category:Territories via API;
trace the map image."* **Both close-paths are now unnecessary** — the mask is shipped in both
builds, byte-identical, and the offsets, land predicate, flag pitch and id packing are all in the
web payload. The blocker falls.

**What survives:** "sparse Japan-outline" survives as a fair description of the 735 land cells.
**"not a W×H grid" does not** — the storage *is* a 63×72 raster, with land sparse inside it.
Say it plainly rather than let the rewrite quietly keep the wrong clause.
This also closes S0-1's dangling *"92 a GIF"*: file 92 now has a named role.

---

## 3. New findings — what the packet under-claimed (Lens 2a)

No finding in this packet was marked STILL_UNHELD or PARTIAL, so 2(a)'s hunt had no targets.
The hunt for **under-claiming** found seven, four of which carry hard numbers:

| # | id | why it matters |
|---|---|---|
| N1 | `combat-core/the-in-combat-stance-gate-is-reload-48-of-a-192-max` | the actual gate: `>= 48` of `8*24 = 192`. Costs no Focus, no Chi. |
| N2 | `combat-core/crit-1.3-is-sealed-in-the-web-payload-and-fires-at-full-reload` | `§1t99s0§.as:3274` `return _loc2_ * 1.3 + …` conditioned on meter **== max**. The ledger holds 1.3 on *wiki* authority and asks to "read a real OG crit popup to fully seal it." **It is already sealed, in web code.** Combat-core blocker ② closes. |
| N3 | `skills-meters/the-initplayer-argument-order-is-a-noncircular-web-android-bridge` | 15-arg signature match decodes six web fields from android symbols without diffing a file against itself — a reusable technique against C2. |
| N4 | `combat-core/stance-reach-is-asymmetric-with-damage-and-carries-a-hard-floor-of-100` | reach and damage are **mirror images**: Light reach flat ×1.4 / damage scales; Heavy damage flat ×1.4 / reach scales, clamped at **100**. So the ledger's "reach 300/200/100" cannot be a ceiling row off one base — ceiling multipliers are 1.4/1.20/0.90, not 3:2:1. |
| N5 | `ui-hud/the-third-bar-is-a-three-state-meter-and-fires-snd-criticaldamage-at-full` | the packet stops at two states. The third: `#000000` `getString(175)` + one-shot `Snd_criticalDamage` (`:350-352`). Under C3 the audio is recovered, so that stem is shippable. |
| N6 | `ui-hud/string-960-is-absent-from-android-because-the-android-label-is-a-portrait-rollover` | **a discharged C2 instance.** Android's whole bar-text logic is `crittext.visible = percentage >= 1 && reloadbar.visible` (`:262`) — no empty-state label at all; its "Change Stance" string is a MOUSE_OVER tooltip on the bust (`:192-193`, `:430-440`). The web replaced the hover with a persistent notice, which is *why* 960 exists in v0.717 and not in v0.682. |
| N7 | `ui-hud/the-change-stance-button-is-the-portrait-bust-itself` | `§1t5158s0§` = `battlemodebust`. `§1t5208s0§` (`:484`) ↔ `setStanceColor` (`:374`), called with **1=Light, 2=Balanced, 3=Heavy** (`§1t99s0§.as:3101/:3112/:3127`). The stance-coloured ring (ledger item 10) and the stance button are **one widget**, and the ring index is an explicit frame number, not an inferred palette. |

---

## 4. Notes for the ledger rewrite

1. §3 item 3 — change "MASTERY-9 CEILING" to **mastery-10**, and replace the base row
   ×0.5/×1.0 with **×0.54/×1.02** (m=1). Keep "ceiling, not base" and "Heavy is fixed".
2. §3 item 4 — **strike "HARD-LOCKED"**. Replace with: in-combat switching is real, gated on
   reload ≥ 48 of 192; the recreation's **Focus** gate remains a divergence (wrong resource).
3. §3 item 2 — CRIT_MULT 1.3 can be promoted from wiki-sourced to **web-payload CONTRACT**
   (`§1t99s0§.as:3274`), and the trigger is `meter == max`, not a probability roll.
4. world-exploration blocker ① — **closed**. Drop both close-paths. Keep "sparse Japan-outline";
   drop "not a W×H grid".
5. `docs/research/video-study/segments/B-11-…:7,:45,:71` and `A-16-…:23` should be struck or
   annotated — they are the origin of the hard-lock error and of an HP/Chi swap.
