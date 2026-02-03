import * as THREE from 'three';

export class InteractionSystem {
  constructor(mobile = false) {
    this.mobile = mobile;
    this.interactables = [];
    this.secondaryInteractables = [];
    this.tertiaryInteractables = [];
    this.petInteractables = [];
    this.currentPrompt = null;
    this.currentSecondary = null;
    this.currentTertiary = null;
    this.currentPet = null;
    this.promptEl = document.getElementById('interaction-prompt');
    this.mobileButtonsEl = document.getElementById('mobile-interaction-buttons');
    this.onInteract = null;
    this.onSecondaryInteract = null;
    this.onTertiaryInteract = null;
    this.onPetInteract = null;
    this.enabled = false;

    if (!this.mobile) {
      this._onKeyDown = this._onKeyDown.bind(this);
      document.addEventListener('keydown', this._onKeyDown);
    } else if (this.mobileButtonsEl) {
      this._setupMobileButtons();
    }
  }

  _setupMobileButtons() {
    this.mobileButtonsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn || !this.enabled) return;
      this.triggerInteraction(btn.dataset.action);
    });
  }

  /** Callable from mobile tap buttons */
  triggerInteraction(type) {
    if (!this.enabled) return;
    if (type === 'primary' && this.currentPrompt && this.onInteract) {
      this.onInteract(this.currentPrompt.userData.interactionType);
    }
    if (type === 'secondary' && this.currentSecondary && this.onSecondaryInteract) {
      this.onSecondaryInteract(this.currentSecondary.userData.secondaryType);
    }
    if (type === 'tertiary' && this.currentTertiary && this.onTertiaryInteract) {
      this.onTertiaryInteract(this.currentTertiary.userData.tertiaryType);
    }
    if (type === 'pet' && this.currentPet && this.onPetInteract) {
      this.onPetInteract(this.currentPet);
    }
  }

  enable() { this.enabled = true; }
  disable() {
    this.enabled = false;
    this.hidePrompt();
    this.currentPrompt = null;
    this.currentSecondary = null;
    this.currentTertiary = null;
    this.currentPet = null;
  }

  setInteractables(items) {
    this.interactables = items;
  }

  setSecondaryInteractables(items) {
    this.secondaryInteractables = items;
  }

  setTertiaryInteractables(items) {
    this.tertiaryInteractables = items;
  }

  setPetInteractables(items) {
    this.petInteractables = items;
  }

  _onKeyDown(e) {
    if (!this.enabled) return;
    if (e.key.toLowerCase() === 'e' && this.currentPrompt) {
      if (this.onInteract) {
        this.onInteract(this.currentPrompt.userData.interactionType);
      }
    }
    if (e.key.toLowerCase() === 'r' && this.currentSecondary) {
      if (this.onSecondaryInteract) {
        this.onSecondaryInteract(this.currentSecondary.userData.secondaryType);
      }
    }
    if (e.key.toLowerCase() === 'c' && this.currentTertiary) {
      if (this.onTertiaryInteract) {
        this.onTertiaryInteract(this.currentTertiary.userData.tertiaryType);
      }
    }
    if (e.key.toLowerCase() === 'p' && this.currentPet) {
      if (this.onPetInteract) {
        this.onPetInteract(this.currentPet);
      }
    }
  }

  update(playerPos) {
    if (!this.enabled) {
      this.hidePrompt();
      return;
    }

    let closest = null;
    let closestDist = Infinity;
    let closestSecondary = null;
    let closestSecDist = Infinity;
    let closestTertiary = null;
    let closestTerDist = Infinity;

    // Check primary interactables (E key)
    for (const item of this.interactables) {
      if (!item || !item.userData.interactable) continue;
      const pos = new THREE.Vector3();
      item.getWorldPosition(pos);
      const dist = pos.distanceTo(playerPos);
      if (dist < 2.5 && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }

    // Check secondary interactables (R key)
    for (const item of this.secondaryInteractables) {
      if (!item || !item.userData.secondaryInteractable) continue;
      const pos = new THREE.Vector3();
      item.getWorldPosition(pos);
      const dist = pos.distanceTo(playerPos);
      if (dist < 2.5 && dist < closestSecDist) {
        closestSecondary = item;
        closestSecDist = dist;
      }
    }

    // Check tertiary interactables (C key)
    for (const item of this.tertiaryInteractables) {
      if (!item || !item.userData.tertiaryInteractable) continue;
      const pos = new THREE.Vector3();
      item.getWorldPosition(pos);
      const dist = pos.distanceTo(playerPos);
      if (dist < 2.5 && dist < closestTerDist) {
        closestTertiary = item;
        closestTerDist = dist;
      }
    }

    // Check pet interactables (P key) — uses world position of the group
    let closestPet = null;
    let closestPetDist = Infinity;
    for (const item of this.petInteractables) {
      if (!item) continue;
      const pos = new THREE.Vector3();
      item.getWorldPosition(pos);
      const dist = pos.distanceTo(playerPos);
      if (dist < 2.0 && dist < closestPetDist) {
        closestPet = item;
        closestPetDist = dist;
      }
    }

    this.currentPrompt = closest;
    this.currentSecondary = closestSecondary;
    this.currentTertiary = closestTertiary;
    this.currentPet = closestPet;

    if (this.mobile) {
      // Show/hide mobile tap buttons
      this._updateMobileButtons(closest, closestSecondary, closestTertiary, closestPet);
    } else {
      // Build prompt text for desktop
      const lines = [];
      if (closest) {
        lines.push(closest.userData.promptText || 'Press E to interact');
      }
      if (closestSecondary) {
        lines.push(closestSecondary.userData.secondaryPromptText || 'Press R to interact');
      }
      if (closestTertiary) {
        lines.push(closestTertiary.userData.tertiaryPromptText || 'Press C to interact');
      }
      if (closestPet) {
        lines.push('Press P to Pet Nugget!');
      }
      if (lines.length > 0) {
        this.showPrompt(lines.join('  |  '));
      } else {
        this.hidePrompt();
      }
    }
  }

  _updateMobileButtons(primary, secondary, tertiary, pet) {
    if (!this.mobileButtonsEl) return;
    const btns = this.mobileButtonsEl.children;
    // Order: primary, secondary, tertiary, pet
    const items = [
      { el: btns[0], obj: primary, label: primary ? (primary.userData.promptText || 'Interact').replace(/^Press E (to )?/i, '') : '' },
      { el: btns[1], obj: secondary, label: secondary ? (secondary.userData.secondaryPromptText || 'Read').replace(/^Press R (to )?/i, '') : '' },
      { el: btns[2], obj: tertiary, label: tertiary ? (tertiary.userData.tertiaryPromptText || 'Use').replace(/^Press C (to )?/i, '') : '' },
      { el: btns[3], obj: pet, label: 'Pet Nugget!' },
    ];
    let anyVisible = false;
    for (const item of items) {
      if (!item.el) continue;
      if (item.obj) {
        item.el.textContent = item.label;
        item.el.style.display = 'block';
        anyVisible = true;
      } else {
        item.el.style.display = 'none';
      }
    }
    this.mobileButtonsEl.style.display = anyVisible ? 'flex' : 'none';
  }

  showPrompt(text) {
    this.promptEl.textContent = text;
    this.promptEl.style.display = 'block';
  }

  hidePrompt() {
    this.promptEl.style.display = 'none';
    if (this.mobileButtonsEl) this.mobileButtonsEl.style.display = 'none';
  }

  dispose() {
    if (!this.mobile) {
      document.removeEventListener('keydown', this._onKeyDown);
    }
  }
}
