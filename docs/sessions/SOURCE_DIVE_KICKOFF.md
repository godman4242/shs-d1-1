# SOURCE DIVE KICKOFF — read the game's own constants out of the SWFs

> **RUN THIS BEFORE `SESSION12_KICKOFF.md`.** If it succeeds, SESSION12's retune
> uses **exact source constants** instead of pixel-derived estimates, and roughly
> a dozen values move from INFERRED to CONTRACT. If it fails, SESSION12 proceeds
> exactly as written — nothing is lost.
>
> **Entry route:** `RESUME_HERE.md` → this file.
> **Read first:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md` §2-equivalent
> audit in `SESSION12_KICKOFF.md` §2 — it lists precisely which values are still
> inferred. Those are your targets.

---

## START HERE — the first three things to do

1. **Check the easy win first (Tier 1).** `reference/predecessors/shs1_*.swf` and
   `shs2_kon.swf` are **already plain, unprotected, parseable SWFs**. Decompile
   those before touching the protected payload — they are free evidence and they
   teach you the studio's own idioms for the slash mechanic.
2. **Then the 2,390-byte loader stub**, not the 6.88 MB payload. The stub is where
   the decryption lives. Cracking the payload without reading the stub is guesswork.
3. **Time-box Tier 2 to ~90 minutes.** If the payload has not decrypted by then,
   write up what the scheme is, commit the Tier-1 results, and hand SESSION12 the
   unchanged plan. A clean abort here is a **success**, not a failure.

---

## §1 What we have, verified on disk

| file | size | state | verified how |
|---|---|---|---|
| `reference/predecessors/shs1_462631_shunpo202c.swf` | 0.85 MB | ✅ **PLAIN SWF** — CWS v9, decompresses, tags parse | zlib + tag walk |
| `reference/predecessors/shs2_kon.swf` | 1.84 MB | ✅ **PLAIN SWF** — CWS v9, decompresses, tags parse | zlib + tag walk |
| `reference/preservation/shs3.swf` | 164 KB | ⚠️ **loader/protector** — CWS v10, valid; 1 × `DoABC` (2,390 B of AS3) + 2 × `DefineBinaryData` | tag walk |
| ↳ BinaryData #1 | 2,818 B | ✅ **plain embedded SWF** (`CWS` v9 + `789c` zlib), entropy **1.51** | header + entropy |
| ↳ BinaryData #2 | 159,929 B | 🔒 **encrypted**, entropy **7.99**, no recognisable header | entropy |
| `reference/preservation/shs3_payload.swf` | 6.88 MB | 🔒 **fake CWS header** — byte 3 = 0x79 (bogus version), body is not zlib | header probe |
| `reference/preservation/shs3_android_payload.swf` | 15.14 MB | 🔒 same fake-CWS scheme (byte 3 = 0x72) | header probe |
| `reference/preservation/shs3_payload_version.swf` | 223 B | ✅ **plain text config** — see below | direct read |

The version file is a plaintext manifest and it names the protector:

```
tinyloaderversion=1.0&version=0.706&forceupdate=false
&payload=http://www.strawhatsamuraiduels.com/shs3_payload.swf
&androidpayload=http://r.playerio.com/r/shsd-server1-.../liveupdate/shs3_android_payload.swf
```

⚠️ **Note the version mismatch:** this manifest says **0.706**, while the title
screen we captured reads **v0.717**. Either the manifest is stale or the archived
payload is an earlier build. **Establish which build you actually decrypted before
trusting a single constant**, and record it — a 0.706 constant is still excellent
evidence, but it must be labelled as 0.706.

**Tooling:** `java` is present (OpenJDK 25). **JPEXS Free Flash Decompiler (ffdec)**
is the standard tool and runs as a Java app; it is not installed yet. It also
handles many Flash protectors natively, so try it on `shs3.swf` directly before
hand-rolling anything.

---

## §2 Why this is worth a session

`SESSION12_KICKOFF.md` §2 lists ~12 values that stay INFERRED after two full
measurement passes. Source constants would settle most of them **exactly**,
including three the video **can never** answer:

| value | video verdict | source could give |
|---|---|---|
| **AUTO SLASH ON behaviour** | **UNRESOLVABLE** — the plate reads OFF in every frame of both videos | the actual auto-attack routine |
| **`ENEMY_BASE.defense`** | **UNRESOLVABLE** — the OG has no enemy stat screen | the enemy stat table |
| **`CRIT_MULT`** | unmeasurable — Focus filled only **twice in 65.8 min** | the exact multiplier |
| `COUNTER_BONUS` | never measured (forum ~20 %) | exact |
| `HEAVY_DEF_PENALTY` | wiki only | exact |
| per-stance `dmgMult` | wiki only | exact |
| Balanced **reach** | 131 measured vs 200 wiki, unresolvable from footage | exact, per mastery level |
| Focus **spend rule** | not a general rule (19 drops / 111 cycles) | exact |
| gait threshold | unresolved in (105.2, 130.8] | exact |
| hitbox half-width | **NOT-FOUND** | exact |
| `DASH_SLASH_PX` | **CONTESTED** between two videos | exact |
| `SLASH_FRAMES` | **CONTESTED** | exact |

That is the difference between a recreation tuned to *estimates* and one tuned to
the *original's own numbers*.

---

## §3 ⚠️ THE EVIDENCE RULE — the mistake this project already made once

**SHS 1 and SHS 2 are DIFFERENT GAMES.** Their constants are **lineage evidence**
about how the studio built the slash mechanic — they are **never** Duels values.

This project has already been burned by exactly this: the "iaido-duel MEASURED
3.0× crit" data point was carried for months before being caught as *a different
game* and voided. Do not repeat it under a new name.

**Tagging rule for this session:**
- `CONTRACT-SRC` — read from the **Duels** payload. Authoritative.
- `LINEAGE` — read from SHS1/SHS2. Informative, **never** a Duels value, and never
  promoted to CONTRACT without independent Duels confirmation.
- Anything already tagged MEASURED from footage stays as it is until a
  `CONTRACT-SRC` value replaces it — and when one does, **record both** and say
  which won.

**Extraction rule:** we extract **NUMBERS and BEHAVIOURAL FACTS**, not code. Do
**not** transliterate ActionScript into TypeScript. The build stays our own
implementation; the source supplies the constants and the rules they encode. This
is the same discipline already applied to art and dialogue.

**Permission:** the owner ruling (2026-07-24, `docs/OWNER_PERMISSION_RULING.md`)
attests written permission from Lut Games for a 1:1 recreation. Reading the
licensed work's own constants sits inside that grant. Material stays **study-only,
local-only, never distributed** — decompiled output belongs under `reference/`
(gitignored), exactly like the videos and frames. **Never commit SWF-derived
source code or assets**; commit only the extracted numbers and their provenance.

---

## §4 Ordered plan

### Tier 1 — the free win (do this first, ~30 min)

1. Install ffdec (Java app; keep the download under `reference/tools/`, gitignored).
2. Decompile `shs1_462631_shunpo202c.swf` and `shs2_kon.swf`.
3. Hunt the **slash mechanic** specifically — it is the shared ancestor of our core
   verb. Targets, in priority order:
   - how a drawn stroke is captured, resampled, and turned into a hit test
     (this is the direct ancestor of our `DrawnStroke` → `resolveSlash` path);
   - whether the hit test is against the **polyline** or a radius — our c-3 finding
     says polyline; confirm the lineage agrees;
   - the dash-along-the-cut displacement (ancestor of `DASH_SLASH_PX`);
   - blood/FX counts and timings (we currently carry INFERRED `BLOOD_*` values).
4. Tag everything **`LINEAGE`**. Write it to a new
   `docs/research/fidelity/SOURCE_CONSTANTS.md` under a clearly separated
   "SHS1/SHS2 lineage" heading.

### Tier 2 — crack `tinyloader` (time-boxed ~90 min)

5. **Try ffdec directly on `shs3.swf` first.** It may unpack the protector without
   any manual work. If it dumps a loadable payload, skip to step 8.
6. Otherwise, extract **BinaryData #1** (2,818 B — already a plain SWF) and
   decompile it. This is the tinyloader logic. You are looking for: a key, a cipher
   (RC4/AES/XOR are all plausible for the era), and how it transforms the payload
   bytes before `Loader.loadBytes`.
7. Apply that transform to `shs3_payload.swf`. **Success looks like** the output
   starting with a real `FWS`/`CWS`/`ZWS` header and parsing as a tag stream.
   - If the desktop payload resists, **try `shs3_android_payload.swf`** — it is a
     different build (byte 3 = 0x72 vs 0x79) and may be packed differently or not
     at all beyond the header.
   - Also try the **live-update URL** in the manifest via the Wayback Machine — an
     unpacked or differently-packed build may be archived.
8. Decompile the real payload. Then go straight at the §2 table.

### Tier 3 — verification (mandatory, do not skip)

9. **Cross-check every extracted constant against the footage we already measured.**
   This is what catches reading the wrong variable. Known anchors, all independently
   measured this session:
   - Focus fills in **5.97 s**
   - named enemy **JINBEI (4) = 132 HP**, killed by **42+48+42**
   - enemy approach-attack telegraph **600 ms**, point-blank **267 ms**
   - reach **Light ≈ 300**, **Heavy ≈ 100** stage px
   - unnamed mobs die in **1 hit**
   If a source constant contradicts a solid measurement, **do not silently prefer
   the source** — record both and investigate. Common causes: you read a different
   difficulty tier, a different mastery level, or a per-level table rather than the
   base value.

---

## §5 Gate (binary)

| # | Item | Verify |
|---|---|---|
| 1 | Tier-1 lineage constants extracted from SHS1/SHS2, tagged `LINEAGE` | `SOURCE_CONSTANTS.md` diff |
| 2 | The tinyloader scheme is **documented** — cipher, key location, transform — whether or not it was cracked | written finding |
| 3 | If cracked: the Duels payload decompiles and the build version is **identified** (0.706 vs 0.717) | version note + provenance |
| 4 | If cracked: every §2 target either has a `CONTRACT-SRC` value or an explicit "not found in source" | `SOURCE_CONSTANTS.md` |
| 5 | **Tier-3 cross-check run** against all five anchors; contradictions recorded, never silently resolved | comparison table |
| 6 | Nothing SWF-derived is committed except numbers + provenance; all binaries under `reference/` | `git show --stat` |
| 7 | `SESSION12_KICKOFF.md` §2 audit table updated — every value that moved INFERRED → CONTRACT-SRC | diff |
| 8 | Suite · tsc ×2 · eslint still green (this session should change **no** gameplay code) | pastes |
| 9 | Ledgers + DIVERGENCES + RESUME_HERE + next kickoff in the closing commit | `git show --stat` |

---

## §6 Honest odds, and the abort condition

- **Tier 1 is near-certain.** Both files are verified plain and parseable; the only
  risk is that AS2 bytecode is messier to read than AS3.
- **Tier 2 is genuinely uncertain — call it a coin flip.** In its favour: the stub
  is tiny (2,390 bytes), Flash protectors of that era were usually weak, ffdec has
  built-in support for many of them, and we have three independent artefacts to
  attack (desktop payload, android payload, Wayback). Against it: if `tinyloader`
  used a **server-delivered key**, the key died with Player.IO and the payload is
  **permanently unreadable** — that is a real possible outcome and it is not a
  failure of effort.
- **Abort cleanly at the time-box.** Document the scheme, commit Tier 1, and hand
  SESSION12 the plan unchanged. Do not let this become an open-ended crypto
  rabbit-hole — the retune is not blocked on it, only improved by it.

**Do not touch gameplay code in this session.** Its only outputs are extracted
constants, provenance, and an updated audit table.
