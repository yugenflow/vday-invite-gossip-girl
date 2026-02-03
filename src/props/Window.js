import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createNYCWindow(w, h) {
  const group = new THREE.Group();
  w = w || 2.0;
  h = h || 1.8;

  // Window frame (gold/brass)
  const frameColor = COLORS.ACCENT_GOLD;
  const frameMat = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.3,
    metalness: 0.6,
  });
  const frameThick = 0.05;
  const frameDepth = 0.08;

  // Outer frame
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + frameThick * 2, frameThick, frameDepth), frameMat);
  top.position.set(0, h / 2 + frameThick / 2, 0);
  group.add(top);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w + frameThick * 2, frameThick, frameDepth), frameMat);
  bottom.position.set(0, -h / 2 - frameThick / 2, 0);
  group.add(bottom);
  const left = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, frameDepth), frameMat);
  left.position.set(-w / 2 - frameThick / 2, 0, 0);
  group.add(left);
  const right = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, frameDepth), frameMat);
  right.position.set(w / 2 + frameThick / 2, 0, 0);
  group.add(right);

  // Center vertical divider
  const divV = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, frameDepth), frameMat);
  group.add(divV);

  // Center horizontal divider
  const divH = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, frameDepth), frameMat);
  divH.position.set(0, h * 0.15, 0);
  group.add(divH);

  // Glass panes — NYC skyline "view" using a canvas texture
  const skyCanvas = createSkylineCanvas(512, 384);
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const glassMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    transparent: false,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
  glass.position.set(0, 0, -0.02);
  group.add(glass);

  // Window sill
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.2, 0.04, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xF5F0EB, roughness: 0.4, metalness: 0.1 })
  );
  sill.position.set(0, -h / 2 - 0.02, 0.06);
  group.add(sill);

  // Sunlight coming in (directional + warm glow)
  const sunLight = new THREE.DirectionalLight(0xFFF8E0, 1.2);
  sunLight.position.set(0, 0.5, 1);
  group.add(sunLight);

  // Warm glow point light for ambient sun feel
  const sunGlow = new THREE.PointLight(0xFFE8C0, 0.6, 8);
  sunGlow.position.set(0, 0, 0.5);
  group.add(sunGlow);

  group.userData.sunLight = sunLight;
  group.userData.sunGlow = sunGlow;

  return group;
}

function createSkylineCanvas(cw, ch) {
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // Sky gradient (warm morning/golden hour)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.7);
  skyGrad.addColorStop(0, '#87CEEB');    // sky blue at top
  skyGrad.addColorStop(0.4, '#B0D4E8');  // lighter
  skyGrad.addColorStop(0.7, '#FFE4C4');  // warm golden at horizon
  skyGrad.addColorStop(1.0, '#FFD4A0');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, cw, ch);

  // Sun glow
  const sunGrad = ctx.createRadialGradient(cw * 0.7, ch * 0.45, 0, cw * 0.7, ch * 0.45, 80);
  sunGrad.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
  sunGrad.addColorStop(1, 'rgba(255, 240, 200, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, cw, ch);

  // NYC Skyline silhouettes (simplified buildings)
  const buildingColor = '#445566';
  const buildings = [
    // x, topY (from bottom), width
    { x: 20, h: 160, w: 40 },    // tall left
    { x: 60, h: 100, w: 35 },
    { x: 95, h: 130, w: 25 },
    { x: 120, h: 200, w: 20 },   // Empire State-like spire
    { x: 140, h: 110, w: 30 },
    { x: 170, h: 90, w: 45 },
    { x: 215, h: 140, w: 25 },
    { x: 240, h: 170, w: 22 },   // Another tall tower
    { x: 262, h: 95, w: 38 },
    { x: 300, h: 120, w: 30 },
    { x: 330, h: 180, w: 18 },   // Spire
    { x: 348, h: 105, w: 42 },
    { x: 390, h: 130, w: 28 },
    { x: 418, h: 80, w: 35 },
    { x: 453, h: 150, w: 22 },
    { x: 475, h: 110, w: 37 },
  ];

  // Draw buildings
  ctx.fillStyle = buildingColor;
  buildings.forEach(b => {
    const baseY = ch * 0.7;
    ctx.fillRect(b.x, baseY - b.h, b.w, b.h + ch * 0.3);
  });

  // Spire on Empire State-like building
  ctx.fillRect(126, ch * 0.7 - 200 - 30, 8, 30);

  // Spire on other tall building
  ctx.fillRect(336, ch * 0.7 - 180 - 25, 6, 25);

  // Windows (small bright dots on buildings)
  ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
  buildings.forEach(b => {
    const baseY = ch * 0.7;
    for (let wy = baseY - b.h + 10; wy < baseY; wy += 12) {
      for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
        if (Math.random() > 0.3) {
          ctx.fillRect(wx, wy, 3, 4);
        }
      }
    }
  });

  // Foreground (bottom portion — tree line / Central Park hint)
  ctx.fillStyle = '#2A5A3A';
  ctx.fillRect(0, ch * 0.82, cw, ch * 0.04);

  // Ground / street level
  ctx.fillStyle = '#888888';
  ctx.fillRect(0, ch * 0.86, cw, ch * 0.14);

  return canvas;
}
