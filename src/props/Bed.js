import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createBed() {
  const group = new THREE.Group();

  // Frame
  const frame = makeBox(2, 0.3, 1.8, COLORS.BED_FRAME);
  frame.position.set(0, 0.35, 0);
  group.add(frame);

  // Legs (4)
  const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 6);
  const legMat = new THREE.MeshLambertMaterial({ color: COLORS.BED_FRAME, flatShading: true });
  [[-0.9, -0.8], [0.9, -0.8], [-0.9, 0.8], [0.9, 0.8]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.1, z);
    group.add(leg);
  });

  // Mattress
  const mattress = makeBox(1.9, 0.2, 1.7, COLORS.BED_SHEET);
  mattress.position.set(0, 0.6, 0);
  group.add(mattress);

  // Headboard
  const headboard = makeBox(2, 0.8, 0.1, COLORS.BED_FRAME);
  headboard.position.set(0, 0.9, -0.9);
  group.add(headboard);

  // Pillow
  const pillow = makeBox(0.6, 0.12, 0.35, COLORS.PILLOW);
  pillow.position.set(-0.3, 0.78, -0.6);
  group.add(pillow);
  const pillow2 = makeBox(0.6, 0.12, 0.35, COLORS.PILLOW);
  pillow2.position.set(0.3, 0.78, -0.6);
  group.add(pillow2);

  // Blanket (slightly draped)
  const blanket = makeBox(1.8, 0.08, 1.0, COLORS.BLANKET);
  blanket.position.set(0, 0.75, 0.2);
  blanket.rotation.x = 0.05;
  group.add(blanket);

  return group;
}
