import { el, backIcon } from '../utils.js';
import { state, goto } from '../state.js';
import { getSelectedTaskText } from './task.js';

export function renderSummary() {
  const cfg = state.config;
  const difficultyLabel = {
    basis: 'Basis',
    normaal: 'Normaal',
    extreem: 'Extreem (18+)',
  }[cfg.difficulty];

  return el('section', { class: 'screen' }, [
    el(
      'button',
      {
        class: 'btn-back',
        'aria-label': 'Terug',
        onclick: () => goto('task'),
      },
      [backIcon()]
    ),
    el('h1', { class: 'title' }, ['Spel configuratie']),
    el('div', { class: 'summary' }, [
      row('Aantal spelers:', String(cfg.playerCount)),
      row('Game mode:', difficultyLabel),
      row('Aantal posities:', String(cfg.finish)),
      row('Spelers:', cfg.playerNames.slice(0, cfg.playerCount).filter(Boolean).join(', ')),
      row('Verliezers opdracht:', getSelectedTaskText()),
    ]),
    el('div', { class: 'btn-row' }, [
      el(
        'button',
        {
          class: 'btn btn--primary btn--lg',
          onclick: () => {
            startGame();
          },
        },
        ['Start spel']
      ),
    ]),
  ]);
}

function row(label, value) {
  return el('div', { class: 'summary__row' }, [
    el('span', { class: 'summary__label' }, [label]),
    el('span', { class: 'summary__value' }, [value || '—']),
  ]);
}

function startGame() {
  const cfg = state.config;
  state.players = cfg.playerNames.slice(0, cfg.playerCount).map((name, i) => ({
    id: i,
    name: name.trim(),
    position: 0,
    skipTurns: 0,
  }));
  state.currentIndex = 0;
  state.turn = {
    drawn: null,
    event: null,
    jokerPending: false,
    awaitingTargetFor: null,
    lastMessage: null,
    pendingSkipNext: false,
  };
  state.winner = null;
  state.losers = [];
  state.finalTask = null;
  state.deckHintRemaining = 2;
  goto('game');
}
