/**
 * The 14 hidden personality dimensions. Every answer nudges some of these;
 * the college match is computed from the final (normalized) vector.
 *
 * `label` is what shows up in "YOUR RICE DNA" and on the share card.
 * `short` is used where space is tight (share card stat lines).
 */
export const TRAITS = [
  { key: 'community', label: 'Community', short: 'Community' },
  { key: 'collegeLoyalty', label: 'College Loyalty', short: 'Loyalty' },
  { key: 'social', label: 'Social Battery', short: 'Social' },
  { key: 'party', label: 'Party', short: 'Party' },
  { key: 'traditionLore', label: 'Tradition & Lore', short: 'Lore' },
  { key: 'campusInvolvement', label: 'Overcommitment', short: 'Involvement' },
  { key: 'chaosWeirdness', label: 'Chaos', short: 'Chaos' },
  { key: 'academic', label: 'Academic Grind', short: 'Academic' },
  { key: 'adventurous', label: 'Adventure', short: 'Adventure' },
  { key: 'independence', label: 'Independence', short: 'Independence' },
  { key: 'wholesome', label: 'Wholesomeness', short: 'Wholesome' },
  { key: 'degeneracy', label: 'Degeneracy', short: 'Degeneracy' },
  { key: 'socialPerception', label: 'Social Awareness', short: 'Clout-aware' },
  { key: 'cliquey', label: 'Friend-Group Loyalty', short: 'Cliquey' },
]

export const TRAIT_KEYS = TRAITS.map((t) => t.key)

export const TRAIT_BY_KEY = Object.fromEntries(TRAITS.map((t) => [t.key, t]))
