/**
 * Hogwarts School of Pythoncraft & Wizardry - Lore & Game Mechanics
 * Connects Python computer science concepts with Harry Potter magical world.
 */

export const HOGWARTS_HOUSES = {
  Gryffindor: {
    id: 'Gryffindor',
    name: 'Gryffindor',
    crest: '🦁',
    element: 'Fire',
    colors: {
      primary: '#740001',
      secondary: '#D3A625',
      accent: 'from-amber-600 via-rose-700 to-amber-800',
      border: 'border-amber-400',
      badge: 'bg-rose-950 text-amber-200 border-amber-500/40',
    },
    founder: 'Godric Gryffindor',
    trait: 'Courage, Chivalry, and Determination',
    motto: '"Their daring, nerve, and chivalry set Gryffindors apart."',
    headOfHouse: 'Professor Minerva McGonagall',
    basePoints: 210,
  },
  Ravenclaw: {
    id: 'Ravenclaw',
    name: 'Ravenclaw',
    crest: '🦅',
    element: 'Air',
    colors: {
      primary: '#0e1a40',
      secondary: '#946b2d',
      accent: 'from-blue-700 via-indigo-900 to-sky-800',
      border: 'border-sky-400',
      badge: 'bg-blue-950 text-sky-200 border-sky-500/40',
    },
    founder: 'Rowena Ravenclaw',
    trait: 'Wisdom, Wit, Intellect, and Curiosity',
    motto: '"Wit beyond measure is man\'s greatest treasure."',
    headOfHouse: 'Professor Filius Flitwick',
    basePoints: 235,
  },
  Hufflepuff: {
    id: 'Hufflepuff',
    name: 'Hufflepuff',
    crest: '🦡',
    element: 'Earth',
    colors: {
      primary: '#ecb939',
      secondary: '#372e29',
      accent: 'from-amber-500 via-yellow-700 to-amber-900',
      border: 'border-amber-300',
      badge: 'bg-amber-950 text-yellow-200 border-yellow-500/40',
    },
    founder: 'Helga Hufflepuff',
    trait: 'Loyalty, Dedication, Patience, and Fair Play',
    motto: '"Those patient Hufflepuffs are true and unafraid of toil."',
    headOfHouse: 'Professor Pomona Sprout',
    basePoints: 195,
  },
  Slytherin: {
    id: 'Slytherin',
    name: 'Slytherin',
    crest: '🐍',
    element: 'Water',
    colors: {
      primary: '#1a472a',
      secondary: '#aaaaaa',
      accent: 'from-emerald-700 via-teal-900 to-slate-900',
      border: 'border-emerald-400',
      badge: 'bg-emerald-950 text-emerald-200 border-emerald-500/40',
    },
    founder: 'Salazar Slytherin',
    trait: 'Ambition, Cunning, Leadership, and Resourcefulness',
    motto: '"Slytherin will help you on the way to greatness."',
    headOfHouse: 'Professor Severus Snape',
    basePoints: 225,
  },
};

/**
 * 4 Wizard Ranks: Beginner -> Apprentice -> Wizard -> Master
 */
export const WIZARD_RANKS = [
  {
    tier: 'Beginner',
    name: 'First-Year Novice',
    title: 'Wand Apprentice',
    badge: '🌱 Year 1',
    minXp: 0,
    maxXp: 99,
    icon: '🪄',
    description: 'Mastering the basic wand movements and foundational Python syntax.',
    spellsUnlocked: 'print, variables, data types, arithmetic charms',
  },
  {
    tier: 'Apprentice',
    name: 'Third-Year Apprentice',
    title: 'Spell Adept',
    badge: '🔮 Year 3',
    minXp: 100,
    maxXp: 249,
    icon: '🔮',
    description: 'Weaving multi-line incantations with conditional logic, loops, and lists.',
    spellsUnlocked: 'if/elif/else branching, loops, functions, lists',
  },
  {
    tier: 'Wizard',
    name: 'O.W.L. Certified Wizard',
    title: 'Charms Practitioner',
    badge: '⚡ O.W.L.',
    minXp: 250,
    maxXp: 499,
    icon: '⚡',
    description: 'Passed the Ordinary Wizarding Level in data structures & modular spellcraft.',
    spellsUnlocked: 'dictionaries, OOP classes, lambda expressions, exceptions',
  },
  {
    tier: 'Master',
    name: 'N.E.W.T. Master Sorcerer',
    title: 'Grand Auror',
    badge: '👑 Master',
    minXp: 500,
    maxXp: Infinity,
    icon: '👑',
    description: 'Master of advanced Python arcana, generators, decorators, and concurrency.',
    spellsUnlocked: 'decorators, async/await, generators, metaprogramming',
  },
];

export function getWizardRank(xp = 0) {
  return (
    WIZARD_RANKS.slice()
      .reverse()
      .find((r) => xp >= r.minXp) || WIZARD_RANKS[0]
  );
}

/**
 * Python Lessons mapped as Hogwarts Spells & Charms
 */
export const PYTHON_SPELLS_MAP = {
  Variables: {
    spellName: 'Transfiguratio Memoria',
    type: 'Transfiguration Charm',
    incantation: 'x = value',
    effect: 'Binds dynamic essences to named memory vessels.',
    wandMovement: 'Swish to the left, flick forward',
  },
  'Data Types': {
    spellName: 'Essentia Rerum',
    type: 'Divination Charm',
    incantation: 'type(obj)',
    effect: 'Reveals the true nature of numbers, strings, and booleans.',
    wandMovement: 'Circle clockwise, tap parchment twice',
  },
  Strings: {
    spellName: 'Verbum Vocare',
    type: 'Charm of Voices',
    incantation: 'f"Lumino {word}"',
    effect: 'Manipulates runes, slices text, and formats magical speech.',
    wandMovement: 'Horizontal flick with swift wrist turn',
  },
  Operators: {
    spellName: 'Aritmetica Arcana',
    type: 'Arithmancy Hex',
    incantation: 'a + b * c',
    effect: 'Combines and balances numerical energies.',
    wandMovement: 'Cross motion followed by downward tap',
  },
  Conditions: {
    spellName: 'Divergium Divina',
    type: 'Branching Charm',
    incantation: 'if spell == True:',
    effect: 'Directs magical flow down alternate corridors of fate.',
    wandMovement: 'Forked flick with confident pause',
  },
  Loops: {
    spellName: 'Incantatio Repeto',
    type: 'Time-Turner Charm',
    incantation: 'for spell in grimoire:',
    effect: 'Executes an incantation repeatedly over sequences of elements.',
    wandMovement: 'Continuous circular wand motion',
  },
  Functions: {
    spellName: 'Formula Reutilis',
    type: 'Enchanted Scroll Formula',
    incantation: 'def cast_spell(target):',
    effect: 'Encapsulates complex magic into a repeatable invocation.',
    wandMovement: 'Draw a triangle in the air and punctuate with a jab',
  },
  Lists: {
    spellName: 'Accio Elementa',
    type: 'Multi-Summoning Charm',
    incantation: '[spell_1, spell_2, spell_3]',
    effect: 'Gathers mutable sequences of magical artifacts in orderly ranks.',
    wandMovement: 'Wand pull backward followed by spread gesture',
  },
  Dictionaries: {
    spellName: 'Secretum Clavis',
    type: 'Vault Key Charm',
    incantation: '{"runestone": "power"}',
    effect: 'Locks values behind unique enchanted keys for instant retrieval.',
    wandMovement: 'Turn wand like a skeleton key in midair',
  },
  'Exception Handling': {
    spellName: 'Protego Code',
    type: 'Shield Charm Against Dark Hexes',
    incantation: 'try: ... except CurseError:',
    effect: 'Erects an enchanted barrier preventing curses from terminating the program.',
    wandMovement: 'Sweeping upward defensive shield arc',
  },
  OOP: {
    spellName: 'Golem Vivus',
    type: 'Life-Breathing Transfiguration',
    incantation: 'class Wizard: def __init__(self):',
    effect: 'Creates self-contained magical beings endowed with state and behaviors.',
    wandMovement: 'Triple upward flourish with spark discharge',
  },
};

/**
 * Python Bugs framed as Dark Magic Curses & Counter-Measures
 */
export const DARK_MAGIC_CURSES = [
  {
    curseName: 'The Malformed Incantation Curse',
    pythonError: 'SyntaxError',
    dangerLevel: 'Volatile',
    icon: '🐍',
    description: 'The incantation was mispronounced—missing colons, mismatched brackets, or rogue quotes.',
    counterCurse: 'Inspect line ending for ":" and verify all brackets () [] {} close symmetrically.',
    example: 'for x in range(5)  # Missing colon curse!',
    cure: 'for x in range(5):  # Shield restored!',
  },
  {
    curseName: 'The Incompatible Essence Hex',
    pythonError: 'TypeError',
    dangerLevel: 'Hazardous',
    icon: '🧪',
    description: 'Attempting to brew together mismatched essences, like adding a string rune to an integer potion.',
    counterCurse: 'Cast str() or int() transmutation before combining essences.',
    example: '"House points: " + 25  # Incompatible essences!',
    cure: '"House points: " + str(25)  # Aligned essences!',
  },
  {
    curseName: 'The Out-of-Bounds Poltergeist',
    pythonError: 'IndexError',
    dangerLevel: 'Mischievous',
    icon: '👻',
    description: 'Reaching into a scroll repository beyond its length. Remember: Python scrolls index from 0 to N-1.',
    counterCurse: 'Cast len(scroll) to verify the bounds before reaching into the repository.',
    example: 'spells[3] when len(spells) == 3  # Peeves pushed you off the edge!',
    cure: 'spells[len(spells) - 1]  # Safe access to final scroll!',
  },
  {
    curseName: 'The Misaligned Rune Jinx',
    pythonError: 'IndentationError',
    dangerLevel: 'Tricky',
    icon: '📐',
    description: 'The ancient runes must align by exactly 4 spaces under block headers.',
    counterCurse: 'Align code blocks strictly with 4 spaces—never mix tabs and parchment spaces.',
    example: 'def charm():\nprint("Lum")  # Misaligned rune!',
    cure: 'def charm():\n    print("Lum")  # 4-space alignment charm!',
  },
  {
    curseName: 'The Unsummoned Spirit Hex',
    pythonError: 'NameError',
    dangerLevel: 'Elusive',
    icon: '🔮',
    description: 'Invoking a variable or function that has not yet materialized in the grimoire.',
    counterCurse: 'Ensure the variable is defined above the point where it is summoned.',
    example: 'cast(spell_name) before spell_name = "Lumos"',
    cure: 'spell_name = "Lumos" then cast(spell_name)',
  },
];

/**
 * Daily Owl Post Challenges (Delivered by Hedwig / Errol)
 */
export const OWL_POST_CHALLENGES = [
  {
    id: 'owl-1',
    dayName: 'Day 1 Owl Post',
    title: 'The Revelio String Riddle',
    parchmentSender: 'Headmaster Albus Pythondore',
    riddle:
      'A message is inscribed backwards in the Mirror of Erised: "muhtyp". Write a Python one-liner slice to reverse it and reveal the true word.',
    potionIngredients: ['mirror_text = "muhtyp"', 'reversed_text = mirror_text[::-1]'],
    solutionSnippet: 'mirror_text = "muhtyp"\nrevelio = mirror_text[::-1]\nprint(revelio)  # "python"',
    rewardPoints: 35,
    hintTier1: 'In Python, strings can be sliced with [start:stop:step]. Think about what a negative step does.',
    hintTier2: 'A step of -1 traverses the string from right to left: text[::-1].',
  },
  {
    id: 'owl-2',
    dayName: 'Day 2 Owl Post',
    title: 'The Marauder’s Filter Charm',
    parchmentSender: 'Professor Minerva McGonagall',
    riddle:
      'Filter a list of magical creatures [12, 5, 20, 8, 15] to keep only those with power level ≥ 10 using a list comprehension.',
    potionIngredients: ['creatures = [12, 5, 20, 8, 15]', '[c for c in creatures if c >= 10]'],
    solutionSnippet: 'creatures = [12, 5, 20, 8, 15]\nstrong = [c for c in creatures if c >= 10]\nprint(strong)',
    rewardPoints: 40,
    hintTier1: 'Use a list comprehension: [expression for item in iterable if condition].',
    hintTier2: 'Set your condition to: if c >= 10 inside the brackets.',
  },
  {
    id: 'owl-3',
    dayName: 'Day 3 Owl Post',
    title: 'The Draught of Living Death Dictionary',
    parchmentSender: 'Professor Severus Snape',
    riddle:
      'Create a potion recipe dictionary with ingredients "wormwood": 3 and "asphodel": 2. Access wormwood safely using the .get() charm.',
    potionIngredients: ['recipe = {"wormwood": 3, "asphodel": 2}', 'recipe.get("wormwood", 0)'],
    solutionSnippet: 'potion = {"wormwood": 3, "asphodel": 2}\namount = potion.get("wormwood", 0)\nprint(amount)',
    rewardPoints: 45,
    hintTier1: 'Dictionary keys are matched with .get(key, default) without raising a KeyError.',
    hintTier2: 'Call recipe.get("wormwood") to safely extract 3 sprigs of wormwood.',
  },
];

/**
 * Professor Personas for AI Tutor Guidance
 */
export const PROFESSOR_PERSONAS = {
  pythondore: {
    id: 'pythondore',
    name: 'Professor Pythondore',
    title: 'Headmaster of Hogwarts',
    avatar: '🧙‍♂️',
    quote: '"Words are, in my not-so-humble opinion, our most inexhaustible source of magic."',
    style: 'Philosophical, benevolent, encouraging, drops Socratic wisdom',
    systemHintPrompt:
      'You are Headmaster Pythondore. Guide the student with warm, grandfatherly wizarding wisdom. Give a gentle hint first before revealing answers.',
  },
  snape: {
    id: 'snape',
    name: 'Professor Severus Code',
    title: 'Potions Master & Dungeon Overseer',
    avatar: '🧪',
    quote: '"I can teach you how to bottle fame, brew glory, and even put a stopper on bugs."',
    style: 'Sharp, demanding, exact, focuses on memory efficiency and pristine syntax',
    systemHintPrompt:
      'You are Professor Snape. You demand perfection in Python code. Critique mistakes sharply but guide them to the exact counter-curse.',
  },
  mcgonagall: {
    id: 'mcgonagall',
    name: 'Professor Minerva McGonagall',
    title: 'Head of Gryffindor & Transfiguration Master',
    avatar: '📜',
    quote: '"Transfiguration is some of the most complex and dangerous magic you will learn at Hogwarts."',
    style: 'Crisp, structured, high expectations, expert on data type transformations',
    systemHintPrompt:
      'You are Professor McGonagall. You value elegant, structured Python code. Provide crisp, structured guidance.',
  },
  hermione: {
    id: 'hermione',
    name: 'Hermione Code-Granger',
    title: 'Top Prefect & Grimoire Researcher',
    avatar: '🦁',
    quote: '"When in doubt, go to the library and study standard library documentation!"',
    style: 'Brilliant, eager, quotes PEP 8, offers step-by-step logic formulas',
    systemHintPrompt:
      'You are Hermione. You love Python documentation and PEP 8 best practices. Give clear, enthusiastically detailed explanations.',
  },
};
