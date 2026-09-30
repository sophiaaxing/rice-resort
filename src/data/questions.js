/**
 * The V1 question set. Answers never map directly to colleges — each one only
 * nudges hidden trait dimensions (see traitDefinitions.js). Effects are small
 * integers, roughly -3..+3. Normalization happens in utils/scoring.js, so you can
 * add, remove, or reweight answers freely without breaking the scale.
 *
 * @type {import('../types/quiz.js').Question[]}
 */

const a = (text, traitEffects) => ({ text, traitEffects })

export const QUESTIONS = [
  {
    id: 'thursday',
    prompt: "It's 11:47 PM on a Thursday. Where are you?",
    answers: [
      a('Fondren, unfortunately.', { academic: 3, independence: 1, party: -1 }),
      a('At my college “studying.”', { community: 2, collegeLoyalty: 1, social: 1 }),
      a('Pregaming.', { party: 3, degeneracy: 1, social: 1, academic: -1 }),
      a("At a friend's college.", { social: 2, independence: 2, collegeLoyalty: -1, adventurous: 1 }),
      a('In bed where I belong.', { wholesome: 2, party: -2, social: -1, independence: 1 }),
      a('Somewhere I absolutely did not plan on being.', { adventurous: 2, chaosWeirdness: 2, party: 1, degeneracy: 1 }),
    ],
  },
  {
    id: 'quad',
    prompt: "You're walking through the academic quad and see someone you vaguely know.",
    answers: [
      a('Stop and have a full conversation.', { social: 2, community: 2, wholesome: 1 }),
      a('“OMG hiiii” and keep walking.', { socialPerception: 3, social: 1, cliquey: 1 }),
      a('Smile and wave.', { wholesome: 1, community: 1, independence: 1 }),
      a("Pretend I didn't see them.", { independence: 2, social: -2, community: -1 }),
      a("They're probably coming with me now.", { adventurous: 2, social: 2, chaosWeirdness: 1 }),
    ],
  },
  {
    id: 'oweek',
    prompt: 'O-Week, looking back:',
    answers: [
      a('Still best friends with my O-Week group.', { community: 2, wholesome: 2, collegeLoyalty: 1 }),
      a('Became an advisor so I could do it all again.', { campusInvolvement: 3, collegeLoyalty: 1, traditionLore: 1 }),
      a('Found my five people and never looked back.', { cliquey: 3 }),
      a("Spent half of it at other colleges' events.", { independence: 2, social: 1, collegeLoyalty: -1 }),
      a('Went to exactly the mandatory parts.', { independence: 2, campusInvolvement: -2 }),
      a('Somehow became a minor O-Week legend.', { chaosWeirdness: 2, social: 1, adventurous: 1 }),
    ],
  },
  {
    id: 'rivalry',
    prompt: 'Someone says their college is better than yours.',
    answers: [
      a('Immediately start defending mine.', { collegeLoyalty: 3, community: 1 }),
      a('Bring up objective evidence.', { academic: 2, collegeLoyalty: 1 }),
      a('Insult their college back.', { collegeLoyalty: 2, chaosWeirdness: 1, degeneracy: 1, wholesome: -1 }),
      a('Agree with them.', { wholesome: 1, collegeLoyalty: -2, independence: 1 }),
      a('I truly could not care less.', { independence: 3, collegeLoyalty: -3 }),
      a('This has now become a 30-minute argument.', { chaosWeirdness: 2, collegeLoyalty: 2, traditionLore: 1, social: 1 }),
    ],
  },
  {
    id: 'beerbike',
    prompt: 'Beer Bike morning. What state are you in?',
    answers: [
      a('Awake at an ungodly hour and FULL of spirit.', { collegeLoyalty: 3, community: 2, traditionLore: 1 }),
      a('Already drinking.', { party: 3, degeneracy: 2, traditionLore: 1, collegeLoyalty: 1 }),
      a('Taking pictures of everyone.', { socialPerception: 3, social: 1 }),
      a('Somehow responsible for something important.', { campusInvolvement: 3, collegeLoyalty: 1, wholesome: 1 }),
      a('I showed up eventually.', { independence: 2, collegeLoyalty: -1 }),
      a('What time does the actual race start?', { independence: 2, collegeLoyalty: -2, traditionLore: -2 }),
    ],
  },
  {
    id: 'exam',
    prompt: 'You have an exam tomorrow. Someone texts “come out.”',
    answers: [
      a('Absolutely not.', { academic: 3, party: -2, wholesome: 1 }),
      a('“For one hour.”', { party: 1, academic: 1, social: 1, degeneracy: 1 }),
      a("I'm already getting ready.", { party: 3, degeneracy: 2, academic: -2, adventurous: 1 }),
      a("Bring my laptop and pretend I'll study there.", { academic: 1, social: 1, chaosWeirdness: 1, community: 1 }),
      a("Depends who's going.", { socialPerception: 3, cliquey: 2 }),
      a("Exam tomorrow? I'll deal with that tomorrow.", { degeneracy: 3, party: 2, adventurous: 1, academic: -1 }),
    ],
  },
  {
    id: 'stupididea',
    prompt: 'Someone proposes a genuinely stupid idea at 1 AM.',
    answers: [
      a('Absolutely not.', { wholesome: 1, adventurous: -2, chaosWeirdness: -2 }),
      a('Wait… explain.', { adventurous: 1, academic: 1, chaosWeirdness: 1 }),
      a("I'm already putting my shoes on.", { adventurous: 3, chaosWeirdness: 1 }),
      a('It was my idea.', { chaosWeirdness: 3, adventurous: 2, degeneracy: 1 }),
      a('Only if my friends are doing it.', { cliquey: 3, socialPerception: 1 }),
      a('Somehow the entire college is now involved.', { community: 2, collegeLoyalty: 2, chaosWeirdness: 2, traditionLore: 1 }),
    ],
  },
  {
    id: 'saturday',
    prompt: 'Pick your ideal Saturday night.',
    answers: [
      a('Huge party.', { party: 3, social: 2, degeneracy: 1 }),
      a('College public.', { community: 2, party: 2, collegeLoyalty: 2, traditionLore: 1 }),
      a('Small room/apartment party.', { cliquey: 3, party: 1 }),
      a('Going into Houston.', { adventurous: 3, independence: 2 }),
      a('Dinner and drinks with friends.', { social: 1, socialPerception: 1, cliquey: 1, wholesome: 1 }),
      a('Movie/game night.', { wholesome: 2, community: 1, party: -1 }),
      a('Rotting peacefully in bed.', { independence: 2, party: -2, social: -2, wholesome: 1 }),
    ],
  },
  {
    id: 'extracurriculars',
    prompt: 'How many extracurriculars is too many extracurriculars?',
    answers: [
      a('One.', { independence: 1, campusInvolvement: -2, academic: 1 }),
      a('Three.', { campusInvolvement: 1, wholesome: 1 }),
      a('Five.', { campusInvolvement: 2, academic: 1 }),
      a('There is no limit.', { campusInvolvement: 3, chaosWeirdness: 1, academic: 1 }),
      a('I joined 11 freshman year and learned my lesson.', { campusInvolvement: 1, chaosWeirdness: 2, adventurous: 1 }),
    ],
  },
  {
    id: 'servery',
    prompt: 'Servery lunch. Where are you sitting?',
    answers: [
      a("The big table. Everyone's welcome.", { community: 3, wholesome: 1, cliquey: -1 }),
      a('Same table, same people, every single day.', { cliquey: 3 }),
      a('Alone with headphones, thriving.', { independence: 3, social: -1 }),
      a("Another college's servery. Better food.", { independence: 2, adventurous: 1, collegeLoyalty: -2 }),
      a('Table-hopping until my food gets cold.', { social: 3, socialPerception: 1 }),
      a('Eating over a problem set.', { academic: 3 }),
      a('I slept through lunch.', { degeneracy: 2, party: 1, chaosWeirdness: 1 }),
    ],
  },
  {
    id: 'reluctant',
    prompt: "Your friend group wants to go somewhere, but you don't really want to. You…",
    answers: [
      a('Go anyway because everyone else is going.', { socialPerception: 3, cliquey: 1 }),
      a('Meet them later if I feel like it.', { independence: 2, social: 1 }),
      a('Convince everyone to do something else.', { campusInvolvement: 2, social: 1, adventurous: 1 }),
      a("Stay home. I love them, but I'm not going.", { independence: 2, wholesome: 1, social: -1 }),
      a('I was the one who made the plans.', { campusInvolvement: 2, social: 2, community: 1 }),
    ],
  },
  {
    id: 'reputation',
    prompt: 'Your ideal reputation is:',
    answers: [
      a('“Everyone likes them.”', { socialPerception: 3, social: 1, wholesome: 1 }),
      a('“They\'re literally always down.”', { adventurous: 2, party: 2, degeneracy: 1 }),
      a('“They\'re so sweet.”', { wholesome: 3 }),
      a('“How do they do so much?”', { campusInvolvement: 3, academic: 2 }),
      a('“They\'re kind of weird but I love them.”', { chaosWeirdness: 3, traditionLore: 1 }),
      a('“They\'re cool as fuck.”', { socialPerception: 2, independence: 2, social: 1 }),
      a('“I genuinely cannot figure them out.”', { independence: 3, chaosWeirdness: 1, social: -1 }),
    ],
  },
  {
    id: 'toxictrait',
    prompt: 'Pick your biggest Rice toxic trait.',
    answers: [
      a('I care too much what people think.', { socialPerception: 3 }),
      a('I enable terrible ideas.', { chaosWeirdness: 2, degeneracy: 2, party: 1 }),
      a('I overcommit.', { campusInvolvement: 3 }),
      a('I think sleep is optional.', { academic: 2, party: 1, chaosWeirdness: 1, degeneracy: 1 }),
      a('My friend group is basically an echo chamber.', { cliquey: 3 }),
      a('I disappear for three days and come back like nothing happened.', { independence: 3, adventurous: 1, chaosWeirdness: 1 }),
      a('I get emotionally attached to institutions.', { collegeLoyalty: 3, traditionLore: 2, community: 1 }),
    ],
  },
  {
    id: 'traditions',
    prompt: 'How do you feel about college traditions?',
    answers: [
      a('I know ALL of ours.', { traditionLore: 3, collegeLoyalty: 2 }),
      a('Genuinely one of my favorite things about Rice.', { traditionLore: 2, community: 2, wholesome: 1 }),
      a('Fun when everyone gets into them.', { community: 1, social: 1, traditionLore: 1 }),
      a('I know like two.', { traditionLore: -2, independence: 1, collegeLoyalty: -1 }),
      a('Half of these were definitely invented by drunk people 40 years ago.', { chaosWeirdness: 1, independence: 2, traditionLore: -1, degeneracy: 1 }),
      a('Cult behavior ❤️.', { traditionLore: 3, chaosWeirdness: 2, collegeLoyalty: 1 }),
    ],
  },
  {
    id: 'heist',
    prompt: 'Someone steals something from your college.',
    answers: [
      a("We're getting it back tonight.", { collegeLoyalty: 3, adventurous: 2 }),
      a('This means war.', { collegeLoyalty: 3, chaosWeirdness: 2 }),
      a("That's actually kind of funny.", { independence: 1, chaosWeirdness: 1, collegeLoyalty: -1 }),
      a('Wait, what did they steal?', { independence: 2, collegeLoyalty: -2 }),
      a("I'm staying out of this.", { independence: 2, wholesome: 1, collegeLoyalty: -1 }),
      a("I'm the person who stole it.", { chaosWeirdness: 3, adventurous: 2, degeneracy: 1 }),
    ],
  },
  {
    id: 'public',
    prompt: "At a college public, you're most likely to be:",
    answers: [
      a('In the middle of everything.', { party: 3, social: 2 }),
      a('Dancing with my friends.', { cliquey: 2, party: 2 }),
      a('Wandering around talking to everyone.', { social: 3, socialPerception: 1, community: 1 }),
      a('Taking care of someone.', { wholesome: 3, community: 1 }),
      a('Leaving after 45 minutes.', { independence: 2, party: -1 }),
      a('Not there.', { independence: 2, party: -3, social: -1 }),
    ],
  },
  {
    id: 'feel',
    prompt: 'Your residential college should ideally feel like…',
    answers: [
      a('Summer camp.', { community: 3, wholesome: 2, campusInvolvement: 1 }),
      a('A frat.', { party: 3, collegeLoyalty: 1, degeneracy: 1, social: 1 }),
      a('A cult.', { traditionLore: 3, collegeLoyalty: 2, chaosWeirdness: 1 }),
      a('A hotel.', { independence: 2, socialPerception: 1, collegeLoyalty: -1 }),
      a('A dysfunctional family.', { community: 2, chaosWeirdness: 2, collegeLoyalty: 1 }),
      a('An apartment complex.', { independence: 2, community: -2 }),
      a('A group chat that became a building.', { cliquey: 2, social: 1, socialPerception: 1 }),
      a('A place I happen to sleep.', { independence: 3, collegeLoyalty: -2, community: -2 }),
    ],
  },
  {
    id: 'budget',
    prompt: "You have been given control of $10,000 of your college's budget.",
    answers: [
      a('Throw an insane party.', { party: 3, degeneracy: 1, social: 1 }),
      a('Improve the commons.', { community: 3, wholesome: 1 }),
      a('Beer Bike.', { collegeLoyalty: 3, traditionLore: 1 }),
      a('Buy something completely unnecessary that becomes a tradition.', { traditionLore: 3, chaosWeirdness: 2 }),
      a('Better food.', { wholesome: 2 }),
      a('Give everyone $10.', { wholesome: 1, community: 1, chaosWeirdness: 1 }),
      a('Somehow lose the money.', { chaosWeirdness: 3, degeneracy: 2 }),
    ],
  },
  {
    id: 'room',
    prompt: 'Your side of the room is best described as…',
    answers: [
      a("Spotless. There's a plant. It's alive.", { wholesome: 3 }),
      a('A study cave with a whiteboard.', { academic: 3, independence: 1 }),
      a('Where the pregame happens.', { party: 2, degeneracy: 2, social: 1 }),
      a('Covered in college merch.', { collegeLoyalty: 2, traditionLore: 1, community: 1 }),
      a("Full of objects I can't explain.", { chaosWeirdness: 3, adventurous: 1 }),
      a('Buried under flyers for things I run.', { campusInvolvement: 3 }),
      a("Honestly, I'm never there.", { independence: 2, adventurous: 2 }),
    ],
  },
  {
    id: 'pset',
    prompt: "It's 2 AM. Your problem set is due at 9.",
    answers: [
      a('Finished it days ago.', { academic: 3, wholesome: 1 }),
      a('Grinding in the commons with half my college.', { community: 2, academic: 1, collegeLoyalty: 1 }),
      a('“Collaborating” (as allowed by the syllabus).', { cliquey: 2, academic: 1, social: 1 }),
      a("Haven't started. Just got back from somewhere.", { degeneracy: 3, party: 1, adventurous: 1 }),
      a("Asleep. That's a 7 AM problem.", { degeneracy: 1, wholesome: 1, independence: 1 }),
      a('Still at a club meeting, somehow.', { campusInvolvement: 3, chaosWeirdness: 1 }),
    ],
  },
]

/** Marginal notes that appear on specific question screens (1-indexed). */
export const PROGRESS_MESSAGES = {
  4: "we're learning concerning things about you",
  8: 'your residential college is becoming increasingly obvious',
  12: 'Rice may have made a mistake',
  16: 'this is getting embarrassing',
  19: 'one questionable decision left',
}

/** Lines cycled on the fake "sorting" screen. */
export const SORTING_LINES = [
  'measuring college loyalty...',
  'assessing degeneracy...',
  'checking Beer Bike compatibility...',
  'calculating likelihood of going out on a Thursday...',
  'reviewing questionable decisions...',
  'determining whether Rice made a mistake...',
]
