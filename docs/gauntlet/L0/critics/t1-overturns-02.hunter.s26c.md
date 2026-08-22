# t1-overturns-02 — blind hunter review (s26c)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` · 7 findings · 7 judged · 0 skipped.
Structured verdicts: `docs/gauntlet/L0/critics/t1-overturns-02.hunter.s26c.json` (written first).

**Headline:** no finding in this packet is false. Five of the seven claimed overturns hold;
**two are inflated and I reject the overturn while keeping the claim** (nameplate, farming).
One frame pass settled the biggest sentence in the packet and corrected four measurement
docs at the same time.

---

## THE FRAME WINS — twice, in one crop

RR:158 says **"In-combat stance is HARD-LOCKED in v0.717 ('CANNOT CHANGE STANCE')"**, and
`SHSD_MASTER_REFERENCE.md:388` carries it as **[CONTRACT]**. Two findings in this packet say
that label is really the reload/crit meter's low-end readout. Under §0 I could not grade that
second-hand, so I opened the film.

`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop `(240,1018)-(540,1052)` of the
1920×1080 frame, upscaled 3× LANCZOS. The bottom-left cluster is **three** bars:

| bar | state at t=428.0 |
|---|---|
| green | HP `20/20` |
| blue | Chi `26/26` |
| **third, brown** | **EMPTY**, with `CANNOT CHANGE STANCE` lettered across it |

Then, same duel, `Nr4fQstqHDM_432.5.png` and `_432.9.png`: that third bar has a fill block at
its left end and **the label is gone.**

That is `§1t113s0§.as:336-342` (show `§1t5204s0§` when `ratio == 0`) and `:344-347`
(`else if(_loc3_ > 0 && _loc3_ < 1 …) visible = false`) rendered on film. The label is a
**meter-state readout**, not a battle-state lock notice.

**Second correction from the same crop.** `SYNTHESIS.md:45` and the `B-11`, `B-24`, `A-16`
segment notes all call that label **yellow**. Pixel census:

| element | mean of bright pixels | n |
|---|---|---|
| `CANNOT CHANGE STANCE` | **#B3AA9C** (neutral grey) | 1307 |
| `150% DAMAGE` (line below) | **#EDBD1F** (the actual yellow) | 678 |
| HP digits (white reference) | #DCE7DE | 481 |

The study docs read the buff line's colour onto the label above it. The measured grey is
consistent with `§1t113s0§.as:111`'s literal `<font color='#BBBBBB'>`.
**When a measurement doc and a frame disagree, the frame wins — and it did, on both counts.**

### and the code was never ambiguous

- `§1t113s0§.as:379-381` — clicking the BattleUI's own change-stance button `§1t5158s0§`
  (labelled `getString(208)` = *Change Stance* at `:146`) calls `§1t5207s0§()`.
- `§1t113s0§.as:468-480` — that handler cycles the stance when `§1t4470s0§()` passes and plays
  `Snd_error` when it does not.
- `§1t1541s0§.as:605-611` — `Keyboard.SPACE` does the same thing.
- `§1t99s0§.as:3048-3051` — the gate is `§1t4469s0§() && this.§1t4414s0§ >= 48`. An action-state
  check **and the reload meter**. There is no battle-state flag anywhere in it.
- `shs3_android/scripts/GameEngine.as:584` — the game's own loading tip:
  `str = "Tip: In battle, you can use spacebar to change stance.";`
- `shs3_android/scripts/BattleUI.as:109-110` — the android BattleUI carries the same
  `changestancelabel`, so this is not even a v0.717 addition.

RR:158 is dead. Both findings' overturns are **upheld**.

The android twin also decodes three obfuscated web fields for free — `BattleUI.as:101-102`
(`crittext.text = getString(175)`) maps to `§1t113s0§.as:120-121`, so
**`§1t5169s0§` = crittext, `§1t5161s0§` = changestancelabel, `§1t5182s0§` = reloadbar**
(`BattleUI.as:60`). One meter drives three states: below 48 the grey label, above 48 the switch
is legal, at max `*1.3` damage (`§1t99s0§.as:3272-3274`) and `Snd_criticalDamage`
(`§1t113s0§.as:348-358`).

String 960 stays textually unresolved — I checked, ids 881–999 are a hole in the v0.682 table
(its numeric keys form 21 contiguous blocks) while the web payload calls ~30 ids inside that
hole, and `bindata.json` shows no web-side string table among the 27 web bins. The
`PARTIAL` self-verdict on that half was honest. The frame resolves it functionally anyway.

---

## The two overturns I reject

### 1. `nameplate-level-suffix-…` — TRUE, but it does not overturn RR:219

Every cite is verbatim. Web `§1t122s0§.as:92-99` really is
`if(param1 > 0 && !this.§1t4895s0§()) { charname + " (" + param1 + ")" } else { charname }`,
repeated at `:802-809`, `:915-921`, `:1416-1422`; android `EnemyPlayer.as:84,:776,:881` really
have no else; `§1t122s0§.as:1763-1766` really is a spectator predicate.

But RR:219 says **`nameplate (N)=level`** — it asserts what the parenthesised number *means*,
and `" (" + level + ")"` confirms exactly that. It never claims the suffix is unconditional.
A `level > 0` gate does not make it false. I opened
`reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png` and the red plate reads **`GUESTDIT (3)`** —
(N)=level, precisely as the ledger already has it.

**What survives:** the ledger's mapping, unamended.
**What should be logged as an ADDITION, not an overturn:** the suffix is suppressed at level 0
and in spectator mode on the web duelist/boss path, and that suppression is v0.717-only.

### 2. `farm-yield-and-whiff-are-on-disk-too` — TRUE, closes 2 of 9 cells

I verified and *strengthened* it: `InteractUI_crops.as:607` is verbatim; skill 1020 resolves to
**Farming** (skilldata.xml id 1020 → displayname 6048 → `strings.json["6048"]`); skill ids double
as stat ids (`StatsManager.as:740-742`, `InventoryUI.as:1944`); and the one thing that could have
broken the yield read is fine — `var dice:int = 0;` at `:589`, so `Math.random() * patchlevel`
truncates and the `==0..==5` ladder at `:611-646` is reachable. `getPatchLevel` (`:457-480`)
returns 1..6 on thresholds 10/20/30/40/50. `gracePeriod = 900` (`:55`) and the rot-free 12-hour
case (`:160-169`) both check out.

But RR:225 blocker ② is **"gather/mine/farm yield + whiff + respawn tables"** — nine cells. This
delivers two. The finding's own `lane_impact` concedes it needs the mining finding *and* the
ore-respawn finding to close the blocker; neither is in my packet, so neither is judged, and
under §0 an unjudged claim cannot carry an overturn. The blocker survives for the other seven.

Two minor imprecisions to carry, not refutations: "the very first harvest is a guaranteed drop"
is really "the harvest counter equals exactly 1"; and the counters are 30008/30009/30010/**30011**
with 30011 shared by dice 3, 4 and 5 — not four distinct counters.

---

## The three overturns that hold cleanly

### `reach-dan-10` — RR:164 falls

`§1t1523s0§.as:2644-2659`, read directly:

```
:2644  if(§1t7356s0§(§1t9426s0§) == 8)
:2646     §1t9713s0§(§1t9413s0§,100);
:2647     …getString(864,[§1t9765s0§(),"10"])
:2651  else §1t9713s0§(§1t9413s0§,25);
:2653  if(§1t7356s0§(§1t9426s0§) < 9) §1t9713s0§(§1t9426s0§,1);
```

`StatsManager.as:194` `STAT_HGOLD=12`, `:220` `STAT_DAN=25`, and `strings.json["864"]` =
*"[0] has rebirthed and is now Dan [1]!"* resolve every obfuscated token. Dan display =
`STAT_DAN + 1`, `STAT_DAN` caps at 9, top rank = **Dan 10**, 10th-rebirth payout = **100**.
RR:164's own counter-evidence ("film shows a flat +25 gold, no 10th-rebirth tier") is literally
the `:2651` else-branch every rebirth below the 8th takes. `MAX_DAN_RANK=10` and `tenthGold=100`
are CONTRACT.

### `stance-mastery-ceiling-is-10-not-9` — RR:155 loses one token

`0.5 + 0.04m` = 0.86 at m=9, **0.90 at m=10**. `1 + 0.02m` = 1.18 at m=9, **1.20 at m=10**.
I closed the domain question the finding left open: `skilldata.xml` skill id 1000
(`<displayname>6000</displayname>` = *Light Stance Mastery*, `<passive>1</passive>`) carries
exactly ten `<level>` blocks, `<value>` 1 through 10, and `StatsManager.as:740-742` seeds
mastery at 1. Domain is **[1,10]**, no off-by-one — unlike DAN, which really is stored 0-indexed.

Honest scope note: only the number falls. The sentence's substantive claim — *ceiling values,
not base; Heavy damage fixed; Heavy reach scales* — survives and is confirmed verbatim at
`§1t99s0§.as:3094 / :3105 / :3116-3120`.

### `war-map-renders-at-10px-per-territory` — RR:225 ① falls, and I closed its parity hole

Verified first-hand: `WarSelectUI.as:15/:17/:19` = 8 / 21 / 51; `:233-234` verbatim; `92_1t4648s0.bin`
is GIF89a **63×72**, md5 `13068dfa1a5cc5628720a25782f93fed` (matches the cite exactly), and a
Pillow census gives **exactly 735** non-black pixels of 4536. `QuestEngine.as:509-529` is the
consumer — it walks the raster and pushes `terrX + 341 << 12 | terrY + 341` for every
`getPixel(i,j) != 0`.

The finding's weak point was that all its code cites were android. **I closed it:** web v0.717
`§1t7934s0§.as:15/:17/:19` = 8/21/51, `:232` is the same land test, `:299-300` the same
`* 10 + 4.5` / `* 10 + 8.8`; `§1t6481s0§.as:17/:19/:21` repeats them for the world map. The mask
is web bindata 92. **C2 does not apply here.** And the film agrees —
`zFt_combat/zFtCaTO0_1M_t0330s.png` prints **`TERRITORY (21,51)`** on-screen.

Two corrections to carry forward, neither fatal:
1. The finding names the web twin **`§1t1524s0§`**. Wrong class — the web constants and pitch
   live in **`§1t7934s0§`**; `§1t1524s0§` only calls into it at `:1463`.
2. **"630 × 720 board" is map-LOCAL.** `WarSelectUI.as:836-839` scales both `grid` and
   `flagcanvas` by `zoomLevel`, and native stage is 800×480 (RR:12). Do not ship 630×720 as a
   screen size.
3. The ledger's own parenthetical *"sparse Japan-outline, not a W×H grid"* is itself half-wrong:
   it **is** a 63×72 W×H raster whose land set (735 cells) is sparse.

---

## New findings (8)

| id | class | what |
|---|---|---|
| `frame-proof-the-stance-label-hides-when-the-third-bar-fills` | A1 | t=428.0 empty bar + label; t=432.5/432.9 fill, no label |
| `the-stance-label-is-grey-not-yellow-the-frame-wins` | A1 | #B3AA9C vs #EDBD1F — corrects SYNTHESIS.md:45 + 3 segment docs |
| `stance-mastery-domain-is-1-to-10-in-skilldata` | A2 | skilldata.xml skill 1000 has `<value>` 1..10 |
| `the-game-ships-a-loading-tip-telling-you-to-change-stance-in-battle` | A2 | GameEngine.as:584 |
| `battleui-carries-its-own-change-stance-button-in-both-builds` | A2 | + the crittext/changestancelabel/reloadbar name map |
| `the-war-map-mask-and-pitch-are-web-side-too-parity-closed` | A2 | §1t7934s0§.as:15,:17,:19,:232,:299-300 |
| `the-hud-prints-territory-21-51-on-film` | A1 | frame-side proof of TERRSHIFTX/Y |
| `crit-multiplier-1-3-is-in-the-web-damage-function` | A2 | §1t99s0§.as:3272-3274 — CRIT_MULT=1.3 is payload CONTRACT, not wiki folklore |

## Files touched

Only my two journal paths. No source, no ledger, no `src/core/Sim.ts`, no
`tests/duel-baseline.test.ts`.
