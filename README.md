# Vriendschap op het spel

> Een digitale hot-seat party game voor 2 tot 4 spelers. Gemaakt in het kader van het vak **UX Design**.

Dit is de digitale uitwerking van het bordspel "Vriendschap op het spel", ontworpen in Figma door Neta Kiala en Raymond Igbineweka. De game wordt op één computer gespeeld (hot-seat): spelers geven de muis aan elkaar door en doen om beurten hun beurt.

## Stack

- **Vite** (vanilla) — snelle dev-server, kleine build, geen framework nodig.
- **HTML / CSS / Vanilla JavaScript (ES Modules)** — elk scherm is een eigen module.
- **Geen backend** — alles draait client-side in de browser.

## Snel starten

Vereisten: [Node.js](https://nodejs.org/) 18 of hoger.

```bash
# 1. Installeer dependencies
npm install

# 2. Start de dev-server (opent automatisch in je browser)
npm run dev

# 3. Productie-build maken
npm run build

# 4. Build lokaal previewen
npm run preview
```

De dev-server draait standaard op [http://localhost:5173](http://localhost:5173).

## Project structuur

```
VriendschapOpHetSpel/
├── index.html              # Entry point
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js             # App bootstrap + router
    ├── state.js            # Centrale game state
    ├── utils.js            # DOM helpers (el, clear, icons)
    ├── style.css           # Design tokens + alle styles
    ├── data/
    │   ├── tasks.js        # Verliezersopdrachten per moeilijkheid
    │   ├── boardEvents.js  # Bord-events (safespot, skip, blocked...)
    │   └── jokers.js       # Joker-keuzes per moeilijkheid
    └── screens/
        ├── intro.js        # Startscherm
        ├── rules.js        # Spelregels
        ├── config.js       # Aantal spelers / moeilijkheid / eindpositie
        ├── players.js      # Namen invoeren
        ├── task.js         # Verliezersopdracht kiezen
        ├── summary.js      # Overzicht voor het starten
        ├── game.js         # Spelscherm (kaart trekken, joker, events)
        └── end.js          # Eindscherm met winnaar + straf
```

## Speluitleg (kort)

1. **Setup**: kies 2–4 spelers, moeilijkheid (Basis / Normaal / Extreem 18+), eindpositie (50 / 100 / 200), geef namen in en kies een verliezersopdracht.
2. **Spelverloop**: om beurten trekt een speler een kaart (0–9 of joker). Je gaat zoveel posities vooruit als de waarde op de kaart.
3. **Bord-events** (per positie-modulo 10):
   - `%10 = 3` → **safespot** (geen effect)
   - `%10 = 5` → **3 posities extra vooruit**
   - `%10 = 7` → **2 posities terug**
   - `%10 = 8` → **optie om volgende speler 1 beurt te laten overslaan**
   - `%10 = 9` → **geblokkeerd**: je blijft op je vorige positie
4. **Botsingen**: twee spelers mogen nooit op dezelfde positie staan. Je schuift door naar de eerstvolgende vrije positie.
5. **Joker**: 3 keuzes, sterker bij hogere moeilijkheid (ander terugschoppen, beurten skippen, of zelf vooruit).
6. **Einde**: eerste speler op de finish wint. **Alle** spelers die op dat moment de laagste positie delen (winnaar uitgesloten) moeten de gekozen opdracht uitvoeren.

## Aanpassen

- **Opdrachten toevoegen/wijzigen**: bewerk `src/data/tasks.js`.
- **Bord-events aanpassen**: bewerk `src/data/boardEvents.js`.
- **Joker-effecten veranderen**: bewerk `src/data/jokers.js`.
- **Styling / kleuren**: de design tokens staan bovenaan in `src/style.css`.

## Deployen

De build output (`dist/`) is een volledig statische site en werkt op elk statisch hosting platform. Aanbevolen opties:

### Vercel (aanbevolen)
1. Push deze repo naar GitHub.
2. Ga naar [vercel.com](https://vercel.com/new), importeer de repo.
3. Vercel detecteert Vite automatisch → klik **Deploy**.

### Netlify
1. Push deze repo naar GitHub.
2. Op [netlify.com](https://app.netlify.com/start): "Add new site → Import from Git".
3. Build command: `npm run build`. Publish directory: `dist`.

### GitHub Pages
```bash
npm run build
# Push de inhoud van dist/ naar de gh-pages branch
# Of gebruik een action zoals peaceiris/actions-gh-pages
```

## Links

- **Blog met onderzoek en user tests**: https://vriendschapophetspel.wordpress.com/
- **Figma-prototype**: https://www.figma.com/proto/sGir2gQOay8laSR7RIE8FT/VOHS?node-id=6-44

## Auteurs

- Neta Kiala
- Raymond Igbineweka

## Licentie

Schoolproject — niet bedoeld voor commercieel gebruik zonder toestemming van de auteurs.
