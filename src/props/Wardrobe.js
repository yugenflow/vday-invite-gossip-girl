import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

const WOOD = 0x6B4226;
const WOOD_DARK = 0x5A3520;
const HANDLE = 0xC0A060;

export function createWardrobe() {
  const group = new THREE.Group();

  // Main body (back + sides + top + bottom)
  const body = makeBox(1.2, 2.2, 0.55, WOOD);
  body.position.set(0, 1.1, 0);
  group.add(body);

  // Top trim
  const topTrim = makeBox(1.3, 0.06, 0.6, WOOD_DARK);
  topTrim.position.set(0, 2.23, 0);
  group.add(topTrim);

  // Left door
  const leftDoor = makeBox(0.56, 2.05, 0.04, WOOD_DARK);
  leftDoor.position.set(-0.29, 1.08, 0.28);
  group.add(leftDoor);

  // Right door
  const rightDoor = makeBox(0.56, 2.05, 0.04, WOOD_DARK);
  rightDoor.position.set(0.29, 1.08, 0.28);
  group.add(rightDoor);

  // Left handle
  const handleL = makeBox(0.03, 0.15, 0.04, HANDLE);
  handleL.position.set(-0.08, 1.1, 0.32);
  group.add(handleL);

  // Right handle
  const handleR = makeBox(0.03, 0.15, 0.04, HANDLE);
  handleR.position.set(0.08, 1.1, 0.32);
  group.add(handleR);

  // Center line between doors
  const centerLine = makeBox(0.02, 2.05, 0.05, WOOD_DARK);
  centerLine.position.set(0, 1.08, 0.29);
  group.add(centerLine);

  // Base plinth
  const plinth = makeBox(1.24, 0.08, 0.58, WOOD_DARK);
  plinth.position.set(0, 0.04, 0);
  group.add(plinth);

  return group;
}
