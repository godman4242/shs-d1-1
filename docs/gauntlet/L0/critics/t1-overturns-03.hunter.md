# t1-overturns-03 — HUNTER LENS (blind critic, Lens 2)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` — **24 claims, all `verdict: HELD`,
all `overturns_ledger: true`.** 24 judged, 0 skipped.

I opened `docs/research/REBUILD_READINESS.md` in full (378 lines) and read every named
`ledger_text` in its surrounding context before ruling on the overturn.

**Headline.** The *evidence* in this packet is unusually good — 19 of 24 A2 quotes reproduced
verbatim, and all four A1 pixel/frame claims held when I cropped and looked myself. The
*overturns* are not. **Only 6 of 24 overturns survive.** The rest name a ledger sentence the
evidence confirms, restates, or never touches. Four claims are additionally wrong on a stated
fact and are refuted.

- Refuted: **5** (`hit-lockout-decomposes-exactly`, `nameplate-is-per-entity-with-exact-hues`,
  `weapon-part-hit-deals-zero`, `web-has-39-ai-cases-not-38`, `HUNT-player-screen-stat-contract`)
- Overturn upheld: **6 of 24** (0, 7, 8, 9, 10, 12, 14 — see table; 14 overturns a *memory* line, not a ledger line)
- Overturn refuted as inflated: **18**

---

## THE FRAME WINS — two adjudications, said out loud

**(1) `reference/extracted/ui_strings.txt:189` says `War room rules 1/6 (joining a battle)`.
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg` shows, on screen, in the shipped
v0.717 client: `WAR ROOM RULES 1/7 (JOINING A BATTLE)`. THE FRAME WINS.**
Corroborated at `frame_0012.jpg` = `3/7 (ATTACKING AND DEFENDING)` and `frame_0013.jpg` =
`6/7 (BUILDING STRUCTURES)`. The android string table agrees with the doc, not the frame —
`strings.json["369"]`..`["379"]` are `1/6`…`6/6`.
Consequence: **`ui_strings.txt` is authored TextField *placeholder* text, not runtime copy.**
Its own `:100 "physical dmg: 1234 - 1235"` is the tell. This is decisive for claim 21.

**(2) `strings.json["843"]/["844"]` read `Every 10 / 30 consecutive days: …`.
`reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg` reads
`AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE!`. THE FRAME WINS** — claim 23's own point, and
I confirmed it with my own eyes (crop `(0,330)-(1024,576)` @2.2× LANCZOS).

---

## Verdict table

| # | id | refuted | overturn upheld | why |
|---|---|---|---|---|
| 0 | enemies-ai/flinch-state-exists | no | **YES** (scoped) | verbatim at NPC.as:747-764; anim `d="8"` = 8 `<f>` children. Kills the *stagger* half of blocker ③; telegraph/active/recovery survives |
| 1 | enemies-ai/gothitcounter-is-iframes | no | no | text true (canHit() called only from NPCManager, 11 sites). Its `lane_impact` "no hit-reaction at all" is **refuted** by NPC.as:747 + MCSPlayer.as:4433. It *confirms* blocker ③, cannot overturn it |
| 2 | enemies-ai/hit-lockout-decomposes-exactly | **YES** | no | 12 = 4 + 8 is numerology across three unit spaces; flinch is per-class (`zom_stumble d="39"`) |
| 3 | enemies-ai/nameplate-colour-is-five-valued | no | no | all 5 literals verified; `nameplate (N)=level` is **confirmed** by EnemyPlayer.as:776, not falsified |
| 4 | enemies-ai/nameplate-colour-table | no | no | I reproduced the exact pixels. Same: confirms `(N)=level` |
| 5 | enemies-ai/nameplate-is-a-spawner-split… | no | no | Obj_NPCAggro.as:73/76/80 verified; frame shows red plates + zero health bars. Same overturn problem |
| 6 | enemies-ai/nameplate-is-per-entity… | **YES** | no | "only bosses and duelists get one" is false game-wide |
| 7 | enemies-ai/setlevel-has-11-overrides | no | **YES** | `grep -l` → exactly 11, list exact. Blocker ① "absent" dies |
| 8 | enemies-ai/setlevel-is-eleven-formulas | no | **YES** | every quote verbatim; npc 77 name id 5071 = "Oni" |
| 9 | enemies-ai/setlevel-is-twelve-formulas | no | **YES** | `13 + lvldiff` found (KanjiGuardian.as:65 `5 + 8 + lvldiff`); ai 9 = 73 rows = largest = EnemyPlayer |
| 10 | enemies-ai/tengu-absent-from-resolved-strings | no | **YES** | I extended the sweep to 8 more source families — 0 everywhere |
| 11 | enemies-ai/weapon-part-hit-deals-zero | **YES** | no | "the game's only block-like mechanic" is false (EnemyShield.as:335-340); "in no ledger bullet" false (:189) |
| 12 | enemies-ai/web-arrow-dual-gravity | no | **YES** (scoped) | fully verified in both builds. Arrow-arc half of ⑤ dies; undead-reflect half survives |
| 13 | enemies-ai/web-has-39-ai-cases-not-38 | **YES** | no | android is 38/**35**, not 38/34 ⇒ web carries **one** extra class, not two |
| 14 | frames/HUNT-39-hardcoded-tips-in-GameEngine | no | **YES** | 39 tips confirmed; Tip #27 = `dice == 26` = hold-run at :640. ⚠ android-only |
| 15 | frames/HUNT-combat-corpus-never-opened | no | n/a (`ledger_text: None`) | 2,675 / 7,381 is **exact**; A1 content verified by eye |
| 16 | frames/HUNT-gold-to-resource-exchange-rate | no | no | frame verified; an absent AP line in a prompt does not falsify `stable 14c+5AP` |
| 17 | frames/HUNT-player-screen-stat-contract | **YES** | no | "Weight appears nowhere in any of the twelve ledger systems" is false — :209 and :107 |
| 18 | frames/HUNT-rebirth-picker-recoverable… | no | no | every id resolves; but blocker ⑤ says "never filmed" and the finding **agrees** |
| 19 | frames/HUNT-repair-cost-is-runtime-parameterised | no | no | `Cost: [0] coins` verified. Named sentence stays true; it should have named **:80** |
| 20 | frames/HUNT-stance-triangle-and-ring-colours | no | n/a (`ledger_text: None`) | strings + rings verified by eye. 2 of 3 headline items already at :169 and :74 |
| 21 | frames/HUNT-ui-strings-txt-is-unmined | no | n/a (`ledger_text: None`) | all 10 lines verbatim — but the file is **placeholder text** (see adjudication 1) |
| 22 | frames/HUNT-war-tick-is-24-hours | no | no | A2 sound; **frame leg mis-cited**; ledger already says "the War-Room 24h tick" at :116 and "24h resolution" at :244 |
| 23 | frames/v0717-rewords-the-daily-streak-ladder | no | no | verified by eye — and it **upholds** the S0-3 caveat it claims to overturn |

---

## The four false statements, with the artifact that kills each

**#2 `hit-lockout-decomposes-exactly` — REFUTED.**
The claim sums three quantities in three different unit spaces and calls the coincidence a
triangulation.
- `gotHitCounter = 12` (NPC.as:462) is an **i-frame window**, not a lockout — proven by claim 1
  in this same packet, which I verified: `canHit()` (NPC.as:296-299) is called from nowhere but
  NPCManager's 11 hit-detection sites. A window that gates *being hit* cannot "decompose".
- `MOTION_MEASUREMENTS.md:24`'s "4 upright + 8 bent-forward" is **video** frames
  (`duel-strike-A: frames 036–047`), and the same table's line 18 fixes the pose latch at
  **15 fps = one pose per 4 video frames**. `<anim d="8">` is 8 **animation** frames
  (`MCSCharacter.updateAnimation` advances `frameCounter` by 1 per game tick against
  `currentAnimationDuration`). Three units, summed.
- Decisive: **the flinch clip is not universally 8 frames.** `EnemyZombie.as:285-286` routes
  `FLINCH_STATE` to `ZOM_STUMBLE`, and
  `reference/extracted/android/98_MCSCharacter_UndeadAnimationData.bin` holds
  `<anim i="zom_stumble" d="39">`. 4 + 39 ≠ 12.
- No code anywhere holds 4 frames before entering flinch — `doFlinch()` starts the anim on the
  same tick as the hit.

**#6 `nameplate-is-per-entity-with-exact-hues` — REFUTED.**
"only bosses and duelists get one, everyone else is explicitly blanked" is true **inside
`EnemyPlayer`** (its `else` branch at :806-811 does blank) and false everywhere else:
`EnemyElite.as:114`, `EnemyKanjiGuardian.as:59`, `Obj_NPCAggro.as:76,80`,
`Obj_NPCProcGen.as:51,60`, `FriendlyElite.as:64`, `FriendlyArcher.as:57`,
`FriendlySpearElite.as:55` all set a display name unconditionally. And the frame settles it:
`reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg` shows **three red `BANDIT (4)`
plates on plain field mobs**. A builder following this claim would suppress plates that are
visibly on screen. It is also internally inconsistent with claims 3/4/5 in its own packet.

**#11 `weapon-part-hit-deals-zero` — REFUTED on two stated facts.**
The `EnemyZombie.as:502-505` quote is verbatim correct. But:
- "the game's **only** block-like mechanic" is false. `EnemyShield.as:335-340`:
  `case mcs.partList[MCSCharacter.PART_prop]: gotHitFlag = true; damage = 0; gotHitCounter = 24;
  SoundManager.instance.playHitMetal(); return false;` — that is a *shield block*: zero damage,
  a **doubled** 24-frame i-frame window (vs 12 everywhere else), and a metal-clang SFX. It also
  answers the claim's own open question about a clang VFX — the clang exists, on the *prop* case.
- "appears in no ledger bullet" is false: `REBUILD_READINESS.md:189` already lists
  "part-based weak points (shielder legs, undead heads)" as combat-core **Ready**.
- Under-claim, in its favour: the weapon whiff is not zombie-only — same block at
  `EnemyOgre.as:333`, `EnemyJiangSi.as:294`, `EnemyNianMonster.as:374`,
  `EnemyWolfAlpha.as:470`, `EnemyShield.as:331`, `CutsceneActor.as:303`.

**#13 `web-has-39-ai-cases-not-38` — REFUTED on the delta.**
Measured, not hand-counted:
```
WEB  §1t1543s0§.as:615-733    cases 39  unique classes 36
AND  NPCManager.as:516-634    cases 38  unique classes 35  (32 Enemy* + 3 Friendly*)
```
The claim says android is "31 unique Enemy* + 3 Friendly* = 34" and concludes v0.717 carries
"**two** more behaviour classes". It carries **one**. The web half (39/36) is exactly right.

**#17 `HUNT-player-screen-stat-contract` — REFUTED on the novelty claim.**
I read `zFtCaTO0_1M/seg-00/frames/frame_0051.jpg` at 1.9× and every number checks out
(114 COINS · 3 GOLD · badge 2 · 787/1450 XP · AVAILABLE STAT POINTS: 3 · HP 10/10 · CHI 10/10 ·
AP 30/30 with a bare `30` · ATK 1 · DEF `1 +2` · SPD 1 · ADD HP · WEIGHT: 14 / 100 · 9 doll slots).
But "the ledger records nowhere" and "**Weight appears nowhere in any of the twelve ledger
systems**" are both false:
- `:209` items-equipment **Ready** — "9-slot paperdoll; … **weight cap 100**; … measured weight table"
- `:107` — "the full measured weight table"
- `:163` §3 item 6 — "AP is a real third on-screen resource (base 30, +1/point)"
- `:199` progression **Ready** — "start pools (HP10/Chi10/AP30)"
Genuinely new here: the **base-vs-bonus split rendered separately** (`DEF 1 +2`) and
**HP/CHI regen as displayed stats** (`ui_strings.txt:314`). That is a much smaller claim.

---

## The inflated overturns (18) — what still stands after the evidence lands

**`nameplate (N)=level` (:219) — claims 3, 4, 5, 6.** Four claims fire at a **Ready**-list bullet
that says the parenthetical is the level. `EnemyPlayer.as:776`
`mcs.setDisplayName(xml.name + " (" + level + ")",namecolor)` **confirms it verbatim**. Adding a
five-value colour table is *extension*, not overturn. Everything the sentence claims survives.
(The colour table itself is excellent and should land as new ledger content under ui-hud.)

**`③ telegraph/active/recovery + stagger frames` (:220) — claim 1.** Claim 1's own `lane_impact`
argues the blocker **stays open**. A claim that confirms a gap cannot overturn the sentence
naming it.

**`(5) rebirth/element-picker UI (never filmed…)` (:205) — claim 18.** The sentence is about
*filming*. The claim opens by conceding "The rebirth/element picker is unfilmable". It agrees.
What its evidence actually kills is rebirth-elements ① and ③ — a **different sentence**, two
lines up.

**`(3) Repair-Weapon cost (never captured)` (:215) — claim 19.** Literally true and stays true.
The real casualty is **`:80` "Reinforce 5000c+1 silver ore"**, which `strings.json["850"]`/`["851"]`/
`["852"]` split into a **three-material table** (Silver Ore / Titanium Ore / Uncut Diamond).
That is the sentence this claim should have named — a good correction pointed at the wrong line.

**`(3) real-world "day" length … war tick` (:225) — claim 22.** The ledger **already concedes the
24 h war tick, twice**: `:116` "the War-Room **24h tick**" and `:244` meta-social **Ready** —
"kill cap 350; flag +120%; **24h resolution**". The blocker's live half — what a "day" means for
quest expiry, farming and AP regen — is untouched. Additionally the frame leg is **mis-cited**:
`frame_0011/0012/0013` are pages **1/7, 3/7 and 6/7**, none of which carries the 24-hour line.

**S0-3 android-parity caveat — claim 23.** The claim's own conclusion is "the android-parity hedge
**stays**". It strengthens the caveat; it cannot overturn it. (The claim itself is correct and its
`1/6 → 1/7` parenthetical is independently confirmed — see adjudication 1. I doubted it from
`ui_strings.txt` and the frame overrode me.)

**`ledger_text: None` — claims 15, 17, 20, 21.** Four claims are flagged `overturns_ledger: true`
with no sentence named. Nothing can fall. Worse, claim 20's two headline items are *already in the
ledger*: `:169` "Portrait ring is stance-colored (Light blue / Balanced brown / Heavy red), not
fixed red" and `:74` "Heavy defender Defense ×0.8" ( = the `["6005"]` "Defense -20%" it presents as
new). What is genuinely new in 20: the `Effective against …` triangle wording and the per-stance
hold-to-charge ultimates (`["6085"]`-`["6087"]`). Claim 21's betting/tournament headline is likewise
half-conceded at `:214` "gold has legit non-cash faucets (rebirth/**tournament/betting**)".

---

## The 6 that do overturn — and how far

- **① enemy level→stat formula "absent, not just inferred" (:220) — DEAD** (claims 7, 8, 9).
  `grep -l "override public function setLevel"` returns exactly 11 files, and the list matches
  claim 7 character for character. Base `NPC.setLevel` (:239-260) is `factor ×0.9 if lvl<=20`,
  `xp = lvl*2+20`, hard `1/1/1` clamp at `lvl<=10`. `EnemyOgre.as:51-53` is `{ }`. Elites/bosses
  inverse-solve off the **live player**: `hitsToKillBoss` is **8 + lvldiff** (EnemyPlayer:97),
  **10 + lvldiff** (EnemyElite:40, EnemySpearElite:84, EnemyWolfAlpha:86) and **13 + lvldiff**
  (EnemyKanjiGuardian:65, written `5 + 8 + lvldiff` — claim 9 found this and it is real).
  Note the ledger's staleness banner (:32) pointed at `npcdata.xml` for this blocker; npcdata
  carries per-NPC static rows, **not** a formula, so this is the first genuine kill.
  ⚠ Correction to claim 9: `hitsToKillPlayer` is **not** universally `16 - lvldiff` — it is 16
  (EnemyPlayer:98, KanjiGuardian:66), **18** (EnemyElite:41, EnemySpearElite:85) and **15**
  (EnemyWolfAlpha:87).
- **③ stagger frames (:220) — the stagger half DEAD** (claim 0), telegraph/active/recovery alive.
- **⑤ arrow arc physics (:220) — the arrow half DEAD** (claim 12), undead-reflect alive.
- **"full taxonomy (… + Tengu/Guardian)" (:219) and "Tengu Hotaru" (:221) — DEAD** (claim 10).
- **memory line "hold-run per Tip #27 … never sourced" — DEAD** (claim 14): `GameEngine.as:640`,
  `dice == 26` (the 27th tip counting from `dice == 0`),
  `"Tip: When not in battle, you can hold down the mouse button to keep running in that direction."`
  This restores `REBUILD_READINESS.md:146`. ⚠ v0.682 only — see NEW-6.

---

## Hunting I did that the packet did not (Lens 2a)

**NEW-1 — the flinch mechanism is BUILD-PARITY CONFIRMED in web v0.717.** HELD.
`reference/decompiled/shs3_payload/scripts/§1t68s0§.as:769-786` and `§1t99s0§.as:4679-4703`
mirror `NPC.doFlinch/endFlinch` and `MCSPlayer.doFlinch` line for line (same
save-actionState/anim/frameCounter → set FLINCH → restore); `§1t1544s0§.as:170,172` carry
`"flinch_weapon"` / `"flinch"`; `reference/extracted/bindata/103_1t4630s0.bin` holds
`<anim i="flinch_weapon" d="8">`. Claim 0 is therefore **not** android-only — the S0-3 hedge
lifts for this mechanism.

**NEW-2 — flinch duration is per-character-family, not a universal 8.** `zom_stumble d="39"`.

**NEW-3 — a SECOND block mechanic: the shielder prop-block.** `EnemyShield.as:335-340`,
`gotHitCounter = 24`, `playHitMetal()`.

**NEW-4 — v0.717 War Room rules have SEVEN pages, not six.** Frame-proven. Hard, enumerable
v0.682 ↔ v0.717 UI diff #2 (arrow gravity is #1, the daily-streak rewording #3).

**NEW-5 — `ui_strings.txt` is placeholder TextField text.** Any number read out of it
(`:214 "level requirement: 10 - 30 … round duration: 30 min"`, `:100 "piercing dmg: 20"`) is
design-time filler of the same class as `"physical dmg: 1234 - 1235"`. **STILL_UNHELD** as tuning.

**NEW-6 — the 39-tip ladder is ANDROID-ONLY.** Zero of the 39 tip strings appear anywhere in the
web build: `grep -rn '"Tip: ' reference/decompiled/shs3_payload/scripts/*.as` → 0;
`green border indicates` → 0 across all 27 `reference/extracted/bindata/*.bin`; 0 in
`reference/extracted/payload.xml`. Android has exactly 39 (`grep -c '"Tip: ' GameEngine.as` → 39).
Also: `dice == 33` *does* route through `LangManager.getString(723)`, so "in NO string table" has
one exception.

**NEW-7 — the war map is already on film.** `Nr4fQstqHDM/seg-20/frames/frame_0014.jpg`:
`SELECT TERRITORY / CLAN CROPS: 402 (+2 HQ)` over a flat-vector Japan outline (Honshu, Shikoku,
Kyushu, Sado, the Izu chain) with a **uniform grid overlay** and a clan flag marker. This bears
directly on world-exploration ① (`:225`, whose close-path is "trace the map image") and
meta-social ② (`:245` "War-Room map topology (board/adjacency)") — both say go find a map;
the map is in the repo.

**NEW-8 — "Guardian" is real, "Tengu" is not.** `strings.json["5119"] = 'Guardian'`,
`EnemyKanjiGuardian` at ai 36. `tengu` = 0 hits in strings.json, resolved_names.json, all four
data XMLs, `ui_strings.txt`, the whole `reference/decompiled/` tree, all 27 web bindata + 42
android blobs, and the 329 MB `payload.xml`.

**NEW-9 — npc 77 resolves.** `<name>5071</name>` → `strings.json["5071"] = 'Oni'`, `<lvl>80</lvl>`,
`<hp>40</hp>`, `<ai>23</ai>` → `NPCManager.as:587-588 case 23: new EnemyOgre(...)` → empty
`setLevel`. The "Oni never scales" reading is now name-resolved end to end.

## Not verifiable by me
Claims 15 and 21 assert things about *another packet's* cite distribution
("all 21 cites point at seg-NN", "used for exactly one thing"). Adjudicating that would require
opening `docs/gauntlet/L0/sources/*.md`, which §3.2 forbids. I ruled on the corpus arithmetic
instead — `2,675 / 7,381` is exact — and left the packet-composition half unjudged inside an
otherwise HELD claim.
