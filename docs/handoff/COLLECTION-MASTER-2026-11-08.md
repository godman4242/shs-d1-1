# COLLECTION MASTER — SHS Duels (2026-11-08, Kheshav's "collect everything" sweep)

Purpose: the full inventory of what we HAVE, what we LACK, and every lane to get it —
so nothing is forgotten, and CC sees the same map. Companion to RESUME_HERE.md.

## The four boxes (Kheshav's ask)

**KNOWN KNOWNS — have in hand (verified):**
- All game binaries for every edition we've found: web payload (2016 final), web payload build-3 (2016-11-30 Wayback), android v0.706-era payload (21.7M inflated), duels 2015 web build (decrypted + 974-class decompile), loader family ×2 editions (+1 today: 2021 repack), mobile sound/music builds
- Full protection stack cracked: tinyloader RC4-64 (key = last 8 bytes) + magichtml/la config layout, RC4 level-1 ("uDbgBn15" for the 2015 build) — configs parsed byte-exact
- Decompiles: shsd3_web 974 classes/5.9MB, android corpus, config transcription (1,697 cites)
- Data XMLs: items, NPCs, skills (182), quests (android side)
- Dialogue frames, art asset extracts (partial)
- Client-side network protocol code fully decompiled (NetworkManager 129KB, ConnectionPIO 52KB)
- Game version string: **0.706 live TODAY** (version.swf params, live-confirmed) — previously "v0.68x hunt" was the wrong name for this; the live marker gives the real number
- Live-CDN same-bytes proof: r.playerio.com serves shs3preloader + shs3_payload **byte-identical** to our copies today; Y8 portal chain maps to the exact same content (nested wrapper → lb → la → preloader → version.swf → payload → descramble-XOR — all four steps recorded)
- 43-byte URL patch + local PlayerIO emulation (port 8765) from the old server work
- Build plans, calibration notes, claim ledgers, gauntlet tooling

**KNOWN UNKNOWNS — named, still missing:**
1. _v77/_v94/_v99 bodies — 403 live today (CloudFront 403 = missing-or-locked, cannot prove existence). Names only. Probably dead; lane left CLOSED unless new evidence.
2. The 0.75→1.0 float64 dial — which class/system owns it (+591 ABC). QUEUED awaiting GO.
3. The second DoABC envelope (#4024) same-size code edit 25,295 B — meaning unknown. QUEUED.
4. The 163 same-size/different-byte tags — classification. QUEUED.
5. Real .sol save files — NONE on this Mac (searched). The .sol lane needs a sample file; old-PC hunt is the only known source (Kheshav's hardware, his action).
6. Full web build version ladder (which versions shipped when; version.swf Wayback history — CDX refused, 2 retries, parked).
7. Multiplayer BACKEND game code (server-side Duels logic, room/queue/message handling) — platform-side, do not connect (risk lane; see PlayerIO lane verdict below).
8. Server-half of the Duels message protocol (we have the client half; the response side must be inferred or emulated).
9. Web-distribution version differences: every portal edition (Armor Games id 17677 today, Y8 build found today = same content chain) — no content delta found; lane closed for Y8, AG unprobed for SWF.
10. Original dev comments / source — known gone (decompile is the only source).

**UNKNOWN KNOWNS — we possess but haven't asked yet:**
- The client code itself contains the complete send-side protocol enum; a full opcode table needs no server access (extraction job — queued as part of backend grounding)
- MainTimeline.sharedObject read/write calls = the .sol schema is WRITTEN IN OUR DECOMPILE; the queued "extraction" job is 90% reading our own files
- The forum corpus (138 General threads, 1,631 posts, 20 pages) — we KNEW of it after today's fetch; content-mining not started (patch notes / balance chatter / dev answers could name the dial's system!) — HIGH-VALUE read lane, docs-and-probes class, can start on GO
- Wiki content pages (32 links found: characters, quests, exploration, leveling, tips, clans) — not yet fetched; fan documentation = independent check on our data
- comic.php page + "Read the SHS Comic" link = official comic pages (page=-1..25!) — lore/archive value; fetchable
- Explosive Barrel studio site had /flash/ with their other games — context/history only, low value
- Site 500-row CDX limit was hit; deeper pages (page=2) not enumerated — cheap to continue

**UNKNOWN UNKNOWNS — managed only by sweep culture (red-team yourself, collect anyway):**
- Whatever the dial actually controls (could be damage, could be XP curve — will change calibration interpretation)
- Whether the 163 tags hide gameplay changes vs re-export noise
- Whether version 0.706 == the site payload we hold (version.swf says 0.706; our payload could BE 0.706 — unproven: no version string inside payload found yet)
- Event/seasonal logic (wiki/forum may document events whose assets sit unused in the build)
- PlayerIO backend data model (only knowable by connecting — deliberately NOT done)
- Old-device .sol saves (Muhammad-era "same PC" claim) — only Kheshav can check old hardware
- 2013-era builds (site live 2013-03! any pre-2015 build differences) — 500-row CDX cut off

## THE PLAYERIO LANE VERDICT (Kheshav's risk/reward ask)

What the door is: the game's multiplayer "clubhouse" (PlayerIO platform, rented by Explosive
Barrel). Files door (CDN) = open and harvested. Clubhouse door (api.playerio.com + the game
room) = live third-party service.

Reward if connected: ground truth for multiplayer messages (watch real duels flow), possibly
live leaderboards/room data, proof of how the server answers → shs-solo PvP becomes exact,
not inferred.

Risks (checked on 2026-09-07 Discord incident precedent — 5 account violations):
- ToS: PlayerIO is a commercial platform; unauthorized clients/automation normally forbidden.
- Detection: our connect = abnormal traffic in THEIR logs; worst case they hard-close the
  legacy game's remaining endpoints (kills the open files door too — one door shared two
  hallways).
- Irreversibility of consequences: a platform-side ban/warning is on THEIR books, not ours.
- Data: if any other players' data flows, handling it = privacy lane; must not store.
- Our emulation already replaces it: reward is nice-to-have (truth), not need-to-have.

Decision: DO NOT CONNECT on collection sweeps. Only if a specific blocker needs ground truth
AND Kheshav explicitly says go AND we go read-mostly, rate-limited, no fake accounts, logged
step-by-step. This verdict recorded; revisit only on his word.

## Collection checklist (status 2026-11-08)

DONE TODAY (live/probe class, no GO needed):
- [x] Live CDN: preloader + payload byte-identical (sha-verified)
- [x] Live version.swf: version=0.706, forceupdate=false, payload URL (site), androidpayload URL (CDN liveupdate/) — both recorded
- [x] LIVE android payload fetched (15.1MB) — content byte-identical to our android decoded (sha 264335d3f84958f2 inflated-equal)
- [x] 2021 CDN shs3.swf captured earlier today; decompiled (loader repack edition)
- [x] Y8 portal build captured + whole nested chain cracked; = same content; lane closed
- [x] No .sol on this Mac (searched) — flagged old-PC hunt
- [x] Duels-forum archive located (138 threads General) — file forum_fid21_20160408.html saved
- [x] comic.php / publishers.php / watch snapshots saved (small)
- [x] Wiki main page snapshot saved (55KB, 32 content links)

QUEUED (waiting on GO or bigger session):
- [ ] Forum corpus read (all 138 threads or targeted: announcements, update, balance) → version history + possible dial mentions [P0, read-only, docs-class]
- [ ] Wiki content pages fetch (all 32) → cross-check data XML vs fan knowledge [P0, read-only]
- [ ] Comic pages 0..25 archive + view [P1]
- [ ] .sol schema extract from decompile + (his action) old-PC save hunt [P0 schema / P1 files]
- [ ] Client protocol opcode table from NetworkManager/ConnectionPIO (no server needed) [P0, analysis-class → GO needed]
- [ ] Dial trace (DoABC#143), 163-tag classify, #4024 same-size edit — the three analysis jobs [GO-needed]
- [ ] Version-ladder history: version.swf captures over time (CDX rate-limited tonight) [P2]
- [ ] _vNN lane: parked (403; verdict recorded) [P2, closed unless evidence]
- [ ] Audio (MP3 asset) full extraction [P1, fan-value]
- [ ] Armor Games SWF probe (their CDN version of the build) [P2]
- [ ] 2013/2014 CDX pages (page=2) deep scan of site captures [P2]

Rule (unchanged): analysis jobs need Kheshav's GO; read-only collection of public
archives/live files is allowed without asking.


## OUR-OWN-SWEEP — 2026-11-08 16:45–17:00 KL (Kheshav Directive: "go back to the source, not the photocopies")

Goal: make OUR master collection from ORIGINAL sources, not only IA's copies.

**The original house is demolished:** strawhatsamuraiduels.com + www = NXDOMAIN (the address is gone from DNS). explosivebarrel.com = parked lander (76.223.54.146 "lander" page). explosivebarrel.net = refuses non-browser clients (406/403). The studio's own pages are gone.

**LIVE sources still standing (we pulled from them ourselves today):**
- r.playerio.com CDN (= game's own asset server): preloader + payload + shs3.swf + version.swf (0.706) + android payload — all LIVE-fetched, sha-ledgered. This IS the source, not a photocopy.
- Portals STILL SELLING the game (our own downloads): Y8 (162,297 ad544aea) + Snokido w8.snokido.com/games/flash/shsduels.swf (**byte-identical to Y8: ad544aea64ab89a6**) → the portal wrapper is ONE distribution package; inner chain reaches the identical 0.706 content. Two independent live fetches, same bytes = strongest provenance we can get.
- SilverGames/Miniplay/Funky Potato/YaksGames/Armor Games pages = ruffle-emulated shells without swf refs in the served HTML (their game loaders fire client-side; their game files were NOT exposed to plain GET — left unprobed beyond that).

**Sibling artifacts collected (SHS1 not Duels — context lane):**
- AG HTTrack dump (IA item armorgames, 3,637 files): straw-hat-samurai-2377817f.swf = **SHS1 Armor Games build** 883,538B CWS v9 sha16 4ab122b74358aa0b, decompiled 165 classes (code name "shunpo", MochiAd, StatsManager, overworld) — a DIFFERENT game (SHS1). Kept at reference/decompiled/ag_strawhatsamurai (gitignored reference/, like the rest).
- IA item 'shunpo' (5.9M, E4's rip of SHS1, ruffle-archived) — same sibling, alternative packaging.
- flashmuseum.net + newgrounds portal/view/462631 = SHS1/SHS2 (not Duels) online.

**Community knowledge lanes (text, not files):**
- ResHax topic 15737 "Straw Hat Samurai Duels" EXISTS (the old zenhax thread mirrored) but is LOGIN-GATED — future optional read via operator's account; not scraped.
- Flashpoint Coverage: unverified (no public DB search endpoint; the DB rides inside ~80GB Ultimate dumps on IA — heavy lane, P2, only if a specific need shows up).

**What our-own-sweep changed:** nothing about Duels' CONTENT (our bytes still = the only game bytes that exist publicly) — but provenance upgraded: ours == CDN == portal pipeline (two live shops + one live server, all agree). The collection is self-strengthened, no longer dependent on Wayback alone.

### gib-roms door-check (17:10 KL, added)
Probed Flashpoint's public file mirror `download.flashpointarchive.org/gib-roms/` (shards `Games/` 10,000 files + `Nga/`): every file is an **opaque GUID.zip** — no game titles in filenames, so single-file fishing by name is impossible without the catalog DB (which lives inside the ~80GB Ultimate download). Extra door also closed. Verdict unchanged: heavy lane confirmed.
