import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HandArrow, ScribbleCircle, Sparkle, Squiggle, Wheel } from '../components/DecorativeDoodles.jsx'
import FeedbackForm from '../components/FeedbackForm.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ResultCard from '../components/ResultCard.jsx'
import ShareCard from '../components/ShareCard.jsx'
import TraitBar from '../components/TraitBar.jsx'
import { COLLEGE_BY_ID, NOT_A_STUDENT } from '../data/colleges.js'
import { TRAIT_BY_KEY, TRAIT_KEYS } from '../data/traitDefinitions.js'
import { navigate } from '../hooks/useHashRoute.js'
import { useQuiz } from '../hooks/useQuiz.jsx'
import { backendEnabled } from '../utils/api.js'
import { answerSeed, verdictFor } from '../utils/resultCopy.js'
import { interestingTraits } from '../utils/scoring.js'
import { typeset } from '../utils/typeset.js'

function SectionHeading({ eyebrow, children, note }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-muted">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(2.3rem,5vw,3.8rem)] leading-[0.95]">{children}</h2>
      </div>
      {note && <p className="hand -rotate-2 text-2xl text-muted">{note}</p>}
    </div>
  )
}

function RunnerUp({ rank, score, isTop }) {
  const college = COLLEGE_BY_ID[score.id]
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <li ref={ref} className="relative border-b border-line last:border-b-0" style={{ '--c': college.theme.accent, '--c-ink': college.theme.ink }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`tip-${college.id}`}
        className="group flex w-full items-center gap-4 py-4 text-left sm:gap-6 sm:py-5"
      >
        <span className="w-8 font-mono text-sm text-muted">{String(rank).padStart(2, '0')}</span>
        <img src={college.crest} alt="" width="40" height="40" className="size-9 object-contain sm:size-10" />
        <span className={`flex-1 font-serif uppercase leading-none transition-colors group-hover:text-[var(--c-ink)] ${isTop ? 'text-[clamp(2rem,5vw,3.2rem)]' : 'text-[clamp(1.6rem,4vw,2.4rem)] text-ink-2'}`}>
          {college.name}
          <span className="ml-3 align-middle text-[0.65rem] font-sans font-semibold tracking-[0.14em] text-muted underline decoration-dotted underline-offset-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            what's this?
          </span>
        </span>
        <span className={`font-mono font-semibold tabular-nums ${isTop ? 'text-2xl' : 'text-lg text-ink-2'}`}>{score.match}%</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={`tip-${college.id}`}
            role="tooltip"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-12 top-[calc(100%-0.5rem)] z-30 w-[min(20rem,calc(100vw-5rem))] rounded-xl border border-ink bg-paper p-4 shadow-[4px_4px_0_0_var(--c)] sm:left-24"
          >
            <p className="eyebrow text-[var(--c-ink)]">{college.archetype}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{typeset(college.blurb)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function Decision({ actualCollege, resultId, seed }) {
  const verdict = verdictFor(actualCollege, resultId, seed)
  const vibe = COLLEGE_BY_ID[resultId]
  const actual = actualCollege && actualCollege !== NOT_A_STUDENT ? COLLEGE_BY_ID[actualCollege] : null
  const wrong = verdict.kind === 'wrong'

  return (
    <section aria-labelledby="decision-heading" className="relative">
      <p className="eyebrow text-muted">Rice's decision</p>
      <h2 id="decision-heading" className="sr-only">
        Rice's decision
      </h2>
      <div className="mt-6 grid overflow-hidden rounded-2xl border border-ink/80 sm:grid-cols-2">
        <div className="relative border-b border-ink/80 bg-paper p-6 sm:border-b-0 sm:border-r sm:p-8">
          <p className="eyebrow text-muted">Actual college</p>
          <div className="mt-4 flex items-center gap-4">
            {actual ? (
              <img src={actual.crest} alt="" width="56" height="56" className={`size-12 object-contain sm:size-14 ${wrong ? 'opacity-60 grayscale' : ''}`} />
            ) : (
              <span className="grid size-12 place-items-center rounded-full border border-dashed border-ink/40 font-serif text-xl italic sm:size-14">?</span>
            )}
            <p className="relative font-serif text-[clamp(2rem,5vw,3.2rem)] leading-none">
              {actual ? actual.name : 'Unsorted'}
              {wrong && (
                <motion.span
                  aria-hidden="true"
                  className="absolute left-[-4%] top-1/2 h-[3px] w-[108%] origin-left -rotate-3 rounded-full bg-marker"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              )}
            </p>
          </div>
          <p className="mt-3 text-sm text-muted">{actual ? 'assigned by a random number generator' : 'not a Rice student (yet?)'}</p>
        </div>
        <div className="relative bg-[var(--accent)] p-6 text-[var(--on-accent)] sm:p-8">
          <p className="eyebrow opacity-80">Vibe college</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper sm:size-14">
              <img src={vibe.crest} alt="" width="48" height="48" className="size-[74%] object-contain" />
            </span>
            <p className="font-serif text-[clamp(2rem,5vw,3.2rem)] leading-none">{vibe.name}</p>
          </div>
          <p className="mt-3 text-sm opacity-80">assigned by your own questionable answers</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
      >
        <p className="relative inline-block font-serif text-[clamp(2.2rem,5.5vw,4rem)] italic leading-none">
          {verdict.headline}
          {verdict.kind !== 'outsider' && <ScribbleCircle className="pointer-events-none absolute -inset-x-6 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+3rem)] text-marker/60" />}
        </p>
        <p className="hand text-2xl text-marker sm:text-3xl">{verdict.subline}</p>
      </motion.div>
    </section>
  )
}

function FieldNotes({ college }) {
  const rows = [
    ['Natural habitat', college.fieldNotes.habitat],
    ['Green flag', college.fieldNotes.greenFlag],
    ['Red flag', college.fieldNotes.redFlag],
  ]
  return (
    <aside className="ruled relative rounded-2xl border border-line bg-paper p-6 sm:p-8" aria-label="Field notes">
      <p className="hand text-3xl text-[var(--accent-ink)]">field notes</p>
      <dl className="mt-4 space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow text-muted">{k}</dt>
            <dd className="mt-1 font-serif text-2xl leading-tight">{typeset(v)}</dd>
          </div>
        ))}
      </dl>
      <Sparkle className="absolute right-5 top-5 size-5 text-[var(--accent)]" />
    </aside>
  )
}

function DebugPanel({ result }) {
  return (
    <details className="mx-auto mt-10 w-full max-w-7xl px-4 font-mono text-xs sm:px-8" open>
      <summary className="cursor-pointer text-muted">scoring debug (?debug)</summary>
      <div className="mt-3 grid gap-6 rounded-xl border border-line bg-paper p-4 sm:grid-cols-2">
        <table>
          <tbody>
            {result.rankings.map((r) => (
              <tr key={r.id}>
                <td className="pr-4">{r.id}</td>
                <td className="pr-4 tabular-nums">d {r.distance.toFixed(2)}</td>
                <td className="tabular-nums">{r.match}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <tbody>
            {TRAIT_KEYS.map((k) => (
              <tr key={k}>
                <td className="pr-4">{k}</td>
                <td className="tabular-nums">{result.vector[k].toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default function Results() {
  const { result } = useQuiz()
  // The page can re-render mid exit-transition after a retake clears the quiz.
  if (!result) return null
  return <ResultsView result={result} />
}

function ResultsView({ result }) {
  const { answers, actualCollege, reset } = useQuiz()
  const college = COLLEGE_BY_ID[result.top.id]
  const traits = useMemo(() => interestingTraits(result.vector, 6), [result.vector])
  const seed = answerSeed(answers)
  const debug = /[?&]debug\b/.test(window.location.search + window.location.hash)

  const theme = {
    '--accent': college.theme.accent,
    '--accent-2': college.theme.secondary,
    '--on-accent': college.theme.onAccent,
    '--accent-ink': college.theme.ink,
  }

  const retake = () => {
    reset({ keepCollege: true })
    navigate('/quiz')
  }

  return (
    <div style={theme} className="flex min-h-svh flex-col">
      <div className="bg-[var(--accent)]">
        <Header tone="accent" />
      </div>
      <main id="main">
        <ResultCard college={college} match={result.top.match} />

        <div className="mx-auto w-full max-w-7xl space-y-24 px-4 py-20 sm:space-y-32 sm:px-8 sm:py-28">
          {/* DNA + field notes */}
          <section aria-labelledby="dna-heading" className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="Lab results" note="peer review pending">
                <span id="dna-heading">
                  Your Rice <span className="italic">DNA</span>
                </span>
              </SectionHeading>
              <div className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {traits.map((t, i) => (
                  <TraitBar key={t.key} label={TRAIT_BY_KEY[t.key].label} value={t.value} delay={i * 0.08} />
                ))}
              </div>
              <p className="mt-6 text-xs text-muted">Your six most extreme traits, out of fourteen we quietly measured.</p>
            </div>
            <FieldNotes college={college} />
          </section>

          {/* Runners-up */}
          <section aria-labelledby="podium-heading">
            <SectionHeading eyebrow="The podium" note="tap a name for the dossier">
              <span id="podium-heading">
                Runners-<span className="italic">up</span>
              </span>
            </SectionHeading>
            <ol className="mt-8 border-y border-ink/80">
              {result.rankings.slice(0, 3).map((score, i) => (
                <RunnerUp key={score.id} rank={i + 1} score={score} isTop={i === 0} />
              ))}
            </ol>
          </section>

          <Decision actualCollege={actualCollege} resultId={college.id} seed={seed} />

          {(backendEnabled || import.meta.env.DEV) && (
            <FeedbackForm actualCollege={actualCollege} resultId={college.id} fingerprint={`${actualCollege}:${answers.join('')}`} />
          )}

          <div className="relative">
            <div className="mb-16 flex items-center gap-4 text-ink/30" aria-hidden="true">
              <Squiggle className="w-24" />
              <Wheel className="size-8" />
              <Squiggle className="w-24" />
            </div>
            <ShareCard collegeId={college.id} match={result.top.match} traits={traits} actualCollege={actualCollege} onRetake={retake} />
            <HandArrow className="absolute -top-2 right-4 hidden w-16 text-ink/20 md:block" flip />
          </div>
        </div>
        {debug && <DebugPanel result={result} />}
      </main>
      <Footer />
    </div>
  )
}
