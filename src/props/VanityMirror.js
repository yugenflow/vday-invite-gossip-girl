import * as THREE from 'three';
import { makeBox, makeSphere, makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createVanityMirror() {
  const group = new THREE.Group();

  // Table base
  const table = makeBox(1.2, 0.04, 0.5, COLORS.VANITY_WHITE);
  table.position.set(0, 0.75, 0);
  group.add(table);

  // Legs
  for (const x of [-0.55, 0.55]) {
    for (const z of [-0.2, 0.2]) {
      const leg = makeBox(0.04, 0.75, 0.04, COLORS.VANITY_WHITE);
      leg.position.set(x, 0.375, z);
      group.add(leg);
    }
  }

  // Mirror backing
  const mirrorBack = makeBox(1.0, 0.8, 0.04, COLORS.VANITY_WHITE);
  mirrorBack.position.set(0, 1.2, -0.22);
  group.add(mirrorBack);

  // Mirror glass
  const mirrorGlass = makeBox(0.9, 0.7, 0.02, COLORS.VANITY_MIRROR);
  mirrorGlass.position.set(0, 1.2, -0.19);
  group.add(mirrorGlass);

  // Hollywood light bulbs along top and sides
  const bulbGeo = new THREE.SphereGeometry(0.03, 6, 6);
  const bulbPositions = [];
  // Top row
  for (let i = -4; i <= 4; i++) {
    bulbPositions.push([i * 0.1, 1.65, -0.18]);
  }
  // Left column
  for (let i = 0; i < 5; i++) {
    bulbPositions.push([-0.5, 1.6 - i * 0.12, -0.18]);
  }
  // Right column
  for (let i = 0; i < 5; i++) {
    bulbPositions.push([0.5, 1.6 - i * 0.12, -0.18]);
  }

  bulbPositions.forEach(([x, y, z]) => {
    const bulbMat = new THREE.MeshLambertMaterial({
      color: COLORS.VANITY_BULB,
      emissive: COLORS.VANITY_BULB,
      emissiveIntensity: 0.5,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(x, y, z);
    group.add(bulb);
  });

  // Warm vanity light
  const vanityLight = new THREE.PointLight(0xFFE4C4, 0.4, 4);
  vanityLight.position.set(0, 1.3, 0.1);
  group.add(vanityLight);

  // Small items on table (perfume bottle, makeup)
  const perfume = makeCylinder(0.03, 0.03, 0.1, 6, 0xE8D0E0);
  perfume.position.set(-0.3, 0.82, 0.05);
  group.add(perfume);
  const perfumeCap = makeSphere(0.03, 4, 4, COLORS.ACCENT_GOLD);
  perfumeCap.position.set(-0.3, 0.89, 0.05);
  group.add(perfumeCap);

  // Lipstick
  const lipstick = makeCylinder(0.015, 0.015, 0.08, 6, 0xCC2244);
  lipstick.position.set(-0.15, 0.81, 0.1);
  lipstick.rotation.z = 0.3;
  group.add(lipstick);

  return group;
}
