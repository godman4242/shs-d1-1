# CITE-LENS REVIEW — unit `rebirth-elements`

Blind critic. I did not see the surveyor's reasoning. Every verdict below was reached by
opening the artifact myself; the artifact I opened is named in each row. Under §0 a verdict
without my own cite is void, so nothing here is second-hand.

**Headline:** 16 of 19 claims survive with their cites resolving verbatim. This is an unusually
clean citation record — most line numbers are exact, most quotes are byte-accurate, and the
claims that say STILL_UNHELD mostly deserved to. Three claims fail:

| # | claim | why |
|---|---|---|
| R1 | `rebirth/stance-slash-multipliers-parity` | the v0.717 desktop **does** carry the per-stance multipliers; the negative grep only tested the android literals. And "mastery is a 0-100 percentage" is disproved by skilldata in both builds. |
| R2 | `rebirth/unlock-gate-is-stat-threshold` | core is right; the trailing sentence "the entire usable elemental kit lands on the FIRST rebirth" is false — the ultimates and both Dragon Dance steps need 30 / 60. |
| R3 | `rebirth/element-circle-art` (STILL_UNHELD) | the art is **on disk**. `reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png` is the rendered v0.717 `InteractUI` symbol and the elementCircle is visibly in it. |

No fabricated cites were found. No claim asserted a name as held where only a numeric ID
exists — the opposite: every name I spot-checked resolved through `strings.json`.

---

## 1. What resolved exactly

**String table.** `docs/gauntlet/L0/index/strings.json` is a 2,533-entry `resname → text`
dict. Every id the unit cites resolves and the quoted text is byte-identical:

```
610 = 'Are you ready to attain the next dan rank?\n\nYou will be reborn as a level 1 character
       while retaining your inventory, skill points and clan rank. Your current equipment will
       be automatically unequipped.\n\nSlash length and bank storage is increased with each dan rank.'
611 = 'Choose an element to specialize in.'
455..464 = '(初段)' … '(十段)'   465/466/467 = 'Renshi' / 'Kyoshi' / 'Hanshi'
507/508/509/510 = 'Fire ATK' / 'Wind ATK' / 'Water ATK' / 'Earth ATK'
6143..6146 = 'Area of Effect Fire/Water/Wind/Earth Attack\n\n… Damage: 150% … ATK'
6117 / 6125 / 750 / 8044 / 8124 / 864  — all present, all as quoted
```

**Element-picker UIData.** `reference/extracted/android/90_InteractUI_UIData.bin` is UTF-8
(not UTF-16); lines 93–106 are the `rebirth` ui block. Lines 101–104 verbatim:

```
<option><label>507</label><icon>24</icon><action><id>firerebirth</id></action></option>  <!-- "fire" fireicon-->
<option><label>510</label><icon>27</icon><action><id>earthrebirth</id></action></option> <!-- "earth" fireicon-->
<option><label>508</label><icon>25</icon><action><id>windrebirth</id></action></option>  <!-- "wind" fireicon-->
<option><label>509</label><icon>26</icon><action><id>waterrebirth</id></action></option> <!-- "water" fireicon-->
```

On-screen order Fire / Earth / Wind / Water with icons 24/27/25/26 — exactly as claimed.
Line 97's Dan-10 short-circuit and its shipped comment `>=10 dan, no element boost` are real.

**Achievement 51.** `114_Mobile_AchievementData.bin:463-470` (UTF-8, CRLF) is verbatim
`<id>51</id><img>4</img><name>8044</name><desc>8124</desc><stat>25</stat><val>9</val>`, and
`STAT_DAN:int = 25` at `StatsManager.as:220`. The claim is exact.

**Dan ladder.** `InventoryUI.as:2274-2316` and `PlayerPanel.as:382-416` both map STAT_DAN
0..9, both cap at Hanshi, and `PlayerPanel.as:409` literally spells `"(kyudan)"` at STAT_DAN
**8**. The surveyor's explanation of the wiki garble is confirmed by the shipped source.

**Tenth-gold.** `§1t1523s0§.as:2644-2652` is verbatim as quoted, `§1t9413s0§:int = 12` at
:228, `§1t9426s0§:int = 25` at :254. The desktop numbers are internally corroborated:
`§1t1523s0§.as:1024` seeds the stat at 3 and `§1t406s0§.as:1581` computes `(HGOLD - 3) / 25`.

**Slash length.** Identical in both builds — `StatsManager.as:1915-1919` and
`§1t1523s0§.as:2344-2348`. Bank weight `100 + DAN*10 + PAIDSTORAGE*10` at `BankUI.as:264`.
I went further than the claim did and confirmed the **unit really is display pixels**:
`MCSPlayer.as:4663` does `startX = this.getTargetPosition() + this.slashLength * 2 / 3` —
adding it straight to a stage X — and `MCSPlayer.as:2776` hands it to
`InputManager.drawEnemyLine`, which at `InputManager.as:487-492` walks it down as a
`canvas.graphics` path length. That is a stronger footing than the claim gave itself.

**SP economy.** `StatsManager.as:2156` and `§1t1523s0§.as:2598` verbatim; `levelCap:int = 80`
at `StatsManager.as:76`. 79 at L80/Dan 0 and 790 at L80/Dan 9 both check out.

**Elemental damage / AoE / mitigation / counter-wheel / Dragon Dance / statue.** All six
verified line by line. Two of them I strengthened:

- `FireBreathProjectile` takes `damage` from the caller, and the caller is
  `MCSPlayer.as:781` — `createProjectile(PROJ_FIREBREATH, …, STAT_FIREATK, getSkillLevel(SKILL_FIREBREATH), this)`.
  So "damage = the caster's element ATK" is not an inference; it is the call site.
- `DragonDanceUI.as:302-317` maps skill 1056→node6, 1057→node2, 1058→node1, 1059→node4,
  and `earlierHeavenLabel` indexes 6/2/1/4 are fire/water/wind/earth. The set is exactly the
  `{1,2,4,6}` flip condition at :367. The claim's node mapping is right to the index.

---

## 2. R1 — `rebirth/stance-slash-multipliers-parity` is REFUTED

The claim: *"only in the android v0.682 bundle — I grepped the whole v0.717 desktop tree for
the identical expressions and got zero hits, so parity is NOT established."*

The grep is honest and I reproduced it: `0.5 + 0.5 *`, `1 + 0.5 *` and `0.005` return zero
hits across `reference/decompiled/shs3_payload/scripts/`. But the grep was written against the
**android literals**, and the desktop uses a different arithmetic spelling of the same idea.
The desktop equivalent is right there, in the same shape of switch, at
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146`:

```
case §1t12220s0§:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                   // LIGHT
case §1t12221s0§:  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);      // BALANCED
case §1t12222s0§:  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);    // HEAVY
                   if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
case §1t12224s0§:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                   // REVERSED
case §1t12223s0§:  this.§1t4417s0§ = this.§1t4420s0§;                                         // DUAL, floor 100
```

So parity is not merely unestablished — it is **disproved**, and the v0.717 values are
recovered. Light 1.4 (android 1.5); Balanced 1 + 0.02·m (android 1 + 0.005·m); Heavy
0.5 + 0.04·m (android 0.5 + 0.005·m).

The second half of the claim's lane_impact is worse: *"mastery is a 0-100 percentage here,
not 0-9, so the ledger's 'mastery-9 ceiling' framing needs re-checking."* Mastery is a skill
level, and both skill tables cap it at **10**:

```
reference/extracted/skilldata.xml            1000 Light Stance Mastery   levels 1..10
                                             1001 Balanced Stance Mastery levels 1..10
                                             1002 Heavy Stance Mastery    levels 1..10
reference/extracted/android/117_Mobile_SkillData.bin  same three skills, same 1..10
```

and `MCSPlayer.as:3166` gates a mechanic on `this.lightMastery >= 3`, which is only meaningful
on a 1-10 scale. The android build's `* 0.01` coefficient is a rebalance (or a bug) — it is
not evidence of a 0-100 stat. The ledger's mastery framing was closer to right than the claim
says; it is off by one, not off by an order of magnitude.

## 3. R2 — `rebirth/unlock-gate-is-stat-threshold`: right gate, wrong payload

The thresholds are real and I enumerated every elemental-gated skill in
`reference/extracted/skilldata.xml`, resolving each `displayname` through `strings.json`:

| threshold | skills |
|---|---|
| stat ≥ **10** | Fire Breath (1013), Fire/Water/Wind/Earth Element Trap (1025-1028), Fire/Water/Wind/Earth Kunai (1029-1032), Ground Punch (1033), Wind Combo (1034), Water Stomp (1035) |
| stat ≥ **30** | Dragon Dance Step: Fire/Water/Wind/Earth (1056-1059), **Inferno / Tsunami / Tornado / Earthquake (1070-1073)** |
| stat ≥ **60** | Dragon Dance Step: Fire/Water/Wind/Earth **II** (1060-1063) |

The 10/30/60 gate is HELD. But "the entire usable elemental kit lands on the FIRST rebirth
into that element" is false on this table — the ultimate and both Dragon Dance steps do not.
A rebuild that took the claim at its word would hand a Dan-1 character Inferno.

Secondary: the claim's own tier labels are inconsistent with its own scheme. 1056-1059 sit at
the 30 gate (called "tier-3 passives" in `rebirth/dragon-dance-bagua-input`); the 60 gate is
1060-1063. And the 10-gate skill for fire is Fire Breath, not a "tier-2 attack".

## 4. R3 — `rebirth/element-circle-art`: the art is held

STILL_UNHELD is a respected answer and I did not want to refute one. But this one is wrong,
and the surveyor's own stated close-path had already been walked:

> Close-path: locate the exported symbol for InteractUI's elementCircle MovieClip in the asset SWF

`reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9` gives
`[Embed(source="/_assets/assets.swf", symbol="symbol1691")]`, and the extraction of that symbol
is already on disk at **`reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png`** and
`2.png` (856×853, extracted 2026-07-26). `elementCircle` is declared at
`§1t401s0§.as:77` and switched on at :574 — in the android twin, `InteractUI.as:551-560`
shows it is `UIMODE_REBIRTH`, `menuState == 1`, with `detailstext` = string 611 "Choose an
element to specialize in." So the sprite in that PNG is the rebirth element picker.

I cropped `1.png` at (500,260)-(850,420) and upscaled ×4 (white matte behind the alpha,
because the export is transparent). Visible in the crop: a large dark disc behind the
character, the element name **"WIND"** in the game's brush face below centre, and two arc
labels at the disc's flanks reading **"…AGA[INST]"** on the left and **"…NG …AINST"** on the
right — i.e. STRONG AGAINST / WEAK AGAINST. That is the layout of the counter-wheel the unit
proves in `rebirth/element-counter-wheel`, drawn.

Two honest limits, so this does not over-swing the other way:
- the export is a **flattened** render of every layer of symbol1691, so the character bust and
  the crops/quest panels overlay the disc; the circle is legible but not clean.
- the claim's *narrow* sentence — "no frame in any of the 113 frame directories" — is
  separately plausible and I did not disprove it. `docs/gauntlet/L0/index/frames.json` does
  hold 113 directories. The frame-vs-doc precedence rule genuinely never fired here.

The correct verdict is **PARTIAL**, not STILL_UNHELD: layout and the label ring are held from
an A2 asset export; a clean per-layer render and the exact hues are not yet held.

---

## 5. Corrections that do not sink a claim

- **`STAT_HGOLD` is Heavenly Gold, the premium currency — not coins.** The +25/+100 numbers
  are exactly right, but `StatsManager.as:2669-2682` names it `getHeavenlyGold` /
  `addHeavenlyGold`, and :2699 spends it through `QueryManagerPIO.debitPayVaultCoins`. Coins
  are a different stat (`STAT_GOLD`, HUD anti-cheat at 10000, `OverworldHUD.as:1338`).
  Whatever the economy lane names its config key, rebirth pays out **premium** currency.
- **Dan 1 shows no kanji.** `InventoryUI.as:2277` sets `danfield.text = ""` at STAT_DAN 0 and
  `PlayerPanel.as:385` sets `dantext = ""`. String 455 `(初段)` exists in the table but is
  never displayed. The wired range is 456–464.
- **`FireBreathProjectile`'s `new Damage(...)` is line 53, not 51.** Off by two; the quote is
  otherwise verbatim.
- **The statue's RNG permutation is Later-Heaven-only.** `Obj_DragonDanceStatue.as:38` gates
  the whole `rng`/`dice` block on `props >= 8`; the else at :67 takes `sequence = props`
  literally. Earlier Heaven statues are not permuted.
- **The SP formula lives in `unAssignSkillPoints`, a respec path.** Callers are
  `InventoryUI.as:990`; `doRebirth` does not call it. The formula is still the authoritative
  total-SP accounting, but it is not literally executed by the rebirth.

## 6. Things the unit missed that I hit while verifying

Reported in full in the structured output. The two that matter most are both in combat-core,
and both come from the same desktop file I had to open to test R1:

1. **The wiki's "0.9 / 1.2 / 1.4" are the v0.717 stance numbers at mastery 10**, and they are
   damage, in `§1t99s0§.as:3255-3276`: Light `×(0.5 + 0.04·m)` → 0.9, Balanced `×(1 + 0.02·m)`
   → 1.2, Heavy/Dual/Reversed `×1.4` flat. The ledger's "mastery-9 ceiling" is off by one.
2. **Crit is ×1.3 and it is gated on a full slash meter** — `§1t99s0§.as:3272-3274`:
   `if(this.§1t4414s0§ == this.§1t4415s0§) return _loc2_ * 1.3 + this.§1t1243s0§;`. That is
   combat-core blocker ② (1.3 vs 3) and blocker ⑤ (the Focus/crit gating rule) in one line.
   The android twin at `MCSPlayer.as:3215-3222` uses 1.2 / 1.5-for-light on `reload == maxreload`
   — another build divergence, and the desktop wins.

## 7. Score

The unit asked for 88. On my read the citation hygiene deserves that, but the three failures
are not cosmetic: one inverts a cross-lane instruction to combat-core, one would over-grant an
elemental kit, and one calls unrecovered a PNG that has been on disk since July. **80** is the
number I would defend, with the note that the same desktop file that broke R1 also hands
combat-core two of its five blockers — so the lane's net contribution went *up*, not down.
