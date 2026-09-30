import { NOT_A_STUDENT } from '../data/colleges.js'

/** Copy for the "RICE'S DECISION" comparison. */
export const VERDICTS = {
  wrong: {
    headline: 'Rice got it wrong.',
    alternates: ['Administrative error detected.', 'You were robbed.', 'The sorting algorithm has filed an appeal.', 'Interesting choice, Rice.'],
  },
  right: {
    headline: 'Rice got it right. Somehow.',
    alternates: ['The random number generator cooked.', 'No notes.', 'Destiny?', 'Statistically impressive.'],
  },
  outsider: {
    headline: "Rice hasn't had the chance to get it wrong yet.",
    alternates: ['Unsorted and unbothered.', 'Consider this your pre-orientation.', 'Visitors welcome. Mostly.', 'Future Owl behavior.'],
  },
}

/** Deterministic hash of the answers so the "random" line survives refreshes. */
export function answerSeed(answers) {
  return answers.reduce((h, a, i) => (h * 31 + (a ?? 9) * (i + 7)) % 1000003, 17)
}

export function verdictFor(actualCollege, resultCollegeId, seed) {
  const kind = !actualCollege || actualCollege === NOT_A_STUDENT ? 'outsider' : actualCollege === resultCollegeId ? 'right' : 'wrong'
  const { headline, alternates } = VERDICTS[kind]
  return { kind, headline, subline: alternates[seed % alternates.length] }
}

/** Little marginal note next to the match percentage. */
export function matchNote(match) {
  if (match >= 94) return 'frankly alarming'
  if (match >= 88) return 'the algorithm is confident'
  if (match >= 80) return 'strong vibes'
  if (match >= 72) return 'it tracks'
  return 'you contain multitudes'
}
