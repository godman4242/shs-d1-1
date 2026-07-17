<!--
ADOPTION NOTE (2026-07-17, Session 8B) — read before trusting a value here.

Origin: compiled 2026-07-17 OUTSIDE this repo by a parallel Claude session
("Clawdia", 10 research subagents) from (a) this repo's own ledgers, config
and video-study docs — including the then-uncommitted working tree — and
(b) wiki/portal mining (Fandom via Wayback, IndieDB, Kongregate, Snokido,
Miniplay, SilverGames). Adopted from ~/Downloads on Kheshav's request.

Precedence: this is a navigable DIGEST, not a ledger. On any conflict the
canonical sources win, in this order:
  1. config pins + tests/config-values.test.ts (what the game actually runs)
  2. docs/research/fidelity/MOTION_MEASUREMENTS.md + FIDELITY_GATE.md
  3. docs/DIVERGENCES.md (decisions + corrections)
  4. docs/research/video-study/SYNTHESIS.md + original-game-facts.md
  5. this document

Grade-inflation caution: some [CONTRACT]/[MEASURED] tags below mirror OUR
recreation's config rather than the original game (e.g. §5.1 idle joint
tables ARE config/poses.ts; §3.12 blink cadence is our implementation;
§9 documents our own art code). §10 audio is explicitly INFERRED design
guidance — the original's audio was never captured. Genuinely useful and
externally sourced: §1 progression/wiki facts, §3.1 stance mastery trees,
§4.1 enemy taxonomy, §11 gaps/contradictions.

RECREATE-NEVER-RIP: this file contains facts, numbers and original
descriptions only — no extracted assets, no transcribed dialogue.
-->

# Straw Hat Samurai: Duels — Master Reference Document

> **Purpose:** Single-source-of-truth reference for the 1:1 recreation project. Every known aspect of the original game, compiled from Fandom wiki (Wayback Machine archive), IndieDB/Kongregate/Snokido/Miniplay/SilverGames listings, the 61-segment video study (`docs/research/video-study/SYNTHESIS.md`), frame-by-frame pixel analysis of two 1080p60 longplay videos (2,675 reference frames), the existing recreation codebase (`src/config/` + `src/core/`), and lossless wiki PNG analysis.
>
> **Evidence grading:** Every value is tagged **[CONTRACT]** (verified from the original game's wiki, patch notes, or unambiguous video evidence), **[MEASURED]** (frame-counted from longplay video), or **[INFERRED]** (tuned seed matching observed feel, adjustable).
>
> **Generated:** 2026-07-17 by Clawdia, synthesizing 10 parallel research subagents.

---

## Table of Contents

1. [Game Structure & Progression](#1-game-structure--progression)
2. [Screen Flow & Menus](#2-screen-flow--menus)
3. [Combat Mechanics](#3-combat-mechanics)
4. [Enemy AI Behaviour](#4-enemy-ai-behaviour)
5. [Animation States](#5-animation-states)
6. [Movement Physics](#6-movement-physics)
7. [Fighter Proportions & Combat Idle](#7-fighter-proportions--combat-idle)
8. [UI/UX Complete Inventory](#8-uiux-complete-inventory)
9. [Procedural Art & Visual Style Guide](#9-procedural-art--visual-style-guide)
10. [Audio & SFX Design](#10-audio--sfx-design)
11. [Gaps, Unknowns & Self-Critique](#11-gaps-unknowns--self-critique)

---

## 1. Game Structure & Progression

*Straw Hat Samurai: Duels* is a side-scrolling samurai MMORPG developed by Explosive Barrel (LutGames), released 2015 as a browser-based Flash game. It combined single-player RPG progression with real-time PvP duels, clan warfare, and an evolving persistent world. The game died with Flash in January 2021.

### 1.1 Game Modes

| Mode | Description | Source |
|---|---|---|
| **Story / Campaign (Solo)** | Epic story with mystery, intrigue, and action. Player starts as a ragged Shugyosha (wandering apprentice) in torn garments wielding a tree branch, growing into a samurai. Organized into **Seasons**, each with a **Prologue** (tutorial) and multiple **Episodes**. 3-line haiku title cards between episodes. | IndieDB, Snokido, original-game-facts.md |
| **Duel Mode (PvP)** | Real-time player-vs-player sword duels. Players draw slashing lines with mouse/finger. VS splash → FIGHT! intro. Tournaments with general classification/leaderboard. | IndieDB, Snokido, Miniplay |
| **Duel Mode (PvE)** | PvE encounters against AI-controlled enemies (bandits, ronin, undead, oni). Trash fights resolve in 3–10s; boss/PvP duels run 20–60s. Three AI tiers (Easy/Normal/Hard). | original-game-facts.md, ai.ts |
| **Survival / Endless** | "Try to survive as long as possible" against numerous attackers. Side-scrolling wave defense. | SilverGames, Miniplay |
| **War Room (Clan Warfare)** | Strategic territory-control. Command troops, fight rival clans on a territory map. Unlocked at **Level 10**. Rival-clan strategic AI. | IndieDB, Freelancer, economy.ts |
| **Tournaments** | Regular competitive events for honor, glory, and riches. General classification leaderboard. | Snokido, IndieDB |

### 1.2 Campaign Structure

- **Season → Episode nesting**: Seasons contain a Prologue (tutorial) and multiple Episodes.
- **Prologue = Tutorial**: Tutorial master Hiroshi (Old Guard warrior/blacksmith) teaches slash, jump, and stance mechanics through dialogue and a gated first duel.
- **Haiku episode cards**: 3-line haiku title cards (brush-style calligraphy) between episodes.
- **Story**: Aka-Ryu clan invasion through a forested mountain pass; player must find a route through and stop the invasion.
- **Named NPCs**: Hiroshi (tutorial master), Masahiro (Shogun whose assassination drives Season 1), Daichi, Takeru, Ito (dojo master/instructor), Takahasi (mining camp tutor).

### 1.3 Duel Arena

- Fixed **1024×576** letterboxed stage (16:9), derived from original 1920×1080 ÷ 1.875.
- Player spawns left-of-center (x:260, y:430), enemy spawns right (x:700, y:430).
- Fighter hitboxes: ~52×120 px capsules.
- Multi-layer parallax background: sky, mountains, mid-ground silhouettes, foreground forest band.
- Overworld HUD chrome (coins, XP, minimap) is **hidden during fights**; rewards appear on the result card.

### 1.4 XP Curve

Cumulative caps to finish each level (HUD renders totalXp/cap). Frame-backed readings:

| Level | Cumulative XP Cap | Delta from Previous |
|---|---|---|
| 1 | 550 | — |
| 2 | 1,450 | 900 |
| 3 | 2,950 | 1,500 |
| 4 | 5,150 | 2,200 |
| 5 | 8,350 | 3,200 |
| 6 | 12,150 | 3,800 |
| 7 | 16,350 | 4,200 |
| 8 | 20,900 | 4,550 |
| 9 | 25,900 | 5,000 |
| 10 | 31,400 | 5,500 |
| 11+ | Extrapolated | +500 per level (delta step grows by 500 each level) |

Growth ratio decays smoothly toward ~1.2. **[CONTRACT]**

### 1.5 Level-Up Rewards

Each level-up grants:
- **+1 Skill Point (SP)** [CONTRACT]
- **+3 Stat Points** [CONTRACT]
- **Full HP / Chi / AP refill** [CONTRACT]

### 1.6 Level Cap & Skill Points

- **Level cap**: 80 (first run) [CONTRACT]
- **First-run SP cap**: 80 SP (1 SP per level × 79 level-ups = 79 SP reachable; cap 80 is safety net)
- SP cap lifts once `danRank > 0` (after first rebirth)

### 1.7 Dan Ranks (Rebirth Tiers)

- **10 dan ranks** (Shodan → Jūdan, the 10th being marked final) [CONTRACT] — spec's "5" was research-corrected; the spec's own `tenthGold` payout corroborates.
- Rebirth resets player to Level 1 with refreshed pools.

### 1.8 Rebirth

- **Trigger**: Rebirth Scroll, costing **1,000 coins**, gated at **Level 80** [CONTRACT]

| Rebirth # | Gold Reward | Elemental Points |
|---|---|---|
| 1–9 | 25 gold each | +10 chosen-elemental skill points (stacking) |
| 10th (Jūdan, final) | 100 gold | +10 chosen-elemental skill points |

- **Elemental system**: Fire / Water / Earth / Wind. Player chooses an element at each rebirth; +10 points stack if same element re-picked. [CONTRACT]
- The spec's "+10 Attack per rebirth" was research-corrected to **+10 elemental skill points** (video A-17 Rebirth Scroll text). [CONTRACT]

### 1.9 Economy

| Currency | How Earned | Use |
|---|---|---|
| **Coins** | Per kill (+8/foe level [CONTRACT]), quest rewards | Shop, Rebirth Scroll (1,000 coins), travel, building donations |
| **Gold** | Rebirth payouts (25/100), cosmetic/premium items | Cosmetic purchases, premium items |
| **Cash (original only)** | Real money purchase ("Ninja Services") | Sold gold for cash — recreation has `HAS_CASH_PURCHASE = false` |

- **Guest start**: 100 coins + 3 gold (A-00) [CONTRACT]
- **Building donation cap**: 500 coins per turn (War Room)
- **Kill rewards**: XP +10/foe level [INFERRED — no flat formula confirmed across 20+ video samples]; coins +8/foe level [CONTRACT]
- **Named enemies**: ~4.6× premium XP vs generic at same level (Jinbei: 304 vs 66 XP) [CONTRACT]
- **Defeat**: Pays 0 XP / 0 coins [CONTRACT]

### 1.10 Clans

**Four joinable Great Clans** [CONTRACT — spec's "three" was research-corrected]:

| Clan | Meaning | Heraldry | Role |
|---|---|---|---|
| **Aka Ryu** | Red Dragon | Yellow dragon on red field | Invaders (story) |
| **Midori Ken** | Green Sword | Encircled yellow fist on green field | Defenders (story) |
| **Aoi Hoiru** | (Blue) | — | Joinable |
| **Ki Sensu** | (Yellow) | — | Joinable |

**Shira Tancho** (White Crane) exists as a story-only neutral faction, not joinable.

### 1.11 War Room (Clan Strategy)

Unlocked at **Level 10** [CONTRACT]:

| Parameter | Value |
|---|---|
| Kill cap (troops) | 350 (= 340 troops + 10 samurai) |
| Build donation cap | 500 coins/turn |
| Deploy: field→mountain | +60 troops |
| Deploy: mountain→mountain | +100 troops |
| Deploy: field→forest | +75 troops |
| Control-point flag bonus | ×1.20 (120% troop-deploy boost) |

Rival-clan AI: Greedy strategy — reinforce weakest border, attack adjacent weaker enemy, build when Captain+ and flush.

### 1.12 Equipment System

- **9-slot paperdoll** (character equipment layout) [CONTRACT]
- **Rarity tiers**: Grey (common) → Green (uncommon) → Blue (rare) → Purple (epic) [CONTRACT]
- **Comparison UX**: "(EQ: n)" shows stat delta vs currently equipped (green=better, red=worse) [CONTRACT]
- **Weight stat**: Affects weapon class and Critical bar drain [CONTRACT]

### 1.13 Profile Pools (Overworld)

| Pool | Start Max | Notes |
|---|---|---|
| HP | 10 | Overworld/UI state (separate from in-duel 100 HP) |
| CHI | 10 | Menu-only display |
| AP | 30 | Menu-only (not shown in overworld HUD) |

*In-duel pools use prototype-scaled values (HP 100, CHI 100) — separate from the overworld profile pools.*

---
## 2. Screen Flow & Menus

### 2.1 Screen States Identified

Six distinct visual screen-states identified by clustering frame color signatures from 2,675 reference frames:

| Screen-State | Avg Brightness | Dominant RGB | Identification |
|---|---|---|---|
| **Gameplay (day)** | ~80–95 | (115, 114, 80) olive/amber | Side-scrolling combat |
| **Gameplay (night/interior)** | ~35–42 | (35, 15, 8) dark brown | Caves, dungeons, night |
| **Gameplay (forest/green)** | ~78–85 | (107, 136, 87) green | Outdoor forest areas |
| **Red flash / death** | ~35 | (150, 1, 0) dark red | Blood hit / defeat transition |
| **Black transition** | 0 | (0, 0, 0) pure black | Fade between scenes |
| **White flash / loading** | ~184–200 | (236, 238, 227) near-white | Loading / scene transition |

### 2.2 Loading Screen (Flash Preloader)

- Full-screen near-white background (RGB ~236/238/227) [MEASURED]
- Center-region brightness peaks at ~230 — likely progress bar or loading text
- Duration: ~7 seconds (14 frames at ~2fps sampling) [MEASURED]
- Transition: Red death flash → instant cut to white → 7s hold → 1.5s fade to dark

### 2.3 Title Screen

- **Not directly captured** in walkthrough videos (begin mid-gameplay)
- **Inferred** from IndieDB promo screenshot and Flash game conventions:
  - Dark parchment/scroll texture, samurai silhouette
  - "Straw Hat Samurai: Duels" in stylized brush-calligraphy font
  - "Play" / "Enter" button (large, centered or lower-third)
  - "Login" / "Register" (MMO requirement)
  - Version info in bottom corner

### 2.4 Main Menu / Hub Screen

- **World map** occupies the full screen (512×288 native, half gameplay resolution) [MEASURED]
- **Location nodes** as icons/markers on the map
- **Player character indicator** showing current position
- **Menu buttons**: Quest, Shop, Duel, Tournament, War Room, Profile [INFERRED from game features]
- **Quest markers** at various map locations

### 2.5 Shop / Upgrade Screen

- **Inferred** from game features (IndieDB, Snokido) and Flash RPG conventions:
  - Tabbed interface: Weapons | Armor | Accessories | Consumables
  - Item grid with rarity borders (grey/green/blue/purple)
  - Item detail panel with stats (attack, defense, special effects)
  - Equipment slots on character silhouette
  - Currency display (gold/coins counter)
  - Buy/Upgrade/Equip/Sell buttons

### 2.6 Duel Intro (VS → FIGHT!)

**MEASURED** from Video B t=3771.2–3773.85 @60fps. Two-beat sequence (corrected from spec's four-step — the original has NO separate name banner and NO READY step):

| Beat | Duration | Description |
|---|---|---|
| VS | ~2000ms | Full-width black band (rows 239–311 stage / 448–584 @1080) over the LIVE arena + HUD. Face portraits and names inside the band. Giant red brush "VS" glyph (bbox (754,392)–(1118,640) @1080, core #ff1800). |
| FIGHT! | ~450ms | Same band, orange gradient "FIGHT!" glyph (bbox (824,492)–(1090,572) @1080). |
| Tail | ~150ms | Band collapses, combat goes live. |
| **Total** | **~2600ms** | |

**Input:** Clicking fast-forwards one beat per click. Strokes drawn before FIGHT! are discarded by the Sim.

### 2.7 Duel Result — Win (YOU WIN)

- **Field**: Red `#990000` (RGB 153,0,0) — authored, byte-exact in lossless archive [CONTRACT]
- **Field inset**: x 53–1865 @1920 (fraction x 0.028–0.972); black pillars on left/right
- **Silhouette band**: Black `#000000`, top edge y ≈ 894 @1080 (fraction 0.828), with soft dark-red fade above
- **Headline**: Brush-stroke calligraphic "YOU WIN" centered in upper area
- **Buttons**: Not directly measured (defeat card has buttons)
- **Duration**: ~7s (14 frames) [MEASURED]
- **Transition**: Opponent HP=0 → red blood flash → brief black → white victory screen → fade to dark → map

### 2.8 Duel Result — Defeat (YOU WERE DEFEATED)

- **Field**: Red `#990000` — same authored color as win card [CONTRACT]
- **Silhouette band**: Black, top edge y ≈ 894–906 @1080 (12px jitter across builds)
- **Headline**: Brush-stroke splash text, bbox (560,204)–(1418,518) @1080, dark interior `#220300`–`#2c0300`
- **Button 1 (LEAVE AREA)**: Box x 814–1115, y 516–547 @1080; fill `#5c1200`
- **Button 2 (FREE RESPAWN)**: Box x 814–1115, y 608–638 @1080; fill `#5c1200` (resting), `#921700` (hovered)
- **Duration**: ~8s (16 frames sustained red hold) [MEASURED]
- **Transition**: Player HP=0 → red flash → sustained red defeat screen → fade to black → map

### 2.9 Black Transition / Loading Between Areas

- Pure black frames (brightness 0, RGB 0/0/0) [MEASURED]
- Duration: 0.5–1s (1–2 frames at 2fps) — brief load or longer for area transitions

### 2.10 Special Area / Portal Screen (Blue)

- Sky blue upper half (RGB ~134/169/247) with green/teal lower half (RGB 59/79/48) [MEASURED]
- Likely a special area — underwater cave, sky realm, or portal zone
- Duration: ~18.5s (37 frames) [MEASURED]

### 2.11 Death Screen Variants

Contextual death screens with different color themes depending on cause of death:

| Variant | Theme | Colors |
|---|---|---|
| Death01 | Teal/blue (water/ice) | `#0a1f21` bg, `#5a9cac`, `#189abc` |
| Death02 | Darker teal | `#0d2b39`, `#1f9dbb`, `#76a8b0` |
| Death03 | Purple (poison/curse) | `#8657a6`, `#7d468e`, `#3c274e` |

These are wiki screenshots of in-game death moments, distinct from the formal "YOU WERE DEFEATED" duel card.

### 2.12 Screen Flow Diagram

```
[Loading/Preloader]
       ↓
[Title Screen]
       ↓ (Click "Play")
[Login/Register] (MMO requirement)
       ↓
[Main Menu / Hub]
       ↓
    ┌──┴──┬──────┬──────────┬──────────┐
    ↓     ↓      ↓          ↓          ↓
[World Map] [Duel] [Tournament] [War Room] [Shop/Upgrade]
    ↓          ↓        ↓          ↓          ↓
    └──────────┴────────┴──────────┴──────────┘
                    ↓
            [Duel Intro / VS Screen] (red flash, ~2s)
                    ↓
            [Combat Gameplay]
               ↓        ↓
        ┌──────┴──────┐
        ↓              ↓
   [WIN Screen]    [DEFEAT Screen]
   (white, ~7s)    (red, ~8s)
        ↓              ↓
   [Rewards]       [Retry/Return]
        ↓              ↓
        └──────┬───────┘
               ↓
         [Return to Hub/Map]
```

### 2.13 Summary of All Screens

| # | Screen | Visual Signature | Duration |
|---|---|---|---|
| 1 | Loading/Preloader | White, brightness ~184–200 | ~7s |
| 2 | Title Screen | Dark brown/amber (inferred) | Not captured |
| 3 | Main Menu/Hub | Mixed map palette, 512×288 | Variable |
| 4 | Stage/Area Select | Green/amber/dark map views | Variable |
| 5 | Shop/Upgrade | Brown/amber UI (inferred) | Variable |
| 6 | Duel Intro | Red flash + VS band + FIGHT! | ~2.6s |
| 7 | Win Card | Near-white / red field | ~7s |
| 8 | Defeat Card | Sustained dark red | ~8s |
| 9 | Black Transition | Pure black | 0.5–1s |
| 10 | Special Area (Blue) | Sky blue top, green bottom | ~18.5s |
| 11 | Combat Gameplay | Olive/amber (day) or dark brown (night) | 10–30s segments |

---## 3. Combat Mechanics

### 3.1 Stance System

Three-stance rock-paper-scissors triangle. Stances control speed, power, and reach by holding the sword differently.

#### The Three Stances

| Property | Light (Blue) | Balanced (Brown) | Heavy (Red) |
|---|---|---|---|
| **Phys. DMG Mult** | ×0.9 | ×1.2 | ×1.4 |
| **Crit DMG Mult** (at mastery 9) | ×1.17 | ×1.56 | ×1.82 |
| **Defense Mult** | ×1.0 | ×1.0 | ×0.8 (−20% defense) |
| **Slash Reach** | ~300 units | ~200 units | ~120 units |
| **Slash Speed** | ×1.4 | ×1.0 | ×0.7 |
| **Damage Taken Mult** | ×1.0 | ×1.0 | ×1.25 |

**[CONTRACT]** — Damage formula from Fandom Stances page: `Physical DMG = (ATK + Weapon DMG) × stance multiplier`. `Critical DMG = 1.3 × Physical DMG (+ critical damage from items)`.

**Critical note:** Heavy's defensive penalty is a **defense stat ×0.8** cut, NOT a damage-taken bonus. The codebase has both `HEAVY_DEF_PENALTY = 0.2` and `damageTakenMult: 1.25` — **apply ONE, never both** (double-counting overshoots the original). [CONTRACT]

#### Stance Triangle (Counter System)

```
Light  >  Heavy   (light beats heavy)
Heavy  >  Balanced (heavy beats balanced)
Balanced > Light  (balanced beats light)
```

[CONTRACT] — Confirmed by both Fandom wiki and codebase (`STANCE_BEATS` in `stances.ts`). When attacker's stance beats defender's: **×1.25 counter bonus** [INFERRED].

#### Stance Switching Rules

| Context | Behavior | Source |
|---|---|---|
| **Out of combat** | Instant toggle, no cooldown, no cost (SPACE or portrait click) | [CONTRACT] |
| **In combat** | **Hard lock** — "CANNOT CHANGE STANCE" appears the instant a fight starts | [CONTRACT] |
| **Persistence** | Chosen stance persists across fights and zones | [CONTRACT] |
| **Focus-gated switching** (recreation only) | The codebase implements Focus-meter-gated mid-combat switching; video study shows the original hard-locks | [CONTRACT/CONTRADICTION] |

#### Stance Mastery & Per-Stance Skill Trees

Each stance has a 10-level mastery tree:

| Level | Light Stance | Balanced Stance | Heavy Stance |
|---|---|---|---|
| 1 | Starting level | — | — |
| 2 | — | Critical Evade | Critical Evade |
| 3 | **Launch** unlocked | **Flip-Up** (faster knockdown recovery) | **Heavy Stab** |
| 4 | **Deflect Arrow** | **Arrow Deflect** | Critical Evade |
| 5 | **Air Combo** (slash in mid-air) | **Launch** | **Launch** |
| 10 | Max: **Shunpo** (Ultimate Technique) | Max: **Thousand Stabs** | Max: **Deadly Cleave** |

[CONTRACT] — From Fandom wiki Stances page.

#### Mastery Scaling

| Stance | What Changes | Level 1 → Level 9 |
|---|---|---|
| **Light** | Damage modifier increases (range constant) | ×0.5 → ×0.9 |
| **Balanced** | Both damage AND slash length increase | ×1.0 → ×1.2 |
| **Heavy** | Damage flat at ×1.4; slash range increases | ×0.5 → ×0.9 |

[CONTRACT] — The codebase uses the mastery-9 values as its `STANCE_TABLE`.

### 3.2 Chi / Focus Economy

Three resource pools visible on HUD: HP (green), Chi (blue), Focus strip (white). Fourth pool, AP (pale gold), exists only in Player▸Stats menu.

#### Chi (Blue Bar)

| Property | Value | Source |
|---|---|---|
| **Max Chi** | 100 | [INFERRED] |
| **Base Chi (guest L1)** | 10 | [CONTRACT] — SYNTHESIS (A-00) |
| **Chi per stat point** | +5 max | [CONTRACT] — SYNTHESIS (A-06) |
| **Passive in-duel regen** | 4 points/sec | [INFERRED] |
| **Chi costs** | Chi Punch: 30, Smoke Bomb: 25, Stab: 10 | [INFERRED] |
| **Full bar regen time** | 25 seconds | [INFERRED] |

#### Focus (White Strip)

| Property | Value | Source |
|---|---|---|
| **Max Focus** | 100 | [INFERRED] |
| **Starting Focus** | 50 | [INFERRED] |
| **Stance switch cost** | 34 × weapon weight (light: 1.0, balanced: 1.5, heavy: 2.5) | [INFERRED] |
| **Passive fill rate** | 4/sec | [INFERRED] |
| **Role** | Gates mid-combat stance switching (recreation) and Critical Evade passive | [CONTRACT] |

#### Critical Meter

| Property | Value | Source |
|---|---|---|
| **Max Critical** | 100 | [INFERRED] |
| **Fill rate** | 8/sec | [INFERRED] |
| **Weapon weight drain** | Light: 1.0, Balanced: 1.5, Heavy: 2.5 per swing | [INFERRED] |

### 3.3 Damage Formula

[CONTRACT] — From Fandom wiki:

```
Damage = (ATK + Weapon DMG) × STANCE_TABLE[stance].dmgMult × (crit ? CRIT_MULT : 1) × counter
```

Where:
- `ATK + Weapon` = base attack + weapon damage (player seed: 10, enemy seed: 7)
- `dmgMult` = stance multiplier (Light 0.9, Balanced 1.2, Heavy 1.4)
- `CRIT_MULT` = 1.3 (critical hit) [CONTRACT]
- `counter` = 1.25 if attacker's stance beats defender's, else 1.0 [INFERRED]
- `DAMAGE_FLOOR` = 1 [CONTRACT]
- Heavy stance: defense × 0.8 (defense-side penalty, never stacked with damageTakenMult) [CONTRACT]

### 3.4 Key Damage Constants

| Constant | Value | Source |
|---|---|---|
| **Crit multiplier** | ×1.3 | [CONTRACT] — Fandom wiki (older 2014 tips page claimed 3×; changed across versions) |
| **Counter bonus** | ×1.25 | [INFERRED] |
| **Damage floor** | 1 | [CONTRACT] |
| **Heavy defense penalty** | defense ×0.8 | [CONTRACT] |

### 3.5 Skill Damage

| Skill | Level 1 | Level 2 | Source |
|---|---|---|---|
| **Chi Punch** | 10 dmg | 20 dmg | [CONTRACT] — SYNTHESIS (A-02 t=7:05) |
| **Throw Kunai** | 20 dmg | 40 dmg | [CONTRACT] — SYNTHESIS (B-21, B-07) |
| **Lay Trap** | 20 dmg | — | [CONTRACT] — SYNTHESIS (A-28) |
| **Focus skill** | — | — | No damage; reduces cooldown by 1s per level |

### 3.6 Base Fighter Stats (Recreation Seeds)

| Stat | Player | Enemy |
|---|---|---|
| HP | 100 | 150 (1.5× player) |
| ATK + Weapon | 10 | 7 |
| Defense | 5 | 5 |
| Default Stance | Balanced | Heavy |
| Deflect Learned | Yes | No |

[INFERRED] — From `combat-sim.ts`

### 3.7 Combo System

| Property | Value | Source |
|---|---|---|
| **Resets to** | 1 (not 0) per kill | [CONTRACT] |
| **Breaks on** | Taking damage, gaps in hit chain, fight handoff (mook→boss) | [CONTRACT] |
| **Chain gap timeout** | 3 seconds | [INFERRED] |
| **Observed peaks** | 5–11 hits | [CONTRACT] — B-11: 7, B-19: 9, B-13: 8, B-26: 11 |
| **Resets on fight transition** | Yes (11 → 1 when mook fight hands off to boss duel) | [CONTRACT] |

The combo counter appears to be a **score/display mechanic** — no frame-backed evidence of damage scaling per combo hit.

### 3.8 Hit Stun and Recovery

[MEASURED] — Frame-by-frame analysis of duel footage:

| Phase | Duration | Evidence |
|---|---|---|
| **Hit recoil** (snap into recoil) | 67 ms (4 frames @60fps) | `hitRecoilMs = 67` |
| **Hit return** (ease back home) | 133 ms (8 frames @60fps) | `hitReturnMs = 133` |
| **Total stagger** | 200 ms (12 frames) | 4 upright + 8 bent-forward |
| **Knockback distance** | ~55–70 px @1080 (≈30–37 stage px), all in first anim step | Visual only — sim doesn't apply positional knockback |
| **Full-screen hit tint** | Red tint ON for 16 frames on big counter hits | Mean R−G: 0.7 → 61.8 → 0.8 |

### 3.9 Death Animation

[MEASURED] — From one-hit kill footage:

| Phase | Duration | Description |
|---|---|---|
| **Tip-airborne → ground** | 12 frames (200 ms) | Body falls from standing to ground |
| **Fully settled** | 20 frames (333 ms) | Body settles on the ground |
| **Easing** | `easeInQuad(t)` = t² | Accelerating fall (gravity-like) |

Death pose: body knocked **backward**, rotating to horizontal, sword **detaches** and drops beside corpse.

### 3.10 Per-Stance Slash Phase Timing

[MEASURED] — Pixel-difference cadence analysis of duel-move frames, 360 frames @60fps:

| Stance | Windup | Active | Recovery | Total | Strike-to-Strike |
|---|---|---|---|---|---|
| **Light** | 4f (67ms) | 4f (67ms) | 4f (67ms) | 12f (200ms) | 12f |
| **Balanced** | 4f (67ms) | 4f (67ms) | 8f (133ms) | 16f (267ms) | 16f |
| **Heavy** | 4f (67ms) | 4f (67ms) | 12f (200ms) | 20f (333ms) | 20f |

> Windup (4f) and active (4f) are **constant across all stances**. Only **recovery varies**. [MEASURED]
>
> Player strokes strike **instantly** (no windup): `PLAYER_WINDUP_MS = 0`. The windup/active/recovery applies to animation feel and enemy AI timing. [INFERRED]

### 3.11 Projectile Constants (Kunai)

| Property | Value | Source |
|---|---|---|
| Speed | 0.55 px/ms (33 px/frame @60Hz) | [INFERRED] |
| Damage | 8 flat, defense-ignoring | [INFERRED] |
| Hit radius | 26 px | [INFERRED] |
| Max active | 8 | [INFERRED] |
| AI throw range | 240–720 px horizontal band | [INFERRED] |
| Does NOT crit | Always `false` | [INFERRED] |

### 3.12 Spawn Invulnerability

- **5 seconds** after entering PvP/war-room, OR until first slash [CONTRACT]
- Blinking indicator: alpha alternates 1.0 ↔ 0.25 every 100ms (wall clock) [CONTRACT]
- Player-only (enemies are NOT invulnerable on spawn) [CONTRACT]

### 3.13 Skill System

#### Hotbar Skills (3 slots)

| Slot | Skill | Chi Cost | Cooldown | L1 Dmg | Prereqs |
|---|---|---|---|---|---|
| 1 | **Chi Punch** | 30 (INFERRED) | 4.96s | 10 | None; 1 SP L1, 2 SP L2 |
| 2 | **Smoke Bomb** | 25 (INFERRED) | 7.96s | — | None; escape utility |
| 3 | **Stab** | 10 (INFERRED) | 0.92s | — | Heavy Stance L3 |

[CONTRACT] — Chi Punch cooldown is 4.96s (observed on-screen, A-02 t=7:05). All cooldowns follow a frame-quantized `.92/.96` ending pattern.

#### Additional Skills

| Skill | L1 | L2 | Chi | Cooldown | Notes |
|---|---|---|---|---|---|
| **Throw Kunai** | 20 dmg | 40 dmg | ? | 1.96s | Level 10 gate; 2 SP rank-up |
| **Focus** | — | — | 5 | 9.92s → 8.92s | −1.00s per level |
| **Dash L / Dash R** | — | — | 2 | 3.92s | Same stats, one skill + direction |
| **Lay Trap** | 20 dmg | — | ? | 4.92s | Level 15 + Throw Kunai prereq |

#### Skill Unlock Gates

- New **Ninja skills** unlock at levels ending in 0 (starting at level 10) [CONTRACT]
- **Chi skills** unlock at levels ending in 5 [CONTRACT]
- Skill-tree prerequisite chains exist (Lay Trap requires Throw Kunai) [CONTRACT]
- Learn L1 = 1 SP; rank-ups usually 2 SP [CONTRACT]

#### Passive Skills

| Skill | Stance | Effect |
|---|---|---|
| **Critical Evade** | Light/Balanced/Heavy L2 | "Evade attacks while slashing when your Focus Bar is full" |
| **Flip-Up** | Balanced L3 | Faster knockdown recovery |
| **Deflect Arrow** | Light L4, Balanced L4 | Deflect incoming arrows |
| **Air Combo** | Light L5 | Continue slashing in mid-air |
| **Launch** | Light L3, Balanced L5, Heavy L5 | Launch enemies into the sky for air combos |
| **Shunpo** | Light L10 (Ultimate) | Hold-key slow-mo |

### 3.14 Shunpo (Slow-Motion)

| Property | Value | Source |
|---|---|---|
| **Timescale** | 0.35 (35% speed) | [INFERRED] |
| **Max meter** | 100 | [INFERRED] |
| **Drain rate** | 34/sec | [INFERRED] |
| **Fill rate** | 12/s | [INFERRED] |
| **Min to start** | 10 | [INFERRED] |
| **Unlock** | Light Stance level 10 | [CONTRACT] |

### 3.15 Smoke Bomb

| Property | Value | Source |
|---|---|---|
| **Teleport distance** | 180 px | [INFERRED] |
| **Invulnerability frames** | 420 ms | [INFERRED] |
| **Cooldown** | 7.96s | [INFERRED] |
| **Chi cost** | 25 | [INFERRED] |
| **Use** | Escape/evade utility; dodges stabs | [CONTRACT] |

### 3.16 Deflect / Parry System

| Property | Value | Source |
|---|---|---|
| **Deflect window** | 260 ms | [INFERRED] |
| **Deflect radius** | 64 px | [INFERRED] |
| **Deflect Arrow skill** | Unlocked at Light L4 and Balanced L4 | [CONTRACT] |
| **Heavy Stab as parry** | Stab can parry kunais/arrows if Deflect skill learned | [CONTRACT] |
| **Smoke Bomb counter** | Other players can dodge your stab through Smoke Bomb | [CONTRACT] |

### 3.17 Gesture / Input System

| Gesture | Action | Source |
|---|---|---|
| **Horizontal line** | Slash across enemy | [CONTRACT] |
| **Upward line** | Jump into the air | [CONTRACT] |
| **Vertical upward (short flick < 90px)** | Launch enemy (requires Launch skill) | [CONTRACT/INFERRED] |
| **Vertical downward** | Stab ground (requires Heavy Stab skill) | [CONTRACT] |
| **SPACE bar / portrait click** | Change stance (out of combat) | [CONTRACT] |

AUTO SLASH toggle: persistent "AUTO SLASH OFF" plate in every combat frame. Auto-attack assist exists, default off. [CONTRACT]

### 3.18 Additional Mechanics

| Mechanic | Description | Source |
|---|---|---|
| **HP Regen** | Post-combat/passive HP regen ticks exist (12/30 → 14/30 shortly after a win) | [CONTRACT] |
| **Low-HP Visual** | Full-screen **red vignette** that intensifies as HP drops | [CONTRACT] |
| **Floating Damage Numbers** | Damage numbers float on hit; red under 150% buff, white otherwise | [CONTRACT] |
| **Duel Top-Up** | Duels (VS card fights) top up player HP to full pre-fight; trash fights don't | [INFERRED] |
| **Win Condition** | Enemy HP = 0 regardless of player HP — clutch win at 5/20 HP observed | [CONTRACT] |

### 3.19 Combat Pacing

| Encounter Type | Duration | Source |
|---|---|---|
| Trash mob (1 enemy, level parity) | 3–10 s | [CONTRACT] — Video: B-00 3–6s, B-13 5–10s |
| Trash mob pack (3–5 enemies) | 8–50 s | [CONTRACT] |
| Named rival (Jinbei, level 4) | ~10–15 s | [CONTRACT] |
| Mini-boss (Bandit Leader, level 6) | ~15–25 s | [CONTRACT] |
| Boss (Inokichi, level 8) | ~30–45 s | [CONTRACT] |
| Duel target (codebase tuning) | 20–60 s | [INFERRED] — explicitly "Boss/PvP-shaped" |

---## 4. Enemy AI Behaviour

### 4.1 Enemy Types

The original game classifies enemies into four major families. The recreation currently models a single 1v1 duel opponent (the "RONIN") with tier-parameterized AI; broader PvE taxonomy is documented as design/spec targets.

#### Human Enemies (Story / Overworld)

| Enemy | Wiki Description | Video Evidence | Code Status |
|---|---|---|---|
| **Swordsman 1** (generic Bandit) | "Slowly walks toward player, then stabs." Nameplate: `BANDIT (L)`. | Level 4–7; 3–5 enemy packs; 3–10s at level parity | Generalised as `ENEMY_BASE`; AI approach + strike |
| **Swordsman 2** | "Ready to strike when the player gets closer." More aggressive proximity trigger. | Jinbei (L4 named rival) shows this pattern | Same AI; `AI_APPROACH_RANGE = 620` governs aggro radius |
| **Archer** | "Fires arrows in an arch. Different ammunition types — sometimes white-edged arrows that knock the player down. Stabs with bow in melee." | Diagonal arrow-trail sprite; chip damage ~1 HP per arrow | `projectile.ts` models straight-line kunai (arrows arc in original) |
| **Spear** | "Walks slowly at first. Charges at player's direction when within stabbing range. May sometimes stab." | Spear-carrying enemy in conical straw hat seen flanking archers | Not yet distinct type; `AI_STRIKE_RANGE = 132` |
| **Shielder** | "Attacking Shield causes no damage versus this kind. Stabs with sword and charges with shield. **Weakness: Exposed lower limbs — aim for the legs.**" | Not directly observed | Block reaction partially models; leg-targeting not implemented |

#### Undead (Red Eyes, Green Skin)

| Enemy | Wiki Description | Code Status |
|---|---|---|
| **Walker** | "Slow, but has more health and defense. Just slashing them also causes damage to you most of the time." — implies thorns/counter-damage | Not yet modelled; needs damage-reflection flag |
| **Runner** | "Similar to Walker, but they run towards you." — higher speed + HP/DEF | Not yet modelled; single `ENEMY_SPEED` constant |
| **Jumper** | "Stands still until you get closer, then attacks by jumping over you while avoiding your slashes." | Not yet modelled; needs enemy jump state |

#### Oni (Demon-type)

| Enemy | Wiki Description | Code Status |
|---|---|---|
| **Blue Oni** | "Regular oni found in Oni Caves. Does low damage and throws rocks as their ranged attack." | Not yet modelled; rock-throw would parallel kunai |
| **Red Oni** | "Boss Oni. Not recommended without being high leveled. Wait for them to fall asleep before sneaking past." — sleep/aggro cycle, boss-tier HP | Not yet modelled; sleep state not in AiMode enum |

#### Named/Boss Enemies

| Boss | Level | Key Behaviour |
|---|---|---|
| **Jinbei** | 4 | Recurring rival; named duel with VS card; ~4.6× XP premium (304 vs 66 XP). HP topped to full pre-fight. 3-hit combos. |
| **Bandit Leader** | 6 | Dungeon mini-boss; kills player in ~4s from 6/20 HP; taunts on victory ("WEAK!"); HP bar may NOT reset between retries |
| **Inokichi** | 8 | Bounty target; club-wielding boss; fights alongside mob adds; ally NPC (Satoshi) joins; ~30–45s encounter; drops quest trophy |

#### Recreation Duel Opponent

```typescript
export const DUEL_ENEMY = { name: 'RONIN', level: 1 };
export const ENEMY_BASE: FighterBase = { hp: 150, atkPlusWeapon: 7, defense: 5, stance: 'heavy', deflectLearned: false };
```

- **HP:** 150 (vs player's 100) — 1.5× player HP, boss/PvP-shaped tuning
- **Stance:** Heavy (high damage, short reach, defensive penalty)
- **Cannot deflect** — enemy kunai cannot be parried
- **Duel target duration:** 20–60 seconds

### 4.2 AI Decision Architecture

The enemy AI is a **state machine** (`AISeamController`) that produces an `OpponentIntent` each fixed 60 Hz tick. The `Sim` executes intents blindly — all decision logic lives in the controller.

#### AI States (AiMode)

```
idle → telegraph → attack → recover → idle
idle → stancePending → idle (stance switch)
idle → recover (kunai throw)
```

#### Decision Priority (when idle + engaged)

1. **Kunai band roll** — if distance within `AI_KUNAI_RANGE` (240–720 px) and `rng() < kunaiChance`, throw kunai and enter recovery
2. **Close distance** — if distance > `AI_STRIKE_RANGE` (132 px), move toward player at `ENEMY_SPEED` (0.17 px/ms)
3. **Counter-stance pick** — if in strike range, enemy stance does NOT beat player stance, Focus affords switch cost, and `rng() < counterStancePickChance`: enter `stancePending` for 600ms, then switch
4. **Aggression strike roll** — if `rng() < aggression`: enter telegraph (windup) for `telegraphMs`, then commit strike for `attackMs`, then recover for `recoverMs` (±35% jitter)
5. **Wait** — do nothing for one `reactMs` beat, then re-roll

**Critical design rule:** chance rolls happen **once per `reactMs` beat**, never per tick. Per-tick rolling would turn a 0.25 kunaiChance into near-certainty within one second.

### 4.3 Difficulty Tiers & Scaling

| Parameter | Easy | Normal | Hard | Description |
|---|---|---|---|---|
| `telegraphMs` | 700 | 520 | 380 | Windup before any strike (visible telegraph) |
| `attackMs` | 180 | 180 | 160 | Swing active duration |
| `recoverMs` | 760 | 620 | 480 | Recovery after swing (±35% jitter) |
| `reactMs` | 420 | 320 | 220 | Reaction attention window |
| `reactBlockChance` | 0.15 | 0.30 | 0.45 | Probability of blocking a landing slash |
| `reactDodgeChance` | 0.05 | 0.15 | 0.25 | Probability of dodging a landing slash |
| `counterStancePickChance` | 0.20 | 0.50 | 0.80 | Probability of switching to counter stance |
| `aggression` | 0.30 | 0.55 | 0.80 | Probability of committing to a strike when in range |
| `kunaiChance` | 0.00 | 0.25 | 0.40 | Probability of throwing kunai per decision beat |

**Scaling summary:**
- **Easy:** No kunai, 700ms telegraph, 30% aggression, ~1.64s strike cycle
- **Normal:** 25% kunai, 520ms telegraph, 55% aggression, ~1.32s strike cycle
- **Hard:** 40% kunai, 380ms telegraph, 80% aggression, ~1.02s strike cycle — nearly 60% faster than easy

**Difficulty is not yet dynamically scaled by level or progression** — the tier is a static parameter.

### 4.4 Approach Patterns

- **Speed:** `ENEMY_SPEED = 0.17 px/ms` (~10.2 px/frame at 60 Hz). Player is 65% faster (0.28 px/ms), allowing kite-and-punish tactics.
- **Direction:** Always directly toward the player. No circling, no flanking, no retreat.
- **Arena bounds:** Enemy position clamped to `[halfW, GAME_WIDTH - halfW]` (1024 px wide arena).
- **Aggro range:** `AI_APPROACH_RANGE = 620 px` reserved for Stage 4 world encounters. In 1v1 duels, the enemy ALWAYS closes distance.
- **No retreat/spacing:** Once engaged, the enemy monotonically closes distance until within `AI_STRIKE_RANGE` (132 px).

### 4.5 Attack Timing

#### Telegraph-Then-Commit Contract

1. **Telegraph (windup):** Visible windup flash for `telegraphMs` (380–700ms). Player sees the enemy winding up and can react.
2. **Attack (swing):** Strike intent fires for `attackMs` (160–180ms). Damage applied on the tick the strike intent executes.
3. **Recover:** Recovery for `recoverMs` (480–760ms), jittered ±35%. During recovery, the enemy does nothing — **this is the player's punish window**.

| Tier | Telegraph | Attack | Recover (avg) | Total (avg) | Punish Window |
|---|---|---|---|---|---|
| Easy | 700 ms | 180 ms | 760 ms | ~1640 ms | ~760 ms |
| Normal | 520 ms | 180 ms | 620 ms | ~1320 ms | ~620 ms |
| Hard | 380 ms | 160 ms | 480 ms | ~1020 ms | ~480 ms |

### 4.6 Aggression Levels

Aggression is the probability of committing to a strike when in range, rolled once per `reactMs` beat:
- **Easy (0.30):** ~0.71 strikes/second
- **Normal (0.55):** ~1.7 strikes/second
- **Hard (0.80):** ~3.6 strikes/second — relentless pressure

### 4.7 Group Behaviour (Video Evidence — Not Yet Implemented)

- **Pack size:** 3–5 enemies simultaneously
- **Engagement:** Walking into a "BANDIT (L)" NPC triggers a FIGHT! splash with roster silhouette — all enemies visible from the start, not spawned in waves
- **Combat duration:** Trash packs resolve in 3–10s at level parity; multi-enemy brawls last 8–50s
- **Hit combo:** Player combo counter climbs to 5–11 in multi-mook brawls; resets to 1 (not 0) on kill and breaks on taking damage or chain gaps
- **No observed coordination:** Enemies attack independently with no flanking, surround, or turn-based coordination
- **Boss + Add:** Inokichi fights alongside unnamed mob fighters while player has ally NPC (Satoshi)

### 4.8 Boss Patterns

#### 3-Hit Combo

Jinbei (A-16): A 3-hit combo exchange at t=32:45–32:48 dealt 27 damage, dropping player from 20/20 to 4/20 HP (~5.3 HP/hit). The stance meter (blue bar) ticked 20→18 during the combo.

#### Ground Slam Shockwave

**Not present in current code.** Not directly observed in video study. The Red Oni boss and Inokichi are the most likely candidates. Design note: `OpponentIntent` could be extended with `slam?: boolean` and `Sim.ts` would need an AoE damage check. Stage 4+ feature.

#### Boss Encounter Conventions (Video)

- **VS card intro:** Red cracked "VS" glyph, player portrait left (yellow name), enemy right (white name), enemy HP bar shown over live scene
- **Pre-fight cutscene:** Full-body character portrait + dialogue box
- **Duel heal:** Named/boss encounters top player's HP to full pre-fight; trash fights do NOT heal
- **Taunt on victory:** Boss taunts the defeated player ("WEAK!" — Bandit Leader)
- **Death transition:** Hard cut to solid dark-red screen, black silhouettes, ~3s hold, enemy sheathes weapon, then "YOU WERE DEFEATED!" with LEAVE AREA / FREE RESPAWN
- **Free respawn:** Full HP/CHI restore, returns to encounter-trigger checkpoint, no coin/XP/item penalty

### 4.9 Kunai Throw Mechanics

| Property | Value |
|---|---|
| **Range gate** | 240–720 px horizontal distance |
| **Probability gate** | `rng() < kunaiChance` per `reactMs` decision beat (Easy: 0%, Normal: 25%, Hard: 40%) |
| **Decision cadence** | Once per `reactMs` beat — prevents kunai spam |
| **Post-throw recovery** | Same recovery as a melee swing (recoverMs ± 35% jitter) |
| **Max active** | 8 simultaneous kunai |
| **Aim** | Player's position at throw time (no prediction/leading) |
| **Speed** | 0.55 px/ms (33 px/frame @60Hz); crosses 1024px arena in ~1.86s |
| **Damage** | 8 flat, bypassing defense, does NOT crit |
| **Hit radius** | 26 px |
| **Off-arena despawn** | Kunai that leave horizontal bounds are removed |
| **Player i-frames** | Spawn invuln (5s) or Smoke Bomb (420ms) absorb kunai |
| **Deflect** | Player with `deflectLearned: true` + Stab within 260ms window + 64px radius → kunai destroyed |

### 4.10 Spawn Patterns

#### Current Code (1v1 Duel)

- Player spawn: `DUEL_SPAWNS.player = { pos: { x: 260, y: 430 }, halfW: 26, halfH: 60 }`
- Enemy spawn: `DUEL_SPAWNS.enemy = { pos: { x: 700, y: 430 }, halfW: 26, halfH: 60 }`
- Initial distance: 440 px (within kunai range, outside strike range)
- Player gets 5s spawn invuln; enemy gets none

#### Original Game (Video Evidence)

- Overworld: Walking into a named "BANDIT (L)" NPC triggers FIGHT! splash with 3–5 enemies visible from start. No mid-fight spawning observed.
- Dungeon: Locked doors gate boss rooms. Trash mobs guard the approach in sequential rooms.

### 4.11 Reaction System (Block / Dodge)

When a player slash WOULD land, the AI controller's `react()` method is consulted:

- **Attention window:** At most one block/dodge roll per `reactMs` (220–420 ms)
- **Block:** `rng() < reactBlockChance` → slash negated (`strikeBlocked`, clang, no damage). Critical meter NOT consumed.
- **Dodge:** If block fails, `rng() < reactDodgeChance` → slash evaded (`strikeEvaded`, no damage)
- **No reaction:** Both fail → slash lands normally

| Tier | Block | Dodge | Total Avoid | Reaction Window |
|---|---|---|---|---|
| Easy | 15% | 5% | 19.25% | 420 ms |
| Normal | 30% | 15% | 40.5% | 320 ms |
| Hard | 45% | 25% | 58.75% | 220 ms |

Note: Total avoid = `blockChance + (1 - blockChance) × dodgeChance` (dodge only rolls if block fails).

### 4.12 Not Yet Implemented

| Feature | Evidence | Status |
|---|---|---|
| Multi-enemy AI (group fights) | Video: 3–5 enemy packs | 1v1 only in current Sim |
| Archer with arcing arrows | Wiki + video | Kunai (straight-line) models the projectile; arc not implemented |
| Shielder (immune to front attacks, leg weakness) | Wiki | Block chance partially models; directional hit zones not implemented |
| Walker thorns/counter-damage | Wiki | Not implemented |
| Runner (fast Walker) | Wiki | Single `ENEMY_SPEED` constant |
| Jumper (stationary → jump attack) | Wiki | Enemy jump state not implemented |
| Blue Oni (rock throw) | Wiki | Would parallel kunai projectile |
| Red Oni (sleep/aggro cycle, boss-tier) | Wiki | Sleep state not in `AiMode` enum |
| Ground slam shockwave | Not observed in video | No AoE attack in `Sim.ts` |
| Dynamic difficulty scaling by level | Implied by progression | AI tier is static parameter |
| Boss HP persistence across retries | Contradictory video evidence | Full reset is current default |
| Enemy kunai deflection | `deflectLearned = false` | Enemy cannot deflect |
| Retreat / spacing AI | Not observed | AI monotonically closes distance |
| Circling / flanking | Not observed | AI moves in 1D (x-axis only) |

---## 5. Animation States

### Coordinate System

All pose coordinates are in **stage space** (1024×576 canvas). Origin = pelvis, +x = forward (facing direction), +y = down. Feet plant at y=+49. The pelvis rides 52px above groundY at render time. Standing sprite height: **~117 stage px** (~220px @1080).

### Animation Frame Rate

**[MEASURED]** The original steps poses at **15fps** — every 4th video frame in 60fps footage. Pixel-difference MAE analysis shows consecutive-frame grayscale MAE ≈ 0 except every 4th frame (MAE 2.9–19.1), with one deliberate 8-frame clash hold. This is **15fps animation inside 60fps gameplay**. Config: `poseStepMs = 1000/15` (≈66.7ms per pose step).

### 5.1 Idle (Combat Stance / Semi-Crouch)

**Pose (`IDLE_POSE`):**

| Joint | x | y | Description |
|---|---|---|---|
| pelvis | 0 | 4 | Dropped 4px below neutral (deeper knee bend) |
| chest | 6 | -30 | Leaning forward (+6 x) |
| neck | 6 | -38 | Follows chest lean |
| head | 7 | -46 | Slight forward tilt |
| hat | 8 | -66 | Kasa (straw hat) top, shallow and wide |
| shoulderF | 9 | -32 | Forward shoulder |
| elbowF | 16 | -20 | Bent forward |
| handF | 17 | -9 | Low-forward blade hand |
| sword | 58 | -20 | Blade extends forward at mid-body height |
| hipF | 5 | 4 | Front hip |
| kneeF | 9 | 28 | Front knee, bent and splayed (±9 from center) |
| footF | 14 | 49 | Front foot, wide base (±14) |
| hipB | -5 | 4 | Back hip |
| kneeB | -8 | 28 | Back knee, bent |
| footB | -14 | 49 | Back foot, wide base |

**Key features:** Semi-crouch, wide stance (feet ±14px apart), blade held low-forward at x=58. Pelvis dropped 4px. Chest leans 6px forward. NOT an upright standing pose — combat-ready crouch.

**Breathing overlay (`idleOffsets`):** Sinusoidal breathing cycle on a **2600ms period** (`idlePeriodMs`):

| Joint | Amplitude (px) | Direction |
|---|---|---|
| chest | 1.5 | Vertical (−y on inhale) |
| neck | 1.3 | Vertical |
| head | 1.1 | Vertical |
| hat | 1.1 | Vertical (tracks head) |
| handF | 1.0 | Vertical (opposite phase — drops on inhale) |

### 5.2 Walk

**Gait type:** Upright short-step walk, used in-fight and for travel.

**Cycle parameters (`WALK`):**

| Parameter | Value | Evidence |
|---|---|---|
| stridePx | 72 stage px | [MEASURED] |
| footSwing | ±16 stage px | [MEASURED (coarse)] |
| footLift | 6 stage px | [MEASURED (coarse)] |
| kneeSwing | 8 stage px | [INFERRED] |
| kneeLift | 3 stage px | [INFERRED] |
| bob | 3 stage px | [INFERRED] |
| armSwing | 7 stage px | [INFERRED] |

**Stride mechanics:** Phase advances by distance traveled / stridePx — prevents foot-skating. Phase wraps [0,1) modulo. Stride period: 16 video frames (≈267ms, 4 animation steps per stride). [MEASURED]

**Procedural walk cycle (`walkOffsets`):**

| Joint | x offset | y offset | Formula |
|---|---|---|---|
| footF | `footSwing × sin(phase×2π)` | `−footLift × max(0, sin)` | Forward swing on sin>0 |
| kneeF | `kneeSwing × sin(phase×2π)` | `−kneeLift × max(0, sin)` | Tracks foot at half amplitude |
| footB | `−footSwing × sin(phase×2π)` | `−footLift × max(0, −sin)` | Opposite phase |
| kneeB | `−kneeSwing × sin(phase×2π)` | `−kneeLift × max(0, −sin)` | Opposite phase |
| pelvis | 0 | `−bob × cos(2×phase×2π)` | Two bobs per stride |
| chest | 0 | `−bob × cos(2×phase×2π)` | Tracks pelvis |
| handF | `−armSwing × sin(phase×2π)` | 0 | Counter-swings front leg |

**Speed:** ~7–9.5 px/f @1080 (≈240–300 stage px/s). [MEASURED]

### 5.3 Run / Jog

**Key differences from walk:**

| Property | Walk | Run |
|---|---|---|
| Speed | ~7–9.5 px/f @1080 | ~14 px/f @1080 |
| Lean | Upright | ~45° forward lean |
| Stride length | ~135px @1080 | ~225px @1080 (~1.0× sprite height) |
| Stride period | 16 frames | 16 frames (same cadence, longer stride) |
| Usage | In-fight footwork | Overworld travel, duel approach |

### 5.4 Light Slash

**Phase timing (`SLASH_FRAMES.light`):**

| Phase | Frames | Duration (ms) | Easing |
|---|---|---|---|
| Windup | 4 | 66.7 | easeOutCubic |
| Active (strike) | 4 | 66.7 | easeOutCubic |
| Recovery | 4 | 66.7 | easeInOutSine |
| **Total** | **12** | **200ms** | |

**Arc geometry:** k = 300/200 = **1.5**. Arm joint deviations from IDLE scaled by 1.5× for light reach.

**Speed multiplier:** `STANCE_TABLE.light.speed = 1.4` — entire slash plays 1.4× faster.

### 5.5 Balanced Slash

| Phase | Frames | Duration (ms) | Easing |
|---|---|---|---|
| Windup | 4 | 66.7 | easeOutCubic |
| Active (strike) | 4 | 66.7 | easeOutCubic |
| Recovery | 8 | 133.3 | easeInOutSine |
| **Total** | **16** | **267ms** | |

**Arc geometry:** k = 200/200 = **1.0** (baseline). Arm joints use unscaled poses.

**Windup pose (`SLASH_WINDUP`):**

| Joint | x | y | Δ from IDLE |
|---|---|---|---|
| shoulderF | 3 | -38 | −6, −6 |
| elbowF | 0 | -46 | −16, −26 |
| handF | -10 | -44 | −27, −35 |
| sword | -34 | -62 | −92, −42 |

**Follow pose (`SLASH_FOLLOW`):**

| Joint | x | y | Δ from IDLE |
|---|---|---|---|
| shoulderF | 7 | -32 | −2, 0 |
| elbowF | 22 | -26 | +6, −6 |
| handF | 38 | -6 | +21, +3 |
| sword | 72 | 24 | +14, +44 |

**Damage:** dmgMult = 1.2. Critical hit = 1.3× physical damage.

### 5.6 Heavy Slash

| Phase | Frames | Duration (ms) | Easing |
|---|---|---|---|
| Windup | 4 | 66.7 | easeOutCubic |
| Active (strike) | 4 | 66.7 | easeOutCubic |
| Recovery | 12 | 200.0 | easeInOutSine |
| **Total** | **20** | **333ms** | |

**Arc geometry:** k = 120/200 = **0.6**. Short, compact arc. Arm deviations scaled to 60%.

**Speed multiplier:** 0.7× speed. **Damage:** dmgMult = 1.4 (highest). Defense penalty: DEF × 0.8.

**Feel:** Shortest reach (120px), slowest animation (0.7× speed), highest damage (1.4×). Recovery is 3× longer than light (12 frames vs 4). Windup and active phases are the SAME duration as light/balanced — only recovery varies.

### 5.7 Hit Reaction (Stagger)

**Timing:**

| Phase | Duration | Easing | Description |
|---|---|---|---|
| Recoil (snap-back) | 67ms (4 frames) | easeOutCubic | Snap into recoil position |
| Return (ease home) | 133ms (8 frames) | easeInOutSine | Ease back to base pose |
| **Total** | **200ms (12 frames)** | | |

**Recoil pose (`HIT_RECOIL`):**

| Joint | x | y | Δ from IDLE | Description |
|---|---|---|---|---|
| chest | -3 | -32 | −9, −2 | Torso knocked back |
| neck | -4 | -40 | −10, −2 | Neck recoils |
| head | -6 | -48 | −13, −2 | Head snaps back |
| hat | -5 | -67 | −13, −1 | Kasa follows head |
| shoulderF | 2 | -34 | −7, −2 | Front shoulder pulls back |
| elbowF | 9 | -22 | −7, −2 | Elbow drops back |
| handF | 11 | -12 | −6, −3 | Blade hand drops |
| sword | 44 | -24 | −14, −4 | Blade pulls back and down |

**Knockback:** ~55–70px @1080 (≈30–37 stage px), all in first animation step. **Visual only** — sim doesn't apply positional knockback.

**State machine rule:** Hit can NOT interrupt an active slash — if fighter is mid-swing, the hit is absorbed into the slash follow-through.

### 5.8 Block / Guard

**Blend mechanics:**
- Guard pose blends in/out over `guardBlendMs = 130ms`
- Blend weight `guardT` ramps from 0→1 at `dtMs / guardBlendMs` per frame
- Below `guardEps = 0.001` weight, guard overlay is skipped entirely
- Blending uses `easeInOutSine(guardT)`

**Guard pose (`GUARD_POSE`):**

| Joint | x | y | Δ from IDLE | Description |
|---|---|---|---|---|
| shoulderF | 5 | -37 | −4, −5 | Shoulder raises |
| elbowF | 16 | -36 | 0, −16 | Elbow raises high |
| handF | 26 | -32 | +9, −23 | Hand high, forward |
| sword | 62 | -36 | +4, −16 | Blade horizontal, high-forward |

**Telegraph guard:** When enemy is winding up a strike (telegraph state), the guard pose used is `SLASH_WINDUP` (blade raised behind shoulder).

**Block guard:** When actually blocking (`strikeBlocked` event), `GUARD_POSE` is used — sword horizontal in front at chest height.

**Enemy guard timing:** `enemyGuardUntil = fxNow + 260ms` on a `strikeBlocked` event.

### 5.9 Dodge / Roll (Smoke Bomb)

- Triggered by skill key 2 (`smokeBomb`)
- Distance: 180px teleport in facing direction
- I-frames: 420ms — invulnerable to damage
- Dodges stab attacks specifically
- Visual: Position displacement + blink (alpha alternates 1.0↔0.25 every 100ms)

### 5.10 Death (Collapse)

**Timing:**

| Phase | Frames | Duration | Easing |
|---|---|---|---|
| Tip-airborne → ground | 12 frames | 200ms | `easeInQuad(t)` = t² |
| Settled | 8 more frames | 133ms | — |
| **Total** | **20 frames** | **333ms** | |

**Death pose (`DEAD`):**

| Joint | x | y | Description |
|---|---|---|---|
| pelvis | 0 | 40 | Dropped to near-ground |
| chest | -18 | 36 | Torso rotated backward and down |
| neck | -30 | 38 | Neck horizontal |
| head | -40 | 38 | Head on ground, behind body |
| hat | -54 | 42 | Kasa fallen off, further back |
| shoulderF | -16 | 33 | Arm splayed |
| elbowF | -27 | 40 | Forearm on ground |
| handF | -35 | 44 | Hand on ground |
| sword | -62 | 46 | Sword detached, dropped beside corpse |
| hipF | 5 | 42 | Hips collapsed |
| kneeF | 20 | 45 | Front leg bent, knee forward |
| footF | 38 | 47 | Front foot splayed forward |
| hipB | -4 | 43 | — |
| kneeB | -14 | 46 | Back leg folded |
| footB | -30 | 48 | Back foot tucked under |

**Key visual details:** Body knocked **backward**, rotating to horizontal. Sword **detaches** and drops beside corpse. Ground shadow widens: `spread = max(58, |head.x − footF.x| + 24)`.

**Kill beat sequence:** `fightEnded` → loser's `startDeath()` → 900ms wall clock hold (red flash snap-in 60ms → slow-mo 0.35× → flash fades 420ms) → result screen launches. `FINISHER_FLASH`: durationMs=420, snapInMs=60, slowMoScale=0.35, slowMoRampMs=90.

### 5.11 Jump

- **Duration:** 24 frames (400ms at 60Hz) [INFERRED]
- **Apex height:** 120px (screen y-down: subtracted) [INFERRED]
- **Trajectory:** Pure parabola: `y(t) = lerp(start.y, end.y, t) − apex × 4 × t × (1−t)`
- **Gesture trigger:** Upward stroke (within ±45° of vertical, upward direction, path length > 90px)
- **Evasion:** Airborne player evades all ground strikes — `executeStrike()` checks `player.jump !== null` and emits `strikeEvaded`

### 5.12 Shunpo (Teleport / Slow-Mo)

- **Mechanics:** SHIFT-hold → timescale drops to 0.35×
- **Two-clock system:** fx clock slows with gameplay (blade trails, blood, telegraph auras); wall clock stays unscaled (kill-beat holds, invuln blinks keep real-time cadence)
- **Visual:** Timescale change applies to BOTH Phaser's `time.timeScale` and `tweens.timeScale`
- Not a teleport — it's bullet-time slow-mo draining a meter

### 5.13 Spawn

- 5 seconds invulnerability after entering PvP/war-room, OR until first slash
- Blinking: alpha alternates 1.0 ↔ 0.25 every 100ms (wall clock)
- `invulnEndFrame = currentFrame + SPAWN_INVULN_S × FIXED_HZ`
- Fighter in idle/locomotion pose — blink is a render-alpha effect, not a pose change

### 5.14 Stance Switch

- **Out-of-combat:** Instant, no animation, no cooldown (SPACE or portrait click). Cycles: light → balanced → heavy → light. [CONTRACT]
- **In-combat (recreation):** Focus-gated, 600ms `stancePending` telegraph flash (blue aura), then active. [INFERRED]
- **Visual feedback:** Stance ring color (Light=Blue, Balanced=Brown, Heavy=Red), blue aura pulse for pending switch

### 5.15 Duel Intro (VS → FIGHT!)

See §2.6 above for full details. Two-beat sequence: VS (~2000ms) → FIGHT! (~450ms) → tail (~150ms). Total ~2600ms.

### 5.16 Scarf / Secondary Motion

**Parameters (`SCARF`):**

| Parameter | Value | Description |
|---|---|---|
| segments | 5 | Tail points beyond neck anchor |
| segLen | 8 | Px between scarf points |
| width | 6 | Base half-width at neck |
| sway | 5 | Idle flutter amplitude (px) |
| flutterHz | 1.6 | Idle flutter speed (cycles/s) |
| flowGain | 30 | Tail displacement per unit body velocity |
| flowMax | 22 | Clamp on velocity-driven tail displacement |
| flowSmoothing | 0.18 | Low-pass factor on body-velocity estimate |
| anchorX | -6 | Local x offset from neck |
| anchorY | 3 | Local y offset from neck |
| droop | 2.5 | Gravity sag per segment down the tail |

### 5.17 Enemy Telegraph (Windup Tell)

- AI windup pose is `SLASH_WINDUP` (blade raised behind shoulder)
- Pulsing red aura ellipse under enemy: `fillEllipse(enemy.pos.x, enemy.pos.y + 30, 120, 40)` with `alpha = 0.3 + 0.3 × |sin(fxNow/90)|`
- Aura ages on fx clock (holds correctly in slow-mo)
- Telegraph timing: 380ms (Hard) to 700ms (Easy) — the player's reaction window

### 5.18 Summary Table

| Animation | Key Poses | Duration | Frame Rate | Easing | Source |
|---|---|---|---|---|---|
| Idle (combat crouch) | `IDLE_POSE` + breathing | Continuous (2600ms breath) | 15fps | Sinusoidal | MEASURED |
| Walk | `IDLE_POSE` + `walkOffsets` | 16f/stride (267ms) | 15fps | Sine | MEASURED |
| Run | `IDLE_POSE` + walk offsets (large) | 16f/stride | 15fps | Sine | MEASURED |
| Light Slash | Windup→Follow→base | 12f (200ms) | 15fps | easeOutCubic / easeInOutSine | MEASURED |
| Balanced Slash | Windup→Follow→base | 16f (267ms) | 15fps | easeOutCubic / easeInOutSine | MEASURED |
| Heavy Slash | Windup→Follow→base | 20f (333ms) | 15fps | easeOutCubic / easeInOutSine | MEASURED |
| Hit Reaction | base→`HIT_RECOIL`→base | 12f (200ms) | 15fps | easeOutCubic / easeInOutSine | MEASURED |
| Block/Guard | base→`GUARD_POSE` blend | 130ms blend | 15fps | easeInOutSine | INFERRED |
| Dodge (Smoke Bomb) | Position shift + blink | 420ms i-frames | Wall-clock blink | — | INFERRED |
| Death | `IDLE_POSE`→`DEAD` lerp | 20f (333ms) | 15fps | easeInQuad (t²) | MEASURED |
| Jump | Parabolic arc | 24f (400ms) | 60fps physics | Parabola 4t(1−t) | INFERRED |
| Shunpo | Timescale modifier | While SHIFT held | 0.35× timescale | — | INFERRED |
| Spawn Invuln | Blink alpha 1.0↔0.25 | 5s or first slash | 100ms blink | — | CONTRACT |
| Stance Switch | Instant pose swap | Instant (OOC) / Focus-gated (IC) | — | — | CONTRACT |
| Duel Intro | VS band → FIGHT! band | ~2600ms | 60fps | — | MEASURED |
| Enemy Telegraph | base→`SLASH_WINDUP` blend | 380–700ms (by tier) | 15fps | easeInOutSine | CONTRACT |
| Scarf Flutter | Procedural ribbon | Continuous | 1.6Hz flutter | Sin + low-pass vel | INFERRED |

---## 6. Movement Physics

### 6.1 Key Findings at a Glance

| Movement | Speed | Source |
|---|---|---|
| **Walk (overworld)** | ~269 stage px/s (8.4 px/f @1080) | [MEASURED] |
| **Walk (duel config)** | 280 px/s (0.28 px/ms) | [INFERRED] |
| **Run** | ~448 stage px/s (14 px/f @1080) | [MEASURED] |
| **Jump** | 24 frames (400ms), 120px apex at frame 12 | [INFERRED] |
| **Shunpo** | NOT a teleport — bullet-time slow-mo at 35% timescale | [INFERRED] |
| **Smoke Bomb** | The actual teleport — instant 180px dash + 420ms i-frames | [INFERRED] |
| **Knockback** | ~30–37 stage px backward, all in first anim step (67ms) | [MEASURED] — visual only |

### 6.2 Walk Details

- **Speed:** ~269 stage px/s (measured from Video B fixed-camera window, walk-b05b frames 089–133, 60fps extract)
- **Stride:** 72 stage px (~135px @1080), 16 video frames per stride (4 animation steps)
- **Foot swing:** ±16 stage px horizontal, 6px lift
- **Knee tracking:** ~8px swing, 3px lift (tracks foot at half amplitude)
- **Bob:** 3px pelvis/chest at 2× stride frequency
- **Arm swing:** 7px (sword-hand counter-swings front leg)
- **No acceleration/deceleration:** Binary instant start/stop, no momentum model

### 6.3 Run Details

- **Speed:** ~448 stage px/s (~14 px/f @1080)
- **Lean:** ~45° forward bounding gait
- **Stride length:** ~225px @1080 (~1.0× sprite height)
- **Stride period:** 16 frames (same cadence as walk, longer stride)
- **Usage:** Overworld travel, duel run-ins. Duel approach speed ~10 px/f.

### 6.4 Jump

- **Duration:** 24 frames (400ms at 60Hz)
- **Apex:** 120px at t=0.5 (frame 12)
- **Trajectory:** Pure parabola — `y(t) = lerp(start.y, end.y, t) − apex × 4 × t × (1−t)`
- **Launch/land:** Always from and to spawn groundY (capturing pos.y mid-air was a bug — fixed by storing groundY)
- **Evasion:** Airborne player evades all ground strikes

### 6.5 Shunpo

- **NOT a teleport** — it's bullet-time slow-mo
- **Timescale:** 0.35× (35% speed)
- **Meter:** 100 max, drains 34/s (2.94s full), refills 12/s (8.33s full)
- **Min to start:** 10
- **Two-clock system:** fx clock slows (blade trails, blood, telegraph auras); wall clock stays unscaled (kill-beat holds, invuln blinks keep real-time cadence)

### 6.6 Smoke Bomb (Teleport)

- **Distance:** 180px in facing direction
- **I-frames:** 420ms — invulnerable to damage
- **Cooldown:** 7.96s
- **Chi cost:** 25
- **Blink:** alpha 0.25 every other 100ms window (wall clock)
- **Dodges stabs specifically**

### 6.7 Knockback

- **Distance:** ~30–37 stage px backward (~55–70px @1080)
- **Timing:** All in first animation step (67ms — 4 frames)
- **Visual only:** The sim does NOT apply positional knockback; it's a visual pose offset only
- **Easing:** easeOutCubic (snap into recoil) then easeInOutSine (ease home)

### 6.8 Lunge

- **Speed:** ~320 px/s approach (duel approach)
- **Distance:** 89–126 stage px
- **Lands in ONE animation step** (4 frames / 67ms) — the "lunge" is a single pose-step displacement, not a sustained velocity
- **Pattern:** Walk between exchanges, lunge during the actual strike

### 6.9 No Continuous Physics

- **No acceleration/deceleration:** Binary instant start/stop
- **No momentum model**
- **No continuous gravity:** Only the jump parabola (mathematical, not velocity-integrated); fighters locked to groundY otherwise
- **No friction**
- Movement is velocity-based with instant start/stop — the game prioritizes responsiveness over simulation realism

---

## 7. Fighter Proportions & Combat Idle

### 7.1 Measurement Method

- **Source:** Video B (`Nr4fQstqHDM`) and Video A (`zFtCaTO0_1M`) — both 1920×1080, upscaled from native 800×480
- **Scale:** `study_px @1080 ÷ 1.875 = stage_px` (canvas 1024×576)
- **Game viewport:** Cols 52–1867 in 1080p frame (1816px ≈ 968.5 stage px), with 52px black bars each side
- **Detection:** Frame differencing between consecutive sub-second frames to isolate moving fighters against static backgrounds, then vertical/horizontal brightness profiling at fighter body center

### 7.2 Body Proportion Measurements

All measurements in stage px (1080p ÷ 1.875):

| Measurement | @1080 px | Stage px | Evidence |
|---|---|---|---|
| **Total fighter height** (kasa→feet) | ~220 | **~117** | MOTION_MEASUREMENTS.md (kasa y≈660 → feet y≈880) |
| **Kasa (straw hat) width** | ~112 | **~60** | Horizontal scan at row 625: widest dark cluster 114px |
| **Kasa height** (apex to brim underside) | ~21 | **~11** | Vertical scan: kasa top row 615, face start row 636 |
| **Head diameter** | ~31 | **~17** | Face row 636 → shoulder row 667 |
| **Torso length** (shoulder→waist) | ~45 | **~24** | Shoulder row 667 → waist row 712 |
| **Leg length** (hip→feet, vertical) | ~113 | **~60** | Waist row 712 → feet row 825 |
| **Thigh** (hip→knee, vertical) | ~71 | **~38** | Waist row 712 → knee row 783 |
| **Shin** (knee→feet, vertical) | ~42 | **~22** | Knee row 783 → feet row 825 |
| **Shoulder width** | ~40 | **~21** | Horizontal scan at shoulder row |
| **Stance width** (foot to foot) | ~55 | **~29** | Shin-level scan: foot center to foot center |
| **Katana/blade length** (hand→tip) | ~80 | **~43** | Hand cluster to blade tip cluster |
| **Arm length** (shoulder→hand) | ~45 | **~25** | Code: shoulder→elbow (13.9) + elbow→hand (11.0) = 24.9 |

### 7.3 Knee Bend Angle

| Segment | Vertical @1080 | Horizontal offset | Angle from vertical |
|---|---|---|---|
| Thigh (hip→knee) | 71px | ~11px forward | ~9° forward |
| Shin (knee→foot) | 42px | ~11px back toward hip | ~15° backward |
| **Knee bend angle** | | | **~157°** |

180° = fully straight, 90° = full squat. 157° is a moderate semi-crouch. The thigh/shin ratio (1.69:1) is the signature of the combat idle — the crouch pushes the knee forward, tilting the shin toward horizontal.

### 7.4 Combat Idle Pose — Joint Coordinates

Origin at pelvis, +x forward (facing direction), +y down. Feet plant at y=+49 (pelvis rides 52px above groundY).

| Joint | x | y | Notes |
|---|---|---|---|
| `pelvis` | 0 | +4 | Origin — dropped 4px below center for deeper crouch |
| `chest` | +6 | -30 | Leans forward (+6 x) from upright |
| `neck` | +6 | -38 | Tracks chest |
| `head` | +7 | -46 | Slightly forward of pelvis |
| `hat` | +8 | -66 | Kasa apex; brim at head.y-4 = -50 |
| `shoulderF` | +9 | -32 | Forward shoulder |
| `elbowF` | +16 | -20 | Bent forward, lower than shoulder |
| `handF` | +17 | -9 | Low grip — below elbow, just above pelvis |
| `sword` | +58 | -20 | Blade tip extends far forward, at elbow height |
| `hipF` | +5 | +4 | Front hip — slightly forward of pelvis |
| `kneeF` | +9 | +28 | Pushed forward (+9 x) — the crouch tell |
| `footF` | +14 | +49 | Planted forward and wide |
| `hipB` | -5 | +4 | Back hip — slightly behind pelvis |
| `kneeB` | -8 | +28 | Back knee — less forward push than front |
| `footB` | -14 | +49 | Planted back and wide |

### 7.5 Pose Characteristics

1. **Pelvis dropped** (y=+4, not y=0): center of gravity lowered ~4px
2. **Knees splayed forward**: front knee at x=+9 (9° forward of vertical)
3. **Wide stance**: feet at ±14 (28px spread, ~29px measured)
4. **Chest leans forward** (+6 x): torso tilts toward opponent
5. **Blade low-forward**: sword tip at (58, -20) — not raised, ready for rising slash
6. **Hand low**: handF at (17, -9) — grip below elbow, close to body
7. **Total height**: kasa apex y=-70 to feet y=+49 → **119 stage px** (matches measured ~117 within 2px error)

### 7.6 Verification Against Code

| Property | Measured (stage px) | Code (stage px) | Match |
|---|---|---|---|
| Total height | ~117 | 119 | ✓ (within 2px) |
| Knee bend angle | ~157° | 157.1° | ✓ exact |
| Stance width | ~29 | 28 | ✓ (within 1px) |
| Arm length | ~25 | 24.9 | ✓ exact |
| Blade length | ~43 | 42.4 | ✓ (within 1px) |
| Kasa width | ~60 | 60 | ✓ exact |

**Conclusion:** The combat idle pose in `IDLE_POSE` is a faithful measurement-based recreation. No changes needed.

---## 8. UI/UX Complete Inventory

### 8.1 Screen Layout Overview

The game runs at a **16:9 aspect ratio** (original 1920×1080 full-bleed; target stage 1024×576). All coordinates expressed as **absolute pixels @1920×1080** and **normalized fractions** (origin top-left), which transfer 1:1 to the 1024×576 stage.

HUD occupies two zones:
- **Bottom HUD strip**: bottom ~12% of screen (y ≈ 940–1080 @1080; fraction 0.870–1.0)
- **Top-left corner**: AUTO SLASH toggle plate and coin counter (y ≈ 0–100 @1080)
- **Top-right corner**: enemy nameplate / health bar (y ≈ 90–123 @1080)
- **Center band**: transient overlays only (VS intro, FIGHT! splash)

### 8.2 Bottom HUD Background

| Property | Value |
|---|---|
| **Position** | Full width, y 940–1080 @1080 (fraction y 0.870–1.0) |
| **Fill color** | `#16210a` (RGB 22,33,10) — dark olive green |
| **Secondary fill** | `#18200a`, `#21250f` — gradient variation |

### 8.3 Player HP Bar

| Property | Value |
|---|---|
| **Position** | x 246–513, y 972–989 @1080 (fraction x 0.128–0.268, y 0.900–0.916) |
| **Width** | 267 px @1080 (~14% screen width) |
| **Height** | 17 px @1080 |
| **Fill color** | `#02990b` (green) with vertical gradient |
| **Gradient (top→bottom)** | `#3ab55f` → `#31ad58` → `#26a641` → `#129827` → `#079913` → `#02990b` → `#05960c` → `#009a03` |
| **Border** | Black, 1–2 px |
| **Behavior** | Shrinks right-to-left as HP decreases. Hidden during VS/FIGHT intro and result cards. |

### 8.4 Player Chi/Focus Bar (Blue)

| Property | Value |
|---|---|
| **Position** | x 246–513, y 1005–1017 @1080 (fraction x 0.128–0.268, y 0.931–0.942) |
| **Width** | 267 px (identical span to HP bar) |
| **Height** | 12 px |
| **Fill color** | `#2e49e2` (blue) with vertical gradient |
| **Gradient (top→bottom)** | `#5272ea` → `#4d6ee6` → `#4362e2` → `#3a56e4` → `#2e49e2` → `#253fe6` → `#1930ef` → `#1b24cf` |

### 8.5 Focus Strip (White Pill)

| Property | Value |
|---|---|
| **Position** | Left-aligned with HP/Chi bars, y 1030–1045 @1080 |
| **Width** | Variable (fill length changes in-fight) |
| **Height** | ~15 px |
| **Fill color** | `#eeeeee`–`#e3e3e3` (near-white), vertical gradient |
| **Behavior** | Thin white pill below Chi bar. Represents focus/charge level. Combat-only. |

### 8.6 Portrait Ring

| Property | Value |
|---|---|
| **Center** | ~(161, 1021) @1080 (fraction x 0.084, y 0.945) |
| **Outer radius** | ~64 px @1080 |
| **Ring color** | `#950d00` (deep red) |
| **Interior** | Character portrait sprite |
| **Behavior** | Persistent during combat. Sits LEFT of HP/Chi bars. Red ring frames circular portrait. |

### 8.7 Skill Bar (3 Slots)

| Property | Value |
|---|---|
| **Slot 1** | x 1462, y 957 @1080 (fraction x 0.761, y 0.886) |
| **Slot 2** | x 1585, y 957 @1080 (fraction x 0.825, y 0.886) |
| **Slot 3** | x 1722, y 957 @1080 (fraction x 0.897, y 0.886) |
| **Slot size** | ~108×113 px @1080 each |
| **Interior color** | `#000000`–`#131313` (near-black) |
| **Border color** | `#313131` (grey, 49,49,49) — bright rim `#464646` at outer edge |
| **Icons** | Skill icons rendered as sprites within dark interior |

### 8.8 AUTO SLASH Toggle Plate

| Property | Value |
|---|---|
| **Position** | Box (74, 24)–(367, 85) @1080 (fraction x 0.039–0.191, y 0.022–0.079) |
| **Width** | 293 px @1080 (~15% screen width) |
| **Height** | 61 px @1080 |
| **Fill color** | `#542c06` (dark parchment/bronze) |
| **Border** | Darker edge `#2d1600` |
| **Text** | "AUTO SLASH" (top row), "ON"/"OFF" (bottom row) |
| **Text color** | Light parchment `#e0d278`–`#fff7f1` |

### 8.9 Enemy Nameplate / Health Bar (Top-Right)

| Property | Value |
|---|---|
| **Position** | x 1686–1760, y 90–123 @1080 (fraction x 0.878–0.917, y 0.083–0.114) |
| **Width** | ~74 px @1080 (curved/oval shape) |
| **Height** | ~33 px @1080 |
| **Fill color** | `#a30e00` (dark red) |
| **Behavior** | Top-right during duels. Red fill = enemy health. Not present in world exploration. |

### 8.10 Enemy Overhead Health Bar (World-Attached)

| Property | Value |
|---|---|
| **Position** | Anchored to enemy sprite, not screen. Offset: dx=0, dy=−88 stage-px |
| **Fill color** | `#179b32` (brighter green than player HP) |
| **Behavior** | Floats above enemy head in world combat. Follows enemy movement. Not present in duel mode. |

### 8.11 Combo Counter / Score

| Property | Value |
|---|---|
| **Position** | Bottom HUD area, x ≈ 775–1835, y ≈ 995–1050 @1080 |
| **Text color** | Yellow `#c0ac4b`–`#cfbf76` (gold/amber brush-stroke style) |
| **Secondary text** | White `#eeeee6`–`#ffffff` |
| **Font** | Brush-stroke / calligraphic style |
| **Behavior** | Appears mid-combat when combo hits accumulate. Fades after a few seconds. Not persistent. |

### 8.12 Coins / Currency Display

| Property | Value |
|---|---|
| **Position** | Top-left area, x ≈ 294–316, y ≈ 28–51 @1080 |
| **Icon color** | Gold `#ffc400`–`#ffcc00` |
| **Behavior** | World exploration mode near AUTO SLASH plate. Not visible in duel mode. |

### 8.13 VS Intro Overlay

| Property | Value |
|---|---|
| **Band position** | Full screen width, y 448–584 @1080 (fraction y 0.415–0.541) |
| **Band height** | 136 px @1080 (~12.6% screen height) |
| **Band fill** | `#000000` (pure black), full-width, no inset |
| **VS glyph** | Red `#ff1800`, bbox (754,392)–(1118,640) @1080 |
| **Fighter names** | White text inside black band, left and right of VS glyph |
| **Duration** | ~1 second (t=3771.55–3772.55) |

### 8.14 FIGHT! Splash Overlay

| Property | Value |
|---|---|
| **Band position** | Identical to VS band — y 448–584 @1080 |
| **Band fill** | `#000000` (pure black, full-width) |
| **FIGHT! glyph** | Orange vertical gradient: `#ff6d00` (top) → `#ffb500` (bottom) |
| **Glyph bbox** | (824,492)–(1090,572) @1080 |
| **Duration** | ~0.2 seconds |

### 8.15 YOU WIN Card

| Property | Value |
|---|---|
| **Field** | Red `#990000` (RGB 153,0,0) — authored, byte-exact in lossless archive |
| **Field inset** | x 53–1865 @1920 (black pillars on left/right) |
| **Silhouette band** | Black, top edge y ≈ 894 @1080, with soft dark-red fade above |
| **Headline** | Brush-stroke calligraphic "YOU WIN" centered in upper area |

### 8.16 YOU WERE DEFEATED Card

| Property | Value |
|---|---|
| **Field** | Red `#990000` (same authored color as win card) |
| **Silhouette band** | Black, top edge y ≈ 894–906 @1080 (12px jitter across builds) |
| **Headline** | Brush-stroke splash text, dark interior `#220300`–`#2c0300` |
| **Button 1 (LEAVE AREA)** | Box x 814–1115, y 516–547 @1080; fill `#5c1200` |
| **Button 2 (FREE RESPAWN)** | Box x 814–1115, y 608–638 @1080; fill `#5c1200` (resting), `#921700` (hovered) |

### 8.17 World Map / Level Select Screen

| Property | Value |
|---|---|
| **Background** | Dark green `#18250b` |
| **Map terrain** | Muted palette: `#2d3f1f`, `#749487`, `#37403f` |
| **Parchment panels** | `#e2dac7` (scroll/paper texture) |
| **Frame/border** | Dark `#241b17`, `#1f1514` |
| **Location markers** | Orange/brown `#a25409`, `#8d4907` |
| **Green accent** | `#518929` (selectable elements) |

### 8.18 Shop / Upgrade UI

| Property | Value |
|---|---|
| **Background** | Dark `#241b17` frame |
| **Panel fill** | Parchment `#e2dac7` |
| **Panel border** | `#b7a273` (gold/tan) |
| **Button color** | Green `#518929` (purchase/upgrade) |
| **Item slots** | Dark recessed `#281c1b`, `#1f1514` |
| **Blue accent** | `#89a9b6`, `#6c94a4` (price/upgrade indicator) |

### 8.19 Element Visibility Matrix

| Element | Duel Mode | World Mode | VS Intro | FIGHT! | Win Card | Defeat Card |
|---|---|---|---|---|---|---|
| Bottom HUD bg | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Player HP bar | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Player Chi bar | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Focus strip | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Portrait ring | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Skill slots | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| AUTO SLASH plate | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Enemy nameplate (TR) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enemy overhead bar | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Coins | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Combo counter | transient | transient | ❌ | ❌ | ❌ | ❌ |
| VS band | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| FIGHT! band | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Win card | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Defeat card | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 8.20 Complete Color Palette Reference

| Element | Color (hex) | RGB |
|---|---|---|
| HUD background | `#16210a` | 22,33,10 |
| HP bar fill | `#02990b` | 2,153,11 |
| HP bar gradient | `#3ab55f` → `#009a03` | 58,181,95 → 0,154,3 |
| Chi bar fill | `#2e49e2` | 46,73,226 |
| Chi bar gradient | `#5272ea` → `#1b24cf` | 82,114,234 → 27,36,207 |
| Focus strip | `#eeeeee` | 238,238,238 |
| Portrait ring | `#950d00` | 149,13,0 |
| Skill slot interior | `#000000`–`#131313` | 0–19 |
| Skill slot border | `#313131` | 49,49,49 |
| AUTO SLASH plate | `#542c06` | 84,44,6 |
| AUTO SLASH text | `#e0d278`–`#fff7f1` | warm cream |
| Enemy nameplate | `#a30e00` | 163,14,0 |
| Enemy overhead bar | `#179b32` | 23,155,50 |
| Coins | `#ffc400` | 255,196,0 |
| VS glyph | `#ff1800` | 255,24,0 |
| FIGHT! glyph (top) | `#ff6d00` | 255,109,0 |
| FIGHT! glyph (bottom) | `#ffb500` | 255,181,0 |
| Win/Defeat card field | `#990000` | 153,0,0 |
| Combo counter text | `#c0ac4b` | 192,172,75 |
| Shop parchment | `#e2dac7` | 226,218,199 |
| Shop button | `#518929` | 81,137,41 |
| Map marker | `#a25409` | 162,84,9 |
| Dark panel bg | `#0d0e12` | 13,14,18 |
| Teal panel bg | `#0a1f21` | 10,31,33 |
| Teal panel accent | `#006590` | 0,101,144 |

### 8.21 Measurement Notes

- All pixel coordinates measured off **1920×1080 video frames** from video B (`Nr4fQstqHDM`), segment B-23 (VS-duel window), cross-validated against **lossless wiki PNGs** (A8.PNG for HUD, A5/A6/Wiki14 for result cards).
- Colors carry YouTube-codec headroom of ±20–26 per channel. The lossless archive PNGs are the source of truth for authored colors (`#990000` confirmed byte-exact).
- The **1024×576 target stage** uses normalized fractions directly — all positions transfer 1:1.
- Elements marked "not observed" (minimap, pause button, XP bar) are absent from all captured frames but may exist in the full game at states not captured.

---## 9. Procedural Art & Visual Style Guide

### 9.1 Overall Art Style

**Flat-color vector style with bold black outlines** — visually comparable to *Samurai Jack*'s minimalist aesthetic. Everything is constructed from Phaser `Graphics` primitives: filled circles, rectangles, ellipses, triangles, and stroked polylines. No bitmap assets, no spritesheets.

Visual hallmarks:
- **Flat fills** — no gradients on characters or environment objects (except sky background and HP/Chi bars)
- **Bold black outlines** — every shape drawn twice: first larger pass in `#030303`, then fill on top (~2–4px outline weight)
- **Limited palette** — ~40 named colors in `config/palette.ts`, desaturated and earthy
- **Stylized proportions** — chunky samurai (~120px tall at stage scale), oversized head, wide hakama, shallow conical kasa wider than shoulders
- **16:9 letterboxed stage** — 1024×576 (GAME_WIDTH × GAME_HEIGHT)

### 9.2 Color Palette (per element)

All hex values from `config/palette.ts`:

| Element | Color Name | Hex | Notes |
|---|---|---|---|
| **Sky** | `skyTop` | `#dae4f2` | Pastel blue, top of gradient |
| | `skyLow` | `#f2f5fc` | Near-white, bottom of gradient |
| **Blade trail** | `bladeChi` | `#6ec2ee` | Cyan-blue chi energy edge |
| **Forest (bright)** | `forestBright` | `#52b52f` | Brightest grass/canopy |
| **Forest (mid)** | `forestMid` | `#389f2b` | Main grass band |
| **Forest (shadow)** | `forestShadow` | `#257f2c` | Back bamboo, node lines |
| **Forest (dark)** | `forestDark` | `#183511` | Canopy ceiling, foreground shadow |
| **Sage** | `sage` | `#6b9a64` | Far mist mounds (50% alpha) |
| **Player gi** | `kimono` | `#f5f5ef` | White gi fabric |
| | `kimono2` | `#ecf0de` | Gi shade / head skin tone |
| **Player vest** | `haori` | `#2a3c66` | Dark blue haori/vest |
| **Enemy gi** | `haoriEnemy` | `#722031` | Dark maroon/crimson |
| **Hair** | `hair` | `#241f1b` | Near-black hair/topknot |
| **Straw hat** | `hatStraw` | `#c59d4c` | Warm golden straw |
| **Wood** | `wood` | `#7f4d05` | Katana hilt, kasa weave line |
| **Outline** | `outline` | `#030303` | Universal bold outline |
| **Blood** | `blood` | `#ad0000` | Blood base |
| | `bloodBright` | `#d11810` | Blood spray bright droplets |
| **Scarf** | `scarf` | `#d14a2b` | Vermilion scarf (player) |
| **HUD — HP** | `healthGreen` | `#02990b` | Player HP fill |
| **HUD — Chi** | `focusBlue` | `#2e49e2` | Player Chi fill |
| **Enemy HP** | `enemyGreen` | `#179b32` | Overhead enemy bar |
| **Portrait ring** | `ringRed` | `#950d00` | Portrait circle border |
| **Win/Defeat** | `winRed` | `#990000` | Result card field (byte-exact) |
| **VS glyph** | `vsRed` | `#ff1800` | Pure red VS brush glyph |
| **FIGHT! glyph** | `fightGradTop` | `#ff4700` | Orange-red gradient top |
| | `fightGradBottom` | `#ffdf00` | Yellow gradient bottom |
| **Gold/trim** | `gold` | `#f0ac33` | Shunpo sliver |
| | `goldTrim` | `#cfa948` | Button/button border |

### 9.3 Line Weight and Stroke Style

**Double-pass draw pattern throughout:**

1. **Outline pass** — shape drawn at slightly larger size in `COL.outline` (`#030303`)
2. **Fill pass** — same shape drawn on top at exact target size with fill color

Specific stroke weights:
- **Limbs**: outline width = `2 * r + 4`, fill width = `2 * r` (4px wider = 2px per side)
- **Polygons** (torso, hakama, scarf): `outlineW = 3` default, `outlineW = 2` for scarf
- **Katana blade**: outline `lineStyle(5, outline)`, bright edge `lineStyle(2.5, kimono)`
- **Katana hilt**: `lineStyle(4, wood)` wrapped section
- **Ground shadow**: no outline, semi-transparent ellipse (`alpha = 0.18`)
- **Eye**: 4×2 px black rectangle (no outline)
- **Nose**: 2px radius black circle

**No curved strokes** — everything is straight lines, circles, ellipses, triangles. The style deliberately avoids smooth Bezier curves.

### 9.4 Character Construction (Samurai Body)

**Joint-driven skeletal system** with 15 joints: `hat`, `head`, `neck`, `chest`, `pelvis`, `shoulderF`, `elbowF`, `handF`, `sword`, `hipF`, `kneeF`, `footF`, `hipB`, `kneeB`, `footB`

**Body parts (drawn back-to-front):**

1. **Ground shadow** — flat ellipse at feet, alpha 0.18, width tracks body spread
2. **Scarf** — flowing tapered ribbon off neck, 5 segments, 8px each, driven by velocity lag + sine flutter at 1.6Hz
3. **Back leg** — round-capped limb from kneeB to footB, radius 6px, foot: filled ellipse 15×6px
4. **Hakama** — trapezoid polygon: pelvis (±17px) → knees (±9px), center split line, fill = giShade
5. **Front leg** — same as back leg, drawn after hakama
6. **Torso** — capsule limb from chest (r=15) to pelvis, fill = gi (white). Two dark vest V-panels (triangles) overlaid
7. **Obi (belt)** — black rectangle 32×7px at pelvis, colored scarf-colored inset 30×5px, knot circle (r=4)
8. **Back arm** — limb from offset shoulder to offset hand, radius 6px, fill = gi
9. **Head** — circle r=13 (outline) / 11 (fill = skin tone). Eye: 4×2px black rect. Nose: 2px black circle
10. **Hat (kasa)** — wide shallow cone: triangle from (head.x-30, head.y-4) to (head.x+30, head.y-4) to apex (hat.x, hat.y-4). Outline triangle (60px base) + fill triangle (54px base) + ellipse brim (60×8). Weave line: 1px stroke at wood color, 60% alpha
11. **Katana** — blade from hand to sword joint: outline pass `lineStyle(5)`, bright edge `lineStyle(2.5)`. Wrapped hilt: `lineStyle(4, wood)` 11px behind hand. Tsuba: 4px radius black circle at hand
12. **Front arm** — shoulder→elbow (r=7), elbow→hand (r=6), fill = gi. Two grip hands: 3px radius black circles

**Player vs Enemy:**

| Property | Player | Enemy |
|---|---|---|
| Gi color | `kimono` (#f5f5ef white) | `haoriEnemy` (#722031 maroon) |
| Gi shade/vest | `haori` (#2a3c66 dark blue) | `bloodDark` (#8e0000 dark red) |
| Scarf | `scarf` (#d14a2b vermilion) | `cream` (#f2efc5 cream) |
| Hat | `hatStraw` (#c59d4c straw kasa) | Topknot + headband (no kasa) |

### 9.5 Background Layer Composition

| Layer | Y-range (stage px) | Depth | Elements | Colors |
|---|---|---|---|---|
| **Sky gradient** | 0–576 (full) | 0 (back) | Vertical gradient fill | `skyTop` → `skyLow` |
| **Far mist mounds** | ~330–470 | 1 | 5 large ellipses, 460×190–250px, 50% alpha | `sage` at 0.5 alpha |
| **Canopy ceiling** | 0–74 + scallops to ~114 | 2 | Dark bar 74px + 13 overlapping ellipses | `forestDark` at 0.92 alpha |
| **Back bamboo row** | 60–440 | 3 | 11 thin stalks, 12–22px wide, 380px tall, node lines every 62px | `forestShadow` at 0.85 alpha |
| **Mid grass mounds** | ~400–500 | 4 | 4 large ellipses, 340×130 | `forestBright` at 0.9 alpha |
| **Front bamboo row** | 60–440 | 5 | 7 bold stalks, 20–32px wide, node lines + leaves | `forestMid2` at full alpha |
| **Stone lanterns** | 382–436 | 6 | 2 lanterns at x=150, 560 — base rect 24×40, triangle roof, lit window 16×12 | `outline` + `kimono2` |
| **Grass band** | 436–576 | 7 (front) | Solid rect, bright top edge, dark foreground | `forestMid` main, `forestBright` 9px top, `forestDark` bottom 60px |

**Bamboo stalk construction (`drawBamboo`):**
- Outline rect: width `w + 4`, height 380
- Fill rect: width `w`
- Node lines: horizontal bars every 62px (y=100, 162, 224…), 4px tall, in `forestShadow`
- Leaf ellipses: two per stalk, 34×10 and 30×9

**Stone lantern construction:**
- Base: `fillRect(lx-12, 396, 24, 40)` in outline at 0.9 alpha
- Roof: `fillTriangle(lx-20, 400, lx+20, 400, lx, 382)` in outline
- Window: `fillRect(lx-8, 404, 16, 12)` in `kimono2` at 0.85 alpha

### 9.6 Weather / Atmosphere Effects

- **Mist/fog:** Far mist mounds layer — flat, non-animated haze (50% alpha `sage` ellipses). No particle system.
- **Low-HP red vignette:** When player HP < 50%, red border vignette ramps up (alpha 0–0.4) along all four screen edges, using `COL.blood`
- **Kill-beat flash:** Hard red full-screen flash (`COL.bloodDark` at 0.85 alpha) snaps in over 60ms, fades over 420ms. Combined with slow-mo at 0.35×.
- **No dynamic weather:** No rain, snow, or animated atmospheric particles. Scene variation through static palette swaps (day/night/dusk).
- **No letterbox during combat:** Original only letterboxes during VS intro transition, never during live combat.

### 9.7 Blood Spray Visual Style

**Kinematic droplets** — small filled circles with gravity physics:

- **Spawn:** Directional burst from impact point, cone-spread ±42° around slash direction
- **Count:** 9 droplets normal, 16 severed
- **Speed:** 60–240 px/s
- **Gravity:** 780 px/s² (semi-implicit Euler integration)
- **Lifetime:** 650ms
- **Rendering (per droplet):** Bright core `fillCircle(x, y, 3)` in `COL.bloodBright` + darker trailing drop `fillCircle(x - vx*0.008, y - vy*0.008, 2)` in `COL.blood` at 0.8× alpha
- **Persistent pools:** Land and persist with `poolSpreadRadius: 46`, `poolAlpha: 0.9`, spreading over 2600ms

**Frame-measured blood colors:** Dominant `#a00000`, secondary `#900000`/`#901000`, bright `#a01000`, desaturated/brown `#502000`

### 9.8 Slash Trail Visual Style

**Two distinct slash render paths:**

#### 1. Red Directional Stroke (SLASH_ARC)

The player's drawn slash input rendered as a **tapered red brush stroke**:
- **Body layer:** `COL.blood` (#ad0000) at `bodyHalfWidth: 26px`, alpha 0.3–0.35
- **Core layer:** `COL.bloodBright` (#d11810) at `coreHalfWidth: 11px`, alpha 0.7–0.8
- **Taper:** `taperPow: 1.6` — width peaks mid-stroke via `sin(πt)^1.6`, floors at `minTaper: 0.1`
- **Timing:** Hangs for 200ms at full alpha, then fades over 180ms
- `strokePinched` method renders each segment with width = `baseWidth × max(minTaper, sin(πt)^taperPow)` — thin at ends, fat in middle — mimicking brush calligraphy

#### 2. Blade Trail (Chi Energy)

On successful slash, a **two-layer energy trail** follows the katana path:
- **Edge layer:** `COL.bladeChi` (#6ec2ee cyan-blue) at `BLADE_EDGE_WIDTH: 13px`
- **Core layer:** `COL.kimono` (#f5f5ef white) at `BLADE_CORE_WIDTH: 7px`
- **Taper:** Linear (`taperPow: 1`), `minTaper: 0.12`
- **Fade:** 200ms lifetime, linear alpha fade

### 9.9 UI / Parchment Visual Style

#### Bottom-Left HUD Stack

1. **Portrait ring:** circle r=37 (outline) → r=35.5 (`ringRed`) → r=27.5 (`kimono2` skin). Mini kasa triangle on top.
2. **Three stacked bars** (x=131, len=142px each):
   - HP: backing `barBrown`, fill = 9-row vertical gradient `#3ab55f` → `#009a03`
   - Chi: backing `barBrown`, fill = 8-row gradient `#5272ea` → `#1b24cf`
   - Focus pill: backing `barBrown`, fill = 9-row gradient `#f2f2f2` → `#e3e3e3`
3. **Fraction labels:** "14/30"-style in Georgia bold 15px, white, black stroke 3px
4. **Shunpo sliver:** 40px max, white at 0.9 alpha
5. **Critical sliver:** 40px max, gold at 0.9 alpha
6. **Stance label:** Georgia bold 13px, cream, black stroke

#### Skill Slots (bottom-right)

3 rounded rectangles, 58×60px, at x=770/843.5/917, y=510:
- Border: `COL.slotGrey` (#313131), `fillRoundedRect` radius 8
- Interior: `COL.slotDark` (#0d0d0d), radius 6
- Cooldown overlay: black at 0.65 alpha, shrinking from top
- Unaffordable overlay: black at 0.45 alpha
- Slot numerals: Georgia bold 15px, cream

#### VS / FIGHT! Intro

- Full-width black band: rows 239–311 (73px tall)
- VS glyph: original brush-stroke polygons in `COL.vsRed` (#ff1800), black shadow offset (+5, +7)
- FIGHT! glyph: bar-rect unions in 1px gradient strips, `#ff4700` → `#ffdf00` vertical gradient
- Name text: Georgia bold 26px — player gold `#f4be09`, enemy white, both with black stroke 4px
- Face busts: head circle (r=17, `kimono2`), eye dot toward foe, kasa triangle (player) or topknot + headband (enemy)

#### Result Cards (Win / Defeat)

- Base: full-screen black
- Red field: `COL.winRed` (#990000) inset rect, x=28 to 995, full height
- Tableau band: black from y=477 to bottom, silhouette ellipses + kneeling victor triangle
- YOU WIN banner: ink-splatter template (dark red ellipse backing + red ellipse + 14 satellite droplets), Georgia bold italic 64px cream, black stroke 8px
- YOU WERE DEFEATED: dark brush splash (`splashDark` #220300), Georgia bold italic 48px in `#990000` with white stroke 4px
- Buttons: gold-trim border, maroon fill (`btnMaroon` #5c1200), Georgia bold 14px white text

### 9.10 Font System

All text uses **Georgia** (with `"Times New Roman", serif` fallback) — bold style with **black stroke** (`#040304`) at 3–8px thickness. Key text uses **bold italic** for dramatic beats (combo numbers, banners, headlines).

### 9.11 Projectile Visual Style (Kunai)

- **Body:** `lineStyle(3, outline)` line from `pos - vel_normalized*14` to `pos`
- **Head:** `fillCircle(pos, 2.5)` in `COL.kimono` (white)

### 9.12 Enemy Telegraph Aura

- **Strike telegraph:** Pulsing red ellipse (`COL.blood`) at enemy feet, 120×40px, alpha 0.3–0.6 via `abs(sin(fxNow/90))`
- **Stance-change telegraph:** Same shape but `COL.focusBlue` (#2e49e2)
- **Guard/block:** No aura, enemy pose blends to `GUARD_POSE`

### 9.13 Summary of Vector Reproduction Principles

1. **Everything is a Graphics primitive** — `fillCircle`, `fillRect`, `fillEllipse`, `fillTriangle`, `fillPoints`, `lineStyle + strokePath`. No bitmaps.
2. **Double-pass outline** — draw shape once oversized in `#030303`, then again at target size with fill color. Most important technique.
3. **Flat colors only** — no gradients on characters/objects (except sky and bar fills). "Shading" = darker adjacent shapes.
4. **Angular geometry** — circles for heads/joints, triangles for hats, rectangles for bars, ellipses for shadows. No Bezier curves.
5. **Joint-driven posing** — 15 joints interpolated between keyframe poses, per-stance arc scaling for slash reach.
6. **Procedural jitter** — deterministic pseudo-random offsets for natural-looking placement.
7. **Layered depth via alpha** — far layers 0.5–0.85, near layers 1.0. No true parallax scroll (static arena), but layer ordering creates depth.
8. **Measured fidelity** — all HUD geometry, result card positions, key colors frame-measured from 1920×1080 reference frames ÷ 1.875.

---## 10. Audio & SFX Design

> **Evidence tier disclosure:** The original game's audio was **never captured** — the 61-segment video study explicitly states "all findings are frame-visual only (no audio evidence)." No web source, wiki page, patch note, or decompiled reference describes the original's SFX synthesis parameters. The codebase has **zero audio implementation** — audio is Stage 6 (POLISH). What follows combines: (1) what the MASTER_SPEC and SimEvent system **require** (CONTRACT grade), (2) what the timing/animation config **constrains** (MEASURED grade), and (3) **INFERRED** WebAudio synthesis parameters — design recommendations, not verified original values.

### 10.1 Architecture

| Aspect | Detail | Grade |
|---|---|---|
| Engine | WebAudio API — `AudioContext`, `OscillatorNode`, `GainNode`, `BufferSource` (for noise) — no audio files | CONTRACT (spec) |
| Routing | Each SFX = oscillator(s) → gain envelope → master bus → destination | INFERRED |
| Trigger pipeline | `Sim.advance()` emits `SimEvent[]` → `DuelScene.update()` drains events → maps event type → calls `playSfx(name)` | CONTRACT |
| Timing base | 60Hz fixed-step Sim; SFX fire on the frame the event is drained | CONTRACT |
| Music | Separate menu/exploring bed vs. combat bed; WebAudio-synthesized | CONTRACT (spec tell #27) |

### 10.2 SimEvent → SFX Trigger Map

| SimEvent type | SFX triggered |
|---|---|
| `fightStarted` | Duel intro sting / FIGHT! cue |
| `fightEnded` (winner: 'player') | Victory sting |
| `fightEnded` (winner: 'enemy') | Defeat sting |
| `damage` (target: 'enemy', crit: false) | Slash hit flesh |
| `damage` (target: 'enemy', crit: true) | Slash hit flesh (crit variant, pitch up) |
| `damage` (target: 'player') | Slash hit flesh (player hurt) |
| `strikeBlocked` | Slash hit armor/block |
| `strikeEvaded` | Slash whiff |
| `invulnBlocked` | Deflect/invuln ping |
| `skillUsed` (verb: 'chiPunch') | Chi punch SFX |
| `skillUsed` (verb: 'smokeBomb') | Smoke bomb SFX |
| `skillUsed` (verb: 'stab') | Stab/deflect SFX |
| `kunaiThrown` | Kunai throw SFX |
| `kunaiDeflected` | Deflect success ping |
| `shunpoStarted` | Slow-mo whoosh enter |
| `shunpoEnded` | Slow-mo whoosh exit |

### 10.3 Sound Effect Catalogue

All synthesis parameters below are **INFERRED** — design recommendations for WebAudio implementation matching the game's feel.

#### 1. Slash Draw (sword unsheath / swing start)

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Filtered noise burst (white noise → bandpass) | Steel-on-air "shwoosh" |
| Filter | Bandpass, center ~2000 Hz, Q ~1.2 | Air-cutting hiss band |
| Envelope | A: 0.005s · D: 0.04s · S: 0.0 · R: 0.02s | ~65ms matching 4-frame windup |
| Volume | 0.25 | Subtle — quietest of the 4 slash SFX |
| Stance variation | Light: 2400 Hz · Heavy: 1600 Hz | Heavy sounds different from light (spec tell #28) |

#### 2. Slash Whiff (miss / evaded)

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Filtered noise (white noise → highpass) | Empty "whoosh" — no impact |
| Filter | Highpass ~800 Hz, gentle 12dB/oct | Keeps airy hiss |
| Envelope | A: 0.01s · D: 0.08s · S: 0.0 · R: 0.04s | ~130ms — full swing arc |
| Volume | 0.20 | Quieter than a hit |
| Stance variation | Light: ~90ms · Heavy: ~160ms | Heavy recovery is 12f vs light's 4f |

#### 3. Slash Hit Flesh (damage landed)

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Layered: square-wave body + noise transient | Square = chunky impact; noise = flesh-tear surface |
| Layer 1 (body) | Square, 180 Hz, A: 0.001s · D: 0.06s · R: 0.03s | The "thwack" |
| Layer 2 (tear) | White noise → bandpass 400 Hz, Q 0.7, A: 0.001s · D: 0.04s · R: 0.02s | The flesh-rip texture |
| Crit variant | Body freq up to 280 Hz | Crit (×1.3) gets brighter, sharper sting |
| Volume | 0.45 (body) + 0.30 (tear) | Loudest slash SFX — hits must feel impactful |
| Stance variation | Light: 220 Hz, 50ms decay · Heavy: 140 Hz, 90ms decay | Heavy = weightier; light = snappy |

#### 4. Slash Hit Armor / Block

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Layered: triangle-wave "clang" + noise transient | Triangle = metallic ring; noise = impact scratch |
| Layer 1 (clang) | Triangle, 520 Hz, A: 0.001s · D: 0.12s · R: 0.08s | Longer decay than flesh |
| Layer 2 (impact) | White noise → highpass 1500 Hz, A: 0.001s · D: 0.02s · R: 0.01s | Initial "clack" |
| Volume | 0.40 (clang) + 0.25 (impact) | Slightly quieter than flesh |

#### 5. Chi Punch

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine wave frequency sweep (descending) | "Energy" projection — pure tone sweep reads as chi/ki |
| Sweep | 880 Hz → 220 Hz over 0.15s (exponential) | High "charge" → low "release" |
| Envelope | A: 0.01s · D: 0.12s · S: 0.0 · R: 0.04s | ~170ms |
| Volume | 0.35 | Distinct from slash SFX — chi is "cleaner" |

#### 6. Smoke Bomb

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Filtered noise burst (white noise → lowpass sweeping down) | "Poof" — smoke expansion |
| Filter | Lowpass sweep: 3000 Hz → 200 Hz over 0.2s, Q 0.5 | Hiss collapses into muffled cloud |
| Envelope | A: 0.003s · D: 0.15s · S: 0.0 · R: 0.08s | ~230ms |
| Volume | 0.35 | Audible "escape" cue |

#### 7. Stab / Deflect

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sawtooth, very short | Sharp, aggressive — sawtooth reads as "piercing" |
| Envelope | A: 0.001s · D: 0.03s · S: 0.0 · R: 0.01s | ~40ms — shortest combat SFX |
| Frequency | 660 Hz → 880 Hz upward sweep (0.03s) | Rising pitch = forward thrust |
| Volume | 0.30 | — |

**Deflect success** (`kunaiDeflected`): Triangle, 1200 Hz, single ping, ~80ms, volume 0.35 — metallic "tink"

#### 8. Kunai Throw

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Square + noise transient | "Thunk" of thrown blade |
| Layer 1 | Square, 300 Hz → 150 Hz sweep over 0.06s | Throwing motion |
| Layer 2 | White noise → bandpass 2000 Hz, A: 0.001s · D: 0.02s · R: 0.01s | Release "fwip" |
| Volume | 0.30 | — |

#### 9. Jump

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine, ascending sweep | Light, airy |
| Sweep | 200 Hz → 500 Hz over 0.08s | Rising pitch = upward motion |
| Envelope | A: 0.005s · D: 0.06s · S: 0.0 · R: 0.03s | ~95ms |
| Volume | 0.20 | Subtle — utility movement |

#### 10. Landing

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Triangle + noise transient | Soft "thud" |
| Layer 1 | Triangle, 120 Hz, A: 0.001s · D: 0.04s · R: 0.02s | Low body — impact |
| Layer 2 | White noise → lowpass 600 Hz, A: 0.001s · D: 0.03s · R: 0.02s | Dust-scatter surface |
| Volume | 0.20 | Matching jump volume |

#### 11. Level-Up Sting

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine arpeggio (3 notes) | Positive, bright, rewarding |
| Notes | 523 Hz (C5) → 659 Hz (E5) → 784 Hz (G5), each 80ms | Major triad ascending |
| Envelope (per note) | A: 0.01s · D: 0.05s · S: 0.3 · R: 0.03s | Each note rings briefly |
| Volume | 0.40 | Celebration moment |

#### 12. Victory Sting

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine + triangle layer | Triumphant but minimal |
| Layer 1 (root) | Sine, 440 Hz (A4), 0.2s hold | Anchor tone |
| Layer 2 (fifth) | Triangle, 660 Hz (E5), enters at 0.08s, 0.15s hold | Adds warmth |
| Envelope | A: 0.02s · D: 0.1s · S: 0.6 · R: 0.2s | ~420ms matching `FINISHER_FLASH.durationMs` |
| Volume | 0.45 | Loudest SFX — climax of a duel |

#### 13. Defeat Sting

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine, descending sweep | Somber, final |
| Sweep | 330 Hz (E4) → 110 Hz (A2) over 0.4s (exponential) | Falling pitch = defeat |
| Envelope | A: 0.03s · D: 0.15s · S: 0.4 · R: 0.25s | Longer, more drawn-out than victory |
| Volume | 0.40 | Not louder than victory |

#### 14. Menu Click

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Square, single blip | Retro-Flash-era UI feedback |
| Frequency | 880 Hz (confirm) / 660 Hz (cancel) | Two-tone system |
| Envelope | A: 0.001s · D: 0.02s · S: 0.0 · R: 0.01s | ~30ms — shortest UI sound |
| Volume | 0.25 | Present but not intrusive |

#### 15. UI Hover

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine, single tick | Soft, non-clicky |
| Frequency | 1320 Hz (E6) | Higher than click |
| Envelope | A: 0.005s · D: 0.01s · S: 0.0 · R: 0.005s | ~20ms — barely a sound |
| Volume | 0.10 | Very quiet — hover fires often |

#### 16. Haiku Card Reveal

| Parameter | Value | Rationale |
|---|---|---|
| Waveform | Sine, slow swell | Meditative, contemplative |
| Frequency | 220 Hz → 277 Hz over 0.5s | Slow, breathing tone |
| Envelope | A: 0.2s · D: 0.0 · S: 0.7 · R: 0.5s | ~1.2s total |
| Volume | 0.20 | Quiet and atmospheric |

### 10.4 Music Beds (INFERRED)

#### Menu / Exploration Bed
- Style: Slow pentatonic loop (sine + triangle drones)
- Base drone: Sine, 146 Hz (D3) + 220 Hz (A3), slow amplitude LFO (0.2 Hz)
- Melody: Triangle, pentatonic notes, sparse (1 note every 2–4s)
- Volume: 0.15

#### Combat Bed
- Style: Tense drone + rhythmic pulse
- Base drone: Sawtooth, 110 Hz (A2), lowpass 400 Hz, slow LFO (0.5 Hz)
- Pulse: Square, 55 Hz (A1), 8th-note pulse at ~100 BPM
- Tension: Noise → bandpass 300 Hz, amplitude LFO synced to pulse
- Volume: 0.12
- Transition: Crossfade 300ms entering/leaving combat

### 10.5 Stance Tone Differentiation

| Stance | Slash Draw | Slash Whiff | Slash Hit Flesh | Slash Hit Armor |
|---|---|---|---|---|
| **Light** | Bright (2400 Hz) | Short (90ms) | High pitch (220 Hz), snappy (50ms) | Higher clang (600 Hz) |
| **Balanced** | Mid (2000 Hz) | Medium (130ms) | Mid pitch (180 Hz), standard (70ms) | Standard clang (520 Hz) |
| **Heavy** | Dark (1600 Hz) | Long (160ms) | Low pitch (140 Hz), weighty (90ms) | Lower clang (440 Hz) |

Rationale: Heavy has 12 recovery frames vs light's 4, so heavy SFX should feel slower/weightier — lower frequencies, longer decays. Light is fast/snappy — higher frequencies, shorter decays.

### 10.6 What We Don't Know (Audio Gaps)

1. **Original game's actual frequencies, waveforms, envelopes** — no audio evidence exists
2. **Whether the original used WebAudio** — it was Flash (died Jan 2021). Flash used its own audio engine with MP3/PCM samples. "WebAudio-synthesized SFX only" is our recreation's spec, not the original's tech
3. **Music composition** — no source describes the original's soundtrack
4. **Exact SFX-to-frame timing** — inferred from `SLASH_FRAMES` config
5. **Haiku card sound** — no video evidence; inferred from contemplative visual aesthetic

---## 11. Gaps, Unknowns & Self-Critique

### 11.1 Known Unknowns (What We Cannot Verify)

#### Audio
- **All audio parameters are INFERRED.** The video study has no audio track. No wiki, patch note, or developer interview describes the original's SFX synthesis. The original was a Flash game and likely used pre-rendered MP3/PCM samples, not live synthesis. Our "WebAudio-synthesized SFX only" mandate is a recreation constraint, not an original-tech description.

#### Title Screen & Shop/Upgrade Layout
- **Not directly captured** in walkthrough videos (which begin mid-gameplay). Layouts inferred from IndieDB promo screenshots and Flash RPG conventions of the era. The specific button positions, tab structure, and item grid layout are assumptions.

#### Minimap, Pause Button, XP Bar
- **Not observed** in any available reference frame. These elements may exist in the full game at states not captured in the reference material, or they may not exist at all in the game's HUD.

#### Original's Exact Gesture Sector Boundaries
- The gesture **map** is video-confirmed (horizontal=slash, up=jump, down=stab, short-up-flick=launch), but the exact sector boundaries (±45° from horizontal) are **not observable on film**. The `GESTURE_DIAG_DEG = 45°` and `LAUNCH_FLICK_MAX_LEN = 90` are inferred tuning seeds.

#### Skill Chi Costs & Regen Rates
- **Not observable on film.** All Chi costs (Chi Punch: 30, Smoke Bomb: 25, Stab: 10) and the passive regen rate (4/sec) are **inferred tuning seeds** for the 100-point meter family. No frame-backed reads of these values exist.

#### Shunpo Mechanics
- Shunpo exists by name as the Light stance L10 ultimate [CONTRACT], but **no source describes the hold-key slow-mo draining a meter** — that part is the recreation's interpretation. No Duels footage shows Shunpo being used.

#### Boss HP Persistence Across Retries
- **Contradictory video evidence**: A-11 observed Bandit Leader's HP bar NOT resetting (still ~95% after player death), but A-23 showed full HP/CHI reset on new FIGHT! instance. Flagged as unresolved. Current default is full reset (simpler).

#### Multi-Enemy AI Coordination
- Video study at 0.4 fps sampling could not isolate coordination patterns. Enemies appear to attack independently with no flanking, surround, or turn-based coordination, but this may be a sampling limitation rather than a confirmed design.

### 11.2 Contradictions Resolved

| Contradiction | Resolution | Source |
|---|---|---|
| Crit multiplier 3× vs 1.3× | **1.3×** (Fandom Stances page; older 2014 tips page claimed 3×; changed across versions) | [CONTRACT] |
| Max dan rank 5 vs 10 | **10** (spec's own `tenthGold` payout corroborates) | [CONTRACT] |
| Rebirth "+10 Attack" vs "+10 elemental skill points" | **+10 elemental skill points** (video A-17 Rebirth Scroll text confirms) | [CONTRACT] |
| Three clans vs four | **Four** (Aka Ryu, Midori Ken, Aoi Hoiru, Ki Sensu; Shira Tancho is story-only neutral) | [CONTRACT] |
| Heavy defense penalty: DEF ×0.8 vs damageTakenMult 1.25 | **Apply ONE, never both** (double-counting overshoots the original) | [CONTRACT] |
| Coins per kill: +5 vs +8 | **+8** (verified) | [CONTRACT] |
| In-combat stance switching: Focus-gated vs hard-lock | Original **hard-locks** ("CANNOT CHANGE STANCE"); recreation implements Focus-gated switching as an inferred design decision | [CONTRACT/CONTRADICTION] |

### 11.3 Evidence Grade Summary

| Category | Count | Notes |
|---|---|---|
| **CONTRACT** (verified from original) | ~35 values | Stance triangle, damage formulas, crit mult (1.3×), skill damage, XP thresholds, stance mastery tables, gesture map, skill unlock levels, heavy defense penalty, kill rewards, boss conventions |
| **MEASURED** (frame-counted from video) | ~12 values | Slash frame data (windup/active/recovery per stance), hit stagger (12f), death animation (20f/333ms), animation pose rate (15fps), walk stride, knockback distance, hit tint duration, fighter proportions |
| **INFERRED** (tuned seeds, adjustable) | ~40+ values | All Chi costs, all Focus meter values, all Shunpo values, deflect window/radius, counter bonus (×1.25), combo chain gap (3s), smoke bomb distance/i-frames, projectile damage/speed, AI tier parameters, base fighter stats, all audio synthesis parameters |

### 11.4 Self-Critique — Weaknesses of This Document

1. **Audio section is entirely speculative.** It documents what the spec *requires* and what standard samurai-combat SFX design *suggests*, but none of the synthesis parameters come from the original game. This is honest about its limitations but should not be treated as ground truth.

2. **Title screen, shop, and detailed main menu layouts are inferred.** The walkthrough videos begin mid-gameplay. The specific UI layouts for these screens are reconstructed from genre conventions and partial wiki screenshots, not direct observation.

3. **The 0.4 fps video sampling limits behavioral precision.** Enemy AI spacing, multi-enemy coordination, and subtle animation details (like enemy approach patterns) could not be isolated at this sampling rate. The codebase's AI implementation is parameterized to *feel* right, not to match frame-verified original behavior.

4. **The recreation's Focus-gated in-combat stance switching contradicts the original's hard-lock.** This is a known, documented contradiction. The recreation chose to implement Focus-gating as an inferred design decision matching the Critical Evade skill's "when your Focus Bar is full" language — but the original video evidence shows a hard lock.

5. **XP curve beyond Level 10 is extrapolated.** The delta grows by +500 per level, but this is an inference from the L1–L10 pattern, not verified for L11–L80.

6. **PvP-specific mechanics are poorly documented.** The game was an MMORPG with real-time PvP, but the reference videos are primarily PvE. PvP matchmaking, tournament brackets, and clan war real-time combat are documented from portal descriptions, not direct observation.

7. **Equipment/item stats are not documented.** The shop and equipment system exist (9-slot paperdoll, rarity tiers, comparison UX) but no item stats, prices, or specific equipment effects were captured.

8. **The "special area" (blue portal zone) is unidentified.** The blue-toned video segment could be an underwater cave, sky realm, or portal — its exact in-game identity is not confirmed.

### 11.5 Source Materials Reference

| Source | Type | Details |
|---|---|---|
| **Nr4fQstqHDM** (Video B) | YouTube longplay | 30+ segments, 1302 frames at 1024×576 |
| **zFtCaTO0_1M** (Video A) | YouTube longplay | 31+ segments, 1373 frames at 1024×576 |
| Fandom Wiki | Web | 74 articles, 178 images (page fetches 403, API works) |
| IndieDB | Web | Developer info, 800×480 native res, Flash engine |
| Kongregate | Web | Delisted, confirmed LutGames developer |
| Snokido | Web | 288k plays, 93% rating, game descriptions |
| Miniplay | Web | Game descriptions, controls |
| SilverGames | Web | 4.2/5, 414 votes, survival mode info |
| Freelancer Portfolio | Web | Developer portfolio with game features |
| Archived Official Wiki | Wayback | 2014–2020 captures (domain dead) |
| Codebase Research | Files | `docs/research/`, `src/config/`, `src/core/` |
| Lossless Wiki PNGs | Images | A5-A8, Wiki5, Wiki12-16, Aaa, Aaaa, Death01-06 |

---

*End of Master Reference Document. Generated 2026-07-17 by Clawdia synthesizing 10 parallel research subagents covering: game structure, screen flow, combat mechanics, enemy AI, animation states, movement physics, fighter proportions, UI/UX inventory, procedural art style, and audio/SFX design.*