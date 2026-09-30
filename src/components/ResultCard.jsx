import { motion } from 'motion/react'
import { Drift, Sparkle, Stamp, Star } from './DecorativeDoodles.jsx'
import { matchNote } from '../utils/resultCopy.js'
import { typeset } from '../utils/typeset.js'

/**
 * The screenshot-worthy hero of the results page: full-bleed college accent,
 * enormous name, tagline, match stamp, and crest sticker.
 */
export default function ResultCard({ college, match }) {
  const long = college.name.length > 9
  return (
    <section
      aria-labelledby="result-heading"
      className="relative overflow-hidden bg-[var(--accent)] text-[var(--on-accent)]"
    >
      {/* secondary-color stripe + faint rings */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-[var(--accent-2)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full border border-current opacity-15" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full border border-dashed border-current opacity-15" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="eyebrow flex items-center gap-3"
        >
          <Sparkle className="size-3" />
          You've been re-sorted.
        </motion.p>

        <div className="relative mt-4 sm:mt-6">
          <motion.h1
            id="result-heading"
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.25 }}
            className={`origin-bottom-left pr-20 font-serif uppercase sm:pr-32 lg:pr-44 leading-[0.8] tracking-[-0.035em] ${
              long ? 'text-[clamp(3.6rem,13.5vw,12rem)]' : 'text-[clamp(4.6rem,20vw,16rem)]'
            }`}
          >
            {college.name}
          </motion.h1>

          {/* crest sticker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.7 }}
            className="absolute -top-4 right-0 sm:-top-6 lg:right-8"
          >
            <Drift y={4} rotate={2} duration={6}>
              <div className="grid size-20 place-items-center rounded-full bg-paper shadow-[4px_6px_0_0_rgb(0_0_0/0.2)] sm:size-32 lg:size-40">
                <img src={college.crest} alt={`${college.name} College crest`} className="size-[72%] object-contain" width="120" height="120" />
              </div>
            </Drift>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-10 sm:mt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
            <p className="eyebrow opacity-80">{college.archetype}</p>
            <p className="mt-3 max-w-2xl text-balance font-serif text-[clamp(1.75rem,4vw,2.9rem)] italic leading-[1.05]">“{typeset(college.tagline)}”</p>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed sm:text-lg">{typeset(college.description)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 1.05 }}
            className="relative flex items-center gap-5 justify-self-start lg:justify-self-end"
          >
            <div className="rounded-2xl border-2 border-current px-5 py-3 sm:px-7 sm:py-4">
              <p className="font-serif text-[clamp(3.6rem,9vw,6rem)] leading-[0.85] tabular-nums">{match}%</p>
              <p className="eyebrow mt-1 text-center">match</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <Star className="size-6" />
              <p className="hand max-w-[9rem] rotate-3 text-2xl leading-none">{matchNote(match)}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Stamp
        className="absolute bottom-6 right-6 hidden size-28 opacity-70 xl:block"
        text="RE-SORTED • NOT RANDOM • RE-SORTED • "
        center="✓"
      />
    </section>
  )
}
