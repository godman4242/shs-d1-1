import Phaser from 'phaser';
import { COL } from '../config/palette';

/**
 * Procedural flat-color, bold-outline fighter (fidelity tells 17–18: kasa +
 * katana + scarf silhouette, drawn — never an image asset). Original art
 * built FROM the study frames' anatomy; palette is the repo's trade-dress-
 * shifted set (invariant — never revert toward the original's colors).
 * All numbers here are render geometry (game/ literals tolerated until the
 * M8 ratchet baselines them).
 */
export interface SamuraiLook {
  gi: number;
  giShade: number;
  scarf: number;
  /** null = bandit headband instead of the straw kasa. */
  hat: number | null;
}

export type SamuraiPose = 'idle' | 'windup' | 'guard';

export const PLAYER_LOOK: SamuraiLook = {
  gi: COL.haori,
  giShade: COL.haoriShade,
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
 * Bold outline = every shape drawn twice (outline pass slightly larger).
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
  const legLift = pose === 'guard' ? 4 : 0;

  // ── legs (hakama silhouette: wide trousers, small feet) ──
  g.fillStyle(o, alpha);
  g.fillRect(x - 16, groundY - 46, 32, 46); // outline mass
  g.fillStyle(look.giShade, alpha);
  g.fillRect(x - 13, groundY - 44, 26, 42);
  g.fillStyle(o, alpha);
  g.fillRect(x - 17, groundY - 4, 14, 4); // feet
  g.fillRect(x + 3, groundY - 4 - legLift, 14, 4);

  // ── torso (gi, leaning with facing) ──
  const lean = facing * (pose === 'windup' ? 6 : 2);
  g.fillStyle(o, alpha);
  g.fillRoundedRect(x - 19 + lean, groundY - 96, 38, 56, 10);
  g.fillStyle(look.gi, alpha);
  g.fillRoundedRect(x - 16 + lean, groundY - 93, 32, 50, 8);
  // chest wrap / belt
  g.fillStyle(look.giShade, alpha);
  g.fillRect(x - 16 + lean, groundY - 58, 32, 8);

  // ── scarf band + tail (reads in silhouette even at speed) ──
  g.fillStyle(look.scarf, alpha);
  g.fillRect(x - 14 + lean, groundY - 92, 28, 7);
  g.fillTriangle(
    x - facing * 12 + lean, groundY - 90,
    x - facing * 30 + lean, groundY - 78,
    x - facing * 14 + lean, groundY - 80,
  );

  // ── head ──
  const hx = x + lean + facing * 2;
  const hy = groundY - 104;
  g.fillStyle(o, alpha);
  g.fillCircle(hx, hy, 12);
  g.fillStyle(COL.kimono2, alpha);
  g.fillCircle(hx, hy, 10);
  if (look.hat !== null) {
    // straw kasa: wide shallow cone with a darker rim line
    g.fillStyle(o, alpha);
    g.fillTriangle(hx - 26, hy - 4, hx + 26, hy - 4, hx, hy - 22);
    g.fillStyle(look.hat, alpha);
    g.fillTriangle(hx - 23, hy - 5, hx + 23, hy - 5, hx, hy - 20);
    g.lineStyle(2, o, alpha);
    g.beginPath();
    g.moveTo(hx - 23, hy - 5);
    g.lineTo(hx + 23, hy - 5);
    g.strokePath();
  } else {
    // bandit headband + hair knot
    g.fillStyle(o, alpha);
    g.fillCircle(hx + facing * 3, hy - 9, 5);
    g.fillStyle(look.scarf, alpha);
    g.fillRect(hx - 10, hy - 6, 20, 4);
  }

  // ── katana (windup raises it overhead; idle holds low-forward) ──
  const gripX = x + lean + facing * 14;
  const gripY = groundY - 70;
  g.lineStyle(4, o, alpha);
  g.beginPath();
  if (pose === 'windup') {
    g.moveTo(gripX, gripY);
    g.lineTo(gripX + facing * 20, gripY - 42);
  } else if (pose === 'guard') {
    g.moveTo(gripX - facing * 6, gripY - 20);
    g.lineTo(gripX + facing * 8, gripY + 24);
  } else {
    g.moveTo(gripX, gripY);
    g.lineTo(gripX + facing * 38, gripY - 10);
  }
  g.strokePath();
  g.lineStyle(2, COL.kimono, alpha);
  g.beginPath();
  if (pose === 'windup') {
    g.moveTo(gripX + facing * 4, gripY - 8);
    g.lineTo(gripX + facing * 19, gripY - 39);
  } else if (pose === 'guard') {
    g.moveTo(gripX - facing * 4, gripY - 14);
    g.lineTo(gripX + facing * 7, gripY + 21);
  } else {
    g.moveTo(gripX + facing * 6, gripY - 2);
    g.lineTo(gripX + facing * 36, gripY - 10);
  }
  g.strokePath();

  // ── arms (simple sleeve masses toward the grip) ──
  g.fillStyle(look.gi, alpha);
  g.fillCircle(gripX - facing * 4, gripY - 2, 6);
  g.lineStyle(0, 0, 0);
}
