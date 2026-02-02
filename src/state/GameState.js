import * as THREE from 'three';
import { PLAYER } from '../constants.js';

export const gameState = {
  playerPosition: new THREE.Vector3(PLAYER.SPAWN.x, PLAYER.SPAWN.y, PLAYER.SPAWN.z),
  playerRotation: 0, // Y-axis rotation
  cameraMode: 'thirdPerson', // 'thirdPerson' or 'firstPerson'
  isMoving: false,
  inRange: false,
  riflePickedUp: false,
  targetsHit: { yes: 0, no: 0 },
  celebrated: false,
  rangeDecorated: false,
  outfitChanged: false,
};
