import Phaser from 'phaser';
import { COL } from '../config/palette';

/**
 * Procedural flat-color, bold-outline fighter — v2 fidelity pass
 * (2026-07-12): proportions and construction rebuilt against the study
 * frames' anatomy READING (chunky torso, big head, wide hakama trousers,
 * two-hand katana grip, shallow wide kasa). The drawing itself is original
 * work — structural fidelity, never a trace (root CLAUDE.md).
 * All numbers are render geometry (ratcheted by the game-purity baseline).
 */
export interface SamuraiLook {
  gi: number;
  giShade: number;
  scarf: number;
  /** null = topknot + headband instead of the straw kasa. */
  hat: number | null;
}

export type SamuraiPose = 'idle' | 'windup' | 'guard';

export const PLAYER_LOOK: SamuraiLook = {
  gi: COL.kimono, // white gi with dark vest — the frame reading of the player
  giShade: COL.haori,
  scarf: COL.scarf,
  hat: COL.hatStraw,
};

export const ENEMY_LOOK: SamuraiLook = {
  gi: COL.haoriEnemy,
  giShade: COL.bloodDark,
  scarf: COL.cream,
  hat: null,
};

/**
 * Draw one fighter, feet at (x, groundY), facing +1 (right) or -1 (left).
 * Bold outline = each mass drawn twice (outline pass slightly larger).
 * Construction (bottom-up): shadow → hakama → feet → torso/vest → obi →
 * scarf → head/hat → katana (two-hand grip) → arms.
 */
export function drawSamurai(
  g: Phaser.GameObjects.Graphics,
  x: number,
  groundY: number,
  facing: 1 | -1,
  look: SamuraiLook,
  pose: SamuraiPose,
  alpha = 1,
): void {
  const o = COL.outline;
  const lean = facing * (pose === 'windup' ? 7 : pose === 'guard' ? -3 : 2);

  // ── ground shadow ──
  g.fillStyle(o, 0.18 * alpha);
  g.fillEllipse(x, groundY - 2, 58, 10);

  // ── hakama (wide trousers, center split, taper to the ankle) ──
  g.fillStyle(o, alpha);
  g.fillTriangle(x - 21, groundY - 2, x + 21, groundY - 2, x, groundY - 52);
  g.fillRect(x - 19, groundY - 52, 38, 14);
  g.fillStyle(look.giShade, alpha);
  g.fillTriangle(x - 17, groundY - 4, x + 17, groundY - 4, x, groundY - 50);
  g.fillRect(x - 16, groundY - 50, 32, 12);
  // center split line
  g.lineStyle(2, o, alpha);
  g.beginPath();
  g.moveTo(x, groundY - 34);
  g.lineTo(x, groundY - 6);
  g.strokePath();
  // feet (small, splayed)
  g.fillStyle(o, alpha);
  g.fillEllipse(x - 11, groundY - 3, 15, 6);
  g.fillEllipse(x + 11, groundY - 3, 15, 6);

  // ── torso: gi with a darker vest panel, slight lean ──
  g.fillStyle(o, alpha);
  g.fillRoundedRect(x - 17 + lean, groundY - 92, 34, 46, 9);
  g.fillStyle(look.gi, alpha);
  g.fillRoundedRect(x - 14 + lean, groundY - 89, 28, 40, 7);
  // vest panels (open front V)
  g.fillStyle(look.giShade, alpha);
  g.fillTriangle(x - 14 + lean, groundY - 89, x - 4 + lean, groundY - 89, x - 12 + lean, groundY - 52);
  g.fillTriangle(x + 14 + lean, groundY - 89, x + 4 + lean, groundY - 89, x + 12 + lean, groundY - 52);
  // obi belt + knot
  g.fillStyle(o, alpha);
  g.fillRect(x - 16 + lean, groundY - 56, 32, 7);
  g.fillStyle(look.scarf, alpha);
  g.fillRect(x - 15 + lean, groundY - 55, 30, 5);
  g.fillCircle(x - facing * 10 + lean, groundY - 52, 4);

  // ── scarf: band + two flowing tail triangles (silhouette tell) ──
  g.fillStyle(look.scarf, alpha);
  g.fillRect(x - 13 + lean, groundY - 90, 26, 6);
  g.fillTriangle(
    x - facing * 11 + lean, groundY - 88,
    x - facing * 34 + lean, groundY - 76,
    x - facing * 13 + lean, groundY - 78,
  );
  g.fillTriangle(
    x - facing * 12 + lean, groundY - 84,
    x - facing * 27 + lean, groundY - 66,
    x - facing * 10 + lean, groundY - 74,
  );

  // ── head (big relative to body — the style's read) ──
  const hx = x + lean + facing * 3;
  const hy = groundY - 102;
  g.fillStyle(o, alpha);
  g.fillCircle(hx, hy, 13);
  g.fillStyle(COL.kimono2, alpha);
  g.fillCircle(hx, hy, 11);
  // simple profile nose nub + eye dash
  g.fillStyle(o, alpha);
  g.fillCircle(hx + facing * 10, hy + 2, 2);
  g.fillRect(hx + facing * 4, hy - 2, 4, 2);

  if (look.hat !== null) {
    // straw kasa: wide shallow cone, slight brim curve, crown button
    g.fillStyle(o, alpha);
    g.fillTriangle(hx - 30, hy - 4, hx + 30, hy - 4, hx, hy - 24);
    g.fillEllipse(hx, hy - 4, 60, 8);
    g.fillStyle(look.hat, alpha);
    g.fillTriangle(hx - 27, hy - 5, hx + 27, hy - 5, hx, hy - 21);
    g.fillEllipse(hx, hy - 5, 54, 6);
    g.fillStyle(o, alpha);
    g.fillCircle(hx, hy - 21, 2);
    // weave line
    g.lineStyle(1, COL.wood, 0.6 * alpha);
    g.beginPath();
    g.moveTo(hx - 14, hy - 11);
    g.lineTo(hx + 14, hy - 11);
    g.strokePath();
  } else {
    // topknot + headband (ronin/bandit read)
    g.fillStyle(o, alpha);
    g.fillEllipse(hx, hy - 9, 20, 10);
    g.fillCircle(hx - facing * 2, hy - 15, 5);
    g.fillStyle(look.scarf, alpha);
    g.fillRect(hx - 11, hy - 7, 22, 4);
    g.fillTriangle(hx - facing * 11, hy - 6, hx - facing * 20, hy + 2, hx - facing * 11, hy - 1);
  }

  // ── katana: two-hand grip, pose-angled blade with tsuba ──
  const gripX = x + lean + facing * 15;
  const gripY = groundY - 66;
  let tipX: number;
  let tipY: number;
  if (pose === 'windup') {
    tipX = gripX + facing * 16;
    tipY = gripY - 48;
  } else if (pose === 'guard') {
    tipX = gripX + facing * 4;
    tipY = gripY - 44;
  } else {
    tipX = gripX + facing * 44;
    tipY = gripY - 14;
  }
  // blade: outline pass then bright edge
  g.lineStyle(5, o, alpha);
  g.beginPath();
  g.moveTo(gripX, gripY);
  g.lineTo(tipX, tipY);
  g.strokePath();
  g.lineStyle(2.5, COL.kimono, alpha);
  g.beginPath();
  g.moveTo(gripX + facing * 3, gripY - 2);
  g.lineTo(tipX - facing * 1, tipY + 1);
  g.strokePath();
  // tsuba (guard) + wrapped hilt
  g.fillStyle(o, alpha);
  g.fillCircle(gripX, gripY, 4);
  g.lineStyle(4, COL.wood, alpha);
  g.beginPath();
  g.moveTo(gripX, gripY);
  g.lineTo(gripX - facing * 9, gripY + 7);
  g.strokePath();

  // ── arms: two sleeves reaching the grip (two-hand read) ──
  g.fillStyle(look.gi, alpha);
  g.fillEllipse(x + lean + facing * 6, groundY - 74, 16, 9);
  g.fillEllipse(gripX - facing * 4, gripY + 2, 14, 8);
  g.fillStyle(o, alpha);
  g.fillCircle(gripX - facing * 1, gripY + 3, 3);
  g.fillCircle(gripX - facing * 7, gripY + 6, 3);
  g.lineStyle(0, 0, 0);
}
