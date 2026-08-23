# LEDGER PACKET — `economy`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**31 surviving overturns · 2 true-but-rejected · 54 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **economy** | 48 | prices, services, currencies, war-room costs | sell-price + prosperity formulas; coins-per-kill reality; server-sim economy |
### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting).
- **Blockers:** ① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either). ② sell-price + prosperity-daily-sim formulas. ③ Repair-Weapon cost (never captured). ④ token/tournament economy numbers.
- **Surface:** Forge 700c (the −70 HUD read is a capture artifact); Writ of Release 25g now double-confirmed; War-Room structure coin costs absent from config.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-3/web-twin-of-repair-and-reinforce]]` — UPHELD [A2] (3 critics)

The web v0.717 twin of the repair/reinforce block exists and carries identical numbers, so the repair economy needs no Android caveat: repair costs currentNodeLevel * 10 (coins), clamps a worn weapon's uses down to 1, refuses an empty slot or item 13000, and reports achievement 60005; reinforce costs a flat 5000.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1057-1087`
- **Build:** web v0.717
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L4 economy — closes REBUILD_READINESS.md:215 ③ on a WEB cite, and shows the repair block was ported verbatim between builds.

### `[[NF-kill-xp-formula]]` — UPHELD [A2] (2 critics)

Kill-XP is HELD, closing the lead claim 21 opened. Every NPC gets xp = level*2 + 20 at init; bosses and duel opponents get xp = lvl*5 + 45. It was never in npcdata because it is computed in code.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:218 and :252, plus EnemyPlayer.as:82 and :88`
- **Build:** both
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L-progression blocker ④ ('full XP-income model') loses its kill-XP half outright; L-economy's '20+ samples show no XP formula either' is overturned.

### `[[actionscript/coins-per-kill-is-data]]` — UPHELD [A2] (2 critics)

There is no coins-per-kill constant: coin drops are per-NPC <reward><loot> rows rolled independently, where loot id 0 pays 1 coin per qty and loot id 1 pays 5 coins per qty — the first bandit drops 0 or 2 coins at 50% chance, not 8.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:803-806 and :837-843 · data at reference/extracted/npcdata.xml (npc id 1)`
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L-economy: blocker ① overturned in kind, not just in value — COINS_PER_KILL is the wrong shape of constant; early-game income is ~1 coin/kill.

### `[[actionscript/repair-weapon-cost-formula]]` — UPHELD [A2] (2 critics)

The Repair-Weapon service cost IS in the tree and is a one-liner: cost = currentNodeLevel x 10 gold, deducted immediately, and the repair restores the weapon to uses = 1 (near-full condition) rather than to zero wear. This is the exact ledger item that actionscript/repair-cost declared not found.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081 (node level resolver at StageManager.as:782-785)`
- **Build:** android v0.682
- **KILLS this line:** "Repair-Weapon cost never captured"
- **Lane impact:** L-economy: the repair-cost blocker closes with a real formula instead of a consumables workaround. Web-parity check still owed (find the §1t… twin of InteractUI).

### `[[economy/ap-cap-is-40-not-30]]` — UPHELD [A1] (2 critics)

AP max is 40 in the filmed web build; STAT_MAXAP,30 in StatsManager is a level-1 creation initial, exactly like STAT_MAXHP,10 which the same frame shows at 30.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg, crop (470,110)-(780,290) upscaled ×4 LANCZOS`
- **KILLS this line:** "④ AP regen rate + cap (world-exploration blocker)"
- **Lane impact:** L9 (WORLD): blocker ④'s regen half closes at 1 AP per 60 s (APINTERVAL, web §1t1523s0§.as:196 = 60); the CAP half does not close at 30 and must not be written into config. THE FRAME WINS. Same failure mode as reading MAXDUELTOKENS=30 as a cap when the HUD reads 40/40.

### `[[economy/calcxp-hard-cutoffs]]` — UPHELD [A2] (2 critics)

calcXP carries two hard zero cut-offs and an elite doubler that the survey did not quote — the XP model is more completely held than claimed.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:166-190, with helpers at :94-110 (getGreyLevel, three bands) and :112-164 (getZeroDifference, eleven bands)`
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L4/L10: the XP half of blocker ① is fully dead — grey-out floor, +3 over-level ceiling and elite ×2 included, portable today with no build needed. This also gives L4 (ENEMIES) its trivial-mob suppression rule for free.

### `[[economy/cho-han-is-ev-neutral]]` — UPHELD [A2] (6 critics)

Cho-Han betting is a zero-expected-value variance device, not a gold faucet — two independent floor(U[0,1)×6) dice give exactly 50/50 parity and a correct call returns bet × 2 on an escrowed stake.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1802-1843 (doChoHan); stake escrowed at :1790 (doBet)`
- **KILLS this line:** "gold has legit non-cash faucets (rebirth/tournament/betting)"
- **Lane impact:** L10/L11: betting must not be modelled as a gold source. Rebirth IS a genuine faucet (25 gold, 100 on the ninth). The Ready bullet is wrong in expectation on the betting clause.

### `[[economy/coins-per-kill-and-xp]]` — UPHELD [A2] (6 critics)

Both halves of blocker ① are HELD in the web build: coins per kill come from <reward><loot> id 0 (=1 coin × qty) and id 1 (=5 coins × qty) rolled against <chance>, or Math.random()×level for duelists — and calcXP is a complete, literal formula with both helper curves.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:861-867 and :188-206 (= Android NPC.as:837-843 and :166-190); loot rows at reference/extracted/npcdata.xml:38-44 (131 <loot> blocks over 66 NPCs, tabulated this run)`
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L4/L10: the commonest field mob yields 0.5 coins/kill in expectation (10% × 5 × 1c), not 8. src/config/economy.ts:37 KILL_REWARD={coinsFlat:8} and its docblock 'COINS have NO source formula found' are both refuted — the filmed +8 is the top of the duelist range floor(U[0,1)×9), so the frame stands and only the flat-constant MODEL falls. calcXP helpers: getGreyLevel (NPC.as:94) and getZeroDifference (NPC.as:112).

### `[[economy/duel-token-cap-40]]` — UPHELD [A1] (5 critics)

FRAME BEATS PAYLOAD: the duel-token cap is 40, not the Android bundle's 30 — the HUD reads 40/40 on film and the web payload's constant at the same slot is 40; this closes the token-economy blocker.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04, crop (1500,130)-(1780,235) upscaled ×5; corroborated at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200 vs reference/decompiled/shs3_android/scripts/StatsManager.as:166`
- **KILLS this line:** "④ token/tournament economy numbers."
- **Lane impact:** L10: token economy fully specified — cap 40, regen 1 per 120 s, ×2 under BUFF_DUELTOKENS, fresh character 20/20. L9 (WORLD) gets AP regen = 1 per 60 s free, closing world-exploration blocker ④ 'AP regen rate + cap'.

### `[[economy/minus-70-is-repair-not-artifact]]` — UPHELD [A1] (2 critics)

The ledger's unresolved '-70 HUD read' at the blacksmith is a Repair Weapon at node level 7 (7 x 10), not a capture artifact — and the forge was never paid because the player held 531 coins against a 700 quote.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 — t=21:25 (BLACKSMITH menu open, wallet 531 COINS) and t=21:45 (STABLES, wallet 461 COINS), both extracted at 1920x1080 and read from a 640x360 contact sheet; corroborating formula at reference/decompiled/shs3_android/scripts/InteractUI.as:1058.`
- **KILLS this line:** "Forge 700c (the −70 HUD read is a capture artifact)"
- **Lane impact:** L10: closes a discrepancy SYNTHESIS.md:243 marks 'unresolved ... do NOT hardcode'. Forge = min(nodeLevel,80) x 100 and repair = nodeLevel x 10 are now both frame-corroborated at the same node in the same visit, and the ledger's dismissive 'capture artifact' parenthetical should be struck.

### `[[economy/quest-prosperity-plus5-is-client-side]]` — UPHELD [A1] (2 critics)

Town-prosperity deltas from quests are hard-coded client-side literals in BOTH builds (+5, or +10 on the non-halved branch) and one of them is confirmed on film — so prosperity is not wholly server-authored.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg, crop (480,335)-(770,465) upscaled x5 LANCZOS; mechanism at reference/decompiled/shs3_android/scripts/QuestGenerator.as:846,850,921,1094 and web reference/decompiled/shs3_payload/scripts/§1t123s0§.as:885,889,959,1140,1349; consumed at Overworld.as:357-359`
- **KILLS this line:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L9/L11: split blocker ② three ways, not two. Sell-price DEAD (claim 9). Player-driven prosperity DEAD — +5/+10 per quest, client-side, frame-confirmed. Only the DAILY-SIM deltas (bandit raids, merchant trade, mercenary upkeep, town attacks) remain server-side and must be authored + labelled in DIVERGENCES.

### `[[economy/repair-weapon-cost]]` — UPHELD [A2] (6 critics)

Repair-Weapon cost is HELD in both builds at currentNodeLevel × 10 coins, and repair resets condition to tier 1 rather than restoring to new.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1058; the same line number in the web build, reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1058`
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10: closes the blocker and also kills the §5 Tier-2 task line 'Items/economy session: … read Repair cost' — no playable build is needed for it.

### `[[economy/repair-weapon-cost-was-captured-on-film]]` — UPHELD [A1] (2 critics)

Economy blocker ③, 'Repair-Weapon cost (never captured)', is dead. The blacksmith dialog prints the price on screen: 'REPAIR YOUR CURRENTLY EQUIPPED WEAPON? / COST: 70 COINS', at a node the forge dialog independently labels '(LEVEL 7)' — i.e. repair = nodeLevel × 10, frame-confirmed against the source formula.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 at t=21:26 (repair dialog, wallet 531) and t=21:23 (forge dialog 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS'), extracted at 1920×1080 with ffmpeg and read from a 640×360 contact sheet; formula at reference/decompiled/shs3_android/scripts/InteractUI.as:1058`
- **Build:** web v0.717 (filmed)
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10 ECONOMY: blocker ③ closes from footage already in the repo. It rides on the same 21:23-21:27 sequence that kills the '−70 is a capture artifact' parenthetical, so both ledger corrections land in one edit.

### `[[economy/sell-price-formula]]` — UPHELD [A2] (6 critics)

The sell-price formula is HELD verbatim in the WEB build and is independent of <baseprice> — it is a function of item-id band, weight and affix count only, so any 'sell = X% of buy' model is false.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web), byte-for-byte identical to reference/decompiled/shs3_android/scripts/Item.as:1582-1592; consumed at ShopUI.as:401, paid at ShopUI.as:540`
- **KILLS this line:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L10 (PROGRESSION + ECONOMY): sell price is portable today. Trap flagged: ShopUI.as:58 declares `internal var sellPercentage:Number = 0.5;` which is dead code — one declaration, zero reads across the bundle. Every itemID < 3000 (all consumables/materials) sells for exactly 1 coin.

### `[[economy/tournament-payout-formula-is-client-side]]` — UPHELD [A2] (2 critics)

The tournament economy numbers ARE in the web client, in the CREATE panel — not in the details panel the packet nominated. Prize unit = floor((entryFee × playerCount + 5) × 0.75 / 7), paid out 4u / 2u / 1u to 1st/2nd/3rd. Player count ladder 2/4/8/16 (2 gated on a premium flag), entry fee clamped 0…100, level range clamped 5…80, round duration ladder 0.5/1/2/24/48 h. Creating a tournament costs 5 of currency-stat 20112 (waived on the premium flag); joining costs `entryfee` of the same stat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7091s0§.as:406-412 (prize formula), :147-180 (player-count ladder), :183-200 (entry-fee 0…100), :203-300 (level clamps 5…80), :303-360 (round-duration ladder); reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:572 and :585 (create charges 5 of stat 20112), :600 and :610 (join charges entryfee of stat 20112)`
- **Build:** web v0.717
- **KILLS this line:** "④ token/tournament economy numbers."
- **Lane impact:** L10/L11 ECONOMY — blocker ④'s tournament half closes from the client with no build needed. The pot is NOT redistributed whole: 0.75/7 × (fee×players+5) is the unit and 7 units are paid, so the house rake is exactly 25%. Note §1t7144s0§.as itself contains NO literals — it only reads server-supplied fields — so the packet's stated close-path would have found nothing. Residual STILL_UNHELD: currency stat 20112 has no name (absent from itemdata.xml and from the v0.682 string table).

### `[[enemies-ai/kill-rewards-close-two-economy-blockers]]` — UPHELD [A2] (8 critics)

Kill rewards are fully authored in npcdata's <reward> plus NPC.as: loot id 0 = a 1-coin drop, id 1 = a 5-coin drop, id 2 = quest item, id 3 = level-scaled random item, anything else = that literal item id — so coins-per-kill is Σ(qty × {1,5}) over rolled drops, not a flat 8; and the XP award is the complete grey-level / over-level / elite curve on base xp = level*2 + 20.

- **Cite:** `reference/extracted/npcdata.xml:38-44 (66 <reward> / 131 <loot>, chance domain 0.05,0.1,0.3,0.4,0.5,1) + reference/decompiled/shs3_android/scripts/NPC.as:218, 799-855, 166-190, 94-105, 112-124`
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** Cross-lane into L0 economy, banked here because it lives in npcdata.xml. Kills economy blocker ① in both halves: the coin faucet and the full XP curve (incl. getGreyLevel playerLevel - floor(playerLevel/10) - 5, and getZeroDifference 5/6/…) are on disk.

### `[[frames/HUNT-gold-to-resource-exchange-rate]]` — UPHELD [A2] (2 critics)

The gold-to-resource exchange rate is stated twice and identically: 1 Gold buys 10 AP or 10 Duel Tokens. Token IAP packs and a max-token cap exist too. Separately, the frame that shows the stable price shows NO AP component, so the ledger's 'stable 14c+5AP' needs its own cite for the +5AP half or should be trimmed.

- **Cite:** `strings.json["61"], ["100"], ["122"], ["4173"]-["4175"]; stable prompt at reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0048.jpg (crop 0,400-700,576 @2x)`
- **Build:** android v0.682 strings; stable price from web v0.717 frame
- **KILLS this line:** "Economy statics: ... stable 14c+5AP ..."
- **Lane impact:** economy: adds the hard-currency conversion rate; puts the '+5AP' half of the stable static in doubt

### `[[hunter-s26a/per-enemy-xp-formula-is-lvl-times-2-plus-20]]` — UPHELD [A2] (2 critics)

The per-kill XP formula is on disk and nobody claimed it: NPC.setLevel sets this.xp = lvl * 2 + 20, three lines below a quote npcdata/spawn-level-comes-from-the-quest-wave already made. Combined with NPCManager passing the quest-wave <lvl> into setLevel, every combat NPC's XP award is fully determined by its spawn level.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:239-259 (key line :252)`
- **Build:** android v0.682 (web parity not checked)
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L4 economy + L-progression. The 'no XP formula' half of :215 (1) is dead, and :200 (4) 'full XP-income model' gains its kill term. Note the clause survives on coins-per-kill, which this does not touch.

### `[[hunter/repair-cost-formula-found]]` — UPHELD [A2] (2 critics)

The Repair-Weapon cost the ledger calls 'never captured' is an explicit formula: repair = currentNodeLevel x 10 coins, paid at a town service, restoring the weapon to uses = 1. A second, premium path costs 2 Heavenly Gold and makes the weapon unbreakable + named. Both claim/repair-cost (STILL_UNHELD) and claim/repair-cost-is-two-consumables ('not a priced service') missed it.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081 · reference/decompiled/shs3_android/scripts/GetGoldPromptDialog.as:225-236 · reference/decompiled/shs3_android/scripts/GameEngine.as:1295-1297`
- **Build:** android v0.682
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L-economy: blocker ③ closes with a formula, not just a shop price. L-items-equipment inherits the uses=1 restore semantics; L-meta-social gets the 2-HGold Ninja-Services price.

### `[[itemdata/coins-per-kill-is-1-or-5]]` — UPHELD [A2] (2 critics)

Coins per kill are not 8: npcdata's <reward><loot><id> is an enum, not an item id — 0 pays 1 coin per qty, 1 pays 5 coins per qty, 2 gives a quest item, 3 rolls a random item at the NPC's level; measured expectation over all 66 loot-bearing NPCs is min 0.50, max 10.00, mean 1.78 coins, and 429 of 495 NPCs drop nothing at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:799-856 (web parity: reference/decompiled/shs3_payload/scripts/§1t68s0§.as:860-878); data rows reference/extracted/npcdata.xml:22 (npc 1 'Ruffian'), :145 (npc 6 'Thug'), :273 (npc 11 'Bandit')`
- **KILLS this line:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L6 economy blocker ① closed and the seeded value shown to be ~4.5x too high; L7 enemies-ai gains per-enemy drop rows; L3 progression's coin-income model changes shape (kills are a trickle, not the faucet).

### `[[itemdata/duel-token-economy]]` — UPHELD [A2] (2 critics)

The duel-token economy has exact numbers: items 2125/2126/2127 sell 10/25/40 duel tokens for 1/2/3 heavenly gold with zero coin price, the cap constant is 30, the regen tick is 120 seconds, and a character starts at 20/20.

- **Cite:** `reference/extracted/itemdata.xml:374, :388, :402 (item blocks 2125/2126/2127, modifier id 15 = STAT_DUELTOKENS); reference/decompiled/shs3_android/scripts/StatsManager.as:166 (MAXDUELTOKENS) and :160 (DTINTERVAL)`
- **KILLS this line:** "④ token/tournament economy numbers."
- **Lane impact:** L6 economy blocker ④ closed on its token half; L12 meta-social gains the duel-token sink and regen. PARTIAL because tournament/betting payouts remain unheld.

### `[[itemdata/reload-bar-max-is-a-hard-constant-and-diverges]]` — UPHELD [A2] (1 critic)

The reload/focus bar MAXIMUM is a hard-coded constant, not a SPEED formula, and it DIVERGES between builds: 5*24 = 120 on Android v0.682 and 8*24 = 192 on web v0.717. In both builds the value StatsManager.getBaseReload() computes (48 + SPEED*6) is passed into initPlayer, stored in a field, and never read by anything - it is dead code. This is a third android-vs-web tuning divergence beyond the two in itemdata/android-vs-web-constants-diverge, and it is what refutes itemdata/slashusage-is-a-reload-economy's bar-max half.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105, :182, :190, :239 and EnemyClone.as:49 and :77; reference/decompiled/shs3_android/scripts/StatsManager.as:1839-1842; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :191, :249 and §1t4904s0§.as:49 and :77`
- **Build:** both
- **KILLS this line:** "itemdata/slashusage-is-a-reload-economy: 'the bar's max is 48 + SPEED6, its floor is 24'"
- **Lane impact:** L1/L5 COMBAT CORE: the slash economy must be modelled as a flat 192-frame (8 s at 24 fps) bar for v0.717 fidelity, NOT as 48 + SPEED*6. SPEED does not lengthen the bar at all; it only affects reach and cooldowns. L6/L3: one more constant that must name its build. Also a general methodology lesson — a value that is computed and passed is not thereby used.

### `[[itemdata/two-gold-items-are-coin-buyable]]` — UPHELD [A2] (1 critic)

Exactly two premium items carry a <heavenlyprice> but NO <baseprice> tag, so XMLItem's default fires and they are purchasable for 1 coin: item 2212 (heavenlyprice 5) and item 7049 (heavenlyprice 3). Every other Gold item writes <baseprice>0</baseprice>. This is the counterexample to 'Gold-only, not buyable with coins'.

- **Cite:** `reference/extracted/itemdata.xml:2446-2459 (item 2212) and :5218-5226 (item 7049); reference/decompiled/shs3_android/scripts/XMLItem.as:86-93 (and web parity reference/decompiled/shs3_payload/scripts/§1t104s0§.as:84-91)`
- **Build:** both (schema parity proven)
- **KILLS this line:** "itemdata/gold-catalogue: 'Every one of these rows also carries <baseprice>0</baseprice> — Gold-only, not buyable with coins.'"
- **Lane impact:** L6 economy: the premium catalogue is 301 Gold-only rows plus 2 that also carry a 1-coin price. A recreation that hard-codes 'heavenlyprice > 0 implies coin price 0' will diverge on these two rows.

### `[[itemdata/xp-per-kill-formula]]` — UPHELD [A2] (2 critics)

XP per kill is a closed formula: base XP = mobLevel*2 + 20, then a level-difference transfer function with a hard grey-out cut-off and an elite x2, with a x1.5 XP-buff multiplier applied at award time.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:218 and :252 (base), NPC.as:166-190 (calcXP), NPC.as:94-110 (getGreyLevel), NPC.as:112ff (getZeroDifference), LootDialog.as:638-648 (addLootXP); web parity reference/decompiled/shs3_payload/scripts/§1t68s0§.as:237 and :198`
- **KILLS this line:** "coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)"
- **Lane impact:** L6 economy blocker ① (the XP half) closed; L3 progression blocker ④ 'full XP-income model' closed for the kill channel; L7 enemies-ai gains the per-enemy XP value for all 495 rows.

### `[[npcdata/loot-enum-and-coins-per-kill]]` — UPHELD [A2] (2 critics)

Coins-per-kill is measurable, not inferred: NPC.createLoot resolves loot id 0 = 1 coin × qty, 1 = 5 coins × qty, 2 = quest item, 3 = a random item rolled off the enemy's level, anything else = a literal itemdata id — making expected coins per kill ~0.75–2.5 for field trash (max 10, Mercenery Captain), not 8.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:805-806 and :837-856, applied to the 66 <reward> blocks in reference/extracted/npcdata.xml (e.g. Ruffian :38-44, Bandit :291-307, Mercenery Captain :1235-1241)`
- **KILLS this line:** "- Blockers: ① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** economy — kills blocker ①; also hands items-equipment its missing hook, since random item drops roll off the enemy's level (blocker ① stat-vs-level curve).

### `[[payload/repair-cost-formula-is-node-level-times-10]]` — UPHELD [A2] (2 critics)

The Repair-Weapon cost is not merely a template — the formula is on disk. InteractUI.as:620-621 sets level = StageManager.getCurrentNodeLevel() capped at 80, then :647 renders getString(848,[level * 10]). Repair = nodeLevel x 10 coins. The same block gives Forge = nodeLevel x 100 (:634 iron below 30, :638 bronze 30-59, :642 steel 60+) and Reinforce = flat 5000 (:649-668, 1 Silver Ore under weapon level 30, 1 Titanium Ore at 30+). FRAME VALIDATION: frame_0040.jpg renders 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS' — 7 x 100 = 700 exactly, from the line immediately above the repair line, so the same `level` variable feeds both. Repair at a level-7 node is 70 coins.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:620-621, :634, :638, :642, :647, :649-668; validated against reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,370-1024,576 @1.46x, reads 'FORGE AN IRON SWORD (LEVEL 7)? COST: 700 COINS')`
- **Build:** android v0.682 code; the web build renders the sibling templates verbatim on camera, so the family has parity
- **KILLS this line:** "③ Repair-Weapon cost (never captured)"
- **Lane impact:** L7 economy / L6 items-equipment — blocker ③ dies with a number, not a re-statement, and :334's close-path ('read Repair cost') is already done. Also upgrades the ledger's Forge 700c from a single-frame constant to f(nodeLevel) = nodeLevel x 100, and confirms Reinforce 5000 is genuinely flat.

### `[[payload/repair-weapon-cost-is-a-template-not-a-constant]]` — UPHELD [A2] (2 critics)

The Repair-Weapon cost can never be captured as a constant, because it is not one. The confirmation string is a runtime template with a substitution slot, structurally identical to the Forge string whose '700 coins' this packet already re-labelled as f(weapon level). Blocker 'Repair-Weapon cost (never captured)' should be re-stated as 'Repair cost is f(weapon), formula unknown' rather than treated as a missing number.

- **Cite:** `docs/gauntlet/L0/index/strings.json["848"], parsed from reference/extracted/android/118_Mobile_Lang_EN.bin; frame corroboration of the sibling templates at reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,370-1024,576 @1.46x) and frame_0042.jpg (crop 0,370-1024,576 @1.46x)`
- **Build:** android v0.682 string table (web v0.717 renders the sibling Forge and Reinforce templates verbatim, so parity is corroborated for this family)
- **KILLS this line:** "Repair-Weapon cost (never captured)"
- **Lane impact:** economy, items-equipment: stop hunting for a repair PRICE; the deliverable is a repair COST FUNCTION

### `[[skilldata/coin-cap-carry-weight-gold-trap]]` — UPHELD [A1] (2 critics)

Coin cap is 1000 base rising 2000/4000/6000/8000/10000 with Coin Purse+, and carrying weight is 100 + 20 per Carrying Weight+ level to a max of 300 — and the AS3 identifier STAT_GOLD actually holds the COINS value, which the frame settles because the HUD shows COINS and GOLD as two separate counters.

- **Cite:** `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png, crop (0,0)-(700,260) upscaled 3x LANCZOS; corroborated by reference/decompiled/shs3_android/scripts/StatsManager.as:2632-2650, :2298-2300, :2653-2656`
- **KILLS this line:** "economy | 48"
- **Lane impact:** economy — two exact caps plus a naming hazard: a rebuild mapping STAT_GOLD onto the gold counter would cap premium currency at 1000 and leave coins unbounded. THE FRAME WINS over the code's identifier, and I say so explicitly. items-equipment (carry weight closed against itemdata <weight>); ui-hud.

### `[[uistrings-payload/duel-betting-book-is-web-only-with-full-odds-math]]` — UPHELD [A2] (1 critic)

The web v0.717 client runs a pari-mutuel betting book on live duels with the complete odds formula and house rake in shipped code — odds_i = round((pool × rake − bets_i) / bets_i × 10)/10, quantised to 0.1, rake 0.85 when the pool is ≤100 and 0.80 above it, floored at 0.7 while the pool is ≤10 and still open — and it has no counterpart in the Android build (0 files, 0 of 2,533 table entries mention odds).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:238`
- **Build:** web v0.717 only
- **KILLS this line:** "④ token/tournament economy numbers."
- **Lane impact:** economy blocker ④ and meta-social blocker ④ ('offline gold faucet rate (primary source was dead IAP)') — this is a gold faucet with a KNOWN rake, so the offline economy can be balanced against a real number instead of an authored one. Supporting lines in the same function: :222 pool = totalbetsonplayer1 + totalbetsonplayer2, :223 pool<=10 && acceptingbets → 0.7, :232 pool>100 ⇒ ×0.8, :236 otherwise ×0.85.

### `[[uistrings-payload/tournament-field-set-and-create-form]]` — UPHELD [A2] (1 critic)

The complete tournament spec sheet is authored in one field — status/players/entry fee/1st-2nd-3rd prizes/level requirement/autostarts upon full roster/round duration/autoresolves upon round timeout/organizer — plus a create-form label set (title · players · entry fee · min level · max level · round duration · autostart · prizes 1st/2nd/3rd) at characterIDs 883-896.

- **Cite:** `reference/extracted/payload.xml:534288`
- **Build:** web v0.717 only (Android: 0 code files, 0 table entries for 'tournament')
- **KILLS this line:** "④ token/tournament economy numbers."
- **Lane impact:** economy blocker ④ / meta-social — STRENGTHENS the banked economy/tournament-is-web-only, whose own close-line said 'A follow-up pass should read §1t7144s0§.as and its fields'. The field set arrives without needing it. PARTIAL: field set real, numbers placeholder. Create-form sample values at :534336 (10), :534344 (80), :534348 (24 hours), :534352 (yes), :534361 (400 / 200 / 100).

### `[[uistrings-payload/weapon-unbreakable-price-differs-between-builds]]` — UPHELD [A2] (1 critic)

The same dialog and the same string id carry different prices across builds — the web payload's authored text says 5 gold, the Android table's string 669 says 2 Gold — and because the web client overwrites that field with getString(669) at runtime, the SHIPPED web price is UNHELD in either direction.

- **Cite:** `reference/extracted/payload.xml:2634709`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** economy blocker ③ — the single cleanest demonstration that S0-3's parity caveat has teeth ON MONEY, not just on wording. Runtime overwrite at reference/decompiled/shs3_payload/scripts/§1t5777s0§.as:180 'this.msgText.text = §1t1521s0§.getString(669);'; the web's own value for id 669 lives in the never-archived shs3_en.xml. Anyone 'correcting' the ledger to 5 gold from ui_strings.txt:471 would be shipping a placeholder; anyone porting 2 Gold is making a labelled cross-build assumption. Android also prices the Ninja-Services rename+unbreakable at 2 Gold (strings.json["636"], reached in the web build too at §1t401s0§.as:620).

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[economy/quest-coin-reward-formula]]` — NOT-UPHELD [A2] (2 critics)

Quest coin reward is a held, portable law in BOTH builds — questCoinReward = nodeLevel x 5 (bounty quests nodeLevel x 10) — emitted at runtime as <reward><loot><id>0</id>, which is why it is nearly absent from the static questdata.xml.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestGenerator.as:844 (and :1006 bounty, :917 emission, :876 outcome-11 emission); web twin reference/decompiled/shs3_payload/scripts/§1t123s0§.as:883 and :955; consumed at QuestLogUI.as:455-461`
- **aimed at this line, which SURVIVES:** "① coins-per-kill reality (=8 is an unconfirmed INFERRED seed; 20+ samples show no XP formula either)."
- **Lane impact:** L1 (CAMPAIGN) + L10 (ECONOMY): quests are the PRIMARY repeatable coin faucet, not a zero. Against the 0.5 coins/kill mob EV, one level-7 quest (35c) equals 70 mob kills — an offline economy that omits it starves by ~2 orders of magnitude. The law is fully offline-reproducible: nodeLevel x 5, x10 for bounties, paid as loot id 0.

### `[[economy/tournament-is-web-only]]` — NOT-UPHELD [A2] (2 critics)

The tournament system exists ONLY in the web v0.717 bundle — zero Android files mention it — so economy blocker ④'s tournament half is openable rather than dead, and the survey's own claim 1 is the key that unlocks it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:34-48 and :81-82; grep -rli tournament over shs3_payload/scripts → 5 files, over shs3_android/scripts → 0 files`
- **aimed at this line, which SURVIVES:** "④ token/tournament economy numbers."
- **Lane impact:** L10/L11: the 2026-08-13 critic's 'grep returns 0 files, the tournament half is untouched' was true of Android and is FALSE of the web bundle. A follow-up pass should read §1t7144s0§.as and its four siblings for entry fees, payouts and bracket rules. Also a sixth witness that web ≠ Android in CONTENT, not just tuning.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[actionscript/unbreakable-and-reinforce-prices]]` — UPHELD [A2] (1 critic)

Two more previously-uncaptured service prices sit in the same switch and dialog: reinforce/upgrade weapon is a flat 5,000 coins, and making a weapon unbreakable (which also names it) costs 2 Heavenly Gold.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1082-1096 and GetGoldPromptDialog.as:225-235 (prompt copy at docs/gauntlet/L0/index/strings.json["669"])`
- **Build:** android v0.682
- **Lane impact:** L-economy: two more priced services with exact numbers; premium (Heavenly Gold) currency confirmed as a distinct wallet.

### `[[android-blobs-hunter/condition-comparison-enum-is-seven-operators]]` — UPHELD [A2] (1 critic)

The <condition> evaluator's comparison enum is seven operators, not the two the packet names. StatsManager.checkCondition special-cases 'rand' first and then runs a full switch: eq, gte, gt, lt, lte, not, with default returning false. Authored usage across the whole Android corpus is 13 sites: nodedata rand x1; achievementdata not x1; questdata eq x5, gt x1, gte x2, not x1; uidata gte x1, lt x1, not x1. An absent <comp> defaults to 'gte'. Every <condition> in nodedata, questdata, uidata and achievementdata draws on the same evaluator, so any of them can be made probabilistic, negated or bounded.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4222 (rand), :4279-4295 (switch eq/gte/gt/lt/lte/not/default), :4173 (default gte); authored <comp> census over reference/extracted/android/*.bin`
- **Build:** android v0.682
- **Lane impact:** L4 enemies-ai, L1 world-exploration, L-quests-story, L-economy. The ledger treats conditions as flat 'has item X' gates; the shipped evaluator is a six-operator comparison plus a probability primitive, and 'lte' is declared but never authored.

### `[[coins-gold-hud-strip-correct-frame]]` — UPHELD [A1] (1 critic)

The COINS/GOLD dual-currency HUD strip is real and I have opened it — but it is NOT in frame_0027, which NF-2/coins-and-gold cites. frame_0027 is a 'YOU RECEIVED' loot dialog on a full-screen red freeze (coin icon + 15, 'XP 510', three PANTS slots, OK button) with no HUD strip at all. The strip appears in the same directory at frame_0029, frame_0030, frame_0040, frame_0041 and frame_0042. Visible in the top band, left to right: a silver coin icon with '480' over the label 'COINS'; a red '+' button; a gold coin icon with '2' over the label 'GOLD'; a red 'GET GOLD' button; and at the right a level badge '7' beside a yellow bar reading '14901 / 16350' over 'EXPERIENCE POINTS'. 16350 is expArray[7], consistent with a level-7 player. The code mapping the claim pairs with it is sound: STAT_GOLD = id 11 renders as COINS and STAT_HGOLD = id 12 renders as GOLD, and character creation sets 11 -> 100 and 12 -> 3. THE FRAME WINS: bank frame_0029, not frame_0027.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0029.jpg (top strip crop 0,0-1024,52, ~x1.46 LANCZOS) + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:226, :228, :1023-1024 + reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194`
- **Build:** web v0.717
- **Lane impact:** L10 ui-hud / L4 economy: gives the dual-currency HUD a frame cite that actually opens. Also settles that getGold()/changeGold() are COIN operations, so every 'gold' price read out of StatsManager is a coin price.

### `[[economy/2208-is-the-gold-to-coin-sku]]` — UPHELD [A2] (1 critic)

The filmed banknote tile is item 2208, the shop's gold→coin SKU at heavenlyprice 1 — so v0.717's 5× change is a DEFLATION of coins-per-gold (1000→200) at an unchanged 1-gold price, the inverse of the surveyed claim.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:428 and :482-484; payout divergence at reference/decompiled/shs3_payload/scripts/§1t401s0§.as:952 vs shs3_android/scripts/InteractUI.as:923; row at reference/extracted/itemdata.xml item 2208`
- **Lane impact:** L10: the premium→coin sink is one SKU (2208) priced at 1 heavenly gold, paying 200 coins on web and 1000 on android, and refused when the purse is full. Model it as an item, not a menu service. Item 2209 ('Full HP and Chi', hp=1) is the second 1-gold SKU, paying StatsManager.fullHealth() at ShopUI.as:487-489.

### `[[economy/5x-redenomination-is-a-code-fact]]` — UPHELD [A2] (1 critic)

The 5x web/Android gold redenomination is real but is proved by three CODE constant pairs, NOT by itemdata — which is byte-identical across builds and therefore cannot carry a per-build denomination; how the web shop renders 25 from a shared heavenlyprice of 5 remains untraced.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2646,2651 vs shs3_android/scripts/StatsManager.as:2203,2207; §1t401s0§.as:952 vs InteractUI.as:923; §1t410s0§.as:136-140 vs PayUI.as:127-131. Byte-identity: md5 of both itemdata bodies = 75d5344925e13de09924120b4136ae2a.`
- **Lane impact:** L3/L10/L11: the redenomination rule is sound enough to port, but it must be sourced from the code pairs above and applied to CODE constants, not blanket-applied to <heavenlyprice> rows — the frame contains 1-gold tiles that no heavenlyprice row can produce under x5. Where the web shop's x5 display multiplier lives is STILL_UNHELD and should be logged as an open item rather than dissolved with a provenance story.

### `[[economy/bank-weight-v0717-has-200-base]]` — UPHELD [A2] (1 critic)

v0.717 bank capacity is not the android formula: the base is 100 but becomes 200 when stat 40018 is unlocked, then + DAN*10 + PAIDSTORAGE*10.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:3175-3182 vs reference/decompiled/shs3_android_payload/scripts/BankUI.as:264`
- **KILLS this line:** "Ready: currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs;"
- **Lane impact:** economy + items-equipment: corrects the survey's claim-8 lane_impact ('Bank weight is 100 + DAN*10 + PAIDSTORAGE*10'), which is the android-only form. v0.717 has a permanent doubling unlock (stat 40018) with no android counterpart, and the getter lives in StatsManager, not in BankUI.

### `[[economy/calcxp-has-a-web-v0717-twin]]` — UPHELD [A2] (1 critic)

The kill-XP model is not android-only: the identical getGreyLevel / getZeroDifference / calcXP trio exists in the shipped web v0.717 bundle, byte-for-byte the same bands and the same two hard zero cut-offs. The build-parity caveat that would otherwise attach to the calcXP claim is closed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (grey level), :131-183 (zero-difference ladder), :185-209 (calcXP) — twin of reference/decompiled/shs3_android/scripts/NPC.as:94-110, :112-164, :166-190`
- **Build:** both
- **Lane impact:** L4 ENEMIES + L10 ECONOMY: the XP-per-kill model is portable as plain CONTRACT (both builds agree), including the grey-out floor, the +3 over-level ceiling and the elite ×2. Also corrects a detail: getZeroDifference has 12 branches, not the 'eleven bands' the packet states.

### `[[economy/cash-tier-redenomination-is-not-clean-5x]]` — UPHELD [A2] (1 critic)

The web build's real-money gold tiers are 5.00x the Android build's on four of five tiers but 5.33x on the top tier (400 vs 75) — so the v0.717 redenomination is real at the cash tier and is NOT a clean uniform multiple anywhere.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140 and :325-329 (web) vs reference/decompiled/shs3_android/scripts/PayUI.as:127-131 and :137-141 (Android)`
- **Lane impact:** L10/L11: pairs with the inverted coin sink (web 200 coins/gold vs android 1000) to show heavenly gold was inflated ~5x while its purchasing power was held roughly flat. Any heavenly-gold figure ported from the Android decompile must be re-derived per build and labelled — but by table lookup, never by multiplying.

### `[[economy/chest-coin-formula-missing-from-faucet-set]]` — UPHELD [A2] (1 critic)

The 'closed and enumerable' coin-faucet set omits its biggest per-event payer: good chests and Dragon Dance loot pay Math.random()*lvl + lvl*5, i.e. 5–6× node level in a single interaction.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_ChestGoodLoot.as:62 and Obj_DragonDanceLoot.as:331; also NetworkManager.as:1264 and :2814, WarUI.as:241`
- **Lane impact:** L10: at node level 40 one good chest pays 200-240 coins against a commonest-mob expectation of 0.5 coins/kill — a 400× gap. Any offline faucet budget built from the mob number alone is wrong by two orders of magnitude. The faucet set is closed only once these formulas are in it, not just the word 'chests'.

### `[[economy/coin-faucet-set-now-cited]]` — UPHELD [A2] (1 critic)

The coin-faucet set the survey enumerated without citations is fully citable in the android bundle.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:1298; Obj_ChestLoot.as:45; Obj_ChestGoodLoot.as:62; Obj_DragonDanceLoot.as:331; WarUI.as:241 and :491; InteractUI.as:1548`
- **Lane impact:** L4/L9/L10: the faucet set is closed and every member now has a line cite. Note the two chest tiers differ by a guaranteed floor (lvl*5) on good/dragon-dance chests, which the survey's chest bullet did not distinguish.

### `[[economy/coin-purse-cap-ladder]]` — UPHELD [A2] (6 critics)

A hard coin-purse cap ladder (1000/2000/4000/6000/8000/10000) exists in BOTH builds and changeGold silently discards the overflow — the load-bearing sink that gives the economy its shape, named in none of the ledger's economy bullets.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2632-2667; identical in web at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2921-2940`
- **Lane impact:** L10/L9: a 1000-coin default cap against a 5000c Reinforce and an 8000c max-level Forge IS the mid-game grind. isCoinPurseFull() gates both the gold→coin conversion and the purse-upgrade purchase (ShopUI.as:426-435). The bank (InteractUI.as:1748 bankDeposit, STAT_COINSINBANK) is the escape hatch and pays zero interest; storage weight = 100 + STAT_DAN*10 + STAT_PAIDSTORAGE*10 (BankUI.as:264), each +10 costing 1 heavenly gold.

### `[[economy/crop-price-is-supply-oscillator]]` — UPHELD [A2] (6 critics)

Crop price is not a static '5–20c' range but a three-point supply signal: base 10 for all four clans, 20 for the clan with the fewest crops, 5 for the clan with the most, and a flat 10 if the four are level.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:105 and :497-501; payout at :1544-1548; global tally fed by getAllCrops at :220`
- **KILLS this line:** "crop 5–20c"
- **Lane impact:** L9/L10/L11: '5–20c' is the envelope, not the rule. Payout is count × price in one lump. Needs the four-clan crop tally as state, which is a server-sim surface the offline build must author.

### `[[economy/duel-token-badge-identity-is-still-unheld]]` — UPHELD [A1] (1 critic)

Which premium tile is item 2125 ('10 Duel Tokens') cannot be settled from the artifacts in this packet, and two surveyed claims give opposite answers. In the 48:04 shop the skull icons split into two families: three GREY skulls at badges 5 / 10 / 15 and two GOLD skulls at badges 1 and 10. The DUEL TOKENS counter in the same frame's top bar uses a WHITE/GREY skull, which points at the grey family (badges 5/10/15 against heavenlyprice 1/2/3, a clean x5) — but the tile order that a PremiumData-derived mapping produces points at the gold family instead. Until a hover tooltip names one of the five skull tiles, this is STILL_UNHELD.

- **Cite:** `self-extracted reference/videos/Nr4fQstqHDM.mp4 t=2884s: rows-1-2 crop (185,260)-(950,640) 2x LANCZOS and DUEL TOKENS HUD crop (1500,120)-(1750,230) 4x LANCZOS; heavenlyprice rows at reference/extracted/itemdata.xml:375-379 (2125=1), :389-393 (2126=2), :403 (2127=3), :28-32 (2100=1), :42-46 (2101=2), :56-60 (2102=3)`
- **Build:** web v0.717
- **Lane impact:** L3/L10 — do not bank any per-SKU premium price that depends on the skull-tile mapping. The three badge-1 tiles remain a fact; naming the third one does not. Closing this needs one hover tooltip over a skull tile from any shop session in either longplay.

### `[[economy/fast-travel-costs-5-gold]]` — UPHELD [A1] (1 critic)

Quest fast-travel ('TAKE ME THERE') costs 5 heavenly gold — a premium-currency SINK absent from the survey's economy model, which enumerates coin faucets carefully and never enumerates gold sinks at all.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=21:35, QUESTS journal, LOCATION row; crops (1290,440)-(1700,560) x4 LANCZOS for the button and (1650,450)-(1790,530) x7 LANCZOS for the cost badge.`
- **Lane impact:** L9 (WORLD) / L10: gold sinks must be enumerated alongside the faucets before any offline gold-faucet rate can be designed. Known sinks so far: premium shop purchases, gold->coin conversion (200 coins in web), paid storage (+10 weight per 1 gold, BankUI.as:264), and now quest fast-travel at 5 gold per jump.

### `[[economy/five-x-is-a-direction-not-a-multiplier]]` — UPHELD [A2] (1 critic)

The 5× gold redenomination is real as a DIRECTION but is not a uniform multiplier — three artifacts break it, including the very frame the 5× claim cites.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t61s0§.as:100 vs reference/decompiled/shs3_android/scripts/XMLShopItem.as:102; §1t410s0§.as:140 vs PayUI.as:131; reference/decompiled/shs3_android/scripts/ShopUI.as:421; self-extracted frame reference/videos/Nr4fQstqHDM.mp4 t=48:04 crop=800:340:180:260 ×2.5`
- **Lane impact:** L3/L10/L11: DO NOT apply the surveyor's 'multiply every <heavenlyprice> by 5' porting rule — it mis-prices items 2208 (coin pack) and 2209 (Full HP and Chi) at 5 gold where the film shows 1. Correct rule: the held itemdata is Android-denominated; a v0.717 gold price must be re-derived per SKU with the film as arbiter and every un-filmed SKU labelled INFERRED. The direction (web gold ~5× finer) is safe: rebirth 5/20 -> 25/100, convertgold 1000 -> 200, IAP tiers 1-4 all exactly 5×.

### `[[economy/guest-start-3-gold-confirmed]]` — UPHELD [A2] (6 critics)

The frame-sourced guest wallet '100 coins / 3 gold' is confirmed verbatim by the web payload's initNewPlayer; the Android build's 0 gold is what made the prior survey call it a live contradiction.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007 (initNewPlayer), wallet block :1023-1028 — positionally identical to reference/decompiled/shs3_android/scripts/StatsManager.as:692-711 (same 21 assignments, same order, same default args 4017/11017/12017)`
- **Lane impact:** L9/L10: src/config/profile.ts:10's deferred '(100 coins / 3 gold)' is now A2-confirmed and can be seeded. PROFILE_START_POOLS {hp:10, chi:10, ap:30} also matches verbatim.

### `[[economy/heavenlyprice-has-no-multiplier]]` — UPHELD [A2] (1 critic)

heavenlyprice reaches the shop badge UNMODIFIED in both builds, and the web and Android itemdata are the same bytes — so the frame-vs-payload premium-price gap cannot be a build denomination and the on-disk itemdata is simply not the shipped v0.717 file.

- **Cite:** `parse: reference/decompiled/shs3_android/scripts/XMLItem.as:94-96 = reference/decompiled/shs3_payload/scripts/§1t104s0§.as:92-94; shop item: XMLShopItem.as:37,123 = §1t61s0§.as; render: ShopUI.as:393 = §1t6519s0§.as:466; store: ShopItem.as:62-65. Byte-diff: reference/extracted/itemdata.xml vs reference/extracted/android/111_Mobile_ItemData.bin`
- **Lane impact:** L3/L10/L11: do NOT apply any constant scale to <heavenlyprice>. <baseprice>/<weight>/<modifier> port as-is, but premium gold prices are UNHELD except where a frame reads them directly (Writ/Amnesia/Name-Change 25g, outfit boxes 60g, Present 5g, duel-token packs 5/10/15g, coin+refill SKUs 1g). Item 2208 is the coin SKU (special-cased by id at ShopUI.as:428 and §1t6519s0§.as:387) and its web payload is 200 coins, matching convertgold.

### `[[economy/itemdata-line-identical-across-builds]]` — UPHELD [A2] (1 critic)

reference/extracted/itemdata.xml (web) and reference/extracted/android/111_Mobile_ItemData.bin are line-for-line identical — 10,546 lines each, zero diff hunks after stripping the XML declaration — so item stats port as-is, which is precisely what makes the filmed premium-price mismatch a live-server-data problem rather than an android-build problem.

- **Cite:** `reference/extracted/itemdata.xml vs reference/extracted/android/111_Mobile_ItemData.bin, unified diff run this review`
- **Lane impact:** L3: <baseprice>/<weight>/<modifier>/<defense> may be ported without a build caveat — the two builds ship the same file. But the same fact removes 'it's the android data' as an explanation for the filmed 10/15/60 gold badges, forcing the DIVERGENT label in N1.

### `[[economy/no-multiplier-in-web-shop-chain]]` — UPHELD [A2] (1 critic)

The web v0.717 shop prints the gold badge as the raw <heavenlyprice> value with no transform anywhere in the chain, so any 'shipped prices are N× the rows' law is impossible and the true correction is that the extracted itemdata's heavenlyprice column is divergent from the filmed build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:94 → §1t61s0§.as:35 → §1t394s0§.as function §1t6868s0§`
- **Lane impact:** L3/L10/L11: do NOT multiply <heavenlyprice> by anything. Label the premium price column DIVERGENT in DIVERGENCES.md and re-derive per build. The web ShopItem class is §1t394s0§ — add it to the class map (found by the surviving timeline instance names 'coin' and 'gold').

### `[[economy/no-web-itemdata-exists]]` — UPHELD [A2] (1 critic)

The web v0.717 build ships NO data XML at all — it URL-loads itemdata/npcdata/questdata/skilldata from the dead server — so all four data XMLs on disk are Android v0.682 blobs and the S0-3 provenance caveat lifts for AS3 ONLY, never for data.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:334 (and :357, :388, :420, :453, :479, :505, :528, :554, :580, :606, :632, :658) vs reference/decompiled/shs3_android/scripts/Mobile_ItemData.as:5; byte-proof: reference/extracted/itemdata.xml == reference/extracted/android/111_Mobile_ItemData.bin minus its 40-byte declaration and one trailing CRLF`
- **Lane impact:** ALL DATA LANES (L1 quests, L2 skills, L3 items, L4 npcs, L10 economy): the 'this is the Android build' caveat is NOT removable. Every row ported out of itemdata/npcdata/questdata/skilldata is v0.682 and must be labelled so. The surveyor's claim economy/web-payload-is-decompilable says the opposite in its headline sentence and must be corrected before any lane consumes it. It also means the ONLY route to a v0.717 number is the film.

### `[[economy/premium-15g-apparel-tiles-are-training-gear-with-no-0682-row]]` — UPHELD [A1] (1 critic)

The two 15-gold apparel tiles in the 48:04 premium shop are TRAINING HELMET and TRAINING GARMENT — tooltip-named on film — not items 7034 Assassin Hood and 4065 Assassin Robes. Neither name exists anywhere in the 2,533-entry android v0.682 string table, and neither has an itemdata row, so no heavenlyprice ratio can be computed for them in either direction. The contrast is sharp and useful: SANTA HAT and SANTA SUIT, also priced at 15 gold in the same shop session, DO have rows (items 7067 and 4069, both `<heavenlyprice>3</heavenlyprice>`), and 3 x 5 = 15 — the x5 prior holds cleanly for them, and for the Santa Outfit box (item 2133, heavenlyprice 12, filmed at badge 60). So the frame overturns the tile-to-id mapping, not the x5 prior.

- **Cite:** `self-extracted reference/videos/Nr4fQstqHDM.mp4, hover tooltips sampled every 2 s over t=2860-2920, crop 1100x220 at (1250,230); plus the t=2884s grid crop (185,260)-(950,1035) 2x LANCZOS; rows at reference/extracted/itemdata.xml:5373-5378 (7067 Santa Hat), :3156-3160 (4069 Santa Suit), :561-566 (2133 Santa Outfit); names in docs/gauntlet/L0/index/strings.json["4207"], ["4203"]`
- **Build:** web v0.717
- **Lane impact:** L3/L10/L11 — STANDING INVARIANT APPLIED: the frame beats the PremiumData-order inference. Delete '7034/4065 hp=3 -> 15' from the premium price table and put Training Helmet / Training Garment in the DIVERGENT column: they are filmed v0.717 SKUs with no v0.682 row, carrying a SOUL-INFUSED / 'levels up as you gain XP' mechanic and a LEVEL badge that no extracted data source describes. Santa Hat 7067, Santa Suit 4069 and Santa Outfit 2133 are the opposite case and can be banked at x5.

### `[[economy/premium-price-exception-set]]` — UPHELD [A1] (1 critic)

Three premium SKUs are priced at 1 heavenly gold in the shipped web build despite the x5 pattern holding for the other thirteen visible tiles — the coin pack, the full-heal and the 10-token pack — so premium prices must be read per item from frames, not multiplied.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=2884s (48:04), premium BUY shop, 1920x1080; crop (185,260)-(950,1035) upscaled x2 LANCZOS covering all 16 tiles; item identities from reference/extracted/android/121_Mobile_PremiumData.bin <default> order + docs/gauntlet/L0/index/resolved_names.json`
- **Lane impact:** L3/L10/L11: replaces the refuted blanket 'multiply heavenlyprice by 5' instruction. Use x5 as a working prior for gear and consumables, x1 for the three currency/utility SKUs, and treat every premium price as frame-sourced. Corroborating mechanism: item 2208's name string is still literally '1000 coins' while the web art reads '200' and web §1t401s0§.as:952 pays 200 vs Android 1000 — the web build cut the coin PAYOUT instead of raising that item's gold PRICE.

### `[[economy/prosperity-tier-thresholds-recoverable]]` — UPHELD [A2] (1 critic)

The prosperity scale IS recoverable offline: town level is a step function of raw townProsperity at thresholds 500 / 1000 / 2000 / 4000, giving the five-tier ladder its absolute units.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:782-805`
- **KILLS this line:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L11 (META): overturns the economy survey's clause 'Only the -1000 ninja hire is a recoverable constant'. Four thresholds are now held, which fixes the UNITS of prosperity — a town spans 0 to 4000+, so the hard-coded -1000 ninja hire is a full-tier shock rather than noise, and the 5-tier ladder consumed at DungeonGenerator.as:1363-1555 is now anchored to absolute numbers. The offline sim can author per-event deltas against a correct scale instead of inventing one; the per-event magnitudes themselves remain server-side (QueryManagerBase.as:2259 posts to /town/updatetownprosperity.php), so this is PARTIAL, not HELD.

### `[[economy/quest-coins-are-the-biggest-early-faucet]]` — UPHELD [A1] (1 critic)

Quests do pay coins, via <reward><loot><id>0|1|11</id> rather than <outcome><id>11</id>, and at +30 per turn-in they are the largest single early-game coin payout in the game.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg, crop (490,340)-(760,460) upscaled ×5 LANCZOS`
- **Lane impact:** L1 (CAMPAIGN) / L10 (ECONOMY): the coin faucet enumeration must be re-opened with quests in it. Any offline balance pass that omits quest coins will under-fund the early game by roughly 60× the per-mob rate. Scan <reward><loot>, never <outcome>.

### `[[economy/quests-do-pay-coins]]` — UPHELD [A1] (1 critic)

Quest rewards DO pay coins — quest coin rewards live in <reward><loot> with ids 0, 1 and 11, not in <outcome> with id 11, so the coin-faucet set the survey declared closed is still open.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=21:35, QUESTS journal right-hand detail panel for SHIGENOI TOKIMASA'S QUEST; crop (950,700)-(1350,880) upscaled x4 LANCZOS. Corroborated at reference/decompiled/shs3_android/scripts/QuestLogUI.as:454-465 and :490-497, and at reference/extracted/questdata.xml (one <reward><loot><id>0</id><qty>30</qty></loot>).`
- **Lane impact:** L1 (CAMPAIGN) / L10 (ECONOMY): the survey's 'faucet set closes to mob loot rolls, duelist kills, chests, crops, trade goods, item sales, war rank-ups, daily prize, gold conversion' must reopen to include quest loot rewards. Quest reward parsing is portable today from QuestLogUI.parseReward: loot id 0 -> qty coins, id 1 -> 5*qty coins, id 11 -> qty coins, id 50007 -> qty town prosperity, everything else -> an item stack.

### `[[economy/quests-move-prosperity]]` — UPHELD [A2] (1 critic)

Quests are a player-side prosperity lever — a seventh prosperity event the survey's taxonomy omits.

- **Cite:** `reference/decompiled/shs3_android/scripts/HistoryItem.as:373`
- **KILLS this line:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L11/L1: the offline prosperity sim needs a quest->prosperity hook, not just the six server-driven town events. Magnitude (val1) is still server-side, so this narrows blocker ② rather than closing it.

### `[[economy/rebirth-payout-config-is-right]]` — UPHELD [A2] (6 critics)

The web build pays 25 heavenly gold per rebirth and 100 on the ninth (DAN==8), exactly matching src/config/economy.ts REBIRTH — while the Android build pays 5/20, so porting from the Android decompile would have injected a 5× error into an already-landed config.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2656 (web) vs reference/decompiled/shs3_android/scripts/StatsManager.as:2200-2208 (Android); config at src/config/economy.ts:54`
- **Lane impact:** L10/L11: REBIRTH.earlyGold=25 / tenthGold=100 upgrades from research-sourced to A2-sourced. MAX_DAN_RANK=10 corroborated twice — STAT_DAN increments only while <9 (0-indexed = 10 ranks) and the announcement string is literally parameterised with "10".

### `[[economy/reinforce-weapon-cost-is-a-held-constant-5000]]` — UPHELD [A1] (1 critic)

While judging the repair-cost finding: the Reinforce-Weapon cost is the opposite case and is fully HELD as a constant — 5000 coins plus 1 Silver Ore, hard-coded in the confirmation string with no substitution slot, and confirmed on camera. The economy lane can take it as CONTRACT.

- **Cite:** `docs/gauntlet/L0/index/strings.json["850"] plus reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg (1024x576, crop y=370-576 full width, x1.8 LANCZOS)`
- **Build:** web v0.717
- **Lane impact:** L7 economy / items-equipment — a second blacksmith service priced and witnessed by both payload and frame. It is also the control that makes payload/repair-weapon-cost-is-a-template-not-a-constant airtight: the authors baked the number in wherever a constant existed, so string 848's bare '[0]' is positive evidence of a formula, not a gap in the extract.

### `[[economy/sell-price-edge-cases]]` — UPHELD [A2] (1 critic)

Two shipped edge cases sit on top of the sell formula: item 13002 (the starter Branch) is force-priced at 0 in the sell list, and ShopUI.sellPercentage = 0.5 is dead code — onSell pays getSellAmt() unmodified.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58, :394-401, :536-540`
- **Lane impact:** L4 (economy) — prevents a builder wiring a 50% vendor haircut that the game never applies.

### `[[economy/trade-goods-arbitrage-loop]]` — UPHELD [A2] (6 critics)

A five-commodity buy-low/carry/sell-high arbitrage loop with a deterministic seeded price oscillator exists in both builds and appears in none of the ledger's four economy bullets.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1647-1676 (web) = reference/decompiled/shs3_android/scripts/InteractUI.as:1558-1586 (Android); tutorial tip at GameEngine.as:636`
- **Lane impact:** L9/L10: fully reproducible offline with the project's injected mulberry32 RNG, no server needed. buyGoods/sellGoods write stats 20054-20058. The seed-expression divergence between builds is an open item.

### `[[economy/tradegoods-web-seed-drops-node]]` — UPHELD [A2] (1 critic)

The web trade-goods price seed omits getCurrentNode(), which if literal makes every town quote the same daily price and would destroy the arbitrage loop the game's own tutorial tip advertises.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1676 vs reference/decompiled/shs3_android/scripts/InteractUI.as:1562`
- **Lane impact:** L9/L10: the survey's 'fully reproducible offline with mulberry32, no server needed' is premature for a v0.717 target. Someone must read the web call site to find whether a node offset is applied there; until then the arbitrage loop is reproducible only in the Android formulation. GameEngine.as:636's tip ('buy goods from a market and sell in another town') is the constraint the resolution has to satisfy.

### `[[economy/war-room-structure-costs]]` — UPHELD [A2] (6 critics)

War-Room structure build totals are HELD as payload rows — Forward Base 10000, Ladder 5000, Defense 10000, Town 10000 coins, donated in flat 500-coin chunks that each burn one war move.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:190-208 (per-structure totals); WarHexUI.as:1291-1302 and :1332-1386 (donation mechanics); WarHex.as:424/478/521/541 (same totals as maxcost); StatsManager.as:162 (WARMOVEINTERVAL)`
- **KILLS this line:** "War-Room structure coin costs absent from config"
- **Lane impact:** L11 (META + REBIRTH): src/config/economy.ts:60 buildDonationCap:500 is corroborated; the four totals are new to the repo. The Surface bullet stays TRUE of the repo — this is now a port task, not a knowledge gap. War moves regen 1 per real hour.

### `[[economy/web-build-does-embed-27-xml-data-blobs]]` — UPHELD [A2] (1 critic)

The web v0.717 build is not data-free. It embeds 27 XML/binary blobs: nineteen <animdata> tables (100-118), one <survivalmodedata> (119), one room-object definition file (93), five name tables (94-98) and one GIF89a (92). What it does NOT embed is the four gameplay tables — itemdata, skilldata, npcdata, questdata — which it URL-loads. Any restatement of 'the web build ships no data XML at all' must be narrowed to those four or it contradicts the Stage-0 S0-1 inventory.

- **Cite:** `header dump of all 27 files in reference/extracted/bindata/ (first 60 bytes each); reference/extracted/bindata/119_1t4646s0.bin; reference/extracted/bindata/92_1t4648s0.bin; load sites at reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:334,357,453,479,505,528,554,580,606,632,658,683`
- **Build:** web v0.717
- **Lane impact:** Cross-lane bookkeeping — animation timings, the survival-mode table, room-object definitions and the NPC name generator ARE web-side v0.717 artifacts and do not carry the 0.682 caveat. Only itemdata/skilldata/npcdata/questdata do.

### `[[economy/web-build-has-unresolvable-content]]` — UPHELD [A1] (1 critic)

The filmed web build contains item content the android 0.682 string table cannot name at all, proving the S0-3 provenance caveat is a live hazard rather than a formality.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04 self-extracted 1920×1080, tooltip panel right of the grid (approx (1100,250)-(1780,820)), read at 1280-wide render; cross-checked against reference/extracted/android/118_Mobile_Lang_EN.bin via docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L3/L10: a soul-infused item-levelling system is visible on film and absent from every extracted data source. Any lane porting item names or premium SKUs from resolved_names.json must label them ANDROID 0.682 and expect gaps against the filmed build.

### `[[economy/web-build-ships-no-game-data]]` — UPHELD [A2] (1 critic)

The web v0.717 payload contains NO item, skill, npc or quest data — it fetched all four tables from the dead Player.IO backend — so every reference/extracted/*.xml on disk is Android v0.682 data and the §0 S0-3 build caveat can never be retired by diff, only by frame.

- **Cite:** `reference/extracted/payload.xml byte offsets 19403382 ('heavenlyprice') and 19503662 ('itemdata') — each the ONLY occurrence in 329 MB, both inside an AS3 string constant pool listed between 'baseprice' and 'minlvl'; plus the 27-file header dump of reference/extracted/bindata/`
- **Lane impact:** ALL LANES (L1 campaign, L3 items, L4 enemies, L5 skills, L10, L11): every row ported out of reference/extracted/*.xml must be labelled clientVersion 0.682. Four independent web-vs-disk divergences are already known — item 2208 pays 1000 coins on disk and 200 on film/code; the premium gold ladder is 5×; 'Soul-Infused'/'Training Garment' are on the web frame but score 0 hits in 118_Mobile_Lang_EN.bin; quest loot id 50007 (town prosperity) renders in the client and appears 0 times in the 0.682 questdata. Where a frame exists, the frame is the ONLY web-side authority.

### `[[economy/web-iap-usd-tiers-are-identical-to-android]]` — UPHELD [A2] (1 critic)

The web v0.717 PayUI carries the SAME five USD price points as android v0.682 — 4.99 / 9.99 / 14.99 / 19.99 / 24.99 — in its non-Kongregate branch, alongside a 50/100/150/200/250 KREDS ladder for the Kongregate branch. That is what makes the gold change a pure redenomination: identical real money buys 5x more nominal heavenly gold on web, and that gold buys 1/5 the coins. Neither surveyed claim cites this line, though one asserts it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:323-338 against reference/decompiled/shs3_android/scripts/PayUI.as:137-141`
- **Build:** both
- **Lane impact:** L10/L11 — the USD anchor is build-invariant, so real-money value per tier is the correct cross-build unit and nominal gold is not. It also fixes the top-tier anomaly's meaning: web tier 5 gives 400 gold for the same 24.99 that buys 75 android gold, a 5.33x bonus tier rather than a broken multiplier.

### `[[economy/web-payload-has-no-itemdata-table]]` — UPHELD [A2] (1 critic)

The web v0.717 payload contains NO itemdata table at all — only the parser's field names in the SWF string constant pool — so every data XML on disk is Android v0.682 provenance and the S0-3 build caveat must stay on data even though it can be dropped for AS3.

- **Cite:** `reference/extracted/payload.xml, single occurrence of 'heavenlyprice' at byte offset 19403382 of 329520665; reference/extracted/itemdata.xml vs reference/extracted/android/111_Mobile_ItemData.bin`
- **Lane impact:** ALL LANES (L1-L11): narrows claim economy/web-payload-is-decompilable. AS3 can now be cited from the web build, but itemdata/npcdata/skilldata/questdata are Android-provenance and the web build fetched its tables from the dead Player.IO server. This is the root cause of the heavenlyprice-vs-frame mismatch, and it means any DATA number ported from reference/extracted/*.xml must still be labelled Android v0.682 and frame-checked before use.

### `[[economy/web-trade-goods-seed-resolved]]` — UPHELD [A2] (1 critic)

RESOLVES the surveyor's PARTIAL: the web v0.717 trade-goods price seed is getServerDate() × commodityIndex, with the getCurrentNode() factor DROPPED — so in v0.717 every town shows the same commodity price on a given day and cross-town arbitrage does not exist.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1676 (and display path :1706); identity proofs at §1t401s0§.as:1641, §1t401s0§.as:796 and §1t7216s0§.as:256 against reference/decompiled/shs3_android/scripts/InteractUI.as:1552, :1562 and XMLShopData.as:101-102`
- **Lane impact:** L9/L10: the trade-goods loop is fully reproducible offline with mulberry32 — but the v0.717 rule makes prices node-INDEPENDENT, which contradicts the tutorial tip at GameEngine.as:636 ('buying goods from a market and selling in another town'). The rebuild must pick one and label it in DIVERGENCES: v0.717 fidelity (no cross-town arbitrage, only cross-day) or v0.682 behaviour (node in the seed). This is now a decision, not an unknown.

### `[[frames/HUNT-duel-refresh-token-delta]]` — UPHELD [A1] (1 critic)

During the duel-list REFRESHING... modal the token widget renders TWO values where the settled screens render one, which is an animated 10-token delta on the refresh action. Direction is unresolved from three frames, so this is a lead for a dense re-extract, not a number to bank.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0016.jpg (crop 50,60-220,180 @6x), against frame_0017.jpg and frame_0018.jpg (same crop)`
- **Build:** web v0.717
- **Lane impact:** meta-social, economy: probable 10-token refresh cost; needs a dense re-extract of seg-03 around t(frame_0016) to settle the direction

### `[[frames/death-card-offers-free-respawn]]` — UPHELD [A1] (2 critics)

The shipped v0.717 death card offers exactly two buttons, 'LEAVE AREA' and 'FREE RESPAWN', neither of which exists in the android string table — contradicting the banked reading of LoseUI as a revive-for-gold paywall as the player-facing path.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg (crop 340,240-690,380 @6x)`
- **Build:** web v0.717
- **Lane impact:** ui-hud, economy: contradicts banked claim ui-hud/respawn-costs-one-heavenly-gold as the only death path

### `[[frames/repair-weapon-cost-still-unheld]]` — UPHELD [A1] (2 critics)

The blacksmith service menu including REPAIR WEAPON is on film, but neither longplay ever selects it, so the Repair-Weapon cost is still not held from any frame.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0041.jpg (crop 0,340-620,576 @3.2x)`
- **Build:** web v0.717
- **KILLS this line:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** economy: §4 blocker ③ stays open from the frame corpus

### `[[hunter05/third-baseprice-exception-item-11037]]` — UPHELD [A2] (1 critic)

There is a THIRD exception to 'every Gold item writes <baseprice>0</baseprice>', beyond items 2212 and 7049: item 11037 carries a literal period as its baseprice.

- **Cite:** `reference/extracted/itemdata.xml:6897-6902`
- **Build:** both
- **Lane impact:** L6 economy — an XMLItem parse edge case (`xml.baseprice.toString() != ""` is true for '.', so gvalue coerces to 0 rather than firing the 1-coin default). Completes the counterexample census to 303 = 300 + 1 + 2.

### `[[itemdata-hunter/npc-loot-ids-are-not-only-an-enum]]` — UPHELD [A2] (1 critic)

NPC <loot><id> carries raw item ids as well as the 0-3 enum, and the malformed <hair> run claim #27 flags is systemic rather than a one-off. Measured over all 495 <npc> rows the loot-id histogram is 0 x77, 3 x28, 2 x10, 1 x10, 2113 x2, 2112 x2, 2114 x1, 20028 x1 — six rows fall through to the else branch, addLootItemBasic(lootType, qty), i.e. 'drop item #lootType'. Separately, the malformed id run '6015.6017' recurs in 355 of the 495 <mcs> blocks (the collapsed float '6.5006501650265E+47' really is a single occurrence).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:854-856; reference/extracted/npcdata.xml:31 and my parse of all 495 <mcs> blocks`
- **Build:** android v0.682 (web twin §1t68s0§.as:875-879 identical)
- **Lane impact:** L-enemies-ai / L-economy: the drop model needs a fifth case (fixed item by id) that claim #9's four-case summary omits, and the art fallback to part '0' fires on 355 NPCs, not on a handful.

### `[[itemdata-hunter/sellpercentage-is-dead-data]]` — UPHELD [A2] (1 critic)

ShopUI's sellPercentage = 0.5 is declared and never read — do not apply it on top of getSellAmt(). Claim #26 cites the line without saying it is unreferenced, which invites a 50% haircut the original never applies. grep across the entire Android bundle returns exactly one occurrence (the declaration), and the only consumer of the sell price calls getSellAmt() unmodified.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58 and :401`
- **Build:** android v0.682
- **Lane impact:** L-economy: the sell price is exactly (1 + modifierCount) x 10 or x 5 with no percentage applied. Guards against a 2x error in every sale.

### `[[itemdata/dot-baseprice-bug-is-inert]]` — UPHELD [A2] (1 critic)

The <baseprice>. bug on item 11037 'Santa Pants' has no observable consequence: the item also carries <heavenlyprice>3</heavenlyprice>, and every other Gold-priced row in the file writes <baseprice>0</baseprice>, so int('.') = 0 produces exactly the value the row was meant to have. There is no 'reproduce or deviate' decision with a stake in it.

- **Cite:** `reference/extracted/itemdata.xml:6897-6906 (item 11037 in full); reference/decompiled/shs3_android/scripts/XMLItem.as:14 (public var gvalue:int) and :86-93`
- **Build:** both (schema parity proven)
- **KILLS this line:** "itemdata/baseprice-dot-data-bug: 'a 1:1 recreation has to decide to reproduce or deviate, not silently fix'"
- **Lane impact:** L6 economy: itemdata/baseprice-dot-data-bug is factually correct but its 'a 1:1 recreation has to decide' framing overstates the stake — the bug is inert. Worth carrying so the lane does not spend a decision cycle on it.

### `[[itemdata/sellpercentage-is-dead]]` — UPHELD [A2] (1 critic)

ShopUI's sellPercentage = 0.5 has zero readers anywhere in the Android tree. Sell price is getSellAmt() alone; a recreation must not multiply by 0.5 on top of it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58; exhaustive grep -rn "sellPercentage" reference/decompiled/shs3_android/scripts/ returns that one line`
- **Build:** android v0.682
- **KILLS this line:** "itemdata/sell-price-formula cite includes 'ShopUI.as:58 — internal var sellPercentage:Number = 0.5'"
- **Lane impact:** L6 economy: itemdata/sell-price-formula cites sellPercentage alongside the real formula; flagging it as dead prevents a 2x error in the sell path. Same dead-constant pattern as MCSPlayer.baseReload — this bundle carries several computed-then-discarded values, so every constant a lane adopts should be grep-checked for readers.

### `[[parity/writ-of-release-is-25g-in-web-and-5g-in-android]]` — UPHELD [A1] (1 critic)

A fourth hard, enumerable v0.682<->v0.717 divergence: the Writ of Release costs 25 gold in the shipped web client and 5 heavenly gold in the android data. The same 5x gap applies to the whole premium scroll tier - Amnesia Scroll (2200), Name Change Scroll (2207) and Clan Deed (2212) are all heavenlyprice 5 in android itemdata while the web shop grid badges its scrolls at 25. This CONFIRMS REBUILD_READINESS.md:216 rather than overturning it, and it is the concrete demonstration that C2's undischarged parity caveat has teeth on ECONOMY numbers, not just UI copy.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg (1024x576; detail-panel crop (330,95)-(1000,230) x3 LANCZOS, grid crop (330,55)-(620,300) x5 LANCZOS) vs reference/extracted/itemdata.xml:2328-2335`
- **Build:** web v0.717 (contrasted with android v0.682)
- **Lane impact:** L4/L0 economy + all lanes citing the four XMLs: any price ported from reference/extracted/{itemdata,skilldata,npcdata,questdata}.xml is v0.682-grade and may be off by a whole tuning pass. This is the first measured case where an android XML value would have corrupted a correct web-build CONTRACT.

### `[[string-table/global-effect-titles-a-different-dialog]]` — UPHELD [A2] (1 critic)

String 288 'Global Effect' is the title of GlobalVarDialog — the server-global-variable popup shown after selling crops — not a field on the Rare Crops Collection screen, which is string 282 and holds exactly six slots.

- **Cite:** `reference/decompiled/shs3_android/scripts/GlobalVarDialog.as:47,80 + InteractUI_crops.as:69,260 + InteractUI.as:1552-1553`
- **Build:** android v0.682
- **Lane impact:** economy — refutes the 'Global Effect' half of string-table/crop-market-is-supply-and-demand and replaces it with the real structure: crop sales write a per-clan server global at key 50000+house, and a dialog titled 'Global Effect' reports the aggregate. The Rare Crops Collection is a separate 6-slot completion screen rendering count/6 as a percentage. Neither is banked.

### `[[string-table/inn-rest-is-a-floor-not-a-faucet]]` — UPHELD [A2] (1 critic)

Resting at an inn does not ADD AP — it sets AP to exactly maxAP/3 only if the player is BELOW maxAP/3, so a player already above a third gets nothing and resting can never raise AP above a third.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:293-298 + InteractUI.as:791-801`
- **Build:** android v0.682
- **Lane impact:** world-exploration + economy — corrects the string-table claim string-table/inn-restores-one-third-of-max-ap from 'a second AP faucet with a ceiling' to 'a floor-raise with a hard cap'. A rebuild implementing AP += maxAP/3 is wrong for every rested player above 33%. HP and Chi genuinely go to full (fullHealth()); AP does not. Zero corpus hits for ACTION_REST or MAXAP/3.

### `[[string-table/inn-restores-one-third-of-max-ap]]` — UPHELD [A2] (2 critics)

Resting at an inn restores HP and Chi in full but AP only 'up to a third of your maximum' — a hard fractional ceiling that is a second, independent AP faucet alongside the banked 1 AP / 60 s regen, and the reason Soldier Pills and the 1-gold AP purchase stay commercially viable.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:1487 + docs/gauntlet/L0/index/strings.json["512"]`
- **Build:** android v0.682
- **Lane impact:** world-exploration + economy — blocker ④ (AP regen rate + cap) is already closed at 1/60 s elsewhere; this adds the inn faucet's cap rule, which the banked work does not carry. Camp and Rest verbs remain unmeasured.

### `[[string-table/war-turn-expiry-resets-moves-to-max]]` — UPHELD [A2] (1 critic)

When the 'Next turn in' countdown expires the client SETS war moves to getMaxWarMoves() rather than incrementing them, so a turn is a full refill window and unspent moves do not accumulate.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarUI.as:525-547`
- **Build:** android v0.682
- **Lane impact:** meta-social — supplies the missing half of string-table/war-turn-is-clock-driven: the string proves it is a countdown, this proves what the countdown DOES. Combined with the banked getMaxWarMoves() ladder (3,4,4,4,4,5,5,5,5,5,6 by rank, meta-social.md:288) the move economy is fully specified except the period, which is a server delta (timediff) and stays unheld.

### `[[uistrings-payload/bets-are-tokens-paid-out-in-gold]]` — UPHELD [A2] (1 critic)

The betting help panel states the currency crossing — you stake TOKENS and are paid GOLD, profit = stake × odds, and odds float until the book closes — corroborated by the code's 0.1 quantisation (which is what makes '1.5 odds' expressible) and its acceptingbets flag.

- **Cite:** `reference/extracted/payload.xml:533246`
- **Build:** web v0.717
- **Lane impact:** economy — an explicit token→gold conversion path the ledger's currency model does not have. PARTIAL because this is authored TextField copy under claim uistrings-payload/uistrings-is-design-time-not-shipped: the label id is getString(11003), web-only and unresolvable, so the SHIPPED wording is unheld even though the mechanic is proved by §1t396s0§.as:222-239.

### `[[uistrings-payload/rake-branch-tests-the-pool-not-a-nan]]` — UPHELD [A2] (2 critics)

The betting rake branch decompiles at §1t396s0§.as:230 as `if(_loc10_ > 100)` where _loc10_ is declared NaN at :121 and never assigned — an FFDec register-aliasing artifact that would make the whole rake rule read as dead code — and the second copy of the same routine in the same file, at :545 `if(_loc7_ > 100)` with _loc7_ = pool at :537, proves the branch really tests the pool.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:545`
- **Build:** web v0.717
- **Lane impact:** economy — PROTECTS this unit's duel-betting-book-is-web-only-with-full-odds-math from being wrongly refuted on re-derivation. Anyone who opens only :230 will conclude the 0.80/0.85 rake tiers are unreachable. They are not: the duplicate at :537-554 is unobfuscated on that variable. Standing lesson for every lane reading FFDec output — a `_locN_` that is declared NaN and never assigned is an artifact, not a fact; look for a second copy of the routine before grading the logic.

### `[[uistrings-payload/web-ui-string-ids-outrun-android-table]]` — UPHELD [A2] (1 critic)

The web v0.717 client calls 1,313 distinct getString(N) UI-string ids but the Android v0.682 table resolves only 765 of them — 548 (41.7%) are absent, concentrated in two web-only blocks 11000-11515 (339 ids, 41 classes) and 22000-22104 (93 ids, 19 classes) — so 42% of the web build's interface copy is UNHELD, not merely 'build-labelled', while the Android client's own 771 ids all resolve.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t396s0§.as:80`
- **Build:** web v0.717 vs android v0.682
- **KILLS this line:** "STAGE-0b FINDING S0-3: 'MEASURED resolution: itemdata 804 rows / 0 unresolved · skilldata 73 / 0 · npcdata 484 / 6 (all one missing id, 5017).'"
- **Lane impact:** ui-hud, meta-social, economy — corrects Stage-0b S0-3: the shared 2000-8xxx id space makes the DATA XMLs fully resolvable, but the UI id space diverges hard. strings.json's largest numeric key is 9010, so nothing in the 11000/22000 blocks can be ported at all; those strings live only in the never-archived shs3_en.xml under /lang/ (payload.xml:120326). Every lane must check the web client actually calls an id before porting its Android text.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
