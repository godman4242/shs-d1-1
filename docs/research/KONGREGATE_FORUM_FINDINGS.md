# KONGREGATE FORUM FINDINGS — dev-era player knowledge (Wayback harvest)

> **What this is.** Game-mechanics knowledge mined from the ~128 archived Kongregate
> forum topics for *Straw Hat Samurai: Duels* (222 Wayback captures, 2015-era threads,
> mostly crawled July 2020). Harvest workflow `wf_0c6e9655-269`, 2026-07-23/24.
>
> **STATUS: extraction COMPLETE — all 37 batches, 1447 unique cited facts (49 dev-authored).**
> Synthesis (dedup + contradiction-flagging): **2 of 3 sections done** below.
> The economy/items/progression cluster is included RAW (per-fact, pre-dedup) —
> its synthesis agent hit the usage window (resets 04:50 MYT); resuming the
> workflow re-runs ONLY that agent (everything else replays from cache).
>
> **Read rules.** Facts are PLAYER CLAIMS unless marked **DEV:** (Lutgames posts /
> quoted official changelogs). Quotes ≤25 words by policy. Contradictions are kept,
> flagged, and cited on both sides. Precedence: `REBUILD_READINESS.md` + config +
> fidelity ledgers still win on conflicts.
>
> **Harvest caveats.** Wayback throttled hard (unrecoverable capture: funny-npc-dialogue
> topic 490529). Two early batch workers hit scratchpad filename collisions /
> out-of-order responses; both content-verified their facts against thread titles —
> still, spot-check a citation before leaning hard on it.


# PART 1 — Combat, skills & enemies (SYNTHESIZED)

### combat-core

**Exact numbers**

- Enemies deal a minimum "piercing" damage per hit that Defense cannot reduce below, scaling with enemy level — measured minimums: L1/L10/L12 → 1, L35 → 8, L36–37 → 9; a second poster fits the floor as ≈ enemy level ÷ 4 ("piercing is estimated at (mob lvl/4)"). [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Measured Defense breakpoints against that floor (floor independently reported by 2 threads): at level 60, ~150 Defense forces same-level mobs down to their minimum (14 damage for that player); ~200–250 Defense recommended by level 80 for grinding. [Can someone explain how Attack and Defense, and Fire Attack and Fire Defense work?](https://web.archive.org/web/20151219190032/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486679-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work?page=1)
- The floor mirrors outbound: you always deal at least (your level ÷ 4) damage to enemies — Red Oni is the stated exception. [Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- 1 point of Attack ≈ +1 minimum and +1 maximum damage, "in balance stance at least" (player measurement). [Can someone explain how Attack and Defense…](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)
- **CONTRADICTION (damage formula):** hypothesis — damage = total ATK − target DEF (100–110 ATK, sword contributing 20–30, vs 90 DEF → 10–20 damage), posed as a question [Can someone explain how Attack and Defense…](https://web.archive.org/web/20151219190032/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486679-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work?page=1); countered in the same thread — "Actually I don't think that is quite right for atk and def", the numbers are not a clean subtraction [Can someone explain how Attack and Defense…](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)
- Piercing and Critical stats raise your minimum and maximum slash damage respectively. [Can someone explain how Attack and Defense…](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)
- Defense adds +1 per point but only mitigates sword attacks; veterans rate it near-worthless because piercing damage AND Chi/Ninja skills ignore it entirely — with the defense-ignoring skills gated by cooldowns (reported by 3 threads). [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- Worked piercing magnitude: a light-stance hit lands ~200 damage with piercing vs ~50 against defense without it (source phrasing ambiguous). [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Stance stat profile (reported by 3 threads): Heavy = highest attack but reduced defense and range — a wiki-derived claim (disputed in-thread) puts the defense loss at up to 20%, with the shortest range and slowest draw — and you take more damage if DEF is insufficient; Light = highest range, fastest draw, weakest attack; Balance sits between. [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- Duel damage extremes (reported by 3 threads): one-hit kills are real and by design — if a build's damage output exceeds the opponent's HP pool, one slash kills; a full HP/Defense build reduces incoming slashes to ~2 damage; a level-12 player saw PvP hits of 1–5 with occasional ~20 spikes; the 2015 PvP meta leaned on one-hit-kill builds. [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- **CONTRADICTION (Jul 2015 one-shot reports):** ~level-9 players one-shotting level-80s in PvP was reported as a damage bug by one player and attributed to hacking ("… Hack.") by another — both claims in [annoying glitch](https://web.archive.org/web/20200719050218/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518311-straw-hat-samurai-duels-annoying-glitch)
- PvP stance usage (Apr 2016): ~85% of duel players used Light stance, so Balance was recommended as the counter-pick. [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- **CONTRADICTION (Defense value in PvP):** claim A — Defense is needed but "realy less valuable than you imagine it"; claim B — Defense matters MORE in PvP: enough DEF holds balanced-stance hits to ~20 and stops heavy-stance one-shots, enabling counters. Both in [Can someone explain how Attack and Defense…](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)

**Systems and mechanics**

- Focus/crit system: a full focus bar enables a critical slash; boss fights end with a coup-de-grâce finisher; crits are aimed "preferably on the head" (locational damage); the anti-boss loop is crit → evade/reposition ("zip" across the screen; dashing while attacking in light stance kept Amaya from landing hits) → wait for the bar to refill. [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Stance counter-triangle: Light beats Heavy, Heavy beats Balanced, Balanced beats Light, with stance advantage "pushing enemy attacks higher" [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle) — supported by the Amaya counterpick advice ("Amaya … uses a heavy fighting style so using light would be most effective") [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya); disputed in-thread — any stance can beat any other on skill, "heavy is just the laziest and easiest".
- **CONTRADICTION (stance meta, multi-way):** (a) shift Light → Balanced → Heavy as you progress [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle); (b) "most of the server best players use Light stance for Shunpo and line range" (same thread); (c) "the worst fighting style is light so no one chose it" vs (d) "balance is best for first birth… light is too weak to one-shot kill mobs", both in [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build); (e) Light's air combo is a high-level PvP standout [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- **CONTRADICTION (Light-stance damage):** maxed Attack + a dragon blade but Light-stance skill only L3 → 2–3 damage on same-level bandits, with the claim the ATK stat is pointless for Light ("its intent is to make you faster attacker"); vs a post-rebirth player one-shotting bandits with Light all the way to level 50. Both in [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Stance-vs-enemy matchups: Onis and animals weak against Light; bandits weak against Balanced and Heavy; Light works on undead if you aim for the head, with advice to swap to Heavy against jumping zombies — softened in-thread by "Jumping undead actually have less hp than walking undead". [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- PvE heuristic: "use the lightest stance you can while still one-hitting trash mobs"; PvP endgame: rebirth several times and run a "ridiculously powerful" ninja/chi skill build. [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- Controls: attacks are drawn as slash lines with the mouse ("a tricky mechanic" needing practice) [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part); a drawn line can be HELD and released on timing — the core Red Oni technique: release at maximum closeness, then immediately dash through, ending beyond his club's reach [New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- Stance switching: pressing space quick-toggles stances but only if the focus bar is full enough [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle); in duels stance is normally pre-set by clicking your character portrait, and most players never switch mid-fight [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- AUTO SLASH mechanics (reported across 8 threads): a toggle in the top-left of the battle screen; when on, the character auto-fights with basic movement and slashes, including launches and executes once unlocked, and auto-targets enemies; it can be switched off mid-play; there is NO way to disable the launch while it is on (toggle requested, never added). [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- AUTO SLASH usage consensus: ON for beginners and grinding weak overworld mobs — Heavy stance + auto-slash was a go-to for most story fights and bounties [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help); OFF against Tengu, in PvP, against jumping undead (auto-targeting tracks jumping oni/undead badly), and against the Statue Guardian ("turn it off first thing, or you're toast"); a light auto-slash character was also reported to react slowly. [auto slash "on" or "off" ?](https://web.archive.org/web/20200718231337/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/494226-straw-hat-samurai-duels-auto-slash-on-or-off)
- Kunai projectiles can be dodged with jump or roll [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help); a "100% dodge roll" is referenced as an existing move players wanted given to more enemies [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- Run and roll are distinct traversal moves with different outcomes: rolling through the Statue Guardian gets you hit, running through avoids his attack [How do you beat the Statue Guardian?](https://web.archive.org/web/20200719095529/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487269-straw-hat-samurai-duels-how-do-you-beat-the-statue-guardian); left/right dashes stayed reliable against Red Oni after the Roll nerf [Stats bug](https://web.archive.org/web/20200719091952/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496971-straw-hat-samurai-duels-stats-bug), with dash direction matched to slash direction ("If you are slashing left, use dash left") [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)
- Ranged options: Kunais, Slashing Waves, and Charged Shot — usable even to hit enemies stuck off-screen [Weird glitch in NPC duels?](https://web.archive.org/web/20200719192254/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/548989-straw-hat-samurai-duels-weird-glitch-in-npc-duels); kunai are usable in duels but very hard to land [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- Clinch mechanic: locks two combatants together; a clinched enemy cannot kill the player's summoned clones while they attack it freely. [Red oni](https://web.archive.org/web/20200719020954/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492406-straw-hat-samurai-duels-red-oni)
- Stuns: Light's upswing attack can stun (repeated stuns decided the Chikako fight) [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help); every player slash stuns the Statue Guardian [How do you beat the Statue Guardian?](https://web.archive.org/web/20200719095529/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487269-straw-hat-samurai-duels-how-do-you-beat-the-statue-guardian); Chi Kick / Chi Punch serve as stun options against Amaya [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Elements: earth/water/wind/fire exist as single-element powers only (combining two was just a suggestion) [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels); players have a personal elemental type [Aoi Hoiru clan](https://web.archive.org/web/20200719021017/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/497808-straw-hat-samurai-duels-aoi-hoiru-clan); picking the element strong against an equal-rebirth opponent roughly negates their rebirth elemental ATK bonus [Rebirthing = 25 FREE Gold…](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- **CONTRADICTION (anti-Amaya stance):** light most effective because she fights heavy; vs "I used balanced stance btw.." (won at L36 after re-gearing); vs "Use heavy, the most powerful" with a claimed 1-hit kill. All three in [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Knockdown recovery matters: heavy-stance characters can fail to get up fast enough against fast bosses; Balanced has a "flip-up" recovery skill with no position penalties; Light's upward slash often leaves you positionally exposed. [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- Duel texture: duels open with both players picking stances (players hesitate, waiting for the opponent to commit); fast few-hit lethality is defended as intentional samurai-duel design; players categorize stances into speed vs damage roles; one veteran checklist ends with the unexplained tip "go red". [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- A "/allyroom" chat command allies all players in a room — typed manually before Tengu group-boss fights (auto-ally was only a suggestion). [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- New-player report (Nov 2016): "Everytime I attack, I get hurt" — attacks trade or are countered unless properly executed, and the correct method was not obvious to beginners. [Attack?](https://web.archive.org/web/20200718231938/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/683338-straw-hat-samurai-duels-attack)

*Closes/confirms:* the **Focus/crit gating rule** (full bar → crit + coup-de-grâce, blocker ⑤), the **DEF mitigation direction** and the **(level ÷ 4) minimum-damage floor** (confirms the items-equipment EnemyLevel/4 floor), the damage-formula shape (+1-per-ATK-point anchor; flat subtraction disputed), and stance scaling/counter-triangle — while reach-in-px, the crit multiplier, and early TTK stay open.

### skills-meters

**Exact numbers**

- 35 Speed (with ideal equipment) is the minimum to hit the 0.5× cooldown-modifier cap; the veteran any-stance build is: cap Attack, cap Health, exactly 35 Speed, 25 Defense. [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- The SPEED stat does two things — lengthens the slash line and reduces skill cooldowns (reported by 2 threads); whether range keeps scaling past the 35 cooldown cap was asked and never answered. [Speed stat](https://web.archive.org/web/20151228185458/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487053-speed-stat?page=1)
- Dash Left and Dash Right are separate skills costing 2 Chi per use; the chosen direction must match which side of your character the enemy is on. [New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- Killing a Red Oni purely by dash-through needs at least 80 Chi total (2 Chi × ~40 passes against its ~40 HP). [New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- AP energy system: each battle costs 1–2 AP; at 0 AP you can still fight but with a severe combat stat penalty; sleeping at an inn instantly restores all AP and is always affordable relative to silver income. [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Energy and AP are separate meters: food restores energy (riceballs give more than meat or fish), no food restores AP, and the Inn is a paid sleep service. [ITT: Things you want to see in the game](https://web.archive.org/web/20200719131437/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490507-straw-hat-samurai-duels-itt-things-you-want-to-see-in-the-game)
- A Level 3 Chi Punch one-shots Bandits up to enemy level 23; a Level 3 Chi Kick one-shots Bandits up to about level 59 (the poster self-flagged the 59 as uncertain) — also implying Bandits exist to at least ~L59. [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Shadow Clone: at level 2 the clone gains the ability to attack (a detail the official wiki omitted) [Anyplace where i can find a guide ? Wikipedia ?](https://web.archive.org/web/20200719085750/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487451-straw-hat-samurai-duels-anyplace-where-i-can-find-a-guide-wikipedia); level 3 costs 6 skill points [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle); the clone ability unlocks only at a very high level [Red oni](https://web.archive.org/web/20200719020954/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492406-straw-hat-samurai-duels-red-oni)
- The /seppuku emote is mechanically real: it plays a self-sacrifice animation and sets your HP to exactly 1 (non-lethal). [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- The default coin pouch caps at 1000 coins; a levelable "Coin Purse(+)" skill under Skills → Survival Skills raises the cap, and it is a separate skill from the one raising carry weight (reported by 4 threads). [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- Full stat roster = 17 stats: Attack, Defense, Speed, Critical, Pierce, HP, Chi, HP Regen, Chi Regen, plus Water/Fire/Earth/Wind Attack and Defense. [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Each element's skill tree has 4 actives of fixed archetypes: an elemental kunai, a land mine, a chi-punch-like strike, and an AOE. [Rebirthing = 25 FREE Gold…](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)

**Skill tree, cooldowns, and meters**

- **DEV:** Lutgames confirmed the Survival category's "Carrying Weight+" skill (raises inventory weight capacity) and that Scavenging Level 2 lets you sell junk on the spot — the Scavenge-L2 auto-sell corroborated by player posts in a second thread. [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle); [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Scavenger at level 5 unlocks secret ninja paths used as fast-travel routes (reported by 2 threads, one citing the wiki secondhand; the paths don't lead everywhere). [HOW DO I FAST TRAVEL?](https://web.archive.org/web/20200719190518/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487363-straw-hat-samurai-duels-how-do-i-fast-travel)
- The Roll skill has at least 3 levels. **CONTRADICTION (Roll L3 nerf cause):** L3 was originally understood as 100% avoidance, and after an alleged unannounced update players died mid-roll to Red Oni — one camp calls it a stealth nerf/bug [Stats bug](https://web.archive.org/web/20200719091952/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496971-straw-hat-samurai-duels-stats-bug); another says "A level 3 roll only guarantees a higher chance to not getting hit" and believes it was a deliberate balance nerf [New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni). Roll L3 with perfect timing could still beat Red Oni without dashes [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)
- Focus-gated crit-evade: with a full focus bar in Light stance you can draw and HOLD a forward slash, releasing into an enemy wind-up — "The crit evade will ensure that you won't get hit"; the technique's viability is gated by a good SPEED stat. [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)
- The critical bar appears to reset with each slash regardless of equipped weapon; the poster's question about "amount depleted" implies partial depletion by design (no dev answer captured). [nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- Chi skills have long cooldowns and limited PvP use; guide advice was to bank skill points until the post-rebirth elemental trees unlock. [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- A skill named Shunpo exists; players wanted its (and other skills') cooldowns reduced, and a no-cooldown event mode existed only as a suggestion — cooldowns apply broadly. [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- Cooldowns recharge outside PvP rooms — campers enter with powerful skills "ready to trigger"; dying in a PvP room does NOT restore HP or chi on respawn (a fairness fix was requested, not present). [Make pvp room fair](https://web.archive.org/web/20200719193940/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493858-straw-hat-samurai-duels-make-pvp-room-fair)
- Stance upgrades live in the skills screen — stance damage and range are upgradable [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1); veteran advice: max one stance's tree before spending on others [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Named special moves include Deadly Touch, Heavenly Sword, Kunai, Windmill Kunai, Chi Punch, Chi Wave, and Chi Kick. **CONTRADICTION (Heavenly Sword):** rated one of the "most beautiful attacks in game that are completely impractical" [Special Moves Discussion](https://web.archive.org/web/20200719072511/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/502023-straw-hat-samurai-duels-special-moves-discussion) vs a report of killing boss Amaya with it ("I can kill her with heaven sword") [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Skill families: Ninja skills (Shadow Clone, Smoke Bomb) are defensive/damage-avoidance; Chi skills (Slash Wave, Focus) are high-damage offense that put you in danger. [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Stat-point sinks are HP, armor/defense, attack, speed, and CHI (the resource is named "Chi"); dumping everything into CHI is a known newbie mistake [I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part); veterans advise zero points into AP — any Chi you need comes easily from equipment [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- Chi skills are not normally usable inside the dojo (PvP practice area); observed use there was contested — one player called it hacking, another a known glitch. [Report hackers here](https://web.archive.org/web/20200719115839/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492905-straw-hat-samurai-duels-report-hackers-here)
- Ranged skill kit vs Red Oni: Kage Bunshin (shadow clone) + kunai + other ranged skills, rolling away whenever it closes distance. [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)

*Closes/confirms:* per-skill Chi costs (Dash L/R = 2 Chi — blocker ①), the SPD→cooldown formula anchor (0.5× cap floor reached at 35 SPD — blocker ④), Focus numerics direction (crit-evade hold, bar reset per slash — blockers ③/⑤), and Shunpo context (Light-stance signature skill, long cooldown — blocker ②); the crit **proc** rule remains open.

### enemies-ai

**Exact numbers**

- Boss Chikako (Episode 3) throws kunai for 20 damage each — the fight's main threat; player claim (unconfirmed): she stops throwing when you stay at close range, so the counter is staying close and using Chi Fist. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Boss Amaya: ~60 damage per hit and 3-hit kills level-30 players (two independent in-thread reports); reportedly level 36 (advice: out-level toward 50); wields a long-reach melee weapon that punishes approach and idles ("sleeping") at fight start, allowing openers. [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Red Oni stats/economics: roughly 40+ HP; always a single-oni encounter; grants zero XP with poor drops (worth killing only for its achievement); found sleeping on the world map, and a wrong-place spawn (e.g. in front of a city) is rerolled by refreshing the game. [New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- Statue Guardian (main-story boss around player level 28): kills even a high-DEF player in roughly two hits; an allied archer NPC participates and can chip it to half HP while the player evades. [How do you beat the Statue Guardian?](https://web.archive.org/web/20200719095529/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487269-straw-hat-samurai-duels-how-do-you-beat-the-statue-guardian)
- In July 2015 the Oni rock throw hit for 57 damage in a single hit, reported as a glitch. **DEV:** Lutgames confirmed the bug and posted "oni rock bug fixed" the same day (Jul 24, 2015) — evidence of rapid server-side hotfixing. [annoying glitch](https://web.archive.org/web/20200719050218/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518311-straw-hat-samurai-duels-annoying-glitch)
- Tengu (reported by 3 threads): an AI-controlled rare/event monster that occasionally invades the dojo (not findable by normal exploration); landing the last blow awards 10 gold tokens; a group boss — "easy … with people" but repeatedly lethal solo (one author died dozens of times learning its moves); beaten with Red-Oni tactics (hit-and-run plus thrown/ranged attacks). [WTH is a Tengu? Is it a giant world boss? Berry man? Banana Town?](https://web.archive.org/web/20200718230924/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491788-straw-hat-samurai-duels-wth-is-a-tengu-is-it-a-giant-world-boss-berry-man-banana-town); [Tengu cave and possible way to find it](https://web.archive.org/web/20200719214639/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/511194-straw-hat-samurai-duels-tengu-cave-and-possible-way-to-find-it)
- Mob damage is deterministic per level: all same-level mobs deal identical damage barring skill use (testable by removing equipment); higher-level mobs have a higher minimum-damage floor; bosses require substantially more defense than same-level mobs. [Can someone explain how Attack and Defense…](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)

**Roster, behaviors, encounters**

- Red Oni behavior: attacks with a huge long-reach club; a swing starting near its back was very hard to avoid; it has a sleep state you can wait out to pass safely; one player claims its design purpose is anti-bot (killing hackers' leveling bots). [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)
- **CONTRADICTION (Red Oni killability):** early "impossible fight" claims vs later reports it IS killable — a kill screenshot (2016) and a claim of 11 kills (2018), "Red onis can be defeated smh". Both sides in [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Red Oni bot-clinch exploit: absent/idle players are represented by AI bots; a bot clinching the Red Oni can neither be killed by it nor damage it — freezing the boss while the player's clones kill it (clones normally CAN be killed by it). [Red oni](https://web.archive.org/web/20200719020954/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492406-straw-hat-samurai-duels-red-oni)
- Red Oni is the stated exception to the (your level ÷ 4) minimum-damage-dealt rule — i.e. unusually high defense ("Cept the red oni. Cause they stink."). [Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Low-confidence claim: killing the Red Oni yields "one sho" (term unexplained; another poster in-thread did not recognize it). [Red oni](https://web.archive.org/web/20200719020954/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492406-straw-hat-samurai-duels-red-oni)
- **DEV:** more enemy types were planned — Lutgames confirmed twice, on Apr 13, 2015 ("We will be adding even more enemies later!") and Apr 20, 2015 (reported by 2 threads). [are there any mythical enemys i can kill?](https://web.archive.org/web/20200719190457/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487314-straw-hat-samurai-duels-are-there-any-mythical-enemys-i-can-kill); [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- The launch-era roster was small and a common complaint (a 15-post thread demanded more types): early overworld enemies are human bandits (which can carry shields) with oni as the first non-humans; the mid-game complaint roster is "BANDITS, ZOMBIE, AND ONI"; the common oni is a bland blue variant with almost no techniques. [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- Rarer roster entries: mermaids and kappa exist ("albeit ugly"); a stag (the reference fast charging-animal archetype); deer and bear as huntable overworld animals; ninja enemies are extremely rare (~one occasionally assisting a boss); a yurei (mentioned 2017) with a unique scythe and clothing; the cast is summarized as Samurai, Ninja, oni, and tengu; Benzaiten is a notably tough female opponent [Show off a picture of your awesome character here](https://web.archive.org/web/20150919133214/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488448-show-off-a-picture-of-your-awesome-character-here?page=1); other entries in [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- Zone scaling: as zone level rises, enemies get "more…numerous and disgruntled" — more numerous/aggressive rather than new types. [Rebirthing = 25 FREE Gold…](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Undead behaviors: zombies can jump, and jumping undead have LESS HP than walking ones; undead walk very slowly, sometimes not moving at all (a stuck bug making them free kills — relogging was the community fix); some missing spawns self-resolved after about a minute, suggesting a delayed-spawn timer. [Weird glitch in NPC duels?](https://web.archive.org/web/20200719192254/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/548989-straw-hat-samurai-duels-weird-glitch-in-npc-duels)
- **CONTRADICTION (oni grind difficulty):** onis give the same EXP as bandits, are less dangerous, and never carry shields (bandits do) vs "But Oni's are too fast to dodge." Both in [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Ninja survival mission: ninjas can duplicate into a clone that dies to a single hit; the fight is winnable without attacking at all — dodging in light stance suffices. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Charging deer (reported by 2 threads): counter is to run away and slash backwards in front of your character while fleeing — you turn and hit them mid-charge [auto slash "on" or "off" ?](https://web.archive.org/web/20200718231337/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/494226-straw-hat-samurai-duels-auto-slash-on-or-off); alternative light-stance counter: slash up above them, then drop down attacking near their rear [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Wolves: a Chi Punch that fails to kill a wolf paralyzes it (unable to move or attack) — recommended against bosses that use wolf packs as meat shields. [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Dungeon/boss structure: encounters are wave-based — wolves spawn first and the boss NPC appears only after the waves are cleared; dungeon bosses include a bandit leader and a Ronin samurai (an NPC also seen roaming the world; can be female) [Weird glitch in NPC duels?](https://web.archive.org/web/20200719192254/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/548989-straw-hat-samurai-duels-weird-glitch-in-npc-duels); the final dungeon ends in a two-part finale — a conventional boss fight then a harder survival (wave-outlasting) encounter [(fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20200719005252/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488106-straw-hat-samurai-duels-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon)
- Clan-war AI: an unjoinable AI-controlled bandit faction holds map squares and is deliberately weak — "pretty much free squares to whoever bothers attacking them". [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- AI opponents: difficulty-tiered "regular difficulty AI opponents" exist and are distinct from "player AI opponents" — AI-controlled copies of player characters (likely offline duel opponents). [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- Bounty-hunt targets are dramatically stronger than the L24–25 mobs of their own areas and use many special moves. [Difficulty curve around lvl 28. Anyone else think so?](https://web.archive.org/web/20200719145607/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487109-straw-hat-samurai-duels-game-crash-bug)
- Hunting regular mobs drops equipment of varying quality — good drops common enough that veterans gift spares to new players. [KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20151219190542/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/498595-ki-sensu-the-golden-fan-recruitment-thread?page=1)
- Tengu, Red Oni, and "heavy bosses" are named as extremely strong enemies that can evade a first slash (wiki-derived claim). [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)

*Closes/confirms:* per-enemy HP (Red Oni ≈40 — blocker ②), enemy level→stat anchors (same-level damage determinism + minimum-damage floor ≈ level/4 — blocker ①), boss-roster damage numbers (Chikako 20/kunai, Amaya 60×3-hit, Statue Guardian ~2-hit, Tengu 10-token, oni rock 57 pre-fix), and spawn/aggro texture (sleep states, wave-gated boss spawns, spawn rerolls, delayed-spawn timer — blocker ④); telegraph/stagger frames stay open (blocker ③).

# PART 2 — World, quests, UI, meta-social, rebirth, art (SYNTHESIZED)

### world-exploration

- The world map is a territory grid addressed by numeric coordinates with optional in-territory sub-sector coordinates (e.g. "24,52 (5,0)"); named places sit on the grid — Hiratani castle town at (43,44), a contested castle at (15,61) — reported by 3 threads. [mines](https://web.archive.org/web/20150912051345/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487127-mines?page=1)
- Crowdsourced mine ledger: ~40 mine coordinates; each mine yields one common ore (Copper or Tin, occasionally None) plus a rare ore that is near-universally Diamond; ledger rows carry a level value ~30–31 ("12,69 | Tin | Diamond | 30", "43,45 | Tin | Titanium | 31"). [mines](https://web.archive.org/web/20150912051345/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487127-mines?page=1)
- Mine placement quirks: the mine at 50,46 is "UNREACHABLE!"; 53,35 holds 2 mines; 46,40 and 46,41 are confirmed mineless; None/Diamond mines exist at 37,52 and 50,40; a mine sits as far out as sub-sector 5,5. [mines](https://web.archive.org/web/20200719145615/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487127-straw-hat-samurai-duels-mines)
- ⚠️ **CONTRADICTION (ore roster):** "I have not seen coal, silver, iron or titanium" (Apr 21 2015) [mines](https://web.archive.org/web/20150912051345/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487127-mines?page=1) vs a Tin/Titanium mine listed at 43,45 by mid-May 2015 [mines](https://web.archive.org/web/20200719145615/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487127-straw-hat-samurai-duels-mines) — most plausibly a content addition between posts, not an error.
- Optimal gear farming at the ~level-28 wall: level 27–29 caves — oni are far easier to farm than bandits, caves have no boss fight and are shorter; one night of drops greatly improved stats. [Difficulty curve around lvl 28](https://web.archive.org/web/20200719085726/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487402-straw-hat-samurai-duels-difficulty-curve-around-lvl-28-anyone-else-think-so)
- Grinding loop: go to a territory 3 levels above your own and run its dungeons repeatedly; open-world bandit encounters come in waves (3-wave groups) and can be entered/exited repeatedly; refreshing the client re-rolls bandit spawn locations. [How to grind for Levels and EXP](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- World areas are level-rated by convention — players reference "lvl 34/35/37/49 areas" — and the "blue island" (Aoi territory) is roughly a level-20 zone; reported by 2 threads. [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20151231131743/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489368-add-more-types-of-enemies?page=1)
- The map mirrors real Japan: Kyushu (southern island), Hokkaido, the Kanto bay, Chugoku, and Tohoku are all named contestable regions; reported by 3 threads. [Aoi Hoiru clan](https://web.archive.org/web/20150927190714/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan)
- Traversal is sign-to-sign along paths; enemy positions persist while you zone out, so exiting through a signpost and immediately re-entering respawns you at the sign ahead of a walking enemy (community exploit). [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Location taxonomy referenced as existing: oni dungeons, field paths, towns, Kanji ruins, graveyards, caves, ruins, forests, mines, castles (with a flagroom holding a capturable flag), and dojos. [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20151231131743/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489368-add-more-types-of-enemies?page=1)
- Every Dojo contains PvP practice rooms for slash training plus a Trap Challenge that new players found long and frustrating; reported by 3 threads. [I don't get the dueling part](https://web.archive.org/web/20160101011150/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489310-i-dont-get-the-dueling-part?page=1)
- Trap Challenge design: a multi-room gauntlet where most rooms are trivial but one room combining a rolling stone ball with a saw is a sharp spike — the ball's hitbox far exceeds its sprite, you fall back onto the pressure plate and re-trigger it, and the intended solution is clicking a sign at the right moment (believed to retract the saw); its reward/purpose was never communicated in-game. [Trap challenge: Rolling stone ball](https://web.archive.org/web/20160101034759/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486900-trap-challenge-rolling-stone-ball?page=1)
- Trap Challenge bugs: players could get stuck immobile suspended over the bamboo spikes after the jump pads, and respawn placement could drop you adjacent to a spike ball for an instant hit. [trap chalenge glitch](https://web.archive.org/web/20200718235342/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486590-straw-hat-samurai-duels-trap-chalenge-glitch)
- Episode 12 contains an instant-kill pillar gauntlet gated by a lever: pull it, then cross right-to-left before the timer; players found no reliable timing and spam-clicked the exit to pass. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Final-dungeon checkpoints: dying at the boss respawns you in the room before it, and walking backwards shows "traveling to checkpoint" and warps you forward — originally trapping players inside (thread later marked "(fixed)"); relogging the next day placed the trapped player outside the dungeon. [(fixed) Stuck at final boss](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1)
- Fast travel: **DEV:** the Dojo Recall Scroll consumable teleports you to the nearest dojo (Lutgames) [HOW DO I FAST TRAVEL?](https://web.archive.org/web/20200719190518/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487363-straw-hat-samurai-duels-how-do-i-fast-travel); the /recall chat command teleports you to the Dojo in your clan's territory [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1); stables offer paid travel but not every village has one and each serves only specific cities [ITT: Things you want to see in the game](https://web.archive.org/web/20200719131437/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490507-straw-hat-samurai-duels-itt-things-you-want-to-see-in-the-game); "speed boots" are named as a further aid (terse claim). Reported by 4 threads.
- Statues stand in dungeons and along the main quest; performing a dragon dance activates them for coins, clothing items, and temporary buffs. [Questions](https://web.archive.org/web/20170427091012/http://www.kongregate.com:80/forums/12-kongregate-multiplayer-games/topics/494653-straw-hat-samurai-duels-questions)
- Towns contain inns that fully restore health and mana; destroyed/closed towns force travel to an intact one, and the Peddler vendor only appears in villages that are not destroyed. [Have the option to burn our own villages?](https://web.archive.org/web/20200719005133/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/510653-straw-hat-samurai-duels-have-the-option-to-burn-our-own-villages)
- Towns apparently cannot be attacked by players, and the town housing district was purely decorative — no gameplay function. [Q&A](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels?page=2)
- Villages can exist in a destroyed state and be rebuilt by clan effort (e.g. "destroyed villages like tomoharah"). [AKA RYU ROLE CALL](https://web.archive.org/web/20200719183224/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/495568-straw-hat-samurai-duels-aka-ryu-role-call)
- Boss areas are not lock-ins: you can leave the Amaya cave, level up (e.g. to 36) and gear up, then return. [How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- A hidden Tengu cave reportedly exists whose location changes over time and which requires unlock conditions to enter; killing its Tengu yields rare loot (secondhand player claims). [Tengu cave and possible way to find it](https://web.archive.org/web/20200719214639/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/511194-straw-hat-samurai-duels-tengu-cave-and-possible-way-to-find-it)
- ⚠️ **CONTRADICTION (hidden sectors):** off-map sectors 82,53/82,54 exist as developer "de-bugging territories, testing territories" enterable only via recall stone, with a screenshot posted (and a claim 82,53 was "the old house of ryu") vs the player who surfaced the coordinates insisting "there is no such thing as 82,53/82,54 i was trolling u" — both in [82,53/82,54](https://web.archive.org/web/20200719163919/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/628561-straw-hat-samurai-duels-82-53-82-54); an "80-something" territory find and belief in many private dev areas corroborates hidden sectors [Q&A](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels).
- ⚠️ Disputed: a "Banana Town" reachable via glitch was claimed by one player, denied by another, and never evidenced. [WTH is a Tengu? Berry man? Banana Town?](https://web.archive.org/web/20151231125651/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491788-wth-is-a-tengu-is-it-a-giant-world-boss-berry-man-banana-town?page=1)
- A "hell" area exists and was reachable by accident — an error-recovery respawn placed one player there, and another screenshotted "Somehow got in hell"; reported by 2 threads. [Report hackers here](https://web.archive.org/web/20200719115839/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492905-straw-hat-samurai-duels-report-hackers-here)
- Water hazards keep damaging the player even while knocked down. [annoying glitch](https://web.archive.org/web/20200719050218/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518311-straw-hat-samurai-duels-annoying-glitch)
- At least one screenshotable location has a glowing/luminous background scene. [Cool Screenshot](https://web.archive.org/web/20151020164626/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495163-cool-screenshot?page=1)

Closes/confirms: chips at world-exploration blocker ① (world bounds + geography — coordinate extent from 5,5 to 82,53 plus Japan-region naming), blocker ② (mine ore-pairing/level data, though yield-per-swing tables stay open), and blocker ⑤ (sector↔room mapping via sign-to-sign nodes); corroborates the ready-list travel-methods set and prosperity/destroyed-town ladder; adds new unknown-unknowns (hidden debug sectors, hell area, inn full-heal rule).

### quests-story

- Episode 8's boss is a giant volcano-coloured Statue Guardian killed via a scripted mechanic — run through/distract it while ally NPC Mitsuo fires arrows; standing too far away makes it throw boulders — and it is a hard story gate coinciding with the ~level-28 difficulty spike; reported by 2 threads. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Episode 10 "Oni Caves" has a Red Oni designed to be avoided, not fought: "wait for the oni to sleep or look like its tired,then run through it". [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Episode 10 also has a castle assault with a "Build a ladder" objective: find a transparent ghost-outline ladder and stand channeling until its progress bar fills; the gate is strict — even clearing every enemy inside leaves the quest stuck until the bar completes. [Quest: Build a ladder](https://web.archive.org/web/20200719153800/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/524342-straw-hat-samurai-duels-quest-build-a-ladder)
- Episode 11 includes a timed survival mission: stay alive 2 minutes against enemy waves. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Episode 12 sequence: Amaya boss, then a survival segment against Gojo/Takamori in "dead form" (Takamori uses a devastating Chi Slash); you can bring another player as an ally or survive "by 'flying' and rolling". [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- The final story dungeon ends in two boss encounters: a normal boss fight followed by a survival encounter. [(fixed) Stuck at final boss](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1)
- Amaya is an eyepatch-wearing woman serving the main antagonist Lord Tamakori, fought in a cave around player level 30. [How does one beat Amaya?](https://web.archive.org/web/20160101020844/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/503551-how-does-one-beat-amaya?page=1)
- Season 1 ends at Episode 12; the next episode was still unreleased as of Aug 2016 and the storyline was never concluded; reported by 3 threads. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Season 2 timeline: players waited ~1 year by early 2016, ~2 years by Sept 2016, and it was still absent in May 2017. ⚠️ **CONTRADICTION:** "There will not be a season 2,the developer have quit" (Feb 25 2016) vs "season 2 is almost done. but they have other updates and bug fixes coming first" (Feb 28 2016), both in [SEASON 2](https://web.archive.org/web/20160316203819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/583212?page=1); an Apr 2016 poster countered the dev hadn't quit but needed support/funding [SEASON 2 (later capture)](https://web.archive.org/web/20200719172013/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/583212-straw-hat-samurai-duels-season-2).
- The story questline gives strong XP, introduces the mission/dungeon types, and carries a new player to roughly level 30–40. [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Story quests award farm crops (meant to be sold; inventory weight matters) and a kitten; the kitten is story-linked and droppable/killable, and a "story reset scroll" lets you replay the story — a repeatable kitten source; reported by 2 threads. [I'm Sorry guys but](https://web.archive.org/web/20200719015259/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/601813-straw-hat-samurai-duels-im-sorry-guys-but)
- Quests can be turned in remotely: the scroll tab lists accepted quests, redirects the map to each quest's location, and offers "finish quest" without returning to the NPC. [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Quests reward money AND influence; exploit: if a quest lends gear you'd surrender at turn-in, abandoning and redoing it keeps the item plus the money and influence. [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- The quest log has a max active-quest cap; a full log broke the Prologue/Dojo tutorial (NPCs teach stances and skills, with no way to drop a quest mid-tutorial). **DEV:** Lutgames' workaround was refresh + the abandon-quest button, and he patched the bug within one day (reported Apr 7, fixed Apr 8 2015). [Bug with Prologue quests](https://web.archive.org/web/20200719035108/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485740-straw-hat-samurai-duels-bug-with-prologue-quests-if-you-already-have-max-quests)
- NPC villagers hand out gathering quests tied to local resources — one near 43,45 demanded titanium (a rare ore). [mines](https://web.archive.org/web/20150912051345/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487127-mines?page=1)
- Episode 1 includes a battle against Inokichi; a beta bug could load it with no enemies, soft-locking until refresh. **DEV:** Lutgames' triage distinguishes "normal battle" vs "story battle" as separate instance types. [bug plesse fix](https://web.archive.org/web/20200719172239/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485618-straw-hat-samurai-duels-bug-plesse-fix)
- Clan lore (in-game blurbs, repeated by 3+ threads): Midori Ken (Green) led by Lord Daichi, the late Shogun's right-hand who proclaimed himself Shogun, rules the South-East; Aoi Hoiru (Blue) led by shrewd Lord Yoshio, South-West; Ki Sensu (Yellow) led by Lady Tsubasa, a prosperous non-confrontational merchant clan; Aka Ryu (Red) led by Lord Tsuyoshi, who armed on hearing of the Shogun's illness — the Shogun's death triggered the war. ⚠️ **CONTRADICTION:** the same lore post lists BOTH Ki Sensu and Aka Ryu as ruling "the North-East" (likely a typo — North-West probable for Red) [State of the Clan War (page 2)](https://web.archive.org/web/20160718180457/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/486220?page=2), while another player places Yellow "in the west" [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us).
- Wiki-sourced clan characterizations: Green seeks the shogun's power; Red are bandits/rebels using radical means; Yellow is a merchant clan whose leader is a figurehead ruled by a profit-driven council; Blue is a small clan led by a wise general aiming to unite the factions. [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- Each clan's in-game story is only about a 3-line blurb — the clan narrative layer is minimal. [The clan to join is Aka Ryu (page 3)](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=3)
- Season 1 plot: a mysterious faction called "The Kakuremichi" drives events; Shinmen dies on-screen ("Shinmen died. Or did he?" — suspected faked death/traitor twist); Hiroshi and the shogun's son are left unresolved for the planned Season 2. [Season 2 theories — Who are The Kakuremichi?](https://web.archive.org/web/20151231124523/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487973-massive-spoilers-within-season-2-theories-and-ideas-who-are-the-kakuremichi?page=1)
- Shinmen wears blue garments but belongs to the Shira Tancho clan — a story-only clan distinct from the four player color clans. [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- Series continuity claims: in SHS1 you capture Aka's flag and it turns into Aoi's flag, so players tie the straw-hat protagonist to Aoi Hoiru [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1); ⚠️ **CONTRADICTION:** "Aku Ryu (Red Clan) is the bad guy in Straw Hat Samurai 1 and 2" vs another player's counter that Duels has no canonical good/evil clans [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle).
- Launch-era quest/dialogue text contained typos and Japanese-usage errors; the correction screenshots are unrecoverable from the archive. [Typos and Japanese corrections](https://web.archive.org/web/20151231131323/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487967-typos-and-japanese-corrections-here-spoilers-within-post-more?page=1)
- Player-authored lore (RP-flavored, treat as claim): Lady Tsubasa is "the youngest daimyo of the Four Daimyos" — supporting four principal NPC clan lords. [KI SENSU — The Golden Fan](https://web.archive.org/web/20200719143214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/498595-straw-hat-samurai-duels-ki-sensu-the-golden-fan-recruitment-thread)

Closes/confirms: directly chips at quests-story blocker ② (Ep4–12 undocumented — concrete mechanics now sourced for Ep8, Ep10 ×2, Ep11, Ep12, and the final dungeon), corroborates the quest-log cap (QUEST_LOG_CAP) and reward tuples (money + influence + item-lend), extends the archetype taxonomy (timed survival, build-channel, ore-gather), and thickens the Season-1 plot spine + clan-blurb lore; verbatim-dialogue blocker ① remains fully open.

### ui-hud

- The /whoisonline chat command caps output at 20 players even when more are online. [Suggestions Thread](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- A 'stats' button (upper-left of the player window/menu) shows your real computed min/max damage and how attack/defense/range change with each stance; reported by 2 threads. [Can someone explain Attack and Defense…](https://web.archive.org/web/20151219190032/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486679-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work?page=1)
- Stance is set pre-fight by clicking your own character portrait; in battle, Spacebar quick-toggles stances gated on the Focus bar being full enough; reported by 3 threads. [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Skills fire via preset number-key keyboard shortcuts. [I don't get the dueling part](https://web.archive.org/web/20160101011150/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489310-i-dont-get-the-dueling-part?page=1)
- The AUTO SLASH toggle button sits top-left of the screen during battle, and no hotkey exists to toggle it (hold-SHIFT temporary-off was only proposed); reported by 2 threads. [auto slash "on" or "off"?](https://web.archive.org/web/20150920124446/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/494226-auto-slash-on-or-off?page=1)
- Chat emote commands work from normal or trade chat: /bow, /kneel, /fart, /gangnamstyle (dance + speech line), /sit (randomly one of 3 poses: cross-legged, seiza, plain), /rest, /stand (clicking away also stands you), /seppuku, /shoulderweapon; all emotes are disabled during duels. [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Utility chat commands: /recall (typed in chat, the community unstuck/teleport remedy) [(fixed) Stuck at final boss](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1) and /ignore <name> to mute players — with no ignore button on profiles [So, so, so many spammers](https://web.archive.org/web/20151231022234/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489549-so-so-so-many-spammers-in-the-game-chat-a-suggestion-to-fix-it?page=1).
- A dedicated TRADE chat channel was added mid-May 2015 alongside ALL; it launched with an inverted-scroll bug fixed within about a day, and PAGE UP/PAGE DOWN keys scroll the chat window. [So, so, so many spammers](https://web.archive.org/web/20151231022234/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489549-so-so-so-many-spammers-in-the-game-chat-a-suggestion-to-fix-it?page=1)
- ⚠️ **CONTRADICTION (clan chat):** several threads describe per-clan chat channels — even three channels (global, clan, war-room) plus a war-room message board — [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us) — while May–June 2015 threads say no clan chat existed and request it as a feature [Moderator is unbearable](https://web.archive.org/web/20200719045139/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/508075-straw-hat-samurai-duels-moderator-is-unbearable). Likely added later in 2015; the timeline is unresolved.
- The chat history buffer is very short — messages scroll out of view quickly; reported by 2 threads. [chatroom tabs suggestion](https://web.archive.org/web/20151231070614/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495200-suggestion-chatroom-tabs?page=1)
- War Room UI strings: a territory-prefixed error line ("Terumura: No available HQ in this territory") and a live countdown to the army tick ("Troops will attempt sector capture in 4:25:10"); entry can be refused with "You are not allowed to enter this war room territory." [Not able to spend move points in War Room](https://web.archive.org/web/20150907063607/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492295-not-able-to-spend-move-points-in-war-room?page=1)
- War-room defeats show a "You have been defeated in the war room" popup, and the message log normally records "<attacker> defeated <player>" entries (its absence during an ejection bug was flagged as anomalous). [war room troubles](https://web.archive.org/web/20151219185841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490211-war-room-troubles?page=1)
- The War Room contains a clan message board (separate from chat) where commanders post standing orders and members leave questions. [KI SENSU — The Golden Fan](https://web.archive.org/web/20160725161015/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/498595-ki-sensu-the-golden-fan-recruitment-thread)
- The War Room demolish button has no confirmation safeguard; accidental presses destroyed clan structures and "caused distrust in the clan." [Suggestions Thread](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- In the merchant shop, double-clicking an item buys it instantly with no confirmation — one player drained all their coins by accident. [Suggestions Thread](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Stat-point allocation has no confirmation step: clicking the HP/Chi/AP area instantly spends a point (and could close the item-stats window), with no undo. [This game needs "Confirm" button](https://web.archive.org/web/20200719024749/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486485-straw-hat-samurai-duels-this-game-needs-confirm-button-when-adding-stat-points)
- Duel UI: clicking an opponent's name shows their online status and whether they declined your challenge. [Duel Bug](https://web.archive.org/web/20200719122510/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485970-straw-hat-samurai-duels-duel-bug)
- **DEV:** when the server is down, a rotating icon sticks in the top-right corner — the visible sign saves are failing; the title screen shows your saved character with equipped armor, weapons, face, and gender [Is there a save point?](https://web.archive.org/web/20200719000600/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/543984-straw-hat-samurai-duels-is-there-a-save-point); there is no manual save button [Problem With Saving?](https://web.archive.org/web/20160908184735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/523146-problem-with-saving?page=1).
- The SPEED stat has no in-game explanation anywhere; its per-point cooldown-reduction magnitude went unanswered. [Speed stat](https://web.archive.org/web/20151228185458/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487053-speed-stat?page=1)
- In the item-transfer UI, the orange item goes in the "design" slot — wrong-slot placement was commonly misread as a bug. [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- No player search bar exists in the UI (requested feature). [Suggestions Thread](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)

Closes/confirms: fills the keybinding/hotkey map (Spacebar stance, number-key skills, no auto-slash key — feeds ui-hud blocker ④'s skill-slot picture), documents the stats screen (a measurement path for the DEF/SPD curves in progression blocker ①), pins War-Room UI strings + countdown behavior, and catalogs chat channels/commands + no-confirm interaction hazards; dialogue-box/pause metrics (blocker ⑤) stay open.

### meta-social

- World Battle territory snapshot, late Apr 2015: Red held 76 territories vs Blue's 200. [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Player clans unlock "player clan gear" by reaching 40 controlled territories. [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- War-room progression uses military ranks gating per-rank move allowances with a visible progress counter — a 2-day-old player was a "4 move Corporal at 96/180"; the rank chart is game-provided and identical for every clan. [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- Army resolution runs on a 24-hour global timer per capture/defend attempt: at the tick, troops in each sector cancel one-for-one and the surviving side wins; the UI shows the live countdown. Personal move points refresh hourly ("I come back after the hour with my new moves") [war room troubles](https://web.archive.org/web/20151219185841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490211-war-room-troubles?page=1) — ⚠️ tension: one player also describes banking daily "war room turns" [How much time you spent playing](https://web.archive.org/web/20200719152626/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/525884-straw-hat-samurai-duels-how-much-time-you-spent-playing-this-game); hourly-vs-daily allowance not fully reconciled. [Not able to spend move points](https://web.archive.org/web/20150907063607/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492295-not-able-to-spend-move-points-in-war-room?page=1)
- Missions convert towns to clan control via points: a level-80 doing missions in a ~level-20 zone earns ~15 conversion points per run, so 10 players yield ~150; PvE questing inside a territory also "defends" it — reported by 3 threads. [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- Inviting a player into a private clan costs the clan 5 gold per invite. [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Leaving a clan: buy a Writ of Release for 25 gold, trade one from another player (writs are tradeable), accept a player-clan invite (direct transfer), or delete/reset your character (easy below ~level 20); leaving forfeits your rank and clan gear, re-earned from scratch — reported by 2 threads. ⚠️ **CONTRADICTION:** "be kicked by the leader" is listed as an exit route [Ways to leave a clan](https://web.archive.org/web/20150907200432/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan?page=1) vs screenshot-backed reports that "the inactives cannot be kicked by any current means" [Full clans?](https://web.archive.org/web/20150907062949/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496364-full-clans?page=1).
- Login streak: 31 consecutive days awards a "Super Bonus" Present of a random orange (top-rarity) gear set — you can't choose which. ⚠️ **CONTRADICTION:** "you get the bonus on day 31 not 30" [Getting FREE Oranges](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions) vs a player whose day-30 Present held a rare item, not orange gear [Getting FREE Oranges (p1)](https://web.archive.org/web/20150911101822/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions?page=1).
- Three recurring freebies: the Daily Prize (24-hour cooldown from pickup) plus the Friendship room and Trap room, which each reset after every World Battle troop movement. [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Clan-war participation pays out: ranking up eventually awards a free clan-themed glove and mask (2 threads), building structures (coin-funded) grants EXP toward clan rank, and there was no shared clan treasury — members personally funded War Room actions. [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Taneyama event (Mar 2016): territory 34,55 flagged contested, decided by ownership "after the troops move on 19 March 2016"; prizes went to the top 5 contributors of the winning clan, chosen by its leader with the Kanji (moderators); the defense mixed ~30,000 NPC troops with player battlers; adjacency control locked Midori Ken out of the tile entirely; Aoi won. [War Room EVENT! Four Way Battle for Taneyama!](https://web.archive.org/web/20200718235234/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/606808-straw-hat-samurai-duels-war-room-event-four-way-battle-for-taneyama)
- Castle battles run on countdowns accepting attacks into the final 20 seconds, and outcomes resolve to surviving troop counts — a "2 troop victory" and a "2 Aoi's soldiers Remaining VS 0" finish are both recorded; reported by 2 threads. [The clan to join is Aka Ryu (page 2)](https://web.archive.org/web/20150907191222/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=2)
- War Room core loop (coordinates corroborated by 5 threads): the map is an X,Y sector grid; the four player actions are attack, defend, build, and deploy; ongoing battles are flagged with your clan's colors; to join one you select the battle, then the sector holding your clan's command HQ, then 'move'; clans place flags and members deploy troop units toward them; per-clan troop counts are visible. [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- HQ mechanics: HQs are optional, buildable (also inside enemy territory), and dismantlable; build rights are a per-member permission leadership can revoke; towns/cities/castle towns serve as HQs (leaders could not disable one); crops are spendable — by a player or their leader — to build extra HQs. [Aka and Aoi status](https://web.archive.org/web/20150915080519/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/494355-aka-and-aoi-status?page=1)
- Your war-room presence persists offline as an AI-controlled copy: if it is killed on a tile you are ejected and must re-enter from an HQ square; veterans therefore defend from an adjacent tile rather than the contested one. Bug: a "ghost" copy could linger in a previously-visited territory and be defeated there hours later. [war room troubles](https://web.archive.org/web/20151219185841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490211-war-room-troubles?page=1)
- **DEV:** an account's second character cannot enter the same war-room territory on the same day (Lutgames). ⚠️ Counter-report: a single-character player hit the same lock after hard-resetting his character — the per-day lock apparently persists across resets. [Not able to spend move points](https://web.archive.org/web/20150907063607/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492295-not-able-to-spend-move-points-in-war-room?page=1)
- Territory diplomacy is real: clans ceded/gifted land by agreement (Kin Tomoe got free land from Aka Ryu; Blood Lotus was given 2 territories), peace deals swapped 15-tile blocks and used HQ dismantling as ceasefire terms, players defected mid-war, and one leader recruited a General from another clan as sub-leader. [Aka and Aoi status](https://web.archive.org/web/20150915080519/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/494355-aka-and-aoi-status?page=1)
- The World Battle map auto-resets to base values when too much of it falls into ruins (it "has happened recently" as of Jul 2015); the cycle runs on a months timescale, and total map destruction is impossible. [Have the option to burn our own villages?](https://web.archive.org/web/20200719005133/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/510653-straw-hat-samurai-duels-have-the-option-to-burn-our-own-villages)
- Four joinable story clans — Aka Ryu (Red), Aoi Hoiru (Blue), Midori Ken (Green), Ki Sensu (Yellow/gold) — hold the map alongside player clans; reported by 5+ threads. A player claims all clans are mechanically equal ("There is NO ADVANTAGES… They are all equals."), countered only on practical size/territory grounds. [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Clan capacity: all clans but Hono displayed full at cap by May 13 2015 and Red was temporarily closed; **DEV:** the cap formula "takes into account inactive players and all the relevant factors" [Full clans?](https://web.archive.org/web/20150907062949/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496364-full-clans?page=1); the limit appeared lifted around May 19; player speculation pegged the cap to the smallest clan's size (unconfirmed) [AKA RYU ROLE CALL](https://web.archive.org/web/20150907191041/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495568-aka-ryu-role-call?page=1).
- Story-clan leadership is a player role, transferable (Alucard→Tameshi for Midori; iostiogic for Aka Ryu; Yuuta for Ki Sensu), with a council and even an in-game poll involved; "there is no founder, only an NPC 'Daimyo' for flavor"; hierarchy runs Daimyo (NPC) → Marshal → Second in Command → Generals → …Sergeant Major/Corporal. [Aka Ry and it's founder](https://web.archive.org/web/20160725142620/https://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/596572-aka-ry-and-its-founder)
- Player-created clans (reported by 5 threads): Honoshihai (purple, elite, invite-only), Kin Tomoe (gold), Koizumi, Blood Lotus, later Uroborus, Murakami Sohei, Blue Dragon, Kazekugya; invites are leader-curated; a one-man clan can hold a map square; founding your own clan requires "War Hero" status; clans persist even with zero territory. [The Clans.](https://web.archive.org/web/20200719193429/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518994-straw-hat-samurai-duels-the-clans)
- ⚠️ **CONTRADICTION (extra factions):** pink and orange factions were formed, pink possibly named "Cherry Blossom (I think)" vs "there is no pink? and there will be no mention of orange. (because you cant join them anyways)" — both in [State of the Clan War (page 2)](https://web.archive.org/web/20160718180457/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/486220?page=2); the unjoinable-orange reading matches the AI bandit faction.
- The map includes an unjoinable AI bandit faction whose scattered squares players treated as free captures, plus unclaimed areas capturable without fighting anyone. [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- One shared world across portals: Kongregate, Facebook, Armor Games, and the official site all feed the same server and one clan war (reported by 4 threads); spring 2015 turned it into a portal war — Kong organized into Red while AG massed in Blue; in-game character names are separate from portal usernames. [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Each story clan reportedly has four "diplomatic territories" — a fallback home core distinct from conquerable land (player claim). [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- Clans can be driven to near-elimination: Red was "nearly wiped off the map" pre-Apr 2015, Midori Ken was almost forced off by Ki Sensu by Jan 2017, Aka Ryu retook 20+ lands in May 2015, and an Apr 2015 power ranking ran Yellow > Green > Blue ("weakest non-destroyed story clan"). [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- Duels are strictly 1v1 (team duels only requested); the reservation system frequently errored "currently unavailable" with no decline option; there is no matchmaking, no leagues, no Dan/rebirth filtering, and no visible strength indicator — rankings just show win/loss records (e.g. 10–20 wins, 0–4 losses); whether losses carry any penalty went unanswered. [Suggestions Thread](https://web.archive.org/web/20150910180244/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=2)
- **DEV:** a duel is verifiably live PvP only if a ping appears in the duel chat; only ping-verified duels count on your record — the game sometimes presents a simulated opponent as a live duel. [Duel Bug](https://web.archive.org/web/20200719122510/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485970-straw-hat-samurai-duels-duel-bug)
- PvP rooms (~3 numbered, all free-for-all): no level gates, a single fixed entrance spawn enabling camping (a level 80 farming level 10–30s), no HP/Chi restore on death, and cooldowns tick while waiting alone — campers sit fully charged; population was too low for level brackets; /allyroom auto-allies everyone in a room. [Make pvp room fair](https://web.archive.org/web/20151231143243/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493858-make-pvp-room-fair?page=1)
- Tournaments existed but ran rarely and unscheduled; they could be free-entry with no prize pool, player profit coming entirely from the betting system (bets close before matches). [Tengu cave and possible way to find it](https://web.archive.org/web/20200719214639/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/511194-straw-hat-samurai-duels-tengu-cave-and-possible-way-to-find-it)
- Tengu fights are multiplayer encounters where players must manually type /allyroom to ally the room. [Suggestions Thread](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- "Kanji" are the in-game moderators (mute/ban powers, roles differ individually, they actively play and PvP); they can gift items in exceptional cases (a free Writ of Release); a rogue-moderator complaint drew **DEV:** "Noted. It will be looked into." within hours, and **DEV:** Lutgames personally worked a ban appeal via character-database lookup ("There is no character by the name of sonwokun."); lag/desync could get players accused of hacking. Reported by 3 threads. [Moderator is unbearable](https://web.archive.org/web/20200719045139/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/508075-straw-hat-samurai-duels-moderator-is-unbearable)
- An earlier chat build auto-muted anyone posting ~7 rapid lines within a minute; it had been removed by May 2015 and players wanted it back. [So, so, so many spammers](https://web.archive.org/web/20151231022234/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489549-so-so-so-many-spammers-in-the-game-chat-a-suggestion-to-fix-it?page=1)
- A web spectate/replay feature existed at strawhatsamuraiduels.com/watch?name=<playername>, shared to show off fights. [Story Quest Help](https://web.archive.org/web/20190720175126/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help)
- Redeem codes and timed events were live systems that dried up — "GAME IS SLOWLY BEING DEAD BECAUSE OF DECREASE UPDATES AND NO NEW CODES" (Nov 2016) [NEW REDEEM CODES AND EVENTS](https://web.archive.org/web/20181011190942/http://www.kongregate.com:80/forums/12-kongregate-multiplayer-games/topics/686158-straw-hat-samurai-duels-new-redeem-codes-and-events); a Mar 2016 Global Scavenger Hunt ran through the official forums with Gold Tokens, Raccoons, Outfits, and real gold as prizes [Global Scavenger Hunt!](https://web.archive.org/web/20200719213006/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/612390-straw-hat-samurai-duels-global-scavenger-hunt).
- The heavy roleplay layer (declared alliances, wars, diplomacy tables) is player fiction, not mechanics — "The rank chart applies to every clan. The rest is RP silliness." (Captain_Catface, a Kongregate developer-badged user, NOT Lutgames) [MIDORI KEN recruitement thread](https://web.archive.org/web/20150907061933/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497892-midori-ken-recruitement-thread?page=1) — while **DEV:** Lutgames states roleplaying is deliberately encouraged "since it adds to the flavor and the theme" [Our wiki (page 2)](https://web.archive.org/web/20200719091940/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496946-straw-hat-samurai-duels-our-wiki?page=2).
- The War Room is a distinct load/connection stage that could fail independently: it froze video (audio continuing) in Aug 2015, and was server-side down for everyone on Sep 12 2015. [Infi load](https://web.archive.org/web/20160908183934/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/538848-infi-load)
- Platform gaps: no Kongregate badges (Apr 2015) [badges?](https://web.archive.org/web/20200719213633/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486008-straw-hat-samurai-duels-badges); no cross-portal character transfer [Possible transfers?](https://web.archive.org/web/20200719163852/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/561092-straw-hat-samurai-duels-possible-transfers); achievements exist — one for selling 5,000 worth of trade goods [Tea, Silk, and Other Trade Goods](https://web.archive.org/web/20200719203804/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493252-straw-hat-samurai-duels-tea-silk-and-other-trade-goods).
- Decline arc: ~6 years online by Jul 2016 (launch ~2010) with balance still criticized and no real update in months (players claimed the devs paid Kongregate "rent" and depended on gold sales) [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying); still active early Feb 2016; playerbase collapsed by Jan 2018 ("aka ryu is in the point of dying") [AKA RYU WINS](https://web.archive.org/web/20200719051117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500008-straw-hat-samurai-duels-aka-ryu-wins-recruitment-thread); Dec 2019: "Lut has given up and shsd will disapear with flash in 2020" [Season 2](https://web.archive.org/web/20200719023120/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/669389-straw-hat-samurai-duels-season-2).
- ⚠️ **CONTRADICTION (overworld flags):** capturing a flag outside the War Room "will get a troop boost when deploying" if your clan is at war (Thylakaleo) [Q&A](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels) vs "Ypu can not captur it outside war room so nothing happens" [Q&A (page 2)](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels?page=2).
- Item transfer between players exists (gear given away in chat when purses hit the carry cap); items can be shown/linked in chat; no clan vault existed. [ITT: Things you want to see in the game](https://web.archive.org/web/20200719131437/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490507-straw-hat-samurai-duels-itt-things-you-want-to-see-in-the-game)
- Joining a clan to spy or sabotage is against the game's rules; leaders can have suspected spies investigated. [Ways to leave a clan](https://web.archive.org/web/20150907200432/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan?page=1)
- Context bits: clan relevance starts around level 10 ("say hi after you turn level 10") [The clan to join is Aka Ryu](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us); Apr 2015 pay-to-win perception via premium gold items [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system); the game was ~3 years old and still officially "beta" in May 2015, its endgame loop described as level grinding, item finding, repeated quest types, monsters, and War Room [When is the new season coming?](https://web.archive.org/web/20200719192848/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/499058-straw-hat-samurai-duels-when-is-the-new-season-coming).

Closes/confirms: re-confirms the 24h resolution tick and the moves-per-hour rank ladder (meta-social ready list, with the Corporal 4-move/96-180 datapoint), feeds blocker ② (War-Room map topology — adjacency lockouts, HQ-entry rule, coordinate grid), partially fills blocker ③ (daily-reward structure: 31-day streak, 3 daily freebies, rank cosmetics), and the outage/save evidence hardens the blocker-① scoping call that the server-authoritative war sim is unrecoverable at 1:1; the flag-boost contradiction touches the ready-list "flag +120%" entry.

### rebirth-elements

- Rebirth unlocks at level 80 and grants 25 gold, access to the elemental skill trees, and a fresh 1→80 climb worth 80 more skill points; reported by 3 threads. [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Gold payouts: 25 gold free every rebirth, rising to 100 gold on the 9th [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1); Judan (10th/max dan) gives 100 gold plus +20 in your chosen element, bringing cumulative dan elemental bonuses to 100 [Q&A](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels).
- Each rebirth permanently adds +10 weight capacity to your bank. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Each rebirth grants +10 Elemental Attack in a chosen element plus +10 Elemental Defense in an opposing element; the strength cycle is Water > Fire > Earth > Wind > Water (picking Earth yields 10 Earth ATK + 10 Wind DEF). [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Total elemental attack is hard-capped at 100, so at most three elements can reach their 30-point supers; an alternative build is 70 main / 30 spread, reachable around the 9th–10th rebirth at +10 each. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Unlock cadence: 3 rebirths into one element (30 elemental ATK) unlocks that element's super power — examples Tornadoes, Fire Blast, Boulders, Typhoon, scaled by Elemental Attack — plus the first elemental dragon dance; 6 rebirths unlocks the second Dragon Dance; reported by 2 threads. ⚠️ Naming inconsistency: the earth super is "Boulders" in one post and "Earthquakes" in another, same thread. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- There were 12 dragon dances as of May 2015: 4 from the main quest line and 8 from the elemental sets (2 per element, at 3× and 6× rebirths); a player who unlocked a dance can teach it to others. [Questions](https://web.archive.org/web/20170427091012/http://www.kongregate.com:80/forums/12-kongregate-multiplayer-games/topics/494653-straw-hat-samurai-duels-questions)
- All four element trees are structurally identical, each with 4 active skills: an elemental kunai, a land mine, a chi-punch-like skill, and an AOE (player report). [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Elemental stat semantics: Fire Attack does NOT affect regular slashes — it scales only the elemental techniques unlocked by rebirth specialization; Fire Defense reduces damage from fire-based moves AND fire traps. [Can someone explain Attack and Defense…](https://web.archive.org/web/20151219190032/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486679-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work?page=1)
- Reset semantics: rebirth returns you to level 1 with level-1 stats in a level-1 area, all equipped gear unequipped into your backpack; all learned skills persist (repeat rebirths can max every skill), but skill level requirements re-apply — substitution jutsu is unusable until samurai level 50 again. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Scroll economy: rebirth scrolls cost 1,000 coins and weigh 0; soul reset scrolls also cost 1,000 coins, weigh 0, and reset orange (soul-infused) items back to level 1 when you rebirth. [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- ⚠️ **CONTRADICTION/timeline (orange gear on rebirth):** beta-era claim that orange items "currently don't drop back down to level 1" on rebirth (Apr 2015, disputed in-thread) [Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle) vs the later soul-reset-scroll mechanism above — soul-infused gear originally kept its level through rebirth, which paying players protested [Soul Infused Gear should reset when you Rebirth](https://web.archive.org/web/20200719095645/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484956-straw-hat-samurai-duels-soul-infused-gear-should-reset-when-you-rebirth); random stat rerolls on reset also deterred soul infusion [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break).
- A second progression track ("Orange EXP" / SI levels) runs alongside normal EXP, with measured per-level requirements from L1=300 through L43=12,000 (partial table: L5=1200, L10=2000, L15=2600, L21=3600, L28=5600, L31=7000, L35=8600, L42=12000…). [How to grind for Levels and EXP](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Dan ranks use Japanese names (Sandan = 3rd rebirth); Judan is the maximum — you can keep rebirthing after it but the title stops changing. ⚠️ **CONTRADICTION:** "The dan will be nidan again" (cycles back after Judan) was immediately denied in-thread ("no xixor."). [Q&A](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Stats reset on every rebirth, so Dan rank itself confers no raw stat edge — the PvP power gap is gear (plus real-money head starts); the first rebirth's 25 gold spent on a weapon or mask is enough to start one-hitting higher-level players. [More features for choosing duels](https://web.archive.org/web/20160908181506/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/532779-more-features-for-choosing-duels)
- Rebirth characters keep their special skills at low level — a "level 10" rebirth throws elemental kunais at genuine newbies, and a Sandan can one-shot a higher-level non-rebirth; reported by 2 threads. [Make pvp room fair](https://web.archive.org/web/20151231143243/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493858-make-pvp-room-fair?page=1)
- Rebirth pacing: a veteran's fastest 1→80 was ~12 hours, average 2–3 days, longest 1.5–2 months; counterpoint — one player had 2 weeks of playtime and no rebirth yet. [Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Rebirth ties the character to an element identity (a player self-identifies as "water type"; a pet-dragon-matching-your-element request presumes it); reported by 2 threads. [Aoi Hoiru clan](https://web.archive.org/web/20150927190714/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan)
- PvP element strategy (player claim): picking the element strong against an equal-rebirth opponent roughly cancels their rebirth ATK, "leaving him only his gear"; balanced spreads buy a little defense everywhere, single-element focus maximizes one skill's damage. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Light stance becomes PvP-viable only after several rebirths, once top-tier items and maxed skills offset its damage-for-speed/range trade. [Best build?](https://web.archive.org/web/20150915012903/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489218-best-build?page=1)
- The element set is earth, water, wind, fire; combining two elements into one power is not possible (only a suggestion). [Suggestions Thread](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- Gear carries elemental affixes — a level-79 Anbu mask rolled HP, Earth Att, Att, and Max Chi at once — but item elemental-attack values were judged too weak to matter (a +50% buff was requested); reported by 2 threads. [Trade, buy, and sell items](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Unconfirmed (raised as a question, never answered): equivalent skills of different elements cannot be used simultaneously, or share a cooldown. [Rebirthing = 25 FREE Gold](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Context: rebirth-driven progression was accepted-but-disliked as grind-heavy, with combat XP considered low. [Our wiki](https://web.archive.org/web/20150915004822/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496946-our-wiki?page=1)

Closes/confirms: substantially chips at rebirth-elements blocker ① (per-element tree = 4 fixed active archetypes + a 30-point super + 2 dances — damage/cost numbers still open), largely closes blocker ③ (Dan titles: Sandan…Judan, 10 ranks, gold/element payouts per rank — resolving the "garbled source"), confirms the surface note that Dragon Dances unlock at 3×/6× same-element rebirths, adds elemental ATK/DEF semantics + the counter cycle + the 100 cap toward blocker ②, and documents the rebirth reset package toward blocker ⑤ (the never-filmed rebirth flow).

### art-audio

- The game opens with an animated intro cinematic that introduces the clans. [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- **DEV:** long skirts/full-length kimonos are impossible — "our characters need to extend their legs to run" — a hard rig constraint on clothing design (Lutgames). [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- **DEV:** Lutgames actively solicited player outfit suggestions with reference images — cosmetics were added from community input. [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- Male and female characters share one base body model — no chest difference, identical musculature — with gender expressed only through clothing, so sleeveless garments give female characters muscular male arms; reported by 2 threads. [Women's clothing?](https://web.archive.org/web/20200719124227/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489269-straw-hat-samurai-duels-womens-clothing)
- Character creation customizes hairstyles and faces only; body type and height are not customizable. [Suggestions Thread](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Performable pose/emote animations include the dragon dance, carrying the weapon on the shoulder, and a running pose; /sit alone has 3 randomized poses (cross-legged, seiza, plain sitting). [Cool Screenshot](https://web.archive.org/web/20151020164626/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495163-cool-screenshot?page=1)
- Two emotes are pure audio gags: /rimshot plays a rimshot SFX and /sadtrombone a sad-trombone SFX. [post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Dungeons have their own music track that keeps playing during fight-lock, and the camera/screen scrolls to follow encounters. [Weird glitch in NPC duels?](https://web.archive.org/web/20200719192254/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/548989-straw-hat-samurai-duels-weird-glitch-in-npc-duels)
- Clan visual identity: Midori Ken's veterans wear a green Oni mask; Ki Sensu's mask reads as an old-man face (mocked as "grandpa Simpson", clan nicknamed golden beast/lion); the Aoi Hoiru crest resembles the historical Takeda bishi mon (four diamonds); reported by 3 threads. [MIDORI KEN recruitement thread](https://web.archive.org/web/20150907061933/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497892-midori-ken-recruitement-thread?page=1)
- NPC Lady Oiwa wears a long dress players wanted as equipment; "hats" and "masks" are referenced equipment categories. [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- Town NPCs have ambient humorous dialogue lines (one reportedly mentions folic acid; screenshot evidence unrecoverable). [Funny NPC dialogue](https://web.archive.org/web/20200719131445/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490529-straw-hat-samurai-duels-funny-npc-dialogue)
- Late-life criticism: many outfits were player-submitted or anime-derived rather than fresh dev art, and the game's art was called "monochromatic". [forum activity is dying](https://web.archive.org/web/20200719051553/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/650580-straw-hat-samurai-duels-forum-activity-is-dying)

Closes/confirms: gives the all-INFERRED audio blocker its first two named SFX assets (rimshot, sad trombone) plus confirmation of per-area music beds (dedicated dungeon track); the single-body-mesh + leg-extension rig constraints feed the items-equipment sprite-compositing contract; adds the emote/pose animation list and clan mask/crest art references to the art digest.

### other

- Series dates (player-verified from both game pages): Straw Hat Samurai 1 released on Kongregate Oct 1, 2008 and Armor Games Oct 6, 2008. [The clan to join is Aka Ryu (page 3)](https://web.archive.org/web/20150911080640/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=3)
- Developer identity: the community calls the dev "Lut" (LutGames / studio Explosive Barrel; "tell Lut" was the standard bug escalation); players believed Lut is from Singapore (uncorrected claim), and regulars described LutGames as a very small operation with "little to no funds or support". [SEASON 2](https://web.archive.org/web/20160316203819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/583212?page=1)
- Official ecosystem: the game also ran standalone at strawhatsamuraiduels.com (**DEV:** Lutgames used "Are you able to play on strawhatsamuraiduels.com?" for connectivity triage; the Explosive Barrel site took Facebook login while the Kong embed auto-logged the Kong account) [Cant Connect To Server](https://web.archive.org/web/20200719172253/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485645-straw-hat-samurai-duels-cant-connect-to-server); official forums lived at forums.explosivebarrel.com — considered the "real forums", holding the compiled suggestions list and the authoritative Season-2 thread — reported by 4 threads [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying); the official Facebook page carried patch notes and event announcements [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1).
- An official MediaWiki wiki ran at strawhatsamuraiduels.com/wiki with known pages Mines (community-edited, plus a talk-page list of mineless territories), War_Room (the clan ranking system), Skills, Tengu (monster stats), and FAQ_and_guide, plus quest and enemy-type sections and ~120+ player fan pages; it was officially linked from the SHS domain and moderated by players Chronos and Kageyoshi Kanji — reported by 6+ threads; all are prime Wayback-harvest targets. [State of the Clan War (page 2)](https://web.archive.org/web/20150912173631/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=2)
- Wiki reliability caveat: "assume everything on the wiki is wrong unless you ask for confirmation in Kong chat" (Captain_Catface, Apr 2015). [Best build?](https://web.archive.org/web/20150915012903/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489218-best-build?page=1)
- **DEV:** around May 16 2015 Lutgames created an official Wikia (strawhatsamuraiduels.wikia.com) "for official information only", converting the legacy wiki into an RP/fan-fiction archive and repointing in-game links once ready. [Our wiki](https://web.archive.org/web/20150915004822/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496946-our-wiki?page=1)
- **DEV:** saves are entirely server-side and connection-dependent — progress-loss and freeze symptoms mean the client lost the server or the server dipped; the remedy is logging out and returning minutes later. Reports: hours of play (levels 11→15) silently reverted; a level-10 character lost to the save bug three times. [Problem With Saving?](https://web.archive.org/web/20160908184735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/523146-problem-with-saving?page=1)
- Client load pipeline: intro → "loading game files" → menu; the first-ever load could take 10+ minutes (assets browser-cached afterward), one player found it broken on Firefox but fine on Chrome, and **DEV:** Lutgames' fix for a stuck load was clearing browser cache and refreshing [Infinitely loading game](https://web.archive.org/web/20200719034053/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492162-straw-hat-samurai-duels-infinitely-loading-game); a Sep 12 2015 outage caused infinite loads unresolved by refreshing [Infi load](https://web.archive.org/web/20160908183934/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/538848-infi-load); a Nov 2015 black-screen-after-preload bug was fixed by mid-Dec 2015 [Black Screen](https://web.archive.org/web/20200719172214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/562729-straw-hat-samurai-duels-black-screen).
- Character-creation/connection guards: creation could fail with "too many players sharing the same ip address" (an IP-sharing cap, **DEV:** handled case-by-case via PM); the client surfaced NAT/router errors at the post-creation connect step — **DEV:** the error means the network "is somehow preventing the messages from the server from reaching your computer" [Cant Connect To Server](https://web.archive.org/web/20200719172253/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/485645-straw-hat-samurai-duels-cant-connect-to-server); recurring red "Unable to contact server" creation failures hit in Apr 2015 [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1).
- The game used its own password-based account system separate from Kongregate login; one player reported logging in to find a different person's account/progress — account mix-up or takeover was possible. [What is happening with my password](https://web.archive.org/web/20200719074654/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/680533-straw-hat-samurai-duels-what-is-happening-with-my-password-help-mee)
- Update opacity: patch notes shipped on Facebook, not in-game, so players mistook stat changes for bugs; players also alleged undocumented "hidden updates" silently changing mechanics (e.g. roll-dodge reliability). ⚠️ **CONTRADICTION:** one player claims the May 2015 rebalance cost players nothing vs others in the same thread documenting a 67-point attack loss and a lasting old-gear/new-gear power gap — both in [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1).
- A housing system was in active development as of Jul 2016 — countered in-thread as having been promised for a very long time already. [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying)
- Bug: after a troop movement, the Trap/Friendship-room treasure chest could misbehave unless the game was FULLY reloaded (title screen insufficient). [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- "raccoon use is best" for grinding — an unexplained aid (likely a companion/consumable; Raccoons also appear as Scavenger Hunt prizes, supporting an item reading). [How to grind for Levels and EXP](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- "Berry Man" is an intentional AI easter-egg character (a callback to earlier SHS games) that chats in the in-game chat — seen saying it fears the Tengu. [WTH is a Tengu? Berry man? Banana Town?](https://web.archive.org/web/20151231125651/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491788-wth-is-a-tengu-is-it-a-giant-world-boss-berry-man-banana-town?page=1)
- Bug (Apr 2015): dying could leave the character stuck in a "ghost trance" instead of respawning, chat still working; another player claimed it just meant the character hadn't fully loaded. [GLITCHED GAME](https://web.archive.org/web/20200719015848/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490353-straw-hat-samurai-duels-glitched-game)
- Ambiguous one-offs (log, don't build on): a player killed quickly by a "gunner class" character — real class vs hacked loadout unclear [Report hackers here](https://web.archive.org/web/20200719115839/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492905-straw-hat-samurai-duels-report-hackers-here); "ALL KILL TATSUO PLEASE!!!" names a target of unclear type [Fast trade](https://web.archive.org/web/20200719212629/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/506148-straw-hat-samurai-duels-fast-trade); a "chikako lvl4 pic" listed among reward types implies leveled character-picture collectibles [Q&A (page 2)](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels?page=2).

Closes/confirms: no single sim system — these pin the platform/ops picture: server-authoritative persistence and the live-service dependency (hardening the meta-social scoping call that the server sim is unrecoverable at 1:1), the asset-load pipeline, and — most valuably — the Tier-1 close-path harvest targets (official wiki page inventory, Explosive Barrel forums, Facebook page) plus a standing caveat on wiki-number trustworthiness.

# PART 3 — Economy, items-equipment, progression (RAW — synthesis pending)


## economy (126 raw facts)

- Premium orange-gear pricing: individual pieces cost 15 gold each; a 60-gold multi-piece package exists but is considered a trap because its pieces roll random, often useless stats.
  — "Don't buy the 60 gold package ... every piece alone cost 15 gold"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- The premium gear shop's individual-piece stock rotates roughly hourly; a paying player's strategy was to log in every hour to check for desirable pieces.
  — "Its better to log in every hour and check for individual pieces"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- Non-premium routes to stat gear: hunting (wandering) merchants and grinding enemies for drops.
  — "if you want stats buy individual pieces or go hunt merchants and grind enemies"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- The game had no auction house or market listing system — selling required manually advertising items to other players; players petitioned the dev for one.
  — "people will not have to marketing their stuff, just have to put it in the market"
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Trade rooms were limited to two participants (1-on-1); a player proposed allowing three or more people per trade room as a lightweight auction substitute.
  — "a smaller simpler idea is to allow THREE PEOPLE or MORE into 1 trade room"
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- The economy runs on two currencies — coins and gold — plus direct item barter (a veteran's auction mock-up assumes bids in any of the three).
  — "The bids can be any item or coin amount or gold."
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Player claim: providing/obtaining a clan-leaving writ costs gold — a player who had 'no free gold' could not supply one and instead deleted their level-50 character.
  — "I have no free gold. I already wrote."
  · [The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Player-to-player equipment transfer exists: veterans routinely donated old gear to newer clanmates via clan chat.
  — "I often see players donating their old equipment in clan chat"
  · [The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- A stat 'transfer' from a blue item into an orange sword costs 10 gold (player purchase report).
  — "My first transfer was a blue into an orange sword. -10 gold."
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- A good mask from the (gold) shop cost 15 gold (player purchase report).
  — "And then I bought a very nice mask for -15 gold."
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- 'Present' items give a random unidentified blue-quality item (buying one is likened to buying a blue without seeing stats); Presents also drop rarely from the daily prize.
  — "Present is also a drop from daily prize, though, rare."
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Golden Tokens can be bought with gold and wagered in PvP bets to win gold — recommended only for strong PvP players since betting has losers.
  — "you can do bets with gold tokens"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- The game had no auction house — item selling/trading was a manual player-to-player process widely felt as tedious; this whole thread is a fan proposal, not shipped behavior. Economy runs on both coins and gold, and items can be traded between players.
  — "Selling items in this game is a bit tedious."
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- There is a hard cap on how much money the character can carry; the bank stores only items, not coins.
  — "there is a limit to the amount of money I can carry... only items can be stored"
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Confirmed by a second player: no money storage exists anywhere in the game other than the character's purse.
  — "There is no way to store money other than your purse."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Respawning at the spot after dying costs 1,000 coins, which players use deliberately as a coin sink when the purse is full.
  — "When my purse is full I respawn upon dying for 1k."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Spices sold at the Market are considered the best value-per-weight item for storing excess wealth as goods.
  — "Buy and store Spices from the Market. They are a good price for their weight."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- A peddler NPC sells rings that weigh 0 but resell at a large loss, retaining only a small value.
  — "Buy rings from the peddler. They weigh 0, but have a small value on sale."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Coins can be given directly to other players (friends, clanmates, people in chat).
  — "Make a bunch of friends and give them your excess coins."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- Player-quoted price to reinforce a weapon at the blacksmith into a permanent ('unbreakable') one: 5000 silver coins plus two silver ores.
  — "just make sure you got 5000 silver coins and two silver ore's"
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- Weapon maintenance is a recurring money sink that scales with activity — a frequent dueler found keeping one favorite sword well-maintained expensive.
  — "keeping it well-maintained with my dueling passion is a bit expensive"
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- A town at territory 49,47 (sector 0,2) forges swords for a recipe of 1 tin + 2 copper + 3500 coins — the first sword-forging town found by the mapper.
  — "the town is the first I found that uses 1 tin and 2 copper and 3500 coins"
  · [mines](https://web.archive.org/web/20150912051345/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487127-mines?page=1)
- In-game player-to-player trading exists; deals were arranged on the forum via in-game names, suggested prices, and play-time windows (item hand-off happens in-game).
  — "PLEASE mention your IN GAME NAME so people can more likely get back to you."
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Farm goods and animals are tradable commodities with player-set exchange rates: an offer of 30 Crops per raccoon (175 Crops for 5), and kittens sold for coins.
  — "Crops x 175 for 5 raccoons. Or 30 Crops for 1 raccoon."
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- A limited-time ring redemption event (May 2015) flooded the game with item traders; the redemption had a fixed cap, after which trading was expected to die down (player claim).
  — "once the limit of redeem is obtained that’s when it will slowly stop"
  · [[suggestion] chatroom tabs](https://web.archive.org/web/20151231070614/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495200-suggestion-chatroom-tabs?page=1)
- Player-to-player item trading exists and was heavy enough that trade spam dominated world chat after the rings release; one player called the rings release 'a total disaster idea'.
  — "the rings release was a total disaster idea. it’ll be all trade spam for the next month"
  · [[suggestion] chatroom tabs](https://web.archive.org/web/20151231070614/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495200-suggestion-chatroom-tabs?page=1)
- No auction system existed as of May 2015; players campaigned for one in a dedicated thread (topic 492388) so trading could move out of chat.
  — "The game needs an auction system"
  · [[suggestion] chatroom tabs](https://web.archive.org/web/20151231070614/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495200-suggestion-chatroom-tabs?page=1)
- The soul-infusion reset shipped within ~4 days (by 2015-04-08) as orange scrolls sold by the peddler for 1000 coins; you 'Use' the scroll then drag an item onto it to revert that item to level 1.
  — "buy orange scrolls at the peddler for 1000 coins"
  · [Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20150912151820/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/484956-soul-infused-gear-should-reset-when-you-rebirth?page=1)
- Soul infusion is a premium-currency (gold) sink — players describe having spent real money/gold on infusing gear.
  — "Thanks , now i can use my gold in peace"
  · [Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20150912151820/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/484956-soul-infused-gear-should-reset-when-you-rebirth?page=1)
- Sending a player-clan invite costs 5 gold (premium currency) per invite.
  — "it costs 5 gold per invite sent"
  · [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- Food/market loop feeds the clan war: selling food to a clan gives that clan crops; farming crops has a chance to yield potatoes; crops can be spent (by players/leaders) to build extra clan HQs.
  — "farming them has a chance to give you potatoes and you can use crops … to build extra HQ’s"
  · [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- Player claim: real-money spending gives a PvP head start; 'gold' is a purchasable currency, and after 1st Dan, spending 25 gold on a weapon or a mask is enough to one-hit higher-level players. Confirms weapon and mask as purchasable equipment types.
  — "youve spent that first 25 gold on a weapon or a mask, you'll be one hitting higher levels"
  · [More features for choosing duels](https://web.archive.org/web/20160908181506/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/532779-more-features-for-choosing-duels)
- Player claim: killing the Red Oni rewards "one sho" (apparent currency/reward unit); another player did not recognize the term, so the unit is unverified.
  — "Kill Red oni for one sho"
  · [Red oni](https://web.archive.org/web/20150910135359/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492406-red-oni?page=1)
- A bank/carry-weight upgrade is purchasable for 5 gold; the exact weight increase was unclear even to veteran players (asked, never answered in-thread).
  — "I want to buy the bank upgrade that costs 5 gold."
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Player-to-player trading exists: players in chat sell items to each other and can even lend gear for free.
  — "They will sell you some good stuff or even lend it for free"
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- A gambling house exists with a mini-game played against other players for coin stakes only; players found it not worth caring about.
  — "Mini-game in the gambling house you can play against other players for something other than just coins"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Red Oni drops a rare 'Red Oni Heart' item that other players actively want to buy, making it a tradeable prestige/value drop.
  — "to get red oni heart . for some reason when i show it people whant to buy it"
  · [New way to kill red oni](https://web.archive.org/web/20160104144830/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/501146-new-way-to-kill-red-oni?page=1)
- Gold (premium currency) can be earned through roughly 5 different in-game methods besides real-money purchase (player claim).
  — "may be obtained by buying it or by about 5 different ways in game"
  · [Ways to leave a clan](https://web.archive.org/web/20150907200432/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan?page=1)
- Premium currency is purchasable "gold"; player claims premium (gold-shop) items are weak value because free-to-use items of green or blue tier can outperform the pay items.
  — "you can find blue or green free to use items that can be better than the pay to use items"
  · [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying)
- Player-to-player trading of shop items is possible and, per one player, undercuts demand for gold-shop items, reducing how much premium gold players buy.
  — "The way players trade shop items demolishes the demand for gold shop items"
  · [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying)
- Pre-nerf high-power gear became unobtainable after the update era, leaving veterans with permanently superior 'old gear' while newer players can only get weaker items (player claim).
  — "Old gear is still OP. New gear the newer players can get is still weak"
  · [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1)
- Players can give coins directly to other players (typical gift amounts 1000-2000c cited), and a 'coin purse' can become full, implying a carried-coin cap.
  — "If your coin purse is full, give some to other, for example 1000-2000c"
  · [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- Items can be gifted to other players for free and can also be dropped/discarded from inventory.
  — "show it on the clan’s chat to give it someone for free, before dropping"
  · [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- Crops are sold at city markets; most cities have a market but not all.
  — "Sell the crops at a market in a city. Most have one, but not all."
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- A gambling house exists where players can play a mini-game against other players, but only for coin stakes; players felt the rewards gave no reason to play it.
  — "Mini-game in the gambling house you can play against other players for something other than just coins"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- A premium "ninja shop" existed selling anime-series-inspired characters/outfits, including female captains and ninja (player reference).
  — "all the strong female captains and ninja from the two series used in the ninja shop"
  · [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- The coin purse has a carry cap (it can be "full"); coins can be gifted to other players (1000-2000c cited as a normal gift) and items can be handed to clanmates instead of being dropped.
  — "If your coin purse is full, give some to other, for example 1000-2000c."
  · [Aoi Hoiru clan](https://web.archive.org/web/20150927190714/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan)
- The Writ of Release scroll — the standard item for leaving a clan — costs 25 gold (premium currency).
  — "besides buying the 25gold scroll"
  · [Ways to leave a clan](https://web.archive.org/web/20160405075911/https://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan)
- Gold (premium currency) can be obtained without paying — a player states there are about 5 different in-game ways to earn it, besides purchase.
  — "may be obtained by buying it or by about 5 different ways in game"
  · [Ways to leave a clan](https://web.archive.org/web/20160405075911/https://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan)
- Silver (the common currency) is abundant enough that inn rests are always affordable even after other costs (player claim).
  — "Silver is abundant enough that you should always be able to afford to rest"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Inviting a player to a private (player-made) clan costs 5 gold per invite — the reason Kong organizers steered newcomers to free story clans instead.
  — "the game charges 5 gold per invite to private clans"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Crops earned in the story are sold at city markets; most cities have a market but not all (Catface answer to a lost player).
  — "Sell the crops at a market in a city. Most have one, but not all"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Farming crops has a random chance to yield potatoes; crops can be spent (by the player or the clan leader) to build extra clan HQs, and selling crops to a clan's market supports that clan (AbsoluteShadow claim).
  — "farming them has a chance to give you potatoes and you can use crops or your leader can to build extra HQ’s"
  · [State of the Clan War](https://web.archive.org/web/20150413022624/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war)
- Players hit money-storage limits and asked where to store excess money (5-post thread) — consistent with the coin-cap system raised via Survival skills.
  — "Where do I store extra money?"
  · [Straw Hat Samurai: Duels forum (index)](https://web.archive.org/web/20150423012315/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels)
- Inviting someone to a player-made clan costs 5 gold per invite sent, unlike the four story clans which players can join freely (Captain_Catface).
  — "Because this is a player clan, it costs 5 gold per invite sent"
  · [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- Selling food/crops at the Market directs the crops to a clan of your choice, so market sales are a clan-war support lever (AbsoluteShadow).
  — "Sell to the clan you want to have crops"
  · [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- Farming crops has a random chance to also yield potatoes (AbsoluteShadow claim).
  — "Crops basically farming them has a chance to give you potatoes"
  · [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- The ninja shop's inventory refreshes every hour, creating time pressure to have gold on hand for good stock.
  — "Because the shop refreshes every hour"
  · [[Straw Hat Samurai: Duels] Bug for Purchasing Gold Still Exists!](https://web.archive.org/web/20200719120712/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486845-straw-hat-samurai-duels-bug-for-purchasing-gold-still-exists)
- Gold is a premium currency bought with Kongregate Kreds; a recurring bug (Apr 2015) meant purchased gold was sometimes not credited, or credited with long delay.
  — "The highly annoying bug where you don't get the gold that you purchase still exists."
  · [[Straw Hat Samurai: Duels] Bug for Purchasing Gold Still Exists!](https://web.archive.org/web/20200719120712/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486845-straw-hat-samurai-duels-bug-for-purchasing-gold-still-exists)
- DEV: Lutgames confirmed gold crediting is server-side and the Kongregate-to-game-server payment handshake could silently fail; his remedy was manual crediting after players PM'd a screenshot of their Kreds history.
  — "Sometimes Kongregate and the server seem to not communicate properly."
  · [[Straw Hat Samurai: Duels] Bug for Purchasing Gold Still Exists!](https://web.archive.org/web/20200719120712/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486845-straw-hat-samurai-duels-bug-for-purchasing-gold-still-exists)
- Sword forging is a town service with ore costs: the town at territory 49,47 (sector 0,2) forges swords for 1 tin + 2 copper + 3,500 coins.
  — "the town is the first I found that uses 1 tin and 2 copper and 3500 coins to forge swords"
  · [mines](https://web.archive.org/web/20200719085738/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487424-straw-hat-samurai-duels-epilogue-quest)
- Orange soul-infused gear sets were bought with real money; one player bought two full sets, planning one to keep for lvl 80 and one for grinding/rebirth.
  — "two set of orange cost me some money"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Sword forging exists at specific towns: the town at territory 49,47 (0,2) forges swords for 1 tin + 2 copper + 3,500 coins (first crafting town players found).
  — "uses 1 tin and 2 copper and 3500 coins to forge swords"
  · [mines](https://web.archive.org/web/20200719145615/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487127-straw-hat-samurai-duels-mines)
- Player-to-player trading existed in-game; traders coordinated via an in-game character name (distinct from the Kongregate username) plus playtimes/timezones to meet up.
  — "PLEASE mention your IN GAME NAME so people can more likely get back to you."
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Farm produce and animals were tradeable commodities with player-set exchange rates: one offer was 175 crops for 5 raccoons, or 30 crops per single raccoon.
  — "Crops x 175 for 5 raccoons. Or 30 Crops for 1 raccoon."
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Soul-infusion livestock and produce (potatoes, dogs, raccoons, kittens) functioned as a secondary trade currency alongside regular items.
  — "buying rare color garments for some nice stuffs and potatoes (probably dogs and raccoons)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Coins were the base currency and could be offered for items; item usefulness was level-banded (one trader dealt in 'good items around lv 15-26').
  — "looking for founder sword for coins not so much and will trade good items around lv 15-26"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- As of April 2015 the game was in Beta and sold a purchasable premium 'gold' currency; a player asked whether Kongregate Kreds would be usable to buy it (no dev reply in this capture).
  — "i saw this game is in Beta right now , I’ve always wanted to play this game and buy gold"
  · [[Straw Hat Samurai Duels] Will Kreds be used ?](https://web.archive.org/web/20200719143434/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484109-straw-hat-samurai-duels-will-kreds-be-used)
- Story-quest crops are sold at a market in a city; most cities have a market but not all.
  — "Sell the crops at a market in a city. Most have one, but not all"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Item economics: basic level 1 garments/pants sell for 5 coins but weigh 5 pounds, while level 1 sandals/hats also sell for 5 coins at only 1 pound — so keep hats/sandals when inventory is tight.
  — "Basic lvl 1 garments/pants are worth 5 coins while weighing 5 pounds"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Logging in 31 consecutive days grants a Super Bonus daily prize: a random PRESENT box said to contain a random set of orange gear.
  — "If you log in 31 days IN A ROW you will get a Super Bonus daily prize which will be a random PRESENT"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Player correction on the login streak: the set is random (you cannot pick a specific one), and the bonus lands on day 31, not day 30.
  — "you get a random set (you can’t choose a specific one)... you get the bonus on day 31 not 30"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Contradicting the guaranteed-orange claim, one player reports his day-30 prize was a Present containing only a rare item, not an orange.
  — "On the 30th I just got a Present (containing rare item) not a orange :P"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Premium orange gear pricing (from a paying player): a 60-gold package of pieces exists; each individual piece costs 15 gold; the individual-piece shop stock rotates roughly hourly.
  — "Don’t buy the 60 gold package... every piece alone cost 15 gold... log in every hour and check for individual pieces"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- A rotating 'Ninja Shop' exists, and a Santa outfit existed as a seasonal cosmetic; a player asks (unanswered) whether the Super Bonus present draws from the current Ninja Shop or is 100% random.
  — "If the Super Bonus present from the current Ninja Shop? Or is it 100% random? (could I get the Santa outfit?)"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Copper ore is a resource players farm and beg for from other players in chat (implying it is transferable and in demand, likely for crafting/upgrading).
  — "guys can someone spare me some copper ore? pls pls pls pls"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us. (page 2)](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=2)
- Beating the Tengu — or simply landing the last blow on it — awards 10 gold tokens (player claim, Apr 2015).
  — "simply landing the last blow results you you getting 10 gold tokens"
  · [[Straw Hat Samurai: Duels] WTH is a Tengu? Is it a giant world boss? Berry man? Banana Town?](https://web.archive.org/web/20200718230924/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491788-straw-hat-samurai-duels-wth-is-a-tengu-is-it-a-giant-world-boss-berry-man-banana-town)
- Base coin capacity is 1,000 coins; coins earned above the cap are silently lost (a player won a 1,000-coin bet and still had exactly 1,000).
  — "Mad couse i bet 1000 coins, won, and remained whit 1000"
  · [[Straw Hat Samurai: Duels] Coins](https://web.archive.org/web/20200719034104/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492186-straw-hat-samurai-duels-coins)
- A coin-betting/gambling feature exists, and the maximum bet (1,000) can equal the base coin cap — so a fresh character can wager their entire capacity.
  — "Why can i only have 1000 coins? And why can i bet a 1000?"
  · [[Straw Hat Samurai: Duels] Coins](https://web.archive.org/web/20200719034104/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492186-straw-hat-samurai-duels-coins)
- As of April–May 2015 the game had no auction house; selling items meant manually advertising to find buyers, which players found tedious (the thread is a feature request, not shipped behavior).
  — "Selling items in this game is a bit tedious."
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Trading happens in dedicated trade rooms limited to two participants (a player proposes raising it to three or more, implying the existing 1-on-1 limit).
  — "a smaller simpler idea is to allow THREE PEOPLE or MORE into 1 trade room"
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Tradeable value comes in three forms — items, coins, and gold (premium currency) — per a player's auction proposal that assumes bids in any of the three.
  — "The bids can be any item or coin amount or gold."
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Player-to-player trading of items exists but there is no auction/market; selling items is described as tedious (the auction system in this thread is only a player suggestion, never implemented per this capture).
  — "Selling items in this game is a bit tedious."
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Endgame carry weight reaches about 300 on the character plus over 100 default bank weight, so extra bank space is a low-value gold purchase.
  — "you get 300 weight in the end on your character + over a hundred in bank"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Golden Tokens can be bought with gold and wagered on PvP; skilled PvPers can keep winning gold this way, but another player warns token betting is pure gambling.
  — "may be a good idea to buy those if you are very good at PVP"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Soul transfer (blue stats into an orange sword) costs 10 gold; a good mask at the premium shop costs 15 gold.
  — "a blue into an orange sword. -10 gold ... a very nice mask for -15 gold"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Carried coins have a hard cap (the purse); the bank stores only items, never money - there is no coin storage anywhere.
  — "There is no way to store money other than your purse."
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Soul reset scrolls cost 1,000 coins each, weigh 0, and are needed to reset orange (soul-infused) items back to level 1 when you rebirth.
  — "buy soul reset scrolls (1k each) ... reset your orange items to lvl 1 when you rebirth"
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Respawning in place on death costs coins - 1,000 per respawn for this (high-level) player, used deliberately as a coin sink.
  — "When my purse is full I respawn upon dying for 1k"
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Rebirth scrolls are purchasable for 1,000 coins and weigh 0 (listed separately from the 1,000-coin orange/soul reset items).
  — "Buy rebirth scrolls for 1000. They weigh 0."
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Wealth can be parked in goods: Spices bought at the Market have good value-to-weight, and peddler rings weigh 0 while retaining some resale value (at a large loss).
  — "Buy and store Spices from the Market. They are a good price for their weight."
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Coins can be given directly to other players (friends, clanmates, people in chat).
  — "Make a bunch of friends and give them your excess coins."
  · [Where do I store extra money?](https://web.archive.org/web/20200719214729/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489121-straw-hat-samurai-duels-where-do-i-store-extra-money)
- Trade goods (tea, silk) can be sold near the start of the game, but later sell locations are unclear — a player searched towns, cities, and castle cities without finding a buyer.
  — "I haven't been able to find where to sell these items."
  · [[Straw Hat Samurai: Duels] Tea, Silk, and Other Trade Goods](https://web.archive.org/web/20200719203804/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493252-straw-hat-samurai-duels-tea-silk-and-other-trade-goods)
- Trade goods have inventory weight, and their sale price is considered too low to justify that weight — players advise hoarding unique items/gear instead.
  — "price does not do justice to their weight"
  · [[Straw Hat Samurai: Duels] Tea, Silk, and Other Trade Goods](https://web.archive.org/web/20200719203804/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493252-straw-hat-samurai-duels-tea-silk-and-other-trade-goods)
- At higher levels, coins are reported to come easily regardless of trade-good selling — money is not a late-game constraint.
  — "at higher levels coins come easy"
  · [[Straw Hat Samurai: Duels] Tea, Silk, and Other Trade Goods](https://web.archive.org/web/20200719203804/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493252-straw-hat-samurai-duels-tea-silk-and-other-trade-goods)
- A 'rings' item release (June 2015) was a redeemable with a fixed global redemption limit; players expected trade spam to die down 'once the limit of redeem is obtained'. Another player called the rings release 'a total disaster idea' that flooded world chat with trading for a month.
  — "wait for a bit and once the limit of redeem is obtained that's when it will slowly stop"
  · [[Straw Hat Samurai: Duels] [suggestion] chatroom tabs](https://web.archive.org/web/20200718235005/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/495200-straw-hat-samurai-duels-suggestion-chatroom-tabs)
- Player-to-player trading exists but there is no auction house — all trade negotiation happens in world chat (players petitioned for an auction system in a separate thread, topic 492388).
  — "The game needs an auction system … So all the trade stuff can be done there."
  · [[Straw Hat Samurai: Duels] [suggestion] chatroom tabs](https://web.archive.org/web/20200718235005/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/495200-straw-hat-samurai-duels-suggestion-chatroom-tabs)
- Items can be shown/linked in chat channels, including ALL chat (players wanted item links auto-routed to TRADE chat only).
  — "No more items shown is ALL chat. Ever."
  · [[Straw Hat Samurai: Duels] So, so, so many spammers in the game chat. A suggestion to fix it.](https://web.archive.org/web/20200719100025/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489549-straw-hat-samurai-duels-so-so-so-many-spammers-in-the-game-chat-a-suggestion-to-fix-it)
- Leaving/switching clans requires a 'writ of resignation' (also called writ of release), which other players can give you.
  — "can any of you guys give me a writ of resignation so i can join aoi hoiru"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- The clan-leaving writ costs gold; players without gold instead deleted their characters and restarted — one player deleted a character as high as level 50 to switch clans.
  — "I have no free gold… If you are a low level will be easier to delete your character and start again."
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Equipment can be traded/donated between players; clan members routinely gave outgrown gear to newer players via clan chat.
  — "I often see players donating their old equipment in clan chat"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Copper ore exists as a material item that players trade/beg for in chat (visible in a quoted chat log).
  — "guys can someone spare me some copper ore?"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=2)
- Player claim: gold is a premium currency obtainable with real money, and after reaching 1st Dan, spending 25 gold on a weapon or a mask is enough to one-hit higher-level players.
  — "youve spent that first 25 gold on a weapon or a mask, you'll be one hitting higher levels just as easily"
  · [[Straw Hat Samurai: Duels] More features for choosing duels](https://web.archive.org/web/20200719034404/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/532779-straw-hat-samurai-duels-more-features-for-choosing-duels)
- NPC Trades are item-exchange offers tracked as entries in the quest log, and multiple trades can be active simultaneously; a bug caused the promised goods to not be delivered when more than one trade was in the log.
  — "it occurs when you have more than 1 trade in your quest log"
  · [[Straw Hat Samurai: Duels] NPC Trades](https://web.archive.org/web/20200719044204/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/555342-straw-hat-samurai-duels-npc-trades)
- A 'ninja shop' sold weapons for gold, and its listed weapon damage ranges were changed in the same stealth balance pass as the steel weapons; the game had in-game patch notes but this change was not listed in them.
  — "still nothing in patch notes about the changes to damage range on steel weapons"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- Balance changes applied retroactively to already-purchased items: a player complained gold spent on a weapon was devalued when the owned weapon was later nerfed.
  — "SPENDING GOLD TO GET WHAT I WANT AND THEN HAVING IT NERFED"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- A gambling house exists whose mini-game stakes only coins; players found it pointless and wanted other stakes and versus-player play.
  — "Mini-game in the gambling house you can play against other players for something other than just coins"
  · [[Straw Hat Samurai: Duels] Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- The writ of release (the scroll that lets you leave a clan) costs 25 gold.
  — "besides buying the 25gold scroll"
  · [[Straw Hat Samurai: Duels] Ways to leave a clan](https://web.archive.org/web/20200719112706/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/502202-straw-hat-samurai-duels-ways-to-leave-a-clan)
- Gold (the premium-ish currency) can be bought or earned through roughly five different in-game methods, per player report.
  — "may be obtained by buying it or by about 5 different ways in game"
  · [[Straw Hat Samurai: Duels] Ways to leave a clan](https://web.archive.org/web/20200719112706/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/502202-straw-hat-samurai-duels-ways-to-leave-a-clan)
- A player pleads for faster trading, suggesting the player-to-player trade flow was slow or cumbersome (thread is two broken-English posts, low signal).
  — "please!i no need fast!"
  · [[Straw Hat Samurai: Duels] Fast trade](https://web.archive.org/web/20200719212629/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/506148-straw-hat-samurai-duels-fast-trade)
- The coin purse has a capacity that can be 'full', and players can hand coins directly to other players — clan etiquette suggested gifting 1000–2000 coins to clanmates when your purse filled up.
  — "If your coin purse is full, give some to other, for example 1000-2000c"
  · [[Straw Hat Samurai: Duels] Aoi Hoiru clan](https://web.archive.org/web/20200719021017/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/497808-straw-hat-samurai-duels-aoi-hoiru-clan)
- Items could be given to other players for free (advertised via clan chat), and unwanted items could alternatively be dropped/discarded from the inventory.
  — "show it on the clan’s chat to give it someone for free, before dropping"
  · [[Straw Hat Samurai: Duels] Aoi Hoiru clan](https://web.archive.org/web/20200719021017/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/497808-straw-hat-samurai-duels-aoi-hoiru-clan)
- Hunting mobs produced item drops, occasionally good enough that veteran players routinely gifted them to new players.
  — "I give out items whenever I get a good one from hunting mobs"
  · [[Straw Hat Samurai: Duels] KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20200719143214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/498595-straw-hat-samurai-duels-ki-sensu-the-golden-fan-recruitment-thread)
- Player-to-player item exchange existed and was abusable — the community identified named scammers, and one openly admitted to 'stealing' items from other players, implying trade/gift-based theft scams.
  — "I am just going to troll people by stealing their items"
  · [[Straw Hat Samurai: Duels] KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20200719143214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/498595-straw-hat-samurai-duels-ki-sensu-the-golden-fan-recruitment-thread?page=2)
- A Tengu appears in the dojo and awards 10 gold tokens when killed (distinct from the rumored roaming/cave Tengu).
  — "tengu which appears in dojo he only gives 10 gold tokens when killed"
  · [Tengu cave and possible way to find it](https://web.archive.org/web/20200719214639/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/511194-straw-hat-samurai-duels-tengu-cave-and-possible-way-to-find-it)
- Tournament betting formula pays big gold to underdogs betting on themselves: e.g. a level 5 beating a level 80 earns 75 gold on a self-bet; low-vs-high upsets are the profit route.
  — "by game formula lvl 5 gets 75 gold if he placed bet on himself"
  · [Tengu cave and possible way to find it](https://web.archive.org/web/20200719214639/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/511194-straw-hat-samurai-duels-tengu-cave-and-possible-way-to-find-it)
- Searching/browsing roaming merchants is worthwhile — implied that merchant stock can contain good finds worth checking regularly.
  — "Search merchants, it’s worth it."
  · [[Straw Hat Samurai: Duels] post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- A player asked how to obtain Gold (the premium currency) without buying it; the thread gave no answer — consistent with Gold being primarily a purchased real-money currency.
  — "do any one of you know how to get gold in the game without buying it ?"
  · [[Straw Hat Samurai: Duels] post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Recall stones are transferable between players — they can be gifted and later sold on to others; lore claim that a dev/veteran ("ryu") originally gifted the debug-territory stones, which changed hands years later.
  — "ryu gifted the stones to tao like 4 years ago, then tao sold em a few months ago"
  · [[Straw Hat Samurai: Duels] 82,53/82,54](https://web.archive.org/web/20200719163919/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/628561-straw-hat-samurai-duels-82-53-82-54)
- Gold-shop (premium) items were player-tradeable, and that secondary trading collapsed demand for buying Gold with real money — cited as a core monetization weakness; devs paid Kongregate hosting/rev fees, so low Gold sales threatened the game.
  — "The way players trade shop items demolishes the demand for gold shop items, reduces the amount of gold people are actually going to buy."
  · [[Straw Hat Samurai: Duels] forum activity is dying](https://web.archive.org/web/20200719051553/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/650580-straw-hat-samurai-duels-forum-activity-is-dying)
- Claim from a mostly-joke thread (treat with caution): sought-after cosmetic/armor pieces appear randomly in merchant stalls — i.e. merchant stall inventory is randomized. Corroborates the tips-thread advice to search merchants.
  — "they are randomly in merchant stalls."
  · [[Straw Hat Samurai: Duels] Larger breasts](https://web.archive.org/web/20200719143844/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/658205-straw-hat-samurai-duels-larger-breasts)
- Pickaxes are bought from the Peddler NPC vendor, who can be found in villages, towns, cities, and castles.
  — "in the peddler, u can find it in villages town citys castles"
  · [I'm Sorry guys but](https://web.archive.org/web/20200719015259/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/601813-straw-hat-samurai-duels-im-sorry-guys-but)
- Tournaments support betting, and winning a bet pays out gold even in free (no-entry-fee) tournaments.
  — "Q: Can you still get gold from winning a bet on a free tournament? — Yes."
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Player-listed free gold (premium currency) sources: rebirthing, tournaments, events, betting, and gold tokens. (Question by GraveBuster; 'bets' added by niconicolas, 'Gold tokens' by Xixor1235.)
  — "we can get gold when we rebrith and from tournaments and events"
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Claiming Ninja Rewards does not grant any gold.
  — "Q: can we get gold when we claim the ninja rewards ? — nope"
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Players can gift coins to other players, but transfers are sometimes blocked with an 'unable to give' error (restriction cause unknown; the question went unanswered, Dec 2016).
  — "trying to give coins to some players but it says “unable to give”"
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels?page=2)

## items-equipment (205 raw facts)

- Rings are a distinct equipment type and are hard to obtain, especially good ones.
  — "rings are rings, and are hard to get, let alone good ones!"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- Orange gear generated at low character level rolls only 3-4 different stat lines, while gear obtained at later levels rolls 6-7; a veteran advised waiting until at least level 40 before spending premium currency.
  — "use only when you're at least 40 , because at later levels the gear end up having 6-7 stats"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- Gear levels up with the player but never gains NEW stat lines as it levels — it only improves the stat lines it was generated with.
  — "your gear wont get new stats as they level , only improves the ones you already have"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- A stat-transfer system exists: stats can be moved from one gear piece into another, letting players combine good looks with good stats.
  — "stat transfer bad looking gear with good stats into good looking gear with bad stats"
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- Veteran advice: hold the login-bonus Present unopened until you are ready to do stat transfers into better items (implying present contents are fixed as cosmetic sets, with transfers used to make them viable).
  — "you open the present when you are ready to make some transfers to make some better items."
  · [Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20151231075434/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/491033-getting-free-oranges-glove-mask-do-30-daily-prizes-and-clan-war-actions)
- Equipment slot roster as listed by a veteran player: Sword, Hat, Armor, Gloves, Mask, Ring, Shoes, Pants (8 slots). From a filter mock-up in a suggestion post, but reflects the game's real slots.
  — "Sword ... Hat ... Armor ... Gloves ... Mask ... Ring ... Shoes ... Pants"
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Item rarity maps to stat-line count: 0 stats = white, 1-2 = green, 3+ = blue, with orange as a separate premium tier; items can carry up to 17 stats.
  — "1-17 Stats (0=white/1-2=green/3+=blue)"
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Copper ore exists as an obtainable/tradeable material item — a player repeatedly begged for spare copper ore in chat.
  — "guys can someone spare me some copper ore? pls"
  · [The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20150907191222/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=2)
- Player claim: character carry weight reaches 300 at endgame, plus over 100 default bank weight, making extra bank space a low-value gold purchase.
  — "you get 300 weight in the end on your character + over a hundred in bank by default"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Weapons require repairs; owning an orange weapon is recommended specifically to avoid repair upkeep (implies orange weapons don't need repair, or make it a non-issue).
  — "Weapon – not to bother with repairs"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Mask and gloves are the priority orange slots because well-statted masks/gloves are essentially unavailable in non-orange rarities (echoed by a second player recommending orange masks and gloves as the best gold spend).
  — "mask and gloves because you can't find any good stated ones unless they are orange"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Recommended orange affixes for fast rebirth releveling: defense, attack, HP and HP regen, stacked as many as possible on one item, freeing level-up points for AP.
  — "try to get def/atk/hp/hp regen(as many of those as possible on one item)"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- Orange gear is tied to 'soul infused' terminology, and a community guide existed for obtaining free soul-infused orange gear (cross-linked from this thread).
  — "How to get FREE soul infused Orange gear!"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20150911091424/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488687-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold?page=1)
- The full set of equipment slots, per a player's proposed auction filter: Sword, Hat, Armor, Gloves, Mask, Ring, Shoes, Pants (8 slots).
  — "Sword … Hat … Armor … Gloves … Mask … Ring … Shoes … Pants"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- The full item-stat affix pool, per the same player filter list: Attack, Defense, Speed, Critical, Pierce, HP, Chi, HP Regen, Chi Regen, plus Attack and Defense for each of Water, Fire, Earth, Wind (17 stats total, matching the '1-17 Stats' filter range).
  — "Attack … Defense … Speed … Critical … Pierce … HP … Chi … HP Regen … Chi Regen"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- Item rarity color maps to stat count: white = 0 stats, green = 1-2 stats, blue = 3+ stats, with Orange as a separate top tier (player's filter notation).
  — "1-17 Stats (0=white/1-2=green/3+=blue)"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- Contradiction/extra tier: another player refers to common trade junk as 'purples', implying a purple rarity tier exists that is plentiful and low-value (not in the white/green/blue/orange scheme above).
  — "thousands of worthless purples"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- A 'dojo return scroll' item exists that teleports the player back (usable as an escape from the final dungeon).
  — "used the dojo return scroll"
  · [(fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1)
- A 'white mask' is a coveted, hard-to-afford appearance item players aspire to as a gear capstone.
  — "Can't wait to top that off with a white mask"
  · [Show off a picture of your awesome character here](https://web.archive.org/web/20150919133214/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488448-show-off-a-picture-of-your-awesome-character-here?page=1)
- Inventory has a weight system, and a separate skill exists that increases how much weight you can carry.
  — "This is different than the skill that allows you to carry more weight."
  · [Where do I store extra money?](https://web.archive.org/web/20151231112117/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489121-where-do-i-store-extra-money?page=1)
- The game sells Western-themed expansion-pack costumes, including Assassin's-Creed-style and Santa Claus outfits (cited by a player arguing the game isn't culturally pure).
  — "WESTERN CULTURE EXPANSION PACK COSTUMES LIKE ASSASINS CREED , SANTA CLAUSE AND MORE"
  · [ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20151231131743/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489368-add-more-types-of-enemies?page=1)
- Orange (soul-infused) weapons level up to level 80 and can carry multiple affixes at once, e.g. a sword with ATK, HP, DEF, and wind (elemental) attack.
  — "a lvl 80 sword which have atk,hp,def and wind attack"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- Player understanding of soul reset: the item keeps its stat categories, but magnitudes re-roll as it levels back up (e.g. 44 HP could return as 22 or 53). Mechanic was officially undocumented.
  — "If it had 44 hp the first time, next time it might be 22 or 53"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- Items level up alongside the player, and every item level-up applies randomness to the item's stats (cited as why simplifying gear leveling would need deep reprogramming).
  — "each time the items levels, it is subject to some randomness"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- DEV (changelog quoted by player eijiwolf): stat-transferring an item onto a soul-infused item now leaves the result soul-infused.
  — "when you stat transfer an item to a soul-infused item, the resultant item will remain soul-infused"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- DEV (changelog quoted by player eijiwolf): level 80 soul-infused items can be stat-transferred to any design of the same item type.
  — "level 80 soul-infused items can be stat transferred to any design of the same type"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- Naming inconsistency in the community: the same item is called 'Soul Rest Scroll' (thread title) and 'soul reset scroll' (post bodies); recreation should verify the in-game string.
  — "how the Soul reset scroll work for the orange items"
  · [It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20151231130128/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490190-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls?page=1)
- Player claim: a sword never permanently breaks; at worst condition it deals only 1-1 damage until repaired.
  — "It can't break, but it will be 1-1 dmg until you repair it.."
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- Weapons can be made permanently unbreakable by spending coins (paid route), in addition to a crafting route.
  — "You can also make it unbreakable with coins."
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- Free unbreakable route: max the Mining mastery to gather the specific ores and the Coin Purse mastery to cover the crafting fee, then any nearby blacksmith makes the weapon unbreakable.
  — "max the mining mastery to collect specific ores, coin purse mastery for the crafting fee"
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- Tested weapon-condition ladder (iron sword): usable, then used, then poor, then broken, degrading slowly; the tester also claims there is no stat bonus for keeping condition high, so 'good/usable' is enough.
  — "It takes a long time for the sword to go from usable to used to poor to broken."
  · [Can my sword break?](https://web.archive.org/web/20151228181850/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486991-can-my-sword-break?page=1)
- 'Orange' is the top item-rarity tier and the de-facto trade currency; orange swords roll affix combinations like Def, HP, and Critical on top of attack.
  — "Any Design of orange sword with Def HP Critical"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Gear rolls multiple named affixes from a pool including Att, Def, HP, Max HP, Chi Regen, Max Chi, Critical, and elemental attack (Earth Att); a level-79 Anbu mask carried four affixes at once.
  — "Anbu mask level 79 (HP, Earth Att, Att, Max Chi)"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Items carry level requirements spanning at least 15 to 79 (traders reference 'items around lv 15-26', 'lvl 50-55' clan armor, and a 'level 79' mask).
  — "will trade good items around lv 15-26"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Clan-exclusive armor sets exist and are tied to specific clans: Gray Wolf gear for Aka Ryu (red) and Bloodied Maw gear for Aoi Hoiru (blue).
  — "Gray Wolf (Aka Ryu) , Bloodied Maw Helmet (Aoi Hoiru)"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Level 50-55 clan (Bloodied Maw) armor can roll 80+ Defense — a buyer set that as a hard requirement, implying it's attainable but not guaranteed.
  — "Must have high def (80+)"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Item stats can be reset — a seller advertises She Wolf Gloves (Att, Def, Max HP, Chi Regen) explicitly marked '(Reseted)', so reset state is visible/meaningful to buyers.
  — "She Wolf Gloves Att ,Def ,Max HP ,Chi Regen (Reseted)"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- An 'Amnesia Scroll' exists as a tradable item (listed among high-value trade stock; likely a respec/forget item).
  — "Amnesia Scroll"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- A tradable founder-exclusive 'Founder Sword' exists, and exotic weapon designs include a scythe, a war fan, a 'golden fork zanpakuto', and a Black Zanpakuto ('Byakuya Zanpa') — anime-inspired weapon skins.
  — "Trading that Founder Sword for a scythe, war fan or the golden fork zanpakuto"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Cosmetic items are tradable inventory objects: named hairstyles (Byakuya, Kenpachi, Successor/Hitsugaya, 'long black hair') and hats including a 'Purple Invisible Hat'; equipment slots seen include headgear, helmet, mask, gloves, and pants.
  — "Byakuya, Kenpachi, Succesor/Hitsugaya hair"
  · [Trade, buy, and sell items and good here!](https://web.archive.org/web/20151231071245/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487887-trade-buy-and-sell-items-and-good-here?page=1)
- Bug report (Apr 2015): treasure chests in the final story dungeon could yield blank/no-name items; the report itself was only an imgur screenshot, so the thread title carries the claim.
  — "Blank Item bug on final story treasure chests?"
  · [Blank Item bug on final story treasure chests?](https://web.archive.org/web/20151231124224/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/487953-blank-item-bug-on-final-story-treasure-chests?page=1)
- Characters have visible cosmetic outfits and can be posed in different world locations; players screenshot their characters in chosen outfit/location combos.
  — "Show your character in the coolest location and outfit possible."
  · [Cool Screenshot](https://web.archive.org/web/20151020164626/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/495163-cool-screenshot?page=1)
- Soul-infused gear is described in-game as gear that 'levels with you', but at launch its level did NOT reset when the player rebirthed, which players felt wasted the (paid) infusion.
  — "Your soul infused gear is suppose to “level with you”"
  · [Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20150912151820/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/484956-soul-infused-gear-should-reset-when-you-rebirth?page=1)
- DEV: Lutgames (2015-04-04) announced an upcoming function letting players optionally reset soul-infused item levels, framed explicitly as player choice rather than automatic on rebirth.
  — "adding a function that will let you reset your soul-infused item levels soon"
  · [Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20150912151820/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/484956-soul-infused-gear-should-reset-when-you-rebirth?page=1)
- Player claim: killing a Red Oni sometimes drops a 'Red Oni Heart', an item the player likens to rare present gifts.
  — "they drop red oni hearts sometimes which are just like rare present gifts"
  · [Red Oni is to powerful!](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Stat transfer copies the SOURCE item's level onto the orange result: transferring a level 80 item's stats onto a level 1 orange yields a level 80 orange; transferring a level 1 blue onto a level 80 orange yields a level 1 orange.
  — "transfer a level 1 blue item, into a level 80 orange, and get a level 1 orange"
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Transferred stats scale with level: a low-level blue ring with perfect stats can be item-transferred onto an orange ring and those stats level up; this applies to all item types, and rings are the hardest slot to find in shops.
  — "It can be item transferred onto an orange ring and those stats will level up."
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Player claim: some items cannot be converted into orange items at all.
  — "theres some items that cant be converted to orange items."
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Player stat-priority claim: Max HP > Atk > Def > Pierce > elemental ATK > Crit > Max Chi > Spd. Confirms the stat roster includes Pierce, per-element ATK, Crit, Chi, and SPD on gear.
  — "Best stats are Max Hp, Atk, Def, Pierce, (Element) ATK, Crit, Max Chi, Spd in that order"
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Player thresholds: ~150 total Chi and ~150 Spd (from items) is enough; never allocate stat points into Chi, and stop allocating SPD points above 35; HP/Chi regen stats are good for grinding but weak for duels/wars.
  — "don’t put stats in Chi at all or in SPD above 35"
  · [Tips Compilation](https://web.archive.org/web/20151231065941/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492891-tips-compilation?page=1)
- Items carry numeric elemental attack values that feed 'element moves'; players judged the values too low to be worthwhile and asked for a 50% increase.
  — "Values of elemental attack should be increased by half on all items to make it worth it and give the element moves more punch."
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- A 'ninja shop' sells easter-egg weapons and armor (a player asked for more of them).
  — "more easter egg weapons and armor in the ninja shop"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Player vocabulary reveals an item rarity/affix system: 'blue' tier items exist and can roll up to 5 stats; 1,000 coins is treated as a notable loot amount (used in a loot suggestion).
  — "give 1k coin and guaranteed 5-stat blue item"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Good endgame equipment can raise a max-level character's Chi pool to about 500 (player claim).
  — "most of good equipment i wear gives me 500 chi at max level"
  · [New way to kill red oni](https://web.archive.org/web/20160104144830/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/501146-new-way-to-kill-red-oni?page=1)
- A weapon called 'heaven sword' exists and is claimed strong enough to kill Amaya.
  — "I can kill her with heaven sword"
  · [How does one beat Amaya?](https://web.archive.org/web/20160101020844/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/503551-how-does-one-beat-amaya?page=1)
- Recall stones are teleport items bound to a specific territory coordinate (players speak of "the recall stone of 82,53") and are transferable between players — they can be gifted and later sold.
  — "ryu gifted the stones to tao like 4 years ago, then tao sold em a few months ago"
  · [82,53/82,54](https://web.archive.org/web/20160725161029/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/628561-82-53-82-54)
- The game ran outfit design contests; winning outfit designs were being released into the game gradually (players complained the full set took years), and some outfits were player-submitted or anime-inspired.
  — "the outfit winners – which is taking years to release in full"
  · [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying)
- Item quality is color-tiered — green and blue tiers are named among free (non-premium) equipment, distinct from gold-shop premium items.
  — "blue or green free to use items"
  · [forum activity is dying](https://web.archive.org/web/20161016203657/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/650580-forum-activity-is-dying)
- A May 2015 balance update changed player stats overnight: one player's HP rose from 1009 to 1076 while attack dropped from 212 to 145, with equipment unchanged (note: both deltas are exactly 67).
  — "my HP had increased from 1009 to 1076, but my attack stat had downgraded from 212 to 145"
  · [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1)
- Equipment grants flat attack bonuses in the tens per piece, and at least three attack-boosting gear pieces can be worn at once (player cites +66, +68, +78 simultaneously).
  — "I still have three gears boosting my attack, +66, +68 and +78"
  · [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1)
- The May 2015 update removed attack bonuses as an intended stat on hats and garments; existing hats/garments with attack bonuses had those bonuses cut by half.
  — "all items which are no longer supposed to have att bonuses (hats and garments) have seen their att bonuses reduced by half"
  · [Stats bug](https://web.archive.org/web/20151231071033/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/496971-stats-bug?page=1)
- Clan armor is a rank reward: each war-room rank-up grants the next clan armor tier, in the sequence Cloth, Light, Medium, Heavy; the Heavy tier also updates the clan mask.
  — "You will receive these armor each time you rank up in the clan"
  · [KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20151219190542/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/498595-ki-sensu-the-golden-fan-recruitment-thread?page=1)
- The kitten quest item has zero weight and no known gameplay effect — a pure joke/cosmetic item.
  — "The kitten has no weight, but as far as we know is just there to look silly."
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Orange (premium-store) items scale their stats with your level; found loot can roll similar or better stats; oranges and gold are also earnable free through progression.
  — "The advantage of orange items is that they level with you."
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Counterpoint (Karyuudan): orange items ARE best — provided their stat rolls suit your build — precisely because they level with you.
  — "Orange items are the best IF you have the correct stats on then , because they will level with you"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Ground-loot stat rolls are claimed to be level-independent — drops at low level roll the same quality as at level 80, so gear and XP farm in the same dungeon.
  — "the rolls you get from the items on the ground are no different than at level 80"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Soul-infused items are the best leveling gear, but a perfected soul-infused item cannot be stored and reused for a later rebirth (player claim, Apr 2015).
  — "you cannot store them if they are perfect and re-use them for a rebirth later on"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Secondhand dev info: a player reports Lutgames said soul-infused gear would be getting some form of reset method (planned change as of Apr 2015).
  — "it looks like soul infused gear will have a reset method to it now based on what Lutgames said"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Piercing damage exists as an equipment affix and bypasses the defense stat — cited as the main reason defense investment is questionable.
  — "The presence of piercing damage as an affix is the primary thing that makes me question its usefulness"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Items have a blue rarity tier that rolls multiple stat affixes; a '5-stat blue item' was framed as a guaranteed-good reward, implying blue items can roll up to about 5 stats.
  — "give 1k coin and guaranteed 5-stat blue item"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Elemental attack values on items were low enough that players felt elemental moves lacked impact; a +50% across-the-board buff was suggested.
  — "Values of elemental attack should be increased by half on all items to make it worth it"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Dual wielding is not in the game (it was requested as a new feature).
  — "duel wielding"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- The ninja shop already contains easter-egg weapons and armor (a player asked for more of them).
  — "more easter egg weapons and armor in the ninja shop"
  · [Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20151226163912/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/500594-suggestions-thread-straw-hat-samurai-duels?page=1)
- Good endgame equipment can raise a max-level character's Chi pool to around 500.
  — "most of good equipment i wear gives me 500 chi at max level"
  · [New way to kill red oni](https://web.archive.org/web/20160104144830/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/501146-new-way-to-kill-red-oni?page=1)
- Red Oni can rarely drop a 'Red Oni Heart', a prestige item other players offer to buy, implying it is tradeable; one player farms a few then stops.
  — "for some reason when i show it people whant to buy it"
  · [New way to kill red oni](https://web.archive.org/web/20160104144830/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/501146-new-way-to-kill-red-oni?page=1)
- A weapon called the 'heaven sword' exists and is strong enough that a player credits it for killing Amaya.
  — "I can kill her with heaven sword"
  · [How does one beat Amaya?](https://web.archive.org/web/20160101020844/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/503551-how-does-one-beat-amaya?page=1)
- As of April 2015, "Larger Breasts" was reportedly the only female-specific item purchasable with gold (premium currency); no female kimonos/geisha outfits existed yet.
  — "Larger breasts are currently the only female specific gold item ive found?"
  · [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- Armor is effectively unisex — female characters commonly wear men's armor since few female-styled pieces existed (player claim).
  — "i have seen plenty of strong female ronin wandering in men’s armor"
  · [Women's clothing?](https://web.archive.org/web/20150612020638/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/489269-womens-clothing)
- Midori Ken's clan cosmetic identity is a green Oni (demon) mask worn by higher-ranked/experienced clan members; the clan color is green.
  — "more experienced warriors wear a green mask displaying an Oni"
  · [MIDORI KEN recruitement thread](https://web.archive.org/web/20161016202029/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/497892-midori-ken-recruitement-thread)
- Clan rank-ups award clan-branded armor in four tiers: Cloth Armor, then Light, Medium, and Heavy Armor (Heavy includes an updated mask) — one piece per rank-up.
  — "You will receive these armor each time you rank up in the clan"
  · [KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20160725161015/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/498595-ki-sensu-the-golden-fan-recruitment-thread)
- Hunting mobs drops items of variable quality, and good drops are transferable — players routinely gift mob-drop items to others.
  — "I give out items whenever I get a good one from hunting mobs"
  · [KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20160725161015/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/498595-ki-sensu-the-golden-fan-recruitment-thread)
- Orange store items scale their level with the player; found loot can roll similar or better stats; orange items and gold are also earnable free through progression (player claim).
  — "The advantage of orange items is that they level with you"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Soul-infused items are claimed best for leveling, but 'perfect' ones cannot be stored and reused for a later rebirth (AbsoluteShadow claim, Apr 2015).
  — "Soul infused items are the best to level with but you cannot store them if they are perfect"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Piercing damage exists as an equipment affix that bypasses the defense stat (Catface claim).
  — "The presence of piercing damage as an affix is the primary thing that makes me question its usefulness"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Player report (Catface, second-hand): at the time, orange items did NOT drop back to level 1 on rebirth, so a fresh orange set was needed after each rebirth.
  — "when you rebirth they currently don’t drop back down to level 1"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Counter-claim (AbsoluteShadow): ground-loot stat rolls do not scale with level — rolls at low level equal those at level 80, so re-gearing after rebirth is easy while grinding dungeons.
  — "the rolls you get from the items on the ground are no different than at level 80"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Second-hand dev info: a player relays that Lutgames said soul-infused gear would be getting a reset method (planned feature as of Apr 2015).
  — "it looks like soul infused gear will have a reset method to it now based on what Lutgames said"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- The kitten obtained in the story has zero inventory weight and is purely cosmetic as far as players knew.
  — "The kitten has no weight, but as far as we know is just there to look silly"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- A 'ninja shop' sold costumes; player-cited costume names include Yellow Flash, White Fang, and Warlord; no official costume list was known to exist.
  — "Is there a list of costumes (like Yellow Flash, White Fang, Warlord…) that can be bought in the ninja shop?"
  · [[Straw Hat Samurai: Duels] Questions](https://web.archive.org/web/20170427091012/http://www.kongregate.com:80/forums/12-kongregate-multiplayer-games/topics/494653-straw-hat-samurai-duels-questions)
- Weapon durability/breaking was a live player concern — a 6-post thread asked whether swords can break (answers not in this snapshot).
  — "Can my sword break?"
  · [Straw Hat Samurai: Duels forum (index)](https://web.archive.org/web/20150423012315/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels)
- Orange items had a reset mechanic that was buggy or confusing enough to spawn a 10-post issues thread by Apr 2015.
  — "Issues with resetting orange items"
  · [Straw Hat Samurai: Duels forum (index)](https://web.archive.org/web/20150423012315/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels)
- Bug report thread: treasure chests at the end of the story could yield blank items (Apr 2015).
  — "Blank Item bug on final story treasure chests?"
  · [Straw Hat Samurai: Duels forum (index)](https://web.archive.org/web/20150423012315/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels)
- Equipment rarity color tiers run white < green < blue, with purple as a separate 'unique' tier (player consensus in thread).
  — "So white<green<blue and purple is unique?"
  · [[Straw Hat Samurai: Duels] Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Green rarity means the item carries 1-2 bonus affixes.
  — "Green means 1-2 bonus are applied to a weapon."
  · [[Straw Hat Samurai: Duels] Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Blue rarity means 3 to 5 bonus affixes on the item.
  — "Blue means 3 and above (up to 5)"
  · [[Straw Hat Samurai: Duels] Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Purple marks unique items (from the ninja store or quests); the color is fixed regardless of affix quality, so players must inspect the actual bonuses. Quest uniques are usually not equipment.
  — "Purple is a unique item, either bought from the ninja store, or need for a quest"
  · [[Straw Hat Samurai: Duels] Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Affixes named 'Sharp' and 'Brutal' increase weapon damage; damage can be raised either via stat points into attack or via equipment bonuses.
  — "Keep an eye out for "Sharp" or "Brutal" stuff, those increase your damage."
  · [[Straw Hat Samurai: Duels] Equipments and how do they work exactly?](https://web.archive.org/web/20200719120130/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486247-straw-hat-samurai-duels-equipments-and-how-do-they-work-exactly)
- Kunais exist as a usable combat option and were suggested as a tool against hard bosses; the same player also asked whether boss damage was base damage and whether the victim's HP was too low.
  — "how is your HP maybe it is too low? – did you try Kunais?"
  · [How do you beat the Statue Guardian?](https://web.archive.org/web/20200719095529/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487269-straw-hat-samurai-duels-how-do-you-beat-the-statue-guardian)
- Bug report: after resetting an orange (soul-infused) pants item and releveling it to item level 60, its max-HP and max-Chi bonuses came back at +30 instead of the prior +90 — tracking the ATK stat instead of being 3x it.
  — "its max hp and max chi stats were only +30, instead of +90 like it was before"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- DEV: Lutgames stated that each reset-and-relevel of a soul-infused item rerolls its stats; the resulting stats are random luck by design.
  — "Each time you reset and level up a soul-infused item, the stats you end up with will be different. It all depends on luck."
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Baseline for comparison: every +hp item sold in the ninja shop gives around +90 HP at item level 60.
  — "Every item with +hp in the ninja shop gives around +90 hp at lvl 60"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Player report: soul-reset gear at level 39 ends up about 10-20 stat points worse than equivalent ninja-shop gear; getting def/hp/atk stats combined on one piece is described as really hard.
  — "having worst stats than the gears in ninja shop by abt 10-20 at lvl39"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Multiple players contradict the dev's 'luck' explanation: reset orange gear comes back with stats worse than store gear every single time, which they call a bug needing a fix.
  — "when you reset the gear the stats get worse than the ones at store , every time. Fix please."
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Soul-infused (orange) gear's selling point is that it levels up with the player so you keep the stat rolls you like while leveling, rather than replacing gear.
  — "I got the soul infused gear to keep the stats I liked as I leveled up, not the look."
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Reskinning a soul-infused item raises its level requirement by 10 and strips its soul-infused status.
  — "it's level requirement jumped up by 10 and it would lose it's soul-infused status too"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Player analysis: orange items generated (bought/dropped) at high level roll far better stats than orange items leveled up from low level; a proposed fix was to lock an orange to a fixed percentile of per-level stat growth.
  — "Oranges that are generated at a high level, are way better than oranges gotten at a low level?"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Concrete post-reset numbers: a level-60 player's four orange pieces each rolled only about +18 HP / +19 ATK, strictly worse than blue drops of the same level; orange sets cost money, so players stored them and wore blues instead.
  — "even the blue gears that are droping at lvl60 have better stats..by far better"
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Original poster's final verdict: orange item level-up stat gain is consistently below what it should be — a deterministic scaling bug, not RNG.
  — "The stats you gain from lvling up is always lower than what it should be. It is not luck, it is very consistent."
  · [Issues with resetting orange items](https://web.archive.org/web/20200719190506/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487337-straw-hat-samurai-duels-issues-with-resetting-orange-items)
- Speed boots exist and were suggested as a way to travel faster overland.
  — "by speed booots"
  · [HOW DO I FAST TRAVEL?](https://web.archive.org/web/20200719190518/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487363-straw-hat-samurai-duels-how-do-i-fast-travel)
- Bug report: orange (soul-infused) lvl-60 pants originally gave +90 max HP and +90 max Chi; after a soul reset and re-leveling to 60 those stats came back as only +30, tracking the item's ATK value instead of 3x it.
  — "its max hp and max chi stats were only +30, instead of +90"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- DEV: Lutgames — each soul reset plus re-level of a soul-infused item rerolls the stats it ends up with; the outcome is random luck by design.
  — "the stats you end up with will be different. It all depends on luck."
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Baseline players compared against: +HP items in the ninja shop give around +90 HP at item level 60.
  — "Every item with +hp in the ninja shop gives around +90 hp at lvl 60"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Contradicting the dev's luck explanation: players report reset orange gear consistently returns 10-20 stat points weaker than equivalent ninja-shop gear (observed at lvl 39).
  — "having worst stats than the gears in ninja shop by abt 10-20 at lvl39"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Multiple players assert the orange-item level-up algorithm after reset is broken: gains are always below expected, consistently, not RNG variance.
  — "It is not luck, it is very consistent. Pls fix."
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Reskinning a soul-infused item raises its level requirement by 10 and strips its soul-infused status.
  — "level requirement jumped up by 10 and it would lose it's soul-infused status"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Orange items level up alongside the player (leveling-gear system); players observed oranges freshly generated at high level roll far better stats than oranges leveled up from low level.
  — "Oranges that are generated at a high level, are way better than oranges gotten at a low level"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- Concrete post-reset numbers at lvl 60: orange pieces rolling only about +18 HP / +19 ATK each across four pieces — strictly worse than blue drops of the same level.
  — "orange gears i have now that has just +18hp and +19atk in like 4x peices"
  · [Issues with resetting orange items](https://web.archive.org/web/20200718231904/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486991-straw-hat-samurai-duels-can-my-sword-break)
- A limited 'Founder Sword' item existed and was tradeable; weapon variety included scythes, war fans, and zanpakuto skins (one nicknamed the 'golden fork').
  — "Trading that Founder Sword for a scythe, war fan or the golden fork zanpakuto"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Clan-associated 'Bloodied Maw' armor existed around item level 50-55, and armor DEF rolls above 80 were possible in that level band.
  — "any clan blooded maw armor (lvl 50-55) … Must have high def (80+)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- An orange item-rarity tier existed ('Reaper Pants' called 'another orange'), and items carrying soul-infused produce ('with potatoes') traded at a premium.
  — "For: Reaper Pants with potatoes or another orange"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Swords always carry Attack and could additionally roll Def, HP, and Critical affixes; a Def/HP/Crit orange sword was a sought-after roll.
  — "Any Design of orange sword with Def HP Critical (att of course XD)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Gloves could roll Att, Def, Max HP, and Chi Regen affixes; items could be 'reseted', implying a stat/affix reset mechanic existed.
  — "She Wolf Gloves Att ,Def ,Max HP ,Chi Regen (Reseted)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- An 'Amnesia Scroll' item existed and was tradeable (name implies a respec/reset consumable).
  — "Amnesia Scroll"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Cosmetic hair items named after anime characters were tradeable drops: Byakuya, Kenpachi, Successor/Hitsugaya, Madara, Kunoichi, and 'long black hair' variants all circulated.
  — "Trading Kenpachi Hair for long black hair, Madara hair or the Kunoichi hair."
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Exact endgame footwear roll: Reaper Sandal at item level 78 with def 81, crit 26, wind atk 26, water atk 26, SPEED 52 — confirming SPEED and dual elemental-attack affixes can appear on footwear.
  — "reaper sandal level 78 stat:def 81/crit 26/wind atk 26/water atk 26/speed 52"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- A 'Branch' (stick) weapon existed and was desirable — one player offered a level 78 Reaper Sandal for any Branch of item level 40-80; another called it 'that badass stick'.
  — "for branch with stat level 40-80"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Exact endgame armor roll: 'Clankiller' armor at item level 80 with def 91, HP 156, crit 29, pierce 16 — confirming a PIERCE affix and item levels reaching 80.
  — "clankiller armor level 80 91 def/156 hp/29 crit/16 pierce"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Colored garments and female kimonos existed as cosmetic gear; players disputed which colors were actually rare (one claimed rarity, another rebutted 'not very rare').
  — "TRADING RARE COLOR GARMENTS AND FEMALE KIMONOS"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- A purple rarity tier existed below orange, and an 'Invisible Hat' cosmetic (hides headgear) circulated in trade.
  — "Purple Invisible Hat (2 in Stock)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Gear sets had English names with Japanese aliases: Gray Wolf (Aka Ryu), Bloodied Maw Helmet (Aoi Hoiru); other named items included She Wolf and Grasscutter.
  — "Gray Wolf (Aka Ryu) , Bloodied Maw Helmet (Aoi Hoiru)"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- 'Envy mask' and 'Hono mask' were mask item names players traded (2017 post, wording garbled).
  — "Hi am envy mask so with hono mask??"
  · [[Straw Hat Samurai: Duels] Trade, buy, and sell items and good here!](https://web.archive.org/web/20200719092641/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487887-straw-hat-samurai-duels-trade-buy-and-sell-items-and-good-here)
- Bug report (April 2015): treasure chests in the final story chapter could yield blank/nameless items; the evidence was a screenshot (image not recoverable from the archive).
  — "Blank Item bug on final story treasure chests?"
  · [[Straw Hat Samurai: Duels] Blank Item bug on final story treasure chests?](https://web.archive.org/web/20200719095346/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487953-straw-hat-samurai-duels-blank-item-bug-on-final-story-treasure-chests)
- A 'dojo return scroll' consumable existed that teleports the player back to the dojo (fast-travel escape item).
  — "used the dojo return scroll"
  · [[Straw Hat Samurai: Duels] (fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20200719005252/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488106-straw-hat-samurai-duels-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon)
- Orange (store/premium) items level up with the player; dropped loot can roll similar or better stats, and oranges plus gold are also earnable free through progression.
  — "The advantage of orange items is that they level with you"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Counter-claim: orange items ARE best-in-slot provided their stat rolls are correct, precisely because they level with you.
  — "Orange items are the best IF you have the correct stats on then"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Piercing damage exists as an equipment affix and bypasses defense.
  — "The presence of piercing damage as an affix is the primary thing that makes me question its usefulness"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Claim: ground-loot stat rolls are level-independent — the rolls you get at any level are no different from rolls at level 80, so gear farming doubles with XP grinding in dungeons.
  — "the rolls you get from the items on the ground are no different than at level 80"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- The kitten obtained in the story has zero inventory weight and no known gameplay benefit (cosmetic).
  — "The kitten has no weight, but as far as we know is just there to look silly"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- The HP/Chi regain affix on items triggers at the end of a battle, not during it.
  — "regain hp/chi is at the end of the battle"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Beta-era claim: perfect soul-infused items could not be banked and reused for a later rebirth.
  — "you cannot store them if they are perfect and re-use them for a rebirth later on"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Soul-infused gear is expected to 'level with you' (scale alongside the character) and is associated with spending gold/real money.
  — "Your soul infused gear is suppose to “level with you”"
  · [[Straw Hat Samurai: Duels] Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20200719095645/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484956-straw-hat-samurai-duels-soul-infused-gear-should-reset-when-you-rebirth)
- DEV: Lutgames announced (2015-04-04) an upcoming function letting players optionally reset soul-infused item levels, so resetting stays the player's choice.
  — "We will be adding a function that will let you reset your soul-infused item levels soon"
  · [[Straw Hat Samurai: Duels] Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20200719095645/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484956-straw-hat-samurai-duels-soul-infused-gear-should-reset-when-you-rebirth)
- The reset shipped within ~4 days (by 2015-04-08): orange scrolls bought at the peddler for 1000 coins; you 'Use' the scroll then drag an item onto it to revert that item to level 1.
  — "You can now buy orange scrolls at the peddler for 1000 coins"
  · [[Straw Hat Samurai: Duels] Soul Infused Gear should reset when you Rebirth...](https://web.archive.org/web/20200719095645/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484956-straw-hat-samurai-duels-soul-infused-gear-should-reset-when-you-rebirth)
- Rings are an equipment slot and are described as hard to obtain, good-rolled ones especially.
  — "rings are rings, and are hard to get, let alone good ones!"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Gear affix count scales with the level it is generated at: orange gear obtained at high level (40+) rolls 6-7 stats, early orange gear only 3-4; gear levels up with the player but only improves its existing stats, never gains new ones.
  — "at later levels the gear end up having 6-7 stats... your gear wont get new stats as they level, only improves the ones you already have"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- The 60-gold package rolls random stats on its pieces, so it is considered a gamble compared with hand-picking individual pieces.
  — "you will end up getting useless stats on the gear, and you will end up wasting your gold"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- A stat-transfer system exists: you can move the stats of an ugly piece with good rolls onto a good-looking piece with bad rolls, decoupling looks from stats.
  — "stat transfer bad looking gear with good stats into good looking gear with bad stats"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Present boxes are treated as a cosmetics lottery; for stats the advice is to buy individual shop pieces or farm gear by hunting merchants and grinding enemies (merchants are a gear-drop source).
  — "if you want stats buy individual pieces or go hunt merchants and grind enemies"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- Timing advice for opening login presents: open when ready to do stat transfers into better items (contents/utility tied to when you open, per player belief; another asks if level 80 is optimal).
  — "you open the present when you are ready to make some transfers to make some better items"
  · [[Straw Hat Samurai: Duels] Getting FREE Oranges/Glove/Mask! Do 31 Daily Prizes and Clan War actions.](https://web.archive.org/web/20200719111454/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/491033-straw-hat-samurai-duels-getting-free-oranges-glove-mask-do-31-daily-prizes-and-clan-war-actions)
- A pet kitten item exists: it weighs 1, cannot be sold or stored, and cannot be renamed.
  — "a pet that has 1 weight, cannot be sold or stored"
  · [[Straw Hat Samurai: Duels] ITT: Things you want to see in the game](https://web.archive.org/web/20200719131437/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490507-straw-hat-samurai-duels-itt-things-you-want-to-see-in-the-game)
- Equipment slot list per a veteran player's filter mockup (reflecting the real slots): Sword, Hat, Armor, Gloves, Mask, Ring, Shoes, Pants — 8 gear slots.
  — "Sword ... Hat ... Armor ... Gloves ... Mask ... Ring ... Shoes ... Pants"
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Item stat/affix pool per the same player mockup: Attack, Defense, Speed, Critical, Pierce, HP, Chi, HP Regen, Chi Regen, plus separate elemental Attack AND Defense stats for each of Water, Fire, Earth, Wind (4 elements x 2).
  — "Critical ... Pierce ... HP ... Chi ... HP Regen ... Chi Regen ... Water Att ... Water Def ... Fire Att ... Fire Def"
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Items span a level range of 1-80 (consistent with a level-80 cap), per the same player's proposed search filter.
  — "1-80 Level Range"
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- Item rarity color is driven by the number of stats/affixes: 0 stats = white, 1-2 = green, 3+ = blue, with items carrying up to 17 stats; Orange exists as a distinct further tier (player-reported color coding).
  — "1-17 Stats (0=white/1-2=green/3+=blue) ... Orange"
  · [[Straw Hat Samurai: Duels] auction system](https://web.archive.org/web/20200719074044/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492388-straw-hat-samurai-duels-auction-system)
- A white mask exists as a coveted cosmetic/gear piece players save up for.
  — "Can't wait to top that off with a white mask"
  · [Show off a picture of your awesome character here](https://web.archive.org/web/20200719000124/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488448-straw-hat-samurai-duels-show-off-a-picture-of-your-awesome-character-here)
- Equipment slots enumerated by a player's proposed auction filter: Sword, Hat, Armor, Gloves, Mask, Ring, Shoes, Pants (8 slots).
  — "Sword ... Hat ... Armor ... Gloves ... Mask ... Ring ... Shoes ... Pants"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Item affix stat pool per the same filter list: Attack, Defense, Speed, Critical, Pierce, HP, Chi, HP Regen, Chi Regen, plus Water/Fire/Earth/Wind Attack and Defense each.
  — "Critical ... Pierce ... HP ... Chi ... HP Regen ... Chi Regen ... Water Att ... Wind Def"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Rarity color maps to affix-stat count: white = 0 stats, green = 1-2, blue = 3+, with Orange as a distinct top tier; a stat-count filter would run 1-17, implying items can roll up to ~17 stats.
  — "1-17 Stats (0=white/1-2=green/3+=blue)"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Player claim: the common trash tier of tradeable drops is 'purples' - contradicts/extends the white/green/blue/orange scheme listed by another player in the same thread.
  — "a small handful of decent items and thousands of worthless purples"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Priority soul-infused (orange) pieces in order: mask, gloves, weapon - because good-stat masks and gloves essentially only exist as oranges.
  — "most important oranges are – mask, gloves, weapon"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Weapons have a condition/repair mechanic; an orange (soul-infused) weapon frees you from bothering with repairs, and also saves inventory weight otherwise spent carrying spare swords.
  — "Weapon – not to bother with repairs"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- 'Presents' are random unidentified items comparable to buying a blue item without seeing its stats; a Present is also a rare drop from the daily prize.
  — "same as if you had bought the 1st blue item you see without looking at stats"
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- DEV: Lutgames actively solicited player outfit suggestions (with reference images) for addition to the game's clothing catalogue.
  — "Please feel free to suggest (with images if possible) what other outfits"
  · [Women's clothing?](https://web.archive.org/web/20200719124227/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489269-straw-hat-samurai-duels-womens-clothing)
- Player claim: a 'larger breasts' body modifier is the only female-specific gold (premium) item in the shop as of April 2015.
  — "Larger breasts are currently the only female specific gold item"
  · [Women's clothing?](https://web.archive.org/web/20200719124227/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489269-straw-hat-samurai-duels-womens-clothing)
- Player claim: a 'ninja shop' sells outfits referencing characters from two (anime) series - the player's follow-up suggestions reference Naruto and Bleach.
  — "the strong female captains and ninja from the two series used in the ninja shop"
  · [Women's clothing?](https://web.archive.org/web/20200719124227/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489269-straw-hat-samurai-duels-womens-clothing)
- Cosmetic face items exist — panda mask, hollow mask, and beard — and wearing three at once is considered impossible under normal rules; a player seen with all three was reported as a hacker.
  — "panda mask and hollow mask and beard on his face at the same moment wich is impossible"
  · [[Straw Hat Samurai: Duels] Report hackers here](https://web.archive.org/web/20200719115839/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/492905-straw-hat-samurai-duels-report-hackers-here)
- A gunbai (war-fan weapon players liken to Madara Uchiha's) exists in-game, obtainable only from the store, and only as a soul-infused weapon.
  — "It exists, but only in the store as a soul infused weapon."
  · [[Straw Hat Samurai: Duels] Madara uchiha Gunbai](https://web.archive.org/web/20200719203743/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493206-straw-hat-samurai-duels-madara-uchiha-gunbai)
- A 'warlord' armor set exists in-game that players compare to Madara Uchiha's look from Naruto.
  — "For thsoe who saw naruto and the warlord armor ingame"
  · [[Straw Hat Samurai: Duels] Madara uchiha Gunbai](https://web.archive.org/web/20200719203743/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493206-straw-hat-samurai-duels-madara-uchiha-gunbai)
- Gear carries stat affixes such as +attack and +HP; standard duel advice is to stack skill points in HP and find +atk gear.
  — "invest skill points in HP, find some gear with +atk, use kunai"
  · [[Straw Hat Samurai: Duels] I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- The starting weapon is jokingly called a 'murderer-twig'; players replace it with real swords early on.
  — "I actually changed the murderer-twig for one of those fancy sharp and pointy things"
  · [[Straw Hat Samurai: Duels] I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- Paid/expansion costume packs included Western-themed outfits such as an Assassin's-Creed-style costume and a Santa Claus costume.
  — "WESTERN CULTURE EXPANSION PACK COSTUMES LIKE ASSASINS CREED,SANTA CLAUSE"
  · [[Straw Hat Samurai: Duels] ADD MORE TYPES OF ENEMIES](https://web.archive.org/web/20200718232837/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489368-straw-hat-samurai-duels-add-more-types-of-enemies)
- Items have their own levels up to 80 and can roll multiple affixes simultaneously, including elemental attack — e.g., a level-80 sword with atk, hp, def, and wind attack.
  — "a soul reset scroll on a lvl 80 sword which have atk,hp,def and wind attack"
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- Soul reset scrolls are used on orange-tier (top rarity) items; their exact effect was undocumented and players wanted an official explanation from Lutgames.
  — "I’m really confused about how the Soul reset scroll work for the orange items."
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- Player understanding of soul reset: the item keeps its stat categories but values re-roll within a range as it levels back up — e.g., 44 HP might return as 22 or 53.
  — "If it had 44 hp the first time, next time it might be 22 or 53"
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- Gear levels up alongside the player, and each item level-up applies some randomness to stat growth (so two identical items diverge).
  — "each time the items levels, it is subject to some randomness"
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- DEV (official changelog quoted by player): stat-transferring an item onto a soul-infused item keeps the resulting item soul-infused.
  — "when you stat transfer an item to a soul-infused item, the resultant item will remain soul-infused"
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- DEV (official changelog quoted by player): level-80 soul-infused items can be stat-transferred onto any design of the same item type — confirming a stat-transfer system that moves stats between item designs.
  — "level 80 soul-infused items can be stat transferred to any design of the same type"
  · [[Straw Hat Samurai: Duels] It would be nice to have an official explanation on Soul Rest Scrolls...](https://web.archive.org/web/20200719130226/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490190-straw-hat-samurai-duels-it-would-be-nice-to-have-an-official-explanation-on-soul-rest-scrolls)
- DEV: Weapons have min–max damage ranges. A July 2015 patch narrowed one steel sword's range: max damage reduced, min damage raised, average damage unchanged.
  — "max damage was reduced BUT min damage was also increased (thus maintaining the same average damage)"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- DEV: Sword weight and the critical-damage-bar depletion rate penalize weapon users; the steel-sword range narrowing was done so its users would not be penalized too heavily by these two mechanics.
  — "not be penalized too much by the sword weight and critical damage bar depletion rate"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- A patch (quoted by a player from dev notes) made weapon weight determine both the weapon's damage range and how much the critical bar is depleted with each slash.
  — "weapon weight is now tied to weapon damage range and the amount depleted from the critical bar with each slash"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- Concrete player-cited examples of the weight↔damage-range rule: a 10-weight sword rolled 31–51 damage (range 20) while a 5-weight sword rolled 82–85 (range 3) — heavier weapons have wider, less consistent damage.
  — "31-51 dmg = 20 damage range on 10 weight sword, 82-85 dmg = 3 damage range on 5 weight sword"
  · [[Straw Hat Samurai: Duels] nerfed again](https://web.archive.org/web/20200719070545/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/518759-straw-hat-samurai-duels-nerfed-again)
- Blue-rarity items exist and can roll up to 5 stat bonuses (a '5-stat blue' was cited as a premium reward), and lootable corpses appear in the world.
  — "give 1k coin and guaranteed 5-stat blue item"
  · [[Straw Hat Samurai: Duels] Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- Dual wielding is not in the game (it was a player request).
  — "duel wielding"
  · [[Straw Hat Samurai: Duels] Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- A ninja shop exists and already stocks some easter-egg (joke/novelty) weapons and armor; a player asked for more of them.
  — "more easter egg weapons and armor in the ninja shop"
  · [[Straw Hat Samurai: Duels] Suggestions Thread - Straw Hat Samurai Duels](https://web.archive.org/web/20200719000558/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/500594-straw-hat-samurai-duels-suggestions-thread-straw-hat-samurai-duels)
- Good endgame equipment can raise a max-level character's Chi pool to about 500.
  — "most of good equipment i wear gives me 500 chi at max level"
  · [[Straw Hat Samurai: Duels] New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- Red Oni can drop a 'Red Oni Heart' item that other players want to buy when shown, making it the main reason to farm the Oni occasionally.
  — "spend some time and to get red oni heart . for some reason when i show it people whant to buy it"
  · [[Straw Hat Samurai: Duels] New way to kill red oni](https://web.archive.org/web/20200719184058/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/501146-straw-hat-samurai-duels-new-way-to-kill-red-oni)
- Shuriken exist as a ranged attack option and are suggested as a safe counter to Amaya's melee reach (may be a throwable item or a special move).
  — "just use shuriken"
  · [[Straw Hat Samurai: Duels] How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Player report (Hida_Kisada, char Killrog): after the mid-May 2015 update his attack stat fell from 212 to 145 while HP simultaneously rose from 1009 to 1076, with equipment unchanged — he wore three gear pieces granting +66, +68 and +78 attack.
  — "my HP had increased from 1009 to 1076, but my attack stat had downgraded from 212 to 145"
  · [[Straw Hat Samurai: Duels] Stats bug](https://web.archive.org/web/20200719091952/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496971-straw-hat-samurai-duels-stats-bug)
- Patch fact (player-relayed, May 2015): hats and garments were deemed item types that should no longer carry attack bonuses, and the attack bonuses on existing hats/garments were cut by half in an update.
  — "all items which are no longer supposed to have att bonuses (hats and garments) have seen their att bonuses reduced by half"
  · [[Straw Hat Samurai: Duels] Stats bug](https://web.archive.org/web/20200719091952/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496971-straw-hat-samurai-duels-stats-bug)
- Player balance claim (FateIsEscaped, contradicting another player's 'game is balanced now' claim): legacy 'old gear' remained overpowered and could no longer be obtained after the nerf patch, while gear obtainable by newer players stayed permanently weaker.
  — "Old gear is still OP. New gear the newer players can get is still weak"
  · [[Straw Hat Samurai: Duels] Stats bug](https://web.archive.org/web/20200719091952/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/496971-straw-hat-samurai-duels-stats-bug)
- Midori Ken's more experienced warriors wear a green Oni (demon) mask — the clan's distinguishing cosmetic; a second player independently confirms 'their mask is a green oni mask'.
  — "its more experienced warriors wear a green mask displaying an Oni"
  · [[Straw Hat Samurai: Duels] MIDORI KEN recruitement thread](https://web.archive.org/web/20200719021100/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/497892-straw-hat-samurai-duels-midori-ken-recruitement-thread)
- Clan armor is granted at each clan rank-up: Ki Sensu's documented tiers are Cloth Armor, Light Armor, Medium Armor, and Heavy Armor, plus a clan mask that was added to the heavy tier in an update.
  — "You will receive these armor each time you rank up in the clan"
  · [[Straw Hat Samurai: Duels] KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20200719143214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/498595-straw-hat-samurai-duels-ki-sensu-the-golden-fan-recruitment-thread)
- Town merchants sell rings with attack stats, and players shop across merchants for rings with 'perfect' attack rolls; ruined towns remove merchant access.
  — "merchants who will not hawe a perfect atack stat rings"
  · [Have the option to burn our own villages?](https://web.archive.org/web/20200719005133/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/510653-straw-hat-samurai-duels-have-the-option-to-burn-our-own-villages)
- A complete orange-tier equipment set exists and is treated as endgame gear a player can fully finish collecting.
  — "she hawe all the full complete orange set"
  · [Have the option to burn our own villages?](https://web.archive.org/web/20200719005133/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/510653-straw-hat-samurai-duels-have-the-option-to-burn-our-own-villages)
- Player claim: using the 'raccoon' (likely a companion/consumable) is best while grinding bandit waves; exact effect unspecified.
  — "raccoon use is best"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Red Oni sometimes drops 'Red Oni Hearts', described as rare items comparable to rare present gifts — the incentive for killing it despite the danger.
  — "they drop red oni hearts sometimes which are just like rare present gifts"
  · [Red Oni is to powerful!](https://web.archive.org/web/20200719002937/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/514786-straw-hat-samurai-duels-red-oni-is-to-powerful)
- Item-evaluation tip: rarity color (orange = top tier) is not a reliable quality signal — compare raw stats instead; rings are the stated exception where the orange tier does matter.
  — "look at the stats not if a item is orange or not (exept rings)"
  · [[Straw Hat Samurai: Duels] post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Items themselves gain levels through use ("leveling an item" is a thing); the recommended grind is finding a spawn point that produces 3 waves of bandits and killing them repeatedly.
  — "If you are trying to level an item, look for a spawn of 3 wave bandits, and kill them over and over."
  · [[Straw Hat Samurai: Duels] post your tips and tricks here](https://web.archive.org/web/20200719075912/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/617419-straw-hat-samurai-duels-post-your-tips-and-tricks-here)
- Recall stones are fast-travel items each bound to a specific territory coordinate, and the bound coordinate is visible on the item (a player was shown "the recall stone of 82,53").
  — "Then why did you show me the recall stone of 82,53"
  · [[Straw Hat Samurai: Duels] 82,53/82,54](https://web.archive.org/web/20200719163919/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/628561-straw-hat-samurai-duels-82-53-82-54)
- Free-drop items of blue or green rarity could outperform premium gold-shop items — premium gear was not clearly stronger than what free players could find.
  — "you can find blue or green free to use items that can be better than the pay to use items"
  · [[Straw Hat Samurai: Duels] forum activity is dying](https://web.archive.org/web/20200719051553/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/650580-straw-hat-samurai-duels-forum-activity-is-dying)
- Player claim (niconicolas): the kitten has no gameplay function at all.
  — "the kitten doesnt have use so i dont know why u deleted it"
  · [I'm Sorry guys but](https://web.archive.org/web/20200719015259/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/601813-straw-hat-samurai-duels-im-sorry-guys-but)
- Contradicting player claim (Januchi, secondhand): the kitten speeds up the ninja shop's refresh cycle. Directly denied by niconicolas ('the kitten doesnt do anything').
  — "the kitten speeds-up the ninja shop refresh… or so i was told"
  · [I'm Sorry guys but](https://web.archive.org/web/20200719015259/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/601813-straw-hat-samurai-duels-im-sorry-guys-but)
- Contested: whether monthly Ninja Rewards outfits that include hair grant the hair. niconicolas says you get 'just equipment'.
  — "A: just equipment.."
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Contradicting claim (Azgodeth): if a Ninja Rewards outfit set contains hair, claiming it does grant that hair.
  — "if the set contains hair, it will come with that hair."
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
- Soul-infused swords do not break — soul infusion exempts a weapon from the normal weapon-breaking/condition system (answered 'no' on page 1, re-confirmed 'No they do not' on page 2).
  — "Q:Will soul-infused swords break? … A: no"
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)

## progression (76 raw facts)

- Player-understood level range is 1-80 (used as the level filter bounds in a veteran's market mock-up; consistent with 'level 80' being discussed as endgame in the daily-prize thread).
  — "1-80 Level Range"
  · [auction system](https://web.archive.org/web/20151231023735/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/492388-auction-system)
- Grinding advice: forest territories have levels, and the highest territory a player should farm is capped/optimal at their own level +3.
  — "just level up at the highest territory (your level+3) in the forest"
  · [The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20151231074339/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/490224-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Item/character levels span a 1-80 range (player's proposed auction filter used '1-80 Level Range').
  — "1-80 Level Range"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20150915012549/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488497-suggestion-auction-market-system?page=1)
- Player claim: enemies inside the final dungeon give no XP (at least on the respawn loop), so grinding inside it is impossible.
  — "I don't get any exp from the enemies, so grinding here is no help"
  · [(fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1)
- Difficulty datapoint: a level-38 player reached the final survival boss but could not clear it, blaming unbalanced stats/gear — final content is beatable around but not guaranteed at level 38.
  — "I'm level 38, but I guess either my stats are too unbalanced"
  · [(fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20151231145611/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488106-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon?page=1)
- Player claim: between level 36 and level 45 he had accumulated over 100 attribute points in attack, defense and speed — a benchmark for attribute totals in the mid-40s.
  — "when i was lvl 36 now i am lvl 45 i had more than 100 attributes in atk def n spd"
  · [Show off a picture of your awesome character here](https://web.archive.org/web/20150919133214/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/488448-show-off-a-picture-of-your-awesome-character-here?page=1)
- Each stance has its own mastery level that increases with use; a level 18 character reports only mastery level 2 on light stance, and veterans say focusing one stance is the intended path.
  — "My highest mastery is level two. On light stance. But then again… I'm just lvl 18."
  · [I don't get the dueling part...](https://web.archive.org/web/20160101011150/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/489310-i-dont-get-the-dueling-part?page=1)
- Difficulty-wall claim (2019): a player stuck at level 12 right after the Chikako fight reports being unable to level further while bandits kill them easily.
  — "i cant lvl up from lvl 12 and so bandits are easily killing me"
  · [[Straw Hat Samurai: Duels] Story Quest Help](https://web.archive.org/web/20190718050721/http://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487823-straw-hat-samurai-duels-story-quest-help?page=2)
- Progression pace datapoint (Apr 2015): a dedicated player was approaching level 80 on his 19th day of play.
  — "approaching lvl 80 and its his 19th day playing"
  · [State of the Clan War](https://web.archive.org/web/20150907063406/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486220-state-of-the-clan-war?page=1)
- Losing a battle costs nothing — you get a free respawn — so grinders could ignore defense on bosses and just relaunch; grind build advice: one-shot trash mobs in balance stance, stack HP, HP-regen optional.
  — "you may just lose battle and free respawn"
  · [Can someone explain how Attack and Defense, and Fire Attack and Fire Defense work?](https://web.archive.org/web/20151219190032/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/486679-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work?page=1)
- Standard grinding method: travel to a territory 3 levels above your own and repeatedly delve its dungeons.
  — "go to a Level+3 territory, and delve into the dungeons repeatedly."
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- Player-measured EXP required per character level (post-rebirth): L4=5150, L5=8350, L7=16350, L8=20900, L9=25900, L10=31400, L11=37400, L12=43500, L13=49850, L15=63900, L16=71900, L19=98300, L22=129300, L29=216100, L31=273100, L32=294100, L33=316100, L34=339300, L35=363300 (L1~550, L2~1450 uncertain).
  — "EXP per level / Orange EXP … 10) 31400 / 2000"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- A separate "Orange EXP" track (the author calls them SI — soul infusion — levels) has its own per-level requirements: L1=300, L2~500, L3=733, L4=1000, L5=1200, L7=1500, L8=1600, L9=1800, L10-11=2000, L15=2600, L16=2800, L22=3900, L28=5600, L31=7000, L36=9100, L42-43=12000.
  — "Added some more data to the exp levels and SI levels."
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- Maximum EXP per enemy group grows slowly with level — measured: L31~1312, L32=1333, L33=1364, L34~1371, L35=1444, L36~1486, L37=1526, L39~1575, L40~1609, L42~1674, L43~1704 (values with ? are the recorder's own uncertainty).
  — "Max EXP per enemy group, per level. … 35) 1444"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- Efficient grind method: find a 3-wave bandit encounter on the open world and re-enter/exit it repeatedly; the encounter persists between entries.
  — "find a 3 wave bandit on the open world and enter/exit over and over"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20150911074846/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/493522-how-to-grind-for-levels-and-exp-the-easy-way?page=1)
- There is an achievement tied to killing Red Oni; players say it is the only real reason to fight one.
  — "Aside from the achievement, they are not worth it"
  · [New way to kill red oni](https://web.archive.org/web/20160104144830/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/501146-new-way-to-kill-red-oni?page=1)
- Player request implies a hard level cap below 85: reaching level 85 was only possible via exploit and reportedly got players banned.
  — "allow us to go to lvl.85 without getting banned"
  · [About the game](https://web.archive.org/web/20160423144746/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/601703-about-the-game)
- By May 2015, player levels reached at least 80; map zones have approximate level tiers, with one whole island rated around level 20.
  — "you are lvl 80 doing missions on the blue island (which is roughly lvl 20)"
  · [Aoi Hoiru clan](https://web.archive.org/web/20160908183841/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/497808-aoi-hoiru-clan?page=1)
- Player build advice (Captain_Catface): skip the defense stat because equipment supplies plenty and some damage types bypass defense entirely.
  — "I advise not putting stat points into defense. You will gain a large amount from equipment and there are damage forms which bypass it."
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Contradicting claim (Karyuudan): high defense beats high HP at endgame; only some skills ignore defense and those have cooldowns, so raw slashes dominate.
  — "at end game when you fight skilled people that lack of defense will make you suffer"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- The attack stat is hard-capped at 10 + character level; suggested build fills attack to cap then dumps remaining points into health and speed.
  — "Put points into attack until you hit its cap (10+level)"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150910134819/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/514786-red-oni-is-to-powerful?page=1)
- Refinement of the gear-gap claim: post-rebirth PvP dominance comes from gear AND stance mastery (implying stance mastery persists as a separate progression track).
  — "Gear and stance mastery"
  · [More features for choosing duels](https://web.archive.org/web/20160908181506/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/532779-more-features-for-choosing-duels)
- Clan joining unlocks at level 10 — a deleted/remade character can join a (different) clan upon reaching level 10.
  — "Delete your character and remake it then upon reaching level 10 joining a different one"
  · [Ways to leave a clan](https://web.archive.org/web/20150907200432/http://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan?page=1)
- Clan joining unlocks at level 10 — a fresh character must reach level 10 before joining a clan (player claim via the delete-and-remake method).
  — "Delete your character and remake it then upon reaching level 10 joining a different one"
  · [Ways to leave a clan](https://web.archive.org/web/20160405075911/https://www.kongregate.com/forums/4645-straw-hat-samurai-duels/topics/502202-ways-to-leave-a-clan)
- Captain_Catface's build advice: skip the defense stat because equipment grants large defense amounts and some damage forms bypass defense entirely.
  — "You will gain a large amount from equipment and there are damage forms which bypass it"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- Contradicting claim (Karyuudan): high defense beats high HP at endgame — only some skills ignore defense and those are cooldown-gated, so raw slashing is checked by defense.
  — "at end game when you fight skilled people that lack of defense will make you suffer"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- The attack stat has a point cap of 10 + character level; Catface's build: cap attack, then dump remaining points into health and speed.
  — "Put points into attack until you hit its cap (10+level), then dump the rest of your points into health and speed"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- The SPEED stat increases slash line length and reduces skill cooldowns (player claim).
  — "Speed increases line length and drops skill cooldown"
  · [Kong Players: Basics and World Battle](https://web.archive.org/web/20150406020440/http://www.kongregate.com:80/forums/4645-straw-hat-samurai-duels/topics/484700-kong-players-basics-and-world-battle)
- After rebirth, any skill can be leveled to its maximum at any samurai level (datata claim).
  — "You can level up any skill to its maximum at any samurai level after rebirth"
  · [[Straw Hat Samurai: Duels] Questions](https://web.archive.org/web/20170427091012/http://www.kongregate.com:80/forums/12-kongregate-multiplayer-games/topics/494653-straw-hat-samurai-duels-questions)
- A dedicated player was approaching level 80 on his 19th day of play — a datum for the leveling/XP pacing curve (lissachanmanga, secondhand claim).
  — "this friend also is approaching lvl 80 and its his 19th day playing"
  · [State of the Clan War](https://web.archive.org/web/20200719120117/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486220-straw-hat-samurai-duels-state-of-the-clan-war)
- HP, Chi, and AP are directly allocatable stat rows on the character panel (one click = one point), and accidental spends were not refundable in-game.
  — "I want a rollback of that 1 stat point accidentally spent on Chi stat."
  · [[Straw Hat Samurai: Duels] This game needs "Confirm" button when adding stat points.](https://web.archive.org/web/20200719024749/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486485-straw-hat-samurai-duels-this-game-needs-confirm-button-when-adding-stat-points)
- Endgame grind benchmark: by level 80 aim for ~200-250 defense, enough attack to one-shot trash mobs in balance stance, maximum HP, and optionally HP-regen gear.
  — "~200-250 def by lvl 80, enough attack to 1 shot trash mobs in balance stats"
  · [[Straw Hat Samurai: Duels] Can someone explain how Attack and Defense, and Fire Attack and Fire Defense work?](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)
- Losing a battle grants a free respawn, which grinders exploited as a cost-free reset loop (viable if you don't care about quest outcomes).
  — "you may just lose battle and free respawn"
  · [[Straw Hat Samurai: Duels] Can someone explain how Attack and Defense, and Fire Attack and Fire Defense work?](https://web.archive.org/web/20200719191051/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486679-straw-hat-samurai-duels-can-someone-explain-how-attack-and-defense-and-fire-attack-and-fire-defense-work)
- The intended counter to the Statue Guardian wall is overleveling: the stuck-at-~28 player beat him after grinding into the level 30s and upgrading gear.
  — "Just had to go level up to the 30's, get some better gear, and come back to face him"
  · [How do you beat the Statue Guardian?](https://web.archive.org/web/20200719095529/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487269-straw-hat-samurai-duels-how-do-you-beat-the-statue-guardian)
- Concrete stat snapshot of the ~lvl-28 difficulty wall: with equipment included, a player had 204 HP / 80 STR / 109 DEF / 32 SPD, yet bounty-hunt targets in level 24-25 areas destroyed him with special moves while normal mobs there were easy.
  — "204hp, 80str, 109def, 32spd … the bounty person just annihilates me using all kinds of special moves"
  · [Difficulty curve around lvl 28. Anyone else think so?](https://web.archive.org/web/20200719085726/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487402-straw-hat-samurai-duels-difficulty-curve-around-lvl-28-anyone-else-think-so)
- A player stuck on the Statue Guardian at ~lvl 28 beat him after leveling into the 30s and upgrading gear — the fight is level/gear gated in practice.
  — "go level up to the 30's, get some better gear, and come back"
  · [How do you beat the Statue Guardian?](https://web.archive.org/web/20200718231825/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/486915-straw-hat-samurai-duels-to-autoslash-or-not-to-autoslash)
- Reference stat snapshot at ~lvl 28 with equipment: 204 HP, 80 STR, 109 DEF, 32 SPD — the game's four visible stats being HP/STR/DEF/SPD — and this build still loses badly to bounty targets.
  — "My stats (equipment included) are 204hp, 80str, 109def, 32spd"
  · [Difficulty curve around lvl 28. Anyone else think so?](https://web.archive.org/web/20200719145607/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487109-straw-hat-samurai-duels-game-crash-bug)
- A difficulty spike hits around lvl 28 where sidequests and the main story feel impossible; the intended fix is equipment farming, which resolves it.
  — "it's feeling like it's getting impossible, now"
  · [Difficulty curve around lvl 28. Anyone else think so?](https://web.archive.org/web/20200719145607/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/487109-straw-hat-samurai-duels-game-crash-bug)
- Player claim: enemies near the final-boss checkpoint awarded zero XP, so grinding while stuck there was impossible.
  — "I don't get any exp from the enemies, so grinding here is no help"
  · [[Straw Hat Samurai: Duels] (fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20200719005252/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488106-straw-hat-samurai-duels-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon)
- Difficulty datapoint: a level 38 character could reach the final boss but found the survival encounter unbeatable, blaming unbalanced stats/gear — suggests the finale was tuned above a straight story-pace level 38.
  — "I'm level 38, but I guess either my stats are too unbalanced"
  · [[Straw Hat Samurai: Duels] (fixed) Stuck at final boss with no ability to leave dungeon!](https://web.archive.org/web/20200719005252/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488106-straw-hat-samurai-duels-fixed-stuck-at-final-boss-with-no-ability-to-leave-dungeon)
- Guide claim: skip the defense stat because equipment grants large defense amounts and some damage types bypass defense entirely.
  — "not putting stat points into defense. You will gain a large amount from equipment and there are damage forms which bypass it"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Contradicting claim: high defense beats high HP because only some skills ignore defense and those are cooldown-limited; lacking defense hurts at endgame.
  — "A character with high defense is better than high HP"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- The attack stat has a hard cap of 10 + character level; a suggested build maxes attack to that cap then dumps remaining points into health and speed.
  — "Put points into attack until you hit its cap (10+level), then dump the rest of your points into health and speed"
  · [[Straw Hat Samurai: Duels] Kong Players: Basics and World Battle](https://web.archive.org/web/20200718233631/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/484700-straw-hat-samurai-duels-kong-players-basics-and-world-battle)
- Level-ups grant stat points the player allocates by choice — chat advice threads existed on 'which stat should you waste your points in'.
  — "game related facts about which stat should you waste your points in"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us. (page 2)](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=2)
- Switching clans apparently required deleting your character and starting over — players were advised it's worth restarting to change clan; veterans donate old equipment in clan chat, and 'say hi after you turn level 10' implies clan features unlock around level 10.
  — "Don’t be afraid to delete your char and start over!... say hi after you turn level 10"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us. (page 3)](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us?page=3)
- A player at level 45 reports having accumulated over 100 total attribute points across attack, defense and speed.
  — "now i am lvl 45 i had more than 100 attributes in atk def n spd"
  · [Show off a picture of your awesome character here](https://web.archive.org/web/20200719000124/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488448-straw-hat-samurai-duels-show-off-a-picture-of-your-awesome-character-here)
- Item/character level range treated as 1-80 in April 2015, implying a level cap around 80 at that time.
  — "1-80 Level Range"
  · [Suggestion: Auction Market system](https://web.archive.org/web/20200719000146/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488497-straw-hat-samurai-duels-suggestion-auction-market-system)
- Leveling pace is reported as very slow (May 2015).
  — "Leveling takes so long…."
  · [Rebirthing = 25 FREE Gold, let's talk about best Rebirth elements and what to do with that gold.](https://web.archive.org/web/20200719120055/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/488687-straw-hat-samurai-duels-rebirthing-25-free-gold-lets-talk-about-best-rebirth-elements-and-what-to-do-with-that-gold)
- Build advice: never put attribute points into AP at all; any Chi you need is easily supplied by equipment stats instead.
  — "You shouldn't put points into AP at all"
  · [Best build?](https://web.archive.org/web/20200719124157/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489218-straw-hat-samurai-duels-best-build)
- Recommended grinding strategy: go to a territory 3 levels above your own and run its dungeons repeatedly — territories have levels and dungeons are freely repeatable.
  — "go to a Level+3 territory, and delve into the dungeons repeatedly"
  · [[Straw Hat Samurai: Duels] How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Player-measured EXP required per level (tracked just after rebirth): L4=5150, L5=8350, L7=16350, L8=20900, L9=25900, L10=31400, L11=37400, L12=43500, L13=49850, L15=63900, L16=71900, L19=98300, L22=129300, L29=216100, L31=273100, L32=294100, L33=316100, L34=339300, L35=363300, L36=366697; L1~550 and L2~1450 marked uncertain; the L43=61300 row looks like a recording typo.
  — "EXP per level / Orange EXP ... 10) 31400 / 2000 ... 35) 363300 / 8600"
  · [[Straw Hat Samurai: Duels] How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Maximum EXP obtainable per enemy group appears capped by player level, rising roughly 30-40 per level in the 30s-40s: L32=1333, L33=1364, L35=1444, L37=1526 (uncertain entries: L31=1312?, L34=1371?, L36=1486?, L39=1575?, L40=1609?, L42=1674?, L43=1704?).
  — "Max EXP per enemy group, per level."
  · [[Straw Hat Samurai: Duels] How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Each stance has its own mastery level built by using it; standard advice is to specialize in one stance. A level-18 player had only mastery level 2 (light stance), which veterans blamed for his duel losses.
  — "My highest mastery is level two. On light stance. But then again… I’m just lvl 18."
  · [[Straw Hat Samurai: Duels] I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- Deleting and remaking your character is the accepted way to re-spec stat allocation; veterans recommend experimental remakes to learn stat balance.
  — "Remake your character and put all your points in HP/Defense."
  · [[Straw Hat Samurai: Duels] I don't get the dueling part...](https://web.archive.org/web/20200718232808/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/489310-straw-hat-samurai-duels-i-dont-get-the-dueling-part)
- Leveling advice: grind at the highest-level territory equal to your level+3, in the forest — implying map territories carry level designations and enemies up to your level+3 are efficient XP.
  — "just level up at the highest territory (your level+3) in the forest"
  · [[Straw Hat Samurai: Duels] The clan to join is Aka Ryu Red clan. Armor Games is joining blue and hunting us.](https://web.archive.org/web/20200719210305/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/490224-straw-hat-samurai-duels-the-clan-to-join-is-aka-ryu-red-clan-armor-games-is-joining-blue-and-hunting-us)
- Player claim extending the gear-only view: the power difference between players is gear AND stance mastery, implying stance mastery is a persistent power source across rebirths.
  — "Gear and stance mastery"
  · [[Straw Hat Samurai: Duels] More features for choosing duels](https://web.archive.org/web/20200719034404/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/532779-straw-hat-samurai-duels-more-features-for-choosing-duels)
- DEV: the game saves automatically (server-side autosave, no manual save point), but saving can silently fail when the server is down, causing progress rollback.
  — "The game should save automatically for you. However sometimes when the server down, saving may fail."
  · [[Straw Hat Samurai: Duels] Is there a save point?](https://web.archive.org/web/20200719000600/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/543984-straw-hat-samurai-duels-is-there-a-save-point)
- Pacing datapoint: a brand-new player reached level 8 in their first play session (Sep 2015); a save-rollback bug then reset them to level 1 despite the menu still showing the level-8 character.
  — "i was level 8 when i finished"
  · [[Straw Hat Samurai: Duels] Is there a save point?](https://web.archive.org/web/20200719000600/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/543984-straw-hat-samurai-duels-is-there-a-save-point)
- Multiple players report the leveling curve is very grind-heavy: one played 5 hours daily for a week and still felt low-level; another described leveling 'painfully slowly' when playtime dropped.
  — "i played for 5 hours every day but i still noob and lvl up very slow"
  · [[Straw Hat Samurai: Duels] How much time you spent playing this game?](https://web.archive.org/web/20200719152626/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/525884-straw-hat-samurai-duels-how-much-time-you-spent-playing-this-game)
- Clan joining is gated at level 10 — a deleted-and-remade character can join a (different) clan upon reaching level 10.
  — "Delete your character and remake it then upon reaching level 10 joining a different one"
  · [[Straw Hat Samurai: Duels] Ways to leave a clan](https://web.archive.org/web/20200719112706/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/502202-straw-hat-samurai-duels-ways-to-leave-a-clan)
- Reported Amaya clear levels span ~30 (skill-only, no grinding) through 35, 36, and 49 — evidence of a sharp perceived difficulty spike at this boss.
  — "already beat her when i reached lvl 49"
  · [[Straw Hat Samurai: Duels] How does one beat Amaya?](https://web.archive.org/web/20200719014049/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/503551-straw-hat-samurai-duels-how-does-one-beat-amaya)
- Player levels reached at least 80 (a level-80 player is used as the example), and world areas carried rough level bands — the 'blue island' was pegged at approximately level 20 content.
  — "you are lvl 80 doing missions on the blue island (which is roughly lvl 20)"
  · [[Straw Hat Samurai: Duels] Aoi Hoiru clan](https://web.archive.org/web/20200719021017/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/497808-straw-hat-samurai-duels-aoi-hoiru-clan)
- Level 80 is referenced as a milestone a player was grinding toward ('7 more levels to 80'), corroborating the level-80 figure from the Aoi Hoiru thread as a cap or major goal.
  — "7 more levels to 80……"
  · [[Straw Hat Samurai: Duels] KI SENSU - The Golden Fan (Recruitment Thread)](https://web.archive.org/web/20200719143214/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/498595-straw-hat-samurai-duels-ki-sensu-the-golden-fan-recruitment-thread?page=2)
- Level 80 is treated as the level cap; a player jumping from level 25 to 80 in 2 days (Dec 2015) was reported as a suspected hacker.
  — "xX800killers was level 25 and in 2 days he become level 80!"
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Player claim (contradicted by others): two full days of grinding gets you only to about level 60, so 25-to-80 in 2 days must be a bug or hack.
  — "If grinding 2 days he/she reach level 60."
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Player claim: when actively grinding, a level-up roughly every half hour was achievable, making 25-to-80 in 2 days legitimate.
  — "I can level up every half hour if I grind"
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Casual-pace data point: one player reported gaining only about one level every 2 days.
  — "In true, i level up each 2 days."
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- "Raccoons" were an XP-accelerating item/booster: with raccoons plus nonstop play, 1-to-80 in 2 days was considered easy by veterans.
  — "2 days no sleep +racoons, easy 80 levels."
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Even without raccoons, one player reported leveling 1-to-80 in 5 days at a casual pace, suggesting a fast XP curve at least post-launch.
  — "for 5 days i lv upt from lv 1 to lv 80 with no raccons"
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- First-time 1-to-80 for new players typically took 3 days to 1 week; roughly 1 day was the fastest normally seen, and that required raccoons.
  — "most people who are just starting can get to 80 in 3 days to 1 week"
  · [[Straw Hat Samurai: Duels] Hacker!](https://web.archive.org/web/20200719194201/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/576207-straw-hat-samurai-duels-hacker)
- Going past the level-80 cap (e.g., reaching level 85, presumably via exploit) resulted in bans; a player jokingly asked for legal level 85 (Feb 2016).
  — "to allow us to go to lvl.85 without getting banned"
  · [[Straw Hat Samurai: Duels] About the game](https://web.archive.org/web/20200719053245/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/601703-straw-hat-samurai-duels-about-the-game)
- Measured XP-to-next-level curve (recorded immediately after a rebirth): L1≈550, L2≈1450, L4=5150, L5=8350, L7=16350, L10=31400, L15=63900, L22=129300, L29=216100, L31=273100, L35=363300, L36≈366697 (last value likely a typo in source).
  — "EXP per level / Orange EXP"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- A parallel 'Orange EXP' / SI (Soul Infusion) level track has its own per-level requirements: 300 at L1, 1000 at L4, 2000 at L10, 3900 at L22, 7000 at L31, 9100 at L36, 12000 at L42-43.
  — "Added some more data to the exp levels and SI levels"
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Maximum EXP earnable per enemy group scales with player level (measured: ~1312 at L31, 1444 at L35, 1526 at L37, ~1704 at L43) — i.e. XP per encounter is capped by your level.
  — "Max EXP per enemy group, per level."
  · [How to grind for Levels and EXP, the easy way.](https://web.archive.org/web/20200719193759/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493522-straw-hat-samurai-duels-how-to-grind-for-levels-and-exp-the-easy-way)
- Level 80 is the observed top level: player-proposed PvP brackets stop at 71-80, and level 80 players are cited as the apex in multiple threads.
  — "a room exclusive for level 1-10 11-20 21-30 31-40 41-50 51-60 61-70 71-80"
  · [Make pvp room fair](https://web.archive.org/web/20200719193940/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/493858-straw-hat-samurai-duels-make-pvp-room-fair)
- Red-zone territories give no EXP: if a territory's level is 3 levels higher than your current level, fights there award no experience.
  — "If the territory is 3 levels higher than your current level they don’t give exp."
  · [[Q&A] Straw Hat Samurai Duels](https://web.archive.org/web/20200719092208/https://www.kongregate.com/forums/12-kongregate-multiplayer-games/topics/608988-straw-hat-samurai-duels-q-a-straw-hat-samurai-duels)
