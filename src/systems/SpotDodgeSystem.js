import * as THREE from 'three';
import { POSE_SPOTS, MESSAGES } from '../constants.js';
import { makeTextSprite } from '../utils/LowPolyHelpers.js';

let dodgeMessageIndex = 0;

function clamp(v, min, max) {
  if (min == null || max == null) return v;
  return Math.max(min, Math.min(max, v));
}

export class SpotDodgeSystem {
  constructor(scene) {
    this.scene = scene;
    this.spots = [];
    this.enabled = false;
    this.bubbles = [];
  }

  setSpots(spots) {
    // Only track "no" spots
    this.spots = spots.filter(s => s.userData.spotType === 'no');
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  update(dt, playerPos) {
    if (!this.enabled || !playerPos) return;

    this.spots.forEach(spot => {
      const data = spot.userData;

      if (data.isDodging) {
        data.dodgeTimer += dt;
        const totalDodge = POSE_SPOTS.DODGE_SPEED + POSE_SPOTS.DODGE_WAIT + POSE_SPOTS.DODGE_RETURN;

        if (data.dodgeTimer < POSE_SPOTS.DODGE_SPEED) {
          // Move away
          const t = data.dodgeTimer / POSE_SPOTS.DODGE_SPEED;
          spot.position.x = clamp(data.originalX + data.dodgeDirectionX * 2.0 * t, data.boundsMinX, data.boundsMaxX);
          spot.position.z = clamp(data.originalZ + data.dodgeDirectionZ * 2.0 * t, data.boundsMinZ, data.boundsMaxZ);
        } else if (data.dodgeTimer < POSE_SPOTS.DODGE_SPEED + POSE_SPOTS.DODGE_WAIT) {
          // Hold position
          spot.position.x = clamp(data.originalX + data.dodgeDirectionX * 2.0, data.boundsMinX, data.boundsMaxX);
          spot.position.z = clamp(data.originalZ + data.dodgeDirectionZ * 2.0, data.boundsMinZ, data.boundsMaxZ);
        } else if (data.dodgeTimer < totalDodge) {
          // Return
          const t = (data.dodgeTimer - POSE_SPOTS.DODGE_SPEED - POSE_SPOTS.DODGE_WAIT) / POSE_SPOTS.DODGE_RETURN;
          spot.position.x = clamp(data.originalX + data.dodgeDirectionX * 2.0 * (1 - t), data.boundsMinX, data.boundsMaxX);
          spot.position.z = clamp(data.originalZ + data.dodgeDirectionZ * 2.0 * (1 - t), data.boundsMinZ, data.boundsMaxZ);
        } else {
          spot.position.x = data.originalX;
          spot.position.z = data.originalZ;
          data.isDodging = false;
        }
        return;
      }

      // Check player proximity — dodge when player gets close
      const spotPos = new THREE.Vector3();
      spot.getWorldPosition(spotPos);
      const dist = playerPos.distanceTo(spotPos);

      if (dist < POSE_SPOTS.DODGE_THRESHOLD) {
        this._triggerDodge(spot, playerPos);
      }
    });

    // Update bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.scene.remove(b.sprite);
        this.bubbles.splice(i, 1);
      } else {
        b.sprite.position.y += dt * 0.4;
        b.sprite.material.opacity = Math.min(1, b.life * 2);
      }
    }
  }

  _triggerDodge(spot, playerPos) {
    const data = spot.userData;
    if (data.isDodging) return;

    data.isDodging = true;
    data.dodgeTimer = 0;

    // Dodge away from player (on XZ plane)
    const dx = spot.position.x - playerPos.x;
    const dz = spot.position.z - playerPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 0.01) {
      data.dodgeDirectionX = dx / dist;
      data.dodgeDirectionZ = dz / dist;
    } else {
      data.dodgeDirectionX = Math.random() > 0.5 ? 1 : -1;
      data.dodgeDirectionZ = 0;
    }

    // Show dodge message bubble
    const msg = MESSAGES.DODGE_MESSAGES[dodgeMessageIndex % MESSAGES.DODGE_MESSAGES.length];
    dodgeMessageIndex++;

    const charWidth = 16;
    const canvasW = Math.max(256, Math.min(600, msg.length * charWidth + 60));
    const spriteScaleX = canvasW / 200;

    const sprite = makeTextSprite(msg, {
      width: canvasW,
      height: 64,
      font: 'bold 26px Georgia',
      color: '#fff',
      bgColor: 'rgba(139,0,0,0.8)',
      scaleX: spriteScaleX,
      scaleY: 0.3,
    });

    const pos = new THREE.Vector3();
    spot.getWorldPosition(pos);
    sprite.position.set(pos.x, pos.y + 2, pos.z);
    this.scene.add(sprite);
    this.bubbles.push({ sprite, life: 1.5 });
  }
}
