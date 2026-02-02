import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createDesk() {
  const group = new THREE.Group();

  // Desktop surface
  const top = makeBox(1.6, 0.06, 0.7, COLORS.DESK_WOOD);
  top.position.set(0, 0.75, 0);
  group.add(top);

  // Legs
  const legGeo = new THREE.BoxGeometry(0.06, 0.75, 0.06);
  const legMat = new THREE.MeshLambertMaterial({ color: COLORS.DESK_WOOD, flatShading: true });
  [[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.375, z);
    group.add(leg);
  });

  // Laptop-ish item on desk
  const laptopBase = makeBox(0.4, 0.02, 0.3, 0x333333);
  laptopBase.position.set(-0.3, 0.8, 0);
  group.add(laptopBase);
  const laptopScreen = makeBox(0.38, 0.25, 0.015, 0x222222);
  laptopScreen.position.set(-0.3, 0.93, -0.14);
  laptopScreen.rotation.x = -0.2;
  group.add(laptopScreen);

  // Mug
  const mug = makeCylinder(0.04, 0.04, 0.1, 8, 0xCC8844);
  mug.position.set(0.4, 0.83, 0.1);
  group.add(mug);

  // Small book stack
  const book1 = makeBox(0.2, 0.04, 0.15, 0x8844AA);
  book1.position.set(0.5, 0.8, -0.15);
  group.add(book1);
  const book2 = makeBox(0.18, 0.03, 0.14, 0x44AA88);
  book2.position.set(0.5, 0.835, -0.15);
  group.add(book2);

  return group;
}
