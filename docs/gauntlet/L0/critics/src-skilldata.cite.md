# CITE-LENS REVIEW — unit `src-skilldata`

Packet: `docs/gauntlet/L0/worklist/src-skilldata.claims.json` — **41 claims, 41 judged, 0 skipped.**
Reviewer: blind critic (Lens 1 — over-claiming / mis-citation). I did not read `docs/gauntlet/L0/sources/skilldata.md`.
Every verdict below carries an artifact **I** opened.

---

## 0. The single biggest thing this review found

**The surveyor read combat logic out of the ANDROID v0.682 decompile and presented it as the OG game's
numbers. The WEB v0.717 decompile is on disk and its combat constants are DIFFERENT.**

Version proof, both opened by me:

| build | file | line | text |
|---|---|---|---|
| Android v0.682 | `reference/decompiled/shs3_android/scripts/StatsManager.as` | 30 | `public static var clientVersion:Number = 0.682;` |
| Web **v0.717** | `reference/decompiled/shs3_payload/scripts/§1t120s0§.as` … actually `§1t1523s0§.as` | 36 | `public static var §1t9323s0§:Number = 0.717;` |

Class mapping I established myself (structural, not guessed):
`§1t1523s0§` = StatsManager (has the byte-identical `return int(120 + Math.floor(...))` at :2347 and
`return 48 + (...) * 6;` at :2276), `§1t99s0§` = MCSPlayer (15-param `initPlayer` at :183 with
param12/13/14 = light/balanced/heavy mastery), `§1t105s0§` = XMLSkill (`.cooldown * 24` at :308/:316),
`§1t120s0§` = SkillManager (`§1t10163s0§:int = 1064` at :88), and the stance ints are identical in both
builds (`§1t99s0§.as:27-35` = 0..4 vs `MCSPlayer.as:27-35` = LIGHT/BALANCED/HEAVY/DUAL/REVERSED 0..4).

### The measured divergences

| quantity | ANDROID v0.682 | **WEB v0.717 (the target)** |
|---|---|---|
| skill-cooldown modifier | `if(speed>300) speed=300; return 1 - speed/300*0.5;` `StatsManager.as:1854-1861` | `if(param1>600) param1=600; return 1 - param1/600*0.5;` `§1t1523s0§.as:2289-2295` |
| reload/Focus bar max | `this.maxreload = 5 * 24;` (120 f = 5 s) `MCSPlayer.as:239` | `this.§1t4415s0§ = 8 * 24;` (192 f = **8 s**) `§1t99s0§.as:249` |
| stance-switch reload cost | `>half → /3, else −1/6` `MCSPlayer.as:3098-3105` | flat `reload -= 48` `§1t99s0§.as:3160-3166` |
| reach: Light | `base * 1.5` `MCSPlayer.as:3030` | `base * 1.4` `§1t99s0§.as:3094` |
| reach: Balanced | `base * (1 + 0.5*m*0.01)` `:3041` | `base * (1 + 0.2*m*0.1)` `§1t99s0§.as:3105` |
| reach: Heavy | `base * (0.5 + 0.5*m*0.01)`, floor 100 `:3052-3055` | `base * (0.5 + 0.4*m*0.1)`, floor 100 `§1t99s0§.as:3116-3120` |
| reach: Reversed | `base * 1.5` `:3067` | `base * 1.4` `§1t99s0§.as:3131` |
| damage: Light | `base*(0.5+0.5*m*0.01)` `:3205` | `base*(0.5+0.4*m*0.1)` `§1t99s0§.as:3262` |
| damage: Balanced | `base*(1+0.5*m*0.01)` `:3208` | `base*(1+0.2*m*0.1)` `§1t99s0§.as:3265` |
| damage: Heavy/Dual/Rev | `base*1.5` `:3213` | `base*1.4` `§1t99s0§.as:3270` |
| **crit** | `reload==maxreload → ×1.5 (Light) / ×1.2 (other) + STAT_CRITICALDMG` `:3215-3222` | `reload==maxreload → **×1.3 flat** + STAT_CRITICALDMG` `§1t99s0§.as:3272-3275` |

Identical in both: base slash length `120 + floor((90 + DAN*5)*SPD/(20+SPD))`
(`StatsManager.as:1915-1919` ≡ `§1t1523s0§.as:2344-2347`); `getBaseReload = 48 + SPD*6`
(`:1839-1842` ≡ `:2276`); `cooldown * 24` (`XMLSkill.as:300/:308` ≡ `§1t105s0§.as:308/:316`);
per-slash reload drain Light `/2`, Balanced+Reversed `×1`, Heavy+Dual `×1.5`
(`MCSPlayer.as:3246-3258` ≡ `§1t99s0§.as:3299-3311`); reload fills `++reload` once per tick
(`MCSPlayer.as:1158-1160` ≡ `§1t99s0§.as:1203-1205`).

**Consequence:** the skilldata **XML** is byte-identical across builds (I reproduced that — see claim 14),
but the **AS3 is not**. `skilldata/read-android-not-web` prescribes exactly the wrong working rule and is
the root cause of five wrong numbers in this packet.

---

## 1. Verdict table

`R` = refuted. Severity: **F**atal / **M**aterial / **m**inor.

| # | claim id | R | sev | one-line reason | artifact I opened |
|---|---|---|---|---|---|
| 0 | art-anim/engine-tick-is-24fps | — | m | 24 fps confirmed in BOTH builds; but "maxreload is initialised as 5 * 24" is v0.682 — web is 8*24 | `XMLSkill.as:300,308`; `§1t99s0§.as:249` |
| 1 | combat-core/five-stances-not-three | — | — | verbatim; and I confirmed 5 stances in the WEB build too | `MCSPlayer.as:27-35`; `skilldata.xml:1947-1969` |
| 2 | combat-core/mastery-domain | — | m | honest STILL_UNHELD; I resolved it (see NEW-4) — not a refutation | `§1t99s0§.as:3105,3116`; `StatsManager.as:1834` |
| 3 | combat-core/stance-reach-formula | **R** | M | base formula holds in both builds; the per-stance multipliers are v0.682-only | `§1t99s0§.as:3091-3155` |
| 4 | economy/coin-cap-weight-cap-mining-tiers | — | m | every string + line exact; ore ladder IS already in the ledger's world row | `skilldata.xml:531-574,420-498,844-887` |
| 5 | enemies-ai/npcs-run-on-skilldata | — | — | all four cites verbatim | `EnemyPlayer.as:825-829,1079`; `EnemyElite.as:197-203` |
| 6 | meta-social/pvp-rooms-and-a-cut-steal-skill | — | — | every cite exact, including the 1023 gap | `StealActionIcon.as:5-6`; `GenericActionButton.as:191-193` |
| 7 | progression/required-is-skill-points | — | — | verbatim, ladder = 46 SP confirmed | `XMLSkill.as:253-263`; `skilldata.xml:73-79` |
| 8 | rebirth-elements/24-elemental-skills-with-numbers | — | — | cat 7-10 = 6/6/6/6 = 24 confirmed by census | `skilldata.xml:607-650,1879-1894` |
| 9 | rebirth-elements/dragon-dance-is-eight-and-teachable | — | m | 8 steps / qty 30+60 / all passive / all teachable exact; "Early-Heaven" is not a game string | `skilldata.xml:1654-1669`; `strings.json["6117"],["6125"]` |
| 10 | rebirth-elements/element-gate-is-a-stat-threshold | — | — | verbatim incl. the `gte` default | `StatsManager.as:4171-4174`; `skilldata.xml:1658` |
| 11 | skilldata/24fps-tick | — | — | all three cites verbatim | `Mobile.as:117`; `XMLSkill.as:116,308` |
| 12 | skilldata/51-skill-animations | — | — | census reproduced **exactly** (1/51/547/8351) | `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin` |
| 13 | skilldata/android-web-byte-identical | **R** | m | the byte-check reproduces; "discharges the S0-3 caveat **for this unit**" does not | `§1t1523s0§.as:2289-2295` |
| 14 | skilldata/android-web-parity | — | — | I re-ran it: 1,895 lines identical, same 75 ids; scope ("any skill number or string") is correct | `117_Mobile_SkillData.bin` vs `skilldata.xml` |
| 15 | skilldata/category-11-enemy-only | **R** | M | "ZERO npcdata rows" is a **grep-pattern false negative** | `npcdata.xml:3898,3934` |
| 16 | skilldata/category-to-tree-names | — | — | 10 headers ↔ 10 categories, cross-checked against membership | `strings.json["6024"]…["6033"]` |
| 17 | skilldata/chi-costs-not-single-digit | — | — | distribution reproduced **exactly**, all 12 buckets | `skilldata.xml:1648,1353` |
| 18 | skilldata/coin-cap-carry-weight-gold-trap | — | — | I opened the frame; crop matches word for word | `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` |
| 19 | skilldata/element-stat-is-one-system | — | — | id order Fire/WIND/WATER/Earth confirmed from both sides | `StatsManager.as:226-232`; `skilldata.xml:924` |
| 20 | skilldata/elemental-values-held | — | — | :1890/:1891/:1882 verbatim | `skilldata.xml:1879-1894` |
| 21 | skilldata/enemy-range-bands | — | — | I counted: 16 / 13 / 22 / 16 — exact | `EnemyPlayer.as:30-36` |
| 22 | skilldata/focus-and-crit-not-here | — | — | correctly scoped to skilldata/XMLSkill/SkillManager; all three grep to 0 | `SkillManager.as`, `XMLSkill.as`, `skilldata.xml` (0 crit hits) |
| 23 | skilldata/hud-two-bars-a1 | **R** | M | **the frame wins**: that frame is the OVERWORLD; the in-combat HUD has THREE bars | `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` |
| 24 | skilldata/input-field-empty | — | — | `<input>`/`<imageurl>` both grep to 0; XMLSkill lines verbatim | `XMLSkill.as:18,24,60-75` |
| 25 | skilldata/orphan-buff-animations | — | — | verbatim, and I found all five anims in the blob | `MCSActor.as:636-644`; `93_…SkillsAnimationData.bin` |
| 26 | skilldata/orphan-steal-and-smithing | — | — | all seven strings exact; no `1023` in the AS3 (all hits are `11023` item ids) | `strings.json["7024"]…["7028"],["6051"],["7042"]` |
| 27 | skilldata/read-android-not-web | **R** | M | facts true, **prescribed rule refuted** — it is the root cause of #3/#30/#34/#35/#36 | `§1t99s0§.as:3255-3277` vs `MCSPlayer.as:3205-3223` |
| 28 | skilldata/shunpo-effect | — | — | :1238/:1244/:1245 + string 6085 verbatim | `skilldata.xml:1234-1248`; `strings.json["6085"]` |
| 29 | skilldata/skill-slots-3-to-8 | — | — | I counted the actives: **41**, exact | `StatsManager.as:2293-2296`; `skilldata.xml:375-418` |
| 30 | skilldata/spd-cooldown-formula | **R** | M | web caps SPD at **600** and halves the rate | `§1t1523s0§.as:2289-2295` |
| 31 | skilldata/unlock-cadence-and-stance-sp-cost | — | m | cadence 17/19 + 46 SP ladder exact; "80 SP first run" is ledger-sourced, not payload | `skilldata.xml:12-75`; `REBUILD_READINESS.md:199` |
| 32 | skills-meters/chi-cooldown-table-held | — | m | domains exact; "all 182 rows carry" is loose — 84 cd / 101 chi rows are EMPTY | `skilldata.xml` (counted) |
| 33 | skills-meters/crit-proc-rule | **R** | M | the proc rule **is** grounded — 30 lines below a passage the claim already cites | `MCSPlayer.as:3215-3222`; `§1t99s0§.as:3272-3275` |
| 34 | skills-meters/focus-is-the-reload-meter | **R** | M | identification right; **max** and **switch-cost** both wrong | `§1t99s0§.as:249,3160-3166`; `MCSPlayer.as:239` |
| 35 | skills-meters/measured-cooldowns-explained | **R** | m | reconciliation survives, but on the web formula the SPD is **10**, not 5 | `§1t1523s0§.as:2289-2295` |
| 36 | skills-meters/spd-cooldown-formula | **R** | M | duplicate of #30, same refutation | `§1t1523s0§.as:2289-2295` |
| 37 | ui-hud/skill-icons-are-gestural | — | — | all seven desc-id ↔ skill-id pairs verified in the XML | `skilldata.xml:1408,1439,1486,1501` |
| 38 | ui-hud/skill-slots-3-to-8 | **R** | M | **the frame wins**: the up-arrow the claim says is not there is visibly in slot "3" | `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` |
| 39 | ui-hud/three-slots-on-screen | — | — | I opened the crop; every detail matches | `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` |
| 40 | world-exploration/secret-areas-behind-bushes | — | — | :835-841 + string 7094 verbatim | `skilldata.xml:835-841`; `strings.json["7094"]` |

**11 refuted / 41 judged.** 0 BROKEN cites (citelint had none). All 8 QUOTE_UNVERIFIED claims
(#1, #4, #9, #13, #14, #15, #17, #35) were run down by hand: **6 held** (the quotes are paraphrases or
string-id joins a text-grep cannot resolve), **2 fell** (#15 on the npcdata grep, #35 on the SPD).

---

## 2. The refutations in full

### #15 — `skilldata/category-11-enemy-only`: a grep-pattern false negative
The claim's own evidence line reads *"grep of `<skill>NNNN</skill>` over `reference/extracted/npcdata.xml`
returns 0 for all seven."* That pattern is wrong for the file's schema. `npcdata.xml` writes
`<skill><id>N</id><lvl>L</lvl></skill>`, so `<skill>1064</skill>` can never match. I re-ran it against the
real schema (`re.findall(r'<skill>\s*<id>(\d+)</id>')`, 647 occurrences, 39 distinct ids):

```
1064 -> 4   1065 -> 4   1066 -> 1   1067 -> 1   1068 -> 2   1500 -> 5   1501 -> 2
```

`npcdata.xml:3898` — `<skills><skill><id>1500</id><lvl>3</lvl></skill>…<skill><id>1064</id><lvl>1</lvl></skill><skill><id>1065</id><lvl>1</lvl></skill></skills>`
`npcdata.xml:3934` — carries `1501` and `1068`.
All seven category-11 skills appear in npcdata. The rest of the claim (7 rows, Undying has no `<level>`,
`MCSPlayer.as:2164` branches on level 2) is verbatim correct — but "invisible to any system-siloed
enemies-ai reader" collapses: they are sitting in npcdata.

### #23 — `skilldata/hud-two-bars-a1`: the frame wins
The claim says *"the **in-combat** player HUD shows exactly two bars … no Focus or Critical bar is present."*
I opened its frame at full size. `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` is the
**overworld** screen: location plate "S CHIKADA MOUNTAIN PATH", "STORY QUEST: FIND WORK AT KAKUCHI TOWN",
an XP bar 14266/16350, a minimap reading "TERRITORY (23,52) / SECTOR (3,4)", and a row of overworld action
icons. It is not a duel.

The actual in-combat HUD, same longplay — `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`,
crop `(150,960)-(560,1050)` upscaled 4× LANCZOS — shows **three** bars: green `20/20`, blue `26/26`, and a
third tan/gold bar carrying the text "CANNOT CHANGE STANCE". I compared frames 427.0 / 429.0 / 431.0: the
tan bar's fill length changes between them, so it is a meter, not a label plate. That third bar is the
reload/Focus meter — `BattleUI.as:60 public var reloadbar:MovieClip;` — and its "cannot change stance"
state is `MCSPlayer.as:2975-2980`, `nextStance(){ if(this.reload < this.maxreload / 6){ return; } … }`.

Two bars is what the OVERWORLD shows. The negative inference drawn from it does not survive.
(The "26/26 chi is a raw integer pool" half of the claim is fine and I am not disputing it.)

### #38 — `ui-hud/skill-slots-3-to-8`: the frame wins again
The claim's stated overturn is *"the ledger's guess that the third HUD element is 'a stance up-arrow' is
wrong, because the three stance masteries are `<passive>1</passive>`."*
`REBUILD_READINESS.md:235` blocker ④ says *"the '3 skill slots' is really ~2 abilities + a stance up-arrow."*
I opened `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, crop `(1380,900)-(1920,1080)` upscaled 3×:
slot 1 empty and unnumbered, slot **"2"** a gold clenched fist (dimmed, cooldown sweep), slot **"3"** a
plain gold up-arrow. The up-arrow is *there*. The passive argument does not reach it: an up-arrow is not a
mastery passive — it is either Jump (`SkillManager.as:14 SKILL_JUMP:int = 1003`, which the same claim says
occupies slot 0) or the stance control (`BattleUI.as:110 this.changestancelabel.text =
LangManager.getString(208);` = "Change Stance"). The code half (base 3 `StatsManager.as:2295`, vector of 8
`:126`, `skillSlots[0] = new IntStat(1003,1)` `:749`) is verbatim exact — but that content is already carried
correctly by #29, which makes no up-arrow claim. Bank #29, drop #38's overturn.
Side note the same frame raises: #38 says slot 0 is pre-filled with Jump, yet the leftmost tile is empty and
unnumbered. Unresolved; flag as INFERRED.

### #33 — `skills-meters/crit-proc-rule`: the blocker does NOT survive
Claim: *"The crit proc rule is not in skilldata and I found nothing that grounds it — this blocker survives
the sweep."* First half true (0 crit hits in `skilldata.xml`, `XMLSkill.as`, `SkillManager.as`, and in every
6xxx/7xxx string — I ran all four). Second half false. `MCSPlayer.as:3215-3222` — a file the claim cites
eight times, thirty lines below `MCSPlayer.as:3205-3213` which the surveyor was clearly reading:

```
if(this.reload == this.maxreload)
{
   if(this.stance != LIGHT_STANCE)
   {
      return maxDamage * 1.2 + this.STAT_CRITICALDMG;
   }
   return maxDamage * 1.5 + this.STAT_CRITICALDMG;
}
return maxDamage;
```

and the WEB v0.717 form, `§1t99s0§.as:3272-3275`:
```
if(this.§1t4414s0§ == this.§1t4415s0§)
{
   return _loc2_ * 1.3 + this.§1t1243s0§;
}
```
Corroboration in the UI: `BattleUI.as:262 this.crittext.visible = percentage >= 1 && this.reloadbar.visible;`
with `BattleUI.as:102 this.crittext.text = LangManager.getString(175);` and `strings.json["175"] = 'Critical Hit'`.

So: **crit is deterministic, not a chance roll — it fires when the reload/Focus bar is exactly full**, and the
web multiplier is a flat **×1.3** (which is precisely the ledger's "crit = 1.3× formula" at
`REBUILD_READINESS.md:194` — the ledger was right). Ledger blocker ⑤ is closed.

### #3 / #30 / #36 / #34 / #35 — android numbers presented as OG numbers
All five cite `shs3_android` lines that are **verbatim correct for v0.682** and materially wrong for v0.717.
See the table in §0 for the exact web replacements. Specifically:
- **#3** — base reach `120 + floor((90+DAN*5)*SPD/(20+SPD))` is identical in both builds and survives; the
  per-stance multipliers do not. This is ledger blocker ① — "the one value the whole model needs" — so
  banking ×1.5/×(1+0.005·m) instead of ×1.4/×(1+0.02·m) would poison the whole reach model.
- **#30/#36** — `SPD` caps at **600** on the web, and the modifier is `1 − SPD/1200`, i.e. half the android
  rate. "Max −50%" survives; "capped at 300" and "1 − SPD/600" do not.
- **#34** — the identification (Focus bar = engine reload meter) is well grounded: `SkillManager.as:218-219
  case SKILL_FOCUS: owner.reload = owner.maxreload - 1;` plus the "Critical Hit" text bound to `reloadbar`.
  But "max = 48 + 6×SPD frames" is wrong in **both** builds: `getBaseReload()` is stored into
  `this.baseReload` (`MCSPlayer.as:190`) **and never read again** — I grepped the whole script set, 10 hits,
  all writes — while `maxreload` is hard-set (`MCSPlayer.as:239` = 120; `§1t99s0§.as:249` = **192**). The
  stance-switch cost `>half→/3 else −1/6` is v0.682; web is a flat `reload -= 48` (`§1t99s0§.as:3162`).
  The real *fill* rate is `++reload` once per tick (`MCSPlayer.as:1160` / `§1t99s0§.as:1205`), which the
  claim missed, and the per-slash drain is stance-scaled (`/2`, `×1`, `×1.5`) which the claim flattened.
- **#35** — the reconciliation is genuinely right and valuable, but on the **web** formula
  `240×(1−5/1200)=239 → 9.96`, not 9.92. It is SPD **10** that reproduces all three:
  `120×0.991667=119 → 4.96`, `240×0.991667=238 → 9.92`, `216×0.991667=214.2→214 → 8.92`.

### #13 vs #14 — one is scoped right, one is not
I re-ran the parity check myself: 1,895 non-blank stripped lines identical, sha1 equal on both sides, same
75 ids, android's only extra line being `<?xml version="1.0" encoding="utf-8"?>`. (My digest differs from
the claim's because the normalisation recipe differs; the substance reproduces.) **#14** says the caveat
"does not apply to any skill number or string" — correct and bankable. **#13** says it "discharges the S0-3
caveat **for this unit**" — refuted: the unit contains five AS3-derived claims and the AS3 diverges.

---

## 3. New findings (not in the packet)

1. **Crit proc rule — CLOSED.** Deterministic at `reload == maxreload`. WEB v0.717 **×1.3 flat**
   (`§1t99s0§.as:3272-3275`); android v0.682 ×1.5 Light / ×1.2 other (`MCSPlayer.as:3215-3222`).
   Both add the flat gear stat `STAT_CRITICALDMG` (`StatsManager.as:258` = 204). UI corroboration
   `BattleUI.as:262` + `strings.json["175"] = 'Critical Hit'`. **Closes ledger blocker ⑤.**
2. **Stance DAMAGE model (web).** Light `×(0.5 + 0.04·m)`, Balanced `×(1 + 0.02·m)`,
   Heavy/Dual/Reversed `×1.4`, over `minDamage + rand(damageRange)` — `§1t99s0§.as:3255-3271`.
   Perfect inverse of the reach model: Light long reach / low damage, Heavy short reach / high damage.
3. **Stance REACH multipliers (web).** Light ×1.4, Balanced ×(1+0.02·m), Heavy ×(0.5+0.04·m) floor 100,
   Dual ×1 floor 100, Reversed ×1.4 — `§1t99s0§.as:3091-3155`. Base term identical to android.
4. **Mastery domain is 1-10 — RESOLVED** (this answers claim #2's open question). The player's masteries
   are `getStat(1000)/getStat(1001)/getStat(1002)` passed straight into `initPlayer`
   (`StatsManager.as:1834`), and NPCs' are `xml.getMastery(...)` returning the npcdata `<lvl>` verbatim
   (`XMLNpc.as:671-686`). On the **web** coefficients that domain is coherent — Balanced 1.02→1.20,
   Heavy 0.54→0.90. It is android's `0.5*m*0.01` that is the anomaly, and reading android is what created
   the puzzle.
5. **Reload/Focus meter, web numbers.** Max = `8 * 24` = 192 frames = **8 s** (`§1t99s0§.as:249`);
   fills `+1` per tick (`:1205`); per-slash drain = weapon `slashusage` scaled by stance
   `/2` Light, `×1` Balanced+Reversed, `×1.5` Heavy+Dual (`:3299-3311`, floor 48 at
   `StatsManager.as:1921-1930`); stance-switch cost = flat `−48` (`:3162`); the Focus skill sets it to
   `maxreload − 1` (`SkillManager.as:219`). **Closes ledger blocker ③.**
6. **Stance switching is gated on the meter.** `nextStance()` returns early while
   `reload < maxreload/6` (`MCSPlayer.as:2975-2980`) — that is the on-screen "CANNOT CHANGE STANCE".
7. **The in-combat HUD is three bars**, not two: HP / Chi / reload
   (`reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, crop (150,960)-(560,1050) @4×).
8. **All seven category-11 skills are in npcdata** with counts 4/4/1/1/2/5/2 (`npcdata.xml:3898,3934`).
9. **"150% DAMAGE" in the combat frame is a food buff**, not a stance or crit figure:
   `strings.json["4132"] = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be
   active at a time.'` Anyone porting from that frame would otherwise mis-read it as a combat multiplier.
10. **Undying regen.** `MCSPlayer.as:2163-2170`: in `SKILL_UNDYING_STATE`, heal `maxhp/(24*6)` per tick at
    skill level 2, else `maxhp/(24*12)` — a real number for the enemies-ai lane.

## 4. Standing recommendation for the rest of L0
Read `shs3_android/scripts/` for **names and structure** — it is the only clean symbol table, and I
confirmed 50 SkillManager ids there all resolve correctly. Then re-check **every number** against
`shs3_payload/scripts/` (v0.717) before it enters config. The four anchor classes are
`§1t1523s0§` (StatsManager), `§1t99s0§` (MCSPlayer), `§1t105s0§` (XMLSkill), `§1t120s0§` (SkillManager).
