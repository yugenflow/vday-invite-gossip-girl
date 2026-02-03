import * as THREE from 'three';
import { makeBox, makeSphere } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createCat() {
  const group = new THREE.Group();
  group.userData.animatable = true;

  // Body
  const body = makeBox(0.5, 0.22, 0.22, COLORS.CAT_ORANGE);
  body.position.set(0, 0.28, 0);
  group.add(body);

  // Head (lighter orange)
  const head = makeBox(0.2, 0.2, 0.2, COLORS.CAT_ORANGE_LIGHT);
  head.position.set(0.35, 0.38, 0);
  group.add(head);

  // Ears (pointed triangles approximated with small boxes)
  for (const z of [0.06, -0.06]) {
    const ear = makeBox(0.04, 0.08, 0.04, COLORS.CAT_ORANGE);
    ear.position.set(0.38, 0.5, z);
    ear.rotation.x = z > 0 ? -0.2 : 0.2;
    group.add(ear);
    // Inner ear
    const inner = makeBox(0.02, 0.05, 0.02, COLORS.CAT_NOSE);
    inner.position.set(0.38, 0.49, z);
    inner.rotation.x = z > 0 ? -0.2 : 0.2;
    group.add(inner);
  }

  // Eyes
  [0.06, -0.06].forEach(z => {
    const eye = makeSphere(0.025, 4, 4, 0x44AA44); // green cat eyes
    eye.position.set(0.45, 0.4, z);
    group.add(eye);
    const pupil = makeSphere(0.012, 4, 4, 0x111111);
    pupil.position.set(0.465, 0.4, z);
    group.add(pupil);
  });

  // Nose
  const nose = makeSphere(0.015, 4, 4, COLORS.CAT_NOSE);
  nose.position.set(0.46, 0.36, 0);
  group.add(nose);

  // Whiskers (thin boxes)
  for (const z of [0.04, -0.04]) {
    for (const yOff of [0, -0.02]) {
      const whisker = makeBox(0.12, 0.005, 0.005, 0xCCCCCC);
      whisker.position.set(0.5, 0.35 + yOff, z * 1.5);
      whisker.rotation.y = z > 0 ? -0.2 : 0.2;
      group.add(whisker);
    }
  }

  // Legs (4 short legs)
  const legs = [];
  const legGeo = new THREE.BoxGeometry(0.06, 0.18, 0.06);
  const legMat = new THREE.MeshLambertMaterial({ color: COLORS.CAT_ORANGE, flatShading: true });
  [[-0.15, 0.1], [0.15, 0.1], [-0.15, -0.1], [0.15, -0.1]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.09, z);
    group.add(leg);
    legs.push(leg);
  });
  group.userData.legs = legs;

  // Tail (long, curving upward)
  const tail = makeBox(0.03, 0.03, 0.3, COLORS.CAT_ORANGE_DARK);
  tail.position.set(-0.3, 0.35, 0);
  tail.geometry.translate(0, 0, -0.15);
  tail.rotation.x = 0.3;
  group.add(tail);
  group.userData.tail = tail;

  return group;
}

export function animateCat(group, time) {
  const tail = group.userData.tail;
  if (tail) {
    tail.rotation.y = Math.sin(time * 3) * 0.4;
  }
}

// CatAI — reuse DogAI logic exactly (same wander/petting/yield behavior)
export class CatAI {
  constructor(catGroup, colliders, bounds) {
    this.cat = catGroup;
    this.colliders = colliders;
    this.bounds = bounds;
    this.state = 'idle';
    this.idleTimer = 2 + Math.random() * 3;
    this.target = null;
    this.targetAngle = 0;
    this.speed = 0.5;
    this.turnSpeed = 3.5;
    this.margin = 0.5;
    this.petTimer = 0;
    this.playerPos = null;
    this.playerAvoidDist = 1.2;
  }

  setPlayerPos(pos) { this.playerPos = pos; }

  _pickTarget() {
    const { minX, maxX, minZ, maxZ } = this.bounds;
    for (let attempts = 0; attempts < 20; attempts++) {
      const x = minX + this.margin + Math.random() * (maxX - minX - this.margin * 2);
      const z = minZ + this.margin + Math.random() * (maxZ - minZ - this.margin * 2);
      if (!this._hitsCollider(x, z) && !this._tooCloseToPlayer(x, z)) {
        return new THREE.Vector3(x, 0, z);
      }
    }
    return this.cat.position.clone();
  }

  _tooCloseToPlayer(x, z) {
    if (!this.playerPos) return false;
    const dx = x - this.playerPos.x;
    const dz = z - this.playerPos.z;
    return Math.sqrt(dx * dx + dz * dz) < this.playerAvoidDist;
  }

  _distToPlayer() {
    if (!this.playerPos) return Infinity;
    const dx = this.cat.position.x - this.playerPos.x;
    const dz = this.cat.position.z - this.playerPos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  _hitsCollider(x, z) {
    const m = 0.3;
    for (const c of this.colliders) {
      if (x > c.min.x - m && x < c.max.x + m &&
          z > c.min.z - m && z < c.max.z + m) {
        return true;
      }
    }
    return false;
  }

  _angleDiff(from, to) {
    let d = to - from;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  _angleToTarget() {
    const dx = this.target.x - this.cat.position.x;
    const dz = this.target.z - this.cat.position.z;
    return Math.atan2(-dz, dx);
  }

  _dampLegs(dt) {
    const legs = this.cat.userData.legs;
    if (!legs) return;
    for (const leg of legs) {
      leg.rotation.x *= Math.max(0, 1 - 6 * dt);
    }
  }

  getCollider() {
    const p = this.cat.position;
    const r = 0.4;
    return { min: { x: p.x - r, z: p.z - r }, max: { x: p.x + r, z: p.z + r } };
  }

  startPetting() {
    if (this.state === 'being_petted') return;
    this.state = 'being_petted';
    this.petTimer = 2.5;
  }

  isPetting() { return this.state === 'being_petted'; }

  update(dt, time) {
    const tail = this.cat.userData.tail;
    if (tail) {
      const wagSpeed = this.state === 'being_petted' ? 8 : 3;
      const wagAmplitude = this.state === 'being_petted' ? 0.6 : 0.4;
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

    if (this.state !== 'being_petted' && this.state !== 'yielding') {
      if (this._distToPlayer() < 0.8) {
        this.state = 'yielding';
      }
    }

    if (this.state === 'yielding') {
      if (this.playerPos) {
        const pos = this.cat.position;
        const dx = pos.x - this.playerPos.x;
        const dz = pos.z - this.playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > this.playerAvoidDist) {
          this.state = 'idle';
          this.idleTimer = 1 + Math.random() * 2;
          this._dampLegs(dt);
          return;
        }

        const awayX = dist > 0.01 ? dx / dist : Math.random() - 0.5;
        const awayZ = dist > 0.01 ? dz / dist : Math.random() - 0.5;
        pos.x += awayX * 1.2 * dt;
        pos.z += awayZ * 1.2 * dt;
        pos.x = Math.max(this.bounds.minX + 0.3, Math.min(this.bounds.maxX - 0.3, pos.x));
        pos.z = Math.max(this.bounds.minZ + 0.3, Math.min(this.bounds.maxZ - 0.3, pos.z));
        this.cat.rotation.y = Math.atan2(-awayZ, awayX);

        const legs = this.cat.userData.legs;
        if (legs) {
          const swing = Math.sin(time * 14) * 0.3;
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
      const diff = this._angleDiff(this.cat.rotation.y, this.targetAngle);
      if (Math.abs(diff) < 0.08) {
        this.cat.rotation.y = this.targetAngle;
        this.state = 'walking';
      } else {
        const step = Math.sign(diff) * Math.min(this.turnSpeed * dt, Math.abs(diff));
        this.cat.rotation.y += step;
      }
    } else if (this.state === 'walking') {
      const pos = this.cat.position;
      const dist = pos.distanceTo(this.target);

      if (dist < 0.2) {
        this.state = 'idle';
        this.idleTimer = 2 + Math.random() * 3;
        this._dampLegs(dt);
        return;
      }

      if (this._distToPlayer() < this.playerAvoidDist) {
        this.state = 'idle';
        this.idleTimer = 0.5;
        this._dampLegs(dt);
        return;
      }

      const angle = this.cat.rotation.y;
      pos.x += Math.cos(angle) * this.speed * dt;
      pos.z += -Math.sin(angle) * this.speed * dt;

      const newAngle = this._angleToTarget();
      const steerDiff = this._angleDiff(this.cat.rotation.y, newAngle);
      this.cat.rotation.y += Math.sign(steerDiff) * Math.min(1.5 * dt, Math.abs(steerDiff));

      const legs = this.cat.userData.legs;
      if (legs) {
        const swing = Math.sin(time * 10) * 0.25;
        legs[0].rotation.x = swing;
        legs[1].rotation.x = -swing;
        legs[2].rotation.x = -swing;
        legs[3].rotation.x = swing;
      }
    }
  }
}
