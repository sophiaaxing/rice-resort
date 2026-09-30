/**
 * Shared JSDoc types for Rice Resort. This project is plain JavaScript, so these
 * typedefs exist purely for editor autocomplete and to document the data shapes.
 */

/**
 * @typedef {'community' | 'collegeLoyalty' | 'social' | 'party' | 'traditionLore'
 *   | 'campusInvolvement' | 'chaosWeirdness' | 'academic' | 'adventurous'
 *   | 'independence' | 'wholesome' | 'degeneracy' | 'socialPerception' | 'cliquey'} TraitKey
 */

/** @typedef {Partial<Record<TraitKey, number>>} TraitEffects */
/** @typedef {Record<TraitKey, number>} TraitVector values normalized 0–100 */

/**
 * @typedef {Object} Answer
 * @property {string} text
 * @property {TraitEffects} traitEffects
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} prompt
 * @property {Answer[]} answers
 */

/**
 * @typedef {Object} CollegeTheme
 * @property {string} accent     main college color
 * @property {string} secondary  supporting color from the crest
 * @property {string} onAccent   readable text color on top of `accent`
 * @property {string} ink        accent-flavored color that is readable on cream
 */

/**
 * @typedef {Object} College
 * @property {string} id
 * @property {string} name        display name, e.g. "Sid Richardson"
 * @property {string} shortName   sticker/label name, e.g. "Sid Rich"
 * @property {string} crest       path to crest image in /public
 * @property {string} archetype
 * @property {string} tagline
 * @property {string} description
 * @property {string} blurb       one-liner for runner-up tooltips
 * @property {{ habitat: string, greenFlag: string, redFlag: string }} fieldNotes
 * @property {CollegeTheme} theme
 * @property {TraitVector} target
 * @property {Partial<Record<TraitKey, number>>} [weights] manual weight overrides
 */

/**
 * @typedef {Object} CollegeScore
 * @property {string} id
 * @property {number} distance  weighted distance (lower = closer)
 * @property {number} match     display percentage
 */

/**
 * @typedef {Object} QuizResult
 * @property {TraitVector} vector
 * @property {CollegeScore[]} rankings  all 12 colleges, best first
 * @property {CollegeScore} top
 */

export {}
