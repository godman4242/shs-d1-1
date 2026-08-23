# LEDGER PACKET — `combat-core`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**40 surviving overturns · 10 true-but-rejected · 93 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **combat-core** | 42 | gesture map, damage formula, blade-path model, combo rules | **reach cap in px**; crit final read; early TTK numbers; Focus/crit gating rule |
### combat-core — 42
- **Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads).
- **Blockers:** ① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.* ② crit 1.3 vs 3 final — *read one crit popup.* ③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.* ④ multi-target per-hit rule (full vs falloff). ⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*
- **Surface:** `DASH_SLASH_PX=127`, `SLASH_FRAMES`, `STANCE_TABLE` reach — already measured; **wire reach into `resolveSlash`** (today it gets no player pos and no reach gate).
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-A/web-focus-meter-constants-diverge-and-the-recharge-is-plus-one]]` — UPHELD [A2] (2 critics)

The Focus/crit gating rule closes, but on WEB constants that differ from android on three of five terms, and the per-tick recharge is +1, not +6, in BOTH builds. WEB v0.717: maxreload = 8*24 = 192 frames (§1t99s0§.as:249) against android's 5*24 = 120 (MCSPlayer.as:239). Recharge is +1 per tick while reload < maxreload (web §1t99s0§.as:1203-1205; android MCSPlayer.as:1158-1160); the +6 is bonusReload(), whose only caller is NPCManager.as:1711 inside `if(deathCount > 0)` — a KILL bonus (web twin §1t99s0§.as:3320-3323). In-battle stance switch costs a FLAT -48 in web (§1t99s0§.as:3162, inside §1t3489s0§ under the isBattle guard) where android collapses reload>max/2 to max/3 else -max/6 (MCSPlayer.as:3098-3104, inside setStance which opens at :3019). The stance gate is reload >= 48 in web (§1t99s0§.as:3050, :3060) vs reload < maxreload/6 = 20 in android (MCSPlayer.as:2977). Identical in both: zero-at-full on a slash, and the x0.5 / x1 / x1.5 per-stance drain. Nothing about this system needs measuring — but the android numbers are the wrong build's.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3050, :3060, :3162, :3295-3310, :3320-3323 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :1158-1160, :2977, :3098-3104, :3242-3272 and NPCManager.as:1711`
- **Build:** both
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** L5 combat-core ⑤ and skills-meters ③ close on WEB numbers: max 192, +1/tick, +6 per kill, -48 per in-battle stance switch, gate at 48, x0.5/x1/x1.5 slash drain, crit at full.

### `[[actionscript/reach-formula]]` — UPHELD [A2] (2 critics)

The blade-path reach cap is fully specified in stage pixels — baseSlashLength = 120 + floor((90 + 5*DAN) * SPEED / (20 + SPEED)), times a per-stance multiplier, with a hard 100 px floor on Heavy and Dual — and it is enforced on the drawn line at input time via InputManager.setMaxDistance.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (parity: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2347); per-stance §1t99s0§.as:3094/3105/3116/3131/3142 with floors at :3119 and :3145; cap enforced §1t99s0§.as:3158 = android MCSPlayer.as:3094 'InputManager.setMaxDistance(this.slashLength);' + InputManager.as:106-109`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build."
- **Lane impact:** L-combat-core — the highest-weight blocker in the system, closed without a measurement pass and without a playable build. Usable numbers at Dan 0: SPEED 0 → base 120 ⇒ Light 168 / Balanced 120 / Heavy 100(floor); asymptote → base 210 ⇒ Light 294 px max.

### `[[bindata/launcher-downed-ground-finisher-verbset]]` — UPHELD [A2] (2 critics)

An entire launcher / knockdown / ground-finisher / evasion verb set is authored in bindata and appears nowhere in the ledger's combat model.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin:5846,6142,24174`
- **KILLS this line:** "| combat-core | 42 | gesture map, damage formula, blade-path model, combo rules | reach cap in px; crit final read; early TTK numbers; Focus/crit gating rule |"
- **Lane impact:** combat-core. The ledger frames combat-core as '42 with five missing numbers'. It is missing a whole verb category: a launcher, a synchronised airborne-victim track, a downed state with three recoveries, a ground finisher, a dodge roll and directional step/brake — and (with run-3's C6) their exact tick counts are held.

### `[[combat-core/36-was-not-a-crit]]` — UPHELD [A1] (2 critics)

The repo's only numeric basis for 'crit 1.3' (red 36 vs 27 on the same target) is dead: the crit bar was EMPTY on every frame of that fight, so 27/30/36 is a random damage roll — frame proof of the RNG term in getDamage().

- **Cite:** `reference/frames/session11/damage-ttk/t19*.png (18 frames), row-1032 crit-bar scan x∈[247,515]; plus t1961.900.png HUD crop (100,940)-(620,1080) LANCZOS x3`
- **KILLS this line:** "36/27 = 1.333 does match the forum-derived "crit 1.3""
- **Lane impact:** L5 — closes the 'crit 1.3' folklore from the frame side as well as the source side, and gives the next measurer a real crit-detection protocol: pair every popup value with the third bar's state in the same frame (full + 'CRITICAL HIT' = crit, anything else = roll).

### `[[combat-core/crit-is-1.3-gated-on-full-slash-meter]]` — UPHELD [A2] (2 critics)

Crit in v0.717 is a flat x1.3 plus the crit-damage affix, and it fires exactly when the slash/reload meter is full - which answers combat-core blockers 2 and 5 in one expression.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (meter identified as the slash meter by :3162 and :3302-3310); android divergence at reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3215-3222`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** combat-core blockers ② and ⑤ both close without a video read. The 1.3-vs-3 question is settled at 1.3 (+ STAT_CRITICALDMG, an additive gear affix). The Focus/crit gating rule is: crit applies only while the meter is at max, and the meter is spent by slashing (§1t99s0§.as:3302-3310, -slashUsage/2, -slashUsage, -slashUsage*1.5 by stance) and by changing stance (:3162, a flat -48) - so crit is a first-strike-from-full mechanic, not a random roll. The android v0.682 twin instead uses x1.2, or x1.5 for Light, on 'reload == maxreload' - the desktop wins.

### `[[combat-core/crit-is-flat-1.3]]` — UPHELD [A2] (2 critics)

Critical damage in v0.717 is a flat x1.3 in every stance, applied when the reload bar is full, plus the STAT_CRITICALDMG gear affix.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3271-3273 and §1t5957s0§.as:2727/2736/2745`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** combat-core blocker 2 closed with no footage needed; promote crit to CONTRACT = 1.3. Note the android v0.682 build differs (1.2 in Light, 1.5 elsewhere, MCSPlayer.as:3215-3221) — another datapoint that v0.682 combat tuning is NOT v0.717.

### `[[combat-core/crit-meter-exists-in-web-build]]` — UPHELD [A1] (8 critics)

A web-build frame shows the third HUD bar reaching 100% with the label CRITICAL HIT printed across it — proving the crit meter exists in the shipped game and correcting the project's own SESSION-11 note that 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — 1800×780 two-panel still, viewed at 50%; lower panel, HUD bar row. Corroborated by BattleUI.as:259-262 + :102 and strings.json 175`
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** L5 + L8 — the combat HUD is three bars, not two; the third is the crit/reload meter and it carries a 'CRITICAL HIT' overlay at full. Consumption is also visible: session11/gap-focus-trigger/t1003.933.png empty right after a slash, t1004.000.png a fresh sliver.

### `[[combat-core/crit-meter-is-6-seconds]]` — UPHELD [A2] (2 critics)

The web crit meter is maxreload = 8x24 = 192 ticks drawn as (reload-48)/(192-48) = 144 ticks at 24 fps = exactly 6.000 s of visible travel, and the stance-switch gate is a flat reload < 48 — which is why 'CANNOT CHANGE STANCE' shows only at displayed 0%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :3060; §1t113s0§.as:328-338`
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** L5 + L8 — build 6.000 s, not 5.8 s and not 4.0 s. Independently confirmed on frames: my three measured windows fit 6.000 s to <=1.2 px (t1004.800->t1005.000 9 vs 8.8 px; t1082.100->t1082.900 36 vs 35.1; t1081.100->t1082.100 45 vs 43.8), and 5.845 s is not realisable as an integer tick count at the SWF-header 24.0 fps.

### `[[combat-core/crit-track-268px-six-seconds]]` — UPHELD [A1] (2 critics)

The crit/reload track is 268 px wide at 1080p (x 245..512), measured on a bar that is actually FULL — which makes the fill rate 45.0 px/s = 16.8 %/s and the empty→full sweep 5.96 s, not 5.8 s.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t2175.933.png — white-pixel extent over rows 1026-1049, x∈[200,600]; HUD crop (100,940)-(620,1080) LANCZOS x3`
- **KILLS this line:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end)"
- **Lane impact:** L5 + L8 — build the meter at 6.0 s, and use 268 px / x 245..512 as the HUD track geometry for all three bars. Measuring a bar's track on an EMPTY bar is the error mode; measure it on a full one.

### `[[combat-core/damage-triple-crit-1p3-and-heavy-def-confirmed-in-web-source]]` — UPHELD [A2] (3 critics)

The damage half of the stance model and the crit multiplier are held from WEB source, not inferred: damage is dmg x (0.5 + 0.04·lightMastery) for Light, x (1 + 0.02·balancedMastery) for Balanced, and a FLAT x1.4 for Heavy/Dual/Reversed; at reload == maxreload the result is x1.3 plus an item crit-damage add; and Heavy stance takes defense x0.8. This confirms REBUILD_READINESS.md:189 and the damage half of RR:155 from primary source and closes combat-core blocker ② ('crit 1.3 vs 3 final').

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 and :3284-3290`
- **Build:** web v0.717
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L5 combat-core: blocker ② is CLOSED from source — crit is 1.3x and it is DETERMINISTIC, fired by reload == maxreload (i.e. a full Focus bar), not by a chance roll. That also answers skills-meters blocker ⑤ ('crit proc rule (chance vs deterministic) — entirely absent'): it is deterministic, and the spend at §1t99s0§.as:3297 zeroes the bar on the critting slash.

### `[[combat-core/dan-scaled-slash-length]]` — UPHELD [A2] (9 critics)

The base slash length is an exact formula in stage pixels that is scaled by Dan rank, so the combat-core 'reach in units of unknown scale' blocker is answered and its ceiling is owned by the rebirth system.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1919, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348; BankUI.as:264`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build."
- **Lane impact:** combat-core blocker ① — units are stage pixels, floor 120, asymptote 210 px at Dan 0 rising to 255 px at Dan 9. Bank weight is 100 + DAN*10 + PAIDSTORAGE*10. Both are corroborated by the game's own prompt (string 610: 'Slash length and bank storage is increased with each dan rank').

### `[[combat-core/dual-reversed-reach-inverted]]` — UPHELD [A2] (2 critics)

Reversed stance has the ×1.4 reach and no floor; Dual stance has ×1.0 floored at 100 px — the survey's per-stance reach table has these two swapped.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35 with :3130-3146; named confirmation in reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:27-35 + setStance`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L5 (COMBAT CORE): the reach table is Light ×1.4 · Balanced ×(1+0.02M) · Heavy ×(0.5+0.04M) floor 100 · Dual ×1.0 floor 100 · Reversed ×1.4. Shipping the survey's version gives both bonus stances the wrong blade reach.

### `[[combat-core/early-mob-hp-distribution]]` — UPHELD [A2] (2 critics)

Of the 495 <npc> rows, 22 are lvl<=2 and their HP is 1 (x17), 2 (x1) and 5 (x4); the four 5-HP rows (ids 7, 8, 9, 10) all carry defense 3, so against the starter Branch they take five hits, not one.

- **Cite:** `reference/extracted/npcdata.xml — full <npc> enumeration; ids 7/8/9/10 alongside the already-cited id 6 at :145-152`
- **KILLS this line:** "③ early-mob HP + starter weapon DMG + hits-to-kill — read L1 bandit-fight popups in video A."
- **Lane impact:** L5 + L4 — the L1 TTK model is bimodal, not 'one hit'. 77% of early mobs die to a single stroke; a distinct 18% tier takes five. Frame-side this is exactly what damage-ttk shows: '1' and '2' popups on enemies whose green bars do not empty.

### `[[combat-core/early-ttk]]` — UPHELD [A2] (8 critics)

Blocker ③ is dead: the L1 character has ATK 1 / DEF 1 / SPD 1 / HP 10, the starter weapon fallback is item 13002 'Branch' at 1-2 damage, and every sampled lvl≤2 mob has 1-5 HP — so early mobs die in ONE hit, confirming the SESSION-11 frame measurement from source.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:693-708 and :1830-1832; reference/extracted/itemdata.xml:7906-7915; reference/extracted/npcdata.xml:146-152 and :2474-2480; names via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "③ early-mob HP + starter weapon DMG + hits-to-kill — read L1 bandit-fight popups in video A."
- **Lane impact:** L5 + L4 — full derivation: minDamage 1+1 = 2, range 1, balanced roll 2, vs Thug DEF 3 → floored at 1+pierce → 1 damage vs 1 HP = one-hit kill. Conversely Thug attack 5 vs player maxhp 10 means the player dies in 2-3 hits at L1.

### `[[combat-core/full-reload-crit-is-1p3-in-v0717]]` — UPHELD [A2] (2 critics)

The v0.717 crit is a flat x1.3 on every stance when the reload gauge is full, plus the gear crit-damage affix - so the ledger's open 'crit 1.3 vs 3' question is closed at 1.3 for the shipped build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (§1t1243s0§ = STAT_CRITICALDMG per the initAttackStats call at §1t1523s0§.as:2269; §1t4414s0§/§1t4415s0§ = reload/maxreload per :3162 and :3169); android v0.682 diverges at MCSPlayer.as:3215-3221`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L combat-core blocker (2) closed without a video frame. Also names the trigger the ledger lists as unknown ('the Focus/crit gating rule (fill trigger/amount/consumption)'): the gate is reload == maxreload, and android v0.682 splits it x1.2 non-Light / x1.5 Light, so the split is NOT in the shipped build.

### `[[combat-core/injured-buff-halves-reach]]` — UPHELD [A2] (2 critics)

The INJURED buff halves base slash length alongside min damage and defence - a reach modifier neither the ledger nor the rebirth lane records.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:214-223`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L-combat-core: reach is not a pure function of speed, Dan and stance - a status effect scales the base by 0.5 before the stance multiplier. Any reach test that does not control for BUFF_INJURED can measure the wrong number.

### `[[combat-core/popup-animation-and-black-variant]]` — UPHELD [A1] (2 critics)

Damage popups have a full animation contract nobody read (ttl 12 frames, velY -5, scale +0.1/frame from ttl<10, alpha -0.25/frame from ttl<4 => a 0.5 s, 60-world-unit rise ending at ~1.9x scale), and the frames show a BLACK popup alongside the dark-red one, so 0x990000 is not the whole colour story.

- **Cite:** `reference/frames/session11/damage-ttk/{t125.350,t125.417,t125.450,t125.467,t125.733}.png — crop (780,480)-(1180,680) upscaled 2x, five-tile sheet; code at reference/decompiled/shs3_android/scripts/TextProjectile.as:17-25`
- **KILLS this line:** "floating damage/crit popups (absent from the ledger)"
- **Lane impact:** L8 + L5 — ui-hud blocker 3 closes with an actual animation spec, not just a spawn point and a colour. The black variant needs one grep to attribute (MCSPlayer.as:709/:724 uses colour 0 for seppuku damage, so black may mark self/ally damage in v0.717) before any popup is built.

### `[[combat-core/popup-colour-is-a-semantic]]` — UPHELD [A1] (2 critics)

Damage-popup colour is a SEMANTIC, not a constant: black (0x000000) for damage the player takes, 0x990000 for damage dealt to anyone else, plus four element colours and a chi colour — so ui-hud blocker ③ closes on the rule, not on one hue.

- **Cite:** `reference/frames/session11/damage-ttk/t1960.000.png crop (760,500)-(900,620) LANCZOS x6, and t1961.900.png crop (470,580)-(680,700) LANCZOS x5`
- **KILLS this line:** "damage popups spawn at (mcs.x, mcs.y-100) in 0x990000, closing ui-hud blocker ③"
- **Lane impact:** L8 — the HUD spec needs a colour TABLE keyed on victim and damage element, not a single popup colour; building the surveyor's version paints every hit the player takes dark red. L5 — the same branch is a free 'is this me' flag for the popup emitter.

### `[[combat-core/raw-frames-show-full-crit-meter]]` — UPHELD [A1] (2 critics)

Two raw 1920×1080 video frames — not a montage — show the third HUD bar at 99% and then at 100% with CRITICAL HIT printed across it, permanently killing SESSION-11's 'the bar never once reached full (max 67.7%)' and 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t1746.733.png and t1747.000.png — crop (150,940)-(620,1070) upscaled 3× (LANCZOS); third full-bar frame at t2175.933.png`
- **KILLS this line:** "SUMMARY: HEADLINE: our build's meter set is wrong. The OG has exactly three meters — HP (green), CHI (blue), and FOCUS (white, no numerals) — and NO Critical meter at all. ... CRIT: NOT FOUND, and this matters. Across ~845 s of sampled play the bar never once reached full (max 67.7% at B t=837.683)"
- **Lane impact:** L5 + L8 — the surveyor's own cite (m_nearfull.png) is a derived montage; these are its raw sources and are the citable artifacts. SESSION-11's 'Focus buys evasion, not crit' conclusion and its Critical-meter deletion recommendation both need re-opening.

### `[[combat-core/reach-cap]]` — UPHELD [A2] (8 critics)

Blocker ① is dead: reach is a source-exact stat formula, base = 120 + floor((90 + 5·danRank)·SPD/(20+SPD)), in 800×480 world units — not an unmeasured 'unit of unknown scale'.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (scale established by InputManager.as:341 and :229)`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build."
- **Lane impact:** L5 — the reach gate can be built today from a formula rather than waiting on a footage measurement; at the stated L1 character base = 124 world px.

### `[[combat-core/slash-distance-is-player-visible]]` — UPHELD [A2] (2 critics)

The character sheet prints the slash reach to the player as 'slash distance: N (stance)', and the web payload's own authored copy of that field reads 345 for Heavy — a value the v0.717 formula cannot produce.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2232 + reference/extracted/ui_strings.txt:361`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** combat-core 1: confirms the reach number is a first-class, player-facing quantity in the game's own display units, and gives its exact label format. BUT it also opens a real conflict — 345 for Heavy exceeds the v0.717 ceiling (base <= 255 at Dan 9 with infinite speed, x Heavy <= 0.86 -> <= 219). Either the authored default text is stale from an earlier build, or a slash-length term exists outside getBaseSlashLengthVal. Do NOT treat 345 as measured; treat it as an open discrepancy to resolve before the reach model is frozen.

### `[[combat-core/stance-reach-modifiers]]` — UPHELD [A2] (1 critic)

The per-stance slash-length modifiers are held verbatim in the WEB payload — LIGHT ×1.4, BALANCED ×(1+0.02·balancedMastery), HEAVY ×(0.5+0.04·heavyMastery) with a hard floor of 100, REVERSED ×1.4, DUAL = base floored at 100 — which closes L1 combat-core blocker ① outright, and they are DIFFERENTLY TUNED in the Android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3093, :3105, :3115-3119, :3130, :3141-3145 (web v0.717) vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052-3055, :3067, :3078-3081 (android v0.682)`
- **KILLS this line:** "① reach cap in stage px per stance — the one value the whole model needs."
- **Lane impact:** L1 combat-core blocker ① dies in full, not partially: base = 120 + floor((90 + Dan*5)*spd/(20+spd)) from progression/spd-scaling, then the per-stance multiplier above. COMBAT_MEASUREMENTS §S24-B's measured band (30 strokes, 120–280 px @1080 = 53–124 world px) sits entirely UNDER these caps, which is exactly what a truncation cap predicts, and the wiki ceilings in §S24-B/c-0 (Light 300 / Balanced 200 / Heavy 100) land on the payload: HEAVY's hard floor is literally 100, and LIGHT at the Dan-1 asymptote is (120+95)×1.4 = 301 ≈ 300. Also the SECOND independent proof in this lane that Android is differently tuned — generalising Stage-0b S0-3 from 'per-point magnitudes' to 'combat tuning at large'. Port from WEB.

### `[[combat-core/v0717-crit-is-flat-1.3]]` — UPHELD [A2] (1 critic)

Blocker ② resolves to 1.3 after all: the v0.717 build applies a flat ×1.3 plus a flat crit-damage stat at full meter, with no stance branch — so CRIT_MULT = 1.3 in src/config/combat.ts is already right.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L5 — blocker ② is closed at the TARGET build, in the ledger's own favour. The ×1.5/×1.2 split is a v0.682-only retune. SOURCE_CONSTANTS.md:158 additionally records a SECOND, stacking ×1.3 for body parts 12 neck / 16 head / 17 hat — which is the v0.717 answer to the survey's ×1.5 behead.

### `[[combat-core/web-as3-is-readable]]` — UPHELD [A2] (2 critics)

The shipped web build v0.717's full ActionScript is decompiled and cross-readable in the repo — 1,079 classes with obfuscated identifiers but intact numeric literals — so combat constants never needed to come from the android v0.682 build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (StatsManager, web) and §1t99s0§.as:9-19 (MCSPlayer, web); inventory count at reference/decompiled/payload_export.log:4`
- **KILLS this line:** "The web payload's own AS3 is obfuscated (reference/decompiled/shs3payload/scripts/§1t51s0§/, 5 files) and cannot be cross-read."
- **Lane impact:** L5 + every lane that cited android source — the CONTRACT-SRC-v0.682 labelling policy this unit proposes is unnecessary; constants that match across both builds (base-reach formula, standingRange, jumpThreshhold, slash speeds, defence ×0.8, slashUsage floor 48, unlock ladder, RNG damage roll) can be promoted to plain CONTRACT today, and constants that differ must be taken from the WEB file.

### `[[combat-core/web-crit-is-1.3-flat]]` — UPHELD [A2] (2 critics)

Crit in the shipped web build is a flat ×1.3 with no stance split — the ledger's 1.3 candidate was correct and src/config/combat.ts CRIT_MULT must NOT be changed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L5 — blocker ② closes at 1.3, not at the survey's 1.2/1.5 split. Android v0.682's 1.2 (non-light) / 1.5 (light) is a version retune and must not be ported.

### `[[combat-core/web-damage-stance-curves]]` — UPHELD [A2] (2 critics)

The v0.717 damage stance curves are light x(0.5 + 0.04*mastery), balanced x(1 + 0.02*mastery), heavy/dual/reversed flat x1.4 — the exact permutation of the reach curves, at the same coefficients the repo already documents.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258-3270`
- **KILLS this line:** "damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** L5 — the RNG roll per slash is real and Sim needs an injected mulberry32 draw for it; but use 0.5+0.04m / 1+0.02m / flat 1.4, not the android 0.005 coefficients. The ledger's flat '(ATK+Wpn)×stance' is still wrong (it is a roll, not a point value) — that half of the survey's correction stands.

### `[[combat-core/web-heavy-damage-1.4]]` — UPHELD [A2] (2 critics)

In the shipped build the heavy/dual/reversed damage multiplier is ×1.4, not ×1.5 — the same 1.4/1.5 android retune that hits light reach, so the reach↔damage permutation is 1.4-flat on both diagonals in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258-3271`
- **KILLS this line:** "the stance term is a mastery curve (light 0.5+0.005m, balanced 1+0.005m, heavy/dual/reversed flat 1.5) that is the exact permutation of the reach curves"
- **Lane impact:** L5 — the damage table for v0.717 is light ×(0.5+0.04m), balanced ×(1+0.02m), heavy/dual/reversed ×1.4; the RNG roll per slash (mulberry32, injected) is confirmed in both builds and is the real structural finding here.

### `[[combat-core/web-maxreload-192]]` — UPHELD [A2] (2 critics)

The shipped crit/reload meter is 192 ticks with the first 48 hidden, refilling +1 per frame at 24.0 fps — exactly 6.000 s empty→full, which matches the repo's own frame regression to three decimals and dissolves the claimed source-vs-frame conflict.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :1203-1205; §1t113s0§.as:328; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **KILLS this line:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end); the android constants predict 4.00 s. THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s."
- **Lane impact:** L5 + L8 — build maxreload = 192, hide the first 48 ticks in the HUD, refill +1 per 24 Hz frame. The repo's session-11 measurement (6.01 / 6.00 / 5.98 s) is now source-confirmed rather than the only evidence, and the android's 120/24 is a retune to be discarded.

### `[[combat-core/web-maxreload-192-and-48-offset]]` — UPHELD [A2] (2 critics)

The web build's crit meter is maxreload = 8×24 = 192 ticks with the HUD bar showing (reload−48)/(192−48) = 144 ticks — which at the SWF's 24 fps is 6.00 s, matching the frame-measured 5.9–6.1 s and dissolving the survey's claimed parity break.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and §1t113s0§.as:326-330; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** L5 + L8 — blocker ⑤ closes fully from the shipped build: 192-tick meter, +1/frame at 24 fps, bar shows the last 144 ticks, zeroed at full on crit, charged slashUsage ÷2/×1/×1.5. The stance lock is a flat `reload < 48` with a flat −48 cost, and 'reload < 48' is EXACTLY 'bar reads zero', which is why t1003.000.png shows CANNOT CHANGE STANCE on an empty bar. No frame-vs-source conflict exists.

### `[[combat-core/web-stance-damage-and-reach-are-inverse]]` — UPHELD [A2] (2 critics)

WEB v0.717's stance model is an explicit reach-vs-damage inversion, and both halves use the same mastery coefficients. REACH: Light base x1.4, Balanced base x(1 + 0.02*mastery), Heavy base x(0.5 + 0.04*mastery) floored at 100, Dual base x1 floored at 100, Reversed base x1.4. DAMAGE: Light x(0.5 + 0.04*mastery), Balanced x(1 + 0.02*mastery), Heavy/Dual/Reversed x1.4. So Light = long reach / low damage and Heavy = short reach / high damage, with mastery moving the weak axis. The ANDROID v0.682 numbers the packet ported (x1.5 and 0.005*mastery) are a different tuning.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3155 (setStance / reach) and :3255-3277 (getMaxDamage); base term reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2347`
- **Build:** web v0.717
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs …) [REBUILDREADINESS.md:194]"
- **Lane impact:** L5 combat-core — this is ledger blocker ①, closed with the TARGET build's numbers. The base term 120 + floor((90 + DAN*5)*SPD/(20+SPD)) is identical in both builds and can be banked as CONTRACT; the five multipliers must come from §1t99s0§.as, not from MCSPlayer.as. Feeds InputManager.setMaxDistance as the drawn-line cap.

### `[[combat-core/web-v0717-ast-is-readable]]` — UPHELD [A2] (2 critics)

The web v0.717 payload's ActionScript is decompiled and readable in this repo — 612 obfuscated top-level classes, 1,079 .as files, plain bodies — so no combat constant in this lane needed to be sourced from the android build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 and §1t99s0§.as:249/:3094/:3105/:3116/:3274; corroborated by docs/research/fidelity/SOURCE_CONSTANTS.md §0 (2026-07-25, 'CRACKED AND MINED … Build identified as v0.717')`
- **KILLS this line:** "② crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L5 (and every other lane that inherited the 'android is all we have' framing) — v0.717 constants are directly readable, so any A2 in a combat lane can and must be taken from shs3_payload, with shs3_android used only for the four data XMLs (which SOURCE_CONSTANTS §3.7 already tags CONTRACT-SRC (0.682)). The gauntlet's standing android caveat should be narrowed to the XML tables, not applied to code constants.

### `[[combat/web-stance-reach-multipliers-diverge-from-android]]` — UPHELD [A2] (3 critics)

The WEB v0.717 build uses DIFFERENT per-stance reach multipliers from Android v0.682, so the reach model L1 must port is not the one the android decompile gives. Web: Light = base x1.4, Balanced = base x(1 + 0.2*balancedMastery*0.1), Heavy = base x(0.5 + 0.4*heavyMastery*0.1) with a hard floor of 100, Reversed = base x1.4, Dual = base x1.0 floor 100. Android: 1.5 / (1+0.5*m*0.01) / (0.5+0.5*m*0.01) / 1.5 / 1.0. At mastery 9 the balanced multiplier is 1.18 web against 1.045 android and heavy is 0.86 against 0.545. The SPD base term 120 + floor((90 + Dan*5)*spd/(20+spd)) IS identical in both builds (§1t1523s0§.as:2346-2347 vs StatsManager.as:1917-1918), and both feed InputManager.setMaxDistance, so only the multipliers diverge. Class identity is not guessed: §1t99s0§ is the MCSPlayer twin by its 15-arg initPlayer at :183-199 (param10 -> §1t4420s0§, declared = 10 exactly like baseSlashLength:int = 10 at MCSPlayer.as:107; param13/14 -> balanced/heavy mastery) and by :3158 calling §1t1541s0§.§1t10094s0§(this.§1t4417s0§), the setMaxDistance(slashLength) twin.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119, :3131, :3142-3145, :183-199, :3158; reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:106-108; reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2347`
- **Build:** web v0.717 (contrasted against android v0.682)
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build."
- **Lane impact:** L1 combat-core blocker ① dies — but on THESE constants. Any port of the android multipliers will miss the filmed build's reach on three of five stances. Also a general warning for this lane: combat tuning is exactly where v0.682 and v0.717 drift, so every combat number cited from shs3_android/ needs its web twin located before it is promoted to CONTRACT.

### `[[frames/HUNT-39-hardcoded-tips-in-GameEngine]]` — UPHELD [A2] (2 critics)

39 hardcoded gameplay rules live in an if(dice==n) ladder in GameEngine.as and are in NO string table and NO ledger. They state, in words, mechanics that several blockers are waiting on: the item rarity colour enum (green=special, blue=rare, purple=unique - which decodes the coloured quest-item names on film), SPD driving both skill cooldown and slash length, the hold-mouse-to-run rule that project memory records as 'never sourced', the full keyboard/gesture input map (spacebar=stance, number keys=skills, drag-and-drop to aim a skill), a 12-hour crop seed constant, undead head-targeting, the village->town->city->castle upgrade ladder behind TOWN PROSPERITY, a whole duel-recording/'Duels TV' feature, chat emotes, Scavenging L5 revealing hidden paths, and AP replenishing via duels/war room.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:536-695 (39 tips); key lines :564, :568, :572, :584, :588, :592, :596, :608, :612, :616, :620, :624, :640, :644, :679, :683, :695`
- **Build:** android v0.682 (shs3_android); identical block present in shs3_android_payload
- **KILLS this line:** "memory: "§3's 'hold-run per Tip #27' was REVERSED by measurement 2026-07-25 - it was never sourced""
- **Lane impact:** items-equipment (rarity enum), combat-core (SPD->cooldown+reach, hold-run, undead heads), ui-hud (input map), world-exploration (settlement upgrade ladder), meta-social (Duels TV)

### `[[frames/HUNT-stance-triangle-and-ring-colours]]` — UPHELD [A2] (4 critics)

The complete stance rock-paper-scissors and its only hard number are held in the string table, plus the HUD portrait-ring colour enum - and none of it is in the packet. Heavy stance carries an explicit Defense -20% penalty, which is directly codeable.

- **Cite:** `strings.json["6001"], ["6003"], ["6005"], ["IDS_Q50S3NODE0"], ["IDS_Q50S3NODE1"], ["6085"]-["6087"]; visual corroboration reference/frames/session11/lead/t396.0_counter-triangle.png (tan/brown ring, BALANCED STANCE) and reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (blue ring, LIGHT)`
- **Build:** android v0.682 string table; ring colours corroborated on web v0.717 frames
- **Lane impact:** combat-core (counter triangle + Defense -20%), ui-hud (ring colour enum), skills-meters (per-stance hold-to-charge ultimates)

### `[[frames/HUNT-ui-strings-txt-is-unmined]]` — UPHELD [A2] (4 critics)

reference/extracted/ui_strings.txt is a 471-line WEB-build artifact the packet uses for exactly one thing (font faces). It contains a duel BETTING system with odds, a tournament/arena mode template, a three-way damage taxonomy, next-level skill previews, HP/CHI regen fields, and the war-room rules page that v0.717 added.

- **Cite:** `reference/extracted/ui_strings.txt:7, :26, :100, :193, :197, :212, :214, :215, :257, :314`
- **Build:** web (pre-v0.717 snapshot - its war-room deck still reads /6 where the v0.717 frame reads /7)
- **Lane impact:** meta-social (betting + tournaments), combat-core (damage taxonomy), skills-meters (next-level deltas), and it names v0.717's extra war-room rules page

### `[[frames/critical-evade-states-the-focus-gate]]` — UPHELD [A1] (2 critics)

The game states the Focus gating rule in its own skill card: a full Focus bar buys EVASION while slashing in that stance — an evade gate, not a crit meter — and the skill-card widget the ledger told someone to go read in a preserved build is already on film.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg (crop 20,190-400,400 @5x); screen context at frame_0010.jpg and frame_0011.jpg`
- **Build:** web v0.717
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** combat-core (blocker ⑤ Focus/crit gating), skills-meters (blocker ① the skill-card surface)

### `[[hunter04/web-v0717-crit-is-flat-1_3-vindicating-the-ledger]]` — UPHELD [A2] (2 critics)

The web v0.717 damage function diverges from android and CONFIRMS the ledger's CRIT_MULT=1.3. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 rolls baseDamage = minDamage + random()*damageRange, then applies LIGHT x(0.5 + 0.4*lightMastery*0.1), BALANCED x(1 + 0.2*balancedMastery*0.1), HEAVY/DUAL/REVERSED x1.4 - and then, only when reload == maxreload, returns 'dmg * 1.3 + STAT_CRITICALDMG' for EVERY stance, with no Light special case. Android (MCSPlayer.as:3198-3223) instead uses x1.2 non-Light / x1.5 Light and stance factor x1.5. Two consequences: the crit is DETERMINISTIC on a full Focus bar (no proc chance anywhere), and the ledger's wiki-sourced 'Critical = 1.3 x Physical' is now a CONTRACT code fact for the target build. At mastery 9 the web stance ceilings compute to 0.86 / 1.18 / 1.40, matching the ledger's §3.3 'the stance tables (dmg 0.9/1.2/1.4) are MASTERY-9 CEILING values'.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "(2) crit 1.3 vs 3 final — read one crit popup. … (5) crit proc rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L-combat-core and L-skills-meters: combat-core blocker (2) and skills-meters blocker (5) both close. CRIT_MULT=1.3 stays and is promoted from wiki-INFERRED to CONTRACT; the stance damage table for v0.717 must use x1.4 Heavy and the ·0.1 mastery scale, NOT android's x1.5 and ·0.01.

### `[[hunter04/web-v0717-per-stance-reach-coefficients-differ]]` — UPHELD [A2] (2 critics)

Rider on the reach-per-stance close: use the WEB coefficients, not android's. reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094 sets LIGHT slashLength = baseSlashLength * 1.4; :3104 BALANCED = base * (1 + 0.2 * balancedMastery * 0.1); :3116-3120 HEAVY = base * (0.5 + 0.4 * heavyMastery * 0.1) floored at 100; :3131 REVERSED = base * 1.4; :3142-3146 DUAL = base floored at 100. Android instead uses x1.5 for LIGHT and REVERSED and a ·0.01 mastery scale (MCSPlayer.as:3029, :3042, :3053). The base function and stage are parity, so the SHAPE of the close is safe: §1t1523s0§.as:2347 'return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));' and §1t1523s0§.as:104 'public static var stageWidth:int = 800;'. Worked example for a fresh v0.717 character (SPD 1, DAN 0): base = 120 + floor(90*1/21) = 124 stage px, so LIGHT 173, BALANCED 124, HEAVY max(62,100) = 100 - and at 1920-wide capture that is x2.4 screen px per stage px.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3104, :3116-3120, :3131, :3142-3146 · reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104, :2347 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:3029, :3042, :3053`
- **Build:** web v0.717 (contrasted with android v0.682)
- **KILLS this line:** "(1) reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L-combat-core: closes combat-core blocker (1) for the RIGHT build. Also kills STANCE_TABLE's fixed reach 300/200/120 in kind - reach is a computed function of SPEED and DAN, not a constant, and its unit is the 800-px stage.

### `[[itemdata-hunter/reach-is-per-stance]]` — UPHELD [A2] (2 critics)

Reach IS per-stance in the engine, closing the ledger blocker the packet's own claim #0 said was still open. MCSPlayer.setStance converts baseSlashLength (StatsManager.getBaseSlashLengthVal = 120 + floor((90 + DAN*5) * speed / (20 + speed))) into the live reach: LIGHT x1.5, BALANCED x(1 + 0.5*balancedMastery*0.01), HEAVY x(0.5 + 0.5*heavyMastery*0.01) floored at 100, REVERSED x1.5, DUAL x1 floored at 100 — then pushes it to InputManager.setMaxDistance. Note LIGHT carries no mastery term at all; lightMastery is spent on damage instead (MCSPlayer.as:3205).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3019-3094`
- **Build:** android v0.682
- **KILLS this line:** "Combat numbers: reach cap in px per stance."
- **Lane impact:** L5 COMBAT CORE / L-art-anim-feel: the ledger's 'reach cap in px per stance' blocker is CLOSED. Reach = getBaseSlashLengthVal(speed) x the stance factor above, in an 800-px-wide game stage (StatsManager.as:80), i.e. 2.4 screen px per game px in a 1080p capture.

### `[[skilldata/web-cooldown-modifier-caps-spd-at-600]]` — UPHELD [A2] (2 critics)

WEB v0.717's SPD→cooldown modifier caps SPD at 600 and returns 1 - SPD/1200, i.e. exactly half the per-point effect of the ANDROID v0.682 form (cap 300, 1 - SPD/600). The -50% ceiling and the x1.5 speed-buff step before the cap are the same in both. This also re-pins the reader's SPD in the longplay: the measured 4.96 / 9.92 / 8.92 s cooldowns come from raw 5 / 10 / 9 s at SPD 10, not SPD 5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2295, consumed at reference/decompiled/shs3_payload/scripts/§1t105s0§.as:318; contrast reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861`
- **Build:** web v0.717
- **KILLS this line:** "④ SPD→cooldown formula. [REBUILDREADINESS.md:195]"
- **Lane impact:** L5 combat-core and skills-meters — closes ledger blocker ④, but with the WEB constants. Porting the android form would double every SPD point's cooldown reduction and would make the two measured Focus cooldowns irreproducible.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[combat-core/basereload-is-dead-code]]` — NOT-UPHELD [A2] (2 critics)

getBaseReload() = 48 + SPD*6 is a write-only dead field in the android build: it is stored into MCSPlayer.baseReload and never read anywhere, so meter refill is SPD-independent and 48+SPD*6 must not be built as a refill rate.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105 and :190 (assignments only); exhaustive grep `grep -rni basereload reference/decompiled/shs3_android/scripts/ | grep -v "var baseReload\|this.baseReload = \|baseReload:int"` returns no rows`
- **Lane impact:** L5 — delete '48 + SPD*6 refill' from the Focus economy. The meter fills at a flat +1 per frame regardless of SPD (MCSPlayer.as:1160 / web §1t99s0§.as:1205). SPD affects reach (getBaseSlashLength) and skill cooldowns, not Focus.

### `[[combat-core/reach-and-crit-configs-already-correct]]` — NOT-UPHELD [A2] (2 critics)

src/config/reach.ts's lightMult 1.4 / balancedPerMastery 0.02 / heavyPerMastery 0.04 and src/config/combat.ts's CRIT_MULT 1.3 are all EXACTLY the shipped web build's values — they must not be 'fixed' to the android numbers this unit recommends.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119, :3274 vs src/config/reach.ts (REACH block) and src/config/combat.ts:17`
- **aimed at this line, which SURVIVES:** "three live constants in src/config/reach.ts and one in src/config/stances.ts are WRONG against the source and must be fixed before any of it is wired in"
- **Lane impact:** L5 — this is a DO-NOT-TOUCH ruling on four live constants that are already right and already labelled CONTRACT-SRC. Only stances.ts LAUNCH_UNLOCK_LEVEL.heavy (5, source 3 in both builds) is a genuine live bug.

### `[[combat-core/web-behead-is-1.3]]` — NOT-UPHELD [A2] (2 critics)

The behead (hat/head/neck) multiplier in the shipped web build is ×1.3, not ×1.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:470-472 (vs reference/decompiled/shs3_android/scripts/NPC.as:451-453)`
- **aimed at this line, which SURVIVES:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** L5 — universal head/neck/hat weak point confirmed in the shipped build, but at ×1.3. Note the pattern: v0.682 moved BOTH the crit multiplier and the behead multiplier off 1.3 and onto 1.5, so any android number near 1.5 should be treated as suspect until cross-read.

### `[[combat-core/web-build-as3-is-readable]]` — NOT-UPHELD [A2] (2 critics)

The shipped web build's ActionScript is fully readable — 1079 decompiled classes under reference/decompiled/shs3_payload/, name-obfuscated but literal-intact — so every combat constant can be cross-read on v0.717 directly instead of being inferred from the android v0.682 client.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (build stamp) + docs/gauntlet/L0/index/actionscript.json bundles.shs3_payload = 1079`
- **aimed at this line, which SURVIVES:** "P0 EXPERIMENT RUN 2026-07-23: DEFINITIVELY no offline playable build ... ~40 INFERRED values won't be measured from a live build."
- **Lane impact:** L5 (and every other lane citing android source) — the whole 'android v0.682 is all we have, parity unproven' framing is wrong. Class map recovered by numeric-literal shape: §1t99s0§=MCSPlayer, §1t1523s0§=StatsManager, §1t113s0§=BattleUI, §1t1541s0§=InputManager, §1t67s0§=Damage, §1t68s0§=NPC, §1t122s0§=stat/enemy builder. ~40 INFERRED values are now readable from the shipped build without needing it to run.

### `[[frames/HUNT-combat-corpus-never-opened]]` — NOT-UPHELD [A1] (2 critics)

58% of the frame corpus was never read by this survey. Of 7,381 frames, only 2,675 sit in the two longplay chapter directories - and every single one of the packet's 21 cites points at a seg-NN longplay directory. 4,256 frames across 44 directories are purpose-shot 1920x1080 COMBAT/DUEL measurement stills (session24/svm-B05-mountain-duel/fight15 480, svm-A16-beach-duel 406, reach-A28-forest-duel 372, reach-B-dojo 342, reach-B-honda-duel 248, gait-duel-speeds 194, session11/stance-reach, gap-gait-hitbox, strike-travel-duration, duel_dense, combat_analysis...) and NOT ONE claim touches them. Every claim in the packet is a UI screen, menu or dialogue box. The lane this repo exists for - 1:1 duel combat feel - is 100% absent from the packet, and it is the half of the corpus shot at full resolution with self-describing measurement filenames (e.g. A_t117.400_BALANCED_lvl1_stroke235px.png, B_t783.400_LIGHT_stroke-anchored-at-body_farGap436px.png, t393.0_stance-ring-colours.png, t396.0_counter-triangle.png).

- **Cite:** `docs/gauntlet/L0/index/frames.json (directory counts) + reference/frames/session11/lead/t396.0_counter-triangle.png (1920x1080, read whole) + reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (1920x1080, read whole)`
- **Build:** web v0.717
- **Lane impact:** combat-core, art-anim-audio-feel, skills-meters: the entire 1:1 combat evidence base is unsurveyed. Re-run the frames survey against session11/* and session24/* before anything else.

### `[[hunter/crit-spent-on-release-not-on-hit]]` — NOT-UPHELD [A2] (2 critics)

The Focus meter is emptied at slash RELEASE, before any hit test runs, in both builds. deductReloadBar() zeroes a full bar then subtracts the per-stance slashUsage, and it is called from endSlash() ahead of NPCManager.checkHit(). Damage (including the crit multiply) is frozen even earlier, at slash launch. A whiffed crit therefore costs the entire meter.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2699, :2767-2796, :3240-3244 · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2850, :2869, :2882, :3293-3297`
- **Build:** both
- **Lane impact:** L-combat-core feel: the crit is a committed swing, not a rewarded hit. A recreation that refunds a missed crit plays measurably differently.

### `[[hunter/two-drawn-line-colours-and-the-real-red]]` — NOT-UPHELD [A2] (2 critics)

The drawn-line colour constant 10027008 is 0x990000, not 0xA30000 (which is 10682368) — the packet states the wrong hex in two claims. There are also TWO named line styles, not one: greenLine() = 39168 = 0x009900 and redLine() = 10027008 = 0x990000, both 8px with ROUND caps and joins, named identically in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:172-179 · reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:172-179 · reference/decompiled/shs3_android/scripts/SkillUI.as:75, :136`
- **Build:** both
- **Lane impact:** L-art-anim-audio-feel and L-combat-core: under the 1:1 licence ruling the blade stroke must be #990000, and the recreation needs the #009900 companion stroke for the gesture surface.

### `[[itemdata-hunter/full-bar-is-the-crit]]` — NOT-UPHELD [A2] (2 critics)

A full reload bar IS the crit condition, and stance mastery scales damage — neither is mentioned anywhere in the packet, which treats the bar purely as a slash budget. getDamage rolls baseDamage = minDamage + random()*damageRange, applies a stance factor (LIGHT x(0.5 + 0.5*lightMastery*0.01), BALANCED x(1 + 0.5*balancedMastery*0.01), HEAVY/DUAL/REVERSED x1.5), and then, only when reload == maxreload, returns maxDamage*1.2 + STAT_CRITICALDMG (x1.5 in LIGHT).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`
- **Build:** android v0.682
- **Lane impact:** L-combat-core / L-skills-meters: this is the mechanism behind 'OG has NO Critical meter (Focus buys evasion)' in the session-11 memory — the crit is bought by a FULL reload bar, and the stance mastery stats are damage multipliers, not cosmetic ranks.

### `[[itemdata-hunter/reload-bar-max-is-flat-not-speed]]` — NOT-UPHELD [A2] (2 critics)

The reload/Focus bar's maximum is a flat constant, not 48 + SPEED*6, and the two builds use DIFFERENT constants. StatsManager.getBaseReload() (48 + SPEED*6) is computed, passed into MCSPlayer.initPlayer and stored at :190 — and then never read anywhere in the bundle. :239 unconditionally sets maxreload = 5*24 = 120 (EnemyClone.as:77 does the same). The web v0.717 build sets 8*24 = 192. A recreation that scales the meter with SPEED is modelling something the original does not do.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:190 and :239; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`
- **Build:** both — 120 on android v0.682, 192 on web v0.717
- **Lane impact:** L-skills-meters / L-combat-core / L-ui-hud: the Focus/reload max is a CONTRACT constant of 192 for the web v0.717 target. 48 + SPEED*6 must not be implemented.

### `[[string-table/piercing-and-crit-are-web-v0717-held]]` — NOT-UPHELD [A2] (2 critics)

The 'Critical Damage' / 'Piercing Damage' stat channels carry NO Android-only caveat: the WEB v0.717 payload's own tooltip authoring text names both, so the survey's build-parity hole on this claim does not exist.

- **Cite:** `reference/extracted/ui_strings.txt:100`
- **Build:** web v0.717
- **aimed at this line, which SURVIVES:** "Ready: gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** L-combat-core + L-items-equipment: retires the 'android v0.682 only, a stat panel is exactly the surface that could differ' caveat on the piercing/crit channels. Combined with combat-core.md:448 (Damage.as:150-172, 'lvl <= 10 -> 1 + piercing ... else lvl/4 + piercing') and the banked items-equipment/stat-vs-level-curve (ItemGenerator.as:150-183, prog5 = PIERCINGDMG), both channels are held in BOTH builds with arithmetic attached — they should be moved off the unknown list, not added to it.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NEW-9-heavy-defense-0.8-double-confirmed]]` — UPHELD [A2] (1 critic)

Heavy-stance Defense ×0.8 is confirmed twice in the target build: the web getDefense twin returns `defense * 0.8` for HEAVY, and skill 1002's own in-game description ends 'Defense -20%'. The ledger's damage-math line (:74) and combat-core Ready line (:189) are A2-backed on this term rather than wiki-sourced.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3290`
- **Build:** both
- **Lane impact:** L5 combat-core: the 'one way' qualifier in the ledger is right — the multiplier is applied in getDefense on the defender's own stance, so it is a property of being in Heavy, not of being hit by Heavy.

### `[[NF-11-negative-grep-in-v0717-stance-slash-multipliers-is-false]]` — UPHELD [A2] (1 critic)

A load-bearing negative grep in one packet finding is itself wrong. combat-core/v0717-stance-slash-multipliers dismisses another survey on the grounds that its grep terms '0.005' and '0.5 + 0.5 *' 'exist in neither build'. The second term occurs FOUR TIMES in the android build. Only '0.005' is genuinely absent from both. A dismissal built on a false negative grep is the same error twice, and the survey it kills should be re-opened.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3052, :3205 and InventoryUI.as:1945, :1966`
- **Build:** android v0.682
- **Lane impact:** L1 combat-core: reinstates rebirth/stance-slash-multipliers-parity's PARTIAL rather than letting it be killed. (Note: v0717-stance-slash-multipliers rotated OUT of this packet mid-review; I had already judged it HELD with this defect.)

### `[[NF-14-canchangestance-is-a-state-whitelist]]` — UPHELD [A2] (1 critic)

Stance switching is gated by an explicit action-state whitelist: only IDLE, POSE, RUN, WALK and SKILL_CHICHARGE permit a change, plus FLINCH if the previous state was one of those. The player-facing form of this rule is visible on a frame as the bar label 'CANNOT CHANGE STANCE'.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2965-2968; frame corroboration at reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`
- **Build:** android v0.682 code; web v0.717 frame
- **Lane impact:** L5 combat-core and L8 ui-hud — the stance-switch cost (reload/3 or -reload/6) only applies when this whitelist passes, so the Focus economy and the stance gate are one rule. Note the build-parity signal: 'CANNOT CHANGE STANCE' is visible in the web v0.717 longplay but I found NO matching string in the android v0.682 string table, so UI copy is NOT at parity even though skilldata is byte-identical.

### `[[NF-16-heavenly-sword-numbers-unclaimed]]` — UPHELD [A2] (1 critic)

Heavenly Sword's actual numbers are on disk and no claim in the packet carries them: skill 1047, lvlreq 65, requires skill 1046, chi 50 and cooldown 30 at every level, three levels whose descs 7078/7079/7080 read '500 damage, 5 sec delay', '500 damage, 4 sec delay', '500 damage, 3 sec delay'. Damage is flat across levels; what levels buy is a shorter telegraph.

- **Cite:** `reference/extracted/skilldata.xml:1435-1464; docs/gauntlet/L0/index/strings.json["7078"], ["7079"], ["7080"], ["6100"]`
- **Build:** android v0.682 (skilldata byte-identical to web v0.717)
- **Lane impact:** L5 combat-core and L4 enemies-ai — a 500-damage drag-to-aim delayed AoE with a level-scaled 5/4/3-second telegraph window. Heavenly Sword is in ALL FOUR of EnemyPlayer's range buckets and is the first skill enemies use on a downed target (EnemyPlayer.as:1077), so this is a boss-fight-defining number.

### `[[NF-3-inventory-preview-contradicts-sim-on-crit]]` — UPHELD [A2] (1 critic)

The shipped build contradicts itself on crit. InventoryUI's gear-comparison panel sets critModifier = 1.2 for LIGHT stance and 1.5 for balanced and heavy — the exact inverse of the simulation's Light-1.5 / non-Light-1.2 at MCSPlayer.as:3217-3221. The 'critical dmg: min - max (stance)' readout at InventoryUI.as:2087 therefore misreports crit damage in at least one stance.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1946 and :1955 and :1964, versus MCSPlayer.as:3217-3221`
- **Build:** android v0.682
- **Lane impact:** L5 combat-core must port the SIM values (MCSPlayer), not the preview values. L3 items-equipment: any 1:1 recreation of the (EQ:n) comparison UX inherits an OG bug — worth reproducing deliberately and labelling, or fixing and labelling, but not silently averaging.

### `[[NF-3-obfuscated-web-payload-is-symbol-mappable-by-call-signature]]` — UPHELD [A2] (1 critic)

The obfuscated web payload can be symbol-mapped against the Android build by matching call signatures, which is what makes the whole combat-core cluster admissible instead of inferred. §1t99s0§.as:183-199 assigns fifteen params in the order controlledBy, hp, maxhp, chi, maxchi, defense, baseReload, minDamage, damageRange, §1t4420s0§, slashUsage, §1t4421s0§, §1t4422s0§, §1t4423s0§, level — param-for-param identical to shs3_android_payload/scripts/StatsManager.as:1834 `player.initPlayer(0,…,getBaseSlashLength(),getSlashUsage(),getStat(1000),getStat(1001),getStat(1002),getLevel())`. That pins §1t4420s0§ = baseSlashLength and §1t4421/4422/4423s0§ = light/balanced/heavy mastery. §1t99s0§ is further identified as the desktop MCSPlayer because it defines §1t4446s0§, the initElementDefenseStats callee at §1t1523s0§.as:2270.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:183-199 against reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1834`
- **Build:** both
- **Lane impact:** Method note for the whole gauntlet: Android-derived constants can be CHECKED IN THE WEB BUILD by structural/signature match even with the symbol names gone. Every combat-core verdict in this packet rests on it.

### `[[NF-4-live-bug-launch-unlock-level-heavy]]` — UPHELD [A2] (1 critic)

LIVE CONFIG BUG. src/config/stances.ts:61 sets LAUNCH_UNLOCK_LEVEL.heavy = 5, but BOTH builds gate the heavy launch at mastery 3. Web §1t99s0§.as:3239 `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` (heavy canLaunch) and android MCSPlayer.as:3182 `this.canLaunch = this.heavyMastery >= 3;`. Balanced is >= 5 in both (:3233 / :3176) and light >= 3 in both (:3223 / :3166), so only the heavy row is wrong — and the whole table can be promoted INFERRED -> CONTRACT-SRC in the same edit. No packet claim's text asserts this; it appears only inside one lane_impact, so it is currently un-banked.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3239 and reference/decompiled/shs3_android/scripts/MCSPlayer.as:3182`
- **Build:** both
- **Lane impact:** L5 combat-core: one-line config fix plus a label promotion. This lane is NO-TOUCH for source, so it is a queued code task, not an edit.

### `[[NF-4-mastery-domain-is-1-to-10]]` — UPHELD [A2] (1 critic)

The stance-mastery term in both the reach and damage formulas is the 1-10 skilldata <value>, not a 0-100 figure. StatsManager.as:1834 passes getStat(1000/1001/1002) into MCSPlayer.initPlayer as lightMastery/balancedMastery/heavyMastery; getStatType routes ids 1000-1999 to SKILL and getStat returns skillStat.getValue(); and MCSPlayer.as:3166-3184 gates Launch/Deflect/AirCombo/Stab on `mastery >= 3 / >= 4 / >= 5`, thresholds only meaningful on a 1-10 ladder. InventoryUI.as:1941-1965 recomputes the identical coefficients from the same getStat calls.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3166-3184 and InventoryUI.as:1941-1965; StatsManager.as:1834, :2940-2943, :3956-3961`
- **Build:** android v0.682
- **Lane impact:** L5 combat-core — the reach and damage coefficients are now portable as numbers, no INFERRED label needed. Consequence: Balanced reach spans only x1.005..x1.05 and Heavy x0.505..x0.55, so the hard floor of 100 at MCSPlayer.as:3053-3055 is load-bearing for most of the game, not an edge case. It also unlocks the per-mastery TECHNIQUE ladder (Launch at 3, Deflect at 4, AirCombo/Launch/Stab at 5) which no claim in the packet carries.

### `[[NF-5-v0682-charsheet-contradicts-its-own-crit]]` — UPHELD [A2] (1 critic)

v0.682's character sheet displays a crit multiplier its own combat code does not produce. InventoryUI sets critModifier Light 1.2 / Balanced 1.5 / Heavy 1.5, but MCSPlayer.getDamage applies x1.2 to every stance EXCEPT Light and x1.5 to Light — exactly inverted. This makes the crit column of the stance-modifier table unusable as a source, in either build. (Moot for the target build: v0.717 is a flat x1.3 with no stance branch at §1t99s0§.as:3272-3276.)

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1946, :1955, :1964 vs MCSPlayer.as:3215-3221`
- **Build:** android v0.682
- **Lane impact:** L1 combat-core: a guard-rail on combat-core/stance-modifier-table-in-payload. Ship its dmg/def/slash columns, never its crit column.

### `[[NF-5-v0717-crit-is-flat-do-not-port-android-crit-column]]` — UPHELD [A2] (1 critic)

Any per-stance crit table sourced from the Android InventoryUI is v0.682-only and must not be shipped against a v0.717 target. Web: the character sheet sets crit 1.3 in all three stance branches (§1t5957s0§.as:2727, :2736, :2745) and getDamage applies `_loc2_ * 1.3 + <flat crit-dmg stat>` with no stance branch (§1t99s0§.as:3274). Android: MCSPlayer.as:3215-3222 returns `maxDamage * 1.2 + STAT_CRITICALDMG` for non-Light and `* 1.5` for Light, and InventoryUI.as:1946/1955/1964 set critModifier 1.2 / 1.5 / 1.5. Android also uses Heavy dmgModifier 1.5 vs web 1.4.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2727, :2736, :2745 against reference/decompiled/shs3_android/scripts/InventoryUI.as:1946, :1955, :1964`
- **Build:** both
- **Lane impact:** L5 combat-core: hard guard-rail on combat-core/stance-modifier-table-in-payload. src/config/combat.ts:17 CRIT_MULT = 1.3 is already correct for the target build.

### `[[NF-6-heavy-stance-takes-80pc-defense]]` — UPHELD [A2] (1 critic)

getDefense() returns defense * 0.8 in HEAVY_STANCE and defense unmodified in every other stance — the source line behind the ledger's 'Heavy def x0.8'. Confirmed a second time by InventoryUI.as:1964 setting defModifier = 0.8 for heavy in the gear-comparison panel.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3238; corroborated at InventoryUI.as:1964`
- **Build:** android v0.682
- **Lane impact:** L5 combat-core — the ledger already carries 'Heavy def x0.8' as Ready but had no source line; this grounds it and shows Dual/Reversed do NOT take the penalty despite sharing Heavy's 1.5x damage.

### `[[NF-7-focus-drain-is-stance-scaled-and-crit-empties-bar]]` — UPHELD [A2] (1 critic)

The Focus/reload drain is stance-scaled, and landing a crit costs the entire bar. deductReloadBar() first zeroes a full bar, then subtracts slashUsage/2 in Light, slashUsage in Balanced and Reversed, and slashUsage*1.5 in Heavy and Dual. So Light rebuilds Focus twice as fast per slash as Balanced and three times as fast as Heavy — and every crit resets the meter to zero.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3240-3263`
- **Build:** android v0.682
- **Lane impact:** L2 skills-meters — completes the packet's focus-is-the-reload-meter claim, which only carried the flat slashusage. L5 combat-core — this is the actual crit economy: Light crits often for 1.5x, Heavy crits rarely for 1.2x, and that tension is the stance meta.

### `[[NF-9-345-and-200-are-already-ruled-placeholders]]` — UPHELD [A4] (1 critic)

Both of the reach numbers this lane keeps re-litigating were ruled inadmissible on 2026-07-25 by the repo's own fidelity ledger, which outranks REBUILD_READINESS.md under that document's own precedence clause (:11-14). 'slash distance: 345 (heavy)' is named as Flash-IDE dummy text beside 'physical dmg: 1234 - 1235', 'hp: 123 / 123' and 'chi: 123 / 434'; and the wiki's 'Balanced reach = 200' is traced to a static initialiser that setStance overwrites on every call. I verified the initialiser exists.

- **Cite:** `docs/research/fidelity/SOURCE_CONSTANTS.md:31-40 (which itself cites the payload), carrying reference/decompiled/shs3_android/scripts/InputManager.as:51 and :108`
- **Build:** both
- **Lane impact:** L1 combat-core: kills slash-distance-is-player-visible's 'open discrepancy' framing, and caveats the POSITIVE half of the three mastery-zero findings — write the ledger fix as 'the reach table is not a mastery-9 ceiling; reach is a formula', not as '300/200/100 = mastery-0'.

### `[[actionscript/behead-and-weapon-parry]]` — UPHELD [A2] (2 critics)

Striking hat, head or neck sets a decapitation flag and multiplies damage (×1.3 in web v0.717, ×1.5 in Android v0.682), while striking the weapon part deals zero damage and does not even consume the hit — a free parry surface created by paperdoll z-order.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3738-3740 and :3805-3806 (web) · reference/decompiled/shs3_android/scripts/NPC.as:437-440 and :451-453 (Android)`
- **Lane impact:** L-combat-core / L-enemies-ai: the ledger's 'part-based weak points (shielder legs, undead heads)' is emergent behaviour of a universal rule; L-items-equipment — a rendered sword literally makes an enemy harder to hit.

### `[[actionscript/stance-triangle-second-android-site]]` — UPHELD [A2] (1 critic)

The stance counter-triangle has a second Android implementation site beyond MCSPlayer: EnemyClone applies the same x1.2 unfavourable multiplier with the same white 16777215 popup. Both builds therefore spread the rule across MCSPlayer plus its EnemyPlayer-derived subclasses, and neither build applies it in the plain NPC class.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyClone.as:434-441 (compare MCSPlayer.as:3701-3707; absent from NPC.as:429-460 and from web §1t68s0§.as:465-481)`
- **Build:** android v0.682
- **Lane impact:** L-combat-core / L-enemies-ai: fixes the scope of the triangle — it is a duellist/player-vs-player rule in BOTH builds, not something web widens to field mobs.

### `[[actionscript/web-weapon-parry-lives-in-the-npc-class]]` — UPHELD [A2] (1 critic)

The weapon-part parry (zero damage, hit not consumed) exists in web v0.717 but in the NPC class, not MCSPlayer. Neither build gives it to player-derived defenders, so it is an NPC-defender-only surface — worth stating explicitly because the mechanic is easy to over-generalise into a universal parry.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:458-461 (part index §1t12380s0§ = 3 = PART_weapon at §1t75s0§.as:19); absent from §1t99s0§.as:3736-3747 and from shs3_android MCSPlayer.as:3687-3697`
- **Build:** web v0.717
- **Lane impact:** L-combat-core: corrects the cite for the parry half of the behead/parry claim and bounds the mechanic to NPC defenders.

### `[[android-blobs-hunter/groundy-400-is-a-global-not-a-default]]` — UPHELD [A2] (1 critic)

groundY = 400 and flatGround = true are not per-background defaults that locations override - they are global constants for every location in the game. XMLBG's constructor overrides each field only when the matching tag is present (<groundy>, <flatground>), and across all 49 <bg> records in 123_Mobile_BGData neither tag occurs even once. The same is true of <gwrap> and <fgwrap>, so groundLayerWrap and foregroundLayerWrap are universally 1600.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLBG.as:10 (groundY=400), :12 (flatGround=true), :58-140 (override-if-present constructor) against the full tag histogram of reference/extracted/android/123_Mobile_BGData.bin (49 records, zero groundy / flatground / gwrap / fgwrap tags)`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim + L5 combat-core. A single authored ground line at y=400 for every scene in the game is a hard layout constant a recreation can bake in, and it is stronger than the banked reading of groundY as a mere default.

### `[[art-anim/engine-tick-is-24fps]]` — UPHELD [A2] (2 critics)

The original simulation ticks at 24 fps — skilldata cooldowns are stored in seconds and multiplied by 24 to become engine units, and maxreload is initialised as 5 * 24.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:300 and :308 (multiply), :116/:189/:205/:223 (divide for display); MCSPlayer.as:239`
- **Lane impact:** L5 combat-core and L6 art-anim — our Sim is fixed 60Hz, so every duration ported from skilldata or the AS3 in FRAMES must be rescaled x2.5, and 24fps-exact sub-frame timings will not land on 60Hz boundaries. This is distinct from the ledger's ':84 15fps pose latch', which is an animation-hold rate, not the sim rate.

### `[[bindata/per-stance-idle-poses]]` — UPHELD [A2] (2 critics)

The payload holds three distinct per-stance idle poses (19 nodes each) differing by up to 33px of head height and carrying the weapon at three different angles; src/config/poses.ts ships a single IDLE_POSE for all stances.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin:8002, 8025, 8048 vs src/config/poses.ts IDLE_POSE`
- **KILLS this line:** "MEASURED — semi-crouch combat idle (Session 8B, 2026-07-17; coil deepened Session 9) ... interior knee bend now ~155° vs the measured ~157°"
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: stance idle is PER-STANCE in the original and single in the build, so the video-derived IDLE_POSE cannot be right for all three. I deliberately do NOT convert these to interior joint angles — part art carries its own baked rest orientation and I have not established it, so any 'knee = N°' claim from this data would be unfounded. The x/y joint positions are the safe exact quantity; the ~155° figure stays a video measurement neither confirmed nor refuted here.

### `[[cite-lens-s26b/web-stance-gate-is-artifact-backed]]` — UPHELD [A2] (1 critic)

The web v0.717 half of the stance-gate claim was cited only as 'the documented Focus >= 48 gate' - a pointer to a document, not an artifact. It is in the payload: §1t99s0§.as:3058 opens the stance-rotation function (same four-way stance cycle as MCSPlayer.nextStance) and :3060 reads 'if(this.§1t4414s0§ < 48) { return; }'. The canChangeStance mirror is :3043-3045 (identical actionState disjunction to MCSPlayer.as:2966) with :3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;'. Against §1t99s0§.as:249 '= 8 * 24' (192) that is a quarter bar, versus MCSPlayer.as:2977 'this.maxreload / 6' over MCSPlayer.as:239 '5 * 24' (120) = a sixth.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249,3043-3050,3058-3060`
- **Build:** web v0.717
- **Lane impact:** L-combat-core / L-ui-hud - closes the un-cited half of itemdata-hunter/stance-gate-threshold-differs-by-build. The v0.717 stance gate is a hard 48 against a 192 max (one quarter), and it is now readable off a payload line rather than off a measurement doc.

### `[[combat-core/150pct-damage-is-a-buff]]` — UPHELD [A1] (8 critics)

The gold '150% DAMAGE' line under the HUD bars in the combat frames is a consumable BUFF readout, not a stance damage multiplier — reading it as 'heavy stance' would silently corrupt every TTK derived from those frames.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — bottom-left HUD, crop (0,910)-(620,1080) upscaled 2×; bound to OverworldHUD.as:1404, strings.json 4132, and MCSPlayer.as:209-211`
- **Lane impact:** L5 + L8 — the buff scales minDamage BEFORE the stance multiplier and only one buff can be live; heavy stance's own multiplier is also 1.5, which is exactly why the misread is available. The same frame independently corroborates the stance-switch meter gate: 'CANNOT CHANGE STANCE' is the label over the reload bar, matching nextStance()'s reload < maxreload/6 early return.

### `[[combat-core/android-stance-numbers-are-a-rebalance]]` — UPHELD [A2] (1 critic)

Every stance-related constant moved between android v0.682 and desktop v0.717, so the android bundle must never be used as a source for combat tuning - only for structure.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3081 and :3205-3222 vs reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 and :3255-3276`
- **KILLS this line:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** All lanes: S0-3's parity caveat is now quantified for combat. Structure (which stances exist, which fields feed which formula, the shape of every expression) is identical across builds and is safe to port from android where the desktop is obfuscated; every NUMBER inside those expressions moved. Contrast with the values that did NOT move - getBaseSlashLengthVal, the SP formula, the element counter wheel and the +10/+20 element grant are character-for-character identical in both bundles, which is exactly why those claims are safe.

### `[[combat-core/cannot-change-stance-not-in-android-strings]]` — UPHELD [A1] (1 critic)

'CANNOT CHANGE STANCE' — printed on the web build's reload bar — has no counterpart anywhere in the android build's 2,533-entry string table, a third hard android-v0.682 ≠ web-v0.717 divergence.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png crop (0,900)-(640,1080) NEAREST x3 and reference/frames/session11/damage-ttk/t1961.900.png crop (100,940)-(620,1080) LANCZOS x3; cross-checked against docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L8 + L5 — strengthens combat-core/build-version-parity from one divergence to three, and warns that porting android UI copy verbatim will produce strings the shipped game never showed. Label every ported string CONTRACT-SRC-v0.682.

### `[[combat-core/cannot-change-stance-string-is-driven-by-the-48-offset]]` — UPHELD [A2] (1 critic)

The 'you cannot switch while the visible bar reads empty' equivalence is not an inference — it is one line of web v0.717 code. The HUD bar writer computes its fill as (raw - 48) / (max - 48) and prints the CANNOT-CHANGE-STANCE string precisely when that ratio is 0, which is the same raw < 48 predicate the stance-switch guard uses. Source and frame therefore agree with no arbitration needed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-343; guard at reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3060; cost at :3162; corroborated in reference/frames/session11/crit-focus/t1003.000.png crop (0,910)-(620,1080) 2x`
- **Build:** web v0.717
- **Lane impact:** L5 + L8 — the third HUD bar's display transform is (raw-48)/(max-48), the empty-bar label is a code-driven state and not a separate UI mode, and the same :348-358 branch fires Snd_criticalDamage and swaps to the full-meter string at ratio >= 1. Anyone laying out the meter can take offset 48 and the two label states straight from this function.

### `[[combat-core/crit-is-full-reload-1p3]]` — UPHELD [A2] (1 critic)

The crit condition in the shipped v0.717 client is a full reload bar, and the multiplier is 1.3 with piercing damage added flat afterwards.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (android twin at MCSPlayer.as:3215ff)`
- **KILLS this line:** "③ §3 corrections (hold-run, crit 1.3, mastery-9, Chi-10)"
- **Lane impact:** L-combat-core / L-skills-meters: independently confirms the 1.3 crit from the shipped client rather than the forum, and pins the trigger - reload == maxreload, i.e. a fully recharged slash, not a random roll and not a Critical meter.

### `[[combat-core/crit-multiplier-1-3-is-in-the-web-damage-function]]` — UPHELD [A2] (1 critic)

Found while judging, unclaimed by anyone in this packet: the 1.3x crit multiplier is not wiki folklore, it is in the shipped web damage function. §1t99s0§.as:3272-3274 reads `if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }` — i.e. when the reload meter is at maximum, post-stance damage is multiplied by exactly 1.3 and a flat bonus is added. Same meter as the stance gate (>=48 at :3050) and the same meter the BattleUI crit label watches (§1t113s0§.as:348-358 fires Snd_criticalDamage at ratio>=1). This makes CRIT_MULT=1.3 CONTRACT from the payload, independent of the wiki.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274 + §1t99s0§.as:3048-3051 + reference/decompiled/shs3_payload/scripts/§1t113s0§.as:348-358`
- **Build:** web v0.717
- **KILLS this line:** "SHS:Duels' own wiki (2016 + 2025) states the formula "Critical = 1.3x Physical." Keep CRITMULT=1.3."
- **Lane impact:** L5 combat-core: CRIT_MULT=1.3 upgrades from wiki-sourced to payload CONTRACT, and the crit trigger is 'meter at max', not a random roll.

### `[[combat-core/desktop-stance-multipliers]]` — UPHELD [A2] (1 critic)

The v0.717 desktop stance slash-length multipliers ARE recoverable and differ from android: Light x1.4, Balanced x(1+0.02*mastery), Heavy x(0.5+0.04*mastery) with the same 100 px floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, 3105, 3116, 3131, 3142`
- **KILLS this line:** "n/a — this overturns the surveyor's claim rebirth/stance-slash-multipliers-parity, not a ledger sentence"
- **Lane impact:** combat-core: the reach model should take the DESKTOP values (Light x1.4, not x1.5), per the same 'desktop value wins' precedent claim 7 establishes. Method note for every lane: the desktop tree is obfuscated, so a literal grep for identifier-bearing expressions can NEVER establish absence — only numeric literals survive renaming. Locate the class positionally instead (§1t99s0§.as is MCSPlayer: it defines both §1t4443s0§ initPlayer and §1t4446s0§ initElementDefenseStats).

### `[[combat-core/duel-path-damage-terms-unsurveyed]]` — UPHELD [A2] (1 critic)

The lane surveyed the MOB damage path (NPC.gotHit) and missed the fighter-vs-fighter path that DuelScene actually models — which on v0.717 beheads at ×1.3 BEFORE defence subtraction and applies a stance triangle ×1.2 (losing) / ×0.9 (winning) that no claim in the lane mentions.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4904s0§.as:405-429 (v0.717); android counterpart reference/decompiled/shs3_android/scripts/MCSPlayer.as:3694-3717`
- **Lane impact:** L5 + L4 — three damage terms with no home in any lane claim or in src/config: the ×1.2/×0.9 stance-triangle multipliers (which are also the real source of the forum's '~20% counter bonus'), and a behead multiplier that is ×1.3-before-defence on the target build, not ×1.5-after-floor. Ordering matters: behead-before-subtraction and behead-after-floor give different numbers on the same hit.

### `[[combat-core/every-checked-combat-number-moved-between-builds]]` — UPHELD [A2] (1 critic)

The android v0.682 bundle and the desktop v0.717 bundle disagree on every combat-tuning number checked so far, so android-only combat values must be treated as INFERRED until the desktop line is located.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094/3105/3116/3131/3162/3262/3265/3270/3274 and §1t1523s0§.as:2644-2652 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3030/3041/3052/3067/3098-3104/3205/3208/3213/3215-3221 and StatsManager.as:2201-2207`
- **KILLS this line:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** All lanes sourcing android AS3. The Stage-0b caveat is stronger than 'one in six numbers moved' - six for six moved in the combat block. The desktop file to check first is reference/decompiled/shs3_payload/scripts/§1t99s0§.as (MCSPlayer) and §1t1523s0§.as (StatsManager); both are present and complete, so 'android-only' is almost never the true state of a combat number.

### `[[combat-core/focus-6s-is-the-source-not-a-parity-break]]` — UPHELD [A2] (1 critic)

There is no crit-meter parity break: v0.717's meter is 8×24 = 192 raw units rendered as (x−48)/144, so the visible fill is 144 frames = exactly 6.000 s at 24 fps — which is the frame-measured value, to 0.5%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (`= 8 * 24`) and :1203-1208 (`if(reload < maxreload) { ++reload; … updateReload(reload, maxreload) }`); measured counterpart COMBAT_MEASUREMENTS.md f-9 (6.00 s, 3× 60 fps regressions) and src/config/combat.ts:82-101`
- **Lane impact:** L5 — kills the survey's score-capping caveat (a) as stated and kills its 5.8 s recommendation. Build 6.00 s, which is already in config. The android's 5×24 with a 24-frame hidden offset is the v0.682 retune; quoting it as the prediction is what manufactured the 4.00 s 'discrepancy'.

### `[[combat-core/focus-fill-remeasured-on-frames]]` — UPHELD [A1] (1 critic)

Re-measuring the crit/Focus meter with the track calibrated on the full Chi bar gives 16.9 %/s ⇒ 5.92 s empty→full, which agrees with the repo's existing 5.97 s measurement and the v0.717 source's exact 6.000 s — there is no frame-vs-doc conflict to adjudicate.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png (track calibration: full Chi bar 31/31 spans x=245..513, rows y=1004-1016) and t1004.800/t1005.000/t1081.100/t1082.100/t1082.900.png (fill edge scanned at y=1036)`
- **Lane impact:** L5 — build FOCUS_MAX 192 with display span 144 at 24 units/s (6.000 s visible), exactly as src/config/combat.ts already does. Do not adopt the survey's 5.8 s; it is a 2 % track-width artifact, and the invariant 'when a measurement doc and a frame disagree the frame wins' does not apply here because they do not disagree.

### `[[combat-core/footage-runs-at-nominal-24fps]]` — UPHELD [A1] (1 critic)

The longplay footage carries a hard 15 Hz content cadence but the GAME inside it ticks at its nominal 24 fps, so wall-clock timings read off these frames are valid — and the crit-bar fill measures 140.6 ticks against the web source's 144, i.e. frame and source AGREE.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 @1084.3333-1085.9333 s and @1089.2667-1090.0667 s, 60 fps burst; crit-bar row y=1034, track x in [246,513]; subpixel white-fill edge`
- **Lane impact:** L5 + every lane that measures timing off these videos — the 15 Hz cadence is a CAPTURE floor, not a slow game, so tick counts can be recovered from wall-clock at 24 fps; but no event shorter than 66.7 ms can be resolved.

### `[[combat-core/gesture-classifier]]` — UPHELD [A2] (8 critics)

The gesture→attack map's discriminator is exact: a stroke is a SLASH iff it sampled >4 points AND its start→end straight-line distance exceeds 20 world units; otherwise it is a tap that moves the fighter, with a 25-unit dead-zone.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:268 with constants at :53 and :55; tap path MCSPlayer.as:2298-2308; peaceful-mode demotion MCSPlayer.as:2260-2273`
- **Lane impact:** L5 — the Ready bullet 'gesture→attack map' carried no thresholds; these are the numbers. Also uncovers input buffering the ledger has nowhere: a line drawn while a slash is committed is stored as slashArrayBuffer and fired next (MCSPlayer.as:2275-2285).

### `[[combat-core/heavy-def-0.8]]` — UPHELD [A2] (8 critics)

The Heavy-stance defence penalty ×0.8 is the one Ready sub-claim that survives intact, confirmed twice — in code and in the game's own skill copy.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3226-3234; corroborating string 6005 in docs/gauntlet/L0/index/strings.json (skill 1002 desc, reference/extracted/skilldata.xml)`
- **Lane impact:** L5 — the penalty exists ONLY on the defence side, which validates the repo's Stage-2 landmine warning; src/config/stances.ts heavy.damageTakenMult 1.25 is the same number inverted (1/0.8) and must stay data-only.

### `[[combat-core/heavy-launch-unlock-is-3-on-target-build]]` — UPHELD [A2] (1 critic)

The mastery ladder is identical in v0.717, so src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy = 5 is wrong on the target build, not just on the android one — this is the survey's single clean, shippable config fix.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3221-3244 (and :3245-3252 for Reversed/Dual); vs src/config/stances.ts LAUNCH_UNLOCK_LEVEL`
- **Lane impact:** L5 + L2 — ship `heavy: 3`. Same-slot permutation across both builds means this one is safe to land without a further v0.717 re-read. Reversed and Dual granting all five abilities unconditionally still has no slot in the three-stance model.

### `[[combat-core/hud-track-is-269px]]` — UPHELD [A1] (1 critic)

The HUD bar track is 269 px at 1080p (x = 245…513), not the 263 px the survey calibrated against — measurable directly off the FULL Chi bar in the survey's own frame.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — blue-channel scan of rows 1008 and 1010 (Chi reads 31/31, i.e. a full bar), plus HP cross-check on row 980`
- **Lane impact:** L8 + L5 — any future percentage read off this bar must use 269, not 263. The 6 px error is 2.3 % and is most of the gap between the survey's 5.8 s and the banked 6.00 s.

### `[[combat-core/inputmanager-200-is-not-a-gameplay-base]]` — UPHELD [A2] (1 critic)

InputManager.maxDistance = 200 is a compile-time initialiser, not a gameplay base. setStance calls InputManager.setMaxDistance(slashLength) on every battle init for the local player (web §1t99s0§.as:3156-3158, android MCSPlayer.as:3092-3094), so the 200 is overwritten before the player ever draws a stroke. Any derivation of the wiki's 300/200/100 that treats 200 as 'the shipped default slash budget' rests on a value the player never plays at. The real base is 120 + floor((90 + 5*DAN) * SPD / (20 + SPD)) — 124 at SPD 1 / dan 0, asymptotically 210 at dan 0.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:51,106-108 + §1t99s0§.as:3156-3158 + §1t1523s0§.as:2346-2347`
- **Build:** both
- **Lane impact:** L-combat-core: weakens (without killing) the 300/200/100-as-base arithmetic, and tells the port to derive reach from the SPD/DAN formula rather than from the 200 constant.

### `[[combat-core/launch-unlock-levels]]` — UPHELD [A2] (8 critics)

src/config/stances.ts's LAUNCH_UNLOCK_LEVEL is wrong for heavy: the source ladder is 3 = the stance's signature move (light launch / balanced flip-up / heavy launch), 4 = deflect in every stance, 5 = the stance's advanced move — so heavy launch unlocks at mastery 3, not 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3164-3194`
- **Lane impact:** L5 + L2 — light 3 ✓, balanced 5 ✓, heavy 3 ✗ (config says 5). Reversed and Dual stances get all five abilities unconditionally (MCSPlayer.as:3188-3194), which the ledger's three-stance model has no slot for.

### `[[combat-core/mastery-domain-is-1-to-10-resolved]]` — UPHELD [A2] (1 critic)

The stance-mastery domain is RESOLVED as the skilldata 1-10 <value>, and the WEB coefficients are built for it. Player masteries are getStat(1000)/getStat(1001)/getStat(1002) passed straight into initPlayer; NPC masteries are the npcdata <lvl> returned verbatim by XMLNpc.getMastery. On the web coefficients (0.2*m*0.1 = 0.02 per level, 0.4*m*0.1 = 0.04 per level) that domain gives a real spread — Balanced 1.02→1.20, Heavy 0.54→0.90 — so no 0-100 conversion exists or is needed. The android build's 0.5*m*0.01 form is the anomaly that made the domain look broken.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1834; reference/decompiled/shs3_android/scripts/XMLNpc.as:671-686; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3105 and :3116; reference/extracted/skilldata.xml:73-79`
- **Build:** web v0.717
- **Lane impact:** L5 combat-core — closes the open question the packet honestly left STILL_UNHELD (combat-core/mastery-domain). Mastery is the raw 1-10 skill level; no rescale, no INFERRED flag needed, as long as the coefficients are taken from the web build.

### `[[combat-core/max-focus-differs-192-web-vs-120-android]]` — UPHELD [A2] (1 critic)

The Focus meter's maximum is not the same in the two builds: 192 in web v0.717, 120 in android v0.682, and each build assigns it exactly once. That reframes the stance-switch numbers - the flat 48 the web build charges is maxreload/4, while android's graded cost is maxreload/6 (=20) with a maxreload/3 reset. So the two builds do not even share the same FRACTION of the bar, and any Focus config for v0.717 must use 192, not 120, and not a fraction ported from android.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:239`
- **Build:** both - web v0.717 vs android v0.682
- **Lane impact:** L-combat-core + L-skills-meters: skills-meters blocker (3) 'Focus numerics (max/fill/switch-cost)' closes on TWO of its three axes for v0.717 - max = 192 and switch-cost = 48 - leaving only the fill rate open. Nobody in this packet claimed the max.

### `[[combat-core/parity-confirmed-set]]` — UPHELD [A2] (1 critic)

Ten combat facts are byte-identical between android v0.682 and web v0.717 and can be promoted straight to plain CONTRACT with no parity caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347 · §1t99s0§.as:9,:11,:15-19,:2377,:2548,:3223-3241,:3286-3288 · §1t1541s0§.as:51 · §1t1543s0§.as:1486 · §1t67s0§.as:197-209`
- **Lane impact:** L5 — promote to CONTRACT: reach base formula 120+floor((90+5*dan)*SPD/(20+SPD)); arc-length budget with maxDistance 200; multi-target |dx|<200 pre-filter; tap dead-zone 25 units; standingRange 50; slashSpeed 50/40/30; jumpThreshhold 100; mastery unlock ladder 3/4/5 (heavy launch = 3); four-band damage floor; heavy defence x0.8. The lane's real, safe yield.

### `[[combat-core/parity-established-for-ten-quantities]]` — UPHELD [A2] (1 critic)

Ten combat quantities the survey flagged as android-only are byte-identical in the shipped web build, so they can be labelled CONTRACT rather than CONTRACT-SRC-v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19, :3221-3251, :3283-3289; §1t1541s0§.as:52-60; §1t67s0§.as:199-209; §1t68s0§.as:465-483; §1t122s0§.as:771-774`
- **Lane impact:** L5 — promotes to CONTRACT: the reach base formula, reload refill 48+SPD·6, standingRange 50, slashSpeed 50/40/30, jumpThreshhold 100, the whole InputManager gesture/arc-length constant set, the 12-frame i-frame window, the four-band defence floor table, heavy defence ×0.8, and the 3/4/5 mastery ability ladder (heavy launch at 3). src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy 5 -> 3 is the one config edit from this unit that is safe to make.

### `[[combat-core/payload-swf-framerate-24]]` — UPHELD [A2] (1 critic)

The web payload SWF's own header declares 24.0 fps, so the tick→second conversion for every v0.717 frame-counted constant is first-party and no longer borrowed from the android Mobile.as.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — SWF header (signature CWS, version 17, RECT, then the 8.8-fixed FrameRate field)`
- **Lane impact:** L5 + L6 — every ticks-based constant (i-frames gotHitCounter=12 → 0.5 s, reload 192 → 8.0 s raw / 6.0 s displayed, doReload jitter) now converts to seconds from a web-build artifact.

### `[[combat-core/player-unlocks-are-skills-not-mastery]]` — UPHELD [A2] (1 critic)

For the PLAYER (controlledBy 0 or 2) launch/deflect/stab/flip-up/air-combo are gated on owning specific skills (1014/1015/1036 light, 1016/1017/1037 balanced, 1018/1019/1038 heavy), never on mastery level; the >=3/>=4/>=5 mastery ladder is the enemy branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3126-3161 (and identically reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3186-3212)`
- **Lane impact:** L5 + L2 + L3 — src/config/stances.ts LAUNCH_UNLOCK_LEVEL is the wrong SHAPE, not merely wrong for heavy. Replace it with a skill-ownership predicate over skilldata ids 1014-1019 and 1036-1038 (names/descs already resolvable via docs/gauntlet/L0/index/strings.json), and keep the mastery ladder only for the enemy-AI side in L4.

### `[[combat-core/reach-is-arclength]]` — UPHELD [A2] (8 critics)

Reach is an arc-length budget spent along the drawn stroke (a curvy slash covers less ground than a straight one), with the stroke visibly tapering to zero thickness as the budget drains — confirming a model the repo asserted without a source.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:198, :352-366 (defaults at :51-59; per-stance value set by MCSPlayer.as:3094)`
- **Lane impact:** L5 — the reach gate must decrement per polyline segment, not test a radius. Also fixes the stroke render: thickness = 8 tapering by (maxDistance-distanceLeft)/maxDistance, battle colour 0x990000, points resampled to ≤20 units.

### `[[combat-core/sim-dash-hz-unit-bug]]` — UPHELD [A2] (1 critic)

src/core/Sim.ts converts the source's per-frame dash speed with FIXED_HZ = 60 although the original runs at 24 fps, so the sim dashes at 3000/2400/1800 px/s instead of 1200/960/720 — 2.5× too fast.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile.as:117 (frame rate) + MCSPlayer.as:15-19 (50/40/30) → applied at src/core/Sim.ts:670 with FIXED_HZ=60 from src/config/timing.ts:8`
- **Lane impact:** L5 — a live, shipped 2.5× error in dash travel speed, sitting inside the exact constants combat-core/pass-through-dash quoted without checking the unit. The rest of the config already bridges 24→60 correctly (combat.ts:83-91 names FOCUS_FILL_PER_S = 24 and FOCUS_ACC 2/5 = 24/60); the dash is the one constant that skipped the conversion. Fix: DASH_SPEED_PX_PER_FRAME × 24, or relabel as px/s = {1200,960,720}.

### `[[combat-core/slash-type-map]]` — UPHELD [A2] (8 critics)

The 'gesture→attack map' is really a nine-way slash-type classifier with exact geometric gates (jumpThreshhold 100, ±25 tilt band, downstab |Δx|<50, drop >100), not a single mapping.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2403-2456; type constants at :37-53; jumpThreshhold at :11`
- **Lane impact:** L5 + L6 — nine slash types (HOR / JUMP / DROP / UP / AIR / LAUNCH / DOWNSTAB / HOR_UP / HOR_DOWN) each drive their own animation, and UP_SLASH is the launcher (endSlash sets Damage.LAUNCH_AIR when canLaunch).

### `[[combat-core/slash-units-are-800x480-stage]]` — UPHELD [A2] (1 critic)

Slash length is denominated in the 800x480 logical stage, not screen or video-frame pixels: the slash budget is consumed in unscaled stage coordinates and stageScale is re-applied only when drawing.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:80,82,86 + InputManager.as:342-343, 472-478; desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104,106`
- **KILLS this line:** "① reach cap in stage px per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** combat-core blocker ①: the recovered 120..255 base slash values are 800x480 stage units. Anyone measuring blade span in a 1080p frame must divide by the frame-to-stage factor (~2.25-2.4) first, or the number comes out ~2.3x too large.

### `[[combat-core/stance-change-costs-48-meter]]` — UPHELD [A2] (1 critic)

Changing stance costs a flat 48 off the slash meter in v0.717, and only in battle - a cost that appears in no ledger system.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3160-3171`
- **KILLS this line:** "⑤ Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** combat-core: stance switching is not free. Combined with the crit rule above, switching stance while at full meter throws away the crit - a real tactical constraint the current model has no representation for.

### `[[combat-core/stance-constant-identity-is-pinned-by-hud-colour]]` — UPHELD [A2] (1 critic)

The web build's five obfuscated stance constants can be identified without guessing, by matching each case's HUD stance-colour argument against the android build's named cases. §1t12220s0§=LIGHT (colour 1), §1t12221s0§=BALANCED (colour 2), §1t12222s0§=HEAVY (colour 3), §1t12223s0§=DUAL (base ×1, floor 100, colour 3), §1t12224s0§=REVERSED (base ×1.4, colour 2).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3093-3155 (each case's §1t113s0§.instance.§1t5208s0§(n) argument) against reference/decompiled/shs3_android/scripts/MCSPlayer.as:3027-3091 (each named case's BattleUI.instance.setStanceColor(n))`
- **Build:** both
- **Lane impact:** L5 combat-core: this is the method that makes any web-bundle stance claim checkable rather than asserted, and it is what let me confirm the packet's Dual/Reversed assignment independently. Generalisable — the HUD-argument fingerprint pins obfuscated enum constants wherever a named android twin exists.

### `[[combat-core/stance-gate-is-a-flat-48-tick-toll]]` — UPHELD [A2] (1 critic)

Changing stance is gated and paid in the SAME meter as the crit: it requires reload >= 48 and deducts a flat 48 ticks — and 48 is exactly the number the HUD bar hides, so 'bar reads zero' and 'cannot change stance' are the same condition by construction.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :3050, :3060, :3162 + §1t113s0§.as:328 and :336-342`
- **Build:** web v0.717
- **Lane impact:** L5 + L8 — explains COMBAT_MEASUREMENTS f-7's 'the message replaces the bar in the same slot' from the source side, and gives the exact Focus economy: 192-tick meter, 144 shown, 48-tick stance toll.

### `[[combat-core/stance-label-is-a-frame-clock]]` — UPHELD [A1] (1 critic)

The 'CANNOT CHANGE STANCE' overlay is an on-frame readout of the reload gate: absent at 4.2%, 12.5%, 21.3%, 35.0% and 46.4% fill, and back the instant a slash lands — t1082.900 shows 35% with no label, t1083.100 (0.200 s later) shows an empty bar with the label on.

- **Cite:** `reference/frames/session11/crit-focus/{t1081.100,t1004.800,t1082.100,t1082.900,t1083.100,t3779.000}.png — crop (230,1015)-(530,1050) upscaled 4x NEAREST, six-tile contact sheet`
- **Lane impact:** L5 + L8 — a free, reusable frame-side probe of the reload meter: the label boundary pins the gate to the SAME constant as the display offset (48), which is the web rule, not android's maxreload/6 = 20. Future build-parity questions about the meter can be settled from this overlay alone.

### `[[combat-core/stance-triangle]]` — UPHELD [A2] (8 critics)

The stance counter-triangle CONTRACT (light>heavy, heavy>balanced, balanced>light) is confirmed a third time, now from the payload's own string table rather than a transcribed tutorial line.

- **Cite:** `docs/gauntlet/L0/index/strings.json entries 6001 / 6003 / 6005, attached to skilldata.xml skills 1000 / 1001 / 1002`
- **Lane impact:** L5 — src/config/stances.ts STANCE_BEATS matches exactly; never relitigate. 6001 also states the light trade in the developer's words (longer range, lower damage), which is the reach/damage permutation in prose.

### `[[combat-core/stance-triangle-damage-magnitudes]]` — UPHELD [A2] (1 critic)

The stance counter-triangle is a damage multiplier in code, not just tutorial copy: the victim takes x1.2 when the attacker's stance beats theirs, and the web build additionally applies x0.9 when the attacker's stance loses.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3799 (web); reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3704 (android, x1.2 only)`
- **Lane impact:** L5 + L4 — STANCE_BEATS gets its magnitudes (+20% favourable, -10% unfavourable, applied BEFORE defence subtraction and before the behead x1.5); the x0.9 branch is web-only and must not be dropped when porting from the android read.

### `[[combat-core/stance-triangle-is-1p2]]` — UPHELD [A2] (1 critic)

The stance rock-paper-scissors multiplier is x1.2, not x1.5, and a stance-advantage hit also recolours the damage popup to white.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3699-3706`
- **Lane impact:** combat-core: the damage pipeline in one order — stance triangle x1.2, then subtract defense, then clamp to damageObj.getMinDamage(), then behead x1.5, then add the four elemental damages. Three distinct multipliers exist (stance 1.2, behead 1.5, BUFF_ATTACK 150%) and the ledger conflates none of them because it holds none of them.

### `[[combat-core/stroke-render-frame-confirmed]]` — UPHELD [A1] (1 critic)

The drawn-stroke render is settled on frames, not just in code: thickness 8 world units (measured 18 screen px), colour 0x990000 (measured modal (150,0,0)), tapering from the START of the stroke to a point at the end — which also pins the world→screen scale at 2.25 px/unit and so confirms the 800×480 world.

- **Cite:** `reference/frames/session11/stance-reach/B_t862.600_HEAVY_bold-bright-red-head-only.png and B_t862.667_HEAVY_thin-dark-tail-plus-bold-head.png, both crop (400,690)-(1020,820) LANCZOS x3`
- **Lane impact:** L5 + L8 — the stroke renderer can be built and gated today with no remaining unknowns, and any reach number expressed in screen px converts at exactly 2.25. Also re-classes combat-core/reach-is-arclength from A2 to A2+A1.

### `[[combat-core/two-builds-differ-in-stage-height]]` — UPHELD [A2] (1 critic)

Both SWF headers run at 24.000 fps, but the web payload declares an 800x690 stage against the android build's 800x480 — the 800x480 world space the reach unit lives in is established by StatsManager (stageWidth 800 / stageHeight 480) and confirmed on-frame by the 5:3 game viewport, not by the SWF header.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf (CWS v17, framerate 24.0, stage 800.0x690.0) and reference/decrypted/shs3_android_payload_decoded.swf (CWS v26, framerate 24.0, stage 800.0x480.0); world space at reference/decompiled/shs3_android/scripts/StatsManager.as:80-82`
- **Lane impact:** L5 + L8 + L6 — gives the px<->world-unit scale (2.26-2.27) needed to grade ANY reach/stroke/hitbox measurement off the 1080p longplays, and warns that the 690 in the web SWF header is chrome, not playfield. My own stroke measurement on that frame (416->971 = 555 px = 245 world units) is the first reach figure in the lane with a stated scale.

### `[[combat-core/web-android-combat-tuning-diverges-on-four-constants]]` — UPHELD [A2] (1 critic)

Web v0.717 and android v0.682 differ on FOUR independently-read combat constants, not one: crit meter length (192 vs 120), crit multiplier (flat 1.3 vs split 1.2/1.5), heavy damage (1.4 vs 1.5) and light reach (1.4 vs 1.5). Plus a fifth outside combat: the duel-token cap constant (40 vs 30).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :3274, :3270, :3094 and §1t1523s0§.as:200 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:239, :3215-3221, :3213, :3030 and StatsManager.as:166`
- **Build:** both
- **Lane impact:** L5 + every lane citing android source — the S0 caveat's 'combat tuning parity is NOT established' is now positively DISPROVEN, with five counted counterexamples. Any android combat constant must be re-read in shs3_payload before it ships.

### `[[combat-core/web-calcxp-is-verbatim-in-v0717]]` — UPHELD [A2] (1 critic)

The XP model is NOT android-only: the web v0.717 build carries calcXP, getGreyLevel and getZeroDifference verbatim, so the two zero cut-offs, the +5%-per-level-under bonus, the zero-difference decay and the elite x2 doubler are all CONTRACT at the target build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (greyLevel), :131-183 (zeroDifference), :185-209 (calcXP) vs reference/decompiled/shs3_android/scripts/NPC.as:94-110, :112-164, :166-190`
- **Build:** both
- **Lane impact:** L4/L10 — closes the build-parity hole on economy/calcxp-hard-cutoffs. The XP law can be labelled CONTRACT (0.717), not CONTRACT-SRC (0.682).

### `[[combat-core/web-crit-is-flat-1.3]]` — UPHELD [A2] (1 critic)

Ledger blocker (2) resolves to 1.3: in v0.717 a full-meter slash multiplies damage by a flat 1.3 in EVERY stance and adds the STAT_CRITICALDMG gear term — there is no light/non-light split.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274`
- **KILLS this line:** "(2) crit 1.3 vs 3 final — read one crit popup."
- **Lane impact:** L5 — crit = 1.3x + flat gear term, applied after the stance damage curve, gated on a full meter. The x3 candidate is dead. src/config/combat.ts's 1.3 coefficient was right; only its application to the legacy 1.17/1.56/1.82 dmgMults needs replacing with the mastery curves.

### `[[combat-core/web-focus-economy]]` — UPHELD [A2] (1 critic)

The v0.717 Focus/crit meter is 192 points (8x24) filling +1/frame, displayed as (reload-48)/(maxreload-48) so the first 48 points are invisible — giving exactly 144 visible frames = 6.000 s, which matches the frame measurement of ~5.8-5.97 s and leaves no doc-vs-frame conflict.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :1205; display mapping reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328`
- **KILLS this line:** "(5) Focus/crit gating rule — watch the Focus bar fill/consume."
- **Lane impact:** L5 + L8 — build focusMax 192, hidden offset 48, visible span 144 frames = 6.000 s at 24fps. Use 6.000 s CONTRACT-SRC, not the 5.8 s frame estimate. This also independently reconfirms docs/research/fidelity/SOURCE_CONSTANTS.md §3.2, which the survey overwrote with android numbers.

### `[[combat-core/web-payload-as3-is-readable]]` — UPHELD [A2] (1 critic)

The web v0.717 payload is fully decompiled and readable in this repo — 1,079 .as files with renamed identifiers but every numeric literal and control-flow structure intact — so the whole lane can and must be re-read against the build actually being recreated.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ — 1,079 .as files; worked example §1t1523s0§.as:2346-2347`
- **Lane impact:** L5 + every lane that deferred to 'the web AS3 is obfuscated' — the android-vs-web caveat stops being a blanket blocker and becomes a per-constant diff that can be run today.

### `[[combat-core/web-payload-is-cross-readable]]` — UPHELD [A2] (1 critic)

The web v0.717 AS3 is fully cross-readable — 1,079 decompiled .as files with obfuscated names but plain bodies — so the build-parity question the survey filed as STILL_UNHELD is answerable in minutes by numeric-literal grep, and was already answered in-repo three weeks ago.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (1,079 .as files); §1t1523s0§.as:36 = 0.717; reference/decompiled/shs3_android/scripts/StatsManager.as:30 = 0.682; docs/research/fidelity/SOURCE_CONSTANTS.md (515 lines, 2026-07-25)`
- **Lane impact:** L5 + every other lane citing shs3_android — the correct protocol is: read v0.682 for structure, then confirm each constant in shs3_payload by literal shape before it becomes CONTRACT. Nine of this unit's twenty claims cite v0.682 numbers that were never checked against the target build.

### `[[combat-core/web-payload-is-readable]]` — UPHELD [A2] (1 critic)

The web v0.717 payload is fully decompiled and cross-readable on disk — 1,079 .as files with mangled identifiers but plain AS3 bodies — so every combat constant in this lane can and must be verified against it rather than against the android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:6 (1,079 .as files under that directory; docs/research/fidelity/SOURCE_CONSTANTS.md:1-6)`
- **Lane impact:** L5 — kills the lane's blanket CONTRACT-SRC-v0.682 labelling requirement. Every constant below can be graded against the shipped build today; nothing in combat-core needs to wait on a parity study.

### `[[combat-core/web-reach-stance-mults]]` — UPHELD [A2] (1 critic)

In the shipped v0.717 build the per-stance reach multipliers are light x1.4 flat, balanced x(1 + 0.02*mastery) and heavy x(0.5 + 0.04*mastery) floored at 100 — which is exactly what src/config/reach.ts already holds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120`
- **Lane impact:** L5 — DO NOT change src/config/reach.ts. lightMult 1.4, balancedPerMastery 0.02, heavyPerMastery 0.04, heavyFloor 100 are all correct and can be promoted from CONTRACT-SRC to plain CONTRACT. At the stated L1 character (SPD 1, dan 0, mastery 0): base 124, light 173.6, balanced 124, heavy 100 (floored) — the config comment is right.

### `[[combat-core/web-stance-switch-rule]]` — UPHELD [A2] (1 critic)

The v0.717 stance-switch rule is an absolute threshold, not a fraction: switching is blocked while reload < 48 and costs a flat 48 — and 48 is precisely the meter's hidden display offset, so the rule is literally 'you cannot switch while the visible bar reads empty', which is exactly what the CANNOT CHANGE STANCE frame shows.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3058-3060 and :3161-3166 (corroborated by reference/frames/session11/crit-focus/t1003.000.png, crop (0,910)-(620,1080) at 2x)`
- **Lane impact:** L5 + L8 — replace the android maxreload/6 gate and the >max/2 -> max/3 tax with: gate reload >= 48, cost flat -48. This is the correct grounding for the CANNOT CHANGE STANCE HUD state, which the survey attached to the wrong rule.

### `[[combat/projectile-gravity-has-web-parity]]` — UPHELD [A2] (1 critic)

The projectile gravity constant and the archer/thrower ballistic solve are NOT android-only: the WEB v0.717 build carries GRAVITY = 3 and the identical solve, including the same fire height (y-60), the same 0.866 factor and the same uniform +-4 aim jitter. The android-only build caveat on the archer-physics claim can be retired for the gravity constant and the trajectory maths.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t128s0§.as:8; reference/decompiled/shs3_payload/scripts/§1t4539s0§.as:551-565 (and the twin at §1t4545s0§.as:470)`
- **Build:** web v0.717 (parity with android v0.682)
- **Lane impact:** L7 enemies-ai / L1 combat-core: the gravity constant 3 px/frame^2 and the ballistic solve can be promoted to CONTRACT from the filmed build rather than carried as an android-only inference. One thing NOT established: the web call at :565 passes five args plus this, with no doLaunch flag, so the level>50 knockdown coin flip has not been shown to have web parity.

### `[[combat/slashlength-is-arc-length-not-radius]]` — UPHELD [A2] (1 critic)

slashLength / InputManager.maxDistance is an ARC-LENGTH budget for the drawn line, not a radial reach. InputManager.as:198 seeds distanceLeft = maxDistance on mouse-down; :353-367 subtracts Math.sqrt of each mouse-move segment's squared displacement along the drawn polyline, and the trail's line thickness tapers as ((maxDistance - distanceLeft) / maxDistance). Coordinates are game-stage space: (args.stageX - StatsManager.stageOffsetX) / StatsManager.stageScale. So the stance 'reach cap' caps HOW LONG A LINE YOU MAY DRAW in stage px, not how far the blade extends from the body. Any recreation that models it as a radius will feel wrong on curved and zig-zag slashes, and the ledger's close-path ('measure blade-FX tip-to-body span from footage') was asking for a different quantity from the one the code caps.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:106-108, :198, :353-367`
- **Build:** android v0.682 (structure identical in web v0.717 — §1t99s0§.as:3157 feeds the same value to the web InputManager twin)
- **Lane impact:** L1 combat-core: the reach model is a path-length budget consumed along the gesture, plus a per-stance cap. This changes what 'reach' means in resolveSlash.

### `[[frames/39-tip-ladder-is-android-only]]` — UPHELD [A2] (1 critic)

The 39-tip GameEngine ladder exists only in the android v0.682 build. Not one of its 39 strings appears anywhere in the web v0.717 payload, its 27 bindata blobs, or the 329 MB payload.xml — so every mechanic sourced to a tip (rarity colour enum, SPD→cooldown+reach, hold-run, the keyboard/gesture map, undead heads, the settlement ladder) is v0.682-attested only.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:530-697 vs reference/decompiled/shs3_payload/scripts/ + reference/extracted/bindata/ + reference/extracted/payload.xml`
- **Build:** android v0.682
- **Lane impact:** items-equipment / combat-core / ui-hud / world-exploration: keep the tips, but stamp them v0.682. The hold-run rule at GameEngine.as:640 does restore REBUILD_READINESS.md:146 — for the android build. A web cite is still owed.

### `[[frames/HUNT-duel-combat-hud-widgets]]` — UPHELD [A1] (1 critic)

The duel combat HUD carries three widgets no claim mentions: an AUTO SLASH toggle, an enemy nameplate that prints the opponent's level in parentheses over an HP bar, and a CANNOT CHANGE STANCE lock state during duels.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0019.jpg (read whole @1.9x); labels at strings.json["619"], ["620"], ["125"], ["208"]`
- **Build:** web v0.717
- **Lane impact:** combat-core, ui-hud

### `[[frames/damage-ttk-crit-window-is-not-empty-on-two-frames]]` — UPHELD [A1] (1 critic)

Two frames in the damage-ttk 1940-1979 window show a partially filled focus bar, contradicting any 'the bar was zero on every frame' statement about that window. I scanned the focus row of all 18 frames: t1958.967.png has a contiguous white run x251-333 (about 83 px of a 268 px track, ~31%) and t1970.333.png has x251-318 (~68 px, ~25%); the other 16 are empty. I confirmed t1958.967 visually — a clean partial white fill with no caption, HP 16/20, Chi 20/20. The defensible statement is 'never FULL in this window, so no popup in it can have been a crit' (crit requires reload == maxreload, §1t99s0§.as:3272), not 'zero on all 18 frames'.

- **Cite:** `reference/frames/session11/damage-ttk/t1958.967.png crop (100,940)-(620,1080) LANCZOS x3 (focus bar ~31% white, x251-333) and t1970.333.png (x251-318)`
- **Build:** web v0.717
- **Lane impact:** L5 measurement hygiene: corrects the evidence line under combat-core/36-was-not-a-crit without disturbing its conclusion, and shows the focus bar does charge inside that fight.

### `[[gauntlet-s26b/behead-multiplier-diverges-1p5-to-1p3]]` — UPHELD [A2] (1 critic)

The behead damage multiplier is a v0.682->v0.717 TUNING DIVERGENCE: android NPC.as multiplies a behead hit by 1.5, the web NPC class multiplies it by 1.3. Both sit in the same method of the same class, after the same defense subtraction and the same getMinDamage floor, so this is a straight retune and not a structural difference. A v0.717-targeted recreation must port 1.3.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:451-453 vs reference/decompiled/shs3_payload/scripts/§1t68s0§.as:472-474`
- **Build:** both
- **Lane impact:** L-enemies-ai + L-combat-core: a fourth proven build divergence, and the one that sinks the packet's 'build parity is ESTABLISHED' reading (claim 10) using claim 10's own cited file. The S0-3 parity caveat stays undischarged: the two bundles diverge on combat tuning even inside classes whose structure matches line for line.

### `[[gauntlet-s26b/weapon-part-parry-is-universal-not-undead]]` — UPHELD [A2] (1 critic)

The free weapon-part parry is a BASE-CLASS rule, not an EnemyZombie quirk: NPC.as carries the identical `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;` in its own hit switch, and the web NPC class confirms it in v0.717. Every NPC in the game nullifies a blade-path hit that intersects its rendered weapon, and the hit is aborted before the HP path rather than merely reduced.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:437-440 + reference/decompiled/shs3_payload/scripts/§1t68s0§.as:458-461 (contrast the EnemyZombie override at reference/decompiled/shs3_android/scripts/EnemyZombie.as:502-505)`
- **Build:** both
- **Lane impact:** L-combat-core: packet claims 12 and 13 both read the EnemyZombie override correctly but scope the mechanic to the undead. It is universal and build-stable, which promotes it from an undead flavour note to a first-order blade-path rule: the per-part damage verdict needs a NULLIFY outcome for every enemy, and the rendered sword is a parry surface on the whole roster.

### `[[hunter/web-stance-refusal-is-flat-48]]` — UPHELD [A2] (1 critic)

CORRECTION to the packet's Focus-meter finding: in the WEB v0.717 build the 'CANNOT CHANGE STANCE' refusal fires below a FLAT 48 frames of reload — a quarter of the 192-frame bar — not below maxreload/6. The maxreload/6 rule is android-only, where the bar is 120 frames so the threshold is 20. Both the gate predicate and the stance-cycler use the same literal 48, and the setter charges the same flat 48.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :3050, :3060 and :3162; contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:239 and :2977`
- **Build:** web v0.717
- **Lane impact:** L5 combat-core: the filmed build refuses a stance switch below 48/192 = 25% of the bar. Porting the android fraction would let the player switch at 16.7%, which is a visibly different feel and would not reproduce the 'CANNOT CHANGE STANCE' caption timing in the longplay.

### `[[hunter/web-weapon-parry-and-part-index-parity]]` — UPHELD [A2] (1 critic)

The free weapon-parry surface and the behead multiplier are both present in the WEB v0.717 NPC class, which the packet cited only from Android — and the obfuscated part constants decode to exactly the Android z-order indices, independently reproducing the paperdoll table in the web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:450-478 · reference/decompiled/shs3_payload/scripts/§1t75s0§.as:19, :37, :45, :47`
- **Build:** web v0.717
- **Lane impact:** L-combat-core and L-items-equipment: the 'rendered sword is a parry surface' rule is v0.717 behaviour, not an Android-only quirk, and the part-index table is now cited in the build the project targets.

### `[[hunter04/blade-stroke-tapers-8px-to-zero-across-the-reach-cap]]` — UPHELD [A2] (1 critic)

The live blade stroke's render contract is a TAPER, and it is a free on-screen readout of the reach cap. reference/decompiled/shs3_android/scripts/InputManager.as:360 and reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:360 are byte-identical: 'canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance), 10027008, 1, false, LineScaleMode.NONE, CapsStyle.ROUND, JointStyle.ROUND, 3);' with 'internal static var thickness:int = 8;' at :57 in both files. distanceLeft starts at maxDistance and counts down, so the stroke is drawn at 8 px where the player starts the line and thins linearly to 0 px exactly at the reach cap. The two NAMED styles greenLine() (0x009900) and redLine() (0x990000) are NOT the blade - my grep shows their only callers anywhere are SkillUI.as:75 and SkillUI.as:136, i.e. the vestigial gesture pad.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:57, :360 · reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:57, :360 · grep -rn "redLine()|greenLine()" reference/decompiled/shs3_android/scripts/`
- **Build:** both
- **Lane impact:** L-art-anim-audio-feel and L-combat-core: the blade stroke is 8 px at the origin tapering to 0 px at the reach cap, colour 0x990000, ROUND caps and joins, miter 3 - a full render contract in one line, and a visual way to measure the reach cap off any longplay frame that shows a full-length stroke.

### `[[itemdata-hunter/stance-gate-threshold-differs-by-build]]` — UPHELD [A2] (1 critic)

The in-combat stance-change gate uses a different threshold in each build. Android v0.682 gates nextStance() on reload >= maxreload/6, which with the flat maxreload of 120 is 20 units = one sixth of the bar. The web v0.717 build gates the same action on Focus >= 48 against a max of 192 = one quarter of the bar. Anyone porting the 'CANNOT CHANGE STANCE' threshold must take the web number and must not read the Android fraction as authoritative.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2975-2979 and :239; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`
- **Build:** both — 1/6 on android v0.682, 1/4 on web v0.717
- **Lane impact:** L-combat-core / L-ui-hud: pins the stance-switch gate to a quarter bar for the v0.717 target and flags the Android bundle as an unsafe source for this specific constant.

### `[[itemdata/buff-system-30min]]` — UPHELD [A2] (2 critics)

The 30-minute consumable buff system is held: itemdata modifier id 38 calls setBuff(value, 1800s), and the six 'Potato' items at 1 heavenly gold each map onto BUFF_ATTACK/DEFENSE/XP/SPEED/AP/DUELTOKENS — which names the '150% DAMAGE' buff the ledger's own first-hand frame read saw and could not identify.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1094-1097 and StatsManager.as:288-312 (BUFF_* enum); itemdata rows at reference/extracted/itemdata.xml:237 (2115 Potato Dog), :251, :265, :279, :838, :852`
- **Lane impact:** L1 combat-core (a damage buff the combat model does not have), L6 economy (a premium sink), L10 ui-hud (the buff readout the ledger's crux frame shows), L12 meta-social. PARTIAL: setBuff stores only type and expiry — the '150%' magnitude itself was not traced to a constant this pass.

### `[[kh-boss-scaling-build-divergence]]` — UPHELD [A2] (1 critic)

A fourth combat-tuning divergence between the two builds, inside the boss/duelist setLevel path. Android bands boss stats at x1.25 (lvl>70), x1.2 (lvl>50), x1.1 (lvl>30) and x0.8 (lvl<10); web v0.717 bands only x1.1 (30 < lvl < 80) and x0.9 (lvl < 10). Android floors hitsToKillPlayer at 2; web floors it at 3. Android derives the boss's attack as max(authored, playerHP/hitsToKillPlayer + playerDEF); web does not -- it sets minDamage = 1 and assigns playerHP/hitsToKillPlayer to a separate field. Web also sets a field to 10 * lvl that android's setLevel has no counterpart for. The boss HP half (max(levelScaledAuthoredHP, playerhit * hitsToKillBoss) with the four playerhit floors) IS identical in both.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:77, :112-148, :810-824 vs reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:97-142 and :778-803`
- **Build:** both (divergent)
- **Lane impact:** L-enemies-ai + L-combat-core: bounds packet claim NF-boss-hp-derivation, whose 'build: both' is only half true. Any boss-scaling CONTRACT must be tagged per build; the web row is the one this project targets.

### `[[newfind/1071-is-the-behead-flag-and-it-moved-1p5-to-1p3]]` — UPHELD [A2] (1 critic)

§1t1071s0§ is the BEHEAD flag, and the behead multiplier is a sixth counted web-vs-android combat divergence: 1.5 on android v0.682, 1.3 on web v0.717. It is set by a switch over the hat/head/neck part slots at §1t99s0§.as:3736-3747 and again at §1t4904s0§.as:406-410; android does the identical thing at MCSPlayer.as:3689-3692 with the name 'behead'. The two web classes also disagree on ORDER: §1t4904s0§ applies x1.3 at :409 BEFORE the defence subtraction at :431, while §1t99s0§ applies it at :3805-3807 AFTER the min-damage floor — so the same head hit produces different numbers on the two paths, and a port must pick per class.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3736-3747 and :3805-3807 · reference/decompiled/shs3_payload/scripts/§1t4904s0§.as:406-410 and :431 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:3689-3692 and :3714-3716`
- **Build:** both — web v0.717 x1.3, android v0.682 x1.5
- **Lane impact:** L5 + L4 — retires combat-core/web-only-1.3-state-multiplier's phantom 'fifth damage term' and replaces it with a divergence row plus an ordering warning. Prevents double-counting +30 % on every head hit.

### `[[newfind/cannot-change-stance-is-getstring-960]]` — UPHELD [A2] (1 critic)

A source-side proof of the 'CANNOT CHANGE STANCE' build divergence that is stronger than any English-text search. The web build builds that label from §1t1521s0§.getString(960) at §1t113s0§.as:111 — the sibling line to the getString(175) 'Critical Hit' label at :110. The android string table has NO key 960: its numeric keys skip the entire 940-999 band, with 1000 the next present entry. So the divergence is proven at the ID level and does not depend on any assumption about how the copy was worded.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111 · docs/gauntlet/L0/index/strings.json (entries ["175"], ["1000"]; no entry ["960"])`
- **Build:** both — web v0.717 references id 960, android v0.682 table lacks it
- **Lane impact:** L8 + L5 — upgrades combat-core/cannot-change-stance-not-in-android-strings from an exhaustive-search argument to a source-side one, and gives the recreation the exact string slot to fill.

### `[[newfind/per-stat-caps-diverge-between-builds]]` — UPHELD [A2] (1 critic)

The per-stat CAP formulas diverge between builds in four of six rows, and one of them feeds the reach model directly. Positionally aligned, same six handlers in the same order: MAXHP web '10 + (lvl+10)*10' vs android '10 + (lvl+10)*5'; MAXCHI identical in both; MAXAP web '30 + (lvl+10)*5' vs android '20 + (lvl+10)'; ATK/DEF/SPD web '1 + (lvl+10)*3' vs android 'lvl + 10'. At level 8 the SPD cap is 55 on web and 18 on android — a 3x difference in the input to baseSlashLength = 120 + floor((90+5*DAN)*SPD/(20+SPD)). This makes the web level-8 Dan-0 reach ceiling 120 + floor(90*55/75) = 186, not the ~130 an android-capped reading gives.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346 · reference/decompiled/shs3_android/scripts/InventoryUI.as:2407-2412`
- **Build:** both — web v0.717 and android v0.682
- **Lane impact:** L1 + L4 + L10 — a 6th/7th/8th/9th counted web-vs-android divergence beyond the five in combat-core/web-android-combat-tuning-diverges-on-four-constants, and the concrete resolution of the 'SPD 205 is impossible' leg of the reach-magnitude gap. Any progression or reach row derived from the android caps is wrong for v0.717 by a wide margin.

### `[[npcdata/heavy-stance-def-penalty]]` — UPHELD [A2] (2 critics)

Heavy stance's defence penalty is confirmed verbatim at −20% by a first-party string rather than a wiki restatement, along with the full stance rock-paper-scissors ring.

- **Cite:** `skill 1002 carried by 79 NPCs (e.g. reference/extracted/npcdata.xml:535), resolved through docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L-combat-core: upgrades the provenance of §1's 'Heavy defender Defense ×0.8 (one way)' from wiki to first-party payload string, and independently sources the stance counter ring. ⚠ Carries the S0-3 caveat: this is ANDROID build v0.682 copy; web v0.717 parity is NOT established.

### `[[parity/meter-constants-diverge-and-frames-pick-the-web-one]]` — UPHELD [A2] (1 critic)

The reload/focus meter constants also split by build, and the footage selects the web set — the cleanest cross-build parity datum in the repo. Web: maxreload = 8*24 = 192, HUD fraction (reload-48)/(192-48) = 144 ticks of visible travel = 6.000 s at 24.0 fps. Android: maxreload = 5*24 = 120, HUD fraction (reload-24)/(120-24) = 96 ticks = 4.000 s. Refill is +1 per frame unconditionally in both (web §1t99s0§.as:1205, android MCSPlayer.as:1160), so fill time is SPD-independent. The frame-measured fill is 45.0 px/s across a 268 px track = 5.96-6.00 s, which matches the WEB constants and rules out the android ones by 2 seconds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249,1205 + §1t113s0§.as:328 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239,1160,1168; frame side re-measured by me at reference/frames/session11/crit-focus/t1081.100.png (edge 258) -> t1082.100.png (edge 303)`
- **Build:** both
- **Lane impact:** L-combat-core + L-ui-hud: positive cross-build parity evidence for the web build, and it retires 'the android source is a safe proxy for v0.717 combat tuning' for the meter as well as the stance tables.

### `[[parity/stance-tables-diverge-web-vs-android]]` — UPHELD [A2] (1 critic)

v0.717 (web) and v0.682 (android) disagree on BOTH stance tables, so any stance number sourced from MCSPlayer.as is v0.682 and must not be shipped as v0.717. REACH (setStance): web Light x1.4, Balanced x(1+0.2*M*0.1), Heavy x(0.5+0.4*M*0.1) floor 100, Reversed x1.4, Dual x1.0 floor 100 — android Light x1.5, Balanced x(1+0.5*M*0.01), Heavy x(0.5+0.5*M*0.01) floor 100, Reversed x1.5, Dual x1.0 floor 100. DAMAGE (getDamage): web Light x(0.5+0.4*M*0.1), Balanced x(1+0.2*M*0.1), Heavy/Dual/Reversed x1.4 — android x(0.5+0.5*M*0.01), x(1+0.5*M*0.01), x1.5. With the verified 1..10 mastery ladder, the android '*0.01' form barely scales at all (Balanced tops out at 1.05), while the web '*0.1' form reproduces the wiki 0.9/1.2/1.4 exactly at M=10. The web form is the coherent one.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094,3105,3116,3131,3142 and :3255-3271 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3030,3041,3052,3067,3078 and :3204-3213`
- **Build:** both
- **Lane impact:** L-combat-core: this is the concrete instance of the S0 build-parity caveat. It refutes any claim that quotes MCSPlayer.as stance numbers as v0.717, and it gives the correct web table for the port.

### `[[questdata/knockdown-grapple-aerial]]` — UPHELD [A2] (2 critics)

88 distinct animation-state names appear in questdata alone, and they include a knockdown/getup layer, a paired grapple throw, a 4-part aerial stab and a backstep dodge — combat primitives that appear in NONE of the 12 ledger systems.

- **Cite:** `reference/extracted/questdata.xml:19323, :19477, :19494, :19500, :19516, :19778`
- **Lane impact:** L1 combat-core: a knocked-down state (downed / flipupfromdowned / kneel / kneeltostand), a thrower+victim grapple pair, a 4-clip aerial stab and backstep_start/end are all absent from the ledger's moveset model. L2 skills-meters gains named cast animations focus_start / warcry_start / buffarmor_start. L11 art-anim gains the 88-name vocabulary as a cross-check against the ~450 anims in the 18 MCSCharacter_* blobs. throwgrenade matches the 'thrown pouch mid-air' Kheshav logged in §3's first-hand crux read.

### `[[skilldata/24fps-tick]]` — UPHELD [A2] (2 critics)

<cooldown> is in seconds and the engine multiplies it by 24 to get internal frames — the OG runs at 24 FPS, so every duration recovered from this payload (cooldowns and every animation d= value) converts to this repo's fixed 60Hz Sim at x2.5, not x1 or x2.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:308 and :116; reference/decompiled/shs3_android/scripts/Mobile.as:117`
- **Lane impact:** combat-core and art-anim-audio-feel — a global unit-conversion hazard that lives in the parser, not the data, so no system-siloed lane would surface it; skills-meters.

### `[[skilldata/android-web-parity]]` — UPHELD [A3] (2 critics)

reference/extracted/skilldata.xml (web v0.717) and reference/extracted/android/117_Mobile_SkillData.bin (Android v0.682) are the same file modulo line endings — 75 skills, identical ids and identical normalized bodies — so the Stage-0b S0-3 build-parity caveat does not apply to any skill number or string.

- **Cite:** `python3 normalized-XML comparison of reference/extracted/skilldata.xml vs reference/extracted/android/117_Mobile_SkillData.bin (see journal SK-1 for the pasted run)`
- **Lane impact:** skills-meters, combat-core, rebirth-elements — removes the Android-vs-web provenance discount from every skilldata-derived number and from every skill name/desc resolved through the Android string table.

### `[[skilldata/orphan-buff-animations]]` — UPHELD [A2] (2 critics)

Three fully-keyframed buff skills — enchantweapon, buffarmor, warcry — exist as animation constants declared in MCSActor.as and referenced nowhere else in the entire Android script set, with no <skill> row and no SkillManager id: animated-but-unwired abilities.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSActor.as:636-644; keyframe data in reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin; grep -rli over reference/decompiled/shs3_android/scripts/ returns only MCSActor.as`
- **Lane impact:** art-anim-audio-feel — three usable animated abilities not in any roster; enemies-ai; combat-core. I do NOT claim they were playable.

### `[[skills-meters/dual-reversed-are-swapped]]` — UPHELD [A2] (1 critic)

Reversed stance gets reach x1.4 and slash cost x1.0; Dual stance gets reach x1.0 floored at 100 px and slash cost x1.5 — the survey has the two exactly the wrong way round.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:824 and :866, joined to §1t99s0§.as:3130-3134, :3141-3149 and :3299-3311`
- **KILLS this line:** "① reach cap in stage px per stance"
- **Lane impact:** L5/L2: config's per-stance table must read Light x1.4 / Balanced x1.0->1.2 / Heavy x0.5->0.9 floor 100 / REVERSED x1.4 / DUAL x1.0 floor 100, and the meter cost must group Reversed with Balanced (x1.0) and Dual with Heavy (x1.5). Confirmed three ways inside the web bundle alone: the animation string literals, the stance ints 3=Dual/4=Reversed matching android MCSPlayer.as:33,35, and android's own setStance giving REVERSED the long reach at :3067.

### `[[skills-meters/heavy-defense-penalty-is-web-true]]` — UPHELD [A2] (1 critic)

The ledger's uncited 'Heavy def x0.8' is confirmed as a web-build A2 fact.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3290`
- **KILLS this line:** "- Ready: gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** L5: the penalty applies to Heavy ONLY (stance 2) — not to Dual or Reversed, which share Heavy's x1.4 damage but keep full defence. The ledger listed this under combat-core 'Ready' with no cite; it now has one in the shipped web build.

### `[[web-charsheet-heavy-defence-0.8-is-web-side]]` — UPHELD [A2] (2 critics)

Heavy-stance Defence x0.8 has a THIRD confirmation nobody has banked, and it is entirely web-side — no android string and no wiki. The web v0.717 character sheet sets its defence modifier per stance at §1t5957s0§.as:2728 (light = 1), :2737 (balanced = 1) and :2746 (heavy = 0.8), and consumes it at :2947 as `int(_loc3_ * _loc47_)` beside the stance name — the positional twin of android InventoryUI.as:2166 `"physical def: " + int(defense * defModifier) + " (" + stanceName + ")"`. So in v0.717 the character sheet and the simulation AGREE on defence (§1t99s0§.as:3288 `return defense * 0.8;`), unlike the android build where they contradict each other on crit. That agreement is itself worth banking: it means the v0.717 char-sheet path is a usable cross-check, whereas the v0.682 one is not.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2728, :2737, :2746, :2947 + §1t99s0§.as:3288`
- **Build:** web v0.717
- **Lane impact:** L5 combat-core: promotes the Heavy def x0.8 term from android-plus-skill-description to a two-site web v0.717 fact, and establishes that the v0.717 character sheet is a trustworthy cross-check on the sim (the v0.682 one demonstrably is not).

### `[[web-charsheet-per-stance-slash-reach-ladder]]` — UPHELD [A2] (2 critics)

UNCLAIMED AND LANE-RELEVANT: the web v0.717 character sheet carries a per-stance SLASH-DISTANCE ladder that no claim in this packet touches, and it is the mirror image of the damage ladder. In the same three stance branches that set damage and crit, §1t5957s0§.as sets a fourth modifier: :2729 light = 1.4 flat; :2738 balanced = 1 + 0.2*balancedMastery*0.1; :2747 heavy = 0.5 + 0.4*heavyMastery*0.1. It is consumed at :3013 as `int(_loc21_ * _loc48_)` beside the stance name — positionally the twin of android InventoryUI.as:2232 `"slash distance: " + int(baseSlashLength * slashModifier) + " (" + stanceName + ")"`, where the variable is literally named slashModifier. At mastery 10 the ladder reads Light 1.4 / Balanced 1.2 / Heavy 0.9, exactly inverting the damage ladder 0.9 / 1.2 / 1.4 that NEW-2 confirms from the same file. PARTIAL, not HELD, for one reason: this is the DISPLAY path, and NF-3/NF-5 prove a shipped build can display a modifier its own sim does not apply (v0.682 crit). It is not yet shown that the v0.717 sim uses the same coefficients — that needs the InputManager.setMaxDistance call site in the web bundle. What it does do is give the reach question its first ratio-shaped web-build evidence, and it is not a static text field, so SOURCE_CONSTANTS.md:33-36's placeholder ruling does not apply to it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2729, :2738, :2747, :3013 + reference/decompiled/shs3_android/scripts/InventoryUI.as:2232`
- **Build:** web v0.717
- **Lane impact:** L5 combat-core / L2 skills-meters: the reach blocker has been stuck on '345 and 200 are placeholders' with nothing to put in their place. This is a web-build, computed (not static-text) reach ratio ladder of 1.4 / 1.2 / 0.9 at max mastery. It must be confirmed against the web sim's own setMaxDistance call site before it is promoted past PARTIAL — the v0.682 crit case proves the char sheet can lie.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
