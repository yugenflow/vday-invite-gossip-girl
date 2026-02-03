import * as THREE from 'three';
import { makeBox, makeCylinder, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function buildRunwayOutfit(bodyY) {
  const outfit = new THREE.Group();

  // === BLACK SKATER DRESS COLORS ===
  const MATTE_BLACK = 0x1A1A1A;       // Main dress fabric
  const CHARCOAL_LACE = 0x2A2A2A;     // Lace bralette
  const LACE_DETAIL = 0x333333;       // Lace texture details
  const SKIN_TONE = COLORS.SKIN;
  const SILVER_WHITE = 0xE8E8E8;      // Watch strap
  const GOLD = 0xD4AF37;              // Ring
  const DARK_NAIL = 0x3A2A2A;         // Dark polished nails
  const HAIR_DARK = 0x1A1410;         // Dark brown-black hair

  // === LEGS (bare skin with black heels) ===
  const legGroup = new THREE.Group();

  // Left leg - visible from mid-thigh (skater skirt is short)
  const leftLeg = new THREE.Group();
  const leftThigh = makeBox(0.11, 0.18, 0.11, SKIN_TONE);
  leftThigh.position.y = 0.48;
  leftLeg.add(leftThigh);
  const leftKnee = makeBox(0.1, 0.08, 0.1, SKIN_TONE);
  leftKnee.position.y = 0.34;
  leftLeg.add(leftKnee);
  const leftCalf = makeBox(0.09, 0.26, 0.09, SKIN_TONE);
  leftCalf.position.y = 0.14;
  leftLeg.add(leftCalf);
  // Louboutin stiletto heel (black with signature red sole)
  const LOUBOUTIN_RED = 0xCC0000;
  const leftShoe = makeBox(0.08, 0.035, 0.14, MATTE_BLACK);
  leftShoe.position.set(0, -0.04, 0.02);
  leftLeg.add(leftShoe);
  // Red sole (Louboutin signature)
  const leftSole = makeBox(0.075, 0.008, 0.13, LOUBOUTIN_RED);
  leftSole.position.set(0, -0.06, 0.02);
  leftLeg.add(leftSole);
  const leftHeel = makeCylinder(0.012, 0.016, 0.1, 6, MATTE_BLACK);
  leftHeel.position.set(0, 0.01, -0.04);
  leftLeg.add(leftHeel);
  leftLeg.position.set(-0.08, 0, 0);
  legGroup.add(leftLeg);
  outfit.userData.leftLeg = leftLeg;

  // Right leg
  const rightLeg = new THREE.Group();
  const rightThigh = makeBox(0.11, 0.18, 0.11, SKIN_TONE);
  rightThigh.position.y = 0.48;
  rightLeg.add(rightThigh);
  const rightKnee = makeBox(0.1, 0.08, 0.1, SKIN_TONE);
  rightKnee.position.y = 0.34;
  rightLeg.add(rightKnee);
  const rightCalf = makeBox(0.09, 0.26, 0.09, SKIN_TONE);
  rightCalf.position.y = 0.14;
  rightLeg.add(rightCalf);
  const rightShoe = makeBox(0.08, 0.035, 0.14, MATTE_BLACK);
  rightShoe.position.set(0, -0.04, 0.02);
  rightLeg.add(rightShoe);
  // Red sole (Louboutin signature)
  const rightSole = makeBox(0.075, 0.008, 0.13, LOUBOUTIN_RED);
  rightSole.position.set(0, -0.06, 0.02);
  rightLeg.add(rightSole);
  const rightHeel = makeCylinder(0.012, 0.016, 0.1, 6, MATTE_BLACK);
  rightHeel.position.set(0, 0.01, -0.04);
  rightLeg.add(rightHeel);
  rightLeg.position.set(0.08, 0, 0);
  legGroup.add(rightLeg);
  outfit.userData.rightLeg = rightLeg;

  legGroup.position.y = bodyY;
  outfit.add(legGroup);

  // === FLARED SKATER SKIRT ===
  const skirtGroup = new THREE.Group();

  // Skirt - flared A-line shape (wider at bottom)
  const skirtTop = makeBox(0.28, 0.06, 0.14, MATTE_BLACK);
  skirtTop.position.set(0, 0.08, 0);
  skirtGroup.add(skirtTop);

  // Flared section
  const skirtMid = makeBox(0.32, 0.08, 0.16, MATTE_BLACK);
  skirtMid.position.set(0, 0.02, 0);
  skirtGroup.add(skirtMid);

  const skirtBottom = makeBox(0.36, 0.08, 0.18, MATTE_BLACK);
  skirtBottom.position.set(0, -0.05, 0);
  skirtGroup.add(skirtBottom);

  // Soft ruffle/pleat detail at hem
  const ruffleL = makeBox(0.12, 0.03, 0.06, MATTE_BLACK);
  ruffleL.position.set(-0.12, -0.1, 0.06);
  ruffleL.rotation.z = 0.1;
  skirtGroup.add(ruffleL);
  const ruffleR = makeBox(0.12, 0.03, 0.06, MATTE_BLACK);
  ruffleR.position.set(0.12, -0.1, 0.06);
  ruffleR.rotation.z = -0.1;
  skirtGroup.add(ruffleR);

  skirtGroup.position.y = bodyY + 0.58;
  outfit.add(skirtGroup);

  // === FITTED BODICE WITH RUCHED WAIST ===
  const bodiceGroup = new THREE.Group();

  // Main bodice (black, fitted)
  const bodice = makeBox(0.28, 0.22, 0.14, MATTE_BLACK);
  bodice.position.set(0, 0.05, 0);
  bodiceGroup.add(bodice);

  // Ruched/gathered waist detail (horizontal texture lines)
  for (let i = 0; i < 4; i++) {
    const ruche = makeBox(0.29, 0.012, 0.01, 0x252525);
    ruche.position.set(0, -0.02 + i * 0.025, 0.072);
    bodiceGroup.add(ruche);
  }

  // Deep V-neckline (skin showing)
  const vneckSkin = makeBox(0.1, 0.14, 0.05, SKIN_TONE);
  vneckSkin.position.set(0, 0.14, 0.055);
  bodiceGroup.add(vneckSkin);

  // === LACE BRALETTE visible in V-neck ===
  const laceMat = new THREE.MeshLambertMaterial({
    color: CHARCOAL_LACE,
    transparent: true,
    opacity: 0.85,
    flatShading: true
  });

  // Bralette base
  const bralette = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.02), laceMat);
  bralette.position.set(0, 0.1, 0.065);
  bodiceGroup.add(bralette);

  // Scalloped lace edge detail (small bumps along top)
  const scallop1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 4, 4), laceMat);
  scallop1.position.set(-0.04, 0.14, 0.065);
  bodiceGroup.add(scallop1);
  const scallop2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 4, 4), laceMat);
  scallop2.position.set(0, 0.145, 0.065);
  bodiceGroup.add(scallop2);
  const scallop3 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 4, 4), laceMat);
  scallop3.position.set(0.04, 0.14, 0.065);
  bodiceGroup.add(scallop3);

  // Lace texture details (small dots for floral pattern effect)
  const laceDotMat = new THREE.MeshLambertMaterial({ color: LACE_DETAIL, flatShading: true });
  const lacePositions = [
    [-0.03, 0.1], [0.03, 0.1], [0, 0.08], [-0.05, 0.08], [0.05, 0.08]
  ];
  lacePositions.forEach(([x, y]) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), laceDotMat);
    dot.position.set(x, y, 0.075);
    bodiceGroup.add(dot);
  });

  // V-neck dress edges framing the bralette
  const vneckEdgeL = makeBox(0.04, 0.16, 0.02, MATTE_BLACK);
  vneckEdgeL.position.set(-0.08, 0.12, 0.065);
  vneckEdgeL.rotation.z = 0.25;
  bodiceGroup.add(vneckEdgeL);
  const vneckEdgeR = makeBox(0.04, 0.16, 0.02, MATTE_BLACK);
  vneckEdgeR.position.set(0.08, 0.12, 0.065);
  vneckEdgeR.rotation.z = -0.25;
  bodiceGroup.add(vneckEdgeR);

  bodiceGroup.position.y = bodyY + 0.6 + 0.18;
  outfit.add(bodiceGroup);

  // === LONG SLEEVES ===
  const armGroup = new THREE.Group();

  // Left arm - fitted black long sleeve
  const leftArm = new THREE.Group();
  const leftShoulder = makeBox(0.1, 0.08, 0.1, MATTE_BLACK);
  leftShoulder.position.y = 0.02;
  leftArm.add(leftShoulder);
  const leftUpperSleeve = makeBox(0.09, 0.18, 0.09, MATTE_BLACK);
  leftUpperSleeve.position.y = -0.12;
  leftArm.add(leftUpperSleeve);
  const leftLowerSleeve = makeBox(0.085, 0.18, 0.085, MATTE_BLACK);
  leftLowerSleeve.position.y = -0.3;
  leftArm.add(leftLowerSleeve);
  // Hand with dark nails
  const leftHand = makeBox(0.065, 0.07, 0.065, SKIN_TONE);
  leftHand.position.y = -0.43;
  leftArm.add(leftHand);
  // Dark polished nails (small detail)
  const leftNails = makeBox(0.05, 0.015, 0.02, DARK_NAIL);
  leftNails.position.set(0, -0.46, 0.025);
  leftArm.add(leftNails);
  // Silver/white watch on left wrist
  const watchBand = makeBox(0.09, 0.025, 0.09, SILVER_WHITE);
  watchBand.position.set(0, -0.38, 0);
  leftArm.add(watchBand);
  const watchFace = makeBox(0.045, 0.015, 0.045, 0xFFFFF8);
  watchFace.position.set(0, -0.38, 0.03);
  leftArm.add(watchFace);
  // Gold ring on ring finger
  const ring = makeCylinder(0.012, 0.012, 0.01, 6, GOLD);
  ring.position.set(-0.015, -0.45, 0);
  leftArm.add(ring);

  leftArm.position.set(-0.2, 0.16, 0);
  armGroup.add(leftArm);
  outfit.userData.leftArm = leftArm;

  // Right arm
  const rightArm = new THREE.Group();
  const rightShoulder = makeBox(0.1, 0.08, 0.1, MATTE_BLACK);
  rightShoulder.position.y = 0.02;
  rightArm.add(rightShoulder);
  const rightUpperSleeve = makeBox(0.09, 0.18, 0.09, MATTE_BLACK);
  rightUpperSleeve.position.y = -0.12;
  rightArm.add(rightUpperSleeve);
  const rightLowerSleeve = makeBox(0.085, 0.18, 0.085, MATTE_BLACK);
  rightLowerSleeve.position.y = -0.3;
  rightArm.add(rightLowerSleeve);
  const rightHand = makeBox(0.065, 0.07, 0.065, SKIN_TONE);
  rightHand.position.y = -0.43;
  rightArm.add(rightHand);
  const rightNails = makeBox(0.05, 0.015, 0.02, DARK_NAIL);
  rightNails.position.set(0, -0.46, 0.025);
  rightArm.add(rightNails);

  rightArm.position.set(0.2, 0.16, 0);
  armGroup.add(rightArm);
  outfit.userData.rightArm = rightArm;

  armGroup.position.y = bodyY + 0.6 + 0.18;
  outfit.add(armGroup);

  // === GOLD DROP EARRINGS (visible with bun hairstyle) ===
  const headY = bodyY + 0.6 + 0.4 + 0.19;
  const earringMat = new THREE.MeshLambertMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.15 });

  // Left earring - gold drop style
  const earringLGroup = new THREE.Group();
  const earringLStud = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), earringMat);
  earringLStud.position.set(0, 0, 0);
  earringLGroup.add(earringLStud);
  // Small drop/dangle
  const earringLDrop = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), earringMat);
  earringLDrop.position.set(0, -0.04, 0);
  earringLGroup.add(earringLDrop);
  // Connecting bar
  const earringLBar = makeCylinder(0.004, 0.004, 0.03, 4, GOLD);
  earringLBar.position.set(0, -0.02, 0);
  earringLGroup.add(earringLBar);
  earringLGroup.position.set(-0.125, 0, 0.04);

  // Right earring - gold drop style
  const earringRGroup = new THREE.Group();
  const earringRStud = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), earringMat);
  earringRStud.position.set(0, 0, 0);
  earringRGroup.add(earringRStud);
  const earringRDrop = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), earringMat);
  earringRDrop.position.set(0, -0.04, 0);
  earringRGroup.add(earringRDrop);
  const earringRBar = makeCylinder(0.004, 0.004, 0.03, 4, GOLD);
  earringRBar.position.set(0, -0.02, 0);
  earringRGroup.add(earringRBar);
  earringRGroup.position.set(0.125, 0, 0.04);

  const earringsGroup = new THREE.Group();
  earringsGroup.add(earringLGroup);
  earringsGroup.add(earringRGroup);
  earringsGroup.position.y = headY;
  outfit.add(earringsGroup);

  // === ELEGANT BUN HAIRSTYLE (same as casual but slightly more polished) ===
  const runwayHairGroup = new THREE.Group();

  // Hair top - sleek and smooth
  const hairTop = makeBox(0.24, 0.06, 0.24, HAIR_DARK);
  hairTop.position.y = 0.14;
  runwayHairGroup.add(hairTop);

  // Hair back
  const hairBack = makeBox(0.24, 0.2, 0.06, HAIR_DARK);
  hairBack.position.set(0, 0.02, -0.12);
  runwayHairGroup.add(hairBack);

  // Hair sides (minimal, pulled back into bun)
  const hairSideL = makeBox(0.04, 0.14, 0.18, HAIR_DARK);
  hairSideL.position.set(-0.12, 0.04, -0.02);
  runwayHairGroup.add(hairSideL);
  const hairSideR = makeBox(0.04, 0.14, 0.18, HAIR_DARK);
  hairSideR.position.set(0.12, 0.04, -0.02);
  runwayHairGroup.add(hairSideR);

  // Elegant bun (slightly larger and more polished)
  const bun = makeSphere(0.09, 8, 8, HAIR_DARK);
  bun.position.set(0, 0.1, -0.17);
  runwayHairGroup.add(bun);

  // Bun wrap detail (subtle ring around bun)
  const bunWrap = makeCylinder(0.095, 0.095, 0.02, 8, 0x252018);
  bunWrap.position.set(0, 0.1, -0.17);
  bunWrap.rotation.x = Math.PI / 2;
  runwayHairGroup.add(bunWrap);

  runwayHairGroup.position.y = headY;
  outfit.add(runwayHairGroup);
  outfit.userData.runwayHair = runwayHairGroup;

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

  // === CASUAL HAIRSTYLE (bun) ===
  const casualHairGroup = new THREE.Group();

  // Hair — top
  const hairTop = makeBox(0.24, 0.06, 0.24, COLORS.HAIR);
  hairTop.position.y = 0.14;
  casualHairGroup.add(hairTop);

  // Hair — back
  const hairBack = makeBox(0.24, 0.2, 0.06, COLORS.HAIR);
  hairBack.position.set(0, 0.02, -0.12);
  casualHairGroup.add(hairBack);

  // Hair — sides
  const hairSideL = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideL.position.set(-0.12, 0.04, -0.02);
  casualHairGroup.add(hairSideL);
  const hairSideR = makeBox(0.04, 0.16, 0.2, COLORS.HAIR);
  hairSideR.position.set(0.12, 0.04, -0.02);
  casualHairGroup.add(hairSideR);

  // Bun
  const bun = makeSphere(0.08, 6, 6, COLORS.HAIR);
  bun.position.set(0, 0.12, -0.16);
  casualHairGroup.add(bun);

  headGroup.add(casualHairGroup);

  // Eyes
  [-0.06, 0.06].forEach(x => {
    const eye = makeSphere(0.02, 4, 4, COLORS.EYES);
    eye.position.set(x, 0.04, 0.12);
    headGroup.add(eye);
  });

  headGroup.position.y = bodyY + 0.6 + 0.4 + 0.15;
  group.add(headGroup);

  // Store hair reference for swapping
  group.userData.casualHair = casualHairGroup;
  group.userData.headGroup = headGroup;

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
  const casualHair = character.userData.casualHair;
  const runwayHair = runway.userData.runwayHair;

  if (outfitName === 'runway') {
    casual.visible = false;
    runway.visible = true;
    // Swap hairstyle - hide casual bun, show polished runway bun
    if (casualHair) casualHair.visible = false;
    if (runwayHair) runwayHair.visible = true;
    character.userData.leftLeg = runway.userData.leftLeg;
    character.userData.rightLeg = runway.userData.rightLeg;
    character.userData.leftArm = runway.userData.leftArm;
    character.userData.rightArm = runway.userData.rightArm;
  } else {
    runway.visible = false;
    casual.visible = true;
    // Swap hairstyle back - show casual bun, hide runway bun
    if (casualHair) casualHair.visible = true;
    if (runwayHair) runwayHair.visible = false;
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

export function applyMakeup(group) {
  // Find the head group (first child that contains eyes)
  let headGroup = null;
  for (const child of group.children) {
    if (child.isGroup && child.position.y > 1.5) {
      headGroup = child;
      break;
    }
  }
  if (!headGroup) return;

  // Add blush to cheeks (subtle pink circles)
  const blushMat = new THREE.MeshLambertMaterial({
    color: 0xF5A0A0,
    transparent: true,
    opacity: 0.6,
    flatShading: true,
  });
  const blushGeo = new THREE.SphereGeometry(0.035, 6, 6);

  // Left cheek blush
  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(-0.09, -0.02, 0.1);
  leftBlush.scale.set(1, 0.6, 0.5);
  headGroup.add(leftBlush);

  // Right cheek blush
  const rightBlush = new THREE.Mesh(blushGeo, blushMat);
  rightBlush.position.set(0.09, -0.02, 0.1);
  rightBlush.scale.set(1, 0.6, 0.5);
  headGroup.add(rightBlush);

  // Add red lipstick (visible on face - casual doesn't have it)
  const lipstickMat = new THREE.MeshLambertMaterial({
    color: 0xCC2244,
    flatShading: true,
  });
  const lips = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.03), lipstickMat);
  lips.position.set(0, -0.06, 0.11);
  headGroup.add(lips);

  // Add subtle eyeshadow (darker area above eyes)
  const eyeshadowMat = new THREE.MeshLambertMaterial({
    color: 0x8B6B8B,
    transparent: true,
    opacity: 0.4,
    flatShading: true,
  });
  const eyeshadowGeo = new THREE.BoxGeometry(0.05, 0.015, 0.01);

  const leftEyeshadow = new THREE.Mesh(eyeshadowGeo, eyeshadowMat);
  leftEyeshadow.position.set(-0.06, 0.06, 0.115);
  headGroup.add(leftEyeshadow);

  const rightEyeshadow = new THREE.Mesh(eyeshadowGeo, eyeshadowMat);
  rightEyeshadow.position.set(0.06, 0.06, 0.115);
  headGroup.add(rightEyeshadow);

  // Mark makeup as applied
  group.userData.makeupApplied = true;
}
