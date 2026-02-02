export class HUD {
  constructor() {
    this.crosshair = document.getElementById('crosshair');
    this.hitCounter = document.getElementById('hit-counter');
  }

  showCrosshair() {
    this.crosshair.style.display = 'block';
  }

  hideCrosshair() {
    this.crosshair.style.display = 'none';
    this.hideHitCounter();
  }

  showHitCounter(current, total) {
    if (this.hitCounter) {
      this.hitCounter.textContent = `YES: ${current} / ${total}`;
      this.hitCounter.style.display = 'block';
    }
  }

  hideHitCounter() {
    if (this.hitCounter) {
      this.hitCounter.style.display = 'none';
    }
  }
}
