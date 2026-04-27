import { el, backIcon } from '../utils.js';
import { state, goto, render } from '../state.js';
import { TASKS, DIFFICULTY_GROUP_LABELS } from '../data/tasks.js';

const DIFFICULTY_LABELS = {
  basis: 'Basis',
  normaal: 'Normaal',
  extreem: 'Extreem',
};

export function renderTask() {
  const cfg = state.config;
  const level = cfg.difficulty;
  const tasksForLevel = TASKS[level] || [];
  const selectedId = cfg.loserTask;
  const customValue = cfg.customTask || '';

  const list = tasksForLevel.map((text, idx) => {
    const id = `${level}-${idx}`;
    const isSelected = selectedId === id;
    return el(
      'label',
      {
        class: `task-option ${isSelected ? 'is-selected' : ''}`,
        onclick: () => {
          cfg.loserTask = id;
          cfg.customTask = '';
          render();
        },
      },
      [el('span', { class: 'task-option__radio' }), el('span', {}, [text])]
    );
  });

  return el('section', { class: 'screen screen--wide' }, [
    el(
      'button',
      {
        class: 'btn-back',
        'aria-label': 'Terug',
        onclick: () => goto('players'),
      },
      [backIcon()]
    ),
    el('h1', { class: 'title' }, ['Wat moet de verliezer doen?']),
    el('p', { class: 'subtitle', style: { marginTop: '-12px' } }, [
      'Moeilijkheid: ',
      el(
        'span',
        {
          style: {
            fontWeight: '700',
            color: level === 'extreem' ? 'var(--danger)' : 'var(--primary)',
          },
        },
        [DIFFICULTY_LABELS[level] + (level === 'extreem' ? ' (18+)' : '')]
      ),
    ]),
    el('div', { class: 'task-groups' }, [
      el('div', { class: `task-group task-group--${level}` }, [
        el('div', { class: 'task-group__title' }, [DIFFICULTY_GROUP_LABELS[level]]),
        el('div', { class: 'task-list' }, list),
      ]),
      el('div', { class: 'task-custom' }, [
        el(
          'div',
          { class: 'label', style: { marginBottom: '8px', fontSize: '13px' } },
          ['Of typ zelf een opdracht:']
        ),
        el('input', {
          type: 'text',
          class: 'task-custom-input',
          placeholder: 'Typ een zelfgekozen opdracht',
          maxlength: 200,
          value: customValue,
          oninput: (e) => {
            cfg.customTask = e.target.value;
            if (e.target.value.trim().length > 0) {
              cfg.loserTask = 'custom';
              render();
            }
          },
        }),
      ]),
    ]),
    el('div', { class: 'btn-row' }, [
      el(
        'button',
        {
          class: 'btn btn--primary',
          onclick: () => {
            const hasCustom = cfg.loserTask === 'custom' && cfg.customTask.trim().length > 0;
            const hasPreset = cfg.loserTask && cfg.loserTask !== 'custom';
            if (!hasCustom && !hasPreset) {
              alert('Kies een opdracht of typ zelf een opdracht in.');
              return;
            }
            goto('summary');
          },
        },
        ['Volgende']
      ),
    ]),
  ]);
}

export function getSelectedTaskText() {
  const cfg = state.config;
  if (cfg.loserTask === 'custom') return cfg.customTask.trim();
  if (!cfg.loserTask) return '';
  const [level, idx] = cfg.loserTask.split('-');
  return TASKS[level]?.[Number(idx)] || '';
}
