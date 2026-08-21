# t1-overturns-08 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-08.json` — 24 claims, all 24 judged, 0 skipped.
Every verdict below rests on an artifact **I opened in this session**. Where I only
re-read another agent's prose I would have written STILL_UNHELD; I did not.

Result: **20 survive, 4 refuted** (2 fatal-to-the-claim mis-attributions, 2 with a
false clause inside an otherwise sound finding). 11 overturns upheld, 9 claims that
are TRUE but do not actually knock over the ledger sentence they point at.

---

## Tooling note that nearly cost me a correct verdict

The §0 briefing says "⚠ THE ANDROID BLOBS ARE UTF-16LE. A byte-level grep returns 0
hits and WILL fool you into wrongly refuting a sound claim."

**That is false for `reference/extracted/android/90_InteractUI_UIData.bin`.** Its first
bytes are literally `<?xml version="1.0" encoding="UTF-8"?>\r\n`. Decoded as UTF-16LE
it yields 3 lines of garbage and 0 hits for the quoted comment; decoded as UTF-8 it is
314 lines and line 97 is the quoted text verbatim. Decoding *by the briefing's rule*
would have produced a wrong REFUTED on `rebirth/element-atk-budget-is-100`.
Encoding must be sniffed per-blob, not assumed.

---

## REFUTED (4)

### R1 · `skills-meters/kunai-ammo-cost` — "traps cost four kunai each" is a misread
The two quoted lines resolve. `SkillSlotButton.as:161` and `:172` are exactly as quoted.
But `:172` sits inside the branch opened at `:170`:

    170:  else if(this._skillId == SkillManager.SKILL_WINDMILL)
    172:     ammo = Math.floor(StatsManager.getStat(2501) / 4);

`SkillManager.SKILL_WINDMILL:int = 1051` (`shs3_android/scripts/SkillManager.as:78`),
and skill 1051 resolves through `skilldata.xml` → `strings.json` to **"Windmill
Shuriken"**, whose own shipped description reads *"Throws a giant boomerang shuriken
that is able to hits multiple enemies.\n\nUses 4 kunai."* The `/4` is the Windmill
button's remaining-casts readout. It has nothing to do with traps.

Traps are in the **`/1`** branch. `SkillSlotButton.as:118-119`:

    118:  internal function usesKunaiAmmo(_skillId:int) : Boolean
    119:     return _skillId == SkillManager.SKILL_KUNAITHROW || ... || _skillId == SkillManager.SKILL_TRAP
              || _skillId == SkillManager.SKILL_TRAPFIRE || ... || _skillId == SkillManager.SKILL_TRAPEARTH;

and the deduction itself is 1, in both bundles:
* web `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:503-514` — cases
  `§1t10134s0§`..`§1t10138s0§` (= 1024, 1025, 1026, 1027, 1028 = Lay Trap + the four
  Element Traps) → `:510 if(...§1t9714s0§(2501) == 0)` / `:514 ...§1t9713s0§(2501,-1);`
* android `shs3_android/scripts/SkillManager.as:468` `case SKILL_TRAPFIRE:` → `:474
  if(StatsManager.getStat(2501) == 0)` / `:479 StatsManager.changeStat(2501,-1);`

Surviving and correct: traps and elemental kunai do consume kunai ammo on top of Chi,
the button greys out at ≤0, and the lane_impact's "categories 7/8/9/10 hold precisely
24 skills" is right — I counted 24.

### R2 · `skills-meters/elemental-kunai-ammo-costs` — "the kunai family … three tiers" is not what those blocks are
All six line cites are exact (`§1t120s0§.as:266, :270, :319, :323, :347, :351`). The
attribution is wrong on every tier above the first.

Mapping the ids from the constant block at `§1t120s0§.as:8-114` (`§1t10123s0§=1000`,
two lines apart thereafter):

| block | cases | skill ids | what they are | ammo |
|---|---|---|---|---|
| `:259-270` | `§1t10130s0§,§1t10139s0§..§1t10142s0§` | 1007, 1029-1032 | Throw Kunai + the four elemental Kunai | **−1** |
| `:316-323` | `§1t10158s0§` | **1051** | **Windmill Shuriken** — category 6, `req` = skill 1010 Smoke Bomb, **no element requirement** | −4 |
| `:344-351` | `§1t10176s0§` | **1077** | **has no `<skill>` block in `reference/extracted/skilldata.xml` at all** | −8 |

So the kunai family spends 1 — uniformly, across all five of its members. There is no
1/4/8 kunai ladder. And "three of the *elemental* constants are unheld blanks are
closed" is false twice over: 1051 carries no `<req><has><id>28|29|30|31</id>` and 1077
is not in the skill table. The claim also misses `:503-514`, the trap block on the same
ammo pool.

### R3 · `rebirth/romaji-dan-ladder` — "absent from … the android build" is false
The ladder itself is real and I verified it line for line (see H12 below). But the
distinguishing clause fails a one-line grep:

    reference/decompiled/shs3_android/scripts/PlayerPanel.as:388   dantext = "(nidan)";
    reference/decompiled/shs3_android/scripts/PlayerPanel.as:406   dantext = "(hachidan) " + LangManager.getString(466);
    reference/decompiled/shs3_android/scripts/PlayerPanel.as:409   dantext = "(kyudan) "   + LangManager.getString(467);
    reference/decompiled/shs3_android/scripts/PlayerPanel.as:412   dantext = "(judan) "    + LangManager.getString(467);

`§1t408s0§.as` **is** the web PlayerPanel — same class, same switch, same strings. The
romaji ladder is not a desktop addition at all. (The other half of the clause, "absent
from the string table", is true: 0 hits for `dan)` across all 2,533 entries of
`docs/gauntlet/L0/index/strings.json`.) Also `:582` is off by one — `grep -n
"playerText.text"` puts the render at **`:581`**.

The true content survives intact inside `rebirth/romaji-dan-ladder-in-v0717`, which I
upheld and whose line numbers are all exact.

### R4 · (no fourth refutation of a whole finding)
R1–R3 are the refutations. Listed separately below are the **material corrections** to
findings I let stand.

---

## MATERIAL CORRECTIONS to findings that survive

### C1 · `skills-meters/canchangestance-is-a-named-gate` — the gate is real, the NAME is not
`§1t99s0§.as:3048-3051` and `:3058-3063` are verbatim exact. But `§1t4470s0§` is **not**
`canChangeStance()`. Android's `canChangeStance()` is `MCSPlayer.as:2965-2968`:

    2967: return actionState == IDLE_STATE || actionState == POSE_STATE || actionState == RUN_STATE
          || actionState == WALK_STATE || actionState == SKILL_CHICHARGE_STATE
          || actionState == FLINCH_STATE && (prevActionState == IDLE_STATE || ...);

— body-identical to web **`§1t4469s0§`** at `§1t99s0§.as:3043-3045`, and carrying **no
reload term**. `§1t4470s0§` is a web-only wrapper with no android twin; its symbol is
obfuscated and its real name is unrecoverable. Likewise `§1t4471s0§` = `canSmokeAway()`
and `§1t4472s0§` = `nextStance()`, and the web threshold is a flat `< 48`, not android's
`maxreload / 6` (192/6 = 32 ≠ 48).

**The overturn still stands**, and I proved it independently rather than taking the
claim's word: `§1t113s0§` is the web **BattleUI** — it owns `§1t5198s0§` (android
`setStanceColor`) at `:293` and `§1t5205s0§(int,int)` (android `updateReload`) at `:326`,
and `§1t99s0§.as:3175` calls `§1t113s0§.instance.§1t5198s0§()` from setStance exactly
where android calls `BattleUI.instance.setStanceColor(n)`. Its in-combat handler:

    §1t113s0§.as:468   internal function §1t5207s0§() : *
    §1t113s0§.as:470      if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
    §1t113s0§.as:472         §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
    §1t113s0§.as:473         §1t1523s0§.§1t9586s0§().§1t4472s0§();
    §1t113s0§.as:476      else
    §1t113s0§.as:478         §1t88s0§.instance.§1t1516s0§("Snd_error");

A hard lock does not ship an error beep on the refusal branch. `REBUILD_READINESS.md:158`
("In-combat stance is HARD-LOCKED in v0.717") and `SHSD_MASTER_REFERENCE.md:388`
(`| **In combat** | **Hard lock** … | [CONTRACT] |`) — both verbatim-verified at those
exact lines — are wrong at code level, and the second is graded [CONTRACT].

### C2 · `rebirth/element-circle-art-is-on-disk` — there is no "WEAK AGAINST"
Cite is exact (`§1t401s0§.as:9` Embed symbol1691, `:77` `public var elementCircle:MovieClip;`,
`:574` `this.elementCircle.visible = true;`) and the crop shows everything it says.
But its text calls the ring a "STRONG AGAINST / WEAK AGAINST label ring". It isn't.
I opened the unoccluded source, `DefineSprite_1650/1.png`: **all four** arc labels read
STRONG AGAINST. The occluded fragments "…AGA[INST]" and "…NG …AINST" were read as
STRONG/WEAK; the right one is the tail of another STRONG AGAINST.

### C3 · `skills-meters/focus-reload-meter-web-numbers` — one android rule stated as web
Nine cited ranges, all nine exact, web and android — including the web drain block at
`§1t99s0§.as:3299-3311`, so the per-stance /2 · ×1 · ×1.5 scaling is web-verified and not
extrapolated (I had expected to catch this and did not). The one slip is the closing
sentence: "a stance switch is refused outright while reload < maxreload/6 — that is the
'CANNOT CHANGE STANCE' label visible in the longplay." `maxreload/6` is the **android**
rule (`MCSPlayer.as:2977`); the web refuses at a flat `< 48` (`§1t99s0§.as:3060`), and
192/6 = 32. The identification with the on-screen label also carries no frame path.

### C4 · minor line slips (recorded, not disqualifying)
* `rebirth/dragon-dance-ui-art-recovered` — PNG is **819×500**, not the stated 813×480;
  `[Embed symbol="symbol1810"]` is at **`:8`**, not `:7`; and lane_impact's `:358 / :362`
  are neither build's numbers (android `DragonDanceUI.as:359 / :364`, web
  `§1t5495s0§.as:374 / :379`).
* `skills-meters/focus-fill-rate-plus-one-per-frame` — `§1t4906s0§.as` seed line is
  **`:54`**, not `:53`. And "48 (bar first becomes visible)" is an unsupported gloss:
  48 is the stance gate/cost constant; nothing I opened ties it to bar visibility.
* `skills-meters/dan-caps-at-9-and-the-100-gold-tier-is-real` — quote labels `2650: else`
  and `2652: …,25);`; actual is `2649: else` and `2651: …,25);`. The other five labels
  and the cite range `:2644-2655` are exact.
* `rebirth/element-circle-art-is-held` — the stated crop `(230,80)-(620,420)` cannot
  contain EARTH (its node centre is at x≈747 in an 808-wide image); the claim also says
  "viewed whole" first, which is what carries the description. The "plain grey field" is
  a white-matte artifact — the real background is `(0,0,0,127)`, a 50%-alpha black scrim.

---

## UPHELD, with what I personally opened

**H1 `rebirth/dragon-dance-ui-art-recovered`** — I matted and viewed
`DefineSprite_1810_1t5495s0/1.png` whole at 1.6×. Every element in the quote is there:
three concentric dark-red rings, 8 white nodes with bright-green outlines at the 8
compass points each bearing a green 天, 8 dark-red bagua trigrams on an inner ring, a
taijitu centre lettered FIRE in the brush face, red ✕ button top-right. `§1t5495s0§.as:70-71`
are verbatim exact.
*Overturn NOT upheld*: ledger ④ is "Dragon Dance **input** + Kanji-statue bonus". Art is
neither. ④ does not fall from this.

**H2 `rebirth/element-atk-budget-is-100`** — the strongest claim in the packet.
`InteractUI.as:848` is `case "firerebirth":` and `:848-880` covers fire/wind/water exactly;
the desktop twin `§1t401s0§.as:873-895` is structurally identical (`§1t1235s0§`=stat 28).
`StatsManager.as:2209` is `if(getPlayerStats(STAT_DAN) < 9)`. And
`90_InteractUI_UIData.bin:97` (UTF-8) is the quoted line **verbatim**, dev comment and all:

    <option><label>1</label>…<comp>gte</comp>…<action><id>firerebirth</id></action></option> <!-- "yes" useicon >=10 dan, no element boost-->

Arithmetic: DAN 0–7 → +10 (×8 = 80), DAN 8 → +20, DAN 9 → neither branch fires and DAN
stops incrementing. Lifetime total **100**. A grep for `STAT_FIREATK|WINDATK|WATERATK|EARTHATK`
across `shs3_android_payload/scripts/` confirms `InteractUI.as:851-894` is the only
`changeStat` write to the player's base element ATK; everything else reads it, copies it
to a clone, or sets an NPC's. 4 × 30 = 120 > 100 — the Steps are provably unreachable solo.
lane_impact also checks out: `DragonDanceUI.as:368` requires `clickedArray[1] && [2] && [4] && [6]`,
and `§1t5495s0§.as:70` makes those {wind, water, earth, fire}.
*Overturn NOT upheld*: the ledger sentence "Dragon Dance unlocks at 3×/6× same-element
rebirths" is confirmed, not knocked down. This is an addition.

**H3 `rebirth/element-circle-art-FOUND`**, **H4 `…-is-held`**, **H6 `…-recovered`** —
`payload.xml:626581` is the elementCircle `PlaceObject2Tag` verbatim (`characterId="1650"
depth="37" … name="elementCircle"`). I matted and viewed `DefineSprite_1650/1.png` (808×480,
confirming the stated size) and crop `(520,60)-(800,400)` at 4× LANCZOS. FIRE 火 top,
EARTH 土 right, WIND 風 bottom, WATER 水 left, four grey arcs each captioned STRONG AGAINST,
English label under each node, brush display face. Arrowheads run **clockwise**:
FIRE→EARTH→WIND→WATER→FIRE. A pixel histogram of that crop returns the claimed hexes
**exactly** — `#FF3300`, `#7D5500`, `#BBBBBB`, `#0099FF`, node fill `#333333`.
Independent corroboration I ran myself: `shs3_android/scripts/StatsManager.as:1836`
`initElementDefenseStats(WATERATK+FIREDEF, EARTHATK+WINDDEF, WINDATK+WATERDEF, FIREATK+EARTHDEF)`
— fire defence sourced from water attack, wind from earth, water from wind, earth from
fire, i.e. the identical ring. Art and AS3 agree with no measurement doc between them.
`strings.json["611"]` = "Choose an element to specialize in." ✓.
`InventoryUI.as:2286` `nametext += " <font color='#7D5500'>"` ✓ — same gold as EARTH.
*Overturn upheld* for all three: ledger ⑤ stays literally true (never filmed) but the
blocker it encodes is closed from the payload instead.

**H5 `rebirth/element-circle-art-is-on-disk`** — upheld with C2. Crop `(500,260)-(850,420)`
of the 856×853 export shows exactly what it says: dark disc behind the character bust,
WIND in the brush face below centre, arc-label fragments at both flanks.

**H7 `rebirth/elemental-gate-roster`** / **H8 `rebirth/elemental-gate-table`** — I rebuilt
the table from `reference/extracted/skilldata.xml` and it splits **12 / 8 / 4** across
qty 10 / 30 / 60, exactly as claimed, id for id: qty10 = {1013, 1025-1035}; qty30 =
{1056-1059 (passive), 1070-1073}; qty60 = {1060-1063 (passive)}. Anchors verbatim: `:988`
`<req><has><id>28</id><qty>10</qty></has></req>` under skill 1029; `:1726` qty 60 under
skill 1060 with `<passive>1</passive>` at `:1727`; `:1884` qty 30 under skill 1070 (id at
`:1879`). Names resolve through `strings.json` precisely as stated — 6066 "Fire Kunai",
6124 "Dragon Dance Step: Fire II", 6138 "Inferno", plus Water/Wind/Earth Element Trap,
Ground Punch, Wind Combo, Water Stomp, Tsunami, Tornado, Earthquake.
*Overturn NOT upheld* for either: the ledger's Dragon Dance sentence is correct as
written — H8's own lane_impact says so. These extend it.

**H9 `rebirth/hgold-is-premium-currency`** — `StatsManager.as:2669-2682` and `:2684-2711`
are verbatim exact; `getHeavenlyGold()` adds `QueryManagerPIO.instance.getPayVaultCoins()`
and the shortfall path calls `debitPayVaultCoins`. `STAT_GOLD:int = 11` (`:192`),
`STAT_HGOLD:int = 12` (`:194`); on web `§1t9413s0§:int = 12` (`§1t1523s0§.as:228`) — so the
rebirth payout at `§1t1523s0§.as:2646/2651` is to Heavenly Gold, not coins. Desktop
anti-cheat `§1t406s0§.as:1544` `if(HGOLD > 300 && DAN < 9)` ✓ and `:1581` `if((HGOLD-3)/25 > dan)` ✓.
*Overturn upheld* — the ledger's "+25 gold" is the wrong currency **and** the wrong number.

**H10 `rebirth/ledger-film-phantom-source`** — both ledger lines verbatim at the stated
numbers: `:165` "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier" and
`:205` "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)". The
contradiction is real and the adjudicator is real (`§1t1523s0§.as:2644-2652` pays 100).
A pre-rebirth longplay cannot film a Dan 8→9 payout. *Overturn upheld* — §3 #7's "film
shows" clause has no source behind it.

**H11 `rebirth/no-elemental-status-effects`** / **H12 `…-exist`** — `Damage.as` field list
runs **exactly** `:26-48` and the launch enum **exactly** `:6-24`, matching H12's cite to
the line; H11's quoted field list is verbatim. `StatsManager.as:288-312` is the complete
BUFF_* enum with every value as quoted (XP 0 … MODERATOR 12). My own negative grep across
`shs3_android_payload/scripts/*Projectile*.as` for `BUFF_|burn|poison|freeze` returns only
`redFreeze` / `StageManager.isRedFreeze()` — a global pause mechanic, not a status.
`MCSPlayer.as:3347` opens the elemental resolution (`damageObj.fireDamage - STAT_FIREDEF`,
min-1 floor) — pure damage channels. H12's launchType claim checks out too:
`BigTornadoProjectile.as:24` `Damage.LAUNCH_AIR`, `BigEarthquakeProjectile.as:27` and
`BigWaveProjectile.as:24` `Damage.LAUNCH_KNOCKDOWN`. *Overturn upheld* on the "status"
clause of ledger ①; the damage/cost/AoE clauses of ① are untouched.

**H13 `rebirth/romaji-dan-ladder-in-v0717`** — every quoted line number exact:
`:532 switch(dan)`, `:533 {`, `:538 "(nidan)"`, `:544 "(yondan) " + getString(465)`,
`:559 "(kyudan) " + getString(467)`, `:562 "(judan) " + getString(467)`. Titles resolve:
465 Renshi (cases 3-5), 466 Kyoshi (6-7), 467 Hanshi (8-9) — exactly as claimed. The
corollary is exact too: `§1t5957s0§.as:3073` `getString(465)` inside `#7D5500` and `:3074`
`this.danfield.text = getString(458)`, with `strings.json["458"] = "(四段)"` — the desktop
and `118_Mobile_Lang_EN.bin` share string ids, the best S0-3 parity evidence in this packet.
*Overturn upheld*: the game itself prints "(kyudan)" at `STAT_DAN` 8 = displayed Dan 9, so
the wiki's "garbled" datum was a faithful transcription of a real UI string.

**H14 `skilldata/web-cooldown-modifier-caps-spd-at-600`** — `§1t1523s0§.as:2289` is the
function head, `:2291 if(param1 > 600)`, `:2295 return 1 - param1 / 600 * 0.5;`, and the
×1.5 buff at `:2284` is applied **before** the cap, exactly as claimed. Consumed at
`§1t105s0§.as:318 return _loc2_ * §1t1523s0§.§1t9589s0§();`. Android `StatsManager.as:1856
if(speed > 300)` / `:1860 return 1 - speed / 300 * 0.5;` — half the per-point effect, as
claimed. I re-derived the cooldown re-pin myself: at web SPD 10 the modifier is
1 − 10/1200 = 0.991667, so 5 s → 4.958, 10 s → 9.917, 9 s → 8.925 = the measured
4.96 / 9.92 / 8.92. Web SPD 5 would give 4.98 / 9.96 / 8.96. *Overturn upheld* (ledger `:195` ④).

**H15 `skills-meters/43-sfx-event-names-in-web-bundle`** — my own
`grep -rhoE '"Snd_[A-Za-z0-9_]+"' … | sort -u | wc -l` over the web bundle returns
**43**, and the sorted list is identical to the claim's, name for name, `Snd_addStat`
through `Snd_wrScout`. S0-5 is untouched — this is the event vocabulary, not waveforms.
*Overturn NOT upheld*: the named ledger_text is the section heading `### skills-meters — 33`,
a score line, not a falsifiable assertion. True finding, wrong target.

**H16 `skills-meters/crit-is-deterministic-at-full-reload-bar`** — all four cites exact:
`§1t99s0§.as:3272 if(this.§1t4414s0§ == this.§1t4415s0§)` / `:3274 return _loc2_ * 1.3 +
this.§1t1243s0§;`; `MCSPlayer.as:3215-3221` (×1.2 non-Light, ×1.5 Light);
`BattleUI.as:262 this.crittext.visible = percentage >= 1 && this.reloadbar.visible;`;
`BattleUI.as:102 this.crittext.text = LangManager.getString(175);` with
`strings.json["175"] = "Critical Hit"`. *Overturn upheld* — ledger `:195` ⑤ said the proc
rule was "entirely absent"; it is deterministic and it is right there.

**H17 `skills-meters/dan-caps-at-9-and-the-100-gold-tier-is-real`** — `:2644 == 8`,
`:2646 …(§1t9413s0§,100)`, `:2647` the `getString(864,[…,"10"])` announcement, `:2653 < 9`,
`:2655 …(§1t9426s0§,1)` — all exact; `§1t1523s0§.as:254 §1t9426s0§:int = 25` exact;
`§1t1832s0§.as:2787 _loc1_.data.dan = …(§1t9426s0§)` exact. `strings.json["864"]` =
"[0] has rebirthed and is now Dan [1]!" and the "10" is hard-coded at the DAN-8 branch.
*Overturn upheld*, and this is the single cleanest kill of §3 #7 in the packet.

**H18 `skills-meters/focus-fill-rate-plus-one-per-frame`** — `:1203-1205` exact,
`:103 internal var §1t4419s0§:int = 48;` exact, `:191 this.§1t4419s0§ = param7;` exact, and
`grep -n "4419s0" §1t99s0§.as` returns **only those two lines** — the dead-code claim is
mine now, not the claim's. With `§1t99s0§.as:249 = 8*24` the arithmetic (192 f = 8 s,
144 f = 6 s) follows. SPD genuinely does not accelerate the crit meter in v0.717.
*Overturn upheld* (the fill third of ledger `:195` ③).

**H19 `skills-meters/focus-reload-meter-web-numbers`** — upheld with C3. Nine ranges, nine
exact, including android `MCSPlayer.as:3098-3104` `if(reload > maxreload/2) reload =
maxreload/3; else reload -= maxreload/6;` matching "cuts to a third above half, else minus
a sixth" precisely, and `StatsManager.as:1921-1930` giving the `slashusage` floor of 48.
*Overturn upheld* (ledger `:195` ③, with real numbers).

**H20 `skills-meters/focus-skill-web-effect`** — `§1t120s0§.as:18 public static var
§1t10128s0§:int = 1005;` and `:230 case §1t10128s0§: / :231 param3.§1t4414s0§ =
param3.§1t4415s0§ - 1;` — both exact. `strings.json` names 1005 simply **"Focus"**, desc
"Instantly recharges your focus bar." — the lane_impact's naming point is right.
*Overturn NOT upheld*: ledger ③ names max / fill / switch-cost. A skill's effect is none
of the three. True, but it lands next to the target.

---

## New, unclaimed, found while judging

1. **Traps cost 1 kunai, and the block that proves it is uncited by anyone.**
   `§1t120s0§.as:503-514` (web) — cases 1024, 1025, 1026, 1027, 1028 → `−1`. Android twin
   `SkillManager.as:468/474/479`. This is the artifact that settles R1 and R2.
2. **`§1t113s0§` is the web BattleUI, and `:468-480` is the in-combat stance handler.**
   Identified by `§1t5198s0§` at `:293` and `§1t5205s0§(int,int)` at `:326` against android
   `setStanceColor` / `updateReload`, and by `§1t99s0§.as:3175`. The `else → "Snd_error"`
   branch is the strongest single piece of evidence against `REBUILD_READINESS.md:158`.
3. **Skill id 1077 exists in the shipped web bundle and is absent from `skilldata.xml`.**
   `§1t120s0§.as:114 §1t10176s0§:int = 1077`, cast at `:344` for 8 kunai ammo, but no
   `<skill><id>1077</id>` block anywhere in `reference/extracted/skilldata.xml`. Either the
   extract is short a row or the id is dead. Worth a line in the salvage card.
4. **The romaji Dan ladder is cross-build, not desktop-only** — `PlayerPanel.as:388-415`
   in both android bundles. (This is what kills R3.)
5. **The `90_InteractUI_UIData.bin` encoding correction** — see the tooling note at the
   top. It contradicts the §0 briefing's blanket UTF-16LE warning and would have caused a
   wrong REFUTED.

---

24 claims in the packet · 24 judged · 0 skipped.
