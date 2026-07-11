# A-13 Player screen: inventory + equip pants (25:20–26:50)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Pre-segment: duel HUD (t=25:22–25:52)**
- Top-left: "AUTO SLASH OFF" toggle button (brown/tan pill, rounded corners) + a speech-bubble "…" icon button beside it.
- Enemy nameplate above enemy sprite: `BANDIT LEADER (6)` in white text, small green HP bar underneath (drains to red-outlined empty as it loses HP).
- Player nameplate above player sprite: `GUEST` in yellow/gold text.
- Center-screen banner "FIGHT!" in red/orange gradient chunky outlined font at duel start (t=25:22).
- Bottom-left player HUD: circular portrait icon (red circular border, straw-hat samurai bust), green HP bar `20/20`→ drains during fight, blue Chi/stance bar `15/15`, and a stance label under it, e.g. "CANNOT CHANGE STANCE" (grey text) or "HEAVY STANCE" (seen later in overworld HUD, t=25:52).
- Bottom-right: 3 ability/skill icon slots in dark square frames — slot 2 shows a fire/flame icon with number `2` above it (cooldown or charge count), slot 3 shows a yellow up-arrow icon with number `3` above it; slot 1 is empty/black.
- Hit-combo counter top-right: red numeral + "HIT COMBO" label, appears as `1`, then `3` (t=25:38, t=25:45).
- Screen briefly flashes/tints deep red on hit-impact frames (vignette pulse), e.g. t=25:30, t=25:32, t=25:35.
- Victory: full-screen red silhouette wipe; large "YOU WIN" text in white-outlined red brush-stroke font, both fighters shown as black silhouettes, loser lying on ground at bottom-right (t=25:52).
- Reward popup (t=25:55): ornate wood/gold picture-frame modal, header "YOU RECEIVED" in gold text, left side `XP  164`, center a green-outlined item-slot icon (grey pants sprite), bottom a red "OK" button.

**Overworld HUD before opening Player screen (t=25:58)**
- Top-left: coin icon + `193` "COINS" label; below it a quest banner box: `N TOSHIBARA DUNGEON` header, sub-line `SIDE QUEST: GET WARM PANTS OF HEALTH FOR YOKO` (yellow/white two-line text in a dark rounded box).
- Top-center: red "REGISTER" button + white text "TO SAVE YOUR PROGRESS AND PLAY ONLINE!" (F2P nag banner).
- Top-right: diamond/XP icon with level number `4`, bar `5110 / 5150` "EXPERIENCE POINTS".
- Top-right below XP: a gold-framed minimap/compass panel showing a vertical dungeon-branch diagram with N/S/W/E labels, a highlighted node (torch/cup icon), and text `TERRITORY (22,51)` / `INSIDE SECTOR (3,1)`.
- Bottom HUD bar: portrait circle (green HP `9/20`, blue Chi `9/15`, "HEAVY STANCE" label), a red "+" button, then a row of icons: speech bubble "…", brown teardrop/map icon labeled `PLAYER` (this opens the Player screen), yin-yang icon, an item/scroll icon, a yellow rod icon, a grey blob icon, a small dark icon, and a gear/settings icon far right.
- Background: interior stone-brick dungeon corridor, wood support pillars, pottery jars/barrel props, a wooden bench, a green chest, a wooden signpost with "N" arrow.

**PLAYER screen (opened t=26:00 onward) — the core screen for this segment**
- Full-screen dark parchment/brown modal with a faint silhouette of the character in the background (right side), gold "PLAYER" title top-left, red "X" close button top-right.
- Top bar: red "STATS" tab button, coin icon `193` "COINS", gold-coin icon `3` "GOLD", diamond level icon `4` bar `5110/5150` "EXPERIENCE POINTS", right-aligned "AVAILABLE STAT POINTS: 0".
- **Left panel — paper-doll equipment**, header "GUEST" (character name), 3x3 grid of equipment slots around a centered character sprite:
  - Row 1: Head/hat slot (straw hat icon, filled) | Mask/face slot (empty, greyed skull-mask outline icon)
  - Row 2: Garment/body slot (grey robe icon, filled) | [character sprite center] | Gloves/hand-wraps slot (empty, greyed bandage-wrap icon)
  - Row 3: Pants/legs slot (white pants icon, filled — this is the equip target) | [center] | Weapon slot (pickaxe icon initially, filled)
  - Row 4: Ring slot L (empty, greyed ring outline) | Sandals/feet slot (worn-sandals icon, filled) | Ring slot R (empty, greyed ring outline)
  - Center character preview updates live: hat, robe (grey→tan/khaki after new garment shown), pants (white→dark purple/striped after equip), sandals, and equips a long blue-bladed dagger visibly on the back once the "Defender" weapon is equipped (t=26:35).
- **Right panel top — Stats block** (toggled via "STATS" tab): `HP  9/20` (green bar) → later `19/20`, `20/20`; `CHI  9/15` (blue bar, unchanged 9/15 whole segment); `AP  14/30`→`15/30` (blue bar) with a small number under it (12, 9, 49, 34, 27, 24, 19, 17 — appears to be a secondary counter, possibly total item weight-derived AP or remaining action points, changes each time an item is selected/inventory scrolls).
  - Right-right sub-block: `ATK 10`, `DEF 10 + 2` (base+bonus, changes to `10 + 3` after ring equip, `10 + 13` after Defender weapon equip), `SPD 4`.
- **Right panel bottom — Inventory grid**: 4 columns x 2 rows of item slots, up/down triangle scroll arrows on the right edge, "WEIGHT: 74 / 100" label above the grid (drops to `73/100` mid-segment after consuming an item).
  - When an item slot is clicked, the top-right stats block is replaced by an **item detail pane**: item name (color-coded — white/grey for common, purple for rare "Defender"/"Blue Silky Herb", green for quest/named "Warm Pants of Health"), item icon large, "LEVEL n" under icon, a small "…" comment/note icon, and a stat-delta readout on the right (varies per item type — weapon shows DMG/DEFENSE/WEIGHT, armor shows DEFENSE/WIND DEF/EARTH DEF/WEIGHT or MAX HP/HP REGEN, consumable shows description text, quest item shows "QUEST ITEM" + effect).
  - Bottom of item-detail pane: two red action buttons — "EQUIP"/"UNEQUIP" (left, toggles per equip state) and "DROP" (right); for consumables (Dojo Recall Scroll, Blue Silky Herb) the left button reads "USE" instead of "EQUIP".
- Inventory items observed in the grid across the segment (icons, in the order/slots seen): grey sandals/socks (Pants — green-bordered = equipped), purple leaf sprig (Blue Silky Herb — purple border = quest item), brown tree branch (weapon), yellow scroll (Dojo Recall Scroll), blue quill/dagger shape (Defender — purple border = rare weapon), white rice ball x3→x2 (Onigiri, consumable, count decreases), grey drawstring pouch x5 (unlabeled bag item, count static), a running dog/fox icon (companion item?), a black pebble/stone icon (unlabeled), a tan garment icon, a pickaxe icon (after unequipped from weapon slot), a katana icon, a white pants icon, a white cloak/robe icon.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Duel vs `BANDIT LEADER` level `(6)`, player HP starts `20/20`, Chi `15/15` (t=25:22).
- Player takes hits: HP drops 20→14 (t=25:30), 14→12 (t=25:32), 12→10 (t=25:38), 10→8 (t=25:42), landing around 8/20 before the finishing exchange (t=25:45–25:48). Chi drains in parallel 15→13→11 across the same hits (t=25:32–25:45), suggesting Chi (blue bar) depletes alongside HP during this duel (or is consumed by stance/skill use), not just from damage timing — exact mapping unclear but both bars fall in lockstep with each hit received.
- Hit-combo counter shown as `1 HIT COMBO` (t=25:38) then `3 HIT COMBO` (t=25:45) — combo counter increments per consecutive landed hit on the enemy.
- Fight ends in a "YOU WIN" result (t=25:52).
- Victory reward: `XP 164` + one item drop, later identified as pants (t=25:55).
- Overworld coin total after fight: `193 COINS`, `3 GOLD` (t=25:58 onward, static all segment).
- Character level `4`, XP `5110 / 5150` (static all segment — no level-up occurs in this window).
- Active side quest text: "SIDE QUEST: GET WARM PANTS OF HEALTH FOR YOKO" tied to "N TOSHIBARA DUNGEON" (t=25:58) — confirms the pants item dropped is the quest target.
- Minimap coordinate readout: `TERRITORY (22,51)`, `INSIDE SECTOR (3,1)` (t=25:58).
- Player screen opened: base stats at open — `HP 9/20`, `CHI 9/15`, `AP 14/30`, `ATK 10`, `DEF 10 + 2`, `SPD 4`, `WEIGHT: 75/100` (t=26:02, first frame of Player screen shows 75/100 before any inventory scroll, then settles to 74/100 the rest of the segment — likely a display item was dropped/consumed in between, or rounding on first paint).
- Selecting the equipped **Pickaxe** (already-worn weapon, icon boxed black = "worn" state): `CONDITION: GOOD`, "USED FOR MINING.", `DMG: 1 – 3`, `LEVEL 1`, `WEIGHT: 10` (t=26:08). Action button reads "UNEQUIP" (confirms it's currently worn).
- Selecting the new **Pants** item (green-bordered, unworn — the quest-relevant "Warm Pants of Health" candidate at this point still generically labeled "PANTS" before inspection... actually labeled "PANTS" then later "WARM PANTS OF HEALTH"): `DEFENSE: +1 (EQ: 0)`, `WIND DEF: +1 (EQ: 0)`, `EARTH DEF: +1 (EQ: 0)`, `LEVEL 1`, `WEIGHT: 5` (t=26:10). "EQ: 0" appears to denote the currently-equipped item's stat for comparison (0 = nothing equipped in that slot yet). Buttons: "EQUIP" / "DROP".
- Selecting equipped **Garment** (robe, worn/black-boxed): `DEFENSE: +1 (EQ: 1)`, `LEVEL 1`, `WEIGHT: 5` (t=26:15). Button: "UNEQUIP".
- Selecting equipped **Worn Sandals**: `WEIGHT: 1`, `LEVEL 1` (t=26:18, no stat line shown besides weight). Button: "UNEQUIP".
- Selecting unworn **Ring**: `WEIGHT: 1`, `LEVEL 1`, no other stat listed (t=26:22). Button: "EQUIP".
- After equipping the Ring, stats update: `HP 19/20`, `DEF 10 + 3` (was `10 + 2`) — ring grants **+1 DEF** (t=26:25). Paper-doll shows ring slot now filled (gold ring icon) and garment sprite color visibly shifts grey→tan/khaki in the character preview (likely just a palette variant of the same "Garment" slot re-rendering, not a new item).
- New consumable/companion icon (running dog/fox) appears in the inventory grid after this point (t=26:25 onward) — unclear if picked up mid-browsing or was already in a scrolled-off slot; no detail pane captured for it this segment.
- Consuming an **Onigiri** (rice ball): stack count drops `x3 → x2` (compare t=26:02 vs t=26:28), player HP rises to full `20/20` (t=26:28, up from 19/20), inventory WEIGHT drops `74/100 → 73/100` after this consumption (t=26:30) — implies onigiri restores HP (looks like an instant full/near-full heal or the remaining gap was small) and has weight 1 per unit (5 units of some other stacked item like the pouch `x5` stayed static, so the weight delta of −1 tracks with one onigiri consumed... though the icon shown for the reward panel doesn't explicitly confirm the exact heal amount beyond 19→20).
- Selecting a **Blue Silky Herb** (purple-bordered quest item): "QUEST ITEM", `HP: +1`, `WEIGHT: 1` (t=26:20 — actually captured at t=26:28 detail pane). Button: "USE"/"DROP".
- Selecting a **Dojo Recall Scroll**: "TAKES YOU TO THE NEAREST DOJO. (CAN ONLY BE USED OUTDOORS.)", `WEIGHT: 1` (t=26:25). Buttons: "USE" / "DROP".
- Selecting **"Defender"** (purple-named rare dagger, unworn): `CONDITION: GOOD`, `DMG: 10 – 15 (EQ: 4 – 8)`, `DEFENSE: +10 (EQ: 0)`, `LEVEL 4`, `WEIGHT: 5` (t=26:22, re-confirmed t=26:38 with same values). "(EQ: x–y)" again reads as "currently equipped item's value for comparison" — the equipped weapon (pickaxe) does 4–8 by comparison text even though its own detail pane earlier showed DMG 1–3 flat — inconsistency to note (possibly EQ range reflects pickaxe's level-scaled range at current level, not the flat base 1-3 shown standalone).
- Selecting **Branch** item: `DMG: 1 – 2 (EQ: 4 – 8)`, `WEIGHT: 1`, `LEVEL 1` (t=26:32). Buttons: "EQUIP"/"DROP".
- Equipping **"Defender"**: stats jump to `HP 20/20`, `CHI 9/15`, `AP 15/30`, `DEF 10 + 13` (was `10 + 3`) — Defender contributes **+10 DEF** on top of prior +3 (t=26:35). Character sprite now visibly carries a long blue-bladed weapon on its back, replacing the pickaxe.
- Finally selecting the **Warm Pants of Health** item (green item name, level 4, quest reward from the duel): full stat block reads:
  - `DEFENSE: +1 (EQ: 1)`
  - `MAX HP: +8 (EQ: 0)`
  - `HP REGEN: +2 (EQ: 0)`
  - `WIND DEF: 0 (EQ: 1)` (shown in red — meaning this stat is 0 or worse than currently equipped item's +1)
  - `EARTH DEF: 0 (EQ: 1)` (also red)
  - `WEIGHT: 5`
  - `LEVEL 4`
  (t=26:42). Buttons: "EQUIP" / "DROP".
- Equipping the Warm Pants of Health: HP bar becomes `20/28` (Max HP rises 20→28, confirming the +8 Max HP stat), `AP 15/30` unchanged, `DEF 10 + 13` unchanged (t=26:45) — pants swap doesn't touch DEF total here since it replaced a plain "Pants" item that was already contributing the same net (both had +1 base Defense; net DEF stays 13 because the earlier plain pants apparently were NOT equipped yet, or the +1 Defense was already folded into the +13 from Defender/ring — DEF total is unchanged before/after this specific equip, only HP/regen changed). Paper-doll pants slot sprite updates to a dark purple/vertically-striped pattern (t=26:45–26:48), replacing the plain white pants render.
- Inventory grid re-scrolled after all this shows a fuller item set: grey pants (equipped, green border), a katana icon, a tan garment, a white cloak, a pickaxe, a tan/pink garment variant, a branch, a scroll — `WEIGHT: 73/100` still (t=26:48).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

No dialogue box appears in this segment. Context from on-screen UI: the player is running a side quest to fetch "Warm Pants of Health" for a character named Yoko, tied to a location called "N Toshibara Dungeon." The duel against a "Bandit Leader" (enemy level 6) appears to be an encounter within that dungeon, and defeating him drops the exact quest item needed. After the win, the player opens their inventory to inspect and equip the new pants, along with browsing/equipping other gear (a ring and a rare dagger called "Defender") picked up separately.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- The Bandit Leader duel itself is very short on screen within this clip: only a handful of hit exchanges are visible (t=25:22 fight start to t=25:52 "YOU WIN"), roughly **30 seconds** of combat covering at least 2 visible player-damage events and a 3-hit combo, ending abruptly in a win screen — consistent with a short/easy duel rather than a boss fight.
- Hit impacts trigger a full-screen red flash/vignette that fades over roughly half a second, layered under the "FIGHT!" and combo-counter text pop-ins — chunky, high-contrast comic-style FX rather than subtle particle effects.
- Victory transition is a hard cut to full-screen red silhouette wipe with a slam-in "YOU WIN" title, then a modal reward popup — no lingering post-fight camera pan.
- The Player screen itself is static/menu-paced: no animation on the character portrait beyond swapping equipped-item sprites instantly on equip (no equip animation/tween observed — gear just changes in the next frame after clicking Equip).
- Item detail pane updates instantly on click with no transition; stat numbers appear to snap-update immediately after Equip (no counting/tweening animation on the HP/DEF numbers themselves, they just jump to new values, though the HP bar fill appears to animate/lerp slightly — e.g., 9/20 → 19/20 shown mid-fill in one frame that's between two others).

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- This maps to the **Player/Inventory/Equipment UI stage** of the build — a distinct screen from the overworld HUD and from combat, reached via the "PLAYER" icon button in the bottom overworld toolbar (teardrop/map-pin icon, not a portrait icon).
- Equipment slot layout to encode in config as an INFERRED value: 4 rows x paper-doll layout — Head, Mask(empty), Garment, Gloves(empty), Pants, Weapon, RingL(empty), Sandals, RingR(empty). Confirm exact slot count (9 total slots: hat, mask, garment, gloves, pants, weapon, ring L, sandals, ring R) against other player-screen segments before finalizing `src/config`.
- Inventory grid: 4 columns x 2 visible rows (8 slots visible at once) with up/down scroll arrows — capacity constraint is WEIGHT-based (`WEIGHT: X/100`), not slot-count-based; item weight values seen: Pickaxe=10, Pants=5, Garment=5, Worn Sandals=1, Ring=1, Dojo Recall Scroll=1, Blue Silky Herb=1, Defender=5, Branch=1, Warm Pants of Health=5, Onigiri presumably=1 each (weight dropped by 1 when one consumed). These are strong CONTRACT candidates for `src/config` item-weight table.
- Stat-delta convention for item tooltips: base stat + "(EQ: current-equipped-value)" comparison format — e.g. `DEFENSE: +1 (EQ: 0)` when nothing equipped, `(EQ: 1)` after something is equipped in that slot. Colors: green for "better than equipped," red for "equal or worse." Worth replicating exactly since it's a core UX affordance for gear comparison.
- Rarity/name color coding to encode: white/grey = common/generic (Pants, Garment, Pickaxe, Branch, Sandals, Ring, Scroll), purple = rare (Defender, Blue Silky Herb — though Blue Silky Herb is also tagged "QUEST ITEM" so purple may denote quest-tied rather than rarity tier; needs cross-check against another segment), green = quest-reward-named unique (Warm Pants of Health).
- Action-button label swap logic: "EQUIP" ↔ "UNEQUIP" depending on worn state for equippable gear; "USE" instead of "EQUIP" for consumables/scrolls; "DROP" always present as the second button. Good candidate for a shared `ItemDetailPanel` component with a `kind: 'equipment' | 'consumable' | 'quest'` discriminator.
- Confirms `Warm Pants of Health` stat block for CONTRACT values (t=26:42): DEF +1, Max HP +8, HP Regen +2, Wind Def +0, Earth Def +0, Weight 5, Level 4 — should be entered into `src/config` items table verbatim as this is a clean, fully-readable frame.
- Confirms `Defender` dagger CONTRACT values (t=26:22/26:38): DMG 10–15, Defense +10, Weight 5, Level 4, condition "GOOD".
- Contradiction/ambiguity to flag: the "(EQ: x–y)" comparison values for weapons did not match the standalone stat pane of the actually-equipped item in one case (Pickaxe standalone showed flat `DMG: 1–3`, but other items' "(EQ: 4–8)" comparison implied the equipped weapon does 4–8) — before encoding weapon-scaling formulas, verify with another player-screen segment whether "EQ" reflects a level-scaled or stance-modified value rather than the raw item card number.
- The onward "AP" number under HP/CHI/AP bars plus the small unlabeled number beneath it (12, 9, 49, 34, 27, 24, 19, 17 across frames) needs a dedicated future segment — likely a derived "total inventory value" or "carry-weight-adjusted AP" counter, not confirmed this pass; flag as INFERRED/unresolved rather than guessing a formula.
- Duel-screen HUD confirms three ability-slot icons bottom-right with a numeric charge/cooldown badge above each (seen: `2` and `3`), plus a top-left global "AUTO SLASH OFF" toggle — both relevant to the planned combat-input/skills config, distinct from this segment's Stage focus but worth cross-referencing when building the battle HUD.

## VERIFIED
