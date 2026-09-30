/**
 * Scoring sanity check. Run with `npm run simulate`.
 *
 *  1. Personas: for each college, a "stereotypical member" greedily picks the
 *     answer that pushes hardest toward that college's target. They should
 *     land in their own college.
 *  2. Noisy personas: same, but ~35% of answers random. Measures how robust
 *     the differentiation is.
 *  3. Random respondents: distribution of results should reach all 12 colleges
 *     without any single college dominating.
 */
import { COLLEGES } from '../src/data/colleges.js'
import { QUESTIONS } from '../src/data/questions.js'
import { TRAIT_KEYS } from '../src/data/traitDefinitions.js'
import { computeResult } from '../src/utils/scoring.js'

let seed = 42
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = (n) => Math.floor(rand() * n)

function personaAnswers(college) {
  return QUESTIONS.map((q) => {
    let best = 0
    let bestScore = -Infinity
    q.answers.forEach((ans, i) => {
      const score = TRAIT_KEYS.reduce((s, k) => s + (ans.traitEffects[k] ?? 0) * (college.target[k] - 50), 0)
      if (score > bestScore) [best, bestScore] = [i, score]
    })
    return best
  })
}

const pad = (s, n) => String(s).padEnd(n)
const pct = (x, total) => `${((100 * x) / total).toFixed(1)}%`

console.log('\n== Personas ==')
let personaHits = 0
for (const c of COLLEGES) {
  const r = computeResult(personaAnswers(c))
  const ok = r.top.id === c.id
  personaHits += ok
  const podium = r.rankings.slice(0, 3).map((x) => `${x.id} ${x.match}% (d${x.distance.toFixed(1)})`).join(', ')
  console.log(`${ok ? '✓' : '✗'} ${pad(c.id, 9)} → ${podium}`)
}
console.log(`${personaHits}/12 personas sorted correctly`)

console.log('\n== Noisy personas (35% random answers, 200 each) ==')
const confusion = {}
let noisyHits = 0
for (const c of COLLEGES) {
  const base = personaAnswers(c)
  confusion[c.id] = {}
  for (let i = 0; i < 200; i++) {
    const answers = base.map((a, qi) => (rand() < 0.35 ? pick(QUESTIONS[qi].answers.length) : a))
    const top = computeResult(answers).top.id
    confusion[c.id][top] = (confusion[c.id][top] ?? 0) + 1
    if (top === c.id) noisyHits++
  }
  const others = Object.entries(confusion[c.id]).filter(([id]) => id !== c.id).sort((a, b) => b[1] - a[1]).slice(0, 3)
  console.log(`${pad(c.id, 9)} ${pad(pct(confusion[c.id][c.id] ?? 0, 200), 7)} else: ${others.map(([id, n]) => `${id} ${n}`).join(', ')}`)
}
console.log(`overall: ${pct(noisyHits, 2400)}`)

console.log('\n== Random respondents (20,000) ==')
const counts = Object.fromEntries(COLLEGES.map((c) => [c.id, 0]))
const topMatches = []
const topDistances = []
const N = 20000
for (let i = 0; i < N; i++) {
  const r = computeResult(QUESTIONS.map((q) => pick(q.answers.length)))
  counts[r.top.id]++
  topMatches.push(r.top.match)
  topDistances.push(r.top.distance)
}
for (const [id, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`${pad(id, 9)} ${pct(n, N)}`)
const q = (arr, p) => [...arr].sort((a, b) => a - b)[Math.floor(p * (arr.length - 1))]
console.log(`top match %  p5 ${q(topMatches, 0.05)}  p50 ${q(topMatches, 0.5)}  p95 ${q(topMatches, 0.95)}`)
console.log(`top distance p5 ${q(topDistances, 0.05).toFixed(1)}  p50 ${q(topDistances, 0.5).toFixed(1)}  p95 ${q(topDistances, 0.95).toFixed(1)}`)

console.log('\n== Blended respondents (50% persona A, 30% persona B, 20% random; 20,000) ==')
const personas = COLLEGES.map(personaAnswers)
const blendCounts = Object.fromEntries(COLLEGES.map((c) => [c.id, 0]))
const blendMatches = []
for (let i = 0; i < N; i++) {
  const A = personas[pick(12)]
  const B = personas[pick(12)]
  const answers = QUESTIONS.map((qq, qi) => {
    const r = rand()
    return r < 0.5 ? A[qi] : r < 0.8 ? B[qi] : pick(qq.answers.length)
  })
  const r = computeResult(answers)
  blendCounts[r.top.id]++
  blendMatches.push(r.top.match)
}
for (const [id, n] of Object.entries(blendCounts).sort((a, b) => b[1] - a[1])) console.log(`${pad(id, 9)} ${pct(n, N)}`)
console.log(`top match %  p5 ${q(blendMatches, 0.05)}  p50 ${q(blendMatches, 0.5)}  p95 ${q(blendMatches, 0.95)}`)
