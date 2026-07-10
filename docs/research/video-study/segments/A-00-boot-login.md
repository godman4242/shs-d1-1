# A-00 Boot, login, intro, tutorial fight, first systems (0:00–2:57)

Source: video A (`zFtCaTO0_1M`), frames 1–60 at 3s spacing, 1024px.
Frames on disk: `reference/frames/zFtCaTO0_1M/seg-00/frames/` (gitignored — exact
pixel reference; these notes are the committed distillation).

## Screens & layout

**LOGIN PAGE (t=0:00 — the very first frame).** Full daytime bamboo-forest scene as
background (parallax layers: pale sky, dark tree mass, bright bamboo stalks, green
mounds, stone lanterns, grass strip). Player character stands bottom-left in idle.
- Top-left: black banner, white brush caps "STRAW HAT SAMURAI"; beneath it a huge
  red brush-stroke "DUELS" (drips/rough edges).
- Right column: label "USERNAME/EMAIL" + white input; label "PASSWORD" + white
  input; below them two dark-red gold-trim buttons: "REGISTER", "LOGIN".
- Bottom-left: language selector (US-flag icon, "English", dropdown chevron on red
  tab); beneath it a "PLAY AS GUEST" dark-red button.
- Next to it: standard blue "Login with Facebook" button (f-logo).
- Bottom-right: Explosive Barrel logo (red barrel) + **version tag `v0.717`** —
  NEWER than the v0.715 patch notes our web research found. This longplay (Mar
  2020) is near-final-state evidence; prefer it over older wiki claims on conflict.

**LOADING SCREEN (t=0:03).** Same forest art but dimmed/darkened; centered logo
("STRAW HAT SAMURAI" white, "DUELS" red brush); "LOADING..." in white brush caps
below; bottom-center TIP line in white caps, e.g. a tip that your location is only
saved at special places like towns and dungeons → loading screens carry rotating
gameplay tips.

**Guest-mode modal (t=0:06).** Gold-corner parchment frame on black: warning that
progress isn't saved in guest mode; single red "OK" button. (Ornate frame style =
same family as dialogue/results frames — one reusable component.)

**Intro cinematic (t=0:09–0:36).** Full-screen dark-red sky over black ground
silhouettes; a lone armored samurai silhouette (spiky topknot, sword) stands right
of center; story text in white brush caps scrolls slowly upward like film credits;
skip/advance ▶ arrow bottom-right. Story content (paraphrased): Lord Masahiro,
daimyo of the Shira Tancho, has ruled as Shogun for five years of hard-won peace;
trouble gathers at the empire's edge. The player — on a musha-shugyō pilgrimage —
travels east under their sensei's instruction to find a man named Hiroshi, unaware
destiny has bigger plans. Framing: many know the legend of the Straw Hat Samurai,
but he wasn't the first — this is the tale of those who came before (the game is a
PREQUEL to SHS 1/2).

**Episode title cards (t=0:39–0:42).** Plain white screen, black brush text:
1) "PROLOGUE" alone; 2) a three-line haiku (theme: alone on fate's road, the sword
writes one's fortune, the future is its slate) with a rough black brush-stroke
swash beneath. Confirms spec's 3-line haiku cards, black-on-white.

**Gameplay HUD (t=0:45 onward).** Matches fidelity tell #23 exactly:
- Top-left: coin icon + count ("100 COINS" at guest start).
- Under it: location banner, gold caps on black gold-trimmed plate ("W KASUTA
  FOREST"), then "STORY QUEST: <objective>" line in white caps.
- Top-center (guest only): red "REGISTER" button + "TO SAVE YOUR PROGRESS AND PLAY
  ONLINE!" caption.
- Top-right: fan-shaped level badge (number inside) + gold XP bar "<cur> / <next>
  EXPERIENCE POINTS". **L1→L2 = 550 XP; later cumulative display `787 / 1450` with
  "NEXT LEVEL 663 XP"** → thresholds are cumulative; 1450−787=663.
- Under XP: MINIMAP — dark panel, gold ornate corners, 6×6 grid (cols 0–5, rows
  0–5), compass letters on edges (N/E/S/W), building glyphs (gate/arch icons), an
  X mark, player as small arrow marker; "!" marks objective (tutorial says the
  exclamation mark shows where to go). Below: "TERRITORY (21,51)" and "SECTOR
  (r,c)" — sector advances as you cross zones (0,3 → 1,3 → 2,3 observed).
- Bottom-left: round portrait medallion (character face) under a large straw-hat
  arc; right of it two thin bars: green HP "10 / 10" over blue CHI "10 / 10";
  caption "BALANCED STANCE"; after earning stat points a red "+" chip appears.
- Bottom bar icons (L→R): chat bubble · brown cushion (inventory) · yin-yang
  (skills) · workbench (forge/craft) · scroll (QUEST LOG — tutorial arrow labels
  it) · stone/pouch (WAR ROOM — tutorial label visible) · dark ninja silhouette ·
  gear (settings), all on a grey ribbon strip.
- Zone exits: wooden signpost at screen edge with direction letter ("W"/"E") +
  floating label "W KASUTA FOREST (E)" + bouncing gold arrow above the player when
  near.
- Ambient wildlife: a deer grazes and flees; a black bird (later implied to be
  Hiroshi's companion "Kinme") flies through.

**Dialogue system.** Bottom-anchored parchment box (dark brown, thin gold rules,
ornate gold corners), white brush-caps text; name plate is a black banner overlapping
the box's top-left corner ("JINBEI", "GUEST", "HIROSHI"); the SPEAKER's full-body
art slides in on the right side (Jinbei: muscular bandit, torn brown vest, blue
sash, katana over shoulder; Hiroshi: older bearded man, brown haori over bare
torso, naginata). Player choices render as stacked full-width rows inside the box;
the hovered/active row highlights RED. Advance arrow ▶ bottom-right. Pre-dialogue
ambient speech uses comic-style grey speech bubbles in-world above NPCs.

**Combat UI (first duel, t=1:18).** Battle runs in a letterboxed strip (black bars
top/bottom). Big red-orange brush "FIGHT!" splash. Tutorial overlay: "DRAW A LINE
TO SLASH" with a dashed red demo line through the enemy. Top-left toggle "AUTO
SLASH OFF"; top-right pause (⏸). Bottom-left portrait + HP/CHI bars + "CANNOT
CHANGE STANCE" (stance locked during tutorial). Bottom-right: three dark skill
slot boxes + a gold up-arrow button with a small count "3" (jump/launch charges?
— verify in dense pass). Enemies have green HP bars overhead; named elites show
"NAME (level)" e.g. "JINBEI (3)".

**Combo counter.** Top-right during combat: big red brush number + black "HIT
COMBO" plate ("1", "2", "5" observed escalating within one brawl).

**Kill beat & victory.** On fight end: full-screen flat RED background with black
silhouettes (fallen bodies, victor pose) — then "YOU WIN" in white-outlined red
brush caps with black ink splatter. Second fight's win screen shows BOTH player
and ally Hiroshi silhouettes walking off over a pile of defeated bodies. Then a
gold-frame results modal: "YOU RECEIVED" + coin icon count + "XP" count + OK.
Observed: fight 1 (3 bandits) → 2 coins, 53 XP; fight 2 (bandit mob + Jinbei L3,
with ally) → 12 coins, 444 XP.

**Level-up modal.** Gold frame, crossed-katanas crest on top: "YOU ACHIEVED /
LEVEL 2" (red brush), rows "STAT POINTS +3", "SKILL POINTS +1", "NEXT LEVEL 663
XP", OK. Tutorial text after: stat/skill points improve your character.
→ +3 stat/+1 SP per level CONFIRMED visually (matches research + spec).

**PLAYER screen (character sheet).** Dark parchment full-screen, red ✕ top-right:
- Header: "PLAYER"; red "STATS" tab button; currency row "114 COINS", "3 GOLD"
  (guest starts with 3 gold); level fan + XP bar; "AVAILABLE STAT POINTS: N".
- Left: paper-doll with equipment slots around the character render — hat (straw
  hat), mask (empty; oni-mask ghost), top (grey gi), gloves (empty), pants
  (white), weapon (**a tree branch** — starting weapon confirmed), feet
  (sandals), 2 accessory ovals (empty).
- Middle: HP (green), CHI (blue), AP (pale blue, "30 / 30") bars each with red
  [+] button. AP = third resource (verify use — likely skill/action points in
  combat or War Room).
- Right: ATK / DEF / SPD numbers with [+]; gear bonus shown as gold "+N" beside
  base (DEF "1 + 2" from starting clothes). "WEIGHT: 14 / 100" under stats —
  equipment weight budget system.
- Tutorial gold arrows guide "ADD-HP" → "ADD-DEFENSE". One HP point took max HP
  10→20 (=+10 max HP per point?). ATK 1→4 and DEF 1→4 across the sequence —
  exact per-click costs ambiguous at 3s sampling; dense re-scan queued.

**QUESTS screen.** "QUESTS" title; left column = chapter buttons ("PROLOGUE");
right panel: "OBJECTIVE" (e.g. meet Hiroshi outside his hut, "(RECOMMENDED
LEVEL: 3)"), "LOCATION" (zone + territory/sector coords), red "TAKE ME THERE"
button with gold-coin cost **5** (paid fast-travel!), "REWARD: 200 XP"; gold
count top-right.

## Mechanics observed
- Gesture combat from literally the first fight: draw line → slash; dashed-line
  tutorial demo; auto-slash assist toggle exists (default OFF label).
- Stance locked during tutorial ("CANNOT CHANGE STANCE") — stance system gated.
- Combo counter escalates per consecutive hit within a brawl.
- Multi-foe brawls (PvE): one player + ally vs ~8 peasants + named leader; foes
  have individual HP bars; blood sprays directionally and STAINS scenery (red
  marks persist on bushes/mounds).
- Thrown weapons: a bandit hurls a hammer/club mid-fight (projectile PvE).
- Named elite format "JINBEI (3)" = name + level.
- Rewards: coins + XP per encounter (not obviously 10 XP/foe-level — 53 XP for 3
  cannon-fodder bandits, 444 XP for the mob fight; foe level/HP scaling likely.
  → keep spec's KILL_REWARD as INFERRED, revisit at Stage 3 with more samples).
- Level-up: +3 stat, +1 skill point (modal); XP thresholds 550 then 663 (curve
  grows ~20%/level? need more points).
- Stats: HP/CHI/AP pools; ATK/DEF/SPD attributes; gear grants +N bonuses; weight
  budget 14/100 with starting kit.
- Fast travel costs 5 gold via quest log; guest starts 100 coins / 3 gold.
- Zone system: named zones (W Kasuta Forest) on a territory/sector grid; minimap
  6×6 with buildings and objective "!".

## Story/dialogue (own words)
Prologue: Shira Tancho daimyo Masahiro = Shogun, 5 years of fragile peace. The
player (a Shugyosha with a branch-tier loadout, guest-named) treks east per their
sensei's dying wish to find Hiroshi. On the forest road, bandit king **Jinbei**
and goons demand half your belongings as an "escort fee"; player picks a defiant
reply (dialogue choices exist but tone-flavored, likely not branching outcomes);
first fight vs 3 bandits. Jinbei is unimpressed → second, bigger brawl; mid-fight
**Hiroshi** arrives (his sharp-eyed animal companion **Kinme** — the black bird —
spotted us) and joins as ally. Bandits routed; Jinbei flees shouting. Hiroshi
introduces himself as an old friend of the player's late master, almost lets slip
something ("before I..."), then leads on — next objective: meet him outside his
hut (rec. level 3, reward 200 XP).

## Feel
- Camera: side-scroll follow with gentle ease; combat pulls into letterboxed strip.
- Bold flat vector art, thick outlines; parallax bamboo forest reads exactly like
  our palette's forest ramp (bright stalks vs near-black canopy mass).
- Kill beat = hard cut to red/black silhouette frame — high-contrast, reads as ink.
- Dialogue portraits are big (≈60% screen height), slide in right, full color.
- Blood: saturated red bursts + persistent stains on terrain during brawls.

## Recreation notes
- **Login screen**: recreate as cosmetic title/entry screen — offline build keeps
  layout with "PLAY AS GUEST" as the sole live path (no accounts/Facebook; render
  the form disabled or repurpose as profile-name entry). Decision logged in
  RESUME_HERE (default above; veto-able).
- Loading screen with rotating TIP lines → cheap, high-fidelity win (Stage 4/6).
- Guest warning modal + gold-corner frame = ONE reusable ornate-frame component
  (dialogue box, results, level-up, quests all share the family).
- New config territory discovered: XP_THRESHOLDS (550, 663, …), FAST_TRAVEL_GOLD=5,
  GUEST_START={coins:100, gold:3}, stat baselines (HP10/CHI10/AP30, ATK1/DEF1/SPD1),
  WEIGHT_MAX=100, +10 maxHP per HP stat point (verify), AUTO_SLASH toggle,
  combo HUD, minimap 6×6 grid + territory/sector coords.
- Spec cross-checks ✓: HUD layout tell #23, haiku cards, PROLOGUE-as-tutorial,
  branch starting weapon, +3/+1 level-up, combo counter, red kill-beat, named
  elite "NAME (LV)".
- Version on record: **v0.717** (login footer) — treat as canonical build.
- Open question for dense pass: the "3" charge counter + gold up-arrow button in
  combat; AP's exact role; per-click stat costs; whether choices branch.

## VERIFIED
