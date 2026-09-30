import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import AnswerCard from '../components/AnswerCard.jsx'
import { HandArrow, Sparkle } from '../components/DecorativeDoodles.jsx'
import Header from '../components/Header.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { PROGRESS_MESSAGES, QUESTIONS } from '../data/questions.js'
import { navigate } from '../hooks/useHashRoute.js'
import { useQuiz } from '../hooks/useQuiz.jsx'
import { typeset } from '../utils/typeset.js'

const LETTERS = 'ABCDEFGH'
const SELECT_DELAY = 340 // ms the selected card gets to show off before advancing

function StartOver() {
  const { reset } = useQuiz()
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3500)
    return () => clearTimeout(t)
  }, [armed])
  return (
    <button
      type="button"
      onClick={() => {
        if (!armed) return setArmed(true)
        reset()
        navigate('/start')
      }}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
        armed ? 'border-marker bg-marker text-paper' : 'border-line text-ink-2 hover:border-ink/40 hover:text-ink'
      }`}
      aria-live="polite"
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      {armed ? 'Sure? Tap to wipe it' : 'Start over'}
    </button>
  )
}

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -36 }),
}

export default function Quiz() {
  const { current, answers, total, answer, back, goTo } = useQuiz()
  const [pending, setPending] = useState(null)
  const [dir, setDir] = useState(1)
  const headingRef = useRef(null)
  const timer = useRef(null)

  const question = QUESTIONS[current]
  const chosen = pending ?? answers[current]
  const number = current + 1
  const message = PROGRESS_MESSAGES[number]
  const twoCol = question.answers.every((a) => a.text.length <= 44)

  useEffect(() => () => clearTimeout(timer.current), [])

  // Move focus to the new question so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [current])

  const select = useCallback(
    (index) => {
      if (pending != null) return
      setPending(index)
      setDir(1)
      timer.current = setTimeout(() => {
        answer(current, index)
        setPending(null)
        if (current === total - 1) navigate('/sorting')
      }, SELECT_DELAY)
    },
    [pending, answer, current, total],
  )

  const goBack = useCallback(() => {
    if (pending != null) return
    if (current === 0) return navigate('/start')
    setDir(-1)
    back()
  }, [pending, current, back])

  const goNext = useCallback(() => {
    if (pending != null || answers[current] == null) return
    if (current === total - 1) return navigate('/sorting')
    setDir(1)
    goTo(current + 1)
  }, [pending, answers, current, total, goTo])

  // Keyboard: A–H picks an answer, ←/→ move between answered questions.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, select')) return
      const i = LETTERS.indexOf(e.key.toUpperCase())
      if (e.key.length === 1 && i >= 0 && i < question.answers.length) {
        e.preventDefault()
        select(i)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [question, select, goBack, goNext])

  return (
    <>
      <Header minimal right={<StartOver />} />
      <main id="main" className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-8 sm:px-8">
        <div className="pt-2 sm:pt-6">
          <div className="flex items-end justify-between gap-4">
            <p className="font-mono text-sm font-semibold tabular-nums tracking-[0.08em] text-ink" aria-live="polite">
              <span className="sr-only">Question </span>
              <span className="text-2xl sm:text-3xl">{String(number).padStart(2, '0')}</span>
              <span className="text-muted"> / {total}</span>
            </p>
            <div className="relative min-h-8 text-right">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 6, rotate: -4 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35 }}
                    className="hand flex items-center justify-end gap-1.5 text-[1.35rem] text-marker sm:text-2xl"
                    role="status"
                  >
                    <Sparkle className="size-3.5 shrink-0" />
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={answers.filter((a) => a != null).length} total={total} />
          </div>
        </div>

        <div className="relative flex-1 pt-10 sm:pt-16">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={current}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              aria-labelledby="question-heading"
            >
              <h1
                id="question-heading"
                ref={headingRef}
                tabIndex={-1}
                className="max-w-3xl text-balance font-serif text-[clamp(2.1rem,5.4vw,3.7rem)] leading-[1.02] tracking-[-0.01em] outline-none"
              >
                {typeset(question.prompt)}
              </h1>
              <div className={`mt-8 grid gap-2.5 sm:mt-10 sm:gap-3 ${twoCol ? 'md:grid-cols-2' : ''}`} role="group" aria-label="Answers">
                {question.answers.map((a, i) => (
                  <AnswerCard
                    key={i}
                    index={i}
                    letter={LETTERS[i]}
                    text={a.text}
                    selected={chosen === i}
                    dimmed={pending != null && pending !== i}
                    onSelect={() => select(i)}
                  />
                ))}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        <nav aria-label="Question navigation" className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-5">
          <button type="button" onClick={goBack} className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-ink-2 hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {current === 0 ? 'Change college' : 'Back'}
          </button>
          <p className="hidden items-center gap-2 text-xs text-muted md:flex">
            <HandArrow className="w-8 -rotate-12 text-ink/30" />
            press <kbd className="rounded border border-line bg-paper px-1.5 font-mono">A</kbd>–<kbd className="rounded border border-line bg-paper px-1.5 font-mono">{LETTERS[question.answers.length - 1]}</kbd> to answer
          </p>
          <button
            type="button"
            onClick={goNext}
            disabled={answers[current] == null}
            className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-ink-2 hover:text-ink disabled:invisible"
          >
            {current === total - 1 ? 'See result' : 'Next'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      </main>
    </>
  )
}
