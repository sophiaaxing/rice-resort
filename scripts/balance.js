/**
 * Balance check. Run with `npm run balance`.
 * Answers: "does one college come up way more than the others?" and
 * "how likely is someone to land in their own college?"
 */
import { COLLEGES } from '../src/data/colleges.js'
import { QUESTIONS } from '../src/data/questions.js'
import { TRAIT_KEYS } from '../src/data/traitDefinitions.js'
import { computeResult } from '../src/utils/scoring.js'

let seed = 99
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = (n) => Math.floor(rand() * n)
const persona = (c) =>
  QUESTIONS.map((q) => {
    let best = 0
    let bestScore = -Infinity
    q.answers.forEach((a, i) => {
      const s = TRAIT_KEYS.reduce((t, k) => t + (a.traitEffects[k] ?? 0) * (c.target[k] - 50), 0)
      if (s > bestScore) [best, bestScore] = [i, s]
    })
    return best
  })
const P = COLLEGES.map(persona)
const N = 12000
const ids = COLLEGES.map((c) => c.id)
const pct = (x) => `${(100 * x).toFixed(1)}%`.padStart(6)

// Realistic-ish people: part of them fits one college's vibe, part another's, part random.
const person = () => {
  if (rand() < 0.35) return QUESTIONS.map((q) => pick(q.answers.length)) // all over the place
  const A = P[pick(12)]
  const B = P[pick(12)]
  return QUESTIONS.map((q, qi) => {
    const r = rand()
    return r < 0.5 ? A[qi] : r < 0.8 ? B[qi] : pick(q.answers.length)
  })
}

const counts = Object.fromEntries(ids.map((id) => [id, 0]))
for (let i = 0; i < N; i++) counts[computeResult(person()).top.id]++
console.log('\nResult share across a realistic mix of people (fair = 8.3% each):')
for (const [id, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${id.padEnd(9)} ${pct(n / N)} ${'█'.repeat(Math.round((n / N) * 200))}`)

// A student who is genuinely a bit like their own college: 40% their college's vibe, rest a mix.
console.log('\nChance of getting your OWN college if you are...')
console.log('  college    somewhat like it   not like it at all (pure random assignment)')
let sum = 0
for (const [ci, c] of COLLEGES.entries()) {
  let hit = 0
  for (let i = 0; i < 2000; i++) {
    const other = person()
    const answers = QUESTIONS.map((q, qi) => (rand() < 0.4 ? P[ci][qi] : other[qi]))
    if (computeResult(answers).top.id === c.id) hit++
  }
  sum += hit / 2000
  console.log(`  ${c.id.padEnd(9)} ${pct(hit / 2000)}              ${pct(counts[c.id] / N)}`)
}
console.log(`  average    ${pct(sum / 12)}`)
