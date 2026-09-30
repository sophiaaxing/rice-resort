const LINKS = [
  { href: '#/about', label: 'About', short: 'About' },
  { href: '#/colleges', label: 'The Colleges', short: 'Colleges' },
  { href: '#/start', label: 'Take the Quiz', short: 'Quiz' },
]

/**
 * Site header. `minimal` hides the nav (used inside the quiz), and `right`
 * lets a page slot in its own controls.
 */
export default function Header({ minimal = false, right = null, tone = 'ink' }) {
  const color = tone === 'accent' ? 'text-[var(--on-accent)]' : 'text-ink'
  return (
    <header className={`relative z-20 mx-auto flex w-full max-w-7xl h-16 items-center justify-between gap-4 px-4 sm:h-20 sm:px-8 ${color}`}>
      <a href="#/" className="wordmark shrink-0 text-[1.35rem] sm:text-[1.6rem]" aria-label="Rice Resort — home">
        RICE <span className="italic">RESORT</span>
      </a>
      {right}
      {!minimal && !right && (
        <nav aria-label="Main">
          <ul className="flex items-center gap-3.5 sm:gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-[0.7rem] font-semibold uppercase tracking-[0.14em] opacity-85 transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:opacity-100 hover:after:scale-x-100 sm:text-xs"
                >
                  <span className="sm:hidden">{l.short}</span>
                  <span className="hidden sm:inline">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
