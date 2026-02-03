import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createPinkBunny() {
  const group = new THREE.Group();

  // Body
  const body = makeSphere(0.12, 6, 6, COLORS.SOFT_TOY_PINK);
  body.position.y = 0.12;
  group.add(body);

  // Head
  const head = makeSphere(0.09, 6, 6, COLORS.SOFT_TOY_PINK);
  head.position.set(0, 0.26, 0);
  group.add(head);

  // Ears
  for (const x of [-0.03, 0.03]) {
    const ear = makeBox(0.03, 0.12, 0.02, COLORS.SOFT_TOY_PINK);
    ear.position.set(x, 0.38, -0.01);
    ear.rotation.z = x > 0 ? -0.15 : 0.15;
    group.add(ear);
    // Inner ear
    const inner = makeBox(0.015, 0.08, 0.01, 0xFFDDDD);
    inner.position.set(x, 0.38, 0.005);
    inner.rotation.z = x > 0 ? -0.15 : 0.15;
    group.add(inner);
  }

  // Eyes
  for (const x of [-0.03, 0.03]) {
    const eye = makeSphere(0.012, 4, 4, 0x111111);
    eye.position.set(x, 0.28, 0.08);
    group.add(eye);
  }

  // Nose
  const nose = makeSphere(0.008, 4, 4, 0xFF8888);
  nose.position.set(0, 0.26, 0.09);
  group.add(nose);

  return group;
}

export function createJerryMouse() {
  const group = new THREE.Group();

  // Body
  const body = makeSphere(0.1, 6, 6, COLORS.SOFT_TOY_BROWN);
  body.position.y = 0.1;
  group.add(body);

  // Head
  const head = makeSphere(0.08, 6, 6, COLORS.SOFT_TOY_BROWN);
  head.position.set(0, 0.22, 0);
  group.add(head);

  // Ears (big round)
  for (const x of [-0.06, 0.06]) {
    const ear = makeSphere(0.04, 6, 6, COLORS.SOFT_TOY_BROWN);
    ear.position.set(x, 0.3, -0.02);
    group.add(ear);
    const innerEar = makeSphere(0.025, 4, 4, 0xDEB887);
    innerEar.position.set(x, 0.3, 0.005);
    group.add(innerEar);
  }

  // Eyes
  for (const x of [-0.025, 0.025]) {
    const eye = makeSphere(0.012, 4, 4, 0x111111);
    eye.position.set(x, 0.24, 0.07);
    group.add(eye);
  }

  // Nose
  const nose = makeSphere(0.01, 4, 4, 0x111111);
  nose.position.set(0, 0.21, 0.08);
  group.add(nose);

  // Tail
  const tail = makeBox(0.01, 0.01, 0.15, COLORS.SOFT_TOY_BROWN);
  tail.position.set(0, 0.05, -0.12);
  tail.rotation.x = 0.3;
  group.add(tail);

  return group;
}
