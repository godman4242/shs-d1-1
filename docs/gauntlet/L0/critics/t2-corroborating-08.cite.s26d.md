# Blind critic — CITE LENS — packet `t2-corroborating-08`

Packet size **19**. Judged **19**. Skipped **0**. Refuted **0**.

Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-08.cite.s26d.json` (written first).

---

## Headline

**This is the cleanest packet I have seen in this lane.** Nineteen findings, and not one of them
over-claims badly enough to refute. That is an uncomfortable result for a critic whose brief is to
default to `refuted=true`, so I want to be explicit about what I actually did rather than what I
concluded: I opened every cited artifact myself, and for the five findings that carry a *derivation*
rather than a quote I **re-ran the derivation from the raw artifact** instead of reading the answer.

Three independent re-derivations, all exact to the digit:

| finding | what I re-ran | my result |
|---|---|---|
| `world-exploration/start-town-is-kasuta` | the LCG, from `NameGenerator.as:40,42,162-166` + `RNG.as:66-75` | `rand(78)=75` → `Ka`, `rand(37)=0` → `suta` → **Kasuta** |
| `world/third-placename-override-is-web-only` | the same generator on three ids | **Chikada / Kakuchi / Kasuta** for 1405270 / 1409366 / 1397077 |
| `world/map-bitmap-is-in-the-repo-735-land-pixels` | `QuestEngine.processMapBitmapData` over all 63×72 pixels of the GIF | **735** land px, i 1..61, j 1..70, territoryx 329..389, territoryy 291..360, mapid 1347935..1593647, Ibamaya→(15,54), Gokura→(44,43), Iwakuni→(43,39) |

Every figure matched. When a finding hands you a reproducible computation and the computation
reproduces, the cite lens has nothing left to bite on.

---

## The three `QUOTE_UNVERIFIED` flags I overturned

The machine audit raised four `QUOTE_UNVERIFIED` and one `UNCHECKABLE`. Four of the five are
**linter artefacts, not claim defects**, and I want that on the record because the same trap will
recur:

1. **`world-exploration/save-schema-is-23-slots`** — quote is
   `public function saveUpdate(saveIndex:int, savedata:String) : *`. It is **verbatim at
   `NetworkManager.as:1870`**, which is the *second* path in the cite. The linter appears to have
   searched only the first. Overturned.
2. **`world/third-hardcoded-placename-override-web-only`** and
   **`world/third-placename-override-is-web-only`** — the quotes live in
   `reference/decompiled/shs3_payload/scripts/§1t136s0§.as`. The `§` characters defeat the linter's
   quote matcher. I counted the file line by line: **every single line number in both quotes is
   exact.** Overturned twice.
3. **`world/map-bitmap-is-in-the-repo-735-land-pixels`** — the "quote" is a decode report, not a
   line of a file, so of course it does not resolve textually. I decoded the GIF myself. Overturned.

**Standing note for the next citelint pass:** `QUOTE_UNVERIFIED` on a `shs3_payload` path is close
to worthless — the whole web bundle is `§1tNNNsN§`-obfuscated and the linter cannot match through it.
Those need a human read every time.

---

## The one finding that must not be banked as it stands

### `world-exploration/web-third-placename-hardcode` — honest STILL_UNHELD, but **already closed**

This is the only judgement in the packet that took real thought. It is an honest, careful,
well-hedged STILL_UNHELD — it even argues *against its own hypothesis* ("Evidence against my own
hypothesis: 'Iwakuni' IS a normal row of the PlaceNames blob"). Over-refuting that is exactly the
failure mode §0 warns about, so I did not refute it.

But it ends on a sentence that is **flatly wrong**:

> "Closing this needs a web-side NameGenerator decompile, which the repo does not hold."

The repo holds it. `reference/decompiled/shs3_payload/scripts/§1t136s0§.as`, 178 lines, is the web
v0.717 twin of `NameGenerator`, and it settles the question in the claimant's favour at `:148-151`.
Two other findings **in this same packet** cite it.

Everything else that finding asserts survived my checks, and I checked all of it:

- `NameGenerator.as:137` / `:141` are the only two android overrides, and `:145` is the split. ✔
- `98_1t4653s0.bin` splits to **677** entries, `Iwakuni` at index 660 in the run
  `Hofu / Iwakuni / Kudamatsu / Mine / Nagato`. ✔
- Neither `Ibamaya` nor `Gokura` appears in the table — which is *why* they must be hardcoded. ✔
- `grep -rl Iwakuni` over the android scripts → **0 files**. ✔

Two nits: the three adjacent pool names are at `payload.xml:119265-119267`, not the cited
`119264-119266` (`:119264` is the `replace` token it mentions); and the android script set is
**553** `.as` files, not 559.

**Ruling: not refuted — but it must enter the ledger as HELD-and-SUPERSEDED, never as an open lead.**
A lead that has already been closed affirmatively is worse than no lead, because the next agent
spends a round re-opening it.

---

## Line-number drift — where I drew the line

Three findings cite ranges that are one to four lines off the block they quote:

| finding | cited | actual |
|---|---|---|
| `world-exploration/twelve-hour-crop-never-rots` | `Obj_VegePatch.as:131-140` | `:135-144` |
| `world-exploration/twelve-hour-crops-never-rot` | `Obj_VegePatch.as:134-143` | `:135-144` |
| `world-exploration/the-twelve-hour-crop-never-rots` | quote labelled `:161-169` | `case 4:` label at `:160` |

I did **not** refute any of these. The cited ranges resolve, they overlap the quoted code, and the
quoted code is verbatim present. Under the brief this is incompleteness, not mis-citation. But it is
worth naming as a pattern: three agents quoted the same block and all three landed slightly short of
it, which is what happens when you count from a `sed` window instead of from `grep -n`.

Set against that, `world-exploration/the-twelve-hour-crop-never-rots` gave the **most precise cite in
the packet** — `:55` for `gracePeriod`, and `:116-128 / :131-143 / :146-158 / :161-169` for the four
crop arms. Every one exact. Precision like that is cheap to verify and should be the house style.

---

## Where the packet is stronger than it knows

Six things I found while judging that nobody in the packet claimed. All six are in the JSON as
`new_findings`; the two that change how a claim should be **banked** are:

**1. The no-change-town rule is cross-build.** Judging
`world-exploration/nochange-town-covers-all-level-under-8` I went looking for the web twin, and it is
right there: `§1t70s0§.as:414` is `return _loc2_ < this.§1t1138s0§ + 5;` with
`internal var §1t1138s0§:int = 3;` at `:146` — numerically identical to android's
`LEVELSTART = 3` at `NodeGenerator.as:144`. The rule can be banked as CONTRACT against the **filmed**
build, not carried with an S0-3 caveat.

**2. Kasuta is on film, in the web build.** The very frame the packet cites for `TERRITORY (21,51)`
also prints, top-left, **`E KASUTA FIELD`** with a travel row reading
**`E KASUTA MOUNTAIN PATH (N)`**. Territory (21,51) *is* spawn territory 1397077 = (341,341), whose
android LCG name I reproduced as `Kasuta`. So the generated syllable name, the compass prefix and the
terrain suffix all survive into v0.717 — which closes the build-parity half of *both*
`start-town-is-kasuta` and `start-node-name-confirms-rng`, neither of which cites a single web
artifact.

The other four: `DATASLOTS=20` does **not** count the twenty written data ids (it sizes a
dirty-flag `Vector` over 0..19, *including* the never-written slot 13 and *excluding* slot 103 — the
agreement is coincidence); the whole save schema is android-only evidence (`grep -rn saveUpdate` →
zero hits under `shs3_payload`); the web RNG is pool-allocated but primes identically, so it is
bit-for-bit the android RNG; and the 677-entry place-names blob is **byte-identical** between the web
bindata set and the android extract (`cmp` clean) — a rare non-circular parity proof, given C2.

---

## Nits carried forward, none fatal

- `world-exploration/web-payload-carries-world-constants` — line numbers are **exact**
  (`104820`=49297, `104821`=233280, `104823-104834` the twelve ids in precisely the quoted order),
  but "in the same clustered order [as] `getNoChangeTownLevel`" overstates by a hair: the pool order
  is `isNoChangeTown`'s four ids **first**, then `getNoChangeTownLevel`'s — i.e. class emission order.
  The *set* is exactly right.
- `world-exploration/start-town-is-kasuta` — the corroborating video-study line is off by ten. The
  banner text `W KASUTA FOREST` is at `A-00-boot-login.md:51`; `:61-62` carries the
  `TERRITORY (21,51)` / `SECTOR 0,3 → 1,3 → 2,3` line. The finding self-labels that source a LEAD and
  rests on the A2 reproduction, which I reproduced independently, so this changes nothing.
- `world-exploration/start-node-name-confirms-rng` — "the payload's own string table" is loose. Both
  artifacts are **android-side**. The independence is of *derivation path* (authored label vs LCG),
  not of build.
- `world/map-bitmap-is-in-the-repo-735-land-pixels` — labelled `build: both`, but both artifacts are
  android-side and the transform's web twin was not checked here.
- `world-exploration/rock-deposit-never-clears` — cite says `Obj_OreDeposit.as:79-86`; `clearOre`'s
  signature is at `:80` (`:79` is blank).

---

## Standing-invariant check

**No measurement doc contradicted a frame in this packet.** The one A1 finding
(`world/the-hud-prints-territory-21-51-on-film`) I checked by crop-and-upscale, and the frame
*agrees* with the code constants: `WorldMapUI.as:17/:19` give `TERRSHIFTX=21` / `TERRSHIFTY=51`, and
spawn territory 1397077 decodes to (341,341), which displays as (21,51) — exactly what is printed on
screen. Nothing to escalate.
