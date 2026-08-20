# BLIND CRITIC — HUNTER LENS — `src-questdata`

Packet: `docs/gauntlet/L0/worklist/src-questdata.claims.json` (11 claims)
Source under review: `reference/extracted/questdata.xml` (27,734 lines)
Judged: 11 / 11. Skipped: 0.
Surveyor prose (`docs/gauntlet/L0/sources/questdata.md`) NOT read, per §3.2.

Every verdict below rests on an artifact **I** opened. Tooling used: `ffmpeg` crops
(no ImageMagick/PIL on this box), `xml.etree` parses, byte decodes, and a
re-implementation of the shipped LCG.

---

## HEADLINE — the single biggest result of this review

**`NameGenerator.getTownName2()` generates "Kakuchi" and "Chikada".**
Two claims in this packet (one `STILL_UNHELD`, one `HELD`) rest on the finding that
the v0.717 longplay's wilderness place names appear **zero** times in any held
artifact. I reproduced every one of those greps — they are all correct — and then
found the names anyway, in shipped client code, because they are **composed at
runtime from two syllable arrays**, so a literal grep can never hit them.

```
reference/decompiled/shs3_android/scripts/NameGenerator.as:40
  internal var namestarting:Array = ["Cho","Dai",...,"Chika",...,"Ka","Kasu","Kiyo","Ko"];   // 78 entries
reference/decompiled/shs3_android/scripts/NameGenerator.as:42
  internal var nameending:Array   = ["ta","yama",...,"kuchi","da",...,"maki","bara"];        // 37 entries
reference/decompiled/shs3_android/scripts/NameGenerator.as:169
  return this.namestarting[rng.rand(...)] + this.nameending[rng.rand(...)];
```

`Chika`+`da` = **Chikada**. `Ka`+`kuchi` = **Kakuchi**. `Kasu`+`ta` = **Kasuta**.
`Moto`+`harah` = **Motoharah**. `Yasu`+`oka` = **Yasuoka**. `Atsu`+`zawa` = **Atsuzawa**.
78 × 37 = **2,886** possible wilderness town names.

I re-implemented the shipped LCG (`RNG.as:68`, `seed = (seed*9301+49297) % 233280`)
and brute-forced territory ids 0..2^24. Both target names are produced:

```
Chikada  <- territoryID 736, 1318, 5590, 6172, ...
Kakuchi  <- territoryID 9104, 9686, 10268, 15122, ...
Kasuta   <- territoryID 2833, 3415, 3997, 4579, ...
```

**End-to-end verification against shipped data.** `questdata.xml:15` is
`<node>8382465</node>` (the Prologue node). Decode it with the shipped packing
(`NodeGenerator.as:296-321`): sector (2046, 2049) -> territory (341, 341) ->
territoryId `341<<12|341` = 1397077 -> `getTownName2(1397077)` = **"Kasuta"**.
terrSector.x = 0 (<=1) -> dir = `LangManager.getString(401)` = **"W"**.
`NodeGenerator.getNodeName()` returns `dir + territoryName + " " + bgString`.
And `112_Mobile_NodeData.bin:6` is `<name>1037</name>`, and
`strings.json["1037"]` = **"W Kasuta Forest"**. Exact match, reproduced from
first principles. Same for node 8726547 -> "Yasuoka", and `strings.json["1039"]`
= "Yasuoka Forest".

**Build parity is CLOSED for this mechanism.** The web build v0.717 carries the
identical generator, obfuscated:
`reference/decompiled/shs3_payload/scripts/§1t136s0§.as:40` and `:42` hold the
byte-identical arrays; `:152-153` the same `param1 >> 12 & 0x0FFF` packing;
`:169` the same concatenation. One measured delta: web has a third hard-coded
territory name (`:148  if(param1 == 1519945) return "Iwakuni";`) that Android
v0.682 lacks.

---

## VERDICTS

### 1. `questdata/epilogue-verbatim-script` — SURVIVES (refuted=false, minor)
Opened `reference/extracted/questdata.xml:27347` (`<title>Epilogue</title>`),
`:27552`, `:27557`, `:27617`. All three quoted lines are verbatim, including the
shipped authoring duplication **"Good. Then the time for action has finally
arrived. has arrived."** My own counts: 3,307 `<text>`, 2,771 `<dialogue>` — match.
Word count is **40,135**, not the claimed 40,119 (16-word method delta, immaterial).

*Qualifier the claim does not carry (see NEW-3):* 16 cutscene spoken lines are
NOT inline text — they are `<action>say</action><param>9001</param>` string-table
references. The A-06 caveat covers this in spirit, but the ledger should record it.

### 2. `questdata/five-stances` — SURVIVES (refuted=false)
`:11787 <param>reversed_stance</param>` (id `magoichi`, :11785),
`:26029 <param>191,dual_stance,0</param>` (id `takamori`, :26026),
`:26078 <property>185,dual_stance,0</property>` (name `takamori`),
`:12101/:12107/:12113` = `yuudai` spear_idle / `satoshi` balanced / `fumio` heavy.
My own token histogram over the whole file: heavy 6, balanced 4, dual 2, reversed 1,
light 1 — **five stance tokens**.
**Independent corroboration the claim did not use:** the Android blob directory
carries exactly five stance animation bundles —
`97_MCSCharacter_BalancedStanceAnimationData.bin`, `106_..HeavyStance..`,
`108_..LightStance..`, `95_..ReversedStance..`, `101_..DualStance..` — plus
`104_MCSCharacter_HumanSpearAnimationData.bin` for the spear class that sits
outside the stance system. The claim is understated, not overstated.

### 3. `questdata/frame-corroborates-objective` — SURVIVES (refuted=false)
I cropped `reference/frames/zFtCaTO0_1M/seg-24/frames/frame_0003.jpg`
(`crop=1024:120:0:110`, lanczos 4x -> 4096x480) and read, plainly:
**"STORY QUEST: TURN IN INOKICHI'S CLUB AT THE BOUNTY BOARD"**.
`questdata.xml:4160` is `<title>Turn in Inokichi's Club at the Bounty Board</title>`.
Character-for-character. I also confirmed the HUD prefix is composed, not authored:
`strings.json["711"]` = `"Story Quest: "`.

### 4. `questdata/frame-vs-payload-placenames` — **REFUTED (material)**
The greps are all correct — I reran every one (`Kakuchi`/`Chikada` = 0 in
questdata.xml, 0 in the 329 MB payload.xml, 0 in strings.json, 0 in all five
generator tables). I also independently re-extracted the three frames from
`reference/videos/Nr4fQstqHDM.mp4` (`-ss 60/300/900`, `crop=900:130:80:140`,
lanczos 3x) and confirmed **"S CHIKADA MINE"**, **"N KAKUCHI MOUNTAIN PATH"**
and **"STORY QUEST: FIND WORK AT KAKUCHI TOWN"** are on screen.

What fails is the load-bearing inference. The claim's lane_impact states:
> "the most economical explanation is that wilderness node names, and the
> objective lines embedding them, are **composed at runtime from a source not
> shipped in the client**."

That is **false**. They are composed at runtime from a source that **is** shipped
in the client, in both builds — see HEADLINE. Left standing, this claim would have
told L8 world-exploration that wilderness naming is unrecoverable when it is in
fact fully reconstructible, deterministically, from the node id.

**What survives:** the objective *string* `"Find work at ... Town"` is genuinely
absent — I checked `<title>`/`<stitle>` in both `questdata.xml` and the Android
`116_Mobile_QuestData.bin`, `strings.json`, all of `reference/decompiled/`, and
`grep -c "Find work" payload.xml` -> 0. So "the held script is not proven
exhaustive" stands **for quest step titles**; it does not stand for place names.

### 5. `questdata/generated-npc-names` — SURVIVES (refuted=false, minor)
Cropped the same frame (`crop=520:70:230:305`, 5x) and read **"GOJO OTONDO"**
with a `!` marker and a second caption **"GUEST"**; cropped the HUD strip
(`crop=1024:120:0:456`, 4x) and read **HP 20/20**, **Chi 20/20**, **"HEAVY STANCE"**.
The tables are ASCII/CRLF (**not** UTF-16LE — the S0 warning does not apply to
these five blobs). All six line cites are exact:
`86:5 Gojo` · `85:267 Otondo` · `87:7 Hachisuka` · `85:80 Kano` ·
`87:11 Honda` · `88:226 Shizuka`. And `Hachisuka`/`Shizuka` appear nowhere in
`npcdata.xml`; the only two `Shizuka` hits in `questdata.xml` (:12634, :12669) are
the faction name "Shizukana Uta", not an NPC.

**Mechanism now proven, not inferred** — `NameGenerator.as:87` `getNobleName()`
returns `NobleFamilyName + " " + MaleName` (= "Gojo Otondo"), `:96`
`getSamuraiName()` returns `SamuraiFamilyName + " " + MaleName` (= "Hachisuka Kano").

**Two numeric corrections (see NEW-6):** the table sizes are 398/291/33/36/677,
each one higher than the claim's 397/290/32/35/676. And "16 of **535** nodes in
`112_Mobile_NodeData.bin`" is wrong: the file holds **44** `<node>` elements
(535 is the count of `<id>` elements across nodes+rooms+objs). 16/44 is 36% named,
not 3% — the corroboration points weaker than stated, though the claim stands on
the AS3 anyway.

### 6. `questdata/knockdown-grapple-aerial` — SURVIVES (refuted=false)
All six line cites verified verbatim. I rebuilt the vocabulary myself from
`<data>` params + `<property>` fields: **exactly 88 distinct lowercase tokens**.
Confirmed present: `downed`, `flipupfromdowned`, `kneel`, `kneeltostand`;
`backthrow` + `backthrow_victim`; `airstab_start/mid/stab/end`;
`backstep_start/end`; `focus_start`, `warcry_start`, `buffarmor_start`;
`throwgrenade`. (Strictly, 4 of the 88 — `left`, `right`, `walk`, `darkblur` —
are direction/FX tokens, not animation states; the count is right, the label is
80% right.)

### 7. `questdata/node-packing-decoded` — **REFUTED (minor — under-claim)**
Every cite verified exactly against the UTF-8/CRLF decode of
`112_Mobile_NodeData.bin`: `:5 <id>8382465</id>`, `:6 <name>1037</name>`,
`:11 <bg>4</bg>`, `:12 <width>800</width>`, `:16` exit to 8386561 (= +4096),
`:46` back to 8382465, `:74` to 8386561. My own exit parse:
**-4096 x19 (x 50..721) · +4096 x18 (x 750..1550) · +1 x19 · -1 x19**
(the claim says `+1 x18`; it is 19). The gather table `<search><id>20000</id>
<chance>5</chance>` is there, exactly once.

The claim is refuted **for under-claiming**. It declares:
> "STILL OPEN and not guessed: which axis is N-S vs E-W and the mapping onto the
> on-screen TERRITORY/SECTOR readout"

Both are held, in shipped code:
```
NodeGenerator.as:314-321  getTerritorySector(nodeid):
    sectorx = nodeid >> 12 & 0x0FFF ;  sectory = nodeid & 0x0FFF
    return Point(sectorx % 6, sectory % 6)
NodeGenerator.as:296-303  getTerritory(): Point(floor(sectorx/6), floor(sectory/6))
NodeGenerator.as:1637-1694 getNodeName():
    terrSector.y <= 1 -> getString(398)="N" ; >= 4 -> 399="S"
    terrSector.x <= 1 -> getString(401)="W" ; >= 4 -> 400="E"
    return dir + territoryName + " " + bgString
NodeGenerator.as:1701 getNodeNameCode():
    getString(557)"Territory" + "(" + (territory.x-341+DTERRSHIFTX) + "," +
    (territory.y-341+DTERRSHIFTY) + ") " + getString(319)"Sector" +
    "(" + sector.x + "," + sector.y + ")"
Obj_DirectionSign.as:115  getPlaceName(destTerritory.x << 12 | destTerritory.y)
```
So: **high 12 bits = X = the E/W axis (+4096 = one sector East); low 12 bits =
Y = the N/S axis (+1 = one sector South)**. 6x6 sectors per territory. The
on-screen readout is `territory - 341 + DTERRSHIFT` for the Territory pair and
the raw `sector % 6` pair for the Sector pair — exactly the
`TERRITORY (23,52) / INSIDE SECTOR (1,3)` format in the frame. Nothing about the
packing is inferred any more; it is literal shipped arithmetic.

### 8. `questdata/placename-source` — **REFUTED (material)**
This is the STILL_UNHELD that LENS 2 exists to hunt, and it falls. See HEADLINE.
`NameGenerator.as:135-176` is the complete answer:
`getPlaceName(territoryID)` -> 2 hard-coded ids (web: 3) -> `namex = territoryx % 137`
-> if `namex < 26`, index `namex*26 + namey` into the 677-entry place table
(`getTownName1`, `:156`); **else** `getTownName2(:162)` = syllable concatenation
under `RNG(territoryID*2)`. The honest "unknown" was honest, and it is now known.

### 9. `questdata/portrait-count-correction` — SURVIVES (refuted=false)
I parsed the file structurally (a naive regex gives 68 for both sets because
`<dialogue>` nests inside `<intro>` — that is the exact trap this claim is
correcting). Direct children only: `<intro><img>` = **16 distinct, 16 total
occurrences**, all `_`-prefixed story cards; `<dialogue><img>` = **52 distinct**,
1,902 occurrences. `<img>` has **no other parent tag** in the file. 52 + 16 = 68.
The correction is right and the citelint `QUOTE_NOT_LOCATED` flag is a false alarm
(the quote is a derived set, not a file line).

### 10. `questdata/projectile-launch-params` — **REFUTED (minor — under-claim)**
Every value verified: `:18512/-15`, `:18535/-12`, `:18591/-9`, `:18614/-9`,
`:18659/-6`; mirrored `:18889/:18917/:18945` at x=550, vx=+40. Volley cadence
`<time>0.3</time>` -> `<time>0.7</time>` = **0.4 s**. Telegraph chain
`arrownormalpose`(:18489) -> `pullbackarrow`(:18501) -> `firearrow`(:18507) confirmed,
repeating at :18518/:18524/:18530.

The claim is refuted for its stated **HONEST LIMIT**:
> "it fixes projectile type ids, origin, velocity domain, telegraph clips and
> cadence, **NOT the AI firing rule or the gravity constant**."

Both are held:
```
XMLQuestCutscene.as:67-76
  strArray = actionXML.param.split(",");
  skilllvl = strArray.length > 5 ? int(strArray[5]) : 1;
  ProjectileManager.createProjectile(strArray[0],strArray[1],strArray[2],
                                     strArray[3],strArray[4],0,skilllvl,null);
ProjectileManager.as:131
  createProjectile(type:int, x:int, y:int, velX:Number, velY:Number,
                   damage:int, skilllevel:int, owner:NPC)
ProjectileManager.as:94   PROJ_ARROW:int = 40;      // id 40 confirmed by name
Projectile.as:8           internal static var GRAVITY:Number = 3;
ArrowProjectile.as:56     velY += GRAVITY;  (and :53 rotation = atan(velY/velX)*57.2727+180)
EnemyArcher.as:271-290    fireArrow(): full ballistic solve, see NEW-2
```
So the grammar is not a decode, it is the literal argument order; the 6th field is
`skilllevel`; and gravity is **3 px/frame^2**. The claim's PARTIAL is a HELD.

### 11. `questdata/severed-limb-deaths` — SURVIVES (refuted=false)
`:18459 deathinhalf`, `:18471 deathnohand`, `:18477 deathnohead`, `:24051` and
`:24091 deathnohead`. My own vocabulary parse confirms the full death family:
`death`(2), `deathenemy`(4), `deathbyarrow`(3), `deathnohand`(3), `deathnohead`(3),
`deathinhalf`(1), `downed`(5), `corpse1/2/3`(18/7/3),
`defeatedanimationv1/v2`(4/2), `seppuku_mid`(10), `liedown`(2).

---

## THE SILENCE — what is in this file that NO claim mentions

Full tag histogram of `questdata.xml` (my parse). The packet touches
`quest/step/dialogue/text/img/intro/node/roomobj/action/param/data`. It touches
**none** of the following, which together are most of the file's machinery:

| tag | n | what it is |
|---|---|---|
| `goto` | 715 | dialogue-graph jumps — 200+ symbolic (`label1..label6`), the rest numeric |
| `choice` | 471 | player dialogue choices (text + goto) |
| `option` | 196 | choice-block containers |
| `outcome` | 386 | branch terminators |
| `end` | 386 | terminator kind (0/1) |
| `set` | 194 | quest-variable writes (domain incl. 0,1,2,5,12,15,27,1000) |
| `label` | 163 | jump targets, label1(87)/label2(38)/label3(25)/label4(10)/label5(2)/label6(1) |
| `wave` | 118 | combat encounter definitions |
| `enemy` | 169 | wave rosters |
| `fatal` | 75 | all `0` — a per-friend/per-wave death flag |
| `modify` | 74 | reputation/state delta (69x`0`, 3x`1`, 1x`5`, 1x`-1`) |
| `friend` | 70 | allied NPC spawns inside waves |
| `condition` | 62 | step gating |
| `startin` | 54 | 53x`0`, 1x`-1` |
| `teleportnode` / `teleportposx` | 14 / 14 | forced world-graph jumps |
| `br` | 14 | inline line breaks inside dialogue text |
| `ending` | 5 | empty terminator elements |
| `endless` | 4 | endless-wave flag |
| `font` | 2 | inline colour markup inside dialogue text |

Each of these is written up as a NEW FINDING below.

---

## NEW FINDINGS (see structured return for the machine-readable list)

**NEW-1 — the place-name generator** (HEADLINE). A2. `NameGenerator.as:40,42,135,156,162,169`
+ `RNG.as:68` + web parity at `§1t136s0§.as:40,42,152,169`. Overturns the ledger's
world-geography blocker and this packet's own STILL_UNHELD.

**NEW-2 — the live archer AI firing rule + gravity.** A2.
`Projectile.as:8` `GRAVITY = 3`; `EnemyArcher.as:271-290`:
muzzle at `(mcs.x, mcs.y - 60)`, target at `(target.mcs.x, target.mcs.y - 60)`,
`velA = sqrt(GRAVITY * |dx| / 0.866)`, `velXa = velA * 0.866`,
`t = |dx| / velXa`, `velYa = (dy - 0.5*GRAVITY*t*t) / t`, then aim jitter
`velYa += Math.random()*8 - 4`, and above `level > 50` a 50% roll sets
`Damage.LAUNCH_KNOCKDOWN`. `EnemyGoblinThrower.as:555-559` uses the identical
solve; `EnemyKanjiGuardian.as:464-468` uses `0.866/3` for a flatter arc.
**This closes the ledger's "arrow arc physics" blocker outright.**

**NEW-3 — 16 cutscene lines live in the string table, not questdata.** A2.
`<action>say</action>` carries `<param>9000..9009</param>` (16 uses, 10 distinct ids),
e.g. `questdata.xml:11732` `<param>9001</param>` -> `strings.json["9001"]` =
"The castle town of Motoharah has fallen to our army, my lord."
`strings.json["9003"]` = "Useless, useless headlice - the lot of them!"
Note `strings.json["9000"]` does **not** resolve in the Android table.

**NEW-4 — the wave/encounter table (118 waves) with a pipe random-pick grammar.** A2.
`<enemy>` = `<id>/<qty>/<lvl>`; 169 entries, 36 distinct id specs. The id field is
pipe-delimited for a random pick: `19|20|21|22|23|24` (74 uses) = six Soldier
variants, `40|41|42|43|44|45` = Cultists, `11|12|13|14|15|16` = Bandits,
`86` (24 uses) = Undead, `151` = Jinbei. `lvl` domain 2..35, `qty` domain 1..10,
plus `<endless>1</endless>` (questdata.xml:11719, :18120, :25350, :26107) and
`<friend>` allied spawns carrying `<fatal>0</fatal>`.

**NEW-5 — the dialogue VM: a real branching interpreter.** A2.
`questdata.xml:146-185` is a complete worked example (`<option>` at :146, `<choice>` at :148 and :152, `<label>label2</label>` at :161, `<goto>label2</goto>` at :185): `<option>` holds `<choice>`
(`<text>` + `<goto>` to a dialogue id), `<label>label2</label>` marks a target,
`<goto>label2</goto>` jumps, `<outcome>` carries `<id>`/`<set>`/`<modify>`/`<end>`.
715 gotos over 163 labels. **Any recreation that treats questdata as a linear
script will be wrong.**

**NEW-6 — corrections to two counts inside packet claims.** A3-ish (measured).
Generator tables are 398 male / 291 female / 33 noble / 36 samurai / 677 place
(each 1 higher than claimed). `112_Mobile_NodeData.bin` holds **44** `<node>`,
not 535 (535 is the `<id>` element count); 16 of 44 nodes carry a `<name>`.
Exit histogram `+1` is 19, not 18.

**NEW-7 — dialogue text is HTML-formatted.** A2.
`questdata.xml:3908` `<font color="#b048f8">Inokichi's club</font>` and
`:3898/:3899/:3901` `<br/>`. Item names inside dialogue are highlighted in
**#b048f8** (purple). The permission ruling allows exact OG hues, so this is a
usable token for L10 ui-hud.

**NEW-8 — the complete projectile-type enum, and a hard v0.682 -> v0.717 delta.** A2.
`ProjectileManager.as:14-106` is a 47-entry enum, ids 0..46, fully named:
KUNAI 0, FIREBALL 1, SLASHWAVE 2, NINJASMOKE 3, LOGSMOKE 4, NINJASMOKE2 5,
FIREBREATH 6, TRAP 7, TRAPEXPLOSION 8, TRAPFIRE 9, TRAPWATER 10, TRAPWIND 11,
TRAPEARTH 12, KUNAIFIRE 13, KUNAIWATER 14, KUNAIWIND 15, KUNAIEARTH 16,
GROUNDPUNCH 17, WINDKICK 18, WATERSPLASH 19, BLADESLASHFX 20, CHIPUNCH 21,
CHIKICK 22, CHIBURST 23, HEAVENLYSWORD 24, YINYANG 25, CHARGEDSHOT 26,
CHARGINGSHOTFX 27, CHARGINGFX 28, SHUNPOHIT 29, CLEAVEHIT 30, DASHFX 31,
WINDMILL 32, FLASHBANG 33, WHITEOUTFX 34, NINJASMOKE3 35, BOULDER 36,
VOIDSKULL 37, VOIDFIRECOLUMN 38, BIGROCK 39, **ARROW 40**, **ARROWDUD 41**,
PURPLEEXPLOSION 42, INFERNO 43, TORNADO 44, TSUNAMI 45, EARTHQUAKE 46.
This names every `createprojectile` id in questdata the packet left undecoded
(17, 23, 24, 42 alongside 40/41).
**Build delta:** the web v0.717 equivalent
`reference/decompiled/shs3_payload/scripts/§1t112s0§.as:14-128` runs to id **55** —
the web build ships **9 more projectile types** than Android v0.682. This is a
measured, quantified data point against S0's open build-parity caveat.

**NEW-9 — the node-name composition pipeline** (folded into verdict 7):
`dir + generatedTownName + " " + bgTypeString`, with bg -> string mapping at
`NodeGenerator.as:1666-1692`: FOREST/FOREST2/3/4/BAMBOO -> 1003 "Forest",
BATTLEFIELD -> 1002 "Field", MOUNTAIN/MOUNTAINPATH -> 1015 "Mountain Path",
PADIFIELD -> 1006 "Road", WATERFALL -> 1022 "Waterfall", BEACH -> 1020 "Beach",
CAVE -> 1021 "Cave".

---

## STANDING-INVARIANT NOTE
No measurement-doc-vs-frame conflict arose in this packet. The frames I opened
(`frame_0003.jpg`, and t=60/300/900 of `Nr4fQstqHDM.mp4`) **agree** with the
payload once the runtime composition is accounted for — which is itself the
finding. Where a claim inferred a conflict (claim 4), the frame did not overturn
the payload; the claim had simply grepped for a string the engine never stores.
