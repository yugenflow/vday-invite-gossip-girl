import * as THREE from 'three';
import { TARGETS } from '../constants.js';
import { makeTextSprite } from '../utils/LowPolyHelpers.js';

const DODGE_MESSAGES = [
  'Nope!', 'Try again!', 'Not happening!',
  'Nice try!', 'Haha no!', 'Keep trying!',
  'Too slow~', 'Aww, you missed!',
  'Aim for Yes, cutie!', 'Wrong target :P',
  'I badly want a Yes ;)', 'Not today!',
  "Can't touch this!", 'Eyes on the prize ;)',
  'Oops!', 'So close... not!', 'Maybe next time~',
  'Hit Yes already!',
];

let dodgeMessageIndex = 0;

export class TargetDodgeSystem {
  constructor(scene) {
    this.scene = scene;
    this.targets = [];
    this.enabled = false;
    this.bubbles = [];
  }

  setTargets(targets) {
    this.targets = targets;
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  // Called on every frame — just does silent dodge, no speech bubbles
  update(dt, aimRay) {
    if (!this.enabled || !aimRay) return;

    this.targets.forEach(target => {
      if (target.userData.targetType !== 'no') return;

      const data = target.userData;

      if (data.isDodging) {
        data.dodgeTimer += dt;
        const totalDodge = TARGETS.DODGE_SPEED + TARGETS.DODGE_WAIT + TARGETS.DODGE_RETURN;

        if (data.dodgeTimer < TARGETS.DODGE_SPEED) {
          const t = data.dodgeTimer / TARGETS.DODGE_SPEED;
          target.position.x = data.originalX + data.dodgeDirection * 1.2 * t;
          data.hittable = false;
        } else if (data.dodgeTimer < TARGETS.DODGE_SPEED + TARGETS.DODGE_WAIT) {
          target.position.x = data.originalX + data.dodgeDirection * 1.2;
          data.hittable = false;
        } else if (data.dodgeTimer < totalDodge) {
          const t = (data.dodgeTimer - TARGETS.DODGE_SPEED - TARGETS.DODGE_WAIT) / TARGETS.DODGE_RETURN;
          target.position.x = data.originalX + data.dodgeDirection * 1.2 * (1 - t);
          data.hittable = false;
        } else {
          target.position.x = data.originalX;
          data.isDodging = false;
          data.hittable = true;
        }
        return;
      }

      // Check if aim ray is close — dodge silently (no bubble)
      const targetPos = new THREE.Vector3();
      target.getWorldPosition(targetPos);
      targetPos.y += 1.65;

      const closestPoint = new THREE.Vector3();
      aimRay.closestPointToPoint(targetPos, closestPoint);
      const dist = closestPoint.distanceTo(targetPos);

      if (dist < TARGETS.DODGE_THRESHOLD) {
        const toTarget = targetPos.clone().sub(aimRay.origin);
        if (aimRay.direction.dot(toTarget.normalize()) > 0.5) {
          this.triggerDodge(target, true);
        }
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
        b.sprite.position.y += dt * 0.5;
        b.sprite.material.opacity = Math.min(1, b.life * 2);
      }
    }

    // Pulse yes targets
    this.targets.forEach(target => {
      if (target.userData.targetType === 'yes' && target.userData.hittable && target.userData.ring) {
        const pulse = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
        target.userData.ring.material.emissiveIntensity = pulse;
      }
    });
  }

  // Called when player actually shoots at a NO target
  onShootAtNo(target) {
    if (!target || target.userData.targetType !== 'no') return;
    this.triggerDodge(target, true);
  }

  triggerDodge(target, showBubble) {
    const data = target.userData;
    if (data.isDodging) return; // already dodging

    data.isDodging = true;
    data.dodgeTimer = 0;
    data.dodgeDirection = Math.random() > 0.5 ? 1 : -1;
    data.hittable = false;
    data.originalX = data.originalX || target.position.x;

    if (showBubble) {
      const msg = DODGE_MESSAGES[dodgeMessageIndex % DODGE_MESSAGES.length];
      dodgeMessageIndex++;
      // Dynamically size canvas and sprite based on message length
      const charWidth = 18; // approximate px per char at 32px font
      const canvasW = Math.max(256, Math.min(600, msg.length * charWidth + 60));
      const spriteScaleX = canvasW / 200; // proportional world scale
      const sprite = makeTextSprite(msg, {
        width: canvasW,
        height: 64,
        font: 'bold 32px Georgia',
        color: '#fff',
        bgColor: 'rgba(200,50,50,0.8)',
        scaleX: spriteScaleX,
        scaleY: 0.3,
      });
      const pos = new THREE.Vector3();
      target.getWorldPosition(pos);
      sprite.position.set(pos.x, pos.y + 2.5, pos.z);
      this.scene.add(sprite);
      this.bubbles.push({ sprite, life: 1.2 });
    }
  }
}
