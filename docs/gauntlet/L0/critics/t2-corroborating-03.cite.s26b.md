# BLIND CITE REVIEW — packet `t2-corroborating-03.json` (48 claims, all judged)

Reviewer: cite-lens critic, run s26b. Every verdict below rests on an artifact I opened
myself. I read no other agent's prose (§3.2). No file outside this journal path was modified.

**Result: 41 HELD · 7 REFUTED · 0 skipped.**

Refuted: `combat-core/reversed-and-dual-reach` (material) ·
`combat-core/stance-triangle-1.2-and-damage-order` (material) ·
`combat-core/web-only-1.3-state-multiplier` (material) ·
`combat-core/mastery-is-0-to-9` (minor) · `combat-core/mastery-is-single-digit` (minor) ·
`combat-core/mastery-domain-unresolved` (minor) · `combat-core/reach-units-unreconciled` (minor).

---

## 0. What the machine audit got wrong, and where it was right

Nine claims came in `QUOTE_UNVERIFIED`. **Eight of the nine survive.** In every one of those
eight the quote was compressed with `…` ellipses, `///` separators or `·` joiners, so the
literal string was never going to be found by substring match — but the underlying line is
present, verbatim, at the cited number. Examples I re-read character-for-character:

- `§1t136s0§.as:10` → `internal static const §1t11470s0§:Class = §1t4651s0§;` — exact.
- `§1t99s0§.as:249` → `this.§1t4415s0§ = 8 * 24;` — exact.
- `§1t99s0§.as:3239` → `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` — exact.
- `MCSPlayer.as:3166` → `this.canLaunch = this.lightMastery >= 3;` — exact.

`QUOTE_UNVERIFIED` was, in this packet, almost entirely a false positive of quote *formatting*.
The one `QUOTE_UNVERIFIED` claim I did refute (`reach-units-unreconciled`) fails on substance,
not on the quote.

The one `UNCHECKABLE`/`NO_CITE` claim (`mastery-domain-unresolved`) is refuted — see §3.

---

## 1. THE THREE MATERIAL KILLS

### 1.1 `combat-core/reversed-and-dual-reach` — the two stance identities are SWAPPED, and the "both floored at 100" is invented

The finding says: *"Dual = base x1.4, Reversed = base x1.0, both hard-floored at 100."*

I opened `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35`:

```
27:      internal static var §1t12220s0§:int = 0;
29:      internal static var §1t12221s0§:int = 1;
31:      internal static var §1t12222s0§:int = 2;
33:      internal static var §1t12223s0§:int = 3;
35:      internal static var §1t12224s0§:int = 4;
```

and `reference/decompiled/shs3_android/scripts/MCSPlayer.as:27-35`:

```
27:      internal static var LIGHT_STANCE:int = 0;
29:      internal static var BALANCED_STANCE:int = 1;
31:      internal static var HEAVY_STANCE:int = 2;
33:      internal static var DUAL_STANCE:int = 3;
35:      internal static var REVERSED_STANCE:int = 4;
```

Same line numbers, same integer values. **`§1t12223s0§ = 3 = DUAL`. `§1t12224s0§ = 4 = REVERSED`.**
The finding has them the other way round.

And the bodies, `§1t99s0§.as:3130-3155`:

```
3130:  case §1t12224s0§:                                    (= REVERSED)
3131:     this.§1t4417s0§ = this.§1t4420s0§ * 1.4;          ← ×1.4, NO floor
3138:     §1t113s0§.instance.§1t5208s0§(2);
3141:  case §1t12223s0§:                                    (= DUAL)
3142:     this.§1t4417s0§ = this.§1t4420s0§;                ← ×1.0
3143:     if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }   ← floor, on THIS case only
3153:     §1t113s0§.instance.§1t5208s0§(3);
```

So on v0.717: **REVERSED = base ×1.4 with NO floor; DUAL = base ×1.0 floored at 100.**
Two errors in one sentence — the names are transposed AND the 100-px floor is attributed to
a case that does not carry it. A port taking this row ships each stance with the other's reach
and adds a clamp the engine never applies. REFUTED, material.

The packet's own `combat-core/stance-constant-identity-is-pinned-by-hud-colour` gets this
**right** (`§1t12223s0§=DUAL`, `§1t12224s0§=REVERSED`) and is HELD. The two claims are in
direct contradiction and only one can enter the ledger.

### 1.2 `combat-core/stance-triangle-1.2-and-damage-order` — the triangle runs the wrong way

The finding's parenthetical: *"stance-triangle x1.2 (LIGHT beats BALANCED beats HEAVY beats LIGHT)"*.

The code it quotes is the **victim's** `gotHit`. `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3703`:

```
3701:  if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || ...)
3703:     damage *= 1.2;
```

`this` is the character **taking** the hit. So a LIGHT victim struck by a BALANCED attacker takes
+20% — i.e. **BALANCED beats LIGHT**, the exact opposite of the parenthetical.

Settled independently by the game's own tutorial copy,
`docs/gauntlet/L0/index/strings.json["IDS_Q50S3NODE2"]`:

> "Balanced is effective against Light. Heavy is effective against Balanced. Light is effective against Heavy."

corroborated by `strings.json["6001"]` (light: *"Effective against Heavy Stance."*),
`["6003"]` (balanced: *"Effective against Light Stance."*) and `["6005"]` (heavy:
*"Effective against Balanced Stance.\nDefense -20%"* — which also independently confirms the
`defense * 0.8`).

The finding's *order of operations* half (×1.2 → −defense → clamp to `getMinDamage()` → behead ×1.5)
is exactly right and I verified it at `MCSPlayer.as:3701-3717`. But the direction is the one thing a
config file encodes, and it is inverted. REFUTED, material.

`combat-core/stance-triangle-damage-magnitudes` states the direction **correctly**
(*"the victim takes x1.2 when the attacker's stance beats theirs"*) and is HELD;
`combat-core/stance-triangle-is-1p2` states no direction at all and is HELD.

### 1.3 `combat-core/web-only-1.3-state-multiplier` — this is the BEHEAD flag, and it has an android twin

The finding: *"a fifth damage term with no android counterpart: a boolean character-state flag
that multiplies incoming damage by 1.3 after the min-damage floor… The boolean itself is not yet
identified… a downed-or-launched juggle state is the likely reading. Flagged as a LEAD."*

`§1t1071s0§` is identified 64 lines above the cite, in the same function, in the same file.
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3736-3747`:

```
3736:  switch(param1)
3737:  {
3738:     case mcs.§1t6231s0§[§1t75s0§.§1t12394s0§]:
3739:     case mcs.§1t6231s0§[§1t75s0§.§1t12393s0§]:
3740:     case mcs.§1t6231s0§[§1t75s0§.§1t12389s0§]:
3741:        §1t1071s0§ = true;
3744:     default:
3745:        §1t1071s0§ = false;
```

Three hat/head/neck part slots set it. It is the **behead** flag. Confirmed a second time at
`§1t4904s0§.as:406-410`, where the same three cases do `_loc3_ *= 1.3; §1t1071s0§ = true;`.

The android counterpart is the line the packet's own
`combat-core/stance-triangle-1.2-and-damage-order` already quotes —
`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3714-3717`:

```
3714:  if(behead)
3716:     damage *= 1.5;
```

set at `MCSPlayer.as:3689-3692` by the identical `PART_hat / PART_head / PART_neck` switch.

So there is no fifth term. There is the behead term, retuned **1.5 → 1.3** between builds — a
sixth entry for the divergence table, not a new mechanic. Left standing, this claim would put a
phantom "+30% state multiplier" in the ledger **alongside** the behead multiplier and
double-count the same 30% on every head hit. REFUTED, material.

---

## 2. THE MASTERY CEILING — three claims say 9, the artifacts say 10

Four claims in this packet bear on the mastery domain. They do not agree, so I resolved it
from source.

`getStat(1000/1001/1002)` routes through `reference/decompiled/shs3_android/scripts/StatsManager.as:3956-3962`
(`case SKILL: … return skillStat.getValue(); … return 0;`) into the skilldata level table.
Skill **1000** is `<displayname>6000</displayname>` = `strings.json["6000"]` = *"Light Stance Mastery"*.
Its top level, `reference/extracted/skilldata.xml:73-79`:

```
73: 		<level>
74: 			<value>10</value>
75: 			<required>9</required>
```

`strings.json["8131"]` = *"Light Stance Mastery Level 10."* (an achievement — so 10 is reachable),
`["8132"]`/`["8133"]` the same for balanced/heavy. `reference/extracted/ui_strings.txt:227` carries
*"balanced stance mastery level 10."* And the arithmetic closes it: substituting **m = 10** into
`§1t99s0§.as:3262` (`0.5 + 0.4*m*0.1`) and `:3265` (`1 + 0.2*m*0.1`) yields exactly **0.9** and
**1.2** — the ledger's damage table. At m = 9 it yields 0.86 / 1.18, which reproduces nothing.

**The domain is 0 (unlearned) / 1–10.**

- `combat-core/mastery-domain-is-1-to-10-resolved` — states 1–10 and derives 1.02→1.20 and
  0.54→0.90 from the web coefficients. Every cite exact (`StatsManager.as:1834`, `XMLNpc.as:680-682`,
  `skilldata.xml:74`, `§1t99s0§.as:3105`/`:3116`). **HELD.** Note its `build: web v0.717` label is
  generous — four of five cites are android-side.
- `combat-core/mastery-is-small-integer` — says "roughly 0-10" and its m=10 substitution is the
  correct one. **HELD.**
- `combat-core/mastery-is-0-to-9` — *"Stance mastery is a 0-9 integer in BOTH builds."*
  Its cited lines (`MCSPlayer.as:3166-3184`, `§1t99s0§.as:3231-3241`) prove only that gates sit at
  ≥3/≥4/≥5. They say nothing about a ceiling, and the ceiling it asserts is contradicted by
  `skilldata.xml:74` and `strings.json["8131"]`. The half that matters (not a 0-100 percentage) is
  right and is carried correctly by the two claims above. **REFUTED, minor** — inference dressed
  as a citation.
- `combat-core/mastery-is-single-digit` — same defect, softer wording, and its lane note explicitly
  endorses the ledger's "mastery-9" reading. **REFUTED, minor.**

**Consequence for the ledger:** the sentence *"the stance tables are mastery-9 ceilings, not base"*
is off by one. They are **mastery-10** ceilings. See NEW FINDING 1.

### `combat-core/mastery-domain-unresolved` (STILL_UNHELD, no cite)

I do not refute honest STILL_UNHELDs. This one is not merely honest-uncertain — it carries a
substantive assertion that is false on the target build:

> *"on the 0-10 reading the heavy reach mastery term can never do anything, because its maximum
> (×0.55) stays permanently under its own 100-unit floor."*

×0.55 is the **android** coefficient (`0.5 + 0.5*m*0.01` at m=10). On v0.717,
`§1t99s0§.as:3116` reads `* (0.5 + 0.4 * this.§1t4423s0§ * 0.1)` → **×0.90** at m=10, and with
base ≥ 124 (`§1t1523s0§.as:2346-2347`) the product clears the 100 floor comfortably. The term does
plenty. The question it declares open is also now closed by the artifacts in §2 above.
**REFUTED, minor.** The STILL_UNHELD posture is not the problem; the false consequence is.

---

## 3. `combat-core/reach-units-unreconciled` — the conservative half is right, the "cross-validation" is not

Cites resolve: `COMBAT_MEASUREMENTS.md` §c-2 (line 394-398) reads exactly
*Light 233–241 / 303 (n=17) · Balanced 116–131 / 131 (n=17) · Heavy 97–103 / 121 (n=25)*;
`StatsManager.as:1915-1919` is `getBaseSlashLengthVal` verbatim; `InventoryUI.as:1940-1970` is the
slashModifier table verbatim. Its uncited "web per-stat cap at level 8 = 1+(8+10)*3 = 55" is
**true** — I found it at `§1t5957s0§.as:3344-3346`. Its magnitude argument therefore stands, and
its posture (*the frame wins on stage-px; do not port 120/210 as stage px*) is correct.

What fails is the sentence it asks the ledger to record as a win:

> *"RATIO TEST PASSES: payload Light/Heavy at mastery 0 = 1.5/0.5 = 3.00; frame, same level-8
> character = 303/100 = 3.03… the 3.00-vs-3.03 ratio match is a genuine independent
> cross-validation of both artifacts and should be recorded as such."*

`1.5` is the **v0.682** Light modifier (`MCSPlayer.as:3030`, `InventoryUI.as:1948`). The footage is
v0.717, where `§1t99s0§.as:3094` reads `* 1.4`. The target-build ratio at mastery 0 is
**1.4/0.5 = 2.80**, not 3.00 — an 8% miss against the frames' 3.03, not a match. Worse, the Heavy
denominator is not `0.5 × base` at all when the floor binds: `§1t99s0§.as:3117-3120` clamps Heavy to
100, and the measured Heavy plateau of 97–103 is exactly where that clamp sits, so the ratio is
`1.4 × base / 100` and carries no information about the modifier.

This is the precise error the rest of this packet warns against — an android combat constant used
to grade a web-build measurement. **REFUTED, minor.** Salvage instruction for the parent: keep the
magnitude gap and the "frame wins" ruling; strike the ratio-test cross-validation.

---

## 4. THE 41 THAT HELD — what I actually opened

**Bindata map (2/2 HELD).** I resolved every ByteArrayAsset the map claims. `§1t4651s0§.as:5` is
`[Embed(source="/_assets/94_1t4651s0.bin", …)]`, and the sibling classes give 97/95/96/98 in
`§1t136s0§.as:10,12,14,16,18` order — male/female/noble/samurai/place, matching
`NameGenerator.as:10-18` name-for-name. `§1t1524s0§.as:83,87` → 93 and 92. `§1t7785s0§.as:13` → 119.
`§1t75s0§` binds nineteen assets, `100_…` through `118_…`, at lines 67–103 (the cite says 79-103,
which under-covers by six declarations — an under-cite, not an over-claim). The third-town claim is
exact: web `§1t136s0§.as:140-151` returns Ibamaya / Gokura / **Iwakuni**; android
`NameGenerator.as:137-144` stops after Gokura. Its "bitmap pixel (43,39)" aside rests on a transform
not given in the cite and I could not check it; the finding does not depend on it.

**War-room decks (HELD).** I opened all three artifacts. `strings.json["377"]/["379"]` are
*5/6 (rank)* and *6/6 (building structures)*; a value search for `'inning'`+`'osing'` over all 2,533
entries returns `[]`. `ui_strings.txt:193-194` are *5/6 (WINNING AND LOSING)* and *6/6 (rank)*.
And on film — I cropped and read all three frames — `seg-20/frame_0011.jpg` prints
**"WAR ROOM RULES 1/7 (JOINING A BATTLE)"**, `frame_0012.jpg` **"3/7 (ATTACKING AND DEFENDING)"**,
`frame_0013.jpg` **"6/7 (BUILDING STRUCTURES)"**, each carrying the android body text verbatim.
Three decks, exactly as claimed. Caveat for the ledger: the finding labels `ui_strings.txt` as
"the web payload's baked text fields"; I could not establish that provenance from the file itself,
and `docs/GAUNTLET.md:156` only calls it "an alphabetised dump of the SWF's static UI fields".

**"CANNOT CHANGE STANCE" (HELD, and now stronger).** Both frames read it plainly under crop —
`crit-focus/t1003.000.png` (0,900)-(640,1080) ×3 NEAREST and `damage-ttk/t1961.900.png`
(100,940)-(620,1080) ×3 LANCZOS. The exhaustive string search reproduces: `'annot'`+`'tance'` → `[]`,
`startswith('Cannot')` → `[]`, nearest are `["208"]` *Change Stance* and `["125"]` *Stance Restriction*.
See NEW FINDING 2 for a source-side proof that is stronger than the text search.

**Focus / crit meter (5/5 HELD).** `§1t99s0§.as:249` = `8 * 24`; `:1203-1208` increments by 1/frame;
`§1t113s0§.as:328` = `(param1 - 48) / (param2 - 48)`; `:3050` gates at `>= 48`; `:3060` early-returns
below 48; `:3162` deducts 48. 192 raw, 144 shown, 6.000 s at 24 fps. `src/config/combat.ts:82,100,101`
already ships 192 / 48 / 144. `COMBAT_MEASUREMENTS.md:618` says **6.00 s** with basis
*"agreeing to 0.5 % (6.01 / 6.00 / 5.98)"* — the quote is exact. There is no frame-vs-doc conflict to
adjudicate here and the finding is right to say so.

**Frame measurements — I re-ran every one of them.**

- *HUD track 269 px.* My own blue-channel scan of `t1003.000.png` rows 1008 and 1010:
  x = 245…513 on both, width **269**. HP green edge at **x = 433**; (433−245)/269 = 69.9% against the
  displayed 14/20 = 70.0%. Reproduced to the pixel. `COMBAT_MEASUREMENTS.md:588` does say 268 and
  `:610` does say 269–270.
- *Focus fill.* My own white-fill right-edge scan at y=1036 returned **259 / 304 / 340 / 282 / 291**
  for t1081.100 / t1082.100 / t1082.900 / t1004.800 / t1005.000 — all five identical to the claim.
  Deltas 45 px/s. ⇒ 5.92–5.98 s, i.e. the frames and the 6.000 s source agree.
- *Stance label as a frame clock.* I built the six-tile sheet at crop (230,1015)-(530,1050) ×4 NEAREST.
  Sliver / ~13% / ~22% / ~35% with no label; **t1083.100 empty bar with the label printed across it**;
  ~47% with no label. Exactly the claimed behaviour. (Nit: the quote's tile ordering does not match
  its own cite ordering; the five fill percentages in the finding's text are all correct.)
- *Stroke render.* Crop (400,690)-(1020,820) ×3 LANCZOS on both 862.6xx frames. t862.600: one bold
  red segment over the enemy, no tail. t862.667, 67 ms later: the same bold segment **plus a thin red
  line running the full width of the crop** — the taper is unmistakable. My red-column heights at
  x = 460/780/900 are 2/4/13, matching; 540 and 940 came out 8 and 17 against the claim's 5 and 18
  (my mask also catches the fighter's red sash). Modal stroke colour **(153,0,0)** — better than the
  claimed (150,0,0) — and `InputManager.as:472` hard-codes `10027008` = `0x990000` with
  `thickness:int = 8` at `:57`. 18 px ÷ 8 units = 2.25 px/unit = 1080/480. The taper direction also
  matches the source: `lineStyle(scaledThickness − scaledThickness*((maxDistance−distLeft)/maxDistance))`
  is full at the stroke's start and zero at its end.
- *Viewport / stage.* My own column-brightness scan of `B_t785.200_LIGHT_stroke553px_endtoend.png`:
  first non-black column **52**, last **1867**, width **1816**. Identical to the claim. 1816/800 = 2.27.
- *24 fps.* I decoded both SWF headers myself: web `CWS v17, rect 0..16000 × 0..13800 twips
  (800.0 × 690.0 px), frameRate 24.000, frameCount 6, 6,880,328 bytes` — character-for-character the
  claimed tuple. Android `CWS v26, 800.0 × 480.0, 24.000`. I then pulled a 60 fps burst from
  `Nr4fQstqHDM.mp4` at 1084.3333 s and at 1089.2667 s: the crit-bar fill edge moves **only on every
  4th video frame** (15 Hz content floor, confirmed) and the subpixel steps are **bimodal at ~1.9 and
  ~3.8 px**, exactly as claimed; 267 / 1.9 = 140.5 displayed ticks against the source's 144. My
  combined tick rate came out 22.5/s against the claim's 23.75/s — a ~5% spread traceable to edge
  thresholding and ffmpeg's approximate `-ss` seek. The conclusion (capture floor, not a slow game)
  reproduces cleanly.

**Damage pipeline (6/6 HELD).** `Damage.as:150-173` is the four-band attacker-level floor verbatim
(`1 / lvl/8 / lvl/6 / lvl/4`, each `+ piercingDamage`), and it is generic: applied at
`MCSPlayer.as:3415-3418` and `:3710`, and I confirmed the identical `if(damage < damageObj.getMinDamage())`
line at `EnemyWolf.as:384`, `EnemyShield.as:347`, `EnemyNianMonster.as:383`, `EnemyClone.as:222` and
`:443`, `EnemyJiangSi.as:304`; the `new Damage(damage,level)` construction sites at `EnemyWolf.as:296`,
`EnemyFox.as:169`, `EnemyNianMonster.as:295` are all exactly as quoted. The web twin is
`§1t67s0§.as:197-209`, character-identical. `attacker-level-min-damage-floor` cites `149-171`, one line
short of the final `/ 4` return at `:172` — a range nit, not a mis-cite.

**BUFF_ATTACK (HELD).** `MCSPlayer.as:210-212` multiplies `minDamage` only; `:191-192` and `:3201`
show the roll is `minDamage + random()*damageRange`. The web twin is `§1t99s0§.as:211-213`. The
finding's conclusion — that the duel_dense contamination correction is *not* a flat /1.5 — follows.
Independently relevant: `t1003.000.png` visibly prints **"150% DAMAGE"** under the HUD.

**Build divergence (HELD, and the count is now higher).** All five constants check out:
`§1t99s0§.as:249` `8*24` vs `MCSPlayer.as:239` `5*24`; `:3274` `*1.3` vs `:3219/:3221` `*1.2`/`*1.5`;
`:3270` `*1.4` vs `:3213` `*1.5`; `:3094` `*1.4` vs `:3030` `*1.5`; `§1t1523s0§.as:200` `= 40` vs
`StatsManager.as:166` `MAXDUELTOKENS:int = 30` (positionally locked by the neighbours 60*60 / 7 / 40).
Rebirth too: web `§1t1523s0§.as:2646/2651` pays 100/25, android `StatsManager.as:2203/2207` pays 20/5.
One wording nit on `web-android-combat-tuning-diverges-on-four-constants`: it says the S0 caveat is
"positively DISPROVEN". The caveat said parity is *not established*; these counterexamples
**strengthen** it. The substance is right.

**Ten-quantity parity set (both HELD).** I checked each side. `standingRange 50 / jumpThreshhold 100 /
runSpeed 12 / slashSpeed 50-40-30` sit at lines **9,11,13,15,17,19 in both files**. `maxDistance 200 /
4 / 400 / thickness 8 / 20` sit at **51,53,55,57,59 in both**. Tap dead-zone `< 625`
(`§1t99s0§.as:2377` ≡ `MCSPlayer.as:2301`), multi-target `< 40000` (`§1t1543s0§.as:1486` ≡
`NPCManager.as:1230`), i-frames `= 12` (`§1t68s0§.as:483`), reload refill `48 + speed*6`
(`§1t122s0§.as:771`), reach base `120 + floor((90+5*DAN)*SPD/(20+SPD))` (`§1t1523s0§.as:2346-2347` ≡
`StatsManager.as:1917-1918`), heavy defence `* 0.8` (`§1t99s0§.as:3288` ≡ `MCSPlayer.as:3235`), and
the 3/4/5 ladder. Ten for ten. Nit on `parity-established-for-ten-quantities`: its cite reads
`§1t1541s0§.as:52-60` but `maxDistance:int = 200` is at **:51**, outside that range.

**calcXP (HELD, and it is the cleanest parity proof in the packet).** `§1t68s0§.as:185-209` is
`NPC.as:166-190` line for line: both zero cut-offs, `xp * (1 + 0.05*(mob−player))`,
`xp * (1 − (player−mob)/getZeroDifference())`, elite `*= 2`. `getGreyLevel` (`:113-129` ≡ `:94-110`)
and `getZeroDifference` (`:131-183` ≡ `:112-164`) likewise. CONTRACT at v0.717 is justified.

**Player unlocks are skills, not mastery (HELD — and it is the strongest of the three unlock claims).**
`§1t99s0§.as:3186-3212` is `MCSPlayer.as:3129-3162` with identical skill ids
(1014/1036/1015 light · 1016/1037/1017 balanced · 1018/1038/1019 heavy), gated on
`controlledBy == 0 || controlledBy == 2`; the `>= 3/4/5` mastery ladder is the **else** branch, i.e.
NPC-only. `heavy-launch-unlock-is-3-on-target-build` and `parity-established-for-ten-quantities` both
recommend `LAUNCH_UNLOCK_LEVEL.heavy: 5 → 3`; I confirmed `src/config/stances.ts:58-62` currently
reads light 3 / balanced 5 / heavy 5, and that 3 is right **for the NPC branch** (`§1t99s0§.as:3239`).
Both HELD — but the parent should land `player-unlocks-are-skills-not-mastery` first, because it
shows the key is the wrong shape for the player before the value is worth editing.

**Dash unit bug (HELD, and it is a live shipped defect).** `Mobile.as:117` sets `frameRate = 24`;
`slashSpeed` is consumed as a per-frame velocity — `movement(speed)` at `MCSPlayer.as:2890-2907` sets
`velX = ±speed` and calls `movePlayer(velX)` once per frame, and `:2696-2698` derives `velX = xdiff/time`
with `time = dist/slashSpeed`. So 50/40/30 are px per 24 Hz frame = 1200/960/720 px/s.
`src/core/Sim.ts:670` reads `DASH_SPEED_PX_PER_FRAME[player.stance] * FIXED_HZ` with
`src/config/timing.ts:8` `FIXED_HZ = 60` → 3000/2400/1800 px/s. **2.5× too fast.** Confirmed; I touched
nothing (Sim.ts is NO-TOUCH under §4).

**Duel path (HELD).** `§1t4904s0§.as:406-431` is a second fighter class in which the hat/head/neck
switch applies `_loc3_ *= 1.3` **at :409, before** `_loc3_ -= §1t4477s0§()` at :431, with the
stance triangle 1.2/0.9 in between — whereas `§1t99s0§` applies the same 1.3 **after** the floor
(`:3805-3807`). Two web paths, two orderings, different numbers on the same hit. Exactly as claimed.
Android `MCSPlayer.as:3701-3716` has only the ×1.2 branch and beheads ×1.5 after the floor — also
exactly as claimed.

---

## NEW FINDINGS (nobody in this packet claimed these)

**NF-1 — the ledger's "mastery-9 ceilings" is off by one; it is mastery-10.** `skilldata.xml:73-79`
gives skill 1000 a top `<value>10</value>`; `strings.json["8131"]` is the achievement
*"Light Stance Mastery Level 10."*; and only m=10 reproduces the ledger's own 0.9 / 1.2 table from
`§1t99s0§.as:3262/3265`. This **overturns** the ledger sentence *"the stance tables are mastery-9
ceilings, not base"* in its number (the "ceiling, not base" reading survives).

**NF-2 — the obfuscated stance enum is pinned by declared VALUE, not by HUD colour.**
`§1t99s0§.as:27-35` and `MCSPlayer.as:27-35` declare the five constants at the same line numbers with
the same values 0/1/2/3/4. This is decisive where the colour fingerprint is not — `setStanceColor`
emits 2 for both BALANCED and REVERSED and 3 for both HEAVY and DUAL, so colour alone cannot separate
them. Generalises to every obfuscated enum with a named android twin.

**NF-3 — `§1t1071s0§` is `behead`, and the behead multiplier moved 1.5 → 1.3 between builds.**
Set at `§1t99s0§.as:3741` and `§1t4904s0§.as:410` by the hat/head/neck part switch; consumed at
`§1t99s0§.as:3805-3807` (`*= 1.3`, after the floor) and `§1t4904s0§.as:409` (`*= 1.3`, before defence).
Android: `MCSPlayer.as:3692` sets it, `:3714-3716` applies `*= 1.5`. **A sixth counted web↔android
combat divergence**, and the correct disposition of the claim refuted in §1.3.

**NF-4 — the "CANNOT CHANGE STANCE" label is `getString(960)`, and id 960 does not exist in the
android table.** `§1t113s0§.as:111`:
`this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";`
`strings.json` has **no** key 960 — its numeric keys skip the entire 940–999 band (next present key
is 1000). That is a source-side proof of the divergence, independent of any text search over English
copy, and it is stronger than the exhaustive-search argument the claim currently rests on.

**NF-5 — the per-stat CAP formulas diverge between builds, four rows of them.** Positionally aligned,
same handler order:

| stat | web `§1t5957s0§.as` | android `InventoryUI.as` |
|---|---|---|
| MAXHP | `:3341` `< 10 + (lvl+10) * 10` | `:2407` `< 10 + (lvl+10) * 5` |
| MAXCHI | `:3342` `< 10 + (lvl+10) * 5` | `:2408` `< 10 + (lvl+10) * 5` (same) |
| MAXAP | `:3343` `< 30 + (lvl+10) * 5` | `:2409` `< 20 + (lvl+10)` |
| ATK/DEF/SPD | `:3344-3346` `< 1 + (lvl+10) * 3` | `:2410-2412` `< lvl + 10` |

At level 8 the SPD cap is **55 on web and 18 on android** — a 3× difference in the input to the reach
base formula. Any reach or progression row derived from the android caps is wrong for v0.717 by a
wide margin, and this is the concrete resolution of the "SPD ≈ 205 is impossible" leg of the
reach-magnitude gap: on web, level 8 / Dan 0 tops out at `120 + floor(90*55/75) = 186`.

**NF-6 — `strings.json["6005"]` independently sources the heavy defence penalty.** *"Slow but
powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced
Stance.\n**Defense -20%**"* — the game's own copy for `getDefense()`'s `return defense * 0.8`.

---

## WHAT THE PARENT SHOULD DO

1. Land the 41. The parity set, the Focus economy, the frame measurements and the calcXP block are
   the strongest evidence in this packet and every one reproduced under my own hand.
2. Drop `combat-core/reversed-and-dual-reach` and keep
   `combat-core/stance-constant-identity-is-pinned-by-hud-colour` (upgraded by NF-2).
3. Drop `combat-core/stance-triangle-1.2-and-damage-order`'s direction; keep its ordering, which is
   correct, by taking `combat-core/stance-triangle-damage-magnitudes` instead.
4. Convert `combat-core/web-only-1.3-state-multiplier` into NF-3 — a divergence row, not a LEAD.
5. Fix "mastery-9" to "mastery-10" everywhere (NF-1).
6. On `cite04/web-crit-label-and-sfx-symbol`: the claim is exact, but strike its closing clause
   *"given S0-5 says the audio is held but encrypted"* — correction C3 supersedes it. The finding
   asserts nothing about the audio; only its motivating aside is stale.
