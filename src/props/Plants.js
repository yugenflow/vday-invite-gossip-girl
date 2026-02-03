import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';

// Tall fiddle leaf fig style plant
export function createTallPlant() {
  const group = new THREE.Group();

  // Pot
  const potMat = new THREE.MeshLambertMaterial({ color: 0xF5E6D8, flatShading: true });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.25, 8), potMat);
  pot.position.set(0, 0.125, 0);
  group.add(pot);

  // Pot rim
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 8), potMat);
  rim.position.set(0, 0.25, 0);
  group.add(rim);

  // Soil
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.02, 8),
    new THREE.MeshLambertMaterial({ color: 0x3B2A1A, flatShading: true })
  );
  soil.position.set(0, 0.26, 0);
  group.add(soil);

  // Stem
  const stemMat = new THREE.MeshLambertMaterial({ color: 0x4A6B3A, flatShading: true });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.7, 6), stemMat);
  stem.position.set(0, 0.6, 0);
  group.add(stem);

  // Large leaves at different heights
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2D5A1E, flatShading: true });
  const leafPositions = [
    { y: 0.5, rx: 0.4, ry: 0, s: 0.8 },
    { y: 0.6, rx: -0.3, ry: 1.5, s: 0.9 },
    { y: 0.7, rx: 0.35, ry: 3.0, s: 1.0 },
    { y: 0.8, rx: -0.25, ry: 4.5, s: 0.9 },
    { y: 0.9, rx: 0.3, ry: 0.8, s: 0.85 },
    { y: 0.95, rx: -0.2, ry: 2.2, s: 0.7 },
  ];

  leafPositions.forEach(lp => {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.12 * lp.s, 6, 4),
      leafMat
    );
    leaf.scale.set(1, 0.3, 1.8);
    leaf.position.set(Math.sin(lp.ry) * 0.08, lp.y, Math.cos(lp.ry) * 0.08);
    leaf.rotation.set(lp.rx, lp.ry, 0);
    group.add(leaf);
  });

  return group;
}

// Small succulent / desk plant
export function createSmallPlant() {
  const group = new THREE.Group();

  // Small decorative pot (gold accent)
  const potMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.1, 8), potMat);
  pot.position.set(0, 0.05, 0);
  group.add(pot);

  // Soil
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.015, 8),
    new THREE.MeshLambertMaterial({ color: 0x3B2A1A, flatShading: true })
  );
  soil.position.set(0, 0.105, 0);
  group.add(soil);

  // Succulent rosette (layered green spheres)
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x5A8A4A, flatShading: true });
  const innerMat = new THREE.MeshLambertMaterial({ color: 0x7AAA6A, flatShading: true });

  // Outer ring
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), leafMat);
    leaf.scale.set(1.2, 0.5, 1);
    leaf.position.set(Math.cos(angle) * 0.04, 0.13, Math.sin(angle) * 0.04);
    leaf.rotation.set(0, angle, 0.3);
    group.add(leaf);
  }

  // Inner cluster
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + 0.4;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), innerMat);
    leaf.scale.set(1, 0.6, 1);
    leaf.position.set(Math.cos(angle) * 0.02, 0.15, Math.sin(angle) * 0.02);
    group.add(leaf);
  }

  return group;
}
