# BLIND CRITIC — packet `t2-corroborating-03`, CITE LENS (s26d)

**Packet size 48 · judged 48 · skipped 0 · refuted 0 · new findings 4.**
Structured verdicts written FIRST to `docs/gauntlet/L0/critics/t2-corroborating-03.cite.s26d.json`.
My own cites re-run through `scripts/gauntlet/citeLint.py`: **52 claims — 51 RESOLVES · 0 BROKEN · 1 QUOTE_UNVERIFIED** (the one is a frame reading, which no text-grep can locate).

---

## Headline

**Nothing in this packet is refuted.** That is an unusual result and it deserves the caveat
up front: this is a *corroborating* tier, every claim is second-order (it backs an existing
finding), and the tier's typical failure mode is a cite that resolves but does not say what
the claim says. I hunted exactly that, opened all 48 cited artifacts myself, and found the
citations unusually disciplined — **six claims carried `QUOTE_UNVERIFIED` from the machine
audit and all six were false alarms** caused by the `§1tNNNNs0§` obfuscation glyphs, by a
quote spanning two lines of XML, or by the artifact being a *video*.

What I did find is **nine prose defects worth flagging and none worth killing a finding
over** — miscounts, one arithmetically wrong contrast figure, one spliced quote fragment,
one undercounted field list, and one unhedged android→web generalisation. Each is recorded
in its verdict `reason` so the ledger inherits the correction rather than the error.

---

## The five claims I tried hardest to break, and what happened

### 1. `parity/meter-constants-diverge-and-frames-pick-the-web-one` — I re-measured the frames and got its numbers

This was the most attackable claim in the packet: an A2 code cite carrying an embedded A1
measurement, i.e. exactly the shape that lets a wrong pixel number hide behind a right code
number. So I did the frame work from scratch.

I opened `reference/frames/session11/crit-focus/t1081.100.png` and `t1082.100.png` (both
1920×1080), cropped the bottom-left HUD at `(180,920)-(600,1070)` and upscaled 4× LANCZOS to
find the meter — it is the **third** bar, under the green HP and blue Chi bars, and it fills
white from the left. Then I scanned row `y=1039` numerically rather than eyeballing it:

```
t1081.100.png   white fill right edge  x = 258
t1082.100.png   white fill right edge  x = 303–304
track (brown + white span)             x = 245 → 513   = 269 px
```

The claim said 258 → 303 across a 268 px track. I got 258 → 303/304 across 269 px. The frame
names are 1.000 s apart, so that is **45 px/s**, and a full traverse is 269/45 = **5.98 s**.

- Web prediction: `maxreload = 8*24 = 192` (`§1t99s0§.as:249`), HUD fraction `(reload-48)/(192-48)`
  (`§1t113s0§.as:328`) → 144 ticks at 24 fps = **6.000 s**.
- Android prediction: `maxreload = 5*24 = 120` (`MCSPlayer.as:239`), fraction `(reload-24)/(120-24)`
  (`:1168`) → 96 ticks = **4.000 s**.

The footage picks the web constants and rules out the android ones by two seconds. Refill is
`++` per frame unconditionally in both builds (`:1205` / `:1160`), so it is SPD-independent
as claimed. **HELD, and it is the cleanest cross-build parity datum I saw in the packet.**

### 2. `progression/per-point-plus3-direct-frame-proof` — reproduced from the video myself

I did not take the surveyor's crops on trust. `ffmpeg -ss {456,459,462} -i
reference/videos/zFtCaTO0_1M.mp4 -frames:v 1`, then crop `(691,108)-(1881,702)` at 1.4×
LANCZOS (the stats modal is large; no heavy upscale needed):

| t | AVAILABLE STAT POINTS | ATK | DEF | SPD |
|---|---|---|---|---|
| 456 | **3** | 4 | 4 +2 | **1** |
| 459 | **2** | 4 | 4 +2 | **4** |
| 462 | **0** | **7** | **7** +2 | 4 |

One click, one point, **+3 SPD**. The remaining two bought +3 ATK and +3 DEF. That is the web
handler set (`§1t5957s0§.as:3422` ATK +3, `:3434` DEF +3, `:3444` SPD +3, each decrementing
STATPOINTS by 1) and it is *not* android's `+1` (`InventoryUI.as:2439/:2446/:2453`). **HELD.**

I also pulled `-ss 653` (badge 3, XP 2098/2950, points 0, ATK 7, DEF 7+2, SPD 4, CHI 10/10,
AP 30/30, WEIGHT 38/100) and `-ss 1600` (badge 4, XP 5110/5150, points 0, ATK 10, DEF 10+13,
SPD 4, CHI 9/15, AP 15/30). The one-level delta is **ATK +3, DEF +3, CHI-max +5** = three
points = the per-level grant at `§1t1523s0§.as:2075`. That single pair of frames independently
holds up `progression/level-3-to-4-on-film-buys-plus3-atk-plus3-def-plus5-chi`,
`progression/l3-budget-second-confirmation` and `progression/a02-second-frame-corroboration`
at once.

### 3. `meta-social/web-wave-roster-differs-from-android` — I re-ran the byte diff

`sha256` matched both quoted prefixes (`709d94cb28c0…` / `b56f8c6a0283…`) and both sizes
(11,721 / 11,553 B). I then parsed both blobs with ElementTree instead of trusting the
summary: **39 waves and 87 enemy rows in each, `sum(qty) = 351` in each, and exactly 14
differing rows at indices 73–86** — rows 73–76 `'449|454|449|454|443'` vs `'449|454'`, 77–80
`'450|455|450|455|443'` vs `'450|455'`, 81–84 `'451|456|451|456|443'` vs `'451|456'`. Every
figure reproduces. **HELD.**

### 4. `parity/writ-of-release-is-25g-in-web-and-5g-in-android` — the frame wins, with one correction

I opened `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg` and cropped the detail
panel `(330,95)-(1000,230)` at 3× and the grid `(330,55)-(620,300)` at 5×. On screen: **WRIT
OF RELEASE / OWNED: 0**, a **25** badge on the tile, two more scroll tiles in the grid also
badged **25**. The android data at `itemdata.xml:2328-2333` is `<baseprice>0</baseprice>
<heavenlyprice>5</heavenlyprice>`. **THE FRAME WINS**, and the finding says so out loud.

But I zoomed further — badge crop `(600,190)-(720,230)` at 10×, plus the top bar `(0,0)-(1024,120)`
at 3× — and the currency framing needs a correction. The HUD carries **two** counters: a
grey ingot in a green diamond labelled **COINS** (630) and a yellow oval labelled **GOLD** (2).
The Writ badge carries the **yellow-oval GOLD glyph**. So this is 25 *premium* Gold against
5 *premium* Gold — a **5× re-tune of one currency**, not coins-versus-heavenly. That also
dissolves an apparent contradiction (a coin price of 25 against `<baseprice>0</baseprice>`
would be incoherent). The 5× gap the finding rests on is untouched. **HELD, filed as new
finding #4.**

### 5. `newfind/per-stat-caps-diverge-between-builds` — the claim holds, two of its numbers do not

The cap formulas are verbatim on both sides (`§1t5957s0§.as:3341-3346` vs
`InventoryUI.as:2407-2412`) and the headline divergence is real and important. Two secondary
numbers in its prose are wrong and I have recorded both:

- **"four of six rows"** — five of the six handlers differ; only MAXCHI is identical. It is
  four only if ATK/DEF/SPD is counted as a single row, which is how the claim then enumerates
  them, so this is sloppy rather than false.
- **"the ~130 an android-capped reading gives"** — arithmetically wrong. Android uses the
  *identical* base-reach formula (`StatsManager.as:1915-1918`, `120 + floor((90+5·DAN)·SPD/(20+SPD))`),
  so at the android L8 SPD cap of 18 it yields `120 + floor(90·18/38) = **162**`, not ~130.

Its load-bearing figures are right: web L8 SPD cap `1+18·3 = 55`, web reach ceiling
`120 + floor(90·55/75) = 186`. And its two sibling claims (`progression/android-caps-also-drifted`,
`progression/android-stat-caps-are-a-different-formula`) carry the same divergence without
these errors, so the ledger gets a clean version regardless. **HELD, minor.**

---

## The six `QUOTE_UNVERIFIED` claims — all six survived

The brief flagged these as my priority. Every one was a tooling artefact, not an over-claim:

| claim | why the script missed it | outcome |
|---|---|---|
| `meta-social/web-new-player-starts-with-3-gold` | `§1tNNNNs0§` glyphs in the quote | found verbatim at `§1t1523s0§.as:1023-1028` |
| `meta-social/web-payload-decompile-is-the-authority` | quote spans six files, cite names two | primary cite exact; **all six** divergences re-measured by me |
| `meta-social/web-warrules-7-pages` | `·` / `--` separators inside the quote | `§1t7924s0§.as:23,121,122,123` verbatim |
| `meta-social/web-warrules-max-7` | same | verbatim, plus ids 369–380 confirmed on both builds |
| `npcdata-category11-grant-census-corrected` | `</skills>` sits on the *next* line from `:4349` | full census re-run, **every count and every line number matched** |
| `parity/animation-layer-is-not-byte-parity-five-blobs-differ` | quote is a size table, not file text | md5 census re-run: **14 of 19 identical, same five misses** |
| `parity/meter-constants-diverge…` / `progression/level-3-to-4-on-film…` / `progression/setlevel-debug…` | video artifact / obfuscation | all verified above |

The `npcdata-category11` one is worth naming: I re-ran the raw occurrence census with my own
regex over `npcdata.xml` and got **1500 → 5 rows (3662, 3683, 3898, 4290, 4349, all lvl 3) ·
1501 → 2 (3934, 3956, lvl 3) · 1064 → 4 · 1065 → 4 · 1066 → 1 (3879) · 1067 → 1 (3879) ·
1068 → 2 (3934 lvl 1, 4349 lvl 2)**, and `skilldata.xml` category 11 holds exactly
`1064,1065,1066,1067,1068,1500,1501`. Every single figure in the corrected census is right.

---

## The one STILL_UNHELD, and why I did not touch it

`progression/kill-xp-never-validated-on-screen` carries no cite and self-declares
STILL_UNHELD. The brief warns that over-refuting honest STILL_UNHELD answers is itself a
failure, so I judged its *arithmetic* rather than its conclusion. `NPC.as:166-189` is
`calcXP`; `:103` gives `greyLevel = 10 - floor(10/10) - 5 = 4` and `:123-126` gives
`zeroDifference = 7` at player level 10 — exactly the parameters it assumed. Its four worked
values reproduce (13 / 27 / 32 / 64 / 120) and none is 52. Declaring the on-screen +52 XP
unreconciled is the correct answer under §0. **Not refuted.**

---

## Defects flagged (all `minor`, none fatal to their finding)

1. `newfind/per-stat-caps-diverge-between-builds` — "four of six rows" (really five of six handlers); "~130" (really 162).
2. `persistence/offline-save-schema-is-fourteen-fields-already-written` — **undercount**: the offlineMode branch runs to `:2930`, not `:2925`. Nineteen fields, not fourteen. See new finding #3.
3. `progression/autoassign-android-only` — "six statements"; the web `levelUp` body has **eight** (it dropped `:2080-2081`). Its duplicate `progression/autoassign-is-android-only` quotes all eight and is the better of the two.
4. `progression/a02-second-frame-corroboration` — the fragment `"AVAILABLE STAT POINTS: 3 (ticks down to 1, then 0)"` is spliced into a quote attributed to `:25` but lives on `:23`, one line outside the cited range.
5. `progression/expArray-levelcap-clamp` — prose says the clamp variant is `:363-366`; it is `:364-367` (still inside the cited `:361-372`).
6. `meta-social/web-payload-decompile-is-the-authority` — "652 files" is the *flat* entry count of `scripts/`; the recursive `.as` count is **1,079**, as its own sibling claim correctly states. It also says "five" numbers change and then lists six.
7. `npcdata/kill-xp-formula` — the cited line is exact, but the lane_impact "closes the question — XP per kill = 2·level + 20" **over-generalises**: fifteen named enemy subclasses override it with `level·5 + 45`. Read it alongside `progression/enemy-base-xp-is-lvl5plus45`, which is in this same packet and which I verified reproduces both grep lists exactly (17 files / 6 files).
8. `progression/player-stance-cycle-is-three` — says "the shipped game" from an android-only cite. See new finding #1: the web twin has no dev-console branch at all. The three-state conclusion nonetheless holds on web, which I checked.
9. `npcdata/setlevel-pins-everything-to-1-below-11` — the quoted block silently elides `:251 this.updateHealthBar();`. Irrelevant render call; arithmetic untouched.
10. `progression/second-xp-curve` vs `…-web-only` — one says "capped at level 10", the other "capped at level 5". **Both are real**: 10 is `§1t12495s0§` used at `:297` and `:398-400`; 5 is the bar-fraction early return at `:343`. Not a contradiction.

---

## New findings (4)

**#1 `newfind/web-nextstance-drops-the-console-five-cycle-and-gates-on-48`** — A2, both builds.
Web `§1t99s0§.as:3058-3081` gates on a **hard `if(this.§1t4414s0§ < 48) return;`** and cycles
`-1→Light→Balanced→Heavy→Light` with **no `consoleEnabled` branch anywhere**. Android
`MCSPlayer.as:2977` gates on `reload < maxreload/6` (= 20 ticks) and `:2981-3002` exposes the
five-stance dev cycle. A seventh counted combat divergence, and it supplies the stance-change
gate a port needs. Note the elegance: 48 is the same constant the web HUD subtracts at
`§1t113s0§.as:328`, so on web the stance lock releases exactly when the focus bar starts moving.

**#2 `newfind/frame-confirms-web-maxdueltokens-40`** — A1, web v0.717. The shop frame's top bar
reads **40/40 DUEL TOKENS**. Web `§1t1523s0§.as:200` declares 40 (consumed at `:2079`);
android `StatsManager.as:166` declares 30 (consumed at `:1691`). **The frame picks 40**, which
both confirms the longplay is the web build and fixes the number to port — upgrading
`progression/duel-token-refill-mismatch` from android-only to build-decided.

**#3 `newfind/offline-save-branch-writes-nineteen-fields-not-fourteen`** — A2. `QueryManagerBase.as:2926-2930`
adds `activeQuestList`, `completedQuestList`, `playerlocation`, `taunt`, `friends`. A schema
transcribed from `:2912-2925` alone would reload a character with no quest state and no saved
position.

**#4 `newfind/writ-badge-glyph-is-premium-gold-not-coins`** — A1. Detailed above.

---

## Verdict summary

| | count |
|---|---|
| judged | **48 / 48** |
| refuted | **0** |
| held with a `minor` defect flagged | 10 |
| held clean | 38 |
| skipped | **0** |
| new findings | 4 |

Every verdict carries an `own_cite` naming an artifact I opened. Zero source files touched;
`src/core/Sim.ts` and `tests/duel-baseline.test.ts` untouched.
