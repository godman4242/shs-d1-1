# SOURCE CONSTANTS — read out of the original game's own SWFs

> **Status: CRACKED AND MINED (2026-07-25).** The archived *Straw Hat Samurai: Duels*
> payload is decrypted, decompiled, and mined. **Build identified as v0.717 — the
> same build our video measurements came from.** 189 constants extracted; every one
> re-read by a second independent agent (**152 CONFIRMED · 37 CORRECTED · 0 REFUTED**).
>
> **Entry route:** `RESUME_HERE.md` → `docs/sessions/SOURCE_DIVE_KICKOFF.md` → this file.
> **Then:** `docs/sessions/SESSION12_KICKOFF.md` — its §2 audit table is superseded by §6 here.
>
> **What is committed:** numbers, behavioural facts, provenance. Nothing else. All
> binaries, decompiled output and extracted XML live under `reference/`, which
> `.gitignore` excludes wholesale (verified: `git check-ignore` passes on every path).

---

## §0 Tagging — read this before using any number below

| tag | meaning | may become a project constant? |
|---|---|---|
| `CONTRACT-SRC` | read from the **Duels** payload's own code or data | **yes** — authoritative |
| `LINEAGE` | read from **SHS1 / SHS2** | **NO.** Different games. Informative only. |
| `MEASURED` | from video frames (`COMBAT_MEASUREMENTS.md`) | yes — until a `CONTRACT-SRC` value replaces it |
| `PLACEHOLDER` | a designer dummy found in the payload | **NO — never a value** |

**The evidence rule.** SHS1 and SHS2 are *different games*. This project already
carried a "3.0× crit" number for months before catching that it came from a
different game. Every §4 row is tagged `LINEAGE` and is never promoted without
independent Duels confirmation.

**⚠️ Two placeholder traps caught this session — both would have poisoned the retune:**

1. **Static UI mockup text.** The payload contains Flash-IDE dummy strings:
   `slash distance: 345 (heavy)` · `physical dmg: 1234 - 1235` · `hp: 123 / 123` ·
   `chi: 123 / 434`. A naive read hands you "Balanced reach = 345". **Nothing
   sourced from a static text field is admissible.**
2. **`maxDistance = 200`, the static initialiser.** This is the *idle default* of the
   stroke-length budget, overwritten on every single `setStance` call. **It is almost
   certainly the origin of the wiki's "Balanced reach = 200"** that this project has
   carried as a project constant since Stage 2. It is not the balanced reach.

---

## §1 The protection chain — SOLVED, and reproducible

Three layers. Each was read out of the layer above it; nothing was brute-forced.

```
shs3.swf  (164 KB, CWS v10 — the file the browser loads)
│   class `lb`, 2,390 bytes of AS3
│   ├── frame 0: loads DefineBinaryData chid=11 (2,812 B) — a plain CWS v9 SWF, the splash
│   └── frame 1: RC4-decrypts DefineBinaryData chid=9 (159,923 B)
│        KEY = the blob's OWN LAST 8 BYTES.  Only the FIRST 64 BYTES are encrypted.
▼
stage 2  (CWS v10, 164,333 B) — SWF Defender / magichtml.com
│   com.swfdefender.{Comp, MD5, DomainMsg, IntUtil} + class `la`
│   Embedded ByteArray = [config header][protected payload].
│   Config: width=800, height=690, level=1, key="ZvupTBlC", no password, no domain
│   lock, no watermark.   level 0 → Comp.C1 (repeating-key XOR) · level 1 → Comp.C2 (RC4)
│   Again: FIRST 64 BYTES ONLY.
▼
stage 3  (CWS v17, 185,570 B) — `shs3preloader_fla.MainTimeline`, the real tinyloader
│   Downloads shs3_payload.swf and de-obfuscates it:
│
│       for (i = 3; i < 256; i++) {
│           if (i % 11 == 0) swap(b[i], b[i+256]);
│           b[i] ^= 104;
│       }
│
│   Bytes 0–2 are NEVER touched — which is exactly why the archived file kept a
│   readable "CWS" signature with a nonsense version byte, and read as a corrupt
│   SWF rather than an encrypted one. Only the first 512 bytes are involved at all.
▼
shs3_payload.swf → CWS v17, 11,892,053 B inflated — THE GAME
```

**The coin flip landed in our favour.** `SOURCE_DIVE_KICKOFF.md` §6 called Tier 2
"genuinely uncertain", the fatal case being a **server-delivered key** that died with
Player.IO. It was not server-delivered: every key sits inside artefacts already on
disk. No network, no Player.IO, no Wayback needed for the crack.

### Verification of the crack — computed, not asserted

| file | before | after | independent proof |
|---|---|---|---|
| `shs3_binarydata_9.bin` (159,923 B) | entropy 7.99, no header | `CWS` v10, len 164,333 | decompiles to `com.swfdefender.*` |
| `shs3_payload.swf` (6,880,328 B) | `CWS` **v121**, len 1,759,321,397 | `CWS` **v17**, len **11,892,061** | zlib body inflates to **11,892,053** = 11,892,061 − 8 ✅ |
| `shs3_android_payload.swf` (15,142,649 B) | `CWS` **v114**, len 1,763,875,192 | `CWS` **v26**, len **21,688,592** | inflates to **21,688,584** = −8 ✅ |

Declared-vs-actual length agreeing to the byte, on both files independently, is the
proof — a wrong transform cannot produce a self-consistent SWF length.

**Reproduce:**
```
python3 reference/tools/tinyloader_crack.py
python3 reference/tools/swfdefender_unwrap.py reference/decrypted/shs3_binarydata_9_decrypted.swf reference/decrypted
python3 reference/tools/payload_decode.py reference/preservation/shs3_payload.swf reference/preservation/shs3_android_payload.swf
```
Tooling: ffdec (JPEXS) 26.2.1, GPLv3, `reference/tools/ffdec/` — an accelerator only.
Layers 1–3 are pure Python, no external tools, no network.

---

## §2 Build identification — SETTLED

| artefact | version | evidence |
|---|---|---|
| **desktop payload** | **0.717** ✅ | `StatsManager.clientVersion = 0.717`, assigned exactly once across 1,079 scripts; rendered as `versiontext.text = "v" + clientVersion` → **"v0.717"** |
| **android payload** | **0.682** | same member in the un-obfuscated android build; an **EARLIER** build |
| captured title screen | v0.717 | `reference/preservation/p0_ruffle_titlescreen.png` |
| manifest `shs3_payload_version.swf` | `version=0.706` | **dead code** — the tinyloader reads the field into a local and never uses it |

**Two consequences that matter:**

1. **The decompiled desktop payload IS the build we measured on video.** Source
   constants and measured anchors are from the *same* build. This is the best
   possible outcome for the cross-check, and it is why §5 can be read strictly.
2. **The SWF container version is a false provenance signal.** The android payload
   has the *newer* container (v26 vs v17) but the *older* game (0.682 vs 0.717).
   Corroborated at byte level: the IEEE-754 double `0.717` occurs exactly once in
   the desktop payload and zero times in the android one, and vice-versa for `0.682`.

**⚠️ Labelling rule:** the four data tables in §3.7 come from the **android 0.682**
build. They are tagged `CONTRACT-SRC (0.682)` and must never be quoted as 0.717.

---

## §3 Duels constants (`CONTRACT-SRC`, v0.717 unless noted)

Frame rate is **24 fps** (SWF header, independently verified on three files, and
corroborated in code by a `if (counter == 24) ++seconds` loop). The game loop is
`ENTER_FRAME`-driven with no substepping, so **every px/frame figure below is per 1/24 s.**
World space is **800 × 480**.

### 3.1 The damage pipeline — complete, in order

**Attacker side** (computed once at slash launch, then frozen into the attack record):
```
raw = minDamage + random() * damageRange
light   : raw × (0.5 + 0.04 × masteryL)
balanced: raw × (1.0 + 0.02 × masteryB)
heavy   : raw × 1.4
if (focus == focusMax)  →  raw × 1.3 + flatCritBonus(equipment stat 204)
```
**Defender side**, in this exact order:
1. `dmg = attack.damage`
2. elemental fire/wind/water/earth each minus the matching resist, independently
3. **stance triangle** on physical only: **×1.2** if attacker's stance beats defender's, **×0.9** if it loses
4. `dmg -= defenderEffectiveDefense` — **defence SUBTRACTS, it never divides**
5. min-damage floor (see 3.5)
6. **body-part crit ×1.3** for head / neck / hat — applied *after* the floor

| constant | value | note |
|---|---|---|
| `minDamage` | `attackStat + equipAttackBonus + weapon.mindamage` | **no level term** |
| `damageRange` | `weapon.maxdamage − weapon.mindamage` | 0 with no weapon |
| **`CRIT_MULT`** | **1.3** | ✅ **our INFERRED 1.3 is exactly right** |
| body-part crit | **1.3**, parts 12 neck / 16 head / 17 hat | a *second*, stacking 1.3 |
| stance triangle | **×1.2 / ×0.9** | balanced▸light, heavy▸balanced, light▸heavy |
| heavy defence penalty | `defense × 0.8`, **defender-side, heavy stance only** | ✅ our `HEAVY_DEF_PENALTY=0.2 → ×0.8` is exact |

⚠️ **A `×2` damage doubling exists in the source but is DEAD CODE** — its flag is
never set anywhere in the payload. The verifier caught this; do not implement it.

### 3.2 Focus / Critical meter — the 5.97 s mystery solved

| constant | value |
|---|---|
| `focusMax` | **192** (`8 × 24`) |
| fill rate | **+1 per frame, unconditional while alive** → 192 frames = **8.000 s** raw |
| **bar display mapping** | **`scaleX = (current − 48) / 144`** — the first 48 points are **invisible** |
| ⇒ **visible empty→full** | **144 frames = 6.000 s** |
| kill bonus | **+6**, once per death-resolution sweep (not once per kill) |
| spend per slash | light `−usage/2` · balanced `−usage` · heavy `−usage × 1.5` |
| `slashUsage` | weapon stat, **hard floor 48** → light 24 / balanced 48 / heavy 72 |
| full-meter slash | meter is **zeroed first**, then the cost subtracts (a no-op) |

**This single row explains three separate footage puzzles at once:**
- measured fill **5.97 s** vs source **6.000 s** — a 0.5 % match, and only because the
  bar hides its first 48 points. The raw 8 s meter would never have matched.
- the refuted "−20 % per slash" rule: costs are **12.5 / 25 / 37.5 %** of raw, but
  **16.7 / 33.3 / 50 %** of the *visible* bar, and vary with the equipped weapon.
- why small spends at a low meter produced **no visible drop at all**.

**There is no random crit chance anywhere in the melee path.** "Crit" = spending a
completely full Focus bar. This confirms the Session-11 correction that Focus *is*
the crit meter, and that our separate Critical meter should be deleted.

### 3.3 Reach — it is a formula, not a table, and not a radius

```
base    = 120 + floor( (90 + 5 × dan) × A / (20 + A) )      A = agility stat, dan = rebirth rank 0..9
light   = base × 1.4                        (no mastery term)
balanced= base × (1 + 0.02 × masteryB)
heavy   = base × (0.5 + 0.04 × masteryH),  then floored at 100
```
**`reach` is the total ARC-LENGTH budget of the stroke you draw**, spent segment by
segment as the mouse moves (`remaining -= hypot(dx,dy)`; drawing stops at 0). Stroke
thickness tapers with the spent fraction. **A curvy slash therefore covers much less
ground than a straight one of the same reach.**

| mastery L | light | balanced | heavy |
|---|---|---|---|
| 0 | 1.40 | 1.00 | 0.50 |
| 5 | 1.40 | 1.10 | 0.70 |
| 10 | 1.40 | 1.20 | 0.90 |

Sample `base` at dan=0: A=1 → **124** · A=3 → **131** · A=10 → 150 · A=100 → 195.

**⚠️ This dissolves the Light-300 / Balanced-131 contradiction, and it is not in our
favour.** Reach limits *the line you draw*. The distance the samurai actually
**crosses is uncapped** — he dashes to the stroke's last point regardless. So:
- **Balanced 131** is a real reach reading (`base` at A=3, dan=0 — a level-1 character).
- **Light 300** is **not a reach reading at all**; it measured dash travel.
- Our `STANCE_TABLE.reach = 300/200/100` is therefore **wrong in kind, not just in
  value** — it models a per-stance constant where the original has a stat-driven
  formula, and two of its three numbers trace to non-reach sources.

Mastery cap = **10** (recovered from the android build's embedded `skilldata`).

### 3.4 Movement, input geometry, dash

| constant | value | = per second |
|---|---|---|
| `runSpeed` | **12 px/frame** | 288 px/s |
| walk speed | **4 px/frame** | 96 px/s |
| **walk/run threshold** | **100 world px** | study could only bound it to (105.2, 130.8] ✅ |
| move-order deadzone | **25 px** — taps closer than this are ignored entirely | |
| `standingRange` | **50 px** — inside this, slash in place; beyond, run to the stroke first | |
| arrival rule | snap when `|pos − target| ≤ speed` — **no easing, no acceleration** | |
| `gravity` | 3 | |
| `jumpThreshhold` | 100 | |
| camera dead-band | screen x **350–450** | |
| stroke resample spacing | **20 px** — this *is* the hit-test resolution | |
| min stroke to count as a slash | **4 points** or **20 px** end-to-end | |
| stroke thickness | 8 | |

**There are TWO uncapped dashes per slash** (the verifier caught the second): a
wind-up leg to the stroke's **first** point, then the strike leg to its **last** point.

`lightSlashSpeed / balancedSlashSpeed / heavySlashSpeed = 50 / 40 / 30` are the
**dash velocity in px/frame** (1200 / 960 / 720 px/s) — *not* a distance and not an
animation rate. `frames = pathLength / speed`.

**Hold-to-move exists — but only in the TOWN/world mode**, never in battle. Battle
input is draw-mode or auto-slash-mode. This is the source-level resolution of the
long-running "hold-run per Tip #27" dispute: the belief was **half right**, applied
to the wrong scene.

### 3.5 Level, combo, and the things that turned out not to exist

| item | source truth |
|---|---|
| **damage vs level** | **level does NOT scale damage.** ✅ confirms footage (an L10 dealt less than an L5) |
| level's only damage role | the min-damage floor: `≤10 → 1` · `≤20 → lvl/8` · `≤30 → lvl/6` · else `lvl/4` |
| levels grant | **+1 skill point, +3 stat points** — points, not power |
| attack stat | **+3 damage per stat point** — the sole damage stat |
| **`COUNTER_BONUS`** | ❌ **NOT FOUND — there is no counter/parry/riposte mechanic at all.** The forum's "~20 %" is the **stance triangle ×1.2**. Our `COUNTER_BONUS = 1.25` models something the original does not have. |
| **combo** | **purely cosmetic HUD text.** No damage, XP or coin bonus. No decay timer. |
| combo reset | **resets to 0** (never to 1), **only when the player takes damage.** It does **NOT** reset on a kill. ❌ **contradicts our Stage-2 "resets to 1 on kill CONTRACT"** |
| stagger / poise | hyperarmor after **3** staggers (**5** if the attacker is in light stance) |
| **stance switch in combat** | **costs 48 focus** and is gated on having it. ❌ contradicts the footage reading "free" — the free case is out-of-combat |

### 3.6 AUTO SLASH — the item marked "UNRESOLVABLE from footage"

**Fully answered.** Auto slash is not an auto-attack routine. Setting the toggle adds
the human's own fighter to the **enemy AI decision branch** — your character is driven
by the identical routine that drives AI opponents.

- **Manual input is fully locked out while ON.** The input layer switches to a mode in
  which mouse-up issues no command and no line is drawn. Only HUD actions (stance,
  skills, hotkeys) remain.
- **Cadence:** a decision every **12 frames (0.5 s)**, and never while slashing,
  airborne or stunned.
- **Targeting:** nearest living enemy by `|Δx|`, **unlimited range, no line-of-sight**.
- **It synthesises a fake player stroke** — `reach/20` points spaced 20 px apart — and
  feeds it to the *same* entry point a hand-drawn stroke uses, so every downstream
  rule (run-to-start, dash, polyline damage, meter cost) is identical. The player
  even sees the generated line drawn on the canvas.
- Six distinct stroke generators: default body-height sweep, two downed-target
  finishers, a vertical launcher, and two anti-air strokes.
- **Cost:** nothing beyond a normal slash.

### 3.7 The enemy stat tables — RECOVERED (`CONTRACT-SRC (0.682)`)

The desktop build fetches `npcdata` / `questdata` / `itemdata` / `skilldata` from
`http://www.strawhatsamuraiduels.com/server/` — a dead host, and **confirmed never
archived by the Wayback Machine** (checked: zero snapshots for `/server/*`, and zero
`.swf` captures on the whole domain). On the desktop payload alone the enemy stat
table is genuinely unrecoverable.

**But the android build ships all four tables embedded, uncompressed.** Recovered:

| table | records | file |
|---|---|---|
| `npcdata` | **495 NPCs** | `reference/extracted/npcdata.xml` |
| `questdata` | 61 quests | `reference/extracted/questdata.xml` |
| `itemdata` | 982 items | `reference/extracted/itemdata.xml` |
| `skilldata` | 75 skills | `reference/extracted/skilldata.xml` |

Row schema: `id, lvl, name, ai, hp, chi, attack, defense, speed, mcs, skills, reward,
scalex, scaley, fire, wind, water, earth`. `name` is a **string-table ID**, not text —
which is why a search for "JINBEI" finds nothing; named enemies resolve through
LangManager.

**`ENEMY_BASE.defense` — the item marked "UNRESOLVABLE, the OG has no enemy stat
screen" — now has real data.** The mobs actually referenced by the wave-spawn XML:

| id | lvl | ai | hp | attack | defense |
|---|---|---|---|---|---|
| 400 | 1 | 1 | **1** | 1 | 1 |
| 401 | 2 | 2 | **1** | 2 | 2 |
| 402 | 2 | 3 | **1** | 2 | 2 |
| 403 | 3 | 4 | **1** | 3 | 3 |
| 404 | 4 | 5 | **1** | 4 | 4 |

**`hp = 1` is authored directly in the data.** This confirms "ordinary mobs die in one
hit" from a *second, independent* source — the data table — on top of the code path
(`setLevel`: `if (lvl <= 10) { damage = 1; defense = 1; maxHP = 1; }`).

Across all 495 rows, defence clusters at 20 (38 rows), 30 (26), 24 (14), 10 (11);
HP at 1 (42 rows), 15 (32), 30 (26), 10 (23).

### 3.8 ⚠️ Named-enemy HP is not authored at all — it is computed from the player

This is the session's most consequential architectural finding.

```
Δ            = enemyLevel − playerLevel
effPlayerDmg = (playerMinDmg + playerDmgRange/2) − enemyDefense, floored by player level
enemyHP      = max(ratio-scaled base HP,  effPlayerDmg × K)
enemyMinDmg  = max(ratio-scaled base,     playerMaxHP / D)
xpReward     = enemyLevel × 5 + 45
if (enemyLevel <= 8) { enemyMinDmg = 1; enemyDefense = 1; }   // AFTER the HP derivation
```
⚠️ **CORRECTION (2026-07-25) — K/D are per-CLASS and an earlier revision of this file quoted
the wrong class.** The **named-duellist** class (white `NAME (level)` nameplate — what our
`DuelScene` renders) uses **`K = max(10 + Δ, 3)`** and **`D = max(18 − Δ, 3)`**, read verbatim
as `_loc8_ = 10 + _loc7_; _loc9_ = 18 - _loc7_;` each floored at 3. The `8/16` pair belongs to
a *different* class. Verified in the same pass: the D-numerator is **player max HP**
(the init parameter map confirms that stat slot), so:

⇒ **The design is exactly symmetric — the player kills the enemy in K hits, the enemy kills
the player in D hits. Both sides are tuned in HITS, neither in hit points.**

**A named enemy's HP is recomputed at spawn from the player's own stats so the fight
always lasts K player hits.** The same enemy has different HP for different players.

**This exactly explains our measured JINBEI (4) = 132 HP killed by 42+48+42:**
K clamps to 3, and 3 × 44 = **132**, where 44 is precisely the mean of the three
measured hits. **Jinbei has no authored 132 HP anywhere.** The parenthesised number
in the nameplate is the enemy's **level**, not an index.

⇒ **Our whole "enemy HP" model is wrong in kind.** SESSION12 must not tune enemy HP
as a constant; it should model hits-to-kill and derive HP, or explicitly diverge.

### 3.9 Enemy AI

| item | source truth |
|---|---|
| think interval | **24 frames (1.0 s)** default; **12 frames (0.5 s)** for duelists |
| **turn-taking** | ❌ **enemies do NOT take turns.** No token, no cap, no shared cooldown. The apparent turn-taking in footage is **emergent** from independent timers plus the melee range gate |
| targeting | nearest valid actor by `|Δx|` — no aggro table, no last-attacker memory |
| melee trigger | per AI class, e.g. `|dx| < 50 && Δy < 50` |
| blocking | mobs can block with the weapon hitbox (part 3 → 0 damage); **duelists cannot** ✅ consistent with "zero blocking" in duel footage |
| AI classes | **39 distinct behaviours** selected by the `<ai>` integer |
| corpse TTL | 96 frames (4.0 s), alpha-fading over the last 12 |

**`HP obfuscation:` HP is stored multiplied by a random 2..6 rolled once per session
(anti-memory-scanner). Not a gameplay number — do not reproduce it.**

---

## §4 Predecessor constants — SHS1 / SHS2 (`LINEAGE` — NEVER a Duels value)

The lineage pass returned rigorously, and its most valuable output is a **warning**.

**The headline answer: the ancestor hit test is POLYLINE, unambiguously.** Both games
walk discrete sample points along the drawn stroke and call Flash's per-pixel
`hitTestPoint(x, y, true)` against the enemy's rendered shape. **There is no radius
test in either codebase.** This corroborates our Duels polyline conclusion — but it is
corroboration, not proof.

**Reach budget model (identical in both):** `distanceLeft = maxDistance` on mouse-down,
`-= dist(oldMouse, newMouse)` per move, drawing gated on `> 0`. **This is the same
arc-length-budget model Duels uses** — the strongest structural lineage result.

**⚠️ THE TRAP, stated by the lineage agent itself:**

> `maxDistance` is **300 in SHS1** and **200 in SHS2**. The two ancestors **disagree
> with each other by 50 %**, which alone proves the value is not a studio invariant.

**Our `STANCE_TABLE` carries reach `light: 300, balanced: 200`.** Those are exactly the
two predecessor constants. Combined with §3.3 (Duels reach is a stat-driven formula,
and its `200` is a placeholder default), the conclusion is uncomfortable but clear:
**our reach table looks like lineage contamination plus a placeholder, not a Duels
measurement.** Flagged for SESSION12; not acted on here.

Other lineage rows (informative only): dash is a **teleport to the stroke endpoint**
after a fixed hold (20 frames SHS1 / 15 SHS2), **not** path-interpolated · dashing is
**invulnerability** in both · i-frames 12 frames · blood emitter 15 particles/frame,
ttl 25, gravity 0.6, velocity 9±2, cap 2 concurrent systems · all unarmoured mobs have
**1 HP** in both games · both run at **24 fps**.

**Explicitly NOT FOUND in either predecessor:** any radius test · any per-level reach
table · any damage number (hits are literally `--hp`) · **any crit concept at all**
(flagged by the agent because the voided 3.0× crit was previously mis-attributed to
this lineage).

---

## §5 Tier-3 cross-check against measured footage — MANDATORY, and it holds

Source values are **not** silently preferred over measurements. Both are recorded.

| anchor | MEASURED (video, 0.717) | CONTRACT-SRC (0.717) | verdict |
|---|---|---|---|
| damage is a roll | 36/10/30/27/42/48/42 | `minDamage + rand × damageRange` | ✅ **CONFIRMED** |
| Focus fill | **5.97 s** | visible bar = **144 frames = 6.000 s** | ✅ **CONFIRMED (0.5 %)** |
| unnamed mobs | die in **1 hit** | `hp = 1` authored **and** `setLevel` forces 1 | ✅ **CONFIRMED ×2** |
| JINBEI (4) = 132 HP, 3 hits | 42+48+42 | `HP = effPlayerDmg × 3` = 3 × 44 = **132** | ✅ **CONFIRMED exactly** |
| damage not level-scaled | L10 < L5 | no level term in the damage formula | ✅ **CONFIRMED** |
| walk / run gait threshold | bounded (105.2, 130.8] | **exactly 100** | ✅ **CONSISTENT** (measurement bracketed it) |
| stance triangle | light▸heavy▸balanced▸light (DEV-TEXT) | same triangle, ×1.2 / ×0.9 | ✅ **CONFIRMED** |
| duelists don't block | zero blocking observed | duelist override drops the weapon-block branch | ✅ **CONFIRMED** |
| `CRIT_MULT` | unmeasurable | **1.3** | ✅ our INFERRED value was right |
| `HEAVY_DEF_PENALTY` | wiki only | `defense × 0.8` | ✅ our value was right |

**Contradictions — recorded, NOT silently resolved:**

| item | measured | source | note |
|---|---|---|---|
| **walk / run speed** | 126 / 341 stage px/s | 96 / 288 **world** px/s | ✅ **RESOLVED 2026-07-25 — the scale is not a guess, the game computes it.** See §3.10. At the source's own ×1.2: walk **115.2** (measured 112–126 ✓) and run **345.6** (measured 341–349 ✓, dead centre). |
| **reach** | Light 233–241 · Balanced 116–131 · Heavy 97–103 stage px | formula at SPD 1 → **173 / 124 / 100** world px | ⚠️ **OPEN.** Converted at ÷1.2 the readings are Light **194–201** · Balanced **97–109** · Heavy **81–86** world px — Light sits *above* the formula, Balanced and Heavy *below*. **No single SPD value reconciles all three**, so the three readings were not measuring the same quantity (Light almost certainly captured **dash travel**, which §3.3 says is uncapped). **Measured reach must not be used to validate or tune the formula.** |

### 3.10 The render transform — read from the original, not inferred

The original's resize routine, for logical `w=800, h=480, hTall=690`:
```
if (windowAspect <= 800/690)  { contentAspect = 800/690; h = 690; }
if (contentAspect >= windowAspect) { scale = stageW/800; xOff = 0; yOff = (stageH − h*scale)/2; }
else                               { scale = stageH/h;   xOff = (stageW − 800*scale)/2; yOff = 0; }
scaleX = scaleY = scale;    // ONE uniform scale on both axes
```
For a **1024×576** canvas: `windowAspect` 1.778 > `contentAspect` 1.667 → else branch →
**scale = 1.2**, **xOff = 32**, **yOff = 0**.

⇒ **`stage = (32 + 1.2·worldX, 1.2·worldY)`** — uniform, pillarboxed with 32 px bars.
Positions carry the +32; **lengths and speeds take ×1.2 only.**
| **enemies take turns** | observed | **no arbitration exists** | measurement described a real *appearance*; the mechanism is emergent from independent 12/24-frame timers |
| **stance switch free** | observed free | **48 focus in combat** | footage was out-of-combat; both are true in their own context |
| **combo resets to 1 on kill** | our Stage-2 CONTRACT | **resets to 0, and only on taking damage** | our contract is wrong |
| **reach 300 / 200 / 100** | Light 300, Heavy 100 | stat-driven formula; 200 is a placeholder | see §3.3 — wrong in kind |
| **`SLASH_FRAMES` 12/16/20** | contested | anim XML `*_horslash`: light 29 / balanced 26 / heavy 21 | **ordering is opposite to ours**, but see the two caveats below |

**Animation frame counts** (`<anim i="NAME" d="FRAMES">`, 482 entries extracted):

| animation | light | balanced | heavy |
|---|---|---|---|
| `*_horslash` | 29 | 26 | 21 |
| `*_downslash` | 26 | 33 | 23 |
| `*_upslash` | 21 | 22 | 21 |

⚠️ **Do not lift these into `SLASH_FRAMES`.** Two load-bearing caveats: (1) `part b`
carries `l="1"`, almost certainly a **loop/hold** flag, so the sum is a *lower bound*
for one pass, not the swing duration; (2) **two naming families exist**
(`balanced_horslash` 26 *and* `balancedhorizontalslash` 20) and which drives player
swing timing is not established.

---

## §6 What moves, and what does not — supersedes `SESSION12_KICKOFF.md` §2

| §2 row | was | now |
|---|---|---|
| AUTO SLASH ON behaviour | **UNRESOLVABLE** | ✅ **CONTRACT-SRC** — §3.6, fully specified |
| `ENEMY_BASE.defense` | **UNRESOLVABLE** | ✅ **CONTRACT-SRC (0.682)** — 495-row table, §3.7 |
| `CRIT_MULT` | INFERRED 1.3 | ✅ **CONTRACT-SRC 1.3** — our value was right |
| `HEAVY_DEF_PENALTY` | wiki only | ✅ **CONTRACT-SRC ×0.8** — our value was right |
| per-stance `dmgMult` | wiki only | ✅ **CONTRACT-SRC** — mastery formulas, §3.1/§3.3 |
| gait threshold | (105.2, 130.8] | ✅ **CONTRACT-SRC 100** |
| Focus spend rule | not a general rule | ✅ **CONTRACT-SRC** — stance-scaled, weapon-driven, floor 48 |
| hitbox half-width | **NOT-FOUND** | ⚠️ **still not a number** — hit test is per-pixel against rendered art, so there *is* no half-width constant. §3.4 gives the 20 px sample spacing instead. |
| `COUNTER_BONUS` | forum ~20 % | ❌ **the mechanic does not exist** — it is the stance triangle |
| Balanced reach | 131 vs 200 | ⚠️ **the question was malformed** — reach is a formula; see §3.3 |
| `DASH_SLASH_PX` | CONTESTED | ⚠️ **not a constant** — dash goes to the stroke endpoint, uncapped, and there are two legs |
| `SLASH_FRAMES` | CONTESTED | ⚠️ **still contested** — see §5 caveats |

**Newly discovered, not previously on any list:** the min-damage floor table · body-part
crit ×1.3 · stagger hyperarmor 3/5 · the 25 px deadzone · `standingRange` 50 · two dash
legs · combo being cosmetic · the 48-focus in-combat stance cost · 39 AI classes ·
HP obfuscation.

---

## §7 Provenance and scope

Reading the licensed work's own constants is in scope for this project
(`docs/MASTER_SPEC.md`). Standing constraints, unchanged:

- Material is **study-only, local-only, never distributed**.
- **Never commit SWF-derived source code or assets** — only numbers and provenance.
  Everything derived lives under `reference/` (gitignored; verified this session).
- Third-party components inside the payload (Google Analytics, Facebook SDK, PlayerIO,
  the SWF Defender protector, the "Edo SZ" font) are **not** covered by the grant.
- We extract **numbers and behavioural facts, not code.** No ActionScript is
  transliterated into TypeScript. The build stays our own implementation.

**Method note.** 6 mining agents → 6 adversarial verifiers (each told to *refute*, and
to mark UNVERIFIABLE rather than confirm on doubt) → 1 lineage agent. **152 CONFIRMED ·
37 CORRECTED · 0 REFUTED.** The verification pass earned its cost: it caught the dead
`×2` damage code, the inverted camera behaviour, a second dash leg, the mastery cap,
and — most importantly — **the entire 495-row enemy stat table**, which the miner had
declared permanently server-side.
