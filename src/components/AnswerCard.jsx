import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { typeset } from '../utils/typeset.js'

/**
 * One answer option. It's a real <button> so Tab/Enter/Space work, and
 * `aria-pressed` tells screen readers which one is currently chosen.
 */
export default function AnswerCard({ letter, text, selected, dimmed, onSelect, index }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-keyshortcuts={letter}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0, scale: selected ? 1.015 : 1 }}
      transition={{ duration: 0.22, delay: dimmed || selected ? 0 : 0.03 * index, ease: [0.2, 0.9, 0.25, 1] }}
      className={`group relative flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-snap sm:px-5 sm:py-[1.15rem] ${
        selected
          ? 'border-ink bg-ink text-paper shadow-[4px_4px_0_0_var(--color-rice)]'
          : 'border-line bg-paper/70 text-ink hover:-translate-y-0.5 hover:border-ink/45 hover:bg-paper hover:shadow-[0_6px_0_-2px_rgb(23_32_51/0.08)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-px grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[0.72rem] font-semibold transition-colors ${
          selected ? 'border-paper/40 bg-paper text-ink' : 'border-ink/25 text-ink-2 group-hover:border-ink group-hover:bg-ink group-hover:text-paper'
        }`}
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : letter}
      </span>
      <span className="min-w-0 flex-1 text-[1.02rem] pt-[3px] leading-snug [overflow-wrap:anywhere] sm:text-[1.06rem]">{typeset(text)}</span>
    </motion.button>
  )
}
