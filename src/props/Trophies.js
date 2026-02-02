import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createTrophy(isGold = true) {
  const group = new THREE.Group();
  const color = isGold ? COLORS.TROPHY_GOLD : COLORS.TROPHY_SILVER;

  // Base
  const base = makeCylinder(0.06, 0.07, 0.04, 8, color);
  base.position.y = 0.02;
  group.add(base);

  // Stem
  const stem = makeCylinder(0.02, 0.02, 0.1, 6, color);
  stem.position.y = 0.09;
  group.add(stem);

  // Cup
  const cup = makeCylinder(0.06, 0.03, 0.08, 8, color);
  cup.position.y = 0.18;
  group.add(cup);

  // Handles
  [-1, 1].forEach(side => {
    const handle = makeBox(0.015, 0.04, 0.015, color);
    handle.position.set(side * 0.07, 0.17, 0);
    group.add(handle);
  });

  return group;
}

export function createMedal() {
  const group = new THREE.Group();

  // Ribbon
  const ribbon = makeBox(0.04, 0.08, 0.005, COLORS.JACKET_RED);
  ribbon.position.y = 0.04;
  group.add(ribbon);

  // Medal disc
  const disc = makeCylinder(0.03, 0.03, 0.005, 8, COLORS.TROPHY_GOLD);
  disc.rotation.x = Math.PI / 2;
  disc.position.y = -0.01;
  group.add(disc);

  return group;
}
