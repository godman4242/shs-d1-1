# CITE-LENS REVIEW — unit: rebirth-elements

**Critic:** blind (surveyor reasoning not seen). **Lens:** over-claiming / cite resolution.
**Method:** every cite below was opened first-hand this pass. Every line number was
re-derived with `grep -n` / `sed -n` rather than trusted. Ledger quotes were checked
against `docs/research/REBUILD_READINESS.md`.

**Headline:** 18 of 19 claims survive. **1 claim is REFUTED as materially wrong
(`rebirth/stance-slash-multipliers-parity`)** — its negative grep was a false negative;
the v0.717 desktop build *does* carry the same stance switch, with **different numbers**.
Parity is not "unestablished", it is **disproven**, and the numbers the claim publishes
are the wrong build's. Four smaller mis-statements are logged as corrections, not refutations.

---

## 1. Cite-resolution table (every line number re-derived)

| claim | cite resolves? | quote verbatim? | notes |
|---|---|---|---|
| string-table-resolved | ✅ 2533 entries | ✅ 610 exact | 24/24 elemental skill names **and** descs resolve (checked programmatically) |
| dan-ladder-titles | ✅ InventoryUI.as:2285-2288 exact | ✅ | ⚠ string 455 (初段) is **never displayed** — see C-1 |
| dan-achievements-prove-ten | ✅ 114_…:463-470 exact | ✅ (`<img>` elided) | STAT_DAN=25 confirmed StatsManager.as:220 |
| element-picker-uidata | ✅ 90_…:94-105 exact | ✅ dev comment verbatim | |
| elemental-skill-tooltips | ✅ skilldata.xml:1882/1884/1889/1890 exact | ✅ | |
| dragon-dance-teachable | ✅ strings 6117/6125/750 | ✅ | |
| tenth-gold-is-100 | ✅ :2644-2652, const :228 & :254 exact | ✅ | ⚠ currency id — see C-2 |
| dan-scaled-slash-length | ✅ :1915-1919, :2344-2348, BankUI:264 exact | ✅ | ⚠ unit scale — see F-6 |
| post-rebirth-sp-economy | ✅ :2156, :2598, levelCap :76 exact | ✅ | |
| unlock-gate-is-stat-threshold | ✅ :1884 / :1726 / :985 / InteractUI:849-855 / desktop :873-881 all exact | ✅ | strengthened, see F-9 |
| elemental-damage-ladder | ✅ range; ⚠ `:51` is actually **:53** | ✅ | C-3 |
| aoe-radii-per-element | ✅ all 5 line numbers exact | ✅ | |
| dragon-dance-bagua-input | ✅ :70-71, :354-355, :367-369, :302-334 exact | ✅ | |
| kanji-statue-bonus | ✅ :37-62, :185, :224-226, :238-240 exact | ✅ | ⚠ over-generalised — C-4 |
| element-counter-wheel | ✅ :1836, MCSPlayer:260, desktop :2270 exact | ✅ | both builds agree |
| mitigation-flat-min1 | ✅ :3347-3357, :3420 exact | ✅ | |
| **stance-slash-multipliers-parity** | ✅ android lines exact — **negative grep is FALSE** | ✅ android only | **REFUTED — F-1/F-2** |
| element-circle-art | n/a (STILL_UNHELD) | — | frames.json really has 113 dirs; `elementCircle` really exists |
| element-status-effects | n/a (STILL_UNHELD) | — | honest; narrowed by F-10 |

---

## 2. THE REFUTATION

### R-1 · `rebirth/stance-slash-multipliers-parity` — **REFUTED, material**

The claim says: *"I grepped the whole v0.717 desktop tree for the identical expressions
and got zero hits, so parity is NOT established."* The grep is literally true and
completely misleading. Searching for the **android literals** in an **obfuscated** tree
can only ever fail. Searching for the *code shape* finds it immediately:

```
$ for f in $(grep -rl "\* 1\.5;" reference/decompiled/shs3_payload/scripts/); do grep -q "< 100" "$f" && echo "$f"; done
reference/decompiled/shs3_payload/scripts/§1t99s0§.as
```

`§1t99s0§.as` is the desktop `MCSPlayer` (`§1t4420s0§` = `baseSlashLength`, initPlayer
param 10; `§1t4422s0§`/`§1t4423s0§` = balanced/heavy mastery, params 13/14 — identical
signature to android `MCSPlayer.as:182`). Its stance switch, **v0.717**:

```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as
3094:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                   // LIGHT
3105:  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);     // BALANCED
3116:  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);   // HEAVY
3117:  if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
3131:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                   // REVERSED
3142:  this.§1t4417s0§ = this.§1t4420s0§;                                         // DUAL, floor 100
```

versus the android v0.682 the claim publishes (`MCSPlayer.as:3030/3041/3052`):
`1.5` · `(1 + 0.5·m·0.01)` · `(0.5 + 0.5·m·0.01)`.

**Every one of the three multipliers moved between builds.** Light/Reversed 1.5 → **1.4**;
balanced slope 0.005 → **0.02** per mastery point; heavy slope 0.005 → **0.04**. Only the
100 floor and the DUAL passthrough survived. So the claim's headline —
*"The per-stance slash-length multipliers are recovered (Light x1.5 …)"* — states the
**wrong build's numbers** for the recreation target, and its verdict rationale
("parity is NOT established") understates a fact that is now established in the negative.
By the surveyor's own rule in `rebirth/tenth-gold-is-100` ("the desktop value wins"),
1.4 / 1+0.02m / 0.5+0.04m is what a v0.717 recreation must ship.

Its `lane_impact` is separately wrong: *"mastery is a 0-100 percentage here, not 0-9"*.
Mastery is a **skill level** on skills 1000/1001/1002, and those skills carry exactly
**10 `<level>` blocks, max `<value>` 10** (`reference/extracted/skilldata.xml`, skill 1000
starts :4). Both builds gate abilities on it at 3/4/5 — android `MCSPlayer.as:3174-3176`
(`canFlipUp = balancedMastery >= 3`), desktop `§1t99s0§.as:3231-3233`. A 0-100 stat is not
gated at 3.

---

## 3. Corrections (claim stands, detail is wrong)

**C-1 · `dan-ladder-titles`: 初段 is never shown.** The claim says the ladder displays
"kanji titles 初段…十段 (strings 455–464)". The switch it cites says otherwise:

```
reference/decompiled/shs3_android_payload/scripts/InventoryUI.as
2274:  switch(StatsManager.getPlayerStats(StatsManager.STAT_DAN))
2276:     case 0:
2277:        this.danfield.text = "";
```
`grep -rn "getString(455" reference/decompiled/shs3_android_payload/scripts/` → **no hits**;
same in the desktop tree. The real map is STAT_DAN 0 → *blank*, 1→456 (弐段) … 9→464 (十段),
default→464. String 455 exists in the table but is dead copy. Everything else in the claim
(shogo at 3-5 Renshi / 6-7 Kyoshi / 8-9 Hanshi, cap at 9, displayed = STAT_DAN+1) is exact.

**C-2 · `tenth-gold-is-100`: it is the *premium* currency.** `STAT_HGOLD` is **12**
(`StatsManager.as:194`); `STAT_GOLD` — the coin/mon wallet — is **11** (`:192`). The
rebirth reward writes HGOLD. A recreation that credits 25 coins instead of 25 premium Gold
has implemented the wrong line. The claim's arithmetic and cites are otherwise exact.

**C-3 · `elemental-damage-ladder`: off-by-two pointer.**
`grep -n "damageObj = new Damage" FireBreathProjectile.as` → **53**, not the cited `:51`.
The quoted text is verbatim and the `:15-52` range covers the ladder correctly; noted only
so the next lane does not chase a dead pointer. `Damage.as:50` is exact.

**C-4 · `kanji-statue-bonus`: the RNG applies to half the statues.**
`Obj_DragonDanceStatue.as:37` `if(this.num >= 8)` guards the whole permutation block; the
else branch, `:65-68`, is `sequence = props` — a single-node dance for the Earlier-Heaven
statues. The claim reads as if every statue demands a 4-node permutation. AP cost 2,
100 px range and the `setStat(40002 + props, 1)` permanent unlock are exact as cited.

---

## 4. New findings this pass (things the surveyor did not have)

**F-1 · v0.717 stance multipliers recovered** — see R-1. Overturns ledger §3 #3 *and*
claim 17.

**F-2 · Mastery is a 1..10 skill level, not a percentage** — see R-1. Ledger §3 #3's
"MASTERY-9 CEILING" framing needs re-derivation in combat-core's own lane.

**F-3 · The wiki's 300/200/100 look like mastery-ZERO base values, not a mastery-9
ceiling.** Arithmetic over two quoted lines, offered as a lead not a fact:
`InputManager.as:51 internal static var maxDistance:int = 200;` (the shipped default) ×
android {1.5, 1.0, 0.5} = **300 / 200 / 100 exactly**. Ledger §3 #3 asserts the opposite
("ceiling values, not base"). Under the desktop numbers the same base gives 280/200/100.
Either way the ledger's reading is contradicted at mastery 0, not confirmed at mastery 9.

**F-4 · The Dan ladder is held in the TARGET build, in ASCII, with no android caveat.**
`reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565` hardcodes the romaji ladder:
```
532: switch(dan)
533:   case 0:  dantext = "";
538:            dantext = "(nidan)";
541:            dantext = "(sandan)";
544:            dantext = "(yondan) "  + §1t1521s0§.getString(465);   // Renshi
547:            dantext = "(godan) "   + ...(465);
550:            dantext = "(rokudan) " + ...(465);
553:            dantext = "(nanadan) " + ...(466);                    // Kyoshi
556:            dantext = "(hachidan) "+ ...(466);
559:            dantext = "(kyudan) "  + ...(467);                    // Hanshi
562:            dantext = "(judan) "   + ...(467);
```
This is stronger than the claim's evidence: it is the **v0.717 web build**, it needs no
string table, and it settles ledger §3 #7's "garbled source" outright — **`(kyudan)` is
STAT_DAN 8 = displayed Dan 9**, so the wiki's "dan rank 5 (kyudan)" collapsed two numbering
layers exactly as the surveyor guessed, now proven rather than inferred. It also
independently confirms C-1 (dan 0 → empty string).

Corollary: the desktop build calls `getString(458)`/`(465)` at `§1t5957s0§.as:3073-3074`
with the **same numeric ids** as the android bundle — direct evidence that
`118_Mobile_Lang_EN.bin` ids are valid for v0.717, which is the strongest parity evidence
anyone in this run has produced for the S0-3 caveat.

**F-5 · Slash length is in 800×480 LOGICAL STAGE units, not screen px.** Claim 8 says
"stage pixels" and is literally right, but the qualifier is load-bearing and missing:
- `StatsManager.as:80/82` (android) and `§1t1523s0§.as:104/106` (desktop): `stageWidth=800`,
  `stageHeight=480`, both builds identical.
- `InputManager.as:342-343`: `mouseX = (stageMC.mouseX - StatsManager.stageOffsetX) / StatsManager.stageScale;`
  — the slash budget is consumed in **unscaled stage space**; `stageScale` is re-applied only
  at draw time (`:472-478`).

So the Dan-0 asymptote of 210 is 210/800ths of the play field. Anyone measuring blade span
in a 1080p frame must divide by the frame→stage factor (≈2.25–2.4) before comparing.
Without this, combat-core blocker ① gets "answered" with a number that is ~2.3× too small.

**F-6 · The L11–80 XP curve is NOT unrecoverable — the whole table is on disk, twice.**
Cross-lane, found while checking `levelCap`. `StatsManager.as:78` (android) and
`§1t1523s0§.as:364` (desktop) each hold a **99-entry** cumulative XP array, and they are
**byte-identical between builds** (diffed programmatically this pass):
`[0,550,1450,2950,5150,8350,…,25395800,29395800]`, consumed by the level lookup at
`§1t1523s0§.as:2013/2024/2029`. Ledger `docs/research/REBUILD_READINESS.md:200` blocker ②
— *"L11–80 XP curve — likely unrecoverable … Keep the extrapolation as labeled INFERRED"* —
is dead. This is the single largest ledger overturn available in the progression lane and
neither the rebirth survey nor (per its own text) the ledger had it.

**F-7 · The elemental gate table, complete.** Corroborates claim 10 and adds the roster.
All 24 element-gated skills, by threshold (`reference/extracted/skilldata.xml`, names via
`strings.json`):
- **qty 10 (1st rebirth), 12 skills:** Fire Breath (1013); Fire/Water/Wind/Earth Element
  Trap (1025-1028); Fire/Water/Wind/Earth Kunai (1029-1032); Ground Punch (1033),
  Wind Combo (1034), Water Stomp (1035).
- **qty 30 (3rd), 8 skills:** Dragon Dance Step Fire/Water/Wind/Earth (1056-1059) and the
  four ultimates Inferno/Tsunami/Tornado/Earthquake (1070-1073).
- **qty 60 (6th), 4 skills:** Dragon Dance Step … **II** (1060-1063).
With `InteractUI.as:849-855` granting +10 (or +20 at STAT_DAN 8), the 1×/3×/6× reading is
exact, and note the ultimates sit at the **3×** tier, not the 1× tier.

**F-8 · The status-effect question is narrower than "unverified".** `Damage.as:26-47` is the
complete field list of the damage packet: `damage, stance, launchType, attackerlvl,
piercingDamage, fireDamage, waterDamage, windDamage, earthDamage, flyVelX, flyVelY,
victimPosX`. **There is no buff/DoT/status field at all**, and `grep -n "buff"` over
`FireBreathProjectile.as` and `BigFireBreathProjectile.as` returns nothing. Any elemental
status would have to be applied outside the damage packet. The surveyor's refusal to assert
"none exists" remains correct, but the search space is now one function
(`NPCManager.checkHitObject`) rather than a system.

---

## 5. What I did not challenge

`element-circle-art` and `element-status-effects` are honest STILL_UNHELDs and I confirmed
both are real rather than lazy: `frames.json` does contain exactly 113 directories, and
`InteractUI.as:63 public var elementCircle:MovieClip;` (`:171` hidden, `:559` shown) proves
the named close-path exists. The "frame wins" invariant genuinely never fired in this lane —
there is no frame of the rebirth flow to weigh against the code.

**Score comment:** the lane's evidence is real and unusually well-cited; but 88 was set
partly on a claim (17) that publishes the wrong build's numbers under a PARTIAL flag. With
R-1 applied and F-1/F-4/F-6 added, the lane is *better* on the Dan ladder and *worse* on the
stance table than the survey reports.
