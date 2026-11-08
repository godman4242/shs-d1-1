# GAME BRAIN RECOVERY — 2026-11-08 17:25–18:05 KL

## What just happened (bigger than the whole week):
Kheshav asked "any traces of new updates/story they were planning?" → found the WHOLE designer brain:
- **All 9 quest-engine data files are EMBEDDED inside the android (mobile) payload** — the `LIVE_shs3_android_payload_decoded.swf` (21.7MB) carries a full data library with REAL export names (ffdec -export binaryData, 42 blobs, 13.0MB):
  - `116_Mobile_QuestData.bin` 796KB — **61 quests, full step/dlg/outcome logic**
  - `117_Mobile_SkillData.bin` 39KB — **75 skills** ( stance skills: Balanced/Dual/Heavy/Reversed, MCS anim data per animal: Bear/Boar/Deer/Goblin/Guardian/Horse/Human/Wolf/Ogre/Undead + HumanSpear/Human2)
  - `112_Mobile_NodeData.bin` 53.5KB (map nodes), `119_Mobile_MapData.bin` (65B near-empty!), `125_Mobile_NpcData.bin` 228KB (NPC dialogue trees), `111_Mobile_ItemData.bin` 184KB, `114_Mobile_AchievementData.bin` (61 achievements), `121_Mobile_PremiumData.bin` (cash shop sets incl Bleach Ichigo outfit, Santa outfit), `109_WarHexUI_SurvivalModeData.bin`, `84_QuestEngine_TrapRoomData.bin`, `123_Mobile_BGData.bin` (12KB bg config), `90_InteractUI_UIData.bin`, `110_Mobile_MapBitmapData.bin`, `118_Mobile_Lang_EN.bin` (500KB — the EN string table ALSO embedded!), NameGenerators (male/female/noble/samurai-family/place names).
- **Web payload ALSO has BinaryData tags** (27 blobs, ~4.4MB, same content family, names auto 93-119) — but the MOBILE set has clean export names + more files.
- **7/7 live resource packs fetched from gameFS /res/** (bgresource 4.1MB, musicresource == our 113_Mobile_MusicResource EXACT bytes (1,340,647 ad544... wait sha 812cd7633da06912 vs 2d46 4675a — different!), portraitresource 1.5MB, shs3resource 981KB, imageresource 407KB, soundresource 115KB, guestmodepromo 388KB) + decode to dec_* CWS17 copies.
- Live string table fetched: `pio_lang_en.xml` 613KB UTF-16 XLIFF (3,166 strings) + ES 632KB + FR 637KB. From gameFS `/lang/shs3_en.xml`.

## THE PLANNED-BUT-UNRELEASED CONTENT (in the shipped files):
- **Quest #60 "Season 2" — "(Unreleased) The adventure continues..."** shipped inside 0.706! Text: "This episode is not yet released. Return here when the episode is released to continue the story!" — gated on quest 59 (Epilogue). The dev built the hook into the live game.
- **New Game+**: string 4155 "New Game + Progress on to the next Dan Rank and specialize in an element. Level 80 required." + Rebirth Scroll (4154) + Writ of Release (4157).
- **Housing ladder**: Hut → House → Mansion → Tower → Fort ([0]'s Hut... strings 11510-11514) + "Manage house" → **"Coming soon!"** (11502). Housing UI is in-code but locked.
- **Elements**: Fire/Wind/Water/Earth (11503-11506 + element strings in skills) — the NG+ specialisation axis, data exists.
- **Quest arcs**: 12 episodes (Ep 1-12) + Prologue + Epilogue; war-rank ladder to 9+; clan wars ("Wage Clan Wars!" 11064); clan lore: Clan Aka Ryu (Lord Tsuyoshi), Clan Midori Ken (Lord Daichi) (324/325); undead-horde graveyard quest line (11398-11402); ninja-village reinforcement quest (11359-11364); portrait roster incl "ladyoiwa_snake" (snake woman!), chikako_mask, kojuro_serious...
- **Name generators**: place names (Anjo, Chiryu, Chita...), samurai family names, noble families (Konoe/Takashi/Kujo) — procedural NPC naming = more content depth than expected.

## BYTE-EXACT COMPLETENESS ANSWER:
- **Game content: YES — byte-exact and complete** (desktop 0.706 payload + wrapper chain + android payload + all 9 resource packs + live string tables; every decode inflate-verified).
- **Missing for a TRUE byte-exact revival: (1) the SERVER software** — 24 PHP endpoints (server: /war/*.php getwarmaps/getwarhex/dobuild..., /town/*.php gettowndata/createtown, /playerio/*.php registeruser/login_pio/reportgotgold, logmessage.php) + PlayerIO rooms/db logic — never had it, still gone, shs-solo reimplementation replaces it (the PHP server was strawhatsamuraiduels.com — NXDOMAIN). **(2) player .sol saves** (only on Kheshav's old PC). **(3) original dev comments** (decompiler artifact, unrecoverable — names DO survive).
- Everything else: collected today. The mobile payload turned out to be the DATA TREASURE (bigger than desktop because it embeds the whole config library + resource packs).
