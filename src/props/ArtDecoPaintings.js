import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

// Canvas-rendered paintings inspired by famous artists
export function createArtDecoPaintings() {
  return [
    createKlimtInspired(0.9, 1.2),
    createMonetInspired(0.7, 0.9),
    createVanGoghInspired(0.6, 0.8),
    createModernAbstract(0.8, 0.6),
  ];
}

function createGoldFrame(w, h) {
  const group = new THREE.Group();
  const t = 0.04;
  const d = 0.04;
  const mat = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
  group.add(new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, d), mat).translateY(h / 2 + t / 2));
  group.add(new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, d), mat).translateY(-h / 2 - t / 2));
  const left = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), mat);
  left.position.set(-w / 2 - t / 2, 0, 0);
  group.add(left);
  const right = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), mat);
  right.position.set(w / 2 + t / 2, 0, 0);
  group.add(right);
  return group;
}

function canvasToPlane(canvas, w, h) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.z = 0.015;
  return mesh;
}

// Klimt-inspired — gold patterns, The Kiss style
function createKlimtInspired(w, h) {
  const group = new THREE.Group();
  group.add(createGoldFrame(w, h));

  const cw = 256, ch = Math.round(256 * (h / w));
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // Deep golden background
  const grad = ctx.createLinearGradient(0, 0, cw, ch);
  grad.addColorStop(0, '#B8860B');
  grad.addColorStop(0.5, '#DAA520');
  grad.addColorStop(1, '#B8860B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Abstract figures (two overlapping forms)
  ctx.fillStyle = '#1A1A2A';
  ctx.beginPath();
  ctx.ellipse(cw * 0.4, ch * 0.45, 40, 70, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.ellipse(cw * 0.55, ch * 0.5, 35, 65, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Gold spiral patterns
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    const r = 5 + Math.random() * 12;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 1.5);
    ctx.stroke();
  }

  // Gold dots scattered
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * cw, Math.random() * ch, 1.5 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Triangular mosaic pattern
  ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y + 14);
    ctx.lineTo(x - 8, y + 14);
    ctx.fill();
  }

  group.add(canvasToPlane(canvas, w, h));
  return group;
}

// Monet-inspired — water lilies / impressionist
function createMonetInspired(w, h) {
  const group = new THREE.Group();
  group.add(createGoldFrame(w, h));

  const cw = 256, ch = Math.round(256 * (h / w));
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // Blue-green water background
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#2E5B88');
  grad.addColorStop(0.3, '#3A7CA5');
  grad.addColorStop(0.6, '#2A6B5E');
  grad.addColorStop(1, '#1A4040');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Impressionist brush strokes (short dashes)
  const strokeColors = ['#4A8BAA', '#5B9BBB', '#3A7B6A', '#6BAACC', '#2A6A5A'];
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = strokeColors[Math.floor(Math.random() * strokeColors.length)];
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillRect(-8, -2, 16, 4);
    ctx.restore();
  }

  // Water lily pads (green ellipses)
  const padColors = ['#2A5A3A', '#3A6A4A', '#1A4A2A'];
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = padColors[i % padColors.length];
    ctx.beginPath();
    ctx.ellipse(40 + Math.random() * (cw - 80), ch * 0.4 + Math.random() * (ch * 0.4), 15 + Math.random() * 12, 8 + Math.random() * 6, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  // Water lily flowers (pink/white blobs)
  const flowerColors = ['#FFB6C1', '#FF69B4', '#FFF0F5', '#FF1493'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = flowerColors[i];
    const fx = 50 + Math.random() * (cw - 100);
    const fy = ch * 0.35 + Math.random() * (ch * 0.35);
    for (let p = 0; p < 5; p++) {
      ctx.beginPath();
      const angle = (p / 5) * Math.PI * 2;
      ctx.ellipse(fx + Math.cos(angle) * 5, fy + Math.sin(angle) * 5, 4, 6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Light reflections
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * cw, Math.random() * ch * 0.4, 3 + Math.random() * 8, 1 + Math.random() * 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  group.add(canvasToPlane(canvas, w, h));
  return group;
}

// Van Gogh-inspired — Starry Night style
function createVanGoghInspired(w, h) {
  const group = new THREE.Group();
  group.add(createGoldFrame(w, h));

  const cw = 256, ch = Math.round(256 * (h / w));
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // Night sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#0A1628');
  grad.addColorStop(0.6, '#1A2A4A');
  grad.addColorStop(1, '#2A3A1A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);

  // Swirling strokes (Van Gogh style)
  const swirls = ['#3A5A9A', '#4A6AAA', '#2A4A8A', '#5A7ABB'];
  for (let i = 0; i < 80; i++) {
    ctx.strokeStyle = swirls[Math.floor(Math.random() * swirls.length)];
    ctx.lineWidth = 2 + Math.random() * 2;
    const cx = Math.random() * cw;
    const cy = Math.random() * ch * 0.65;
    const r = 8 + Math.random() * 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.random() * Math.PI, Math.random() * Math.PI + Math.PI);
    ctx.stroke();
  }

  // Stars (bright yellow dots with glow)
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 8; i++) {
    const sx = 20 + Math.random() * (cw - 40);
    const sy = 10 + Math.random() * (ch * 0.45);
    // Glow
    const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
    glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(sx - 12, sy - 12, 24, 24);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon (large crescent)
  ctx.fillStyle = '#FFF8DC';
  ctx.beginPath();
  ctx.arc(cw * 0.75, ch * 0.2, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1A2A4A';
  ctx.beginPath();
  ctx.arc(cw * 0.75 + 6, ch * 0.2 - 3, 15, 0, Math.PI * 2);
  ctx.fill();

  // Village silhouette at bottom
  ctx.fillStyle = '#1A2A1A';
  const buildings = [
    [10, 25], [35, 18], [55, 30], [80, 15], [100, 22],
    [120, 35], [145, 20], [165, 28], [190, 15], [210, 25], [235, 20],
  ];
  buildings.forEach(([x, bh]) => {
    ctx.fillRect(x, ch - bh, 18, bh);
  });

  // Cypress tree
  ctx.fillStyle = '#0A1A0A';
  ctx.beginPath();
  ctx.moveTo(30, ch);
  ctx.lineTo(35, ch * 0.35);
  ctx.lineTo(40, ch);
  ctx.fill();

  group.add(canvasToPlane(canvas, w, h));
  return group;
}

// Modern abstract with bold colors
function createModernAbstract(w, h) {
  const group = new THREE.Group();
  group.add(createGoldFrame(w, h));

  const cw = 256, ch = Math.round(256 * (h / w));
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FFFFF0';
  ctx.fillRect(0, 0, cw, ch);

  // Bold color blocks (Mondrian-like)
  ctx.fillStyle = '#CC0000';
  ctx.fillRect(10, 10, 90, 80);

  ctx.fillStyle = '#0033AA';
  ctx.fillRect(120, 60, 70, 110);

  ctx.fillStyle = '#FFD700';
  ctx.fillRect(200, 10, 46, 60);

  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(10, 110, 100, 55);

  // Black grid lines
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(108, 0); ctx.lineTo(108, ch);
  ctx.moveTo(198, 0); ctx.lineTo(198, ch);
  ctx.moveTo(0, 98); ctx.lineTo(cw, 98);
  ctx.moveTo(0, ch * 0.65); ctx.lineTo(cw, ch * 0.65);
  ctx.stroke();

  group.add(canvasToPlane(canvas, w, h));
  return group;
}
