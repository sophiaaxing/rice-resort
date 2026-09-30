import { motion } from 'motion/react'

/** Thin animated progress bar with a tiny bike riding the leading edge. */
export default function ProgressBar({ value, total }) {
  const pct = Math.min(100, (value / total) * 100)
  return (
    <div
      className="relative h-[3px] w-full rounded-full bg-ink/10"
      role="progressbar"
      aria-label="Quiz progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-ink"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 140, damping: 24 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-cream"
        initial={false}
        animate={{ left: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 140, damping: 24 }}
      />
    </div>
  )
}
