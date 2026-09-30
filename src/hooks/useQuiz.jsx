import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { QUESTIONS } from '../data/questions.js'
import { computeResult } from '../utils/scoring.js'

const STORAGE_KEY = 'rice-resort:v1'
const TOTAL = QUESTIONS.length

const freshState = () => ({
  actualCollege: null,
  answers: Array(TOTAL).fill(null),
  current: 0,
  finished: false,
})

function load() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== TOTAL) return freshState()
    // Drop any answer index that no longer exists (e.g. after editing questions).
    const answers = saved.answers.map((a, i) => (Number.isInteger(a) && a >= 0 && a < QUESTIONS[i].answers.length ? a : null))
    const current = Math.min(Math.max(0, saved.current | 0), TOTAL - 1)
    return { ...freshState(), ...saved, answers, current, finished: Boolean(saved.finished) && answers.every((a) => a != null) }
  } catch {
    return freshState()
  }
}

const QuizContext = createContext(null)

export function QuizProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* private mode / storage full — progress just won't survive a refresh */
    }
  }, [state])

  const setActualCollege = useCallback((id) => setState((s) => ({ ...s, actualCollege: id })), [])

  /** Record (or change) an answer and advance. Scoring is always derived from
   *  the answers array, so changing a previous answer fully reverses its effect. */
  const answer = useCallback(
    (questionIndex, answerIndex) =>
      setState((s) => {
        const answers = s.answers.slice()
        answers[questionIndex] = answerIndex
        return { ...s, answers, current: Math.min(questionIndex + 1, TOTAL - 1) }
      }),
    [],
  )

  const goTo = useCallback((index) => setState((s) => ({ ...s, current: Math.min(Math.max(0, index), TOTAL - 1) })), [])
  const back = useCallback(() => setState((s) => ({ ...s, current: Math.max(0, s.current - 1) })), [])
  const markFinished = useCallback(() => setState((s) => ({ ...s, finished: true })), [])
  const reset = useCallback(({ keepCollege = false } = {}) => setState((s) => ({ ...freshState(), actualCollege: keepCollege ? s.actualCollege : null })), [])

  const answeredCount = state.answers.filter((a) => a != null).length
  const complete = answeredCount === TOTAL
  const result = useMemo(() => (complete ? computeResult(state.answers) : null), [complete, state.answers])

  const value = useMemo(
    () => ({ ...state, total: TOTAL, answeredCount, complete, result, setActualCollege, answer, goTo, back, markFinished, reset }),
    [state, answeredCount, complete, result, setActualCollege, answer, goTo, back, markFinished, reset],
  )
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside <QuizProvider>')
  return ctx
}
