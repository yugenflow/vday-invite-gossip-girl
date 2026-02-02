export class ShareOverlay {
  constructor() {
    this.overlay = document.getElementById('share-overlay');
    this.btn = document.getElementById('share-btn');
    this.toast = document.getElementById('share-toast');

    this.btn.addEventListener('click', () => {
      this.copyToClipboard();
    });
  }

  show() {
    this.overlay.classList.add('visible');
  }

  hide() {
    this.overlay.classList.remove('visible');
  }

  copyToClipboard() {
    const message = `I just got the most creative Valentine's invite ever! Check it out: ${window.location.href}`;
    navigator.clipboard.writeText(message).then(() => {
      this.toast.classList.add('visible');
      setTimeout(() => this.toast.classList.remove('visible'), 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.toast.classList.add('visible');
      setTimeout(() => this.toast.classList.remove('visible'), 2000);
    });
  }
}
