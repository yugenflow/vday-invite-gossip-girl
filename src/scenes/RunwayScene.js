import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS, RUNWAY } from '../constants.js';
import { createRunwayPlatform, createSpotlightFixture, createTruss, createBackdrop } from '../props/RunwayProps.js';
import { createPoseSpots } from '../props/PoseSpots.js';
import { createGossipGirlCard } from '../props/GossipGirlCard.js';
import { createPhotographer } from '../props/RunwayAudience.js';
import { createFairyLights } from '../props/FairyLights.js';

// Create a checkerboard VOGUE banner using a single canvas texture (optimized)
function createVogueBanner(width, height) {
  // Create entire banner as a single canvas texture for better performance
  const cols = 4;
  const rows = 6;
  const canvasWidth = 512;
  const canvasHeight = 768;
  const squareW = canvasWidth / cols;
  const squareH = canvasHeight / rows;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Draw checkerboard pattern with VOGUE text on every square
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isWhite = (row + col) % 2 === 0;
      const bgColor = isWhite ? '#FFFFFF' : '#000000';
      const textColor = isWhite ? '#000000' : '#FFFFFF';

      // Draw square background
      const x = col * squareW;
      const y = (rows - 1 - row) * squareH; // Flip Y for canvas coordinates
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, squareW, squareH);

      // Draw VOGUE text centered in square
      ctx.fillStyle = textColor;
      ctx.font = 'bold 28px Georgia';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VOGUE', x + squareW / 2, y + squareH / 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  return mesh;
}

export function createRunwayScene() {
  const group = new THREE.Group();
  const ox = RUNWAY.ORIGIN.x;
  const oz = RUNWAY.ORIGIN.z;
  const W = RUNWAY.WIDTH;
  const D = RUNWAY.DEPTH;
  const H = RUNWAY.HEIGHT;

  // --- Floor (dark gray, not pure black) ---
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1A1A20,
    roughness: 0.6,
    metalness: 0.1,
  });
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, D), floorMat);
  floorMesh.position.set(ox, -0.05, oz);
  group.add(floorMesh);

  // --- Ceiling (dark) ---
  const ceiling = makeBox(W, 0.1, D, 0x111118);
  ceiling.position.set(ox, H + 0.05, oz);
  group.add(ceiling);

  // --- Walls (dark navy, slightly visible) ---
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x15152A,
    roughness: 0.8,
    metalness: 0,
  });

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, H, D), wallMat);
  leftWall.position.set(ox - W / 2 - 0.075, H / 2, oz);
  group.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, H, D), wallMat);
  rightWall.position.set(ox + W / 2 + 0.075, H / 2, oz);
  group.add(rightWall);

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.15), wallMat);
  backWall.position.set(ox, H / 2, oz - D / 2 - 0.075);
  group.add(backWall);

  // Front wall with door gap (matching apartment door proportions)
  const doorW = 0.9;
  const doorH = 1.8;
  const fwZ = oz + D / 2 + 0.075;

  const fwLeft = new THREE.Mesh(new THREE.BoxGeometry((W - doorW) / 2, H, 0.15), wallMat);
  fwLeft.position.set(ox - doorW / 2 - (W - doorW) / 4, H / 2, fwZ);
  group.add(fwLeft);

  const fwRight = new THREE.Mesh(new THREE.BoxGeometry((W - doorW) / 2, H, 0.15), wallMat);
  fwRight.position.set(ox + doorW / 2 + (W - doorW) / 4, H / 2, fwZ);
  group.add(fwRight);

  const fwTop = new THREE.Mesh(new THREE.BoxGeometry(doorW, H - doorH, 0.15), wallMat);
  fwTop.position.set(ox, doorH + (H - doorH) / 2, fwZ);
  group.add(fwTop);

  // Door frame (gold)
  const frameMat = new THREE.MeshLambertMaterial({ color: COLORS.ACCENT_GOLD, flatShading: true });
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameL.position.set(ox - doorW / 2, doorH / 2, fwZ);
  group.add(frameL);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, 0.2), frameMat);
  frameR.position.set(ox + doorW / 2, doorH / 2, fwZ);
  group.add(frameR);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.16, 0.08, 0.2), frameMat);
  frameTop.position.set(ox, doorH, fwZ);
  group.add(frameTop);

  // --- VOGUE Checkerboard Banners (on either side of entrance) ---
  const bannerWidth = 2.5;
  const bannerHeight = 3.5;

  // Left banner (positioned to left of door, facing into runway)
  const leftBanner = createVogueBanner(bannerWidth, bannerHeight);
  leftBanner.position.set(ox - doorW / 2 - bannerWidth / 2 - 0.3, bannerHeight / 2 + 0.3, fwZ - 0.1);
  leftBanner.rotation.y = Math.PI; // Face into the runway
  group.add(leftBanner);

  // Right banner (positioned to right of door, facing into runway)
  const rightBanner = createVogueBanner(bannerWidth, bannerHeight);
  rightBanner.position.set(ox + doorW / 2 + bannerWidth / 2 + 0.3, bannerHeight / 2 + 0.3, fwZ - 0.1);
  rightBanner.rotation.y = Math.PI; // Face into the runway
  group.add(rightBanner);

  // Add lights to illuminate the banners
  const bannerLightL = new THREE.PointLight(0xFFFFFF, 0.8, 6);
  bannerLightL.position.set(ox - doorW / 2 - bannerWidth / 2 - 0.3, bannerHeight + 0.5, fwZ - 1);
  group.add(bannerLightL);
  const bannerLightR = new THREE.PointLight(0xFFFFFF, 0.8, 6);
  bannerLightR.position.set(ox + doorW / 2 + bannerWidth / 2 + 0.3, bannerHeight + 0.5, fwZ - 1);
  group.add(bannerLightR);

  // --- Runway Platform (white/light surface) ---
  const platform = createRunwayPlatform();
  group.add(platform);

  // --- Backdrop at far end ---
  const backdrop = createBackdrop();
  group.add(backdrop);

  // --- Lighting Truss (metal framework on ceiling) ---
  // Two parallel trusses running the length of the runway
  const truss1 = createTruss(ox - 3, ox + 3, H - 0.05, oz + 5);
  group.add(truss1);
  const truss2 = createTruss(ox - 3, ox + 3, H - 0.05, oz);
  group.add(truss2);
  const truss3 = createTruss(ox - 3, ox + 3, H - 0.05, oz - 5);
  group.add(truss3);
  const truss4 = createTruss(ox - 3, ox + 3, H - 0.05, oz - 10);
  group.add(truss4);

  // --- Ceiling Spotlights (with real SpotLights for illumination) ---
  const spotPositions = [
    // Center row (directly above runway)
    { x: ox, z: oz + 8 },
    { x: ox, z: oz + 4 },
    { x: ox, z: oz },
    { x: ox, z: oz - 4 },
    { x: ox, z: oz - 8 },
    { x: ox, z: oz - 12 },
    // Left row
    { x: ox - 2.2, z: oz + 6 },
    { x: ox - 2.2, z: oz + 2 },
    { x: ox - 2.2, z: oz - 2 },
    { x: ox - 2.2, z: oz - 6 },
    { x: ox - 2.2, z: oz - 10 },
    // Right row
    { x: ox + 2.2, z: oz + 6 },
    { x: ox + 2.2, z: oz + 2 },
    { x: ox + 2.2, z: oz - 2 },
    { x: ox + 2.2, z: oz - 6 },
    { x: ox + 2.2, z: oz - 10 },
  ];
  spotPositions.forEach(p => {
    const fixture = createSpotlightFixture(p.x, H, p.z);
    group.add(fixture);
  });

  // --- Side Decor (velvet rope stanchions along runway edges) ---
  const stanchionMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.3, metalness: 0.6 });
  const ropeMat = new THREE.MeshLambertMaterial({ color: 0x8B0000, flatShading: true });
  const stanchionZPositions = [oz + 8, oz + 4, oz, oz - 4, oz - 8];
  for (const side of [-1, 1]) {
    const xPos = ox + side * 2.2;
    stanchionZPositions.forEach((zPos, i) => {
      // Gold post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.0, 8), stanchionMat);
      post.position.set(xPos, 0.5, zPos);
      group.add(post);
      // Gold ball on top
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), stanchionMat);
      ball.position.set(xPos, 1.02, zPos);
      group.add(ball);
      // Rope between posts (if not last)
      if (i < stanchionZPositions.length - 1) {
        const nextZ = stanchionZPositions[i + 1];
        const ropeLen = Math.abs(zPos - nextZ);
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, ropeLen, 6), ropeMat);
        rope.rotation.x = Math.PI / 2;
        rope.position.set(xPos, 0.85, (zPos + nextZ) / 2);
        group.add(rope);
      }
    });
  }

  // Side fairy lights (along walls for ambiance)
  const flLeft = createFairyLights(
    new THREE.Vector3(ox - W / 2 + 0.3, H - 0.3, oz + D / 2 - 3),
    new THREE.Vector3(ox - W / 2 + 0.3, H - 0.3, oz - D / 2 + 3),
    20, 0.4
  );
  group.add(flLeft);
  const flRight = createFairyLights(
    new THREE.Vector3(ox + W / 2 - 0.3, H - 0.3, oz + D / 2 - 3),
    new THREE.Vector3(ox + W / 2 - 0.3, H - 0.3, oz - D / 2 + 3),
    20, 0.4
  );
  group.add(flRight);

  // Decorative floor planters along sides
  const planterMat = new THREE.MeshLambertMaterial({ color: 0x2A2A2A, flatShading: true });
  const flowerColors = [0xFF69B4, 0xFFD700, 0xFF1493, 0xFFB6C1];
  for (const side of [-1, 1]) {
    const xPos = ox + side * 3.5;
    [oz + 6, oz, oz - 6].forEach((zPos, i) => {
      // Planter box
      const planter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), planterMat);
      planter.position.set(xPos, 0.2, zPos);
      group.add(planter);
      // Flowers (small colorful spheres)
      const fColor = flowerColors[i % flowerColors.length];
      for (let f = 0; f < 5; f++) {
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 6, 6),
          new THREE.MeshLambertMaterial({ color: fColor, emissive: fColor, emissiveIntensity: 0.2 })
        );
        flower.position.set(
          xPos + (Math.random() - 0.5) * 0.3,
          0.45 + Math.random() * 0.1,
          zPos + (Math.random() - 0.5) * 0.3
        );
        group.add(flower);
      }
    });
  }

  // --- Photographers (standing at strategic positions) ---
  const photographers = [];
  const photographerPositions = [
    // At the end of the runway (facing towards backdrop)
    { x: ox - 2.5, z: oz - 11, rot: Math.PI * 0.05 },
    { x: ox + 2.5, z: oz - 11, rot: -Math.PI * 0.05 },
    // Near entrance (facing down runway)
    { x: ox - 3, z: oz + 8, rot: Math.PI * 0.95 },
    { x: ox + 3, z: oz + 8, rot: -Math.PI * 0.95 },
    // Mid-runway sides
    { x: ox - 2.3, z: oz - 3, rot: Math.PI * 0.15 },
    { x: ox + 2.3, z: oz - 3, rot: -Math.PI * 0.15 },
    { x: ox - 2.3, z: oz + 3, rot: Math.PI * 0.85 },
    { x: ox + 2.3, z: oz + 3, rot: -Math.PI * 0.85 },
  ];
  photographerPositions.forEach(p => {
    const photog = createPhotographer(p.x, 0, p.z, p.rot);
    group.add(photog);
    photographers.push(photog);
  });
  group.userData.photographers = photographers;

  // --- Gossip Girl Card (near entrance, right side) ---
  const ggCard = createGossipGirlCard();
  ggCard.position.set(ox + 4, 0, oz + D / 2 - 4);
  ggCard.rotation.y = -Math.PI / 4;
  group.add(ggCard);
  group.userData.ggCard = ggCard;

  // --- Pose Spots ---
  const poseSpots = createPoseSpots();
  poseSpots.forEach(s => group.add(s));
  group.userData.poseSpots = poseSpots;

  // --- Ambient Lighting ---
  // Warm ambient base — gives the space a welcoming glow
  const ambient = new THREE.AmbientLight(0xFFEED8, 0.6);
  group.add(ambient);

  // Hemisphere light (warm white sky, subtle blue-gray ground)
  const hemi = new THREE.HemisphereLight(0xFFF8F0, 0x1A1A2A, 0.5);
  group.add(hemi);

  // Strong warm overhead point lights along runway (ceiling lights ON)
  const overheadZPositions = [-12, -8, -4, 0, 4, 8];
  overheadZPositions.forEach(zOff => {
    const light = new THREE.PointLight(0xFFF0D0, 1.8, 14);
    light.position.set(ox, H - 0.5, oz + zOff);
    group.add(light);
  });

  // Additional side ceiling lights for warm ambient fill
  [-10, -5, 0, 5].forEach(zOff => {
    for (const side of [-1, 1]) {
      const fill = new THREE.PointLight(0xFFE8C8, 0.6, 10);
      fill.position.set(ox + side * 3.5, H - 0.3, oz + zOff);
      group.add(fill);
    }
  });

  // Colored accent washes (subtle)
  const pinkWash = new THREE.PointLight(0xFF69B4, 0.3, 20);
  pinkWash.position.set(ox - 4, H - 0.5, oz - 5);
  group.add(pinkWash);

  const goldWash = new THREE.PointLight(0xFFD700, 0.3, 20);
  goldWash.position.set(ox + 4, H - 0.5, oz - 5);
  group.add(goldWash);

  // Strong light on backdrop
  const backdropLight = new THREE.PointLight(0xFFFFFF, 1.5, 14);
  backdropLight.position.set(ox, H - 0.5, oz - D / 2 + 3);
  group.add(backdropLight);

  // Side fill lights for the overall space
  const sideLight1 = new THREE.PointLight(0xFFEEDD, 0.4, 10);
  sideLight1.position.set(ox - 3.5, 2, oz);
  group.add(sideLight1);
  const sideLight2 = new THREE.PointLight(0xFFEEDD, 0.4, 10);
  sideLight2.position.set(ox + 3.5, 2, oz);
  group.add(sideLight2);
  const sideLight3 = new THREE.PointLight(0xFFEEDD, 0.3, 10);
  sideLight3.position.set(ox - 3.5, 2, oz - 8);
  group.add(sideLight3);
  const sideLight4 = new THREE.PointLight(0xFFEEDD, 0.3, 10);
  sideLight4.position.set(ox + 3.5, 2, oz - 8);
  group.add(sideLight4);

  // --- Colliders ---
  group.userData.colliders = [
    // Left wall
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox - W / 2, z: oz + D / 2 + 0.2 } },
    // Right wall
    { min: { x: ox + W / 2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
    // Back wall
    { min: { x: ox - W / 2 - 0.2, z: oz - D / 2 - 0.2 }, max: { x: ox + W / 2 + 0.2, z: oz - D / 2 } },
    // Front wall
    { min: { x: ox - W / 2 - 0.2, z: oz + D / 2 }, max: { x: ox + W / 2 + 0.2, z: oz + D / 2 + 0.2 } },
    // Stanchion / decor boundaries
    { min: { x: ox - 4, z: oz - D / 2 + 2 }, max: { x: ox - 2.5, z: oz + D / 2 - 2 } },
    { min: { x: ox + 2.5, z: oz - D / 2 + 2 }, max: { x: ox + 4, z: oz + D / 2 - 2 } },
  ];

  group.userData.runwayOriginZ = oz;

  return group;
}
