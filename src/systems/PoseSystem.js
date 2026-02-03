import * as THREE from 'three';
import { POSE_SPOTS, MESSAGES, COLORS } from '../constants.js';
import { makeTextSprite } from '../utils/LowPolyHelpers.js';

export class PoseSystem {
  constructor(scene, character) {
    this.scene = scene;
    this.character = character;
    this.poseSpots = [];
    this.enabled = false;
    this.posing = false;
    this.onPoseStruck = null; // callback
    this.flashBubbles = [];
    this.confettiParticles = [];
    this.flirtyIndex = 0;
    this.currentSpot = null;
    this.promptElement = null;

    // Create a prompt element for "Press E to strike a pose"
    this._createPromptElement();
  }

  _createPromptElement() {
    this.promptElement = document.createElement('div');
    this.promptElement.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(212, 175, 55, 0.9);
      color: #1A1A1A;
      padding: 10px 24px;
      border-radius: 8px;
      font-family: Georgia, serif;
      font-size: 16px;
      font-weight: bold;
      z-index: 50;
      display: none;
      pointer-events: none;
    `;
    this.promptElement.textContent = 'Press E to strike a pose!';
    document.body.appendChild(this.promptElement);
  }

  setPoseSpots(spots) {
    this.poseSpots = spots;
  }

  enable() { this.enabled = true; }
  disable() {
    this.enabled = false;
    this.promptElement.style.display = 'none';
  }

  // Called when player presses E — toggles pose on/off
  tryPose() {
    if (!this.enabled) return false;

    // If currently posing, release the pose
    if (this.posing) {
      this.posing = false;
      this.currentSpot = null;
      return true;
    }

    // Find closest yes spot that hasn't been used
    const playerPos = this.character.position;
    let closest = null;
    let closestDist = Infinity;

    for (const spot of this.poseSpots) {
      if (spot.userData.spotType !== 'yes') continue;
      if (spot.userData.struck) continue;
      const pos = new THREE.Vector3();
      spot.getWorldPosition(pos);
      const dist = playerPos.distanceTo(pos);
      if (dist < POSE_SPOTS.PROXIMITY && dist < closestDist) {
        closest = spot;
        closestDist = dist;
      }
    }

    if (!closest) return false;

    // Mark as struck
    closest.userData.struck = true;
    closest.userData.hittable = false;

    // Visual feedback — flash the spot brightly
    if (closest.userData.ring) {
      closest.userData.ring.material.emissiveIntensity = 1.0;
    }

    // Camera flash effect
    this._showCameraFlash(closest.position);

    // Confetti burst
    this._spawnConfetti(closest.position);

    // Show flirty text bubble
    this._showFlirtyText(closest.position);

    // Start posing (held until E pressed again)
    this.posing = true;
    this.currentSpot = closest;

    // Hide the prompt while posing
    this.promptElement.style.display = 'none';

    // Fire callback
    if (this.onPoseStruck) {
      this.onPoseStruck();
    }

    return true;
  }

  _showCameraFlash(spotPos) {
    const flashGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 1.0,
    });

    for (const side of [-3.5, 3.5]) {
      const flash = new THREE.Mesh(flashGeo, flashMat.clone());
      flash.position.set(side, 1.5, spotPos.z);
      this.scene.add(flash);
      this.flashBubbles.push({ mesh: flash, life: 0.4 });
    }
  }

  _spawnConfetti(spotPos) {
    const confettiColors = [
      COLORS.CONFETTI_RED, COLORS.CONFETTI_PINK,
      COLORS.CONFETTI_GOLD, COLORS.CONFETTI_WHITE,
      COLORS.HEART_RED, COLORS.HEART_PINK,
    ];
    const geo = new THREE.BoxGeometry(0.06, 0.06, 0.02);

    for (let i = 0; i < 40; i++) {
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1.0 });
      const piece = new THREE.Mesh(geo, mat);

      piece.position.set(
        spotPos.x + (Math.random() - 0.5) * 0.5,
        1.5 + Math.random() * 0.5,
        spotPos.z + (Math.random() - 0.5) * 0.5
      );

      // Random velocity — burst upward and outward
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      const vy = 3 + Math.random() * 3;

      piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.scene.add(piece);
      this.confettiParticles.push({
        mesh: piece,
        vx: Math.cos(angle) * speed,
        vy: vy,
        vz: Math.sin(angle) * speed,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 2.0 + Math.random() * 1.0,
        gravity: 6,
      });
    }

    // Also spawn a few heart shapes
    for (let i = 0; i < 6; i++) {
      const heartColor = i % 2 === 0 ? COLORS.HEART_RED : COLORS.HEART_PINK;
      const heartMat = new THREE.MeshBasicMaterial({ color: heartColor, transparent: true, opacity: 1.0 });
      const heartGeo = new THREE.SphereGeometry(0.08, 6, 6);
      const heart = new THREE.Mesh(heartGeo, heartMat);

      heart.position.set(
        spotPos.x + (Math.random() - 0.5) * 0.3,
        1.8,
        spotPos.z + (Math.random() - 0.5) * 0.3
      );

      const angle = Math.random() * Math.PI * 2;
      this.scene.add(heart);
      this.confettiParticles.push({
        mesh: heart,
        vx: Math.cos(angle) * 1.0,
        vy: 4 + Math.random() * 2,
        vz: Math.sin(angle) * 1.0,
        rotSpeed: (Math.random() - 0.5) * 5,
        life: 2.5,
        gravity: 4,
      });
    }
  }

  _showFlirtyText(spotPos) {
    const text = MESSAGES.FLIRTY_TEXTS[this.flirtyIndex % MESSAGES.FLIRTY_TEXTS.length];
    this.flirtyIndex++;

    const charWidth = 18;
    const canvasW = Math.max(256, Math.min(600, text.length * charWidth + 60));
    const spriteScaleX = canvasW / 200;

    const sprite = makeTextSprite(text, {
      width: canvasW,
      height: 64,
      font: 'bold 28px Georgia',
      color: '#FFD700',
      bgColor: 'rgba(26,26,42,0.85)',
      scaleX: spriteScaleX,
      scaleY: 0.3,
    });

    sprite.position.set(spotPos.x, 2.5, spotPos.z);
    this.scene.add(sprite);
    this.flashBubbles.push({ mesh: sprite, life: 2.0, isSprite: true });
  }

  update(dt) {
    if (!this.enabled) return;

    // Show appropriate prompt
    const playerPos = this.character.position;

    if (this.posing) {
      // Show break-pose prompt
      this.promptElement.textContent = 'Press E to break pose';
      this.promptElement.style.display = 'block';
    } else {
      // Check if player is near a yes spot
      let nearYesSpot = false;
      for (const spot of this.poseSpots) {
        if (spot.userData.spotType !== 'yes') continue;
        if (spot.userData.struck) continue;
        const pos = new THREE.Vector3();
        spot.getWorldPosition(pos);
        const dist = playerPos.distanceTo(pos);
        if (dist < POSE_SPOTS.PROXIMITY) {
          nearYesSpot = true;
          break;
        }
      }
      if (nearYesSpot) {
        this.promptElement.textContent = 'Press E to strike a pose!';
        this.promptElement.style.display = 'block';
      } else {
        this.promptElement.style.display = 'none';
      }
    }

    // Update flash/text bubbles
    for (let i = this.flashBubbles.length - 1; i >= 0; i--) {
      const b = this.flashBubbles[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.scene.remove(b.mesh);
        if (b.mesh.material) b.mesh.material.dispose();
        if (b.mesh.geometry) b.mesh.geometry.dispose();
        this.flashBubbles.splice(i, 1);
      } else {
        if (b.isSprite) {
          b.mesh.position.y += dt * 0.3;
          b.mesh.material.opacity = Math.min(1, b.life);
        } else {
          b.mesh.material.opacity = b.life / 0.4;
        }
      }
    }

    // Update confetti particles
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.life -= dt;
      if (p.life <= 0 || p.mesh.position.y < -0.5) {
        this.scene.remove(p.mesh);
        if (p.mesh.material) p.mesh.material.dispose();
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        this.confettiParticles.splice(i, 1);
      } else {
        p.vy -= p.gravity * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.rotation.x += p.rotSpeed * dt;
        p.mesh.rotation.z += p.rotSpeed * 0.7 * dt;
        // Fade out in last 0.5s
        if (p.life < 0.5) {
          p.mesh.material.opacity = p.life / 0.5;
        }
        // Air resistance
        p.vx *= (1 - 1.5 * dt);
        p.vz *= (1 - 1.5 * dt);
      }
    }

    // Pulse active yes spots
    this.poseSpots.forEach(spot => {
      if (spot.userData.spotType === 'yes' && !spot.userData.struck && spot.userData.ring) {
        const pulse = 0.3 + Math.sin(Date.now() * 0.005) * 0.3;
        spot.userData.ring.material.emissiveIntensity = pulse;
      }
    });
  }

  isPosing() {
    return this.posing;
  }

  dispose() {
    this.flashBubbles.forEach(b => {
      this.scene.remove(b.mesh);
    });
    this.flashBubbles = [];
    this.confettiParticles.forEach(p => {
      this.scene.remove(p.mesh);
    });
    this.confettiParticles = [];
    if (this.promptElement && this.promptElement.parentNode) {
      this.promptElement.parentNode.removeChild(this.promptElement);
    }
  }
}
