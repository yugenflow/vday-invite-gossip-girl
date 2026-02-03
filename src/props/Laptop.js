import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

export function createLaptop() {
  const group = new THREE.Group();

  // Laptop body (silver/gray)
  const bodyColor = 0xA8A8A8;
  const screenFrameColor = 0x1A1A1A;
  const screenColor = 0x2A3A4A;
  const bcgGreen = 0x00A651;
  const keyboardColor = 0x2A2A2A;

  // Base (keyboard part)
  const base = makeBox(0.35, 0.015, 0.24, bodyColor);
  base.position.set(0, 0.0075, 0);
  group.add(base);

  // Keyboard area (dark inset)
  const keyboard = makeBox(0.3, 0.005, 0.16, keyboardColor);
  keyboard.position.set(0, 0.017, 0.02);
  group.add(keyboard);

  // Trackpad
  const trackpad = makeBox(0.08, 0.003, 0.05, 0x3A3A3A);
  trackpad.position.set(0, 0.018, -0.07);
  group.add(trackpad);

  // Screen (opened at ~110 degrees, tilted back)
  const screenGroup = new THREE.Group();

  // Screen back (silver)
  const screenBack = makeBox(0.35, 0.22, 0.008, bodyColor);
  screenBack.position.set(0, 0.11, 0);
  screenGroup.add(screenBack);

  // Screen frame (black bezel)
  const screenFrame = makeBox(0.33, 0.2, 0.005, screenFrameColor);
  screenFrame.position.set(0, 0.11, 0.0065);
  screenGroup.add(screenFrame);

  // Actual screen (subtle glow)
  const screenMat = new THREE.MeshLambertMaterial({
    color: screenColor,
    emissive: 0x334455,
    emissiveIntensity: 0.3,
    flatShading: true,
  });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.17, 0.003), screenMat);
  screen.position.set(0, 0.11, 0.009);
  screenGroup.add(screen);

  // Webcam dot
  const webcam = new THREE.Mesh(
    new THREE.SphereGeometry(0.004, 6, 6),
    new THREE.MeshLambertMaterial({ color: 0x1A1A1A, flatShading: true })
  );
  webcam.position.set(0, 0.205, 0.009);
  screenGroup.add(webcam);

  // BCG logo sticker on back (green rectangle)
  const bcgLogo = makeBox(0.06, 0.025, 0.002, bcgGreen);
  bcgLogo.position.set(0, 0.11, -0.006);
  screenGroup.add(bcgLogo);

  // Position screen at hinge and rotate back ~110 degrees (about -20 degrees from vertical)
  screenGroup.position.set(0, 0.015, 0.118);
  screenGroup.rotation.x = -0.35; // tilted back slightly
  group.add(screenGroup);

  // Small screen glow light
  const screenLight = new THREE.PointLight(0x6688AA, 0.15, 1);
  screenLight.position.set(0, 0.15, 0.05);
  group.add(screenLight);

  // Set interactable data
  group.userData.interactable = true;
  group.userData.interactionType = 'laptop';
  group.userData.promptText = 'Press E to check mail';

  return group;
}
