# OWNER PERMISSION RULING — licensed 1:1 recreation (2026-07-24)

> **Supersedes** the "RECREATE, NEVER RIP" art restriction as previously scoped,
> the palette policy (2026-07-12), and FIDELITY_V2_KICKOFF Standing Rulings §1
> ("pixel-copying the OG's art was DECLINED — never relitigate"). The decliner
> was the owner; the owner has reversed it — with a license.

## The grant (owner-attested)

Kheshav reports (2026-07-24, this session): **Lut Games — the rights holder for
*Straw Hat Samurai: Duels* — granted him permission to make a 1:1, pixel-level
copy of the game, including its art.** Form: **written — a Kongregate private
message AND an email.**

Status: **owner-attested; evidence not yet archived in this workspace.**
This ruling takes effect now on the owner's word; the evidence step below is
about durability (accounts die, inboxes get purged), not distrust.

## Evidence step (owner TODO — high value, 5 minutes)

Save into **`reference/permission/`** (gitignored — private correspondence is
never committed or pushed):
1. A full screenshot of the Kongregate PM (sender profile visible).
2. The email as PDF or .eml (headers included).
Then tell the build session "permission evidence archived" so this doc's
status line can be flipped to EVIDENCE ON FILE.

## What changes

- **Art may now be copied 1:1**: tracing/matching drawings, poses, FX, UI
  chrome, and exact hues from the study frames is permitted. The fidelity
  target moves from "measured ceiling with original drawings" to **direct
  frame-match**.
- **Palette**: exact OG values allowed (the near-OG policy is superseded).
- **Dialogue/text authored by Lut** may be transcribed verbatim where it can
  be recovered (note: most Duels dialogue is unrecoverable — dead server).
- The fidelity gate may pin assertions directly against reference frames.

## What does NOT change

- **Third-party assets are NOT covered by Lut's grant**: e.g. SHS1's music is
  credited to Kevin MacLeod (separate license), device fonts (the OG used an
  unidentified commercial font — identify and license it, or substitute), and
  Fandom wiki text (player-written, CC-BY-SA — cite, don't paste).
- **Reference material stays local-only** (`reference/` gitignored) — the
  grant is to recreate, not to redistribute Lut's original files.
- **Scope caution until the grant's exact wording is checked**: assume
  personal / non-commercial recreation. Before ANY distribution or
  monetization, re-read the PM/email wording (and ideally confirm scope with
  Lut in one message: distribution? credit line? commercial?).
- **Practical note**: the surviving client SWFs are encrypted (preloader-
  decrypted at runtime), so asset *extraction* stays impractical regardless —
  the working method remains tracing from the frame corpus.

## Engineering consequences (next sessions)

- `docs/research/fidelity/FIDELITY_GATE.md` targets may now assert exact
  frame matches (colors already byte-exact; shapes/poses may follow).
- DIVERGENCES entries motivated purely by the old art restriction can be
  re-opened one by one — each still needs a measured target, never a guess.
- The measure-first discipline is UNCHANGED: permission removes the legal
  ceiling, not the need for measured numbers.
