import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createLabrador() {
  const group = new THREE.Group();
  group.userData.animatable = true;

  // Body
  const body = makeBox(0.7, 0.35, 0.35, COLORS.DOG_BODY);
  body.position.set(0, 0.35, 0);
  group.add(body);

  // Head
  const head = makeBox(0.25, 0.25, 0.28, COLORS.DOG_BODY);
  head.position.set(0.45, 0.5, 0);
  group.add(head);

  // Snout
  const snout = makeBox(0.15, 0.1, 0.16, COLORS.DOG_DARK);
  snout.position.set(0.6, 0.43, 0);
  group.add(snout);

  // Nose
  const nose = makeSphere(0.03, 4, 4, 0x111111);
  nose.position.set(0.68, 0.46, 0);
  group.add(nose);

  // Eyes
  [0.08, -0.08].forEach(z => {
    const eye = makeSphere(0.03, 4, 4, 0x222222);
    eye.position.set(0.57, 0.55, z);
    group.add(eye);
  });

  // Ears (floppy)
  [0.15, -0.15].forEach(z => {
    const ear = makeBox(0.1, 0.15, 0.08, COLORS.DOG_DARK);
    ear.position.set(0.4, 0.55, z);
    ear.rotation.x = z > 0 ? 0.3 : -0.3;
    group.add(ear);
  });

  // Legs (4, standing position) — store refs for animation
  const legs = [];
  const legGeo = new THREE.BoxGeometry(0.1, 0.2, 0.1);
  const legMat = new THREE.MeshLambertMaterial({ color: COLORS.DOG_BODY, flatShading: true });
  [[-0.2, 0.18], [0.2, 0.18], [-0.2, -0.18], [0.2, -0.18]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.1, z);
    group.add(leg);
    legs.push(leg);
  });
  group.userData.legs = legs;

  // Tail (will animate)
  const tail = makeBox(0.04, 0.04, 0.3, COLORS.DOG_DARK);
  tail.position.set(-0.4, 0.45, 0);
  tail.geometry.translate(0, 0, -0.15);
  group.add(tail);
  group.userData.tail = tail;

  return group;
}

export function animateLabrador(group, time) {
  const tail = group.userData.tail;
  if (tail) {
    tail.rotation.y = Math.sin(time * 5) * 0.5;
  }
}

export class DogAI {
  constructor(dogGroup, colliders, bounds) {
    this.dog = dogGroup;
    this.colliders = colliders;
    this.bounds = bounds; // { minX, maxX, minZ, maxZ }
    this.state = 'idle';     // idle | turning | walking | being_petted | yielding
    this.idleTimer = 2 + Math.random() * 3;
    this.target = null;
    this.targetAngle = 0;    // desired Y rotation
    this.speed = 0.6;
    this.turnSpeed = 3.5;    // radians/sec
    this.margin = 0.5;
    this.petTimer = 0;       // countdown for petting animation
    this.playerPos = null;   // set each frame from main.js
    this.playerAvoidDist = 1.2; // dog avoids getting this close to player
  }

  setPlayerPos(pos) {
    this.playerPos = pos;
  }

  _pickTarget() {
    const { minX, maxX, minZ, maxZ } = this.bounds;
    for (let attempts = 0; attempts < 20; attempts++) {
      const x = minX + this.margin + Math.random() * (maxX - minX - this.margin * 2);
      const z = minZ + this.margin + Math.random() * (maxZ - minZ - this.margin * 2);
      if (!this._hitsCollider(x, z) && !this._tooCloseToPlayer(x, z)) {
        return new THREE.Vector3(x, 0, z);
      }
    }
    return this.dog.position.clone();
  }

  _tooCloseToPlayer(x, z) {
    if (!this.playerPos) return false;
    const dx = x - this.playerPos.x;
    const dz = z - this.playerPos.z;
    return Math.sqrt(dx * dx + dz * dz) < this.playerAvoidDist;
  }

  _distToPlayer() {
    if (!this.playerPos) return Infinity;
    const dx = this.dog.position.x - this.playerPos.x;
    const dz = this.dog.position.z - this.playerPos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  _hitsCollider(x, z) {
    const m = 0.4;
    for (const c of this.colliders) {
      if (x > c.min.x - m && x < c.max.x + m &&
          z > c.min.z - m && z < c.max.z + m) {
        return true;
      }
    }
    return false;
  }

  // Shortest signed angle difference, clamped to [-PI, PI]
  _angleDiff(from, to) {
    let d = to - from;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  // Dog model faces +X, so desired Y = atan2(dz, dx) rotated by -PI/2
  _angleToTarget() {
    const dx = this.target.x - this.dog.position.x;
    const dz = this.target.z - this.dog.position.z;
    // atan2(-dz, dx) because model nose is +X local, and Y rotation is CCW around Y
    return Math.atan2(-dz, dx);
  }

  _dampLegs(dt) {
    const legs = this.dog.userData.legs;
    if (!legs) return;
    for (const leg of legs) {
      leg.rotation.x *= Math.max(0, 1 - 6 * dt);
    }
  }

  // Returns an AABB collider centered on the dog's current position
  getCollider() {
    const p = this.dog.position;
    const r = 0.5; // half-size of collision box
    return {
      min: { x: p.x - r, z: p.z - r },
      max: { x: p.x + r, z: p.z + r },
    };
  }

  // Called externally when player presses P near the dog
  startPetting() {
    if (this.state === 'being_petted') return;
    this.state = 'being_petted';
    this.petTimer = 2.5; // seconds
  }

  isPetting() {
    return this.state === 'being_petted';
  }

  update(dt, time) {
    // Tail always wags (faster when being petted)
    const tail = this.dog.userData.tail;
    if (tail) {
      const wagSpeed = this.state === 'being_petted' ? 12 : 5;
      const wagAmplitude = this.state === 'being_petted' ? 0.8 : 0.5;
      tail.rotation.y = Math.sin(time * wagSpeed) * wagAmplitude;
    }

    if (this.state === 'being_petted') {
      this._dampLegs(dt);
      this.petTimer -= dt;
      if (this.petTimer <= 0) {
        this.state = 'idle';
        this.idleTimer = 3 + Math.random() * 2;
      }
      return;
    }

    // In any non-pet state, if player is too close, yield (move away)
    if (this.state !== 'being_petted' && this.state !== 'yielding') {
      const playerDist = this._distToPlayer();
      if (playerDist < 0.8) {
        // Player is right on top of us — switch to yielding
        this.state = 'yielding';
      }
    }

    if (this.state === 'yielding') {
      // Move away from player quickly
      if (this.playerPos) {
        const pos = this.dog.position;
        const dx = pos.x - this.playerPos.x;
        const dz = pos.z - this.playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > this.playerAvoidDist) {
          // Far enough, go idle
          this.state = 'idle';
          this.idleTimer = 1 + Math.random() * 2;
          this._dampLegs(dt);
          return;
        }

        // Move away from player
        const awayX = dist > 0.01 ? dx / dist : Math.random() - 0.5;
        const awayZ = dist > 0.01 ? dz / dist : Math.random() - 0.5;
        const yieldSpeed = 1.5;
        pos.x += awayX * yieldSpeed * dt;
        pos.z += awayZ * yieldSpeed * dt;

        // Clamp to bounds
        pos.x = Math.max(this.bounds.minX + 0.3, Math.min(this.bounds.maxX - 0.3, pos.x));
        pos.z = Math.max(this.bounds.minZ + 0.3, Math.min(this.bounds.maxZ - 0.3, pos.z));

        // Face away from player
        this.dog.rotation.y = Math.atan2(-awayZ, awayX);

        // Animate legs fast (scurrying)
        const legs = this.dog.userData.legs;
        if (legs) {
          const swing = Math.sin(time * 14) * 0.35;
          legs[0].rotation.x = swing;
          legs[1].rotation.x = -swing;
          legs[2].rotation.x = -swing;
          legs[3].rotation.x = swing;
        }
      }
      return;
    }

    if (this.state === 'idle') {
      this._dampLegs(dt);
      this.idleTimer -= dt;
      if (this.idleTimer <= 0) {
        this.target = this._pickTarget();
        this.targetAngle = this._angleToTarget();
        this.state = 'turning';
      }

    } else if (this.state === 'turning') {
      this._dampLegs(dt);
      const diff = this._angleDiff(this.dog.rotation.y, this.targetAngle);

      if (Math.abs(diff) < 0.08) {
        this.dog.rotation.y = this.targetAngle;
        this.state = 'walking';
      } else {
        const step = Math.sign(diff) * Math.min(this.turnSpeed * dt, Math.abs(diff));
        this.dog.rotation.y += step;
      }

    } else if (this.state === 'walking') {
      const pos = this.dog.position;
      const dist = pos.distanceTo(this.target);

      if (dist < 0.2) {
        this.state = 'idle';
        this.idleTimer = 2 + Math.random() * 3;
        this._dampLegs(dt);
        return;
      }

      // If walking toward player, abort and pick a new target
      const playerDist = this._distToPlayer();
      if (playerDist < this.playerAvoidDist) {
        this.state = 'idle';
        this.idleTimer = 0.5; // quickly pick a new target
        this._dampLegs(dt);
        return;
      }

      // Move forward along the dog's local +X (its facing direction)
      const angle = this.dog.rotation.y;
      const forwardX = Math.cos(angle);
      const forwardZ = -Math.sin(angle);

      pos.x += forwardX * this.speed * dt;
      pos.z += forwardZ * this.speed * dt;

      // Slight course correction: gently steer toward target while walking
      const newAngle = this._angleToTarget();
      const steerDiff = this._angleDiff(this.dog.rotation.y, newAngle);
      const steerStep = Math.sign(steerDiff) * Math.min(1.5 * dt, Math.abs(steerDiff));
      this.dog.rotation.y += steerStep;

      // Animate legs — diagonal pairs in sync (trot gait)
      const legs = this.dog.userData.legs;
      if (legs) {
        const swing = Math.sin(time * 10) * 0.3;
        legs[0].rotation.x = swing;   // front-left
        legs[1].rotation.x = -swing;  // front-right
        legs[2].rotation.x = -swing;  // back-left
        legs[3].rotation.x = swing;   // back-right
      }
    }
  }
}
