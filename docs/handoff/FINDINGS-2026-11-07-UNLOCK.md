
# 🎉 FULL UNLOCK ACHIEVED — 2026-11-07, 21:15–21:35 KL (this session)

## Verdict
**The 2015 web Duels main SWF (shsd3) is now FULLY DECRYPTED and decompiled.**
"one encrypted file stands between" is RESOLVED — there is no more encrypted file.

## What we now have (all in shs-recovery/swf/, byte-verified)
- `shsd3_DUELS_decrypted.swf` — THE main game, CWS v17, fileLength 11,434,597 (11.4MB uncompressed), inflate lands EXACTLY on that number. 974 classes / 5.9MB ActionScript decompiled to GAMED-decomp/notes (real names, not stubs).
- `shsd3_DUELS_unlocked_wrapper.swf` — the magichtml-protected wrapper (blob 9 of the outer file, decrypted), CWS v10.
- `shs3_loader_la_decrypted.swf` — the small la-class loader inside the PRELOADER (blob 9), 164,369 uncompressed.
- `shs3preloader.swf` — untouched original.
- Decompile dirs: notes/GAME-decomp (MAIN GAME, la+Comp+MD5+DomainMsg+~570 root pkg + shs3_fla + playerio), notes/loader-decomp, notes/main-decomp (outer stub), notes/preloader-decomp.

## The REAL protection chain (fully explained, all verified from decompiled code)
1. **Outer: tinyloader RC4 scheme ("lb" class).** In BOTH shs3preloader.swf AND shsd3_DUELS_protected.swf. DefineBinaryData blob; RC4 keystream with key = blob's OWN LAST 8 BYTES; only the first 64 bytes are encrypted (SWF header + start of zlib). Decrypt → real SWF header + intact zlib body. This is why scanners see no SWF signature.
2. **Inner: magichtml SWF Protection ("la" document class + com.swfdefender.{MD5, Comp, DomainMsg, IntUtil}).** Embedded config ByteArray (class resource, exported by ffdec as 9_*.bin, 6,688,209 bytes):
   - layout: magic(u32) width(u32) height(u32) level(u8) keyLen(u16) key(domainsLen, domains "!=!=-separated) allowLocal(u8) showDomainMsg(u8) doNavigate(u8) navUrlLen(u16) navUrl showMsg(u32) msgType(u8) msgLen(u16) msg watermark(u8) showLogo(u8) [logoX,Y,alpha] password(u8) [passwordhashLength, passwordhash, passwordtext..., passwordsubmit..., passwordinvalid...] payload(rest).
   - **shsd3's real values (VERIFIED tonight):** magic=0x000000e4, **width=800 height=690**, **level=1 → RC4 (Comp.C2)**, **keyLen=8, key = ASCII `uDbgBn15`** (= bytes 75 44 62 67 42 6e 31 35), domains=NONE, allowLocal=1, showDomainMsg=0, doNavigate=0, msg = magichtml's "You are not allowed to view this Flash movie..." block message, watermark=0, showLogo=0, **password flag = 0** (NO password lock, stored key present).
   - payload = remaining 6,687,980 bytes; ONLY first 64 bytes RC4-encrypted with that key; decrypted header → CWS v17, zlib body intact, inflate == fileLength EXACTLY.
3. **Password path exists in code but UNUSED in this build** (flag=0). `displayLogin` + `unlockProtection` would MD5(compare typed password vs config.passwordhash) and Comp.C2 decrypt with the password string itself. Relevant only if a DIFFERENT captured SWF turns up password-locked — the method is fully known.

## False-alarm correction (IMPORTANT, was reported earlier today)
The earlier "PASSWORD-LOCKED: payload key is the user's password" verdict from swfdefender_unwrap.py on shsd3_DUELS_protected.swf came from parsing GARBAGE: it treated blob-9's head as a config blob (wrong offset — the config lives in an EMBEDDED CLASS resource, not at the head) — every field printed nonsense (magic=2242183137 etc.). Tonight: decompiled the actual stub, found the true config location, re-parsed correctly → password=0, stored key present. No password, no dictionary attack needed.

## What the recovered game contains (highlights)
- Full PlayerIO client SDK (playerio/generated/*) — ConnectionPIO.as 52KB, NetworkManager.as 129KB.
- Root-package game classes: DuelModeUI, DuelSlot, DuelIntroBar, DuelLeaderboardUI/Field, DuelRequestDialog, ArmorGames, ConnectionP2P, QueryManagerPIO, OverworldHUD (ref at NetworkManager), MCSPlayer, PlayerPanel, Bigmap(+Room/Exit), BankUI, CraftingUI, quests (ActiveQuest/CompletedQuest/XMLQuestWave/AbandonQuestDialogBox), clans (CreateClanDialog/ClanSymbol), CharacterSelectForm/CreateCharForm/ChangeNameDialog/CharDelete, 30+ projectile classes, 40 shs3_fla frame classes (Town_, Minimap_, warchoose_*, InteractUI_*, ProcGenSky...).
- MainTimeline: holds `sharedObject:SharedObject` (.sol save machinery!), tinyLoader, loadingScreen, introVideo, lang.
- Version string: not found by quick greps (v0.68x search empty in scripts) — version display likely lives in loadingScreen asset or XML metadata; check later if needed.

## Next steps for the project (not done tonight)
- Ruffle test run of shsd3_DUELS_decrypted.swf (does it boot? likely yes — clean SWF).
- Diff vs the 2016 mobile/E4 build's logic (60 classes) for calibration of the 1:1 rebuild — the web build is the version players remember.
- .sol save schema comes from THIS build's SharedObject usage (MainTimeline + saving flows) — feeds the Build Plans pending item (add .sol import to shs-solo).
- PvP arena logic (DuelModeUI etc.) is now readable — feeds the SHS PvP backend design notes.
