// Joker-keuzes per moeilijkheidsgraad. Per moeilijkheidsniveau krijgt de
// speler drie opties; hoe zwaarder het niveau, hoe pittiger de keuzes.

export const JOKERS = {
  basis: [
    { id: 'push-forward', label: 'Laat een medespeler 3 posities teruggaan.', apply: pushOther(-3) },
    { id: 'skip-other', label: 'Laat een medespeler 1 beurt overslaan.', apply: skipOther(1) },
    { id: 'self-forward', label: 'Jij gaat 5 posities vooruit.', apply: selfMove(5) },
  ],
  normaal: [
    { id: 'push-forward', label: 'Laat een medespeler 5 posities teruggaan.', apply: pushOther(-5) },
    { id: 'skip-other', label: 'Laat een medespeler 2 beurten overslaan.', apply: skipOther(2) },
    { id: 'self-forward', label: 'Jij gaat 8 posities vooruit.', apply: selfMove(8) },
  ],
  extreem: [
    { id: 'push-forward', label: 'Stuur een medespeler helemaal terug naar positie 0.', apply: resetOther() },
    { id: 'skip-other', label: 'Laat een medespeler 3 beurten overslaan.', apply: skipOther(3) },
    { id: 'self-forward', label: 'Jij gaat 12 posities vooruit.', apply: selfMove(12) },
  ],
};

export const JOKER_WARNING =
  'Je kiest één keuze. Je moet eerst de gekozen opdracht afwerken.';

/* ---------- Effect-factories ---------- */

function selfMove(delta) {
  return (state, { currentIndex }) => {
    const p = state.players[currentIndex];
    p.position = clamp(p.position + delta, 0, state.finish);
    return {
      description: `${p.name} gaat ${delta} posities vooruit.`,
    };
  };
}

function pushOther(delta) {
  return (state, { currentIndex, targetIndex }) => {
    const t = state.players[targetIndex];
    t.position = clamp(t.position + delta, 0, state.finish);
    const verb = delta < 0 ? 'teruggeschopt' : 'verplaatst';
    return {
      description: `${t.name} is ${Math.abs(delta)} posities ${verb}.`,
    };
  };
}

function resetOther() {
  return (state, { targetIndex }) => {
    const t = state.players[targetIndex];
    t.position = 0;
    return {
      description: `${t.name} is terug naar start gestuurd.`,
    };
  };
}

function skipOther(turns) {
  return (state, { targetIndex }) => {
    const t = state.players[targetIndex];
    t.skipTurns = (t.skipTurns || 0) + turns;
    return {
      description: `${t.name} moet ${turns} ${turns === 1 ? 'beurt' : 'beurten'} overslaan.`,
    };
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
