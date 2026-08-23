# Blind cite-lens review — packet `t2-corroborating-03` (s27c)

Packet size **2** · judged **2** · skipped **0** · refuted **0** · new findings **3**

Both claims were `citelint: RESOLVES`, so the machine had already cleared paths and line
numbers. My job was the part a script cannot do: open the artifact and ask whether it
actually *says* what the claim says it says. I opened all of them — five source files,
three 1080p frames cropped and upscaled, and the string index.

Neither claim is refuted. That is not a rubber stamp: I state below exactly what I
checked, the two nits I found, and the one thing each claim under-cited.

---

## 1 — `ui-hud/the-third-bar-is-a-three-state-meter-and-fires-snd-criticaldamage-at-full`

**VERDICT: HELD (not refuted, severity minor).**

**Own cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111,:326-361` ·
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249,:256` ·
`docs/gauntlet/L0/index/strings.json["175"]` ·
`reference/frames/session11/crit-focus/t1082.100.png`

### Both quotes are verbatim

`§1t113s0§.as` is 1,344 lines, so :110 and :326-359 are well inside it. Line 110 reads
exactly as quoted:

```
110	         this.§1t5203s0§ = "<font color=\'#000000\'>" + §1t1521s0§.getString(175) + "</font>";
111	         this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";
```

and :352 reads exactly as quoted:

```
352	               §1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");
```

`strings.json["175"] = 'Critical Hit'` — confirmed in the index.

### The three states are where the claim puts them

`§1t5205s0§(param1, param2)` at :326-361:

| ratio | lines | behaviour |
|---|---|---|
| `== 0` | :336-343 | `htmlText = §1t5204s0§` (**#BBBBBB**, `getString(960)`), `visible = true` |
| `0 < r < 1` | :344-347 | `visible = false` — **no text at all** |
| `>= 1` | :348-359 | fire `Snd_criticalDamage`, then `htmlText = §1t5203s0§` (**#000000**, `getString(175)`), `visible = true` |

### The one-shot guard is real, and the claim read it correctly

This was the part most worth attacking, and it survives. :350 fires the sound only when
`!this.§1t5169s0§.visible || this.§1t5169s0§.htmlText != this.§1t5203s0§`. Lines :354-358
then set **both** of those — `htmlText = §1t5203s0§` and `visible = true`. So on every
subsequent tick the guard evaluates false. It genuinely cannot re-fire per frame.

### "0..192" is not thin air — I traced it independently

The claim asserts "one 0..192 resource" without citing where 192 comes from. It is real.
`§1t5205s0§` is called from `§1t99s0§.as` at :256, :1208, :3169 and :3325, always as
`(this.§1t4414s0§, this.§1t4415s0§)`, and :249 sets:

```
249	         this.§1t4415s0§ = 8 * 24;
```

= **192**. That is an *under*-cite by the finding, not an over-claim, and it now has a cite.

### Frame corroboration I went and got myself

`reference/frames/session11/crit-focus/t1082.100.png`, cropped `x 0-640, y 760-1080` of
1920×1080 and upscaled 3× LANCZOS: a **third track sits directly under the green and blue
bars**, roughly 25% filled in white, carrying **no numerals**. That is the `0 < r < 1`
middle state, seen rather than deduced — and it confirms the claim's positional wording
("the single track under HP and Chi"), which the AS3 alone could only support by call order.

### Two nits, neither fatal

- **`strings.json` has no entry `"960"`.** The table holds 2,533 entries with ids spanning
  0–9010; 960 is absent. So the empty-state wording is still unnamed. The finding is
  *right* not to name it — it says `getString(960)` and stops. Noting it so nobody later
  reads "#BBBBBB empty-state" as though the copy were known.
- **The game's own name for this widget is `reloadbar`, not "crit bar".** The android twin
  `BattleUI.as:259-262` is `updateReload(percentage)` writing `this.reloadbar.bar.scaleX`,
  with `this.crittext` as the TextField. "Crit" is the *text*; "reload" is the *bar*.

---

## 2 — `ui-hud/which-hud-bar-is-hp-and-which-is-chi-is-still-unheld-by-colour`

**VERDICT: HELD as an honest STILL_UNHELD (not refuted, severity minor).**

**Own cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:237-262` ·
`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:304-324` ·
`docs/research/REBUILD_READINESS.md:178` ·
`docs/research/video-study/segments/B-11-castle-gate-lever-puzzle.md:7` ·
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` ·
`reference/frames/session11/crit-focus/t1003.000.png`, `t1082.100.png`

I tried hard to refute this one, because a STILL_UNHELD that is merely lazy is exactly what
this lens is for. It is not lazy. I went looking for the missing colour-to-stat artifact
myself and did not find it either.

### The AS3 half is verbatim, and stronger than the claim says

`BattleUI.as:245-256`:

```
245	      public function updateHp(hp:int, maxhp:int) : *
247	         this.hptext.text = hp + "/" + maxhp;
249	         this.hpbar.bar.scaleX = hp / maxhp;
252	      public function updateChi(chi:int, maxchi:int) : *
254	         this.chitext.text = chi + "/" + maxchi;
256	         this.chibar.bar.scaleX = chi / maxchi;
```

The claim matches the web twins "by call-order". That undersells it — **the match is also
confirmed by arity**, which is much harder to get wrong:

| android | web | signature |
|---|---|---|
| `setMax(hp, chi)` :237-239, empty | `§1t5199s0§` :304-306, empty | 2 ints |
| `setReloadMax(reload)` :241-243, empty | `§1t5200s0§` :308-310, empty | 1 int |
| `updateHp` :245-250 | `§1t5201s0§` :312-317 | 2 ints, 3 identical writes |
| `updateChi` :252-257 | `§1t5202s0§` :319-324 | 2 ints, 3 identical writes |

Two consecutive empty stubs with matching arities bracketing two identically-shaped
updaters is a rigid alignment. The mapping is safe.

### "Nothing in AS3 names a colour" — checked, and true

I grepped `BattleUI.as` for the bar symbols. `hpbar`/`chibar`/`reloadbar` appear at :16,
:24, :60 (declarations) and :249, :256, :261-262 (`scaleX` and `visible`) — **nothing else**.
Every hex colour in the file (:715 `#FFFFFF`, :721 `#FF0000`, :725 `#00FF00`, :729
`#00FFFF`, :733 `#FFCC00`, :737 `#FF9900`, :742 `#CCCCCC`) is a *chat-log* colour routed
into `updateChatLog(...)` at :746/:771/:784. None of it touches a bar. The fills do live in
SWF art, exactly as claimed.

### The doc quotes are word-for-word

`B-11-castle-gate-lever-puzzle.md` is 76 lines; :7 is the Combat HUD bullet and contains,
verbatim, `a thin green bar ... reads as a resource/stamina-type meter, NOT the blue HP bar`
and `a thick blue bar below it labelled "47/47" (this is HP — ...)`.

`REBUILD_READINESS.md` is 378 lines; :178 contains `Also visible: player HP **20/20**`, and
it sits under the :174 heading **"First-hand crux confirmation (own eyes, not
agent-reported)"** — so the A5 classification is correct, not assumed.

### The frames

All three opened at 3× (crop `x 0-640, y 760-1080` of 1920×1080):

| frame | green | blue |
|---|---|---|
| `duel_dense/Nr4fQstqHDM_428.0.png` | **20/20** | **26/26** |
| `session11/crit-focus/t1003.000.png` | **14/20** | **31/31** |
| `session11/crit-focus/t1082.100.png` | **11/20** | **31/47** |

Every number in the finding is right.

### Nit

The finding says "across **my three** frames" but cites only two frame paths; the third
(`Nr4fQstqHDM_428.0`) reaches it only indirectly through `REBUILD_READINESS.md:178`. I
opened that frame directly and it holds. Under-cite, not over-claim.

### Why I did not refute it for being incomplete

Because it is the calibrated answer. Two committed docs genuinely contradict each other on
this, the SWF shapes are unnamed, and the AS3 is silent. Refuting an honest STILL_UNHELD is
its own failure mode, and this one names its own weakness out loud ("that is inference plus
one A5 line") rather than dressing inference up as a citation.

---

## New findings

Three, all from artifacts I opened while judging. None overturns a ledger sentence.

### N1 — `ui-hud/third-hud-row-is-shared-reload-bar-or-cannot-change-stance-banner` · **A1 · HELD**

The HUD's third row is **one slot** showing either the reload/crit bar **or** the
`CANNOT CHANGE STANCE` banner — never both. Measured at native 1920×1080, the row occupies
**y ≈ 1031-1046, x ≈ 250-510** in all three frames:

- `t1082.100.png` — bar: white fill (`~#EBEBEB`) x≈250→315 on the shared brown track
  (`~#311F00`); **no** stance text anywhere on screen.
- `t1003.000.png` and `Nr4fQstqHDM_428.0.png` — same slot, solid brown track with pale
  glyphs spelling `CANNOT CHANGE STANCE`; **no** bar fill.

This is the visual half of something the code already states: `§1t113s0§.as:334` guards the
entire three-state block on `this.§1t5182s0§.visible`, and `BattleUI.as:262` reads
`this.crittext.visible = percentage >= 1 && this.reloadbar.visible;`.

**Lane impact (L8):** do not lay out a fourth row for the stance-lock banner. It is the same
slot, swapped by one visibility flag. Getting this wrong shifts everything below it — the
`150% DAMAGE` buff line sits directly under this row in all three frames.

### N2 — `ui-hud/three-hud-bar-fill-and-track-colours-measured-from-a-frame` · **A1 · HELD**

Pixel-sampled from `t1082.100.png` at native resolution, `x = 255..275` straight down:

| bar | row | sampled RGB | hex |
|---|---|---|---|
| 1 (top) | y=983 | (0, 154, 5) | `~#009A05` green |
| 2 (middle) | y=1010 | (51, 78, 227) | `~#334EE3` blue |
| 3 (bottom) | y=1038 | (236, 236, 236) | `~#ECECEC` near-white |
| shared empty track | y=983/1010/1038, x=440..500 | (~49, 31, 0) | `~#311F00` dark brown |

**Caveat stated up front:** this is a lossy 1080p re-encode of an **800×480** native game
(`REBUILD_READINESS.md:171`), so these are close approximations of the OG hues, not the
SWF's authored fill values. The shapes under `reference/extracted/shapes/` are **1,822
unnamed numbered SVGs** with no SymbolClass map, so the authored value is not currently
recoverable.

**This deliberately does NOT bind colour to stat.** It binds colour to *position*
(1st/2nd/3rd track). Finding 2 above therefore stands untouched.

**Lane impact (L8 / `palette.ts`):** three fill tokens and **one shared** track token, not
three tracks. Label all four INFERRED-from-video, never CONTRACT, until a SWF shape is named.

### N3 — `ui-hud/b11s-blue-is-hp-rests-on-an-inference-a-frame-breaks` · **A1 · PARTIAL**

B-11:7's *reason* for calling blue HP is broken by a frame, though its *observation* is not.

B-11:7 argues blue `is HP — stayed pinned at 47/47 the whole segment, i.e. player took no
damage`. But `t1082.100.png` shows a blue bar with **the same maximum, 47**, reading
**31/47**. The max-47 blue bar demonstrably depletes. B-11's within-segment observation can
still be true; the inference drawn from it is not sound.

Pushing the same way: `Nr4fQstqHDM_428.0.png` reads green **20/20** and blue **26/26**, and
`REBUILD_READINESS.md:178` — Kheshav's own-eyes A5 verdict on that exact frame range —
records `player HP **20/20**`. **In that frame the only bar reading 20/20 is the green one**,
so his HP read lands on GREEN.

**STANDING INVARIANT, said out loud: B-11 is a measurement doc, `Nr4fQstqHDM_428.0` is a
frame, and THE FRAME WINS.**

Filed **PARTIAL**, not HELD, because it is still a two-artifact join (A5 log line + A1
frame) rather than one artifact naming both a colour and a stat, and because it leans on
Kheshav not having transcribed the wrong row. It does not close "which bar is which" — it
says which side of the contradiction is currently carrying weight.

**Lane impact (L8):** keep the bar-to-stat binding OPEN, but stop treating B-11:7 as
symmetric counter-evidence. The cheapest closing artifact is a **death frame**: whichever bar
hits 0 immediately before the `YOU WERE DEFEATED` screen is HP.
`docs/research/video-study/segments/A-22-death-you-were-defeated-screen.md` names the segment
to pull frames from.
