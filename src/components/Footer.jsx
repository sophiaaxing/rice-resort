import { Wheel } from './DecorativeDoodles.jsx'

export const DISCLAIMER =
  'Rice Resort is an unofficial student-made personality quiz. College descriptions are playful stereotypes based on campus culture and are not affiliated with or endorsed by Rice University.'

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-8">
      <div className="flex flex-col gap-5 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Wheel className="size-7 text-ink/70" />
          <span className="wordmark text-lg text-ink">
            RICE <span className="italic">RESORT</span>
          </span>
        </div>
        <p className="max-w-xl text-[0.8rem] leading-relaxed">
          {DISCLAIMER} No one is actually any of these things. Probably.{' '}
          <a href="#/about" className="underline underline-offset-2 hover:text-ink">
            About
          </a>
        </p>
      </div>
    </footer>
  )
}
