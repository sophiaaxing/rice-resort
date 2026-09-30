import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Button from '../components/Button.jsx'
import { HandArrow, Star } from '../components/DecorativeDoodles.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import { COLLEGES, NOT_A_STUDENT } from '../data/colleges.js'
import { navigate } from '../hooks/useHashRoute.js'
import { useQuiz } from '../hooks/useQuiz.jsx'
import { backendEnabled } from '../utils/api.js'

/**
 * Native radio inputs (visually hidden) so arrow keys, Tab, and screen readers
 * all behave like a real radio group, with custom card styling on top.
 */
function Option({ value, checked, onChange, children, accent, className = '' }) {
  return (
    <label
      style={{ '--c': accent }}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-[border-color,background-color,transform,box-shadow] duration-200 ease-snap has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rice sm:px-4 sm:py-3.5 ${
        checked ? 'border-[var(--c)] bg-paper shadow-[3px_3px_0_0_var(--c)]' : 'border-line bg-paper/60 hover:-translate-y-0.5 hover:border-ink/40 hover:bg-paper'
      } ${className}`}
    >
      <input type="radio" name="actual-college" value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
      <span
        aria-hidden="true"
        className={`ml-auto grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${checked ? 'border-[var(--c)] bg-[var(--c)] text-paper' : 'border-ink/30'}`}
      >
        {checked && <Check className="size-3" strokeWidth={3.5} />}
      </span>
    </label>
  )
}

export default function CollegeSelection() {
  const { actualCollege, setActualCollege, answeredCount, complete, finished, reset, goTo } = useQuiz()
  const resuming = answeredCount > 0 && !(complete && finished)

  const start = () => {
    if (complete && finished) {
      reset({ keepCollege: true })
      goTo(0)
    }
    navigate('/quiz')
  }

  return (
    <>
      <Header />
      <main id="main" className="relative mx-auto w-full max-w-4xl flex-1 px-4 pb-10 pt-6 sm:px-8 sm:pt-12">
        <Star className="absolute right-6 top-4 size-7 text-rice sm:right-10" />
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-muted">
          Step 00 · intake form
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 font-serif text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em]"
        >
          First things <span className="italic">first.</span>
        </motion.h1>

        <fieldset className="mt-10">
          <legend className="text-xl font-medium sm:text-2xl">What's your actual residential college?</legend>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            This won't affect your result. We just want to see whether Rice got it right.
          </p>
          {backendEnabled && (
            <p className="mt-1 text-xs text-muted">
              Finished results are saved anonymously for campus-wide stats. No names, no emails.{' '}
              <a href="#/about" className="underline underline-offset-2 hover:text-ink">
                Details
              </a>
            </p>
          )}

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {COLLEGES.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.025 }}>
                <Option value={c.id} checked={actualCollege === c.id} onChange={() => setActualCollege(c.id)} accent={c.theme.accent} className="h-full">
                  <img src={c.crest} alt="" width="36" height="36" className="size-8 shrink-0 object-contain sm:size-9" />
                  <span className="min-w-0 font-serif text-[1.25rem] leading-tight sm:text-[1.4rem]">{c.name}</span>
                </Option>
              </motion.div>
            ))}
            <motion.div className="col-span-2 sm:col-span-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Option value={NOT_A_STUDENT} checked={actualCollege === NOT_A_STUDENT} onChange={() => setActualCollege(NOT_A_STUDENT)} accent="#172033">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-ink/40 font-serif text-lg italic sm:size-9">?</span>
                <span className="min-w-0">
                  <span className="block font-serif text-[1.25rem] leading-tight sm:text-[1.4rem]">I'm not a Rice student</span>
                  <span className="block text-xs text-muted">prospie, alum, parent, curious bystander</span>
                </span>
              </Option>
            </motion.div>
          </div>
        </fieldset>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button size="lg" arrow disabled={!actualCollege} onClick={start}>
            {resuming ? 'Continue the quiz' : 'Start the quiz'}
          </Button>
          <span className="relative flex items-center gap-2">
            <HandArrow className="hidden w-14 -scale-y-100 rotate-180 text-ink/40 sm:block" />
            <span className="hand text-xl text-muted">{actualCollege ? 'no take-backs (you can go back)' : 'pick one first'}</span>
          </span>
        </div>
      </main>
      <Footer />
    </>
  )
}
