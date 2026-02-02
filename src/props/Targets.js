import * as THREE from 'three';
import { makeBox, makeCylinder, makeTextCanvas } from '../utils/LowPolyHelpers.js';
import { COLORS, TARGETS } from '../constants.js';

function createTargetBase(text, color, textColor) {
  const group = new THREE.Group();

  // Post
  const post = makeCylinder(0.03, 0.03, 1.5, 6, 0x666666);
  post.position.y = 0.75;
  group.add(post);

  // Target board
  const board = makeBox(0.8, 0.8, 0.05, COLORS.TARGET_BOARD);
  board.position.y = 1.65;
  group.add(board);

  // Colored face with text
  const canvas = makeTextCanvas(text, 256, 256, 'bold 80px Georgia', textColor || '#fff', colorToCSS(color));
  const texture = new THREE.CanvasTexture(canvas);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.7),
    new THREE.MeshLambertMaterial({ map: texture })
  );
  face.position.set(0, 1.65, 0.03);
  group.add(face);

  // Back face
  const backFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.7),
    new THREE.MeshLambertMaterial({ color })
  );
  backFace.position.set(0, 1.65, -0.03);
  backFace.rotation.y = Math.PI;
  group.add(backFace);

  return group;
}

function colorToCSS(hex) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgb(${r},${g},${b})`;
}

export function createYesTarget() {
  const group = createTargetBase('YES', COLORS.TARGET_YES, '#ffffff');
  group.userData.targetType = 'yes';
  group.userData.hittable = true;

  // Add glow effect (emissive ring)
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.48, 16),
    new THREE.MeshLambertMaterial({
      color: 0x66FF66,
      emissive: 0x33AA33,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
    })
  );
  ring.position.set(0, 1.65, 0.04);
  group.add(ring);
  group.userData.ring = ring;

  return group;
}

export function createNoTarget() {
  const group = createTargetBase('NO', COLORS.TARGET_NO, '#ffffff');
  group.userData.targetType = 'no';
  group.userData.hittable = true;
  group.userData.isDodging = false;
  group.userData.dodgeTimer = 0;
  group.userData.dodgeDirection = 0;
  group.userData.originalX = 0;
  group.userData.bubbleSprite = null;
  return group;
}

export function createTargets(rangeOriginZ) {
  const targets = [];
  const zBase = rangeOriginZ - TARGETS.DISTANCE;

  // Yes targets (2)
  for (let i = 0; i < TARGETS.YES_COUNT; i++) {
    const t = createYesTarget();
    const x = (i - (TARGETS.YES_COUNT - 1) / 2) * 2;
    t.position.set(x, 0, zBase);
    t.userData.originalX = x;
    targets.push(t);
  }

  // No targets (4)
  for (let i = 0; i < TARGETS.NO_COUNT; i++) {
    const t = createNoTarget();
    const x = (i - (TARGETS.NO_COUNT - 1) / 2) * 1.5;
    const z = zBase + (i % 2 === 0 ? 0 : 1.5);
    t.position.set(x, 0, z);
    t.userData.originalX = x;
    targets.push(t);
  }

  return targets;
}
