export class HUD {
  constructor() {
    this.hitCounter = document.getElementById('hit-counter');
  }

  showHitCounter(current, total) {
    if (this.hitCounter) {
      this.hitCounter.textContent = `POSES: ${current} / ${total}`;
      this.hitCounter.style.display = 'block';
    }
  }

  hideHitCounter() {
    if (this.hitCounter) {
      this.hitCounter.style.display = 'none';
    }
  }
}
