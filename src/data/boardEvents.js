// Bord-events uit de Figma-workflow. Events triggeren wanneer een speler op een
// bepaalde *positie modulo* afstemt. De handlers geven altijd een object terug
// met een `message` (getoond in de UI) en optionele gameplay-effecten
// (`skipNext`, `resetTo`, `bonusMove`, `blocked`).

/**
 * Geeft een bord-event terug voor een gegeven landingspositie, of null als er
 * geen speciaal event is. We werken met positie-modulo zodat de events zich
 * over een (50/100/200) bord herhalen in een leesbaar ritme.
 *
 * @param {number} position — huidige positie na verplaatsing
 * @param {number} finish — eindscore (50/100/200)
 * @returns {BoardEvent|null}
 */
export function getBoardEvent(position, finish) {
  if (position <= 0 || position >= finish) return null;

  const mod = position % 10;

  if (mod === 3) {
    return {
      kind: 'safespot',
      message: 'Deze positie is een safespot. Jij hebt geluk!',
    };
  }

  if (mod === 5) {
    return {
      kind: 'forward',
      message: 'Geluksvak! Je mag 3 posities vooruit.',
      bonusMove: 3,
    };
  }

  if (mod === 7) {
    return {
      kind: 'backward',
      message: 'Pech! Je gaat 2 posities terug.',
      bonusMove: -2,
    };
  }

  if (mod === 8) {
    return {
      kind: 'skip',
      message: 'Je beurt overslaan? Je laat de volgende speler 1 beurt missen.',
      skipNext: true,
    };
  }

  if (mod === 9) {
    return {
      kind: 'blocked',
      message: 'Helaas staat deze positie het niet toe om te blijven. Je blijft op je vorige positie.',
      blocked: true,
    };
  }

  return null;
}

/** @typedef {{kind:string, message:string, skipNext?:boolean, resetTo?:number, bonusMove?:number, blocked?:boolean}} BoardEvent */
