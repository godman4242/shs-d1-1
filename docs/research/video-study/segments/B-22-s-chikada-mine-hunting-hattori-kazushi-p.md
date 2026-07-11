# B-22 S Chikada Mine: hunting Hattori Kazushi pt2 (57:49–57:57)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)
The entire 8s window is the player pausing to open the **PLAYER** panel (inventory/stats overlay) — no mine/hunt gameplay is visible in this particular clip; all 16 frames show the same modal. Layout, dark brown/black parchment-style background with a faint silhouetted tree/figure on the right:
- Top-left title "PLAYER" (t=57:49), top-right red X close button.
- Header row: username **SOUND360TM**-adjacent currency readouts: green "coins" icon + **720 COINS**, gold coin icon + **2 GOLD** (t=57:49).
- Level badge: circular fan/level icon showing **10** next to XP bar **26234 / 31400 EXPERIENCE POINTS** (t=57:49) — confirms level 10 per map context.
- "AVAILABLE STAT POINTS: 0" top-right (t=57:49).
- Left column: paper-doll equipment slots — head (green-bordered cap icon), face/mask (empty, white outline), chest armor (green), hand-wraps (empty, white outline), cloak/cape (blue), off-hand weapon (purple sword), two ring slots (yellow ring, empty grey), boots (blue), belt/misc (grey ring).
- Center column ("weapon" sub-panel): equipped weapon name **CLEAVER**, icon (purple-bordered dagger/cleaver), **LEVEL 5** caption, small chat-bubble icon (item info toggle) (t=57:49).
- Right column ("Condition" panel, only visible before toggling to STATS): **CONDITION: GOOD**, then stat lines: **DMG: 2 - 25 (EQ: 11 - 24)**, **HP REGEN: 0 (EQ: 1)**, **WATER ATK: 0 (EQ: 1)**, **EARTH ATK: 0 (EQ: 1)**, **WEIGHT: 12** (t=57:49–57:50). A red downward-triangle toggle sits at the right edge of this panel.
- Bottom-right: 8-slot inventory grid (2 rows x 4 cols), each icon rimmed by rarity-color border (grey/white = common, blue = uncommon, purple = rare/epic, green = ring/consumable-tier). **WEIGHT: 116 / 100** shown in red (over-capacity) at t=57:49–57:51.
- Two red action buttons at the very bottom: **EQUIP** and **DROP**.
- A **"DROP ITEM?"** confirmation dialog appears at t=57:51 (frame 5): gold-bordered box, **YES** / **NO** buttons (red).
- After confirming drop, the left/center columns swap to a **STATS** sub-view (clicking "STATS" tab at top-left of left column): **HP 20/30** (green bar), **CHI 47/47** (blue bar), **AP 30/40** (blue/grey bar), and derived stats **ATK 22**, **DEF 25 +10**, **SPD 19 +4** (t=57:52 onward). Weight recalculates to **104/100** (still red/over-capacity) immediately after the drop.
- Inventory count ticks down by one slot after the drop: at t=57:52 the grid still shows 8 items (weight 104/100); a small number under the CHI/AP bars decrements 30→29→28→27→26 across frames (t=57:52→57:56), consistent with weight-driven "carry" or stamina/AP-adjacent counter re-syncing after the drop (exact meaning of that lone number is ambiguous from this clip alone — no label visible).
- Scrolling the inventory grid down (red down-triangle, then up-triangle appears) reveals a second row of items at t=57:54–57:56: a red scroll/cylinder icon, a purple-bordered paper/scroll icon with a red wax-seal stamp and Japanese-style glyphs printed on it, a tan drawstring pouch icon labeled **"x5"**, a tan dog/wolf-pelt icon, and a dark round stone/pellet icon labeled **"x2"**.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)
- Player level **10**, XP **26234 / 31400** (t=57:49) — matches map-context claim of "player hits level 10."
- Currency: **720 Coins**, **2 Gold** (t=57:49) — two separate currency tracks confirmed (coins = common, gold = premium/rare).
- Equipped weapon "Cleaver," **Level 5**, damage range **2–25**, with a separate "(EQ: 11–24)" bracket shown alongside — reads as an "equipped/effective" damage range distinct from a base range (t=57:49). Likely UI convention: base stat vs. equipped-modified stat, both displayed together.
- HP Regen, Water ATK, Earth ATK all show **0 base / 1 EQ** (t=57:49) — implies a baseline elemental/regen stat of 0 with a flat +1 granted by gear, i.e., gear-derived floor of 1 even with no elemental investment.
- Weapon carry **Weight: 12** for the Cleaver alone (t=57:49); total inventory **Weight: 116/100** — player is over the 100 capacity threshold before any drop (t=57:49–57:51).
- Dropping one item reduces total weight from **116/100 → 104/100** (t=57:51→57:52), i.e., the dropped item weighed **12** — matching the Cleaver's own listed weight, suggesting the player dropped a duplicate/second copy of the same weapon type (a second sword icon disappears from the top-left inventory slot between frame 4 and frame 6).
- Stats panel: **HP 20/30**, **CHI 47/47** (full), **AP 30/40** (t=57:52) — three distinct resource bars (Health, Chi, Action Points), all separate from each other and from the weapon-name "Cleaver" which is a proper-noun rarity tier or class label, not directly tied to CHI.
- Derived combat stats: **ATK 22**, **DEF 25 (+10 from gear)**, **SPD 19 (+4 from gear)** (t=57:52) — additive gear bonus displayed in a smaller "+N" suffix next to the base number.
- A small unlabeled numeric readout beneath the CHI/AP bars ticks **30 → 29 → 28 → 27 → 26** across t=57:52→57:56 while nothing else on screen changes — most plausibly a live "seconds remaining" or repeating counter unrelated to the drop (possibly a background cooldown/regen tick, or frame-timing artifact of an idle counter in the corner of that sub-panel). Flag as uncertain; no label visible in this clip.
- Inventory shows a consumable pouch stack **x5** and a dark stone/pellet stack **x2** (t=57:54–57:56) — confirms stackable consumables exist with visible count badges.
- Purple-bordered scroll item with a red wax seal and Japanese glyph artwork appears in the inventory grid (t=57:54–57:56) — visually consistent with the map-context "Dojo Recall Scroll" (item was inspected per the map notes, though no tooltip/description text is visible in this particular 8-second window — the item is only shown as an icon, not opened).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)
No dialogue or story beats occur in this clip — the player is paused in the inventory screen, managing gear (dropping a duplicate weapon) rather than fighting or talking to NPCs. This appears to be a mid-hunt inventory-management pause during the broader "hunting Hattori Kazushi pt2" bounty sequence described in the map context; the actual combat/dialogue with the bounty-hunter pair and the wolf happens outside this specific 8-second window.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)
- No combat, camera movement, or FX in this clip — it's a static full-screen UI overlay held for the entire 8 seconds while the player browses tabs and confirms a drop.
- The only "animation" is the modal transition for the DROP ITEM? confirmation dialog (appears/disappears) and the STATS/inventory tab swap, both instantaneous cuts with no visible tween in the sampled frames.
- Pacing note: even mid-dungeon, the player is comfortable pausing to fully open and scroll a multi-tab inventory UI — implies the mine/hunt is not a real-time-pressured combat state at this moment (game fully pauses or at least the encounter allows safe menu access).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)
- Confirms a **dual-currency economy** (coins + gold) and a **level/XP** system with large XP totals at level 10 (26234/31400) — useful anchor for calibrating an XP curve config.
- Confirms **three player resource bars**: HP, CHI, AP (distinct pools) — CHI and AP are separate resources, not the same thing; worth cross-checking against `src/config/` resource definitions to ensure both are modeled, not just HP.
- Confirms a **weight/encumbrance system** with a hard visible cap (100) and a red-highlighted over-capacity state (116/100, 104/100) — recreation should include a carry-weight config value and an "over capacity" UI/gameplay penalty flag (this segment doesn't show what the penalty actually does — worth chasing in another segment where the player is over capacity in the field, if it affects SPD etc.).
- Confirms **base vs. equipped-bonus stat display convention** ("25 + 10" for DEF, "19 + 4" for SPD, and "0 (EQ: 1)" for elemental/regen stats) — a UI pattern worth matching: show raw stat plus a separate "+N from gear" delta rather than only a pre-summed total.
- Confirms **stackable consumables with count badges** (x5 pouch, x2 stone) — inventory data model needs a `stackCount` field, not just unique item instances.
- The **Dojo Recall Scroll** item (per map context) is present in inventory as a purple-rarity icon with wax-seal/Japanese-glyph art in this clip, but its tooltip/description text was not opened in this window — do not fabricate its exact wording from this segment; needs a follow-up segment where the tooltip is actually shown to get the "teleport to nearest dojo, outdoors only" text verbatim-adjacent for paraphrase.
- Maps to whatever build stage owns the **inventory/equipment UI and stat-panel HUD** (a UI/economy stage, not core combat-sim) — no direct combat numbers (damage-per-hit, encounter duration) were observable in this particular clip despite the segment's "hunting Hattori Kazushi pt2" label; the actual bounty-hunter/wolf fight is not captured in this 57:49–57:57 window and should be chased in adjacent segments (e.g., segment B-21 or B-23) for those combat numbers.
- Nothing here contradicts existing repo config/spec docs; it *adds* data (weight cap, dual currency, CHI/AP split) that should be checked against `src/config/` for completeness.

## VERIFIED
