import * as THREE from 'three';

export class ShootingSystem {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.targets = [];
    this.enabled = false;
    this.effects = [];
    this.onHitYes = null;
    this.rifleModel = null;
    this.recoilTime = 0;
  }

  setTargets(targets) {
    this.targets = targets;
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  shoot() {
    if (!this.enabled) return null;

    // Recoil animation
    this.recoilTime = 0.15;

    // Muzzle flash
    this.createMuzzleFlash();

    // Shell ejection
    this.createShellEjection();

    // Muzzle smoke
    this.createMuzzleSmoke();

    // Raycast from camera center
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const allMeshes = [];
    this.targets.forEach(t => t.traverse(child => {
      if (child.isMesh) {
        child.userData.parentTarget = t;
        allMeshes.push(child);
      }
    }));

    const hits = this.raycaster.intersectObjects(allMeshes, false);
    if (hits.length > 0) {
      const hit = hits[0];
      const target = hit.object.userData.parentTarget;
      if (target && target.userData.targetType) {
        // Create impact effect
        this.createImpact(hit.point);

        if (target.userData.targetType === 'yes' && target.userData.hittable) {
          target.userData.hittable = false;
          // Visual feedback: make it darker/knocked down
          target.traverse(child => {
            if (child.isMesh && child.material) {
              child.material = child.material.clone();
              child.material.opacity = 0.4;
              child.material.transparent = true;
            }
          });
          target.rotation.x = 0.5; // tilt back like knocked
          if (this.onHitYes) this.onHitYes();
          return 'yes';
        }
        if (target.userData.targetType === 'no') {
          return { type: 'no', target };
        }
      }
    }

    // Create bullet trail
    const dir = this.raycaster.ray.direction.clone().multiplyScalar(30);
    const end = this.raycaster.ray.origin.clone().add(dir);
    this.createBulletTrail(this.raycaster.ray.origin.clone(), end);

    return null;
  }

  createMuzzleFlash() {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: true, opacity: 1 })
    );
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    flash.position.copy(this.camera.position).add(dir.multiplyScalar(0.8));
    flash.position.y -= 0.15;
    this.scene.add(flash);
    this.effects.push({ mesh: flash, life: 0.08, maxLife: 0.08 });
  }

  createImpact(point) {
    // Sparks
    for (let i = 0; i < 6; i++) {
      const spark = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.02, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xFFAA00 })
      );
      spark.position.copy(point);
      spark.userData.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 3,
        (Math.random() - 0.5) * 3
      );
      this.scene.add(spark);
      this.effects.push({ mesh: spark, life: 0.4, maxLife: 0.4, hasSpark: true });
    }
  }

  createShellEjection() {
    // Small brass-colored shell casing ejected to the right
    const shell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.006, 0.025, 6),
      new THREE.MeshLambertMaterial({ color: 0xD4A020, flatShading: true })
    );
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    shell.position.copy(this.camera.position)
      .add(dir.clone().multiplyScalar(0.4))
      .add(right.clone().multiplyScalar(0.15));
    shell.position.y -= 0.1;

    // Give it velocity: eject right and up with spin
    shell.userData.vel = right.clone().multiplyScalar(2.5)
      .add(new THREE.Vector3(0, 3, 0))
      .add(dir.clone().multiplyScalar(-0.5));
    shell.userData.spin = Math.random() * 15 + 10;

    this.scene.add(shell);
    this.effects.push({ mesh: shell, life: 0.8, maxLife: 0.8, isShell: true });
  }

  createMuzzleSmoke() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);

    for (let i = 0; i < 5; i++) {
      const smoke = new THREE.Mesh(
        new THREE.SphereGeometry(0.02 + Math.random() * 0.02, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0xCCCCCC, transparent: true, opacity: 0.4 })
      );
      smoke.position.copy(this.camera.position)
        .add(dir.clone().multiplyScalar(0.8 + i * 0.05));
      smoke.position.y -= 0.12 + Math.random() * 0.05;

      smoke.userData.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        0.3 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.3
      );
      this.scene.add(smoke);
      this.effects.push({ mesh: smoke, life: 0.5 + Math.random() * 0.3, maxLife: 0.8, isSmoke: true });
    }
  }

  createBulletTrail(start, end) {
    const points = [start, end];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFFF88, transparent: true, opacity: 0.5 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.effects.push({ mesh: line, life: 0.1, maxLife: 0.1 });
  }

  update(dt) {
    // Recoil
    if (this.recoilTime > 0 && this.rifleModel) {
      this.recoilTime -= dt;
      const t = this.recoilTime / 0.15;
      this.rifleModel.rotation.x = -t * 0.1;
      this.rifleModel.position.z = -0.5 + t * 0.05;
    }

    // Update effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      e.life -= dt;
      if (e.life <= 0) {
        this.scene.remove(e.mesh);
        if (e.mesh.geometry) e.mesh.geometry.dispose();
        if (e.mesh.material) e.mesh.material.dispose();
        this.effects.splice(i, 1);
      } else {
        const alpha = e.life / e.maxLife;
        if (e.mesh.material.opacity !== undefined) {
          e.mesh.material.opacity = alpha;
        }
        if (e.hasSpark) {
          e.mesh.position.add(e.mesh.userData.vel.clone().multiplyScalar(dt));
          e.mesh.userData.vel.y -= 9.8 * dt;
        }
        if (e.isShell) {
          e.mesh.position.add(e.mesh.userData.vel.clone().multiplyScalar(dt));
          e.mesh.userData.vel.y -= 9.8 * dt;
          e.mesh.rotation.x += e.mesh.userData.spin * dt;
          e.mesh.rotation.z += e.mesh.userData.spin * 0.7 * dt;
        }
        if (e.isSmoke) {
          e.mesh.position.add(e.mesh.userData.vel.clone().multiplyScalar(dt));
          e.mesh.scale.multiplyScalar(1 + dt * 2); // expand
        }
      }
    }
  }

  getAimRay() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    return this.raycaster.ray;
  }
}
