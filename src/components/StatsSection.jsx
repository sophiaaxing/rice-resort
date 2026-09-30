import { useEffect, useState } from 'react'
import { COLLEGES } from '../data/colleges.js'
import { fetchStats } from '../utils/api.js'

/**
 * Campus-wide stats. Shows live numbers from Supabase once at least
 * MIN_RESPONSES people have finished; until then it's hidden in production.
 * In `npm run dev` without live data it shows clearly labeled demo data so the
 * layout can be worked on.
 */
const MIN_RESPONSES = 25

const DEMO_STATS = {
  demo: true,
  total: 2841,
  matched_pct: 38,
  most_correct: 'hanszen',
  most_chaotic: 'duncan',
  common_resort: ['mcmurtry', 'jones'],
  heatmap: COLLEGES.flatMap((a, i) => COLLEGES.map((b, j) => [a.id, b.id, i === j ? 14 : ((i * 7 + j * 13) % 11) + 1])),
}

const name = (id) => COLLEGES.find((c) => c.id === id)?.name ?? '—'

function useLiveStats() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    let alive = true
    fetchStats().then((s) => alive && setStats(s))
    return () => {
      alive = false
    }
  }, [])
  return stats
}

export default function StatsSection() {
  const live = useLiveStats()
  const stats = live && live.total >= MIN_RESPONSES ? live : import.meta.env.DEV ? DEMO_STATS : null
  if (!stats) return null

  const cells = new Map((stats.heatmap ?? []).map(([a, b, n]) => [`${a}>${b}`, n]))
  const rowTotals = Object.fromEntries(COLLEGES.map((c) => [c.id, COLLEGES.reduce((s, d) => s + (cells.get(`${c.id}>${d.id}`) ?? 0), 0)]))

  return (
    <section aria-labelledby="stats-heading" className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-8">
      {stats.demo ? (
        <p className="eyebrow mb-6 inline-block -rotate-1 rounded border-2 border-marker px-3 py-1.5 text-marker">Demo data · dev only · not real users</p>
      ) : (
        <p className="eyebrow mb-6 text-muted">Live from the sorting algorithm</p>
      )}
      <h2 id="stats-heading" className="font-serif text-5xl leading-none sm:text-7xl">
        {stats.total.toLocaleString()} owls have been re-sorted.
      </h2>
      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {[
          [stats.matched_pct != null ? `${stats.matched_pct}%` : '—', 'matched their actual college'],
          [name(stats.most_correct), 'most correctly sorted'],
          [name(stats.most_chaotic), 'most chaotic match'],
          [stats.common_resort ? `${name(stats.common_resort[0])} → ${name(stats.common_resort[1])}` : '—', 'most common re-sort'],
        ].map(([value, label]) => (
          <div key={label} className="bg-paper p-6">
            <dt className="eyebrow text-muted">{label}</dt>
            <dd className="mt-3 font-serif text-3xl">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 overflow-x-auto">
        <table className="text-[0.65rem]">
          <caption className="eyebrow mb-3 text-left text-muted">Actual college (rows) → personality match (columns)</caption>
          <thead>
            <tr>
              <th />
              {COLLEGES.map((c) => (
                <th key={c.id} scope="col" className="h-20 w-8 align-bottom font-mono font-medium">
                  <span className="inline-block origin-bottom-left -rotate-45 whitespace-nowrap">{c.shortName}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COLLEGES.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="pr-2 text-right font-mono font-medium">{row.shortName}</th>
                {COLLEGES.map((col) => {
                  const n = cells.get(`${row.id}>${col.id}`) ?? 0
                  const share = rowTotals[row.id] ? n / rowTotals[row.id] : 0
                  return (
                    <td
                      key={col.id}
                      className="size-8 border border-cream"
                      style={{ background: `rgb(29 79 174 / ${Math.min(1, share * 2.5)})` }}
                      title={`${row.name} → ${col.name}: ${n}`}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
