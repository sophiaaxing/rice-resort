import { ArrowRight } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-ink text-paper border border-ink shadow-[3px_3px_0_0_var(--accent)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--accent)] active:translate-y-0 active:shadow-[1px_1px_0_0_var(--accent)]',
  outline: 'border border-ink/70 text-ink bg-transparent hover:bg-ink hover:text-paper',
  ghost: 'text-ink-2 hover:text-ink underline-offset-4 hover:underline',
  onAccent:
    'bg-[var(--on-accent)] text-[var(--accent)] border border-[var(--on-accent)] hover:-translate-y-0.5 shadow-[3px_3px_0_0_rgb(0_0_0/0.25)]',
}

const SIZES = {
  lg: 'px-7 py-4 text-[0.95rem] sm:px-8 sm:py-[1.1rem] sm:text-base',
  md: 'px-5 py-3 text-sm',
  sm: 'px-3.5 py-2 text-xs',
}

/**
 * Button or link (pass `href`). `arrow` adds the trailing → that nudges on hover.
 */
export default function Button({ variant = 'primary', size = 'md', arrow = false, href, className = '', children, icon: Icon, ...rest }) {
  const classes = `group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase tracking-[0.08em] transition-[transform,box-shadow,background-color,color] duration-200 ease-snap disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  const content = (
    <>
      {Icon && <Icon className="size-[1.1em]" aria-hidden="true" strokeWidth={2} />}
      <span>{children}</span>
      {arrow && <ArrowRight className="size-[1.15em] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" strokeWidth={2.2} />}
    </>
  )
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
