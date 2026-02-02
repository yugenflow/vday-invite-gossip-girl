import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createLamp() {
  const group = new THREE.Group();

  // Base
  const base = makeCylinder(0.08, 0.1, 0.03, 8, COLORS.LAMP_BASE);
  base.position.y = 0.015;
  group.add(base);

  // Stem
  const stem = makeCylinder(0.015, 0.015, 0.3, 6, COLORS.LAMP_BASE);
  stem.position.y = 0.18;
  group.add(stem);

  // Shade (cone-ish)
  const shade = makeCylinder(0.03, 0.12, 0.15, 8, COLORS.LAMP_SHADE, {
    transparent: true,
    opacity: 0.85,
  });
  shade.position.y = 0.4;
  group.add(shade);

  // Point light inside
  const light = new THREE.PointLight(0xFFE4B5, 0.8, 5);
  light.position.y = 0.38;
  group.add(light);

  return group;
}
