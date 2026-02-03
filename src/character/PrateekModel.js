import * as THREE from 'three';
import { makeBox, makeCylinder, makeSphere } from '../utils/LowPolyHelpers.js';

// Prateek's character - tall guy with black hair, tuxedo
export function createPrateek() {
  const group = new THREE.Group();

  // Colors
  const SKIN_FAIR = 0xFFDBC4;
  const HAIR_BLACK = 0x1A1A1A;
  const TUXEDO_BLACK = 0x1A1A1A;
  const SHIRT_WHITE = 0xFFFFF8;
  const BOWTIE_RED = 0xCC2222;
  const SHOE_BLACK = 0x111111;

  // === HEAD ===
  const headGroup = new THREE.Group();

  // Head base
  const head = makeBox(0.24, 0.26, 0.24, SKIN_FAIR);
  headGroup.add(head);

  // Medium-length voluminous hair - more volume on top and sides
  const hairTop = makeBox(0.26, 0.08, 0.26, HAIR_BLACK);
  hairTop.position.set(0, 0.16, 0);
  headGroup.add(hairTop);

  // Hair volume - extra layers for voluminous look
  const hairVol1 = makeBox(0.24, 0.05, 0.24, HAIR_BLACK);
  hairVol1.position.set(0, 0.2, 0);
  headGroup.add(hairVol1);

  const hairVol2 = makeBox(0.2, 0.03, 0.2, HAIR_BLACK);
  hairVol2.position.set(0, 0.23, 0.02);
  headGroup.add(hairVol2);

  // Hair sides (medium length, covering ears partially)
  const hairSideL = makeBox(0.05, 0.14, 0.2, HAIR_BLACK);
  hairSideL.position.set(-0.13, 0.06, 0);
  headGroup.add(hairSideL);

  const hairSideR = makeBox(0.05, 0.14, 0.2, HAIR_BLACK);
  hairSideR.position.set(0.13, 0.06, 0);
  headGroup.add(hairSideR);

  // Hair back
  const hairBack = makeBox(0.26, 0.16, 0.06, HAIR_BLACK);
  hairBack.position.set(0, 0.06, -0.13);
  headGroup.add(hairBack);

  // Some hair texture/waves
  const hairWave1 = makeBox(0.08, 0.04, 0.06, 0x252525);
  hairWave1.position.set(-0.06, 0.18, 0.1);
  headGroup.add(hairWave1);

  const hairWave2 = makeBox(0.07, 0.03, 0.05, 0x252525);
  hairWave2.position.set(0.05, 0.19, 0.08);
  headGroup.add(hairWave2);

  // Eyes
  const eyeL = makeSphere(0.022, 4, 4, 0x3D2314);
  eyeL.position.set(-0.06, 0.04, 0.12);
  headGroup.add(eyeL);

  const eyeR = makeSphere(0.022, 4, 4, 0x3D2314);
  eyeR.position.set(0.06, 0.04, 0.12);
  headGroup.add(eyeR);

  // Clean-shaven look (beard removed for cleaner appearance)

  // Subtle smile
  const smile = makeBox(0.06, 0.015, 0.02, 0xCC8888);
  smile.position.set(0, -0.05, 0.125);
  headGroup.add(smile);

  headGroup.position.y = 1.55;
  group.add(headGroup);

  // === NECK ===
  const neck = makeCylinder(0.06, 0.06, 0.1, 6, SKIN_FAIR);
  neck.position.y = 1.4;
  group.add(neck);

  // === TORSO (Tuxedo jacket) ===
  const torsoGroup = new THREE.Group();

  // Main jacket body
  const jacketBody = makeBox(0.42, 0.5, 0.22, TUXEDO_BLACK);
  torsoGroup.add(jacketBody);

  // White shirt visible at chest (V opening of jacket)
  const shirtFront = makeBox(0.14, 0.35, 0.02, SHIRT_WHITE);
  shirtFront.position.set(0, 0.05, 0.1);
  torsoGroup.add(shirtFront);

  // Jacket lapels
  const lapelL = makeBox(0.08, 0.3, 0.03, TUXEDO_BLACK);
  lapelL.position.set(-0.1, 0.08, 0.1);
  lapelL.rotation.z = -0.15;
  torsoGroup.add(lapelL);

  const lapelR = makeBox(0.08, 0.3, 0.03, TUXEDO_BLACK);
  lapelR.position.set(0.1, 0.08, 0.1);
  lapelR.rotation.z = 0.15;
  torsoGroup.add(lapelR);

  // Red bow tie
  const bowtieCenter = makeBox(0.04, 0.03, 0.03, BOWTIE_RED);
  bowtieCenter.position.set(0, 0.2, 0.115);
  torsoGroup.add(bowtieCenter);

  const bowtieL = makeBox(0.05, 0.04, 0.025, BOWTIE_RED);
  bowtieL.position.set(-0.04, 0.2, 0.115);
  bowtieL.rotation.z = 0.3;
  torsoGroup.add(bowtieL);

  const bowtieR = makeBox(0.05, 0.04, 0.025, BOWTIE_RED);
  bowtieR.position.set(0.04, 0.2, 0.115);
  bowtieR.rotation.z = -0.3;
  torsoGroup.add(bowtieR);

  // Jacket buttons
  const button1 = makeCylinder(0.015, 0.015, 0.01, 6, 0x333333);
  button1.position.set(0, 0, 0.115);
  button1.rotation.x = Math.PI / 2;
  torsoGroup.add(button1);

  const button2 = makeCylinder(0.015, 0.015, 0.01, 6, 0x333333);
  button2.position.set(0, -0.1, 0.115);
  button2.rotation.x = Math.PI / 2;
  torsoGroup.add(button2);

  // Pocket square (red to match bow tie)
  const pocketSquare = makeBox(0.04, 0.03, 0.01, BOWTIE_RED);
  pocketSquare.position.set(-0.13, 0.15, 0.115);
  torsoGroup.add(pocketSquare);

  torsoGroup.position.y = 1.1;
  group.add(torsoGroup);

  // === ARMS ===
  // Left arm (will hold roses, bent at elbow)
  const leftArmGroup = new THREE.Group();

  const leftShoulder = makeBox(0.12, 0.14, 0.12, TUXEDO_BLACK);
  leftArmGroup.add(leftShoulder);

  const leftUpperArm = makeBox(0.1, 0.22, 0.1, TUXEDO_BLACK);
  leftUpperArm.position.y = -0.18;
  leftArmGroup.add(leftUpperArm);

  const leftLowerArm = makeBox(0.09, 0.2, 0.09, TUXEDO_BLACK);
  leftLowerArm.position.set(0, -0.38, 0);
  leftArmGroup.add(leftLowerArm);

  // Shirt cuff visible
  const leftCuff = makeBox(0.095, 0.03, 0.095, SHIRT_WHITE);
  leftCuff.position.set(0, -0.48, 0);
  leftArmGroup.add(leftCuff);

  // Hand
  const leftHand = makeBox(0.07, 0.08, 0.05, SKIN_FAIR);
  leftHand.position.set(0, -0.54, 0);
  leftArmGroup.add(leftHand);

  leftArmGroup.position.set(-0.28, 1.28, 0);
  group.add(leftArmGroup);

  // Right arm (resting, supporting head in lounging pose)
  const rightArmGroup = new THREE.Group();

  const rightShoulder = makeBox(0.12, 0.14, 0.12, TUXEDO_BLACK);
  rightArmGroup.add(rightShoulder);

  const rightUpperArm = makeBox(0.1, 0.22, 0.1, TUXEDO_BLACK);
  rightUpperArm.position.y = -0.18;
  rightArmGroup.add(rightUpperArm);

  const rightLowerArm = makeBox(0.09, 0.2, 0.09, TUXEDO_BLACK);
  rightLowerArm.position.set(0, -0.38, 0);
  rightArmGroup.add(rightLowerArm);

  const rightCuff = makeBox(0.095, 0.03, 0.095, SHIRT_WHITE);
  rightCuff.position.set(0, -0.48, 0);
  rightArmGroup.add(rightCuff);

  const rightHand = makeBox(0.07, 0.08, 0.05, SKIN_FAIR);
  rightHand.position.set(0, -0.54, 0);
  rightArmGroup.add(rightHand);

  rightArmGroup.position.set(0.28, 1.28, 0);
  group.add(rightArmGroup);

  // === LEGS (Tuxedo pants) ===
  const legGroup = new THREE.Group();

  // Left leg
  const leftLeg = new THREE.Group();
  const leftThigh = makeBox(0.14, 0.32, 0.14, TUXEDO_BLACK);
  leftThigh.position.y = 0.4;
  leftLeg.add(leftThigh);

  const leftShin = makeBox(0.12, 0.32, 0.12, TUXEDO_BLACK);
  leftShin.position.y = 0.08;
  leftLeg.add(leftShin);

  // Black dress shoe
  const leftShoe = makeBox(0.1, 0.05, 0.18, SHOE_BLACK);
  leftShoe.position.set(0, -0.12, 0.03);
  leftLeg.add(leftShoe);

  leftLeg.position.set(-0.12, 0, 0);
  legGroup.add(leftLeg);

  // Right leg
  const rightLeg = new THREE.Group();
  const rightThigh = makeBox(0.14, 0.32, 0.14, TUXEDO_BLACK);
  rightThigh.position.y = 0.4;
  rightLeg.add(rightThigh);

  const rightShin = makeBox(0.12, 0.32, 0.12, TUXEDO_BLACK);
  rightShin.position.y = 0.08;
  rightLeg.add(rightShin);

  const rightShoe = makeBox(0.1, 0.05, 0.18, SHOE_BLACK);
  rightShoe.position.set(0, -0.12, 0.03);
  rightLeg.add(rightShoe);

  rightLeg.position.set(0.12, 0, 0);
  legGroup.add(rightLeg);

  // Waistband / belt area
  const belt = makeBox(0.4, 0.05, 0.2, 0x222222);
  belt.position.y = 0.58;
  legGroup.add(belt);

  // Belt buckle (silver)
  const buckle = makeBox(0.06, 0.04, 0.02, 0xC0C0C0);
  buckle.position.set(0, 0.58, 0.11);
  legGroup.add(buckle);

  legGroup.position.y = 0.45;
  group.add(legGroup);

  // === SINGLE ROSE (for proposal) ===
  const rose = createSingleRose();
  rose.position.set(-0.35, 0.8, 0.15);
  group.add(rose);
  group.userData.rose = rose;

  // Scale the entire model to match real height ratio
  // Akshata: 5'4" (64"), Prateek: 5'11" (71") → ratio = 71/64 ≈ 1.11
  group.scale.set(1.11, 1.11, 1.11);

  // Store references for posing
  group.userData.leftArm = leftArmGroup;
  group.userData.rightArm = rightArmGroup;
  group.userData.leftLeg = leftLeg;
  group.userData.rightLeg = rightLeg;
  group.userData.head = headGroup;

  return group;
}

function createSingleRose() {
  const rose = new THREE.Group();

  const ROSE_RED = 0xCC1144;
  const STEM_GREEN = 0x2D5A27;
  const LEAF_GREEN = 0x3D7A37;

  // Long stem
  const stem = makeCylinder(0.012, 0.012, 0.35, 6, STEM_GREEN);
  stem.position.y = 0;
  rose.add(stem);

  // Rose bloom at top
  const bloomY = 0.2;

  // Inner petals (center)
  const inner = makeSphere(0.035, 8, 8, ROSE_RED);
  inner.position.set(0, bloomY, 0);
  rose.add(inner);

  // Outer petals
  for (let p = 0; p < 5; p++) {
    const petal = makeSphere(0.028, 6, 6, ROSE_RED);
    const angle = (p / 5) * Math.PI * 2;
    petal.position.set(
      Math.cos(angle) * 0.025,
      bloomY - 0.015,
      Math.sin(angle) * 0.025
    );
    petal.scale.set(1.3, 0.7, 1.3);
    rose.add(petal);
  }

  // Sepals (green bits under bloom)
  for (let s = 0; s < 4; s++) {
    const sepal = makeBox(0.02, 0.03, 0.008, STEM_GREEN);
    const angle = (s / 4) * Math.PI * 2;
    sepal.position.set(
      Math.cos(angle) * 0.03,
      bloomY - 0.04,
      Math.sin(angle) * 0.03
    );
    sepal.rotation.z = angle;
    rose.add(sepal);
  }

  // Leaves on stem
  const leaf1 = makeBox(0.04, 0.015, 0.025, LEAF_GREEN);
  leaf1.position.set(0.03, 0.02, 0);
  leaf1.rotation.z = -0.5;
  rose.add(leaf1);

  const leaf2 = makeBox(0.035, 0.012, 0.02, LEAF_GREEN);
  leaf2.position.set(-0.025, -0.08, 0);
  leaf2.rotation.z = 0.5;
  rose.add(leaf2);

  return rose;
}

// Apply standing proposal pose - standing upright, one arm extended with rose
export function applyProposalPose(prateek) {
  const { leftArm, rightArm, head, rose } = prateek.userData;

  // Right arm extended forward, holding the rose out toward her
  if (rightArm) {
    rightArm.rotation.x = -1.3; // Arm forward
    rightArm.rotation.z = 0.2;
  }

  // Left arm relaxed at side, slightly bent
  if (leftArm) {
    leftArm.rotation.x = 0.15;
    leftArm.rotation.z = 0.1;
  }

  // Head looking forward toward her
  if (head) {
    head.rotation.x = 0.05;
  }

  // NOTE: Don't rotate legs - keep standing pose intact

  // Position rose in the extended right hand area (unscaled coordinates)
  // Rose bloom points away from Prateek toward the recipient
  if (rose) {
    rose.position.set(0.35, 1.1, 0.6);
    rose.rotation.x = 1.4;  // Tilt so bloom points outward
    rose.rotation.z = -0.3;
  }
}
