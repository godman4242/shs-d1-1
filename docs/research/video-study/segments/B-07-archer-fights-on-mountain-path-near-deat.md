# B-07 Archer fights on mountain path, near-death (10:32–12:31)

## Screens & layout   (positions, colors, typography, exact HUD contents; short UI labels verbatim OK)

**World/overworld HUD (top bar, present whenever not in a fight):**
- Top-left: coin icon + "490" "COINS", a small red "+" button next to it, then a gold-nugget icon + "2" "GOLD", then a red "GET GOLD" button (t=10:34).
- Below that: a location banner (brown parchment box) reading the current zone name in caps, e.g. "N KAKUCHI MOUNTAIN PATH" (t=10:34), "NW KAKUCHI MOUNTAIN PATH" (t=10:37), "SW IERIYA FOREST" (t=10:44), "W KAKUCHI MOUNTAIN PATH" (t=11:46 after fight).
- Directly under the zone banner: a quest banner "STORY QUEST: TRAVEL TO THE OLD GUARD HIDEOUT" (t=10:34, recurring).
- Top-right: diamond/fan-shaped XP icon with a level number in it ("7" then later "8"), then "16317 / 16350" then "16827 / 20900" "EXPERIENCE POINTS" (t=10:34 vs t=11:46) — level-up happened mid-segment (fight reward, see below).
- Top-right below XP: a minimap panel bordered in gold scrollwork, grid coordinates 0–5 across top and down left side (labeled with compass letters N/W/S/E at grid edges), a dashed white path line showing the route, a yellow arrow icon = player position/facing, small icons for buildings (torii/hut shapes). Below map: "TERRITORY (24.52)" then "SECTOR (X.X)" ticking up in small increments as player walks (1.0 → 1.1 → 1.2 → 1.5 → 2.0) (t=10:34–11:49).
- Bottom-left: player portrait roundel (circular red-bordered head icon) + two stacked bars: green HP bar "X/20" on top, blue Chi/AP bar "26/26" below, stance name text under bars e.g. "HEAVY STANCE" (t=10:34) later "LIGHT STANCE" (t=11:44 after equipping Iron Sabre).
- Bottom toolbar (persistent, world mode): row of ~8 square icon buttons: chat bubble "...", a brown blob/rock icon, yin-yang icon (skills/stance?), a small cannon/device icon, a scroll/paper icon, a gray hexagon/stone icon, a black ninja silhouette icon, a gear/settings icon (t=10:34).
- Bottom-right corner, small orange/yellow text: "150% DAMAGE" followed by a countdown timer, e.g. "25:01" ticking down every frame (25:01→24:58→24:56→24:53→24:29→24:27→24:20→24:17→23:46→23:09→23:07) — a timed damage buff running the whole segment, draining from ~25:01 to ~23:07 over ~2 real minutes (matches segment wall-clock length), i.e. it decays roughly in real time, not combat time.

**Combat HUD (overrides world HUD when a fight starts):**
- Top-left: brown box "AUTO SLASH OFF" toggle label (t=10:47 on).
- Top-right: pause button (red circle with "II"), and above it a large red number + "HIT COMBO" label that pops up per combo count (values seen: 1, 2, 3) (t=10:47, 11:27, 11:29).
- Bottom-left: HP number "X/20" and Chi "26/26" bars (same as world), plus a yellow-orange status line "CANNOT CHANGE STANCE" appearing directly under the bars while a stance-lock is active (t=10:47, 10:49, 11:27).
- Bottom-right: two ability-slot squares numbered "2" and "3" above them, with icons — slot 2 shows a tan blob/fist icon, slot 3 shows a yellow up-arrow icon (dash?) (t=10:47 onward).
- Damage ticks and hit numbers render as floating red numbers over the target with a thin horizontal red tracer line connecting attacker→target on hits (visible t=10:57, 11:02).
- HP bars over enemy heads: thin horizontal green bar, no numeric value shown, depletes to empty on kill.
- Death/kill transition: screen briefly flashes solid red as a full-screen tint (silhouette combat still visible in black) for ~1 frame sample (t=10:59, 11:36) then fades back.

**"YOU WIN" screen (t=11:41–11:44):** full-screen deep red background, black grass-line silhouette of player standing over fallen enemies, large white-outlined red text "YOU WIN" centered with a jagged ink-splash graphic behind it.

**Loot popup (t=11:44):** parchment-bordered gold-corner-ornament dialog box, header "YOU RECEIVED", left column icons+numbers: a gray scroll/tablet icon "10", "XP" "510", then two item-slot icons (a ring/circle icon labeled blank, and a curved blade icon) — item name label "IRON SABRE" under the blade slot. Red "OK" button at bottom.

**Player/Stats screen (t=11:49–11:59, opened from bottom toolbar):**
- Header "PLAYER", red X close button top-right.
- Top bar: "STATS" tab button (red), coin/gold counts, XP fan icon "16827 / 20900" "EXPERIENCE POINTS", right-aligned "AVAILABLE STAT POINTS: 3" (ticks down to 2, then 0, as points are spent) (t=11:49→11:54→11:56).
- Left panel: character name "SOUND360TM", equipment paper-doll — 9 equip slots arranged around a center character render: head (straw hat icon), face/mask slot (empty, mask icon), body/robe slot (blue robe icon, blue-bordered = equipped rarity?), hand-wraps slot (empty), main-hand weapon slot (blue sword icon, blue border), off-hand/secondary slot (purple feather/quill icon, purple border = higher rarity), ring slot (gold ring icon, gold border), boots slot (white boots icon), bracelet slot (empty).
- Center-right panel: three stat bars with "+" buttons to spend points: "HP 20/20", "CHI 26/26" (later shows "26/31" after Chi was raised, with a small "12"/"10" decreasing sub-number beneath — looks like a "points remaining to next tier" counter), "AP 30/30" (later "30/35" with same decreasing sub-number 15→12→10). Right side: four more stats with "+": "ATK 19" (later "22"), "DEF 19 + 18" (base+bonus format), "SPD 13 + 4".
- Bottom-right: inventory-style equipment grid, "WEIGHT: 104 / 100" in red (over-capacity), 8 gear-icon slots shown (swords, a ring, boots, a red-bordered sword = new "Iron Sabre" pickup, a green-bordered straw hat, etc.), small red downward-triangle expand arrow bottom-right of grid.

**Skills screen (t=12:01–12:19, opened via bottom-toolbar icon):**
- Header "SKILLS", red X close.
- Left info panel: selected skill's icon, name, and description text.
- Right panel: "AVAILABLE SKILL POINTS: 1" top-right.
- "SELECT A SKILL CATEGORY" grid of 6 category icons on first screen (t=12:01): a crouching/dodge figure, a spear-thrust figure, a slashing-sword figure, a chi/flask icon, an up-arrow icon, and a curved-blade icon — category labels confirmed by clicking: the blade icon = "NINJA SKILLS" ("Skills that are based on stealth, deception and illusion.") (t=12:01); the up-arrow category eventually shows movement skills.
- Inside NINJA SKILLS category (t=12:04): 9 sub-skill icons in a grid; selecting the first (kunai icon) shows detail panel: "THROW KUNAI" / "Throws a kunai." / "Requires kunai ammo." / "NEXT LEVEL (LEVEL 1)" / "20 DAMAGE" / "COOLDOWN: 1.96 SEC" / red text "LEVEL REQUIRED: 10" (locked — player under-level for this skill).
- Movement/traversal category (up-arrow icon, t=12:14): 8 icons — up-arrow, double-left-arrow, double-right-arrow, a circular-arrow, three dots, a bag icon, a scroll icon, a pickaxe icon, plus a magnifying glass and a second pickaxe below.
  - "DASH LEFT" detail (t=12:16): "Short burst of speed." / "Interchangable with Dash Right skill if you drag and drop skill icon to select direction." / "MAX LEVEL" / "CHI COST: 2" / "COOLDOWN: 3.92 SEC" — "EQUIP SKILL" button available (top-right of skills-equipped row) since it's already at max level and not yet equipped in that slot.
  - "DASH RIGHT" detail (t=12:19): identical stats — "Short burst of speed." / same interchangeable note / "MAX LEVEL" / "CHI COST: 2" / "COOLDOWN: 3.92 SEC".
  - "BALANCED STANCE SKILLS" category header shown once (t=12:21): "Skills that are usable when in Balanced Stance." — 6 sub-icons (walking figure, crouch figure, another crouch, a musket/rifle icon, a red-highlighted figure [locked/unaffordable], a spear figure).
- "SKILLS EQUIPPED" row fixed at bottom of the Skills screen, 3 slots (matches the 2/3 combat hotbar slots): slot 1 empty, slot 2 = tan blob icon, slot 3 = yellow up-arrow icon — matches combat HUD hotbar exactly, confirming the Skills screen configures the same 3 combat-slot hotbar seen mid-fight.

**Travel-blocked popup (t=12:26):** parchment dialog, "YOU ARE CARRYING TOO MANY THINGS TO TRAVEL." / "UPGRADE THE CARRYING WEIGHT+ SKILL TO CARRY MORE ITEMS." / red "OK" button — triggered by the 104/100 weight overage seen on the Stats screen; blocks fast-travel via the footprint waypoint icon.

**Duel screen (t=12:29, briefly flashed):** header "DUEL", red X close, skull-token icon "40" "+", "DUEL TOKENS" "30" count, center gold-framed box "REFRESHING...", "RANKINGS" button top-right, a text-entry row "VICTORY TAUNT (DISPLAYS ON OPPONENT'S SCREEN WHEN YOU...)" with an editable field containing "YOU CAN NEVER DEFEAT ME!" — a right-click context menu (Adobe Flash Player system menu: "Impostazioni...", "Impostazioni globali...", "Verifica disponibilità aggiornamenti...", "Informazioni su Adobe Flash Player 32.0.0.330 (64-bit)...") is visibly open over it, confirming the capture is the Flash original running in an Italian-localized Flash Player, not a port.

## Mechanics observed (rules, numbers, timings, damage/HP/cost values you can read — cite frame t=MM:SS for each claim)

- Player HP pool is 20 max; at segment start HP reads "2/20" — i.e. player enters this segment already critically low (t=10:34), confirming the map-context "drops to 1/20 HP" happens within this window: HP visibly ticks 2/20 → 1/20 (t=10:59) → dies/wins before further drop.
- Chi/AP bar is a flat 26/26 through the near-death fight, i.e. Chi did not regenerate or drain from basic attacks in this encounter (t=10:34–11:36).
- "CANNOT CHANGE STANCE" lock is shown literally as on-screen text under the HP/Chi bars, active from the very first hit of combat and persists across at least 3 frames sampled during the fight (t=10:47, 10:49, 11:27) — this is a full combat-duration stance lock, not a short debuff.
- "150% DAMAGE" buff timer counts down continuously in real time from 25:01 at t=10:34 to 23:07 at t=12:26 — over the ~119s captured segment the timer dropped ~114s, confirming it ticks at real-time (not paused during combat or menus).
- Hit-combo counter increments per successive hit without being dropped: reaches "1 HIT COMBO" (t=10:47), then a separate exchange reaches "3 HIT COMBO" (t=11:27) before dropping back to "1" on the next swing (t=11:29) — combos reset on a miss/gap, not per-enemy.
- Enemy identification tags above their heads read "BANDIT (7)" and "EBARNCOTT (7?)" (garbled OCR, likely a player-name tag from PvP-adjacent bandit skin) — the "(7)" appears to be enemy level (t=10:39, 10:42).
- After the fight: "YOU RECEIVED" 10 (currency scroll icon, likely a crafting/currency material) + 510 XP + an "IRON SABRE" weapon item (t=11:44).
- XP bar jumps from 16317/16350 (level 7, near-full) to 16827/20900 (level 8, i.e. leveled up) between t=10:34 and t=11:46 — the 510 XP reward from this single fight was enough to level the player from 7→8 (16317+510=16827, confirmed exact arithmetic match) and increased the level-8 XP-to-next requirement to 20900.
- Stats screen: "AVAILABLE STAT POINTS: 3" at level 8 (t=11:49); spending drops the counter 3→2→0 as HP/Chi/AP "+" buttons are pressed (t=11:54, 11:56).
- Stat point costs to raise bars are non-1:1 — CHI bar shows "26/31" (raised max by 5) with a small counter under it reading "12" then "10" (looks like remaining chi-to-next-threshold or a decreasing secondary resource, not directly XP) (t=11:54→11:56).
- ATK increases from 19 to 22 after spending points (t=11:56) — a +3 ATK gain from investing available stat points (unclear if 1 point = 1 ATK or multi-point since only end totals are legible).
- DEF is displayed as base+bonus: "19 + 18" (t=11:49–11:59, unchanged across the panel views) — equipment is contributing +18 DEF on top of 19 base.
- SPD is "13 + 4" (base+equipment bonus), also unchanged.
- Equipment WEIGHT reads "104 / 100" — over the carry cap, shown in red (t=11:49 onward) — this directly causes the later "carrying too many things to travel" block (t=12:26).
- "Throw Kunai" skill (Ninja Skills category), Level 1 stats: 20 DAMAGE, COOLDOWN 1.96 SEC, but gated "LEVEL REQUIRED: 10" — player is level 8, so it's locked (t=12:06).
- "Dash Left" / "Dash Right" (Movement category) at MAX LEVEL: CHI COST 2, COOLDOWN 3.92 SEC — both directions are separate skill entries but functionally described as interchangeable via drag-and-drop remapping onto a single hotbar slot (t=12:16, 12:19).
- "Available Skill Points: 1" is shown constant across the entire Skills-screen browsing (t=12:01–12:24) — the 1 point was never spent in this segment (player was window-shopping categories, matches task's "1 point available" note).
- Duel screen shows "40" (skull/token currency, unlabeled but adjacent to a "+" buy button) and "DUEL TOKENS 30" as a separate resource (t=12:29) — two distinct duel-related currencies.
- Minimap "SECTOR" value increments in small fractional steps as the player walks: 2.0 → 1.0 → 1.1 → 1.2 → 1.5 → 2.0 (values reset per screen/zone transition, appears to be a sub-position readout within the current "TERRITORY (24.52)" zone rather than a global counter) (t=10:34–11:49).

## Story/dialogue     (OWN-WORDS summary; names/quest titles OK; no verbatim dialogue)

The active quest banner throughout is a fetch/travel objective directing the player toward an "Old Guard" hideout, reinforcing earlier segments' setup of the player infiltrating or approaching a guard faction's base. While traveling the mountain path, a bandit patrol NPC calls out a short one-line warning that the player doesn't belong there, which immediately triggers combat — a classic "trespasser" ambush trigger rather than a scripted cutscene. No named story characters or extended dialogue appear in this window; it's pure gameplay (travel + combat + menu-browsing) bookended by a single hostile-NPC bark.

## Feel               (pacing, camera, animation weight, FX; if combat: rough per-encounter durations in seconds)

- Traversal pacing is slow and deliberate: the player auto-walks/runs through parallax forest and rock-cliff backgrounds for roughly 13 seconds before the first ambush trigger (t=10:34 to ~10:47).
- Camera is a fixed side-scroller camera that pans smoothly to follow the player; zone transitions are marked by a hard cut/loading flash to black (t=10:39) then a new backdrop, and by the location banner text updating.
- Combat encounter 1 (bandit swordsman + bandit archer ambush): starts ~10:47, ends in a "YOU WIN" full-screen transition first glimpsed ~10:59 (red screen kill-flash) with the "YOU WIN" card fully shown by 11:41 — total encounter-to-loot-screen span is roughly 55–65 seconds including a mid-fight death-flash frame, i.e. a fairly drawn-out, punishing fight matching the "near-death" framing (HP dropped from 2/20 toward 1/20 mid-fight before the player pulled off the win).
- Death/kill impact frames use a hard full-red screen flash rather than a gradual vignette — a strong, snappy "danger" cue rather than subtle color grading.
- Slash attacks render as a solid blue elongated blade-trail shape swept through the arc of the swing (visible clearly t=10:47, 10:57, 11:27) — thick, chunky "slash-line" silhouette rather than a thin line, consistent with prior segments' "slash-line drawing" note; player also gets hit by red tracer-line arrow/ranged shots from archers (t=10:57, 11:29).
- Menu browsing (Player/Stats and Skills screens) is static and unhurried — no animation on the character portrait beyond idle sway; screen navigation is click-driven with immediate panel swaps, no transition animation observed.
- The very last frame (t=12:29) catches an out-of-game Flash Player context menu open over the Duel screen — incidental evidence of the capture environment (Adobe Flash Player 32.0.0.330, Italian locale), not in-game content.

## Recreation notes   (config values to add/adjust, which build Stage this maps to, anything contradicting the repo's spec/research docs)

- **Stance-lock during combat**: "CANNOT CHANGE STANCE" is a literal, persistent HUD string during fights, not a toast/tooltip — worth a `CONTRACT` config flag (e.g. `combat.stanceLockedDuringEncounter: true`) plus a dedicated always-visible HUD label component, not a transient message.
- **Timed global damage buff ("150% DAMAGE" + real-time countdown)**: this is a world-state buff, decaying in wall-clock time independent of combat/menu state — if the recreation adds a similar buff system, model its timer as real-time-driven (not tied to Sim's fixed 60Hz tick count only during active play) or explicitly note that the original decays even while paused in menus, which the repo's `Sim`-owns-everything design should replicate deliberately (INFERRED, would need a longer capture to confirm it also decays inside menus vs. only during "live" world time).
- **HP pool is small (20)**: matches prior segments' scale; the "near-death" framing at 1–2/20 is the intended tension beat — recreation's HP/damage config should preserve a similarly narrow near-death band rather than a deep HP pool with wide margin.
- **Hit-combo counter resets are frame-visible**: worth an explicit combo-window config value (CONTRACT/INFERRED) — this segment shows combos reaching at least 3 before resetting to 1, giving a lower bound on combo persistence but not the exact reset-timing window (would need frame-accurate combat-only capture to nail the window in ms).
- **Stat/skill point economy**: confirms a dual-currency skill investment model — "Available Stat Points" (raw HP/Chi/AP/ATK/DEF/SPD allocation) is separate from "Available Skill Points" (unlocking/leveling active abilities in the Skills screen) — Stage/config docs should keep these as two distinct pools, not conflate them.
- **Equipment weight cap mechanic**: "WEIGHT: 104/100" blocking travel is a real inventory-management mechanic (not just a display stat) — confirmed functional: exceeding 100 weight triggers a blocking popup on fast-travel attempt. Worth a `CONTRACT` config constant for max carry weight (100) and a `travelBlockedOverweight` message component if the recreation implements inventory weight.
- **Skill level-gating by player level**: "Throw Kunai" is flatly locked behind "LEVEL REQUIRED: 10" even though a skill point is available to spend — confirms skills have independent level gates from skill-point availability; recreation's skill-tree data model needs a `levelRequired` field separate from `pointCost`.
- **Directional dash skills are a single logical skill with two entries**: "Dash Left"/"Dash Right" share identical stats (Chi cost 2, cooldown 3.92s) and are explicitly described as remappable onto one hotbar slot via drag-and-drop — if the recreation implements dash, consider a single `dash` skill with a direction parameter bound at equip-time rather than two fully separate skill objects, matching the original's own design language ("interchangeable").
- **Combat hotbar has exactly 3 ability slots** (slots labeled 2 and 3 visible in combat, slot layout mirrored in the Skills screen's "Skills Equipped" row with 3 slots) — useful concrete number for the recreation's action-bar config (`combatHotbarSlots: 3`, INFERRED from consistent frame evidence, though slot "1" was never populated in this capture so it's possible the true count is different/basic-attack-implicit).
- **Duel mode exists as a separate PvP-adjacent menu** with its own token economy (two currencies: an unlabeled skull-icon currency "40" and "DUEL TOKENS 30") and a custom victory-taunt text field — out of scope for near-term Stages per repo's current plan, but worth flagging as a confirmed feature for later roadmap docs; not previously documented in earlier segment notes reviewed here.
- No contradictions found versus the repo's existing invariants (Phaser stack, palette-shift, RECREATE-not-RIP) — this segment is pure observational reference and reinforces prior "slash-line drawing" and "stance lock" notes already flagged in the map context.

## VERIFIED
