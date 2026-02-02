// --- Mobile detection ---
export const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)); // iPad Safari

/**
 * Virtual joystick rendered on a transparent canvas overlay.
 * Emits a normalised direction vector via getDirection().
 */
export class VirtualJoystick {
  constructor(zoneEl) {
    this.zone = zoneEl;
    this.active = false;
    this.originX = 0;
    this.originY = 0;
    this.dx = 0;
    this.dz = 0;
    this.radius = 55;
    this.touchId = null;

    // Canvas for drawing the joystick visuals
    this.canvas = document.createElement('canvas');
    this.canvas.width = 180;
    this.canvas.height = 180;
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    this.zone.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this.zone.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.zone.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.zone.addEventListener('touchend', this._onTouchEnd);
    this.zone.addEventListener('touchcancel', this._onTouchEnd);

    // Draw idle joystick centered in the zone
    this._drawIdle();
  }

  _drawIdle() {
    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    c.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const scale = w / this.zone.clientWidth;
    const r = this.radius * scale;

    // Base circle
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.06)';
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.15)';
    c.lineWidth = 1.5;
    c.stroke();

    // Knob at center
    c.beginPath();
    c.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fill();
  }

  _onTouchStart(e) {
    e.preventDefault();
    if (this.active) return;
    const t = e.changedTouches[0];
    this.touchId = t.identifier;
    // Fixed center origin
    this.originX = this.zone.clientWidth / 2;
    this.originY = this.zone.clientHeight / 2;
    this.dx = 0;
    this.dz = 0;
    this.active = true;
    this._draw(0, 0);
  }

  _onTouchMove(e) {
    e.preventDefault();
    if (!this.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== this.touchId) continue;
      const rect = this.zone.getBoundingClientRect();
      let rawX = (t.clientX - rect.left) - this.originX;
      let rawY = (t.clientY - rect.top) - this.originY;
      const dist = Math.sqrt(rawX * rawX + rawY * rawY);
      if (dist > this.radius) {
        rawX = (rawX / dist) * this.radius;
        rawY = (rawY / dist) * this.radius;
      }
      this.dx = rawX / this.radius;  // -1 to 1
      this.dz = rawY / this.radius;  // -1 to 1 (screen Y maps to Z forward/back)
      this._draw(rawX, rawY);
    }
  }

  _onTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.touchId) {
        this.active = false;
        this.dx = 0;
        this.dz = 0;
        this.touchId = null;
        this._drawIdle();
      }
    }
  }

  _draw(knobX, knobY) {
    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    c.clearRect(0, 0, w, h);

    const cx = this.originX * (w / this.zone.clientWidth);
    const cy = this.originY * (h / this.zone.clientHeight);
    const scale = w / this.zone.clientWidth;
    const r = this.radius * scale;

    // Base circle
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.08)';
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.2)';
    c.lineWidth = 1.5;
    c.stroke();

    // Knob
    const kx = cx + knobX * scale;
    const ky = cy + knobY * scale;
    c.beginPath();
    c.arc(kx, ky, r * 0.38, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.25)';
    c.fill();
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Returns { dx, dz } each in -1..1, or 0 when idle */
  getDirection() {
    return { dx: this.dx, dz: this.dz };
  }
}

/**
 * Handles touch-drag camera rotation on the right side of the screen.
 * In third-person: feeds azimuth/elevation deltas.
 * In FPS: feeds yaw/pitch deltas.
 */
export class TouchCameraController {
  constructor(element) {
    this.element = element;
    this.touchId = null;
    this.lastX = 0;
    this.lastY = 0;
    this.deltaX = 0;
    this.deltaY = 0;

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this.element.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.element.addEventListener('touchend', this._onTouchEnd);
    this.element.addEventListener('touchcancel', this._onTouchEnd);
  }

  _onTouchStart(e) {
    e.preventDefault();
    if (this.touchId !== null) return;
    const t = e.changedTouches[0];
    this.touchId = t.identifier;
    this.lastX = t.clientX;
    this.lastY = t.clientY;
  }

  _onTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== this.touchId) continue;
      this.deltaX += t.clientX - this.lastX;
      this.deltaY += t.clientY - this.lastY;
      this.lastX = t.clientX;
      this.lastY = t.clientY;
    }
  }

  _onTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.touchId) {
        this.touchId = null;
      }
    }
  }

  /** Returns accumulated delta and resets it */
  consumeDelta() {
    const d = { x: this.deltaX, y: this.deltaY };
    this.deltaX = 0;
    this.deltaY = 0;
    return d;
  }
}
