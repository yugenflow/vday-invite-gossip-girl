import * as THREE from 'three';
import { COLORS, RUNWAY, POSE_SPOTS } from '../constants.js';
import { makeTextCanvas } from '../utils/LowPolyHelpers.js';

export function createPoseSpots() {
  const spots = [];
  const ox = RUNWAY.ORIGIN.x;
  const oz = RUNWAY.ORIGIN.z;

  // Runway platform bounds
  const platformW = 3;
  const platformD = RUNWAY.DEPTH - 6;
  const minX = ox - platformW / 2 + 0.6;
  const maxX = ox + platformW / 2 - 0.6;
  const minZ = oz - platformD / 2 + 1;
  const maxZ = oz + platformD / 2 - 1;

  // "Yes" spots — dark green outline, light green fill, black text
  const yesPositions = [
    { x: ox, z: oz + 2 },
    { x: ox, z: oz - 3 },
    { x: ox, z: oz - 8 },
  ];

  yesPositions.forEach((pos, i) => {
    const spot = createSpotMarker(pos.x, pos.z, 'yes', i);
    spot.userData.interactable = true;
    spot.userData.interactionType = 'pose_spot';
    spot.userData.promptText = 'Press E to strike a pose!';
    spots.push(spot);
  });

  // "No" spots — red outline, light pink fill, black text
  const noPositions = [
    { x: clamp(ox - 0.7, minX, maxX), z: clamp(oz + 5, minZ, maxZ) },
    { x: clamp(ox + 0.7, minX, maxX), z: clamp(oz, minZ, maxZ) },
    { x: clamp(ox - 0.7, minX, maxX), z: clamp(oz - 5, minZ, maxZ) },
    { x: clamp(ox + 0.7, minX, maxX), z: clamp(oz - 9, minZ, maxZ) },
    { x: clamp(ox, minX, maxX), z: clamp(oz - 11, minZ, maxZ) },
  ];

  noPositions.forEach((pos, i) => {
    const spot = createSpotMarker(pos.x, pos.z, 'no', i);
    spot.userData.interactable = true;
    spot.userData.interactionType = 'pose_spot';
    spot.userData.promptText = 'Press E to strike a pose!';
    spot.userData.isDodge = true;
    spot.userData.boundsMinX = minX;
    spot.userData.boundsMaxX = maxX;
    spot.userData.boundsMinZ = minZ;
    spot.userData.boundsMaxZ = maxZ;
    spots.push(spot);
  });

  return spots;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function createSpotMarker(x, z, type, index) {
  const group = new THREE.Group();

  const isYes = type === 'yes';
  // YES: light translucent green fill, dark green outline, dark green text
  // NO: light pink fill, red outline, dark red text
  const fillColor = isYes ? 0xA8E6A8 : 0xFFCCCC;  // light green / light pink
  const outlineColor = isYes ? 0x228B22 : 0xCC0000; // forest green / red
  const textColorHex = isYes ? '#1B5E20' : '#8B0000'; // dark green / dark red
  const label = isYes ? 'YES' : 'NO';

  // Filled circular floor marker (slightly translucent)
  const circleGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.03, 24);
  const circleMat = new THREE.MeshLambertMaterial({
    color: fillColor,
    emissive: fillColor,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });
  const circle = new THREE.Mesh(circleGeo, circleMat);
  circle.position.set(0, 0.13, 0);
  group.add(circle);

  // Outline ring
  const ringGeo = new THREE.TorusGeometry(0.55, 0.05, 8, 32);
  const ringMat = new THREE.MeshLambertMaterial({
    color: outlineColor,
    emissive: outlineColor,
    emissiveIntensity: 0.5,
    flatShading: true,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.15, 0);
  group.add(ring);
  group.userData.ring = ring;

  // Bold text label (dark green for YES, dark red for NO)
  const canvas = makeTextCanvas(label, 256, 128, 'bold 90px Georgia', textColorHex, 'transparent');
  const tex = new THREE.CanvasTexture(canvas);
  const textMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), textMat);
  textMesh.rotation.x = -Math.PI / 2;
  textMesh.position.set(0, 0.16, 0);
  group.add(textMesh);

  group.position.set(x, 0, z);
  group.userData.spotType = type;
  group.userData.spotIndex = index;
  group.userData.originalX = x;
  group.userData.originalZ = z;
  group.userData.hittable = true;
  group.userData.isDodging = false;
  group.userData.dodgeTimer = 0;
  group.userData.dodgeDirection = 0;

  return group;
}
