export const STATES = {
  LOADING: 'LOADING',
  APARTMENT: 'APARTMENT',
  ENTERING_RUNWAY: 'ENTERING_RUNWAY',
  RETURNING_APARTMENT: 'RETURNING_APARTMENT',
  GOSSIP_GIRL_BLAST: 'GOSSIP_GIRL_BLAST',
  RUNWAY_WALK: 'RUNWAY_WALK',
  CELEBRATION: 'CELEBRATION',
  POST_CELEBRATION: 'POST_CELEBRATION',
  SHARE: 'SHARE',
};

export class GameStateMachine {
  constructor() {
    this.state = STATES.LOADING;
    this.listeners = {};
    this.transitions = {
      [STATES.LOADING]: [STATES.APARTMENT],
      [STATES.APARTMENT]: [STATES.ENTERING_RUNWAY],
      [STATES.ENTERING_RUNWAY]: [STATES.GOSSIP_GIRL_BLAST, STATES.RUNWAY_WALK],
      [STATES.RETURNING_APARTMENT]: [STATES.APARTMENT],
      [STATES.GOSSIP_GIRL_BLAST]: [STATES.RUNWAY_WALK],
      [STATES.RUNWAY_WALK]: [STATES.CELEBRATION, STATES.RETURNING_APARTMENT],
      [STATES.CELEBRATION]: [STATES.POST_CELEBRATION],
      [STATES.POST_CELEBRATION]: [STATES.SHARE, STATES.RETURNING_APARTMENT],
      [STATES.SHARE]: [STATES.RETURNING_APARTMENT],
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
