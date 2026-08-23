# LEDGER PACKET — `items-equipment`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**29 surviving overturns · 3 true-but-rejected · 103 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **items-equipment** | 42 | paperdoll, affix prefixes, rarity, condition tiers, soul-infusion rules | stat-vs-level curve; condition→DMG multiplier; sprite-compositing contract; icon manifest |
### items-equipment — 42
- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4).
- **Blockers:** ① item stat-magnitude **vs level** curve. ② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap). ③ sell-price formula. ④ affix **suffix** pool + per-rarity affix count. ⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**.
- **Surface:** measured weight table + named-item blocks exist in segment notes but **no items config file exists yet** — entirely un-ported.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NEW-4-paperdoll-is-13-slots-not-9]]` — UPHELD [A2] (2 critics)

The paperdoll is THIRTEEN slots, not nine. StatsManager enumerates EQ_ARMOR 0, EQ_GLOVES 1, EQ_HAIR 2, EQ_HAT 3, EQ_HEAD 4, EQ_MASK 5, EQ_NECK 6, EQ_PANTS 7, EQ_SHOES 8, EQ_WEAPON 9, EQ_SCABBARD 10, EQ_ACCESSORY1 11, EQ_ACCESSORY2 12. Corroborated twice: XMLNpc.as:36's DEFAULT_EQSTRING has 13 pipe-separated fields, and XMLNpc.as:705 allocates `new Vector.<Item>(13)`. npcdata's <mcs> blocks use twelve of them (armor, gloves, hair, hat, head, mask, neck, pants, shoes, weapon, prop1, prop2). REBUILD_READINESS.md says '9-slot paperdoll' in two places — KNOWN-KNOWNS at :82 and items-equipment Ready at :209 — and both are wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:262-286`
- **Build:** both
- **KILLS this line:** "- Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list;"
- **Lane impact:** L-items-equipment + L-art-anim: four more render/equip slots than the ledger models, including a scabbard and two accessories. Any sprite-compositing contract (blocker ⑤) has to cover 13 layers. Combine with NF-npcdata-silences (b): zero colour overrides are ever authored, so each slot is separately painted art.

### `[[actionscript/affix-generator-complete]]` — UPHELD [A2] (2 critics)

The complete random-item generator is on disk: five generated stat-vs-level progression arrays, an explicit per-rarity affix-count dice table, and the 16x8 suffix pool the ledger calls a blocker — with the numerics verified byte-identical in the web v0.717 payload.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183, :206-252, :102-127, :321-347 · web parity reference/decompiled/shs3_payload/scripts/§1t1644s0§.as:169,178,187,196,204 and :255-282`
- **KILLS this line:** "① item stat-magnitude vs level curve. … ④ affix suffix pool + per-rarity affix count."
- **Lane impact:** L-items-equipment: blockers ① and ④ both closed outright; also supplies the elemental-gear stats that L-rebirth-elements needs and a 17th stat (PIERCINGDMG) absent from all 12 ledgers.

### `[[actionscript/no-condition-damage-multiplier]]` — UPHELD [A2] (2 critics)

There is no condition→damage multiplier anywhere in the code: getCondition() has exactly one reader in the whole tree and it is the tooltip; the only mechanical effect of wear is the binary broken state, and durability/slash-cost are three- and four-tier weapon-only data tables.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:714-744 and :1481-1490 (grep -rn "getCondition()" . → 2 hits, both in Item.as) · data measured over reference/extracted/itemdata.xml`
- **KILLS this line:** "② condition→DMG multiplier (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L-items-equipment: blocker ② resolved in the negative — do not encode a multiplier; L-skills-meters gains the exact per-slash Focus cost table (72/96, floored at 48).

### `[[android-blobs-hunter/item-icon-coverage-corrected]]` — UPHELD [A2] (1 critic)

Corrected icon coverage for the decrypted 115_Mobile_SHS3Resource, replacing the packet's figures. Joining the 112 item#### symbols by id against the 982 itemdata rows: band 2000-2999 is 50/99 covered (49 rows have no icon), band 20000-29999 is 58/79 (21 rows have no icon), accessories 8/9 (3007 missing). The consumable gap is one contiguous authored block plus strays: 2000, 2001, 2131-2141 (except 2140,2141 which DO ship), 2142, 2144-2175, 2204, 2206, 2500, 2502, 2503. Missing quest-item icons: 20005, 20009-20012, 20017, 20023, 20054-20058, 20100-20107, 20111. Skills, which the packet did not quantify: 68 of the 75 <skill> rows have a skill#### icon and 7 do not (1064, 1065, 1066, 1067, 1068, 1500, 1501); 11 skill symbols have no skilldata row.

- **Cite:** `decrypted reference/extracted/android/115_Mobile_SHS3Resource.bin (1,912 SymbolClass names) joined by id to reference/extracted/android/111_Mobile_ItemData.bin (982 <item>) and 117_Mobile_SkillData.bin (75 <skill>); resolution path reference/decompiled/shs3_android_payload/scripts/MCSItem.as:203`
- **Build:** android v0.682
- **KILLS this line:** "android-blobs/item-and-skill-icon-art-is-held: 'covering 94/99 consumables, 8/9 accessories and 67/79 quest items ... Residual named exactly: consumable arts 2000, 2001, 2500, 2502, 2503; accessory art 3007; 12 quest-item arts.'"
- **Lane impact:** L3 items-equipment + L10 ui-hud. The banked STILL_UNHELDs are still correctly retired - the art IS on disk - but roughly half the consumable roster falls back to item0 (MCSItem.as:206) rather than one in twenty. A builder planning icon work needs 70 originals, not 18.

### `[[bindata/sprite-compositing-contract]]` — UPHELD [A2] (2 critics)

The full sprite-compositing contract — 27-slot part map, transform semantics, z-order rule and per-frame visibility — is specified exactly, decoding every <n i="…"> in all 19 animdata blobs.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:10-62 + FrameData.as (reorderLayers, setVisible) + FrameNodeData.as (setPosition)`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L-items-equipment: the layer-order half of blocker ⑤ is dead. Corroborated by the web payload's own art symbol classes in reference/decompiled/shs3_payload/scripts/ — torso4000.as, uparm4000.as, lowarm4000.as, hand5000.as, hair6000.as, hat7000.as, head8000.as, mask9000.as, neck10000.as, thigh11000.as, calf11000.as, crotch11000.as, foot12000.as, weapon13000.as, prop13000.as. The icon manifest half I did not open.

### `[[economy/coin-cap-weight-cap-mining-tiers]]` — UPHELD [A2] (2 critics)

Three hard economy ceilings and the full ore-tier ladder sit in skilldata's Survival category and are absent from the ledger's economy and items sections: coin cap 2000->10000, carrying weight 120->300 (not a flat 100), and mining tiers coal/iron through diamond.

- **Cite:** `reference/extracted/skilldata.xml:531-574 (1011 Coin Purse+, strings 7020-7023 + 7007), :420-498 (1009 Carrying Weight+, strings 7014-7018 + 7029-7033), :844-887 (1022 Mining, strings 7059-7063)`
- **KILLS this line:** "- Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4)."
- **Lane impact:** L10 progression+economy and L3 items — 'weight cap 100' is the BASE only; a fully invested character carries 300. The coin cap is a hard sink the economy model needs. Cat 5 also holds Farming (7039 rare-crop chance) and Scavenging (7040 hidden-item chance): three gathering professions, 5 levels each.

### `[[frames/HUNT-repair-cost-is-runtime-parameterised]]` — UPHELD [A2] (4 critics)

The Repair-Weapon blocker is mis-specified and can never be closed by finding a frame: repair cost is a runtime fill, exactly like Forge. Reinforce is also not one constant but three material variants, and there is a second gold-priced unbreakable path via Ninja Services.

- **Cite:** `strings.json["848"], ["849"]-["852"], ["636"], ["669"], ["393"], ["4143"], ["7042"]; weapon condition field at reference/extracted/ui_strings.txt:257`
- **Build:** android v0.682
- **KILLS this line:** "(3) Repair-Weapon cost (never captured)."
- **Lane impact:** economy, items-equipment: re-state the blocker as 'derive repair cost f(runtime)'; correct 'Reinforce 5000c+1 silver ore' to a three-tier material table

### `[[itemdata/affix-count-per-rarity]]` — UPHELD [A2] (2 critics)

The per-rarity affix count, the per-slot allowed-stat pools and the forced first affix are all exact in ItemGenerator; only the prefix/suffix WORD lists remain unread.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:206-252 (getEnchantmentCount), :397-428 (pools), :432-449 (forced first affix), :833-871 (getModTier / prog1..prog5)`
- **KILLS this line:** "④ affix suffix pool + per-rarity affix count."
- **Lane impact:** L3: the per-rarity affix count half of blocker ④ is closed with exact dice tables; the suffix/prefix word lists (preSufArray) and the prog1..prog5 tier thresholds were NOT read this pass and stay open.

### `[[itemdata/affix-magnitude-curve]]` — UPHELD [A2] (2 critics)

The affix magnitude-vs-level curve is five closed-form tables (prog1..prog5) plus a tier-jitter rule, so nothing needs deriving: ATK/DEF = floor(1+i) capping at 90, HP/Chi = floor(5+5i/3) capping at 146, regen/elemental/crit = floor(1+i/3) capping at 37, SPEED = floor(1+2i/3) capping at 53, PIERCING = floor(1+i/5) capping at 16.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-198 (tables), :321-334 (getMaxTier jitter), :463-472 (weapon/armor tier uses nodelvl - levelrestriction), :648-661 (durability roll on a drop)`
- **KILLS this line:** "① item stat-magnitude vs level curve."
- **Lane impact:** L5 items-equipment blocker ① closed on its randomised-affix side (Pass 1's C4 closed the fixed base-stat side from the XML rows); L3 progression gains the gear-power ramp to level 79.

### `[[itemdata/affix-suffix-pool]]` — UPHELD [A2] (2 critics)

The affix suffix pool — the half of items-equipment blocker ④ Pass 1 left open — is held verbatim, alongside the prefix pool, as 17 stat classes x 8 word tiers with tier = floor(itemLevel/10); elemental DEFENCE affixes deliberately reuse the opposing element's words in a fire->water->wind->earth->fire cycle.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127 (word lists), :128-148 (tier loop and the DEF/ATK word swap at :142-145)`
- **KILLS this line:** "④ affix suffix pool + per-rarity affix count."
- **Lane impact:** L5 items-equipment blocker ④ fully closed for v0.682; L4 rebirth-elements gains the gear-side elemental affix classes (FIRE/WIND/WATER/EARTH ATK+DEF, CRITICALDMG, PIERCINGDMG). PARTIAL because the literals are the Android v0.682 build; web v0.717 (§1t1644s0§.as:107-146) reads the same 17x8 slots from language ids 10029-10208, which are absent from our held string table (max numeric id 9010).

### `[[itemdata/condition-has-no-damage-multiplier]]` — UPHELD [A2] (2 critics)

There is no condition-to-damage multiplier anywhere in the engine: weapon damage is flat until the item breaks, at which point the weapon contributes nothing at all; the six condition tiers are display-only labels over remaining durability.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1863-1888 (getMinDamage / getDamageRange) + Item.as:1467-1496 (isBroken / getCondition) + Item.as:714-746 (getDesc)`
- **KILLS this line:** "② condition→DMG multiplier (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L3: implement condition as a binary functional/broken gate plus a label, and delete the multiplier from the model. L5: TTK math must not carry a condition term. The ledger's own suspicion (the evidence was a level gap, not condition) is confirmed.

### `[[itemdata/nine-paperdoll-slots-are-fully-named]]` — UPHELD [A2] (2 critics)

The nine stat-bearing equipment slots are completely named in AS3 and match the nine paperdoll boxes box-for-box: {0 EQ_ARMOR, 1 EQ_GLOVES, 3 EQ_HAT, 5 EQ_MASK, 7 EQ_PANTS, 8 EQ_SHOES, 9 EQ_WEAPON, 11 EQ_ACCESSORY1, 12 EQ_ACCESSORY2}. The four body-only indices findBonusStat skips are 4 EQ_HEAD, 6 EQ_NECK, 10 EQ_SCABBARD, 2 EQ_HAIR. Nothing has to be invented for the two ring boxes.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:262-286 (EQ_* enum, 13 entries) and :1943-1945 (findBonusStat skip list); corroborated visually at reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1045)`
- **Build:** android v0.682
- **KILLS this line:** "itemdata/paperdoll-9-boxes-13-indices: 'two of the nine boxes are ring/accessory slots that the named AS3 enum does not cover'"
- **Lane impact:** L3 art-anim and L8 UI: the inventory screen's slot indices are contract, not inference — corrects itemdata/paperdoll-9-boxes-13-indices, which asserted the enum does not cover the two ring boxes.

### `[[itemdata/sprite-compositing-contract]]` — UPHELD [A2] (2 critics)

The sprite-compositing contract and the item icon manifest are both fully held: the symbol class name is literally partType + art, art defaults to the item id, and the z-ordered part list is 27 entries — with the web payload itself shipping the fallback symbols under exactly that naming scheme.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:581-607 (getMCSComponent) + MCSCharacter.as:10-62 (PART_* z-order) + XMLItem.as:110-117 + the symbol classes in reference/decompiled/shs3_payload/scripts/ (torso4000.as, calf11000.as, hat7000.as, ...)`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L3 + L6 (ART + ANIM): one ARMOR item paints 5 parts (torso, stomach, pelvic, uparm, lowarm), PANTS paints 3 (crotch, thigh, calf), SHOES 2 (foot, foottop), the rest 1. This is the from-scratch-art blocker dissolved: the layer order and per-slot decomposition are both explicit.

### `[[itemdata/stat-vs-level-is-a-table]]` — UPHELD [A2] (2 critics)

The 'item stat-magnitude vs level curve' is not a missing formula — it is fully tabulated on disk from level -4 to level 79, for both weapon damage and armour defence.

- **Cite:** `reference/extracted/itemdata.xml — 158 rows with <mindamage>+<maxdamage>, 155 rows with <minlvl> spanning -4..79 (index docs/gauntlet/L0/index/itemdata.json numeric_range), endpoints at :7907 and item 13225`
- **KILLS this line:** "- Blockers: ① item stat-magnitude vs level curve."
- **Lane impact:** L3: port the table, do not fit a curve. L10 (PROGRESSION + ECONOMY): the item ladder to L79 exists even though the L11-80 XP curve does not, so the two must not be conflated as one gap.

### `[[items-equipment/affix-suffix-pool-and-counts]]` — UPHELD [A2] (12 critics)

Blocker 4 is fully held: 104 verbatim prefixes and 104 verbatim suffixes (13 distinct pools x 8 tiers) plus both affix-count distributions (normal d100 and rare d11) and the legendary -1 rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127, :128-148, :206-252, :371-374`
- **KILLS this line:** "④ affix suffix pool + per-rarity affix count."
- **Lane impact:** L4/L7 (economy + loot) — the whole procedural item-naming and enchant-count system is now copyable verbatim, including the shipped bug where the four elemental-DEF channels reuse the wrong prefix/suffix pools (ItemGenerator.as:142-145).

### `[[items-equipment/condition-blocker-dead-in-both-builds]]` — UPHELD [A2] (1 critic)

Blocker 2 (condition->DMG multiplier) is dissolved in the WEB v0.717 build as well as Android: the web getCondition has exactly two references in the whole payload -- its definition and one call inside getDesc -- so no damage path reads it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:995,1868 (grep "§1t536s0§" over reference/decompiled/shs3_payload/scripts/ returns exactly 2 hits)`
- **KILLS this line:** "② condition→DMG multiplier (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L1/L2 (combat core + damage) -- removes the S0-3 Android-parity caveat for blocker 2 that the surveyor left open. The phantom wear curve is dead in the build we are actually recreating (v0.717), not just in the Android port.

### `[[items-equipment/condition-has-no-damage-multiplier]]` — UPHELD [A2] (12 critics)

Blocker 2 is dissolved, not closed: there is NO condition->damage multiplier anywhere — getCondition() is called only by getDesc(), and damage is a binary broken/not-broken cliff (broken weapon = ATK+bonus+1 with damage range 0).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1481-1496 and :714 (only non-definition call site); StatsManager.as:1863-1903`
- **KILLS this line:** "② condition→DMG multiplier (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L1/L2 (combat core + damage) — kills a phantom mechanic; a 99%-worn sword hits identically to a pristine one, so no wear curve should be implemented.

### `[[items-equipment/generic-defense-floor-is-attacker-keyed]]` — UPHELD [A2] (1 critic)

The real defense min-floor lives in Damage.getMinDamage(), is keyed to the ATTACKER's level, and has four bands (1 / lvl÷8 / lvl÷6 / lvl÷4, each + piercingDamage); it is applied at the single point where damage meets defense in MCSPlayer, NPC and every enemy takeDamage.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:53,149-172; MCSPlayer.as:3415-3418 and :1930; NPC.as:447`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) - the ledger bullet is INCOMPLETE, not wrong: EnemyLevel is the right variable for the player-taking-damage case and /4 is the right top band. It should read: floor = 1 (atkLvl<=10) / atkLvl÷8 (<=20) / atkLvl÷6 (<=30) / atkLvl÷4, plus piercingDamage. Do not delete the bullet.

### `[[items-equipment/paperdoll-is-13-slots-not-9]]` — UPHELD [A1] (12 critics)

The frame shows exactly 9 paperdoll boxes so the ledger's UI claim is right, but the equipment MODEL is a Vector.<Item>(13) with 13 named EQ_ constants of which 11 are passed to the renderer — a builder coding '9 slots' from the ledger loses hair, head and scabbard. FRAME AND DOC DO NOT DISAGREE HERE; the doc is simply describing the UI and silently omitting the model.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1040) upscaled x2 LANCZOS — 9 boxes: hat(filled) mask(empty) armor(filled) gloves(empty) pants(filled) weapon/pickaxe(filled) ring-left(empty) shoes(filled) ring-right(empty); corroborated by A2 reference/decompiled/shs3_android/scripts/StatsManager.as:108, :262-286, :724-738, :1765`
- **KILLS this line:** "Ready: 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the bullet must read '9 UI boxes over a 13-slot equipment model, 11 of which render'. PARTIAL because the 9 is correct for the UI.

### `[[items-equipment/sell-price-formula]]` — UPHELD [A2] (12 critics)

Blocker 3 (sell-price formula) is held exactly and in BOTH builds: sell = 1 for id<3000, else (1 + modifierCount) * 10 when weight>=10, else (1 + modifierCount) * 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
- **KILLS this line:** "③ sell-price formula."
- **Lane impact:** L4 (economy) + items — closes the shared economy/items sell-price gap with a two-build-confirmed formula; no INFERRED seed needed.

### `[[items-equipment/soul-infusion-is-code]]` — UPHELD [A2] (11 critics)

Soul-infusion / stat-transfer is exact code, not a patch-note inference: the gate is floor(id/1000) equality, modifiers copy wholesale from the stats item, weapons get the damage delta as modifier id 6 (Attack), durability follows the stats item and colour follows the design item.

- **Cite:** `reference/decompiled/shs3_android/scripts/CraftingUI.as:494-525`
- **KILLS this line:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — upgrades a patch-note paraphrase to executable rules; the ledger's Ready bullet understates what is held.

### `[[items-equipment/stat-vs-level-curve]]` — UPHELD [A2] (12 critics)

Blocker 1 is held twice over: a complete 158-row static weapon ladder in itemdata.xml (minlvl -4..79) AND the generated-affix roll formula tier = clamp(nodelvl+1, 0, 79) with five progression arrays and a levelrestriction subtraction on the item's signature stat.

- **Cite:** `reference/extracted/itemdata.xml:7906-7915 and :9925-9937; reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183, :321-347, :465-490`
- **KILLS this line:** "① item stat-magnitude vs level curve."
- **Lane impact:** L4/L7 — no extrapolation needed for the L-4..L79 weapon ladder; the per-tier affix magnitudes (prog1 attack/defense, prog2 maxhp/maxchi, prog3 elemental+regen+crit, prog4 speed, prog5) are exact, including the +10 spike at index 79.

### `[[items-equipment/two-icon-only-art-namespaces]]` — UPHELD [A2] (2 critics)

Consumables and accessories have their own icon symbol namespaces ('item<art>' and 'acc<art>') that are not paperdoll parts, plus 11 named placeholder icon classes — so the item icon pipeline is genuinely separate from the paperdoll pipeline.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-224 (setConsumable) and :226-245 (setAccessory); DummyIcon class census in reference/decompiled/shs3_android/scripts/; visual consequence at reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) — the icon-manifest half of blocker ⑤ is NOT dissolved; it is a third and fourth art namespace on top of the paperdoll parts. Five of the seven inventory icons in the reference frame (scroll, onigiri x3, black stone, two feathers) are consumables/accessories that cannot be composed from body parts. Only item0 (the fallback) exists as a named class in any bundle, so this widens the residual art gap rather than closing it.

### `[[items-equipment/web-soul-infusion-superset]]` — UPHELD [A2] (2 critics)

The shipped web v0.717 soul-infusion transfers a DEFENSE delta (modifier id 7) for every item type and a WEIGHT delta for armor (type 4) and pants (type 11), and gates the durability copy on the design item having non-zero durability — none of which exists in the Android v0.682 code the survey quoted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:686-724`
- **KILLS this line:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — implement the v0.717 rule set; the Android-only version silently no-ops for armour and pants.

### `[[items-equipment/weight-cap-is-a-base-not-a-cap]]` — UPHELD [A2] (12 critics)

'Weight cap 100' is the guest BASE, not a constant: carrying capacity is 100 + stat1009*20, and bank storage is a separate upgradeable cap of 100 + DAN*10 + PAIDSTORAGE*10.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2298-2301 and BankUI.as:264; A1 corroboration reference/frames/s21_weapon/t708.0.png crop (1400,540)-(1780,600) upscaled x4 reads "WEIGHT: 43 / 100"`
- **KILLS this line:** "weight cap 100"
- **Lane impact:** L4 (economy) + L5 (UI/HUD) — two distinct upgradeable caps where the ledger records one constant; the frame's 100 is the stat1009=0 case.

### `[[npcdata/compositing-contract]]` — UPHELD [A2] (2 critics)

The sprite-compositing contract is recovered: the paperdoll is a bone tree (not a flat layer stack) in which one equipment slot paints several bones, with explicit z-order on the head, and the sprite key is the item's <art> field rather than its id.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:682-755 (head z-order), :832-1265 (bone attach points), :585-592 (art indirection); corroborated by the un-obfuscated web class names in reference/decompiled/shs3_payload/scripts/ (torso4000.as, pelvic4000.as, thigh11000.as, foottop12000.as, neck10000.as, prop13000.as …)`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** items-equipment — kills blocker ⑤, the named from-scratch-art blocker; also gives art-anim-audio-feel the exact bone set the animation data is authored against.

### `[[npcdata/paperdoll-12-slots]]` — UPHELD [A2] (2 critics)

The paperdoll is 10 wearable slots and 12 render slots, not 9 — <mcs> enumerates armor, gloves, hair, hat, head, mask, neck, pants, shoes, weapon, prop1, prop2, and itemdata's <type> 1–12 maps onto the id bands with zero ambiguity.

- **Cite:** `reference/extracted/npcdata.xml:7-19 (npc 0, the reference paperdoll) + :3954 (<prop2>); cross-checked against reference/extracted/itemdata.xml id-band↔<type> histogram`
- **KILLS this line:** "Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list"
- **Lane impact:** L-items-equipment: the slot COUNT in the ledger's Ready column is wrong (10 wearable / 12 render, not 9) and the item-id NAMESPACE is now fully held, which is half of blocker ⑤. PARTIAL: the LAYER ORDER half of blocker ⑤ is STILL_UNHELD — <mcs> children are emitted alphabetically (an authoring artefact, not z-order). L-art-anim also affected.

### `[[npcdata/paperdoll-13-slots]]` — UPHELD [A2] (2 critics)

The paperdoll is not 9 slots: <mcs> carries 12 slot tags (armor gloves hair hat head mask neck pants shoes weapon prop1 prop2) plus per-slot colour overrides, and the equipment vector is 13 wide.

- **Cite:** `docs/gauntlet/L0/index/npcdata.json (12 npcdata/npc/mcs/* paths); reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:36 and :705; MCSCharacter.as:524-547 for the colour tags`
- **KILLS this line:** "- Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4)."
- **Lane impact:** items-equipment + ui-hud — the equip screen, save schema and character-creation UI all need 12/13 slots, not 9; also fixes the slot→ID-band contract (4000 armor … 13000 weapon, with 6500/8500/11500 as the female art sub-bands).

### `[[payload/reinforce-has-three-material-tiers-not-two]]` — UPHELD [A2] (2 critics)

Reinforce-Weapon is flat 5000 coins across three material tiers, not two. InteractUI.as:657-673 reads the equipped weapon's level (with itemID 13022 forced to 59) and branches <30 / <60 / else onto strings 850 / 851 / 852, which read 'Cost: 5000 coins / Materials needed: 1 Silver Ore', '... 1 Titanium Ore' and '... 1 Uncut Diamond'. A weapon with no valid item (itemID 0 or 13000) gets string 849, which carries no cost line at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:649-674 + docs/gauntlet/L0/index/strings.json["849"],["850"],["851"],["852"]`
- **Build:** android v0.682
- **KILLS this line:** "- Economy statics: ... Forge 700c+2 ore, Reinforce 5000c+1 silver ore;"
- **Lane impact:** L7 economy / L6 items-equipment - RR:79-80's 'Reinforce 5000c+1 silver ore' is only the lowest of three tiers, and the tier key is WEAPON level, not node level.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[NF-npcdata-silences]]` — NOT-UPHELD [A2] (2 critics)

Four structural facts in npcdata.xml that no claim in the packet mentions at all: (a) FIVE paperdoll-template rows with no name/ai/lvl, not one; (b) ZERO colour-override tags despite the code parsing eight of them; (c) the NPC id-band layout with a 143-id hole; (d) the string-table band partition by consumer file.

- **Cite:** `reference/extracted/npcdata.xml:3, :1511, :3352, :4097, :4437 (template rows) and a full tag census; reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:523-550; docs/gauntlet/L0/index/strings.json (band lookups by id)`
- **Build:** both
- **aimed at this line, which SURVIVES:** "Ready: 9-slot paperdoll; 4 rarity tiers; affix prefix pool (verbatim); item-name template; full ItemStats field list."
- **Lane impact:** L-items-equipment + L-art-anim: (b) is a hard from-scratch-art constraint — the five clan armies are five separately PAINTED garments, never a tint of one, because no colour override is ever authored. (a) corrects packet claim 25's 'the reference paperdoll' (there are five, plus four '?' placeholder rows). (d) lets any numeric id be routed to its owning file before lookup.

### `[[hunter/paperdoll-is-23-slots-plus-quadruped-extension]]` — NOT-UPHELD [A2] (2 critics)

The human paperdoll is 23 slots (0..22), not 27. Both builds allocate partListLength+1 = 23 MovieClips. The four extra PART_ constants (l_shoulder 23, r_shoulder 24, l_knee 25, r_knee 26) are a QUADRUPED extension: their only readers anywhere are MCSWolf, which raises partListLength to 25 and rebinds them as front/back legs, and rebinds PART_prop3 as tail3.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :136-146 · reference/decompiled/shs3_android/scripts/MCSWolf.as:9-18, :148, :184-197 · reference/decompiled/shs3_payload/scripts/§1t75s0§.as:125, :159`
- **Build:** both
- **aimed at this line, which SURVIVES:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L-items-equipment and L-art-anim-audio-feel: the human layer stack is 23 deep, and the animal rigs are a documented 26-slot variant of the same paperdoll rather than a separate system.

### `[[items-equipment/icon-namespaces-item-and-acc]]` — NOT-UPHELD [A2] (1 critic)

The item-icon art is NOT all paperdoll parts: consumables and quest items render from an 'item<art>' symbol namespace and accessories from an 'acc<art>' namespace, neither of which exists on the character rig - 187 of 982 itemdata rows need icon art the paperdoll cannot supply.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-210, :226-233; ShopItem.as:134-199; row counts measured over reference/extracted/itemdata.xml`
- **aimed at this line, which SURVIVES:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) - blocker 5 is only HALF dead. The compositing contract is genuinely closed, but the icon manifest is not: 99 consumables (2000-2999) + 79 quest items (20000-29999) + 9 accessories (3000-3999) require item*/acc* symbols with no paperdoll counterpart. This is a scoring-relevant correction to the surveyor's 78.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[android-blobs-hunter/uidata-is-the-whole-town-interaction-spec]]` — UPHELD [A2] (1 critic)

90_InteractUI_UIData.bin is named by no claim in the packet and is the only spec in the corpus for how a player interacts with a town: 314 lines, root <uidata>, 19 <ui> screens, 47 <menu>, 139 <option>, 28 <condition>. Screens: peddler, market, vegpatch, stables, merchant, inn, rebirth, barber, bank, gambling den, getcoins, getap, leaveclan, blacksmith, recentevents, playerpanel, joincustomclanrecruit, joincustomclangeneral, towntoll. A 46-verb action vocabulary drives them (goto x34, close x24, sellgoods, buygoods, sellcrop, plant, harvest, withdraw, deposit, bet, chohan, redeem, nameweapon, forgeweapon, repairweapon, reinforceweapon, crafting, fullhpchi, fire/wind/water/earthrebirth, dailyprize, convertgold, buypremium, achievement, duelreplay, challenge, addfriend, bankstorage, innrest, innbuy, barberbuy, paytowntoll, entertown, giveitem, givecoins). Labels are string-table ids that resolve today, and options carry conditions AND per-action conditions with <errormsg>.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:5,14,47,66 (<title> peddler/market/vegpatch/stables) + docs/gauntlet/L0/index/strings.json["83"]="Buy", ["84"]="Sell", ["85"]="Leave", ["269"]="Sell crops"`
- **Build:** android v0.682
- **Lane impact:** L1 world-exploration, L3 items-equipment, L-economy, L10 ui-hud. Every shop, bank, gambling and rebirth interaction the ledger discusses second-hand is authored here as data, with resolvable labels and an explicit error-message path for failed conditions.

### `[[android-blobs/blob-xor-key-is-per-file-not-109]]` — UPHELD [A3] (1 critic)

Stage-0 C1's 'key m=109' is one of FIVE keys, and the transform is not a plain XOR. ResourceManager.as:186 and Mobile.as:352 both pass resourceFileNameArray[n].charCodeAt(1), so: 115_SHS3Resource = 'h' = 104, 113_MusicResource = 'u' = 117, 122_SoundResource = 'o' = 111, 124_ImageResource = 'm' = 109, 120_BGResource = 'g' = 103. The transform itself (ResourceManager.as:205-214) touches only bytes 3..255 and, when i%11==0, first SWAPS ba[i] with ba[i+256]. I decrypted all five: every one yields CWS\x11 and inflates (image 1,908,229 B, bg 4,412,340 B, shs3 1,040,849 B, sound 29,623 B, music 1,402,677 B).

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,:186,:200-217 + Mobile.as:352; all five blobs under reference/extracted/android/ decrypted and inflated by me`
- **Build:** android v0.682
- **Lane impact:** Method, all lanes: anyone re-deriving from the blobs with a single key 109 will silently fail on four of the five and re-report them as unrecoverable - which is exactly how the equipment-art blocker was invented.

### `[[android-blobs/item-art-ids-are-shared-not-identity]]` — UPHELD [A2] (1 critic)

Item icon art is SHARED, not one-per-item: 146 of the 982 itemdata rows carry an explicit <art> override pointing at another item's art symbol, collapsing onto 68 distinct art targets, with art 2130 alone serving 39 different consumable rows and zero rows self-referential.

- **Cite:** `reference/extracted/android/111_Mobile_ItemData.bin:327 and :485`
- **Build:** android v0.682 (reference/extracted/itemdata.xml carries the same 146 tags — it IS this file)
- **Lane impact:** L3 items-equipment + L10 ui-hud. CONTRADICTS the parenthetical inside android-blobs/item-and-skill-icon-art-is-held ('itemdata has no <art> tag anywhere, so art id = item id'), which is false and, if reproduced as written, yields 50/99 and 58/79 instead of the correct 94/99 and 67/79. Positively, it is a real authoring contract nobody has banked: an icon manifest for a from-scratch build needs 68 targets for those 146 rows, not 146 drawings, and 39 consumables deliberately share one pill icon. The resolution rule is `art = <art> if present else id`, matching XMLItem's `this.art = this.id;` default already banked at itemdata/web-android-schema-parity.

### `[[android-blobs/shs3resource-decrypts-1912-equipment-symbols]]` — UPHELD [A2] (1 critic)

THE EQUIPMENT-ART BLOCKER IS DEAD. 115_Mobile_SHS3Resource.bin decrypts with ResourceManager.decryptByteArray at key 'shs3resource.swf'.charCodeAt(1) = 'h' = 104 and inflates to a 1,040,849-byte CWS v17 SWF. Its SymbolClass/ExportAssets tables name 1,912 exported symbols: 151 torso / 151 lowarm / 151 uparm / 151 pelvic / 150 stomach / 112 item / 109 weapon / 96 hat / 85 calf / 85 crotch / 85 thigh / 79 skill / 73 hair / 60 prop / 59 mask / 44 foot / 44 foottop / 38 head / 33 hand / 33 neck / 8 acc / 5 achievement, plus complete bear, boar, deer, horse and wolf part sets. The roster art has been in the repo the whole time.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin (decrypted per reference/decompiled/shs3_android/scripts/ResourceManager.as:200-217, key 104) + Mobile.as:50 and :330`
- **Build:** android v0.682
- **Lane impact:** L6 art + L3 items-equipment: overturns art-anim/equipment-art-was-server-streamed's residual blocker. Equipment art must NOT be authored from frames; it must be transcribed from this SWF.

### `[[cite-lens-s26b/five-resource-blobs-all-decrypt]]` — UPHELD [A2] (1 critic)

All five XOR-obfuscated Android resource blobs decrypt and inflate, and 115_Mobile_SHS3Resource.bin IS the per-item art manifest. The cipher is in the corpus: ResourceManager.as:200-217 decryptByteArray touches only bytes 3..255 (with an i%11==0 swap to i+256) and the key is the SECOND CHARACTER OF THE RESOURCE FILENAME - Mobile.as:352 / ResourceManager.as:186 pass resourceFileNameArray[n].charCodeAt(1), and ResourceManager.as:41 names the five files. Keys are therefore h=104 (shs3resource), u=117 (musicresource), o=111 (soundresource), m=109 (imageresource), g=103 (bgresource). Running that over all five: 115 -> 1,040,849 B, 113 -> 1,402,677 B, 122 -> 29,623 B, 124 -> 1,908,229 B, 120 -> 4,412,340 B, every one a CWS v17 that zlib-inflates cleanly. Parsing SymbolClass/ExportAssets out of the inflated 115 yields 1,912 exported symbols whose prefixes are exactly the getMCSComponent partTypes: torso/stomach/uparm/lowarm/pelvic 151 each, item 112, weapon 109, hat 96, calf/crotch/thigh 85 each, skill 79, hair 73, prop 60, mask 59, foot/foottop 44 each, head 38, hand/neck 33 each, backleg/frontleg 12 each, tail 9, acc 8, achievement 5, plus *_wolf_ and *_horse_ creature sets. Sample names: item0, item1, item009, item010, item2100..., acc3000..acc3008, weapon13000..weapon13056. NOTE the C1 brief gives key 'm'=109 as the example; that is the IMAGE resource key specifically, not a single key for all five.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,186,200-217; reference/decompiled/shs3_android/scripts/Mobile.as:352; reference/extracted/android/115_Mobile_SHS3Resource.bin`
- **Build:** android v0.682
- **Lane impact:** L6 (art) - CLOSES the icon/art blocker outright rather than scoping it. The item####, acc####, weapon####, hat####, mask#### and paperdoll part symbol families the items-equipment survey calls unrecoverable are in a held file and enumerable today. It also invalidates any lane plan that budgets for authoring ~1,900 symbols from scratch, and it retires the last 'S0-5 stands' language wherever it survives.

### `[[cite-lens-s26b/green-border-tip-completes-the-ladder]]` — UPHELD [A2] (1 critic)

There is a THIRD border-colour tip that no claim in this packet cites, four lines above the blue one: GameEngine.as:564 'Tip: A green border indicates that an item is special.' Together with :568 (blue = rare) and :572 (purple = unique) the game's own tip list names three of the four getShopItemType() tiers, which is far stronger corroboration for the 4-tier border ladder than the two-tip argument the border claims actually make.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:564,568,572`
- **Build:** android v0.682
- **Lane impact:** L5 (UI/HUD) + L6 (art) - the border tier names are green=special, blue=rare, purple=unique, with normal as the default tan. Any lane building the ShopItem border art now has a named colour for three of the four tiers straight from shipped in-game copy.

### `[[combat-core/attacker-level-min-damage-floor]]` — UPHELD [A2] (1 critic)

The generic damage pipeline carries a four-band minimum-damage floor keyed to the ATTACKER's level - 1 / lvl8 / lvl6 / lvl4, each plus piercingDamage - which is what the ledger's 'EnemyLevel/4' bullet actually refers to when an enemy strikes the player.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-171`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) - the ledger bullet is correct-but-incomplete, not wrong; it needs three more bands and a piercingDamage term. The enemy-class copies (EnemyElite/KanjiGuardian/WolfAlpha/SpearElite/Player) are the same ladder with the player as attacker, used for HP auto-scaling.

### `[[combat-core/generic-post-defense-damage-floor]]` — UPHELD [A2] (1 critic)

The real post-defense damage floor is a four-band ladder on the ATTACKER's level — 1 / lvl/8 / lvl/6 / lvl/4, each plus piercingDamage — applied on every hit in the generic pipeline, not only in boss scaling.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-172; applied at MCSPlayer.as:3415-3418 (and :3710, EnemyWolf.as:384, EnemyShield.as:347, EnemyNianMonster.as:383, EnemyClone.as:222/443, EnemyJiangSi.as:304)`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — the ledger's Ready bullet is CORRECT and should be extended to four bands + piercing, not replaced by the boss-only rule the survey proposed.

### `[[combat-core/min-damage-floor-is-generic-and-attacker-keyed]]` — UPHELD [A2] (1 critic)

The post-defense minimum-damage floor is a GENERIC pipeline rule, not boss scaling: Damage.getMinDamage() is a four-band ladder keyed to the ATTACKER's level (1 / lvl/8 / lvl/6 / lvl/4, each plus piercingDamage) and is applied immediately after defense subtraction on every hit - so for enemy-on-player above L30 the floor really is EnemyLevel/4, and the ledger bullet is incomplete rather than wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:150-172; MCSPlayer.as:3415-3419; EnemyWolf.as:296; EnemyFox.as:169; EnemyNianMonster.as:295; EnemyJiangSi.as:206`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) - this OVERTURNS the survey's claim 14, not the ledger. The ledger's 'EnemyLevel/4' bullet stays Ready; what it needs is the three lower bands (<=10 -> flat 1, <=20 -> lvl/8, <=30 -> lvl/6) and the +piercingDamage term added, plus the note that the same ladder applies with the PLAYER's level when the player is the attacker. Integer division throughout.

### `[[frames/HUNT-item-rarity-colour-on-film]]` — UPHELD [A1] (1 critic)

The rarity colour enum from GameEngine.as is visible on film and nothing in the packet mentions it. Quest-offer lines render the item name in a rarity colour, and the names themselves expose a four-part procedural grammar (prefix / quality / base / 'of' suffix).

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0033.jpg and frame_0038.jpg (crop 0,400-700,576 @2x); enum at reference/decompiled/shs3_android/scripts/GameEngine.as:564-572`
- **Build:** web v0.717
- **Lane impact:** items-equipment: rarity tiers, their UI colours, and the procedural name grammar all become buildable

### `[[frames/HUNT-six-buff-potatoes]]` — UPHELD [A2] (1 critic)

The 30-minute buff timer governs a six-member family, not the single damage buff the packet found: four 150% buffs and two 200% regeneration buffs, each carrying the same one-buff-at-a-time clause.

- **Cite:** `strings.json["4132"]-["4135"], ["4229"], ["4230"]; render check at reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0007.jpg (crop 600,80-1024,260 @5x)`
- **Build:** android v0.682; the Damage member verified rendering verbatim on a web v0.717 frame
- **Lane impact:** items-equipment, economy, ui-hud: the buff HUD widget must render six labels, not one

### `[[frames/consumable-buffs-run-a-30-minute-real-clock]]` — UPHELD [A1] (2 critics)

Consumable buffs run on a 30-minute wall-clock countdown shown by a dedicated bottom-right HUD timer, and only one buff may be active at a time — a real-time constant the ledger records nowhere.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg (crop 770,495-1024,518 @9x); item card at reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0007.jpg (crop 620,90-960,200 @6x)`
- **Build:** web v0.717
- **Lane impact:** ui-hud (an uncatalogued HUD widget), items-equipment, world-exploration (a second real-time clock beside the day rollover)

### `[[gauntlet-s26b/itemdata-ships-nineteen-empty-item-rows]]` — UPHELD [A2] (1 critic)

itemdata.xml ships NINETEEN completely empty item records, not one: ids 4021, 4022, 4070, 4102, 4103, 4104, 4105, 4106, 4107, 4110, 4111, 4112, 4113, 4114, 4115, 4116, 4117, 4138 and 7075 each carry an <id> and no other field. A further 147 rows carry only <id> plus <type> and/or <unique>, giving 166 stub rows in total out of 982.

- **Cite:** `reference/extracted/itemdata.xml:5449-5451, :2775-2777, :3165-3167, :3457-3459 (plus my own scan of all 982 <item> blocks)`
- **Build:** both
- **Lane impact:** L-items-equipment: sharpens packet claim 44 (which I upheld) - its 'around 90 further rows are stubs' measures 166, and 7075 is one of nineteen empty rows rather than a singleton. The 1:1-vs-deviate decision the claim asks for therefore applies to a whole class of rows, not to one anomaly.

### `[[hunter04/buff-attack-scales-minDamage-only]]` — UPHELD [A2] (1 critic)

Corrected replacement for the refuted contamination claim. The 13-entry buff table is real and verifies exactly (reference/decompiled/shs3_android/scripts/StatsManager.as:288-312; labels at OverworldHUD.as:1388-1425 - XP/DAMAGE/DEFENSE/SPEED 150%, AP-regen and duel-token-regen 200%), and the duel_dense footage IS buffed: I read reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x LANCZOS) and saw gold '150% DAMAGE' under the HUD bars. But the buff is applied as 'this.minDamage *= 1.5;' ONLY - reference/decompiled/shs3_android/scripts/MCSPlayer.as:210-212, and web §1t99s0§.as:211-213 identical - while damageRange is untouched and getDamage rolls 'minDamage + Math.random() * damageRange' (MCSPlayer.as:3201). So the buff lifts the FLOOR of the damage roll, not the roll; dividing a measured damage or TTK by 1.5 is a systematic over-correction. The branches are an else-if chain, so exactly ONE buff is ever active. BUFF_INJURED is the mirror and has never been recorded anywhere: ':218-221 this.minDamage *= 0.5; this.defense *= 0.5; this.baseSlashLength *= 0.5;' - it halves REACH too.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:210-212, :218-221, :3201 · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:211-213 · reference/decompiled/shs3_android/scripts/StatsManager.as:288-312 · reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1425 · reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop 230,960-560,1070 @4x)`
- **Build:** both
- **Lane impact:** All video-measurement lanes: flag reference/frames/duel_dense/ as BUFF_ATTACK-active, but do NOT divide by 1.5 - only minDamage is inflated, so a measured hit is (1.5*minDamage + roll), and the unbuffed floor is recoverable only if damageRange is known. L-items-equipment gains the 13-buff consumable layer plus the previously unrecorded BUFF_INJURED reach penalty.

### `[[hunter05/repair-and-reinforce-are-priced-in-coins]]` — UPHELD [A2] (1 critic)

StatsManager.getGold()/changeGold() are the COIN purse, not the premium currency: STAT_GOLD=11 (clamped by getMaxCoins(), local var 'newCoins', seeded to 100 at character creation) while the premium currency is STAT_HGOLD=12 (getHeavenlyGold), which the HUD prints as 'GOLD'. Therefore Repair-Weapon costs currentNodeLevel x 10 COINS and Reinforce costs 5000 COINS — matching the ledger's own ':80 Reinforce 5000c' and the on-screen '259 COINS' readout.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194, :705-706, :2627-2630`
- **Build:** android v0.682 (web parity not checked)
- **Lane impact:** L4 economy — corrects items-equipment/repair-weapon-cost-held, which asserts 'a gold currency (not coins)'. Every InteractUI service that calls getGold()/changeGold() is coin-priced.

### `[[hunter05/wear-gates-damage-as-a-binary-cliff]]` — UPHELD [A2] (1 critic)

Weapon wear DOES reach the damage path — not as the phantom condition multiplier, but as a binary broken/not-broken cliff. isBroken() is read by the web getMinDamage/getDamageRange twins, and the android original shows the effect: a broken weapon contributes ATK+1 instead of the item's mindamage.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1854-1865 and §1t1523s0§.as:2306, :2322; reference/decompiled/shs3_android/scripts/StatsManager.as (getMinDamage)`
- **Build:** both
- **Lane impact:** L1/L2 — qualifies items-equipment/condition-blocker-dead-in-both-builds. The rewrite must say 'no condition MULTIPLIER; a broken-weapon damage cliff instead', not 'condition has no damage effect'.

### `[[hunter05/web-references-item-2218-that-no-held-table-contains]]` — UPHELD [A2] (1 critic)

The web v0.717 soul-infusion UI branches on item id 2218 at ten separate sites, but 2218 exists in neither reference/extracted/itemdata.xml nor reference/extracted/android/111_Mobile_ItemData.bin — I diffed them and their 982-id sets are identical, with ids running 2200…2216 in that block. Either the held 'web' item table is actually the Android one, or 2218 is a hard-coded sentinel; from the artifacts alone I cannot tell which.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:368, :385, :430, :465, :609, :644, :664, :681, :746, :893`
- **Build:** web v0.717 code vs the shared item table
- **Lane impact:** L6/L3 integrity — S0-3's 'Data-XML row counts match exactly' parity story has a hole on the item table that anything citing 'the WEB itemdata.xml' inherits.

### `[[itemdata-hunter/damage-table-is-non-monotonic]]` — UPHELD [A2] (1 critic)

The itemdata weapon damage table is NOT monotonic in level, so it cannot be replaced by a fitted curve. The catalogue maximum damage belongs to item 13179 'Steel Sword' at minlvl 65 with mindamage 39 / maxdamage 108, which is above the only minlvl-79 row (13225 'Steel Sabre', 81-90) that claim #31 presents as the high end. Claim #31's headline (the curve is tabulated, not missing) stands; its implied ordering does not.

- **Cite:** `reference/extracted/itemdata.xml:9591 (item 13179) vs :9925 (item 13225)`
- **Build:** both
- **Lane impact:** L-items-equipment: port the 158-row table verbatim; any level->damage formula fitted to it will misprice the top of the Steel ladder.

### `[[itemdata-hunter/itemdata-ships-an-empty-item-row]]` — UPHELD [A2] (1 critic)

A third shipped data bug the packet misses: itemdata.xml contains a completely EMPTY item record — item 7075 has an <id> and nothing else. It parses to type 0 = ARMOR, displayname "", gvalue 1, art 7075 (a HAT-range art id on a torso slot, so getMCSComponent falls back to torso0). It is also the single 7xxx id inside the 153 'type-absent torso items' claim #32 counts. Around 90 further rows are stubs carrying only <id> plus at most <type> or <unique>. Measured over all 982 items: 804 carry <name> and 178 DO NOT (103 of the nameless are unique=2 NPC-wardrobe art, 75 are not) — those 178 render with an empty name.

- **Cite:** `reference/extracted/itemdata.xml:5449-5451`
- **Build:** both (schema parity proven by claim #35)
- **Lane impact:** L-items-equipment: any item pipeline must survive a row with no fields at all and 178 nameless items, and a 1:1 recreation has to decide whether to reproduce the empty row or deviate — the same call claim #27 asks for on the other two bugs.

### `[[itemdata-hunter/modifier-dispatch-numeric-fallback]]` — UPHELD [A2] (1 critic)

The consumable modifier dispatch has a three-way numeric fallback that no claim decodes, plus nine named engine actions the packet's 'consumable effect table' omits. After the named branches, InventoryUI.onUseItem falls through to: modid < 2000 -> changeStat(modid, value) (so ANY id under 2000 is a stat delta, not just the 0-16 enum); modid >= 30000 -> setStat(modid, value) (a raw stat write); otherwise -> changeItemQty(modid, value), i.e. 'give `value` of item #modid'. itemdata exercises the second branch: item 2210 'Reset Quests' carries <modifier><id>40000</id>. Undocumented named branches: 34 (addGeneratedItemToInventory), 96 (teleport to territory dojo), 104/105/106 (loot-dialog control, RNG seed from server date, addLootItemBasic), 117 (wipe quest log + teleport), 123/124 (create clan).

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1098-1109; reference/extracted/itemdata.xml:2411-2429`
- **Build:** android v0.682
- **Lane impact:** L-items-equipment / L-economy: completes the item-effect contract. The measured modifier-id histogram over all 982 items is 103 x223, 104 x42, 105 x40, 106 x33, 0 x13, 3 x13, 38 x6, 13/15/1/2 x3 each, 82/84/78/79/9/8/5 x2 each, and one each of 102, 98, 25, 12, 90, 96, 97, 99, 101, 117, 40000, 122, 123, 124, 6, 7.

### `[[itemdata-hunter/v0717-strings-are-loaded-over-the-network]]` — UPHELD [A2] (1 critic)

Positive mechanism evidence for why the v0.717 affix wording is gone, upgrading claim #34 from an absence argument. The web build never embeds its string table: LangManager.setLanguage builds a path of './data/' (or server + 'strings/') and hands Locale the URLs shs3_en.xml / shs3_fr.xml / shs3_es.xml, then calls Locale.loadLanguageXML. The table was fetched from the now-dead server at runtime. `find reference -iname "*shs3_en*"` returns nothing, and LC_ALL=C grep over the 329 MB reference/extracted/payload.xml for 'Slaughter' and 'of Attack' returns 0 hits each.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:63-84 (and the duplicate path at :91-94)`
- **Build:** web v0.717
- **Lane impact:** L-items-equipment / L-ui-copy: settles that NO amount of further searching in what we hold will recover v0.717 UI copy above string id 9010. The Android v0.682 hardcoded word lists (ItemGenerator.as:102-127) are the only wording we will ever have, and using them is a knowing v0.682 substitution.

### `[[itemdata/android-string-table-matches-v0717-ui]]` — UPHELD [A1] (2 critics)

Three UI strings from the Android 118_Mobile_Lang_EN.bin table read verbatim off a v0.717 gameplay frame, which narrows Stage-0b S0-3's 'UI copy parity is NOT established' caveat from assumption to evidence (3 hits, 0 counterexamples) — while P9 supplies two counterexamples on the tuning-constant side.

- **Cite:** `reference/frames/s21_weapon/t655.0.png, item-panel crop (1310,235)-(1780,500) of the 1920x1080 frame (read at x0.5, panel legible); table entries 392, 4244, 4245 in docs/gauntlet/L0/index/strings.json; item row reference/extracted/itemdata.xml:8146-8156`
- **Lane impact:** L10 ui-hud and L5 items-equipment: Android-sourced UI COPY may now be ported with a cited precedent rather than a caveat; five itemdata numbers for item 13022 are simultaneously frame-confirmed. Applies across every lane that wants to use the string table.

### `[[itemdata/item-name-template]]` — UPHELD [A2] (2 critics)

The generated item-name template is exact: up to three prefixes plus one suffix, drawn from fixed modifier slots (mod3, mod2, mod0 as prefixes; mod1 as suffix), so a 5-affix item never shows its 5th affix in the name.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:735-750, with :873-882 drawPreSufValue and :884-895 reverseFindTier`
- **Lane impact:** L5 items-equipment (the ledger lists only an 'item-name template' as ready, without the slot order); L10 ui-hud (name length budget for the item panel).

### `[[itemdata/no-items-config-still-true]]` — UPHELD [A3] (2 critics)

The ledger's one honest items-equipment surface note still holds on 2026-08-15 — there is no items config in the build — and after everything above it is now the only binding constraint on a 1:1 item system.

- **Cite:** `filesystem byte-check (not a vitest): `ls src/config/` run 2026-08-15 in /Users/kheshav/kheshav-code/SSHD 1-1`
- **KILLS this line:** "- Surface: measured weight table + named-item blocks exist in segment notes but no items config file exists yet — entirely un-ported."
- **Lane impact:** L3: the lane is now a PORT job, not a research job. Information is no longer the bottleneck for items-equipment; 982 rows plus the compositing contract are sitting on disk unported.

### `[[itemdata/procedural-item-colour]]` — UPHELD [A2] (2 critics)

Procedural item colouring exists and is unrecorded anywhere in the ledger: three loot-pool garments (4062 'Female Kimono', 4077 'Garment', 11040 'Pants') get a runtime primary colour with each RGB channel uniform on 0-127, and the game carries an 11-word colour vocabulary; the <pcolor>/<scolor> XML fields are declared but used by zero itemdata rows.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:663-666 and ColorCode.as:95-102; vocabulary at ItemGenerator.as:91 resolving to docs/gauntlet/L0/index/strings.json entries 432-442; field declarations at XMLItem.as:20-24 vs the measured tag histogram of reference/extracted/itemdata.xml (no pcolor/scolor tags in 10,545 lines)`
- **Lane impact:** L11 art-anim-audio-feel (tinted gear is a render requirement nothing in the art digest mentions) and L5 items-equipment (item colour is a runtime property, never a data field — a recreation must not model it in the item table).

### `[[itemdata/v0717-affix-words]]` — UPHELD [STILL_UNHELD] (2 critics)

The v0.717 affix prefix/suffix wording is not recoverable from anything we hold: the web ItemGenerator reads all 17x8 words from language ids 10029-10208, our only string table (Android 118_Mobile_Lang_EN.bin) tops out at numeric id 9010, and the web payload ships no string-table blob among its 27 bindata files.

- **Lane impact:** L5 items-equipment: the v0.682 word lists (claim itemdata/affix-suffix-pool) are the best available substitute and must be labelled as the Android build, not as v0.717 fidelity. Closing this needs the dead server's language file or a frame showing an affixed item name — no such frame was found this pass.

### `[[itemdata/web-android-schema-parity]]` — UPHELD [A2] (2 critics)

Item-schema parity between the web v0.717 payload and the Android v0.682 build is proven field-by-field, so itemdata-derived claims can be ported without the Stage-0b S0-3 build caveat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:6-54 and :68-202 (web v0.717 item parser) vs reference/decompiled/shs3_android/scripts/XMLItem.as:6-178`
- **Lane impact:** All lanes reading itemdata: combined with the frame match, the Android decompile may be used as the readable Rosetta stone for the web payload's obfuscated item code. Parity is established for the ITEM schema only — it says nothing about UI copy or combat tuning elsewhere.

### `[[items-equipment/23-render-slots-not-27]]` — UPHELD [A2] (1 critic)

MCSCharacter declares 27 PART_* constants but instantiates only 23 MovieClips, so the four shoulder/knee indices (23-26) point past the end of partList.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:62, :120, :141-145`
- **Lane impact:** L6 (art/animation) -- build 23 z-ordered render slots, not 27. PART_prop3(22) is the last real one; l_shoulder/r_shoulder/l_knee/r_knee are declared-but-unallocated (note they are the only ones typed :* rather than :int, i.e. a later, unfinished addition).

### `[[items-equipment/27-parts-but-23-human-layers]]` — UPHELD [A2] (1 critic)

MCSCharacter declares 27 PART_ indices but allocates only 23 MovieClip layers for a human (partListLength = 22, loop i <= partListLength); indices 23-26 (l/r shoulder, l/r knee) are creature-only and exist solely for MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:56-62, :120, :141-146; reference/decompiled/shs3_android/scripts/MCSWolf.as:13-14, :184-197`
- **Lane impact:** L6 (art) — the paperdoll z-order table a builder should implement is 23 layers (PART_l_hand 0 .. PART_prop3 22), not 27. The four extra indices are the quadruped rig.

### `[[items-equipment/affix-eligibility-matrix]]` — UPHELD [A2] (1 critic)

Affix rolling is gated by an 8-type x 17-channel 0/1 eligibility matrix, and the FIRST affix is forced by item type (armor -> DEFENSE, weapon -> ATTACK, shoes -> SPEED) with that channel then removed from the pool.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:397-455`
- **Lane impact:** L4/L7 (economy + loot) — this is the missing half of the affix system the survey banked; without it every item type rolls from the same pool and loot identity collapses.

### `[[items-equipment/art-override-rows-are-only-146]]` — UPHELD [A2] (1 critic)

Only 146 of the 982 itemdata rows carry an explicit <art> override (68 distinct values, max 20052); every other item resolves its art symbol from its own id, so the missing art set is one symbol per id, not 982 bespoke pieces.

- **Cite:** `reference/extracted/itemdata.xml (146 <art> rows / 68 distinct, counted this run); reference/decompiled/shs3_android/scripts/MCSCharacter.as:583-592`
- **Lane impact:** L6 (art) - quantifies the residual art blocker and shows 68 art ids are deliberately shared across multiple item rows (palette-swap reuse), which reduces the from-scratch authoring count below the naive 982.

### `[[items-equipment/border-is-four-tier-16-frames]]` — UPHELD [A2] (1 critic)

The inventory slot border encodes the full 4-tier derived rarity (normal/special/rare/unique) as 16 named frames — borderType + _default/_selected/_mouseover/_selectedmouseover — which is why the game ships both a 'blue border = rare' tip and a 'purple border = unique' tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52, :116, :219-220, :283-299; GameEngine.as:568 and :572`
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the slot symbol needs 4 border palettes x 4 interaction states; wiring the border to <unique> alone drops the blue rare state.

### `[[items-equipment/border-is-the-four-tier-ladder]]` — UPHELD [A2] (1 critic)

The inventory slot border is not a unique flag — it is the four-tier rarity ladder rendered as a 4 tiers x 4 states = 16 frame-label art contract on the ShopItem clip.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:27, :51-52, :283, :287, :295, :299; corroborated by GameEngine.as:568 and InventoryUI.as:1453; frame reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2 LANCZOS`
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the survey's guidance ('border tracks <unique>, text colour tracks the 4 tiers') would leave rare items with no distinct border. The real contract is 16 named frames: {normal,special,rare,unique} x {_default,_selected,_mouseover,_selectedmouseover}. This is also a small but real named art requirement that belongs beside the icon-namespace gap.

### `[[items-equipment/border-is-the-rarity-ladder]]` — UPHELD [A2] (1 critic)

The item border is driven by the SAME derived 4-tier function as the text colour, not by the <unique> flag: ShopItem sets borderType = getShopItemType() and jumps to that frame label, and the game's own tip list contains a blue=rare border tip six lines above the purple=unique one.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52; reference/decompiled/shs3_android/scripts/GameEngine.as:568 and :572`
- **Lane impact:** L5 (UI/HUD) — one colour system, four border states (normal/special/rare/unique) x four frame suffixes (_default/_mouseover/_selected/_selectedmouseover). Overturns the survey's guidance that border and text colour are separate channels. Also note 'unique' is broader than <unique>==1: quest-pickable items, trade ids 20103-20107 and player-named items all return 'unique'.

### `[[items-equipment/build-parity-caveat-proven-live]]` — UPHELD [A2] (1 critic)

S0-3's build-parity caveat is load-bearing, not theoretical: the same speed-scaling function caps at 300 in Android v0.682 and at 600 in web v0.717 — a clean 2x tuning divergence.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861 (getSkillCooldownModifierVal); reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2288-2296`
- **Lane impact:** Cross-lane (L1/L2/L8) — a concrete counterexample proving Android combat/skill tuning may NOT be ported unchecked. Every Android-only number in this and other units needs a §1t1523s0§ / §1t17s0§ cross-read before it is treated as v0.717. (The items-lane numbers I re-checked — getSellAmt, the condition ladder, getMinDamage/getDamageRange, getSlashUsage, the reach formula — all DO match.)

### `[[items-equipment/condition-tier-thresholds]]` — UPHELD [A2] (12 critics)

The condition ladder is 7 named states with exact thresholds (uses==0, uses==1, ==0, <25, <50, <75, else), names resolved via the S0-3 string table, and the 25/50/75 ladder is present in the web v0.717 build too.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:712-746 + docs/gauntlet/L0/index/strings.json ids 387-392,639; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1011,1015,1019`
- **Lane impact:** L5 (UI/HUD) + items — the ledger listed only 'condition tier names' as Ready; the numeric thresholds and the red-wrap on Broken are now exact.

### `[[items-equipment/consumable-and-accessory-icon-families]]` — UPHELD [A2] (1 critic)

Two icon-only symbol families exist that have no paperdoll counterpart: consumables resolve as class `item` + <art> with `item0` as the miss case, and accessories resolve as `acc` + <art> with AccessoryDummyIcon as the miss case; 805 of the 982 item rows are not type-9 equipment.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-216 and :226-232; reference/decompiled/shs3_payload/scripts/item0.as; reference/extracted/itemdata.xml type histogram counted this run`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) - blocker 5's icon-manifest half stays OPEN and is now precisely scoped: recover or author the item#### and acc#### families for ~805 non-equipment rows. Only 146 of 982 rows carry an <art> id, so most consumables fall through to item0.

### `[[items-equipment/copymodifiers-excludes-85-88]]` — UPHELD [A2] (1 critic)

Four further reserved modifier IDs exist that no survey claim names: Item.copyModifiers explicitly refuses to copy IDs 85, 86, 87 and 88, so soul-infusion silently drops them.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:317-330`
- **Lane impact:** L4 (crafting) + L10 (persistence) - the reserved band is 80/81/82/83/85/86/87/88/89/125, and 85-88 are specifically non-transferable through the forge. The survey's two claims also disagree with each other on whether 83 belongs to the set.

### `[[items-equipment/durability-is-the-uses-tag-115-items]]` — UPHELD [A2] (1 critic)

The durability field is the XML tag <uses>, and only 115 of the 982 items have it — so the seven-state condition ladder applies to 115 items and the other 867 render no condition line at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:186-190; Item.as:1481-1487 and :712-715; docs/gauntlet/L0/index/itemdata.json path itemdata/item/uses`
- **Lane impact:** L4 + L5 — bounds the condition/repair system: 115 durable items out of 982, cap values only 50/60/80/100. A builder wiring durability to every item implements a system 8x larger than the original. Also names the tag correctly for anyone porting itemdata.xml.

### `[[items-equipment/durability-is-uses-and-mostly-absent]]` — UPHELD [A2] (1 critic)

Item durability is not a field of its own - XMLItem maps it from <uses> - and only 115 of the 982 item rows carry it, so getCondition() returns -1 and no condition line renders for the other 867 items.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:181-188; Item.as:1481-1495; docs/gauntlet/L0/index/itemdata.json (itemdata/item/uses count 115, distinct 4, values 50/60/80/100; no itemdata/item/durability path exists)`
- **Lane impact:** L5 (UI/HUD) + L7 (loot) - the seven-state condition ladder applies to ~12% of the roster only, and durability values are a 4-value domain (50/60/80/100), not a continuum. A port that gives every item a condition bar is wrong.

### `[[items-equipment/elemental-def-affix-rotation-is-deliberate]]` — UPHELD [A2] (1 critic)

The four elemental-DEF affix channels reusing other elements' name pools is a consistent opposing-element rotation (FIREDEF takes water names, WINDDEF earth, WATERDEF wind, EARTHDEF fire), not the paste bug the survey calls it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145`
- **Lane impact:** L4/L7 (economy + loot) - copy the mapping verbatim but do NOT label it a bug in config, and do not 'fix' it: a fire-resist item named 'Icy ... of Frost' is the intended design, and calling it a defect invites a future session to silently correct it away from 1:1.

### `[[items-equipment/elemental-def-affix-wheel-is-deliberate]]` — UPHELD [A2] (1 critic)

The four elemental-DEF affix channels borrowing other pools is a deliberate counter-element wheel, not a shipped bug: each DEF channel uses the pool of the element that counters it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145`
- **Lane impact:** L4/L7 — port it verbatim as designed. Fire defense is named 'of Water / of Ice / of Frost', wind defense 'of Stone / of the Mountain'; treating it as a bug and 'fixing' it would change 32 of the 104 affix names away from the original.

### `[[items-equipment/elemental-def-pools-are-opposition-not-bug]]` — UPHELD [A2] (1 critic)

The four elemental-DEF affix channels do not reuse the 'wrong' pools by accident - the mapping is a consistent elemental-opposition scheme (fire-DEF takes water names, water-DEF takes wind, wind-DEF takes earth, earth-DEF takes fire) and should be copied as-is rather than 'fixed'.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145 (with the source arrays at :117-124)`
- **Lane impact:** L4/L7 (economy + loot) - corrects the survey's 'shipped bug' framing. Fire resistance rolling as 'Icy ... of Frost' is coherent design; a builder told it is a bug will 'fix' it and break 1:1 on every elemental-DEF affix name.

### `[[items-equipment/eleven-modifier-ids-unnamed]]` — UPHELD [A2] (1 critic)

Eleven of the 34 distinct modifier ids used in itemdata.xml fall outside both XMLItem's 0..16 switch and its 101..1999 Set band, so they hit the trace("ErrorValue") branch and have no name.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:290-296; reference/extracted/itemdata.xml (own parse of all 412 <modifier> rows)`
- **Lane impact:** L4/L7 -- corrects the survey's 'fully resolved'. 393 of 412 modifier rows are readable; 19 are not. Id 82 among them is the reserved USESMODID, so ~10 ids are genuinely unknown channels and must be labelled INFERRED if implemented.

### `[[items-equipment/eq-comparison-frame-payload-identity]]` — UPHELD [A1] (12 critics)

The (EQ:n) comparison UX is confirmed to the hex AND the frame's item resolves exactly to a payload row: the frame's BRANCH / DMG 1-2 / WEIGHT 1 is itemdata.xml id 13002 name 4041 -> strings.json "Branch", mindamage 1 maxdamage 2 weight 1, with the red 2 explained by compareValue's a<b branch.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4; matched to reference/extracted/itemdata.xml:7906-7915 and docs/gauntlet/L0/index/strings.json["4041"]; formula at reference/decompiled/shs3_android/scripts/Item.as:759-770`
- **Lane impact:** L5 (UI/HUD) — supplies the two comparison hexes (#00A606 green / #FF0000 red, both present in the web build) and is the cleanest frame-to-payload identity check in this system: an on-screen tooltip reproduced exactly by an XML row.

### `[[items-equipment/frame-equipped-item-also-resolves]]` — UPHELD [A1] (1 critic)

Both items in the frame resolve to payload rows, and the selected one is UNIQUE across the whole roster: exactly one of 982 rows has mindamage 1 / maxdamage 2 (id 13002 'Branch'), and the pickaxe in the weapon box with (EQ: 1 - 3) is id 13022 name 4244 'Pickaxe', weight 10.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4 LANCZOS and crop (170,240)-(870,1040) upscaled x2 LANCZOS; matched to reference/extracted/itemdata.xml and docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L5 + L4 — a two-item frame-to-payload identity rather than one, and the selected tile's grey (normal) border independently confirms the derived-rarity read: 13002 carries no <unique> and no modifiers, so getShopItemType() = 'normal'. Open sub-item: the 'LEVEL 1' label under the icon is NOT <minlvl> (13002 is -4) and Item.getLevel() returns 0 for a modifier-free Branch — its source is a SWF-embedded field not resolvable in the decompiled AS3.

### `[[items-equipment/frame-level-label-unsourced]]` — UPHELD [STILL_UNHELD] (1 critic)

The per-item 'LEVEL 1' label visible in the item-detail panel has no matching field in the payload row it was matched to: itemdata row 13002 carries minlvl -4 and no <levelrestriction>, so the display rule that produces 'LEVEL 1' is not established.

- **Lane impact:** L5 (UI/HUD) - one unexplained field sitting inside the survey's flagship frame-to-payload identity check. Clamp-to-1, a different field, or a v0.717-only UI rule; the Android InventoryUI has no per-item LEVEL label at all.

### `[[items-equipment/full-modifier-id-table]]` — UPHELD [A2] (1 critic)

The complete runtime modifier-ID table adds ten channels to the XML-only one: 28-31 = Fire/Wind/Water/Earth ATK and 200-205 = Fire/Wind/Water/Earth DEF, Critical Damage, Piercing Damage; and ids 103-106 (82% of itemdata's modifier rows) are container contents, not stats.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1004-1053; ids at StatsManager.as:226-260; names at docs/gauntlet/L0/index/strings.json 507-510, 871-876`
- **Lane impact:** L4/L7 — the elemental and crit/pierce affixes are 11 of the 17 generated channels; without these ids the tooltip renders them blank and mislabels 223 pack rows as 'Set: 103'.

### `[[items-equipment/generic-defense-floor-is-attackerlvl]]` — UPHELD [A2] (1 critic)

The generic post-defense damage floor is Damage.getMinDamage(), a four-band ladder keyed to attackerlvl (1 / lvl÷8 / lvl÷6 / lvl÷4, each + piercingDamage), applied immediately after 'damage -= getDefense()' at every damage-receipt site including the player's.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-170; call site reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — VINDICATES the ledger bullet the surveyor tried to delete. Encode the full four-band ladder keyed to the ATTACKER's level plus the piercing add-on; the ledger's 'EnemyLevel/4' is the >30 band written down. The separate playerLVL ladder the surveyor found (EnemyPlayer.as:107-123, duplicated in EnemySpearElite/EnemyWolfAlpha/EnemyKanjiGuardian/EnemyElite) is enemy HP auto-scaling and belongs to L3, not here.

### `[[items-equipment/generic-min-damage-floor-is-attacker-keyed]]` — UPHELD [A2] (1 critic)

The four-band min-damage floor is a GENERIC post-defense rule on the Damage object keyed to the attacker's level and applied on the player's damage-taking path in 9 files — which means the ledger's 'defense min-floor (EnemyLevel/4)' is the correct top band, not a wrong rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-172; MCSPlayer.as:3415-3419 and :3710-3712; grep damageObj.getMinDamage() -> 9 files`
- **KILLS this line:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — this belongs in combat-core, not items. The ledger bullet stands and should be REFINED not replaced: attackerLvl<=10 -> 1, <=20 -> lvl/8, <=30 -> lvl/6, else lvl/4, each plus piercingDamage, applied immediately after 'damage -= getDefense()'. EnemyPlayer.as:107-123 is the boss-HP-sizing mirror of the same ladder, not a separate mechanic.

### `[[items-equipment/getweight-diverges-between-builds]]` — UPHELD [A2] (1 critic)

getWeight() — the input to the sell-price branch and to the carry-weight total — is NOT the same function in the two builds: web v0.717 adds a per-item weight term that Android v0.682 has no counterpart for.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1580 vs reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1975`
- **Lane impact:** L4 (economy) + L5 (HUD weight bar) — a concrete instance of the S0-3 Android-parity caveat biting. getSellAmt is identical in both builds but its only branch reads a function that is not. Also: getWeight multiplies by QUANTITY, so the >=10 sell step is a stack threshold, not an item-weight threshold — ten weight-1 items sell at x10.

### `[[items-equipment/getweight-is-stack-weight]]` — UPHELD [A2] (1 critic)

Item.getWeight() returns unit weight MULTIPLIED BY QUANTITY on every call after the first, so the sell-price weight>=10 step and the carrying-weight total are both computed on stack weight - and the first call, with weight == -1, returns the raw XML weight unmultiplied.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1579; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1966-1974`
- **Lane impact:** L4 (economy) - a builder implementing getSellAmt's weight>=10 test against the unit weight will misprice every stackable item, and the first-call/subsequent-call asymmetry is a shipped inconsistency that must be reproduced (or deliberately deviated from and labelled) for 1:1 pricing.

### `[[items-equipment/getweight-is-stack-weight-and-diverges]]` — UPHELD [A2] (1 critic)

getWeight() returns weight x QUANTITY, so the sell formula's `weight >= 10` step is stack weight, not the itemdata <weight> field — and the web build adds a weight-modifier term the Android build lacks.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as getWeight; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1948-1976`
- **Lane impact:** L4 (economy) — getSellAmt is two-build-confirmed but its INPUT is not. A builder feeding the static <weight> column into `>= 10` gets the wrong branch for stacks, and gets the web build wrong for any item carrying a weight modifier. Also explains the frame's WEIGHT: 43 / 100 as a stack sum (the onigiri x3 contributes 3).

### `[[items-equipment/human-part-stack-is-23-not-27]]` — UPHELD [A2] (1 critic)

The human paperdoll layer stack is 23 deep, not 27: MCSCharacter allocates partList[0..22], and PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) exist only for MCSWolf, where they are front and back legs.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120 and :141; reference/decompiled/shs3_android/scripts/MCSWolf.as:13, :184, :188, :193, :197`
- **Lane impact:** L6 (art/animation) — corrects the layer count a from-scratch equipment renderer must implement: 23 z-ordered containers for a human, with 23-26 being creature-only. Index==addChild z-order still holds for 0..22 (no setChildIndex/swapChildren touches the top-level partList; the six setChildIndex calls reorder inside a single part container). armor=7 parts and pants=5 parts both verified independently.

### `[[items-equipment/human-render-stack-is-23]]` — UPHELD [A2] (1 critic)

MCSCharacter instantiates 23 z-ordered part MovieClips (indices 0..22), not 27; PART_l_shoulder(23) through PART_r_knee(26) exist only on MCSWolf and are bound there as quadruped leg segments, so their human-sounding names are misleading.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120,141; MCSWolf.as:12-18,184-197`
- **Lane impact:** L6 (art/animation) - the equipment paperdoll z-order table is 23 entries; a builder coding 27 authors four layers the OG never renders on a human and mis-attributes wolf legs to shoulders and knees.

### `[[items-equipment/humanoid-partlist-is-23-not-27]]` — UPHELD [A2] (1 critic)

MCSCharacter declares 27 part indices but allocates only 23 MovieClips for humanoids; indices 23-26 (l_shoulder, r_shoulder, l_knee, r_knee) exist solely for creature rigs, which raise partListLength and rebuild the list.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :136-146, :54-62; MCSWolf.as:6, :13-14, :148, :184-197`
- **Lane impact:** L6 (art/animation) - refines the survey's z-order table. The samurai paperdoll is a 23-layer stack (PART_l_hand 0 through PART_prop3 22), not 27; a builder copying 27 layers for the human rig allocates four dead layers. The extra four belong to the creature-rig contract instead, which matters for the 10 creature idle sets identified in S0-1.

### `[[items-equipment/humanoid-stack-is-23-layers]]` — UPHELD [A2] (1 critic)

MCSCharacter allocates 23 render layers, not 27: partListLength is 22 and the constructor loops i <= partListLength, so PART_l_shoulder(23), PART_r_shoulder(24), PART_l_knee(25) and PART_r_knee(26) are never instantiated on a human — they are quadruped parts used only by MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120 and :141; readers at reference/decompiled/shs3_android/scripts/MCSWolf.as:13, :184, :188, :193, :197`
- **Lane impact:** L6 (art/animation) — code 23 z-ordered layers for the fighter paperdoll, indices 0..22 ending at PART_prop3. The four shoulder/knee indices belong to the creature rig only.

### `[[items-equipment/icon-dispatch-id-band-table]]` — UPHELD [A2] (1 critic)

ShopItem.setItemID is a complete item-ID -> art-slot band table, and it shows a shipped hole: neck items (10000-10999) match no branch and render no icon at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:134-199; band counts over reference/extracted/itemdata.xml (982 ids, 0 unaccounted)`
- **Lane impact:** L5 (UI/HUD) + L6 (art) - gives the builder the exact id->slot partition for all 982 rows in one table, and explains the EQ_NECK oddity from a second direction: 14 neck items exist in itemdata.xml, have no UI box, and have no icon path either.

### `[[items-equipment/icon-only-symbol-families-still-open]]` — UPHELD [A2] (1 critic)

The icon-manifest half of blocker 5 is NOT dissolved: consumables and accessories render from dedicated icon-only symbol families "item####" and "acc####" that no paperdoll part index consumes - 187 of 982 items (19%) - and only the fallback item0 survives in the web payload, with zero acc classes.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-232; ShopItem.as:145, :149, :177, :191; ls reference/decompiled/shs3_payload/scripts | grep -cE '^item[0-9]' -> 1, '^acc[0-9]' -> 0`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render - a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) - restores part of ledger blocker 5. The paperdoll half IS dead (that half of the survey holds), but a second, independent icon art set is required for 99 items in band 2000-2999, 79 in band 20000-29999 and 9 in band 3000-3999. Also: ShopItem.as:177 excludes the neck band 10000-10999 (14 items) from icon dispatch entirely, so neck items have no inventory icon at all.

### `[[items-equipment/icon-renderer-band-table]]` — UPHELD [A2] (1 critic)

The item icon system is a complete itemID-band to renderer table in ShopItem.setItemID, and it includes two icon-only art namespaces ("item", "acc") with no paperdoll counterpart plus one band with no renderer at all - so the ledger's 'icon manifest' is a real, now-specified blocker rather than a category error.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:134-199; MCSItem.as:203-247; MCSCharacter.as:9-62`
- **KILLS this line:** "⑥ sprite-compositing contract (layer order, per-slot body render - a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) - the icon half of blocker 5 stays OPEN but is now fully specified: consumables/quest items (1, 2000-2999, 20000-29999) need item#### symbols, accessories (3000-3999) need acc####, and neck items (10000-10999) have NO icon branch at all and render nothing. Eleven dummy-icon classes are the miss cases, not one.

### `[[items-equipment/item-panel-level-caption-unsourced]]` — UPHELD [A1] (1 critic)

The item detail panel renders a 'LEVEL 1' caption under the icon that no formula in the Android build reproduces — Item.getLevel() returns 0 for the Branch (id 13002) and its levelrestriction is -4.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (980,480)-(1200,540) upscaled x5 LANCZOS; code checked against reference/decompiled/shs3_android/scripts/Item.as:274-299, :1101-1104, :1299-1304 and reference/extracted/itemdata.xml:7906-7915`
- **Lane impact:** L5 (UI/HUD) — a small items-owned on-screen number the survey did not address. THE FRAME WINS: the caption is on screen regardless of what the Android v0.682 code computes, so either the display clamps to a minimum of 1 or the web v0.717 build diverges here. Flag it as open rather than porting getLevel() straight to the panel.

### `[[items-equipment/item-panel-level-row-unexplained]]` — UPHELD [A1] (1 critic)

The web v0.717 item panel renders a 'LEVEL n' row under the item icon that has no counterpart in the Android v0.682 source, and for the frame's Branch the Android formula would produce 0, not the 1 on screen.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (575,240)-(880,540) region of the middle panel (I read it at x2 from the (170,240)-(870,1040) and full-frame passes): 'BRANCH' / icon / 'LEVEL 1'; against reference/decompiled/shs3_android/scripts/XMLItem.as:128-134, Item.as:274-298, InventoryUI.as:228-236 and :1453-1462`
- **Lane impact:** L5 (UI/HUD) — THE FRAME WINS over the Android measurement path. The item panel needs a fourth field the Android decompile does not describe, and its formula is unheld. Held: the label exists and reads 'LEVEL 1' for an unmodified Branch. Unheld: what computes it. This also bounds the survey's 'cleanest frame-to-payload identity' claim to name/DMG/weight.

### `[[items-equipment/mcs-human-partlist-is-23-not-27]]` — UPHELD [A2] (1 critic)

MCSCharacter allocates 23 z-ordered part MovieClips (indices 0..22) for a human, not 27; PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) are declared but never instantiated and are used only by quadruped subclasses.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :141-146, :56-62; reference/decompiled/shs3_android/scripts/MCSWolf.as:188 and :197`
- **Lane impact:** L6 (art/animation) — the human paperdoll z-stack is 23 deep. Building 27 layers produces 4 permanently empty layers and, worse, invites treating the shoulder/knee indices as human parts when they belong to the wolf/quadruped rig. Note the type tell: 0-22 are `:int`, 23-26 are `:*`.

### `[[items-equipment/modifier-rows-are-mostly-set-ids]]` — UPHELD [A2] (1 critic)

Only 47 of the 412 <modifier> rows in itemdata.xml (11%) resolve to a named stat channel; 344 rows (83%) fall in the 101-1999 Set band and render as the literal string 'Set: <id>', and 19 rows across 11 distinct ids resolve to nothing and hit the trace("ErrorValue") branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 (the switch) evaluated against my parse of all 412 <modifier> rows in reference/extracted/itemdata.xml (34 distinct ids)`
- **Lane impact:** L4/L7 (economy + loot) — the modifier table is transcribed but the DATA is not thereby readable: the dominant channel is set membership (344 rows), which needs a separate set-bonus table that no one has looked for, and 11 ids shipped in the data have no handler at all.

### `[[items-equipment/nine-slot-ui-mapping-resolved]]` — UPHELD [A2] (1 critic)

The nine paperdoll boxes map one-for-one onto named EQ_ constants in a literal nine-iteration loop, resolving the two ring boxes as ACCESSORY1 and ACCESSORY2 and excluding EQ_NECK from the UI entirely.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:461-535; corroborated visually by reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **Lane impact:** L5 (UI/HUD) - closes the surveyor's only non-art STILL_UNHELD. Also yields the 'empty' sentinel IDs the UI paints as unfilled: armor 4000/4001, pants 11001, everything else 0.

### `[[items-equipment/nine-ui-boxes-are-the-nine-stat-bearing-slots]]` — UPHELD [A2] (1 critic)

The 9 paperdoll boxes are not an arbitrary UI subset of the 13-slot model — they are exactly the 9 slots that grant stats, with the two ring boxes resolved as EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right), and EQ_NECK carrying no box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :261-269, :460-535; StatsManager.as:1944 (findBonusStat) and :1983 (findWeight); frame reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **KILLS this line:** "Ready: 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) + L6 (art) — closes the surveyor's only STILL_UNHELD UI item and corrects their '9 UI boxes over a 13-slot model, loses hair/head/scabbard' to FOUR hidden slots (hair, head, neck, scabbard), all cosmetic-only. The SLOT_ index order 0..8 is literally the frame's reading order, box for box — an independent frame-to-code lock. Shipped asymmetry to carry: findWeight skips only HEAD/NECK/SCABBARD, so hair carries weight but grants no stats.

### `[[items-equipment/paperdoll-ui-slot-mapping-resolved]]` — UPHELD [A2] (1 critic)

The two visually identical ring boxes in the 9-box paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2 (named SLOT_RING1/SLOT_RING2 in source); EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD have no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:520-533, plus the dummy-icon roster in reference/decompiled/shs3_android/scripts/ (8 slot-dummy classes, no Neck/Hair/Head/Scabbard dummy)`
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item and fixes the 13-vs-9 delta: the four model-only slots are HAIR, HEAD, NECK, SCABBARD. The paperdoll switch has exactly 9 cases (0..8), matching the frame's 9 boxes, so the whole slot map is now codeable.

### `[[items-equipment/part-stack-is-23-not-27]]` — UPHELD [A2] (1 critic)

MCSCharacter declares 27 PART_ constants but only instantiates 23 layers and only ever indexes 22 — PART_l_shoulder(23), PART_r_shoulder(24), PART_l_knee(25) and PART_r_knee(26) are dead names that would index past the end of partList.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :120, :141-146; grep 'partList[PART_*]' over the same file -> 22 distinct indices used`
- **Lane impact:** L6 (art/animation) — corrects the survey's headline '27-entry z-ordered PART_* enum'. Build 23 z-layers (indices 0-22); 22 are ever populated (PART_prop3 is allocated but never referenced). Shipping 27 layers gives four dead ones and an out-of-range index if anything uses the shoulder/knee names.

### `[[items-equipment/pickaxe-frame-payload-identity]]` — UPHELD [A1] (1 critic)

The equipped weapon in the same frame also resolves to a payload row: itemdata id 13022 "Pickaxe", mindamage 1, maxdamage 3, weight 10 -- matching both the pickaxe visible in the weapon slot and the on-screen "(EQ: 1 - 3)".

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1040) upscaled x2 LANCZOS (weapon box) and crop (1320,240)-(1620,320) upscaled x4 (tooltip); matched to reference/extracted/itemdata.xml item id 13022 via docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L5 (UI/HUD) + L4 -- a SECOND frame-to-payload identity in the same screenshot, this time on the equipped side. Also confirms the weight-10 sell branch is reachable on a starter item, and that weapon13002.as (the Branch) is one of only 21 part classes actually exported.

### `[[items-equipment/placeholder-icon-art-set]]` — UPHELD [A2] (1 critic)

There IS a small item-icon art set to author: 8 *DummyIcon symbols for inventory misses plus 9 per-slot empty-box icons in the paperdoll, the latter directly visible as the ghosted mask/gauntlet/ring outlines in the frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:70,95,126,158,183,232,255,285,330,368 + InventoryUI.as:459-540; frame reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS`
- **Lane impact:** L6 (art) — a bounded 17-symbol authoring task that the 'no icon manifest' finding would have dropped.

### `[[items-equipment/prog-spike-and-dead-slashusage]]` — UPHELD [A2] (1 critic)

Two implementation traps in the survey's own numbers: the +10 end-spike applies to prog1/prog2/prog3 only (SPEED and PIERCINGDMG have none), and the single <slashusage>24</slashusage> row is dead because getSlashUsage floors anything below 48 to 48 in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183; reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1928; reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2352-2359`
- **Lane impact:** L4/L7 (loot magnitudes) and L1 (reach) — a builder applying the +10 spike to all five progression arrays overshoots SPEED and PIERCINGDMG at tier 79, and one implementing slashusage=24 as a fast weapon implements a value the shipped game clamps away.

### `[[items-equipment/prog-spike-and-minlvl-coverage]]` — UPHELD [A2] (1 critic)

Two precision corrections to the held stat-vs-level curve: the +10 end spike applies to prog1, prog2 and prog3 only (prog4 and prog5 have none), and <minlvl> is present on only 122 of the 177 type-9 rows (155 of all 982), so the -4..79 ladder has gaps rather than being complete.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183 (spikes at :157,:164,:171 only); reference/extracted/itemdata.xml field coverage counted this run`
- **Lane impact:** L4/L7 - a builder applying the +10 spike to prog4 (speed) and prog5 over-rolls the top tier on two channels; and the static weapon ladder needs a fallback rule for the 55 type-9 rows with no <minlvl>.

### `[[items-equipment/removeparts-leaks-prop3]]` — UPHELD [A2] (1 critic)

MCSCharacter.removeParts() never clears partList[22] (PART_prop3) — its loop starts at partListLength - 1 = 21, one short of the highest allocated index.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:245-258 against :120 and :141`
- **Lane impact:** L6 (art) — an OG behaviour, not a recreation choice: a second prop attached at PART_prop3 persists across a character rebuild. A from-scratch renderer that correctly clears all 23 slots will visibly diverge from the videos in any scene where prop3 is used.

### `[[items-equipment/ring-slots-are-accessory1-and-2]]` — UPHELD [A2] (1 critic)

The two identical ring boxes are EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right), not EQ_NECK; and the 9 UI boxes are exactly the 9 stat-bearing slots, because findBonusStat skips EQ_HEAD, EQ_NECK, EQ_SCABBARD and EQ_HAIR.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-181, :268-269, :522-535; reference/decompiled/shs3_android/scripts/StatsManager.as:1944-1946`
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD on this system and upgrades the ledger's '9-slot paperdoll' from a frame reading to a code constant (totalEquippedSlots = 9). The 4 model-only slots (hair, head, neck, scabbard) are cosmetic and grant NO stat bonuses.

### `[[items-equipment/roster-art-absent-from-both-exports]]` — UPHELD [A2] (1 critic)

The per-item vector art for the 982-row roster is confirmed absent from BOTH decompiled script exports: each contains exactly the same 21 MCS part classes, i.e. the naked defaults plus three extras.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ and reference/decompiled/shs3_android/scripts/, filtered to ^(torso|stomach|uparm|lowarm|pelvic|crotch|thigh|calf|foot|foottop|hand|hair|hat|head|mask|neck|weapon|prop)[0-9]+\.as$`
- **Lane impact:** L6 (art) -- quantifies the survey's residual STILL_UNHELD. The naming CONTRACT is held and 21 symbols are held; ~961 are not. Next lead is S0-5's encrypted 115_Mobile_SHS3Resource / 124_Mobile_ImageResource, reached via getMCSComponent's StatsManager.useExternalResource branch. No recovery claim is made.

### `[[items-equipment/second-icon-art-family-item-and-acc]]` — UPHELD [A2] (1 critic)

A fifth of the item roster gets its inventory icon from two symbol families with NO paperdoll counterpart — `item####` (consumables and quest items) and `acc####` (accessories) — so the 'icon manifest' half of blocker 5 is a live art blocker, not a category error.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:134-200; MCSItem.as:203-247; my parse of reference/extracted/itemdata.xml (982 rows); ls reference/decompiled/shs3_payload/scripts/`
- **KILLS this line:** "⑤ sprite-compositing contract (layer order, per-slot body render — a from-scratch-art blocker) + item icon manifest."
- **Lane impact:** L6 (art) — reinstates the icon-manifest blocker the survey closed. Measured scope: id bands 2xxx=99 + 3xxx=9 + 20xxx=79 = 187 of 982 rows (19%) need item/acc art, and the 14 rows in the 10xxx neck band are explicitly excluded by ShopItem.as:178 and get no icon call at all. The web payload holds one such class (item0.as) and zero acc*.as — the default, not the set. Corroborated visually: the frame's inventory row shows a scroll, a rice ball, a stone and a feather, none of which is a body part.

### `[[items-equipment/sell-price-input-diverges-across-builds]]` — UPHELD [A2] (1 critic)

The sell formula body is byte-identical in both builds but its input is not: Android Item.getWeight() returns the raw weight while web v0.717 returns (weight + bonus) * multiplier, so the same item can fall on opposite sides of the getWeight()>=10 step that picks the 5x vs 10x multiplier.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1560-1580 vs reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1974`
- **Lane impact:** L4 (economy) - label getSellAmt CONTRACT and the weight input INFERRED until the web getWeight bonus/multiplier terms are decoded. Also note Android's own inconsistency: the cached path multiplies by quantity, the first-call path does not.

### `[[items-equipment/sell-price-reads-stack-weight]]` — UPHELD [A2] (1 critic)

getSellAmt's weight>=10 test reads stack weight, not row weight, because getWeight() multiplies by quantity — so ten weight-1 items in one stack each sell at x10 instead of x5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1568 (getWeight) feeding Item.as:1582-1593 (getSellAmt); web divergence at reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1974`
- **Lane impact:** L4 (economy) — a port that evaluates the >=10 threshold on the XML row's <weight> mis-prices every stack. Also note the web build adds a weight-modifier term the Android build lacks, so the sell formula's INPUT is not cross-build identical even though its body is.

### `[[items-equipment/sell-weight-branch-is-stack-weight]]` — UPHELD [A2] (1 critic)

The sell-price weight branch tests STACK weight, not unit weight, and the getWeight() it tests differs between the two builds - the web adds an extra per-item weight term the Android build lacks.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1579; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1975`
- **Lane impact:** L4 (economy) - the sell formula is safe to copy but its input is not: ten weight-1 branches trip the >=10 *10 branch, and the web build's extra weight term means an Android-derived weight table may not reproduce web sell prices. Marked PARTIAL because §1t478s0§ is unresolved - I did not establish what it is.

### `[[items-equipment/sell-weight-is-stack-weight-and-builds-diverge]]` — UPHELD [A2] (1 critic)

The weight>=10 branch of the sell formula reads STACK weight (base x quantity), and the web v0.717 build adds a per-item weight-modifier term that the Android v0.682 build does not have.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1568; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1974; sole call site ShopUI.as:401`
- **Lane impact:** L4 (economy) — the sell formula itself is identical across builds, but its input is not: implementing 'weight >= 10' as per-item weight puts a stack of ten weight-1 items on the wrong branch (5c/unit instead of 10c/unit). This is the first concrete instance of the S0-3 Android/web parity caveat biting on a combat-adjacent number, and it should be labelled per-build. ShopUI.as:401 being the only call site is also what proves there is no shop-side level multiplier.

### `[[items-equipment/sell-weight-test-is-stack-weight]]` — UPHELD [A2] (1 critic)

getSellAmt's `getWeight() >= 10` step tests STACK weight, not unit weight, because getWeight() multiplies by quantity.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1571 and :1582-1593`
- **Lane impact:** L4 (economy) — a stack of ten weight-1 items crosses the >=10 threshold and sells at the x10 tier. Implementing the formula on unit weight produces a different consumable economy. Moot for id<3000 (short-circuits to 1) but live for the 79-row 20xxx quest/trade band.

### `[[items-equipment/setarmor-drives-8-parts]]` — UPHELD [A2] (1 critic)

One armor equip drives EIGHT part slots, not seven: torso, stomach, l_uparm, r_uparm, l_lowarm, r_lowarm, pelvic AND neck — and PART_neck is shared with setNeck, so it can hold two children.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:915-1088 (declaration block at :917-924, neck attach at the tail of setArmor) and :795-813 (setNeck)`
- **Lane impact:** L6 (art) — the armor art set needs a neck/collar symbol per item, an 8th piece the survey's part budget omits. The removeChildAt(0) prologue in setArmor covers only 7 parts (neck excluded), which is the trap that produces a 7-count; setNeck's two-deep clear proves the slot is deliberately shared.

### `[[items-equipment/slashusage-24-is-dead]]` — UPHELD [A2] (1 critic)

The single itemdata row carrying <slashusage>24</slashusage> can never take effect: getSlashUsage() returns the 48 default whenever itemdata.slashusage < 48, so the live domain is {48, 72, 96}, not {24, 72, 96}.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1930; reference/extracted/itemdata.xml counted this run: 106 slashusage rows, {72:70, 96:35, 24:1}`
- **Lane impact:** L1 (combat core / reach) - do not implement a 24-cost weapon tier; it is unreachable in the shipped code. Only 48 / 72 / 96 are live slash-meter budgets.

### `[[items-equipment/slashusage-stancerestriction-omitted]]` — UPHELD [A2] (12 critics)

itemdata.xml carries two items-owned combat inputs the ledger block never mentions: 106 <slashusage> rows with exactly three values 24/72/96 (default 48) and 53 <stancerestriction> rows with values 4 and 6.

- **Cite:** `docs/gauntlet/L0/index/itemdata.json paths itemdata/item/slashusage and itemdata/item/stancerestriction; reference/decompiled/shs3_android/scripts/XMLItem.as:152-167; StatsManager.as:1921-1930 and :1915-1919`
- **Lane impact:** L1 (combat core / reach) — the weapon slash-meter budget and the stance gate are items-owned numbers absent from the items block entirely; the reach formula 120 + floor((90 + DAN*5) * speed/(20+speed)) is an A2 hand-off to the combat lane.

### `[[items-equipment/stancerestriction-is-dead-data]]` — UPHELD [A2] (1 critic)

<stancerestriction> is parsed and printed in a description string in the Android build and never read at all in the web build — there is no stance gate to implement.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:30,172-178 (only occurrences); reference/decompiled/shs3_android/scripts/XMLItem.as:38,160-166,321-327 (only occurrences)`
- **Lane impact:** L1 (combat core) — removes a phantom weapon/stance restriction from the combat plan; the 53 rows are display text only.

### `[[items-equipment/two-ring-slots-are-accessory1-and-2]]` — UPHELD [A2] (1 critic)

The two visually identical empty ring boxes in the paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2, not EQ_NECK: MCSItem — the slot-icon renderer — declares 11 setters and none of them is setNeck, so EQ_NECK has no UI-box renderer at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:64, :89, :120, :152, :177, :203, :226, :249, :279, :324, :362 (the complete setter list); setNeck exists only at reference/decompiled/shs3_android/scripts/MCSCharacter.as:795 and MCSBust.as:47`
- **Lane impact:** L5 (UI/HUD) — closes the survey's only open UI question. The 9 boxes map to hat, mask, armor, gloves, pants, weapon, accessory1, shoes, accessory2; EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD render on the body but have no paperdoll box.

### `[[items-equipment/ui-slot-map-resolved]]` — UPHELD [A2] (1 critic)

The nine paperdoll boxes map exactly to HAT, MASK, ARMOR, GLOVES, PANTS, WEAPON, ACCESSORY1(left ring), SHOES, ACCESSORY2(right ring) — declaration order equals screen reading order — and EQ_NECK is not a UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :519-540 (cross-checked against reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS)`
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item; the paperdoll can be laid out and wired without guessing.

### `[[items-equipment/ui-slot-mapping-resolved]]` — UPHELD [A2] (1 critic)

The nine paperdoll boxes are an explicit ordered constant table in InventoryUI, and the two ring boxes are EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right); EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD have no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-181, :261-269, :522-535; frame corroboration reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **KILLS this line:** "Ready: 9-slot paperdoll;"
- **Lane impact:** L5 (UI/HUD) — refutes the survey's only UI STILL_UNHELD and additionally confirms the ledger's '9-slot paperdoll' from code, not just from a frame. The SLOT_ index order reproduces the frame's reading order exactly (hat,mask / armor,gloves / pants,weapon / ring,shoes,ring), so the box layout is fully specified. Bonus from the same block (:475,:493): item IDs 4000 and 4001 (armor) and 11001 (pants) are treated as empty and draw the placeholder icon — the naked-default ITEM ids, which are not the same list as the naked-default ART ids.

### `[[items-equipment/ui-slot-table-held]]` — UPHELD [A2] (1 critic)

The nine paperdoll UI boxes are a named, ordered table in code in BOTH builds - SLOT_HAT 0, SLOT_MASK 1, SLOT_ARMOR 2, SLOT_GLOVES 3, SLOT_PANTS 4, SLOT_WEAPON 5, SLOT_RING1 6, SLOT_SHOES 7, SLOT_RING2 8 - with RING1/RING2 bound to EQ_ACCESSORY1/EQ_ACCESSORY2 and EQ_NECK given no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :261-269, :519-536, :790-830; web v0.717 reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:37,39,:175-193,:281-289; frame corroboration reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **KILLS this line:** "Ready: 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) - kills the surveyor's only UI STILL_UNHELD. The paperdoll is directly codeable as a 9-cell table in a fixed order, and the frame reads left-to-right / top-to-bottom in exactly SLOT index order, so the left ring box is ACCESSORY1 and the right is ACCESSORY2. No Android-parity caveat: v0.717 has the identical table.

### `[[items-equipment/uses-zero-is-a-never-wears-sentinel]]` — UPHELD [A2] (1 critic)

uses == 0 is a sentinel meaning the item never degrades, not 'brand new': gotUsed() returns immediately when uses==0 and repair() clamps to a floor of 1, so 0 is unreachable once an item has ever worn — which is why the ladder's first branch is 'Unbreakable'.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1419-1424 (gotUsed), :1439-1449 (repair), :712-724 (ladder head)`
- **Lane impact:** L5 (UI/HUD) + items — a builder who initialises fresh items to uses=0 makes every item permanently Unbreakable. Fresh wearable items must start at uses=1 ('Well-Maintained'); uses=0 is reserved for the unbreakable class.

### `[[items-equipment/weapon-ladder-minlvl-coverage-and-prog-spike]]` — UPHELD [A2] (1 critic)

Two arithmetic corrections to the stat-vs-level claim: <minlvl> is present on only 122 of the 158 weapon rows, and the +10 top-tier spike applies to prog1/prog2/prog3 only — prog4 (speed) and prog5 get none.

- **Cite:** `my parse of reference/extracted/itemdata.xml (982 <item>, 158 with <mindamage> all type 9, 122 of those with <minlvl>); reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183`
- **Lane impact:** L4/L7 — a builder copying 'the complete 158-row ladder, minlvl -4..79' finds 36 rows with no level anchor and must pick a default; copying 'the +10 spike at index 79' to all five progressions inflates top-tier speed rolls.

### `[[items-equipment/web-build-has-a-fifth-name-colour-band]]` — UPHELD [A2] (1 critic)

The web v0.717 build colours xp-bearing items #ff9900 (loot toast) / #ff6600 (inventory) in a branch placed ABOVE the unique tier — a fifth band the Android v0.682 build does not have at all, because the Android Item class has no xp field.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:42, :677-681, :698-701; reference/decompiled/shs3_android/scripts/Item.as:415-451 (no xp branch; `grep -c xp Item.as` -> 0)`
- **Lane impact:** L5 (UI/HUD) — the survey says the web cross-check 'removes the S0-3 Android-parity caveat' for the tier colours; it is the reverse. The 1:1 target build has FIVE name-colour bands, not four, and xp-bearing items (an entire item concept absent from the Android class) sit at the top.

### `[[items-equipment/web-build-has-fifth-item-colour]]` — UPHELD [A2] (1 critic)

The web v0.717 build carries a FIFTH item-name colour state that the Android v0.682 build does not have: #ff9900 in the loot toast and #ff6600 in the inventory, both gated on the item carrying xp.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677-679, :698-700 (also :767, :834); Android absence: grep -c "ff9900\|ff6600" reference/decompiled/shs3_android/scripts/Item.as -> 0`
- **Lane impact:** L5 (UI/HUD) -- the item colour ladder is FIVE states in the web build, not four. Directly contradicts the survey's claim that the tier colours 'remove the S0-3 Android-parity caveat'; per S0-3 the ported palette must stay labelled as Android-sourced plus this web-only delta.

### `[[items-equipment/web-build-has-fifth-item-colour-tier]]` — UPHELD [A2] (1 critic)

The shipping web build v0.717 has a fifth, highest-precedence item colour state gated on an `xp` member - #ff9900 in the loot palette and #ff6600 in the inventory palette - that does not exist anywhere in the Android v0.682 Item class.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:42, :679, :700 vs reference/decompiled/shs3_android/scripts/Item.as:417-451 (grep for `this.xp` and `ff9900|ff6600` returns zero hits)`
- **Lane impact:** L5 (UI/HUD) - the item colour ladder is FIVE states in the target build, not four. Any port that takes its colour table from the Android decompile ships a missing tier. This is also the concrete proof that S0-3's Android-parity caveat must stay attached to every items claim sourced from shs3_android.

### `[[items-equipment/web-build-has-fifth-name-colour]]` — UPHELD [A2] (1 critic)

The web v0.717 build - the actual 1:1 target - has a fifth item-name colour state that the Android v0.682 build does not: XP-bearing items render #ff9900 in the loot toast and #ff6600 in the inventory, tested before the unique branch.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677-680 and :699-702, against reference/decompiled/shs3_android/scripts/Item.as:417-451`
- **Lane impact:** L5 (UI/HUD) - a concrete, measured counterexample to 'Android parity established for the rarity colours'. It is also the first hard demonstration that S0-3's build caveat has teeth: v0.717 is a superset here, so ported UI copy and colour logic must be re-checked against the web bundle, not assumed.

### `[[items-equipment/web-condition-string-11496-unresolved]]` — UPHELD [A2] (1 critic)

The web v0.717 condition block has an eighth branch the Android build lacks, appending getString(11496), and id 11496 is absent from the 2,533-entry S0-3 string table — so the string table does not close UI copy for the web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1028-1037; docs/gauntlet/L0/index/strings.json (id 11496 absent, checked this run)`
- **Lane impact:** L5 (UI/HUD) - carry the S0-3 caveat harder: the Android XLIFF resolves Android v0.682 strings, and v0.717 has strings outside its id range. Any ported UI copy must name which build it came from.

### `[[items-equipment/web-only-xp-item-colour]]` — UPHELD [A2] (1 critic)

The web v0.717 build has a FIFTH item-name colour state the Android v0.682 build lacks entirely — #ff9900 in the loot palette and #ff6600 in the inventory palette, keyed on the item carrying xp.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677 and :700; absent from reference/decompiled/shs3_android/scripts/Item.as:407-450 and from a tree-wide grep of all 559 Android scripts`
- **Lane impact:** L5 (UI/HUD) — disproves the survey's claim that the Android-parity caveat is discharged for item colours. Five states per palette in the shipped web build, four in Android. Since the reference videos are the WEB build, a recreation copying Android silently drops the colour an xp-bearing (soul) item displays in.

### `[[items-equipment/web-save-format-has-modifier-id-206]]` — UPHELD [A2] (1 critic)

The web v0.717 item wire format reserves a sixth non-stat modifier ID, 206, carrying the item's XP/soul payload; the Android v0.682 Item class defines no such ID, so an Android-shaped save string is not byte-compatible with the shipping build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:18, :119, :187, :304, :350, :429 vs reference/decompiled/shs3_android/scripts/Item.as:6-16`
- **Lane impact:** L10 (persistence/save) - the item schema is still worth copying, but it must be taken from the web build: id 206 (xp) is a required field there. A second omission in the same area: Item.copyModifiers (Item.as:317-330) blacklists modifier IDs 85, 86, 87 and 88 from ever transferring, which no claim in the survey mentions.

### `[[npcdata/shipped-bugs]]` — UPHELD [A2] (2 critics)

npcdata ships three original defects, verified as authored (not extraction artifacts): a period-for-comma token `6015.6017` that also appears verbatim in the shipped ActionScript, a whole hair pool collapsed to `6.5006501650265E+47`, and four mannequin NPCs with hat ids typed into <attack>.

- **Cite:** `reference/extracted/npcdata.xml:31 and :1644 and :4368-4430; the same malformed token in reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:460 (also :486, :497, :531)`
- **Lane impact:** art-anim-audio-feel + items-equipment — hair ids 6016/6017 never spawn on those archetypes and NPC id 55 renders with a broken hair id; a 1:1 recreation must consciously decide to reproduce or silently fix each, and label the choice.

### `[[npcdata/shipped-data-defects]]` — UPHELD [A2] (2 critics)

The payload ships three real authoring defects a rebuilder's importer must handle: one hair pool coerced to a float, 355 occurrences of a period typed for a comma inside hair pools, and four NPCs whose <attack> field holds a mis-keyed hat-band item id — which is the sole source of the index's misleading attack range of 7092.

- **Cite:** `reference/extracted/npcdata.xml:1644, :4371, :4389, :4408, :4425, plus 355 rows containing the token 6015.6017`
- **Lane impact:** L-enemies-ai + L-items-equipment + L-art-anim. Concrete consequence: docs/gauntlet/L0/index/npcdata.json reports npcdata/npc/attack numeric_range [1.0, 7092.0] and mcs/hair numeric_range up to 6.5e47 — BOTH are artefacts of these defects, not real game values. A naive importer would ship a 7,092-attack enemy. Defect 2 sits in the most-instantiated NPC rows in the game (the five clan armies).

### `[[npcdata/wardrobe-randomiser]]` — UPHELD [A2] (2 critics)

NPC appearance is a randomised per-slot wardrobe roll that no ledger system models: 741 of 3,210 <mcs> slot rows (23.1%) are comma-separated POOLS rather than single ids, and repeated 0 entries act as a spawn-weighting device (9 zeros to 11 hats ≈ 45% bare-headed).

- **Cite:** `reference/extracted/npcdata.xml:31 (npc 1 hair pool), :505 (npc 17 hair pool), :506 (npc 17 hat pool with weighting zeros)`
- **Lane impact:** L-art-anim-audio-feel + L-items-equipment + L-enemies-ai simultaneously — which is exactly why a system-siloed reader could not see it. A single <npc> row is a GENERATOR, not an instance: one archetype spawns visually varied instances by rolling each slot independently against its pool. This is an unmodelled RNG contract (which stream? rolled at spawn or at authoring?) and a from-scratch-art requirement. Absent from all 12 ledger systems.

### `[[skilldata/orphan-steal-and-smithing]]` — UPHELD [A2] (2 critics)

Two complete skills were specified, costed and localised but never shipped in the data: a five-level player-vs-player coin theft (5/10/15/20/25 coins, get-caught chance falling 50%→30% and conditional on the target being ONLINE) and a Smithing profession with weapon repair — neither has a <skill> row anywhere, and skill id 1023 is the single hole in the 1000-1073 run.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 6022, 6023, 7024-7028, 6051, 6055, 7042; absent from reference/extracted/skilldata.xml and from reference/decompiled/shs3_android/scripts/SkillManager.as`
- **Lane impact:** meta-social (scored 31/100 and does not mention theft at all) — an asynchronous PvP steal mechanic with exact numbers; economy; items-equipment (weapon repair). PARTIAL because attributing the Steal set to id 1023 is inference from the id hole, not an artifact.

### `[[string-table/no-condition-damage-multiplier-in-prose]]` — UPHELD [STILL_UNHELD] (2 critics)

The string table names all six condition tiers (Broken/Poor/Used/Usable/Good/Well-Maintained) and both repair consumables with a qualitative 'significantly' difference, but states NO coefficient anywhere — it cannot close items-equipment blocker ② and I will not stretch it.

- **Build:** android v0.682
- **Lane impact:** items-equipment — blocker ② is untouched by this source; the already-banked items-equipment/condition-blocker-dead-in-both-builds closes it from the AS3 side, and nothing here strengthens or contradicts that.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
