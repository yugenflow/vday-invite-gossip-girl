import * as THREE from 'three';
import { makeBox, makeTextCanvas } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createUESPosters() {
  const posters = [];

  // Audrey Hepburn poster (simple framed text poster)
  const audrey = createFramedPoster(
    'Breakfast\nat\nTiffany\'s',
    0.8, 1.0, '#1a1a2a', '#F0E0C0', 'italic 36px Georgia'
  );
  posters.push(audrey);

  // GG quote frame
  const ggQuote = createFramedPoster(
    'You know\nyou love me.\nXOXO,\nGossip Girl',
    0.7, 0.9, '#2a1a2a', '#FFD700', 'italic 28px Georgia'
  );
  posters.push(ggQuote);

  // Fashion illustration (abstract)
  const fashion = createFramedPoster(
    'VOGUE',
    0.6, 0.8, '#0a0a0a', '#F5F5F5', 'bold 44px Georgia'
  );
  posters.push(fashion);

  return posters;
}

function createFramedPoster(text, w, h, bgColor, textColor, font) {
  const group = new THREE.Group();

  // Gold frame
  const frame = makeBox(w + 0.06, h + 0.06, 0.03, COLORS.PAINTING_FRAME);
  group.add(frame);

  // Canvas with text
  const canvas = makeTextCanvas(text, 512, Math.round(512 * (h / w)), font || 'bold 36px Georgia', textColor || '#fff', bgColor || '#333');
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.z = 0.02;
  group.add(mesh);

  return group;
}
