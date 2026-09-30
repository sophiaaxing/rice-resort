import { COLLEGE_BY_ID, NOT_A_STUDENT } from '../data/colleges.js'
import { TRAIT_BY_KEY } from '../data/traitDefinitions.js'
import { typeset } from './typeset.js'

/**
 * Draws the Instagram-Story-sized share card (1080×1920) with Canvas 2D.
 * Drawing it by hand (rather than screenshotting DOM) keeps output identical on
 * every device and avoids an extra dependency.
 */
export const CARD_W = 1080
export const CARD_H = 1920

const INK = '#172033'
const CREAM = '#f3ecdd'
const PAPER = '#faf6ec'
const MARKER = '#c13d1f'
const SERIF = '"Instrument Serif", Georgia, serif'
const SANS = '"Instrument Sans Variable", system-ui, sans-serif'
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace'
const HAND = '"Caveat", cursive'

export function siteUrl() {
  const { host, pathname } = window.location
  return `${host}${pathname === '/' ? '' : pathname}`.replace(/\/$/, '')
}

async function ensureFonts() {
  if (!document.fonts?.load) return
  await Promise.all([
    document.fonts.load(`400 120px ${SERIF}`),
    document.fonts.load(`italic 400 120px ${SERIF}`),
    document.fonts.load(`600 40px ${SANS}`),
    document.fonts.load(`600 30px ${MONO}`),
    document.fonts.load(`500 40px ${HAND}`),
  ]).catch(() => {})
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Largest font size (≤ max) at which `text` fits in `width`. */
function fitFont(ctx, text, family, width, max, min = 40, style = '') {
  let size = max
  do {
    ctx.font = `${style} ${size}px ${family}`
    if (ctx.measureText(text).width <= width) return size
    size -= 4
  } while (size > min)
  return min
}

function grain(ctx, w, h, alpha = 0.05) {
  // Deterministic speckle so every render matches.
  let s = 1337
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  ctx.save()
  ctx.fillStyle = `rgba(60,48,30,${alpha})`
  for (let i = 0; i < 9000; i++) ctx.fillRect(r() * w, r() * h, 1.6, 1.6)
  ctx.restore()
}

function star(ctx, cx, cy, size, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - size)
  ctx.quadraticCurveTo(cx + size * 0.12, cy - size * 0.12, cx + size, cy)
  ctx.quadraticCurveTo(cx + size * 0.12, cy + size * 0.12, cx, cy + size)
  ctx.quadraticCurveTo(cx - size * 0.12, cy + size * 0.12, cx - size, cy)
  ctx.quadraticCurveTo(cx - size * 0.12, cy - size * 0.12, cx, cy - size)
  ctx.fill()
  ctx.restore()
}

/**
 * @param {{ collegeId: string, match: number, traits: {key: string, value: number}[], actualCollege: string|null }} data
 * @returns {Promise<Blob>}
 */
export async function renderShareCard({ collegeId, match, traits, actualCollege }) {
  const college = COLLEGE_BY_ID[collegeId]
  const { accent, onAccent, secondary } = college.theme
  await ensureFonts()
  const crest = await loadImage(college.crest)

  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'alphabetic'

  // Paper
  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  grain(ctx, CARD_W, CARD_H)

  // Wordmark
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.font = `400 64px ${SERIF}`
  const rice = 'RICE '
  ctx.font = `400 64px ${SERIF}`
  const riceW = ctx.measureText(rice).width
  ctx.font = `italic 400 64px ${SERIF}`
  const resortW = ctx.measureText('RESORT').width
  const wx = CARD_W / 2 - (riceW + resortW) / 2
  ctx.textAlign = 'left'
  ctx.font = `400 64px ${SERIF}`
  ctx.fillText(rice, wx, 132)
  ctx.font = `italic 400 64px ${SERIF}`
  ctx.fillText('RESORT', wx + riceW, 132)
  ctx.textAlign = 'center'
  ctx.font = `600 22px ${MONO}`
  ctx.fillStyle = 'rgba(23,32,51,0.6)'
  ctx.letterSpacing = '5px'
  ctx.fillText('RE-SORTING SERVICE · EST. WHENEVER', CARD_W / 2, 182)
  ctx.letterSpacing = '0px'

  // ---- Measure the panel's contents first so long names/taglines never collide.
  const px = 64
  const py = 228
  const pw = CARD_W - px * 2
  const textW = pw - 124
  const name = college.name.toUpperCase()
  let nameLines
  let nameSize
  const oneLine = fitFont(ctx, name, SERIF, textW, 290, 60)
  if (oneLine >= 170 || !name.includes(' ')) {
    nameLines = [name]
    nameSize = oneLine
  } else {
    const [l1, ...rest] = name.split(' ')
    nameLines = [l1, rest.join(' ')]
    nameSize = Math.min(180, ...nameLines.map((l) => fitFont(ctx, l, SERIF, textW, 180, 60)))
  }
  const nameTop = nameLines.length === 1 ? py + 300 : py + 250
  const nameBaselines = nameLines.map((_, i) => nameTop + nameSize * 0.72 + i * nameSize * 0.86)
  const nameBottom = nameBaselines.at(-1)
  const archetypeY = nameBottom + 88
  ctx.font = `500 38px ${SANS}`
  const taglineLines = []
  let line = ''
  for (const w of `“${typeset(college.tagline)}”`.split(' ')) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > pw - 128 && line) {
      taglineLines.push(line)
      line = w
    } else line = test
  }
  taglineLines.push(line)
  const taglineY = archetypeY + 76
  const matchY = Math.max(py + 822, taglineY + (taglineLines.length - 1) * 50 + 150)
  const ph = matchY + 78 - py
  const tall = ph > 930

  // Accent panel
  ctx.save()
  ctx.fillStyle = 'rgba(23,32,51,0.18)'
  roundRect(ctx, px + 14, py + 16, pw, ph, 44)
  ctx.fill()
  ctx.fillStyle = accent
  roundRect(ctx, px, py, pw, ph, 44)
  ctx.fill()
  ctx.clip()
  ctx.fillStyle = secondary
  ctx.fillRect(px, py + ph - 26, pw, 26)
  grain(ctx, CARD_W, CARD_H, 0.06)
  ctx.restore()

  ctx.fillStyle = onAccent
  ctx.textAlign = 'left'
  ctx.font = `600 30px ${MONO}`
  ctx.letterSpacing = '8px'
  ctx.fillText('I GOT', px + 64, py + 112)
  ctx.letterSpacing = '0px'

  // Crest sticker, top right of the panel
  if (crest) {
    const r = 104
    ctx.save()
    ctx.translate(px + pw - 146, py + 142)
    ctx.rotate(0.12)
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.beginPath()
    ctx.arc(8, 10, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = PAPER
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fill()
    const scale = Math.min((r * 1.35) / crest.width, (r * 1.35) / crest.height)
    ctx.drawImage(crest, (-crest.width * scale) / 2, (-crest.height * scale) / 2, crest.width * scale, crest.height * scale)
    ctx.restore()
  }

  ctx.fillStyle = onAccent
  ctx.font = `400 ${nameSize}px ${SERIF}`
  nameLines.forEach((l, i) => ctx.fillText(l, px + 58, nameBaselines[i]))
  ctx.font = `italic 400 58px ${SERIF}`
  ctx.fillText(college.archetype, px + 64, archetypeY)
  ctx.font = `500 38px ${SANS}`
  ctx.globalAlpha = 0.92
  taglineLines.forEach((l, i) => ctx.fillText(l, px + 64, taglineY + i * 50))
  ctx.globalAlpha = 1

  // Match
  ctx.font = `400 124px ${SERIF}`
  ctx.fillText(`${match}%`, px + 58, matchY)
  const mW = ctx.measureText(`${match}%`).width
  ctx.font = `600 28px ${MONO}`
  ctx.letterSpacing = '6px'
  ctx.fillText('MATCH', px + 76 + mW, matchY - 12)
  ctx.letterSpacing = '0px'
  star(ctx, px + pw - 104, matchY - 36, 32, onAccent)
  star(ctx, px + pw - 160, matchY - 90, 15, onAccent)

  // Stats
  const sx = px + 20
  ctx.fillStyle = INK
  ctx.font = `600 24px ${MONO}`
  ctx.letterSpacing = '6px'
  ctx.globalAlpha = 0.6
  ctx.fillText('RICE DNA', sx, py + ph + (tall ? 92 : 104))
  ctx.globalAlpha = 1
  ctx.letterSpacing = '0px'
  let sy = py + ph + (tall ? 160 : 176)
  for (const t of traits.slice(0, 4)) {
    ctx.fillStyle = INK
    ctx.font = `600 44px ${MONO}`
    ctx.fillText(`${t.value}%`, sx, sy)
    ctx.font = `400 54px ${SERIF}`
    ctx.fillText(TRAIT_BY_KEY[t.key].label, sx + 170, sy)
    const bx = CARD_W - px - 250
    ctx.strokeStyle = INK
    ctx.lineWidth = 2.5
    roundRect(ctx, bx, sy - 30, 230, 24, 5)
    ctx.stroke()
    ctx.fillStyle = accent
    roundRect(ctx, bx + 3, sy - 27, Math.max(4, (224 * t.value) / 100), 18, 3)
    ctx.fill()
    sy += tall ? 68 : 76
  }

  // Divider
  ctx.strokeStyle = 'rgba(23,32,51,0.28)'
  ctx.lineWidth = 2
  ctx.setLineDash([3, 10])
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(sx, sy - 22)
  ctx.lineTo(CARD_W - px - 20, sy - 22)
  ctx.stroke()
  ctx.setLineDash([])

  // Rice's decision
  const isStudent = actualCollege && actualCollege !== NOT_A_STUDENT
  const ry = sy + 50
  ctx.fillStyle = INK
  ctx.font = `600 24px ${MONO}`
  ctx.letterSpacing = '6px'
  ctx.globalAlpha = 0.6
  ctx.fillText('RICE PUT ME IN:', sx, ry)
  ctx.globalAlpha = 1
  ctx.letterSpacing = '0px'
  const actualName = isStudent ? COLLEGE_BY_ID[actualCollege].name : 'Nowhere (yet)'
  ctx.font = `italic 400 80px ${SERIF}`
  ctx.fillText(actualName, sx, ry + 88)
  const aW = ctx.measureText(actualName).width
  if (isStudent && actualCollege !== collegeId) {
    ctx.strokeStyle = MARKER
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.moveTo(sx - 8, ry + 66)
    ctx.quadraticCurveTo(sx + aW / 2, ry + 50, sx + aW + 10, ry + 58)
    ctx.stroke()
  }
  ctx.fillStyle = MARKER
  ctx.font = `500 46px ${HAND}`
  ctx.fillText(isStudent ? (actualCollege === collegeId ? 'nailed it, somehow' : 'administrative error') : 'unsorted & unbothered', sx + 4, ry + 150)

  // Rubber stamp
  ctx.save()
  ctx.translate(CARD_W - px - 170, ry + 70)
  ctx.rotate(-0.14)
  ctx.strokeStyle = MARKER
  ctx.fillStyle = MARKER
  ctx.lineWidth = 5
  roundRect(ctx, -170, -64, 340, 128, 12)
  ctx.stroke()
  ctx.lineWidth = 2
  roundRect(ctx, -158, -52, 316, 104, 8)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.font = `700 32px ${MONO}`
  ctx.letterSpacing = '3px'
  ctx.fillText("I'VE BEEN", 0, -6)
  ctx.fillText('RE-SORTED.', 0, 36)
  ctx.letterSpacing = '0px'
  ctx.restore()

  // Footer
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(23,32,51,0.5)'
  ctx.font = `600 22px ${MONO}`
  ctx.letterSpacing = '4px'
  ctx.fillText(siteUrl().toUpperCase(), sx, CARD_H - 54)
  ctx.textAlign = 'right'
  ctx.fillText('BASED ENTIRELY ON VIBES', CARD_W - px - 20, CARD_H - 54)
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'))
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/**
 * Share via the Web Share API (with the image if the platform supports files),
 * falling back to copying a text blurb to the clipboard.
 * @returns {Promise<'shared' | 'copied' | 'cancelled' | 'failed'>}
 */
export async function shareResult({ blob, filename, text }) {
  const url = `${window.location.origin}${window.location.pathname}`
  try {
    const file = blob ? new File([blob], filename, { type: 'image/png' }) : null
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Rice Resort', text: `${text} ${url}` })
      return 'shared'
    }
    if (navigator.share) {
      await navigator.share({ title: 'Rice Resort', text, url })
      return 'shared'
    }
  } catch (err) {
    if (err?.name === 'AbortError') return 'cancelled'
    // fall through to clipboard
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
