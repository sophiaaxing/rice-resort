import { AnimatePresence, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { useId, useState } from 'react'
import Button from './Button.jsx'
import { Stamp } from './DecorativeDoodles.jsx'
import { COLLEGE_BY_ID, NOT_A_STUDENT } from '../data/colleges.js'
import { submitFeedback } from '../utils/api.js'

const SENT_KEY = 'rice-resort:feedback-sent'
const STEREOTYPE_MAX = 280
const COMMENT_MAX = 1000

const ACCURACY = [
  { value: 'nailed', label: 'Scarily accurate' },
  { value: 'kinda', label: 'Kind of' },
  { value: 'nope', label: 'Not even close' },
]

function alreadySent(fingerprint) {
  try {
    return localStorage.getItem(SENT_KEY) === fingerprint
  } catch {
    return false
  }
}

/**
 * "Suggestion box" on the results page: rate the result, tell us the real
 * stereotype of your college, and leave any other feedback. Nothing submitted
 * here is shown publicly.
 */
export default function FeedbackForm({ actualCollege, resultId, fingerprint }) {
  const id = useId()
  const isStudent = actualCollege && actualCollege !== NOT_A_STUDENT
  const about = isStudent ? actualCollege : resultId
  const [accuracy, setAccuracy] = useState(null)
  const [stereotype, setStereotype] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(() => (alreadySent(fingerprint) ? 'sent' : 'idle'))

  const canSend = status !== 'sending' && (accuracy || (isStudent && stereotype.trim()) || comment.trim())

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSend) return
    setStatus('sending')
    const ok = await submitFeedback({ aboutCollege: about, stereotype: isStudent ? stereotype : '', accuracy, comment, actualCollege, resultCollege: resultId })
    if (ok) {
      try {
        localStorage.setItem(SENT_KEY, fingerprint)
      } catch {
        /* fine */
      }
    }
    setStatus(ok ? 'sent' : 'error')
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="relative">
      <div className="ruled relative overflow-hidden rounded-2xl border border-ink/80 bg-paper p-6 shadow-[6px_7px_0_0_rgb(23_32_51/0.1)] sm:p-10">
        <Stamp
          className="absolute -right-6 -top-6 hidden size-32 text-[var(--accent-ink)] opacity-70 sm:block"
          text="SUGGESTION BOX • COMMITTEE REVIEW • "
          center="✎"
        />
        <p className="eyebrow text-muted">Comment card · form RR-2</p>
        <h2 id={`${id}-heading`} className="mt-3 max-w-2xl font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]">
          Your turn. <span className="italic text-[var(--accent-ink)]">Tell us what we got wrong.</span>
        </h2>

        <AnimatePresence mode="wait" initial={false}>
          {status === 'sent' ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8" role="status">
              <p className="font-serif text-3xl italic">Filed.</p>
              <p className="mt-2 text-ink-2">The committee will review it. (There is no committee. It's one person reading these at 2 AM.)</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="mt-8 grid gap-8">
              <fieldset>
                <legend className="text-sm font-semibold uppercase tracking-[0.14em]">Did we nail you?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ACCURACY.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rice ${
                        accuracy === opt.value ? 'border-ink bg-ink text-paper' : 'border-ink/30 bg-paper hover:border-ink'
                      }`}
                    >
                      <input type="radio" name={`${id}-accuracy`} value={opt.value} checked={accuracy === opt.value} onChange={() => setAccuracy(opt.value)} className="sr-only" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {isStudent && (
                <div>
                  <label htmlFor={`${id}-stereotype`} className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold uppercase tracking-[0.14em]">
                    The real stereotype of
                    <span className="font-serif text-2xl normal-case tracking-normal text-[var(--accent-ink)]">{COLLEGE_BY_ID[actualCollege].name}</span>
                    is…
                  </label>
                  <textarea
                    id={`${id}-stereotype`}
                    value={stereotype}
                    onChange={(e) => setStereotype(e.target.value.slice(0, STEREOTYPE_MAX))}
                    rows={3}
                    placeholder={`Be honest. We said “${COLLEGE_BY_ID[actualCollege].archetype.toLowerCase()}.” Were we close?`}
                    className="mt-3 w-full resize-y rounded-xl border border-ink/30 bg-cream/60 px-4 py-3 text-[1.02rem] leading-relaxed placeholder:text-muted/80 focus:border-ink focus:outline-none"
                  />
                  <p className="mt-1.5 flex justify-between gap-4 text-xs text-muted">
                    <span>Keep it affectionate, and no names of real people.</span>
                    <span className="tabular-nums">
                      {stereotype.length}/{STEREOTYPE_MAX}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label htmlFor={`${id}-comment`} className="text-sm font-semibold uppercase tracking-[0.14em]">
                  Anything else? <span className="font-normal normal-case tracking-normal text-muted">Question ideas, bugs, complaints to management</span>
                </label>
                <textarea
                  id={`${id}-comment`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
                  rows={2}
                  className="mt-3 w-full resize-y rounded-xl border border-ink/30 bg-cream/60 px-4 py-3 text-[1.02rem] leading-relaxed focus:border-ink focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg" icon={Send} disabled={!canSend}>
                  {status === 'sending' ? 'Filing…' : 'Submit to the committee'}
                </Button>
                <p className="text-xs text-muted" aria-live="polite">
                  {status === 'error' ? "That didn't go through. Try again in a sec?" : 'Anonymous. Never shown on the site.'}
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
