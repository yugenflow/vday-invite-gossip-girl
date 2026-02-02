export const STATES = {
  LOADING: 'LOADING',
  BEDROOM: 'BEDROOM',
  ENTERING_RANGE: 'ENTERING_RANGE',
  RETURNING_BEDROOM: 'RETURNING_BEDROOM',
  GUIDELINES: 'GUIDELINES',
  PICKUP_RIFLE: 'PICKUP_RIFLE',
  SHOOTING: 'SHOOTING',
  CELEBRATION: 'CELEBRATION',
  POST_CELEBRATION: 'POST_CELEBRATION',
  SHARE: 'SHARE',
};

export class GameStateMachine {
  constructor() {
    this.state = STATES.LOADING;
    this.listeners = {};
    this.transitions = {
      [STATES.LOADING]: [STATES.BEDROOM],
      [STATES.BEDROOM]: [STATES.ENTERING_RANGE],
      [STATES.ENTERING_RANGE]: [STATES.GUIDELINES, STATES.PICKUP_RIFLE],
      [STATES.RETURNING_BEDROOM]: [STATES.BEDROOM],
      [STATES.GUIDELINES]: [STATES.PICKUP_RIFLE],
      [STATES.PICKUP_RIFLE]: [STATES.SHOOTING, STATES.RETURNING_BEDROOM],
      [STATES.SHOOTING]: [STATES.CELEBRATION],
      [STATES.CELEBRATION]: [STATES.POST_CELEBRATION],
      [STATES.POST_CELEBRATION]: [STATES.SHARE, STATES.RETURNING_BEDROOM],
      [STATES.SHARE]: [STATES.RETURNING_BEDROOM],
    };
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  transition(newState) {
    const allowed = this.transitions[this.state];
    if (!allowed || !allowed.includes(newState)) {
      console.warn(`Invalid transition: ${this.state} -> ${newState}`);
      return false;
    }
    const oldState = this.state;
    this.state = newState;
    this.emit('stateChange', { from: oldState, to: newState });
    this.emit(newState, { from: oldState });
    return true;
  }

  is(state) {
    return this.state === state;
  }
}
