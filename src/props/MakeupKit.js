import * as THREE from 'three';
import { makeBox, makeCylinder, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createMakeupKit() {
  const group = new THREE.Group();

  // Tray/case base (gold/blush)
  const trayColor = 0xE8D4C8;
  const trayGold = COLORS.ACCENT_GOLD;
  const blushPink = 0xF5B0B0;
  const lipstickRed = 0xCC2244;
  const lipstickPink = 0xE85080;
  const brushHandle = 0xF5E6D8;
  const brushMetal = 0xC0C0C0;

  // Main tray
  const tray = makeBox(0.25, 0.025, 0.15, trayColor);
  tray.position.set(0, 0.0125, 0);
  group.add(tray);

  // Tray gold rim
  const rimFront = makeBox(0.25, 0.015, 0.008, trayGold);
  rimFront.position.set(0, 0.02, 0.071);
  group.add(rimFront);
  const rimBack = makeBox(0.25, 0.015, 0.008, trayGold);
  rimBack.position.set(0, 0.02, -0.071);
  group.add(rimBack);
  const rimLeft = makeBox(0.008, 0.015, 0.15, trayGold);
  rimLeft.position.set(-0.121, 0.02, 0);
  group.add(rimLeft);
  const rimRight = makeBox(0.008, 0.015, 0.15, trayGold);
  rimRight.position.set(0.121, 0.02, 0);
  group.add(rimRight);

  // Compact mirror (circular, rose gold)
  const compactBase = makeCylinder(0.035, 0.035, 0.015, 8, 0xE0B0A0);
  compactBase.position.set(-0.07, 0.035, 0.03);
  group.add(compactBase);
  // Mirror surface
  const compactMirror = makeCylinder(0.028, 0.028, 0.003, 8, COLORS.VANITY_MIRROR);
  compactMirror.position.set(-0.07, 0.044, 0.03);
  group.add(compactMirror);

  // Lipstick tubes (3)
  const lipstickPositions = [
    { x: 0.04, z: 0.04, color: lipstickRed, rotation: 0.2 },
    { x: 0.06, z: 0.02, color: lipstickPink, rotation: -0.15 },
    { x: 0.02, z: 0.01, color: 0xC04060, rotation: 0.1 },
  ];
  lipstickPositions.forEach(({ x, z, color, rotation }) => {
    const tube = makeCylinder(0.012, 0.012, 0.055, 6, 0x1A1A1A);
    tube.position.set(x, 0.05, z);
    tube.rotation.z = rotation;
    group.add(tube);
    // Lipstick tip
    const tip = makeCylinder(0.008, 0.01, 0.015, 6, color);
    tip.position.set(x + rotation * 0.015, 0.075, z);
    tip.rotation.z = rotation;
    group.add(tip);
  });

  // Makeup brushes (2)
  // Brush 1 - powder brush
  const brush1Handle = makeCylinder(0.008, 0.006, 0.1, 6, brushHandle);
  brush1Handle.position.set(-0.02, 0.055, -0.04);
  brush1Handle.rotation.z = 0.5;
  brush1Handle.rotation.x = 0.1;
  group.add(brush1Handle);
  const brush1Ferrule = makeCylinder(0.008, 0.01, 0.015, 6, brushMetal);
  brush1Ferrule.position.set(-0.045, 0.075, -0.04);
  brush1Ferrule.rotation.z = 0.5;
  brush1Ferrule.rotation.x = 0.1;
  group.add(brush1Ferrule);
  const brush1Bristles = makeSphere(0.015, 6, 6, blushPink);
  brush1Bristles.position.set(-0.058, 0.085, -0.04);
  group.add(brush1Bristles);

  // Brush 2 - smaller brush
  const brush2Handle = makeCylinder(0.005, 0.004, 0.08, 6, brushHandle);
  brush2Handle.position.set(0.08, 0.045, -0.03);
  brush2Handle.rotation.z = -0.4;
  brush2Handle.rotation.x = -0.15;
  group.add(brush2Handle);
  const brush2Ferrule = makeCylinder(0.005, 0.006, 0.01, 6, brushMetal);
  brush2Ferrule.position.set(0.1, 0.06, -0.025);
  brush2Ferrule.rotation.z = -0.4;
  group.add(brush2Ferrule);

  // Blush compact (rectangular)
  const blushCompact = makeBox(0.04, 0.012, 0.05, 0xF8E8E8);
  blushCompact.position.set(-0.06, 0.03, -0.04);
  group.add(blushCompact);
  // Blush color inside
  const blushColor = makeBox(0.032, 0.005, 0.042, blushPink);
  blushColor.position.set(-0.06, 0.038, -0.04);
  group.add(blushColor);

  // Set interactable data
  group.userData.secondaryInteractable = true;
  group.userData.secondaryType = 'makeup';
  group.userData.secondaryPromptText = 'Press R to apply makeup';

  return group;
}
