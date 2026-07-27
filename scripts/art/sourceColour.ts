/**
 * THE SOURCE FIGHTER'S OWN GARMENT COLOURS (SESSION21 A8.1) — MEASURED, and
 * committed as derived data so the suite can grade against them with no
 * `reference/`. BUILD-TIME ONLY. **GENERATED — regenerate, do not hand-edit.**
 *
 * ⛔ WHY NUMBERS AND NOT THE FRAMES. `reference/` is gitignored — the videos and
 * their stills are study-only and never distributed — and a runtime read of it
 * is the bug that once broke every fresh clone (SESSION16 finding 4). Seven
 * medians are derived data about colour, the same kind of committed target
 * `sourceProfile.ts` already holds for proportion.
 *
 * PROVENANCE — reproduce with:
 *   python3 scripts/art/colourRuler.py --emit
 *
 * MEASUREMENT RULE: for each garment, `traceGarment.garment_masks` builds the
 * SAME region the outline is traced from; that region is eroded away from its
 * own outline while it still holds >= 40 pixels; the median is taken per channel
 * over the raw frame pixels inside it. Masks are shared with the tracer on
 * purpose — a second opinion about which pixels are the hakama is how a ruler
 * and the thing it measures end up describing different regions.
 *
 * ⚠️ `iqr` IS PART OF THE MEASUREMENT, NOT DECORATION. It is the interquartile
 * spread per channel. A garment with a wide spread is NOT one flat colour in the
 * source, so matching its median exactly still will not make it look right — its
 * real defect is missing interior structure. The kasa is the clear case.
 *
 * ⚠️ SAMPLED FROM LOSSY VIDEO, never read from the SWF — INFERRED targets, never
 * CONTRACT (SESSION19 §P7).
 */

/** One garment's colour, as the source frame actually shows it. */
export interface SourceFill {
  /** The traced shape this measures — >= 9000, always. */
  readonly shapeId: number;
  /** The pose slot the garment is drawn at. */
  readonly slot: number;
  readonly garment: string;
  /** Per-channel median inside the garment's own traced mask, 0-255. */
  readonly median: readonly [number, number, number];
  /** Per-channel interquartile spread — how far from flat the garment is. */
  readonly iqr: readonly [number, number, number];
  /** How many source pixels the median was taken over. */
  readonly samples: number;
  /** 3x3 erosion steps applied before sampling, to clear the outline. */
  readonly erosions: number;
}

/** The still every median below was measured from. */
export const COLOUR_FRAME = 'reference/frames/s19_trace/zFt_0061.png';
/** Seconds into `zFtCaTO0_1M.mp4`, the watermark-free longplay. */
export const COLOUR_FRAME_T = 590.0;

export const SOURCE_FILLS: readonly SourceFill[] = [
  {
    shapeId: 9017,
    slot: 17,
    garment: 'kasa (conical straw hat)',
    median: [122, 88, 38],
    iqr: [38, 35, 24],
    samples: 433,
    erosions: 6,
  },
  {
    shapeId: 9012,
    slot: 12,
    garment: 'collar / juban',
    median: [204, 201, 203],
    iqr: [16, 17, 14],
    samples: 115,
    erosions: 1,
  },
  {
    shapeId: 9015,
    slot: 15,
    garment: 'gi body (outer silhouette)',
    median: [104, 100, 103],
    iqr: [2, 1, 1],
    samples: 360,
    erosions: 6,
  },
  {
    shapeId: 9019,
    slot: 19,
    garment: 'gi sleeve, near arm',
    median: [104, 100, 103],
    iqr: [2, 1, 1],
    samples: 326,
    erosions: 6,
  },
  {
    shapeId: 9001,
    slot: 1,
    garment: 'gi sleeve, far arm',
    median: [103, 100, 103],
    iqr: [2, 2, 2],
    samples: 41,
    erosions: 2,
  },
  {
    shapeId: 9014,
    slot: 14,
    garment: 'obi (waist sash)',
    median: [204, 201, 201],
    iqr: [6, 6, 8],
    samples: 68,
    erosions: 4,
  },
  {
    shapeId: 9011,
    slot: 11,
    garment: 'hakama leg (drawn at slots 11 AND 7)',
    median: [220, 213, 219],
    iqr: [3, 2, 5],
    samples: 1744,
    erosions: 6,
  },
];
