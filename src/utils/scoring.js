import { COLLEGES } from '../data/colleges.js'
import { QUESTIONS } from '../data/questions.js'
import { TRAIT_KEYS } from '../data/traitDefinitions.js'

/**
 * Scoring pipeline
 * ----------------
 * 1. Sum every chosen answer's `traitEffects` into a raw vector.
 * 2. Normalize each trait to 0–100 as a z-score against what a uniformly random
 *    respondent would get (50 = perfectly average, ±1 SD = ±`zScale` points).
 *    This auto-calibrates when questions or effects change.
 * 3. Weighted Euclidean distance to each college's target vector. Traits the
 *    college is extreme on (far from 50) weigh more; per-college overrides apply.
 * 4. Chao gets a bonus when the user is independent AND doesn't fit an
 *    established archetype or has unusually mixed answers.
 * 5. Near-ties are broken on each college's most defining traits.
 * 6. Distances are mapped to a friendly "% match" display range.
 *
 * Everything tunable lives in SCORING_CONFIG. Run `npm run simulate` after edits.
 */
export const SCORING_CONFIG = {
  /** 0–100 points per standard deviation of a random respondent. */
  zScale: 16,
  clamp: [2, 98],
  /** Weight = base + extremity * (|target - 50| / 50) ^ extremityPower, times overrides. */
  baseWeight: 0.6,
  extremityWeight: 2.2,
  extremityPower: 1.3,
  chao: {
    /** Independence (0–100) at which the bonus begins and where it maxes out. */
    independenceFrom: 52,
    independenceTo: 82,
    /** Best non-Chao distance considered "fits nothing well". */
    unfitFrom: 17,
    unfitTo: 27,
    /** Average |trait - 50| below which answers count as "mixed". */
    mixedFrom: 22,
    mixedTo: 12,
    maxBonus: 3.2,
  },
  /**
   * Fairness calibration. Some colleges (e.g. the "balanced" Will Rice) sit
   * close to almost everyone, while extreme ones (Wiess, Jones) are far from
   * most people. Each college's distance is compared against how far it
   * typically is from a reference population of mixed respondents, so no
   * college wins just by being central. 0 = off, 1 = full.
   */
  fairness: { strength: 0.85, sampleSize: 1500 },
  /**
   * Small per-college distance offsets (+ = harder to get). Calibrated with
   * `npm run simulate` so no college hogs "average" respondents.
   */
  collegeBias: {},
  /** Distances closer than this get re-ranked by defining traits. */
  tieEpsilon: 0.75,
  definingTraitCount: 4,
  /** Distance → display match %. Calibrated from simulated respondents. */
  display: { bestDistance: 9, worstDistance: 30, high: 98, low: 68, floor: 31 },
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const ramp = (v, from, to) => clamp((v - from) / (to - from), 0, 1)

/** Expected mean and SD of each trait for a uniformly random respondent. */
export function buildCalibration(questions = QUESTIONS) {
  const mean = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0]))
  const variance = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0]))
  for (const q of questions) {
    const n = q.answers.length
    for (const k of TRAIT_KEYS) {
      const values = q.answers.map((ans) => ans.traitEffects[k] ?? 0)
      const m = values.reduce((s, v) => s + v, 0) / n
      mean[k] += m
      variance[k] += values.reduce((s, v) => s + (v - m) ** 2, 0) / n
    }
  }
  const sd = Object.fromEntries(TRAIT_KEYS.map((k) => [k, Math.sqrt(variance[k]) || 1]))
  return { mean, sd }
}

const CALIBRATION = buildCalibration()

/** @param {(number|null)[]} answers answer index per question */
export function computeRawTraits(answers, questions = QUESTIONS) {
  const raw = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0]))
  answers.forEach((answerIndex, qi) => {
    if (answerIndex == null) return
    const effects = questions[qi]?.answers[answerIndex]?.traitEffects ?? {}
    for (const [k, v] of Object.entries(effects)) raw[k] += v
  })
  return raw
}

export function normalizeTraits(raw, calibration = CALIBRATION) {
  const { zScale, clamp: [lo, hi] } = SCORING_CONFIG
  return Object.fromEntries(
    TRAIT_KEYS.map((k) => {
      const z = (raw[k] - calibration.mean[k]) / calibration.sd[k]
      return [k, clamp(50 + z * zScale, lo, hi)]
    }),
  )
}

function traitWeights(college) {
  const { baseWeight, extremityWeight, extremityPower } = SCORING_CONFIG
  return Object.fromEntries(
    TRAIT_KEYS.map((k) => {
      const extremity = Math.abs(college.target[k] - 50) / 50
      const override = college.weights?.[k] ?? 1
      return [k, (baseWeight + extremityWeight * extremity ** extremityPower) * override]
    }),
  )
}

const WEIGHTS = Object.fromEntries(COLLEGES.map((c) => [c.id, traitWeights(c)]))

function weightedDistance(vector, college, keys = TRAIT_KEYS) {
  const w = WEIGHTS[college.id]
  let sum = 0
  let wSum = 0
  for (const k of keys) {
    sum += w[k] * (vector[k] - college.target[k]) ** 2
    wSum += w[k]
  }
  return Math.sqrt(sum / wSum)
}

/** The traits that most define a college (largest weighted departure from 50). */
function definingTraits(college) {
  return [...TRAIT_KEYS]
    .sort((a, b) => WEIGHTS[college.id][b] * Math.abs(college.target[b] - 50) - WEIGHTS[college.id][a] * Math.abs(college.target[a] - 50))
    .slice(0, SCORING_CONFIG.definingTraitCount)
}

function chaoBonus(vector, distances) {
  const cfg = SCORING_CONFIG.chao
  const bestOther = Math.min(...Object.entries(distances).filter(([id]) => id !== 'chao').map(([, d]) => d))
  const independence = ramp(vector.independence, cfg.independenceFrom, cfg.independenceTo)
  const unfit = ramp(bestOther, cfg.unfitFrom, cfg.unfitTo)
  const avgDeviation = TRAIT_KEYS.reduce((s, k) => s + Math.abs(vector[k] - 50), 0) / TRAIT_KEYS.length
  const mixed = ramp(avgDeviation, cfg.mixedFrom, cfg.mixedTo)
  return cfg.maxBonus * independence * (0.15 + 0.85 * Math.max(unfit, mixed))
}

export function distanceToMatch(distance) {
  const { bestDistance, worstDistance, high, low, floor } = SCORING_CONFIG.display
  const t = (distance - bestDistance) / (worstDistance - bestDistance)
  // Linear inside the calibrated band, gently compressed outside it.
  const pct = t <= 0 ? high + (1 - Math.exp(t)) * (99 - high) : high - t * (high - low)
  return Math.round(clamp(pct, floor, 99))
}

/**
 * @param {import('../types/quiz.js').TraitVector} vector
 * @returns {import('../types/quiz.js').CollegeScore[]} all colleges, best first
 */
function rawDistances(vector) {
  const bias = SCORING_CONFIG.collegeBias
  const distances = Object.fromEntries(COLLEGES.map((c) => [c.id, weightedDistance(vector, c) + (bias[c.id] ?? 0)]))
  if (distances.chao != null) distances.chao = Math.max(0, distances.chao - chaoBonus(vector, distances))
  return distances
}

/** "Stereotypical member" answers for a college: greedily picks each answer that pushes toward its target. */
function personaAnswers(college, questions = QUESTIONS) {
  return questions.map((q) => {
    let best = 0
    let bestScore = -Infinity
    q.answers.forEach((ans, i) => {
      const score = TRAIT_KEYS.reduce((t, k) => t + (ans.traitEffects[k] ?? 0) * (college.target[k] - 50), 0)
      if (score > bestScore) [best, bestScore] = [i, score]
    })
    return best
  })
}

let fairnessCache = null
/**
 * Mean/SD of each college's distance over a deterministic reference population
 * (random answerers + blends of two college "vibes"). Computed once, lazily,
 * from the current data files, so it re-calibrates itself when you edit them.
 */
function fairnessCalibration() {
  if (fairnessCache) return fairnessCache
  let seed = 20240
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
  const pick = (n) => Math.floor(rand() * n)
  const personas = COLLEGES.map((c) => personaAnswers(c))
  const sums = Object.fromEntries(COLLEGES.map((c) => [c.id, [0, 0]]))
  const n = SCORING_CONFIG.fairness.sampleSize
  for (let i = 0; i < n; i++) {
    let answers
    if (rand() < 0.35) answers = QUESTIONS.map((q) => pick(q.answers.length))
    else {
      const A = personas[pick(personas.length)]
      const B = personas[pick(personas.length)]
      answers = QUESTIONS.map((q, qi) => {
        const r = rand()
        return r < 0.5 ? A[qi] : r < 0.8 ? B[qi] : pick(q.answers.length)
      })
    }
    const d = rawDistances(normalizeTraits(computeRawTraits(answers)))
    for (const id in d) {
      sums[id][0] += d[id]
      sums[id][1] += d[id] ** 2
    }
  }
  const stats = Object.fromEntries(Object.entries(sums).map(([id, [s1, s2]]) => [id, { mean: s1 / n, sd: Math.sqrt(Math.max(1e-6, s2 / n - (s1 / n) ** 2)) }]))
  const all = Object.values(stats)
  const globalMean = all.reduce((t, x) => t + x.mean, 0) / all.length
  const globalSd = all.reduce((t, x) => t + x.sd, 0) / all.length
  fairnessCache = { stats, globalMean, globalSd }
  return fairnessCache
}

/** Distances re-expressed relative to each college's typical distance (see SCORING_CONFIG.fairness). */
function fairDistances(distances) {
  const strength = SCORING_CONFIG.fairness.strength
  if (!strength) return distances
  const { stats, globalMean, globalSd } = fairnessCalibration()
  return Object.fromEntries(
    Object.entries(distances).map(([id, d]) => {
      const calibrated = globalMean + globalSd * ((d - stats[id].mean) / stats[id].sd)
      return [id, (1 - strength) * d + strength * calibrated]
    }),
  )
}

export function rankColleges(vector) {
  const raw = rawDistances(vector)
  const distances = fairDistances(raw)

  const ranked = COLLEGES.map((c) => ({ id: c.id, distance: distances[c.id] })).sort((a, b) => a.distance - b.distance)

  // Break near-ties using each contender's defining traits.
  const [first, second] = ranked
  if (second && second.distance - first.distance < SCORING_CONFIG.tieEpsilon) {
    const byId = Object.fromEntries(COLLEGES.map((c) => [c.id, c]))
    const secondary = (c) => weightedDistance(vector, c, definingTraits(c))
    if (secondary(byId[second.id]) < secondary(byId[first.id])) {
      ranked[0] = second
      ranked[1] = first
    }
  }

  const scored = ranked.map((r) => ({ ...r, match: distanceToMatch(r.distance) }))
  // Keep displayed percentages strictly descending so the podium never shows a tie.
  for (let i = 1; i < scored.length; i++) {
    if (scored[i].match >= scored[i - 1].match) scored[i].match = scored[i - 1].match - 1
  }
  return scored
}

/** @returns {import('../types/quiz.js').QuizResult} */
export function computeResult(answers, questions = QUESTIONS) {
  const vector = normalizeTraits(computeRawTraits(answers, questions))
  const rankings = rankColleges(vector)
  return { vector, rankings, top: rankings[0] }
}

/** The n traits furthest from average — the "interesting" ones for YOUR RICE DNA. */
export function interestingTraits(vector, n = 6) {
  return [...TRAIT_KEYS]
    .sort((a, b) => Math.abs(vector[b] - 50) - Math.abs(vector[a] - 50))
    .slice(0, n)
    .map((key) => ({ key, value: Math.round(vector[key]) }))
}
