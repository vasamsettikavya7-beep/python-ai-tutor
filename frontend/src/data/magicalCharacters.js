/**
 * Magical Characters & Wizarding Dialogue Scripts
 * Inspired by Harry Potter / Hogwarts School of Pythoncraft & Wizardry!
 */

export const WIZARD_CHARACTERS = {
  pythondore: {
    id: 'pythondore',
    name: 'Headmaster Pythondore',
    title: 'Order of Merlin & Grand Python Sorcerer',
    house: 'Gryffindor',
    avatar: '🧙‍♂️',
    color: 'from-amber-600 via-yellow-500 to-amber-700',
    auraColor: 'border-amber-400 shadow-amber-500/30',
    badge: 'Headmaster',
    sound: 'lumos',
    bio: 'Wise, noble, and grandfatherly guardian of Hogwarts School of Pythoncraft.',
  },

  hermione: {
    id: 'hermione',
    name: 'Hermione Code-Granger',
    title: 'Prefect & Master of Incantations',
    house: 'Gryffindor',
    avatar: '✨',
    color: 'from-rose-600 via-pink-500 to-amber-600',
    auraColor: 'border-pink-400 shadow-pink-500/30',
    badge: 'Curriculum Prefect',
    sound: 'alohomora',
    bio: 'Top student who memorized all 34 Python incantations and guides the Roadmap.',
  },

  snape: {
    id: 'snape',
    name: 'Professor Severus Code',
    title: 'Potions Master & Bug Defense Inquisitor',
    house: 'Slytherin',
    avatar: '🧪',
    color: 'from-emerald-800 via-teal-700 to-slate-900',
    auraColor: 'border-emerald-400 shadow-emerald-500/30',
    badge: 'Potions Master',
    sound: 'potion',
    bio: 'Strict master who analyzes potion brewing accuracy, flaws, and weakness defense.',
  },

  sortinghat: {
    id: 'sortinghat',
    name: 'The Sorting Hat of Python',
    title: 'Ancient Evaluator of Minds',
    house: 'Hogwarts',
    avatar: '🎩',
    color: 'from-purple-800 via-indigo-700 to-amber-800',
    auraColor: 'border-purple-400 shadow-purple-500/30',
    badge: 'Quiz Evaluator',
    sound: 'sparkle',
    bio: 'Enchanted sentient wizard hat that challenges learners with ancient quiz riddles.',
  },
};

/**
 * Generate magical welcome speech from Headmaster Pythondore
 */
export function getMagicalWelcomeDialogue(studentName = 'Young Sorcerer', xp = 0, level = 'Beginner') {
  const safeName = studentName || 'Young Sorcerer';
  return (
    `Welcome to Hogwarts School of Pythoncraft and Wizardry, ${safeName}! ` +
    `I am Headmaster Pythondore. By the stars and ancient runes, you currently possess ${xp} magical experience points ` +
    `in the ${level} tier. Remember, it is not our abilities that show what we truly are, but our choices when writing code! ` +
    `Cast your spells wisely, explore the Marauder's Roadmap below, and let us transmute logic into pure magic!`
  );
}

/**
 * Generate magical Strengths & Weaknesses critique from Professor Snape
 */
export function getMagicalSnapeDialogue(strengths = [], weaknesses = [], score = 0) {
  let dialogue = `Silence in the dungeons! I am Professor Severus Code, and I have scrutinized your magical cauldron. `;

  if (strengths.length > 0) {
    dialogue += `You display tolerable charmwork in ${strengths.join(', ')}. Your incantations there were brewed with over 70% accuracy. Ten points to your house. `;
  } else {
    dialogue += `You have not yet brewed any master-level charms above 70% precision. Mediocrity will not be tolerated in my classroom! `;
  }

  if (weaknesses.length > 0) {
    dialogue += `However, your execution in ${weaknesses.join(', ')} is dangerously unstable, like an exploding draught of peace! You must enter the practice chamber immediately before the Dark Arts of bugs corrupt your programs.`;
  } else {
    dialogue += `Surprisingly, no glaring defects contaminate your potion vials today. Maintain this discipline, or face the consequences!`;
  }

  return dialogue;
}

/**
 * Generate magical Skills Roadmap explanation from Hermione Code-Granger
 */
export function getMagicalRoadmapDialogue(masteredCount = 0, totalCount = 34, studentName = 'Apprentice') {
  return (
    `I solemnly swear that I am coding up to no good! Hello, ${studentName}! I am Hermione Code-Granger. ` +
    `Behold your Marauder's Map of Python Mastery. You have unlocked and mastered ${masteredCount} of ${totalCount} magical curriculum spells. ` +
    `Every topic you practice in the Sorting Hat Quiz lights up on this ancient parchment with your accuracy rating. ` +
    `Follow the glowing path, review your runes, and let's unlock every incantation in the library!`
  );
}

/**
 * Generate magical Next Lessons dialogue
 */
export function getMagicalNextLessonsDialogue(nextTopics = []) {
  const topTopics = nextTopics.slice(0, 3).map((t) => t.title || t.topic).join(', ');
  return (
    `Alohomora! Unlocking the next chapters in the standard book of Python spells! ` +
    `Your upcoming incantations to master are: ${topTopics}. ` +
    `Click "Learn" on any scroll to unveil the ancient runes and runnable enchantments, or click "Quiz" to test your spellcasting before the Sorting Hat!`
  );
}

/**
 * Generate magical Quiz question presentation by The Sorting Hat
 */
export function getMagicalQuizQuestionDialogue(param1, param2 = [], param3 = 1) {
  let questionText = '';
  let options = [];
  let questionIndex = 1;

  if (param1 && typeof param1 === 'object') {
    // Called with (questionObject, student)
    questionText = param1.question || '';
    if (Array.isArray(param1.options)) {
      options = param1.options.map((opt) =>
        typeof opt === 'object' ? `${opt.key}: ${opt.text}` : String(opt)
      );
    }
    questionIndex = param1.id || 1;
  } else {
    // Called with (questionText, options, questionIndex)
    questionText = param1 || '';
    if (Array.isArray(param2)) {
      options = param2.map((opt) =>
        typeof opt === 'object' ? `${opt.key || ''}: ${opt.text || ''}` : String(opt)
      );
    }
    questionIndex = param3 || 1;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const formattedOptions = options.length > 0
    ? options
        .map((opt, i) => (opt.includes(':') ? opt : `Option ${letters[i] || i + 1}: ${opt}`))
        .join('. ')
    : '';

  return (
    `Hmm, riddle number ${questionIndex} for your magical mind! ` +
    `${questionText}. ` +
    (formattedOptions ? `Consider your choices carefully: ${formattedOptions}. ` : '') +
    `Wave your wand and select the true incantation!`
  );
}
