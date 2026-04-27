import { el } from '../utils.js';
import { state, render } from '../state.js';
import { endTurn, applySkipChoice } from './game.js';

/**
 * Globale modal renderer. Op basis van `state.modal` toont deze het juiste
 * popup-venster boven het huidige scherm.
 */
export function renderModalIfAny() {
  if (!state.modal) return null;

  if (state.modal === 'extra-info') {
    return renderExtraInfoModal();
  }

  if (state.modal === 'event') {
    return renderEventModal();
  }

  return null;
}

function closeModal() {
  state.modal = null;
  render();
}

function renderExtraInfoModal() {
  return el(
    'div',
    {
      class: 'menu-overlay',
      onclick: (e) => {
        if (e.target.classList.contains('menu-overlay')) closeModal();
      },
    },
    [
      el('div', { class: 'menu-modal menu-modal--wide' }, [
        el(
          'button',
          {
            class: 'modal-close',
            'aria-label': 'Sluiten',
            onclick: closeModal,
          },
          ['×']
        ),
        el('h3', { style: { textAlign: 'left' } }, ['Extra speluitleg']),
        el('div', { class: 'rules-panel' }, [
          el('p', {}, [
            el('strong', {}, ['Moeilijkheidsgraad. ']),
            'Bij ',
            el('em', {}, ['Basis']),
            ' krijg je vriendelijke opdrachten, bij ',
            el('em', {}, ['Normaal']),
            ' iets pittiger en bij ',
            el('em', {}, ['Extreem']),
            ' echt uitdagende taken. ',
            el('strong', { style: { color: 'var(--danger)' } }, ['Extreem is bedoeld voor 18+.']),
          ]),
          el('p', {}, [
            el('strong', {}, ['De joker. ']),
            'Een speciale kaart met 3 keuzes. Je kiest er één en moet die direct uitvoeren voor het spel verdergaat. Hoe hoger de moeilijkheid, hoe sterker de joker-acties.',
          ]),
          el('p', {}, [
            el('strong', {}, ['Bord-events. ']),
            'Bepaalde posities triggeren een actie: een ',
            el('em', {}, ['safespot']),
            ' (geen effect), bonusvelden (extra vooruit of terug) of vakken die je dwingen te blijven staan.',
          ]),
          el('p', {}, [
            el('strong', {}, ['Geen botsingen. ']),
            'Twee spelers mogen nooit op dezelfde positie staan. Als je terechtkomt op een bezet vak, schuif je door naar de eerstvolgende vrije plek.',
          ]),
          el('p', {}, [
            el('strong', {}, ['Einde van het spel. ']),
            'De eerste speler op de eindpositie wint. ',
            el('em', {}, ['Alle']),
            ' spelers die op dat moment de laagste positie delen (winnaar uitgesloten) moeten de gekozen verliezersopdracht uitvoeren.',
          ]),
        ]),
        el(
          'div',
          { class: 'menu-modal__actions', style: { marginTop: '20px' } },
          [
            el(
              'button',
              { class: 'btn btn--primary', onclick: closeModal },
              ['Begrepen']
            ),
          ]
        ),
      ]),
    ]
  );
}

/* ---------- Event modal (bord-events tijdens spel) ---------- */

const EVENT_VISUALS = {
  safespot: { emoji: '🍀', title: 'Safespot' },
  forward: { emoji: '⚡', title: 'Geluksvak' },
  backward: { emoji: '🐢', title: 'Pech' },
  skip: { emoji: '⚠️', title: 'Beurt overslaan?' },
  blocked: { emoji: '🚫', title: 'Geblokkeerd' },
};

function renderEventModal() {
  const ev = state.turn.event;
  if (!ev) return null;

  const visual = EVENT_VISUALS[ev.kind] || { emoji: '✨', title: 'Event' };
  const isSkip = ev.kind === 'skip';

  const actions = isSkip
    ? [
        el(
          'button',
          {
            class: 'btn btn--primary',
            onclick: () => {
              state.modal = null;
              applySkipChoice(true);
            },
          },
          ['Ja, beurt overslaan']
        ),
        el(
          'button',
          {
            class: 'btn btn--ghost',
            onclick: () => {
              state.modal = null;
              applySkipChoice(false);
            },
          },
          ['Nee, bedankt']
        ),
      ]
    : [
        el(
          'button',
          {
            class: 'btn btn--primary',
            onclick: () => {
              state.modal = null;
              endTurn();
            },
          },
          ['Volgende speler']
        ),
      ];

  return el(
    'div',
    { class: 'menu-overlay' },
    [
      el('div', { class: 'menu-modal event-modal' }, [
        el('div', { class: 'event-modal__emoji' }, [visual.emoji]),
        el('h3', { class: 'event-modal__title' }, [visual.title]),
        el('div', { class: 'rules-panel event-modal__panel' }, [
          ev.moveText &&
            el('p', { class: 'event-modal__move' }, [ev.moveText]),
          el('p', { class: 'event-modal__message' }, [ev.message]),
        ]),
        el(
          'div',
          { class: 'menu-modal__actions', style: { marginTop: '20px' } },
          actions
        ),
      ]),
    ]
  );
}
