import { el, backIcon } from '../utils.js';
import { state, goto, render } from '../state.js';
import { DIFFICULTIES } from '../data/tasks.js';

const FINISH_OPTIONS = [50, 100, 200];

export function renderConfig() {
  const cfg = state.config;

  return el('section', { class: 'screen' }, [
    el(
      'button',
      {
        class: 'btn-back',
        'aria-label': 'Terug',
        onclick: () => goto('rules'),
      },
      [backIcon()]
    ),
    el('h1', { class: 'title' }, ['Spel configuratie']),
    el('div', { class: 'form' }, [
      el('div', { class: 'form__row' }, [
        el('span', { class: 'label' }, ['Aantal spelers:']),
        el('div', { class: 'counter' }, [
          el(
            'button',
            {
              class: 'counter__btn',
              'aria-label': 'Minder spelers',
              disabled: cfg.playerCount <= 2,
              onclick: () => {
                cfg.playerCount = Math.max(2, cfg.playerCount - 1);
                render();
              },
            },
            ['−']
          ),
          el('span', { class: 'counter__value' }, [String(cfg.playerCount)]),
          el(
            'button',
            {
              class: 'counter__btn',
              'aria-label': 'Meer spelers',
              disabled: cfg.playerCount >= 4,
              onclick: () => {
                cfg.playerCount = Math.min(4, cfg.playerCount + 1);
                render();
              },
            },
            ['+']
          ),
        ]),
      ]),
      el('div', { class: 'form__row' }, [
        el('span', { class: 'label' }, ['Moeilijkheidsgraad:']),
        el(
          'div',
          { class: 'options' },
          DIFFICULTIES.map((d) =>
            el(
              'button',
              {
                class: `option-btn ${cfg.difficulty === d.id ? 'is-active' : ''}`,
                onclick: () => {
                  cfg.difficulty = d.id;
                  render();
                },
              },
              [d.label]
            )
          )
        ),
      ]),
      el('div', { class: 'form__row' }, [
        el('span', { class: 'label' }, ['Posities:']),
        el(
          'div',
          { class: 'options' },
          FINISH_OPTIONS.map((n) =>
            el(
              'button',
              {
                class: `option-btn ${cfg.finish === n ? 'is-active' : ''}`,
                onclick: () => {
                  cfg.finish = n;
                  render();
                },
              },
              [String(n)]
            )
          )
        ),
      ]),
      cfg.difficulty === 'extreem' &&
        el('p', { class: 'subtitle', style: { color: 'var(--danger)', fontSize: '13px' } }, [
          'Let op: Extreem bevat 18+ inhoud.',
        ]),
    ]),
    el('div', { class: 'btn-row' }, [
      el(
        'button',
        { class: 'btn btn--primary', onclick: () => goto('players') },
        ['Volgende']
      ),
    ]),
  ]);
}
