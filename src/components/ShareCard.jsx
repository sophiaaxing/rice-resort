import { AnimatePresence, motion } from 'motion/react'
import { Check, Download, RotateCcw, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from './Button.jsx'
import { HandArrow } from './DecorativeDoodles.jsx'
import { COLLEGE_BY_ID } from '../data/colleges.js'
import { downloadBlob, renderShareCard, shareResult } from '../utils/share.js'

const TOASTS = {
  shared: 'Sent. Let the group chat discourse begin.',
  copied: 'Copied to clipboard. Paste responsibly.',
  downloaded: 'Saved. Post it before you change your mind.',
  failed: "Couldn't share from this browser — try Download instead.",
}

/** Share-card preview plus Share / Download / Retake actions. */
export default function ShareCard({ collegeId, match, traits, actualCollege, onRetake }) {
  const college = COLLEGE_BY_ID[collegeId]
  const [blob, setBlob] = useState(null)
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState(null)
  const filename = `rice-resort-${collegeId}.png`
  const traitKey = traits.map((t) => `${t.key}${t.value}`).join()

  useEffect(() => {
    let url
    let cancelled = false
    renderShareCard({ collegeId, match, traits, actualCollege })
      .then((b) => {
        if (cancelled) return
        url = URL.createObjectURL(b)
        setBlob(b)
        setPreview(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
    // traitKey stands in for the traits array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId, match, traitKey, actualCollege])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const text = `Rice Resort re-sorted me into ${college.name} (${match}% match). “${college.tagline}”`

  const onShare = async () => {
    const outcome = await shareResult({ blob, filename, text })
    if (outcome !== 'cancelled') setToast(outcome)
  }
  const onDownload = () => {
    if (!blob) return
    downloadBlob(blob, filename)
    setToast('downloaded')
  }

  return (
    <section aria-labelledby="share-heading" className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[19rem] lg:max-w-none">
        <div className="aspect-[9/16] overflow-hidden rounded-[1.4rem] border border-ink/15 bg-sand shadow-[8px_10px_0_0_rgb(23_32_51/0.12)]">
          {preview ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={preview}
              alt={`Share card: I got ${college.name}, ${match}% match.`}
              className="size-full object-cover"
              width="1080"
              height="1920"
            />
          ) : (
            <div className="grid size-full place-items-center font-mono text-xs text-muted">developing film…</div>
          )}
        </div>
        <HandArrow className="absolute -right-20 top-10 hidden w-20 rotate-[200deg] text-ink/40 lg:block" />
      </div>

      <div>
        <p className="eyebrow text-muted">The evidence</p>
        <h2 id="share-heading" className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
          Tell the group chat. <span className="italic text-[var(--accent-ink)]">Cause a little drama.</span>
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-ink-2">Sized for your story. Your actual college is on there too, so everyone can see exactly how wrong Rice was.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" icon={Share2} onClick={onShare} disabled={!blob}>
            Share my result
          </Button>
          <Button size="lg" variant="outline" icon={Download} onClick={onDownload} disabled={!blob}>
            Download result
          </Button>
          <Button size="lg" variant="ghost" icon={RotateCcw} onClick={onRetake}>
            Retake quiz
          </Button>
        </div>
        <div className="mt-5 min-h-7" aria-live="polite">
          <AnimatePresence>
            {toast && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm text-paper"
              >
                <Check className="size-4" aria-hidden="true" />
                {TOASTS[toast]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
