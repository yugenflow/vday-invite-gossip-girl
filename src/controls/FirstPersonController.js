import { clamp, lerp } from '../utils/MathUtils.js';
import { CAMERA } from '../constants.js';

export class FirstPersonController {
  constructor(camera, domElement, mobile = false) {
    this.camera = camera;
    this.domElement = domElement;
    this.mobile = mobile;
    this.yaw = Math.PI;   // facing -Z (down the range)
    this.pitch = 0;
    this.enabled = false;

    // ADS state (toggle with F)
    this.aiming = false;
    this.aimFOV = 30;
    this.normalFOV = CAMERA.FOV;
    this.currentFOV = CAMERA.FOV;
    this.normalSensitivity = 0.002;
    this.aimSensitivity = 0.0008;

    // Rifle reference (set externally)
    this.rifleModel = null;
    this.rifleNormalPos = { x: 0.3, y: -0.25, z: -0.5 };
    this.rifleAimPos = { x: 0, y: -0.15, z: -0.35 };

    if (!this.mobile) {
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('keydown', this._onKeyDown);
    }
  }

  enable(initialYaw) {
    this.enabled = true;
    if (initialYaw !== undefined) this.yaw = initialYaw;
    this.pitch = 0;
    this.aiming = false;
    this.currentFOV = this.normalFOV;
    this.camera.fov = this.normalFOV;
    this.camera.updateProjectionMatrix();
  }

  disable() {
    this.enabled = false;
    this.aiming = false;
    // Reset FOV back to normal
    this.currentFOV = this.normalFOV;
    this.camera.fov = this.normalFOV;
    this.camera.updateProjectionMatrix();
  }

  _onKeyDown(e) {
    if (!this.enabled) return;
    if (e.key.toLowerCase() === 'f') {
      this.aiming = !this.aiming;
    }
  }

  _onMouseMove(e) {
    if (!this.enabled) return;
    const sens = this.aiming ? this.aimSensitivity : this.normalSensitivity;
    this.yaw -= e.movementX * sens;
    this.pitch = clamp(this.pitch - e.movementY * sens, -Math.PI / 3, Math.PI / 3);
  }

  /** Called each frame from touch camera drag. Raw pixel deltas. */
  setMobileLookInput(deltaX, deltaY) {
    if (!this.enabled) return;
    const sens = this.aiming ? this.aimSensitivity * 1.8 : this.normalSensitivity * 1.5;
    this.yaw -= deltaX * sens;
    this.pitch = clamp(this.pitch - deltaY * sens, -Math.PI / 3, Math.PI / 3);
  }

  /** Toggle ADS from mobile button */
  toggleAim() {
    if (!this.enabled) return;
    this.aiming = !this.aiming;
  }

  update(dt) {
    if (!this.enabled) return;

    // Smoothly interpolate FOV
    const targetFOV = this.aiming ? this.aimFOV : this.normalFOV;
    const lerpSpeed = dt ? Math.min(1, dt * 12) : 0.15;
    this.currentFOV = lerp(this.currentFOV, targetFOV, lerpSpeed);
    this.camera.fov = this.currentFOV;
    this.camera.updateProjectionMatrix();

    // Smoothly interpolate rifle position
    if (this.rifleModel) {
      const targetPos = this.aiming ? this.rifleAimPos : this.rifleNormalPos;
      this.rifleModel.position.x = lerp(this.rifleModel.position.x, targetPos.x, lerpSpeed);
      this.rifleModel.position.y = lerp(this.rifleModel.position.y, targetPos.y, lerpSpeed);
      this.rifleModel.position.z = lerp(this.rifleModel.position.z, targetPos.z, lerpSpeed);
    }

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  dispose() {
    if (!this.mobile) {
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('keydown', this._onKeyDown);
    }
  }
}
