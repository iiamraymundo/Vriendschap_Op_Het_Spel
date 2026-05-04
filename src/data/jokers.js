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
    {
      id: 'push-forward',
      label: 'Laat een medespeler 10 posities teruggaan (nooit onder positie 1).',
      apply: pushOtherBackTenFloorOne(),
    },
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
    const finish = state.config.finish;
    p.position = clamp(p.position + delta, 0, finish);
    return {
      description: `${p.name} gaat ${delta} posities vooruit.`,
    };
  };
}

function pushOther(delta) {
  return (state, { targetIndex }) => {
    const t = state.players[targetIndex];
    const finish = state.config.finish;
    t.position = clamp(t.position + delta, 0, finish);
    const verb = delta < 0 ? 'teruggeschopt' : 'verplaatst';
    return {
      description: `${t.name} is ${Math.abs(delta)} posities ${verb}.`,
    };
  };
}

function pushOtherBackTenFloorOne() {
  return (state, { targetIndex }) => {
    const t = state.players[targetIndex];
    const finish = state.config.finish;
    const before = t.position;
    t.position = Math.min(Math.max(1, before - 10), finish);
    const back = before - t.position;
    return {
      description:
        back > 0
          ? `${t.name} gaat ${back} ${back === 1 ? 'positie' : 'posities'} terug (minimum positie 1).`
          : `${t.name} blijft op positie ${t.position}.`,
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
