import Phaser from 'phaser';
import { SCARF, SCARF_FLUTTER_RAD_PER_MS } from '../config/anim';
import { COL } from '../config/palette';
import type { Pose, PosePoint } from '../config/poses';

/**
 * Procedural flat-color, bold-outline fighter — v3 skeletal pass (Stage 4
 * M0, 2026-07-13): the v2 static drawing re-built joint-driven. Proportions
 * and construction still follow the study frames' anatomy READING (chunky
 * torso, big head, wide hakama trousers, two-hand katana grip, shallow wide
 * kasa) — the drawing itself is original work, never a trace (root
 * CLAUDE.md). Poses come from core/fighterAnimator via config/poses; this
 * module only converts joints → shapes. All numbers are render geometry
 * (ratcheted by the game-purity baseline).
 */
export interface SamuraiLook {
  gi: number;
  giShade: number;
  scarf: number;
  /** null = topknot + headband instead of the straw kasa. */
  hat: number | null;
}

/** Secondary-motion drivers for the scarf: smoothed local velocity + a clock. */
export interface ScarfMotion {
  /** Local (facing-relative) horizontal velocity, px/ms, low-passed by the caller. */
  flow: number;
  /** Continuous ms clock for the idle flutter (fx clock). */
  phase: number;
}

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

/** The pelvis (pose origin) rides this many px above groundY — IDLE feet plant at +49. */
const PELVIS_ABOVE_GROUND = 52;

type G = Phaser.GameObjects.Graphics;
type W = (p: PosePoint) => { x: number; y: number };

/** Round-capped limb from a→b with an outline pass (slightly larger) under the fill. */
function limb(g: G, a: { x: number; y: number }, b: { x: number; y: number }, r: number, fill: number, alpha: number): void {
  g.lineStyle(2 * r + 4, COL.outline, alpha);
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.strokePath();
  g.fillStyle(COL.outline, alpha);
  g.fillCircle(a.x, a.y, r + 2);
  g.fillCircle(b.x, b.y, r + 2);
  g.lineStyle(2 * r, fill, alpha);
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.strokePath();
  g.fillStyle(fill, alpha);
  g.fillCircle(a.x, a.y, r);
  g.fillCircle(b.x, b.y, r);
}

/** Outlined filled polygon from world points. */
function poly(g: G, pts: Array<{ x: number; y: number }>, fill: number, alpha: number, outlineW = 3): void {
  const first = pts[0];
  if (first === undefined) return;
  g.lineStyle(outlineW, COL.outline, alpha);
  g.fillStyle(fill, alpha);
  g.beginPath();
  g.moveTo(first.x, first.y);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (p !== undefined) g.lineTo(p.x, p.y);
  }
  g.closePath();
  g.fillPath();
  g.strokePath();
}

/** Tapered scarf ribbon along a world-space tail (widest at the neck, point at the tip). */
function scarfRibbon(g: G, pts: Array<{ x: number; y: number }>, baseHalf: number, color: number, alpha: number): void {
  const n = pts.length;
  if (n < 2) return;
  const left: Array<{ x: number; y: number }> = [];
  const right: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const cur = pts[i];
    if (a === undefined || b === undefined || cur === undefined) continue;
    const tx = b.x - a.x;
    const ty = b.y - a.y;
    const len = Math.hypot(tx, ty) || 1;
    const hw = baseHalf * (1 - i / (n - 1));
    left.push({ x: cur.x + (-ty / len) * hw, y: cur.y + (tx / len) * hw });
    right.push({ x: cur.x - (-ty / len) * hw, y: cur.y - (tx / len) * hw });
  }
  poly(g, left.concat(right.reverse()), color, alpha, 2);
}

/** Flowing scarf tail hung off the neck; tail lags body motion and idle-flutters. */
function drawScarf(g: G, w: W, pose: Pose, look: SamuraiLook, motion: ScarfMotion, alpha: number): void {
  const flowDisp = Math.max(-SCARF.flowMax, Math.min(SCARF.flowMax, -motion.flow * SCARF.flowGain));
  const tail: PosePoint[] = [{ x: pose.neck.x + SCARF.anchorX, y: pose.neck.y + SCARF.anchorY }];
  const anchor = tail[0];
  if (anchor === undefined) return;
  for (let i = 1; i <= SCARF.segments; i++) {
    const f = i / SCARF.segments;
    const flutter = Math.sin(motion.phase * SCARF_FLUTTER_RAD_PER_MS + i) * SCARF.sway * f;
    tail.push({
      x: anchor.x - SCARF.segLen * i + flowDisp * f,
      y: anchor.y + SCARF.droop * i + flutter,
    });
  }
  scarfRibbon(g, tail.map(w), SCARF.width, look.scarf, alpha);
}

/**
 * Draw one fighter from a posed skeleton, feet band at groundY, facing +1
 * (right) or -1 (left). Bold outline = each mass drawn twice. Construction
 * (back to front): shadow → scarf → back leg → hakama → front leg → torso/
 * vest → obi → arms(back) → head/hat → katana → front forearm + hands.
 */
export function drawSamurai(
  g: Phaser.GameObjects.Graphics,
  x: number,
  groundY: number,
  facing: 1 | -1,
  look: SamuraiLook,
  pose: Pose,
  alpha = 1,
  scarfMotion?: ScarfMotion,
): void {
  const o = COL.outline;
  const baseY = groundY - PELVIS_ABOVE_GROUND;
  const w: W = (p) => ({ x: x + facing * p.x, y: baseY + p.y });

  const pelvis = w(pose.pelvis);
  const chest = w(pose.chest);
  const head = w(pose.head);
  const hat = w(pose.hat);
  const shoulder = w(pose.shoulderF);
  const elbow = w(pose.elbowF);
  const hand = w(pose.handF);
  const sword = w(pose.sword);
  const kneeF = w(pose.kneeF);
  const footF = w(pose.footF);
  const kneeB = w(pose.kneeB);
  const footB = w(pose.footB);

  // ── ground shadow (tracks the body's spread — wide when collapsed) ──
  const spread = Math.max(58, Math.abs(head.x - footF.x) + 24);
  g.fillStyle(o, 0.18 * alpha);
  g.fillEllipse((footF.x + footB.x) / 2, groundY - 2, spread, 10);

  // ── flowing scarf — backmost, streams behind the body ──
  if (scarfMotion !== undefined) drawScarf(g, w, pose, look, scarfMotion, alpha);

  // ── back leg (under the hakama skirt) + foot ──
  limb(g, kneeB, footB, 6, look.giShade, alpha);
  g.fillStyle(o, alpha);
  g.fillEllipse(footB.x, footB.y + 3, 15, 6);

  // ── hakama (wide trousers): trapezoid pelvis → knees, center split ──
  poly(
    g,
    [
      { x: pelvis.x - facing * 17, y: pelvis.y - 6 },
      { x: pelvis.x + facing * 17, y: pelvis.y - 6 },
      { x: kneeF.x + facing * 9, y: kneeF.y + 6 },
      { x: kneeB.x - facing * 9, y: kneeB.y + 6 },
    ],
    look.giShade,
    alpha,
  );
  g.lineStyle(2, o, alpha);
  g.beginPath();
  g.moveTo(pelvis.x, pelvis.y + 4);
  g.lineTo((kneeF.x + kneeB.x) / 2, (kneeF.y + kneeB.y) / 2 + 4);
  g.strokePath();

  // ── front leg + foot ──
  limb(g, kneeF, footF, 6, look.giShade, alpha);
  g.fillStyle(o, alpha);
  g.fillEllipse(footF.x, footF.y + 3, 15, 6);

  // ── torso: gi capsule chest→pelvis with darker vest V panels ──
  limb(g, { x: chest.x, y: chest.y - 4 }, { x: pelvis.x, y: pelvis.y - 10 }, 15, look.gi, alpha);
  g.fillStyle(look.giShade, alpha);
  g.fillTriangle(chest.x - facing * 14, chest.y - 16, chest.x - facing * 2, chest.y - 16, pelvis.x - facing * 10, pelvis.y - 12);
  g.fillTriangle(chest.x + facing * 14, chest.y - 16, chest.x + facing * 4, chest.y - 16, pelvis.x + facing * 10, pelvis.y - 12);

  // ── obi belt + knot ──
  g.fillStyle(o, alpha);
  g.fillRect(pelvis.x - 16, pelvis.y - 10, 32, 7);
  g.fillStyle(look.scarf, alpha);
  g.fillRect(pelvis.x - 15, pelvis.y - 9, 30, 5);
  g.fillCircle(pelvis.x - facing * 10, pelvis.y - 6, 4);

  // ── back arm: shoulder→grip sleeve (reads as the far hand on the hilt) ──
  limb(g, { x: shoulder.x - facing * 4, y: shoulder.y + 2 }, { x: hand.x - facing * 6, y: hand.y + 4 }, 6, look.gi, alpha);

  // ── head (big relative to body — the style's read) ──
  g.fillStyle(o, alpha);
  g.fillCircle(head.x, head.y, 13);
  g.fillStyle(COL.kimono2, alpha);
  g.fillCircle(head.x, head.y, 11);
  g.fillStyle(o, alpha);
  g.fillCircle(head.x + facing * 10, head.y + 2, 2); // nose nub
  g.fillRect(head.x + facing * 4 - 2, head.y - 2, 4, 2); // eye dash

  if (look.hat !== null) {
    // straw kasa: wide shallow cone rising to the hat joint (apex ~20px over
    // the brim at head.y-4; the hat joint rides at head-20 so apex = hat-4).
    const apexX = hat.x;
    const apexY = hat.y - 4;
    g.fillStyle(o, alpha);
    g.fillTriangle(head.x - 30, head.y - 4, head.x + 30, head.y - 4, apexX, apexY);
    g.fillEllipse(head.x, head.y - 4, 60, 8);
    g.fillStyle(look.hat, alpha);
    g.fillTriangle(head.x - 27, head.y - 5, head.x + 27, head.y - 5, apexX, apexY + 3);
    g.fillEllipse(head.x, head.y - 5, 54, 6);
    g.fillStyle(o, alpha);
    g.fillCircle(apexX, apexY + 3, 2);
    g.lineStyle(1, COL.wood, 0.6 * alpha); // weave line
    g.beginPath();
    g.moveTo(head.x - 14, head.y - 11);
    g.lineTo(head.x + 14, head.y - 11);
    g.strokePath();
  } else {
    // topknot + headband (ronin/bandit read)
    g.fillStyle(o, alpha);
    g.fillEllipse(head.x, head.y - 9, 20, 10);
    g.fillCircle(head.x - facing * 2, head.y - 15, 5);
    g.fillStyle(look.scarf, alpha);
    g.fillRect(head.x - 11, head.y - 7, 22, 4);
    g.fillTriangle(head.x - facing * 11, head.y - 6, head.x - facing * 20, head.y + 2, head.x - facing * 11, head.y - 1);
  }

  // ── katana: blade hand→tip (outline pass then bright edge), tsuba, hilt ──
  const bladeLen = Math.hypot(sword.x - hand.x, sword.y - hand.y) || 1;
  const bux = (sword.x - hand.x) / bladeLen;
  const buy = (sword.y - hand.y) / bladeLen;
  g.lineStyle(5, o, alpha);
  g.beginPath();
  g.moveTo(hand.x, hand.y);
  g.lineTo(sword.x, sword.y);
  g.strokePath();
  g.lineStyle(2.5, COL.kimono, alpha);
  g.beginPath();
  g.moveTo(hand.x + bux * 3, hand.y + buy * 3 - 1);
  g.lineTo(sword.x - bux, sword.y - buy);
  g.strokePath();
  // wrapped hilt extends behind the grip, opposite the blade
  g.lineStyle(4, COL.wood, alpha);
  g.beginPath();
  g.moveTo(hand.x, hand.y);
  g.lineTo(hand.x - bux * 11, hand.y - buy * 11);
  g.strokePath();
  g.fillStyle(o, alpha);
  g.fillCircle(hand.x, hand.y, 4); // tsuba

  // ── front arm: shoulder→elbow→hand sleeves + both grip hands ──
  limb(g, shoulder, elbow, 7, look.gi, alpha);
  limb(g, elbow, { x: hand.x - facing * 2, y: hand.y }, 6, look.gi, alpha);
  g.fillStyle(o, alpha);
  g.fillCircle(hand.x, hand.y + 1, 3);
  g.fillCircle(hand.x - bux * 7, hand.y - buy * 7 + 1, 3);
  g.lineStyle(0, 0, 0);
}
