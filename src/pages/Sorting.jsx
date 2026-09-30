import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Sparkle, Star, Wheel } from '../components/DecorativeDoodles.jsx'
import { SORTING_LINES } from '../data/questions.js'
import { navigate } from '../hooks/useHashRoute.js'
import { useQuiz } from '../hooks/useQuiz.jsx'
import { submitResult } from '../utils/api.js'

const DURATION = 2800

export default function Sorting() {
  const { markFinished, answers, actualCollege, result } = useQuiz()
  const reduce = useReducedMotion()
  const [line, setLine] = useState(0)

  // Anonymous result submission (no-op unless the Supabase env vars are set).
  useEffect(() => {
    if (result) submitResult({ answers, actualCollege, result })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const step = DURATION / SORTING_LINES.length
    const cycle = setInterval(() => setLine((l) => Math.min(l + 1, SORTING_LINES.length - 1)), step)
    const done = setTimeout(() => {
      markFinished()
      navigate('/result', { replace: true })
    }, DURATION + 250)
    return () => {
      clearInterval(cycle)
      clearTimeout(done)
    }
  }, [markFinished])

  return (
    <main id="main" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-5 text-paper" aria-busy="true">
      {/* orbiting doodles */}
      <motion.div
        aria-hidden="true"
        className="absolute size-[34rem] max-w-[140vw] rounded-full border border-paper/10"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <Star className="absolute -top-3 left-1/2 size-6 text-highlight" />
        <Sparkle className="absolute bottom-10 left-6 size-4 text-paper/60" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute size-[22rem] max-w-[100vw] rounded-full border border-dashed border-paper/15"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkle className="absolute -right-2 top-1/2 size-5 text-paper/70" />
      </motion.div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <Wheel className="size-16 text-paper/80" />
        <h1 className="mt-8 font-serif text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.92] tracking-[-0.01em]">
          Consulting the sorting algorithm<span className="inline-block w-[1.2em] text-left">...</span>
        </h1>

        <div className="mt-8 h-8" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-sm tracking-[0.04em] text-paper/75 sm:text-base"
            >
              {SORTING_LINES[line]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-paper/15 sm:w-80" role="progressbar" aria-label="Sorting progress" aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full rounded-full bg-highlight"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '38%', '52%', '81%', '100%'] }}
            transition={{ duration: DURATION / 1000, times: [0, 0.25, 0.5, 0.8, 1], ease: 'easeInOut' }}
          />
        </div>
        <p className="hand mt-6 -rotate-2 text-xl text-paper/50">please do not refresh your personality</p>
      </div>
    </main>
  )
}
