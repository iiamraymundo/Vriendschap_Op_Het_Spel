import './style.css';
import { state, registerRenderer } from './state.js';
import { clear } from './utils.js';
import { renderIntro } from './screens/intro.js';
import { renderRules } from './screens/rules.js';
import { renderConfig } from './screens/config.js';
import { renderPlayers } from './screens/players.js';
import { renderTask } from './screens/task.js';
import { renderSummary } from './screens/summary.js';
import { renderGame, renderMenuOverlay } from './screens/game.js';
import { renderEnd } from './screens/end.js';

const root = document.getElementById('app');

const SCREENS = {
  intro: renderIntro,
  rules: renderRules,
  config: renderConfig,
  players: renderPlayers,
  task: renderTask,
  summary: renderSummary,
  game: renderGame,
  end: renderEnd,
};

function render() {
  clear(root);
  const fn = SCREENS[state.screen] || renderIntro;
  root.appendChild(fn());
  if (state.menuOpen && state.screen === 'game') {
    root.appendChild(renderMenuOverlay());
  }
}

registerRenderer(render);
render();
