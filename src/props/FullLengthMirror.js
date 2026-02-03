import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

export function createFullLengthMirror() {
  const group = new THREE.Group();

  // Frame (gold)
  const frameMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });

  // Vertical frame pieces
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 0.06), frameMat);
  frameL.position.set(-0.35, 0.95, 0);
  group.add(frameL);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 0.06), frameMat);
  frameR.position.set(0.35, 0.95, 0);
  group.add(frameR);

  // Top and bottom
  const frameT = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.06), frameMat);
  frameT.position.set(0, 1.85, 0);
  group.add(frameT);
  const frameB = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.06), frameMat);
  frameB.position.set(0, 0.05, 0);
  group.add(frameB);

  // Decorative arch at top
  const arch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.06), frameMat);
  arch.position.set(0, 1.9, 0);
  group.add(arch);

  // Mirror surface (reflective look)
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xC8D8E8,
    roughness: 0.05,
    metalness: 0.85,
    flatShading: true,
  });
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 1.75), mirrorMat);
  mirror.position.set(0, 0.95, 0.02);
  group.add(mirror);

  // Subtle highlight to give it that mirror sheen
  const highlight = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 1.2),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.08 })
  );
  highlight.position.set(-0.15, 1.0, 0.025);
  group.add(highlight);

  return group;
}
