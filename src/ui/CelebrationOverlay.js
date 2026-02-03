import { MESSAGES } from '../constants.js';

export class CelebrationOverlay {
  constructor() {
    this.overlay = document.getElementById('celebration-overlay');
    this.textEl = document.getElementById('celebration-text');
    this.continueBtn = document.getElementById('celebration-continue');
    this.onContinue = null;

    // Set combined message with GG narration
    this.textEl.innerHTML = `
      <span style="display:block;margin-bottom:16px;">${MESSAGES.CELEBRATION}</span>
      <span style="display:block;font-style:italic;font-size:0.9rem;color:#999;line-height:1.6;">${MESSAGES.GG_NARRATION}</span>
    `;

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
