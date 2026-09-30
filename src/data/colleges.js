/**
 * The 12 residential colleges: copy, theme colors, and target personality vectors.
 *
 * These are affectionate, vibe-based stereotypes — not factual assessments of
 * anyone who actually lives there.
 *
 * Tuning guide for `target` (0–100, same scale as the user's normalized vector):
 *   ~92 very high · ~76 high · ~56 moderate · ~50 unremarkable · ~34 lower · ~22 low
 * Traits far from 50 automatically weigh more in matching (see utils/scoring.js).
 * `weights` optionally overrides/boosts specific traits for one college.
 *
 * @type {import('../types/quiz.js').College[]}
 */
// Vite's base path (e.g. "/rice-resort/" on GitHub Pages). Falls back to "/" in Node scripts.
const BASE = import.meta.env?.BASE_URL ?? '/'

export const COLLEGES = [
  {
    id: 'baker',
    name: 'Baker',
    shortName: 'Baker',
    crest: `${BASE}crests/baker.webp`,
    archetype: 'The Social Butterfly',
    tagline: "You need to know who's going first.",
    description:
      "You don't just have friends, you have a social map, and you're constantly updating it. You know who's going, who's not, who's fighting, and who's pregaming where — honestly, it's a skill. You love a party, but you love knowing about the party even more.",
    blurb: 'Social, plugged-in, and very aware of who is going where.',
    fieldNotes: {
      habitat: 'Wherever everyone is going',
      greenFlag: 'Knows everyone. Like, everyone.',
      redFlag: 'Checks the guest list before RSVPing',
    },
    theme: { accent: '#9E2F3C', secondary: '#4D535B', onAccent: '#FBF6EC', ink: '#8A2533' },
    target: {
      community: 55, collegeLoyalty: 34, social: 94, party: 76, traditionLore: 45,
      campusInvolvement: 50, chaosWeirdness: 42, academic: 50, adventurous: 52,
      independence: 40, wholesome: 56, degeneracy: 52, socialPerception: 95, cliquey: 92,
    },
  },
  {
    id: 'brown',
    name: 'Brown',
    shortName: 'Brown',
    crest: `${BASE}crests/brown.webp`,
    archetype: 'The Social Exile',
    tagline: 'Far from campus. Close to the function.',
    description:
      "You're not far from campus — campus is far from you. You're wildly social, deeply down, and you've made the long walk back at hours that would concern a parent. College loyalty? Sure, in theory. But the function is calling, and you always pick up.",
    blurb: 'Geographically remote, socially unavoidable.',
    fieldNotes: {
      habitat: 'The long walk back from the function',
      greenFlag: 'Always knows where the function is',
      redFlag: 'Treats "north campus" as a lifestyle',
    },
    theme: { accent: '#7C1F3A', secondary: '#E2A128', onAccent: '#FBF6EC', ink: '#7C1F3A' },
    target: {
      community: 56, collegeLoyalty: 30, social: 92, party: 92, traditionLore: 38,
      campusInvolvement: 32, chaosWeirdness: 76, academic: 44, adventurous: 80,
      independence: 62, wholesome: 44, degeneracy: 72, socialPerception: 58, cliquey: 48,
    },
  },
  {
    id: 'chao',
    name: 'Chao',
    shortName: 'Chao',
    crest: `${BASE}crests/chao.webp`,
    archetype: 'The Wildcard',
    tagline: "The sorting algorithm couldn't classify you either.",
    description:
      "You refused to fit neatly into any of the eleven established archetypes, which is either a sign of deep individuality or a bug in our code. You're independent, up for anything, and unbothered by tradition — mostly because you'd rather make your own. Chao is still writing its lore. Congratulations: you're a primary source.",
    blurb: 'The newest college. Unclassifiable, and proud of it.',
    fieldNotes: {
      habitat: 'To be determined',
      greenFlag: 'Unbound by tradition',
      redFlag: 'The algorithm has follow-up questions',
    },
    theme: { accent: '#5C58B8', secondary: '#23264F', onAccent: '#FBF6EC', ink: '#4E4AA8' },
    target: {
      community: 44, collegeLoyalty: 22, social: 40, party: 40, traditionLore: 18,
      campusInvolvement: 44, chaosWeirdness: 78, academic: 55, adventurous: 90,
      independence: 92, wholesome: 50, degeneracy: 50, socialPerception: 28, cliquey: 38,
    },
    weights: { traditionLore: 1.6, collegeLoyalty: 1.4, chaosWeirdness: 1.2 },
  },
  {
    id: 'duncan',
    name: 'Duncan',
    shortName: 'Duncan',
    crest: `${BASE}crests/duncan.webp`,
    archetype: 'The Fratty Freak',
    tagline: 'You make questionable decisions confidently.',
    description:
      "You don't make decisions so much as commit to them at full speed. You're the life of the party, the cause of the party, and occasionally the reason the party ended. Weirdly, you also care deeply about tradition — you just prefer the traditions that involve yelling.",
    blurb: 'Fratty, strange, and the reason the night became a story.',
    fieldNotes: {
      habitat: 'The center of whatever that was',
      greenFlag: 'Turns any Tuesday into a story',
      redFlag: 'The story is usually about them',
    },
    theme: { accent: '#5F6A15', secondary: '#C99A22', onAccent: '#FBF6EC', ink: '#5C6614' },
    target: {
      community: 58, collegeLoyalty: 76, social: 78, party: 92, traditionLore: 74,
      campusInvolvement: 56, chaosWeirdness: 92, academic: 40, adventurous: 92,
      independence: 40, wholesome: 38, degeneracy: 72, socialPerception: 55, cliquey: 48,
    },
  },
  {
    id: 'hanszen',
    name: 'Hanszen',
    shortName: 'Hanszen',
    crest: `${BASE}crests/hanszen.webp`,
    archetype: 'The Community College',
    tagline: 'You came for the people. You stayed at UpCo for four hours.',
    description:
      "You're social without needing to be the center of attention, weirdly willing to participate in things, and dangerously susceptible to residential college spirit. You don't need a cult. You just need everyone you know sitting in the same place for an unreasonable amount of time.",
    blurb: 'Chill, spirited, and physically incapable of leaving UpCo.',
    fieldNotes: {
      habitat: 'UpCo, indefinitely',
      greenFlag: 'Actually shows up',
      redFlag: 'Has been "about to leave" since 2 PM',
    },
    theme: { accent: '#0A6BAA', secondary: '#161616', onAccent: '#FBF6EC', ink: '#0A6AA6' },
    target: {
      community: 94, collegeLoyalty: 90, social: 72, party: 56, traditionLore: 72,
      campusInvolvement: 90, chaosWeirdness: 44, academic: 55, adventurous: 55,
      independence: 26, wholesome: 76, degeneracy: 32, socialPerception: 48, cliquey: 26,
    },
  },
  {
    id: 'jones',
    name: 'Jones',
    shortName: 'Jones',
    crest: `${BASE}crests/jones.webp`,
    archetype: 'The Academic Adventurer',
    tagline: "Dean's List at 4. Party at 10.",
    description:
      "You contain multitudes, and your floor has seen all of them. You'll grind a problem set at 4 and be somewhere unhinged by 10, and you'll do both with the same unreasonable enthusiasm. Wholesome or degenerate? Depends entirely on which floor you ask.",
    blurb: 'Studies hard, goes hard, and would die for their floor.',
    fieldNotes: {
      habitat: 'Your floor. Specifically your floor.',
      greenFlag: 'Grinds the pset, then books the trip',
      redFlag: 'Floor group chat: 400 unread',
    },
    theme: { accent: '#0D7A48', secondary: '#1BA2D4', onAccent: '#FBF6EC', ink: '#0E7A48' },
    target: {
      community: 70, collegeLoyalty: 56, social: 78, party: 74, traditionLore: 48,
      campusInvolvement: 76, chaosWeirdness: 56, academic: 86, adventurous: 90,
      independence: 36, wholesome: 52, degeneracy: 54, socialPerception: 40, cliquey: 40,
    },
    weights: { academic: 1.6, adventurous: 1.5 },
  },
  {
    id: 'lovett',
    name: 'Lovett',
    shortName: 'Lovett',
    crest: `${BASE}crests/lovett.webp`,
    archetype: 'The Lovable Underdog',
    tagline: 'Character builds character.',
    description:
      "You're one of the nicest people on campus and you didn't even have to try. You'll join the thing, show up for the thing, and help clean up after the thing, all without making any of it your whole personality. The building has character. So do you.",
    blurb: 'Some of the sweetest people on campus, housed in a toaster.',
    fieldNotes: {
      habitat: 'The toaster (affectionate)',
      greenFlag: 'Nicest person you met this week',
      redFlag: 'Will defend the architecture. At length.',
    },
    theme: { accent: '#E6C31C', secondary: '#102B5C', onAccent: '#102B5C', ink: '#102B5C' },
    target: {
      community: 76, collegeLoyalty: 32, social: 56, party: 44, traditionLore: 44,
      campusInvolvement: 80, chaosWeirdness: 58, academic: 50, adventurous: 56,
      independence: 48, wholesome: 95, degeneracy: 26, socialPerception: 28, cliquey: 30,
    },
    weights: { wholesome: 1.2, campusInvolvement: 1.4, socialPerception: 1.3 },
  },
  {
    id: 'martel',
    name: 'Martel',
    shortName: 'Martel',
    crest: `${BASE}crests/martel.webp`,
    archetype: 'The Degenerate Scholar',
    tagline: 'Academically gifted. Morally flexible.',
    description:
      'You can write a flawless paper and make a truly unhinged decision within the same six-hour window. Your friend group is tight, your college spirit is weirdly strong, and your academic record somehow remains intact. Nobody knows how. Including you.',
    blurb: 'Parties like it is a major. Also has an actual major.',
    fieldNotes: {
      habitat: 'A pregame, holding a textbook',
      greenFlag: 'Aced the exam anyway',
      redFlag: 'Studied for it at the party',
    },
    theme: { accent: '#1E3F8F', secondary: '#D23446', onAccent: '#FBF6EC', ink: '#1E3F8F' },
    target: {
      community: 58, collegeLoyalty: 74, social: 88, party: 94, traditionLore: 50,
      campusInvolvement: 56, chaosWeirdness: 58, academic: 74, adventurous: 46,
      independence: 38, wholesome: 32, degeneracy: 95, socialPerception: 60, cliquey: 76,
    },
  },
  {
    id: 'mcmurtry',
    name: 'McMurtry',
    shortName: 'McMurtry',
    crest: `${BASE}crests/mcmurtry.webp`,
    archetype: 'The Wholesome One',
    tagline: 'Perhaps suspiciously well-adjusted.',
    description:
      "You have a sleep schedule, a friend group that texts back, and a GPA you're allowed to discuss at dinner. You like your college without needing it to be a cult, and you party at a volume that won't get anyone written up. Honestly, it's a little concerning how okay you are.",
    blurb: 'Friendly, functional, and in bed at a reasonable hour.',
    fieldNotes: {
      habitat: 'In bed by a reasonable hour',
      greenFlag: 'Owns a functioning sleep schedule',
      redFlag: 'Suspiciously normal',
    },
    theme: { accent: '#5A2A88', secondary: '#9DA0AA', onAccent: '#FBF6EC', ink: '#5A2A88' },
    target: {
      community: 74, collegeLoyalty: 26, social: 56, party: 18, traditionLore: 36,
      campusInvolvement: 48, chaosWeirdness: 18, academic: 82, adventurous: 38,
      independence: 60, wholesome: 94, degeneracy: 16, socialPerception: 44, cliquey: 40,
    },
    weights: { academic: 1.4, party: 1.2 },
  },
  {
    id: 'sidrich',
    name: 'Sid Richardson',
    shortName: 'Sid Rich',
    crest: `${BASE}crests/sidrich.webp`,
    archetype: 'The Independent Cool Kid',
    tagline: "You don't need community. You have aura.",
    description:
      "You have a social life; it just isn't a residential college's business. You go out, you go everywhere, you come back to a great room with a great view, and somehow your aura survives it all. Community is optional when you're this booked.",
    blurb: 'Great rooms, great food, and a social life that lives elsewhere.',
    fieldNotes: {
      habitat: 'A high floor, above it all (literally)',
      greenFlag: 'Aura. Unexplainable aura.',
      redFlag: 'Friends with everyone, loyal to no one',
    },
    theme: { accent: '#C9331D', secondary: '#161616', onAccent: '#FBF6EC', ink: '#B02A16' },
    target: {
      community: 30, collegeLoyalty: 28, social: 82, party: 80, traditionLore: 28,
      campusInvolvement: 44, chaosWeirdness: 44, academic: 48, adventurous: 72,
      independence: 95, wholesome: 42, degeneracy: 58, socialPerception: 64, cliquey: 50,
    },
    weights: { social: 1.4, party: 1.3, socialPerception: 1.4, independence: 1.2 },
  },
  {
    id: 'wiess',
    name: 'Wiess',
    shortName: 'Wiess',
    crest: `${BASE}crests/wiess.webp`,
    archetype: 'The Cult',
    tagline: 'The cult allegations are true.',
    description:
      "You don't join things; you get initiated into them. You know lore nobody asked about, you have a chant for occasions that don't need chants, and your friends from other colleges are starting to get worried. They're right to be. It's fine. It's great, actually.",
    blurb: 'Lore-heavy, loyal to the bone, affectionately culty.',
    fieldNotes: {
      habitat: 'Somewhere deep inside the lore',
      greenFlag: 'Would die for you (and the college)',
      redFlag: 'Explains traditions to outsiders for 40 minutes',
    },
    theme: { accent: '#171717', secondary: '#E3A020', onAccent: '#F7EEDB', ink: '#171717' },
    target: {
      community: 76, collegeLoyalty: 95, social: 64, party: 86, traditionLore: 96,
      campusInvolvement: 76, chaosWeirdness: 90, academic: 50, adventurous: 58,
      independence: 26, wholesome: 44, degeneracy: 64, socialPerception: 42, cliquey: 76,
    },
  },
  {
    id: 'willrice',
    name: 'Will Rice',
    shortName: 'Will Rice',
    crest: `${BASE}crests/willrice.webp`,
    archetype: 'The Classic',
    tagline: 'Somehow just having a nice time.',
    description:
      "You're the rare person who is somehow fine. You like people, you like your college, you like a good ping pong rally in the commons, and you had a great O-Week and never really stopped. Balanced, central, and deeply, almost suspiciously pleasant.",
    blurb: 'The classic Rice experience, centrally located.',
    fieldNotes: {
      habitat: 'The commons ping pong table',
      greenFlag: 'Genuinely having fun',
      redFlag: 'Emotionally committed by day 3 of O-Week',
    },
    theme: { accent: '#BB4712', secondary: '#F2C21B', onAccent: '#FBF6EC', ink: '#A53F0F' },
    target: {
      community: 82, collegeLoyalty: 64, social: 80, party: 56, traditionLore: 56,
      campusInvolvement: 58, chaosWeirdness: 28, academic: 55, adventurous: 52,
      independence: 34, wholesome: 72, degeneracy: 30, socialPerception: 58, cliquey: 28,
    },
    weights: { chaosWeirdness: 1.3, cliquey: 1.3 },
  },
]

export const COLLEGE_BY_ID = Object.fromEntries(COLLEGES.map((c) => [c.id, c]))

/** Options for "What's your actual residential college?" */
export const NOT_A_STUDENT = 'none'
