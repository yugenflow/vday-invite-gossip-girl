export class EmailOverlay {
  constructor() {
    this.overlay = document.getElementById('email-overlay');
    this.emailWindow = document.getElementById('email-window');
    this.closeBtn = document.getElementById('email-close-btn');
    this.inviteEmail = document.getElementById('invite-email');
    this.emailContent = document.getElementById('email-content');
    this.emailActions = document.getElementById('email-actions');
    this.acceptBtn = document.getElementById('accept-btn');
    this.declineBtn = document.getElementById('decline-btn');

    this.onAccept = null;
    this.onDecline = null;
    this.onOpen = null;

    this.emailBody = `
      <div class="email-header-info">
        <div><strong>FROM:</strong> invitations@vogue.com</div>
        <div><strong>SUBJECT:</strong> ⭐ VOGUE Exclusive: You're Invited to Headline the Valentine's Runway!</div>
      </div>
      <div class="email-body-text">
        <p>Dear Fashionista,</p>
        <p>Your impeccable style and glamorous fashion sense have caught our attention.</p>
        <p><strong>VOGUE</strong> is thrilled to extend an exclusive invitation for you to <em>HEADLINE</em> the Valentine's Day Runway Show at the Upper East Side Fashion Gala!</p>
        <p>Strike your best poses on the <span class="highlight-yes">YES</span> spots and show the world your answer to the ultimate question: <em>"Will you be my Valentine?"</em></p>
        <p>The spotlight awaits, darling. Don't keep them waiting.</p>
        <p class="signature">With love,<br>The VOGUE Editorial Team</p>
        <p class="ps">P.S. You know you love me. — Gossip Girl</p>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // Click on unread email to show content
    if (this.inviteEmail) {
      this.inviteEmail.addEventListener('click', () => {
        this.showEmailContent();
      });
    }

    // Accept button
    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => {
        this.hide();
        if (this.onAccept) this.onAccept();
      });
    }

    // Decline button
    if (this.declineBtn) {
      this.declineBtn.addEventListener('click', () => {
        this.hide();
        if (this.onDecline) this.onDecline();
      });
    }
  }

  showEmailContent() {
    if (this.emailContent) {
      this.emailContent.innerHTML = this.emailBody;
      this.emailContent.style.display = 'block';
    }
    if (this.emailActions) {
      this.emailActions.style.display = 'flex';
    }
    if (this.inviteEmail) {
      this.inviteEmail.classList.remove('unread');
      this.inviteEmail.classList.add('read', 'selected');
    }
  }

  show() {
    if (this.overlay) {
      this.overlay.classList.add('visible');
    }
    // Reset state
    if (this.emailContent) {
      this.emailContent.style.display = 'none';
      this.emailContent.innerHTML = '';
    }
    if (this.emailActions) {
      this.emailActions.style.display = 'none';
    }
    if (this.inviteEmail) {
      this.inviteEmail.classList.remove('read', 'selected');
      this.inviteEmail.classList.add('unread');
    }
    if (this.onOpen) this.onOpen();
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('visible');
    }
  }
}
