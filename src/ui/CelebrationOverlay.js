import { CELEBRATION_MESSAGE } from '../constants.js';

export class CelebrationOverlay {
  constructor() {
    this.overlay = document.getElementById('celebration-overlay');
    this.textEl = document.getElementById('celebration-text');
    this.continueBtn = document.getElementById('celebration-continue');
    this.onContinue = null;

    this.textEl.textContent = CELEBRATION_MESSAGE;

    this.continueBtn.addEventListener('click', () => {
      this.hide();
      if (this.onContinue) this.onContinue();
    });
  }

  show() {
    this.overlay.classList.add('visible');
  }

  hide() {
    this.overlay.classList.remove('visible');
  }
}
