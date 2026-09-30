import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect, useLayoutEffect } from 'react'
import { navigate, useHashRoute } from './hooks/useHashRoute.js'
import { QuizProvider, useQuiz } from './hooks/useQuiz.jsx'
import About from './pages/About.jsx'
import CollegeSelection from './pages/CollegeSelection.jsx'
import Landing from './pages/Landing.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'
import Sorting from './pages/Sorting.jsx'

const TITLES = {
  '/': 'Rice Resort — You were sorted randomly.',
  '/colleges': 'The Colleges — Rice Resort',
  '/about': 'About — Rice Resort',
  '/start': 'First things first — Rice Resort',
  '/quiz': 'The Quiz — Rice Resort',
  '/sorting': 'Consulting the algorithm… — Rice Resort',
  '/result': "You've been re-sorted — Rice Resort",
}

/** Where a route should bounce to if the quiz state doesn't support it yet. */
function guard(route, quiz) {
  if (route === '/quiz' && !quiz.actualCollege) return '/start'
  if ((route === '/sorting' || route === '/result') && !quiz.complete) return quiz.actualCollege ? '/quiz' : '/start'
  return null
}

function Routes() {
  const [route] = useHashRoute()
  const quiz = useQuiz()
  const redirect = guard(route, quiz)

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true })
  }, [redirect])

  useLayoutEffect(() => {
    document.title = TITLES[route] ?? TITLES['/']
  }, [route])

  if (redirect) return null

  const page = {
    '/': <Landing />,
    '/colleges': <Landing scrollTarget="colleges" />,
    '/about': <About />,
    '/start': <CollegeSelection />,
    '/quiz': <Quiz />,
    '/sorting': <Sorting />,
    '/result': <Results />,
  }[route]

  // Landing and /colleges are the same page, so don't re-animate between them.
  const key = route === '/colleges' ? '/' : route

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
      <motion.div
        key={key}
        className="flex min-h-svh flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {page}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QuizProvider>
        <Routes />
      </QuizProvider>
    </MotionConfig>
  )
}
