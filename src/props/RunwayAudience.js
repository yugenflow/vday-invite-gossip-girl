import * as THREE from 'three';
import { makeBox, makeSphere, makeCylinder } from '../utils/LowPolyHelpers.js';

// Create a row of chairs on one side
export function createChairRow(count, spacing, side) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const chair = createFoldingChair();
    chair.position.set(0, 0, i * spacing);
    group.add(chair);

    // Seated audience figure on every chair
    const person = createSeatedPerson();
    person.position.set(0, 0.42, i * spacing);
    group.add(person);
  }
  return group;
}

function createFoldingChair() {
  const chair = new THREE.Group();
  const seatColor = 0x1A1A1A;
  const legColor = 0x888888;

  // Seat
  const seat = makeBox(0.4, 0.04, 0.38, seatColor);
  seat.position.set(0, 0.42, 0);
  chair.add(seat);

  // Back rest
  const back = makeBox(0.4, 0.35, 0.03, seatColor);
  back.position.set(0, 0.62, -0.17);
  chair.add(back);

  // Legs (4)
  const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.42, 4);
  const legMat = new THREE.MeshLambertMaterial({ color: legColor, flatShading: true });
  const offsets = [
    [-0.16, 0.15], [0.16, 0.15], [-0.16, -0.15], [0.16, -0.15]
  ];
  offsets.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.21, z);
    chair.add(leg);
  });

  return chair;
}

function createSeatedPerson() {
  const person = new THREE.Group();

  // Random outfit colors for variety
  const outfitColors = [0x2D1B4E, 0x8B1A4A, 0x1A3C5E, 0x4A1A2A, 0x1A1A1A, 0xD4AF37, 0x5C2D91, 0xB8860B];
  const skinTones = [0xDEB887, 0xC49A6C, 0xF5DEB3, 0xD2A679];
  const hairColors = [0x1A1A1A, 0x3B2507, 0x654321, 0x8B4513];

  const outfit = outfitColors[Math.floor(Math.random() * outfitColors.length)];
  const skin = skinTones[Math.floor(Math.random() * skinTones.length)];
  const hair = hairColors[Math.floor(Math.random() * hairColors.length)];

  // Head
  const head = makeSphere(0.08, 6, 6, skin);
  head.position.set(0, 0.55, 0);
  person.add(head);

  // Hair
  const hairMesh = makeSphere(0.085, 6, 6, hair);
  hairMesh.position.set(0, 0.58, -0.01);
  hairMesh.scale.set(1, 0.8, 1);
  person.add(hairMesh);

  // Torso (seated, so shorter)
  const torso = makeBox(0.22, 0.28, 0.16, outfit);
  torso.position.set(0, 0.32, 0);
  person.add(torso);

  // Upper legs (horizontal, seated)
  const leftThigh = makeBox(0.09, 0.06, 0.22, outfit);
  leftThigh.position.set(-0.07, 0.05, 0.08);
  person.add(leftThigh);

  const rightThigh = makeBox(0.09, 0.06, 0.22, outfit);
  rightThigh.position.set(0.07, 0.05, 0.08);
  person.add(rightThigh);

  // Lower legs (vertical, hanging)
  const leftShin = makeBox(0.07, 0.2, 0.07, skin);
  leftShin.position.set(-0.07, -0.08, 0.17);
  person.add(leftShin);

  const rightShin = makeBox(0.07, 0.2, 0.07, skin);
  rightShin.position.set(0.07, -0.08, 0.17);
  person.add(rightShin);

  // Shoes
  const shoeColor = Math.random() > 0.5 ? 0x1A1A1A : 0x4A2020;
  const leftShoe = makeBox(0.07, 0.04, 0.12, shoeColor);
  leftShoe.position.set(-0.07, -0.2, 0.2);
  person.add(leftShoe);
  const rightShoe = makeBox(0.07, 0.04, 0.12, shoeColor);
  rightShoe.position.set(0.07, -0.2, 0.2);
  person.add(rightShoe);

  return person;
}

// Create a photographer figure with camera (standing)
export function createPhotographer(x, y, z, rotY) {
  const group = new THREE.Group();

  const skin = 0xDEB887;
  const outfitColor = 0x1A1A1A; // photographers in black

  // Legs
  const leftLeg = makeBox(0.1, 0.4, 0.1, 0x222233);
  leftLeg.position.set(-0.07, 0.2, 0);
  group.add(leftLeg);
  const rightLeg = makeBox(0.1, 0.4, 0.1, 0x222233);
  rightLeg.position.set(0.07, 0.2, 0);
  group.add(rightLeg);

  // Torso
  const torso = makeBox(0.25, 0.35, 0.15, outfitColor);
  torso.position.set(0, 0.58, 0);
  group.add(torso);

  // Head
  const head = makeSphere(0.09, 6, 6, skin);
  head.position.set(0, 0.88, 0);
  group.add(head);

  // Hair
  const hair = makeSphere(0.095, 6, 6, 0x1A1A1A);
  hair.position.set(0, 0.91, -0.01);
  hair.scale.set(1, 0.7, 1);
  group.add(hair);

  // Arms (holding camera up to face)
  const leftArm = makeBox(0.08, 0.28, 0.08, outfitColor);
  leftArm.position.set(-0.17, 0.7, 0.08);
  leftArm.rotation.x = -0.8;
  group.add(leftArm);
  const rightArm = makeBox(0.08, 0.28, 0.08, outfitColor);
  rightArm.position.set(0.17, 0.7, 0.08);
  rightArm.rotation.x = -0.8;
  group.add(rightArm);

  // Camera body (held at face level)
  const camBody = makeBox(0.16, 0.1, 0.1, 0x333333);
  camBody.position.set(0, 0.82, 0.18);
  group.add(camBody);

  // Lens
  const lens = makeCylinder(0.03, 0.04, 0.08, 8, 0x111111);
  lens.position.set(0, 0.82, 0.26);
  lens.rotation.x = Math.PI / 2;
  group.add(lens);

  // Flash unit on top of camera
  const flash = makeBox(0.08, 0.04, 0.04, 0xEEEEEE);
  flash.position.set(0, 0.9, 0.18);
  group.add(flash);

  // Flash light (emissive, will be toggled for flash effect)
  const flashBulb = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.02, 0.04),
    new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0,
    })
  );
  flashBulb.position.set(0, 0.93, 0.18);
  group.add(flashBulb);
  group.userData.flashBulb = flashBulb;

  // Flash point light (off by default)
  const flashLight = new THREE.PointLight(0xFFFFFF, 0, 8);
  flashLight.position.set(0, 0.93, 0.2);
  group.add(flashLight);
  group.userData.flashLight = flashLight;

  group.position.set(x, y, z);
  group.rotation.y = rotY || 0;
  return group;
}
