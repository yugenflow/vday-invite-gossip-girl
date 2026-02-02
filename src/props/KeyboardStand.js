import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createKeyboardStand() {
  const group = new THREE.Group();

  // X-frame stand legs
  const legMat = new THREE.MeshLambertMaterial({ color: COLORS.KEYBOARD_STAND, flatShading: true });
  const legGeo = new THREE.BoxGeometry(0.03, 0.7, 0.03);

  // Front legs
  const fl = new THREE.Mesh(legGeo, legMat);
  fl.position.set(-0.35, 0.35, 0.15);
  fl.rotation.z = 0.1;
  group.add(fl);
  const fr = new THREE.Mesh(legGeo, legMat);
  fr.position.set(0.35, 0.35, 0.15);
  fr.rotation.z = -0.1;
  group.add(fr);

  // Back legs
  const bl = new THREE.Mesh(legGeo, legMat);
  bl.position.set(-0.35, 0.35, -0.15);
  bl.rotation.z = 0.1;
  group.add(bl);
  const br = new THREE.Mesh(legGeo, legMat);
  br.position.set(0.35, 0.35, -0.15);
  br.rotation.z = -0.1;
  group.add(br);

  // Keyboard body
  const body = makeBox(1.0, 0.06, 0.25, COLORS.KEYBOARD_BLACK);
  body.position.set(0, 0.72, 0);
  group.add(body);

  // White keys
  for (let i = 0; i < 14; i++) {
    const key = makeBox(0.06, 0.02, 0.14, COLORS.KEYBOARD_WHITE);
    key.position.set(-0.42 + i * 0.065, 0.79, 0.03);
    group.add(key);
  }

  // Black keys pattern
  const blackPattern = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1];
  blackPattern.forEach((has, i) => {
    if (has) {
      const bk = makeBox(0.035, 0.03, 0.08, COLORS.KEYBOARD_BLACK);
      bk.position.set(-0.39 + i * 0.065, 0.81, -0.02);
      group.add(bk);
    }
  });

  return group;
}
