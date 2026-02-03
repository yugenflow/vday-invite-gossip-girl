import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createHeadbands() {
  const group = new THREE.Group();

  // Small stand/display
  const stand = makeBox(0.3, 0.25, 0.15, COLORS.VANITY_WHITE);
  stand.position.set(0, 0.125, 0);
  group.add(stand);

  // Stand pole
  const pole = makeBox(0.02, 0.2, 0.02, COLORS.ACCENT_GOLD);
  pole.position.set(0, 0.35, 0);
  group.add(pole);

  // Headband 1 (navy satin) — arc shape approximated with tilted box
  const hb1 = makeBox(0.18, 0.02, 0.04, COLORS.HEADBAND_SATIN);
  hb1.position.set(0, 0.45, 0);
  hb1.rotation.z = 0.1;
  group.add(hb1);

  // Headband 2 (burgundy velvet)
  const hb2 = makeBox(0.18, 0.02, 0.04, COLORS.HEADBAND_VELVET);
  hb2.position.set(0, 0.4, 0.03);
  hb2.rotation.z = -0.05;
  group.add(hb2);

  // Headband 3 (pearl)
  const hb3 = makeBox(0.18, 0.02, 0.04, COLORS.HEADBAND_PEARL);
  hb3.position.set(0, 0.35, 0.06);
  group.add(hb3);
  // Pearl dots
  for (let i = -3; i <= 3; i++) {
    const pearl = makeSphere(0.01, 4, 4, 0xFFFFF0);
    pearl.position.set(i * 0.025, 0.36, 0.08);
    group.add(pearl);
  }

  return group;
}
