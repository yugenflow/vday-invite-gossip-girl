import * as THREE from 'three';
import { makeBox, makeCylinder, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function buildRunwayOutfit(bodyY) {
  const outfit = new THREE.Group();

  // === LEGS (bare legs with Louboutin heels) ===
  const legGroup = new THREE.Group();

  // Left leg
  const leftLeg = new THREE.Group();
  const leftThigh = makeBox(0.13, 0.3, 0.13, COLORS.SKIN);
  leftThigh.position.y = 0.4;
  leftLeg.add(leftThigh);
  const leftShin = makeBox(0.12, 0.28, 0.12, COLORS.SKIN);
  leftShin.position.y = 0.1;
  leftLeg.add(leftShin);
  // Louboutin heel (black with red sole)
  const leftHeel = makeBox(0.1, 0.04, 0.18, COLORS.HEEL_BLACK);
  leftHeel.position.set(0, -0.05, 0.02);
  leftLeg.add(leftHeel);
  const leftSole = makeBox(0.1, 0.02, 0.18, COLORS.HEEL_RED_SOLE);
  leftSole.position.set(0, -0.08, 0.02);
  leftLeg.add(leftSole);
  // Stiletto heel
  const leftStiletto = makeBox(0.03, 0.08, 0.03, COLORS.HEEL_BLACK);
  leftStiletto.position.set(0, -0.04, -0.06);
  leftLeg.add(leftStiletto);
  leftLeg.position.set(-0.1, 0, 0);
  legGroup.add(leftLeg);
  outfit.userData.leftLeg = leftLeg;

  // Right leg
  const rightLeg = new THREE.Group();
  const rightThigh = makeBox(0.13, 0.3, 0.13, COLORS.SKIN);
  rightThigh.position.y = 0.4;
  rightLeg.add(rightThigh);
  const rightShin = makeBox(0.12, 0.28, 0.12, COLORS.SKIN);
  rightShin.position.y = 0.1;
  rightLeg.add(rightShin);
  const rightHeel = makeBox(0.1, 0.04, 0.18, COLORS.HEEL_BLACK);
  rightHeel.position.set(0, -0.05, 0.02);
  rightLeg.add(rightHeel);
  const rightSole = makeBox(0.1, 0.02, 0.18, COLORS.HEEL_RED_SOLE);
  rightSole.position.set(0, -0.08, 0.02);
  rightLeg.add(rightSole);
  const rightStiletto = makeBox(0.03, 0.08, 0.03, COLORS.HEEL_BLACK);
  rightStiletto.position.set(0, -0.04, -0.06);
  rightLeg.add(rightStiletto);
  rightLeg.position.set(0.1, 0, 0);
  legGroup.add(rightLeg);
  outfit.userData.rightLeg = rightLeg;

  legGroup.position.y = bodyY;
  outfit.add(legGroup);

  // === TORSO (Little Black Dress) ===
  const torso = new THREE.Group();

  // Dress body — form-fitting, slightly tapered
  const dressBody = makeBox(0.32, 0.42, 0.16, COLORS.LBD_BLACK);
  dressBody.position.set(0, 0, 0);
  torso.add(dressBody);

  // Dress skirt extension (covers hips to above knee)
  const skirt = makeBox(0.34, 0.15, 0.18, COLORS.LBD_BLACK);
  skirt.position.set(0, -0.28, 0);
  torso.add(skirt);

  // Laced bralette visible at neckline
  const bralette = makeBox(0.24, 0.06, 0.08, COLORS.BRALETTE_LACE);
  bralette.position.set(0, 0.24, 0.05);
  torso.add(bralette);
  // Lace detail lines
  const laceDetail1 = makeBox(0.2, 0.01, 0.01, COLORS.BRALETTE_DETAIL);
  laceDetail1.position.set(0, 0.26, 0.1);
  torso.add(laceDetail1);
  const laceDetail2 = makeBox(0.18, 0.01, 0.01, COLORS.BRALETTE_DETAIL);
  laceDetail2.position.set(0, 0.22, 0.1);
  torso.add(laceDetail2);

  torso.position.y = bodyY + 0.6 + 0.2;
  outfit.add(torso);

  // === ARMS (bare skin, elegant) ===
  const armGroup = new THREE.Group();

  // Left arm
  const leftArm = new THREE.Group();
  const leftShoulder = makeBox(0.1, 0.12, 0.1, COLORS.SKIN);
  leftShoulder.position.y = 0;
  leftArm.add(leftShoulder);
  const leftUpperArm = makeBox(0.09, 0.2, 0.09, COLORS.SKIN);
  leftUpperArm.position.y = -0.18;
  leftArm.add(leftUpperArm);
  const leftForearm = makeBox(0.08, 0.18, 0.08, COLORS.SKIN);
  leftForearm.position.y = -0.38;
  leftArm.add(leftForearm);
  const leftHand = makeBox(0.07, 0.06, 0.07, COLORS.SKIN);
  leftHand.position.y = -0.5;
  leftArm.add(leftHand);
  // Cartier watch on left wrist
  const watchBandMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, emissive: 0xD4AF37, emissiveIntensity: 0.15 });
  const watchBand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.09), watchBandMat);
  watchBand.position.set(0, -0.44, 0);
  leftArm.add(watchBand);
  const watchFace = makeBox(0.055, 0.015, 0.055, 0xFFFFF0);
  watchFace.position.set(0, -0.44, 0.025);
  leftArm.add(watchFace);

  leftArm.position.set(-0.23, 0.15, 0);
  armGroup.add(leftArm);
  outfit.userData.leftArm = leftArm;

  // Right arm
  const rightArm = new THREE.Group();
  const rightShoulder = makeBox(0.1, 0.12, 0.1, COLORS.SKIN);
  rightShoulder.position.y = 0;
  rightArm.add(rightShoulder);
  const rightUpperArm = makeBox(0.09, 0.2, 0.09, COLORS.SKIN);
  rightUpperArm.position.y = -0.18;
  rightArm.add(rightUpperArm);
  const rightForearm = makeBox(0.08, 0.18, 0.08, COLORS.SKIN);
  rightForearm.position.y = -0.38;
  rightArm.add(rightForearm);
  const rightHand = makeBox(0.07, 0.06, 0.07, COLORS.SKIN);
  rightHand.position.y = -0.5;
  rightArm.add(rightHand);
  rightArm.position.set(0.23, 0.15, 0);
  armGroup.add(rightArm);
  outfit.userData.rightArm = rightArm;

  armGroup.position.y = bodyY + 0.6 + 0.2;
  outfit.add(armGroup);

  // === Louboutin Red Lipstick ===
  const lipstick = makeBox(0.1, 0.02, 0.03, 0xCC0000);
  lipstick.position.set(0, -0.04, 0.12);
  const headY = bodyY + 0.6 + 0.4 + 0.19;
  // Place relative to head — lips area
  const lipsGroup = new THREE.Group();
  lipsGroup.add(lipstick);
  lipsGroup.position.y = headY - 0.04;
  outfit.add(lipsGroup);

  // === Golden Earrings (small gold spheres at ear level) ===
  const earringMat = new THREE.MeshLambertMaterial({
    color: 0xFFD700,
    emissive: 0xD4AF37,
    emissiveIntensity: 0.2,
  });
  const earringGeo = new THREE.SphereGeometry(0.02, 6, 6);
  const earringL = new THREE.Mesh(earringGeo, earringMat);
  earringL.position.set(-0.13, 0, 0.04);
  const earringDropL = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), earringMat);
  earringDropL.position.set(-0.13, -0.04, 0.04);
  const earringsGroup = new THREE.Group();
  earringsGroup.add(earringL);
  earringsGroup.add(earringDropL);
  const earringR = new THREE.Mesh(earringGeo.clone(), earringMat);
  earringR.position.set(0.13, 0, 0.04);
  const earringDropR = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), earringMat);
  earringDropR.position.set(0.13, -0.04, 0.04);
  earringsGroup.add(earringR);
  earringsGroup.add(earringDropR);
  earringsGroup.position.y = headY;
  outfit.add(earringsGroup);


  outfit.visible = false;
  return outfit;
}

function buildCasualOutfit(bodyY) {
  const outfit = new THREE.Group();

  // === LEGS (Blush pink pajama pants) ===
  const legGroup = new THREE.Group();

  const leftLeg = new THREE.Group();
  const leftThigh = makeBox(0.15, 0.35, 0.15, COLORS.PAJAMA_BLUSH);
  leftThigh.position.y = 0.38;
  leftLeg.add(leftThigh);
  const leftShin = makeBox(0.14, 0.25, 0.14, COLORS.PAJAMA_BLUSH);
  leftShin.position.y = 0.08;
  leftLeg.add(leftShin);
  const leftSlipper = makeBox(0.14, 0.06, 0.2, COLORS.SLIPPER_FUZZY);
  leftSlipper.position.set(0, -0.08, 0.02);
  leftLeg.add(leftSlipper);
  leftLeg.position.set(-0.1, 0, 0);
  legGroup.add(leftLeg);
  outfit.userData.leftLeg = leftLeg;

  const rightLeg = new THREE.Group();
  const rightThigh = makeBox(0.15, 0.35, 0.15, COLORS.PAJAMA_BLUSH);
  rightThigh.position.y = 0.38;
  rightLeg.add(rightThigh);
  const rightShin = makeBox(0.14, 0.25, 0.14, COLORS.PAJAMA_BLUSH);
  rightShin.position.y = 0.08;
  rightLeg.add(rightShin);
  const rightSlipper = makeBox(0.14, 0.06, 0.2, COLORS.SLIPPER_FUZZY);
  rightSlipper.position.set(0, -0.08, 0.02);
  rightLeg.add(rightSlipper);
  rightLeg.position.set(0.1, 0, 0);
  legGroup.add(rightLeg);
  outfit.userData.rightLeg = rightLeg;

  const waistband = makeBox(0.36, 0.05, 0.18, COLORS.PAJAMA_BLUSH);
  waistband.position.set(0, 0.58, 0);
  legGroup.add(waistband);

  legGroup.position.y = bodyY;
  outfit.add(legGroup);

  // === TORSO (Cream camisole) ===
  const torso = new THREE.Group();
  const shirtBody = makeBox(0.34, 0.4, 0.18, COLORS.PAJAMA_CREAM);
  shirtBody.position.set(0, 0, 0);
  torso.add(shirtBody);
  const collar = makeBox(0.16, 0.04, 0.1, COLORS.PAJAMA_CREAM);
  collar.position.set(0, 0.22, 0.04);
  torso.add(collar);
  torso.position.y = bodyY + 0.6 + 0.2;
  outfit.add(torso);

  // === ARMS (bare skin below short sleeves) ===
  const armGroup = new THREE.Group();

  const leftArm = new THREE.Group();
  const leftSleeve = makeBox(0.12, 0.12, 0.12, COLORS.PAJAMA_CREAM);
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

  const rightArm = new THREE.Group();
  const rightSleeve = makeBox(0.12, 0.12, 0.12, COLORS.PAJAMA_CREAM);
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

  outfit.visible = true;
  return outfit;
}

export function createCharacter() {
  const group = new THREE.Group();
  const bodyY = 0.6;

  // === SHARED HEAD (always visible) ===
  const headGroup = new THREE.Group();

  const head = makeBox(0.22, 0.24, 0.22, COLORS.SKIN);
  headGroup.add(head);

  // Hair — top
  const hairTop = makeBox(0.24, 0.06, 0.24, COLORS.HAIR);
  hairTop.position.y = 0.14;
  headGroup.add(hairTop);

  // Hair — back
  const hairBack = makeBox(0.24, 0.2, 0.06, COLORS.HAIR);
  hairBack.position.set(0, 0.02, -0.12);
  headGroup.add(hairBack);

  // Hair — sides
  const hairSideL = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideL.position.set(-0.12, 0.04, -0.02);
  headGroup.add(hairSideL);
  const hairSideR = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideR.position.set(0.12, 0.04, -0.02);
  headGroup.add(hairSideR);

  // Bun (for both outfits — ponytail replaced by bun)
  const bun = makeSphere(0.08, 6, 6, COLORS.HAIR);
  bun.position.set(0, 0.12, -0.16);
  headGroup.add(bun);

  // Eyes
  [-0.06, 0.06].forEach(x => {
    const eye = makeSphere(0.02, 4, 4, COLORS.EYES);
    eye.position.set(x, 0.04, 0.12);
    headGroup.add(eye);
  });

  headGroup.position.y = bodyY + 0.6 + 0.4 + 0.15;
  group.add(headGroup);

  // === BUILD OUTFITS ===
  const casualOutfit = buildCasualOutfit(bodyY);
  const runwayOutfit = buildRunwayOutfit(bodyY);
  group.add(casualOutfit);
  group.add(runwayOutfit);

  group.userData.casualOutfit = casualOutfit;
  group.userData.runwayOutfit = runwayOutfit;

  // Point limb refs at the active (casual) outfit initially
  group.userData.leftLeg = casualOutfit.userData.leftLeg;
  group.userData.rightLeg = casualOutfit.userData.rightLeg;
  group.userData.leftArm = casualOutfit.userData.leftArm;
  group.userData.rightArm = casualOutfit.userData.rightArm;

  return group;
}

export function swapOutfit(character, outfitName) {
  const casual = character.userData.casualOutfit;
  const runway = character.userData.runwayOutfit;

  if (outfitName === 'runway') {
    casual.visible = false;
    runway.visible = true;
    character.userData.leftLeg = runway.userData.leftLeg;
    character.userData.rightLeg = runway.userData.rightLeg;
    character.userData.leftArm = runway.userData.leftArm;
    character.userData.rightArm = runway.userData.rightArm;
  } else {
    runway.visible = false;
    casual.visible = true;
    character.userData.leftLeg = casual.userData.leftLeg;
    character.userData.rightLeg = casual.userData.rightLeg;
    character.userData.leftArm = casual.userData.leftArm;
    character.userData.rightArm = casual.userData.rightArm;
  }
}

// Static pose presets for the runway
const POSE_PRESETS = [
  // Pose 0: Hand on hip
  { leftArm: { x: -0.5, z: 0.3 }, rightArm: { x: -0.8, z: -0.4 }, leftLeg: { x: 0 }, rightLeg: { x: 0.15 } },
  // Pose 1: Arms up (victory)
  { leftArm: { x: -2.8, z: 0 }, rightArm: { x: -2.8, z: 0 }, leftLeg: { x: 0 }, rightLeg: { x: 0 } },
  // Pose 2: One arm extended (point)
  { leftArm: { x: -1.5, z: 0.5 }, rightArm: { x: -0.3, z: 0 }, leftLeg: { x: 0.1 }, rightLeg: { x: -0.1 } },
];

export function poseCharacter(group, poseIndex) {
  const pose = POSE_PRESETS[poseIndex % POSE_PRESETS.length];
  const { leftArm, rightArm, leftLeg, rightLeg } = group.userData;
  if (!leftArm) return;

  leftArm.rotation.x = pose.leftArm.x;
  leftArm.rotation.z = pose.leftArm.z || 0;
  rightArm.rotation.x = pose.rightArm.x;
  rightArm.rotation.z = pose.rightArm.z || 0;
  leftLeg.rotation.x = pose.leftLeg.x || 0;
  rightLeg.rotation.x = pose.rightLeg.x || 0;
}

export function resetPose(group) {
  const { leftArm, rightArm, leftLeg, rightLeg } = group.userData;
  if (!leftArm) return;
  leftArm.rotation.x = 0;
  leftArm.rotation.z = 0;
  rightArm.rotation.x = 0;
  rightArm.rotation.z = 0;
  leftLeg.rotation.x = 0;
  rightLeg.rotation.x = 0;
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
    const bob = Math.sin(time * 2) * 0.02;
    leftLeg.rotation.x *= 0.9;
    rightLeg.rotation.x *= 0.9;
    leftArm.rotation.x *= 0.9;
    rightArm.rotation.x *= 0.9;
    group.position.y = bob;
  }
}
