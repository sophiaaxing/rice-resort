import Button from '../components/Button.jsx'
import { Stamp, Star, Wheel } from '../components/DecorativeDoodles.jsx'
import Footer, { DISCLAIMER } from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import { TRAITS } from '../data/traitDefinitions.js'
import { backendEnabled } from '../utils/api.js'

export default function About() {
  return (
    <>
      <Header />
      <main id="main" className="relative mx-auto w-full max-w-4xl flex-1 px-4 pb-10 pt-6 sm:px-8 sm:pt-12">
        <Stamp className="absolute right-4 top-2 hidden size-28 text-rice/80 sm:block" text="UNOFFICIAL • UNAFFILIATED • UNHINGED • " center="★" />
        <p className="eyebrow text-muted">About</p>
        <h1 className="mt-4 font-serif text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em]">
          What <span className="italic">is</span> this?
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-2">
          <p>
            Rice assigns every new student to one of twelve residential colleges, essentially at random. It's a great system. It's also completely unscientific, which
            felt like an opportunity.
          </p>
          <p>
            Rice Resort asks twenty questions about your Thursday nights, your Beer Bike morning, and your relationship with institutions, then compares you to the
            unofficial personality each college has developed over the years.
          </p>
        </div>

        <section className="mt-14 rounded-2xl border border-line bg-paper/70 p-6 sm:p-8" aria-labelledby="how-heading">
          <div className="flex items-center gap-3">
            <Wheel className="size-7 text-ink/70" spin={false} />
            <h2 id="how-heading" className="font-serif text-3xl">
              How the "algorithm" works
            </h2>
          </div>
          <p className="mt-4 leading-relaxed text-ink-2">
            No answer maps directly to a college. Each one nudges fourteen hidden dimensions. At the end we compare your profile to each college's (entirely vibe-based)
            profile and pick the closest. The math is real. The inputs are not.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {TRAITS.map((t) => (
              <li key={t.key} className="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">
                {t.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="disclaimer-heading">
          <h2 id="disclaimer-heading" className="eyebrow flex items-center gap-2 text-muted">
            <Star className="size-4" /> The fine print
          </h2>
          <p className="mt-4 font-serif text-2xl italic leading-snug sm:text-3xl">{DISCLAIMER}</p>
          <p className="mt-5 leading-relaxed text-ink-2">
            Every college is full of people who are nothing like its stereotype, and that's kind of the point — you got sorted at random, and you turned out great anyway.
            Nothing here is a factual assessment of anyone.{' '}
            {backendEnabled
              ? 'When you finish, your answers, your result, and the college you picked are saved anonymously (no names, emails, or accounts) to power the campus-wide stats.'
              : 'Your answers never leave your browser.'}
          </p>
        </section>

        <div className="mt-14">
          <Button href="#/start" size="lg" arrow>
            Get re-sorted
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
