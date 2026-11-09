# DEV-PERMISSION-LANE-2026-11-09 — fresh-session pickup for the Explosive Barrel permission lane

## State (as of 2026-11-09 22:2x KL)
- **Email: SENT + delivered 2026-11-06 12:41 KL.** Subject "Question about Straw Hat Samurai: Duels". Body (Kheshav's own casual wording, sent verbatim via Mail.app AppleScript, account "Google"):
  "Hi there, I am big fan of old game you guys made, straw hat samurai duels, would you allow 1-1 recreation game, or revival game played again? Thanks, Kheshav"
  Original draft + send log: workspace `.agent/shs-tmp/eb-email-draft.md` (v3 FINAL CANONICAL; older v1 with rebuild details kept there for reference only — NEVER use v1 wording).
- **Reply watch ACTIVE:** recurring task `eb-reply-watch` (cron `0 37 12 * * *`, daily 12:37 KL, delivery telegram) runs `/Users/kheshav/.jclaw/.jclaw`-workspace script `.agent/shs-tmp/eb-reply-watch.py`; writes `eb_watch` into the email-manager app + mirror `.agent/shs-tmp/eb-watch-mirror.json`. Window: 2026-11-06 12:37 → 2026-12-06 12:37. Status at Nov-9 12:37 check: PENDING — outbox drained, no reply, no bounce, 15 inbox rows.
- **Kheshav's locked strategy (v3):** ask in principle first; reveal rebuild/repo ONLY on a favourable answer. While withheld until then: repo (godman4242/shs-solo public), offline rebuild works (Ruffle + local stand-in backend), PvP prototyping plan.

## New directives (2026-11-09 22:19, this turn)
1. Repeat the permission ask on OTHER platforms. Drafts: workspace `shs-recovery/notes/EB-PLATFORM-DRAFTS.md` + rendered `EB-PLATFORM-DRAFTS.pdf`. FB block = his email body verbatim; X / YouTube / LinkedIn = the same ask adapted (still no build mention, no repo link). Sends are Kheshav's manual pastes — NO sender exists on this install for FB/X/YT/LinkedIn (email-only via Mail.app needs his explicit go; proven 2026-11-06; email already sent — do NOT re-email).
2. Do NOT mention what we are currently building in any dev contact (= v3 withheld-until-yes strategy; Kheshav re-confirmed 2026-11-09).
3. **Correction of record:** the "Leaning" note (2024-10-19 RTFD, the source file of the find-the-devs task) is NOT Kheshav's writing — he pasted it from another Discord user. DEVS-PLAIN.md/pdf attributions patched this turn ("your note" → "the note", author-credit line removed).
4. Context durability for Kheshav's session moves: repo RESUME_HERE paragraphs + Build Plans pending item 10 + two core memories recorded; this doc is the lane's pickup file.

## Targets (verified 2026-11-06/09 unless noted)
- Email: info@explosivebarrel.net (their site's obfuscated mailto; MX = their own domain, preference 0 — flaky; Gmail accepted the Nov-6 mail, no bounce yet).
- Facebook: game page facebook.com/strawhatsamuraiduels (official, linked from their site); studio page "Explosive Barrel" also exists on FB (search by name).
- X: @ExplosiveBarrel (x.com/ExplosiveBarrel; DDG-listed).
- YouTube: channel explosivebarrelgames (search "Explosive Barrel"); recent videos incl. LLM-NPC work.
- LinkedIn: linkedin.com/in/luther-chan-91064351 (Luther Chan, Founder & CEO).

## On-reply protocol (locked)
- Any reply on any channel → Kheshav forwards word-for-word → clawdia drafts the REVEAL follow-up (offline rebuild works: repo link shs…-solo; what remains: multiplayer server story; offer take-down/changes instantly).
- Objection → obey instantly: platform versions stop, repo fate decided separately by Kheshav ("keep it as is" only while no objection).
- Silence → watch ends 2026-12-06; platform pings are the interim nudge; decide next move at window end.

## Never-dos
- Never paste the repo link or mention rebuild/tests/PvP before a favourable answer.
- Never automate Kheshav's FB/X/LinkedIn/YouTube accounts (ban risk — 2026-09-07 Discord precedent, 5 account violations). Manual pastes only.
- Never re-email (already sent; double-tap reads as pressure).
- Never reply to EB without showing Kheshav the draft first.
