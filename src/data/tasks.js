// Voorgestelde verliezersopdrachten per moeilijkheidsgraad.
// Gebaseerd op de Figma-mockups (scherm "Wat moet de verliezer doen?").

export const TASKS = {
  basis: [
    'De verliezer moet elke speler een compliment geven.',
    'De verliezer moet een dier kiezen en dat geluid 5 seconden nadoen.',
    'De verliezer moet 10 seconden een dansje doen.',
    'De verliezer moet 5 push-ups doen.',
  ],
  normaal: [
    'Stuur een willekeurige emoji naar een persoon in je contacten zonder uitleg.',
    'Doe 30 squats terwijl je een liedje moet zingen.',
    'De verliezer moet 15 push-ups doen.',
    'Laat een andere speler een grappige bijnaam voor je kiezen die je de rest van het spel moet gebruiken.',
  ],
  extreem: [
    'Geef elke andere speler 10 euro.',
    'Doe 5 minuten een handstand tegen de muur.',
    'Eet een hele citroen op (met schil).',
    'Doe 30 pull-ups.',
    'Loop 20 minuten zonder te stoppen.',
    'Maak een OnlyFans-account aan.',
    'Krijg 5 (zachte) klappen van de andere spelers.',
    'Laat een speler een gek kapsel maken met gel of haarlak dat je een uur moet laten zitten.',
  ],
};

export const DIFFICULTIES = [
  { id: 'basis', label: 'Basis' },
  { id: 'normaal', label: 'Normaal' },
  { id: 'extreem', label: 'Extreem' },
];

export const DIFFICULTY_GROUP_LABELS = {
  basis: 'Makkelijke opdrachten',
  normaal: 'Gemiddelde opdrachten',
  extreem: 'Extreme opdrachten',
};
