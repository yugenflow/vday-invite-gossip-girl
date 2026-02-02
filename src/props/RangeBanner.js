import * as THREE from 'three';
import { makeTextCanvas } from '../utils/LowPolyHelpers.js';

export function createRangeBanner(text) {
  const group = new THREE.Group();

  const canvas = makeTextCanvas(text, 1024, 192, 'bold 52px Georgia', '#fff', 'rgba(180,40,80,0.9)');
  const texture = new THREE.CanvasTexture(canvas);

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1.1),
    new THREE.MeshLambertMaterial({ map: texture, transparent: true })
  );
  group.add(banner);

  return group;
}
