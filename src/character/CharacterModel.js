import * as THREE from 'three';
import { makeBox, makeCylinder, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function buildShootingOutfit(bodyY) {
  const outfit = new THREE.Group();

  // === LEGS (Shooting Trousers) ===
  const legGroup = new THREE.Group();

  // Left leg
  const leftLeg = new THREE.Group();
  const leftHip = makeBox(0.16, 0.12, 0.16, COLORS.PANTS_WHITE);
  leftHip.position.y = 0.52;
  leftLeg.add(leftHip);
  const leftThigh = makeBox(0.16, 0.28, 0.16, COLORS.PANTS_RED);
  leftThigh.position.y = 0.34;
  leftLeg.add(leftThigh);
  const leftKnee = makeBox(0.17, 0.1, 0.17, COLORS.KNEE_PAD);
  leftKnee.position.y = 0.17;
  leftLeg.add(leftKnee);
  const leftShin = makeBox(0.15, 0.2, 0.15, COLORS.PANTS_RED);
  leftShin.position.y = 0.04;
  leftLeg.add(leftShin);
  const leftZip = makeBox(0.02, 0.45, 0.005, COLORS.PANTS_BLACK);
  leftZip.position.set(0, 0.3, -0.08);
  leftLeg.add(leftZip);
  const leftBoot = makeBox(0.15, 0.1, 0.2, COLORS.BOOT);
  leftBoot.position.set(0, -0.1, 0.02);
  leftLeg.add(leftBoot);
  leftLeg.position.set(-0.1, 0, 0);
  legGroup.add(leftLeg);
  outfit.userData.leftLeg = leftLeg;

  // Right leg
  const rightLeg = new THREE.Group();
  const rightHip = makeBox(0.16, 0.12, 0.16, COLORS.PANTS_WHITE);
  rightHip.position.y = 0.52;
  rightLeg.add(rightHip);
  const rightThigh = makeBox(0.16, 0.28, 0.16, COLORS.PANTS_RED);
  rightThigh.position.y = 0.34;
  rightLeg.add(rightThigh);
  const rightKnee = makeBox(0.17, 0.1, 0.17, COLORS.KNEE_PAD);
  rightKnee.position.y = 0.17;
  rightLeg.add(rightKnee);
  const rightShin = makeBox(0.15, 0.2, 0.15, COLORS.PANTS_RED);
  rightShin.position.y = 0.04;
  rightLeg.add(rightShin);
  const rightZip = makeBox(0.02, 0.45, 0.005, COLORS.PANTS_BLACK);
  rightZip.position.set(0, 0.3, -0.08);
  rightLeg.add(rightZip);
  const rightBoot = makeBox(0.15, 0.1, 0.2, COLORS.BOOT);
  rightBoot.position.set(0, -0.1, 0.02);
  rightLeg.add(rightBoot);
  rightLeg.position.set(0.1, 0, 0);
  legGroup.add(rightLeg);
  outfit.userData.rightLeg = rightLeg;

  // Crotch panel
  const crotchPanel = makeBox(0.12, 0.1, 0.08, COLORS.PANTS_BLACK);
  crotchPanel.position.set(0, 0.48, 0);
  legGroup.add(crotchPanel);

  // Belt
  const belt = makeBox(0.38, 0.05, 0.18, COLORS.BELT_RED);
  belt.position.set(0, 0.6, 0);
  legGroup.add(belt);
  const buckle = makeBox(0.08, 0.04, 0.02, COLORS.BELT_BUCKLE);
  buckle.position.set(0, 0.6, 0.1);
  legGroup.add(buckle);

  legGroup.position.y = bodyY;
  outfit.add(legGroup);

  // === TORSO (Shooting Jacket) ===
  const torso = new THREE.Group();

  const frontLeft = makeBox(0.17, 0.4, 0.1, COLORS.JACKET_WHITE);
  frontLeft.position.set(-0.085, 0, 0.05);
  torso.add(frontLeft);
  const frontRight = makeBox(0.17, 0.4, 0.1, COLORS.JACKET_RED);
  frontRight.position.set(0.085, 0, 0.05);
  torso.add(frontRight);

  for (let i = 0; i < 5; i++) {
    const button = makeCylinder(0.012, 0.012, 0.015, 6, COLORS.BUTTON_SILVER);
    button.rotation.x = Math.PI / 2;
    button.position.set(0.04, 0.15 - i * 0.07, 0.11);
    torso.add(button);
  }

  const shoulderPatch = makeBox(0.1, 0.1, 0.08, COLORS.JACKET_BLACK);
  shoulderPatch.position.set(0.14, 0.18, 0.02);
  torso.add(shoulderPatch);

  const backMain = makeBox(0.35, 0.4, 0.1, COLORS.JACKET_WHITE);
  backMain.position.set(0, 0, -0.05);
  torso.add(backMain);

  const backRedPanel = makeBox(0.16, 0.2, 0.02, COLORS.JACKET_RED);
  backRedPanel.position.set(0.08, -0.1, -0.11);
  torso.add(backRedPanel);

  const spineStrip = makeBox(0.04, 0.38, 0.02, COLORS.SPINE_STRIP);
  spineStrip.position.set(0, 0, -0.11);
  torso.add(spineStrip);
  for (let i = 0; i < 4; i++) {
    const buckleSpine = makeBox(0.06, 0.015, 0.01, COLORS.BUCKLE_SILVER);
    buckleSpine.position.set(0, 0.13 - i * 0.09, -0.12);
    torso.add(buckleSpine);
  }

  const textPatch = makeBox(0.08, 0.06, 0.01, COLORS.JACKET_BLACK);
  textPatch.position.set(-0.1, -0.15, -0.11);
  torso.add(textPatch);

  torso.position.y = bodyY + 0.6 + 0.2;
  outfit.add(torso);

  // === ARMS ===
  const armGroup = new THREE.Group();

  // Left arm
  const leftArm = new THREE.Group();
  const leftShoulder = makeBox(0.12, 0.15, 0.12, COLORS.SLEEVE_RED);
  leftShoulder.position.y = 0;
  leftArm.add(leftShoulder);
  const leftUpper = makeBox(0.11, 0.2, 0.11, COLORS.JACKET_WHITE);
  leftUpper.position.y = -0.17;
  leftArm.add(leftUpper);
  const leftElbow = makeBox(0.12, 0.08, 0.08, COLORS.ELBOW_PATCH);
  leftElbow.position.set(0, -0.29, -0.02);
  leftArm.add(leftElbow);
  const leftForearm = makeBox(0.1, 0.15, 0.1, COLORS.JACKET_WHITE);
  leftForearm.position.y = -0.39;
  leftArm.add(leftForearm);
  const leftGlove = makeBox(0.09, 0.07, 0.09, COLORS.GLOVE);
  leftGlove.position.y = -0.5;
  leftArm.add(leftGlove);
  leftArm.position.set(-0.25, 0.15, 0);
  armGroup.add(leftArm);
  outfit.userData.leftArm = leftArm;

  // Right arm
  const rightArm = new THREE.Group();
  const rightShoulder = makeBox(0.12, 0.15, 0.12, COLORS.SLEEVE_BLACK);
  rightShoulder.position.y = 0;
  rightArm.add(rightShoulder);
  const rightUpper = makeBox(0.11, 0.2, 0.11, COLORS.SLEEVE_RED);
  rightUpper.position.y = -0.17;
  rightArm.add(rightUpper);
  const rightElbow = makeBox(0.12, 0.08, 0.08, COLORS.ELBOW_PATCH);
  rightElbow.position.set(0, -0.29, -0.02);
  rightArm.add(rightElbow);
  const rightForearm = makeBox(0.1, 0.15, 0.1, COLORS.JACKET_WHITE);
  rightForearm.position.y = -0.39;
  rightArm.add(rightForearm);
  const rightHand = makeBox(0.08, 0.06, 0.08, COLORS.SKIN);
  rightHand.position.y = -0.5;
  rightArm.add(rightHand);
  rightArm.position.set(0.25, 0.15, 0);
  armGroup.add(rightArm);
  outfit.userData.rightArm = rightArm;

  armGroup.position.y = bodyY + 0.6 + 0.2;
  outfit.add(armGroup);

  // Visor (part of shooting outfit)
  const visorGroup = new THREE.Group();
  const visorBrim = makeBox(0.26, 0.02, 0.12, COLORS.VISOR);
  visorBrim.position.set(0, 0.13, 0.17);
  visorGroup.add(visorBrim);
  const visorBandF = makeBox(0.26, 0.04, 0.02, COLORS.VISOR);
  visorBandF.position.set(0, 0.14, 0.1);
  visorGroup.add(visorBandF);
  const visorBandL = makeBox(0.02, 0.04, 0.12, COLORS.VISOR);
  visorBandL.position.set(-0.13, 0.14, 0.05);
  visorGroup.add(visorBandL);
  const visorBandR = makeBox(0.02, 0.04, 0.12, COLORS.VISOR);
  visorBandR.position.set(0.13, 0.14, 0.05);
  visorGroup.add(visorBandR);
  visorGroup.position.y = bodyY + 0.6 + 0.4 + 0.15;
  outfit.add(visorGroup);
  outfit.userData.visorGroup = visorGroup;

  outfit.visible = false;
  return outfit;
}

function buildCasualOutfit(bodyY) {
  const outfit = new THREE.Group();

  // === LEGS (Teal pajama pants) ===
  const legGroup = new THREE.Group();

  // Left leg
  const leftLeg = new THREE.Group();
  const leftThigh = makeBox(0.15, 0.35, 0.15, COLORS.PAJAMA_TEAL);
  leftThigh.position.y = 0.38;
  leftLeg.add(leftThigh);
  const leftShin = makeBox(0.14, 0.25, 0.14, COLORS.PAJAMA_TEAL);
  leftShin.position.y = 0.08;
  leftLeg.add(leftShin);
  // Slipper
  const leftSlipper = makeBox(0.14, 0.06, 0.2, COLORS.SLIPPER);
  leftSlipper.position.set(0, -0.08, 0.02);
  leftLeg.add(leftSlipper);
  leftLeg.position.set(-0.1, 0, 0);
  legGroup.add(leftLeg);
  outfit.userData.leftLeg = leftLeg;

  // Right leg
  const rightLeg = new THREE.Group();
  const rightThigh = makeBox(0.15, 0.35, 0.15, COLORS.PAJAMA_TEAL);
  rightThigh.position.y = 0.38;
  rightLeg.add(rightThigh);
  const rightShin = makeBox(0.14, 0.25, 0.14, COLORS.PAJAMA_TEAL);
  rightShin.position.y = 0.08;
  rightLeg.add(rightShin);
  const rightSlipper = makeBox(0.14, 0.06, 0.2, COLORS.SLIPPER);
  rightSlipper.position.set(0, -0.08, 0.02);
  rightLeg.add(rightSlipper);
  rightLeg.position.set(0.1, 0, 0);
  legGroup.add(rightLeg);
  outfit.userData.rightLeg = rightLeg;

  // Waistband
  const waistband = makeBox(0.36, 0.05, 0.18, COLORS.PAJAMA_TEAL);
  waistband.position.set(0, 0.58, 0);
  legGroup.add(waistband);

  legGroup.position.y = bodyY;
  outfit.add(legGroup);

  // === TORSO (White t-shirt) ===
  const torso = new THREE.Group();

  // Simple t-shirt body
  const shirtBody = makeBox(0.34, 0.4, 0.18, COLORS.TSHIRT_WHITE);
  shirtBody.position.set(0, 0, 0);
  torso.add(shirtBody);

  // Slight collar
  const collar = makeBox(0.16, 0.04, 0.1, COLORS.TSHIRT_WHITE);
  collar.position.set(0, 0.22, 0.04);
  torso.add(collar);

  torso.position.y = bodyY + 0.6 + 0.2;
  outfit.add(torso);

  // === ARMS (bare skin below short sleeves) ===
  const armGroup = new THREE.Group();

  // Left arm
  const leftArm = new THREE.Group();
  const leftSleeve = makeBox(0.12, 0.12, 0.12, COLORS.TSHIRT_WHITE);
  leftSleeve.position.y = 0;
  leftArm.add(leftSleeve);
  const leftUpperArm = makeBox(0.1, 0.2, 0.1, COLORS.SKIN);
  leftUpperArm.position.y = -0.18;
  leftArm.add(leftUpperArm);
  const leftForearm = makeBox(0.09, 0.18, 0.09, COLORS.SKIN);
  leftForearm.position.y = -0.38;
  leftArm.add(leftForearm);
  const leftHandC = makeBox(0.08, 0.06, 0.08, COLORS.SKIN);
  leftHandC.position.y = -0.5;
  leftArm.add(leftHandC);
  leftArm.position.set(-0.24, 0.15, 0);
  armGroup.add(leftArm);
  outfit.userData.leftArm = leftArm;

  // Right arm
  const rightArm = new THREE.Group();
  const rightSleeve = makeBox(0.12, 0.12, 0.12, COLORS.TSHIRT_WHITE);
  rightSleeve.position.y = 0;
  rightArm.add(rightSleeve);
  const rightUpperArm = makeBox(0.1, 0.2, 0.1, COLORS.SKIN);
  rightUpperArm.position.y = -0.18;
  rightArm.add(rightUpperArm);
  const rightForearm = makeBox(0.09, 0.18, 0.09, COLORS.SKIN);
  rightForearm.position.y = -0.38;
  rightArm.add(rightForearm);
  const rightHandC = makeBox(0.08, 0.06, 0.08, COLORS.SKIN);
  rightHandC.position.y = -0.5;
  rightArm.add(rightHandC);
  rightArm.position.set(0.24, 0.15, 0);
  armGroup.add(rightArm);
  outfit.userData.rightArm = rightArm;

  armGroup.position.y = bodyY + 0.6 + 0.2;
  outfit.add(armGroup);

  outfit.visible = true; // casual visible at start
  return outfit;
}

export function createCharacter() {
  const group = new THREE.Group();

  const bodyY = 0.6; // hip level

  // === SHARED HEAD (always visible) ===
  const headGroup = new THREE.Group();

  const head = makeBox(0.22, 0.24, 0.22, COLORS.SKIN);
  headGroup.add(head);

  const hairTop = makeBox(0.24, 0.06, 0.24, COLORS.HAIR);
  hairTop.position.y = 0.14;
  headGroup.add(hairTop);

  const hairBack = makeBox(0.24, 0.2, 0.06, COLORS.HAIR);
  hairBack.position.set(0, 0.02, -0.12);
  headGroup.add(hairBack);

  const hairSideL = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideL.position.set(-0.12, 0.04, -0.02);
  headGroup.add(hairSideL);

  const hairSideR = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideR.position.set(0.12, 0.04, -0.02);
  headGroup.add(hairSideR);

  const ponytail = makeCylinder(0.04, 0.02, 0.25, 6, COLORS.HAIR);
  ponytail.position.set(0, -0.05, -0.22);
  ponytail.rotation.x = 0.4;
  headGroup.add(ponytail);

  // Eyes
  [-0.06, 0.06].forEach(x => {
    const eye = makeSphere(0.02, 4, 4, 0x222222);
    eye.position.set(x, 0.04, 0.12);
    headGroup.add(eye);
  });

  headGroup.position.y = bodyY + 0.6 + 0.4 + 0.15;
  group.add(headGroup);

  // === BUILD OUTFITS ===
  const casualOutfit = buildCasualOutfit(bodyY);
  const shootingOutfit = buildShootingOutfit(bodyY);
  group.add(casualOutfit);
  group.add(shootingOutfit);

  group.userData.casualOutfit = casualOutfit;
  group.userData.shootingOutfit = shootingOutfit;

  // Point limb refs at the active (casual) outfit initially
  group.userData.leftLeg = casualOutfit.userData.leftLeg;
  group.userData.rightLeg = casualOutfit.userData.rightLeg;
  group.userData.leftArm = casualOutfit.userData.leftArm;
  group.userData.rightArm = casualOutfit.userData.rightArm;

  return group;
}

export function swapOutfit(character, outfitName) {
  const casual = character.userData.casualOutfit;
  const shooting = character.userData.shootingOutfit;

  if (outfitName === 'shooting') {
    casual.visible = false;
    shooting.visible = true;
    character.userData.leftLeg = shooting.userData.leftLeg;
    character.userData.rightLeg = shooting.userData.rightLeg;
    character.userData.leftArm = shooting.userData.leftArm;
    character.userData.rightArm = shooting.userData.rightArm;
  } else {
    shooting.visible = false;
    casual.visible = true;
    character.userData.leftLeg = casual.userData.leftLeg;
    character.userData.rightLeg = casual.userData.rightLeg;
    character.userData.leftArm = casual.userData.leftArm;
    character.userData.rightArm = casual.userData.rightArm;
  }
}

export function animateCharacter(group, time, isMoving) {
  const { leftLeg, rightLeg, leftArm, rightArm } = group.userData;
  if (!leftLeg) return;

  if (isMoving) {
    const swing = Math.sin(time * 8) * 0.4;
    leftLeg.rotation.x = swing;
    rightLeg.rotation.x = -swing;
    leftArm.rotation.x = -swing * 0.6;
    rightArm.rotation.x = swing * 0.6;
  } else {
    // Idle bob
    const bob = Math.sin(time * 2) * 0.02;
    leftLeg.rotation.x *= 0.9;
    rightLeg.rotation.x *= 0.9;
    leftArm.rotation.x *= 0.9;
    rightArm.rotation.x *= 0.9;
    group.position.y = bob;
  }
}
