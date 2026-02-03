import * as THREE from 'three';
import { makeBox, makeTextCanvas } from '../utils/LowPolyHelpers.js';
import { COLORS, RUNWAY } from '../constants.js';

export function createGossipGirlCard() {
  const group = new THREE.Group();

  // Small stand/podium
  const stand = makeBox(0.3, 0.9, 0.3, 0x222222);
  stand.position.set(0, 0.45, 0);
  group.add(stand);

  // Phone on stand (tilted slightly toward player)
  const phone = makeBox(0.12, 0.22, 0.02, 0x111111);
  phone.position.set(0, 1.05, 0.05);
  phone.rotation.x = -0.3;
  group.add(phone);

  // Screen (glowing)
  const screenCanvas = makeTextCanvas('GG', 128, 128, 'bold 64px Georgia', '#FFD700', '#1a1a2a');
  const tex = new THREE.CanvasTexture(screenCanvas);
  const screenMat = new THREE.MeshBasicMaterial({ map: tex });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.18), screenMat);
  screen.position.set(0, 1.05, 0.065);
  screen.rotation.x = -0.3;
  group.add(screen);

  // Subtle glow
  const glow = new THREE.PointLight(0xFFD700, 0.2, 2);
  glow.position.set(0, 1.1, 0.1);
  group.add(glow);

  // Set up as secondary interactable
  group.userData.secondaryInteractable = true;
  group.userData.secondaryType = 'gossip_girl_card';
  group.userData.secondaryPromptText = 'Press R to read Gossip Girl Blast';

  return group;
}
