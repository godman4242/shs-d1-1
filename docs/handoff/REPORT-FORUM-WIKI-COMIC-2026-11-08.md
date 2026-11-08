# FORUM + WIKI + COMIC READ — 2026-11-08 (17:50–19:10 KL)

## What the Wayback actually holds for the community side
(verified by fresh CDX + direct id_ fetches, every miss logged):

### FORUM (forums.explosivebarrel.com, MyBB)
- **Thread BODIES are gone** — the only showthread.php captures Wayback kept are truncated-URL "thread does not exist" error pages (80 rows, all useless). Individual tids (1154 story guideline, 25 SEASON 2, 93 Change log...) return 404 / not-archived. **Thread TITLES survive** via the archived BOARD pages.
- **Section page fid=21 archived** (2016-04-08, 14,925 B): the SHSD section = 6 boards:
  - `General` fid24 — 9 pages
  - `Suggestions` fid22 — 17 pages
  - `Bug Reports` fid23 — 9 pages
  - `Clans` fid30 — **24 pages** (biggest — the clan scene was huge)
  - `Report player/abuse` fid31, `Off Topic` fid32
- **Board page-1 snapshots archived** (2016-04-08, ~64KB each): 20 newest threads per board with author+replies+views+dates extracted to `notes/threads.json`.

### The dev/community archaeology (from titles+dates, verified quotes below)
KEY GENERAL THREADS (page 1, newest = Dec 2016 → Oct 2016):
- tid1154 **"[CONTAIN SPOILERS] Improved Story Guideline from Tao's Original guideline"** — 23 replies, 962 views, 3 pages, by "Kiritou the wise and ferocious", last post 12-13-2016. Tao = the game's writer; this thread = community-built STORY DOC (bodies lost).
- tid1130 "this....is....terrible..." POLL — the 0.7-era community backlash wave.
- tid1137 "rebalance counterstances" — balance outcry.
- tid1219 "red kanjis other 4 elemental ones (fire water earth wind)" — players REQUESTING the elemental system (matches the embedded element data!).
- tid1217 "RIP SHSD" (Dec 2016) + tid1243 "Hybernation" (Jan 2017) — **the exact moment the game was abandoned**.
- tid1165 "Stolen and erased account! :@" — 3 pages.
- tid1098 "Stats calculator Tool" + tid364 "Mapping and Tracking Spreadsheet" — community tools existed.

SUGGESTIONS BOARD (fid22, 17 pages):
- tid86 "Feature Wish List" by **admin** (sticky, 2015) — dev-collected wishlist.
- tid438 "Yokai" — 35 replies, 4 pages (Jan 2017).
- tid1159 "**friend or foe concept(avatar) season 2**" — Season 2 referenced in 2016 by players too.
- tid1164 "**Unlock elemental mastery after Dan 10?**" — element mastery tied to Dan rank (matches "New Game + ... specialize in an element" string).
- tid1184 "New Skill in 2017", tid1229 "Fragments" (12 posts), tid1245 "SHSD Survey" (5 replies), tid1253 "Currency" (6), tid1249 "Gold tokens" (6).
- tid1219 also here: "new enemies... more story" — 8 replies.

CLANS (fid30):
- tid1086 "War Room Overhauling" (6), tid1141 "New war room system" — clan-war UI rework in progress when dead.
- tid16 "Aoi Hoiru Clan Discussion" by **Tao Oat (uid 7)** — THE dev himself ran a clan.
- tid195 "How to become a clan leader".

BUG REPORTS: tid1038 "Rolled Back" (56 replies, 5 pages — the data-rollback catastrophe), tid1061 "Why wont the game work :(", tid1071 "Bugged HQs".

### TIMELINE RECONSTRUCTION (titles + lastpost dates)
2015: game live, changelog sticky pinned. 2016 H1: steady play, clans form. 2016 H2: 0.7 update wave → polls ("this is terrible"), stance-rebalance demands, Season-2 chatter (tid25, 25 replies, Dec 2016), story-guideline doc (Dec-2016). **Dec 2016 → Jan 2017: "RIP SHSD" + "Hybernation" = dev walked away while Season 2 was still unreleased.** 2017-2019: boards fill with spam; the forum dies with the site.

### WIKI (strawhatsamuraiduels.wikia.com, Fandom/Fallen)
- CDX `/wiki/*`: **7 rows; true content captures only the MAIN page** (5 snapshots 2015-11-10 → 2018-08-16, growing 15,374 → 48,160B) + robots.txt + a 404. **No character/topic page archived** (Category:Characters, Hiroshi, Jinbei, etc. = 404 never-archived or 429-locked this pass).
- Main-page growth curve = the wiki DID gain content 2015→2018 but the article bodies are lost to Wayback.

### COMIC (www.strawhatsamuraiduels.com/comic.php + images/comic/pageN.jpg)
- comic.php archived 4×; the source reveals the comic is just **./images/comic/pageN.jpg pages** with nav `page=-1` … `page=25` (26+ pages existed).
- JPGs recovered so far: **page0 (120,610B), page5, page9, page10 (101,222B), page14, page20, page21 (107,115B)** = 7/26+ pages byte-real; rest 429/404-locked this pass (crawler kept retrying — background crawl continues).
- **This is the OFFICIAL manga** — "Read the manga to learn more about the story of Straw Hat Samurai: Duels" (og:description) — the story canon for the Season-2 arc, page art included.

## Verdict
- **Forum: titles-timeline only (bodies unrecoverable)** — still gives a verified dev-plan timeline (element kanji requests, war-room overhaul, Season-2 chatter, the death dates).
- **Wiki: main-page growth only** — articles lost.
- **Comic: 7 official manga pages recovered and counting** — real story canon artwork.
- Combined with yesterday's GAME-BRAIN find (Season-2 quest slot embedded in 0.706 + NewGame+/elements/housing data), the "what were they planning" question now has sources from all three original channels.

## FINAL ADDENDUM (2026-11-08 20:50 KL)
- crawl3 finished: final comic tally **8/30 pages (nav -1..25)** — page25 landed on the last retries; pages 0,5,9,10,14,20,21,25 survive. All remaining candidates exhausted 429 retries or returned 404 (never archived).
- Own-photograph check executed live: explosivebarrel.com now answers with the 114-byte `window.location.href="/lander"` JS redirect for EVERYTHING — including comic.php itself and /images/comic/pageN.jpg (probed page-1..page29 + www). The original files are no longer hosted; the domain is a parked shell.
- Wiki subpages: confirmed lost (every crawl pass 404/429; no new wiki hits).
- Deliverable: `reference/comic-2026-11-08/SHS-Duels-official-manga-recovered.pdf` — 9-page PDF (cover note + the 8 surviving manga pages, in page order).
- Conclusion: 8/30 is the final achievable set from any source; the missing 22 exist nowhere reachable.
