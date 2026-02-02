import * as THREE from 'three';

export function hexColor(hex) {
  return new THREE.Color(hex);
}

export function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
