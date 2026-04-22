import { el, backIcon } from '../utils.js';
import { state, goto, render } from '../state.js';

export function renderPlayers() {
  const cfg = state.config;
  const inputs = [];

  for (let i = 0; i < cfg.playerCount; i++) {
    inputs.push(
      el('input', {
        type: 'text',
        class: 'name-input',
        placeholder: `speler ${i + 1}`,
        maxlength: 16,
        value: cfg.playerNames[i] || '',
        oninput: (e) => {
          cfg.playerNames[i] = e.target.value;
        },
      })
    );
  }

  const allFilled = () =>
    cfg.playerNames.slice(0, cfg.playerCount).every((n) => (n || '').trim().length > 0);

  return el('section', { class: 'screen' }, [
    el(
      'button',
      {
        class: 'btn-back',
        'aria-label': 'Terug',
        onclick: () => goto('config'),
      },
      [backIcon()]
    ),
    el(
      'h2',
      {
        class: 'title',
        style: { fontSize: '20px', fontWeight: '600', marginTop: '16px', textAlign: 'left', paddingLeft: '48px' },
      },
      [`${cfg.playerCount} Spelers`]
    ),
    el('p', { class: 'subtitle', style: { marginTop: '8px' } }, ['Geef de namen van de spelers in']),
    el('div', { class: 'name-inputs' }, inputs),
    el('div', { class: 'btn-row' }, [
      el(
        'button',
        {
          class: 'btn btn--primary',
          onclick: () => {
            if (!allFilled()) {
              alert('Vul alstublieft alle namen in.');
              return;
            }
            goto('task');
          },
        },
        ['Volgende']
      ),
    ]),
  ]);
}
