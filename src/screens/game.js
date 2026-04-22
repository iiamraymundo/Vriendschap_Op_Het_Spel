import { el, menuIcon, randomInt } from '../utils.js';
import { state, render, resetGame, goto } from '../state.js';
import { getBoardEvent } from '../data/boardEvents.js';
import { JOKERS, JOKER_WARNING } from '../data/jokers.js';
import { getSelectedTaskText } from './task.js';

export function renderGame() {
  const cur = state.players[state.currentIndex];
  const turn = state.turn;

  return el('section', { class: 'screen screen--wide game' }, [
    el(
      'button',
      {
        class: 'btn-menu',
        'aria-label': 'Menu',
        onclick: () => {
          state.menuOpen = true;
          render();
        },
      },
      [menuIcon()]
    ),
    el('div', { class: 'game__main' }, [
      renderDeck(),
      renderDrawnSlot(),
      renderMessagePane(cur),
    ]),
    renderScores(),
  ]);
}

/* ---------- Deck ---------- */

function renderDeck() {
  const isDisabled =
    state.turn.drawn !== null || state.turn.jokerPending || state.turn.awaitingTargetFor !== null;

  return el(
    'div',
    {
      class: `card card--deck ${isDisabled ? 'is-disabled' : ''}`,
      onclick: () => {
        if (!isDisabled) drawCard();
      },
      title: isDisabled ? 'Klik op "Volgende speler" om verder te gaan' : 'Klik om een kaart te trekken',
    },
    [
      el('span', { style: { fontSize: '18px', fontWeight: '800', color: 'var(--text)' } }, ['0-9']),
      el('span', { style: { fontSize: '14px', fontWeight: '600' } }, ['& joker']),
    ]
  );
}

function renderDrawnSlot() {
  const d = state.turn.drawn;
  if (d === null) {
    return el('div', { class: 'card-slot' });
  }

  const isJoker = d === 'J';
  return el(
    'div',
    { class: `card card--drawn ${isJoker ? 'card--joker' : ''}` },
    [
      el('span', { class: 'card__corner card__corner--tl' }, [String(d)]),
      el('span', {}, [String(d)]),
      el('span', { class: 'card__corner card__corner--br' }, [String(d)]),
    ]
  );
}

/* ---------- Message / actions pane ---------- */

function renderMessagePane(cur) {
  const turn = state.turn;

  if (state.winner) {
    return el('div', {}, [
      el('p', { class: 'game__message' }, [
        el('strong', {}, [`${state.winner.name} heeft het spel gewonnen! 🎉`]),
      ]),
      el('p', { class: 'text-muted', style: { marginTop: '8px' } }, [
        'Tik op "Resultaat" om te zien wie de opdracht krijgt.',
      ]),
      el('div', { class: 'game__actions' }, [
        el(
          'button',
          { class: 'btn btn--primary btn--sm', onclick: () => goto('end') },
          ['Resultaat']
        ),
      ]),
    ]);
  }

  if (turn.awaitingTargetFor) {
    return renderTargetPicker(cur);
  }

  if (turn.jokerPending) {
    return renderJokerChoices(cur);
  }

  if (turn.drawn === null) {
    return el('div', {}, [
      el('p', { class: 'game__message' }, [
        el('strong', {}, [cur.name]),
        ' trek een kaart!',
      ]),
      turn.lastMessage &&
        el('p', { class: 'text-muted', style: { marginTop: '10px', fontSize: '13px' } }, [
          turn.lastMessage,
        ]),
    ]);
  }

  return renderEventResult(cur);
}

function renderEventResult(cur) {
  const turn = state.turn;
  const ev = turn.event;

  const lines = [];
  if (ev && ev.message) {
    lines.push(el('p', { class: 'game__message' }, [ev.moveText || '']));
    lines.push(el('p', { class: 'text-muted', style: { marginTop: '6px' } }, [ev.message]));
  } else {
    lines.push(
      el('p', { class: 'game__message' }, [
        `${cur.name} gaat ${turn.drawn} ${turn.drawn === 1 ? 'positie' : 'posities'} vooruit!`,
      ])
    );
  }

  const actions = [];

  if (ev && ev.kind === 'skip') {
    actions.push(
      el(
        'button',
        { class: 'btn btn--primary btn--sm', onclick: () => applySkipChoice(true) },
        ['Ja']
      ),
      el(
        'button',
        { class: 'btn btn--sm', onclick: () => applySkipChoice(false) },
        ['Nee']
      )
    );
  } else {
    actions.push(
      el(
        'button',
        { class: 'btn btn--primary btn--sm', onclick: endTurn },
        ['Volgende speler']
      )
    );
  }

  return el('div', {}, [...lines, el('div', { class: 'game__actions' }, actions)]);
}

/* ---------- Joker ---------- */

function renderJokerChoices(cur) {
  const opts = JOKERS[state.config.difficulty];
  return el('div', {}, [
    el('p', { class: 'game__message' }, [
      el('strong', {}, [`${cur.name} heeft een joker 🃏`]),
    ]),
    el('p', { class: 'text-muted', style: { marginTop: '4px' } }, ['Jij hebt 3 keuzes:']),
    el(
      'div',
      { class: 'joker-choices' },
      opts.map((opt) =>
        el(
          'button',
          {
            class: 'joker-choice',
            onclick: () => chooseJoker(opt),
          },
          [opt.label]
        )
      )
    ),
    el('p', { class: 'joker-warning' }, [JOKER_WARNING]),
  ]);
}

function renderTargetPicker(cur) {
  const others = state.players.filter((p) => p.id !== cur.id);
  return el('div', {}, [
    el('p', { class: 'game__message' }, ['Kies een medespeler:']),
    el(
      'div',
      { class: 'joker-choices' },
      others.map((p) =>
        el(
          'button',
          {
            class: 'joker-choice',
            onclick: () => pickTarget(p.id),
          },
          [p.name]
        )
      )
    ),
  ]);
}

/* ---------- Scores ---------- */

function renderScores() {
  return el(
    'div',
    { class: 'scores' },
    state.players.map((p, i) => {
      const isCurrent = i === state.currentIndex && !state.winner;
      return el('div', { class: `score ${isCurrent ? 'is-current' : ''}` }, [
        el('div', { class: 'score__box' }, [
          el('div', { class: 'score__label' }, ['Positie']),
          el('div', { class: 'score__value' }, [String(p.position)]),
        ]),
        el('div', { class: 'score__name' }, [p.name || `Speler ${i + 1}`]),
      ]);
    })
  );
}

/* ---------- Game logic ---------- */

function drawCard() {
  const cur = state.players[state.currentIndex];
  const isJoker = Math.random() < 0.12;

  if (isJoker) {
    state.turn.drawn = 'J';
    state.turn.jokerPending = true;
    state.turn.lastMessage = null;
    render();
    return;
  }

  const value = randomInt(0, 9);
  state.turn.drawn = value;
  state.turn.lastMessage = null;

  const prev = cur.position;
  const tentative = Math.min(state.config.finish, prev + value);
  const resolved = resolveCollision(cur, tentative);
  cur.position = resolved;

  if (cur.position >= state.config.finish) {
    declareWinner(cur);
    render();
    return;
  }

  const ev = getBoardEvent(cur.position, state.config.finish);
  if (ev) {
    if (ev.blocked) {
      cur.position = prev;
      state.turn.event = {
        ...ev,
        moveText: `${cur.name} wilde naar positie ${resolved}...`,
      };
    } else if (ev.bonusMove) {
      const afterBonus = Math.max(
        0,
        Math.min(state.config.finish, cur.position + ev.bonusMove)
      );
      const resolved2 = resolveCollision(cur, afterBonus, cur.position);
      cur.position = resolved2;
      state.turn.event = {
        ...ev,
        moveText: `${cur.name} gaat ${value} posities vooruit. ${
          ev.bonusMove > 0 ? 'Daarna ' + ev.bonusMove + ' extra vooruit.' : Math.abs(ev.bonusMove) + ' terug.'
        }`,
      };
      if (cur.position >= state.config.finish) {
        declareWinner(cur);
      }
    } else {
      state.turn.event = {
        ...ev,
        moveText: `${cur.name} gaat ${value} posities vooruit.`,
      };
    }
  } else {
    state.turn.event = null;
  }

  render();
}

/** Geen twee spelers op dezelfde positie: doorschuiven tot eerste vrije plek. */
function resolveCollision(self, targetPos, fallback = null) {
  const taken = new Set(
    state.players.filter((p) => p.id !== self.id).map((p) => p.position)
  );
  let p = targetPos;
  while (taken.has(p) && p < state.config.finish) p++;
  if (p > state.config.finish) return fallback != null ? fallback : state.config.finish;
  return p;
}

function applySkipChoice(didSkipNext) {
  if (didSkipNext) {
    const nextIdx = (state.currentIndex + 1) % state.players.length;
    state.players[nextIdx].skipTurns = (state.players[nextIdx].skipTurns || 0) + 1;
    state.turn.lastMessage = `${state.players[nextIdx].name} slaat een beurt over.`;
  } else {
    state.turn.lastMessage = null;
  }
  endTurn();
}

function chooseJoker(option) {
  const needsTarget = option.id !== 'self-forward';
  if (needsTarget) {
    state.turn.awaitingTargetFor = option;
  } else {
    const res = option.apply(state, { currentIndex: state.currentIndex });
    state.turn.lastMessage = res.description;
    const cur = state.players[state.currentIndex];
    if (cur.position >= state.config.finish) {
      declareWinner(cur);
      state.turn.jokerPending = false;
      render();
      return;
    }
    state.turn.jokerPending = false;
    endTurn();
  }
  render();
}

function pickTarget(targetId) {
  const opt = state.turn.awaitingTargetFor;
  const targetIndex = state.players.findIndex((p) => p.id === targetId);
  const res = opt.apply(state, {
    currentIndex: state.currentIndex,
    targetIndex,
  });
  state.turn.lastMessage = res.description;
  state.turn.awaitingTargetFor = null;
  state.turn.jokerPending = false;

  const target = state.players[targetIndex];
  if (target.position >= state.config.finish) {
    declareWinner(target);
    render();
    return;
  }

  endTurn();
}

function endTurn() {
  state.turn.drawn = null;
  state.turn.event = null;
  state.turn.jokerPending = false;
  state.turn.awaitingTargetFor = null;

  let next = (state.currentIndex + 1) % state.players.length;
  let guard = 0;
  while (state.players[next].skipTurns > 0 && guard < state.players.length * 4) {
    state.players[next].skipTurns -= 1;
    state.turn.lastMessage =
      (state.turn.lastMessage ? state.turn.lastMessage + ' ' : '') +
      `${state.players[next].name} slaat een beurt over.`;
    next = (next + 1) % state.players.length;
    guard++;
  }
  state.currentIndex = next;
  render();
}

function declareWinner(player) {
  state.winner = player;

  const losers = getLosers();
  state.losers = losers;
  state.finalTask = getSelectedTaskText();
}

/**
 * Laagste-positie-regel. Winnaar wordt uitgesloten; van de overige spelers
 * nemen we het minimum en krijgen ALLE spelers met die minimumpositie de straf.
 */
function getLosers() {
  const nonWinners = state.players.filter((p) => p.id !== state.winner.id);
  if (nonWinners.length === 0) return [];
  const min = Math.min(...nonWinners.map((p) => p.position));
  return nonWinners.filter((p) => p.position === min);
}

/* ---------- Menu modal ---------- */

export function renderMenuOverlay() {
  return el(
    'div',
    {
      class: 'menu-overlay',
      onclick: (e) => {
        if (e.target.classList.contains('menu-overlay')) {
          state.menuOpen = false;
          render();
        }
      },
    },
    [
      el('div', { class: 'menu-modal' }, [
        el('h3', {}, ['Menu']),
        el('div', { class: 'menu-modal__actions' }, [
          el(
            'button',
            {
              class: 'btn btn--ghost',
              onclick: () => {
                state.menuOpen = false;
                goto('rules');
              },
            },
            ['Spelregels opnieuw bekijken']
          ),
          el(
            'button',
            {
              class: 'btn btn--ghost',
              onclick: () => {
                state.menuOpen = false;
                render();
              },
            },
            ['Spel hervatten']
          ),
          el(
            'button',
            {
              class: 'btn btn--primary',
              onclick: () => {
                if (confirm('Weet je zeker dat je het spel wilt beëindigen?')) {
                  resetGame();
                }
              },
            },
            ['Spel beëindigen']
          ),
        ]),
      ]),
    ]
  );
}
