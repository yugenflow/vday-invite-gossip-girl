import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function createPainting(width, height, canvasColors) {
  const group = new THREE.Group();

  // Frame
  const frame = makeBox(width + 0.06, height + 0.06, 0.03, COLORS.PAINTING_FRAME);
  group.add(frame);

  // Canvas with abstract art
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = canvasColors[0];
  ctx.fillRect(0, 0, 128, 128);

  // Abstract shapes
  canvasColors.slice(1).forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(30 + i * 35, 40 + i * 20, 20 + i * 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  const paintingMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.02, height - 0.02),
    new THREE.MeshLambertMaterial({ map: texture })
  );
  paintingMesh.position.z = 0.02;
  group.add(paintingMesh);

  return group;
}

export function createPaintings() {
  const paintings = [];

  paintings.push(createPainting(0.6, 0.5, ['#2a3a5c', '#ff6b6b', '#ffd93d', '#6bcb77']));
  paintings.push(createPainting(0.5, 0.7, ['#3d1c0a', '#e8a87c', '#d8b5ff', '#1b4332']));
  paintings.push(createPainting(0.7, 0.5, ['#1a1a2e', '#e94560', '#0f3460', '#16213e']));

  return paintings;
}
