import guidelinesText from '../../gossipgirlblast.txt?raw';
import { NAMES, generateNameHint } from '../config.js';

export class GuidelinesOverlay {
  constructor() {
    this.overlay = document.getElementById('guidelines-overlay');
    this.textEl = document.getElementById('guidelines-text');
    this.closeBtn = document.getElementById('guidelines-close');
    this.onClose = null;

    const personalizedText = guidelinesText
      .replace(/\{\{PETNAME\}\}/g, NAMES.petname)
      .replace(/\{\{NAME_HINT\}\}/g, generateNameHint(NAMES.recipientFull));
    this.textEl.innerHTML = this.formatGuidelines(personalizedText);

    this.closeBtn.addEventListener('click', () => {
      this.hide();
      if (this.onClose) this.onClose();
    });
  }

  formatGuidelines(raw) {
    const lines = raw.split('\n');
    let html = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        html += '<div style="height: 12px;"></div>';
      } else if (trimmed === 'GOSSIP GIRL BLAST') {
        html += `<p style="margin: 0 0 12px; font-size: 0.9rem; letter-spacing: 5px; text-transform: uppercase; color: #FFD700; text-align: center;">${trimmed}</p>`;
      } else if (/^\d+\./.test(trimmed)) {
        html += `<p style="margin: 8px 0; padding-left: 10px; line-height: 1.8; font-size: 1.1rem;">${trimmed}</p>`;
      } else if (trimmed.startsWith('Note:')) {
        html += `<p style="margin: 16px 0 6px; font-style: italic; font-size: 1rem; color: #999; line-height: 1.8;">${trimmed}</p>`;
      } else if (trimmed.startsWith('XOXO')) {
        html += `<p style="margin: 16px 0 6px; font-weight: bold; color: #FFD700; line-height: 1.8; text-align: center; font-size: 1.15rem;">${trimmed}</p>`;
      } else if (trimmed.startsWith('And remember')) {
        html += `<p style="margin: 16px 0 6px; font-weight: bold; color: #FFD700; line-height: 1.8; font-size: 1.1rem;">${trimmed}</p>`;
      } else {
        html += `<p style="margin: 6px 0; line-height: 1.8; font-size: 1.1rem;">${trimmed}</p>`;
      }
    }
    return html;
  }

  show() {
    this.overlay.classList.add('visible');
  }

  hide() {
    this.overlay.classList.remove('visible');
  }
}
