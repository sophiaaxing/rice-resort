import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'

/**
 * Hand-drawn-ish decorative bits. All are aria-hidden and inherit `currentColor`,
 * so color them with a text-* class.
 */

const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

/** Wraps children in a slow, subtle float. Disabled for reduced motion. */
export function Drift({ children, className = '', y = 6, rotate = 2, duration = 7, delay = 0, style, decorative = true }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden={decorative || undefined}
      className={className}
      style={style}
      animate={reduce ? undefined : { y: [0, -y, 0, y * 0.6, 0], rotate: [0, rotate, 0, -rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

export function Star({ className = 'size-6', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={strokeWidth} d="M16 3.5c.9 3.2 2 6.6 3.4 8.7 3 .2 6.4.3 9 .9-2.2 2.2-5 4.1-7.4 6 .8 3 1.9 6.4 2.3 9-2.7-1.6-5.2-3.6-7.5-5.3-2.4 1.8-5 3.7-7.6 5.3.6-2.8 1.8-6 2.6-9-2.4-1.8-5.2-3.7-7.3-6 2.6-.5 6-.7 8.9-.9 1.4-2.2 2.6-5.5 3.6-8.7Z" />
    </svg>
  )
}

export function Sparkle({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 1.5c.6 4.6 2.4 7.6 9.5 10.3-7 2.5-8.9 5.6-9.5 10.7-.7-5.1-2.5-8.2-9.5-10.7 7-2.7 8.8-5.7 9.5-10.3Z" />
    </svg>
  )
}

export function HandArrow({ className = 'w-20', flip = false, strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 120 70" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path {...stroke} strokeWidth={strokeWidth} d="M6 12c14 30 44 46 92 40" />
      <path {...stroke} strokeWidth={strokeWidth} d="M86 40c5 4 10 8 13 12-5 2-10 5-15 9" />
    </svg>
  )
}

export function Squiggle({ className = 'w-24', strokeWidth = 2 }) {
  return (
    <svg viewBox="0 0 120 16" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path {...stroke} strokeWidth={strokeWidth} d="M2 9c6-6 11-6 16 0s11 6 16 0 11-6 16 0 11 6 16 0 11-6 16 0 11 6 16 0 11-6 16 0" />
    </svg>
  )
}

/** Swoosh underline that draws itself in. */
export function Underline({ className = 'w-full', strokeWidth = 3, delay = 0.6 }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 300 20" className={className} preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        {...stroke}
        strokeWidth={strokeWidth}
        d="M4 13c52-7 118-10 190-8 36 1 70 3 102 6M40 17c60-4 130-5 220-1"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.6, 0, 0.3, 1] }}
      />
    </svg>
  )
}

/** Loose hand-drawn loop, for circling things. */
export function ScribbleCircle({ className = 'w-40', strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 200 90" className={className} preserveAspectRatio="none" aria-hidden="true">
      <path {...stroke} strokeWidth={strokeWidth} d="M120 8C72 2 14 14 8 44c-5 28 52 40 104 38 48-2 84-16 80-40C188 18 140 6 92 9 70 11 48 16 34 24" />
    </svg>
  )
}

/** Tiny bike wheel — a Beer Bike nod. Spins slowly. */
export function Wheel({ className = 'size-14', strokeWidth = 1.4, spin = true }) {
  const reduce = useReducedMotion()
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6)
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      animate={spin && !reduce ? { rotate: 360 } : undefined}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
    >
      <circle {...stroke} strokeWidth={strokeWidth * 1.6} cx="32" cy="32" r="28" />
      <circle {...stroke} strokeWidth={strokeWidth * 0.8} cx="32" cy="32" r="24.5" />
      {spokes.map((t) => (
        <line key={t} {...stroke} strokeWidth={strokeWidth * 0.6} x1={32 + Math.cos(t) * 3} y1={32 + Math.sin(t) * 3} x2={32 + Math.cos(t + 0.35) * 24.5} y2={32 + Math.sin(t + 0.35) * 24.5} />
      ))}
      <circle fill="currentColor" cx="32" cy="32" r="3.2" />
    </motion.svg>
  )
}

/** Circular rubber stamp with text around the rim. */
export function Stamp({ text = 'OFFICIALLY UNOFFICIAL • RE-SORTED • ', center = '★', className = 'size-28', spin = true, centerClassName = '' }) {
  const id = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        animate={spin && !reduce ? { rotate: 360 } : undefined}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id={`stamp-${id}`} d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <circle cx="50" cy="50" r="47" {...stroke} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="28" {...stroke} strokeWidth="1" />
        <text fill="currentColor" style={{ fontFamily: 'var(--font-mono)', fontSize: 8.4, letterSpacing: 1.4, fontWeight: 600 }}>
          <textPath href={`#stamp-${id}`}>{text}</textPath>
        </text>
      </motion.svg>
      <div className={`absolute inset-0 grid place-items-center font-serif text-2xl ${centerClassName}`}>{center}</div>
    </div>
  )
}
