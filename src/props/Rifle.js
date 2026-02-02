import * as THREE from 'three';
import { makeBox, makeCylinder } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createRifle() {
  const group = new THREE.Group();

  // === Rear Assembly (Buttstock) - skeletal aluminum, adjustable ===
  // Buttplate (metal with rubber grip pad)
  const buttplate = makeBox(0.06, 0.1, 0.04, COLORS.RIFLE_RUBBER);
  buttplate.position.set(0, 0.02, 0.55);
  group.add(buttplate);
  const buttMetal = makeBox(0.04, 0.08, 0.02, COLORS.RIFLE_ALUMINUM);
  buttMetal.position.set(0, 0.02, 0.52);
  group.add(buttMetal);

  // Rear stock rods (skeletal - two thin rods instead of solid wood)
  const rodTop = makeCylinder(0.01, 0.01, 0.3, 6, COLORS.RIFLE_ALUMINUM);
  rodTop.rotation.x = Math.PI / 2;
  rodTop.position.set(0, 0.06, 0.38);
  group.add(rodTop);
  const rodBot = makeCylinder(0.01, 0.01, 0.3, 6, COLORS.RIFLE_ALUMINUM);
  rodBot.rotation.x = Math.PI / 2;
  rodBot.position.set(0, -0.02, 0.38);
  group.add(rodBot);

  // Cheek piece (black, adjustable)
  const cheekPiece = makeBox(0.05, 0.04, 0.1, COLORS.RIFLE_DARK);
  cheekPiece.position.set(0, 0.1, 0.3);
  group.add(cheekPiece);

  // === Receiver / Action ===
  const receiver = makeBox(0.06, 0.08, 0.2, COLORS.RIFLE_ALUMINUM);
  receiver.position.set(0, 0.02, 0.1);
  group.add(receiver);

  // Trigger guard
  const guard = makeBox(0.01, 0.05, 0.06, COLORS.RIFLE_DARK);
  guard.position.set(0, -0.04, 0.1);
  group.add(guard);

  // Grip (angled, aluminum/rubber)
  const grip = makeBox(0.04, 0.1, 0.04, COLORS.RIFLE_RUBBER);
  grip.position.set(0, -0.06, 0.15);
  grip.rotation.x = 0.3;
  group.add(grip);

  // === Barrel ===
  // Main barrel (silver, long and sleek)
  const barrel = makeCylinder(0.013, 0.013, 0.7, 8, COLORS.RIFLE_SILVER);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, -0.35);
  group.add(barrel);

  // Carbon fiber sleeve around barrel (patterned dark)
  const carbonSleeve = makeCylinder(0.02, 0.018, 0.3, 8, COLORS.RIFLE_CARBON);
  carbonSleeve.rotation.x = Math.PI / 2;
  carbonSleeve.position.set(0, 0.02, -0.15);
  group.add(carbonSleeve);

  // === Air Cylinder (thick silver, mounted under barrel) ===
  const airCylinder = makeCylinder(0.025, 0.025, 0.4, 8, COLORS.RIFLE_ALUMINUM);
  airCylinder.rotation.x = Math.PI / 2;
  airCylinder.position.set(0, -0.04, -0.1);
  group.add(airCylinder);
  // End cap
  const endCap = makeCylinder(0.028, 0.028, 0.02, 8, COLORS.RIFLE_DARK);
  endCap.rotation.x = Math.PI / 2;
  endCap.position.set(0, -0.04, -0.31);
  group.add(endCap);

  // === Sights ===
  // Rear diopter sight (small black boxy unit near shooter's eye)
  const diopter = makeBox(0.04, 0.04, 0.03, COLORS.RIFLE_DARK);
  diopter.position.set(0, 0.08, 0.05);
  group.add(diopter);
  const diopterDisc = makeCylinder(0.02, 0.02, 0.015, 8, COLORS.RIFLE_DARK);
  diopterDisc.position.set(0, 0.08, 0.035);
  diopterDisc.rotation.x = Math.PI / 2;
  group.add(diopterDisc);

  // Front tunnel sight (small black ring/tube at barrel end)
  const tunnelBase = makeBox(0.03, 0.03, 0.02, COLORS.RIFLE_DARK);
  tunnelBase.position.set(0, 0.04, -0.69);
  group.add(tunnelBase);
  const tunnelRing = makeCylinder(0.018, 0.018, 0.025, 8, COLORS.RIFLE_DARK);
  tunnelRing.rotation.x = Math.PI / 2;
  tunnelRing.position.set(0, 0.04, -0.71);
  group.add(tunnelRing);
  // Hollow center of tunnel (lighter to suggest opening)
  const tunnelHole = makeCylinder(0.01, 0.01, 0.026, 8, 0x666666);
  tunnelHole.rotation.x = Math.PI / 2;
  tunnelHole.position.set(0, 0.04, -0.71);
  group.add(tunnelHole);

  return group;
}

export function createFPSRifle() {
  const rifle = createRifle();
  rifle.scale.set(1.2, 1.2, 1.2);
  rifle.position.set(0.3, -0.25, -0.5);
  rifle.rotation.set(0, 0, 0);
  return rifle;
}
