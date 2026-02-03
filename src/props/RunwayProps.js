import * as THREE from 'three';
import { makeBox, makeCylinder, makeTextCanvas } from '../utils/LowPolyHelpers.js';
import { COLORS, RUNWAY } from '../constants.js';

export function createRunwayPlatform() {
  const group = new THREE.Group();
  const ox = RUNWAY.ORIGIN.x;
  const oz = RUNWAY.ORIGIN.z;
  const D = RUNWAY.DEPTH;

  // Elevated runway platform (glossy white/light surface — like real fashion runways)
  const platformW = 3;
  const platformH = 0.15;
  const platformD = D - 6;

  // Main platform surface — bright white so lights reflect
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0xF0F0F0,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  });
  const platformGeo = new THREE.BoxGeometry(platformW, platformH, platformD);
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(ox, platformH / 2, oz);
  group.add(platform);

  // Edge lighting strips (gold, emissive)
  const edgeMat = new THREE.MeshLambertMaterial({
    color: COLORS.RUNWAY_EDGE_LIGHT,
    emissive: COLORS.RUNWAY_EDGE_LIGHT,
    emissiveIntensity: 0.6,
  });
  const edgeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, platformD), edgeMat);
  edgeL.position.set(ox - platformW / 2, platformH / 2, oz);
  group.add(edgeL);
  const edgeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, platformD), edgeMat);
  edgeR.position.set(ox + platformW / 2, platformH / 2, oz);
  group.add(edgeR);

  // Runway floor lights (small bright dots along edges)
  const bulbGeo = new THREE.SphereGeometry(0.04, 6, 6);
  for (let i = 0; i < 16; i++) {
    const z = oz - platformD / 2 + 0.8 + i * (platformD - 1.6) / 15;
    for (const side of [-1, 1]) {
      const bulbMat = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.8,
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(ox + side * (platformW / 2 + 0.06), 0.08, z);
      group.add(bulb);
    }
  }

  // Small point lights along the runway for actual illumination
  for (let i = 0; i < 6; i++) {
    const z = oz - platformD / 2 + 2 + i * (platformD - 4) / 5;
    const edgeLight = new THREE.PointLight(0xFFFFFF, 0.15, 4);
    edgeLight.position.set(ox, 0.15, z);
    group.add(edgeLight);
  }

  return group;
}

export function createCameraTripod(x, y, z, rotY) {
  const group = new THREE.Group();

  // Tripod legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = makeCylinder(0.02, 0.02, 1.2, 6, COLORS.TRIPOD);
    leg.position.set(Math.sin(angle) * 0.15, 0.6, Math.cos(angle) * 0.15);
    leg.rotation.x = Math.sin(angle) * 0.15;
    leg.rotation.z = Math.cos(angle) * 0.15;
    group.add(leg);
  }

  // Camera body
  const camBody = makeBox(0.2, 0.14, 0.12, COLORS.CAMERA_BODY);
  camBody.position.set(0, 1.2, 0);
  group.add(camBody);

  // Lens
  const lens = makeCylinder(0.04, 0.06, 0.1, 8, COLORS.CAMERA_LENS);
  lens.position.set(0, 1.2, 0.1);
  lens.rotation.x = Math.PI / 2;
  group.add(lens);

  // Flash
  const flash = makeBox(0.1, 0.06, 0.04, 0xEEEEEE);
  flash.position.set(0, 1.32, 0);
  group.add(flash);

  group.position.set(x, y, z);
  group.rotation.y = rotY || 0;
  return group;
}

// Ceiling-mounted spotlight housing with actual THREE.SpotLight
export function createSpotlightFixture(x, y, z, targetZ) {
  const group = new THREE.Group();

  // Mounting bracket
  const bracket = makeBox(0.1, 0.15, 0.1, 0x444444);
  bracket.position.set(0, 0, 0);
  group.add(bracket);

  // Housing (cylinder pointing down)
  const housing = makeCylinder(0.18, 0.1, 0.3, 8, 0x333333);
  housing.position.set(0, -0.2, 0);
  group.add(housing);

  // Bright face (emissive disc at bottom — visibly glowing)
  const face = makeCylinder(0.1, 0.1, 0.03, 8, 0xFFF8E0, {
    emissive: 0xFFF8E0,
    emissiveIntensity: 1.0,
  });
  face.position.set(0, -0.34, 0);
  group.add(face);

  // Actual spotlight for illumination (brighter warm light)
  const spotLight = new THREE.SpotLight(0xFFF0D0, 4.0, 14, Math.PI / 5, 0.35, 0.8);
  spotLight.position.set(0, -0.35, 0);
  const target = new THREE.Object3D();
  target.position.set(0, -6, 0);
  group.add(target);
  spotLight.target = target;
  group.add(spotLight);

  group.position.set(x, y, z);
  return group;
}

// Truss structure (metal framework above runway)
export function createTruss(startX, endX, y, z) {
  const group = new THREE.Group();
  const length = Math.abs(endX - startX);
  const centerX = (startX + endX) / 2;
  const trussMat = new THREE.MeshLambertMaterial({ color: 0x666666, flatShading: true });

  // Top and bottom rails
  for (const yOff of [0, -0.15]) {
    for (const zOff of [-0.08, 0.08]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.03, 0.03), trussMat);
      rail.position.set(centerX, y + yOff, z + zOff);
      group.add(rail);
    }
  }

  // Cross braces every ~1m
  const braceCount = Math.floor(length / 0.8);
  for (let i = 0; i <= braceCount; i++) {
    const x = startX + (i / braceCount) * length;
    const vert = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.15, 0.025), trussMat);
    vert.position.set(x, y - 0.075, z - 0.08);
    group.add(vert);
    const vert2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.15, 0.025), trussMat);
    vert2.position.set(x, y - 0.075, z + 0.08);
    group.add(vert2);
  }

  return group;
}

export function createBackdrop() {
  const group = new THREE.Group();
  const ox = RUNWAY.ORIGIN.x;
  const oz = RUNWAY.ORIGIN.z;
  const H = RUNWAY.HEIGHT;

  // Backdrop panel (deep purple/dark, large)
  const backdrop = makeBox(8, H - 0.3, 0.1, COLORS.BACKDROP);
  backdrop.position.set(ox, H / 2, oz - RUNWAY.DEPTH / 2 + 1);
  group.add(backdrop);

  // Banner text — large and prominent so it's visible from the entrance
  const bannerCanvas = makeTextCanvas(
    'Will you be my Valentine?',
    1536, 384, 'italic bold 84px Georgia', '#FFD700', 'transparent'
  );
  const tex = new THREE.CanvasTexture(bannerCanvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 1.8), mat);
  bannerMesh.position.set(ox, H - 1.5, oz - RUNWAY.DEPTH / 2 + 1.06);
  group.add(bannerMesh);

  // Decorative lights on backdrop
  const bulbGeo = new THREE.SphereGeometry(0.04, 6, 6);
  for (let i = 0; i < 20; i++) {
    const x = ox - 3.5 + (i / 19) * 7;
    const bMat = new THREE.MeshLambertMaterial({
      color: i % 2 === 0 ? 0xFFD700 : 0xFF69B4,
      emissive: i % 2 === 0 ? 0xFFD700 : 0xFF69B4,
      emissiveIntensity: 0.6,
    });
    const bulb = new THREE.Mesh(bulbGeo, bMat);
    bulb.position.set(x, H - 0.3, oz - RUNWAY.DEPTH / 2 + 1.08);
    group.add(bulb);
  }

  return group;
}
