# L0 critic — economy — HUNTER LENS

**Reviewer:** blind critic (did not see the surveyor's reasoning).
**Method:** opened every cited artifact first-hand; then hunted the STILL_UNHELD / PARTIAL rows.
**Date:** 2026-08-13.

---

## Headline

The survey is **honest and almost entirely correct on its own cites** — 15 of 19 rows verified
verbatim against the file I opened myself. But it **under-claimed in the one place that matters
most to the whole gauntlet**, and it **inverted a §0 invariant** in one place.

Two things I found that the surveyor said were unavailable:

1. **THE STRING TABLE IS FOUND.** GAUNTLET §0's standing KNOWN BLOCKER — *"`<name>`, `<desc>`,
   `<displayname>` are NUMERIC IDS indexing a string table NOT YET LOCATED"* — is **dead**. The
   table is `Mobile_Lang_EN` (`[Embed(source="/_assets/118_Mobile_Lang_EN.bin")]`,
   `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5`). It extracts in **1.6 seconds**
   from `reference/decrypted/shs3_android_payload_decoded.swf` with the repo's own bundled ffdec.
   It is a UTF-16LE XLIFF with **5,110 `<trans-unit>` rows**, keyed by `resname` 0–9010 plus
   `IDS_*` quest keys. `itemdata.xml` item 2100 `<name>4000</name>` → **"Small Soldier Pill"**;
   `<desc>4172</desc>` → **"Replenish your AP without waiting!"**.
2. **`121_Mobile_PremiumData.bin` is extractable and I read it.** The surveyor asserted a negative
   about a blob it never opened. Its actual content: 176 `<item>` ids across `<default>`,
   `<special>` and **23 `<rotation>` `<set>` blocks** — the premium vendor's whole stock table,
   verbatim. (Its *conclusion* — no real-money price tiers in there — survives: zero price strings.)

Neither of these is in the journal. Both change the lane's ceiling.

---

## Reproduction command (anyone can re-run this)

```
java -jar reference/tools/ffdec/ffdec-cli.jar -export binaryData <outdir> \
     reference/decrypted/shs3_android_payload_decoded.swf
iconv -f UTF-16LE -t UTF-8 <outdir>/118_Mobile_Lang_EN.bin > lang_en.xml
```
→ 42 blobs. `reference/preservation/shs3_android_payload.swf` (the un-decoded copy) FAILS with
`EndOfStreamException` — you must use the `decrypted/` one. That is probably why nobody had done it.

**Key proof that `resname` is the lookup key, not `id`:**
`reference/decompiled/shs3_android/scripts/fl/lang/Locale.as:301-307` —
`var _loc2_:String = param1.attributes.resname; ... stringMap[_loc2_] = _loc3_;`
and `:168-173` `loadStringEx` returns `stringMapList[lang][key]`. So
`LangManager.getString(4000)` → `resname="4000"`. Confirmed empirically: `getString(88)` at
`InteractUI.as:1061` (the not-enough-money path) → resname 88 → *"You do not have enough money to
make the purchase."*; `getString(637)` at `InteractUI.as:1068` → resname 637 → *"No weapon
equipped."* Both match their call sites exactly. (`id` and `resname` have drifted — id 618 carries
resname 637 — so anyone keying on `id` gets garbage. Key on `resname`.)

**Provenance caveat that must ride along:** this table is the **v0.682 ANDROID** embed. I also ran
the same extraction on `reference/decrypted/shs3_payload_decoded.swf` (the web v0.717 payload): it
yields **exactly the 27 already-known bindata blobs, no lang table**. `LangManager.setLanguage`
(`LangManager.as:52-56`) shows why — the web build fetched `shs3_en.xml` from the dead server. So
the surveyor's `economy/provenance-android-0682` caveat now covers the names too.

---

## Names this unlocks in *this lane alone* (spot-checked, all verbatim from the table)

| ID | resolves to |
|---|---|
| trade good 0–4 (`getString(4162..4166)`, `InteractUI.as:545-548`) | **Tea Leaves** 10c · **Silk** 20c · **Spices** 100c · **Ceramics** 200c · **Opium (Illegal)** 200c |
| `XMLShopData.as:45` peddler `name = 2002` | **Peddler Shop** |
| `XMLShopData.as:84` merchant `name = 2012` | **Merchant Shop** |
| `InteractUI.as:234` innkeeper `getString(5060)` | **Innkeeper** |
| war hexes `getString(578..581)` | **Building Forward Base** · **Digging Tunnels** · **Building Barricades** · **Upgrading Village to Town** |
| Cho-Han `getString(555/556)` | **Cho (even)** / **Han (odd)** |
| skill 1000 `<displayname>6000</displayname>` | **Light Stance Mastery** (+ `<desc>6001</desc>` = the full stance blurb) |

The last row is not my unit — I include it because it proves the table is **global**, not
economy-local. It resolves item, skill, vendor, UI, war and quest (`IDS_*`) namespaces.

---

## Verdicts, one line each (own cite in the structured output)

| claim | verdict |
|---|---|
| sell-price-formula | **stands.** Verbatim at `Item.as:1582-1593`. `sellPercentage` really is dead — one hit in the whole bundle, the declaration at `ShopUI.as:58`. |
| repair-weapon-cost | **stands.** `InteractUI.as:1058` `cost = getCurrentNodeLevel() * 10`; `:1073-1076` `if(weapon.uses > 1) weapon.uses = 1`. |
| coins-per-kill | **stands.** Verbatim at `EnemyPlayer.as:1293-1300`. The frame-vs-doc reconciliation is sound. Field-mob path confirmed at `NPC.as:838-846` (lootType 0 → `1*qty`, 1 → `5*qty`). |
| xp-formula | **stands.** Verbatim `NPC.as:166-190`; `getGreyLevel` body 95-110; `msg.lvl * 5 + 45` at `NetworkManager.as:1268`; ×3 / elite split at `EnemyPlayer.as:1318/1322`. |
| trade-goods-arbitrage | **stands.** `InteractUI.as:1558-1585`. Nit: 5 slots, only **4 distinct** price/variation pairs (cases 3 and 4 are both 200/30). Stat ids 20054-20057 confirmed at `:545-548`. |
| crop-price-oscillator | **stands.** `:105` and `:497-502`. |
| service-prices-are-formulas | **stands.** forge `:1002-1008`; inn `:229`; stables `:241`; toll `:1406`; reinforce `:1083`. Cite typo: the reagent range is written `1102-1047` (reversed); the bands are actually `:1015-1046`. |
| gold-coin-exchange-rate | **stands (PARTIAL, honest).** `:918-926` verbatim. |
| item-price-table | **REFUTED — material.** Counts are exact (982/550/304, I re-grepped). Its lane_impact *"the table is still unlocated… Never claim a priced item's name is held"* is now **false**. |
| five-vendor-generators | **stands.** All five verified; barber really is 49 → 16 (`:141-143`); merchant really ships `[]`. **Under-claimed:** the premium lists are now held too (see below). |
| war-room-build-costs | **stands.** `WarHexUI.as:1332-1387`. Arithmetic nit: initiation charges 500 *and* sets `cost` to the full total, so a Forward Base costs the donor pool **10,500**, not 10,000. |
| duel-token-economy | **stands.** `StatsManager.as:158-166`; ×2 buff at `:1134-1136`; clamp at `:2374-2378`. |
| starting-wallet | **REFUTED — material.** §0 invariant inverted. See below. |
| coin-purse-cap-ladder | **stands.** `StatsManager.as:2632-2650`. Good catch; genuinely absent from the ledger. |
| cho-han-is-ev-neutral | **stands, with a sharpening.** `:1810-1836` verbatim. But `changeGold()` clamps to `getMaxCoins()`, so near the purse cap a win is **truncated** → Cho-Han is EV-**negative** there, not neutral. Conclusion (not a faucet) is if anything stronger. Also `int(Math.random()*6)` yields 0–5 and `gotoAndStop(dice1)` on frame 0 is a shipped off-by-one; parity is unaffected (0–5 is 3 even / 3 odd). |
| quests-pay-no-coins | **stands.** I re-ran the scan independently: **386** `<outcome>` blocks, **0** with `<id>11</id>`; **77** `<reward>` blocks whose only children are `exp`(69) / `loot`(19: id,qty,chance). I also checked the generic fallback `else { changeStat(this.id, this.modify) }` at `XMLQuestOutcome.as:68-70` — no outcome uses id 12 (`STAT_HGOLD`) either, so quests pay no *gold* as well. |
| prosperity-daily-sim | **stands (PARTIAL, honest).** `HistoryItem.as:239/283/299/303/307/311`; `NetworkManager.as:2042-2053` is a bare `send("townpros",…)` — the client genuinely does not compute. |
| iap-price-tiers | **STILL_UNHELD verdict stands — reasoning corrected.** I extracted the blob it said was unavailable. 176 `<item>` ids, **zero** price/currency/tier strings. The conclusion is right; the ground given for it was an assertion about an unopened artifact. |
| provenance-android-0682 | **stands, and I extended it.** `clientVersion = 0.682` at `StatsManager.as:30`; the two android bundles are byte-identical for `InteractUI.as`/`Item.as`; the web payload is 652 asset-only classes. New: the web SWF's binaryData is *only* the 27 known blobs — no logic, no lang. |

---

## The one place the survey inverted §0 — `economy/starting-wallet`

The claim reads the wallet off `StatsManager.initNewPlayer` (`:689`, values at `:705-710`) and
concludes the repo's `src/config/profile.ts:10` *"(100 coins / 3 gold)"* is contradicted, because
`setPlayerStats(STAT_HGOLD, 0)`.

**I opened a frame.**
`reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0018.jpg` (1024×576), cropped
`crop=iw*0.45:ih*0.10:iw*0.28:ih*0.09` and upscaled ×4 lanczos. Visible: the PLAYER sheet currency
row reading **"…425 COINS"**, a gold-coin icon, **"2"**, label **"GOLD"**; beside it the level fan
**7** and **"14266 / 16350 EXPERIENCE POINTS"**.

So in the v0.717 web guest longplay, heavenly gold is a **live non-zero balance at level 7**. And
the v0.682 payload has **no in-game gold faucet that a level-7 guest could have used** — the only
`STAT_HGOLD` grants in the entire bundle are `doRebirth` at `StatsManager.as:2201/2205` (+20 at
Dan 8, else +5), which requires L80, plus the PayVault/gift paths (`PayUI.as:672`,
`ProviderSelectDialog.as:177`). Quests grant none (id 12 unused, above). A guest starting at 0
cannot reach 2.

**THE FRAME WINS.** The web build seeds guest gold; `initNewPlayer` in the android v0.682 bundle
does not. This is exactly the disagreement §0 legislates for, and the survey resolved it the wrong
way round — it told the profile lane to change a frame-backed constant to match a
different-version, different-platform AS3 literal. The A2 cite is real and correctly quoted; the
*direction of truth* is wrong. Refuted as material, not fatal: the coins/AP/token halves are fine
and the AS3 row is worth keeping as a labeled v0.682 datum.

Corroborating measurement doc (carries the same read, no frame path of its own):
`docs/research/video-study/segments/A-00-boot-login.md:110-112` — *"currency row '114 COINS',
'3 GOLD' (guest starts with 3 gold)"* — and `:150` *"guest starts 100 coins / 3 gold."*

---

## Effect on the score

78 is defensible for the rows as written, but the rationale's own two ceiling arguments have moved:

- *"the string table that would NAME any priced item is still unlocated — prices are portable,
  names are not"* → **false**, and this was the load-bearing half of the sentence.
- *"IAP tiers, STILL_UNHELD"* → verdict survives, but the premium vendor's stock table (176 items,
  23 rotation sets) is now held, which is most of what that bullet was practically for.

The remaining cap — **every economy number is v0.682 Android, and no v0.717 web cross-check exists
because the web SWF decompiles to assets only** — is real and I re-verified it independently. That
one should keep holding the lane under 90.
