import * as THREE from 'three';
import { COLORS } from '../constants.js';

export function createFairyLights(start, end, numLights = 12, droop = 0.3) {
  const group = new THREE.Group();

  // Wire
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t - Math.sin(t * Math.PI) * droop;
    const z = start.z + (end.z - start.z) * t;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const wireGeo = new THREE.TubeGeometry(curve, 20, 0.005, 4, false);
  const wireMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  group.add(new THREE.Mesh(wireGeo, wireMat));

  // Light bulbs
  const bulbColors = [0xFFE4B5, 0xFFD700, 0xFFA07A, 0xFFB6C1, 0xFFE4B5];
  const bulbGeo = new THREE.SphereGeometry(0.02, 4, 4);
  for (let i = 0; i < numLights; i++) {
    const t = (i + 0.5) / numLights;
    const pos = curve.getPoint(t);
    const color = bulbColors[i % bulbColors.length];
    const bulbMat = new THREE.MeshLambertMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.copy(pos);
    bulb.position.y -= 0.03;
    group.add(bulb);
  }

  return group;
}

export function createCelebrationFairyLights(start, end, numLights = 15) {
  const group = new THREE.Group();

  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t - Math.sin(t * Math.PI) * 0.4;
    const z = start.z + (end.z - start.z) * t;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const wireGeo = new THREE.TubeGeometry(curve, 20, 0.005, 4, false);
  const wireMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
  group.add(new THREE.Mesh(wireGeo, wireMat));

  const heartColors = [0xFF2255, 0xFF69B4, 0xFFB6C1, 0xFF1493];
  const bulbGeo = new THREE.SphereGeometry(0.025, 4, 4);
  for (let i = 0; i < numLights; i++) {
    const t = (i + 0.5) / numLights;
    const pos = curve.getPoint(t);
    const color = heartColors[i % heartColors.length];
    const mat = new THREE.MeshLambertMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.6,
    });
    const bulb = new THREE.Mesh(bulbGeo, mat);
    bulb.position.copy(pos);
    bulb.position.y -= 0.03;
    group.add(bulb);
  }

  return group;
}
