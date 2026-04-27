import { el, backIcon } from '../utils.js';
import { state, goto, render } from '../state.js';

export function renderRules() {
  return el('section', { class: 'screen' }, [
    el(
      'button',
      {
        class: 'btn-back',
        'aria-label': 'Terug',
        onclick: () => goto('intro'),
      },
      [backIcon()]
    ),
    el(
      'button',
      {
        class: 'btn btn--sm btn--ghost extra-info-btn',
        onclick: () => {
          state.modal = 'extra-info';
          render();
        },
      },
      ['Extra speluitleg']
    ),
    el('h1', { class: 'title' }, ['Spelregels']),
    el('div', { class: 'rules-panel' }, [
      el('p', {}, [
        'Het spel wordt gespeeld door 2 tot 4 spelers. Alle spelers beginnen op positie 0. Tijdens je beurt trek je een kaart. Deze kaart kan een getal van 0 tot 9 zijn of een joker. Het getal op de kaart bepaalt hoeveel stappen je vooruit mag gaan op het speelveld.',
      ]),
      el('p', {}, [
        'Elke positie op het speelveld kan een opdracht, een conditie of niets bevatten. De speler moet op voorhand weten wat een positie bevat. Wanneer een speler op een positie landt, moet hij de actie uitvoeren die bij die positie hoort.',
      ]),
      el('p', {}, [
        'Twee spelers mogen nooit op dezelfde positie staan. Als een speler op een positie terechtkomt waar al een andere speler staat, moet hij doorgaan naar de volgende vrije positie.',
      ]),
      el('p', {}, [
        'De speler die als eerste de finish bereikt, wint het spel. Alle spelers die op dat moment de laagste positie delen, moeten een gekozen opdracht uitvoeren. ',
      ]),
    ]),
    el('div', { class: 'btn-row' }, [
      el(
        'button',
        { class: 'btn btn--primary', onclick: () => goto('config') },
        ['Volgende']
      ),
    ]),
  ]);
}
