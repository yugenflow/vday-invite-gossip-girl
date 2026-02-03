import * as THREE from 'three';
import { makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createMacarons() {
  const group = new THREE.Group();

  // Plate
  const plate = makeCylinder(0.15, 0.15, 0.02, 12, 0xF5F0EB);
  plate.position.y = 0.01;
  group.add(plate);

  const colors = [COLORS.MACARON_PINK, COLORS.MACARON_MINT, COLORS.MACARON_LAVENDER, COLORS.MACARON_YELLOW, COLORS.MACARON_PINK];
  const positions = [
    [0, 0], [-0.06, 0.05], [0.06, 0.05], [-0.03, -0.06], [0.04, -0.04],
  ];

  colors.forEach((color, i) => {
    const [x, z] = positions[i];
    // Top shell
    const top = makeCylinder(0.025, 0.025, 0.015, 8, color);
    top.position.set(x, 0.04, z);
    group.add(top);
    // Filling
    const fill = makeCylinder(0.023, 0.023, 0.005, 8, 0xFFF8F0);
    fill.position.set(x, 0.028, z);
    group.add(fill);
    // Bottom shell
    const bottom = makeCylinder(0.025, 0.025, 0.015, 8, color);
    bottom.position.set(x, 0.018, z);
    group.add(bottom);
  });

  return group;
}
