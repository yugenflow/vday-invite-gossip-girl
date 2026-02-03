import * as THREE from 'three';
import { PLAYER } from '../constants.js';

export const gameState = {
  playerPosition: new THREE.Vector3(PLAYER.SPAWN.x, PLAYER.SPAWN.y, PLAYER.SPAWN.z),
  playerRotation: 0,
  cameraMode: 'thirdPerson',
  isMoving: false,
  inRunway: false,
  posesStruck: 0,
  celebrated: false,
  runwayDecorated: false,
  outfitChanged: false,
  makeupApplied: false,
  mailRead: false,
  inviteAccepted: false,
  gameComplete: false,
  surpriseShown: false,
};
