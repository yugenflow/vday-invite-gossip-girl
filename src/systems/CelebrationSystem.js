import * as THREE from 'three';
import { COLORS } from '../constants.js';
import { randomRange } from '../utils/MathUtils.js';
import { createCelebrationFairyLights } from '../props/FairyLights.js';

export class CelebrationSystem {
  constructor(scene) {
    this.scene = scene;
    this.confetti = null;
    this.confettiVelocities = [];
    this.decorations = new THREE.Group();
    this.active = false;
  }

  startConfetti(origin) {
    this.active = true;
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.confettiVelocities = [];

    const confettiColors = [
      new THREE.Color(COLORS.CONFETTI_RED),
      new THREE.Color(COLORS.CONFETTI_PINK),
      new THREE.Color(COLORS.CONFETTI_GOLD),
      new THREE.Color(COLORS.CONFETTI_WHITE),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = origin.x + randomRange(-2, 2);
      positions[i * 3 + 1] = origin.y + randomRange(2, 5);
      positions[i * 3 + 2] = origin.z + randomRange(-2, 2);

      const c = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      this.confettiVelocities.push(new THREE.Vector3(
        randomRange(-2, 2),
        randomRange(-1, 2),
        randomRange(-2, 2)
      ));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });

    this.confetti = new THREE.Points(geo, mat);
    this.scene.add(this.confetti);
  }

  decorateRunway(runwayGroup) {
    // Remove pose spots
    const poseSpots = runwayGroup.userData.poseSpots || [];
    poseSpots.forEach(s => runwayGroup.remove(s));

    // Add hearts
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.35);
    heartShape.bezierCurveTo(0.05, -0.1, 0.35, 0, 0.35, 0.2);
    heartShape.bezierCurveTo(0.35, 0.4, 0.15, 0.5, 0, 0.3);
    heartShape.bezierCurveTo(-0.15, 0.5, -0.35, 0.4, -0.35, 0.2);
    heartShape.bezierCurveTo(-0.35, 0, -0.05, -0.1, 0, -0.35);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.1, bevelEnabled: false,
    });

    const heartColors = [COLORS.HEART_RED, COLORS.HEART_PINK, 0xFF1493, 0xFFB6C1];
    const roz = runwayGroup.userData?.runwayOriginZ || -25;

    for (let i = 0; i < 10; i++) {
      const color = heartColors[i % heartColors.length];
      const heart = new THREE.Mesh(
        heartGeo,
        new THREE.MeshLambertMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.3,
          flatShading: true,
          side: THREE.DoubleSide,
        })
      );
      const x = (Math.random() - 0.5) * 8;
      const y = 1.5 + Math.random() * 2.5;
      const z = roz - 10 + Math.random() * 18;
      heart.position.set(x, y, z);
      heart.rotation.y = Math.random() * Math.PI;
      const s = 0.4 + Math.random() * 0.5;
      heart.scale.set(s, s, s);
      this.decorations.add(heart);
    }

    // Fairy lights
    const fl1 = createCelebrationFairyLights(
      new THREE.Vector3(-4, 4.5, roz + 5),
      new THREE.Vector3(4, 4.5, roz + 5),
      18
    );
    this.decorations.add(fl1);

    const fl2 = createCelebrationFairyLights(
      new THREE.Vector3(-4, 4.5, roz - 5),
      new THREE.Vector3(4, 4.5, roz - 5),
      18
    );
    this.decorations.add(fl2);

    // Rose petals (scattered small particles on the floor)
    const petalCount = 100;
    const petalPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);
    const petalCol = [
      new THREE.Color(COLORS.ROSE_PETAL),
      new THREE.Color(COLORS.HEART_PINK),
      new THREE.Color(0xFFB6C1),
    ];
    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 8;
      petalPositions[i * 3 + 1] = 0.15 + Math.random() * 0.1;
      petalPositions[i * 3 + 2] = roz - 12 + Math.random() * 22;
      const c = petalCol[Math.floor(Math.random() * petalCol.length)];
      petalColors[i * 3] = c.r;
      petalColors[i * 3 + 1] = c.g;
      petalColors[i * 3 + 2] = c.b;
    }
    const petalGeo = new THREE.BufferGeometry();
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    petalGeo.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));
    const petalMat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true });
    this.decorations.add(new THREE.Points(petalGeo, petalMat));

    // Warm pink/gold lighting
    const pinkLight = new THREE.PointLight(0xFF6688, 0.8, 20);
    pinkLight.position.set(0, 4, roz + 5);
    this.decorations.add(pinkLight);

    const goldLight = new THREE.PointLight(0xFFD700, 0.5, 15);
    goldLight.position.set(0, 4, roz - 5);
    this.decorations.add(goldLight);

    const warmLight = new THREE.PointLight(0xFFAA44, 0.4, 15);
    warmLight.position.set(0, 3, roz);
    this.decorations.add(warmLight);

    runwayGroup.add(this.decorations);
  }

  update(dt) {
    if (!this.active || !this.confetti) return;

    const positions = this.confetti.geometry.attributes.position.array;
    for (let i = 0; i < this.confettiVelocities.length; i++) {
      const vel = this.confettiVelocities[i];
      vel.y -= 3 * dt;

      positions[i * 3] += vel.x * dt;
      positions[i * 3 + 1] += vel.y * dt;
      positions[i * 3 + 2] += vel.z * dt;

      if (positions[i * 3 + 1] < 0.05) {
        positions[i * 3 + 1] = 0.05;
        vel.y = Math.abs(vel.y) * 0.3;
        vel.x *= 0.8;
        vel.z *= 0.8;
      }
    }
    this.confetti.geometry.attributes.position.needsUpdate = true;

    if (this.confetti.material.opacity > 0) {
      this.confetti.material.opacity -= dt * 0.15;
      if (this.confetti.material.opacity <= 0) {
        this.scene.remove(this.confetti);
        this.active = false;
      }
    }
  }
}
