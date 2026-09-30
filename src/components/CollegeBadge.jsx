/**
 * A college name as a sticker / luggage label / resort key tag. Neutral by
 * default; floods with the college accent on hover or focus.
 */
const BASE =
  'inline-flex select-none items-center whitespace-nowrap border text-ink transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-snap group-hover:-translate-y-0.5 group-hover:border-[var(--c)] group-hover:bg-[var(--c)] group-hover:text-[var(--c-on)] group-hover:shadow-[3px_4px_0_0_rgb(23_32_51/0.18)] group-focus-visible:border-[var(--c)] group-focus-visible:bg-[var(--c)] group-focus-visible:text-[var(--c-on)]'

const VARIANTS = {
  pill: 'rounded-full border-ink/60 bg-paper px-4 py-2 text-[0.72rem] xl:px-5 xl:py-2.5 xl:text-[0.8rem] font-semibold uppercase tracking-[0.16em]',
  label: 'rounded-[4px] border-ink/60 bg-paper px-4 py-1.5 font-serif text-[1.35rem] xl:text-[1.6rem] italic leading-none outline outline-1 outline-offset-[3px] outline-ink/25',
  tag: 'gap-2 rounded-[6px_18px_18px_6px] border-ink/60 bg-sand/70 py-2 pl-2.5 pr-4 font-mono text-[0.72rem] xl:text-[0.8rem] xl:py-2.5 font-semibold uppercase tracking-[0.12em]',
  stamp: 'size-[5.6rem] xl:size-[6.6rem] xl:text-[0.76rem] justify-center rounded-full border-2 border-dashed border-ink/50 bg-transparent text-center text-[0.68rem] font-bold uppercase leading-tight tracking-[0.12em]',
}

// Smaller padding for the phone sticker cluster so all 12 fit on the first screen.
const COMPACT = {
  pill: 'max-sm:px-3.5 max-sm:py-1.5',
  label: 'max-sm:px-3 max-sm:py-1 max-sm:text-[1.2rem]',
  tag: 'max-sm:py-1.5',
  stamp: '',
}

export default function CollegeBadge({ college, variant = 'pill', className = '', as: Tag = 'span', compact = false, ...rest }) {
  const vars = { '--c': college.theme.accent, '--c-on': college.theme.onAccent }
  return (
    <Tag className={`group inline-block ${className}`} style={vars} {...rest}>
      <span className={`${BASE} ${VARIANTS[variant]} ${compact ? COMPACT[variant] : ''}`}>
        {variant === 'tag' && <span className="size-2.5 rounded-full border border-current opacity-70" aria-hidden="true" />}
        {variant === 'label' ? college.name : college.shortName}
      </span>
    </Tag>
  )
}
