import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createMirror() {
  const group = new THREE.Group();

  // Full-length mirror frame (tall enough to see full body)
  const frame = makeBox(0.8, 2.0, 0.06, COLORS.MIRROR_FRAME);
  group.add(frame);

  // Glass (reflective)
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 1.86, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0xC8D8E8,
      metalness: 0.8,
      roughness: 0.15,
      flatShading: true,
    })
  );
  glass.position.z = 0.025;
  group.add(glass);

  // Subtle highlight strip on glass (fake reflection accent)
  const highlight = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.6, 0.005),
    new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.12,
    })
  );
  highlight.position.set(-0.15, 0, 0.035);
  highlight.rotation.z = 0.05;
  group.add(highlight);

  // Small decorative top detail
  const topCap = makeBox(0.86, 0.06, 0.07, COLORS.MIRROR_FRAME);
  topCap.position.set(0, 1.03, 0);
  group.add(topCap);

  return group;
}
