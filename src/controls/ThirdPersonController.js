import * as THREE from 'three';
import { PLAYER, CAMERA } from '../constants.js';
import { clamp, lerp } from '../utils/MathUtils.js';

export class ThirdPersonController {
  constructor(camera, character, domElement, mobile = false) {
    this.camera = camera;
    this.character = character;
    this.domElement = domElement;
    this.mobile = mobile;

    this.azimuth = 0; // horizontal angle
    this.elevation = 0.3; // vertical angle
    this.distance = 3;
    this.cameraBounds = null; // { minX, maxX, minY, maxY, minZ, maxZ }

    this.keys = { w: false, a: false, s: false, d: false };
    this.isMoving = false;
    this.enabled = false;
    this.colliders = [];

    this.targetRotation = 0;

    // Mobile input state (set externally each frame)
    this._mobileDx = 0;
    this._mobileDz = 0;

    if (!this.mobile) {
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onKeyUp = this._onKeyUp.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);

      this.domElement.addEventListener('keydown', this._onKeyDown);
      this.domElement.addEventListener('keyup', this._onKeyUp);
      this.domElement.addEventListener('mousemove', this._onMouseMove);
    }
  }

  enable() { this.enabled = true; }
  disable() {
    this.enabled = false;
    this.keys = { w: false, a: false, s: false, d: false };
    this.isMoving = false;
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  setCameraBounds(bounds) {
    this.cameraBounds = bounds;
  }

  _onKeyDown(e) {
    if (!this.enabled) return;
    const key = e.key.toLowerCase();
    if (key in this.keys) this.keys[key] = true;
    if (key === 'arrowup') this.keys.w = true;
    if (key === 'arrowdown') this.keys.s = true;
    if (key === 'arrowleft') this.keys.a = true;
    if (key === 'arrowright') this.keys.d = true;
  }

  _onKeyUp(e) {
    if (!this.enabled) return;
    const key = e.key.toLowerCase();
    if (key in this.keys) this.keys[key] = false;
    if (key === 'arrowup') this.keys.w = false;
    if (key === 'arrowdown') this.keys.s = false;
    if (key === 'arrowleft') this.keys.a = false;
    if (key === 'arrowright') this.keys.d = false;
  }

  _onMouseMove(e) {
    if (!this.enabled) return;
    this.azimuth -= e.movementX * 0.003;
    this.elevation = clamp(this.elevation + e.movementY * 0.003, -0.2, 1.2);
  }

  /** Called each frame from mobile joystick. dx/dz in -1..1 */
  setMobileInput(dx, dz) {
    this._mobileDx = dx;
    this._mobileDz = dz;
  }

  /** Called each frame from touch camera drag. Raw pixel deltas. */
  setMobileCameraInput(deltaX, deltaY) {
    if (!this.enabled) return;
    this.azimuth -= deltaX * 0.004;
    this.elevation = clamp(this.elevation + deltaY * 0.004, -0.2, 1.2);
  }

  checkCollision(x, z, radius = 0.3) {
    for (const c of this.colliders) {
      if (x + radius > c.min.x && x - radius < c.max.x &&
          z + radius > c.min.z && z - radius < c.max.z) {
        return true;
      }
    }
    return false;
  }

  update(dt, playerPos) {
    if (!this.enabled) return { isMoving: false };

    // Calculate movement direction relative to camera
    const forward = new THREE.Vector3(-Math.sin(this.azimuth), 0, -Math.cos(this.azimuth));
    const right = new THREE.Vector3(-forward.z, 0, forward.x);

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (this.mobile) {
      // Mobile joystick: dz negative = forward, dx positive = right
      moveDir.addScaledVector(forward, -this._mobileDz);
      moveDir.addScaledVector(right, this._mobileDx);
    } else {
      if (this.keys.w) moveDir.add(forward);
      if (this.keys.s) moveDir.sub(forward);
      if (this.keys.a) moveDir.sub(right);
      if (this.keys.d) moveDir.add(right);
    }

    this.isMoving = moveDir.lengthSq() > 0.001;

    if (this.isMoving) {
      moveDir.normalize();
      const speed = PLAYER.SPEED * dt;
      const newX = playerPos.x + moveDir.x * speed;
      const newZ = playerPos.z + moveDir.z * speed;

      // Try X and Z separately for wall sliding
      if (!this.checkCollision(newX, playerPos.z)) {
        playerPos.x = newX;
      }
      if (!this.checkCollision(playerPos.x, newZ)) {
        playerPos.z = newZ;
      }

      // Rotate character to face movement direction
      this.targetRotation = Math.atan2(moveDir.x, moveDir.z);
    }

    // Lerp character rotation
    let currentRot = this.character.rotation.y;
    let diff = this.targetRotation - currentRot;
    // Normalize angle diff
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.character.rotation.y += diff * Math.min(1, dt * 10);

    // Update character position
    this.character.position.set(playerPos.x, playerPos.y, playerPos.z);

    // Camera position: orbit behind character
    const offset = CAMERA.THIRD_PERSON_OFFSET;
    let camX = playerPos.x + Math.sin(this.azimuth) * this.distance * Math.cos(this.elevation);
    let camY = playerPos.y + offset.y + Math.sin(this.elevation) * this.distance * 0.5;
    let camZ = playerPos.z + Math.cos(this.azimuth) * this.distance * Math.cos(this.elevation);

    // Clamp camera inside room bounds
    if (this.cameraBounds) {
      const b = this.cameraBounds;
      camX = clamp(camX, b.minX + 0.3, b.maxX - 0.3);
      camY = clamp(camY, 0.5, b.maxY - 0.2);
      camZ = clamp(camZ, b.minZ + 0.3, b.maxZ - 0.3);
    }

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(playerPos.x, playerPos.y + 1.2, playerPos.z);

    return { isMoving: this.isMoving };
  }

  dispose() {
    if (!this.mobile) {
      this.domElement.removeEventListener('keydown', this._onKeyDown);
      this.domElement.removeEventListener('keyup', this._onKeyUp);
      this.domElement.removeEventListener('mousemove', this._onMouseMove);
    }
  }
}
