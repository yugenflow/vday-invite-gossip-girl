import guidelinesText from '../../guidelines.txt?raw';

export class GuidelinesOverlay {
  constructor() {
    this.overlay = document.getElementById('guidelines-overlay');
    this.textEl = document.getElementById('guidelines-text');
    this.closeBtn = document.getElementById('guidelines-close');
    this.onClose = null;

    this.textEl.innerHTML = this.formatGuidelines(guidelinesText);

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
      } else if (/^\d+\./.test(trimmed)) {
        html += `<p style="margin: 6px 0; padding-left: 8px; line-height: 1.7; white-space: nowrap;">${trimmed}</p>`;
      } else if (trimmed.startsWith('Note:')) {
        html += `<p style="margin: 14px 0 4px; font-style: italic; font-size: 0.88rem; color: #5a3a1a; line-height: 1.7;">${trimmed}</p>`;
      } else if (trimmed.startsWith('Lastly')) {
        html += `<p style="margin: 14px 0 4px; font-weight: bold; color: #5a2e10; line-height: 1.7;">${trimmed}</p>`;
      } else {
        html += `<p style="margin: 4px 0; line-height: 1.7;">${trimmed}</p>`;
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
