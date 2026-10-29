# SESSION 15 KICKOFF — THE ART IS AN IMPORT PROBLEM

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you need.**
> Self-contained.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals, zero
> `Math.random` · render-only scenes · **red-first TDD** · chaos-plant every guard ·
> **binary gates, never softened to fit a change**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number in §P was produced by a command that
> ran on 2026-07-26 and is quoted with its output. The one question that could have
> sunk this session — *"does the character animation come out, or only static
> shapes?"* — was **resolved before this file was written**. §P2 has the answer.
>
> ⛔ **SESSION 14 IS NOT FINISHED.** A5 (mob AI cadence + hitbox blocking) and A6
> (turn-taking measurement + the `[3,10] s` band) are still open in
> `SESSION14_KICKOFF.md`, which stays live. This session is a **deliberate
> interleave on owner priority** (2026-07-26: *"i personally go with art"*), not a
> replacement. Do not close SESSION 14 items here.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**Straw Hat Samurai: Duels is a Flash game, so its art is VECTOR. Our renderer is
VECTOR. Those are the same kind of thing.**

For three sessions the working assumption was that matching the original's art
meant *approximating* it — eyeballing study frames and hand-drawing shapes that
came close. That assumption was correct right up until the source dive decrypted
the client, and then nobody noticed it had stopped being true. **The source dive
exported ActionScript only: 1,079 `.as` files, zero shapes.** The art was in the
same file the whole time.

It is not an approximation problem. It is an **import** problem:

```
1,822 vector shapes exported ........................ 8.0 seconds
93.1% of all fills are FLAT SOLID COLOUR ............ Phaser draws this natively
827 sprite timelines + 7,196 placement matrices ..... the animation, as transforms
20 bitmaps in the entire 6.88 MB payload ............ the game is essentially all vector
```

**The owner has seen the extracted art and confirmed it is what he wants in the
game** (2026-07-26). That is the acceptance criterion this session serves.

---

## §P PREREQUISITES — ✅ ALL RESOLVED. Every command below has already been run.

Full write-up: `docs/research/fidelity/ART_EXTRACTION.md`. Citations so you can
check, not so you must.

**P1 — ✅ Vector shapes export, and they are real art.**
```
reference/tools/ffdec/ffdec.sh -export shape \
  reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
```
→ **1,822 `.svg`, 54 MB, exit 0, 8.0 s.** Confirmed by contact sheet: town
buildings, torii gates, a dragon statue, cherry blossom, bamboo, a cart, katana
wall-mounts, framed UI plates, blood splatter, and a full standing character
figure (`1813.svg`, 64×225).

**P2 — ✅ THE ANIMATION COMES OUT TOO, AS VECTOR TRANSFORMS. This was the risk.**
```
FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -swf2xml \
  reference/decrypted/shs3_payload_decoded.swf reference/extracted/payload.xml
```
→ **314 MB XML, exit 0.** Tag census:

| tag | count | what it is |
|---|---:|---|
| `PlaceObject2Tag` | 7,196 | a shape placed at a **transform matrix** |
| `ShowFrameTag` | 4,347 | frame boundaries |
| `DefineSpriteTag` | 827 | **animation timelines** |
| Shape tags (all 4 kinds) | **1,822** | matches the SVG export exactly ✓ |
| `DefineMorphShapeTag` | 7 | shape tweens |
| `DefineBitsLossless2Tag` | **20** | the *only* bitmaps in the game |

Verified structure, from the file: a `DefineSpriteTag` contains `PlaceObject2Tag`
children each carrying `characterId`, `depth` and a `<matrix>` (translate/scale/
rotate), separated by `ShowFrameTag`. **Animation is therefore: play these vector
shapes, at these matrices, one `ShowFrame` at a time.** Reconstructible exactly,
with no raster step.

⚠️ **`FFDEC_MEMORY=12g` is required** — the default heap dies with
`OutOfMemoryError` on this payload. (The script also prints two harmless Java
version-parse warnings under Java 25; ignore them, the exit code is 0.)

**P3 — ✅ 93.1% of the art is FLAT SOLID COLOUR.** Fill-style census over all
12,142 fill styles:

| type | count | share |
|---|---:|---:|
| solid colour | 11,306 | **93.1 %** |
| linear gradient | 582 | 4.8 % |
| radial gradient | 200 | 1.6 % |
| clipped bitmap | 51 | 0.4 % |
| focal gradient | 3 | 0.0 % |

This is the number that makes the session tractable: `Graphics.fillPoints` draws
flat polygons natively, so **93 % of the work needs no new rendering capability
at all.**

**P4 — ✅ The PNG sprite route exists and is UNUSABLE. Do not take it.**
`-export sprite` produces **3,013 `.png`** (35 MB, exit 0). It rasterises. The
stack invariant is *"procedural vector art only (no image files)"*, and a PNG
sprite sheet violates it, throws away the resolution independence that makes a
vector recreation worth doing, and cannot be committed anyway (see P6). **The XML
route in P2 is the one.**

**P5 — ⚠️ RESOLVED BUT UNCOMFORTABLE: 1,336 distinct instance names exist, and they
skew heavily to UI.** Named instances include `playercanvas` (×7), `samurai` (×2),
`ninja` (×2), `farmer` (×2), `minimapPlayer`, `equipHat`, `hatIcon` — alongside
hundreds of `button`/`label`/`form`/`field` names. Only 2 `SymbolClassTag`s.
⇒ **The fighting character may be assembled in ActionScript at runtime rather
than authored as one timeline sprite.** A1 below settles this, and it settles it
by *reading the code we already decompiled* rather than by guessing.

**P6 — ✅ Licensing and safety are already verified, today.**
- The owner ruling permits copying the art 1:1 (`docs/MASTER_SPEC.md`).
- `reference/` is gitignored — `git check-ignore -v reference/extracted/shapes`
  → `.gitignore:9:reference/`.
- **No `reference/` file has ever been committed**, checked across all history.
- The GitHub remote is **private** (`gh repo view` → `"isPrivate": true`).
- The grant is to **recreate, not redistribute**: extracted files stay local.

**P7 — ✅ The fidelity gate may now assert exact frame matches.** The project
ruling says so explicitly, and the protocol already exists
(`docs/research/fidelity/FIDELITY_GATE.md`, currently 55/55 = 41 probes + 14 edge
scans, re-proven green on 2026-07-26).

**P8 — ✅ The study-frame corpus is on disk**: 3,638 files under `reference/frames/`,
which is what any "does it match?" grading compares against.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

Each decision carries a **one-line veto**.

### D1 — Converted path data becomes COMMITTED SOURCE. This is forced, not chosen. ⭐

`reference/` is gitignored, so **a shipped build can never read those SVGs.** The
conversion therefore has to emit TypeScript — arrays of points and colours — that
lives in `src/` and is compiled in. Nothing is fetched, nothing is loaded, no
image file exists anywhere.

> **Veto:** load SVGs at runtime. *Impossible, not merely unwise* — the files are
> gitignored and would be absent from any clone, CI run, or deploy.

### D2 — ONE target, end to end, graded. Not 1,822 shapes. ⭐

The whole session converts **the player samurai's idle pose** and nothing else,
then grades it against the study frames. A converter that has survived one real
target is worth more than 1,822 shapes nobody has looked at.

> **Veto:** bulk-convert. *Recommended against loudly* — you would not discover
> the gradient problem, the winding-rule problem or the pivot problem until you
> had 1,822 instances of each.

### D3 — Gradients (6.5%) render as their MEAN SOLID COLOUR in this session, and say so

Phaser's `Graphics` has no true gradient-fill-along-a-path API. 93.1 % of fills
need nothing; the 6.5 % that do get a flat approximation **labelled INFERRED in
the generated file's header**, so a later session can find every one of them.

> **Veto:** build real gradient support first. Acceptable but out of scope here —
> it blocks the one thing this session exists to prove.

### D4 — The 51 bitmap fills (0.4%) are OUT OF SCOPE and stay that way

They are 0.4 % of fills, they are raster by nature, and some may be third-party
(which Lut's grant does **not** cover). Log them, skip them.

> **Veto:** none this session.

### D5 — Find the fighter by READING THE DECOMPILED CODE, not by eyeballing shape IDs

P5 says the character may be code-assembled. We already have all 1,079 `.as`
files from the source dive. The class that builds a fighter will name its parts.
**Grep the code, then follow it to the shape IDs** — that is a 20-minute
deterministic search, versus an open-ended visual hunt through 1,822 SVGs.

> **Veto:** eyeball the contact sheet. *Recommended against* — it is unbounded,
> and it produces a guess rather than a citation.

### D6 — The existing procedural samurai STAYS until the imported one grades better

`drawSamurai` is currently graded **A−** and is used by `DuelScene`,
`EncounterScene` and the 55/55 fidelity gate. The imported art lands **beside**
it behind a flag, gets graded, and only then replaces it.

> **Veto:** replace it directly. *Recommended against* — that puts new pixels in
> front of the fidelity gate before anyone has evidence they are better.

### D7 — Generated art files get an EXPLICIT, DOCUMENTED carve-out from the numeric ratchet

`src/game/`'s numeric-literal ratchet would explode on a few thousand generated
coordinates, and hand-reviewing them is not a meaningful act. So: generated files
live under `src/game/art/`, are exempted **by an explicit rule with a comment
naming why**, and each carries a header giving its source `characterId` and the
exact extraction command.

⚠️ **The ratchet exists to stop INVENTED numbers. Traced coordinates are the
opposite of invented — but the carve-out must be deliberate and visible, never a
silently widened glob.** A generated file with no provenance header is a gate
failure.

> **Veto:** put the data in `src/config/`. *Recommended against* — `config/` is
> hand-curated, CONTRACT/INFERRED-labelled gameplay data, and burying 3,000
> generated coordinates in it destroys that file set's reviewability.

### D8 — SESSION 14's A5 and A6 stay open, and this session does not touch them

`SESSION14_KICKOFF.md` remains live. Encounter mob AI and the `[3,10] s` band are
still the next *combat* work.

> **Veto:** finish SESSION 14 first. Entirely reasonable — it is the owner's call,
> and it was made the other way on 2026-07-26.

---

## §2 THE BAR — what "the art looks right" MEANS, decided before any code exists

Vague art goals are how art sessions overrun. This one is binary — three numbers,
and all three must be met:

| | Test | **THE NUMBER** |
|---|---|---|
| **A** | **Silhouette match** vs the study frame | **≥ 90 %** |
| **B** | **Colour match** vs the shapes' own recorded RGB | **100 % — byte-exact** |
| **C** | **Nothing else regressed** — fidelity gate, suite, duel baseline | **55/55 · all green · unedited** |

**A — silhouette, ≥ 90 %.** Trace the outline of our rendered samurai and the
outline of the original in the study frame, lay one on top of the other, and
measure how much they overlap. 100 % is pixel-perfect; **90 % means at most a
tenth of the outline is in the wrong place.** (The formal name for this
overlap measure is *IoU*, intersection-over-union: the area the two silhouettes
share, divided by the area they cover between them.)

**B — colour, byte-exact.** Every solid fill drawn must equal its
`<color type="RGB">` value in `payload.xml`. Not "close", not eyeballed — the
same bytes. This one is free: the colours are recorded in the file, so getting
them wrong would mean actively substituting a guess for a fact.

**C — nothing else regressed.** Fidelity gate still **55/55**, suite green, and
`duel-baseline.test.ts` green **and unedited**.

⚠️ **THE 90 % DOES NOT MOVE INSIDE THIS SESSION.** If the import lands
below it, exactly two diagnoses are permitted:
  (a) the pivot/anchor used to place the shape, or
  (b) an unconverted fill type silently dropping a piece of the body.
**If neither explains it, STOP and escalate.** Do not widen the bar to fit the
result — that is the rule SESSION 13 D10 and SESSION 14 §2 both held to, and both
times the rule was right.

---

## §3 WHAT WILL FIGHT YOU

1. **`reference/` is gitignored.** Anything the build needs must be *emitted as
   committed source*. Say it out loud now so nobody writes a runtime loader.
2. **314 MB of XML.** Stream it. A DOM parse will OOM exactly like FFDec did.
3. **Phaser `Graphics` is not an SVG renderer.** No `path()`, no true gradients,
   no even-odd winding. You are converting to `fillPoints` polygons, which means
   flattening Bézier curves yourself and picking a curve tolerance.
4. **SWF units are TWIPS** (1/20 px) and matrices are fixed-point. Getting the
   scale wrong produces art that is exactly 20× too big — a very recognisable
   failure, so recognise it fast.
5. **The fighter may not be one sprite** (P5). D5 is the plan for that; do not
   let it become an open-ended hunt.
6. **The purity ratchet WILL fire.** Expected, and D7 says exactly what to do —
   an explicit carve-out with provenance, never a silent glob.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code,
then green.** Chaos-plant every new guard.

### A1 — Find the player fighter's shape IDs, by citation ⬅ START HERE
Grep the 1,079 decompiled `.as` files for the fighter-assembly class; follow it to
character IDs; cross-reference against `payload.xml`.
**Gate: a written list of shape IDs with the code line that names each one.** No
guesses. If the code says the fighter is assembled from parts, that list is the
part list.

### A2 — The converter: one shape, SVG/XML → committed TypeScript
Pure function, unit-tested: path data + fill colour in, polygon arrays out.
Red-first on a hand-written fixture (a triangle, a curve, a hole) before pointing
it at anything real. Chaos-plant: corrupt the winding rule → the hole test RED.

### A3 — Render that ONE shape in the browser, beside the existing samurai
Behind a flag (D6). **Gate: it appears, at the right scale** (see §3.4 — 20× is
the tell), in its recorded colours.

### A4 — The full idle pose, graded against the study frames
Compose the parts at their recorded matrices.
**Gate: §2's A (≥90 % IoU) + B (byte-exact colours) + C (55/55, suite green).**

### A5 — Write up, and decide the next slice with evidence
What the IoU actually was, which fills were approximated, what the animation work
would cost now that the transforms are known to be available.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Player shape IDs listed **with the code line that names each** | the list, with citations |
| 2 | Converter is a pure, unit-tested function | red-first; fixtures for curve + hole |
| 3 | Generated art is **committed TypeScript**, no runtime file loading | grep for `fetch`/`import(` in the art path |
| 4 | `src/` still contains **zero image files** | the stack invariant |
| 5 | Every solid fill is **byte-exact** to its recorded RGB | diff generated vs `payload.xml` |
| 6 | Approximated gradients are **listed in the file header**, not silent | read the header |
| 7 | Silhouette **≥ 90 % IoU** vs the study frame | measured, pasted |
| 8 | Ratchet carve-out is **explicit + documented**, files carry provenance headers | read the rule and a header |
| 9 | Fidelity gate still **55/55**; suite green; `duel-baseline` green **and unedited** | pasted output |
| 10 | Nothing from `reference/` is committed | `git status` + history check |
| 11 | Ledgers + DIVERGENCES + RESUME_HERE + next kickoff in the closing commit | `git show --stat` |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the fighter turns out to be code-assembled, and A1 becomes a swamp.**
P5 already flags it. The mitigation is D5: read the decompiled source, which we
have, rather than hunting visually. **If A1 cannot produce a cited list within
its own time box, stop and report that** — "the character is built in code, here
is the class, here is what it would take" is a completely successful outcome for
this session. It converts an unknown into a plan.

**Risk 2 — bulk conversion feels productive and quietly replaces the goal.**
Converting 1,822 shapes is easy, satisfying, and proves nothing. One target,
graded against a real frame, is the deliverable. D2 exists precisely because the
wrong version of this session ends with a huge diff and no evidence.

---

## §7 QUEUED — deliberately NOT in this session

- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking
  measurement, the `[3,10] s` band. Still live in `SESSION14_KICKOFF.md`.
- **All audio.** The game is still completely silent — no `AudioContext`
  anywhere in `src/`. It was SESSION 15's slot until the owner reprioritised;
  it needs a study pass of its own.
- **The animation itself.** P2 proves the transforms are available; this session
  imports a static pose. Motion is the obvious next slice.
- **Real popup digits.** SESSION 14 A4 left them as correctly-sized, correctly-
  coloured *blocks*. Font glyphs are art, and this is the art pipeline.
- **`DuelScene` damage popups** — held back in A4 to keep new pixels away from
  the 55/55 gate.
- Gradient fills (6.5 %), bitmap fills (0.4 %), the 982-item / 75-skill /
  61-quest tables, the 39 AI classes.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes — and here is the evidence rather than the
claim.**

- **There is no research step, and that is checkable.** Every prerequisite in §P
  is a command that was *actually run today*, quoted with its real output and
  exit code — 1,822 shapes in 8.0 s, a 314 MB XML dump, a 12,142-row fill census.
  Nothing below §P asks anyone to measure, mine, or find out.
- **The session's one existential question was answered BEFORE the file was
  written.** "Does the character animation come out, or only static shapes?" was
  the open risk at the end of SESSION 14. P2 answers it with a tag census: 827
  timelines, 7,196 placement matrices, and shape counts that reconcile exactly
  with the SVG export. A kickoff that shipped with that unresolved would have
  been a plan to do research, not a plan to build.
- **A negative result is recorded as carefully as the positive ones.** P4 says the
  PNG sprite route works, produces 3,013 files, and **must not be used** — with
  the reason. Someone would otherwise find it and take it.
- **The bar is numeric and fixed before any code exists** (§2: ≥90 % IoU,
  byte-exact colours, 55/55 held), and it inherits the stop-and-escalate rule
  that SESSION 13 D10 and SESSION 14 §2 both honoured under pressure.
- **The scope is deliberately, aggressively small** (D2: one pose), with the
  failure mode of the *wrong* version of this session named in §6 Risk 2.
- **A forced constraint is surfaced rather than discovered later:** `reference/`
  is gitignored, so a runtime loader is *impossible*, not merely inelegant (D1).
  That single fact reshapes the whole architecture, and it is stated in the
  first decision rather than found in week two.
- **It is honest about what it does not know.** P5 flags that the fighter may be
  code-assembled and skews the naming evidence *against* the session's own
  convenience; §6 Risk 1 declares an "it's built in code, here's the class"
  outcome to be a success rather than a failure.
- **It does not pretend SESSION 14 is finished.** A5/A6 are named as open in the
  banner, in D8, and in §7, with the owner's reprioritisation cited by date.

**What it deliberately does not promise:** that the imported samurai will clear
90 % IoU on the first attempt. §2 gives that gate two permitted diagnoses and a
hard stop instead of an escape hatch — and if A1 discovers the fighter is
assembled in ActionScript, this session ends at A1 with a cited plan, which §6
declares a success in advance.
