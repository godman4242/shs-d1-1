# t1-overturns-04 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-04.json` — **24 claims, 24 judged, 0 skipped.**

⚠ The packet file was RE-SHARDED on disk mid-review (19:58). I re-read it and judged the
CURRENT 24. Work already done on the four dropped ids (`itemdata/reload-bar-max-is-a-hard-constant`,
`itemdata/two-gold-items-are-coin-buyable`, `items-equipment/*`) is not reported here.

Every verdict below rests on an artifact **I** opened. Frames were cropped and upscaled with
PIL/LANCZOS at the crops stated in each entry.

---

## Machine-audit disagreements (2)

- **`hunter/tenth-rebirth-tier-exists` — citelint said QUOTE_UNVERIFIED. FALSE NEGATIVE.**
  I located the quote verbatim at `reference/decompiled/shs3_android/scripts/StatsManager.as`
  lines 2201/2203/2205/2207. The claim dies for a different reason (below), not for its cite.
- **`frames/HUNT-rebirth-picker-recoverable-from-strings` — citelint said UNCHECKABLE /
  NO_PARSEABLE_PATH.** That is the §0-mandated `strings.json["611"]` ID form, which the linter
  cannot follow. All 17 IDs resolve verbatim in `docs/gauntlet/L0/index/strings.json`.

---

## REFUTED (1)

### `hunter/tenth-rebirth-tier-exists` — REFUTED, material
The android cite is exact. The **operative correction is wrong for the build we are recreating.**

Web v0.717, `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`:

```
2644         if(§1t7356s0§(§1t9426s0§) == 8)
2646            §1t9713s0§(§1t9413s0§,100);
2647            §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
2651            §1t9713s0§(§1t9413s0§,25);
```

`§1t9413s0§` is declared `= 12` at `§1t1523s0§.as:228`, and android `StatsManager.as:194` declares
`STAT_HGOLD:int = 12`. So the **web build pays 25 Heavenly Gold per rebirth and 100 at DAN == 8.**
The ledger's `tenthGold=100` and the film's `+25` are the CORRECT v0.717 numbers. Only the
currency label ("gold" → Heavenly Gold) and the "no 10th-rebirth tier" clause are wrong.
The claim would inject android's 5/20 into a web-target ledger. `overturn_upheld = false`.

---

## HELD with a material correction (2)

### `hunter/buff-table-and-video-contamination` — HELD, but NOT ÷1.5
Cite exact: `OverworldHUD.as:1388-1425` (I read 1400/1404/1408/1412/1416/1420 verbatim) and
`StatsManager.as:288-312` (BUFF_XP 0 … BUFF_MODERATOR 12). I opened
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at the stated crop x230-560 y960-1070 @4x:
green 20/20, blue 26/26, third bar **"CANNOT CHANGE STANCE"**, and gold **"150% DAMAGE"** on the
line beneath it. The buff IS active; the footage IS contaminated.

**But the divisor is wrong.** `MCSPlayer.as:210-213` and web `§1t99s0§.as:211-213` both do
`this.minDamage *= 1.5;` — and only that. `damageRange` is untouched (`MCSPlayer.as:192`), and
damage rolls as `minDamage + Math.random() * damageRange` (`:3201`). Total damage is inflated by
**less than ×1.5** unless damageRange is 0. "Divide TTK by 1.5" would over-correct.

### `itemdata-hunter/reach-is-per-stance` — HELD, but the px scale is 2.27, not 2.4
`MCSPlayer.as:3019-3094` matches the quote verbatim across all five stance branches, ending at
`:3094 InputManager.setMaxDistance(this.slashLength);`. `StatsManager.as:1915-1918` gives
`int(120 + Math.floor((90 + STAT_DAN*5) * speed / (20 + speed)))` exactly as claimed.
`StatsManager.as:80 stageWidth = 800` ✓.

**The trailing conversion is refuted by the frame.** I measured
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080): the game is **pillarboxed with
52-px black bars on both sides**, content 1816×1080. So the scale is 1816/800 = **2.27** screen px
per game px (1080/480 = 2.25), not 1920/800 = 2.4 — a 6 % error on every reach measurement.
**THE FRAME WINS over the doc arithmetic.** Filed as a new finding.

---

## HELD with a minor imprecision (2)

- **`itemdata-hunter/reload-bar-max-is-flat-not-speed`** — `MCSPlayer.as:239 this.maxreload = 5 * 24;`
  and web `§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;` are verbatim; the 120-vs-192 divergence is real
  and the conclusion (SPEED never lengthens the bar) is correct. But the quote's grep summary —
  "declaration (:105), parameter (:182) and this assignment, and NO read" — is false.
  `grep -rn baseReload reference/decompiled/shs3_android/scripts/` returns **nine hits in five
  files**, including a genuine read at `EnemyClone.as:49 this.baseReload = owner.baseReload;` and
  local `48 + xml.speed * 6` computations at `FriendlyElite.as:49`, `EnemyPlayer.as:754`,
  `EnemyElite.as:99`. The field is inert for maxreload, but "NO read" mis-reports the evidence.
- **`hunter/two-drawn-line-colours-and-the-real-red`** — colours exact in both builds
  (`InputManager.as:172-179` and `§1t1541s0§.as:172-179`, byte-identical line bodies);
  39168 = 0x009900, 10027008 = 0x990000, 10682368 = 0xA30000 ✓; `thickness = 8` at
  `InputManager.as:57` ✓. Nit: "named identically in both builds" is loose — the web symbols are
  obfuscated (`§1t10101s0§`/`§1t10102s0§`); the bodies, not the names, are identical.
- **`hunter/paperdoll-is-23-slots-plus-quadruped-extension`** — human 23 slots verified in both
  (`MCSCharacter.as:120,:141-145`; `§1t75s0§.as:125,:159`). I ran the reader grep myself: the four
  extra PART_ constants (23/24/25/26) are declared only in `MCSCharacter.as:56-62` and read only in
  `MCSWolf.as` ✓. Nit: MCSWolf's ctor calls `super()` (23 clips) THEN pushes 26 more, so partList
  ends at 49 entries — "a 26-slot variant" is a simplification, not a measurement.

---

## HELD, clean (19)

| id | what I opened | result |
|---|---|---|
| `frames/HUNT-rebirth-picker-recoverable-from-strings` | strings.json ["611"],["4155"],["610"],["6030"]-["6033"],["507"]-["510"],["6058"]-["6061"],["4154"],["864"] | all 17 verbatim; 6030=Fire 6031=Water 6032=Wind 6033=Earth in the stated order |
| `frames/HUNT-repair-cost-is-runtime-parameterised` | strings.json ["848"],["849"]-["852"],["636"],["669"],["393"],["4143"],["7042"]; ui_strings.txt:257 | verbatim; ["848"] is a `[0]`-fill; 850/851/852 = Silver Ore / Titanium Ore / Uncut Diamond |
| `frames/HUNT-stance-triangle-and-ring-colours` | strings.json ["6001"],["6003"],["6005"],["IDS_Q50S3NODE0/1"],["6085"]-["6087"]; both session11 frames @3x crop (40,880)-(300,1080) | strings verbatim incl. "Defense -20%"; ring is tan/brown next to "BALA…", and bright blue on the LIGHT frame |
| `frames/HUNT-ui-strings-txt-is-unmined` | ui_strings.txt lines 7,26,100,193,197,212,214,215,257,314 | all ten verbatim; 471 lines ✓. I also confirmed "odds" and "WINNING AND LOSING" appear **nowhere** in the 2,533-entry android table |
| `frames/HUNT-war-tick-is-24-hours` | strings.json ["376"],["372"],["378"],["380"]; seg-20 frames 0011/0012/0013 @2x | strings verbatim; frame_0013 renders ["380"] word-for-word (typo "contruction" included) at page **6/7** |
| `frames/v0717-rewords-the-daily-streak-ladder` | seg-00/frame_0001.jpg crop (0,380)-(700,576) @2.14x | screen reads "AFTER EVERY 10 / 30 CONSECUTIVE DAYS"; ["843"]/["844"] read "Every 10 / 30". I searched all 2,533 entries — no "After every" variant exists. **THE FRAME WINS** |
| `frames/world-map-has-a-fifth-banner-colour` | zFtCaTO0_1M/seg-08/frame_0029.jpg crop (700,160)-(780,230) @15x + full frame @2x | black banner with white circular mon on a castle-town tile; sampled pixels RGB (1,0,0)/(3,0,0) = true black; blue/gold/red/green all present in the same view |
| `hunter/crit-spent-on-release-not-on-hit` | MCSPlayer.as:2699,:2767,:2778,:2796,:3240-3244; §1t99s0§.as:2850,:2869,:2882,:3293-3297 | verbatim both builds; `deductReloadBar()` at :2778 runs **before** `NPCManager.checkHit` at :2796 |
| `hunter/elemental-rebirth-reward-table` | InteractUI.as:848-899 | all four rebirth verbs verbatim, +10 / +20 at DAN==8, `changeStat(2202,-1)` |
| `hunter/focus-plus6-is-a-kill-bonus` | NPCManager.as:1685,:1691,:1709,:1711; MCSPlayer.as:3267; §1t1543s0§.as:2047,:2049 | verbatim both builds; `bonusReload()` is gated on `deathCount > 0` |
| `hunter/hp-chi-regen-is-per-battle` | StatsManager.as:694-712, :1724-1745 | verbatim; the whole seed block and both `saveHealthAfterBattle` variants |
| `hunter/interactui-service-cost-table` | InteractUI.as:918-923, :974, :984-991, :1057-1083 | verbatim; I counted the switch myself: **41** `case "…"` labels (claim said "roughly 40") |
| `hunter/repair-cost-formula-found` | InteractUI.as:1058,:1072,:1073-1075; GetGoldPromptDialog.as:227; GameEngine.as:1295-1297; strings.json["669"] | all verbatim |
| `hunter/skillui-gesture-input-mode` | SkillUI.as:1-80, :117-183; §1t6980s0§.as:55-114 | verbatim; 8 nodes, green/red circles, 4-frame states, only "012" (invalid) and "345" wired. PARTIAL is honest |
| `hunter/web-focus-bar-dead-zone-is-48` | §1t113s0§.as:326-333; MCSPlayer.as:1163,:1168 | verbatim. I also verified the "same predicate" half myself: `§1t99s0§.as:3050 return … && this.§1t4414s0§ >= 48;` and `:3060 if(this.§1t4414s0§ < 48) return;` |
| `hunter/web-speed-cooldown-cap-is-600` | §1t1523s0§.as:2289-2295; StatsManager.as:1856-1860; and :1841 vs :2276 | verbatim; the 600-vs-300 cap and the identical `48 + SPEED*6` both confirmed |
| `itemdata-hunter/full-bar-is-the-crit` | MCSPlayer.as:3198-3223 | verbatim getDamage. Independent web corroboration: `§1t113s0§.as:110` labels the full bar `getString(175)` = strings.json["175"] "Critical Hit", and `:352` fires `Snd_criticalDamage` |
| `itemdata/nine-paperdoll-slots-are-fully-named` | StatsManager.as:262-286, :1943-1945; s21_weapon/t708.0.png crop (170,240)-(870,1045) @1.4x | enum + skip list verbatim → exactly {0,1,3,5,7,8,9,11,12}. The nine boxes on film match the claimed reading order **exactly**: straw hat filled / mask ghost; grey robe filled / gloves ghost; white hakama filled / pickaxe filled; ring ghost / sandals filled / ring ghost |

---

## Overturn ruling — 9 of 23 overturn claims stand

`overturn_upheld = true`: HUNT-rebirth-picker (blocker ⑤ :205 shrinks to layout-only) ·
HUNT-repair-cost (③ :215 is captured) · world-map-fifth-banner (:82 / :244 "4 clans" must become
≥5 owner sides) · elemental-rebirth (item 7's "no 10th-rebirth tier" clause is false) ·
focus-plus6 (③ :195 fill model) · repair-cost-formula (③ :215 closes with a formula) ·
web-focus-bar-48 (③ :195) · web-speed-cap-600 (④ :195 closes outright) ·
nine-paperdoll-slots (the named claim sentence falls).

`overturn_upheld = false`: eight claims name **no** ledger sentence (an addition, not an
overturn) — stance-triangle, ui-strings-unmined, buff-table, crit-on-release, skillui-gesture,
two-line-colours, full-bar-crit, reload-bar-flat. Plus five where the named sentence survives:
- **war-tick-24h** — REBUILD_READINESS.md:244 already lists "24h resolution" as *Ready*; this
  upgrades its cite, it does not overturn the bullet, and :225's other three clauses stand.
- **v0717-daily-streak** — the finding **confirms** the S0-3 parity caveat; it cannot overturn it.
- **hp-chi-regen** — HP/Chi regen is not AP regen, and a MAXAP seed of 30 is not the AP regen rule;
  :225 ③ and ④ both survive.
- **interactui-service-table** — none of :93's seven formulas (DEF curve, stat-vs-level, sell-price,
  condition→DMG, loot tables, XP curve, prosperity) appear in that file.
- **paperdoll-23-slots** — closes the layer COUNT; :210 ⑤ asks for layer ORDER and the icon
  manifest, both still open.

---

## New findings (7) — see the structured return for full text

1. **web v0.717 rebirth pays 25 / 100 Heavenly Gold** (`§1t1523s0§.as:2644-2651`, `:228`) — this,
   not the android 5/20, is the correct overturn of ledger item 7.
2. **1080p captures are pillarboxed 52 px each side** — game-px scale is **2.27**, not 2.4.
3. **BUFF_ATTACK scales `minDamage` only** — footage inflation is < ×1.5.
4. **Three different war-room decks** — android 6 pages, web v0.717 7 pages, ui_strings.txt a 6-page
   deck whose 5/6 "WINNING AND LOSING" exists in neither of the others. Pages 1/3/6 align
   body-for-body, so the extra web page sits at position 7 — which is what licenses reading
   android ["376"] as web page 4/7.
5. **The crit is labelled and voiced in web v0.717** — `getString(175)` "Critical Hit" +
   `Snd_criticalDamage`.
6. **The bar==stance-gate identity is WEB-ONLY** — android gates `nextStance` at
   `maxreload / 6` = 20 (`MCSPlayer.as:2977`) while its bar dead zone is 24 (`:1163`).
7. **The android v0.682 string table has no 900-999 block at all** (highest ID below 900 is 880),
   yet web `§1t113s0§.as:111` renders `getString(960)` as the greyed label under the Focus bar —
   hard proof the web language table carries IDs android does not.
