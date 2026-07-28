/**
 * SESSION 15 A2 / SESSION 16 R2 — the pure emitter: `ShapeArt` → committed
 * TypeScript source text. BUILD-TIME ONLY; this file never ships.
 *
 * Split out of `generate.ts` by SESSION16 R2 (finding 5). `generate.ts` calls
 * `main()` at module scope, so importing it from a test would run the CLI and
 * throw on argv — which is why nothing had ever referenced `TOLERANCE` or the
 * emitted text from a test, and why a converter that drifted away from the
 * committed artifact had nothing to fail against. Keeping the emitter pure makes
 * the re-derivation check possible: `emit(convertShapeSvg(svg, id, TOLERANCE))`
 * must reproduce the committed file byte for byte.
 */
import type { ShapeArt } from './svgShape';

/**
 * Curve flattening tolerance, in shape-local pixels. The parts are 9–37 px
 * tall, so 0.02 px is ~0.1 % of a limb — far below anything §2 bar A's ≥90 %
 * silhouette IoU can see, and it survives zooming.
 */
export const TOLERANCE = 0.02;
/** Sub-milli-pixel. Keeps the emitted file small and byte-deterministic. */
export const DECIMALS = 3;

const round = (n: number): number => Number(n.toFixed(DECIMALS));
const hex = (c: number): string => `0x${c.toString(16).padStart(6, '0')}`;

/**
 * One paint operation as emitted source. SESSION16 R2 finding 1: paints are ONE
 * ordered array, because the SWF's own style-group order can put a stroke UNDER
 * a fill and `fills[] then strokes[]` cannot express that.
 */
function emitPaint(p: ShapeArt['paints'][number]): string {
  if (p.kind === 'fill') {
    const rings = p.rings
      .map((r) => `        { points: [${r.points.map(round).join(',')}], hole: ${String(r.hole)} },`)
      .join('\n');
    return `    {\n      kind: 'fill',\n      color: ${hex(p.color)},\n      rings: [\n${rings}\n      ],\n    },`;
  }
  const lines = p.polylines.map((q) => `        [${q.map(round).join(',')}],`).join('\n');
  return `    {\n      kind: 'stroke',\n      color: ${hex(p.color)},\n      width: ${String(p.width)},\n      polylines: [\n${lines}\n      ],\n    },`;
}

/**
 * SESSION 19 A5.2 — TRACED ART IS NOT EXTRACTED ART, AND ITS HEADER MUST NOT SAY
 * IT IS.
 *
 * Equipment art died with the CDN, so the outfit is traced from the videos
 * instead (docs/OWNER_PERMISSION_RULING.md permits it). The header this file
 * emits names an FFDec export command and a `DefineShape` characterId — both
 * false for a traced shape, in a repo whose whole discipline is provenance. So
 * traced shapes get their own header naming the FRAME they came from.
 *
 * ⚠️ IDS >= 9000 ARE TRACED, AND NOTHING ELSE IS. The range is the discriminator
 * on purpose: it is carried by `art.id`, so `emit(art)` alone still reproduces
 * the file byte for byte from the id — which is what the re-derivation test
 * needs, and what a second `provenance` parameter would have broken at every
 * existing call site.
 */
export const TRACED_ID_MIN = 9000;

/**
 * Where shape `id`'s source SVG lives, repo-relative. The ONE place that mapping
 * is decided, so `generate.ts` and the re-derivation test cannot disagree about
 * which file a committed shape is supposed to come from. Returned as a relative
 * POSIX path rather than joined here, to keep this module free of `node:path`.
 */
export function sourceSvgRelPath(id: number): string {
  return id >= TRACED_ID_MIN ? `reference/traced/${String(id)}.svg` : `reference/extracted/shapes/${String(id)}.svg`;
}

interface TracedSource {
  readonly slot: number;
  readonly garment: string;
  readonly frame: string;
  readonly video: string;
  readonly seconds: number;
  readonly crop: string;
  /** Everything the source could not resolve. Never allowed to be empty prose. */
  readonly approximated: string;
  readonly inferred: string;
  /**
   * SESSION22 A9: set when the shape was RE-AUTHORED in the OG's grammar (base
   * + hard shadow + stroked contour) over the trace outline. The string names
   * the step; the header then says "authored by" instead of claiming the paint
   * list is potrace's, and the colour claim points at the committed targets.
   */
  readonly authored?: string;
}

/** Keyed by traced id. The header is derived from this, so it cannot drift. */
export const TRACED_SOURCES: Readonly<Record<number, TracedSource>> = {
  9012: {
    slot: 12,
    garment: 'collar / juban (the gi under-collar)',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(806,688)-(858,742) video px; silhouette 48 x 52 video px',
    authored: 'SESSION22 A9.2 — OG grammar over the SESSION19 trace outline',
    approximated:
      'base fill = SWF #dcd9d4 (the measured p75 (212,210,210) is within 12 of ' +
      'it - D4); shadow fill = measured p25 (196,193,196), the shaded band, as ' +
      'the region darker than the p25/p75 luma midpoint (15.4 % of interior); ' +
      'ink contour = ONE stroke, width 1 (OG-quantised). Was a traced blob at ' +
      '75.9 % ink - the outline ate the garment (kickoff P2).',
    inferred:
      'PLACEMENT, and the EXTENT. The region enclosed by ink here holds the ' +
      'white collar AND the dark hair beside it, which share a boundary, so ' +
      'the traced silhouette is wider than the collar alone. It replaces slot ' +
      '12 (neck), which every other part draws in front of, so the surplus is ' +
      'covered. Veto = a frame where collar and hair are separately outlined.',
  },
  9014: {
    slot: 14,
    garment: 'obi (waist sash)',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(808,764)-(836,790) video px; silhouette 26 x 24 video px',
    authored: 'SESSION22 A9.5 — OG grammar over the SESSION19 trace outline',
    approximated:
      'base fill = measured p75 (208,205,206) — D4\'s #dcd9d4 mapping is ' +
      'BORDERLINE at deltas (12,12,6) and was declined: the source shows a ' +
      'clear obi-vs-hakama step (medians 204 vs 220) and SWF-white would erase ' +
      'it; shadow fill = measured p25 (202,199,198) over the measured dark ' +
      'region (44.8 % of interior); ink contour = ONE stroke, width 1, on-ring ' +
      '(the obi is fully occluded by the gi body in the idle pose).',
    inferred:
      'PLACEMENT. The smallest garment traced, at 26 x 24 video px it is well ' +
      'inside SESSION19 P9\'s trustworthy band (>= 20 px), but only just, and ' +
      'its REAR extent is behind the gi skirt in every standing frame found.',
  },
  9015: {
    slot: 15,
    garment: 'gi body (grey torso panel)',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(806,700)-(886,796) video px; silhouette 77 x 94 video px',
    authored: 'SESSION22 A9.4, landed by OWNER RULING 2026-07-28 — OG grammar + the balloon repair',
    approximated:
      'base fill = measured p75 (105,101,104); shadow fill = measured p25 ' +
      '(103,100,103) over the measured panel-line split (the gi is near-flat, ' +
      'iqr 2,1,1 — the split is honest and near-invisible); ink contour = ONE ' +
      'stroke w 1.5 + a measured chest-crease detail stroke w 1. THE BALLOON ' +
      'IS CUT: the traced flood fill leaked across the back into the ' +
      'far-sleeve region; the repair subtracts 9001\'s own isolate region and ' +
      'bridges the occluded band (back-edge overhang 4.8 -> 0.5 stage px, ' +
      'GATE A9-E). Accepted by the owner over a held-out floor re-base.',
    inferred:
      'EXTENT. The near sleeve hangs over the torso, so the gi BODY is never ' +
      'fully visible and the region enclosed by ink returns only the strip ' +
      'beside the sleeve. This is therefore the gi\'s OUTER silhouette - ' +
      '(garment-grey OR ink) flood-filled from a seed - which slot 15 wears and ' +
      'the sleeve on slot 19 draws over, the layering the frame shows. Where ' +
      'the two overlap the torso is hidden, so its hidden shape is unverifiable.',
  },
  9001: {
    slot: 1,
    garment: 'gi sleeve, far arm',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(856,724)-(886,770) video px; silhouette 27 x 44 video px',
    authored: 'SESSION22 A9.2 — OG grammar over the SESSION19 trace outline',
    approximated:
      'base fill = measured p75 (105,102,104); shadow fill = measured p25 ' +
      '(103,100,102) - 2 levels apart, which IS the video\'s own spread (iqr ' +
      '2,2,2; the gi is near-flat in the source); ink contour = ONE stroke, ' +
      'width 1. Was a traced blob at 70.6 % ink (kickoff P2).',
    inferred:
      'PLACEMENT, and EXTENT. Only the far sleeve\'s outer lobe clears the body ' +
      'in this frame, so the traced shape is the visible part, not the whole ' +
      'sleeve. It draws BEHIND everything on the far side, so the shortfall is ' +
      'covered by the torso.',
  },
  9019: {
    slot: 19,
    garment: 'gi sleeve, near arm',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(826,704)-(878,792) video px; silhouette 50 x 86 video px',
    authored: 'SESSION22 A9.4, landed by OWNER RULING 2026-07-28 — OG grammar over the trace outline',
    approximated:
      'base fill = measured p75 (105,101,104); shadow fill = measured p25 ' +
      '(103,100,103) (the tool\'s 3-ring measured shadow, incl. the genuine ' +
      'under-hem crescent); ink contour = ONE stroke w 1.5, plus measured ' +
      'details: two sleeve-crease strokes w 1 and the crest ring w 1.5 ' +
      '(occluded by the near forearm in the idle pose — proven drawn, visible ' +
      'when the arm moves).',
    inferred:
      'PLACEMENT. Anchored by its TOP to the upper arm\'s top rather than by ' +
      'centre: the sleeve hangs FROM the shoulder, and centring rides it down ' +
      'the forearm. A5.3 first mistook this region for the gi BODY and put it ' +
      'on slot 15, which is why the arm rendered bare over a vest-sized gi.',
  },
  9011: {
    slot: 11,
    garment: 'hakama leg (drawn at slots 11 AND 7)',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(789,778)-(860,894) video px; silhouette 63 x 113 video px',
    authored: 'SESSION22 A9.5 — OG grammar over the SESSION19 trace outline',
    approximated:
      'MEASURED_FLAT (iqr 3,2,5): ONE fill, the SWF\'s own #dcd9d4 — both p25 ' +
      '(217,211,214) and p75 (220,213,219) sit within 12 of it, so D4 maps ' +
      'base AND shadow to the same colour and a shadow path would be a lie. ' +
      'Ink contour = ONE stroke, width 1.5, centreline INSET w/2 by raster ' +
      'erosion (on-ring ink broke the 140.5 height ceiling AND the held-out ' +
      'floor — D-A9.2a\'s veto branch, measured). HEM: the trace\'s 24 ' +
      'grass-notch vertices are replaced by 6 structural ones at the trace\'s ' +
      'own flats (y 24.139/25.472/22.361); cutting at the visible cloth line ' +
      'was measured (held-out 0.775 and 0.846) and REJECTED — the wisp band ' +
      'is occluded ankle-length cloth, which the held-out width profile ' +
      'demands.',
    inferred:
      'PLACEMENT, and it is DRAWN TWICE. Only the NEAR leg could be traced: ' +
      'the far leg is not bounded by ink on its right, because the outline ' +
      'there IS the scabbard, so the region leaks into the background. This ' +
      'shape is therefore drawn at slot 7 as well - which is what the OG does, ' +
      'drawing 2678 at slots 7 and 11 and 2648 at 6 and 10. It covers the ' +
      'whole leg and sits on the CALF, not the thigh, because the calf draws ' +
      'in front of the thigh and the foot.',
  },
  9017: {
    slot: 17,
    garment: 'kasa (conical straw hat)',
    frame: 'reference/frames/s19_trace/zFt_0061.png',
    video: 'zFtCaTO0_1M',
    seconds: 590,
    crop: '(762,638)-(900,702) video px; silhouette 107 x 48 video px',
    authored: 'SESSION22 A9.3 — OG grammar over the SESSION19 trace outline',
    approximated:
      'base fill = measured p75 (154,119,57); shadow fill = measured p25 ' +
      '(116,84,33) on the RIGHT cone face where the crop is dark (measured ' +
      'region, 27.5 % of interior) — the ledger-banned darken-toward-median ' +
      'move was NOT taken. Detail strokes, tones measured off the frame: 6 ' +
      'radial weave ribs w 1 (6 streaks counted in the crop) and the band-top ' +
      'boundary line w 1. Ink: contour w 2 with the centreline INSET w/2 by ' +
      'raster erosion (on-ring ink raised the figure top 1.2 stage px over ' +
      'the 140.5 ceiling — D-A9.2a\'s veto branch); 13 fringe ticks w 1 ' +
      'INSIDE the traced brim bumps (~13 counted in the crop), so the ragged ' +
      'hanging-straw edge reads without growing the silhouette.',
    inferred:
      'PLACEMENT ONLY. The traced OUTLINE is measured; where it sits on the ' +
      'head is not. Slot 17 is aliased to slot 16, so (0,0) must be the head ' +
      'joint pivot — and the frame cannot register it, because that fighter ' +
      'wears different head art (its hair mass measures 20.4x24.0 world px ' +
      'against our shape 2670 at 14.2x15.0) and stands in a different pose. ' +
      'So the kasa is centred on OUR head+hair union and its brim set 40 % ' +
      'down that head, the one ratio the frame does give. Veto = any evidence ' +
      "of the OG's own hat pivot.",
  },
};

function provenanceBlock(id: number): string {
  const traced = TRACED_SOURCES[id];
  if (traced === undefined) {
    if (id >= TRACED_ID_MIN) {
      throw new Error(`emit: id ${String(id)} is in the traced range but has no TRACED_SOURCES entry`);
    }
    return ` * PROVENANCE
 *   source characterId : ${String(id)}   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/${String(id)}.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \\
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- ${String(id)}
 *   flatten tolerance  : ${String(TOLERANCE)} px   ·   coordinates rounded to ${String(DECIMALS)} dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md`;
  }
  const madeBy =
    traced.authored === undefined
      ? ` *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode \`-a 0\`)`
      : ` *   outline traced by  : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode \`-a 0\`)
 *   authored by        : python3 scripts/art/reauthorGarment.py   (${traced.authored})`;
  return ` * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : ${String(id)}   (NOT an OG id — traced art is numbered >= ${String(TRACED_ID_MIN)})
 *   garment / slot     : ${traced.garment} → slot ${String(traced.slot)}
 *   source frame       : ${traced.frame}  (gitignored)
 *   source video       : ${traced.video} @ t = ${String(traced.seconds)}.0 s
 *   crop               : ${traced.crop}
${madeBy}
 *   source file        : reference/traced/${String(id)}.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- ${String(id)}
 *   flatten tolerance  : ${String(TOLERANCE)} px   ·   coordinates rounded to ${String(DECIMALS)} dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: ${wrapProse(traced.inferred)}`;
}

/** Wrap prose into the block comment at a readable width, indented to match. */
function wrapProse(text: string): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length + w.length + 1 > 72) {
      lines.push(line);
      line = w;
    } else {
      line = line === '' ? w : `${line} ${w}`;
    }
  }
  if (line !== '') lines.push(line);
  return lines.join('\n *   ');
}

export function emit(art: ShapeArt): string {
  const paints = art.paints.map(emitPaint).join('\n');

  const fills = art.paints.filter((p) => p.kind === 'fill');
  const strokes = art.paints.filter((p) => p.kind === 'stroke');
  const rings = fills.flatMap((f) => f.rings);
  const nHoles = rings.filter((r) => r.hole).length;
  const nVerts = rings.reduce((m, r) => m + r.points.length / 2, 0);
  /**
   * The palette, written out so the header's loudest claim — "colours are
   * BYTE-EXACT" — is a checkable statement rather than an assertion
   * (SESSION16 R2 finding 5: counts alone accept a recoloured outline).
   */
  const palette = [
    `fills ${fills.length === 0 ? 'none' : fills.map((f) => hex(f.color)).join(' · ')}`,
    `strokes ${strokes.length === 0 ? 'none' : strokes.map((s) => `${hex(s.color)}@${String(s.width)}`).join(' · ')}`,
    // `|` separates the two groups and ` · ` separates members within a group,
    // so the line parses unambiguously — the ratchet gate reads it back.
  ].join('  |  ');

  const traced = TRACED_SOURCES[art.id];
  const colourClaim =
    traced === undefined
      ? `Colours are BYTE-EXACT to the SWF's recorded RGB (SESSION15 §2 bar B).
 *   APPROXIMATED FILLS: none — this shape is 100 % flat solid colour, so
 *   SESSION15 D3 (mean-colour gradients) and D4 (bitmap fills) do not apply.`
      : traced.authored === undefined
        ? `Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ${wrapProse(traced.approximated)}`
        : `Tones are the COMMITTED MEASURED TARGETS (sourceColour.ts p25 shadow /
 *   p75 base); kickoff D4 substitutes the SWF's own byte-exact colour where a
 *   target sits within 12 levels of one. INFERRED, never CONTRACT.
 *   APPROXIMATED FILLS: (authored) ${wrapProse(traced.approximated)}`;

  return `/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
${provenanceBlock(art.id)}
 *
 * CONTENT
 *   ${String(art.paints.length)} paint op(s) in SWF paint order: ${String(fills.length)} solid fill(s), ${String(strokes.length)} stroke pass(es).
 *   ${String(rings.length)} ring(s) (${String(nHoles)} hole(s)), ${String(nVerts)} vertices.
 *   palette            : ${palette}
 *   ${colourClaim}
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. \`paints\` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_${String(art.id)}: ArtShape = {
  id: ${String(art.id)},
  paints: [
${paints}
  ],
};
`;
}
