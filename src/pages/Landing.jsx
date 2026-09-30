import { motion } from 'motion/react'
import { useEffect } from 'react'
import Button from '../components/Button.jsx'
import CollegeBadge from '../components/CollegeBadge.jsx'
import { Drift, HandArrow, ScribbleCircle, Sparkle, Squiggle, Stamp, Star, Underline, Wheel } from '../components/DecorativeDoodles.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import StatsSection from '../components/StatsSection.jsx'
import { COLLEGE_BY_ID, COLLEGES } from '../data/colleges.js'
import { useQuiz } from '../hooks/useQuiz.jsx'

/**
 * Sticker layout around the hero on wide screens (xl+). Positions are % of the
 * hero box; below xl the same stickers collapse into a cluster under the CTA.
 */
const STICKERS = [
  { id: 'baker', variant: 'pill', pos: { left: '3%', top: '10%' }, rotate: -8 },
  { id: 'wiess', variant: 'label', pos: { left: '8.5%', top: '29%' }, rotate: 5 },
  { id: 'jones', variant: 'tag', pos: { left: '1.5%', top: '48%' }, rotate: -4 },
  { id: 'lovett', variant: 'stamp', pos: { left: '9%', top: '63%' }, rotate: 8 },
  { id: 'martel', variant: 'pill', pos: { left: '3%', top: '81%' }, rotate: 3 },
  { id: 'sidrich', variant: 'tag', pos: { left: '15%', top: '90%' }, rotate: -6 },
  { id: 'hanszen', variant: 'label', pos: { right: '4%', top: '8%' }, rotate: 6 },
  { id: 'chao', variant: 'stamp', pos: { right: '5%', top: '25%' }, rotate: -10 },
  { id: 'duncan', variant: 'pill', pos: { right: '2%', top: '45%' }, rotate: 7 },
  { id: 'mcmurtry', variant: 'tag', pos: { right: '8%', top: '62%' }, rotate: -5 },
  { id: 'willrice', variant: 'label', pos: { right: '2%', top: '79%' }, rotate: -3 },
  { id: 'brown', variant: 'pill', pos: { right: '15%', top: '90%' }, rotate: 4 },
]

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] },
})

function Hero() {
  const { actualCollege, answeredCount, total, complete, finished } = useQuiz()
  const inProgress = actualCollege && answeredCount > 0 && !(complete && finished)
  const hasResult = complete && finished

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-3 sm:px-8 sm:pb-14 sm:pt-8 xl:min-h-[max(600px,calc(100svh-6rem))] xl:justify-center xl:pb-12 xl:pt-2">
      {/* Floating stickers — wide screens */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block">
        {STICKERS.map((s, i) => (
          <motion.div
            key={s.id}
            className="pointer-events-auto absolute"
            style={s.pos}
            initial={{ opacity: 0, scale: 0.6, rotate: s.rotate * 2 }}
            animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.35 + i * 0.05 }}
          >
            <Drift y={5 + (i % 3) * 2} rotate={1.5} duration={6 + (i % 4) * 1.3} delay={i * 0.4} decorative={false}>
              <CollegeBadge college={COLLEGE_BY_ID[s.id]} variant={s.variant} />
            </Drift>
          </motion.div>
        ))}
      </div>

      {/* Doodles */}
      <Drift className="absolute left-[24%] top-[4%] hidden text-rice xl:block" duration={9}>
        <Sparkle className="size-6" />
      </Drift>
      <Drift className="absolute right-[24%] top-[4%] hidden text-ink/70 lg:block" duration={8} delay={1}>
        <Star className="size-7" />
      </Drift>
      <div className="absolute bottom-[14%] right-[27%] hidden text-ink/60 xl:block">
        <Wheel className="size-12" />
      </div>
      <Drift className="absolute right-10 top-2 hidden text-ink/60 sm:block lg:hidden" duration={8}>
        <Star className="size-6" />
      </Drift>

      <div className="relative z-10 mx-auto flex max-w-[62rem] flex-col items-center text-center">
        <motion.p {...rise(0)} className="eyebrow flex items-center gap-3 text-muted">
          <span className="hidden h-px w-8 bg-current opacity-50 sm:block" aria-hidden="true" />
          A re-sorting service for Rice Owls
          <span className="hidden h-px w-8 bg-current opacity-50 sm:block" aria-hidden="true" />
        </motion.p>

        <motion.h1 {...rise(0.08)} className="mt-4 font-serif text-[clamp(3rem,min(11.5vw,15svh),7.6rem)] font-normal uppercase leading-[0.86] tracking-[-0.025em] text-ink sm:mt-5">
          You were sorted <span className="whitespace-nowrap">randomly.</span>
        </motion.h1>

        <motion.p {...rise(0.22)} className="relative mt-3 font-serif text-[clamp(2.3rem,min(7.6vw,9.5svh),5.2rem)] italic leading-none text-rice sm:mt-4">
          We can do better.
          <Underline className="absolute -bottom-3 left-[4%] h-4 w-[92%] text-rice/70" delay={0.9} />
          <span className="hand absolute -right-2 -top-7 hidden rotate-6 text-2xl text-marker sm:block md:-right-24 md:top-0" aria-hidden="true">
            (we can)
          </span>
        </motion.p>

        <motion.p {...rise(0.34)} className="mt-6 max-w-md text-balance text-[1.02rem] leading-relaxed text-ink-2 sm:mt-8 sm:text-lg">
          12 residential colleges. 20 questionable questions. One college you <em className="font-serif text-[1.15em] italic text-ink">actually</em> belong in.
        </motion.p>

        <motion.div {...rise(0.44)} className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4">
          <Button href="#/start" size="lg" arrow>
            Get re-sorted
          </Button>
          {inProgress && (
            <a href="#/quiz" className="text-sm font-medium text-ink-2 underline decoration-ink/30 underline-offset-4 hover:text-ink">
              or pick up where you left off ({String(Math.min(answeredCount + 1, total)).padStart(2, '0')} / {total})
            </a>
          )}
          {hasResult && (
            <a href="#/result" className="text-sm font-medium text-ink-2 underline decoration-ink/30 underline-offset-4 hover:text-ink">
              or see your last result
            </a>
          )}
          <p className="flex items-center gap-2 text-[0.8rem] text-muted">
            <Sparkle className="size-3 text-rice" />
            made for Rice students, based entirely on vibes
          </p>
        </motion.div>
      </div>

      {/* Sticker cluster — below xl */}
      <div className="relative z-10 mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:mt-12 sm:gap-x-2.5 sm:gap-y-3 xl:hidden" aria-label="The twelve residential colleges" role="list">
        {STICKERS.map((s, i) => (
          <motion.div
            key={s.id}
            role="listitem"
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: s.rotate * 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 + i * 0.04 }}
          >
            <CollegeBadge college={COLLEGE_BY_ID[s.id]} variant={s.variant === 'stamp' ? 'pill' : s.variant} compact />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function RandomSection() {
  return (
    <section aria-labelledby="random-heading" className="relative border-y border-line bg-paper/60">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="relative">
          <p className="eyebrow text-muted">Exhibit A</p>
          <h2 id="random-heading" className="mt-5 font-serif text-[clamp(2.6rem,6.4vw,5.2rem)] uppercase leading-[0.9] tracking-[-0.02em]">
            The sorting was random.
            <span className="mt-2 block italic normal-case text-rice">The personalities aren't.</span>
          </h2>
          <Squiggle className="mt-8 w-32 text-ink/40" />
        </div>
        <div className="relative self-end">
          <p className="text-lg leading-relaxed text-ink-2">
            Every new Rice student gets assigned to one of twelve residential colleges, more or less at random. You don't pick. Nobody asks what you're like.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-2">
            And yet, decades of traditions, lore, commons culture, and Beer Bike trauma later, each college has quietly developed its own <span className="relative inline-block">personality<ScribbleCircle className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] text-marker/70" /></span>. We just think you should get a say.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Button href="#/start" size="lg" arrow>
              Find yours
            </Button>
            <span className="hand -rotate-3 text-2xl text-muted">no refunds on identity crises</span>
          </div>
          <HandArrow className="absolute -left-24 -top-10 hidden w-24 rotate-[160deg] text-ink/40 lg:block" />
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['Confess', 'Tell us where Rice actually put you. It won’t affect your result.'],
    ['Answer', 'Twenty questionable questions. One per screen. No wrong answers, only revealing ones.'],
    ['Re-sort', 'Get your vibe college, your Rice DNA, and a card to send the group chat.'],
  ]
  return (
    <section aria-label="How it works" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-8">
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} className="relative bg-cream p-7 sm:p-9">
            <span className="font-serif text-6xl italic leading-none text-ink/25">0{i + 1}</span>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.16em]">{title}</h3>
            <p className="mt-3 leading-relaxed text-ink-2">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function CollegesSection() {
  return (
    <section id="colleges" aria-labelledby="colleges-heading" className="relative mx-auto w-full max-w-7xl scroll-mt-6 px-4 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-muted">The Colleges</p>
          <h2 id="colleges-heading" className="mt-4 font-serif text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.95]">
            Twelve colleges. Twelve vibes.
            <span className="block italic text-ink-2">Zero spoilers.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="hand max-w-[14rem] -rotate-2 text-2xl leading-tight text-muted">archetypes classified until you finish the quiz</p>
          <Stamp className="size-24 shrink-0 text-ink/70" text="CLASSIFIED • CLASSIFIED • CLASSIFIED • " center="?" />
        </div>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {COLLEGES.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
          >
            <a
              href="#/start"
              style={{ '--c': c.theme.accent }}
              className="group flex h-full flex-col rounded-2xl border border-line bg-paper/70 p-4 transition-[border-color,transform,box-shadow] duration-200 ease-snap hover:-translate-y-1 hover:border-[var(--c)] hover:shadow-[4px_5px_0_0_var(--c)] sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <img src={c.crest} alt="" width="64" height="64" loading="lazy" className="size-12 object-contain transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:size-16" />
                <span className="font-mono text-[0.65rem] text-muted">No. {String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 font-serif text-[1.7rem] leading-none sm:text-3xl">{c.name}</h3>
              <p className="mt-3 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                Archetype:
                <span className="relative inline-block h-3.5 w-16 rounded-[2px] bg-ink sm:w-20" aria-label="redacted">
                  <span className="absolute inset-0 grid place-items-center text-[0.55rem] tracking-[0.1em] text-paper opacity-0 transition-opacity group-hover:opacity-100">quiz first</span>
                </span>
              </p>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

export default function Landing({ scrollTarget }) {
  useEffect(() => {
    if (!scrollTarget) return
    // Wait a frame so the page has mounted after any route transition.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' })))
    return () => cancelAnimationFrame(id)
  }, [scrollTarget])

  return (
    <>
      <Header />
      <main id="main" className="relative overflow-x-clip">
        <Hero />
        <RandomSection />
        <HowItWorks />
        <CollegesSection />
        <StatsSection />
      </main>
      <Footer />
    </>
  )
}
