import * as THREE from 'three';
import { lerp, easeInOutQuad } from '../utils/MathUtils.js';

export class TransitionSystem {
  constructor(camera) {
    this.camera = camera;
    this.transitioning = false;
    this.progress = 0;
    this.duration = 1;
    this.startPos = new THREE.Vector3();
    this.endPos = new THREE.Vector3();
    this.startLook = new THREE.Vector3();
    this.endLook = new THREE.Vector3();
    this.onComplete = null;
  }

  startTransition(fromPos, toPos, fromLook, toLook, duration, onComplete) {
    this.startPos.copy(fromPos);
    this.endPos.copy(toPos);
    this.startLook.copy(fromLook);
    this.endLook.copy(toLook);
    this.duration = duration || 1;
    this.progress = 0;
    this.transitioning = true;
    this.onComplete = onComplete;
  }

  update(dt) {
    if (!this.transitioning) return;

    this.progress += dt / this.duration;
    const t = easeInOutQuad(Math.min(this.progress, 1));

    this.camera.position.set(
      lerp(this.startPos.x, this.endPos.x, t),
      lerp(this.startPos.y, this.endPos.y, t),
      lerp(this.startPos.z, this.endPos.z, t),
    );

    const lookAt = new THREE.Vector3(
      lerp(this.startLook.x, this.endLook.x, t),
      lerp(this.startLook.y, this.endLook.y, t),
      lerp(this.startLook.z, this.endLook.z, t),
    );
    this.camera.lookAt(lookAt);

    if (this.progress >= 1) {
      this.transitioning = false;
      if (this.onComplete) this.onComplete();
    }
  }
}
