/**
 * Optional Supabase backend for anonymous result collection + aggregate stats.
 * Talks to Supabase's REST API directly (no SDK). If the two env vars aren't
 * set, everything here is a silent no-op and the site works fully offline.
 *
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=sb_publishable_... or eyJ...  (public key — safe to ship)
 */
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const backendEnabled = Boolean(URL && KEY)

// Legacy "anon" keys are JWTs and go in Authorization too; newer "publishable"
// keys (sb_publishable_…) must only be sent as `apikey`.
const headers = () => ({ apikey: KEY, ...(KEY?.startsWith('eyJ') ? { Authorization: `Bearer ${KEY}` } : {}), 'Content-Type': 'application/json' })

const RESPONDENT_KEY = 'rice-resort:respondent'
const SUBMITTED_KEY = 'rice-resort:last-submitted'

function respondentId() {
  try {
    let id = localStorage.getItem(RESPONDENT_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(RESPONDENT_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

/**
 * Save one completed quiz. Fire-and-forget: never blocks or breaks the UI.
 * Skips dev builds (so testing doesn't pollute data) and exact re-submits
 * (e.g. refreshing the sorting screen).
 */
export async function submitResult({ answers, actualCollege, result }) {
  if (!backendEnabled || !import.meta.env.PROD) return
  const fingerprint = `${actualCollege}:${answers.join('')}`
  try {
    if (localStorage.getItem(SUBMITTED_KEY) === fingerprint) return
  } catch {
    /* storage unavailable — submit anyway */
  }
  const body = {
    respondent_id: respondentId(),
    actual_college: actualCollege ?? 'none',
    result_college: result.top.id,
    match: result.top.match,
    runner_up: result.rankings[1]?.id ?? null,
    answers,
    traits: Object.fromEntries(Object.entries(result.vector).map(([k, v]) => [k, Math.round(v)])),
  }
  try {
    const res = await fetch(`${URL}/rest/v1/results`, { method: 'POST', headers: { ...headers(), Prefer: 'return=minimal' }, body: JSON.stringify(body), keepalive: true })
    if (res.ok) localStorage.setItem(SUBMITTED_KEY, fingerprint)
  } catch {
    /* offline or blocked — the quiz still works */
  }
}

/** Aggregates from the get_stats() SQL function, or null. */
export async function fetchStats() {
  if (!backendEnabled) return null
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/get_stats`, { method: 'POST', headers: headers(), body: '{}' })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

/**
 * Save one feedback entry. Returns true on success. Like results, dev builds
 * don't send anything (they pretend to succeed so the UI can be tested).
 */
export async function submitFeedback({ aboutCollege, stereotype, accuracy, comment, actualCollege, resultCollege }) {
  if (!import.meta.env.PROD) {
    console.info('[dev] feedback not sent:', { aboutCollege, stereotype, accuracy, comment })
    return true
  }
  if (!backendEnabled) return false
  const body = {
    respondent_id: respondentId(),
    about_college: aboutCollege,
    stereotype: stereotype?.trim() || null,
    accuracy: accuracy || null,
    comment: comment?.trim() || null,
    actual_college: actualCollege ?? 'none',
    result_college: resultCollege ?? null,
  }
  try {
    const res = await fetch(`${URL}/rest/v1/feedback`, { method: 'POST', headers: { ...headers(), Prefer: 'return=minimal' }, body: JSON.stringify(body) })
    return res.ok
  } catch {
    return false
  }
}
