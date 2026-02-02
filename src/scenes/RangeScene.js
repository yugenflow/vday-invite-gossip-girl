import * as THREE from 'three';
import { makeBox, makeCylinder, makeTextCanvas } from '../utils/LowPolyHelpers.js';
import { COLORS, RANGE } from '../constants.js';
import { createRangeBanner } from '../props/RangeBanner.js';
import { createTargets } from '../props/Targets.js';
import { createRifle } from '../props/Rifle.js';
import { createGuidelinesClipboard } from '../props/GuidelinesClipboard.js';

export function createRangeScene() {
  const group = new THREE.Group();
  const ox = RANGE.ORIGIN.x;
  const oz = RANGE.ORIGIN.z;
  const W = RANGE.WIDTH;
  const D = RANGE.DEPTH;
  const H = RANGE.HEIGHT;

  // Floor
  const floor = makeBox(W, 0.1, D, COLORS.RANGE_FLOOR);
  floor.position.set(ox, -0.05, oz);
  group.add(floor);

  // Ceiling
  const ceiling = makeBox(W, 0.1, D, COLORS.RANGE_CEILING);
  ceiling.position.set(ox, H + 0.05, oz);
  group.add(ceiling);

  // Walls
  const leftWall = makeBox(0.15, H, D, COLORS.RANGE_WALL);
  leftWall.position.set(ox - W / 2 - 0.075, H / 2, oz);
  group.add(leftWall);

  const rightWall = makeBox(0.15, H, D, COLORS.RANGE_WALL);
  rightWall.position.set(ox + W / 2 + 0.075, H / 2, oz);
  group.add(rightWall);

  // Back wall (far end)
  const backWall = makeBox(W, H, 0.15, COLORS.RANGE_WALL);
  backWall.position.set(ox, H / 2, oz - D / 2 - 0.075);
  group.add(backWall);

  // Front wall with door gap
  const doorW = 1.4;
  const doorH = 2.6;
  const fwZ = oz + D / 2 + 0.075;

  const fwLeft = makeBox((W - doorW) / 2, H, 0.15, COLORS.RANGE_WALL);
  fwLeft.position.set(ox - doorW / 2 - (W - doorW) / 4, H / 2, fwZ);
  group.add(fwLeft);

  const fwRight = makeBox((W - doorW) / 2, H, 0.15, COLORS.RANGE_WALL);
  fwRight.position.set(ox + doorW / 2 + (W - doorW) / 4, H / 2, fwZ);
  group.add(fwRight);

  const fwTop = makeBox(doorW, H - doorH, 0.15, COLORS.RANGE_WALL);
  fwTop.position.set(ox, doorH + (H - doorH) / 2, fwZ);
  group.add(fwTop);

  // Door frame
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x4A2F1A, flatShading: true });
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameL.position.set(ox - doorW / 2, doorH / 2, fwZ);
  group.add(frameL);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameR.position.set(ox + doorW / 2, doorH / 2, fwZ);
  group.add(frameR);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.16, 0.08, 0.2), frameMat);
  frameTop.position.set(ox, doorH, fwZ);
  group.add(frameTop);

  // Door panel (heavy industrial range door)
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x5A5A5A, flatShading: true });
  const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.08, doorH - 0.04, 0.06), doorMat);
  doorPanel.position.set(ox, doorH / 2, fwZ);
  group.add(doorPanel);
  // Metal reinforcement strips
  const stripMat = new THREE.MeshLambertMaterial({ color: 0x707070, flatShading: true });
  const stripTop = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.85, 0.06, 0.07), stripMat);
  stripTop.position.set(ox, doorH * 0.85, fwZ + 0.01);
  group.add(stripTop);
  const stripMid = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.85, 0.06, 0.07), stripMat);
  stripMid.position.set(ox, doorH * 0.5, fwZ + 0.01);
  group.add(stripMid);
  const stripBot = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.85, 0.06, 0.07), stripMat);
  stripBot.position.set(ox, doorH * 0.15, fwZ + 0.01);
  group.add(stripBot);
  // Door handle (industrial lever)
  const rangeDoorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.06), new THREE.MeshLambertMaterial({ color: 0xAAAAAA, flatShading: true }));
  rangeDoorHandle.position.set(ox + doorW * 0.3, doorH * 0.45, fwZ + 0.05);
  group.add(rangeDoorHandle);

  // --- Full-width shooting counter (like a real range partition) ---
  const counterZ = oz + D / 2 - 3;
  // Main counter surface (full width, waist height)
  const counter = makeBox(W - 0.3, 0.08, 0.7, COLORS.BENCH);
  counter.position.set(ox, 0.95, counterZ);
  group.add(counter);
  // Counter front panel (shooter side)
  const counterFront = makeBox(W - 0.3, 0.95, 0.05, 0x5a3520);
  counterFront.position.set(ox, 0.475, counterZ + 0.33);
  group.add(counterFront);
  // Counter back panel (range side)
  const counterBack = makeBox(W - 0.3, 0.95, 0.05, 0x5a3520);
  counterBack.position.set(ox, 0.475, counterZ - 0.33);
  group.add(counterBack);
  // Shelf underneath counter
  const counterShelf = makeBox(W - 0.3, 0.05, 0.6, 0x4a2a15);
  counterShelf.position.set(ox, 0.45, counterZ);
  group.add(counterShelf);

  // Lane dividers (on counter, extending forward into range)
  for (let i = -1; i <= 1; i += 2) {
    const divider = makeBox(0.05, 1.2, D * 0.5, COLORS.LANE_DIVIDER);
    divider.position.set(ox + i * 1.5, 0.6, oz - 5);
    group.add(divider);
  }

  // Small shelf/table for rifle (on the counter, to the right)
  const rifleTable = makeBox(1.2, 0.06, 0.4, 0x6B4226);
  rifleTable.position.set(ox + 2.5, 1.0, counterZ);
  group.add(rifleTable);

  // Rifle on table
  const rifle = createRifle();
  rifle.position.set(ox + 2.5, 1.05, counterZ);
  rifle.rotation.y = Math.PI / 2;
  rifle.userData.interactable = true;
  rifle.userData.interactionType = 'rifle';
  rifle.userData.promptText = 'Press E to pick up the rifle';
  group.add(rifle);
  group.userData.rifle = rifle;

  // Guidelines clipboard on counter (left side)
  const clipboard = createGuidelinesClipboard();
  clipboard.position.set(ox - 2, 1.05, counterZ + 0.1);
  clipboard.rotation.x = -0.3;
  clipboard.userData.secondaryInteractable = true;
  clipboard.userData.secondaryType = 'guidelines';
  clipboard.userData.secondaryPromptText = 'Press R to read guidelines';
  group.add(clipboard);
  group.userData.clipboard = clipboard;

  // Banner
  const banner = createRangeBanner('Will you be my Valentine?');
  banner.position.set(ox, H - 0.8, oz - D / 2 + 3);
  group.add(banner);

  // Targets
  const targets = createTargets(oz + D / 2 - 3);
  targets.forEach(t => group.add(t));
  group.userData.targets = targets;

  // --- Lighting (bright, clean indoor range) ---
  // Strong ambient
  const rangeAmbient = new THREE.AmbientLight(0xFFFFFF, 0.75);
  group.add(rangeAmbient);

  // Row of overhead fluorescent lights along the range
  const lightPositions = [-12, -8, -4, 0, 4, 8, 12];
  lightPositions.forEach(zOff => {
    const light = new THREE.PointLight(0xFFFFF0, 1.2, 20);
    light.position.set(ox, H - 0.3, oz + zOff);
    group.add(light);

    // Visible light fixture (fluorescent tube)
    const fixture = makeBox(1.4, 0.06, 0.25, 0xF5F5F0);
    fixture.position.set(ox, H - 0.02, oz + zOff);
    group.add(fixture);
    // Fixture glow accent
    const fixtureGlow = makeBox(1.2, 0.02, 0.15, 0xFFFFF8);
    fixtureGlow.position.set(ox, H - 0.06, oz + zOff);
    group.add(fixtureGlow);
  });

  // Extra lights near targets area for visibility
  const targetLight1 = new THREE.PointLight(0xFFFFFF, 1.0, 18);
  targetLight1.position.set(ox - 2, H - 0.3, oz - 12);
  group.add(targetLight1);
  const targetLight2 = new THREE.PointLight(0xFFFFFF, 1.0, 18);
  targetLight2.position.set(ox + 2, H - 0.3, oz - 12);
  group.add(targetLight2);

  // --- Wall details to make range look lively ---

  // Safety stripe along both walls (yellow/black hazard band at waist height)
  const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xE8C820, flatShading: true });
  const hazardBlack = new THREE.MeshLambertMaterial({ color: 0x222222, flatShading: true });
  // Left wall stripe
  for (let i = 0; i < 20; i++) {
    const color = i % 2 === 0 ? hazardYellow : hazardBlack;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, D / 20), color);
    stripe.position.set(ox - W / 2 + 0.01, 1.0, oz - D / 2 + (i + 0.5) * (D / 20));
    group.add(stripe);
  }
  // Right wall stripe
  for (let i = 0; i < 20; i++) {
    const color = i % 2 === 0 ? hazardYellow : hazardBlack;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, D / 20), color);
    stripe.position.set(ox + W / 2 - 0.01, 1.0, oz - D / 2 + (i + 0.5) * (D / 20));
    group.add(stripe);
  }

  // Red accent line along base of walls
  const baseTrimLeft = makeBox(0.02, 0.08, D, 0xAA2020);
  baseTrimLeft.position.set(ox - W / 2 + 0.01, 0.04, oz);
  group.add(baseTrimLeft);
  const baseTrimRight = makeBox(0.02, 0.08, D, 0xAA2020);
  baseTrimRight.position.set(ox + W / 2 - 0.01, 0.04, oz);
  group.add(baseTrimRight);

  // --- Wall posters (flat on walls, not sprites) ---
  function createWallPoster(text, w, h, bgColor, textColor, fontSize) {
    const canvas = makeTextCanvas(text, 512, 256, `bold ${fontSize || 32}px Georgia`, textColor || '#fff', bgColor || '#333');
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    return mesh;
  }

  // Front wall posters (face -Z into the range, readable when player turns around)
  // Left side of door
  const poster1 = createWallPoster('Expert at work.\nProceed with caution.', 1.2, 0.7, '#2a2a2a', '#f0c040', 36);
  poster1.rotation.y = Math.PI;
  poster1.position.set(ox - doorW / 2 - (W - doorW) / 4, 2.2, fwZ - 0.1);
  group.add(poster1);

  const poster2 = createWallPoster("I'm just thinking...\nAre you getting\nthe gist of it?", 1.2, 0.9, '#8B2252', '#FFE0E8', 30);
  poster2.rotation.y = Math.PI;
  poster2.position.set(ox - doorW / 2 - (W - doorW) / 4, 1.2, fwZ - 0.1);
  group.add(poster2);

  // Right side of door
  const poster3 = createWallPoster('Hot shooter\nat work', 1.2, 0.7, '#CC3344', '#fff', 40);
  poster3.rotation.y = Math.PI;
  poster3.position.set(ox + doorW / 2 + (W - doorW) / 4, 2.2, fwZ - 0.1);
  group.add(poster3);

  const poster4 = createWallPoster('Bullseye\nGalore', 1.2, 0.7, '#1a3a1a', '#FFD700', 42);
  poster4.rotation.y = Math.PI;
  poster4.position.set(ox + doorW / 2 + (W - doorW) / 4, 1.2, fwZ - 0.1);
  group.add(poster4);

  // --- Colliders (all 4 walls + counter) ---
  group.userData.colliders = [
    // Shooting counter (blocks player from walking into range)
    { min: { x: ox - W / 2, z: counterZ - 0.4 }, max: { x: ox + W / 2, z: counterZ + 0.4 } },
    // Left wall
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox - W / 2, z: oz + D / 2 + 0.2 } },
    // Right wall
    { min: { x: ox + W / 2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
    // Back wall
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz - D / 2 } },
    // Front wall (solid boundary, door is visual only)
    { min: { x: ox - W / 2 - 0.2, z: oz + D / 2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
  ];

  group.userData.rangeOriginZ = oz;

  return group;
}
