# DEV CONTACT — Explosive Barrel (2026-11-09)

Read source: Kheshav's old note "Leaning" (2024-10-19, attachments → workspace shs-recovery/notes/content.txt) — task: identify SHS:Duels owners/devs + contact paths; questions: was it sold, why the 2013 EGA contest page didn't work, were his three assumptions right.

## Verified facts (all probed 2026-11-09)
- **Official contact: info@explosivebarrel.net** — deobfuscated from the live homepage mailer script. This is the respectful first door (their own site's contact line).
- Studio: Explosive Barrel (Pte Ltd), Singapore indie, created 2008 by Luther Chan (Flash since 2004 as "LUT!"/"lutc"). Clients: Ubisoft, Coke, Cheetos, KLM-Air France.
- Site **live and current**: footer "Copyright © 2026 Explosive Barrel Pte Ltd"; two AI devlogs ("Using SKILL.md and OpenCode/ClaudeCode as a Game Engine", "LLM Controlled NPCs running locally on 8GB VRAM in Unity", updated Mar 2026, Qwen 3.5 9B/12B + KokoroTTS experiments). Luther is technically current — agent-skills ecosystem.
- Site's Duels entry: "Straw Hat Samurai: Duels (2013–2019)" — "multiplayer prequel to Straw Hat Samurai and SHS2. Even though Duels is no longer in operation, it is still remembered fondly by many." Honors: Epic Ads Contest Runner-Up, peak MAU 100K, 4.3/5 Kongregate, 85% ArmorGames. No PLAY button for Duels (screenshots + FB link only); SHS1/SHS2 still playable on the site (Ruffle).
- **Sold?** No public sale record for the studio. The *server vendor* was: PlayerIO/PlayerScale → Yahoo (May 2013) → The Games Platform Company ApS bought Yahoo Games Backend Services (Apr 2016), service still runs (our r.playerio.com probes). Candidate reason for Kheshav's memory.
- New entity "Explosive Barrel Pte. Ltd." UEN 202445636H incorporated 6 Nov 2024, status live, activity "development of computer games" (sgpbusiness.com). Same-founder re-registration **unverified** (no directors listed on the page).
- Personal names from Kheshav's note (LinkedIn/Facebook links in that note): Luther Chan (Founder & CEO), Choon Leam Julian Wong (dev 2012–13), Gordon WeiQi Chan (artist 2010–11), Jon Lew (intern 2010). Duels-era credits sparse; forum author "Tao_Oat" (uid 7) likely story/community hand. Personal emails NOT copied here (kept in the user's note only).
- Other channels: facebook.com/strawhatsamuraiduels (official), x.com/ExplosiveBarrel, youtube.com/explosivebarrelgames.
- 2013 contest page (playerio.com/competitions/ega2012/reviewgame/10702/...): frozen contest shop-window page, JS-era services dead in replay; never contained game files — nothing recoverable there. Corrected date reading: reviewed under the 2012-run competition, consistent with a ~2013 build/launch era.

## Note's three assumptions — corrected per project evidence
1. "Any version requires their server" → only multiplayer (PvP/wars/leaderboards) rode PlayerIO; single-player content recovered completely.
2. "Cannot make own server" → emulatable (protocol + 24 endpoint catalog known); lane planned, unstarted.
3. "Only the company has the game files" → false since our recovery: complete client + data library byte-exact + 7 packs + 3 tables.

## Outreach
- Draft email (subject + body) in workspace shs-recovery/notes/COURSES/DEVS-PLAIN.md §6 (also rendered DEVS-PLAIN.pdf). Sending = Kheshav's one tap from his mail app (no email tool on this install — verified: no send-capable connector; google-workspace skill is Drive/Docs/Sheets/Slides only).
- Probes saved: shs-recovery/notes/devprobe.txt (curl status matrix), pubgrep.txt, content.txt (his note as received).

## Lane status
OPEN (awaiting send + any reply). Rule: any reply → comply instantly with any "please don't distribute X"; repo stays clean regardless (reference/ never committed).

## CORRECTIONS (2026-11-09 22:2x)
1. This doc earlier said "no email tool on this install — verified: no send-capable connector". WRONG as stated: email IS sendable from here via exec + AppleScript controlling Mail.app (account "Google") when Kheshav explicitly says go — proven 2026-11-06 12:41 KL when the permission email ("Question about Straw Hat Samurai: Duels", body in .agent/shs-tmp/eb-email-draft.md v3) left the outbox and delivered. The standing no-send rule still applies (his go required each time). No such sender exists for FB/X/YouTube/LinkedIn (login walls) — those sends are Kheshav's manual pastes.
2. The "Leaning" note (2024-10-19 RTFD; source of the find-the-devs task) is NOT Kheshav's writing — he pasted it from another Discord user. Attribution lines above should read "the note's author", not "you/Kheshav".
3. Email update: SENT + outbox drained 2026-11-06 (their MX is flaky — Gmail accepted; no bounce through the 2026-11-09 check). Reply watch: recurring task eb-reply-watch (cron 0 37 12 * * *, daily 12:37 KL) until 2026-12-06 → eb_watch field in the email-manager app + .agent/shs-tmp/eb-watch-mirror.json; Nov-9 status PENDING, replyFound=false. On reply → notify via Telegram, then per Kheshav's v3 strategy reveal the rebuild/repo (withheld-until-favourable-answer).
4. New lane record: docs/handoff/DEV-PERMISSION-LANE-2026-11-09.md — other-platform drafts (FB/X/YT/LinkedIn, same ask-in-principle), status board, on-reply protocol, never-dos.
