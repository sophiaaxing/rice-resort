import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * One "RICE DNA" row: label, a 10-notch bar that fills in the college accent,
 * and a percentage that counts up when scrolled into view.
 */
export default function TraitBar({ label, value, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduce) return
    const controls = animate(0, value, { duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value, delay, reduce])

  return (
    <div ref={ref} className="grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-2">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums text-ink" aria-hidden="true">
        {shown}%
      </span>
      <div
        className="relative col-span-2 h-3.5 overflow-hidden rounded-[3px] border border-ink/80 bg-paper"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-[var(--accent)]"
          style={{ scaleX: 0 }}
          animate={{ scaleX: inView || reduce ? value / 100 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {/* Ten notches, like the ██████░░░░ it's riffing on. */}
        <div className="absolute inset-0 grid grid-cols-10" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={i ? 'border-l border-ink/25' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
