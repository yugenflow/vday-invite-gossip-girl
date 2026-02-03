import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS, APARTMENT, DOOR } from '../constants.js';
import { createBed } from '../props/Bed.js';
import { createVanityMirror } from '../props/VanityMirror.js';
import { createBagCabinet } from '../props/BagCabinet.js';
import { createHeadbands } from '../props/Headbands.js';
import { createPinkBunny, createJerryMouse } from '../props/SoftToys.js';
import { createMacarons } from '../props/Macarons.js';
import { createCat } from '../props/Cat.js';
import { createBookRack } from '../props/BookRack.js';
import { createLamp } from '../props/Lamp.js';
import { createFairyLights } from '../props/FairyLights.js';
import { createWardrobe } from '../props/Wardrobe.js';
import { createFullLengthMirror } from '../props/FullLengthMirror.js';
import { createTallPlant, createSmallPlant } from '../props/Plants.js';
import { createWallGuitar } from '../props/Guitar.js';
import { createLaptop } from '../props/Laptop.js';
import { createMakeupKit } from '../props/MakeupKit.js';
import { createPrateek, applyProposalPose } from '../character/PrateekModel.js';

export function createApartmentScene() {
  const group = new THREE.Group();
  const ox = APARTMENT.ORIGIN.x;
  const oz = APARTMENT.ORIGIN.z;
  const W = APARTMENT.WIDTH;   // 7
  const D = APARTMENT.DEPTH;   // 7
  const H = APARTMENT.HEIGHT;  // 3.2

  // --- Floor (warm wood) ---
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x9B7653, roughness: 0.7, metalness: 0.05 });
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, D), floorMat);
  floorMesh.position.set(ox, -0.05, oz);
  group.add(floorMesh);

  // Area rug (cream with gold border)
  const rugBorder = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.015, 3.2),
    new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true })
  );
  rugBorder.position.set(ox, 0.005, oz);
  group.add(rugBorder);
  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.02, 3.0),
    new THREE.MeshLambertMaterial({ color: 0xF5E6D8, flatShading: true })
  );
  rug.position.set(ox, 0.01, oz);
  group.add(rug);

  // --- Ceiling ---
  const ceiling = makeBox(W, 0.1, D, COLORS.CEILING);
  ceiling.position.set(ox, H + 0.05, oz);
  group.add(ceiling);

  // Crown molding (gold)
  const moldMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });
  [[W, 0.06, 0.06, ox, H - 0.02, oz + D / 2 - 0.03],
   [W, 0.06, 0.06, ox, H - 0.02, oz - D / 2 + 0.03],
   [0.06, 0.06, D, ox - W / 2 + 0.03, H - 0.02, oz],
   [0.06, 0.06, D, ox + W / 2 - 0.03, H - 0.02, oz],
  ].forEach(([w, h, d, x, y, z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), moldMat);
    m.position.set(x, y, z);
    group.add(m);
  });

  // --- Walls ---
  const wallMat = new THREE.MeshLambertMaterial({ color: COLORS.WALL, flatShading: true });

  // Back wall (+Z)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.15), wallMat);
  backWall.position.set(ox, H / 2, oz + D / 2 + 0.075);
  group.add(backWall);

  // Left wall (-X)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, H, D), wallMat);
  leftWall.position.set(ox - W / 2 - 0.075, H / 2, oz);
  group.add(leftWall);

  // Right wall (+X)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, H, D), wallMat);
  rightWall.position.set(ox + W / 2 + 0.075, H / 2, oz);
  group.add(rightWall);

  // Front wall (-Z) with door
  const doorW = DOOR.WIDTH;
  const doorH = DOOR.HEIGHT;
  const wallZ = oz - D / 2 - 0.075;

  const fwLeft = new THREE.Mesh(new THREE.BoxGeometry((W - doorW) / 2, H, 0.15), wallMat);
  fwLeft.position.set(ox - doorW / 2 - (W - doorW) / 4, H / 2, wallZ);
  group.add(fwLeft);
  const fwRight = new THREE.Mesh(new THREE.BoxGeometry((W - doorW) / 2, H, 0.15), wallMat);
  fwRight.position.set(ox + doorW / 2 + (W - doorW) / 4, H / 2, wallZ);
  group.add(fwRight);
  const fwTop = new THREE.Mesh(new THREE.BoxGeometry(doorW, H - doorH, 0.15), wallMat);
  fwTop.position.set(ox, doorH + (H - doorH) / 2, wallZ);
  group.add(fwTop);

  // Wainscoting on back wall
  const wainscot = new THREE.Mesh(
    new THREE.BoxGeometry(W - 0.1, 0.7, 0.02),
    new THREE.MeshLambertMaterial({ color: 0xEDE8E0, flatShading: true })
  );
  wainscot.position.set(ox, 0.35, oz + D / 2 + 0.01);
  group.add(wainscot);
  const chairRail = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.03, 0.04), moldMat);
  chairRail.position.set(ox, 0.72, oz + D / 2 + 0.02);
  group.add(chairRail);

  // --- Door ---
  const frameDoorMat = new THREE.MeshLambertMaterial({ color: COLORS.DOOR_FRAME, flatShading: true });
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameDoorMat);
  frameL.position.set(ox - doorW / 2, doorH / 2, wallZ);
  group.add(frameL);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameDoorMat);
  frameR.position.set(ox + doorW / 2, doorH / 2, wallZ);
  group.add(frameR);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.16, 0.08, 0.2), frameDoorMat);
  frameTop.position.set(ox, doorH, wallZ);
  group.add(frameTop);
  const doorMat2 = new THREE.MeshLambertMaterial({ color: COLORS.DOOR, flatShading: true });
  const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.08, doorH - 0.04, 0.06), doorMat2);
  doorPanel.position.set(ox, doorH / 2, wallZ);
  group.add(doorPanel);
  const handleMat = new THREE.MeshLambertMaterial({ color: COLORS.ACCENT_GOLD, flatShading: true });
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), handleMat);
  handle.position.set(ox + doorW * 0.32, doorH * 0.45, wallZ + 0.05);
  group.add(handle);

  // ==== PROPS ====

  // === Bed (against back wall, left side, headboard against wall) ===
  const bed = createBed();
  bed.position.set(ox - 1.5, 0, oz + D / 2 - 1.0);
  bed.rotation.y = Math.PI; // headboard toward back wall
  group.add(bed);

  // Soft toys on bed
  const bunny = createPinkBunny();
  bunny.position.set(ox - 1.8, 0.55, oz + D / 2 - 0.6);
  group.add(bunny);
  const jerry = createJerryMouse();
  jerry.position.set(ox - 1.2, 0.55, oz + D / 2 - 0.5);
  group.add(jerry);

  // === Nightstand (beside bed) ===
  const nightstand = makeBox(0.45, 0.45, 0.35, COLORS.VANITY_WHITE);
  nightstand.position.set(ox + 0.2, 0.225, oz + D / 2 - 0.5);
  group.add(nightstand);
  const nsHandle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), handleMat);
  nsHandle.position.set(ox + 0.2, 0.25, oz + D / 2 - 0.3);
  group.add(nsHandle);
  const macarons = createMacarons();
  macarons.position.set(ox + 0.2, 0.46, oz + D / 2 - 0.5);
  group.add(macarons);
  const lamp = createLamp();
  lamp.position.set(ox + 0.1, 0.46, oz + D / 2 - 0.35);
  group.add(lamp);

  // === Second Lamp (other side of bed, on a small surface) ===
  const nightstand2 = makeBox(0.4, 0.45, 0.35, COLORS.VANITY_WHITE);
  nightstand2.position.set(ox - 2.9, 0.225, oz + D / 2 - 0.5);
  group.add(nightstand2);
  const ns2Handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), handleMat);
  ns2Handle.position.set(ox - 2.9, 0.25, oz + D / 2 - 0.3);
  group.add(ns2Handle);
  const lamp2 = createLamp();
  lamp2.position.set(ox - 2.9, 0.46, oz + D / 2 - 0.4);
  group.add(lamp2);

  // === Vanity Mirror (against left wall) ===
  const vanity = createVanityMirror();
  vanity.position.set(ox - W / 2 + 0.55, 0, oz - 0.5);
  vanity.rotation.y = Math.PI / 2;
  group.add(vanity);

  // Headbands near vanity
  const headbands = createHeadbands();
  headbands.position.set(ox - W / 2 + 0.7, 0.75, oz + 0.2);
  group.add(headbands);

  // === Laptop on vanity desk (work laptop with BCG logo) ===
  const laptop = createLaptop();
  laptop.position.set(ox - W / 2 + 0.55, 0.77, oz - 0.65);
  laptop.rotation.y = -Math.PI / 2 + 0.15; // Screen facing toward the chair/player
  group.add(laptop);
  group.userData.laptop = laptop;

  // === Makeup Kit (beside vanity, on the desk surface) ===
  const makeupKit = createMakeupKit();
  makeupKit.position.set(ox - W / 2 + 0.55, 0.77, oz - 0.2);
  makeupKit.rotation.y = Math.PI / 2;
  group.add(makeupKit);
  group.userData.makeupKit = makeupKit;

  // === Bag Cabinet (against right wall) ===
  const bagCabinet = createBagCabinet();
  bagCabinet.position.set(ox + W / 2 - 0.45, 0, oz + 0.5);
  bagCabinet.rotation.y = -Math.PI / 2;
  group.add(bagCabinet);

  // === Wardrobe (against right wall, near door) ===
  const wardrobe = createWardrobe();
  wardrobe.position.set(ox + W / 2 - 0.5, 0, oz - D / 2 + 1.2);
  wardrobe.rotation.y = -Math.PI / 2;
  group.add(wardrobe);
  group.userData.wardrobe = wardrobe;

  // === Cat ===
  const cat = createCat();
  cat.position.set(ox + 0.5, 0, oz + 0.5);
  group.add(cat);
  group.userData.cat = cat;

  // === Book Rack (wall-mounted, on back wall above/beside bed area) ===
  const bookRack = createBookRack();
  bookRack.position.set(ox + 1.2, 1.6, oz + D / 2 - 0.05);
  group.add(bookRack);

  // === Full-Length Mirror (on left wall, near door end) ===
  const mirror = createFullLengthMirror();
  mirror.position.set(ox - W / 2 + 0.05, 0, oz - D / 2 + 1.5);
  mirror.rotation.y = Math.PI / 2;
  group.add(mirror);

  // === Plants ===
  // Tall plant in corner (back-right)
  const tallPlant = createTallPlant();
  tallPlant.position.set(ox + W / 2 - 0.4, 0, oz + D / 2 - 0.4);
  group.add(tallPlant);

  // Small plant on nightstand
  const smallPlant = createSmallPlant();
  smallPlant.position.set(ox + 0.35, 0.46, oz + D / 2 - 0.65);
  group.add(smallPlant);

  // === Wall-Mounted Guitar (on front wall, left of door) ===
  const guitar = createWallGuitar();
  guitar.position.set(ox - doorW / 2 - (W - doorW) / 4, 1.6, oz - D / 2 + 0.02);
  // No rotation needed — guitar faces +Z which is into the room from front wall
  group.add(guitar);

  // === Vanity Chair (in front of vanity mirror) ===
  const chairSeatMat = new THREE.MeshLambertMaterial({ color: 0xF5C6C6, flatShading: true });
  const chairLegMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });
  const chairGroup = new THREE.Group();
  // Seat (cushioned)
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), chairSeatMat);
  seat.position.set(0, 0.42, 0);
  chairGroup.add(seat);
  // Seat cushion top (slightly puffy)
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.36),
    new THREE.MeshLambertMaterial({ color: 0xF8D0D0, flatShading: true }));
  cushion.position.set(0, 0.47, 0);
  chairGroup.add(cushion);
  // Four legs
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6);
  [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, chairLegMat);
    leg.position.set(lx, 0.21, lz);
    chairGroup.add(leg);
  });
  // Backrest
  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.04), chairSeatMat);
  backrest.position.set(0, 0.62, -0.18);
  chairGroup.add(backrest);

  chairGroup.position.set(ox - W / 2 + 0.9, 0, oz - 0.5);
  chairGroup.rotation.y = Math.PI / 2; // facing the vanity
  group.add(chairGroup);

  // === Fairy lights ===
  const fairy = createFairyLights(
    new THREE.Vector3(ox - W / 2 + 0.2, H - 0.25, oz + D / 2 - 0.1),
    new THREE.Vector3(ox + W / 2 - 0.2, H - 0.25, oz + D / 2 - 0.1),
    14, 0.4
  );
  group.add(fairy);
  const fairy2 = createFairyLights(
    new THREE.Vector3(ox + W / 2 - 0.1, H - 0.25, oz - 2.5),
    new THREE.Vector3(ox + W / 2 - 0.1, H - 0.25, oz + 2.5),
    10, 0.3
  );
  group.add(fairy2);

  // ==== LIGHTING (warm amber/orange cozy glow) ====
  // Warm ambient base
  const ambientLight = new THREE.AmbientLight(0xFFD4A0, 0.45);
  group.add(ambientLight);

  // Main ceiling light (warm overhead)
  const ceilingLight = new THREE.PointLight(0xFFCC88, 1.0, 10);
  ceilingLight.position.set(ox, H - 0.3, oz);
  group.add(ceilingLight);

  // Secondary overhead fill
  const overheadFill = new THREE.PointLight(0xFFBB77, 0.4, 8);
  overheadFill.position.set(ox + 1, H - 0.5, oz - 1);
  group.add(overheadFill);

  // Warm fill from bed area
  const warmFill = new THREE.PointLight(0xFFAA66, 0.35, 6);
  warmFill.position.set(ox - 1.5, 1.5, oz + 2);
  group.add(warmFill);

  // Vanity area fill
  const vanityFill = new THREE.PointLight(0xFFCC99, 0.3, 5);
  vanityFill.position.set(ox - W / 2 + 1, 1.5, oz - 0.5);
  group.add(vanityFill);

  // ==== COLLIDERS ====
  group.userData.colliders = buildColliders(ox, oz, W, D);

  return group;
}

function buildColliders(ox, oz, W, D) {
  return [
    // Bed
    { min: { x: ox - 2.8, z: oz + D / 2 - 1.8 }, max: { x: ox - 0.2, z: oz + D / 2 } },
    // Nightstand (right)
    { min: { x: ox - 0.1, z: oz + D / 2 - 0.8 }, max: { x: ox + 0.5, z: oz + D / 2 - 0.2 } },
    // Nightstand (left)
    { min: { x: ox - 3.2, z: oz + D / 2 - 0.8 }, max: { x: ox - 2.6, z: oz + D / 2 - 0.2 } },
    // Vanity
    { min: { x: ox - W / 2, z: oz - 1.3 }, max: { x: ox - W / 2 + 1.1, z: oz + 0.2 } },
    // Bag cabinet
    { min: { x: ox + W / 2 - 1, z: oz - 0.2 }, max: { x: ox + W / 2, z: oz + 1.2 } },
    // Wardrobe
    { min: { x: ox + W / 2 - 1.1, z: oz - D / 2 + 0.5 }, max: { x: ox + W / 2, z: oz - D / 2 + 1.9 } },
    // Walls
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox - W / 2, z: oz + D / 2 + 0.2 } },
    { min: { x: ox + W / 2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
    { min: { x: ox - W / 2 - 0.2, z: oz + D / 2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz - D / 2 } },
  ];
}

// Decorate the room for the Valentine's surprise ending
export function decorateRoomForSurprise(apartmentGroup) {
  const ox = APARTMENT.ORIGIN.x;
  const oz = APARTMENT.ORIGIN.z;
  const W = APARTMENT.WIDTH;
  const D = APARTMENT.DEPTH;
  const H = APARTMENT.HEIGHT;

  const surpriseGroup = new THREE.Group();
  surpriseGroup.name = 'surpriseDecoration';

  // === PRATEEK STANDING - PROPOSAL POSE ===
  const prateek = createPrateek();

  // Position near center of room but toward the bed side
  // Keep away from player spawn point (which is near the door)
  // Door is at -Z side, so position him deeper in the room (+Z)
  // Y offset of -0.34 to put feet on floor (model scaled 1.11x, feet at ~0.3 unscaled)
  prateek.position.set(ox - 0.5, -0.34, oz + 1);

  // Apply the standing proposal pose (arm extended with rose)
  applyProposalPose(prateek);

  // Rotate to face the door (door is at -Z)
  // Model faces +Z by default, so rotate 180° to face -Z
  prateek.rotation.y = Math.PI;

  surpriseGroup.add(prateek);

  // === ROSE PETALS ON BED ===
  const petalColors = [0xCC1144, 0xDD2255, 0xBB0033, 0xFF4466];
  for (let i = 0; i < 40; i++) {
    const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
    const petal = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.01, 0.04),
      new THREE.MeshLambertMaterial({ color: petalColor, flatShading: true })
    );

    // Scatter on bed area
    petal.position.set(
      ox - 1.5 + (Math.random() - 0.5) * 2.2,
      0.52 + Math.random() * 0.05,
      oz + D / 2 - 1.0 + (Math.random() - 0.5) * 1.4
    );
    petal.rotation.y = Math.random() * Math.PI * 2;
    petal.rotation.x = Math.random() * 0.3;
    surpriseGroup.add(petal);
  }

  // Some petals on the floor near the bed
  for (let i = 0; i < 20; i++) {
    const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
    const petal = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.01, 0.04),
      new THREE.MeshLambertMaterial({ color: petalColor, flatShading: true })
    );
    petal.position.set(
      ox - 1.5 + (Math.random() - 0.5) * 3,
      0.01,
      oz + D / 2 - 2.5 + Math.random() * 1.5
    );
    petal.rotation.y = Math.random() * Math.PI * 2;
    surpriseGroup.add(petal);
  }

  // === FLOATING HEARTS ===
  const heartPositions = [];
  for (let i = 0; i < 15; i++) {
    const heart = createFloatingHeart();
    const x = ox + (Math.random() - 0.5) * W * 0.8;
    const y = 1.0 + Math.random() * 1.5;
    const z = oz + (Math.random() - 0.5) * D * 0.8;
    heart.position.set(x, y, z);
    heart.userData.floatOffset = Math.random() * Math.PI * 2;
    heart.userData.floatSpeed = 0.5 + Math.random() * 0.5;
    heart.userData.baseY = y;
    surpriseGroup.add(heart);
    heartPositions.push(heart);
  }
  surpriseGroup.userData.floatingHearts = heartPositions;

  // === ROMANTIC LIGHTING ===
  // Dim the normal lights and add pink/red romantic glow

  // Pink ambient wash
  const pinkAmbient = new THREE.AmbientLight(0xFF6688, 0.3);
  surpriseGroup.add(pinkAmbient);

  // Warm romantic point lights
  const romanticLight1 = new THREE.PointLight(0xFF4466, 0.8, 8);
  romanticLight1.position.set(ox - 1.5, 2, oz + 1);
  surpriseGroup.add(romanticLight1);

  const romanticLight2 = new THREE.PointLight(0xFF6699, 0.6, 6);
  romanticLight2.position.set(ox + 1, 1.5, oz);
  surpriseGroup.add(romanticLight2);

  // Soft pink glow near bed
  const bedGlow = new THREE.PointLight(0xFF5577, 0.7, 5);
  bedGlow.position.set(ox - 1.5, 1, oz + D / 2 - 1);
  surpriseGroup.add(bedGlow);

  // Red accent light
  const redAccent = new THREE.PointLight(0xCC2244, 0.4, 6);
  redAccent.position.set(ox, 2.5, oz - 1);
  surpriseGroup.add(redAccent);

  // === EXTRA DECORATIONS ===
  // Heart-shaped balloons near ceiling
  for (let i = 0; i < 3; i++) {
    const balloon = createHeartBalloon();
    balloon.position.set(
      ox - 2 + i * 1.5,
      H - 0.5,
      oz + D / 2 - 2
    );
    surpriseGroup.add(balloon);
  }

  apartmentGroup.add(surpriseGroup);
  apartmentGroup.userData.surpriseDecoration = surpriseGroup;
  apartmentGroup.userData.prateek = prateek;

  return surpriseGroup;
}

// Create a simple 3D heart shape
function createFloatingHeart() {
  const group = new THREE.Group();
  const heartColor = [0xFF4466, 0xFF6688, 0xCC2244, 0xFF5577][Math.floor(Math.random() * 4)];
  const mat = new THREE.MeshLambertMaterial({
    color: heartColor,
    emissive: heartColor,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });

  // Heart made from two spheres and a cone
  const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), mat);
  leftLobe.position.set(-0.05, 0.03, 0);
  group.add(leftLobe);

  const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), mat);
  rightLobe.position.set(0.05, 0.03, 0);
  group.add(rightLobe);

  // Bottom point (cone/triangle)
  const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.15, 4), mat);
  bottom.position.set(0, -0.06, 0);
  bottom.rotation.z = Math.PI;
  group.add(bottom);

  // Random rotation
  group.rotation.y = Math.random() * Math.PI * 2;

  return group;
}

// Create heart-shaped balloon with string
function createHeartBalloon() {
  const group = new THREE.Group();
  const balloonColor = [0xFF4466, 0xFF1493, 0xCC2244][Math.floor(Math.random() * 3)];
  const mat = new THREE.MeshLambertMaterial({
    color: balloonColor,
    emissive: balloonColor,
    emissiveIntensity: 0.15,
    flatShading: true,
  });

  // Larger heart shape
  const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), mat);
  leftLobe.position.set(-0.1, 0.05, 0);
  group.add(leftLobe);

  const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), mat);
  rightLobe.position.set(0.1, 0.05, 0);
  group.add(rightLobe);

  const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.25, 4), mat);
  bottom.position.set(0, -0.1, 0);
  bottom.rotation.z = Math.PI;
  group.add(bottom);

  // String
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.6, 4), stringMat);
  string.position.set(0, -0.5, 0);
  group.add(string);

  return group;
}

// Animate floating hearts (call this in the game loop)
export function animateFloatingHearts(surpriseGroup, time) {
  if (!surpriseGroup || !surpriseGroup.userData.floatingHearts) return;

  surpriseGroup.userData.floatingHearts.forEach(heart => {
    // Gentle floating up and down
    heart.position.y = heart.userData.baseY + Math.sin(time * heart.userData.floatSpeed + heart.userData.floatOffset) * 0.15;
    // Slow rotation
    heart.rotation.y += 0.005;
  });
}
