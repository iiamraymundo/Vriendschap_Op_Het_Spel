import { el } from '../utils.js';
import { state, resetGame } from '../state.js';

export function renderEnd() {
  const w = state.winner;
  const losers = state.losers || [];
  const task = state.finalTask;

  const loserNames = losers.map((p) => p.name).join(', ') || '—';

  return el('section', { class: 'screen' }, [
    el('div', { class: 'end' }, [
      el('div', { class: 'end__emoji' }, ['🎉']),
      el('h1', { class: 'end__title' }, ['Spel afgelopen']),
      el('p', { class: 'end__winner' }, [
        el('strong', {}, [w ? w.name : 'Niemand']),
        ' heeft gewonnen!',
      ]),
      losers.length > 0 &&
        task &&
        el('div', { class: 'end__task' }, [
          el('div', { class: 'end__task-label' }, [
            losers.length > 1 ? 'Verliezers' : 'Verliezer',
          ]),
          el('p', { class: 'end__losers' }, [
            el('strong', {}, [loserNames]),
            losers.length > 1 ? ' moeten:' : ' moet:',
          ]),
          el('p', { class: 'end__task-text', style: { marginTop: '8px' } }, [task]),
        ]),
      losers.length === 0 &&
        el('p', { class: 'end__task-text', style: { margin: '16px 0 32px' } }, [
          'Iedereen heeft op dezelfde tijd de finish bereikt — geen verliezers!',
        ]),
      el('div', { class: 'btn-row', style: { marginTop: '8px' } }, [
        el(
          'button',
          { class: 'btn btn--primary btn--lg', onclick: () => resetGame() },
          ['Opnieuw spelen']
        ),
      ]),
    ]),
  ]);
}
