import * as THREE from 'three';

export function makeMesh(geometry, color, opts = {}) {
  const mat = new THREE.MeshLambertMaterial({
    color,
    flatShading: true,
    ...opts,
  });
  return new THREE.Mesh(geometry, mat);
}

export function makeBox(w, h, d, color, opts) {
  return makeMesh(new THREE.BoxGeometry(w, h, d), color, opts);
}

export function makeCylinder(rTop, rBot, h, segs, color, opts) {
  return makeMesh(new THREE.CylinderGeometry(rTop, rBot, h, segs), color, opts);
}

export function makeSphere(r, wSegs, hSegs, color, opts) {
  return makeMesh(new THREE.SphereGeometry(r, wSegs, hSegs), color, opts);
}

export function makeTextCanvas(text, width, height, font, color, bgColor) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.fillStyle = color || '#fff';
  ctx.font = font || 'bold 48px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  const maxWidth = width - 40;
  for (const word of words) {
    const test = currentLine ? currentLine + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = parseInt(font || '48', 10) * 1.3 || 60;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  return canvas;
}

export function makeTextSprite(text, opts = {}) {
  const canvas = makeTextCanvas(
    text,
    opts.width || 512,
    opts.height || 128,
    opts.font || 'bold 48px Georgia',
    opts.color || '#fff',
    opts.bgColor || 'transparent'
  );
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(opts.scaleX || 2, opts.scaleY || 0.5, 1);
  return sprite;
}
