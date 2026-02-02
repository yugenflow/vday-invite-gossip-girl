import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS, BEDROOM, DOOR } from '../constants.js';
import { createBed } from '../props/Bed.js';
import { createDesk } from '../props/Desk.js';
import { createBookRack } from '../props/BookRack.js';
import { createMirror } from '../props/Mirror.js';
import { createKeyboardStand } from '../props/KeyboardStand.js';
import { createLabrador } from '../props/Labrador.js';
import { createPaintings } from '../props/Paintings.js';
import { createTrophy, createMedal } from '../props/Trophies.js';
import { createLamp } from '../props/Lamp.js';
import { createFairyLights } from '../props/FairyLights.js';
import { createWardrobe } from '../props/Wardrobe.js';

export function createBedroomScene() {
  const group = new THREE.Group();
  const ox = BEDROOM.ORIGIN.x;
  const oz = BEDROOM.ORIGIN.z;
  const W = BEDROOM.WIDTH;
  const D = BEDROOM.DEPTH;
  const H = BEDROOM.HEIGHT;

  // Floor
  const floor = makeBox(W, 0.1, D, COLORS.FLOOR_WOOD);
  floor.position.set(ox, -0.05, oz);
  group.add(floor);

  // Ceiling
  const ceiling = makeBox(W, 0.1, D, COLORS.CEILING);
  ceiling.position.set(ox, H + 0.05, oz);
  group.add(ceiling);

  // Walls
  // Back wall (+Z)
  const backWall = makeBox(W, H, 0.15, COLORS.WALL);
  backWall.position.set(ox, H / 2, oz + D / 2 + 0.075);
  group.add(backWall);

  // Left wall (-X)
  const leftWall = makeBox(0.15, H, D, COLORS.WALL);
  leftWall.position.set(ox - W / 2 - 0.075, H / 2, oz);
  group.add(leftWall);

  // Right wall (+X)
  const rightWall = makeBox(0.15, H, D, COLORS.WALL);
  rightWall.position.set(ox + W / 2 + 0.075, H / 2, oz);
  group.add(rightWall);

  // Front wall (-Z) with door gap
  const doorW = DOOR.WIDTH;
  const doorH = DOOR.HEIGHT;
  const wallZ = oz - D / 2 - 0.075;

  // Left section of front wall
  const fwLeft = makeBox((W - doorW) / 2, H, 0.15, COLORS.WALL);
  fwLeft.position.set(ox - doorW / 2 - (W - doorW) / 4, H / 2, wallZ);
  group.add(fwLeft);

  // Right section of front wall
  const fwRight = makeBox((W - doorW) / 2, H, 0.15, COLORS.WALL);
  fwRight.position.set(ox + doorW / 2 + (W - doorW) / 4, H / 2, wallZ);
  group.add(fwRight);

  // Above door
  const fwTop = makeBox(doorW, H - doorH, 0.15, COLORS.WALL);
  fwTop.position.set(ox, doorH + (H - doorH) / 2, wallZ);
  group.add(fwTop);

  // Door frame
  const frameMat = new THREE.MeshLambertMaterial({ color: COLORS.DOOR_FRAME, flatShading: true });
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameL.position.set(ox - doorW / 2, doorH / 2, wallZ);
  group.add(frameL);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameR.position.set(ox + doorW / 2, doorH / 2, wallZ);
  group.add(frameR);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.16, 0.08, 0.2), frameMat);
  frameTop.position.set(ox, doorH, wallZ);
  group.add(frameTop);

  // Door panel (wooden door with details)
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x8B5E3C, flatShading: true });
  const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.08, doorH - 0.04, 0.06), doorMat);
  doorPanel.position.set(ox, doorH / 2, wallZ);
  group.add(doorPanel);
  // Upper door inset panel
  const insetMat = new THREE.MeshLambertMaterial({ color: 0x7A5030, flatShading: true });
  const insetTop = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.6, doorH * 0.28, 0.08), insetMat);
  insetTop.position.set(ox, doorH * 0.72, wallZ + 0.01);
  group.add(insetTop);
  // Lower door inset panel
  const insetBot = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.6, doorH * 0.32, 0.08), insetMat);
  insetBot.position.set(ox, doorH * 0.3, wallZ + 0.01);
  group.add(insetBot);
  // Door handle
  const handleMat = new THREE.MeshLambertMaterial({ color: 0xC0A060, flatShading: true });
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), handleMat);
  handle.position.set(ox + doorW * 0.32, doorH * 0.45, wallZ + 0.05);
  group.add(handle);
  const handleKnob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), handleMat);
  handleKnob.position.set(ox + doorW * 0.32, doorH * 0.45, wallZ + 0.09);
  group.add(handleKnob);

  // --- Props ---

  // Bed (against right wall, near back)
  const bed = createBed();
  bed.position.set(ox + 2.5, 0, oz + 2);
  bed.rotation.y = -Math.PI / 2;
  group.add(bed);

  // Desk (against left wall)
  const desk = createDesk();
  desk.position.set(ox - 3, 0, oz + 1);
  desk.rotation.y = Math.PI / 2;
  group.add(desk);

  // Book rack (on wall above desk)
  const bookRack = createBookRack();
  bookRack.position.set(ox - 3.85, 1.8, oz + 1);
  bookRack.rotation.y = Math.PI / 2;
  group.add(bookRack);

  // Mirror (on left wall, near front)
  const mirror = createMirror();
  mirror.position.set(ox - 3.85, 1.05, oz - 1.5);
  mirror.rotation.y = Math.PI / 2;
  group.add(mirror);

  // Keyboard stand (center-left area)
  const keyboard = createKeyboardStand();
  keyboard.position.set(ox - 1.5, 0, oz - 1.5);
  keyboard.rotation.y = 0.3;
  group.add(keyboard);

  // Labrador (near bed)
  const dog = createLabrador();
  dog.position.set(ox + 1, 0, oz + 2.5);
  dog.rotation.y = -Math.PI / 4;
  group.add(dog);
  group.userData.labrador = dog;

  // Wardrobe (against right wall, near front)
  const wardrobe = createWardrobe();
  wardrobe.position.set(ox + 3.3, 0, oz - 1.5);
  wardrobe.rotation.y = -Math.PI / 2; // face into room
  group.add(wardrobe);
  group.userData.wardrobe = wardrobe;

  // Paintings (on walls)
  const paintings = createPaintings();
  paintings[0].position.set(ox, 2, oz + D / 2 + 0.01);
  group.add(paintings[0]);
  paintings[1].position.set(ox + W / 2 + 0.01, 2, oz - 0.5);
  paintings[1].rotation.y = -Math.PI / 2;
  group.add(paintings[1]);
  paintings[2].position.set(ox + W / 2 + 0.01, 1.8, oz + 2);
  paintings[2].rotation.y = -Math.PI / 2;
  group.add(paintings[2]);

  // Trophies (on desk area / shelf)
  const trophy1 = createTrophy(true);
  trophy1.position.set(ox - 3.6, 2.2, oz + 0.3);
  group.add(trophy1);
  const trophy2 = createTrophy(false);
  trophy2.position.set(ox - 3.6, 2.2, oz + 1.7);
  group.add(trophy2);

  // Medal on wall near trophies
  const medal = createMedal();
  medal.position.set(ox - 3.9, 2.5, oz + 1);
  medal.rotation.y = Math.PI / 2;
  group.add(medal);

  // Lamp on desk
  const lamp = createLamp();
  lamp.position.set(ox - 3.2, 0.78, oz + 0.5);
  group.add(lamp);

  // Fairy lights along back wall top
  const fairy = createFairyLights(
    new THREE.Vector3(ox - 3.5, H - 0.3, oz + D / 2 - 0.1),
    new THREE.Vector3(ox + 3.5, H - 0.3, oz + D / 2 - 0.1),
    14, 0.4
  );
  group.add(fairy);

  // Ambient lighting (warm and bright)
  const ambientLight = new THREE.AmbientLight(0xFFE8D0, 0.65);
  group.add(ambientLight);

  // Overhead light (warm, brighter)
  const overheadLight = new THREE.PointLight(0xFFF0E0, 0.8, 14);
  overheadLight.position.set(ox, H - 0.3, oz);
  group.add(overheadLight);

  // Warm accent light near bed area
  const bedLight = new THREE.PointLight(0xFFDDCC, 0.35, 8);
  bedLight.position.set(ox + 2, H - 0.5, oz + 2);
  group.add(bedLight);

  // Soft fill light near desk
  const deskFill = new THREE.PointLight(0xFFEEDD, 0.3, 7);
  deskFill.position.set(ox - 2.5, 1.5, oz + 1);
  group.add(deskFill);

  // Store collision boxes for the bedroom
  group.userData.colliders = buildColliders(ox, oz, W, D);

  return group;
}

function buildColliders(ox, oz, W, D) {
  // Simple AABB boxes for furniture
  return [
    // Bed
    { min: { x: ox + 1.5, z: oz + 0.8 }, max: { x: ox + 3.8, z: oz + 3.2 } },
    // Desk
    { min: { x: ox - 3.8, z: oz + 0.3 }, max: { x: ox - 2.5, z: oz + 1.7 } },
    // Keyboard stand
    { min: { x: ox - 2.1, z: oz - 2.0 }, max: { x: ox - 0.9, z: oz - 1.0 } },
    // Wardrobe (rotated -90deg, so depth along X, width along Z)
    { min: { x: ox + 2.7, z: oz - 2.2 }, max: { x: ox + 3.9, z: oz - 0.8 } },
    // Walls
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox - W / 2, z: oz + D / 2 + 0.2 } }, // left
    { min: { x: ox + W / 2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } }, // right
    { min: { x: ox - W / 2 - 0.2, z: oz + D / 2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } }, // back
    // Front wall (solid boundary — door is visual, E key handles transition)
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz - D / 2 } },
  ];
}
