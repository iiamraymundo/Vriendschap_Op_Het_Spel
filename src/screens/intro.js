import { el } from '../utils.js';
import { goto } from '../state.js';

export function renderIntro() {
  return el('section', { class: 'screen' }, [
    el('div', { class: 'intro' }, [
      el('div', { class: 'intro__logo' }, ['V']),
      el('h1', { class: 'intro__title' }, ['Vriendschap op het spel']),
      el('p', { class: 'intro__tagline' }, [
        'Een hot-seat party game voor 2 tot 4 vrienden. Test hoe sterk jullie vriendschap echt is.',
      ]),
      el(
        'button',
        { class: 'btn btn--primary btn--lg', onclick: () => goto('rules') },
        ['Start']
      ),
    ]),
  ]);
}
