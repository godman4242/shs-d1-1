# t1-overturns-02 — LENS 3 (CONTRADICTION), blind re-judge s27b

**Packet:** `docs/gauntlet/L0/worklist/t1-overturns-02.json` — 7 findings, all claiming a ledger overturn, all class A2.
**Judged: 7 / 7. Skipped: 0.**
**Verdicts: 7 survive (refuted = false). 0 refuted. 6 new findings filed.**
**Own-cite integrity: `citeLint.py` over my own 13 cites → 13 RESOLVES · 0 BROKEN · 0 QUOTE_UNVERIFIED.**

Structured object written FIRST, before this file, to
`docs/gauntlet/L0/critics/t1-overturns-02.contradiction.s27b.json`.

---

## Headline

Every finding in this packet is true on the artifact. **None of them is safe to paste into the
rewrite as written** — four carry a rider that fights an already-UPHELD finding, and in three of
those four the rider is the half that is wrong.

That is the whole point of this lens. Judged alone, each of these seven is a clean A2 pass. Judged
against its neighbours, four of them are carrying a passenger.

| # | finding | verdict | the passenger |
|---|---|---|---|
| 1 | `hunter-s26c/web-parity-for-the-per-kill-xp-formula` | HELD | rider "the coins-per-kill half still stands" is **false** |
| 2 | `hunter-s26c/web-parity-for-the-three-tier-reinforce` | HELD | reads its 5000c/materials out of the **android** string table — I closed that hole in web code |
| 3 | `s26c/the-271-cap-IS-the-shipped-level-80-base-stat-cap` | HELD | clause "unreachable in one stat" is **false**, and repeats the ledger error it just refuted |
| 4 | `s26c/web-offline-save-reset-enumerates-the-same-nineteen-fields` | HELD | clean; exposes a 14-vs-19 clash between two UPHELD neighbours |
| 5 | `s26c/web-payload-carries-the-same-xp-lvl-times-2-plus-20-setLevel` | HELD | duplicate of #1, but the **safer** of the two — no false rider |
| 6 | `s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid` | HELD | android-only label — I discharged it to web myself |
| 7 | `skills-meters/heavy-stance-damage-is-flat-and-only-heavy-reach-scales` | HELD | opening "gets the pairing backwards" is **unsupported by its own evidence** |

---

## The contradictions, settled

Each of these was settled by opening the file, never by reading another agent's prose (§3.2).

### C-1 · Coins per kill: the rider loses
Finding #1's `lane_impact` says *"The coins-per-kill half of the same sentence still stands."*
Two UPHELD findings say the opposite. I did not arbitrate between them — I read forty lines further
down the very file finding #1 opened:

```
§1t68s0§.as:863   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(1 * _loc8_);
§1t68s0§.as:867   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(5 * _loc8_);
NPC.as:839        OverworldHUD.instance.lootDialog.addLootCoins(1 * qty);
NPC.as:843        OverworldHUD.instance.lootDialog.addLootCoins(5 * qty);
```

Coins per kill is a rolled loot table in **v0.717** — loot id 0 = 1 coin × qty, id 1 = 5 coins × qty
— not an unconfirmed `=8` seed. **Both halves of RR:215 ① fall together.** The rider must be stripped.

### C-2 · 271 reachable in one stat: the finding loses to the UPHELD neighbour
Finding #3 says 271 *"is unreachable in one stat … the panel stops granting."*
UPHELD `progression/271-cap-explained` says it **is** reachable on a first run. The arithmetic is
entirely inside one function:

```
§1t5957s0§.as:3457  _loc1_ += (…§1t9408s0§) - 1) / 3;     → base ATK = 1, step = 3
§1t5957s0§.as:3422  §1t9713s0§(…§1t9408s0§,3);            → the add button grants +3
§1t5957s0§.as:3461  _loc2_ = (getLevel() - 1) * 3;        → 237 points at L80
§1t5957s0§.as:3344  … < 1 + (_loc2_ + 10) * 3;            → cap 271 at L80
```

(271 − 1) / 3 = **90 of 237 points**, and the gate is a strict `<`, so the last grant fires at 268 and
lands exactly on 271. **147 points to spare.** The neighbour wins. Finding #3's headline (271 is the
shipped per-stat ceiling, RR:201's gear/rebirth story is wrong) is correct and survives — but its
"unreachable" clause is the ledger's own dead parenthetical walking back in wearing a fresh citation.

### C-3 · Reinforce materials: the packet finding beats two UPHELD neighbours
`economy/reinforce-weapon-cost-is-a-held-constant-5000` (UPHELD) — "5000 coins plus 1 Silver Ore".
`payload/repair-cost-formula-is-node-level-times-10` (UPHELD) — "1 Silver Ore under weapon level 30,
1 Titanium Ore at 30+", i.e. two tiers.
Both are wrong. There are **three**, and they are in web code, not just in the display string:

```
§1t401s0§.as:1087  cost = 5000;
§1t401s0§.as:1112  if(…§1t9714s0§(20064) == 0)     weaponlevel < 30
§1t401s0§.as:1124  if(…§1t9714s0§(20065) == 0)     weaponlevel < 60
§1t401s0§.as:1136  if(…§1t9714s0§(20066) == 0)     else
§1t401s0§.as:1147  weapon.uses = 0;                (unbreakable)
itemdata.xml:10420/10429/10438 → names 4241/4242/4243 → Silver Ore / Titanium Ore / Uncut Diamond
```

This also **discharges the S0-3 hedge** every reinforce finding so far has carried: they all read the
tiers out of `strings.json`, which is the ANDROID lang table. The price and the three reagent item ids
are v0.717 code. Filed as new finding `lens3/reinforce-tiers-are-web-code-not-a-string-table-inference`.

### C-4 · 14 vs 19 save fields: two UPHELD findings, one truncated read
`persistence/offline-save-schema-is-fourteen-fields-already-written` (UPHELD, cites `:2910-2925`)
against the nineteen-field family (also UPHELD). Both currently live in `LEDGER_EVIDENCE.md`, which
means the rewrite picks by coin flip. The branch does not end at :2925:

```
QueryManagerBase.as:2926  activeQuestList
                   :2927  completedQuestList
                   :2928  playerlocation
                   :2929  taunt
                   :2930  friends
                   :2931  }                        ← the branch ends HERE
```

**Nineteen.** `deleteCharCookieData` (:2940-2959) blanks the same nineteen; web `§1t1832s0§.as:2815-2833`
blanks nineteen in the identical order. The 14-field finding is a truncated window, not a rival
measurement. A 14-field port silently loses all quest state, world location, taunt and friend list on
reload.

### C-5 · Mastery 9 vs 10: `combat-core/v0717-stance-table`'s clause loses
That UPHELD finding carries the same formulas as packet finding #7 and then says mastery 9 gives
0.86/1.18/1.4, *"which CONFIRMS the ledger's mastery-9 reading rather than overturning it."*
Substituting **m = 10** into the lines I opened gives **0.9 / 1.2 / 1.4 exactly** — the wiki triple, not
a rounding of it. Exact beats rounded, and ten other UPHELD findings put the ladder at 1..10
(`mastery-caps-at-ten`, `mastery-is-ten-level-skill`, `mastery-is-small-integer`,
`stance-damage-mastery10-ceiling`, `npcdata/stance-mastery-rank-10`, `NF-5/…`, and four more), while
`combat-core/mastery-is-0-to-9` is already KILLED. **RR:155's "MASTERY-9 CEILING" label falls**, so
finding #7's overturn holds even though its own framing sentence does not.

---

## The build-parity trap, checked before declaring any contradiction (§ lens (c))

Two apparent contradictions dissolved once I named the build. Neither finding is defective.

**Stance reach 300/200/100.** UPHELD `combat-core/300-200-100-is-base-not-ceiling` reproduces the triple
exactly from multipliers {1.5, 1.0, 0.5} × base 200. Finding #7 says the triple is not reproducible at
any single base. Both are right, in different builds:

| | ANDROID v0.682 `MCSPlayer.as` | WEB v0.717 `§1t99s0§.as` |
|---|---|---|
| Light reach | `:3030` `* 1.5` (flat) | `:3094` `* 1.4` (flat) |
| Balanced reach | `:3041` `(1 + 0.5*M*0.01)` | `:3105` `(1 + 0.2*M*0.1)` |
| Heavy reach | `:3052` `(0.5 + 0.5*M*0.01)` floor 100 | `:3116` `(0.5 + 0.4*M*0.1)` floor 100 |
| Light damage | `:3205` `(0.5 + 0.5*M*0.01)` | `:3262` `(0.5 + 0.4*M*0.1)` |
| Balanced damage | `:3208` `(1 + 0.5*M*0.01)` | `:3265` `(1 + 0.2*M*0.1)` |

Android ×1.5 at base 200 → **300**/200/100. Web ×1.4 → **280**/200/100. The two tables must never be
quoted as one. (This is what UPHELD `parity/stance-tables-diverge-web-vs-android` already says; I
re-derived it rather than inherit it.)

**Save schemas.** UPHELD `save-schema/is-android-only-evidence` says every slot id is android-only. I
ran the grep: `saveUpdate` appears in four android files and **zero** under `shs3_payload`. That is
true — and it is a *different object* from the offline SharedObject cookie finding #4 is about, which
demonstrably exists on the web side (`§1t1832s0§.as:2813`). Both stand. The rewrite must not merge the
20-slot server wire schema with the 19-field local cookie.

---

## Where I went past the finding and closed a hole it left open

**The war board is 6×6 in the TARGET build too — by default parameter, not by literal.**
Finding #6 is labelled android v0.682 and never opened the web side, so under C2 the target build was
still open. I found and opened the twin (`§1t7785s0§.as` — same class by `msgBoard`, `leftRoad`/
`rightRoad`, `hexarrow`, the `mapid >> 12` sector math at :196-198, and the `§1t4646s0§`
survivalmodedata embed):

```
android WarHexUI.as:175-176   this.ht = 6;  this.wt = 6;          ← literals (only 2 assignments in 2,524 lines)
web §1t7785s0§.as:162         param4:int = 6, param5:int = 6      ← DEFAULT PARAMETERS
web §1t7785s0§.as:176-177     this.ht = param4;  this.wt = param5;
web §1t6483s0§.as:588         …§1t7835s0§(param1,param3,param4);  ← the ONLY call site, 3 args, both defaults taken
```

Same 55 px pitch, same (90, 92) origin on both sides. The conclusion survives to v0.717; only the word
"hardcoded" is android-specific. A citation audit would otherwise trip on this.

**The twentieth save member nobody counted.** Every finding in the corpus counts nineteen fields. The
record also carries `saved:Boolean`, and it is the one that decides whether the nineteen are ever read
— `§1t1832s0§.as:2881`, `:2938`, `:2956` all open with `if(_loc1_.data.saved != true) { return; }`, as
does android `:2967`. Port nineteen without the sentinel and you write a save that never loads.

---

## What I compared each finding against

An empty contradiction result is only credible if this list is full. I searched
`LEDGER_EVIDENCE.json` by **cited artifact**, not by wording.

- **#1, #5 (XP)** — `economy/coins-per-kill-and-xp`, `enemies-ai/kill-rewards-close-two-economy-blockers`,
  `progression/xp-curve-l11-80`, `progression/quest-xp-tabled`, `progression/campaign-level-band`,
  `npcdata/setlevel-pins-everything-to-1-below-11`, `enemies-ai/setlevel-is-twelve-formulas`,
  `itemdata/coins-per-kill-is-1-or-5`, `npcdata/loot-enum-and-coins-per-kill`, and each other.
  One contradiction (C-1); the two packet findings agree with each other.
- **#2 (reinforce)** — 21 findings touching reinforce/forge/repair, incl. `payload/reinforce-has-three-material-tiers-not-two`,
  `economy/reinforce-weapon-cost-is-a-held-constant-5000`, `payload/repair-cost-formula-is-node-level-times-10`,
  `NF-3/web-twin-of-repair-and-reinforce`, `hunter05/repair-and-reinforce-are-priced-in-coins`,
  `frames/forge-cost-is-level-parameterised`, `economy/service-prices-are-formulas` (KILLED).
  Two contradictions (C-3), both resolved in the packet finding's favour.
- **#3 (271)** — `progression/271-cap-explained`, `progression/per-stat-caps-are-a-level-formula-and-they-prove-the-build-split`,
  `progression/android-stat-caps-are-a-different-formula`, `progression/android-caps-also-drifted`,
  `newfind/per-stat-caps-diverge-between-builds`, `progression/per-point-magnitudes`,
  `progression/web-ap-per-point-is-5-not-1`, `progression/plus1ap-is-androids-manual-panel-not-a-typo`.
  One contradiction (C-2), resolved against the packet finding.
- **#4 (save)** — `hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds`,
  `persistence/offline-save-schema-is-fourteen-fields-already-written`,
  `newfind/offline-save-branch-writes-nineteen-fields-not-fourteen`, `save-schema/is-android-only-evidence`,
  `save-schema/dataslots-20-does-not-count-the-written-ids`, `world-exploration/save-schema-is-23-slots`,
  `world-exploration/save-slot-count-23`, `actionscript/save-schema`,
  `items-equipment/equipment-save-format-is-13-field`, `hunter-s26c/web-19-field-save-schema-is-a-positional-twin` (unjudged).
  One contradiction (C-4) between two UPHELD neighbours; the packet finding is on the winning side.
- **#6 (war board)** — `hunter-s26a/war-room-battlefield-board-is-server-dimensioned` (already KILLED),
  `meta-social/world-map-topology-is-a-bitmap-mask`, `world-exploration/coordinate-law`,
  `world-exploration/frame-confirms-6x6-grid`, `meta-social/survivalmode-is-the-warroom-wave-table`,
  `meta-social/section6-live-clan-war-overbroad`, `warroom/next-turn-in-is-string-309-not-307`,
  `hunter-s26c/war-room-10px-territory-pitch-is-web-side-too`. No live contradiction — the world mask
  and the battlefield board are different objects and are complementary.
- **#7 (stances)** — all 33 findings landing on RR:155, incl. `combat-core/v0717-stance-table`,
  `combat-core/300-200-100-is-base-not-ceiling`, `reach-table-is-mastery-zero-not-a-ceiling`,
  `stance-reach-is-mastery-zero-base`, `stance-damage-mastery10-ceiling`, `mastery-caps-at-ten`,
  `mastery-is-ten-level-skill`, `mastery-is-small-integer`, `mastery-caps-at-10-per-the-string-table`,
  `npcdata/stance-mastery-rank-10`, `skills-meters/reach-triple-is-a-floor-not-a-ceiling`,
  `parity/stance-tables-diverge-web-vs-android`, `combat-core/mastery-is-0-to-9` (KILLED).
  One contradiction (C-5), resolved against the UPHELD neighbour's clause; one false contradiction
  dissolved by the build-parity check.

---

## Things I verified rather than accepted

- `grep -rn '\* 2 + 20' reference/decompiled/shs3_payload/scripts/` → **exactly the seven sites** finding #1 names.
- `grep -n 'wt =\|ht =' WarHexUI.as` → **only :175 and :176** in 2,524 lines, as claimed.
- `grep -rln saveUpdate reference/decompiled/` → **four android files, zero under `shs3_payload`**.
- The web mastery identities were fixed positionally, not assumed: `§1t99s0§.as:183-199` is a
  15-parameter init aligning slot-for-slot with android `MCSPlayer.as:182`
  `initPlayer(controlledBy, hp, maxhp, chi, maxchi, defense, baseReload, minDamage, damageRange,
  baseSlashLength, slashUsage, lightMastery, balancedMastery, heavyMastery, level)` — so
  `§1t4421s0§`/`§1t4422s0§`/`§1t4423s0§` = light/balanced/heavy mastery and `§1t4420s0§` = baseSlashLength.
- The Chi/AP labels on the web stat caps were fixed by the spend audit at `:3455-3456` (base 10 step 5
  vs base 30 step 5), not by guessing which obfuscated symbol was which.
- The XP award chain: `§1t68s0§.as:185-209` is the web twin of `NPC.calcXP` — zero for a grey mob,
  zero above +3 levels, `×(1 + 0.05·Δ)` under-level, `×(1 − Δ/zeroDifference)` over-level, `×2` elite —
  consumed at `NPC.as:863 addLootXP(calcXP(…))`. Both XP findings state the **base**, not the award.

No measurement-doc-vs-frame conflict arose in this packet: all seven findings are A2 code claims and
no frame was in contention, so the standing "the frame wins" invariant was never triggered.
