# t1-overturns-01 — CITE LENS review (s27e)

**Packet:** `docs/gauntlet/L0/worklist/t1-overturns-01.json` — 7 findings, all `citelint: RESOLVES`, all claiming a ledger overturn.
**Judged:** 7 / 7. **Skipped:** none.
**Result:** 7 survive on substance. 0 refuted. 4 carry a peripheral defect I name below. 7 new findings.

That is an uncomfortably high survival rate for a lens whose job is to refute, so I want to be explicit about
why it happened here rather than let it read as rubber-stamping. This packet is unusual: six of the seven rest on
**decompiled AS3 quoted verbatim**, which is the one artifact class where over-claiming is hardest to hide — the
quote either is on the line or it is not. I checked every quoted line character-by-character and **every single one
matched**. The seventh rests on four video frames, which I cropped and looked at myself. Where I found error it was
in the *novelty* and *pointer* claims wrapped around the evidence, never in the evidence. I have flagged those
individually rather than either ignoring them or using them to kill a sound overturn.

---

## The obfuscation chain, closed first-hand

Six findings hinge on `§1t4414s0§`, `§1t4415s0§` and `§1t1525s0§.§1t9948s0§()`. Rather than accept any
finding's word for what those are, I closed the mapping myself:

| Web (v0.717) | Android (v0.682) | How I proved it |
|---|---|---|
| `§1t1525s0§.as:1152` `return actionState == §1t9903s0§;` | `StageManager.as:1025` `return actionState == STATE_BATTLE;` | same class, same one-line predicate → `§1t9948s0§` **is** `isBattle()` |
| `§1t99s0§.as:3272` `if(this.§1t4414s0§ == this.§1t4415s0§)` | `MCSPlayer.as:3215` `if(this.reload == this.maxreload)` | identical position in the damage roll → `4414`=`reload`, `4415`=`maxreload` |
| `§1t99s0§.as:3101` `§1t113s0§.instance.§1t5208s0§(1)` | `MCSPlayer.as:3037` `BattleUI.instance.setStanceColor(1)` | `§1t113s0§` **is** `BattleUI` |
| `§1t1525s0§.as:1073` `function §1t9941s0§() : §1t113s0§` | `getBattleUI()` | the HUD the frames show |

Everything downstream stands on that table, not on trust.

---

## Verdicts

### 1. `NF-S27D-1` — "CANNOT CHANGE STANCE" is transient · **HELD** · overturn upheld · fatal

I cropped all four frames myself, `(150,930)-(620,1080)` of 1920×1080 at 3× LANCZOS (and `(0,920)-(620,1080)` for
the duel_dense one), and looked:

- **`combat_frames/Nr4fQstqHDM_t0435s.png`** — green **19/20**, blue **26/26**, third bar ~**42 % white** on a brown
  track, yellow **150 % DAMAGE** below, **no caption**, screen flashed red.
- **`combat_frames/Nr4fQstqHDM_t0430s.png`** — **20/20**, **26/26**, a **thin white sliver** at the left end of the
  third bar, **no caption**.
- **`duel_dense/Nr4fQstqHDM_429.0.png`** — same fight, third bar **empty**, **"CANNOT CHANGE STANCE"** printed on it
  in light grey.
- **`combat_frames/Nr4fQstqHDM_t0425s.png`** — **overworld**: two bars only, the third slot prints **"HEAVY STANCE"**,
  no banner.

Same video id, timestamps 425 → 429.0 → 430 → 435. **THE FRAME WINS:** a caption present at 429.0 and gone at 430
and 435 *inside one battle* is not a hard lock. `SHSD_MASTER_REFERENCE.md:388` is verbatim
`| **In combat** | **Hard lock** — "CANNOT CHANGE STANCE" appears the instant a fight starts | [CONTRACT] |`;
`:2099` repeats it; `REBUILD_READINESS.md:158` states it. All three fall.

The code agrees exactly: `§1t113s0§.as:328` `(param1 - 48) / (param2 - 48)`, `:336-342` show at ratio 0, `:344-347`
hide while 0 < ratio < 1 — and `:111` paints that caption **`#BBBBBB`**, which is precisely the grey I see at 429.0.

**Caveat the finding does not raise:** the caption is `getString(960)`, and **960 has no entry in the v0.682 table**
(`strings.json` numeric ids run 0–9010, 1893 present, nothing between 940 and 980). The text is recoverable *only*
from film. The doc and the code both fail on this row; the frame does not.

### 2. `NF-S27D-3` — RR:159 is inverted · **HELD** · overturn upheld · material

I re-ran the enumeration instead of trusting it. `grep '§1t4414s0§'` over `§1t99s0§.as` returns **exactly 28 lines**,
and the finding's list is a **perfect match with nothing omitted**. I then grepped `§1t9948s0§`: **all seven** calls
(`:3086 :3095 :3106 :3121 :3132 :3147 :3160`) sit inside `§1t3489s0§`, so *":3162 is the sole stance-switch debit and
the sole one under a battle guard"* is exactly right — `§1t4478s0§` (`:3293`, the slash debit) and `§1t4479s0§`
(`:3318`, the kill bonus) carry no guard at all.

**One peripheral error:** the finding asserts *"'RR:159' returns zero hits"*. It does not — `LEDGER_EVIDENCE.md:1510`
contains `RR:159 blocker ⑤`. That banked line is *itself* mislabelled (see new finding 6) and leaves the proc rule
open, so it does not pre-empt anything — but the assertion as written is false. Not grounds to refute: the overturn
rests on code, not on being first.

### 3. `NF-S27D-4` — the full-Focus evade passive · **HELD** · overturn upheld · material

`:3383` is byte-for-byte the quoted predicate. `:3384-3387` sets `§1t3246s0§ = 12`, plays `"Snd_jump"`, `return true`
— and `:3389` `var _loc5_:int = param2.damage;` is the very next line, so the early return really does consume the hit
with no damage applied. `§1t4491s0§` is a skill-level lookup (`:4673`), `§1t120s0§.as:108/110/112` are ids
**1074/1075/1076**, `§1t4465s0§` (`:2963`) is a single action state.

Then I opened the cited frame. `zFtCaTO0_1M/seg-03/frames/frame_0013.jpg`, crop `(20,190)-(400,400)` at 5×:

> **(PASSIVE SKILL)** / ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL.
> / NEXT LEVEL (LEVEL 1)

Passive · per-stance · full-focus · *while slashing*. Four for four with the code. `§1t4465s0§ == §1t11149s0§` is the
slash state.

**Two peripheral defects:** (a) the lane_impact cites `LEDGER_EVIDENCE.md:660` for the *"an evade gate, not a crit
meter"* clause — that clause is at **`:726`**; `:660` is the blade-path reach cap. The point about it is right, the
line number is wrong. (b) `:3707` is not an *identical* branch — the predicate is identical, the body omits the
`Snd_jump`. Novelty check passes: 0 hits for `3383`, `10173`, `4491s0`.

### 4. `cite-s27d/crit-proc-is-deterministic` — **HELD** · overturn upheld · material

All four quotes verbatim-exact, including the stance attribution: `MCSPlayer.as:3217` `if(this.stance != LIGHT_STANCE)`
→ `:3219` **×1.2**, fall-through `:3221` → **×1.5** for Light. Deterministic confirmed — the only `Math.random()`
nearby is the base damage-range roll at `:3258`/`:3201`; the crit branch takes no probability. `:3295-3297` zeroes the
meter *before* the per-stance `slashUsage` debit, so a full bar buys exactly one crit. `RR:195` blocker ⑤ verbatim.

**Bonus corroboration the finding did not use:** `§1t113s0§.as:110` sets the *full-bar* caption to `getString(175)`,
which `strings.json` resolves to **"Critical Hit"**, and `:352` fires `Snd_criticalDamage` once on the transition.
The game's own HUD labels the full meter a crit state.

### 5. `cite-s27d/dan-titles-are-nine-strings-456-464` — **HELD** · overturn upheld · minor defect

Every cite verbatim. `getString(455)` returns **zero** hits across both decompiled trees while `strings.json["455"]`
= `(初段)` exists — so nine displayed titles over ten states is right.

**I discharged its own S0-3 caveat with an artifact it did not find:** `§1t408s0§.as:534-565` is a **second, web-side**
dan ladder hardcoded in **ASCII romaji** — `(nidan)(sandan)(yondan)(godan)(rokudan)(nanadan)(hachidan)(kyudan)(judan)`
with the identical shogo boundaries. Same nine ranks, web-sourced, no android table needed.

**One over-claim:** *"a SECOND, uncatalogued honorific layer the ledger has nowhere"* is **false** —
`LEDGER_EVIDENCE.md:2803` already banks *"Renshi at 3-5, Kyoshi at 6-7 and Hanshi at 8-9"*, and `:1210` names the
Renshi/Kyoshi achievements. The shogo layer **is** catalogued; only the string ids are new. Peripheral; `RR:205`
blocker ③ still falls.

### 6. `cite-s27d/focus-fill-is-plus-1-per-tick` — **HELD** · overturn upheld · material

All three paths verbatim. `_loc4_` really is a death count — `NPCManager.as:1691` and `:1704` are both `deathCount++`,
`:1709` `if(deathCount > 0)` → `:1711` `bonusReload()`. So **+6 per kill batch, not per kill**, exactly as claimed.

**Two nits, neither refuting:** "deliberately" is intent-reading; and the skill is named **"Focus"**
(*"Instantly recharges your focus bar."*, `resolved_names.json` skilldata `1005`), not "Replenish Focus" — that name
comes from the ledger (`RR:161`/`:194`), so it is the ledger's inconsistency, not the finding's.

**Unclaimed and load-bearing:** `§1t99s0§.as:249` `this.§1t4415s0§ = 8 * 24;` is the *sole* write to maxFocus →
**FOCUS_MAX = 192** in web, against android `MCSPlayer.as:239` `5 * 24` = **120**. Without that scale the +1 / +6 /
max-1 numbers mean nothing.

### 7. `cite-s27d/stance-switch-costs-48-flat` — **HELD** · overturn upheld · fatal

Every quote verbatim, plus the entry gate `:3058-3060` `if(this.§1t4414s0§ < 48) { return; }` and the companion
predicate `:3050` `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;`.

**The 48 is player-visible.** `§1t113s0§.as:328` draws the bar as `(param1 - 48) / (param2 - 48)` — it reads **empty
exactly when focus ≤ 48**, the switch threshold, and that is the same point at which the grey lock caption prints. I
opened `duel_dense 429.0` (empty + caption) and `t0430s` (sliver, no caption). **Code, HUD and film agree on one
constant.** `RR:159-160` is not soft, it is inverted.

---

## New findings (7)

| # | Claim | Class | Overturns |
|---|---|---|---|
| S27E-1 | **FOCUS_MAX = 192** web / 120 android, and the HUD bar's **zero point is 48**, span 144 | A2 | RR:195 ③ |
| S27E-2 | The Focus caption is a **three-state** readout: grey lock / hidden / black **"Critical Hit"** + one-shot SFX | A2 | MASTER_REF:388 |
| S27E-3 | Web v0.717 references skills **1074-1076 that do not exist in skilldata.xml** (ids stop at 1073) | A2 | the "75 skills" count |
| S27E-4 | Android combat tuning diverges from web on **damage, reach, meter and mastery scale** — not just crit | A2 | RR:155-157 |
| S27E-5 | A **second, ASCII, web-side** dan ladder (`§1t408s0§.as:534-565`) discharges the S0-3 caveat for that row | A2 | RR:164-165 |
| S27E-6 | `LEDGER_EVIDENCE.md:1510` **mislabels RR:195 blocker ⑤ as "RR:159"** | A3 | — |
| S27E-7 | Rebirth `STAT_HGOLD` is **+20 at dan 8, +5 otherwise** — a tier RR:165 says does not exist | A2 | **PARTIAL — lead only** |

S27E-7 is deliberately filed **PARTIAL**, not HELD. I found no artifact tying `STAT_HGOLD` to the coin counter the
film shows, so under §0 the identification is **STILL_UNHELD** and I say so rather than dress the inference as a cite.
What is held is that the android rebirth path *has* a dan-8 special case — precisely the shape of thing `RR:165`
asserts is absent.

S27E-3 is the sharpest of them: the payload skill table and the frame **disagree about which skills exist**, and the
frame is the one holding the card that names the behaviour the code implements. **The frame wins.**

---

## What I did not do

I did not open `docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md` (§3.2). Every `LEDGER_EVIDENCE.md`
lookup above was a targeted `grep -c` / single-line `sed` for a novelty or pointer check, never a read of another
agent's argument. No file outside this journal path was modified.
