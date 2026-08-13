# CRITIC — combat-core — LENS 1 (THE CITE LENS)

Blind review. I did not see the surveyor's reasoning, only its output. Every verdict below
carries an artifact **I opened myself**. Where I could not open it, I say so.

Reviewed: 18 claims. **14 upheld · 4 refuted** (1 material mis-cite, 1 material over-claim,
1 mis-quote, 1 scope-limited inference upheld-with-caveat). 8 new findings.

---

## Method

Every AS3 cite was re-opened with `awk 'NR>=a && NR<=b'` on the exact file so line numbers are
mine, not the surveyor's. The two A1 (frame) claims were re-cropped and re-upscaled from the
1920x1080 source with ffmpeg and **looked at**, per §0:

```
ffmpeg -i reference/frames/duel_dense/Nr4fQstqHDM_429.0.png \
  -vf "crop=560:180:0:900,scale=iw*3:ih*3:flags=neighbor"   hud_bars.png      # bottom-left HUD
ffmpeg -i reference/frames/duel_dense/Nr4fQstqHDM_429.0.png \
  -vf "crop=500:260:1420:0,scale=iw*3:ih*3:flags=neighbor"  hud_topright.png  # combo counter
```

Both crops show exactly what the surveyor described. Frame confirmed at 1920x1080 via `sips`.

---

## UPHELD (14)

### `combat-core/reach-cap` — HELD, and now DOUBLE-SOURCED

Cite resolves verbatim. `StatsManager.as:1917-1918` is exactly
`var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;` /
`return int(120 + Math.floor(maxincrement * speed / (20 + speed)));`.
`MCSPlayer.as:3030 / 3041 / 3052-3055 / 3067 / 3078-3082 / 3094` all land on the quoted lines.

**Independent second source the surveyor missed:** `InventoryUI.as:1948 / 1957 / 1966` repeats
all three `slashModifier` values (Light `1.5`, Balanced `1 + 0.5*mastery*0.01`,
Heavy `0.5 + 0.5*mastery*0.01`) in the character-sheet path. Two unrelated code paths agree.

The uncited "800x480 stage pixels" is nonetheless **true**: `StatsManager.as:80`
`public static var stageWidth:int = 800;` and `:82` `public static var stageHeight:int = 480;`.

### `combat-core/reach-is-stroke-budget` — HELD

`InputManager.as:198` `distanceLeft = maxDistance;`, `:363-367` the clamp-and-drain,
`:360` the taper with colour `10027008` (0x990000) and `thickness:int = 8` at `:57` — all verbatim.
Strengthened by `:353` `if(mousePressed && distanceLeft > 0 && ...)`: once the budget is spent the
draw handler stops appending points, so the arc-length cap bounds the hit polyline itself, not just
the drawn line. The ledger's "wire reach into `resolveSlash` … pass player pos" is indeed the wrong
shape.

### `combat-core/crit-gate-deterministic` — HELD

`MCSPlayer.as:3215`, `:3242-3244`, `:3249/3253/3257` verbatim. `BattleUI.as:262`
`this.crittext.visible = percentage >= 1 && this.reloadbar.visible;` verbatim.
`StatsManager.as:1921-1929` floor-48 `slashUsage` confirmed.

### `combat-core/reload-meter-numbers` — HELD (A1 re-looked)

My crop shows: red-ringed kasa portrait, green `20/20`, blue `26/26`, third tan/olive bar with
`CANNOT CHANGE STANCE` over it and gold `150% DAMAGE` beneath. Code side `MCSPlayer.as:239`
`this.maxreload = 5 * 24;`, `:1158-1160` `++this.reload;`, `:1168` the `(tempreload)/(maxreload-24)`
mapping — all verbatim. `baseReload` grep confirms it is written at `:105/:182/:190` and **never
read** — dead, as claimed. `StatsManager.as:1839-1841` `return 48 + (…STAT_SPEED…) * 6;` confirmed.
Stance-change costs `:2977 / :3100 / :3104` confirmed. See NF-7 for a 4.0 s vs 5.0 s correction.

### `combat-core/stance-damage-table` — HELD, DOUBLE-SOURCED

`MCSPlayer.as:3201-3213` verbatim. `InventoryUI.as:1945 / 1954 / 1963` gives the identical
`dmgModifier` table and `:1965` gives `defModifier = 0.8` for Heavy. Ceilings 1.0 / 1.5 / 1.5 confirmed;
the ledger's 0.9/1.2/1.4 and its "Heavy is fixed ×1.4" are both wrong.

### `combat-core/stance-triangle` — HELD (claim text), lane_impact WRONG (see NF-2)

`MCSPlayer.as:3701-3706` verbatim. Direction check: `this` is the **victim** (it is inside
`gotHit`, and `:3721/:3731` treat `controlledBy == 0` as the player). Victim LIGHT + attacker
BALANCED → ×1.2, so Balanced beats Light. Triangle as stated. Applied at `:3703`, before
`damage -= this.getDefense()` at `:3709`. Correct.

### `combat-core/damage-formula-full-chain` — HELD

`StatsManager.as:1881` and `:1902` verbatim; the broken/missing-weapon branch `:1877`
(`… + 1`) and `:1892-1894` (`return 0` range) verbatim. `MCSPlayer.as:3709-3716` verbatim.
`Damage.as:160-172` verbatim. `MCSPlayer.as:3233-3235` Heavy def ×0.8 verbatim.
Small correction: `Damage.as:156-158` adds a **fifth** branch — `if(this.attackerlvl == 0) return this.damage;`
— so it is a four-tier ladder *plus* a level-0 passthrough.

### `combat-core/multi-target-rule` — HELD

`NPCManager.as:1225-1232`, `:1252-1256`, `:1286` verbatim. The `while(… && !enemy.gotHitFlag)`
guard is exactly the once-per-stroke rule; the same `damage:Damage` object is passed to every
`checkHit`, so no falloff. The `dist*dist < 40000` term is `enemy.mcs.x - slashArray[j].x + offset`
— stroke-point to enemy, not player to enemy. Confirmed.

### `combat-core/weak-points-corrected` — HELD

`EnemyShield.as:325-340` and `:351-353` verbatim; `EnemyZombie.as:496-505` and `:516-518` verbatim;
`NPC.as:301-320` back-to-front `partList` walk verbatim. "Shielder legs" is indeed absent from source.
Note the zombie has **no** head bonus at all — only the `!behead → damage /= 2` resist, exactly as
the surveyor said. See NF-6 for one class that orders `behead` differently.

### `combat-core/movement-gesture` — HELD for the artifact, CAVEATED (see NF-5, verdict note)

`MCSPlayer.as:2300-2308` (`dist*dist < 625` → 25 px dead-zone) and `:2337-2343`
(`dist*dist <= 10000` → 100 px walk/run split) verbatim. `InputManager.as:268` with
`lengthThreshhold:int = 4` (`:53`) and `distThreshhold:int = 400` (`:55`) verbatim.
I independently confirmed the negative: `InputManager` handles only `Keyboard.BACK / MENU /
SEARCH / SPACE / ENTER` (`:528`, `:597`, `:604`) — no A/D, no hold-to-run; the only player
`startAction(RUN_STATE)` sites in the whole tree are `MCSPlayer.as:2343` and `:2499`.
**Caveat, material:** this is an Android **touch** port. "No hold-mouse-to-run" is the one
finding a touch build structurally cannot adjudicate for a mouse build. It survives only because
the project's own frame work already reached the same place —
`docs/research/fidelity/COMBAT_MEASUREMENTS.md` §b-1 "click-destination (M2) leading; hold-run
(M1) NOT strictly falsified" and `docs/DIVERGENCES.md:318` "Tip #27 = hold-mouse-to-run is NOT a
measured fact" — neither of which the surveyor cited.

### `combat-core/gesture-attack-map` — HELD

`MCSPlayer.as:2437-2454` (DOWNSTAB / `diff > 25` HOR_SLASHUP / `diff < -25` HOR_SLASHDOWN),
`:2459-2466` (`destX -= 55` / `+= 55`), `:2781-2783` (UP_SLASH → `Damage.LAUNCH_AIR`),
`:3131-3154` (skill IDs 1014-1019 / 1036-1038) and `:3164-3187` (mastery ≥ 3/4/5) — all verbatim.

### `combat-core/combo-rule` — HELD (A1 re-looked)

My top-right crop shows a large red brush-stroke `3` over a black plate reading `HIT COMBO`,
with the circled pause button to its right. `StatsManager.as:4300-4305` verbatim (cap 999),
`NPCManager.as:1286` verbatim, `MCSPlayer.as:3732` `StatsManager.resetCombo();` verbatim —
gated on `damage > 0` and `GameEngine.isBattleMode()`. Addendum: `NPCManager.as:1277-1281` runs
the same `comboCount++` over `neutralList`, so **neutral NPCs count toward combo too**.

### `combat-core/shake-and-no-hitstop` — HELD

`StageManager.as:1200-1227` verbatim (default `shakeAmt = 30`), `:1101` `redFreezeCounter = 24 * 6;`
verbatim, `NPCManager.as:1635-1646` verbatim, `BattleUI.as:426-427` verbatim.
Caller list is **incomplete** — see NF-8 — but every omitted caller is also off the ordinary-slash
path, so the conclusion ("shake is not fired by landed slashes; no hitstop exists") stands.

### `combat-core/mobile-vs-web-parity` — STILL_UNHELD, and CORRECTLY SO

This is the right answer and I am upholding it, not penalising it. My own frame work makes it
**stronger**: see NF-5. `payload_export.log` does carry the mangled identifiers, though not at
line 9 (see the mis-cite note below).

---

## REFUTED (4)

### 1. `combat-core/crit-multiplier` — MATERIAL. The "corroborating" cite says the OPPOSITE.

The primary cite is fine: `MCSPlayer.as:3215-3222` is verbatim correct — combat applies
**Light ×1.5, everything else ×1.2**.

But the claim parenthesises "(corroborated `InventoryUI.as:1946/1955/1964/1970-1971`)".
I opened it. It is **inverted**:

```
InventoryUI.as:1941  if(stance == MCSPlayer.LIGHT_STANCE)
InventoryUI.as:1946      critModifier = 1.2;
InventoryUI.as:1950  else if(stance == MCSPlayer.BALANCED_STANCE)
InventoryUI.as:1955      critModifier = 1.5;
InventoryUI.as:1959  else if(stance == MCSPlayer.HEAVY_STANCE)
InventoryUI.as:1964      critModifier = 1.5;
```

Light = **1.2** on the character sheet, 1.5 in combat. Balanced/Heavy = **1.5** on the character
sheet, 1.2 in combat. This is not corroboration; it is a contradiction the surveyor read past.
The same function's `dmgModifier`, `defModifier` and `slashModifier` all match combat exactly —
only `critModifier` is flipped, which is what makes it look like a genuine ship bug rather than a
decompiler artefact.

Consequence: ledger blocker ② ("crit 1.3 vs 3 final") is **PARTIAL, not closed**. The build ships
two mutually exclusive crit tables and nothing in the payload arbitrates which the web v0.717
player experienced. `1.3` is dead either way.

### 2. `combat-core/early-ttk` — MATERIAL. "Unconditionally" is false.

Cites resolve: `npcdata.xml:23-29` and `itemdata.xml:7907-7913` are verbatim,
`Damage.as:160-162` is verbatim, `EnemyElite.as:97` `itemdata = QuestEngine.getItemData(13002);`
is verbatim. The **substance** — a large class of early mobs dies in one hit — survives.

What does not survive is the universal quantifier. I histogrammed all 495 `<npc>` rows:

```
hp == 1 : 42 of 495 rows
lvl <= 5: 48 rows.  (id, lvl, hp, defense):
  (1,3,1,0) (2,3,1,0) (3,3,1,0) (4,3,1,0) (5,3,1,0)
  (6,2,1,3) (7,2,5,3) (8,2,5,3) (9,2,5,3) (10,2,5,3)
  (56,3,1,0) (57,3,1,0) (58,3,1,0) (101,1,2,0) (117,5,10,5)
```

npc ids **7-10** are level-2 — as early as it gets — with **hp 5, defense 3**. Against those, a
mastery-0 Light swing that fails to clear defence 3 is floored to `1 + piercing` by
`Damage.as:160-162` and needs **five** strokes, not one. Two further over-reaches:

- **Starter ≠ fallback.** Item `13002` is the weapon `EnemyElite` substitutes when an *NPC's*
  weapon lookup fails. Nothing in the cite establishes it as the *player's* starter weapon, which
  is what blocker ③ asks for.
- **§2.1 naming.** `<name>5009</name>` is a numeric ID. Calling these rows "early field mobs" and
  equating them with the ledger's "L1 bandit fight" is an identification the payload alone does not
  license. (It happens to be right — see NF-4, 5009 = "Ruffian" — but the surveyor did not hold that.)

### 3. `combat-core/damage-popups` — MATERIAL. The quoted line is not at the cited position, and the player's popups are black.

The claim cites "`EnemyShield.as:392-408` **and** `MCSPlayer.as:3805-3826`" and then quotes
`ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);` as covering both.
`MCSPlayer.as:3805` does **not** say that:

```
MCSPlayer.as:3801   if(damage > 0)
MCSPlayer.as:3803      if(this.controlledBy == 0)
MCSPlayer.as:3805         ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),damagetextcol);
MCSPlayer.as:3807      else
MCSPlayer.as:3809         ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);
```

`damagetextcol` is a local declared `= 0` at `:3584` and reset `= 0` at `:3700`; its only non-zero
assignment (`= 16777215`, `:3706`) sits under `if(this.controlledBy != 0)` — the exact complement of
the `controlledBy == 0` branch that reads it. So **on every reachable path `:3805` paints
0x000000 black**. The player's own damage numbers are black, not 0x990000.

The four elemental colours and the `(x, y-100)` anchor are correct as stated. A recreation built to
"exact colours" from this claim would paint every hit the player takes dark red.

### 4. `combat-core/string-table-located` — MINOR. Two off-by-one cites; one branch missed.

Substance is right and the honest PARTIAL is the correct verdict — I am flagging the citation
hygiene only, plus one thing that changes the picture (NF-4).

- `LangManager.as:37` is `language = id;`. `var server:String = "./data/";` is at **`:38`**.
- `Locale.addXMLPath(ENGLISH, server + "shs3_en.xml");` is at **`:56`**, not `:55`.
- `Mobile_Lang_EN.as:5` is exact.
- Missed: `LangManager.as:39-49` **overrides** that path when `StatsManager.useExternalLang` —
  to `QueryManagerPIO.instance.getStringsDir()` (PlayerIO) or `QueryManager.instance.server +
  "strings/"`. So `./data/shs3_en.xml` is the *non-external default*, not necessarily where the
  live web build fetched from.

Separately, `payload_export.log:9` is `Exported script 8/1079 fl.managers.IFocusManager` —
the mangled `§1t398s0§` the score rationale quotes is at **`:12`**. The substance (web logic is
identifier-mangled) is true.

Also for the record: the score rationale's "925 default-package classes" does not check out.
`ls -1 *.as` in `reference/decompiled/shs3_android/scripts/` = **553** top-level classes;
`find . -name '*.as'` = **970** including the six sub-packages. `MCSPlayer.as` is 4775 lines, exactly
as claimed.

---

## NEW FINDINGS (8)

**NF-1 · `combat-core/crit-modifier-contradiction`** — A2, PARTIAL. The build ships two inverted
crit tables (`MCSPlayer.as:3217-3221` vs `InventoryUI.as:1946/1955/1964`). Blocker ② is not closed.

**NF-2 · `combat-core/white-popup-dead-code`** — A2, HELD. The white (0xFFFFFF) triangle-advantage
damage colour is **unreachable**: assigned `MCSPlayer.as:3706` under `controlledBy != 0`, read only
`MCSPlayer.as:3805` under `controlledBy == 0`. Identical dead pattern in `EnemyClone.as:439` vs
`:514-516`. The surveyor's "it gives the white popup its meaning (an NPC landing a triangle hit on
you)" is wrong twice: the direction is inverted (`this` is the victim, so `!= 0` means a **non-player**
victim) and the colour never renders at all.

**NF-3 · `combat-core/early-ttk-not-universal`** — A2, PARTIAL. See refutation 2.

**NF-4 · `combat-core/string-table-resolved`** — A2/PARTIAL. The mobile string table has in fact
been extracted this session (session scratchpad `lang_en.xml`, an XLIFF of 250 KB derived from
`reference/preservation/shs3_android_payload.swf` binaryData 118, exactly the close-path the
surveyor named). It resolves the §2.1 blocker for the mobile build:
`<trans-unit id="1377" resname="5009"><source>Ruffian</source>` (line 4139) — so npcdata id 1 *is*
a bandit-class mob; `resname="4041"` → `Branch` (line 2951) — item 13002 is a **stick**, consistent
with a 1-2 damage fallback; `resname="175"` → `Critical Hit`, the string `BattleUI.as:102` loads into
`crittext`. **Action:** copy that XML into `reference/extracted/` so it becomes a durable A2 cite;
today it lives only in a scratchpad and is not citable under §0. I independently reproduced the
surveyor's negative result — `zlib.decompress` on that SWF fails, header `4357 5372 7899 2269` —
so their honesty about not doing the extraction is accurate.

**NF-5 · `combat-core/crit-label-web-divergence`** — A1, PARTIAL. **The frame wins, and it disagrees
with the mobile source.** In `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png`
(crop 560x180+0+900, ×3 nearest-neighbour) the web build prints `CANNOT CHANGE STANCE` across the
third bar and gold `150% DAMAGE` beneath it. The mobile build's crit label is a single string,
`LangManager.getString(175)` = "Critical Hit" (`BattleUI.as:102`), and its stance label is an
unrelated hover MovieClip (`BattleUI.as:430-440`). The web crit HUD is therefore **not** the mobile
crit HUD. A flat "150% DAMAGE" also sits badly with a stance-split 1.5/1.2 crit. Concrete probe that
would settle blocker ② and the parity question in one shot: find any duel frame where the third bar
is full in a non-Light stance and read the percentage. If it ever reads 120%, the split is confirmed
for web; if it always reads 150%, web crit is flat.

**NF-6 · `combat-core/behead-order-not-uniform`** — A2, HELD. `EnemyClone.as:421-425` applies
`damage *= 1.5` **inside** the part switch (before defence subtraction and before the min-damage
floor), whereas `EnemyShield.as:351-353`, `EnemyZombie` and `MCSPlayer.as:3714-3717` apply it
**after** the floor. Same nominal multiplier, different arithmetic. A recreation with one shared
resolver will diverge on low-damage head hits.

**NF-7 · `combat-core/reload-fill-time`** — A2, HELD. The surveyor's "empty-to-full in 96 ticks =
4.0 s" is the **visible bar** only: `MCSPlayer.as:1163-1168` maps `(reload-24)/(maxreload-24)`, so the
bar reads 0 for the first 24 ticks. The **crit gate** is `reload == maxreload` from `reload = 0`
(`:240`) — 120 ticks = **5.0 s** at the 24 fps of `Mobile.as:117`. Both numbers are real; they are
not the same number and the config must not conflate them.

**NF-8 · `combat-core/shake-callers-incomplete`** — A2, HELD. The shake caller list omits four:
`MCSPlayer.as:4180` (inside `gotDeathTouch`, per the function header at `:4161`),
`StatsManager.as:3535` (cutscene script command `id == 126`, amount scripted per-call),
`Marker_RumbleTrigger.as:44` (level marker, its own duration **and** amount), and
`Trap_CrusherColumnAuto.as:90`. `Marker_RumbleTrigger` matters: it is the only caller that overrides
the default `shakeAmt = 30`, so amplitude is authorable per level.

---

## NO-TOUCH COMPLIANCE

No file outside this journal path was modified. `src/core/Sim.ts` and `tests/duel-baseline.test.ts`
untouched. All work was read-only plus ffmpeg crops written to the session scratchpad.
