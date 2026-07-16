/**
 * FIDELITY — measured reference assertions from the original game's frames.
 * Pure data, no logic.
 *
 * All values are CONTRACT: measured off 1920×1080 study frames of the
 * original (video B = Nr4fQstqHDM, segment B-23 VS-duel window t=3771–3783 s;
 * median across 3–4 frames, per-point spread ≤ a few counts unless noted).
 * Colors carry YouTube-codec headroom in `tol` (per-channel 0–255); the
 * archived lossless wiki PNGs are the planned v2 refinement source
 * (docs/research/reference-sources.md).
 *
 * Coordinates are FRACTIONS of the stage (origin top-left), measured on the
 * original's full-bleed 16:9 frame — they transfer 1:1 to our 1024×576 stage.
 * Each probe asserts "this exact color sits at this exact spot", so a probe
 * doubles as a position pin: a mispositioned element fails its color probe.
 *
 * Sampling states (dev-only harness, src/game/fidelity.ts):
 * - 'fighting'  — combat live, t≈0: full HP/Chi/Focus, fighters at spawns.
 * - 'result-win' — the YOU WIN card.
 */
export interface FidelityProbe {
  readonly id: string;
  /** Canonical render state this probe samples. */
  readonly state: 'fighting' | 'result-win';
  /** Normalized stage coords — fraction of width/height, origin top-left. */
  readonly x: number;
  readonly y: number;
  /** Expected sRGB at that point, 0–255 per channel. */
  readonly rgb: readonly [number, number, number];
  /** Max per-channel delta tolerated (video-codec headroom). */
  readonly tol: number;
  /** Provenance: source frame timestamp + landmark. */
  readonly note: string;
}

export const FIDELITY_PROBES: readonly FidelityProbe[] = [
  // ── AUTO SLASH OFF plate (top-left parchment box, box (74,24)–(367,85)) ──
  {
    id: 'plate-fill',
    state: 'fighting',
    x: 0.1302,
    y: 0.0352,
    rgb: [84, 44, 6],
    tol: 26,
    note: 'B t=3772-3776 (62:52-62:56) AUTO SLASH OFF plate fill above the text row (spread ≤2; first sampling at y=0.0417/0.0509 caught glyph AA — re-measured)',
  },
  {
    id: 'plate-fill-left',
    state: 'fighting',
    x: 0.0469,
    y: 0.037,
    rgb: [84, 44, 8],
    tol: 26,
    note: 'B t=3772-3776 plate fill left of the text start (spread ≤2)',
  },

  // ── Player HP bar (x 246→513, y 972→989; fill green #02990b) ──
  {
    id: 'hp-bar-left',
    state: 'fighting',
    x: 0.1406,
    y: 0.9102,
    rgb: [2, 153, 11],
    tol: 24,
    note: 'B t=3772-3776 HP fill near left edge (spread ≤3)',
  },
  {
    id: 'hp-bar-right-end',
    state: 'fighting',
    x: 0.263,
    y: 0.9102,
    rgb: [2, 153, 11],
    tol: 24,
    note: 'B t=3772-3776 HP fill just inside right end — pins bar LENGTH at full HP',
  },

  // ── Player Chi bar (same span, y 1005→1017; fill blue #2e49e2) ──
  {
    id: 'chi-bar-left',
    state: 'fighting',
    x: 0.1458,
    y: 0.9361,
    rgb: [46, 73, 226],
    tol: 24,
    note: 'B t=3772-3776 blue bar fill near left edge (zero spread)',
  },
  {
    id: 'chi-bar-right-end',
    state: 'fighting',
    x: 0.263,
    y: 0.9361,
    rgb: [46, 73, 226],
    tol: 24,
    note: 'B t=3772-3776 blue bar fill just inside right end — pins bar LENGTH',
  },

  // ── Bar gradient pins (the bars are vertically shaded — see BAR_GRADIENTS) ──
  {
    id: 'hp-bar-gradient-top',
    state: 'fighting',
    x: 0.1406,
    y: 0.9023,
    rgb: [58, 181, 95],
    tol: 24,
    note: 'B t=3772-3776 HP fill top row (974) — bright end of the vertical gradient',
  },
  {
    id: 'hp-bar-gradient-bottom',
    state: 'fighting',
    x: 0.1406,
    y: 0.9139,
    rgb: [0, 154, 3],
    tol: 24,
    note: 'B t=3772-3776 HP fill bottom row (987) — deep end of the gradient',
  },
  {
    id: 'chi-bar-gradient-top',
    state: 'fighting',
    x: 0.1458,
    y: 0.9296,
    rgb: [82, 114, 234],
    tol: 24,
    note: 'B t=3772-3776 blue fill top row (1004) — light end of the gradient',
  },
  {
    id: 'chi-bar-gradient-bottom',
    state: 'fighting',
    x: 0.1458,
    y: 0.9417,
    rgb: [27, 36, 207],
    tol: 24,
    note: 'B t=3772-3776 blue fill bottom row (1017) — deep end of the gradient',
  },

  // ── Focus strip (white pill, y ≈1030→1045, left-aligned with bars) ──
  {
    id: 'focus-strip-left',
    state: 'fighting',
    x: 0.1432,
    y: 0.9593,
    rgb: [238, 238, 238],
    tol: 24,
    note: 'B t=3774 white focus pill near left edge (fill length varies in-fight)',
  },

  // ── Portrait ring (center ≈(161,1021), outer r≈64, ring red #950d00) ──
  {
    id: 'portrait-ring-left',
    state: 'fighting',
    x: 0.0563,
    y: 0.9454,
    rgb: [149, 13, 0],
    tol: 26,
    note: 'B t=3772-3776 ring band, left of center (spread ≤6)',
  },
  {
    id: 'portrait-ring-right',
    state: 'fighting',
    x: 0.1203,
    y: 0.9324,
    rgb: [139, 19, 10],
    tol: 26,
    note: 'B t=3772-3776 ring band, right of center (spread ≤4; cross-checked A-28 scan: center ≈(170,1007) r≈63)',
  },

  // ── Skill slots (3 squares ≈108px: x 1462/1585/1722, y 957→1070) ──
  {
    id: 'slot1-interior',
    state: 'fighting',
    x: 0.7813,
    y: 0.9167,
    rgb: [19, 19, 19],
    tol: 18,
    note: 'B t=3772-3776 slot 1 dark interior beside kunai icon (zero spread)',
  },
  {
    id: 'slot2-interior-corner',
    state: 'fighting',
    x: 0.8344,
    y: 0.9769,
    rgb: [0, 0, 0],
    tol: 18,
    note: 'B t=3772-3776 slot 2 bottom-left interior corner (zero spread)',
  },
  {
    id: 'slot3-interior-corner',
    state: 'fighting',
    x: 0.9063,
    y: 0.9769,
    rgb: [0, 0, 0],
    tol: 18,
    note: 'B t=3772-3776 slot 3 bottom-left interior corner (zero spread)',
  },
  {
    id: 'slot-border-top',
    state: 'fighting',
    x: 0.7896,
    y: 0.888,
    rgb: [49, 49, 49],
    tol: 20,
    note: 'B t=3772-3776 slot 1 grey border, top edge (spread ≤1)',
  },

  // ── YOU WIN card (flat red field + dark silhouette band) ──
  {
    id: 'win-bg-left',
    state: 'result-win',
    x: 0.1563,
    y: 0.1852,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'AUTHORED #990000 — byte-exact in lossless archive shots (A5.PNG ×2 pts, Wiki14.PNG, A8 combo numeral); video read #a30e00 (codec shift of this). B t=3783 flat-field cross-check',
  },
  {
    id: 'win-bg-right',
    state: 'result-win',
    x: 0.8333,
    y: 0.1852,
    rgb: [153, 0, 0],
    tol: 20,
    note: 'Same authored #990000 (see win-bg-left provenance; B t=3783 flat-field cross-check), right side',
  },
  {
    id: 'win-silhouette-band',
    state: 'result-win',
    x: 0.1563,
    y: 0.8333,
    rgb: [25, 34, 9],
    tol: 28,
    note: 'B t=3783 bottom silhouette band (dark olive-black ground art)',
  },
] as const;

/**
 * Player-bar vertical gradients — CONTRACT, measured per OUR stage row.
 * The original's bars are gradient-shaded (confirmed lossless in A8.PNG;
 * measured row-by-row off B t=3772-3776 at 1080p, spreads ≤9; focus strip
 * from the single stable frame t=3774 — its fill length moves in-fight).
 * Each entry is the original's color at that exact stage row's screen
 * position (rows: hp 518-526, chi 535-542, focus 549-557 @1024×576) — the
 * best-possible downsample, so row probes match by construction.
 */
export const BAR_GRADIENTS = {
  hp: [0x3ab55f, 0x3ab55f, 0x31ad58, 0x26a641, 0x129827, 0x079913, 0x02990b, 0x05960c, 0x009a03],
  chi: [0x5272ea, 0x4d6ee6, 0x4362e2, 0x3a56e4, 0x2e49e2, 0x253fe6, 0x1930ef, 0x1b24cf],
  focus: [0xf2f2f2, 0xf2f2f2, 0xefefef, 0xefefef, 0xeeeeee, 0xeaeaea, 0xe8e8e8, 0xe5e5e5, 0xe3e3e3],
} as const;

/**
 * Enemy overhead HP bar — anchored to the enemy, not the screen, so it is
 * asserted as an offset from the sim's enemy position (our stage px).
 * Offset is INFERRED (our sprite anchor); the fill color is CONTRACT.
 */
export const FIDELITY_ENEMY_BAR = {
  /** Stage-px offset from enemy pos to a point inside the bar fill. */
  dx: 0,
  dy: -88,
  rgb: [23, 155, 50] as const,
  tol: 26,
  note: 'B t=3774 enemy overhead bar green (brighter than player HP green)',
} as const;
