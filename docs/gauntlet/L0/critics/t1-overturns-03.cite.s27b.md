# BLIND CRITIC — CITE LENS — packet `t1-overturns-03`

**Packet size 7 · judged 7 · skipped 0 · refuted 0 · held 7 · new findings 7**

Structured verdicts written FIRST to
`docs/gauntlet/L0/critics/t1-overturns-03.cite.s27b.json`.

---

## Headline

**All seven survived.** That is an uncomfortable rate for a critic told to default to
refuted, and I went looking hard for the reason to kill each one. The reason did not
appear. Every cite in this packet resolved to the exact line with the exact content,
including both `QUOTE_UNVERIFIED` entries, whose "missing" quotes turned out to be
hand-compressed paraphrases of real code rather than fabrications. On three of the seven
I ended up **strengthening** the finding past what it claimed, by closing a hole the
finding itself had disclosed.

What I did instead of manufacturing refutations: I recorded seven **new findings**,
including one honest `STILL_UNHELD` and two corrections to load-bearing prose inside
surviving claims.

**Ledger damage:** ledger lines **155** (mastery-9), **158** (stance hard-lock) and
blocker **(1)** at line 225 (world geography) all fall.

---

## The three overturns, in order of consequence

### 1. Ledger line 158 — "In-combat stance is HARD-LOCKED in v0.717" is dead

Three findings converge on this and they close it from three independent directions.

The decisive artifact is not the frame and not the string — it is the call the findings
pointed at but did not follow. `§1t113s0§.as:381` calls `§1t5207s0§()`, whose body
(`:468-480`) gates on `§1t4470s0§()`. That function is in `§1t99s0§.as:3048-3051`:

```
public function §1t4470s0§() : Boolean
{
   return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
}
```

and on success runs `§1t4472s0§` (`:3058-3080`), which is a literal three-stance cycle
`-1 → §1t12220s0§ → §1t12221s0§ → §1t12222s0§ → §1t12220s0§`, self-guarded by
`if(this.§1t4414s0§ < 48) return;`. On failure BattleUI plays `Snd_error` (`:478`).

So v0.717's own in-combat HUD class ships the affordance **and** the transition. The
label is the refusal message for a meter below threshold, not a statement that the
mechanic was removed. The ledger did not merely mislabel a widget; it deleted a live
combat mechanic and told the build to model the switch as "a recreation divergence."

Corroboration on film (I cropped and looked, both at the claimed crop and wider):

- `Nr4fQstqHDM_428.0.png` — three bars, green `20/20`, blue `26/26`, third brown bar
  with an **empty track** carrying `CANNOT CHANGE STANCE`, yellow `150% DAMAGE` beneath.
- `Nr4fQstqHDM_432.5.png` / `_432.9.png` — same duel, same crop: the third bar now has a
  white fill block at its **left end** and **the label is gone**.

That is `§1t113s0§.as:336-342` (show at `ratio == 0`) and `:344-347` (hide while
`0 < ratio < 1`) rendered on film, where
`ratio = (param1 - 48) / (param2 - 48)` at `:328`. Same behaviour again in
`session11/crit-focus/t1003.000.png` (empty track + label) and `t1082.100.png`
(partially filled + no label).

The `48` in the UI rescale and the `48` in the stance gate are the same threshold. The
meter reading below 48 is *exactly* what "cannot change stance" means.

### 2. Ledger blocker (1) — world geography needs no Fandom mining and no tracing

Two findings, both exact.

`92_1t4648s0.bin` (**web** payload bindata) and `110_Mobile_MapBitmapData.bin`
(**android** blob) are both 272 bytes and both md5
`13068dfa1a5cc5628720a25782f93fed`. Header bytes `4749 4638 3961 3f00 4800` = GIF89a,
**63 × 72**. My own pixel census returns exactly `{black: 3801, white: 735}`, total
`4536 = 63 × 72` — the claimed counts to the pixel.

The non-circularity argument is the part that matters under correction **C2**, and it
holds. I did not take "92 is web-side" on faith; I traced the web chain end to end:

```
§1t4648s0§.as:5   [Embed(source="/_assets/92_1t4648s0.bin", ...)]
§1t1524s0§.as:87  internal static const §1t9847s0§:Class = §1t4648s0§;
§1t7934s0§.as:168 this.§1t7958s0§ = §1t1524s0§.§1t9892s0§();
§1t7934s0§.as:232 return this.§1t7958s0§.getPixel(...) != 0;
```

the exact twin of android `QuestEngine.getMapBitmapData()`. A web file and an android
file with identical bytes, each independently wired by its own build — this is one of
the few genuinely non-circular parity data in the corpus, and C2 does not touch it.

I also confirmed the identification the world finding assumed rather than proved:
android `WarSelectUI.as:15/:17/:19` are `WARMARKERSHIFTX=8` / `TERRSHIFTX=21` /
`TERRSHIFTY=51`, `:173` is the same `getPixel` expression, `:233-234` the same
`*10 + 4.5` / `*10 + 8.8` flag pitch and `:253-254` the same `+5` / `+8.5` marker pitch.
`§1t7934s0§` **is** the web WarSelectUI.

Blocker (1)'s prescribed research — *"mine Fandom Category:Territories via API; trace the
map image"* — is unnecessary work on a shipped asset the game embeds by name.

### 3. Ledger line 155 — the stance table ceiling is mastery **10**, not 9

`§1t99s0§.as:3262` and `:3265` are verbatim:

```
_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
_loc2_ = _loc1_ * (1   + 0.2 * this.§1t4422s0§ * 0.1);
```

- m = 9 → **0.86 / 1.18** — not the ledger's numbers
- m = 10 → **0.90 / 1.20** — exactly the ledger's numbers
- m = 1 → **0.54 / 1.02** — not the ledger's "level-1 does ×0.5 / ×1.0" (that is m = 0)

Both endpoints in line 155 are off by one mastery step, and line 320's action item
"relabel mastery-9" would commit the wrong number to config. The ledger's *insight* —
these are ceilings, not base — survives intact; only the integer falls.

I closed the binding the finding asserted: `§1t1523s0§.as:2268` passes
`§1t9714s0§(1000)/(1001)/(1002)` into `§1t4443s0§` params 12/13/14, which
`§1t99s0§.as:196-197` assigns to `§1t4421s0§`/`§1t4422s0§`. Those really are the
skill-1000/1001 mastery levels, and `strings.json["6000"] = 'Light Stance Mastery'`.

---

## Where I went past the findings (three parity holes closed)

**The stance-mastery finding disclosed its own weakness** in its `build` field —
"android v0.682 data XML + web v0.717 formula" — because floor = 1 rested on
`StatsManager.as`, an android file. That hole is now closed web-side:
`§1t1523s0§.as:2586-2588` is the v0.717 new-character seed and pushes the identical seven
skill stats at value 1, a line-for-line twin of `StatsManager.as:740-746`. Honest
self-flagging rewarded.

**String 960's absence is now explained, not just observed.** `strings.json` has no key
`960`, but the stronger fact is that android v0.682 has no code path that could use it:
`BattleUI.as:259-263` `updateReload` is two lines with no `ratio == 0` branch and no
second `htmlText`. The web twin adds all three states and rescales the input by 48. This
is a real, dated v0.682 → v0.717 HUD change, which is a better answer than "the table
doesn't cover it."

**The BattleUI obfuscation map** now covers eight more members beyond the three claimed,
fixed by call-order and body-shape twinning: `§1t5158s0§` = `battlemodebust`,
`§1t5170/71/72s0§` = `hpbar/hptext/hptextshadow`, `§1t5164/65/66s0§` =
`chibar/chitext/chitextshadow`, `§1t5200s0§` = `setReloadMax`, `§1t5205s0§` =
`updateReload`, `§1t5215/16s0§` = `show/hideChangeStanceLabel`.

---

## THE FRAME WINS OVER THE MEASUREMENT DOC

Saying it out loud, as the standing invariant requires.

Four committed prose lines describe this HUD slot and all four are wrong:

| doc line | what it says | what the frame shows |
|---|---|---|
| `B-11:7` | "**Yellow text** under the bars: CANNOT CHANGE STANCE" | pale grey, measured |
| `B-11:45` | green X/20 bar "reads as a stance-lock/special resource" | label is on a *different*, numeral-free bar |
| `B-11:71` | 'the small green "X/20" bar (stance-lock resource, label "CANNOT CHANGE STANCE")' | the X/20 bar and the label bar are two different bars |
| `A-16:23` | "blue bar … 20/20 … confirms stance-switching is **locked** once a duel starts" | the switch is meter-gated, not locked |

I did not grade the colour by eye. Bright-pixel census on `t1003.000.png`:

- label row (y 1028–1044) dominant bright colour **(176, 176, 160)** — near-neutral pale
  grey, the compression-shifted `#BBBBBB` that `§1t113s0§.as:111` writes
- banner row (y 1050–1074) dominant **(240, 192, 0)** — saturated gold, blue channel zero

Not the same colour. `B-11:7`'s "Yellow text" is refuted by measurement.

The code agrees with the frame, which is the correct order of authority anyway: both
numeric updaters (`:312-317` HP, `:319-324` Chi) write `.text`; `§1t5205s0§` (`:326-347`)
writes only `bar.scaleX` on `§1t5182s0§`. The third bar has no numerals because nothing
ever writes numerals to it.

---

## What I recorded against the survivors

Holding a finding is not endorsing every sentence in it. Three corrections:

1. **"a Change Stance button NEXT TO the portrait" is wrong** — it **is** the portrait.
   Android names the clickable `battlemodebust` (`:26`), the same object that receives the
   player bust (`:148`) and carries the stance ring (`:374`). The `getString(208)` label is
   a **hover tooltip**: android `:192-193` `MOUSE_OVER/MOUSE_OUT →
   show/hideChangeStanceLabel`, web `§1t113s0§.as:241-242 → §1t5215s0§/§1t5216s0§` with
   `:542` visible = true / `:548` = false and `:200` hiding it at init. A porter following
   that `lane_impact` literally ships a spurious second HUD widget.

2. **"about 28% filled" is ~23%.** Row scan at y = 1035: white run x = 245–304 (60 px),
   track x = 245 → ~514. 60/270 = 22.6%. Not load-bearing — the shipped number is the
   threshold 48 from `:328`, not the fill fraction — but a soft estimate must not be
   promoted into a measured row.

3. **`§1t5205s0§` "sets only bar.scaleX with no text"** is loose: it does set `htmlText`
   on the shared `crittext` field. The intended and true point is "no *numerals* on that
   bar." Likewise `§1t5202s0§` is cited as "the numeric bars" when it is only the Chi one;
   the HP twin is `§1t5201s0§` at `:312-317`.

---

## The one honest STILL_UNHELD I am adding

**Nobody has established which HUD bar colour maps to which stat.**

The code proves only that there are two numeric updaters and one numeral-free one —
`updateHp` / `updateChi` / `updateReload` and their web twins. **Nothing in AS3 names a
colour**; the fills live in SWF shape data. The surviving "video-study notes misread"
finding asserts green = HP / blue = Chi, and `B-11:7` asserts the exact opposite ("a thin
green bar … reads as a resource/stamina-type meter, **NOT** the blue HP bar … a thick blue
bar … (this is HP)").

Circumstantial support for green = HP, which I record as circumstantial and not as proof:

- `REBUILD_READINESS.md:178` is Kheshav's **own-eyes** verdict (A5) on
  `Nr4fQstqHDM_428.0` and reads "player HP **20/20**" — in that frame green is 20/20 and
  blue is 26/26.
- Across my three frames the green denominator is pinned at **20** (20/20, 14/20, 11/20)
  with its numerator falling during combat, while the blue denominator varies 26 / 31 / 47.

That is inference plus one A5 line, not an artifact binding colour to stat. I am flagging
it because it would silently corrupt `palette.ts` and the config bar names, and because
two committed docs currently contradict each other. The way to close it is a low-HP or
death frame, or the SWF shape for `hpbar`.

---

## Machine-audit disposition

| citelint | count | outcome |
|---|---|---|
| `BROKEN` | 0 | — |
| `QUOTE_UNVERIFIED` | 2 | **both survived** — see below |
| `RESOLVES` | 5 | all 5 say what they claim to say |

Both `QUOTE_UNVERIFIED` entries were false alarms of the same kind, and it is worth naming
the pattern so the next critic does not over-refute on it:

- `battleui-carries-its-own-change-stance-button` — its quote is a hand-compressed
  paraphrase using `//` as a line-range separator
  (`":470-479 if(...§1t4470s0§()) { Snd_smallClick; ... } else { Snd_error; }"`). No such
  literal string exists in the file, but every line it names is real and the compression is
  faithful.
- `string-960-is-cannot-change-stance-frame-resolved` — its quote **describes frames**, not
  file text. An A1 finding's quote can never be located by a text scanner.

`QUOTE_NOT_LOCATED` on an A1 finding, or on a finding whose quote uses `//` or `...`
elision, is not evidence of over-claiming. It means the scanner was handed prose.
