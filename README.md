# Rice Resort

> You were sorted randomly. We can do better.

An unofficial, student-made personality quiz that re-sorts Rice students into the residential college that actually matches their vibe. Fully client-side: React + Vite + Tailwind v4 + Motion. No backend, no accounts, and answers never leave the browser.

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run simulate   # scoring sanity check (see below)
npm run lint
```

## Deploying (GitHub Pages + Supabase)

1. **Database (optional, for collecting results):** create a free project at supabase.com, open *SQL Editor*, paste `supabase/schema.sql`, and run it. Copy the *Project URL* and the public *anon* key from *Project Settings → API*.
2. **GitHub:** create a public repo (e.g. `rice-resort`). Under *Settings → Pages*, set *Source* to **GitHub Actions**. Under *Settings → Secrets and variables → Actions → Variables*, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Push to `main`.** `.github/workflows/deploy.yml` builds and deploys to `https://<user>.github.io/<repo>/`.

Without the two variables, the site still works; it just doesn't collect anything. Results are only submitted from production builds, each finished quiz is saved at most once, and visitors can insert rows but never read them. Only the aggregates from `get_stats()` are public. The homepage stats section appears once there are at least 25 respondents. To see the raw data, open Supabase → *Table Editor*. The **results** table has one row per finished quiz, and **feedback** has comment-card submissions from the results page (accuracy rating, "the real stereotype of my college is…", and free-form comments). Both can export to CSV. Feedback is never shown on the site.

## Where things live

| Path | What |
| --- | --- |
| `src/data/questions.js` | The 20 questions, each answer's `traitEffects`, progress quips, sorting-screen lines |
| `src/data/colleges.js` | All 12 colleges: copy, field notes, theme colors, target trait vectors, optional weight overrides |
| `src/data/traitDefinitions.js` | The 14 hidden dimensions and their display labels |
| `src/utils/scoring.js` | Normalization, weighted distance, Chao wildcard logic, tie-breaks, match-% display mapping (`SCORING_CONFIG`) |
| `src/utils/resultCopy.js` | "Rice's decision" verdict lines, match notes |
| `src/utils/api.js` | Anonymous result submission + stats fetch (Supabase REST; no-op if unconfigured) |
| `supabase/schema.sql` | `results` + `feedback` tables, insert-only security policies, `get_stats()` aggregate function |
| `src/components/FeedbackForm.jsx` | The results-page comment card |
| `src/utils/share.js` | Canvas-drawn 1080×1920 share card, Web Share / download / clipboard fallback |
| `src/hooks/useQuiz.jsx` | Quiz state + localStorage persistence (`rice-resort:v1`) |
| `src/hooks/useHashRoute.js` | Tiny hash router (`#/start`, `#/quiz`, `#/result`, …) |
| `src/pages/*` | Landing, CollegeSelection, Quiz, Sorting, Results, About |
| `src/components/*` | Buttons, answer cards, badges, trait bars, doodles, share card, (dev-only) stats section |
| `public/crests/` | Trimmed copies of the college crests in `public/logos/` |

## How scoring works

1. Each chosen answer adds its `traitEffects` to a raw 14-trait vector. Scores are always recomputed from the full answer list, so changing an earlier answer fully reverses its effect.
2. Each trait is normalized to 0–100 as a z-score against a uniformly random respondent: 50 means average, and ±1 SD is ±16 points. This recalibrates itself automatically when you edit questions.
3. The result is the weighted Euclidean distance to each college's `target`. Traits where a college is extreme weigh more, and `weights` can boost specific traits.
4. **Fairness calibration:** each college's distance is compared with how far that college typically is from a mix of reference respondents. Otherwise the "balanced" Will Rice would win every middle-of-the-road answer set, and extreme colleges like Wiess would rarely come up. Tune it with `SCORING_CONFIG.fairness.strength`.
5. **Chao** gets a distance bonus only when independence is high *and* the user either fits no established archetype well or gave unusually mixed answers. Chao is never simply the fallback for low-confidence results.
6. When two colleges are nearly tied, the tie goes to whichever is closer on its own defining traits.
7. Distances map to a display range: strong matches land around 85–97% and typical ones around 72–90%. Displayed percentages always strictly decrease down the ranking.

After tuning anything, run `npm run simulate` and `npm run balance`. `balance` shows each college's share of results across a realistic mix of people (fair is about 8.3% each), and how likely someone somewhat like their own college is to get it.

`simulate` checks that:
- a stereotypical persona for every college sorts into that college (currently 12/12),
- results hold up when 35% of answers are random (about 89% correct),
- random and blended respondents spread across all 12 colleges.

Add `?debug` to the result URL (`#/result?debug`) to see all 12 distances and the full trait vector.

## Notes

- The stats section shows live data once there are 25+ respondents. In `npm run dev` without live data, it shows clearly labeled demo data instead.
- The share card shows `location.host`, so it will display your real domain once the site is deployed.
- College descriptions are affectionate stereotypes, not factual assessments. See the About page and the footer disclaimer.
