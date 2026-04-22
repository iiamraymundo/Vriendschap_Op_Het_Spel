// Centrale game state + router. Alle schermen lezen/aanpassen deze state en
// roepen `goto(screen)` aan om door te navigeren. De hoofdrender-functie zit
// in `main.js` en wordt na elke wijziging opnieuw uitgevoerd.

let _render = null;

export function registerRenderer(fn) {
  _render = fn;
}

export function render() {
  if (_render) _render();
}

/**
 * Initiële state. We maken er een factory van, zodat de "opnieuw spelen"-knop
 * eenvoudig alles kan resetten.
 */
export function createInitialState() {
  return {
    screen: 'intro',
    config: {
      playerCount: 2,
      difficulty: 'normaal',
      finish: 100,
      playerNames: ['', '', '', ''],
      loserTask: null,
      customTask: '',
    },
    players: [],
    currentIndex: 0,
    turn: {
      drawn: null,
      event: null,
      jokerPending: false,
      awaitingTargetFor: null,
      lastMessage: null,
      pendingSkipNext: false,
    },
    winner: null,
    losers: [],
    finalTask: null,
    menuOpen: false,
  };
}

export const state = createInitialState();

export function goto(screen) {
  state.screen = screen;
  state.menuOpen = false;
  render();
}

export function resetGame() {
  const fresh = createInitialState();
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, fresh);
  render();
}
