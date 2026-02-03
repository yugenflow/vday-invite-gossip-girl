export class HUD {
  constructor() {
    this.hitCounter = document.getElementById('hit-counter');
    this.taskCounter = document.getElementById('task-counter');
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

  showTask(text) {
    if (this.taskCounter) {
      this.taskCounter.innerHTML = `<span class="task-icon">📋</span> ${text}`;
      this.taskCounter.style.display = 'block';
    }
  }

  hideTask() {
    if (this.taskCounter) {
      this.taskCounter.style.display = 'none';
    }
  }
}
