import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

export function createGuidelinesClipboard() {
  const group = new THREE.Group();

  // Clipboard board
  const board = makeBox(0.35, 0.5, 0.02, 0x8B6914);
  group.add(board);

  // Clip at top
  const clip = makeBox(0.1, 0.04, 0.03, 0x888888);
  clip.position.set(0, 0.27, 0.01);
  group.add(clip);

  // Paper
  const paper = makeBox(0.3, 0.42, 0.005, 0xFFF8DC);
  paper.position.set(0, -0.02, 0.015);
  group.add(paper);

  // Text lines (decorative)
  const lineMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  for (let i = 0; i < 8; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.005, 0.001),
      lineMat
    );
    line.position.set(0, 0.15 - i * 0.05, 0.02);
    group.add(line);
  }

  group.userData.interactable = true;
  group.userData.interactionType = 'guidelines';
  group.userData.promptText = 'Press E to read range guidelines';

  return group;
}
