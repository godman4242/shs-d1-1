# B-09 Castle town toll gate and shop (18:26–19:45)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**Player/Inventory screen (t=18:26, 18:28)** — opened before the segment's overworld action, "PLAYER" title top-left, red X close top-right.
- Left column: character name "SOUND360TM" header, portrait paperdoll with 8 equip slots arranged in a 3x3-ish grid around the character sprite (helmet, mask, chest, gloves/hands, pants, sword, 2x ring/accessory slots, boots).
- Top bar: "STATS" button, COINS counter (542, folded-paper icon), GOLD counter (2, coin icon), diamond-shaped XP badge showing level "8" and "19007 / 20900 EXPERIENCE POINTS", "AVAILABLE STAT POINTS: 0" top-right.
- Right column: selected item detail panel — shows "PANTS", "LEVEL 1", stat block: DEFENSE +1 (EQ: 3), EARTH DEF 0 (EQ: 1), CRITICAL DAMAGE 0 (EQ: 1), MAX CHI 0 (EQ: 5), CHI REGEN 0 (EQ: 2), WEIGHT: 5. "EQ:" appears to denote the equipped item's stat for comparison against the hovered item.
- Below that: inventory grid (2 rows x 4 columns visible), one slot showing "x2" stack count (white pants icon), item borders color-coded by rarity: white/gray = common, blue = rare/equipped, purple = epic, no border = plain.
- "WEIGHT: 108 / 100" shown in red (over capacity) at t=18:26, drops to "103/100" one frame later (t=18:28) — still over cap, still red.
- Bottom buttons: "EQUIP" and "DROP" (both red-brown banner buttons).
- Overworld HUD (bottom-left) persists beneath: player portrait medallion, HP bar green "11/20", Chi/stamina bar blue "45/47", stance label "HEAVY STANCE", "+" gold button.
- Bottom action bar icons (left to right): chat bubble "...", brown teardrop icon, yin-yang icon, crossbow/bow icon, scroll/candle icon, gray hexagon/stone icon, black ninja silhouette icon, gear/settings icon.

**Overworld map/minimap (top-right, all overworld frames)** — gold-framed square grid minimap showing numbered columns "0 1 2N3 4 5", compass letters N/W/E/S at grid edges, player arrow icon, gate icons (⌐-shaped) marking gate structures, an "X" marking current position early on. Below the grid: "TERRITORY (24.52)" and "SECTOR (n.0)" labels — sector value increments as player moves (Sector 1.0 → 2.0 → 3.0 across the segment, i.e. player crosses two sector boundaries walking from mountain path into the castle town).

**Location banners (top-left, black rounded rect w/ gold border)** — sequence seen: "NW KAKUCHI MOUNTAIN PATH" / "N KAKUCHI MOUNTAIN PATH (E)" (t=18:31) → "N KAKUCHI MOUNTAIN PATH" (t=18:33–18:38) → "KAKUCHI CASTLE TOWN GATES" (t=18:43) → "CASTLE TOWN ENTRANCE" (t=18:58 onward, persists through shop area) → "MAIN STREET" (t=19:35 onward).
- Below location banner, a persistent quest tracker line in white/green text: "STORY QUEST: FIND INFORMATION ABOUT THE BOUNTY HUNTERS" (t=18:33–18:53), later replaced by "SIDE QUEST: GET FAST SHOES OF FOCUS FOR INOKUMA KINKIYO" (t=18:58–19:30), then "SIDE QUEST: DEFEAT HATTORI KAZUSHI" (t=19:40–19:43) — quest text updates live as NPC dialogue is resolved.

**Town Guard toll gate dialog (t=18:48–18:51)** — appears when approaching the castle gate.
- Menu box "TOWN GUARD" (black header bar, gold border) with two options, each with a leading icon:
  - "$ PAY TOLL" (coin-bag icon)
  - "↑ LEAVE" (up-arrow icon)
- Below, a separate dialogue box "TOWN GUARD" header + portrait of a guard NPC (conical straw hat, side-profile) bottom-right, speech text (verbatim UI/dialogue, short and functional):
  "KAKUCHI CASTLE TOWN BELONGS TO CLAN KI SENSU. YOU MUST PAY A TOLL OF 7 COINS IF YOU WANT TO ENTER."

**NPC dialogue box format (t=18:53, 18:56)** — reused throughout: black rounded panel, gold corner brackets, NPC name plate top-left ("INOKUMA KINKIYO"), player name "SOUND360TM" + NPC name shown above heads with a floating "!" quest-availability icon. NPC portrait bust (bottom-right) with a small "▶" continue arrow. Player's line rendered as a full-width red highlighted option bar (e.g. "I'LL SEE WHAT I CAN DO") stacked above a gray "MAYBE LATER" decline option. A quest is offered inline: "QUEST: FIND FAST SHOES OF FOCUS" (item name in green, rest white).

**Recent Happenings Board (t=18:58–19:01)** — a readable bulletin/kiosk object, own menu:
- Menu: "RECENT HAPPENINGS BOARD" header, options "👁 VIEW MORE..." and "↑ LEAVE".
- Board content box header "-- YESTERDAY'S HAPPENINGS --" listing town simulation stats (see Mechanics).

**Peddler Shop (t=19:06 onward)** — general goods stall run by an old peddler NPC (large conical hat, walking stick, blue sack on back, robe).
- Menu: "PEDDLER SHOP" header, 3 options: "$ BUY", "$ SELL", "↑ LEAVE".
- Peddler dialogue line (verbatim, short/functional): "THANKS FOR DROPPING BY. COME! HAVE A LOOK AROUND!"
- Background art: a market stall visible behind the peddler with a rack of hanging colored clothing (red lantern also visible in later frame), i.e. this is a distinct clothing/goods cart prop in the town-street background art, separate from the toll gate.

**SELL screen (t=19:08–19:20)** — title "SELL" top-left, red X close top-right.
- Top bar: COINS total, GOLD total, "GET GOLD" red button.
- Left: item grid (up to 3 rows x 4 cols observed), each icon shows a small price/qty badge bottom-right.
- Right: selected-item detail panel — icon, name, "LEVEL n", "OWNED: n" (only shown once an item is selected a 2nd time), stat block matches the Player screen's format, plus weapon-specific "CONDITION: <tier>" and "DMG: lo-hi (EQ: lo-hi)" lines, and a "WEIGHT:" line. Red "SELL" button bottom-right of detail panel.
- Item condition tiers observed: "GOOD" (Iron Sabre, first look) and "UNBREAKABLE" (Iron Sabre, re-inspected after upgrade/repair context — condition label changed between two views of the same weapon slot, suggesting condition is per-item-instance and can change).

**BUY screen (t=19:23–19:28)** — title "BUY" top-left, same top bar (COINS/GOLD/GET GOLD).
- Item grid is 4 columns x 4 rows with up/down triangle scroll arrows (▲ top-right of grid, ▼ bottom-right) — more than 16 items in the full catalog.
- Right detail panel same layout as SELL: icon, name, "LEVEL n", "OWNED: n", "CONDITION: <tier>", "DMG: lo-hi (EQ: lo-hi)", "WEIGHT:" — green "BUY" button bottom-right.
- Detail examples: "IRON SWORD" — LEVEL 1, OWNED 0, CONDITION: WELL-MAINTAINED, DMG 4-8 (EQ 8-21), WEIGHT 5. "RING" — LEVEL 1, OWNED 0, no combat stats shown, WEIGHT: 1 (accessory, no DMG/condition fields).

**Bounty board / wanted poster kiosk (t=19:38–19:43)** — a red-roofed wooden signboard/kiosk prop with two wanted-poster portraits pinned to it, plus a katana mounted decoratively above it. Interacting opens a dialogue: "QUEST: DEFEAT HATTORI KAZUSHI AND RETURN BLESSED SHARP IRON SWORD OF HEALING AS PROOF." with options "ACCEPT BOUNTY QUEST" (red highlighted) / "LEAVE" (gray).

**Main Street background (t=19:33–19:45)** — two-story townhouses with tan/cream walls, dark brown tiled roofs, sliding paper-screen (shoji) windows with wood shutters, wooden sign-posts with directional letters (N/S/W/E) at street junctions. An inn building has a pink noren curtain over the doorway, a kanji sign, and a floor sign reading "ENTER INN".

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- **Toll gate cost:** 7 coins to enter Kakuchi Castle Town (t=18:51, guard dialogue text explicit).
- **Player HP/Chi at segment start:** HP "11/20" green bar, Chi/stamina "45/47" blue bar, stance "HEAVY STANCE" (t=18:26–19:45, unchanged throughout — no combat in this segment).
- **Currency at segment start:** 542 Coins, 2 Gold (t=18:26). Coins climb over the segment: 535 (t=19:01, after gate interactions — a small coin cost was deducted, consistent with paying part of the toll or an NPC interaction; net looked like -7 from 542, matching the toll), then 540 (t=19:08), 545 (t=19:13/19:15), 545 sustained through shop, 545 (t=19:23–19:33). Gold stays flat at 2 throughout — no gold spent or earned this segment.
- **Player level/XP:** Level 8, XP 19007/20900 — static across the whole segment (no combat XP gain).
- **Inventory weight cap:** 100. Player is over cap at segment start: "108/100" (t=18:26) then "103/100" (t=18:28) — red warning text both times, confirms a hard weight-limit UI (not necessarily a hard block on movement, since player still walks/enters town while over cap).
- **Territory/Sector counters:** "TERRITORY (24.52)" constant; "SECTOR" value increments 1.0 → 2.0 → 3.0 as the player walks from the mountain path toward and into the castle town (t=18:31 sector 1.0, t=18:36 sector 2.0, t=18:43 sector 3.0) — one sector-boundary crossing roughly every 2 in-game screen-transitions/~5-7s of walking.
- **In-game clock:** a countdown/day-timer shown bottom-right reading "150% DAMAGE 17:00" (t=18:33), decrementing steadily through the segment: 16:58 (18:36) → 16:53 (18:43) → 16:51 (18:46) → 16:34 (18:58) → 16:02 (19:28) → 15:55 (19:33) → 15:52 (19:35) → 15:00-ish trend continuing to 19:43. This reads as a real-time countdown clock (minutes:seconds) tied to a "150% DAMAGE" buff/event — likely a timed world-event or day/night event multiplier, counting down roughly 1 real second per displayed second (18:33→19:43 is 70s elapsed, clock dropped from 17:00 to ~15:5x, i.e. ~65-70s of countdown — matches 1:1 real-time).
- **Town Happenings Board stats (t=18:58, "YESTERDAY'S HAPPENINGS"):** TOWN STATUS (PROSPERITY: 494, CROPS: 7, GOODS: 3, DEFENSE: 0); TOWN POPULATION (PEASANTS: 0, FARMERS: 0, MERCHANTS: 0, ARTISANS: 0, SAMURAI: 0); "150 MERCENARIES ARRIVED FROM THE NORTH"; "MERCENARIES ATTACKED ONI: 33 MERCENARIES KILLED, 17 ONI KILLED"; "MERCENARIES UPKEEP COST: PROSPERITY -167"; "UNDEAD HORDE SPOTTED IN THE TERRITORY TO THE EAST"; "RONIN ATTACKED ONI: 42 ONI KILLED" — this is a scrolling text log (a "(MORE...)" prompt at the bottom implies more entries), i.e. a background town-simulation/faction-war system independent of direct player action.
- **Shop item prices (coin cost badges, BUY screen, t=19:23–19:28):**
  - Iron Sword (weapon): 100 coins — LEVEL 1, DMG 4-8 (EQ 8-21), WEIGHT 5, CONDITION: WELL-MAINTAINED.
  - Whetstone-like gray bar icon: 20 coins.
  - Gold ingot/bar icon: 40 coins.
  - Small dagger/kunai icon: 5 coins.
  - 4x colored potion bottles (red, blue, orange, purple caps): 100 / 1000 / 1000 / 1000 coins respectively — steep price gap suggests red = common potion, other 3 colors = rare/high-tier potions.
  - Potato-like food items (5 variants, slightly different faces/shading): 5 coins each — cheap consumable/food tier.
  - Ring (accessory): 100 coins — LEVEL 1, WEIGHT 1, no combat stats.
  - Second ring/circlet (teal/jade colored): 50 coins.
  - Hooded cloak/robe icon (brown): 50 coins.
  - 4 more cloak/robe color variants (dark gray, navy, white, tan/gold): 50 coins each.
  - 2x white boots icons: 20 coins each.
  - Grid confirmed to scroll beyond 16 visible slots (scroll arrows present) — full catalog is larger than one screen.
- **SELL screen prices (sell-back values, lower than buy, t=19:08–19:20):** sword-type icons at 5 coins each (several variants — different sword sprites all priced 5); Shorts (pants, blue border) 20 coins, LEVEL 7, stats DEFENSE +1 (EQ:3), WATER DEF +3 (EQ:0), EARTH DEF 0 (EQ:1), CRITICAL DAMAGE +2 (EQ:1), MAX CHI 0 (EQ:5), CHI REGEN 0 (EQ:2), SPEED +5 (EQ:0), WEIGHT 5 — this is the only item in the segment showing a "SPEED" stat line, and it's a pants slot. A different sword priced 25 coins (blue border, rarer). White boots (green border) 15 coins. Another sword-type item (green border) 15 coins. Pickaxe: 10 coins, LEVEL 1, CONDITION: GOOD, "USED FOR MINING", DMG 1-3 (EQ 8-21), WEIGHT 10 — confirms mining/gathering tool exists as an equippable/sellable item with its own (weak) damage stat. Potion/flare-looking red-and-cream cylinder icon: 1 coin (t=19:08, 19:13) — cheapest sellable item seen.
- **Iron Sabre detail (SELL screen, inspected twice, t=19:10 then t=19:13):** first view — LEVEL 5, CONDITION: GOOD, DMG 6-16 (EQ 8-21), WEIGHT 5, sell price 5 coins. Second view (after the player apparently picked up/upgraded a copy) — LEVEL 7, OWNED: 1, CONDITION: UNBREAKABLE, DMG 12-19 (EQ 8-21), WEIGHT 5. This shows the same weapon name can exist at different levels/conditions with materially different damage rolls (6-16 → 12-19) — condition tiers meaningfully scale damage, and "UNBREAKABLE" appears to be a top condition tier (no durability decay).
- **Pants detail (SELL screen, green-border item, t=19:15):** "PANTS", LEVEL 1, sell 15 coins, stats DEFENSE +1 (EQ:3), WIND DEF +1 (EQ:0), EARTH DEF +1 (EQ:1), CRITICAL DAMAGE 0 (EQ:1), MAX CHI 0 (EQ:5), CHI REGEN 0 (EQ:2), WEIGHT 5 — note the elemental defense line varies by item (WATER DEF on Shorts vs WIND DEF on Pants vs EARTH DEF baseline on both) — implies a multi-element defense system (at least Water/Wind/Earth seen, "EQ:" always shows the currently-equipped item's value for comparison).
- **Quest chain observed this segment:** (1) ambient story quest "FIND INFORMATION ABOUT THE BOUNTY HUNTERS" active on entering the mountain path/gate area; (2) NPC "Inokuma Kinkiyo" met on Castle Town Entrance street, offers side quest "FIND FAST SHOES OF FOCUS" via a 2-option dialogue (accept "I'LL SEE WHAT I CAN DO" / decline "MAYBE LATER") — accepted, tracker updates to "SIDE QUEST: GET FAST SHOES OF FOCUS FOR INOKUMA KINKIYO" (t=18:58); (3) further down Main Street, a bounty-board kiosk offers "DEFEAT HATTORI KAZUSHI AND RETURN BLESSED SHARP IRON SWORD OF HEALING AS PROOF" via "ACCEPT BOUNTY QUEST"/"LEAVE" — accepted, tracker updates to "SIDE QUEST: DEFEAT HATTORI KAZUSHI" (t=19:40-19:43). Two side quests are stacked/tracked in this single segment, both replacing the previous tracker text (single-line tracker, most recent accepted quest shown — full quest log presumably lives elsewhere).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

The player character walks from a mountain path down into Kakuchi Castle Town, a settlement controlled by the Ki Sensu clan. A gate guard stops them and requires a small toll payment before allowing entry — a lightweight paywall/friction mechanic rather than a real obstacle, since the fee is trivial relative to the player's coin total. Once inside, the town is depicted as a lived-in place with its own background politics: a public notice board reports on mercenary bands, ronin, and an "oni" (demon/monster) threat, plus an undead horde sighted nearby, giving flavor that the world keeps ticking even off-screen — a warring-states-era Japan setting where local lords hire muscle to fight monsters and each other. Walking further in, the player meets a named townsperson (Inokuma Kinkiyo) who greets them respectfully as a samurai and asks for help finding a specific item (a pair of shoes tied to "focus"), setting up a fetch-quest side objective. The player also visits a traveling peddler's shop to buy/sell goods and equipment. Continuing down Main Street, the player finds a public bounty board advertising a reward for defeating a named target, Hattori Kazushi, and returning a specific enchanted blade as proof — the classic "kill and bring back the weapon" bounty quest hook. The segment ends near an inn, suggesting the town also offers rest/recovery services.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- No combat in this segment — it's pure exploration/menu/dialogue pacing.
- Overworld traversal is a slow, deliberate side-scroll walk cycle; the player sprite carries a visible bundle/pack on its back the whole time (walking animation shows a slight bounce/lean, consistent with a loaded traveler).
- Screen transitions between sub-areas (mountain path segments, gate, town entrance, main street) are simple horizontal scene cuts with a brief black loading flash and a "LOADING..." text overlay (t=18:56) — not a soft fade, a hard cut with loading text, very lightweight/instant (sub-second).
- Menus (Player/Inventory, Sell, Buy, Town Guard, Peddler Shop, dialogue boxes) are all static full-panel overlays with no animated transitions visible in the sampled frames — pop up instantly over a darkened/dimmed background (background art visible but muted behind item panels).
- NPC portraits are static bust illustrations with a slight painterly shading style, distinct from the flatter vector overworld sprites — a stylistic split between "cutscene portrait art" and "gameplay sprite art."
- Bottom action bar and HP/Chi HUD persist unchanged and undimmed through overworld navigation but disappear entirely once a full-screen menu (Player, Buy, Sell) is open — those menus fully replace the game view.
- Pacing across the 79s segment is unhurried: walk ~10-15s per sub-area, stop for a multi-second dialogue/menu interaction, repeat. Consistent with a deliberate "town hub" pacing beat between combat encounters.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- This segment is Stage-agnostic content research (town/shop/quest systems), not core combat — likely maps to a later "Town Hub / Shop / Quest" build stage once combat (Sim) and core stances are done. Flag for whichever stage covers non-combat overworld systems (shops, NPC dialogue, quest tracker, toll gates).
- **Config values worth capturing** (all as CONTRACT candidates pending further corroboration from other segments):
  - Toll gate cost: 7 coins (single hardcoded instance seen; may vary by town/clan in the full game — treat as one data point, not a universal constant).
  - Inventory weight cap: 100 (soft cap — player exceeds it without being blocked from moving/entering areas; only a red-text warning). Recreation should NOT hard-block over-capacity actions based on this evidence.
  - Currency has two tiers: Coins (common, used for shop buy/sell, toll) and Gold (rare, "GET GOLD" button visible suggests it's a premium/IAP-adjacent currency in the original — for our clean-room build this should map to a purely gameplay-earned rare currency, no purchase hook).
  - Weapon "CONDITION" tiers observed: GOOD, WELL-MAINTAINED, UNBREAKABLE (at least 3 tiers) — condition appears to scale DMG range materially (Iron Sabre GOOD lvl5 = 6-16 dmg vs UNBREAKABLE lvl7 = 12-19 dmg). Worth designing a condition-tier multiplier table in config.
  - Multi-element defense stat exists: at minimum WATER DEF, WIND DEF, EARTH DEF seen as distinct lines on different armor pieces, alongside a flat DEFENSE stat, CRITICAL DAMAGE, MAX CHI, CHI REGEN, WEIGHT, and occasionally SPEED. This is a broader stat system than pure DMG/HP — flag for `src/config` stat schema design if not already covered.
  - Shop price tiers: cheap consumables (potatoes) 5 coins; starter weapon (Iron Sword) 100 coins; rare potions 1000 coins; accessories 50-100 coins; tools (pickaxe) 10 coins. Useful as relative-value anchors even though our game will use original numbers, not ported ones (repo palette/number invariant: don't copy verbatim balance, treat these as reference ratios only).
  - Real-time countdown clock with a "150% DAMAGE" tag was observed ticking down in real seconds during a peaceful, no-combat overworld/town segment — this looks like a timed buff or event window that persists across scene changes (menus, shops, dialogue) without pausing. If the repo's Sim is meant to be fixed-60Hz and scene-driven, confirm whether such global timers should run on wall-clock or sim-tick time — worth a design decision note, doesn't block current Stage.
- Nothing here contradicts existing repo research docs directly (no combat data to cross-check); this segment mainly adds new systems (town hub, shop, quest board, toll gate, town-simulation bulletin) not previously covered, per the task's "NEW" framing in the map context.

## VERIFIED
